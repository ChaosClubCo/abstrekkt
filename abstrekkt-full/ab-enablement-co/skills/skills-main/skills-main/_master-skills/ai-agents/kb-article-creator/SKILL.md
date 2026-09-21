---
name: kb-article-creator
description: Helps configure and build kb article creator processes. Generate production-ready knowledge base articles for L1, L2, or L3 support tiers following Intinc Technology Department framework with automatic structure, metadata, checklists, RACI matrices, and quality gates. Use when creating or drafting KB articles.
---

# KB Article Creator (Tier-Specific)

## Overview

This skill generates complete, production-ready knowledge base articles following the Intinc Technology Department KB framework. It automatically applies the correct template based on support tier (L1, L2, or L3), enforces metadata requirements, includes role-appropriate sections, and generates all required compliance artifacts.

## When to Use This Skill

Trigger this skill when you see requests like:
- "Create L1 KB article for [topic]"
- "Write L2 troubleshooting guide for [issue]"
- "Generate L3 architecture document for [system]"
- "New KB article: [description]"
- "Document [procedure] for knowledge base"
- "Build KB guide for [topic]"

## Automatic Tier Detection

The skill automatically determines the appropriate tier based on:

**L1 Indicators:**
- Simple how-to tasks (password reset, account creation)
- GUI-based procedures
- Tasks requiring 5-10 minutes
- No command-line operations
- Basic troubleshooting

**L2 Indicators:**
- Complex troubleshooting scenarios
- Multi-step diagnostic procedures
- Decision trees and escalation paths
- System commands with expected outputs
- Procedures requiring 20-45 minutes

**L3 Indicators:**
- Architecture and design documentation
- Root cause analysis
- Enterprise-level system integration
- Security and compliance focus
- Vendor integration procedures
- Procedures requiring architectural review

## Article Structure by Tier

### L1 Article Structure
```markdown
[Title: How to ...]
Article ID: KB-[DEPT]-[NUM]
Version: 1.0.0
Created: [Date]
Author: INT Technology Department
Audience: L1, End-Users
Complexity: Beginner/Intermediate
Review Date: [Date + 3 months]

Executive Summary
Prerequisites
Step-by-Step Instructions (with screenshots)
Verification Section
Troubleshooting (Common Errors)
Escalation Criteria
Related Articles
Change History
```

### L2 Article Structure
```markdown
[Title: [System] - [Issue Type]: Description]
Article ID: KB-[DEPT]-[NUM]
Version: 1.0.0
Created: [Date]
Author: INT Technology Department
Audience: L2, L3
Complexity: Intermediate/Advanced
Review Date: [Date + 3 months]

Executive Summary
Root Cause Analysis
Decision Tree - Path Selection
Prerequisites
Phase 1: Diagnostic Procedures
Phase 2: Solution Path A
Phase 3: Solution Path B  
Phase N: Additional Paths
Validation, Documentation & Communication
Troubleshooting & Escalation
RACI Matrix
Related Articles
Change History
Appendix: Command Reference
```

### L3 Article Structure
```markdown
[Title: Architecture/RCA: [System] - [Focus Area]]
Article ID: KB-[DEPT]-[NUM]
Version: 1.0.0
Created: [Date]
Author: INT Technology Department
Audience: L3, L4, Management
Complexity: Advanced/Expert
Review Date: [Date + 6 months]

Executive Summary
Table of Contents
Technical Background
Architecture Overview
Implementation Procedures
Monitoring & Maintenance
Security & Compliance
Vendor Integration
Disaster Recovery
Escalation Criteria
RACI Matrix
Related Articles
Change History
Appendix A: Command Reference
Appendix B: Gaps & Blindspots
```

## Required Metadata Fields

