---
name: localization
description: Master creative localization with translation management, cultural adaptation, regional variant production, and global brand consistency. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Localization Skill

## Instructions


> Master creative localization with translation management, cultural adaptation, regional variant production, and global brand consistency.

## Skill Overview

This skill provides expertise in adapting creative content for different markets, languages, and cultures. It covers translation workflows, cultural considerations, regional variants, and localization best practices.

## Core Capabilities

### Translation Management
- Translation workflows
- Vendor management
- Quality assurance
- Translation memory
- Terminology management
- Localization testing

### Cultural Adaptation
- Cultural sensitivity
- Market-specific messaging
- Visual adaptation
- Regulatory compliance
- Local preferences
- Transcreation

### Regional Variants
- Asset versioning
- Market customization
- Local campaign needs
- Variant tracking
- Consistency management
- Distribution coordination

## Localization Framework

### Localization Levels
```yaml
localization_tiers:
  level_1_translation:
    description: "Direct language translation"
    scope:
      - Text conversion to target language
      - Basic formatting adjustments
      - Currency/date format changes
    when_to_use:
      - Technical documentation
      - Legal content
      - Simple informational content
    cost: "Lowest"
    timeline: "Fastest"

  level_2_localization:
    description: "Language + cultural adaptation"
    scope:
      - All Level 1 elements
      - Cultural references adjusted
      - Imagery reviewed for appropriateness
      - Local conventions applied
    when_to_use:
      - Marketing materials
      - Website content
      - Product information
    cost: "Moderate"
    timeline: "Standard"

  level_3_transcreation:
    description: "Full creative adaptation"
    scope:
      - All Level 2 elements
      - Creative concept reimagined
      - Locally relevant messaging
      - Custom visuals if needed
    when_to_use:
      - Campaign headlines
      - Advertising creative
      - Brand storytelling
    cost: "Highest"
    timeline: "Longest"
```

### Market Prioritization Matrix
```yaml
market_tiers:
  tier_1_priority:
    criteria:
      - Revenue >$10M
      - Strategic growth market
      - Full brand presence
    localization_level: "Level 3"
    review_process: "Full local review"
    examples:
      - US English
      - UK English
      - German
      - Japanese

  tier_2_important:
    criteria:
      - Revenue $2-10M
      - Established market
      - Growing presence
    localization_level: "Level 2"
    review_process: "Regional review"
    examples:
      - French
      - Spanish (LATAM)
      - Portuguese (Brazil)
      - Korean

  tier_3_emerging:
    criteria:
      - Revenue <$2M
      - New market entry
      - Limited presence
    localization_level: "Level 1"
    review_process: "Vendor QA only"
    examples:
      - Thai
      - Vietnamese
      - Polish
      - Turkish
```

## Translation Workflow

### End-to-End Process
```yaml
localization_workflow:
  phase_1_preparation:
    activities:
      - Identify content for localization
      - Define target languages
      - Extract translatable text
      - Prepare source files
      - Create context documentation
    outputs:
      - Source content package
      - Context guide
      - Reference materials

  phase_2_translation:
    activities:
      - Assign to translators
      - Apply translation memory
      - Translate new content
      - Quality check (linguistic)
      - Client/local review
    outputs:
      - Translated text
      - Updated TM database
      - Review feedback

  phase_3_integration:
    activities:
      - Insert translations into designs
      - Adjust layouts for text expansion
      - Adapt visuals if needed
      - Technical formatting
    outputs:
      - Localized assets (draft)

  phase_4_quality_assurance:
    activities:
      - Linguistic QA
      - Functional testing
      - Visual review
      - Cultural check
      - Final proofreading
    outputs:
      - QA report
      - Final corrections

  phase_5_delivery:
    activities:
      - Final file preparation
      - Asset organization
      - Stakeholder approval
      - Distribution to markets
    outputs:
      - Approved localized assets
      - Delivery documentation
```

### Translation Brief Template
```markdown
# Translation/Localization Brief

## Project Overview
**Project Name**: [Name]
**Source Language**: [Language]
**Target Languages**: [List languages]
**Content Type**: [Marketing/Technical/Legal]
**Localization Level**: [1/2/3]

## Source Content
**Files Attached**: [List files]
**Word Count**: [Estimated words]
**New Words**: [Estimated new vs. TM match]

## Context & Instructions
### Brand Context
[Brief brand description and positioning]

### Campaign Context
[What is this content for? Campaign goals?]

### Audience
[Who will read this in each market?]

### Tone of Voice
[Formal/Casual? Technical/Conversational?]

## Special Instructions
### Do Not Translate
- [Brand names]
- [Product names]
- [Technical terms]

### Terminology
[Key terms and their approved translations]

### Cultural Considerations
[Market-specific notes or restrictions]

## Reference Materials
- [ ] Style guide attached
- [ ] Glossary attached
- [ ] Previous translations attached
- [ ] Visual references attached

## Timeline
| Milestone | Date |
|-----------|------|
| Translation due | [Date] |
| Review due | [Date] |
| Final delivery | [Date] |

## Review Process
**Local Reviewer**: [Name, email]
**Review Focus**: [What should they verify?]
```

## Cultural Adaptation

