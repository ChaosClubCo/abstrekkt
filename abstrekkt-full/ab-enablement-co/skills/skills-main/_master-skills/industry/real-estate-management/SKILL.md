---
name: real-estate-management
description: Manage commercial and residential property portfolios including leasing operations, maintenance planning, tenant relations, financial reporting, and portfolio optimization. Analyze property performance, structure lease agreements, and implement asset management strategies. Use when navigating industry-specific regulations, processes, or operations.
---

# Real Estate Management Skill

> Property operations, leasing strategy, tenant relations, and portfolio optimization for commercial and residential assets

## Description

This skill provides comprehensive guidance for real estate property management spanning commercial, residential, and mixed-use portfolios. It covers leasing operations, maintenance and capital planning, tenant relations, financial performance analysis, regulatory compliance, and strategic portfolio optimization. The skill supports property managers, asset managers, leasing professionals, facilities directors, and real estate investment managers in maximizing property value, optimizing occupancy, controlling operating costs, and delivering superior tenant experiences across diverse property types and market conditions.

## Activation Triggers

- User mentions "property management", "real estate operations", or "asset management"
- User asks about lease administration, rent rolls, or tenant management
- User discusses maintenance planning, capital expenditures, or building operations
- User needs help with property financial analysis, NOI, or cap rate calculations
- User asks about tenant acquisition, retention, or lease negotiations
- User mentions portfolio performance, property valuations, or investment returns
- User discusses building compliance, inspections, or regulatory requirements
- User asks about CAM reconciliation, operating expense recovery, or budgeting
- User mentions property technology, smart buildings, or facilities management systems
- User discusses vacancy analysis, market rent studies, or competitive positioning

## Instructions

### Core Workflow

1. **Property Assessment and Onboarding**
   - Conduct physical property inspection documenting condition, deferred maintenance, and code compliance
   - Review all existing leases, amendments, and tenant correspondence for obligation mapping
   - Assess current vendor contracts, service levels, and competitive pricing
   - Evaluate building systems including HVAC, electrical, plumbing, elevator, and life safety
   - Establish baseline financial performance using trailing 12-month operating statements

2. **Leasing Strategy and Execution**
   - Conduct market rent analysis using comparable properties, broker surveys, and CoStar/RCA data
   - Define leasing parameters including target rents, concession limits, and tenant improvement allowances
   - Market available spaces through broker networks, online platforms, and direct outreach
   - Negotiate lease terms balancing occupancy targets with rental rate objectives
   - Execute lease documentation ensuring all business terms and legal protections are captured

3. **Operations and Maintenance Management**
   - Implement preventive maintenance programs for all critical building systems
   - Establish work order management workflows with priority classification and SLA tracking
   - Manage vendor relationships with performance scorecards and competitive bidding cycles
   - Plan and execute capital improvement projects with budget, timeline, and disruption management
   - Monitor energy consumption and implement sustainability initiatives for cost reduction

4. **Financial Management and Reporting**
   - Prepare annual operating budgets with line-item detail and variance explanations
   - Calculate and reconcile CAM, insurance, and tax recoveries per lease terms
   - Generate monthly financial reports including income statements, rent rolls, and aging reports
   - Track key performance indicators against budget, prior year, and portfolio benchmarks
   - Manage accounts receivable with defined escalation procedures for delinquent tenants

5. **Portfolio Optimization and Strategy**
   - Analyze property performance relative to portfolio targets and market benchmarks
   - Identify value-add opportunities through renovation, repositioning, or lease restructuring
   - Model hold vs. sell decisions using discounted cash flow and IRR analysis
   - Evaluate capital allocation across properties based on risk-adjusted returns
   - Develop long-term capital plans aligned with investment thesis and market cycle positioning

### Lease Administration Framework

