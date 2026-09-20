---
name: logistics-optimization
description: Expert guidance for supply chain logistics optimization including route planning, warehouse management, freight operations, last-mile delivery strategies, and transportation network design. Use when navigating industry-specific regulations, processes, or operations.
---

# Logistics Optimization Skill

> Supply chain logistics, route optimization, warehouse management, and last-mile delivery

## Description

This skill provides comprehensive guidance for logistics optimization across the supply chain including transportation route planning, warehouse layout and operations, freight management, last-mile delivery strategies, and network design. It addresses inbound and outbound logistics, intermodal transportation, cross-docking, inventory positioning, and logistics technology integration. The skill covers carriers, shippers, third-party logistics providers (3PLs), and e-commerce fulfillment operations. It supports logistics managers, supply chain directors, transportation planners, and warehouse operations leaders in maximizing service levels while minimizing total logistics cost.

## Activation Triggers

- User mentions "logistics optimization", "route planning", or "transportation management"
- User asks about warehouse layout, slotting, or fulfillment operations
- User needs help with freight management, carrier selection, or rate negotiation
- User discusses last-mile delivery, final mile, or delivery optimization
- User asks about supply chain network design or distribution strategy
- User mentions TMS, WMS, or logistics technology systems
- User needs guidance on cross-docking, consolidation, or deconsolidation
- User asks about shipping cost reduction or logistics KPIs
- User discusses reverse logistics, returns processing, or disposition
- User mentions cold chain logistics or hazmat transportation

## Instructions

### Core Workflow

1. **Network Analysis**
   - Map current logistics network (facilities, lanes, volumes)
   - Analyze transportation spend by mode, lane, and carrier
   - Identify service level performance gaps and root causes
   - Model total cost of logistics as percentage of revenue
   - Benchmark against industry standards and best-in-class performers

2. **Route and Transportation Optimization**
   - Select optimal transportation modes for each lane
   - Design routing strategies (direct ship, hub-and-spoke, milk run)
   - Optimize load building and trailer utilization
   - Implement continuous move and backhaul strategies
   - Evaluate carrier performance and adjust allocation

3. **Warehouse Operations Design**
   - Design warehouse layout for optimal material flow
   - Implement slotting strategies based on velocity and affinity
   - Define pick, pack, and ship workflows
   - Establish inventory accuracy programs (cycle counting, audits)
   - Deploy warehouse management system (WMS) configurations

4. **Last-Mile Strategy**
   - Design delivery zone and service area coverage
   - Implement dynamic routing and real-time dispatching
   - Optimize delivery density and stop sequencing
   - Manage proof-of-delivery and exception handling
   - Evaluate crowdsource delivery and micro-fulfillment options

5. **Continuous Improvement**
   - Track logistics KPIs against targets weekly
   - Conduct quarterly business reviews with key carriers
   - Perform annual network optimization studies
   - Evaluate emerging technologies (automation, AI, visibility platforms)
   - Drive cost-per-unit shipped reductions year over year

### Transportation Management Framework

