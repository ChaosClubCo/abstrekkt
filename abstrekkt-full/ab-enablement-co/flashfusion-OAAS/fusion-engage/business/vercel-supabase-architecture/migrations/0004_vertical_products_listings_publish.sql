-- =============================================================================
-- 0004_vertical_products_listings_publish.sql
-- The Product -> Listing -> Publish vertical.
-- Requires: 0001, 0002, 0003.
-- =============================================================================
begin;

-- Products --------------------------------------------------------------------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  created_by       uuid not null,
  name             text not null,
  description      text not null default '',
  brand_voice      text not null default 'default',
  attributes       jsonb not null default '{}'::jsonb,
  images           jsonb not null default '[]'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists trg_products_touch on public.products;
create trigger trg_products_touch
  before update on public.products
  for each row execute function public.touch_updated_at();

create index if not exists idx_products_org on public.products(organization_id, created_at desc);

-- Listings --------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'listing_status') then
    create type public.listing_status as enum ('draft','ready','published','failed');
  end if;
end$$;

create table if not exists public.product_listings (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references public.organizations(id) on delete cascade,
  product_id        uuid not null references public.products(id) on delete cascade,
  created_by        uuid not null,
  platform          text not null check (platform in
                      ('shopify','etsy','tiktok_shop','facebook_marketplace','ebay','printify')),
  title             text not null,
  body_html         text not null default '',
  tags              text[] not null default '{}',
  price_cents       int not null default 0 check (price_cents >= 0),
  currency          text not null default 'USD',
  status            public.listing_status not null default 'draft',
  platform_payload  jsonb not null default '{}'::jsonb,
  platform_result   jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists trg_listings_touch on public.product_listings;
create trigger trg_listings_touch
  before update on public.product_listings
  for each row execute function public.touch_updated_at();

create index if not exists idx_listings_org     on public.product_listings(organization_id, created_at desc);
create index if not exists idx_listings_product on public.product_listings(product_id);

-- Publish jobs ----------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'publish_status') then
    create type public.publish_status as enum ('queued','publishing','succeeded','failed','canceled');
  end if;
end$$;

create table if not exists public.publish_jobs (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  listing_id       uuid not null references public.product_listings(id) on delete cascade,
  created_by       uuid not null,
  status           public.publish_status not null default 'queued',
  attempt          int not null default 0,
  max_attempts     int not null default 3,
  next_retry_at    timestamptz null,
  error_code       text null,
  error_message    text null,
  result           jsonb not null default '{}'::jsonb,
  idempotency_key  text not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

drop trigger if exists trg_publish_touch on public.publish_jobs;
create trigger trg_publish_touch
  before update on public.publish_jobs
  for each row execute function public.touch_updated_at();

create index if not exists idx_publish_org    on public.publish_jobs(organization_id, created_at desc);
create index if not exists idx_publish_status on public.publish_jobs(status, next_retry_at);

commit;