```yaml
lease_administration:
  lease_types:
    gross_lease:
      description: "Landlord pays all operating expenses"
      risk_allocation: "Landlord bears expense variability"
      common_use: "Residential, smaller office suites"
      rent_structure: "Higher base rent inclusive of expenses"

    modified_gross:
      description: "Tenant pays base year excess for specified expenses"
      risk_allocation: "Shared - tenant bears increases above base year"
      common_use: "Multi-tenant office buildings"
      components: "Base rent + excess taxes + excess insurance + excess CAM"

    triple_net:
      description: "Tenant pays proportionate share of all operating expenses"
      risk_allocation: "Tenant bears majority of expense variability"
      common_use: "Industrial, retail, single-tenant buildings"
      components: "Base rent + pro-rata taxes + insurance + CAM"

    percentage_lease:
      description: "Base rent plus percentage of gross sales above breakpoint"
      risk_allocation: "Landlord participates in tenant success"
      common_use: "Retail shopping centers and malls"
      components: "Base rent + percentage rent above natural breakpoint"

  critical_dates:
    tracking_requirements:
      - Lease commencement and expiration dates
      - Rent escalation dates (annual, CPI, or fixed increases)
      - Option exercise deadlines (renewal, expansion, termination, purchase)
      - Tenant improvement allowance disbursement milestones
      - Insurance certificate renewal dates
      - CAM reconciliation due dates
      - Security deposit return deadlines
      - Estoppel and SNDA delivery requirements

  cam_reconciliation:
    process:
      - Compile actual operating expenses for calendar or lease year
      - Identify excluded costs per lease terms (capital items, management fees, specific exclusions)
      - Calculate each tenant's proportionate share based on leased square footage
      - Compare actual pro-rata share to estimated payments collected during year
      - Prepare reconciliation statement showing under or over-collection
      - Distribute statements within lease-required timeframe (typically 90-120 days after year-end)
      - Bill or credit tenant for difference per lease provisions

    common_exclusions:
      - Capital expenditures (unless amortized per lease terms)
      - Leasing commissions and tenant improvement costs
      - Costs reimbursed by insurance
      - Expenses for vacant space in some lease structures
      - Management fees above cap (if applicable)
      - Landlord's income taxes
      - Costs attributable to landlord's negligence

  rent_escalation_methods:
    fixed_increase: "Predetermined dollar or percentage increase annually"
    cpi_adjustment: "Tied to Consumer Price Index with floor and ceiling"
    fair_market_value: "Reset to market at defined intervals (typically at option)"
    percentage_of_sales: "Variable component based on tenant revenue performance"
```

### Property Financial Analysis Framework

```yaml
financial_analysis:
  key_metrics:
    net_operating_income:
      formula: "Effective Gross Income - Operating Expenses"
      components:
        potential_gross_income: "Total rent at full occupancy"
        vacancy_and_credit_loss: "Deduct for actual/projected vacancy"
        other_income: "Parking, storage, laundry, antenna, signage"
        effective_gross_income: "PGI - Vacancy + Other Income"
        operating_expenses: "Taxes, insurance, utilities, maintenance, management"

    capitalization_rate:
      formula: "NOI / Property Value (or Purchase Price)"
      interpretation:
        lower_cap: "<5% - Core asset, prime location, low risk"
        mid_cap: "5-7% - Core-plus, good location, moderate risk"
        higher_cap: "7-10% - Value-add, repositioning opportunity"
        high_cap: ">10% - Opportunistic, significant risk or distress"

    cash_on_cash_return:
      formula: "Annual Pre-Tax Cash Flow / Total Cash Invested"
      target: "8-12% for stabilized commercial properties"

    debt_service_coverage:
      formula: "NOI / Annual Debt Service"
      minimum: "1.20x for conventional commercial lending"
      comfortable: "1.40x+ provides margin for income variability"

    internal_rate_of_return:
      formula: "Discount rate equating NPV of all cash flows to zero"
      typical_targets:
        core: "6-8% levered IRR"
        core_plus: "8-12% levered IRR"
        value_add: "12-18% levered IRR"
        opportunistic: "18%+ levered IRR"

  operating_budget:
    revenue_line_items:
      - Base rent (by tenant with escalation schedule)
      - Percentage rent (retail, based on sales projections)
      - Expense recoveries (CAM, tax, insurance pass-throughs)
      - Parking revenue
      - Other income (storage, signage, antenna, late fees)

    expense_categories:
      fixed_costs:
        - Real estate taxes
        - Property insurance
        - Debt service (if included in property-level reporting)
      variable_costs:
        - Utilities (electric, gas, water, sewer)
        - Repairs and maintenance
        - Janitorial and cleaning
        - Landscaping and snow removal
        - Security services
      management:
        - Property management fee (typically 3-6% of EGI)
        - On-site personnel costs
        - Administrative and office expenses
      reserves:
        - Capital replacement reserves (typically $0.15-0.50/SF/year)
        - Tenant improvement reserves
        - Leasing commission reserves
```

### Templates

