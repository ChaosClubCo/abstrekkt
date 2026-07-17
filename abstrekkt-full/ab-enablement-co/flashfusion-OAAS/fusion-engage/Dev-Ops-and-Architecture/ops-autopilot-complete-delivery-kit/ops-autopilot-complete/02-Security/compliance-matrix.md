# Compliance Matrix — Regulatory Control Mapping

> **Audience:** LEAD, EXEC
> **Phase:** Beta (Weeks 5–12)
> **Last Updated:** 2025-02-13

---

## Scope

This matrix maps Ops Autopilot platform controls to common compliance frameworks. It covers the **control plane** (INT-managed SaaS). Customer n8n instances are customer-managed and fall under the customer's own compliance scope.

**Shared responsibility model:** INT is responsible for control plane security. Customers are responsible for their n8n instance, network, and connector credentials.

---

## SOC 2 Type II Mapping

### CC1: Control Environment

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC1.1 — Integrity & ethics | Organization demonstrates commitment | Security-first design principles documented | This security documentation suite |
| CC1.2 — Board oversight | Oversight of internal controls | Go/No-Go checklist includes security gates | [go-no-go-checklist.md](../00-Executive-Summary/go-no-go-checklist.md) |
| CC1.3 — Management structure | Authority and responsibility established | RBAC model with defined roles | [rbac-model.md](./rbac-model.md) |

### CC2: Communication & Information

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC2.1 — Internal communication | Relevant info communicated internally | Incident communication templates, post-mortem process | [incident-response.md](./incident-response.md) |
| CC2.2 — External communication | Info communicated to external parties | Customer notification templates, SLA | [service-level-agreement.md](../07-Customer-Materials/service-level-agreement.md) |

### CC3: Risk Assessment

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC3.1 — Risk objectives | Objectives specified with sufficient clarity | SLOs defined per tier | [slos-and-metrics.md](../03-Ops/slos-and-metrics.md) |
| CC3.2 — Risk identification | Risks identified and analyzed | STRIDE threat model, 10 threats cataloged | [threat-model.md](./threat-model.md) |
| CC3.4 — Fraud risk | Fraud risk assessed | Insider threat analysis, audit trail | [threat-model.md](./threat-model.md) (T6) |

### CC5: Control Activities

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC5.1 — Control activities selected | Controls mitigate risks to acceptable level | Multi-layer defense: RLS, RBAC, HMAC, mTLS | Full 02-Security/ directory |
| CC5.2 — Technology controls | General controls over technology | CI/CD pipeline, automated testing, dependency scanning | [deployment-pipeline.md](../08-Engineering-Execution/deployment-pipeline.md) |

### CC6: Logical & Physical Access

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC6.1 — Logical access security | Logical access restricted | JWT + RLS + RBAC, 4-layer isolation model | [isolation-model.md](../01-Architecture/isolation-model.md) |
| CC6.2 — Access provisioning | New users authorized appropriately | Customer roles assigned by it_admin only | [rbac-model.md](./rbac-model.md) |
| CC6.3 — Access modification | Changes authorized appropriately | Role changes logged in audit trail | [audit-logging.md](./audit-logging.md) |
| CC6.6 — External threats | System protected from external threats | Cloudflare WAF, rate limiting, mTLS | [isolation-model.md](../01-Architecture/isolation-model.md) |
| CC6.7 — Access removal | Access removed when no longer needed | INT support access time-limited (4hr JWT) | [rbac-model.md](./rbac-model.md) |

### CC7: System Operations

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC7.1 — Detection of changes | Infrastructure and software changes detected | CI/CD audit trail, deployment logs | GitHub Actions logs |
| CC7.2 — Monitoring | Anomalous activity detected | Prometheus alerts, PagerDuty, kill-switch | [incident-response.md](./incident-response.md) |
| CC7.3 — Evaluation | Detected events evaluated | Triage flowchart, escalation matrix | [on-call-rotation.md](../03-Ops/on-call-rotation.md) |
| CC7.4 — Remediation | Incidents remediated | Incident response procedure, post-mortems | [incident-response.md](./incident-response.md) |

### CC8: Change Management

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC8.1 — Change authorization | Changes authorized before implementation | PR review required, automated tests must pass | [pr-checklist.md](../08-Engineering-Execution/pr-checklist.md) |

### CC9: Risk Mitigation (Vendors)

