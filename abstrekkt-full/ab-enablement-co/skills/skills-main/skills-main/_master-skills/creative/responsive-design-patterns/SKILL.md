---
name: responsive-design-patterns
description: Modern responsive design strategies using CSS Grid, Flexbox, Container Queries, and fluid typography for 2025. Use when designing, creating, or reviewing creative deliverables.
---

# Responsive Design Patterns Skill

## Overview
Modern responsive design strategies using CSS Grid, Flexbox, Container Queries, and fluid typography. Covers 2025 best practices for designing and developing layouts that adapt gracefully across all screen sizes.

---

## When to Use This Skill
- Designing multi-device experiences (mobile, tablet, desktop, TV)
- Implementing responsive layouts in code
- Auditing existing designs for responsive behavior
- Creating design system breakpoints and grid systems

---

## Responsive Design Principles (2025)

### 1. Mobile-First (Progressive Enhancement)
**Start small, scale up.**

**Why mobile-first?**
- Forces prioritization (what's essential?)
- Better performance (load less, add more for larger screens)
- Easier to scale up than down

**Approach:**
```css
/* Base styles (mobile) */
.card {
  padding: 16px;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .card {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card {
    padding: 32px;
    font-size: 18px;
  }
}
```

---

### 2. Content-Out (Not Canvas-In)
**Let content dictate breakpoints, not device sizes.**

**Anti-pattern:** Designing for "iPhone", "iPad", "Desktop"  
**Best practice:** Add breakpoints where content breaks (text too long, layout cramped)

**Process:**
1. Start at small size (320px)
2. Stretch browser width slowly
3. When layout looks bad, add a breakpoint
4. Repeat

---

### 3. Fluid, Not Fixed
**Use relative units (%, rem, vw) instead of fixed pixels.**

**Examples:**
- Width: `max-width: 1200px` (with `width: 90%` for smaller screens)
- Font size: `clamp(16px, 4vw, 24px)` (scales between min and max)
- Spacing: `padding: clamp(1rem, 5vw, 3rem)`

**Benefit:** Adapts to any screen size, not just defined breakpoints.

---

## Breakpoint Strategy

### Standard Breakpoints (2025)

**Device-agnostic approach:**
```
0-640px:   Mobile (portrait phones)
640-768px: Mobile (landscape) / Small tablets
768-1024px: Tablets (portrait)
1024-1280px: Tablets (landscape) / Small laptops
1280-1536px: Laptops / Small desktops
1536px+:   Large desktops
```

**Tailwind CSS defaults (widely adopted):**
```css
/* sm: Small devices */
@media (min-width: 640px) { ... }

/* md: Medium devices */
@media (min-width: 768px) { ... }

/* lg: Large devices */
@media (min-width: 1024px) { ... }

/* xl: Extra large devices */
@media (min-width: 1280px) { ... }

/* 2xl: Ultra large devices */
@media (min-width: 1536px) { ... }
```

**Claude action:** When generating responsive code, use these breakpoints as defaults (unless project has custom breakpoints).

---

### Breakpoint Naming (Design System)

**Don't use device names:**
- ❌ `mobile`, `tablet`, `desktop`
- ✅ `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

**Why?** "Tablet" is ambiguous (portrait or landscape?). Size-based names are clearer.

---

## CSS Layout Techniques

### 1. Flexbox (One-Dimensional Layouts)

**Use cases:**
- Navigation bars
- Card rows
- Centering content
- Equal-height columns

**Common patterns:**

#### Horizontal Stack (Nav Bar)
```css
.nav {
  display: flex;
  justify-content: space-between; /* Spread items */
  align-items: center; /* Vertical center */
  gap: 16px; /* Space between items */
}
```

#### Card Row (Wraps on Small Screens)
```css
.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card {
  flex: 1 1 300px; /* Grow, shrink, min-width 300px */
}
```

**Result:** Cards flow horizontally on wide screens, stack on narrow screens.

---

### 2. CSS Grid (Two-Dimensional Layouts)

**Use cases:**
- Page layouts (header, sidebar, main, footer)
- Image galleries
- Dashboard widgets

**Common patterns:**

#### 12-Column Grid (Bootstrap-style)
```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* Full width on mobile, 6 columns on tablet+ */
.sidebar {
  grid-column: span 12;
}

@media (min-width: 768px) {
  .sidebar {
    grid-column: span 4; /* 4 of 12 columns */
  }
  
  .main {
    grid-column: span 8; /* 8 of 12 columns */
  }
}
```

---

#### Auto-Fit Grid (Responsive Gallery)
```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

**Behavior:**
- Small screen: 1 column (250px min)
- Medium screen: 2-3 columns
- Large screen: 4-5 columns
- No media queries needed!

---

### 3. Container Queries (2025 New Standard)

**Problem:** Component sizing based on parent width, not viewport.

**Example:** Card in sidebar vs card in main content.

**Old way (media queries):**
```css
/* Card looks same in sidebar and main (bad) */
.card {
  font-size: 14px;
}

@media (min-width: 768px) {
  .card {
    font-size: 16px;
  }
}
```

**New way (container queries):**
```css
.container {
  container-type: inline-size; /* Enable container queries */
}

.card {
  font-size: 14px;
}

/* Adjust based on parent width, not viewport */
@container (min-width: 400px) {
  .card {
    font-size: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

**Browser support (2025):** Chrome 105+, Firefox 110+, Safari 16+ (95%+ coverage)

**Claude action:** Recommend container queries for component-based designs (design systems, React components).

---

## Responsive Typography

### 1. Fluid Typography (Clamp)

**Goal:** Font size scales smoothly between min and max.

**Formula:**
```css
font-size: clamp([min], [preferred], [max]);
```

**Example:**
```css
h1 {
  font-size: clamp(24px, 5vw, 48px);
}
/* 24px on small screens, 48px on large, scales smoothly */
```

**How to choose values:**
1. **Min:** Smallest readable size (mobile)
2. **Max:** Largest size (desktop)
3. **Preferred:** Viewport-based scaling (4-6vw for headings, 2-3vw for body)

**Generator:** [Modern Fluid Typography Editor](https://modern-fluid-typography.vercel.app/)

---

### 2. Line Length (Measure)

**Optimal:** 45-75 characters per line (CPL)

**Implementation:**
```css
.prose {
  max-width: 65ch; /* 65 characters */
  margin: 0 auto;
}
```

**Why `ch` unit?** Represents width of "0" character in current font. 65ch ≈ 65 characters.

---

### 3. Line Height (Leading)

**Rule of thumb:**
- Body text: 1.5-1.6
- Headings: 1.2-1.3
- Small text: 1.4

```css
body {
  line-height: 1.6;
}

h1, h2, h3 {
  line-height: 1.2;
}
```

**Dynamic line height:**
```css
p {
  line-height: calc(1.4 + 0.2vw);
}
```

---

## Responsive Images

### 1. Srcset (Resolution Switching)

**Problem:** Serve large images to desktop, small images to mobile.

**Solution:**
```html
<img 
  src="image-800w.jpg" 
  srcset="
    image-400w.jpg 400w,
    image-800w.jpg 800w,
    image-1200w.jpg 1200w
  "
  sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
  alt="Product photo"
>
```

**How it works:**
- Browser checks screen size and DPR (device pixel ratio)
- Chooses best image from srcset
- Saves bandwidth on mobile

---

### 2. Picture Element (Art Direction)

**Problem:** Different crop/layout for mobile vs desktop.

**Solution:**
```html
<picture>
  <!-- Mobile: Portrait crop -->
  <source 
    media="(max-width: 640px)" 
    srcset="hero-mobile.jpg"
  >
  
  <!-- Desktop: Landscape crop -->
  <source 
    media="(min-width: 641px)" 
    srcset="hero-desktop.jpg"
  >
  
  <!-- Fallback -->
  <img src="hero-desktop.jpg" alt="Hero image">
</picture>
```

---

### 3. Modern Formats (WebP, AVIF)

**Size savings:** 30-50% smaller than JPEG

```html
<picture>
  <source type="image/avif" srcset="image.avif">
  <source type="image/webp" srcset="image.webp">
  <img src="image.jpg" alt="Fallback for old browsers">
</picture>
```

**Browser support:**
- WebP: 95%+ (IE 11 doesn't support)
- AVIF: 80%+ (newer format, better compression)

---

## Responsive Layout Patterns


## References
- `references/1-column-drop.md` — 1. Column Drop
- `references/references.md` — References
- `references/responsive-tables.md` — Responsive Tables
