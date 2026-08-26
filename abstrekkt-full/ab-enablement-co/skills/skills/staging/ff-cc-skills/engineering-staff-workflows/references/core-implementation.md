# Core Implementation Patterns

## File and Module Plan Template

```
project/
├── src/
│   ├── agents/              # Agent loop handlers
│   │   ├── orchestrator.ts  # Primary agent, maintains context
│   │   └── subagents/       # Isolated pure-function subagents
│   ├── mcp/                 # MCP server definitions
│   │   ├── tools/           # Tool handlers (one file per tool)
│   │   └── server.ts        # MCP server bootstrap
│   ├── lib/
│   │   ├── auth.ts          # Auth logic (verify JWTs, RLS context)
│   │   ├── db.ts            # DB client + RLS enforcement
│   │   ├── validation.ts    # Zod schemas — all inputs validated here
│   │   ├── observability.ts # PostHog + Sentry + trace ID injection
│   │   └── context.ts       # Context engineering: window mgmt, compression
│   ├── components/          # Frontend — typed, hydration-safe
│   ├── app/
│   │   └── api/             # API routes — all auth-gated
│   └── types/               # Shared TypeScript interfaces
├── tests/
│   ├── unit/
│   ├── integration/
│   └── agents/              # Agent determinism + output validation tests
├── .github/workflows/
│   └── ci.yml               # Smoke tests, audit, type-check, deploy gate
├── .env.example
├── README.md
└── package.json
```

## Security Checklist (Mandatory)

- [ ] All inputs validated with Zod (never trust external or agent-returned data)
- [ ] Auth checks on every protected route — no implicit trust
- [ ] Parameterized queries only — no string concatenation into SQL
- [ ] Rate limiting on all public + agent-callable endpoints
- [ ] CORS configured for explicit allowed origins
- [ ] XSS prevention — sanitize all outputs rendered in UI
- [ ] Secrets via env only — provide `.env.example`, never commit creds
- [ ] OWASP Top 10 for LLM Apps reviewed (prompt injection is LLM01)
- [ ] RLS policies verified with `EXPLAIN` before shipping

## Code Quality Standards

- TypeScript strict mode
- Error handling: Cause → Fix → Retry format (never `throw new Error("failed")`)
- Logging: structured JSON with `{ traceId, userId, requestId, timestamp }`
- No `console.log` in production — use structured logger

```typescript
// Standard error pattern
try {
  const result = await operation();
  return result;
} catch (error) {
  logger.error('Operation failed', {
    cause: error instanceof Error ? error.message : String(error),
    context: { userId, requestId, traceId },
  });
  throw new AppError('Unable to complete. Please retry.', {
    cause: error,
    retry: true,
    code: 'OP_FAILED',
  });
}
```

## Frontend Security Headers

```typescript
// next.config.js — security headers
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'unsafe-inline'`,
  },
];
```

## Component Standards (React / Next.js)

- Typed props — no `any`; no implicit `children: ReactNode` without explicit prop
- Hydration safety — no browser-only APIs in server components
- XSS in RSC — never dangerously set innerHTML from user-controlled data
- State co-location — useState close to usage; lift only when needed
- CSP headers configured in next.config.js or Cloudflare
- No secrets in client-side code — use server actions or API routes
- Form inputs: validate client-side (UX) AND server-side (security)
- Auth state from server — never derive auth from localStorage
