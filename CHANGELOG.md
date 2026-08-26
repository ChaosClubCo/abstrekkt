# Changelog

All notable changes to the Arc System. Newest first; dates are release dates.

---

## v1.8 - GitHub + Obsidian bridges; Arc Extraction reconciled (2026-07-16)

Addresses the three items the last two passes left open.

### GitHub + Obsidian bridges
- **`arc-github.js`** (new) - low-risk ops commit straight to the configured branch; `create_arc`/`delete_arc` commit to a fresh branch and open a PR instead - the diff view is the approval gate, per `AGENTIC_ACCESS_PLAN.md` §5. Plain fetch against `api.github.com`, no SDK. Defaults to one repo for data + docs together (the "one repo or split?" open question resolves itself either way - it's just config).
- **`arc-obsidian.js`** (new) - one note per arc (frontmatter + kicker/sub/prose/months table) via the Local REST API plugin's own endpoints, scoped to a single configurable vault folder (default `Arcs/`) rather than the whole vault - the conservative default the plan itself named. Best-effort: a network failure (Obsidian not running) is swallowed, never surfaced as an error.
- **`arc-ai.js`** - `pushSync` now also fire-and-forgets through both, alongside the existing Supabase push. Same silent-until-configured discipline as everything else in this layer.
- **`Finish the Sync - Claude Handoff.dc.html`** - gained steps 05 (GitHub: owner/repo/branch/token) and 06 (Obsidian: base URL/API key/folder, plus a "Generate notes now" bootstrap); status grid and reference table updated for all three bridges.
- Known gap: Obsidian notes don't carry `[[wikilinks]]` between arcs yet - `feedsInto`/`fedBy` live only in Arc Dependencies' own hardcoded array, not the shared data model. Not faked with an empty graph; left out.
- Still not built: real Realtime, conflict resolution, and opening the MCP server to OpenAI/Gemini (unchanged from v1.6/v1.7 - the last still blocked on deploying `arc-mcp-server.js`).

### Arc Extraction reconciled
- The ChaosClubCo lane's own M9 gate still frames "Chaos Collective vs ChaosClubCo" as an open call - superseded since Kyle's Jun 2026 ruling (retired, absorbed into Abstrekkt). Rather than editing the lane's real historical planning content (the actual deliberation that led to that ruling - "ship products, not pillars," the three-way tradeoff, etc.), added a superseded-notice banner + an "archived" tag on the tab, mirroring how `arcs-archived.json` preserves chaosclubco's content untouched elsewhere in the suite. The FlashFusion and Memoir lanes are unaffected.

### Docs
- `PERSISTENCE_PLAN.md`, `ARC_SYSTEM_DOCS.md`, `Canvas.dc.html`, `README.md` bumped to v1.8.

---

## v1.7 - Persistence phase 1, complete (2026-07-16)

Closes the fast-follow flagged in v1.6: the remaining five tools now pull, not just push.

### Remote pull, everywhere
- **Arc Portfolio + Arc Dependencies** - `applyOverlay()` now takes an optional overlay argument (defaults to the local `arc-store-overlay-v1` read, so existing callers are unaffected); a new poll callback re-runs it against the remote overlay and rebuilds the `ARCS` array / `BY` index in place.
- **Arc Execution + Arc Briefing** - both now cache the post-local-merge raw `arcs-data.json` shape (`this.rawData`) so a remote overlay can be folded in with `arc-ai.js`'s `mergeOverlay()` and re-normalized into each tool's own per-tool shape (`months` for Execution, `gates` for Briefing) on every poll tick.
- **Arc Momentum** - the same `data`/`prose`/`names` merge pattern Reader and Agents already used; also drops any focused arc id that a remote delete removed, matching the existing initial-load guard.
- All five gained a `componentWillUnmount` (`sync.stopPolling()`) - Execution's existing unmount hook was extended, the other four didn't have one yet.

No schema, op, or UI changes - this is the exact `arc-sync.js` polling contract Reader/Agents already proved, extended to the rest of the suite. Silent and additive, same as before: everything still no-ops until a Supabase project + anon key are saved in `Finish the Sync - Claude Handoff.dc.html`.

### Docs
- `PERSISTENCE_PLAN.md`, `ARC_SYSTEM_DOCS.md`, `Canvas.dc.html`, `Finish the Sync - Claude Handoff.dc.html` - "Reader + Agents only" language replaced with "all seven tools" throughout.
- Fixed a leftover from v1.5: `Canvas.dc.html`'s `PERSONAL` id list still included the retired `chaosclubco` - harmless (it's absent from live data either way), but the v1.5 entry below had already claimed this cleanup done.

