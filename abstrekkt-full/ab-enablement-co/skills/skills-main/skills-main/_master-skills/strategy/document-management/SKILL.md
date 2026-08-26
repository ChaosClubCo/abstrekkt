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


## References
- `references/access-control-matrix.md` — Access Control Matrix
