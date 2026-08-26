---
name: operational-analytics
description: Helps analyze and plan operational analytics processes. Operational efficiency measurement, process optimization analysis, and performance improvement frameworks. Use when analyzing operational performance, identifying process bottlenecks, measuring efficiency metrics, conducting process optimization, or developing operational excellence programs.
---

# Operational Analytics

> Process efficiency measurement, bottleneck identification, operational excellence frameworks, and data-driven process optimization.

## Overview

Operational Analytics encompasses the systematic measurement and analysis of business operations to identify inefficiencies, optimize processes, and drive continuous improvement. This skill covers process mapping, efficiency metric design, bottleneck analysis, capacity planning, and the implementation of operational excellence frameworks that transform data into operational improvements.

Effective operational analytics provides visibility into how work actually gets done versus how it is designed to work. By measuring cycle times, throughput, quality, and resource utilization, organizations can identify waste, optimize resource allocation, and achieve sustainable cost reductions while improving service delivery.

### Why This Matters

Operational inefficiency directly erodes profitability and competitive position. Organizations with mature operational analytics capabilities consistently achieve lower costs, faster delivery, higher quality, and better customer experiences. Beyond cost savings, operational analytics enables strategic flexibility by revealing capacity constraints and optimization opportunities that inform growth and investment decisions.

## When to Use

### Primary Triggers

- Process improvement initiative launch
- Cost reduction program development
- Capacity planning and resource allocation
- Service level performance issues
- Quality improvement programs
- Operational due diligence for M&A
- Digital transformation planning

### Specific Use Cases

1. **Process Optimization**: Identifying and eliminating bottlenecks in key workflows
2. **Capacity Planning**: Determining resource requirements for demand scenarios
3. **Cost Analysis**: Understanding operational cost drivers and reduction opportunities
4. **Quality Improvement**: Root cause analysis for defects and errors
5. **Service Level Management**: Ensuring operational delivery meets commitments
6. **Workforce Planning**: Optimizing staffing levels and skill allocation

## Core Processes

### 1. Process Mapping and Measurement

**Process Mapping Framework**
```yaml
process_mapping:
  mapping_levels:
    level_1_value_stream:
      scope: "End-to-end business process"
      detail: "Major process steps and handoffs"
      purpose: "Strategic understanding, waste identification"

    level_2_process_flow:
      scope: "Single process within value stream"
      detail: "Activities, decisions, participants"
      purpose: "Process improvement, standardization"

    level_3_procedure:
      scope: "Detailed work instructions"
      detail: "Step-by-step tasks, systems, data"
      purpose: "Training, automation, compliance"

  mapping_elements:
    activities:
      types:
        - "Value-adding (transforms input)"
        - "Necessary non-value-adding (required but no value)"
        - "Waste (no value, not required)"

    flows:
      - "Material flow"
      - "Information flow"
      - "Decision points"
      - "Handoffs"

    measurements:
      - "Cycle time per step"
      - "Wait time between steps"
      - "Quality/error rates"
      - "Resource requirements"

  current_state_mapping:
    steps:
      - "Define process boundaries"
      - "Walk the process (gemba)"
      - "Document each step"
      - "Capture time measurements"
      - "Identify pain points"
      - "Note variations and exceptions"
```

**Process Metrics Framework**
```markdown
## Operational Metrics Categories

### Time Metrics
**Cycle Time**
- Definition: Total time from start to completion
- Formula: End Time - Start Time
- Application: Process speed, capacity planning

**Processing Time**
- Definition: Actual work time (excluding wait)
- Formula: Sum of active work time
- Application: Resource requirement calculation

**Wait Time**
- Definition: Time in queue or awaiting action
- Formula: Cycle Time - Processing Time
- Application: Bottleneck identification

**Lead Time**
- Definition: Time from request to delivery
- Formula: Customer request to fulfillment
- Application: Customer experience, SLA management

**Takt Time**
- Definition: Required pace to meet demand
- Formula: Available Time / Customer Demand
- Application: Capacity balancing, staffing

### Throughput Metrics
**Throughput Rate**
- Definition: Units processed per time period
- Formula: Units Completed / Time Period
- Application: Capacity measurement

**Work in Progress (WIP)**
- Definition: Items currently in process
- Application: Flow management, bottleneck detection
- Little's Law: WIP = Throughput × Cycle Time

### Quality Metrics
**First Pass Yield**
- Definition: % completed correctly first time
- Formula: Good Units / Total Units Started
- Application: Quality, rework reduction

**Defect Rate**
- Definition: Defects per unit or opportunity
- Variations: DPU, DPMO
- Application: Quality improvement

**Error Rate**
- Definition: Errors per transaction
- Application: Service quality, training needs

### Efficiency Metrics
**Process Efficiency**
- Definition: Value-add time / Total cycle time
- Target: Higher is better (often <10% in unoptimized)
- Application: Waste identification

**Resource Utilization**
- Definition: Productive time / Available time
- Target: 70-85% (balance efficiency and flexibility)
- Application: Capacity planning

**Overall Equipment Effectiveness (OEE)**
- Formula: Availability × Performance × Quality
- Application: Manufacturing, equipment-intensive processes
```

