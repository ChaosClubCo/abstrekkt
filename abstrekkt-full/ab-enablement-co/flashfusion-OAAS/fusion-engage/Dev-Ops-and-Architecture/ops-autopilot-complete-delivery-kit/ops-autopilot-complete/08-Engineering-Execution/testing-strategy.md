# Testing Strategy

> **Audience:** ENG | **Phase:** ALL

---

## Test Pyramid

```
         ╱╲
        ╱ E2E ╲          5–10 tests (slow, expensive, high confidence)
       ╱────────╲
      ╱Integration╲      50–100 tests (medium speed, real dependencies)
     ╱──────────────╲
    ╱   Unit Tests    ╲   500+ tests (fast, isolated, high coverage)
   ╱────────────────────╲
```

## Unit Tests

**Tool:** Jest + ts-jest
**Coverage target:** >80%
**What to test:**
- Policy engine rule matching
- Idempotency key generation
- HMAC signature generation and verification
- Chain hash computation
- Error sanitization regex patterns
- Input validation schemas
- Rate limit calculations
- TTL expiry logic

## Integration Tests

**Tool:** Jest + Supertest (API) + Supabase local (database)
**What to test:**
- API endpoints: request → response validation
- RLS enforcement: cross-tenant queries blocked
- Approval flow: create → decide → resume/fail
- Audit log: event triggers create correct entries
- Database migrations: up + down scripts

## End-to-End Tests

**Tool:** Custom scripts (TypeScript) against staging environment
**What to test:**
- Full workflow execution: trigger → all steps → completion
- Approval flow: trigger → pause → approve → resume
- Idempotency: duplicate trigger → same result
- Error recovery: connector failure → retry → DLQ
- Kill-switch: activate → pause → resume

## Security Tests

**Prompt injection:** 50 payloads (see 02-Security/prompt-injection-defense.md)
**SQL injection:** 10 payloads against all API endpoints
**XSS:** 10 payloads in context fields
**RLS bypass:** 50 cross-tenant queries
**Secret exposure:** 50 error payloads through sanitization layer

## Load Tests

**Tool:** k6 or Artillery
**Targets:**
| Test | Target | When |
|------|--------|------|
| Single workflow | 100 runs in 10 min | Week 4 |
| Concurrent | 50 simultaneous workflows | Week 8 |
| Approval engine | 100 pending approvals | Week 8 |
| Database | 1M rows, queries <500ms | Week 12 |
| Full system | 1000 concurrent | Week 15 |

## Test Data

- 5 test customers (A–E) with different tiers
- 10 test users per customer (agents, managers, admins)
- Pre-seeded workflows, policies, and connectors
- Mock connectors for CI (no real Azure AD/Slack in unit tests)
- Staging environment with real connectors for E2E

## CI/CD Integration

```
On every PR:
  1. Lint (eslint) — 10s
  2. Unit tests (jest) — 30s
  3. Integration tests (jest + supabase local) — 60s
  4. Build — 30s
  Total: ~2 min

On merge to main:
  5. Deploy to staging — 60s
  6. E2E tests against staging — 5 min
  7. If pass: deploy to production — 60s
  Total: ~8 min
```
