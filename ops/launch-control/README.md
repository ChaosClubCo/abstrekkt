# Launch Control

This directory is the cross-product launch-control plane for five extracted products audited from four source repositories.

`launch-audit.yaml` is the canonical current evidence and gate-state artifact. `dependency-map.yaml` is the canonical dependency/invalidation contract. This README is a human-readable projection of those two machine files and must never assign a greener state independently.

## Canonical products and audited heads

| Product ID | Product | Source repository | Audited head | Lifecycle |
|---|---|---|---|---|
| `crossing` | Crossing | `Krosebrook/Crossing` | `d788862eabef286c4c1c71ed145c77e275b0cd0a` | `VERIFYING` |
| `sticker-room` | Sticker Room | `Krosebrook/crinkle-n-crease` | `edcebd9b86aac4b801861e4eade45b03d9ecb2c6` | `VERIFYING` |
| `kids-radio` | Kids Radio Studio | `Krosebrook/Talk-2-me` | `8205a5eefc70b677a682b76b3b81f93cd37343d2` | `VERIFYING` |
| `voice-studio` | Voice Studio | `Krosebrook/Talk-2-me` | `8205a5eefc70b677a682b76b3b81f93cd37343d2` | `VERIFYING` |
| `release-tester` | Release Tester | `Krosebrook/beta-tester-army` | `def23fbd2721895711db075e443cd4ceada1959d` | `VERIFYING` |

Audit/control contract updated: `2026-08-17T07:05:00-05:00`.

## Required checks

The canonical check sets live in both machine files and must match exactly.

- `crossing`: 9 required checks
- `sticker-room`: 8 required checks
- `kids-radio`: 8 required checks
- `voice-studio`: 8 required checks
- `release-tester`: 9 required checks

Total: **42 required checks**.

Every required check has exactly one current evidence record in `launch-audit.yaml`.

## Evidence-state contract

Allowed current evidence states are mutually exclusive:

- `PASS`
- `FAIL`
- `MISSING`
- `NOT_RUN`
- `INVALIDATED`
- `BLOCKED`

A check waiting on prerequisite checks is `BLOCKED` in both its evidence record and rerun queue. It is not simultaneously counted as `NOT_RUN`.

Allowed provenance values remain:

- `OBSERVED`
- `EXECUTED`
- `SIMULATED`
- `INFERRED`
- `SYNTHETIC`
- `UNVERIFIED`

Reading source code is `OBSERVED`. A gate may only become `EXECUTED` after an actual verification action runs against the recorded commit/build.

## Lifecycle and status derivation

Lifecycle states are:

- `PLANNED`
- `VERIFYING`
- `RELEASE_CANDIDATE`
- `RELEASED`

`NOT_STARTED` is only valid when a product is still `PLANNED` **and** no current evidence set or rerun queue has been created.

Because all five products now have current evidence records and active rerun queues, all five are `VERIFYING`.

Gate status is derived in this order:

1. Any required `FAIL` => `STOP_SHIP`.
2. Otherwise, any required `MISSING`, `NOT_RUN`, `INVALIDATED`, or `BLOCKED` => `HOLD`.
3. Otherwise, any pending/blocked rerun, open `BASELINE_MAPPING_GAP`, open `UNKNOWN_IMPACT`, or missing release SHA => `HOLD`.
4. `GO` requires every required check to be `PASS` for the exact current release commit/build and every blocker count to be zero.

There is no manual path to `GO`.

## Current statuses

| Product | Evidence state counts | Rerun queue | Baseline gaps | Unknown change impacts | Status |
|---|---|---|---:|---:|---|
| Crossing | 7 `NOT_RUN`, 2 `BLOCKED` | 7 pending, 2 blocked | 1 | 0 | `HOLD` |
| Sticker Room | 6 `NOT_RUN`, 2 `BLOCKED` | 6 pending, 2 blocked | 0 | 0 | `HOLD` |
| Kids Radio Studio | 7 `NOT_RUN`, 1 `BLOCKED` | 7 pending, 1 blocked | 2 | 0 | `HOLD` |
| Voice Studio | 7 `NOT_RUN`, 1 `BLOCKED` | 7 pending, 1 blocked | 2 | 0 | `HOLD` |
| Release Tester | 8 `NOT_RUN`, 1 `BLOCKED` | 8 pending, 1 blocked | 2 | 0 | `HOLD` |

No product is currently `GO` or `STOP_SHIP`. No launch gate or release build was executed by this structural audit.

## Release-commit invalidation

