---
name: brand-compliance
description: Master brand governance through systematic audits, guidelines enforcement, approval workflows, and compliance monitoring across all brand touchpoints. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Brand Compliance Skill

## Instructions


> Master brand governance through systematic audits, guidelines enforcement, approval workflows, and compliance monitoring across all brand touchpoints.

## Skill Overview

This skill provides expertise in maintaining brand consistency and compliance across all creative outputs. It covers audit methodologies, enforcement processes, training programs, and monitoring systems.

## Core Capabilities

### Brand Audits
- Touchpoint assessment
- Compliance scoring
- Gap identification
- Remediation planning
- Progress tracking
- Benchmarking

### Guidelines Enforcement
- Approval workflows
- Automated checks
- Exception handling
- Violation tracking
- Escalation procedures
- Training interventions

### Compliance Monitoring
- Real-time monitoring
- Usage analytics
- Trend identification
- Risk assessment
- Reporting dashboards
- Alert systems

## Brand Audit Framework

### Comprehensive Audit Structure
```yaml
audit_components:
  visual_identity:
    elements:
      - Logo usage
      - Color palette
      - Typography
      - Imagery style
      - Iconography
      - Layout patterns

    touchpoints:
      - Website
      - Mobile apps
      - Social media
      - Marketing materials
      - Sales collateral
      - Packaging
      - Signage
      - Advertising

  verbal_identity:
    elements:
      - Brand voice
      - Messaging hierarchy
      - Taglines
      - Naming conventions
      - Tone of voice

  brand_experience:
    elements:
      - Customer touchpoints
      - Employee materials
      - Partner communications
      - Event presence
```

### Audit Scoring Matrix
```markdown
# Brand Compliance Scorecard

## Visual Identity Assessment

| Element | Weight | Score (1-5) | Weighted Score |
|---------|--------|-------------|----------------|
| Logo usage | 20% | [Score] | [Calculated] |
| Color accuracy | 15% | [Score] | [Calculated] |
| Typography | 15% | [Score] | [Calculated] |
| Imagery | 15% | [Score] | [Calculated] |
| Layout/spacing | 10% | [Score] | [Calculated] |
| Overall consistency | 25% | [Score] | [Calculated] |

**Total Visual Score**: [Sum] / 5.0

## Scoring Criteria

### 5 - Exemplary
- Perfect adherence to guidelines
- Could be used as best practice example
- No deviations

### 4 - Compliant
- Minor variations within acceptable range
- Guidelines followed correctly
- Small improvements possible

### 3 - Acceptable
- Some noticeable deviations
- Core brand recognizable
- Improvements needed

### 2 - Non-Compliant
- Significant guideline violations
- Brand recognition affected
- Immediate attention required

### 1 - Critical
- Major violations
- Brand damage potential
- Urgent remediation needed
```

### Audit Process Template
```yaml
audit_workflow:
  phase_1_planning:
    duration: "1 week"
    activities:
      - Define audit scope
      - Identify all touchpoints
      - Gather current guidelines
      - Prepare assessment tools
      - Schedule stakeholder interviews

  phase_2_collection:
    duration: "2-3 weeks"
    activities:
      - Screenshot/document touchpoints
      - Collect asset samples
      - Interview brand owners
      - Review approval records
      - Document exceptions

  phase_3_assessment:
    duration: "1-2 weeks"
    activities:
      - Score each touchpoint
      - Identify patterns
      - Categorize violations
      - Prioritize issues
      - Benchmark against standards

  phase_4_reporting:
    duration: "1 week"
    activities:
      - Compile findings
      - Create recommendations
      - Develop remediation plan
      - Present to stakeholders
      - Agree on actions

  phase_5_followup:
    duration: "Ongoing"
    activities:
      - Track remediation
      - Verify corrections
      - Update processes
      - Schedule re-audit
```

## Compliance Standards

### Visual Compliance Checklist
```yaml
logo_compliance:
  usage_rules:
    - [ ] Correct logo version used
    - [ ] Minimum clear space maintained
    - [ ] Minimum size requirements met
    - [ ] Approved color variations only
    - [ ] No distortion or modification
    - [ ] Correct file format used

  common_violations:
    - Stretched or compressed logo
    - Insufficient clear space
    - Unapproved color combinations
    - Added effects (shadows, outlines)
    - Outdated logo versions

color_compliance:
  checks:
    - [ ] Primary colors match specifications
    - [ ] Secondary colors used appropriately
    - [ ] Color ratios followed
    - [ ] Accessibility contrast met
    - [ ] Correct color space (RGB/CMYK)

typography_compliance:
  checks:
    - [ ] Approved typefaces only
    - [ ] Correct font weights used
    - [ ] Hierarchy followed
    - [ ] Proper licensing in place
    - [ ] Web fonts correctly loaded
```

### Violation Categories
```yaml
violation_severity:
  critical:
    definition: "Brand significantly damaged or misrepresented"
    examples:
      - Unauthorized logo modifications
      - Trademark infringement
      - Offensive content association
      - Legal compliance issues
    response: "Immediate takedown and escalation"
    timeline: "Within 24 hours"

  major:
    definition: "Significant departure from guidelines"
    examples:
      - Wrong color palette
      - Incorrect typography
      - Off-brand imagery
      - Inconsistent messaging
    response: "Correction required before next use"
    timeline: "Within 1 week"

  minor:
    definition: "Small deviations from standards"
    examples:
      - Slight spacing issues
      - Minor color variations
      - Small sizing errors
    response: "Document and correct in next update"
    timeline: "Within 1 month"

  observation:
    definition: "Opportunities for improvement"
    examples:
      - Suboptimal asset selection
      - Better templates available
      - Process improvements
    response: "Training or guidance provided"
    timeline: "As capacity allows"
```

