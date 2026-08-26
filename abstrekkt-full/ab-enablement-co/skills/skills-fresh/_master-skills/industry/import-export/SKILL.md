---
name: import-export
description: Comprehensive guidance for import and export operations including customs compliance, trade regulations, documentation requirements, tariff classification, duties management, free trade agreements, and international logistics coordination. Use when navigating industry-specific regulations, processes, or operations.
---

# Import-Export Skill

> International trade compliance, customs procedures, and global logistics

## Description

This skill provides comprehensive guidance for import and export operations including customs compliance, trade regulations, documentation requirements, tariff classification, duties management, free trade agreements, restricted party screening, and international logistics coordination. It covers all aspects of moving goods across international borders legally and efficiently.

## Activation Triggers

- User mentions "import", "export", "international trade"
- User asks about customs clearance or customs broker
- User needs help with trade compliance or regulations
- User discusses tariffs, duties, or customs duties
- User asks about HS codes or tariff classification
- User mentions free trade agreements or FTA
- User needs export control or licensing guidance
- User asks about restricted party screening or sanctions

## Instructions

### Core Workflow

1. **Trade Planning**
   - Assess trade requirements
   - Determine regulatory obligations
   - Classify products
   - Identify applicable agreements
   - Establish compliance procedures

2. **Transaction Execution**
   - Prepare documentation
   - Screen parties
   - Coordinate logistics
   - Clear customs
   - Manage payments

3. **Compliance Management**
   - Monitor regulations
   - Audit transactions
   - Maintain records
   - Report as required
   - Improve processes

### Import Operations Framework

```yaml
import_operations:
  pre_importation:
    product_classification:
      - HS code determination
      - Tariff rate lookup
      - Duty calculation
      - Special provisions

    compliance_check:
      - Admissibility review
      - Permit requirements
      - Agency requirements (FDA, USDA, EPA, etc.)
      - Marking requirements
      - Labeling requirements

    supplier_qualification:
      - Restricted party screening
      - Country of origin verification
      - Compliance history
      - Certification requirements

  documentation:
    commercial:
      - Commercial invoice
      - Packing list
      - Bill of lading/airway bill
      - Certificate of origin
      - Insurance certificate

    regulatory:
      - Import permits/licenses
      - Agency forms
      - Prior notice filings
      - Safety certifications

    customs:
      - Entry summary (CBP Form 7501)
      - Immediate delivery (CBP Form 3461)
      - Power of attorney
      - Customs bond
      - ISF (10+2) filing

  customs_clearance:
    process:
      - Entry filing
      - Document review
      - Examination (if selected)
      - Duty payment
      - Release

    entry_types:
      consumption: "Standard entry"
      warehouse: "Bonded warehouse"
      ftz: "Foreign Trade Zone"
      temporary: "Temporary import bond"
      drawback: "Duty drawback"

  duty_management:
    calculation:
      - Tariff rate
      - Transaction value
      - Assists value
      - Freight/insurance
      - Harbor maintenance fee
      - Merchandise processing fee

    reduction_programs:
      - Free trade agreements
      - GSP (Generalized System of Preferences)
      - Foreign Trade Zones
      - Temporary importation
      - Duty drawback
```

### Export Operations Framework

```yaml
export_operations:
  pre_export:
    classification:
      - ECCN determination
      - Schedule B classification
      - EAR99 verification
      - Commerce Control List

    licensing:
      license_types:
        no_license_required: "NLR"
        license_exception: "Various exceptions"
        export_license: "BIS application"

      determination_factors:
        - Item classification (ECCN)
        - Destination country
        - End user
        - End use
        - Parties to transaction

    screening:
      lists:
        - Denied Persons List (BIS)
        - Entity List (BIS)
        - Unverified List (BIS)
        - SDN List (OFAC)
        - Debarred List (DDTC)
        - Consolidated Screening List

      process:
        - All parties screened
        - Hits investigated
        - Documentation maintained
        - Regular rescreening

  documentation:
    commercial:
      - Commercial invoice
      - Packing list
      - Shippers letter of instruction
      - Certificate of origin
      - Export packing list

    regulatory:
      - Export license (if required)
      - AES filing (EEI)
      - Destination control statement
      - End-user certificates
      - Carnet (temporary exports)

  filing_requirements:
    aes_mandatory:
      - Shipments requiring export license
      - Shipments to specific destinations
      - Shipments over $2,500 per schedule B
      - USML items

    exemptions:
      - Low value shipments
      - Personal effects
      - Diplomatic shipments
      - Certain government shipments
```

