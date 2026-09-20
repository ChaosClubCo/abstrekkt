# Go/No-Go Checklist — GA Launch Decision

> **Audience:** EXEC, LEAD | **Phase:** RC (Week 15)

---

**Meeting:** Week 15 | **Attendees:** CEO, CTO, VP Eng, Product Lead, Sales Lead
**Decision:** GO | PARTIAL GO (with limitations) | NO-GO (delay 4–8 weeks)
**Rule:** ALL "Must Have" items must be GREEN. Any RED = NO-GO or documented exception.

---

## Category 1: Product Readiness

| # | Requirement | Must Have | Status |
|---|------------|-----------|--------|
| P1 | 7 workflows tested with ≥10 customers each | YES | ☐ |
| P2 | All acceptance criteria (Gherkin) passing 100% | YES | ☐ |
| P3 | Approval engine handles all policy types | YES | ☐ |
| P4 | Idempotency prevents duplicate execution in all workflows | YES | ☐ |
| P5 | Input validation blocks all known injection patterns | YES | ☐ |
| P6 | Error messages are user-safe (no secrets, no stack traces) | YES | ☐ |

## Category 2: Reliability

| # | Requirement | Must Have | Status |
|---|------------|-----------|--------|
| R1 | 99.5% availability for 4 consecutive weeks | YES | ☐ |
| R2 | P95 latency <5s | YES | ☐ |
| R3 | Queue handles 100 concurrent workflows | YES | ☐ |
| R4 | DLQ recovery tested | YES | ☐ |
| R5 | Database restore tested, RTO <1hr, RPO <5min | YES | ☐ |

## Category 3: Security

| # | Requirement | Must Have | Status |
|---|------------|-----------|--------|
| S1 | Security audit passed (no critical/high findings) | YES | ☐ |
| S2 | No plaintext secrets in any log | YES | ☐ |
| S3 | RBAC enforced: no cross-customer data access (50 queries tested) | YES | ☐ |
| S4 | Audit log immutable (no UPDATE/DELETE) | YES | ☐ |
| S5 | Kill-switch tested 3+ times | YES | ☐ |
| S6 | Prompt injection defense tested (50 payloads, 0 successes) | YES | ☐ |

## Category 4: Customer

| # | Requirement | Must Have | Status |
|---|------------|-----------|--------|
| C1 | NPS >50 across beta cohort | YES | ☐ |
| C2 | 80%+ beta retention | YES | ☐ |
| C3 | 5+ reference customers | YES | ☐ |
| C4 | 3 case studies written | YES | ☐ |

## Category 5: Operations

| # | Requirement | Must Have | Status |
|---|------------|-----------|--------|
| O1 | On-call rotation covers business hours | YES | ☐ |
| O2 | Runbooks for top 10 failure modes | YES | ☐ |
| O3 | Monitoring dashboards operational | YES | ☐ |
| O4 | PagerDuty alerts configured | YES | ☐ |

## Category 6: Market

| # | Requirement | Must Have | Status |
|---|------------|-----------|--------|
| M1 | 3-tier pricing validated with ≥5 beta customers | YES | ☐ |
| M2 | Sales deck approved | YES | ☐ |
| M3 | Go-to-market plan drafted | YES | ☐ |

---

## Decision Outcomes

**GO:** All must-have GREEN → Announce GA, enable self-service signup, activate marketing.
**PARTIAL GO:** 85%+ GREEN, mitigations documented → Launch with caps (50 customers, limited workflows).
**NO-GO:** Critical security finding, NPS <40, availability <98% → Remediate, re-assess in 4–8 weeks.
