---
name: kyle-vibe-coding
description: >-
  Rapidly prototype and build complete web applications using Kyle's production stack — React 19, Vite, TypeScript, Tailwind CSS, Supabase (auth + RLS + Postgres), Cloudflare Workers/Pages, Resend, Stripe, PostHog. Enforces Kyle's security-first defaults, no-placeholder rule, and a mandatory 6-persona agentic audit loop (Security Auditor, Staff Architect, QA Engineer, Performance Engineer, DevOps/Infra, Accessibility/UX) before any deploy or hand-off. Use when prototyping new product ideas, spinning up demos, building internal tools fast, or starting a new SaaS feature from scratch. Triggers on: vibe code, prototype, spin up, new app, quick build, scaffold, demo, internal tool, from scratch, rapid build, new feature, greenfield, MVP, rapid prototype, starter, boilerplate, new project, build this idea.
---

# Kyle Vibe Coding Skill

## Purpose
Rapid prototyping using Kyle's exact stack. Production-seed codebases — real auth, real DB, security defaults baked in, 6-persona audit loop before anything ships.

## Stack (Defaults — Flag Any Deviation)
| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript (strict, functional only) |
| Styling | Tailwind CSS (utility-first, no CSS modules) |
| Backend | Cloudflare Workers (edge-first) or Express 5 (Node) |
| Database | Supabase — Postgres + RLS + real-time |
| Auth | Supabase Auth — email/password + magic link |
| Email | Resend (transactional) |
| Payments | Stripe (when required) |
| Analytics | PostHog (every app) |
| Deploy | Vercel + Cloudflare Workers + GitHub Actions CI |
| State | Zustand (client) + TanStack Query v5 (server) |
| Forms | React Hook Form + Zod |
| Testing | Vitest (unit) + Playwright (E2E) |

---

## Security Hard Rules (Zero Tolerance)
- **NEVER** put `service_role`, API keys, or DB strings in frontend code
- **ALWAYS** `VITE_*` for client env vars; Cloudflare secrets for Workers
- **ALWAYS** enable RLS on every Supabase table before any INSERT/SELECT
- **NEVER** commit `.env` — `.env.example` with placeholders only
- **VERIFY**: `grep -r 'service_role\|apiKey' src/` empty before any deploy

---

## Quick Start
```bash
npm create vite@latest [app-name] -- --template react-ts && cd [app-name]
npm install @supabase/supabase-js @supabase/auth-helpers-react
npm install @tanstack/react-query zustand react-hook-form zod @hookform/resolvers
npm install tailwindcss postcss autoprefixer posthog-js && npx tailwindcss init -p
npm install -D vitest @testing-library/react @testing-library/jest-dom @playwright/test
```
See [REFERENCE-templates.md](REFERENCE-templates.md) for core file templates (supabase.ts, RLS policies, auth entry point, architecture patterns).

---

## THE 6-PERSONA AUDIT LOOP
**Invoke with: `RUN AUDIT LOOP` — runs before every deploy, demo share, or hand-off.**

Each persona runs in sequence. Each outputs:
`| Finding | Severity | Location | Recommended Fix | Accept Risk? |`

| Persona | Core Domain | Key Catches |
|---|---|---|
| 1 — Security Auditor | Secrets, RLS, attack surface | Exposed keys, missing RLS, injection vectors, CORS, over-permissioned tokens |
| 2 — Staff Architect | Boundaries, coupling, failure modes | Wrong abstractions, missing error/loading/empty states, tight coupling, no retry |
| 3 — QA / Test Engineer | Coverage, edge cases, async | Untested branches, no E2E smoke, race conditions, happy-path-only |
| 4 — Performance Engineer | Latency, bundle, DB cost | N+1 queries, no pagination, oversized bundle, unthrottled realtime |
| 5 — DevOps / Infra | Deploy risk, env hygiene, CI | Missing .env.example entries, no CI check, hardcoded URLs, no rollback |
| 6 — Accessibility / UX | a11y WCAG 2.2 AA, task-first IA | Missing aria-labels, broken focus management, contrast failures, no keyboard nav |

**Synthesis:**
```
AUDIT SUMMARY — [Build] — [Date]
P0 (Blockers): N | P1 (Backlog): N | P2 (Accept risk): N
Fix order: 1. [P0 + fix] 2. [P0 + fix]
Risk decisions: [P1/P2] → Accept / Defer / Fix now?
```

**Severity:** P0 = does not ship | P1 = backlog + ship with note | P2 = accept + document

**Audit scope by build type:**
| Build Type | Personas |
|---|---|
| Prod deploy / real users | All 6 |
| Internal demo / preview URL | 1, 2, 3 |
| Local throwaway (< 48h) | 1 only |
| Decision PoC | 1 + 2 |

---

## Build Acceptance Criteria
- [ ] `.env.example` committed, all vars documented, no real values
- [ ] RLS enabled + tested on all Supabase tables
- [ ] `grep -r 'service_role\|apiKey' src/` returns empty
- [ ] PostHog initialized with ≥1 custom event
- [ ] README: setup, env vars, deploy target, known limits
- [ ] ≥3 Vitest unit tests on core logic
- [ ] `npm run dev` works on first checkout (beyond filling .env)
- [ ] **Audit loop complete. 0 P0 findings open.**

---

## Integration
→ **elite-ui-design** — design direction pre-build
→ **staff-engineer-v4** — architecture review for complex features
→ **sparc-methodology-coach** — for non-trivial features
→ **int-data-analyst** — instrument PostHog events, analyze post-launch

---

## Reference Files
- [REFERENCE-templates.md](REFERENCE-templates.md) — Core file templates, RLS patterns, architecture layouts, PostHog setup, .env.example

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS
- [GENERATED] Stack patterns — verify react.dev, supabase.com/docs before use; both evolve
- COUNTEREXAMPLE: 6-persona audit is overhead on throwaway experiments — use scope table above
- RISK: Vite exposes `VITE_` vars in bundle — audit via devtools Network tab before real deploy
- CONTRADICTION: `@supabase/auth-helpers-react` may be deprecated in favour of `@supabase/ssr` — check for deprecation warnings and follow current Supabase docs


---

## CLAIMS
<!-- [SOURCED] or [GENERATED] labels for assertions in this skill. None yet — footer added by audit fix pass. -->

## COUNTEREXAMPLE
<!-- Known cases where this skill should NOT activate or may produce wrong output -->

## CONTRADICTIONS
<!-- ! Conflicts with other skills or system prompts -->
