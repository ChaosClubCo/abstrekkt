---
name: energy-management
description: Comprehensive guidance for energy management including energy auditing, building energy optimization, renewable energy integration, demand response, power procurement, carbon accounting, ISO 50001 compliance, and utility rate analysis for commercial, industrial, and institutional facilities. Use when navigating industry-specific regulations, processes, or operations.
---

# Energy Management Skill

> Energy auditing, efficiency optimization, renewable integration, and carbon reduction strategies

## Description

This skill provides comprehensive guidance for energy management across commercial, industrial, and institutional facilities. It covers energy auditing and benchmarking, building energy optimization, renewable energy procurement and integration, demand response programs, utility rate analysis, power purchase agreements, carbon accounting and reporting, ISO 50001 energy management systems, and regulatory compliance. The skill supports energy managers, facility managers, sustainability officers, utilities analysts, and building operations professionals in reducing energy consumption, costs, and carbon emissions.

## Activation Triggers

- User mentions "energy management", "energy efficiency", "energy audit"
- User asks about building energy optimization or HVAC efficiency
- User needs help with renewable energy procurement or solar/wind integration
- User discusses demand response or load management
- User asks about utility rate analysis or tariff optimization
- User mentions carbon accounting, carbon footprint, or emissions tracking
- User needs ISO 50001 or energy management system guidance
- User asks about power purchase agreements (PPAs) or energy procurement
- User discusses energy benchmarking or ENERGY STAR certification
- User mentions energy storage, battery systems, or microgrids

## Instructions

### Core Workflow

1. **Energy Baseline and Benchmarking**
   - Collect 24-36 months of utility billing data
   - Establish energy use intensity (EUI) baselines
   - Benchmark against ENERGY STAR Portfolio Manager
   - Analyze load profiles and demand patterns
   - Identify weather-normalized consumption trends

2. **Energy Audit and Assessment**
   - Conduct ASHRAE-level energy audit (Level I, II, or III)
   - Inventory all energy-consuming systems and equipment
   - Identify energy conservation measures (ECMs)
   - Calculate savings potential and implementation costs
   - Prioritize measures by payback and strategic value

3. **Implementation Planning**
   - Develop energy conservation measure specifications
   - Evaluate procurement options (direct purchase, ESCO, PPA)
   - Establish measurement and verification (M&V) protocols
   - Create implementation schedule and budget
   - Secure financing and incentive approvals

4. **Monitoring and Optimization**
   - Deploy energy monitoring and information systems (EMIS)
   - Track performance against baseline with IPMVP protocols
   - Optimize building automation system (BAS) schedules and setpoints
   - Analyze interval data for demand management opportunities
   - Generate periodic energy performance reports

5. **Continuous Improvement**
   - Review and update energy management plans annually
   - Retro-commission systems on 3-5 year cycles
   - Evaluate emerging technologies and market opportunities
   - Report carbon reductions and sustainability progress
   - Maintain ISO 50001 certification through internal audits

### Energy Auditing Framework

