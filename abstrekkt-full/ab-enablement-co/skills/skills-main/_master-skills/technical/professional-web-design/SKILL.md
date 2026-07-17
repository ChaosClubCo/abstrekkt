---
name: professional-web-design
description: Industry-standard web design practices including responsive design, performance optimization, modern CSS techniques, and production-ready workflows. Use when building professional websites, web applications, or implementing advanced CSS/HTML patterns.
---

# Professional Web Design

Build production-ready websites using industry-standard practices, modern CSS, and performance-first workflows.

## Quick Start Decision Tree

**Choose your workflow based on project type:**

1. **Landing page?** → Mobile-first responsive (Step 1) + Performance (Step 3)
2. **Web app?** → Component architecture (references/app-patterns.md)
3. **E-commerce?** → See references/ecommerce-patterns.md
4. **Content site?** → Typography (Step 2) + SEO (references/seo-checklist.md)
5. **Dashboard?** → See references/dashboard-patterns.md

## Core Workflow

### Step 1: Mobile-First Responsive Design

**ALWAYS start with mobile (320px), then scale up:**

```css
/* 1. Mobile-first base styles (320px-767px) */
.container {
  padding: 1rem;
  max-width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column on mobile */
  gap: 1rem;
}

/* 2. Tablet (768px-1023px) */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
  }
}

/* 3. Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
  }
}

/* 4. Large desktop (1440px+) */
@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
  }
}
```

**Standard breakpoints:**
- Mobile: 320px-767px
- Tablet: 768px-1023px
- Desktop: 1024px-1439px
- Large: 1440px+

**Container max-widths:**
- Mobile: 100% (with 1rem padding)
- Tablet: 100% (with 2rem padding)
- Desktop: 1280px
- Large: 1440px

See: references/responsive-patterns.md for complete grid systems

### Step 2: Typography System

**Establish type scale and hierarchy:**

```css
/* 1. CSS Custom Properties (Design Tokens) */
:root {
  /* Type Scale (1.250 - Major Third) */
  --font-size-xs: 0.64rem;    /* 10.24px */
  --font-size-sm: 0.8rem;     /* 12.8px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.25rem;    /* 20px */
  --font-size-xl: 1.563rem;   /* 25px */
  --font-size-2xl: 1.953rem;  /* 31.25px */
  --font-size-3xl: 2.441rem;  /* 39px */
  --font-size-4xl: 3.052rem;  /* 48.83px */
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Font Families */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

/* 2. Typography Utility Classes */
.heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em; /* Tighten tracking for large text */
}

.heading-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-bold);
  line-height: var(--line-height-tight);
}

.body-text {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  max-width: 65ch; /* Optimal line length for readability */
}

.small-text {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}
```

**Typography best practices:**
- Line length: 45-75 characters (optimal: 65ch)
- Line height: 1.5-1.75 for body text, 1.25 for headings
- Font size: ≥16px for body text (mobile)
- Contrast: ≥4.5:1 for normal text, ≥3:1 for large (18px+)
- System fonts: Reduce font loading time

See: references/typography-systems.md for complete scales

### Step 3: Performance Optimization

**Core Web Vitals targets:**
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1

**Checklist:**

```html
<!-- 1. Critical CSS inline (above-the-fold styles) -->
<style>
  /* Critical path CSS here */
  .hero { /* styles */ }
  .nav { /* styles */ }
</style>

<!-- 2. Defer non-critical CSS -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>

<!-- 3. Optimize images -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description" loading="lazy" width="800" height="600">
</picture>

<!-- 4. Preconnect to required origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- 5. Defer JavaScript -->
<script src="main.js" defer></script>
<script src="analytics.js" async></script>
```

**Image optimization:**
- Use WebP with JPEG/PNG fallback
- Serve responsive images (`srcset`, `sizes`)
- Lazy load off-screen images (`loading="lazy"`)
- Set explicit width/height (prevent CLS)
- Compress images (TinyPNG, Squoosh)
- Use CDN (Cloudflare, Cloudinary)

**Font loading:**
```css
/* Use font-display: swap to prevent FOIT (Flash of Invisible Text) */
@font-face {
  font-family: 'Custom Font';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}
```

Run: `scripts/performance-audit.js <url>` to check Web Vitals

See: references/performance-checklist.md

### Step 4: Modern CSS Techniques

**CSS Grid for Layouts:**

```css
/* Holy Grail Layout (header, sidebar, main, footer) */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Responsive: Stack on mobile */
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

**Flexbox for Components:**

```css
/* Card with auto-expanding content */
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header { flex-shrink: 0; }
.card-body { flex: 1; } /* Expands to fill */
.card-footer { flex-shrink: 0; }

/* Centering (horizontal + vertical) */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**Custom Properties (CSS Variables):**

```css
/* Theme system with CSS variables */
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  
  /* Spacing (8px base) */
  --space-1: 0.5rem;  /* 8px */
  --space-2: 1rem;    /* 16px */
  --space-3: 1.5rem;  /* 24px */
  --space-4: 2rem;    /* 32px */
  --space-6: 3rem;    /* 48px */
  --space-8: 4rem;    /* 64px */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark mode */
[data-theme="dark"] {
  --color-primary: #3b82f6;
  --color-background: #1f2937;
  --color-text: #f9fafb;
}

/* Usage */
.button {
  background: var(--color-primary);
  padding: var(--space-2) var(--space-4);
  box-shadow: var(--shadow-md);
}
```

