---
name: kyc-aml
description: Comprehensive guidance for Know Your Customer (KYC) and Anti-Money Laundering (AML) compliance including customer identification, due diligence, transaction monitoring, sanctions screening, and suspicious activity reporting. Use when configuring, building, or troubleshooting AI agent workflows.
---

# KYC/AML Skill

> Customer verification, anti-money laundering programs, and sanctions compliance

## Description

This skill provides comprehensive guidance for Know Your Customer (KYC) and Anti-Money Laundering (AML) compliance including customer identification, due diligence, transaction monitoring, sanctions screening, suspicious activity reporting, and regulatory examination preparation. It covers BSA requirements for financial institutions of all types.

## Activation Triggers

- User mentions "KYC", "AML", "anti-money laundering"
- User asks about customer identification or due diligence
- User needs help with transaction monitoring programs
- User discusses sanctions screening or OFAC
- User asks about SAR filing or suspicious activity
- User mentions beneficial ownership or CDD Rule
- User needs BSA/AML program development

## Instructions

### Core Workflow

1. **Customer Onboarding**
   - Collect customer information
   - Verify identity documents
   - Screen against sanctions lists
   - Assess customer risk
   - Apply appropriate due diligence

2. **Ongoing Monitoring**
   - Monitor transactions against profile
   - Screen ongoing transactions
   - Detect unusual patterns
   - Investigate alerts
   - Update customer information

3. **Regulatory Reporting**
   - File SARs as required
   - Submit CTRs for cash transactions
   - Maintain records
   - Respond to subpoenas
   - Prepare for examinations

### BSA/AML Program Requirements

```yaml
bsa_program:
  five_pillars:
    internal_controls:
      - Written policies and procedures
      - Risk assessment
      - Transaction monitoring
      - Recordkeeping
      - Quality assurance

    bsa_officer:
      - Designated compliance officer
      - Authority and resources
      - Board reporting
      - Training on BSA requirements

    training:
      - Initial training
      - Annual refresher
      - Role-specific training
      - Documentation

    independent_testing:
      - Annual audit requirement
      - Scope and methodology
      - Findings remediation
      - Testing by qualified party

    cdd_program:
      - Customer identification
      - Beneficial ownership
      - Risk rating
      - Enhanced due diligence
```

### Customer Identification Program (CIP)

```yaml
cip:
  required_information:
    individuals:
      - Full legal name
      - Date of birth
      - Residential address
      - Identification number (SSN/TIN)

    entities:
      - Legal name
      - Principal place of business
      - TIN/EIN
      - Formation documents

  verification_methods:
    documentary:
      - Government-issued ID
      - Passport
      - Driver's license
      - State ID card

    non_documentary:
      - Credit bureau check
      - Database verification
      - Reference check
      - Financial statement review

  recordkeeping:
    - Description of documents
    - Verification methods used
    - Resolution of discrepancies
    - 5-year retention
```

### Customer Due Diligence (CDD)

```yaml
cdd:
  beneficial_ownership:
    requirements:
      - 25%+ ownership identification
      - Control person identification
      - Verification of information
      - Certification collection

    exemptions:
      - Publicly traded companies
      - Regulated financial institutions
      - Government entities
      - Certain pooled vehicles

  risk_rating:
    factors:
      - Customer type
      - Geographic risk
      - Product/service risk
      - Transaction patterns
      - Industry/occupation

    rating_levels:
      low:
        - Standard due diligence
        - Normal monitoring
        - Periodic review

      medium:
        - Enhanced verification
        - Increased monitoring
        - More frequent review

      high:
        - Senior approval required
        - Enhanced due diligence
        - Intensive monitoring
        - Frequent refresh

  enhanced_due_diligence:
    triggers:
      - High-risk geography
      - PEP status
      - Complex ownership
      - Unusual business model
      - Adverse media

    additional_steps:
      - Senior management approval
      - Source of wealth verification
      - Source of funds verification
      - Enhanced monitoring
      - More frequent refresh
```

### Sanctions Screening

```yaml
sanctions:
  ofac_programs:
    sdnList: "Specially Designated Nationals"
    consolidated: "Non-SDN Consolidated Lists"
    sectoral: "Sectoral Sanctions"
    country: "Country-based programs"

  screening_points:
    - Customer onboarding
    - Transaction processing
    - Periodic rescreening
    - Batch screening updates

  screening_elements:
    - Names (including aliases)
    - Addresses
    - ID numbers
    - Vessel/aircraft (where applicable)

  match_handling:
    potential_match:
      - Investigation required
      - Escalation to compliance
      - Documentation
      - Decision authority

    confirmed_match:
      - Immediate block/rejection
      - No unauthorized release
      - OFAC reporting
      - Senior notification

  false_positive_management:
    - Disposition documentation
    - System tuning
    - Ongoing monitoring
    - Regular review
```

### Transaction Monitoring

```yaml
transaction_monitoring:
  detection_scenarios:
    structuring:
      - Multiple transactions below threshold
      - Round dollar amounts
      - Multiple branches/locations
      - Short time periods

    unusual_patterns:
      - Inconsistent with profile
      - Sudden activity changes
      - Geographic anomalies
      - Industry mismatches

    high_risk_activity:
      - Cash intensive business
      - Wire activity to high-risk countries
      - Third-party payments
      - Complex transaction patterns

  alert_management:
    prioritization:
      - Risk score
      - Dollar amount
      - Customer risk rating
      - Alert type

    investigation:
      - Alert review
      - Transaction analysis
      - Customer profile review
      - Prior alert history
      - SAR determination

    disposition:
      - SAR filing decision
      - False positive documentation
      - Account action decision
      - Case closure
```

