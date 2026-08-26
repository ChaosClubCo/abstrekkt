---
name: accessibility-design
description: Master accessible design with WCAG compliance, inclusive design principles, assistive technology support, and accessibility testing methodologies. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Accessibility Design Skill

## Instructions


> Master accessible design with WCAG compliance, inclusive design principles, assistive technology support, and accessibility testing methodologies.

## Skill Overview

This skill provides expertise in creating accessible digital experiences for all users. It covers WCAG guidelines, inclusive design practices, testing protocols, and remediation strategies.

## Core Capabilities

### WCAG Compliance
- Level A requirements
- Level AA requirements
- Level AAA considerations
- Success criteria application
- Conformance documentation
- Compliance auditing

### Inclusive Design
- Universal design principles
- Disability considerations
- Situational accessibility
- Cognitive accessibility
- Motor accessibility
- Sensory accessibility

### Testing & Remediation
- Automated testing
- Manual testing
- Assistive technology testing
- User testing with disabilities
- Issue prioritization
- Fix verification

## WCAG Guidelines

### WCAG 2.1 Structure
```yaml
wcag_principles:
  perceivable:
    description: "Information must be presentable in ways users can perceive"
    guidelines:
      - "1.1 Text Alternatives"
      - "1.2 Time-based Media"
      - "1.3 Adaptable"
      - "1.4 Distinguishable"

  operable:
    description: "UI components must be operable"
    guidelines:
      - "2.1 Keyboard Accessible"
      - "2.2 Enough Time"
      - "2.3 Seizures and Physical Reactions"
      - "2.4 Navigable"
      - "2.5 Input Modalities"

  understandable:
    description: "Information and operation must be understandable"
    guidelines:
      - "3.1 Readable"
      - "3.2 Predictable"
      - "3.3 Input Assistance"

  robust:
    description: "Content must be robust for assistive technologies"
    guidelines:
      - "4.1 Compatible"
```

### Level AA Requirements
```yaml
wcag_aa_requirements:
  perceivable:
    text_alternatives:
      - "All non-text content has text alternatives"
      - "Decorative images have empty alt or CSS"

    time_based_media:
      - "Captions for prerecorded audio"
      - "Audio descriptions for video"

    adaptable:
      - "Content structure conveyed programmatically"
      - "Reading sequence preserved"
      - "Orientation not restricted"

    distinguishable:
      - "Color contrast 4.5:1 (text)"
      - "Color contrast 3:1 (large text)"
      - "Text resizable to 200%"
      - "Images of text avoided"
      - "Reflow at 400% zoom"
      - "Non-text contrast 3:1"

  operable:
    keyboard:
      - "All functionality keyboard accessible"
      - "No keyboard traps"
      - "Shortcuts can be disabled"

    timing:
      - "Timing adjustable or extended"
      - "Moving content pausable"

    navigation:
      - "Skip links provided"
      - "Page titles descriptive"
      - "Focus order logical"
      - "Link purpose clear"
      - "Multiple navigation methods"
      - "Focus visible"

  understandable:
    readable:
      - "Page language specified"
      - "Parts language identified"

    predictable:
      - "Focus doesn't change context"
      - "Consistent navigation"
      - "Consistent identification"

    input_assistance:
      - "Errors identified"
      - "Labels provided"
      - "Error suggestions"
      - "Error prevention (legal, financial)"

  robust:
    compatible:
      - "Valid HTML"
      - "Name, role, value programmatic"
      - "Status messages announced"
```

## Accessible Design Patterns

### Color & Contrast
```yaml
color_accessibility:
  contrast_requirements:
    normal_text:
      minimum: "4.5:1 (AA)"
      enhanced: "7:1 (AAA)"
      applies_to: "Text under 18pt or 14pt bold"

    large_text:
      minimum: "3:1 (AA)"
      enhanced: "4.5:1 (AAA)"
      applies_to: "Text 18pt+ or 14pt+ bold"

    non_text:
      minimum: "3:1 (AA)"
      applies_to: "UI components, graphics"

  color_independence:
    principle: "Color not sole means of conveying information"
    examples:
      links: "Underline or other indicator"
      errors: "Icon + text, not just red"
      charts: "Patterns + colors"
      status: "Text label + color"

  testing_tools:
    - "WebAIM Contrast Checker"
    - "Colour Contrast Analyser"
    - "Stark (Figma/Sketch)"
```

