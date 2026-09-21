---
name: insurance-operations
description: Helps configure and build insurance operations processes. Comprehensive guidance for insurance operations including underwriting, policy administration, claims processing, actuarial analysis, reinsurance, and regulatory compliance. Covers property & casualty, life & health, and specialty insurance lines. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Insurance Operations Skill

> Underwriting, claims processing, and actuarial operations

## Description

This skill provides comprehensive guidance for insurance operations including underwriting, policy administration, claims processing, actuarial analysis, reinsurance, and regulatory compliance. It covers property & casualty, life & health, and specialty insurance lines across the full policy lifecycle.

## Activation Triggers

- User mentions "insurance operations", "underwriting", "claims processing"
- User asks about policy administration or rating
- User needs help with claims adjudication
- User discusses actuarial analysis or reserving
- User asks about reinsurance or risk transfer
- User mentions insurance regulatory compliance
- User needs loss ratio or combined ratio analysis

## Instructions

### Core Workflow

1. **Underwriting**
   - Receive and evaluate applications
   - Assess risk and determine pricing
   - Issue or decline policies
   - Set terms and conditions
   - Manage renewals

2. **Policy Administration**
   - Issue policies and documents
   - Process endorsements
   - Collect premiums
   - Maintain policy records
   - Handle cancellations

3. **Claims Management**
   - Receive and register claims
   - Investigate and adjust
   - Determine coverage
   - Process payments
   - Manage litigation

### Insurance Lines of Business

```yaml
lines_of_business:
  property_casualty:
    personal:
      - Homeowners
      - Auto
      - Umbrella
      - Renters

    commercial:
      - Commercial property
      - General liability
      - Workers compensation
      - Commercial auto
      - Professional liability
      - D&O/E&O

  life_health:
    life:
      - Term life
      - Whole life
      - Universal life
      - Variable life

    health:
      - Medical
      - Dental
      - Vision
      - Disability
      - Long-term care

  specialty:
    - Cyber liability
    - Environmental
    - Marine
    - Aviation
    - Surety bonds
```

### Underwriting Process

```yaml
underwriting:
  application_review:
    data_collection:
      - Application information
      - Prior insurance history
      - Claims history
      - Credit information
      - Inspection reports

    risk_assessment:
      - Exposure identification
      - Loss history analysis
      - Hazard evaluation
      - Financial stability
      - Character assessment

  rating:
    components:
      - Base rate
      - Classification
      - Territory
      - Experience modification
      - Schedule credits/debits
      - Package adjustments

    pricing_models:
      - Manual rating
      - Experience rating
      - Retrospective rating
      - Predictive models

  decision:
    outcomes:
      - Accept as submitted
      - Accept with modifications
      - Decline
      - Refer for additional review

    documentation:
      - Underwriting file
      - Decision rationale
      - Approval authority
      - Binding requirements
```

### Policy Administration

```yaml
policy_admin:
  issuance:
    - Policy document generation
    - Declaration page
    - Policy forms and endorsements
    - Certificates of insurance
    - ID cards (auto)

  endorsements:
    types:
      - Add/remove coverage
      - Change limits
      - Add/remove insured
      - Location changes
      - Vehicle changes

    processing:
      - Request receipt
      - Premium calculation
      - Document generation
      - Billing update
      - File update

  billing:
    - Premium calculation
    - Invoice generation
    - Payment processing
    - Installment plans
    - Collections
    - Cancellation for non-payment

  renewals:
    - Renewal underwriting
    - Rate updates
    - Coverage review
    - Renewal offers
    - Non-renewal notices
```

### Claims Processing

```yaml
claims:
  first_notice:
    intake:
      - Claim report receipt
      - Initial data capture
      - Coverage verification
      - Assignment to adjuster
      - Reserve establishment

    channels:
      - Phone
      - Web/mobile
      - Agent submission
      - Third-party reporting

  investigation:
    activities:
      - Recorded statements
      - Scene investigation
      - Document collection
      - Expert engagement
      - Subrogation investigation

    coverage_analysis:
      - Policy review
      - Coverage determination
      - Exclusion analysis
      - Limits verification

  adjustment:
    property:
      - Damage assessment
      - Repair estimates
      - Actual cash value
      - Replacement cost
      - Depreciation

    liability:
      - Liability determination
      - Damages evaluation
      - Negotiation
      - Settlement authority

  resolution:
    - Payment processing
    - Subrogation pursuit
    - Salvage recovery
    - File closure
    - Reopening protocols
```

### Claims Metrics

```yaml
claims_metrics:
  cycle_time:
    - Report to assignment
    - Assignment to contact
    - Report to close
    - Report to payment

  quality:
    - Accuracy rate
    - Reopened claims rate
    - Customer satisfaction
    - Litigation rate

  financial:
    - Paid loss
    - Incurred loss
    - Severity (average claim)
    - Frequency
    - Loss ratio
```

### Actuarial Operations

```yaml
actuarial:
  pricing:
    rate_making:
      - Loss development
      - Trend analysis
      - Exposure analysis
      - Rate adequacy testing
      - Profit provision

    methods:
      - Pure premium
      - Loss ratio
      - Credibility weighting
      - GLM modeling

  reserving:
    reserves:
      - Case reserves
      - IBNR (incurred but not reported)
      - IBNER (incurred but not enough reported)
      - Unearned premium reserve
      - Loss adjustment expense

    methods:
      - Chain ladder
      - Bornhuetter-Ferguson
      - Expected loss ratio
      - Cape Cod

  financial:
    - Statutory accounting
    - GAAP accounting
    - Embedded value
    - Capital modeling
    - Stress testing
```

