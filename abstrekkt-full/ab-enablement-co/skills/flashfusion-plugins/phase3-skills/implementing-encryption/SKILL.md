---
name: implementing-encryption
description: >
  Implements encryption for data at rest, in transit, and in use with key management and rotation. Activates when encrypting data, managing certificates, implementing TLS, or designing key rotation. Also triggers on: encryption, TLS, SSL, certificate, KMS, key rotation, AES, RSA, envelope encryption, or field-level encryption. Even if someone says 'encrypt this data' or 'certificate management' — use this skill.
version: 1.0.0
category: Security & Auth
---

# Implementing Encryption

> **Category:** Security & Auth | **Scope:** Intinc Platform | **Version:** 1.0.0

Provides encryption implementation at Intinc — algorithm selection, key management architecture, certificate lifecycle, and field-level encryption for sensitive data.

---

## Quick-Start Decision Tree

```
Implementing Encryption request arrives
  ├─ New implementation? ────── Requirements → Design → Implement → Test → Deploy
  ├─ Fixing existing issue? ─── Diagnose → Root Cause → Fix → Validate → Document
  ├─ Scaling/optimizing? ────── Profile → Identify Bottleneck → Design Fix → Benchmark → Deploy
  ├─ Compliance requirement? ── Map Requirement → Gap Analysis → Implement → Evidence → Audit
  └─ Knowledge transfer? ────── Document → Standard → Template → Train → Review
```

---

## Usage Examples

**Example 1: "Implement implementing encryption for the client-facing platform."**

> Threat model the attack surface → define security requirements → design controls → implement with security tests → run SAST/DAST → document for audit evidence.

**Example 2: "Security audit flagged gaps in our implementing encryption."**

> Review audit findings → classify by severity and exploitability → prioritize remediation → implement fixes → re-test → update security documentation.

**Example 3: "New compliance requirement affects our implementing encryption."**

> Map requirement to technical controls → gap analysis against current implementation → design changes → implement with compliance evidence → validate with auditor checklist → update compliance register.

---

## Golden Path Workflow

1. Assess current state and requirements for implementing encryption
2. Review Intinc standards and existing patterns for security engineering and access control
3. Design approach using proven patterns (OWASP ZAP, Snyk, Semgrep, HashiCorp Vault, OPA)
4. Document architecture decisions with rationale
5. Implement with tests (unit, integration, security)
6. Validate against threat modeling, least privilege, defense in depth, compliance criteria
7. Code review with security and architecture focus
8. Deploy to staging with monitoring
9. Production rollout with rollback plan
10. Post-deployment validation and documentation update

---

## Edge Cases & Anti-Patterns

**Security as afterthought** — Bolt-on security for implementing encryption is weaker than designed-in security. Threat model first.
**Trusting client input** — Never trust any input for implementing encryption. Validate, sanitize, and parameterize everything server-side.
**Over-broad permissions** — Start with zero access for implementing encryption and add grants. Never start permissive and try to restrict later.
**Logging sensitive data** — Audit logs for implementing encryption must never contain passwords, tokens, or PII. Mask or tokenize.

---

## Cross-Skill References

- **implementing-authentication** — Related security engineering and access control skill for comprehensive coverage
- **designing-authorization** — Related security engineering and access control skill for comprehensive coverage
- **managing-compliance-controls** — Related security engineering and access control skill for comprehensive coverage
- **implementing-audit-logging** — Security event tracking and forensics
- **managing-compliance-controls** — Framework mapping for security controls

---

## Compliance & Security

- All security controls must map to compliance framework requirements
- Security testing must be integrated into CI/CD pipeline
- Access must follow principle of least privilege
- Security incidents must be logged and reported within SLA

**Security Checklist:**
- [ ] Threat model reviewed for this change
- [ ] Secrets and credentials handled per Intinc policy
- [ ] Access follows principle of least privilege
- [ ] Changes logged for audit trail

---

## Self-Verification Checklist

- [ ] Solution follows Intinc standards for security & auth
- [ ] Tests cover happy path, error cases, and edge cases
- [ ] Documentation updated (API docs, runbooks, ADRs)
- [ ] Security review completed
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested
- [ ] Stakeholders notified of changes
- [ ] Performance validated under expected load

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- **CLAIMS:** All guidance follows Intinc engineering standards for security & auth. Patterns are production-proven at scale. [GENERATED]
- **COUNTEREXAMPLE:** Specific tooling recommendations (e.g., framework versions) may change. Always verify against current Intinc tech radar.
- **CONTRADICTIONS:** None known. This skill complements rather than replaces existing security & auth documentation.
