---
name: compliance-documentation-assistant
description: Generate compliance documentation including RACI matrices, change control summaries, validation checklists, and audit-ready evidence templates for SOC 2/ISO 20000. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Compliance Documentation Assistant

## Core Workflow


This skill generates compliance artifacts required for SOC 2, ISO 20000, and internal audit requirements including RACI matrices, change control records, and validation checklists.

## When to Use This Skill

Trigger when user requests:
- "Create a RACI matrix for [process/project]"
- "Generate change control documentation"
- "Build validation checklist for [procedure]"
- "Audit documentation for [system/process]"
- "Compliance artifacts for [SOC 2/ISO 20000]"

## Compliance Artifact Types

### 1. RACI Matrix

**Purpose:** Define roles and responsibilities across teams for accountability and audit clarity.

**Format:**
```markdown
## RACI Matrix

| Task / Activity | L1 | L2 | L3 | L4 | Lead/Manager |
|-----------------|:--:|:--:|:--:|:--:|:------------:|
| [Task 1] | R | A | C | I | I |
| [Task 2] | C | R | A | I | C |
| [Task 3] | I | C | R | A | I |

**Legend:**
- **R** = Responsible (does the work)
- **A** = Accountable (owns the outcome, single point)
- **C** = Consulted (provides input)
- **I** = Informed (kept updated)

**Rules:**
- Every task must have exactly ONE 'A' (accountable)
- Every task must have at least ONE 'R' (responsible)
- 'A' and 'R' can be the same person/role
```

**Best Practices:**
- **Specific tasks:** "Execute domain join" not "Handle computers"
- **One accountable:** Never multiple 'A' per task
- **Verify completeness:** Every role should have responsibilities
- **Balance workload:** No single role should be 'R' for everything

### 2. Change Control Summary

**Purpose:** Track all changes to processes, systems, or documentation for audit trail.

**Format:**
```markdown
## Change Control Summary

| Version | Date | Author | Change Type | Description | CAB Approval |
|---------|------|--------|-------------|-------------|--------------|
| 1.0.0 | YYYY-MM-DD | [Name] | Initial | Created [document/process] | [Ticket #] |
| 1.1.0 | YYYY-MM-DD | [Name] | Minor | [Specific changes made] | [Ticket #] |
| 2.0.0 | YYYY-MM-DD | [Name] | Major | [Breaking changes] | [Ticket #] |

**Change Types:**
- **Initial:** First version created
- **Minor:** Non-breaking changes (formatting, clarifications)
- **Standard:** New procedures, tool updates, normal changes
- **Major:** Breaking changes, process redesign, significant updates
- **Emergency:** Unplanned changes (post-approval required)

**CAB Approval Required:**
- Standard changes: CAB approval before implementation
- Major changes: CAB + Security/Compliance review
- Emergency changes: Post-approval within 24 hours
- Minor changes: Manager approval (no CAB)
```

**Audit Requirements:**
- All changes must have approval ticket number
- Emergency changes must have incident ticket + post-approval
- Major changes must have impact assessment documented

### 3. Validation Checklist

**Purpose:** Ensure procedures completed correctly with verifiable evidence.

**Format:**
```markdown
## Validation Checklist

Complete before marking procedure as finished:

**Technical Validation:**
- [ ] [Check 1 - specific test with expected result]
- [ ] [Check 2 - verification command with output]
- [ ] [Check 3 - system state confirmed]

**Security Validation:**
- [ ] [Security control 1 verified - evidence required]
- [ ] [Access audit trail captured]
- [ ] [Encryption status confirmed]

**Compliance Validation:**
- [ ] [Compliance requirement 1 met - documentation attached]
- [ ] [Audit log enabled and tested]
- [ ] [Retention policy applied]

**Documentation Validation:**
- [ ] All evidence attached to ticket (screenshots, logs, confirmations)
- [ ] Service ticket updated with results
- [ ] User/stakeholder notified
- [ ] Knowledge base updated (if new procedure)

**Sign-Off:**
- Technician: [Name], [Date]
- Reviewer: [Name], [Date]
- Manager Approval: [Name], [Date]
```

