# Automation Foundation Blueprint
## Weekend Blitz → Maintain Mode

**Purpose:** Build the automation plumbing that makes Paths 1 (Consulting) + 3 (Newsletter) viable without eating your evenings.

**Time model:** ~16 hours across one weekend, then ≤2 hours/week maintenance.

**Constraint reality check:** You have n8n cloud (krosebrook.app.n8n.cloud), Zapier (connected), Make (available), plus Claude API, Gmail, Google Calendar, Notion, Slack, GitHub, PostHog, Resend, and Cloudflare all wired up. This blueprint uses what you already have.

---

## Platform Assignment (Per Workflow)

| Category | Platform | Why |
|----------|----------|-----|
| Content research & aggregation | **n8n** | Multi-source RSS/API → Claude API summarization → Notion. Needs code nodes for parsing. |
| Newsletter production pipeline | **n8n** (draft) + **Zapier** (distribute) | n8n handles the complex assembly. Zapier handles the last-mile delivery to email platform + social. |
| Lead capture & CRM | **Zapier** | Simple trigger→action chains. Already connected. No complex logic needed. |
| Social distribution | **Zapier** + **Make** (repurposing) | Zapier for cross-posting. Make for content transformation (long→thread, long→short). |
| Personal daily/home | **n8n** (morning briefing) + **Google Calendar native** + **Zapier** (simple reminders) | Morning briefing is a complex aggregation (n8n). Everything else is simple trigger→notify. |

---

## WSJF Build Order

This is the exact sequence for the weekend. Each workflow has an estimated build time. The order maximizes value delivered per hour invested.

### PRIORITY 1 — Morning Briefing (Personal) ⏱ 2 hours
**WSJF Rationale:** This runs every single day. Every other automation benefits from you being organized. Build this first.

**Platform:** n8n

**Trigger:** Cron → 6:00 AM CT daily

**Flow:**
```
Cron (6:00 AM)
  → Google Calendar API: Fetch today's events
  → Gmail API: Fetch unread count + flagged emails (subject lines only)
  → Weather API: Mundelein, IL forecast
  → Notion API: Fetch today's tasks from task database
  → Code node: Assemble briefing markdown
  → Gmail: Send briefing email to self
  → (Optional) Slack: Post to personal channel
```

**Output:** One email at 6 AM with:
- Today's calendar (meetings, blocks, deadlines)
- Unread/flagged email summary
- Weather (dress/commute planning)
- Top 3 priority tasks from Notion
- One-line reminder of current sprint focus

**Acceptance criteria:**
- Email arrives by 6:05 AM CT every day
- Calendar events show time + title + attendees
- Weather shows high/low + precipitation %
- Notion tasks sorted by priority
- Entire email is scannable in <30 seconds

**Error handling:**
- If any API fails, send partial briefing with "[Service unavailable]" placeholder
- Error notification to Slack

---

### PRIORITY 2 — Content Research Aggregator ⏱ 3 hours
**WSJF Rationale:** Feeds the newsletter AND your consulting authority. Without this, you're manually scanning 15+ sources.

**Platform:** n8n

**Trigger:** Cron → runs every 6 hours (4x daily)

**Flow:**
```
Cron (every 6h)
  → RSS Feed node (parallel):
      - Anthropic Blog
      - OpenAI Blog
      - Google AI Blog
      - The Verge / AI section
      - TechCrunch / AI section
      - Hacker News (top 30, filtered for AI/ML/agents/MCP)
      - ArXiv (cs.AI, cs.CL — last 24h)
      - Ars Technica AI
      - The Information (if subscribed)
      - Simon Willison's blog
  → Merge node: Combine all items
  → Code node: Deduplicate by URL, filter for recency (<24h)
  → Code node: Score relevance (keyword matching against priority terms:
      MCP, agents, Claude, GPT, Gemini, workflow, automation,
      enterprise AI, security, observability, infrastructure)
  → IF node: Score ≥ threshold → proceed; else → discard
  → Claude API (via HTTP Request node):
      System: "You are an AI industry analyst. Summarize this article
      in 2-3 sentences. Rate signal strength 1-5. Identify which
      audience tier it serves: Non-Tech, Tech Department, AI Team."
      User: {article_title + article_body_or_description}
  → Notion API: Create page in "Research Inbox" database
      Properties:
        - Title: article title
        - Source: publication name
        - URL: original link
        - Summary: Claude summary
        - Signal Strength: 1-5 rating
        - Audience Tier: Non-Tech / Tech Dept / AI Team
        - Date Found: timestamp
        - Status: "Unreviewed"
        - Tags: auto-extracted keywords
```

