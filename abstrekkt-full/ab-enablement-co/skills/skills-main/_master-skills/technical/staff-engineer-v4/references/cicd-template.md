# CI/CD Template — Staff Engineer v4

## ci.yml

```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 'lts/*' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm audit --audit-level=high
      - run: npm test
      - run: npx playwright test
      - name: Deploy gate
        if: github.ref == 'refs/heads/main'
        run: npm run deploy:staging
```

## README Required Sections

1. Overview + architecture diagram
2. Prerequisites + exact version requirements
3. Installation (exact commands)
4. Environment variables (`.env.example` reference)
5. Running locally
6. Running tests (unit, integration, agent)
7. Deployment — staging → prod with rollback instructions
8. Observability — Sentry dashboard link, PostHog events list
9. Troubleshooting — top 5 errors with exact fixes
10. Recovery procedures — what to do when X fails at 2am

## .env.example Template

```bash
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=<public-safe>
SUPABASE_SERVICE_KEY=<server-only-never-expose-to-client>

# Auth
AUTH_SECRET=<generate: openssl rand -base64 32>

# AI
ANTHROPIC_API_KEY=<from-console.anthropic.com>

# Observability
SENTRY_DSN=<from-sentry.io>
POSTHOG_API_KEY=<from-posthog.com>

# Infrastructure
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=<from-resend.com>

# Stripe (if billing)
STRIPE_SECRET_KEY=sk_test_<your-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-secret>
STRIPE_PUBLISHABLE_KEY=pk_test_<public-safe>
```

## AGENTS.md Template

```markdown
# [Project Name] — Agent Context

## Build & Test
- Type-check: `npm run typecheck`
- Test: `npm test`
- E2E: `npx playwright test`
- Dev: `npm run dev`

## Architecture
[2-3 sentences: what this does, major modules, data flow]

## Security Rules (Non-Negotiable)
- RLS on all Supabase tables — verify with EXPLAIN
- No service_role key in client code
- All inputs validated with Zod at API boundaries

## Conventions
- TypeScript strict mode, single quotes, trailing commas
- Errors: always cause + retry hint
- Logging: structured JSON, always traceId

## Git Workflow
- Branch: `feature/<slug>` or `bugfix/<slug>`
- Run `npm run typecheck && npm test` before push
- No force-push to main
```
