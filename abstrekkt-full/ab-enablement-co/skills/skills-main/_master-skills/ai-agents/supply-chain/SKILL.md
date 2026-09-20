---
name: supply-chain
description: Comprehensive guidance for supply chain management including procurement, supplier relationship management, demand planning, inventory optimization, logistics coordination, and supply chain visibility. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Supply Chain Skill

> Procurement, supplier management, and logistics optimization

## Description

This skill provides comprehensive guidance for supply chain management including procurement, supplier relationship management, demand planning, inventory optimization, logistics coordination, and supply chain visibility. It covers end-to-end supply chain operations from sourcing through delivery.

## Activation Triggers

- User mentions "supply chain", "procurement", "sourcing"
- User asks about supplier management or vendor relations
- User needs help with demand planning or forecasting
- User discusses inventory management or optimization
- User asks about logistics or transportation
- User mentions supply chain risk or resilience
- User needs purchase order or contract management

## Instructions

### Core Workflow

1. **Strategic Sourcing**
   - Identify sourcing needs
   - Evaluate potential suppliers
   - Negotiate contracts
   - Establish relationships
   - Monitor performance

2. **Procurement Operations**
   - Process requisitions
   - Issue purchase orders
   - Manage receipts
   - Process invoices
   - Maintain records

3. **Supply Chain Optimization**
   - Plan demand
   - Optimize inventory
   - Coordinate logistics
   - Monitor performance
   - Improve continuously

### Supply Chain Framework

```yaml
supply_chain:
  plan:
    demand_planning:
      - Forecast development
      - Demand sensing
      - S&OP process
      - Consensus forecasting

    supply_planning:
      - Capacity planning
      - Materials planning
      - Inventory optimization
      - Distribution planning

  source:
    strategic_sourcing:
      - Spend analysis
      - Market research
      - Supplier identification
      - RFx process
      - Negotiation
      - Contract management

    supplier_management:
      - Qualification
      - Onboarding
      - Performance monitoring
      - Development
      - Risk management

  make:
    production_planning:
      - MPS (Master Production Schedule)
      - MRP (Material Requirements Planning)
      - Capacity planning
      - Scheduling

  deliver:
    logistics:
      - Transportation management
      - Warehouse operations
      - Order fulfillment
      - Last-mile delivery
```

### Procurement Process

```yaml
procurement:
  requisition:
    - Need identification
    - Specification development
    - Budget approval
    - Requisition submission
    - Approval workflow

  sourcing:
    rfx_process:
      rfp: "Request for Proposal"
      rfq: "Request for Quotation"
      rfi: "Request for Information"

    evaluation:
      - Price analysis
      - Quality assessment
      - Delivery capability
      - Financial stability
      - Risk evaluation

  purchase_order:
    elements:
      - Supplier information
      - Item specifications
      - Quantity and price
      - Delivery terms
      - Payment terms
      - Terms and conditions

    approval:
      - Authorization matrix
      - Budget verification
      - Compliance check
      - Legal review (if needed)

  receiving:
    - Delivery verification
    - Quality inspection
    - Quantity confirmation
    - Documentation
    - System update

  payment:
    - Invoice receipt
    - Three-way match
    - Approval workflow
    - Payment processing
    - Record retention
```

### Supplier Management

```yaml
supplier_management:
  qualification:
    assessment:
      - Financial health
      - Quality systems
      - Capacity capability
      - Compliance status
      - References

    criteria:
      - Quality certifications (ISO)
      - Financial ratios
      - On-time delivery history
      - Customer references
      - Site audit results

  onboarding:
    - Master data creation
    - Contract execution
    - System setup
    - Training
    - Initial order

  performance:
    metrics:
      - On-time delivery
      - Quality defect rate
      - Cost competitiveness
      - Responsiveness
      - Innovation

    scorecard:
      - Quarterly reviews
      - Annual assessments
      - Trend analysis
      - Action plans

  development:
    - Capability building
    - Process improvement
    - Technology enablement
    - Relationship enhancement

  risk_management:
    - Risk identification
    - Mitigation strategies
    - Backup suppliers
    - Business continuity
```

### Demand Planning

```yaml
demand_planning:
  forecasting:
    methods:
      quantitative:
        - Time series analysis
        - Moving averages
        - Exponential smoothing
        - ARIMA models
        - Machine learning

      qualitative:
        - Sales input
        - Market intelligence
        - Expert judgment
        - Customer insights

    hierarchy:
      - Product level
      - Customer/channel
      - Geographic
      - Time period

  s_and_op:
    process:
      - Demand review
      - Supply review
      - Pre-S&OP
      - Executive S&OP
      - Implementation

    outputs:
      - Consensus demand plan
      - Supply plan
      - Inventory targets
      - Financial reconciliation

  forecast_accuracy:
    metrics:
      - MAPE (Mean Absolute Percentage Error)
      - Bias
      - Tracking signal
      - Forecast value added
```

### Inventory Management

