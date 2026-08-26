---
name: customer-analytics
description: Customer segmentation, behavior analysis, and lifetime value modeling. Use when analyzing customer data, building segmentation models, calculating CLV, understanding customer behavior patterns, developing retention strategies, or creating personalization frameworks.
---

# Customer Analytics

> Customer segmentation frameworks, behavior pattern analysis, lifetime value modeling, and data-driven customer strategy development.

## Overview

Customer Analytics encompasses the systematic analysis of customer data to understand behavior patterns, predict future actions, and optimize customer-related business decisions. This skill covers segmentation methodologies, customer lifetime value (CLV) modeling, churn prediction, behavior analysis, and the translation of customer insights into actionable strategies for acquisition, retention, and growth.

In data-rich environments, organizations that excel at customer analytics gain significant competitive advantages through personalized experiences, optimized marketing spend, improved retention, and higher customer lifetime value. Customer analytics bridges the gap between raw data and strategic customer decisions, enabling evidence-based approaches to customer relationship management.

### Why This Matters

Customer analytics directly impacts revenue growth and profitability. Organizations with mature customer analytics capabilities achieve higher retention rates, more efficient acquisition spending, increased cross-sell and upsell success, and superior customer experiences. Beyond tactical improvements, customer analytics informs strategic decisions about product development, market expansion, and competitive positioning by revealing what customers truly value.

## When to Use

### Primary Triggers

- Customer strategy development or refresh
- Segmentation model creation or update
- Retention program design and optimization
- Marketing personalization initiatives
- Product development customer research
- Pricing strategy optimization
- Customer experience improvement programs

### Specific Use Cases

1. **Segmentation Development**: Creating actionable customer segments for targeted strategies
2. **CLV Modeling**: Calculating and predicting customer lifetime value for investment decisions
3. **Churn Analysis**: Identifying at-risk customers and developing intervention strategies
4. **Acquisition Optimization**: Determining highest-value customer profiles to target
5. **Personalization Strategy**: Developing data-driven personalization frameworks
6. **Pricing Optimization**: Understanding price sensitivity by customer segment

## Core Processes

### 1. Customer Segmentation

**Segmentation Approaches**
```yaml
segmentation_methods:
  demographic_segmentation:
    variables:
      b2c:
        - "Age"
        - "Gender"
        - "Income"
        - "Education"
        - "Location"
        - "Occupation"
        - "Family status"
      b2b:
        - "Company size"
        - "Industry"
        - "Geography"
        - "Annual revenue"
        - "Employee count"

    application: "Basic targeting, market sizing"
    limitation: "Does not capture behavior or needs"

  behavioral_segmentation:
    variables:
      purchase_behavior:
        - "Purchase frequency"
        - "Average order value"
        - "Product categories"
        - "Channel preference"
        - "Recency of purchase"

      engagement_behavior:
        - "Website visits"
        - "Email engagement"
        - "App usage"
        - "Support interactions"
        - "Content consumption"

    application: "Targeting, personalization, retention"
    advantage: "Directly actionable"

  value_based_segmentation:
    variables:
      - "Customer lifetime value"
      - "Current annual value"
      - "Potential value"
      - "Profitability"

    tiers:
      platinum: "Top 1-5% by value"
      gold: "Top 5-20% by value"
      silver: "Top 20-50% by value"
      bronze: "Bottom 50% by value"

    application: "Resource allocation, service differentiation"

  needs_based_segmentation:
    approach: "Cluster customers by needs and preferences"
    methods:
      - "Survey-based preference analysis"
      - "Conjoint analysis"
      - "Behavioral inference"

    application: "Product development, messaging, positioning"

  psychographic_segmentation:
    variables:
      - "Values and beliefs"
      - "Lifestyle"
      - "Personality traits"
      - "Attitudes"
      - "Interests"

    application: "Brand positioning, messaging, content"
```

