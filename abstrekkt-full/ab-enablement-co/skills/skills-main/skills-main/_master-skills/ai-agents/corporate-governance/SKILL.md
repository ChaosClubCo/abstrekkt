---
name: corporate-governance
description: Board structure design, committee frameworks, and governance policy development. Use when establishing governance structures, designing board committees, developing governance policies, preparing for board meetings, or ensuring compliance with governance requirements.
---

# Corporate Governance

> Board structure design, committee frameworks, governance policy development, and best practices for effective corporate oversight and stakeholder accountability.

## Overview

Corporate Governance encompasses the systems, principles, and processes by which organizations are directed and controlled. This skill covers board structure and composition, committee design and mandates, governance policies and procedures, director responsibilities, and the frameworks that ensure proper oversight, accountability, and alignment with stakeholder interests.

Effective corporate governance provides the foundation for sustainable organizational success by establishing clear accountability, enabling informed decision-making, and maintaining stakeholder trust. Beyond compliance requirements, strong governance practices contribute to better strategic decisions, improved risk management, and enhanced organizational reputation.

### Why This Matters

Governance failures have been at the root of many high-profile corporate collapses and scandals. Organizations with robust governance frameworks demonstrate better long-term performance, attract higher-quality leadership, maintain stakeholder confidence, and often benefit from lower costs of capital. In an era of increased scrutiny from investors, regulators, and the public, governance excellence is a strategic imperative.

## When to Use

### Primary Triggers

- Board structure review or refresh
- Committee charter development or updates
- Governance policy creation or revision
- Annual governance assessment
- Regulatory compliance requirements
- IPO or significant transaction preparation
- Governance-related shareholder concerns

### Specific Use Cases

1. **Board Structuring**: Designing optimal board composition and structure
2. **Committee Formation**: Establishing and chartering board committees
3. **Policy Development**: Creating governance policies and procedures
4. **Director Onboarding**: Orienting new board members
5. **Governance Assessment**: Evaluating governance effectiveness
6. **Proxy Preparation**: Preparing governance disclosures for shareholders

## Core Processes

### 1. Board Structure Design

**Board Composition Framework**
```yaml
board_composition:
  size_considerations:
    optimal_range: "7-12 directors for most companies"
    factors:
      - "Company size and complexity"
      - "Committee requirements"
      - "Diversity of expertise needed"
      - "Governance best practices"
      - "Regulatory requirements"

    too_small: "<5 may limit expertise and independence"
    too_large: ">15 may impede effective discussion"

  independence_requirements:
    public_companies:
      majority_independent: "Required by exchanges"
      key_committees: "Audit, Comp, Nom/Gov must be independent"
      definition: "No material relationship with company"

    private_companies:
      guidance: "Increasing emphasis on independence"
      investor_expectations: "PE/VC often require independent directors"

  skills_matrix:
    categories:
      industry_expertise:
        - "Core industry experience"
        - "Adjacent industry knowledge"
        - "Regulatory environment"

      functional_expertise:
        - "CEO/COO experience"
        - "CFO/Finance"
        - "Technology/Digital"
        - "Marketing/Sales"
        - "HR/Talent"
        - "Legal/Regulatory"

      strategic_capabilities:
        - "M&A experience"
        - "International operations"
        - "Turnaround/Transformation"
        - "Capital markets"
        - "Governance expertise"

      diversity_dimensions:
        - "Gender"
        - "Ethnicity"
        - "Age/Generational"
        - "Geographic"
        - "Background"
```

**Board Structure Template**
```markdown
## Board Structure Analysis

### Current Board Composition
**Size**: [X] Directors
**Independence**: [Y] Independent ([Z]%)

### Director Roster
| Director | Role | Independent | Tenure | Age | Committees |
|----------|------|-------------|--------|-----|------------|
| [Name] | Chair | Yes/No | X yrs | XX | [List] |
| [Name] | Director | Yes/No | X yrs | XX | [List] |

### Skills Matrix Assessment
| Skill Area | Director A | Director B | Director C | Coverage |
|------------|-----------|-----------|-----------|----------|
| Industry | X | | X | Adequate |
| Finance | X | X | | Strong |
| Technology | | X | | Gap |
| International | | | X | Limited |

### Diversity Profile
- Gender: [X]% Female, [Y]% Male
- Ethnicity: [Distribution]
- Average Age: [X] years
- Average Tenure: [Y] years

### Identified Gaps
1. [Gap area]: [Recommended action]
2. [Gap area]: [Recommended action]

### Succession Considerations
- Directors approaching retirement: [List]
- Planned transitions: [Timeline]
```

