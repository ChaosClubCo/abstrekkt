---
name: engineering-patterns
description: >
  Production engineering pattern library spanning 11 phases: Foundation, Resilience,
  Performance, Data Integrity, Observability, Deployment, Scalability, Edge Cases,
  Security Deep, Compliance/DR/FinOps, and AI/HITL. Activates when auditing code for
  production readiness, applying hardening patterns, reviewing system design, or when
  the user asks about production patterns, engineering best practices, pattern audit,
  apply phase, harden this, production-ready, resilience patterns, observability gaps,
  security review, DR plan, FinOps, or AI guardrails. Use alongside engineering-staff-workflows
  for full Staff Engineer execution mode.
---

# Engineering Patterns — 11-Phase Production Library

## How to Use This Skill

1. **Audit mode** → Run `/engineering-patterns:audit-patterns` to score a codebase against all 11 phases
2. **Apply mode** → Run `/engineering-patterns:apply-phase <N>` to get actionable patterns for a specific phase
3. **Reference** → Load any `reference/phase-NN-*.md` file for deep-dive on a specific concern

---

## The 11 Phases

| # | Phase | Key Concern |
|---|-------|-------------|
| 01 | Foundation | Code quality, testing, CI/CD baseline |
| 02 | Resilience | Error handling, retries, circuit breakers |
| 03 | Performance | Caching, query optimization, profiling |
| 04 | Data Integrity | Transactions, idempotency, validation |
| 05 | Observability | Logging, tracing, metrics, alerting |
| 06 | Deployment | Blue-green, canary, feature flags, rollback |
| 07 | Scalability | Horizontal scaling, queues, sharding |
| 08 | Edge Cases | Concurrency, timeouts, large payloads |
| 09 | Security Deep | Auth, secrets, injection, supply chain |
| 10 | Compliance / DR / FinOps | Audit logs, BCP, cost controls |
| 11 | AI / HITL | LLM integration, prompt safety, human gates |

---

## Scoring System

Each phase is scored **0–5**:
- **0** — Not addressed
- **1** — Acknowledged but not implemented
- **2** — Partial implementation, gaps present
- **3** — Implemented, not tested under load/failure
- **4** — Implemented and validated
- **5** — Implemented, tested, monitored, and documented

**Target:** Phase 1–6 at ≥ 4 before shipping to production. Phase 7–11 at ≥ 3.

---

## Decision Priority (Applied Across All Phases)

**Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness**

Never sacrifice Security silently. Call out conflicts explicitly.

---

## Activation Rules

- Always state which phase(s) you are addressing
- Load the relevant `reference/phase-NN-*.md` before making recommendations
- Surface a GAPS section if any phase scoring is below 3
- Flag builder's bias if Claude expands scope beyond the requested phase


---

## CLAIMS
<!-- [SOURCED] or [GENERATED] labels for assertions in this skill. None yet — footer added by audit fix pass. -->

## COUNTEREXAMPLE
<!-- Known cases where this skill should NOT activate or may produce wrong output -->

## CONTRADICTIONS
<!-- ! Conflicts with other skills or system prompts -->
