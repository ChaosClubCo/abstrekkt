# Claude Design Prompts — All 8 Pages
## audit.flashfusion.co

Generate each in Claude Design (claude.ai/design), export HTML, import to B44.
Design system: #0F0618 bg, #A855F7 violet, #F472B6 pink, #22D3EE cyan, Geist Mono + Inter.

---

## PAGE 1 — Landing / Hero

Design a dark consulting landing page.
Background: #0F0618. Accent: violet #A855F7 and pink #F472B6. Highlight: cyan #22D3EE.
Typography: Geist Mono for headlines, Inter for body.

Hero section: Large headline "Find out exactly where your AI strategy is broken."
Subhead: "Free 10-question diagnostic. Score in 2 minutes. No account required."
Single CTA button in violet gradient: "Take the Free Scorecard →"
No nav links. No distractions. Single conversion path.

Below hero: 3 stat cards in dark #1a0a2e panels with violet border glow —
"2 min diagnostic", "5 scoring dimensions", "Instant results".

Social proof strip: 3 short anonymized quotes in small italic with industry label
e.g., "Series B SaaS · 18-person team" in cyan.

Below social proof: Horizontal section — "Used by teams running:" with logos/wordmarks
for Claude, ChatGPT, Gemini, Copilot in greyscale (opacity 0.4).

Bottom CTA: Full-width dark panel — "Already have your score? Book the full audit →"
in pink text. No footer clutter.

---

## PAGE 2 — Free Scorecard Flow (Quiz)

Design a single-question-per-screen quiz flow.
Background: #0F0618. Same token system.

Screen layout:
- Top: Progress bar in violet fill, "Question 3 of 10" label, back arrow (ghost)
- Center: Large question text in white, 32px Geist Mono, max 2 lines
- Below: 4 answer option pills — unselected: dark #1a0a2e bg, violet border, white text.
  Selected: solid violet fill, white text, subtle glow shadow.
- Auto-advance on selection. No "Next" button.

Ecosystem question (q0) shown first: multi-select pill grid.
Options: Claude, ChatGPT, Gemini, Copilot, Meta/Llama, Other, None yet.
Selected pills: solid violet. Unselected: outlined. "Next →" button appears after 1+ selected.

Email capture final screen (before results):
"Where should we send your score?" 
Name field + email field, stacked. 
Button: "Get My Score →" full-width violet.
Microcopy below: "No pitch. No spam. Unsubscribe anytime." in grey, small.

---

## PAGE 3 — Scorecard Results

Design a results reveal page with dramatic score display.
Background: #0F0618.

Top section: Animated circular gauge (CSS, not canvas). Outer ring: dark #1a0a2e.
Fill: violet arc up to score percentage. Center: Large score number in Geist Mono white 64px.
Below number: maturity level label in cyan — "Developing" or "Early Stage" or "Advanced".
Company name in small grey below that.

5 dimension mini-bars (below gauge, stacked):
Labels: Tools / Literacy / Data / Process / ROI
Each: left label, horizontal bar (violet fill proportional to score/20), score number right.
Bars animate in sequentially on load (150ms stagger).

"Your Top 3 Next Steps" section:
3 cards in #1a0a2e panels. Each card:
- Violet numbered circle (1, 2, 3) left-aligned
- Recommendation text in white Inter 16px
- Small expand arrow → reveals "Why this matters" tooltip

Ecosystem badges: row of small pills below score — showing which AI tools they use.
Pill style: dark bg, violet border, icon + text, small.

Bottom CTA row:
LEFT (outlined violet): "Download Score PDF"
RIGHT (solid violet gradient): "Book the Full Audit · $1,500 →"
Below CTAs: grey small text — "Includes 25-question deep dive, 90-day roadmap, 1-hour session."

Social proof strip: 3 minimal case study cards below CTAs.
Each: dark panel, industry tag in cyan, 2 stat bullets, italic quote.
Small italic footer: "*Client name withheld per confidentiality agreement."

---

## PAGE 4 — Full Audit Product Page

Design a product landing page for a $1,500 consulting service.
Background: #0F0618. Same token system.

Header: "AI Implementation Audit" in large Geist Mono white.
Price: "$1,500 · One-time" in cyan bold. Subhead in grey: "A 25-question deep-dive across every dimension that matters."

Feature list (6 items, cyan checkmarks):
✓ 25-question diagnostic across 5 dimensions
✓ Section scoring: Tools, Literacy, Data, Process, ROI
✓ Written report with prioritized findings
✓ 90-day implementation roadmap
✓ 1-hour live strategy session
✓ 30-day async follow-up support

Divider line violet.

Case study card: dark #1a0a2e panel. Industry tag pill (cyan). 
2 outcome bullets in white. Quote below in italic pink.
"*Client name withheld per confidentiality agreement." in tiny grey.

