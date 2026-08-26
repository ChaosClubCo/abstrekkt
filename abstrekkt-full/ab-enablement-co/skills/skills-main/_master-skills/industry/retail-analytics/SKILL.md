---
name: retail-analytics
description: Analyze retail performance data, model customer behavior patterns, optimize inventory management, and design omnichannel strategies. Build dashboards, forecast demand, segment customers, and measure promotional effectiveness across retail channels. Use when navigating industry-specific regulations, processes, or operations.
---

# Retail Analytics Skill

> Data-driven retail performance optimization through customer intelligence, demand forecasting, and omnichannel measurement

## Description

This skill provides comprehensive guidance for retail analytics spanning customer behavior analysis, inventory optimization, demand forecasting, pricing analytics, and omnichannel strategy measurement. It covers analytical methodologies from exploratory analysis to predictive modeling and prescriptive optimization across brick-and-mortar, e-commerce, and hybrid retail environments. The skill supports retail analysts, merchandising teams, marketing analysts, supply chain planners, and business intelligence professionals in extracting actionable insights from retail data to drive revenue growth, margin improvement, and customer lifetime value.

## Activation Triggers

- User mentions "retail analytics", "store performance", "sales analysis", or "retail KPIs"
- User asks about customer segmentation, RFM analysis, or customer lifetime value
- User discusses inventory optimization, stockout analysis, or demand planning
- User needs help with promotional effectiveness or markdown optimization
- User asks about basket analysis, product affinity, or cross-sell recommendations
- User mentions omnichannel analytics, attribution modeling, or channel performance
- User discusses price elasticity, competitive pricing, or dynamic pricing
- User asks about foot traffic analysis, conversion rates, or store clustering
- User needs demand forecasting models or seasonal decomposition
- User mentions retail dashboards, reporting frameworks, or merchandising analytics

## Instructions

### Core Workflow

1. **Data Assessment and Integration**
   - Inventory available data sources: POS, e-commerce, CRM, loyalty, inventory, foot traffic
   - Assess data quality, completeness, and granularity across all sources
   - Define the unified customer identifier strategy across channels
   - Build the retail data model connecting transactions, products, customers, and locations
   - Establish data refresh cadence and latency requirements for each analytical use case

2. **Customer Intelligence**
   - Perform RFM (Recency, Frequency, Monetary) segmentation across the customer base
   - Calculate customer lifetime value using probabilistic models (BG/NBD, Gamma-Gamma)
   - Analyze customer journey patterns from acquisition through retention and win-back
   - Build customer propensity models for churn, next purchase, and category migration
   - Map customer segments to differentiated marketing and merchandising strategies

3. **Merchandising and Inventory Analytics**
   - Analyze sell-through rates, weeks of supply, and inventory turn by category and location
   - Build demand forecasting models incorporating seasonality, trends, promotions, and external factors
   - Optimize assortment by location using cluster-based planogram analytics
   - Calculate optimal reorder points and safety stock levels per SKU-location combination
   - Measure promotional lift, cannibalization, and halo effects on adjacent categories

4. **Performance Measurement**
   - Define and standardize KPI hierarchies from enterprise level to store-SKU level
   - Build automated reporting dashboards with drill-down from high-level to granular metrics
   - Implement comp sales analysis controlling for new/closed stores and calendar shifts
   - Measure omnichannel metrics including BOPIS adoption, ship-from-store, and cross-channel attribution
   - Create executive scorecards with leading and lagging indicator balance

5. **Optimization and Action**
   - Translate analytical findings into specific merchandising and marketing actions
   - Prioritize initiatives by estimated revenue impact and implementation complexity
   - Design A/B test frameworks for pricing, promotion, and assortment changes
   - Build automated alerting for metric deviations exceeding defined thresholds
   - Establish feedback loops connecting actions to measured outcomes for continuous improvement

### Customer Analytics Framework

