---
name: agriculture-technology
description: Comprehensive guidance for agriculture technology including precision farming, crop monitoring, soil management, irrigation automation, livestock management, drone and satellite analytics, farm data platforms, and sustainable agriculture practices for modern agricultural operations. Use when navigating industry-specific regulations, processes, or operations.
---

# Agriculture Technology Skill

> Precision farming, crop analytics, smart irrigation, and data-driven agricultural operations

## Description

This skill provides comprehensive guidance for agriculture technology (AgTech) spanning precision farming, remote sensing, IoT-based monitoring, automated irrigation, variable-rate application, livestock management systems, farm management software, and sustainable agriculture practices. It covers the integration of sensors, drones, satellite imagery, and data analytics to optimize crop yields, reduce input costs, and improve environmental stewardship. The skill supports farmers, agronomists, farm managers, agricultural consultants, and AgTech solution providers.

## Activation Triggers

- User mentions "precision agriculture", "precision farming", "AgTech"
- User asks about crop monitoring or yield mapping
- User needs help with soil sensor data or soil management
- User discusses variable-rate application or prescription maps
- User asks about agricultural drones or satellite imagery
- User mentions smart irrigation or automated watering systems
- User needs farm management software or farm data platform guidance
- User asks about livestock tracking or herd management technology
- User discusses sustainable farming or regenerative agriculture
- User mentions GPS-guided equipment or auto-steer systems

## Instructions

### Core Workflow

1. **Field Assessment and Data Collection**
   - Conduct soil sampling and lab analysis
   - Deploy IoT sensors for continuous monitoring
   - Capture aerial imagery via drone or satellite
   - Establish baseline yield and input cost data
   - Map field boundaries and management zones

2. **Data Analysis and Zone Management**
   - Process satellite and drone imagery (NDVI, NDRE, thermal)
   - Delineate management zones from soil and yield variability
   - Analyze historical yield data for trend identification
   - Generate soil nutrient and pH variability maps
   - Correlate environmental factors with crop performance

3. **Prescription and Application**
   - Create variable-rate seeding prescriptions
   - Generate nutrient application maps (N, P, K, micronutrients)
   - Design irrigation scheduling based on soil moisture and ET models
   - Develop integrated pest management (IPM) scouting protocols
   - Build crop protection application plans

4. **Monitoring and Adjustment**
   - Track crop growth stages via imagery and sensor data
   - Monitor weather forecasts and disease pressure models
   - Adjust irrigation schedules based on real-time soil moisture
   - Evaluate in-season nitrogen status and supplement as needed
   - Record field activities for traceability and compliance

5. **Harvest and Post-Season Analysis**
   - Collect yield monitor data and generate yield maps
   - Reconcile input costs against revenue per management zone
   - Analyze ROI of precision agriculture practices
   - Archive season data for multi-year trend analysis
   - Plan next-season improvements based on learnings

### Precision Farming Framework

