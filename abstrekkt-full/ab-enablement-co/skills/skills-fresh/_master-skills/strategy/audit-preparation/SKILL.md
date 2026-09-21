---
name: audit-preparation
description: Internal audit management and external audit preparation frameworks. Use when preparing for audits, managing internal audit functions, responding to audit findings, developing audit remediation plans, or establishing audit readiness programs.
---

# Audit Preparation

> Internal audit function management, external audit preparation, findings remediation, and audit readiness frameworks for organizational assurance.

## Overview

Audit Preparation encompasses the processes and practices for managing internal audit functions and preparing for external audits. This skill covers audit planning, documentation preparation, audit response management, findings remediation, and the ongoing practices that maintain audit readiness throughout the year.

Effective audit preparation transforms audits from disruptive events into opportunities for operational improvement. Organizations that excel at audit management maintain strong control environments, respond efficiently to auditor requests, and use audit findings as catalysts for meaningful enhancements to processes and controls.

### Why This Matters

Audit failures can result in qualified opinions, regulatory sanctions, investor concerns, and operational disruptions. Organizations with mature audit management capabilities experience smoother audits, fewer findings, faster remediation, and better relationships with auditors and regulators. Beyond compliance value, strong audit practices drive operational excellence and control effectiveness.

## When to Use

### Primary Triggers

- Annual audit planning cycle
- External audit commencement
- Regulatory examination notification
- Internal audit engagement
- Audit finding remediation
- Control deficiency identification
- New regulatory audit requirement

### Specific Use Cases

1. **Audit Planning**: Developing internal audit plans and preparing for external audits
2. **Documentation Preparation**: Gathering evidence and preparing audit support
3. **Audit Response**: Managing auditor requests and interactions
4. **Findings Management**: Tracking and remediating audit findings
5. **Control Testing**: Supporting audit testing activities
6. **Continuous Readiness**: Maintaining year-round audit preparedness

## Core Processes

### 1. Internal Audit Management

**Internal Audit Function Framework**
```yaml
internal_audit_function:
  governance:
    reporting:
      functional: "Audit Committee of the Board"
      administrative: "CFO or CEO"
    charter:
      - "Purpose and authority"
      - "Independence and objectivity"
      - "Scope of work"
      - "Responsibilities"
      - "Standards followed"

    independence:
      requirements:
        - "Direct Audit Committee reporting"
        - "Unrestricted access to records/personnel"
        - "No operational responsibilities"
        - "Objective risk assessment"

  audit_planning:
    risk_based_planning:
      process:
        - "Assess organizational risks"
        - "Consider prior audit results"
        - "Evaluate control changes"
        - "Incorporate stakeholder input"
        - "Allocate audit resources"

      risk_factors:
        - "Financial materiality"
        - "Operational complexity"
        - "Regulatory requirements"
        - "Change volume"
        - "Time since last audit"
        - "Prior findings"

    annual_audit_plan:
      components:
        - "Audit universe inventory"
        - "Risk assessment results"
        - "Planned engagements"
        - "Resource requirements"
        - "Timeline and schedule"

      approval: "Audit Committee approval required"
      flexibility: "Plan may be adjusted for emerging risks"

  audit_execution:
    engagement_phases:
      planning:
        - "Define scope and objectives"
        - "Understand process/controls"
        - "Develop audit program"
        - "Identify key risks"

      fieldwork:
        - "Test control design"
        - "Test control effectiveness"
        - "Gather evidence"
        - "Identify issues"

      reporting:
        - "Draft findings"
        - "Discuss with management"
        - "Finalize report"
        - "Obtain management responses"

      follow_up:
        - "Track remediation"
        - "Validate completion"
        - "Report status"
```

**Internal Audit Report Template**
```markdown
## Internal Audit Report

### Engagement Information
- **Audit Title**: [Title]
- **Audit Period**: [Date range]
- **Report Date**: [Date]
- **Auditor**: [Name(s)]

### Executive Summary
**Overall Assessment**: [Satisfactory / Needs Improvement / Unsatisfactory]

**Summary**: [2-3 paragraph overview of scope, approach, and key conclusions]

### Scope and Objectives
**Scope**: [What was covered]
**Objectives**: [What the audit aimed to achieve]
**Approach**: [Methodology used]

### Findings Summary
| # | Finding | Risk | Rating | Status |
|---|---------|------|--------|--------|
| 1 | [Title] | [Risk area] | High/Med/Low | Open |
| 2 | [Title] | [Risk area] | High/Med/Low | Open |

### Detailed Findings

#### Finding 1: [Title]
**Risk Rating**: [High/Medium/Low]
**Condition**: [What we found]
**Criteria**: [What should be]
**Cause**: [Why the gap exists]
**Effect**: [Impact of the gap]
**Recommendation**: [What should be done]

**Management Response**:
[Management's response including action plan, owner, and target date]

[Repeat for each finding]

### Observations and Best Practices
[Positive observations and suggested improvements not rising to finding level]

### Appendix
- [Supporting details]
- [Testing results]
```

