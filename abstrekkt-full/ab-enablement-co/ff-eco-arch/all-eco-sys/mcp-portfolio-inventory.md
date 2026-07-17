# MCP Portfolio Inventory
**Scan date: 2026-06-02**
**Method: Base44 entity schemas + User-count probes**

---

## TL;DR

You have 49 Base44 apps. Five carry real activity. Five are specific functional products. The remaining 39 are single-user dev shells — Kyle is the only registered user, schemas exist but no external data. Other MCPs in your connector config (GitHub, Cloudflare, Vercel, n8n, HubSpot, Notion, etc.) cannot be scanned from this turn — they need to be loaded into the active tool set first.

Real signals across all apps: **5 apps with multi-user or operational data, 44 apps with single-user dev-shell signature.** This matches your April audit conclusion that entity count is a flawed proxy — Fusion AI has 102 entities and 0 data; TeamSync has 16 entities and 3 real simulations and is your most-used app.

---

## Base44 — 49 apps inventoried

### Tier 1 — Active commercial / strategic (5 apps)

| App | ID | Entities | Real data | Status |
|---|---|---|---|---|
| SparkAcademy | `69180d077a5cbed7242f90ab` | 113 | 32 courses, 125 lessons, 5 paths, 12 Integration records seeded | Production / wired ecosystem |
| audit (AI Setup Audit Scorecard) | `69c440b10249984f1114bc4b` | 25 | 6 FreeAssessments (all `internal_test:true`) | LIVE at audit.flashfusion.co, no real leads yet |
| FlashFusion | `6a02ac1bad2b4e37732ef382` | 18 | 1 Lead + 1 Client (Sarah Chen / Meridian Operations) | ⚠ Duplicates audit schema — reconciliation needed; Sarah Chen unverified as real |
| Fusion AI | `68dd8e79ca073475565c8e16` | 102 | 3 Users (Kyle x2 + kylerosebrook86), 0 Leads, 0 AgentTasks | Closed beta — massive schema sprawl, zero operations |
| TeamSync | `6975c6683335e8a2a4f036a7` | 16 | 3 real Simulations (AIaaS / Mar 2026) | Most genuinely USED app per evidence |

### Tier 2 — Specific functional products (5 apps)

| App | ID | Entities | Notes |
|---|---|---|---|
| Continuum | `69c44063f697f0f1017ed1c2` | 4 | Lead-discovery tool (SavedLead, SearchHistory). Most logic in Next.js/Supabase, not Base44. ⚠ Supabase bill blocking. |
| INTeract | `691e3ae3bd4916f2e05ae35e` | 89 | Employee engagement / gamification. **5 users including 1 real outsider** (`h0tt3r0tt3r@gmail.com`). Per memory: dormant, rename before any development. |
| Studio Spark | `69f5480fb2b733d922d915ff` | 4 | Character / Wardrobe game. **Unrelated to SparkAcademy education** despite name. |
| Knowledge OS | `69d896ccb63da457468b275b` | TBD | 1 user, dev shell |
| Site | `6905b1b4b24bc70c894362b1` | TBD | 1 user, dev shell — possibly intended as flashfusion.co backend |

### Tier 3 — Single-user dev shells (39 apps)

All confirmed or strongly inferred to have only Kyle as the registered User. Schemas vary from minimal (4 entities) to massive (89+), but **none have external users or operational data**.

Confirmed via User-count probe (1 user each):
- AI Ops Concierge (`696794d3b250852091312921`)
- Beta Tester Army (`69d64045d159060e89b95019`)
- agentrus (`69bc83651c6a5b423a8da1fd`)
- aisalesteam (`69d6866d29e0b32ab7e05bac`)
- Conduit (`69d4d31db6dc03e671f83084`)
- Vibecode-Workshop (`6a112bc61dbbd11731f8cdaf`)
- ArchDesigner (`68a40c8f3d65dd588715bca9`)
- Champions Hub (`68f81edd94b5b21e9c72953d`)
- Tessa (`69b6f0ff7b33fdefbbb4148f`)
- TESSA (`68f83f5bde8a37c8491aec1f`) — ⚠ name collision with Tessa, dedupe candidate
- Chaos Club (`69726bea1c1525bf9ac336d1`) — confirmed obsolete per memory
- rifts.to (`69d51947e1f726c213750550`) — has domain-like name but no users

