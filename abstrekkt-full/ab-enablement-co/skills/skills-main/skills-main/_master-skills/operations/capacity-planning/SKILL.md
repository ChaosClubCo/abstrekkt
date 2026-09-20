---
name: capacity-planning
description: Plan and manage organizational capacity across infrastructure, workforce, and production systems using demand forecasting, utilization analysis, and scalability modeling to prevent bottlenecks and optimize resource allocation. Use when managing, optimizing, or automating operational workflows.
---

# Capacity Planning

> Right-size every resource to meet demand without waste or shortfall

## Description

Capacity planning is the disciplined process of determining the production capacity needed to meet changing demand for products, services, or infrastructure. This skill covers demand forecasting, resource utilization analysis, bottleneck identification, scalability modeling, and capacity investment decision-making across technology, workforce, and physical infrastructure domains. It applies queuing theory, simulation modeling, and trend analysis to predict when capacity thresholds will be breached and what interventions are needed. Practitioners use this skill to balance the cost of excess capacity against the risk of insufficient capacity, ensuring operations can scale smoothly while maintaining target service levels.

## Activation Triggers

- "Forecast server capacity needs for the next 12 months"
- "Identify production bottlenecks limiting our throughput"
- "Plan workforce capacity for seasonal demand fluctuations"
- "Determine when we need to add manufacturing capacity"
- "Model the impact of a 50% traffic increase on our infrastructure"
- "Optimize resource allocation across competing projects"
- "Build a capacity planning model for our data center"
- "Assess whether our contact center can handle holiday volumes"
- "Create a capacity buffer strategy that balances cost and risk"
- "Design auto-scaling rules for cloud infrastructure"
- "Evaluate build vs. buy for additional production capacity"

## Instructions

### Core Workflow

**Step 1: Demand Analysis**
- Collect historical demand data: volume, patterns, growth rates, seasonality
- Identify demand drivers: business growth, new products, marketing campaigns, external factors
- Build demand forecast models: time series, regression, or judgment-based for new scenarios
- Create demand scenarios: base case, best case (P90), worst case (P10), and black swan
- Validate forecasts against business plans, sales pipeline, and market intelligence

**Step 2: Current Capacity Assessment**
- Inventory all capacity resources: compute, storage, network, people, equipment, space
- Measure current utilization rates across all resource types
- Identify effective capacity vs. theoretical maximum (accounting for maintenance, overhead)
- Map capacity dependencies and shared resources across services or product lines
- Calculate headroom: (Maximum capacity - Current demand) / Maximum capacity

**Step 3: Gap Analysis and Modeling**
- Project capacity demand curves using forecast scenarios over planning horizon
- Overlay capacity supply curves including planned additions and retirements
- Identify crossover points where demand exceeds capacity by resource type
- Model queuing effects: as utilization exceeds 70-80%, response times increase exponentially
- Quantify the cost of capacity shortfall: lost revenue, SLA breaches, overtime, expediting

**Step 4: Capacity Strategy**
- Define target utilization ranges by resource type (avoid both waste and saturation)
- Evaluate capacity options: scale up, scale out, optimize existing, outsource, defer
- Build business cases for capacity investments with ROI and payback analysis
- Design capacity buffers calibrated to demand variability and lead time for new capacity
- Create phased capacity addition plan aligned with demand growth trajectory

**Step 5: Monitoring and Adjustment**
- Deploy capacity monitoring dashboards with trend lines and threshold alerts
- Track forecast accuracy and adjust models based on actual vs. predicted demand
- Review capacity plan quarterly against updated demand signals
- Trigger capacity procurement when lead-time-adjusted thresholds are reached
- Conduct annual capacity strategy review with technology and business stakeholders

### Capacity Planning KPI Framework

**Utilization and Efficiency Metrics**

| KPI | Formula | Target Range | Warning Threshold |
|---|---|---|---|
| Resource Utilization | Actual usage / Available capacity | 60-80% | > 85% sustained |
| Effective Capacity | Theoretical max x Efficiency factor | Benchmark by type | Below design spec |
| OEE (Overall Equipment Effectiveness) | Availability x Performance x Quality | > 85% (world class) | < 65% |
| Throughput Rate | Units produced / Time period | Meet demand plan | < 95% of demand |
| Queue Depth | Items waiting / Processing rate | < 2x average | > 5x average |
| Lead Time | End-to-end processing time | Within SLA | > 120% of SLA |

