# kylerosebrook.com — Implementation Roadmap

> Last updated: 2026-04-08
> Status: Active

---

## Completed

### Phase 0: Foundation (Done — April 8, 2026)

- [x] **Google Search Console** — Ownership verified (auto via DNS), sitemap submitted (12 pages)
- [x] **Navigation restructured** — Reordered to Home | About | Work | Services | Workshop | Contact
- [x] **"Kyle Rosebrook" renamed to "About"** in nav
- [x] **"Get In Touch" CTA fixed** — Changed from mailto:kylerosebrook@gmail.com to /contact/
- [x] **Duplicate H1 fixed** — Hero heading changed from H1 to H2 (1 H1 per page now)
- [x] **Schema markup injected** — Person, WebSite, ProfessionalService JSON-LD on homepage
- [x] **FAQ schema injected** — 5-question FAQ schema on Services page
- [x] **GA4 installed** — Measurement ID G-7RE78QC6HD, gtag in header template, Enhanced Measurement enabled (page views, scrolls, outbound clicks)

---

## In Progress

### Phase 1: SEO & Discoverability (Week of April 8-14)

| Task | Priority | Status | Guide |
|------|----------|--------|-------|
| Install Yoast or Rank Math SEO plugin | Critical | To Do | WP Admin → Plugins → Add New |
| Add custom meta descriptions to all 6 pages | Critical | To Do | `kylerosebrook-seo-assets.md` |
| Set custom OG titles for all 6 pages | High | To Do | `kylerosebrook-seo-assets.md` |
| Create custom OG image for social sharing | High | To Do | 1200x630px, branded with photo + tagline |
| Add internal links across all pages (3-5 per page) | High | To Do | `kylerosebrook-seo-assets.md` — linking strategy |
| Link Search Console to GA4 | Medium | To Do | `kylerosebrook-analytics-guide.md` |

### Phase 2: Trust & Credibility (Week of April 14-21)

| Task | Priority | Status | Guide |
|------|----------|--------|-------|
| Set up kyle@kylerosebrook.com professional email | Critical | To Do | `kylerosebrook-design-system.md` — email setup guide |
| Add professional headshot to homepage + About page | Critical | To Do | Square crop, min 800x800px |
| Collect and add 2-3 testimonials | Critical | To Do | `kylerosebrook-design-system.md` — email templates |
| Add credentials/experience section | High | To Do | `kylerosebrook-design-system.md` — section copy |
| Update contact form to use professional email | High | To Do | WP Admin → Pages → Contact |
| Add specific numbers ("X years," "Y reviews") | Medium | To Do | About + Services pages |

### Phase 3: Content & Conversion (Week of April 21-28)

| Task | Priority | Status | Guide |
|------|----------|--------|-------|
| Add pricing indicators to Services page | High | To Do | `kylerosebrook-content-strategy.md` — pricing tiers |
| Surface AI Setup Score form on every page | High | To Do | Move from About-only to all pages |
| Add Calendly/Cal.com booking link on Services | High | To Do | "Book a Discovery Call" CTA |
| Expand Workshop page with curriculum + FAQs | High | To Do | `kylerosebrook-content-strategy.md` — workshop copy |
| Add screenshots/mockups to Work page projects | Critical | To Do | At least 1 visual per project |
| Write first case study (MONOTURBO or FlashFusion) | High | To Do | `kylerosebrook-content-strategy.md` — templates |
| Change "Take the free assessment" link to on-site | High | To Do | Currently sends to flashfusion.co |

### Phase 4: Design & Brand (Week of April 28 - May 5)

| Task | Priority | Status | Guide |
|------|----------|--------|-------|
| Implement brand color palette (CSS custom properties) | Medium | To Do | `kylerosebrook-design-system.md` |
| Add Google Fonts typography pairing | Medium | To Do | `kylerosebrook-design-system.md` |
| Replace emoji icons with SVG icon set | High | To Do | `kylerosebrook-design-system.md` |
| Add hero section visual treatment | High | To Do | `kylerosebrook-design-system.md` |
| Implement card-based layouts for What I Do / Projects | Medium | To Do | `kylerosebrook-design-system.md` — CSS |
| Add sticky CTA button | Medium | To Do | "Book a Session" floating button |
| Make footer links clickable (GitHub, LinkedIn) | High | To Do | WP Admin → Site Editor → Footer |

