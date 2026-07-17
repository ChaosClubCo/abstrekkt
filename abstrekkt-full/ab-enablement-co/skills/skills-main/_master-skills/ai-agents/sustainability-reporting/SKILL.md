---
name: sustainability-reporting
description: Comprehensive guidance for sustainability reporting including ESG frameworks, carbon accounting, environmental compliance, GHG emissions tracking, sustainability certifications, stakeholder reporting, and sustainable supply chain management. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Sustainability Reporting Skill

> ESG reporting, carbon accounting, environmental compliance, and sustainability metrics

## Description

This skill provides comprehensive guidance for sustainability reporting including ESG (Environmental, Social, Governance) frameworks, carbon accounting, environmental compliance, GHG emissions tracking, sustainability certifications, stakeholder reporting, and sustainable supply chain management. It covers regulatory requirements, voluntary frameworks, and best practices for corporate sustainability.

## Activation Triggers

- User mentions "sustainability reporting", "ESG", "environmental reporting"
- User asks about carbon footprint or carbon accounting
- User needs help with GHG emissions or Scope 1/2/3
- User discusses climate disclosure or TCFD
- User asks about sustainability frameworks (GRI, SASB, CDP)
- User mentions net zero or carbon neutrality
- User needs environmental compliance guidance
- User asks about sustainable supply chain or circular economy

## Instructions

### Core Workflow

1. **Sustainability Assessment**
   - Identify material topics
   - Assess current state
   - Determine reporting requirements
   - Select frameworks
   - Set targets

2. **Data Collection and Management**
   - Establish data systems
   - Collect emissions data
   - Track social metrics
   - Verify governance practices
   - Ensure data quality

3. **Reporting and Disclosure**
   - Prepare reports
   - Obtain assurance
   - Disclose to stakeholders
   - Respond to ratings
   - Communicate progress

### ESG Framework Overview

```yaml
esg_frameworks:
  environmental:
    focus_areas:
      - Climate change
      - GHG emissions
      - Energy management
      - Water management
      - Waste and circularity
      - Biodiversity
      - Pollution prevention

  social:
    focus_areas:
      - Labor practices
      - Human rights
      - Health and safety
      - Diversity and inclusion
      - Community relations
      - Product responsibility
      - Data privacy

  governance:
    focus_areas:
      - Board composition
      - Executive compensation
      - Business ethics
      - Risk management
      - Shareholder rights
      - Anti-corruption
      - Tax transparency

  reporting_standards:
    mandatory:
      - CSRD (EU)
      - SEC Climate Rules (US)
      - TCFD (various jurisdictions)
      - UK Streamlined Energy and Carbon Reporting

    voluntary:
      - GRI Standards
      - SASB Standards
      - CDP
      - UN Global Compact
      - Science Based Targets
```

### Carbon Accounting

```yaml
carbon_accounting:
  ghg_protocol:
    scope_1:
      definition: "Direct emissions from owned/controlled sources"
      sources:
        - Stationary combustion
        - Mobile combustion
        - Process emissions
        - Fugitive emissions

    scope_2:
      definition: "Indirect emissions from purchased energy"
      sources:
        - Purchased electricity
        - Purchased steam
        - Purchased heating
        - Purchased cooling

      methods:
        location_based: "Grid average emission factors"
        market_based: "Contractual instruments"

    scope_3:
      definition: "All other indirect emissions"
      categories:
        upstream:
          1: "Purchased goods and services"
          2: "Capital goods"
          3: "Fuel and energy activities"
          4: "Upstream transportation"
          5: "Waste generated"
          6: "Business travel"
          7: "Employee commuting"
          8: "Upstream leased assets"

        downstream:
          9: "Downstream transportation"
          10: "Processing of sold products"
          11: "Use of sold products"
          12: "End-of-life treatment"
          13: "Downstream leased assets"
          14: "Franchises"
          15: "Investments"

  calculation:
    formula: "Activity Data x Emission Factor = GHG Emissions"

    data_sources:
      - Utility bills
      - Fuel purchase records
      - Travel records
      - Supply chain data
      - Life cycle assessments

    emission_factors:
      sources:
        - EPA emission factors
        - IEA emission factors
        - Defra conversion factors
        - Ecoinvent database
        - Industry-specific factors

  reporting_units:
    - Metric tons CO2e
    - Carbon dioxide (CO2)
    - Methane (CH4)
    - Nitrous oxide (N2O)
    - Fluorinated gases
```

