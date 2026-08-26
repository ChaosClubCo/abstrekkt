---
name: website-optimization
description: Helps build and debug website optimization processes. Improve website performance through UX enhancements, conversion rate optimization, analytics setup, A/B testing, and page speed optimization. Use when improving user experience, increasing conversions, setting up tracking, or diagnosing website performance issues.
---

# Website Optimization

## Overview

Your website is often the first substantive interaction prospects have with your business. Website optimization encompasses the continuous improvement of user experience, conversion rates, and technical performance to maximize business outcomes. For SMBs, even small improvements can significantly impact lead generation and revenue.

Effective website optimization is data-driven and iterative. It starts with understanding user behavior through analytics, identifying friction points, testing hypotheses, and measuring results. This skill covers the full optimization lifecycle from audit to implementation.

## When to Use

**Invoke this skill when:**
- Setting up or auditing website analytics
- Improving conversion rates on key pages
- Diagnosing high bounce rates or low engagement
- Planning A/B tests or experiments
- Optimizing page load speed
- Improving mobile user experience
- Redesigning or updating website sections
- Preparing for increased traffic (campaigns, launches)

**Trigger phrases:**
- "Optimize website"
- "Improve conversion rate"
- "Set up analytics"
- "A/B test"
- "Page speed optimization"
- "UX improvement"

## Core Processes

### 1. Website Audit Framework

#### Comprehensive Site Audit

```markdown
## Website Audit Checklist

### Technical Performance
- [ ] Page load time <3 seconds (mobile and desktop)
- [ ] Core Web Vitals passing (LCP, FID, CLS)
- [ ] Mobile-responsive on all pages
- [ ] HTTPS enabled and properly configured
- [ ] No broken links (internal or external)
- [ ] Proper redirects (no chains, 404 errors handled)
- [ ] XML sitemap current and submitted
- [ ] Robots.txt properly configured
- [ ] Structured data implemented correctly

### SEO Fundamentals
- [ ] Unique title tags on every page (<60 chars)
- [ ] Meta descriptions on every page (<160 chars)
- [ ] H1 tags present and relevant
- [ ] Image alt text on all images
- [ ] Internal linking structure logical
- [ ] Canonical tags properly set
- [ ] No duplicate content issues

### User Experience
- [ ] Clear navigation structure
- [ ] Search functionality (if needed)
- [ ] Consistent design language
- [ ] Readable typography (size, contrast)
- [ ] Forms functional and validated
- [ ] Error messages helpful
- [ ] 404 page useful and branded

### Conversion Elements
- [ ] Clear value proposition above fold
- [ ] Primary CTAs visible and compelling
- [ ] Trust signals present (logos, testimonials, badges)
- [ ] Contact information accessible
- [ ] Forms optimized (minimal fields)
- [ ] Social proof throughout
- [ ] Clear next steps on every page

### Analytics & Tracking
- [ ] Google Analytics 4 installed correctly
- [ ] Goals/conversions configured
- [ ] Event tracking on key interactions
- [ ] Form submission tracking
- [ ] Cross-domain tracking (if needed)
- [ ] Privacy compliance (cookie consent, policies)
```

#### Page-by-Page Analysis

```markdown
## Page Audit Template

### Page: [URL]
**Purpose**: [What this page should accomplish]
**Target Audience**: [Who this page is for]
**Key Action**: [What visitors should do]

### Performance Metrics
| Metric | Current | Benchmark | Gap |
|--------|---------|-----------|-----|
| Page views/month | [X] | [X] | [X] |
| Bounce rate | [X]% | <50% | [X] |
| Avg time on page | [X]s | >60s | [X] |
| Conversion rate | [X]% | [X]% | [X] |
| Exit rate | [X]% | <40% | [X] |

### Above-the-Fold Assessment
- [ ] Clear headline communicating value
- [ ] Relevant imagery/visual
- [ ] Primary CTA visible without scrolling
- [ ] Navigation doesn't overwhelm
- [ ] No competing messages

### Content Assessment
- [ ] Content matches search intent
- [ ] Scannable format (headings, bullets)
- [ ] Appropriate length for purpose
- [ ] Fresh and accurate information
- [ ] Clear, jargon-free language

### Conversion Assessment
- [ ] CTA text action-oriented
- [ ] CTA placement logical (flow)
- [ ] Form visible/accessible
- [ ] Trust signals near conversion point
- [ ] Objection handling present

### Recommendations
| Priority | Issue | Recommendation | Expected Impact |
|----------|-------|----------------|-----------------|
| High | [Issue] | [Action] | [Impact] |
| Medium | [Issue] | [Action] | [Impact] |
| Low | [Issue] | [Action] | [Impact] |
```

