---
name: reference-guide-generator
description: Generate INT Technology Department reference guides following official template with proper formatting, callout boxes, heading hierarchy, and appendices. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Reference Guide Generator (INT Template)

## Core Workflow


This skill generates professional reference guides following the INT Technology Department template standard (INT-ReferenceGuideTemplate-2026.docx).

## When to Use This Skill

Trigger when user requests:
- "Create a reference guide for [topic]"
- "Generate an INT reference guide for [system/process]"
- "Format this as an INT reference guide"
- "Reference documentation following INT template"

## INT Reference Guide Structure

### Document Header

```markdown
**[Title]**

*Created by INT [Department Name] Team | [Month YYYY]*

[Insert 1 paragraph describing what is covered in this reference guide. Include purpose, scope, and intended audience.]

*Included in this document are important warnings (⚠️ icon), information callouts (ℹ️ icon) and recommended best practices (✅ icon).*

**Important Links**

[Insert relevant links here - documentation, tools, vendor sites]

**Contact Us!** You can reach the INT [Department Name] Support Team by emailing [support email].
```

### Table of Contents

Generate automatically from headings. In Microsoft Word:
- References > Table of Contents
- Update after document complete

Format:
```markdown
**Table of Contents**

1. Section Title
   1.1. Subsection Title
   1.2. Subsection Title
2. Section Title
   ...
```

### Heading Hierarchy

**Level 1 (Main Sections):**
```markdown
# 1. Section Title
```

**Level 2 (Subsections):**
```markdown
## 1.1. Subsection Title
```

**Level 3 (Sub-subsections):**
```markdown
### 1.1.1. Sub-subsection Title
```

**Maximum depth:** 3 levels (1.1.1.)

**Numbering:** All sections numbered sequentially

### Callout Boxes

INT reference guides use three types of callout boxes:

**Warning Box (⚠️):**
```markdown
⚠️ **WARNING:** [Critical information requiring attention]
```

Use for:
- Security risks
- Data loss warnings
- Critical prerequisites
- Actions that cannot be undone

**Information Box (ℹ️):**
```markdown
ℹ️ **INFO:** [Helpful context and explanations]
```

Use for:
- Background information
- Clarifications
- Tips and hints
- Related concepts

**Best Practice Box (✅):**
```markdown
✅ **BEST PRACTICE:** [Recommended approaches]
```

Use for:
- Recommended methods
- Industry standards
- Optimization tips
- Quality improvements

### Lists

**Numbered Lists:**
```markdown
1. First item
2. Second item
   a. Sub-item a
   b. Sub-item b
      i. Sub-sub-item i
3. Third item
```

**Bullet Lists:**
```markdown
- First bullet
- Second bullet
  - Nested bullet
    - Deeper nested bullet
- Third bullet
```

**Limit:** Keep lists under 9 items for readability

### Tables

**Standard Table Format:**

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1, Cell 1 | Row 1, Cell 2 | Row 1, Cell 3 |
| Row 2, Cell 1 | Row 2, Cell 2 | Row 2, Cell 3 |
```

**Table Guidelines:**
- Max 5 columns for readability
- Header row bold
- Consistent alignment (left for text, right for numbers)
- Use tables for comparisons, specifications, configurations

### Images & Graphics

**Requirements:**
- Centered on page
- Shadow applied for depth (Word: Picture Format > Shadow > Outer > First option)
- Alt text for accessibility
- File sizes reasonable for document portability

**Placement:**
```markdown
![Alt text description](filename.png)
```

### Code Blocks

**Single-line commands:**
```markdown
`command-here --parameter`
```

**Multi-line scripts:**
````markdown
```powershell
# Purpose: What this script does
Command-Name -Parameter Value

# Expected output
Expected result here
```
````

## Content Organization

### Executive Summary Pattern

Each reference guide should start with a clear summary section:

```markdown
# 1. Introduction

This reference guide covers [topic] for [audience]. It provides [what value it delivers].

