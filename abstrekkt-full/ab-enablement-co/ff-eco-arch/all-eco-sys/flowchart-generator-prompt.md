# React JSX Interactive Process Flowchart — Generator Prompt
> Fill in every [FIELD] below, then paste this entire document to Claude.
> Claude will produce a single production-ready `.jsx` file matching the
> v1.2.0 architecture (pan/zoom canvas, 4-tab panel, AI assistant, window.storage).

---

## INSTRUCTION TO CLAUDE

Build a React JSX interactive process flowchart artifact using the v1.2.0
architecture described at the bottom of this document. Populate it with the
process, nodes, edges, and AI context defined in the sections below. Deliver
a single `.jsx` file. No external CSS. No placeholders.

---

## 1. IDENTITY

```
Title (topbar label):   [e.g. "⚡ New Employee Onboarding"]
Storage key:            [e.g. "onboarding-v1"]  ← must be unique per flowchart
Copy ticket header:     [e.g. "# Onboarding Session Summary"]
Session start label:    [e.g. "▶ Begin Onboarding"]
```

---

## 2. ENVIRONMENT & AUDIENCE

```
Operator:       [Who runs this tool in real time — role, not name]
                [e.g. "L1 IT technician at a managed services provider"]

Organization:   [Org name + 1-sentence context]
                [e.g. "Acme MSP — 40-person IT shop serving 200 SMB clients"]

Primary use:    [What the operator does with this during the process]
                [e.g. "Real-time job tracking during active client onboarding calls"]

Audience:       [Who else might use or view this]
                [e.g. "Service desk leads reviewing completed tickets"]
```

---

## 3. PROCESS TO MAP

Describe the process OR paste your steps. Claude will generate node structure
from a prose description if you prefer — just be specific about sequence,
branches, and what "done" looks like for each step.

```
[Paste your process description, SOP, or step list here]

Key decision points:
- [Decision 1: e.g. "Is the client on a supported OS version?"]
- [Decision 2]
- [Decision 3]

Common failure modes (in order of likelihood):
- [Failure 1: e.g. "Client firewall blocking agent port 443"]
- [Failure 2]
- [Failure 3]

Escalation contacts:
- [Role → what they own: e.g. "Network Lead → firewall rules and VPN config"]
- [Role → what they own]

Environment-specific facts:
- [Tool names, URLs, IP ranges, credential locations, naming conventions]
- [e.g. "RMM portal: rmm.acme.internal | Ticket system: ConnectWise"]
- [e.g. "Agent installer at \\fileserver\installs\agent_v4.msi"]
```

---

## 4. NODE DEFINITIONS

Define each node. Copy the template block for each node. Minimum: 3 nodes.
Maximum recommended: 25 nodes (canvas gets crowded above that).

Claude will auto-position nodes if you omit x/y. Provide them for precise layout.

### Node Schema

```
id:           Unique snake_case string. Referenced by EDGES.
type:         terminal | process | decision | escalation
              (see Node Type Reference at bottom)
label:        ≤5 words. Shown on canvas. Wraps at 17 chars.
x, y:         Canvas coordinates. Origin is top-left. Nodes are 156×42px.
              Decisions are 148×66px (diamond). Space nodes ≥100px apart.
exp:          Expected minutes. Overtime ring appears at 2× this value.
bypass:       true | false  — shows Skip ↷ button
bypassOwner:  String shown in Skip modal. Required if bypass: true.
escalateTo:   String shown in Escalation box. Required if type: escalation.
returnsTo:    Node id to return to after escalation resolves.
checklist:    true | false  — shows ★/○ item list with pass/fail/skip buttons
              If true, must include items array.

w:   ["Walk-up checklist item 1", "item 2"]  — before starting the step
u:   ["During instruction 1", "instruction 2"]  — while doing the step
c:   ["Completion criterion 1", "criterion 2"]  — how to know it's done
i:   ["Org-specific info 1", "info 2"]  — env facts, URLs, fix notes

items: (only if checklist: true)
  [
    { id: "unique_id", label: "Checklist item label", critical: true | false },
    ...
  ]
  critical: true  → ★ (blocks completion until passed)
  critical: false → ○ (recommended, non-blocking)
```

### Your Nodes

