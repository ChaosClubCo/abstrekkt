---
name: document-management
description: Comprehensive document management system for SMBs including file organization standards, naming conventions, version control, retention policies, archive procedures, access permissions, and folder structures. Use when establishing document systems, organizing files, setting up version control, defining retention policies, or managing document access and security.
---

# Document Management

## Overview

Document management is the systematic control of documents throughout their lifecycle - from creation through active use, archival, and eventual disposal. For SMBs, effective document management reduces time wasted searching for files, ensures compliance, protects sensitive information, and enables collaboration.

This skill provides practical frameworks for organizing, naming, versioning, and securing business documents. The focus is on systems that are simple enough for small teams to maintain while being robust enough to scale with growth.

### Why Document Management Matters for SMBs

- **Productivity**: Employees spend up to 2 hours daily searching for documents
- **Compliance**: Many industries require document retention and audit trails
- **Risk Reduction**: Proper controls protect sensitive information
- **Collaboration**: Clear organization enables team efficiency
- **Business Continuity**: Organized documents survive personnel changes

## When to Use

### Primary Triggers
- Setting up document storage systems for new or growing teams
- Addressing document chaos, duplicates, or lost files
- Establishing compliance documentation requirements
- Implementing access controls and security
- Planning document retention and archival

### Specific Use Cases
- "We need to organize our shared drive"
- "What naming convention should we use for files?"
- "How do I set up version control for documents?"
- "What's our document retention policy?"
- "How should we structure our folders?"
- "We need to control who can access certain documents"
- "Help us plan document archival and cleanup"

## Core Processes

### 1. Folder Structure Framework

#### Top-Level Organization Approaches

**Option A: Functional/Departmental Structure**
```
Company Root/
├── 01_Administration/
│   ├── Policies/
│   ├── Procedures/
│   └── Templates/
├── 02_Finance/
│   ├── Accounts_Payable/
│   ├── Accounts_Receivable/
│   ├── Budgets/
│   └── Reports/
├── 03_Human_Resources/
│   ├── Employees/
│   ├── Policies/
│   ├── Recruiting/
│   └── Training/
├── 04_Sales/
│   ├── Clients/
│   ├── Proposals/
│   └── Contracts/
├── 05_Marketing/
│   ├── Brand_Assets/
│   ├── Campaigns/
│   └── Content/
├── 06_Operations/
│   ├── Processes/
│   ├── Vendors/
│   └── Projects/
└── 07_IT/
    ├── Documentation/
    ├── Licenses/
    └── Security/
```

**Option B: Client/Project-Centric Structure**
```
Company Root/
├── 01_Clients/
│   ├── Active/
│   │   ├── ClientA/
│   │   │   ├── Contracts/
│   │   │   ├── Projects/
│   │   │   ├── Correspondence/
│   │   │   └── Deliverables/
│   │   └── ClientB/
│   ├── Inactive/
│   └── Prospects/
├── 02_Internal_Projects/
│   ├── Active/
│   └── Completed/
├── 03_Corporate/
│   ├── Administration/
│   ├── Finance/
│   ├── HR/
│   └── Legal/
└── 04_Resources/
    ├── Templates/
    ├── Training/
    └── Reference/
```

**Option C: Hybrid Structure (Recommended for Most SMBs)**
```
Company Root/
├── 00_Templates/
│   └── [All document templates]
├── 01_Corporate/
│   ├── Administration/
│   ├── Finance/
│   ├── HR/
│   ├── Legal/
│   └── IT/
├── 02_Clients/
│   ├── _Client_Template/
│   ├── Active/
│   └── Archive/
├── 03_Projects/
│   ├── _Project_Template/
│   ├── Active/
│   └── Archive/
├── 04_Marketing/
│   ├── Brand/
│   ├── Content/
│   └── Campaigns/
└── 05_Reference/
    ├── Industry/
    ├── Training/
    └── Resources/
```

#### Sub-Folder Conventions