```yaml
energy_auditing:
  ashrae_audit_levels:
    level_1:
      name: "Walk-Through Analysis"
      scope: "Preliminary assessment of energy use"
      effort: "1-2 days site visit"
      deliverable: "High-level savings estimates, low/no-cost measures"
      accuracy: "+/- 40%"

    level_2:
      name: "Energy Survey and Analysis"
      scope: "Detailed analysis of systems and operations"
      effort: "1-3 weeks analysis"
      deliverable: "ECM list with costs, savings, and payback calculations"
      accuracy: "+/- 20%"
      components:
        - Detailed utility bill analysis
        - Equipment inventory and nameplate data
        - Operating schedule documentation
        - Energy end-use breakdown
        - Financial analysis of identified ECMs

    level_3:
      name: "Detailed Analysis of Capital-Intensive Modifications"
      scope: "Investment-grade analysis for major projects"
      effort: "Several weeks to months"
      deliverable: "Detailed engineering analysis, hourly energy modeling"
      accuracy: "+/- 10%"
      components:
        - Hourly building energy simulation (eQUEST, EnergyPlus)
        - Sub-metering and data logging
        - Detailed cost estimates
        - Life cycle cost analysis
        - Risk and sensitivity analysis

  energy_end_use_breakdown:
    commercial_building_typical:
      hvac: "35-45% (heating, cooling, ventilation, pumps, fans)"
      lighting: "15-25%"
      plug_loads: "10-20%"
      domestic_hot_water: "5-10%"
      elevators_escalators: "3-8%"
      other: "5-10%"

    industrial_facility_typical:
      process_heating: "25-40%"
      motor_systems: "15-25%"
      compressed_air: "8-15%"
      process_cooling: "5-15%"
      hvac: "10-20%"
      lighting: "5-10%"

  common_ecms:
    lighting:
      - LED retrofit (40-70% reduction)
      - Occupancy and daylight sensors
      - Lighting controls and scheduling
      - Daylighting harvesting

    hvac:
      - Variable frequency drives on fans and pumps
      - Economizer optimization
      - Demand-controlled ventilation (CO2-based)
      - Chiller plant optimization
      - Heat recovery systems
      - BAS programming and scheduling
      - Duct sealing and insulation

    building_envelope:
      - Window film or replacement
      - Roof insulation upgrade
      - Air sealing and weather stripping
      - Cool roof coating

    process:
      - Compressed air leak repair
      - Heat recovery from process exhaust
      - Variable speed drives on process motors
      - Process schedule optimization
```

### Renewable Energy and Procurement Framework

```yaml
renewable_energy:
  on_site_generation:
    solar_pv:
      system_sizing:
        - Assess available roof/ground area and orientation
        - Analyze shading (horizon, near-field)
        - Model production (PVWatts, SAM, Helioscope)
        - Right-size to offset load profile (typically 60-100%)
        - Evaluate battery storage pairing

      financial_models:
        direct_purchase:
          ownership: "Customer owns system"
          incentives: "ITC (30%), MACRS depreciation, state/local"
          payback: "5-8 years typical for commercial"
        ppa:
          ownership: "Third-party developer owns system"
          term: "15-25 years"
          pricing: "$/kWh, escalator 1-3% annually"
          benefit: "No capital outlay, predictable cost"
        lease:
          ownership: "Third-party lessor"
          term: "15-25 years"
          payment: "Fixed monthly payment"

      interconnection:
        - Utility interconnection application
        - System impact study (if > 25 kW typical)
        - Net metering or feed-in tariff enrollment
        - Metering and billing arrangement
        - Commissioning and permission to operate

    energy_storage:
      battery_technologies:
        lithium_ion:
          chemistry: "NMC, LFP"
          duration: "1-4 hours typical"
          efficiency: "85-95% round-trip"
          cycle_life: "3,000-10,000 cycles"
        flow_battery:
          chemistry: "Vanadium redox, zinc-bromine"
          duration: "4-12 hours"
          efficiency: "65-80% round-trip"
          cycle_life: "10,000+ cycles"

      applications:
        - Demand charge reduction (peak shaving)
        - Time-of-use arbitrage
        - Backup power and resilience
        - Solar self-consumption maximization
        - Frequency regulation and grid services
        - Demand response participation

  off_site_procurement:
    virtual_ppa:
      structure: "Financial contract (contract for differences)"
      delivery: "No physical power delivery"
      settlement: "Fixed price vs. market price at node"
      rec_transfer: "Bundled RECs to buyer"
      term: "10-20 years"
      risk: "Basis risk, shape risk, market price volatility"

    retail_green_tariff:
      structure: "Utility-offered renewable rate"
      availability: "Varies by utility and state"
      pricing: "Premium or cost-competitive with standard rate"
      additionality: "Varies; new-build vs. existing generation"

    rec_purchase:
      types:
        bundled: "Paired with energy delivery"
        unbundled: "Separate from physical energy"
      tracking: "Green-e certified, M-RETS, WREGIS, PJM-GATS"
      standards: "RE100, GHG Protocol Scope 2 Guidance"

  demand_response:
    program_types:
      capacity: "Commit to reduce load during system peak events"
      economic: "Curtail when wholesale prices exceed threshold"
      emergency: "Mandatory or voluntary during grid emergencies"
      ancillary: "Frequency regulation, spinning reserve"

    strategies:
      - HVAC pre-cooling and temperature setback
      - Lighting level reduction
      - Process load shifting
      - Backup generator dispatch (where permitted)
      - Battery discharge during events
      - Chilled water and ice storage

    participation:
      - Assess curtailable load (minimum 100 kW typical)
      - Enroll through utility or curtailment service provider
      - Install interval metering and telemetry
      - Develop curtailment operating procedures
      - Train operations staff on event response
      - Verify performance and collect incentive payments
```