**Notion Database Schema (Research Inbox):**

| Property | Type | Purpose |
|----------|------|---------|
| Title | Title | Article headline |
| Source | Select | Publication name |
| URL | URL | Original link |
| Summary | Rich text | Claude-generated 2-3 sentence summary |
| Signal Strength | Number (1-5) | Relevance score |
| Audience Tier | Multi-select | Non-Tech / Tech Dept / AI Team |
| Date Found | Date | When aggregator captured it |
| Status | Select | Unreviewed → Selected → Used → Archived |
| Tags | Multi-select | Auto-extracted keywords |
| Edition | Relation | Links to newsletter edition when used |

**Acceptance criteria:**
- Notion inbox receives 10-30 scored articles per day
- Duplicates eliminated (URL-based dedup)
- Claude summaries are 2-3 sentences, actionable, not generic
- Signal strength scoring correctly prioritizes agent/MCP/enterprise content
- Zero manual effort to populate — you only review and select

**Error handling:**
- RSS feed timeout → skip, log, continue with remaining feeds
- Claude API rate limit → queue and retry with exponential backoff
- Notion API failure → write to local JSON fallback, alert via Slack

---

### PRIORITY 3 — Newsletter Production Pipeline ⏱ 4 hours
**WSJF Rationale:** This is the content engine for Path 3. Without it, newsletter = manual labor = unsustainable.

**Platform:** n8n (assembly) + Zapier (distribution)

**Phase A: Draft Assembly (n8n)**

**Trigger:** Manual webhook (you trigger when ready to draft) OR Cron (every Monday 8 AM)

**Flow:**
```
Trigger
  → Notion API: Fetch all items from Research Inbox where Status = "Selected"
  → Code node: Group by Audience Tier
  → Code node: Sort each group by Signal Strength (desc)
  → Claude API (HTTP Request):
      System: "You are the editor of 'The Prompt', an AI intelligence
      newsletter published by INT Inc. You write in a direct, no-fluff
      style. The newsletter has 3 tiers:
      Tier 1 (Non-Tech): Business impact, plain language, no jargon.
      Tier 2 (Tech Department): Implementation relevance, tool mentions.
      Tier 3 (AI Team): Deep technical, architecture, security implications.

      Given these selected articles, draft each tier section.
      Each section: 3-5 items, each item gets a headline, 2-3 sentence
      summary, and a 'So What' line explaining why it matters to that audience.
      Include a 'Last Week We Said' continuity note at the top of each tier."

      User: {JSON of selected articles grouped by tier}
  → Notion API: Create draft page in "Newsletter Drafts" database
      Properties:
        - Edition: "Week [N] - [Date]"
        - Tier 1 Draft: rich text
        - Tier 2 Draft: rich text
        - Tier 3 Draft: rich text
        - Status: "Draft"
  → Gmail: Send yourself notification "Draft ready for review"
  → Slack: Post to personal channel "Newsletter draft Week [N] ready"
```

**Phase B: Distribution (Zapier)**

**Trigger:** Notion database item status changes to "Approved"

**Flow:**
```
Notion trigger: Status → "Approved"
  → Formatter: Extract Tier 1 content → format as HTML email
  → Email platform (Beehiiv/Substack/Resend): Send Tier 1 edition
  → Formatter: Extract Tier 2 content → format as Teams markdown
  → (Manual or webhook): Post to Teams channel
  → Formatter: Extract Tier 3 content → format as detailed brief
  → Gmail: Send Tier 3 to AI Team distribution list
  → Notion: Update status to "Published"
  → Notion: Update "Last Published" date
```

**Acceptance criteria:**
- One webhook click generates a structured 3-tier draft
- Draft appears in Notion within 5 minutes
- You review/edit in Notion (10-15 min), flip status to "Approved"
- Distribution fires automatically across all channels
- Total newsletter production time: <45 minutes (vs. 3-4 hours manual)

