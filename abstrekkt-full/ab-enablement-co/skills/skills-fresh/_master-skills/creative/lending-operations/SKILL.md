---
name: lending-operations
description: Comprehensive guidance for lending operations including loan origination, credit underwriting, decisioning, loan servicing, payment processing, default management, and collections. Use when designing, creating, or reviewing creative deliverables.
---

# Lending Operations Skill

> Underwriting processes, loan servicing, and collections management

## Description

This skill provides comprehensive guidance for lending operations including loan origination, credit underwriting, decisioning, loan servicing, payment processing, default management, and collections. It covers consumer, commercial, and specialty lending across the full loan lifecycle.

## Activation Triggers

- User mentions "lending operations", "underwriting", "loan servicing"
- User asks about credit decisioning or risk assessment
- User needs help with loan origination workflows
- User discusses collections or default management
- User asks about payment processing or escrow
- User mentions regulatory compliance for lending
- User needs loan portfolio management guidance

## Instructions

### Core Workflow

1. **Origination**
   - Receive and process applications
   - Verify applicant information
   - Assess creditworthiness
   - Make credit decisions
   - Fund approved loans

2. **Servicing**
   - Process payments
   - Manage escrow accounts
   - Handle customer inquiries
   - Process modifications
   - Maintain loan records

3. **Default Management**
   - Identify delinquencies
   - Pursue collections
   - Work out troubled loans
   - Execute foreclosure/recovery
   - Manage charged-off accounts

### Loan Origination Process

```yaml
origination:
  application:
    consumer:
      - Personal information
      - Employment and income
      - Assets and liabilities
      - Purpose of loan
      - Collateral (if secured)

    commercial:
      - Business information
      - Financial statements
      - Tax returns
      - Business plan
      - Collateral documentation

  verification:
    identity:
      - Government ID verification
      - SSN/TIN validation
      - Address verification
      - OFAC/sanctions screening

    income:
      - Pay stubs
      - W-2/1099 forms
      - Tax returns
      - Employer verification
      - Bank statements

    assets:
      - Bank account statements
      - Investment accounts
      - Property valuations
      - Other asset documentation

  documentation:
    - Loan application
    - Credit authorization
    - Disclosures (TILA, RESPA)
    - Collateral documentation
    - Closing documents
```

### Credit Underwriting

```yaml
underwriting:
  credit_analysis:
    five_cs:
      character:
        - Credit history review
        - Payment patterns
        - Derogatory items
        - Prior relationships

      capacity:
        - Income verification
        - Debt-to-income ratio
        - Employment stability
        - Cash flow analysis

      capital:
        - Down payment/equity
        - Reserves
        - Net worth
        - Liquidity

      collateral:
        - Valuation
        - Lien position
        - Condition
        - Marketability

      conditions:
        - Purpose of loan
        - Economic environment
        - Industry factors
        - Loan structure

  scoring_models:
    consumer:
      - FICO Score
      - VantageScore
      - Custom scorecards
      - Application scores

    commercial:
      - Business credit scores
      - Financial ratios
      - Industry benchmarks
      - Proprietary models

  decision_framework:
    automated:
      - Score cutoffs
      - Policy rules
      - Instant decisioning
      - Conditional approval

    manual_review:
      - Exceptions handling
      - Complex applications
      - Appeals process
      - Senior approval
```

### Loan Pricing

```yaml
pricing:
  components:
    cost_of_funds: "Base rate (Treasury, SOFR, etc.)"
    credit_spread: "Risk-based pricing"
    operating_costs: "Servicing and overhead"
    profit_margin: "Return objectives"
    regulatory_costs: "Reserve requirements, insurance"

  risk_based_pricing:
    - Credit tier assignment
    - Collateral adjustment
    - Term adjustment
    - Product type factors

  fair_lending:
    - Consistent pricing methodology
    - Exception documentation
    - Disparate impact analysis
    - Regular testing
```

### Loan Servicing

```yaml
servicing:
  payment_processing:
    - Payment receipt
    - Application of funds (principal, interest, escrow)
    - Grace period handling
    - Late fee assessment
    - Payoff processing

  escrow_management:
    - Property tax payments
    - Insurance premiums
    - PMI/MIP payments
    - Annual analysis
    - Shortage/surplus handling

  customer_service:
    - Payment inquiries
    - Statement requests
    - Account changes
    - Correspondence
    - Dispute resolution

  account_maintenance:
    - Interest rate adjustments (ARM)
    - Maturity extensions
    - Loan modifications
    - Assumptions
    - Releases

  investor_reporting:
    - Remittance processing
    - Pool factor calculations
    - Performance reporting
    - Default reporting
```

### Collections and Default

```yaml
collections:
  early_stage:
    delinquency_triggers:
      - 1-30 days: Reminder notices
      - 31-60 days: Phone contact
      - 61-90 days: Demand letters

    contact_strategies:
      - Outbound calls
      - Written notices
      - Email/SMS (with consent)
      - Right-party contact

    loss_mitigation:
      - Payment plans
      - Forbearance
      - Loan modification
      - Deferment

  late_stage:
    90_plus_days:
      - Acceleration notice
      - Legal referral consideration
      - Charge-off evaluation
      - Recovery strategies

    charge_off:
      - Write-off processing
      - Tax implications (1099-C)
      - Recovery pursuit
      - Agency placement

  foreclosure_repossession:
    real_estate:
      - Foreclosure initiation
      - State-specific requirements
      - REO management
      - Loss recovery

    personal_property:
      - Repossession procedures
      - Deficiency balance
      - Asset disposition
      - Recovery accounting

  regulatory_compliance:
    - FDCPA requirements
    - State collection laws
    - SCRA protections
    - Bankruptcy handling
```

