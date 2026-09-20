-- =============================================================================
-- 0003_plans_and_usage.sql
-- Entitlements (organization_plans) + credit metering (usage_events).
-- Requires: 0001, 0002.
--
-- BILLING SAFETY (enforced in docs + worker, reinforced by RLS in 0006):
--   usage_events is SERVER-ONLY for writes. There is intentionally NO insert
--   policy for the `authenticated` role. Credits are reserved and finalized by
--   the worker/API using the service role. A client that could insert here
--   could fabricate refunds or zero-cost usage -> credit-drain exploit.
-- =============================================================================
begin;

-- Plan tiers ------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'plan_tier') then
    create type public.plan_tier as enum ('free','starter','pro','business','enterprise');
  end if;
end$$;

create table if not exists public.organization_plans (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references public.organizations(id) on delete cascade,
  tier              public.plan_tier not null default 'free',
  monthly_credits   int  not null default 2000,
  max_projects      int  not null default 3,
  max_integrations  int  not null default 1,
  can_publish       boolean not null default false,
  can_embed         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (organization_id)
);

drop trigger if exists trg_org_plans_touch on public.organization_plans;
create trigger trg_org_plans_touch
  before update on public.organization_plans
  for each row execute function public.touch_updated_at();

-- Usage metering --------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'usage_kind') then
    create type public.usage_kind as enum ('ai_tokens','ai_images','publish','export','embed_session');
  end if;
end$$;

create table if not exists public.usage_events (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  user_id             uuid not null,
  kind                public.usage_kind not null,
  quantity            int not null check (quantity >= 0),
  unit_cost_credits   int not null default 0 check (unit_cost_credits >= 0),
  total_cost_credits  int not null default 0 check (total_cost_credits >= 0),
  ref_type            text not null,          -- e.g. 'ai_job','publish'
  ref_id              uuid not null,
  -- Idempotency is the billing correctness guarantee. A reservation and its
  -- finalize/refund use DISTINCT keys (e.g. "<job>:reserve", "<job>:finalize")
  -- so a retried finalize cannot double-charge.
  idempotency_key     text not null,
  created_at          timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create index if not exists idx_usage_org_created on public.usage_events(organization_id, created_at desc);
create index if not exists idx_usage_ref         on public.usage_events(ref_type, ref_id);

commit;
