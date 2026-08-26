---
name: template-systems
description: Master branded template development with self-service tools, governance frameworks, and scalable design systems for consistent creative output. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Template Systems Skill

## Instructions


> Master branded template development with self-service tools, governance frameworks, and scalable design systems for consistent creative output.

## Skill Overview

This skill provides expertise in creating and managing template systems that enable consistent, on-brand creative output at scale. It covers template design, governance, self-service tools, and maintenance strategies.

## Core Capabilities

### Template Development
- Design system integration
- Modular component creation
- Variable field definition
- Constraint systems
- Format adaptation
- Accessibility compliance

### Self-Service Tools
- Template platforms
- User training
- Permission management
- Usage analytics
- Support systems
- Adoption strategies

### Template Governance
- Version control
- Update processes
- Quality standards
- Audit procedures
- Retirement protocols
- Change management

## Template Design Framework

### Template Types
```yaml
template_categories:
  presentation:
    formats:
      - PowerPoint/Keynote/Google Slides
      - Pitch decks
      - Training materials
      - Webinar slides
    components:
      - Title slides
      - Content layouts
      - Data visualization
      - Image placeholders
      - End slides

  documents:
    formats:
      - Word/Google Docs
      - Reports
      - Proposals
      - Contracts
      - Letters
    components:
      - Headers/footers
      - Cover pages
      - Section breaks
      - Tables
      - Signatures

  marketing:
    formats:
      - Social media posts
      - Email campaigns
      - Banner ads
      - Print collateral
      - Event materials
    components:
      - Hero images
      - Headlines
      - Body copy
      - CTAs
      - Legal disclaimers

  digital:
    formats:
      - Landing pages
      - Email templates
      - App screens
      - Dashboard widgets
    components:
      - Navigation
      - Content blocks
      - Forms
      - Buttons
      - Footers
```

### Template Structure Model
```yaml
template_architecture:
  master_template:
    definition: "Core brand foundation"
    contains:
      - Brand colors (primary, secondary)
      - Typography (fonts, sizes, weights)
      - Logo placements
      - Grid system
      - Core components

  category_templates:
    definition: "Format-specific adaptations"
    contains:
      - Layout structures
      - Component library
      - Content patterns
      - Format constraints

  use_case_templates:
    definition: "Specific application templates"
    contains:
      - Pre-built layouts
      - Sample content
      - Variable fields
      - Instructions
```

### Variable Field Design
```yaml
field_types:
  text_fields:
    headline:
      character_limit: 50
      required: true
      placeholder: "Enter headline"

    body_copy:
      character_limit: 500
      required: true
      validation: "No special characters"

    tagline:
      character_limit: 30
      required: false
      options: ["default", "custom"]

  image_fields:
    hero_image:
      aspect_ratio: "16:9"
      min_resolution: "1920x1080"
      formats: ["jpg", "png"]
      guidelines: "Use approved imagery only"

    product_image:
      aspect_ratio: "1:1"
      background: "transparent or white"

  selection_fields:
    color_theme:
      options: ["primary", "secondary", "accent"]
      default: "primary"

    cta_button:
      options: ["Learn More", "Shop Now", "Contact Us"]
      allow_custom: true

  conditional_fields:
    legal_disclaimer:
      show_when: "product category = financial"
      content: "Pre-defined legal text"
```

## Self-Service Platform

### Platform Requirements
```yaml
platform_capabilities:
  essential:
    - Template library access
    - Easy-to-use editor
    - Brand guardrails
    - Asset export
    - Version management

  advanced:
    - Approval workflows
    - Team collaboration
    - Usage analytics
    - Integration APIs
    - Bulk generation

  enterprise:
    - SSO authentication
    - Advanced permissions
    - Custom branding
    - Audit logging
    - Multi-brand support
```

### Platform Comparison
```yaml
template_platforms:
  canva_enterprise:
    strengths:
      - User-friendly interface
      - Rich template library
      - Good collaboration
    limitations:
      - Less enterprise control
      - Limited custom components
    best_for: "SMB and mid-market"

  lucidpress:
    strengths:
      - Strong brand control
      - Data integration
      - Print-ready output
    limitations:
      - Steeper learning curve
      - Smaller user community
    best_for: "Print-heavy organizations"

  marq:
    strengths:
      - Data-driven templates
      - Strong analytics
      - Good enterprise features
    limitations:
      - Higher price point
    best_for: "Data-driven marketing"

  bynder:
    strengths:
      - DAM + templates combined
      - Enterprise-grade
      - Strong governance
    limitations:
      - Complex setup
      - Premium pricing
    best_for: "Large enterprises"

  frontify:
    strengths:
      - Brand guidelines integration
      - Clean interface
      - Good template editor
    limitations:
      - Limited advanced features
    best_for: "Brand-focused teams"
```

### User Permissions Model
```yaml
permission_levels:
  viewer:
    can:
      - Browse templates
      - View previews
      - Request access

  creator:
    can:
      - All viewer permissions
      - Create from templates
      - Export assets
      - Save personal copies

  team_admin:
    can:
      - All creator permissions
      - Manage team members
      - View team analytics
      - Upload team assets

  template_admin:
    can:
      - All team admin permissions
      - Create new templates
      - Edit existing templates
      - Set template permissions
      - Configure workflows

  super_admin:
    can:
      - All permissions
      - Platform configuration
      - Integration management
      - Billing management
```