### Tariff Classification

```yaml
classification:
  harmonized_system:
    structure:
      chapter: "First 2 digits"
      heading: "First 4 digits"
      subheading: "First 6 digits (international)"
      national: "Additional digits (country-specific)"

    us_system:
      import: "HTSUS (10 digits)"
      export: "Schedule B (10 digits)"

  classification_process:
    steps:
      - Identify product characteristics
      - Review section/chapter notes
      - Apply General Rules of Interpretation
      - Determine heading/subheading
      - Apply statistical suffixes

    gri_rules:
      rule_1: "Terms of headings and notes"
      rule_2: "Incomplete articles, mixtures"
      rule_3: "Most specific, essential character, last in order"
      rule_4: "Most akin"
      rule_5: "Containers and packing"
      rule_6: "Subheadings"

  binding_rulings:
    purpose:
      - Classification certainty
      - Duty rate confirmation
      - Compliance assurance

    process:
      - Prepare ruling request
      - Submit to CBP
      - Receive ruling
      - Apply consistently

  common_issues:
    - Sets and kits classification
    - Parts vs. accessories
    - Composite goods
    - Multiple possible headings
    - Substantial transformation
```

### Customs Valuation

```yaml
valuation:
  transaction_value:
    basis: "Price actually paid or payable"

    additions:
      - Commissions (selling)
      - Packing costs
      - Assists
      - Royalties and license fees
      - Proceeds of resale
      - Freight to port of import

    deductions:
      - Post-importation charges
      - International freight (if separate)
      - Duties and taxes
      - Buying commissions

  assists:
    definition: "Items provided free or reduced cost to seller"

    types:
      - Materials and components
      - Tools and equipment
      - Engineering and design work
      - Artwork and development

    valuation:
      - Cost of acquisition
      - Cost of production
      - Apportioned over shipments

  alternative_methods:
    order_of_use:
      1: "Transaction value of identical goods"
      2: "Transaction value of similar goods"
      3: "Deductive value"
      4: "Computed value"
      5: "Derived methods"

  transfer_pricing:
    considerations:
      - Related party transactions
      - Arm's length pricing
      - Supporting documentation
      - CBP review potential
```

### Free Trade Agreements

```yaml
fta_compliance:
  major_agreements:
    usmca: "US-Mexico-Canada Agreement"
    us_korea: "KORUS FTA"
    us_australia: "AUFTA"
    us_singapore: "USSFTA"
    cafta_dr: "Central America-Dominican Republic"

  qualification_process:
    determination:
      - Identify applicable FTA
      - Review rules of origin
      - Analyze product qualification
      - Calculate regional value content
      - Document compliance

    rules_of_origin:
      wholly_obtained: "Goods from territory only"
      tariff_shift: "Change in tariff classification"
      regional_value: "Minimum value added percentage"
      process_rule: "Specific manufacturing requirements"

  regional_value_content:
    methods:
      transaction_value:
        formula: "((TV - VNM) / TV) x 100"
        rvc_threshold: "Varies by product"

      net_cost:
        formula: "((NC - VNM) / NC) x 100"
        rvc_threshold: "Varies by product"

    value_of_non_originating:
      - Purchase price
      - Freight to manufacturer
      - Customs duties

  certification:
    requirements:
      - Certificate of origin
      - Importer knowledge
      - Self-certification
      - Record retention

    documentation:
      - Bill of materials
      - Cost data
      - Manufacturing process
      - Supplier certifications
```