### Still open
- **GitHub + Obsidian phases** of `PERSISTENCE_PLAN.md` (sequencing steps 3-6) - unstarted, same open decisions as before.
- **Conflict resolution** - still last-write-wins, no CRDT.
- **`Arc Extraction.dc.html`'s hardcoded ChaosClubCo lane** - still untouched (flagged v1.5, restated v1.6, restated here again). This one is a decision, not a build - see `RECONCILIATION_AUDIT.md`.
- **Opening the MCP server to agents** (`AGENTIC_ACCESS_PLAN.md` sequencing items 2-5) - still blocked on deploying `arc-mcp-server.js`, which is the user's task per `Finish the Sync - Claude Handoff.dc.html`.

---

## v1.6 - Docs reconciliation & persistence phase 1 (2026-07-16)

Two independent threads picked up in the same pass.

### Docs reconciliation
- **`Arc Agents.dc.html` + `arc-agent-connectors.js`** existed as a fully built goal-planner/connector/approval-queue surface but were absent from every doc in the suite (`ARC_SYSTEM_DOCS.md`'s tool list, the file structure tree, `README.md`, `Canvas.dc.html`'s doc hub). Catalogued now as Tool #7 - not newly built, just no longer invisible. Same for **`Canvas.dc.html`** itself (the docs hub) and **`arc-export.js`** (the v1.4 deliverables helper) - both missing from the file tree, now added.
- `Canvas.dc.html` - version badge and "what changed" digest were still pinned to v1.3; refreshed to v1.6, fallback counts corrected (75/5 -> 74/4, matching the v1.5 chaosclubco retirement).
- `AGENTIC_ACCESS_PLAN.md` gained a status note: Arc Agents already covers the plan's browser-reachable blocks (connectors standing in for per-platform adapters, the goal planner for "autonomous," the pending-approval queue matching guardrail §5 exactly). What's still open is block 1 - a durable, always-on server, which needs the persistence layer below.

### Persistence phase 1
Implements the first phase of `PERSISTENCE_PLAN.md` - optional, off by default, additive only.
- **`supabase-schema.sql`** (new) - `arcs` / `prose` / `overlay_log` tables, JSONB-first port of the two JSON files, with RLS.
- **`arc-mcp-server.js`** (new) - Supabase Edge Function reference source exposing `list_arcs` / `get_arc` / `apply_arc_op` / `get_momentum` / `generate_deliverable`; `apply_arc_op` refuses `create_arc`/`delete_arc` without `approved:true`.
- **`arc-sync.js`** (new) - the browser-side bridge: fire-and-forget push of every op's resulting snapshot, a pull that folds the remote log into the existing overlay shape, and interval polling with change detection. Plain `fetch` against PostgREST, no SDK, matching the rest of the suite's zero-dependency style.
- **`arc-ai.js`** - `applyOp` now fire-and-forget pushes every mutation through `arc-sync.js` (silently no-ops until sync is configured).
- **Arc Reader + Arc Agents** - poll the remote overlay when configured and fold changes into their in-memory state live, on top of the local overlay.
- **`Finish the Sync - Claude Handoff.dc.html`** (new) - the ops handoff runbook: create the Supabase project, run the schema, deploy the Edge Function, paste the URL/anon key, test the connection, push the current local overlay up as a one-time bootstrap.

### Known follow-up
- Pull-side polling only wired into Reader + Agents this pass; Portfolio/Dependencies/Execution/Briefing/Momentum still read local-only (documented in `PERSISTENCE_PLAN.md`).
- GitHub (version history + approval-gate-via-PR) and Obsidian (human-readable layer) phases of `PERSISTENCE_PLAN.md` remain open decisions, not built.
- Sync conflict resolution is last-write-wins, no CRDT - fine single-user, noted as a limitation for if this ever becomes multi-user.
- `Arc Extraction.dc.html`'s hardcoded ChaosClubCo lane (flagged in v1.5) is still untouched.

---

## v1.5 - Reconciliation & compliance (2026-07-16)

Reconciles the live system against `arc-system-2026-06-10` (a newly attached, more current business-ops snapshot, Jun 10 -> Jul 7 2026) and closes the compliance gap its governance docs flagged. Full findings in `RECONCILIATION_AUDIT.md`; source docs copied to `source-2026-06-10/`.

