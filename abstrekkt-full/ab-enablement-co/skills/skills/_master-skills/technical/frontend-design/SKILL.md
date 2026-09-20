---
name: frontend-design
description: Frontend design system toolkit for building responsive, accessible, and performant user interfaces with modern CSS and component patterns. Use when designing layouts, implementing design tokens, or building component libraries.
---

# Frontend Design

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Core Workflow

1. **Understand the Context** - Clarify the purpose, audience, and constraints before writing any code. Ask: What problem does this interface solve? Who uses it? What devices and browsers must be supported? What is the performance budget?

2. **Choose an Aesthetic Direction** - Commit to a bold, intentional design direction. Pick a tone: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian. The key is intentionality, not intensity.

3. **Define the Design Token System** - Establish colors, typography, spacing, and elevation scales as CSS custom properties or a design token file before building components. This ensures consistency across all elements.

4. **Build the Component Architecture** - Identify atomic components (buttons, inputs, labels), composite components (cards, forms, navigation), and page-level layouts. Build from small to large.

5. **Implement Responsive Behavior** - Design mobile-first, then layer on complexity for larger viewports. Use CSS Grid and Flexbox for layout. Define breakpoints in the token system, not scattered through component styles.

6. **Apply Motion and Interaction** - Add animations for page load, state transitions, and micro-interactions. Prioritize CSS-only solutions for HTML projects. Use Motion library for React when available.

7. **Validate Accessibility** - Run through the accessibility checklist (see below). Test with keyboard navigation. Verify color contrast ratios. Add ARIA attributes where semantic HTML is insufficient.

8. **Optimize Performance** - Lazy load images and heavy components. Minimize CSS bundle size by removing unused rules. Use `will-change` sparingly. Test Core Web Vitals.

## Templates / Frameworks

### Design Token System Template

```css
:root {
  /* Color Palette - adjust to match aesthetic direction */
  --color-primary: #1a1a2e;
  --color-secondary: #16213e;
  --color-accent: #e94560;
  --color-surface: #0f3460;
  --color-background: #f5f5f5;
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #555;
  --color-text-inverse: #f5f5f5;
  --color-border: #e0e0e0;
  --color-error: #d32f2f;
  --color-success: #2e7d32;
  --color-warning: #f9a825;

  /* Typography Scale */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: clamp(0.7rem, 0.8vw, 0.75rem);
  --text-sm: clamp(0.8rem, 0.9vw, 0.875rem);
  --text-base: clamp(0.95rem, 1vw, 1rem);
  --text-lg: clamp(1.1rem, 1.2vw, 1.125rem);
  --text-xl: clamp(1.2rem, 1.5vw, 1.25rem);
  --text-2xl: clamp(1.4rem, 2vw, 1.5rem);
  --text-3xl: clamp(1.8rem, 2.5vw, 1.875rem);
  --text-4xl: clamp(2.2rem, 3.5vw, 2.25rem);
  --text-hero: clamp(3rem, 6vw, 4.5rem);

  /* Spacing Scale (8px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */

  /* Elevation / Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;

  /* Breakpoints (for reference - use in media queries) */
  /* --bp-sm: 640px;  --bp-md: 768px;  --bp-lg: 1024px;  --bp-xl: 1280px; */

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

### Component Architecture Pattern

```
components/
  atoms/           <- Smallest building blocks
    Button/
      Button.tsx
      Button.styles.css
      Button.test.tsx
    Input/
    Label/
    Icon/

  molecules/       <- Combinations of atoms
    FormField/     <- Label + Input + Error message
    SearchBar/     <- Input + Button + Icon
    Card/          <- Surface + Typography + Action

  organisms/       <- Complex UI sections
    Header/        <- Logo + Nav + SearchBar + UserMenu
    DataTable/     <- Table + Pagination + Filters
    HeroSection/   <- Headline + Subtext + CTA + Image

  layouts/         <- Page-level structure
    PageShell/     <- Header + Sidebar + Main + Footer
    AuthLayout/    <- Centered card for login/signup
    DashboardLayout/
```

### Responsive Layout Template

```css
/* Mobile-first grid system */
.layout-grid {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .layout-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .layout-grid {
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-8);
    padding: var(--space-8);
    max-width: 1280px;
    margin: 0 auto;
  }
  .layout-grid .col-span-4 { grid-column: span 4; }
  .layout-grid .col-span-6 { grid-column: span 6; }
  .layout-grid .col-span-8 { grid-column: span 8; }
  .layout-grid .col-span-12 { grid-column: span 12; }
}

