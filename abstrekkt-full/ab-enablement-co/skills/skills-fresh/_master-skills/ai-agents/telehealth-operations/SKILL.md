---
name: telehealth-operations
description: Comprehensive guidance for telehealth operations including virtual care workflows, remote patient monitoring (RPM), platform selection and configuration, regulatory compliance, reimbursement optimization, and quality assurance. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Telehealth Operations Skill

> Virtual care delivery, remote patient monitoring, and telemedicine platform management

## Description

This skill provides comprehensive guidance for telehealth operations including virtual care workflows, remote patient monitoring (RPM), platform selection and configuration, regulatory compliance, reimbursement optimization, and quality assurance. It covers synchronous and asynchronous modalities across ambulatory, urgent care, and specialty care settings.

## Activation Triggers

- User mentions "telehealth", "telemedicine", "virtual care"
- User asks about remote patient monitoring (RPM)
- User needs help with video visit workflows
- User discusses telehealth platforms or technology
- User asks about telehealth billing or reimbursement
- User mentions store-and-forward or asynchronous care
- User needs telehealth compliance guidance

## Instructions

### Core Workflow

1. **Program Assessment**
   - Define telehealth use cases and objectives
   - Assess technology infrastructure
   - Evaluate regulatory requirements
   - Identify patient populations
   - Determine staffing needs

2. **Platform Implementation**
   - Select and configure technology
   - Develop clinical workflows
   - Create training programs
   - Establish quality metrics
   - Launch and monitor

3. **Optimization**
   - Monitor utilization and outcomes
   - Analyze patient satisfaction
   - Optimize scheduling and access
   - Improve clinical workflows
   - Expand service offerings

### Telehealth Modalities

```yaml
modalities:
  synchronous:
    description: "Real-time audio/video"
    use_cases:
      - Primary care visits
      - Mental health therapy
      - Specialist consultations
      - Urgent care triage
      - Follow-up visits
    requirements:
      - Video conferencing platform
      - Adequate bandwidth
      - Private environment
      - Appropriate lighting

  asynchronous:
    description: "Store-and-forward"
    use_cases:
      - Dermatology consultations
      - Radiology interpretation
      - Ophthalmology screening
      - Pathology review
    requirements:
      - Image capture devices
      - Secure transmission
      - Structured data collection
      - Provider review workflow

  remote_patient_monitoring:
    description: "Continuous or periodic device data"
    use_cases:
      - Chronic disease management
      - Post-surgical monitoring
      - High-risk pregnancy
      - Cardiac monitoring
    devices:
      - Blood pressure monitors
      - Glucose meters
      - Pulse oximeters
      - Weight scales
      - Cardiac monitors
      - Activity trackers

  mobile_health:
    description: "App-based health tools"
    use_cases:
      - Medication reminders
      - Symptom tracking
      - Health education
      - Care coordination
```

### Virtual Visit Workflow

```yaml
virtual_visit:
  pre_visit:
    patient_side:
      - Appointment confirmation
      - Technology check
      - Intake forms completion
      - Insurance verification
      - Consent acknowledgment
      - Virtual waiting room

    provider_side:
      - Schedule review
      - Chart preparation
      - Technology setup
      - Environment check
      - Backup plan ready

  during_visit:
    connection:
      - Patient identification
      - Connection verification
      - Audio/video quality check

    clinical:
      - Chief complaint review
      - History taking
      - Visual examination
      - Vital signs (if available)
      - Assessment and plan
      - Patient education
      - Treatment decisions

    documentation:
      - Real-time or post-visit
      - Telehealth-specific templates
      - Place of service codes
      - Modifier documentation

  post_visit:
    - After-visit summary
    - Prescription transmission
    - Lab/imaging orders
    - Referral coordination
    - Follow-up scheduling
    - Patient satisfaction survey
```

### Remote Patient Monitoring Program

