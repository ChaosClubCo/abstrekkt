---
name: clinical-trials
description: Comprehensive guidance for clinical trial operations including protocol design, regulatory submissions, IRB/ethics processes, patient recruitment and retention, site management, data collection, safety monitoring, and trial closeout. Covers pharmaceutical, device, and investigator-initiated trials. Use when designing, creating, or reviewing creative deliverables.
---

# Clinical Trials Skill

> Protocol design, IRB submissions, patient recruitment, and trial management

## Description

This skill provides comprehensive guidance for clinical trial operations including protocol design, regulatory submissions, IRB/ethics committee processes, patient recruitment and retention, site management, data collection, safety monitoring, and trial closeout. It covers pharmaceutical, device, and investigator-initiated trials across all phases.

## Activation Triggers

- User mentions "clinical trial", "clinical study", "research protocol"
- User asks about IRB or ethics committee submissions
- User needs help with patient recruitment strategies
- User discusses informed consent or study procedures
- User asks about GCP (Good Clinical Practice)
- User mentions CRF design or data collection
- User needs trial management or monitoring guidance

## Instructions

### Core Workflow

1. **Protocol Development**
   - Define research objectives and endpoints
   - Design study methodology
   - Develop eligibility criteria
   - Plan statistical analysis
   - Draft protocol document

2. **Regulatory Preparation**
   - Prepare IRB/IEC submission
   - File regulatory applications (IND/IDE)
   - Develop informed consent documents
   - Create site qualification packages
   - Establish monitoring plans

3. **Trial Execution**
   - Activate study sites
   - Implement recruitment strategies
   - Conduct study visits
   - Collect and manage data
   - Monitor safety and quality

### Trial Phases Overview

```yaml
trial_phases:
  phase_0:
    purpose: "Exploratory/microdosing"
    participants: "10-15"
    focus: "Pharmacokinetics, pharmacodynamics"
    duration: "Weeks"

  phase_1:
    purpose: "Safety and dosing"
    participants: "20-100"
    focus: "Safety, tolerability, dosing"
    duration: "Months"

  phase_2:
    purpose: "Efficacy and side effects"
    participants: "100-300"
    focus: "Preliminary efficacy, dose ranging"
    duration: "Months to 2 years"

  phase_3:
    purpose: "Confirm efficacy"
    participants: "300-3,000+"
    focus: "Efficacy confirmation, safety monitoring"
    duration: "1-4 years"

  phase_4:
    purpose: "Post-market surveillance"
    participants: "Varies"
    focus: "Long-term safety, real-world effectiveness"
    duration: "Ongoing"
```

### Protocol Design Framework

```yaml
protocol_components:
  title_and_identifiers:
    - Protocol title
    - Protocol number/version
    - Sponsor information
    - Principal investigator

  background:
    - Scientific rationale
    - Literature review
    - Pre-clinical data summary
    - Prior clinical experience

  objectives_and_endpoints:
    primary:
      - Clear, measurable objective
      - Primary efficacy endpoint
      - Timing of assessment
    secondary:
      - Additional efficacy measures
      - Safety endpoints
      - Quality of life measures
    exploratory:
      - Biomarker analyses
      - Subgroup analyses

  study_design:
    - Study type (interventional, observational)
    - Control type (placebo, active, historical)
    - Blinding (open, single, double)
    - Randomization scheme
    - Treatment arms and duration

  eligibility_criteria:
    inclusion:
      - Age range
      - Disease/condition criteria
      - Diagnostic requirements
      - Adequate organ function
    exclusion:
      - Contraindications
      - Concurrent conditions
      - Prior treatments
      - Pregnancy/lactation

  study_procedures:
    - Visit schedule
    - Assessments at each visit
    - Sample collection
    - Imaging requirements
    - Quality of life instruments

  statistical_plan:
    - Sample size justification
    - Primary analysis method
    - Handling of missing data
    - Interim analyses
    - Stopping rules
```

### IRB/Ethics Committee Submission

```yaml
irb_submission:
  initial_review:
    required_documents:
      - Protocol (current version)
      - Investigator brochure
      - Informed consent form(s)
      - HIPAA authorization
      - Recruitment materials
      - Questionnaires/surveys
      - Investigator CV
      - Financial disclosure
      - Lab certifications

  review_categories:
    full_board:
      - Greater than minimal risk
      - Vulnerable populations
      - Novel interventions
    expedited:
      - Minimal risk
      - Minor changes to approved research
    exempt:
      - Educational research
      - Survey/interview (non-sensitive)
      - Existing data analysis

  informed_consent_elements:
    required:
      - Purpose of research
      - Duration and procedures
      - Risks and discomforts
      - Benefits
      - Alternatives
      - Confidentiality provisions
      - Compensation for injury
      - Contact information
      - Voluntary participation
      - Right to withdraw
```

### Patient Recruitment Strategies

```yaml
recruitment:
  pre_screening:
    - EHR database queries
    - Clinic referrals
    - Registry outreach
    - Previous study participants

  advertising:
    - IRB-approved materials only
    - Social media campaigns
    - Print/radio/TV ads
    - Community outreach
    - Patient advocacy groups

  screening_process:
    - Initial phone screen
    - Medical record review
    - Screening visit
    - Laboratory assessments
    - Eligibility confirmation

  retention_strategies:
    - Regular communication
    - Appointment reminders
    - Transportation assistance
    - Flexible scheduling
    - Study team relationships
    - Retention incentives

  metrics:
    - Screening rate
    - Screen failure rate
    - Enrollment rate
    - Dropout rate
    - Visit compliance
```

### Good Clinical Practice (GCP)

