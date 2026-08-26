---
name: maritime-operations
description: Helps manage and audit maritime operations processes. Expert guidance for maritime shipping operations, port and terminal management, vessel operations and crewing, regulatory compliance with IMO and flag state requirements, and maritime safety systems. Use when navigating industry-specific regulations, processes, or operations.
---

# Maritime Operations Skill

> Shipping operations, port management, vessel operations, and maritime regulatory compliance

## Description

This skill provides comprehensive guidance for maritime operations including commercial shipping management, port and terminal operations, vessel operations and fleet management, maritime regulatory compliance with IMO conventions and flag state requirements, and maritime safety and environmental protection. It covers container shipping, bulk cargo, tanker operations, offshore support, and passenger vessels. The skill supports port directors, fleet managers, marine superintendents, designated persons ashore (DPA), and maritime compliance officers in managing safe, efficient, and compliant maritime operations across global trade lanes.

## Activation Triggers

- User mentions "maritime operations", "shipping management", or "vessel operations"
- User asks about port management, terminal operations, or berth planning
- User needs help with IMO regulations, SOLAS, or MARPOL compliance
- User discusses marine safety management, ISM Code, or maritime SMS
- User asks about charter party agreements, voyage planning, or freight rates
- User mentions crew management, manning, or STCW certification
- User needs guidance on cargo operations, stowage planning, or container logistics
- User asks about vessel maintenance, classification society surveys, or PSC inspections
- User discusses ballast water management, emissions compliance, or environmental regulations
- User mentions maritime insurance, P&I clubs, or marine claims

## Instructions

### Core Workflow

1. **Fleet and Vessel Management**
   - Maintain vessel registry, certifications, and class status
   - Plan and execute dry-docking and maintenance schedules
   - Manage crewing levels, certifications, and rotation schedules
   - Monitor vessel performance (speed, consumption, condition)
   - Coordinate with classification societies and flag state authorities

2. **Commercial Operations**
   - Evaluate charter party opportunities and freight market conditions
   - Plan voyages with optimal routing, bunkering, and port calls
   - Manage cargo booking, stowage planning, and documentation
   - Coordinate port agency services and terminal operations
   - Handle demurrage, laytime calculations, and commercial claims

3. **Regulatory Compliance**
   - Maintain compliance with SOLAS, MARPOL, and MLC conventions
   - Implement and audit ISM Code safety management system
   - Prepare for and manage Port State Control inspections
   - Track regulatory changes and implement within deadlines
   - Maintain statutory and class certification schedules

4. **Port and Terminal Operations**
   - Optimize berth allocation and vessel scheduling
   - Manage cargo handling operations and equipment utilization
   - Coordinate pilot, tug, and mooring services
   - Operate terminal management systems for throughput optimization
   - Ensure port security compliance with ISPS Code

5. **Safety and Environmental Management**
   - Implement maritime SMS per ISM Code requirements
   - Conduct shipboard safety drills and exercises
   - Manage environmental compliance (emissions, ballast water, waste)
   - Investigate maritime incidents and implement corrective actions
   - Monitor weather routing and navigational safety

### Maritime Regulatory Framework