### Phase 5: Analytics & Optimization (Week of May 5-12)

| Task | Priority | Status | Guide |
|------|----------|--------|-------|
| Set up GA4 Key Events (form submissions, CTA clicks) | High | To Do | `kylerosebrook-analytics-guide.md` |
| Install Google Tag Manager | Medium | To Do | `kylerosebrook-analytics-guide.md` |
| Set up conversion funnels in GA4 | Medium | To Do | Homepage → Services → Contact → Thank You |
| Create GA4 monitoring dashboard | Medium | To Do | `kylerosebrook-analytics-guide.md` |
| Run Lighthouse audit (mobile + desktop) | High | To Do | Chrome DevTools → Lighthouse |
| Run PageSpeed Insights | High | To Do | pagespeed.web.dev |
| Check security headers | Medium | To Do | securityheaders.com |

### Phase 6: Content Marketing (Ongoing — Starting May 12)

| Task | Priority | Status | Guide |
|------|----------|--------|-------|
| Set up blog/Insights section in WordPress | High | To Do | WP Admin → Posts |
| Publish Week 1 blog post | High | To Do | "The AI Setup Score: Why Most Companies Fail at AI..." |
| Publish Week 2 blog post | Medium | To Do | "I Consolidated 9 Repos Into 4..." |
| Publish Week 3 blog post | Medium | To Do | "AppSec Patterns Every AI Feature Needs..." |
| Publish Week 4 blog post | Medium | To Do | "What a Fractional CTO Actually Does..." |
| Set up email newsletter (Jetpack Newsletter or ConvertKit) | Medium | To Do | Capture leads from blog |
| Create digital product (AI Setup Checklist PDF) | Low | To Do | Low-ticket entry in value ladder |

---

## Deliverable Documents

All saved to `C:\Users\kyler\Documents\`:

| File | Contents |
|------|----------|
| `kylerosebrook-seo-assets.md` | Meta descriptions, OG titles, JSON-LD schema markup, internal linking strategy |
| `kylerosebrook-content-strategy.md` | 3 case study templates, improved homepage copy, 12-week blog calendar, pricing tiers, workshop landing page |
| `kylerosebrook-analytics-guide.md` | GA4 setup, GTM, Key Events, conversion funnels, dashboard template |
| `kylerosebrook-design-system.md` | Color palette + CSS, typography, icons, hero design, nav CSS, card layouts, email setup guide, testimonial templates, credentials copy |

---

## Success Metrics

### 30-Day Targets (by May 8, 2026)
- [ ] GA4 receiving data (page views, scroll depth, outbound clicks)
- [ ] 0 SEO errors in Yoast/Rank Math
- [ ] Professional email configured
- [ ] At least 2 testimonials published
- [ ] At least 1 case study with screenshots on Work page
- [ ] Pricing visible on Services page
- [ ] Booking link active on Services page

### 60-Day Targets (by June 8, 2026)
- [ ] 4+ blog posts published
- [ ] Google Search Console showing impressions for target keywords
- [ ] All pages pass Lighthouse mobile audit (score 80+)
- [ ] Email list started with 10+ subscribers
- [ ] Brand color palette and typography implemented
- [ ] AI Setup Score form on 3+ pages

### 90-Day Targets (by July 8, 2026)
- [ ] 12 blog posts published
- [ ] Organic traffic baseline established in GA4
- [ ] At least 1 lead per week from website
- [ ] Workshop page fully built with registration
- [ ] Case studies for top 3 projects complete
- [ ] Digital product (checklist/template) live

---

## Architecture Notes

- **Platform:** WordPress.com Business plan, Assembler theme (block theme), WordPress 6.9.4
- **Analytics:** GA4 (G-7RE78QC6HD) + Jetpack Stats
- **Search Console:** Verified, sitemap submitted
- **Schema:** Person + WebSite + ProfessionalService (homepage), FAQ (Services)
- **Navigation:** Custom wp:navigation-link blocks (not auto page-list)
- **Domain:** kylerosebrook.com (DNS managed via WordPress.com)
