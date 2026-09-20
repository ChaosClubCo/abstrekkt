---
name: aviation-safety
description: Expert guidance for aviation safety management systems, SMS implementation, regulatory compliance with FAA and ICAO standards, incident investigation, and flight operations risk management. Use when navigating industry-specific regulations, processes, or operations.
---

# Aviation Safety Skill

> Aviation safety management, SMS implementation, regulatory compliance, and incident investigation

## Description

This skill provides comprehensive guidance for aviation safety management including Safety Management System (SMS) design and implementation per ICAO and FAA requirements, regulatory compliance across flight operations and maintenance, incident and accident investigation methodologies, risk assessment frameworks, and safety culture development. It covers commercial airlines, general aviation, maintenance repair organizations (MROs), airport operations, and air traffic services. The skill supports aviation safety managers, directors of safety, quality assurance managers, and regulatory compliance officers in building and maintaining robust safety programs that meet or exceed international standards.

## Activation Triggers

- User mentions "aviation safety", "flight safety", or "airline safety management"
- User asks about SMS (Safety Management System) implementation or compliance
- User needs help with FAA regulations, ICAO standards, or aviation compliance
- User discusses aircraft incident investigation or accident analysis
- User asks about aviation risk assessment, hazard identification, or safety reporting
- User mentions ASAP, FOQA, or voluntary safety reporting programs
- User needs guidance on aviation maintenance safety or airworthiness
- User asks about crew resource management (CRM) or human factors
- User discusses airport safety, ramp operations, or ground handling safety
- User mentions aviation audit programs, IOSA, or IS-BAO standards

## Instructions

### Core Workflow

1. **Safety Policy and Objectives**
   - Establish organizational safety policy endorsed by accountable executive
   - Define safety objectives and performance targets
   - Allocate resources for safety management activities
   - Appoint safety manager and define organizational responsibilities
   - Communicate safety commitment across all operational levels

2. **Safety Risk Management**
   - Identify hazards through reactive, proactive, and predictive methods
   - Analyze risks using severity and likelihood assessment matrices
   - Evaluate risk acceptability against organizational risk tolerance
   - Implement risk controls following hierarchy of effectiveness
   - Document risk assessments and track residual risk levels

3. **Safety Assurance**
   - Monitor safety performance indicators and targets
   - Conduct internal audits and safety evaluations
   - Manage change through formal safety assessment processes
   - Investigate safety events and implement corrective actions
   - Perform continuous improvement of the safety management system

4. **Safety Promotion**
   - Deliver targeted safety training and education programs
   - Maintain safety communication channels and publications
   - Foster a just culture that encourages voluntary reporting
   - Share lessons learned from investigations and industry events
   - Recognize and reinforce positive safety behaviors

5. **Regulatory Compliance Management**
   - Maintain current knowledge of FAA, EASA, and ICAO requirements
   - Conduct gap analyses against applicable regulations and standards
   - Manage regulatory interactions, audits, and corrective actions
   - Track and implement regulatory changes within compliance timelines
   - Maintain certificates, approvals, and operations specifications

### SMS Framework (ICAO Annex 19)

