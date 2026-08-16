# Launch Control

This directory is the cross-product launch-control plane for five extracted products audited from four source repositories.

## Audited sources

| Product | Source repository | Audited head |
|---|---|---|
| Crossing | `Krosebrook/Crossing` | `d788862eabef286c4c1c71ed145c77e275b0cd0a` |
| Sticker Room | `Krosebrook/crinkle-n-crease` | `edcebd9b86aac4b801861e4eade45b03d9ecb2c6` |
| Kids Radio Studio | `Krosebrook/Talk-2-me` | `8205a5eefc70b677a682b76b3b81f93cd37343d2` |
| Voice Studio | `Krosebrook/Talk-2-me` | `8205a5eefc70b677a682b76b3b81f93cd37343d2` |
| Release Tester | `Krosebrook/beta-tester-army` | `def23fbd2721895711db075e443cd4ceada1959d` |

Audit generated: `2026-08-16T18:27:00-05:00`.

## Files

- `launch-audit.yaml` is the canonical machine-readable evidence and gate state.
- `dependency-map.yaml` maps repository paths to components, products, exact check IDs, and invalidation scope.
- `README.md` documents this control contract.

The human dashboard must be derived from `launch-audit.yaml`. It must never independently assign a greener state.

## Status contract

- `GO`: every required check is `PASS` against the current release commit/build, no reruns are pending, and no `UNKNOWN_IMPACT` remains.
- `HOLD`: no required check has failed, but evidence is missing, not run, invalidated, blocked, stale, or an impact is unresolved.
- `STOP_SHIP`: at least one required check is `FAIL`.
- `NOT_STARTED`: the product has not entered its defined verification stage.

A product may become `STOP_SHIP` automatically. It may not become `GO` manually.

## Release-commit invalidation

Verification belongs to a commit/build, not to an application name.

For each proposed release change:

1. Compare the last verified SHA with the proposed release SHA.
2. Enumerate changed paths.
3. Resolve each path through `dependency-map.yaml`.
4. Resolve component -> product -> check IDs.
5. Mark affected current `PASS` evidence `INVALIDATED`.
6. Preserve the historical result and invalidating commit.
7. Return every affected product to `HOLD`.
8. Populate its rerun queue.
9. Rerun prerequisite checks before dependent E2E checks.
10. Restore `GO` only when every required check is current and passing.

`INVALIDATED` is not a failure. It causes `HOLD`. A failed rerun causes `STOP_SHIP`.

## Unknown-impact rule

A changed production source/config path that is not confidently mapped is never silently treated as safe.

It produces an `UNKNOWN_IMPACT` record and blocks `GO` until the path is:

- mapped to a known component,
- explicitly classified as non-functional, or
- proven irrelevant to the extracted product.

The initial audit intentionally contains open `UNKNOWN_IMPACT` records where the repository boundary has not been traced deeply enough. That is a feature, not clerical pessimism.

## Current audit posture

This initial artifact is a **GitHub structural/source audit**. Repository heads, implementation surfaces, build configuration, and existing test surfaces were inspected. The audit did **not** execute release builds or gate suites.

Therefore source inspection is recorded as `OBSERVED`, not `EXECUTED`, and no required gate receives a synthetic `PASS`.

| Product | State | Why |
|---|---|---|
| Crossing | `HOLD` | Required launch checks are not yet executed; one utility-path impact remains unresolved. |
| Sticker Room | `HOLD` | Required launch checks are not yet executed. |
| Kids Radio Studio | `NOT_STARTED` | Shared-core verification milestone has not begun; extraction boundary still has unresolved shared paths. |
| Voice Studio | `NOT_STARTED` | Shared-core verification milestone has not begun; extraction boundary still has unresolved shared paths. |
| Release Tester | `NOT_STARTED` | Extraction milestone has not begun; parent-platform dependencies remain unresolved. |

## Milestones

- Crossing: RC 2026-08-21; closed test 2026-08-23; final QA 2026-09-13; launch gate 2026-09-15.
- Sticker Room: RC 2026-08-26; closed test 2026-08-30; final QA 2026-09-13; launch gate 2026-09-15.
- Kids Radio Studio: shared-core freeze 2026-08-28; closed beta 2026-09-01; beta QA 2026-09-13; expansion gate 2026-09-15.
- Voice Studio: shared-core freeze 2026-08-28; closed beta 2026-09-04; beta QA 2026-09-13; controlled-beta gate 2026-09-15.
- Release Tester: extraction start 2026-09-05; beta RC 2026-09-09; final QA 2026-09-13; public-beta gate 2026-09-15.

## Evidence discipline

Every required check must always have exactly one current evidence record. Missing proof is represented explicitly with `MISSING` or `NOT_RUN`; it is never omitted.

Allowed evidence results: `PASS`, `FAIL`, `MISSING`, `NOT_RUN`, `INVALIDATED`, `BLOCKED`.

Allowed provenance: `OBSERVED`, `EXECUTED`, `SIMULATED`, `INFERRED`, `SYNTHETIC`, `UNVERIFIED`.

Reading code is `OBSERVED`. A test or build may only become `EXECUTED` after it actually runs against the recorded commit/build.

## GO invariant

A gate may report `GO` only when:

```text
release SHA exists
AND every required check == PASS
AND failed == 0
AND missing == 0
AND not_run == 0
AND invalidated == 0
AND blocked == 0
AND pending reruns == 0
AND unresolved UNKNOWN_IMPACT == 0
AND every accepted evidence record is valid for the exact release commit/build
```

If the machine artifact and prose disagree, the machine artifact wins.
