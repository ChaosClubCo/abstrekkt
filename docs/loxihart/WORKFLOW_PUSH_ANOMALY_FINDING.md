# Loxihart Release Workflow Push-Event Anomaly — Finding

## Summary

GitHub registered failed **push-event** workflow runs against
`.github/workflows/loxihart-production-release.yml` on feature-branch commits,
despite the file declaring `workflow_dispatch` only.

Both anomalous runs contained **zero jobs**. No secret-bearing release steps
executed and no credentials were exposed.

---

## Observed runs

| Run ID | Branch | Head SHA | Event | Conclusion |
|---|---|---|---|---|
| 33137594916 | feat/production-trust-conformance-v1 | 4a5097e4 | push | failure |
| 33137667848 | feat/production-trust-conformance-v1 | 1f11aec6 | push | failure |

---

## Root cause

GitHub Actions evaluates workflow trigger registrations from the **default branch**
(`main`). When a commit on any other branch modifies a workflow file, GitHub
re-evaluates the file's registration. For `workflow_dispatch`-only workflows,
GitHub creates a zero-job run record with status `failure` as a registration
artifact — not an actual execution attempt.

**Verified facts:**

1. The workflow file was created in commit `bab980b5` with `workflow_dispatch` only.
   It has never contained a `push` trigger at any point in its history.

2. Both anomalous runs have `total_count: 0` jobs — confirming no steps ran, no
   secrets were resolved, and no release code executed.

3. The `workflow_dispatch` event path itself requires a manually supplied
   `candidate_sha` input; it cannot be invoked by automated push or pull-request
   events.

---

## Fix

`loxihart-production-release.yml` was updated to include an explicit `push` block
with `branches-ignore: ['**']`. This instructs GitHub to register zero push
triggers explicitly, preventing phantom evaluation failures when this file is
modified on any branch.

PR: closes Krosebrook/abstrekkt#72. The exact merge-commit SHA is the HEAD of the
pull-request branch at the time of merge and can be resolved from the PR timeline.

---

## Trust boundary verification

- Secret-bearing jobs (`rg02`, `rg03`, `rg04`) require `inputs.candidate_sha`
  from `workflow_dispatch`. They cannot execute on push events because the `freeze`
  job would have no input SHA and all downstream `needs:` jobs would be skipped.
- The zero-job run evidence (`total_count: 0`) is the machine-readable confirmation
  that no job queuing occurred.
- Phase 0 credential/trust-boundary certification: **UNBLOCKED** by this finding.

---

## References

- Issue: Krosebrook/abstrekkt#72
- Workflow: `.github/workflows/loxihart-production-release.yml`
- GitHub Actions docs: [Events that trigger workflows — workflow_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)