### Suspicious Activity Reporting

```yaml
sar_filing:
  filing_criteria:
    mandatory:
      - Known or suspected criminal violation
      - $5,000+ (insider)
      - $25,000+ (other suspicious)
      - No reasonable explanation

  filing_process:
    - Investigation completion
    - SAR narrative drafting
    - Quality review
    - BSA officer approval
    - FinCEN e-filing
    - 30-day deadline (from detection)

  narrative_content:
    - Who (subjects, victims)
    - What (suspicious activity)
    - When (dates and times)
    - Where (locations, accounts)
    - Why (reason for suspicion)
    - How (method of conduct)

  confidentiality:
    - No disclosure to subject
    - Safe harbor protection
    - Subpoena handling
    - Regulatory disclosure OK

  continuing_activity:
    - 90-day continuing SARs
    - Activity tracking
    - Account relationship decisions
```

### Currency Transaction Reporting

```yaml
ctr:
  filing_requirements:
    - Cash transactions over $10,000
    - Single or aggregated
    - Same business day
    - Same person/account

  exemption_categories:
    phase_1:
      - Banks
      - Government agencies
      - Listed public companies

    phase_2:
      - Established customers
      - Payroll customers
      - Eligible non-listed businesses

  filing_process:
    - Transaction identification
    - Aggregation check
    - Exemption review
    - FinCEN Form 112 filing
    - 15-day deadline
```

### PEP Screening

```yaml
pep:
  definition:
    - Senior government officials
    - Executives of state enterprises
    - Judiciary members
    - Senior military officers
    - Political party leaders
    - Family members and associates

  screening:
    - Onboarding screening
    - Periodic rescreening
    - Adverse media monitoring
    - Database sources

  enhanced_due_diligence:
    - Source of wealth verification
    - Source of funds documentation
    - Senior approval required
    - Enhanced monitoring
    - Regular relationship review
```

### Recordkeeping Requirements

```yaml
records:
  retention_periods:
    cip_records: "5 years after account closure"
    transaction_records: "5 years"
    sar_records: "5 years (narrative and supporting)"
    ctr_records: "5 years"
    wire_transfer_records: "5 years"

  record_types:
    - Customer identification documents
    - Beneficial ownership certifications
    - Transaction records
    - Account agreements
    - SAR decision memos
    - Alert investigation files
```

### Risk Assessment

```yaml
risk_assessment:
  bsa_risk_assessment:
    products:
      - Inherent risk by product
      - Control effectiveness
      - Residual risk

    customers:
      - Customer type risk
      - Geographic risk
      - Industry risk

    geography:
      - Domestic operations
      - International exposure
      - High-risk jurisdiction connections

  methodology:
    - Risk identification
    - Risk rating
    - Control assessment
    - Residual risk determination
    - Action planning
```

## Output Format

### KYC Review Report
```markdown
# KYC Review Report

## Customer Information
- Customer Name: [Name]
- Account Number: [Masked]
- Customer Type: [Individual/Entity]
- Relationship Date: [Date]

## Identification Verification
| Document | Number | Verified | Method |
|----------|--------|----------|--------|
| [Doc Type] | [Masked #] | [Y/N] | [Method] |

## Beneficial Ownership (if entity)
| Name | Role | Ownership % | Verified |
|------|------|-------------|----------|
| [Name] | [Control/Owner] | [%] | [Y/N] |

## Risk Assessment
- Customer Risk Rating: [Low/Medium/High]
- Key Risk Factors: [List]
- Due Diligence Level: [Standard/Enhanced]

## Screening Results
- Sanctions: [Clear/Hit-Resolved/Pending]
- PEP: [Clear/Hit-Resolved/Pending]
- Adverse Media: [Clear/Hit-Resolved/Pending]

## Recommendation
[Approve/Approve with Conditions/Decline]

## Next Review Date
[Date based on risk rating]
```

## Integration Points

- Core banking systems
- Customer onboarding platforms
- Sanctions screening systems (OFAC, WorldCheck)
- Transaction monitoring systems
- Case management systems
- FinCEN e-filing (BSA E-Filing)
- Document management systems
- Identity verification services

## Best Practices

1. **Risk-Based Approach**: Tailor to risk level
2. **Documentation**: Thorough recordkeeping
3. **Training**: Regular staff education
4. **Technology**: Leverage automation
5. **Monitoring**: Continuous transaction analysis
6. **Testing**: Regular program audits
7. **Updates**: Stay current with regulations
8. **Culture**: Tone from the top on compliance

## Common Pitfalls

- Checkbox approach to CDD
- Inadequate beneficial ownership verification
- Poor alert investigation quality
- Delayed SAR filings
- Insufficient documentation
- Inadequate training programs
- Stale customer information
- Weak independent testing

## Version History

- 1.0.0: Initial KYC/AML skill
- 1.0.1: Added beneficial ownership section
- 1.0.2: Enhanced sanctions screening guidance
