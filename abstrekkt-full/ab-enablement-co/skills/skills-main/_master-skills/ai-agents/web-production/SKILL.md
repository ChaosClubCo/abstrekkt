---
name: web-production
description: Master web content production with HTML/CSS development, CMS management, publishing workflows, and quality assurance for digital platforms. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Web Production Skill

## Instructions


> Master web content production with HTML/CSS development, CMS management, publishing workflows, and quality assurance for digital platforms.

## Skill Overview

This skill provides expertise in producing web content from design to deployment. It covers front-end development, CMS operations, publishing workflows, and technical optimization.

## Core Capabilities

### HTML/CSS Development
- Semantic markup
- Responsive CSS
- Component development
- Cross-browser compatibility
- Performance optimization
- Accessibility implementation

### CMS Management
- Content architecture
- Template management
- Workflow configuration
- User management
- Plugin administration
- Version control

### Publishing Workflows
- Content staging
- Review processes
- Deployment procedures
- Rollback protocols
- Scheduling systems
- Quality gates

## Front-End Development

### HTML Structure Standards
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description for SEO">
  <title>Page Title | Brand Name</title>

  <!-- Preconnect to external resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">

  <!-- Critical CSS inline -->
  <style>
    /* Above-the-fold critical styles */
  </style>

  <!-- Main stylesheet -->
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <!-- Skip navigation for accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Header -->
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Navigation content -->
    </nav>
  </header>

  <!-- Main content -->
  <main id="main-content" role="main">
    <article>
      <h1>Page Heading</h1>
      <!-- Page content -->
    </article>
  </main>

  <!-- Footer -->
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>

  <!-- Scripts at end of body -->
  <script src="/js/main.js" defer></script>
</body>
</html>
```

### CSS Architecture
```yaml
css_methodology:
  approach: "BEM with utility classes"

  naming_convention:
    block: ".card"
    element: ".card__title"
    modifier: ".card--featured"

  file_structure:
    /css
    ├── /base
    │   ├── _reset.css
    │   ├── _typography.css
    │   └── _variables.css
    ├── /components
    │   ├── _buttons.css
    │   ├── _cards.css
    │   ├── _forms.css
    │   └── _navigation.css
    ├── /layout
    │   ├── _grid.css
    │   ├── _header.css
    │   └── _footer.css
    ├── /utilities
    │   ├── _spacing.css
    │   └── _visibility.css
    └── main.css

  css_variables:
    example: |
      :root {
        /* Colors */
        --color-primary: #0066CC;
        --color-secondary: #333333;
        --color-background: #FFFFFF;
        --color-text: #333333;

        /* Typography */
        --font-family-base: 'Inter', sans-serif;
        --font-size-base: 1rem;
        --line-height-base: 1.5;

        /* Spacing */
        --spacing-xs: 0.5rem;
        --spacing-sm: 1rem;
        --spacing-md: 1.5rem;
        --spacing-lg: 2rem;
        --spacing-xl: 3rem;

        /* Breakpoints */
        --breakpoint-sm: 576px;
        --breakpoint-md: 768px;
        --breakpoint-lg: 992px;
        --breakpoint-xl: 1200px;
      }
```

### Responsive Design Patterns
```css
/* Mobile-first approach */

/* Base styles (mobile) */
.container {
  padding: var(--spacing-sm);
  width: 100%;
}

.grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
    max-width: 720px;
    margin: 0 auto;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

## CMS Management

### CMS Platform Comparison
```yaml
cms_platforms:
  wordpress:
    type: "Traditional CMS"
    strengths:
      - Large ecosystem
      - Flexible
      - SEO plugins
      - Community support
    considerations:
      - Security maintenance
      - Performance tuning
      - Plugin management

  contentful:
    type: "Headless CMS"
    strengths:
      - API-first
      - Multi-platform
      - Structured content
      - Developer-friendly
    considerations:
      - Development required
      - Cost at scale
      - Learning curve

  webflow:
    type: "Visual CMS"
    strengths:
      - Design-first
      - No-code publishing
      - Built-in hosting
      - Responsive design
    considerations:
      - Lock-in risk
      - Custom functionality limited
      - Learning curve

  sanity:
    type: "Headless CMS"
    strengths:
      - Real-time collaboration
      - Customizable
      - Portable content
      - Developer experience
    considerations:
      - Setup complexity
      - Cost at scale
```

### Content Architecture
```yaml
content_types:
  page:
    fields:
      - title (text, required)
      - slug (text, auto-generated)
      - meta_description (text, 160 char limit)
      - hero_image (media)
      - content (rich text)
      - sidebar_content (reference)
      - published_date (date)
      - author (reference to author)

  blog_post:
    fields:
      - title (text, required)
      - slug (text, auto-generated)
      - excerpt (text, 200 char)
      - featured_image (media)
      - content (rich text)
      - category (reference)
      - tags (reference, multiple)
      - author (reference)
      - published_date (date)
      - reading_time (calculated)

  component:
    types:
      - hero_banner
      - feature_grid
      - testimonial_carousel
      - cta_section
      - content_block
      - video_embed
      - form_embed
```

### Workflow Configuration
```yaml
publishing_workflow:
  stages:
    draft:
      description: "Work in progress"
      actions:
        - Save draft
        - Preview
        - Submit for review

    in_review:
      description: "Pending approval"
      actions:
        - Approve
        - Request changes
        - Preview

    approved:
      description: "Ready to publish"
      actions:
        - Publish now
        - Schedule
        - Return to draft

    published:
      description: "Live on site"
      actions:
        - Unpublish
        - Create revision
        - Archive

  roles:
    contributor:
      permissions:
        - Create drafts
        - Edit own content
        - Submit for review

    editor:
      permissions:
        - All contributor permissions
        - Approve content
        - Publish content
        - Edit all content

    admin:
      permissions:
        - All editor permissions
        - Manage users
        - Configure workflows
        - Access settings
```