### Carbon Accounting Framework

```yaml
carbon_accounting:
  ghg_protocol:
    scopes:
      scope_1:
        definition: "Direct emissions from owned/controlled sources"
        sources:
          - On-site combustion (boilers, furnaces, generators)
          - Company vehicles (fleet)
          - Fugitive emissions (refrigerant leaks)
          - Process emissions

      scope_2:
        definition: "Indirect emissions from purchased energy"
        methods:
          location_based: "Grid average emission factor"
          market_based: "Supplier-specific, RECs, PPAs, residual mix"
        sources:
          - Purchased electricity
          - Purchased steam
          - Purchased heating/cooling

      scope_3:
        definition: "All other indirect emissions in value chain"
        categories:
          upstream:
            - Purchased goods and services
            - Capital goods
            - Fuel/energy-related (not Scope 1/2)
            - Transportation and distribution
            - Waste generated in operations
            - Business travel
            - Employee commuting
          downstream:
            - Transportation and distribution
            - Processing of sold products
            - Use of sold products
            - End-of-life treatment
            - Investments

  emission_factors:
    electricity:
      source: "EPA eGRID (US), IEA (international)"
      unit: "kg CO2e per kWh"
      update: "Annual publication"

    natural_gas:
      factor: "53.06 kg CO2 per MMBtu (combustion)"
      unit: "Also report CH4 and N2O for CO2e"

    refrigerants:
      gwp_examples:
        r410a: "2,088 GWP"
        r134a: "1,430 GWP"
        r32: "675 GWP"
        r290_propane: "3 GWP"
        r744_co2: "1 GWP"

  reporting_frameworks:
    cdp: "Carbon Disclosure Project questionnaire"
    tcfd: "Task Force on Climate-Related Financial Disclosures"
    sbti: "Science Based Targets initiative"
    gri: "Global Reporting Initiative (GRI 302, 305)"
    sec_climate: "SEC climate disclosure rules"
    eu_csrd: "EU Corporate Sustainability Reporting Directive"

  reduction_targets:
    sbti_methodology:
      absolute: "Reduce total emissions by X% by year Y"
      intensity: "Reduce emissions per unit output by X%"
      sector: "Sector-specific decarbonization pathways"
      net_zero: "Long-term target with residual offsets"
```

### Templates

#### Energy Audit Report Template
```markdown
# Energy Audit Report: [Facility Name]

## Facility Overview
- Address: [Address]
- Building Type: [Office / Retail / Industrial / etc.]
- Gross Area: [SF]
- Year Built: [Year]
- Operating Hours: [Hours/week]
- Occupancy: [People]

## Energy Baseline
| Utility | Annual Consumption | Annual Cost | EUI |
|---------|-------------------|-------------|-----|
| Electricity | [kWh] | [$] | [kBtu/SF] |
| Natural Gas | [therms/MMBtu] | [$] | [kBtu/SF] |
| Other | [Units] | [$] | [kBtu/SF] |
| **Total Site EUI** | | **[$]** | **[kBtu/SF]** |

## ENERGY STAR Benchmark
- Score: [1-100]
- National Median EUI: [kBtu/SF]
- Percentile Ranking: [%]

## Energy Conservation Measures
| ECM# | Description | Annual Savings | Cost | Payback | IRR |
|------|-------------|----------------|------|---------|-----|
| 1 | [Measure] | [$] / [kWh/therms] | [$] | [Years] | [%] |
| 2 | [Measure] | [$] / [kWh/therms] | [$] | [Years] | [%] |
| **Total** | | **[$]** | **[$]** | **[Years]** | |

## Implementation Priority
| Priority | ECM# | Rationale |
|----------|------|-----------|
| Immediate (0-6 mo) | [#] | Low/no cost, quick payback |
| Short-term (6-18 mo) | [#] | Moderate cost, good ROI |
| Long-term (18+ mo) | [#] | Capital project, strategic value |

## Available Incentives
| Program | ECM# | Incentive Amount | Application Deadline |
|---------|------|-----------------|---------------------|
| [Utility rebate] | [#] | [$] | [Date] |
| [Federal tax credit] | [#] | [$/%] | [Date] |
```