```yaml
inventory:
  classification:
    abc_analysis:
      a_items: "High value, tight control"
      b_items: "Moderate value, moderate control"
      c_items: "Low value, simple control"

    xyz_analysis:
      x_items: "Stable demand"
      y_items: "Variable demand"
      z_items: "Intermittent demand"

  policies:
    reorder_point:
      formula: "Lead Time Demand + Safety Stock"
      application: "Continuous review"

    min_max:
      min: "Reorder point"
      max: "Maximum inventory level"
      application: "Periodic review"

    economic_order_quantity:
      formula: "sqrt(2DS/H)"
      variables:
        D: "Annual demand"
        S: "Order cost"
        H: "Holding cost"

  safety_stock:
    factors:
      - Demand variability
      - Lead time variability
      - Service level target
      - Fill rate objective

  metrics:
    - Inventory turns
    - Days of supply
    - Fill rate
    - Stockout rate
    - Carrying cost
```

### Logistics Management

```yaml
logistics:
  transportation:
    modes:
      - Truck (LTL, FTL)
      - Rail
      - Ocean
      - Air
      - Intermodal

    management:
      - Carrier selection
      - Route optimization
      - Load planning
      - Shipment tracking
      - Performance monitoring

    cost_factors:
      - Distance
      - Weight/volume
      - Service level
      - Fuel surcharges
      - Accessorials

  warehouse_operations:
    receiving:
      - Dock scheduling
      - Unloading
      - Inspection
      - Put-away

    storage:
      - Slotting optimization
      - Inventory accuracy
      - Space utilization

    picking:
      - Wave planning
      - Pick path optimization
      - Pack and ship

  distribution_network:
    - Network design
    - DC location
    - Capacity planning
    - Inventory positioning
```

### Supply Chain Visibility

```yaml
visibility:
  tracking:
    - Order status
    - Shipment tracking
    - Inventory levels
    - Supplier performance

  technology:
    - Track and trace systems
    - IoT sensors
    - RFID
    - GPS tracking
    - Blockchain

  dashboards:
    - Real-time visibility
    - Exception alerts
    - Performance metrics
    - Analytics
```

### Supply Chain Risk

```yaml
risk_management:
  risk_categories:
    supply:
      - Supplier failure
      - Capacity constraints
      - Quality issues
      - Lead time variability

    demand:
      - Forecast error
      - Demand volatility
      - Customer concentration

    logistics:
      - Transportation disruption
      - Port congestion
      - Weather events

    external:
      - Geopolitical
      - Regulatory
      - Natural disasters
      - Pandemic

  mitigation:
    - Supplier diversification
    - Safety stock
    - Alternative transportation
    - Business continuity planning
    - Insurance

  monitoring:
    - Risk scoring
    - Early warning indicators
    - Scenario planning
    - Regular reviews
```

### Supply Chain Metrics

```yaml
metrics:
  cost:
    - Total supply chain cost
    - Procurement cost savings
    - Transportation cost per unit
    - Warehousing cost
    - Inventory carrying cost

  service:
    - Perfect order rate
    - On-time delivery
    - Fill rate
    - Order cycle time

  asset:
    - Inventory turns
    - Cash-to-cash cycle
    - Capacity utilization
    - Asset turnover

  quality:
    - Supplier quality (PPM)
    - Damage rate
    - Return rate
```

## Output Format

### Supply Chain Assessment
```markdown
# Supply Chain Assessment: [Category/Area]

## Current State
| Metric | Current | Benchmark | Gap |
|--------|---------|-----------|-----|
| [Metric] | [Value] | [Target] | [Gap] |

## Supplier Analysis
| Supplier | Spend | Performance | Risk |
|----------|-------|-------------|------|
| [Supplier] | [$] | [Score] | [H/M/L] |

## Inventory Health
| Category | Value | Turns | DOS |
|----------|-------|-------|-----|
| [Category] | [$] | [#] | [Days] |

## Risks Identified
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk] | [H/M/L] | [H/M/L] | [Action] |

## Recommendations
1. [Priority recommendation]
2. [Supporting recommendation]

## Action Plan
| Action | Owner | Timeline | Status |
|--------|-------|----------|--------|
| [Action] | [Name] | [Date] | [Status] |
```

## Integration Points

- ERP systems (SAP, Oracle)
- Procurement platforms (Coupa, Ariba)
- WMS (Warehouse Management Systems)
- TMS (Transportation Management Systems)
- Demand planning tools
- Supplier portals
- EDI/API integrations
- Analytics platforms

## Best Practices

1. **Strategic Alignment**: Link supply chain to business strategy
2. **Supplier Partnerships**: Develop key supplier relationships
3. **Demand Driven**: Plan from demand, not push supply
4. **Visibility**: End-to-end supply chain visibility
5. **Risk Management**: Proactive risk identification
6. **Continuous Improvement**: Apply Lean/Six Sigma
7. **Technology**: Leverage digital tools
8. **Collaboration**: Cross-functional alignment

## Common Pitfalls

- Siloed operations
- Poor forecast accuracy
- Excess inventory
- Supplier concentration risk
- Reactive vs. proactive management
- Inadequate visibility
- Manual processes
- Insufficient risk management

## Version History

- 1.0.0: Initial supply chain skill
- 1.0.1: Added risk management section
- 1.0.2: Enhanced demand planning
