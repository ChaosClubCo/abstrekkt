# The Prompt — Automation Stack Setup Guide

**3 n8n workflows + 2 Zapier zaps + Notion databases**
**Estimated setup time: 6-8 hours (weekend blitz)**

---

## Step 0: Environment Variables

Set these in your n8n instance under **Settings → Environment Variables** (or in your `.env` / Docker Compose):

```env
# === CLAUDE API ===
# Create at: https://console.anthropic.com/settings/keys
# Store as HTTP Header Auth credential in n8n:
#   Header Name: x-api-key
#   Header Value: sk-ant-api03-...

# === NOTION ===
# Create integration at: https://www.notion.so/my-integrations
# Share each database with the integration
NOTION_RESEARCH_INBOX_DB_ID=<your-database-id>
NOTION_NEWSLETTER_DRAFTS_DB_ID=<your-database-id>
NOTION_LEAD_PIPELINE_DB_ID=<your-database-id>

# === SLACK ===
# n8n Slack credential (OAuth2)
SLACK_NOTIFY_CHANNEL=#ai-scanner

# === EMAIL ===
# Gmail credential in n8n (OAuth2)
NOTIFY_EMAIL_FROM=your@gmail.com
NOTIFY_EMAIL_TO=your@gmail.com

# === N8N HOST (for error links) ===
N8N_HOST=https://your-n8n-instance.com
```

### Claude API Credential in n8n

1. Go to **Credentials → New → Header Auth**
2. Name: `Anthropic API`
3. Header Name: `x-api-key`
4. Header Value: `sk-ant-api03-your-key-here`
5. Save — this is referenced by all "Claude Score" and "Claude Brief" nodes

---

## Step 1: Create Notion Databases

### Database 1: Research Inbox

Create a new full-page database in Notion with these properties:

| Property | Type | Options |
|----------|------|---------|
| Name (title) | Title | — |
| Source | Select | Anthropic News, Anthropic Engineering, OpenAI Blog, Google AI Blog, Microsoft AI Blog, TechCrunch AI, The Verge AI, VentureBeat AI, Techmeme, Wired AI, HN AI Filtered, Vercel Blog, Supabase Blog, Cursor Blog, Ahead of AI, The Algorithmic Bridge, The Hacker News, Krebs on Security, Cloudflare Blog, Simon Willison |
| URL | URL | — |
| Relevance Score | Number | Format: Number |
| Category | Select | ai_labs, enterprise, developer, security, research, product_launch, unknown |
| Newsletter Tier | Select | tier1_exec, tier2_tech, tier3_builder, all |
| Newsletter Angle | Rich Text | — |
| Summary | Rich Text | — |
| Score Reason | Rich Text | — |
| Status | Select | new, reviewed, used, archived |
| Date Found | Created Time | — |
| Edition Used In | Rich Text | — |

**Important:** Share this database with your Notion integration. Copy the database ID from the URL:
`https://notion.so/your-workspace/DATABASE_ID_HERE?v=...`

### Database 2: Newsletter Drafts

| Property | Type | Options |
|----------|------|---------|
| Name (title) | Title | — |
| Status | Select | draft, review, ready, published, archived |
| Type | Select | research_brief, edition, social_pack |
| Items Count | Number | — |
| Week Of | Rich Text | — |
| Published At | Rich Text | — |
| Created | Created Time | — |

### Database 3: Lead Pipeline

| Property | Type | Options |
|----------|------|---------|
| Name (title) | Title | — |
| Company | Rich Text | — |
| Email | Email | — |
| What They Need | Rich Text | — |
| Budget Range | Select | Under $1K, $1K-5K, $5K-15K, $15K+ |
| Stage | Select | New Lead, Qualified, Proposal, Active, Closed Won, Closed Lost |
| Source | Select | Website Form, LinkedIn, Substack, Referral, Other |
| Notes | Rich Text | — |
| Created | Created Time | — |
| Last Contact | Date | — |

