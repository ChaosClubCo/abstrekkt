---
name: safety-management
description: Helps manage and audit safety management processes. Comprehensive guidance for safety management including OSHA compliance, workplace hazard identification, safety programs, incident investigation, emergency preparedness, personal protective equipment, and safety training. Use when navigating industry-specific regulations, processes, or operations.
---

# Safety Management Skill

> Workplace safety programs, OSHA compliance, incident management, and risk prevention

## Description

This skill provides comprehensive guidance for safety management including OSHA compliance, workplace hazard identification, safety programs, incident investigation, emergency preparedness, personal protective equipment, safety training, and safety culture development. It covers industrial safety, construction safety, and general workplace safety across various industries.

## Activation Triggers

- User mentions "safety management", "workplace safety", "occupational safety"
- User asks about OSHA compliance or safety regulations
- User needs help with safety programs or safety plans
- User discusses hazard identification or risk assessment
- User asks about incident investigation or accident reporting
- User mentions personal protective equipment (PPE)
- User needs safety training guidance
- User asks about safety audits or inspections

## Instructions

### Core Workflow

1. **Safety Planning**
   - Assess workplace hazards
   - Develop safety policies
   - Create safety programs
   - Establish procedures
   - Assign responsibilities

2. **Safety Implementation**
   - Train employees
   - Deploy protective measures
   - Monitor compliance
   - Conduct inspections
   - Manage incidents

3. **Safety Improvement**
   - Analyze safety data
   - Investigate incidents
   - Implement corrections
   - Measure effectiveness
   - Continuously improve

### Safety Management System

```yaml
safety_management_system:
  policy:
    elements:
      - Management commitment
      - Safety objectives
      - Scope and application
      - Roles and responsibilities
      - Compliance commitment

    communication:
      - Policy posting
      - Employee acknowledgment
      - Annual review
      - Updates as needed

  planning:
    hazard_identification:
      - Job hazard analysis (JHA)
      - Process hazard analysis (PHA)
      - Workplace inspections
      - Employee reports
      - Near-miss analysis

    risk_assessment:
      - Hazard severity
      - Likelihood of occurrence
      - Risk rating
      - Control prioritization

    objectives:
      - Measurable targets
      - Leading indicators
      - Lagging indicators
      - Timeline for achievement

  implementation:
    programs:
      - Training programs
      - PPE programs
      - Emergency response
      - Contractor safety
      - Change management

    documentation:
      - Written procedures
      - Safety records
      - Training records
      - Inspection records
      - Incident reports

  evaluation:
    monitoring:
      - Safety observations
      - Compliance audits
      - Metric tracking
      - Management review

    improvement:
      - Corrective actions
      - Preventive actions
      - Best practice sharing
      - Continuous improvement
```

### OSHA Compliance Framework

```yaml
osha_compliance:
  general_duty:
    clause: "Section 5(a)(1)"
    requirement: "Provide workplace free from recognized hazards"

  specific_standards:
    general_industry:
      subpart_d: "Walking-Working Surfaces"
      subpart_e: "Exit Routes and Emergency Planning"
      subpart_g: "Occupational Health"
      subpart_h: "Hazardous Materials"
      subpart_i: "Personal Protective Equipment"
      subpart_j: "General Environmental Controls"
      subpart_k: "Medical and First Aid"
      subpart_l: "Fire Protection"
      subpart_n: "Materials Handling"
      subpart_o: "Machinery and Machine Guarding"
      subpart_p: "Hand and Portable Tools"
      subpart_q: "Welding, Cutting, Brazing"
      subpart_r: "Special Industries"
      subpart_s: "Electrical"
      subpart_z: "Toxic and Hazardous Substances"

    construction:
      subpart_c: "General Safety and Health"
      subpart_d: "Occupational Health"
      subpart_e: "Personal Protective Equipment"
      subpart_f: "Fire Protection"
      subpart_g: "Signs, Signals, Barricades"
      subpart_h: "Materials Handling"
      subpart_i: "Tools"
      subpart_j: "Welding and Cutting"
      subpart_k: "Electrical"
      subpart_l: "Scaffolds"
      subpart_m: "Fall Protection"
      subpart_n: "Cranes and Derricks"
      subpart_o: "Motor Vehicles"
      subpart_p: "Excavations"
      subpart_q: "Concrete and Masonry"
      subpart_r: "Steel Erection"

  recordkeeping:
    forms:
      osha_300: "Log of Work-Related Injuries"
      osha_300a: "Summary of Injuries (posting)"
      osha_301: "Injury and Illness Incident Report"

    requirements:
      - Record within 7 days
      - Retain records 5 years
      - Post 300A February-April
      - Electronic submission (if applicable)

    recordable_criteria:
      - Death
      - Days away from work
      - Restricted work or transfer
      - Medical treatment beyond first aid
      - Loss of consciousness
      - Significant injury/illness
```

