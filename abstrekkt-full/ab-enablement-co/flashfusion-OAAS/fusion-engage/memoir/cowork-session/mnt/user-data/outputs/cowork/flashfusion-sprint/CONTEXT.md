# CONTEXT — flashfusion-sprint
Last updated: April 11, 2026

## Current phase
Sprint v1.9.9 — Demo Day April 18, 2026 (7 days out). Sprint 2 active (Apr 7–13): demo polish + partner warm-up.

## What exists
- CLAUDE.md — security invariants, OI tracker, stack reference
- wiki/oi-tracker.md (Notion export, Apr 7 state)
- wiki/security-model.md (Notion export)
- wiki/sprint-phases.md (Notion export)
- Last prod deploy: dpl_6G5v9RpMSend3Ckh4eZJfCf4ZTL9 (PR #112) — healthy

## OI status summary (Apr 7)
- ✅ Resolved: OI-001, OI-006, OI-007
- 🟡 In progress: OI-008 (script ready, needs execution)
- 🔴 Open blockers: OI-004, OI-009
- 🟡 Needs check: OI-002, OI-003, OI-005

## What's open
- OI-008: OAuth vault migration — run --dry-run then --execute
- OI-009: LangSmith setup — set CF Worker secret + add SDK init to worker
- OI-004: Embedding model unconfirmed — grep Edge Functions for embedContent
- Sprint 2 gates: demo env test, 3 discovery calls, one-pager approved
- Vercel ↔ GitHub App reconnect: manual action needed

## What's next
Run OI-008 OAuth migration (script exists, prod creds needed). Then OI-009 LangSmith.

## Blockers
- Supabase bill overdue — suspension risk (do not run new migrations until resolved)
- Vercel ↔ GitHub reconnect: vercel.com/flash-fusion/continuum/settings/git
