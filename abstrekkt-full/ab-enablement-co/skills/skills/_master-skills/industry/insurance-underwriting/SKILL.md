---
name: insurance-underwriting
description: Helps manage and audit insurance underwriting processes. Comprehensive guidance for insurance underwriting including risk assessment, policy pricing, coverage analysis, loss ratio management, actuarial principles, regulatory compliance, claims evaluation, and portfolio optimization across commercial and personal lines. Use when navigating industry-specific regulations, processes, or operations.
---

# Insurance Underwriting Skill

> Risk evaluation, policy structuring, premium calculation, and underwriting decision support

## Description

This skill provides comprehensive guidance for insurance underwriting operations across commercial and personal lines, including property, casualty, life, and specialty coverage. It covers risk assessment methodologies, premium rating, coverage analysis, regulatory compliance, reinsurance considerations, and portfolio management. The skill supports underwriters, actuaries, risk managers, and insurance operations professionals in making sound, data-driven underwriting decisions.

## Activation Triggers

- User mentions "underwriting", "insurance risk", "policy pricing"
- User asks about risk assessment or risk selection
- User needs help with premium calculation or rating
- User discusses loss ratios, combined ratios, or underwriting profitability
- User asks about coverage terms, exclusions, or endorsements
- User mentions reinsurance or treaty structures
- User needs regulatory compliance guidance for insurance
- User asks about claims reserves or loss development
- User discusses commercial lines or personal lines underwriting
- User mentions actuarial analysis or experience modification

## Instructions

### Core Workflow

1. **Risk Identification**
   - Gather submission data and applications
   - Classify risk by line of business and industry
   - Identify hazard exposures and loss drivers
   - Review loss history and claims experience
   - Assess insured's risk management practices

2. **Risk Analysis**
   - Apply rating algorithms and manual rates
   - Calculate experience modification factors
   - Evaluate schedule credits and debits
   - Perform catastrophe exposure analysis
   - Model aggregate loss scenarios

3. **Coverage Structuring**
   - Determine appropriate coverage forms
   - Select applicable endorsements and exclusions
   - Set deductibles and self-insured retentions
   - Define policy limits and sublimits
   - Establish coinsurance requirements

4. **Pricing and Decision**
   - Calculate technical premium
   - Apply expense loading and profit margin
   - Compare against market benchmarks
   - Make accept, decline, or modify decision
   - Document underwriting rationale

5. **Portfolio Management**
   - Monitor book of business performance
   - Track loss ratio development
   - Manage concentration risk
   - Rebalance portfolio mix
   - Coordinate reinsurance placement

### Risk Assessment Framework

```yaml
risk_assessment:
  submission_review:
    required_information:
      - Application and supplemental questionnaires
      - Loss runs (minimum 5 years)
      - Financial statements
      - Inspection reports
      - Safety and risk management programs
      - Prior policy declarations

    industry_classification:
      systems:
        sic: "Standard Industrial Classification"
        naics: "North American Industry Classification"
        iso_gl: "ISO General Liability class codes"
        ncci_wc: "NCCI Workers Compensation class codes"

    exposure_bases:
      general_liability: "Revenue, payroll, units, area"
      property: "Total insured value (TIV)"
      workers_comp: "Payroll by classification"
      auto: "Vehicle count, fleet composition"
      professional: "Revenue, headcount, billings"

  hazard_analysis:
    physical_hazards:
      - Construction type and occupancy
      - Fire protection and sprinkler systems
      - Building age and condition
      - Machinery and equipment exposure
      - Environmental conditions

    moral_hazards:
      - Financial stability of insured
      - Management character and reputation
      - Claims reporting patterns
      - Prior cancellations or non-renewals
      - Litigation history

    morale_hazards:
      - Risk management program quality
      - Safety culture assessment
      - Maintenance and housekeeping
      - Employee training and competency
      - Contractual risk transfer practices

  loss_history_analysis:
    evaluation:
      - Frequency and severity trends
      - Large loss identification
      - Loss development factors
      - Incurred but not reported (IBNR) estimation
      - Loss causation patterns

    experience_rating:
      workers_comp:
        - Experience modification rate (EMR)
        - Primary and excess loss split
        - Expected loss calculation
        - Ballast value application
      general_liability:
        - Experience rating plan
        - Credibility weighting
        - Basic and excess limits analysis
```

