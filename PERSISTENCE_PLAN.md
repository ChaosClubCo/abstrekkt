# Persistence & Integration Plan

Closes the "sync gap" flagged in `AGENTIC_ACCESS_PLAN.md`: where arc state actually lives durably, using Supabase (or Cloudflare), GitHub, and Obsidian. Plan only; nothing below is built yet.

---

## Four layers, four jobs

1. **GitHub** — canonical version history + the human-approval gate for risky agent ops.
2. **Supabase** (recommended) **or Cloudflare** — the live, queryable store + the MCP surface agents actually call at runtime.
3. **Obsidian** — the human-readable, linkable knowledge layer.
4. **n8n** — unchanged. Still the notification/automation glue; now fed by the DB instead of only inline dispatch.

None of these compete with `arc-ai.js` / `arc-actions.js` — they replace *where localStorage was the only source of truth* with a durable backend those two files talk to.

---

## 1. GitHub — source of truth + approval gate

Move `arcs-data.json`, `arcs-prose.json`, and the doc suite into a real repo. Every mutation becomes a commit instead of an in-place JSON overwrite:
- Low-risk ops (`edit_gate`, `edit_week`, `edit_meta`) auto-commit directly.
- High-risk ops (`create_arc`, `delete_arc`) open a **pull request** — the diff view *is* the approval gate from `AGENTIC_ACCESS_PLAN.md`, no separate approval UI needed.

This retires the current "snapshot to `*.backup.json` before you touch anything" convention — `git log arcs-data.json` replaces one flat backup with real, granular history. GitHub Actions is also a legitimate alternate home for the proactive cron jobs (standup/stall-watch) if you'd rather not add more to n8n — pick one host for those, not both.

## 2. Supabase (recommended) — live data + the MCP surface

Two distinct Supabase MCP surfaces — don't conflate them:

- **Official Supabase MCP server** (`mcp.supabase.com`) — the admin/schema tool. Use it from Claude Code/Desktop to design tables and write migrations while building this out. Supabase's own guidance is explicit: dev/test only, read-only mode recommended, never point it at production data or hand it to an end user. This is a *build-time* tool, not what a 6am standup agent should call.
- **A custom, purpose-built MCP server** for runtime agent access — a Supabase Edge Function built with `mcp-lite` (a small framework that runs unchanged on Supabase Edge Functions *or* Cloudflare Workers), exposing only the `arc-ai.js` ops contract as tools (`list_arcs`, `apply_arc_op`, `get_momentum`, `generate_deliverable`) — nothing schema-shaped, nothing admin-shaped. Scoped with Supabase Auth (now an OAuth 2.1 provider in its own right) + Row Level Security, so which ops/arcs an agent can touch is enforced at the database layer, not just in application code.

**Schema** — a direct port of the existing shape: `arcs` (id, em, accent, kicker, sub, series, lane) with `quarters`/`months`/`weeks` as JSONB (mirrors current nesting — normalize into real tables later only if a query pattern demands it); `prose` mirrors `arcs-prose.json` 1:1; `overlay_log` replaces the localStorage overlay's edits/created/deleted, carrying the `source: agent:<platform>` tag from `AGENTIC_ACCESS_PLAN.md`.

**Realtime** — every DC tool subscribes to `postgres_changes` instead of only reading localStorage on mount. This directly fixes the documented "reload to see another tool's edits" limitation in `ARC_SYSTEM_DOCS.md`.

## 3. Cloudflare — the alternative (or complementary) host

If you'd rather skip Postgres: D1 (edge-replicated SQLite) holds the same schema, Workers hosts the same `mcp-lite` server unchanged, KV covers small state (idempotency keys, sessions). Weaker on realtime — no equivalent to `postgres_changes` without hand-rolling Durable Objects + WebSockets — but simpler if you want one platform end to end. Since cross-tool realtime sync is a real, named gap today, **this plan defaults to Supabase**; Cloudflare Workers still shows up as a good place to host the MCP *endpoint* itself even if Supabase stays the database.

## 4. Obsidian — the human-readable layer

- Each arc becomes a note: frontmatter carries `id`/`series`/`lane`/`accent`, body carries kicker/sub/prose (headline, intro, gain/give-up, claims), months/weeks as a table.
- `feedsInto`/`fedBy` (Arc Dependencies' own graph) become `[[wikilinks]]` between arc notes — Obsidian's graph view becomes a free visualization of the same dependency graph, no new rendering code.
- Generated deliverables (briefings, standups — see `DELIVERABLES_PLAN.md`) land as new notes or get appended straight into Obsidian's periodic notes (daily-note append is a built-in capability — a standup can land in today's daily note automatically).
- Mechanism: the vault's own **Local REST API** community plugin now ships a built-in MCP server (Streamable HTTP, bearer auth) — no separate process to run beyond Obsidian itself.
- Real constraint: this only works while Obsidian is open on some machine — it is a human surface, not a durable host. And it's genuinely risky (full read/write on your notes) — start read-mostly (search/get/append) and add patch/delete once trusted, and back up the vault before granting write access.

---

## End-to-end example: agent completes a gate

1. Agent calls `apply_arc_op` on the Arc MCP server (Supabase Edge Function).
2. Server writes to Supabase (`overlay_log` + arc row) under RLS.
3. Realtime push updates any open DC tool instantly — no reload needed.
4. A sync step mirrors the change to GitHub — direct commit if low-risk, a PR if not.
5. n8n's existing Event Router (unchanged) still fires Slack/Gmail/Notion/Linear off the same event.
6. If the arc has a note open in Obsidian, the same op patches it — best-effort, skipped if Obsidian isn't running.

## Sequencing

