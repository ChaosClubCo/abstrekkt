---
name: inventory-management
description: Master inventory management including stock level optimization, demand forecasting, fulfillment strategies, and inventory analytics for e-commerce. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Inventory Management
  - ecommerce-strategy
  - product-merchandising
  - returns-management
  - marketplace-selling
triggers:
  - inventory management
  - stock levels
  - demand forecasting
  - fulfillment
  - stockout
  - overstock
  - reorder point
  - inventory optimization
---

## Overview

Inventory Management is the strategic balance of having the right products, in the right quantities, at the right locations, at the right time. For e-commerce, this means optimizing stock levels to maximize sales while minimizing carrying costs and stockouts.

### Inventory Fundamentals

1. **Demand Planning** - Forecasting customer demand
2. **Stock Optimization** - Right inventory levels
3. **Replenishment** - Timely reordering
4. **Fulfillment** - Order processing and shipping
5. **Visibility** - Real-time inventory tracking

### Inventory Impact

```
Inventory Business Impact:
├── Revenue
│   ├── In-stock rate → sales capture
│   ├── Fulfillment speed → conversion
│   └── Product availability → customer satisfaction
├── Costs
│   ├── Carrying costs (15-30% of value/year)
│   ├── Stockout costs (lost sales, expediting)
│   └── Overstock costs (markdowns, storage)
├── Cash Flow
│   ├── Working capital tied up
│   ├── Inventory turnover
│   └── Payment terms optimization
└── Customer Experience
    ├── Availability expectation
    ├── Delivery speed
    └── Order accuracy
```

## When to Use This Skill

### Primary Use Cases

1. **Inventory Strategy** - Designing inventory approach
2. **Demand Forecasting** - Predicting future needs
3. **Stock Level Optimization** - Setting reorder points
4. **Fulfillment Design** - Warehouse and shipping strategy
5. **Performance Analysis** - Inventory health review

### Review Triggers

```
When to Focus on Inventory:
├── Performance Issues
│   ├── High stockout rate (> 5%)
│   ├── Low turnover (< 4x/year)
│   ├── Rising carrying costs
│   └── Excess dead stock
├── Business Changes
│   ├── SKU count growth
│   ├── New channels/markets
│   ├── Seasonality shifts
│   └── Supply chain disruption
├── Growth Phase
│   ├── Scaling operations
│   ├── Warehouse expansion
│   └── Fulfillment optimization
└── Cost Pressure
    ├── Margin improvement needed
    ├── Cash flow constraints
    └── Working capital efficiency
```

## Core Processes

### 1. Demand Forecasting

**Forecasting Methods**:

| Method | Best For | Accuracy |
|--------|----------|----------|
| Historical Average | Stable demand | Low-Medium |
| Moving Average | Trending demand | Medium |
| Exponential Smoothing | Variable demand | Medium-High |
| Seasonal Models | Seasonal patterns | High |
| ML/AI Models | Complex patterns | High |
| Causal Models | Event-driven | Variable |

**Forecasting Framework**:
```
Demand Forecasting Process:
├── Data Collection
│   ├── Historical sales
│   ├── Seasonal patterns
│   ├── Promotional impact
│   └── Market trends
├── Segmentation
│   ├── ABC classification
│   ├── Product lifecycle stage
│   ├── Demand variability
│   └── Lead time groups
├── Model Selection
│   ├── Statistical methods
│   ├── ML algorithms
│   └── Hybrid approaches
├── Forecast Generation
│   ├── Base forecast
│   ├── Event adjustments
│   ├── Promotion overlays
│   └── New product models
└── Validation
    ├── Accuracy metrics
    ├── Bias detection
    ├── Exception handling
    └── Human review
```

**Forecast Accuracy Metrics**:

| Metric | Formula | Target |
|--------|---------|--------|
| MAPE | Avg(Abs(Actual-Forecast)/Actual) | < 20% |
| Bias | Sum(Forecast-Actual)/Sum(Actual) | Near 0 |
| Forecast Accuracy | 1 - MAPE | > 80% |
| Hit Rate | Within threshold % | > 70% |

### 2. Stock Level Optimization

**Inventory Classification**:
```
ABC-XYZ Analysis:
├── ABC (Revenue Contribution)
│   ├── A: Top 80% revenue (~20% SKUs)
│   ├── B: Next 15% revenue (~30% SKUs)
│   └── C: Bottom 5% revenue (~50% SKUs)
├── XYZ (Demand Variability)
│   ├── X: Low variability (CV < 0.5)
│   ├── Y: Medium variability (CV 0.5-1.0)
│   └── Z: High variability (CV > 1.0)
└── Combined Strategy
    ├── AX: High priority, tight control
    ├── AZ: Careful safety stock
    ├── CX: Automate, minimize
    └── CZ: Evaluate discontinuation
```

