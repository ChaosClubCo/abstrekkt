# Abstrekkt Site Platform Core — Portfolio Atlas v1

Status: IMPLEMENTED on this branch. Verification is revision-bound and must be re-run after changes.

Authority domain: `abstrekkt_publication`  
Canonical repository: `ChaosClubCo/abstrekkt`  
Runtime/product authority for Loxihart remains external: `ChaosClubCo/Loxihart`.

## Purpose

The Portfolio Atlas is the evidence-backed identity and source layer for public portfolio surfaces. It separates:

- an entity's identity;
- its owning authority domain;
- repository discovery;
- repository verification;
- public publication state;
- claim maturity;
- evidence provenance;
- safe public projection.

It does not infer publication readiness from repository existence and does not treat a connected repository as proof of deployment, operational status, customer outcomes, or production readiness.

## Files

| File | Role |
| --- | --- |
| `portfolio-atlas.schema.json` | Versioned data contract |
| `source-registry.json` | Evidence-bearing canonical source registry |
| `public-atlas.json` | Privacy-safe generated public projection |
| `validate.mjs` | Dependency-free deterministic validator |
| `build-public.mjs` | Deterministic public projection generator |
| `test.mjs` | Contract and fail-closed behavior tests |

## Core rules

1. `repository.state=VERIFIED` requires an exact repository name, default branch, exact 40-character head SHA, and checked timestamp.
2. A verified repository does not imply deployment or production readiness.
3. Unknown repository mappings remain `UNKNOWN`.
4. Public descriptions may only use claims whose `claim_status` is `VERIFIED` or `SUPPORTED`.
5. `INTERNAL`, `PROVISIONAL`, `HISTORICAL`, and `UNVERIFIED` claims are excluded from the public projection.
6. Loxihart runtime/product authority always resolves to `ChaosClubCo/Loxihart`; this registry is publication/evidence only.
7. Private repository URLs and exact private revision SHAs are not emitted into `public-atlas.json`.

## Validation

Run from the repository root:

```bash
node docs/site-platform/portfolio-atlas/validate.mjs
node docs/site-platform/portfolio-atlas/build-public.mjs --check
node docs/site-platform/portfolio-atlas/test.mjs
```

## Maturity vocabulary

- VERIFIED — primary evidence confirms the claim.
- SUPPORTED — evidence supports the claim, but not to the VERIFIED threshold.
- INTERNAL — known internally; not public proof.
- PROVISIONAL — requires validation.
- HISTORICAL — previously true or retained for provenance.
- UNVERIFIED — do not present publicly as fact.

Repository state and claim maturity are deliberately separate.