**RFM Segmentation Model**
```markdown
## RFM Segmentation Framework

### Dimensions

**Recency (R)**
- Days since last purchase
- Scoring: 1-5 (5 = most recent)
- Thresholds based on business cycle

**Frequency (F)**
- Number of purchases in period
- Scoring: 1-5 (5 = most frequent)
- Adjust for customer tenure

**Monetary (M)**
- Total spend in period
- Scoring: 1-5 (5 = highest value)
- Consider average order value

### RFM Segment Definitions

| Segment | R | F | M | Description | Strategy |
|---------|---|---|---|-------------|----------|
| Champions | 5 | 5 | 5 | Best customers | Reward, exclusive access |
| Loyal | 4-5 | 4-5 | 4-5 | High value, engaged | Upsell, referral programs |
| Potential Loyal | 4-5 | 2-3 | 2-3 | Recent, growing | Nurture, increase frequency |
| New Customers | 5 | 1 | 1-2 | Just acquired | Onboarding, education |
| Promising | 4 | 1-2 | 1-2 | Recent but light | Engage, incentivize |
| Needs Attention | 3 | 3 | 3 | Average, declining | Re-engage campaigns |
| About to Sleep | 2-3 | 2-3 | 2-3 | Declining activity | Win-back offers |
| At Risk | 2 | 4-5 | 4-5 | High value, churning | Urgent intervention |
| Hibernating | 1-2 | 1-2 | 1-2 | Low recent activity | Reactivation campaigns |
| Lost | 1 | 1-5 | 1-5 | Churned | Win-back or sunset |

### Implementation Steps
1. Define time period for analysis
2. Calculate R, F, M values for each customer
3. Determine scoring thresholds (quintiles or custom)
4. Assign segment based on RFM combination
5. Develop segment-specific strategies
6. Monitor segment migration over time
```

**Advanced Segmentation Techniques**
```yaml
clustering_methods:
  k_means_clustering:
    description: "Partition customers into k distinct clusters"
    process:
      - "Select segmentation variables"
      - "Standardize variables"
      - "Determine optimal k (elbow method, silhouette)"
      - "Run clustering algorithm"
      - "Interpret and name clusters"

    variables_to_consider:
      - "Purchase behavior metrics"
      - "Engagement metrics"
      - "Demographics (encoded)"
      - "Channel preferences"

    validation:
      - "Silhouette score"
      - "Within-cluster variance"
      - "Business interpretability"

  hierarchical_clustering:
    description: "Build cluster hierarchy from individual to all"
    use_case: "Unknown number of segments, exploration"
    output: "Dendrogram showing cluster relationships"

  latent_class_analysis:
    description: "Probabilistic clustering with segment membership probability"
    advantage: "Handles uncertainty in segment assignment"
    use_case: "Survey-based segmentation, needs analysis"
```

### 2. Customer Lifetime Value Modeling

**CLV Calculation Methods**
```yaml
clv_methods:
  historical_clv:
    formula: "Sum of all past customer revenue/profit"
    use_case: "Simple backward-looking value assessment"
    limitation: "Does not predict future value"

    calculation: |
      Historical CLV = Σ (Revenue_t × Margin_t) for all past periods

  simple_predictive_clv:
    formula: "(Average Order Value × Purchase Frequency × Customer Lifespan)"

    calculation: |
      CLV = AOV × Frequency × Lifespan

      Where:
      - AOV = Average Order Value
      - Frequency = Purchases per year
      - Lifespan = Expected years as customer

  traditional_clv:
    formula: "Present value of expected future cash flows"

    calculation: |
      CLV = Σ (m × r^t) / (1 + d)^t - AC

      Where:
      - m = Margin per period
      - r = Retention rate
      - d = Discount rate
      - t = Time period
      - AC = Acquisition cost

  probabilistic_clv:
    models:
      bgnbd:
        name: "BG/NBD (Beta-Geometric/Negative Binomial Distribution)"
        predicts: "Expected number of future transactions"
        inputs:
          - "Recency"
          - "Frequency"
          - "Customer age"

      gamma_gamma:
        name: "Gamma-Gamma Model"
        predicts: "Expected average transaction value"
        inputs:
          - "Monetary value"
          - "Frequency"

        combined_clv: "E(Transactions) × E(Value) × Margin"
```