```yaml
precision_farming:
  geospatial_technology:
    gps_guidance:
      accuracy_levels:
        sub_meter: "WAAS/EGNOS correction (pass-to-pass 15-30cm)"
        decimeter: "OmniSTAR HP or TerraStar (10cm pass-to-pass)"
        rtk: "Real-Time Kinematic (2.5cm repeatable accuracy)"
        ppk: "Post-Processed Kinematic (survey-grade)"

      applications:
        - Auto-steer and machine guidance
        - Controlled traffic farming (CTF)
        - Row-level swath control
        - Implement section control
        - Field boundary mapping

    remote_sensing:
      satellite_platforms:
        sentinel_2:
          resolution: "10m multispectral"
          revisit: "5-day repeat cycle"
          bands: "13 spectral bands (visible, NIR, SWIR)"
          cost: "Free (ESA Copernicus program)"

        planet_scope:
          resolution: "3m multispectral"
          revisit: "Daily global coverage"
          bands: "4-8 band (visible, NIR, red edge)"
          cost: "Commercial subscription"

        landsat:
          resolution: "30m multispectral, 15m panchromatic"
          revisit: "16-day repeat cycle"
          bands: "11 spectral bands"
          cost: "Free (USGS)"

      vegetation_indices:
        ndvi:
          formula: "(NIR - Red) / (NIR + Red)"
          range: "-1.0 to 1.0"
          use: "General vegetation health and vigor"
        ndre:
          formula: "(NIR - Red Edge) / (NIR + Red Edge)"
          range: "-1.0 to 1.0"
          use: "Chlorophyll content, nitrogen status"
        savi:
          formula: "((NIR - Red) / (NIR + Red + L)) * (1 + L)"
          range: "-1.0 to 1.0"
          use: "Vegetation in sparse canopy (L=0.5)"
        evi:
          formula: "2.5 * ((NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1))"
          use: "High biomass regions, atmospheric correction"

    drone_operations:
      platforms:
        multirotor: "DJI Matrice, senseFly"
        fixed_wing: "eBee, WingtraOne, DeltaQuad"

      sensors:
        rgb: "Visual imagery, plant counting, stand assessment"
        multispectral: "NDVI, crop health, stress detection"
        thermal: "Irrigation uniformity, water stress (CWSI)"
        lidar: "Canopy height, biomass estimation"
        hyperspectral: "Disease detection, nutrient deficiency"

      flight_planning:
        - Define area of interest and boundaries
        - Set altitude (60-120m AGL typical)
        - Configure overlap (75% frontal, 65% sidelap)
        - Plan ground control points (GCPs) for accuracy
        - Check airspace restrictions (FAA Part 107)

  soil_management:
    sampling_strategies:
      grid_sampling:
        density: "1 sample per 2.5 acres (intensive) to 1 per 5 acres"
        depth: "0-6 inches (primary), 6-12 inches (subsoil)"
        timing: "Post-harvest or early spring, consistent year-to-year"

      zone_sampling:
        method: "Sample within delineated management zones"
        basis: "Yield maps, EC maps, soil type boundaries"
        composites: "10-15 cores per composite sample"

    key_parameters:
      chemical:
        - pH (target 6.0-7.0 for most crops)
        - Organic matter percentage
        - Cation exchange capacity (CEC)
        - Macronutrients (N, P, K, Ca, Mg, S)
        - Micronutrients (Zn, Mn, Fe, Cu, B, Mo)
      physical:
        - Soil texture (sand, silt, clay percentages)
        - Bulk density and compaction
        - Water holding capacity
        - Infiltration rate
        - Drainage characteristics

    variable_rate_technology:
      seeding:
        - Population maps based on yield potential zones
        - Hybrid/variety placement by soil type
        - Seeding depth adjustment for soil conditions

      fertilizer:
        - Nitrogen: Credit for residual N, organic matter, prior crop
        - Phosphorus: Build/maintain/draw-down by zone
        - Potassium: Responsive to soil test levels
        - Lime: Variable rate based on pH variability

      application_equipment:
        - Variable-rate controllers (Raven, Ag Leader, Trimble)
        - Section control for overlap reduction
        - ISOBUS-compatible implements (ISO 11783)
        - Rate verification and as-applied mapping
```

### Irrigation and Water Management Framework

```yaml
irrigation_management:
  smart_irrigation:
    soil_moisture_monitoring:
      sensor_types:
        capacitance: "Sentek, AquaCheck (continuous profile)"
        tensiometer: "Direct soil water tension measurement"
        tdr: "Time Domain Reflectometry (volumetric water)"
        neutron_probe: "Nuclear-based (regulated, high accuracy)"
        gypsum_block: "Low-cost resistance-based (coarse)"

      deployment:
        - Representative placement within management zones
        - Multiple depths (6, 12, 24, 36 inches)
        - Minimum 1 station per soil type per field
        - Telemetry for real-time data transmission
        - Integration with farm management platform

    scheduling_methods:
      water_balance:
        inputs: "Rainfall, irrigation applied"
        losses: "ET (evapotranspiration), deep percolation, runoff"
        model: "FAO-56 Penman-Monteith reference ET"
        crop_coefficient: "Kc adjusted by growth stage"

      sensor_based:
        trigger: "Irrigate when soil moisture reaches management allowable depletion (MAD)"
        mad_typical: "50% of available water capacity"
        refill: "Return to field capacity minus safety margin"

      imagery_based:
        cwsi: "Crop Water Stress Index from thermal imagery"
        ndvi_anomaly: "Identify underperforming zones"
        uniformity: "Evaluate irrigation distribution uniformity"

    system_automation:
      center_pivot:
        - Variable rate irrigation (VRI) with zone control
        - Speed adjustment for variable depth application
        - End-gun and corner arm management
        - Remote monitoring and control (Valley ICON, Reinke Touch)

      drip_and_micro:
        - Zone-based valve control
        - Fertigation injection automation
        - Pressure and flow monitoring
        - Filter backwash automation
        - Leak detection via flow anomaly

    water_efficiency_metrics:
      - Water use efficiency (WUE): yield per unit water applied
      - Irrigation efficiency: water consumed / water applied
      - Distribution uniformity (DU): Christiansen coefficient
      - Deep percolation losses
      - Seasonal water budget vs. allocation
```

