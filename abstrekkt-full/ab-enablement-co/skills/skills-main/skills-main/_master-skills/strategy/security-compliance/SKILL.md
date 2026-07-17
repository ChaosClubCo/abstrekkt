---
name: security-compliance
description: Data protection policies, access control frameworks, security policies, incident response procedures, vulnerability management, and compliance frameworks (SOC2, ISO 27001) for SMB organizations. Use when developing security programs, responding to incidents, or preparing for compliance audits.
---

# Security & Compliance Management

## Overview

Security and compliance are non-negotiable foundations for modern SMB operations. This skill provides comprehensive frameworks for protecting organizational assets, managing access controls, responding to security incidents, and achieving compliance with industry standards. For SMBs, the challenge lies in implementing enterprise-grade security with limited resources while meeting customer and regulatory requirements.

Effective security is not just about technology - it encompasses people, processes, and continuous improvement. This skill balances robust protection with operational practicality, helping SMBs establish security programs that scale with their growth.

## When to Use

Invoke this skill when:
- Developing or updating security policies
- Creating data protection and privacy frameworks
- Implementing access control systems
- Responding to security incidents
- Conducting vulnerability assessments
- Preparing for compliance audits (SOC2, ISO 27001, HIPAA)
- Building security awareness programs
- Assessing third-party vendor security
- Creating business continuity plans
- Implementing zero trust architecture

## Core Processes

### 1. Security Policy Framework

#### Essential Security Policies

```
CORE SECURITY POLICY SET
========================

TIER 1 - FOUNDATIONAL (Implement First)
1. Information Security Policy (Master Policy)
2. Acceptable Use Policy
3. Access Control Policy
4. Password/Authentication Policy
5. Data Classification Policy

TIER 2 - OPERATIONAL (Implement Second)
6. Incident Response Policy
7. Change Management Policy
8. Vendor/Third-Party Security Policy
9. Remote Work Security Policy
10. Mobile Device Policy

TIER 3 - SPECIALIZED (As Needed)
11. Encryption Policy
12. Network Security Policy
13. Physical Security Policy
14. Business Continuity Policy
15. Security Awareness Training Policy
```

#### Information Security Policy Template

```markdown
# Information Security Policy

**Version:** 1.0
**Effective Date:** [Date]
**Owner:** [CISO/IT Director]
**Review Cycle:** Annual

## Purpose
This policy establishes the framework for protecting [Company Name]'s
information assets and ensuring the confidentiality, integrity, and
availability of data.

## Scope
This policy applies to all employees, contractors, and third parties
who access company information systems and data.

## Policy Statements

### 1. Information Protection
- All information must be classified according to the Data
  Classification Policy
- Access to information is granted on a need-to-know basis
- Sensitive information must be encrypted in transit and at rest

### 2. Access Management
- All access requires unique user identification
- Multi-factor authentication required for sensitive systems
- Access rights reviewed quarterly
- Terminated user access removed within 24 hours

### 3. Security Awareness
- All employees complete security training upon hire
- Annual security awareness refresher required
- Phishing simulations conducted quarterly

### 4. Incident Management
- All security incidents must be reported immediately
- Incident response procedures followed per IR Plan
- Post-incident reviews conducted within 72 hours

### 5. Compliance
- Regular compliance assessments conducted
- Audit findings remediated per defined timelines
- Third-party vendors assessed for security compliance

## Enforcement
Violations may result in disciplinary action up to and including
termination. Criminal violations will be referred to law enforcement.

## Policy Review
This policy is reviewed annually or when significant changes occur.

**Approved by:** _________________ Date: _________
```

### 2. Data Protection Framework

#### Data Classification Levels

| Level | Label | Description | Examples | Handling Requirements |
|-------|-------|-------------|----------|----------------------|
| 1 | Public | No harm if disclosed | Marketing materials, job postings | No restrictions |
| 2 | Internal | Minor impact if disclosed | Internal memos, org charts | Internal access only |
| 3 | Confidential | Significant harm if disclosed | Customer data, financial records | Encryption, access control |
| 4 | Restricted | Severe harm if disclosed | PII, health data, credentials | Strict access, audit logging |

#### Data Handling Requirements by Classification

```
RESTRICTED DATA HANDLING
========================
Storage:
- Encrypted at rest (AES-256 or equivalent)
- Access logged and monitored
- Stored on approved systems only
- No local copies without approval

Transmission:
- Encrypted in transit (TLS 1.2+)
- Secure file transfer only
- No email unless encrypted
- No public cloud sharing

Access:
- Need-to-know basis only
- Manager approval required
- MFA required
- Quarterly access reviews

Retention:
- Defined retention period
- Secure destruction required
- Certificate of destruction for physical

CONFIDENTIAL DATA HANDLING
==========================
Storage:
- Encrypted at rest
- Access controlled
- Approved systems only

Transmission:
- Encrypted in transit
- Secure sharing preferred
- Password-protected if emailed

Access:
- Business need basis
- Access logged
- Annual review

Retention:
- Per retention schedule
- Secure disposal
```

#### Data Protection Impact Assessment (DPIA)