**CLV Model Implementation**
```markdown
## CLV Model Development Process

### Step 1: Data Preparation
**Required Data**
- Customer ID
- Transaction date
- Transaction amount
- Product/category (optional)
- Channel (optional)

**Data Cleaning**
- Remove test transactions
- Handle returns/refunds
- Address duplicates
- Validate date ranges

### Step 2: Feature Engineering
**Transaction-Level Features**
- Order value
- Items per order
- Category mix
- Discount usage

**Customer-Level Features**
- Total transactions
- Total revenue
- Average order value
- Purchase frequency
- Recency (time since last purchase)
- Tenure (time since first purchase)
- Inter-purchase time

### Step 3: Model Selection
**Consider:**
- Data availability
- Business context (contractual vs. non-contractual)
- Prediction horizon
- Model complexity tolerance

**Common Approaches**
- Simple heuristic (new businesses)
- Traditional formula (subscription businesses)
- Probabilistic models (retail, e-commerce)
- Machine learning (high data volume)

### Step 4: Model Validation
- Holdout validation
- Compare predicted vs. actual
- Assess by customer segment
- Monitor over time

### Step 5: Operationalization
- Score all customers
- Create CLV tiers
- Integrate into systems
- Establish refresh cadence
```

**CLV Application Framework**
```yaml
clv_applications:
  acquisition:
    decision: "How much to spend to acquire a customer"
    approach:
      - "Calculate expected CLV by acquisition channel"
      - "Set CAC ceiling as fraction of CLV (e.g., 1/3)"
      - "Optimize channel mix by CLV:CAC ratio"

    target_ratio:
      healthy: "CLV:CAC > 3:1"
      minimum: "CLV:CAC > 1:1"

  retention:
    decision: "How much to invest in retention"
    approach:
      - "Segment by CLV tier"
      - "Differentiate retention investment"
      - "Calculate ROI of retention programs"

    prioritization:
      high_clv_at_risk: "Highest priority"
      high_clv_stable: "Maintain relationship"
      low_clv_at_risk: "Evaluate intervention ROI"

  customer_experience:
    decision: "How to differentiate service levels"
    approach:
      - "Map CLV to service tiers"
      - "Allocate support resources by value"
      - "Personalize experience by segment"

  product_development:
    decision: "What features/products to build"
    approach:
      - "Analyze CLV by product usage"
      - "Identify features that drive value"
      - "Prioritize high-CLV customer needs"
```

### 3. Churn Analysis and Prediction

**Churn Definition Framework**
```yaml
churn_definitions:
  contractual_churn:
    definition: "Customer explicitly cancels subscription/contract"
    identification: "Clear cancellation event"
    examples:
      - "SaaS subscription cancellation"
      - "Membership cancellation"
      - "Service contract termination"

  non_contractual_churn:
    definition: "Customer stops purchasing (no explicit signal)"
    identification: "Inferred from inactivity"
    threshold_approaches:
      time_based:
        method: "No purchase in X days"
        calibration: "Based on typical purchase cycle"
        example: "No purchase in 90 days for monthly buyers"

      probability_based:
        method: "Probability of being 'alive' below threshold"
        calibration: "Using probabilistic models"
        example: "P(alive) < 10%"

  partial_churn:
    definition: "Customer reduces engagement/spending"
    types:
      - "Downgrade (subscription tier)"
      - "Reduced purchase frequency"
      - "Reduced basket size"
      - "Category abandonment"
```

