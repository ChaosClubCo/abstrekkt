# RLS Sanity Tests (tenant isolation + billing tamper-proofing)

These are the verification steps from the source chat, materialized as runnable
SQL. The goal: prove **deny-by-default** isolation and that clients cannot write
billing/job state. Run after applying `migrations/0001..0006`.

> All "as authenticated user X" checks must be run through PostgREST / the
> Supabase client with that user's JWT, OR simulated in SQL by setting the role
> and the `request.jwt.claims`. The simulation pattern is shown below.

## 0. Structural gate

```sql
-- Every tenant table must report rowsecurity = true.
select relname, relrowsecurity
from pg_class
where relname in ('organizations','organization_memberships','organization_plans',
                  'usage_events','products','product_listings','publish_jobs',
                  'ai_jobs','audit_logs')
order by relname;
-- EXPECT: relrowsecurity = t for all nine rows.
```

## 1. Set up two orgs, two users

```sql
-- Run as service role.
insert into public.organizations (slug,name) values ('org-a','Org A'),('org-b','Org B')
  on conflict (slug) do nothing;

-- pretend user ids
--   USER_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
--   USER_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
insert into public.organization_memberships (organization_id,user_id,role)
select id,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','owner' from public.organizations where slug='org-a'
  on conflict do nothing;
insert into public.organization_memberships (organization_id,user_id,role)
select id,'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','owner' from public.organizations where slug='org-b'
  on conflict do nothing;

-- seed one product in each org (as service role)
insert into public.products (organization_id,created_by,name)
select id,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','A-only' from public.organizations where slug='org-a';
insert into public.products (organization_id,created_by,name)
select id,'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','B-only' from public.organizations where slug='org-b';
```

## 2. Cross-tenant read must be empty

Simulate user A's JWT context, then read products:

```sql
-- Simulate an authenticated request as USER_A.
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}', true);

-- request_user_id() reads auth.uid() which reads request.jwt.claims.sub.
select name from public.products;          -- EXPECT: only 'A-only'
select count(*) from public.products p     -- EXPECT: 0
  join public.organizations o on o.id=p.organization_id where o.slug='org-b';

reset role;
```

PASS = user A sees only org-A rows; org-B rows are invisible (not just filtered
in the app — the DB refuses them).

## 3. Only owner/admin can delete products

```sql
-- Add USER_A2 as plain 'member' of org-a, then try to delete as that member.
-- EXPECT: 0 rows deleted (no products_delete policy for members).
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"<member-uuid>","role":"authenticated"}', true);
delete from public.products where name='A-only';   -- EXPECT: DELETE 0
reset role;
```

## 4. Clients cannot insert billing / job rows

```sql
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}', true);

-- All of these MUST fail with "new row violates row-level security policy"
-- (no insert policy exists for authenticated on these tables):
insert into public.ai_jobs (organization_id,created_by,kind,idempotency_key)
  select id,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','listing_generate','x'
  from public.organizations where slug='org-a';          -- EXPECT: error

insert into public.usage_events
  (organization_id,user_id,kind,quantity,ref_type,ref_id,idempotency_key)
  select id,'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','ai_tokens',0,'ai_job',gen_random_uuid(),'y'
  from public.organizations where slug='org-a';          -- EXPECT: error

insert into public.publish_jobs (organization_id,listing_id,created_by,idempotency_key)
  values (gen_random_uuid(),gen_random_uuid(),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','z');  -- EXPECT: error

reset role;
```

## 5. AI job transition guard (DB-level)

```sql
-- As service role: a succeeded job cannot go back to running.
update public.ai_jobs set state='running'
 where state='succeeded'
 limit 1;                       -- EXPECT: error "illegal ai_job transition succeeded -> running"
```

## 6. Idempotent finalize

```sql
-- Insert the same (organization_id, idempotency_key) twice into usage_events.
-- Second insert must be a no-op (ON CONFLICT) or violate the unique constraint
-- if you don't use ON CONFLICT. The worker uses ON CONFLICT DO NOTHING.
```

## Pass criteria (acceptance)

- [ ] All nine tenant tables report `rowsecurity = t`.
- [ ] User A cannot read org B's products / listings / ai_jobs.
- [ ] A plain member cannot delete products.
- [ ] Authenticated clients cannot insert into `ai_jobs`, `usage_events`, `publish_jobs`.
- [ ] Illegal AI-job transitions are rejected by the DB guard.
- [ ] Finalize usage events are idempotent per `(organization_id, idempotency_key)`.
