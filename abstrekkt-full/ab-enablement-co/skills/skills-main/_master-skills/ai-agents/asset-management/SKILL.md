---
name: asset-management
description: Master digital asset management with DAM systems, file organization strategies, metadata standards, and asset lifecycle management. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Asset Management Skill

> Master digital asset management with DAM systems, file organization strategies, metadata standards, and asset lifecycle management.

## Overview

## Skill Overview

This skill provides expertise in managing creative assets throughout their lifecycle, from creation to archival. It covers DAM system implementation, metadata strategies, file organization, and asset governance.

## Core Capabilities

### DAM Systems
- Platform selection and implementation
- Taxonomy development
- User access management
- Integration configuration
- Workflow automation
- System administration

### File Organization
- Folder structure design
- Naming conventions
- Version control
- Archive strategies
- Storage optimization
- Backup procedures

### Metadata Management
- Schema development
- Tagging standards
- Search optimization
- Rights management
- Expiration tracking
- Usage analytics

## DAM System Framework

### Platform Selection Criteria
```yaml
dam_evaluation_criteria:
  core_functionality:
    - Asset upload and storage
    - Metadata management
    - Search and discovery
    - Version control
    - User permissions
    - Download/export options

  integration_requirements:
    - Creative software (Adobe CC)
    - CMS platforms
    - Marketing automation
    - Project management
    - Analytics tools
    - SSO/identity providers

  scalability:
    - Storage capacity
    - User licensing model
    - API capabilities
    - Multi-site support
    - CDN integration
    - Performance at scale

  vendor_considerations:
    - Implementation support
    - Training resources
    - Customer success
    - Roadmap transparency
    - Security certifications
    - Total cost of ownership
```

### Popular DAM Platforms
```yaml
enterprise_solutions:
  bynder:
    strengths:
      - Brand portal capabilities
      - Strong permissions system
      - Good creative integrations
    best_for: "Brand-focused organizations"

  canto:
    strengths:
      - User-friendly interface
      - Flexible pricing
      - Good collaboration features
    best_for: "Mid-market creative teams"

  widen:
    strengths:
      - Robust workflow automation
      - Strong analytics
      - Enterprise integrations
    best_for: "Large marketing operations"

  brandfolder:
    strengths:
      - Clean user experience
      - Quick implementation
      - Good portal features
    best_for: "Brand management focus"

creative_focused:
  frame_io:
    best_for: "Video production workflows"

  frontify:
    best_for: "Brand guidelines + assets"

  air:
    best_for: "Creative collaboration"
```

## File Organization Standards

### Folder Structure Template
```
/Assets
├── /Brand
│   ├── /Logos
│   │   ├── /Primary
│   │   ├── /Secondary
│   │   ├── /Subbrands
│   │   └── /Co-branding
│   ├── /Colors
│   ├── /Typography
│   ├── /Icons
│   └── /Guidelines
├── /Campaigns
│   ├── /2025
│   │   ├── /Q1_Spring_Launch
│   │   │   ├── /Briefs
│   │   │   ├── /Working_Files
│   │   │   ├── /Final_Assets
│   │   │   └── /Archive
│   │   └── /Q2_Summer_Sale
│   └── /2024
├── /Product
│   ├── /Photography
│   │   ├── /Lifestyle
│   │   ├── /Product_Shots
│   │   └── /Detail_Views
│   ├── /3D_Renders
│   └── /Videos
├── /Stock
│   ├── /Licensed
│   ├── /Purchased
│   └── /Internal
├── /Templates
│   ├── /Social
│   ├── /Email
│   ├── /Print
│   └── /Presentation
└── /Archive
    ├── /Campaigns_Archive
    └── /Deprecated_Brand
```

### Naming Convention Standards
```yaml
file_naming_format:
  pattern: "[Brand]_[AssetType]_[Description]_[Size]_[Version]_[Date]"

  examples:
    logo: "Acme_Logo_Primary_RGB_v2_20250115"
    ad: "Acme_Ad_SpringSale_1200x628_v3_20250115"
    photo: "Acme_Photo_LifestyleOutdoor_2400px_v1_20250115"

naming_rules:
  general:
    - Use underscores, not spaces
    - No special characters
    - Consistent capitalization (PascalCase or snake_case)
    - Date format: YYYYMMDD
    - Version format: v1, v2, v3

  abbreviations:
    - RGB (color mode)
    - CMYK (print color)
    - SQ (square)
    - HZ (horizontal)
    - VT (vertical)
```

### Version Control System
```yaml
version_management:
  major_versions:
    - Significant design changes
    - New creative direction
    - Brand refresh updates
    format: "v1, v2, v3"

  minor_versions:
    - Copy changes
    - Color adjustments
    - Small refinements
    format: "v1.1, v1.2"

  working_files:
    - In-progress iterations
    - Review rounds
    format: "v1_draft1, v1_draft2"

  final_approval:
    - Approved for use
    - Lock from editing
    format: "v1_FINAL"

version_control_rules:
  - Never overwrite existing versions
  - Archive rather than delete
  - Document changes in metadata
  - Maintain source files separately
```

## Metadata Standards

