---
name: fleet-management
description: Comprehensive guidance for fleet management including vehicle acquisition and disposal, driver management, maintenance scheduling, fuel management, route optimization, compliance tracking, and fleet analytics. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Fleet Management Skill

> Vehicle operations, driver management, maintenance scheduling, and fleet optimization

## Description

This skill provides comprehensive guidance for fleet management including vehicle acquisition and disposal, driver management, maintenance scheduling, fuel management, route optimization, compliance tracking, and fleet analytics. It covers commercial vehicle fleets, company cars, delivery vehicles, and specialized equipment across various industries.

## Activation Triggers

- User mentions "fleet management", "vehicle fleet", "company vehicles"
- User asks about driver management or driver safety
- User needs help with vehicle maintenance scheduling
- User discusses fuel management or fuel efficiency
- User asks about route optimization or dispatch
- User mentions DOT compliance or vehicle regulations
- User needs telematics or GPS tracking guidance
- User asks about fleet cost analysis or TCO

## Instructions

### Core Workflow

1. **Fleet Planning**
   - Assess fleet requirements
   - Determine vehicle specifications
   - Plan acquisition strategy
   - Establish fleet policies
   - Define performance metrics

2. **Fleet Operations**
   - Manage daily dispatch
   - Monitor vehicle utilization
   - Track driver performance
   - Coordinate maintenance
   - Ensure compliance

3. **Fleet Optimization**
   - Analyze fleet data
   - Optimize routes
   - Reduce costs
   - Improve efficiency
   - Plan fleet renewal

### Fleet Management Framework

```yaml
fleet_management:
  planning:
    needs_assessment:
      - Business requirements
      - Vehicle specifications
      - Capacity planning
      - Growth projections
      - Budget constraints

    acquisition_strategy:
      - Purchase vs lease analysis
      - Vehicle selection criteria
      - Vendor evaluation
      - Financing options
      - Fleet size optimization

  operations:
    dispatch:
      - Order assignment
      - Route planning
      - Driver scheduling
      - Real-time tracking
      - Exception handling

    utilization:
      - Vehicle availability
      - Usage tracking
      - Pooling strategies
      - Right-sizing analysis

  lifecycle:
    acquisition:
      - Specification development
      - Procurement process
      - Upfitting/customization
      - Registration/licensing
      - Insurance setup

    operation:
      - Daily operations
      - Maintenance execution
      - Performance monitoring
      - Cost tracking

    disposal:
      - Replacement criteria
      - Remarketing strategy
      - De-fleeting process
      - Title transfer
      - Asset reconciliation
```

### Vehicle Maintenance Management

```yaml
maintenance:
  preventive:
    scheduling:
      - Time-based intervals
      - Mileage-based intervals
      - Usage-based triggers
      - Manufacturer recommendations

    categories:
      routine:
        - Oil changes
        - Filter replacements
        - Tire rotations
        - Fluid checks
        - Brake inspections

      scheduled:
        - Transmission service
        - Timing belt replacement
        - Spark plug replacement
        - Coolant flush
        - Differential service

      seasonal:
        - Winterization
        - Summer preparation
        - AC service
        - Tire changes

  predictive:
    indicators:
      - Engine diagnostics codes
      - Oil analysis results
      - Telematics data
      - Driver reports
      - Historical patterns

    technology:
      - OBD-II monitoring
      - Telematics integration
      - IoT sensors
      - AI/ML predictions

  corrective:
    process:
      - Issue identification
      - Priority assessment
      - Repair authorization
      - Vendor selection
      - Quality verification

    documentation:
      - Work orders
      - Repair history
      - Parts inventory
      - Warranty claims
      - Cost tracking

  metrics:
    - PM compliance rate
    - Repair cost per mile
    - Downtime percentage
    - Mean time between failures
    - Warranty recovery rate
```

### Driver Management

```yaml
driver_management:
  qualification:
    requirements:
      - Valid license verification
      - MVR (Motor Vehicle Record) check
      - Background screening
      - Drug/alcohol testing
      - Medical certification (CDL)

    documentation:
      - License copies
      - DOT medical cards
      - Training certificates
      - Employment authorization
      - Insurance verification

  training:
    programs:
      defensive_driving:
        - Hazard recognition
        - Space management
        - Speed management
        - Weather driving

      vehicle_specific:
        - Equipment operation
        - Loading procedures
        - Safety features
        - Pre-trip inspections

      compliance:
        - HOS regulations
        - ELD requirements
        - Hazmat handling
        - Accident procedures

  performance:
    monitoring:
      - Telematics scorecards
      - Safety events
      - Fuel efficiency
      - Customer feedback
      - On-time performance

    scoring:
      behaviors:
        - Hard braking
        - Rapid acceleration
        - Speeding
        - Idling
        - Seat belt usage

      metrics:
        - Safety score
        - Efficiency score
        - Compliance score
        - Overall rating

  recognition:
    - Safety awards
    - Efficiency bonuses
    - Service milestones
    - Performance incentives
```

### Fuel Management

```yaml
fuel_management:
  procurement:
    strategies:
      - Fuel cards/accounts
      - Bulk purchasing
      - Contract pricing
      - On-site fueling

    controls:
      - Authorized locations
      - Fuel type restrictions
      - Transaction limits
      - Exception alerts

  tracking:
    data_points:
      - Fuel purchases
      - Gallons consumed
      - Cost per gallon
      - MPG/efficiency
      - Idle fuel usage

    analysis:
      - Vehicle comparisons
      - Driver comparisons
      - Route efficiency
      - Trend analysis
      - Anomaly detection

  optimization:
    vehicle:
      - Proper maintenance
      - Tire pressure monitoring
      - Aerodynamic improvements
      - Weight reduction
      - Engine optimization

    driver:
      - Eco-driving training
      - Idle reduction
      - Speed management
      - Route compliance
      - Behavior coaching

    operational:
      - Route optimization
      - Load consolidation
      - Alternative fuels
      - Hybrid/EV adoption

  metrics:
    - MPG by vehicle/driver
    - Cost per mile
    - Fuel cost percentage
    - Idle time percentage
    - Exception rate
```

### Route Optimization

```yaml
routing:
  planning:
    factors:
      - Delivery windows
      - Vehicle capacity
      - Driver hours
      - Traffic patterns
      - Road restrictions

    optimization_goals:
      - Minimize distance
      - Minimize time
      - Minimize cost
      - Maximize stops
      - Balance workload

  technology:
    tools:
      - Route planning software
      - GPS navigation
      - Real-time traffic
      - Dynamic routing
      - Mobile apps

    integration:
      - Order management
      - Customer systems
      - Dispatch systems
      - Telematics
      - ERP systems

  execution:
    dispatch:
      - Route assignment
      - Driver communication
      - Real-time monitoring
      - Exception handling
      - Customer notifications

    adjustments:
      - Traffic rerouting
      - Emergency stops
      - Add-on orders
      - Customer changes
      - Vehicle breakdowns

  analysis:
    metrics:
      - Route efficiency
      - Planned vs actual
      - On-time percentage
      - Miles per stop
      - Cost per delivery
```


## References
- `references/compliance-and-safety.md` — Compliance and Safety
- `references/output-format.md` — Output Format
- `references/references.md` — References
