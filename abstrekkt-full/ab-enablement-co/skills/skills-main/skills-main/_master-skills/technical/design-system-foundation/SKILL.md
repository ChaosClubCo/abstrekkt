---
name: design-system-foundation
description: Build scalable, maintainable design systems with tokens, components, and clear documentation. Covers best practices including CSS custom properties, design tokens (W3C spec), component API design, and living documentation. Use when building, debugging, or optimizing technical implementations.
---

# Design System Foundation Skill

## Overview
Build scalable, maintainable design systems with tokens, components, and clear documentation. Covers 2025 best practices including CSS custom properties, design tokens (W3C spec), component API design, and living documentation.

---

## When to Use This Skill
- Creating or auditing design systems from scratch
- Standardizing visual language across products
- Building component libraries for dev handoff
- Documenting design decisions and rationale

---

## Core Principles

### 1. Token-First Architecture
**Design tokens** are the atomic values (colors, spacing, typography) that power your system.

#### Token Hierarchy (3 layers)
```
Reference Tokens → Semantic Tokens → Component Tokens
(brand-blue-500) → (color-primary)  → (button-bg-default)
```

**Why 3 layers?**
- **Reference:** Raw values (hex, px, font families)
- **Semantic:** Contextual meaning (primary, danger, neutral)
- **Component:** Specific usage (button background, input border)

**Format: W3C Design Tokens Spec (JSON)**
```json
{
  "color": {
    "brand": {
      "blue": {
        "500": {
          "$type": "color",
          "$value": "#0066FF"
        }
      }
    },
    "semantic": {
      "primary": {
        "$type": "color",
        "$value": "{color.brand.blue.500}"
      }
    }
  }
}
```

**Output targets:**
- CSS custom properties
- SCSS variables
- JavaScript objects
- Figma variables

---

### 2. Component API Design

#### Anatomy Template
Every component must define:
1. **Variants** - Visual styles (primary, secondary, ghost)
2. **States** - Interaction states (default, hover, active, disabled, error)
3. **Sizes** - Scale (xs, sm, md, lg, xl)
4. **Props** - Configurable attributes (label, icon, full-width)

**Example: Button Component Spec**
```yaml
component: Button
variants:
  - primary (filled, high emphasis)
  - secondary (outlined, medium emphasis)
  - ghost (text-only, low emphasis)
states:
  - default
  - hover
  - active (pressed)
  - focus (keyboard)
  - disabled
  - loading
sizes:
  - sm: 32px height, 12px padding
  - md: 40px height, 16px padding
  - lg: 48px height, 20px padding
props:
  - label (required)
  - icon (optional, left/right/only)
  - fullWidth (boolean)
  - type (button/submit/reset)
```

#### State Matrix Requirement
For every component, create a state matrix covering ALL combinations:
- Variant × State × Size = Total permutations
- Example: 3 variants × 6 states × 3 sizes = 54 button variations

**Claude action:** When creating components, generate the state matrix table automatically.

---

### 3. Spacing & Layout System

#### 8-Point Grid (Industry Standard)
**Base unit:** 8px  
**Scale:** 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128

**Why 8px?**
- Divisible by 2 (scaling)
- Most screen densities (1x, 1.5x, 2x, 3x) render cleanly
- Aligns with iOS/Android native guidelines

**Token naming:**
```
space-1  = 4px   (0.5 × base)
space-2  = 8px   (1 × base)
space-3  = 12px  (1.5 × base)
space-4  = 16px  (2 × base)
space-6  = 24px  (3 × base)
space-8  = 32px  (4 × base)
space-12 = 48px  (6 × base)
```

**Exception:** 4px allowed for tight spacing (icon padding, borders).

---

### 4. Typography System

#### Type Scale (Modular)
Use a **modular scale** (ratio: 1.25 - Major Third or 1.333 - Perfect Fourth).

**Example scale (1.25 ratio, 16px base):**
```
xs:   12px  (0.75rem)
sm:   14px  (0.875rem)
base: 16px  (1rem)
lg:   20px  (1.25rem)
xl:   24px  (1.5rem)
2xl:  32px  (2rem)
3xl:  40px  (2.5rem)
4xl:  48px  (3rem)
```

#### Font Loading Strategy (2025)
**Critical:** Avoid FOUT (Flash of Unstyled Text) and layout shift.

1. **Variable fonts preferred** (Google Fonts, Bunny Fonts)
2. **font-display: swap** with fallback metrics matching
3. **Preload critical fonts:**
   ```html
   <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
   ```
4. **Use `size-adjust` for fallback matching:**
   ```css
   @font-face {
     font-family: 'Fallback';
     src: local('Arial');
     size-adjust: 107%; /* Match x-height of custom font */
   }
   ```

