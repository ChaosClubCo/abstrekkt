---
name: fintech-compliance
description: Helps configure and build fintech compliance processes. Comprehensive guidance for fintech regulatory compliance including banking regulations, money transmitter licensing, securities laws, consumer protection, data privacy, and examination preparation. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Fintech Compliance Skill

> Banking regulations, licensing requirements, and regulatory audits

## Description

This skill provides comprehensive guidance for fintech regulatory compliance including banking regulations, money transmitter licensing, securities laws, consumer protection, data privacy, and examination preparation. It covers federal and state requirements for various fintech business models and helps navigate the complex regulatory landscape.

## Activation Triggers

- User mentions "fintech compliance", "banking regulations", "money transmission"
- User asks about licensing requirements or state registrations
- User needs help with regulatory examinations or audits
- User discusses BSA/AML, consumer protection, or data privacy
- User asks about MSB registration or BitLicense
- User mentions banking charter or partnership models
- User needs compliance program development

## Instructions

### Core Workflow

1. **Business Model Assessment**
   - Identify all financial activities
   - Map regulatory touchpoints
   - Determine licensing requirements
   - Identify supervisory agencies
   - Assess bank partnership needs

2. **Compliance Framework Development**
   - Design compliance program
   - Develop policies and procedures
   - Implement controls
   - Establish monitoring systems
   - Create training programs

3. **Ongoing Compliance Management**
   - Monitor regulatory changes
   - Conduct compliance testing
   - Prepare for examinations
   - Manage regulatory relationships
   - Report as required

### Regulatory Framework

```yaml
federal_regulators:
  occ:
    jurisdiction: "National banks, federal savings associations"
    key_areas:
      - Charter applications
      - Safety and soundness
      - Consumer compliance
      - BSA/AML

  federal_reserve:
    jurisdiction: "Bank holding companies, state member banks"
    key_areas:
      - Bank supervision
      - Payment systems
      - Consumer protection
      - Monetary policy

  fdic:
    jurisdiction: "State non-member banks, deposit insurance"
    key_areas:
      - Deposit insurance
      - Safety and soundness
      - Consumer compliance
      - Resolution planning

  cfpb:
    jurisdiction: "Consumer financial products and services"
    key_areas:
      - Consumer protection
      - Fair lending
      - Unfair/deceptive practices (UDAAP)
      - Disclosure requirements

  fincen:
    jurisdiction: "Anti-money laundering, MSB registration"
    key_areas:
      - MSB registration
      - BSA/AML compliance
      - Suspicious activity reporting
      - Beneficial ownership

  sec:
    jurisdiction: "Securities, investment advisers"
    key_areas:
      - Securities offerings
      - Broker-dealer registration
      - Investment adviser registration
      - Digital assets/tokens

  cftc:
    jurisdiction: "Derivatives, commodities"
    key_areas:
      - Derivatives regulation
      - Commodity trading
      - Digital asset classification
```

### State Licensing Requirements

```yaml
state_licensing:
  money_transmitter:
    states: "47 states + DC, PR, USVI (Montana exempt)"
    requirements:
      - Application and fees
      - Net worth/surety bond
      - Background checks
      - Financial statements
      - Compliance program
      - Permissible investments

    nmls_requirements:
      - Company registration
      - Branch registrations
      - Individual licensees (control persons)
      - Annual renewals
      - Call report filing

  lending_licenses:
    types:
      - Consumer lender license
      - Commercial lender license
      - Mortgage lender/broker license
      - Sales finance license
    requirements: "Vary significantly by state"

  special_state_requirements:
    new_york:
      - BitLicense for virtual currency
      - Part 500 cybersecurity
      - Money transmitter license
    california:
      - Digital Financial Assets Law
      - California Financing Law
      - Money Transmission Act
```

### Key Regulatory Areas

```yaml
bsa_aml:
  program_elements:
    - Written policies and procedures
    - Designated compliance officer
    - Independent testing
    - Training program
    - Customer due diligence (CDD)

  customer_due_diligence:
    - Customer identification program (CIP)
    - Beneficial ownership identification
    - Risk-based customer assessment
    - Enhanced due diligence for high-risk
    - Ongoing monitoring

  suspicious_activity:
    - Detection systems
    - Investigation procedures
    - SAR filing (FinCEN Form 111)
    - Filing timelines (30 days)
    - Record retention (5 years)

  currency_transaction:
    - CTR filing ($10,000+ threshold)
    - Aggregation rules
    - Exemption procedures
    - Filing timelines

consumer_protection:
  tila:
    - APR disclosures
    - Right of rescission
    - Ability to repay
    - Billing error resolution

  ecoa:
    - Non-discrimination
    - Adverse action notices
    - Fair lending data collection
    - Disparate impact analysis

  fcra:
    - Consumer report usage
    - Permissible purpose
    - Adverse action notices
    - Dispute resolution
    - Data furnisher obligations

  efta:
    - Disclosure requirements
    - Error resolution
    - Liability limits
    - Compulsory use prohibition

  udaap:
    - Unfair practices prohibition
    - Deceptive practices prohibition
    - Abusive practices prohibition
    - Marketing and advertising
```

### Bank Partnership Models

