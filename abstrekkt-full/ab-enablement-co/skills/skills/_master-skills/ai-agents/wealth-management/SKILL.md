---
name: wealth-management
description: Comprehensive guidance for wealth management operations including portfolio management, investment reporting, performance measurement, client onboarding, account administration, and regulatory compliance. Covers investment advisory, brokerage, and trust operations. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Wealth Management Skill

> Portfolio management, investment reporting, and client advisory operations

## Description

This skill provides comprehensive guidance for wealth management operations including portfolio management, investment reporting, performance measurement, client onboarding, account administration, and regulatory compliance. It covers investment advisory, brokerage, and trust operations for high-net-worth and institutional clients.

## Activation Triggers

- User mentions "wealth management", "portfolio management", "investment advisory"
- User asks about performance reporting or attribution
- User needs help with client onboarding or suitability
- User discusses asset allocation or rebalancing
- User asks about RIA compliance or fiduciary duty
- User mentions trust administration or estate planning
- User needs investment operations guidance

## Instructions

### Core Workflow

1. **Client Onboarding**
   - Gather client information
   - Assess suitability and risk tolerance
   - Establish investment policy
   - Open accounts
   - Implement investment strategy

2. **Portfolio Management**
   - Construct portfolios
   - Execute trades
   - Monitor performance
   - Rebalance as needed
   - Manage tax efficiency

3. **Client Service**
   - Generate reports
   - Conduct reviews
   - Update planning
   - Handle transactions
   - Maintain relationships

### Client Onboarding Process

```yaml
onboarding:
  discovery:
    financial_profile:
      - Income and expenses
      - Assets and liabilities
      - Net worth calculation
      - Liquidity needs
      - Tax situation

    investment_profile:
      - Investment objectives
      - Time horizon
      - Risk tolerance
      - Investment experience
      - Existing holdings

    personal_information:
      - Family situation
      - Estate planning status
      - Insurance coverage
      - Business interests
      - Charitable goals

  documentation:
    account_opening:
      - Account application
      - Investment policy statement
      - Advisory agreement
      - Custodial agreement
      - Beneficiary designation

    compliance:
      - KYC verification
      - AML screening
      - Accreditation verification (if needed)
      - ERISA documentation (if applicable)
      - State registration

  suitability:
    assessment:
      - Risk capacity evaluation
      - Risk tolerance questionnaire
      - Investment knowledge
      - Financial sophistication
      - Concentration limits
```

### Investment Policy Statement

```yaml
ips:
  components:
    objectives:
      - Return objectives
      - Risk tolerance
      - Income requirements
      - Growth targets

    constraints:
      - Liquidity needs
      - Time horizon
      - Tax considerations
      - Legal restrictions
      - Unique circumstances

    asset_allocation:
      - Strategic allocation
      - Tactical ranges
      - Rebalancing triggers
      - Permitted investments
      - Prohibited investments

  review_cycle:
    - Annual review minimum
    - Life event triggers
    - Market condition triggers
    - Regulatory changes
```

### Portfolio Construction

```yaml
portfolio_construction:
  asset_allocation:
    strategic:
      - Long-term targets
      - Based on objectives
      - Risk-return optimization
      - Diversification

    tactical:
      - Short-term adjustments
      - Market conditions
      - Valuation considerations
      - Within policy ranges

  security_selection:
    equities:
      - Individual stocks
      - ETFs
      - Mutual funds
      - SMAs

    fixed_income:
      - Individual bonds
      - Bond funds
      - Municipal bonds
      - Credit quality

    alternatives:
      - Private equity
      - Hedge funds
      - Real assets
      - Structured products

  implementation:
    - Trade execution
    - Tax lot selection
    - Cost basis tracking
    - Settlement processing
```

### Performance Measurement

```yaml
performance:
  return_calculation:
    methods:
      time_weighted: "GIPS-compliant, manager evaluation"
      money_weighted: "Client experience, IRR"
      modified_dietz: "Approximate TWR"

    components:
      - Price appreciation
      - Income return
      - Total return
      - Gross vs net of fees

  attribution:
    analysis:
      - Asset allocation effect
      - Security selection effect
      - Interaction effect
      - Currency effect

    benchmarks:
      - Policy benchmark
      - Absolute return
      - Peer comparison
      - Blended benchmarks

  risk_metrics:
    - Standard deviation
    - Sharpe ratio
    - Beta
    - Max drawdown
    - Value at Risk (VaR)
    - Tracking error
```

### Investment Reporting

```yaml
reporting:
  client_reports:
    monthly_statement:
      - Holdings summary
      - Transaction activity
      - Performance summary
      - Fee disclosure

    quarterly_review:
      - Performance analysis
      - Attribution commentary
      - Market outlook
      - Rebalancing recommendations

    annual_report:
      - Comprehensive performance
      - IPS review
      - Tax reporting preparation
      - Planning update

  report_components:
    - Asset allocation chart
    - Holdings detail
    - Realized gains/losses
    - Unrealized gains/losses
    - Income summary
    - Fee summary
    - Benchmark comparison
```

### Rebalancing