```yaml
maritime_regulations:
  imo_conventions:
    solas:
      full_name: "Safety of Life at Sea"
      key_chapters:
        chapter_ii: "Construction, fire protection"
        chapter_iii: "Life-saving appliances"
        chapter_v: "Safety of navigation"
        chapter_ix: "ISM Code - safe operation management"
        chapter_xi: "Maritime safety and security (ISPS)"

    marpol:
      full_name: "Prevention of Pollution from Ships"
      annexes:
        annex_i: "Oil pollution prevention"
        annex_ii: "Noxious liquid substances in bulk"
        annex_iii: "Harmful substances in packaged form"
        annex_iv: "Sewage from ships"
        annex_v: "Garbage from ships"
        annex_vi: "Air pollution and greenhouse gas emissions"
      emissions_compliance:
        sox_limits:
          global: "0.50% sulfur (since 2020)"
          eca: "0.10% sulfur in Emission Control Areas"
        nox_tiers:
          tier_i: "Ships built 2000-2010"
          tier_ii: "Ships built 2011-2015"
          tier_iii: "Ships built 2016+ in NECAs"
        eexi: "Energy Efficiency Existing Ship Index"
        cii: "Carbon Intensity Indicator (annual rating A-E)"

    mlc:
      full_name: "Maritime Labour Convention"
      covers: "Seafarer requirements, employment conditions, accommodation, health, compliance"

    stcw:
      full_name: "Standards of Training, Certification and Watchkeeping"
      covers: "Training standards, certification by rank, watchkeeping, rest hours, revalidation"

  ism_code:
    safety_management_system:
      elements:
        - Safety policy, company and master responsibilities
        - DPA designation and resources
        - Shipboard operations and emergency preparedness
        - Non-conformity reporting, maintenance, and documentation
        - Company verification and certification

    documentation:
      doc: "Document of Compliance (company level)"
      smc: "Safety Management Certificate (vessel level)"
      audit_cycle: "Initial, annual, intermediate, renewal (5-year cycle)"

  isps_code:
    security_levels:
      level_1: "Normal - minimum security measures at all times"
      level_2: "Heightened - additional measures for period of heightened risk"
      level_3: "Exceptional - specific measures for probable or imminent threat"
    required_plans:
      ssp: "Ship Security Plan"
      pfsp: "Port Facility Security Plan"
    personnel:
      cso: "Company Security Officer"
      sso: "Ship Security Officer"
      pfso: "Port Facility Security Officer"
```

### Port and Terminal Operations Framework

```yaml
port_operations:
  berth_planning:
    factors:
      - Vessel LOA, beam, and draft requirements
      - Cargo type and handling equipment compatibility
      - Tidal windows and navigational restrictions
      - Berth availability and priority scheduling
      - Weather and swell conditions
    optimization:
      - Minimize vessel waiting time (berth on arrival target)
      - Maximize berth occupancy rate
      - Balance workload across terminals
      - Coordinate with pilot and tug schedules
      - Manage bunker and provision delivery alongside

  cargo_operations:
    container_terminal:
      kpis:
        berth_productivity: "Moves per hour per crane (target 25-35)"
        yard_utilization: "Container slots occupied vs. capacity"
        truck_turnaround: "Gate-in to gate-out time"
        vessel_turnaround: "Berth to departure time"
        dwell_time: "Average days container stays in yard"
      equipment:
        quay_cranes: "Ship-to-shore container handling"
        rtg_rmg: "Rubber/rail-mounted gantry cranes for yard stacking"
        straddle_carriers: "Container transport and stacking"
        terminal_tractors: "Horizontal transport with chassis"
        reach_stackers: "Flexible container handling for lower volumes"

    bulk_terminal:
      operations:
        - Draft surveys and cargo quantity determination
        - Loading/discharge rate monitoring
        - Cargo sampling and quality testing
        - Trimming and securing requirements

    tanker_terminal:
      operations:
        - Mooring and STS (ship-to-ship) transfer protocols
        - Loading/discharge rate management
        - Vapor emission controls
        - Spill response and containment readiness

  vessel_services:
    port_services: "Pilotage, towage, mooring, waste reception, bunkering"
    documentation: "NOR, SOF, bills of lading, customs clearance, port health, DG declarations"

  port_security:
    isps_compliance:
      - Access control and identification
      - Cargo inspection and screening
      - Security drills and exercises
```

### Templates