### Reinsurance

```yaml
reinsurance:
  types:
    treaty:
      - Quota share
      - Surplus share
      - Excess of loss
      - Stop loss

    facultative:
      - Individual risk placement
      - Large/unusual risks
      - Capacity management

  administration:
    - Premium calculation and reporting
    - Loss reporting and recovery
    - Contract administration
    - Bordereaux preparation
    - Settlement processing

  accounting:
    - Ceding commission
    - Profit commission
    - Loss recovery
    - Funds held
```

### Regulatory Compliance

```yaml
compliance:
  state_regulation:
    filings:
      - Rate filings
      - Form filings
      - Annual statement
      - Market conduct

    licensing:
      - Company licensing
      - Agent licensing
      - Surplus lines
      - Admitted vs non-admitted

  financial_reporting:
    - Annual statement (statutory)
    - Quarterly statement
    - Risk-based capital
    - ORSA
    - Holding company filings

  market_conduct:
    - Underwriting practices
    - Claims handling
    - Advertising
    - Policy forms
    - Rate adequacy

  consumer_protection:
    - Unfair claims practices
    - Unfair trade practices
    - Privacy requirements
    - Complaint handling
```

### Key Performance Metrics

```yaml
metrics:
  underwriting:
    - Hit ratio (quoted to bound)
    - Premium volume
    - Retention rate
    - New business growth
    - Rate adequacy

  profitability:
    loss_ratio:
      formula: "Incurred Losses / Earned Premium"
      target: "Varies by line"

    expense_ratio:
      formula: "Underwriting Expenses / Written Premium"
      components:
        - Acquisition costs
        - Administrative costs

    combined_ratio:
      formula: "Loss Ratio + Expense Ratio"
      target: "<100% for underwriting profit"

    operating_ratio:
      formula: "Combined Ratio - Investment Income Ratio"

  claims:
    - Claims frequency
    - Claims severity
    - Closure rate
    - Litigation rate
    - Subrogation recovery
```

### Technology and Automation

```yaml
technology:
  core_systems:
    - Policy administration system
    - Claims management system
    - Billing system
    - Rating engine
    - Document management

  digital_transformation:
    - Digital distribution
    - Self-service portals
    - Telematics (auto)
    - IoT sensors (property)
    - AI/ML for underwriting
    - Claims automation
```

## Output Format

### Underwriting Summary
```markdown
# Underwriting Summary

## Applicant Information
- Named Insured: [Name]
- Line of Business: [LOB]
- Policy Period: [Dates]
- State: [State]

## Risk Profile
| Factor | Assessment | Notes |
|--------|------------|-------|
| Class | [Code] | [Description] |
| Territory | [Code] | [Location] |
| Experience | [Mod] | [Loss history] |
| Hazards | [Rating] | [Identified hazards] |

## Coverage Summary
| Coverage | Limit | Deductible | Premium |
|----------|-------|------------|---------|
| [Coverage] | [$] | [$] | [$] |

## Premium Calculation
- Base Premium: [$]
- Schedule Modifications: [$]
- Experience Modification: [Factor]
- Total Premium: [$]

## Underwriting Decision
- **Recommendation:** [Accept/Decline/Refer]
- **Terms/Conditions:** [If applicable]
- **Approval Level:** [Authority required]

## Rationale
[Underwriting rationale]
```

### Claims Summary
```markdown
# Claims Summary Report

## Claim Information
- Claim Number: [Number]
- Policy Number: [Number]
- Date of Loss: [Date]
- Date Reported: [Date]

## Coverage Analysis
- Coverage Applies: [Yes/No]
- Applicable Coverage: [Coverage type]
- Limits: [$]
- Deductible: [$]

## Investigation Summary
[Summary of investigation findings]

## Damages
| Category | Amount |
|----------|--------|
| [Damage type] | [$] |
| **Total** | [$] |

## Reserve
- Case Reserve: [$]
- ALAE Reserve: [$]
- Total Reserve: [$]

## Status
- Current Status: [Open/Closed]
- Next Steps: [Action items]
```

## Integration Points

- Policy administration systems
- Claims management systems
- Rating engines
- Document management
- Billing systems
- Actuarial platforms
- Regulatory reporting systems
- Distribution/agency management

## Best Practices

1. **Risk Selection**: Consistent underwriting standards
2. **Documentation**: Thorough file documentation
3. **Claims Service**: Prompt, fair claims handling
4. **Reserving**: Accurate, timely reserve setting
5. **Compliance**: Proactive regulatory management
6. **Data Quality**: Maintain accurate policy/claims data
7. **Automation**: Streamline routine processes
8. **Customer Focus**: Service-oriented operations

## Common Pitfalls

- Inconsistent underwriting decisions
- Inadequate reserve setting
- Delayed claims payment
- Poor documentation practices
- Rate inadequacy
- Regulatory filing delays
- Manual process inefficiencies
- Siloed systems and data

## Version History

- 1.0.0: Initial insurance operations skill
- 1.0.1: Added reinsurance section
- 1.0.2: Enhanced claims metrics