#### Carbon Emissions Inventory Template
```markdown
# GHG Emissions Inventory: [Organization] - [Year]

## Summary
| Scope | Emissions (MT CO2e) | % of Total | Change YoY |
|-------|--------------------|-----------:|------------|
| Scope 1 | [Amount] | [%] | [+/- %] |
| Scope 2 (Location) | [Amount] | [%] | [+/- %] |
| Scope 2 (Market) | [Amount] | [%] | [+/- %] |
| Scope 3 | [Amount] | [%] | [+/- %] |
| **Total (Market)** | **[Amount]** | **100%** | **[+/- %]** |

## Scope 1 Detail
| Source | Activity Data | Emission Factor | MT CO2e |
|--------|--------------|-----------------|---------|
| Natural Gas | [therms] | [kg CO2/therm] | [Amount] |
| Fleet Vehicles | [gallons] | [kg CO2/gal] | [Amount] |
| Refrigerants | [lbs leaked] | [GWP] | [Amount] |

## Scope 2 Detail
| Source | Consumption | EF (Location) | EF (Market) | MT CO2e |
|--------|------------|---------------|-------------|---------|
| Electricity | [kWh] | [kg/kWh] | [kg/kWh] | [Amount] |
| Steam | [MMBtu] | [kg/MMBtu] | [kg/MMBtu] | [Amount] |

## Reduction Initiatives
| Initiative | Estimated Reduction (MT CO2e) | Status |
|-----------|-------------------------------|--------|
| [Initiative] | [Amount] | [Planned/In Progress/Complete] |

## Progress Against Targets
- Base Year: [Year] | Base Emissions: [MT CO2e]
- Target: [X% reduction by Year Y]
- Current Progress: [% reduction achieved]
```

### Best Practices

1. **Measure Before Improving**: Establish accurate baselines with sub-metering before implementing ECMs
2. **Low-Cost First**: Prioritize operational and behavioral changes (scheduling, setpoints) before capital projects
3. **Retro-Commissioning**: Re-commission buildings every 3-5 years; typical savings of 10-15% for minimal cost
4. **Utility Rate Optimization**: Review tariff options annually; switching rate schedules can save 5-15% without reducing consumption
5. **Demand Management**: Focus on peak demand reduction ($/kW charges often represent 30-50% of commercial electric bills)
6. **M&V Rigor**: Follow IPMVP protocols (Options A-D) to verify savings and adjust for weather and occupancy
7. **Incentive Capture**: Apply for utility rebates and tax credits before project implementation; funds are often limited
8. **Benchmarking Annually**: Update ENERGY STAR Portfolio Manager scores and compare against peer buildings
9. **Engage Occupants**: Tenant and employee engagement programs deliver 5-10% savings through behavioral changes
10. **Carbon First**: Prioritize decarbonization measures that address Scope 1 and 2 before purchasing offsets
11. **Lifecycle Costing**: Evaluate equipment on total cost of ownership (purchase + energy + maintenance), not first cost alone
12. **Grid Interaction**: Optimize building operations for time-of-use rates, demand response, and grid carbon intensity signals
13. **Commissioning New Construction**: Commission all new construction and major renovations; avoid performance gaps from day one

### Common Patterns

