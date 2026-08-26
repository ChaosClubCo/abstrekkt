-- =============================================================================
-- 0006_rls_policies.sql
-- Row-Level Security: DENY BY DEFAULT. Only explicit ALLOW policies below.
-- Requires: 0001-0005.
--
-- ENFORCEMENT MODEL (read this before adding a policy):
--   * Every tenant table has RLS enabled. With RLS on and no matching policy,
--     the default is DENY. We never write a "deny" policy; absence IS denial.
--   * SERVER-ONLY write tables (no authenticated insert/update policy):
--       usage_events, publish_jobs, ai_jobs, audit_logs
--     These rows move money / job state. They must only be written by the
--     service role (which bypasses RLS) inside the worker/API. A client that
--     could insert here could tamper with billing or job state.
--   * If you ever add a client insert policy on ai_jobs "for convenience" you
--     reopen state/cost tampering (see CLAIMS CHECK in README). Don't.
-- =============================================================================
begin;

alter table public.organizations            enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.organization_plans       enable row level security;
alter table public.usage_events             enable row level security;
alter table public.products                 enable row level security;
alter table public.product_listings         enable row level security;
alter table public.publish_jobs             enable row level security;
alter table public.ai_jobs                  enable row level security;
alter table public.audit_logs               enable row level security;

-- Optional hardening: also force RLS for table owners so a mistaken query as the
-- owner role does not silently bypass policies. Comment out if you run admin
-- maintenance as the table owner and rely on the service role elsewhere.
alter table public.usage_events  force row level security;
alter table public.ai_jobs       force row level security;
alter table public.publish_jobs  force row level security;
alter table public.audit_logs    force row level security;

-- Organizations ---------------------------------------------------------------
drop policy if exists org_select_member on public.organizations;
create policy org_select_member on public.organizations
  for select to authenticated
  using ( public.is_org_member(id, public.request_user_id()) );

drop policy if exists org_update_owner_admin on public.organizations;
create policy org_update_owner_admin on public.organizations
  for update to authenticated
  using  (public.is_org_owner_or_admin(id, public.request_user_id()))
  with check (public.is_org_owner_or_admin(id, public.request_user_id()));

-- Memberships -----------------------------------------------------------------
drop policy if exists membership_select_org_member on public.organization_memberships;
create policy membership_select_org_member on public.organization_memberships
  for select to authenticated
  using ( public.is_org_member(organization_id, public.request_user_id()) );

drop policy if exists membership_manage_owner_admin on public.organization_memberships;
create policy membership_manage_owner_admin on public.organization_memberships
  for all to authenticated
  using  (public.is_org_owner_or_admin(organization_id, public.request_user_id()))
  with check (public.is_org_owner_or_admin(organization_id, public.request_user_id()));

-- Plans -----------------------------------------------------------------------
drop policy if exists plan_select_org_member on public.organization_plans;
create policy plan_select_org_member on public.organization_plans
  for select to authenticated
  using ( public.is_org_member(organization_id, public.request_user_id()) );

-- Only owners may manually change plan settings. Normal path is the Stripe
-- webhook running as the service role (bypasses RLS).
drop policy if exists plan_update_owner_only on public.organization_plans;
create policy plan_update_owner_only on public.organization_plans
  for update to authenticated
  using  ( public.org_role_for(organization_id, public.request_user_id()) = 'owner' )
  with check ( public.org_role_for(organization_id, public.request_user_id()) = 'owner' );

-- Usage events ----------------------------------------------------------------
-- Read only. NO insert/update policy => server-only writes.
drop policy if exists usage_select_org_member on public.usage_events;
create policy usage_select_org_member on public.usage_events
  for select to authenticated
  using ( public.is_org_member(organization_id, public.request_user_id()) );

-- Products --------------------------------------------------------------------
drop policy if exists products_select_org_member on public.products;
create policy products_select_org_member on public.products
  for select to authenticated
  using ( public.is_org_member(organization_id, public.request_user_id()) );

drop policy if exists products_insert_org_member on public.products;
create policy products_insert_org_member on public.products
  for insert to authenticated
  with check (
    public.is_org_member(organization_id, public.request_user_id())
    and created_by = public.request_user_id()
  );

drop policy if exists products_update_org_member on public.products;
create policy products_update_org_member on public.products
  for update to authenticated
  using  ( public.is_org_member(organization_id, public.request_user_id()) )
  with check ( public.is_org_member(organization_id, public.request_user_id()) );

drop policy if exists products_delete_owner_admin on public.products;
create policy products_delete_owner_admin on public.products
  for delete to authenticated
  using ( public.is_org_owner_or_admin(organization_id, public.request_user_id()) );

-- Listings --------------------------------------------------------------------
drop policy if exists listings_select_org_member on public.product_listings;
create policy listings_select_org_member on public.product_listings
  for select to authenticated
  using ( public.is_org_member(organization_id, public.request_user_id()) );

drop policy if exists listings_insert_org_member on public.product_listings;
create policy listings_insert_org_member on public.product_listings
  for insert to authenticated
  with check (
    public.is_org_member(organization_id, public.request_user_id())
    and created_by = public.request_user_id()
  );

drop policy if exists listings_update_org_member on public.product_listings;
create policy listings_update_org_member on public.product_listings
  for update to authenticated
  using  ( public.is_org_member(organization_id, public.request_user_id()) )
  with check ( public.is_org_member(organization_id, public.request_user_id()) );

drop policy if exists listings_delete_owner_admin on public.product_listings;
create policy listings_delete_owner_admin on public.product_listings
  for delete to authenticated
  using ( public.is_org_owner_or_admin(organization_id, public.request_user_id()) );

-- Publish jobs ----------------------------------------------------------------
-- Read only for members. Insert/update server-side (enforce plan.can_publish in
-- the server function before creating the job).
drop policy if exists publish_select_org_member on public.publish_jobs;
create policy publish_select_org_member on public.publish_jobs
  for select to authenticated
  using ( public.is_org_member(organization_id, public.request_user_id()) );

-- AI jobs ---------------------------------------------------------------------
-- Read only for members. Insert/update server-side ONLY (prevents client
-- tampering with state / cost columns).
drop policy if exists ai_jobs_select_org_member on public.ai_jobs;
create policy ai_jobs_select_org_member on public.ai_jobs
  for select to authenticated
  using ( public.is_org_member(organization_id, public.request_user_id()) );

-- Audit logs ------------------------------------------------------------------
-- Read only for owners/admins (audit is sensitive). Writes are server/trigger
-- only. No insert/update/delete policy for authenticated => append-only by
-- service role and the ai_jobs_guard trigger.
drop policy if exists audit_select_owner_admin on public.audit_logs;
create policy audit_select_owner_admin on public.audit_logs
  for select to authenticated
  using ( public.is_org_owner_or_admin(organization_id, public.request_user_id()) );

commit;
