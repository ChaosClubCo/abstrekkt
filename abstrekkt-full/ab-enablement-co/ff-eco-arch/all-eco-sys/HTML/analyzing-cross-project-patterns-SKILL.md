---
name: analyzing-cross-project-patterns
version: 1.0.0
description: |
  Surface structural connections, shared mechanisms, and undocumented insights
  across the INT, FlashFusion, flash-n-frame, and memoir project lanes.
  Produces: connection maps, the-same-build analyses, and WSJF-prioritized action lists.

  USE WHEN user mentions: cross-project, connection analysis, how do these projects connect,
  what links INT and FlashFusion, cross-lane patterns, unifying thesis, construction over recovery,
  supervision tax, comprehension debt, INT proof-of-concept, INT case study, FlashFusion PoC,
  project dependency map, how does the memoir connect, skills lane index, cross-lane insight,
  what's the same across projects, how are these related, cross-project map, lane connections,
  project map, connect the dots, INT to FlashFusion, accumulator platform, cross-lane dependency,
  what's the strategic thread, project coherence, lane coherence, unified thesis, brand origin.
allowed-tools: "bash, view, create_file, web_search"
---

# Analyzing cross-project patterns v1.0

Surfaces undocumented connections, shared mechanisms, and actionable insights across
the four active project lanes: INT, FlashFusion, flash-n-frame, memoir.

---

## Quick reference: the five known connections

| ID | From | To | Type | Status |
|----|------|----|------|--------|
| C1 | INT KB automation | FlashFusion Tier 2 | Structural equivalence (PoC) | Live — undocumented |
| C2 | INT service desk | FlashFusion agent workflows | n8n integration | BLOCKED (11 workflows) |
| C3 | flash-n-frame | FlashFusion | Reference architecture | 40/100 — needs remediation |
| C4 | Memoir | FlashFusion | Philosophy source | Undocumented — no memoir content |
| C5 | Skills Library | All lanes | Execution meta-infrastructure | Active — needs lane index |

**Unifying thesis (undocumented):** "Supervision Tax" / "Comprehension Debt" — the same failure mechanism operating at personal, service-desk, and consulting scale. The answer at every scale is Construction over Recovery.

Full written analysis: `cross-project-connections.md` (Drive)
Interactive map: `cross_project_map.html`

---

## Step 1: Determine what kind of cross-project analysis is needed

| Request | Go to |
|---------|-------|
| "What connects INT and FlashFusion?" | C1 and C2 summary |
| "Is there a PoC for FlashFusion?" | C1 detail + case study action |
| "How do these projects relate?" | Full connection map (all 5) |
| "What's the unifying thesis?" | Unifying thesis section |
| "What are the cross-lane dependencies?" | Dependency map + action list |
| "Analyze these documents for connections" | Document pattern analysis (Step 2) |

---

## Step 2: Running a new cross-document connection analysis

Use when given documents, Drive content, or conversation history to analyze.

### 2.1 — Read and cluster

For each document provided:
- Label the lane: INT / FlashFusion / flash-n-frame / Personal / Cross-cutting
- Identify the primary mechanism it describes (workflow, philosophy, architecture, risk, metric)
- Note any statistics or quantified claims — label [SOURCED] or [GENERATED]

### 2.2 — Find structural matches

Look for these specific patterns:
- **Same pipeline, different context:** Does any INT workflow follow the same Router → Planner → Executor → Validator → Publisher pattern as a FlashFusion service?
- **Same failure mechanism, different scale:** Is the same breakdown (Supervision Tax, adoption friction, maintenance bloat) appearing in multiple documents?
- **Same philosophy, different application:** Is "Construction over Recovery" or a variation appearing in both technical and personal/memoir documents?
- **Same metric, different label:** Is the same performance indicator being tracked under different names in different lanes?

### 2.3 — Surface the undocumented connection

For each match found:
```
Connection: [A] ↔ [B]
Mechanism: [What is structurally identical or parallel]
Evidence: [SOURCED from doc X] or [GENERATED — inference]
So what: [What becomes possible if this connection is made explicit]
Action: [One concrete step to capitalize on this connection]
```

### 2.4 — Check against known connections

Before reporting a new connection, verify it doesn't duplicate C1–C5 above.
If it extends a known connection, attach it to the existing connection record in
`cross-project-connections.md`.

---

## Step 3: Connection output format

For any new connection analysis, deliver:

1. **Connection map** — a summary table listing all connections found (use the C1–C5 format above)
2. **Top connection** — the highest-value structural equivalence, with full detail and action
3. **Unifying mechanism** — if applicable, identify the shared failure/success pattern across lanes
4. **WSJF action list** — what to do first, scored by value × time ratio

---

## Step 4: Patterns to watch for

These patterns recur across Kyle's project ecosystem. When you see them, name them.

### "Same build" pattern
When an internal build (INT automation, personal tool) is structurally identical to a proposed client service (FlashFusion offering). The internal build is always the proof-of-concept. Always ask: can this be documented as a case study?

### "Three scales" pattern
When a problem or mechanism appears at three scales: personal (memoir), operational (INT), and commercial (FlashFusion). This is the signature of a unifying thesis. Name it.

### "Blocked pipe" pattern
When an integration layer (n8n, credentials, field mapping) that SHOULD connect two projects is inactive. The projects are functioning independently when they should be feeding each other. Unblocking it is always higher value than building new things.

### "Orphaned proof" pattern
When a technical system (flash-n-frame, INT KB automation) demonstrates a capability that FlashFusion is positioning as a future deliverable. The proof already exists but isn't packaged or named. Packaging it is always lower cost than building new proof.

---

## Known open analysis gaps

- No cross-project analysis has been run against the full 23-part OAAS Runbook — Part K (failure recovery) was identified as connecting to the memoir philosophy in May 20 2026 session, but the full runbook was not analyzed
- No Notion content was accessible in any analysis session — any cross-project context living in Notion is invisible
- The memoir has no written content — the philosophy → brand connection exists in memory only; documenting it is the necessary precondition for the connection to be usable
