---
name: supply-chain-optimization
description: Optimize end-to-end supply chain operations including demand forecasting, inventory management, logistics routing, and supplier performance tracking to maximize throughput and minimize carrying costs. Use when managing, optimizing, or automating operational workflows.
---

# Supply Chain Optimization

> Streamline every link in the chain from raw material to final delivery

## Description

Supply chain optimization focuses on designing, planning, and executing logistics and procurement strategies that minimize total cost of ownership while maximizing service levels. This skill covers demand planning, inventory optimization, transportation management, and supplier relationship orchestration. It applies lean and Six Sigma principles to eliminate waste, reduce lead times, and improve on-time delivery rates. Practitioners use this skill to build resilient, agile supply networks that respond to disruptions and demand variability with minimal impact to throughput.

## Activation Triggers

- "Optimize our supply chain for cost and delivery speed"
- "Reduce inventory carrying costs without hurting fill rates"
- "Build a demand forecasting model for seasonal products"
- "Evaluate supplier performance and consolidate our vendor base"
- "Design a logistics network for multi-warehouse distribution"
- "Identify bottlenecks in our procurement-to-delivery pipeline"
- "Create a safety stock policy for critical SKUs"
- "Improve our order-to-cash cycle time"
- "Develop a supply chain risk mitigation strategy"
- "Analyze our bullwhip effect and recommend dampening controls"

## Instructions

### Core Workflow

**Step 1: Supply Chain Assessment**
- Map the current end-to-end value stream from supplier to customer
- Identify all nodes: suppliers, manufacturing sites, DCs, 3PLs, last-mile carriers
- Collect baseline KPIs: lead time, fill rate, OTIF, inventory turns, carrying cost
- Document current demand planning methodology and forecast accuracy (MAPE)
- Catalog existing technology stack (ERP, WMS, TMS, demand planning tools)

**Step 2: Demand and Supply Analysis**
- Analyze historical demand patterns: trend, seasonality, cyclicality, noise
- Segment SKUs using ABC-XYZ classification for differentiated strategies
- Calculate demand variability coefficients by product family
- Assess supplier lead time reliability and capacity constraints
- Map supply-demand mismatches and quantify their cost impact

**Step 3: Optimization Design**
- Define target service levels by customer segment and product tier
- Calculate optimal safety stock using statistical models (z-score x sigma x sqrt(LT))
- Design reorder point and EOQ policies for each inventory classification
- Model transportation lane optimization using cost-per-unit-shipped analysis
- Develop supplier scorecard criteria weighted by strategic importance

**Step 4: Implementation Planning**
- Prioritize initiatives by ROI using effort-impact matrix
- Define implementation phases: quick wins (0-3mo), structural (3-9mo), transformational (9-18mo)
- Establish change management approach for process and system transitions
- Create RACI matrix for cross-functional accountability
- Build risk register with contingency plans for each initiative

**Step 5: Performance Monitoring**
- Deploy KPI dashboards with real-time and periodic metrics
- Establish weekly S&OP cadence with demand-supply balancing reviews
- Implement exception-based alerting for KPI threshold breaches
- Conduct quarterly supply chain maturity assessments
- Run continuous improvement cycles using PDCA methodology

### Supply Chain Performance Framework

**Key Performance Indicators (KPIs)**

| KPI Category | Metric | Target Range | Measurement Frequency |
|---|---|---|---|
| Reliability | OTIF (On-Time In-Full) | 95-99% | Weekly |
| Reliability | Perfect Order Rate | 90-98% | Monthly |
| Responsiveness | Order Cycle Time | Industry benchmark -15% | Weekly |
| Responsiveness | Cash-to-Cash Cycle | Minimize | Monthly |
| Agility | Upside Supply Flexibility | +20-30% within 30 days | Quarterly |
| Cost | Total SCM Cost as % Revenue | 4-10% (industry dependent) | Monthly |
| Cost | Inventory Carrying Cost | 15-25% of avg inventory value | Monthly |
| Asset Efficiency | Inventory Turns | Industry top quartile | Monthly |
| Asset Efficiency | Capacity Utilization | 80-90% | Weekly |

**Process Maturity Model**

Level 1 - Reactive: Firefighting mode, no formal processes, siloed functions
Level 2 - Defined: Documented processes, basic forecasting, periodic reviews
Level 3 - Managed: S&OP in place, statistical forecasting, cross-functional KPIs
Level 4 - Integrated: End-to-end visibility, collaborative planning with partners
Level 5 - Optimized: Predictive analytics, autonomous replenishment, self-healing networks

