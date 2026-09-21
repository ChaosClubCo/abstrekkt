---
name: inventory-management
description: Design and optimize inventory control systems, demand forecasting models, and stock replenishment strategies. Analyze carrying costs, calculate reorder points, and implement cycle counting procedures for warehouse and retail operations. Use when managing, optimizing, or automating operational workflows.
---

# Inventory Management

> Master stock control from demand forecasting through replenishment to minimize carrying costs and prevent stockouts.

## Description
This skill covers end-to-end inventory management including demand forecasting, safety stock calculation, reorder point optimization, ABC/XYZ classification, and warehouse slotting strategies. It serves operations managers, supply chain analysts, warehouse supervisors, and inventory planners who need to balance service levels against carrying costs. Key areas include perpetual vs. periodic inventory systems, cycle counting programs, dead stock identification, inventory turnover optimization, and multi-location stock balancing.

## Activation Triggers
- User mentions inventory control, stock management, or warehouse optimization
- User asks about reorder points, safety stock, or economic order quantity
- User needs help with demand forecasting or consumption analysis
- User wants to reduce carrying costs or improve inventory turnover
- User mentions ABC analysis, cycle counting, or physical inventory
- User asks about stockout prevention or overstock reduction
- User needs help with dead stock identification or obsolescence management
- User wants to design an inventory policy or replenishment strategy
- User mentions multi-location inventory balancing or transfer optimization
- User asks about inventory KPIs, fill rates, or service levels

## Instructions

### Core Workflow
1. **Assess Current Inventory State**
   - Gather SKU count, total inventory value, and storage capacity
   - Identify current inventory turnover ratio and days of supply
   - Map existing replenishment processes and lead times
   - Document current stockout frequency and excess inventory levels
   - Evaluate accuracy of existing demand forecasts

2. **Classify and Segment Inventory**
   - Perform ABC analysis by annual consumption value
   - Layer XYZ analysis by demand variability
   - Cross-reference ABC-XYZ matrix for policy assignment
   - Identify critical items requiring special handling
   - Flag slow-moving, obsolete, and dead stock for disposition

3. **Calculate Optimal Parameters**
   - Determine safety stock levels using service level targets
   - Calculate reorder points factoring lead time variability
   - Compute economic order quantities balancing ordering and holding costs
   - Set minimum and maximum stock levels per classification
   - Define review periods for periodic review items

4. **Design Replenishment Strategy**
   - Select continuous vs. periodic review per item class
   - Configure automated reorder triggers and approval workflows
   - Establish supplier lead time agreements and buffers
   - Plan seasonal pre-builds and promotional stock requirements
   - Design multi-echelon replenishment for distributed networks

5. **Implement Monitoring and Continuous Improvement**
   - Deploy inventory dashboard with real-time KPI tracking
   - Schedule cycle counting program by ABC classification
   - Set up stockout and overstock alert thresholds
   - Establish monthly inventory review cadence
   - Track forecast accuracy and adjust models quarterly

### Inventory Classification Framework
```
ABC-XYZ CLASSIFICATION MATRIX
================================================
         |    X (Stable)  |  Y (Variable)  |  Z (Erratic)
---------|----------------|----------------|----------------
A (High) |  AX: Continuous|  AY: Continuous|  AZ: Continuous
  Value  |  review, tight |  review, medium|  review, high
         |  safety stock  |  safety stock  |  safety stock
---------|----------------|----------------|----------------
B (Mid)  |  BX: Periodic  |  BY: Periodic  |  BZ: Periodic
  Value  |  review, low   |  review, medium|  review, higher
         |  safety stock  |  safety stock  |  safety stock
---------|----------------|----------------|----------------
C (Low)  |  CX: Min-Max   |  CY: Min-Max   |  CZ: Consider
  Value  |  simple rules  |  moderate buffer|  elimination
================================================

POLICY RECOMMENDATIONS BY CLASS:
- AX/AY: JIT delivery, VMI programs, daily monitoring
- AZ/BX: Forecast-driven, weekly review cycles
- BY/BZ: Periodic review, statistical safety stock
- CX/CY: Simple min-max rules, quarterly review
- CZ: Evaluate for discontinuation or make-to-order
```

### KPI Dashboard Framework
```
INVENTORY PERFORMANCE SCORECARD
================================================
Financial Metrics:
- Inventory Turnover Ratio: COGS / Average Inventory
  Target: Industry benchmark + 10%
- Carrying Cost %: Total Holding Costs / Average Inventory Value
  Target: 15-25% of inventory value annually
- Dead Stock Ratio: Dead Stock Value / Total Inventory Value
  Target: < 3%
- Gross Margin Return on Investment (GMROI): Gross Profit / Average Inventory Cost
  Target: > 2.0

Service Metrics:
- Fill Rate: Lines Shipped Complete / Total Lines Ordered
  Target: > 95% (A items), > 90% (B items), > 85% (C items)
- Stockout Rate: Stockout Events / Total Demand Events
  Target: < 2% (A items), < 5% (B items)
- Perfect Order Rate: Orders delivered complete, on-time, damage-free
  Target: > 92%
- Backorder Rate: Backordered Lines / Total Lines
  Target: < 3%

Operational Metrics:
- Inventory Accuracy: Matched Counts / Total Counts
  Target: > 99% (A items), > 97% (B items), > 95% (C items)
- Cycle Count Accuracy: Accurate Counts / Total Cycle Counts
  Target: > 98%
- Days of Supply: Average Inventory / Average Daily Usage
  Target: Varies by class, typically 15-45 days
- Shrinkage Rate: (Book Inventory - Physical) / Book Inventory
  Target: < 1%
```