### 2. Analytics Setup & Configuration

#### GA4 Implementation

```markdown
## GA4 Setup Checklist

### Basic Setup
- [ ] GA4 property created
- [ ] Data stream configured (web)
- [ ] gtag.js or GTM implementation
- [ ] Realtime reporting confirming data
- [ ] Data retention set appropriately

### Enhanced Measurement
Enable these automatic events:
- [ ] Page views
- [ ] Scrolls (90%)
- [ ] Outbound clicks
- [ ] Site search
- [ ] Video engagement
- [ ] File downloads
- [ ] Form interactions

### Custom Events to Configure
| Event Name | Trigger | Parameters |
|------------|---------|------------|
| form_submit | Form submission | form_name, form_id |
| cta_click | CTA button click | button_text, page_location |
| demo_request | Demo form submit | - |
| pricing_view | Pricing page view | - |
| signup_start | Signup initiated | signup_source |
| signup_complete | Signup finished | - |

### Conversion Events
Mark as conversions:
- [ ] form_submit (lead forms)
- [ ] demo_request
- [ ] signup_complete
- [ ] purchase (if applicable)
- [ ] contact_click

### User Properties
Configure for segmentation:
- user_type (visitor, lead, customer)
- traffic_source_first
- industry (if captured)
- company_size (if captured)

### Google Signals
- [ ] Enable Google signals for demographics
- [ ] Review data thresholds impact
- [ ] Ensure privacy compliance
```

#### Event Tracking Setup

```markdown
## Event Tracking Framework

### Naming Convention
Format: [action]_[object]_[detail]
Examples:
- click_cta_hero
- submit_form_contact
- view_pricing_enterprise
- download_resource_ebook

### Key Events to Track

**Navigation Events**
| Event | Trigger | Parameters |
|-------|---------|------------|
| menu_click | Main nav click | menu_item, destination |
| search_submit | Site search | search_term |
| breadcrumb_click | Breadcrumb navigation | breadcrumb_level |

**Engagement Events**
| Event | Trigger | Parameters |
|-------|---------|------------|
| scroll_depth | 25%, 50%, 75%, 100% | scroll_percentage |
| time_on_page | 30s, 60s, 120s, 300s | time_threshold |
| video_play | Video started | video_name, video_duration |
| video_complete | Video finished | video_name |
| accordion_expand | Expand content | accordion_title |

**Conversion Events**
| Event | Trigger | Parameters |
|-------|---------|------------|
| cta_click | CTA button clicked | cta_text, cta_location |
| form_start | Form field focused | form_name |
| form_submit | Form submitted | form_name, field_count |
| demo_scheduled | Demo booking complete | - |
| trial_started | Free trial activated | - |

### Google Tag Manager Setup
1. Create container and install
2. Configure GA4 tag with measurement ID
3. Create custom event tags
4. Build triggers for each event
5. Test in preview mode
6. Publish container
```

### 3. Conversion Rate Optimization

#### CRO Process

```markdown
## CRO Framework

### Phase 1: Research & Analysis
1. **Quantitative Analysis**
   - Funnel analysis (where drop-offs occur)
   - Page-level metrics (bounce, time, exit)
   - Form analytics (abandonment, field issues)
   - Traffic source performance
   - Device/browser segmentation

2. **Qualitative Research**
   - Heatmaps (click, scroll, attention)
   - Session recordings (user behavior)
   - User surveys (on-site or post-conversion)
   - Customer interviews
   - Support ticket analysis

### Phase 2: Hypothesis Development
Formula: "If we [change], then [outcome], because [rationale]."

Example: "If we add social proof above the fold, then demo
requests will increase, because visitors need validation
before committing to a sales conversation."

### Phase 3: Prioritization (ICE Framework)
| Hypothesis | Impact (1-10) | Confidence (1-10) | Ease (1-10) | ICE Score |
|------------|---------------|-------------------|-------------|-----------|
| [Hypothesis 1] | [X] | [X] | [X] | [Avg] |
| [Hypothesis 2] | [X] | [X] | [X] | [Avg] |

Impact: Potential effect on key metric
Confidence: How sure are you this will work
Ease: How easy to implement

### Phase 4: Testing
- Design variation(s)
- Implement A/B test
- Run until statistical significance
- Analyze results

### Phase 5: Implementation
- Winner implemented as default
- Document learnings
- Move to next hypothesis
```

