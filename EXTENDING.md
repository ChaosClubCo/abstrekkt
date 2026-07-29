# Extending the Arc System

Patterns for adding to the system without breaking the shared data layer or the overlay. Read the **Architecture** and **Shared Overlay** sections of [`ARC_SYSTEM_DOCS.md`](ARC_SYSTEM_DOCS.md) first.

---

## The golden rule

**Never hand-edit `arcs-data.json` / `arcs-prose.json` for user-facing changes.** Those go through the AI overlay (`arc-ai.js` -> `applyOp` -> `saveOverlay`), so every tool sees them and **Undo** can revert them. Direct JSON edits are only for **base-library** work: bulk imports, schema fixes, or authoring roadmap-stub curriculum. **Always snapshot to `*.backup.json` before a base-library write.**

---

## The two-places gotcha (series & lane)

`series` and `lane` live in **two** places:

- **The JSON record** (`data[id].series`) - authoritative for the 44 roadmap + 5 personal arcs.
- **Each tool's `SEED` / `names` map** - authoritative for the original 26. Several are Series 2 / lane A-B there, and the JSON leaves those fields off, so they default to Series 1 if you read only the JSON.

The rail and pickers merge both. **When wiring a new surface, backfill unknown ids from the JSON** - don't assume the SEED map is complete.

---

## Add one arc (base library)

1. Add a record to `arcs-data.json` keyed by a unique kebab-case `id`. Minimum: `id`, `em` (display), `accent` (hex), `series` (1-9), one-line `sub`. Full arcs also carry `quarters[]` -> `months[]` -> `weeks[4]` + `gate`.
2. (Optional) Add prose to `arcs-prose.json` under the same id.
3. Wire it into the SEED-based tools (below).

`normalizeCreated()` in `arc-ai.js` gap-fills a partial arc to 12 months - reuse its shape.

## Add many arcs (bulk extraction)

This is how v1.3 imported 49 arcs from source `.jsx`:

1. **Snapshot first** - write `arcs-data.backup.json` / `arcs-prose.backup.json`.
2. Parse each source file's arc array/object. Neutralize non-JSON tokens before `eval`: bare icon identifiers (`Icon: Cpu`), template literals, and watch for **double-escaped apostrophes** (`\\'` -> `\'`) - one source file shipped with that bug.
3. Normalize to the arc schema; fill **honest placeholders, not fake data**. A stub with no curriculum is fine - mark it by leaving `weeks` empty.
4. Store `series` (and `lane` if known) **on each record** so the SEED-based tools can place it.
5. Validate: reload a data-driven tool and confirm the new ids render without error.

---

## Wire a new arc into every surface

Tools fall into three camps:

**Data-driven surfaces** (Arc Execution, Arc Briefing) already iterate `Object.keys(data)` and append any id not in their static `ORDER`. New arcs appear automatically - **no edit needed**.

**SEED-based surfaces** (Arc Reader, Arc Momentum) build their rail from a `this.names` / SEED map and group by a fixed `SERIES` array. For new arcs to show up:

1. In `componentDidMount`, after loading data, backfill the map - on **both** the initial-load and undo/reset paths:
   ```js
   Object.keys(data).forEach(id => {
     if (!this.names[id]) this.names[id] = [data[id].em || id, data[id].series || 1, data[id].lane || null];
   });
   ```
2. Extend `this.SERIES` to cover every series number present (v1.3 took these 3 -> 9).

**Planner surfaces** (Arc Portfolio, Arc Dependencies) embed their own arc arrays with extra metadata (loadHrs, feedsInto). Backfill in `componentDidMount`:
   ```js
   Object.keys(data).forEach(id => {
     if (this.ARCS.find(a => a.id === id)) return;
     this.ARCS.push({
       id, series: data[id].series || 1, em: data[id].em || id,
       accent: data[id].accent || '#8b5cf6',
       loadHrs: 5, feedsInto: [], fedBy: []   // ...tool-specific defaults
     });
   });
   ```
   Give new arcs sensible defaults; hand-author real `loadHrs` / `feedsInto` later. Portfolio routes Series >= 4 into its **Series Four+** section.

**Checklist:** rail shows it | picker groups it under the right series | Portfolio load math includes it (once load is set) | Dependencies shows a pill | Execution/Briefing list it | Reader opens it without error.

---

## Promote a roadmap stub to a full arc

The 44 roadmap arcs have overview only. To flesh one out:

- **Via the assistant** (persists to overlay, reversible): open Arc Reader and ask it to author months / weeks / gates + prose for the arc. Best for incremental work.
- **Via base extraction** (permanent, base-library): if you have a detailed source file, extract its curriculum into the arc's `quarters` / `months` / `weeks` in `arcs-data.json` and add prose. **Snapshot first.**

---

## Add an AI operation

Extend the ops schema in `arc-ai.js`:

1. Add the op to `OPS_DOC` (the system-prompt contract) with its required fields + constraints.
2. Handle it in `applyOp()` - mutate `data` / `prose` / `names` in place **and** write to the `overlay` dict so it persists.
3. Keep ops **small and surgical** - the model is told to prefer the narrowest op (don't `create_arc` to change one field).

## Add an outbound event

Extend `arc-actions.js` (the Arc Execution dispatcher) with the new event name + payload, then add a branch in the n8n **Event Router** workflow. Events carry an idempotency `id` for at-least-once dedupe. See the automations section of [`ARC_SYSTEM_DOCS.md`](ARC_SYSTEM_DOCS.md) and the `Finish the Wiring` runbook.

## Add a whole new tool

A new `.dc.html` Design Component that:

1. Loads the FlashFusion bundle in `<helmet>`.
2. `fetch`es `arcs-data.json` + `arcs-prose.json`.
3. Imports `arc-ai.js` and calls `mergeOverlay()` (or `applyOverlay()`) on mount, **before** building any lookup maps.
4. Reads shared progress from `arc-reader-done-v1` if it shows completion.
5. Styles inline (no stylesheets/classes).

Then add it to the file tree in `ARC_SYSTEM_DOCS.md`, the surface grid in `Arc Home.dc.html`, and mention it in `ARC_SYSTEM_README.md`.

---
*Suite v1.3 | July 7, 2026*
