---
name: fda-compliance
description: Helps configure and build fda compliance processes. Comprehensive guidance for FDA regulatory compliance including medical device classification, premarket submissions (510(k), PMA, De Novo), Quality System Regulation (QSR), post-market surveillance, and regulatory strategy. Use when configuring, building, or troubleshooting AI agent workflows.
---

# FDA Compliance Skill

> Regulatory submissions, 510(k), PMA, device classification, and FDA requirements

## Description

This skill provides comprehensive guidance for FDA regulatory compliance including medical device classification, premarket submissions (510(k), PMA, De Novo), Quality System Regulation (QSR), post-market surveillance, and regulatory strategy. It covers the full product lifecycle from concept through commercialization and ongoing compliance.

## Activation Triggers

- User mentions "FDA", "510(k)", "PMA", "De Novo"
- User asks about medical device classification
- User needs help with regulatory submissions
- User discusses QSR or quality management
- User asks about FDA inspections or audits
- User mentions device registration or listing
- User needs post-market surveillance guidance

## Instructions

### Core Workflow

1. **Regulatory Assessment**
   - Determine product classification
   - Identify applicable regulations
   - Assess predicate devices (if applicable)
   - Evaluate submission pathway
   - Identify standards and guidance documents

2. **Submission Preparation**
   - Develop regulatory strategy
   - Compile technical documentation
   - Prepare submission components
   - Conduct internal review
   - Address FDA feedback

3. **Post-Submission Activities**
   - Respond to FDA questions
   - Manage clearance/approval process
   - Complete establishment registration
   - Implement post-market requirements
   - Maintain ongoing compliance

### Device Classification Framework

```yaml
device_classification:
  class_i:
    risk_level: "Low risk"
    examples:
      - Bandages
      - Tongue depressors
      - Examination gloves
    requirements:
      - General controls
      - Most exempt from premarket review
      - Establishment registration
      - Device listing
      - Good manufacturing practices (GMP)

  class_ii:
    risk_level: "Moderate risk"
    examples:
      - Powered wheelchairs
      - Pregnancy test kits
      - Contact lenses
    requirements:
      - General controls
      - Special controls
      - 510(k) typically required
      - Performance standards

  class_iii:
    risk_level: "High risk"
    examples:
      - Pacemakers
      - Heart valves
      - Implantable defibrillators
    requirements:
      - General controls
      - Special controls
      - PMA required
      - Clinical data typically required
```

### Premarket Submission Pathways

```yaml
submission_pathways:
  510k_traditional:
    purpose: "Demonstrate substantial equivalence to predicate"
    timeline: "90-day FDA review clock"
    requirements:
      - Predicate device identification
      - Device description and specifications
      - Comparison to predicate
      - Performance testing data
      - Biocompatibility (if applicable)
      - Sterilization validation (if applicable)
      - Software documentation (if applicable)
      - Labeling

  510k_special:
    purpose: "Streamlined pathway for well-understood devices"
    timeline: "30-day review clock"
    requirements:
      - Summary of device changes
      - Comparison to guidance/standards
      - Declaration of conformance
      - Abbreviated performance data

  510k_abbreviated:
    purpose: "Use recognized standards for clearance basis"
    timeline: "90-day review clock"
    requirements:
      - Guidance document conformance
      - Declaration of conformity to standards
      - Summary reports instead of raw data

  de_novo:
    purpose: "New device types without predicates"
    timeline: "150 days"
    requirements:
      - Risk-benefit analysis
      - General and special controls proposal
      - Non-clinical testing
      - Clinical data (may be required)
      - Creates new classification for future 510(k)s

  pma:
    purpose: "High-risk Class III devices"
    timeline: "180 days (longer in practice)"
    requirements:
      - Clinical trials (typically)
      - Extensive non-clinical testing
      - Manufacturing information
      - Proposed labeling
      - Annual reports post-approval
      - Supplements for changes
```

### Quality System Regulation (QSR)

```yaml
qsr_requirements:
  management_responsibility:
    - Quality policy
    - Organization structure
    - Management representative
    - Management review

  design_controls:
    - Design planning
    - Design input
    - Design output
    - Design review
    - Design verification
    - Design validation
    - Design transfer
    - Design history file

  document_controls:
    - Document approval and distribution
    - Document changes
    - Master record

  purchasing_controls:
    - Supplier evaluation
    - Purchasing data
    - Supplier agreements

  production_and_process:
    - Production specifications
    - Process validation
    - Process changes
    - Environmental control

  corrective_and_preventive:
    - CAPA procedures
    - Problem analysis
    - Verification of effectiveness
    - Trend analysis

  records:
    - Device history record (DHR)
    - Device master record (DMR)
    - Quality system record (QSR)
    - Complaint files
```

### 510(k) Submission Structure

