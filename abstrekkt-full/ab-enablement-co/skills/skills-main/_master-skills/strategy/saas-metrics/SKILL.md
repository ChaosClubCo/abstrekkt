---
name: saas-metrics
description: Master SaaS business metrics including MRR, ARR, churn analysis, expansion revenue, and LTV:CAC optimization for subscription-based businesses. Use when planning, analyzing, or developing business strategies.
---

# SaaS Metrics
  - analytics
related_skills:
  - customer-success-saas
  - saas-pricing
  - product-led-growth
triggers:
  - calculate mrr
  - analyze churn
  - ltv cac ratio
  - arr growth
  - expansion revenue
  - net revenue retention
  - saas metrics dashboard
  - cohort analysis
---

## Overview

SaaS Metrics mastery is essential for understanding the health and growth trajectory of subscription-based businesses. This skill encompasses the key performance indicators that drive SaaS valuation, investor confidence, and operational decision-making.

### Key Metric Categories

1. **Revenue Metrics** - MRR, ARR, expansion, contraction
2. **Customer Metrics** - Churn, retention, lifetime value
3. **Acquisition Metrics** - CAC, payback period, efficiency
4. **Unit Economics** - LTV:CAC, margins, efficiency ratios
5. **Growth Metrics** - Net revenue retention, quick ratio

### Why These Metrics Matter

- **Investor Communication** - Standard language for fundraising
- **Operational Decisions** - Data-driven resource allocation
- **Valuation Impact** - Direct correlation to company value
- **Early Warning System** - Identify problems before crisis

## When to Use This Skill

### Primary Use Cases

1. **Monthly Reporting** - Executive and board dashboards
2. **Investor Updates** - Fundraising and quarterly reports
3. **Strategic Planning** - Annual planning and forecasting
4. **Churn Analysis** - Understanding and reducing attrition
5. **Pricing Decisions** - Impact modeling of pricing changes

### Trigger Scenarios

- Building SaaS financial models
- Preparing investor pitch decks
- Analyzing customer cohorts
- Benchmarking against industry standards
- Diagnosing revenue leakage

## Core Processes

### 1. MRR Calculation Framework

```
MRR Components:
├── New MRR
│   ├── New customer revenue
│   └── First month of subscription
├── Expansion MRR
│   ├── Upgrades
│   ├── Add-ons
│   └── Seat additions
├── Contraction MRR
│   ├── Downgrades
│   ├── Reduced usage
│   └── Seat removals
├── Churned MRR
│   ├── Cancellations
│   └── Non-renewals
└── Net New MRR
    └── New + Expansion - Contraction - Churned
```

**MRR Calculation Rules**:
- Normalize annual contracts to monthly (divide by 12)
- Exclude one-time fees (setup, implementation)
- Include only recurring revenue components
- Apply discounts to recognize net amounts
- Handle mid-month changes appropriately

### 2. Churn Analysis Framework

**Types of Churn**:

| Churn Type | Calculation | Target Range |
|------------|-------------|--------------|
| Logo Churn | Lost Customers / Starting Customers | < 5% annually |
| Gross Revenue Churn | Lost MRR / Starting MRR | < 1% monthly |
| Net Revenue Churn | (Lost - Expansion) / Starting MRR | Negative |
| Customer Churn | Cancelled / Total Active | < 2% monthly |

**Churn Cohort Analysis**:
```
Cohort Analysis Steps:
1. Group customers by signup month
2. Track retention at each interval (M1, M3, M6, M12)
3. Calculate survival rates per cohort
4. Identify patterns and anomalies
5. Correlate with product/market changes
```

### 3. LTV:CAC Optimization

**LTV Calculation Methods**:

```
Simple LTV:
LTV = ARPU / Monthly Churn Rate

Gross Margin LTV:
LTV = (ARPU × Gross Margin) / Monthly Churn Rate

Cohort-Based LTV:
LTV = Sum of (Revenue per Period × Survival Rate)
```

**CAC Components**:
- Marketing spend (paid + organic allocation)
- Sales team costs (salary, commission, tools)
- Onboarding costs (if pre-revenue)
- Attribution methodology (first touch, multi-touch)

**Healthy Ratios**:
| Ratio | Healthy Range | Excellent |
|-------|---------------|-----------|
| LTV:CAC | > 3:1 | > 5:1 |
| CAC Payback | < 12 months | < 6 months |
| Gross Margin | > 70% | > 80% |

### 4. Net Revenue Retention (NRR)

```
NRR Formula:
NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR

Example:
Starting MRR: $100,000
Expansion: $15,000
Contraction: $3,000
Churn: $5,000
NRR = ($100,000 + $15,000 - $3,000 - $5,000) / $100,000 = 107%
```

**NRR Benchmarks**:
- < 100%: Revenue decay (urgent attention needed)
- 100-110%: Good (typical for SMB)
- 110-120%: Great (typical for mid-market)
- > 120%: Excellent (enterprise-level)

