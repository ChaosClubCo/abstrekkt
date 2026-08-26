---
name: building-ci-cd-pipelines
description: >
  Builds continuous integration and deployment pipelines with testing gates, artifact management, and rollback strategies. Activates when configuring GitHub Actions, GitLab CI, Jenkins, or CircleCI, implementing deployment strategies, or managing build artifacts. Also triggers on: CI/CD, pipeline, GitHub Actions, deployment, build, artifact, continuous integration, continuous delivery, blue-green, canary, or rollback. Even if someone says 'automate deployments' or 'fix the pipeline' — use this skill.
version: 1.0.0
category: DevOps & Infrastructure
---

# Building CI/CD Pipelines

> **Category:** DevOps & Infrastructure | **Scope:** Intinc Platform | **Version:** 1.0.0

Guides CI/CD pipeline design at Intinc — build optimization, test gating, deployment strategies, artifact management, and rollback automation.

---

## Quick-Start Decision Tree

```
Building CI/CD Pipelines request arrives
  ├─ New implementation? ────── Requirements → Design → Implement → Test → Deploy
  ├─ Fixing existing issue? ─── Diagnose → Root Cause → Fix → Validate → Document
  ├─ Scaling/optimizing? ────── Profile → Identify Bottleneck → Design Fix → Benchmark → Deploy
  ├─ Compliance requirement? ── Map Requirement → Gap Analysis → Implement → Evidence → Audit
  └─ Knowledge transfer? ────── Document → Standard → Template → Train → Review
```

---

## Usage Examples

**Example 1: "Set up building ci/cd pipelines for the new microservice."**

> Review existing patterns → apply platform template → configure for service requirements → test in staging → validate monitoring/alerting → promote to production.

**Example 2: "Our building ci/cd pipelines setup is causing incidents."**

> Audit current configuration → correlate with incident history → identify gaps vs best practices → prioritize fixes by blast radius → implement with change management → verify with chaos testing.

**Example 3: "We're migrating to a new approach for building ci/cd pipelines."**

> Document current state → define target state → plan migration phases → implement expand step → validate in parallel → contract old approach → clean up.

---

## Golden Path Workflow

1. Assess current state and requirements for building ci/cd pipelines
2. Review Intinc standards and existing patterns for infrastructure and deployment
3. Design approach using proven patterns (Terraform, Docker, Kubernetes, GitHub Actions, Prometheus)
4. Document architecture decisions with rationale
5. Implement with tests (unit, integration, security)
6. Validate against reliability, cost, security, reproducibility criteria
7. Code review with security and architecture focus
8. Deploy to staging with monitoring
9. Production rollout with rollback plan
10. Post-deployment validation and documentation update

---

## Edge Cases & Anti-Patterns

**Manual changes** — Never modify infrastructure for building ci/cd pipelines outside IaC. If you clicked it, it will drift.
**Testing only in prod** — Always validate building ci/cd pipelines changes in staging first. Production is not your test environment.
**Alert fatigue** — Too many alerts for building ci/cd pipelines means none get attention. Tune for actionable alerts only.
**Single point of failure** — Ensure building ci/cd pipelines has redundancy. If one node dying pages you at 3 AM, you designed it wrong.

---

## Cross-Skill References

- **managing-secrets** — Related infrastructure and deployment skill for comprehensive coverage
- **implementing-observability** — Related infrastructure and deployment skill for comprehensive coverage
- **planning-disaster-recovery** — Related infrastructure and deployment skill for comprehensive coverage
- **implementing-audit-logging** — Compliance logging for infra operations

---

## Compliance & Security

- Infrastructure changes must go through IaC pipeline
- All deployments must have rollback capability
- Secrets must never appear in plaintext in repos or logs
- DR procedures must be tested quarterly

**Security Checklist:**
- [ ] Threat model reviewed for this change
- [ ] Secrets and credentials handled per Intinc policy
- [ ] Access follows principle of least privilege
- [ ] Changes logged for audit trail

---

## Self-Verification Checklist

- [ ] Solution follows Intinc standards for devops & infrastructure
- [ ] Tests cover happy path, error cases, and edge cases
- [ ] Documentation updated (API docs, runbooks, ADRs)
- [ ] Security review completed
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested
- [ ] Stakeholders notified of changes
- [ ] Performance validated under expected load

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- **CLAIMS:** All guidance follows Intinc engineering standards for devops & infrastructure. Patterns are production-proven at scale. [GENERATED]
- **COUNTEREXAMPLE:** Specific tooling recommendations (e.g., framework versions) may change. Always verify against current Intinc tech radar.
- **CONTRADICTIONS:** None known. This skill complements rather than replaces existing devops & infrastructure documentation.