```yaml
safety_management_system:
  component_1_safety_policy:
    management_commitment:
      - Accountable executive identified and empowered
      - Safety policy signed, published, and communicated
      - Safety objectives defined and resourced
      - Safety accountabilities assigned at all levels
    safety_roles:
      accountable_executive: "Ultimate accountability for SMS"
      safety_manager: "Day-to-day SMS management"
      safety_committee: "Strategic safety oversight"
      safety_action_group: "Operational safety analysis"
    reporting_systems:
      mandatory: "Accidents, serious incidents, regulatory occurrences, airworthiness concerns"
      voluntary: "ASAP, hazard reports, near-miss events, safety suggestions"
      confidential: "Non-punitive pathway with identity protection"

  component_2_safety_risk_management:
    hazard_identification:
      reactive: "Incident reports, audit findings, employee reports, complaints"
      proactive: "Safety surveys, FOQA/FDM analysis, hazard assessments, industry data"
      predictive: "Trend analysis, statistical modeling, risk profiling"

    risk_assessment:
      severity_scale:
        catastrophic: "Equipment destroyed, multiple fatalities"
        hazardous: "Major damage, serious injuries"
        major: "Significant damage, reduced safety margins"
        minor: "Minor damage, slight reduction in margins"
        negligible: "Few consequences"
      probability_scale:
        frequent: "Likely to occur many times"
        occasional: "Likely to occur sometimes"
        remote: "Unlikely but possible"
        improbable: "Very unlikely to occur"
        extremely_improbable: "Almost inconceivable"
      risk_tolerance:
        intolerable: "Stop operations until risk reduced"
        tolerable: "Operate with management approval and mitigation"
        acceptable: "Operate under normal procedures"

    risk_controls:
      engineering: "Physical barriers, system redundancy, design changes"
      administrative: "Procedures, checklists, training requirements"
      monitoring: "PPE, surveillance, inspections, data monitoring"

  component_3_safety_assurance:
    performance_monitoring:
      safety_performance_indicators:
        - Accident and serious incident rate
        - Reportable occurrence rate
        - Safety report submission rate
        - Audit finding closure rate
        - Overdue corrective actions
        - FOQA exceedance rates
      safety_performance_targets:
        - Zero fatal accidents
        - Year-over-year reduction in serious incidents
        - Reporting rate increase targets
        - Audit finding closure within 90 days
    change_management:
      triggers: "New aircraft/routes, organizational changes, new technology, regulatory changes"
      assessment_process:
        - Identify change scope and conduct hazard identification
        - Assess risks and implement controls before execution
        - Monitor post-change safety performance

    investigation:
      methodology:
        - Preserve evidence (FDR, CVR, ADS-B, witness statements)
        - Analyze organizational and human factors
        - Determine causal and contributing factors
        - Develop safety recommendations
      models:
        reason_model: "Organizational accidents, latent conditions, active failures"
        shell_model: "Software, Hardware, Environment, Liveware interactions"
        hfacs: "Human Factors Analysis and Classification System"

  component_4_safety_promotion:
    training:
      initial:
        - SMS awareness for all employees
        - Safety reporting procedures
        - Hazard identification basics
        - Emergency response roles
      role_specific:
        - Safety manager SMS management course
        - Investigator training (ICAO or equivalent)
        - Risk assessment methodology
        - Human factors and CRM
      recurrent:
        - Annual safety refresher
        - Lessons learned from recent events
        - Regulatory update briefings
        - Emergency drill participation
    communication:
      channels:
        - Safety newsletters and bulletins
        - Safety committee meeting minutes
        - Safety notice boards and digital displays
        - Safety stand-down events
        - Cross-functional safety forums
```

### Human Factors and CRM Framework

```yaml
human_factors:
  dirty_dozen:
    - Lack of communication
    - Complacency
    - Lack of knowledge
    - Distraction
    - Lack of teamwork
    - Fatigue
    - Lack of resources
    - Pressure
    - Lack of assertiveness
    - Stress
    - Lack of awareness
    - Norms (deviation from standards)

  crew_resource_management:
    core_skills:
      communication: "Clear, assertive, and closed-loop"
      situational_awareness: "Perceive, comprehend, project"
      decision_making: "FORDEC, DODAR, or similar frameworks"
      workload_management: "Prioritize, delegate, monitor"
      leadership: "Authority, assertiveness, followership balance"
    threat_error_management:
      countermeasures:
        - Standard operating procedures
        - Briefings and callouts
        - Cross-checking and monitoring
        - Checklist discipline

  fatigue_risk_management:
    regulatory_limits:
      faa_part_117:
        flight_duty_period: "9-14 hours depending on start time and segments"
        flight_time: "8-9 hours per FDP"
        rest_period: "10 hours minimum (8 hours uninterrupted sleep opportunity)"
        cumulative_limits: "60 hours in 168 consecutive hours"
```

### Templates