#### Monthly Property Performance Report
```markdown
# Monthly Property Report: [Property Name] - [Month/Year]

## Financial Summary
| Line Item | Month Actual | Month Budget | Variance | YTD Actual | YTD Budget | Variance |
|-----------|-------------|-------------|----------|-----------|-----------|----------|
| Gross Revenue | [$] | [$] | [$] | [$] | [$] | [$] |
| Vacancy Loss | [$] | [$] | [$] | [$] | [$] | [$] |
| Other Income | [$] | [$] | [$] | [$] | [$] | [$] |
| Effective Gross Income | [$] | [$] | [$] | [$] | [$] | [$] |
| Operating Expenses | [$] | [$] | [$] | [$] | [$] | [$] |
| Net Operating Income | [$] | [$] | [$] | [$] | [$] | [$] |

## Occupancy and Leasing
| Metric | Current | Prior Month | Budget | Prior Year |
|--------|---------|-------------|--------|------------|
| Physical Occupancy | [%] | [%] | [%] | [%] |
| Economic Occupancy | [%] | [%] | [%] | [%] |
| Avg Rent PSF | [$] | [$] | [$] | [$] |
| Lease Expirations (12mo) | [SF] | [SF] | - | - |
| Leasing Pipeline | [SF] | [SF] | - | - |

## Accounts Receivable Aging
| Aging Bucket | Amount | Tenants | Action |
|-------------|--------|---------|--------|
| Current | [$] | [Count] | - |
| 30 Days | [$] | [Count] | [Notice sent] |
| 60 Days | [$] | [Count] | [Demand letter] |
| 90+ Days | [$] | [Count] | [Legal referral] |

## Maintenance Summary
- Work Orders Opened: [Count]
- Work Orders Completed: [Count]
- Avg Resolution Time: [Days]
- Capital Projects in Progress: [List]
```

#### Lease Comparison Matrix
```markdown
# Lease Comparison: [Space/Suite] - [Property Name]

## Proposal Summary
| Term | Prospect A | Prospect B | Ownership Target |
|------|-----------|-----------|-----------------|
| Tenant Name | [Name] | [Name] | - |
| Creditworthiness | [Rating] | [Rating] | [Minimum] |
| Space (SF) | [SF] | [SF] | [Available SF] |
| Term (Years) | [Years] | [Years] | [Minimum] |
| Base Rent (PSF) | [$] | [$] | [$Target] |
| Annual Escalation | [%] | [%] | [%Minimum] |
| TI Allowance (PSF) | [$] | [$] | [$Maximum] |
| Free Rent (Months) | [Count] | [Count] | [Maximum] |
| Lease Type | [NNN/MG/Gross] | [NNN/MG/Gross] | [Preferred] |
| Effective Rent (PSF) | [$] | [$] | [$Target] |
| Total NPV | [$] | [$] | - |

## Recommendation
[Analysis and recommended prospect with rationale]
```

### Best Practices

1. **Proactive Lease Renewal Engagement**: Begin renewal discussions 12-18 months before expiration for commercial tenants to avoid costly vacancy and re-leasing
2. **Preventive Over Reactive Maintenance**: Invest in scheduled preventive maintenance programs; every $1 in PM prevents $4-8 in emergency repairs
3. **Market Rent Monitoring**: Update comparable rent analysis quarterly to ensure pricing remains competitive and identify opportunities for rate increases
4. **Tenant Retention Priority**: Retaining a good tenant at slightly below-market rent is almost always more profitable than vacancy, TI, and leasing costs for replacement
5. **Insurance Certificate Tracking**: Maintain current certificates of insurance for all tenants and vendors; lapsed coverage creates significant liability exposure
6. **Capital Planning Horizon**: Maintain a rolling 5-year capital expenditure plan tied to building condition assessments and useful life projections
7. **Vendor Competitive Bidding**: Rebid all service contracts every 2-3 years and after any significant scope change to ensure market-rate pricing
8. **Thorough Move-In/Move-Out Documentation**: Photograph and document unit condition at every turnover to support security deposit dispositions and damage claims
9. **Energy Management Focus**: Implement building automation systems and monitor utility consumption monthly; energy is typically the largest controllable expense
10. **Timely CAM Reconciliation**: Complete annual reconciliations within lease-required timeframes; late reconciliations may waive recovery rights under some lease provisions
11. **Rent Collection Consistency**: Enforce late fee and default provisions consistently to maintain payment discipline across the tenant base
12. **Emergency Preparedness**: Maintain current emergency response plans, vendor contact lists, and tenant communication protocols for weather, fire, and utility events
13. **Accurate Square Footage**: Verify rentable and usable square footage measurements using BOMA standards to ensure accurate rent calculations and expense allocations