### Premium Rating Framework

```yaml
premium_rating:
  manual_rating:
    process:
      - Determine base rate per exposure unit
      - Apply classification modifiers
      - Calculate manual premium
      - Apply experience modification
      - Apply schedule rating credits/debits

    components:
      base_rate: "Filed rate per $100 of exposure"
      classification_modifier: "Industry-specific adjustment"
      territory_factor: "Geographic risk differential"
      increased_limits_factor: "Higher limits pricing"
      deductible_credit: "Premium reduction for retained risk"

  schedule_rating:
    credit_debit_factors:
      premises_and_equipment:
        range: "-15% to +15%"
        considers: "Age, condition, maintenance"
      classification_peculiarities:
        range: "-10% to +10%"
        considers: "Operations vs. class norm"
      employees_selection_training:
        range: "-10% to +10%"
        considers: "HR practices, turnover, training"
      cooperation_medical_facilities:
        range: "-5% to +5%"
        considers: "Safety programs, medical availability"
      management_experience:
        range: "-10% to +10%"
        considers: "Years in business, management quality"

  loss_sensitive_plans:
    retrospective_rating:
      components:
        - Basic premium factor
        - Converted losses
        - Tax multiplier
        - Minimum premium
        - Maximum premium

    large_deductible:
      structure:
        - Per-occurrence deductible ($100K+)
        - Aggregate deductible corridor
        - Collateral requirements
        - Loss billing procedures

    captive_programs:
      types:
        single_parent: "Wholly owned subsidiary"
        group_captive: "Multiple unrelated insureds"
        rent_a_captive: "Cell within existing captive"
        risk_retention_group: "Liability only"

  profitability_metrics:
    loss_ratio: "Incurred losses / Earned premium"
    expense_ratio: "Underwriting expenses / Written premium"
    combined_ratio: "Loss ratio + Expense ratio"
    operating_ratio: "Combined ratio - Investment income ratio"

    targets:
      profitable: "Combined ratio < 100%"
      acceptable: "Combined ratio 95-100%"
      concerning: "Combined ratio 100-110%"
      unprofitable: "Combined ratio > 110%"
```

### Coverage Analysis

```yaml
coverage_analysis:
  commercial_property:
    forms:
      basic: "Fire, lightning, explosion, smoke, windstorm"
      broad: "Basic + additional named perils"
      special: "All risk with stated exclusions"

    valuation:
      replacement_cost: "Cost to replace at current prices"
      actual_cash_value: "Replacement cost less depreciation"
      agreed_value: "Predetermined scheduled amount"
      functional_replacement: "Cost of equivalent function"

    key_provisions:
      - Coinsurance clause (80%, 90%, 100%)
      - Vacancy provisions
      - Ordinance or law coverage
      - Business income and extra expense
      - Equipment breakdown

  commercial_general_liability:
    coverage_parts:
      coverage_a: "Bodily injury and property damage"
      coverage_b: "Personal and advertising injury"
      coverage_c: "Medical payments"

    key_exclusions:
      - Expected or intended injury
      - Contractual liability (limited exception)
      - Liquor liability
      - Workers compensation
      - Pollution (absolute exclusion)
      - Professional liability
      - Employment practices

    limits_structure:
      each_occurrence: "Per-event limit"
      general_aggregate: "Policy period total"
      products_aggregate: "Products/completed operations"
      personal_advertising: "Per person/organization"
      damage_to_rented_premises: "Per premises"
      medical_expense: "Per person"

  workers_compensation:
    coverage_parts:
      part_a: "Statutory workers compensation benefits"
      part_b: "Employers liability"

    rating_elements:
      - Classification codes and rates
      - Experience modification rate
      - Premium discount
      - Expense constant
      - Retrospective rating (optional)

  commercial_auto:
    coverage_symbols:
      symbol_1: "Any auto"
      symbol_2: "Owned autos only"
      symbol_7: "Specifically described"
      symbol_8: "Hired autos"
      symbol_9: "Non-owned autos"

    fleet_considerations:
      - Vehicle type and use classification
      - Driver selection and MVR review
      - Radius of operations
      - Cargo exposure
      - Fleet safety program
```