**Evidence Requirements:**
Each checklist item should specify what evidence is required:
- Screenshot of configuration
- Log file excerpt
- Command output
- Email confirmation
- Approval ticket number

### 4. Escalation Criteria Table

**Purpose:** Define when and how to escalate issues for compliance with SLAs.

**Format:**
```markdown
## Escalation Criteria

| Condition | Escalate To | Urgency | Timeline | Info Required |
|-----------|-------------|---------|----------|---------------|
| [Condition 1] | L2 | Medium | <1 hour | [What to provide] |
| [Condition 2] | L3 | High | <15 min | [What to provide] |
| [Condition 3] | L4 + Vendor | Critical | <5 min | [What to provide] |

**Severity Definitions:**

| Severity | Description | Response Time | Escalation |
|----------|-------------|---------------|------------|
| P0 - Critical | Service down, all users affected | <5 minutes | Immediate page |
| P1 - High | Major degradation, >10% users | <15 minutes | L3 + manager |
| P2 - Medium | Feature broken, <5% users | <1 hour | L2 assigned |
| P3 - Low | Minor issue, workaround exists | <24 hours | Backlog |
```

### 5. Compliance Control Mapping

**Purpose:** Map procedures to compliance framework requirements.

**SOC 2 Controls:**
```markdown
## SOC 2 Control Mapping

| Control ID | Control Description | How This Procedure Addresses |
|------------|---------------------|------------------------------|
| CC6.1 | Logical access controls | [Specific steps in procedure] |
| CC7.2 | System monitoring | [Monitoring section reference] |
| CC8.1 | Change management | [Change control section] |

**Evidence for Audit:**
- Control CC6.1: [Document reference, screenshots]
- Control CC7.2: [Monitoring dashboard, alert config]
- Control CC8.1: [CAB approval tickets, change log]
```

**ISO 20000 Alignment:**
```markdown
## ISO 20000 Alignment

| ISO Section | Requirement | Implementation |
|-------------|-------------|----------------|
| 8.1 (Service Desk) | Incident logging | [Ticket system, retention policy] |
| 8.2 (Incident Management) | Escalation procedures | [Escalation criteria table] |
| 9.1 (Change Management) | Change approval process | [CAB workflow, approval gates] |
```

### 6. Audit Evidence Template

**Purpose:** Standardize evidence collection for audits.

**Format:**
```markdown
## Audit Evidence Package

**Procedure:** [Name and ID]  
**Date Executed:** [YYYY-MM-DD HH:MM]  
**Executed By:** [Technician Name, ID]  
**Reviewed By:** [Reviewer Name, ID]

**Evidence Collected:**

1. **Pre-Execution Evidence:**
   - [ ] Service ticket: [Ticket ID]
   - [ ] Change approval: [CAB Ticket ID]
   - [ ] Prerequisites verified: [Checklist screenshot]

2. **Execution Evidence:**
   - [ ] Step 1 completion: [Screenshot/log]
   - [ ] Step 2 completion: [Screenshot/log]
   - [ ] Security checkpoint: [Verification output]

3. **Post-Execution Evidence:**
   - [ ] Validation results: [Test output]
   - [ ] System state: [Configuration screenshot]
   - [ ] User confirmation: [Email/ticket update]

**Audit Trail:**
- Action timestamp: [YYYY-MM-DD HH:MM:SS]
- User performing action: [Username]
- Systems affected: [System IDs]
- Changes made: [Specific changes]
- Rollback available: [Yes/No - procedure reference]

**Retention:**
- Evidence stored: [Location - ticket system, document management]
- Retention period: [90 days / 1 year / 7 years per compliance requirement]
- Access controls: [Who can view - role/group]
```

## Generation Guidelines

### RACI Matrix Generation

**Inputs needed:**
- List of tasks/activities
- List of roles involved
- Process owner

**Process:**
1. List all tasks vertically
2. List all roles horizontally
3. For each task, ask:
   - Who does the work? → R
   - Who owns the outcome? → A (only ONE)
   - Who provides input? → C
   - Who needs updates? → I
4. Verify: Every task has exactly one A, at least one R