**Planning Accuracy Metrics**

| KPI | Formula | Target | Frequency |
|---|---|---|---|
| Forecast Accuracy | 1 - (ABS(Actual - Forecast) / Actual) | > 80% | Monthly |
| Capacity Plan Variance | (Planned capacity - Actual need) / Actual need | +/- 15% | Quarterly |
| Budget Accuracy | Actual capacity spend / Planned spend | 90-110% | Quarterly |
| Lead Time Compliance | Capacity delivered on time / Total capacity adds | > 95% | Per event |

**Queuing Theory Reference**

Utilization vs. Wait Time (M/M/1 queue model):
- 50% utilization: Wait time = 1x service time
- 70% utilization: Wait time = 2.3x service time
- 80% utilization: Wait time = 4x service time
- 90% utilization: Wait time = 9x service time
- 95% utilization: Wait time = 19x service time

Key insight: Response time degrades exponentially as utilization approaches 100%. Plan capacity to keep sustained utilization below 80% for latency-sensitive workloads.

### Capacity Modeling Framework

**Capacity Planning Methods**

| Method | Best For | Approach | Accuracy |
|---|---|---|---|
| Trend Extrapolation | Stable, gradual growth | Extend historical growth curve | Moderate |
| Regression Modeling | Demand driven by known variables | Correlate capacity need with business drivers | Good |
| Simulation | Complex systems with dependencies | Model interactions and queuing effects | High |
| Benchmarking | New systems without history | Use industry or vendor reference architectures | Moderate |
| Stress Testing | Validating actual limits | Load test to determine real capacity ceiling | High |

**Scalability Assessment Checklist**

- [ ] Identify the primary constraint (CPU, memory, I/O, network, people, equipment)
- [ ] Determine if constraint scales linearly or has diminishing returns
- [ ] Measure overhead of adding capacity (coordination cost, management tax)
- [ ] Test horizontal scaling: does adding units proportionally increase throughput?
- [ ] Test vertical scaling: does upgrading units proportionally increase throughput?
- [ ] Identify hard limits: license caps, physical space, regulatory maximums
- [ ] Calculate scaling lead time: procurement, provisioning, training, ramp-up
- [ ] Determine minimum viable increment (smallest useful capacity addition)
- [ ] Assess elastic vs. fixed capacity options for variable demand patterns
- [ ] Document scaling runbook with step-by-step procedures and validation tests

**Capacity Buffer Strategy**

| Demand Variability | Buffer Size | Rationale |
|---|---|---|
| Low (CV < 0.2) | 10-15% above peak | Predictable demand, small buffer sufficient |
| Medium (CV 0.2-0.5) | 15-25% above peak | Moderate variability needs more headroom |
| High (CV > 0.5) | 25-40% above peak | Unpredictable demand requires significant buffer |
| Critical service (any CV) | Add 10% to above | SLA penalties and revenue impact justify extra cost |

CV = Coefficient of Variation (standard deviation / mean)

### Templates

**Template 1: Capacity Planning Workbook**

```
CAPACITY PLANNING WORKBOOK
Resource: [Type] | Planning Horizon: [12/24/36 months] | Updated: [Date]

CURRENT STATE
Total Capacity: [X] units | Current Demand: [X] units | Utilization: [X]%
Effective Capacity (after maintenance/overhead): [X] units ([X]% of theoretical)
Current Headroom: [X] units ([X]%) | At current growth rate, exhausted by: [Date]

DEMAND FORECAST
| Period | Base Case | Best Case | Worst Case | Planned Capacity | Headroom |
|--------|-----------|-----------|------------|------------------|----------|
| Q1 FY[X] | [X] | [X] | [X] | [X] | [X]% |
| Q2 FY[X] | [X] | [X] | [X] | [X] | [X]% |
| Q3 FY[X] | [X] | [X] | [X] | [X] | [X]% |
| Q4 FY[X] | [X] | [X] | [X] | [X] | [X]% |

CAPACITY ACTIONS
| Action | Capacity Added | Lead Time | Cost | Trigger Point | Decision Date |
|--------|---------------|-----------|------|---------------|---------------|
| [Scale existing] | +[X] units | [X] weeks | $[X] | [X]% utilization | [Date] |
| [Add new resource] | +[X] units | [X] months | $[X] | [X]% utilization | [Date] |
| [Optimize/tune] | +[X] units | [X] weeks | $[X] | Immediate | [Date] |

ASSUMPTIONS AND RISKS
- Growth rate assumption: [X]% per quarter based on [source]
- Seasonality factor: [X]x peak vs. average in [month(s)]
- Key risk: [Description] | Impact: [X] units | Mitigation: [Action]
```

