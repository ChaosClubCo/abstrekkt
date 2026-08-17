# Launch Control

This directory is the cross-product launch-control plane for five extracted products audited from four source repositories.

## Authority chain

The launch-control files have distinct responsibilities. Do not duplicate or reinterpret their rules elsewhere.

1. `launch-audit.yaml` — canonical current evidence, rerun queues, baseline gaps, release identities, and current gate decisions.
2. `dependency-map.yaml` — canonical path → component → product → check dependency and invalidation contract.
3. `status-contract.yaml` — canonical status precedence, FAIL trust boundary, HOLD-to-GO predicate, and required per-product gate fields.
4. `execution-plan.yaml` — canonical 42-check prerequisite waves, critical paths, and concurrent baseline-gap work.
5. `README.md` — human-readable projection only. It must never assign a greener state than the machine artifacts.

If the machine artifacts disagree, the control plane is inconsistent and no product may be promoted to `GO` until the inconsistency is resolved.

## Canonical products and audited heads

| Product ID | Product | Source repository | Audited head | Lifecycle |
|---|---|---|---|---|
| `crossing` | Crossing | `Krosebrook/Crossing` | `d788862eabef286c4c1c71ed145c77e275b0cd0a` | `VERIFYING` |
| `sticker-room` | Sticker Room | `Krosebrook/crinkle-n-crease` | `edcebd9b86aac4b801861e4eade45b03d9ecb2c6` | `VERIFYING` |
| `kids-radio` | Kids Radio Studio | `Krosebrook/Talk-2-me` | `8205a5eefc70b677a682b76b3b81f93cd37343d2` | `VERIFYING` |
| `voice-studio` | Voice Studio | `Krosebrook/Talk-2-me` | `8205a5eefc70b677a682b76b3b81f93cd37343d2` | `VERIFYING` |
| `release-tester` | Release Tester | `Krosebrook/beta-tester-army` | `def23fbd2721895711db075e443cd4ceada1959d` | `VERIFYING` |

## Required checks

The canonical check sets live in the machine artifacts and total **42 required checks**:

- `crossing`: 9
- `sticker-room`: 8
- `kids-radio`: 8
- `voice-studio`: 8
- `release-tester`: 9

Every required check must have exactly one current evidence record.

## Evidence-state contract

Allowed current evidence states are mutually exclusive:

- `PASS`
- `FAIL`
- `MISSING`
- `NOT_RUN`
- `INVALIDATED`
- `BLOCKED`

Allowed provenance values:

- `OBSERVED`
- `EXECUTED`
- `SIMULATED`
- `INFERRED`
- `SYNTHETIC`
- `UNVERIFIED`

Reading source code is `OBSERVED`. A launch check may only become executable release evidence after an actual verification action runs against the recorded release identity.

## Canonical status precedence

`status-contract.yaml` is authoritative.

Status derivation order is:

```text
1. trusted required FAIL exists     -> STOP_SHIP
2. control plane invalid            -> HOLD
3. PLANNED + no evidence + no queue -> NOT_STARTED
4. complete HOLD-to-GO predicate    -> GO
5. anything else unresolved         -> HOLD
```

### Trusted FAIL boundary

A required-check `FAIL` may produce `STOP_SHIP` only when it is a trusted current failure. At minimum it must:

- belong to a canonical product and required check;
- be the sole current evidence record for that check;
- have `current_result: FAIL`;
- have provenance `EXECUTED`;
- have an execution timestamp;
- be tied to the current release commit;
- have an evidence artifact or execution reference;
- satisfy the evidence schema;
- satisfy build binding when the check is build-bound or a build ID is populated.

An untrusted or malformed FAIL does **not** become a fake STOP-SHIP. It creates `CONTROL_EVIDENCE_INCONSISTENCY` and keeps the product `HOLD` until reconciled, unless another trusted required FAIL exists.

A rerun queue item marked `FAILED` must reconcile to one current required evidence record marked `FAIL`. If the two disagree, that is a control-plane inconsistency.

## Lifecycle