### Hazard Identification and Risk Assessment

```yaml
hazard_identification:
  methods:
    job_hazard_analysis:
      process:
        - Select job/task
        - Break into steps
        - Identify hazards per step
        - Determine controls
        - Document findings

      hazard_types:
        - Struck by/against
        - Caught in/between
        - Falls (same level/elevated)
        - Overexertion
        - Contact (electrical, thermal, chemical)
        - Exposure (noise, dust, chemicals)

    workplace_inspection:
      frequency:
        - Daily pre-shift
        - Weekly area inspections
        - Monthly comprehensive
        - Annual audit

      checklist_areas:
        - Housekeeping
        - Walking surfaces
        - Electrical
        - Fire protection
        - Machine guarding
        - Chemical storage
        - PPE compliance
        - Emergency equipment

    process_hazard_analysis:
      methods:
        - What-If analysis
        - Checklist analysis
        - HAZOP study
        - FMEA
        - Fault tree analysis

  risk_assessment:
    matrix:
      severity:
        catastrophic: "Death or multiple injuries"
        major: "Serious injury"
        moderate: "Medical treatment"
        minor: "First aid"
        negligible: "No injury"

      likelihood:
        almost_certain: "Expected to occur"
        likely: "Will probably occur"
        possible: "Could occur"
        unlikely: "Could occur but not expected"
        rare: "May occur only in exceptional circumstances"

    risk_rating:
      extreme: "Immediate action required"
      high: "Senior management attention"
      medium: "Management responsibility"
      low: "Manage by routine procedures"

  hierarchy_of_controls:
    order:
      1: "Elimination - Remove the hazard"
      2: "Substitution - Replace with safer alternative"
      3: "Engineering - Isolate people from hazard"
      4: "Administrative - Change work practices"
      5: "PPE - Protect the worker"
```

### Safety Programs

```yaml
safety_programs:
  lockout_tagout:
    scope:
      - Machinery maintenance
      - Equipment servicing
      - Energy isolation

    elements:
      - Written procedure
      - Energy survey
      - Isolation devices
      - Locks and tags
      - Periodic inspection
      - Training

    steps:
      - Notify affected employees
      - Shut down equipment
      - Isolate energy sources
      - Apply locks/tags
      - Release stored energy
      - Verify isolation
      - Perform work
      - Remove locks/tags
      - Restart equipment

  confined_space:
    evaluation:
      - Identify confined spaces
      - Classify as permit/non-permit
      - Post warning signs

    permit_required:
      - Contains hazardous atmosphere
      - Contains engulfment hazard
      - Internal configuration hazard
      - Other serious hazards

    entry_procedure:
      - Entry permit
      - Atmospheric testing
      - Ventilation
      - Attendant posted
      - Rescue provisions
      - Training requirements

  fall_protection:
    requirements:
      general_industry: "4 feet"
      construction: "6 feet"
      shipyard: "5 feet"

    systems:
      - Guardrails
      - Safety nets
      - Personal fall arrest
      - Positioning systems
      - Warning lines

    components:
      - Anchorage points
      - Body harnesses
      - Connecting devices
      - Self-retracting lifelines

  hazard_communication:
    elements:
      - Written program
      - Chemical inventory
      - Safety Data Sheets (SDS)
      - Container labeling
      - Employee training

    ghs_labels:
      - Product identifier
      - Signal word
      - Hazard statements
      - Pictograms
      - Precautionary statements
      - Supplier information

    sds_sections:
      1: "Identification"
      2: "Hazard identification"
      3: "Composition"
      4: "First-aid measures"
      5: "Fire-fighting"
      6: "Accidental release"
      7: "Handling and storage"
      8: "Exposure controls/PPE"
      9: "Physical properties"
      10: "Stability and reactivity"
      11: "Toxicological information"
      12: "Ecological information"
      13: "Disposal"
      14: "Transport"
      15: "Regulatory information"
      16: "Other information"
```

### Personal Protective Equipment

