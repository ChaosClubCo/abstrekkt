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

#### Incident Response Playbook: Ransomware

```
RANSOMWARE RESPONSE PLAYBOOK
============================

IMMEDIATE ACTIONS (First 30 minutes)
[ ] Isolate affected systems (disconnect network)
[ ] DO NOT power off systems (preserve evidence)
[ ] Alert incident response team
[ ] Document ransom note/message
[ ] Identify patient zero if possible

CONTAINMENT (Hours 1-4)
[ ] Identify scope of infection
[ ] Block C2 communication if identified
[ ] Isolate additional at-risk systems
[ ] Disable affected accounts
[ ] Preserve logs and evidence
[ ] Engage leadership

ASSESSMENT (Hours 4-24)
[ ] Determine data encrypted
[ ] Assess backup availability
[ ] Identify ransomware variant
[ ] Determine regulatory notification requirements
[ ] Engage cyber insurance if applicable
[ ] Consider law enforcement notification

RECOVERY OPTIONS
Option A: Restore from Backups
- Verify backup integrity
- Rebuild systems from clean images
- Restore data from backups
- Estimated time: [varies]

Option B: Decryption (if available)
- Check nomoreransom.org for decryptors
- Test on isolated copy first
- Estimated time: [varies]

Option C: Negotiate (Last Resort)
- Engage professional negotiators
- Understand legal implications
- Document all communications

POST-INCIDENT
[ ] Complete system rebuild
[ ] Implement additional controls
[ ] Conduct security assessment
[ ] Update policies and training
[ ] Complete lessons learned
```

### 5. Vulnerability Management

#### Vulnerability Management Lifecycle

```
VULNERABILITY MANAGEMENT PROCESS
================================

1. DISCOVERY
   - Automated vulnerability scanning
   - Manual penetration testing
   - Threat intelligence monitoring
   - Vendor security advisories

2. PRIORITIZATION
   Use CVSS + Business Context:
   - Critical (CVSS 9.0-10.0): Immediate
   - High (CVSS 7.0-8.9): 7 days
   - Medium (CVSS 4.0-6.9): 30 days
   - Low (CVSS 0.1-3.9): 90 days

3. REMEDIATION
   - Patch when possible
   - Mitigate when patch unavailable
   - Accept with documentation if necessary
   - Track exceptions

4. VERIFICATION
   - Rescan after remediation
   - Validate fix effectiveness
   - Update documentation

5. REPORTING
   - Regular vulnerability reports
   - Trend analysis
   - Risk metrics
   - Exception tracking
```

#### Vulnerability Scanning Schedule

| Asset Type | Scan Frequency | Scan Type |
|------------|----------------|-----------|
| External-facing systems | Weekly | Authenticated + Unauthenticated |
| Internal servers | Monthly | Authenticated |
| Workstations | Monthly | Agent-based |
| Network devices | Monthly | Authenticated |
| Cloud infrastructure | Continuous | API-based |
| Applications | Per release + Monthly | DAST/SAST |

### 6. Compliance Frameworks

#### SOC 2 Compliance

```
SOC 2 TRUST SERVICE CRITERIA
============================

SECURITY (Common Criteria)
CC1: Control Environment
CC2: Communication and Information
CC3: Risk Assessment
CC4: Monitoring Activities
CC5: Control Activities
CC6: Logical and Physical Access
CC7: System Operations
CC8: Change Management
CC9: Risk Mitigation

AVAILABILITY
A1: System availability commitments

PROCESSING INTEGRITY
PI1: Processing accuracy and completeness

CONFIDENTIALITY
C1: Confidential information protection

PRIVACY
P1-P8: Privacy notice, consent, collection,
       use, disclosure, quality, monitoring
```

#### SOC 2 Readiness Checklist

```
SOC 2 READINESS ASSESSMENT
==========================

SECURITY CONTROLS
[ ] Access control policy documented
[ ] User access reviews conducted quarterly
[ ] MFA implemented for sensitive systems
[ ] Encryption at rest and in transit
[ ] Vulnerability management program
[ ] Incident response plan tested
[ ] Security awareness training
[ ] Change management process
[ ] Logging and monitoring

AVAILABILITY CONTROLS
[ ] Uptime commitments defined
[ ] Redundancy implemented
[ ] Disaster recovery plan tested
[ ] Capacity planning documented
[ ] Performance monitoring

CONFIDENTIALITY CONTROLS
[ ] Data classification implemented
[ ] NDA process for third parties
[ ] Data handling procedures
[ ] Secure disposal process

DOCUMENTATION REQUIRED
[ ] Information security policy
[ ] Risk assessment
[ ] System descriptions
[ ] Control matrices
[ ] Evidence of control operation
```