---

## Step 2: Import n8n Workflows

### Import Process (for each workflow):

1. Open n8n → **Workflows → Import from File**
2. Select the JSON file
3. The workflow will appear with all nodes connected
4. **Configure credentials** on each node that needs them:
   - All "Claude Score" / "Claude Brief" nodes → select your Anthropic API HTTP Auth credential
   - All "→ Notion" / "Get Week's Research" nodes → select your Notion credential
   - All "→ Slack" / "Error → Slack" nodes → select your Slack credential
   - All "→ Email" nodes → select your Gmail credential
5. **Test with Manual Trigger** before activating the schedule

### Workflow 1: `01-ecosystem-scanner.json`
- **Schedule:** Daily 6 AM CT
- **What it does:** Fetches 20 RSS feeds → parses items → Claude scores each for relevance → items scoring ≥ 7 write to Notion Research Inbox → daily digest to Slack + email
- **Test:** Click Manual Trigger, watch execution. Expect ~15-25 items in Notion after first run.
- **Tuning:** After 3 days, review scores. If too many low-quality items pass, raise threshold to 8 in the Filter node. If too few, lower to 6.

### Workflow 2: `02-research-brief-generator.json`
- **Schedule:** Friday 8 AM CT
- **What it does:** Pulls all "new" items from Research Inbox → compiles into structured prompt → Claude generates 3-tier newsletter brief → saves draft to Newsletter Drafts DB → marks source items as "used"
- **Test:** Requires at least a few items in Research Inbox first. Run Scanner once, then test this.
- **Your role:** Review the draft in Notion. Edit. Change status to "ready" when satisfied.

### Workflow 3: `03-newsletter-publisher.json`
- **Trigger:** Manual or webhook
- **What it does:** Pulls the latest "ready" draft from Newsletter Drafts → extracts content → Claude generates LinkedIn + Twitter posts → logs social posts to Notion → marks draft as "published" → notifies Slack
- **Your role:** After this runs, copy newsletter content to Substack and hit publish. Copy social posts from Notion and publish manually (or connect Zapier auto-post).

---

## Step 3: Zapier Zaps

### Zap 1: Social Auto-Post (Optional)

If you want to skip manual social posting, set up these 2 Zapier zaps:

**LinkedIn Auto-Post:**
```
Trigger: Notion → Updated Database Item
  Database: Newsletter Drafts (or Social Log)
  Filter: Status = "ready_to_post"
  
Action: LinkedIn → Create Share Update
  Text: {{LinkedIn property from Notion}}
  Visibility: Public
```

**Twitter/X Auto-Post:**
```
Trigger: Notion → Updated Database Item
  Database: Newsletter Drafts (or Social Log)  
  Filter: Status = "ready_to_post"
  
Action: Twitter → Create Tweet
  Text: {{Twitter property from Notion}}
```

**Or simpler: Just copy-paste from Notion.** Auto-posting is nice but not essential for launch. Add it week 2.

### Zap 2: Lead Capture

```
Trigger: Tally (or Typeform or WordPress form plugin)
  → New Submission

Action 1: Notion → Create Database Item
  Database: Lead Pipeline
  Name: {{respondent_name}}
  Company: {{company}}  
  Email: {{email}}
  What They Need: {{message}}
  Stage: "New Lead"
  Source: "Website Form"

Action 2: Gmail → Send Email
  To: your@gmail.com
  Subject: "🔔 New consulting lead: {{respondent_name}} — {{company}}"
  Body: "Name: {{name}}\nCompany: {{company}}\nEmail: {{email}}\nNeeds: {{message}}"

Action 3: Gmail → Send Email  
  To: {{respondent_email}}
  Subject: "Thanks for reaching out — Kyle Rosebrook"
  Body: "Hi {{first_name}},\n\nThanks for reaching out. I typically respond within 48 hours.\n\nIn the meantime, you might find the latest edition of The Prompt helpful: [Substack link]\n\nBest,\nKyle"
```