#### Vessel Compliance Status Report
```markdown
# Vessel Compliance Status: [Vessel Name]

## Vessel Information
- IMO Number: [Number]
- Flag State: [State]
- Classification Society: [Society]
- Vessel Type: [Container/Bulk/Tanker/etc.]
- DWT/TEU: [Capacity]
- Year Built: [Year]

## Certification Status
| Certificate | Issued | Expires | Status |
|------------|--------|---------|--------|
| SMC / ISSC / Class Certificate | [Date] | [Date] | [Valid/Due] |
| ITC / ILL / IOPP | [Date] | [Date] | [Valid/Due] |
| Air Pollution / Ballast Water / MLC | [Date] | [Date] | [Valid/Due] |

## Survey Status
| Survey | Last Completed | Next Due | Status |
|--------|---------------|----------|--------|
| Annual Class Survey | [Date] | [Date] | [Status] |
| Intermediate Survey | [Date] | [Date] | [Status] |
| Special Survey | [Date] | [Date] | [Status] |
| Dry Dock | [Date] | [Date] | [Status] |
| ISM Audit | [Date] | [Date] | [Status] |

## CII Rating
- Current Rating: [A/B/C/D/E]
- Required EEXI: [Value]
- Attained EEXI: [Value]
- Corrective Plan: [Required Y/N]

## Port State Control History (Last 12 Months)
| Port | Date | Inspections | Deficiencies | Detentions |
|------|------|-------------|-------------|------------|
| [Port] | [Date] | [Count] | [Count] | [Y/N] |

## Open Deficiencies
| Source | Description | Due Date | Owner | Status |
|--------|-------------|----------|-------|--------|
| [PSC/Class/Flag/ISM] | [Description] | [Date] | [Name] | [Open/In Progress] |
```

#### Port Call Planning Checklist
```markdown
# Port Call Plan: [Vessel Name] at [Port]

## Voyage Details
- ETA: [Date/Time UTC]
- ETD: [Date/Time UTC]
- Berth: [Berth Number]
- Agent: [Agent Name/Contact]
- Cargo Operation: [Load/Discharge/Both]

## Pre-Arrival Requirements
- [ ] Advance arrival notification sent (72h, 48h, 24h)
- [ ] Customs and immigration documentation submitted
- [ ] ISPS security information exchanged
- [ ] Bunker delivery confirmed (if planned)
- [ ] Pilot boarding and tug arrangements confirmed

## Cargo Operations Plan
- Cargo Quantity: [Amount in MT/TEU]
- Estimated Duration: [Hours]
- Stowage Plan: [Reference number]
- Special Requirements: [Cold chain/hazmat/OOG]

## Port Services Required
- [ ] Pilotage / Tugs / Mooring: [Details]
- [ ] Bunkering: [Quantity and type]
- [ ] Crew change: [Number sign-on/sign-off]
- [ ] Surveys/Inspections: [Scheduled Y/N]
```

### Best Practices

- Maintain a robust ISM Code safety management system that goes beyond paper compliance to drive real safety outcomes
- Prepare for Port State Control inspections continuously rather than reactively before port calls
- Monitor CII ratings proactively and implement voyage optimization to maintain acceptable ratings
- Conduct thorough pre-arrival checklists for every port call to prevent documentation delays
- Manage crew fatigue by monitoring rest hours and voyage schedules against MLC and STCW requirements
- Keep classification society survey windows current and plan ahead for special surveys and dry-docking
- Implement voyage performance monitoring to optimize speed, consumption, and weather routing
- Maintain open communication channels between ship and shore through the DPA function
- Track regulatory developments at IMO and flag state level with at least 12 months lead time
- Conduct realistic emergency drills including fire, abandon ship, pollution response, and security scenarios
- Manage ballast water treatment compliance based on vessel-specific implementation schedules
- Build relationships with port agents and terminal operators for priority berth access and service quality
- Maintain comprehensive spares inventory management to minimize off-hire from equipment failures
- Document all non-conformities and near-misses as inputs to continuous improvement

### Common Patterns

#### Pattern: Port State Control Inspection Preparation
```
1. Review vessel's PSC history and common detention deficiency areas
2. Verify all statutory and class certificates are valid and onboard
3. Conduct pre-arrival self-inspection using Paris MOU or Tokyo MOU checklist
4. Test all safety equipment (lifeboats, fire systems, navigation equipment)
5. Verify crew certificates, rest hour records, and training documentation
6. Ensure MARPOL compliance (ORB, garbage log, ballast water records)
7. Brief crew on inspection protocol and cooperation requirements
8. Correct any identified deficiencies before arrival in port
```

