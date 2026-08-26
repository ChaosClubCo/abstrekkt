---
name: healthcare-compliance
description: Analyze and implement HIPAA, HITECH, and clinical compliance programs. Assess patient data protection controls, audit healthcare privacy practices, and build regulatory adherence frameworks for covered entities and business associates. Use when navigating industry-specific regulations, processes, or operations.
---

# Healthcare Compliance Skill

> HIPAA-driven privacy, security, and clinical compliance for healthcare organizations

## Description

This skill provides comprehensive guidance for healthcare regulatory compliance spanning HIPAA Privacy and Security Rules, HITECH Act requirements, clinical compliance programs, and patient data protection strategies. It covers risk assessments, policy development, breach response, audit preparation, and ongoing compliance monitoring for covered entities, business associates, and their subcontractors. The skill supports compliance officers, privacy officers, health IT professionals, and clinical operations leaders in building and maintaining defensible compliance programs that protect patient rights while enabling operational efficiency.

## Activation Triggers

- User mentions "HIPAA", "HITECH", "healthcare compliance", or "PHI protection"
- User asks about patient data privacy or protected health information
- User needs help with healthcare security risk assessments
- User discusses breach notification requirements or incident response
- User asks about Business Associate Agreements or BAAs
- User mentions clinical compliance, coding compliance, or billing compliance
- User needs audit preparation for OCR or CMS investigations
- User discusses minimum necessary standard or access controls
- User asks about de-identification of health data or research compliance
- User mentions electronic health records security or EHR compliance
- User discusses state health privacy laws or interoperability requirements

## Instructions

### Core Workflow

1. **Compliance Scope Assessment**
   - Identify whether the organization is a covered entity, business associate, or subcontractor
   - Map all systems, applications, and workflows that create, receive, maintain, or transmit PHI
   - Catalog all business associate relationships and verify BAA coverage
   - Determine applicable state health privacy laws that exceed federal requirements
   - Assess current compliance program maturity against OCR audit protocol elements

2. **Risk Analysis and Management**
   - Conduct a comprehensive SRA (Security Risk Assessment) per 45 CFR 164.308(a)(1)
   - Identify threats and vulnerabilities to all ePHI repositories
   - Evaluate likelihood and impact of each identified risk scenario
   - Assign risk ratings and prioritize remediation based on residual risk
   - Document risk acceptance decisions with executive sign-off for risks above tolerance

3. **Policy and Procedure Development**
   - Draft policies addressing all HIPAA Privacy Rule requirements (45 CFR 164.500-534)
   - Draft policies addressing all HIPAA Security Rule standards and implementation specifications
   - Create procedures for workforce training, sanction application, and access management
   - Develop incident response and breach notification procedures with defined timelines
   - Establish data retention and disposal policies meeting both HIPAA and state requirements

4. **Implementation and Training**
   - Deploy technical safeguards including encryption, access controls, and audit logging
   - Implement administrative safeguards including workforce clearance and termination procedures
   - Conduct role-based training with documented attendance and comprehension validation
   - Execute tabletop exercises for breach scenarios and incident response procedures
   - Configure monitoring and alerting systems for PHI access anomalies

5. **Ongoing Monitoring and Audit Readiness**
   - Perform annual Security Risk Assessment updates and document changes
   - Conduct periodic internal audits against OCR audit protocol categories
   - Review and update BAAs annually and upon change of scope
   - Monitor OCR enforcement actions and update program for emerging guidance
   - Maintain six-year documentation retention for all compliance artifacts

### HIPAA Privacy and Security Framework

