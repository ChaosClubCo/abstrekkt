---
name: designing-sdk-libraries
description: >
  Designs client SDK libraries with ergonomic APIs, error handling, retry logic, and multi-language support. Activates when building API client libraries, designing SDK interfaces, implementing retry logic, or managing SDK versioning. Also triggers on: SDK, client library, API wrapper, SDK design, type-safe client, code generation, or OpenAPI codegen. Even if someone says 'build a client library' or 'SDK for our API' — use this skill.
version: 1.0.0
category: Platform Engineering
---

# Designing SDK Libraries

> **Category:** Platform Engineering | **Scope:** Intinc Platform | **Version:** 1.0.0

Guides SDK library design at Intinc — API ergonomics, error taxonomy, retry/backoff patterns, type generation, and versioning strategy for multi-language support.

---

## Quick-Start Decision Tree

```
Designing SDK Libraries request arrives
  ├─ New implementation? ────── Requirements → Design → Implement → Test → Deploy
  ├─ Fixing existing issue? ─── Diagnose → Root Cause → Fix → Validate → Document
  ├─ Scaling/optimizing? ────── Profile → Identify Bottleneck → Design Fix → Benchmark → Deploy
  ├─ Compliance requirement? ── Map Requirement → Gap Analysis → Implement → Evidence → Audit
  └─ Knowledge transfer? ────── Document → Standard → Template → Train → Review
```

---

## Usage Examples

**Example 1: "Standardize designing sdk libraries across all teams."**

> Survey current practices → identify best patterns → design standard + golden path → implement tooling → rollout with migration guide → measure adoption.

**Example 2: "New project needs designing sdk libraries from scratch."**

> Apply platform template → configure for project requirements → verify against quality gates → onboard team → iterate based on feedback → contribute improvements back to platform.

**Example 3: "Technical debt in our designing sdk libraries is slowing us down."**

> Audit current state → classify debt items by impact → estimate remediation effort → propose to sprint planning → implement incrementally → measure improvement.

---

## Golden Path Workflow

1. Assess current state and requirements for designing sdk libraries
2. Review Intinc standards and existing patterns for developer experience and platform services
3. Design approach using proven patterns (Backstage, GitHub, ESLint, Prettier, Renovate)
4. Document architecture decisions with rationale
5. Implement with tests (unit, integration, security)
6. Validate against developer productivity, consistency, maintainability, governance criteria
7. Code review with security and architecture focus
8. Deploy to staging with monitoring
9. Production rollout with rollback plan
10. Post-deployment validation and documentation update

---

## Edge Cases & Anti-Patterns

**Mandating without migration path** — Don't enforce new designing sdk libraries standards without providing migration tooling and timelines.
**Building for one team** — Platform designing sdk libraries must work for all teams. If it only solves your problem, it's not a platform.
**Ignoring developer feedback** — If teams work around your designing sdk libraries tooling, the tool is wrong, not the teams.
**No escape hatch** — Platform designing sdk libraries must allow overrides for edge cases. Rigid tools breed shadow IT.

---

## Cross-Skill References

- **building-developer-platforms** — Related developer experience and platform services skill for comprehensive coverage
- **automating-code-quality** — Related developer experience and platform services skill for comprehensive coverage
- **managing-technical-debt** — Related developer experience and platform services skill for comprehensive coverage
- **designing-testing-strategies** — Related developer experience and platform services skill for comprehensive coverage
- **building-ci-cd-pipelines** — CI/CD integration for platform tooling

---

## Compliance & Security

- Platform changes must not break existing golden paths
- All internal APIs must have versioning and deprecation policies
- Code quality gates must be enforced in CI before merge
- Dependency updates must pass security and compatibility checks

**Security Checklist:**
- [ ] Threat model reviewed for this change
- [ ] Secrets and credentials handled per Intinc policy
- [ ] Access follows principle of least privilege
- [ ] Changes logged for audit trail

---

## Self-Verification Checklist

- [ ] Solution follows Intinc standards for platform engineering
- [ ] Tests cover happy path, error cases, and edge cases
- [ ] Documentation updated (API docs, runbooks, ADRs)
- [ ] Security review completed
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested
- [ ] Stakeholders notified of changes
- [ ] Performance validated under expected load

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- **CLAIMS:** All guidance follows Intinc engineering standards for platform engineering. Patterns are production-proven at scale. [GENERATED]
- **COUNTEREXAMPLE:** Specific tooling recommendations (e.g., framework versions) may change. Always verify against current Intinc tech radar.
- **CONTRADICTIONS:** None known. This skill complements rather than replaces existing platform engineering documentation.
