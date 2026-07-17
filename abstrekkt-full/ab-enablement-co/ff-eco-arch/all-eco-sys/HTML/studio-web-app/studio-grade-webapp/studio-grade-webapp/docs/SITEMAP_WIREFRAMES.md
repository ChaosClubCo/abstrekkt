# Sitemap & Wireframe Specifications

**Purpose:** Complete information architecture with accessibility-first wireframes  
**Compliance:** WCAG 2.2 Level AAA, semantic HTML5  
**Navigation:** Skip-to-content, breadcrumbs, logical tab order

---

## Information Architecture

### Site Hierarchy

```
/ (Home)
├── /about
├── /services
│   ├── /services/web-development
│   ├── /services/mobile-apps
│   └── /services/consulting
├── /portfolio
│   ├── /portfolio/project-alpha
│   ├── /portfolio/project-beta
│   └── /portfolio/project-gamma
├── /blog
│   ├── /blog/post-1
│   ├── /blog/post-2
│   └── /blog/category/design
└── /contact

/privacy
/terms
/cookies
/accessibility
/sitemap.xml
/robots.txt
/404
/500
```

### URL Structure Rules

**Format:** `/{locale}/{slug}` (locale optional for default `en`)

**Examples:**
- English: `/about`, `/blog/my-post`
- Spanish: `/es/about`, `/es/blog/my-post`
- French: `/fr/about`, `/fr/blog/my-post`

**Slug Rules:**
- Lowercase only
- Hyphens for spaces
- No special characters
- Max 60 characters
- Descriptive (avoid `/page1`, use `/web-development`)

**Canonical:**
- Self-referencing canonical on all pages
- Cross-locale canonical: `<link rel="alternate" hreflang="es" href="/es/about">`

---

## Page-by-Page Specifications

### 1. Homepage (`/`)

**Purpose:** Convert visitors, communicate value proposition  
**Template Type:** Landing page  
**SEO Priority:** High

#### SEO Structure

```html
<!-- Head -->
<title>FlashFusion Studio | Enterprise Web & Mobile Development</title>
<meta name="description" content="Studio-grade web applications with Next.js, React, and modern architecture. WCAG AAA accessible, SEO-optimized, security-first development." />

<!-- JSON-LD: Organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FlashFusion Studio",
  "url": "https://flashfusion.com",
  "logo": "https://flashfusion.com/logo.png",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Innovation Way",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94105",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-415-555-0100",
    "contactType": "Customer Service",
    "email": "hello@flashfusion.com"
  },
  "sameAs": [
    "https://www.linkedin.com/company/flashfusion",
    "https://twitter.com/flashfusion",
    "https://github.com/flashfusion"
  ]
}
</script>

<!-- JSON-LD: WebSite with SearchAction -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://flashfusion.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://flashfusion.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

#### Heading Structure

```html
<header>
  <!-- Skip to content (visible on focus) -->
  <a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>
  
  <!-- Nav: H-level exempt -->
  <nav aria-label="Primary navigation">...</nav>
</header>

<main id="main-content">
  <!-- Hero Section -->
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">
      Studio-Grade Web Applications for Modern Enterprises
    </h1>
    <h2>
      Next.js, React, and security-first architecture. WCAG AAA accessible, SEO-optimized, lightning-fast.
    </h2>
  </section>

  <!-- Benefits Section -->
  <section aria-labelledby="benefits-heading">
    <h2 id="benefits-heading">Why Choose FlashFusion</h2>
    <div>
      <article>
        <h3>Performance First</h3>
        <p>Lighthouse 98+ scores, <2.5s LCP, <0.1 CLS</p>
      </article>
      <article>
        <h3>Security Hardened</h3>
        <p>CSP Level 3, HSTS, WebAuthn, rate limiting</p>
      </article>
      <article>
        <h3>Accessibility Excellence</h3>
        <p>WCAG 2.2 AAA compliant, screen reader tested</p>
      </article>
    </div>
  </section>

  <!-- Social Proof Section -->
  <section aria-labelledby="testimonials-heading">
    <h2 id="testimonials-heading">Trusted by Leading Companies</h2>
    <!-- Testimonials carousel -->
  </section>

  <!-- FAQ Section -->
  <section aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently Asked Questions</h2>
    <!-- Accordion with FAQPage JSON-LD -->
  </section>

  <!-- CTA Section -->
  <section aria-labelledby="cta-heading">
    <h2 id="cta-heading">Ready to Build Something Amazing?</h2>
    <a href="/contact" class="btn-primary">Start Your Project</a>
  </section>
