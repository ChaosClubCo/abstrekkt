---
name: production-planning
description: Helps manage and audit production planning processes. Comprehensive guidance for production planning and control including master production scheduling, material requirements planning (MRP), capacity planning, shop floor scheduling, and production execution. Covers discrete, process, and repetitive manufacturing environments. Use when navigating industry-specific regulations, processes, or operations.
---

# Production Planning Skill

> Production scheduling, capacity planning, and MRP operations

## Description

This skill provides comprehensive guidance for production planning and control including master production scheduling, material requirements planning (MRP), capacity planning, shop floor scheduling, and production execution. It covers discrete, process, and repetitive manufacturing environments.

## Activation Triggers

- User mentions "production planning", "scheduling", "MRP"
- User asks about capacity planning or load leveling
- User needs help with master production schedule
- User discusses manufacturing orders or work orders
- User asks about production control or execution
- User mentions lean production or just-in-time
- User needs demand-supply balancing

## Instructions

### Core Workflow

1. **Demand Planning**
   - Collect demand forecasts
   - Analyze customer orders
   - Develop demand plan
   - Reconcile with capacity
   - Finalize production targets

2. **Production Scheduling**
   - Create master schedule
   - Run MRP
   - Plan capacity
   - Schedule operations
   - Release orders

3. **Execution and Control**
   - Execute production orders
   - Monitor progress
   - Handle exceptions
   - Report completion
   - Analyze performance

### Production Planning Hierarchy

```yaml
planning_hierarchy:
  strategic:
    time_frame: "1-5 years"
    level: "Aggregate planning"
    decisions:
      - Capacity investments
      - Facility planning
      - Product portfolio

  tactical:
    time_frame: "3-18 months"
    level: "S&OP / Aggregate"
    decisions:
      - Production rates
      - Workforce levels
      - Inventory targets
      - Make vs buy

  operational:
    time_frame: "Weeks to months"
    level: "MPS / MRP"
    decisions:
      - Master schedule
      - Material requirements
      - Capacity allocation

  execution:
    time_frame: "Days to weeks"
    level: "Shop floor"
    decisions:
      - Work order sequencing
      - Resource assignment
      - Priority dispatching
```

### Master Production Scheduling

```yaml
mps:
  purpose: "Bridge between demand and supply"

  inputs:
    - Demand forecast
    - Customer orders
    - Inventory status
    - Available capacity
    - Policy constraints

  outputs:
    - Production quantities by period
    - Available-to-promise (ATP)
    - Projected inventory
    - Capacity requirements

  process:
    - Review demand
    - Check capacity constraints
    - Level load
    - Finalize schedule
    - Communicate plan

  time_fences:
    frozen:
      period: "0-2 weeks"
      changes: "Emergency only"

    slushy:
      period: "3-8 weeks"
      changes: "Approved changes"

    liquid:
      period: "Beyond 8 weeks"
      changes: "Flexible"

  metrics:
    - MPS adherence
    - Schedule changes
    - Customer service level
    - Inventory turns
```

### Material Requirements Planning

```yaml
mrp:
  inputs:
    master_production_schedule: "What to make, when"
    bill_of_materials: "Components needed"
    inventory_status: "What's on hand/order"
    lead_times: "Time to procure/produce"

  outputs:
    planned_orders:
      - Purchase requisitions
      - Manufacturing orders
      - Transfer orders

    action_messages:
      - Release order
      - Expedite
      - De-expedite
      - Cancel

  logic:
    gross_requirements: "MPS + dependent demand"
    scheduled_receipts: "Open orders"
    projected_available: "Inventory balance"
    net_requirements: "What's needed"
    planned_order_releases: "When to order"

  parameters:
    - Lead time
    - Lot sizing rule
    - Safety stock
    - Order quantity
    - Scrap factor

  lot_sizing:
    - Lot-for-lot (L4L)
    - Fixed order quantity (FOQ)
    - Economic order quantity (EOQ)
    - Period order quantity (POQ)
    - Least unit cost (LUC)
    - Least total cost (LTC)
```

### Capacity Planning

```yaml
capacity_planning:
  levels:
    rough_cut:
      purpose: "Validate MPS feasibility"
      method: "Resource profiles"
      horizon: "Months"

    capacity_requirements:
      purpose: "Detailed capacity needs"
      method: "MRP-driven"
      horizon: "Weeks"

    finite_scheduling:
      purpose: "Shop floor scheduling"
      method: "Constraint-based"
      horizon: "Days"

  calculations:
    available_capacity:
      formula: "Working time x Efficiency x Utilization"
      components:
        - Calendar/shifts
        - Planned downtime
        - Efficiency factor
        - Utilization factor

    required_capacity:
      formula: "Standard hours x (1 + scrap factor)"
      sources:
        - Routing operations
        - Setup time
        - Run time

  management:
    capacity_options:
      - Overtime
      - Additional shifts
      - Subcontracting
      - Cross-training
      - Equipment investment

    demand_options:
      - Backlog orders
      - Safety stock adjustment
      - Promotional timing
      - Substitute products
```

### Shop Floor Scheduling