```yaml
gcp_principles:
  core_principles:
    - Ethical conduct
    - Scientific soundness
    - Informed consent
    - Qualified personnel
    - Protocol compliance
    - Accurate documentation
    - Subject safety
    - Data integrity
    - Confidentiality

  responsibilities:
    investigator:
      - Protocol compliance
      - Subject safety monitoring
      - Informed consent process
      - Accurate data collection
      - Adverse event reporting
      - Staff qualification

    sponsor:
      - Protocol design
      - Regulatory submissions
      - Study monitoring
      - Safety surveillance
      - Quality assurance
      - Medical oversight

  documentation:
    - Source documents
    - Case report forms
    - Regulatory binder
    - Training records
    - Delegation log
    - Correspondence files
```

### Data Collection and Management

```yaml
data_management:
  crf_design:
    - Paper vs electronic (EDC)
    - Data element definitions
    - Edit checks and validation
    - Query management
    - Audit trail requirements

  edc_systems:
    - Medidata Rave
    - Oracle Clinical
    - REDCap
    - Veeva Vault CDMS
    - OpenClinica

  data_quality:
    - Edit checks
    - Manual data review
    - Query resolution
    - Source document verification
    - Coding (MedDRA, WHO Drug)

  data_lock:
    - Query resolution complete
    - Medical review complete
    - Data clarification forms resolved
    - Database lock procedures
```

### Safety Monitoring

```yaml
safety_monitoring:
  adverse_event_reporting:
    serious_ae:
      - Death
      - Life-threatening
      - Hospitalization
      - Disability
      - Congenital anomaly
      - Other medically important

    reporting_timelines:
      - Fatal/life-threatening: 24 hours
      - Other SAE: 15 days
      - Unexpected events: expedited
      - Annual safety reports

  dsmb:
    purpose: "Data Safety Monitoring Board"
    functions:
      - Review accumulating data
      - Assess safety signals
      - Evaluate efficacy interim
      - Recommend continuation/modification/termination

  safety_signals:
    - Signal detection methods
    - Causality assessment
    - Regulatory reporting
    - Protocol amendments if needed
```

### Site Monitoring

```yaml
monitoring:
  visit_types:
    site_initiation:
      - Review regulatory documents
      - Train site staff
      - Verify supplies/equipment
      - Review procedures

    routine_monitoring:
      - Source document verification
      - CRF review
      - Protocol compliance
      - Informed consent verification
      - Regulatory file review
      - Drug accountability

    close_out:
      - Final data review
      - Drug return/destruction
      - Record retention requirements
      - Study file archival

  risk_based_monitoring:
    - Central data review
    - Key risk indicators
    - Targeted source verification
    - Reduced on-site burden
```

### Trial Closeout

```yaml
closeout:
  activities:
    - Final data queries resolved
    - Database lock
    - Final monitoring visit
    - Drug accountability reconciliation
    - Regulatory submissions (IND safety report)
    - Site close-out letters
    - IRB notification
    - ClinicalTrials.gov results posting

  document_retention:
    sponsor: "15 years minimum (varies by regulation)"
    site: "Per institutional and regulatory requirements"
    essential_documents: "Regulatory binder, source documents, ICFs"

  reporting:
    - Clinical study report
    - Results publication
    - ClinicalTrials.gov posting (within 12 months)
    - Regulatory authority notification
```

## Output Format

### Protocol Synopsis
```markdown
# Protocol Synopsis: [Study Title]

## Study Information
- Protocol Number: [Number]
- Phase: [Phase]
- Sponsor: [Name]
- Therapeutic Area: [Area]

## Objectives
**Primary:** [Primary objective and endpoint]

**Secondary:** [Secondary objectives and endpoints]

## Study Design
- Type: [Interventional/Observational]
- Control: [Placebo/Active/None]
- Blinding: [Open/Single/Double]
- Randomization: [Ratio and method]

## Population
- Target enrollment: [N]
- Key inclusion: [Criteria]
- Key exclusion: [Criteria]

## Treatment
- Investigational product: [Description]
- Dose and schedule: [Details]
- Duration: [Duration]

## Assessments
| Visit | Timing | Key Assessments |
|-------|--------|-----------------|
| Screening | Day -28 to -1 | [List] |
| Baseline | Day 1 | [List] |
| [Visit] | [Time] | [List] |

## Statistical Analysis
- Sample size: [N] with [power]% power
- Primary analysis: [Method]
- Key secondary: [Method]

## Timeline
- First patient in: [Date]
- Last patient out: [Date]
- Primary analysis: [Date]
```

## Integration Points

- Electronic Data Capture (EDC) systems
- Clinical Trial Management Systems (CTMS)
- Randomization and Trial Supply Management (RTSM)
- Safety databases (pharmacovigilance)
- ClinicalTrials.gov
- EHR systems for recruitment
- Laboratory information systems

## Best Practices

1. **Protocol Quality**: Invest in robust protocol design
2. **Feasibility Assessment**: Evaluate sites thoroughly
3. **Recruitment Planning**: Start early, plan contingencies
4. **Data Quality**: Build quality into processes
5. **Safety First**: Prioritize participant safety always
6. **Communication**: Regular sponsor-site dialogue
7. **Training**: Continuous staff education
8. **Documentation**: If it isn't documented, it didn't happen

## Common Pitfalls

- Overly complex eligibility criteria
- Unrealistic enrollment projections
- Inadequate site selection/feasibility
- Poor informed consent processes
- Delayed AE/SAE reporting
- Incomplete source documentation
- Protocol deviations not addressed
- Insufficient budget for full trial

## Version History

- 1.0.0: Initial clinical trials skill
- 1.0.1: Added recruitment strategies section
- 1.0.2: Enhanced GCP compliance guidance
