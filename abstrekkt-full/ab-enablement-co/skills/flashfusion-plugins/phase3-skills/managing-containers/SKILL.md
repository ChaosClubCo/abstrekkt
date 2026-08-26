---
name: managing-containers
description: >
  Manages containerized applications with Docker, Kubernetes, and container orchestration best practices. Activates when writing Dockerfiles, configuring K8s manifests, implementing Helm charts, or managing container registries. Also triggers on: Docker, Kubernetes, K8s, container, Helm, pod, deployment, service mesh, Istio, or container registry. Even if someone says 'containerize this' or 'K8s config' — use this skill.
version: 1.0.0
category: DevOps & Infrastructure
---

# Managing Containers

> **Category:** DevOps & Infrastructure | **Scope:** Intinc Platform | **Version:** 1.0.0

Provides container management at Intinc — Dockerfile optimization, K8s manifest design, Helm chart templating, resource limits, and pod security.

---

## Quick-Start Decision Tree

```
Managing Containers request arrives
  ├─ New implementation? ────── Requirements → Design → Implement → Test → Deploy
  ├─ Fixing existing issue? ─── Diagnose → Root Cause → Fix → Validate → Document
  ├─ Scaling/optimizing? ────── Profile → Identify Bottleneck → Design Fix → Benchmark → Deploy
  ├─ Compliance requirement? ── Map Requirement → Gap Analysis → Implement → Evidence → Audit
  └─ Knowledge transfer? ────── Document → Standard → Template → Train → Review
```

---

## Usage Examples

**Example 1: "Set up managing containers for the new microservice."**

> Review existing patterns → apply platform template → configure for service requirements → test in staging → validate monitoring/alerting → promote to production.

**Example 2: "Our managing containers setup is causing incidents."**

> Audit current configuration → correlate with incident history → identify gaps vs best practices → prioritize fixes by blast radius → implement with change management → verify with chaos testing.

**Example 3: "We're migrating to a new approach for managing containers."**

> Document current state → define target state → plan migration phases → implement expand step → validate in parallel → contract old approach → clean up.

---

## Golden Path Workflow

1. Assess current state and requirements for managing containers
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

**Manual changes** — Never modify infrastructure for managing containers outside IaC. If you clicked it, it will drift.
**Testing only in prod** — Always validate managing containers changes in staging first. Production is not your test environment.
**Alert fatigue** — Too many alerts for managing containers means none get attention. Tune for actionable alerts only.
**Single point of failure** — Ensure managing containers has redundancy. If one node dying pages you at 3 AM, you designed it wrong.

---

## Cross-Skill References

- **managing-secrets** — Related infrastructure and deployment skill for comprehensive coverage
- **implementing-observability** — Related infrastructure and deployment skill for comprehensive coverage
- **planning-disaster-recovery** — Related infrastructure and deployment skill for comprehensive coverage
- **building-ci-cd-pipelines** — Related infrastructure and deployment skill for comprehensive coverage
- **building-ci-cd-pipelines** — Deployment automation for infrastructure changes

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
