# Multi-Agent Workspace — Build Prompt v2
**Inspired by Moltbook (Jan 2026) and OpenClaw agent architecture.**

---

## What This Builds

A **React artifact** (single-file JSX, Tailwind + inline styles) that renders a live
multi-agent workspace. Agents have persistent identity and state, communicate via typed
packets, execute workflow tasks, and reason using real LLM calls through the Anthropic
API (`claude-sonnet-4-20250514`). The user submits a goal; the system decomposes and
executes it visibly.

This is **not** a game. It is **not** decorative. It is a functional orchestration
visualization with real LLM-backed agent reasoning.

---

## Rendering Target

| Constraint         | Value                                      |
|--------------------|--------------------------------------------|
| Host               | Claude.ai artifact (React JSX)             |
| Framework          | React (hooks), Tailwind utility classes    |
| LLM calls          | `fetch` → `https://api.anthropic.com/v1/messages` |
| Model              | `claude-sonnet-4-20250514`                 |
| Canvas             | SVG overlay on top of positioned DOM nodes |
| State              | `useReducer` + `useRef` (no external store)|
| No localStorage    | All state in-memory                        |
| No form tags       | All interactions via `onClick`/`onChange`  |

---

## Data Models (TypeScript-style interfaces)

```typescript
// Core identity
interface Agent {
  agentId: string;           // e.g. "agt_research_01"
  name: string;
  role: AgentRole;           // see enum below
  status: AgentStatus;       // idle | thinking | executing | blocked | done
  currentTask: string | null;
  currentWorkflowId: string | null;
  reasoningLog: ReasoningEntry[];  // last 10 steps
  inboxQueue: Packet[];      // unprocessed incoming packets
  outboxHistory: Packet[];   // last 20 sent
  trustScore: number;        // 0–1, updated on task completion
  collaborators: string[];   // agentIds of frequent partners
}

type AgentRole =
  | "orchestrator"
  | "researcher"
  | "coder"
  | "security"
  | "documentation"
  | "analytics";

type AgentStatus = "idle" | "thinking" | "executing" | "blocked" | "done";

interface ReasoningEntry {
  timestamp: number;
  step: string;              // plain text: "Decomposing goal into 4 subtasks"
  confidence: number;        // 0–1
}

// Communication
interface Packet {
  packetId: string;
  timestamp: number;
  senderAgentId: string;
  receiverAgentId: string;
  workflowId: string;
  packetType: PacketType;
  payloadSummary: string;    // 1-sentence human-readable
  urgency: "low" | "medium" | "high";
  status: "in_flight" | "delivered" | "failed";
}

type PacketType =
  | "task_assignment"
  | "task_handoff"
  | "research_result"
  | "implementation_update"
  | "security_scan_result"
  | "completion_report"
  | "collaboration_request"
  | "workflow_alert";

// Workflow
interface Workflow {
  workflowId: string;
  goal: string;              // user-submitted string
  status: WorkflowStatus;
  tasks: Task[];
  createdAt: number;
  completedAt: number | null;
}

type WorkflowStatus = "pending" | "running" | "complete" | "failed";

interface Task {
  taskId: string;
  workflowId: string;
  assignedAgentId: string;
  description: string;
  status: "queued" | "active" | "done" | "failed";
  dependsOn: string[];       // taskIds that must complete first
  result: string | null;
}
```

---

## Phase 1 — MVP Scope (build this first, completely)

Six agents. One workflow at a time. Real LLM reasoning for orchestrator only; other
agents execute via deterministic state transitions + LLM-generated summaries (one call
per task, not per tick).

### Agents to instantiate

| agentId              | Role          | Specialty                        |
|----------------------|---------------|----------------------------------|
| `agt_orch_01`        | orchestrator  | Goal decomposition, task routing |
| `agt_research_01`    | researcher    | Information retrieval, synthesis |
| `agt_coder_01`       | coder         | Implementation, code generation  |
| `agt_security_01`    | security      | Scan, flag, validate             |
| `agt_docs_01`        | documentation | Write, summarize, publish        |
| `agt_analytics_01`   | analytics     | Estimate, benchmark, report      |

### MVP System List (implement all six; stub nothing)

1. **Agent State Manager** — `useReducer` managing the full `Agent[]` array. Status
   transitions are the only mutations: `idle → thinking → executing → done/blocked`.

2. **Workflow Orchestrator** — On user goal submission, call the Anthropic API with
   the orchestrator agent's context. Receive a structured task list (JSON, described
   below). Dispatch tasks to agents. Track dependency resolution.

3. **Communication Packet Bus** — Centralized packet queue. Packets are created,
   enqueued, and consumed by agents in order. Render active in-flight packets as
   animated SVG lines between agent nodes.

4. **LLM Execution Layer** — Rate-limited call pool. Max **3 concurrent API calls**.
   Each agent task fires exactly **one** LLM call. Debounce: 500ms minimum between
   calls per agent. On 429 or error: retry once after 2s, then mark task `failed`.

5. **Agent Inspector Panel** — Click any agent node to open a side panel showing:
   current status, reasoning log (last 10 entries), active task, recent packets
   sent/received, trust score.

6. **Workflow Progress View** — Linear or DAG display of tasks: queued → active →
   done/failed. Shows which agent owns each task. Updates in real time as packets
   arrive.

---

## Phase 2 — Extension Scope (do not build until Phase 1 is verified)

- Agent memory graph (cross-workflow pattern recognition)
- Multi-workflow queue (more than one active workflow)
- Collaboration heatmap overlay
- Application registry UI (Research Console, Code Editor, Terminal — visual stations)
- Agent reputation / historical reliability tracking
- Resource utilization monitor
- Human approval gates (workflow pauses for explicit user confirmation)