### 2. External Audit Preparation

**External Audit Preparation Framework**
```yaml
external_audit_prep:
  audit_types:
    financial_statement_audit:
      purpose: "Opinion on financial statements"
      auditor: "Independent CPA firm"
      standards: "GAAS, PCAOB (public companies)"
      timing: "Annual, interim reviews"

    sox_audit:
      purpose: "Opinion on internal controls (public companies)"
      auditor: "Independent CPA firm"
      standards: "PCAOB AS 2201"
      scope: "Material financial reporting controls"

    regulatory_audit:
      purpose: "Compliance with regulations"
      auditor: "Regulatory agency"
      varies_by: "Industry and jurisdiction"

    specialized_audits:
      examples:
        - "SOC 1/SOC 2 (service organizations)"
        - "ISO certifications"
        - "Industry-specific audits"

  preparation_timeline:
    ongoing:
      - "Maintain documentation"
      - "Execute controls"
      - "Track remediation"
      - "Monitor control health"

    4_months_prior:
      - "Review prior year findings"
      - "Assess control changes"
      - "Identify risk areas"
      - "Begin documentation updates"

    2_months_prior:
      - "Complete control documentation"
      - "Conduct readiness testing"
      - "Address identified gaps"
      - "Prepare PBC list items"

    1_month_prior:
      - "Finalize documentation"
      - "Pre-audit meetings"
      - "Confirm logistics"
      - "Brief control owners"

    during_audit:
      - "Respond to requests promptly"
      - "Facilitate access"
      - "Escalate issues"
      - "Track request status"
```

**PBC (Prepared by Client) Management**
```markdown
## PBC List Management

### PBC Request Tracking

**PBC Summary**
| # | Description | Owner | Due Date | Status | Notes |
|---|-------------|-------|----------|--------|-------|
| 1 | [Item] | [Name] | [Date] | [Status] | [Notes] |
| 2 | [Item] | [Name] | [Date] | [Status] | [Notes] |

### PBC Status Definitions
- **Not Started**: Not yet begun
- **In Progress**: Being prepared
- **Under Review**: Internal review before submission
- **Submitted**: Provided to auditors
- **Accepted**: Auditors have accepted
- **Revision Required**: Auditors request changes

### PBC Preparation Guidelines

**Quality Standards**
- Complete: All requested items included
- Accurate: Information verified and correct
- Organized: Logical structure, clear labels
- Timely: Submitted by due date
- Tied: Agrees to supporting records

**Common PBC Items**
| Category | Typical Items |
|----------|---------------|
| Financial | Trial balance, reconciliations, journal entries |
| Legal | Contracts, litigation summary, minutes |
| Operations | Inventory counts, confirmations |
| Compliance | Regulatory filings, permits |
| HR | Payroll records, benefit calculations |

### PBC Review Checklist
- [ ] Requested information complete
- [ ] Amounts agree to records
- [ ] Format meets auditor requirements
- [ ] Sensitive information appropriately handled
- [ ] Internal review completed
- [ ] Submitted on time
```

### 3. SOX Compliance (Public Companies)

**SOX Compliance Framework**
```yaml
sox_compliance:
  framework_components:
    entity_level_controls:
      coso_components:
        - "Control environment"
        - "Risk assessment"
        - "Control activities"
        - "Information and communication"
        - "Monitoring"

      typical_controls:
        - "Code of conduct"
        - "Audit committee oversight"
        - "Risk management process"
        - "Internal audit function"
        - "Whistleblower program"

    process_level_controls:
      significant_accounts:
        - "Revenue"
        - "Inventory"
        - "Accounts receivable"
        - "Accounts payable"
        - "Fixed assets"
        - "Payroll"
        - "Treasury"

      control_types:
        preventive: "Stop errors before they occur"
        detective: "Identify errors after they occur"
        manual: "Performed by people"
        automated: "Performed by systems"

    it_general_controls:
      categories:
        - "Access to programs and data"
        - "Program changes"
        - "Program development"
        - "Computer operations"

  documentation_requirements:
    risk_control_matrix:
      elements:
        - "Process/subprocess"
        - "Risk/what could go wrong"
        - "Control activity"
        - "Control owner"
        - "Control frequency"
        - "Control type (preventive/detective)"
        - "Key/non-key classification"
        - "Testing results"

    control_narratives:
      - "Process description"
      - "Key systems"
      - "Roles and responsibilities"
      - "Control activities"
      - "Reports used"

    flowcharts:
      - "Process flow visualization"
      - "Control points indicated"
      - "System interactions"
```

