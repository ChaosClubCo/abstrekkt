# kylerosebrook.com — GA4 & Analytics Guide

> Generated: 2026-04-08 | GA4 Property: G-7RE78QC6HD (installed and active)

---

## Current Setup (Completed)

- GA4 Measurement ID: **G-7RE78QC6HD**
- Data stream: Kyle Rosebrook Website (https://kylerosebrook.com)
- Stream ID: 14329317166
- gtag.js injected into header template (all pages)
- Enhanced Measurement enabled: Page views, Scrolls, Outbound clicks, Site search, Form interactions, Video engagement, File downloads
- Google Search Console: Verified, sitemap submitted (12 pages)

---

## Key Events to Configure

Go to GA4 Admin → Events → Mark as Key Event:

| Event | How to Set Up | Why |
|-------|--------------|-----|
| `form_submit` | Enhanced Measurement auto-tracks | Contact form + AI Setup Score submissions |
| `click` (outbound) | Enhanced Measurement auto-tracks | Track clicks to FlashFusion, GitHub, LinkedIn |
| `scroll` | Enhanced Measurement auto-tracks | 90% scroll depth signals engagement |
| `page_view` on /contact/ | Create custom event: page_view where page_path = /contact/ | Track contact page visits as micro-conversion |

### Custom Events to Create (Admin → Events → Create Event)

1. **cta_click** — Track CTA button clicks
   - Matching: event_name = click, link_text contains "See My Work" OR "Get In Touch" OR "Book" OR "Start a Conversation"

2. **assessment_start** — Track AI Setup Score engagement
   - Matching: event_name = page_view, page_path contains "ai-setup" or "assessment"

---

## Conversion Funnels

### Primary: Visitor → Client
1. Homepage (/) → any page view
2. Services (/services/) → viewed offerings
3. Contact (/contact/) → intent to engage
4. Form submission → conversion

### Secondary: Visitor → Lead
1. Any page → page view
2. AI Setup Score form → assessment start
3. Email captured → lead generated

### Workshop: Visitor → Registrant
1. Workshop (/vibe-coding-workshop/) → page view
2. Registration link click → intent
3. Registration complete → conversion

### How to Build in GA4
1. Go to Explore → Funnel Exploration
2. Add steps matching the page paths above
3. Set "Open funnel" to see where visitors enter
4. Monitor weekly for drop-off patterns

---

## GA4 Dashboard — Weekly Metrics to Monitor

### Overview Tab
- **Users** (new vs returning)
- **Sessions** by source/medium
- **Engagement rate** (target: >50%)
- **Average engagement time** (target: >1 min)

### Acquisition Tab
- Top traffic sources (organic, direct, social, referral)
- Landing page performance
- Google Search Console keywords (once linked)

### Engagement Tab
- Top pages by views and engagement time
- Events: form_submit count, outbound clicks, CTA clicks
- Scroll depth on Services and About pages

### Conversions Tab
- Contact form submissions per week
- AI Setup Score completions
- CTA click-through rates

---

## Link Search Console to GA4

1. In GA4, go to Admin → Product Links → Search Console Links
2. Click "Link"
3. Select your Search Console property (https://kylerosebrook.com)
4. Click "Next" → "Submit"
5. Data will appear in Reports → Acquisition → Search Console within 48 hours

---

## Google Tag Manager (Optional — Future Enhancement)

If you want more advanced event tracking:

1. Create a GTM account at tagmanager.google.com
2. Create a container for kylerosebrook.com (Web)
3. Replace the direct gtag.js code in the header template with the GTM snippet
4. Move the GA4 config tag into GTM
5. Add custom triggers for:
   - Form submission (CSS selector based)
   - Specific button clicks (e.g., "Book a Discovery Call")
   - Scroll depth milestones (25%, 50%, 75%, 100%)
   - Timer-based engagement (30s, 60s, 120s on page)

---

## Data Retention Settings

1. GA4 Admin → Data Settings → Data Retention
2. Set to **14 months** (maximum for free GA4)
3. Toggle on "Reset user data on new activity"