### Templates

#### Precision Ag Season Plan Template
```markdown
# Precision Agriculture Season Plan: [Farm/Field Name]

## Field Information
- Field ID: [Identifier]
- Total Acres: [Acres]
- Crop: [Crop / Variety / Hybrid]
- Previous Crop: [Crop]
- Soil Types: [Predominant soil series]
- Irrigation: [Type or dryland]

## Management Zones
| Zone | Acres | Yield Potential | Soil Type | Strategy |
|------|-------|-----------------|-----------|----------|
| Zone A | [Acres] | High | [Type] | Maximize inputs |
| Zone B | [Acres] | Medium | [Type] | Optimize ROI |
| Zone C | [Acres] | Low | [Type] | Reduce inputs |

## Input Plan (Variable Rate)
| Input | Zone A Rate | Zone B Rate | Zone C Rate | Unit |
|-------|-------------|-------------|-------------|------|
| Seed Population | [Rate] | [Rate] | [Rate] | seeds/ac |
| Nitrogen | [Rate] | [Rate] | [Rate] | lbs N/ac |
| Phosphorus | [Rate] | [Rate] | [Rate] | lbs P2O5/ac |
| Potassium | [Rate] | [Rate] | [Rate] | lbs K2O/ac |

## Technology Deployment
| Technology | Purpose | Timing | Provider |
|------------|---------|--------|----------|
| Satellite imagery | Crop health monitoring | Bi-weekly | [Provider] |
| Soil moisture sensors | Irrigation scheduling | Season-long | [Provider] |
| Drone flights | Stand count, scouting | V4, V8, R3 | [Provider] |
| Yield monitor | Harvest data collection | Harvest | [Equipment] |

## Season Budget
| Category | Per Acre | Total |
|----------|----------|-------|
| Seed | [$Amount] | [$Amount] |
| Fertilizer | [$Amount] | [$Amount] |
| Crop Protection | [$Amount] | [$Amount] |
| Technology Services | [$Amount] | [$Amount] |
| **Total Input Cost** | **[$Amount]** | **[$Amount]** |
| Target Revenue | [$Amount] | [$Amount] |
| **Projected Margin** | **[$Amount]** | **[$Amount]** |
```

#### Crop Scouting Report Template
```markdown
# Crop Scouting Report

## Field: [Field Name] | Date: [Date] | Scout: [Name]

## Crop Status
- Growth Stage: [V6 / R2 / etc.]
- Stand Density: [plants/acre]
- Overall Vigor: [Excellent / Good / Fair / Poor]
- Canopy Coverage: [%]

## Observations
| Location (GPS) | Issue | Severity | Affected Area | Photo |
|----------------|-------|----------|---------------|-------|
| [Lat, Lon] | [Pest/Disease/Nutrient/Weed] | [Low/Med/High] | [Acres/%] | [Y/N] |

## Pest Pressure
| Pest | Threshold | Observed Level | Action |
|------|-----------|----------------|--------|
| [Species] | [Economic threshold] | [Count/Level] | [Treat/Monitor/None] |

## Recommendations
1. [Priority action with timing]
2. [Secondary recommendation]
3. [Monitoring plan for next visit]
```

### Best Practices

1. **Calibrate Before Every Season**: Verify sensor accuracy, GPS receivers, and yield monitors before deployment
2. **Multi-Year Data Stacking**: Combine 3-5 years of yield, soil, and imagery data before delineating zones
3. **Ground-Truth Remote Sensing**: Always validate satellite or drone imagery with in-field scouting observations
4. **Normalize Yield Data**: Remove headlands, waterways, and anomalies before using yield data for zone creation
5. **Consistent Soil Sampling**: Sample at the same time of year, same depth, same protocol for comparability
6. **Start Simple**: Begin with one variable-rate input (e.g., lime or seeding) before adding complexity
7. **Economic Thresholds**: Make VRA decisions based on crop response curves and input cost breakeven analysis
8. **Data Interoperability**: Use standard formats (ISOXML, Shapefile, GeoTIFF) for cross-platform compatibility
9. **Connectivity Planning**: Deploy cellular or LoRaWAN gateways for reliable sensor data in remote fields
10. **Privacy and Ownership**: Establish clear data ownership and sharing agreements with service providers
11. **Regulatory Awareness**: Follow FAA Part 107 for commercial drone operations, including waivers for BVLOS
12. **Sustainability Documentation**: Track carbon sequestration, water use efficiency, and input reduction for reporting

