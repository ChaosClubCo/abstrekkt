# AgentOS — 12-Pass Build Manifest
**Claude Code Prompt Package · SCOPE_MODE: FULL · Stack-locked**

> Feed each pass to a dedicated Claude Code session. Each pass is self-contained with explicit inputs, outputs, and acceptance gates. No pass begins until the prior pass's acceptance criteria are verified.

---

## Stack Declaration (Non-Negotiable)

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node.js LTS | TypeScript strict mode throughout |
| Framework | Next.js 15 (App Router) | RSC default; client components explicit |
| Database | Postgres via Supabase | RLS enforced on every multi-tenant table |
| Auth | Supabase Auth | JWT validation server-side only |
| Agent Framework | MCP + LangGraph | MCP for tool surface; LangGraph for orchestration |
| Queue | BullMQ + Redis (Upstash) | All async agent work goes through queue |
| Vector DB | pgvector (Supabase extension) | Co-located with relational data |
| Observability | Sentry + PostHog + structured JSON logs | traceId on every request |
| CI/CD | GitHub Actions | typecheck → audit → test → deploy gate |
| Edge | Cloudflare Workers | Proxy, rate limiting, residency routing |
| Payments | Stripe | Webhooks validated server-side; no client-side keys |
| Email | Resend | Transactional only |

**Decision priority:** Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness

**Security hard rule:** No API keys, secrets, service_role keys, or DB connection strings in frontend or client-side code. Ever. Flag immediately if a pattern would leak secrets into a bundle.

---

## Monorepo Structure (Before Any Pass Begins)

```
agentos/
├── apps/
│   └── web/                        # Next.js 15 frontend
├── packages/
│   ├── db/                         # Supabase client, types, migrations
│   ├── queue/                      # BullMQ workers and job definitions
│   ├── agents/                     # LangGraph graphs and MCP server
│   ├── ai/                         # LLM routing, prompt templates
│   ├── observability/              # Sentry, PostHog, structured logger
│   └── types/                      # Shared Zod schemas + TypeScript types
├── infra/
│   ├── migrations/                 # Timestamped SQL migrations
│   └── workers/                    # Cloudflare Worker configs
├── scripts/
│   ├── smoke/                      # Per-pass smoke test runners
│   └── seed/                       # Tenant + fixture seed scripts
└── .github/workflows/              # CI pipeline
```

---

## Pass 1 — Mission Core

**What it is:** The execution primitive. Every agent action in the system is a Mission.

**Inputs:** Fresh repo, stack dependencies installed, Supabase project provisioned.

### Schema

```sql
CREATE TABLE missions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id),
  workspace_id UUID REFERENCES workspaces(id),
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','queued','running','paused',
                                   'completed','failed','cancelled')),
  priority     INTEGER NOT NULL DEFAULT 50 CHECK (priority BETWEEN 1 AND 100),
  created_by   UUID NOT NULL REFERENCES users(id),
  assigned_to  UUID REFERENCES users(id),
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON missions
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
```

### Types

```typescript
// packages/types/src/mission.ts
import { z } from 'zod';

export const MissionStatusSchema = z.enum([
  'draft','queued','running','paused','completed','failed','cancelled'
]);

export const MissionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  workspaceId: z.string().uuid().nullable(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).nullable(),
  status: MissionStatusSchema,
  priority: z.number().int().min(1).max(100).default(50),
  createdBy: z.string().uuid(),
  assignedTo: z.string().uuid().nullable(),
  startedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Mission = z.infer<typeof MissionSchema>;
```

### Service

