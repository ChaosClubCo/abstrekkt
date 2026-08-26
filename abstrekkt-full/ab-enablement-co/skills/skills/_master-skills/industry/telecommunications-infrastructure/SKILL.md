---
name: telecommunications-infrastructure
description: Comprehensive guidance for telecommunications infrastructure including network design, fiber optic deployment, wireless tower siting, 5G architecture, OSP and ISP engineering, capacity planning, network operations, and regulatory compliance for wireline and wireless telecommunications providers. Use when navigating industry-specific regulations, processes, or operations.
---

# Telecommunications Infrastructure Skill

> Network design, fiber and wireless deployment, capacity planning, and telecom operations

## Description

This skill provides comprehensive guidance for telecommunications infrastructure spanning wireline and wireless network design, fiber optic outside plant (OSP) engineering, wireless tower and small cell deployment, 5G NR architecture, inside plant (ISP) engineering, capacity planning, network operations center (NOC) procedures, and regulatory compliance. It covers the full lifecycle from network planning through construction, activation, and ongoing operations. The skill supports telecom engineers, network planners, OSP designers, RF engineers, project managers, and operations professionals.

## Activation Triggers

- User mentions "telecommunications", "telecom infrastructure", "network deployment"
- User asks about fiber optic design or FTTH/FTTX architecture
- User needs help with wireless tower siting or small cell deployment
- User discusses 5G NR, LTE, or wireless network architecture
- User asks about OSP engineering or outside plant construction
- User mentions capacity planning or traffic engineering
- User needs network operations or NOC procedure guidance
- User asks about FCC compliance or telecom regulations
- User discusses right-of-way permitting or pole attachments
- User mentions DWDM, SONET/SDH, or optical transport

## Instructions

### Core Workflow

1. **Network Planning and Design**
   - Assess market demand and coverage requirements
   - Develop network architecture and topology
   - Design fiber routes and wireless coverage areas
   - Create detailed engineering drawings and BOMs
   - Model capacity requirements and growth projections

2. **Permitting and Right-of-Way**
   - Identify required permits and approvals
   - Negotiate pole attachment and conduit agreements
   - Obtain municipal right-of-way permits
   - Secure tower and rooftop lease agreements
   - Process environmental and historical reviews

3. **Construction and Deployment**
   - Issue construction bid packages and select contractors
   - Oversee fiber splicing, cable placement, and equipment installation
   - Manage wireless site construction and antenna installation
   - Perform acceptance testing and quality inspections
   - Commission equipment and activate services

4. **Testing and Turn-Up**
   - Execute fiber characterization (OTDR, power meter)
   - Perform RF optimization and drive testing
   - Validate capacity and performance benchmarks
   - Integrate with network management systems
   - Complete as-built documentation and records

5. **Operations and Maintenance**
   - Monitor network performance via NOC dashboards
   - Execute preventive maintenance schedules
   - Manage fault isolation and service restoration
   - Plan and execute capacity augmentation
   - Track SLA compliance and network KPIs

### Fiber Optic Network Framework