```
DATA PROTECTION IMPACT ASSESSMENT
=================================

Project/System: _______________________
Date: _______________________
Assessor: _______________________

1. DATA INVENTORY
   What personal data is processed?
   [ ] Names
   [ ] Contact information
   [ ] Financial data
   [ ] Health data
   [ ] Location data
   [ ] Other: _____________

2. PURPOSE
   Why is this data being processed?
   ________________________________

3. LEGAL BASIS
   [ ] Consent
   [ ] Contract performance
   [ ] Legal obligation
   [ ] Legitimate interest
   [ ] Other: _____________

4. DATA FLOW
   - Collection point: _____________
   - Storage location: _____________
   - Processing: _____________
   - Sharing/Transfer: _____________
   - Retention period: _____________
   - Disposal method: _____________

5. RISK ASSESSMENT
   | Risk | Likelihood | Impact | Mitigation |
   |------|------------|--------|------------|
   |      |            |        |            |

6. SECURITY CONTROLS
   [ ] Encryption at rest
   [ ] Encryption in transit
   [ ] Access controls
   [ ] Audit logging
   [ ] Data minimization
   [ ] Anonymization/Pseudonymization

7. APPROVAL
   Privacy Officer: _______ Date: _______
   IT Security: _______ Date: _______
   Data Owner: _______ Date: _______
```

### 3. Access Control Framework

#### Access Control Principles

```
ACCESS CONTROL FUNDAMENTALS
===========================

1. LEAST PRIVILEGE
   - Grant minimum access needed for job function
   - No standing admin access
   - Elevated access time-limited

2. SEPARATION OF DUTIES
   - No single person controls entire process
   - Critical functions require multiple approvals
   - Development and production access separated

3. NEED TO KNOW
   - Access based on business requirement
   - Not based on seniority or title
   - Regularly validated

4. DEFENSE IN DEPTH
   - Multiple layers of access control
   - Network, application, and data level
   - No single point of failure
```

#### Role-Based Access Control (RBAC) Matrix

| System/Resource | Admin | Manager | Employee | Contractor | Auditor |
|-----------------|-------|---------|----------|------------|---------|
| HR System | Full | Dept Read | Self Only | None | Read |
| Financial System | Full | Dept Full | Limited | None | Read |
| CRM | Full | Full | Standard | Limited | Read |
| Source Code | Full | Team Full | Team | Project | None |
| Production Infra | Full | None | None | None | View Logs |
| Security Tools | Full | Limited | None | None | Read |

#### Access Request Workflow

```
ACCESS REQUEST PROCESS
======================

1. REQUEST SUBMISSION
   Requester submits via ticketing system:
   - System/resource requested
   - Access level needed
   - Business justification
   - Duration (permanent/temporary)

2. MANAGER APPROVAL
   Direct manager reviews:
   - Validates business need
   - Confirms role appropriateness
   - Approves or denies

3. DATA OWNER APPROVAL
   System/data owner reviews:
   - Validates access level
   - Confirms security requirements
   - Approves or denies

4. SECURITY REVIEW (High-risk access)
   Security team reviews:
   - Background check status
   - Training completion
   - Risk assessment

5. PROVISIONING
   IT provisions access:
   - Creates/updates account
   - Configures permissions
   - Documents access granted

6. NOTIFICATION
   - User notified of access
   - Manager notified
   - Audit trail created

7. PERIODIC REVIEW
   - Access reviewed quarterly
   - Recertification required
   - Unused access removed
```

### 4. Incident Response

#### Incident Classification

| Severity | Description | Examples | Response Time |
|----------|-------------|----------|---------------|
| Critical | Business-stopping, data breach | Ransomware, major breach | Immediate (15 min) |
| High | Significant impact, potential breach | Malware, unauthorized access | 1 hour |
| Medium | Limited impact, contained | Phishing click, policy violation | 4 hours |
| Low | Minimal impact | Spam, minor violation | 24 hours |

#### Incident Response Plan

```
INCIDENT RESPONSE PHASES
========================

PHASE 1: PREPARATION
- Incident response team identified
- Contact lists current
- Tools and resources ready
- Playbooks documented
- Regular training conducted

PHASE 2: IDENTIFICATION
- Detect potential incident
- Initial triage and classification
- Document initial findings
- Determine if incident is confirmed
- Activate response team if needed

PHASE 3: CONTAINMENT
Short-term:
- Isolate affected systems
- Block malicious IPs/domains
- Disable compromised accounts
- Preserve evidence

Long-term:
- Patch vulnerabilities
- Strengthen controls
- Monitor for recurrence
- Plan for remediation

PHASE 4: ERADICATION
- Remove malware/threats
- Close vulnerability exploited
- Reset compromised credentials
- Verify complete removal
- Update security controls

PHASE 5: RECOVERY
- Restore systems from clean backups
- Rebuild if necessary
- Gradually restore services
- Monitor closely for recurrence
- Validate business operations

PHASE 6: LESSONS LEARNED
- Conduct post-incident review
- Document timeline and actions
- Identify improvements
- Update procedures
- Brief stakeholders
```


## References
- `references/incident-response-playbook-ransomware.md` — Incident Response Playbook: Ransomware
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