</main>
```

#### Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Sticky)                                             │
│ [Skip to content] Logo  [Home] [About] [Services] [Contact]│
│ [Language: EN ▼] [Theme Toggle]                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ HERO (Above Fold, 100vh)                                    │
│ ┌────────────────────┬──────────────────────────────────┐   │
│ │ H1: Studio-Grade   │                                  │   │
│ │ Web Applications   │   [Hero Image/Video]             │   │
│ │                    │   (Lazy-loaded, WebP/AVIF)       │   │
│ │ H2: Subheadline    │                                  │   │
│ │                    │   Trust Badges:                  │   │
│ │ [Primary CTA]      │   [WCAG AAA] [SOC2] [99.9%]     │   │
│ │ [Secondary CTA]    │                                  │   │
│ └────────────────────┴──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FEATURES (Below Fold)                                       │
│ H2: Why Choose FlashFusion                                  │
│                                                             │
│ ┌──────────┬──────────┬──────────┬──────────┐              │
│ │ Icon     │ Icon     │ Icon     │ Icon     │              │
│ │ H3: Perf │ H3: Sec  │ H3: A11y │ H3: SEO  │              │
│ │ 2-line   │ 2-line   │ 2-line   │ 2-line   │              │
│ │ summary  │ summary  │ summary  │ summary  │              │
│ └──────────┴──────────┴──────────┴──────────┘              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CASE STUDIES (Carousel, swipe + keyboard)                   │
│ H2: Projects We've Built                                    │
│                                                             │
│ ◀ [Project 1 Screenshot] [Project 2 Screenshot] [Proj 3] ▶ │
│   H3: Project Name       H3: Project Name                   │
│   2-line description     2-line description                 │
│   [View Case Study →]    [View Case Study →]               │
│                                                             │
│ ● ○ ○ (Pagination dots, aria-label="Slide 1 of 3")        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TESTIMONIALS (Stripe, auto-scroll paused on focus)          │
│ H2: What Clients Say                                        │
│                                                             │
│ "Quote from client about results achieved..."               │
│ — Jane Doe, CEO, Acme Corp                                 │
│ ⭐⭐⭐⭐⭐                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FAQ (Accordion, expand-all button)                          │
│ H2: Frequently Asked Questions                              │
│                                                             │
│ ▶ How long does a project take? (Button, aria-expanded)    │
│ ▼ What technologies do you use?                            │
│   Answer: We use Next.js 14, React, TypeScript...          │
│ ▶ Do you offer ongoing support?                            │
│                                                             │
│ <!-- FAQPage JSON-LD -->                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CTA BANNER (Contrast bg, centered)                          │
│ H2: Ready to Build Something Amazing?                       │
│ Subheadline: Get a free consultation and project estimate   │
│                                                             │
│              [Start Your Project →]                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Footer (Multi-column)                                       │
│ ┌──────────┬──────────┬──────────┬──────────┐              │
│ │ Company  │ Services │ Resources│ Legal    │              │
│ │ About    │ Web Dev  │ Blog     │ Privacy  │              │
│ │ Team     │ Mobile   │ Docs     │ Terms    │              │
│ │ Careers  │ Consult  │ Support  │ Cookies  │              │
│ └──────────┴──────────┴──────────┴──────────┘              │
│                                                             │
│ Social: [LinkedIn] [Twitter] [GitHub]                      │
│ © 2025 FlashFusion Studio. All rights reserved.            │
└─────────────────────────────────────────────────────────────┘
```

#### Accessibility Annotations