```javascript
// NODE 1
{
  id: "[id]",
  type: "[terminal|process|decision|escalation]",
  label: "[≤5 words]",
  x: 400, y: 55,
  exp: [minutes],
  w: ["[walk-up item]"],
  u: ["[during item]"],
  c: ["[completion criterion]"],
  i: ["[org-specific info]"],
},

// NODE 2
{
  id: "[id]",
  type: "[type]",
  label: "[label]",
  x: 400, y: 160,
  exp: [minutes],
  // bypass: true, bypassOwner: "[who/why it can be skipped]",
  // escalateTo: "[contact → what they own]",  // escalation nodes only
  // returnsTo: "[node_id]",                    // escalation nodes only
  // checklist: true,                            // if checklist node
  w: ["[item]"],
  u: ["[item]"],
  c: ["[item]"],
  i: ["[item]"],
  // items: [{ id: "c1", label: "[item label]", critical: true }],
},

// [Continue for each node...]
// Remember: terminal nodes at start and end; decisions for branches;
// escalations for out-of-band contacts; process for everything else.
```

---

## 5. EDGE DEFINITIONS

Define connections between nodes.

```javascript
// EDGE SCHEMA
// { id: "e1", from: "[node_id]", to: "[node_id]" }
// { id: "e2", from: "[node_id]", to: "[node_id]", label: "Yes" }
// { id: "e3", from: "[node_id]", to: "[node_id]", label: "↩ Resolved", loop: true }
//
// label:  Optional. Shown on the edge line. Keep to 1-2 words.
// loop:   true for backward edges (escalation return paths). Renders orange dashed.

[
  { id: "e1",  from: "[start_id]",  to: "[next_id]" },
  { id: "e2",  from: "[decision]",  to: "[yes_path]", label: "Yes" },
  { id: "e3",  from: "[decision]",  to: "[no_path]",  label: "No"  },
  // [continue...]
]
```

---

## 6. QC / HANDOFF GATE (optional)

If you want a final verification gate that blocks completion until critical
items are checked, include this. The "Mark Done" button is disabled until all
★ items pass.

```
Include a QC gate?  [Yes | No]

If yes, list gate checklist items:
★ Critical (blocking):
  - [item 1]
  - [item 2]
○ Recommended (non-blocking):
  - [item 3]
  - [item 4]

Gate node label:    [e.g. "QC / Handoff Gate"]
Pass banner text:   [e.g. "✓ Ready to hand off"]
Fail banner text:   [e.g. "★ Critical items outstanding"]
Mark Done label:    [e.g. "Mark Done"]
```

---

## 7. AI ASSISTANT SYSTEM PROMPT

The embedded AI assistant (Anthropic API, Sonnet 4) has a persistent system
prompt injected into every conversation. It also receives the currently
selected node's w/u/i content and the operator's selected status.

```
[Write what the embedded AI needs to know to be useful mid-process.
Include:
  - What this flowchart is for (1 sentence)
  - The most common failure modes in order of likelihood
  - Escalation routing (who owns what)
  - Tool/credential locations relevant to this process
  - Tone guidance (e.g. "Operator is mid-call. Lead with most likely fix. Max 3 sentences.")
  - Any domain-specific rules or workarounds

Example format:
---
You are an embedded assistant for [process name] sessions at [org].

TOP FAILURE MODES (in order):
1. [Most common failure and one-line fix]
2. [Next most common]
3. [Next]

ESCALATION:
- [Role] → owns [what]
- [Role] → owns [what]

ENVIRONMENT:
- [Key URL or tool]
- [Key credential location]
- [Key fix or workaround]

TONE: [Tone guidance for mid-task use]
---
]
```

---

## 8. BRAND / VISUAL

```
Primary color (hex):   [e.g. "#156082"]  ← top bar, node borders, selected state
Accent color (hex):    [e.g. "#E97132"]  ← escalation nodes, overtime, arrange mode
Done color (hex):      [e.g. "#15803d"]  ← done status, session start button
Active color (hex):    [e.g. "#7c3aed"]  ← active status
Blocked color (hex):   [e.g. "#dc2626"]  ← blocked status
Navy/dark (hex):       [e.g. "#0E2841"]  ← top bar background
Canvas background:     [e.g. "#f1f5f9"]  ← SVG canvas fill
Font:                  system-ui  ← do not change (no external fonts)
```

---

## 9. CONSTRAINTS (do not change these)

These are architectural constraints of the v1.2.0 build. Do not alter them.