```yaml
shop_floor:
  scheduling:
    forward:
      - Schedule from current date
      - Earliest completion date
      - May exceed due date

    backward:
      - Schedule from due date
      - Latest start date
      - May start in past

    finite:
      - Respect capacity limits
      - Queue management
      - Bottleneck focus

  dispatching_rules:
    fifo: "First in, first out"
    edd: "Earliest due date"
    spt: "Shortest processing time"
    cr: "Critical ratio"
    slack: "Least slack time"
    priority: "Priority-based"

  work_order:
    elements:
      - Order number
      - Item/part number
      - Quantity
      - Due date
      - Routing
      - Materials

    status:
      - Released
      - In process
      - Partially complete
      - Complete
      - Closed

  tracking:
    - Operation completion
    - Material consumption
    - Labor reporting
    - Scrap reporting
    - Move transactions
```

### Lean Production

```yaml
lean:
  principles:
    - Specify value
    - Map value stream
    - Create flow
    - Establish pull
    - Pursue perfection

  tools:
    kanban:
      - Visual signals
      - Pull replenishment
      - WIP limits
      - Supermarket concept

    heijunka:
      - Production leveling
      - Mixed-model scheduling
      - Takt time pacing

    cell_manufacturing:
      - Work cells
      - One-piece flow
      - Flexible workforce
      - U-shaped layout

  takt_time:
    formula: "Available time / Customer demand"
    application:
      - Line balancing
      - Staffing decisions
      - Pace setting

  just_in_time:
    - Produce what's needed
    - When it's needed
    - In quantity needed
    - Minimize inventory
```

### Production Metrics

```yaml
metrics:
  schedule_performance:
    - Schedule adherence
    - On-time delivery
    - Past due orders
    - Lead time

  efficiency:
    - OEE (Overall Equipment Effectiveness)
      availability: "Run time / Planned time"
      performance: "Actual / Standard output"
      quality: "Good units / Total units"

    - Labor productivity
    - Machine utilization
    - Yield

  inventory:
    - WIP levels
    - Inventory turns
    - Days of supply
    - Obsolescence

  flexibility:
    - Changeover time
    - Mix flexibility
    - Volume flexibility
```

### Production Control

```yaml
control:
  monitoring:
    - Real-time tracking
    - Status visibility
    - Exception alerts
    - Progress reporting

  exception_handling:
    - Material shortages
    - Machine breakdowns
    - Quality issues
    - Labor absence
    - Rush orders

  rescheduling:
    - Impact assessment
    - Priority evaluation
    - Alternative plans
    - Communication

  reporting:
    - Production output
    - Efficiency reports
    - Quality reports
    - Downtime analysis
```

### Bill of Materials

```yaml
bom:
  types:
    engineering: "As designed"
    manufacturing: "As built"
    planning: "For planning purposes"
    phantom: "Non-stocked subassembly"

  structure:
    - Parent/child relationship
    - Quantity per
    - Unit of measure
    - Scrap factor
    - Effectivity dates

  management:
    - Revision control
    - Engineering changes
    - Configuration management
    - BOM accuracy
```

## Output Format

### Production Schedule Report
```markdown
# Production Schedule: [Period]

## Schedule Summary
| Metric | Value |
|--------|-------|
| Planned Orders | [#] |
| Scheduled Hours | [Hours] |
| Capacity Utilization | [%] |

## Master Schedule
| Item | Week 1 | Week 2 | Week 3 | Week 4 |
|------|--------|--------|--------|--------|
| [Product] | [Qty] | [Qty] | [Qty] | [Qty] |

## Capacity Analysis
| Work Center | Required | Available | Load % |
|-------------|----------|-----------|--------|
| [WC] | [Hours] | [Hours] | [%] |

## Material Status
| Material | Required | Available | Shortage |
|----------|----------|-----------|----------|
| [Material] | [Qty] | [Qty] | [Qty] |

## Action Items
| Action | Item | Quantity | Due Date |
|--------|------|----------|----------|
| [Release/Expedite] | [Item] | [Qty] | [Date] |

## Risks and Issues
| Issue | Impact | Mitigation |
|-------|--------|------------|
| [Issue] | [High/Med/Low] | [Action] |
```

## Integration Points

- ERP systems (SAP, Oracle, Infor)
- Manufacturing Execution Systems (MES)
- Advanced Planning Systems (APS)
- Shop floor control systems
- Quality management systems
- Inventory management
- Procurement systems
- Warehouse management

## Best Practices

1. **Demand Driven**: Start with accurate demand
2. **Capacity Reality**: Plan within capacity constraints
3. **BOM Accuracy**: Maintain accurate BOMs (99%+)
4. **Inventory Accuracy**: High inventory accuracy (95%+)
5. **Lead Time Accuracy**: Realistic lead times
6. **Flexibility**: Build in schedule flexibility
7. **Communication**: Clear production priorities
8. **Continuous Improvement**: Regular process refinement

## Common Pitfalls

- Ignoring capacity constraints
- Inaccurate data (BOM, inventory, routing)
- Over-promising lead times
- Too many schedule changes
- Inadequate safety stock
- Poor exception handling
- Lack of visibility
- Siloed planning

## Version History

- 1.0.0: Initial production planning skill
- 1.0.1: Added lean production section
- 1.0.2: Enhanced capacity planning
