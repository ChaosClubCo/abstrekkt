# Base44 Portfolio Audit — 2026-06-14

> **Scope & method.** Read-only audit of every app under the authenticated Base44 account
> (`kylerosebrook@gmail.com`), via the Base44 MCP read tools `list_user_apps`,
> `list_entity_schemas`, and `query_entities`. No write/create/update/delete tool was ever
> called. Counts come from the `count` field of `query_entities`; where a probe hit the
> `limit:5` cap the true count may be higher (shown as `5+`). Every claim is tagged
> `[SOURCED]` (from a tool call) or `[INFERRED]` (reasoning over sourced data).

---

## TL;DR

- **Total apps: 46** `[SOURCED]`
- **Production: 1** (marginal) · **Built-empty: 34** · **Scaffold: 9** · **Experiment/Dead: 1** · **Retired: 1** `[INFERRED]` from per-app data
- **GitHub-connected Base44 repos: 0** · **S3-backed: 46** — every app reports `git_remote_source: "s3"` `[SOURCED]`
- **Real external users across the entire portfolio: effectively 1.** Only **INTeract** has a single plausibly-real non-owner user (`h0tt3r0tt3r@gmail.com`); every other app's `User` table contains only the owner's own accounts (`kylerosebrook@gmail.com`, `krosebrook86@gmail.com`, `kylerosebrook86@gmail.com`, `fusion@flashfusion.co`) and/or `@example.com` test accounts. `[SOURCED]`

**Top 3 integrity flags**
1. **No app has real customer/user data.** The most "complete-looking" platforms — FlashFusion (19 entities), audit (25), SparkAcademy (114), Fusion AI (102), Orchestrator AI (99), Site (121) — are all populated only by seed/demo/test rows and the owner's own logins. Schema maturity ≠ a live business. `[SOURCED]`
2. **Retired brand still live:** **Chaos Club** (`69726bea1c1525bf9ac336d1`) — a mature 35-entity social/community schema, entirely empty → **[RETIRED BRAND — recommend archive]**. `[SOURCED]`
3. **Heavy seed/test contamination presented-as-real risk:** `audit` (7/7 FreeAssessments are `internal_test:true`), Enterprise Hub & Nexus Copilot ("Acme" orgs), SparkAcademy (`@acme-demo.example` enrollments), SkySync / AuraFlow / CreditReview / SoleIgnite (parody/placeholder emails). None of this should ever be reported as real leads or results. `[SOURCED]`

**Top 3 recommendations**
1. **Consolidate.** Pick ONE system-of-record per function and archive the rest (see Recommendations). At least 4 obvious overlap clusters and 2 exact duplicates exist.
2. **Archive the retired brand and the empty/dead apps** (Chaos Club + ~10 zero-record apps) to cut surface area.
3. **Purge or clearly tag seed/test data** before any of these apps is shown to a prospect or used for a metric.

---

## Priority platforms (deep)

