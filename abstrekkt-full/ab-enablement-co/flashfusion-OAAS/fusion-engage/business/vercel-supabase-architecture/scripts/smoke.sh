#!/usr/bin/env bash
# =============================================================================
# smoke.sh — fast, fail-fast verification of the FlashFusion data layer.
# Exits nonzero on the first failure (per the source prompt's smoke contract).
#
# Two modes:
#   1) DB mode (DATABASE_URL set): applies migrations to a throwaway/CI DB,
#      seeds, and runs the structural RLS gate + transition-guard checks.
#   2) Offline mode (no DATABASE_URL): runs the executor state-machine self-test
#      (worker/executor.selftest.ts) which needs no database.
#
# SAFETY: never prints secrets. DATABASE_URL is read from the environment only.
# Do NOT point DATABASE_URL at production — this script applies DDL and seeds.
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

fail() { echo "SMOKE FAIL: $*" >&2; exit 1; }
ok()   { echo "  ok: $*"; }

echo "== FlashFusion smoke =="

# ---- Static checks (always run) --------------------------------------------
echo "-- static --"
for f in migrations/0001_extensions_and_helpers.sql \
         migrations/0002_organizations_and_memberships.sql \
         migrations/0003_plans_and_usage.sql \
         migrations/0004_vertical_products_listings_publish.sql \
         migrations/0005_ai_jobs_and_audit.sql \
         migrations/0006_rls_policies.sql \
         contracts/ai-job-contract.json \
         worker/executor.ts \
         seed.sql; do
  [ -f "$f" ] || fail "missing required file: $f"
  ok "present: $f"
done

# Contract JSON must parse.
if command -v node >/dev/null 2>&1; then
  node -e "JSON.parse(require('fs').readFileSync('contracts/ai-job-contract.json','utf8'))" \
    || fail "ai-job-contract.json is not valid JSON"
  ok "contract JSON parses"
fi

# ---- Offline executor self-test --------------------------------------------
if [ -z "${DATABASE_URL:-}" ]; then
  echo "-- offline (no DATABASE_URL): executor self-test --"
  if command -v npx >/dev/null 2>&1; then
    npx --yes tsx worker/executor.selftest.ts || fail "executor self-test failed"
    ok "executor state-machine self-test passed"
  else
    echo "  skip: npx/tsx unavailable; static checks only"
  fi
  echo "SMOKE OK (offline mode)"
  exit 0
fi

# ---- DB mode ----------------------------------------------------------------
command -v psql >/dev/null 2>&1 || fail "psql not found but DATABASE_URL is set"
echo "-- db: applying migrations --"
for f in migrations/000{1,2,3,4,5,6}_*.sql; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$f" || fail "migration failed: $f"
  ok "applied: $f"
done

echo "-- db: structural RLS gate --"
BAD=$(psql "$DATABASE_URL" -t -A -c "
  select count(*) from pg_class
   where relname in ('organizations','organization_memberships','organization_plans',
                     'usage_events','products','product_listings','publish_jobs',
                     'ai_jobs','audit_logs')
     and relrowsecurity = false;")
[ "$BAD" = "0" ] || fail "RLS not enabled on $BAD tenant table(s)"
ok "RLS enabled on all tenant tables"

echo "-- db: transition guard --"
# Insert a succeeded job (service role / direct) then attempt illegal transition.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "
  insert into public.organizations(slug,name) values('smoke','smoke')
    on conflict (slug) do nothing;" || fail "seed org failed"

GUARD=$(psql "$DATABASE_URL" -t -A -c "
  do \$\$
  declare jid uuid; org uuid;
  begin
    select id into org from public.organizations where slug='smoke';
    insert into public.ai_jobs(organization_id,created_by,kind,state,idempotency_key)
      values(org,gen_random_uuid(),'listing_generate','succeeded','smoke-guard')
      on conflict (organization_id,idempotency_key) do nothing
      returning id into jid;
    if jid is null then select id into jid from public.ai_jobs
      where organization_id=org and idempotency_key='smoke-guard'; end if;
    begin
      update public.ai_jobs set state='running' where id=jid;
      raise notice 'GUARD_FAILED';
    exception when others then
      raise notice 'GUARD_OK';
    end;
  end \$\$;" 2>&1 || true)
echo "$GUARD" | grep -q "GUARD_OK" || fail "transition guard did not block succeeded->running"
ok "transition guard blocks illegal transition"

echo "SMOKE OK (db mode)"