**Container Queries (Modern Alternative to Media Queries):**

```css
/* Component responds to container width, not viewport */
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  padding: 1rem;
}

/* When container is >500px wide */
@container card (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    padding: 2rem;
  }
}
```

See: references/css-patterns.md for advanced techniques

### Step 5: Accessibility (WCAG 2.2 AA)

**Semantic HTML:**

```html
<!-- ✅ DO: Use semantic elements -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2025 Company</p>
</footer>

<!-- ❌ AVOID: Divs for everything -->
<div class="header">
  <div class="nav">...</div>
</div>
```

**ARIA when needed:**

```html
<!-- Skip link (first focusable element) -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Live region for dynamic content -->
<div role="status" aria-live="polite" aria-atomic="true">
  Form submitted successfully
</div>

<!-- Tab interface -->
<div role="tablist" aria-label="Settings tabs">
  <button role="tab" aria-selected="true" aria-controls="panel-1">
    General
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">
    Privacy
  </button>
</div>
<div role="tabpanel" id="panel-1">General settings...</div>
<div role="tabpanel" id="panel-2" hidden>Privacy settings...</div>
```

**Focus management:**

```css
/* Visible focus indicator */
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove outline for mouse clicks */
:focus:not(:focus-visible) {
  outline: none;
}
```

Run: `scripts/a11y-audit.js <url>` for automated testing

See: references/accessibility-guide.md

## Design Systems

**Token-based design system:**

```css
/* Design tokens (single source of truth) */
:root {
  /* Color palette */
  --blue-50: #eff6ff;
  --blue-100: #dbeafe;
  --blue-500: #3b82f6;
  --blue-900: #1e3a8a;
  
  /* Semantic tokens (mapped to palette) */
  --color-primary: var(--blue-500);
  --color-primary-hover: var(--blue-600);
  --color-background: white;
  --color-surface: var(--blue-50);
  
  /* Spacing scale (4px base) */
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem;  /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem;    /* 16px */
  --space-6: 1.5rem;  /* 24px */
  --space-8: 2rem;    /* 32px */
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;
  
  /* Animation */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

**Component library structure:**

```
/design-system
├── tokens/
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   └── shadows.css
├── components/
│   ├── button.css
│   ├── card.css
│   ├── input.css
│   └── modal.css
├── layouts/
│   ├── grid.css
│   ├── container.css
│   └── stack.css
└── utilities/
    ├── text.css
    ├── spacing.css
    └── display.css
```

See: references/design-system-guide.md

## Animation Best Practices

```css
/* Use transform/opacity for 60fps animations */
.button {
  transition: transform var(--transition-base),
              opacity var(--transition-base);
}

.button:hover {
  transform: translateY(-2px); /* GPU-accelerated */
  opacity: 0.9;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Complex animations */
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-enter {
  animation: slide-in 300ms ease-out;
}
```

## Browser Compatibility

**Use progressive enhancement:**

```css
/* Base styles (all browsers) */
.grid {
  display: block;
}

.grid-item {
  margin-bottom: 1rem;
}

/* Enhanced with Grid (modern browsers) */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .grid-item {
    margin-bottom: 0;
  }
}
```

**Vendor prefixes (use Autoprefixer):**

```css
/* Autoprefixer will add vendor prefixes automatically */
.box {
  display: flex;
  user-select: none;
}

/* Compiles to: */
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
```

## Quality Gates

Before launching:

- [ ] Mobile-responsive (tested 320px-1920px)
- [ ] Performance (LCP <2.5s, CLS <0.1, FID <100ms)
- [ ] Accessibility (WCAG 2.2 AA, axe audit passed)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] SEO (meta tags, structured data, sitemap)
- [ ] Images optimized (<100KB, WebP + fallback)
- [ ] Fonts optimized (font-display: swap, subset)
- [ ] Critical CSS inline (<14KB gzipped)
- [ ] JavaScript deferred/async
- [ ] No console errors
- [ ] Lighthouse score ≥90 (all categories)

Run: `scripts/pre-launch-audit.js <url>` for automated checks

## Bundled Resources

- **scripts/performance-audit.js** - Lighthouse CI integration
- **scripts/a11y-audit.js** - Automated WCAG 2.2 testing
- **scripts/pre-launch-audit.js** - Comprehensive pre-launch checklist
- **scripts/generate-css-tokens.js** - Design token generator (Figma → CSS)
- **references/responsive-patterns.md** - Grid systems, breakpoints (30+ patterns)
- **references/typography-systems.md** - Type scales, font pairing (15+ systems)
- **references/css-patterns.md** - Advanced CSS techniques (50+ patterns)
- **references/performance-checklist.md** - Complete optimization guide
- **references/accessibility-guide.md** - WCAG 2.2 implementation
- **references/design-system-guide.md** - Token-based design systems
- **references/app-patterns.md** - Web app layouts (dashboards, admin panels)
- **references/ecommerce-patterns.md** - Product pages, checkout flows
- **references/dashboard-patterns.md** - Data visualization layouts
- **references/seo-checklist.md** - Technical SEO best practices
- **assets/boilerplates/** - HTML/CSS starter templates