```yaml
rebalancing:
  triggers:
    threshold:
      - Percentage drift from target
      - Dollar amount deviation
      - Risk metric threshold

    calendar:
      - Quarterly review
      - Annual rebalance
      - Tax-loss harvesting window

    tactical:
      - Market opportunity
      - Valuation signal
      - Economic indicator

  process:
    - Calculate current allocation
    - Compare to targets
    - Generate trade list
    - Review tax implications
    - Execute trades
    - Confirm settlement
    - Update records
```

### Tax Management

```yaml
tax_management:
  strategies:
    tax_loss_harvesting:
      - Identify loss positions
      - Wash sale avoidance
      - Substantially identical
      - Optimal timing

    asset_location:
      - Tax-efficient placement
      - Tax-deferred accounts
      - Taxable accounts
      - Tax-exempt accounts

    gain_deferral:
      - Hold period management
      - Long-term vs short-term
      - Charitable giving
      - Step-up basis planning

  reporting:
    - Cost basis tracking
    - Realized gain/loss
    - Tax lot identification
    - 1099 preparation
```

### Trust Administration

```yaml
trust_services:
  trust_types:
    - Revocable living trusts
    - Irrevocable trusts
    - Charitable trusts
    - Special needs trusts
    - GRAT/GRUT

  administration:
    - Principal and income accounting
    - Distribution processing
    - Tax return preparation
    - Beneficiary reporting
    - Document retention

  fiduciary_duties:
    - Prudent investor rule
    - Duty of loyalty
    - Duty of impartiality
    - Duty to account
    - Duty to diversify
```

### Regulatory Compliance

```yaml
compliance:
  sec_investment_advisers:
    form_adv:
      - Part 1: Regulatory information
      - Part 2A: Firm brochure
      - Part 2B: Brochure supplement
      - Part 3: Form CRS

    custody_rule:
      - Qualified custodian
      - Annual surprise examination
      - Account statements
      - Internal control report

    advertising:
      - Performance advertising rules
      - Testimonial/endorsement rules
      - Third-party ratings

  fiduciary_duty:
    - Best interest standard
    - Duty of care
    - Duty of loyalty
    - Conflict disclosure
    - Fee transparency

  state_registration:
    - De minimis exemptions
    - Notice filing requirements
    - State-specific rules
```

### Client Relationship Management

```yaml
client_management:
  review_meetings:
    frequency:
      - Quarterly: performance review
      - Annual: comprehensive review
      - As needed: life events

    agenda:
      - Performance review
      - Market outlook
      - Portfolio recommendations
      - Financial planning updates
      - Life changes

  service_standards:
    - Response time commitments
    - Report delivery timelines
    - Meeting preparation
    - Follow-up actions
    - Documentation

  satisfaction:
    - Client surveys
    - Referral tracking
    - Retention metrics
    - Complaint handling
```

### Operations Metrics

```yaml
metrics:
  portfolio:
    - Assets under management
    - Net flows
    - Performance vs benchmark
    - Client retention rate

  operations:
    - Trade error rate
    - Report delivery timeliness
    - Account opening time
    - Query resolution time

  compliance:
    - Regulatory findings
    - Disclosure completeness
    - Suitability documentation
    - Trade allocation fairness
```

## Output Format

### Portfolio Review Report
```markdown
# Quarterly Portfolio Review

## Client: [Name]
## Period: [Quarter/Year]

## Portfolio Summary
| Metric | Value |
|--------|-------|
| Portfolio Value | [$] |
| Quarter Return | [%] |
| YTD Return | [%] |
| Benchmark Return | [%] |

## Asset Allocation
| Asset Class | Target | Actual | Difference |
|-------------|--------|--------|------------|
| Equities | [%] | [%] | [%] |
| Fixed Income | [%] | [%] | [%] |
| Alternatives | [%] | [%] | [%] |
| Cash | [%] | [%] | [%] |

## Performance Attribution
| Factor | Contribution |
|--------|--------------|
| Asset Allocation | [%] |
| Security Selection | [%] |
| Total Active Return | [%] |

## Holdings Summary
### Top Holdings
| Security | Weight | Return |
|----------|--------|--------|
| [Security] | [%] | [%] |

## Transactions Summary
- Buys: [$]
- Sells: [$]
- Dividends: [$]
- Fees: [$]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Next Steps
[Action items for next quarter]
```

## Integration Points

- Portfolio management systems
- Trading platforms (OMS/EMS)
- Custodian systems
- Performance measurement (Orion, Black Diamond)
- CRM systems (Salesforce, Redtail)
- Financial planning software
- Document management
- Compliance systems

## Best Practices

1. **Client Focus**: Align with client objectives
2. **Fiduciary Standard**: Act in client's best interest
3. **Documentation**: Thorough record-keeping
4. **Transparency**: Clear fee and conflict disclosure
5. **Diversification**: Prudent portfolio construction
6. **Rebalancing**: Disciplined execution
7. **Tax Efficiency**: Consider after-tax returns
8. **Communication**: Regular client engagement

## Common Pitfalls

- Inadequate suitability documentation
- Inconsistent rebalancing
- Poor tax lot tracking
- Incomplete performance reporting
- Conflict of interest issues
- Inadequate compliance monitoring
- Poor client communication
- Stale IPS documents

## Version History

- 1.0.0: Initial wealth management skill
- 1.0.1: Added trust administration section
- 1.0.2: Enhanced performance attribution
