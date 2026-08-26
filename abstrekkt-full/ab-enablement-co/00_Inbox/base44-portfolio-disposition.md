# Base44 Portfolio Audit — Disposition & Consolidation Plan
**Scope:** 46 apps under the authenticated Base44 account · **Method:** `list_user_apps` + full/targeted `list_entity_schemas` pulls · **Date:** 2026-06-14

> **TL;DR** — 46 apps is not a portfolio, it's sprawl with a small production core. **5 apps carry the business** (audit/Involuer, SparkAcademy, FlashFusion, Fusion AI/Orchestrator, Velo). There is a **twin-engine problem** (two ~100-entity agent platforms) and a **triple client-ops problem** (three overlapping delivery surfaces — one of which you just rebranded). **3 confirmed integrity violations** ship forbidden/retired names inside schema enums. The WIR-02/WIR-04 memory note is **wrong** — the lane-snapshot entities never migrated. ~30 apps are archivable experiments. Concrete archive/keep/merge calls below.

---

## 1. Portfolio map (structural tiering — see §6 caveat)

| App | App ID | Ent | Tier | Role | Flag |
|---|---|---:|---|---|---|
| **audit / "Involuer"** | `69c440b10249984f1114bc4b` | 25 | **1** | **Strongest client-ops: lead funnel + portal + commerce** | soft (Invoke tier names) |
| **SparkAcademy** | `69180d077a5cbed7242f90ab` | ~113 | **1** | B2B multi-tenant LMS — CLC vehicle | soft (INTInc/"int"/Invoke in descriptions) |
| **FlashFusion** | `6a02ac1bad2b4e37732ef382` | 19 | **1** | Client-ops backend (scorecard→lead→project→case-study) | — |
| **Velo** (was Invelo) | `69861bd9ee42e63a83ea6c2e` | 3 | **1** | Just-rebranded client portal | **redundant vs audit/Involuer** |
| **Fusion AI** | `68dd8e79ca073475565c8e16` | 102 | **2** | Agent platform + own client/project/deliverable | twin-engine |
| **Orchestrator AI** | `694c756124d640756ea9ba23` | 99 | **2** | Multi-tenant agent platform (TokenBudget, WebhookBridge→n8n) | **VIOLATION** + twin-engine |
| **INTeract** | `691e3ae3bd4916f2e05ae35e` | 89 | **2** | Employee-engagement/recognition HR SaaS | off-lane + soft name |
| **Beta Tester Army** | `69d64045d159060e89b95019` | 79 | **2** | AI-persona UX testing | **VIOLATION** (ContextCapsule enum) |
| **Conduit** | `69d4d31db6dc03e671f83084` | 38 | **2** | YouTube multi-channel + Stripe | off-lane |
| **Chaos Club** | `69726bea1c1525bf9ac336d1` | 35 | **4** | B2C mental-health community | **VIOLATION** (retired brand) + off-lane |
| **Knowledge OS** | `69d896ccb63da457468b275b` | 10 | **2** | Personal knowledge graph | clean |
| **Tessa** | `69b6f0ff7b33fdefbbb4148f` | 2 | **3** | Income-idea kanban | name collision |
| **TESSA** | `68f83f5bde8a37c8491aec1f` | 5 | **3** | AI decision-simulator | name collision |
| **Champions Hub** | `68f81edd94b5b21e9c72953d` | 0 | **4** | Empty | delete |
| **~30 others** | (see ledger) | n/a | **3** | Retail/personal/generic experiments | archive candidates |

---

## 2. Confirmed integrity violations (remediate — your own standing rules)

These are **in schema enums/fields**, i.e. they ship in the data model, not just a label.

1. **Orchestrator AI** `694c75…` — `PosthogEventSnapshot.lane`, `CalendarSyncLog.lane`, `LaneSummarySnapshot.lane` all enum `[intinc, customization_service, kinsley, personal, unassigned]`; `LaneSummarySnapshot` has fields `kinsley_milestones_hit`, `intinc_skills_rebuilt`, `cs_revenue_usd`.
2. **Beta Tester Army** `69d640…` — `ContextCapsule.projectLane` enum `[Intinc, Customization Service, Kinsley, Personal, Other]`.
3. **Chaos Club** `69726b…` — app **name** = retired ChaosClubCo; entity **`ChaosTriage`** hardcodes the retired brand.

**Soft flags** (description strings / brand-inconsistent enums, lower priority): SparkAcademy `ClientOrganization.account_manager_email` description "INTInc / FlashFusion…", `invoke_engagement_tier [none,launchpad,deploy,assure]`, `Course.target_personas` includes `int`; INTeract app-name prefix.

**Remediation = schema edits** via `update_entity_schema` (rename enum members → neutral tokens, drop `kinsley_*`/`intinc_*`/`cs_*` fields or rename to generic `segment_*`). Chaos Club needs app rename + `ChaosTriage`→neutral, or archive.

---

## 3. The WIR-02/WIR-04 fix — memory was wrong

**Verified by targeted query:** FlashFusion app `6a02ac…` returns **empty** (`total:0`) for `PosthogEventSnapshot` / `LaneSummarySnapshot` / `CalendarSyncLog`. They exist **only** in Orchestrator AI `694c75…`.

- Memory's "migrate n8n to point at FlashFusion app" is based on a migration that **never happened**.
- **This is not a dedupe problem** — the entities are not in both apps.
- **Correct fix:** point the n8n workflow at **Orchestrator AI `694c75…`** (where the entities live), **or** create the entities in the FlashFusion app first. Pointing n8n at the FlashFusion app as-is = **silent write failure** (writes to non-existent entities).

