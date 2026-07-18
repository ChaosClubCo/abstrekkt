# Arc System Documentation

## Overview

The **Arc System** is a unified planning, visualization, and AI-driven editing platform for **74 learning arcs across nine series**. It provides **seven complementary tools** (plus a personal-lane extractor and two ops handoff runbooks) that share a common data layer, with real-time AI-powered CRUD operations, a persistent localStorage-backed overlay system, multi-provider LLM support (Anthropic, OpenAI, Gemini), and an optional durable-store sync layer.

The 74 arcs fall into three tiers: **26 originals** (full 12-month curriculum + tradeoff prose, Series 1-3), **4 personal arcs** (Series 9, full curriculum), and **44 roadmap arcs** - catalog stubs carrying title/series/overview but no week-level curriculum yet. Author a stub via the Reader assistant or source extraction. See `CATALOG.md` for the full list. A retired fifth personal arc (`chaosclubco`) is preserved in `arcs-archived.json` - see v1.5 below.

**Latest release:** July 2026 (v1.8)  
**Data sources:** `arcs-data.json` (74 arcs, up to 12 months x 4 weeks each) + `arcs-prose.json` (tradeoff/claims narratives, 26 originals)  
**AI engine:** `arc-ai.js` (provider-agnostic router + ops schema + store overlay)  
**Documentation suite:** `README.md` (index) | this file (canonical reference) | `CATALOG.md` (all 74 arcs) | `CHANGELOG.md` (versions + diffs) | `EXTENDING.md` (add arcs / tools / ops)

> **New in v1.8 (July 2026):** GitHub + Obsidian bridges (`arc-github.js`, `arc-obsidian.js`) - low-risk ops commit direct, create_arc/delete_arc open a PR; Obsidian gets one note per arc via the Local REST API plugin. Both fire-and-forget alongside the existing Supabase push, silent until configured. Also reconciled `Arc Extraction.dc.html`'s hardcoded ChaosClubCo lane - superseded-notice banner added, historical planning content left untouched. See `PERSISTENCE_PLAN.md` and `CHANGELOG.md`.
>
> **New in v1.7 (July 2026):** Persistence phase 1, finished client-side — Portfolio, Dependencies, Execution, Briefing, and Momentum now poll and fold in remote changes live, same as Reader and Agents already did. All seven tools behave identically on this axis now; GitHub/Obsidian/Realtime/other-agent-platform phases remain open per `PERSISTENCE_PLAN.md`.
>
> **New in v1.6 (July 2026):** Two threads. (1) **Docs reconciliation** - `Arc Agents.dc.html` + `arc-agent-connectors.js` (a goal-planner/connector/approval-queue surface) and `Canvas.dc.html` (the docs hub) turned out to already be built but were missing from every doc in this suite; they're catalogued below now, not newly built. (2) **Persistence phase 1** - an optional Supabase layer (`supabase-schema.sql`, `arc-mcp-server.js`, `arc-sync.js`) per `PERSISTENCE_PLAN.md`, off by default. See that file's Status section and `CHANGELOG.md`.
>
> **New in v1.5 (July 2026):** Compliance scrub across `arcs-data.json`/`arcs-prose.json` (day-job + colleague names replaced with role-only language); `chaosclubco` retired to `arcs-archived.json` (superseded by `abstrekkt`, per the Jun 2026 brand ruling in `source-2026-06-10/`); `uploads/` deduplicated; the tracked `next-7-arcs-series-2` fork resolved. 75 -> 74 arcs. Full diff in `CHANGELOG.md`.
>
> **New in v1.3 (July 2026):** Catalog expanded **26 -> 75 arcs** across **9 series** - 44 roadmap stubs + 5 personal arcs extracted from source `.jsx` and merged into the shared data layer, then wired through every catalog surface (Reader, Momentum, Portfolio, Dependencies, Home; Execution + Briefing were already data-driven). Base library snapshotted to `arcs-data.backup.json` / `arcs-prose.backup.json`. Full diff in `CHANGELOG.md`; full list in `CATALOG.md`.
>
> **New in v1.2 (July 2026):** Arc Momentum (daily-driver surface - streaks, velocity, AI standup); all tools made fully responsive down to phone widths; the `mastery` arc now displays as **Gemini** everywhere (see naming note below).

### Arc naming gotcha (read this first)

The arc keyed **`mastery`** in `arcs-data.json` is the **Gemini** arc - its source file is a mastery-track persona but the product it teaches is Gemini, and its `em` (display name) is `"Gemini"`. The internal key stays `mastery` so progress/overlay references don't break; only the display label reads "Gemini". When editing via the assistant, refer to it as **gemini** or **mastery** - both are mapped. Do **not** rename the key.

---

## Picking up in a new conversation

Everything a fresh session needs to be productive here, in order:

1. **Read this file** (`ARC_SYSTEM_DOCS.md`) top to bottom - it's the single source of truth.
2. **Entry point is `Arc Reader.dc.html`.** It owns the AI assistant and is the canonical editor. `Arc Momentum.dc.html` is the daily-driver surface.
3. **Data lives in `arcs-data.json` + `arcs-prose.json`.** Never hand-edit for user changes - go through the overlay (`arc-ai.js` -> `applyOp` -> `saveOverlay`). Direct JSON edits are only for base-library corrections.
4. **All tools are Design Components (`.dc.html`).** Author with `dc_write` / `dc_html_str_replace` / `dc_js_str_replace`. Styling is inline; media queries live in each `<helmet>`.
5. **Two subsystems have their own engines:** `arc-ai.js` (AI CRUD + overlay, used by every tool) and `arc-actions.js` (outbound events from Arc Execution -> n8n). See their sections below.
6. **Ops handoffs** - `Finish the Wiring - Claude Handoff.dc.html` (four n8n workflow touches) and `Finish the Sync - Claude Handoff.dc.html` (Supabase project + schema + MCP server for the optional persistence layer).
7. **Design system:** FlashFusion is bound at `_ds/...`. Match its dark instrument-panel aesthetic; the arc tools use their own per-arc accents layered on that foundation.
8. **Gotchas:** (a) the `mastery` key = **Gemini** display (see above) - don't rename it. (b) **Series and lane live in two places** - the JSON `series`/`lane` are authoritative for the 44 roadmap + 5 personal arcs, but for the original 26 they sit in each tool's `SEED`/`names` map (many are Series 2 / lane A-B there while the JSON leaves those off). The rail merges both; when wiring a new surface, backfill unknown ids from `data[id].series`. See `EXTENDING.md`.

**Common asks and where they land:** new tool -> new `.dc.html` reading the shared data + overlay; new AI operation -> extend the ops schema in `arc-ai.js` (`OPS_DOC` + `applyOp`); new event -> extend `arc-actions.js` + the n8n router; content change -> assistant op (persists to overlay), not a JSON edit.

---

## Architecture

### Data Layer

#### Primary Sources
- **`arcs-data.json`** - Canonical arc definitions. Each arc carries:
  - `id` (slug), `em` (display name), `accent` (hex color), `kicker`, `sub` (subtitle)
  - `series` (1-9), `lane` ('A' | 'B' | null) - for the original 26 these live in each tool's SEED map, not the JSON (see the two-places note under *Picking up in a new conversation*)
  - `meta` (array of {label, value} pairs, max 4)
  - `quarters` (4 quarters, each with phase/subtitle + 3 months)
  - `quarters[].months[]` (12 months across all quarters, each with title/why/4 weeks/gate)
  - `prose` (null, backref to arcs-prose.json)

- **`arcs-prose.json`** - Prose narratives keyed by arc id. Each entry:
  - `headline` (tradeoff flag title)
  - `intro` (one-line problem statement)
  - `gain` (array: what you gain)
  - `giveUp` (array: what you give up)
  - `giveLabel` (header text, e.g. "What you give up / risk")
  - `note` (sequencing note, optional)
  - `claims` (array of {lead, body} - numbered claims & assumptions)

#### Store Overlay (localStorage)

Key: `arc-store-overlay-v1`. Shape:
```json
{
  "edits": {
    "arc-id": { /* partial or full arc, merges over base */ },
    "prose:arc-id": { /* prose object, replaces entirely */ }
  },
  "created": {
    "new-arc-id": { /* full arc object */ }
  },
  "deleted": ["arc-id-1", "arc-id-2"]
}
```

**Merge semantics:**
- **Edits** - shallow merge over base arc (only provided fields override)
- **Created** - entire new arc (gap-filled to 12 months, defaults for missing fields)
- **Deleted** - removes from all downstream structures

**Persistence:** Auto-saved by `arc-ai.js` after each operation. Survives page reload. User can **Undo** (clears entire overlay) via Arc Reader UI.

### AI Engine (`arc-ai.js`)

**Exports:**
- `PROVIDERS` - metadata for 3 adapters (Anthropic, OpenAI, Gemini)
- `runAssistant(provider, userMsg, contextSummary)` -> `{reply, operations[]}`
- `applyOp(op, {data, prose, names, overlay})` - mutates store in place
- `mergeOverlay(data, prose, names, overlay)` - rehydrates base with edits/creates/deletes
- `loadKeys()` / `saveKey()` / `resetOverlay()` - localStorage management

**Operations contract (strict JSON schema):**
- `edit_meta` - name, accent, sub, kicker
- `edit_gate` - specific month gate text
- `edit_week` - specific month/week within a month
- `edit_quarter` - phase, subtitle for a quarter
- `edit_prose` - headline, intro, gain, giveUp, giveLabel, note, claims
- `create_arc` - full arc (12 months auto-filled if partial)
- `delete_arc` - remove entirely
- `rename_arc` - shorthand for `em` edit

**Multi-provider routing:**
- **Anthropic** - built-in `window.claude.complete()`, no key, free-tier limits (~1024 tokens)
- **OpenAI** - `gpt-4o-mini` via `api.openai.com`, user key required
- **Gemini** - `gemini-2.0-flash` via `generativelanguage.googleapis.com`, user key required

Keys stored only in `localStorage` under `arc-ai-keys-v1`. Never sent anywhere but the provider's official API endpoint.