```yaml
customer_analytics:
  rfm_segmentation:
    dimensions:
      recency: "Days since last purchase"
      frequency: "Number of transactions in analysis period"
      monetary: "Total spend in analysis period"
    scoring:
      method: "Quintile scoring (1-5) per dimension"
      segments:
        champions: "R:5 F:5 M:5 - Best customers, reward and retain"
        loyal: "R:4-5 F:4-5 M:3-5 - Consistent high-value buyers"
        potential_loyalists: "R:4-5 F:2-3 M:2-3 - Growing engagement, nurture"
        new_customers: "R:5 F:1 M:1-2 - Just acquired, onboard effectively"
        at_risk: "R:2-3 F:3-5 M:3-5 - Were loyal, engagement declining"
        hibernating: "R:1-2 F:1-2 M:1-2 - Inactive, win-back or suppress"
        lost: "R:1 F:1-2 M:1-5 - Long inactive, evaluate reactivation cost"

  customer_lifetime_value:
    models:
      historical: "Sum of past margins per customer"
      simple_predictive: "Avg order value x Purchase frequency x Customer lifespan"
      probabilistic:
        bg_nbd: "Models purchase frequency using Beta-Geometric/NBD distribution"
        gamma_gamma: "Models monetary value conditional on transaction count"
        combined: "CLV = margin_per_transaction x expected_transactions x discount_factor"
    applications:
      acquisition: "Set max CAC as fraction of predicted CLV (typically 20-30%)"
      retention: "Invest retention budget proportional to CLV tier"
      segmentation: "Group customers by predicted future value, not just past behavior"

  basket_analysis:
    market_basket:
      metrics:
        support: "Frequency of itemset / Total transactions"
        confidence: "P(Y|X) = Support(X,Y) / Support(X)"
        lift: "Confidence(X->Y) / Support(Y)"
      thresholds:
        min_support: "0.01-0.05 depending on catalog size"
        min_confidence: "0.10-0.30 depending on use case"
        min_lift: ">1.0 indicates positive association"
    applications:
      cross_sell: "Recommend associated products at checkout"
      store_layout: "Place high-affinity categories in adjacency"
      bundle_pricing: "Create value bundles from high-lift item pairs"
      promotional_planning: "Feature complementary items in same promotion"

  journey_analytics:
    stages:
      awareness: "First touchpoint or visit"
      consideration: "Browse, compare, add to cart"
      purchase: "Transaction completion"
      retention: "Repeat purchase behavior"
      advocacy: "Referral, review, social sharing"
    metrics_per_stage:
      awareness: "New visitor rate, channel acquisition mix"
      consideration: "Pages per session, cart add rate, browse-to-cart conversion"
      purchase: "Cart-to-purchase conversion, AOV, units per transaction"
      retention: "Repeat rate, purchase frequency, time between orders"
      advocacy: "NPS, referral rate, UGC generation"
```

### Demand Forecasting and Inventory Framework

```yaml
demand_forecasting:
  methods:
    time_series:
      moving_average: "Simple, weighted, or exponential smoothing"
      arima: "Autoregressive Integrated Moving Average for stationary series"
      seasonal_decomposition: "STL or X-13 for trend-seasonal separation"
      prophet: "Facebook Prophet for business time series with holidays and events"
    causal_models:
      regression: "Include price, promotion, weather, events as regressors"
      price_elasticity: "Log-log regression of quantity on price"
      promotional_lift: "Baseline + incremental decomposition"
    machine_learning:
      gradient_boosting: "XGBoost/LightGBM with lag features and external signals"
      neural_networks: "LSTM or Temporal Fusion Transformer for complex patterns"
      ensemble: "Combine statistical and ML models for robust forecasts"

  forecast_accuracy:
    metrics:
      mape: "Mean Absolute Percentage Error - most common retail metric"
      wmape: "Weighted MAPE - accounts for volume differences across SKUs"
      bias: "Systematic over/under forecasting directional measure"
      forecast_value_added: "Improvement over naive baseline model"
    benchmarks:
      excellent: "WMAPE <20% at weekly-SKU-store level"
      good: "WMAPE 20-30% at weekly-SKU-store level"
      acceptable: "WMAPE 30-40% at weekly-SKU-store level"
      poor: "WMAPE >40% indicates model issues or data problems"

  inventory_optimization:
    key_metrics:
      inventory_turn: "COGS / Average inventory value"
      weeks_of_supply: "Current inventory / Average weekly sales"
      sell_through_rate: "Units sold / Units received"
      gmroi: "Gross margin / Average inventory cost (target >2.0)"
      stockout_rate: "Days out of stock / Total selling days"

    reorder_optimization:
      economic_order_quantity: "Minimize total of ordering and holding costs"
      reorder_point: "Lead time demand + Safety stock"
      safety_stock: "Z-score x Std dev of demand during lead time"
      service_level_targets:
        a_items: "99% in-stock (top 20% of revenue)"
        b_items: "95% in-stock (next 30% of revenue)"
        c_items: "90% in-stock (remaining 50% of revenue)"

    markdown_optimization:
      strategy: "Maximize total margin across product lifecycle"
      inputs:
        - Current inventory position vs. planned sell-through curve
        - Price elasticity estimates by category and price tier
        - Remaining selling weeks before end-of-season
        - Competitive pricing landscape
      approaches:
        rule_based: "Predefined cadence (30%, 50%, 70% off at set intervals)"
        model_based: "Dynamic markdown depth and timing based on demand curve"
```

