---
name: advanced-visual-design
description: Advanced visual design techniques including typography systems, color theory, grid-based layouts, visual hierarchy, and composition principles. Use when creating high-quality visual designs, establishing design foundations, or implementing sophisticated design systems.
---

# Advanced Visual Design

Create professional visual designs using typography, color theory, grids, and composition principles.

## Quick Start Decision Tree

**Choose your workflow based on design task:**

1. **Setting up typography?** → Type Scale System (Step 1)
2. **Choosing colors?** → Color System (Step 2)
3. **Creating layouts?** → Grid Systems (Step 3)
4. **Need visual hierarchy?** → See references/hierarchy-principles.md
5. **Composition help?** → See references/composition-rules.md

## Core Workflow

### Step 1: Typography System

**Establish type scale using mathematical ratios:**

**Option A: Major Third (1.250) - Balanced, professional**
```
Base: 16px (1rem)
Scale:
- 10.24px (0.64rem) - Caption
- 12.8px (0.8rem)   - Small
- 16px (1rem)       - Body
- 20px (1.25rem)    - Large
- 25px (1.563rem)   - H4
- 31.25px (1.953rem)- H3
- 39px (2.441rem)   - H2
- 49px (3.052rem)   - H1
- 61px (3.815rem)   - Display
```

**Option B: Perfect Fourth (1.333) - More contrast**
```
Base: 16px (1rem)
Scale:
- 9px (0.563rem)    - Caption
- 12px (0.75rem)    - Small
- 16px (1rem)       - Body
- 21.33px (1.333rem)- Large
- 28.43px (1.777rem)- H4
- 37.90px (2.369rem)- H3
- 50.52px (3.157rem)- H2
- 67.34px (4.209rem)- H1
- 89.77px (5.610rem)- Display
```

**Option C: Golden Ratio (1.618) - Dramatic**
```
Base: 16px (1rem)
Scale:
- 6.10px (0.382rem) - Caption
- 9.89px (0.618rem) - Small
- 16px (1rem)       - Body
- 25.89px (1.618rem)- Large
- 41.89px (2.618rem)- H4
- 67.77px (4.236rem)- H3
- 109.66px (6.854rem)- H2
```

**Line height guidelines:**
- Headings: 1.2-1.3 (tight, for impact)
- Body text: 1.5-1.75 (readable, comfortable)
- Captions: 1.4-1.5 (compact but clear)

**Line length (measure):**
- Optimal: 45-75 characters per line
- Ideal: 65 characters (use `max-width: 65ch`)

**Font pairing principles:**
- Contrast: Serif + Sans-serif (classic)
- Harmony: Same family, different weights (subtle)
- Personality: Display + Neutral (branded)

**Professional font stacks:**
```css
/* System fonts (fast, native) */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-serif: Georgia, Cambria, "Times New Roman", serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", monospace;

/* Web fonts (Google Fonts) */
--font-display: "Playfair Display", serif;      /* Elegant headings */
--font-body: "Inter", sans-serif;               /* Clean body text */
--font-accent: "Space Grotesk", sans-serif;     /* Modern accent */
```

See: references/typography-systems.md for 20+ scales and pairings

### Step 2: Color System

**Build color palette using HSL (more intuitive than RGB):**

**Step A: Choose primary hue (0-360)**
- Red: 0°, Orange: 30°, Yellow: 60°, Green: 120°
- Cyan: 180°, Blue: 240°, Purple: 270°, Pink: 330°

**Step B: Generate tints/shades (9-step scale)**

```css
/* Primary color: Blue (240°) */
--blue-50:  hsl(240, 100%, 97%);  /* Lightest (bg, subtle) */
--blue-100: hsl(240, 95%, 92%);
--blue-200: hsl(240, 90%, 85%);
--blue-300: hsl(240, 85%, 75%);
--blue-400: hsl(240, 80%, 65%);
--blue-500: hsl(240, 75%, 55%);   /* Base (primary actions) */
--blue-600: hsl(240, 70%, 45%);   /* Hover state */
--blue-700: hsl(240, 65%, 35%);
--blue-800: hsl(240, 60%, 25%);
--blue-900: hsl(240, 55%, 15%);   /* Darkest (text, emphasis) */
```

**Step C: Create semantic tokens**

