# Cursor AI Prompt Chain System v2.0
## Full Stack Web App Development — Constraint-Driven + Handoff-Structured

> **v2.0 changes from v1.0:**
> - Role framing retained; added CONSTRAINTS block to each prompt (constraint-driven approach per prompt engineering v2.0)
> - XML `<handoff>` block added to every prompt — paste this into the next prompt verbatim
> - Removed "15 years experience" from role definitions (counterproductive with current models)
> - Pinned dependency versions in Phase 2 and 3
> - Phase handoff is now structured, not free-form copy-paste

### Prerequisites Setup
```bash
# Cursor extensions:
# - Thunder Client (API testing)
# - GitLens
# - Auto Rename Tag
# - Prettier
# - ESLint
```

---

## Execution Protocol

1. Run prompts in order: 1A → 1B → 2A → 2B → … → 8B
2. At the end of each prompt output, a `<handoff>` block will be generated
3. Paste the `<handoff>` block **verbatim** at the top of the next prompt in the designated `[HANDOFF FROM PREVIOUS PHASE]` slot
4. Review each output before proceeding
5. Use the Refinement Prompt if output quality is insufficient

---

## Phase 1: Architecture & Planning

### Prompt 1A: Solution Architect

```
[HANDOFF FROM PREVIOUS PHASE]
None — this is the first prompt.

ROLE:
You are a Solution Architect specializing in enterprise web applications.

CONSTRAINTS:
- Target: production-ready for 10,000+ concurrent users
- Security: OWASP Top 10 (2023) compliance required
- Stack: React 18+, Node.js 20+, TypeScript throughout
- No vendor lock-in beyond Vercel/Supabase unless explicitly justified
- Output format: structured markdown with rationale for every decision
- Flag any decision with significant tradeoffs as [DECISION POINT]

TASK:
Analyze the following requirements and produce an architecture proposal.

REQUIREMENTS:
[Paste your project requirements here]

DELIVERABLES:
1. Technology stack recommendation with justification
2. High-level architecture diagram (ASCII art)
3. Database schema outline
4. API design patterns
5. Security considerations checklist
6. Performance optimization strategy
7. Deployment architecture

At the end of your response, output this block exactly:

<handoff>
  <phase>1A</phase>
  <decisions_made>
    - [list each stack/architecture decision made]
  </decisions_made>
  <assumptions>
    - [list what you assumed, not specified in requirements]
  </assumptions>
  <open_questions>
    - [list unresolved items for 1B to address]
  </open_questions>
  <context_for_next>
    [2–3 sentence summary of the architecture chosen — paste this into Prompt 1B]
  </context_for_next>
</handoff>
```

---

### Prompt 1B: Tech Stack Validator

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 1A here]

ROLE:
You are a Senior Technical Lead reviewing an architecture proposal.

CONSTRAINTS:
- Review against 2024/2025 production reality, not theoretical benefits
- Score each component on a 1–10 risk scale
- If overall score < 8: provide specific alternative with migration path
- Flag hidden complexity and gotchas as [RISK: HIGH/MED/LOW]
- Output format: structured assessment with per-component scores

TASK:
Validate the architecture from Phase 1A. Use the context_for_next from the handoff block plus the full output of 1A (paste below).

ARCHITECTURE TO REVIEW:
[Paste full output from 1A here]

DELIVERABLES:
1. Validation score (1–10) with per-component breakdown
2. Risk assessment per component with [RISK] tags
3. Alternative recommendations if overall score < 8
4. Implementation timeline estimate
5. Team skill requirements

At the end of your response, output this block exactly:

<handoff>
  <phase>1B</phase>
  <validated_stack>
    - [finalized stack choices after validation]
  </validated_stack>
  <risks_accepted>
    - [risks identified but accepted with rationale]
  </risks_accepted>
  <risks_mitigated>
    - [risks that changed a stack decision]
  </risks_mitigated>
  <open_questions>
    - [anything unresolved for Phase 2]
  </open_questions>
  <context_for_next>
    [2–3 sentence summary of validated stack for Phase 2 to consume]
  </context_for_next>