### 2. Committee Structure and Charters

**Committee Framework**
```yaml
board_committees:
  audit_committee:
    purpose: "Oversee financial reporting, internal controls, audit"
    membership:
      composition: "All independent directors"
      size: "Minimum 3 members"
      qualifications: "Financial literacy required, financial expert required"

    key_responsibilities:
      - "Oversee financial reporting process"
      - "Review financial statements"
      - "Oversee internal controls"
      - "Appoint and oversee external auditor"
      - "Review audit findings"
      - "Oversee internal audit function"
      - "Monitor compliance programs"
      - "Review risk management"

    meeting_frequency: "Minimum quarterly, often more"

  compensation_committee:
    purpose: "Oversee executive compensation and HR policies"
    membership:
      composition: "All independent directors"
      size: "Minimum 3 members"
      qualifications: "Compensation expertise helpful"

    key_responsibilities:
      - "Set CEO compensation"
      - "Approve executive compensation programs"
      - "Oversee equity-based plans"
      - "Review compensation philosophy"
      - "Assess compensation risk"
      - "Prepare compensation disclosure"
      - "Review succession planning"

    meeting_frequency: "Minimum quarterly"

  nominating_governance_committee:
    purpose: "Oversee board composition and governance practices"
    membership:
      composition: "All independent directors"
      size: "Minimum 3 members"

    key_responsibilities:
      - "Identify and recruit directors"
      - "Recommend director nominations"
      - "Oversee board evaluation process"
      - "Review governance guidelines"
      - "Monitor governance trends"
      - "Oversee director orientation"
      - "Review committee structures"

    meeting_frequency: "Minimum annually, often quarterly"

  additional_committees:
    risk_committee:
      purpose: "Oversee enterprise risk management"
      common_in: "Financial services, complex enterprises"

    technology_committee:
      purpose: "Oversee technology strategy and cybersecurity"
      common_in: "Technology companies, digital transformation"

    sustainability_committee:
      purpose: "Oversee ESG matters"
      trend: "Increasingly common"

    executive_committee:
      purpose: "Act on time-sensitive matters between meetings"
      caution: "Should not replace full board deliberation"
```

**Committee Charter Template**
```markdown
## [Committee Name] Charter

### Purpose
[Statement of committee's primary purpose and role]

### Authority
The Committee has authority to:
- [Specific authority 1]
- [Specific authority 2]
- [Access to information, management, external advisors]
- [Budget authority for external resources]

### Composition
**Membership**: [Number] members
**Qualifications**:
- All members must be [independence requirement]
- [Specific expertise requirements]
**Appointment**: Members appointed by [Board/Chair]
**Term**: [Term length]
**Chair**: [Selection process]

### Responsibilities
1. **[Category 1]**
   - [Responsibility a]
   - [Responsibility b]

2. **[Category 2]**
   - [Responsibility a]
   - [Responsibility b]

### Meetings
**Frequency**: [Minimum meetings per year]
**Quorum**: [Quorum requirement]
**Minutes**: [Record-keeping requirement]
**Executive Sessions**: [Requirement for sessions without management]
**Attendance**: [Management, guests, advisors]

### Reporting
- Report to Board after each meeting
- [Specific reporting requirements]

### Evaluation
- Annual self-assessment of committee effectiveness
- Review and update of charter

### Resources
- Authority to retain independent advisors
- Access to company resources
- [Budget authority]

**Adopted**: [Date]
**Last Reviewed**: [Date]
```

### 3. Governance Policies

