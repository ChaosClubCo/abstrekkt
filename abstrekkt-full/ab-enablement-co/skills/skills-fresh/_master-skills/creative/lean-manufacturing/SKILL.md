---
name: lean-manufacturing
description: Comprehensive guidance for lean manufacturing including waste identification and elimination, value stream mapping, continuous improvement methodologies, pull systems, standard work, visual management, and operational excellence. Use when designing, creating, or reviewing creative deliverables.
---

# Lean Manufacturing Skill

> Continuous improvement, waste elimination, value stream optimization, and operational excellence

## Description

This skill provides comprehensive guidance for lean manufacturing including waste identification and elimination, value stream mapping, continuous improvement methodologies, pull systems, standard work, visual management, and operational excellence. It covers the Toyota Production System principles, Lean Six Sigma integration, and practical implementation across manufacturing and service operations.

## Activation Triggers

- User mentions "lean manufacturing", "lean production", "Toyota Production System"
- User asks about waste elimination or muda
- User needs help with continuous improvement or kaizen
- User discusses value stream mapping or VSM
- User asks about 5S or visual management
- User mentions kanban or pull systems
- User needs standard work or work standardization
- User asks about operational excellence or process improvement

## Instructions

### Core Workflow

1. **Assessment**
   - Map current state
   - Identify waste
   - Analyze value streams
   - Determine improvement priorities
   - Establish baseline metrics

2. **Implementation**
   - Design future state
   - Implement improvements
   - Establish standard work
   - Deploy visual management
   - Train employees

3. **Sustainment**
   - Monitor performance
   - Conduct daily management
   - Drive continuous improvement
   - Develop lean culture
   - Scale successes

### Lean Principles Framework

```yaml
lean_principles:
  core_concepts:
    value:
      definition: "What the customer is willing to pay for"
      determination:
        - Customer voice
        - Market requirements
        - Value-added analysis
        - Willingness to pay

    value_stream:
      definition: "All activities to deliver product/service"
      scope:
        - Information flow
        - Material flow
        - Process steps
        - Lead times

    flow:
      definition: "Smooth, uninterrupted movement"
      elements:
        - Eliminate batching
        - Reduce wait times
        - Balance workloads
        - Remove bottlenecks

    pull:
      definition: "Produce only what is needed"
      methods:
        - Kanban systems
        - Supermarkets
        - FIFO lanes
        - Sequenced pull

    perfection:
      definition: "Continuous pursuit of ideal state"
      approach:
        - Continuous improvement
        - Problem solving
        - Employee engagement
        - Never satisfied

  toyota_production_system:
    pillars:
      just_in_time:
        - Takt time
        - Continuous flow
        - Pull system
        - Quick changeover

      jidoka:
        - Build in quality
        - Stop and fix
        - Andon systems
        - Error proofing

    foundation:
      - Heijunka (leveling)
      - Standardized work
      - Kaizen
      - Stability
```

### Eight Wastes (DOWNTIME)

```yaml
wastes:
  defects:
    definition: "Products/services not meeting specifications"
    examples:
      - Rework
      - Scrap
      - Returns
      - Corrections
    countermeasures:
      - Error proofing (poka-yoke)
      - Standard work
      - Quality at source
      - SPC

  overproduction:
    definition: "Making more than needed or before needed"
    examples:
      - Building to forecast vs. order
      - Batch processing
      - Just-in-case production
    countermeasures:
      - Pull systems
      - Kanban
      - Level production
      - Takt time adherence

  waiting:
    definition: "Idle time between operations"
    examples:
      - Queue time
      - Equipment downtime
      - Unbalanced workload
      - Material shortages
    countermeasures:
      - Line balancing
      - TPM
      - Cross-training
      - Flow cells

  non_utilized_talent:
    definition: "Not using people's skills and ideas"
    examples:
      - Limited employee input
      - Underutilized skills
      - No improvement process
    countermeasures:
      - Kaizen involvement
      - Suggestion systems
      - Cross-functional teams
      - Training and development

  transportation:
    definition: "Unnecessary movement of materials"
    examples:
      - Multiple handling
      - Long travel distances
      - Poor layout
    countermeasures:
      - Layout optimization
      - Point-of-use storage
      - Cellular manufacturing
      - Value stream design

  inventory:
    definition: "Excess materials, WIP, or finished goods"
    examples:
      - Safety stock
      - Large batch sizes
      - Obsolete inventory
    countermeasures:
      - Pull systems
      - Reduced batch sizes
      - Quick changeover
      - Supplier integration

  motion:
    definition: "Unnecessary movement of people"
    examples:
      - Reaching
      - Walking
      - Searching
      - Bending
    countermeasures:
      - Workplace organization
      - Ergonomic design
      - Point-of-use tools
      - 5S implementation

  extra_processing:
    definition: "Work beyond customer requirements"
    examples:
      - Over-engineering
      - Multiple approvals
      - Redundant inspections
      - Unnecessary features
    countermeasures:
      - Voice of customer
      - Value analysis
      - Process simplification
      - Standard work
```

