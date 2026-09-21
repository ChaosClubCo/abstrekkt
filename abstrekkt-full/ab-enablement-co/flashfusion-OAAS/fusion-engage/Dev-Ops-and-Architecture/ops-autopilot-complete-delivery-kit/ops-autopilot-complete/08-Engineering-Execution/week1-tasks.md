# Week 1 Tasks — Foundation

> **Audience:** ENG | **Phase:** MVP

---

## Day 1–2: Architecture + API Design

- [ ] Finalize Run/Step/Approval/AuditLog/Policy schemas (review with security lead)
- [ ] Design 8 control plane endpoints (OpenAPI 3.0)
- [ ] Define n8n ↔ control plane event contract (webhooks + callbacks)
- [ ] Document idempotency key generation algorithm
- [ ] Create Postman collection from OpenAPI spec
- **Gate:** Schema approved by security lead

## Day 3–4: Control Plane MVP

- [ ] Create Supabase project (Pro plan)
- [ ] Run `001_initial_schema.sql` migration (all tables + indexes)
- [ ] Implement RLS policies on all customer-scoped tables
- [ ] Implement OAuth2 authentication layer (Supabase Auth)
- [ ] Build POST /runs endpoint (with idempotency)
- [ ] Build GET /runs/{run_id} endpoint
- [ ] Build POST /steps/complete endpoint
- [ ] Write unit tests (>80% coverage)
- [ ] Test RLS: 50 cross-tenant queries → all blocked
- **Gate:** Multi-tenant isolation verified

## Day 5: Deployment Pipeline

- [ ] Set up GitHub repository (private, branch protection)
- [ ] Configure GitHub Actions: lint → test → build → deploy
- [ ] Create Vercel project, connect to GitHub
- [ ] Configure environments: dev, staging, prod
- [ ] Set up environment variables (Supabase URL, JWT secret, etc.)
- [ ] Initialize Sentry (error tracking)
- [ ] Initialize PostHog (analytics)
- [ ] Deploy to staging, verify health check
- **Gate:** Staging deployment succeeds end-to-end
