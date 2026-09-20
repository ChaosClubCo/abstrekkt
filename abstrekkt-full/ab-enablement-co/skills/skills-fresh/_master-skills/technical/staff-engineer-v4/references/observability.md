# Observability — Staff Engineer v4

## Core Setup

```typescript
// src/lib/observability.ts
import * as Sentry from '@sentry/node';
import PostHog from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY!);

export function initTracing(req: Request): TraceContext {
  const traceId = crypto.randomUUID();
  Sentry.setContext('request', { traceId, path: req.url });
  return { traceId, startedAt: Date.now() };
}

export function trackLLMCall(props: {
  model: string; promptTokens: number; completionTokens: number;
  durationMs: number; agentId?: string;
}) {
  posthog.capture({
    distinctId: props.agentId ?? 'system',
    event: 'llm_call',
    properties: { ...props, costEstimate: estimateCost(props) },
  });
}

export function flushOnExit() { return posthog.shutdown(); }
```

## Required Events

| Event | When | Required Properties |
|---|---|---|
| `user_authenticated` | Successful login | userId, method, durationMs |
| `agent_started` | Agent loop begins | agentId, taskType, userId, traceId |
| `tool_called` | Each MCP/tool invocation | toolName, agentId, durationMs, success |
| `llm_call` | Each model API call | model, promptTokens, completionTokens, costEstimate |
| `agent_completed` | Agent loop finishes | agentId, status, totalTokens, totalCost |
| `agent_failed` | Agent loop errors | agentId, errorCode, cause, traceId |
| `skill_invoked` | Claude skill activated | skillName, userId, outcomeTag |

## Checklist

- [ ] Every request has a `traceId` propagated through all services + agent calls
- [ ] Sentry: errors + agent failures with `{ userId, traceId, agentId }` context
- [ ] PostHog: all required events above wired
- [ ] LLM token usage logged per call with cost estimate
- [ ] Structured logging: JSON, always `{ traceId, userId, timestamp }`
- [ ] Alert thresholds: p95 latency >500ms, error rate >1%, token burn >$X/day

## Cost Estimation

```typescript
const MODEL_COSTS_PER_1K = {
  'claude-opus-4-6':           { input: 0.015,   output: 0.075   },
  'claude-sonnet-4-6':         { input: 0.003,   output: 0.015   },
  'claude-haiku-4-5-20251001': { input: 0.00025, output: 0.00125 },
};

function estimateCost(props: { model: string; promptTokens: number; completionTokens: number }) {
  const rates = MODEL_COSTS_PER_1K[props.model];
  if (!rates) return 0;
  return (props.promptTokens / 1000) * rates.input
       + (props.completionTokens / 1000) * rates.output;
}
```

## Alert Thresholds

```
p95 API latency > 500ms         → Teams alert
Error rate > 1%                  → PagerDuty
Token burn > $50/day             → Teams warning
Token burn > $200/day            → PagerDuty
Agent failure rate > 5%          → Teams alert
Queue depth > 100 (if async)     → Teams warning
```