### Value Stream Mapping

```yaml
value_stream_mapping:
  preparation:
    scope:
      - Product family selection
      - Boundaries definition
      - Team formation
      - Data gathering

    information_needed:
      - Process steps
      - Cycle times
      - Changeover times
      - Inventory levels
      - Uptime/availability
      - Number of operators
      - Batch sizes
      - Lead times

  current_state_map:
    elements:
      process_boxes:
        - Process name
        - Cycle time
        - Changeover time
        - Uptime
        - Number of operators

      data_boxes:
        - Inventory quantities
        - Lead time calculation
        - Value-added time

      information_flow:
        - Customer demand
        - Forecasts and orders
        - Production scheduling
        - Supplier communication

      material_flow:
        - Incoming materials
        - WIP inventory
        - Finished goods
        - Shipping

    timeline:
      - Production lead time
      - Processing time
      - Value-added ratio

  future_state_design:
    questions:
      - What is takt time?
      - Where can we flow?
      - Where is pull needed?
      - What is the pacemaker?
      - How do we level production?
      - What improvements are needed?

    lean_concepts:
      - Continuous flow where possible
      - Supermarkets where flow not possible
      - Pace production to takt time
      - Level the production mix
      - Level production volume
      - Pull from upstream processes

  implementation_plan:
    loops:
      - Pacemaker loop
      - Additional loops
      - Supplier loops

    kaizen_bursts:
      - Identified improvements
      - Prioritized actions
      - Implementation timeline
      - Responsible parties
```

### 5S Workplace Organization

```yaml
five_s:
  sort:
    japanese: "Seiri"
    purpose: "Remove unnecessary items"
    activities:
      - Red tag items not needed
      - Dispose of unneeded items
      - Relocate items used infrequently
      - Keep only what is needed
    criteria:
      - Frequency of use
      - Quantity needed
      - Condition of items

  set_in_order:
    japanese: "Seiton"
    purpose: "Organize remaining items"
    activities:
      - Designate locations
      - Label everything
      - Use visual indicators
      - Apply ergonomic principles
    principles:
      - A place for everything
      - Everything in its place
      - Easy to find
      - Easy to return

  shine:
    japanese: "Seiso"
    purpose: "Clean and inspect"
    activities:
      - Daily cleaning routines
      - Equipment inspection
      - Identify abnormalities
      - Eliminate contamination sources
    benefits:
      - Cleaner workplace
      - Earlier problem detection
      - Better equipment care
      - Pride in workplace

  standardize:
    japanese: "Seiketsu"
    purpose: "Create consistent practices"
    activities:
      - Document standards
      - Create visual controls
      - Assign responsibilities
      - Schedule activities
    tools:
      - 5S checklists
      - Standard work
      - Visual management
      - Color coding

  sustain:
    japanese: "Shitsuke"
    purpose: "Maintain and improve"
    activities:
      - Regular audits
      - Management support
      - Employee engagement
      - Continuous improvement
    methods:
      - 5S audit schedule
      - Recognition programs
      - Training refreshers
      - Leadership gemba walks

  implementation:
    phases:
      - Pilot area selection
      - Team training
      - Initial 5S event
      - Audit and sustain
      - Expand to other areas

    success_factors:
      - Leadership commitment
      - Employee involvement
      - Visual standards
      - Regular audits
      - Recognition
```

### Standard Work