### Typography
```yaml
typography_accessibility:
  font_size:
    minimum_body: "16px (1rem)"
    line_height: "1.5 minimum"
    paragraph_spacing: "1.5x line height"
    letter_spacing: "Adjustable"

  font_selection:
    readable:
      - "Clear letterforms"
      - "Adequate x-height"
      - "Distinct characters (Il1O0)"
      - "Good weight options"
    avoid:
      - "All caps for body text"
      - "Novelty/display fonts for body"
      - "Very thin weights"

  text_styling:
    avoid:
      - "Justified text (rivers)"
      - "Italics for long passages"
      - "ALL CAPS for emphasis"
    prefer:
      - "Bold for emphasis"
      - "Left-aligned text"
      - "Adequate line length (50-75 char)"

  resizing:
    requirement: "Text resizable to 200% without loss"
    approach: "Use relative units (rem, em)"
    no_horizontal_scroll: "At 400% zoom with 320px viewport"
```

### Interactive Elements
```yaml
interactive_accessibility:
  buttons:
    requirements:
      - "Clear visual affordance"
      - "Visible focus state"
      - "Adequate touch target (44x44px)"
      - "Descriptive label"
    code: |
      <button type="button" class="btn-primary">
        Submit Form
      </button>

  links:
    requirements:
      - "Underline or other visual indicator"
      - "Descriptive link text"
      - "Visible focus state"
      - "External link indication"
    avoid:
      - "Click here"
      - "Read more" (without context)
      - "Link" as text
    code: |
      <a href="/products">View our product catalog</a>

  forms:
    requirements:
      - "Visible labels"
      - "Error identification"
      - "Grouped related fields"
      - "Required field indication"
      - "Clear instructions"
    code: |
      <label for="email">Email address (required)</label>
      <input type="email" id="email" required
             aria-describedby="email-hint">
      <p id="email-hint">We'll never share your email</p>

  focus_states:
    requirements:
      - "Visible outline or indicator"
      - "Sufficient contrast"
      - "Not removed with outline: none"
    styles: |
      :focus-visible {
        outline: 2px solid #0066CC;
        outline-offset: 2px;
      }
```

### Images & Media
```yaml
image_accessibility:
  alt_text:
    informative_images:
      purpose: "Convey content"
      approach: "Describe meaning/function"
      example: 'alt="Team celebrating product launch with confetti"'

    decorative_images:
      purpose: "Visual interest only"
      approach: "Empty alt or CSS background"
      example: 'alt="" role="presentation"'

    functional_images:
      purpose: "Buttons, links"
      approach: "Describe action"
      example: 'alt="Search" (for search icon button)'

    complex_images:
      purpose: "Charts, diagrams"
      approach: "Brief alt + long description"
      example: 'alt="Sales growth chart" aria-describedby="chart-desc"'

  video:
    requirements:
      - "Captions for deaf/hard of hearing"
      - "Audio descriptions for blind users"
      - "Transcript available"
      - "No autoplay with sound"
      - "Pause controls"

  audio:
    requirements:
      - "Transcript available"
      - "No autoplay"
      - "Controls visible"
```

## Testing Methodology

### Automated Testing
```yaml
automated_testing:
  tools:
    browser_extensions:
      - name: "axe DevTools"
        use: "Page-level scanning"
      - name: "WAVE"
        use: "Visual error highlighting"
      - name: "Lighthouse"
        use: "Performance + accessibility"

    cli_tools:
      - name: "pa11y"
        use: "CI/CD integration"
      - name: "axe-core"
        use: "Integration testing"

  limitations:
    - "Only catches ~30% of issues"
    - "Cannot test user experience"
    - "May have false positives"
    - "Cannot verify alt text quality"

  best_practice:
    - "Run on every page/template"
    - "Integrate into build process"
    - "Address all flagged issues"
    - "Follow with manual testing"
```

