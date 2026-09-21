# CANONICAL_STATE

**As of:** 2026-08-21  
**Authority:** CURRENT CANONICAL  
**Repository:** `Krosebrook/abstrekkt`

## Organization boundary

| Surface | Current responsibility |
|---|---|
| **Abstrekkt** | Holding company and public publishing/marketing surface: essays, research, case material, public thinking, qualification and market narrative. |
| **Loxihart** | Operating company and commercial/product surface: client invoicing, workflow verification, canonical state, evidence, governance, interoperability and implementation. |
| Historical predecessor material | Archived research, design exploration and prior product thinking only. It is not current authority. |

## Commercial offer

**Primary offer:** Verified AI Workflow Pilot  
**Current anchor price:** $4,500  
**Buyer focus:** organizations that need AI workflows to be demonstrably correct, authorized, observable and recoverable.

## Current product kernel

Observed in this repository:

- `loxihart/canonical-truth`
- `loxihart/change-receipt`
- `loxihart/control-api`
- `loxihart/floot-proxy-reference`
- `loxihart/pilot-console`

The target architecture still separates gateway, orchestration, governance, context, evidence and provider adapters, but only implemented/repository-backed components may be described as live.

## Frozen release candidate

- **Candidate SHA:** `a237db22e7159df2327d0b92ca624079ac124ff8`
- **Frozen ref:** `release/loxihart-pilot-console-rc-2026-08-16`
- **Status:** `NOT_PRODUCTION_DATA_ELIGIBLE`

### Gate state

| Gate | State | Current evidence |
|---|---|---|
| Existing Pilot Console unit/build CI | PASS | 26/26 tests pass; production build passed |
| RG-01 Dependency Safety | FAIL | Missing reproducible lockfile requirement; previous install also surfaced high-severity dependency findings |
| RG-02 Authentication + Tenant Isolation | FAIL / STOP | Required release test is absent on frozen candidate |
| RG-03 Managed Signing-Key Custody | FAIL / STOP | Required release test is absent on frozen candidate |
| RG-04 Demo/Auth-Fallback Elimination | FAIL | Executable demo identity/token fallback remains on frozen candidate |
| Canonical-truth verifier/runtime | PASS WITH SCOPE | Fresh 5/5 verifier/runtime tests pass |
| Canonical-truth full D1 package | PASS, prior identical subtree | Recorded 7/7 package tests on identical subtree |
| DR release qualification | BLOCKED | No candidate-bound completed DR suites; required three-suite streak is unproven |

## Hard invariant

Canonical state must never advance merely because an external workflow executed.

A canonical commit requires:
1. authorized intent;
2. verified evidence;
3. valid policy and approval context;
4. version/head consistency;
5. immutable receipt/evidence binding;
6. atomic canonical-state advancement.

External success with failed verification is a failed or escalated run with canonical state unchanged.

## Authority order

1. `docs/loxihart/CANONICAL_STATE.md`
2. Exact repository evidence at a named commit SHA
3. Current acceptance manifests, receipts and gate results
4. Current Loxihart architecture/product documents
5. Current Abstrekkt public/design documents
6. Historical archived packages
7. General reference/research material

Newest timestamp alone does not confer authority.

## Promotion rule

No production-data eligibility claim is allowed until a new frozen SHA passes, on the same SHA:

`RG-01 → RG-02 → RG-03 → RG-04 → DR qualification`

The current frozen candidate must remain immutable. Fixes create a new candidate SHA.
