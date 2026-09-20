---
name: pharmaceutical-compliance
description: Helps manage and audit pharmaceutical compliance processes. Expert guidance for FDA regulatory compliance, GxP quality systems, drug safety and pharmacovigilance, clinical trials oversight, and pharmaceutical manufacturing validation processes. Use when navigating industry-specific regulations, processes, or operations.
---

# Pharmaceutical Compliance Skill

> FDA regulations, GxP compliance, drug safety, and clinical trials governance

## Description

This skill provides comprehensive guidance for pharmaceutical regulatory compliance including FDA regulations, GxP frameworks (GMP, GLP, GCP), drug safety and pharmacovigilance, clinical trials oversight, and manufacturing validation. It covers the full pharmaceutical product lifecycle from discovery through post-market surveillance, addressing both domestic and international regulatory requirements. The skill supports regulatory affairs professionals, quality assurance teams, clinical operations staff, and manufacturing compliance officers in maintaining adherence to evolving pharmaceutical standards.

## Activation Triggers

- User mentions "FDA compliance", "pharmaceutical regulations", or "drug approval"
- User asks about GxP, GMP, GLP, or GCP requirements
- User needs help with clinical trial design, IND, or NDA submissions
- User discusses drug safety, adverse events, or pharmacovigilance
- User asks about pharmaceutical manufacturing validation
- User mentions 21 CFR Part 11, electronic records, or data integrity
- User needs guidance on CAPA systems in pharma context
- User asks about pharmaceutical quality systems or ICH guidelines
- User discusses deviation management or change control in pharma
- User mentions batch record review or release procedures

## Instructions

### Core Workflow

1. **Regulatory Assessment**
   - Identify applicable FDA regulations and guidance documents
   - Determine product classification and regulatory pathway
   - Map ICH guidelines to current development phase
   - Evaluate current compliance posture against requirements
   - Document regulatory gaps and risk exposure

2. **Quality System Design**
   - Establish pharmaceutical quality system (PQS) per ICH Q10
   - Define GxP-compliant standard operating procedures
   - Implement document control and change management
   - Design CAPA and deviation management workflows
   - Build quality risk management processes per ICH Q9

3. **Validation and Qualification**
   - Develop validation master plans
   - Execute equipment qualification (IQ/OQ/PQ)
   - Perform process validation per FDA guidance
   - Validate analytical methods and computerized systems
   - Maintain ongoing state of control with continued process verification

4. **Clinical Operations Compliance**
   - Ensure GCP adherence across clinical trial activities
   - Manage IRB/IEC submissions and informed consent
   - Implement clinical data management and integrity controls
   - Oversee investigator site compliance and monitoring
   - Maintain regulatory submissions (IND safety reports, annual reports)

5. **Post-Market Surveillance**
   - Operate pharmacovigilance systems for adverse event detection
   - File required safety reports (MedWatch, CIOMS, PSUR/PBRER)
   - Manage product complaint handling and investigation
   - Execute field safety corrective actions and recalls
   - Conduct periodic benefit-risk assessments

### Regulatory Framework

```yaml
fda_regulatory_framework:
  drug_approval_pathway:
    pre_ind:
      - Drug discovery and screening
      - Preclinical studies (GLP-compliant)
      - CMC development
      - Pharmacology and toxicology
      - Pre-IND meeting with FDA

    ind_phase:
      ind_application:
        - Form FDA 1571
        - Investigator brochure
        - Clinical protocol
        - CMC information
        - Pharmacology/toxicology data
      clinical_trials:
        phase_1: "Safety and dosing (20-100 subjects)"
        phase_2: "Efficacy and side effects (100-500 subjects)"
        phase_3: "Confirmatory efficacy (1,000-5,000 subjects)"
      safety_reporting:
        - IND safety reports (15-day, 7-day)
        - Annual reports
        - Protocol amendments

    nda_phase:
      nda_application:
        - Form FDA 356h
        - Clinical data and analysis
        - CMC data
        - Nonclinical data
        - Proposed labeling
      review_types:
        standard: "10-month review"
        priority: "6-month review"
        accelerated: "Surrogate endpoints"
        breakthrough: "Expedited development"
        fast_track: "Rolling submission"

    post_approval:
      - Phase 4 studies and post-marketing commitments
      - Pharmacovigilance, safety reporting, and labeling updates
      - Manufacturing site inspections and annual quality reviews

  key_regulations:
    21_cfr_parts:
      part_11: "Electronic records and signatures"
      part_210: "cGMP general provisions"
      part_211: "cGMP for finished pharmaceuticals"
      part_312: "Investigational new drug application"
      part_314: "New drug applications"
      part_600: "Biological products general"
      part_820: "Quality system regulation (devices)"

    ich_guidelines:
      quality:
        q1: "Stability testing"
        q2: "Analytical validation"
        q3: "Impurities"
        q7: "GMP for APIs"
        q8: "Pharmaceutical development"
        q9: "Quality risk management"
        q10: "Pharmaceutical quality system"
        q12: "Lifecycle management"
      safety:
        s1: "Carcinogenicity studies"
        s2: "Genotoxicity testing"
        s7: "Pharmacology studies"
      efficacy:
        e6: "Good clinical practice"
        e8: "General considerations for clinical studies"
        e9: "Statistical principles"
```