Every article MUST include:
- **Article ID**: KB-[DEPT]-[NUM] (e.g., KB-BL-001, KB-IMG-001)
- **Version**: Semantic versioning (1.0.0)
- **Created Date**: YYYY-MM-DD format
- **Author**: INT Technology Department
- **Audience**: L1, L2, L3, L4, End-Users (select appropriate)
- **Complexity**: Beginner, Intermediate, Advanced, Expert
- **Review Date**: Created Date + 3 months (L1/L2) or 6 months (L3)

## Callout Box Formatting

Use these consistently:

**WARNING (Critical Information)**
```markdown
⚠️ WARNING: [Critical information requiring immediate attention]
```

**INFO (Helpful Context)**
```markdown
ℹ️ INFO: [Helpful context or explanation]
```

**BEST PRACTICE (Recommended Approach)**
```markdown
✅ BEST PRACTICE: [Recommended approach or guideline]
```

**CRITICAL (Must-Do Action)**
```markdown
🚫 CRITICAL: [Must-do action with severe consequences if ignored]
```

## Quality Gates & Checklists

### L1 Pre-Submission Checklist (16-Point)
- [ ] Title is action-oriented and under 65 characters
- [ ] Article searchable by common keywords
- [ ] Introduction explains problem/benefit
- [ ] Prerequisites clearly listed
- [ ] Step-by-step instructions numbered and sequential
- [ ] Each step includes where to click/what to type
- [ ] UI element names bolded (**OK**, **Cancel**)
- [ ] Used simple language (no unexplained acronyms)
- [ ] Included at least 2-3 screenshots with annotations
- [ ] Added verification step (success indicators)
- [ ] Included troubleshooting for common errors OR escalation path
- [ ] Linked 2-5 related articles
- [ ] Lists contain ≤9 items maximum
- [ ] Spell-checked and grammar-reviewed
- [ ] Tested procedures work as written
- [ ] Estimated time: 5-10 minutes to complete

### L2 Technical Review Checklist
- [ ] Diagnostics section captures all needed information
- [ ] Each troubleshooting step is necessary and in correct order
- [ ] System commands/procedures use accurate syntax
- [ ] Output examples match real-world results
- [ ] Escalation criteria are clear and appropriate
- [ ] No steps require L3 knowledge (or justified why)
- [ ] Includes rollback/undo procedures
- [ ] Performance impact identified
- [ ] Security implications addressed
- [ ] Tested on actual systems
- [ ] Decision tree covers edge cases

### L3 Architecture Review Checklist
- [ ] Architecture review board approval obtained
- [ ] Enterprise context and business impact explained
- [ ] Vendor/license-based solutions attributed
- [ ] Monitoring procedures included
- [ ] Change management procedures referenced
- [ ] Security review completed
- [ ] Compliance review completed
- [ ] Approval documentation attached

## Escalation Criteria Table

Always include an escalation criteria table:

```markdown
| Condition | Escalate To | Urgency |
|-----------|-------------|---------|
| [Issue persists after all steps] | L2 | Medium |
| [System/service down] | L2 | High |
| [Security concern] | L3 + Security Team | Critical |
| [Compliance violation] | L4 + Management | Critical |
```

## RACI Matrix Template

Generate a RACI matrix for all procedures:

```markdown
| Task | L1 | L2 | L3 | L4 | Lead |
|------|:--:|:--:|:--:|:--:|:----:|
| Task 1 | R | A | C | I | I |
| Task 2 | C | R | A | I | I |
```

**Legend**: R = Responsible | A = Accountable | C = Consulted | I = Informed

## Command Reference Appendix Format

For L2/L3 articles with commands:

```markdown
## Appendix A: Command Reference

### [Category Name]

```
# Command description
command-here --flags

# Expected output:
Output text here
```

**Explanation**: What this command does and when to use it.
```

## Change History Table

```markdown
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | YYYY-MM-DD | INT Tech | Initial publication |
```

## Gaps & Blindspots Section (L2/L3)

For L2/L3 articles, include:

