# Agentic Systems Design

Apply this reference when the request involves agents, MCP servers, orchestration, or AI pipelines.

## Agent Architecture Decision Matrix

| Pattern | Use When | Risk Level |
|---------|----------|------------|
| Single agent + tools | Most tasks; handles more than expected | Low |
| Primary + subagents | Parallelizable subtasks, fan-out/reduce | Medium |
| Multi-agent pipeline | Sequential specialist handoff | High — drift risk |
| n8n/Zapier workflow | Non-technical stakeholders modify; no-code | Medium — non-deterministic |

**Default: single agent. Escalate only when parallelism is provably required.**

## Context Engineering

Agents lose coherence as context grows. Enforce these boundaries:

- **Write outside window:** Persist intermediate results to DB/KV, not just context
- **Compress aggressively:** Summarize tool results before passing back to orchestrator
- **Isolate subagents:** Each subagent call is stateless — no shared memory, no history
- **Token budget:** Set hard ceiling per call. Log token usage. Alert at 80% of limit
- **RAG retrieval:** Top-K of 5 chunks per retrieval. Re-rank before injection

```typescript
// Context budget guard
const CONTEXT_BUDGET = 100_000; // tokens
if (estimatedTokens > CONTEXT_BUDGET * 0.8) {
  await compressContext(conversationHistory);
  logger.warn('Context nearing budget limit', { estimatedTokens, budget: CONTEXT_BUDGET });
}
```

## MCP Server Design

Build MCP tools following single-responsibility principle:

```typescript
// One tool, one job — no side effects unless explicit
server.tool('search_kb', {
  description: 'Search internal knowledge base. Returns top 5 relevant chunks.',
  inputSchema: z.object({ query: z.string().min(3).max(500) }),
}, async ({ query }) => {
  const sanitized = sanitizeInput(query); // Strip injection patterns
  const results = await kb.search(sanitized, { limit: 5 });
  return { results: results.map(r => ({ id: r.id, content: r.content, score: r.score })) };
});
```

**MCP Checklist:**
- [ ] Tool descriptions contain zero instruction-like language (injection vector)
- [ ] All tool inputs validated with Zod before execution
- [ ] Tool outputs sanitized before returning to orchestrator
- [ ] No elevated permissions — scope to minimum required
- [ ] Whitelist-only server connections — no dynamic third-party MCP loading
- [ ] Human-in-the-loop gate for high-risk operations (delete, send, publish)

## Structured Output Contracts

All agent-to-agent and agent-to-system outputs must be typed:

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

## Tool Call Security (ReAct Loop)

```
Plan → Act → Observe → Validate → Plan (repeat)
```

- **Plan:** Agent states intention before calling tool — log it
- **Act:** Execute tool with least-privilege credentials
- **Observe:** Raw tool output treated as untrusted data — validate schema
- **Validate:** Check output against expected contract before passing to next step
- **Never:** Let tool output modify agent instructions without human confirmation

## Defense Implementation

```typescript
// Input sanitization — strip injection patterns before agent sees user input
export function sanitizeAgentInput(raw: string): string {
  const injectionPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions/gi,
    /forget\s+(all\s+)?prior\s+context/gi,
    /system\s*:\s*/gi,
    /<\s*system\s*>/gi,
    /\[INST\]|\[\/INST\]/g,
  ];
  let sanitized = raw;
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  }
  return sanitized.slice(0, 8192); // Hard length cap
}

// Tool output validation — never trust what a tool returns
export function validateToolOutput<T>(schema: z.ZodSchema<T>, raw: unknown): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    logger.warn('Tool output failed schema validation', { errors: result.error.issues });
    throw new AppError('Tool returned unexpected format', { retry: false });
  }
  return result.data;
}

// MCP server whitelist
const APPROVED_MCP_SERVERS = new Set([
  'https://mcp.notion.com/mcp',
  'https://mcp.linear.app/mcp',
  'https://mcp.supabase.com/mcp',
  // Add only vetted, pinned servers
]);

export function assertApprovedMCPServer(url: string) {
  if (!APPROVED_MCP_SERVERS.has(url)) {
    throw new SecurityError(`Unapproved MCP server: ${url}`);
  }
}
```