```typescript
// packages/db/src/missions.ts
import { createClient } from './client';
import { MissionSchema, type Mission } from '@agentos/types';

export async function createMission(
  input: Pick<Mission, 'tenantId' | 'workspaceId' | 'title' | 'description' | 'priority' | 'createdBy'>
): Promise<Mission> {
  const client = createClient();
  const { data, error } = await client
    .from('missions')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(`createMission failed: ${error.message}`);
  return MissionSchema.parse(data);
}

export async function updateMissionStatus(
  id: string,
  status: Mission['status'],
  metadata?: Record<string, unknown>
): Promise<Mission> {
  const client = createClient();
  const { data, error } = await client
    .from('missions')
    .update({ status, metadata, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateMissionStatus failed: ${error.message}`);
  return MissionSchema.parse(data);
}
```

### Acceptance Gates

- [ ] RLS blocks cross-tenant reads (verify with two test tenant JWTs)
- [ ] Status transitions are validated (no `completed → running`)
- [ ] `created_at` / `updated_at` auto-populate
- [ ] Zod parse throws on malformed input before DB write
- [ ] Smoke: `npm run smoke:pass1`

---

## Pass 2 — Mission Planning Engine

**What it is:** Takes a mission and decomposes it into an ordered task graph with dependency tracking.

### Schema (extends Pass 1)

```sql
CREATE TABLE mission_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id      UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  parent_task_id  UUID REFERENCES mission_tasks(id),
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','ready','running',
                                      'completed','failed','skipped')),
  agent_type      TEXT,                          -- which agent handles this
  tool_calls      JSONB NOT NULL DEFAULT '[]',   -- planned tool invocations
  dependencies    UUID[] NOT NULL DEFAULT '{}',  -- task IDs that must complete first
  retry_count     INTEGER NOT NULL DEFAULT 0,
  max_retries     INTEGER NOT NULL DEFAULT 3,
  timeout_ms      INTEGER NOT NULL DEFAULT 30000,
  execution_order INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE mission_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON mission_tasks
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
```

### Planning Service

```typescript
// packages/agents/src/planner.ts
import { ChatAnthropic } from '@langchain/anthropic';
import { z } from 'zod';

const TaskPlanSchema = z.object({
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    agentType: z.string(),
    dependencies: z.array(z.string()),
    toolCalls: z.array(z.object({
      tool: z.string(),
      params: z.record(z.unknown()),
    })),
    executionOrder: z.number(),
    timeoutMs: z.number().default(30000),
  })),
});

export type TaskPlan = z.infer<typeof TaskPlanSchema>;

export async function planMission(
  missionId: string,
  description: string,
  tenantId: string,
): Promise<TaskPlan> {
  const model = new ChatAnthropic({
    model: 'claude-sonnet-4-20250514',
    temperature: 0,
  });

  const response = await model.invoke([
    {
      role: 'system',
      content: PLANNING_SYSTEM_PROMPT,  // defined in prompts/planning.ts
    },
    {
      role: 'user',
      content: `Mission: ${description}`,
    },
  ]);

  const raw = JSON.parse(response.content as string);
  return TaskPlanSchema.parse(raw);  // throws on invalid plan
}
```

### Acceptance Gates

- [ ] Planner output validates against `TaskPlanSchema` before persistence
- [ ] Circular dependency detection throws before insertion
- [ ] Tasks with unmet dependencies stay in `pending`, not `ready`
- [ ] Smoke: `npm run smoke:pass2`

---

## Pass 3 — Queue & Resource Allocation

**What it is:** BullMQ-backed job queue. All agent execution goes through here — no direct execution from API routes.

### Queue Worker

```typescript
// packages/queue/src/workers/mission.worker.ts
import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { logger } from '@agentos/observability';
import { executeTask } from '@agentos/agents';

const connection = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const missionWorker = new Worker<MissionJobPayload>(
  'missions',
  async (job: Job<MissionJobPayload>) => {
    const { taskId, missionId, tenantId } = job.data;
    const traceId = `${missionId}:${taskId}:${job.id}`;

    logger.info({ traceId, taskId, event: 'task.start' });

    try {
      const result = await executeTask({ taskId, missionId, tenantId, traceId });
      logger.info({ traceId, taskId, event: 'task.complete', result });
      return result;
    } catch (err) {
      logger.error({ traceId, taskId, event: 'task.failed', error: String(err) });
      throw err;  // BullMQ handles retry
    }
  },
  {
    connection,
    concurrency: 10,
    limiter: { max: 100, duration: 60_000 },  // 100 jobs/min per queue
  }
);

missionWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, event: 'worker.failed', error: String(err) });
});
```

### Acceptance Gates

- [ ] Jobs retry up to `max_retries` with exponential backoff
- [ ] Failed-past-retries move to dead letter queue, not silently dropped
- [ ] Concurrency limit tested (11th concurrent job waits, doesn't crash)
- [ ] Rate limiter tested (101st job in 60s is deferred, not rejected)
- [ ] Smoke: `npm run smoke:pass3`

---

## Pass 4 — Model Routing

**What it is:** Routes LLM calls to the right model based on task complexity, cost budget, and capability requirements.

### Router

```typescript
// packages/ai/src/router.ts
import { z } from 'zod';

