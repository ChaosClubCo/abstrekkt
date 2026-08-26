---
name: warehouse-operations
description: Helps manage and audit warehouse operations processes. Comprehensive guidance for warehouse operations including WMS, receiving, put-away, inventory management, order picking, packing, shipping, and warehouse optimization. Covers distribution center operations, fulfillment, and warehouse efficiency. Use when navigating industry-specific regulations, processes, or operations.
---

# Warehouse Operations Skill

> WMS, picking, packing, shipping, and warehouse management

## Description

This skill provides comprehensive guidance for warehouse operations including warehouse management systems (WMS), receiving, put-away, inventory management, order picking, packing, shipping, and warehouse optimization. It covers distribution center operations, fulfillment, and warehouse efficiency.

## Activation Triggers

- User mentions "warehouse", "WMS", "distribution center"
- User asks about picking, packing, or shipping
- User needs help with warehouse layout or slotting
- User discusses inventory accuracy or cycle counting
- User asks about order fulfillment or shipping
- User mentions warehouse KPIs or productivity
- User needs receiving or put-away optimization

## Instructions

### Core Workflow

1. **Receiving**
   - Schedule deliveries
   - Unload and inspect
   - Verify quantities
   - Process receipts
   - Direct put-away

2. **Storage and Inventory**
   - Execute put-away
   - Maintain inventory accuracy
   - Perform cycle counts
   - Manage locations
   - Optimize slotting

3. **Order Fulfillment**
   - Release orders
   - Plan picking waves
   - Execute picks
   - Pack orders
   - Ship and track

### Warehouse Layout

```yaml
layout:
  zones:
    receiving:
      - Dock doors
      - Staging area
      - Inspection area
      - Returns processing

    storage:
      - Bulk storage
      - Rack storage
      - Flow rack
      - Mezzanine
      - Hazmat area
      - Temperature controlled

    picking:
      - Forward pick locations
      - Carton flow
      - Each pick zone
      - Case pick zone

    shipping:
      - Packing stations
      - Staging lanes
      - Dock doors
      - Carrier areas

  considerations:
    - Product flow
    - Travel distance
    - Throughput requirements
    - Equipment needs
    - Safety requirements
    - Future expansion
```

### Receiving Operations

```yaml
receiving:
  appointment:
    - Delivery scheduling
    - Dock door assignment
    - Resource allocation
    - ASN matching

  unloading:
    - Dock assignment
    - Equipment allocation
    - Unloading method
    - Damage inspection

  receiving_process:
    blind_receiving:
      - Count without PO visibility
      - Prevent errors
      - Verify counts

    standard_receiving:
      - PO/ASN matching
      - Quantity verification
      - Quality inspection

  documentation:
    - Receipt confirmation
    - Discrepancy reporting
    - Damage claims
    - Quality records

  put_away:
    directed:
      - System-directed location
      - Zone rules
      - Velocity slotting

    user_directed:
      - Operator choice
      - Location confirmation
      - System update
```

### Inventory Management

```yaml
inventory:
  accuracy:
    cycle_counting:
      - ABC analysis
      - Count frequency
      - Count execution
      - Variance reconciliation

    methods:
      - Random sampling
      - Location audit
      - Zero confirm
      - Perpetual counting

    targets:
      - Unit accuracy: 99.5%+
      - Location accuracy: 99%+
      - Dollar accuracy: 99.9%+

  slotting:
    principles:
      - Velocity-based placement
      - Ergonomic considerations
      - Pick path optimization
      - Family grouping

    optimization:
      - Hot zone for fast movers
      - Proper pick face sizing
      - Travel reduction
      - Regular reslotting

  location_management:
    types:
      - Fixed locations
      - Random/floating
      - Directed put-away
      - Zone-based

    attributes:
      - Location type
      - Capacity
      - Pick type (each/case/pallet)
      - Hazmat/temperature
```

### Order Picking

