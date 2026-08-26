---
name: kyle-vibe-coding
description: Rapidly build production-seed web apps on Kyle's default stack — React 19 + Vite + TS, Tailwind, Supabase (Auth + RLS + Postgres), Cloudflare Workers, Resend, Stripe, PostHog — with security-first defaults and a mandatory 6-persona audit (Security, Architecture, QA, Performance, DevOps, A11y) before deploy. Use when prototyping, building demos, internal tools, MVPs, or new SaaS features. Triggers on: vibe code, prototype, spin up, scaffold, MVP, greenfield, let's build.
---

# Kyle Vibe Coding Skill

## Essential Principles

1. **Production-seed, not demos.** Every build has real auth, real DB, real RLS, and a deploy target. No mocked data, no hardcoded credentials, no "we'll add auth later."

2. **Security hard rules are non-negotiable.** `service_role` key never touches the frontend. RLS is enabled before any INSERT/SELECT is written. `.env` is never committed. These are not preferences.

3. **The 6-persona audit loop is a ship gate.** Runs before every deploy, every preview URL share, every hand-off. P0 findings block the ship. The scope table determines which personas run — full build = all 6, local throwaway = persona 1 only.

4. **Stack deviations must be flagged.** If a task requires departing from the default stack, call it out explicitly with the reason before proceeding.

5. **Acceptance criteria close before the audit runs.** The checklist gates the audit loop — if acceptance criteria aren't met, the audit hasn't started.

## Intake

Default stack — state deviations explicitly:

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

## Core Workflow

1. **Confirm build type & deploy scope** at activation.
2. **Load `references/templates.md` before writing any code** — it contains the exact file templates for `supabase.ts`, `posthog.ts`, auth entry point, and RLS patterns.
3. **Run `workflows/build.md`** — initialize → implement → acceptance criteria.
4. **Close acceptance criteria.** No skipping. The audit loop will not start until these pass.
5. **Run `workflows/audit-loop.md`** with personas scoped to deploy target. P0 findings block ship.
6. **Ship or hand off** only after the audit closes clean (or P0s are explicitly waived in writing).

| Task | Workflow |
|------|---------|
| Start a new build | `workflows/build.md` |
| Run the audit loop | `workflows/audit-loop.md` |
| Init files, templates, RLS patterns | `references/templates.md` |

## Reference Index

| Reference | Purpose |
|-----------|---------|
| `references/templates.md` | Core file templates, RLS patterns, .env.example, architecture layouts, troubleshooting |

## Workflows Index

| Workflow | Purpose |
|----------|---------|
| `workflows/build.md` | Initialization, implementation, acceptance criteria |
| `workflows/audit-loop.md` | 6-persona audit loop with scope-gated persona selection |
