# Security & Untrusted-Input Handling

This framework scores **untrusted** code and submissions. Treat every repo,
scorecard, and PR body as potentially hostile.

## 1. Never auto-execute untrusted code

- The evaluator and readiness checker **only read files** (`fs.readFileSync`,
  `fs.accessSync`, directory listing). They do **not** run `npm install`, build
  scripts, tests, or any project code.
- The multi-repo aggregator clones with `--depth 50` and runs **only** the known
  evaluator script — it does not invoke arbitrary project scripts.
- Do not add steps that run a submission's `postinstall`, `prepare`, or test
  hooks with elevated permissions. If you must run tests, do it in an isolated,
  least-privilege job with no secrets.

## 2. Secrets and PII

- **Strip / flag, never copy.** If a submission contains secrets (API keys,
  tokens, `.env` with real values) or PII, flag it in the evaluation output —
  never echo the secret into a comment, artifact, or generated file.
- **Generated `.env.example` uses placeholders only** (`sk_test_xxx`,
  `https://xxx`, `phc_xxx`). The auto-fix prompts explicitly forbid real secrets.
- **No PII/tokens/passwords in logs.** The observability prompts require
  structured logging that excludes PII.
- **Scan before shipping:** `npm audit` and a secret-scan should pass; the
  pre-production checklist enforces this.

## 3. Least-privilege CI

| Workflow | Permissions | Secrets |
|----------|-------------|---------|
| `project-eval-comment.yml` | `contents: read`, `pull-requests: write`, `issues: write` | none beyond default token |
| `multi-repo-ranking.yml` | `contents: read` | optional `GH_PAT` for private/cross-org |
| `claude-auto-fix.yml` | `contents: write`, `pull-requests: write` | `ANTHROPIC_API_KEY` |

- Store `ANTHROPIC_API_KEY` (and any `GH_PAT`) in **GitHub Secrets only**, never
  in `.env` or code.
- No `actions: write`, no `secrets: write`. The credentialed surface is one
  workflow (auto-fix); everything else is read-only.

## 4. The zero-review contradiction (stated, not hidden)

The source's user explicitly asked to **not review anything**. The source's own
security guidance recommends review for any change beyond low-risk. We preserve
both honestly:

- **Recommended:** Option A (manual) or Option B (draft PR + human review).
- **Zero-review (Option C):** allowed **only** for low-risk fix types
  (`env-example`, `docs`, config like `prettier`/`dependabot`), and **only** when
  gated by `lint + typecheck + tests` with **auto-revert on failure** and an
  **auto-opened issue** for the human to triage. It is never permitted for auth,
  encryption, database schema, API design, or business logic.
- Disable GitHub auto-merge on `claude-fix/*` branches to force the gate.

## 5. Auditability & rollback

- All bot commits are attributable (`Claude Auto-Fix Bot`) and greppable:
  `git log --grep="claude: auto-fix"`.
- Rollback a bad fix with `git revert HEAD` (single commit) or revert the merge.
- Keep the rubric, scorecards, and ranking sheet published so scores are
  contestable and the process is auditable.

## 6. Rate limits & cost

- The Anthropic API has rate limits; add retry + backoff if running fixes often
  (HTTP 429 otherwise).
- Budget: roughly $0.15–0.50 per fix; ~$15–50/month at 5 fixes/day for 20 days.