### Cultural Review Checklist
```yaml
cultural_review:
  imagery:
    checks:
      - Skin tones appropriate for market
      - Clothing/dress code acceptable
      - Hand gestures inoffensive
      - Symbols and icons appropriate
      - Settings/locations relevant
      - Diversity representation correct

  color:
    checks:
      - Color meanings considered
      - Cultural associations evaluated
      - Religious considerations
      - Political implications avoided

  messaging:
    checks:
      - Humor translates appropriately
      - Idioms adapted or replaced
      - Cultural references resonate
      - Sensitivities addressed
      - Local values reflected

  format:
    checks:
      - Date format correct
      - Currency format correct
      - Number formatting (decimals, thousands)
      - Address format appropriate
      - Phone number format
      - Reading direction (LTR/RTL)
```

### Common Cultural Considerations
```yaml
regional_notes:
  middle_east:
    language_direction: RTL
    considerations:
      - Modest dress in imagery
      - Halal considerations
      - Islamic holidays
      - Gender representation
      - Religious symbols

  asia_pacific:
    japan:
      - Honorific language levels
      - Gift-giving culture
      - Lucky/unlucky numbers (4, 7)
      - Seasonal references
      - Group vs. individual focus

    china:
      - Simplified vs. Traditional characters
      - Lucky numbers (8) and unlucky (4)
      - Red = good fortune
      - Government regulations
      - Cultural icons/references

  europe:
    germany:
      - Formal language preference
      - Precision and accuracy valued
      - Environmental concerns
      - Privacy sensitivity

    uk_vs_us:
      - Spelling differences
      - Date format (DD/MM vs. MM/DD)
      - Measurement units
      - Humor style
      - Slang variations
```

## Asset Variant Management

### Variant Naming Convention
```yaml
naming_structure:
  format: "[AssetName]_[Language]_[Region]_[Version]"

  language_codes:
    - en-US (English - United States)
    - en-GB (English - United Kingdom)
    - es-ES (Spanish - Spain)
    - es-MX (Spanish - Mexico)
    - pt-BR (Portuguese - Brazil)
    - zh-CN (Chinese - Simplified)
    - zh-TW (Chinese - Traditional)
    - ja-JP (Japanese)
    - de-DE (German)
    - fr-FR (French - France)
    - fr-CA (French - Canada)

  examples:
    - "SpringCampaign_Hero_en-US_v1"
    - "SpringCampaign_Hero_es-MX_v1"
    - "SpringCampaign_Hero_ja-JP_v1"
```

### Variant Tracking Matrix
```markdown
# Localization Status Tracker

| Asset | Source | EN-GB | DE-DE | FR-FR | ES-ES | JA-JP | ZH-CN |
|-------|--------|-------|-------|-------|-------|-------|-------|
| Homepage Hero | v2.1 | In Translation | Complete | Review | - | In Design | - |
| Email Header | v1.0 | Complete | Complete | Complete | Complete | Complete | In Translation |
| Social Banner | v1.2 | Not Started | Not Started | Not Started | - | - | - |

**Status Key**:
- Complete = Approved and delivered
- Review = With local reviewer
- In Translation = Being translated
- In Design = Layout in progress
- Not Started = Queued
- (-) = Not applicable for market
```

## Quality Assurance

### Linguistic QA Standards
```yaml
qa_error_categories:
  critical:
    - Wrong language displayed
    - Brand name misspelled
    - Offensive translation
    - Legal information incorrect
    - Pricing errors
    weight: "Must fix before release"

  major:
    - Grammar errors
    - Mistranslation affecting meaning
    - Inconsistent terminology
    - Missing content
    - Cultural inappropriateness
    weight: "Should fix before release"

  minor:
    - Typos
    - Style inconsistencies
    - Suboptimal phrasing
    - Minor formatting issues
    weight: "Fix if time permits"

  preference:
    - Alternative translation options
    - Regional variations
    - Style suggestions
    weight: "Document for future"
```

### Translation Memory Management
```yaml
tm_best_practices:
  maintenance:
    - Regular TM cleanup
    - Remove outdated content
    - Verify high-value segments
    - Update terminology changes

  leverage_targets:
    new_content: "Aim for 30-40% TM match"
    updates: "Aim for 60-80% TM match"
    legal_content: "Expect 50-70% match"

  quality_control:
    - Review 100% matches for context
    - Verify fuzzy match accuracy
    - Update TM with corrections
    - Flag deprecated translations
```

## Vendor Management

### Localization Vendor Evaluation
```yaml
vendor_criteria:
  capabilities:
    - Native-speaker translators
    - Subject matter expertise
    - Technology platform
    - Quality processes
    - Scalability

  service_levels:
    - Turnaround time
    - Quality metrics (error rates)
    - Responsiveness
    - Flexibility

  commercial:
    - Pricing model (per word, hourly)
    - Volume discounts
    - Rush fees
    - Minimum charges
```

## Integration Points

### Related Skills
- `brand-compliance` - Global brand standards
- `creative-review` - Review workflows
- `template-systems` - Localized templates
- `asset-management` - Variant storage

### Tool Integrations
```yaml
localization_tools:
  translation_management:
    - Smartling
    - Phrase (Memsource)
    - Crowdin
    - Lokalise

  machine_translation:
    - DeepL
    - Google Translate API
    - Amazon Translate

  design_tools:
    - Figma plugins
    - Sketch Runner
    - InDesign multi-language
```

## Success Metrics

### Localization KPIs
```yaml
metrics:
  quality:
    - Error rate per 1000 words
    - Local reviewer satisfaction
    - Customer complaints (language)

  efficiency:
    - Translation memory leverage
    - Cycle time by language
    - On-time delivery rate

  cost:
    - Cost per word by language
    - Total localization spend
    - Cost vs. revenue by market
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Creative Ops | Initial skill creation |

---

*Use this skill to deliver culturally appropriate, high-quality localized content that resonates with audiences across global markets.*
