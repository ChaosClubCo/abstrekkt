# The Prompt — Automation Stack Setup Guide

**4 workflows. 1 weekend. Here's how to deploy them.**

---

## Pre-Flight Checklist

Before you open n8n, get these done. Each takes 5-15 minutes.

### 1. Notion Databases (30 min total)

Create **3 databases** in a dedicated Notion workspace or page:

**Database A: Research Inbox**

| Property | Type | Options |
|----------|------|---------|
| Name | Title | (auto) |
| Source | Select | Anthropic News, Anthropic Engineering, OpenAI, Google AI, Microsoft AI, TechCrunch AI, The Verge AI, VentureBeat AI, Ars Technica, Techmeme, Wired AI, HN AI Filtered, Product Hunt, Cursor Blog, Vercel Blog, Supabase Blog, Ahead of AI, Algorithmic Bridge, The Hacker News, Krebs on Security, Cloudflare Blog, Simon Willison |
| URL | URL | — |
| Score | Number | — |
| Category | Select | ai_labs, enterprise, developer, security, research, product_launch, infrastructure |
| Newsletter Tier | Select | tier1_exec, tier2_tech, tier3_builder, all |
| Newsletter Angle | Rich Text | — |
| Status | Select | new, reviewed, used, archived |
| Date Found | Date | — |

**Database B: Lead Pipeline**

| Property | Type | Options |
|----------|------|---------|
| Name | Title | (format: "Name — Company") |
| Email | Email | — |
| Company | Rich Text | — |
| Need | Rich Text | — |
| Budget Range | Select | Under $2K, $2K-$5K, $5K-$10K, $10K+, Not specified |
| Source | Select | Newsletter, LinkedIn, Referral, WordPress, Other |
| Stage | Select | New Lead, Qualified, Proposal, Active, Closed Won, Closed Lost |
| Received | Date | — |
| Notes | Rich Text | — |

**Database C: Social Queue**

| Property | Type | Options |
|----------|------|---------|
| Name | Title | — |
| LinkedIn | Rich Text | — |
| Twitter Thread | Rich Text | — |
| Status | Select | ready_to_post, posted, skipped |
| Posted Date | Date | — |

**Save each database's ID.** In Notion, open the database as a full page. The URL looks like:
```
https://www.notion.so/YOUR_WORKSPACE/DATABASE_ID?v=VIEW_ID
```
Copy the DATABASE_ID (32-character hex string before the `?`).

---

### 2. Anthropic API Key

1. Go to https://console.anthropic.com/
2. Create or use existing API key
3. Save it — you'll enter it in n8n's credential manager

### 3. n8n Credentials Setup

Create these credentials in your n8n instance:

**Credential 1: Anthropic API (Header Auth)**
- Type: Header Auth
- Name: `anthropic-api`
- Header Name: `x-api-key`
- Header Value: `sk-ant-xxxxx` (your API key)

**Credential 2: Notion**
- Type: Notion API
- Create a Notion integration at https://www.notion.so/my-integrations
- Give it access to all 3 databases
- Follow: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.notion/

**Credential 3: Email (for notifications)**
- Type: SMTP or Gmail
- Used for daily summaries, error alerts, lead notifications

---

## Import Workflows

### Step 1: Import Each JSON File

In n8n: **Workflows** → **Add Workflow** → **Import from File**

Import all four:
- `workflow-1-ecosystem-scanner.json`
- `workflow-2-brief-generator.json`
- `workflow-3-social-crosspost.json`
- `workflow-4-lead-capture.json`

### Step 2: Replace Placeholders

Search each workflow for these strings and replace:

| Placeholder | Replace With | Workflows |
|-------------|-------------|-----------|
| `YOUR_NOTION_DATABASE_ID_HERE` | Research Inbox DB ID | 1 |
| `YOUR_NOTION_RESEARCH_INBOX_ID` | Research Inbox DB ID | 2 |
| `YOUR_NOTION_DRAFTS_PAGE_ID` | Parent page for drafts | 2 |
| `YOUR_NOTION_SOCIAL_QUEUE_ID` | Social Queue DB ID | 3 |
| `YOUR_NOTION_LEAD_PIPELINE_ID` | Lead Pipeline DB ID | 4 |
| `YOUR_EMAIL_HERE` | Your email address | 1, 2, 4 |
| `YOUR_SUBSTACK_URL_HERE` | Substack publication URL | 3, 4 |

