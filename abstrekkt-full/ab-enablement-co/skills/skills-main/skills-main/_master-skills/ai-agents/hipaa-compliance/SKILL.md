---
name: hipaa-compliance
description: Comprehensive guidance for HIPAA compliance including PHI handling, security rule implementation, privacy controls, breach prevention and response, audit preparation, and Business Associate Agreement management. Use when configuring, building, or troubleshooting AI agent workflows.
---

# HIPAA Compliance Skill

> PHI handling, security controls, privacy audits, and healthcare data protection

## Description

This skill provides comprehensive guidance for HIPAA compliance including Protected Health Information (PHI) handling, security rule implementation, privacy controls, breach prevention and response, audit preparation, and Business Associate Agreement management. It covers technical safeguards, administrative requirements, and operational procedures for healthcare data protection.

## Activation Triggers

- User mentions "HIPAA", "PHI", "protected health information"
- User asks about healthcare data security or privacy
- User needs help with HIPAA audits or assessments
- User discusses BAA or business associate agreements
- User asks about healthcare compliance requirements
- User mentions breach notification or incident response
- User needs PHI de-identification guidance

## Instructions

### Core Workflow

1. **Assessment Phase**
   - Identify the type of covered entity or business associate
   - Determine applicable HIPAA rules (Privacy, Security, Breach Notification)
   - Review current compliance posture
   - Identify PHI touchpoints and data flows
   - Assess existing safeguards and controls

2. **Gap Analysis**
   - Compare current state against HIPAA requirements
   - Identify missing or inadequate controls
   - Prioritize remediation based on risk
   - Document findings with specific citations
   - Create actionable remediation roadmap

3. **Implementation Guidance**
   - Provide specific technical recommendations
   - Develop policy and procedure templates
   - Design training program content
   - Create audit documentation
   - Establish monitoring and review processes

### HIPAA Rules Framework

#### Privacy Rule Requirements
```yaml
privacy_rule:
  minimum_necessary:
    - Limit PHI access to job requirements
    - Implement role-based access controls
    - Regular access reviews
    - Document access decisions

  patient_rights:
    - Access to records (30-day response)
    - Amendment requests
    - Accounting of disclosures
    - Restriction requests
    - Confidential communications

  authorized_uses:
    - Treatment, payment, operations (TPO)
    - Required by law
    - Public health activities
    - With valid authorization

  notice_of_privacy:
    - Content requirements
    - Distribution methods
    - Acknowledgment tracking
    - Updates and revisions
```

#### Security Rule Requirements
```yaml
security_rule:
  administrative_safeguards:
    - Security management process
    - Assigned security responsibility
    - Workforce security
    - Information access management
    - Security awareness training
    - Security incident procedures
    - Contingency plan
    - Evaluation
    - Business associate contracts

  physical_safeguards:
    - Facility access controls
    - Workstation use policies
    - Workstation security
    - Device and media controls

  technical_safeguards:
    - Access control
    - Audit controls
    - Integrity controls
    - Transmission security
    - Authentication
```

### PHI Handling Guidelines

#### Identification of PHI
```yaml
phi_identifiers:
  direct_identifiers:
    - Names
    - Geographic data (smaller than state)
    - Dates (except year)
    - Phone numbers
    - Fax numbers
    - Email addresses
    - Social Security numbers
    - Medical record numbers
    - Health plan beneficiary numbers
    - Account numbers
    - Certificate/license numbers
    - Vehicle identifiers
    - Device identifiers
    - Web URLs
    - IP addresses
    - Biometric identifiers
    - Full face photographs
    - Any other unique identifying number
```

#### De-identification Methods
```yaml
de_identification:
  safe_harbor:
    - Remove all 18 identifiers
    - No actual knowledge of re-identification
    - Document removal process

  expert_determination:
    - Qualified statistical expert
    - Apply scientific methods
    - Very small re-identification risk
    - Document methodology
```

### Risk Assessment Framework

```yaml
risk_assessment:
  scope:
    - All ePHI systems
    - All locations and departments
    - All workforce members
    - All business associates

  methodology:
    - Asset inventory
    - Threat identification
    - Vulnerability analysis
    - Risk calculation
    - Control recommendations
    - Residual risk acceptance

  documentation:
    - Assessment date and scope
    - Methodology used
    - Findings and ratings
    - Remediation plans
    - Management sign-off

  frequency:
    - Annual comprehensive assessment
    - Triggered by significant changes
    - Ongoing monitoring
```

