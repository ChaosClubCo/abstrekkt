<required_reading>
Load `references/templates.md` before writing any code.
It contains supabase.ts, posthog.ts, RLS patterns, .env.example, and architecture layouts.
</required_reading>

<process>

## Step 1 · Initialization

```bash
npm create vite@latest [app-name] -- --template react-ts && cd [app-name]
npm install @supabase/supabase-js @supabase/auth-helpers-react
npm install @tanstack/react-query zustand react-hook-form zod @hookform/resolvers
npm install tailwindcss postcss autoprefixer posthog-js && npx tailwindcss init -p
npm install -D vitest @testing-library/react @testing-library/jest-dom @playwright/test
```

Create `.env.example` immediately — before writing any code. Copy from `references/templates.md`.

---

## Step 2 · Supabase Setup

1. Create tables in Supabase dashboard
2. Enable RLS on every table immediately — before writing any application code
3. Add RLS policies using the pattern in `references/templates.md`
4. Verify with `EXPLAIN SELECT * FROM your_table` — confirm RLS filter appears in query plan

**Never write INSERT or SELECT logic before RLS is enabled.**

---

## Step 3 · Core File Setup

Copy exact templates from `references/templates.md`:
- `src/lib/supabase.ts`
- `src/lib/posthog.ts`
- `src/App.tsx` (auth-aware entry point)

---

## Step 4 · Implementation

**Architecture by build type:**

| Build Type | Pattern |
|---|---|
| Internal admin tool (Intinc) | `pages/` + `components/DataTable` + `lib/queries.ts` (all DB calls here) |
| SaaS MVP | `pages/` (Landing, Auth, Dashboard, Settings) + `lib/` (supabase, stripe, posthog) |
| Quick prototype / demo | Minimal — single page, but still with RLS + real auth |

**All builds:**
- Wrap every route in `ErrorBoundary`
- Loading / empty / error state trifecta on every data-dependent component
- All Supabase queries in a single `lib/queries.ts` — never inline in components
- PostHog: at least 1 meaningful `posthog.capture()` event

---

## Step 5 · Acceptance Criteria Gate

Before running the audit loop, verify all of these:

- [ ] `.env.example` committed — all vars documented, no real values
- [ ] RLS enabled + tested on all Supabase tables
- [ ] `grep -r 'service_role\|apiKey' src/` returns empty
- [ ] PostHog initialized with ≥1 custom event
- [ ] README: setup steps, env vars, deploy target, known limits
- [ ] ≥3 Vitest unit tests on core business logic
- [ ] `npm run dev` works on first checkout beyond filling `.env`

**When all criteria pass:** load and run `workflows/audit-loop.md`.

</process>