| Control | SOC2 Criteria | Implementation | Evidence |
|---------|--------------|----------------|----------|
| CC9.1 — Vendor risk | Vendor risks assessed and managed | Dependency auditing, connector security review | [connector-strategy.md](../01-Architecture/connector-strategy.md) |

---

## GDPR Mapping

| Article | Requirement | Implementation | Status |
|---------|------------|----------------|--------|
| Art. 5(1)(a) | Lawfulness, fairness, transparency | Customer data processing agreement (DPA) | Template ready |
| Art. 5(1)(b) | Purpose limitation | Data processed only for workflow execution | Enforced by architecture |
| Art. 5(1)(c) | Data minimization | Control plane stores only hashes and metadata | [system-overview.md](../01-Architecture/system-overview.md) |
| Art. 5(1)(e) | Storage limitation | Retention policies per tier (1–7 years) | [audit-logging.md](./audit-logging.md) |
| Art. 5(1)(f) | Integrity and confidentiality | Encryption (TLS 1.3, AES-256), HMAC signing | Multiple docs |
| Art. 12–14 | Transparency and information | Privacy policy, DPA | Template ready |
| Art. 15 | Right of access | Customer can query all their data via API | Dashboard + API |
| Art. 17 | Right to erasure | Customer data export + deletion procedure | Implemented |
| Art. 25 | Data protection by design | Zero-knowledge secrets, RLS, isolation | Architecture review |
| Art. 28 | Processor obligations | DPA with sub-processor list (Supabase, Vercel, Cloudflare) | Template ready |
| Art. 32 | Security of processing | Encryption, access controls, testing | Full 02-Security/ suite |
| Art. 33 | Breach notification | 72-hour notification procedure | [incident-response.md](./incident-response.md) |
| Art. 35 | DPIA | Data Protection Impact Assessment | To be completed pre-GA |

---

## HIPAA Mapping (Enterprise Tier — If Applicable)

| Safeguard | Requirement | Implementation | Gap |
|-----------|------------|----------------|-----|
| §164.312(a) | Access control | RBAC + RLS + JWT | None |
| §164.312(b) | Audit controls | Immutable audit log, HMAC-signed | None |
| §164.312(c) | Integrity | Chain hashing, tamper detection | None |
| §164.312(d) | Person authentication | OAuth2, MFA (customer-managed) | Customer responsibility |
| §164.312(e) | Transmission security | TLS 1.3, mTLS | None |
| §164.308(a)(1) | Security management | Risk analysis (threat model) | None |
| §164.308(a)(5) | Security awareness | Training materials | To be created |
| §164.308(a)(6) | Security incident procedures | Kill-switch, forensics, post-mortem | None |
| §164.310(d) | Device and media controls | N/A (SaaS, no physical devices) | N/A |

**Note:** HIPAA compliance requires a Business Associate Agreement (BAA). Template to be developed for Enterprise customers handling PHI.

---

## PCI-DSS Mapping (If Applicable — Payment Data Workflows)

| Requirement | Implementation | Gap |
|-------------|----------------|-----|
| Req 1: Firewall | Cloudflare WAF, customer VPN | None |
| Req 3: Protect stored data | Zero-knowledge (no payment data stored by INT) | None — INT never processes payment data |
| Req 4: Encrypt transmission | TLS 1.3 everywhere | None |
| Req 6: Secure development | PR reviews, automated testing, dependency scanning | None |
| Req 7: Restrict access | RBAC, least privilege | None |
| Req 8: Authentication | JWT, unique IDs per user | None |
| Req 10: Track and monitor | Audit log, Prometheus, PagerDuty | None |
| Req 11: Regular testing | Security audit (pre-GA), quarterly dependency scan | None |

**Note:** Ops Autopilot is not designed to process payment card data. If a customer workflow touches PCI-scoped data, it remains in the customer's n8n instance and never reaches the control plane.

---

## Compliance Readiness Summary

| Framework | Readiness | Target Date | Gaps |
|-----------|-----------|-------------|------|
| SOC2 Type II | 85% controls mapped | GA + 6 months | Formal audit engagement needed |
| GDPR | 90% | GA (Week 17) | DPIA to complete, DPA template to finalize |
| HIPAA | 80% | Enterprise launch | BAA template, training materials |
| PCI-DSS | N/A (out of scope) | — | Only relevant if customer processes card data |
