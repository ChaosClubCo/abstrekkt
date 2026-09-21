alter table if exists public.usage_counters enable row level security;
alter table if exists public.user_entitlements enable row level security;

create policy if not exists "owner_select_usage"
  on public.usage_counters for select
  using (auth.uid() = user_id);

create policy if not exists "owner_select_entitlements"
  on public.user_entitlements for select
  using (auth.uid() = user_id);
