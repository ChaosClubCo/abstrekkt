# FlashFusion Archive → INT Universal MCP Server Pivot (ZIP_SPEC)

> Reconstructed from source chat
> `FlashFusion-development-next-steps` (uuid `c9af846b…`).
> The session began as a "federated architecture for 50+ platforms" request,
> pivoted mid-thread to **archive FlashFusion and refocus on INT Inc**, then built
> a Universal MCP Server through test phases 9 → 10.3. This package captures both
> the wind-down and the new build.

## 1. Executive Summary

Two linked deliverables from a single decision point:
1. **Archive FlashFusion** (AI workflow-orchestration product; Next.js 15, tRPC,
   Supabase, Stripe, Printify, n8n) cleanly — preserve the learning and reusable
   assets, stop the spend, record why.
2. **Pivot to an INT Inc "Universal MCP Server"** — a multi-provider MCP server
   intended to scale from ~10 to ~50 engineers, carried through an integration
   test suite (Phase 10) after core tests (Phase 9) surfaced implementation bugs.

## 2. Extracted Systems Inventory

| Item | Type | Status in source |
|---|---|---|
| FlashFusion platform | product | Decision: **archive & pivot** |
| Federated 50+ platform architecture | architecture | Superseded by pivot |
| Archive runbook (branch, README, financial cleanup, memory) | ops artifact | Drafted |
| INT Universal MCP Server | platform | Built through Phase 10.3 |
| ExpressServer refactor (Phase 10.1) | refactor | **Complete** in source |
| Provider implementation fixes (10.2 / 10.3 top-3) | bugfix | In progress |
| Integration test suite (Phase 10) | tests | Scoped (6–9h estimate) |
| Reusable assets for INT + skill packs | extraction | Identified |

## 3. Gap & Risk Audit

- **Gaps:** the source never finished Phase 10 (integration tests) or the full
  provider fix set; FlashFusion financial cleanup (Stripe/Printify subscriptions)
  was listed but not confirmed done.
- **Blindspots:** "scale 10→50 engineers" had no concrete load/seat model; the
  archive risks losing tacit knowledge if the README isn't written before the
  branch goes cold.
- **Bottlenecks:** the session shows heavy "nudge/continue" churn — work stalled
  repeatedly waiting on the human, a sign the build needed clearer phase exit
  criteria.
- **Unknown-unknowns:** which FlashFusion components are actually reusable in INT
  vs. coupled to Stripe/Printify; provider API drift in the MCP server.
- **Contradictions:** none — the pivot is a deliberate supersede, not a conflict.

## 4. Upgraded Architecture — Universal MCP Server

```
Engineers (10 → 50)  ─► Universal MCP Server (Express)
                          ├── Provider adapters (pluggable; the 10.2/10.3 fixes)
                          ├── Auth / quota per engineer
                          └── Integration test suite (Phase 10 gate)
Reusable from FlashFusion: n8n workflow patterns, Supabase schema conventions,
                           tRPC error-handling patterns → INT skill packs
```

**Hardening added:** explicit per-phase exit criteria (so the build doesn't stall
on "nudge"), and a provider-adapter contract test so each provider fix is verified
in isolation before integration.

## 5. Production Deliverables (file tree)

```
flashfusion-archive-and-int-pivot/
├── README.md                     (this file)
├── archive/
│   ├── ARCHIVE-RUNBOOK.md         ← sample included (branch + README + cleanup)
│   └── flashfusion-archive-readme.md   "what was built / why archived / learnings"
├── pivot/
│   ├── int-priorities.md          Staff-Engineer focus, next 3 months
│   └── reusable-assets.md         components extracted from FlashFusion
└── universal-mcp-server/
    ├── ARCHITECTURE.md            Express server + provider adapter contract
    ├── phases.md                  Phase 9 (core) → 10 (integration) exit criteria
    └── integration-test-plan.md   6–9h work breakdown, provider contract tests
```

Signature artifact materialized: `archive/ARCHIVE-RUNBOOK.md`.

## 6. Validation Checklist

- [ ] FlashFusion archive branch created and pushed; archive README complete
- [ ] Stripe/Printify/n8n subscriptions cancelled or downgraded (financial cleanup)
- [ ] Memory/notes updated with the archive decision + date
- [ ] Universal MCP Server: each provider adapter passes its contract test
- [ ] Phase 10 integration suite green before adding engineers
- [ ] Per-phase exit criteria defined (no open-ended "nudge" loops)
- [ ] Claims check completed (below)

## 7. Security Review

- FlashFusion held Stripe + Printify credentials — rotate/revoke on archive; do
  not leave live keys in a cold branch.
- Universal MCP Server brokers multiple provider credentials — store per-engineer
  tokens with quota, never shared global keys.

## 8. Recommended Next Steps

1. Finish the FlashFusion archive README **before** the context fades, then cut
   the branch and do financial cleanup.
2. Define Phase 10 exit criteria; complete the top-3 provider fixes against
   contract tests.
3. Build the 10→50 engineer seat/quota model before scaling.

## 9. CLAIMS CHECK

- **Verified:** FlashFusion's stack and the explicit "Archive and pivot" decision;
  the Universal MCP Server build through Phase 10.1 (ExpressServer refactor
  complete) and into 10.2/10.3 provider fixes; the archive checklist items.
- **Inferred:** per-phase exit criteria and the provider-adapter contract test are
  this kit's additions to stop the observed stall-and-nudge pattern.
- **Unresolved:** which FlashFusion assets are truly reusable; the concrete
  10→50 engineer scaling model; whether financial cleanup was completed.
- **Contradictions:** none.