```yaml
fiber_network:
  architecture:
    ftth_topologies:
      pon:
        gpon:
          downstream: "2.488 Gbps shared"
          upstream: "1.244 Gbps shared"
          split_ratio: "1:32 or 1:64"
          reach: "20km maximum"
          standard: "ITU-T G.984"
        xgs_pon:
          downstream: "10 Gbps symmetric"
          upstream: "10 Gbps symmetric"
          split_ratio: "1:32 or 1:64"
          reach: "20km maximum"
          standard: "ITU-T G.9807"
        ng_pon2:
          downstream: "40 Gbps (4x10G TWDM)"
          upstream: "40 Gbps (4x10G TWDM)"
          split_ratio: "1:64 or 1:256"
          reach: "40km maximum"
          standard: "ITU-T G.989"

      active_ethernet:
        configuration: "Point-to-point dedicated fiber"
        bandwidth: "1G, 10G, 25G, 100G per subscriber"
        reach: "80km+ with appropriate optics"
        use_case: "Business services, enterprise, data center"

    transport:
      dwdm:
        channels: "80-96 wavelengths (C-band), expandable to L-band"
        per_channel: "100G, 200G, 400G, 800G coherent"
        amplification: "EDFA every 80-100km, Raman for extended reach"
        standard: "ITU-T G.694.1 (100GHz or 50GHz grid)"

      otn:
        hierarchy: "ODU0 (1.25G) through ODUCn (beyond 100G)"
        function: "Digital wrapper for wavelength services"
        fec: "Forward error correction for extended reach"
        monitoring: "PM, TCM, and fault management"

  outside_plant:
    cable_types:
      loose_tube:
        use: "Buried and aerial, long-haul and distribution"
        fiber_count: "12 to 864 fibers"
        buffer: "Gel-filled or dry-block water blocking"
      ribbon:
        use: "High-density, mass fusion splicing"
        fiber_count: "72 to 6,912 fibers"
        advantage: "Faster splicing (12-fiber ribbons)"
      drop_cable:
        use: "Service drop from distribution to customer"
        fiber_count: "1-2 fibers (flat or round)"
        types: "Toneable, armored, indoor/outdoor rated"

    placement_methods:
      aerial:
        - Strand (messenger wire) with lashed cable
        - Self-supporting (ADSS) cable
        - All-dielectric figure-8 cable
        - Pole attachment agreements required
      underground:
        - Direct buried (plow or trench)
        - Conduit/innerduct placement
        - Microtrenching (shallow urban deployment)
        - Horizontal directional drilling (HDD)
      submarine:
        - Armored submarine cable
        - Shore-end burial and protection

    fiber_distribution:
      odf: "Optical Distribution Frame (central office)"
      fdt: "Fiber Distribution Terminal (cabinet)"
      fat: "Fiber Access Terminal (pedestal or aerial closure)"
      nap: "Network Access Point (tap for service drops)"
      ont: "Optical Network Terminal (customer premises)"

    splicing_and_testing:
      fusion_splicing:
        single_fiber: "Average loss < 0.05 dB"
        ribbon: "12-fiber mass fusion, average loss < 0.05 dB"
      mechanical_splicing:
        average_loss: "< 0.3 dB"
        use: "Temporary restoration, low-count drops"

      testing:
        otdr:
          purpose: "Fiber characterization, fault location"
          parameters: "Attenuation, splice loss, reflectance, length"
          bidirectional: "Required for accurate splice loss measurement"
        power_meter:
          purpose: "End-to-end insertion loss verification"
          method: "Source at far end, meter at near end"
        olts:
          purpose: "Combined source and power meter testing"
          standard: "TIA-568, TIA-526 test procedures"

    loss_budgets:
      components:
        fiber_attenuation: "0.35 dB/km (1310nm), 0.22 dB/km (1550nm)"
        splice_loss: "0.1 dB per fusion splice (allocated)"
        connector_loss: "0.5 dB per mated pair"
        splitter_loss: "1x32 = 17.5 dB, 1x64 = 20.5 dB"
      calculation: "Sum of all losses must be within equipment optical budget"
```

### Wireless Network Framework

```yaml
wireless_network:
  5g_nr_architecture:
    network_components:
      ran:
        gnodeb: "5G NR base station"
        du: "Distributed Unit (baseband processing)"
        cu: "Centralized Unit (higher-layer protocols)"
        ru: "Radio Unit (RF processing and antenna)"
      core:
        amf: "Access and Mobility Management Function"
        smf: "Session Management Function"
        upf: "User Plane Function"
        nrf: "Network Repository Function"
        nssf: "Network Slice Selection Function"

    spectrum_bands:
      low_band:
        range: "600 MHz - 1 GHz"
        bandwidth: "5-15 MHz channels"
        coverage: "Broad coverage, deep penetration"
        throughput: "30-250 Mbps"
      mid_band:
        range: "2.5 - 6 GHz (C-band 3.7-3.98 GHz)"
        bandwidth: "20-100 MHz channels"
        coverage: "Balance of coverage and capacity"
        throughput: "100-900 Mbps"
      mmwave:
        range: "24-47 GHz (n257, n258, n260, n261)"
        bandwidth: "100-400 MHz channels"
        coverage: "Limited range (200-500m), LOS dependent"
        throughput: "1-4+ Gbps"

    deployment_types:
      macro_cell:
        height: "30-100m tower or rooftop"
        coverage: "1-30km radius"
        power: "20-60W per carrier"
        backhaul: "Fiber or microwave"
      small_cell:
        height: "3-15m (pole, strand, wall mount)"
        coverage: "100-500m radius"
        power: "0.25-5W per carrier"
        backhaul: "Fiber or millimeter-wave"
      das:
        type: "Distributed Antenna System"
        use: "In-building, venue, campus coverage"
        architecture: "Active, passive, or hybrid"
      cran:
        type: "Centralized/Cloud RAN"
        fronthaul: "eCPRI over fiber (25G per RU)"
        advantage: "Pooled baseband resources"

  site_development:
    tower_types:
      self_supporting: "Lattice tower, 60-600 feet"
      monopole: "Single-pole structure, 60-200 feet"
      guyed_tower: "Wire-stayed, 200-2000 feet"
      stealth: "Concealed (tree, flagpole, building-integrated)"
      rooftop: "Building-mounted antenna installation"

    site_acquisition:
      process:
        - RF engineer identifies search ring (target coverage area)
        - Site acquisition agent identifies candidate locations
        - Evaluate zoning, structural, environmental feasibility
        - Negotiate lease terms (20-30 year term typical)
        - Submit zoning/permitting applications
        - Obtain building permit and structural approval
        - Execute lease and commence construction

    regulatory:
      fcc:
        - Antenna structure registration (ASR) for >200 feet or near airports
        - RF emissions compliance (OET Bulletin 65)
        - Spectrum licensing and coordination
      nepa:
        - National Environmental Policy Act review
        - Endangered species assessment
        - Wetlands and floodplain review
      nhpa:
        - National Historic Preservation Act (Section 106)
        - Tribal consultation
        - Visual impact assessment
      faa:
        - Aeronautical study (7460-1 filing)
        - Obstruction marking and lighting
```