```yaml
picking:
  strategies:
    discrete:
      - One order at a time
      - Simple, flexible
      - Lower productivity

    batch:
      - Multiple orders together
      - Common items
      - Higher productivity

    zone:
      - Dedicated areas
      - Sequential/parallel
      - Reduced travel

    wave:
      - Grouped releases
      - Carrier cutoffs
      - Workload balancing

  methods:
    pick_to_cart:
      - Mobile cart
      - Multiple orders
      - Sorting on cart

    pick_to_tote:
      - Tote per order
      - Conveyor movement
      - Sorting system

    goods_to_person:
      - Automated retrieval
      - Pick station
      - High productivity

  technology:
    rf_scanning:
      - Location scan
      - Item scan
      - Quantity confirm

    voice_picking:
      - Hands-free
      - Audio direction
      - Voice confirmation

    pick_to_light:
      - Light-directed
      - High speed
      - Error reduction

    vision_picking:
      - AR/smart glasses
      - Visual direction
      - Image capture
```

### Packing Operations

```yaml
packing:
  process:
    - Pack list verification
    - Item inspection
    - Carton selection
    - Pack execution
    - Label application
    - Weight verification

  cartonization:
    - Optimal carton size
    - Void fill minimization
    - Weight distribution
    - Dimensional optimization

  materials:
    - Cartons/boxes
    - Void fill (air pillows, paper)
    - Protective packaging
    - Temperature protection
    - Labels and documents

  quality:
    - Pack accuracy verification
    - Weight check
    - Dimension check
    - Label accuracy
    - Documentation completeness
```

### Shipping Operations

```yaml
shipping:
  order_completion:
    - Pack verification
    - Shipping label generation
    - Documentation printing
    - Carrier assignment
    - Manifest creation

  carrier_management:
    - Rate shopping
    - Service selection
    - Carrier compliance
    - Pickup scheduling

  dock_operations:
    - Staging lane assignment
    - Loading sequence
    - Trailer loading
    - Departure confirmation

  documentation:
    - Bill of lading
    - Shipping labels
    - Packing lists
    - Commercial invoices
    - Customs documents

  tracking:
    - Shipment confirmation
    - Tracking number capture
    - Delivery confirmation
    - Exception management
```

### Warehouse Management System

```yaml
wms:
  core_functions:
    receiving:
      - ASN processing
      - Receipt confirmation
      - Put-away direction
      - QC integration

    inventory:
      - Location management
      - Inventory visibility
      - Cycle counting
      - Adjustment processing

    order_management:
      - Wave planning
      - Task creation
      - Work distribution
      - Order status

    shipping:
      - Pack/ship confirmation
      - Label generation
      - Carrier integration
      - Manifest management

  integration:
    - ERP (orders, inventory)
    - TMS (shipping, rates)
    - E-commerce platforms
    - Carrier systems
    - MHE (material handling)

  configuration:
    - Zone definition
    - Location setup
    - Task priorities
    - User permissions
    - Business rules
```

### Material Handling Equipment

```yaml
mhe:
  storage_equipment:
    - Selective racking
    - Drive-in/drive-through
    - Push-back racking
    - Pallet flow
    - Cantilever
    - Carton flow
    - Shelving

  movement_equipment:
    - Forklifts (sit-down, reach, turret)
    - Pallet jacks
    - Order pickers
    - Conveyors (belt, roller, sortation)
    - AGVs/AMRs
    - AS/RS systems

  picking_aids:
    - Pick carts
    - RF devices
    - Voice headsets
    - Pick-to-light
    - Smart glasses
```

### Warehouse Metrics

```yaml
metrics:
  receiving:
    - Receipt processing time
    - Dock-to-stock time
    - Receiving accuracy
    - Put-away productivity

  inventory:
    - Inventory accuracy
    - Location accuracy
    - Fill rate
    - Turns

  picking:
    - Lines per hour
    - Units per hour
    - Pick accuracy
    - Travel distance

  packing:
    - Pack rate
    - Carton fill rate
    - Pack accuracy
    - Cost per order

  shipping:
    - On-time shipment
    - Shipping accuracy
    - Cost per shipment
    - Carrier compliance

  overall:
    - Order cycle time
    - Perfect order rate
    - Cost per order
    - Space utilization
    - Labor productivity
```

### Safety and Compliance

```yaml
safety:
  requirements:
    - Forklift certification
    - Personal protective equipment
    - Aisle clearances
    - Load weight limits
    - Ergonomic standards
    - Emergency procedures

  regulatory:
    - OSHA compliance
    - Fire codes
    - Hazmat handling
    - Temperature requirements
    - Food safety (if applicable)

  best_practices:
    - Regular safety training
    - Incident reporting
    - Equipment inspection
    - Housekeeping standards
```


## References
- `references/output-format.md` — Output Format