**Core Governance Documents**
```yaml
governance_documents:
  corporate_governance_guidelines:
    purpose: "Framework for board operations and responsibilities"
    key_elements:
      - "Board role and responsibilities"
      - "Board composition and independence"
      - "Director qualifications"
      - "Board leadership structure"
      - "Meeting procedures"
      - "Executive sessions"
      - "Board access to management"
      - "Director compensation"
      - "Stock ownership guidelines"
      - "Board evaluation process"
      - "Continuing education"
      - "Retirement/term limits"

  code_of_conduct:
    purpose: "Ethical standards for directors, officers, employees"
    key_elements:
      - "Ethical principles"
      - "Compliance with laws"
      - "Conflicts of interest"
      - "Confidentiality"
      - "Fair dealing"
      - "Protection of assets"
      - "Reporting violations"
      - "Non-retaliation"

  conflict_of_interest_policy:
    purpose: "Identify, disclose, and manage conflicts"
    key_elements:
      - "Definition of conflicts"
      - "Disclosure requirements"
      - "Review and approval process"
      - "Related party transactions"
      - "Recusal procedures"

  insider_trading_policy:
    purpose: "Prevent illegal trading on material non-public information"
    key_elements:
      - "Definition of material non-public information"
      - "Trading restrictions"
      - "Blackout periods"
      - "Pre-clearance requirements"
      - "Reporting obligations"

  whistleblower_policy:
    purpose: "Enable reporting of concerns without retaliation"
    key_elements:
      - "Reporting channels"
      - "Anonymous reporting"
      - "Investigation process"
      - "Non-retaliation protection"
      - "Audit committee oversight"
```

**Board Meeting Management**
```markdown
## Board Meeting Framework

### Meeting Planning

**Annual Calendar**
- Establish meeting dates for full year
- Align with reporting cycles and key decisions
- Include committee meetings
- Plan executive sessions

**Agenda Development**
| Timing | Activity |
|--------|----------|
| 3-4 weeks prior | Draft agenda circulated |
| 2-3 weeks prior | Material requests to management |
| 1 week prior | Board package distributed |
| 2 days prior | Supplemental materials |

**Board Package Contents**
- Agenda with time allocations
- Minutes from prior meeting
- CEO report
- Financial performance review
- Strategic updates
- Committee reports
- Consent items
- Discussion items with background

### Meeting Conduct

**Typical Agenda Structure**
1. Call to order and quorum
2. Approval of prior minutes
3. Committee reports
4. CEO report
5. Financial review
6. Strategic discussion items
7. Consent agenda
8. Executive session
9. Adjournment

**Executive Sessions**
- Independent directors only
- No management present
- Regular agenda item
- Key for candid discussion

### Meeting Follow-up

**Post-Meeting Activities**
- Draft minutes within 1 week
- Action item tracking
- Follow-up information requests
- Committee meeting scheduling
```

### 4. Director Responsibilities

**Director Duties Framework**
```yaml
director_duties:
  fiduciary_duties:
    duty_of_care:
      definition: "Act with care a reasonably prudent person would use"
      requirements:
        - "Attend and prepare for meetings"
        - "Ask questions and seek information"
        - "Exercise independent judgment"
        - "Monitor performance and risk"
        - "Stay informed about the business"

    duty_of_loyalty:
      definition: "Act in best interests of corporation and shareholders"
      requirements:
        - "Avoid conflicts of interest"
        - "Disclose potential conflicts"
        - "Not use position for personal gain"
        - "Maintain confidentiality"
        - "Put company interests first"

    duty_of_good_faith:
      definition: "Act honestly and in good faith"
      requirements:
        - "Act with honest purpose"
        - "Not knowingly violate law"
        - "Not consciously disregard duties"

  business_judgment_rule:
    definition: "Court deference to board decisions if properly made"
    requirements:
      - "Decision made on informed basis"
      - "Good faith belief in best interests"
      - "No self-interest or conflict"
      - "Rational business purpose"

    protection: "Directors not liable for honest mistakes in judgment"

  key_responsibilities:
    strategy:
      - "Approve strategic direction"
      - "Review and approve major transactions"
      - "Oversee strategy execution"

    risk_oversight:
      - "Understand key risks"
      - "Ensure risk management processes"
      - "Monitor risk mitigation"

    talent:
      - "Select and evaluate CEO"
      - "Approve executive compensation"
      - "Ensure succession planning"

    compliance:
      - "Ensure legal compliance"
      - "Oversee ethical culture"
      - "Monitor internal controls"
```

### 5. Governance Assessment

**Board Evaluation Framework**
```markdown


## References
- `references/board-effectiveness-evaluation.md` — Board Effectiveness Evaluation