### 5. SaaS Quick Ratio

```
Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)

Interpretation:
< 1: Shrinking business
1-2: Struggling growth
2-4: Healthy growth
> 4: Exceptional growth
```

## Tools and Technologies

### Analytics Platforms
- **ChartMogul** - Subscription analytics
- **Baremetrics** - MRR tracking
- **ProfitWell** - Free metrics + benchmarks
- **Stripe Sigma** - Payment data analysis

### BI and Visualization
- **Tableau** - Enterprise dashboards
- **Looker** - Data modeling
- **Metabase** - Open source BI
- **Mode Analytics** - SQL + visualization

### Data Infrastructure
- **Segment** - Customer data platform
- **dbt** - Data transformation
- **Snowflake** - Data warehouse
- **Fivetran** - Data integration

## Key Metrics Reference

### Revenue Metrics

| Metric | Formula | Frequency |
|--------|---------|-----------|
| MRR | Sum of monthly recurring revenue | Monthly |
| ARR | MRR × 12 | Monthly |
| ARPU | MRR / Active Customers | Monthly |
| ARPA | MRR / Active Accounts | Monthly |
| ACV | Average annual contract value | Quarterly |

### Growth Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| MoM Growth | (Current - Previous) / Previous | > 10% early stage |
| YoY Growth | (Current - Year Ago) / Year Ago | > 100% early stage |
| T2D3 | Triple, triple, double, double, double | Years 1-5 |
| Rule of 40 | Growth Rate + Profit Margin | > 40% |

### Efficiency Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| Magic Number | Net New ARR / Prior Quarter S&M Spend | > 0.75 |
| Burn Multiple | Net Burn / Net New ARR | < 2x |
| CAC Payback | CAC / (ARPU × Gross Margin) | < 12 months |

## Common Pitfalls

### Calculation Errors

1. **MRR Inflation**
   - Including one-time fees
   - Not normalizing annual contracts
   - Double-counting upgrades
   - Ignoring discounts

2. **Churn Miscalculation**
   - Wrong denominator timing
   - Ignoring reactivations
   - Mixing logo and revenue churn
   - Not segmenting by cohort

3. **CAC Attribution**
   - Missing hidden costs (tools, overhead)
   - Wrong attribution windows
   - Ignoring organic vs paid split
   - Not including sales costs

### Strategic Mistakes

1. **Vanity Metrics Focus**
   - Tracking signups over activation
   - Celebrating gross adds ignoring churn
   - Revenue without profitability context

2. **Benchmark Misapplication**
   - Comparing SMB to enterprise metrics
   - Ignoring industry context
   - Using outdated benchmarks

3. **Reporting Inconsistency**
   - Changing definitions mid-stream
   - Non-GAAP revenue inclusion
   - Inconsistent cohort definitions

## Integration Points

### Connected Systems

```
Data Flow:
Billing System (Stripe/Chargebee)
    ↓
Customer Data Platform (Segment)
    ↓
Data Warehouse (Snowflake)
    ↓
BI Tool (Looker/Tableau)
    ↓
Executive Dashboards
```

### Related Skills

- **customer-success-saas** - Health scores impact on churn
- **saas-pricing** - Pricing changes impact on metrics
- **product-led-growth** - Self-serve funnel metrics
- **saas-onboarding** - Activation impact on LTV

### Reporting Cadence

| Report | Audience | Frequency | Key Metrics |
|--------|----------|-----------|-------------|
| Flash Report | Exec Team | Weekly | MRR, Churn, Pipeline |
| Operating Review | Leadership | Monthly | Full metrics suite |
| Board Report | Board/Investors | Quarterly | ARR, NRR, Rule of 40 |
| Investor Update | Investors | Monthly/Quarterly | Growth, Runway, Milestones |

## Best Practices

### Data Quality

1. **Single Source of Truth** - Define authoritative data source
2. **Automated Collection** - Eliminate manual data entry
3. **Audit Trail** - Track all changes and adjustments
4. **Reconciliation** - Regular checks against billing system

### Metric Governance

1. **Definition Documentation** - Written definitions for all metrics
2. **Change Management** - Process for metric definition updates
3. **Stakeholder Alignment** - Finance, Sales, CS agreement
4. **External Validation** - Auditor-friendly calculations

### Actionable Insights

1. **Segmentation** - Break down by plan, cohort, segment
2. **Trends Over Snapshots** - Focus on directional movement
3. **Leading Indicators** - Track predictive metrics
4. **Drill-Down Capability** - Enable root cause analysis

## Summary

Mastering SaaS metrics requires consistent calculation methodology, appropriate benchmarking, and actionable interpretation. The key is building a metrics infrastructure that provides reliable data while enabling the drill-down analysis needed to drive business decisions. Focus on the metrics that matter most for your stage and segment, and ensure alignment across all stakeholders on definitions and targets.