**Safety Stock Calculation**:
```
Safety Stock Formula:
SS = Z × σ_demand × √Lead_Time

Where:
├── Z = Service level factor
│   ├── 90% SL → Z = 1.28
│   ├── 95% SL → Z = 1.65
│   └── 99% SL → Z = 2.33
├── σ_demand = Standard deviation of demand
└── Lead_Time = Replenishment lead time

Reorder Point = (Avg Daily Demand × Lead Time) + Safety Stock
```

**Service Level Strategy**:

| Category | Service Level | Safety Stock |
|----------|---------------|--------------|
| A items | 97-99% | Higher |
| B items | 93-97% | Moderate |
| C items | 85-93% | Lower |
| Long-tail | 80-85% | Minimal |

### 3. Replenishment Strategy

**Replenishment Models**:
```
Replenishment Approaches:
├── Fixed Order Quantity (EOQ)
│   ├── Order same quantity
│   ├── Variable timing
│   └── Best for stable demand
├── Fixed Order Interval (Periodic)
│   ├── Order at set intervals
│   ├── Variable quantity
│   └── Best for review efficiency
├── Min-Max
│   ├── Order when below min
│   ├── Order up to max
│   └── Simple, common
└── Demand-Driven (DDMRP)
    ├── Buffer-based
    ├── Demand visibility
    └── Modern approach
```

**EOQ Calculation**:
```
Economic Order Quantity:
EOQ = √(2DS/H)

Where:
├── D = Annual demand
├── S = Order cost
└── H = Holding cost per unit

Example:
├── Annual demand: 10,000 units
├── Order cost: $50
├── Holding cost: $2/unit
└── EOQ = √(2 × 10,000 × 50 / 2) = 707 units
```

### 4. Multi-Location Inventory

**Network Strategy**:
```
Inventory Network Design:
├── Single Warehouse
│   ├── Simplest model
│   ├── Lower inventory
│   └── Higher shipping costs
├── Regional Distribution
│   ├── 2-4 locations
│   ├── Speed improvement
│   └── More inventory needed
├── Distributed Fulfillment
│   ├── Many nodes
│   ├── Fastest delivery
│   └── Highest inventory
└── Hybrid Model
    ├── Hub and spoke
    ├── Tiered allocation
    └── Optimal balance
```

**Inventory Allocation**:

| Factor | Weight | Consideration |
|--------|--------|---------------|
| Historical Demand | 40% | Past performance |
| Distance to Customers | 25% | Shipping time |
| Storage Costs | 15% | Facility costs |
| Flexibility | 10% | Transfer capability |
| Lead Time | 10% | Replenishment speed |

### 5. Inventory Visibility

**Real-Time Tracking**:
```
Inventory Visibility System:
├── Data Sources
│   ├── Warehouse management
│   ├── Point of sale
│   ├── E-commerce platform
│   └── 3PL systems
├── Processing
│   ├── Real-time sync
│   ├── Aggregation
│   ├── Available to promise
│   └── Reserved inventory
├── Consumption
│   ├── Website display
│   ├── Order routing
│   ├── Allocation rules
│   └── Backorder management
└── Analytics
    ├── Dashboards
    ├── Alerts
    ├── Trends
    └── Forecasting inputs
```

**Inventory States**:

| State | Definition | Impact |
|-------|------------|--------|
| On Hand | Physical in warehouse | Total stock |
| Available | Can be sold | Saleable units |
| Reserved | Allocated to orders | Committed |
| In Transit | Being received | Future available |
| Backordered | Sold but not in stock | Customer waiting |

### 6. Performance Management

**Key Inventory KPIs**:
```
Inventory Dashboard:
├── Availability
│   ├── In-stock rate
│   ├── Fill rate
│   └── Stockout frequency
├── Efficiency
│   ├── Inventory turnover
│   ├── Days sales outstanding
│   └── Carrying cost %
├── Health
│   ├── Dead stock %
│   ├── Overstock value
│   └── Slow-moving inventory
└── Accuracy
    ├── Inventory accuracy
    ├── Forecast accuracy
    └── Order accuracy
```

## Tools and Technologies

### Inventory Management Systems
- **NetSuite** - ERP with inventory
- **Cin7** - Inventory management
- **Skubana** - Multi-channel inventory
- **TradeGecko** - Inventory platform
- **Ordoro** - Shipping and inventory

### Warehouse Management
- **Manhattan** - Enterprise WMS
- **ShipBob** - Fulfillment
- **Flexe** - On-demand warehousing
- **6 River Systems** - Automation

### Planning Tools
- **Blue Yonder** - Demand planning
- **Anaplan** - Connected planning
- **Kinaxis** - Supply chain planning
- **Lokad** - Quantitative forecasting