---

## Tools

> The label maps inside each tool (`this.SEED` / lookup dicts) carry `mastery:['Gemini', ...]` - the display name is "Gemini", the key is `mastery`. Keep these in sync if you touch any tool's name map.

### 1. Arc Reader (`Arc Reader.dc.html`)

**Purpose:** Deep-dive explorer for all 74 arcs. Series-grouped switcher (9 series), full month/week detail, expandable prose (tradeoff + claims). Roadmap-stub arcs render their overview but show empty month grids until curriculum is authored.

**Key features:**
- **Series-grouped rail sidebar** - click to switch arcs; rail auto-updates on AI create
- **Quarter tabs** - Q1-Q4 selector; active tab sticky on reload
- **Month expansion** - click month label to expand/collapse weeks + gate
- **Prose blocks** - tradeoff section (headline, gain/give-up lists, note), claims (numbered) - prose exists for the 26 original arcs
- **AI assistant panel** (slide-in from right):
  - Provider picker (Anthropic/OpenAI/Gemini)
  - Key management (password input, save, clear)
  - Chat log with operation badges
  - Textarea with Cmd/Ctrl+Enter send
  - **Undo** button (reverts all AI edits)

**Data flow:**
1. Load `arcs-data.json`, `arcs-prose.json`, then import `arc-ai.js`
2. Merge overlay from localStorage
3. Build live `names` map (keyed by id, value = [displayName, series, lane]) - seeded from `this.names`, then **backfilled from `arcs-data.json`** so all 74 arcs appear in the rail (v1.3)
4. On arc switch, update header + render prose + populate months
5. On assistant send, run model -> apply ops -> persist overlay -> re-render

**State management:**
- `asstOpen` (panel visibility)
- `provider` (Anthropic|OpenAI|Gemini)
- `keys` (loaded from localStorage)
- `chat` (array of {role, text, ops?})
- `lane` (current arc id)
- `overlayCount` (number of pending edits, for Undo button visibility)
- `_v` (version stamp, forces re-render on AI ops)

**Theming:** Each arc has a unique accent color pulled from `arc.accent` (hex). Header, borders, accents shift per arc.

### 2. Arc Portfolio (`Arc Portfolio.dc.html`)

**Purpose:** Load/capacity planner. Selector for all 74 arcs, load-hour calculations, collision detection, Lane-A lock. New arcs are backfilled from the data layer; Series 1/3 additions fold into their sections and Series 4-9 collect in a **Series Four+ roadmap** section (v1.3).

**Key features:**
- **Arc selector chips** - toggle each arc on/off (roadmap arcs contribute 0h to load math until given load metadata)
- **Presets** - 5 quick-load scenarios (Sustainable, Full-tilt, etc.) with load/collision pre-calc
- **Load matrix** - series 1/2/3 load hours, total, per-lane, Lane-A lock status
- **Collision flagging** - if any arc overlaps on same month, highlighted
- **Cross-feed tracking** - which arcs feed into which, dep graph preview

**Data rehydration:**
- Calls `applyOverlay()` before building lookup maps
- Deleted arcs filtered out; created arcs slotted into series + lane
- Accent/name edits reflected in the UI

**State:** `selected` (dict of arc id -> boolean), `collapsed` (series folding), `laneA` (Lane-A arc id)

### 3. Arc Execution (`Arc Execution.dc.html`)

**Purpose:** "This week" dashboard. Sprint-view of active arc gates + week milestones across all selected arcs.

**Key features:**
- **Month/week steppers** - slide left/right through calendar
- **Gate status per arc** - completion checkbox, gate text, progress color
- **Week cells** - 4 weeks x active arcs grid
- **Arc toggles** - filter which arcs to show

**Data rehydration:**
- Merge overlay, build `order` (known arcs + AI-created ones)
- Filter to `active` arcs (toggled on)
- Normalize months to `{gate, weeks[4]}` per arc

**State:** `active` (dict), `month` (1-12), `week` (1-4), `done` (localStorage)

### 4. Arc Dependencies (`Arc Dependencies.dc.html`)

**Purpose:** Dependency visualization. Tier analysis (Sources/Bidirectional/Sinks), feed graph, leverage scoring.

**Key features:**
- **Tier columns** - three swim lanes (Sources, Bidirectional, Sinks) based on feed-into/fed-by counts
- **Arc cards** - accent dot, name, feed indicators
- **Toggle pills** - filter by series, kind, status
- **Leverage score** - calculated from upstream/downstream count + value
- **Suggestions** - unlock isolated arcs, strengthen weak links

**Data rehydration:**
- Call `applyOverlay()` to filter deletes + apply renames
- Created + backfilled arcs get default feedsInto/fedBy (empty - hand-author these in the source). All 75 render as toggleable pills (v1.3); roadmap arcs start as dependency-less nodes until feeds are authored.
- Tiers recalculate based on current feed graph

**State:** `toggles` (series/kind/status), `scored` (array of arcs with leverage)

### 5. Arc Briefing (`Arc Briefing.dc.html`)

