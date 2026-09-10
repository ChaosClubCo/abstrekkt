# Loxihart branch consolidation — 2026-08-26

## Scope

Repository: `Krosebrook/abstrekkt`

This record classifies historical Loxihart-related branches that remain in the Abstrekkt repository. It is intentionally repo-scoped: it governs whether those branches may be merged into Abstrekkt `main`; it does not migrate or mutate the canonical Loxihart product repository.

## Governing boundary

Current Abstrekkt repository instructions prohibit adding, editing, or deleting Loxihart runtime/product files under `loxihart/`; canonical runtime/product ownership belongs in `Krosebrook/Loxihart`.

Therefore a historical branch is not mergeable into Abstrekkt merely because it contains unique commits. Runtime code, product deployment workflows, product release state, and product-specific production gates must not be resurrected into Abstrekkt `main` through branch consolidation.

## Classification

| Branch | Classification | Abstrekkt action | Reason |
|---|---|---|---|
| `loxihart/export-only-2026-08-22` | SUPERSEDED / OUT-OF-SCOPE | DO NOT MERGE | Diverged historical Loxihart runtime/release branch. Contains `loxihart/pilot-console`, product CI/release workflows, product readiness evidence, and Loxihart-specific docs. Also extends `loxihart/production-gates-2026-08-21` by two commits. |
| `loxihart/production-gates-2026-08-21` | SUPERSEDED / OUT-OF-SCOPE | DO NOT MERGE | Ancestor family of export-only branch; contains product runtime, Netlify/pilot-console release workflows and production-gate evidence. |
| `loxihart-control-api` | SUPERSEDED / OUT-OF-SCOPE | DO NOT MERGE | Historical pilot-console/control-api runtime line. Product code belongs in `Krosebrook/Loxihart`. |
| `loxihart-netlify-hardening-deploy-20260824` | DUPLICATE / OUT-OF-SCOPE | DO NOT MERGE | Previously verified identical to `loxihart-control-api`; retaining both branches is provenance only. |
| `loxihart-post-release-hardening` | SUPERSEDED / OUT-OF-SCOPE | DO NOT MERGE | Historical pilot-console hardening line; `loxihart-control-api` was verified one commit ahead in the same lineage. |
| `loxihart-pilot-console` | ALREADY CONTAINED / HISTORICAL | NO MERGE NEEDED | Previously verified behind `main` with no unique commits. |
| `loxihart-pilot-console-v2` | ALREADY CONTAINED / HISTORICAL | NO MERGE NEEDED | Previously verified behind `main` with no unique commits. |
| `loxihart-production-release-runbook` | SUPERSEDED / OUT-OF-SCOPE | DO NOT MERGE | Historical Loxihart production release lane with product-specific workflows and runtime files. |
| `loxihart-production-release-runbook-v2` | SUPERSEDED / OUT-OF-SCOPE | DO NOT MERGE | Verified three commits ahead of the v1 runbook branch; still product-specific and outside Abstrekkt authority. |
| `release/loxihart-pilot-console-rc-2026-08-16` | SUPERSEDED / OUT-OF-SCOPE | DO NOT MERGE | Release-candidate branch for Loxihart pilot-console runtime. Historical evidence only in Abstrekkt. |
| `codex/loxihart-signed-conformance-gate` | ALREADY CONTAINED / HISTORICAL | NO MERGE NEEDED | Previously verified behind `main` with no unique commits. |
| `loxihart/lxh-e001-preregistered-pilot` | PARTIALLY PRESERVED / SUPERSEDED | DO NOT MERGE | Stale branch conflicted with a newer workflow. Missing evidence artifacts were preserved safely via PR #42 on a fresh branch from current `main`; stale branch was explicitly superseded. |

## Branch-family precedence

Where lineage was previously compared directly:

- `loxihart/export-only-2026-08-22` is two commits ahead of `loxihart/production-gates-2026-08-21`.
- `loxihart-control-api` is one commit ahead of `loxihart-post-release-hardening`.
- `loxihart-control-api` and `loxihart-netlify-hardening-deploy-20260824` were identical.
- `loxihart-production-release-runbook-v2` is three commits ahead of `loxihart-production-release-runbook`.

These lineage facts prevent duplicate merges, but they do not override repository authority. The descendants remain out-of-scope for Abstrekkt `main` when they contain Loxihart product/runtime state.

## Safe consolidation rule

For any future historical branch in this repository:

1. Compare it against current `main`.
2. If `ahead_by = 0`, classify as already contained; do not merge.
3. If unique commits exist, inspect changed paths before opening a merge PR.
4. If unique changes cross an authority boundary, do not merge the stale branch.
5. Preserve only repository-owned evidence/governance artifacts when there is a clear reason, using a fresh branch from current `main` and a narrow PR.
6. Never transplant Loxihart runtime/product code into Abstrekkt merely to reduce branch count.
7. Never force-update or delete historical branches solely for cosmetic cleanup; branch deletion is a separate explicit maintenance action.

## Current disposition

No remaining Loxihart-family branch requires a direct merge into Abstrekkt `main`.

Future Loxihart runtime/product work must begin in the canonical Loxihart repository. Future Abstrekkt work must begin from current Abstrekkt `main` on a fresh, narrowly scoped branch.
