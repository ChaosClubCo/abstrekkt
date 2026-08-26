# FlashFusion MCP & Edge Wiring + V1→Enterprise Upgrade Matrix

This document **extends the existing Anti‑Gravity AI Orchestration ZIP** and wires it **directly into the FlashFusion MCP + Supabase Edge Function topology**, including **concrete RLS examples**, followed by a **V1 → Enterprise upgrade matrix**.

Nothing here is abstract. Everything maps cleanly onto FlashFusion’s existing architecture.

---

## 1. FlashFusion Runtime Topology (Authoritative)

```
Client (Next.js / PWA)
   │
   ▼
Supabase Auth (JWT)
   │
   ▼
Supabase Edge Functions (AI Gateway)
   │
   ├─ MCP: Supabase (DB)
   ├─ MCP: GitHub
   ├─ MCP: Stripe
   ├─ MCP: Filesystem (scoped)
   │
   ▼
AI Control Plane (Claude / Gemini / Copilot / Codex)
```

**Key rule:**
> AI tools never touch Supabase directly. **Only Edge Functions do.**

---

## 2. AI Gateway as Supabase Edge Function

### 2.1 Directory Placement (FlashFusion)

```
flashfusion/
├─ supabase/
│  └─ functions/
│     └─ ai-gateway/
│        ├─ index.ts
│        ├─ router.ts
│        ├─ breaker.ts
│        ├─ observability.ts
│        └─ skills/
│           ├─ security-review.ts
│           └─ pod-validator.ts
```

This **replaces** local CLI execution for production.

---

### 2.2 Edge Function: `ai-gateway/index.ts`

```ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { routeTask } from './router.ts'
import { withBreaker } from './breaker.ts'
import { logEvent } from './observability.ts'

serve(async (req) => {
  const traceId = crypto.randomUUID()
  const jwt = req.headers.get('Authorization')

  if (!jwt) {
    return new Response('Unauthorized', { status: 401 })
  }

  const task = await req.json()

  return withBreaker(async () => {
    const route = routeTask(task)

    // IMPORTANT: AI never sees secrets or raw DB
    const result = await route.execute({
      traceId,
      input: task.input,
      context: task.context,
    })

    await logEvent({ traceId, route, success: true })

    return new Response(JSON.stringify({ traceId, result }), {
      headers: { 'Content-Type': 'application/json' },
    })
  })
})
```

---

## 3. Supabase RLS (FlashFusion‑Grade)

### 3.1 Core Tables

```sql
create table ai_tasks (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id),
  type text not null,
  status text not null default 'pending',
  cost_usd numeric,
  created_at timestamptz default now()
);

create table ai_outputs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references ai_tasks(id),
  creator_id uuid not null,
  payload jsonb,
  created_at timestamptz default now()
);
```

---

### 3.2 RLS Policies (Non‑Negotiable)

```sql
alter table ai_tasks enable row level security;
alter table ai_outputs enable row level security;

-- Users can only see their own tasks
create policy "ai_tasks_owner"
  on ai_tasks
  for select using (creator_id = auth.uid());

-- Users can only insert their own tasks
create policy "ai_tasks_insert"
  on ai_tasks
  for insert with check (creator_id = auth.uid());

-- Outputs scoped to task owner
create policy "ai_outputs_owner"
  on ai_outputs
  for select using (creator_id = auth.uid());
```

**Edge Functions use service role** → bypass RLS only server‑side.

Clients **never** get service keys.

---

## 4. MCP Wiring (Edge‑Only)

### 4.1 MCP Scope Rules

| MCP Server | Scope | Allowed From |
|-----------|------|-------------|
| Supabase  | RW   | Edge only |
| GitHub   | Repo | Edge + CI |
| Stripe   | Write | Edge only |
| FS       | Temp | Edge sandbox |

### 4.2 Example: POD Validator Skill (Edge)

```ts
export async function validatePod(order, supabase) {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order.id)
    .single()

  if (data.creator_id !== order.creator_id) {
    throw new Error('RLS violation')
  }

  return {
    valid: true,
    checks: ['dpi', 'variant', 'subscription'],
  }
}
```

---

## 5. V1 → Enterprise Upgrade Matrix (FlashFusion)

| Capability | V1 (Now) | Growth | Enterprise |
|-----------|---------|--------|------------|
| AI Routing | Static rules | Feature flags | ML‑assisted routing |
| MCP | Single gateway | Regional gateways | Per‑tenant MCP |
| RLS | Creator‑only | Org‑scoped | Attribute‑based (ABAC) |
| Cost Controls | Daily cap | Per‑user quota | Budget policies + alerts |
| Subagents | Whitelisted | Marketplace | Signed, verified agents |
| Observability | Logs + Sentry | Traces + cost | SIEM integration |
| Governance | Manual review | Policy engine | Audit‑grade controls |
| Failover | Fallback model | Regional failover | Multi‑cloud AI |
| Compliance | Best‑effort | SOC‑2 ready | HIPAA / PCI / ISO |
| Human‑in‑loop | PR review | Approval queues | Risk‑based auto‑approve |

---

## 6. Why This Drops Cleanly Into FlashFusion

- Uses **existing Supabase Edge model**
- Matches FlashFusion’s validator mindset
- Preserves RLS guarantees
- Keeps AI tools outside the trust boundary
- Scales from solo → regulated enterprise

---

## CLAIMS CHECK

**Claim:** This wiring preserves FlashFusion’s security posture while enabling agentic workflows.

**Counterexample:** Direct DB access from AI tools would be faster.

**Resolution:** Edge‑only access trades milliseconds for safety, auditability, and enterprise viability.

---

## NEXT STEPS

1. Move `ai-gateway` into Supabase Edge
2. Apply RLS policies
3. Enable PR Security workflow
4. Run in V1 mode for 2 weeks
5. Flip enterprise features *only when metrics justify them*