#### Pattern: Vessel Dry-Docking Management
```
1. Develop dry-dock specification 6-12 months in advance
2. Obtain competitive bids from qualified shipyards
3. Prepare detailed work scope including class-required items
4. Coordinate with classification society for survey attendance
5. Manage yard period with daily progress meetings and change orders
6. Conduct sea trials and commissioning of repaired/upgraded systems
7. Obtain updated certificates and endorsements before departure
8. Document all completed work for maintenance records and class files
```

#### Pattern: Cargo Damage Claim Response
```
1. Document damage with photographs, survey reports, and mate's receipts
2. Issue letter of protest if damage noted at loading or discharge
3. Appoint independent surveyor to assess extent and cause of damage
4. Gather all relevant documentation (bills of lading, stowage plan, weather logs)
5. Notify P&I club and charterer/cargo interests
6. Cooperate with cargo surveyor and provide access to vessel records
7. Prepare master's report with factual account of cargo handling
8. Support P&I club in claim defense or settlement negotiation
```

### Output Formats

#### Fleet Operations Dashboard
```markdown
# Fleet Operations Dashboard: [Company Name]

## Fleet Status
| Vessel | Status | Position | Next Port | ETA | Charter |
|--------|--------|----------|-----------|-----|---------|
| [Name] | [At sea/In port/Dry dock] | [Lat/Long or Port] | [Port] | [Date] | [TC/VC/Spot] |

## Performance Summary (Period)
| Metric | Fleet Avg | Target | Best Vessel | Worst Vessel |
|--------|----------|--------|-------------|-------------|
| Utilization | [%] | >= 95% | [Name/Value] | [Name/Value] |
| Off-Hire Days | [Days] | < [Target] | [Name/Value] | [Name/Value] |
| Fuel Consumption vs. Warranty | [%] | <= 100% | [Name/Value] | [Name/Value] |
| PSC Deficiency Rate | [Per inspection] | < 1.0 | [Name/Value] | [Name/Value] |
| CII Average Rating | [Letter] | B or better | [Name/Value] | [Name/Value] |

## Upcoming Events
| Vessel | Event | Due Date | Status |
|--------|-------|----------|--------|
| [Name] | [Survey/Dry dock/Certificate renewal] | [Date] | [Planned/Overdue] |

## Financial Summary
| Category | Budget | Actual | Variance |
|----------|--------|--------|----------|
| TCE Revenue | $[Amount] | $[Amount] | [+/-] |
| Voyage Costs | $[Amount] | $[Amount] | [+/-] |
| Operating Costs | $[Amount] | $[Amount] | [+/-] |
| Dry Dock Costs | $[Amount] | $[Amount] | [+/-] |
```

#### Voyage Performance Report
```markdown
# Voyage Performance Report: [Vessel Name]

## Voyage: [Origin] to [Destination]
- Departure: [Date/Time] | Arrival: [Date/Time]
- Distance: [Nautical miles] | Duration: [Days/Hours]
- Cargo: [Type and quantity]

## Performance vs. Charter Party
| Metric | CP Warranty | Actual | Variance |
|--------|------------|--------|----------|
| Speed (knots) | [Value] | [Value] | [+/-] |
| Consumption (MT/day) | [Value] | [Value] | [+/-] |
| Weather Days Claimed | N/A | [Days] | - |

## Bunker Summary
| Fuel Type | ROB Departure | Consumed | ROB Arrival | Avg Price |
|-----------|--------------|----------|-------------|-----------|
| VLSFO | [MT] | [MT] | [MT] | $[/MT] |
| LSMGO | [MT] | [MT] | [MT] | $[/MT] |

## Voyage P&L
| Item | Amount |
|------|--------|
| Freight/Hire | $[Amount] |
| Bunker Costs | -$[Amount] |
| Port Costs | -$[Amount] |
| Canal Dues | -$[Amount] |
| **TCE/Day** | **$[Amount]** |
```

## Version History

- 1.0.0: Initial maritime operations skill
