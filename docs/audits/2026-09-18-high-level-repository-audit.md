# High-Level Repository Audit — chaosclubco/abstrekkt

Authority domain: `abstrekkt_publication` (`repository-registry.yaml:9-19`).
Source revision: `ChaosClubCo/abstrekkt @ cdbb196f3a94a1050b874db56369bd849a5b2a56` (branch `claude/zen-rubin-fqxdit`), audited 2026-09-18.

Scope: a high-level audit of major components, architecture, dependencies, gaps, and risks across the repository as a whole, requested independently of and prior to `docs/decomposition/00-AUDIT-FINDINGS.md`. This document does not replace that audit — it corroborates a majority of its findings from an independent pass and adds coverage of the `project/` corpus and repository-wide governance structure that the decomposition audit did not focus on. Where a claim overlaps with `docs/decomposition/`, this document says so and is marked accordingly; per `docs/DOCUMENTATION_STANDARDS.md`, contradictions between sources are preserved, not silently resolved.

Confidence labeling used throughout: **Confirmed** (independently re-verified this session via direct file read or git command), **Likely** (sourced from a parallel exploration pass or from `docs/decomposition/00-AUDIT-FINDINGS.md`, read directly but not independently re-run command-by-command), **Requires Verification** (explicitly flagged by its own source as unverified).

---

## 1. Executive Summary

**Overall assessment:** This is not a conventional application repository. It is a ~2.1 GB, ~24,000-file preservation corpus spanning six self-declared governance domains (Abstrekkt publishing, the legacy `project/` design/content corpus, an external Loxihart product tree frozen-in-place, an excluded INT/Intinc lane, restricted private/memoir/clinical material, and vendored/archived third-party code), governed by an authority-precedence framework (`AGENTS.md` → `REPOSITORY.md` → `repository-registry.yaml` → `project/CANON.md`). The governance model is sophisticated and largely self-consistent on paper. `docs/decomposition/00-AUDIT-FINDINGS.md` already exists, dated the same day as this audit — a positive signal that this is an actively self-auditing repo, not a neglected one.

**Top strengths:** a real, working authority/domain model; one production surface (`abstrekkt.com`) with genuine deployment evidence (a signed release receipt with route-level read-back checks); an existing, credible prior audit that this report was able to cross-check.

**Top risks:**
1. **Confirmed** — a tracked file with 108 credential-shaped key names (`Infinite-heroes-env.txt`) sits in the current `HEAD`, despite a documented July 2026 purge that evidently did not survive a September 2026 bulk-import commit.
2. **Likely** — the INT/Intinc lane, explicitly excluded by this repo's own `CLAUDE.md` ("not authorized by repository residence"), is physically present in three separate directory copies.
3. **Likely** — large-scale content duplication (~99 byte-identical memoir/corridor directories, tripled personal-config bundles, a nested self-copy of the entire repo) directly contradicts the `project/` lane's own anti-duplication rule (`project/CANON.md`).
4. **Likely** — the one verified-live production deploy (`abstrekkt.com`) has a stale release receipt and references a CI workflow file that no longer exists.

**Key limitations on confidence:** shallow git clone (51 commits — pre-2026-09-13 ancestry unverifiable); no build/install/test was executed anywhere; no live Cloudflare/Netlify/Vercel/GitHub account state was checked; a majority of directory-tree claims come from parallel exploration passes over large trees rather than exhaustive personal review, cross-checked against `docs/decomposition/00-AUDIT-FINDINGS.md` where overlapping.

---

## 2. Scope and Evidence Boundaries

**Evidence sources reviewed:**
- Direct reads: `README.md`, `AGENTS.md`, `REPOSITORY.md`, `repository-registry.yaml`, `CLAUDE.md` (root), `.gitignore`, `docs/SECURITY-AUDIT.md`, `docs/decomposition/00-AUDIT-FINDINGS.md`, `docs/export/MIGRATION_CONTRADICTIONS.md`, `docs/DOCUMENTATION_STANDARDS.md`.
- Direct git commands: `git ls-files`, `git log --oneline -- <path>`, `git check-ignore -v`, `wc -l` (line count only, no content) against `Infinite-heroes-env.txt`; `git status`, `git rev-parse HEAD`.
- Three parallel exploration passes: (a) repo root governance/CI/tooling inventory, (b) the `project/` corpus (1,936 files, `CANON.md`, brand/sensitivity scan), (c) `loxihart/` plus all remaining top-level directories (duplication and lane-boundary analysis).

