---
name: creative-review
description: Helps automate and manage creative review processes. Master creative feedback and approval processes with structured review methodologies, collaborative workflows, and efficient sign-off systems. Use when managing, optimizing, or automating operational workflows.
---

# Creative Review Skill

## Core Workflow


> Master creative feedback and approval processes with structured review methodologies, collaborative workflows, and efficient sign-off systems.

## Skill Overview

This skill provides expertise in managing creative review processes from initial concepts through final approval. It covers feedback frameworks, review workflows, stakeholder management, and quality assurance.

## Core Capabilities

### Feedback Processes
- Structured critique methods
- Constructive feedback training
- Feedback consolidation
- Conflict resolution
- Iteration management
- Documentation standards

### Approval Workflows
- Stage-gate processes
- Routing automation
- SLA management
- Exception handling
- Audit trails
- Sign-off protocols

### Quality Assurance
- Review checklists
- Technical verification
- Brand compliance checks
- Proofreading standards
- Final production checks
- Release authorization

## Feedback Framework

### Structured Feedback Model
```yaml
feedback_categories:
  strategic:
    focus: "Does it meet the brief?"
    questions:
      - Does this achieve the stated objective?
      - Is the key message clear?
      - Will the target audience respond?
      - Does it differentiate from competitors?

  creative:
    focus: "Is the idea strong?"
    questions:
      - Is the concept original and engaging?
      - Does the creative execution support the idea?
      - Is it memorable and shareable?
      - Does it have creative legs?

  brand:
    focus: "Is it on-brand?"
    questions:
      - Does it align with brand values?
      - Is the visual identity correct?
      - Does the tone of voice match?
      - Does it strengthen brand perception?

  practical:
    focus: "Can we execute it?"
    questions:
      - Is it feasible within budget?
      - Can we deliver on time?
      - Are there legal/compliance issues?
      - Does it work across all formats?
```

### Feedback Quality Standards
```yaml
effective_feedback:
  specific:
    bad: "I don't like the colors"
    good: "The blue shade feels too corporate for our youthful audience"

  actionable:
    bad: "Make it pop more"
    good: "Increase the contrast between the headline and background"

  objective:
    bad: "This isn't working"
    good: "The call-to-action is hidden below the fold on mobile"

  prioritized:
    bad: "Everything needs work"
    good: "Must fix: CTA placement. Nice to have: image treatment"

  constructive:
    bad: "This is off-brand"
    good: "Consider using our secondary palette for warmth while keeping the primary blue for the CTA"
```

### Feedback Collection Template
```markdown
# Creative Review Form

## Review Information
**Project**: [Project name]
**Asset**: [Asset description]
**Reviewer**: [Name]
**Date**: [Review date]
**Review Round**: [1/2/3]

## Overall Assessment
- [ ] Approved as-is
- [ ] Approved with minor changes
- [ ] Revisions required
- [ ] Does not meet requirements

## Strategic Review
**Does it meet the brief objectives?**
[Yes/No/Partially] - [Comments]

**Is the target audience addressed?**
[Yes/No/Partially] - [Comments]

## Creative Review
**Is the concept strong?**
[Rating 1-5] - [Comments]

**Is execution effective?**
[Rating 1-5] - [Comments]

## Brand Compliance
**Visual identity correct?** [Yes/No]
**Tone of voice aligned?** [Yes/No]
**Guidelines followed?** [Yes/No]

## Specific Feedback

### Must Change (Critical)
1. [Issue] - [Suggested solution]
2. [Issue] - [Suggested solution]

### Should Change (Important)
1. [Issue] - [Suggested solution]

### Could Change (Nice to have)
1. [Issue] - [Suggested solution]

## Approval Signature
**Approved by**: _______________
**Date**: _______________
```

## Review Workflow System

### Stage-Gate Process
```yaml
review_stages:
  gate_1_concept:
    name: "Concept Approval"
    purpose: "Validate strategic direction"
    reviewers:
      - Creative Director
      - Strategy Lead
      - Client/Stakeholder
    deliverables:
      - Concept boards
      - Key visuals
      - Messaging framework
    criteria:
      - Aligns with brief
      - Strategically sound
      - Creatively promising
    outcome: "Proceed to development or revise"

  gate_2_development:
    name: "Design Development Review"
    purpose: "Refine creative execution"
    reviewers:
      - Creative Director
      - Brand Manager
      - Technical Lead
    deliverables:
      - Design mockups
      - Copy drafts
      - Technical specifications
    criteria:
      - Concept integrity maintained
      - Execution quality
      - Technical feasibility
    outcome: "Proceed to production or iterate"

  gate_3_production:
    name: "Production Review"
    purpose: "Verify final quality"
    reviewers:
      - Producer
      - QA Lead
      - Legal (if required)
    deliverables:
      - Final files
      - All formats/sizes
      - Technical specs
    criteria:
      - Specifications met
      - Error-free
      - Ready for deployment
    outcome: "Release approved or corrections needed"

  gate_4_release:
    name: "Final Sign-off"
    purpose: "Authorize distribution"
    reviewers:
      - Project Owner
      - Approving Executive
    deliverables:
      - Complete asset package
      - Quality certification
    criteria:
      - All previous gates passed
      - Stakeholder satisfied
    outcome: "Released for use"
```

