---
name: quality-control
description: Comprehensive guidance for quality control and assurance including quality management systems, inspection procedures, statistical process control, certifications, auditing, and continuous improvement. Use when navigating industry-specific regulations, processes, or operations.
---

# Quality Control Skill

> QA processes, inspections, certifications, and quality management systems

## Description

This skill provides comprehensive guidance for quality control and assurance including quality management systems, inspection procedures, statistical process control, certifications, auditing, and continuous improvement. It covers manufacturing, service, and process quality across various industries.

## Activation Triggers

- User mentions "quality control", "QA", "quality assurance"
- User asks about ISO certification or quality standards
- User needs help with inspection procedures
- User discusses defect analysis or root cause
- User asks about SPC or statistical quality control
- User mentions quality audits or assessments
- User needs quality management system development

## Instructions

### Core Workflow

1. **Quality Planning**
   - Define quality objectives
   - Develop quality standards
   - Create inspection plans
   - Establish control points
   - Document procedures

2. **Quality Control**
   - Perform inspections
   - Collect quality data
   - Analyze results
   - Identify deviations
   - Implement corrections

3. **Quality Improvement**
   - Identify improvement opportunities
   - Analyze root causes
   - Implement corrective actions
   - Verify effectiveness
   - Standardize improvements

### Quality Management System

```yaml
qms:
  iso_9001_requirements:
    context:
      - Organization context
      - Interested parties
      - QMS scope
      - Processes

    leadership:
      - Management commitment
      - Quality policy
      - Roles and responsibilities

    planning:
      - Risk and opportunity
      - Quality objectives
      - Change planning

    support:
      - Resources
      - Competence
      - Awareness
      - Communication
      - Documented information

    operation:
      - Planning and control
      - Customer requirements
      - Design and development
      - External providers
      - Production and service

    performance:
      - Monitoring and measurement
      - Customer satisfaction
      - Analysis and evaluation
      - Internal audit
      - Management review

    improvement:
      - Nonconformity handling
      - Corrective action
      - Continual improvement
```

### Inspection Framework

```yaml
inspection:
  types:
    incoming:
      - Raw material inspection
      - Component verification
      - Supplier quality
      - Documentation review

    in_process:
      - First article inspection
      - Patrol inspection
      - Statistical sampling
      - Critical parameter monitoring

    final:
      - Product verification
      - Functional testing
      - Appearance inspection
      - Documentation review

  sampling_plans:
    aql_sampling:
      - Acceptable Quality Level
      - Sample size codes
      - Accept/reject criteria
      - Switching rules

    statistical:
      - Random sampling
      - Stratified sampling
      - Systematic sampling

  documentation:
    - Inspection reports
    - Test certificates
    - Nonconformance reports
    - Traceability records
```

### Statistical Process Control

```yaml
spc:
  control_charts:
    variable_data:
      x_bar_r:
        use: "Small subgroups (2-10)"
        monitors: "Mean and range"

      x_bar_s:
        use: "Larger subgroups (>10)"
        monitors: "Mean and standard deviation"

      i_mr:
        use: "Individual measurements"
        monitors: "Individual value and moving range"

    attribute_data:
      p_chart:
        use: "Proportion defective"
        sample_size: "Variable"

      np_chart:
        use: "Number defective"
        sample_size: "Constant"

      c_chart:
        use: "Defects per unit"
        sample_size: "Constant"

      u_chart:
        use: "Defects per unit"
        sample_size: "Variable"

  process_capability:
    indices:
      cp: "Process capability"
      cpk: "Process capability (centered)"
      pp: "Process performance"
      ppk: "Process performance (centered)"

    interpretation:
      excellent: "Cpk > 1.67"
      good: "1.33 < Cpk <= 1.67"
      acceptable: "1.0 < Cpk <= 1.33"
      inadequate: "Cpk <= 1.0"

  rules:
    western_electric:
      - "1 point beyond 3 sigma"
      - "2 of 3 points beyond 2 sigma"
      - "4 of 5 points beyond 1 sigma"
      - "8 consecutive points on one side"
```

### Defect Analysis

```yaml
defect_analysis:
  classification:
    severity:
      critical: "Safety hazard or major function failure"
      major: "Reduced performance or function"
      minor: "Cosmetic or minor deviation"

    categories:
      - Dimensional
      - Visual/cosmetic
      - Functional
      - Material
      - Documentation

  root_cause:
    methods:
      five_whys:
        - Ask "why" repeatedly
        - Dig to root cause
        - Identify systemic issues

      fishbone:
        categories:
          - Man (People)
          - Machine (Equipment)
          - Method (Process)
          - Material
          - Measurement
          - Environment

      fault_tree:
        - Top-down analysis
        - Logic gates
        - Probability calculation

  metrics:
    - Defect rate (DPMO, PPM)
    - First pass yield
    - Scrap rate
    - Rework rate
    - Cost of poor quality
```

### Corrective and Preventive Action

```yaml
capa:
  process:
    identification:
      - Nonconformance detection
      - Customer complaint
      - Audit finding
      - Trend analysis

    investigation:
      - Problem description
      - Containment actions
      - Root cause analysis
      - Impact assessment

    action:
      - Corrective action plan
      - Preventive measures
      - Implementation
      - Responsibility assignment

    verification:
      - Effectiveness check
      - Recurrence monitoring
      - Documentation
      - Closure

  documentation:
    - CAPA form/record
    - Investigation evidence
    - Action plan
    - Verification results
    - Closure approval

  tracking:
    - Open CAPA log
    - Due date monitoring
    - Escalation procedures
    - Trend analysis
```

