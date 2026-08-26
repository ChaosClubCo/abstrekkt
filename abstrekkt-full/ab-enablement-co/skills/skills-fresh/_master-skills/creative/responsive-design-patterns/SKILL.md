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

### 1. Column Drop

**Behavior:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column (stacked)

**Implementation:**
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
```

**Use case:** Product cards, blog posts, team members

---

### 2. Mostly Fluid

**Behavior:**
- Desktop: Max-width container, centered
- Mobile: Full-width, edge-to-edge

```css
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}
```

**Use case:** Article pages, documentation

---

### 3. Layout Shifter

**Behavior:**
- Desktop: Sidebar + main content
- Mobile: Sidebar moves below main

```css
.layout {
  display: grid;
  gap: 24px;
}

/* Mobile: Sidebar below */
@media (max-width: 767px) {
  .layout {
    grid-template-areas:
      "main"
      "sidebar";
  }
}

/* Desktop: Sidebar on left */
@media (min-width: 768px) {
  .layout {
    grid-template-columns: 1fr 3fr;
    grid-template-areas:
      "sidebar main";
  }
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}
```

---

### 4. Off-Canvas (Mobile Nav)

**Behavior:**
- Desktop: Horizontal nav bar
- Mobile: Hamburger menu, slide-in drawer

**HTML:**
```html
<nav class="nav">
  <button class="menu-toggle">☰</button>
  <ul class="menu">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
```

**CSS:**
```css
/* Mobile: Off-canvas */
@media (max-width: 767px) {
  .menu {
    position: fixed;
    top: 0;
    left: -100%; /* Hidden off-screen */
    width: 80%;
    height: 100vh;
    background: white;
    transition: left 0.3s;
  }
  
  .menu.open {
    left: 0; /* Slide in */
  }
}

/* Desktop: Horizontal */
@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
  
  .menu {
    display: flex;
    gap: 24px;
  }
}
```

---

## Responsive Tables

### Problem: Wide Tables on Mobile

**Solutions:**

#### 1. Horizontal Scroll
```css
.table-container {
  overflow-x: auto;
}

table {
  min-width: 600px;
}
```

**Pros:** Simple, preserves table structure  
**Cons:** Requires horizontal swipe (not ideal)

---

#### 2. Stacked Rows (Responsive Table)
```css
/* Desktop: Normal table */
table {
  width: 100%;
}

/* Mobile: Stack cells vertically */
@media (max-width: 640px) {
  thead {
    display: none; /* Hide headers */
  }
  
  tbody, tr, td {
    display: block;
    width: 100%;
  }
  
  td::before {
    content: attr(data-label); /* Show label before value */
    font-weight: bold;
    display: block;
  }
}
```

**HTML:**
```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Name">Jane Smith</td>
      <td data-label="Email">jane@example.com</td>
      <td data-label="Role">Designer</td>
    </tr>
  </tbody>
