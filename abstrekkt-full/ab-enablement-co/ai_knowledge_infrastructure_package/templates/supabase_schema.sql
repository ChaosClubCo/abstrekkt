-- AI Knowledge Infrastructure MVP Schema
-- Target: Supabase Postgres with RLS enabled after role design.

create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists asset_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null,
  root_uri text not null,
  owner_id uuid,
  sensitivity text not null default 'internal',
  scan_priority int not null default 3,
  created_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text unique not null,
  source_id uuid references asset_sources(id),
  title text not null,
  asset_type text not null,
  storage_uri text not null,
  checksum text,
  status text not null default 'unreviewed',
  sensitivity text not null default 'internal',
  summary text,
  quality_score int check (quality_score between 1 and 5),
  reuse_score int check (reuse_score between 1 and 5),
  revenue_potential int check (revenue_potential between 1 and 5),
  delivery_potential int check (delivery_potential between 1 and 5),
  product_potential int check (product_potential between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists asset_metadata (
  asset_id uuid primary key references assets(id) on delete cascade,
  business_layer text,
  platform_modules text[] not null default '{}',
  audience text,
  industry text,
  department text,
  client_use_case text,
  toolchain text[] not null default '{}',
  dependencies text[] not null default '{}',
  risks text[] not null default '{}',
  next_action text,
  confidence numeric(4,3),
  evidence_excerpt text,
  review_status text not null default 'not_reviewed'
);

create table if not exists asset_relationships (
  id uuid primary key default gen_random_uuid(),
  from_asset_id uuid not null references assets(id) on delete cascade,
  to_asset_id uuid not null references assets(id) on delete cascade,
  relationship_type text not null,
  confidence numeric(4,3) not null default 0.500,
  evidence text,
  review_status text not null default 'not_reviewed',
  created_at timestamptz not null default now(),
  unique (from_asset_id, to_asset_id, relationship_type)
);

create table if not exists provenance_events (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  event_type text not null,
  actor_type text not null,
  actor_id text,
  tool_name text,
  tool_version text,
  prompt_hash text,
  source_asset_ids uuid[] not null default '{}',
  event_notes text,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create table if not exists asset_chunks (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  chunk_index int not null,
  chunk_text text not null,
  token_estimate int,
  created_at timestamptz not null default now(),
  unique(asset_id, chunk_index)
);

create table if not exists asset_embeddings (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  chunk_id uuid references asset_chunks(id) on delete cascade,
  embedding_model text not null,
  embedding vector(1536),
  checksum_at_embedding text,
  created_at timestamptz not null default now()
);

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists agent_permissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  allowed_business_layers text[] not null default '{}',
  allowed_sensitivity_levels text[] not null default '{public,internal}',
  allowed_actions text[] not null default '{read,search,summarize,recommend,draft}',
  blocked_actions text[] not null default '{delete,exfiltrate,send,mutate_without_approval}',
  created_at timestamptz not null default now()
);

create table if not exists review_queue (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  reason text not null,
  priority int not null default 3,
  assigned_to uuid,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_name text not null,
  run_type text not null,
  status text not null,
  input_summary text,
  output_summary text,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_assets_type on assets(asset_type);
create index if not exists idx_assets_status on assets(status);
create index if not exists idx_assets_sensitivity on assets(sensitivity);
create index if not exists idx_asset_metadata_layer on asset_metadata(business_layer);
create index if not exists idx_asset_relationships_from on asset_relationships(from_asset_id);
create index if not exists idx_asset_relationships_to on asset_relationships(to_asset_id);
create index if not exists idx_provenance_asset on provenance_events(asset_id);

-- Enable RLS after policies are adapted to the authenticated app roles.
alter table assets enable row level security;
alter table asset_metadata enable row level security;
alter table asset_relationships enable row level security;
alter table provenance_events enable row level security;