- **Skip Link:** First focusable element, visible on `:focus`
- **Landmarks:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` with `aria-labelledby`
- **Headings:** Logical order (H1 → H2 → H3), no skips
- **Images:** `alt` text for content, `alt=""` for decorative
- **Carousel:** Keyboard controls (left/right arrows), pause button, `aria-live="polite"`
- **Accordion:** `aria-expanded`, `aria-controls`, unique IDs
- **Color:** 7:1 contrast ratio (AAA), not sole indicator

#### Performance Optimizations

- **Hero Image:** `priority` flag, preload
- **Other Images:** `loading="lazy"`, `decoding="async"`
- **Fonts:** `font-display: swap`, preconnect to font CDN
- **Critical CSS:** Inline above-fold styles
- **JavaScript:** Defer non-critical scripts

---

### 2. About Page (`/about`)

**Purpose:** Build trust, share company story  
**Template Type:** Content page  
**SEO Priority:** Medium

#### SEO Structure

```html
<title>About FlashFusion Studio | Our Mission & Team</title>
<meta name="description" content="Learn about FlashFusion Studio's mission to build studio-grade web applications. Meet our team of experts in Next.js, React, and modern web architecture." />

<!-- JSON-LD: Organization (reuse from homepage) -->
```

#### Heading Structure

```html
<main id="main-content">
  <h1>About FlashFusion Studio</h1>

  <section aria-labelledby="mission-heading">
    <h2 id="mission-heading">Our Mission</h2>
    <p>Building studio-grade web applications...</p>
  </section>

  <section aria-labelledby="team-heading">
    <h2 id="team-heading">Meet the Team</h2>
    <div>
      <article>
        <img src="/team/jane.jpg" alt="Jane Doe, CEO" />
        <h3>Jane Doe</h3>
        <p>CEO & Co-Founder</p>
      </article>
      <!-- More team members -->
    </div>
  </section>

  <section aria-labelledby="timeline-heading">
    <h2 id="timeline-heading">Our Journey</h2>
    <ol>
      <li>
        <h3>2020: Founded</h3>
        <p>Started with a vision...</p>
      </li>
      <li>
        <h3>2022: Series A</h3>
        <p>Raised $5M to expand...</p>
      </li>
      <!-- More milestones -->
    </ol>
  </section>
</main>
```

#### Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Home > About                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H1: About FlashFusion Studio                                │
│                                                             │
│ Lead paragraph (larger text, 1.25x)                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H2: Our Mission                                             │
│ ┌────────────────────┬──────────────────────────────────┐   │
│ │ Mission text       │ [Mission Image/Video]            │   │
│ │ (2-3 paragraphs)   │                                  │   │
│ └────────────────────┴──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H2: Meet the Team                                           │
│                                                             │
│ ┌──────────┬──────────┬──────────┬──────────┐              │
│ │ [Photo]  │ [Photo]  │ [Photo]  │ [Photo]  │              │
│ │ H3: Name │ H3: Name │ H3: Name │ H3: Name │              │
│ │ Title    │ Title    │ Title    │ Title    │              │
│ │ [LinkedIn│ [LinkedIn│ [LinkedIn│ [LinkedIn│              │
│ └──────────┴──────────┴──────────┴──────────┘              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H2: Our Journey (Timeline)                                  │
│                                                             │
│ ● 2020: Founded                                            │
│ │ H3: The Beginning                                         │
│ │ Started with a vision to build...                         │
│ │                                                           │
│ ● 2022: Series A                                           │
│ │ H3: Growth Phase                                          │
│ │ Raised $5M to expand team...                             │
│ │                                                           │
│ ● 2025: Present Day                                        │
│   H3: Leading the Industry                                  │
│   Serving 100+ clients...                                   │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Services Page (`/services`)

**Purpose:** Showcase offerings, drive conversions  
**Template Type:** Service catalog  
**SEO Priority:** High

#### SEO Structure

```html
<title>Services | Web Development, Mobile Apps, Consulting</title>
<meta name="description" content="FlashFusion Studio offers enterprise web development, mobile apps, and consulting services. Next.js, React, TypeScript, and modern architecture." />