- Single `.jsx` file. No external CSS files, no CDN imports.
- `window.storage` for persistence (get/set async). Key defined in §1.
- Anthropic API: `claude-sonnet-4-6` (Sonnet 4.6, recommended), `max_tokens: 800`.
- No `localStorage` or `sessionStorage`.
- All node detail arrays use `w` (walk-up), `u` (during), `c` (completion), `i` (org info).
- `position: fixed` is forbidden (iframe viewport collapses).

---

## NODE TYPE REFERENCE

| Type | Shape | When to use |
|---|---|---|
| `terminal` | Pill (rounded rect) | Start and end of the process. Use exactly twice. |
| `process` | Rectangle | Any action step. The default for most nodes. Add `checklist: true` if it needs item-level tracking. |
| `decision` | Diamond | Binary branch point (Yes/No, True/False). Requires exactly 2 outgoing edges with `label`. |
| `escalation` | Orange rectangle | Out-of-band contact step. Gets orange border, "Escalate to" info box, and ↩ Resolved button. Always include `escalateTo`, `returnsTo`, and a `loop: true` return edge. |

**Bypass nodes** (`bypass: true`): Any `process` or `escalation` node that is
optional or owner-dependent. Shows a Skip ↷ button. Prompts for a reason and
logs it. Marks the node done without requiring criteria to be met.

**Checklist nodes** (`checklist: true`): Any `process` node that needs
per-item tracking. Each item has `critical: true` (★, blocking) or
`critical: false` (○, recommended). The QC Gate is a special checklist node
whose "Mark Done" button is disabled until all ★ items pass.

---

## V1.2.0 ARCHITECTURE REFERENCE
> For Claude — these are the conventions to follow when generating the file.

**Module-level constants:** `C` (color map), `SC` (status color map), `NW/NH/DW/DH` (node dimensions), `STORE_KEY`.

**Module-level pure functions:** `getPath`, `getLabelMid`, `wrapLabel`, `fmtTime`, `getElapsed`, `isOvertime`, `qcGatePassed`.

**Module-level render helpers:** `NodeSection` (section header + item list), `makeSvgNode(n, ctx)` (returns SVG `<g>` with key={n.id}).

**Components (all module-level, never defined inside App or other components):**
`ErrorBoundary` (class), `SessionTimer`, `AIPanel`, `DetailsPanel`, `NotesPanel`, `ProgressPanel`.

**App state:**
- `positions` — node x/y overrides from arrange mode
- `statuses` — todo/active/done/blocked per node id
- `checkState` — per-node, per-item pass/fail/skip
- `nodeNotes` — per-node note arrays
- `sessionLog` — timestamped log entries
- `sessionStart` — epoch ms or null
- `nodeStartTimes` — epoch ms per active node
- `selectedId`, `currentTab`, `arrangeMode`
- `bypassTarget`, `bypassReason`, `downstreamTarget`
- `saveLabel`, `initialized`, `overtimeTick`

**App refs (never state):** `pan`, `zoom`, `svgG`, `panStart`, `nodeDrag`, `currentTabRef`, `arrangeRef`.

**Stable callbacks:** `addLog` via `useCallback(..., [])` with functional updater. `onNodeMouseDown` via `useCallback(..., [])` using `currentTabRef` and `arrangeRef`.

**Pan/zoom:** Fully imperative. `applyTransform()` sets `svgG.current.setAttribute("transform", ...)`. Depless `useEffect` re-syncs after every commit. Zero `setState` calls during pan.

**Panel mounting:** All four panels always mounted. Wrapper `div` uses `display: none/block/flex` to toggle visibility. No unmount = no AI conversation loss.

**AI panel:** Separates `displayMessages` (UI, includes errors) from `conversationHistory` ref (clean API payload). `retryAI()` pops and replays cleanly. `AbortController` on every fetch; cleanup on unmount. `resp.ok` checked before `.json()`.

**Overtime:** `overtimeTick` state increments every 60s → App re-renders → canvas refreshes overtime rings. `isOvertime` is a pure function called inside `makeSvgNode` via `svgCtx`.

**Storage:** Load in `useEffect([], [])` with `try/catch/finally`; `finally` always sets `initialized: true`. Save surfaces failure via `setSaveLabel("⚠ Failed")`. Session Start disabled until `initialized`.

**QC gate:** `qcGatePassed(checkState)` is a pure module-level function. Hardcoded to the `qc_gate` node id. Mark Done button `disabled={!passed}`.
