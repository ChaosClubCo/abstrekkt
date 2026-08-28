# Paved Road — "Add a New Node.js Service"

The golden, self-service path for standing up a new internal Node service at
FlashFusion. Following it gets you CI gates, k8s deploy, Vault secrets, RBAC, and
audit logging by default. "Marked trail with safety rails — you can still
explore off it, but this is the supported way."

## 1. Scaffold

- Node 20 LTS · TypeScript strict (no `any`) · Express/Fastify · REST (+OpenAPI)
  or tRPC.
- Repo from the service template (includes `.env.example`, CODEOWNERS,
  `.husky/pre-commit`, CI workflow).

## 2. Data + isolation

- Supabase/Postgres with **RLS on every table** (multi-tenant default).
- PITR enabled; daily backups, 30-day retention minimum.
- Secrets via **Vault** (never in env files committed to git).

## 3. Quality gates (enforced in CI — see `../devex/guardrails.md`)

```bash
# Minimum coverage gates (enforced in CI)
jest --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

`.github/workflows/quality-gate.yml` runs: lint → typecheck → unit tests
(≥80% coverage) → secret scan → SAST → RLS verification. Any failure blocks merge.

## 4. Deploy (k8s/Helm)

- `k8s/service.yaml` Helm template; readiness/liveness probes required.
- **Auto-rollback:** if readiness probe fails for 30s post-deploy, k8s rolls back
  to the previous replica set. Manual: revert the Helm values change in git →
  ArgoCD auto-syncs the previous version (rollback < 5 min).

## 5. Observability + alerting

- Sentry (errors) + PostHog (product) wired from the template.
- PrometheusAlert in k8s → EventBridge → SNS (`flashfusion-alerts-prod`) → PagerDuty.

## 6. Audit + RBAC

- Audit logging on by default → CloudWatch (2-year retention, security-team
  access only).
- RBAC scopes mapped from the role taxonomy; least privilege.

## Acceptance

- [ ] CI quality gate green (coverage ≥80%, secret scan, SAST, RLS)
- [ ] Readiness/liveness probes + auto-rollback verified
- [ ] Sentry/PostHog receiving events; PagerDuty alert wired
- [ ] Secrets in Vault, none in git; audit logging confirmed