### Templates

**Reorder Point Calculation Template**
```
REORDER POINT ANALYSIS
SKU: {sku_number} | Description: {item_description}
Category: {abc_class}-{xyz_class} | Unit Cost: ${unit_cost}

DEMAND ANALYSIS:
- Average Daily Demand: {avg_daily} units
- Demand Std Deviation: {demand_std} units
- Demand Trend: {increasing/stable/decreasing}

LEAD TIME ANALYSIS:
- Average Lead Time: {avg_lt} days
- Lead Time Std Deviation: {lt_std} days
- Supplier Reliability: {on_time_pct}%

SAFETY STOCK CALCULATION:
- Target Service Level: {service_level}% (z-score: {z_value})
- Safety Stock = z * sqrt(LT * demand_var^2 + demand_avg^2 * lt_var^2)
- Safety Stock: {safety_stock} units (${safety_stock_value})

REORDER POINT:
- ROP = (Avg Daily Demand * Avg Lead Time) + Safety Stock
- ROP: {rop_units} units
- EOQ: {eoq_units} units
- Max Stock Level: {max_units} units
- Annual Holding Cost at ROP: ${holding_cost}

RECOMMENDATION: {recommendation_text}
```

**Cycle Count Schedule Template**
```
CYCLE COUNT PROGRAM - {period}
Facility: {facility_name}

CLASS A ITEMS ({a_count} SKUs):
- Frequency: Monthly
- Method: Full count, blind count procedure
- Schedule: {weekly_slots} SKUs per week
- Tolerance: +/- 0.5%
- Escalation: Immediate recount if variance > tolerance

CLASS B ITEMS ({b_count} SKUs):
- Frequency: Quarterly
- Method: Sample count, 20% per cycle
- Schedule: {quarterly_slots} SKUs per week
- Tolerance: +/- 2%
- Escalation: Recount within 48 hours if variance > tolerance

CLASS C ITEMS ({c_count} SKUs):
- Frequency: Semi-annually
- Method: Zone-based group count
- Schedule: {semi_slots} locations per week
- Tolerance: +/- 5%
- Escalation: Investigate if variance > $500

RESOURCES REQUIRED: {counters} counters, {hours} hours/week
```

### Best Practices
- Classify inventory using ABC-XYZ analysis before setting any replenishment parameters
- Set differentiated service levels by item class rather than blanket targets
- Calculate safety stock using statistical methods, not arbitrary weeks-of-supply rules
- Monitor forecast accuracy by SKU and adjust models when MAPE exceeds 30%
- Implement cycle counting to replace annual physical inventory where possible
- Review dead stock monthly and establish clear disposition policies with timelines
- Use vendor-managed inventory for high-volume A-class items with reliable suppliers
- Track inventory turnover at the SKU level, not just aggregate portfolio
- Align reorder quantities with supplier minimum order quantities and price breaks
- Automate replenishment triggers but maintain human oversight for A-class exceptions
- Measure carrying costs comprehensively: capital, storage, insurance, obsolescence, shrinkage
- Establish clear ownership for each inventory segment with accountability for KPIs
- Conduct quarterly demand pattern reviews to detect shifts in ABC-XYZ classification
- Use demand sensing for short-horizon forecasts alongside statistical models for long-range

### Common Patterns

**Pattern: Reducing Excess Inventory After Demand Drop**
Context: A distributor has 45 days of supply after a 20% demand decline, with $2M in excess stock across 800 SKUs.
Approach: Reclassify all SKUs using updated demand data. Identify items where current stock exceeds 60-day forecast. Segment excess into three buckets: items recovering (hold), items permanently declined (mark down 20% and push through channels), items obsolete (liquidate or write off). Set temporary reorder holds on overstocked items.
Output: Excess reduction plan with item-level actions, timeline to return to 30-day target, and projected write-off of $180K on truly obsolete stock. Monthly review checkpoint to adjust pace.

**Pattern: Setting Up a New Warehouse Inventory System**
Context: A growing e-commerce company is opening a second fulfillment center and needs inventory policies for 5,000 SKUs across two locations.
Approach: Analyze order patterns by geography to determine which SKUs to stock at each location. Perform ABC analysis on the combined catalog. Set location-specific reorder points factoring inter-warehouse transfer as a replenishment option. Design allocation rules for new receipts. Implement real-time inventory visibility across both sites.
Output: Dual-location stocking strategy, SKU allocation matrix, location-specific safety stock parameters, and inter-facility transfer triggers when imbalances exceed 20% of target.

### Output Formats

**Inventory Health Report**: Executive summary with turnover trends, service level performance, carrying cost analysis, and top-10 problem SKUs with recommended actions.

**Replenishment Parameter Sheet**: SKU-level table with reorder point, safety stock, EOQ, review frequency, and supplier details suitable for ERP system upload.

**Inventory Optimization Roadmap**: Phased improvement plan with quick wins (excess reduction), medium-term projects (system automation), and strategic initiatives (demand sensing), each with projected ROI and timeline.
