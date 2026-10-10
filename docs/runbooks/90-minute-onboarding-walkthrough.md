# 90-Minute Onboarding Walkthrough (Engineering/CI, Production Trust, Legacy `project/`)

Use this once per new contributor session to build a correct mental model before making changes.

## Scope and intent

- Scope: repository authority, CI/release gates, production-trust logic, legacy `project/` corpus routing.
- Intent: reduce bad edits, cross-domain mistakes, and time lost in non-canonical branches of the tree.

---

## 0:00–0:10 — Authority orientation (non-negotiable)

### Read

- `/home/runner/work/abstrekkt/abstrekkt/AGENTS.md`
- `/home/runner/work/abstrekkt/abstrekkt/REPOSITORY.md`
- `/home/runner/work/abstrekkt/abstrekkt/repository-registry.yaml`

### Checkpoint (must answer clearly)

1. Which domains are canonical in this repository vs external?
2. Why is `loxihart/` frozen here for runtime/product edits?
3. Why must authority routing happen before code changes?

### What to ignore in this block

- Deep implementation reading under `/home/runner/work/abstrekkt/abstrekkt/loxihart/`.
- Large historical/media corpora not required for your current task.

---

## 0:10–0:30 — Engineering/CI map

### Read

- `/home/runner/work/abstrekkt/abstrekkt/.github/workflows/repo-integrity.yml`
- `/home/runner/work/abstrekkt/abstrekkt/scripts/repo_integrity.py`
- `/home/runner/work/abstrekkt/abstrekkt/.github/workflows/abstrekkt-ci.yml`
- `/home/runner/work/abstrekkt/abstrekkt/.github/workflows/abstrekkt-cloudflare-pages.yml`
- `/home/runner/work/abstrekkt/abstrekkt/.github/workflows/repository-webhooks.yml`

### Checkpoint (must name all)

Identify the hard-gate checks and where enforced:

- required root authority files
- stale root handoff phrase rejection
- frozen path rejection (`loxihart/`, generated deploy package path)
- changed-file secret pattern scan
- 400-LOC code file cap

Then identify the two places they run:

- standalone integrity workflow
- integrity job inside main CI workflow

### What to ignore in this block

- Workflow optimization/performance tuning.
- Unrelated workflows line-by-line.

---

## 0:30–0:55 — Production-trust logic

### Read

- `/home/runner/work/abstrekkt/abstrekkt/docs/PRODUCTION_TRUST_ARCHITECTURE.md`
- `/home/runner/work/abstrekkt/abstrekkt/.github/workflows/production-trust-conformance.yml`
- `/home/runner/work/abstrekkt/abstrekkt/governance/trust/lib/trust-conformance.mjs`
- `/home/runner/work/abstrekkt/abstrekkt/governance/trust/lib/receipt-builder.mjs`
- `/home/runner/work/abstrekkt/abstrekkt/governance/trust/adapters/providers.mjs`
- `/home/runner/work/abstrekkt/abstrekkt/governance/trust/tests/trust-conformance.test.mjs`

### Checkpoint (must explain in <30s each)

1. Maturity model meaning: `IMPLEMENTED`, `VERIFIED`, `DEPLOYED`, `CERTIFIED`.
2. Deterministic receipt flow and exact SHA binding.
3. Fail-closed behavior for malformed/mismatched behavior evidence.

### What to ignore in this block

- Future live-provider execution details still marked blocked/inconclusive.
- Building new trust features during onboarding.

---

## 0:55–1:20 — Legacy `project/` content system

### Read

- `/home/runner/work/abstrekkt/abstrekkt/project/CANON.md`
- `/home/runner/work/abstrekkt/abstrekkt/project/CLAUDE.md`
- `/home/runner/work/abstrekkt/abstrekkt/project/domain-map.html`
- `/home/runner/work/abstrekkt/abstrekkt/project/Index.html`

### Checkpoint (must identify)

1. Which files are canonical registry/routing sources.
2. Which lanes/artifacts are historical vs active.
3. Which outputs are generated and must not be hand-edited.

### What to ignore in this block

- Editing generated package files under `/home/runner/work/abstrekkt/abstrekkt/project/deploy/abstrekkt-com/`.
- Exhaustive reading of every `project/*.html` file.

---

## 1:20–1:30 — Consolidation + anti-rabbit-hole rules

Create a one-page note and keep it near your working notes for the current task.

### One-page note (filled baseline)

#### 1) Top 5 do-not-violate rules

1. Route by authority domain first (`AGENTS.md`, `REPOSITORY.md`, `repository-registry.yaml`) before editing.
2. Do not mutate runtime/product files under `/home/runner/work/abstrekkt/abstrekkt/loxihart/`.
3. Do not directly edit `/home/runner/work/abstrekkt/abstrekkt/project/deploy/abstrekkt-com/`; edit canonical source and regenerate.
4. Preserve source revision/hash metadata for provenance-sensitive work.
5. Treat security/deployment/publication claims as evidence-bound, not narrative-bound.

#### 2) Top 5 files to check before any PR

1. `/home/runner/work/abstrekkt/abstrekkt/AGENTS.md`
2. `/home/runner/work/abstrekkt/abstrekkt/REPOSITORY.md`
3. `/home/runner/work/abstrekkt/abstrekkt/repository-registry.yaml`
4. `/home/runner/work/abstrekkt/abstrekkt/scripts/repo_integrity.py`
5. `/home/runner/work/abstrekkt/abstrekkt/.github/workflows/abstrekkt-ci.yml`

#### 3) Domain routing prompt for your next task

Use this prompt before opening files:

> “Which authority domain does this path belong to, what mutation policy applies there, and what frozen/generated boundaries prohibit direct edits?”

### Final checkpoint

You should be able to answer in 30 seconds:

- Where should this change live?
- Which gates must pass?
- Which paths must not be touched?

---

## Default rabbit-hole avoid list (always active)

- Frozen runtime work under `/home/runner/work/abstrekkt/abstrekkt/loxihart/`.
- Generated deploy-package edits under `/home/runner/work/abstrekkt/abstrekkt/project/deploy/abstrekkt-com/`.
- Massive historical archives unless explicitly required by task scope.
- Cross-domain cleanup/refactors during narrowly scoped tasks.