#### Aviation Safety Investigation Report
```markdown
# Safety Investigation Report

## Event Summary
- Event ID: [ID Number]
- Date/Time (UTC): [Date/Time]
- Location: [Airport/Coordinates]
- Aircraft: [Type/Registration]
- Operation: [Part 121/135/91]
- Classification: [Accident/Serious Incident/Incident]

## Factual Information
- Flight Phase: [Takeoff/Cruise/Approach/Landing/Ground]
- Weather Conditions: [METAR data]
- Crew Experience: [PIC hours, SIC hours]
- Aircraft Status: [Airworthy/Deferred items]

## Sequence of Events
1. [Chronological event description with timestamps]
2. [Subsequent events]
3. [Final outcome]

## Analysis
### Causal Factors
| Factor | Category | Evidence |
|--------|----------|----------|
| [Factor] | [Human/Technical/Environmental/Organizational] | [Supporting data] |

### Contributing Factors
| Factor | Category | Evidence |
|--------|----------|----------|
| [Factor] | [Category] | [Supporting data] |

### HFACS Classification
- Unsafe Acts: [Errors/Violations identified]
- Preconditions: [Conditions identified]
- Unsafe Supervision: [Factors identified]
- Organizational Influences: [Factors identified]

## Safety Recommendations
| # | Recommendation | Priority | Owner | Due Date |
|---|---------------|----------|-------|----------|
| 1 | [Recommendation] | [Urgent/High/Medium] | [Dept] | [Date] |

## Corrective Actions Taken
| Action | Date Implemented | Verified By |
|--------|-----------------|-------------|
| [Action] | [Date] | [Name] |
```

#### SMS Gap Analysis Checklist
```markdown
# SMS Gap Analysis: [Organization Name]

## Regulatory Basis: [FAA AC 120-92B / ICAO Annex 19 / IS-BAO]

## SMS Components Assessment
| Component | Element | Required | Current State | Gap | Priority |
|-----------|---------|----------|---------------|-----|----------|
| Policy | Safety policy statement | [Y] | [Status] | [Gap] | [H/M/L] |
| Policy | Accountable executive | [Y] | [Status] | [Gap] | [H/M/L] |
| Policy | Safety reporting system | [Y] | [Status] | [Gap] | [H/M/L] |
| SRM | Hazard identification | [Y] | [Status] | [Gap] | [H/M/L] |
| SRM | Risk assessment methodology | [Y] | [Status] | [Gap] | [H/M/L] |
| SA | Performance monitoring | [Y] | [Status] | [Gap] | [H/M/L] |
| SA | Change management | [Y] | [Status] | [Gap] | [H/M/L] |
| SP | Training program | [Y] | [Status] | [Gap] | [H/M/L] |
| SP | Communication plan | [Y] | [Status] | [Gap] | [H/M/L] |

## Implementation Roadmap
| Phase | Activities | Timeline | Resources |
|-------|-----------|----------|-----------|
| Phase 1 | [Priority gaps] | [Months] | [Est. effort] |
| Phase 2 | [Secondary gaps] | [Months] | [Est. effort] |
```

### Best Practices

- Treat every safety report as a gift; a healthy reporting culture is the strongest predictor of safety performance
- Implement a just culture framework that distinguishes honest errors from willful violations
- Use flight data monitoring (FOQA/FDM) to identify systemic trends before they become incidents
- Conduct formal safety risk assessments for all operational changes, not just major ones
- Integrate human factors analysis into every investigation, not just crew-related events
- Maintain independence of the safety function from operational production pressure
- Calibrate risk assessment matrices across the organization to ensure consistent severity/probability ratings
- Close audit and investigation corrective actions within 90 days; track overdue items at the executive level
- Participate in industry safety data sharing programs (ASIAS, CAST, Flight Safety Foundation)
- Conduct SMS effectiveness reviews annually to ensure the system drives real safety improvement
- Brief crews on high-risk operations and environmental threats during seasonal weather transitions
- Ensure fatigue risk management goes beyond regulatory compliance to address actual fatigue science
- Maintain emergency response plans with regular tabletop and full-scale exercises
- Track both leading indicators (reports, audits, training) and lagging indicators (events, injuries)