```yaml
bank_partnerships:
  banking_as_a_service:
    structure:
      - Partner bank holds licenses/charter
      - Fintech provides technology/customer interface
      - Bank maintains regulatory oversight

    regulatory_considerations:
      - Third-party risk management
      - Vendor due diligence
      - Ongoing monitoring
      - Examination expectations

  key_agreements:
    - Bank partnership agreement
    - Program management agreement
    - Technology services agreement
    - Marketing agreement
    - Compliance responsibilities allocation

  occ_guidance:
    - Third-party relationships bulletin
    - Fintech partnerships guidance
    - Risk management expectations
    - Information security requirements
```

### Compliance Program Components

```yaml
compliance_program:
  governance:
    - Board oversight
    - Compliance committee
    - Chief Compliance Officer
    - Reporting structure
    - Independence

  risk_assessment:
    - Inherent risk identification
    - Control effectiveness
    - Residual risk rating
    - Monitoring schedule
    - Documentation

  policies_and_procedures:
    - Regulatory coverage
    - Operational guidance
    - Exception handling
    - Version control
    - Annual review

  training:
    - New hire training
    - Annual refresher
    - Role-specific training
    - Regulatory updates
    - Documentation

  monitoring_and_testing:
    - First line controls
    - Second line monitoring
    - Third line audit
    - Issue tracking
    - Remediation verification

  change_management:
    - New product review
    - Regulatory change tracking
    - Impact assessment
    - Implementation planning
```

### Examination Preparation

```yaml
examination:
  pre_exam:
    - Document organization
    - Prior exam remediation
    - Self-assessment
    - Key personnel briefing
    - Room preparation

  common_requests:
    - Policies and procedures
    - Board/committee minutes
    - Risk assessments
    - Training records
    - Audit reports
    - Complaint files
    - SAR decision memos
    - Vendor contracts

  examination_process:
    - Entrance meeting
    - Document production
    - Interviews
    - Testing/sampling
    - Preliminary findings
    - Exit meeting
    - Report of examination

  response_management:
    - Finding categorization
    - Remediation planning
    - Timeline commitment
    - Progress tracking
    - Closure verification
```

### Regulatory Reporting

```yaml
reporting:
  fincen_reporting:
    - MSB registration (FinCEN 107)
    - SAR (FinCEN 111)
    - CTR (FinCEN 112)
    - Beneficial ownership (BOI)

  cfpb_reporting:
    - Supervisory information requests
    - Consumer complaint data
    - HMDA data (if applicable)

  state_reporting:
    - NMLS call reports (quarterly)
    - Annual reports
    - Transaction data
    - Complaint logs
    - Examination responses

  sec_reporting:
    - Form ADV (investment advisers)
    - Form BD (broker-dealers)
    - Form D (private offerings)
    - Regulation crowdfunding forms
```

### Digital Asset Considerations

```yaml
digital_assets:
  regulatory_status:
    sec_framework:
      - Howey test application
      - Security token analysis
      - Investment contract determination

    cftc_framework:
      - Commodity classification
      - Derivatives oversight

    fincen_framework:
      - Virtual currency exchanger status
      - MSB registration requirements

  compliance_requirements:
    - Travel rule compliance
    - Transaction monitoring
    - Sanctions screening
    - Customer due diligence
    - Custody requirements

  state_requirements:
    - BitLicense (New York)
    - State money transmitter analysis
    - Emerging state frameworks
```

## Output Format

### Regulatory Assessment Report
```markdown
# Regulatory Assessment: [Company Name]

## Business Model Summary
[Description of products/services and activities]

## Regulatory Mapping
| Activity | Federal Regulator | State Requirements | Notes |
|----------|------------------|-------------------|-------|
| [Activity] | [Agency] | [Licenses needed] | [Notes] |

## Licensing Requirements
### Federal
- [Requirement with status]

### State-by-State
| State | License Type | Status | Notes |
|-------|--------------|--------|-------|
| [State] | [Type] | [Applied/Obtained/NA] | [Notes] |

## Compliance Program Gaps
| Area | Current State | Required State | Priority |
|------|---------------|----------------|----------|
| [Area] | [Description] | [Requirement] | [H/M/L] |

## Recommendations
1. [Prioritized recommendation]
2. [Prioritized recommendation]

## Timeline
[Implementation roadmap with milestones]

## Budget Estimate
[Resource and cost estimates]
```

## Integration Points

- NMLS (Nationwide Multistate Licensing System)
- FinCEN E-Filing System
- State regulatory portals
- GRC platforms
- Transaction monitoring systems
- Case management systems
- Training management systems

## Best Practices

1. **Proactive Engagement**: Build regulatory relationships
2. **Risk-Based Approach**: Focus on highest risks
3. **Documentation**: Maintain comprehensive records
4. **Continuous Monitoring**: Automate where possible
5. **Training**: Regular, role-specific training
6. **Change Management**: Track regulatory developments
7. **Independence**: Ensure compliance function independence
8. **Board Engagement**: Regular compliance reporting

## Common Pitfalls

- Underestimating state licensing complexity
- Inadequate BSA/AML program resources
- Poor vendor/partner oversight
- Incomplete change management
- Delayed exam remediation
- Insufficient documentation
- Reactive vs. proactive compliance
- Ignoring state-specific requirements

## Version History

- 1.0.0: Initial fintech compliance skill
- 1.0.1: Added digital asset considerations
- 1.0.2: Enhanced state licensing guidance