### 1. FlashFusion — `6a02ac1bad2b4e37732ef382` → **BUILT-EMPTY**
- **Entities:** 19, **RLS:** fully defined (role-based `admin`/`user`/`client`, client-scoped reads) — the most rigorous RLS in the portfolio. `[SOURCED]`
- **Real-record reality:** Exactly **1** record each in Lead / Client / Project / Scorecard, all the *same* entity — "Meridian Operations" (`sarah@meridianops.com`), threaded Lead→Client→Project→Scorecard. This is a single coherent **demo walkthrough**, not a real client. **[SEED/DEMO — not real]**. `[SOURCED]`
- **Users:** 1 (`kylerosebrook@gmail.com`, admin). `[SOURCED]`
- **Overlap:** This is the *intended* CRM/consulting system-of-record, yet the actual client-tracking data lives in **Invelo** (see #4). `[INFERRED]`
- **Source:** S3-backed, no GitHub remote. `[SOURCED]`

### 2. audit — `69c440b10249984f1114bc4b` → **BUILT-EMPTY**
- **Entities:** 25, **RLS:** defined (admin + email-scoped self-access; public create on assessments). `[SOURCED]`
- **Real-record reality:** FreeAssessment = **0 real / 7 test** (every row `internal_test:true`, all `@flashfusion.co` QA emails: `fusion@`, `chrome-test@`, `verify-sequence@`, `test@`) **[SEED/TEST]**. AuditSubmission **0**. Purchase **0**. Engagement **4** = 1 owner (`kylerosebrook@gmail.com`) + 3 seed (`client1/2/3@anon.com`) **[SEED/TEST]**. `[SOURCED]`
- **Users:** 4, all owner accounts (`kylerosebrook@gmail.com`, `fusion@flashfusion.co` admins; `krosebrook86@`, `d9social76@gmail.com`). `[SOURCED]`
- **Overlap:** This is a second AI-readiness assessment/lead funnel — directly overlaps FlashFusion's Lead/Scorecard funnel. `[INFERRED]`
- **Source:** S3-backed. `[SOURCED]`

### 3. SparkAcademy — `69180d077a5cbed7242f90ab` → **BUILT-EMPTY**
- **Entities:** **114** (all with RLS) — enterprise-grade AI-literacy LMS (courses, compliance/SCIM/EEOC, gamification, mentorship, governance). `[SOURCED]`
- **Real-record reality:** Course catalog **5+** (seeded content: "AI for Service Businesses", "AI for the Skeptical Manager", …). Enrollment **5+** but all students are `@acme-demo.example` **[SEED/TEST — demo]**. UserProfile **5+** (empty profile shells). Lead **0**. `[SOURCED]`
- **Users:** 3, owner-only (`kylerosebrook@gmail.com` admin, `fusion@flashfusion.co`, `kylerosebrook86@`). `[SOURCED]`
- **Source:** S3-backed. `[SOURCED]`

### 4. Invelo — `69861bd9ee42e63a83ea6c2e` → **SCAFFOLD** (thin schema, but real operational data)
- **Entities:** 3 (Project, Task, Resource), **RLS:** none surfaced. `[SOURCED]`
- **Real-record reality:** Project **3** — and these look like **genuine client engagements**: "College of Lake County - AI Workshop", "Iron Horse Custom Furniture - AI Enablement", "Art - Real Estate AI Enablement". Task **5+** with real-sounding work items ("Session 2: prompt engineering for client comms", "Document first AI win for anonymized case study"). `[SOURCED]`
- **Users:** 1 (owner). `[SOURCED]`
- **Integrity note / overlap:** The owner appears to use this throwaway 3-entity tracker as the **actual** client/project record, while the purpose-built FlashFusion CRM holds only a demo. System-of-record is inverted. `[INFERRED]`
- **Source:** S3-backed. `[SOURCED]`

### 5. Fusion AI — `68dd8e79ca073475565c8e16` → **BUILT-EMPTY**
- **Entities:** **102** — a sprawling "everything platform" (AI generation, courses+enrollment, e-commerce Orders/Payments/Invoices, prompt management + A/B testing, pipelines, plugins, webhooks). `[SOURCED]`
- **Real-record reality:** Lead **0**, Order **0**, Payment **0**. `[SOURCED]`
- **Users:** 3, owner-only. `[SOURCED]`
- **Overlap:** Name collision and functional overlap with **FlashFusion** (#1) and with several agent/course apps. Massive ambition, zero data. `[INFERRED]`
- **Source:** S3-backed. `[SOURCED]`

### 6. Orchestrator AI — `694c756124d640756ea9ba23` → **BUILT-EMPTY**
- **Entities:** **99** — deep agent-orchestration runtime (agents, skills, training, runtime quality gates, cost/token budgets, validation rule sets). `[SOURCED]`
- **Real-record reality:** Workflow **3**, all `status: draft` (owner experiments: "Universal Sync Workflow", "Custom Skills Generation for Claude Desktop"). Organization **0**. `[SOURCED]`
- **Users:** 1 (owner). `[SOURCED]`
- **Overlap:** Agent-orchestration scope overlaps **agentrus**, **Graph Studio**, and Fusion AI's agent entities. `[INFERRED]`
- **Source:** S3-backed. `[SOURCED]`

---

## Full app inventory

> `Real records?` answers "are there any non-seed, non-owner records?" `Source backing` is S3
> (no GitHub remote) for all 46 — see Repo/source section. All `User` tables are owner-only
> unless noted.

| # | App | ID | Class | Entities | Real records? | Notes |
|---|-----|----|-------|---------:|---------------|-------|
| 1 | FlashFusion | `6a02ac1b…ef382` | BUILT-EMPTY | 19 | No — 1 demo client (Meridian Ops) | Best RLS; intended CRM but holds only a demo |
| 2 | audit | `69c440b1…bc4b` | BUILT-EMPTY | 25 | No — 7 test, 3 `@anon.com` seed | All FreeAssessments `internal_test:true` |
| 3 | SparkAcademy | `69180d07…90ab` | BUILT-EMPTY | 114 | No — `@acme-demo.example` enrollments | Enterprise LMS, seed-only |
| 4 | Invelo | `69861bd9…6c2e` | SCAFFOLD | 3 | **Yes (owner)** — 3 real client projects | Acts as the real project tracker |
| 5 | Fusion AI | `68dd8e79…8e16` | BUILT-EMPTY | 102 | No — 0 leads/orders/payments | "Everything" platform, empty |
| 6 | Orchestrator AI | `694c7561…ba23` | BUILT-EMPTY | 99 | No — 3 draft workflows | Owner experiments only |
| 7 | INTeract | `691e3ae3…e35e` | **PRODUCTION (marginal)** | 89 | **Yes** — real UserProfile/Recognition | **Only app with a real external user** (`h0tt3r0tt3r@gmail.com`); also 2 `@example.com` test users |
| 8 | Site | `6905b1b4…62b1` | BUILT-EMPTY | **121** | No — 1 draft website | Largest schema in portfolio; AI website builder |
| 9 | Beta Tester Army | `69d64045…5019` | BUILT-EMPTY | 79 | No — Persona 0, TestRun 1 (owner) | Full RLS on all 79; **this repo's app** |
| 10 | Conduit | `69d4d31d…3084` | BUILT-EMPTY | 38 | Owner content only — Channel/Video `5+` | Real branded content under `kyle@flashfusion.co`, no other users |
| 11 | agentrus | `69bc8365…a1fd` | BUILT-EMPTY | 13 | No — `[SEED/TEST]` marketplace/metrics | Templates authored by "platform" |
| 12 | AI Game Day Oracle | `69845451…8d47` | BUILT-EMPTY | 11 | No — Room "test1"/"Test21", Msg 0 | `[SEED/TEST]` |
| 13 | Ascend.Ai | `6966ea09…2a83` | BUILT-EMPTY | 16 | Owner — 3 sims | **Exact duplicate of TeamSync (#15)** |
| 14 | aisalesteam | `69d6866d…5bac` | BUILT-EMPTY | 12 | No — Prospect 0 | Empty |
| 15 | TeamSync | `6975c668…36a7` | BUILT-EMPTY | 16 | Owner — 3 sims | **Exact duplicate of Ascend.Ai (#13)** |
| 16 | AffordableStoreStuff | `69d600b6…6f72` | BUILT-EMPTY | 47 | No — 1 placeholder Product ($9.99, no title), Order 0 | `[SEED/TEST]` |
| 17 | Mcp hub | `6a206690…723e` | SCAFFOLD | 1 | No — User entity only | Bare scaffold |
| 18 | AI Ops Concierge | `696794d3…2921` | BUILT-EMPTY | 19 | No — `[SEED/TEST]` KB docs, SupportRequest 0 | Placeholder dept owners |
| 19 | Nexus | `6a223709…4a3b` | BUILT-EMPTY | 10 | Owner — Notes/Projects ("Learn Rust") | Personal use |
| 20 | Enterprise Hub | `695358c8…1368` | BUILT-EMPTY | 42 | No — "Acme" org, demo architectures | `[SEED/TEST]` |
| 21 | Graph Studio | `69f64dfa…57aa` | SCAFFOLD | 4 | Owner/Demo — AgentGraph `5+` (some "(Demo)") | Overlaps Orchestrator AI |
| 22 | AI Studio | `6973c63c…ebd6` | SCAFFOLD | 6 | Owner — 1 Project "FlashFusion" | Thin |
| 23 | Tessa | `69b6f0ff…148f` | SCAFFOLD | 2 | Owner — 4 Kanban projects | **Name collides with TESSA (#40)** |
| 24 | Proactive Mentor OS | `69932240…4b00` | BUILT-EMPTY | 19 | Owner — dev-workflow Tasks `5+` | Personal use |
| 25 | Continuum | `69c44063…d1c2` | SCAFFOLD | 4 | Owner — SavedLead 4 (Copy.ai, Jasper) | Real-ish saved leads |
| 26 | rifts.to | `69d51947…0550` | BUILT-EMPTY | 5 | No — Survey 4 `[SEED/TEST]`, Question 0 | Demo response counts |
| 27 | Nexus Copilot | `6953593f…4944` | BUILT-EMPTY | 23 | No — "Acme"/INTInc org `[SEED/TEST]` | **Name collides with Nexus (#19)** |
| 28 | tiktokstory | `6a11151c…8894` | SCAFFOLD | 2 | No — ScriptPost 0 | Near-empty |
| 29 | LifeSync | `695fdfc2…2175` | BUILT-EMPTY | 24 | Owner — personal Habits/Journal | Personal seed |
| 30 | Card Catalog AI | `696c01e9…30f1` | SCAFFOLD | 3 | No — Cards (Pikachu, Mantle…) `[SEED/TEST]` | Sample data |
| 31 | SkySync | `6a10df3a…b258` | BUILT-EMPTY | 6 | No — FireworkShell `5+` `[SEED/TEST]` | `demo@lumina.studio` etc. |
| 32 | Enterprise AI App Generator | `6964ae9b…1682` | BUILT-EMPTY | 21 | No — demo AppProjects `[SEED/TEST]` | TeamMember 0 |
| 33 | Knowledge OS | `69d896cc…275b` | BUILT-EMPTY | 10 | Owner — real Clusters, Document 0 | No ingested docs |
| 34 | debate | `69adbc8d…53fe` | BUILT-EMPTY | 4 | Owner — real debates + persona library | Genuinely owner-used |
| 35 | Inner-Odyssey | `69f43f06…025d` | BUILT-EMPTY | 20 | No — Child 0, Parent 0 | Mature schema, empty |
| 36 | FlowState | `69f6549b…2f6d` | BUILT-EMPTY | 5 | Owner — portfolio Projects, ContactMessage 0 | Personal portfolio site |
| 37 | Sedona Soul Sessions | `68b1d971…5eec` | BUILT-EMPTY | 8 | No — 3 seed Services, Booking 0 | Full RLS |
| 38 | SoleIgnite | `68d1c017…7db5` | BUILT-EMPTY | 14 | No — 3 Leads `[SEED/TEST]`, Project 0 | Fictional companies |
| 39 | Champions Hub | `68f81edd…953d` | SCAFFOLD | 0 | No — no schema at all | Empty scaffold |
| 40 | TESSA | `68f83f5b…ec1f` | **EXPERIMENT/DEAD** | 5 | No — 1 NSFW ChatSession `[SEED/TEST]`, Simulation 0 | Inappropriate test content; dead |
| 41 | Battle Arena Pro | `6905b170…c314` | BUILT-EMPTY | 6 | No — Tournament 0 | Partial RLS |
| 42 | Chaos Club | `69726bea…36d1` | **RETIRED** | 35 | No — all entities empty | **[RETIRED BRAND — archive]** |
| 43 | ScoutReel | `69771560…1b55` | BUILT-EMPTY | 6 | No — Player 0, Reel 0 | Empty |
| 44 | Sole Customizer | `6990d794…67bd` | BUILT-EMPTY | 7 | No — Inquiry 0, Order 0 | Shoe theme; overlaps SoleIgnite |
| 45 | CreditReview | `69d3f57a…dbcd` | BUILT-EMPTY | 11 | No — Courses real; Professionals/Quizzes `[SEED/TEST]` | `*.beta@creditreview.io` seed users |
| 46 | AuraFlow | `68a60dfb…07d1` | BUILT-EMPTY | 5 | No — Campaigns/Brands `[SEED/TEST]` | Parody emails (elon@gadgetpro.com…) |

---

## Integrity flags

**[RETIRED BRAND]**
- **Chaos Club** (`69726bea1c1525bf9ac336d1`) — 35-entity community/social platform, every probed entity empty, owner-only. **Recommend archive.** No `ChaosClubCo`/`Chaos Collective` references found in any other app. `[SOURCED]`

**[SEED/TEST — not real] (never present as real leads/clients/results)**
- **audit** — 7/7 FreeAssessments `internal_test:true` (`@flashfusion.co`); Engagements `client1/2/3@anon.com`. `[SOURCED]`
- **FlashFusion** — single "Meridian Operations" demo threaded across Lead/Client/Project/Scorecard. `[SOURCED]`
- **SparkAcademy** — enrollments all `@acme-demo.example`. `[SOURCED]`
- **Enterprise Hub** & **Nexus Copilot** — "Acme" placeholder organizations. `[SOURCED]`
- **SkySync** — `demo@lumina.studio`, `artist@pyro.com`, `pro@fireworks.net`, `ice@cold.com`. `[SOURCED]`
- **AuraFlow** — parody emails (`elon@gadgetpro.com`, `joe@activewear.com`, `anna@styleco.com`). `[SOURCED]`
- **CreditReview** — `*.beta@creditreview.io`, `*@betauser.com`, `anon.visitor1@gmail.com` (Courses look like real authored content; users are seed). `[SOURCED]`
- **SoleIgnite** — fictional Leads (Athletic Performance Co., TechFlow Conference). `[SOURCED]`
- **agentrus** — MarketplaceTemplates authored by "platform"; demo WorkflowMetrics. `[SOURCED]`
- **AI Game Day Oracle** — Rooms "test1"/"Test21". **AffordableStoreStuff** — 1 titleless $9.99 Product. **Card Catalog AI** — Pikachu/Mantle sample cards. **rifts.to** — demo Surveys with round response counts. **AI Ops Concierge** — canned KB docs with generic dept owners. `[SOURCED]`
- **INTeract** — User table includes `gptagent@example.com` and `zz_test_do_not_delete@example.com` alongside its one real external user. `[SOURCED]`

**[CONTENT FLAG]**
- **TESSA** (`68f83f5b…`) — only record is a ChatSession titled to request NSFW content. Recommend purge + archive (app is otherwise dead). `[SOURCED]`

**Duplicates & overlaps (consolidation targets)**
- **Exact duplicate:** Ascend.Ai (`6966ea09…`) and TeamSync (`6975c668…`) — identical 16-entity decision-simulation schema and identical 3 "AIaaS" simulations. `[SOURCED]`
- **Name collisions:** *Nexus* vs *Nexus Copilot*; *Tessa* (Kanban) vs *TESSA* (chat/sim) — distinct apps, confusing names. `[SOURCED]`
- **Functional overlap clusters** `[INFERRED]`:
  - *AI-readiness / lead funnel:* FlashFusion, audit, (CreditReview review-funnel).
  - *Agent orchestration:* Orchestrator AI, agentrus, Graph Studio, Fusion AI (agent entities).
  - *Project/task tracking:* Invelo, Nexus, Proactive Mentor OS, Tessa, AI Studio.
  - *Shoe/footwear commerce:* SoleIgnite, Sole Customizer.
  - *"Everything"/enterprise platforms:* Fusion AI, Site, SparkAcademy, Enterprise Hub, Enterprise AI App Generator, INTeract.

**Inflated-count risk**
- Schema size is wildly out of proportion to data everywhere: 121/114/102/99/89/79-entity apps with **zero real customers**. Any narrative of these as "live/complete platforms" would be inflated — they are built-but-unlaunched. `[INFERRED]`

---

## Repo / source state

- **All 46 apps are S3-backed** (`git_remote_source: "s3"`) — **no GitHub remote** on any Base44 app. `[SOURCED]`
- **One exception at the source layer:** the **Beta Tester Army** codebase is mirrored to GitHub as `Krosebrook/beta-tester-army` — the repository this audit runs in (the Base44 app itself still reports S3 hosting). `[SOURCED]`

| Repo | Branch | Last commit | Open PRs | README | Staleness |
|------|--------|-------------|---------:|:------:|-----------|
| `Krosebrook/beta-tester-army` (BTA) | `claude/hopeful-fermi-unecqe` (work branch) | `539cef4` — 2026-06-14 | — (this branch is new, no PR yet) | yes | **active** (committed today) |

- **Known non-Base44 repos** in the brief (`flashnframe`, `claude-code-plugins-plus`, `Ample`, `FissionPrompt`): **NOT ACCESSIBLE** — this session's GitHub tooling is scoped to `Krosebrook/beta-tester-army` only. Not fabricating their state. `[NOT ACCESSIBLE]`

---

## Recommendations (ranked)

1. **Declare systems-of-record and consolidate.**
   - *CRM / client delivery:* make **FlashFusion** the single source of truth and migrate Invelo's 3 real client projects into it (today the real data lives in the throwaway Invelo scaffold). Retire the duplicate funnel in `audit` or fold it in as FlashFusion's assessment entry point.
   - *Agent orchestration:* keep **Orchestrator AI** (deepest schema) as the one platform; archive agentrus and Graph Studio or demote them to experiments.
   - *Decision-sim:* delete one of the **Ascend.Ai / TeamSync** exact duplicates.
2. **Archive the retired brand now:** **Chaos Club**. `[SOURCED]` empty + retired.
3. **Archive zero-record / dead apps** to shrink the surface: aisalesteam, ScoutReel, Sole Customizer, Inner-Odyssey, Battle Arena Pro, Champions Hub (0 entities), tiktokstory, **TESSA** (also purge its NSFW record). `[SOURCED]` all empty/near-empty.
4. **Purge or unambiguously tag seed/test data** before any demo or metric: especially `audit` (`internal_test` rows), the "Acme" orgs, `@acme-demo.example`, and the parody-email apps. Add an `internal_test` convention everywhere (only `audit` has one today).
5. **Rename to kill collisions:** Nexus vs Nexus Copilot, Tessa vs TESSA, Fusion AI vs FlashFusion.
6. **Don't confuse ambition with launch.** Six 80–121-entity platforms have no users. Pick 1–2 to actually take to market (INTeract is closest — it has the only real external user — and FlashFusion/Invelo back the real consulting work) and freeze the rest.
7. **Hygiene:** only FlashFusion/SparkAcademy/Beta Tester Army show consistently strong RLS; several data-bearing apps (SoleIgnite, AuraFlow, Chaos Club, and others) show **no RLS** on entities — review before any of them ever holds real user data.

---

## CLAIMS / GAPS

**[SOURCED]** (from tool output)
- 46-app enumeration with IDs and `git_remote_source: "s3"` for all (Base44 `list_user_apps`).
- Entity counts, names, and (where surfaced) RLS for all 6 priority apps + Site, plus entity counts for the other 39 (`list_entity_schemas`; large schemas parsed via `jq` on the saved tool-result files).
- Record counts and sample rows used for real-vs-seed and owner-vs-external judgments (`query_entities`, `limit:5`, minimal fields, exact `count`).
- Local repo branch/commit/README state for `Krosebrook/beta-tester-army`.

**[INFERRED]** (reasoning over sourced data)
- All classifications (PRODUCTION / BUILT-EMPTY / SCAFFOLD / EXPERIMENT-DEAD / RETIRED).
- Functional-overlap clusters and system-of-record recommendations.
- "1 real external user" conclusion (INTeract) — based on email patterns; an `@gmail.com` non-owner address is *assumed* real but not independently verified.

**[NOT ACCESSIBLE] / GAPS**
- **RLS visibility:** the MCP `list_entity_schemas` output reliably surfaced an `rls` block only for some apps (FlashFusion, audit, SparkAcademy, Beta Tester Army, Sedona Soul Sessions, parts of Battle Arena Pro/CreditReview). For many apps no `rls` field was returned; Base44 enforces RLS at the platform layer, so "no RLS shown" means *unverified via MCP*, not necessarily *absent*. Flagged conservatively.
- **Light-depth apps:** the 39 non-priority apps were probed on 1–3 entities each (not every data-bearing entity), so a real record could exist in an unprobed entity. Counts at `5+` are floors, not totals.
- **Non-Base44 GitHub repos** (`flashnframe`, `claude-code-plugins-plus`, `Ample`, `FissionPrompt`): out of this session's GitHub scope — not audited, not fabricated.
- **No write operations were performed** at any point; record totals for large entities are approximate (capped at the sample limit) by design.