**Error handling:**
- Claude API failure → Slack alert + partial draft with "[GENERATION FAILED — manual required]" markers
- Email send failure → retry 3x with backoff, then Slack alert
- Notion write failure → email fallback with draft content attached

---

### PRIORITY 4 — Social Distribution ⏱ 2 hours
**WSJF Rationale:** Multiplies every piece of content. No point creating content nobody sees.

**Platform:** Zapier (cross-post) + Make (repurpose)

**Zapier Flow — Cross-Post:**
```
Trigger: Newsletter published (webhook from Phase B)
  → Path A: LinkedIn
      - Format: Strip to key insight + 3 bullet takeaways + CTA
      - Post to LinkedIn via LinkedIn API
  → Path B: Twitter/X
      - Format: Compress to <280 char hook + thread (3-5 tweets)
      - Post via Twitter API
  → Path C: (Future) Bluesky, Threads
```

**Make Flow — Repurpose:**
```
Trigger: Webhook from Zapier on publish
  → Router:
      Branch 1: Extract top insight → generate LinkedIn article draft → save to Notion "Content Queue"
      Branch 2: Extract 3 key points → generate Twitter thread → save to Notion "Content Queue"
      Branch 3: Extract contrarian take → generate short-form post → save to Notion "Content Queue"
  → Each branch uses Claude API for reformatting
  → All outputs land in Notion "Content Queue" database for review before posting
```

**Key design decision:** Nothing posts automatically except the newsletter cross-posts. Repurposed content goes to a review queue. This prevents low-quality auto-posts from damaging your professional brand.

**Acceptance criteria:**
- Newsletter publish triggers cross-posts within 15 minutes
- Repurposed content variants appear in Notion queue within 30 minutes
- LinkedIn format is professional paragraph style (not thread)
- Twitter format is hook + numbered thread
- Zero auto-posts of repurposed content without review

---

### PRIORITY 5 — Lead Capture & CRM ⏱ 2 hours
**WSJF Rationale:** Doesn't matter until content is flowing, but you need it ready when inbound starts.

**Platform:** Zapier

**Flow:**
```
Trigger: Form submission (Typeform, Tally, or simple Google Form)
  → Zapier Filter: Qualify (has company name + use case description)
  → Notion API: Create record in "Consulting Pipeline" database
      Properties:
        - Name
        - Email
        - Company
        - Use Case (free text)
        - Source (newsletter, LinkedIn, referral, other)
        - Status: "New Lead"
        - Date Received
        - Estimated Value (blank — you fill in)
  → Gmail: Send auto-reply email
      Subject: "Got your message — here's what happens next"
      Body: Professional acknowledgment + typical engagement scope +
            timeline expectation (48h response)
  → Slack: Notify personal channel "New consulting lead: [Name] @ [Company]"
  → (Future) Google Calendar: Auto-block 30-min slot for lead review
```

**Notion CRM Schema (Consulting Pipeline):**

| Property | Type | Purpose |
|----------|------|---------|
| Name | Title | Contact name |
| Email | Email | Contact email |
| Company | Text | Company name |
| Use Case | Rich text | What they need |
| Source | Select | Newsletter / LinkedIn / Referral / Other |
| Status | Select | New Lead → Contacted → Scoping → Proposal → Active → Closed |
| Date Received | Date | When form submitted |
| Estimated Value | Number | $ value you assign |
| Next Action | Text | Your next step |
| Notes | Rich text | Conversation history |

**Acceptance criteria:**
- Form → Notion record in <2 minutes
- Auto-reply sends within 1 minute of submission
- Slack notification arrives immediately
- No leads lost (dead letter queue for failed writes)

---

### PRIORITY 6 — Personal Home & Life Automations ⏱ 3 hours
**WSJF Rationale:** Quality-of-life. These reduce the ambient cognitive load that steals focus from everything else.

**6a. Weekly Review Automation (n8n) — 1 hour**
```
Cron: Sunday 7 PM CT
  → Notion API: Fetch tasks completed this week
  → Notion API: Fetch tasks still open
  → Notion API: Fetch newsletter edition status
  → Notion API: Fetch consulting pipeline status
  → Google Calendar API: Fetch next week's calendar
  → Claude API: Generate weekly review summary
      "Here's what got done, what's still open, what's on deck.
       Flag anything that's been open >7 days."
  → Gmail: Send weekly review email
  → Notion: Create "Weekly Review" page with summary
```

