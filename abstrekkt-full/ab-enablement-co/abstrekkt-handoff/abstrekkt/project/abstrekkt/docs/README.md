# Construction, Not Recovery — Source Map

Flat, non-hierarchical knowledge graph of Kyle Rosebrook's memoir *Construction,
Not Recovery*. An evidence board: thesis, evidence, characters, source documents,
narrative threads, and drafting workflow as an interconnected network with a
stated `reason` on every edge.

**Full manual (usage, schema, editorial + sensitivity protocol):**
`Source Map Manual.html` — also linked from the board's `? Manual` button.

## Run

No build step. Open `Construction Not Recovery - Source Map.html` in a browser.
React 18 + Babel standalone load from pinned CDN URLs with integrity hashes.

## Files

| File | Role |
|---|---|
| `Construction Not Recovery - Source Map.html` | Shell: brand tokens, all CSS, script mounts |
| `abstrekkt/memoir-graph.jsx` | Entire app: seed data, force sim, board, panel, intake, help |
| `Source Map Manual.html` | Operator's manual (in-brand HTML) |
| `abstrekkt/docs/CHANGELOG.md` | Version history |

## Data model (in `memoir-graph.jsx`)

```js
// SEED_NODES
{ id, tag, cat, hub?, label, blurb }
//  id    stable key; edges reference it — update both if renaming
//  tag   display ref "PFX·NN" (THS/SBJ/FRM/EVD/HIS/BLD/CRF)
//  cat   thesis | subject | evidence | history | build | craft
//  hub   larger render + stronger pull (thesis-level only)

// SEED_EDGES
{ a, b, kind, reason, p?, evd?, ai? }
//  reason  REQUIRED — the sentence explaining the connection; the board's real content
//  p       primary structural thread (brighter)
//  evd     evidence-backed (lights blueprint blue on selection)
//  ai      machine-filed (dashed); set by intake — never hand-set on seed data
```

Rules: reuse existing `kind` verbs; no orphan nodes; no reason → no edge.

## Architecture notes (do not regress these)

- **Warm-up is synchronous, in the render body.** Preview iframes throttle
  `requestAnimationFrame`; if layout depends on rAF it never runs offscreen.
  rAF handles only live drag/settle polish.
- **Sim reads live state via refs** (`nodesRef/edgesRef/spreadRef/dimRef`) —
  never closure-captured props (source of the v1.3 stale-layout bugs).
- **One measurement source:** `useLayoutEffect` + ResizeObserver on the board.
  Canvas width == measured board width (no fixed floor). `compact` derives from
  the same measurement — **never `matchMedia`** (it disagreed with reality once;
  that's why it's gone).
- **Scroll, don't clip:** canvas keeps a min *height*; board overflows/scrolls
  on short viewports. Clamp uses node half-dimensions (positions are centers).

## AI intake

`window.claude.complete` is feature-detected (`hasAI`). With it: document text
(≤6,000 chars) + current graph + category hints → strict-JSON proposal
`{label, cat, blurb, connections[{to, kind, reason}]}`, reviewed and editable
before commit. Without it: manual filing, same form. The model never commits,
edits, or deletes; its threads render dashed permanently.

## Sensitive material

The board references sensitive sources (Kinsley, the Michael Relationship
Journal, the Primary Source Archive) but must hold **no raw excerpts**.
Binding rules live in the manual §07 — read them before adding content.

## Docs map

- `Source Map Manual.html` — full manual (user guide, schema, machine layer,
  editorial rules, sensitivity protocol, architecture, changelog)
- `abstrekkt/docs/CHANGELOG.md` — version history
- In-app `? Manual` overlay — quick reference, links to the manual