```yaml
hipaa_framework:
  privacy_rule:
    core_requirements:
      notice_of_privacy_practices:
        - Content requirements per 45 CFR 164.520
        - Distribution timing (first service encounter)
        - Material change revision and re-distribution
        - Acknowledgment of receipt documentation

      individual_rights:
        access: "Right to inspect and obtain copies within 30 days"
        amendment: "Right to request amendment with 60-day response"
        accounting_of_disclosures: "Six-year lookback period"
        restriction_requests: "Must agree if self-pay and disclosure to health plan"
        confidential_communications: "Reasonable accommodation required"
        data_portability: "Electronic copy in requested format if readily producible"

      minimum_necessary:
        standard: "Limit PHI use, disclosure, and requests to minimum necessary"
        exceptions:
          - Treatment purposes
          - Disclosures to the individual
          - Pursuant to valid authorization
          - Required by law
          - Required for HHS compliance investigations

      authorized_disclosures:
        required_elements:
          - Description of information to be disclosed
          - Person authorized to make disclosure
          - Person to whom disclosure is made
          - Purpose of disclosure
          - Expiration date or event
          - Individual signature and date

  security_rule:
    administrative_safeguards:
      risk_analysis: "Required - Accurate and thorough assessment of ePHI risks"
      risk_management: "Required - Implement measures to reduce risk to reasonable level"
      sanction_policy: "Required - Workforce sanctions for policy violations"
      information_system_activity_review: "Required - Regular audit log review"
      workforce_security: "Addressable - Authorization, clearance, termination procedures"
      security_awareness_training: "Addressable - Security reminders, malware protection, login monitoring"
      contingency_plan: "Required - Data backup, disaster recovery, emergency mode operations"

    physical_safeguards:
      facility_access_controls: "Addressable - Contingency operations, facility security plan"
      workstation_use: "Required - Appropriate functions and physical attributes"
      workstation_security: "Required - Physical safeguards restricting access"
      device_and_media_controls: "Required - Disposal, media re-use, accountability, data backup"

    technical_safeguards:
      access_control: "Required - Unique user ID, emergency access, auto-logoff, encryption"
      audit_controls: "Required - Record and examine ePHI system activity"
      integrity: "Addressable - Mechanism to authenticate ePHI"
      person_authentication: "Required - Verify person seeking access is claimed identity"
      transmission_security: "Addressable - Integrity controls, encryption for ePHI in transit"

  hitech_act:
    breach_notification:
      individual_notice: "Without unreasonable delay, no later than 60 days from discovery"
      hhs_notice: "Annually for breaches <500 individuals; within 60 days for >=500"
      media_notice: "Required for breaches affecting >=500 residents of a state"
      content_requirements:
        - Description of the breach
        - Types of information involved
        - Steps individuals should take
        - What the entity is doing in response
        - Contact procedures for questions

    breach_risk_assessment:
      four_factor_test:
        - Nature and extent of PHI involved
        - Unauthorized person who used or received PHI
        - Whether PHI was actually acquired or viewed
        - Extent to which risk has been mitigated

    enforcement:
      tier_1: "Did not know - $100-$50,000 per violation"
      tier_2: "Reasonable cause - $1,000-$50,000 per violation"
      tier_3: "Willful neglect, corrected - $10,000-$50,000 per violation"
      tier_4: "Willful neglect, not corrected - $50,000 per violation"
      annual_cap: "$1,500,000 per identical provision per year"
```

### Clinical Compliance Program Framework

```yaml
clinical_compliance:
  oig_seven_elements:
    written_standards:
      - Code of conduct
      - Compliance policies and procedures
      - Coding and billing guidelines
      - Clinical documentation standards
      - Anti-kickback and Stark Law policies

    compliance_officer:
      responsibilities:
        - Day-to-day compliance program management
        - Direct reporting line to board or governing body
        - Authority to review all documents and areas
        - Coordination with legal counsel

    training_and_education:
      initial: "Within 90 days of hire for all workforce members"
      annual: "Refresher training with updated regulatory content"
      specialized: "Role-based training for coding, billing, clinical staff"
      documentation: "Attendance records, content materials, assessment scores"

    communication_lines:
      hotline: "Anonymous reporting mechanism available 24/7"
      non_retaliation: "Written policy protecting whistleblowers"
      open_door: "Encourage direct communication with compliance officer"

    auditing_and_monitoring:
      prospective: "Pre-billing claim scrubbing"
      concurrent: "Real-time documentation review"
      retrospective: "Post-submission claim audits"
      frequency: "Monthly targeted, quarterly comprehensive, annual full-scope"

    enforcement_discipline:
      progressive: "Verbal warning, written warning, suspension, termination"
      consistent: "Apply equally regardless of position or revenue generation"
      documented: "Record all enforcement actions with rationale"

    corrective_action:
      identification: "Root cause analysis for all compliance failures"
      implementation: "Corrective action plans with owners and deadlines"
      validation: "Follow-up audits to confirm effectiveness"
      reporting: "Voluntary self-disclosure to OIG when appropriate"

  coding_compliance:
    documentation_standards:
      - Medical necessity support for all services billed
      - Specificity and completeness of diagnosis coding
      - Procedure code accuracy and modifier appropriateness
      - Provider credential verification for services rendered
      - Timely completion within facility-defined deadlines

    high_risk_areas:
      - Upcoding and unbundling of services
      - Duplicate billing and claim splitting
      - Medical necessity documentation gaps
      - Evaluation and management level selection
      - Modifier 25 and modifier 59 usage patterns
```