### GRI Standards

```yaml
gri_standards:
  universal_standards:
    gri_1: "Foundation"
    gri_2: "General Disclosures"
    gri_3: "Material Topics"

  sector_standards:
    available:
      - Oil and Gas
      - Coal
      - Agriculture
      - Mining
      - More in development

  topic_standards:
    environmental:
      - GRI 301: Materials
      - GRI 302: Energy
      - GRI 303: Water
      - GRI 304: Biodiversity
      - GRI 305: Emissions
      - GRI 306: Waste

    social:
      - GRI 401: Employment
      - GRI 403: Health and Safety
      - GRI 404: Training
      - GRI 405: Diversity
      - GRI 406: Non-discrimination
      - GRI 407: Freedom of Association
      - GRI 408: Child Labor
      - GRI 409: Forced Labor

    governance:
      - GRI 205: Anti-corruption
      - GRI 206: Anti-competitive
      - GRI 207: Tax

  materiality:
    process:
      - Identify impacts
      - Assess significance
      - Prioritize topics
      - Validate with stakeholders
      - Review annually

    matrix:
      dimensions:
        - Significance of impacts
        - Influence on stakeholder decisions
```

### TCFD Disclosure

```yaml
tcfd:
  governance:
    disclosures:
      - Board oversight of climate risks
      - Management's role
      - Governance structure

    guidance:
      - Board-level responsibility
      - Regular briefings
      - Integration with strategy
      - Competency and training

  strategy:
    disclosures:
      - Climate risks and opportunities
      - Impact on business
      - Scenario analysis
      - Strategic resilience

    time_horizons:
      short_term: "0-1 years"
      medium_term: "1-5 years"
      long_term: "5+ years"

    scenario_analysis:
      scenarios:
        - Below 2C (Paris aligned)
        - 2-3C (Current policies)
        - 4C+ (Limited action)

  risk_management:
    disclosures:
      - Risk identification process
      - Risk management process
      - Integration with overall risk

    categories:
      physical:
        acute: "Extreme weather events"
        chronic: "Long-term shifts"

      transition:
        - Policy and legal
        - Technology
        - Market
        - Reputation

  metrics_and_targets:
    required:
      - Scope 1 and 2 emissions
      - Scope 3 (if material)
      - Climate-related targets
      - Progress against targets

    recommended:
      - Internal carbon price
      - Climate-related remuneration
      - Low-carbon investments
```

### CDP Reporting

```yaml
cdp:
  questionnaires:
    climate_change:
      - Governance
      - Risks and opportunities
      - Business strategy
      - Targets and performance
      - Emissions methodology
      - Emissions data
      - Energy
      - Additional metrics
      - Verification
      - Carbon pricing
      - Engagement

    water_security:
      - Current state
      - Business impacts
      - Procedures
      - Accounting methodology
      - Targets

    forests:
      - Commodity-specific
      - Supply chain impacts
      - Risk assessment
      - Traceability

  scoring:
    levels:
      a_list: "Leadership"
      b: "Management"
      c: "Awareness"
      d: "Disclosure"
      f: "Failure to disclose"

    criteria:
      - Disclosure quality
      - Awareness of issues
      - Management approach
      - Leadership actions
```

### Science-Based Targets

```yaml
science_based_targets:
  sbti_framework:
    criteria:
      - Scope 1 and 2 coverage
      - Scope 3 coverage (if material)
      - Timeframe (5-15 years)
      - Target ambition level
      - Reporting and recalculation

    target_types:
      near_term: "5-10 year targets"
      long_term: "Net-zero by 2050"

    ambition_levels:
      1_5c_aligned: "Most ambitious"
      well_below_2c: "Required minimum"

  validation_process:
    steps:
      - Commit letter
      - Target development
      - Submission
      - Review
      - Approval/revision
      - Publication
      - Annual reporting

  net_zero:
    requirements:
      - Near-term target
      - Long-term target (90%+ reduction)
      - Neutralization of residual emissions
      - Annual progress reporting

    neutralization:
      - Limited to ~10% of base year
      - High-quality carbon removal
      - No substitution for reductions
```