**Control Testing**
```markdown
## Control Testing Framework

### Test of Design (TOD)
**Objective**: Verify control is designed to prevent/detect risk

**Procedures**
1. Review control documentation
2. Interview control performer
3. Inspect evidence of control
4. Evaluate design against risk

**Documentation**
- Control description
- Testing performed
- Design conclusion

### Test of Effectiveness (TOE)
**Objective**: Verify control operated effectively

**Testing Approaches**
| Control Frequency | Sample Size Guidance |
|------------------|---------------------|
| Annual | 1 |
| Quarterly | 2 |
| Monthly | 2-5 |
| Weekly | 5-15 |
| Daily | 20-40 |
| Multiple/day | 25-60 |

**Testing Methods**
- Inquiry: Ask control performer
- Observation: Watch control performed
- Inspection: Examine evidence
- Re-performance: Execute control independently

**Documentation**
- Control tested
- Testing period
- Sample selected
- Testing performed
- Results and exceptions
- Conclusion

### Exception Handling
| Severity | Criteria | Response |
|----------|----------|----------|
| Deficiency | Control gap exists | Document, consider impact |
| Significant Deficiency | Reasonable possibility of material misstatement | Escalate, remediate |
| Material Weakness | Reasonable possibility not prevented/detected timely | Immediate escalation, disclosure |
```

### 4. Findings Remediation

**Findings Management Framework**
```yaml
findings_management:
  finding_classification:
    severity_levels:
      high:
        criteria:
          - "Material financial impact"
          - "Regulatory violation"
          - "Significant control failure"
        response: "Immediate remediation required"

      medium:
        criteria:
          - "Moderate risk"
          - "Policy non-compliance"
          - "Control weakness"
        response: "Remediation within 90 days"

      low:
        criteria:
          - "Minor risk"
          - "Process improvement opportunity"
        response: "Remediation within 180 days"

  remediation_process:
    steps:
      1_acknowledge:
        - "Accept or dispute finding"
        - "Assign owner"
        - "Set target date"

      2_root_cause:
        - "Analyze why it occurred"
        - "Identify contributing factors"
        - "Determine systemic issues"

      3_action_plan:
        - "Define corrective actions"
        - "Assign responsibilities"
        - "Establish milestones"
        - "Allocate resources"

      4_implement:
        - "Execute action plan"
        - "Document changes"
        - "Train affected staff"
        - "Update procedures"

      5_validate:
        - "Test remediation effectiveness"
        - "Confirm control operating"
        - "Document evidence"

      6_close:
        - "Audit/compliance sign-off"
        - "Update tracking system"
        - "Report status"
```

**Findings Tracker Template**
```markdown
## Audit Findings Tracker

### Summary Dashboard
| Status | High | Medium | Low | Total |
|--------|------|--------|-----|-------|
| Open | X | X | X | X |
| In Progress | X | X | X | X |
| Awaiting Validation | X | X | X | X |
| Closed | X | X | X | X |

### Finding Detail

**Finding ID**: [ID]
**Source**: [Audit/Exam name]
**Date Identified**: [Date]
**Severity**: [High/Medium/Low]

**Finding Description**:
[What was identified]

**Root Cause**:
[Why it occurred]

**Owner**: [Name]
**Target Date**: [Date]

**Action Plan**:
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | [Action] | [Name] | [Date] | [Status] |
| 2 | [Action] | [Name] | [Date] | [Status] |

**Status Updates**:
| Date | Update |
|------|--------|
| [Date] | [Progress note] |

**Validation**:
- Validated by: [Name]
- Validation date: [Date]
- Evidence: [Reference]
```

### 5. Continuous Audit Readiness

