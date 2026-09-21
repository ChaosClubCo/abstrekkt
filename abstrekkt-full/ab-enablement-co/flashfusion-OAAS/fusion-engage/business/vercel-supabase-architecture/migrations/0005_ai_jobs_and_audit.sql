-- =============================================================================
-- 0005_ai_jobs_and_audit.sql
-- AI job orchestration table + state-transition guard + audit log.
-- Requires: 0001, 0002, 0003, 0004.
--
-- RECONSTRUCTION NOTE: the source chat listed `audit_logs` in the data model
-- ("If it affects money, permissions, or AI output—it lives in Postgres") and
-- specified audit_policy.log_every_transition=true in the AI job contract, but
-- never materialized the table or the guard. Both are added here so the
-- contract is enforceable in the database, not just in application code.
-- =============================================================================
begin;

-- AI job state + kind enums ---------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'ai_job_state') then
    create type public.ai_job_state as enum (
      'queued','validating','reserved','running','streaming',
      'succeeded','failed','canceled','expired'
    );
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'ai_job_kind') then
    create type public.ai_job_kind as enum (
      'product_enrich','listing_generate','listing_optimize',
      'publish_prepare','validator_run'
    );
  end if;
end$$;

create table if not exists public.ai_jobs (
  id                     uuid primary key default gen_random_uuid(),
  organization_id        uuid not null references public.organizations(id) on delete cascade,
  created_by             uuid not null,
  kind                   public.ai_job_kind not null,
  state                  public.ai_job_state not null default 'queued',
  priority               int not null default 100,
  attempt                int not null default 0,
  max_attempts           int not null default 2,
  next_retry_at          timestamptz null,
  locked_by              text null,
  locked_at              timestamptz null,
  started_at             timestamptz null,
  completed_at           timestamptz null,
  input                  jsonb not null default '{}'::jsonb,
  output                 jsonb not null default '{}'::jsonb,
  error                  jsonb not null default '{}'::jsonb,
  tokens_in              int not null default 0,
  tokens_out             int not null default 0,
  estimated_cost_credits int not null default 0,
  reserved_cost_credits  int not null default 0,
  final_cost_credits     int not null default 0,
  idempotency_key        text not null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

drop trigger if exists trg_ai_jobs_touch on public.ai_jobs;
create trigger trg_ai_jobs_touch
  before update on public.ai_jobs
  for each row execute function public.touch_updated_at();

-- Pickup index matches the contract pickup_query: order by retry window,
-- priority, then FIFO. Partial would be ideal but state list changes; keep full.
create index if not exists idx_ai_jobs_pickup on public.ai_jobs(state, next_retry_at, priority, created_at);
create index if not exists idx_ai_jobs_org    on public.ai_jobs(organization_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Audit log (append-only). One row per state transition + per finalize.
-- -----------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id               bigint generated always as identity primary key,
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  actor            text not null default 'system',   -- 'system' | user uuid | 'worker:<id>'
  ref_type         text not null,                    -- 'ai_job' | 'publish_job' | ...
  ref_id           uuid not null,
  event            text not null,                    -- 'transition' | 'finalize' | 'lock' | ...
  from_state       text null,
  to_state         text null,
  detail           jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists idx_audit_org_created on public.audit_logs(organization_id, created_at desc);
create index if not exists idx_audit_ref         on public.audit_logs(ref_type, ref_id);

-- -----------------------------------------------------------------------------
-- DB-level state-transition guard for ai_jobs.
-- Mirrors contracts/ai-job-contract.json allowed_transitions. Even if the
-- worker has a bug, the database refuses an illegal transition (e.g.
-- succeeded -> running). Terminal states (succeeded/canceled/expired) are
-- immutable except for bookkeeping columns; 'failed' may go back to 'queued'
-- for retry. The guard also writes an audit row on every state change.
-- -----------------------------------------------------------------------------
create or replace function public.ai_jobs_guard_transition()
returns trigger
language plpgsql
as $$
declare
  ok boolean;
begin
  if new.state = old.state then
    return new;  -- no transition; allow column-only updates (tokens, locks, etc.)
  end if;

  ok := case old.state
    when 'queued'     then new.state in ('validating','canceled','expired')
    when 'validating' then new.state in ('reserved','failed','canceled','expired')
    when 'reserved'   then new.state in ('running','failed','canceled','expired')
    when 'running'    then new.state in ('streaming','succeeded','failed','canceled','expired')
    when 'streaming'  then new.state in ('succeeded','failed','canceled','expired')
    when 'failed'     then new.state in ('queued')          -- retry path only
    when 'succeeded'  then false
    when 'canceled'   then false
    when 'expired'    then false
    else false
  end;

  if not ok then
    raise exception 'illegal ai_job transition % -> % (job %)', old.state, new.state, old.id
      using errcode = 'check_violation';
  end if;

  insert into public.audit_logs(organization_id, actor, ref_type, ref_id, event, from_state, to_state, detail)
  values (
    new.organization_id,
    coalesce(new.locked_by, 'system'),
    'ai_job',
    new.id,
    'transition',
    old.state::text,
    new.state::text,
    jsonb_build_object('attempt', new.attempt, 'next_retry_at', new.next_retry_at)
  );

  return new;
end;
$$;

drop trigger if exists trg_ai_jobs_guard on public.ai_jobs;
create trigger trg_ai_jobs_guard
  before update of state on public.ai_jobs
  for each row execute function public.ai_jobs_guard_transition();

commit;