```css
/* Map palette to semantic roles */
:root {
  /* Surfaces */
  --color-background: white;
  --color-surface: hsl(240, 20%, 98%);
  --color-surface-hover: hsl(240, 20%, 95%);
  
  /* Text */
  --color-text-primary: hsl(240, 10%, 10%);
  --color-text-secondary: hsl(240, 5%, 40%);
  --color-text-tertiary: hsl(240, 5%, 60%);
  
  /* Actions */
  --color-primary: var(--blue-500);
  --color-primary-hover: var(--blue-600);
  --color-primary-active: var(--blue-700);
  
  /* Feedback */
  --color-success: hsl(142, 71%, 45%);  /* Green */
  --color-warning: hsl(38, 92%, 50%);   /* Orange */
  --color-error: hsl(0, 72%, 51%);      /* Red */
  --color-info: hsl(199, 89%, 48%);     /* Cyan */
}

/* Dark mode */
[data-theme="dark"] {
  --color-background: hsl(240, 10%, 10%);
  --color-surface: hsl(240, 10%, 15%);
  --color-text-primary: hsl(240, 10%, 90%);
  --color-primary: var(--blue-400); /* Lighter in dark mode */
}
```

**Color harmony techniques:**

**Monochromatic** (single hue, varies lightness)
- Use: Calm, cohesive, minimal designs
- Example: Blue-50 to Blue-900

**Analogous** (adjacent hues, 30° apart)
- Use: Natural, harmonious, warm/cool schemes
- Example: Blue (240°) + Cyan (210°) + Purple (270°)

**Complementary** (opposite hues, 180° apart)
- Use: High contrast, energetic, attention-grabbing
- Example: Blue (240°) + Orange (60°)

**Triadic** (3 hues, 120° apart)
- Use: Vibrant, balanced, playful
- Example: Red (0°) + Yellow (120°) + Blue (240°)

**Split-Complementary** (base + 2 adjacent to complement)
- Use: Contrast without tension
- Example: Blue (240°) + Yellow-Orange (30°) + Red-Orange (350°)

**Accessibility (WCAG 2.2):**
- Normal text (≤18px): 4.5:1 contrast
- Large text (≥18px or ≥14px bold): 3:1 contrast
- UI components: 3:1 contrast

Tool: Use `scripts/check-contrast.js` to validate

See: references/color-systems.md for complete palettes

### Step 3: Grid Systems

**8-Point Grid (industry standard):**

```css
/* Spacing scale (8px base) */
:root {
  --space-0: 0;
  --space-1: 0.5rem;  /* 8px */
  --space-2: 1rem;    /* 16px */
  --space-3: 1.5rem;  /* 24px */
  --space-4: 2rem;    /* 32px */
  --space-5: 2.5rem;  /* 40px */
  --space-6: 3rem;    /* 48px */
  --space-8: 4rem;    /* 64px */
  --space-10: 5rem;   /* 80px */
  --space-12: 6rem;   /* 96px */
  --space-16: 8rem;   /* 128px */
}
```

**Why 8-point grid?**
- Divisible by 2, 4 (easy scaling)
- Aligns with iOS/Android design guidelines
- Reduces decision fatigue
- Creates visual rhythm

**12-Column Layout Grid:**

```css
/* Responsive column grid */
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4); /* 32px gutter */
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Span utilities */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }

/* Responsive breakpoints */
@media (max-width: 768px) {
  .col-md-12 { grid-column: span 12; } /* Full-width on tablet */
}
```

**Modular Grid (for editorial/magazine layouts):**

```css
/* 6-column + baseline grid */
.editorial-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-3);
  line-height: var(--space-3); /* Baseline = 24px (3 * 8px) */
}

/* Content snaps to baseline */
h1 { line-height: calc(var(--space-3) * 3); } /* 72px */
h2 { line-height: calc(var(--space-3) * 2); } /* 48px */
p  { line-height: var(--space-3); }           /* 24px */
```

See: references/grid-systems.md for advanced layouts

### Step 4: Visual Hierarchy

**Principles (in order of importance):**

1. **Size** - Larger = more important
2. **Weight** - Bolder = more prominent  
3. **Color** - High contrast = draws attention
4. **Spacing** - More whitespace = emphasis
5. **Position** - Top/left = seen first (F-pattern)

**Z-Pattern (homepage, landing pages):**
```
Top-left → Top-right (diagonal)
↓
Bottom-left → Bottom-right (diagonal)
```

**F-Pattern (content-heavy, reading flow):**
```
Top (horizontal scan)
↓
Left side (vertical scan)
→ Short horizontal scans
```

**Hierarchy examples:**

```css
/* Level 1: Page title */
.title {
  font-size: var(--font-size-4xl);  /* Size */
  font-weight: var(--font-bold);    /* Weight */
  color: var(--color-text-primary); /* Contrast */
  margin-bottom: var(--space-6);    /* Spacing */
}

/* Level 2: Section heading */
.heading {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-top: var(--space-8);
  margin-bottom: var(--space-3);
}

/* Level 3: Body text */
.body {
  font-size: var(--font-size-base);
  font-weight: var(--font-normal);
  color: var(--color-text-secondary); /* Less contrast */
  line-height: var(--line-height-relaxed);
}

/* Level 4: Caption */
.caption {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary); /* Lowest contrast */
}
```

See: references/hierarchy-principles.md