**In scope:** the full working tree at commit `cdbb196f` on branch `claude/zen-rubin-fqxdit`; governance documents; CI workflow inventory *by filename and declared trigger*, not execution; `package.json`/lockfile presence across the tree.

**Explicitly excluded / unavailable:** GitHub Actions run history and logs; live Cloudflare Pages/Workers/D1 state; Netlify/Vercel/DNS account state; any `npm install`/build/test execution; contents of secret-shaped files (never opened, by design); the `Krosebrook/Loxihart` repository (out of this session's repo access scope); full unshallow git ancestry beyond 51 commits.

**Material evidence limitations:** shallow clone; most directory-tree findings are exploration-pass-summarized over 2,000+ files rather than personally read line-by-line — the one claim independently spot-checked (credential-file tracking status) confirmed accurate; this audit leans in part on the pre-existing `docs/decomposition/00-AUDIT-FINDINGS.md`, read directly but not independently re-run command-by-command for every claim.

**Overall confidence:** Medium-High for governance structure, file presence, and git-history claims (directly checkable and mostly checked). Low for anything requiring runtime, deployment, or organizational-process verification (explicitly out of evidence).

---

## 3. System Overview

**Purpose (self-declared, `README.md`):** "the governed source and preservation boundary for Abstrekkt publishing, public-site source, approved editorial artifacts, portfolio/press evidence, and historical material retained for provenance." Explicitly **not** the canonical repo for Loxihart runtime/product code.

**Major components (directly observed):**
- **Governance layer:** `AGENTS.md`, `REPOSITORY.md`, `repository-registry.yaml`, `CLAUDE.md`, `docs/` (11 subdirs), `governance/` (an ADR plus a "production-trust" test/schema/adapter harness), `scripts/repo_integrity.py` (a CI integrity gate).
- **Abstrekkt publication domain:** `project/deploy/abstrekkt-com/` (the one live static site) and `project/` at large (1,936 files — design tokens, marketing HTML, memoir tooling, a vendored "Enterprise Claude Platform" app).
- **Frozen external product:** `loxihart/` — five small Node/TS packages (`canonical-truth`, `change-receipt`, `control-api`, `floot-proxy-reference`, `pilot-console`), owned per the registry by `Krosebrook/Loxihart`; editing forbidden in this repo.
- **CI/CD:** 24–25 GitHub Actions workflows; only 3 represent real deploy paths, none auto-firing from `main`.
- **Excluded/adjacent lanes physically present despite policy:** `4-intinc-project/` (×3 copies), a personal memoir/clinical corpus (~93–99 directories), and `abstrekkt-full/` (424 MB of vendored/archival material, including a nested self-copy of this entire repository).

**Data/control flow directly observed:** `evidence/releases/abstrekkt/2026-08-26-e1d3355-release-receipt.json` records a Cloudflare Pages deployment of `project/deploy/abstrekkt-com` at a specific SHA, with 4 routes verified returning HTTP 200. This is the only end-to-end source→CI→live-artifact chain with direct evidence in this repo.

**Observed vs. inferred:** the registry's domain-to-path mapping and the authority-precedence chain are directly observed (read verbatim from the governing files). That the 3 wired deploy workflows are the *only* production egress points is inferred from reading 24 workflow trigger declarations, not from runtime confirmation.

---

## 4. Architecture and Component Review

**Boundaries and coupling:** the governance model draws boundaries by declared *domain* (a YAML classification) rather than by directory isolation. This is a soft boundary: a domain can be "excluded" on paper while its content is scattered across multiple real directories with no structural or access-control enforcement observed (no `CODEOWNERS`, no evidence of path-scoped branch protection).

**Patterns in use:** authority-precedes-path governance (explicit and documented); YAML domain-registry classification; a hash-verified migration-receipt contract for cross-repo moves (`repository-registry.yaml:66-77`), executed exactly once so far (status `REVIEW_PENDING`).

**Notable inconsistencies (each cited to evidence):**
- **INT/Intinc triplication** — `4-intinc-project/`, `kyle-context-files/4-intinc-project/`, `abstrekkt-full/4-intinc-project/` all contain real Intinc operating-profile content, despite `CLAUDE.md`'s explicit exclusion. The existing denylist (`docs/decomposition/never-extract.denylist`) names only the first path directly, relying on a glob for the other two — coverage not independently confirmed. *(Likely; corroborated by `docs/export/MIGRATION_CONTRADICTIONS.md` C-0001, already logged OPEN.)*
- **~99 duplicated memoir/corridor directories** at repo root, reported byte-identical to content already nested under `project/stitch_memory_corridor_studio/`. *(Likely, not independently re-run.)*
- **Tripled personal Claude-config bundles** (`1-global/`, `2-global-rules/`, `3-flashfusion-project/`, `4-intinc-project/`, `5-shared/`) across 3 locations, with at least 2 divergent content snapshots by md5. *(Likely, same caveat.)*
- **A nested self-copy of the entire repository** inside `abstrekkt-full/ab-enablement-co/abstrekkt-handoff/abstrekkt/`. *(Likely.)*
- **Case-only directory collision:** `Memoir/` (48 tracked files) vs. `memoir/` (7 tracked files) — will break `git clone`/checkout on case-insensitive filesystems (macOS/Windows default). *(Likely — sourced from `docs/decomposition/00-AUDIT-FINDINGS.md` §5 and corroborated structurally by this session's directory listings.)*
- **Org-name mismatch:** git remote is `ChaosClubCo/abstrekkt`; governance docs (README/AGENTS/REPOSITORY/registry/SECURITY-AUDIT.md) self-reference `Krosebrook/abstrekkt` or `Krosebrook/Loxihart`. *(Likely.)*
- **`project/CANON.md`'s own anti-drift rule** ("never leave two canonical versions alive") is contradicted at scale by the findings above.

---

## 5. Dependencies and Integrations

No root-level `package.json`/lockfile exists — this is not a single buildable/deployable Node project. Dependency management is fragmented across roughly 30 shallow `package.json` files plus 100+ more nested under `abstrekkt-full/`.

**Frameworks observed (from `package.json` reads, not build-verified):** React 19 + Vite 7 + TypeScript 5.9 (`loxihart/pilot-console`); zero-runtime-dependency ESM Node packages by design (`loxihart/canonical-truth`, `change-receipt`, `floot-proxy-reference`); Express + TypeScript (`a2alayer/a2a-layer`); Next.js + three.js (`Unicorn-maybe/flashfusion-web`).

**Declared infrastructure integrations:** Cloudflare Pages (`abstrekkt.com`), Cloudflare Workers + D1 (`kr-mentor-proxy`, `abstrekkt-webhook-receiver`), Netlify (`netlify.toml` present but self-annotated "not currently linked to a Netlify project"), GitBook (`.gitbook.yaml`), one trusted MCP server declared in `.github/mcp.json` (`cloudflare-docs`, SSE transport, docs-search tool only).

**Declared vs. verified:** all of the above are declared-only from this audit's vantage point — no live account/API state was checked (explicitly out of scope). The one integration with real evidence is `abstrekkt.com`'s deployment, and even that is already known-stale (see Finding 3, §8).

**Highest-risk dependency-adjacent artifact:** `Infinite-heroes-env.txt` (108 credential-shaped key names spanning multiple third-party services per `docs/decomposition/00-AUDIT-FINDINGS.md`'s enumeration) — not a "dependency" in the software sense, but the single highest-risk integration-adjacent artifact in the repo. See §6/§8.

**Archival dependency surface:** `abstrekkt-full/ab-enablement-co/flashfusion-OAAS/` alone contains 6,346 files of vendored third-party repos, explicitly governed as "archive, never extract" — not intended for active dependency management.

---

## 6. Risk Assessment

**Security**
- *Directly evidenced (Confirmed):* `Infinite-heroes-env.txt` is currently tracked in `HEAD` — independently verified via `git ls-files`, `git log --oneline -- Infinite-heroes-env.txt` (single commit `59c7fb89`, the 2026-09-13 bulk-import), and `git check-ignore -v` (not ignored, exit 1). A documented July 2026 purge (`docs/SECURITY-AUDIT.md`) used `git filter-repo` to remove this file from all history — but the September bulk-import commit evidently reintroduced it. Whether this was accidental or deliberate is unknown.
- *Directly evidenced (Confirmed):* the repo's own `.gitignore` header attests it intentionally contains clinical records, an SSN fragment, DOB, home addresses, family names, and a police report, with an explicit "not a clearance to make public" warning — sitting at the same root as 12+ deploy-capable/CI-wired workflows.
- *Requires Verification:* 4 additional files pattern-matched for Stripe/JWT/GitHub-PAT/Slack-token-shaped strings (`arc-agent-connectors.js`, `site/portfolio_command_center_v2.html`, `abstrekkt-full/.../desktop-config.json`, `Unicorn-maybe/archive/.../mcp-servers-config.js.txt`) — flagged by `docs/decomposition/00-AUDIT-FINDINGS.md` §4 as needing manual triage, not yet resolved.
- *Requires runtime/out-of-band verification:* whether any of the 108 named keys are still valid; whether GitHub Actions caches or CDN still hold purged blob copies.

**Reliability and fault tolerance**
- *Likely:* only 1 of ~25 CI workflows represents a verified working production path, and its own release receipt names an execution workflow file that no longer exists in the tree.
- *Likely:* the `Memoir/`/`memoir/` case collision is a concrete, reproducible defect for any contributor on a case-insensitive filesystem.

**Performance and scalability**
- No runtime telemetry available — out of scope. Static observation: ~2.1 GB repo (`.git` alone ~580 MB) with ~24,000 files landed in one commit.

**Maintainability and technical debt**
- *Likely:* the duplication findings in §4 are the dominant technical-debt driver, directly contradicting `project/CANON.md`'s own anti-drift rule.
- *Confirmed:* `repository-registry.yaml`'s own `deployment.abstrekkt_com.status: UNKNOWN` field is self-documented (in an inline comment in the same file) as pinned only to satisfy a literal-string match in `scripts/repo_integrity.py:89`, not to reflect real state.

**Data integrity**
- *Likely:* the migration-receipt contract (hash-verified source/target, `repository-registry.yaml:66-77`) has been executed exactly once (`REVIEW_PENDING`) against a backlog of 16 open contradictions logged in `docs/export/MIGRATION_CONTRADICTIONS.md`.

**Deployment and operational complexity**
- *Likely:* 24–25 GitHub Actions workflows exist for a repo that, by `docs/decomposition/00-AUDIT-FINDINGS.md`'s own characterization, "is not an app" — a high automation surface relative to the 3 workflows that actually deploy anything.

**Observability and incident response**
- *Not observed* — no monitoring/alerting configuration, and no incident runbook beyond the security-purge writeup and Loxihart release-blocker docs, found within this scope. Absence noted as "not observed," not confirmed absent.

---

## 7. Engineering Quality Gaps

- **Tests:** `loxihart/`'s five packages each ship their own `node --test` suites (observed, not executed). Not observed whether the ~30+ other scattered `package.json` projects have tests.
- **Documentation:** unusually strong at the governance layer (5 top-level authority docs, 272 markdown files inside `project/` alone, and `docs/DOCUMENTATION_STANDARDS.md` itself). Gap: the registry's own deployment-status field is stale/self-acknowledged as CI-gate-driven rather than accurate (see §6).
- **Validation/error handling:** not observed at the code level for most of the corpus (mostly static content). `loxihart/canonical-truth` and `change-receipt` specifically implement signature/schema validation as their core purpose — a positive, narrowly-scoped signal.
- **Logging/metrics/tracing/alerting:** not observed anywhere in scope.
- **Missing safeguards:** no `CODEOWNERS` file found in this scope (not confirmed absent beyond what was listed); no branch-protection evidence (GitHub settings out of scope); whether a secret-scanning workflow runs was not confirmed one way or the other in this pass.

---

## 8. Prioritized Findings

**1. Tracked credential-shaped file present in current HEAD despite a documented purge**
- Category: Security | Urgency: **Critical**
- Evidence observed: `git ls-files -- Infinite-heroes-env.txt` returns the file; `git log --oneline -- Infinite-heroes-env.txt` → one commit, `59c7fb89` (2026-09-13 bulk import), post-dating the 2026-07-19 `git filter-repo` purge documented in `docs/SECURITY-AUDIT.md`; `git check-ignore -v` confirms it is not gitignored; 134 lines.
- Evidence source: repo root `Infinite-heroes-env.txt`; `docs/SECURITY-AUDIT.md`; `docs/decomposition/00-AUDIT-FINDINGS.md` §4.
- Why it matters: a documented remediation (purge + force-push) was evidently undone by a later bulk-import commit — a live exposure if any of the 108 named keys remain valid.
- Confidence: **Confirmed** (independently re-verified this session).
- Validation needed: out-of-band check of whether any named key is still live; if so, rotate immediately; re-purge and determine how/why the file was reintroduced.
- Scope limitation: key *values* were never read, per security practice — only tracked-status and key count were confirmed.

**2. Governed exclusion (INT/Intinc lane) present in three directory copies**
- Category: Architecture/Governance | Urgency: **High**
- Evidence observed: `4-intinc-project/`, `kyle-context-files/4-intinc-project/`, `abstrekkt-full/4-intinc-project/` each contain real Intinc operating-profile content; the existing denylist names only the first path explicitly.
- Evidence source: directory listings (this session); `docs/decomposition/never-extract.denylist`; `docs/export/MIGRATION_CONTRADICTIONS.md` C-0001 (already OPEN).
- Why it matters: directly conflicts with this repo's own stated lane-isolation policy.
- Confidence: **Likely**.
- Validation needed: confirm the denylist glob actually matches all 3 paths; consolidate or remove redundant copies via the registry's migration-receipt process.

**3. Live production deploy path for abstrekkt.com is stale and unreproducible as documented**
- Category: Reliability/Deployment | Urgency: **Medium**
- Evidence observed: the release receipt names an `executionWorkflow` file that no longer exists in the tree; 2 later commits changed the same deploy root after the receipt's SHA.
- Evidence source: `docs/decomposition/00-AUDIT-FINDINGS.md` §1–2 (read directly).
- Why it matters: production redeploy currently has no confirmed working, current CI path.
- Confidence: **Likely**.
- Validation needed: directly confirm the workflow file's absence and either restore/recreate a working one-shot deploy path or update the receipt-generation process.

**4. Large-scale unmanaged content duplication**
- Category: Maintainability/Technical debt | Urgency: **Medium**
- Evidence observed: ~99 directories reported byte-identical between repo root and `project/stitch_memory_corridor_studio/`; tripled personal-config bundles with 2 divergent md5 snapshots; a nested self-copy of the whole repo.
- Evidence source: this session's exploration pass (spot-check diffs/md5s, not independently re-run).
- Why it matters: directly contradicts `project/CANON.md`'s own anti-duplication rule; inflates repo size and clone/CI time.
- Confidence: **Requires Verification**.
- Validation needed: independent re-verification, then a migration-receipt-governed dedup pass.

**5. Case-only directory collision (`Memoir/` vs `memoir/`)**
- Category: Reliability | Urgency: **Medium**
- Evidence observed: 48 vs. 7 tracked files under differently-cased top-level paths.
- Evidence source: `docs/decomposition/00-AUDIT-FINDINGS.md` §5.
- Why it matters: will break `git clone`/checkout for contributors on macOS/Windows default (case-insensitive) filesystems.
- Confidence: **Likely**.
- Validation needed: `git ls-files | grep -i '^memoir/'` to confirm exact contents of both before any rename/merge.

**6. Registry's deployment-status field self-acknowledged as stale/CI-gate-pinned**
- Category: Maintainability/Observability | Urgency: Low-Medium
- Evidence observed: `repository-registry.yaml`'s `deployment.abstrekkt_com.status: UNKNOWN` with an inline comment explaining `scripts/repo_integrity.py:89` hard-requires that literal string for a CI gate.
- Evidence source: `repository-registry.yaml` (quoted verbatim).
- Why it matters: signals at least one CI gate is brittle string-matching rather than semantic validation.
- Confidence: **Confirmed** (verbatim file content).
- Validation needed: none to confirm the fact; redesigning the gate to check semantic fields is a recommended follow-up, not evaluated further here.

**7. Org/owner-name mismatch between git remote and internal docs**
- Category: Documentation/Governance | Urgency: Low
- Evidence observed: remote is `ChaosClubCo/abstrekkt`; governance docs self-reference `Krosebrook/abstrekkt`/`Krosebrook/Loxihart`.
- Evidence source: `git remote -v`; doc quotes.
- Why it matters: minor on its own, but symptomatic of the doc-vs-reality drift seen in Findings 3 and 6.
- Confidence: **Likely**.
- Validation needed: reconcile doc references.

**8. No repo-wide dependency/vulnerability visibility**
- Category: Architecture/Engineering quality | Urgency: Medium
- Evidence observed: no root `package.json`/lockfile; ~30 shallow-path `package.json` files plus 100+ more nested under `abstrekkt-full/`.
- Evidence source: repo-root directory enumeration (this session).
- Why it matters: no single-operation way to answer "are there known-vulnerable dependencies anywhere in this repo."
- Confidence: **Likely**.
- Validation needed: run a per-project dependency scan (e.g., `npm audit`/`osv-scanner`) — not performed here (no installs/builds were run, by design).

**9. Four files pattern-matched for live-credential-shaped strings remain untriaged**
- Category: Security | Urgency: High (pending triage)
- Evidence observed: `arc-agent-connectors.js`, `site/portfolio_command_center_v2.html`, `abstrekkt-full/.../desktop-config.json`, `Unicorn-maybe/archive/.../mcp-servers-config.js.txt`.
- Evidence source: `docs/decomposition/00-AUDIT-FINDINGS.md` §4 (read directly).
- Why it matters: security posture cannot be called clean until manually classified as placeholder vs. live.
- Confidence: **Requires Verification** (the prior audit itself calls these untriaged).
- Validation needed: manual, careful inspection of each file.

**10. High CI/automation surface relative to actual deploy activity**
- Category: Operational complexity | Urgency: Low
- Evidence observed: 24–25 workflow files vs. only 3 real deploy paths.
- Evidence source: `.github/workflows/` listing (this session) + `docs/decomposition/00-AUDIT-FINDINGS.md` §2.
- Why it matters: harder to reason about "what can actually touch production" when the large majority of workflows never deploy anything.
- Confidence: **Likely**.
- Validation needed: none critical; a workflow-inventory cleanup would reduce future audit surface.

---

## 9. Unknowns and Verification Gaps

- **Credential validity** for the 108 keys in `Infinite-heroes-env.txt` — requires out-of-band provider checks; resolves Finding 1 from "assume compromised" to a confirmed blast radius either way.
- **Pre-2026-09-13 git ancestry** — shallow 51-commit clone; an unshallow fetch could reveal whether the July purge's undoing was accidental or a deliberate re-import that didn't account for it.
- **Live Cloudflare Pages/Workers/D1, Netlify, and Vercel account state** — would confirm or refute current production status beyond the one stale receipt; directly affects Finding 3's severity.
- **Whether GitHub Actions caches or CDN still hold purged blob copies.**
- **Krosebrook/Loxihart's actual current contents** — out of this session's repo access scope.
- **Branch protection / CODEOWNERS / required reviews on GitHub** — not visible from the file tree.
- **Exact denylist glob coverage** for the 3 INT/Intinc directory copies (Finding 2).

---

## 10. Recommended Deep-Audit Areas

| # | Scope | Why | Files/evidence to inspect | Expected outcome | Priority |
|---|---|---|---|---|---|
| 1 | Credential exposure triage | Highest severity, time-sensitive, only partially triaged | `Infinite-heroes-env.txt`, the 4 pattern-matched files, full unshallow git log for these paths | Either "confirmed dead/rotated" (close) or "N live keys found" (trigger incident response) | Critical |
| 2 | Deployment pipeline reconciliation for `abstrekkt.com` | Only verified-live surface, but its CI path is broken and receipt is stale | Release receipt JSON, `abstrekkt-cloudflare-pages.yml`, live Cloudflare API | A corrected current receipt or a documented, fixed deploy path | High |
| 3 | INT/Intinc lane-isolation enforcement | Conflicts with the repo's own stated exclusion policy | The 3 `4-intinc-project/` copies, `never-extract.denylist` | Confirmed-enforced denylist or concrete remediation | High |
| 4 | Full unshallow git history audit | Can't currently confirm the purge's fate or branch-deletion history | Entire `.git` object store | Confirmation the Sept re-import is the sole reintroduction vector, or discovery of further recoverable blobs | High |
| 5 | Content-duplication remediation | Largest repo-size/tech-debt driver; violates `project/`'s own CANON.md rule | Root-level duplicate directories vs. `project/stitch_memory_corridor_studio/`; tripled config bundles; nested self-copy | Independent diff/md5 re-verification, then a migration-receipt-governed dedup pass | Medium |
| 6 | Repo-wide dependency/vulnerability scan | No current supply-chain visibility | Every `package.json`/lockfile pair | Consolidated, priority-ranked vulnerability inventory | Medium |

---

## 11. Audit Sequence

1. **Re-verify cheap, high-value claims not independently re-run this session** — `Memoir/`/`memoir/` file counts, denylist glob match test. No dependencies; do first.
2. **Full unshallow git fetch + `git fsck`** for the credential-file paths — prerequisite for confidently scoping the exposure window.
3. **Out-of-band credential-validity triage** for the 108 keys and the 4 pattern-matched files — can start in parallel with step 2.
4. **Live Cloudflare/Netlify/Vercel account-state pull** — independent of 1–3; needed to close Finding 3.
5. **INT/Intinc denylist remediation decision** — depends on step 1's glob-test result.
6. **Content-duplication independent re-verification and dedup planning** — can run in parallel with 1–5; execute any actual dedup only through the registry's migration-receipt process.
7. **Repo-wide dependency/vulnerability scan** — lowest urgency; last, unless step 3 surfaces something that changes priority.

Highest-value first: steps 1–3 (credential exposure) are both confirmed and time-sensitive; everything else is important but not equally urgent.

---

## 12. Final Assessment

The most consequential finding — the reintroduced credential-shaped file — is also the one item in this audit backed by direct, independent verification rather than secondhand reporting, and it deserves same-day human attention regardless of any other recommendation here. The `Memoir`/`memoir` collision, the INT/Intinc triplication, and the registry's self-acknowledged stale status field are all well-evidenced (the last one directly, the first two via `docs/decomposition/00-AUDIT-FINDINGS.md` plus structural corroboration) but rated Likely rather than Confirmed since not every underlying command was independently re-run. The duplication findings and the four untriaged pattern-matched files are plausible and evidence-backed but explicitly flagged by their own sources as needing further verification before action.

This audit's confidence is asymmetric: high for anything checkable from static files and git metadata, low for anything requiring live infrastructure, account, or organizational-process state — none of which was available in this workspace. The existence of a credible, same-day prior audit that this report was able to cross-check strengthens confidence in the shared findings, but does not substitute for independently re-running the handful of claims marked "Likely" above before treating them as fully closed.