### Quality Auditing

```yaml
auditing:
  types:
    internal:
      - First-party audit
      - Self-assessment
      - Process audits
      - System audits

    external:
      - Second-party (customer/supplier)
      - Third-party (certification body)
      - Regulatory inspections

  process:
    planning:
      - Audit schedule
      - Scope definition
      - Criteria identification
      - Resource allocation

    execution:
      - Opening meeting
      - Document review
      - Interviews
      - Observation
      - Sampling

    reporting:
      - Finding classification
      - Audit report
      - Corrective action requests
      - Closing meeting

  findings:
    major_nc: "Significant impact on QMS"
    minor_nc: "Single nonconformance"
    observation: "Potential improvement"
    opportunity: "Enhancement suggestion"
```

### Quality Certifications

```yaml
certifications:
  iso_standards:
    iso_9001: "Quality Management System"
    iso_14001: "Environmental Management"
    iso_45001: "Occupational Health & Safety"
    iso_17025: "Laboratory Testing"
    iatf_16949: "Automotive Quality"
    as9100: "Aerospace Quality"
    iso_13485: "Medical Devices"

  certification_process:
    - Gap assessment
    - System development
    - Implementation
    - Internal audit
    - Management review
    - Stage 1 audit
    - Stage 2 audit
    - Certification
    - Surveillance audits
    - Recertification

  maintenance:
    - Annual surveillance
    - Three-year recertification
    - Continuous improvement
    - Documentation updates
```

### Quality Tools

```yaml
quality_tools:
  seven_basic:
    - Check sheet
    - Pareto chart
    - Histogram
    - Scatter diagram
    - Control chart
    - Cause-effect diagram
    - Flowchart

  advanced:
    - FMEA (Failure Mode Effects Analysis)
    - QFD (Quality Function Deployment)
    - DOE (Design of Experiments)
    - MSA (Measurement System Analysis)
    - Gage R&R

  six_sigma:
    dmaic:
      - Define
      - Measure
      - Analyze
      - Improve
      - Control

    tools_by_phase:
      define: "Project charter, SIPOC, VOC"
      measure: "Data collection, MSA, Cp/Cpk"
      analyze: "Root cause, hypothesis testing"
      improve: "DOE, pilot testing"
      control: "Control charts, control plans"
```

### Supplier Quality

```yaml
supplier_quality:
  qualification:
    - Quality system assessment
    - Process capability review
    - Sample evaluation
    - Certification verification

  monitoring:
    - Incoming inspection
    - Performance metrics
    - Scorecard reviews
    - Audits

  development:
    - CAPA requirements
    - Quality improvement projects
    - Training support
    - Technology sharing

  metrics:
    - PPM (defective parts)
    - On-time delivery
    - Quality system score
    - Corrective action response
```

### Quality Metrics

```yaml
metrics:
  product:
    - Defect rate (DPMO, PPM)
    - First pass yield (FPY)
    - Rolled throughput yield (RTY)
    - Scrap rate
    - Rework rate

  process:
    - Process capability (Cpk)
    - OEE (Overall Equipment Effectiveness)
    - Cycle time

  customer:
    - Customer complaints
    - Returns/RMA rate
    - Customer satisfaction
    - Warranty claims

  cost:
    - Cost of quality (COQ)
    - Prevention costs
    - Appraisal costs
    - Internal failure costs
    - External failure costs
```

## Output Format

### Quality Assessment Report
```markdown
# Quality Assessment Report: [Area/Process]

## Assessment Overview
- Date: [Date]
- Scope: [Scope]
- Assessor: [Name]

## Current Performance
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| FPY | [%] | [%] | [G/Y/R] |
| Defect Rate | [PPM] | [PPM] | [G/Y/R] |
| Cpk | [Value] | [Min] | [G/Y/R] |

## Findings
| Finding | Severity | Root Cause | Action |
|---------|----------|------------|--------|
| [Finding] | [Major/Minor] | [Cause] | [Action] |

## Nonconformance Summary
- Critical: [Count]
- Major: [Count]
- Minor: [Count]

## Recommendations
1. [Priority recommendation]
2. [Supporting recommendation]

## Action Plan
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action] | [Name] | [Date] | [Status] |

## Attachments
- Control charts
- Inspection data
- CAPA records
```

## Integration Points

- ERP systems
- Quality management systems (QMS)
- Statistical software (Minitab, JMP)
- Document management
- Training management
- Supplier portals
- Manufacturing execution systems (MES)
- Calibration management

## Best Practices

1. **Prevention Focus**: Prevent rather than detect defects
2. **Data-Driven**: Decisions based on data and analysis
3. **Process Approach**: Manage and improve processes
4. **Continuous Improvement**: Never stop improving
5. **Customer Focus**: Quality defined by customer
6. **Training**: Develop quality competencies
7. **Documentation**: Maintain accurate records
8. **Standardization**: Standardize best practices

## Common Pitfalls

- Inspection-only mindset
- Inadequate root cause analysis
- Poor CAPA effectiveness
- Ignoring SPC signals
- Audit preparation vs. real compliance
- Inadequate training
- Documentation gaps
- Supplier quality neglect

## Version History

- 1.0.0: Initial quality control skill
- 1.0.1: Added SPC section
- 1.0.2: Enhanced audit guidance
