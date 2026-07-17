-- NotebookLM Knowledge Pipeline Supabase Schema
-- Review before production. Enable RLS before exposing to users or agents.

create extension if not exists pgcrypto;

create table if not exists public.knowledge_assets (
  id uuid primary key default gen_random_uuid(),
  asset_id text unique not null,
  filename text not null,
  source_type text not null,
  lane text not null,
  status text not null,
  sha256 text,
  size_bytes bigint,
  topic_cluster text,
  provenance_parent_id text,
  storage_uri text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  notes text
);

create table if not exists public.knowledge_concepts (
  id uuid primary key default gen_random_uuid(),
  concept_id text unique not null,
  canonical_name text not null,
  aliases text[] default '{}',
  definition text not null,
  concept_type text not null,
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  review_status text not null default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.knowledge_relationships (
  id uuid primary key default gen_random_uuid(),
  relationship_id text unique not null,
  source_concept_id text not null references public.knowledge_concepts(concept_id),
  predicate text not null,
  target_concept_id text not null references public.knowledge_concepts(concept_id),
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.provenance_records (
  id uuid primary key default gen_random_uuid(),
  provenance_id text unique not null,
  asset_id text not null references public.knowledge_assets(asset_id),
  claim text not null,
  page integer,
  timestamp_start text,
  timestamp_end text,
  section text,
  evidence_excerpt text,
  evidence_type text not null,
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  review_status text not null default 'needs_human_review',
  created_at timestamptz default now()
);

create table if not exists public.derived_artifacts (
  id uuid primary key default gen_random_uuid(),
  artifact_id text unique not null,
  parent_asset_id text not null references public.knowledge_assets(asset_id),
  artifact_type text not null,
  filename text not null,
  storage_uri text,
  qa_status text not null default 'pending',
  created_at timestamptz default now()
);

alter table public.knowledge_assets enable row level security;
alter table public.knowledge_concepts enable row level security;
alter table public.knowledge_relationships enable row level security;
alter table public.provenance_records enable row level security;
alter table public.derived_artifacts enable row level security;

-- Service-role-only policy template. Replace app.role checks with your production auth model.
create policy "service_role_all_assets" on public.knowledge_assets for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service_role_all_concepts" on public.knowledge_concepts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service_role_all_relationships" on public.knowledge_relationships for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service_role_all_provenance" on public.provenance_records for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service_role_all_artifacts" on public.derived_artifacts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