### GxP Compliance System

```yaml
gxp_compliance:
  good_manufacturing_practice:
    facility:
      - Facility design and qualification
      - Environmental monitoring programs
      - Cleanroom classifications (ISO 14644)
      - Utility qualification (HVAC, water, compressed gases)
      - Preventive maintenance programs

    production:
      - Batch record design and review
      - In-process controls and sampling
      - Material management and traceability
      - Equipment cleaning validation
      - Process hold time studies

    quality_control:
      - Laboratory controls and testing
      - Stability programs (ICH Q1A)
      - Reference standard management
      - Out-of-specification (OOS) investigations
      - Certificate of analysis generation

    data_integrity:
      alcoa_plus:
        a: "Attributable - who performed action"
        l: "Legible - readable and permanent"
        c: "Contemporaneous - recorded at time of activity"
        o: "Original - first-capture data"
        a2: "Accurate - no errors or editing without documentation"
        plus: "Complete, Consistent, Enduring, Available"
      controls: "Audit trails, electronic signatures, access controls, backup and archival"

  good_laboratory_practice:
    study_conduct:
      - Study plan/protocol
      - Study director responsibilities
      - Quality assurance unit oversight
      - Test article characterization
      - Specimen handling and retention

    documentation:
      - Raw data recording
      - Study report generation
      - Archive requirements
      - Amendment documentation

  good_clinical_practice:
    investigator_responsibilities:
      - Protocol adherence
      - Informed consent process
      - Adverse event reporting
      - Source document maintenance
      - Regulatory document management

    sponsor_responsibilities:
      - Site selection and qualification
      - Clinical monitoring plans
      - Safety data management
      - Regulatory submissions
      - Study drug accountability
```

### Templates

#### FDA Inspection Readiness Checklist
```markdown
# FDA Inspection Readiness Checklist

## Pre-Inspection Preparation
- [ ] Designated inspection coordinator and back-room team
- [ ] Updated facility tour route with restricted area controls
- [ ] Current organizational chart with key personnel
- [ ] All SOPs current, approved, and accessible
- [ ] Training records complete and retrievable

## Documentation Readiness
- [ ] Batch records for last 3 years indexed and retrievable
- [ ] Deviation and CAPA logs current with no overdue items
- [ ] Validation master plan and protocols up to date
- [ ] Stability program on schedule with current data
- [ ] Annual product quality reviews completed

## Quality System Readiness
- [ ] Change control log current with no pending items
- [ ] Complaint files organized with trend analyses
- [ ] Supplier qualification records complete
- [ ] Laboratory notebooks and data integrity verified
- [ ] Equipment calibration and maintenance current

## Personnel Readiness
- [ ] Subject matter experts briefed on roles
- [ ] "Do and Don't" training conducted for all staff
- [ ] Escort teams assigned and trained
- [ ] Response protocols for 483 observations reviewed
```

#### Deviation Investigation Report
```markdown
# Deviation Investigation Report

## Deviation Summary
- Deviation ID: [DEV-XXXX]
- Date Detected: [Date]
- Product/Process: [Name]
- Batch Number: [Number]
- Classification: [Critical/Major/Minor]

## Description of Deviation
[Detailed factual account of what occurred vs. expected]

## Immediate Actions Taken
1. [Containment action and date]
2. [Notification actions]
3. [Interim controls implemented]

## Root Cause Investigation
- Method Used: [Fishbone/5-Why/Fault Tree]
- Root Cause: [Identified root cause]
- Contributing Factors: [List]
- Impact Assessment: [Product quality/patient safety impact]

## Corrective and Preventive Actions
| Action | Type | Owner | Due Date | Status |
|--------|------|-------|----------|--------|
| [Action] | [C/P] | [Name] | [Date] | [Open/Closed] |

## Disposition Decision
- [ ] Release  [ ] Reject  [ ] Reprocess  [ ] Rework
- Rationale: [Justification for disposition]

## Approval
| Role | Name | Signature | Date |
|------|------|-----------|------|
| Investigator | | | |
| QA Reviewer | | | |
| QA Approver | | | |
```