### Workflow Routing Rules
```yaml
routing_logic:
  by_asset_type:
    advertising:
      route: "Legal > Brand > Creative Director > Client"
      sla: "5 business days"

    social_media:
      route: "Brand > Social Lead"
      sla: "2 business days"

    internal_comms:
      route: "Brand > HR Lead"
      sla: "3 business days"

    product_content:
      route: "Product > Legal > Brand"
      sla: "5 business days"

  by_budget_threshold:
    under_10k:
      approver: "Marketing Manager"

    10k_to_50k:
      approver: "Marketing Director"

    over_50k:
      approver: "CMO"

  escalation_rules:
    missed_sla:
      action: "Auto-escalate to manager"
      threshold: "24 hours overdue"

    urgent_request:
      action: "Parallel routing to all reviewers"
      trigger: "Priority flag set"
```

### Review Platform Integration
```yaml
review_tools:
  frame_io:
    best_for: "Video review"
    features:
      - Timecode comments
      - Version comparison
      - Team collaboration
      - Approval workflows

  figma:
    best_for: "Design review"
    features:
      - In-context comments
      - Real-time collaboration
      - Version history
      - Developer handoff

  ziflow:
    best_for: "Marketing asset review"
    features:
      - Multi-format support
      - Automated workflows
      - Stakeholder portals
      - Audit trails

  approval_studio:
    best_for: "Enterprise workflows"
    features:
      - Complex routing
      - Digital signatures
      - Compliance tracking
      - Integration APIs
```

## Quality Assurance

### Pre-Review Checklist
```yaml
production_qa_checklist:
  technical_specifications:
    - [ ] Correct dimensions/size
    - [ ] Proper file format
    - [ ] Resolution requirements met
    - [ ] Color mode correct (RGB/CMYK)
    - [ ] Bleed and margins (print)

  content_accuracy:
    - [ ] All copy proofread
    - [ ] Dates and times verified
    - [ ] Prices and numbers confirmed
    - [ ] Names spelled correctly
    - [ ] Contact info accurate

  brand_compliance:
    - [ ] Logo version correct
    - [ ] Colors within spec
    - [ ] Typography approved
    - [ ] Photography style aligned
    - [ ] Messaging on-brand

  legal_requirements:
    - [ ] Disclaimers present
    - [ ] Copyright notices
    - [ ] Trademark symbols
    - [ ] Required disclosures
    - [ ] Accessibility compliance

  functionality:
    - [ ] Links working
    - [ ] Interactive elements tested
    - [ ] Mobile responsive (web)
    - [ ] Load time acceptable
    - [ ] Cross-browser/device tested
```

### Proofreading Standards
```yaml
proofreading_levels:
  level_1_basic:
    checks:
      - Spelling errors
      - Grammar issues
      - Punctuation
      - Capitalization
    who: "Copy editor"

  level_2_detailed:
    checks:
      - Factual accuracy
      - Consistency
      - Brand voice
      - Clarity
    who: "Senior editor"

  level_3_legal:
    checks:
      - Claims verification
      - Compliance language
      - Trademark usage
      - Disclaimer accuracy
    who: "Legal reviewer"

proofreading_marks:
  standard_symbols:
    - "sp" = spelling
    - "gr" = grammar
    - "awk" = awkward phrasing
    - "cap" = capitalization
    - "stet" = keep as is
```

## Stakeholder Management

### RACI for Reviews
```markdown
| Activity | Creator | Reviewer | Approver | Stakeholder |
|----------|---------|----------|----------|-------------|
| Create asset | R | C | I | I |
| Submit for review | R | A | I | I |
| Provide feedback | I | R | C | C |
| Consolidate feedback | R | A | C | I |
| Make revisions | R | C | I | I |
| Final approval | I | C | R | A |
| Release asset | R | I | A | I |

R = Responsible, A = Accountable, C = Consulted, I = Informed
```

### Managing Conflicting Feedback
```yaml
conflict_resolution:
  prevention:
    - Set clear decision-maker upfront
    - Define review criteria in brief
    - Limit reviewers to essential stakeholders
    - Align on priorities before review

  resolution_process:
    step_1: "Document conflicting feedback"
    step_2: "Identify underlying concerns"
    step_3: "Present options with trade-offs"
    step_4: "Escalate to decision-maker"
    step_5: "Document final decision and rationale"

  escalation_path:
    creative_conflict: "Creative Director decides"
    strategic_conflict: "Strategy Lead decides"
    brand_conflict: "Brand Manager decides"
    business_conflict: "Project Owner decides"
```

## Review Metrics

### Performance Tracking
```yaml
review_metrics:
  efficiency:
    cycle_time:
      definition: "Days from submission to approval"
      target: "Per asset type SLA"

    revision_rounds:
      definition: "Average number of review cycles"
      target: "<2 rounds"

    first_pass_rate:
      definition: "% approved on first submission"
      target: ">70%"

  quality:
    post_release_issues:
      definition: "Errors found after approval"
      target: "<2% of assets"

    stakeholder_satisfaction:
      definition: "Survey rating of review process"
      target: ">4.0/5.0"

  volume:
    reviews_completed:
      definition: "Total reviews per period"
      tracking: "Weekly/monthly"

    backlog:
      definition: "Reviews awaiting action"
      target: "<3 days queue"
```

## Integration Points

### Related Skills
- `creative-briefs` - Brief to review alignment
- `brand-compliance` - Brand check integration
- `asset-management` - Approved asset storage
- `agency-management` - External review processes

### Tool Integrations
```yaml
integrations:
  project_management:
    - Jira integration for task tracking
    - Asana workflow triggers
    - Monday.com status updates

  dam_systems:
    - Automatic asset upload on approval
    - Metadata sync
    - Version management

  communication:
    - Slack notifications
    - Email alerts
    - Teams integration
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Creative Ops | Initial skill creation |

---

*Use this skill to implement efficient creative review processes that improve quality, reduce cycle time, and enhance stakeholder collaboration.*