Allowed lifecycle states:

- `PLANNED`
- `VERIFYING`
- `RELEASE_CANDIDATE`
- `RELEASED`

`NOT_STARTED` is valid only when lifecycle is `PLANNED` and neither a current evidence set nor rerun queue exists.

All five products currently have current evidence and active rerun queues, so all five remain `VERIFYING`.

## HOLD-to-GO invariant

A product may report `GO` only when all of the following are true at the same time:

```text
release commit SHA exists
AND release build ID exists
AND lifecycle is VERIFYING, RELEASE_CANDIDATE, or RELEASED
AND exactly one current evidence record exists per required check
AND every required check == PASS
AND every required PASS has provenance EXECUTED
AND every required PASS is valid for the exact release commit/build
AND FAIL == 0
AND MISSING == 0
AND NOT_RUN == 0
AND INVALIDATED == 0
AND BLOCKED == 0
AND stale evidence == 0
AND rerun-required evidence == 0
AND pending reruns == 0
AND blocked reruns == 0
AND running reruns == 0
AND failed reruns == 0
AND unresolved reruns == 0
AND open BASELINE_MAPPING_GAP == 0
AND open UNKNOWN_IMPACT == 0
AND unresolved invalidation events == 0
AND control-artifact validation == PASS
```

There is no manual path to `GO`.

## Current statuses

| Product | Evidence state counts | Rerun queue | Baseline gaps | Unknown change impacts | Status |
|---|---|---|---:|---:|---|
| Crossing | 7 `NOT_RUN`, 2 `BLOCKED` | 7 pending, 2 blocked | 1 | 0 | `HOLD` |
| Sticker Room | 6 `NOT_RUN`, 2 `BLOCKED` | 6 pending, 2 blocked | 0 | 0 | `HOLD` |
| Kids Radio Studio | 7 `NOT_RUN`, 1 `BLOCKED` | 7 pending, 1 blocked | 2 | 0 | `HOLD` |
| Voice Studio | 7 `NOT_RUN`, 1 `BLOCKED` | 7 pending, 1 blocked | 2 | 0 | `HOLD` |
| Release Tester | 8 `NOT_RUN`, 1 `BLOCKED` | 8 pending, 1 blocked | 2 | 0 | `HOLD` |

No product is currently `GO` or `STOP_SHIP`.

## 42-check execution plan

`execution-plan.yaml` is the canonical schedule.

The dependency graph has a minimum depth of **three waves**:

### Wave 1 — 35 checks

Run all prerequisite-free checks in parallel where execution capacity permits.

- Crossing: 7
- Sticker Room: 6
- Kids Radio Studio: 7
- Voice Studio: 7
- Release Tester: 8

### Wave 2 — 6 checks

After prerequisites pass:

- `C-FLOW-01`
- `S-PERSIST-02`
- `S-EXPORT-01`
- `KR-E2E-01`
- `VS-E2E-01`
- `RT-E2E-01`

### Wave 3 — 1 check

After `C-FLOW-01` passes:

- `C-STABILITY-01`

The 42 checks are therefore **35 + 6 + 1**, not 42 sequential actions.

## Baseline-gap work

Baseline mapping gaps are not part of the 42 checks, but they block `GO` and should be resolved concurrently with Wave 1.

Current gaps:

- `BMG-CROSS-001` — `Krosebrook/Crossing/app/src/main/java/com/example/utils/`
- `BMG-TALK-001` — `Krosebrook/Talk-2-me/src/components/AiMagicLab.tsx`
- `BMG-TALK-002` — `Krosebrook/Talk-2-me/src/data.ts`
- `BMG-BTA-001` — `Krosebrook/beta-tester-army/src/agents/`
- `BMG-BTA-002` — `Krosebrook/beta-tester-army/src/pages/`

A baseline gap closes only when the path is mapped to a known component/check scope or is explicitly proven irrelevant and its resolution state is recorded as closed.

## Baseline gaps vs change-time UNKNOWN_IMPACT

These are intentionally different objects.