```
Standard Client Folder Structure:
[Client Name]/
├── 00_Admin/
│   ├── Contracts/
│   ├── MSAs/
│   └── Correspondence/
├── 01_Discovery/
│   ├── Requirements/
│   └── Research/
├── 02_Planning/
│   ├── Proposals/
│   └── SOWs/
├── 03_Delivery/
│   ├── Working/
│   └── Final/
├── 04_Reports/
│   └── [Project reports]
└── 05_Archive/
    └── [Completed project folders]

Standard Project Folder Structure:
[Project Name]/
├── 00_Project_Management/
│   ├── Charter/
│   ├── Plans/
│   ├── Status/
│   └── Meetings/
├── 01_Requirements/
│   ├── Business/
│   └── Technical/
├── 02_Design/
│   ├── Mockups/
│   └── Specifications/
├── 03_Development/
│   ├── Source/
│   └── Documentation/
├── 04_Testing/
│   ├── Test_Plans/
│   └── Results/
├── 05_Deployment/
│   ├── Procedures/
│   └── Releases/
└── 06_Closeout/
    ├── Lessons_Learned/
    └── Handoff/
```

### 2. Naming Convention Standards

#### File Naming Rules

```
Core Principles:
1. Be descriptive but concise
2. Use consistent formatting
3. Include dates when relevant
4. Enable sorting and searching
5. Avoid special characters

Standard Format:
[Category]_[Description]_[Version/Date].[ext]

Examples:
- POLICY_InformationSecurity_v2.1.pdf
- CONTRACT_ClientABC_MSA_2024-01-15.docx
- INVOICE_INV-2024-0042_ClientXYZ.pdf
- REPORT_SalesQuarterly_2024Q1.xlsx
- MEETING_TeamSync_2024-01-22_Notes.md
```

#### Naming Convention Reference

```markdown
## Date Formats (Choose One Standard)
- ISO Format: YYYY-MM-DD (Recommended - sorts correctly)
- US Format: MMDDYYYY (Avoid - doesn't sort)
- Short: YYMMDD (Acceptable for space constraints)

## Version Formats
- Major.Minor: v1.0, v2.3
- Full: v1.0.0 (major.minor.patch)
- Draft: DRAFT, v0.1
- Final: FINAL, v1.0

## Status Indicators
- DRAFT - Work in progress
- REVIEW - Under review
- APPROVED - Formally approved
- FINAL - Complete, no changes expected
- ARCHIVE - Historical reference

## Category Prefixes (Examples)
| Prefix | Category |
|--------|----------|
| ADMIN | Administrative |
| CONTRACT | Contracts and agreements |
| POLICY | Policies |
| PROC | Procedures |
| REPORT | Reports |
| PROPOSAL | Proposals |
| INVOICE | Invoices |
| MEETING | Meeting documents |
| TEMPLATE | Templates |
| SPEC | Specifications |

## Characters to Avoid
- Spaces (use underscores or hyphens)
- Special characters: / \ : * ? " < > |
- Leading/trailing spaces
- Very long names (>50 characters)
```

#### Examples by Document Type

```
Contracts:
CONTRACT_[ClientName]_[Type]_YYYY-MM-DD.[ext]
- CONTRACT_AcmeCorp_MSA_2024-01-15.pdf
- CONTRACT_TechPartner_NDA_2024-03-01.pdf
- CONTRACT_AcmeCorp_SOW-001_2024-02-20.docx

Proposals:
PROPOSAL_[ClientName]_[ProjectName]_[Version].[ext]
- PROPOSAL_AcmeCorp_WebRedesign_v1.0.pdf
- PROPOSAL_NewClient_Assessment_DRAFT.docx

Reports:
REPORT_[ReportName]_[Period].[ext]
- REPORT_SalesPerformance_2024Q1.xlsx
- REPORT_ProjectStatus_2024-W03.pdf

Policies:
POLICY_[PolicyName]_v[Version].[ext]
- POLICY_InformationSecurity_v2.1.pdf
- POLICY_RemoteWork_v1.0.docx

Meeting Documents:
MEETING_[MeetingName]_YYYY-MM-DD_[Type].[ext]
- MEETING_WeeklySync_2024-01-22_Agenda.docx
- MEETING_ClientKickoff_2024-01-25_Notes.pdf

Templates:
TEMPLATE_[DocumentType]_v[Version].[ext]
- TEMPLATE_ProjectCharter_v1.2.docx
- TEMPLATE_Invoice_v2.0.xlsx
```

### 3. Version Control System

