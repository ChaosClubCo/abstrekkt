# Canonical Portfolio Census — 2026-09-11

## Executive Summary

This census converts the raw cross-platform development inventory into a defensible portfolio model. It intentionally does **not** count every repository, builder container, migration artifact, template, or historical version as a separate application.

**Current portfolio funnel:**

- **437 raw artifacts**
  - 388 accessible GitHub repositories
  - 49 Base44 application records
- **346 canonical project identities** after high-confidence lineage collapsing
- **91 duplicate/version artifacts collapsed** into canonical lineages
- **81 GitHub artifacts pushed within the prior 30 days**
- **77 recently active canonical identities** after deduplication
- **64 probable active GitHub-backed applications** after excluding obvious support/infrastructure/template/scaffold artifacts
- **5 current production candidates**
- **0 confirmed production-certified applications** under the evidence standard used by this audit

> Important: **346 means canonical projects, not canonical applications.** The **64 active applications** figure is a defensible lower-bound working set, not an exact historical all-platform application count. Base44 lacks directly comparable last-modified evidence, and GitHub push recency can include dependency, sync, configuration, or automated changes.

## Canonical Model

The portfolio should be represented as:

`ProductFamily → CanonicalProject → Artifact → Deployment`

Example:

`FlashFusion → Flash-n-Frame → ChaosClubCo/flashnframe-app → flashnframe.com`

Every canonical identity receives exactly one **type** and one **lifecycle**.

### Type

- `APPLICATION`
- `LIBRARY`
- `INFRASTRUCTURE`
- `DEVELOPER_TOOL`
- `TEMPLATE`
- `MIGRATION`
- `DOCUMENTATION`
- `EXPERIMENT`

Artifact-level records may additionally use `APPLICATION_VERSION` where useful.

### Lifecycle

- `PRODUCTION`
- `BETA`
- `PRE_RELEASE`
- `ACTIVE_DEVELOPMENT`
- `PROTOTYPE`
- `DORMANT`
- `SUPERSEDED`
- `ARCHIVED`
- `SCAFFOLD`

Archive status is lifecycle, not type.

## Current Production Candidate Ranking

Scoring rubric:

- Code substance: 25
- Recency: 20
- Deployment evidence: 20
- Product / README maturity: 20
- Cross-platform / lineage evidence: 15

This is readiness triage, not product desirability or market priority.

| Rank | Canonical product | Score | Current interpretation |
|---|---|---:|---|
| 1 | Flash-n-Frame | 92 | Strongest current production posture; release conditions remain |
| 2 | INTeract | 88 | Large, active product; technical debt and verification gaps remain |
| 3 | THE VERDICT | 85 | Strong engineering evidence; binding/certification blockers remain |
| 4 | Infinite Heroes: Bedtime Chronicles | 81 | Substantial product; deployment/runtime certification still incomplete |
| 5 | WebnFlow | 78 | Meaningful pre-release product; production deployment not verified |

**Watchlist:** Knowledge OS — 64/100. Recent security work is meaningful, but current product-definition evidence is weaker than the five leaders.

## High-Confidence Lineage Examples

The following families are treated as canonical products with multiple artifacts rather than independent applications:

- **INT Smart Triage AI** — 7 artifacts
- **FlashFusion Core** — 7 artifacts
- **Enterprise Profile Builder** — 6 artifacts
- **AutoArchitect** — 6 artifacts
- **INTeract** — 5 artifacts
- **Tessa** — 5 artifacts
- **Octave Studio** — 5 artifacts
- **AffordableStoreStuff** — 4 artifacts
- **TeamSync** — 4 artifacts
- **FlashFusion Website** — 3 artifacts
- **Flash-n-Frame** — 3 artifacts
- **INT Voice Library** — 3 artifacts
- **Beta Tester Army** — 3 artifacts
- **RailPass** — 3 artifacts
- **NanoGen Studio** — 3 artifacts
- **Pixel Perfect** — 3 artifacts