**Demand Planning Accuracy Targets**

- Monthly forecast at product family level: MAPE < 15%
- Weekly forecast at SKU level: MAPE < 25-35%
- Bias should trend within +/- 5% of zero
- Track forecast value-add (FVA) vs. naive model at each planning level

### Inventory Optimization Framework

**ABC-XYZ Classification Matrix**

| Segment | A (High Value) | B (Medium Value) | C (Low Value) |
|---|---|---|---|
| X (Stable Demand) | Lean/JIT, low safety stock | EOQ-based, moderate SS | Min-max, periodic review |
| Y (Variable Demand) | Statistical SS, frequent review | Hybrid policy, buffer stock | Aggregate planning |
| Z (Erratic Demand) | Make-to-order, postponement | Vendor-managed, risk pooling | Eliminate or substitute |

**Safety Stock Calculation Checklist**

- [ ] Determine target service level (CSL) per segment
- [ ] Calculate demand standard deviation over lead time
- [ ] Factor in lead time variability from supplier scorecards
- [ ] Apply z-score multiplier: SS = z * sigma_demand * sqrt(LT) + z * d_avg * sigma_LT
- [ ] Validate against practical minimums and shelf-life constraints
- [ ] Review and adjust quarterly based on actual vs. planned consumption
- [ ] Document assumptions and sensitivity analysis results

**Supplier Evaluation Criteria**

| Criterion | Weight | Scoring (1-5) |
|---|---|---|
| On-time delivery reliability | 25% | Based on 6-month OTIF |
| Quality defect rate (PPM) | 20% | <100 PPM = 5, >5000 = 1 |
| Cost competitiveness | 20% | TCO benchmarked vs. market |
| Capacity flexibility | 15% | Upside flex within 4 weeks |
| Financial stability | 10% | D&B rating / credit score |
| Innovation capability | 10% | Joint development track record |

### Templates

**Template 1: S&OP Meeting Agenda**

```
SALES & OPERATIONS PLANNING - MONTHLY REVIEW
Date: [Date] | Cycle: [Month/Year] | Facilitator: [Name]

1. PRIOR ACTION ITEMS REVIEW (10 min)
   - Status of open actions from last cycle
   - Escalations requiring executive decision

2. DEMAND REVIEW (20 min)
   - Forecast accuracy last period: MAPE = [X]%, Bias = [X]%
   - Updated demand plan: [Volume] units, [Revenue] USD
   - Key assumptions and risks to demand plan
   - New product launch / phase-out impacts

3. SUPPLY REVIEW (20 min)
   - Capacity utilization: [X]% | Constraints: [List]
   - Supplier issues: [Lead time changes, quality alerts]
   - Inventory position: [X] weeks of supply | Turns: [X]
   - Open POs at risk: [Count] | Value: [USD]

4. RECONCILIATION (20 min)
   - Demand-supply gaps by product family
   - Scenario analysis: base / upside / downside
   - Financial impact of proposed plan vs. budget

5. EXECUTIVE DECISIONS REQUIRED (10 min)
   - [Decision 1]: Options A/B/C, recommendation, impact
   - [Decision 2]: Options A/B/C, recommendation, impact

6. ACTION ITEMS & NEXT STEPS (10 min)
```

**Template 2: Supply Chain Risk Register**

```
SUPPLY CHAIN RISK REGISTER
Last Updated: [Date] | Owner: [Name]

| Risk ID | Description | Category | Probability | Impact | Risk Score | Mitigation Strategy | Owner | Status |
|---------|-------------|----------|-------------|--------|------------|---------------------|-------|--------|
| SCR-001 | Single-source supplier for critical component | Supplier | High | Critical | 20 | Qualify alternate supplier by Q2 | [Name] | In Progress |
| SCR-002 | Port congestion during peak season | Logistics | Medium | High | 12 | Pre-ship 30 days early, alt routing | [Name] | Monitoring |
| SCR-003 | Demand spike exceeds capacity by 25% | Demand | Medium | High | 12 | Contract surge capacity with 3PL | [Name] | Planned |

RISK SCORING: Probability (1-5) x Impact (1-5) = Risk Score
Critical: 20-25 | High: 12-19 | Medium: 6-11 | Low: 1-5
```