## Governance Framework

### Template Lifecycle
```yaml
lifecycle_stages:
  creation:
    activities:
      - Design template structure
      - Build in platform
      - Define variables
      - Set constraints
      - Document usage
    approvals:
      - Creative Director
      - Brand Manager

  pilot:
    activities:
      - Limited user testing
      - Gather feedback
      - Refine based on issues
      - Update documentation
    duration: "2-4 weeks"
    success_criteria:
      - User satisfaction >4/5
      - Error rate <5%

  active:
    activities:
      - Full rollout
      - User training
      - Monitor usage
      - Collect feedback
    maintenance:
      - Quarterly review
      - Usage analysis
      - Update as needed

  update:
    triggers:
      - Brand refresh
      - User feedback
      - New requirements
      - Platform changes
    process:
      - Version bump
      - Update template
      - Notify users
      - Archive previous

  retirement:
    triggers:
      - Low usage
      - Replaced by new template
      - No longer needed
    process:
      - Announce retirement
      - Migration guidance
      - Archive access
      - Remove from active
```

### Quality Standards
```yaml
template_quality_checklist:
  brand_compliance:
    - [ ] Uses approved colors
    - [ ] Correct typography
    - [ ] Logo properly placed
    - [ ] Follows grid system
    - [ ] Consistent spacing

  usability:
    - [ ] Clear instructions
    - [ ] Appropriate field limits
    - [ ] Helpful placeholders
    - [ ] Error prevention
    - [ ] Preview functionality

  technical:
    - [ ] All formats work
    - [ ] Exports correctly
    - [ ] Links functional
    - [ ] Mobile responsive (if applicable)
    - [ ] Accessibility compliant

  documentation:
    - [ ] Usage guide created
    - [ ] Examples provided
    - [ ] Variables documented
    - [ ] Troubleshooting tips
```

### Version Control
```yaml
versioning_strategy:
  major_version:
    trigger: "Significant design change"
    example: "v1.0 → v2.0"
    requires:
      - User communication
      - Training update
      - Archive previous

  minor_version:
    trigger: "Feature addition/improvement"
    example: "v2.0 → v2.1"
    requires:
      - Changelog update
      - Optional notification

  patch_version:
    trigger: "Bug fix or typo"
    example: "v2.1 → v2.1.1"
    requires:
      - Internal documentation
```

## Training & Adoption

### Training Program
```yaml
training_curriculum:
  onboarding:
    format: "Self-paced video"
    duration: "15 minutes"
    content:
      - Platform overview
      - Finding templates
      - Creating from template
      - Exporting assets

  intermediate:
    format: "Live workshop"
    duration: "1 hour"
    content:
      - Advanced editing
      - Custom assets
      - Collaboration features
      - Best practices

  admin_training:
    format: "Hands-on session"
    duration: "2 hours"
    content:
      - Template creation
      - Governance processes
      - User management
      - Analytics review
```

### Adoption Strategies
```yaml
adoption_tactics:
  launch:
    - Executive sponsorship
    - Launch announcement
    - Initial training sessions
    - Quick-start guides
    - Helpdesk support

  ongoing:
    - Regular tips and tricks
    - Success story sharing
    - New template announcements
    - Feedback collection
    - Usage recognition

  metrics:
    - Active users (monthly)
    - Templates created
    - Time saved estimate
    - Brand compliance rate
    - User satisfaction
```

## Template Library Structure

### Organization Model
```markdown
# Template Library Structure

## By Department
- Marketing
  - Campaign templates
  - Social media
  - Email marketing
- Sales
  - Proposals
  - Pitch decks
  - Case studies
- HR
  - Job postings
  - Training materials
  - Employee communications
- Operations
  - Reports
  - Documentation
  - Processes

## By Use Case
- External Communications
- Internal Communications
- Events
- Product Marketing
- Corporate Communications

## By Format
- Presentations
- Documents
- Social Media
- Email
- Print
- Digital
```

## Integration Points

### Related Skills
- `brand-compliance` - Guidelines enforcement
- `asset-management` - Asset library access
- `style-guides` - Design standards
- `creative-review` - Approval workflows

### System Integrations
```yaml
integrations:
  dam_systems:
    purpose: "Asset library access"
    sync: "Approved assets available in templates"

  marketing_automation:
    purpose: "Email template deployment"
    sync: "Templates pushed to email platform"

  crm:
    purpose: "Sales collateral generation"
    sync: "Personalized documents"

  analytics:
    purpose: "Usage tracking"
    sync: "Template performance data"
```

## Success Metrics

### Template System KPIs
```yaml
metrics:
  adoption:
    - Active users (monthly)
    - Templates created
    - New user growth

  efficiency:
    - Time to create (vs. from scratch)
    - Revision cycles reduced
    - Cost savings estimate

  quality:
    - Brand compliance rate
    - Error reduction
    - User satisfaction

  governance:
    - Templates maintained (up-to-date)
    - Retirement rate
    - Update frequency
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Creative Ops | Initial skill creation |

---

*Use this skill to build scalable template systems that empower teams to create on-brand content efficiently while maintaining quality standards.*