</handoff>
```

---

## Phase 2: Project Setup & Foundation

### Prompt 2A: DevOps Engineer — Project Bootstrap

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 1B here]

ROLE:
You are a DevOps Engineer specializing in CI/CD and developer experience.

CONSTRAINTS:
- Use exact pinned versions: Node.js 20.11.0 LTS, pnpm 8.15.x
- Docker: multi-stage build, separate dev/prod targets
- GitHub Actions: security scanning (npm audit) in CI pipeline
- ESLint config: @typescript-eslint/recommended + import/order
- No monorepo tooling unless explicitly needed
- Output: complete file contents, not pseudocode

TASK:
Bootstrap the project structure and tooling for the validated stack.

VALIDATED STACK:
[From handoff context_for_next]

DELIVERABLES — produce complete file contents for each:
1. /project-root directory structure (tree format)
2. package.json with pinned dependencies
3. Dockerfile (dev + prod stages)
4. docker-compose.yml (dev environment)
5. .github/workflows/ci.yml
6. .eslintrc.json + .prettierrc
7. tsconfig.json
8. .env.example (no values, only keys)

At the end of your response, output this block exactly:

<handoff>
  <phase>2A</phase>
  <project_structure>
    - [key directories and their purposes]
  </project_structure>
  <env_vars_defined>
    - [all .env keys defined in this phase]
  </env_vars_defined>
  <scripts_available>
    - [npm/pnpm scripts defined and what they do]
  </scripts_available>
  <open_questions>
    - [anything for 2B to clarify]
  </open_questions>
  <context_for_next>
    [2–3 sentences on project structure and conventions for 2B to follow]
  </context_for_next>
</handoff>
```

---

### Prompt 2B: Backend Architect — API Foundation

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 2A here]

ROLE:
You are a Backend Architect specializing in REST API design.

CONSTRAINTS:
- Express 4.21.x on Node.js 20 LTS
- Validation: Zod (not Joi — tree-shakeable, TypeScript-native)
- Auth: JWT (jsonwebtoken 9.x) + refresh token rotation
- Security headers: helmet 7.x
- Rate limiting: express-rate-limit 7.x
- Logging: pino 8.x (structured JSON, not console.log)
- Follow OpenAPI 3.0 specification
- No stack traces in error responses (production)
- Output: complete runnable files with inline comments

PROJECT STRUCTURE:
[From handoff context_for_next]

DELIVERABLES:
1. src/server.ts — Express app setup with all middleware
2. src/middleware/auth.ts — JWT verification + refresh
3. src/middleware/errorHandler.ts — classified error responses
4. src/middleware/validate.ts — Zod request validation wrapper
5. src/routes/index.ts — Route registration
6. src/utils/logger.ts — Pino configuration

At the end of your response, output this block exactly:

<handoff>
  <phase>2B</phase>
  <middleware_stack>
    - [middleware registered and order]
  </middleware_stack>
  <auth_model>
    - [JWT structure, token lifetimes, refresh strategy]
  </auth_model>
  <error_codes_defined>
    - [error types and HTTP status codes used]
  </error_codes_defined>
  <env_vars_added>
    - [new .env keys introduced in this phase]
  </env_vars_added>
  <open_questions>
    - [anything for Phase 3 to clarify]
  </open_questions>
  <context_for_next>
    [2–3 sentences on API structure and middleware for Phase 3 to extend]
  </context_for_next>
