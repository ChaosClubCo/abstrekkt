---
name: regulatory-reporting
description: Comprehensive guidance for regulatory reporting in financial services including SEC filings, bank regulatory reports, capital adequacy reporting, stress testing, and disclosure requirements. Use when building, debugging, or optimizing technical implementations.
---

# Regulatory Reporting Skill

> Financial regulatory reporting, disclosures, and compliance filings

## Description

This skill provides comprehensive guidance for regulatory reporting in financial services including SEC filings, bank regulatory reports, capital adequacy reporting, stress testing, and disclosure requirements. It covers reporting for banks, broker-dealers, investment advisers, insurance companies, and other regulated financial institutions.

## Activation Triggers

- User mentions "regulatory reporting", "SEC filings", "call reports"
- User asks about capital adequacy or Basel requirements
- User needs help with Form 10-K, 10-Q, or 8-K
- User discusses CCAR/DFAST or stress testing
- User asks about bank examination reports
- User mentions regulatory disclosure requirements
- User needs reporting automation or controls

## Instructions

### Core Workflow

1. **Reporting Requirements**
   - Identify applicable regulations
   - Determine reporting obligations
   - Map data requirements
   - Establish reporting calendar
   - Assign responsibilities

2. **Data Collection and Preparation**
   - Source data from systems
   - Validate and reconcile
   - Apply accounting treatments
   - Prepare schedules
   - Document assumptions

3. **Filing and Disclosure**
   - Prepare filings
   - Review and approve
   - Submit to regulators
   - Retain documentation
   - Respond to inquiries

### Regulatory Reporting Framework

```yaml
reporting_framework:
  banking_regulators:
    federal_reserve:
      - FR Y-9C (Bank Holding Company)
      - FR Y-14 (Capital Assessments)
      - FR 2052a (Liquidity Monitoring)
      - FR 2886b (Country Exposure)

    occ:
      - Call Report (FFIEC 031/041/051)
      - Trust Activities Report
      - Shared National Credit

    fdic:
      - Summary of Deposits
      - Insurance assessment reporting

  sec_filings:
    periodic:
      - Form 10-K (Annual)
      - Form 10-Q (Quarterly)
      - Form 8-K (Current)
      - Proxy Statement (DEF 14A)

    investment_company:
      - Form N-CEN (Annual)
      - Form N-PORT (Monthly)
      - Form N-MFP (Money Market)

    broker_dealer:
      - FOCUS Report
      - SSOI
      - Customer Protection Rule

  cftc_reporting:
    - Large Trader Reports
    - Swap Data Repository
    - Financial Statements

  state_insurance:
    - Annual Statement
    - Quarterly Statement
    - ORSA
    - Risk-Based Capital
```

### Call Report (FFIEC)

```yaml
call_report:
  overview:
    forms:
      ffiec_031: "Banks with foreign offices"
      ffiec_041: "Domestic banks with assets > $100M"
      ffiec_051: "Smaller banks (simplified)"

    frequency: "Quarterly"
    deadline: "30 days after quarter-end"

  schedules:
    balance_sheet:
      - RC: Balance Sheet
      - RC-A: Cash and Balances
      - RC-B: Securities
      - RC-C: Loans and Leases
      - RC-D: Trading Assets/Liabilities
      - RC-E: Deposit Liabilities

    income_statement:
      - RI: Income Statement
      - RI-A: Changes in Equity
      - RI-B: Charge-offs and Recoveries
      - RI-C: Disaggregated Data
      - RI-E: Explanations

    off_balance_sheet:
      - RC-L: Derivatives and Off-Balance Sheet
      - RC-R: Regulatory Capital

    supplemental:
      - RC-O: Other Data
      - RC-P: 1-4 Family Mortgage Banking
      - RC-S: Servicing, Securitization
      - RC-T: Fiduciary Activities
```

### SEC Periodic Reporting

