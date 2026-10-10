# Audit findings — Abstrekkt repository, live-app decomposition

Authority domain: `abstrekkt_publication` (`repository-registry.yaml:9-19`).
Source revision: `Krosebrook/abstrekkt @ 45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3` (branch `main`), audited 2026-09-18.
Claim states follow `docs/DOCUMENTATION_STANDARDS.md`: IMPLEMENTED / VERIFIED / DEPLOYED / CERTIFIED / BLOCKED / INCONCLUSIVE.

## TL;DR

This repository is a 1.5 GB, 24,189-file preservation corpus, not an app. It already governs itself as such (`REPOSITORY.md`, `repository-registry.yaml`). One surface is already live: `abstrekkt.com`, served from Cloudflare Pages, CERTIFIED at a frozen SHA. The repository's own `.gitignore` header states it must never be made public, mirrored, or forked, because it holds clinical records, a police report, an SSN fragment, DOB, addresses, and third-party family names. A tracked file contains ~108 live third-party credential names. Making "this repo" a live public app is not an available option; extracting specific surfaces into fresh, purpose-scoped repositories is.

## 1. What is already live

`evidence/releases/abstrekkt/2026-08-26-e1d3355-release-receipt.json` — [SOURCED], read directly:

- `releaseCandidate.sha = e1d3355fd00dce8d739f2dbacbd3398e8cdefe11`, root `project/deploy/abstrekkt-com` (file:7-9)
- `deploymentUrl = https://ee78ba2a.abstrekkt.pages.dev`, `pagesDeploymentId = ee78ba2a-7f8f-49c4-9dbd-fddc20ca57a8` (file:33-35)
- `productionReadBack.status = PASS`; routes `/`, `/founder/`, `/pillars/`, `/contact/` all 200 (file:44-61)
- `operationalStatus = PRODUCTION_SERVING`, `overallStatus = CERTIFIED`, `blockingGates = []` (file:163-166)

**Contradiction, verified:** `repository-registry.yaml:79-91` still records `deployment.abstrekkt_com.status: UNKNOWN`. The last edit to that file (`b7468661`, 2026-09-13) postdates the 2026-08-27 receipt. The registry is stale, not the deployment — corrected in this same change (see §7).

**Caveat, verified:** the receipt's SHA is not the current HEAD (`45b2bb07`). This repo's shallow clone (51 commits) cannot confirm the receipt SHA's ancestry, but `git log` shows two later commits (`d85d3579`, `90900ac1`) changed sitemap/robots generation for the same deploy root — those changes are not yet re-deployed. Live site is provably behind HEAD.

## 2. What is wired to deploy, and how

25 GitHub Actions workflows exist. Exactly three deploy paths exist and **none auto-fire from `main`**:

| Target | Trigger | Workflow |
| --- | --- | --- |
| `abstrekkt.com` (Cloudflare Pages) | `workflow_dispatch` only, explicit `candidate_sha` | `.github/workflows/abstrekkt-cloudflare-pages.yml` |
| `kr-mentor-proxy` (Cloudflare Worker) | push to `deploy/kr-mentor-proxy` | `.github/workflows/kr-mentor-proxy-deploy.yml` |
| `abstrekkt-webhook-receiver` (Worker + D1) | push to `deploy/abstrekkt-webhook-receiver` | `.github/workflows/abstrekkt-webhook-receiver-provision.yml` |

Neither deploy branch exists locally (only `main` and the working branch). The remaining 22 workflows are verify-only CI, one-shot provisioning runs (several bound to spent, hardcoded SHAs and run IDs), or Loxihart-lane gates that stop short of a deploy step.

One dangling reference: the release receipt names `executionWorkflow: .github/workflows/abstrekkt-cloudflare-pages-one-shot.yml` (receipt L23) — that workflow file no longer exists. The production deploy that produced the CERTIFIED receipt ran from a one-shot workflow since deleted.

## 3. Runnable-app inventory (disposition summary)

Full detail in `01-DECOMPOSITION_PLAN.md`. Headline:

- **Already live, extract as-is:** `project/deploy/abstrekkt-com/` (6 files, static HTML).
- **Deploy-wired, extract:** `project/proxy-deploy/` (Cloudflare Worker), `tooling/webhook-receiver/` (Worker + D1, missing its own `wrangler.toml` — config lives only in CI).
- **Complete, unwired, extract:** `a2alayer/a2a-layer/` (Express + TS, 40 agent cards, lockfile, no `build` script, no deploy target — the strongest standalone candidate after the site).
- **Loxihart-lane, do not ship from here:** `Unicorn-maybe/flashfusion-web/`, `project/remediation/clean/website/` + `project/audit/src/website/` (identical Turborepo, no lockfile, keep one copy), `project/remediation/clean/dashboard/`. `repository-registry.yaml` routes current FlashFusion product surfaces to `Krosebrook/Loxihart`.
- **Frozen, external owner:** `loxihart/pilot-console/` and siblings — the most CI-wired app in the repo (6 workflows), yet governance (`AGENTS.md:16-22`) forbids mutating it here.
- **Archive, never extract:** `abstrekkt-full/ab-enablement-co/flashfusion-OAAS/` (6,346 files, vendored third-party repos), the nested self-copy at `abstrekkt-full/ab-enablement-co/abstrekkt-handoff/abstrekkt/`, ~93 private-lane directories (memoir/clinical/family), all INT/Intinc material.

**Tension flagged, not resolved here:** `.cursor/environment.json` names `Unicorn-maybe/flashfusion-web` as the one app the Cloud Agent dev environment runs (`.cursor/install.sh:4-12`), while the registry routes that same app's lane to Loxihart. One of the two is wrong; this audit does not adjudicate it and does not edit `.cursor/`.

## 4. Security — blocking, independent of any decomposition decision

**`Infinite-heroes-env.txt` is tracked in git**, 134 lines, 108 unique `KEY=value` credential names (Anthropic, OpenAI, GitHub PAT, Vercel, Railway, Notion OAuth, Supabase service-role variants, and more — full list in `02-SECRET-ROTATION-RUNBOOK.md`). Committed in `b7468661`. The `.gitignore` rule `*-env.txt` is inert for this file because it was already tracked before the rule was added — `git check-ignore` confirms it does not currently match.

**Values were never read or printed by this audit or its subagents.** Treat every named key as potentially live until a human confirms rotation.

Four additional files were flagged by pattern-matching (Stripe/JWT/GitHub-PAT/Slack-bot-token shaped strings in code, not docs) and need manual triage, not blanket rotation, since some may be example/placeholder values:

- `arc-agent-connectors.js` (root)
- `site/portfolio_command_center_v2.html`
- `abstrekkt-full/ab-enablement-co/json/desktop-config.json`
- `Unicorn-maybe/archive/AIFramework/DELIVERABLE 1 mcp-servers-config.js.txt`

No real `.env`, `.env.local`, or `.env.production` file is tracked — the seven env-shaped tracked files are all `.env.example` / `.env.production.template`. `.gitignore` coverage for future secrets is otherwise strong.

## 5. Why this repository cannot become the public app

`.gitignore:1-20`, read verbatim, is a dated attestation:

> "⚠ THIS REPO MUST STAY PRIVATE. It intentionally contains clinical records (SPECT renders, Amen Clinics eval, CPT-3 / TBR assessments), memoir source material, a police incident report, and personal identifiers including an SSN fragment, DOB, home addresses, and family names. … That authorization covers THIS private repo only — it is not a clearance to make the repo public, mirror it, or fork it elsewhere."

Corroborated on disk: `clinical-source/` (4 SPECT scan images), root-level clinical PDFs/docx (`RosebrookK_CPT_20220707.pdf`, `Rosebrook_K_Eval.docx`, `Creado Treatment Contract 2021 - Copy.pdf`, others), and roughly 93 top-level directories of memoir/clinical/family source material sitting at the same root as 12 deploy-capable workflows. The only thing currently containing that blast radius is a single hardcoded path string in one workflow (`candidate/project/deploy/abstrekkt-com`).

