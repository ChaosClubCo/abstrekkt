---
name: automotive-manufacturing
description: Helps manage and audit automotive manufacturing processes. Expert guidance for automotive production systems, quality management (IATF 16949), lean manufacturing principles, supply chain coordination, and vehicle assembly process optimization. Use when navigating industry-specific regulations, processes, or operations.
---

# Automotive Manufacturing Skill

> Auto production systems, quality management, lean manufacturing, and supply chain excellence

## Description

This skill provides comprehensive guidance for automotive manufacturing operations including production planning and control, quality management systems aligned with IATF 16949, lean manufacturing and Toyota Production System principles, supply chain coordination, and vehicle assembly optimization. It addresses the unique demands of automotive production including just-in-time delivery, zero-defect targets, traceability requirements, and the integration of advanced manufacturing technologies. The skill supports plant managers, quality engineers, production supervisors, and supply chain professionals across OEM and tier supplier environments.

## Activation Triggers

- User mentions "automotive manufacturing", "auto production", or "vehicle assembly"
- User asks about IATF 16949, APQP, or PPAP requirements
- User needs help with lean manufacturing or Toyota Production System
- User discusses automotive quality systems or FMEA
- User asks about production line balancing or takt time
- User mentions just-in-time, kanban, or pull systems
- User needs guidance on automotive supply chain management
- User asks about SPC in automotive context
- User discusses launch readiness or new model introduction
- User mentions automotive CAPA, 8D, or problem-solving methods

## Instructions

### Core Workflow

1. **Production System Design**
   - Define production layout and material flow
   - Calculate takt time and line balance
   - Establish standard work procedures
   - Design workstation ergonomics and tooling
   - Implement visual management and andon systems

2. **Quality System Implementation**
   - Deploy IATF 16949-compliant quality management system
   - Execute Advanced Product Quality Planning (APQP)
   - Conduct Design and Process FMEA
   - Establish measurement systems and SPC controls
   - Implement layered process audits

3. **Lean Operations Management**
   - Eliminate waste across all value streams
   - Implement pull systems and kanban scheduling
   - Drive continuous improvement through kaizen events
   - Standardize work and maintain 5S discipline
   - Deploy Total Productive Maintenance (TPM)

4. **Supply Chain Coordination**
   - Manage tiered supplier relationships and development
   - Coordinate just-in-time material delivery
   - Execute supplier PPAP and quality requirements
   - Monitor supply chain risk and contingency planning
   - Optimize logistics and packaging specifications

5. **Launch and Continuous Improvement**
   - Execute new model launch readiness reviews
   - Manage engineering change implementation
   - Track OEE and production KPIs
   - Conduct management review and quality planning
   - Drive year-over-year cost and quality improvements

### IATF 16949 Quality Framework

```yaml
iatf_16949_framework:
  core_tools:
    apqp:
      phases:
        phase_1: "Plan and Define Program"
        phase_2: "Product Design and Development Verification"
        phase_3: "Process Design and Development Verification"
        phase_4: "Product and Process Validation"
        phase_5: "Feedback Assessment and Corrective Action"
      deliverables:
        - Design records and engineering specifications
        - Process flow diagrams
        - PFMEA and control plans
        - Measurement system analysis
        - Initial process capability studies
        - Production part approval (PPAP)

    ppap:
      submission_levels:
        level_1: "Warrant only"
        level_2: "Warrant with product samples and limited data"
        level_3: "Warrant with product samples and complete data"
        level_4: "Warrant and other requirements per customer"
        level_5: "Warrant with complete data at supplier site"
      required_elements:
        - Design records and change documents
        - Process flow diagram, PFMEA, and control plan
        - MSA studies and dimensional results
        - Material and performance test results
        - Initial process studies (Cpk/Ppk)
        - Sample parts, master sample, and checking aids
        - Part submission warrant (PSW)

    fmea:
      design_fmea:
        - Identify potential failure modes
        - Determine effects and severity
        - Identify causes and occurrence
        - Evaluate current controls and detection
        - Calculate Action Priority (AP) per AIAG-VDA method
        - Implement optimization actions
      process_fmea:
        - Map process steps and functions
        - Identify failure modes per step
        - Assess severity of effects
        - Determine causes and occurrence
        - Evaluate detection controls
        - Prioritize and assign actions

    spc:
      automotive_requirements:
        - Process capability studies (Cpk >= 1.33 minimum)
        - Special characteristic monitoring
        - Control chart maintenance
        - Reaction plans for out-of-control conditions
        - Long-term capability tracking (Ppk)

    msa:
      studies: "Gage R&R, bias, linearity, stability, attribute agreement"
      acceptance: "GRR < 10% acceptable, 10-30% marginal, > 30% unacceptable"

  customer_specific:
    oem_requirements: "Ford Q1, GM BIQS, Stellantis SQ, Toyota, VW Formel Q"
```