Verification belongs to an exact commit/build, never merely to an application name.

For each proposed release change:

1. Compare the last verified SHA with the proposed release SHA.
2. Enumerate changed paths.
3. Resolve each changed path through `dependency-map.yaml`.
4. Resolve path -> component -> affected product -> exact check IDs.
5. Mark affected current `PASS` evidence `INVALIDATED` and preserve its historical result.
6. Attach the invalidating commit/change record.
7. Move any `VERIFYING`, `RELEASE_CANDIDATE`, or `RELEASED` affected product to `HOLD`.
8. Populate its rerun queue.
9. Run prerequisite checks before dependent integration/E2E checks.
10. Restore `GO` only when all required evidence is current and passing against the exact release SHA/build.

A code change is not itself a failure. `INVALIDATED` causes `HOLD`; a failed rerun causes `STOP_SHIP`.

## Scoped vs release-wide invalidation

`SCOPED_FUNCTIONAL` changes invalidate only the exact checks listed for the matched component.

`RELEASE_WIDE` is deterministic: if a component is classified `RELEASE_WIDE` or has `invalidate_all_required_checks: true`, **every required check for every listed affected product is invalidated**, regardless of narrower component mappings.

The current release-wide groups cover build/runtime/dependency contracts for:

- Crossing
- Sticker Room
- the shared Talk-2-me runtime used by Kids Radio and Voice Studio
- Release Tester / Beta Tester Army

## Baseline mapping gaps vs change-time unknown impacts

These are intentionally different objects.

### `BASELINE_MAPPING_GAP`

Created during structural auditing when existing production code cannot yet be mapped to a component or proven irrelevant. It blocks `GO`, but it is **not** an invalidation event because no changed-path comparison caused it.

Current baseline gaps:

- Crossing: `app/src/main/java/com/example/utils/`
- Talk-2-me: `src/components/AiMagicLab.tsx`
- Talk-2-me: `src/data.ts`
- Beta Tester Army: `src/agents/`
- Beta Tester Army: `src/pages/`

### `UNKNOWN_IMPACT`

Created only when a **changed** production path cannot be resolved through a `NON_FUNCTIONAL`, `SCOPED_FUNCTIONAL`, or `RELEASE_WIDE` rule. It blocks `GO`, triggers impact review, and invalidates potentially affected evidence conservatively.

There are currently **zero** change-time `UNKNOWN_IMPACT` records because this audit did not compare a new product release commit against previously verified product evidence.

## Sticker asset mapping

`app/src/main/res/**` in `Krosebrook/crinkle-n-crease` is explicitly mapped as component `sticker-assets` and affects `S-ASSET-01` and `S-EXPORT-01`. Resource changes therefore no longer fall through to an unmapped-path result.

## Rerun queue contract

Every queue item references one current evidence record. Queue state and evidence state must agree:

- queue `PENDING` corresponds to an actionable non-passing evidence record such as `NOT_RUN` or `INVALIDATED`;
- queue `BLOCKED` corresponds to evidence `BLOCKED` and must list its prerequisite checks;
- dependent E2E checks do not run until prerequisites pass.

Rerun counts are separate from evidence counts and are not added into the evidence-state totals.

## GO invariant

A product may report `GO` only when:

```text
release SHA exists
AND lifecycle_state != PLANNED
AND every required check == PASS
AND failed == 0
AND missing == 0
AND not_run == 0
AND invalidated == 0
AND blocked == 0
AND pending reruns == 0
AND blocked reruns == 0
AND open BASELINE_MAPPING_GAP == 0
AND open UNKNOWN_IMPACT == 0
AND every accepted evidence record is valid for the exact release commit/build
```

## Self-validation

`launch-audit.yaml` now reports `artifact_validation.result: PASS` only for **control-artifact structural consistency**. That does not mean any product passed its launch gate.

The validation asserts that:

- canonical product IDs match across files;
- all 42 required checks match across files;
- audited SHAs match across files;
- every required check has exactly one current evidence record;
- evidence states are mutually exclusive;
- evidence and rerun states agree;
- gate-state counts equal required-check counts;
- rerun counts equal queue items;
- release-wide invalidation covers every required check;
- baseline mapping gaps and change-time unknown impacts are separate concepts;
- Sticker Room resource paths are mapped;
- lifecycle/status derivation is deterministic;
- no product can become `GO` while any blocker remains.

If either machine artifact and this README disagree, the machine artifacts win and the control plane must be treated as inconsistent until corrected.