### 2. Bottleneck Analysis

**Bottleneck Identification Framework**
```yaml
bottleneck_analysis:
  theory_of_constraints:
    principle: "System throughput limited by constraint"
    steps:
      identify: "Find the constraint (bottleneck)"
      exploit: "Maximize constraint output"
      subordinate: "Align other steps to constraint"
      elevate: "Invest to increase constraint capacity"
      repeat: "Find new constraint after improvement"

  identification_methods:
    utilization_analysis:
      approach: "Highest utilization = likely bottleneck"
      calculation: "Demand / Capacity for each step"
      indicator: "Utilization >85-90%"

    wip_accumulation:
      approach: "WIP builds before bottleneck"
      observation: "Inventory/queue buildup"
      indicator: "Growing queues upstream"

    cycle_time_analysis:
      approach: "Compare actual vs. planned times"
      indicator: "Steps with largest delays"

    variability_analysis:
      approach: "High variability creates effective bottlenecks"
      measure: "Coefficient of variation in cycle time"

  bottleneck_types:
    capacity_bottleneck:
      cause: "Insufficient resource capacity"
      solutions:
        - "Add resources"
        - "Extend operating hours"
        - "Improve efficiency"
        - "Outsource"

    quality_bottleneck:
      cause: "Rework and defects slow flow"
      solutions:
        - "Error-proofing"
        - "Training"
        - "Process redesign"

    information_bottleneck:
      cause: "Waiting for approvals or data"
      solutions:
        - "Delegation of authority"
        - "System integration"
        - "Parallel processing"

    policy_bottleneck:
      cause: "Rules that constrain flow"
      solutions:
        - "Policy review"
        - "Exception processes"
        - "Automation"
```

**Queue Analysis**
```markdown
## Queuing Theory for Operations

### Basic Queue Model (M/M/1)
**Parameters**
- λ (lambda): Arrival rate
- μ (mu): Service rate
- ρ (rho): Utilization = λ/μ

**Key Formulas**
- Average items in system: L = ρ/(1-ρ)
- Average wait time: W = 1/(μ-λ)
- Probability of waiting: P(wait) = ρ

### Utilization Impact on Wait Times
| Utilization | Relative Wait Time |
|-------------|-------------------|
| 50% | 1x baseline |
| 70% | 2.3x baseline |
| 80% | 4x baseline |
| 90% | 9x baseline |
| 95% | 19x baseline |

**Insight**: Wait times increase exponentially as utilization approaches 100%

### Application
- Target utilization 70-85% for acceptable wait times
- Add capacity before hitting 85% utilization
- Consider variability (higher variability = lower target utilization)
```

### 3. Efficiency Improvement Frameworks

**Lean Operations Framework**
```yaml
lean_operations:
  core_principles:
    value:
      definition: "What customer willing to pay for"
      application: "Define value from customer perspective"

    value_stream:
      definition: "All steps to deliver value"
      application: "Map and analyze end-to-end flow"

    flow:
      definition: "Smooth movement through process"
      application: "Eliminate batching and waiting"

    pull:
      definition: "Produce only when demanded"
      application: "Reduce inventory and overproduction"

    perfection:
      definition: "Continuous improvement"
      application: "Kaizen culture and practices"

  waste_categories:
    defects: "Errors requiring rework"
    overproduction: "Making more than needed"
    waiting: "Idle time, delays"
    non_utilized_talent: "Underutilized skills"
    transportation: "Unnecessary movement of items"
    inventory: "Excess work in progress"
    motion: "Unnecessary movement of people"
    extra_processing: "More work than required"

    memory_aid: "DOWNTIME"

  improvement_tools:
    5s:
      sort: "Remove unnecessary items"
      set_in_order: "Organize remaining items"
      shine: "Clean and inspect"
      standardize: "Create consistent processes"
      sustain: "Maintain improvements"

    kaizen:
      definition: "Continuous incremental improvement"
      events: "Focused improvement workshops"
      daily: "Daily problem-solving"

    value_stream_mapping:
      current_state: "Document existing process"
      future_state: "Design improved process"
      implementation: "Plan improvements"
```