const RouteDecisionSchema = z.object({
  model: z.enum(['claude-opus-4', 'claude-sonnet-4', 'claude-haiku-4']),
  maxTokens: z.number(),
  temperature: z.number().min(0).max(1),
  rationale: z.string(),
});

export type RouteDecision = z.infer<typeof RouteDecisionSchema>;

const ROUTING_TABLE: Record<string, RouteDecision> = {
  planning:     { model: 'claude-sonnet-4', maxTokens: 4096, temperature: 0,   rationale: 'planning requires structured output' },
  execution:    { model: 'claude-sonnet-4', maxTokens: 8192, temperature: 0.1, rationale: 'execution needs reliability' },
  evaluation:   { model: 'claude-opus-4',   maxTokens: 2048, temperature: 0,   rationale: 'eval needs highest accuracy' },
  summarization:{ model: 'claude-haiku-4',  maxTokens: 1024, temperature: 0,   rationale: 'summarization is cost-sensitive' },
  recovery:     { model: 'claude-sonnet-4', maxTokens: 4096, temperature: 0,   rationale: 'recovery needs structured reasoning' },
};

export function routeModel(taskType: string, overrides?: Partial<RouteDecision>): RouteDecision {
  const base = ROUTING_TABLE[taskType] ?? ROUTING_TABLE['execution'];
  return RouteDecisionSchema.parse({ ...base, ...overrides });
}
```

### Acceptance Gates

- [ ] Unknown task type falls back to `execution` profile, not a throw
- [ ] Token budget is logged per call for cost tracking
- [ ] Override params validate against schema before use
- [ ] Smoke: `npm run smoke:pass4`

---

## Pass 5 — Execution Engine

**What it is:** The LangGraph runtime that executes task graphs. Agents have capability tokens — they cannot call tools they haven't been explicitly granted.

### Graph Structure

```typescript
// packages/agents/src/graphs/mission.graph.ts
import { StateGraph, END } from '@langchain/langgraph';
import { MissionState } from './state';
import { plannerNode } from './nodes/planner';
import { executorNode } from './nodes/executor';
import { evaluatorNode } from './nodes/evaluator';
import { repairNode } from './nodes/repair';  // Pass 6 dependency

const graph = new StateGraph<MissionState>({
  channels: {
    taskQueue: { value: (a, b) => b ?? a, default: () => [] },
    completedTasks: { value: (a, b) => b ?? a, default: () => [] },
    failedTasks: { value: (a, b) => b ?? a, default: () => [] },
    currentTask: { value: (a, b) => b ?? a, default: () => null },
    traceId: { value: (a, b) => b ?? a, default: () => '' },
  },
});

graph.addNode('planner', plannerNode);
graph.addNode('executor', executorNode);
graph.addNode('evaluator', evaluatorNode);
graph.addNode('repair', repairNode);

graph.addEdge('planner', 'executor');
graph.addConditionalEdges('executor', (state) =>
  state.currentTask?.status === 'failed' ? 'repair' : 'evaluator'
);
graph.addConditionalEdges('evaluator', (state) =>
  state.taskQueue.length > 0 ? 'executor' : END
);
graph.addEdge('repair', 'executor');

graph.setEntryPoint('planner');

export const missionGraph = graph.compile();
```

### Capability Token Enforcement

```typescript
// packages/agents/src/security/capability-tokens.ts
const AGENT_CAPABILITIES: Record<string, Set<string>> = {
  planning_agent:   new Set(['read_mission', 'write_tasks']),
  execution_agent:  new Set(['read_tasks', 'write_results', 'call_tools']),
  evaluation_agent: new Set(['read_results', 'write_evaluation']),
};

export function assertCapability(agentType: string, capability: string): void {
  const caps = AGENT_CAPABILITIES[agentType];
  if (!caps?.has(capability)) {
    throw new Error(
      `SECURITY: Agent "${agentType}" attempted unauthorized capability "${capability}"`
    );
  }
}
```

### Acceptance Gates

- [ ] Agent attempting unauthorized capability throws, logs, and halts execution
- [ ] Tool outputs are validated against schema before passing back to graph state
- [ ] Execution of a task graph with a deliberate mid-graph failure routes to repair node
- [ ] TraceId propagates through all node executions
- [ ] Smoke: `npm run smoke:pass5`

---

## Pass 6 — Self-Repair Engine

**What it is:** When a task fails, the repair node analyzes the failure, generates a recovery strategy, retries with modified parameters, or escalates to human review.

### Repair Logic

```typescript
// packages/agents/src/nodes/repair.ts
import { ChatAnthropic } from '@langchain/anthropic';
import { RepairStrategySchema } from '@agentos/types';
import { createAuditEvent } from '@agentos/db';