/* Container queries for component-level responsiveness */
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-4);
  }
}
```

## Best Practices

### Typography

- Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial, Inter, and Roboto.
- Pair a distinctive display font with a refined body font. Use no more than 2-3 font families per project.
- Use `clamp()` for fluid typography that scales smoothly between viewport sizes.
- Set line-height for body text between 1.5 and 1.7. For headings, use 1.1 to 1.3.
- Limit line length to 60-75 characters for readability using `max-width: 65ch`.

### Color and Theme

- Commit to a cohesive palette. Use CSS custom properties for consistency.
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- Always define both light and dark theme tokens. Use `prefers-color-scheme` media query.
- Ensure WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
- Never rely on color alone to convey information; pair with icons or text labels.

### Motion and Animation

- Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.
- Use `animation-delay` for staggered entrance effects on lists and grids.
- Respect `prefers-reduced-motion` by wrapping animations in a media query.
- Prefer CSS transitions for simple state changes and CSS animations for complex sequences.
- Keep durations between 150ms (micro-interactions) and 500ms (page transitions).

```css
@media (prefers-reduced-motion: no-preference) {
  .fade-in {
    animation: fadeIn var(--transition-slow) ease both;
  }
  .stagger-item:nth-child(1) { animation-delay: 0ms; }
  .stagger-item:nth-child(2) { animation-delay: 80ms; }
  .stagger-item:nth-child(3) { animation-delay: 160ms; }
  .stagger-item:nth-child(4) { animation-delay: 240ms; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Spatial Composition

- Use unexpected layouts: asymmetry, overlap, diagonal flow, grid-breaking elements.
- Generous negative space OR controlled density -- both work when intentional.
- Use CSS Grid `subgrid` for aligned nested layouts.
- Overlap elements with negative margins or `grid-row/column` overlap for visual depth.

### Backgrounds and Visual Details

- Create atmosphere and depth rather than defaulting to solid colors.
- Apply gradient meshes, noise textures, geometric patterns, layered transparencies, and grain overlays.
- Use `backdrop-filter: blur()` for glassmorphism effects on overlays.
- Consider subtle background patterns using CSS gradients or SVG patterns.

### Accessibility Checklist

- All interactive elements are keyboard focusable with visible focus indicators
- Color contrast meets WCAG AA (4.5:1 body text, 3:1 large text and UI components)
- Images have descriptive `alt` text; decorative images use `alt=""`
- Form inputs have associated `<label>` elements or `aria-label`
- ARIA landmarks used (`main`, `nav`, `aside`, `footer`)
- Error messages are programmatically associated with inputs via `aria-describedby`
- Modal dialogs trap focus and return focus on close
- `prefers-reduced-motion` respected for all animations
- Touch targets are at least 44x44px on mobile
- Page has a logical heading hierarchy (h1 -> h2 -> h3, no skipped levels)
- Skip navigation link provided for keyboard users
- Dynamic content changes announced via `aria-live` regions

## Common Patterns

### Pattern 1: Dark/Light Theme Toggle

Store preference in `localStorage`. Apply theme by toggling a `data-theme` attribute on the `<html>` element. Define all color tokens twice -- once under `:root` (light default) and once under `[data-theme="dark"]`.

### Pattern 2: Skeleton Loading States

Replace content with animated placeholder shapes during data fetching. Use a CSS gradient animation that sweeps left-to-right. Match the skeleton shape to the expected content shape (rectangles for text, circles for avatars).

### Pattern 3: Responsive Navigation

Mobile: hamburger icon triggers a full-screen overlay or slide-in drawer. Tablet: collapsed icon-only sidebar. Desktop: full horizontal navbar or expanded sidebar. Use a single nav component with CSS-only responsive behavior where possible.

### Pattern 4: Toast Notification System

Position fixed in a corner (typically bottom-right). Stack multiple toasts with a gap. Auto-dismiss after 5 seconds with a progress bar. Support types: success, error, warning, info. Animate in from the edge and fade out.

### Pattern 5: Form Validation UX

Validate on blur (not on every keystroke). Show inline error messages below the field. Use red border and error icon for invalid fields. Show a success checkmark when corrected. Disable the submit button only after the first submission attempt, not before.

## Anti-Patterns to Avoid

- **Generic AI aesthetics**: Overused font families (Inter, Roboto, Arial), purple gradients on white backgrounds, predictable card layouts with rounded corners and drop shadows.
- **Framework defaults**: Shipping unstyled Bootstrap or Material UI with zero customization.
- **Animation overload**: Animating everything dilutes impact. Choose 2-3 signature moments.
- **Inconsistent spacing**: Mixing arbitrary pixel values instead of using a spacing scale.
- **Color palette sprawl**: Using too many colors without a clear hierarchy.
- **Ignoring mobile**: Building desktop-first and then cramming content into mobile as an afterthought.

## Design Thinking Checklist

Before coding, answer these questions:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: What aesthetic direction will make this memorable?
- **Constraints**: Framework, browser support, performance budget, accessibility level?
- **Differentiation**: What is the one thing someone will remember about this design?

Remember: Claude is capable of extraordinary creative work. Do not hold back. Show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Keywords
frontend, design, css, html, ui, ux, component, layout, responsive, accessibility, design tokens, animation, typography, color