```yaml
ppe_program:
  hazard_assessment:
    process:
      - Survey workplace
      - Identify hazards
      - Select appropriate PPE
      - Document assessment
      - Certify in writing

    hazard_types:
      - Impact
      - Penetration
      - Compression
      - Chemical
      - Heat/cold
      - Harmful dust
      - Light radiation
      - Biologic
      - Noise

  ppe_types:
    head:
      - Hard hats (Type I, II)
      - Bump caps
      - Hair nets

    eye_face:
      - Safety glasses
      - Safety goggles
      - Face shields
      - Welding helmets

    hearing:
      - Earplugs
      - Earmuffs
      - Canal caps

    respiratory:
      - N95 respirators
      - Half-face respirators
      - Full-face respirators
      - PAPR
      - SCBA

    hand:
      - Cut-resistant gloves
      - Chemical gloves
      - Heat-resistant gloves
      - Electrical gloves

    foot:
      - Steel-toe boots
      - Metatarsal guards
      - Electrical hazard
      - Slip-resistant
      - Chemical resistant

    body:
      - High-visibility vests
      - Flame-resistant clothing
      - Chemical suits
      - Fall protection harnesses

  management:
    selection:
      - Match PPE to hazards
      - Consider comfort/fit
      - Ensure proper protection level
      - Verify certifications

    training:
      - When required
      - What type required
      - How to properly use
      - Limitations
      - Maintenance and care

    maintenance:
      - Inspection before use
      - Cleaning procedures
      - Storage requirements
      - Replacement criteria
```

### Incident Investigation

```yaml
incident_investigation:
  response:
    immediate:
      - Provide first aid
      - Secure the scene
      - Notify management
      - Preserve evidence
      - Initial documentation

    notification:
      - Internal reporting
      - OSHA reporting (if required)
      - Insurance notification
      - Family notification (fatality)

  investigation_process:
    team:
      - Safety professional
      - Supervisor
      - Employee representative
      - Subject matter experts

    evidence:
      - Photographs
      - Physical evidence
      - Witness statements
      - Documents and records
      - Equipment inspection

    analysis:
      root_cause_methods:
        - 5 Whys
        - Fishbone diagram
        - Fault tree analysis
        - Change analysis
        - Timeline analysis

      contributing_factors:
        - Immediate causes
        - Underlying causes
        - Root causes
        - Management system gaps

  reporting:
    documentation:
      - Incident description
      - Injury/damage details
      - Investigation findings
      - Root cause analysis
      - Corrective actions
      - Follow-up timeline

  osha_reporting:
    within_8_hours:
      - Work-related fatality
      - In-patient hospitalization

    within_24_hours:
      - Amputation
      - Loss of an eye

  corrective_actions:
    process:
      - Identify actions
      - Assign responsibility
      - Set completion dates
      - Verify implementation
      - Evaluate effectiveness
```

### Emergency Preparedness

```yaml
emergency_preparedness:
  emergency_action_plan:
    elements:
      - Emergency procedures
      - Evacuation routes
      - Assembly points
      - Reporting procedures
      - Employee responsibilities
      - Rescue and medical duties

    emergencies:
      - Fire
      - Chemical release
      - Natural disaster
      - Medical emergency
      - Active threat
      - Utility failure

  fire_prevention:
    elements:
      - Fire hazard identification
      - Handling/storage procedures
      - Potential ignition sources
      - Fire protection equipment
      - Housekeeping requirements

    equipment:
      - Fire extinguishers
      - Sprinkler systems
      - Fire alarms
      - Emergency lighting
      - Exit signs

  evacuation:
    planning:
      - Primary routes
      - Secondary routes
      - Assembly areas
      - Headcount procedures
      - Mobility assistance

    drills:
      - Frequency requirements
      - Documentation
      - Evaluation
      - Improvement actions

  first_aid:
    requirements:
      - First aid kits
      - AED devices
      - Trained responders
      - Emergency numbers
      - Medical providers

  communication:
    methods:
      - Alarm systems
      - PA announcements
      - Two-way radios
      - Emergency notification systems
      - External communications
```

### Safety Training

```yaml
safety_training:
  requirements:
    new_hire:
      - Safety orientation
      - Job-specific hazards
      - Emergency procedures
      - Reporting procedures
      - PPE requirements

    periodic:
      - Annual refresher
      - Regulatory updates
      - Incident lessons learned
      - New hazard training

    specialized:
      - Forklift operation
      - Confined space
      - Fall protection
      - Respiratory protection
      - Lockout/tagout
      - Hazardous materials

  delivery_methods:
    classroom:
      - Instructor-led
      - Interactive discussion
      - Hands-on demonstration

    online:
      - Self-paced modules
      - Video-based
      - Knowledge assessments

    on_the_job:
      - Task observation
      - Mentoring
      - Practical exercises

  documentation:
    records:
      - Training topic
      - Date completed
      - Trainer name
      - Attendee signatures
      - Test results

    retention:
      - Duration of employment
      - Specific regulatory requirements
      - Industry standards

  effectiveness:
    evaluation:
      - Knowledge tests
      - Skills demonstration
      - Behavioral observation
      - Incident correlation
```