#### Conversion Optimization Tactics

```markdown
## High-Impact CRO Tactics

### Above-the-Fold Optimization
**Problem**: Visitors don't understand value immediately
**Solutions**:
- Clear, benefit-driven headline
- Specific subheadline with proof
- Hero image showing product/outcome
- Single, prominent CTA
- Remove competing elements

### CTA Optimization
**Button Text Best Practices**:
- Action-oriented: "Get Started" vs "Submit"
- Value-focused: "Start Free Trial" vs "Sign Up"
- Specific: "Download the Guide" vs "Learn More"
- First-person: "Start My Trial" (test this)

**Button Design**:
- Contrasting color
- Sufficient padding
- Obvious clickability
- Consistent placement

### Form Optimization
**Reduce Friction**:
- Minimum necessary fields
- Smart defaults and autofill
- Progress indicators (multi-step)
- Inline validation
- Clear error messages

**Field Recommendations by Form Type**:
| Form Type | Essential Fields | Nice-to-Have |
|-----------|------------------|--------------|
| Newsletter | Email | First name |
| Lead magnet | Email, First name | Company |
| Demo request | Email, Name, Company, Phone | Title, Size |
| Contact | Email, Name, Message | Phone, Company |

### Social Proof Placement
**Types of Social Proof**:
- Customer logos
- Testimonials with photos
- Review scores/badges
- User counts
- Case study snippets

**Placement Strategy**:
- Near CTAs (reduce anxiety at decision point)
- Above fold (establish credibility early)
- On pricing page (validate investment)
- In checkout/form (reassure at commitment)

### Urgency & Scarcity
**Ethical Urgency Tactics**:
- Limited-time offers (genuine)
- Event-based deadlines
- Low stock indicators (real)
- Cohort-based programs

**Avoid**:
- Fake countdown timers
- False scarcity
- Manufactured urgency
```

### 4. A/B Testing

#### Test Planning

```markdown
## A/B Test Planning Framework

### Pre-Test Checklist
- [ ] Hypothesis clearly stated
- [ ] Primary metric defined
- [ ] Secondary metrics identified
- [ ] Sample size calculated
- [ ] Test duration estimated
- [ ] Traffic allocation decided
- [ ] QA on all variations
- [ ] Tracking confirmed working

### Sample Size Calculation
Inputs needed:
- Baseline conversion rate: [X]%
- Minimum detectable effect: [X]%
- Statistical significance: 95%
- Statistical power: 80%

Use calculators:
- Optimizely: https://www.optimizely.com/sample-size-calculator/
- ABTestGuide: https://abtestguide.com/calc/

### Test Duration
Minimum requirements:
- Full week (capture day-of-week variation)
- 2+ business cycles
- Reach calculated sample size
- Statistical significance achieved

### Test Documentation Template
---
**Test Name**: [Descriptive name]
**Hypothesis**: If we [change], then [outcome], because [rationale]
**Primary Metric**: [e.g., Demo request conversion rate]
**Secondary Metrics**: [e.g., Bounce rate, time on page]

**Control**: [Description of current state]
**Variation A**: [Description of change]
**Variation B**: [If applicable]

**Traffic Allocation**: [50/50, 33/33/33, etc.]
**Target Sample Size**: [Number per variation]
**Estimated Duration**: [Days/weeks]

**Start Date**: [Date]
**End Date**: [Date]
**Status**: [Planning/Running/Complete]

**Results**:
- Primary metric: Control [X]% vs Variation [X]%
- Lift: [X]%
- Confidence: [X]%
- Winner: [Control/Variation]

**Next Steps**: [Implementation/Iterate/Document learning]
---
```

#### Test Analysis