```markdown
## Gaps / Blindspots / Unknown-Unknowns

- **[System/Tool] Version Variance**: [Explanation]
- **[Component] Exact Names**: [Explanation]  
- **[Dependency]**: [Explanation]
- **Network Dependency**: [Explanation]
```

## Examples

### Example 1: L1 Password Reset Request
**User Request**: "Create a KB article for password resets"

**Generated Article Structure**:
- Title: "How to Reset Your Network Password"
- Article ID: KB-PWD-001
- Audience: L1, End-Users
- Complexity: Beginner
- Sections: Prerequisites, Step-by-Step (with screenshots), Verification, Troubleshooting
- Includes: 3-4 annotated screenshots, common error solutions, escalation path
- Estimated time: 5 minutes

### Example 2: L2 VPN Troubleshooting Request
**User Request**: "Write L2 guide for intermittent VPN disconnections"

**Generated Article Structure**:
- Title: "Network - VPN Connectivity: Resolving Intermittent Disconnections"
- Article ID: KB-VPN-001
- Audience: L2, L3
- Complexity: Intermediate
- Sections: Root Cause Analysis, Decision Tree, Diagnostics, Solution Paths A/B/C, Rollback
- Includes: PowerShell commands with expected outputs, decision tree flowchart, RACI matrix
- Estimated time: 30-45 minutes

### Example 3: L3 Architecture Request
**User Request**: "Document BitLocker architecture and recovery procedures"

**Generated Article Structure**:
- Title: "Architecture: BitLocker Encryption - Enterprise Deployment & Recovery"
- Article ID: KB-BL-002
- Audience: L3, L4, Management
- Complexity: Advanced
- Sections: Technical Background, Architecture, Implementation, Monitoring, Security, Vendor, DR, RACI
- Includes: Architecture diagrams, monitoring procedures, compliance requirements, gaps/blindspots
- Requires: Architecture review board approval

## Instructions

When generating a KB article:

1. **Determine Tier**: Analyze the request to determine L1, L2, or L3
2. **Apply Template**: Use the appropriate template from resources/
3. **Generate Metadata**: Create Article ID, set review dates, assign audience
4. **Structure Content**: Follow tier-specific structure requirements
5. **Add Callouts**: Use ⚠️, ℹ️, ✅, 🚫 formatting consistently
6. **Create Checklists**: Generate appropriate quality checklist for tier
7. **Generate RACI**: Create RACI matrix with appropriate role assignments
8. **Add Escalation**: Include escalation criteria table
9. **Command Reference**: If L2/L3, add command reference appendix
10. **Gaps Section**: If L2/L3, document known gaps and blindspots
11. **Related Articles**: Link to 2-5 related KB articles
12. **Change History**: Initialize version 1.0.0 with current date

## Supporting Resources

- `resources/l1-template.md` - L1 How-To Article Template
- `resources/l2-template.md` - L2 Troubleshooting Template
- `resources/l3-template.md` - L3 Architecture Template
- `resources/quality-checklists.md` - Complete checklists for all tiers
- `resources/raci-examples.md` - RACI matrix examples
- `resources/callout-formatting.md` - Callout box formatting guide

## Key Reminders

- L1: GUI only, no CLI, ≤10 min, ≥2 screenshots, simple language
- L2: Diagnostics first, decision trees, tested commands, rollback procedures
- L3: Architecture review required, business context, monitoring, vendor approvals
- All tiers: Metadata complete, callouts formatted, RACI matrix, escalation criteria
- Word count: L1 ≤1,500 words | L2 ≤2,500 words | L3 ≤3,500 words
- Lists: Maximum 9 items per list (split if longer)
- Review dates: L1/L2 = 3 months | L3 = 6 months

## Notes

- This skill enforces Intinc Technology Department standards
- Articles are audit-ready for SOC 2 and ISO 20000 compliance
- All procedures must be tested before publication
- Screenshots are REQUIRED for L1, RECOMMENDED for L2
- Security and compliance sections are MANDATORY for all tiers