**Six Sigma Framework**
```markdown
## Six Sigma DMAIC Methodology

### Define
**Objective**: Clarify problem and goals
**Activities**
- Define problem statement
- Identify customer requirements (CTQ)
- Set project scope and goals
- Build project team
- Create project charter

**Tools**
- SIPOC diagram
- Voice of Customer
- Project charter template

### Measure
**Objective**: Quantify current performance
**Activities**
- Define metrics
- Validate measurement system
- Collect baseline data
- Calculate process capability
- Identify performance gaps

**Tools**
- Process maps
- Data collection plans
- Measurement system analysis
- Control charts

### Analyze
**Objective**: Identify root causes
**Activities**
- Analyze data for patterns
- Identify potential causes
- Validate root causes
- Quantify impact of causes

**Tools**
- Fishbone diagram
- 5 Whys
- Pareto analysis
- Regression analysis
- Hypothesis testing

### Improve
**Objective**: Develop and implement solutions
**Activities**
- Generate solution alternatives
- Evaluate and select solutions
- Pilot test solutions
- Implement improvements
- Verify improvement

**Tools**
- Brainstorming
- Solution selection matrix
- Pilot testing
- Implementation planning

### Control
**Objective**: Sustain improvements
**Activities**
- Develop control plan
- Implement controls
- Monitor performance
- Standardize processes
- Close project

**Tools**
- Control charts
- Standard work
- Training
- Documentation
```

### 4. Capacity Planning

**Capacity Planning Framework**
```yaml
capacity_planning:
  capacity_types:
    theoretical_capacity:
      definition: "Maximum output under ideal conditions"
      calculation: "24/7 operation, no downtime, peak efficiency"
      use: "Upper bound reference"

    effective_capacity:
      definition: "Realistic sustained output"
      calculation: "Theoretical - planned downtime, maintenance, breaks"
      use: "Planning basis"

    actual_output:
      definition: "What is actually produced"
      calculation: "Measured output"
      use: "Performance tracking"

  planning_horizons:
    long_term:
      timeframe: "1-5 years"
      decisions:
        - "Facility investments"
        - "Major equipment"
        - "Workforce expansion"
      approach: "Strategic, scenario-based"

    medium_term:
      timeframe: "3-18 months"
      decisions:
        - "Staffing levels"
        - "Shift structures"
        - "Subcontracting"
      approach: "Aggregate planning"

    short_term:
      timeframe: "Days to weeks"
      decisions:
        - "Scheduling"
        - "Overtime"
        - "Prioritization"
      approach: "Operational, detailed"

  demand_forecasting:
    methods:
      time_series:
        - "Moving average"
        - "Exponential smoothing"
        - "Seasonal decomposition"

      causal:
        - "Regression models"
        - "Leading indicators"

      qualitative:
        - "Expert judgment"
        - "Scenario planning"

    forecast_accuracy:
      metrics:
        - "MAPE (Mean Absolute Percentage Error)"
        - "Bias (systematic over/under)"
      improvement: "Track, analyze, refine models"
```

**Workforce Planning**
```markdown
## Workforce Capacity Planning

### Demand Analysis
1. **Volume Forecasting**
   - Historical patterns
   - Growth projections
   - Seasonality
   - Special events

2. **Work Content Analysis**
   - Time per transaction
   - Complexity mix
   - Channel mix

3. **Service Level Requirements**
   - Response time targets
   - Quality standards
   - Coverage requirements

### Capacity Calculation

**Basic Formula**
Required FTEs = (Volume × Handle Time) / (Available Hours × Utilization)

**Example**
- Monthly volume: 10,000 transactions
- Handle time: 30 minutes
- Available hours/FTE/month: 160
- Target utilization: 75%

FTEs = (10,000 × 0.5 hours) / (160 × 0.75) = 42 FTEs

### Scheduling Considerations
- Shrinkage (time away from work): 15-25%
  - PTO, sick, training, meetings, breaks
- Peak vs. average demand patterns
- Skill requirements and coverage
- Cross-training for flexibility

### Capacity Strategies

**Match Demand**
- Part-time staff for peaks
- Overtime for short-term needs
- Cross-training for flexibility

**Level Capacity**
- Steady workforce, manage queue
- Backlog management
- Service level trade-offs

**Demand Management**
- Shift demand to off-peak
- Pricing incentives
- Channel steering
```

## Tools & Templates