```markdown
## A/B Test Analysis Framework

### Statistical Validity Check
Before declaring a winner:
- [ ] Sample size target reached
- [ ] Test ran full business cycle(s)
- [ ] Confidence level ≥95%
- [ ] Results stable (not fluctuating)

### Results Interpretation
| Metric | Control | Variation | Lift | Confidence | Winner |
|--------|---------|-----------|------|------------|--------|
| Primary | [X]% | [X]% | [X]% | [X]% | [C/V] |
| Secondary 1 | [X]% | [X]% | [X]% | [X]% | [C/V] |
| Secondary 2 | [X]% | [X]% | [X]% | [X]% | [C/V] |

### Segmentation Analysis
Check if results hold across:
- Device type (mobile vs desktop)
- Traffic source
- New vs returning visitors
- Geographic region

### Learning Documentation
Even if test "fails," document:
- What was tested
- Why we thought it would work
- What actually happened
- What we learned
- How it informs future tests

### Post-Test Actions
| Result | Action |
|--------|--------|
| Clear winner | Implement variation, monitor |
| No difference | Document, try bolder change |
| Unexpected negative | Investigate why, document |
| Segment differences | Consider personalization |
```

### 5. Page Speed Optimization

#### Speed Audit

```markdown
## Page Speed Assessment

### Measurement Tools
- Google PageSpeed Insights (Core Web Vitals)
- GTmetrix (detailed analysis)
- WebPageTest (advanced testing)
- Chrome DevTools (Network, Performance tabs)

### Core Web Vitals Targets
| Metric | What It Measures | Good | Needs Improvement | Poor |
|--------|------------------|------|-------------------|------|
| LCP | Largest Contentful Paint | ≤2.5s | 2.5-4s | >4s |
| FID | First Input Delay | ≤100ms | 100-300ms | >300ms |
| CLS | Cumulative Layout Shift | ≤0.1 | 0.1-0.25 | >0.25 |

### Additional Speed Metrics
| Metric | Target |
|--------|--------|
| Time to First Byte (TTFB) | <200ms |
| First Contentful Paint (FCP) | <1.8s |
| Time to Interactive (TTI) | <3.8s |
| Speed Index | <3.4s |
| Total Page Size | <3MB |
| Number of Requests | <50 |

### Speed Audit Results Template
| Page | LCP | FID | CLS | Size | Requests | Score |
|------|-----|-----|-----|------|----------|-------|
| Homepage | [X]s | [X]ms | [X] | [X]MB | [X] | [X]/100 |
| Pricing | [X]s | [X]ms | [X] | [X]MB | [X] | [X]/100 |
| Product | [X]s | [X]ms | [X] | [X]MB | [X] | [X]/100 |
```

#### Speed Optimization Techniques

```markdown
## Page Speed Optimization Checklist

### Image Optimization
- [ ] Compress images (TinyPNG, ImageOptim)
- [ ] Use modern formats (WebP, AVIF)
- [ ] Implement lazy loading
- [ ] Specify dimensions (prevent CLS)
- [ ] Use appropriate sizes (srcset)
- [ ] Consider CDN for images

### Code Optimization
**CSS**:
- [ ] Minify CSS files
- [ ] Remove unused CSS
- [ ] Critical CSS inlined
- [ ] Non-critical CSS deferred

**JavaScript**:
- [ ] Minify JS files
- [ ] Remove unused JavaScript
- [ ] Defer non-critical scripts
- [ ] Code splitting where possible

**HTML**:
- [ ] Minify HTML
- [ ] Remove unnecessary comments
- [ ] Compress with gzip/brotli

### Server Optimization
- [ ] Enable HTTP/2
- [ ] Use CDN for static assets
- [ ] Configure browser caching
- [ ] Optimize Time to First Byte
- [ ] Consider edge caching

### Third-Party Scripts
- [ ] Audit all third-party scripts
- [ ] Remove unnecessary scripts
- [ ] Load async or defer
- [ ] Consider self-hosting critical scripts
- [ ] Use resource hints (preconnect, prefetch)

### Font Optimization
- [ ] Limit font weights/styles
- [ ] Use font-display: swap
- [ ] Preload critical fonts
- [ ] Consider system fonts for body
- [ ] Subset fonts if possible

### Priority Matrix
| Fix | Impact | Effort | Priority |
|-----|--------|--------|----------|
| Image compression | High | Low | 1 |
| Lazy loading | High | Low | 1 |
| JS defer | High | Medium | 2 |
| CDN setup | High | Medium | 2 |
| Critical CSS | Medium | Medium | 3 |
| Code splitting | Medium | High | 4 |
```

## Tools & Templates

### Website Optimization Dashboard

