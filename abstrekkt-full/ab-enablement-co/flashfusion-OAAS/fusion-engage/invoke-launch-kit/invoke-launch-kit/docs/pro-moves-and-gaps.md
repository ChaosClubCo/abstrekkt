# Pro Moves + What Was Missed

---

## Pro Moves (implement when you have first paying clients)

### 1. Scorecard Retargeting Pixel
Add PostHog or Meta Pixel on the scorecard results page.
Any visitor who sees results but doesn't click the Calendly CTA goes into
a retargeting audience for LinkedIn/Meta ads. $30-50 CPM to warm leads
who already know their score = highest ROI ad spend possible.

### 2. Calendly → B44 Auto-Engagement Create
When a prospect books the $1,500 audit via Calendly:
- Calendly webhook fires to n8n
- n8n creates AuditSubmission (status: pending) + Engagement (status: pending)
- Sets converted: true on matching FreeAssessment (match by email)
- Sends you a Slack message with booking details
- Sends client a prep email: "Before our session, here's what to have ready..."
Zero manual work between "paid" and "portal active."

### 3. Score-Gated LinkedIn Content
Post your own score (or a client score with permission) on LinkedIn weekly.
"We audited a 200-person SaaS company last week. Score: 48/100.
Here's the #1 thing we found. [Link to take the free scorecard]"
Specificity + free tool = comment bait + lead flow.

### 4. Duplicate Free Scorecard as a White-Label
When you're at 3+ retainer clients, offer a white-labeled version of the
free scorecard as a deliverable. Client embeds it on their site, their HR
or L&D team uses it to assess internal AI readiness. Charges $500/quarter.
You already have the infrastructure — just needs a `white_label_config`
field on the B44 app and a subdomain per client.

### 5. A/B Test the CTA Text
"Book the Full Audit · $1,500 →" vs "Get Your 90-Day Roadmap · $1,500 →"
vs "Fix These Gaps · $1,500 →"
Run via PostHog feature flag. Track Calendly click-through rate per variant.
The copy change alone could 2x conversion.

### 6. Drip Sequence Off Free Scorecard
Email 1 (immediate): Score PDF
Email 2 (day 2): "Here's what a Developing company does in week 1"
Email 3 (day 5): Case study — company that went from 58 → 84 in 90 days
Email 4 (day 10): "Your slot is still available — book before [date]"
Wire via n8n with delay nodes. Each email references their specific score.

### 7. Monthly "AI State of the Stack" Benchmark Report
Aggregate anonymized scorecard data monthly.
"Average score this month: 61/100. Tools dimension up 4pts. ROI still lowest."
Publish on LinkedIn. Tags every person who took the scorecard.
Builds authority + drives retakes + organic reach.

---

## What Was Missed (known gaps not yet addressed)

### Gap 1 — Scorecard is NOT anonymous by default
B44 apps typically require login. Verified: `FreeAssessment` schema
allows anonymous creation, but the app-level auth setting may require
account creation before the form loads. MUST verify in incognito before
driving any traffic. Fix: B44 app settings → make scorecard route public.

### Gap 2 — No PDF generation implemented
The "Download Score PDF" CTA was wired visually but no PDF generation
library was implemented. B44 doesn't have native PDF export.
Fix options:
  A. Use window.print() with a print-specific CSS stylesheet (5 min, rough)
  B. Call a Cloudflare Worker that takes score JSON → returns a PDF (best)
  C. Use a service like PDFShift or html2pdf.js client-side (1 hr)

### Gap 3 — Calendly URL is a placeholder
The CTA links to https://calendly.com/kylerosebrook/ai-strategy-audit
which doesn't exist yet. Anyone who clicks it gets a 404.
Priority: create this before sharing the scorecard URL with anyone.

### Gap 4 — n8n workflow not yet imported
The workflow JSON was generated but not yet running in n8n.
Admin notifications and lead emails will silently fail until imported.
File: n8n/lead-notification-workflow.json

### Gap 5 — No Stripe receipt → Engagement creation automation
When someone pays via Calendly+Stripe, nothing automatically creates
their Engagement in B44. You'd be doing this manually until Gap 2 in
the "Pro Moves" section is implemented.

### Gap 6 — Availability is still manual
15 slots seeded, but no recurring generation. Slots will run out June 12.
Fix: run scripts/availability-generator.js monthly, or add a cron
in n8n that calls the B44 entity creation API on a schedule.

### Gap 7 — Case study emails expose synthetic data
The 3 case studies (client1@anon.com etc.) are fine visually but the
email fields may be exposed in admin views. Should not reach clients.
RLS is applied but the admin dashboard may still render the email fields.
Review before inviting any team member to the admin view.

### Gap 8 — No onboarding wizard UI built
The OnboardingSurvey entity exists. The auto-launch trigger was wired.
But the actual wizard UI (the questions, the form flow, the save logic)
has not been built. First client to hit the portal will see the banner
but clicking "Start Now →" may go nowhere.

---

## Calendly Event Setup (step by step)

1. Go to calendly.com → Create Event Type
2. Name: "AI Implementation Audit"
3. Duration: 60 minutes
4. Location: Zoom (add link) or Google Meet
5. Questions to add:
   - "Company name" (required)
   - "Your AI Readiness Score (if you took the free scorecard)" (optional)
   - "Primary AI tools your team uses" (optional)
6. Payments → Enable → Stripe → $1,500 USD
7. Confirmation: set to "Redirect to URL" → https://audit.flashfusion.co/portal
8. Copy the event URL
9. In B44 editor: find "calendly.com/kylerosebrook/ai-strategy-audit" placeholder → replace with real URL

---

## Resource PDF Quick Creates (2 hrs total)

Priority order:
1. "AI Readiness Quick Reference" — 1-pager: the 5 scoring dimensions with 3 bullets each
2. "Prompt Engineering Starter Pack" — 2-pager: 5 prompt patterns with before/after examples
3. "AI Tool Audit Template" — 1-pager: spreadsheet-style template for cataloguing AI tools + cost + owner
4. "90-Day AI Roadmap Template" — 2-pager: blank roadmap with phase headers
5. "AI Governance Checklist" — 1-pager: 15 yes/no items for basic AI governance

Create in Canva using FlashFusion dark template. Export as PDF.
Host at: https://flashfusion.co/resources/[filename].pdf
Then in B44: update file_url on each Resource record + set is_public: true.