---

## Step 4: WordPress Setup

### Contact Form

Install **Tally** (embed) or **WPForms Lite** (free) with these fields:

- Name (required)
- Email (required)
- Company (required)
- What do you need help with? (textarea, required)
- Budget range (dropdown: Under $1K, $1K-5K, $5K-15K, $15K+)

Connect to Zapier via webhook or native integration.

### Pages to Create

1. **Home** — positioning statement, latest newsletter embed, consulting CTA
2. **About** — your background, what you do, FlashFusion/Intinc credibility signals
3. **Services** — AI Workflow Audit ($2,500), AI Integration Consulting (custom), Workshop/Training (custom)
4. **Blog** — evergreen SEO content (NOT newsletter republishing)
5. **Contact** — form connected to Zapier → Notion pipeline

---

## Step 5: Weekend Blitz Sequence

### Saturday Morning (4 hrs)
1. [ ] Create 3 Notion databases (30 min)
2. [ ] Set n8n environment variables + Claude API credential (15 min)
3. [ ] Import workflow 01, configure credentials (30 min)
4. [ ] Run manual test of workflow 01 (15 min)
5. [ ] Debug any feed parsing issues (1 hr)
6. [ ] Activate workflow 01 on schedule (5 min)
7. [ ] Import workflow 02, configure credentials (30 min)
8. [ ] Verify workflow 02 structure (defer full test to after scanner runs) (15 min)

### Saturday Afternoon (4 hrs)
1. [ ] Import workflow 03, configure credentials (30 min)  
2. [ ] Set up Substack account, brand it (30 min)
3. [ ] WordPress: Install theme, create pages, add contact form (2 hrs)
4. [ ] Connect Tally/form to Zapier → Notion lead pipeline (30 min)
5. [ ] Set up Zapier lead capture auto-reply (30 min)

### Sunday Morning (3 hrs)
1. [ ] Review first scanner run results in Notion (30 min)
2. [ ] Tune Claude scoring prompt if needed (30 min)
3. [ ] Manually trigger workflow 02 (research brief) and review output (30 min)
4. [ ] Edit first newsletter draft in Notion (1 hr)
5. [ ] Run workflow 03 (publisher), review social posts (30 min)

### Sunday Afternoon (2 hrs)
1. [ ] Copy newsletter to Substack, format, and schedule first edition (1 hr)
2. [ ] Publish social posts (LinkedIn + X) (30 min)
3. [ ] Final check: all 3 workflows active, Zapier zaps on, form working (30 min)

---

## Maintenance (2 hrs/week)

| Day | Task | Time |
|-----|------|------|
| Mon | Quick review of weekend scanner results in Notion | 10 min |
| Wed | Review mid-week scanner results, flag any breaking signals | 15 min |
| Fri | Review auto-generated research brief, edit draft | 45 min |
| Sat | Publish newsletter, review social posts, check pipeline | 30 min |
| As needed | Respond to inbound leads within 48 hrs | 20 min |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Feed returns empty | Check URL manually in browser. Some feeds require User-Agent header. Add `User-Agent: Mozilla/5.0` to Fetch Feed HTTP Request options. |
| Claude returns unparseable JSON | The Code nodes have fallback handling. Check n8n execution log for the raw response. Common fix: ensure prompt says "no markdown fences." |
| Notion write fails | Verify database is shared with integration. Check property names match EXACTLY (case-sensitive). |
| Rate limiting on Claude API | The workflows use batched requests with retry + backoff. If you hit limits consistently, add a Wait node (2-3 sec) between Claude calls. |
| Scanner finds 0 items | Likely all items are older than 48hrs. Increase the cutoff window in Parse Items code node (line: `48 * 60 * 60 * 1000`). |
| Workflow timeout | Default is 900s (15 min) for scanner. If you have slow feeds, increase in workflow Settings. |