### Compliance scrub
- **`arcs-data.json` + `arcs-prose.json`** - "Intinc" (139 + 29 instances, 39 of 75 arcs) replaced with the agreed euphemism "a managed IT firm"; real colleague first names Daniel/Jackie/Dave replaced with role-only mentions ("a colleague", or "the stakeholders" where multiple were named together). Memoir's unrelated "Dave Datt" (a different person - a memoir excavation subject) was explicitly protected and left untouched.
- Snapshotted pre-scrub state to `arcs-data.backup3.json` / `arcs-prose.backup3.json` before writing.

### ChaosClubCo retired
- `chaosclubco` was a personal arc for a brand retired per Kyle's Jun 2026 ruling (absorbed by Abstrekkt) - the live arc had no awareness of that and still read as an active forward-planning lane. The `abstrekkt` arc already carried the correct lineage note in its own `sub` field, so no content migration was needed.
- Removed from `arcs-data.json` (75 -> 74 arcs; personal tier 5 -> 4); full original content preserved in new `arcs-archived.json`, not read by any live tool.
- `Arc Extraction.dc.html` still has its own hardcoded ChaosClubCo lane (a separate, bespoke surface with its own embedded data, not the shared data layer) - **not touched this pass**, flagged as a follow-up if full consistency is wanted there.

### Housekeeping
- **`uploads/`** - deleted 53 exact-duplicate files (every arc/tool source had been uploaded twice, once with an 8-char hash suffix). Resolved the tracked `next-7-arcs-series-2` fork (`SPRINT-M2-2026-07-07.md`): both drafts defined the same 7 ids already live under the original-26 (`gcp`/`fullstack`/`azure`/`eval`/`voice`/`strategy`/`cloudflare`) - kept one reference copy (`next-7-arcs-series-2.jsx`), removed the conflicting fork and all duplicates.
- Copied `AUDIT-2026-06-10.md`, `README-v2-2026-06-10.md`, `ryan-boundary-doc-2026-07-07.md`, `SPRINT-M2-2026-07-07.md` from the local folder into `source-2026-06-10/` for future reference.

### Docs + counts updated
- `README.md`, `CATALOG.md`, `ARC_SYSTEM_DOCS.md`, `Arc Reader.dc.html`, `Arc Agents.dc.html`, `Canvas.dc.html` - every hardcoded "75" -> "74"; personal-arc lists drop ChaosClubCo. Arc Home's counts are data-driven and needed no edit.

### Known follow-up
- **"Extract all 100+"** - no hidden batch of un-extracted arcs turned up anywhere in the attached material (the Series-2 "gap" resolved as a duplicate, not new content). Reaching 100+ means net-new original authorship, a redefinition of the goal, or source material not yet seen - intentionally not invented this pass. See `RECONCILIATION_AUDIT.md` \u00a76.

---

## v1.4 - Deliverables (2026-07-11)

Implements `DELIVERABLES_PLAN.md` in full — the suite's first non-mutating "produce something you walk away with" surfaces, on top of the existing live-editing (`arc-ai.js`) and live-dispatch (`arc-actions.js`) layers.

