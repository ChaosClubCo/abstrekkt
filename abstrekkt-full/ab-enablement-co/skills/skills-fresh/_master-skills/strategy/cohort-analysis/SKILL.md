---
name: cohort-analysis
description: Retention analysis frameworks, customer lifetime value calculations, and cohort-based insights that drive customer strategy. Use when planning, analyzing, or developing business strategies.
---

# Cohort Analysis

> Retention analysis frameworks, customer lifetime value calculations, and cohort-based insights that drive customer strategy.

## Metadata

- **Skill ID**: cohort-analysis
- **Category**: Back of House - Business Intelligence
- **Complexity Level**: Advanced
- **Prerequisites**:
  - Data analysis proficiency
  - Statistical fundamentals
  - Customer metrics understanding
  - SQL/analytics tools experience

## Overview

Cohort Analysis encompasses the segmentation and tracking of customer groups over time to understand behavior patterns, retention dynamics, and lifetime value. This skill covers cohort definition, retention analysis, LTV calculations, and the strategic insights that inform customer acquisition and retention strategies.

## Core Capabilities

### 1. Cohort Definition and Creation

**Cohort Types**
```yaml
cohort_types:
  acquisition_cohorts:
    definition: "Customers grouped by when they were acquired"
    granularity:
      - "Monthly (most common)"
      - "Weekly (high volume)"
      - "Quarterly (B2B/enterprise)"
    use_cases:
      - "Retention trending"
      - "LTV analysis"
      - "Acquisition quality"

  behavioral_cohorts:
    definition: "Customers grouped by behavior or action"
    examples:
      - "First purchase category"
      - "Referral source"
      - "Initial plan tier"
      - "Feature adoption"
    use_cases:
      - "Segment comparison"
      - "Product-market fit"
      - "Behavior impact"

  attribute_cohorts:
    definition: "Customers grouped by characteristics"
    examples:
      - "Company size"
      - "Industry"
      - "Geography"
      - "Customer segment"
    use_cases:
      - "ICP validation"
      - "Market expansion"
      - "Pricing strategy"

  hybrid_cohorts:
    definition: "Combination of timing and attributes"
    examples:
      - "Q1 2024 Enterprise customers"
      - "January signups from paid ads"
    use_cases:
      - "Campaign analysis"
      - "Detailed segmentation"
```

**Cohort Creation Framework**
```markdown
## Cohort Definition Best Practices

### Cohort Size Considerations
| Use Case | Minimum Size | Ideal Size |
|----------|--------------|------------|
| Retention trends | 50+ | 200+ |
| LTV analysis | 100+ | 500+ |
| Segment comparison | 30+ per segment | 100+ |
| Statistical testing | 100+ per group | 500+ |

### Cohort Period Selection
| Business Type | Recommended Period | Rationale |
|---------------|-------------------|-----------|
| Consumer app | Weekly/Monthly | High volume, fast cycles |
| SaaS | Monthly | Standard billing cycles |
| Enterprise | Quarterly | Long sales cycles |
| E-commerce | Monthly/Seasonal | Purchase patterns |

### Cohort Definition Query Example
```sql
SELECT
    DATE_TRUNC('month', first_purchase_date) AS cohort_month,
    customer_id,
    first_purchase_date,
    acquisition_channel,
    initial_plan
FROM customers
WHERE first_purchase_date >= '2023-01-01'
```
```

### 2. Retention Analysis

**Retention Metrics Framework**
```yaml
retention_metrics:
  customer_retention:
    definition: "Percentage of customers active in a period"
    formula: "Active Customers in Period N / Starting Customers"
    variants:
      classic_retention:
        description: "Active in specific period"
        example: "40% retained in month 6"

      rolling_retention:
        description: "Active in period N or later"
        example: "65% active in month 6 or beyond"

      bracket_retention:
        description: "Active in period range"
        example: "50% active in months 4-6"

  revenue_retention:
    net_revenue_retention:
      definition: "Revenue from existing customers vs. starting"
      formula: "(Starting + Expansion - Contraction - Churn) / Starting"
      example: "115% NRR means growth from existing customers"

    gross_revenue_retention:
      definition: "Revenue retention excluding expansion"
      formula: "(Starting - Contraction - Churn) / Starting"
      example: "95% GRR means 5% revenue churn"

  logo_vs_revenue:
    logo_retention: "Customer count retention"
    revenue_retention: "Dollar retention"
    relationship: "Revenue often higher if larger customers retained better"
```

