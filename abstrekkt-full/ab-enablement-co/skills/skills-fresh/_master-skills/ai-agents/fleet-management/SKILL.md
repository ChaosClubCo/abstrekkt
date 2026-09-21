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

### Compliance and Safety

```yaml
compliance:
  dot_requirements:
    vehicle:
      - Vehicle registration
      - Annual inspections
      - Safety equipment
      - Weight limits
      - Hazmat placarding

    driver:
      - CDL requirements
      - Medical certifications
      - Hours of Service (HOS)
      - Drug/alcohol testing
      - Background checks

    documentation:
      - Driver qualification files
      - Vehicle inspection reports
      - Maintenance records
      - Trip logs
      - Accident reports

  hours_of_service:
    rules:
      property_carrying:
        - 11-hour driving limit
        - 14-hour window
        - 30-minute break
        - 60/70 hour limit
        - 34-hour restart

      passenger_carrying:
        - 10-hour driving limit
        - 15-hour window
        - 60/70 hour limit

    eld_compliance:
      - Device certification
      - Driver training
      - Record keeping
      - Audit readiness
      - Malfunction procedures

  safety_programs:
    elements:
      - Safety policies
      - Accident procedures
      - Incident reporting
      - Safety meetings
      - Hazard communication

    initiatives:
      - Pre-trip inspections
      - Defensive driving
      - Distracted driving prevention
      - Fatigue management
      - Weather protocols

  audits:
    internal:
      - File audits
      - Vehicle inspections
      - Policy compliance
      - Training verification

    external:
      - DOT audits
      - CSA scores
      - Insurance audits
      - Customer audits
```

### Telematics and Technology

```yaml
telematics:
  capabilities:
    tracking:
      - Real-time GPS location
      - Route history
      - Geofencing
      - Landmark alerts

    vehicle_data:
      - Engine diagnostics
      - Fuel consumption
      - Odometer readings
      - Fault codes
      - Battery status

    driver_behavior:
      - Speeding events
      - Hard braking
      - Rapid acceleration
      - Idle time
      - Seat belt status

  applications:
    operations:
      - Dispatch optimization
      - Customer ETA
      - Proof of delivery
      - Exception alerts

    maintenance:
      - Fault code alerts
      - PM scheduling
      - Predictive maintenance
      - Recall management

    safety:
      - Behavior monitoring
      - Accident reconstruction
      - Risk scoring
      - Driver coaching

    compliance:
      - ELD integration
      - DVIR capture
      - HOS monitoring
      - Audit support

  dashcams:
    features:
      - Road-facing video
      - Driver-facing video
      - Event triggers
      - Continuous recording
      - AI analysis

    benefits:
      - Accident documentation
      - Liability protection
      - Coaching tool
      - Theft prevention
```

### Fleet Cost Analysis

```yaml
cost_management:
  total_cost_ownership:
    fixed_costs:
      - Depreciation
      - Financing/lease payments
      - Insurance premiums
      - Registration/licensing
      - Permits and taxes

    variable_costs:
      - Fuel
      - Maintenance and repairs
      - Tires
      - Tolls
      - Fines and violations

    indirect_costs:
      - Administration
      - Driver costs
      - Downtime
      - Accidents
      - Compliance

  analysis:
    cost_per_mile:
      calculation: "Total costs / Total miles"
      components:
        - Fixed CPM
        - Variable CPM
        - Fully loaded CPM

    benchmarking:
      - Industry standards
      - Internal comparisons
      - Vehicle class comparison
      - Age/mileage analysis

  optimization:
    strategies:
      - Right-sizing fleet
      - Replacement timing
      - Maintenance optimization
      - Fuel management
      - Insurance optimization
      - Administrative efficiency

    technology:
      - Telematics ROI
      - Route optimization savings
      - Predictive maintenance value
      - Automation benefits

  reporting:
    frequency:
      - Daily: Exceptions, alerts
      - Weekly: Performance summary
      - Monthly: Cost analysis
      - Quarterly: TCO review
      - Annual: Strategy review

    metrics:
      - Cost per mile
      - Cost per vehicle
      - Utilization rate
      - Downtime percentage
      - Safety incidents
```

### Electric and Alternative Fuel Vehicles