export async function repairNode(state: MissionState): Promise<Partial<MissionState>> {
  const { currentTask, traceId } = state;
  if (!currentTask) return state;

  const model = new ChatAnthropic({ model: 'claude-sonnet-4-20250514', temperature: 0 });

  const response = await model.invoke([
    { role: 'system', content: REPAIR_SYSTEM_PROMPT },
    { role: 'user',   content: JSON.stringify({ task: currentTask, error: currentTask.lastError }) },
  ]);

  const strategy = RepairStrategySchema.parse(JSON.parse(response.content as string));

  await createAuditEvent({
    tenantId: currentTask.tenantId,
    eventType: 'task.repair_attempted',
    payload: { taskId: currentTask.id, strategy, traceId },
  });

  if (strategy.action === 'escalate_human') {
    // Write to approval queue (Pass 8 dependency); halt this branch
    return { ...state, currentTask: { ...currentTask, status: 'paused' } };
  }

  // Retry with modified params
  return {
    ...state,
    currentTask: {
      ...currentTask,
      status: 'ready',
      toolCalls: strategy.modifiedToolCalls ?? currentTask.toolCalls,
      retryCount: currentTask.retryCount + 1,
    },
  };
}
```

### Acceptance Gates

- [ ] Repair attempts are always audit-logged
- [ ] `max_retries` exceeded → escalate_human, not infinite loop
- [ ] Repair strategy validates against schema before execution
- [ ] Human escalation creates approval queue entry (stub for Pass 8, verified in Pass 8)
- [ ] Smoke: `npm run smoke:pass6`

---

## Pass 7 — Executive Command Center

**What it is:** The operational dashboard layer. Aggregated views of mission health, queue depth, agent utilization, cost, and SLA attainment. Read-heavy; no writes to mission state from this layer.

### API Routes

```
GET  /api/dashboard/overview          → tenant-scoped summary
GET  /api/dashboard/missions          → paginated mission list with status filters
GET  /api/dashboard/queue-depth       → BullMQ queue stats per tenant
GET  /api/dashboard/cost              → LLM spend aggregated by day/model/agent
GET  /api/dashboard/sla               → SLA attainment by mission type
GET  /api/dashboard/anomalies         → from Pass 11 intelligence layer
```

### Key Implementation Rules

- All routes validate tenant JWT before query
- No raw SQL — all queries through typed Supabase client
- Response shapes validated with Zod before returning to client
- Cost data sourced from `llm_usage_events` table (Pass 7 migration adds this)
- Cache dashboard aggregates in Redis with 30s TTL; invalidate on mission status change

### Acceptance Gates

- [ ] Cross-tenant data leak test: user A cannot see user B's missions
- [ ] Cost aggregates within 5% of actual Anthropic API spend (validated monthly)
- [ ] Queue depth reflects live BullMQ state, not stale DB snapshot
- [ ] Smoke: `npm run smoke:pass7`

---

## Pass 8 — Multi-Tenant Governance & Approval

**What it is:** Tenant isolation, approval workflows, RBAC, and policy enforcement. The governance layer that every other pass must respect.

### Schema

```sql
CREATE TABLE approval_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  subject_type    TEXT NOT NULL,   -- 'task', 'mission', 'package_install', etc.
  subject_id      UUID NOT NULL,
  requested_by    UUID REFERENCES users(id),
  assigned_to     UUID REFERENCES users(id),
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','expired')),
  policy_id       UUID REFERENCES governance_policies(id),
  decision_by     UUID REFERENCES users(id),
  decision_at     TIMESTAMPTZ,
  reason          TEXT,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON approval_queue
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE TABLE governance_policies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  name          TEXT NOT NULL,
  policy_type   TEXT NOT NULL,  -- 'approval', 'rate_limit', 'capability_restriction'
  rules         JSONB NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### RBAC Model