**Audit Readiness Program**
```markdown
## Continuous Audit Readiness

### Monthly Activities
- [ ] Review control execution evidence
- [ ] Address any control failures
- [ ] Update documentation for changes
- [ ] Track remediation progress
- [ ] Reconcile key accounts

### Quarterly Activities
- [ ] Self-assess key controls
- [ ] Review new/changed processes
- [ ] Update risk assessments
- [ ] Brief leadership on status
- [ ] Prepare for interim procedures

### Annual Activities
- [ ] Comprehensive control inventory review
- [ ] Documentation refresh
- [ ] Control owner training
- [ ] Lessons learned from prior audits
- [ ] Audit plan input

### Control Health Monitoring

**Control Execution Tracking**
| Control | Owner | Frequency | Last Executed | Evidence | Status |
|---------|-------|-----------|---------------|----------|--------|
| [Control] | [Name] | Monthly | [Date] | [Location] | Current |

**Issue Tracking**
| Issue | Severity | Identified | Owner | Status |
|-------|----------|------------|-------|--------|
| [Issue] | H/M/L | [Date] | [Name] | [Status] |

### Documentation Management
- Central repository for audit evidence
- Version control for policies/procedures
- Retention per requirements
- Access controls appropriate
```

## Tools & Templates

### Audit Calendar Template
```yaml
audit_calendar:
  annual_schedule:
    q1:
      external_audit:
        - "Year-end fieldwork"
        - "Financial statement completion"
        - "Opinion issuance"
      internal_audit:
        - "Annual plan finalization"
        - "Q1 engagements"

    q2:
      external_audit:
        - "Q1 review (if applicable)"
        - "Interim planning"
      internal_audit:
        - "Q2 engagements"
        - "Follow-up testing"

    q3:
      external_audit:
        - "Q2 review (if applicable)"
        - "Interim testing"
      internal_audit:
        - "Q3 engagements"
        - "Risk assessment update"

    q4:
      external_audit:
        - "Q3 review (if applicable)"
        - "Year-end planning"
        - "Control testing"
      internal_audit:
        - "Q4 engagements"
        - "Annual plan development"
```

### Audit Request Response Template
```markdown
## Audit Request Response

**Request ID**: [ID]
**Requestor**: [Auditor name]
**Date Received**: [Date]
**Due Date**: [Date]

**Request Description**:
[What was requested]

**Assigned To**: [Name]
**Department**: [Department]

**Response**:
- [ ] Information gathered
- [ ] Accuracy verified
- [ ] Internal review completed
- [ ] Submitted to auditor
- [ ] Auditor acceptance confirmed

**Documentation Provided**:
| # | Document | Description | Date Provided |
|---|----------|-------------|---------------|
| 1 | [Doc name] | [Description] | [Date] |

**Notes**:
[Any clarifications or issues]
```

## Metrics & KPIs

### Audit Management Metrics
```yaml
audit_metrics:
  timeliness:
    pbc_on_time: "% PBC items submitted by due date"
    request_response: "Average response time to requests"
    remediation_on_time: "% findings remediated by target"

  quality:
    findings_trend: "Number of findings year-over-year"
    repeat_findings: "% of findings that recur"
    material_weaknesses: "Number of material weaknesses"
    restatements: "Financial statement restatements"

  efficiency:
    audit_fees: "External audit fee trend"
    audit_hours: "Hours required for audit support"
    adjustments: "Number of audit adjustments"

  coverage:
    control_testing: "% controls tested annually"
    audit_universe: "% of audit universe covered"
```

## Common Pitfalls

### Audit Preparation Pitfalls

**1. Last-Minute Scramble**
- Problem: Documentation prepared only when audit starts
- Solution: Continuous readiness program
- Practice: Execute and document controls throughout year

**2. Inadequate Evidence**
- Problem: Cannot demonstrate controls operated
- Solution: Clear evidence standards, retention
- Requirement: Contemporaneous documentation

**3. Scope Surprise**
- Problem: Auditors examine unexpected areas
- Solution: Pre-audit communication, risk anticipation
- Practice: Discuss scope before fieldwork

**4. Finding Disputes**
- Problem: Contentious discussions over findings
- Solution: Early issue identification, collaborative resolution
- Approach: Address issues before final report

**5. Remediation Failure**
- Problem: Prior findings recur
- Solution: Root cause analysis, sustainable fixes
- Tracking: Validate remediation effectiveness

## Integration Points

### Connected Skills
- **risk-assessment**: Control risk identification
- **corporate-governance**: Audit committee reporting
- **policy-development**: Control documentation
- **regulatory-strategy**: Regulatory examination management
- **ethics-compliance**: Compliance audit support

### Stakeholder Alignment
- Audit Committee: Oversight, findings review
- Executive Leadership: Remediation resources
- Finance: Financial statement audit support
- IT: IT audit and SOX support
- Operations: Process audit support
- External Auditors: Collaborative relationship