<!-- JSON-LD: Service (per service) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Web Development",
  "provider": {
    "@type": "Organization",
    "name": "FlashFusion Studio"
  },
  "areaServed": "Worldwide",
  "description": "Custom web application development using Next.js, React, and TypeScript.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "Starting at $25,000"
  }
}
</script>
```

#### Heading Structure

```html
<main id="main-content">
  <h1>Services</h1>

  <section aria-labelledby="web-dev-heading">
    <h2 id="web-dev-heading">Web Development</h2>
    <p>Custom web applications...</p>

    <h3>Key Features</h3>
    <ul>
      <li>Next.js 14 with App Router</li>
      <li>React Server Components</li>
      <li>TypeScript for type safety</li>
    </ul>

    <h3>Pricing</h3>
    <p>Starting at $25,000</p>
  </section>

  <section aria-labelledby="mobile-heading">
    <h2 id="mobile-heading">Mobile Apps</h2>
    <!-- Similar structure -->
  </section>

  <section aria-labelledby="consulting-heading">
    <h2 id="consulting-heading">Consulting</h2>
    <!-- Similar structure -->
  </section>
</main>
```

#### Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Home > Services                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H1: Services                                                │
│ Lead: Expert development services for modern enterprises     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Tabs (aria-controls, keyboard navigation)                   │
│ [All] [Web Dev] [Mobile] [Consulting]                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Service Cards (Grid, 2 columns on tablet, 3 on desktop)     │
│                                                             │
│ ┌────────────────────┬──────────────────────────────────┐   │
│ │ [Icon]             │ [Icon]                           │   │
│ │ H2: Web Development│ H2: Mobile Apps                  │   │
│ │                    │                                  │   │
│ │ 2-line summary     │ 2-line summary                   │   │
│ │                    │                                  │   │
│ │ Features:          │ Features:                        │   │
│ │ • Next.js 14       │ • React Native                   │   │
│ │ • TypeScript       │ • iOS & Android                  │   │
│ │ • Tailwind CSS     │ • App Store ready                │   │
│ │                    │                                  │   │
│ │ From $25,000       │ From $40,000                     │   │
│ │                    │                                  │   │
│ │ [Learn More →]     │ [Learn More →]                   │   │
│ └────────────────────┴──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Comparison Table (Responsive, horizontal scroll on mobile)  │
│                                                             │
│ Feature          │ Web Dev │ Mobile  │ Consulting │         │
│ ─────────────────┼─────────┼─────────┼────────────┤         │
│ Timeline         │ 8-12 wk │ 12-16 wk│ Flexible   │         │
│ Team Size        │ 3-5     │ 4-6     │ 1-2        │         │
│ Support Included │ 3 months│ 6 months│ N/A        │         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CTA: Ready to Start Your Project?                           │
│ [Get a Free Consultation →]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Portfolio Page (`/portfolio`)

**Purpose:** Showcase work, demonstrate expertise  
**Template Type:** Filterable grid  
**SEO Priority:** Medium

#### SEO Structure

```html
<title>Portfolio | Web & Mobile Projects by FlashFusion Studio</title>
<meta name="description" content="View our portfolio of studio-grade web applications and mobile apps built with Next.js, React, and modern architecture." />
```

#### Heading Structure

```html
<main id="main-content">
  <h1>Portfolio</h1>

  <section aria-labelledby="filters-heading">
    <h2 id="filters-heading" class="sr-only">Filter Projects</h2>
    <!-- Filters -->
  </section>

  <section aria-labelledby="projects-heading">
    <h2 id="projects-heading" class="sr-only">Project Gallery</h2>
    
    <article>
      <img src="/portfolio/project-alpha.jpg" alt="Project Alpha dashboard screenshot" />
      <h3>Project Alpha</h3>
      <p>E-commerce platform with Next.js...</p>
      <a href="/portfolio/project-alpha">View Case Study →</a>
    </article>
    <!-- More projects -->
  </section>