### Templates

#### Fiber Route Design Package Template
```markdown
# Fiber Route Design: [Route Name / ID]

## Route Overview
- Route Length: [Miles/km]
- Cable Type: [Fiber count, cable type]
- Placement Method: [Aerial/Underground/Combination]
- Design Standard: [Telcordia GR-20, RUS specification]

## Route Segments
| Segment | From | To | Length | Method | Cable | Fiber Count |
|---------|------|----|--------|--------|-------|-------------|
| [ID] | [Location] | [Location] | [ft/m] | [Aerial/UG] | [Type] | [Count] |

## Bill of Materials
| Item | Quantity | Unit | Unit Cost | Total Cost |
|------|----------|------|-----------|------------|
| Fiber cable ([type]) | [Length] | ft | [$] | [$] |
| Splice closures | [Count] | ea | [$] | [$] |
| Pedestals / cabinets | [Count] | ea | [$] | [$] |
| Conduit / innerduct | [Length] | ft | [$] | [$] |
| Splice trays | [Count] | ea | [$] | [$] |
| **Total Materials** | | | | **[$]** |

## Splice Plan
| Closure ID | Location | Fibers In | Fibers Out | Splices | Pass-Through |
|------------|----------|-----------|------------|---------|--------------|
| [ID] | [Location] | [Count] | [Count] | [Count] | [Count] |

## Loss Budget
| Component | Count | Loss Each (dB) | Total (dB) |
|-----------|-------|----------------|------------|
| Fiber attenuation | [km] | [dB/km] | [dB] |
| Splices | [Count] | 0.1 | [dB] |
| Connectors | [Count] | 0.5 | [dB] |
| Splitter (if PON) | [1xN] | [dB] | [dB] |
| **Total Path Loss** | | | **[dB]** |
| Equipment Optical Budget | | | [dB] |
| **Margin** | | | **[dB]** |

## Permits Required
| Permit Type | Jurisdiction | Status | Expiration |
|-------------|-------------|--------|------------|
| ROW Permit | [Municipality] | [Status] | [Date] |
| Pole Attachment | [Utility] | [Status] | [Date] |
| Railroad Crossing | [Railroad] | [Status] | [Date] |
| DOT Encroachment | [State DOT] | [Status] | [Date] |
```

#### Network KPI Dashboard Template
```markdown
# Network Performance Dashboard: [Region/Market]

## Availability
| Network Element | Target | Actual | Status |
|----------------|--------|--------|--------|
| Core Network | 99.999% | [%] | [G/Y/R] |
| Transport/Backbone | 99.99% | [%] | [G/Y/R] |
| Access Network | 99.9% | [%] | [G/Y/R] |
| Wireless RAN | 99.5% | [%] | [G/Y/R] |

## Performance Metrics
| Metric | Target | Actual | Trend |
|--------|--------|--------|-------|
| Latency (RTT) | <[ms] | [ms] | [Up/Down/Flat] |
| Packet Loss | <[%] | [%] | [Up/Down/Flat] |
| Throughput (DL) | >[Mbps] | [Mbps] | [Up/Down/Flat] |
| Throughput (UL) | >[Mbps] | [Mbps] | [Up/Down/Flat] |
| Call Drop Rate | <[%] | [%] | [Up/Down/Flat] |

## Trouble Tickets
| Priority | Open | Avg Resolution Time | SLA Met |
|----------|------|---------------------|---------|
| P1 (Critical) | [Count] | [Hours] | [%] |
| P2 (Major) | [Count] | [Hours] | [%] |
| P3 (Minor) | [Count] | [Days] | [%] |
```

### Best Practices

