-- =============================================================================
-- 0001_extensions_and_helpers.sql
-- FlashFusion multi-tenant core — extensions + RLS helper functions
-- -----------------------------------------------------------------------------
-- Apply order: 0001 -> 0002 -> 0003 -> 0004 -> 0005 -> 0006
-- Idempotent: safe to re-run (create ... if not exists / create or replace).
-- Run as the migration role (NOT anon). In Supabase, the SQL editor / service
-- role is privileged enough.
--
-- DESIGN NOTE (carried from source chat, expanded):
--   We deliberately DO NOT trust a mutable "active org" session variable for
--   tenant isolation. Access is derived from membership rows + explicit
--   organization_id filters. A session-var "active org" can be spoofed by a
--   client and would reopen cross-tenant reads. See docs/RLS-TESTS.md.
-- =============================================================================
begin;

-- Extensions ------------------------------------------------------------------
create extension if not exists pgcrypto;     -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- Enum: membership roles. Defined here (before the helper functions reference
-- public.org_role in their signatures). 0002 reuses this type for the
-- organization_memberships.role column.
--   owner            : full control + billing
--   admin            : manage content + integrations
--   member           : create/generate/publish within plan
--   embedded_customer: external end-user under an owner (future embed feature)
-- CREATE TYPE has no "if not exists"; guard it so re-runs do not error.
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'org_role') then
    create type public.org_role as enum ('owner','admin','member','embedded_customer');
  end if;
end$$;

-- -----------------------------------------------------------------------------
-- Helper: current authenticated user id (Supabase auth.uid()).
-- STABLE so the planner can cache it within a statement.
-- -----------------------------------------------------------------------------
create or replace function public.request_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

create or replace function public.is_authenticated()
returns boolean
language sql
stable
as $$
  select public.request_user_id() is not null
$$;

-- -----------------------------------------------------------------------------
-- Membership predicates. These are the spine of every RLS policy.
-- They are SECURITY INVOKER (default): they run with the caller's rights, but
-- only read membership rows, which are themselves RLS-guarded. Because the
-- functions are referenced *inside* policies, Postgres evaluates them without
-- recursive RLS on organization_memberships within the policy context.
-- -----------------------------------------------------------------------------
create or replace function public.is_org_member(p_org uuid, p_user uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_memberships m
    where m.organization_id = p_org
      and m.user_id = p_user
  )
$$;

create or replace function public.org_role_for(p_org uuid, p_user uuid)
returns public.org_role
language sql
stable
as $$
  select m.role
  from public.organization_memberships m
  where m.organization_id = p_org
    and m.user_id = p_user
  limit 1
$$;

create or replace function public.is_org_owner_or_admin(p_org uuid, p_user uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_memberships m
    where m.organization_id = p_org
      and m.user_id = p_user
      and m.role in ('owner','admin')
  )
$$;

-- -----------------------------------------------------------------------------
-- Generic updated_at trigger function (used by every mutable table).
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

commit;
