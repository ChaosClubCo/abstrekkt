-- ═══════════════════════════════════════════════════════════
-- 002_tenant_app_tables.sql
-- Generic tenant-scoped app tables with audit trail
-- Pattern: every table gets tenant_id + RLS + updated_at trigger
-- ═══════════════════════════════════════════════════════════

-- ── Auto-update timestamp trigger ────────────────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Audit log (append-only) ──────────────────────────────
create table public.audit_log (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id),
  user_id uuid references auth.users(id),
  action text not null,                          -- 'create', 'update', 'delete'
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

create index idx_audit_log_tenant on public.audit_log(tenant_id, created_at desc);
create index idx_audit_log_record on public.audit_log(table_name, record_id);

alter table public.audit_log enable row level security;

create policy "Users see own tenant audit log"
  on public.audit_log for select
  using (tenant_id in (select public.get_user_tenant_ids()));

-- Insert-only: no updates or deletes on audit log
create policy "System inserts audit entries"
  on public.audit_log for insert
  with check (tenant_id in (select public.get_user_tenant_ids()));

-- ── Generic audit trigger function ───────────────────────
create or replace function public.audit_trigger()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.audit_log (tenant_id, user_id, action, table_name, record_id, new_data)
    values (new.tenant_id, auth.uid(), 'create', TG_TABLE_NAME, new.id, to_jsonb(new));
    return new;
  elsif TG_OP = 'UPDATE' then
    insert into public.audit_log (tenant_id, user_id, action, table_name, record_id, old_data, new_data)
    values (new.tenant_id, auth.uid(), 'update', TG_TABLE_NAME, new.id, to_jsonb(old), to_jsonb(new));
    return new;
  elsif TG_OP = 'DELETE' then
    insert into public.audit_log (tenant_id, user_id, action, table_name, record_id, old_data)
    values (old.tenant_id, auth.uid(), 'delete', TG_TABLE_NAME, old.id, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

-- ── Example: Projects (tenant-scoped) ────────────────────
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'archived', 'deleted')),
  metadata jsonb default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_projects_tenant on public.projects(tenant_id, status);

alter table public.projects enable row level security;

create policy "Users see own tenant projects"
  on public.projects for select
  using (tenant_id in (select public.get_user_tenant_ids()));

create policy "Members can create projects"
  on public.projects for insert
  with check (public.has_tenant_role(tenant_id, 'member'));

create policy "Members can update projects"
  on public.projects for update
  using (public.has_tenant_role(tenant_id, 'member'));

create policy "Admins can delete projects"
  on public.projects for delete
  using (public.has_tenant_role(tenant_id, 'admin'));

-- Attach triggers
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger projects_audit
  after insert or update or delete on public.projects
  for each row execute function public.audit_trigger();

-- ── Example: Documents (tenant-scoped, project-scoped) ───
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  content text,
  file_path text,
  file_size bigint,
  mime_type text,
  version integer default 1,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_documents_tenant on public.documents(tenant_id);
create index idx_documents_project on public.documents(project_id) where project_id is not null;

alter table public.documents enable row level security;

create policy "Users see own tenant documents"
  on public.documents for select
  using (tenant_id in (select public.get_user_tenant_ids()));

create policy "Members can create documents"
  on public.documents for insert
  with check (public.has_tenant_role(tenant_id, 'member'));

create policy "Members can update documents"
  on public.documents for update
  using (public.has_tenant_role(tenant_id, 'member'));

create policy "Admins can delete documents"
  on public.documents for delete
  using (public.has_tenant_role(tenant_id, 'admin'));

create trigger documents_updated_at
  before update on public.documents
  for each row execute function public.handle_updated_at();

create trigger documents_audit
  after insert or update or delete on public.documents
  for each row execute function public.audit_trigger();

-- ═══════════════════════════════════════════════════════════
-- Auto-create profile on signup
-- ═══════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