#### Version Control Principles

```
When to Create New Versions:
- Significant content changes
- After review cycles
- Before and after approvals
- At project milestones
- When shared externally

Version Numbering:
Major Version (v1.0 → v2.0):
- Significant changes
- After formal approval
- New edition/release

Minor Version (v1.0 → v1.1):
- Updates and corrections
- Added content
- Review cycle changes

Draft Versions (v0.1 → v0.9):
- Work in progress
- Pre-release versions
```

#### Version Control Methods

**Method 1: File Name Versioning (Simple)**
```
Document_v1.0.docx
Document_v1.1.docx
Document_v2.0.docx

Pros: Simple, visible, no special tools
Cons: Multiple files, manual process
Best for: Small teams, infrequent changes
```

**Method 2: Folder-Based Versioning**
```
Document/
├── Current/
│   └── Document.docx
├── Archive/
│   ├── Document_v1.0_2024-01-15.docx
│   └── Document_v1.1_2024-02-01.docx
└── Version_Log.xlsx

Pros: Clear current version, history preserved
Cons: More complex folder structure
Best for: Important documents, audit needs
```

**Method 3: Cloud Platform Versioning (Recommended)**
```
Using Google Drive, SharePoint, Dropbox, etc.:
- Automatic version history
- No duplicate files
- Easy restoration
- Built-in collaboration

Configuration:
- Enable version history
- Set retention period
- Train team on accessing history
```

#### Version Control Log Template

```markdown
# VERSION CONTROL LOG

**Document**: [Document Name]
**Location**: [File Path or URL]
**Owner**: [Document Owner]

| Version | Date | Author | Changes | Status |
|---------|------|--------|---------|--------|
| v0.1 | 2024-01-10 | J. Smith | Initial draft | Draft |
| v0.2 | 2024-01-15 | J. Smith | Added section 3 | Draft |
| v0.9 | 2024-01-20 | J. Smith | Review ready | Review |
| v1.0 | 2024-01-25 | M. Jones | Approved, published | Approved |
| v1.1 | 2024-02-10 | J. Smith | Updated section 2 | Current |

## Version Definitions
- v0.x: Draft versions
- v1.0: First approved release
- v1.x: Minor updates
- v2.0: Major revision
```

### 4. Document Retention Policy

#### Retention Schedule by Category

```markdown
# DOCUMENT RETENTION SCHEDULE

## Permanent Retention
| Document Type | Retention | Notes |
|---------------|-----------|-------|
| Corporate charter/bylaws | Permanent | Legal requirement |
| Board meeting minutes | Permanent | Legal requirement |
| Annual financial statements | Permanent | Audit trail |
| Tax returns | Permanent | IRS recommendation |
| Patents and trademarks | Permanent | IP protection |
| Major contracts | Permanent | Legal reference |

## Long-Term Retention (7+ Years)
| Document Type | Retention | Notes |
|---------------|-----------|-------|
| Employment records | 7 years after termination | Legal requirement |
| Payroll records | 7 years | IRS requirement |
| Accounts payable/receivable | 7 years | IRS requirement |
| Bank statements | 7 years | Financial audit |
| Insurance policies | 7 years after expiration | Claims reference |
| Contracts | 7 years after expiration | Legal protection |

## Medium-Term Retention (3-7 Years)
| Document Type | Retention | Notes |
|---------------|-----------|-------|
| Project files | 5 years after completion | Reference/warranty |
| Client correspondence | 5 years | Relationship history |
| Marketing materials | 3 years | Historical reference |
| Training records | 3 years | Compliance |
| Expense reports | 7 years | IRS requirement |

## Short-Term Retention (1-3 Years)
| Document Type | Retention | Notes |
|---------------|-----------|-------|
| General correspondence | 2 years | As needed |
| Meeting notes | 2 years | Reference |
| Drafts and working documents | 1 year after final | Cleanup |
| Routine reports | 1-2 years | Superseded |

## Immediate Disposal (After Use)
| Document Type | Retention | Notes |
|---------------|-----------|-------|
| Duplicates | Delete immediately | Redundant |
| Superseded drafts | Delete after final | Clutter |
| Transitory messages | Delete after action | No value |
| Spam/junk | Delete immediately | No value |
```