### Templates

#### Weekly Retail Performance Dashboard
```markdown
# Weekly Retail Performance: Week [Number] - [Date Range]

## Enterprise Summary
| Metric | This Week | LW | LY | vs LY % | Plan | vs Plan % |
|--------|-----------|-----|-----|---------|------|-----------|
| Net Sales | [$] | [$] | [$] | [%] | [$] | [%] |
| Comp Sales | [%] | [%] | [%] | [bps] | [%] | [bps] |
| Transactions | [Count] | [Count] | [Count] | [%] | [Count] | [%] |
| AOV | [$] | [$] | [$] | [%] | [$] | [%] |
| UPT | [Units] | [Units] | [Units] | [%] | [Units] | [%] |
| Gross Margin % | [%] | [%] | [%] | [bps] | [%] | [bps] |

## Channel Performance
| Channel | Sales | % of Total | vs LY | Conversion | AOV |
|---------|-------|-----------|-------|------------|-----|
| Stores | [$] | [%] | [%] | [%] | [$] |
| E-commerce | [$] | [%] | [%] | [%] | [$] |
| BOPIS | [$] | [%] | [%] | [%] | [$] |
| Marketplace | [$] | [%] | [%] | [%] | [$] |

## Category Performance
| Category | Sales | Comp % | Margin % | WOS | Sell-Thru |
|----------|-------|--------|----------|-----|-----------|
| [Category 1] | [$] | [%] | [%] | [Wks] | [%] |
| [Category 2] | [$] | [%] | [%] | [Wks] | [%] |

## Action Items
- [Key insight and recommended action]
- [Key insight and recommended action]
```

#### Customer Segment Profile
```markdown
# Customer Segment Profile: [Segment Name]

## Segment Definition
- Criteria: [RFM scores, behavioral rules, or model-based criteria]
- Size: [Customer count and % of total base]
- Revenue Contribution: [$Amount and % of total revenue]

## Behavioral Metrics
| Metric | Segment | Overall Avg | Index |
|--------|---------|-------------|-------|
| Avg Annual Spend | [$] | [$] | [Index] |
| Purchase Frequency | [x/yr] | [x/yr] | [Index] |
| AOV | [$] | [$] | [Index] |
| Avg Basket Size | [units] | [units] | [Index] |
| Retention Rate | [%] | [%] | [Index] |
| CLV (3-Year) | [$] | [$] | [Index] |

## Channel Preferences
| Channel | Segment Mix | Overall Mix | Over/Under Index |
|---------|------------|-------------|-----------------|
| In-Store | [%] | [%] | [Index] |
| Online | [%] | [%] | [Index] |
| Mobile App | [%] | [%] | [Index] |

## Recommended Strategy
- Acquisition: [Approach and target CAC]
- Engagement: [Tactics and cadence]
- Retention: [Programs and offers]
```

### Best Practices

1. **Comp Sales Discipline**: Always calculate comparable sales on a like-for-like basis, adjusting for new stores, closures, remodels, and calendar shifts
2. **Statistical Significance**: Require minimum sample sizes and significance levels before acting on A/B test results for pricing or promotional changes
3. **Forecast Hierarchy Reconciliation**: Ensure bottom-up (SKU-store) forecasts reconcile to top-down (category-region) plans through structured alignment process
4. **Data Latency Awareness**: Document and communicate the latency of each data source; never present stale data as current without clear labeling
5. **Margin Over Revenue**: Optimize for gross margin dollars and GMROI rather than top-line sales alone; revenue growth at negative margin destroys value
6. **Customer-Centric Metrics**: Complement transaction metrics with customer metrics (repeat rate, CLV, NPS) to balance short-term sales with long-term loyalty
7. **Cannibalization Measurement**: Always measure promotional cannibalization and pull-forward effects alongside lift to understand true incremental impact
8. **Segmented Benchmarking**: Compare store performance against peer clusters (urban/suburban, volume tier, age) rather than fleet averages
9. **External Data Integration**: Incorporate weather, local events, competitive openings, and economic indicators into demand models for improved accuracy
10. **Actionable Granularity**: Match analytical granularity to the decision level; store-level decisions need store-level data, not just regional averages
11. **Inventory Position Visibility**: Maintain real-time or near-real-time inventory visibility across all locations for accurate available-to-promise and fulfillment routing
12. **Test Before Scaling**: Pilot pricing, assortment, and promotional strategies in representative test markets before chain-wide rollout

### Common Patterns

