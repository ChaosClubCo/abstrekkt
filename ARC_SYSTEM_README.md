# Arc System - Documentation

The **Arc System** is a planning, visualization, and AI-editing platform for **74 learning arcs across 9 series**. Seven catalog tools share one data layer and a localStorage overlay (plus an optional Supabase sync layer), so an edit made in one surface shows up in the rest.

This folder is the documentation suite. Start here.

## The suite

| Doc | Read it when you want to... |
|---|---|
| **[ARC_SYSTEM_DOCS.md](ARC_SYSTEM_DOCS.md)** | Understand the whole system - data layer, overlay, AI engine, every tool, automations, storage keys. The canonical reference. |
| **[CATALOG.md](CATALOG.md)** | See all 74 arcs - ids, display names, series, and which have full curriculum vs. roadmap stubs. |
| **[CHANGELOG.md](CHANGELOG.md)** | See what changed release to release, with per-file diffs. |
| **[EXTENDING.md](EXTENDING.md)** | Add an arc, wire a new tool, or add an AI operation - the exact patterns, with the gotchas. |

## 60-second orientation

- **Entry point:** `Arc Reader.dc.html` - the canonical editor; it owns the AI assistant. `Arc Momentum.dc.html` is the daily driver. `Arc Agents.dc.html` is the goal-planner/connector dashboard. `Arc Home.dc.html` is the surface index.
- **Data:** `arcs-data.json` (74 arcs) + `arcs-prose.json` (tradeoff/claims for the 26 originals). **Never hand-edit for user changes** - go through the overlay (assistant -> `applyOp` -> `saveOverlay`). Direct JSON edits are base-library work only.
- **Archived:** `arcs-archived.json` holds retired arcs preserved for lineage (currently: `chaosclubco`, retired brand superseded by `abstrekkt` - see CHANGELOG v1.5). Not read by any live tool.
- **Tools are Design Components** (`.dc.html`), styled inline, on the **FlashFusion** design system (`_ds/`).
- **Two gotchas:** the `mastery` key displays as **Gemini** (don't rename it); **series/lane live in two places** (the JSON for new arcs, each tool's SEED map for the original 26).

## The 74, at a glance

- **26 originals** - full 12-month curriculum + tradeoff prose. Series 1-3 in the tools.
- **4 personal** - full curriculum, Series 9: FlashFusion, Abstrekkt, Memoir, Reading Room. (ChaosClubCo retired/archived in v1.5 - absorbed by Abstrekkt.)
- **44 roadmap stubs** - title + series + one-line focus, no week curriculum yet. They appear on every surface; author their detail via the assistant or source extraction.

See **[CATALOG.md](CATALOG.md)** for the complete list, **[CHANGELOG.md](CHANGELOG.md) -> v1.3** for how they were merged and wired.

---
*Suite version 1.8 | July 16, 2026*
