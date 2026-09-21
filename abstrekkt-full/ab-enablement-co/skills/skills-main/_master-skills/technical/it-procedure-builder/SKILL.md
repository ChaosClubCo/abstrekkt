---
name: it-procedure-builder
description: Create comprehensive, audit-ready IT procedures with detailed micro-steps, security mandates, and compliance documentation following SOC 2/ISO 20000 standards. Use when building SOPs, deployment guides, or technical procedures.
---

# IT Procedure Builder (SOC 2 Ready)

## Overview

This skill generates comprehensive, audit-ready IT procedures with explicit micro-steps, security checkpoints, compliance mandates, and complete documentation following Intinc's "refactored with detailed procedures" approach. Every procedure is production-ready and SOC 2/ISO 20000 compliant.

## When to Use This Skill

Trigger when you see:
- "Create SOP for [IT procedure]"
- "Document [process] with micro-steps"
- "Build procedure guide for [task]"
- "Generate deployment checklist for [system]"
- "Write IT operations procedure for [topic]"
- "Create audit-ready documentation for [process]"

## Core Principles

**NO ASSUMED KNOWLEDGE**: Every step must be explicit - assume the reader has never done this before.

**MICRO-STEP METHODOLOGY**:
- Main steps numbered (1, 2, 3...)
- Substeps lettered (a, b, c...)
- Sub-substeps with roman numerals (i, ii, iii...)
- Every action explicit: "Click OK" not "Proceed"
- Expected outputs documented
- Verification at each phase

## Standard Procedure Structure

```markdown
[Procedure Title]

Version: X.X.X
Created: [Date]
Author: INT Technology Department
Status: Active
Review Date: [Date + 3-6 months]
Classification: INTERNAL USE ONLY

## Executive Summary
[2-3 paragraphs: what, why, scope, audience]

## Table of Contents
[Auto-generated from headings]

## Prerequisites

### Hardware Requirements
- [ ] Item 1 with specifications
- [ ] Item 2 with availability check

### Network Requirements
- [ ] Connectivity requirement
- [ ] Port/VLAN specifications

### Credentials Required
- [ ] Account type and permission level
- [ ] Password location (secure vault)

### Tools & Software
- [ ] Required applications with versions

## Decision Tree - Path Selection
[ASCII decision tree showing when to use this procedure vs. alternatives]

## Phase 1: [Initial Setup]

### 1.1. [Substep Title]

**Step 1: [Action]**
- Detailed description of what to do
- Exact location: [path/menu/button]
- What you should see: [expected state]

**Step 2: [Next Action]**
```
command-here --flags
```

**Expected Output:**
```
Output text that should appear
```

If you see different output, [troubleshooting note].

**Step 3: [Verification]**
- [ ] Checkpoint 1 verified
- [ ] Checkpoint 2 verified
- [ ] Screenshot captured for evidence

## Phase 2: [Configuration]
[Continue with numbered phases...]

## Validation, Documentation & Communication

### Validation Checklist
- [ ] Task 1 completed
- [ ] Task 2 verified
- [ ] Evidence captured
- [ ] Ticket updated

### Ticket Documentation Template
```
[Procedure Name] Completed
Device/System: [Name]
Completion Time: [Duration]
Tasks Completed: [List]
Evidence: [Attached items]
Result: [Success/Partial/Failed]
```

### Communication Examples
**Success Message**: "[System] is ready. [Instructions for user]."
**Escalation Message**: "@[Team] - [Issue] on [System]. [Steps taken]. Requesting assistance."

## Troubleshooting & Escalation

### Common Issues Quick Reference

| Issue | Cause | Fix |
|-------|-------|-----|
| [Problem 1] | [Root cause] | [Solution with steps] |
| [Problem 2] | [Root cause] | [Solution with steps] |

### Escalation Path
- Hardware/BIOS issue → L2
- Network/VLAN issue → L2
- Domain/AD issue → L2/L3
- Security/Compliance → L3/L4

### What to Include When Escalating
- Device serial and model
- Exact error message (screenshot)
- Steps already attempted
- Configuration verified (BIOS, network)
- Logs or diagnostic output
- Service ticket number

## Security & Compliance Mandates

### Security Checkpoints
- [ ] Credentials never shared with end user
- [ ] All admin sessions signed out
- [ ] Firewall rules configured
- [ ] Encryption enabled (BitLocker/FileVault)
- [ ] Recovery keys escrowed

### Compliance Requirements
- [ ] Audit trail complete (ticket evidence)
- [ ] Change control documented
- [ ] Security policies enforced
- [ ] Access control validated
- [ ] Configuration baseline verified

### Audit Documentation
```
Procedure: [Name]
Date/Time: [Timestamp]
Technician: [Name]
Authorization: [Ticket/Manager approval]
Actions: [Step-by-step log]
Evidence: [Screenshots, outputs, confirmations]
Result: [Success/Failure with details]
```

## RACI Matrix

| Task | L1 | L2 | L3 | L4 | Lead |
|------|:--:|:--:|:--:|:--:|:----:|
| Prerequisites verification | R | A | C | I | I |
| Procedure execution | R | A | I | I | I |
| Troubleshooting | C | R | A | I | I |
| Security configuration | R | A | C | C | I |
| Compliance validation | R | A | C | C | C |
| Escalation | R | A | C | C | I |
| Documentation | R | A | I | I | C |

## Change Control Summary

| Version | Date | Author | Change Type | Description | CAB Approval |
|---------|------|--------|-------------|-------------|--------------|
| 1.0 | [Date] | INT Tech | Initial | Initial publication | Required |

## Appendix A: Command Reference

### [Category: System Information]

```bash
# Check system info
systeminfo