### Templates

#### HIPAA Security Risk Assessment Summary
```markdown
# Security Risk Assessment Summary: [Organization Name]

## Assessment Scope
- Assessment Date: [Date]
- Assessment Period: [Start - End]
- Assessed By: [Internal/External Firm]
- Methodology: NIST SP 800-30 / OCR SRA Tool / [Other]

## ePHI Inventory
| System/Application | PHI Elements | Users | Location | Encryption |
|--------------------|-------------|-------|----------|------------|
| [EHR System] | [Demographics, Dx, Rx] | [Count] | [Cloud/On-prem] | [Yes/No] |
| [Practice Mgmt] | [Billing, Insurance] | [Count] | [Cloud/On-prem] | [Yes/No] |

## Risk Summary
| Risk ID | Threat/Vulnerability | Likelihood | Impact | Risk Level | Remediation |
|---------|---------------------|------------|--------|------------|-------------|
| R-001 | [Description] | [H/M/L] | [H/M/L] | [H/M/L] | [Action] |
| R-002 | [Description] | [H/M/L] | [H/M/L] | [H/M/L] | [Action] |

## Remediation Plan
| Priority | Risk ID | Action Item | Owner | Target Date | Status |
|----------|---------|-------------|-------|-------------|--------|
| 1 | R-001 | [Action] | [Name] | [Date] | [Status] |

## Executive Sign-Off
- Risk Acceptance: [Risks accepted with rationale]
- Approved By: [Name, Title]
- Date: [Date]
```

#### Breach Incident Response Template
```markdown
# Breach Incident Report: [Incident ID]

## Discovery
- Date of Discovery: [Date]
- Date of Breach Occurrence: [Date, if different]
- Discovered By: [Name, Role]
- Method of Discovery: [Audit/Report/Complaint/Other]

## Incident Details
- Nature of Breach: [Unauthorized access/disclosure/loss/theft]
- PHI Involved: [Types of information]
- Individuals Affected: [Count]
- Systems Involved: [List]

## Four-Factor Risk Assessment
1. **Nature and Extent of PHI**: [Analysis]
2. **Unauthorized Recipient**: [Analysis]
3. **PHI Actually Acquired or Viewed**: [Analysis]
4. **Mitigation Effectiveness**: [Analysis]
- **Determination**: [Low probability of compromise / Breach confirmed]

## Notification Timeline
| Action | Required By | Completed | Method |
|--------|------------|-----------|--------|
| Individual Notice | [60 days from discovery] | [Date] | [Mail/Email] |
| HHS Notice | [60 days / Annual] | [Date] | [HHS Portal] |
| Media Notice | [If >=500 in state] | [Date] | [Press release] |

## Corrective Actions
| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| [Action item] | [Name] | [Date] | [Status] |
```

### Best Practices