### Export Controls

```yaml
export_controls:
  ear_compliance:
    jurisdiction:
      - Commodities
      - Software
      - Technology
      - Encryption items

    classification:
      eccn_structure:
        category: "0-9"
        product_group: "A-E"
        reasons_for_control: "Various codes"

      ear99:
        - Basic consumer goods
        - Low technology items
        - No specific controls

    license_exceptions:
      common:
        tmp: "Temporary exports"
        rpL: "Servicing and replacement"
        gov: "Government officials"
        tsr: "Technology and software"
        bag: "Baggage"

    red_flags:
      - Unusual payment terms
      - Routing through third country
      - Customer refuses information
      - Unfamiliar end user
      - Inconsistent end use

  itar_compliance:
    jurisdiction:
      - Defense articles
      - Defense services
      - Technical data

    usml_categories:
      - 21 categories of items
      - Enumerated defense articles
      - Technical data
      - Defense services

    licensing:
      - DSP-5 permanent export
      - DSP-73 temporary export
      - TAA technical assistance
      - MLA manufacturing

  sanctions_compliance:
    ofac_programs:
      - Country-based sanctions
      - List-based sanctions
      - Sectoral sanctions
      - Secondary sanctions

    prohibited_activities:
      - Transactions with SDNs
      - Exports to embargoed countries
      - Financial dealings
      - Services to blocked parties
```

### Customs Bond and Compliance Programs

```yaml
compliance_programs:
  customs_bond:
    types:
      single_transaction: "One-time import"
      continuous: "All imports for one year"

    calculation:
      - Import volume
      - Duty amounts
      - Special merchandise
      - Prior violations

  ctpat:
    benefits:
      - Reduced examinations
      - Priority processing
      - Front of line
      - Business resumption priority

    requirements:
      - Security profile
      - Supply chain security
      - Physical security
      - Personnel security
      - Procedural security

    tiers:
      tier_1: "Basic benefits"
      tier_2: "Enhanced benefits"
      tier_3: "Maximum benefits"

  isa:
    importer_self_assessment:
      - Informed compliance
      - Reasonable care
      - Self-testing
      - CBP partnership

  trusted_trader:
    aeo_mutual_recognition:
      - CBP C-TPAT
      - EU AEO
      - Canada PIP
      - Mexico OEA
```

### International Logistics

```yaml
international_logistics:
  transportation_modes:
    ocean:
      fcl: "Full Container Load"
      lcl: "Less than Container Load"
      breakbulk: "Non-containerized"
      roro: "Roll-on/Roll-off"

    air:
      freight: "Cargo aircraft"
      belly: "Passenger aircraft"
      express: "Expedited service"

    ground:
      truck: "Cross-border trucking"
      rail: "International rail"
      intermodal: "Combined modes"

  incoterms_2020:
    any_mode:
      exw: "Ex Works"
      fca: "Free Carrier"
      cpt: "Carriage Paid To"
      cip: "Carriage and Insurance Paid"
      dap: "Delivered at Place"
      dpu: "Delivered at Place Unloaded"
      ddp: "Delivered Duty Paid"

    sea_only:
      fas: "Free Alongside Ship"
      fob: "Free on Board"
      cfr: "Cost and Freight"
      cif: "Cost, Insurance and Freight"

  freight_forwarding:
    services:
      - Booking and documentation
      - Customs brokerage
      - Cargo insurance
      - Warehousing
      - Consolidation

    selection_criteria:
      - Global network
      - Mode expertise
      - Trade lane experience
      - Technology capabilities
      - Compliance support
```

### Record Keeping and Audit

