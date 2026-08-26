---
name: security-questionnaires
description: Comprehensive security questionnaire expertise covering SOC 2, GDPR, HIPAA, and compliance documentation. Includes response strategies, evidence gathering, and maintaining reusable compliance content. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Security Questionnaires

## Overview

Security questionnaires are vendor assessment tools used by organizations to evaluate the security posture of potential partners and vendors. This skill covers efficient response strategies, compliance framework knowledge, and maintaining reusable security content for common questionnaire formats.

Effective security questionnaire responses balance thoroughness with efficiency. They require deep understanding of security frameworks, accurate representation of controls, and the ability to communicate technical security concepts to non-technical evaluators.

This skill provides frameworks for responding to common questionnaire formats (SIG, CAIQ, custom), maintaining evergreen security documentation, and accelerating response times while maintaining accuracy. The goal is fast, accurate responses that satisfy security requirements and advance deals.

### Why This Matters

- **Deal velocity**: Security reviews often gate procurement decisions
- **Trust building**: Accurate responses demonstrate security maturity
- **Risk management**: Questionnaires surface gaps to address proactively
- **Efficiency**: Reusable content reduces response time by 70%
- **Compliance**: Many frameworks require vendor security assessment

## When to Use

### Primary Triggers

- "Complete this security questionnaire"
- "Respond to their vendor assessment"
- "Fill out the SIG questionnaire"
- "Answer their compliance questions"
- "Provide SOC 2 documentation"
- "They need our security documentation"
- "Complete the CAIQ assessment"

### Specific Use Cases

1. **Standard Questionnaires**: SIG, CAIQ, HECVAT, custom formats
2. **Compliance Validation**: SOC 2, ISO 27001, HIPAA, GDPR
3. **Due Diligence**: M&A security assessments
4. **Ongoing Assessment**: Annual vendor reviews
5. **Evidence Requests**: Follow-up documentation
6. **Gap Analysis**: Identifying security improvements

## Core Processes

### Process 1: Questionnaire Analysis and Triage

**Objective**: Efficiently analyze and plan questionnaire response.

**Initial Assessment Framework**:

```markdown
# Security Questionnaire Assessment

## Document Information
- **Questionnaire Type**: [SIG Core/Lite, CAIQ, Custom, HECVAT]
- **Requesting Organization**: [Name]
- **Total Questions**: [Number]
- **Due Date**: [Date]
- **Complexity**: [Low/Medium/High]
- **Deal Value**: [Context for prioritization]

---

## 1. Questionnaire Categorization

### Question Categories
| Category | Count | Estimated Time | Owner |
|----------|-------|----------------|-------|
| Company/General | [N] | [Hours] | [Name] |
| Access Control | [N] | [Hours] | [Name] |
| Data Protection | [N] | [Hours] | [Name] |
| Network Security | [N] | [Hours] | [Name] |
| Application Security | [N] | [Hours] | [Name] |
| Incident Response | [N] | [Hours] | [Name] |
| Business Continuity | [N] | [Hours] | [Name] |
| Compliance | [N] | [Hours] | [Name] |
| Vendor Management | [N] | [Hours] | [Name] |
| Physical Security | [N] | [Hours] | [Name] |

### Estimated Total Effort
- **First Pass**: [Hours]
- **Review**: [Hours]
- **Evidence Gathering**: [Hours]
- **Total**: [Hours]

---

## 2. Response Strategy

### Questions We Can Answer Immediately
- From existing knowledge base: ~[N]%
- Requiring minor updates: ~[N]%
- Requiring new content: ~[N]%

### Questions Requiring SME Input
| Question | Topic | SME Needed | Status |
|----------|-------|------------|--------|
| Q42 | Encryption key management | Security Engineer | Pending |
| Q78 | DR testing frequency | IT Ops | Pending |

### Questions Requiring Exceptions
| Question | Our Position | Exception Language |
|----------|--------------|-------------------|
| Q15 | Don't have FedRAMP | "Not currently certified; available upon request" |
| Q89 | No on-prem option | "Cloud-only offering; describe isolation" |

---

## 3. Evidence Requirements

### Standard Evidence to Attach
| Evidence | Status | Expiration |
|----------|--------|------------|
| SOC 2 Type II Report | Current | [Date] |
| ISO 27001 Certificate | Current | [Date] |
| Penetration Test Summary | Current | [Date] |
| Insurance Certificate | Current | [Date] |
| Privacy Policy | Current | N/A |
| Security Whitepaper | Current | N/A |

### Evidence to Prepare
| Requested Evidence | Action Needed | Owner |
|-------------------|---------------|-------|
| Architecture diagram | Redact sensitive details | Security |
| DR test results | Obtain summary from IT | IT Ops |
| Training records | Export from LMS | HR |
```