### Process Analysis Template
```markdown
## Process Analysis Worksheet

### Process Overview
- **Process Name**: [Name]
- **Process Owner**: [Owner]
- **Analysis Date**: [Date]
- **Scope**: [Start point] to [End point]

### Current State Metrics
| Metric | Value | Benchmark | Gap |
|--------|-------|-----------|-----|
| Cycle Time | X | Y | Z |
| Processing Time | X | Y | Z |
| Wait Time | X | Y | Z |
| First Pass Yield | X% | Y% | Z% |
| Throughput | X/day | Y/day | Z |
| WIP | X items | Y items | Z |

### Process Steps Analysis
| Step | Time | Wait | FPY | Issues |
|------|------|------|-----|--------|
| 1. [Step] | X min | X min | X% | [Issues] |
| 2. [Step] | X min | X min | X% | [Issues] |

### Bottleneck Analysis
- **Primary Bottleneck**: [Step]
- **Root Cause**: [Analysis]
- **Impact**: [Quantified impact]

### Improvement Opportunities
| Opportunity | Impact | Effort | Priority |
|-------------|--------|--------|----------|
| [Opportunity 1] | High/Med/Low | High/Med/Low | 1/2/3 |

### Recommended Actions
1. [Action with owner, timeline, expected impact]
2. [Action with owner, timeline, expected impact]
```

### Operational Dashboard Template
```yaml
operational_dashboard:
  summary_metrics:
    throughput:
      current: "[X units/day]"
      target: "[Y units/day]"
      trend: "[Up/Down/Stable]"

    cycle_time:
      current: "[X hours]"
      target: "[Y hours]"
      trend: "[Up/Down/Stable]"

    quality:
      current: "[X% FPY]"
      target: "[Y% FPY]"
      trend: "[Up/Down/Stable]"

    utilization:
      current: "[X%]"
      target: "[70-85%]"
      trend: "[Up/Down/Stable]"

  process_health:
    bottleneck_status: "[Location, severity]"
    wip_level: "[Current vs. optimal]"
    backlog: "[Size, age]"

  alerts:
    - "[Critical alert with action required]"
    - "[Warning with monitoring needed]"

  improvement_tracking:
    active_initiatives: "[Count]"
    completed_this_period: "[Count]"
    impact_realized: "[$X saved / X% improved]"
```

## Metrics & KPIs

### Operational Excellence Metrics
```yaml
operational_kpis:
  efficiency:
    process_efficiency: "Value-add time / Cycle time"
    labor_productivity: "Output / Labor hours"
    cost_per_transaction: "Total cost / Volume"
    utilization: "Productive time / Available time"

  effectiveness:
    on_time_delivery: "% delivered by due date"
    first_pass_yield: "% correct first time"
    customer_satisfaction: "Service quality rating"
    sla_compliance: "% meeting service levels"

  flow:
    cycle_time: "Average end-to-end time"
    throughput: "Units per time period"
    wip_turns: "Throughput / Average WIP"
    lead_time: "Order to delivery"

  quality:
    defect_rate: "Defects per unit"
    error_rate: "Errors per transaction"
    rework_rate: "% requiring rework"
    scrap_rate: "% scrapped"
```

## Common Pitfalls

### Operational Analytics Pitfalls

**1. Local Optimization**
- Problem: Optimizing one step while hurting overall flow
- Solution: Take system view, measure end-to-end performance
- Example: Speeding up one step increases WIP at bottleneck

**2. Over-Reliance on Averages**
- Problem: Missing variability that drives performance
- Solution: Analyze distributions, measure variability
- Example: Average cycle time masks long-tail delays

**3. Measurement Without Action**
- Problem: Dashboards without improvement initiatives
- Solution: Clear ownership, action triggers, accountability
- Integration: Connect metrics to improvement programs

**4. Ignoring Human Factors**
- Problem: Process changes fail due to adoption issues
- Solution: Change management, training, incentive alignment
- Consideration: Sustainable pace, not just maximum efficiency

**5. Short-Term Focus**
- Problem: Cutting corners today creates problems tomorrow
- Solution: Balance efficiency with sustainability
- Example: Reduced maintenance saves cost but increases breakdowns

## Integration Points

### Connected Skills
- **kpi-frameworks**: Operational KPI design and governance
- **business-dashboards**: Operational data visualization
- **forecasting-models**: Demand and capacity forecasting
- **change-management**: Process improvement implementation
- **cost-optimization**: Cost reduction through efficiency

### Data Requirements
- Process execution logs
- Time and attendance data
- Quality/defect records
- Production/transaction volumes
- Resource utilization data

### Stakeholder Applications
- Operations leadership: Performance management, resource allocation
- Finance: Cost analysis, efficiency investments
- Strategy: Capability assessment, competitive positioning
- HR: Workforce planning, training needs
- Technology: Automation prioritization, system optimization