### Common Patterns

#### Pattern: Safety Event Response and Investigation
```
1. Activate emergency response plan if applicable
2. Preserve evidence (FDR, CVR, maintenance records, ADS-B data)
3. Notify regulatory authorities within required timeframes (NTSB, FAA)
4. Assign investigation team with appropriate subject matter expertise
5. Gather factual data from all sources (physical, documentary, testimonial)
6. Apply HFACS or equivalent framework to classify contributing factors
7. Identify root causes and develop safety recommendations
8. Implement corrective actions and track to verified closure
9. Share lessons learned organization-wide through safety promotion channels
```

#### Pattern: Safety Risk Management for Operational Change
```
1. Define the proposed change and its operational scope
2. Assemble cross-functional team (operations, safety, maintenance, training)
3. Identify hazards introduced or affected by the change
4. Assess risk severity and likelihood for each hazard
5. Determine risk acceptability against organizational criteria
6. Develop and implement risk mitigations before change execution
7. Define safety performance indicators to monitor post-implementation
8. Conduct post-change safety review at 30/60/90 day intervals
```

### Output Formats

#### Aviation Safety Performance Dashboard
```markdown
# Aviation Safety Dashboard: [Operator/Organization]

## Period: [Quarter/Year]

## Safety Event Summary
| Category | Current Period | Prior Period | YTD | Trend |
|----------|--------------|-------------|-----|-------|
| Accidents | [Count] | [Count] | [Count] | [Up/Down] |
| Serious Incidents | [Count] | [Count] | [Count] | [Up/Down] |
| Incidents | [Count] | [Count] | [Count] | [Up/Down] |
| Ground Events | [Count] | [Count] | [Count] | [Up/Down] |

## Safety Performance Indicators
| SPI | Target | Actual | Status |
|-----|--------|--------|--------|
| Safety Report Rate (per 1000 flights) | [Target] | [Actual] | [G/Y/R] |
| FOQA Exceedance Rate | [Target] | [Actual] | [G/Y/R] |
| Audit Finding Closure (within 90 days) | >= 90% | [%] | [G/Y/R] |
| Overdue Corrective Actions | 0 | [Count] | [G/Y/R] |
| SMS Training Completion | 100% | [%] | [G/Y/R] |

## Top Safety Risks
| Risk | Rating | Trend | Mitigation Status |
|------|--------|-------|-------------------|
| [Risk description] | [Intolerable/Tolerable/Acceptable] | [Up/Down/Stable] | [Active/Monitoring] |

## Open Investigations
| Event | Date | Phase | Expected Completion |
|-------|------|-------|-------------------|
| [Event] | [Date] | [Factual/Analysis/Report] | [Date] |
```

#### Regulatory Compliance Status Report
```markdown
# Regulatory Compliance Status: [Certificate Holder]

## Certificate Information
- Certificate Type: [Part 121/135/145/91K]
- Certificate Number: [Number]
- CHDO/FSDO: [Office]
- Last FAA Inspection: [Date]

## Compliance Status by Area
| Regulatory Area | Status | Last Audit | Findings Open | Next Due |
|----------------|--------|------------|---------------|----------|
| Flight Operations | [Compliant/Finding] | [Date] | [Count] | [Date] |
| Maintenance | [Compliant/Finding] | [Date] | [Count] | [Date] |
| Training | [Compliant/Finding] | [Date] | [Count] | [Date] |
| SMS | [Compliant/Finding] | [Date] | [Count] | [Date] |
| Security | [Compliant/Finding] | [Date] | [Count] | [Date] |

## Open Regulatory Findings
| Finding | Source | Due Date | Owner | Status |
|---------|--------|----------|-------|--------|
| [Finding] | [FAA/Internal] | [Date] | [Name] | [Open/In Progress] |
```

## Version History

- 1.0.0: Initial aviation safety skill
