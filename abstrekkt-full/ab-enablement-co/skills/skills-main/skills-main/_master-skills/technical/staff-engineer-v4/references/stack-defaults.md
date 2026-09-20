# Stack Defaults — Staff Engineer v4

## Safe Defaults (State Explicitly if Used)

| Layer | Default | Override Trigger |
|---|---|---|
| Runtime | Node.js LTS | Edge requirement → Cloudflare Workers |
| Database | Postgres + Supabase + RLS | Non-relational need → DynamoDB or Redis |
| Auth | Supabase Auth | Enterprise SSO → Clerk or Auth0 |
| Deploy | Vercel (frontend) + Cloudflare Workers (edge) | Self-host requirement → Railway or AWS |
| SLOs | 99.9% availability, <200ms p95 | State explicitly if different |
| Compliance | None — flag if PII detected in schema | SOC2/HIPAA/PCI → load compliance checklist |

## Stack Decision Examples

| Scenario | Stack | Why |
|---|---|---|
| Standard web app | Next.js + Supabase + Vercel | Fast dev, RLS built-in, minimal infra |
| Low-latency API | Cloudflare Workers + D1 | Edge, global, cold starts acceptable |
| Custom backend | Node + Postgres + Railway | No lock-in, full ORM support |
| Workflow automation | n8n + Webhooks | Non-technical stakeholders can modify |
| Agent pipeline | Claude API + MCP + Supabase | Structured tool calling, persistent state |

## Frontend Standards

- Typed props — no `any`; explicit `children: ReactNode`
- Hydration safety — no browser-only APIs in server components
- Never `dangerouslySetInnerHTML` from user-controlled data
- State co-location — `useState` close to usage; lift only when needed
- Auth state from server — never derive from `localStorage`
- Always: loading / empty / error state trifecta on data-dependent UI

## Security Headers (Next.js)

```typescript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'unsafe-inline'` },
];
```

## Zod Validation Pattern

```typescript
const BodySchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await db.users.create(parsed.data);
}
```