```yaml
alternative_fuels:
  electric_vehicles:
    assessment:
      - Route compatibility
      - Range requirements
      - Charging infrastructure
      - Total cost of ownership
      - Environmental goals

    infrastructure:
      - Depot charging
      - Public charging
      - Route planning
      - Load management
      - Grid considerations

    operations:
      - Range management
      - Charging scheduling
      - Battery maintenance
      - Cold weather protocols
      - Driver training

  other_alternatives:
    cng_lng:
      - Compressed natural gas
      - Liquefied natural gas
      - Fueling infrastructure
      - Vehicle maintenance
      - Cost analysis

    propane:
      - Propane autogas
      - Infrastructure needs
      - Maintenance differences
      - Cost considerations

    hydrogen:
      - Fuel cell technology
      - Infrastructure requirements
      - Current applications
      - Future potential

  transition_planning:
    phases:
      - Pilot programs
      - Infrastructure development
      - Fleet integration
      - Full deployment

    considerations:
      - Total cost of ownership
      - Infrastructure investment
      - Operational changes
      - Training requirements
      - Incentives and grants
```

### Fleet Metrics and KPIs

```yaml
metrics:
  utilization:
    - Vehicle utilization rate
    - Miles driven per vehicle
    - Hours operated
    - Idle percentage
    - Capacity utilization

  cost:
    - Cost per mile
    - Cost per vehicle
    - Fuel cost per mile
    - Maintenance cost per mile
    - Total cost of ownership

  maintenance:
    - PM compliance rate
    - Breakdown frequency
    - Downtime percentage
    - Mean time to repair
    - Warranty recovery

  safety:
    - Accident frequency rate
    - Accident severity rate
    - Safety score average
    - Violations per driver
    - CSA scores

  efficiency:
    - Miles per gallon
    - On-time delivery rate
    - Stops per route
    - Route efficiency
    - Driver productivity

  compliance:
    - HOS compliance rate
    - Inspection pass rate
    - ELD compliance
    - Documentation accuracy
```

## Output Format

### Fleet Performance Report
```markdown
# Fleet Performance Report: [Period]

## Fleet Overview
- Total Vehicles: [Count]
- Active Vehicles: [Count]
- Total Drivers: [Count]
- Miles Driven: [Miles]

## Utilization Metrics
| Metric | Current | Target | Variance |
|--------|---------|--------|----------|
| Utilization Rate | [%] | [%] | [+/-%] |
| Average Miles/Vehicle | [Miles] | [Miles] | [+/-Miles] |
| Idle Time | [%] | [%] | [+/-%] |

## Cost Analysis
| Cost Category | Amount | CPM | % of Total |
|---------------|--------|-----|------------|
| Fuel | [$] | [$] | [%] |
| Maintenance | [$] | [$] | [%] |
| Insurance | [$] | [$] | [%] |
| Depreciation | [$] | [$] | [%] |
| Total | [$] | [$] | 100% |

## Safety Performance
| Metric | Current | Prior | Trend |
|--------|---------|-------|-------|
| Accident Rate | [Rate] | [Rate] | [Up/Down] |
| Safety Score | [Score] | [Score] | [Up/Down] |
| Violations | [Count] | [Count] | [Up/Down] |

## Maintenance Summary
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| PM Compliance | [%] | [%] | [G/Y/R] |
| Downtime | [%] | [%] | [G/Y/R] |
| Repair Cost/Mile | [$] | [$] | [G/Y/R] |

## Compliance Status
- DOT Compliance: [Status]
- ELD Compliance: [%]
- Driver Files: [Complete/Incomplete]
- Vehicle Inspections: [Current/Overdue]

## Top Issues
1. [Issue and impact]
2. [Issue and impact]
3. [Issue and impact]

## Recommendations
1. [Priority recommendation]
2. [Supporting recommendation]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action] | [Name] | [Date] | [Status] |
```

## Integration Points

- Fleet management software (Fleetio, Samsara, Geotab)
- Telematics platforms
- ERP systems
- Fuel card systems
- Maintenance management systems
- Route optimization software
- ELD/HOS systems
- Insurance management
- HR/Payroll systems
- Accounting systems

## Best Practices

1. **Data-Driven Decisions**: Use telematics and analytics for optimization
2. **Preventive Maintenance**: Maintain vehicles proactively
3. **Driver Development**: Invest in driver training and safety
4. **Right-Size Fleet**: Match fleet size to actual needs
5. **Lifecycle Management**: Optimize vehicle replacement timing
6. **Compliance First**: Maintain regulatory compliance always
7. **Technology Integration**: Leverage fleet technology effectively
8. **Cost Visibility**: Track and analyze all costs comprehensively

## Common Pitfalls

- Reactive maintenance only
- Poor utilization tracking
- Inadequate driver monitoring
- Delayed vehicle replacement
- Compliance gaps
- Insufficient fuel management
- Manual processes and data silos
- Ignoring total cost of ownership
- Poor route planning
- Inadequate safety programs

## Version History

- 1.0.0: Initial fleet management skill
- 1.0.1: Added EV/alternative fuel section
- 1.0.2: Enhanced telematics guidance