1. **Route Diversity**: Design redundant fiber paths and diverse entry points for critical facilities
2. **Future-Proof Cable Plant**: Install higher fiber counts than initially needed; labor costs far exceed cable cost differences
3. **Accurate As-Builts**: Update GIS and record systems within 30 days of construction completion
4. **Loss Budget Margin**: Design optical paths with minimum 3 dB margin above calculated loss budget
5. **Permit Lead Times**: Begin permitting 6-12 months before planned construction for municipal and railroad crossings
6. **Proper Cable Handling**: Never exceed minimum bend radius during installation (cable-specific, typically 20x OD)
7. **Grounding and Bonding**: Ground all metallic cable components per NEC Article 770 and Telcordia GR-1275
8. **RF Interference Management**: Coordinate spectrum usage and perform interference analysis before site activation
9. **Capacity Headroom**: Design transport links at 60-70% peak utilization to accommodate growth
10. **Preventive Maintenance**: Inspect aerial plant annually and after major weather events
11. **Emergency Restoration**: Maintain fiber restoration kits and pre-negotiated contractor agreements
12. **Documentation Standards**: Follow TIA-606 administration standard for labeling and record management
13. **Environmental Compliance**: Complete NEPA and NHPA reviews before any ground disturbance at tower sites

### Common Patterns

#### Pattern 1: FTTH Greenfield Deployment
```
Scenario: 5,000-home subdivision GPON FTTH deployment for greenfield
residential development.

Design approach:
1. Design hub location near subdivision entrance, install OLT with
   4 GPON line cards (64 ports), provision for XGS-PON upgrade
2. Route 432-count feeder cable from hub along main boulevard (underground)
3. Deploy 12 FDTs (cabinets) serving ~400 homes each
4. Run 48-count distribution cables from each FDT through neighborhood
5. Install NAPs (8-port taps) every 4-8 lots on distribution cable
6. Provision 1:32 splitters in FDTs (8 splitters per FDT)
7. Pre-connectorized drop cables from NAP to each lot (200ft avg)
8. ONT placement: NID on exterior, Cat6 inside wiring
9. Loss budget: 0.22 dB/km x 2km + 17.5 dB splitter + 2 dB connectors
   + 1 dB splices = 21.0 dB (within 28 dB GPON budget, 7 dB margin)
10. Per-passing cost target: $1,200-$1,800 including electronics
```

#### Pattern 2: 5G Small Cell Densification
```
Scenario: Urban market 5G C-band densification, 200 small cells
over 15 square miles.

Deployment process:
1. RF engineer models coverage using C-band (3.7 GHz) propagation,
   100 MHz channel, 64T64R mMIMO radios
2. Generate candidate site list targeting 300m inter-site distance
3. Site acquisition identifies utility poles, streetlights, and strand mounts
4. Fiber backhaul design: extend 12-count fiber to each small cell site
   from nearest splice point, eCPRI fronthaul to centralized DU
5. Power: coordinate utility drop (200A single-phase per radio)
   or evaluate solar+battery for locations without power
6. Permitting: streamline through FCC Shot Clock rules
   (60 days for collocations, 90 days for new structures under 50 feet)
7. Construction: install radios, fiber, power, and antenna on bracket
8. Integration: configure gNodeB, commission on core, optimize parameters
9. RF optimization: drive test for SINR, throughput, handover performance
10. Target: 500 Mbps median DL throughput, 99.5% area reliability
```

### Output Formats

#### Network Capacity Planning Report
```markdown
# Capacity Planning Report: [Network Segment]

## Current State
| Element | Capacity | Utilization | Peak | Growth Rate |
|---------|----------|-------------|------|-------------|
| [Transport link] | [Gbps] | [%] | [%] | [% per year] |
| [Switch/Router port] | [Gbps] | [%] | [%] | [% per year] |
| [PON port] | [Subscribers] | [%] | [Count] | [% per year] |

## Forecast (3-Year)
| Year | Projected Traffic | Required Capacity | Investment |
|------|-------------------|-------------------|------------|
| Year 1 | [Gbps] | [Gbps] | [$] |
| Year 2 | [Gbps] | [Gbps] | [$] |
| Year 3 | [Gbps] | [Gbps] | [$] |

## Augmentation Plan
| Action | Trigger Point | Lead Time | Cost |
|--------|---------------|-----------|------|
| [Upgrade/Add capacity] | [% utilization] | [Weeks] | [$] |
```

## Integration Points

- GIS and mapping platforms (ESRI ArcGIS, Bentley OpenUtilities, IQGeo)
- Network management systems (Nokia NSP, Ciena MCP, Calix SMx)
- OSS/BSS platforms (Netcracker, Amdocs, CSG)
- RF planning tools (Atoll, ASSET, Planet)
- Fiber management (3-GIS, OSPInsight, Vetro FiberMap)
- Ticketing and workforce management (ServiceNow, ClickSoftware)
- Tower and lease management (SiteSee, SAP Real Estate)
- Test equipment integration (VIAVI, EXFO, Anritsu)
- Regulatory filing systems (FCC ULS, ASR, ELS)

## Version History

- 1.0.0: Initial telecommunications infrastructure skill
- 1.0.1: Added 5G NR architecture and small cell deployment
- 1.0.2: Enhanced fiber optic design and loss budget guidance