### Step 3: Assign Credentials

Click each API node and select the matching credential:
- All `Claude` HTTP Request nodes → `anthropic-api` Header Auth
- All `Notion` nodes → Your Notion credential
- All `Email` nodes → Your email/SMTP credential

### Step 4: Enable Notification Nodes

Several nodes are **disabled by default** (prevents accidental emails during testing). After configuring credentials, enable each grayed-out node:
- Workflow 1: `Notify Slack`, `Notify Email`, `Error Email`
- Workflow 2: `Notify Draft Ready`, `Error Email`
- Workflow 3: `Notify Ready`
- Workflow 4: `Notify You`, `Auto-Reply`

---

## Testing (Do This Before Activating Cron)

### Test 1: Ecosystem Scanner

1. Click **Manual Test Trigger** → "Test Workflow"
2. Watch nodes execute (green = success)
3. Check Notion Research Inbox — items should appear
4. **If Claude errors:** Verify API key, check credit balance
5. **If Notion errors:** Verify DB ID, check integration has access
6. **If RSS errors:** Some feeds may be down — check n8n logs for which ones

### Test 2: Brief Generator

1. Requires items in Research Inbox from Test 1
2. Click **Generate Brief** → "Test Workflow"
3. Draft page should appear in Notion
4. Claude may take 30-60 seconds (generating 4000 tokens)

### Test 3: Social Cross-Post

1. Paste sample newsletter text into `Draft Content` code node
2. Run workflow
3. Check Notion Social Queue for generated posts

### Test 4: Lead Capture

1. Activate workflow (webhook must be live)
2. Copy webhook URL from the `Lead Webhook` node
3. Test with curl:
```bash
curl -X POST YOUR_WEBHOOK_URL/webhook/lead-intake \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","company":"TestCo","need":"AI consulting","budget_range":"$2K-$5K","how_found":"Newsletter"}'
```
4. Check Notion Lead Pipeline + your email

---

## Go Live

Once all tests pass:

| Workflow | Activation |
|----------|-----------|
| 1 — Scanner | Activate the Schedule Trigger (runs daily 6 AM CT) |
| 2 — Brief | Leave manual — run Fridays when ready |
| 3 — Social | Leave manual — run after publishing newsletter |
| 4 — Lead | Keep active (webhook always listening) |

---

## Weekly Operating Rhythm

| Day | Action | Time |
|-----|--------|------|
| Mon–Fri | Scanner runs automatically at 6 AM | 0 min |
| Mon–Fri | Skim Notion inbox, star best items | 5-10 min |
| Friday | Run Brief Generator (Workflow 2) | 2 min |
| Saturday | Review + edit draft in Notion | 30-60 min |
| Saturday | Publish to Substack | 10 min |
| Saturday | Run Social Cross-Post (Workflow 3) | 2 min |
| Saturday | Review + post social content | 10 min |

**Total: ~60-90 min/week** for the full content + distribution engine.

---

## Monthly Maintenance

- [ ] Check all RSS feeds still returning content
- [ ] Review Claude scoring — adjust prompt if quality drifts
- [ ] Check Anthropic API costs
- [ ] Archive old Notion items
- [ ] Close stale leads
- [ ] Update feed list for new sources

---

## Cost Estimate

| Service | Monthly |
|---------|---------|
| n8n (self-hosted) | $0 |
| Claude API (Sonnet) | ~$5-15 |
| Notion | Free tier |
| Substack | Free |
| Tally.so (forms) | Free |
| **Total** | **$5-15/mo** |

---

## Troubleshooting

**Scanner produces 0 items:**
- Check if RSS feeds are accessible from your n8n host
- Some feeds (GitHub-hosted Olshansk) may go stale — replace with direct blog URLs
- The 24-hour filter in `Normalize Items` excludes old items. For first run, comment out the date filter.

**Claude returns parse errors:**
- Check API credit balance
- Verify `anthropic-version` header is `2023-06-01`
- Check that the model name `claude-sonnet-4-20250514` is current

**Notion node fails:**
- Verify database ID (32-char hex, no dashes)
- Ensure Notion integration has access to the specific database
- Check property names match exactly (case-sensitive)

**Webhook not receiving leads:**
- Workflow 4 must be **active** (not just saved)
- Webhook URL includes your n8n domain — verify it's accessible externally
- Check form tool's webhook configuration matches the URL exactly
