# Execution Architect

This subtree is the canonical repository binding for the Abstrekkt Execution Architect governance/execution program.

## Canonical binding

- Repository: `Krosebrook/abstrekkt`
- Path: `governance/execution-architect/`
- Branch authority: `main`
- Lifecycle: `ACTIVE`
- Previous `ChaosClubCo/execution-architect-skills` lineage: historical/recovery reference only; not current authority unless a future ADR explicitly supersedes this binding.

## Canonical work operating system

- [`CANONICAL_WORK_OS.md`](CANONICAL_WORK_OS.md) — governing task-state, evidence, priority, dependency, stale-work, conflict, and reporting contract.
- [`canonical-work-state.v1.json`](canonical-work-state.v1.json) — base machine-readable 21-task cross-project projection.
- [`canonical-work-state.delta.2026-08-31T1315-0500.json`](canonical-work-state.delta.2026-08-31T1315-0500.json) — latest reconciliation delta; apply after the base projection.

### Read order until TSYS-001 is verified

1. Read `canonical-work-state.v1.json` as the base projection.
2. Apply reconciliation deltas in chronological order.
3. Never interpret repository persistence of the projection as proof of event-sourced canonical authority.
4. When `TSYS-001` passes append-only ledger, deterministic-writer, replay, idempotency/sequence, and projection-hash gates, the ledger/reducer output supersedes this interim base-plus-delta reconstruction method.

Repository persistence of the operating contract and provisional projection is now evidenced on `main`; however, the work-state authority remains **provisional until `TSYS-001` is verified**. The intended final authority is an append-only task-event ledger with deterministic projection replay and evidence-bound state transitions.

## Authority model

Execution Architect may read approved evidence and propose implementation phases, acceptance predicates, receipts, and remediation. Mutation requires an explicitly authorized execution environment. Promotion and certification require machine-evaluated evidence contracts; natural-language judgment is not sufficient.

## Evidence model

The target contract family includes phase receipts, nested command/test/invariant/artifact/evidence/repository bindings, receipt-chain manifests, conformance reports, and executable acceptance predicates.

Any implementation placed here must preserve revision-bound evidence and must not claim `VERIFIED`, `DEPLOYED`, or `CERTIFIED` from source presence alone.