**Common patterns:**
- L1 typically R for execution
- L2 typically A for technical tasks
- L3 typically A for complex/architectural tasks
- L4 typically A for vendor/policy escalations
- Lead typically I or C for oversight

### Validation Checklist Generation

**Inputs needed:**
- Procedure steps
- Compliance requirements
- Evidence requirements

**Process:**
1. **Technical checks:** One per major procedure step
2. **Security checks:** For any security-sensitive operations
3. **Compliance checks:** For regulatory requirements
4. **Documentation checks:** Standard set for all procedures

**Format each item as:**
- [ ] [Specific check] - [Expected result] - [Evidence required]

Example:
- [ ] BitLocker enabled on C: drive - Status shows "Protection On" - Screenshot of `manage-bde -status` output

### Change Control Documentation

**Inputs needed:**
- What changed
- Why it changed
- Who approved
- When implemented

**Version numbering rules:**
- **X.0.0** - Major (breaking changes, redesign)
- **X.Y.0** - Minor (new content, procedures added)
- **X.Y.Z** - Patch (typos, formatting, clarifications)

## Compliance Quick Reference

### SOC 2 Common Controls

| Control | What It Means | Documentation Needed |
|---------|---------------|----------------------|
| CC6.1 | Logical access | Access logs, RACI showing approval |
| CC6.6 | Logical access removal | Deprovisioning procedures |
| CC7.2 | System monitoring | Monitoring configs, alert rules |
| CC8.1 | Change management | CAB approvals, change log |
| CC9.1 | Risk management | Risk assessments, mitigation plans |

### ISO 20000 Common Sections

| Section | Focus | Documentation |
|---------|-------|---------------|
| 8.1 | Service Desk | Ticket system, KPIs, procedures |
| 8.2 | Incident Management | Escalation, SLAs, resolution tracking |
| 8.3 | Problem Management | Root cause analysis, permanent fixes |
| 9.1 | Change Management | CAB, approval workflow, backout plans |
| 10.1 | Service Reporting | Metrics, dashboards, reviews |

## Best Practices

### For RACI Matrices

✅ **Do:**
- Keep task descriptions specific and actionable
- Limit to 10-15 tasks per matrix (split if more)
- Verify exactly ONE accountable per task
- Review with all stakeholders before finalizing

❌ **Don't:**
- Use vague task descriptions
- Have multiple accountable (A) for same task
- Leave any role completely empty (no responsibilities)
- Create matrix without stakeholder input

### For Change Control

✅ **Do:**
- Document ALL changes, even minor
- Include approval ticket/email for audit
- Use semantic versioning consistently
- Track who requested change, not just who implemented

❌ **Don't:**
- Skip documentation for "small" changes
- Implement without approval (except emergencies)
- Use inconsistent version numbering
- Forget to update "Last Updated" date

### For Validation Checklists

✅ **Do:**
- Make checks specific and measurable
- Specify what evidence is required
- Include sign-off section
- Test checklist before using in production

❌ **Don't:**
- Use vague checks ("verify it works")
- Forget evidence requirements
- Skip sign-offs
- Make checklists too long (>20 items = split)

## Supporting Resources

Refer to:
- `resources/raci-examples.md` - Sample RACI matrices for common IT processes
- `resources/change-control-templates.md` - Pre-filled templates by change type
- `resources/compliance-checklist-library.md` - Reusable validation checklists
- `resources/audit-evidence-guide.md` - What evidence auditors need

## Output Format

When generating compliance documentation:

1. **Clarify compliance framework** - SOC 2, ISO 20000, internal audit?
2. **Identify scope** - What process/system/procedure?
3. **Determine artifact type** - RACI, change control, validation, etc.
4. **Generate with proper format** - Tables, checklists, evidence templates
5. **Include audit notes** - What auditors will look for
6. **Provide retention guidance** - How long to keep

Always:
- Use standard table formats
- Include legends/definitions
- Specify evidence requirements
- Map to compliance controls
- Provide retention guidance

Never:
- Create incomplete RACI (missing A or R)
- Skip approval documentation
- Use vague validation criteria
- Forget audit trail requirements