### Environmental Compliance

```yaml
environmental_compliance:
  air_quality:
    regulations:
      - Clean Air Act permits
      - NESHAP/MACT standards
      - State implementation plans
      - Regional requirements

    monitoring:
      - Continuous emissions monitoring
      - Stack testing
      - Fugitive emissions
      - Ambient monitoring

    reporting:
      - Emissions inventory
      - Annual compliance
      - Upset/deviation reports
      - Title V certification

  water_management:
    permits:
      - NPDES discharge permits
      - Stormwater permits
      - Pretreatment permits

    compliance:
      - Discharge monitoring
      - BMP implementation
      - Spill prevention
      - Compliance schedules

  waste_management:
    regulations:
      - RCRA requirements
      - Hazardous waste rules
      - Universal waste
      - E-waste

    programs:
      - Waste minimization
      - Recycling programs
      - Proper disposal
      - Manifest tracking

  chemical_management:
    requirements:
      - EPCRA reporting
      - TRI reporting
      - RMP compliance
      - Chemical inventory

    programs:
      - Chemical substitution
      - Safer alternatives
      - Right-to-know
      - Emergency planning
```

### Sustainable Supply Chain

```yaml
sustainable_supply_chain:
  supplier_assessment:
    areas:
      - Environmental performance
      - Labor practices
      - Human rights
      - Business ethics
      - Health and safety

    methods:
      - Self-assessment questionnaires
      - Third-party audits
      - On-site assessments
      - Certifications review

    scoring:
      - Performance ratings
      - Risk categories
      - Improvement requirements
      - Recognition programs

  procurement:
    sustainable_sourcing:
      - Certified materials
      - Recycled content
      - Renewable materials
      - Conflict-free sourcing

    supplier_requirements:
      - Code of conduct
      - Environmental standards
      - Social standards
      - Reporting requirements

  traceability:
    approaches:
      - Chain of custody
      - Mass balance
      - Book and claim
      - Direct traceability

    technologies:
      - Blockchain
      - Product passports
      - QR codes
      - RFID tracking

  scope_3_management:
    strategies:
      - Supplier engagement
      - Preferred suppliers
      - Product design
      - Logistics optimization
      - End-of-life programs
```

### Sustainability Data Management

```yaml
data_management:
  collection:
    sources:
      - Utility data
      - Operational data
      - HR systems
      - Supply chain data
      - Financial systems

    automation:
      - API integrations
      - Smart meters
      - IoT sensors
      - ERP connections

  quality:
    requirements:
      - Accuracy
      - Completeness
      - Consistency
      - Transparency
      - Timeliness

    controls:
      - Data validation
      - Audit trails
      - Documentation
      - Review processes

  systems:
    capabilities:
      - Data collection
      - Calculations
      - Reporting
      - Dashboards
      - Audit support

    platforms:
      - Dedicated ESG software
      - ERP modules
      - Spreadsheet systems
      - Cloud platforms

  assurance:
    levels:
      limited: "Basic verification"
      reasonable: "Higher assurance"

    standards:
      - ISAE 3000
      - ISAE 3410 (GHG)
      - AA1000AS
      - ISO 14064-3
```

### Sustainability Metrics and KPIs

```yaml
metrics:
  environmental:
    climate:
      - Total GHG emissions (Scope 1, 2, 3)
      - GHG intensity (per revenue/unit)
      - Renewable energy percentage
      - Energy consumption
      - Carbon price coverage

    resources:
      - Water withdrawal
      - Water intensity
      - Waste generation
      - Recycling rate
      - Circular economy metrics

  social:
    workforce:
      - Employee turnover
      - Training hours
      - Gender diversity
      - Pay equity ratio
      - Safety incident rate

    community:
      - Local hiring
      - Community investment
      - Volunteer hours
      - Social impact metrics

  governance:
    board:
      - Board diversity
      - Independence ratio
      - ESG committee presence
      - Climate competence

    ethics:
      - Ethics training completion
      - Whistleblower cases
      - Anti-corruption training
      - Policy violations

  business:
    integration:
      - ESG-linked compensation
      - Sustainable revenue
      - Green investments
      - ESG ratings scores
```