```yaml
sec_reporting:
  form_10k:
    parts:
      part_i:
        - Business description
        - Risk factors
        - Properties
        - Legal proceedings
        - Mine safety

      part_ii:
        - Market for stock
        - Financial data (5 years)
        - MD&A
        - Quantitative disclosures
        - Financial statements
        - Auditor changes

      part_iii:
        - Directors and officers
        - Executive compensation
        - Security ownership
        - Related transactions
        - Principal accountant fees

      part_iv:
        - Exhibits and schedules

    deadlines:
      large_accelerated: "60 days"
      accelerated: "75 days"
      non_accelerated: "90 days"

  form_10q:
    contents:
      - Condensed financials
      - MD&A (quarterly update)
      - Quantitative disclosures
      - Controls and procedures
      - Legal proceedings
      - Risk factors (if changed)

    deadlines:
      large_accelerated: "40 days"
      accelerated: "40 days"
      non_accelerated: "45 days"

  form_8k:
    reportable_events:
      - Material agreements
      - Bankruptcy
      - Asset acquisition/disposition
      - Director/officer changes
      - Material impairments
      - Delisting
      - Amendments to articles
      - Financial restatements

    deadline: "4 business days"
```

### Capital Adequacy Reporting

```yaml
capital_reporting:
  basel_framework:
    capital_ratios:
      cet1_ratio:
        numerator: "Common Equity Tier 1 Capital"
        denominator: "Risk-Weighted Assets"
        minimum: "4.5%"

      tier1_ratio:
        numerator: "Tier 1 Capital"
        denominator: "Risk-Weighted Assets"
        minimum: "6.0%"

      total_capital_ratio:
        numerator: "Total Capital"
        denominator: "Risk-Weighted Assets"
        minimum: "8.0%"

    buffers:
      - Capital conservation buffer (2.5%)
      - Countercyclical buffer (0-2.5%)
      - G-SIB surcharge (varies)

  risk_weighted_assets:
    credit_risk:
      - Standardized approach
      - Advanced approaches (IRB)
      - Counterparty credit risk

    market_risk:
      - Standardized approach
      - Internal models approach
      - CVA risk

    operational_risk:
      - Basic indicator approach
      - Standardized approach
      - Advanced measurement approach

  leverage_ratio:
    supplementary: "Tier 1 / Total Leverage Exposure"
    minimum: "3% (5% for G-SIBs)"
```

### Stress Testing

```yaml
stress_testing:
  ccar_dfast:
    overview:
      - Comprehensive Capital Analysis and Review
      - Dodd-Frank Act Stress Testing
      - Large bank requirements

    scenarios:
      - Baseline
      - Adverse
      - Severely adverse

    components:
      - Revenue projections
      - Credit loss projections
      - Capital projections
      - RWA projections

    submissions:
      - FR Y-14A (Annual)
      - FR Y-14Q (Quarterly)
      - FR Y-14M (Monthly)

  outputs:
    - Capital ratios under stress
    - PPNR projections
    - Loss projections by portfolio
    - Capital actions

  disclosure:
    - Company-run stress test results
    - Mid-cycle stress test
    - Public disclosure requirements
```

### Liquidity Reporting

```yaml
liquidity:
  lcr:
    formula: "HQLA / Net Cash Outflows (30 days)"
    minimum: "100%"
    reporting: "FR 2052a"

  nsfr:
    formula: "Available Stable Funding / Required Stable Funding"
    minimum: "100%"

  internal_monitoring:
    - Liquidity coverage ratio
    - Net stable funding ratio
    - Cash flow projections
    - Liquidity stress testing
    - Early warning indicators

  reporting_requirements:
    - Daily internal monitoring
    - Monthly regulatory reporting
    - Quarterly disclosures
    - Annual ILAP assessment
```

### Investment Adviser Reporting

