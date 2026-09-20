# AI PR Review System — Cheat Sheet

## File Map

```
.github/
├── rulesets/
│   └── main-protection.json          # Step 1 — org ruleset definition
├── scripts/
│   ├── apply-ruleset.sh              # Step 1 — apply/update ruleset via API
│   ├── validate-codeowners.mjs       # Step 2 — CODEOWNERS linter
│   └── pr-review-report.mjs          # Step 5 — weekly quality report
└── workflows/
    ├── ai-pr-review.yml              # Core — Claude + security + enforce + audit
    ├── validate-codeowners.yml       # Step 2 — triggers on CODEOWNERS changes
    ├── merge-queue-guard.yml         # Step 4 — re-runs checks on merge group tip
    └── weekly-review-report.yml      # Step 5 — every Monday 09:00 UTC
```

---

## Secrets Required

| Secret | Used By | Scope |
|---|---|---|
| `ANTHROPIC_API_KEY` | ai-pr-review.yml | Claude Code Review + Security Review |
| `SNYK_TOKEN` | ai-pr-review.yml | Snyk OSS scan |
| `SLACK_WEBHOOK_URL` | weekly-review-report.yml | Optional Slack post |

Set via: **Repo → Settings → Secrets and variables → Actions**

---

## Step 1 — Apply Ruleset

```bash
# One-time setup per repo
GITHUB_TOKEN=<pat-with-admin-scope> \
  ORG=your-org \
  REPO=your-repo \
  bash .github/scripts/apply-ruleset.sh

# Verify
GITHUB_TOKEN=<pat> ORG=your-org REPO=your-repo \
  bash .github/scripts/apply-ruleset.sh --verify
```

**What it enforces on `main`:**
- No direct push (non-fast-forward blocked)
- No deletion
- Require PR with 1+ approvals, code owner review, stale dismissal
- Require: `Validate Labels`, `Claude Code Review`, `Security Review`, `Enforce Human Reviews`, `Write Audit Note`
- Conventional commit message format
- Merge queue (ALLGREEN, SQUASH, max 5 concurrent)

> ⚠️ Merge queue requires **GitHub Team or Enterprise** plan on private repos.

---

## Step 2 — CODEOWNERS Validation

Runs automatically on any PR or push that touches `.github/CODEOWNERS`.

```bash
# Run locally
node .github/scripts/validate-codeowners.mjs

# With team resolution (requires gh CLI + auth)
gh auth login
node .github/scripts/validate-codeowners.mjs
```

**Catches:**
- Patterns with no owners
- Malformed `@org/team` or `@user` refs
- Teams that don't resolve in GitHub
- Missing coverage on security-sensitive glob patterns (`**/*auth*`, `**/*jwt*`, etc.)

---

## Step 3 — Stale Approval / Self-Approval

Built into `enforce_reviews` job in `ai-pr-review.yml`. No separate file.

**Rules:**
- `dismiss_stale_reviews_on_push: true` — new commit invalidates existing approvals
- `require_last_push_approval: true` — pusher cannot be the final approver
- CI hard-fails if last pusher == last approver

---

## Step 4 — Merge Queue

Enabled in `main-protection.json` (`merge_queue` rule). `merge-queue-guard.yml` re-runs fast checks against the merged tip SHA.

**Tuning knobs in `main-protection.json`:**

| Field | Default | Change when |
|---|---|---|
| `max_entries_to_build` | 5 | High velocity teams — bump to 8–10 |
| `min_entries_to_merge_wait_minutes` | 2 | Reduce to 1 for faster drain |
| `grouping_strategy` | ALLGREEN | HEADGREEN if you accept more risk |
| `merge_method` | SQUASH | MERGE if you need full commit history |

---

## Step 5 — Weekly Report

```bash
# Run manually for a custom window
GITHUB_TOKEN=<pat> \
  ORG=your-org \
  REPO=your-repo \
  SINCE=2025-01-01 \
  node .github/scripts/pr-review-report.mjs

# Outputs: review-report.json + review-report.md
```

Runs automatically every **Monday 09:00 UTC** via `weekly-review-report.yml`.

**Key metrics reported:**
- Risk distribution (low/medium/high/unlabeled)
- AI reviewed vs. total
- Security scan confirmed (Code Scanning API, not label)
- Avg + p95 time to merge
- Gaps: unlabeled PRs, skipped AI review, AppSec label with no SARIF confirmation

---

## The Contradiction Fix (Critical)

**Old behavior:** `security:scan-complete` label was used as proof of scan completion.

**Problem:** Label is applied by the workflow step — it can be stale, manually added, or applied before SARIF upload actually succeeds.

**Fixed in:** `enforce_reviews` job and `pr-review-report.mjs`

**How it works now:**
```js
// Checks Code Scanning API for the exact PR head commit SHA
const analyses = await gh(
  `/repos/{owner}/{repo}/code-scanning/analyses?ref={headRef}&per_page=10`
);
const scanConfirmed = analyses.some(a => a.commit_sha === headSha);
```

> ⚠️ Code Scanning API returns 403 on repos without GitHub Advanced Security.
> Both the enforcement job and the report handle this gracefully (treated as unconfirmed, not as an error).

---

## PR Label Reference

| Label | Meaning | Set by |
|---|---|---|
| `risk:low` | Mechanical/formatting/docs | Human (required) |
| `risk:medium` | Logic change, not security-sensitive | Human (required) |
| `risk:high` | Security, auth, billing, migrations, APIs | Human (required) |
| `needs:staff-review` | Requires staff/owner signoff | Human or auto-labeler |
| `needs:appsec` | AppSec review + SARIF confirmation required | Human or auto-labeler |
| `ai:reviewed` | Claude review job completed | Workflow |
| `security:scan-complete` | Security job ran (label only — not a proof of scan) | Workflow |
| `merge:blocked` | Manual block — do not merge | Human |
| `area:security` | Security surface area changed | Auto-labeler |
| `area:data` | DB/migrations changed | Auto-labeler |

---

## Approval Matrix

| Risk | Min approvals | Staff required | AppSec scan required |
|---|---|---|---|
| `risk:low` | 1 | No | No |
| `risk:medium` | 1 | No | No |
| `risk:high` | 2 | Yes (`needs:staff-review`) | No |
| `needs:appsec` | any | — | Yes (Code Scanning API) |

---

## Rollout Order

```
Step 2 (CODEOWNERS validator)     → pure upside, zero risk, ship first
Step 3 (stale dismissal)          → hardens existing branch protection
Step 1 (rulesets)                 → replace branch protection with org ruleset
Step 4 (merge queue)              → requires rulesets + Team/Enterprise plan
Step 5 (reporting)                → ongoing signal, run after first full week
```

---

## Common Failure Messages and Fixes

| Message | Cause | Fix |
|---|---|---|
| `Missing required risk label` | No `risk:*` label on PR | Add `risk:low`, `risk:medium`, or `risk:high` |
| `risk:high PRs must also carry needs:staff-review` | risk:high without routing label | Add `needs:staff-review` |
| `Self-approval detected` | Pusher approved their own PR | Get a different reviewer to approve |
| `requires 2 approvals. Found 1` | risk:high PR with only 1 approval | Get a second human approver |
| `No SARIF analysis found for this commit SHA` | Snyk ran but upload failed, or GHAS not enabled | Check Snyk job logs; confirm GHAS is enabled |
| `CODEOWNERS validation failed` | Malformed owner or unresolvable team | Fix the pattern — see error line number |
| Merge queue: PR not entering queue | Branch protection not migrated to ruleset with merge_queue rule | Apply ruleset via apply-ruleset.sh |