### Best Practices

- Maintain a "quality culture" where compliance is embedded in daily operations, not treated as overhead
- Implement risk-based approaches to validation, testing, and supplier management per ICH Q9
- Ensure data integrity through ALCOA+ principles across all GxP records
- Keep regulatory intelligence current by monitoring FDA guidance, warning letters, and consent decrees
- Conduct mock inspections at least annually to identify and remediate gaps proactively
- Build robust change control systems that evaluate regulatory impact before implementation
- Maintain clear separation of quality unit independence from production management
- Document everything contemporaneously; if it is not documented, it did not happen
- Train personnel not just on procedures but on the "why" behind regulatory requirements
- Implement electronic systems with 21 CFR Part 11 compliance from the design phase
- Establish metrics-driven quality review boards with executive visibility
- Maintain supplier qualification programs with risk-based audit schedules
- Ensure pharmacovigilance systems can detect safety signals across global markets
- Practice continuous process verification rather than relying solely on initial validation

### Common Patterns

#### Pattern: OOS Investigation Workflow
```
1. Analyst identifies result outside specification
2. Phase I - Laboratory investigation (analyst error, equipment, method)
3. If no lab error found, proceed to Phase II
4. Phase II - Manufacturing investigation (process, materials, environment)
5. Determine root cause and assess batch impact
6. Make disposition decision with full documentation
7. Implement CAPA to prevent recurrence
```

#### Pattern: Change Control Impact Assessment
```
1. Change initiator submits change request with rationale
2. Cross-functional team evaluates regulatory impact
3. Assess impact on validated state (process, method, system)
4. Determine if prior approval supplement or annual reportable
5. Execute change with qualification/validation as needed
6. Update affected documents (SOPs, batch records, specs)
7. Communicate change to all affected stakeholders
8. Verify effectiveness during post-implementation review
```

#### Pattern: Annual Product Quality Review
```
1. Compile batch data for review period (yield, deviations, OOS)
2. Analyze process capability and trending
3. Review raw material and supplier quality data
4. Assess stability program results and shelf-life adequacy
5. Review complaint and adverse event trends
6. Evaluate CAPA effectiveness and outstanding items
7. Identify process improvement opportunities
8. Present findings to quality council with recommendations
```

### Output Formats

#### Regulatory Compliance Dashboard
```markdown
# Pharmaceutical Compliance Dashboard: [Facility/Product]

## Regulatory Status
| Area | Status | Last Inspection | Next Due |
|------|--------|-----------------|----------|
| FDA cGMP | [Compliant] | [Date] | [Date] |
| DEA Schedule | [Current] | [Date] | [Date] |
| State Licenses | [Current] | [Date] | [Date] |

## Quality Metrics (Current Period)
| Metric | Value | Target | Trend |
|--------|-------|--------|-------|
| Batch Success Rate | [%] | >98% | [Up/Down] |
| Deviation Rate | [per batch] | <2% | [Up/Down] |
| CAPA On-Time Closure | [%] | >90% | [Up/Down] |
| OOS Rate | [%] | <1% | [Up/Down] |
| Right First Time | [%] | >95% | [Up/Down] |

## Open Items Summary
- Critical Deviations: [Count]
- Overdue CAPAs: [Count]
- Pending Change Controls: [Count]
- Expiring Validations: [Count]
```

#### Pharmacovigilance Safety Report
```markdown
# Periodic Safety Report: [Product Name]

## Reporting Period: [Start Date] to [End Date]

## Adverse Event Summary
| Category | Serious | Non-Serious | Total |
|----------|---------|-------------|-------|
| Expected | [Count] | [Count] | [Count] |
| Unexpected | [Count] | [Count] | [Count] |

## Signal Detection Summary
| Signal | Status | Assessment | Action |
|--------|--------|------------|--------|
| [Signal] | [New/Ongoing/Closed] | [Evaluation] | [Action taken] |

## Benefit-Risk Assessment
- Current benefit-risk balance: [Favorable/Unchanged/Under review]
- Labeling changes recommended: [Yes/No]
- Risk minimization measures: [Current/Proposed]

## Regulatory Submissions Filed
| Submission | Type | Agency | Date Filed |
|------------|------|--------|------------|
| [Report] | [15-day/PSUR/PBRER] | [FDA/EMA] | [Date] |
```

## Version History

- 1.0.0: Initial pharmaceutical compliance skill
