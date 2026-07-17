---
name: building-cli-tools
description: >
  Builds production-quality CLI tools with argument parsing, output formatting, and developer ergonomics. Activates when creating CLI applications, designing command structures, implementing interactive prompts, or building developer tools. Also triggers on: CLI, command line, terminal tool, argparse, Commander, Cobra, Click, interactive prompt, or developer tooling. Even if someone says 'build a CLI for this' or 'developer tool' — use this skill.
version: 1.0.0
category: Platform Engineering
---

# Building CLI Tools

> **Category:** Platform Engineering | **Scope:** Intinc Platform | **Version:** 1.0.0

Provides CLI tool development at Intinc — command structure design, argument parsing, output formatting, interactive modes, and distribution packaging.

---

## Quick-Start Decision Tree

```
Building CLI Tools request arrives
  ├─ New implementation? ────── Requirements → Design → Implement → Test → Deploy
  ├─ Fixing existing issue? ─── Diagnose → Root Cause → Fix → Validate → Document
  ├─ Scaling/optimizing? ────── Profile → Identify Bottleneck → Design Fix → Benchmark → Deploy
  ├─ Compliance requirement? ── Map Requirement → Gap Analysis → Implement → Evidence → Audit
  └─ Knowledge transfer? ────── Document → Standard → Template → Train → Review
```

---

## Usage Examples

**Example 1: "Standardize building cli tools across all teams."**

> Survey current practices → identify best patterns → design standard + golden path → implement tooling → rollout with migration guide → measure adoption.

**Example 2: "New project needs building cli tools from scratch."**

> Apply platform template → configure for project requirements → verify against quality gates → onboard team → iterate based on feedback → contribute improvements back to platform.

**Example 3: "Technical debt in our building cli tools is slowing us down."**

> Audit current state → classify debt items by impact → estimate remediation effort → propose to sprint planning → implement incrementally → measure improvement.

---

## Golden Path Workflow

1. Assess current state and requirements for building cli tools
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

**Mandating without migration path** — Don't enforce new building cli tools standards without providing migration tooling and timelines.
**Building for one team** — Platform building cli tools must work for all teams. If it only solves your problem, it's not a platform.
**Ignoring developer feedback** — If teams work around your building cli tools tooling, the tool is wrong, not the teams.
**No escape hatch** — Platform building cli tools must allow overrides for edge cases. Rigid tools breed shadow IT.

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
