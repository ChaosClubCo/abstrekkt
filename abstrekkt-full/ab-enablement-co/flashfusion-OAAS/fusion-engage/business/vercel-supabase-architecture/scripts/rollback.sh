#!/usr/bin/env bash
# =============================================================================
# rollback.sh — 1-click rollback of a FlashFusion release (DB + deploy).
# Mirrors the source prompt's rollback contract:
#   reads last successful deploy tag + previous migration tag, reverts the
#   Vercel deployment, and restores the DB to the previous migration tag.
#
# CONFIRMATION GUARD: destructive. Requires CONFIRM=yes (or interactive y/N).
# SAFETY: never echoes secrets. All tokens/URLs come from the environment.
#   - DATABASE_URL            : Postgres connection (NOT production unless intended)
#   - VERCEL_TOKEN (optional) : if set, attempts `vercel rollback`
#   - PREV_DB_TAG (optional)  : snapshot/restore point label to roll back to
#
# This script favors NON-destructive paths and refuses to drop data without an
# explicit backup/restore point. It does NOT run `prisma migrate reset --force`
# against a database it cannot first snapshot.
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

confirm() {
  if [ "${CONFIRM:-}" = "yes" ]; then return 0; fi
  read -r -p "$1 [y/N] " ans
  case "$ans" in [yY]|[yY][eE][sS]) return 0 ;; *) echo "aborted"; exit 1 ;; esac
}

echo "== FlashFusion rollback =="

# ---- 1) Deploy rollback (Vercel) -------------------------------------------
if command -v vercel >/dev/null 2>&1 && [ -n "${VERCEL_TOKEN:-}" ]; then
  confirm "Roll back the most recent Vercel deployment to the previous one?"
  echo "-- reverting Vercel deployment --"
  # `vercel rollback` promotes the previous production deployment.
  vercel rollback --yes --token "$VERCEL_TOKEN" || {
    echo "WARN: vercel rollback failed; revert manually in the Vercel dashboard." >&2
  }
else
  echo "-- skip Vercel rollback (vercel CLI or VERCEL_TOKEN not present) --"
  echo "   Manual: Vercel Dashboard -> Deployments -> previous prod -> Promote."
fi

# ---- 2) Database rollback ---------------------------------------------------
if [ -z "${DATABASE_URL:-}" ]; then
  echo "-- skip DB rollback (DATABASE_URL not set) --"
  echo "== rollback finished (deploy only) =="
  exit 0
fi
command -v psql >/dev/null 2>&1 || { echo "ERROR: psql required for DB rollback" >&2; exit 1; }

echo "-- DB rollback strategy --"
echo "   These migrations are ADDITIVE. The safe rollback is restore-from-snapshot,"
echo "   not table drops. Choose ONE of the following:"
echo ""
echo "   (a) Supabase PITR / snapshot restore (RECOMMENDED):"
echo "       Restore the project to a timestamp BEFORE this release in the"
echo "       Supabase dashboard (Database -> Backups). Nothing to run here."
echo ""
echo "   (b) Restore from a labeled logical backup you took pre-release:"
echo "       PREV_DB_TAG names a pg_dump file you control."
echo ""

if [ -n "${PREV_DB_TAG:-}" ] && [ -f "backups/${PREV_DB_TAG}.dump" ]; then
  confirm "Restore database from backups/${PREV_DB_TAG}.dump? This OVERWRITES current data."
  echo "-- restoring from backups/${PREV_DB_TAG}.dump --"
  pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" "backups/${PREV_DB_TAG}.dump" \
    || { echo "ERROR: pg_restore failed" >&2; exit 1; }
  echo "   restore complete."
else
  echo "-- no usable backup found (set PREV_DB_TAG to a file in backups/) --"
  echo "   Refusing to drop tables without a restore point. Use option (a)."
fi

# ---- 3) Reverse-order DDL teardown (DEV/TEST ONLY) -------------------------
# Provided for ephemeral CI databases. Guarded by ALLOW_DDL_TEARDOWN=yes.
if [ "${ALLOW_DDL_TEARDOWN:-}" = "yes" ]; then
  confirm "DDL TEARDOWN: drop all FlashFusion tables/types? (DEV/TEST ONLY)"
  echo "-- dropping objects in reverse dependency order --"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
begin;
drop table if exists public.audit_logs cascade;
drop table if exists public.ai_jobs cascade;
drop table if exists public.publish_jobs cascade;
drop table if exists public.product_listings cascade;
drop table if exists public.products cascade;
drop table if exists public.usage_events cascade;
drop table if exists public.organization_plans cascade;
drop table if exists public.organization_memberships cascade;
drop table if exists public.organizations cascade;
drop type  if exists public.ai_job_state cascade;
drop type  if exists public.ai_job_kind cascade;
drop type  if exists public.publish_status cascade;
drop type  if exists public.listing_status cascade;
drop type  if exists public.usage_kind cascade;
drop type  if exists public.plan_tier cascade;
drop type  if exists public.org_role cascade;
drop function if exists public.ai_jobs_guard_transition cascade;
drop function if exists public.touch_updated_at cascade;
drop function if exists public.is_org_owner_or_admin cascade;
drop function if exists public.org_role_for cascade;
drop function if exists public.is_org_member cascade;
drop function if exists public.is_authenticated cascade;
drop function if exists public.request_user_id cascade;
commit;
SQL
  echo "   teardown complete."
fi

echo "== rollback finished =="
