# CLAUDE.md — flashfusion-sprint
Last updated: April 11, 2026

---

## PROJECT IDENTITY
Sprint execution assistant for FlashFusion v1.9.9. Demo Day: April 18, 2026 — 7 days out.

## DEFINITION OF DONE
A good session closes at least one OI, updates wiki/oi-tracker.md with confirmed resolution, and leaves no security invariant in FAIL state.

---

## HARD CONSTRAINTS
1. NEVER put secrets, API keys, or credentials in any file
2. RLS required on ALL multi-tenant Supabase tables — no exceptions
3. NEVER reference employer (Intinc) in any output
4. INT lane NEVER shares bindings with FF primary project (mlqebvxmavrzousuqyjr)
5. AI keys (ANTHROPIC, OPENAI, GEMINI) in CF Worker secrets ONLY — never Vercel env, never client bundle
6. SUPABASE_SERVICE_ROLE_KEY in CF Worker ONLY
7. Check wiki/oi-tracker.md BEFORE claiming anything resolved
8. Read CLAUDE.md + CONTEXT.md before every session

---

## SECURITY INVARIANTS (all must be PASS before Demo Day)

| Invariant | Check |
|---|---|
| INV-1 | AI keys not in client bundle or Vercel env |
| INV-2 | SUPABASE_SERVICE_ROLE_KEY not in any client code |
| INV-3 | Redis credentials in CF Worker secrets only |
| INV-4 | INT lane has zero shared Supabase bindings with FF primary |
| INV-5 | RLS enabled on all 5 v1.9.9 tables (agent_runs, run_checkpoints, tool_invocations, billing_meter, memory_embeddings) |
| INV-6 | social_platforms plaintext OAuth tokens dropped post-migration |
| INV-7 | tool_invocations stores input_hash/output_hash only — never raw strings |

---

## OPEN ITEMS TRACKER

| ID | Item | Status | Blocker |
|---|---|---|---|
| OI-001 | GAP-001: INT lane isolation | ✅ Resolved 2026-04-07 | — |
| OI-002 | GAP-007: socket.io-parser in MCP adapter? | 🟡 Needs check | Kyle to grep |
| OI-003 | Base44 77-entity vs 33-table gap | 🟡 Needs check | Categorize 44 extra entities |
| OI-004 | Embedding model / dimensions unconfirmed | 🔴 Open | Find embedContent calls |
| OI-005 | AutoGen feature flag mechanism | 🟡 Open | Pick: Supabase col vs Redis vs CF KV |
| OI-006 | Dependabot PRs #88–95 | ✅ Resolved 2026-04-07 | — |
| OI-007 | gitleaks pre-commit hook | ✅ Resolved 2026-04-07 | — |
| OI-008 | OAuth vault migration | 🟡 Script ready | Run --dry-run then --execute |
| OI-009 | LangSmith CF Worker setup | 🔴 Open | Set secret + add SDK init |

---

## STACK REFERENCE

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind 4, Turbopack |
| Backend | Supabase (project: mlqebvxmavrzousuqyjr), CF Workers |
| Auth | Supabase Auth |
| Cache | Upstash Redis |
| AI | Cloudflare Workers AI + Anthropic API |
| Observability | LangSmith (flashfusion-v199), Sentry |
| Deploy | Vercel (team: team_hPVeJgH0h1nCrogiaMvD6fxu) |
| Repo | krosebrook/continuum |
| Last prod deploy | dpl_6G5v9RpMSend3Ckh4eZJfCf4ZTL9 (PR #112) |

---

## INFRA REFERENCE

| Item | Value |
|---|---|
| Vercel team | team_hPVeJgH0h1nCrogiaMvD6fxu |
| Continuum project ID | prj_suXzxaQd6dxVDeEiR0LgFZOTB6IG |
| Supabase primary project | mlqebvxmavrzousuqyjr |
| GitHub reconnect URL | vercel.com/flash-fusion/continuum/settings/git |
| Continuum repo | github.com/krosebrook/continuum |

---

## SESSION PROTOCOL

### Start of every session
1. Read CLAUDE.md (this file)
2. Read CONTEXT.md — current sprint state
3. Read wiki/oi-tracker.md — OI statuses
4. Ask: "Which OI are we closing today?"

### End of every session
1. Update wiki/oi-tracker.md with resolution status + date
2. Update CONTEXT.md
3. Run security invariant check if any code was touched
4. Ask: "Any new blockers surfaced?"

---

## WIKI RULES
- wiki/oi-tracker.md — source of truth for all OI statuses
- wiki/security-model.md — invariants reference
- wiki/log.md — session log
- log format: `## [YYYY-MM-DD] | [OI closed] | [status]`
