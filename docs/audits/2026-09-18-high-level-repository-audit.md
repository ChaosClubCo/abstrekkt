# High-Level Repository Audit — chaosclubco/abstrekkt

Authority domain: `abstrekkt_publication` (`repository-registry.yaml:9-19`).
Source revision (original pin): `ChaosClubCo/abstrekkt @ cdbb196f3a94a1050b874db56369bd849a5b2a56` (branch `claude/zen-rubin-fqxdit`), audited 2026-09-18.
Updated: 2026-09-19, refreshed in place against `62144788` (branch `claude/wonderful-knuth-1y7xju`), 6 commits ahead of the original pin (merged PRs #111, #113, #114). The original pin is retained above for provenance; findings below are re-verified against the newer commit unless marked otherwise. Per `docs/DOCUMENTATION_STANDARDS.md`, this is an in-place refresh, not a new snapshot — superseded claims are corrected and cited, not silently dropped.

Scope: a high-level audit of major components, architecture, dependencies, gaps, and risks across the repository as a whole, requested independently of and prior to `docs/decomposition/00-AUDIT-FINDINGS.md`. This document does not replace that audit — it corroborates a majority of its findings from an independent pass and adds coverage of the `project/` corpus and repository-wide governance structure that the decomposition audit did not focus on. Where a claim overlaps with `docs/decomposition/`, this document says so and is marked accordingly; per `docs/DOCUMENTATION_STANDARDS.md`, contradictions between sources are preserved, not silently resolved.

Confidence labeling used throughout: **Confirmed** (independently re-verified this session via direct file read or git command), **Likely** (sourced from a parallel exploration pass or from `docs/decomposition/00-AUDIT-FINDINGS.md`, read directly but not independently re-run command-by-command), **Requires Verification** (explicitly flagged by its own source as unverified).

---

## 1. Executive Summary

**Overall assessment:** This is not a conventional application repository. It is a ~2.1 GB, ~24,000-file preservation corpus spanning six self-declared governance domains (Abstrekkt publishing, the legacy `project/` design/content corpus, an external Loxihart product tree frozen-in-place, an excluded INT/Intinc lane, restricted private/memoir/clinical material, and vendored/archived third-party code), governed by an authority-precedence framework (`AGENTS.md` → `REPOSITORY.md` → `repository-registry.yaml` → `project/CANON.md`). The governance model is sophisticated and largely self-consistent on paper. `docs/decomposition/00-AUDIT-FINDINGS.md` already exists, dated the same day as this audit — a positive signal that this is an actively self-auditing repo, not a neglected one.

**Top strengths:** a real, working authority/domain model; one production surface (`abstrekkt.com`) with genuine deployment evidence (a signed release receipt with route-level read-back checks); an existing, credible prior audit that this report was able to cross-check.

**Top risks:**
1. **Confirmed** — a tracked file with 108 credential-shaped key names (`Infinite-heroes-env.txt`) sits in the current `HEAD`, despite a documented July 2026 purge that evidently did not survive a September 2026 bulk-import commit. Still true as of this refresh (`62144788`); one touching commit since the original pin (`0f40468a`) made an unrelated content edit, not a removal.
2. **Confirmed** — the INT/Intinc lane, explicitly excluded by this repo's own `CLAUDE.md` ("not authorized by repository residence"), is physically present in **five** separate directory copies (10 tracked files), not three as originally counted — `abstrekkt-full/` alone holds three nested copies. The existing denylist's coverage of all five is now independently confirmed effective (see §4, §9).
3. **Likely** — large-scale content duplication (~99 byte-identical memoir/corridor directories, tripled personal-config bundles, a nested self-copy of the entire repo) directly contradicts the `project/` lane's own anti-duplication rule (`project/CANON.md`).
4. **Likely** — the one verified-live production deploy (`abstrekkt.com`) has a stale release receipt and references a CI workflow file that has never existed in this clone's tracked history (corrected from "no longer exists" — see Finding 3, §8).

**Since the original pin:** a hardcoded live demo credential in `loxihart/pilot-console` (`STAGING_DEMO_TOKEN`), which granted unauthenticated access to a live Supabase control-plane endpoint, was discovered and fixed by commits `d7d55a5c`/`6b1726e0` before this refresh's `HEAD` — a comparably severe issue to Finding 1 that this audit's original pass did not catch, closed same-day by other work. See the new Security finding in §6/§8. This further corroborates §1's "actively self-auditing repo" signal, but also means the original pin's security coverage was incomplete at the time it was written.

**Key limitations on confidence:** shallow git clone (51 commits — pre-2026-09-13 ancestry unverifiable); no build/install/test was executed anywhere; no live Cloudflare/Netlify/Vercel/GitHub account state was checked; a majority of directory-tree claims come from parallel exploration passes over large trees rather than exhaustive personal review, cross-checked against `docs/decomposition/00-AUDIT-FINDINGS.md` where overlapping.

---

## 2. Scope and Evidence Boundaries

**Evidence sources reviewed:**
- Direct reads: `README.md`, `AGENTS.md`, `REPOSITORY.md`, `repository-registry.yaml`, `CLAUDE.md` (root), `.gitignore`, `docs/SECURITY-AUDIT.md`, `docs/decomposition/00-AUDIT-FINDINGS.md`, `docs/export/MIGRATION_CONTRADICTIONS.md`, `docs/DOCUMENTATION_STANDARDS.md`.
- Direct git commands: `git ls-files`, `git log --oneline -- <path>`, `git check-ignore -v`, `wc -l` (line count only, no content) against `Infinite-heroes-env.txt`; `git status`, `git rev-parse HEAD`.
- Three parallel exploration passes: (a) repo root governance/CI/tooling inventory, (b) the `project/` corpus (1,936 files, `CANON.md`, brand/sensitivity scan), (c) `loxihart/` plus all remaining top-level directories (duplication and lane-boundary analysis).

**In scope:** the full working tree at commit `cdbb196f` on branch `claude/zen-rubin-fqxdit`; governance documents; CI workflow inventory *by filename and declared trigger*, not execution; `package.json`/lockfile presence across the tree. **This refresh (2026-09-19)** additionally directly re-checked the working tree at `62144788` (branch `claude/wonderful-knuth-1y7xju`): `git log`/`git show --stat`/`git show` on the 6 intervening commits, `git ls-files`/`git check-ignore -v` for `Infinite-heroes-env.txt`, exact `git ls-files` counts for `Memoir/`/`memoir/` and the INT/Intinc paths, the denylist file, the release receipt, and `.github/workflows/` — see the "Confirmed"/"this refresh" annotations throughout for exactly which claims this covers.

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
- **Site-platform evidence layer (new since original pin):** `docs/site-platform/portfolio-atlas/` — a schema-governed, fail-closed, evidence-backed registry for public portfolio entities (identity, authority domain, repo discovery/verification, publication state, claim maturity, evidence provenance) that explicitly does not infer deployment/production readiness from repo presence. Zero external dependencies; own CI workflow (`site-platform-portfolio-atlas.yml`, validate/test-only). Added `09455928`/`a3bc483e`, merged as PR #111.
- **CI/CD:** 25 GitHub Actions workflows (24 at the original pin, +1 `site-platform-portfolio-atlas.yml` validate/test-only workflow added since); only 3 represent real deploy paths, none auto-firing from `main`.
- **Excluded/adjacent lanes physically present despite policy:** `4-intinc-project/` (×5 copies, not ×3 as originally counted — see §4), a personal memoir/clinical corpus (~93–99 directories), and `abstrekkt-full/` (424 MB of vendored/archival material, including a nested self-copy of this entire repository).

**Data/control flow directly observed:** `evidence/releases/abstrekkt/2026-08-26-e1d3355-release-receipt.json` records a Cloudflare Pages deployment of `project/deploy/abstrekkt-com` at a specific SHA, with 4 routes verified returning HTTP 200. This is the only end-to-end source→CI→live-artifact chain with direct evidence in this repo.

**Observed vs. inferred:** the registry's domain-to-path mapping and the authority-precedence chain are directly observed (read verbatim from the governing files). That the 3 wired deploy workflows are the *only* production egress points is inferred from reading 25 workflow trigger declarations (24 at the original pin, +1 validate-only workflow added since — see §3), not from runtime confirmation.

---

## 4. Architecture and Component Review

**Boundaries and coupling:** the governance model draws boundaries by declared *domain* (a YAML classification) rather than by directory isolation. This is a soft boundary: a domain can be "excluded" on paper while its content is scattered across multiple real directories with no structural or access-control enforcement observed (no `CODEOWNERS`, no evidence of path-scoped branch protection).

**Patterns in use:** authority-precedes-path governance (explicit and documented); YAML domain-registry classification; a hash-verified migration-receipt contract for cross-repo moves (`repository-registry.yaml:66-77`), executed exactly once so far (status `REVIEW_PENDING`).

**Notable inconsistencies (each cited to evidence):**
- **INT/Intinc triplication (undercounted — actually 5 copies)** — `4-intinc-project/`, `kyle-context-files/4-intinc-project/`, and **three** nested copies under `abstrekkt-full/` (`abstrekkt-full/4-intinc-project/`, `abstrekkt-full/ab-enablement-co/kyle-context-files-v2/4-intinc-project/`, `abstrekkt-full/ab-enablement-co/kyle-context-files-v2/pitch-console/the-vault/kyle-context-files/4-intinc-project/`) all contain real Intinc operating-profile content — 5 directory copies, 10 tracked files total — despite `CLAUDE.md`'s explicit exclusion. The existing denylist (`docs/decomposition/never-extract.denylist:64-66`) was flagged as "coverage not independently confirmed"; this refresh confirms directly that its double-sided wildcard (`**/*intinc*/**`) matches all 5 paths at any depth. *(Confirmed — count and denylist coverage independently re-verified this session; corroborated by `docs/export/MIGRATION_CONTRADICTIONS.md` C-0001, already logged OPEN.)*
- **~99 duplicated memoir/corridor directories** at repo root, reported byte-identical to content already nested under `project/stitch_memory_corridor_studio/`. *(Likely, not independently re-run.)*
- **Tripled personal Claude-config bundles** (`1-global/`, `2-global-rules/`, `3-flashfusion-project/`, `4-intinc-project/`, `5-shared/`) across 3 locations, with at least 2 divergent content snapshots by md5. *(Likely, same caveat.)*
- **A nested self-copy of the entire repository** inside `abstrekkt-full/ab-enablement-co/abstrekkt-handoff/abstrekkt/`. *(Likely.)*
- **Case-only directory collision:** `Memoir/` (48 tracked files) vs. `memoir/` (7 tracked files) — will break `git clone`/checkout on case-insensitive filesystems (macOS/Windows default). *(Confirmed — exact 48/7 split independently re-verified this session via `git ls-files`; originally sourced from `docs/decomposition/00-AUDIT-FINDINGS.md` §5 and marked Likely.)*
- **Org-name mismatch:** git remote is `ChaosClubCo/abstrekkt`; governance docs (README/AGENTS/REPOSITORY/registry/SECURITY-AUDIT.md) self-reference `Krosebrook/abstrekkt` or `Krosebrook/Loxihart`. The newly added `docs/site-platform/portfolio-atlas/README.md` correctly self-identifies as `ChaosClubCo/abstrekkt` — the mismatch is now also a new-doc-vs-legacy-doc inconsistency, not purely doc-vs-git-remote. *(Likely.)*
- **`project/CANON.md`'s own anti-drift rule** ("never leave two canonical versions alive") is contradicted at scale by the findings above.

---

## 5. Dependencies and Integrations

No root-level `package.json`/lockfile exists — this is not a single buildable/deployable Node project. Dependency management is fragmented across roughly 30 shallow `package.json` files plus 100+ more nested under `abstrekkt-full/`.

**Frameworks observed (from `package.json` reads, not build-verified):** React 19 + Vite 7 + TypeScript 5.9 (`loxihart/pilot-console`); zero-runtime-dependency ESM Node packages by design (`loxihart/canonical-truth`, `change-receipt`, `floot-proxy-reference`); Express + TypeScript (`a2alayer/a2a-layer`); Next.js + three.js (`Unicorn-maybe/flashfusion-web`).

**Declared infrastructure integrations:** Cloudflare Pages (`abstrekkt.com`), Cloudflare Workers + D1 (`kr-mentor-proxy`, `abstrekkt-webhook-receiver`), Netlify (`netlify.toml` present but self-annotated "not currently linked to a Netlify project"), GitBook (`.gitbook.yaml`), one trusted MCP server declared in `.github/mcp.json` (`cloudflare-docs`, SSE transport, docs-search tool only).

**Declared vs. verified:** all of the above are declared-only from this audit's vantage point — no live account/API state was checked (explicitly out of scope). The one integration with real evidence is `abstrekkt.com`'s deployment, and even that is already known-stale (see Finding 3, §8).

**Highest-risk dependency-adjacent artifact:** `Infinite-heroes-env.txt` (108 credential-shaped key names spanning multiple third-party services per `docs/decomposition/00-AUDIT-FINDINGS.md`'s enumeration) — not a "dependency" in the software sense, but the single highest-risk integration-adjacent artifact in the repo. See §6/§8.

**Archival dependency surface:** `abstrekkt-full/ab-enablement-co/flashfusion-OAAS/` alone contains 6,346 files of vendored third-party repos, explicitly governed as "archive, never extract" — not intended for active dependency management.

**New internal governance artifact (since original pin):** `docs/site-platform/portfolio-atlas/` ships three Node scripts (`validate.mjs`, `build-public.mjs`, `test.mjs`) that import only `node:fs`/`node:path`/`node:url` — zero external dependencies, confirmed by grep. It is validated by its own CI workflow (`site-platform-portfolio-atlas.yml`, push/PR-triggered on path changes, no deploy step, no cloud credentials). This does not change the "no root `package.json`" / fragmented dependency-management finding (§8 Finding 8) — it's a dependency-free addition.

---

## 6. Risk Assessment

**Security**
- *Directly evidenced (Confirmed):* `Infinite-heroes-env.txt` is currently tracked in `HEAD` — independently verified via `git ls-files`, `git log --oneline -- Infinite-heroes-env.txt` (single commit `59c7fb89`, the 2026-09-13 bulk-import), and `git check-ignore -v` (not ignored, exit 1). A documented July 2026 purge (`docs/SECURITY-AUDIT.md`) used `git filter-repo` to remove this file from all history — but the September bulk-import commit evidently reintroduced it. Whether this was accidental or deliberate is unknown. Re-confirmed at this refresh's `HEAD` (`62144788`): still tracked, still not gitignored; the only intervening commit touching the file (`0f40468a`) made an unrelated content edit, not a removal.
- *Directly evidenced (Confirmed):* the repo's own `.gitignore` header attests it intentionally contains clinical records, an SSN fragment, DOB, home addresses, family names, and a police report, with an explicit "not a clearance to make public" warning — sitting at the same root as 12+ deploy-capable/CI-wired workflows.
- *Resolved between the original pin and this refresh (Confirmed):* `loxihart/pilot-console/netlify/functions/loxihart.mts` carried a hardcoded plaintext fallback credential (`STAGING_DEMO_TOKEN = "lakeview-public-demo-v1"`) granting unauthenticated access to a live Supabase control-plane endpoint (`https://nvolybcifgkzxvywhpuv.supabase.co/functions/v1/loxihart-control-api`) as identity `operator:kyle-demo`/`org-lakeview-hvac`, with CI (`pilot-console-live-probe.yml`, `pilot-console-live-release.yml`) unauthenticatedly exercising it and logging live response bodies, plus a PR-body-controlled Netlify deploy-path value (injection-shaped). Fixed by `d7d55a5c` (SHA-256 digest denylist of the revoked token, fail-closed 401/503 auth, no hardcoded fallback identity remains) and `6b1726e0` (removed the unauthenticated live probing and the PR-body-controlled deploy path). This was not caught by the original pin's audit pass — it existed at that commit and was closed by later same-day work, now folded into `HEAD` via PR #113.
- *Requires Verification:* 4 additional files pattern-matched for Stripe/JWT/GitHub-PAT/Slack-token-shaped strings — `arc-agent-connectors.js`, `site/portfolio_command_center_v2.html`, `abstrekkt-full/ab-enablement-co/json/desktop-config.json` (full path corrected this refresh from the original pin's abbreviated form), and `Unicorn-maybe/archive/AIFramework/DELIVERABLE 1 mcp-servers-config.js.txt` (full path corrected this refresh) — flagged by `docs/decomposition/00-AUDIT-FINDINGS.md` §4 as needing manual triage, not yet resolved.
- *Requires runtime/out-of-band verification:* whether any of the 108 named keys are still valid; whether GitHub Actions caches or CDN still hold purged blob copies.

**Reliability and fault tolerance**
- *Confirmed:* only 1 of 25 CI workflows represents a verified working production path, and its own release receipt names an execution workflow file that has never existed in this clone's tracked git history (see Finding 3, §8).
- *Likely:* the `Memoir/`/`memoir/` case collision is a concrete, reproducible defect for any contributor on a case-insensitive filesystem.

**Performance and scalability**
- No runtime telemetry available — out of scope. Static observation: ~2.1 GB repo (`.git` alone ~580 MB) with ~24,000 files landed in one commit.

**Maintainability and technical debt**
- *Likely:* the duplication findings in §4 are the dominant technical-debt driver, directly contradicting `project/CANON.md`'s own anti-drift rule.
- *Confirmed:* `repository-registry.yaml`'s own `deployment.abstrekkt_com.status: UNKNOWN` field is self-documented (in an inline comment in the same file) as pinned only to satisfy a literal-string match in `scripts/repo_integrity.py:89`, not to reflect real state.

**Data integrity**
- *Likely:* the migration-receipt contract (hash-verified source/target, `repository-registry.yaml:66-77`) has been executed exactly once (`REVIEW_PENDING`) against a backlog of 16 open contradictions logged in `docs/export/MIGRATION_CONTRADICTIONS.md`.

**Deployment and operational complexity**
- *Likely:* 25 GitHub Actions workflows exist for a repo that, by `docs/decomposition/00-AUDIT-FINDINGS.md`'s own characterization, "is not an app" — a high automation surface relative to the 3 workflows that actually deploy anything.

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
- Evidence observed: `git ls-files -- Infinite-heroes-env.txt` returns the file; `git log --oneline -- Infinite-heroes-env.txt` → one commit, `59c7fb89` (2026-09-13 bulk import), post-dating the 2026-07-19 `git filter-repo` purge documented in `docs/SECURITY-AUDIT.md`; `git check-ignore -v` confirms it is not gitignored; 134 lines. Re-verified at this refresh's `HEAD` (`62144788`, 2026-09-19): still tracked, still not gitignored; `git log --oneline 59c7fb89..62144788 -- Infinite-heroes-env.txt` shows one further commit (`0f40468a`, an unrelated content edit, not a removal).
- Evidence source: repo root `Infinite-heroes-env.txt`; `docs/SECURITY-AUDIT.md`; `docs/decomposition/00-AUDIT-FINDINGS.md` §4.
- Why it matters: a documented remediation (purge + force-push) was evidently undone by a later bulk-import commit — a live exposure if any of the 108 named keys remain valid.
- Confidence: **Confirmed** (independently re-verified this session).
- Validation needed: out-of-band check of whether any named key is still live; if so, rotate immediately; re-purge and determine how/why the file was reintroduced.
- Scope limitation: key *values* were never read, per security practice — only tracked-status and key count were confirmed.

**2. Governed exclusion (INT/Intinc lane) present in five directory copies (corrected from three)**
- Category: Architecture/Governance | Urgency: **High**
- Evidence observed: `4-intinc-project/`, `kyle-context-files/4-intinc-project/`, and three nested copies under `abstrekkt-full/` (`abstrekkt-full/4-intinc-project/`, `abstrekkt-full/ab-enablement-co/kyle-context-files-v2/4-intinc-project/`, `abstrekkt-full/ab-enablement-co/kyle-context-files-v2/pitch-console/the-vault/kyle-context-files/4-intinc-project/`) each contain real Intinc operating-profile content — 5 copies, 10 tracked files. This refresh independently confirmed the denylist's double-sided wildcard (`**/*intinc*/**`, `docs/decomposition/never-extract.denylist:66`) matches all 5 paths, resolving the original "coverage not independently confirmed" caveat.
- Evidence source: directory listings (this session); `docs/decomposition/never-extract.denylist`; `docs/export/MIGRATION_CONTRADICTIONS.md` C-0001 (already OPEN).
- Why it matters: directly conflicts with this repo's own stated lane-isolation policy; the extent is worse than originally counted, though the denylist is confirmed effective against accidental extraction.
- Confidence: **Confirmed** (count and denylist coverage independently re-verified this session).
- Validation needed: consolidate or remove redundant copies via the registry's migration-receipt process.

**3. Live production deploy path for abstrekkt.com is stale and unreproducible as documented**
- Category: Reliability/Deployment | Urgency: **Medium**
- Evidence observed: the release receipt (`evidence/releases/abstrekkt/2026-08-26-e1d3355-release-receipt.json`) names an `executionWorkflow` of `.github/workflows/abstrekkt-cloudflare-pages-one-shot.yml`; this refresh confirms via `git log --all -- .github/workflows/abstrekkt-cloudflare-pages-one-shot.yml` (no results) that the file has **never existed in this clone's tracked git history** — not merely deleted, as originally worded. `evidence/releases/abstrekkt/` still holds only this one 2026-08-26 receipt; subsequent sitemap/robots work (`d85d3579`, `90900ac1`) touched the *other* named workflow (`canonicalWorkflow: abstrekkt-cloudflare-pages.yml`), not the missing one, and produced no new receipt.
- Evidence source: `docs/decomposition/00-AUDIT-FINDINGS.md` §1–2; release receipt and `.github/workflows/` directly re-read this session.
- Why it matters: production redeploy currently has no confirmed working, current CI path.
- Confidence: **Confirmed** (workflow absence and receipt staleness independently re-verified this session).
- Validation needed: either restore/recreate a working one-shot deploy path or update the receipt-generation process to name the workflow that actually exists.

**4. Large-scale unmanaged content duplication**
- Category: Maintainability/Technical debt | Urgency: **Medium**
- Evidence observed: ~99 directories reported byte-identical between repo root and `project/stitch_memory_corridor_studio/`; tripled personal-config bundles with 2 divergent md5 snapshots; a nested self-copy of the whole repo.
- Evidence source: this session's exploration pass (spot-check diffs/md5s, not independently re-run).
- Why it matters: directly contradicts `project/CANON.md`'s own anti-duplication rule; inflates repo size and clone/CI time.
- Confidence: **Requires Verification**.
- Validation needed: independent re-verification, then a migration-receipt-governed dedup pass.

**5. Case-only directory collision (`Memoir/` vs `memoir/`)**
- Category: Reliability | Urgency: **Medium**
- Evidence observed: 48 vs. 7 tracked files under differently-cased top-level paths. Independently re-run this session: `git ls-files | grep -i '^memoir/'` returns 55 total, splitting exactly 48/7 by case.
- Evidence source: `docs/decomposition/00-AUDIT-FINDINGS.md` §5; independently re-verified this session.
- Why it matters: will break `git clone`/checkout for contributors on macOS/Windows default (case-insensitive) filesystems.
- Confidence: **Confirmed** (upgraded from Likely — exact counts independently re-run this session).
- Validation needed: none to confirm the counts; a rename/merge decision is still pending.

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
- Evidence observed: `arc-agent-connectors.js`, `site/portfolio_command_center_v2.html`, `abstrekkt-full/ab-enablement-co/json/desktop-config.json` (full path corrected this refresh), `Unicorn-maybe/archive/AIFramework/DELIVERABLE 1 mcp-servers-config.js.txt` (full path corrected this refresh). All 4 confirmed still present at current `HEAD`; none has been triaged by any commit since the original pin.
- Evidence source: `docs/decomposition/00-AUDIT-FINDINGS.md` §4 (read directly); paths independently re-verified this session.
- Why it matters: security posture cannot be called clean until manually classified as placeholder vs. live.
- Confidence: **Requires Verification** (the prior audit itself calls these untriaged; existence at current HEAD confirmed).
- Validation needed: manual, careful inspection of each file.

**10. High CI/automation surface relative to actual deploy activity**
- Category: Operational complexity | Urgency: Low
- Evidence observed: 25 workflow files at this refresh (24 at the original pin; `.github/workflows/site-platform-portfolio-atlas.yml` added since, validate/test-only, no deploy step or cloud credentials) vs. only 3 real deploy paths.
- Evidence source: `.github/workflows/` listing (this session) + `docs/decomposition/00-AUDIT-FINDINGS.md` §2.
- Why it matters: harder to reason about "what can actually touch production" when the large majority of workflows never deploy anything; the new workflow doesn't change this ratio meaningfully.
- Confidence: **Likely**.
- Validation needed: none critical; a workflow-inventory cleanup would reduce future audit surface.

**11. (Resolved before this refresh) Hardcoded live demo credential in `loxihart/pilot-console` gave unauthenticated access to a live control-plane endpoint**
- Category: Security | Urgency: **Critical at time of exposure — Resolved**
- Evidence observed: at the original pin (`cdbb196f`), `loxihart/pilot-console/netlify/functions/loxihart.mts` contained a hardcoded plaintext fallback (`STAGING_DEMO_TOKEN = "lakeview-public-demo-v1"`) accepted with no caller authentication, reaching `https://nvolybcifgkzxvywhpuv.supabase.co/functions/v1/loxihart-control-api` as identity `operator:kyle-demo`/`org-lakeview-hvac`; CI workflows (`pilot-console-live-probe.yml`, `pilot-console-live-release.yml`) exercised this unauthenticated, logging live response bodies, and a PR-body-controlled `NETLIFY_PROXY_PATH` value created an injection-shaped deploy-path risk.
- Evidence source: `git show d7d55a5c` and `git show 6b1726e0` (diffs read directly this session).
- Why it matters: this was a live, unauthenticated credential exposure in application source reachable via a public API — comparably severe to Finding 1, and not caught by this audit's original pass.
- Confidence: **Confirmed** (diffs independently read this session).
- Resolution: `d7d55a5c` replaced the hardcoded fallback with a SHA-256 digest denylist of the revoked token and fail-closed auth (missing/blank/revoked → `503`; mismatch → `401`; no hardcoded identity remains); `6b1726e0` removed the unauthenticated CI probing and the PR-body-controlled deploy path. Both landed before this refresh's `HEAD` (folded in via PR #113 / `e2821de1`).
- Validation needed: none for the fix itself (independently re-confirmed no hardcoded fallback remains at `HEAD`); consider whether the original demo token value needs out-of-band rotation on the Supabase side regardless of the code fix, since it is now public in git history.

---

## 9. Unknowns and Verification Gaps

- **Credential validity** for the 108 keys in `Infinite-heroes-env.txt` — requires out-of-band provider checks; resolves Finding 1 from "assume compromised" to a confirmed blast radius either way.
- **Pre-2026-09-13 git ancestry** — shallow 51-commit clone; an unshallow fetch could reveal whether the July purge's undoing was accidental or a deliberate re-import that didn't account for it.
- **Live Cloudflare Pages/Workers/D1, Netlify, and Vercel account state** — would confirm or refute current production status beyond the one stale receipt; directly affects Finding 3's severity.
- **Whether GitHub Actions caches or CDN still hold purged blob copies.**
- **Krosebrook/Loxihart's actual current contents** — out of this session's repo access scope.
- **Branch protection / CODEOWNERS / required reviews on GitHub** — not visible from the file tree.
- ~~**Exact denylist glob coverage** for the 3 INT/Intinc directory copies (Finding 2).~~ **Resolved this refresh:** independently confirmed the denylist's `**/*intinc*/**` wildcard covers all 5 copies (corrected count — see Finding 2, §8).

---

## 10. Recommended Deep-Audit Areas

| # | Scope | Why | Files/evidence to inspect | Expected outcome | Priority |
|---|---|---|---|---|---|
| 1 | Credential exposure triage | Highest severity, time-sensitive, only partially triaged | `Infinite-heroes-env.txt`, the 4 pattern-matched files, full unshallow git log for these paths | Either "confirmed dead/rotated" (close) or "N live keys found" (trigger incident response) | Critical |
| 2 | Deployment pipeline reconciliation for `abstrekkt.com` | Only verified-live surface, but its CI path is broken and receipt is stale | Release receipt JSON, `abstrekkt-cloudflare-pages.yml`, live Cloudflare API | A corrected current receipt or a documented, fixed deploy path | High |
| 3 | INT/Intinc lane-isolation enforcement | Conflicts with the repo's own stated exclusion policy | The 5 `4-intinc-project/` copies (corrected count, §4/§8 Finding 2), `never-extract.denylist` | Consolidation/removal of redundant copies (denylist coverage already confirmed) | High |
| 4 | Full unshallow git history audit | Can't currently confirm the purge's fate or branch-deletion history | Entire `.git` object store | Confirmation the Sept re-import is the sole reintroduction vector, or discovery of further recoverable blobs | High |
| 5 | Content-duplication remediation | Largest repo-size/tech-debt driver; violates `project/`'s own CANON.md rule | Root-level duplicate directories vs. `project/stitch_memory_corridor_studio/`; tripled config bundles; nested self-copy | Independent diff/md5 re-verification, then a migration-receipt-governed dedup pass | Medium |
| 6 | Repo-wide dependency/vulnerability scan | No current supply-chain visibility | Every `package.json`/lockfile pair | Consolidated, priority-ranked vulnerability inventory | Medium |

---

## 11. Audit Sequence

1. ~~**Re-verify cheap, high-value claims not independently re-run this session** — `Memoir/`/`memoir/` file counts, denylist glob match test.~~ **Done, this refresh:** `Memoir/`/`memoir/` counts confirmed exactly 48/7; denylist glob confirmed to cover all 5 INT/Intinc copies (corrected count). See Findings 2 and 5, §8.
2. **Full unshallow git fetch + `git fsck`** for the credential-file paths — prerequisite for confidently scoping the exposure window.
3. **Out-of-band credential-validity triage** for the 108 keys and the 4 pattern-matched files — can start in parallel with step 2.
4. **Live Cloudflare/Netlify/Vercel account-state pull** — independent of 1–3; needed to close Finding 3.
5. **INT/Intinc denylist remediation decision** — step 1's glob-test result is now in (denylist confirmed effective across all 5 copies); the remaining decision is consolidation/removal of the redundant copies via the registry's migration-receipt process, not further coverage testing.
6. **Content-duplication independent re-verification and dedup planning** — can run in parallel with 1–5; execute any actual dedup only through the registry's migration-receipt process.
7. **Repo-wide dependency/vulnerability scan** — lowest urgency; last, unless step 3 surfaces something that changes priority.

Highest-value first: steps 1–3 (credential exposure) are both confirmed and time-sensitive; everything else is important but not equally urgent.

---

## 12. Final Assessment

**Refreshed 2026-09-19 against `HEAD` (`62144788`), 6 commits ahead of the original pin.** The most consequential finding — the reintroduced credential-shaped file — remains open and unchanged at this refresh, and still deserves same-day human attention regardless of any other recommendation here. The `Memoir`/`memoir` collision and the corrected INT/Intinc count (5 copies, not 3) are now **Confirmed** rather than Likely — both independently re-run this session with exact counts. The registry's self-acknowledged stale status field is unchanged (byte-identical diff against the original pin). The duplication findings (~99 directories, tripled config bundles) and the four untriaged pattern-matched files (paths corrected this refresh) remain plausible and evidence-backed but still flagged by their own sources as needing further verification before action.

One new data point since the original pin: a comparably severe, previously uncaught credential exposure (a hardcoded live demo token in `loxihart/pilot-console` granting unauthenticated access to a live control-plane endpoint) was found and fully resolved by same-day follow-up commits before this refresh's `HEAD` — a positive signal for this repo's active-remediation cadence, but also evidence that the original pin's security coverage was incomplete when written, and that this refresh's own coverage should not be assumed complete either.

This audit's confidence is asymmetric: high for anything checkable from static files and git metadata, low for anything requiring live infrastructure, account, or organizational-process state — none of which was available in this workspace. The existence of a credible, same-day prior audit that this report was able to cross-check strengthens confidence in the shared findings, but does not substitute for independently re-running the handful of claims still marked "Likely" above before treating them as fully closed.