```yaml
compliance_management:
  record_keeping:
    retention_periods:
      import_records: "5 years from date of entry"
      export_records: "5 years from date of export"
      itar_records: "As specified in license"
      fta_records: "5 years minimum"

    required_records:
      - Entry documents
      - Commercial invoices
      - Classification support
      - Valuation documentation
      - FTA qualification
      - Export licenses
      - Screening results

  internal_audit:
    program:
      - Risk assessment
      - Audit plan
      - Testing procedures
      - Findings documentation
      - Corrective action

    areas:
      - Classification accuracy
      - Valuation compliance
      - FTA qualification
      - Export control compliance
      - Screening completeness
      - Record retention

  external_audit:
    cbp_focused_assessment:
      - Prior disclosure opportunity
      - Internal controls review
      - Compliance testing
      - Findings resolution

    bis_audit:
      - Export classification review
      - License compliance
      - Recordkeeping
      - Screening verification
```

### Trade Compliance Metrics

```yaml
metrics:
  import:
    - Entry accuracy rate
    - Classification accuracy
    - Valuation accuracy
    - FTA utilization rate
    - Duty savings achieved
    - Customs holds/exams
    - Liquidation discrepancies

  export:
    - Screening completion rate
    - License compliance
    - AES filing accuracy
    - Denied party hits
    - License processing time
    - Violation incidents

  operational:
    - Clearance cycle time
    - Documentation accuracy
    - Broker performance
    - Freight cost per unit
    - Transit time reliability

  compliance:
    - Audit findings
    - Penalty assessments
    - Prior disclosure rate
    - Training completion
    - Policy adherence
```

## Output Format

### Trade Compliance Assessment
```markdown
# Trade Compliance Assessment: [Import/Export]

## Transaction Overview
- Product: [Description]
- HS Code/ECCN: [Classification]
- Origin/Destination: [Country]
- Value: [$Amount]
- Incoterm: [Term]

## Classification Analysis
| Element | Finding | Status |
|---------|---------|--------|
| HS/ECCN Code | [Code] | [Confirmed/Review] |
| Duty Rate | [%] | [Applicable] |
| Special Provisions | [Any] | [Yes/No] |

## Compliance Requirements
| Requirement | Status | Action Needed |
|-------------|--------|---------------|
| [License/Permit] | [Required/NLR] | [If required] |
| [Agency Filing] | [Required/NA] | [If required] |
| [Screening] | [Completed] | [Results] |

## FTA Qualification (if applicable)
| Agreement | Qualification | RVC |
|-----------|---------------|-----|
| [FTA Name] | [Yes/No] | [%] |

## Documentation Checklist
- [ ] Commercial invoice
- [ ] Packing list
- [ ] Certificate of origin
- [ ] [Additional documents]

## Risk Assessment
| Risk Area | Level | Mitigation |
|-----------|-------|------------|
| [Risk] | [H/M/L] | [Action] |

## Recommendations
1. [Priority recommendation]
2. [Supporting recommendation]

## Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| [Action] | [Name] | [Date] |
```

## Integration Points

- Customs brokerage systems
- Trade management software (SAP GTS, Amber Road)
- Export control systems
- Screening platforms
- ERP systems
- Freight management systems
- Document management
- Duty calculation systems
- FTA management tools

## Best Practices

1. **Classification Accuracy**: Invest in correct classification upfront
2. **Proactive Screening**: Screen all parties before transactions
3. **FTA Utilization**: Maximize duty savings through FTA qualification
4. **Documentation Quality**: Maintain complete, accurate records
5. **Regular Auditing**: Self-audit compliance programs
6. **Training**: Keep staff trained on current regulations
7. **Technology**: Leverage automation for compliance
8. **Broker Partnership**: Work closely with qualified customs brokers

## Common Pitfalls

- Incorrect classification
- Inadequate valuation support
- Missing FTA qualifications
- Incomplete screening
- Poor record keeping
- Outdated compliance procedures
- Ignoring assists in valuation
- Reliance on broker without oversight
- Export control violations
- Failure to file AES when required

## Version History

- 1.0.0: Initial import-export skill
- 1.0.1: Added FTA qualification section
- 1.0.2: Enhanced export controls guidance
