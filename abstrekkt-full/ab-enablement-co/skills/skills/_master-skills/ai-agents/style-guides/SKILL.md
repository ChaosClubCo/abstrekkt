---
name: style-guides
description: Master comprehensive style guide development covering writing standards, design systems, voice guidelines, and brand expression documentation. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Style Guides Skill

## Instructions


> Master comprehensive style guide development covering writing standards, design systems, voice guidelines, and brand expression documentation.

## Skill Overview

This skill provides expertise in creating and maintaining style guides that ensure consistent brand expression across all touchpoints. It covers writing style, design standards, voice guidelines, and documentation best practices.

## Core Capabilities

### Writing Style
- Grammar and usage standards
- Terminology management
- Formatting guidelines
- Editorial processes
- Content patterns
- Accessibility writing

### Design Standards
- Visual system documentation
- Component specifications
- Layout guidelines
- Responsive patterns
- Interaction standards
- Animation principles

### Voice Guidelines
- Brand personality definition
- Tone spectrum
- Audience-specific variations
- Channel adaptations
- Example libraries
- Anti-patterns

## Style Guide Structure

### Comprehensive Guide Framework
```yaml
style_guide_sections:
  brand_foundation:
    content:
      - Brand story and history
      - Mission and vision
      - Core values
      - Brand personality
      - Positioning statement
    purpose: "Set strategic context"

  visual_identity:
    content:
      - Logo guidelines
      - Color system
      - Typography
      - Imagery style
      - Iconography
      - Graphic elements
    purpose: "Define visual expression"

  voice_and_tone:
    content:
      - Brand voice attributes
      - Tone spectrum
      - Writing principles
      - Channel guidelines
    purpose: "Guide verbal expression"

  writing_standards:
    content:
      - Grammar rules
      - Punctuation preferences
      - Formatting standards
      - Terminology
      - Accessibility
    purpose: "Ensure consistency"

  application_guidelines:
    content:
      - Use case examples
      - Channel specifications
      - Template guidance
      - Do's and don'ts
    purpose: "Show implementation"
```

## Writing Style Standards

### Grammar and Usage
```yaml
grammar_preferences:
  oxford_comma:
    rule: "Always use"
    example: "We create content, strategy, and design."

  contractions:
    rule: "Use for casual tone, avoid for formal"
    casual: "We're here to help"
    formal: "We are committed to excellence"

  active_voice:
    rule: "Prefer active voice"
    active: "Our team designed the solution"
    passive: "The solution was designed by our team"

  sentence_structure:
    rule: "Vary length, but favor clarity"
    guidelines:
      - Lead with important information
      - One idea per sentence
      - Use parallel structure in lists

punctuation_standards:
  periods:
    headlines: "No period for headlines"
    bullets: "Period for complete sentences only"

  colons:
    capitalization: "Capitalize after colon if complete sentence"
    usage: "Use to introduce lists or explanations"

  quotation_marks:
    style: "Double quotes for direct quotes"
    punctuation: "Period inside quotes (US style)"

  dashes:
    em_dash: "Use for emphasis or parenthetical—no spaces"
    en_dash: "Use for ranges (2020–2025)"
```

### Terminology Standards
```yaml
terminology_management:
  brand_terms:
    preferred:
      - "Acme Platform" (not "ACME platform")
      - "Sign in" (not "Login")
      - "Set up" (verb) vs "Setup" (noun)
    avoid:
      - Industry jargon unless necessary
      - Buzzwords without meaning
      - Outdated terms

  product_naming:
    format: "Acme [Product Name]"
    capitalization: "Title case"
    abbreviations: "Spell out first mention"

  terminology_table:
    format: |
      | Use This | Not This | Notes |
      |----------|----------|-------|
      | Sign in | Login, Log in | Verb form |
      | Email | E-mail | No hyphen |
      | Click | Click on | Drop preposition |
      | Tap | Click (mobile) | Platform-appropriate |
```

### Formatting Standards
```yaml
formatting_rules:
  numbers:
    spell_out: "One through nine"
    numerals: "10 and above"
    exceptions:
      - "Always numerals for percentages (5%)"
      - "Always numerals for measurements"
      - "Spell out at sentence start"

  dates:
    format: "Month Day, Year"
    example: "January 15, 2025"
    variations:
      short: "Jan 15, 2025"
      numeric: "01/15/2025 (US)"

  time:
    format: "12-hour with am/pm"
    example: "3:00 pm EST"
    note: "Lowercase am/pm, no periods"

  currency:
    format: "Symbol before number"
    example: "$1,234.56"
    international: "USD 1,234.56 when clarification needed"

  lists:
    bullet_lists: "For unordered items"
    numbered_lists: "For sequential or priority items"
    capitalization: "Capitalize first word"
```

## Voice and Tone

### Brand Voice Definition
```yaml
voice_attributes:
  primary_attributes:
    confident:
      description: "We speak with authority and expertise"
      do: "Our research shows significant improvements"
      dont: "We think maybe this could possibly help"

    approachable:
      description: "We're friendly and easy to understand"
      do: "Let's walk through this together"
      dont: "Pursuant to the aforementioned guidelines"

    innovative:
      description: "We embrace new ideas and forward thinking"
      do: "Reimagine what's possible"
      dont: "We've always done it this way"

    helpful:
      description: "We prioritize being useful and supportive"
      do: "Here's how to solve that"
      dont: "Figure it out yourself"

  voice_principles:
    clarity_over_cleverness:
      "Choose clear communication over witty wordplay when there's any risk of confusion"

    human_over_corporate:
      "Write like a person, not an institution"

    specific_over_generic:
      "Use concrete details rather than vague statements"
```