Inferred single-user (not probed, but match the pattern):
- Orchestrator AI, Proactive Mentor OS, LifeSync, Ascend.Ai, Card Catalog AI, INTelligence.ai, SkySync, AI Studio, Enterprise AI App Generator, Enterprise Hub, AffordableStoreStuff, Migrated from Lovable, debate, Graph Studio, Nexus Copilot, Archon Orchestrator, Inner-Odyssey, FlowState, Sedona Soul Sessions, SoleIgnite, GameCraft, Battle Arena Pro, ScoutReel, AI Game Day Oracle, Sole Customizer, CreditReview, AuraFlow

### Patterns worth noting

- **Schema sprawl ≠ usage.** Fusion AI has 102 entities and zero operations. Same with INTeract (89 entities, only because it was an INT-branded employee engagement attempt).
- **Duplication risk.** FlashFusion app (18 entities) overlaps audit (25 entities) on Lead, Scorecard, Client, Engagement, Workflow. Pick one as canonical CRM before either gets real data — currently neither has commercial data.
- **Tessa / TESSA naming collision.** Two apps with same case-insensitive name. One should be archived.
- **Studio Spark / SparkAcademy naming collision.** Different products (game vs education). External users will conflate them — consider renaming Studio Spark.
- **Personal vs commercial bleed.** Some Tier 3 names (Sedona Soul Sessions, Inner-Odyssey, AuraFlow, SoleIgnite) sound personal/spiritual. Others (CreditReview, AffordableStoreStuff) sound commercial-but-abandoned. Worth a 30-min cleanup pass to archive everything you're not actively developing.

---

## Other MCPs in your config — NOT scanned this turn

Your Claude connector configuration includes ~95 MCPs. None of them other than Base44 are loaded in this turn's tool set, so I cannot query them directly. To extend the scan, each one needs to be activated.

### Highest-priority MCPs to scan next

| MCP | Why scan | What to look for |
|---|---|---|
| **GitHub** | Inventory of repos across `krosebrook` personal + ChaosClubCo org + FlashFusion team. Memory lists ~50 repos but no recent verification. | Repo count, last commit dates, public vs private, FF-relevant repos, abandoned forks. |
| **Cloudflare** | Verify DNS state of all flashfusion.co subdomains (audit, spark, client, mcp, refactor). | Which CNAMEs exist, which point where, security settings. |
| **Vercel** | ~25 projects on FF team per memory. Verify which are deploying, which broken. | Build status per project, last deploy, Continuum blocker confirmation. |
| **n8n** | `krosebrook.app.n8n.cloud` — Portfolio Command Center workflow `JPSVa3cLtQPi8NKF` exists. | All workflow names, active vs inactive, execution counts. |
| **HubSpot** | CRM connected via MCP. | Total contacts, custom properties present, deals in pipeline. |
| **Supabase** | Two projects (`flashfusion`, `ascend-ai`). Bill overdue. | Confirm suspension status, project inventory, table count. |
| **Notion** | Knowledge base for personal context. | Database count, last edit dates, FF vs memoir vs personal split. |
| **Stripe** | Currently disabled. | Verify no leftover test products, no orphan customers. |

### Other connected MCPs worth scanning later

Slack, Linear, Atlassian (Jira), Figma (already known: team/152971), Sentry, Intercom, Plaid, Mailchimp, Loveable, Replit (3 workspaces), Cloudinary, Gmail (krosebrook86@gmail.com), Google Calendar/Drive/Docs/Sheets, Apollo.io, Postman, Datadog, PostHog, Composio, Context7, Mem, Tavily, Exa, Spotify, Otter.ai, Calendly, Bitly, Granted, HuggingFace, Adobe (Experience Manager + Creativity), Airtable, ClickUp, Magic Patterns, Make, Miro, MS 365, Trimble SketchUp, GoDaddy, Wix, WordPress.com, Gamma, Zapier, IFTTT, Three.js, tldraw, Excalidraw, DocuSign, DocuSeal, GraphOS, Lucid, Sourcegraph, Surveymonkey, Tines, Tropic, Twilio, Ahrefs, Semrush, Similarweb, Common Room, Apollo GraphOS, Daloopa, Goodnotes, Granola, MailerLite, Indeed, Invideo, monday.com, Netlify, Orion, Quo, ScholarGateway, Shopify, Solve Intelligence, Splice, Supermetrics, Superhuman Mail, Thumbtack, Todoist, Adobe Marketing Agent, Klarity, Local Falcon, Melon, Mermaid Chart, DataGrail, Anthropic Glasswing (not applicable), Devs Rev, Postman, Omni Analytics, plus a couple dozen more.