**Claude action:** Calculate `size-adjust` values using font metrics.

---

### 5. Color System

#### Palette Structure
- **Neutral:** 10 shades (gray scale)
- **Primary:** Brand color, 10 shades
- **Semantic:** Success, warning, error, info (10 shades each)
- **Alpha variants:** For overlays (5%, 10%, 20%, 40%, 60%, 80%)

**Accessibility requirement:**
- All text/background combos must pass WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large)
- Use tools: [whocanuse.com](https://whocanuse.com), [contrast-ratio.com](https://contrast-ratio.com)

**Color token structure:**
```
color-neutral-50   (lightest)
color-neutral-900  (darkest)
color-primary-500  (base brand color)
color-semantic-error-600
color-alpha-neutral-10 (10% opacity neutral)
```

#### Dark Mode Strategy
**Approach 1: Semantic tokens (recommended)**
```css
:root {
  --color-bg-primary: var(--color-neutral-50);
  --color-text-primary: var(--color-neutral-900);
}

[data-theme="dark"] {
  --color-bg-primary: var(--color-neutral-900);
  --color-text-primary: var(--color-neutral-50);
}
```

**Approach 2: Prefers-color-scheme (automatic)**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: var(--color-neutral-900);
  }
}
```

**Claude action:** Generate both light/dark semantic token mappings.

---

### 6. Elevation & Shadows

**Levels (0-5):**
```
elevation-0: none (flat surfaces)
elevation-1: 0 1px 2px rgba(0,0,0,0.05)  (cards)
elevation-2: 0 2px 8px rgba(0,0,0,0.08)  (dropdowns)
elevation-3: 0 4px 16px rgba(0,0,0,0.12) (modals)
elevation-4: 0 8px 24px rgba(0,0,0,0.15) (sticky nav)
elevation-5: 0 16px 48px rgba(0,0,0,0.2) (full-screen overlays)
```

**Dark mode adjustment:** Reduce opacity by 50% or use lighter shadows.

---

## Documentation Requirements

### 1. Component Pages (per component)
- **Overview:** What it does, when to use
- **Anatomy:** Visual breakdown with labels
- **Props table:** Name, type, default, description
- **Variants showcase:** All visual variations
- **State matrix:** Interactive demo
- **Accessibility:** ARIA roles, keyboard nav, screen reader notes
- **Code snippets:** React, Vue, vanilla HTML
- **Do's and Don'ts:** Common mistakes

### 2. Token Documentation
- **Token list:** Searchable table with values
- **Usage guidelines:** When to use each token
- **Migration guide:** How to update from old values

### 3. Patterns & Guidelines
- **Layout patterns:** Grid systems, spacing rules
- **Content guidelines:** Voice, tone, writing style
- **Accessibility guidelines:** WCAG compliance, testing checklist

---

## Implementation Checklist

### Phase 1: Foundations (Week 1-2)
- [ ] Define brand values and design principles
- [ ] Create color palette (with contrast checks)
- [ ] Define typography scale and font loading
- [ ] Establish spacing system (8-point grid)
- [ ] Document elevation levels
- [ ] Set up token structure (3-layer hierarchy)

### Phase 2: Components (Week 3-6)
- [ ] Audit existing UI for component candidates
- [ ] Prioritize components by usage frequency
- [ ] Design state matrices for top 10 components
- [ ] Create Figma component library
- [ ] Build dev component library (React/Vue/etc)
- [ ] Write component documentation

### Phase 3: Documentation (Week 7-8)
- [ ] Set up documentation site (Storybook, Zeroheight, or custom)
- [ ] Write contribution guidelines
- [ ] Create design/dev handoff process
- [ ] Add search and navigation
- [ ] Publish versioned releases

### Phase 4: Adoption (Ongoing)
- [ ] Run design system workshops
- [ ] Create migration guides
- [ ] Provide office hours for questions
- [ ] Collect feedback and iterate
- [ ] Track adoption metrics

---

## Tools & Integrations

### Design Tools
- **Figma:** Variables, component properties, auto-layout
- **Tokens Studio:** Figma plugin for token management
- **Style Dictionary:** Transform tokens to code (Amazon)

### Development
- **Storybook:** Component playground and documentation
- **Chromatic:** Visual regression testing
- **PostCSS/Tailwind:** CSS framework integration

### Testing
- **axe DevTools:** Accessibility testing
- **Playwright/Cypress:** E2E interaction testing
- **Percy/Applitools:** Visual regression testing

---

## Common Pitfalls

### ❌ Anti-Patterns
1. **Hardcoding values in components** → Use tokens exclusively
2. **Inconsistent naming** → Establish naming conventions early
3. **Over-engineering** → Start small, 10-20 components max
4. **No versioning** → Use semantic versioning for breaking changes
5. **Documentation debt** → Write docs as you build
6. **Skipping accessibility** → Test with screen readers, keyboard nav

### ✅ Best Practices
1. **Start with an audit** → Know what exists before redesigning
2. **Involve developers early** → Ensure technical feasibility
3. **Design for edge cases** → Long text, no data, errors
4. **Version everything** → Components, tokens, guidelines
5. **Automate testing** → Visual regression, accessibility scans
6. **Measure adoption** → Track component usage in production

---

## Claude Workflow Integration

### When User Requests Design System Work:

1. **Ask clarifying questions:**
   - What's the current state? (no system, partial, needs audit)
   - What's the tech stack? (React, Vue, vanilla)
   - What's the priority? (tokens, components, documentation)
   - What's the timeline? (MVP vs full system)

2. **Generate appropriate artifacts:**
   - Token JSON files (W3C spec)
   - Component spec YAML
   - Figma structure plan
   - Implementation checklist

3. **Provide code examples:**
   - CSS custom properties setup
   - React component with variants
   - Storybook stories
   - Accessibility tests

4. **Include validation:**
   - Contrast ratio checks
   - Token naming consistency
   - Component API completeness

---

## Example Outputs

### Token File (color-tokens.json)
```json
{
  "color": {
    "brand": {
      "blue": {
        "50": { "$type": "color", "$value": "#E6F0FF" },
        "500": { "$type": "color", "$value": "#0066FF" },
        "900": { "$type": "color", "$value": "#001A4D" }
      }
    },
    "semantic": {
      "primary": {
        "$type": "color",
        "$value": "{color.brand.blue.500}"
      },
      "bg-primary": {
        "light": { "$type": "color", "$value": "#FFFFFF" },
        "dark": { "$type": "color", "$value": "{color.brand.blue.900}" }
      }
    }
  }
}
```

### Component Spec (button.yaml)
```yaml
component: Button
description: Primary interactive element for user actions
variants:
  primary:
    description: High emphasis, primary actions
    background: "{color.semantic.primary}"
    text: "#FFFFFF"
  secondary:
    description: Medium emphasis, secondary actions
    background: "transparent"
    border: "1px solid {color.semantic.primary}"
    text: "{color.semantic.primary}"