#### Pattern 1: Commercial Office Energy Optimization
```
Scenario: 200,000 SF Class A office building, built 2005, EUI 95 kBtu/SF,
ENERGY STAR score 42, targeting score of 75+.

Approach:
1. Baseline: 3.6M kWh electricity ($432K), 28K therms gas ($42K)
2. Level 2 audit identifies 12 ECMs totaling $340K annual savings
3. Priority 1 - Retro-commissioning ($45K cost):
   - Reset supply air temperature schedule (save $38K)
   - Fix stuck economizer dampers on 3 AHUs (save $22K)
   - Correct simultaneous heating/cooling (save $18K)
4. Priority 2 - LED lighting retrofit ($280K cost):
   - Replace 4,200 fluorescent fixtures with LED (save $89K)
   - Install networked lighting controls with occupancy/daylight (save $31K)
   - Utility rebate captures $85K, net cost $195K, 1.6-year payback
5. Priority 3 - VFDs on AHU supply fans ($120K cost):
   - Install VFDs on 6 constant-volume AHUs (save $47K)
   - 2.6-year payback including utility rebate
6. Priority 4 - Chiller plant optimization ($35K controls upgrade):
   - Implement optimal chiller staging and condenser water reset
   - Save $28K annually, 1.3-year payback
7. Projected result: EUI reduced to 62 kBtu/SF, ENERGY STAR score 78
```

#### Pattern 2: Industrial Compressed Air System Optimization
```
Scenario: Manufacturing plant spending $180K/year on compressed air,
3 rotary screw compressors (250 HP total), system pressure 110 psi.

Approach:
1. Install flow meters and pressure loggers for 2-week baseline study
2. Findings: 30% of air volume lost to leaks, system runs at
   45% average load, artificial demand from excessive pressure
3. Phase 1 - Leak detection and repair ($8K cost):
   - Ultrasonic survey identifies 87 leaks totaling 340 CFM
   - Repair leaks, save $42K annually (23% reduction)
4. Phase 2 - Pressure optimization ($12K cost):
   - Reduce system pressure from 110 to 95 psi
   - Install point-of-use boosters for 2 applications requiring 100+ psi
   - Save $14K annually (every 2 psi reduction = ~1% energy savings)
5. Phase 3 - VSD compressor replacement ($85K cost):
   - Replace one fixed-speed 100 HP unit with VSD compressor
   - Sequence: VSD as trim, fixed-speed as base
   - Save $31K annually, 2.7-year payback
6. Phase 4 - Heat recovery ($25K cost):
   - Recover compressor heat for space heating and process water
   - Save $15K in natural gas costs during heating season
7. Total annual savings: $102K (57% reduction), 1.3-year blended payback
```

### Output Formats

#### Energy Performance Report
```markdown
# Energy Performance Report: [Facility] - [Period]

## Consumption Summary
| Metric | This Period | Same Period Last Year | Weather-Normalized Change |
|--------|------------|----------------------|---------------------------|
| Electricity (kWh) | [Amount] | [Amount] | [+/- %] |
| Natural Gas (therms) | [Amount] | [Amount] | [+/- %] |
| Total (kBtu) | [Amount] | [Amount] | [+/- %] |
| EUI (kBtu/SF) | [Amount] | [Amount] | [+/- %] |
| Cost | [$] | [$] | [+/- %] |
| GHG (MT CO2e) | [Amount] | [Amount] | [+/- %] |

## Demand Analysis
| Month | Peak Demand (kW) | Load Factor | Cost Impact |
|-------|-----------------|-------------|-------------|
| [Month] | [kW] | [%] | [$/kW] |

## ECM Performance Tracking
| ECM | Projected Savings | Actual Savings | Variance |
|-----|-------------------|----------------|----------|
| [Measure] | [$] | [$] | [+/- %] |
```

## Integration Points

- Energy management information systems (EMIS) and BAS/BMS platforms
- ENERGY STAR Portfolio Manager and benchmarking databases
- Utility bill management (EnergyCAP, Urjanet, Utility API)
- Building simulation (eQUEST, EnergyPlus, IES-VE, Trane TRACE)
- Solar design and monitoring (Helioscope, Aurora Solar, SolarEdge)
- Carbon accounting platforms (Persefoni, Watershed, Salesforce Net Zero)
- Demand response platforms (Enel X, CPower, Voltus)
- IoT and sub-metering (Lucid BuildingOS, EcoStruxure, Skyspark)
- Procurement platforms (LevelTen Energy, Conductor Solar)

## Version History

- 1.0.0: Initial energy management skill
- 1.0.1: Added carbon accounting and reporting frameworks
- 1.0.2: Enhanced renewable energy procurement and storage guidance