1. Supabase project + schema (JSONB-first port of the two JSON files).
2. Custom `mcp-lite` Arc MCP server on a Supabase Edge Function — point Claude Code at it first.
3. Move the JSON + docs into a GitHub repo; wire low-risk-commit / high-risk-PR.
4. Add Realtime subscriptions to the six DC tools.
5. Stand up the Obsidian vault + Local REST API plugin; generate the first arc notes from Supabase.
6. Only then open the same Arc MCP server to OpenAI Agents SDK / Gemini, per `AGENTIC_ACCESS_PLAN.md`.

## Open decisions

- Supabase vs. Cloudflare as the DB host — defaulted to Supabase here for Realtime + Auth/RLS.
- One GitHub repo for data + docs together, or split?
- How much of the Obsidian vault agents may touch — just an `Arcs/` folder, or the whole vault?

---
## Status: phase 1 built (2026-07-16)

Sequencing step 1 only — "close the sync gap" — and only the client-reachable half of it.

**Built:** `supabase-schema.sql` (the JSONB-first schema from §2, as designed, not yet run against a real project); `arc-mcp-server.js` (the `mcp-lite` Edge Function from §2's second bullet, source only — not deployed); `arc-sync.js` (push every op's resulting snapshot to `overlay_log`, pull + fold into the existing overlay shape, interval polling). `arc-ai.js`'s `applyOp` now fire-and-forget pushes through it; Arc Reader and Arc Agents poll and merge remote changes live. Everything no-ops until a project URL + anon key are saved — see `Finish the Sync - Claude Handoff.dc.html`.

**Deliberately not built:**
- **Real Realtime.** Polling (default 20s) substitutes for `postgres_changes` — simpler, zero-dependency (plain `fetch`, no `supabase-js`), but not push-based. Swapping in true Realtime is a fast-follow if 20s latency isn't good enough.
- **Conflict resolution.** Last-write-wins on the folded overlay, no CRDT. Fine single-user; a real gap if this ever becomes multi-user.
- **The other five tools' pull side.** Portfolio/Dependencies/Execution/Briefing/Momentum still only read the local overlay. Push (via `arc-ai.js`) already covers all of them; only the live pull/merge loop is Reader + Agents so far.
- **Steps 3-6** — GitHub (version history + PR-as-approval-gate), Realtime subscriptions everywhere, the Obsidian vault, and opening the MCP server to OpenAI/Gemini — all still exactly as proposed above, untouched.

The three open decisions above are still open — nothing here forced a call on any of them beyond defaulting to Supabase (already this doc's default).

---
## Status: phase 1 complete, client-side (2026-07-16)

Closes the "other five tools' pull side" gap noted in the status above.

**Built:** Portfolio, Dependencies, Execution, Briefing, and Momentum now poll and fold remote changes live — the same `arc-sync.js` contract Reader and Agents already used. Portfolio/Dependencies fold through their own `applyOverlay()` (now accepts a remote-overlay argument, defaulting to the local read for existing callers); Execution/Briefing cache the raw pre-normalization data and re-run their existing normalize step after each remote merge; Momentum mirrors Reader's `data`/`prose`/`names` merge exactly, plus drops any focused arc a remote delete removed. All seven tools now behave identically on this axis.

**Still not built** — unchanged from the status above: real Realtime (still polling), conflict resolution (still last-write-wins), and steps 3-6 (GitHub, Obsidian, opening the MCP server to other agent platforms). Nothing in this pass touched them.

---
## Status: GitHub + Obsidian bridges built, client-side (2026-07-16)

Closes sequencing steps 3 and 5 (client-reachable half) — GitHub as source of truth/approval gate, Obsidian as the human-readable layer.

**Built:** `arc-github.js` — commits low-risk ops directly to the configured branch, opens a PR for `create_arc`/`delete_arc` (the diff view is the approval gate). `arc-obsidian.js` — one note per arc via the Local REST API plugin, scoped to a single vault folder. Both wired into `arc-ai.js`'s `pushSync` alongside the existing Supabase push; both silent/off until configured in `Finish the Sync - Claude Handoff.dc.html` (steps 05-06).

**Open decisions, resolved with defaults (not forced):** one repo for data + docs (§1's "one repo or split?") — defaults to one; nothing stops pointing this at two repos later, it's just config. Obsidian vault scope (§4's "just an Arcs/ folder, or the whole vault?") — defaults to a single configurable folder, the conservative option the plan itself named.

**Still not built:** real Realtime (still polling), conflict resolution (still last-write-wins), Realtime subscriptions to the six DC tools (step 4 — superseded in spirit by the existing 20s poll, not literally built), and opening the MCP server to OpenAI/Gemini (step 6 — blocked on deploying `arc-mcp-server.js`, unchanged).

**Known gap:** Obsidian notes don't carry `[[wikilinks]]` from Arc Dependencies' `feedsInto`/`fedBy` graph — that graph lives only in that tool's own hardcoded array, not the shared data model. Left out rather than faked.

---
## Status: phase 1 complete, client-side (2026-07-16)

Closes the "other five tools' pull side" gap noted in the status above.

**Built:** Portfolio, Dependencies, Execution, Briefing, and Momentum now poll and fold remote changes live — the same `arc-sync.js` contract Reader and Agents already used. Portfolio/Dependencies fold through their own `applyOverlay()` (now accepts a remote-overlay argument, defaulting to the local read for existing callers); Execution/Briefing cache the raw pre-normalization data and re-run their existing normalize step after each remote merge; Momentum mirrors Reader's `data`/`prose`/`names` merge exactly, plus drops any focused arc a remote delete removed. All seven tools now behave identically on this axis.

**Still not built** — unchanged from the status above: real Realtime (still polling), conflict resolution (still last-write-wins), and steps 3-6 (GitHub, Obsidian, opening the MCP server to other agent platforms). Nothing in this pass touched them.