#### Retention Policy Implementation

```markdown
## RETENTION POLICY DOCUMENT

### Purpose
This policy establishes retention periods for company documents to ensure
compliance, reduce storage costs, and manage information effectively.

### Scope
Applies to all documents created, received, or maintained by [Company Name]
in any format (paper, electronic, email, etc.).

### Responsibilities
- Document Owners: Classify and manage their documents
- Department Heads: Ensure compliance within their teams
- IT/Admin: Maintain systems and perform scheduled purges
- Legal: Advise on regulatory requirements

### Classification
All documents must be classified:
- Permanent: Never delete
- Long-term: 7+ years
- Medium-term: 3-7 years
- Short-term: 1-3 years
- Transitory: Delete after use

### Legal Holds
- When litigation is anticipated, notify Legal immediately
- Suspend all destruction of potentially relevant documents
- Legal Hold supersedes retention schedule

### Destruction
- Approved destruction methods: shredding (paper), secure delete (electronic)
- Document destruction with destruction log
- Annual destruction review and certification

### Annual Review
- Policy reviewed annually
- Retention schedules updated for regulatory changes
- Training refreshed for staff
```

### 5. Access Permission Framework

#### Permission Levels

```markdown
## Access Control Matrix

### Permission Levels
| Level | View | Download | Edit | Delete | Share | Manage |
|-------|------|----------|------|--------|-------|--------|
| Owner | Yes | Yes | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | Yes | No | Yes | No |
| Contributor | Yes | Yes | Yes* | No | No | No |
| Viewer | Yes | Yes* | No | No | No | No |
| Restricted | Yes* | No | No | No | No | No |

*Limited or controlled

### Folder Permission Guidelines
| Folder | Who | Permission | Rationale |
|--------|-----|------------|-----------|
| Corporate/Legal | Leadership, Legal | Editor | Sensitive documents |
| Corporate/HR | HR Team | Editor | Confidential employee data |
| Corporate/Finance | Finance Team | Editor | Financial sensitivity |
| Client Files | Project Team | Contributor | Need to work files |
| Templates | All Staff | Viewer | Use but not modify |
| Archive | Admins | Editor | Historical reference |
```

#### Access Request Process

```markdown
## ACCESS REQUEST FORM

**Requester**: [Name]
**Department**: [Department]
**Date**: [Date]

**Access Requested**:
- Folder/Document: [Path or name]
- Permission Level: [ ] View [ ] Edit [ ] Full Access
- Duration: [ ] Permanent [ ] Temporary (until: _____)

**Business Justification**:
[Why is this access needed?]

**Approvals**:
- [ ] Requester's Manager: _____________ Date: _____
- [ ] Folder Owner: _____________ Date: _____
- [ ] IT (if system access): _____________ Date: _____

**For IT Use**:
- Access granted: [ ] Yes [ ] No
- Date implemented: _____
- Review date: _____
```

### 6. Archive Procedures

#### Archive Process

```markdown
## DOCUMENT ARCHIVAL PROCEDURE

### When to Archive
- Project completion + review period (typically 30-90 days)
- Annual cleanup cycle
- Regulatory compliance requirements
- Storage optimization needs

### Archive Criteria
Archive documents that are:
- No longer actively used
- Past their active retention period
- Superseded by newer versions
- Completed projects with no active work

Do NOT archive:
- Documents with pending actions
- Active contracts or agreements
- Documents under legal hold
- Current reference materials

### Archive Process Steps

**Step 1: Identify and Review**
- Review folders for archive candidates
- Verify all work is complete
- Confirm no legal holds apply
- Document owner approval

**Step 2: Prepare for Archive**
- Remove duplicate and draft versions
- Ensure proper naming conventions
- Update version control logs
- Create archive inventory

**Step 3: Move to Archive**
- Move to designated archive location
- Maintain folder structure
- Update access permissions (read-only)
- Record in archive log

**Step 4: Verify and Document**
- Verify files accessible in archive
- Update document inventory
- Notify stakeholders if needed
- Set destruction date if applicable

### Archive Log Template
| Archive Date | Document/Folder | Original Location | Archived By | Destruction Date |
|--------------|-----------------|-------------------|-------------|------------------|
| 2024-01-15 | Project_Alpha | /Projects/Active | J. Smith | 2031-01-15 |
```