## Publishing Workflows

### Pre-Publish Checklist
```yaml
qa_checklist:
  content:
    - [ ] All copy proofread and approved
    - [ ] Headlines and subheads formatted correctly
    - [ ] Links tested and working
    - [ ] CTAs clear and functional
    - [ ] Meta title and description set
    - [ ] Open Graph tags configured

  media:
    - [ ] Images optimized (compressed, sized)
    - [ ] Alt text on all images
    - [ ] Video embeds working
    - [ ] Image credits/captions if required

  technical:
    - [ ] Page loads correctly (no errors)
    - [ ] Responsive design verified
    - [ ] Cross-browser tested
    - [ ] Mobile navigation works
    - [ ] Forms submit correctly
    - [ ] Analytics tracking verified

  seo:
    - [ ] URL structure correct
    - [ ] H1 tag present (only one)
    - [ ] Internal links included
    - [ ] Canonical URL set
    - [ ] Structured data added

  accessibility:
    - [ ] Keyboard navigation works
    - [ ] Color contrast sufficient
    - [ ] Form labels present
    - [ ] Focus states visible
```

### Deployment Process
```yaml
deployment_workflow:
  staging:
    purpose: "Final testing before production"
    process:
      - Deploy to staging environment
      - Run automated tests
      - Perform manual QA
      - Get stakeholder approval

  production:
    purpose: "Live deployment"
    process:
      - Create backup point
      - Deploy during low-traffic window
      - Run smoke tests
      - Monitor for errors
      - Verify analytics

  rollback:
    triggers:
      - Critical errors detected
      - Major functionality broken
      - Security vulnerability
    process:
      - Revert to previous version
      - Notify stakeholders
      - Document issue
      - Plan fix deployment
```

### Scheduling Best Practices
```yaml
scheduling:
  optimal_times:
    blog_posts: "Tuesday-Thursday, 9am-11am"
    product_updates: "Tuesday, 10am"
    news_announcements: "Weekdays, morning"

  coordination:
    - Check marketing calendar
    - Align with campaign launches
    - Avoid conflicting announcements
    - Consider time zones

  buffer_time:
    minimum: "2 hours before required live time"
    recommended: "24 hours"
    reason: "Allow for unexpected issues"
```

## Performance Optimization

### Page Speed Best Practices
```yaml
optimization_techniques:
  images:
    - Use modern formats (WebP, AVIF)
    - Implement lazy loading
    - Serve responsive images
    - Compress appropriately
    - Use CDN for delivery

  css:
    - Minimize CSS files
    - Remove unused CSS
    - Inline critical CSS
    - Defer non-critical CSS
    - Use efficient selectors

  javascript:
    - Minimize and bundle
    - Defer non-essential scripts
    - Use async loading
    - Remove unused code
    - Optimize execution

  caching:
    - Set cache headers
    - Use browser caching
    - Implement CDN caching
    - Version static assets

  server:
    - Enable compression (gzip/brotli)
    - Use HTTP/2
    - Optimize server response
    - Consider edge delivery
```

### Core Web Vitals
```yaml
core_web_vitals:
  lcp:
    metric: "Largest Contentful Paint"
    target: "<2.5 seconds"
    optimization:
      - Optimize hero images
      - Preload key resources
      - Improve server response

  fid:
    metric: "First Input Delay"
    target: "<100 milliseconds"
    optimization:
      - Minimize JavaScript
      - Break up long tasks
      - Use web workers

  cls:
    metric: "Cumulative Layout Shift"
    target: "<0.1"
    optimization:
      - Set image dimensions
      - Reserve space for dynamic content
      - Avoid inserting content above existing
```

## Quality Assurance

### Browser Testing Matrix
```yaml
browser_testing:
  priority_1:
    - Chrome (latest)
    - Safari (latest)
    - Firefox (latest)
    - Edge (latest)
    - Safari iOS (latest)
    - Chrome Android (latest)

  priority_2:
    - Chrome (latest - 1)
    - Safari (latest - 1)
    - Firefox ESR
    - Samsung Internet

  testing_approach:
    automated:
      - Functional testing
      - Visual regression
      - Accessibility checks

    manual:
      - Interactive elements
      - Complex animations
      - Critical user flows
```

### Testing Tools
```yaml
testing_tools:
  performance:
    - Google Lighthouse
    - WebPageTest
    - GTmetrix
    - Chrome DevTools

  accessibility:
    - axe DevTools
    - WAVE
    - Pa11y
    - VoiceOver/NVDA

  cross_browser:
    - BrowserStack
    - LambdaTest
    - CrossBrowserTesting

  visual:
    - Percy
    - Chromatic
    - BackstopJS
```

## Integration Points

### Related Skills
- `accessibility-design` - WCAG compliance
- `image-optimization` - Image handling
- `html-email` - Email templates
- `template-systems` - Component systems

### System Integrations
```yaml
integrations:
  version_control:
    - Git workflows
    - Branch strategies
    - CI/CD pipelines

  dam_systems:
    - Asset sync
    - Image optimization
    - CDN integration

  analytics:
    - Google Analytics
    - Tag management
    - Event tracking
```

## Success Metrics

### Web Production KPIs
```yaml
metrics:
  quality:
    - Browser issue rate
    - Accessibility compliance
    - Performance scores

  efficiency:
    - Time to publish
    - Revision cycles
    - Deployment success rate

  performance:
    - Page load times
    - Core Web Vitals
    - Error rates
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Web Team | Initial skill creation |

---

*Use this skill to produce high-quality web content that performs well, renders consistently, and meets accessibility standards.*