---

## LLM Integration Spec

### Orchestrator call (goal decomposition)

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `You are the Orchestrator agent in a multi-agent workspace.
Your job: decompose the user's goal into 3-6 discrete tasks,
assign each task to the appropriate agent role, and define dependencies.
Respond ONLY with a JSON array. No preamble. No markdown fences.
Schema: [{ taskId, description, assignedRole, dependsOn: string[] }]`,
    messages: [{ role: "user", content: `Goal: ${goal}` }]
  })
});
const data = await response.json();
// Parse data.content[0].text as JSON
```

### Agent task execution call

```javascript
// One call per task, not per animation tick
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `You are ${agent.name}, a ${agent.role} agent.
Complete the assigned task. Return ONLY a JSON object with:
{ summary: string, confidence: number (0-1), result: string, nextAction: string | null }`,
    messages: [{ role: "user", content: `Task: ${task.description}` }]
  })
});
```

### Rate limiting implementation

```javascript
// Semaphore pattern — max 3 concurrent calls
const activeCalls = useRef(0);
const MAX_CONCURRENT = 3;

async function enqueueAgentCall(agentId, task) {
  if (activeCalls.current >= MAX_CONCURRENT) {
    // Re-queue after 600ms
    setTimeout(() => enqueueAgentCall(agentId, task), 600);
    return;
  }
  activeCalls.current++;
  try {
    const result = await executeAgentTask(agentId, task);
    dispatch({ type: "TASK_COMPLETE", agentId, taskId: task.taskId, result });
  } catch (err) {
    dispatch({ type: "TASK_FAILED", agentId, taskId: task.taskId, error: err.message });
  } finally {
    activeCalls.current--;
  }
}
```

---

## Visualization Rules

### Packet animation
- Render as **SVG `<circle>` nodes** traveling along a `<line>` between two agent positions
- Color by packet type: research = `#6366f1`, task = `#10b981`, security = `#ef4444`,
  docs = `#f59e0b`, analytics = `#3b82f6`
- Animation: CSS `@keyframes` translate along the line path, 1.2s duration
- Cap at **30 simultaneously rendered packets**. Cull oldest when exceeded.
- Packets are **never** projectiles, weapons, or combat indicators

### Agent node states
- `idle`: muted glow, opacity 0.6
- `thinking`: pulsing ring animation (CSS `@keyframes scale 1.0→1.08→1.0, 1.2s infinite`)
- `executing`: solid bright border, 100% opacity
- `blocked`: amber ring + warning icon
- `done`: checkmark badge, desaturated

### Layout
- Agent nodes: absolute-positioned in a **radial layout** (orchestrator center,
  5 specialists evenly spaced on a ring at radius 280px)
- Inspector panel: fixed right side, 320px wide, slides in on agent click
- Workflow view: bottom panel, collapsible, shows task DAG

---

## Prohibited Patterns

The following must not appear anywhere in the implementation:

- `attack`, `damage`, `health` (as game properties)
- `enemy`, `hostile`, `weapon`, `combat`
- `projectile`, `collision` (physics damage)
- Health bars or HP counters
- Any mechanic framing agents as adversaries

Agents never harm each other. All interactions are productive:
coordination, communication, delegation, validation, reporting.

---

## Acceptance Criteria

Phase 1 is complete when ALL of the following pass:

- [ ] User can type a goal and click "Run" — orchestrator fires one LLM call and
      returns a parsed task list
- [ ] Tasks are dispatched to named agents; agent status transitions are visible
- [ ] At least one packet travels visually between two agents per workflow
- [ ] Clicking any agent opens the inspector panel with non-empty reasoning log
- [ ] Workflow completes (all tasks `done`) with a final summary packet from
      orchestrator to all agents
- [ ] No more than 3 concurrent LLM calls at any time (verifiable via console.log)
- [ ] Failed LLM calls surface as `blocked` agent status + error in inspector,
      not as a silent hang
- [ ] No combat, game, or hostile terminology anywhere in rendered UI or console

---

## Security / Safety Rules

1. **No secrets in client code** — API key is handled by the artifact proxy.
   Never embed keys in source.
2. **Workflow sandboxing** — no agent can modify another agent's state directly.
   All mutations go through the central reducer dispatch.
3. **Input validation** — goal string: max 500 chars, strip HTML before dispatch.
4. **No runaway spawning** — agent count is fixed at instantiation. No dynamic
   agent creation during workflow execution.
5. **Execution timeout** — any single LLM call that hasn't resolved in 15s gets
   aborted via `AbortController` and the task is marked `failed`.

---

## File Structure

Single-file artifact. No imports except React hooks and Tailwind classes.

```
AgentWorkspace.jsx
├── constants/        (inline: AGENT_DEFS, ROLE_COLORS, MAX_CONCURRENT)
├── reducer/          (inline: workspaceReducer + action types)
├── hooks/            (inline: useAgentCalls, usePacketBus)
├── components/
│   ├── AgentNode
│   ├── PacketLayer (SVG)
│   ├── InspectorPanel
│   ├── WorkflowView
│   └── GoalInput
└── AgentWorkspace    (root component, layout)
```

---

## What This Is NOT

- Not a Moltbook clone — Moltbook is a Reddit-style social posting platform for
  agents acquired by Meta in March 2026. This is a workflow orchestration tool
  inspired by the concept of agent coordination, not by Moltbook's actual UI or
  codebase.
- Not a game — no combat, no scores, no enemies, no lives.
- Not a demo with hardcoded fake reasoning — all agent outputs come from real
  Anthropic API calls, rate-limited and error-handled.
- Not a Phase 2 build — do not implement the memory graph, multi-workflow queue,
  or application registry until all Phase 1 acceptance criteria pass.