**Purpose:** Leadership briefing generator. Three stakeholder framings, monthly/quarterly cadence, editable narratives.

**Key features:**
- **Stakeholder framing picker** - Sponsor / Practitioner / Finance view on same gates
- **Cadence toggle** - Monthly vs. Quarterly grouping
- **Gate rows** - all gates for selected arc(s), editable summary + status
- **Narrative text areas** - exec summary, key risks, key wins (per framing)
- **Print view** - cream-paper document aesthetic

**Data rehydration:**
- Merge overlay, build `order` (known + created arcs)
- Gates keyed by month; prose lookups per framing
- Narrative state persists to component state (not localStorage)

**State:** `recipient` (framing), `cadence` (monthly|quarterly), `nar` (dict of narrative text), `met` (dict of gate completion), `printView` (bool)

### 6. Arc Momentum (`Arc Momentum.dc.html`)

**Purpose:** The daily driver. Turns the static planner into a habit surface - "what do I do today," momentum over time, the narrative why, and a shareable AI standup. Reads the shared overlay like every other tool.

**Key features:**
- **Today's focus** - surfaces the single next incomplete task per focus arc (month, week, task text, and the gate it works toward). One click marks it done - writes to `arc-reader-done-v1`, so progress syncs with Arc Reader.
- **Momentum ribbon** - overall completion ring, a real **streak** (consecutive days with >=1 completion), **7-day velocity**, done/total, and focus-arc count.
- **Why this matters** - rotates daily through the focus arcs' tradeoff prose (headline + intro) so the narrative reason surfaces without digging.
- **AI output (built-in model, no key):**
  - **Generate weekly standup** - first-person standup built from real progress (momentum read -> this week's per-arc next action -> what's compounding -> biggest stall + smallest unblock). Copyable.
  - **Check-in** (per card) - 3 reflection questions for the current task.
  - **Stuck?** (per card) - one concrete 30-minute next action + a resource type.
- **Manage focus** - series-grouped chip picker for which arcs are "in focus" (defaults: Gemini, Security, Personal Brand).

**Data flow:** loads `arcs-data.json` + `arcs-prose.json`, imports `arc-ai.js`, merges overlay, then reads `arc-reader-done-v1` (progress) + its own momentum keys. AI runs on `window.claude.complete` only (no provider router - keep it zero-config).

**State:** `focus` (dict id->bool), `done` (shared progress), `log` (date->count for streak/velocity), `manageOpen`, `aiBusy`/`aiText`/`aiLabel`, `_v`.

**Prop:** `accent` (color editor) - sets the surface accent; per-arc card accents still come from each arc's own color.

### 7. Arc Agents (`Arc Agents.dc.html`)

**Purpose:** The agent dashboard - a goal-driven planner plus a real connector registry, sitting on top of the same data/overlay/AI stack every other tool uses. This is the suite's implementation of the browser-reachable half of `AGENTIC_ACCESS_PLAN.md` (see that file's status note) - everything that can run while a human has the tab open; it does not run on a timer with no tab open (that needs the durable MCP server in `PERSISTENCE_PLAN.md`).