### `BASELINE_MAPPING_GAP`

Created during structural auditing when existing production code cannot yet be mapped or proven irrelevant. It blocks `GO`, but it is not a change-time invalidation event.

### `UNKNOWN_IMPACT`

Created when a **changed** production path cannot be resolved through `NON_FUNCTIONAL`, `SCOPED_FUNCTIONAL`, or `RELEASE_WIDE` rules. It blocks `GO`, triggers impact review, and conservatively invalidates potentially affected evidence.

There are currently zero change-time `UNKNOWN_IMPACT` records.

## Release-commit invalidation

Verification belongs to an exact release identity, never merely an application name.

For each proposed release change:

1. Compare the last verified SHA with the proposed release SHA.
2. Enumerate changed paths.
3. Resolve each changed path through `dependency-map.yaml`.
4. Resolve path -> component -> product -> exact check IDs.
5. Mark affected current `PASS` evidence `INVALIDATED` and preserve its historical result.
6. Attach the invalidating commit/change record.
7. Keep or return affected products to `HOLD`.
8. Populate the rerun queue.
9. Run prerequisite checks before dependent integration/E2E checks.
10. Restore `GO` only when `status-contract.yaml` evaluates true.

`INVALIDATED` is not a product failure. It causes `HOLD`. A trusted failed rerun causes `STOP_SHIP`.

## Scoped vs release-wide invalidation

`SCOPED_FUNCTIONAL` changes invalidate only the exact checks listed for the matched component.

`RELEASE_WIDE` is deterministic: if a component is classified `RELEASE_WIDE` or has `invalidate_all_required_checks: true`, every required check for every listed affected product is invalidated.

The current release-wide groups cover:

- Crossing build/runtime/dependency contract
- Sticker Room build/runtime/dependency contract
- shared Talk-2-me runtime used by Kids Radio Studio and Voice Studio
- Release Tester / Beta Tester Army build/runtime/dependency contract

## Sticker asset mapping

`app/src/main/res/**` in `Krosebrook/crinkle-n-crease` maps to `sticker-assets` and affects `S-ASSET-01` and `S-EXPORT-01`.

## Rerun queue contract

Every queue item references one current evidence record.

- queue `PENDING` corresponds to an actionable non-passing evidence state such as `NOT_RUN` or `INVALIDATED`;
- queue `BLOCKED` corresponds to evidence `BLOCKED` and lists its prerequisites;
- queue `FAILED` must reconcile to current evidence `FAIL`;
- dependent checks do not execute until prerequisites pass;
- queue counts remain separate from evidence-state counts.

## Promotion shape by product

| Product | Required PASS | Final critical check(s) | Baseline gaps required closed | Current status |
|---|---:|---|---:|---|
| Crossing | 9 | `C-STABILITY-01` | 1 | HOLD |
| Sticker Room | 8 | `S-PERSIST-02`, `S-EXPORT-01` | 0 | HOLD |
| Kids Radio Studio | 8 | `KR-E2E-01` | 2 | HOLD |
| Voice Studio | 8 | `VS-E2E-01` | 2 | HOLD |
| Release Tester | 9 | `RT-E2E-01` | 2 | HOLD |

Passing the final critical check does not itself produce `GO`. It only removes the last check-level blocker. The full status predicate must then evaluate true.

## Self-validation

`launch-audit.yaml` currently reports `artifact_validation.result: PASS` for the original three-file structural consistency checks. `status-contract.yaml` and `execution-plan.yaml` are additive canonical contracts and must remain consistent with those machine artifacts.

At minimum, validation must continue to assert:

- canonical product IDs match;
- all 42 required checks match;
- audited SHAs match;
- every required check has exactly one current evidence record;
- evidence states are mutually exclusive;
- evidence and rerun states agree;
- gate-state counts equal required-check counts;
- rerun counts equal queue items;
- release-wide invalidation covers every required check;
- baseline mapping gaps and change-time unknown impacts remain separate;
- lifecycle/status derivation is deterministic;
- no product can become `GO` while any blocker remains.
