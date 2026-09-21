---
name: clinical-workflows
description: Comprehensive guidance for designing and optimizing clinical workflows including patient journeys, care coordination, clinical protocols, care team collaboration, and healthcare process improvement. Covers ambulatory, inpatient, emergency, and specialty care workflows. Use when designing, creating, or reviewing creative deliverables.
---

# Clinical Workflows Skill

> Patient journey optimization, care coordination, and clinical process design

## Description

This skill provides comprehensive guidance for designing and optimizing clinical workflows including patient journeys, care coordination, clinical protocols, care team collaboration, and healthcare process improvement. It covers ambulatory, inpatient, emergency, and specialty care workflows with focus on quality, safety, and efficiency.

## Activation Triggers

- User mentions "clinical workflow", "patient journey", "care coordination"
- User asks about care team processes or handoffs
- User needs help with clinical protocol design
- User discusses patient flow optimization
- User asks about clinical documentation workflows
- User mentions care pathways or care plans
- User needs appointment scheduling optimization

## Instructions

### Core Workflow

1. **Current State Assessment**
   - Map existing clinical workflows
   - Identify pain points and bottlenecks
   - Measure current performance metrics
   - Gather stakeholder input
   - Document technology touchpoints

2. **Workflow Analysis**
   - Identify value-added vs non-value-added steps
   - Analyze wait times and delays
   - Review handoff points and communication gaps
   - Assess documentation burden
   - Evaluate technology utilization

3. **Future State Design**
   - Define optimized workflow processes
   - Design care team roles and responsibilities
   - Specify technology requirements
   - Create standard operating procedures
   - Develop measurement framework

### Patient Journey Framework

```yaml
patient_journey:
  pre_visit:
    - Appointment scheduling
    - Insurance verification
    - Pre-registration
    - Pre-visit questionnaires
    - Appointment reminders
    - Pre-authorization if needed

  arrival_intake:
    - Check-in process
    - Identity verification
    - Insurance card collection
    - Copay collection
    - Consent forms
    - Waiting room management

  clinical_encounter:
    - Rooming process
    - Vital signs collection
    - Chief complaint documentation
    - Provider examination
    - Orders and referrals
    - Treatment decisions
    - Patient education

  checkout_follow_up:
    - Checkout process
    - Follow-up scheduling
    - Prescription handling
    - Referral coordination
    - After-visit summary
    - Patient portal activation

  post_visit:
    - Lab/imaging follow-up
    - Medication management
    - Care gap closure
    - Chronic care coordination
    - Patient satisfaction survey
```

### Care Coordination Models

```yaml
care_coordination:
  patient_centered_medical_home:
    - Team-based care
    - Care management
    - Care transitions
    - Population health
    - Quality improvement

  care_team_roles:
    - Primary care provider
    - Care coordinator/navigator
    - RN care manager
    - Medical assistant
    - Social worker
    - Pharmacist
    - Behavioral health specialist

  communication_protocols:
    - Huddles (daily/weekly)
    - Secure messaging
    - Care conferences
    - Handoff procedures
    - Escalation pathways
```

### Clinical Protocol Design

```yaml
protocol_design:
  components:
    - Clinical indication/trigger
    - Patient population criteria
    - Evidence-based guidelines
    - Order sets
    - Documentation templates
    - Decision support alerts
    - Outcome measures

  development_process:
    - Literature review
    - Expert committee input
    - Draft protocol creation
    - Pilot testing
    - Refinement
    - Staff training
    - Implementation
    - Monitoring and adjustment

  protocol_types:
    - Disease management protocols
    - Preventive care protocols
    - Medication protocols
    - Procedure protocols
    - Emergency protocols
```

### Inpatient Workflow Patterns

```yaml
inpatient_workflows:
  admission:
    - ED to inpatient handoff
    - Admission orders
    - Bed assignment
    - Patient transport
    - Nursing assessment
    - Initial care plan

  daily_care:
    - Shift handoffs
    - Rounding processes
    - Medication administration
    - Treatment delivery
    - Documentation
    - Family communication

  discharge:
    - Discharge planning (start at admission)
    - Medication reconciliation
    - Discharge orders
    - Patient education
    - Follow-up appointments
    - Transportation
    - Discharge summary
```

### Emergency Department Flow