### Manual Testing Checklist
```yaml
manual_testing:
  keyboard_testing:
    steps:
      - Navigate entire page with Tab
      - Verify focus order is logical
      - Verify all interactive elements reachable
      - Test Escape closes modals
      - Test Enter/Space activates buttons
      - Verify no keyboard traps

  screen_reader_testing:
    tools:
      - "NVDA (Windows, free)"
      - "VoiceOver (Mac/iOS, built-in)"
      - "JAWS (Windows, commercial)"
      - "TalkBack (Android, built-in)"
    tests:
      - Navigate by headings
      - Navigate by landmarks
      - Verify link text makes sense
      - Verify form labels announced
      - Verify error messages announced
      - Test dynamic content updates

  visual_testing:
    tests:
      - Zoom to 200% (text only)
      - Zoom to 400% (reflow)
      - High contrast mode
      - Increase text spacing
      - Disable images
      - Check with colorblind simulation
```

### Testing Protocol
```yaml
testing_protocol:
  quick_check:
    duration: "5 minutes"
    tests:
      - Automated scan
      - Tab through page
      - Check color contrast
    when: "Every commit"

  full_audit:
    duration: "2-4 hours per page"
    tests:
      - All automated checks
      - Full keyboard testing
      - Screen reader testing
      - Visual checks
      - Mobile testing
    when: "New pages, major updates, quarterly"

  user_testing:
    duration: "Varies"
    participants: "Users with disabilities"
    tests:
      - Task completion
      - User experience
      - Assistive tech compatibility
    when: "Major launches, annual"
```

## Remediation Strategies

### Issue Prioritization
```yaml
priority_levels:
  critical:
    impact: "Complete barrier to access"
    examples:
      - No keyboard access
      - Missing form labels
      - Trapped focus
      - No alt text on functional images
    timeline: "Immediate fix"

  high:
    impact: "Significant barrier"
    examples:
      - Low contrast text
      - Missing skip links
      - No focus indicators
      - Unclear link text
    timeline: "Within 1 sprint"

  medium:
    impact: "Causes difficulty"
    examples:
      - Suboptimal alt text
      - Long pages without headings
      - Inconsistent navigation
    timeline: "Within 1 month"

  low:
    impact: "Minor inconvenience"
    examples:
      - Minor contrast issues
      - Verbose alt text
      - Duplicate links
    timeline: "As capacity allows"
```

### Common Fixes
```yaml
common_issues_fixes:
  missing_alt_text:
    issue: "Images lack alternative text"
    fix: "Add descriptive alt attributes"
    code: '<img src="photo.jpg" alt="Description of image">'

  low_contrast:
    issue: "Text hard to read"
    fix: "Increase color contrast"
    tool: "Use contrast checker to verify 4.5:1"

  no_focus_visible:
    issue: "Focus not visible"
    fix: "Add focus styles"
    code: ':focus-visible { outline: 2px solid blue; }'

  missing_labels:
    issue: "Form fields unlabeled"
    fix: "Add associated labels"
    code: '<label for="email">Email</label><input id="email">'

  no_skip_link:
    issue: "No way to skip navigation"
    fix: "Add skip to content link"
    code: '<a href="#main" class="skip-link">Skip to main content</a>'
```

## Integration Points

### Related Skills
- `web-production` - Implementation
- `html-email` - Email accessibility
- `video-editing` - Captions, audio description
- `brand-compliance` - Accessible brand standards

### Governance
```yaml
accessibility_governance:
  policy:
    - Accessibility statement
    - WCAG conformance target
    - Testing requirements
    - Remediation process

  training:
    - Design team training
    - Development training
    - Content author training
    - QA training

  monitoring:
    - Regular audits
    - User feedback channels
    - Issue tracking
    - Compliance reporting
```

## Success Metrics

### Accessibility KPIs
```yaml
metrics:
  compliance:
    - WCAG conformance level
    - Automated test pass rate
    - Manual audit scores

  quality:
    - User feedback
    - Task completion (users with disabilities)
    - Issue resolution time

  awareness:
    - Training completion
    - Issues prevented
    - Accessibility considered in design
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | UX Team | Initial skill creation |

---

*Use this skill to create inclusive digital experiences that work for everyone, regardless of ability or assistive technology used.*
