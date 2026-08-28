# Phase 2 — AWS ECS Production Deployment (FlashFusion)

Transition the FlashFusion Replit spike to production-grade, multi-tenant AWS
infrastructure. 3–4 week timeline. Targets: **API p95 < 500ms, error rate < 1%,
zero critical security findings before prod.**

## Architecture

```
ALB (TLS) → ECS service (Fargate, autoscaled)
                 │
                 ├── PostgreSQL RDS (Multi-AZ, RLS on every table, PITR)
                 ├── S3 (audit logs, private)        ── Secrets: AWS Secrets Manager
                 └── Sentry (errors) + PostHog (product)
```

## Components

- **Dockerfile + docker-compose** — local parity testing before ECS.
- **Terraform IaC** — ECS service + task def, RDS, ALB, security groups, IAM,
  Secrets Manager; modules in git, **plan-reviewed before apply**.
- **DB migration** — JSONL (Replit spike store) → RDS, with RLS policies applied.
- **JWT utilities** — issue + **rotate** tokens; short-lived access tokens.
- **AWS Secrets Manager integration** — no secrets in env files or images.
- **Terraform var files** — staging + production separated.

## 3–4 week plan

| Week | Focus | Exit criteria |
|------|-------|---------------|
| 1 | Staging deploy (ECS + RDS + ALB) | staging reachable; migrations applied |
| 2 | **Load test (500 concurrent users)** + OWASP Top-10 security audit | p95 < 500ms; no critical findings open |
| 3 | Validation + hardening (RLS verify, secrets, error handling) | RLS proven; runbooks tested |
| 4 | Production deploy | prod live; monitoring + alerting confirmed |

## Security hardening checklist

- [ ] RLS verified on every table (no cross-tenant read; no API bypass)
- [ ] JWT rotation working; access tokens short-lived
- [ ] All secrets in Secrets Manager; none in images/env/git
- [ ] OWASP Top-10 audit passed; zero critical findings
- [ ] Audit logs → S3, immutable, encrypted (AES-256)
- [ ] Auto-rollback path tested against a deliberately bad deploy

## Load + validation

- 500 concurrent users sustained; p95 < 500ms; error rate < 1%.
- Connection pool sized to avoid the RDS-exhaustion P0 (see
  `../runbooks/incident-runbooks.md`).

## Error-handling utilities (don't skip)

Centralized **Cause → Fix → Retry** handler + a missing-dependency guard, so
failures surface actionable errors rather than silent 500s.