```yaml
ed_workflows:
  triage:
    - Rapid medical evaluation
    - Acuity assignment (ESI)
    - Initial interventions
    - Patient tracking

  treatment:
    - Provider assignment
    - Diagnostic workup
    - Treatment protocols
    - Specialist consultation
    - Observation criteria

  disposition:
    - Admission decision
    - Discharge criteria
    - Transfer protocols
    - Against medical advice (AMA)
    - Boarding management
```

### Handoff Communication

```yaml
handoff_protocols:
  sbar_format:
    situation: "Current status/concern"
    background: "Relevant history"
    assessment: "Clinical judgment"
    recommendation: "Next steps needed"

  handoff_types:
    - Shift-to-shift
    - Unit-to-unit
    - Department-to-department
    - Provider-to-provider
    - Facility-to-facility

  documentation:
    - Verbal handoff
    - Written summary
    - Read-back verification
    - Pending items list
    - Contact information
```

### Appointment Scheduling Optimization

```yaml
scheduling:
  access_metrics:
    - Third next available
    - Appointment fill rate
    - No-show rate
    - Same-day access
    - Patient wait times

  optimization_strategies:
    - Open access scheduling
    - Template optimization
    - Overbooking protocols
    - Wait list management
    - Patient recall systems

  scheduling_rules:
    - Visit type definitions
    - Duration standards
    - Provider preferences
    - Equipment requirements
    - Room requirements
```

### Clinical Documentation Workflow

```yaml
documentation:
  ehr_workflow:
    - Pre-charting
    - In-visit documentation
    - Voice recognition
    - Scribes/ambient AI
    - Template usage
    - Smart phrases
    - Order entry

  documentation_requirements:
    - Accuracy
    - Completeness
    - Timeliness
    - Legibility
    - Compliance
    - Coding support

  efficiency_strategies:
    - Reduce duplicate entry
    - Leverage defaults
    - Batch similar tasks
    - Delegate appropriately
    - Use decision support
```

### Quality and Safety Integration

```yaml
quality_safety:
  quality_measures:
    - Process measures
    - Outcome measures
    - Patient experience
    - Access measures
    - Efficiency measures

  safety_protocols:
    - Patient identification
    - Medication safety
    - Fall prevention
    - Infection control
    - Pressure injury prevention

  event_reporting:
    - Near-miss reporting
    - Adverse event reporting
    - Root cause analysis
    - Corrective actions
```

### Workflow Metrics and KPIs

```yaml
metrics:
  access:
    - Days to third available
    - Panel size
    - Provider productivity (wRVUs)

  throughput:
    - Door-to-doctor time (ED)
    - Visit cycle time
    - Room turnover time
    - Discharge time

  quality:
    - Care gap closure rate
    - Medication adherence
    - Hospital readmission rate
    - Patient satisfaction (CAHPS)

  efficiency:
    - Documentation time
    - Orders per visit
    - Test turnaround time
```

## Output Format

### Workflow Design Document
```markdown
# Clinical Workflow: [Workflow Name]

## Purpose and Scope
[Description of workflow and applicability]

## Patient Population
[Inclusion and exclusion criteria]

## Workflow Diagram
[Visual process flow]

## Role Responsibilities
| Role | Responsibilities | Handoffs |
|------|------------------|----------|
| [Role] | [List] | [To whom] |

## Step-by-Step Process
1. [Step with timing]
2. [Step with timing]
...

## Documentation Requirements
[What to document, where, when]

## Decision Points
[Branching logic and criteria]

## Performance Metrics
[How success is measured]

## Exceptions and Escalations
[How to handle variations]
```

## Integration Points

- Electronic Health Record (EHR)
- Practice management system
- Patient portal
- Scheduling systems
- Care management platforms
- Clinical decision support
- Population health tools
- Revenue cycle management

## Best Practices

1. **Patient-Centered Design**: Always start with patient needs
2. **Stakeholder Engagement**: Include all affected parties
3. **Evidence-Based**: Ground protocols in clinical evidence
4. **Measurement**: Define metrics before implementing
5. **Iteration**: Plan for continuous improvement
6. **Training**: Thorough training on new workflows
7. **Technology Enablement**: Leverage EHR capabilities
8. **Documentation**: Keep workflow documentation current

## Common Pitfalls

- Designing without frontline input
- Ignoring technology limitations
- Underestimating change management needs
- Failing to address handoff points
- Not measuring baseline performance
- Overcomplicating workflows
- Insufficient training time
- No maintenance plan for workflows

## Version History

- 1.0.0: Initial clinical workflows skill
- 1.0.1: Added care coordination models
- 1.0.2: Enhanced scheduling optimization