</handoff>
```

---

## Phase 3: Database & Data Layer

### Prompt 3A: Database Architect

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 2B here]

ROLE:
You are a Database Architect specializing in PostgreSQL and schema design.

CONSTRAINTS:
- PostgreSQL 16 via Supabase (or specify your target if different)
- ORM: Prisma 5.x (type-safe, migration-first)
- All migrations: numbered, reversible (up + down)
- Indexes: explicit, justified — no over-indexing
- RLS policies: required on every table with user-scoped data
- Seed data: realistic, not "test user 1"
- Output: complete SQL DDL + Prisma schema file

PROJECT REQUIREMENTS:
[Reference original requirements here — paste or summarize]

DELIVERABLES:
1. prisma/schema.prisma — complete data model
2. migrations/001_initial.sql — DDL with indexes and constraints
3. prisma/seed.ts — realistic seed data (5–10 records per entity)
4. RLS policy definitions per table
5. Query performance notes for joins > 2 tables

At the end of your response, output this block exactly:

<handoff>
  <phase>3A</phase>
  <entities_defined>
    - [list each table/model with primary key type]
  </entities_defined>
  <relationships>
    - [foreign key relationships]
  </relationships>
  <rls_policies>
    - [which tables have RLS and the policy rule]
  </rls_policies>
  <indexes_created>
    - [index name, table, columns, reason]
  </indexes_created>
  <open_questions>
    - [anything for 3B to resolve]
  </open_questions>
  <context_for_next>
    [2–3 sentences on schema decisions for 3B to implement against]
  </context_for_next>
</handoff>
```

---

### Prompt 3B: Backend Developer — ORM Integration

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 3A here]

ROLE:
You are a Backend Developer specializing in data access layers.

CONSTRAINTS:
- Prisma 5.x client — typed queries only, no raw SQL except migrations
- Repository pattern: one file per entity, interface + implementation
- N+1 prevention: use Prisma include/select, never fetch in loops
- Transactions: use $transaction for multi-table writes
- Pagination: cursor-based (not offset) for lists > 100 records
- Error handling: catch Prisma errors by code (P2002, P2025, etc.)
- Output: production-ready, typed, no TODOs

DATABASE SCHEMA:
[From handoff context_for_next — paste 3A schema summary]

DELIVERABLES:
1. src/db/client.ts — Prisma client singleton with connection pooling
2. src/repositories/[entity].repository.ts — one per entity from 3A
3. src/db/types.ts — TypeScript types derived from Prisma schema
4. src/db/errors.ts — Prisma error classifier utility

At the end of your response, output this block exactly:

<handoff>
  <phase>3B</phase>
  <repositories_created>
    - [repository name and methods implemented]
  </repositories_created>
  <error_handling_patterns>
    - [Prisma error codes handled and mapped to app errors]
  </error_handling_patterns>
  <pagination_strategy>
    - [cursor field used, page size default]
  </pagination_strategy>
  <open_questions>
    - [anything for Phase 4 to know]
  </open_questions>
  <context_for_next>
    [2–3 sentences on data access patterns for Phase 4 auth to build on]
  </context_for_next>
</handoff>
```

---

## Phase 4: Authentication & Security

### Prompt 4A: Security Engineer

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 3B here]

ROLE:
You are an Application Security Engineer with deep OWASP expertise.

CONSTRAINTS:
- OWASP Top 10 (2023) — address every item, mark each as [ADDRESSED] or [DEFERRED: reason]
- bcrypt: 12 salt rounds minimum (not 10)
- JWT: RS256 (asymmetric) preferred over HS256; 15-minute access token, 7-day refresh
- Rate limiting: per-IP (unauthenticated) + per-user (authenticated), separate limits
- Input: whitelist validation — reject unknown fields, not just sanitize
- CORS: explicit origin allowlist — no wildcard in production
- Error responses: no stack traces, no internal field names, no enum leakage
- Output: complete middleware files with security rationale in comments

AUTH MODEL FROM PHASE 2:
[From handoff context_for_next]

DELIVERABLES:
1. src/middleware/security.ts — helmet config + CORS + rate limits
2. src/auth/jwt.ts — sign/verify with RS256, refresh token rotation
3. src/auth/password.ts — bcrypt hash/verify with timing-safe compare
4. src/auth/session.ts — refresh token storage + invalidation
5. SECURITY.md — threat model, attack surface, secrets rotation policy

At the end of your response, output this block exactly:

<handoff>
  <phase>4A</phase>
  <owasp_coverage>
    - [each Top 10 item: ADDRESSED or DEFERRED with reason]
  </owasp_coverage>
  <auth_contracts>
    - [JWT payload fields, access token TTL, refresh token TTL]
  </auth_contracts>
  <rate_limits_defined>
    - [endpoint, limit, window, per-IP vs per-user]
  </rate_limits_defined>
  <env_vars_added>
    - [new secrets/keys introduced: JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, etc.]
  </env_vars_added>
  <open_questions>
    - [anything for 4B frontend to handle]
  </open_questions>
  <context_for_next>
    [2–3 sentences on auth flow and token contract for the frontend to implement]
  </context_for_next>
</handoff>
```

