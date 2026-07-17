# Observability Pack

Required for STANDARD and FULL scope modes. Non-negotiable.

## Core Implementation

```typescript
// observability.ts — wire into every request
import * as Sentry from '@sentry/node';
import PostHog from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY!);

export function initTracing(req: Request): TraceContext {
  const traceId = crypto.randomUUID();
  Sentry.setContext('request', { traceId, path: req.url });
  return { traceId, startedAt: Date.now() };
}

export function captureAgentEvent(event: string, props: Record<string, unknown>) {
  posthog.capture({ distinctId: props.userId as string, event, properties: props });
}

export function flushOnExit() {
  return posthog.shutdown();
}
```

## Observability Checklist

- [ ] Every request has a `traceId` (propagated through all services + agent calls)
- [ ] Sentry: errors + agent failures with context (userId, traceId, agentId)
- [ ] PostHog: user events + agent completions + tool call counts
- [ ] Structured logging: JSON, never plain text
- [ ] LLM token usage logged per call (model, promptTokens, completionTokens, cost)
- [ ] Latency tracked at: API entry, DB query, agent call, tool execution
- [ ] Alert thresholds: p95 latency >500ms, error rate >1%, token burn >$X/day

## LLM Cost Tracking Pattern

```typescript
export function logLLMUsage(params: {
  model: string;
  promptTokens: number;
  completionTokens: number;
  durationMs: number;
  traceId: string;
}) {
  const costPerMToken: Record<string, { input: number; output: number }> = {
    'claude-sonnet-4-6': { input: 3.0, output: 15.0 },
    'claude-haiku-4-5': { input: 0.80, output: 4.0 },
    'claude-opus-4-6': { input: 15.0, output: 75.0 },
  };

  const rates = costPerMToken[params.model] ?? { input: 5.0, output: 15.0 };
  const cost = (params.promptTokens / 1_000_000) * rates.input
             + (params.completionTokens / 1_000_000) * rates.output;

  logger.info('llm_usage', {
    ...params,
    costUSD: cost.toFixed(6),
    level: 'metric',
  });

  posthog.capture({
    distinctId: 'system',
    event: 'llm_call',
    properties: { ...params, costUSD: cost },
  });
}
```

## Alert Configuration

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| p95 latency | >300ms | >500ms | Profile slow endpoints |
| Error rate | >0.5% | >1% | Page on-call |
| LLM token burn | >$50/day | >$100/day | Audit agent loops |
| Agent loop iterations | >10/task | >20/task | Force termination review |
| Context window usage | >80% | >95% | Trigger compression |
