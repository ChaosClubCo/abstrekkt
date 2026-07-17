<required_reading>
Load before executing any step:
- `references/security-checklist.md` — mandatory before Step 5
- `references/stack-defaults.md` — mandatory before Step 3
- `references/agentic-patterns.md` — mandatory if Step 6 applies
- `references/observability.md` — mandatory before Step 7
- `references/cicd-template.md` — mandatory before Step 8
</required_reading>

<process>

## Step 1 · Clarify (≤5 Questions or Explicit Assumptions)

Ask if ambiguous (one message, max 5 questions):
- Project lane? (Intinc / Customization Service / Kinsley / Personal)
- Target runtime? (Node LTS, Cloudflare Workers, Deno, Docker)
- Database + RLS? (Postgres/Supabase, DynamoDB, Redis)
- Auth provider? (Supabase Auth, Clerk, Auth0, custom)
- Deployment target? (Vercel, Cloudflare, Railway, AWS)
- Agentic components? (MCP server, subagents, n8n, RAG pipeline)
- SLOs? (latency p95, availability %, throughput req/s)
- Compliance? (SOC2, HIPAA, PCI-DSS, GDPR)

**Safe defaults — state explicitly if used:**
Runtime: Node.js LTS | DB: Postgres + Supabase RLS (multi-tenant assumed) | Auth: Supabase Auth | Deploy: Vercel + Cloudflare Workers | SLOs: 99.9%, <200ms p95 | Compliance: none (flag if PII in schema)

---

## Step 2 · WSJF Backlog (FULL mode only)

| Feature / Task | User Value | Time Criticality | Risk Reduction | Job Size | WSJF |
|---|---|---|---|---|---|
| Example: Auth RLS | 8 | 5 | 9 | 3 | **7.33** |

WSJF = (User Value + Time Criticality + Risk Reduction) ÷ Job Size. Implement highest first. Archive <3.0.

---

## Step 3 · Stack Selection

Pros/cons table if 3+ options. Always cite version. See `references/stack-defaults.md`.

---

## Step 4 · File & Module Plan

```
project/
├── src/
│   ├── agents/orchestrator.ts
│   │   └── subagents/
│   ├── mcp/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── validation.ts
│   │   ├── observability.ts
│   │   └── context.ts
│   ├── components/
│   └── app/api/
├── tests/unit/ integration/ agents/
├── .github/workflows/ci.yml
├── .env.example
└── README.md
```

---

## Step 5 · Core Implementation

Load and apply `references/security-checklist.md` before writing any code.

**Standards:** TypeScript strict | Errors: Cause → Fix → Retry | Logging: structured JSON `{traceId, userId, requestId, timestamp}` | No `console.log` in production.

```typescript
try {
  const result = await operation();
  return result;
} catch (error) {
  logger.error('Operation failed', {
    cause: error instanceof Error ? error.message : String(error),
    context: { userId, requestId, traceId },
  });
  throw new AppError('Unable to complete. Please retry.', { cause: error, retry: true, code: 'OP_FAILED' });
}
```

---

## Step 6 · Agentic Systems (When Applicable)

Load `references/agentic-patterns.md` — agent architecture, MCP design, threat matrix, context engineering, structured output contracts, ReAct loop.

**Default: single agent. Escalate only when parallelism is provably required.**

---

## Step 7 · Observability Pack (STANDARD + FULL — Non-Negotiable)

Load `references/observability.md` for full implementation. Core: traceId end-to-end, Sentry, PostHog, LLM cost tracking, alert thresholds.

---

## Step 8 · CI/CD + Documentation Pack

Load `references/cicd-template.md` for CI yaml, README template, .env.example, AGENTS.md template.

---

## Step 8.5 · Audit Loop (Ship Gate)

Load and execute `workflows/audit-loop.md`. Required before every merge, deploy, or hand-off.

---

## Completion Output (STANDARD + FULL)

3-paragraph Progress & Next Steps: delivered / quality gates + audit summary (P0/P1/P2 counts) / next steps + open questions.

---

## Self-Critique (Always Last)

```
3 Weaknesses + Patches:
1. Weakness: [gap] → Patch: [concrete fix]
2. Weakness: [gap] → Patch: [concrete fix]
3. Weakness: [gap] → Patch: [concrete fix]

Gaps / Blindspots / Unknown Unknowns:
- What I don't know: [scale, compliance, third-party limits]
- Unvalidated assumptions: [perf at >10K concurrent, adversarial agent behavior]
- Unknown unknowns: [regulatory changes, model drift, novel attack vectors]
```

</process>