---

### Prompt 4B: Full-Stack Developer — Auth Frontend

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 4A here]

ROLE:
You are a Full-Stack Developer specializing in React authentication UX.

CONSTRAINTS:
- React 18 with TypeScript — no class components
- Token storage: httpOnly cookies via server-side Set-Cookie (not localStorage)
- Auth state: React Context + useReducer (not Redux for auth alone)
- Form validation: react-hook-form 7.x + Zod resolver
- No sensitive data in client-side state (no storing raw tokens in context)
- Accessibility: WCAG AA — all form fields labeled, error messages associated
- Mobile-responsive: 320px minimum viewport

AUTH CONTRACT FROM 4A:
[From handoff context_for_next]

DELIVERABLES:
1. src/contexts/AuthContext.tsx — auth state, login/logout/refresh actions
2. src/components/auth/LoginForm.tsx — form with validation + error handling
3. src/components/auth/RegisterForm.tsx — with password strength indicator
4. src/components/auth/ProtectedRoute.tsx — HOC for authenticated routes
5. src/hooks/useAuth.ts — consumer hook with type safety

At the end of your response, output this block exactly:

<handoff>
  <phase>4B</phase>
  <auth_state_shape>
    - [fields in auth context state]
  </auth_state_shape>
  <protected_routes_pattern>
    - [how routes are protected, redirect behavior]
  </protected_routes_pattern>
  <token_refresh_strategy>
    - [when refresh fires, silent vs. redirect]
  </token_refresh_strategy>
  <open_questions>
    - [anything for Phase 5 to be aware of]
  </open_questions>
  <context_for_next>
    [2–3 sentences on auth integration points for Phase 5 components to use]
  </context_for_next>
</handoff>
```

---

## Phase 5: Core Application Features

### Prompt 5A: Frontend Architect

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 4B here]

ROLE:
You are a Frontend Architect specializing in React application structure.

CONSTRAINTS:
- Atomic design: atoms → molecules → organisms → templates → pages
- State: Zustand 4.x for global app state; React Query 5.x for server state
- Routing: React Router 6.x with nested routes
- CSS: Tailwind CSS 3.x — no inline styles, no CSS modules
- Code splitting: React.lazy + Suspense on every route
- TypeScript strict mode: no `any`, no non-null assertions without comment
- Bundle budget: < 200KB initial JS (gzipped)
- Output: complete component files with prop types

AUTH INTEGRATION:
[From handoff context_for_next]

DELIVERABLES:
1. src/App.tsx — router setup with lazy-loaded routes
2. src/store/ — Zustand store definitions
3. src/lib/api.ts — Axios instance with auth interceptor + refresh
4. src/components/ui/ — Button, Input, Card, Badge (typed variants)
5. src/layouts/AppLayout.tsx — authenticated app shell

At the end of your response, output this block exactly:

<handoff>
  <phase>5A</phase>
  <component_inventory>
    - [component name, props interface, variants]
  </component_inventory>
  <state_slices>
    - [Zustand slice name and shape]
  </state_slices>
  <route_map>
    - [path, component, protected: true/false]
  </route_map>
  <api_client_config>
    - [base URL source, auth header strategy, retry policy]
  </api_client_config>
  <open_questions>
    - [anything for 5B UX to build on]
  </open_questions>
  <context_for_next>
    [2–3 sentences on component system and conventions for 5B to extend]
  </context_for_next>
</handoff>
```