**Retention Table Construction**
```markdown
## Cohort Retention Table

### Standard Format
| Cohort | Month 0 | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|---------|---------|----------|
| Jan 24 | 100% | 75% | 65% | 58% | 45% | 35% |
| Feb 24 | 100% | 78% | 68% | 62% | 48% | - |
| Mar 24 | 100% | 80% | 70% | 63% | - | - |
| Apr 24 | 100% | 82% | 72% | - | - | - |

### Heat Map Color Coding
- Green (>70%): Strong retention
- Yellow (50-70%): Moderate retention
- Red (<50%): Weak retention

### Interpretation Guidelines
1. Read across: How does each cohort age?
2. Read down: Are newer cohorts improving?
3. Look for patterns: Seasonal effects? Product changes?
4. Compare to benchmarks: Industry standards?
```

**Retention Curve Analysis**
```yaml
retention_curves:
  curve_patterns:
    healthy_curve:
      description: "Steep initial drop, then flattens"
      interpretation: "Finding product-market fit"
      action: "Focus on long-term retention"

    linear_decline:
      description: "Steady, continuous decline"
      interpretation: "No natural retention point"
      action: "Improve core value proposition"

    cliff_pattern:
      description: "Sudden drop at specific point"
      interpretation: "Trigger event (trial end, price increase)"
      action: "Address specific moment"

    improving_curves:
      description: "Newer cohorts retain better"
      interpretation: "Product/experience improving"
      action: "Continue current trajectory"

  curve_analysis:
    methods:
      - "Plot all cohorts on same chart"
      - "Calculate confidence intervals"
      - "Identify inflection points"
      - "Compare to benchmarks"

    visualization:
      - "Line chart by cohort"
      - "Average retention curve"
      - "Survival analysis curves"
```

### 3. Customer Lifetime Value (LTV)

**LTV Calculation Methods**
```markdown
## LTV Calculation Approaches

### Simple Historical LTV
**Formula**: Average Revenue per Customer over lifetime
**Calculation**: Total Revenue from Cohort / Number of Customers
**Use Case**: Complete cohort data available

### Contractual LTV (Subscription)
**Formula**: ARPU × Average Lifespan
**Where**:
- ARPU = Average Revenue Per User per period
- Average Lifespan = 1 / Churn Rate
**Example**: $100/month × (1/5% monthly churn) = $100 × 20 = $2,000

### Predictive LTV
**Formula**: ∑(Probability of Active in Period t × Expected Revenue in t) / (1 + discount rate)^t
**Use Case**: Forward-looking, considers time value

### Contribution Margin LTV
**Formula**: (ARPU - Variable Costs) × Average Lifespan
**Use Case**: Profitability-focused view

### LTV Table by Cohort
| Cohort | Customers | Total Revenue | LTV | Payback |
|--------|-----------|---------------|-----|---------|
| Jan 24 | 1,000 | $500,000 | $500 | 8 months |
| Feb 24 | 1,200 | $720,000 | $600 | 7 months |
| Mar 24 | 1,100 | $770,000 | $700 | 6 months |
```

**LTV/CAC Analysis**
```yaml
ltv_cac_framework:
  ratio_interpretation:
    excellent: "> 3.0x - Strong unit economics"
    good: "2.5-3.0x - Healthy business"
    acceptable: "1.5-2.5x - Room for improvement"
    concerning: "< 1.5x - Unsustainable"

  payback_period:
    calculation: "CAC / (ARPU × Gross Margin)"
    benchmarks:
      consumer: "< 3 months"
      smb_saas: "< 12 months"
      enterprise: "< 18-24 months"

  by_segment:
    analysis: "Calculate LTV:CAC by segment"
    purpose: "Identify most profitable segments"
    action: "Optimize acquisition spend allocation"

  by_channel:
    analysis: "Calculate LTV:CAC by acquisition channel"
    purpose: "Identify most efficient channels"
    action: "Reallocate marketing budget"

  trend_analysis:
    track: "LTV:CAC over time"
    indicators:
      improving: "Better product-market fit"
      declining: "Market saturation or quality issues"
```