**6b. Household Reminders (Zapier) — 30 min**
```
Scheduled triggers:
  → Trash night reminder: Tuesday 7 PM → push notification
  → Bill pay check: 1st and 15th → email summary
  → Grocery list prompt: Saturday 9 AM → "Add anything to the list?"
  → (Custom): Add whatever recurring home tasks you forget
```

**6c. Focus Mode Automation (n8n) — 1 hour**
```
Trigger: Google Calendar event with "[FOCUS]" in title starts
  → Slack: Set status to "🔒 Focus Mode — back at [end time]"
  → Slack: Pause notifications (DND)
  → (Optional) Notion: Log focus session start

Trigger: Google Calendar "[FOCUS]" event ends
  → Slack: Clear status
  → Slack: Resume notifications
  → Notion: Log focus session end + duration
```

**6d. End-of-Day Shutdown (n8n) — 30 min**
```
Cron: 6:00 PM CT weekdays
  → Notion API: Fetch incomplete tasks for today
  → Gmail: Send "shutdown checklist" email
      - Tasks not finished (carry forward?)
      - Tomorrow's first meeting
      - One thing to prep tonight
  → Slack: Set status to "Done for today"
```

---

## Weekend Blitz Schedule

### Saturday (8 hours)

| Time | Build | Est. Hours |
|------|-------|------------|
| 8:00 AM | **Morning Briefing** (Priority 1) | 2h |
| 10:00 AM | Break + test morning briefing | 0.5h |
| 10:30 AM | **Content Research Aggregator** (Priority 2) | 3h |
| 1:30 PM | Lunch | 1h |
| 2:30 PM | **Newsletter Draft Assembly** (Priority 3, Phase A) | 2.5h |
| 5:00 PM | Test end-to-end: aggregator → draft pipeline | 1h |

**Saturday exit criteria:** Morning briefing running. Research inbox populating. Draft generation working on manual trigger.

### Sunday (8 hours)

| Time | Build | Est. Hours |
|------|-------|------------|
| 8:00 AM | **Newsletter Distribution** (Priority 3, Phase B) | 1.5h |
| 9:30 AM | **Social Distribution** (Priority 4) | 2h |
| 11:30 AM | Break + test newsletter → social chain | 0.5h |
| 12:00 PM | **Lead Capture & CRM** (Priority 5) | 2h |
| 2:00 PM | Lunch | 0.5h |
| 2:30 PM | **Personal/Home Automations** (Priority 6) | 2.5h |
| 5:00 PM | Full integration test + fix broken connections | 1h |

**Sunday exit criteria:** All 6 priority workflows live. End-to-end test passes. Error notifications configured for all workflows.

---

## Maintenance Mode (Post-Blitz)

**Weekly maintenance budget: ≤2 hours**

| Task | Frequency | Time |
|------|-----------|------|
| Review Research Inbox, select articles | 2x/week | 20 min each |
| Review + edit newsletter draft | 1x/week | 15 min |
| Approve newsletter → trigger distribution | 1x/week | 5 min |
| Review social content queue | 2x/week | 10 min each |
| Check n8n execution logs for failures | 1x/week | 10 min |
| Respond to consulting leads | As needed | 15 min each |

**Monthly maintenance:**
- Review RSS feed list (add/remove sources): 15 min
- Update Claude prompts if output quality drifts: 30 min
- Review Notion databases, archive old items: 15 min
- Check API rate limits and usage costs: 10 min

---

## Cost Estimate (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| n8n Cloud | $20/mo | Your existing instance |
| Zapier | Existing plan | Already connected |
| Make | $9/mo (free tier may suffice) | Only for content repurposing |
| Claude API | ~$5-15/mo | Summarization + draft generation |
| Resend | Free tier | <100 emails/day |
| **Total** | **~$35-45/mo** | |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    DAILY LAYER                           │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Morning    │  │   Focus      │  │  End-of-Day  │  │
│  │   Briefing   │  │   Mode       │  │  Shutdown    │  │
│  │   (n8n)      │  │   (n8n)      │  │  (n8n)       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │  Household   │  │   Weekly     │                     │
│  │  Reminders   │  │   Review     │                     │
│  │  (Zapier)    │  │   (n8n)      │                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
        │                                    │
        ▼                                    ▼