</main>
```

#### Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Home > Portfolio                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H1: Portfolio                                               │
│ Lead: Studio-grade projects for leading companies           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Filters (Buttons with aria-pressed, keyboard accessible)    │
│ [All] [Web App] [Mobile] [E-commerce] [SaaS]               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Masonry Grid (aspect-ratio preserved, lazy load)            │
│                                                             │
│ ┌────────────┬────────────┬────────────┐                    │
│ │ [Image]    │ [Image]    │ [Image]    │                    │
│ │            │            │            │                    │
│ │ H3: Proj A │ H3: Proj B │ H3: Proj C │                    │
│ │ 2-line     │ 2-line     │ 2-line     │                    │
│ │ [View →]   │ [View →]   │ [View →]   │                    │
│ └────────────┴────────────┴────────────┘                    │
│                                                             │
│ ┌────────────┬────────────┬────────────┐                    │
│ │ [Image]    │ [Image]    │ [Image]    │                    │
│ │ (taller)   │            │            │                    │
│ │            │ H3: Proj E │ H3: Proj F │                    │
│ │ H3: Proj D │ 2-line     │ 2-line     │                    │
│ │ 2-line     │ [View →]   │ [View →]   │                    │
│ │ [View →]   │            │            │                    │
│ └────────────┴────────────┴────────────┘                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Load More (Infinite scroll with manual trigger)             │
│ [Load More Projects] (Button, not auto-scroll)              │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Blog Page (`/blog`)

**Purpose:** Share knowledge, drive organic traffic  
**Template Type:** Article listing  
**SEO Priority:** High

#### SEO Structure

```html
<title>Blog | Web Development Insights from FlashFusion Studio</title>
<meta name="description" content="Expert insights on Next.js, React, TypeScript, web performance, accessibility, and modern web development best practices." />
```

#### Heading Structure (Listing)

```html
<main id="main-content">
  <h1>Blog</h1>

  <section aria-labelledby="latest-heading">
    <h2 id="latest-heading">Latest Posts</h2>
    
    <article>
      <img src="/blog/post-1-cover.jpg" alt="" />
      <h3>
        <a href="/blog/post-1">How to Optimize Next.js 14 for Core Web Vitals</a>
      </h3>
      <p>Learn techniques to achieve LCP <2.5s...</p>
      <div>
        <time datetime="2025-11-15">Nov 15, 2025</time>
        <span>5 min read</span>
        <span>By Jane Doe</span>
      </div>
    </article>
    <!-- More posts -->
  </section>

  <aside aria-labelledby="categories-heading">
    <h2 id="categories-heading">Categories</h2>
    <ul>
      <li><a href="/blog/category/performance">Performance</a></li>
      <li><a href="/blog/category/accessibility">Accessibility</a></li>
      <!-- More categories -->
    </ul>
  </aside>
</main>
```

#### Heading Structure (Post)

```html
<main id="main-content">
  <article>
    <header>
      <h1>How to Optimize Next.js 14 for Core Web Vitals</h1>
      <div>
        <time datetime="2025-11-15">Published Nov 15, 2025</time>
        <span>By Jane Doe</span>
        <span>5 min read</span>
      </div>
    </header>

    <!-- Table of Contents (sticky) -->
    <aside aria-labelledby="toc-heading">
      <h2 id="toc-heading">Table of Contents</h2>
      <nav>
        <ul>
          <li><a href="#intro">Introduction</a></li>
          <li><a href="#lcp">Largest Contentful Paint</a></li>
          <li><a href="#cls">Cumulative Layout Shift</a></li>
          <!-- More sections -->
        </ul>
      </nav>
    </aside>

    <!-- Content -->
    <div>
      <section id="intro">
        <h2>Introduction</h2>
        <p>Core Web Vitals are...</p>
      </section>

      <section id="lcp">
        <h2>Largest Contentful Paint (LCP)</h2>
        <p>LCP measures...</p>

        <h3>Optimization Techniques</h3>
        <ul>
          <li>Preload critical images</li>
          <li>Use Next/Image with priority</li>
        </ul>
      </section>

      <!-- More sections -->
    </div>

    <footer>
      <h2>Share This Post</h2>
      <!-- Share buttons -->

      <nav aria-label="Adjacent posts">
        <a href="/blog/previous-post">← Previous Post</a>
        <a href="/blog/next-post">Next Post →</a>
      </nav>
    </footer>
  </article>
</main>