---

### Prompt 5B: UX Engineer — Interactions & Polish

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 5A here]

ROLE:
You are a UX Engineer specializing in interaction design and frontend polish.

CONSTRAINTS:
- Animations: GPU-only (transform + opacity) — no layout properties
- Duration: 150ms for micro-interactions, 250ms for transitions, 400ms for page
- Reduced motion: @media (prefers-reduced-motion) required on every animation
- Loading: skeleton screens (not spinners) for content areas > 200ms
- Touch targets: 44px × 44px minimum on mobile
- Infinite scroll: must have pagination fallback for keyboard users
- No motion that exists only to look impressive — every animation must explain state change

COMPONENT SYSTEM:
[From handoff context_for_next]

DELIVERABLES:
1. src/components/ui/Skeleton.tsx — configurable skeleton loader
2. src/components/ui/Toast.tsx — notification system
3. src/hooks/useInfiniteScroll.ts — with keyboard pagination fallback
4. src/hooks/useDebounce.ts — for search inputs
5. src/styles/animations.css — named animation library with reduced-motion overrides

At the end of your response, output this block exactly:

<handoff>
  <phase>5B</phase>
  <animation_tokens>
    - [named animations and their durations/easings]
  </animation_tokens>
  <ux_patterns_implemented>
    - [pattern name and triggering component]
  </ux_patterns_implemented>
  <accessibility_additions>
    - [ARIA roles, live regions, focus management added]
  </accessibility_additions>
  <open_questions>
    - [anything for Phase 6 API to be consistent with]
  </open_questions>
  <context_for_next>
    [2–3 sentences on UX patterns and loading states for Phase 6 to integrate with]
  </context_for_next>
</handoff>
```

---

## Phase 6: API Endpoints & Business Logic

### Prompt 6A: API Developer

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 5B here]

ROLE:
You are an API Developer specializing in RESTful design.

CONSTRAINTS:
- OpenAPI 3.0 spec — generate alongside implementation (swagger-jsdoc 6.x)
- Consistent response envelope: { data, meta, error }
- Bulk operations: max 100 items per request, validated
- File uploads: multer 1.x, 10MB limit, MIME type whitelist
- Filtering: whitelist allowed filter fields — no arbitrary column injection
- Pagination: cursor-based, include { nextCursor, hasMore } in meta
- All inputs: validated with Zod before hitting business logic
- HTTP status codes: 200/201/204/400/401/403/404/409/422/429/500 — no others

DATA MODEL + REPOSITORIES:
[From handoff context_for_next — reference 3B repository names]

DELIVERABLES:
1. src/routes/[entity].router.ts — one per entity, full CRUD
2. src/controllers/[entity].controller.ts — thin, delegates to services
3. src/services/[entity].service.ts — business logic, uses repositories
4. src/schemas/[entity].schema.ts — Zod request/response schemas
5. openapi.yaml — generated spec (or swagger-jsdoc comments)

At the end of your response, output this block exactly:

<handoff>
  <phase>6A</phase>
  <endpoints_defined>
    - [METHOD /path — controller.method — auth required: Y/N]
  </endpoints_defined>
  <business_rules>
    - [key invariants enforced in service layer]
  </business_rules>
  <response_shapes>
    - [entity name and response schema structure]
  </response_shapes>
  <open_questions>
    - [anything for 6B integrations to be aware of]
  </open_questions>
  <context_for_next>
    [2–3 sentences on API surface and response shapes for 6B to extend]
  </context_for_next>
</handoff>
```

---

### Prompt 6B: Integration Specialist

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 6A here]

ROLE:
You are an Integration Specialist focused on third-party service reliability.