```yaml
transportation_management:
  mode_selection:
    truckload:
      use_when: "Full trailer volume or weight (>10,000 lbs)"
      advantages: "Lower per-unit cost, faster transit, less handling"
      considerations: "Volume commitment, lane consistency, seasonal capacity"
    ltl:
      use_when: "Partial trailer (150-10,000 lbs)"
      advantages: "Pay for space used, frequent service"
      considerations: "Transit time longer, more handling, damage risk"
    parcel:
      use_when: "Small shipments (<150 lbs)"
      advantages: "Door-to-door, tracking, wide coverage"
      considerations: "Cost per pound high, dimensional weight pricing"
    intermodal:
      use_when: "Long-haul lanes (>750 miles), not time-critical"
      advantages: "20-40% cost savings vs. truckload, lower carbon"
      considerations: "Longer transit, less flexible, ramp availability"
    air_freight:
      use_when: "Urgent, high-value, or long-distance shipments"
      advantages: "Speed, global reach, reliable schedules"
      considerations: "Highest cost per unit, weight/size limits"
    ocean_freight:
      use_when: "International bulk shipments, non-urgent"
      advantages: "Lowest per-unit cost for large volumes"
      considerations: "Long transit, port congestion, container availability"

  route_optimization:
    strategies:
      direct_shipping: "Point-to-point for high-volume lanes"
      hub_and_spoke: "Consolidation through distribution centers"
      milk_run: "Multi-stop pickup or delivery routes"
      pool_distribution: "TL to pool point, then LTL local delivery"
      zone_skipping: "Bypass parcel sort facilities for dense zones"
    optimization_factors:
      - Distance and transit time
      - Cost per mile/stop/package
      - Vehicle capacity utilization
      - Driver hours of service (HOS) compliance
      - Delivery time window constraints
      - Customer service level requirements

  carrier_management:
    selection_criteria:
      - Service reliability and on-time percentage
      - Pricing competitiveness and rate stability
      - Geographic coverage and lane density
      - Claims ratio and cargo handling quality
      - Technology capabilities (EDI, API, visibility)
      - Financial stability and insurance coverage
    performance_metrics:
      on_time_delivery: "Target >= 95%"
      claims_ratio: "Target < 0.5% of revenue"
      tender_acceptance: "Target >= 90%"
      billing_accuracy: "Target >= 98%"
      transit_time_consistency: "Standard deviation < 0.5 days"

  freight_cost_management:
    rate_structures:
      - Contract rates (annual RFP/bid)
      - Spot market rates
      - Volume commitment discounts
      - Minimum charge thresholds
      - Accessorial fee schedules
    cost_reduction_levers:
      - Consolidation and load optimization
      - Mode conversion (TL to intermodal, LTL to TL)
      - Lane-based carrier allocation optimization
      - Backhaul and continuous move programs
      - Dimensional weight optimization for parcel
      - Delivery appointment scheduling to reduce detention
```

### Warehouse Operations Framework

```yaml
warehouse_operations:
  layout_design:
    zones:
      receiving: "Inbound dock doors, staging, quality inspection"
      storage: "Bulk storage, reserve, active pick locations"
      picking: "Pick faces, pick modules, goods-to-person stations"
      packing: "Pack stations, cartonization, labeling"
      shipping: "Outbound staging, dock doors, carrier loading"
      returns: "Returns processing, inspection, disposition"

    flow_patterns:
      u_flow: "Receiving and shipping on same side; best for cross-docking"
      through_flow: "Receiving on one end, shipping on other; best for high volume"
      l_flow: "Receiving and shipping on adjacent sides; good for constrained sites"

  slotting_optimization:
    principles:
      - Place fastest-moving SKUs closest to shipping
      - Group frequently co-ordered items in adjacent locations
      - Heavy and bulky items at waist height for ergonomics
      - Reserve locations for overflow and seasonal fluctuation
      - Separate incompatible products (chemicals, food, fragile)
    velocity_classification:
      a_items: "Top 20% SKUs (80% of picks) - prime pick locations"
      b_items: "Next 30% SKUs (15% of picks) - secondary locations"
      c_items: "Bottom 50% SKUs (5% of picks) - reserve storage"

  picking_methods:
    discrete: "One order at a time; simple, low volume"
    batch: "Multiple orders simultaneously; efficient for similar items"
    zone: "Pickers assigned to zones; orders pass through zones"
    wave: "Groups of orders released in timed waves"
    cluster: "Pick into multiple totes on a cart simultaneously"
    goods_to_person: "Automated systems bring items to picker"

  inventory_accuracy:
    cycle_counting:
      abc_method: "A items counted monthly, B quarterly, C semi-annually"
      random: "Random sample of locations counted daily"
      trigger_based: "Count when discrepancy detected or location empty"
    accuracy_targets:
      location_accuracy: ">= 99.5%"
      quantity_accuracy: ">= 99.5%"
      sku_accuracy: ">= 99.8%"

  kpis:
    productivity:
      - Lines picked per labor hour
      - Orders shipped per labor hour
      - Receiving units processed per hour
      - Cost per order shipped
    quality:
      - Order accuracy rate (>= 99.5%)
      - Shipping accuracy rate
      - Damage rate (< 0.1%)
      - Returns due to warehouse error
    utilization:
      - Cubic space utilization
      - Dock door utilization
      - Equipment utilization
      - Labor utilization vs. capacity
```