</table>
```

---

#### 3. Card View (Best UX)
On mobile, convert table rows into cards.

**Design pattern:**
- Desktop: Table
- Mobile: Each row becomes a card with labeled fields

---

## Testing Responsive Designs

### 1. Browser DevTools

**Chrome DevTools:**
1. Open DevTools (Cmd+Opt+I / Ctrl+Shift+I)
2. Click "Toggle device toolbar" (Cmd+Shift+M)
3. Select preset devices or custom dimensions
4. Test touch events (toggle touch mode)

**Responsive mode tips:**
- Test portrait AND landscape
- Check at exact breakpoint (e.g., 768px) for edge cases
- Throttle network (3G) for performance testing

---

### 2. Real Devices

**Essential devices to test:**
- iPhone (latest + 1-2 years old)
- Android (Samsung, Google Pixel)
- iPad
- Small laptop (MacBook Air)
- Large desktop (27" monitor)

**Why?** Browsers render differently, touch behavior varies, notches/safe areas affect layout.

---

### 3. Automated Testing

**Tools:**
- **Responsively App** (free, open-source) - Test multiple devices simultaneously
- **BrowserStack** (paid) - Test on real devices remotely
- **Percy / Chromatic** (visual regression testing)

**Playwright example (screenshot test):**
```javascript
test('Homepage responsive layout', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'mobile.png', fullPage: true });
  
  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'desktop.png', fullPage: true });
});
```

---

## Responsive Design Checklist

### Design Phase:
- [ ] Define breakpoints based on content (not devices)
- [ ] Design mobile-first (smallest screen first)
- [ ] Use fluid typography (clamp)
- [ ] Ensure touch targets ≥44×44px
- [ ] Test text legibility at smallest size
- [ ] Consider landscape orientation (not just portrait)

### Development Phase:
- [ ] Use relative units (rem, %, vw) instead of px
- [ ] Implement responsive images (srcset, picture)
- [ ] Test keyboard navigation at all sizes
- [ ] Ensure modals trap focus on mobile
- [ ] Test with real content (long names, missing images)
- [ ] Optimize for Core Web Vitals (LCP, CLS, FID)

### QA Phase:
- [ ] Test on physical devices (iPhone, Android, tablet)
- [ ] Test portrait AND landscape
- [ ] Test at exact breakpoints (768px, 1024px)
- [ ] Test with browser zoom (125%, 150%, 200%)
- [ ] Test with slow network (3G throttling)
- [ ] Test accessibility (screen reader on mobile)

---

## Common Pitfalls

### ❌ Anti-Patterns:
1. **Desktop-first design** (harder to scale down, performance issues)
2. **Fixed widths** (`width: 320px` instead of `max-width: 100%`)
3. **Pixel-perfect matching** (designs should adapt, not match mockups exactly)
4. **Ignoring landscape** (tablets, phones in landscape)
5. **Overflow hidden** (cuts off content instead of making it responsive)
6. **Testing only in browser** (real devices behave differently)
7. **Breakpoint spaghetti** (too many breakpoints, hard to maintain)

### ✅ Best Practices:
1. **Mobile-first CSS** (progressive enhancement)
2. **Content-driven breakpoints** (add breakpoint when layout breaks)
3. **Fluid grids** (CSS Grid with `fr` units, Flexbox with `flex: 1`)
4. **Relative units** (rem, %, vw, clamp)
5. **Responsive images** (srcset, picture, WebP/AVIF)
6. **Test on real devices** (not just DevTools)
7. **Performance budget** (target <2s LCP, <0.1s CLS)

---

## Claude Workflow Integration

### When User Requests Responsive Layout:

1. **Clarify requirements:**
   - What content needs to adapt? (navigation, tables, images?)
   - What devices are priority? (mobile, tablet, desktop, all?)
   - What's the existing breakpoint system? (or create one?)

2. **Recommend approach:**
   - CSS Grid for page layout
   - Flexbox for component layout
   - Container queries for reusable components

3. **Generate code:**
   - Mobile-first CSS
   - Breakpoint-specific styles
   - Accessible markup (semantic HTML)

4. **Provide testing guidance:**
   - Key breakpoints to test
   - Real device recommendations
   - Edge cases to check

---

## Gaps & Blindspots

### Known Limitations:
- **Foldable devices:** Galaxy Fold, Surface Duo (unconventional aspect ratios)
- **TVs / large screens:** 4K displays, 10ft UI considerations
- **Print styles:** Responsive design often forgets `@media print`
- **Container queries support:** Older browsers (< 2023) don't support
- **Dynamic content:** User-generated content (long names, many items) breaks layouts

### Unknown Unknowns:
- **New device categories:** AR glasses, car dashboards, wearables
- **Variable viewport sizes:** Browser chrome (address bar) changes size on scroll (iOS Safari)
- **AI-generated layouts:** Tools that auto-generate responsive CSS (quality concerns)
- **CSS masonry layout:** Proposed spec, not yet standard (Pinterest-style layouts)

---

**Next Steps After Using This Skill:**
1. Audit current design → Identify fixed-width elements
2. Define breakpoint system → Content-driven, not device-driven
3. Refactor to CSS Grid/Flexbox → Remove float hacks
4. Implement fluid typography → Use clamp() for headings
5. Add responsive images → srcset + picture elements
6. Test on real devices → iOS, Android, tablets