**Churn Prediction Model**
```markdown
## Churn Prediction Framework

### Feature Categories

**Behavioral Features**
- Recency of last activity
- Frequency trend (increasing/decreasing)
- Monetary trend
- Engagement metrics (logins, page views)
- Support ticket frequency
- Feature usage patterns

**Transactional Features**
- Days since last purchase
- Purchase frequency change
- Average order value change
- Product category shifts
- Return rate

**Engagement Features**
- Email open/click rates
- App usage frequency
- Website visit frequency
- NPS/CSAT scores
- Support interactions

**Customer Attributes**
- Tenure
- Acquisition channel
- Customer segment
- Contract type/term

### Model Approaches

**Logistic Regression**
- Interpretable coefficients
- Good baseline model
- Feature importance clear

**Random Forest / Gradient Boosting**
- Higher predictive accuracy
- Handles non-linear relationships
- Feature importance rankings

**Survival Analysis**
- Predicts time-to-churn
- Handles censored data
- Cox proportional hazards

### Model Output Utilization

**Churn Probability Tiers**
| Risk Level | Probability | Action |
|------------|-------------|--------|
| Critical | >80% | Immediate intervention |
| High | 50-80% | Proactive outreach |
| Medium | 25-50% | Enhanced monitoring |
| Low | <25% | Standard treatment |

**Intervention Prioritization**
Intervention Priority = Churn Probability × Customer Value × (1 - Intervention Cost/Value)
```

### 4. Behavior Analysis

**Customer Journey Analysis**
```yaml
journey_analysis:
  touchpoint_mapping:
    channels:
      - "Website"
      - "Mobile app"
      - "Email"
      - "Social media"
      - "Customer service"
      - "Physical store"
      - "Direct mail"

    interaction_types:
      - "Browse/research"
      - "Purchase"
      - "Support request"
      - "Marketing engagement"
      - "Account management"

  journey_patterns:
    analysis_methods:
      sequence_analysis:
        purpose: "Identify common paths"
        technique: "Markov chain, sequence mining"
        output: "Most common journey patterns"

      funnel_analysis:
        purpose: "Identify drop-off points"
        technique: "Stage-by-stage conversion"
        output: "Conversion rates, bottlenecks"

      attribution_analysis:
        purpose: "Credit touchpoints for conversion"
        technique: "Multi-touch attribution models"
        output: "Channel contribution"

  behavioral_cohort_analysis:
    definition: "Group customers by behavior timing"
    dimensions:
      - "Acquisition cohort (by sign-up date)"
      - "First purchase cohort"
      - "Feature adoption cohort"

    metrics_to_track:
      - "Retention by cohort"
      - "Revenue by cohort"
      - "Engagement by cohort"
      - "Behavior milestones"
```

**Product and Feature Usage Analysis**
```markdown
## Feature Usage Analytics Framework

### Usage Metrics

**Adoption Metrics**
- Feature activation rate
- Time to first use
- Adoption by segment

**Engagement Metrics**
- Daily/weekly/monthly active usage
- Feature depth (actions per session)
- Frequency of use
- Time spent

**Retention Impact**
- Feature usage correlation with retention
- Must-have features (high correlation)
- Nice-to-have features (lower correlation)

### Analysis Framework

**Feature Value Matrix**
| Feature | Adoption % | Engagement | Retention Impact | Priority |
|---------|-----------|------------|------------------|----------|
| Feature A | High | High | High | Core Value |
| Feature B | High | Low | Medium | Optimize |
| Feature C | Low | High | High | Drive Adoption |
| Feature D | Low | Low | Low | Evaluate |

### Activation Analysis
1. Define "activated" behavior
2. Measure time-to-activation
3. Identify activation blockers
4. Segment by activation status
5. Design interventions for non-activated
```

## Tools & Templates

### Customer Segmentation Template
```markdown
## Customer Segmentation Analysis

### Segmentation Overview
- **Analysis Date**: [Date]
- **Customer Population**: [N customers]
- **Segmentation Method**: [Method used]
- **Primary Variables**: [List]

### Segment Profiles

#### Segment 1: [Name]
**Size**: [N customers, % of total]
**Value**: [$X revenue, % of total]

**Defining Characteristics**
- Behavior: [Description]
- Demographics: [Description]
- Needs: [Description]

**Key Metrics**
| Metric | Segment | Overall | Index |
|--------|---------|---------|-------|
| AOV | $X | $Y | Z |
| Frequency | X | Y | Z |
| CLV | $X | $Y | Z |

**Strategic Implications**
- [Implication 1]
- [Implication 2]

**Recommended Actions**
- [Action 1]
- [Action 2]

[Repeat for each segment]

### Segment Comparison
[Summary table comparing all segments]

### Migration Analysis
[Movement between segments over time]
```

