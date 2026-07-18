# Agentic Access Plan

How external agent platforms — OpenAI Agents SDK, Google AI Studio / Gemini, Claude Code / Console — get to act on the Arc system autonomously, proactively, and reactively. Plan only; nothing below is built yet.

---

## The constraint that shapes everything

This suite is 100% client-side: `.dc.html` files + browser localStorage. Nothing here is "always on" except the one piece that already runs server-side today — the n8n **Arc Execution — Event Router v2** workflow that `arc-actions.js` dispatches to. Any agent that needs to act **without a human opening a tab** (on a timer, or the instant an event fires) needs a durable host, and n8n is already that host. Any agent that only needs to act when a human is present and asking (today's in-Reader assistant) can stay browser-side. That split — durable/machine-triggered vs. session/human-triggered — is the spine of this plan.

## Why one MCP server, not three integrations

`arc-actions.js` already speaks MCP as a **client** (the `sendMcp` transport, JSON-RPC 2.0, session handling). The missing half is exposing an MCP **server** — because all three target platforms are converging on MCP as their tool-connection layer: OpenAI's Agents SDK has native MCP support (stdio/SSE/Streamable HTTP, plus hosted MCP tools with approval gates); Gemini API, Gemini CLI, and the Gemini Enterprise Agent Platform all take a remote MCP server URL as a tool source; Claude Code/Desktop are the reference MCP client and are already the documented surface for this project's n8n wiring. One server, one tool schema, three thin adapters — instead of bespoke glue per platform.

## The three verbs, defined for this system

- **Reactive** — responds to an arc-system event (gate completed, week checked, arc stalled). Lives inside the existing n8n Event Router, alongside the Slack/Gmail/Notion/Linear nodes already there.
- **Proactive** — acts on its own clock, no triggering event (Monday-morning check, nightly stall scan). New n8n Schedule Trigger → agent call.
- **Autonomous** — given a goal, the agent decides *what* op to apply rather than following a fixed template. This is the layer that makes reactive/proactive "agentic" instead of just more webhook branches.

---

## Build blocks

**1. Expose the Arc MCP server.** Add an MCP Server Trigger workflow in n8n (the one always-on piece already in play). Tools mirror the existing ops contract 1:1 — no new schema to invent:
- `list_arcs` / `get_arc(id)` — read
- `apply_arc_op(op)` — literally `arc-ai.js`'s `applyOp`, now callable by anything that speaks MCP, not just the in-browser assistant
- `get_momentum()` / `get_portfolio_load()` — read-only rollups
- `generate_deliverable(kind, args)` — the non-mutating generation op proposed in `DELIVERABLES_PLAN.md`, now externally triggerable

Gap to close first: n8n's data tables today only mirror *dispatched events*, not the full arc library (`arcs-data.json`/`arcs-prose.json` live only as static project files + browser localStorage overlay). **See `PERSISTENCE_PLAN.md`** for the concrete fix — Supabase (or Cloudflare) as the durable store the MCP server reads/writes, GitHub as version history + approval gate, Obsidian as the human-readable layer. Without that, agents can act but can't fully see the current plan.

**2. Reactive wiring.** Add an AI Agent node (model-agnostic — Claude, GPT, or Gemini) branching off the existing Event Router switch. On `arc.gate.completed`, e.g., the agent reads the gate + history via the new MCP tools and decides whether to draft a richer report, flag risk, or open a Linear issue with real analysis — instead of the current fixed Slack string. Same idempotency/retry/dead-letter guarantees, because it's the same router.

**3. Proactive wiring.** Concrete first jobs, not an abstract scheduler:
- *Monday standup* — cron → agent reads momentum + portfolio via MCP → generates the standup (Momentum's existing generator, moved server-side) → posts to Slack without anyone opening the tab.
- *Stall watch* — nightly cron → agent flags arcs with no completions in N days.
- *Capacity guard* — on `arc.toggled` or a weekly cron, agent re-runs Portfolio's load math and flags overcommitment.

**4. Per-platform adapters.**
- **Claude Code / Console** — already the recommended surface (see the Handoff runbook). Extend from a one-off wiring session to a *recurring* scheduled run against the same Arc MCP server, with a standing instruction ("check in every morning, flag risk, never create/delete an arc without asking").
- **OpenAI Agents SDK** — an `Agent` with the MCP server attached over Streamable HTTP (remote/n8n-hosted), `require_approval` gates on anything beyond `edit_*` ops — the SDK's approval-callback mechanism is built for exactly this supervised-autonomy shape.
- **Gemini / AI Studio** — same MCP server URL as a remote tool entry (Gemini API / CLI / Enterprise Agent Platform all take this); a background Interactions-API job is also a viable alternate home for the proactive schedule, if preferred over n8n cron.

**5. Guardrails.**
- Every agent-originated change tagged `source: "agent:<platform>"` in the overlay/dispatch envelope — visible next to human edits in Arc Reader, revertible the same way.
- New agent connections default to **dry-run**, matching `arc-actions.js`'s existing pattern, until flipped live.
- Tool scoping: read + `generate_deliverable` open by default; `create_arc`/`delete_arc` behind an approval gate; gate/week edits are lower-risk and can auto-apply.
- Rides on `arc-actions.js`'s existing reliability (idempotency id, backoff/retry, dead-letter log) — no new failure handling to write.

---

## Sequencing

1. Close the sync gap — full arc library mirrored server-side. Nothing else works without it.
2. Stand up the Arc MCP server in n8n.
3. Prove it end-to-end on one platform — Claude Code, since it's already the trusted, documented surface — running the Monday-standup job proactively.
4. Add the reactive agent node to the Event Router.
5. Add OpenAI Agents SDK + Gemini adapters once the server and guardrails are proven.

## Open decisions

- Approval posture: fully supervised (every mutating op confirmed) vs. autonomous-within-scope (safe ops auto-apply, risky ones queue)? This plan assumes the latter.
- Which proactive jobs are actually wanted — standup / stall-watch / capacity-guard are proposals.
- Whether Gemini/OpenAI agents get write access at all, or read + generate only, with Claude Code as the sole trusted writer.

---
## Status note (2026-07-16)

This plan said "no files beyond this one written yet" — that turned out to be stale, not accurate. `Arc Agents.dc.html` + `arc-agent-connectors.js` already exist and cover most of this plan's **browser-reachable** scope, just framed as generic connectors rather than named platform adapters:
- The **three proactive jobs named above** (Monday standup / stall watch / capacity guard) are exactly Arc Agents' three one-click skills — on-demand rather than cron-triggered, since nothing here is server-side yet.
- **Connectors** (webhook, MCP, Slack, Notion, Linear, Gmail) stand in for "per-platform adapters" — real fetches to each service's official endpoint, live/dry-run toggle, per-connector Test.
- **Guardrail §5 is implemented as designed** — `create_arc`/`delete_arc` always queue for human Approve/Reject (`arc-agents-pending-v1`); every lower-risk op auto-applies to the shared overlay, reversible via Reader's Undo.
- The **goal planner** (freeform request → ordered skill/op/connector steps → executed in sequence) is this system's version of "autonomous" — decides what to call, not just which fixed template to fill.

What's genuinely still missing is **block 1** — a durable, always-on MCP server, so any of this can run reactively or proactively without a human's tab open. `PERSISTENCE_PLAN.md`'s phase 1 (built this same pass — see its Status section) lays the schema and an Edge Function *source* for exactly that server, but it isn't deployed. Until it is, "proactive" here still means "one-click while the tab is open," not "ran itself at 6am." Sequencing items 2-5 (stand up the server live, reactive Event Router node, OpenAI/Gemini adapters) remain undone.

---
*Companion to `DELIVERABLES_PLAN.md` and `PERSISTENCE_PLAN.md`.*
