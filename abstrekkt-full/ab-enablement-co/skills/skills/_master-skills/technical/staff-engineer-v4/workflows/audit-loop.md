<required_reading>
This workflow runs at every ship gate — before merge to main, before deploy, before hand-off.
Invoke with: RUN AUDIT LOOP
Each persona runs in sequence. Do not skip. Do not combine.
</required_reading>

<process>

## Output Format (Per Persona)

```
| Finding | Severity | Blast Radius | Location | Recommended Fix | Accept Risk? |
```

**Blast Radius** = how many systems, users, or data flows does this affect if exploited or triggered?
Examples: "all authenticated users", "single endpoint", "entire data layer", "agents in this tenant"

**Severity:**
- P0 — Does not ship. Fix before merge. No exceptions.
- P1 — Log in WSJF backlog. Ship with note. Fix next sprint.
- P2 — Accepted risk. Document blast radius + rationale.

---

## Persona 1 — Security Auditor

**Staff lens:** Does this vulnerability create a class of bugs, or is it isolated? Can it be fixed by architecture, or only by discipline?

**Evaluate:**
- Secrets exposed in frontend or logs?
- RLS enabled and verified (`EXPLAIN`) on every Supabase table?
- All inputs validated with Zod before reaching DB or agent?
- Auth on every protected route — no implicit trust?
- Rate limiting on all public + agent-callable endpoints?
- MCP server whitelist up to date?
- Agent inputs sanitized for injection patterns?
- Tool outputs validated against schema before use?
- OWASP LLM Top 10 reviewed — LLM01 (prompt injection) and LLM06 (sensitive info disclosure)?
- Cross-tenant data isolation — can user A access user B's data through this feature?
- Any new API endpoint missing CORS configuration?

---

## Persona 2 — Staff Architect

**Staff lens:** Will this architecture still make sense at 10x load? At 10x team size? What's the first thing that breaks?

**Evaluate:**
- Does this feature respect existing system boundaries, or does it create new coupling?
- Missing error paths, circuit breakers, or retry logic on external deps?
- Abstraction level matches problem complexity (no architecture astronautics, no under-engineering)?
- Agent orchestration patterns sound under load — context windows within budget?
- State isolated between tenants — no shared mutable state bleeding across requests?
- Data flow matches established patterns, or parallel flow that will diverge?
- Missing operational runbooks for new failure modes this feature introduces?

---

## Persona 3 — QA / Test Engineer

**Staff lens:** If a junior engineer makes a change tomorrow, will the test suite catch the regression?

**Evaluate:**
- Every acceptance criterion from spec → at least one test?
- Every error path from pseudocode → a test?
- Every integration point → a contract test?
- Auth and permission logic specifically — not just happy path?
- Agent output validation tests — non-determinism tested with seeded inputs?
- Race conditions in async code?
- Tests that test mocks instead of behavior?
- Test suite ordering/timing dependencies that pass locally but fail in CI?

---

## Persona 4 — Performance Engineer

**Staff lens:** What's the cost at 1,000 users? At 10,000? Is there a token/cost amplification vector an attacker could abuse?

**Evaluate:**
- N+1 queries on any new data fetch?
- Missing DB indexes for new query patterns?
- List endpoints without pagination?
- Synchronous operations that should be async queue jobs at scale?
- LLM token cost model at production volume — will this burn $5k/month unnoticed?
- Agent loops with no token budget ceiling?
- RAG retrievals that scale with user count rather than query count?
- Unthrottled real-time subscriptions?
- Bundle size impact (`vite-bundle-visualizer` if frontend)?

---

## Persona 5 — DevOps / Infra

**Staff lens:** Can an on-call engineer who didn't build this debug a production incident at 2am?

**Evaluate:**
- Feature behind a feature flag for gradual rollout?
- Rollback procedure documented?
- DB migration backward-compatible with previous deploy?
- All new env vars in `.env.example` and CI secrets?
- Agent runtime environment assumptions validated in CI?
- Runbook for "agent returns garbage" failure mode?
- SLO alerting defined for this feature's critical path?
- `git log --all --full-diff -p | grep -i 'key\|secret\|token'` clean?

---

## Persona 6 — Accessibility / UX

**Staff lens:** Does the UX communicate what the agent can and can't do? Are failures recoverable without engineering intervention?

**Evaluate:**
- Loading / empty / error state trifecta on all data-dependent UI?
- Agent response latency — streaming or progress indicator?
- Error messages from agent failures — expose internal details to users?
- Graceful degradation if agent or API is unavailable?
- Missing `aria-label`, `aria-describedby`, or `alt` attributes?
- Focus management on new modals, drawers, or overlays?
- Color contrast ≥ 4.5:1 (WCAG 2.2 AA)?
- Keyboard-only navigation works end-to-end?
- Mobile breakpoints covered?

---

## Audit Synthesis

```
AUDIT SUMMARY — [System / Feature] — [Date]

P0 (Blockers — does not ship): N findings
P1 (High — WSJF backlog + ship with note): N findings
P2 (Low — accepted risk + documented): N findings

Highest blast radius finding:
[finding] — affects [scope]

Fix order:
1. [P0 finding] — [fix] — Blast radius: [scope]
2. [P0 finding] — [fix] — Blast radius: [scope]

Risk acceptance decisions needed:
- [P1/P2 finding]: Accept / Defer to backlog / Fix now?
```

</process>