### New
- **`arc-export.js`** - shared helper module: `downloadCSV(rows, filename)`, `openPrintable({title, kicker, meta, bodyHtml})` (opens a paper-styled printable tab with a Save-as-PDF button), `sendDeliverable(eventType, data, meta)` (thin wrapper over `arc-actions.js`'s `dispatch`).
- **`arc-ai.js`** - added `completeText({provider, system, userMsg})`: same three provider adapters as `runAssistant`, but returns free text instead of parsing an ops envelope. `callOpenAI`/`callGemini` gained an `opts.json` flag so they can skip forcing JSON-mode responses.
- **`arc-actions.js`** - added `arc.standup.generated` to `EVENT_TYPES`.

### Tools wired
- **Arc Briefing** - *Draft narrative* (built-in model fills TL;DR/capability/implication/asks from the period's gate data) + *Export PDF* (standalone printable briefing).
- **Arc Portfolio** - *Export lane plan (CSV)*, scoped to selection or all arcs.
- **Arc Momentum** - standup generator gained *Send* (→ n8n via `arc-actions.js`) next to Copy; new *Export weekly report (PDF)*.
- **Arc Dependencies** - *Export map (PDF)* — tiers, leverage score, unlock suggestions.
- **Arc Reader** - assistant panel gained an Edit/Doc mode toggle; Doc mode generates free-form documents via `completeText` without touching the overlay, with per-message Copy/Export.

The base data files are snapshotted before destructive changes - `arcs-data.backup.json` / `arcs-prose.backup.json` hold the **pre-expansion (26-arc)** library and are the rollback path for v1.3.

---

## v1.3 - Catalog expansion (2026-07-07)

**26 -> 75 arcs | 3 -> 9 series.** Extracted every arc from the uploaded source `.jsx` files and merged them into the shared data layer, then wired them through every catalog surface.

### Data
- **`arcs-data.json`** - 26 -> 75 arcs. Added **44 roadmap arcs** (from the `next-7-arcs-series-*` roadmap files) and **5 personal arcs** (`flashfusion`, `chaosclubco`, `memoir`, `abstrekkt`, `readingroom`). Roadmap arcs carry `id` / `em` / `series` / one-line `sub` overview but no week-level curriculum yet. Personal arcs carry full 12-month / 48-week curriculum. Each new arc stores its `series` (1, 3-9) on the record.
- **`arcs-prose.json`** - unchanged (26 originals). New arcs have no tradeoff/claims prose yet.
- **Backups** - wrote `arcs-data.backup.json` + `arcs-prose.backup.json` (26-arc snapshot) before any write.
- **Source fix** - `the-flashfusion-arc` shipped with double-escaped apostrophes (`\'` -> `\\'`) that broke parsing; sanitized during extraction.

### Tools wired
- **Arc Reader** - `names` map backfilled from `arcs-data.json` (on both the load and undo paths); `SERIES` expanded 3 -> 9 rows; header count -> 75. All 75 appear in the rail.
- **Arc Momentum** - same treatment: `names` backfill + `SERIES` 3 -> 9. Focus-picker now shows all 9 series.
- **Arc Portfolio** - `componentDidMount` data-backfill synthesizes planner rows for new arcs; new **"Series Four+ - the long roadmap"** section holds Series 4-9; header and intro copy updated. Series 1/3 additions fold into existing sections.
- **Arc Dependencies** - `componentDidMount` data-backfill; all 75 render as toggleable pills. Roadmap arcs start dependency-less.
- **Arc Home** - `seriesCount` 3 -> 9 (arc/gate/task counts were already data-driven -> 75 arcs | 900 gates | 3,600 tasks).

### No change required
- **Arc Execution** and **Arc Briefing** already iterate the data layer and append any id not in their static `ORDER` - they surfaced all 75 with no edit.

### Intentionally untouched
- **Arc Extraction** - a bespoke 3-lane personal surface (FlashFusion / ChaosClubCo / Construction), not a catalog viewer. Folding 75 arcs into it would break its purpose. The 5 personal arcs it inspired now live in the shared data layer, so they appear in every other tool.

### Known follow-ups
- Roadmap arcs contribute **0h** to Portfolio load math and appear as dependency-less nodes until given load/feed metadata.
- A few roadmap arcs share display names (two "Infrastructure"; `devex`'s "MCP" vs `mcp`'s "MCP Builder") - cosmetic, from the source catalog's `titleEm`. Rename via the assistant if desired.
- Tradeoff/claims prose exists for the 26 originals only.

### Rollback
Restore `arcs-data.backup.json` -> `arcs-data.json` (and the prose backup), then revert the SERIES/backfill edits in Reader / Momentum / Portfolio / Dependencies / Home. The overlay system is untouched, so user edits are unaffected.

---

## v1.2 - Momentum + responsive (2026-07)

- Added **Arc Momentum** - the daily-driver surface (today's focus, streaks, 7-day velocity, why-this-matters prose, AI weekly standup).
- Full **responsive pass** - all tools reflow down to phone widths.
- The `mastery` arc now displays as **Gemini** everywhere (key unchanged).

## v1.1 - Outbound automations (2026-07)

- **Arc Execution -> n8n** - sprint / gate / portfolio / position events fire to a live workflow (webhook + MCP transports, retries, dead-letter log).
- Notion / Linear / Slack / Gmail fan-out on gate completion.
- Added the `Finish the Wiring - Claude Handoff.dc.html` runbook.

## v1.0 - Arc System (2026)

- Six catalog tools on a shared data layer + localStorage overlay.
- Multi-provider AI assistant (Anthropic / OpenAI / Gemini) with a strict ops schema.
- 26 learning arcs x 12 months x 4 weeks, with tradeoff + claims prose.

---
*Versions before v1.2 are reconstructed from the system reference; treat their boundaries as approximate.*
