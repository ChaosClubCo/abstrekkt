# Loxihart Workflow Classification — 2026-10-16

## Purpose

Classify remaining Loxihart-era GitHub Actions in `ChaosClubCo/abstrekkt` after current product/runtime authority moved to `ChaosClubCo/Loxihart`.

The rule is not "old means delete." Workflows are retained when they preserve replayable provenance, exact-source export, or custody verification. They are removed when they can mutate, rebuild, remediate, or otherwise imply active product ownership inside Abstrekkt's frozen `loxihart/` subtree.

## Authority boundary

- Current Loxihart product/runtime authority: `ChaosClubCo/Loxihart`.
- Abstrekkt `loxihart/`: frozen migration/historical source.
- Historical repository and branch names remain valid inside dated evidence where they were true at the time.

## Classification

| Workflow | Classification | Decision | Evidence / rationale |
| --- | --- | --- | --- |
| `.github/workflows/loxihart-export-only.yml` | Migration evidence | **RETAIN** | Read-only exact-source export from the dedicated historical export branch; records source commit, Git index, per-file SHA-256 values, archive hash, and uploads the extraction artifact. |
| `.github/workflows/loxihart-production-release.yml` | Historical replay evidence | **RETAIN** | Explicitly manual-only, exact-candidate-SHA checkout, same-SHA release gates, and uploaded evidence. It can replay a frozen historical candidate without claiming current ownership. |
| `.github/workflows/lxh-e001-custody-transport.yml` | Historical replay / custody evidence | **RETAIN** | Read-only, head-ref constrained, verifies a frozen Git blob and ciphertext digest, then uploads the exact corpus artifact. No repository mutation. |
| `.github/workflows/loxihart-rg01-import-lockfile.yml` | Obsolete automation | **REMOVE** | `contents: write`; imports and commits a lockfile into the frozen Loxihart subtree and pushes an old product branch. Current dependency work belongs in `ChaosClubCo/Loxihart`. |
| `.github/workflows/loxihart-rg01-remediate-netlify.yml` | Obsolete automation | **REMOVE** | `contents: write`; runs `npm install`, modifies product dependency files, commits them, and pushes an old Loxihart branch. This directly violates current ownership. |
| `.github/workflows/loxihart-rg02-extract-control-api.yml` | Obsolete mutation automation | **REMOVE** | `contents: write`; materializes source beneath `loxihart/control-api/` and commits/pushes it. The source history remains in Git; future extraction belongs in migration tooling, not active mutation automation. |
| `.github/workflows/pilot-console-ci.yml` | Obsolete automation | **REMOVE** | PR-triggered CI continues to install/test/build the frozen Pilot Console subtree and produces product build artifacts, implying an active product lane in Abstrekkt. |
| `.github/workflows/pilot-console-live-probe.yml` | Obsolete safety sentinel | **REMOVE** | Only emits a disabled-live-probe message on an old branch. It preserves no unique provenance and no longer protects the canonical runtime. |
| `.github/workflows/pilot-console-live-release.yml` | Obsolete safety sentinel | **REMOVE** | Only emits a disabled-live-release message and exits non-zero. It preserves no unique provenance and exposes a misleading manual release control in the wrong repository. |

## Retention invariant

The retained workflows must remain bounded to historical/export/custody behavior. A later change that adds product mutation, current deployment, dependency remediation, or moving-ref release behavior to any retained workflow requires reclassification.

## Removal invariant

Removing obsolete workflow files does **not** remove their Git history, previous run history, release receipts, migration evidence, or frozen product source. Those records remain available for provenance and forensic review.

## Current routing

All new Loxihart runtime, product, dependency, security, release, test, and deployment work must route to `ChaosClubCo/Loxihart`. Abstrekkt may retain migration receipts, source/target verification, public portfolio relationship material, and historical evidence outside the frozen product subtree.