### Reporting Calendar

```yaml
reporting_calendar:
  annual:
    q1:
      - GHG inventory finalization
      - CDP questionnaire preparation
      - Annual report preparation

    q2:
      - CDP submission (typically July)
      - Sustainability report publication
      - AGM disclosures

    q3:
      - Third-party verification
      - Ratings responses
      - Target progress review

    q4:
      - Data collection for year-end
      - Strategy review
      - Target setting for next year

  regulatory_deadlines:
    examples:
      csrd: "Within annual report"
      sec_climate: "With 10-K filing"
      uk_secr: "With annual report"

  continuous:
    - Data collection
    - Monitoring and tracking
    - Stakeholder engagement
    - Issue management
```

## Output Format

### Sustainability Report Summary
```markdown
# Sustainability Report: [Year]

## Executive Summary
- Key achievements
- Progress against targets
- Material issues addressed

## Environmental Performance
### GHG Emissions
| Scope | Emissions (tCO2e) | Prior Year | Change |
|-------|-------------------|------------|--------|
| Scope 1 | [Amount] | [Amount] | [%] |
| Scope 2 (location) | [Amount] | [Amount] | [%] |
| Scope 2 (market) | [Amount] | [Amount] | [%] |
| Scope 3 | [Amount] | [Amount] | [%] |
| Total | [Amount] | [Amount] | [%] |

### Targets Progress
| Target | Base Year | Target Year | Current | Status |
|--------|-----------|-------------|---------|--------|
| [Target] | [Value] | [Value] | [Value] | [On/Off Track] |

### Resource Metrics
| Metric | Current | Prior | Change |
|--------|---------|-------|--------|
| Energy (GJ) | [Value] | [Value] | [%] |
| Renewable % | [%] | [%] | [+/-%] |
| Water (m3) | [Value] | [Value] | [%] |
| Waste (t) | [Value] | [Value] | [%] |

## Social Performance
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Safety Rate | [TRIR] | [Target] | [G/Y/R] |
| Diversity | [%] | [%] | [G/Y/R] |
| Training Hours | [Avg] | [Target] | [G/Y/R] |

## Governance
| Element | Status |
|---------|--------|
| Board ESG Oversight | [Yes/No] |
| ESG-Linked Compensation | [Yes/No] |
| Ethics Training | [%] Complete |

## Framework Alignment
| Framework | Status | Score/Rating |
|-----------|--------|--------------|
| CDP Climate | [Submitted] | [Score] |
| TCFD | [Aligned] | N/A |
| GRI | [In Accordance] | N/A |
| SBTi | [Committed/Approved] | N/A |

## Next Steps
1. [Priority action]
2. [Supporting action]
```

## Integration Points

- ESG management platforms (Workiva, Sphera, Persefoni)
- Carbon accounting software
- ERP systems
- Utility data systems
- HR information systems
- Supply chain platforms
- Financial reporting systems
- Document management
- Audit management systems

## Best Practices

1. **Materiality Focus**: Report on topics that matter most
2. **Data Quality**: Invest in robust data collection
3. **Target Setting**: Set ambitious, science-based targets
4. **Integration**: Embed sustainability in business strategy
5. **Stakeholder Engagement**: Understand stakeholder expectations
6. **Assurance**: Obtain third-party verification
7. **Continuous Improvement**: Track progress and improve
8. **Transparency**: Disclose challenges alongside achievements

## Common Pitfalls

- Incomplete Scope 3 accounting
- Lack of data quality controls
- Missing materiality assessment
- Inconsistent reporting boundaries
- Inadequate governance oversight
- Greenwashing without substance
- Failure to set science-based targets
- Poor stakeholder engagement
- Delayed reporting
- Insufficient verification

## Version History

- 1.0.0: Initial sustainability reporting skill
- 1.0.1: Added CSRD requirements
- 1.0.2: Enhanced carbon accounting guidance