### 7. Document Inventory and Audit

#### Document Inventory Template

```markdown
# DOCUMENT INVENTORY

**Department**: [Department]
**Inventory Date**: [Date]
**Conducted By**: [Name]

| ID | Document Name | Location | Owner | Classification | Retention | Last Review |
|----|---------------|----------|-------|----------------|-----------|-------------|
| D001 | [Name] | [Path] | [Owner] | [Class] | [Period] | [Date] |
| D002 | [Name] | [Path] | [Owner] | [Class] | [Period] | [Date] |

## Classification Key
- P: Permanent
- L: Long-term (7+ years)
- M: Medium-term (3-7 years)
- S: Short-term (1-3 years)
- T: Transitory

## Issues Identified
| Issue | Location | Action Required | Due Date | Owner |
|-------|----------|-----------------|----------|-------|
| [Issue] | [Path] | [Action] | [Date] | [Name] |
```

## Tools & Templates

### Document Management Tools

| Tool | Best For | Price Range |
|------|----------|-------------|
| Google Drive | SMB collaboration | Free-$12/user/mo |
| Microsoft SharePoint | Enterprise features | $5-12/user/mo |
| Dropbox Business | File sync | $15-24/user/mo |
| Box | Security focus | $5-35/user/mo |
| Notion | Documentation | Free-$10/user/mo |
| Confluence | Team wikis | $6-11/user/mo |

### Template Library

1. **Folder Structure Template** - Standard organization
2. **Naming Convention Guide** - File naming rules
3. **Version Control Log** - Document version tracking
4. **Retention Schedule** - Document retention periods
5. **Access Request Form** - Permission requests
6. **Archive Inventory** - Archive tracking
7. **Document Audit Checklist** - Compliance verification

## Metrics & KPIs

### Organization Metrics

```
- Time to find documents (target: <2 minutes)
- Duplicate file percentage (target: <5%)
- Naming convention compliance (target: >90%)
- Folder structure compliance (target: >95%)
```

### Compliance Metrics

```
- Retention policy compliance (target: 100%)
- Access control audit pass rate (target: 100%)
- Archive completion rate (target: >95%)
- Document inventory accuracy (target: >98%)
```

### Usage Metrics

```
- Document access frequency
- Storage utilization trends
- Collaboration activity
- Version control usage
```

## Common Pitfalls

### 1. No Consistent Structure
**Problem**: Everyone creates their own organization system
**Prevention**:
- Establish and document folder standards
- Provide templates and training
- Periodic compliance reviews

### 2. Poor Naming Conventions
**Problem**: Files named inconsistently or cryptically
**Prevention**:
- Document naming standards
- Provide examples and quick reference
- Automate where possible

### 3. Version Chaos
**Problem**: Multiple versions, unclear which is current
**Prevention**:
- Use cloud version control
- Clear version naming rules
- Regular cleanup of old drafts

### 4. Excessive Permissions
**Problem**: Too many people with too much access
**Prevention**:
- Principle of least privilege
- Regular access reviews
- Clear approval process

### 5. Retention Non-Compliance
**Problem**: Documents kept too long or deleted too early
**Prevention**:
- Clear retention schedule
- Automated reminders
- Annual compliance audits

### 6. Archive Neglect
**Problem**: Archives become dumping grounds or inaccessible
**Prevention**:
- Structured archive process
- Searchable archive systems
- Regular archive maintenance

## Integration Points

### Connected Business Functions

```
Document Management ←→ Project Management
- Project documentation organization
- Deliverable version control
- Archive completed projects

Document Management ←→ Legal/Compliance
- Retention policy enforcement
- Legal hold management
- Audit support

Document Management ←→ IT
- Storage management
- Access control systems
- Backup and recovery

Document Management ←→ HR
- Employee records management
- Policy distribution
- Training documentation

Document Management ←→ Finance
- Invoice and receipt storage
- Financial report retention
- Audit documentation
```

### System Integrations

```
- Cloud storage (Google Drive, SharePoint, Dropbox)
- Email systems (attachment management)
- CRM systems (client documents)
- Accounting systems (financial documents)
- Project management tools (deliverables)
```