### Metadata Schema
```yaml
core_metadata_fields:
  descriptive:
    title:
      type: text
      required: true
      description: "Asset title"

    description:
      type: text
      required: false
      description: "Detailed description"

    keywords:
      type: tags
      required: true
      description: "Searchable keywords"

  administrative:
    created_date:
      type: date
      auto_populate: true

    created_by:
      type: user
      auto_populate: true

    modified_date:
      type: date
      auto_populate: true

    status:
      type: dropdown
      options:
        - Draft
        - In Review
        - Approved
        - Archived
        - Expired

  rights:
    usage_rights:
      type: dropdown
      options:
        - Unlimited internal
        - Limited external
        - Time-restricted
        - Campaign-specific

    expiration_date:
      type: date
      required_if: "usage_rights is time-restricted"

    license_info:
      type: text
      required_for: "Stock assets"

    credit_required:
      type: boolean

  technical:
    file_type:
      auto_populate: true
    file_size:
      auto_populate: true
    dimensions:
      auto_populate: true
    color_space:
      auto_populate: true
```

### Controlled Vocabulary
```yaml
taxonomy_structure:
  asset_type:
    - Logo
    - Photography
    - Illustration
    - Video
    - Audio
    - Document
    - Template

  brand:
    - Corporate
    - Product Line A
    - Product Line B
    - Sub-brand

  campaign:
    - Always-on
    - Seasonal
    - Product launch
    - Event
    - Partnership

  channel:
    - Digital advertising
    - Social media
    - Email
    - Website
    - Print
    - Retail
    - Broadcast

  audience:
    - B2B
    - B2C
    - Internal
    - Partner

  region:
    - Global
    - North America
    - EMEA
    - APAC
    - LATAM
```

## Asset Governance

### Access Control Framework
```yaml
user_roles:
  administrator:
    permissions:
      - Full system access
      - User management
      - Settings configuration
      - Audit log access
    typical_users: "DAM managers, IT"

  contributor:
    permissions:
      - Upload assets
      - Edit metadata
      - Create collections
      - Request approvals
    typical_users: "Designers, producers"

  approver:
    permissions:
      - Approve/reject assets
      - Publish to portals
      - Set expiration dates
    typical_users: "Brand managers, creative directors"

  viewer:
    permissions:
      - Search and browse
      - Download approved assets
      - Share links
    typical_users: "Marketing team, agencies, partners"
```

### Asset Lifecycle Management
```yaml
lifecycle_stages:
  creation:
    - Asset uploaded
    - Metadata added
    - Initial categorization
    - Status: Draft

  review:
    - Quality check
    - Brand compliance
    - Rights verification
    - Status: In Review

  approval:
    - Stakeholder sign-off
    - Final metadata
    - Usage rights confirmed
    - Status: Approved

  active_use:
    - Available for download
    - Usage tracking
    - Performance monitoring
    - Status: Active

  expiration:
    - Expiration alert
    - Rights renewal check
    - Archive decision
    - Status: Expiring

  archive:
    - Removed from active
    - Retained for records
    - Cold storage
    - Status: Archived

  deletion:
    - Permanent removal
    - Audit trail
    - Status: Deleted
```

### Rights Management
```yaml
rights_tracking:
  stock_assets:
    required_fields:
      - Source/vendor
      - License type
      - Usage restrictions
      - Expiration date
      - Cost center

    license_types:
      royalty_free:
        restrictions: "Per license agreement"
        renewal: "One-time purchase"

      rights_managed:
        restrictions: "Specific use only"
        renewal: "Per campaign/period"

      editorial:
        restrictions: "Editorial use only"
        renewal: "Varies"

  custom_photography:
    required_fields:
      - Photographer/agency
      - Model releases
      - Property releases
      - Usage grant
      - Territory rights
```

## Workflow Automation

### Automated Workflows
```yaml
upload_workflow:
  triggers:
    - New asset uploaded

  actions:
    - Extract technical metadata
    - Apply default tags
    - Notify assigned reviewer
    - Create thumbnail/preview
    - Run quality checks

approval_workflow:
  stages:
    - Creative review
    - Brand compliance
    - Legal review (if required)
    - Final approval

  automation:
    - Route based on asset type
    - Escalate if delayed
    - Notify on completion

expiration_workflow:
  triggers:
    - 30 days before expiration
    - 7 days before expiration
    - On expiration date

  actions:
    - Send notification emails
    - Create renewal task
    - Archive if not renewed
```

## Integration Patterns

### Creative Tool Integration
```yaml
adobe_integration:
  creative_cloud:
    - Direct access from apps
    - Check-in/check-out
    - Version sync
    - Link management

  features:
    - Panel integration
    - Asset placement
    - Metadata sync
    - Template access
```

### Related Skills
- `brand-compliance` - Brand guideline enforcement
- `template-systems` - Template management
- `web-production` - Asset delivery
- `creative-review` - Approval processes

## Success Metrics

### DAM Performance Metrics
```yaml
adoption_metrics:
  - Active users (monthly)
  - Search queries performed
  - Assets downloaded
  - New uploads

efficiency_metrics:
  - Time to find assets
  - Search success rate
  - Duplicate detection
  - Storage optimization

governance_metrics:
  - Metadata completeness
  - Rights compliance
  - Expired asset handling
  - Archive utilization
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Creative Ops | Initial skill creation |

---

*Use this skill to implement effective asset management systems that improve findability, ensure compliance, and maximize asset value.*