---

## 4. Consolidation decisions

### 4a. Client-ops (THREE overlapping surfaces)
You have audit/Involuer (25, full funnel+portal+commerce), FlashFusion (19), and Velo (3, just rebranded).

| Option | Move | Tradeoff |
|---|---|---|
| **A (recommended)** | Make **audit/Involuer `69c440…` the single client-ops system.** Fold FlashFusion-app's unique bits in; **retire Velo's Project/Task** (audit/Involuer already has Engagement/Roadmap/KanbanTask) and keep Velo *only* as a public Resource hub skin, or sunset it. | Undoes part of the Velo rebrand effort; one source of truth; least data model duplication. |
| **B** | Keep **Velo** as the client portal (fresh FF tokens) and demote audit/Involuer to lead-funnel only. | Throws away the most mature, RLS-secured portal you have. Not advised. |
| **C** | Run audit/Involuer + Velo in parallel, defined boundary (Involuer=funnel+delivery, Velo=resource hub). | Two surfaces to maintain; boundary drift risk. |

**Pick A.** audit/Involuer is objectively the strongest (production RLS, lead funnel, commerce, exec reports, talent, tool connections). Velo's 3 entities are a subset of what it already does.

### 4b. Agent platform (TWIN ENGINE)
Fusion AI (102) and Orchestrator AI (99) are both full agent platforms. **Pick ONE.** Orchestrator has the live `WebhookBridge`→`krosebrook.app.n8n.cloud` and the lane-snapshot pipeline, so it's the one with live wiring — but it also carries the naming violations. Decision gate: **before archiving either, confirm no n8n workflow or published domain points at it** (ties to the stale-subdomain WIR issue).

---

## 5. Sequenced action plan

1. **Resolve WIR first** (unblocks telemetry): repoint n8n at Orchestrator AI `694c75…` OR create the 3 entities in FlashFusion app. *(Decision needed: which app is canonical for lane snapshots.)*
2. **Scrub violations** (integrity rule, no dependency): `update_entity_schema` on Orchestrator AI (3 entities) + Beta Tester Army (ContextCapsule). Rename/clear `intinc/kinsley/cs` enum members + fields.
3. **Chaos Club:** rename app + `ChaosTriage`, or archive. Off-lane B2C wellness — likely archive.
4. **Client-ops consolidation (Option A):** designate audit/Involuer canonical; decide Velo's fate (resource-hub skin vs sunset). *Reconciles the Workstream-1 rebrand.*
5. **Agent platform:** pick Fusion AI vs Orchestrator after dependency check.
6. **Tier-3 sweep:** check `Site 6905b1b4…` for a live domain; archive the rest of the ~30 unless a custom domain/n8n workflow points at them.
7. **Rename Tessa/TESSA** to disambiguate (or archive both).
8. **Delete** Champions Hub (empty).

---

## 6. Risks

- **Behavioral blindness:** all tiering is **structural** (entity counts/schemas). No usage/traffic/last-deploy data was available. A "Tier-3" app could be live; **do not archive any app before confirming no custom domain or n8n workflow targets it.** This is the single biggest operational risk.
- **Archiving an agent platform** could sever live n8n workflows if Fusion AI / Orchestrator share a backend (unconfirmed).
- **Velo rework** discards recent rebrand effort — sunk cost, but parallel surfaces cost more long-term.
- **Schema enum edits** on live entities: existing records holding the old enum value may fail validation. Migrate data values before tightening enums.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS
- [SOURCED] audit/Involuer `69c440…` = 25 entities incl. FreeAssessment/EmailSequence/AuditSubmission/Engagement/Roadmap/Document/Booking/Purchase — direct schema pull.
- [SOURCED] FlashFusion app `6a02ac…` returns empty for the 3 lane-snapshot entities — targeted query (`total:0`).
- [SOURCED] Orchestrator AI lane enums `[intinc,customization_service,kinsley,personal,unassigned]` + `kinsley_*`/`intinc_*`/`cs_*` fields — direct schema.
- [SOURCED] SparkAcademy ClientOrganization/LearningPath/EmployeeProfile/Course exist and support CLC 3-step activation — targeted pull.
- [SOURCED] Tessa (2 ent) and TESSA (5 ent) are distinct apps, not duplicate data — both pulled.
- [GENERATED] "audit/Involuer is the strongest client-ops app" — judgment from entity completeness + RLS maturity vs FlashFusion(19)/Velo(3); not a usage measurement.
- ! [SOURCED→CONTRADICTION] Memory: lane-snapshot entities live in FlashFusion app + WIR repoints n8n there. Reality: they live only in Orchestrator AI. Migration never happened.
- ! [GENERATED→CONTRADICTION] Workstream-1 Velo rebrand created a 3rd client-ops surface; audit/Involuer already contains a full RLS-secured portal that supersedes it.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS
- No usage/traffic/last-deploy/custom-domain data on ANY app — tiering is structural only.
- ~30 Tier-3 apps classified by name, not schema (full pulls would exhaust context for no decision value; reversible — pull individually if a specific one is suspect).
- Unknown whether Fusion AI and Orchestrator AI share an n8n backend — gates safe archival of either.
- Unknown which apps own live custom domains vs orphaned `.base44.app` subdomains (the stale-subdomain WIR bug lives here).
- FlashFusion app (19 ent) not re-pulled this session — its unique-vs-overlap delta with audit/Involuer is from prior-session notes, not re-verified.