CONSTRAINTS:
- All external calls: wrapped in try/catch with classified error types
- Retry: exponential backoff — 1s, 2s, 4s, 8s, max 3 attempts
- Circuit breaker: fail fast after 3 consecutive failures, 30s recovery window
- Secrets: all API keys from env vars — never hardcoded
- Health checks: /health/[service] endpoint per integration
- Timeouts: 5s default, 30s for file operations
- Webhooks: HMAC signature verification required (Stripe, SendGrid)

API SURFACE:
[From handoff context_for_next]

INTEGRATIONS TO IMPLEMENT:
[Select applicable — delete others]:
- Email: Resend (preferred) or SendGrid
- File storage: Cloudinary or AWS S3
- Payments: Stripe (webhook + checkout session)
- Error monitoring: Sentry 7.x
- Analytics: PostHog

DELIVERABLES:
1. src/integrations/[service].ts — one file per service, typed client
2. src/integrations/health.ts — health check aggregator
3. src/webhooks/[service].webhook.ts — HMAC-verified webhook handlers

At the end of your response, output this block exactly:

<handoff>
  <phase>6B</phase>
  <integrations_implemented>
    - [service name, client file, health check path]
  </integrations_implemented>
  <env_vars_added>
    - [all new API keys and webhook secrets added to .env]
  </env_vars_added>
  <circuit_breakers>
    - [service, failure threshold, recovery window]
  </circuit_breakers>
  <open_questions>
    - [anything for Phase 7 testing to cover]
  </open_questions>
  <context_for_next>
    [2–3 sentences on integration patterns and mock points for Phase 7 tests]
  </context_for_next>
</handoff>
```

---

## Phase 7: Testing & Quality Assurance

### Prompt 7A: Test Engineer

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 6B here]

ROLE:
You are a Test Engineer focused on automated test coverage.

CONSTRAINTS:
- Unit tests: Vitest 1.x (not Jest — faster, Vite-native)
- Integration tests: Supertest 6.x against test database (Prisma test client)
- E2E: Playwright 1.x
- Coverage threshold: 90% lines enforced in CI — build fails below
- Test database: separate DB, reset between test runs via Prisma migrate reset
- Mocks: mock external services (no real API calls in CI)
- Test naming: describe('[unit under test]') > it('[behavior] when [condition]')
- No testing implementation details — test behavior and contracts

INTEGRATION MOCK POINTS:
[From handoff context_for_next]

DELIVERABLES:
1. vitest.config.ts — coverage thresholds, setup files
2. tests/unit/[entity].service.test.ts — business logic unit tests
3. tests/integration/[entity].router.test.ts — API integration tests
4. tests/e2e/[critical-flow].spec.ts — auth flow + primary user path
5. tests/helpers/db.ts — test database setup/teardown utilities

At the end of your response, output this block exactly:

<handoff>
  <phase>7A</phase>
  <test_coverage_targets>
    - [file, current coverage estimate, target]
  </test_coverage_targets>
  <critical_paths_covered>
    - [E2E scenario name and steps]
  </critical_paths_covered>
  <mock_strategy>
    - [service, mock approach, fixture location]
  </mock_strategy>
  <open_questions>
    - [gaps for 7B automation to enforce]
  </open_questions>
  <context_for_next>
    [2–3 sentences on test infrastructure for 7B to build CI gates around]
  </context_for_next>
</handoff>
```

---

### Prompt 7B: QA Automation Engineer

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 7A here]

ROLE:
You are a QA Automation Engineer focused on CI/CD quality gates.

CONSTRAINTS:
- CI must fail on: coverage < 90%, any lint error, any type error, critical vulnerability
- Security scanning: npm audit --audit-level=high in every PR
- Dependency check: Dependabot config for weekly updates
- Performance: Lighthouse CI with score thresholds (perf > 80, a11y > 90)
- Load testing: k6 — define baseline (p95 < 500ms at 100 concurrent users)
- Smoke tests: run on every deployment, within 2 minutes
- No flaky tests shipped — mark known-flaky as .skip with issue link