states:
  default: "Base state"
  hover: "Cursor over, slight scale"
  active: "Pressed, darker shade"
  focus: "Keyboard focus, outline ring"
  disabled: "Non-interactive, reduced opacity"
sizes:
  sm: { height: "32px", padding: "0 12px", fontSize: "14px" }
  md: { height: "40px", padding: "0 16px", fontSize: "16px" }
  lg: { height: "48px", padding: "0 20px", fontSize: "18px" }
accessibility:
  - "Include visible focus indicator (2px outline)"
  - "Min touch target 44×44px (iOS) or 48×48px (Android)"
  - "Disabled buttons should have aria-disabled='true'"
  - "Loading state should announce to screen readers"
```

---

## Quality Gates

### Before Publishing:
- [ ] All colors pass WCAG 2.2 AA contrast
- [ ] Token naming follows 3-layer hierarchy
- [ ] Components have complete state matrices
- [ ] Documentation includes code examples
- [ ] Dark mode variants defined
- [ ] Accessibility notes for each component
- [ ] Migration guide from previous version

---

## Resources

**Official Specs:**
- [W3C Design Tokens](https://design-tokens.github.io/community-group/format/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)

**Tools:**
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Tokens Studio](https://tokens.studio/)
- [Storybook](https://storybook.js.org/)

**Inspiration:**
- [Atlassian Design System](https://atlassian.design/)
- [Shopify Polaris](https://polaris.shopify.com/)
- [IBM Carbon](https://carbondesignsystem.com/)

---

## Gaps & Blindspots

### Known Limitations:
- **Platform-specific conventions** (iOS vs Android) not covered in depth
- **Animation/motion tokens** - emerging spec, not finalized
- **3D/spatial design** - no coverage of Vision Pro/AR patterns
- **Internationalization** - right-to-left, CJK typography needs separate guidance
- **Legacy browser support** - assumes modern evergreen browsers

### Unknown Unknowns:
- Future CSS features (e.g., CSS Toggles, Cascade Layers maturity)
- Emerging accessibility standards beyond WCAG 2.2
- AI-generated design system components (quality concerns)
- Design token versioning at scale (monorepo challenges)

---

**Next Steps After Using This Skill:**
1. Audit existing UI → Identify inconsistencies
2. Define brand tokens → Start with color + typography
3. Build 3 pilot components → Button, Input, Card
4. Test with real content → Long text, edge cases
5. Document and publish → Internal wiki or public site