┌─────────────────────────────────────────────────────────┐
│                  CONTENT ENGINE                          │
│                                                         │
│  ┌──────────────┐     ┌──────────────┐                  │
│  │  Research    │────▶│  Notion      │                  │
│  │  Aggregator  │     │  Research    │                  │
│  │  (n8n)       │     │  Inbox       │                  │
│  │  4x daily    │     │              │                  │
│  └──────────────┘     └──────┬───────┘                  │
│                              │ You select articles      │
│                              ▼                          │
│                       ┌──────────────┐                  │
│                       │  Newsletter  │                  │
│                       │  Draft Gen   │                  │
│                       │  (n8n)       │                  │
│                       └──────┬───────┘                  │
│                              │ You review + approve     │
│                              ▼                          │
│                       ┌──────────────┐                  │
│                       │  Newsletter  │                  │
│                       │  Distribution│                  │
│                       │  (Zapier)    │                  │
│                       └──────┬───────┘                  │
│                              │                          │
│                              ▼                          │
│                       ┌──────────────┐                  │
│                       │  Social      │                  │
│                       │  Cross-Post  │──▶ LinkedIn      │
│                       │  (Zapier)    │──▶ Twitter/X     │
│                       └──────┬───────┘                  │
│                              │                          │
│                              ▼                          │
│                       ┌──────────────┐                  │
│                       │  Content     │                  │
│                       │  Repurpose   │──▶ Notion Queue  │
│                       │  (Make)      │                  │
│                       └──────────────┘                  │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                  BUSINESS LAYER                          │
│                                                         │
│  ┌──────────────┐     ┌──────────────┐                  │
│  │  Lead        │────▶│  Notion      │                  │
│  │  Capture     │     │  Consulting  │                  │
│  │  (Zapier)    │     │  Pipeline    │                  │
│  └──────────────┘     └──────────────┘                  │
│         │                                               │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │  Auto-Reply  │                                       │
│  │  + Slack     │                                       │
│  │  Notify      │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Human Touchpoints (Where YOU Are Required)

The entire system is designed around **5 decision points per week** that only you can make:

1. **Select articles** from Research Inbox (2x/week, 20 min) — your editorial judgment
2. **Review + edit** newsletter draft (1x/week, 15 min) — your voice, your insights
3. **Approve** newsletter for distribution (1x/week, 2 min) — flip a Notion status
4. **Review** social content queue (2x/week, 10 min) — quality gate before posting
5. **Respond** to consulting leads (as needed) — relationship building

Everything else is automated.

---

## Security Notes

- All API keys stored in n8n credential manager and Zapier's built-in secret storage. Never in workflow JSON.
- Claude API calls use your personal API key, not Intinc's. Keep these completely separate.
- Consulting lead data (names, emails, companies) lives in Notion only. No third-party CRM with data sharing.
- Newsletter subscriber emails managed by email platform (Beehiiv/Substack), not a custom database. They handle GDPR/CAN-SPAM compliance.
- n8n cloud instance should have 2FA enabled on your account.
- Webhook URLs for manual triggers should use n8n's built-in auth headers, not open endpoints.

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**[GENERATED]** Time estimates are based on typical n8n/Zapier build times for someone at your skill level. Actual time may vary — the Research Aggregator (Priority 2) is the most likely to overrun because RSS parsing + Claude API integration + Notion write has the most moving parts.

**[GENERATED]** Cost estimate of $35-45/mo assumes Claude API usage stays under ~100K tokens/day for summarization. If you scale to more sources or longer summaries, this could hit $30-50/mo for Claude API alone.

**Counterexample:** Many automation setups die within 30 days because the builder doesn't account for API changes, rate limit hits, or RSS feeds going stale. The maintenance schedule above is the mitigation — skip it and the system rots.

**Contradiction:** This blueprint assumes you'll complete all 6 priorities in one weekend. If you hit a wall on Saturday, Priority 1 (Morning Briefing) + Priority 2 (Research Aggregator) are the two that deliver the most standalone value. Everything else can wait a week.

**Gap:** This blueprint doesn't cover which email platform you'll use for the public newsletter (Beehiiv, Substack, Buttondown, Resend DIY). That decision affects the distribution automation design. Flag this before building Priority 3 Phase B.
