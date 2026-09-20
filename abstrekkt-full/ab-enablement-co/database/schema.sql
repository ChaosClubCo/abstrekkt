-- FlashFusion canonical schema
-- Generated 2026-06-21

create extension if not exists "uuid-ossp";
create extension if not exists vector;

create type evidence_status as enum ('VERIFIED', 'INFERRED', 'ASSUMED');
create type review_status as enum ('draft', 'needs_evidence', 'approved', 'rejected', 'archived');
create type sensitivity_level as enum ('public', 'internal', 'client_confidential', 'restricted');
create type engagement_type as enum ('proof_of_value', 'paid_audit', 'workshop', 'implementation', 'retainer');

create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key,
  organization_id uuid references organizations(id) on delete set null,
  email text unique not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table roles (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text not null
);

create table permissions (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  description text not null
);

create table role_permissions (
  role_id uuid references roles(id) on delete cascade,
  permission_id uuid references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table organization_memberships (
  organization_id uuid references organizations(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  role_name text not null references roles(name),
  primary key (organization_id, profile_id)
);

create table leads (
  id uuid primary key default uuid_generate_v4(),
  organization_name text not null,
  contact_name text not null,
  email text not null,
  primary_pain text not null,
  budget_range text not null,
  urgency text not null,
  fit_score int not null default 0,
  evidence_status evidence_status not null default 'ASSUMED',
  created_at timestamptz not null default now()
);

create table engagements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  type engagement_type not null,
  name text not null,
  price_usd int not null check (price_usd >= 0),
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  constraint paid_audit_floor check (type <> 'paid_audit' or price_usd >= 4500),
  constraint pov_free check (type <> 'proof_of_value' or price_usd = 0)
);

create table source_documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  title text not null,
  storage_provider text not null,
  storage_uri text not null,
  sha256 text,
  sensitivity sensitivity_level not null default 'internal',
  review_status review_status not null default 'draft',
  provenance jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table memory_chunks (
  id uuid primary key default uuid_generate_v4(),
  source_document_id uuid not null references source_documents(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  chunk_text text not null,
  summary text,
  embedding vector(1536),
  evidence_status evidence_status not null default 'INFERRED',
  sensitivity sensitivity_level not null default 'internal',
  approved_for_agent_use boolean not null default false,
  created_at timestamptz not null default now()
);

create table relationship_edges (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  from_entity text not null,
  to_entity text not null,
  relationship text not null,
  evidence_status evidence_status not null default 'INFERRED',
  source_document_id uuid references source_documents(id) on delete set null,
  created_at timestamptz not null default now()
);

create table prompt_templates (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  title text not null,
  version text not null,
  body text not null,
  policy jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table agent_runs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  agent_key text not null,
  task_type text not null,
  input jsonb not null,
  output jsonb,
  model_used text,
  cost_usd numeric(10,4) not null default 0,
  confidence numeric(4,3),
  requires_human_review boolean not null default true,
  created_at timestamptz not null default now()
);

create table generated_artifacts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  engagement_id uuid references engagements(id) on delete cascade,
  title text not null,
  artifact_type text not null,
  body_md text not null,
  review_status review_status not null default 'draft',
  evidence_status evidence_status not null default 'INFERRED',
  agent_run_id uuid references agent_runs(id) on delete set null,
  created_at timestamptz not null default now()
);

create table audit_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete set null,
  actor_profile_id uuid references profiles(id) on delete set null,
  actor_type text not null check (actor_type in ('user','agent','system')),
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table organization_memberships enable row level security;
alter table leads enable row level security;
alter table engagements enable row level security;
alter table source_documents enable row level security;
alter table memory_chunks enable row level security;
alter table relationship_edges enable row level security;
alter table agent_runs enable row level security;
alter table generated_artifacts enable row level security;
alter table audit_events enable row level security;

create or replace function is_org_member(org_id uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from organization_memberships om
    where om.organization_id = org_id and om.profile_id = auth.uid()
  );
$$;

create policy org_select on organizations for select using (is_org_member(id));
create policy profile_self on profiles for select using (id = auth.uid() or is_org_member(organization_id));
create policy member_select on organization_memberships for select using (profile_id = auth.uid() or is_org_member(organization_id));
create policy engagement_org_select on engagements for select using (is_org_member(organization_id));
create policy source_org_select on source_documents for select using (is_org_member(organization_id));
create policy chunks_org_select on memory_chunks for select using (is_org_member(organization_id) and approved_for_agent_use = true);
create policy edges_org_select on relationship_edges for select using (is_org_member(organization_id));
create policy agent_org_select on agent_runs for select using (is_org_member(organization_id));
create policy artifacts_org_select on generated_artifacts for select using (is_org_member(organization_id));
create policy audit_org_select on audit_events for select using (organization_id is null or is_org_member(organization_id));