```yaml
rpm_program:
  patient_enrollment:
    eligibility:
      - Chronic condition(s)
      - Clinical necessity
      - Technology capability
      - Patient willingness
      - Insurance coverage

    onboarding:
      - Device selection
      - Device shipment/training
      - Connectivity setup
      - App configuration
      - Initial readings

  monitoring_workflow:
    data_collection:
      - Automatic device sync
      - Patient-entered data
      - Symptom surveys
      - Alert thresholds

    clinical_review:
      - Daily data review
      - Alert prioritization
      - Patient outreach
      - Care plan adjustments
      - Provider escalation

    interventions:
      - Virtual touchpoints
      - Medication adjustments
      - Education delivery
      - Care coordination
      - Emergency escalation

  billing_requirements:
    cpt_codes:
      "99453": "Initial device setup (once per episode)"
      "99454": "Device supply with daily readings (monthly)"
      "99457": "First 20 min clinical time (monthly)"
      "99458": "Each additional 20 min (monthly)"
```

### Technology Platform Requirements

```yaml
platform_requirements:
  core_functionality:
    - Video/audio conferencing
    - Screen sharing
    - Waiting room
    - Virtual rooming
    - Chat/messaging
    - Document sharing
    - Recording capability

  integration:
    - EHR integration (scheduling, documentation)
    - Single sign-on (SSO)
    - Patient portal integration
    - Billing system integration
    - RPM device integration

  security:
    - HIPAA compliance
    - End-to-end encryption
    - BAA execution
    - Access controls
    - Audit logging
    - Data at rest encryption

  patient_experience:
    - Browser-based (no download)
    - Mobile app option
    - Low bandwidth mode
    - Language support
    - Accessibility (ADA)
    - Tech support access

  provider_experience:
    - EHR workflow integration
    - Template documentation
    - E-prescribing access
    - Order entry
    - Multi-patient queue
    - Provider-to-provider handoff
```

### Regulatory and Compliance

```yaml
compliance:
  hipaa:
    - BAA with platform vendor
    - Patient privacy protections
    - Secure data transmission
    - Access controls
    - Breach notification procedures

  licensure:
    - State medical board requirements
    - Interstate Medical Licensure Compact
    - State-specific telehealth laws
    - Prescribing restrictions
    - Controlled substance rules

  consent:
    - Informed consent for telehealth
    - Technology limitations disclosure
    - Privacy and security information
    - Alternative care options
    - Emergency protocols

  documentation:
    - Patient location (originating site)
    - Provider location (distant site)
    - Consent documentation
    - Technology modality used
    - Participants in visit

  prescribing:
    - DEA registration requirements
    - Ryan Haight Act compliance
    - State-specific prescribing rules
    - Controlled substance limitations
```

### Reimbursement Framework

```yaml
reimbursement:
  medicare:
    originating_sites:
      - Rural health clinics
      - FQHCs
      - Hospital outpatient
      - Critical access hospitals
      - Physician offices (post-PHE)
      - Patient home (certain services)

    distant_site_providers:
      - Physicians
      - Nurse practitioners
      - Physician assistants
      - Clinical psychologists
      - Licensed clinical social workers

    modifiers:
      "95": "Synchronous real-time"
      "GT": "Via interactive audio/video"
      "GQ": "Asynchronous (store-forward)"

  commercial_payers:
    - Varies by payer and state
    - Check payer policies
    - Telehealth parity laws
    - Prior authorization requirements
    - Originating site flexibility

  place_of_service:
    "02": "Telehealth - patient location"
    "10": "Telehealth in patient home"
    "11": "Office (in-person comparison)"

  billing_tips:
    - Verify coverage before visit
    - Use appropriate POS codes
    - Apply correct modifiers
    - Document medical necessity
    - Track time for RPM billing
```

### Quality and Outcomes

```yaml
quality:
  clinical_metrics:
    - Condition-specific outcomes
    - Hospital readmission rates
    - ED utilization
    - Medication adherence
    - Disease control measures

  operational_metrics:
    - Visit completion rate
    - Technical failure rate
    - Wait times
    - Provider productivity
    - No-show rates

  patient_experience:
    - Satisfaction scores
    - Net Promoter Score
    - Technology ease of use
    - Wait time satisfaction
    - Willingness to use again

  access_metrics:
    - Time to appointment
    - After-hours utilization
    - Geographic reach
    - Underserved population access
    - Language access
```