```yaml
standard_work:
  definition: "Current best practice documented and followed"

  elements:
    takt_time:
      calculation: "Available time / Customer demand"
      purpose:
        - Set production pace
        - Balance workload
        - Determine staffing

    work_sequence:
      documentation:
        - Sequence of operations
        - Key quality checks
        - Safety points
        - Timing for each element

    standard_wip:
      purpose:
        - Minimum WIP needed for flow
        - Consistent process
        - Predictable output

  documentation:
    standardized_work_chart:
      - Layout diagram
      - Work sequence
      - Takt time/cycle time
      - Quality checks
      - Safety symbols

    work_combination_table:
      - Manual time
      - Walk time
      - Machine time
      - Wait time
      - Total cycle time

    work_instruction:
      - Step-by-step procedure
      - Photos/illustrations
      - Key points
      - Reasons why

  implementation:
    process:
      - Observe current state
      - Document best method
      - Train operators
      - Audit compliance
      - Improve and update

    kaizen_relationship:
      - Standard work as baseline
      - Kaizen to improve
      - New standard from improvement
      - Repeat cycle
```

### Kanban and Pull Systems

```yaml
pull_systems:
  kanban_types:
    production_kanban:
      purpose: "Signal to produce"
      information:
        - Part number
        - Quantity
        - Source location
        - Destination

    withdrawal_kanban:
      purpose: "Signal to move"
      information:
        - Part number
        - Quantity
        - Source supermarket
        - Destination

    signal_kanban:
      purpose: "Batch production trigger"
      use: "When changeover required"

  kanban_calculation:
    formula: "D x LT x (1 + SF) / Container size"
    variables:
      D: "Daily demand"
      LT: "Lead time (replenishment)"
      SF: "Safety factor"

  supermarket:
    design:
      - Location selection
      - SKU positioning
      - Visual indicators
      - Replenishment rules

    management:
      - Min/max levels
      - FIFO enforcement
      - Regular review
      - Continuous sizing

  implementation:
    steps:
      - Calculate demand
      - Determine container sizes
      - Calculate kanban quantities
      - Design supermarket
      - Create kanban cards
      - Train employees
      - Monitor and adjust

    rules:
      - Only produce with kanban
      - Standard quantities
      - No defects passed
      - Reduce kanban gradually
```

### Kaizen and Continuous Improvement

```yaml
kaizen:
  philosophy:
    principles:
      - Small incremental improvements
      - Everyone involved
      - Low cost, high impact
      - Process focused
      - Never satisfied

    types:
      point_kaizen:
        - Individual improvements
        - Quick implementation
        - Local impact

      system_kaizen:
        - Value stream improvements
        - Cross-functional
        - Larger scope

      kaikaku:
        - Breakthrough improvement
        - Radical change
        - Transformational

  kaizen_event:
    structure:
      preparation:
        - Scope definition
        - Team selection
        - Data gathering
        - Logistics planning

      event_week:
        day_1: "Training and current state"
        day_2: "Analysis and design"
        day_3: "Implementation"
        day_4: "Implementation and testing"
        day_5: "Standardize and present"

      follow_up:
        - 30-day action items
        - Sustainment audits
        - Results tracking

    deliverables:
      - Implemented improvements
      - Standard work documentation
      - Visual management
      - Training materials
      - Sustainment plan

  daily_kaizen:
    practices:
      - Suggestion systems
      - Problem solving
      - Gemba walks
      - Stand-up meetings
      - Improvement boards

    a3_problem_solving:
      sections:
        - Background
        - Current condition
        - Goal/target
        - Root cause analysis
        - Countermeasures
        - Implementation plan
        - Follow-up
```

### Visual Management

```yaml
visual_management:
  purpose:
    - Make abnormalities visible
    - Enable quick decisions
    - Share information
    - Drive accountability

  types:
    visual_workplace:
      - Floor markings
      - Location indicators
      - Shadow boards
      - Color coding

    visual_display:
      - Performance boards
      - Production status
      - Quality metrics
      - Safety information

    visual_control:
      - Kanban cards
      - Andon lights
      - Min/max indicators
      - Reorder points

    visual_guarantee:
      - Poka-yoke devices
      - Error-proofing
      - Automated stops

  implementation:
    production_boards:
      elements:
        - Hourly targets
        - Actual production
        - Variance tracking
        - Issue logging
        - Countermeasures

    andon_system:
      states:
        green: "Normal operation"
        yellow: "Attention needed"
        red: "Line stopped"

      response:
        - Visual signal
        - Audio alert
        - Supervisor response
        - Problem resolution

    performance_metrics:
      display:
        - Safety
        - Quality
        - Delivery
        - Cost
        - Morale
```

### Total Productive Maintenance Integration