```yaml
510k_components:
  administrative:
    - Cover letter
    - Application form (FDA Form 3514)
    - Table of contents
    - Truthful and accuracy statement
    - Summary or statement
    - Class III summary (if applicable)

  device_description:
    - General description
    - Principle of operation
    - Indications for use
    - Comparison to predicate
    - Technical specifications
    - Pictures/schematics

  substantial_equivalence:
    - Predicate identification
    - Comparison table
    - Differences and impact analysis
    - Technological characteristics

  performance_data:
    - Non-clinical testing
    - Bench testing
    - Biocompatibility
    - Sterilization validation
    - Shelf life/stability
    - Electrical safety (IEC 60601)
    - EMC testing

  software_documentation:
    - Level of concern determination
    - Software description
    - Software requirements specification
    - Architecture design
    - Hazard analysis
    - Verification and validation
    - Revision history
    - Cybersecurity

  labeling:
    - Instructions for use
    - Package labeling
    - Promotional materials (if any)
```

### Post-Market Requirements

```yaml
post_market:
  establishment_registration:
    - Annual registration
    - Device listing
    - FDA registration number

  medical_device_reporting:
    - Death or serious injury
    - Malfunction with potential harm
    - 30-day reports (initial)
    - 5-day reports (urgent)
    - Annual certification

  corrections_and_removals:
    - Report within 10 days
    - Notification strategy
    - Effectiveness checks

  post_market_surveillance:
    - Required for certain devices
    - 522 study orders
    - Real-world evidence
    - Registry participation
```

### FDA Inspection Readiness

```yaml
inspection_readiness:
  inspection_types:
    - Pre-approval inspection (PAI)
    - Routine surveillance
    - For cause inspection
    - Compliance follow-up

  key_focus_areas:
    - Design controls
    - CAPA system
    - Complaint handling
    - Production records
    - Document control
    - Purchasing controls

  observation_classifications:
    - Official Action Indicated (OAI)
    - Voluntary Action Indicated (VAI)
    - No Action Indicated (NAI)

  form_483_response:
    - 15 business days to respond
    - Address each observation
    - Provide corrective actions
    - Include timelines
    - Evidence of completion
```

### Software as Medical Device (SaMD)

```yaml
samd:
  classification:
    - Intended use
    - Clinical decision significance
    - Healthcare situation

  documentation:
    - IEC 62304 compliance
    - Risk management (ISO 14971)
    - Cybersecurity controls
    - Interoperability
    - Real-world performance

  cybersecurity:
    - Premarket cybersecurity guidance
    - Threat modeling
    - Vulnerability management
    - Security architecture
    - Incident response plan
```

### International Regulatory Alignment

```yaml
international:
  eu_mdr:
    - CE marking requirements
    - Notified body assessment
    - UDI requirements
    - Clinical evaluation
    - Post-market clinical follow-up

  mdsap:
    - Single audit program
    - US, Canada, Japan, Brazil, Australia
    - Harmonized audit approach

  global_standards:
    - ISO 13485 (QMS)
    - ISO 14971 (Risk Management)
    - IEC 62304 (Software)
    - IEC 60601 (Electrical safety)
```

### Regulatory Strategy Development

```yaml
regulatory_strategy:
  assessment_factors:
    - Device classification
    - Predicate availability
    - Clinical evidence needs
    - Time to market
    - Geographic markets
    - Competitive landscape

  pathway_selection:
    - Evaluate all options
    - Consider pre-submission meetings
    - Plan for contingencies
    - Budget for timeline

  documentation_planning:
    - Standards compliance matrix
    - Testing requirements
    - Clinical evidence strategy
    - Labeling development
```

## Output Format

### Regulatory Assessment Report
```markdown
# Regulatory Assessment: [Device Name]

## Device Description
[Brief description of device and intended use]

## Classification Analysis
- Product Code: [Code]
- Regulation Number: [21 CFR xxx]
- Device Class: [I/II/III]
- Submission Type: [510(k)/PMA/De Novo/Exempt]

## Predicate Analysis (if 510(k))
| Predicate | K Number | Similarities | Differences |
|-----------|----------|--------------|-------------|
| [Name] | [K#] | [List] | [List] |

## Applicable Standards
| Standard | Title | Applicability |
|----------|-------|---------------|
| [Standard] | [Title] | [Required/Recommended] |

## Testing Requirements
| Test Category | Requirement | Status |
|---------------|-------------|--------|
| [Category] | [Specific test] | [Planned/Complete] |

## Timeline Estimate
[Project milestones and regulatory timeline]

## Recommendations
[Strategic recommendations for regulatory pathway]
```

## Integration Points

- Document management systems
- Quality management systems (QMS)
- Electronic submissions (eCopy, ESG)
- FDA databases (510(k), MAUDE, GUDID)
- Standards databases (FDA Recognized Standards)
- Clinical trial management systems

## Best Practices

1. **Early Engagement**: Use pre-submission meetings
2. **Predicate Strategy**: Select predicates carefully
3. **Standards Compliance**: Follow recognized standards
4. **Documentation Quality**: Thorough, organized submissions
5. **Design Controls**: Implement from project start
6. **Risk Management**: Continuous risk assessment
7. **Testing Strategy**: Plan comprehensive testing early
8. **Regulatory Intelligence**: Monitor FDA guidance updates

## Common Pitfalls

- Poor predicate selection for 510(k)
- Inadequate design control documentation
- Incomplete software documentation
- Underestimating testing requirements
- Poor CAPA system implementation
- Delayed MDR reporting
- Insufficient clinical evidence
- Not following current FDA guidance

## Version History

- 1.0.0: Initial FDA compliance skill
- 1.0.1: Added SaMD section
- 1.0.2: Enhanced QSR requirements
