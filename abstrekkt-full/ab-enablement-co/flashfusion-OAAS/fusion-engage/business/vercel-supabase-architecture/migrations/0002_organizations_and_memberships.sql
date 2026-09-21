-- =============================================================================
-- 0002_organizations_and_memberships.sql
-- Tenancy root: organizations + memberships.
-- Requires: 0001 (pgcrypto, org_role enum, helper functions).
-- =============================================================================
begin;

create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.organization_memberships (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  -- user_id references auth.users(id) logically. We do NOT add a cross-schema FK:
  -- FKs into auth.* are fragile across Supabase upgrades and block user deletion
  -- ordering. Integrity is maintained by the membership-management RLS policy
  -- plus the seed/admin path that creates rows.
  user_id          uuid not null,
  role             public.org_role not null default 'member',
  created_at       timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists idx_org_memberships_org  on public.organization_memberships(organization_id);
create index if not exists idx_org_memberships_user on public.organization_memberships(user_id);

commit;