### Templates

#### Underwriting Summary Template
```markdown
# Underwriting Summary: [Insured Name]

## Submission Overview
- Named Insured: [Legal Entity Name]
- DBA: [If applicable]
- Industry: [NAICS/SIC Code and Description]
- Years in Business: [Number]
- Annual Revenue: [$Amount]
- Employee Count: [Number]

## Coverage Requested
| Line | Limits | Deductible | Premium |
|------|--------|------------|---------|
| [GL/Property/WC/Auto] | [$Limit] | [$Deductible] | [$Premium] |

## Risk Assessment
| Factor | Rating | Comments |
|--------|--------|----------|
| Loss History | [Favorable/Average/Adverse] | [Detail] |
| Management Quality | [Strong/Adequate/Weak] | [Detail] |
| Risk Controls | [Excellent/Good/Fair/Poor] | [Detail] |
| Financial Stability | [Strong/Adequate/Weak] | [Detail] |

## Loss History (5-Year)
| Year | Claims Count | Incurred | Paid | Open Reserves |
|------|-------------|----------|------|---------------|
| [Year] | [Count] | [$Amount] | [$Amount] | [$Amount] |

## Pricing Analysis
- Manual Premium: [$Amount]
- Schedule Modification: [+/- %]
- Experience Modification: [Factor]
- Final Premium: [$Amount]
- Target Loss Ratio: [%]

## Underwriting Decision
- Decision: [Accept / Decline / Modify / Refer]
- Conditions: [Any special conditions]
- Rationale: [Detailed reasoning]
```

#### Renewal Review Template
```markdown
# Renewal Review: [Insured Name] - Policy Period [Dates]

## Expiring vs. Renewal
| Element | Expiring | Proposed Renewal | Change |
|---------|----------|------------------|--------|
| Premium | [$Amount] | [$Amount] | [+/- %] |
| Limits | [$Limit] | [$Limit] | [Change] |
| Deductible | [$Amount] | [$Amount] | [Change] |
| Retention | [$Amount] | [$Amount] | [Change] |

## Policy Period Performance
- Loss Ratio: [%] (Expiring) vs. [%] (Target)
- Claims Frequency: [Count] vs. [Prior Period]
- Severity Trend: [Increasing/Stable/Decreasing]
- Large Losses (>$[Threshold]): [Count and Detail]

## Renewal Action
- Recommendation: [Renew as-is / Renew with changes / Non-renew]
- Rate Change: [+/- %]
- Coverage Modifications: [Any changes]
- Underwriting Conditions: [Requirements]
```

### Best Practices

1. **Consistent Underwriting Standards**: Apply uniform criteria across similar risks to avoid adverse selection
2. **Data-Driven Decisions**: Base pricing on actuarial data, loss projections, and credible experience
3. **Thorough Submission Review**: Never bind coverage without complete submission information
4. **Loss Trend Analysis**: Analyze frequency and severity trends over minimum 5-year horizons
5. **Adequate Documentation**: Record rationale for every underwriting decision including declinations
6. **Catastrophe Awareness**: Model and monitor aggregation of catastrophe-exposed risks
7. **Regulatory Compliance**: Ensure all rating plans, forms, and practices comply with state regulations
8. **Reinsurance Alignment**: Coordinate underwriting guidelines with reinsurance treaty terms
9. **Portfolio Diversification**: Maintain balanced mix by line, geography, industry, and risk size
10. **Continuous Monitoring**: Track in-force book performance monthly, not just at renewal
11. **Market Intelligence**: Stay current on competitor pricing, capacity shifts, and market cycles
12. **Subjectivity Discipline**: Apply schedule credits and debits consistently with documented justification

### Common Patterns