**Template 2: Bottleneck Analysis Report**

```
BOTTLENECK ANALYSIS REPORT
System/Process: [Name] | Analysis Date: [Date] | Analyst: [Name]

END-TO-END PROCESS MAP WITH CAPACITY
| Step | Resource | Capacity (units/hr) | Current Load | Utilization | Bottleneck? |
|------|----------|---------------------|--------------|-------------|-------------|
| 1. [Intake] | [Resource A] | [X] | [X] | [X]% | No |
| 2. [Process] | [Resource B] | [X] | [X] | [X]% | YES |
| 3. [Review] | [Resource C] | [X] | [X] | [X]% | No |
| 4. [Output] | [Resource D] | [X] | [X] | [X]% | No |

BOTTLENECK DETAILS
Constraint Resource: [Resource B]
Theoretical Capacity: [X] units/hour
Effective Capacity: [X] units/hour (accounting for [downtime, changeover, etc.])
Current Throughput: [X] units/hour
Gap to Demand: [X] units/hour ([X]% shortfall)

ROOT CAUSE
[Why is this resource the constraint? Equipment age, staffing, process design, etc.]

RESOLUTION OPTIONS
| Option | Capacity Gain | Cost | Timeline | Risk |
|--------|---------------|------|----------|------|
| 1. [Optimize existing] | +[X]% | $[X] | [X] weeks | Low |
| 2. [Add parallel resource] | +[X]% | $[X] | [X] months | Medium |
| 3. [Redesign process] | +[X]% | $[X] | [X] months | High |

RECOMMENDATION: [Option X] because [rationale tied to ROI and timeline]

THEORY OF CONSTRAINTS APPLICATION
1. IDENTIFY the constraint: [Resource B at Step 2]
2. EXPLOIT the constraint: [Maximize utilization, reduce changeover, eliminate waste]
3. SUBORDINATE everything else: [Pace other steps to constraint, don't overproduce]
4. ELEVATE the constraint: [Invest in additional capacity for this resource]
5. REPEAT: After resolving, identify the new constraint
```

**Template 3: Cloud Auto-Scaling Configuration**

```
AUTO-SCALING POLICY CONFIGURATION
Service: [Name] | Environment: [Prod/Stage] | Last Updated: [Date]

SCALING TARGETS
| Metric | Scale-Out Trigger | Scale-In Trigger | Cooldown |
|--------|-------------------|------------------|----------|
| CPU Utilization | > 70% for 5 min | < 40% for 15 min | 5 min |
| Memory Utilization | > 80% for 5 min | < 50% for 15 min | 5 min |
| Request Queue Depth | > 100 pending | < 20 pending | 3 min |
| Response Time (P95) | > 500ms for 3 min | < 200ms for 10 min | 5 min |

CAPACITY BOUNDS
Minimum instances: [X] (always-on baseline)
Maximum instances: [X] (cost ceiling / architecture limit)
Desired instances: [X] (normal operating level)
Scale increment: [X] instances per scaling action

SCHEDULED SCALING
| Schedule | Min Instances | Desired | Rationale |
|----------|---------------|---------|-----------|
| Weekday business hours (8am-6pm) | [X] | [X] | Peak business activity |
| Weekday off-hours | [X] | [X] | Batch processing only |
| Weekend | [X] | [X] | Minimal traffic |
| [Event: Black Friday] | [X] | [X] | 3x normal peak expected |

COST GUARDRAILS
Estimated cost at min scale: $[X]/hour
Estimated cost at max scale: $[X]/hour
Monthly budget ceiling: $[X]
Alert at: 80% of monthly budget
```