```typescript
// packages/types/src/rbac.ts
export const ROLES = ['owner', 'admin', 'operator', 'viewer'] as const;
export type Role = typeof ROLES[number];

export const ROLE_PERMISSIONS: Record<Role, Set<string>> = {
  owner:    new Set(['*']),
  admin:    new Set(['mission.*', 'approval.*', 'policy.read', 'user.manage']),
  operator: new Set(['mission.create', 'mission.read', 'approval.request']),
  viewer:   new Set(['mission.read', 'dashboard.read']),
};

export function can(role: Role, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.has('*') || perms.has(permission);
}
```

### Acceptance Gates

- [ ] Operator cannot approve their own escalation
- [ ] Expired approvals auto-reject via cron job
- [ ] Policy rules validate with Zod before persistence
- [ ] `can()` is tested exhaustively for each role/permission pair
- [ ] Smoke: `npm run smoke:pass8`

---

## Pass 9 — Economic Engine

**What it is:** Cost tracking, billing, ROI calculation, and LLM usage attribution. Every model call writes a usage event; the economic engine aggregates, bills, and reports.

### Schema

```sql
CREATE TABLE llm_usage_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id),
  mission_id   UUID REFERENCES missions(id),
  task_id      UUID REFERENCES mission_tasks(id),
  model        TEXT NOT NULL,
  input_tokens  INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd     NUMERIC(10, 6) NOT NULL,
  agent_type   TEXT,
  trace_id     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Aggregate view for dashboard (materialized, refreshed every 5 min)
CREATE MATERIALIZED VIEW tenant_cost_daily AS
SELECT
  tenant_id,
  date_trunc('day', created_at) AS day,
  model,
  SUM(input_tokens)  AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(cost_usd)      AS total_cost_usd
FROM llm_usage_events
GROUP BY tenant_id, day, model;
```

### Cost Tracking Middleware

```typescript
// packages/ai/src/middleware/cost-tracker.ts
import { createUsageEvent } from '@agentos/db';

export function withCostTracking<T>(
  handler: () => Promise<{ usage: { input_tokens: number; output_tokens: number }; result: T }>,
  context: { tenantId: string; missionId?: string; taskId?: string; model: string; agentType: string; traceId: string }
): Promise<T> {
  return handler().then(async ({ usage, result }) => {
    const costUsd = calculateCost(context.model, usage.input_tokens, usage.output_tokens);
    await createUsageEvent({ ...context, ...usage, costUsd });
    return result;
  });
}

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  // Prices in USD per 1M tokens — update when Anthropic pricing changes
  const PRICES: Record<string, { input: number; output: number }> = {
    'claude-opus-4':    { input: 15.00, output: 75.00 },
    'claude-sonnet-4':  { input: 3.00,  output: 15.00 },
    'claude-haiku-4':   { input: 0.25,  output: 1.25  },
  };
  const p = PRICES[model] ?? PRICES['claude-sonnet-4'];
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}
```

### Acceptance Gates

- [ ] Every LLM call writes a usage event (verify with DB assertion in test)
- [ ] Cost aggregates match sum of raw events (no double-counting)
- [ ] Materialized view refreshes on schedule without locking writes
- [ ] Smoke: `npm run smoke:pass9`

---

## Pass 10 — Marketplace

**What it is:** Installable agent/workflow/playbook packages. Publishers submit packages; governance review gates them; tenants install them. No marketplace package can bypass tenant governance.

### Core Rules (Non-Negotiable)

1. Packages cannot escalate their own capability tokens
2. Trust scores are computed from real installation + evaluation data — never seeded with fake values
3. All marketplace actions (publish, install, uninstall, approve, reject) write audit events
4. Package installation validates dependency tree before writing any DB row
5. Revenue events are immutable once written

### Key Schema (abbreviated — generate full in build session)