#### Pattern 1: Promotional Effectiveness Analysis
```
Scenario: Evaluate the incremental impact of a 20%-off weekend promotion
on a key apparel category across 200 stores.

Process:
1. Define pre-promotion baseline using 4-week average weekly sales by store
2. Calculate promoted period sales by store and compare to baseline
3. Measure gross lift: +35% unit sales and +8% revenue vs. baseline
4. Adjust for pull-forward: post-promotion week shows -12% vs. baseline
5. Measure cannibalization: adjacent full-price category down -5% during promo
6. Calculate net incremental units: gross lift - pull-forward - cannibalization = +18%
7. Compute promotional margin: incremental margin minus funding cost = $142K
8. Compare ROI against alternative promotional mechanics tested in prior periods
9. Segment results by store cluster: urban stores show 2x lift vs. suburban
10. Recommend: repeat promotion in urban stores only, test alternative in suburban
```

#### Pattern 2: Inventory Rebalancing Decision
```
Scenario: A seasonal product has 12 weeks of supply nationally but
distribution is uneven (3 WOS in top stores, 22 WOS in bottom stores).

Process:
1. Pull current inventory position by location with weekly sell-through rates
2. Segment stores into performance quartiles based on trailing 4-week unit velocity
3. Identify 45 stores with <4 WOS (stockout risk before end-of-season)
4. Identify 60 stores with >18 WOS (excess requiring markdown without action)
5. Calculate transfer quantities: match excess to demand, minimize freight cost
6. Model scenarios: transfer-only vs. transfer + selective markdown at bottom stores
7. Transfer scenario yields $85K additional full-price margin vs. markdown-only
8. Net of $12K freight cost, recommendation is to transfer 4,200 units across 45 stores
9. Execute transfers through DC consolidation (lower cost than store-to-store)
10. Monitor post-transfer sell-through weekly and adjust markdown timing for residual
```

### Output Formats

#### Category Performance Scorecard
```markdown
# Category Scorecard: [Category Name] - [Period]

## Financial Performance
| Metric | Actual | Plan | Var $ | Var % | LY | vs LY % |
|--------|--------|------|-------|-------|----|---------|
| Net Sales | [$] | [$] | [$] | [%] | [$] | [%] |
| Gross Margin $ | [$] | [$] | [$] | [%] | [$] | [%] |
| Gross Margin % | [%] | [%] | [bps] | - | [%] | [bps] |
| Markdowns $ | [$] | [$] | [$] | [%] | [$] | [%] |

## Inventory Health
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Weeks of Supply | [Wks] | [Target] | [Over/Under/Balanced] |
| Sell-Through % | [%] | [%] | [Ahead/Behind] |
| GMROI | [Ratio] | [Target] | [Above/Below] |
| In-Stock % | [%] | [Target] | [Met/Missed] |
| Inventory Turn | [Ratio] | [Target] | [Above/Below] |

## Top/Bottom SKUs
| Rank | SKU | Description | Units | Revenue | Margin % | WOS |
|------|-----|-------------|-------|---------|----------|-----|
| Top 1 | [SKU] | [Desc] | [Units] | [$] | [%] | [Wks] |
| Bottom 1 | [SKU] | [Desc] | [Units] | [$] | [%] | [Wks] |
```

#### Forecast Accuracy Report
```markdown
# Forecast Accuracy Report: [Period]

## Summary by Category
| Category | WMAPE | Bias | FVA vs Naive | Improvement vs Prior |
|----------|-------|------|-------------|---------------------|
| [Category] | [%] | [Over/Under %] | [+/- pp] | [+/- pp] |

## Accuracy Distribution
| WMAPE Range | SKU Count | % of SKUs | % of Revenue |
|-------------|-----------|-----------|-------------|
| <10% | [Count] | [%] | [%] |
| 10-20% | [Count] | [%] | [%] |
| 20-30% | [Count] | [%] | [%] |
| 30-50% | [Count] | [%] | [%] |
| >50% | [Count] | [%] | [%] |
```

## Integration Points

- Point-of-sale systems (Oracle Retail, NCR, Shopify POS, Square)
- E-commerce platforms (Shopify, Salesforce Commerce Cloud, Adobe Commerce)
- ERP and merchandise planning (SAP Retail, Oracle Retail, Blue Yonder)
- Customer data platforms (Segment, mParticle, Tealium)
- BI and analytics tools (Tableau, Power BI, Looker, Databricks)
- Demand planning platforms (Blue Yonder, SAS, o9 Solutions)
- Loyalty program platforms (Brierley, Epsilon, Annex Cloud)
- Foot traffic and location analytics (Placer.ai, RetailNext, ShopperTrak)

## Version History

- 1.0.0: Initial retail analytics skill with customer, merchandising, and omnichannel analytics
