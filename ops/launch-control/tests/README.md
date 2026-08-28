# Launch-Control Conformance Tests

This directory tests `../status-contract.yaml` and `../execution-plan.yaml` as executable release-control contracts.

## Files

- `status-fixtures.json` — adversarial behavioral fixtures for status precedence and evidence trust.
- `status-conformance.mjs` — dependency-free Node 22 conformance runner.
- `conformance-report.json` — latest recorded validation result.
- `.github/workflows/launch-control-conformance.yml` — repository CI entrypoint.

## Run

```bash
node ops/launch-control/tests/status-conformance.mjs
```

The runner writes `conformance-report.json` and exits non-zero on either a behavioral mismatch or a static/semantic contract mismatch.

## Covered cases

The fixture set covers:

- trusted required FAIL -> `STOP_SHIP`;
- trusted FAIL colliding with control warnings, pending reruns, and baseline gaps;
- untrusted/malformed/stale FAIL -> `CONTROL_EVIDENCE_INCONSISTENCY` + `HOLD`;
- failed rerun reconciliation with current evidence;
- control-artifact invalidity precedence;
- valid and invalid `NOT_STARTED` cases;
- HOLD from baseline gaps, `UNKNOWN_IMPACT`, unresolved invalidation, pending/blocked/running reruns, missing build identity, stale evidence, `NOT_RUN`, `BLOCKED`, `MISSING`, and `INVALIDATED`;
- clean `GO` for `VERIFYING`, `RELEASE_CANDIDATE`, and `RELEASED`;
- execution-plan anchors for 42 checks, 35 `NOT_RUN`, 7 `BLOCKED`, and waves `35 + 6 + 1`.

## Current result

Behavioral fixtures: **32 / 32 pass**.

Contract mismatches: **1 open**.

### `SEMANTIC-NOT-STARTED-REACHABILITY`

`status-contract.yaml` currently lists `exactly_one_current_evidence_record_per_required_check` as a required control-plane validity assertion. The `NOT_STARTED` predicate requires a `PLANNED` product with no current evidence set and no rerun queue. Since control-plane invalidity is evaluated before `NOT_STARTED`, a strict evaluator that applies the cardinality assertion universally can derive `HOLD` before `NOT_STARTED` is reachable.

Required correction: scope evidence cardinality validation to products with `current_evidence_set_exists: true`, or explicitly exempt a genuinely `PLANNED` product with no evidence and no queue from that assertion. Do not weaken control-invalid precedence for other cases.

Until that contradiction is resolved, the conformance suite intentionally reports overall `FAIL` even though all behavioral fixtures pass.