## Family Boundaries

Brand families must not be over-collapsed.

### FlashFusion

`FlashFusion` is a product family above multiple distinct canonical products, including examples such as FlashFusion Core, FlashFusion Website, Flash UI, FlashFusion Commerce Forge, FlashFusion Learn, FlashFusion Cowork, FlashFusion Plugins, FlashFusion IDE, FF Enable, Flash-n-Frame, AppBuilder/FlashFusion, and ff-claude-mobile.

### Kinsley / Kins

Kinsley/Kins-related projects are a family tag, not one application. Distinct products remain separate unless content evidence proves they are versions of the same product. Clear variants such as `KinsOpolis` / `KinsOpoliss` may collapse.

## Exclusion Policy for the Active-Application Count

The 64-app working set excludes obvious non-application/support artifacts such as:

- empty/scaffold repositories
- infrastructure and MCP support repositories
- migration kits
- source-of-truth and configuration repositories
- reusable templates and starter kits
- prompt/checklist/skills repositories
- generated UI/template experiments that have not been productized

Archived and empty statuses can overlap and therefore must **not** be subtracted independently from raw totals.

Classification does **not** authorize deletion or archival mutation. Underlying repositories remain intact unless an explicit repository-retirement action is separately approved.

## Activity Interpretation

Recent activity is tracked using GitHub push metadata as an initial signal, but future scoring should use **`last_meaningful_activity`** rather than `last_push` alone.

A meaningful-activity classifier should distinguish:

- user-authored product changes
- release / deployment work
- security changes
- substantive documentation / architecture changes
- automated dependency updates
- builder sync commits
- formatting/config-only changes

## Canonical Registry Schema

Recommended fields:

- `canonical_id`
- `canonical_name`
- `family`
- `type`
- `lifecycle`
- `primary_artifact`
- `artifact_count`
- `github_repositories[]`
- `base44_apps[]`
- `known_deployments[]`
- `supersedes[]`
- `superseded_by`
- `last_meaningful_activity`
- `code_substance_score`
- `documentation_score`
- `deployment_score`
- `security_score`
- `cross_platform_score`
- `portfolio_score`
- `confidence`
- `evidence[]`

## Portfolio Operating Budget

For a solo-founder operating model, the current recommendation is to constrain active attention to approximately:

- 5 flagship / strategic products
- 5–10 secondary maintained applications
- 10–15 live experiments
- everything else classified as dormant, superseded, archived, or support infrastructure

This turns a 400+ artifact estate into roughly 15–30 things that require ongoing human attention.

## Claims Check

### Supported

- Raw artifact count: **437**
- GitHub repositories in accessible inventory: **388**
- Base44 application records: **49**
- Canonical project identities after current high-confidence lineage collapsing: **346**
- Duplicate/version artifacts collapsed: **91**
- Recently pushed GitHub artifacts in the 30-day activity window: **81**
- Recently active canonical identities after dedupe: **77**
- Probable active GitHub-backed application working set: **64**
- Current production candidate pool: **5**
- Production-certified applications under this audit: **0 confirmed**

### Qualification / Blind Spots

- The 64 figure is a lower-bound operational working set, not a final historical application census.
- Base44 activity recency is not directly normalized to GitHub push metadata.
- A recent push is not necessarily meaningful product work.
- Ambiguous sibling projects remain separate unless lineage evidence is strong enough to merge them.
- The linked Google AI Studio application may duplicate an existing canonical product and therefore must not automatically increment project/application counts without identity evidence.

## Recommended Next Step

Run the 64-app working set through the same canonical classifier and assign each one to exactly one portfolio disposition:

1. `FLAGSHIP_STRATEGIC`
2. `PRODUCTION_CANDIDATE`
3. `ACTIVE_EXPERIMENT`
4. `MAINTAIN_DONT_EXPAND`
5. `RETIRE`

Then persist the canonical ledger as machine-readable CSV/JSON/XLSX with artifact-level lineage evidence and confidence scores.