### Best Practices

- Plan capacity at least one lead-time ahead; if new servers take 8 weeks, plan 8+ weeks out
- Never target 100% utilization; response time degrades exponentially above 80% for most systems
- Use the Theory of Constraints to focus investment on the actual bottleneck, not perceived ones
- Distinguish between sustained utilization (plan for this) and peak spikes (buffer for these)
- Model capacity needs at the 95th percentile, not the average, to avoid chronic under-provisioning
- Include non-functional overhead in capacity calculations: monitoring, logging, security, backups
- Build capacity in discrete increments aligned with your minimum viable scaling unit
- Use elastic/cloud capacity for variable demand components and fixed capacity for stable baselines
- Track leading indicators (pipeline growth, user signups, order trends) not just lagging utilization
- Validate capacity models with load testing at least annually for critical systems
- Account for capacity degradation over time: hardware aging, data growth, technical debt
- Maintain a capacity risk register identifying single points of failure and concentration risks
- Communicate capacity constraints and investment needs to business stakeholders in business terms
- Always have a "break glass" plan for emergency capacity situations beyond planned scenarios
- Document capacity decisions and their rationale for future reference and organizational learning

### Common Patterns

**Pattern 1: Preventing a Holiday Season Capacity Crisis**

An e-commerce platform experienced 45-minute outages during last year's Black Friday due to database connection pool exhaustion. Current capacity handles 5,000 concurrent users; Black Friday peak is projected at 15,000. Action: (1) Load test current system to identify actual breaking point (found at 6,200 concurrent), (2) Identify bottleneck chain: connection pool (primary) -> query throughput (secondary) -> API thread pool (tertiary), (3) Implement read replicas for query distribution, increase connection pool to 500, optimize top 10 slow queries, (4) Deploy auto-scaling for API tier with pre-warmed instances, (5) Conduct full-scale load test at 20,000 concurrent to validate. Result: System handles 18,000 concurrent users with P95 response under 400ms, zero downtime during peak event.

**Pattern 2: Workforce Capacity Planning for Growth**

A professional services firm is growing revenue 30% annually but delivery capacity (consultants) grows at 15%, creating a widening gap. Current utilization is 92%, causing burnout and quality issues. Action: (1) Model demand by service line using sales pipeline weighted probability, (2) Set target utilization at 80% to allow for training, admin, and bench time, (3) Calculate required headcount: current demand / 0.80 target utilization, (4) Build hiring plan with 4-month ramp time for new consultants, (5) Identify 20% of demand suitable for contractor augmentation to handle variability. Result: Headcount plan aligned to demand forecast with 3-month lead time, utilization normalized to 82%, employee satisfaction improves, quality scores recover.

**Pattern 3: Data Center Capacity Extension Decision**

A company's primary data center is at 78% power capacity and 85% floor space with 18-month growth projections showing breach at 12 months. Action: (1) Audit current workloads: identify 25% of compute running at <20% utilization, (2) Consolidate and virtualize underutilized workloads freeing 15% power and 10% space, (3) Migrate 30% of development/test workloads to cloud, freeing additional capacity, (4) Model remaining growth: on-premises capacity now extends 28 months, (5) Begin planning for next facility with 24-month build timeline. Result: $2M cloud migration cost avoids $15M rushed data center expansion, buys 16 additional months for deliberate planning of next facility.

### Output Formats

**Capacity Planning Dashboard**
Visual display showing: utilization gauges by resource type with trend indicators, demand vs. capacity overlay charts with projection lines, bottleneck highlights with severity indicators, capacity action timeline with decision points, and cost summary (current run rate, projected, budget).

**Capacity Assessment Report**
Structured document with: executive summary of capacity posture (green/yellow/red by resource), detailed utilization analysis by system/resource, demand forecast with scenario ranges, gap analysis with crossover dates, recommended capacity actions with business cases, and risk assessment.

**Investment Decision Brief**
One-page executive summary covering: current capacity constraint and business impact, options evaluated with pros/cons/cost, recommended option with ROI calculation, timeline and dependencies, and decision required by date (driven by lead time analysis).
