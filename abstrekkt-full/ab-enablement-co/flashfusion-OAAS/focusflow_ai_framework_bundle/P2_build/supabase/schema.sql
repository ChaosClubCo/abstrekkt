create extension if not exists pgcrypto;
create table if not exists public.dedupe_keys (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  purpose text not null,
  actor uuid null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create unique index if not exists dedupe_keys_key_purpose_uidx on public.dedupe_keys (key, purpose);

create table if not exists public.usage_counters (
  user_id uuid not null,
  day date not null default current_date,
  op text not null,
  count int not null default 0,
  primary key (user_id, day, op)
);

do $$ begin
  if not exists (select 1 from pg_type where typname = 'plan_tier') then
    create type plan_tier as enum ('free', 'pro', 'team');
  end if;
end $$;

create table if not exists public.user_entitlements (
  user_id uuid primary key,
  plan plan_tier not null default 'free',
  ai_daily_quota int not null default 25,
  updated_at timestamptz not null default now()
);

create or replace function public.increment_usage(p_user uuid, p_op text, p_amount int default 1, p_dedupe_key text default null)
returns void language plpgsql as $$
declare v_today date := current_date; begin
  if p_dedupe_key is not null then
    insert into public.dedupe_keys(key, purpose, actor, metadata)
    values (p_dedupe_key, 'usage_increment', p_user, jsonb_build_object('op', p_op, 'amount', p_amount))
    on conflict (key, purpose) do nothing;
    if not found then return; end if;
  end if;
  insert into public.usage_counters(user_id, day, op, count)
  values (p_user, v_today, p_op, p_amount)
  on conflict (user_id, day, op) do update set count = public.usage_counters.count + excluded.count;
end $$;

create or replace function public.check_entitlement(p_user uuid, p_op text, p_cost int default 1)
returns table (allowed boolean, remaining int, quota int) language plpgsql as $$
declare v_quota int; v_used int;
begin
  select ue.ai_daily_quota into v_quota from public.user_entitlements ue where ue.user_id = p_user;
  if v_quota is null then v_quota := 25; insert into public.user_entitlements(user_id, plan, ai_daily_quota) values (p_user, 'free', v_quota) on conflict (user_id) do nothing; end if;
  select coalesce(sum(count), 0) into v_used from public.usage_counters where user_id = p_user and day = current_date and op = p_op;
  return query select (v_used + p_cost) <= v_quota as allowed, greatest(v_quota - (v_used + p_cost), 0) as remaining, v_quota as quota;
end $$;