```sql
CREATE TABLE marketplace_packages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id    UUID NOT NULL REFERENCES marketplace_publishers(id),
  package_type    TEXT NOT NULL CHECK (package_type IN (
                    'agent','workflow','playbook','tool_pack',
                    'template_pack','knowledge_pack','evaluation_pack')),
  title           TEXT NOT NULL,
  current_version TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','submitted','under_review',
                                      'approved','rejected','deprecated')),
  trust_score     INTEGER CHECK (trust_score BETWEEN 0 AND 100),
  install_count   INTEGER NOT NULL DEFAULT 0,
  license_type    TEXT NOT NULL,
  pricing_model   TEXT NOT NULL,
  visibility      TEXT NOT NULL DEFAULT 'private',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Trust Score Computation

```typescript
// packages/db/src/marketplace/trust.ts
export function computeTrustScore(metrics: {
  installSuccessRate: number;   // 0–1
  evaluatorPassRate: number;    // 0–1
  issueReportCount: number;     // raw count (higher = lower score)
  updateFrequencyDays: number;  // avg days between updates
  publisherReputationScore: number; // 0–100
}): number {
  const score =
    metrics.installSuccessRate    * 35 +
    metrics.evaluatorPassRate     * 25 +
    Math.max(0, 1 - metrics.issueReportCount / 10) * 15 +
    Math.max(0, 1 - metrics.updateFrequencyDays / 180) * 10 +
    (metrics.publisherReputationScore / 100) * 15;

  return Math.round(Math.min(100, Math.max(0, score)));
}
```

### Acceptance Gates

- [ ] Package with `status !== 'approved'` cannot be installed
- [ ] Trust score of a fresh package is `null`, not `0` (avoids false low-score signal)
- [ ] Governance policy inheritance verified: package cannot override tenant rate limits
- [ ] Circular dependency in package deps throws before any installation rows are written
- [ ] Smoke: `npm run smoke:pass10`

---

## Pass 11 — Continuous Learning & Intelligence Network

**What it is:** Observes every mission, task, evaluation, and economic outcome. Detects patterns. Generates evidence-backed recommendations. Does NOT autonomously modify policies, permissions, or agent behavior.

### Core Rules (Non-Negotiable)

1. Every recommendation requires a `confidence_score` (0–1) and an `evidence_chain` (array of observation IDs)
2. No recommendation executes automatically — all require approval (Pass 8 dependency)
3. Predictions are labeled with confidence and horizon; never presented as facts
4. Knowledge evolution candidates require human review before publication
5. No fabricated benchmark data — all benchmarks sourced from real platform observations

### Intelligence Observation Writer

```typescript
// packages/db/src/intelligence/observations.ts
import { z } from 'zod';

export const ObservationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  category: z.enum([
    'mission_execution','planning','routing','evaluation',
    'approval','recovery','economics','utilization'
  ]),
  sourceId: z.string().uuid(),   // missionId, taskId, etc.
  sourceType: z.string(),
  payload: z.record(z.unknown()),
  observedAt: z.date(),
});

export async function writeObservation(
  input: Omit<z.infer<typeof ObservationSchema>, 'id'>
): Promise<void> {
  // Fire-and-forget; never block the hot path
  queueMicrotask(async () => {
    const client = createClient();
    await client.from('intelligence_observations').insert(ObservationSchema.parse({ ...input, id: crypto.randomUUID() }));
  });
}
```

### Acceptance Gates

- [ ] Observation writes are non-blocking (hot path p95 unaffected)
- [ ] Recommendation without evidence chain is rejected at service boundary
- [ ] Pattern detection job runs on schedule, not inline with request path
- [ ] Anomaly alerts surface in Executive Command Center (Pass 7 integration)
- [ ] Smoke: `npm run smoke:pass11`

---

## Pass 12 — Global Federation / Agent Cloud

**What it is:** Multi-cluster coordination, federated marketplace, anonymized benchmark sharing, and sovereign deployment support. Federation is **opt-in only** — a cluster that hasn't explicitly joined a federation cannot receive or send federated data.

### Core Rules (Non-Negotiable)

1. No tenant data, secrets, memory contents, audit records, or Company Brain content is ever shared across federation boundaries
2. All federated intelligence data is anonymized and aggregated before transmission — no per-tenant identifiers
3. Workload transfers require a signed contract with residency and compliance validation before execution begins
4. Cluster isolation (`status: 'isolated'`) immediately halts all federation I/O — no grace period
5. Federation actions are signed (HMAC-SHA256) and verified on receipt

### Cluster Registration

```typescript
// packages/db/src/federation/clusters.ts
import { z } from 'zod';

export const FederationClusterSchema = z.object({
  id: z.string().uuid(),
  clusterName: z.string().min(1).max(100),
  clusterType: z.enum(['primary','regional','sovereign','enterprise','partner']),
  region: z.string(),
  complianceProfile: z.array(z.string()), // ['GDPR','SOC2','HIPAA']
  healthStatus: z.enum(['provisioning','active','degraded','isolated','suspended','retired']),
  federationStatus: z.enum(['none','limited','verified','trusted','strategic']),
  publicKey: z.string(),  // For signing verification
  createdAt: z.date(),
});