```yaml
tpm_integration:
  pillars:
    autonomous_maintenance:
      - Operator ownership
      - Basic maintenance tasks
      - Cleaning as inspection
      - Early problem detection

    planned_maintenance:
      - Preventive schedules
      - Predictive methods
      - Maintenance standards
      - Spare parts management

    focused_improvement:
      - Equipment losses
      - Chronic problems
      - Kaizen activities

    quality_maintenance:
      - Zero defects
      - Equipment conditions
      - Process parameters

  oee:
    calculation:
      formula: "Availability x Performance x Quality"

      availability:
        formula: "(Operating time - Downtime) / Operating time"
        losses:
          - Breakdowns
          - Changeovers
          - Adjustments

      performance:
        formula: "Actual output / Theoretical output"
        losses:
          - Minor stops
          - Reduced speed

      quality:
        formula: "Good units / Total units"
        losses:
          - Defects
          - Rework
          - Startup losses

    world_class: "85%+ OEE"

  quick_changeover:
    smed_steps:
      - Observe current changeover
      - Separate internal/external
      - Convert internal to external
      - Streamline all elements
      - Document and train

    targets:
      - Single-digit minutes (<10 min)
      - One-touch setup
      - Zero changeover
```

### Lean Metrics and KPIs

```yaml
metrics:
  operational:
    lead_time:
      - Total lead time
      - Value-added time
      - Value-added ratio

    productivity:
      - Units per labor hour
      - Revenue per employee
      - Throughput rate

    quality:
      - First pass yield
      - Defect rate
      - Customer complaints

    delivery:
      - On-time delivery
      - Lead time reliability
      - Order fill rate

  lean_specific:
    inventory:
      - Inventory turns
      - Days of inventory
      - WIP levels

    flow:
      - Cycle time
      - Takt time adherence
      - Changeover time

    space:
      - Output per square foot
      - Travel distance
      - Space utilization

  improvement:
    kaizen:
      - Suggestions submitted
      - Suggestions implemented
      - Employee participation
      - Kaizen events completed

    sustainment:
      - 5S audit scores
      - Standard work adherence
      - Visual management compliance
```

## Output Format

### Lean Assessment Report
```markdown
# Lean Assessment: [Area/Value Stream]

## Current State Summary
- Lead Time: [Days]
- Value-Added Time: [Hours]
- VA Ratio: [%]
- Inventory Turns: [X]

## Waste Identification
| Waste Type | Examples Found | Impact | Priority |
|------------|----------------|--------|----------|
| [Waste] | [Examples] | [H/M/L] | [1-8] |

## Value Stream Metrics
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Lead Time | [Days] | [Days] | [%] |
| Cycle Time | [Min] | [Min] | [%] |
| FPY | [%] | [%] | [%] |
| OEE | [%] | [%] | [%] |

## Improvement Opportunities
| Opportunity | Lean Tool | Expected Benefit | Effort |
|-------------|-----------|------------------|--------|
| [Opportunity] | [Tool] | [Benefit] | [H/M/L] |

## Implementation Roadmap
| Phase | Activities | Timeline | Owner |
|-------|------------|----------|-------|
| [Phase] | [Activities] | [Weeks] | [Name] |

## Quick Wins
1. [Quick win with immediate impact]
2. [Quick win with immediate impact]

## Recommendations
1. [Priority recommendation]
2. [Supporting recommendation]
```

## Integration Points

- MES (Manufacturing Execution Systems)
- ERP systems
- Quality management systems
- Maintenance management (CMMS)
- Performance dashboards
- Training management
- Document control
- Visual management boards
- Continuous improvement software

## Best Practices

1. **Leadership Commitment**: Leaders must drive and model lean behaviors
2. **Respect for People**: Engage and develop employees
3. **Go to Gemba**: See actual conditions at the workplace
4. **Start Small**: Pilot in focused areas before expansion
5. **Standard Work Foundation**: Establish standards before improving
6. **Visual Management**: Make problems visible immediately
7. **Problem Solving Culture**: Address root causes, not symptoms
8. **Continuous Learning**: Never stop improving and learning

## Common Pitfalls

- Tools without philosophy
- Lack of leadership engagement
- Skipping the current state
- Implementing without sustaining
- Ignoring people development
- Event-based vs. daily kaizen
- Unrealistic expectations
- Poor metric selection
- Blame culture
- Complexity over simplicity

## Version History

- 1.0.0: Initial lean manufacturing skill
- 1.0.1: Added TPM integration
- 1.0.2: Enhanced value stream mapping