## Enforcement Workflows

### Approval Workflow Template
```yaml
creative_approval_workflow:
  submission:
    requester_provides:
      - Final creative files
      - Brief reference
      - Intended use case
      - Distribution channels
      - Timeline/launch date

  review_stages:
    stage_1_technical:
      reviewer: "Production team"
      checks:
        - File specifications correct
        - Assets properly formatted
        - Links and text accurate
      sla: "1 business day"

    stage_2_brand:
      reviewer: "Brand team"
      checks:
        - Visual identity compliance
        - Messaging alignment
        - Tone of voice
      sla: "2 business days"

    stage_3_legal:
      reviewer: "Legal team"
      triggers:
        - Claims or comparisons
        - Testimonials
        - Regulated content
        - Trademark use
      sla: "3-5 business days"

  outcomes:
    approved:
      - Add to approved assets
      - Clear for distribution
      - Log in compliance tracker

    approved_with_changes:
      - Document required changes
      - Deadline for corrections
      - Re-submit for verification

    rejected:
      - Document reasons
      - Provide guidance
      - Offer support for revision
```

### Exception Request Process
```yaml
exception_workflow:
  request:
    required_information:
      - Specific guideline to deviate from
      - Business justification
      - Proposed alternative
      - Duration of exception
      - Risk assessment

  evaluation:
    criteria:
      - Business case strength
      - Brand risk level
      - Precedent implications
      - Alternative options
      - Reversibility

  approval_levels:
    minor_exception:
      approver: "Brand Manager"
      examples: "One-time event signage"

    moderate_exception:
      approver: "Creative Director"
      examples: "Co-branding situation"

    major_exception:
      approver: "CMO/Brand Committee"
      examples: "Significant departure for key campaign"

  documentation:
    - Exception ID
    - Approval date and approver
    - Expiration date
    - Conditions of use
    - Review trigger
```

## Monitoring Systems

### Compliance Dashboard Metrics
```yaml
dashboard_components:
  compliance_score:
    display: "Overall brand compliance %"
    calculation: "Compliant assets / Total assets audited"
    target: ">95%"
    trend: "Month-over-month change"

  violations_by_type:
    display: "Breakdown of violation categories"
    view: "Pie chart with drill-down"

  violations_by_team:
    display: "Compliance by department/region"
    view: "Bar chart comparison"

  remediation_status:
    display: "Open vs resolved issues"
    view: "Kanban or funnel"

  approval_metrics:
    display: "Approval volume and turnaround"
    metrics:
      - Requests submitted
      - Average approval time
      - First-pass approval rate
      - Rejection rate
```

### Automated Monitoring Tools
```yaml
automated_checks:
  logo_detection:
    tool: "Brand monitoring software"
    capability: "Identify logo usage across web"
    alerts: "Unauthorized or modified logos"

  color_verification:
    tool: "Design software plugins"
    capability: "Check color values in files"
    alerts: "Out-of-spec colors"

  font_detection:
    tool: "Asset management integration"
    capability: "Verify font usage"
    alerts: "Unlicensed or unapproved fonts"

  social_monitoring:
    tool: "Social listening platform"
    capability: "Track brand mentions and usage"
    alerts: "Misuse or unauthorized content"
```

## Training & Education

### Brand Training Program
```yaml
training_modules:
  brand_fundamentals:
    audience: "All employees"
    duration: "30 minutes"
    topics:
      - Brand story and values
      - Visual identity basics
      - When to use brand assets
      - Where to find resources
    assessment: "Quiz with 80% pass rate"

  brand_application:
    audience: "Marketing, creative teams"
    duration: "2 hours"
    topics:
      - Detailed guidelines review
      - Common mistakes to avoid
      - Approval process
      - Tools and templates
    assessment: "Practical exercise"

  brand_ambassador:
    audience: "Brand team, agencies"
    duration: "Half day"
    topics:
      - Full guidelines mastery
      - Exception handling
      - Partner guidance
      - Audit procedures
    assessment: "Certification exam"
```

## Integration Points

### Related Skills
- `style-guides` - Guidelines development
- `asset-management` - Approved asset access
- `creative-review` - Review integration
- `template-systems` - Compliant templates

### System Integrations
```yaml
integrations:
  dam_system:
    purpose: "Asset compliance status"
    sync: "Approval status updates"

  project_management:
    purpose: "Review workflow tracking"
    sync: "Task status updates"

  analytics:
    purpose: "Compliance reporting"
    sync: "Audit data export"
```

## Success Metrics

### Compliance KPIs
```yaml
performance_metrics:
  compliance_rate:
    definition: "% of assets meeting guidelines"
    target: ">95%"
    measurement: "Quarterly audits"

  first_pass_approval:
    definition: "% approved without revision"
    target: ">80%"
    measurement: "Approval system data"

  violation_resolution:
    definition: "Average time to remediate"
    target: "<5 business days"
    measurement: "Issue tracking"

  training_completion:
    definition: "% of team trained"
    target: "100%"
    measurement: "LMS records"
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Brand Team | Initial skill creation |

---

*Use this skill to maintain brand integrity through systematic audits, clear enforcement processes, and continuous compliance monitoring.*