#### ISO 27001 Control Domains

| Domain | Key Controls |
|--------|-------------|
| A.5 Information Security Policies | Policy documentation, review |
| A.6 Organization of Information Security | Roles, mobile, teleworking |
| A.7 Human Resource Security | Screening, training, termination |
| A.8 Asset Management | Inventory, classification, handling |
| A.9 Access Control | Policy, user access, system access |
| A.10 Cryptography | Encryption policy, key management |
| A.11 Physical Security | Secure areas, equipment |
| A.12 Operations Security | Procedures, malware, backup |
| A.13 Communications Security | Network security, transfer |
| A.14 System Development | Requirements, testing, data |
| A.15 Supplier Relationships | Policy, monitoring |
| A.16 Incident Management | Responsibilities, reporting |
| A.17 Business Continuity | Planning, verification |
| A.18 Compliance | Legal, reviews |

## Tools & Templates

### Security Tools for SMB

| Category | Tool | Use Case |
|----------|------|----------|
| Endpoint Protection | CrowdStrike, SentinelOne | EDR/Antivirus |
| SIEM | Splunk, Microsoft Sentinel | Log aggregation |
| Vulnerability Scanning | Tenable, Qualys | Vulnerability assessment |
| Password Management | 1Password, Bitwarden | Credential management |
| MFA | Duo, Okta | Authentication |
| Email Security | Proofpoint, Mimecast | Phishing protection |
| Security Awareness | KnowBe4, Proofpoint | Training |

### Security Awareness Training Topics

```
ANNUAL TRAINING CURRICULUM
==========================

MODULE 1: Security Fundamentals
- Why security matters
- Common threats
- Your role in security

MODULE 2: Password and Authentication
- Strong password creation
- MFA importance
- Password manager usage

MODULE 3: Phishing and Social Engineering
- Recognizing phishing
- Reporting suspicious emails
- Social engineering tactics

MODULE 4: Data Protection
- Data classification
- Handling sensitive data
- Secure sharing

MODULE 5: Physical Security
- Clean desk policy
- Visitor management
- Device security

MODULE 6: Remote Work Security
- Secure home network
- VPN usage
- Public WiFi risks

MODULE 7: Incident Reporting
- What to report
- How to report
- Importance of reporting
```

## Metrics & KPIs

### Security Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Mean Time to Detect (MTTD) | <24 hours | Time from breach to detection |
| Mean Time to Respond (MTTR) | <4 hours | Time from detection to containment |
| Vulnerability Remediation | Critical: 7 days, High: 30 days | Time to patch |
| Phishing Click Rate | <5% | Simulation results |
| Security Training Completion | 100% | Annual completion rate |
| Access Review Completion | 100% quarterly | Reviews completed on time |

### Compliance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Audit Findings | Decreasing | Year-over-year comparison |
| Control Exceptions | <5 active | Number of accepted risks |
| Policy Acknowledgments | 100% | Annual acknowledgment rate |
| Third-Party Assessments | 100% critical vendors | Vendor review completion |

## Common Pitfalls

### Security Pitfalls
- **Checkbox security:** Compliance doesn't equal security
- **Tool overload:** More tools doesn't mean more secure
- **Alert fatigue:** Too many alerts = ignored alerts
- **Neglecting basics:** Focus on fundamentals first

### Compliance Pitfalls
- **Point-in-time thinking:** Compliance is continuous
- **Documentation gaps:** If it's not documented, it didn't happen
- **Ignoring scope creep:** Define and maintain clear boundaries
- **Underestimating effort:** Audits require significant preparation

### Process Pitfalls
- **Shadow IT:** Unknown systems = unmanaged risk
- **Exception creep:** Too many exceptions undermine controls
- **Training gaps:** Annual training isn't enough
- **Incident denial:** Every incident is a learning opportunity

## Integration Points

### IT Operations Integration
- Patch management coordination
- Change management process
- Asset management linkage
- Monitoring and alerting

### HR Integration
- Background check requirements
- Security training tracking
- Termination procedures
- Policy acknowledgments

### Legal Integration
- Regulatory requirements
- Contract security terms
- Incident notification obligations
- Privacy compliance

### Executive Integration
- Risk reporting
- Budget justification
- Strategic alignment
- Board reporting