### Lean Manufacturing System

```yaml
lean_manufacturing:
  toyota_production_system:
    pillars:
      just_in_time:
        principles:
          - Produce only what is needed
          - Deliver only when needed
          - Supply only the quantity needed
        tools:
          - Takt time calculation
          - Continuous flow
          - Pull system / kanban
          - Level scheduling (heijunka)
          - SMED (quick changeover)

      jidoka:
        principles:
          - Build quality in at the process
          - Stop and fix problems immediately
          - Separate human work from machine work
        tools:
          - Andon systems
          - Poka-yoke (error proofing)
          - In-station quality checks
          - Autonomation
          - Standard work

    foundation:
      stability:
        - 5S workplace organization
        - Total Productive Maintenance
        - Standardized work
        - Visual management
      continuous_improvement:
        - Kaizen events and daily kaizen
        - A3 problem solving
        - Value stream mapping
        - Genchi genbutsu (go and see)

  waste_elimination:
    eight_wastes:
      transport: "Unnecessary movement of materials"
      inventory: "Excess raw material, WIP, or finished goods"
      motion: "Unnecessary movement of people"
      waiting: "Idle time between process steps"
      overproduction: "Making more than demanded"
      overprocessing: "More work than required by customer"
      defects: "Rework, scrap, and corrections"
      skills: "Underutilized people and capabilities"

  production_metrics:
    oee:
      availability: "(Run time / Planned production time) x 100"
      performance: "(Ideal cycle time x Total count / Run time) x 100"
      quality: "(Good count / Total count) x 100"
      oee_formula: "Availability x Performance x Quality"
      world_class: ">= 85%"

    line_balance:
      takt_time: "Available production time / Customer demand"
      cycle_time: "Time to complete one unit at a station"
      balance_efficiency: "Sum of cycle times / (Takt time x Number of stations)"
```

### Templates

#### PPAP Submission Package Checklist
```markdown
# PPAP Submission Checklist

## Part Information
- Part Number: [Number]
- Part Name: [Name]
- Customer: [OEM Name]
- Submission Level: [1-5]
- Submission Reason: [New/Change/Re-approval]

## Element Checklist
| # | Element | Required | Status | Comments |
|---|---------|----------|--------|----------|
| 1 | Design Records | [Y/N] | [Complete/Pending] | |
| 2 | Authorized Engineering Change Documents | [Y/N] | [Complete/Pending] | |
| 3 | Engineering Approval | [Y/N] | [Complete/Pending] | |
| 4 | DFMEA | [Y/N] | [Complete/Pending] | |
| 5 | Process Flow Diagram | [Y/N] | [Complete/Pending] | |
| 6 | PFMEA | [Y/N] | [Complete/Pending] | |
| 7 | Control Plan | [Y/N] | [Complete/Pending] | |
| 8 | MSA Studies | [Y/N] | [Complete/Pending] | |
| 9 | Dimensional Results | [Y/N] | [Complete/Pending] | |
| 10 | Material/Performance Tests | [Y/N] | [Complete/Pending] | |
| 11 | Initial Process Studies | [Y/N] | [Complete/Pending] | |
| 12 | Qualified Lab Documentation | [Y/N] | [Complete/Pending] | |
| 13 | AAR (if applicable) | [Y/N] | [Complete/Pending] | |
| 14 | Sample Parts | [Y/N] | [Complete/Pending] | |
| 15 | Master Sample | [Y/N] | [Complete/Pending] | |
| 16 | Checking Aids | [Y/N] | [Complete/Pending] | |
| 17 | Customer-Specific Requirements | [Y/N] | [Complete/Pending] | |
| 18 | PSW (Part Submission Warrant) | [Y/N] | [Complete/Pending] | |

## Process Capability Summary
| Characteristic | Spec | Cpk | Ppk | Status |
|---------------|------|-----|-----|--------|
| [SC/CC] | [Tolerance] | [Value] | [Value] | [Accept/Reject] |
```

#### 8D Problem-Solving Report
```markdown
# 8D Problem-Solving Report

## D0 - Emergency Response Action
- Problem Detected: [Date] | Reported By: [Name]
- Containment: [Immediate actions taken to protect customer]

## D1 - Team Formation
| Role | Name | Department |
|------|------|------------|
| Champion | [Name] | [Dept] |
| Team Lead | [Name] | [Dept] |
| Members | [Names] | [Depts] |

## D2 - Problem Description (IS / IS NOT)
| Factor | IS | IS NOT |
|--------|-----|---------|
| What | [Description] | [Not this] |
| Where | [Location] | [Not here] |
| When | [Timing] | [Not then] |
| How Much | [Extent] | [Not that] |

## D3 - Interim Containment Actions
| Action | Owner | Date | Verification |
|--------|-------|------|-------------|
| [Action] | [Name] | [Date] | [Method] |

## D4 - Root Cause Analysis
- Method: [5-Why / Fishbone / Fault Tree]
- Verified Root Cause: [Description]
- Evidence: [How root cause was verified]

## D5 - Permanent Corrective Actions
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action] | [Name] | [Date] | [Status] |

## D6 - Implementation and Validation
- Implementation Date: [Date]
- Validation Method: [Description]
- Results: [Evidence of effectiveness]

## D7 - Preventive Actions
| Systemic Action | Scope | Owner | Status |
|----------------|-------|-------|--------|
| [Action] | [Where applied] | [Name] | [Status] |

## D8 - Team Recognition
- Closure Date: [Date]
- Lessons Learned: [Summary]
```

