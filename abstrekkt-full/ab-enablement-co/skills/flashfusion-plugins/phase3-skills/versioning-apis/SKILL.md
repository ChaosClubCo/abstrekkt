---
name: versioning-apis
description: >
  Manages API versioning with backward compatibility, deprecation policies, migration paths, and changelog generation. Activates when versioning APIs, planning breaking changes, implementing deprecation warnings, or managing API lifecycle. Also triggers on: API versioning, breaking change, backward compatibility, deprecation, API lifecycle, semantic versioning, API migration, or changelog. Even if someone says 'how do we ship v2 without breaking v1' — use this skill.
version: 1.0.0
category: Backend & API Design
---

# Versioning APIs

> **Category:** Backend & API Design | **Scope:** Intinc Platform | **Version:** 1.0.0

Guides API versioning at Intinc — versioning strategies, backward compatibility checks, deprecation workflows, migration tooling, and client notification protocols.

---

## Quick-Start Decision Tree

```
Versioning APIs request arrives
  ├─ New implementation? ────── Requirements → Design → Implement → Test → Deploy
  ├─ Fixing existing issue? ─── Diagnose → Root Cause → Fix → Validate → Document
  ├─ Scaling/optimizing? ────── Profile → Identify Bottleneck → Design Fix → Benchmark → Deploy
  ├─ Compliance requirement? ── Map Requirement → Gap Analysis → Implement → Evidence → Audit
  └─ Knowledge transfer? ────── Document → Standard → Template → Train → Review
```

---

## Usage Examples

**Example 1: "We need to versioning apis for the new customer portal."**

> Assess current architecture → define requirements (latency, throughput, compatibility) → design schema/contract → implement with tests → deploy behind feature flag → monitor and iterate.

**Example 2: "Our existing approach to versioning apis isn't scaling."**

> Profile current bottlenecks → identify root causes (N+1, missing indexes, poor caching) → design targeted fixes → implement with benchmarks → validate under load → document decisions.

**Example 3: "New team member asks: what's our standard for versioning apis?"**

> Point to internal standards doc → walk through decision tree → review existing examples in codebase → pair on first implementation → code review against checklist → add to team onboarding.

---

## Golden Path Workflow

1. Assess current state and requirements for versioning apis
2. Review Intinc standards and existing patterns for API and service architecture
3. Design approach using proven patterns (Postman, OpenAPI, gRPC, GraphQL, REST)
4. Document architecture decisions with rationale
5. Implement with tests (unit, integration, security)
6. Validate against backward compatibility, latency, scalability, documentation criteria
7. Code review with security and architecture focus
8. Deploy to staging with monitoring
9. Production rollout with rollback plan
10. Post-deployment validation and documentation update

---

## Edge Cases & Anti-Patterns

**Premature abstraction** — Don't over-engineer versioning apis before you have 3+ concrete use cases. Start simple, refactor when patterns emerge.
**Ignoring backward compatibility** — Any change to versioning apis must consider existing consumers. Use expand/contract or versioning.
**Missing error handling** — Happy path only is not production-ready. Design for failures, timeouts, and partial results.
**Documentation drift** — Specs that don't match implementation are worse than no specs. Auto-generate where possible.

---

## Cross-Skill References

- **implementing-observability** — Related API and service architecture skill for comprehensive coverage
- **conducting-security-testing** — Related API and service architecture skill for comprehensive coverage
- **designing-testing-strategies** — Related API and service architecture skill for comprehensive coverage
- **designing-database-schemas** — Related API and service architecture skill for comprehensive coverage
- **implementing-authentication** — Auth patterns for API endpoints

---

## Compliance & Security

- API changes must follow backward compatibility policy
- All endpoints must have OpenAPI documentation
- Breaking changes require deprecation notice period
- Public APIs must enforce rate limiting

**Security Checklist:**
- [ ] Threat model reviewed for this change
- [ ] Secrets and credentials handled per Intinc policy
- [ ] Access follows principle of least privilege
- [ ] Changes logged for audit trail

---

## Self-Verification Checklist

- [ ] Solution follows Intinc standards for backend & api design
- [ ] Tests cover happy path, error cases, and edge cases
- [ ] Documentation updated (API docs, runbooks, ADRs)
- [ ] Security review completed
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested
- [ ] Stakeholders notified of changes
- [ ] Performance validated under expected load

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- **CLAIMS:** All guidance follows Intinc engineering standards for backend & api design. Patterns are production-proven at scale. [GENERATED]
- **COUNTEREXAMPLE:** Specific tooling recommendations (e.g., framework versions) may change. Always verify against current Intinc tech radar.
- **CONTRADICTIONS:** None known. This skill complements rather than replaces existing backend & api design documentation.
