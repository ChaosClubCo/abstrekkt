-- =============================================================================
-- seed.sql — bootstrap one org + plan + owner membership, and a demo product.
-- Run ONCE, with a service role (Supabase SQL editor is privileged enough).
-- Idempotent: re-running will not duplicate rows.
--
-- SAFETY: there are NO secrets in this file. The owner user id is a placeholder
-- you MUST replace with a real auth.users id (Supabase Dashboard -> Auth ->
-- Users -> copy the UUID). Do not hardcode production user ids into version
-- control if your repo is shared; pass it via psql -v instead (see bottom).
-- =============================================================================
begin;

-- 1) Organization -------------------------------------------------------------
insert into public.organizations (slug, name)
values ('flashfusion', 'FlashFusion')
on conflict (slug) do nothing;

-- 2) Plan (generous "pro" defaults for the bootstrap org) ----------------------
insert into public.organization_plans
  (organization_id, tier, monthly_credits, max_projects, max_integrations, can_publish, can_embed)
select o.id, 'pro', 200000, 50, 10, true, true
from public.organizations o
where o.slug = 'flashfusion'
on conflict (organization_id) do nothing;

-- 3) Owner membership ---------------------------------------------------------
-- Replace the placeholder UUID with your real auth user id, OR pass it via:
--   psql "$DATABASE_URL" -v owner_id="'<uuid>'" -f seed.sql
-- and change the literal below to :owner_id .
insert into public.organization_memberships (organization_id, user_id, role)
select o.id, '00000000-0000-0000-0000-000000000000'::uuid, 'owner'
from public.organizations o
where o.slug = 'flashfusion'
on conflict (organization_id, user_id) do nothing;

-- 4) Demo product (lets the smoke test exercise the vertical) ------------------
insert into public.products (organization_id, created_by, name, description, brand_voice)
select o.id,
       '00000000-0000-0000-0000-000000000000'::uuid,
       'Demo Product',
       'A seeded product used by scripts/smoke.sh to exercise the vertical.',
       'default'
from public.organizations o
where o.slug = 'flashfusion'
  and not exists (
    select 1 from public.products p
    where p.organization_id = o.id and p.name = 'Demo Product'
  );

commit;

-- Quick verification (read-only):
--   select slug, name from public.organizations;
--   select tier, monthly_credits from public.organization_plans;
--   select role from public.organization_memberships;