#### Pattern 1: New Business Submission Evaluation
```
Scenario: A manufacturing company submits a package policy application
with GL, property, and workers compensation.

Process:
1. Verify NAICS code 332710 (Machine Shops) and confirm operations match
2. Pull 5-year loss runs - identify EMR of 1.15 driven by two
   lost-time claims in Year 2
3. Review inspection report - note unguarded belt drives (OSHA citation)
4. Calculate manual premium using ISO rates and NCCI class 3632
5. Apply schedule debit of +5% for premises condition
6. Experience mod at 1.15 drives WC premium up 15% over unity
7. Request corrective action plan for safety deficiencies before binding
8. Quote with 90-day safety improvement condition and mid-term audit
```

#### Pattern 2: Catastrophe Exposure Assessment
```
Scenario: Underwriting a coastal commercial property portfolio
in hurricane-exposed territory.

Process:
1. Geocode all locations to determine wind zones and flood zones
2. Run catastrophe model (AIR/RMS) for 100-year and 250-year PMLs
3. Review construction: masonry vs. frame, roof age, opening protection
4. Calculate probable maximum loss (PML) at portfolio level
5. Check aggregate capacity against reinsurance treaty limits
6. Apply wind/hail deductible (2-5% of TIV) for Tier 1 counties
7. Require flood coverage for Zone A/V locations via NFIP or private flood
8. Set per-location capacity limit and portfolio aggregate cap
9. Document cat load in pricing at 8-12% of premium
```

#### Pattern 3: Loss-Sensitive Program Design
```
Scenario: Large contractor ($50M payroll) requesting retrospective
rated workers compensation program.

Process:
1. Review 10-year loss history - current EMR 0.92, favorable trend
2. Calculate basic premium factor at 0.25 (expense component)
3. Set loss conversion factor at 1.12 (allocated LAE loading)
4. Establish per-claim loss limit at $250,000
5. Set minimum retrospective premium at 60% of standard premium
6. Set maximum retrospective premium at 120% of standard premium
7. Require $500,000 letter of credit as collateral
8. Project ultimate losses using 5-year weighted average at $2.1M
9. Estimated retrospective premium: $3.8M vs. guaranteed cost of $4.5M
```

### Output Formats

#### Risk Score Card
```markdown
# Risk Score Card: [Insured Name]

| Category | Weight | Score (1-10) | Weighted Score |
|----------|--------|-------------|----------------|
| Loss History | 25% | [Score] | [Calculated] |
| Operations Hazard | 20% | [Score] | [Calculated] |
| Management Quality | 15% | [Score] | [Calculated] |
| Financial Strength | 15% | [Score] | [Calculated] |
| Risk Controls | 15% | [Score] | [Calculated] |
| Industry Outlook | 10% | [Score] | [Calculated] |
| **Total** | **100%** | | **[Total]** |

Rating: [Preferred / Standard / Substandard / Decline]
```

#### Portfolio Performance Dashboard
```markdown
# Portfolio Performance: [Line of Business] - [Period]

## Key Metrics
| Metric | Current | Prior Year | Budget |
|--------|---------|------------|--------|
| Written Premium | [$Amount] | [$Amount] | [$Amount] |
| Earned Premium | [$Amount] | [$Amount] | [$Amount] |
| Incurred Losses | [$Amount] | [$Amount] | [$Amount] |
| Loss Ratio | [%] | [%] | [%] |
| Combined Ratio | [%] | [%] | [%] |
| Policy Count | [Count] | [Count] | [Count] |
| Retention Rate | [%] | [%] | [%] |
| New Business | [$Amount] | [$Amount] | [$Amount] |
| Rate Change | [+/- %] | [+/- %] | [+/- %] |
```

## Integration Points

- Policy administration systems (Guidewire, Duck Creek, Majesco)
- Rating engines and comparative raters
- Catastrophe modeling platforms (AIR, RMS, CoreLogic)
- Loss control and inspection systems
- Claims management systems
- Actuarial reserving tools (Arius, ResQ)
- Reinsurance management platforms
- Bureau systems (ISO, NCCI, AAIS)
- Third-party data providers (LexisNexis, D&B, Verisk)

## Version History

- 1.0.0: Initial insurance underwriting skill
- 1.0.1: Added loss-sensitive program structures
- 1.0.2: Enhanced catastrophe exposure guidance