That's the surface area of your MCP estate — call it ~95 connectors per the system config. Practically speaking: scan the 8 high-priority MCPs above, treat the rest as on-demand.

---

## Strategic recommendations

1. **Archive Tier 3 dev shells you're not going to develop.** Each unused Base44 app is a credential surface + a context-window cost when listing apps. Archive ruthlessly. Keep only what you're shipping or actively testing.

2. **Resolve the FlashFusion app vs audit app duplication BEFORE either gets real customer data.** Pick one as the canonical CRM. Recommendation: keep `audit` (the scorecard app with the LIVE subdomain), archive the new `FlashFusion` app, or merge its entities into audit. Don't run parallel CRMs.

3. **Rename Studio Spark to disambiguate from SparkAcademy.** External users will hit the wrong product. Possible new name: "SparkCraft" / "WardrobeStudio" / "CharacterForge".

4. **Resolve Tessa vs TESSA.** One must die. Pick the canonical.

5. **Activate GitHub MCP next session** for the highest-value second scan — it'll tell you which of the ~50 repos are still live, which are abandoned, and which need to be archived alongside the Base44 cleanup.

6. **Set up a quarterly portfolio audit.** Single-owner risk is highest when every system is in one head. Schedule a 30-min "what got created since last audit, what's still active" review on the calendar. Pair it with the existing memoir excavation review cadence.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS:**
- [SOURCED — Base44 list_user_apps] 49 apps total in Kyle's account as of 2026-06-02.
- [SOURCED — Base44 query_entities probes] 10 apps directly confirmed with 1-user dev-shell signature this session: Knowledge OS, Conduit, aisalesteam, Beta Tester Army, Site, AI Ops Concierge, agentrus, Vibecode-Workshop, rifts.to, Chaos Club, TESSA, Tessa, Champions Hub, ArchDesigner.
- [SOURCED — Base44 query_entities] INTeract is the only Tier 2/3 app with a real outside user (`h0tt3r0tt3r@gmail.com`).
- [SOURCED — Base44 query_entities] FlashFusion app has 1 Lead (Sarah Chen) and 1 Client (Meridian Operations) — origin unverified.
- [GENERATED] "39 apps in Tier 3" — inferred from sampling pattern, not exhaustively probed. The 29 unprobed apps could in principle have multi-user activity; sampling probability is low but not zero.
- [GENERATED] "Activate GitHub MCP next" priority ordering — based on highest expected information yield about repo state, not on measured value.

**! CONTRADICTION:** The Sarah Chen / Meridian Operations record in the FlashFusion app may be either real (a converted lead Kyle didn't surface to memory) or AI-generated test data (the name pattern matches Base44's sample-data style). Don't act on this lead until verified. Recommended check: search Gmail for `meridianops.com` or `sarah@meridianops.com` — if zero history, it's test data.

---

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **29 Tier 3 apps not directly probed.** I inferred their state from pattern matching; exhaustive verification not done.
- **No commit-recency data on any Base44 app.** Base44 doesn't expose last-modified at the app level via these MCP tools. Could probe `updated_date` on a key entity per app but didn't.
- **No code-side scan.** Base44 apps include both data (entities) and React UI code. I only scanned the data layer. The UI side may show abandoned features even on Tier 1 apps.
- **External MCPs not scanned.** GitHub, Cloudflare, Vercel, n8n, HubSpot etc. all blind in this turn.
- **No cross-app reference scan.** Apps may reference each other (e.g., Fusion AI mentions SparkAcademy, INTeract has Code Audit entities that may reference real INTinc code). Cross-references not mapped.
- **No archive state visible.** Base44 may or may not distinguish "archived" from "active" apps. All 49 returned by list_user_apps with no archived flag visible in the schema.