**Scope:**
- [What's included]
- [What's included]

**Out of Scope:**
- [What's not covered - refer to [other doc]]

**Prerequisites:**
- [Requirement 1]
- [Requirement 2]
```

### Body Sections

Organize content logically:

**For Process Guides:**
1. Introduction
2. Prerequisites
3. Phase 1: [Name]
4. Phase 2: [Name]
5. Validation
6. Troubleshooting
7. Appendices

**For System Documentation:**
1. Introduction
2. Architecture Overview
3. Component Details
4. Configuration
5. Monitoring
6. Maintenance
7. Appendices

**For User Guides:**
1. Introduction
2. Getting Started
3. Core Features
4. Advanced Features
5. Troubleshooting
6. FAQs
7. Appendices

### Appendix Structure

Every reference guide should include appendices:

```markdown
# Appendices

## Appendix A: [Title]

[Content - e.g., Command Reference, Glossary, Configuration Templates]

## Appendix B: [Title]

[Content - e.g., Troubleshooting Quick Reference, Resources, Change History]
```

**Common appendix types:**
- Command Reference
- Glossary of Terms
- Configuration Examples
- Troubleshooting Quick Reference
- Related Resources
- Change History
- Contact Information

## Formatting Standards

### Text Formatting

**Bold:** Use for emphasis, UI elements, important terms
```markdown
**Important Text** or **Click OK**
```

**Italic:** Use for document titles, file names
```markdown
*Document Title* or *filename.txt*
```

**Code/Monospace:** Use for commands, file paths, code
```markdown
`command` or `C:\Path\To\File`
```

### Spacing & Layout

- **Paragraphs:** 1 blank line between paragraphs
- **Sections:** 2 blank lines before new major section
- **Lists:** No blank lines between items (unless multi-paragraph items)
- **Code blocks:** 1 blank line before and after

### Professional Tone

- **Active voice:** "Click Save" not "The Save button should be clicked"
- **Second person:** "You" for user-facing guides
- **Third person:** "The system" for technical documentation
- **Concise:** Short sentences (avg 15-20 words)
- **Clear:** Define acronyms on first use

## Document Metadata

Include at end of document:

```markdown
---

**Document Version:** [X.Y.Z]  
**Created:** [Month YYYY]  
**Last Updated:** [Month YYYY]  
**Owner:** INT [Department] Team  
**Classification:** [Internal Use Only / Confidential]  
**Next Review:** [Month YYYY]
```

## Quality Checklist

Before finalizing a reference guide:

- [ ] Document header complete (title, team, date)
- [ ] Opening paragraph explains scope
- [ ] Important Links section populated
- [ ] Contact information provided
- [ ] Table of Contents generated
- [ ] All sections numbered (1., 1.1., 1.1.1.)
- [ ] Callout boxes used appropriately (⚠️, ℹ️, ✅)
- [ ] Tables formatted (max 5 columns)
- [ ] Lists limited (≤9 items)
- [ ] Images centered with shadows
- [ ] Alt text on all images
- [ ] Code blocks properly formatted
- [ ] Appendices included
- [ ] Document metadata complete
- [ ] Professional tone throughout
- [ ] Spell-checked and grammar-checked

## Example Sections

### Example: Introduction Section

```markdown
# 1. Introduction

This reference guide provides step-by-step procedures for deploying Apple Silicon Macs in a non-MDM environment. It covers the complete lifecycle from initial setup to production deployment, including security configuration and enterprise software installation.

**Scope:**
- OOBE bypass and dual account provisioning
- Rosetta 2 installation
- Remote monitoring agent deployment
- Endpoint protection configuration

**Out of Scope:**
- MDM-based deployment (see KB-MDM-001)
- Windows device deployment (see KB-IMG-001)

**Prerequisites:**
- Apple Silicon Mac (M1, M2, M3, M4)
- macOS 13.x or later
- Network connectivity
- INT-Admin credentials
```

### Example: Callout Usage

```markdown
## 2.1. BIOS Configuration

Before proceeding with imaging, verify BIOS storage controller mode.

⚠️ **WARNING:** Incorrect storage mode is the #1 cause of imaging failure. Do NOT skip this step.

ℹ️ **INFO:** BIOS settings vary by manufacturer. Dell systems use F2, HP uses F10, Lenovo uses F1.

✅ **BEST PRACTICE:** Always capture BIOS screenshots for audit trail and troubleshooting purposes.

1. Power on device
2. Press F2 (Dell) repeatedly
3. Navigate to **Storage** > **SATA Operation**
4. Set to **AHCI** (not RAID)
5. Save and exit (F10)
```

### Example: Table

```markdown
## 3.2. VLAN Configuration

| VLAN Name | Port Range | Purpose |
|-----------|------------|---------|
| Imaging VLAN | 1-24 | MDT server access during imaging |
| Production VLAN | 25-48 | Normal network after deployment |
```

## Supporting Resources

Refer to these resources for examples:
- `resources/int-template-example.md` - Complete example guide
- `resources/callout-guidelines.md` - Detailed callout usage
- `resources/formatting-standards.md` - Comprehensive formatting rules

## Output Format

When generating a reference guide:

1. **Confirm scope** with user (what to include/exclude)
2. **Ask for metadata** (department, month/year, contact email)
3. **Generate complete document** following INT template
4. **Include all standard sections** (header, TOC, body, appendices)
5. **Apply formatting** (callouts, tables, code blocks)
6. **Add metadata footer**

Never:
- Skip the document header
- Omit callout boxes where appropriate
- Forget to number sections
- Leave out appendices
- Skip metadata footer

Always:
- Use professional tone
- Define acronyms on first use
- Include Important Links section
- Provide Contact information
- Generate Table of Contents placeholder