### CLV Scorecard Template
```yaml
clv_scorecard:
  overall_metrics:
    total_customer_base: "[N]"
    total_clv: "[$X]"
    average_clv: "[$Y]"
    median_clv: "[$Z]"

  clv_distribution:
    top_1_percent:
      customers: "[N]"
      clv_share: "[%]"
      avg_clv: "[$X]"
    top_10_percent:
      customers: "[N]"
      clv_share: "[%]"
      avg_clv: "[$X]"
    bottom_50_percent:
      customers: "[N]"
      clv_share: "[%]"
      avg_clv: "[$X]"

  clv_by_segment:
    headers: ["Segment", "Customers", "Total CLV", "Avg CLV", "% of Total"]
    rows: "[Segment-level breakdown]"

  clv_trends:
    new_customer_clv: "[Trend vs prior period]"
    existing_customer_clv: "[Trend]"
    clv_growth_drivers: "[Analysis]"
```

## Metrics & KPIs

### Customer Analytics Metrics
```yaml
customer_metrics:
  acquisition:
    cac: "Customer Acquisition Cost"
    cac_by_channel: "CAC segmented by acquisition source"
    conversion_rate: "Prospect to customer conversion"
    time_to_convert: "Average sales cycle length"

  value:
    clv: "Customer Lifetime Value"
    clv_cac_ratio: "LTV:CAC ratio (target >3:1)"
    arpu: "Average Revenue Per User"
    aov: "Average Order Value"

  retention:
    retention_rate: "% customers retained period-over-period"
    churn_rate: "% customers lost"
    nrr: "Net Revenue Retention"
    repeat_purchase_rate: "% making 2+ purchases"

  engagement:
    dau_mau_ratio: "Daily to monthly active user ratio"
    session_frequency: "Average sessions per user"
    feature_adoption: "% using key features"
    nps: "Net Promoter Score"
```

## Common Pitfalls

### Customer Analytics Pitfalls

**1. Segment of One Fallacy**
- Problem: Over-segmenting into non-actionable groups
- Solution: Ensure segments are sizeable and strategically distinct
- Rule of Thumb: Minimum 5-7 segments, each with distinct strategy

**2. CLV Model Overconfidence**
- Problem: Treating predictions as certainty
- Solution: Use ranges, validate regularly, update models
- Validation: Compare predicted vs. actual CLV for past cohorts

**3. Ignoring Segment Migration**
- Problem: Static segmentation misses customer evolution
- Solution: Track segment movement, analyze drivers
- Cadence: Quarterly segment migration analysis

**4. Correlation vs. Causation**
- Problem: Assuming feature usage causes retention
- Solution: Experimentation, careful causal analysis
- Example: Engaged users may just be more likely to stay regardless

**5. Data Quality Issues**
- Problem: Incomplete or inaccurate customer data
- Solution: Data governance, identity resolution, validation
- Impact: Garbage in, garbage out for analytics

**6. Analysis Without Action**
- Problem: Insights not translated to business action
- Solution: Clear ownership, action planning, accountability
- Integration: Embed analytics in business processes

## Integration Points

### Connected Skills
- **attribution-modeling**: Customer journey attribution
- **cohort-analysis**: Time-based customer analysis
- **forecasting-models**: Customer metric forecasting
- **kpi-frameworks**: Customer KPI definition
- **business-dashboards**: Customer analytics visualization

### Data Requirements
- Transaction/order history
- Customer demographics
- Engagement/interaction data
- Support/service records
- Marketing touchpoint data
- Product usage telemetry

### Stakeholder Applications
- Marketing: Targeting, personalization, campaign optimization
- Sales: Account prioritization, expansion opportunities
- Product: Feature development, roadmap prioritization
- Customer Success: Intervention, retention programs
- Finance: Revenue forecasting, investment decisions