### Common Patterns

#### Pattern 1: Variable-Rate Nitrogen Management
```
Scenario: 1,200-acre corn operation, 3 soil types, center-pivot irrigated,
targeting 220 bu/ac average yield.

Process:
1. Collect soil samples on 2.5-acre grid, analyze for OM%, NO3 residual
2. Pull Sentinel-2 NDRE imagery at V8-V10 for in-season N status
3. Calculate N credits: prior soybean crop (40 lbs), irrigation water (15 lbs),
   OM mineralization (20 lbs/1% OM)
4. Build 3-zone prescription: Zone A (high OM): 160 lbs N/ac,
   Zone B (medium): 190 lbs N/ac, Zone C (low OM/sandy): 210 lbs N/ac
5. Split application: 60% pre-plant (anhydrous ammonia VRA),
   40% sidedress at V6 adjusted by NDRE imagery
6. Apply sidedress using Raven Viper 4 controller with zone-based Rx map
7. Monitor tissue tests at V6, VT to validate adequacy
8. Harvest yield data confirms 15 bu/ac improvement in Zone C,
   $12/ac savings in Zone A from reduced N
```

#### Pattern 2: Irrigation Scheduling with Soil Moisture Sensors
```
Scenario: 500-acre almond orchard, micro-sprinkler irrigation,
Mediterranean climate with zero summer rainfall.

Process:
1. Install Sentek Drill & Drop sensors at 3 representative sites
   (sandy loam, clay loam, hillside) at 4-inch intervals to 36 inches
2. Configure telemetry to upload readings every 15 minutes to Irrimax Live
3. Set management triggers: upper limit (field capacity) and
   lower limit (50% MAD) per soil type
4. Pull daily reference ET from nearest CIMIS weather station
5. Apply crop coefficient Kc = 0.85 (mid-season mature almonds)
6. Schedule: 48-hour irrigation sets, cycling through 6 irrigation blocks
7. Mid-July thermal drone flight reveals 2 blocks with elevated CWSI
   indicating clogged emitters - maintenance dispatched
8. Season result: 12% water savings vs. calendar-based scheduling,
   yield maintained at 2,800 lbs/ac kernel weight
```

### Output Formats

#### Field Performance Summary
```markdown
# Field Performance Summary: [Field Name] - [Season Year]

## Production Results
| Metric | Actual | Target | Variance |
|--------|--------|--------|----------|
| Average Yield | [bu/ac or tons/ac] | [Target] | [+/- %] |
| Yield Range | [Min - Max] | - | - |
| Total Production | [Total units] | [Target] | [+/- %] |
| Revenue | [$/ac] | [Target] | [+/- %] |

## Input Efficiency
| Input | Rate Applied | Cost/Acre | ROI |
|-------|-------------|-----------|-----|
| Seed | [Rate] | [$] | [$/$ return] |
| Nitrogen | [lbs/ac] | [$] | [$/$ return] |
| Water | [ac-in] | [$] | [$/$ return] |
| Crop Protection | [Applications] | [$] | [$/$ return] |

## Technology Impact
| Practice | Without VRA | With VRA | Savings |
|----------|-------------|----------|---------|
| [Input] | [$Flat rate cost] | [$VRA cost] | [$Saved] |

## Recommendations for Next Season
1. [Data-driven recommendation with evidence]
2. [Zone adjustment based on yield response]
3. [Technology upgrade or addition]
```

## Integration Points

- Farm management platforms (Climate FieldView, John Deere Operations Center, AgLeader SMS)
- Precision ag controllers (Raven, Trimble, Topcon, Ag Leader)
- Imagery and analytics platforms (Planet, Sentera, Taranis, Descartes Labs)
- Soil sampling and lab integration (Waypoint Analytical, A&L Laboratories)
- Irrigation management (Valley, Lindsay, Netafim, Hortau)
- IoT and sensor networks (Arable, Sencrop, Davis Instruments)
- ERP and accounting (FarmERP, Conservis, Granular)
- Government reporting (USDA FSA, NRCS conservation compliance)
- Carbon and sustainability (Indigo Ag, Nori, Bayer Carbon Program)

## Version History

- 1.0.0: Initial agriculture technology skill
- 1.0.1: Added irrigation automation and sensor deployment
- 1.0.2: Enhanced variable-rate application and drone operations guidance