<!-- JSON-LD: Article -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How to Optimize Next.js 14 for Core Web Vitals",
  "image": "https://flashfusion.com/blog/post-1-cover.jpg",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "FlashFusion Studio",
    "logo": {
      "@type": "ImageObject",
      "url": "https://flashfusion.com/logo.png"
    }
  },
  "datePublished": "2025-11-15",
  "dateModified": "2025-11-15",
  "description": "Learn techniques to achieve LCP <2.5s..."
}
</script>

<!-- JSON-LD: BreadcrumbList -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://flashfusion.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://flashfusion.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "How to Optimize Next.js 14 for Core Web Vitals",
      "item": "https://flashfusion.com/blog/post-1"
    }
  ]
}
</script>
```

#### Wireframe Layout (Post)

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Home > Blog > Post Title                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Article Header                                              │
│ H1: How to Optimize Next.js 14 for Core Web Vitals          │
│                                                             │
│ By Jane Doe | Nov 15, 2025 | 5 min read                    │
│ [Performance] [Next.js] (Category tags)                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [Cover Image, full-width, aspect-ratio 16:9]                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ┌──────────────┬──────────────────────────────────────────┐ │
│ │ TOC (Sticky) │ Article Content                          │ │
│ │              │                                          │ │
│ │ H2: Contents │ H2: Introduction                         │ │
│ │              │ <p>Core Web Vitals are...</p>           │ │
│ │ • Intro      │                                          │ │
│ │ • LCP        │ H2: Largest Contentful Paint            │ │
│ │ • CLS        │ <p>LCP measures...</p>                  │ │
│ │ • INP        │                                          │ │
│ │ • Conclusion │ H3: Optimization Techniques             │ │
│ │              │ <ul><li>Preload...</li></ul>            │ │
│ │ (Auto-expand │                                          │ │
│ │  on scroll)  │ [Code Example]                          │ │
│ │              │                                          │ │
│ │              │ H2: Cumulative Layout Shift             │ │
│ │              │ <p>CLS measures...</p>                  │ │
│ │              │                                          │ │
│ │              │ <!-- More sections -->                   │ │
│ └──────────────┴──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Article Footer                                              │
│                                                             │
│ Share: [Twitter] [LinkedIn] [Copy Link] (Native Share API) │
│                                                             │
│ ┌───────────────────────────┬─────────────────────────────┐ │
│ │ ← Previous Post           │ Next Post →                 │ │
│ │ Understanding INP         │ WCAG 2.2 AAA Checklist      │ │
│ └───────────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Contact Page (`/contact`)

**Purpose:** Capture leads, provide support  
**Template Type:** Form page  
**SEO Priority:** Medium

#### SEO Structure

```html
<title>Contact FlashFusion Studio | Get a Free Consultation</title>
<meta name="description" content="Contact FlashFusion Studio for web development, mobile apps, or consulting. Get a free consultation and project estimate." />
```

#### Heading Structure

```html
<main id="main-content">
  <h1>Contact Us</h1>

  <div>
    <!-- Contact Details -->
    <section aria-labelledby="details-heading">
      <h2 id="details-heading">Get in Touch</h2>
      <dl>
        <dt>Email</dt>
        <dd><a href="mailto:hello@flashfusion.com">hello@flashfusion.com</a></dd>

        <dt>Phone</dt>
        <dd><a href="tel:+14155550100">+1 (415) 555-0100</a></dd>

        <dt>Office Hours</dt>
        <dd>Mon-Fri, 9 AM - 5 PM PST</dd>
      </dl>

      <!-- Static Map -->
      <img src="/map-static.png" alt="Map showing office at 123 Innovation Way, San Francisco" />
    </section>

    <!-- Contact Form -->
    <section aria-labelledby="form-heading">
      <h2 id="form-heading">Send a Message</h2>
      <form>
        <label for="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          aria-required="true"
          aria-describedby="name-error"
        />
        <span id="name-error" aria-live="polite"></span>

        <label for="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-required="true"
          aria-describedby="email-error"
        />
        <span id="email-error" aria-live="polite"></span>

        <label for="message">Message *</label>
        <textarea
          id="message"
          name="message"
          rows="6"
          required
          aria-required="true"
          aria-describedby="message-error"
        ></textarea>
        <span id="message-error" aria-live="polite"></span>

        <label>
          <input type="checkbox" name="consent" required aria-required="true" />
          I agree to the <a href="/privacy">Privacy Policy</a> *
        </label>

        <!-- Honeypot (hidden) -->
        <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off" />

        <button type="submit">Send Message</button>
      </form>
    </section>
  </div>