export async function registerCluster(
  input: Omit<z.infer<typeof FederationClusterSchema>, 'id' | 'createdAt'>
): Promise<z.infer<typeof FederationClusterSchema>> {
  // Governance approval required (Pass 8 dependency)
  await createApprovalRequest({ subjectType: 'cluster_registration', payload: input });
  throw new Error('PENDING_APPROVAL: Cluster registration requires governance review');
}
```

### Acceptance Gates

- [ ] Unapproved cluster registration returns `PENDING_APPROVAL`, not a partial write
- [ ] Federation link between two clusters requires both to have `federationStatus !== 'none'`
- [ ] Intelligence export strips all tenant-identifiable fields before transmission (verified with fixture test)
- [ ] `isolateCluster()` halts all federation I/O within one job cycle
- [ ] Workload transfer without valid signed contract throws `INVALID_CONTRACT`
- [ ] Smoke: `npm run smoke:pass12`

---

## CI Pipeline (Applies to All Passes)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run typecheck          # tsc --noEmit strict
      - run: npm audit --audit-level=high
      - run: npm run lint
      - run: npm run test               # vitest
      - run: npm run test:integration   # requires TEST_SUPABASE_URL in secrets
      - name: Smoke tests
        run: npm run smoke:all
        env:
          SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
          REDIS_URL: ${{ secrets.TEST_REDIS_URL }}
```

---

## Cross-Pass Security Checklist

Before shipping any pass, verify:

- [ ] No `console.log` in production paths (structured logger only)
- [ ] No hardcoded secrets, connection strings, or API keys anywhere in source
- [ ] All new tables have RLS enabled and at minimum a tenant isolation policy
- [ ] All API routes validate auth before touching DB
- [ ] All inputs hitting DB or LLM pass through Zod schema first
- [ ] `npm audit` passes at `--audit-level=high`
- [ ] OWASP Top 10 for LLM Apps reviewed for any new agent surface

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS**
- [GENERATED] LangGraph is the appropriate orchestration layer for this stack given its native TypeScript support and compatibility with Anthropic's SDK. Alternative: raw state machines in plain TypeScript if LangGraph's abstraction overhead is unacceptable.
- [GENERATED] BullMQ + Upstash Redis is the correct queue choice for this workload profile (async, retry-heavy, tenant-isolated). Counterexample: if the execution volume is low (<100 jobs/day), a Postgres-backed queue (pg-boss) eliminates the Redis dependency.
- [SOURCED] Supabase RLS enforces tenant isolation at the database level, reducing application-layer responsibility. Source: Supabase RLS docs.
- [GENERATED] The 12-pass sequence is ordered by dependency (each pass depends only on passes before it). Any pass attempted out of order will encounter undefined dependencies.

**COUNTEREXAMPLES**
- A focused single-domain AI product (e.g., a code review bot) does not need Passes 10–12. Stop after Pass 7–8 and ship.
- Passes 11 and 12 add significant operational complexity. If the team is <5 engineers, defer until core passes are stable in production.

**!CONTRADICTIONS**
- Pass 6 (Self-Repair) adds an approval escalation path that depends on Pass 8 (Governance), but Pass 8 comes after Pass 6 in sequence. **Resolution:** Pass 6 stubs the approval call with a queue write; Pass 8 implements the reader. Integration test runs after Pass 8.
- Federation (Pass 12) cannot truly be validated without at least two running clusters, which requires infrastructure beyond what a single dev environment provides. **Resolution:** Federation contract and trust checks are unit-tested with mocked cluster stubs; true multi-cluster integration is a staging environment concern.

---

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **Pricing drift:** The cost calculation table in Pass 9 will become stale when Anthropic changes pricing. Needs a config-driven price table or API-sourced pricing, not hardcoded constants.
- **Vector DB indexing strategy:** pgvector is chosen for co-location simplicity, but HNSW index tuning for >1M embeddings is not covered here — needs a separate spike.
- **Sovereign deployment connectivity:** Pass 12 assumes eventual internet connectivity for sync. Truly air-gapped deployments need a manual sync mechanism not specified here.
- **Marketplace revenue/payout rails:** Pass 10 defines the revenue event model but does not implement Stripe Connect or equivalent payout infrastructure. That's a separate buildout.
- **LangGraph version lock:** LangGraph's API has changed significantly between minor versions. Pin the version in `package.json` and add a renovation bot rule to treat LangGraph upgrades as breaking changes requiring regression testing.
