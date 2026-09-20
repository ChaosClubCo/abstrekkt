# Branch archival/deletion review — 2026-08-26

## Scope

Repository: `Krosebrook/abstrekkt`

This review is separate from merge consolidation. A branch is eligible for deletion only when it is proven fully contained, duplicated, or superseded; has no open PR; has no active release role; and does not carry unresolved historical provenance that should remain directly addressable by branch name.

## Repository-level gates

- Open pull requests: none at review time.
- Published GitHub releases: one release, `images-2026-07-18`, targeted at `main`; no named historical feature branch is referenced by that release object.
- `main` remains the canonical active branch.

## SAFE DELETE CANDIDATES

The following branches were previously compared against `main` and had `ahead_by = 0`, meaning their commits are already contained in canonical history. They are not release branches and do not hold unresolved branch-specific provenance that requires retention.

| Branch | Basis | Disposition |
|---|---|---|
| `Krosebrook-patch-1` | Fully contained; previously verified behind `main` with no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `agent/canonical-runtime-wiring` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `agent/durable-canonical-d1-adapter` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `chore/abstrekkt-cloudflare-pages` | Fully contained; current Cloudflare workflow on `main` is newer | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `claude/author-hub-canon-source` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `claude/canon-registry-bookkeeping` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `claude/white-label-exact-sha-release-t8zx00` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `copilot/audit-remove-flashnframe-secrets` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `copilot/fix-code-for-review-comments` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `copilot/high-level-audit` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `governance/root-authority-2026-08-25` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |
| `memoir/tax-the-damage-orchestrator-reference-2026-08-24` | Fully contained; no unique commits | DELETE WHEN REF-DELETION CAPABILITY IS AVAILABLE |

## RETAIN — RELEASE / EXACT-SHA PROVENANCE

| Branch | Reason |
|---|---|
| `release/abstrekkt-1a7da25` | Release-named branch anchored to exact historical SHA. Retain unless an explicit release-retention policy authorizes deletion. |

## RETAIN — HISTORICAL LOXIHART PROVENANCE

These branches are intentionally retained even when superseded or duplicated because the branch-family record classifies them as historical Loxihart product/runtime provenance outside current Abstrekkt authority. Deleting them would be a separate provenance-destruction decision, not ordinary cleanup.

- `loxihart/export-only-2026-08-22`
- `loxihart/lxh-e001-preregistered-pilot`
- `loxihart/production-gates-2026-08-21`
- `loxihart-control-api`
- `loxihart-netlify-hardening-deploy-20260824`
- `loxihart-pilot-console`
- `loxihart-pilot-console-v2`
- `loxihart-post-release-hardening`
- `loxihart-production-release-runbook`
- `loxihart-production-release-runbook-v2`
- `codex/loxihart-signed-conformance-gate`
- `release/loxihart-pilot-console-rc-2026-08-16`

## RETAIN — SUPERSEDED PR PROVENANCE UNTIL EXPLICIT CLEANUP

`chore/repo-automation-agent-stack` is superseded and its PR was closed without merge after verifying that its repository-scoped automation surfaces already exist on newer `main`. Retain the branch for now because it is directly referenced by the supersession audit trail. It may become deletable after a retention interval or explicit archival policy.

## Deletion execution status

The connected GitHub tool surface used for this review exposes branch discovery, comparison, creation, and ref movement, but does **not** expose deletion of Git refs/branches. Therefore this review freezes the safe-delete manifest but does not falsely claim physical branch deletion.

Do not emulate deletion by force-moving a branch ref. Moving a stale branch to `main` destroys the original branch pointer and is not equivalent to auditable deletion.

## Required deletion rule

When an authorized Git ref deletion capability is available, delete only the branches in **SAFE DELETE CANDIDATES**. Before each deletion, re-check:

1. the branch still has `ahead_by = 0` versus current `main`;
2. no open PR uses the branch as head;
3. no release/tag/workflow explicitly references the branch;
4. the branch has not acquired new commits since this review;
5. the branch is not newly designated as provenance-retained.

Any failed re-check changes the disposition to RETAIN pending review.