Checked and **not** a disclosure risk on its own: the published `project/deploy/abstrekkt-com/founder/index.html` does narrate the SPECT scan (line 288) as an intentional part of the founder's public story — that is Kyle's own narrative choice, already live, distinct from the raw clinical files sitting elsewhere in the tree. Two directories, `memoir_letter_to_kinsley/` and `parallel_constructions_kinsley/`, sit outside what `project/abstrekkt/protections.js`'s "absent" policy for Kinsley permits in rendered output — they must never be extracted (see denylist).

**Additional structural blocker for any "clean up this repo instead" approach:** `git ls-files` confirms both `Memoir/` (48 tracked files) and `memoir/` (7 tracked files) exist — a case-only collision that breaks `git clone` on case-insensitive filesystems (macOS default, Windows). The `.git` directory alone is 579 MB.

## 6. Existing decomposition authority — do not re-invent

`repository-registry.yaml` already defines seven authority domains with an explicit migration contract (`source_repository, source_revision, source_path, source_hash, target_repository, target_revision, target_path, target_hash, verification_status`, `deletion_gate: target_hash_verified`, lines 66-77). It has been executed for exactly one artifact (`docs/migrations/loxihart/evidence-room-v1.2-certification-docs-sync.md`, status `REVIEW_PENDING`). `docs/export/MIGRATION_CONTRADICTIONS.md` records 16 open ownership/deployment/publication contradictions and explicitly instructs: preserve the contradiction, escalate to the owning authority, never resolve by filename or path age (file:30). This plan follows that contract rather than replacing it.

## 7. Correction made in this change

`repository-registry.yaml:79-91` — the literal `status: UNKNOWN` field is left unchanged because `scripts/repo_integrity.py:89` hard-requires that exact fragment to remain present as a CI governance gate (discovered while running this change's own verification; weakening that gate was out of scope). A new `evidence_status: DEPLOYED` field, a `receipt` pointer, and a `live_sha` field were added alongside it, recording the evidence from §1 without altering the gated field. This is the only edit to an existing governed file in this change; everything else is new documentation under `docs/decomposition/`. Updating `repo_integrity.py` to check semantics instead of a literal string is flagged as a follow-up, not done here.

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- [SOURCED] `abstrekkt.com` CERTIFIED at `e1d3355f…` — release receipt.
- [SOURCED] Registry said `UNKNOWN` post-dating the receipt — `repository-registry.yaml` + `git log`. ! Contradiction, corrected in §7.
- [SOURCED] `Infinite-heroes-env.txt` tracked with 108 key names — `git ls-files`, direct read of key names only.
- [SOURCED] `.gitignore` "must stay private" attestation — `.gitignore:1-20`.
- [SOURCED] `Memoir/`/`memoir/` case collision — `git ls-files`.
- [GENERATED] Disposition summary in §3 — synthesized from three parallel exploration passes; see `01-DECOMPOSITION_PLAN.md` for the full inventory table and its own sourcing notes.
- ! `.cursor/environment.json` vs. registry disagree on whether `flashfusion-web` is an Abstrekkt or Loxihart-lane app — unresolved, flagged not fixed.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- Shallow clone (51 commits) — full commit history, and the receipt SHA's ancestry, could not be verified.
- No private-lane file content was opened; classification is by path/filename only.
- No `npm ci` or build was run anywhere; "buildable" claims in `01-DECOMPOSITION_PLAN.md` are inferred from `package.json` + lockfile presence, not verified.
- Live Cloudflare account state (DNS, second `abstrekkt` Worker with `*.loxihart.com`/`*.flashfusion.co` routes per `docs/cloudflare/CloudflareResourceSourceManifest.v1.json:8`) was not checked against a live API.
- `Krosebrook/Loxihart` was out of this session's repository scope; whether it already contains the FlashFusion apps listed for handoff is unconfirmed.
