-- FlashFusion AI-Native Knowledge OS Starter Schema
-- Production scaffold. Review and adapt before deployment.

create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists actors (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  actor_type text not null check (actor_type in ('human','agent','system')),
  name text not null,
  email text,
  role text,
  created_at timestamptz not null default now()
);

create table if not exists provenance_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  source_system text,
  source_uri text,
  source_record_id text,
  source_title text,
  ingested_at timestamptz not null default now(),
  transformed_by uuid references actors(id),
  confidence_score numeric(4,3) check (confidence_score >= 0 and confidence_score <= 1),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists canonical_entities (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  entity_type text not null,
  name text not null,
  description text,
  owner_id uuid references actors(id),
  status text not null default 'proposed',
  source_system text,
  source_record_id text,
  provenance_id uuid references provenance_records(id),
  confidence_score numeric(4,3) not null default 0.500 check (confidence_score >= 0 and confidence_score <= 1),
  visibility_scope text not null default 'tenant',
  lifecycle_state text not null default 'proposed',
  attributes jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists relationships (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  source_entity_id uuid not null references canonical_entities(id) on delete cascade,
  target_entity_id uuid not null references canonical_entities(id) on delete cascade,
  relationship_type text not null,
  directionality text not null default 'directed',
  confidence_score numeric(4,3) not null default 0.500 check (confidence_score >= 0 and confidence_score <= 1),
  provenance_id uuid references provenance_records(id),
  valid_from timestamptz,
  valid_to timestamptz,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint relationship_same_tenant check (tenant_id is not null)
);

create table if not exists memory_records (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  source_type text not null,
  source_uri text,
  title text not null,
  extracted_summary text,
  status text not null default 'raw',
  confidence_score numeric(4,3) not null default 0.500 check (confidence_score >= 0 and confidence_score <= 1),
  freshness_score numeric(4,3) not null default 0.500 check (freshness_score >= 0 and freshness_score <= 1),
  provenance_id uuid references provenance_records(id),
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  last_reviewed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prompt_registry (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  prompt_type text not null,
  version text not null,
  owner_id uuid references actors(id),
  status text not null default 'draft',
  intended_model text,
  scope text,
  body text not null,
  checksum text not null,
  known_failure_modes text[],
  evaluation_status text not null default 'untested',
  rollback_prompt_id uuid references prompt_registry(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agent_registry (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  role text not null,
  permission_level int not null check (permission_level >= 0 and permission_level <= 7),
  status text not null default 'active',
  policy jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists agent_runs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  agent_id uuid references agent_registry(id),
  actor_id uuid references actors(id),
  task_type text not null,
  input_summary text,
  output_summary text,
  confidence_score numeric(4,3) check (confidence_score >= 0 and confidence_score <= 1),
  status text not null default 'started',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists audit_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  actor_id uuid references actors(id),
  actor_type text not null,
  event_type text not null,
  target_type text,
  target_id uuid,
  before_state jsonb,
  after_state jsonb,
  reason text,
  confidence_score numeric(4,3) check (confidence_score >= 0 and confidence_score <= 1),
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_entities_tenant_type on canonical_entities(tenant_id, entity_type);
create index if not exists idx_relationships_source on relationships(tenant_id, source_entity_id);
create index if not exists idx_relationships_target on relationships(tenant_id, target_entity_id);
create index if not exists idx_memory_tenant_status on memory_records(tenant_id, status);
create index if not exists idx_prompt_tenant_status on prompt_registry(tenant_id, status);
create index if not exists idx_audit_tenant_event on audit_events(tenant_id, event_type);
