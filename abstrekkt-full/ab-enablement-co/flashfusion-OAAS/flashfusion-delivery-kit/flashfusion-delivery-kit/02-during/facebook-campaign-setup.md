# Facebook Campaign Setup Checklist

**Client:** {{CLIENT_NAME}}
**Locations:** {{CLIENT_LOCATIONS}}
**Build start:** {{KICKOFF_DATE}}
**Target go-live:** ___

Complete in order. Do not skip steps — each depends on the prior one.

---

## Phase A — Foundation (before any campaign work)

### A1 — Business Manager setup
- [ ] Verify client has a Facebook Business Manager account at business.facebook.com
- [ ] If not: create one under their business email — never under Kyle's account
- [ ] Add Kyle as Partner (not Employee) with Advertiser access — this preserves client ownership
- [ ] Confirm Ad Account exists inside Business Manager
- [ ] Verify billing method is attached to the Ad Account

### A2 — Facebook Pixel
- [ ] Check if Pixel is installed on client website: Events Manager → Data Sources
- [ ] If installed: verify it's firing on the home page and contact/form pages
- [ ] If not installed:
  - [ ] Get access to website CMS (WordPress, Squarespace, Wix, etc.)
  - [ ] Install Pixel via native integration or manual `<head>` tag
  - [ ] Verify firing with Facebook Pixel Helper Chrome extension
  - [ ] Create custom conversion event for lead form submission
- [ ] Document Pixel ID: ___

### A3 — Creative assets
- [ ] Confirm all photos received from intake questionnaire
- [ ] Verify image sizes meet Facebook specs: minimum 1080×1080px for square, 1200×628px for link ads
- [ ] If images need resizing: use Canva or native tool, export at 2x
- [ ] Organize assets in client folder: `{{CLIENT_NAME}} — FlashFusion / Creative`

---

## Phase B — Campaign architecture

### B1 — Campaign structure
Create one campaign per location. Name format: `[Business] — [City] — [Objective]`

For {{CLIENT_NAME}}:
- [ ] Campaign 1: `{{CLIENT_NAME}} — Chicago — Lead Gen`
- [ ] Campaign 2: `{{CLIENT_NAME}} — Palatine — Lead Gen`
- [ ] Campaign 3: `{{CLIENT_NAME}} — Downers Grove — Lead Gen`

Campaign objective: **Leads** (not traffic, not awareness — leads)

### B2 — Ad set targeting (repeat per location)
- [ ] Location: 10-mile radius around each location address
- [ ] Age: 25–65 (adjust per discovery call notes)
- [ ] Interests: guitar, music, live music, guitar repair, musician (test at least 3)
- [ ] Exclude: people who already liked the Facebook Page (optional — test both ways)
- [ ] Budget: $100–$175/month per location ($5–$6/day)
- [ ] Schedule: always on (no dayparting until data exists)
- [ ] Optimization: Leads (Pixel conversion)

### B3 — Ad copy (per location, 3 variations each)
Use the ad copy prompt library to generate variations. Minimum 3 per ad set:
- Variation A: benefit-led (what they get)
- Variation B: problem-led (what they're losing without it)
- Variation C: social proof / credibility (years in business, number of techs, brands served)

Copy checklist per variation:
- [ ] Headline: under 40 characters
- [ ] Primary text: 1–3 sentences, ends with a question or clear CTA
- [ ] CTA button: "Get Quote" or "Learn More" (not "Shop Now")
- [ ] Image: one per variation, no stock photos

---

## Phase C — Lead capture

### C1 — Facebook Lead Form (native — no website required)
- [ ] Create Instant Form inside each Ad Set
- [ ] Form type: More Volume (not Higher Intent — higher intent reduces lead volume)
- [ ] Questions to include:
  - Full name (pre-filled by Facebook)
  - Email (pre-filled by Facebook)
  - Phone number (pre-filled by Facebook)
  - One custom question: "What do you need help with?" — dropdown with 3–4 options
- [ ] Privacy policy URL: client's website privacy page (or generate a basic one)
- [ ] Thank you screen: "We'll be in touch within 24 hours."
- [ ] Confirm form fires conversion event to Pixel

### C2 — Lead routing (automation)
Connect Facebook Lead Form → CRM pipeline via Zapier or n8n.

- [ ] Authenticate Facebook Lead Ads in Zapier/n8n
- [ ] Trigger: New Lead from Lead Form
- [ ] Action 1: Add row to Google Sheet (see CRM pipeline setup doc)
- [ ] Action 2: Send notification email to {{CLIENT_CONTACT}} email
- [ ] Action 3: Send automated reply to lead (see follow-up sequence below)
- [ ] Test with a real form submission before going live
- [ ] Document automation ID/Zap name: ___

### C3 — Follow-up sequence (3 messages)
Sent automatically after form submission. Configure in Zapier/n8n + email provider or SMS.

**Message 1 — Immediate (within 5 min)**
> Subject: "Thanks for reaching out — {{CLIENT_NAME}}"
> Body: "Hi [First Name], thanks for getting in touch. We'll review your request and reach back out within 24 hours. If it's urgent, call us at [phone]. — [Business Name]"

**Message 2 — 24 hours later (if no reply)**
> Subject: "Following up — {{CLIENT_NAME}}"
> Body: "Hi [First Name], just checking in. Did you get a chance to review our message? We'd love to help with [what they selected]. Reply here or call us at [phone]."

**Message 3 — 72 hours later (if no reply)**
> Subject: "Last follow-up — {{CLIENT_NAME}}"
> Body: "Hi [First Name], wanted to make sure our messages didn't get lost. We're here when you're ready — [phone] or just reply to this email."

---

## Phase D — Pre-launch review

Before going live, review all of these with {{CLIENT_CONTACT}}:

- [ ] Show all 3 ad variations per location for approval
- [ ] Confirm lead form questions and thank you message
- [ ] Confirm follow-up sequence messages
- [ ] Confirm CRM Google Sheet is receiving test data
- [ ] Confirm budget allocation ($100–$175/location/month)
- [ ] Client signs off on go-live

**Go-live date confirmed:** ___

---

## Phase E — Post-launch (first 7 days)

- [ ] Day 1: verify ads are approved and running (not rejected)
- [ ] Day 2: check Pixel is firing on form submissions
- [ ] Day 3: verify first leads are appearing in Google Sheet and email notification sent
- [ ] Day 7: first performance check
  - Impressions: ___
  - CPM (cost per 1,000 impressions): ___
  - Link clicks: ___
  - Leads: ___
  - Cost per lead: ___
- [ ] If CPL (cost per lead) > $30: pause underperforming variation, test new copy
- [ ] If no leads in 7 days: check audience size (should be 50k+), expand radius or interests

---

## Campaign naming conventions (for scalability)

Always name things so the next person (or you in 6 months) knows what it is:

| Asset | Format | Example |
|-------|--------|---------|
| Campaign | `[Client] — [City] — [Objective]` | `TCG — Chicago — Lead Gen` |
| Ad Set | `[Client] — [City] — [Audience]` | `TCG — Chicago — Guitarist 25-55` |
| Ad | `[Client] — [Variation] — [Date]` | `TCG — Problem Lead — Jun26` |
| Lead Form | `[Client] — [City] — [Date]` | `TCG — Chicago — Jun26` |
| Automation | `[Client] — Lead Routing` | `TCG — Lead Routing` |
| Google Sheet | `[Client] — Lead CRM — [Year]` | `TCG — Lead CRM — 2026` |