```markdown
## Monthly Metrics Dashboard

### Traffic & Engagement
| Metric | This Month | Last Month | Change | Target |
|--------|------------|------------|--------|--------|
| Sessions | [X] | [X] | [X]% | [X] |
| Users | [X] | [X] | [X]% | [X] |
| Pages/Session | [X] | [X] | [X]% | [X] |
| Avg Session Duration | [X]s | [X]s | [X]% | [X]s |
| Bounce Rate | [X]% | [X]% | [X]% | <[X]% |

### Conversion Metrics
| Metric | This Month | Last Month | Change | Target |
|--------|------------|------------|--------|--------|
| Total Conversions | [X] | [X] | [X]% | [X] |
| Conversion Rate | [X]% | [X]% | [X]% | [X]% |
| Demo Requests | [X] | [X] | [X]% | [X] |
| Trial Signups | [X] | [X] | [X]% | [X] |

### Technical Health
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| PageSpeed Score (Mobile) | [X]/100 | >70 | [G/Y/R] |
| PageSpeed Score (Desktop) | [X]/100 | >80 | [G/Y/R] |
| Core Web Vitals Pass | [Y/N] | Yes | [G/Y/R] |
| 404 Errors | [X] | 0 | [G/Y/R] |
| Broken Links | [X] | 0 | [G/Y/R] |
```

### Test Roadmap Template

| Priority | Test Name | Hypothesis | Page | Status | Start | End |
|----------|-----------|------------|------|--------|-------|-----|
| 1 | [Name] | [Hypothesis] | [Page] | [Status] | [Date] | [Date] |
| 2 | [Name] | [Hypothesis] | [Page] | [Status] | [Date] | [Date] |

## Metrics & KPIs

### Key Website Metrics

| Metric | Description | Benchmark | Target |
|--------|-------------|-----------|--------|
| Conversion rate | Visitors to conversions | 2-5% (B2B) | [X]% |
| Bounce rate | Single-page sessions | 40-60% | <[X]% |
| Pages per session | Engagement depth | 2-3 | >[X] |
| Avg session duration | Time engagement | 2-3 min | >[X]min |
| Page load time | Speed metric | <3s | <[X]s |
| Mobile traffic share | Device mix | 50%+ | N/A |

### Funnel Metrics

| Stage | Metric | Formula | Target |
|-------|--------|---------|--------|
| Awareness | Unique visitors | GA4 users | [X]/month |
| Interest | Engaged sessions | Sessions >10s | [X]% of visits |
| Consideration | Key page views | Pricing/demo page views | [X]% of visits |
| Conversion | Goal completions | Form submits/signups | [X]% of visits |

## Common Pitfalls

### Pitfall 1: Testing Without Traffic
**Problem**: Running tests without enough visitors to reach significance
**Solution**: Calculate required sample size before testing; prioritize high-traffic pages

### Pitfall 2: Stopping Tests Early
**Problem**: Declaring winners before statistical significance
**Solution**: Set duration and sample size upfront; resist peeking/stopping early

### Pitfall 3: Ignoring Mobile
**Problem**: Optimizing for desktop when most traffic is mobile
**Solution**: Mobile-first optimization; test on mobile devices

### Pitfall 4: Too Many Changes
**Problem**: Testing multiple changes, unable to attribute results
**Solution**: Isolate variables; one change per test when possible

### Pitfall 5: Analysis Paralysis
**Problem**: Collecting data but not acting on it
**Solution**: Regular review cadence; prioritized action list

### Pitfall 6: Set and Forget
**Problem**: Implementing tracking but never reviewing
**Solution**: Weekly/monthly analytics review; dashboard monitoring

## Integration Points

### Connected Business Functions

| Function | Integration Point | Shared Elements |
|----------|-------------------|-----------------|
| Content Marketing | Blog, resources | Traffic, engagement metrics |
| Demand Gen | Landing pages, forms | Lead generation, conversion |
| Product | Product pages, signup | User activation |
| Sales | Demo pages, contact | Lead quality feedback |
| Brand | Design system | Visual consistency |
| SEO | Technical SEO | Crawlability, performance |

### Technology Stack

- **Analytics**: Google Analytics 4, Mixpanel, Amplitude
- **Testing**: Google Optimize, VWO, Optimizely
- **Heatmaps**: Hotjar, Microsoft Clarity, FullStory
- **Speed testing**: PageSpeed Insights, GTmetrix, WebPageTest
- **Tag management**: Google Tag Manager
- **Uptime monitoring**: Pingdom, UptimeRobot