### Process 2: Common Framework Responses

**Objective**: Maintain accurate responses for major security frameworks.

**SOC 2 Response Guide**:

```markdown
# SOC 2 Security Questionnaire Responses

## Trust Service Criteria Mapping

### Security (CC1-CC9)
**Common Question**: "Do you have a SOC 2 Type II report?"

**Response**:
"Yes, [Company] maintains a current SOC 2 Type II report, audited by [Auditor Name], covering the Security, Availability, and Confidentiality Trust Services Criteria. Our most recent report covers the period [Date Range] and is available under NDA upon request.

Key highlights:
- Zero critical findings
- [X] controls tested, 100% operating effectively
- Annual audit cycle with continuous monitoring

We can provide the full report and bridge letter (if applicable) for your review."

---

### Access Control Questions

**Q: How do you manage user access?**
"[Company] implements role-based access control (RBAC) following the principle of least privilege:

- **Authentication**: SSO via [Okta/Azure AD] with MFA required for all users
- **Authorization**: Role-based permissions reviewed quarterly
- **Access Reviews**: Automated quarterly access reviews with manager approval
- **Offboarding**: Automated access revocation within [X] hours of termination
- **Privileged Access**: PAM solution with session recording for admin access

This is documented in SOC 2 report sections CC6.1-CC6.3."

---

**Q: How do you handle password management?**
"Password controls include:

- **Complexity**: Minimum 12 characters, complexity requirements
- **Rotation**: 90-day maximum age for service accounts; SSO for user accounts
- **Storage**: Passwords hashed using bcrypt with appropriate work factor
- **MFA**: Required for all access; phishing-resistant methods preferred
- **Secrets Management**: HashiCorp Vault for application secrets

Enterprise password manager provided to all employees for secure credential storage."

---

### Data Protection Questions

**Q: How is data encrypted?**
"[Company] implements comprehensive encryption:

**At Rest**:
- Database: AES-256 encryption (AWS RDS encryption)
- File Storage: AES-256 (AWS S3 server-side encryption)
- Backups: AES-256 encrypted
- Key Management: AWS KMS with annual key rotation

**In Transit**:
- TLS 1.3 for all external communications
- TLS 1.2+ for all internal communications
- Certificate management via [provider]
- HSTS enforced on all web properties

**Application Layer** (where applicable):
- Field-level encryption for PII
- Customer-managed keys available for enterprise tier"

---

### Incident Response Questions

**Q: Describe your incident response process.**
"[Company] maintains a documented incident response plan:

**Detection**: 24/7 monitoring via [SIEM] with automated alerting
**Classification**: Severity levels P1-P4 with defined response times:
- P1 (Critical): 15-minute response, 4-hour resolution target
- P2 (High): 1-hour response, 24-hour resolution target
- P3 (Medium): 4-hour response, 72-hour resolution target
- P4 (Low): Next business day response

**Response Team**: Dedicated security incident response team
**Communication**: Customer notification within 72 hours for data breaches
**Post-Incident**: Root cause analysis and lessons learned for all P1/P2

Last tabletop exercise: [Date]
Last actual incident: [Date or 'None in past 12 months']"

---

### Business Continuity Questions

**Q: What is your disaster recovery capability?**
"[Company] maintains business continuity and disaster recovery capabilities:

**Recovery Objectives**:
- RTO: 4 hours
- RPO: 1 hour

**Infrastructure**:
- Multi-AZ deployment in primary region
- Cross-region replication to [secondary region]
- Automated failover for critical services

**Testing**:
- Full DR test conducted annually (last test: [Date])
- Partial failover testing quarterly
- Backup restoration testing monthly

**Documentation**: BCP and DRP reviewed and updated annually"
```

**GDPR Response Guide**:

```markdown
# GDPR Security Questionnaire Responses

## Data Processing Questions

**Q: Where is data processed and stored?**
"[Company] processes and stores data in the following locations:

**Primary Processing**: [Region/Country]
**Data Centers**: AWS [specific regions]
**Sub-processors**: Listed at [URL]

For EU customers:
- Data residency in EU available (Frankfurt, Ireland regions)
- Standard Contractual Clauses (SCCs) in place for any transfers
- Data Processing Agreement (DPA) available upon request

We do not transfer personal data outside the EEA except where adequate safeguards are in place as required by GDPR Articles 44-49."

---

**Q: What is your lawful basis for processing?**
"[Company] processes personal data under the following lawful bases:

- **Contract Performance** (Art. 6(1)(b)): Necessary to provide our services
- **Legitimate Interest** (Art. 6(1)(f)): Analytics, security, service improvement
- **Consent** (Art. 6(1)(a)): Marketing communications (opt-in)
- **Legal Obligation** (Art. 6(1)(c)): Tax, regulatory requirements

Lawful basis is documented in our privacy policy and Records of Processing Activities (ROPA)."

---

**Q: How do you support data subject rights?**
"[Company] provides mechanisms for all GDPR data subject rights:

| Right | How Supported | Response Time |
|-------|---------------|---------------|
| Access | Self-service export or support request | 30 days |
| Rectification | Self-service or support request | 30 days |
| Erasure | Support request with verification | 30 days |
| Portability | Export in JSON/CSV format | 30 days |
| Restriction | Support request | 30 days |
| Objection | Marketing opt-out self-service | Immediate |

Our Data Protection Officer can be contacted at [dpo@company.com].
Customer guide: [URL to data subject rights documentation]"

---

**Q: What is your data retention policy?**
"[Company] retains personal data as follows:

| Data Category | Retention Period | Basis |
|---------------|------------------|-------|
| Account data | Duration of account + 90 days | Contract + legitimate interest |
| Transaction data | 7 years | Legal obligation |
| Support tickets | 3 years from closure | Legitimate interest |
| Usage analytics | 2 years | Legitimate interest |
| Marketing consent | Until withdrawn | Consent |

Data is securely deleted at the end of retention periods. Customers can request earlier deletion subject to legal retention requirements."
```

### Process 3: HIPAA Compliance Responses

**Objective**: Address healthcare-specific security requirements.

**HIPAA Response Guide**:

```markdown
# HIPAA Security Questionnaire Responses

## Business Associate Requirements

**Q: Will you sign a Business Associate Agreement (BAA)?**
"Yes, [Company] executes Business Associate Agreements with covered entities and their business associates.

Our standard BAA:
- Complies with 45 CFR 164.504(e)
- Covers all required provisions
- Available for review and execution

We can execute your BAA or provide our template for review. Our legal team typically completes BAA execution within 5 business days."

---

**Q: How do you protect PHI?**
"[Company] implements HIPAA-required safeguards:

**Administrative Safeguards**:
- Designated Security Officer and Privacy Officer
- Annual HIPAA training for all employees
- Risk assessments conducted annually
- Policies reviewed annually

**Physical Safeguards**:
- SOC 2 audited data centers (AWS)
- No PHI processed in physical offices
- Media disposal per NIST guidelines

**Technical Safeguards**:
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Unique user identification
- Automatic logoff (15-minute timeout)
- Audit logging with 6-year retention
- Transmission integrity controls

Our SOC 2 Type II report includes HIPAA-relevant controls."

---

**Q: How do you handle breach notification?**
"[Company] maintains HIPAA-compliant breach notification procedures:

**Detection**: 24/7 monitoring for unauthorized access
**Assessment**: Risk assessment per 45 CFR 164.402
**Notification Timeline**:
- Covered Entity notified within 24 hours of discovery
- Support for required notifications (individuals, HHS, media if >500)

**Documentation**:
- Breach documentation maintained for 6 years
- Annual breach summary available

We have not experienced a PHI breach in [timeframe]."

---

**Q: Describe access controls for PHI.**
"Access to PHI is controlled as follows:

**Access Granted Based On**:
- Role requirements (minimum necessary)
- Customer authorization
- Documented business need

**Access Controls**:
- Unique user IDs
- Multi-factor authentication required
- Role-based access control
- Customer admin controls access for their users

**Access Monitoring**:
- All PHI access logged
- Logs retained 6 years
- Automated alerting for anomalies
- Quarterly access reviews

**Workforce**:
- Background checks for employees with PHI access
- Annual HIPAA training with attestation
- Sanctions policy for violations"
```

### Process 4: Building Reusable Security Content

**Objective**: Maintain efficient, reusable questionnaire content.

**Security Content Library**:

```markdown
# Security Content Library Structure

## Organization

/security-content
  /frameworks
    /soc2
      - trust-service-criteria.md
      - control-descriptions.md
    /gdpr
      - data-processing.md
      - data-subject-rights.md
    /hipaa
      - baa-responses.md
      - safeguards.md
    /iso27001
      - controls.md
  /topics
    - access-control.md
    - encryption.md
    - incident-response.md
    - business-continuity.md
    - vendor-management.md
    - network-security.md
    - application-security.md
    - physical-security.md
    - data-classification.md
    - security-training.md
  /evidence
    - document-index.md
    - soc2-report.pdf
    - iso27001-cert.pdf
    - pentest-summary.pdf
  /templates
    - sig-core.md
    - sig-lite.md
    - caiq.md
    - standard-responses.md

---


## References
- `references/content-template.md` — Content Template