CTA: Full-width violet button "Book Your Audit + Pay $1,500 →"
Below it: "You'll complete secure payment at booking via Stripe."

FAQ accordion (4 items, dark panels, no visible borders when collapsed):
- "What happens after I book?"
- "Is this right for my company size?"
- "How is this different from a free scorecard?"
- "Do you offer refunds?"

---

## PAGE 5 — Client Portal Dashboard

Design a client portal for an active consulting engagement.
Background: #0F0618. Same token system.

Left sidebar (64px wide collapsed, 220px expanded):
- FlashFusion logomark at top
- Nav items with icons: Dashboard (home), My Roadmap (map), Resources (folder),
  Sessions (calendar), Messages (chat), Settings (gear)
- Active state: violet left border 3px + violet text
- User avatar + name at bottom

Main content:
Top: "Good morning, [Name]" in Geist Mono 28px.
Engagement status badge inline: cyan pill "Active · Strategy Session".

3 KPI cards (dark panels, inline stats):
- Roadmap Progress: circular mini-gauge, violet, percentage center
- Sessions Completed: number in pink, "of 3 total" below
- Resources Accessed: number in cyan, "files available" below

Roadmap preview: horizontal scroll of 3 milestone cards.
Each card: milestone title bold, status pill (planned=grey, in_progress=violet, completed=green, blocked=pink),
completion bar violet, target date small grey.

Right column:
- Upcoming session card: date, time, "Join Session" button outlined violet
- Recent message preview: last message snippet, sender, "Reply →" cyan link

---

## PAGE 6 — Roadmap / Milestones View

Design a milestone delivery view for consulting clients.
Background: #0F0618. Same token system.

Top bar: Roadmap title in Geist Mono. Date range small grey. Status badge.
Admin-only collapsed panel: "Consultant Notes" with lock icon — hidden for client role.

Milestone list (vertical):
Each milestone card (dark panel #1a0a2e, violet left border on in_progress):
- Left: violet numbered circle
- Title: bold white
- Right: status pill (colors as above) + completion % badge
- Completion bar: thin, violet fill, full width below title
- Target date: small grey
- Expandable section (chevron):
  - Description text
  - Evidence files zone: dashed violet border, "+ Add Evidence" label, file list below
  - Comments thread: client bubbles left (#1a0a2e bg), admin bubbles right (violet bg dark text)
    Each bubble: text + author label + timestamp grey
- "Mark Complete" button: outlined violet, appears only on in_progress milestones

---

## PAGE 7 — Admin Dashboard [ADMIN ONLY]

Design an internal operations dashboard. Admin-only view.
Background: #0F0618. Add [ADMIN] badge top-right — pink outlined pill.

Top KPI row (5 cards, dark panels):
- Free Assessments: total count + "X% converted" below in grey
- Full Audits: count in pink
- Active Engagements: count in violet
- Open Slots: count in cyan
- Revenue MTD: dollar amount in green

Leads table (FreeAssessment records):
Header row: violet bg. Columns: Name, Company, Score, Maturity, Submitted, Converted, Actions.
Score column: color-coded pill — red bg <40, yellow 41-65, green 66+.
Converted: green checkmark or grey dash.
Actions: "View" link in violet, "Mark Converted" link in pink (shows only if not converted).
Alternate row background slightly lighter dark.

Right column:
Quick Actions card (stacked full-width buttons):
"+ Add Availability Slots" — outlined violet
"+ Create Engagement" — outlined violet  
"Upload Resource" — outlined violet

Below KPIs: Active Engagements list.
Each row: client name, service type pill (violet), status pill, next session date, "Manage →" violet link.
Compact rows with subtle separator lines.

---

## PAGE 8 — Session Booking

Design a session booking page. Background: #0F0618. Same token system.

Header: "Book a Session" Geist Mono 32px.
Session type selector: pill tab row — "Discovery Call", "Strategy Session", "Audit Follow-up".
Active tab: violet fill. Inactive: dark outlined.

Calendar section:
Month grid view. Cell layout: 40x40px.
Available dates: violet bg light (20% opacity), date number white.
Past dates: grey opacity 0.2.
Today: cyan outline.
Selected date: solid violet, white number.
Unavailable: no styling, greyed number.

On date click: right panel slides in (or appears below on mobile).
Available time slots as pill buttons. Selected: solid violet. Unselected: outlined violet.
Slots pulled from Availability entity.

Notes field below slots: dark textarea, violet focus border, placeholder "Anything I should know before we meet?"

CTA: "Confirm Booking →" full-width violet. 
For paid session types: "You'll complete $1,500 payment via Calendly" note in grey italic above button.