### Best Practices

- Apply the APQP methodology rigorously for all new product introductions; shortcuts create downstream quality escapes
- Maintain living FMEAs that are updated with every engineering change and field failure
- Calculate and monitor OEE daily to identify availability, performance, and quality losses
- Use standardized work as the baseline for all improvement activities, not as a static document
- Implement error-proofing (poka-yoke) at every special characteristic operation
- Conduct layered process audits from team leader through plant manager level
- Require PPAP re-submission for any process change that affects form, fit, function, or durability
- Establish clear escalation paths (andon response, quality alerts, stop-ship procedures)
- Drive supplier development through regular quality reviews, scorecards, and on-site support
- Use A3 thinking as the standard problem-solving language across the organization
- Balance line loading within 5% of takt time to minimize waiting and overtime waste
- Maintain strict FIFO (first-in-first-out) material management to prevent mix-ups and aging
- Conduct regular value stream mapping to identify systemic flow and waste issues
- Integrate quality gates at major assembly milestones with clear pass/fail criteria

### Common Patterns

#### Pattern: New Model Launch Readiness
```
1. Complete APQP Phase 1-3 deliverables per timing plan
2. Conduct pre-launch control plan runs with elevated inspection
3. Execute production trial runs (PTR) at line rate
4. Verify Cpk >= 1.67 for all special characteristics
5. Complete PPAP submission and obtain customer approval
6. Conduct GP-12 early production containment (if required)
7. Transition to production control plan after stability confirmed
8. Monitor warranty and field data for 90 days post-launch
```

#### Pattern: Supplier Quality Escalation
```
1. Issue quality notification to supplier with defect data
2. Require 8D response within 24 hours for containment
3. If repeat issue, escalate to Supplier Quality Alert (Level 1)
4. Require on-site sorting and containment at supplier expense
5. If no improvement, escalate to New Business Hold (Level 2)
6. Conduct joint root cause analysis at supplier facility
7. Verify permanent corrective actions through re-PPAP
8. Monitor performance for 90 days before de-escalation
```

### Output Formats

#### Production Performance Dashboard
```markdown
# Automotive Production Dashboard: [Plant/Line]

## Production Summary (Current Shift/Day)
| Metric | Target | Actual | Variance |
|--------|--------|--------|----------|
| Units Produced | [Target] | [Actual] | [+/-] |
| Takt Time | [Seconds] | [Actual] | [+/-] |
| OEE | [%] | [%] | [+/-] |
| First Time Through | [%] | [%] | [+/-] |
| Scrap Rate | [PPM] | [PPM] | [+/-] |

## Quality Alerts
| Alert | Severity | Station | Status |
|-------|----------|---------|--------|
| [Description] | [Red/Yellow] | [Station] | [Open/Contained] |

## Top Downtime Events
| Event | Duration | Category | Root Cause |
|-------|----------|----------|------------|
| [Event] | [Minutes] | [Breakdown/Changeover/Quality] | [Cause] |

## Supplier Delivery Performance
| Supplier | On-Time % | Quality PPM | Escalation Level |
|----------|-----------|-------------|-----------------|
| [Supplier] | [%] | [PPM] | [None/L1/L2] |
```

#### Launch Readiness Scorecard
```markdown
# Launch Readiness Review: [Program/Model]

## Overall Readiness: [Green/Yellow/Red]

## Category Status
| Category | Status | Score | Open Items |
|----------|--------|-------|------------|
| Design Release | [G/Y/R] | [%] | [Count] |
| Tooling & Equipment | [G/Y/R] | [%] | [Count] |
| Process Validation | [G/Y/R] | [%] | [Count] |
| Supplier Readiness | [G/Y/R] | [%] | [Count] |
| Staffing & Training | [G/Y/R] | [%] | [Count] |
| PPAP Status | [G/Y/R] | [%] | [Count] |
| Logistics & Packaging | [G/Y/R] | [%] | [Count] |

## Critical Path Items
| Item | Owner | Due Date | Risk |
|------|-------|----------|------|
| [Item] | [Name] | [Date] | [H/M/L] |
```

## Version History

- 1.0.0: Initial automotive manufacturing skill
