# Security Checklist — Staff Engineer v4

## Mandatory Gates (Apply to Every Build)

- [ ] All inputs validated with Zod on every entry point — never trust external, user, or agent-returned data
- [ ] Auth check on every protected route — no implicit trust, no "it's internal so it's fine"
- [ ] Parameterized queries only — no string concatenation into SQL
- [ ] Rate limiting on all public + agent-callable endpoints
- [ ] CORS configured for explicit allowed origins only
- [ ] XSS prevention — sanitize all outputs rendered in UI; never `dangerouslySetInnerHTML` from user data
- [ ] Secrets via env only — `.env.example` committed with placeholders, never real values
- [ ] `npm audit --audit-level=high` — zero high/critical before ship
- [ ] OWASP LLM Top 10 reviewed for any agentic surface (LLM01=prompt injection, LLM06=sensitive info)
- [ ] RLS policies verified with `EXPLAIN` on every new Supabase table before shipping

## Agentic-Specific Gates

- [ ] Agent inputs sanitized for injection patterns before reaching LLM
- [ ] All tool/MCP outputs validated against Zod schema before use
- [ ] MCP servers whitelisted — no dynamic loading of third-party servers
- [ ] Token budget enforced per agent call + logged
- [ ] Human-in-the-loop gate required for: delete, send, publish, financial transaction
- [ ] Subagents are stateless — no cross-call shared memory
- [ ] Outbound HTTP from agents restricted to allowlisted domains

## Input Sanitization Pattern

```typescript
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
  return sanitized.slice(0, 8192);
}
```

## Tool Output Validation Pattern

```typescript
export function validateToolOutput<T>(schema: z.ZodSchema<T>, raw: unknown): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    logger.warn('Tool output schema violation', { errors: result.error.issues });
    throw new AppError('Tool returned unexpected format', { retry: false });
  }
  return result.data;
}
```

## MCP Server Whitelist Pattern

```typescript
const APPROVED_MCP_SERVERS = new Set([
  'https://mcp.notion.com/mcp',
  'https://mcp.linear.app/mcp',
  'https://mcp.supabase.com/mcp',
]);

export function assertApprovedMCPServer(url: string) {
  if (!APPROVED_MCP_SERVERS.has(url)) {
    throw new SecurityError(`Unapproved MCP server: ${url}`);
  }
}
```

## Threat Matrix (Agentic Systems)

| Threat | Vector | Mitigation |
|---|---|---|
| Prompt injection (direct) | User input → LLM | Sanitize inputs; structured prompt templates |
| Prompt injection (indirect) | Tool result → LLM | Treat all tool results as untrusted; validate schema |
| Tool poisoning | Malicious MCP tool description | Whitelist MCP servers; audit tool metadata |
| Privilege escalation | Agent + elevated creds + injected command | Least-privilege tokens; human gate on destructive ops |
| Context hijacking | Cross-session instruction injection | Isolate subagent contexts; no cross-session state |
| Data exfiltration | Agent instructed to leak to external endpoint | Whitelist outbound domains; log all agent-initiated HTTP |
| Resource theft | Sampling abuse draining token budget | Token budget caps; rate limiting on sampling requests |
| RAG indirect injection | Retrieved doc contains instructions | Treat retrieved chunks as data, never as instructions |