### Common Patterns

#### Pattern 1: Value-Add Renovation Analysis
```
Scenario: A 1990s-vintage suburban office building at 72% occupancy with
below-market rents. Evaluating common area renovation to reposition.

Process:
1. Commission building condition assessment: $1.2M deferred maintenance identified
2. Obtain market rent study: current avg $22/SF vs. market $28/SF for renovated comps
3. Develop renovation scope: lobby, corridors, restrooms, conference center ($2.8M budget)
4. Model rent premium: renovated space can achieve $26-28/SF (15-27% increase)
5. Estimate lease-up timeline: 18 months to reach stabilized 90% occupancy
6. Calculate incremental NOI at stabilization: $485K annually from rent uplift
7. Apply 7.0% cap rate to incremental NOI: $6.9M value creation
8. Compare to total investment of $4.0M (renovation + deferred maintenance)
9. Project levered IRR of 16.2% over 5-year hold including disposition
10. Recommend proceeding with phased renovation starting with lobby and vacant floors
```

#### Pattern 2: Tenant Default and Recovery
```
Scenario: A retail tenant with 3 years remaining on lease has not paid
rent for 60 days and is requesting rent relief.

Process:
1. Review lease default provisions: 10-day notice, 30-day cure period
2. Assess tenant's financial condition: request current financial statements
3. Evaluate space's re-leasing prospects: market demand, likely downtime, TI cost
4. Model scenarios: (A) rent deferral, (B) lease restructure, (C) termination and re-lease
5. Scenario A: 3-month deferral repaid over 12 months preserves $180K in occupancy value
6. Scenario B: reduced rent with shorter term and recapture rights nets $95K NPV
7. Scenario C: termination, 9-month vacancy, and re-leasing at market nets $62K NPV
8. Negotiate deferral agreement with personal guaranty enhancement and monthly reporting
9. Execute lease amendment with cross-default provisions and financial covenants
10. Monitor tenant performance monthly; prepare re-leasing strategy as contingency
```

### Output Formats

#### Property Valuation Summary
```markdown
# Property Valuation: [Property Name] - [Valuation Date]

## Income Approach
| Component | Amount | Notes |
|-----------|--------|-------|
| Potential Gross Income | [$] | [Based on rent roll + market rent for vacant] |
| Vacancy & Credit Loss | [$] | [% applied] |
| Other Income | [$] | [Sources] |
| Effective Gross Income | [$] | |
| Operating Expenses | [$] | [% of EGI] |
| Net Operating Income | [$] | |
| Capitalization Rate | [%] | [Comparable sales support] |
| **Indicated Value** | **[$]** | |

## Comparable Sales
| Property | Sale Date | Price | SF | Price/SF | Cap Rate |
|----------|-----------|-------|-----|---------|----------|
| [Comp 1] | [Date] | [$] | [SF] | [$] | [%] |
| [Comp 2] | [Date] | [$] | [SF] | [$] | [%] |
```

#### Lease Expiration Schedule
```markdown
# Lease Expiration Schedule: [Property Name]

| Year | Tenant | Suite | SF | % of Total | Annual Rent | Rent PSF | Lease Type |
|------|--------|-------|-----|-----------|-------------|---------|------------|
| [Year] | [Name] | [Suite] | [SF] | [%] | [$] | [$] | [Type] |

## Rollover Risk Summary
| Year | Expiring SF | % of NRA | Expiring Revenue | Retention Probability |
|------|------------|---------|-----------------|---------------------|
| [Year] | [SF] | [%] | [$] | [H/M/L] |
```

## Integration Points

- Property management software (Yardi, MRI Software, AppFolio, RealPage)
- Accounting systems (Yardi GL, MRI Financials, QuickBooks)
- Lease abstraction and administration (Visual Lease, LeaseAccelerator, ProLease)
- Building automation systems (Honeywell, Johnson Controls, Siemens)
- Work order management (Building Engines, Angus Anywhere, Corrigo)
- Market data providers (CoStar, Real Capital Analytics, REIS)
- Tenant communication platforms (Building Engines, HqO, Equiem)
- Energy management systems (EnergyCAP, Lucid, GridPoint)

## Version History

- 1.0.0: Initial real estate management skill with leasing, operations, and portfolio optimization