</main>
```

#### Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Home > Contact                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H1: Contact Us                                              │
│ Lead: Get in touch for a free consultation                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ┌────────────────────┬──────────────────────────────────┐   │
│ │ Contact Details    │ Contact Form                     │   │
│ │                    │                                  │   │
│ │ H2: Get in Touch   │ H2: Send a Message               │   │
│ │                    │                                  │   │
│ │ Email:             │ Label: Name *                    │   │
│ │ hello@flash...     │ [Input, aria-required]           │   │
│ │                    │ (Error: aria-live="polite")      │   │
│ │ Phone:             │                                  │   │
│ │ +1 (415) 555...    │ Label: Email *                   │   │
│ │                    │ [Input, type=email]              │   │
│ │ Office Hours:      │                                  │   │
│ │ Mon-Fri, 9-5 PST   │ Label: Message *                 │   │
│ │                    │ [Textarea, rows=6]               │   │
│ │ ┌────────────────┐ │                                  │   │
│ │ │ [Static Map]   │ │ [ ] I agree to Privacy Policy * │   │
│ │ │ (Fallback to   │ │                                  │   │
│ │ │  iframe map)   │ │ [Honeypot hidden field]          │   │
│ │ └────────────────┘ │                                  │   │
│ │                    │ [Send Message] (Button)          │   │
│ │                    │                                  │   │
│ │ Social:            │ Success State:                   │   │
│ │ [LinkedIn]         │ ✓ Message sent! We'll reply      │   │
│ │ [Twitter]          │   within 24 hours.               │   │
│ │ [GitHub]           │   [Return to Home]               │   │
│ └────────────────────┴──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Utility Pages

### Privacy Policy (`/privacy`)

```html
<h1>Privacy Policy</h1>
<p>Last updated: Nov 18, 2025</p>

<h2>Information We Collect</h2>
<h3>Personal Data</h3>
<ul>
  <li>Name, email, phone (when you contact us)</li>
  <li>IP address, browser info (analytics)</li>
</ul>

<h2>How We Use Your Data</h2>
<p>We use your data to...</p>

<h2>Data Retention</h2>
<table>
  <tr>
    <th>Data Type</th>
    <th>Retention Period</th>
  </tr>
  <tr>
    <td>Contact form submissions</td>
    <td>2 years</td>
  </tr>
  <tr>
    <td>Analytics data</td>
    <td>26 months (GA4 default)</td>
  </tr>
</table>

<h2>Your Rights (GDPR/CCPA)</h2>
<ul>
  <li>Right to access your data</li>
  <li>Right to deletion</li>
  <li>Right to opt-out of tracking</li>
</ul>

<h2>Contact</h2>
<p>Email: privacy@flashfusion.com</p>
```

### 404 Page (`/404`)

```html
<main id="main-content">
  <h1>404 - Page Not Found</h1>
  <p>The page you're looking for doesn't exist or has been moved.</p>

  <section aria-labelledby="popular-heading">
    <h2 id="popular-heading">Popular Pages</h2>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/portfolio">Portfolio</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </section>

  <section aria-labelledby="search-heading">
    <h2 id="search-heading">Search</h2>
    <form role="search">
      <label for="search-input">Search our site</label>
      <input type="search" id="search-input" name="q" />
      <button type="submit">Search</button>
    </form>
  </section>