1. **Annual SRA Requirement**: Conduct or update the Security Risk Assessment every year without exception; this is the most-cited OCR audit deficiency
2. **Document Everything**: Maintain written evidence of all compliance activities, decisions, training, and risk acceptance for the six-year HIPAA retention period
3. **Encryption as Standard**: Encrypt all ePHI at rest and in transit; encryption provides safe harbor from breach notification when devices are lost or stolen
4. **Minimum Necessary Discipline**: Apply the minimum necessary standard rigorously through role-based access controls and need-to-know restrictions
5. **BAA Inventory Management**: Maintain a centralized BAA register and review all agreements annually for scope accuracy and termination provisions
6. **Workforce Training Cadence**: Train all workforce members within 30 days of hire and annually thereafter with documented competency verification
7. **Incident Response Testing**: Conduct tabletop breach exercises at least annually involving legal, IT, privacy, communications, and executive leadership
8. **Audit Log Reviews**: Review ePHI access logs regularly, focusing on break-the-glass events, after-hours access, and large data exports
9. **Patch Management Rigor**: Apply critical security patches within 30 days; unpatched systems are a leading cause of healthcare data breaches
10. **State Law Awareness**: Monitor state-specific health privacy laws (e.g., California CMIA, Texas HB 300, New York SHIELD Act) that may impose stricter requirements
11. **De-identification Standards**: Use Safe Harbor (remove 18 identifiers) or Expert Determination method and document the approach used
12. **Vendor Risk Management**: Assess business associate security posture before onboarding and periodically thereafter through questionnaires or SOC 2 review

### Common Patterns

#### Pattern 1: OCR Audit Preparation
```
Scenario: A mid-size health system receives an OCR desk audit notification
requesting documentation within 30 days.

Process:
1. Activate the compliance response team (privacy officer, CISO, legal counsel)
2. Review the OCR data request letter and identify all requested documentation
3. Pull current SRA documentation, policies, and risk management plans
4. Compile training records, BAA inventory, and NPP distribution evidence
5. Gather audit log review documentation and access management procedures
6. Prepare breach log with all incidents and four-factor risk assessments
7. Organize documentation by OCR audit protocol category (Privacy, Security, Breach)
8. Conduct internal quality review of all materials before submission
9. Submit response within deadline via OCR-specified secure portal
10. Brief executive leadership on potential areas of exposure identified
```

#### Pattern 2: Business Associate Compliance Remediation
```
Scenario: A cloud-based EHR vendor (business associate) reports a
ransomware incident potentially affecting patient data.

Process:
1. Invoke BAA breach notification provisions and demand written incident report
2. Verify vendor's obligation to notify within timeframe specified in BAA (typically 24-72 hours)
3. Assess scope: number of patients affected, types of PHI exposed, encryption status
4. Conduct four-factor risk assessment to determine breach notification obligation
5. If breach confirmed, activate notification procedures within 60-day HIPAA timeline
6. Engage forensic investigator to validate vendor's incident findings independently
7. Evaluate BAA indemnification provisions for notification and remediation costs
8. Issue corrective action requirements to vendor with verification milestones
9. Report to HHS via breach portal if 500+ individuals affected
10. Update vendor risk assessment and consider contract termination if controls inadequate
```

### Output Formats

#### Compliance Program Scorecard
```markdown
# HIPAA Compliance Scorecard: [Organization] - [Quarter/Year]

## Program Maturity by Domain
| Domain | Maturity (1-5) | Trend | Priority Items |
|--------|---------------|-------|----------------|
| Privacy Policies | [Score] | [Up/Down/Stable] | [Count] |
| Security Risk Mgmt | [Score] | [Up/Down/Stable] | [Count] |
| Breach Preparedness | [Score] | [Up/Down/Stable] | [Count] |
| Training & Awareness | [Score] | [Up/Down/Stable] | [Count] |
| BA Management | [Score] | [Up/Down/Stable] | [Count] |
| Audit & Monitoring | [Score] | [Up/Down/Stable] | [Count] |

## Key Metrics
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| SRA Completion | [%] | 100% | [On track/Behind] |
| Training Completion | [%] | 95% | [On track/Behind] |
| Open Risk Items | [Count] | <[Target] | [On track/Behind] |
| BAAs Current | [%] | 100% | [On track/Behind] |
| Incidents YTD | [Count] | <[Target] | [On track/Behind] |
```

## Integration Points

- Electronic Health Record systems (Epic, Cerner, MEDITECH, Allscripts)
- Practice management and billing platforms
- Health Information Exchanges (HIEs)
- Claims clearinghouses and payer portals
- Identity and access management systems
- SIEM and security monitoring platforms
- GRC tools (RSA Archer, ServiceNow GRC, LogicGate)
- OCR audit protocol and HHS breach portal

## Version History

- 1.0.0: Initial healthcare compliance skill with HIPAA, HITECH, and clinical compliance coverage