### Loan Modifications

```yaml
modifications:
  types:
    - Interest rate reduction
    - Term extension
    - Principal forbearance
    - Principal forgiveness
    - Capitalization of arrears

  evaluation:
    hardship_assessment:
      - Income reduction
      - Medical issues
      - Divorce/separation
      - Natural disaster

    affordability_analysis:
      - Current income
      - Debt ratios
      - Payment reduction needed
      - Sustainability

  documentation:
    - Hardship affidavit
    - Financial disclosure
    - Income verification
    - Modified note/agreement

  investor_requirements:
    - Modification limits
    - NPV analysis
    - Reporting requirements
    - Trial period plans
```

### Regulatory Compliance

```yaml
compliance:
  tila:
    - APR disclosure
    - Finance charge disclosure
    - Payment schedule
    - Right of rescission

  respa:
    - Loan estimate
    - Closing disclosure
    - Servicing transfer notices
    - Escrow requirements

  ecoa:
    - Non-discrimination
    - Adverse action notices
    - Spousal signature rules
    - Application retention

  fcra:
    - Permissible purpose
    - Adverse action
    - Dispute handling
    - Furnisher requirements

  hmda:
    - Data collection
    - LAR submission
    - Public disclosure

  fair_lending:
    - Disparate treatment analysis
    - Disparate impact testing
    - Redlining assessment
    - Fair lending monitoring

  scra:
    - Interest rate caps
    - Foreclosure protections
    - Default judgment protections
    - Lease termination rights

  cfpb_servicing:
    - Error resolution
    - Information requests
    - Force-placed insurance
    - Loss mitigation procedures
```

### Portfolio Management

```yaml
portfolio:
  performance_metrics:
    - Delinquency rates (30/60/90+)
    - Charge-off rate
    - Net credit losses
    - Roll rates
    - Recovery rate
    - Yield

  concentration_analysis:
    - Geographic distribution
    - Product mix
    - Credit tier distribution
    - Industry concentration (commercial)
    - Vintage analysis

  stress_testing:
    - Scenario development
    - Loss projection
    - Capital impact
    - Action triggers

  reserves:
    - CECL methodology
    - Allowance calculation
    - Provision expense
    - Adequacy assessment
```

### Loan Operations Metrics

```yaml
metrics:
  origination:
    - Application volume
    - Approval rate
    - Decline reasons
    - Time to decision
    - Time to funding
    - Pull-through rate

  servicing:
    - Payment processing accuracy
    - First call resolution
    - Customer satisfaction
    - Escrow accuracy
    - Statement accuracy

  collections:
    - Contact rate
    - Promise-to-pay rate
    - Cure rate
    - Roll rate
    - Recovery rate
```

## Output Format

### Loan Decision Summary
```markdown
# Loan Decision Summary

## Applicant Information
- Applicant: [Name]
- Application Date: [Date]
- Loan Amount: [$]
- Loan Purpose: [Purpose]

## Credit Analysis
| Factor | Finding | Assessment |
|--------|---------|------------|
| Credit Score | [Score] | [Strong/Acceptable/Weak] |
| DTI Ratio | [%] | [Strong/Acceptable/Weak] |
| Employment | [Status] | [Strong/Acceptable/Weak] |
| Collateral | [LTV/Value] | [Strong/Acceptable/Weak] |

## Verification Summary
- Identity: [Verified/Pending]
- Income: [Verified/Pending]
- Employment: [Verified/Pending]
- Assets: [Verified/Pending]

## Risk Assessment
- Risk Rating: [Low/Medium/High]
- Key Risk Factors: [List]
- Mitigating Factors: [List]

## Decision
- **Recommendation:** [Approve/Decline/Approve with Conditions]
- **Terms:** [Rate, Term, Amount]
- **Conditions:** [If applicable]

## Pricing
- Interest Rate: [%]
- APR: [%]
- Monthly Payment: [$]

## Approval Authority
- Decision By: [Name/System]
- Date: [Date]
```

## Integration Points

- Loan origination systems (LOS)
- Credit bureaus (Experian, Equifax, TransUnion)
- Core banking systems
- Document management systems
- Payment processing systems
- Collections platforms
- Regulatory reporting systems
- Customer relationship management (CRM)

## Best Practices

1. **Consistent Underwriting**: Apply standards uniformly
2. **Documentation**: Thorough file documentation
3. **Fair Lending**: Regular testing and monitoring
4. **Customer Communication**: Proactive outreach
5. **Loss Mitigation**: Early intervention
6. **Compliance**: Embed in all processes
7. **Technology**: Leverage automation
8. **Training**: Continuous staff development

## Common Pitfalls

- Inconsistent credit decisions
- Poor documentation practices
- Delayed collections contact
- Compliance gaps in disclosures
- Inadequate loss mitigation
- Stale appraisals/valuations
- Manual process bottlenecks
- Poor vendor management

## Version History

- 1.0.0: Initial lending operations skill
- 1.0.1: Added CECL section
- 1.0.2: Enhanced collections guidance
