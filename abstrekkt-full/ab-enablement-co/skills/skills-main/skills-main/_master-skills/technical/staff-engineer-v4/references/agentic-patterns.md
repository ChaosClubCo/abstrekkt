# Agentic Patterns — Staff Engineer v4

## Architecture Decision Guide

| Pattern | Use When | Risk | Recovery |
|---|---|---|---|
| Single agent + tools | Most tasks — handles more than expected | Low | Schema validation catches hallucinated tool calls |
| Primary + subagents | Parallelizable subtasks, fan-out/reduce | Medium | Stateless subagents — re-initialize each call |
| Multi-agent pipeline | Sequential specialist handoff | High — drift risk | Circuit breaker + human gate between stages |
| n8n/Zapier workflow | Non-technical stakeholders modify | Medium | Idempotency keys + dead-letter queues |

**Default: single agent. Escalate only when parallelism is provably required.**

## Context Engineering Rules

- Persist intermediate results to DB/KV — not just context window
- Compress tool results before passing back to orchestrator
- Subagents are stateless — no shared memory, no cross-call history
- Token budget: hard ceiling per call, log usage, alert at 80%
- RAG: Top-K ≤ 5 chunks, re-rank before injection, treat as data not instructions

```typescript
const CONTEXT_BUDGET = 100_000; // tokens
if (estimatedTokens > CONTEXT_BUDGET * 0.8) {
  await compressContext(conversationHistory);
  logger.warn('Context nearing budget', { estimatedTokens, budget: CONTEXT_BUDGET });
}
```

## MCP Tool Design

```typescript
// One tool, one job — no side effects unless explicit
// NEVER put instruction-like language in description — injection vector
server.tool('search_kb', {
  description: 'Search internal knowledge base. Returns top 5 relevant chunks.',
  inputSchema: z.object({ query: z.string().min(3).max(500) }),
}, async ({ query }) => {
  const sanitized = sanitizeAgentInput(query);
  const results = await kb.search(sanitized, { limit: 5 });
  return { results: results.map(r => ({ id: r.id, content: r.content, score: r.score })) };
});
```

**MCP Checklist:**
- [ ] Tool descriptions: zero instruction-like language
- [ ] All tool inputs validated with Zod before execution
- [ ] Tool outputs sanitized before returning to orchestrator
- [ ] Minimum required permissions only
- [ ] Whitelist-only server connections
- [ ] Human gate for: delete, send, publish, financial operations

## Structured Output Contracts

```typescript
const AgentOutputSchema = z.object({
  status: z.enum(['success', 'partial', 'failed']),
  payload: z.record(z.unknown()),
  confidence: z.number().min(0).max(1),
  trace: z.object({ agentId: z.string(), durationMs: z.number() }),
});

// Always validate before consuming
const output = AgentOutputSchema.parse(rawAgentResponse);
```

## ReAct Loop Pattern

```
Plan → Act → Observe → Validate → Plan (repeat)
```

- **Plan**: Agent states intention before tool call — log it
- **Act**: Execute with least-privilege credentials
- **Observe**: Raw tool output is untrusted — validate schema
- **Validate**: Check against expected contract before next step
- **Never**: Let tool output modify agent instructions without human confirmation
