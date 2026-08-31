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
- [`canonical-work-state.v1.json`](canonical-work-state.v1.json) — current machine-readable cross-project task projection.

The JSON projection is explicitly **provisional until `TSYS-001` is verified**. The intended final authority is an append-only task-event ledger with deterministic projection replay and evidence-bound state transitions; repository presence or conversational reconstruction does not satisfy that gate.

## Authority model

Execution Architect may read approved evidence and propose implementation phases, acceptance predicates, receipts, and remediation. Mutation requires an explicitly authorized execution environment. Promotion and certification require machine-evaluated evidence contracts; natural-language judgment is not sufficient.

## Evidence model

The target contract family includes phase receipts, nested command/test/invariant/artifact/evidence/repository bindings, receipt-chain manifests, conformance reports, and executable acceptance predicates.

Any implementation placed here must preserve revision-bound evidence and must not claim `VERIFIED`, `DEPLOYED`, or `CERTIFIED` from source presence alone.