### Safety Metrics and KPIs

```yaml
metrics:
  lagging_indicators:
    rates:
      trir: "Total Recordable Incident Rate"
      dart: "Days Away/Restricted/Transfer Rate"
      ltir: "Lost Time Incident Rate"
      fatality_rate: "Fatalities per 100 workers"

    calculation:
      trir_formula: "(Recordable incidents x 200,000) / Hours worked"
      dart_formula: "(DART cases x 200,000) / Hours worked"

    benchmarking:
      - Industry average
      - Best-in-class
      - Year-over-year trend
      - Peer comparison

  leading_indicators:
    proactive:
      - Safety observations completed
      - Hazards identified and corrected
      - Near-miss reports
      - Training completion rate
      - Inspection completion rate

    engagement:
      - Safety meeting attendance
      - Safety suggestion participation
      - Behavioral observations
      - Safety committee involvement

  analysis:
    trending:
      - Incident types
      - Body parts affected
      - Root causes
      - Contributing factors
      - Time of day/week

    cost_analysis:
      - Direct costs (medical, comp)
      - Indirect costs (productivity, training)
      - Total cost of incidents
      - Prevention ROI
```

### Safety Culture

```yaml
safety_culture:
  elements:
    leadership:
      - Visible commitment
      - Resource allocation
      - Accountability
      - Role modeling

    employee_engagement:
      - Safety committees
      - Safety observations
      - Suggestion programs
      - Recognition programs

    communication:
      - Safety meetings
      - Toolbox talks
      - Safety alerts
      - Performance sharing

    just_culture:
      - Fair treatment
      - Learning focus
      - Blame-free reporting
      - Accountability balance

  assessment:
    methods:
      - Safety perception surveys
      - Safety climate assessments
      - Focus groups
      - Behavioral observations

    indicators:
      - Reporting culture
      - Learning culture
      - Informed culture
      - Flexible culture

  improvement:
    strategies:
      - Leadership development
      - Employee empowerment
      - Recognition programs
      - Continuous communication
      - Performance feedback
```

## Output Format

### Safety Assessment Report
```markdown
# Safety Assessment Report: [Area/Department]

## Assessment Overview
- Date: [Date]
- Assessor: [Name]
- Scope: [Area/Process]

## Hazard Summary
| Hazard | Risk Rating | Current Controls | Status |
|--------|-------------|------------------|--------|
| [Hazard] | [H/M/L] | [Controls] | [Adequate/Needs Improvement] |

## Compliance Status
| Requirement | Status | Gap | Action Required |
|-------------|--------|-----|-----------------|
| [OSHA Standard] | [Compliant/Non-compliant] | [Gap] | [Action] |

## Incident Statistics
| Metric | Current | Prior Period | Trend |
|--------|---------|--------------|-------|
| TRIR | [Rate] | [Rate] | [Up/Down] |
| DART | [Rate] | [Rate] | [Up/Down] |
| Near Misses | [Count] | [Count] | [Up/Down] |

## Training Status
| Training | Required | Completed | Gap |
|----------|----------|-----------|-----|
| [Training] | [Count] | [Count] | [Count] |

## Inspection Results
| Area | Score | Critical Findings |
|------|-------|-------------------|
| [Area] | [%] | [Count] |

## Priority Actions
| Action | Risk | Owner | Due Date |
|--------|------|-------|----------|
| [Action] | [H/M/L] | [Name] | [Date] |

## Recommendations
1. [Priority recommendation]
2. [Supporting recommendation]
```

## Integration Points

- Safety management software (Intelex, VelocityEHS)
- EHS management systems
- Learning management systems
- HR information systems
- Incident management systems
- Inspection software
- Risk management platforms
- ERP systems
- Maintenance management systems

## Best Practices

1. **Leadership Commitment**: Visible safety leadership from top down
2. **Employee Involvement**: Engage employees in safety processes
3. **Proactive Focus**: Emphasize leading indicators and prevention
4. **Just Culture**: Balance accountability with learning
5. **Continuous Training**: Ongoing safety education and awareness
6. **Regular Audits**: Systematic compliance verification
7. **Incident Learning**: Thorough investigation and corrective action
8. **Data-Driven**: Use metrics to drive improvement

## Common Pitfalls

- Reactive safety approach
- Inadequate hazard identification
- Poor incident investigation
- Training without follow-up
- Paper compliance vs. actual safety
- Blame culture
- Inadequate resources
- Ignoring near-misses
- Poor communication
- Management disengagement

## Version History

- 1.0.0: Initial safety management skill
- 1.0.1: Added safety culture section
- 1.0.2: Enhanced OSHA compliance guidance
