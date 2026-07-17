# Migration Guide — Source-of-Truth Monorepo

Reconstructed from the source chat's 3-phase, 4-week plan. Adjust dates; the
source targeted a Feb 10 – Mar 7, 2026 window with a Jan 10 board approval.

## Prerequisites

- Node >= 18.18, `corepack enable` (provides pnpm), `python3`
- `git`, `rsync`, `jq`; `git-filter-repo` only if `PRESERVE_HISTORY=true`
- `gh` CLI authenticated (`gh auth login`) for archival — credentials come from
  the CLI/env, **never** from the repo

## Phase 0 — Scaffold (Day 0)

```bash
bash scripts/init-structure.sh
corepack enable && pnpm install
python3 scripts/consolidate.py --plan IMPORT_PLAN.csv --dry-run
```

Acceptance: skeleton exists, `pnpm install` succeeds on the empty workspace,
dry-run prints the plan and writes nothing.

## Phase 1 — Core (Week 1, ~32 P0 repos)

Goal: foundation + flagship products + working CI/CD.

```bash
# import P0 only, sequentially, with rate-limit sleeps
python3 scripts/consolidate.py --plan IMPORT_PLAN.csv --confirm --only P0
pnpm install --ignore-scripts        # untrusted code: no lifecycle scripts yet
pnpm turbo run lint test build        # quality gate
python3 scripts/consolidate.py --map-only   # refresh REPO_MAP.md
```

Per-repo smoke test:
- `pnpm --filter <pkg> install` resolves
- tests pass if present; build succeeds if buildable
- `pnpm audit --audit-level=high` is clean (or triaged)

Phase 1 acceptance (source targets, treat as goals not guarantees): all P0
imported without error, CI green, P0 apps on staging, docs updated.

## Phase 2 — Expansion (Weeks 2-3, ~63 repos)

```bash
python3 scripts/consolidate.py --plan IMPORT_PLAN.csv --confirm --only P1
python3 scripts/consolidate.py --plan IMPORT_PLAN.csv --confirm --only P2
pnpm install --ignore-scripts && pnpm turbo run lint test build
```

Resolve cross-package dependencies; map the dependency graph; re-run audit.

## Phase 3 — Archive + Governance (Week 4+, ~250 repos)

Archival is LAST so source repos stay live as rollback until now.

```bash
bash scripts/archive-repo.sh <repo> "Superseded" "<successor-url>"
# repeat per repo; each makes a --mirror clone + redirect README + logs it
```

Then: enable branch protection, set Dependabot/CodeQL/Snyk to block-on-critical,
publish contribution guidelines (see GOVERNANCE.md).

## Smoke Tests (whole-monorepo)

| Check | Command | Pass |
|-------|---------|------|
| Skeleton | `bash scripts/init-structure.sh` | all `projects/**` dirs exist |
| Install | `pnpm install` | exit 0 on empty workspace |
| Build no-op | `pnpm turbo run build` | exit 0 |
| Plan dry-run | `python3 scripts/consolidate.py --dry-run` | prints plan, writes nothing |
| Usage guard | `bash scripts/import-repo.sh` | usage + non-zero exit |
| No secrets | `grep -rIn "API_KEY\|SECRET\|TOKEN=" .` | only `.env.example` placeholders |

## Rollback

- Failed import: `git checkout -- projects/<dir>` or delete it; source repo untouched.
- Bad archive: `git clone --mirror archive/<date>/<repo> restored-<repo>`; un-archive on GitHub.
- Abort everything before Phase 3: delete the monorepo; nothing is lost.

## Known data issues to resolve before/while importing

- Duplicate: `int-smart-triage-ai-3.0` vs `int-triage-ai.3.0` — keep one.
- Duplicate: two `demo-repository` across orgs — merge.
- Superseded pairs: `AutoArchitect v1.2` (drop) vs `v2.6` (keep); `OctaveStudio v1.0` vs `v1.1`.
- ~40 apps on cancelled platforms (Base44, Bolt): export source before links expire.