### Business Associate Management

```yaml
business_associates:
  identification:
    - Vendors with PHI access
    - Cloud service providers
    - IT contractors
    - Billing companies
    - Clearinghouses
    - Consultants

  baa_requirements:
    - Permitted uses and disclosures
    - Safeguard obligations
    - Subcontractor requirements
    - Breach notification duties
    - Termination provisions
    - Return/destruction of PHI

  oversight:
    - Due diligence reviews
    - Annual attestations
    - Audit rights
    - Incident reporting
```

### Breach Response Protocol

```yaml
breach_response:
  detection:
    - Monitoring systems
    - Workforce reporting
    - Patient complaints
    - Third-party notifications

  assessment:
    - Determine if breach occurred
    - Identify PHI involved
    - Evaluate risk of harm
    - Document analysis

  notification_requirements:
    individual:
      - Within 60 days
      - Written notice
      - Required content elements

    hhs:
      - Under 500: annual report
      - 500+: within 60 days

    media:
      - 500+ in jurisdiction
      - Prominent media outlets

  mitigation:
    - Contain the breach
    - Recover PHI if possible
    - Implement corrective actions
    - Update policies/procedures
```

### Audit Preparation Checklist

```yaml
audit_preparation:
  documentation:
    - Policies and procedures
    - Risk assessments
    - Training records
    - BAA inventory
    - Incident logs
    - Access logs
    - Security configurations

  interview_preparation:
    - Privacy Officer
    - Security Officer
    - IT staff
    - Department managers
    - Workforce members

  walkthrough_areas:
    - Physical security
    - Workstation practices
    - System access controls
    - PHI storage areas
    - Disposal procedures
```

### Training Requirements

```yaml
training:
  initial:
    - Within reasonable time of hire
    - HIPAA overview
    - Privacy policies
    - Security procedures
    - Role-specific requirements

  ongoing:
    - Annual refresher
    - Policy updates
    - Incident lessons learned
    - New regulation guidance

  documentation:
    - Attendance records
    - Content covered
    - Competency verification
    - Acknowledgment forms
```

## Output Format

### Compliance Assessment Report
```markdown
# HIPAA Compliance Assessment

## Executive Summary
[High-level findings and risk rating]

## Scope and Methodology
[Assessment boundaries and approach]

## Findings by Category

### Administrative Safeguards
| Requirement | Status | Gap | Priority |
|-------------|--------|-----|----------|
| [Requirement] | [Met/Partial/Not Met] | [Description] | [High/Medium/Low] |

### Physical Safeguards
[Same format]

### Technical Safeguards
[Same format]

## Risk Summary
- Critical Findings: [Count]
- High Risk: [Count]
- Medium Risk: [Count]
- Low Risk: [Count]

## Remediation Roadmap
[Prioritized action items with timelines]

## Appendices
[Supporting documentation]
```

## Integration Points

- Electronic Health Record (EHR) systems
- Practice management systems
- Cloud service providers
- Security information and event management (SIEM)
- Identity and access management (IAM)
- Encryption and key management systems
- Audit log management

## Key Regulations Reference

```yaml
regulations:
  hipaa_privacy: "45 CFR Part 160 and Subparts A, E of Part 164"
  hipaa_security: "45 CFR Part 160 and Subparts A, C of Part 164"
  breach_notification: "45 CFR Part 164, Subpart D"
  hitech_act: "Health Information Technology for Economic and Clinical Health Act"
  state_laws: "May have stricter requirements than HIPAA"
```

## Best Practices

1. **Minimum Necessary**: Always apply the minimum necessary standard
2. **Documentation**: Document everything - if it isn't documented, it didn't happen
3. **Training**: Regular, role-specific training is essential
4. **Risk Management**: Continuous risk assessment, not one-time
5. **Incident Response**: Have a tested breach response plan
6. **Vendor Management**: Actively manage business associate relationships
7. **Physical Security**: Don't neglect physical safeguards
8. **Encryption**: Encrypt PHI at rest and in transit

## Common Pitfalls

- Treating HIPAA as an IT-only issue
- Inadequate business associate oversight
- Incomplete or outdated risk assessments
- Poor access control management
- Insufficient training documentation
- Delayed breach notifications
- Ignoring state law requirements

## Version History

- 1.0.0: Initial HIPAA compliance skill
- 1.0.1: Added breach response protocol updates
- 1.0.2: Enhanced risk assessment framework