**Key features:**
- **Goal runner** - free-text goal -> a planner call (`completeText`) returns an ordered step list (skill / custom_agent / op / connector) -> steps execute in order, transcript renders per-step status.
- **One-click skills** - `standup` (progress digest over focus arcs), `stall_watch` (flags 0%-complete arcs), `capacity_guard` (sums focus-arc load, flags >=28 hrs/wk) - the same three jobs named as "proactive" candidates in `AGENTIC_ACCESS_PLAN.md`, callable on demand here rather than on a cron.
- **Connectors** (`arc-agent-connectors.js`) - webhook, MCP (Streamable HTTP), Slack, Notion, Linear, Gmail. Each is a real fetch to the service's official endpoint using a pasted token/URL - no hidden backend. Live/Dry-run toggle, per-connector Test.
- **Approval queue** - `create_arc`/`delete_arc` steps never auto-apply; they queue in `arc-agents-pending-v1` for explicit Approve/Reject, exactly the guardrail `AGENTIC_ACCESS_PLAN.md` §5 specifies. Every other op type auto-applies straight to the shared overlay (reversible via Reader's Undo).
- **Custom agents** - AI-drafted (name, description, system prompt) from a plain-language description, saved to `arc-agents-custom-agents-v1`, runnable with one click via `completeText`.
- **Focus chips** - reads/writes `arc-momentum-focus-v1`, shared live with Arc Momentum.
- **Activity log** - `arc-agents-log-v1`, capped 60, separate record from Arc Execution's automation log (same transport patterns, different history).

**Data flow:** same load as Reader (`arcs-data.json` + `arcs-prose.json` + `arc-ai.js` + `mergeOverlay`), plus `arc-agent-connectors.js` for connector storage/dispatch. Writes go through `arc-ai.js`'s `applyOp` like every other tool, so they land in the same overlay and are undoable from Reader.

**State:** `data`/`prose`/`names`, `focus`, `connectors`, `live`, `provider`, `goalText`/`busy`/`chat`, `pending`, `customAgents`, builder/draft state for the AI agent-builder, `testState` per connector.

---

## Shared Overlay System

### How It Works

1. **Arc Reader writes** -> User edits via assistant -> ops apply -> `applyOp()` mutates `data`/`prose`/`names` + pushes to `overlay` dict
2. **After each op** -> `saveOverlay()` persists to localStorage under `arc-store-overlay-v1`
3. **Other tools load** -> each calls `mergeOverlay()` (data tools) or `applyOverlay()` (Portfolio/Dependencies)
4. **Result** -> all five tools see the same mutations, even if opened after edits made elsewhere

### Sync Guarantees

- **Eventual consistency** - overlay is only applied on tool load, not live-synced (user must reload to see remote edits)
- **No conflicts** - each tool reads/writes the same overlay structure; no concurrent-edit logic needed
- **Undo is global** - Arc Reader's **Undo** clears the entire overlay, reverting all tools back to base library

### Example Flow

1. User in Arc Reader: "Change Security accent to teal"
   - Assistant returns op: `{op: "edit_meta", id: "security", fields: {accent: "#14b8a6"}}`
   - `applyOp()` mutates `data.security.accent`, writes to `overlay.edits.security`
   - `saveOverlay()` commits
   - Arc Reader re-renders Security's accent (both in rail dot + header)

2. User opens Arc Portfolio (in a new tab or same tab)
   - On load, `applyOverlay()` called
   - Reads `overlay.edits.security`, merges `accent: "#14b8a6"` into Security's card
   - Portfolio shows Security with teal dot

3. User opens Arc Dependencies
   - Same: `applyOverlay()` applies, Security shows teal

4. User in Arc Reader: "Undo"
   - `resetOverlay()` clears localStorage
   - Arc Reader reloads data -> no overlay
   - All other tools, on next load, see base library (Security red again)

---

## AI Assistant Usage

### Activating the Assistant

1. **Arc Reader only** - click FAB button (bottom-right, violet spark icon)
2. Slide-in panel appears from right
3. Choose provider (Anthropic recommended, no key needed)
4. Type request in textarea, press Cmd/Ctrl+Enter or click **Send**

### Example Requests

| Request | Operations Generated |
|---|---|
| "Change Security accent to teal" | `edit_meta` (security, accent) |
| "Rewrite M3 gate for Claude arc" | `edit_gate` (claude, month=3) |
| "Create a LangGraph arc in series 2" | `create_arc` (langgraph, series=2, quarters+prose) |
| "Delete the n8n arc" | `delete_arc` (n8n) |
| "Add 'real-time inference' to Mastery arc W2" | `edit_week` (mastery, month=2, week=2) |

### Model Instructions

The assistant is steered by a system prompt in `arc-ai.js` that:
- Lists all arc ids + names + series (now 75)
- Defines the operations schema (required fields, constraints)
- Enforces JSON-only output (`{reply, operations[]}`)
- Prioritizes **smallest ops** (e.g., don't create_arc to change one field)

The user's message is appended as `User request: "..."`, and the model returns the envelope.

### Error Handling

- **No matching arc id** -> operation is silently skipped (logged as "skip: no arc {id}")
- **Invalid operation** -> JSON parse error, returned as a fallback reply with empty ops
- **API failure** (OpenAI/Gemini key invalid, rate limit, etc.) -> error message in chat (red-tinted bubble)
- **Anthropic timeout** -> no reply, chat shows "(no reply)"

---

## Outbound Automations (Arc Execution)

**Engine:** `arc-actions.js`. Checklist interactions in Arc Execution fire events to user-configured endpoints.

**Default endpoint (seeded):** the published n8n workflow **Arc Execution - Event Router v2** (`IQwuNcYUCglWfzFd`) - production webhook `https://krosebrook.app.n8n.cloud/webhook/arc-events` (POST, CORS `*`, no auth, acks 200 immediately). Fresh installs start **Live** against it; deleting the endpoint sticks. (v1 `bXMCU7Cc7MiYb8XA` archived.)

**What each branch does (v2):**
- `arc.week.checked` / `arc.week.unchecked` -> upsert one row per cell in the `arc_sprint_log` data table (status `done` / `reverted`, keyed arcId+month+week)
- `arc.gate.completed` -> dedupe on eventId -> gate row in `arc_sprint_log` -> Notion gate-report page -> Slack -> Gmail report -> Linear issue "Plan M{next} - {arc}"
- `arc.toggled` -> upsert `portfolio` row in `arc_state`; Slack warning when combined load >= 28h/wk
- `arc.position.changed` -> upsert `position` row in `arc_state`
- `arc.ping` -> Slack "wiring OK"
- unrecognized -> row in `arc_errors`

Records live in n8n **data tables** (`arc_sprint_log` `TPhPhgISkPfKoe6L`, `arc_state` `y53j8Y4QzpJ8qfng`, `arc_errors` `3STKOlsXztcwgG0S`) - no credentials needed. Integration nodes run with onError:continue, so records never block on a missing credential. Notion + Linear nodes ship disabled until configured (parent page URL / Linear credential + team).

**Events:** `arc.week.checked`, `arc.week.unchecked`, `arc.gate.completed` (all 4 weeks done), `arc.toggled`, `arc.position.changed` (debounced 800ms), plus `arc.ping` (test fire).

**Envelope:** `{id, event, occurredAt, source:"arc-execution", data}` - `id` is an idempotency key, stable across retries, so receivers can dedupe at-least-once delivery.

**Transports:**
- `webhook` - JSON POST with `X-Event-Id` / `X-Event-Type` headers + optional `Authorization: Bearer`
- `mcp` - MCP Streamable HTTP: JSON-RPC 2.0 `tools/call` (configurable tool name, default `arc_event`), lazy `initialize` handshake, `Mcp-Session-Id` tracking, SSE-or-JSON reply parsing, auto re-init on session expiry

**Delivery:** 3 attempts, exponential backoff + jitter, 12s timeout. 4xx (except 408/429) never retried. Exhausted failures stay in the log as dead-letter entries with a manual **retry** button.

**Modes:** Dry-run (default - payloads built + logged, nothing sent) vs Live. Configured in the settings modal (sidebar -> Automations panel): endpoints (name/type/URL/token), per-event routing (default endpoint / specific / off), test fire per endpoint.

**UI feedback:** pulsing check square while a cell's event is in flight; activity log in the sidebar (click a row to expand payload + response); red toasts on failure only. CORS must be allowed by the endpoint (browser-originated calls).

---

## Persistence Layer (`arc-sync.js`, optional)

**Engine:** `arc-sync.js`. Implements phase 1 of `PERSISTENCE_PLAN.md` - an optional Supabase bridge so the overlay isn't only ever local to one browser. Off by default; nothing changes until a project URL + anon key are saved (`Finish the Sync - Claude Handoff.dc.html` walks through it).

**Write path:** `arc-ai.js`'s `applyOp` fire-and-forget posts every op's resulting snapshot to the `overlay_log` table (`supabase-schema.sql`) as `{arc_id, kind:'arc'|'prose'|'delete', snapshot, source, occurred_at}`. Never blocks, never throws into the caller - a missing/misconfigured project just means nothing is sent.

**Read path:** `pullOverlay()` GETs the log and folds it into the same `{edits, created, deleted}` shape the local overlay uses, replaying rows oldest-to-newest (last write per arc id wins). Callers merge the result on top of already-loaded state via the existing `mergeOverlay()` - the remote pull never touches localStorage directly.

**Wired into:** All seven catalog tools poll on an interval (`cfg.pollMs`, default 20s) when configured, and fold remote changes into their in-memory state live — Reader/Agents/Momentum merge into the shared `data`/`prose`/`names` shape via `mergeOverlay()`; Portfolio/Dependencies re-run their own `applyOverlay()` against the flat `ARCS` array; Execution/Briefing re-merge the cached raw data and re-normalize into their per-tool shape. `arc-github.js` and `arc-obsidian.js` (below) are push-only bridges layered on the same `pushSync` call in `arc-ai.js` — neither has a pull/poll side.

**Known limitation:** last-write-wins, no CRDT/merge - two devices editing the same arc offline at the same time will have one silently overwrite the other on next pull. Acceptable for a single-user tool; would need real conflict resolution before this became multi-user.

**Server surface:** `arc-mcp-server.js` is a Supabase Edge Function (reference source, not auto-deployed) exposing `list_arcs` / `get_arc` / `apply_arc_op` / `get_momentum` / `generate_deliverable` per `AGENTIC_ACCESS_PLAN.md`'s build blocks - `apply_arc_op` refuses `create_arc`/`delete_arc` without an explicit `approved:true`, mirroring Arc Agents' own approval queue server-side.

**GitHub bridge (`arc-github.js`, optional):** low-risk ops (`edit_meta`/`edit_gate`/`edit_week`/`edit_prose`/`rename_arc`) commit `arcs-data.json`/`arcs-prose.json` straight to the configured branch; `create_arc`/`delete_arc` commit to a fresh branch and open a PR instead - the diff view is the approval gate, no separate UI needed. Plain fetch against `api.github.com`, same zero-dependency style as `arc-sync.js`. Config: `arc-github-config-v1`.

**Obsidian bridge (`arc-obsidian.js`, optional):** one Markdown note per arc (frontmatter + kicker/sub/prose/months table), written via the Local REST API community plugin's endpoints, scoped to a single vault folder (default `Arcs/`). Only reachable while Obsidian is open on the same machine; every call is best-effort and swallows failures the same way a misconfigured Supabase project does. No `[[wikilinks]]` yet - the `feedsInto`/`fedBy` graph lives only in Arc Dependencies' own hardcoded array. Config: `arc-obsidian-config-v1`.

---

## LocalStorage Keys

| Key | Scope | Format | Cleared By |
|---|---|---|---|
| `arc-reader-done-v1` | Arc Reader + Momentum | JSON dict keyed `{arcId}-{month}-{weekIdx}` -> bool | Manual (checkbox toggles) |
| `arc-momentum-log-v1` | Arc Momentum | JSON dict `{ 'YYYY-MM-DD': count }` - drives streak + 7-day velocity | Auto (task toggles) |
| `arc-momentum-focus-v1` | Arc Momentum | JSON dict `{arcId: true}` - which arcs are in focus | Manage-focus chips |
| `arc-exec-done-v1` | Arc Execution | JSON dict: gate completion flags | Manual |
| `arc-actions-config-v1` | Arc Execution | `{live, endpoints[], routes{}}` - automation endpoints + routing | Settings modal edits |
| `arc-actions-log-v1` | Arc Execution | Delivery log (capped 40) - doubles as dead-letter queue | Auto-capped |
| `arc-store-overlay-v1` | All tools | Overlay object (edits/created/deleted) | **Arc Reader Undo**, or manual localStorage clear |
| `arc-ai-keys-v1` | arc-ai.js | JSON dict: `{openai: "sk-...", gemini: "AIza..."}` | **Clear Key** button in Arc Reader, or manual |
| `arc-sync-config-v1` | arc-sync.js | `{enabled, url, anonKey, pollMs}` - Supabase project connection | Finish the Sync form edits |
| `arc-github-config-v1` | arc-github.js | `{enabled, owner, repo, branch, token, dataPath, prosePath}` - GitHub commit/PR bridge | Finish the Sync form edits |
| `arc-obsidian-config-v1` | arc-obsidian.js | `{enabled, baseUrl, apiKey, folder}` - Obsidian Local REST API connection | Finish the Sync form edits |
| `arc-agents-connectors-v1` | Arc Agents | `[{id,name,kind,config}]` - webhook/MCP/Slack/Notion/Linear/Gmail connectors | Connector delete in Arc Agents |
| `arc-agents-log-v1` | Arc Agents | Activity log (capped 60) - skills, ops, connector sends | Auto-capped |
| `arc-agents-live-v1` | Arc Agents | `'1'` / `'0'` - Live vs Dry-run for connector calls | Live toggle |
| `arc-agents-pending-v1` | Arc Agents | Queued `create_arc`/`delete_arc` ops awaiting Approve/Reject | Approve or Reject |
| `arc-agents-custom-agents-v1` | Arc Agents | `[{id,name,description,systemPrompt,provider}]` - saved custom agents | Delete in Arc Agents |

**Note:** The storage guard blocks `removeItem()` calls that would clear user work. To reset overlay, user must use Arc Reader's **Undo** button or write `{edits:{}, created:{}, deleted:[]}`.

---

## File Structure

```
project root/
+-- Arc Reader.dc.html          <- Main tool + AI assistant (entry point)
+-- Arc Momentum.dc.html        <- Daily driver: focus, streaks, AI standup
+-- Arc Portfolio.dc.html       <- Load planner
+-- Arc Execution.dc.html       <- Weekly dashboard + outbound automations
+-- Arc Dependencies.dc.html    <- Tier + leverage analysis
+-- Arc Briefing.dc.html        <- Leadership briefing generator
+-- Arc Agents.dc.html          <- Goal planner + connectors + approval queue (see Tools #7)
+-- Arc Home.dc.html            <- Surface index / landing tile grid
+-- Arc Extraction.dc.html      <- Bespoke 3-lane personal surface (not a catalog viewer)
+-- Canvas.dc.html              <- Documentation hub (stats + doc cards + changelog digest)
+-- Finish the Wiring - Claude Handoff.dc.html  <- n8n wiring runbook (ops handoff)
+-- Finish the Sync - Claude Handoff.dc.html    <- Supabase persistence runbook (ops handoff)
+-- arc-ai.js                   <- Multi-provider router + ops engine + store merge
+-- arc-actions.js              <- Outbound event dispatcher (webhook/MCP) for Arc Execution
+-- arc-agent-connectors.js     <- Connector registry + dispatch for Arc Agents
+-- arc-export.js               <- downloadCSV / openPrintable / sendDeliverable (non-mutating deliverables)
+-- arc-sync.js                 <- Optional Supabase push/pull bridge (Persistence phase 1)
+-- arc-github.js               <- Optional GitHub commit/PR bridge (Persistence §1)
+-- arc-obsidian.js             <- Optional Obsidian Local REST API note bridge (Persistence §4)
+-- supabase-schema.sql         <- arcs / prose / overlay_log tables + RLS (deploy reference)
+-- arc-mcp-server.js           <- Supabase Edge Function: MCP tool surface (deploy reference)
+-- arcs-data.json              <- Base library (74 arcs x up to 4 quarters x 3 months)
+-- arcs-archived.json          <- Retired arcs preserved for lineage (chaosclubco) - not read by any live tool
+-- arcs-data.backup*.json      <- Rollback snapshots (pre-curriculum, 26-arc, pre-deliverables, pre-compliance-scrub)
+-- arcs-prose.json             <- Narrative blocks (tradeoff + claims, 26 originals)
+-- arcs-prose.backup*.json     <- Rollback snapshots, same points-in-time as the data backups
+-- ARC_SYSTEM_DOCS.md          <- Canonical reference (this document)
+-- README.md                   <- Documentation suite index (start here)
+-- CATALOG.md                  <- All 74 arcs by tier + series
+-- CHANGELOG.md                <- Version history + per-release diffs
+-- EXTENDING.md                <- How to add arcs / tools / AI ops
+-- DELIVERABLES_PLAN.md / PERSISTENCE_PLAN.md / AGENTIC_ACCESS_PLAN.md / SUPPORTING_MATERIAL_PLAN.md  <- proposal docs, status noted in each
+-- RECONCILIATION_AUDIT.md     <- v1.5 findings vs. the external arc-system-2026-06-10 snapshot
+-- source-2026-06-10/          <- Copied governance docs from that snapshot (audit, boundary doc, sprint tracker)
+-- _ds/                        <- FlashFusion design system (bundle + tokens + fonts)
+-- uploads/                    <- Original source .jsx files (read-only reference)
`-- support.js                  <- DC runtime (auto-generated)
```

**Responsive:** all six tools + Extraction reflow from desktop down to phone widths via media queries in each DC's `<helmet>` (multi-column grids collapse to single column; Reader's rail moves to top and its AI panel goes full-screen under 900px). Edit the `@media` rules at the top of each template to tune breakpoints.

---

## Best Practices

### For Users

1. **Start in Arc Reader** - it's the source of truth. Make edits via the assistant.
2. **Commit to decisions** - avoid creating temporary arcs; the system is persistent.
3. **Use Undo sparingly** - it clears ALL pending edits, not just the last one.
4. **Switch providers cautiously** - each has rate limits and cost implications:
   - Anthropic: free, ~1024-token replies, best for quick edits
   - OpenAI: charges per 1K tokens, good for complex creates
   - Gemini: charges per 1M tokens, similar pricing to OpenAI
5. **Reload other tools after edits** - overlay sync happens on load, not live

### For Developers

1. **Never mutate base data directly** - always go through `applyOp()` and `saveOverlay()`
2. **Call `mergeOverlay()` / `applyOverlay()` on mount** - before building any lookup structures
3. **Test overlay round-trips** - create/edit/delete in Reader, reload another tool, verify
4. **Avoid localStorage race conditions** - overlay is write-after-apply, no mid-flight locks (single-user tool)
5. **Keep arc ids as slugs** - kebab-case, no spaces, unique across base + created
6. **Validate created arcs** - `normalizeCreated()` fills gaps, but ensure `id` + `em` are sensible

### For Design

1. **Each arc gets one accent color** - use for rail dots, header bar, borders, highlights
2. **Prose sections are optional** - if an arc has no prose, it still renders, just without the tradeoff block
3. **Month/week detail is tabular** - don't redesign the layout per arc; data structure is rigid by design
4. **Assistant panel is a chrome layer** - sits above everything, doesn't affect core layout

---

## Troubleshooting

### "Arc not found" in assistant reply

**Cause:** Arc id mismatch or user typed the display name instead of id (e.g., "Claude" vs. "claude").  
**Fix:** Assistant tries to infer from context, but be explicit: "Edit the claude arc" or paste the exact id.

### Changes in Arc Reader don't show up in other tools

**Cause:** Other tool was already loaded when edits were made.  
**Fix:** Reload the other tool (browser refresh). Overlay is merged on mount only.

### Undo button is grayed out

**Cause:** No pending edits (`overlayCount === 0`).  
**Fix:** Make an edit via the assistant first.

### OpenAI/Gemini key not saving

**Cause:** localStorage quota exceeded or browser privacy mode blocking storage.  
**Fix:** Clear other localStorage entries, or check if private browsing is on. Anthropic doesn't require a key.

### Assistant returns no reply but no error

**Cause:** Anthropic timeout (unlikely) or API network issue.  
**Fix:** Try again, or switch to OpenAI/Gemini if Anthropic persists.

---

## Roadmap & Future Work

- **Live sync** - WebSocket or polling to sync overlay across tabs in real-time
- **Multi-user collaboration** - server-side overlay merge with conflict resolution
- **Bulk operations** - "Apply to series 1" or "Rename all arcs ending in -arc"
- **Export** - PPTX deck, PDF brief, CSV lane allocation
- **Voice input** - natural-language requests via Whisper
- **Overlay in remaining AI surfaces** - Momentum reads it; extend richer AI editing to Portfolio/Execution/Briefing directly
- **Promote roadmap stubs** - author full 12-month curriculum + tradeoff prose for the 44 catalog stubs (Reader assistant or source extraction); see `EXTENDING.md`
- **Versioning** - commit-style snapshots of full library state (undo goes back N steps)
- **Shipped:** Catalog expansion to 75 arcs / 9 series with full-suite wiring (v1.3); Notion / Linear / Slack / Gmail notifications on milestone completion (Arc Execution -> n8n, July 2026); daily momentum surface; full responsive pass

---

## Support & Contact

Issues, feature requests, or questions -> check `uploads/README.md` for context on each arc series and the broader learning ops framework.

**Last updated:** July 16, 2026  
**Version:** 1.6 (production)