TEST INFRASTRUCTURE:
[From handoff context_for_next]

DELIVERABLES:
1. .github/workflows/ci.yml — updated with all quality gates
2. .github/dependabot.yml — weekly dep updates
3. lighthouserc.json — Lighthouse CI thresholds
4. tests/load/baseline.k6.js — k6 baseline load test
5. tests/smoke/smoke.spec.ts — post-deploy smoke test suite

At the end of your response, output this block exactly:

<handoff>
  <phase>7B</phase>
  <quality_gates>
    - [gate name, threshold, what it blocks]
  </quality_gates>
  <ci_pipeline_stages>
    - [stage name, runs on, approximate duration]
  </ci_pipeline_stages>
  <smoke_test_coverage>
    - [smoke test scenario and success criteria]
  </smoke_test_coverage>
  <open_questions>
    - [anything for Phase 8 deployment to enforce]
  </open_questions>
  <context_for_next>
    [2–3 sentences on CI gates and deployment prerequisites for Phase 8]
  </context_for_next>
</handoff>
```

---

## Phase 8: Deployment & Production Readiness

### Prompt 8A: DevOps Engineer — Production Deployment

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 7B here]

ROLE:
You are a DevOps Engineer specializing in production deployments.

CONSTRAINTS:
- Zero-downtime: rolling deployment, health checks before traffic shift
- Secrets: never in image layers, always injected at runtime
- SSL: TLS 1.2 minimum, TLS 1.3 preferred — document cert rotation
- CDN: static assets on CDN with content-hash filenames (cache-busting)
- Database migrations: run pre-deployment, reversible, < 30s for blue-green safety
- Rollback: one-command rollback with < 5 minute RTO
- Observability: reference the companion observability stack (Prometheus/Grafana/Loki/Tempo)

CI PREREQUISITES:
[From handoff context_for_next]

DELIVERABLES:
1. Dockerfile.prod — multi-stage, non-root user, minimal attack surface
2. kubernetes/ or docker-compose.prod.yml — production config
3. scripts/deploy.sh — deploy with pre-flight checks
4. scripts/rollback.sh — one-command rollback
5. DEPLOYMENT.md — runbook: prerequisites, steps, rollback, DNS

At the end of your response, output this block exactly:

<handoff>
  <phase>8A</phase>
  <deployment_strategy>
    - [rolling / blue-green / canary — chosen and rationale]
  </deployment_strategy>
  <health_check_endpoints>
    - [path, expected response, timeout]
  </health_check_endpoints>
  <rollback_procedure>
    - [steps and estimated time]
  </rollback_procedure>
  <env_vars_final>
    - [complete list of all .env vars across all phases — final consolidated list]
  </env_vars_final>
  <open_questions>
    - [anything for 8B SRE to monitor]
  </open_questions>
  <context_for_next>
    [2–3 sentences on deployment architecture and SLO targets for 8B to monitor]
  </context_for_next>
</handoff>
```

---

### Prompt 8B: Site Reliability Engineer

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from 8A here]

ROLE:
You are a Site Reliability Engineer focused on production observability.

CONSTRAINTS:
- SLO: 99.9% availability (< 8.7 hours downtime/year) — define error budget
- Alerting thresholds: error rate > 1% for 2min = P1, > 5% = P0
- Response times: p95 < 500ms, p99 < 2s — alert on breach
- Log retention: 90 days minimum, no PII in logs
- Runbook: top 5 failure modes with recovery steps
- On-call: define escalation path (P0 < 5min, P1 < 15min, P2 < 1hr)
- Reference observability stack: Prometheus :9090, Grafana :3000, Loki :3100, Tempo :3200

DEPLOYMENT ARCHITECTURE:
[From handoff context_for_next]

DELIVERABLES:
1. prometheus/alerts/app.yml — alert rules for SLO + error rate + latency
2. grafana/dashboards/app-overview.json — Grafana dashboard JSON
3. RUNBOOK.md — top 5 failure modes + recovery steps
4. docs/SLO.md — error budget definition, burn rate calculation