## Implementation Workflows

### Cohort Analysis Process

**Analysis Workflow**
```markdown
## Cohort Analysis Process

### Step 1: Define Analysis Objective
- What question are we answering?
- Which cohort definition is relevant?
- What time period to analyze?
- Who will use the results?

### Step 2: Prepare Data
- Extract customer data
- Define cohort assignment
- Calculate activity flags
- Validate data quality

**Sample Query**
```sql
WITH customer_cohorts AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', first_order_date) AS cohort_month,
        first_order_date
    FROM customers
),
monthly_activity AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', activity_date) AS activity_month
    FROM customer_activity
    GROUP BY 1, 2
)
SELECT
    cc.cohort_month,
    DATEDIFF('month', cc.cohort_month, ma.activity_month) AS period,
    COUNT(DISTINCT cc.customer_id) AS active_customers
FROM customer_cohorts cc
LEFT JOIN monthly_activity ma ON cc.customer_id = ma.customer_id
GROUP BY 1, 2
```

### Step 3: Build Cohort Table
- Create retention matrix
- Calculate percentages
- Add visualizations
- Include context

### Step 4: Analyze Patterns
- Identify trends
- Compare cohorts
- Find anomalies
- Test hypotheses

### Step 5: Generate Insights
- Summarize findings
- Connect to actions
- Present to stakeholders
- Track impact
```

### LTV Modeling

**LTV Model Development**
```yaml
ltv_modeling:
  data_requirements:
    customer_data:
      - "Customer ID"
      - "First purchase date"
      - "Customer attributes"

    transaction_data:
      - "Transaction date"
      - "Transaction amount"
      - "Product/service"

    activity_data:
      - "Login/usage events"
      - "Feature usage"
      - "Support interactions"

  model_approaches:
    historical:
      method: "Sum actual revenue"
      pros: "Accurate for mature cohorts"
      cons: "Cannot predict for new customers"

    probabilistic:
      method: "BG/NBD or similar"
      pros: "Predictions for any customer"
      cons: "Requires statistical expertise"

    regression:
      method: "Predict based on features"
      pros: "Incorporates customer attributes"
      cons: "May not capture behavior dynamics"

    hybrid:
      method: "Combine multiple approaches"
      pros: "Balanced predictions"
      cons: "More complex to implement"

  validation:
    holdout_testing:
      - "Train on old cohorts"
      - "Predict on newer cohorts"
      - "Compare to actuals"

    metrics:
      - "MAPE on LTV predictions"
      - "Correlation with actuals"
      - "Calibration quality"
```

## Advanced Techniques

### Survival Analysis

**Survival Analysis Framework**
```markdown
## Survival Analysis for Retention

### Concept
- Model time until event (churn)
- Handle incomplete data (right-censoring)
- Compare groups statistically

### Key Methods

**Kaplan-Meier Estimator**
- Non-parametric survival curve
- Visualization of retention over time
- Comparison between groups

**Cox Proportional Hazards**
- Identify factors affecting retention
- Hazard ratios for interpretation
- Control for multiple variables

### Application Example
```
Question: Does onboarding completion affect retention?

Analysis:
- Group A: Completed onboarding
- Group B: Did not complete

Findings:
- Survival at 12 months: 65% vs 35%
- Hazard ratio: 0.52 (completed = 48% lower churn risk)
- P-value: < 0.001 (statistically significant)

Action: Invest in onboarding completion
```

### Visualization
- Survival curves by segment
- Confidence intervals
- Median survival time markers
- Risk table
```

### Predictive Churn Modeling