### Templates

#### Logistics Network Assessment
```markdown
# Logistics Network Assessment

## Network Overview
- Number of Distribution Centers: [Count]
- Total Warehouse Sq Ft: [Amount]
- Annual Freight Spend: $[Amount]
- Total SKUs Managed: [Count]
- Annual Orders Shipped: [Count]

## Transportation Profile
| Mode | Annual Spend | % of Total | Avg Cost/Unit | On-Time % |
|------|-------------|------------|---------------|-----------|
| Truckload | $[Amount] | [%] | $[Amount] | [%] |
| LTL | $[Amount] | [%] | $[Amount] | [%] |
| Parcel | $[Amount] | [%] | $[Amount] | [%] |
| Intermodal | $[Amount] | [%] | $[Amount] | [%] |
| Air | $[Amount] | [%] | $[Amount] | [%] |

## Distribution Center Performance
| Facility | Throughput | Cost/Order | Accuracy | Utilization |
|----------|-----------|------------|----------|-------------|
| [DC Name] | [Units/day] | $[Amount] | [%] | [%] |

## Identified Opportunities
| Opportunity | Est. Annual Savings | Complexity | Priority |
|-------------|-------------------|------------|----------|
| [Description] | $[Amount] | [H/M/L] | [1-5] |

## Recommended Actions
1. [Action with projected impact]
2. [Action with projected impact]
3. [Action with projected impact]
```

#### Carrier Scorecard
```markdown
# Carrier Performance Scorecard

## Carrier: [Name] | Period: [Date Range]

## Performance Summary
| Metric | Target | Actual | Score | Trend |
|--------|--------|--------|-------|-------|
| On-Time Delivery | >= 95% | [%] | [1-5] | [Up/Down] |
| Claims Ratio | < 0.5% | [%] | [1-5] | [Up/Down] |
| Tender Acceptance | >= 90% | [%] | [1-5] | [Up/Down] |
| Billing Accuracy | >= 98% | [%] | [1-5] | [Up/Down] |
| Transit Consistency | < 0.5 days SD | [Days] | [1-5] | [Up/Down] |
| **Overall Score** | | | **[Avg]** | |

## Volume and Spend
| Lane | Shipments | Spend | Avg Cost | vs. Benchmark |
|------|-----------|-------|----------|---------------|
| [Origin-Dest] | [Count] | $[Amount] | $[Amount] | [+/-]% |

## Issues and Escalations
| Issue | Date | Resolution | Days Open |
|-------|------|------------|-----------|
| [Issue] | [Date] | [Resolution] | [Days] |

## Recommendations
- [Increase/decrease/maintain allocation based on performance]
- [Specific improvement areas to address in QBR]
```

### Best Practices

- Analyze total landed cost (freight + handling + inventory + service penalties) rather than freight cost alone
- Optimize trailer utilization to at least 85% of cubic or weight capacity before shipping
- Implement slotting reviews quarterly as demand patterns shift with seasonality
- Use ABC velocity analysis to drive both warehouse slotting and inventory positioning decisions
- Negotiate carrier contracts annually with competitive bid processes on major lanes
- Maintain a minimum of two qualified carriers per major lane for resilience
- Deploy real-time shipment visibility to enable proactive exception management
- Use zone-skipping strategies for parcel-heavy operations to reduce last-mile carrier costs
- Implement cross-docking for fast-moving items to reduce handling and storage time
- Schedule inbound appointments to level-load receiving dock capacity throughout the day
- Track cost-per-unit-shipped as the primary logistics efficiency metric
- Design reverse logistics flows with the same rigor as forward logistics
- Use dimensional weight analysis to right-size packaging and reduce parcel costs
- Establish clear SLAs with internal stakeholders to prevent expediting and premium freight