### Analytics
- **Tableau** - Visualization
- **Power BI** - Business intelligence
- **Looker** - Data exploration

## Key Metrics

### Availability Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| In-Stock Rate | SKUs in stock / Total SKUs | > 95% |
| Fill Rate | Units shipped / Units ordered | > 98% |
| Backorder Rate | Backordered / Total orders | < 2% |
| Stockout Frequency | Stockout events / Period | Minimized |

### Efficiency Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| Inventory Turnover | COGS / Avg Inventory | 4-12x/year |
| Days Inventory Outstanding | 365 / Turnover | 30-90 days |
| Carrying Cost | Cost / Avg Inventory | 15-30% |
| Perfect Order Rate | Perfect orders / Total | > 95% |

### Health Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Dead Stock % | No sales 12mo / Total | < 5% |
| Overstock Value | Excess inventory $ | Minimized |
| Sell-Through | Units sold / Units received | > 80% |
| Inventory Accuracy | Accurate / Counted | > 99% |

### Cost Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Cost per Order | Fulfillment cost | Decreasing |
| Inventory Investment | Working capital tied | Optimized |
| Lost Sales | Stockout revenue impact | Minimized |
| Write-Off Rate | Obsolete/damaged | < 1% |

## Common Pitfalls

### Planning Errors

1. **Poor Forecasting**
   - Ignoring seasonality
   - No promotion adjustment
   - Over-reliance on history

2. **Wrong Classification**
   - Static ABC analysis
   - Ignoring lifecycle stage
   - Same treatment for all

3. **Safety Stock Issues**
   - Too little (stockouts)
   - Too much (overstock)
   - Not updating for changes

### Operational Issues

1. **Visibility Gaps**
   - Delayed updates
   - Channel silos
   - Inaccurate counts

2. **Process Failures**
   - Manual processes
   - Exception handling
   - No cycle counting

3. **Fulfillment Problems**
   - Wrong allocation
   - Pick errors
   - Shipping delays

### Strategic Mistakes

1. **Wrong Network Design**
   - Too centralized
   - Too distributed
   - Mismatched to demand

2. **Ignoring Costs**
   - Carrying cost neglect
   - Hidden expenses
   - No total cost view

3. **No Continuous Improvement**
   - Set and forget
   - No KPI tracking
   - Missing optimization

## Integration Points

### Connected Systems

```
Inventory Integration Map:
├── Commerce Platform
│   ├── Available to sell
│   ├── Order capture
│   └── Backorder handling
├── ERP
│   ├── Financial inventory
│   ├── Costing
│   └── Purchasing
├── WMS
│   ├── Physical inventory
│   ├── Picking/packing
│   └── Receiving
├── Supply Chain
│   ├── Supplier portals
│   ├── EDI
│   └── Lead time management
├── Marketplaces
│   ├── Multi-channel listing
│   ├── Quantity sync
│   └── Order routing
└── Analytics
    ├── Demand signals
    ├── Performance tracking
    └── Planning inputs
```

### Related Skills

- **ecommerce-strategy** - Overall approach
- **product-merchandising** - Product availability
- **returns-management** - Reverse logistics
- **marketplace-selling** - Multi-channel

### Team Structure

```
Inventory Organization:
├── Inventory Planning
│   ├── Demand planning
│   ├── Replenishment
│   └── Allocation
├── Warehouse Operations
│   ├── Receiving
│   ├── Storage
│   └── Fulfillment
├── Supply Chain
│   ├── Vendor management
│   ├── Purchasing
│   └── Logistics
└── Analytics
    ├── Performance tracking
    ├── Optimization
    └── Reporting
```

## Best Practices

### Planning

1. **Segmentation** - Different strategies for different products
2. **Forecast Review** - Regular accuracy assessment
3. **Buffer Right** - Appropriate safety stock
4. **Demand Sensing** - Use real-time signals

### Execution

1. **Visibility** - Real-time inventory tracking
2. **Accuracy** - Regular cycle counting
3. **Automation** - Reduce manual intervention
4. **Exception Management** - Fast problem resolution

### Continuous Improvement

1. **KPI Monitoring** - Track performance
2. **Root Cause Analysis** - Understand issues
3. **Process Optimization** - Eliminate waste
4. **Technology Investment** - Leverage tools

### Collaboration

1. **Sales Alignment** - Promotion visibility
2. **Supplier Partnership** - Forecast sharing
3. **Cross-Functional** - Unified planning
4. **Customer Focus** - Service level priority

## Summary

Inventory Management is a critical capability for e-commerce success, directly impacting customer satisfaction, operational efficiency, and financial performance. Excellence requires sophisticated demand forecasting, optimized stock levels, efficient fulfillment operations, and real-time visibility. The goal is balancing product availability with inventory investment, continuously improving through data-driven optimization.
