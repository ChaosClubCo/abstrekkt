-- Arc System — Supabase schema (Persistence phase 1, see PERSISTENCE_PLAN.md §2)
-- JSONB-first port of arcs-data.json / arcs-prose.json / the localStorage overlay.
-- Run this once in the Supabase SQL Editor against a fresh project.
-- Posture: single-user personal tool. RLS policies below are permissive for
-- the anon key (read+write) — tighten before this ever becomes multi-user.

create table if not exists public.arcs (
  id text primary key,
  em text not null,
  accent text,
  kicker text,
  sub text,
  series int default 1,
  lane text,
  meta jsonb default '[]'::jsonb,
  quarters jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.prose (
  id text primary key references public.arcs(id) on delete cascade,
  headline text,
  intro text,
  gain jsonb default '[]'::jsonb,
  give_up jsonb default '[]'::jsonb,
  give_label text,
  note text,
  claims jsonb default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- The event log every op replays onto — mirrors arc-ai.js's overlay shape.
-- kind: 'arc' (full arc snapshot after edit/create), 'prose' (prose snapshot),
-- or 'delete' (snapshot is null). Folded oldest-to-newest; last row per
-- arc_id wins — see arc-sync.js's pullOverlay().
create table if not exists public.overlay_log (
  id text primary key,
  arc_id text not null,
  kind text not null check (kind in ('arc', 'prose', 'delete')),
  snapshot jsonb,
  source text default 'human',
  occurred_at timestamptz not null default now()
);
create index if not exists overlay_log_occurred_at_idx on public.overlay_log (occurred_at asc);
create index if not exists overlay_log_arc_id_idx on public.overlay_log (arc_id);

alter table public.arcs enable row level security;
alter table public.prose enable row level security;
alter table public.overlay_log enable row level security;

-- Personal single-user tool: the anon key itself is the access boundary
-- (keep it out of anything but this browser / the Edge Function). Replace
-- these with auth.uid()-scoped policies before adding a second user.
create policy "anon read arcs" on public.arcs for select using (true);
create policy "anon write arcs" on public.arcs for all using (true) with check (true);
create policy "anon read prose" on public.prose for select using (true);
create policy "anon write prose" on public.prose for all using (true) with check (true);
create policy "anon read overlay_log" on public.overlay_log for select using (true);
create policy "anon insert overlay_log" on public.overlay_log for insert with check (true);

-- Seeding: bulk-load arcs-data.json / arcs-prose.json into arcs/prose once via
-- the dashboard's Table Editor "Import data from JSON" or a one-off script —
-- not included here since it's a one-time step, not part of the live schema.
