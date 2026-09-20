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


## References
- `references/output-format.md` — Output Format
- `references/references.md` — References
- `references/standard-work.md` — Standard Work
