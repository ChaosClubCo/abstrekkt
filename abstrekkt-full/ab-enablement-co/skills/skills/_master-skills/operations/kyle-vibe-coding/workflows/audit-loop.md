<required_reading>
Invoke with: RUN AUDIT LOOP
Runs before every deploy, every preview URL share, every hand-off.
Determine audit scope from the deploy type declared at intake.
</required_reading>

<process>

## Audit Scope (Select Before Running)

| Deploy Type | Personas to Run |
|---|---|
| Prod deploy / real users | All 6 — full audit |
| Internal demo / preview URL | Personas 1, 2, 3 |
| Local throwaway (< 48h lifespan) | Persona 1 only |
| Decision-making PoC | Personas 1 + 2 |

---

## Output Format (Each Persona)

```
| Finding | Severity | Location | Recommended Fix | Accept Risk? |
```

**Severity:** P0 = does not ship | P1 = backlog + ship with note | P2 = accept + document

---

## Persona 1 — Security Auditor

- `service_role`, API keys, or DB strings in frontend code?
- RLS enabled and verified with `EXPLAIN` on every Supabase table?
- All user inputs validated with Zod before reaching DB?
- Any new API endpoint missing auth or rate limiting?
- `.env` committed accidentally? (`git log --all -p | grep -i 'service_role\|apiKey'`)
- CORS configured for explicit allowed origins only?
- Stripe secret key accessible from client bundle?

---

## Persona 2 — Staff Architect

- Does this build respect the single-responsibility of `lib/queries.ts`?
- Are there inline Supabase calls scattered across components?
- Missing error boundaries on any route?
- Auth state derived from localStorage instead of server session?
- Tight coupling between components that should be independent?
- Missing loading / empty / error states on data-dependent UI?

---

## Persona 3 — QA / Test Engineer

- ≥3 unit tests on core business logic?
- Error cases tested, not just happy path?
- Any async race conditions in data fetching logic?
- Tests that verify behavior or tests that verify mocks?
- `npm run dev` tested on a clean checkout?

---

## Persona 4 — Performance Engineer

- N+1 queries on any data fetch?
- Lists without pagination?
- Unthrottled PostHog events on every keystroke or scroll?
- Unthrottled Supabase real-time subscriptions?
- Bundle size checked (`vite-bundle-visualizer`) — any unexpected large deps?

---

## Persona 5 — DevOps / Infra

- All env vars in `.env.example`?
- CI pipeline configured (or noted as future work)?
- Cloudflare Worker using any Node.js built-ins that don't run at edge?
- Deploy target documented in README?
- Rollback path documented if this is a prod deploy?

---

## Persona 6 — Accessibility / UX

- Loading / empty / error trifecta on every data-dependent component?
- Form fields all have labels (not just placeholder text)?
- Images have `alt` attributes?
- Modals or drawers trap focus correctly?
- Works keyboard-only (tab through all interactive elements)?
- Mobile layout tested at 375px?

---

## Audit Synthesis

```
AUDIT SUMMARY — [Build Name] — [Date]

Scope: [Full / Personas 1-3 / Persona 1 only]

P0 (Blockers — does not ship): N
P1 (High — backlog + ship with note): N
P2 (Low — accept risk + document): N

Fix order:
1. [P0 finding + fix]
2. [P0 finding + fix]

Risk decisions:
- [P1/P2]: Accept / Defer / Fix now?
```

**Ship only when P0 count = 0.**

</process>