```yaml
investment_adviser:
  form_adv:
    part_1a:
      - Identifying information
      - Regulatory history
      - Disciplinary information
      - AUM
      - Advisory activities
      - Other business activities
      - Custody
      - Control persons

    part_2a:
      - Firm brochure
      - Services and fees
      - Methods of analysis
      - Disciplinary information
      - Code of ethics
      - Brokerage practices

    filing: "Annual update within 90 days of fiscal year-end"

  form_pf:
    - Private fund reporting
    - Quarterly (large hedge funds)
    - Annual (other private funds)
    - Systemic risk data

  form_13f:
    - Quarterly holdings report
    - Institutional investment managers
    - $100M+ equity AUM threshold
    - 45 days after quarter-end
```

### Reporting Controls

```yaml
controls:
  sox_compliance:
    - Control environment
    - Risk assessment
    - Control activities
    - Information and communication
    - Monitoring activities

  data_governance:
    - Data lineage
    - Data quality
    - Reconciliation
    - Sign-off procedures
    - Audit trail

  review_process:
    - Preparer review
    - Analytical review
    - Management review
    - Committee approval
    - Board reporting

  documentation:
    - Policies and procedures
    - Working papers
    - Reconciliations
    - Variance analysis
    - Approval evidence
```

### Reporting Calendar

```yaml
calendar:
  quarterly:
    - Call Report (30 days)
    - Form 10-Q (40/45 days)
    - FR Y-9C (45 days)
    - Form 13F (45 days)
    - FR 2052a (monthly)

  annual:
    - Form 10-K (60/75/90 days)
    - Annual Statement (March 1)
    - ORSA (varies)
    - Form ADV (90 days)
    - CCAR submission (April)

  event_driven:
    - Form 8-K (4 business days)
    - SAR (30 days from detection)
    - CTR (15 days)
    - Material event notices
```

## Output Format

### Regulatory Filing Checklist
```markdown
# Regulatory Filing Checklist: [Filing Type]

## Filing Information
- Filing Type: [Form/Report]
- Period: [As of date]
- Due Date: [Date]
- Regulator: [Agency]

## Preparation Status
| Section | Preparer | Status | Review | Approval |
|---------|----------|--------|--------|----------|
| [Section] | [Name] | [Status] | [Y/N] | [Y/N] |

## Data Sources
| Data Element | Source System | Reconciled | Notes |
|--------------|---------------|------------|-------|
| [Element] | [System] | [Y/N] | [Notes] |

## Key Metrics
| Metric | Current | Prior | Change |
|--------|---------|-------|--------|
| [Metric] | [Value] | [Value] | [%] |

## Variance Analysis
[Significant variances and explanations]

## Open Items
| Issue | Owner | Due | Status |
|-------|-------|-----|--------|
| [Issue] | [Name] | [Date] | [Status] |

## Approval Sign-Off
- [ ] Preparer: [Name] [Date]
- [ ] Reviewer: [Name] [Date]
- [ ] CFO/Controller: [Name] [Date]
- [ ] Audit Committee: [If required]
```

## Integration Points

- General ledger/ERP systems
- Regulatory reporting platforms (AxiomSL, Wolters Kluwer)
- Data warehouses
- SEC filing systems (EDGAR)
- Call report software
- Board reporting tools
- Document management

## Best Practices

1. **Automation**: Automate data extraction and validation
2. **Reconciliation**: Robust data reconciliation processes
3. **Documentation**: Thorough working papers
4. **Review Layers**: Multi-level review process
5. **Calendar Management**: Track all filing deadlines
6. **Regulatory Monitoring**: Stay current on requirements
7. **Controls**: Strong SOX and data governance
8. **Training**: Keep staff current on regulations

## Common Pitfalls

- Missed filing deadlines
- Data quality issues
- Inadequate reconciliation
- Late identification of issues
- Insufficient documentation
- Lack of variance analysis
- Poor change management
- Siloed data sources

## Version History

- 1.0.0: Initial regulatory reporting skill
- 1.0.1: Added stress testing section
- 1.0.2: Enhanced capital reporting