### Step 5: Composition & Layout

**Rule of Thirds:**
- Divide canvas into 3×3 grid
- Place focal points at intersections
- Create visual balance

**Golden Ratio (1:1.618):**
```
Total width: 1280px
Main content: 790px (1280 / 1.618)
Sidebar: 490px (1280 - 790)
```

**Whitespace (negative space):**
- Macro: Between sections (48px-96px)
- Micro: Between elements (16px-32px)
- Breathing room improves comprehension

**Alignment:**
- Left-align text (Western reading patterns)
- Center-align headlines (symmetry, impact)
- Right-align numbers (easier comparison)

**Proximity (Gestalt principle):**
- Related items close together
- Unrelated items farther apart
- Creates visual grouping without borders

**Example: Card layout**

```css
.card {
  padding: var(--space-6);           /* Macro whitespace */
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.card-title {
  margin-bottom: var(--space-2);     /* Micro whitespace */
  font-size: var(--font-size-xl);
  font-weight: var(--font-semibold);
}

.card-description {
  margin-bottom: var(--space-4);     /* More space before action */
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.card-button {
  margin-top: var(--space-4);        /* Separate action from content */
}
```

See: references/composition-rules.md for advanced techniques

## Advanced Techniques

### Optical Adjustments

**Overshoot (round shapes exceed baseline):**
```css
/* Round shapes appear smaller, compensate with overshoot */
.circle {
  height: 102px; /* 2px taller than 100px square */
}
```

**Optical centering (visual vs. mathematical):**
```css
/* Icons in buttons: shift up slightly for visual balance */
.button-icon {
  position: relative;
  top: -1px; /* Optical adjustment */
}
```

**Letter-spacing (tracking) adjustments:**
```css
/* Tight for large headings */
h1 {
  letter-spacing: -0.02em; /* -2% */
}

/* Loose for uppercase small text */
.label {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em; /* +10% */
}
```

### Animation & Micro-interactions

**Easing curves:**
```css
/* Natural motion (decelerates) */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);

/* Snappy (accelerates then decelerates) */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

/* Bouncy (overshoots) */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Duration guidelines:**
- Small UI: 150-200ms
- Medium components: 250-300ms
- Large modals: 300-400ms
- Page transitions: 400-600ms

### Dark Mode

**Strategy A: Invert lightness**
```css
/* Light mode */
:root {
  --bg: hsl(240, 10%, 98%);      /* Very light */
  --text: hsl(240, 10%, 10%);    /* Very dark */
}

/* Dark mode: Swap lightness */
[data-theme="dark"] {
  --bg: hsl(240, 10%, 10%);      /* Very dark */
  --text: hsl(240, 10%, 90%);    /* Very light (not 98%, avoid eye strain) */
}
```

**Strategy B: Semantic tokens**
```css
:root {
  --color-canvas: white;
  --color-surface: hsl(240, 20%, 98%);
  --color-text: hsl(240, 10%, 10%);
  --color-primary: hsl(240, 75%, 55%);
}

[data-theme="dark"] {
  --color-canvas: hsl(240, 10%, 8%);   /* True black causes eye strain */
  --color-surface: hsl(240, 10%, 12%);
  --color-text: hsl(240, 10%, 92%);    /* Not pure white */
  --color-primary: hsl(240, 75%, 65%); /* Lighter for contrast */
}
```

## Quality Gates

Before finalizing designs:

- [ ] Type scale mathematically consistent (ratio applied)
- [ ] Line length 45-75 characters (use max-width: 65ch)
- [ ] Color contrast ≥4.5:1 (normal text), ≥3:1 (large/UI)
- [ ] 8-point grid applied (all spacing multiples of 8px)
- [ ] Visual hierarchy clear (size, weight, color, spacing)
- [ ] Whitespace sufficient (48px+ between sections)
- [ ] Alignment consistent (left/center/right used intentionally)
- [ ] Dark mode implemented (if applicable)
- [ ] Optical adjustments applied (overshoot, centering)
- [ ] Animations respect prefers-reduced-motion

Run: `scripts/design-audit.js` to validate system

## Bundled Resources

- **scripts/check-contrast.js** - WCAG contrast checker
- **scripts/design-audit.js** - Design system validator
- **scripts/generate-palette.js** - HSL palette generator
- **scripts/type-scale-calculator.js** - Calculate type scales from ratio
- **references/typography-systems.md** - 20+ type scales and font pairings
- **references/color-systems.md** - Complete color theory + 30+ palettes
- **references/grid-systems.md** - Column, modular, baseline grids
- **references/hierarchy-principles.md** - Visual hierarchy techniques
- **references/composition-rules.md** - Rule of thirds, golden ratio, balance
- **assets/figma-templates/** - Design system starter kits
- **assets/color-palettes/** - Pre-built accessible color schemes