# Expected output:
Host Name: COMPUTERNAME
OS Name: Microsoft Windows 11...
```

### [Category: Network Diagnostics]

```bash
# Verify connectivity
ping 8.8.8.8

# Expected output:
Reply from 8.8.8.8: bytes=32 time<1ms
```

## Appendix B: Gaps & Blindspots

**What we don't know:**
- [Unknown 1 with explanation]
- [Unknown 2 with explanation]

**What may be stale:**
- [Assumption 1 that could change]
- [Configuration that may differ]

**What needs verification:**
- [Item requiring environment-specific check]
- [Dependency to confirm]
```

## Instructions

When generating an IT procedure:

1. **Analyze scope**: Determine complexity and phases required
2. **Create decision tree**: Map when to use this vs. alternatives
3. **Document prerequisites**: Complete checklist with verification
4. **Phase-based structure**: Break into logical phases (setup, config, validation)
5. **Micro-steps**: Every action explicit with expected outputs
6. **Security gates**: Insert security checkpoints at critical phases
7. **Verification**: Add validation step after each major phase
8. **Troubleshooting**: Common issues table + escalation paths
9. **Compliance**: RACI matrix, change control, audit documentation
10. **Appendices**: Commands reference, gaps/blindspots

## Formatting Standards

**Callout Boxes:**
- ⚠️ WARNING: Critical information, severe consequences
- ℹ️ INFO: Helpful context or explanation
- ✅ BEST PRACTICE: Recommended approach
- 🚫 CRITICAL: Must-do action, no exceptions

**Commands:**
- Always show command first
- Show expected output below command
- Explain what command does
- Note any variations by OS/environment

**Verification:**
- Use checkboxes for each item
- Specify exact success criteria
- Document evidence requirements

## Examples

**Input**: "Create SOP for computer imaging"

**Output**: Complete procedure with:
- Prerequisites: Hardware ready, network config, credentials
- Phase 1: BIOS Configuration (micro-steps for AHCI setting)
- Phase 2: Network Preparation (VLAN selection, adapter config)
- Phase 3: PXE Boot (exact boot sequence, task selection)
- Phase 4: Domain Join (GUI + PowerShell methods)
- Phase 5: Software Baseline (driver updates, BitLocker)
- Phase 6: VLAN Migration (physical cable move, verification)
- Troubleshooting: Common errors with Cause → Fix → Retry
- Appendices: Full command reference with outputs
- Estimated time: 45-75 minutes
- RACI matrix for L1-L4 responsibilities
- Change control and approval tracking

## Key Reminders

- NO assumed knowledge - every step explicit
- Expected outputs required for all commands
- Security checkpoints mandatory
- Verification after each phase
- Evidence documentation required
- Gaps & blindspots section for complex procedures
- RACI matrix shows who does what
- Change control tracks versions and approvals