At the end of your response, output this block exactly:

<handoff>
  <phase>8B</phase>
  <slos_defined>
    - [SLO name, target, measurement window]
  </slos_defined>
  <alerts_defined>
    - [alert name, threshold, severity, receiver]
  </alerts_defined>
  <runbook_scenarios>
    - [failure mode and recovery time estimate]
  </runbook_scenarios>
  <project_complete>true</project_complete>
  <final_checklist>
    - [ ] All .env vars documented
    - [ ] All OWASP items addressed
    - [ ] Test coverage >= 90%
    - [ ] Smoke tests passing
    - [ ] Rollback tested
    - [ ] SLOs defined and alerting active
    - [ ] Observability stack deployed
    - [ ] Runbook written
  </final_checklist>
</handoff>
```

---

## Utility Prompts

### Refinement Prompt (use when output quality is insufficient)

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from the phase you're refining]

ROLE:
You are a Senior Code Reviewer.

CONSTRAINTS:
- Focus only on what's broken, missing, or risky — no praise
- Tag findings: [BUG], [SECURITY], [PERFORMANCE], [MAINTAINABILITY], [MISSING]
- Provide corrected code snippet for every finding
- Do not rewrite sections that are correct

REVIEW THIS OUTPUT:
[Paste code/output from the phase being refined]

DELIVERABLES:
1. Findings list (tagged)
2. Corrected code snippets only for each finding
3. Updated <handoff> block reflecting fixes
```

---

### Integration Validation Prompt (run after each phase)

```
[HANDOFF FROM PREVIOUS PHASE]
[Paste <handoff> block from current phase]

ROLE:
You are a Systems Integration Engineer.

CONSTRAINTS:
- Check contracts only — does the new addition break any prior phase's contracts?
- Reference handoff blocks from all prior phases
- Flag breaking changes as [BREAKING: phase affected]
- Flag assumptions that are now invalid as [STALE ASSUMPTION]

CURRENT CODEBASE STATE:
[Summarize files changed this phase]

NEW ADDITION:
[Describe what was added]

DELIVERABLES:
1. Contract validation report — PASS/FAIL per prior phase
2. Breaking change list (if any) with fix
3. Updated assumptions list
```

---

### Final Quality Gate

```
ACCUMULATED HANDOFFS:
[Paste all <handoff> blocks from 1A through 8B]

ROLE:
You are a Technical Architect doing a final production readiness review.

CONSTRAINTS:
- Go/No-Go decision required — no "it depends"
- Every NO requires a specific fix with estimated effort
- Do not flag theoretical risks — only production-blocking issues

FINAL CHECKLIST:
- [ ] Security: OWASP Top 10 addressed (from 4A handoff)
- [ ] Auth: JWT + refresh + RLS verified (from 4A + 3A handoffs)
- [ ] Coverage: >= 90% enforced in CI (from 7A + 7B handoffs)
- [ ] Performance: p95 < 500ms verified (from 8B handoff)
- [ ] Error handling: no stack traces in production (from 2B handoff)
- [ ] Secrets: all in env vars, none in code (from 8A handoff)
- [ ] Monitoring: SLOs defined and alerting active (from 8B handoff)
- [ ] Rollback: tested and < 5 min RTO (from 8A handoff)
- [ ] Documentation: README, DEPLOYMENT.md, RUNBOOK.md exist
- [ ] Smoke tests: passing on staging

DELIVERABLE:
GO / NO-GO with specific blockers and effort estimates for any NO items.
```

---

*Cursor AI Prompt Chain System v2.0*  
*Changes: constraint-driven prompting, XML handoff blocks, pinned dependency versions, Zod replacing Joi, Vitest replacing Jest, Resend as preferred email provider*  
*Compatible with: Claude Sonnet 4.6, GPT-4o, Gemini 1.5 Pro*