### Tone Spectrum
```yaml
tone_variations:
  spectrum:
    formal: 1
    professional: 2
    friendly: 3
    casual: 4
    playful: 5

  context_mapping:
    legal_documents:
      tone: 1
      characteristics:
        - Precise language
        - Complete sentences
        - No contractions
        - Technical accuracy

    business_communications:
      tone: 2
      characteristics:
        - Professional warmth
        - Clear and direct
        - Limited contractions
        - Respectful formality

    marketing_content:
      tone: 3
      characteristics:
        - Engaging and friendly
        - Contractions okay
        - Benefit-focused
        - Conversational

    social_media:
      tone: 4
      characteristics:
        - Casual and relatable
        - Short and punchy
        - Emoji acceptable
        - Personality forward

    promotional_campaigns:
      tone: 5
      characteristics:
        - Fun and energetic
        - Creative expression
        - Bold statements
        - Entertainment value
```

### Audience Adaptations
```yaml
audience_voice:
  b2b_professional:
    tone: "Professional but not stiff"
    vocabulary: "Industry-appropriate, avoid jargon"
    focus: "Business value, ROI, efficiency"
    example: "Streamline your workflow with intelligent automation"

  b2c_consumer:
    tone: "Friendly and relatable"
    vocabulary: "Simple, everyday language"
    focus: "Personal benefits, emotional connection"
    example: "Make life easier with smart home tech"

  technical_audience:
    tone: "Precise and knowledgeable"
    vocabulary: "Technical terms acceptable"
    focus: "Specifications, capabilities, integration"
    example: "RESTful API with OAuth 2.0 authentication"

  internal_team:
    tone: "Collaborative and direct"
    vocabulary: "Internal terminology okay"
    focus: "Action items, clarity, teamwork"
    example: "Let's sync on the Q2 roadmap"
```

## Design Standards

### Visual System Documentation
```yaml
visual_documentation:
  color_system:
    primary_colors:
      format: "Name, HEX, RGB, CMYK, Pantone"
      usage_guidelines: "When to use each color"
      accessibility: "Contrast ratios and requirements"

    secondary_colors:
      supporting_palette: "Extended color options"
      usage_restrictions: "Maximum percentages"

    semantic_colors:
      success: "Green for positive actions"
      warning: "Yellow/orange for caution"
      error: "Red for errors"
      info: "Blue for information"

  typography_system:
    typefaces:
      primary: "Headings and emphasis"
      secondary: "Body text"
      monospace: "Code and technical"

    scale:
      format: "Size, line-height, weight"
      responsive: "Breakpoint variations"

    hierarchy:
      h1: "Page titles"
      h2: "Section headers"
      h3: "Subsections"
      body: "Paragraph text"

  spacing_system:
    base_unit: "8px grid"
    scale: "4, 8, 16, 24, 32, 48, 64"
    application: "Margins, padding, gaps"
```

### Component Specifications
```yaml
component_documentation:
  buttons:
    variants:
      - Primary (main CTA)
      - Secondary (alternative action)
      - Tertiary (subtle action)
      - Ghost (minimal emphasis)

    states:
      - Default
      - Hover
      - Active/Pressed
      - Focus
      - Disabled

    specifications:
      padding: "16px horizontal, 12px vertical"
      border_radius: "4px"
      min_width: "120px"
      typography: "Button text style"

  form_elements:
    components:
      - Text inputs
      - Select dropdowns
      - Checkboxes
      - Radio buttons
      - Toggle switches

    specifications:
      height: "48px standard"
      label_placement: "Above field"
      error_treatment: "Red border + message below"
```

## Documentation Best Practices

### Guide Creation Checklist
```yaml
documentation_checklist:
  content:
    - [ ] Clear purpose statement
    - [ ] Logical organization
    - [ ] Searchable structure
    - [ ] Comprehensive examples
    - [ ] Anti-patterns shown

  usability:
    - [ ] Easy navigation
    - [ ] Quick reference sections
    - [ ] Downloadable assets
    - [ ] Code snippets (if applicable)
    - [ ] Version information

  maintenance:
    - [ ] Update process defined
    - [ ] Ownership assigned
    - [ ] Change log maintained
    - [ ] Review schedule set
```

### Example Library
```yaml
example_structure:
  for_each_guideline:
    do_example:
      description: "Shows correct implementation"
      format: "Real example with annotation"

    dont_example:
      description: "Shows what to avoid"
      format: "Common mistake with explanation"

    context:
      description: "When this applies"
      format: "Use case description"
```

## Integration Points

### Related Skills
- `brand-compliance` - Enforcement of standards
- `template-systems` - Template design standards
- `creative-briefs` - Brief requirements
- `localization` - Language adaptations

### Distribution Channels
```yaml
guide_access:
  digital_platforms:
    - Brand portal (recommended)
    - Internal wiki
    - Design system site
    - PDF downloads

  integration:
    - Design tool plugins
    - CMS integration
    - Development documentation
```

## Maintenance

### Update Process
```yaml
update_workflow:
  trigger:
    - Brand refresh
    - User feedback
    - New use cases
    - Error correction

  process:
    - Document change request
    - Review and approve
    - Update content
    - Version bump
    - Communicate changes

  communication:
    - Email announcement
    - Training update
    - Tool sync
```

## Success Metrics

### Guide Effectiveness
```yaml
metrics:
  adoption:
    - Page views and engagement
    - Asset downloads
    - User feedback

  compliance:
    - Audit scores improvement
    - Error reduction
    - Consistency increase

  efficiency:
    - Time to find information
    - Support ticket reduction
    - New hire ramp time
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Brand Team | Initial skill creation |

---

*Use this skill to create comprehensive style guides that ensure consistent brand expression across all communication channels and creative outputs.*
