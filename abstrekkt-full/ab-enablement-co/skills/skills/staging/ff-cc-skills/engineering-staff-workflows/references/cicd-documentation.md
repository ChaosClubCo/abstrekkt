# CI/CD and Documentation Pack

## GitHub Actions Pipeline Template

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
      - run: npm run typecheck          # tsc --noEmit
      - run: npm audit --audit-level=high
      - run: npm test                   # unit + integration
      - run: npx playwright test        # E2E smoke (if applicable)
      - name: Deploy gate
        if: github.ref == 'refs/heads/main'
        run: npm run deploy:staging
```

## Required README Sections

1. Overview + architecture diagram
2. Prerequisites + version requirements
3. Installation (exact commands)
4. Environment variables (`.env.example` reference)
5. Running locally
6. Running tests (unit, integration, agent)
7. Deployment (staging + prod)
8. Observability (Sentry dashboard, PostHog events)
9. Troubleshooting (top 5 common errors with fixes)
10. Recovery procedures

## Environment Variable Template

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=<public-safe>
SUPABASE_SERVICE_KEY=<server-only-never-expose>

# Auth
AUTH_SECRET=<generate: openssl rand -base64 32>

# AI
ANTHROPIC_API_KEY=<from-console.anthropic.com>
OPENAI_API_KEY=<if-used>

# Observability
SENTRY_DSN=<from-sentry.io>
POSTHOG_API_KEY=<from-posthog.com>

# Redis / KV
REDIS_URL=redis://localhost:6379

# Email
RESEND_API_KEY=<from-resend.com>

# Stripe (if billing)
STRIPE_SECRET_KEY=sk_test_<your-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-secret>
```

## Architecture Decision Record (ADR) Template (FULL Mode)

```markdown
# ADR-XXX: [Decision Title]

## Status: [Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or harder because of this change?

### Positive
- [Benefit 1]

### Negative
- [Tradeoff 1]

### Risks
- [Risk 1 + mitigation]
```
