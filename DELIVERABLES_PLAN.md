# Live Deliverables Plan

How to turn the six planning tools from "state you edit" into surfaces that also **produce things you walk away with** — a doc, a file, a message sent. Written before any build; sequencing is a proposal, not a commitment.

---

## The distinction

Today the suite has two kinds of "live":

1. **Live editing** — `arc-ai.js` ops (`edit_gate`, `create_arc`, …) mutate the shared overlay. Real-time, but the output is *more planning data*, not something you hand to someone else.
2. **Live dispatch** — `arc-actions.js` fires checklist events to n8n, which already produces real external artifacts: a Notion gate-report page, a Slack message, a Gmail report, a Linear issue. This is the proof the pattern works end-to-end.

What's missing is the middle: **on-demand generation** — a button or a chat request that produces a standalone deliverable (document, export file, message) without mutating `arcs-data.json`. Arc Momentum already has one working example: **Generate weekly standup** calls `window.claude.complete` cold (no provider router, no key) and renders copyable text. Everything below generalizes that one proven pattern to the other five tools, plus gives it a real "send it somewhere" ending instead of stopping at clipboard.

---

## New shared primitive

Two small additions, reused by every surface below instead of each tool inventing its own:

- **A non-mutating op class in `arc-ai.js`.** Every op today writes to `data`/`prose`/`overlay`. Add `generate_doc` — `{ op:"generate_doc", title, format:"brief"|"standup"|"csv"|"summary", body }` — the model returns prose/rows; `applyOp` does *not* touch the overlay, it hands the payload back to the calling tool to render/export. Lets Reader's assistant answer "write me a one-pager on Security for my manager" without polluting the planning data.
- **`arc-export.js` helper module** (plain JS, no deps): `downloadCSV(rows, filename)`, `openPrintable(html)` (reuses the doc_page pattern for a Save-as-PDF-ready view), and a thin wrapper around `dispatch()` from `arc-actions.js` so a generated deliverable can optionally be pushed to Slack/email the same way checklist events already do, instead of just downloading.

Both are additive — no existing op, tool, or schema changes.

---

## Per-surface plan

**Arc Briefing** — biggest gap-to-value. It already frames narratives by stakeholder + cadence but the textareas are hand-typed and the "print view" is only on-screen.
- *Draft narrative* button per framing: sends gate data + framing to `window.claude.complete`, fills exec summary / risks / wins (same mechanic as the standup generator, applied here).
- *Export* button: renders the print view through `doc_page`-style pagination → real PDF via the Save-as-PDF flow. A stakeholder-ready deliverable in one click.

**Arc Portfolio** — the Roadmap already names this exact gap.
- *Export lane plan*: `downloadCSV` of arc / series / lane / load-hours / month allocation for the current selection. No AI needed, pure data shaping.

**Arc Momentum** — extend the one pattern that already works.
- Standup generator gets a **send** option next to copy: routes through `arc-actions.js` `dispatch()` to the same n8n router Execution uses (Slack/Gmail nodes already exist there) — `arc.standup.generated` as a new event type.
- *Weekly momentum report*: same idea as Briefing's export, a printable one-pager (streak, velocity, done/total, per-arc next actions).

**Arc Dependencies** — lower priority, smaller payoff.
- *Export map*: tier columns + leverage scores + suggestions as a printable one-pager. No new mechanism, reuses the printable helper.

**Arc Reader** — the general-purpose case, via the new `generate_doc` op.
- Free-form asks ("summarize the Claude arc's tradeoffs for a Slack post") render in a lightweight doc panel with copy/export, without touching the overlay the way every other op does.

**Arc Execution** — nothing new to plan here. It's already the most "live" piece of the suite (real Notion/Slack/Gmail/Linear side effects on gate completion); the only open item is the four config values in `Finish the Wiring - Claude Handoff.dc.html`, which is the user's task, not a design one.

---

## Phasing (proposed)

1. **Briefing** — draft-narrative button + PDF export. Highest visible payoff, reuses the standup-generator mechanic and an existing print view.
2. **Portfolio** CSV export — small, mechanical, closes a named Roadmap gap.
3. **Momentum** send-standup-to-Slack — wires the new primitive into the already-live n8n router, no new external setup.
4. **Reader** `generate_doc` op — the general-purpose escape hatch once the pattern is proven three times over.
5. **Dependencies** export — lowest priority, do last or skip if nothing needs it.

Each phase touches one `.dc.html` plus the shared helper file(s); none require schema changes to `arcs-data.json` / `arcs-prose.json`.

---
## Status: built (2026-07-11)

All five phases shipped. `arc-export.js` (new) holds `downloadCSV`, `openPrintable`, `sendDeliverable`; `arc-ai.js` gained `completeText` (provider-agnostic plain-text generation, no ops/overlay). Per surface:
- **Briefing** — *Draft narrative* fills TL;DR / capability / implication / asks from gate data via the built-in model; *Export PDF* renders the briefing as a standalone printable doc.
- **Portfolio** — *Export lane plan (CSV)* in the sidebar, scoped to the current selection (or all 75 if nothing's selected).
- **Momentum** — standup generator gained a *Send* action (dispatches `arc.standup.generated` through the existing n8n router) alongside Copy; new *Export weekly report (PDF)* one-pager (streak, velocity, done/total, focus-arc next actions).
- **Dependencies** — *Export map (PDF)* in the sidebar — tiers, score, unlock suggestions.
- **Reader** — assistant panel gained an Edit/Doc mode toggle. Doc mode routes through `completeText` (whichever provider/key is already configured), never touches the overlay, and renders Copy/Export actions on each generated message.

Not built: the `generate_doc` op variant inside `arc-ai.js`'s ops schema (Reader's Doc mode uses the simpler direct `completeText` path instead — same non-mutating outcome, no schema change needed).
