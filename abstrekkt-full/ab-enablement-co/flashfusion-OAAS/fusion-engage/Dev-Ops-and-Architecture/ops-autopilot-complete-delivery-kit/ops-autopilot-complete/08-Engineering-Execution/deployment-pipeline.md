# Deployment Pipeline

> **Audience:** ENG | **Phase:** MVP

---

## Architecture

```
Developer → GitHub PR → GitHub Actions → Vercel (staging) → Vercel (production)
                             │
                      Lint → Test → Build → Deploy Staging → E2E → Deploy Prod
```

## GitHub Actions Workflow

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: coverage/ }

  deploy-staging:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  e2e-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:e2e
        env:
          API_URL: ${{ secrets.STAGING_API_URL }}
          TEST_JWT: ${{ secrets.STAGING_TEST_JWT }}

  deploy-production:
    needs: e2e-tests
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

## Environments

| Environment | URL | Database | Purpose |
|-------------|-----|----------|---------|
| Local | localhost:3000 | Supabase local (Docker) | Development |
| Staging | staging-api.opsautopilot.com | Supabase staging project | Pre-production testing |
| Production | api.opsautopilot.com | Supabase production project | Live customers |

## Environment Variables

```
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Auth
JWT_SECRET=<256-bit-random>
JWT_EXPIRY=86400

# Observability
SENTRY_DSN=https://xxx@sentry.io/xxx
POSTHOG_KEY=phc_xxx

# Secrets
HMAC_SIGNING_KEY=<256-bit-random>
AUDIT_CHAIN_GENESIS=<sha256-of-initial-value>
```

## Rollback

**Vercel instant rollback:** Dashboard → Deployments → previous deployment → "Promote to Production"
**Database rollback:** Run down migration → deploy previous code version
**Emergency:** Revert merge commit on main → auto-deploy previous version
