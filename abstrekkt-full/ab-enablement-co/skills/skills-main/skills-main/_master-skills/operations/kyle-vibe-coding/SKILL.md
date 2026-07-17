---
name: kyle-vibe-coding
description: Helps automate and manage kyle vibe coding processes. <essential_principles>. Use when managing, optimizing, or automating operational workflows.
---

# Kyle Vibe Coding Skill

## Core Workflow


<essential_principles>

1. **Production-seed, not demos.** Every build has real auth, real DB, real RLS, and a deploy target. No mocked data, no hardcoded credentials, no "we'll add auth later."

2. **Security hard rules are non-negotiable.** `service_role` key never touches the frontend. RLS is enabled before any INSERT/SELECT is written. `.env` is never committed. These are not preferences.

3. **The 6-persona audit loop is a ship gate.** Runs before every deploy, every preview URL share, every hand-off. P0 findings block the ship. The scope table determines which personas run — full build = all 6, local throwaway = persona 1 only.

4. **Stack deviations must be flagged.** If a task requires departing from the default stack, call it out explicitly with the reason before proceeding.

5. **Acceptance criteria close before the audit runs.** The checklist gates the audit loop — if acceptance criteria aren't met, the audit hasn't started.

</essential_principles>

<intake>

**Default stack — state deviations explicitly:**

| Layer | Default |
|---|---|
| Frontend | React 19 + Vite + TypeScript (strict, functional only) |
| Styling | Tailwind CSS |
| Backend | Cloudflare Workers (edge-first) or Express 5 (Node) |
| Database | Supabase — Postgres + RLS + real-time |
| Auth | Supabase Auth — email/password + magic link |
| Email | Resend |
| Payments | Stripe (when required) |
| Analytics | PostHog (every app) |
| Deploy | Vercel + Cloudflare Workers + GitHub Actions |
| State | Zustand (client) + TanStack Query v5 (server) |
| Forms | React Hook Form + Zod |
| Testing | Vitest (unit) + Playwright (E2E) |

**On activation:** confirm build type (new app / new feature / internal tool / demo) and deploy scope (prod / preview / local throwaway) — this determines which audit personas run at the end.

</intake>

<routing>

| Task | Workflow |
|------|---------|
| Start a new build | `workflows/build.md` |
| Run the audit loop | `workflows/audit-loop.md` |
| Init files, templates, RLS patterns | `references/templates.md` |

**Always load `references/templates.md` before writing any code.** It contains the exact file templates for supabase.ts, posthog.ts, auth entry point, and RLS patterns.

**After build acceptance criteria are met, load and run `workflows/audit-loop.md`.**

</routing>

<reference_index>

| Reference | Purpose |
|-----------|---------|
| `references/templates.md` | Core file templates, RLS patterns, .env.example, architecture layouts, troubleshooting |

</reference_index>

<workflows_index>

| Workflow | Purpose |
|----------|---------|
| `workflows/build.md` | Initialization, implementation, acceptance criteria |
| `workflows/audit-loop.md` | 6-persona audit loop with scope-gated persona selection |

</workflows_index>
