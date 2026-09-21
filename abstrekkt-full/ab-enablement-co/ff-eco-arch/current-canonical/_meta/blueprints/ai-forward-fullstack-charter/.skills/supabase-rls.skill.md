# Skill: Supabase RLS Policy Generation

## Overview
Generate correct Row-Level Security policies so per-user / per-workspace data
isolation is enforced at the database, not just the app layer.

## When to use
Any time a table holds user-owned or workspace-scoped data (profiles, deals,
portfolios, onboarding/lifecycle state).

## Policy patterns

### 1. Creator-owned resources
```sql
alter table deals enable row level security;
create policy "owner can read"  on deals for select using (auth.uid() = owner_id);
create policy "owner can write" on deals for insert with check (auth.uid() = owner_id);
create policy "owner can update" on deals for update using (auth.uid() = owner_id);
```

### 2. Public read, authenticated write
```sql
create policy "public read" on signals for select using (true);
create policy "auth write"  on signals for insert with check (auth.role() = 'authenticated');
```

### 3. Role-based (workspace)
```sql
create policy "members read workspace" on deals for select
  using (exists (select 1 from memberships m
                 where m.workspace_id = deals.workspace_id and m.user_id = auth.uid()));
```

## Testing RLS
- Run queries as different `auth.uid()` values; confirm cross-user reads return 0 rows.
- Add a regression test per policy; never ship a table with RLS disabled.

## Common mistakes
- Forgetting `with check` on insert/update (lets users write rows they can't read).
- Relying on app-layer filtering instead of RLS (bypassed by any direct API call).

## Checklist
- [ ] RLS enabled on the table
- [ ] select + insert + update + delete policies present
- [ ] cross-tenant read returns empty in a test