**Churn Prediction Framework**
```yaml
churn_prediction:
  feature_engineering:
    recency:
      - "Days since last activity"
      - "Days since last purchase"
      - "Days since last login"

    frequency:
      - "Activity count last 30 days"
      - "Purchase frequency"
      - "Support ticket count"

    monetary:
      - "Revenue last 30/60/90 days"
      - "Revenue trend"
      - "Plan tier"

    engagement:
      - "Feature usage depth"
      - "Session duration"
      - "Page views"

    sentiment:
      - "NPS score"
      - "Support sentiment"
      - "Review sentiment"

  modeling:
    algorithms:
      - "Logistic Regression"
      - "Random Forest"
      - "Gradient Boosting"
      - "Neural Networks"

    output:
      - "Churn probability score"
      - "Risk segment"
      - "Key risk factors"

  operationalization:
    scoring: "Score all customers regularly"
    segmentation: "High/medium/low risk"
    intervention: "Trigger retention actions"
    monitoring: "Track model performance"
```

### Revenue Cohort Analysis

**Revenue Retention Deep Dive**
```markdown
## Revenue Cohort Analysis

### Net Revenue Retention by Cohort
| Cohort | Month 1 | Month 6 | Month 12 | Month 24 |
|--------|---------|---------|----------|----------|
| Q1 '23 | 100% | 110% | 125% | 145% |
| Q2 '23 | 100% | 108% | 120% | - |
| Q3 '23 | 100% | 112% | - | - |

### Decomposition
| Cohort | Starting | Expansion | Contraction | Churn | Ending | NRR |
|--------|----------|-----------|-------------|-------|--------|-----|
| Q1 '23 | $100K | +$35K | -$8K | -$12K | $115K | 115% |

### Expansion Analysis
- What drives expansion?
- When does expansion happen?
- Which segments expand most?

### Contraction Analysis
- What causes contraction?
- Is contraction a churn predictor?
- Can we prevent downgrades?
```

## Quality Standards

### Analysis Quality

**Quality Checklist**
```markdown
## Cohort Analysis Quality Standards

### Data Quality
- [ ] Complete customer records
- [ ] Accurate cohort assignment
- [ ] Valid activity tracking
- [ ] Consistent definitions
- [ ] Data freshness

### Methodology Quality
- [ ] Appropriate cohort size
- [ ] Relevant time periods
- [ ] Valid comparisons
- [ ] Statistical significance
- [ ] Documented assumptions

### Insight Quality
- [ ] Actionable findings
- [ ] Clear interpretation
- [ ] Business context
- [ ] Validated conclusions
- [ ] Stakeholder alignment

### Presentation Quality
- [ ] Clear visualizations
- [ ] Appropriate detail level
- [ ] Key insights highlighted
- [ ] Recommendations included
- [ ] Next steps defined
```

## Common Challenges

### Challenge Resolution

**Small Cohort Sizes**
- Extend time periods
- Combine related cohorts
- Use statistical confidence intervals
- Focus on directional insights
- Collect more data

**Seasonal Effects**
- Compare same seasons
- Normalize for seasonality
- Use year-over-year views
- Adjust for calendar effects

**Definition Ambiguity**
- Document definitions clearly
- Use consistent methodology
- Create data dictionary
- Validate with stakeholders

## Success Metrics

### Analysis Impact
- Retention improvement
- LTV increase
- Acquisition efficiency
- Churn reduction
- Strategy influence

### Process Quality
- Analysis frequency
- Stakeholder adoption
- Insight actionability
- Prediction accuracy
- Data reliability

## Related Skills

- **customer-analytics**: Customer segmentation
- **forecasting-models**: Retention forecasting
- **attribution-modeling**: Acquisition analysis
- **kpi-frameworks**: Metric design
- **business-dashboards**: Visualization

## Resources

### Templates
- Cohort analysis template
- Retention table builder
- LTV calculator
- Churn analysis framework
- Presentation template

### Best Practices
- Cohort definition guide
- Retention benchmarks
- LTV calculation methods
- Survival analysis guide
- Churn modeling techniques
