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


## References
- `references/environmental-compliance.md` — Environmental Compliance
- `references/output-format.md` — Output Format
- `references/references.md` — References