### Implementation Best Practices

```yaml
implementation:
  clinical_workflow:
    - Mirror in-person as appropriate
    - Optimize for virtual medium
    - Develop backup protocols
    - Create documentation templates
    - Establish escalation paths

  patient_engagement:
    - Technology tutorials
    - Pre-visit tech checks
    - Multiple access options
    - Support resources
    - Feedback mechanisms

  provider_training:
    - Platform proficiency
    - Webside manner
    - Virtual examination techniques
    - Documentation requirements
    - Technical troubleshooting

  change_management:
    - Leadership sponsorship
    - Phased rollout
    - Champions network
    - Continuous feedback
    - Celebrate successes
```

### Specialty Telehealth Applications

```yaml
specialties:
  behavioral_health:
    - High adoption rates
    - Privacy considerations
    - Crisis protocols
    - Group therapy options
    - Medication management

  dermatology:
    - Store-and-forward primary
    - Image quality standards
    - Lighting requirements
    - Scope limitations
    - In-person follow-up triggers

  cardiology:
    - RPM integration
    - ECG transmission
    - Heart failure monitoring
    - Post-procedure follow-up
    - Cardiac rehab supervision

  pediatrics:
    - Parent involvement
    - Age-appropriate approach
    - Well-child visit components
    - Growth monitoring
    - Developmental screening limits
```

## Output Format

### Telehealth Program Plan
```markdown
# Telehealth Program Plan: [Program Name]

## Program Overview
- Objective: [Goals]
- Target Population: [Description]
- Modalities: [Synchronous/Async/RPM]
- Launch Timeline: [Date]

## Use Cases
| Use Case | Modality | Volume Est. | Priority |
|----------|----------|-------------|----------|
| [Use Case] | [Type] | [# visits/mo] | [1-5] |

## Technology Requirements
- Platform: [Selected platform]
- Integrations: [EHR, etc.]
- Devices: [RPM devices if applicable]

## Workflow Summary
### Pre-Visit
[Key steps]

### During Visit
[Key steps]

### Post-Visit
[Key steps]

## Staffing Model
| Role | FTE | Responsibilities |
|------|-----|------------------|
| [Role] | [#] | [List] |

## Compliance Requirements
- Licensure: [Requirements]
- Consent: [Process]
- Documentation: [Standards]

## Financial Projections
- Implementation Cost: [$]
- Monthly Operating Cost: [$]
- Revenue Projection: [$]
- Break-even: [Timeline]

## Success Metrics
| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| [Metric] | [Current] | [Goal] | [Date] |

## Risk Mitigation
| Risk | Mitigation Strategy |
|------|---------------------|
| [Risk] | [Strategy] |
```

## Integration Points

- Electronic Health Records (Epic, Cerner, etc.)
- Telehealth platforms (Teladoc, Amwell, Doxy.me)
- RPM device vendors
- Patient portals
- Scheduling systems
- Billing systems
- Clinical decision support

## Best Practices

1. **Patient-Centered Design**: Prioritize ease of use
2. **Clinical Appropriateness**: Define suitable use cases
3. **Technology Reliability**: Ensure robust infrastructure
4. **Training Investment**: Comprehensive provider training
5. **Workflow Integration**: Embed in existing processes
6. **Continuous Improvement**: Monitor and optimize
7. **Equity Focus**: Ensure broad access
8. **Compliance First**: Stay current with regulations

## Common Pitfalls

- Underestimating technology requirements
- Insufficient provider training
- Poor patient onboarding
- Ignoring workflow integration
- Compliance gaps (licensing, consent)
- Billing and coding errors
- Lack of backup protocols
- Not measuring outcomes

## Version History

- 1.0.0: Initial telehealth operations skill
- 1.0.1: Added RPM program section
- 1.0.2: Enhanced reimbursement guidance