### Common Patterns

#### Pattern: Annual Freight RFP Process
```
1. Analyze current lane volumes, spend, and service levels
2. Identify lanes for bid (minimum volume threshold)
3. Develop RFP package with lane data, requirements, and scorecard criteria
4. Issue RFP to incumbent and challenger carriers
5. Evaluate responses on total cost, service, and capability
6. Conduct scenario modeling for optimal carrier mix
7. Negotiate final rates and contract terms with selected carriers
8. Implement routing guide and monitor compliance during transition
```

#### Pattern: Warehouse Slotting Optimization
```
1. Extract 90 days of order and pick data by SKU
2. Calculate pick frequency, units per pick, and co-occurrence
3. Classify SKUs into velocity tiers (A/B/C)
4. Map current slot locations and calculate travel distances
5. Design optimal slotting plan minimizing total picker travel
6. Execute slotting changes in phased waves to avoid disruption
7. Measure pick productivity before and after to quantify improvement
```

#### Pattern: Last-Mile Delivery Optimization
```
1. Geocode all delivery addresses and cluster into zones
2. Analyze delivery density by zone and time window
3. Build optimized routes minimizing total distance and respecting time windows
4. Assign vehicles and drivers based on route characteristics
5. Deploy real-time GPS tracking and dynamic rerouting
6. Capture proof-of-delivery and customer feedback at each stop
7. Analyze daily route performance and refine algorithms weekly
```

### Output Formats

#### Logistics Performance Dashboard
```markdown
# Logistics Performance Dashboard: [Period]

## Cost Summary
| Category | Budget | Actual | Variance | % of Revenue |
|----------|--------|--------|----------|-------------|
| Transportation | $[Amount] | $[Amount] | [+/-] | [%] |
| Warehousing | $[Amount] | $[Amount] | [+/-] | [%] |
| Total Logistics | $[Amount] | $[Amount] | [+/-] | [%] |

## Service Level Performance
| Metric | Target | Actual | Trend |
|--------|--------|--------|-------|
| On-Time Delivery | [%] | [%] | [Up/Down] |
| Order Accuracy | [%] | [%] | [Up/Down] |
| Perfect Order Rate | [%] | [%] | [Up/Down] |
| Avg Transit Days | [Days] | [Days] | [Up/Down] |

## Warehouse Performance
| Facility | Orders/Day | Cost/Order | Accuracy | Fill Rate |
|----------|-----------|------------|----------|-----------|
| [DC Name] | [Count] | $[Amount] | [%] | [%] |

## Transportation Performance
| Mode | Shipments | Cost/Unit | On-Time | Utilization |
|------|-----------|-----------|---------|-------------|
| [Mode] | [Count] | $[Amount] | [%] | [%] |
```

#### Route Optimization Report
```markdown
# Route Optimization Analysis: [Region/Zone]

## Current vs. Optimized Comparison
| Metric | Current | Optimized | Improvement |
|--------|---------|-----------|-------------|
| Total Routes | [Count] | [Count] | [+/-] |
| Total Miles | [Miles] | [Miles] | [-%] |
| Avg Stops/Route | [Count] | [Count] | [+/-] |
| Avg Miles/Stop | [Miles] | [Miles] | [-%] |
| Vehicle Utilization | [%] | [%] | [+%] |
| Est. Daily Cost | $[Amount] | $[Amount] | [-$Amount] |

## Projected Annual Savings: $[Amount]
## Implementation Complexity: [Low/Medium/High]
```

## Version History

- 1.0.0: Initial logistics optimization skill
