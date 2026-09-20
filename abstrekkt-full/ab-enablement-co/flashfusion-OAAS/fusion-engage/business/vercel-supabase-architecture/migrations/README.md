# FlashFusion Migrations

Ordered, idempotent SQL migrations for the multi-tenant core. Apply **in numeric
order**. Each file is wrapped in a single `begin; ... commit;` transaction and is
safe to re-run (guards on `create type`, `create ... if not exists`,
`create or replace`, `drop policy if exists`).

| # | File | What it adds |
|---|------|--------------|
| 0001 | `0001_extensions_and_helpers.sql` | `pgcrypto`, `org_role` enum, RLS helper functions, `touch_updated_at()` |
| 0002 | `0002_organizations_and_memberships.sql` | `organizations`, `organization_memberships` |
| 0003 | `0003_plans_and_usage.sql` | `plan_tier`/`usage_kind` enums, `organization_plans`, `usage_events` |
| 0004 | `0004_vertical_products_listings_publish.sql` | `products`, `product_listings`, `publish_jobs` (+ enums) |
| 0005 | `0005_ai_jobs_and_audit.sql` | `ai_jobs` (+ enums), `audit_logs`, DB-level transition guard |
| 0006 | `0006_rls_policies.sql` | Enable RLS + all deny-by-default ALLOW policies |

## Apply (psql)

```bash
# DATABASE_URL must point at the Postgres connection (service-role / migration
# role, NOT the anon role). NEVER commit this value — read it from the env.
export DATABASE_URL="postgresql://...";   # from .env, do not paste literally

for f in migrations/0001_*.sql \
         migrations/0002_*.sql \
         migrations/0003_*.sql \
         migrations/0004_*.sql \
         migrations/0005_*.sql \
         migrations/0006_*.sql; do
  echo ">> applying $f"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f" || { echo "FAILED at $f"; exit 1; }
done
```

## Apply (Supabase SQL Editor)

Paste each file's contents in order and run. The SQL editor runs as a privileged
role, so RLS will not block the DDL.

## Apply (Supabase CLI)

Copy these files into `supabase/migrations/` using the CLI's timestamp naming
(`<timestamp>_<name>.sql`) preserving order, then:

```bash
supabase db push
```

## Rollback

These migrations are additive. To unwind in a non-production environment, run the
matching `drop` statements in **reverse** order (0006 -> 0001), or use
`scripts/rollback.sh` which restores from a pre-migration tag/snapshot. Do not
hand-drop tables in production without a backup; see `../scripts/rollback.sh`.

## Verifying RLS after apply

Run the checks in `../docs/RLS-TESTS.md`. The one-line gate:

```sql
-- Every tenant table must report rowsecurity = true
select relname, relrowsecurity
from pg_class
where relname in ('organizations','organization_memberships','organization_plans',
                  'usage_events','products','product_listings','publish_jobs',
                  'ai_jobs','audit_logs')
order by relname;
```