**Template 3: Logistics Cost Analysis**

```
TRANSPORTATION COST-PER-UNIT ANALYSIS
Period: [Date Range] | Analyst: [Name]

Lane: [Origin] -> [Destination]
Mode: [FTL / LTL / Parcel / Air / Ocean]

| Cost Component | Amount | % of Total |
|----------------|--------|------------|
| Line haul / freight rate | $[X] | [X]% |
| Fuel surcharge | $[X] | [X]% |
| Accessorial charges | $[X] | [X]% |
| Customs / duties | $[X] | [X]% |
| Insurance | $[X] | [X]% |
| Total landed cost per unit | $[X] | 100% |

Utilization: [X]% of trailer/container capacity
Cost per unit shipped: $[X]
Cost per pound/kg: $[X]
Benchmark vs. market rate: [+/-X]%
```

### Best Practices

- Run S&OP as a disciplined monthly cycle with executive sponsorship and cross-functional attendance
- Segment your supply chain strategy by product-market combination rather than one-size-fits-all
- Measure forecast accuracy at the level where decisions are made, not just aggregate
- Maintain dual sourcing for any component representing >5% of COGS or >$1M annual spend
- Use total cost of ownership (TCO) not unit price when evaluating supplier bids
- Implement vendor-managed inventory (VMI) for stable, high-volume commodity items
- Set inventory targets based on desired service level, not arbitrary days-of-supply rules
- Review and rationalize SKU portfolio quarterly to eliminate long-tail dead stock
- Build supply chain control towers for end-to-end visibility across all tiers
- Design postponement strategies to push differentiation as late as possible
- Stress-test supply chain plans against disruption scenarios (supplier failure, demand spike, logistics breakdown)
- Align supply chain KPIs with P&L ownership to drive accountability
- Automate transactional procurement to free strategic sourcing bandwidth
- Collaborate with key suppliers on joint business plans and shared forecasts

### Common Patterns

**Pattern 1: Inventory Reduction Without Service Impact**

A consumer goods company carries $50M in average inventory with 4.2 turns and 94% fill rate. Analysis reveals 35% of SKUs are C-Z classification generating 3% of revenue. Action: (1) Discontinue bottom 15% of SKUs, (2) Move C-Y items to make-to-order, (3) Implement statistical safety stock for A-X and A-Y items replacing blanket 4-week policy. Result: Inventory reduced to $38M, turns improved to 5.8, fill rate increased to 96.5% on remaining portfolio.

**Pattern 2: Supplier Consolidation and Risk Balancing**

A manufacturer uses 340 suppliers across 12 categories. Top 20 suppliers represent 70% of spend; bottom 200 represent 8%. Action: (1) Consolidate tail spend into 3 GPO contracts, (2) Establish dual-source for top 10 strategic categories, (3) Implement quarterly business reviews with top 20 suppliers, (4) Deploy supplier portal for automated PO and invoice management. Result: Supplier count reduced to 145, negotiated 7% cost reduction through volume consolidation, improved OTIF from 88% to 95%.

**Pattern 3: Network Redesign for E-Commerce Fulfillment**

A retailer operates 2 DCs (East/West Coast) with average delivery of 4.2 days. E-commerce growth requires 2-day delivery for 90% of orders. Action: (1) Model demand heat map by zip code, (2) Add 3 regional fulfillment centers in Midwest, Southeast, Southwest, (3) Implement distributed order management (DOM) with intelligent routing, (4) Position top 500 SKUs in all 5 locations, long-tail in 2 hub DCs. Result: 2-day coverage reaches 92% of orders, average delivery drops to 1.8 days, transportation cost per order decreases 12% despite added facilities.

### Output Formats

**Executive Dashboard**
Single-page visual summary with KPI scorecards (OTIF, fill rate, inventory turns, total SCM cost), trend charts for trailing 12 months, top 5 risks with status indicators, and action item tracker with owners and due dates.

**Detailed Analysis Report**
Structured document with executive summary, current state assessment with data tables, root cause analysis for underperforming metrics, recommended initiatives with business cases, implementation roadmap with Gantt timeline, and financial projections (NPV, payback period).

**Weekly Operations Brief**
Concise 1-2 page update covering: exceptions and alerts requiring action, KPI snapshot vs. target, open issues by severity, upcoming milestones, and resource/capacity constraints for the coming week.
