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


## References
- `references/output-format.md` — Output Format
- `references/personal-protective-equipment.md` — Personal Protective Equipment
- `references/references.md` — References
