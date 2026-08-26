-- ═══════════════════════════════════════════════════════════
-- 001_multi_tenant_foundation.sql
-- Multi-tenant schema for INT OS: per-client isolation
-- Each Intinc client gets tenant-level RLS on all tables
-- ═══════════════════════════════════════════════════════════

-- ── Tenants ──────────────────────────────────────────────
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  domain text unique,                          -- custom domain per client
  settings jsonb default '{}',                 -- client-specific config
  mcp_endpoint text,                           -- per-client MCP server URL
  aws_server_id text,                          -- per-client AWS server ref
  plan text not null default 'standard' check (plan in ('standard', 'professional', 'enterprise')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_tenants_slug on public.tenants(slug);
create index idx_tenants_domain on public.tenants(domain) where domain is not null;

-- ── Tenant Members ───────────────────────────────────────
create type public.tenant_role as enum ('owner', 'admin', 'member', 'viewer');

create table public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role tenant_role not null default 'member',
  invited_by uuid references auth.users(id),
  accepted_at timestamptz,
  created_at timestamptz default now(),
  unique(tenant_id, user_id)
);

create index idx_tenant_members_user on public.tenant_members(user_id);
create index idx_tenant_members_tenant on public.tenant_members(tenant_id);

-- ── User Profiles ────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  default_tenant_id uuid references public.tenants(id),
  preferences jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Helper: Get user's tenant IDs ────────────────────────
create or replace function public.get_user_tenant_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select tenant_id
  from public.tenant_members
  where user_id = auth.uid()
    and accepted_at is not null;
$$;

-- ── Helper: Check user role in tenant ────────────────────
create or replace function public.has_tenant_role(
  _tenant_id uuid,
  _min_role tenant_role
)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.tenant_members
    where tenant_id = _tenant_id
      and user_id = auth.uid()
      and accepted_at is not null
      and role <= _min_role  -- enum ordering: owner < admin < member < viewer
  );
$$;

-- ── Helper: Get current tenant from JWT or header ────────
create or replace function public.current_tenant_id()
returns uuid
language sql
stable
as $$
  select coalesce(
    -- Try JWT claim first (set during auth)
    (current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id')::uuid,
    -- Fallback to custom header
    (current_setting('request.headers', true)::jsonb ->> 'x-tenant-id')::uuid
  );
$$;

-- ═══════════════════════════════════════════════════════════
-- RLS POLICIES — Tenant Isolation
-- ═══════════════════════════════════════════════════════════

alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;
alter table public.profiles enable row level security;

-- Tenants: users see only their tenants
create policy "Users see own tenants"
  on public.tenants for select
  using (id in (select public.get_user_tenant_ids()));

create policy "Owners can update tenant"
  on public.tenants for update
  using (public.has_tenant_role(id, 'owner'));

-- Tenant members: see members of your tenants
create policy "See members of own tenants"
  on public.tenant_members for select
  using (tenant_id in (select public.get_user_tenant_ids()));

create policy "Admins can invite members"
  on public.tenant_members for insert
  with check (public.has_tenant_role(tenant_id, 'admin'));

create policy "Admins can update member roles"
  on public.tenant_members for update
  using (public.has_tenant_role(tenant_id, 'admin'));

create policy "Admins can remove members"
  on public.tenant_members for delete
  using (public.has_tenant_role(tenant_id, 'admin'));

-- Profiles: users see/edit own profile
create policy "Users see own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "System creates profile on signup"
  on public.profiles for insert
  with check (id = auth.uid());