</main>
```

---

## Navigation Patterns

### Primary Navigation

```html
<header>
  <!-- Skip Link (always first) -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Logo -->
  <a href="/" aria-label="FlashFusion Studio Home">
    <img src="/logo.svg" alt="FlashFusion Studio" width="180" height="40" />
  </a>

  <!-- Primary Nav -->
  <nav aria-label="Primary navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li>
        <button aria-expanded="false" aria-controls="services-menu">
          Services <span aria-hidden="true">▼</span>
        </button>
        <ul id="services-menu" hidden>
          <li><a href="/services/web-development">Web Development</a></li>
          <li><a href="/services/mobile-apps">Mobile Apps</a></li>
          <li><a href="/services/consulting">Consulting</a></li>
        </ul>
      </li>
      <li><a href="/portfolio">Portfolio</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>

  <!-- Utility Nav -->
  <div>
    <!-- Language Selector -->
    <div>
      <button aria-expanded="false" aria-controls="lang-menu">
        EN <span aria-hidden="true">▼</span>
      </button>
      <ul id="lang-menu" hidden>
        <li><a href="/en" hreflang="en" lang="en">English</a></li>
        <li><a href="/es" hreflang="es" lang="es">Español</a></li>
        <li><a href="/fr" hreflang="fr" lang="fr">Français</a></li>
        <li><a href="/de" hreflang="de" lang="de">Deutsch</a></li>
        <li><a href="/ja" hreflang="ja" lang="ja">日本語</a></li>
      </ul>
    </div>

    <!-- Theme Toggle -->
    <button aria-label="Toggle dark mode" aria-pressed="false">
      <span aria-hidden="true">🌙</span>
    </button>
  </div>

  <!-- Mobile Menu Toggle -->
  <button aria-expanded="false" aria-controls="mobile-menu" class="md:hidden">
    <span class="sr-only">Toggle menu</span>
    <span aria-hidden="true">☰</span>
  </button>
</header>
```

### Breadcrumbs

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/blog">Blog</a></li>
    <li aria-current="page">How to Optimize Next.js 14</li>
  </ol>
</nav>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Columns | Gutter | Margin |
|------------|-------|---------|--------|--------|
| xs | 320px | 4 | 16px | 16px |
| sm | 375px | 4 | 16px | 24px |
| md | 640px | 8 | 24px | 32px |
| lg | 768px | 12 | 24px | 40px |
| xl | 1024px | 12 | 32px | 48px |
| 2xl | 1280px | 12 | 32px | 64px |
| 3xl | 1440px | 12 | 32px | 80px |

**Container:** Max-width 1280px, centered

---

## Tab Order & Keyboard Navigation

### Tab Order Priority

1. Skip-to-content link
2. Logo (home link)
3. Primary navigation
4. Language selector
5. Theme toggle
6. Mobile menu toggle
7. Main content interactive elements
8. Footer links

### Keyboard Shortcuts

- `Tab` / `Shift+Tab` - Navigate forward/backward
- `Enter` / `Space` - Activate buttons/links
- `Escape` - Close modals/dropdowns
- `Arrow keys` - Navigate within menus/carousels
- `/` - Focus search (if search exists)

---

## Gaps & Blind Spots

### Potential UX Issues

1. **Mobile Nav Complexity:** Nested dropdowns may be hard on mobile
   - **Mitigation:** Use accordion pattern, test with real users

2. **Form Error Handling:** Inline errors may be missed by screen readers
   - **Mitigation:** `aria-live="polite"` on error containers, summary at top

3. **Carousel Accessibility:** Auto-play may distract or disorient users
   - **Mitigation:** Pause on focus, provide manual controls, respect `prefers-reduced-motion`

4. **Long Forms:** Contact form may feel daunting
   - **Mitigation:** Multi-step wizard, save progress, clear indication of required fields

### Content Gaps

1. **404 Search:** Search may not work if no search implemented
   - **Mitigation:** Link to sitemap, provide popular links

2. **Blog ToC:** May not update on scroll for long posts
   - **Mitigation:** Intersection Observer to highlight active section

3. **Portfolio Filters:** May not preserve state on reload
   - **Mitigation:** URL query params, localStorage fallback

---

## Next Steps

1. Review wireframes with stakeholders
2. Create high-fidelity mockups in Figma
3. Implement design system tokens (see STYLE_GUIDE.md)
4. Build component library (see components/)
5. Develop pages following wireframes
6. Test accessibility (see test-plan.md)

---

**Version:** 2.0.0  
**Last Updated:** 2025-11-18  
**Next:** [STYLE_GUIDE.md](STYLE_GUIDE.md)
