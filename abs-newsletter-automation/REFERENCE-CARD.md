# The Prompt — Automation Stack Reference Card

**Created:** 2026-03-21
**Status:** Notion databases LIVE, n8n workflows ready for import

---

## Notion (LIVE)

| Resource | ID | URL |
|----------|-----|-----|
| Operations Hub | `32aea14f-b167-8113-ab87-fd77660aecbc` | https://www.notion.so/32aea14fb1678113ab87fd77660aecbc |
| Research Inbox DB | `02dcdeff-6afe-43d6-a132-5882a14289dc` | https://www.notion.so/02dcdeff6afe43d6a1325882a14289dc |
| Newsletter Drafts DB | `a6e3058-5780-74fcc-98e3-dbdbfaf6f0d6` | https://www.notion.so/a6e3058578074fcc98e3dbdbfaf6f0d6 |
| Lead Pipeline DB | `ef2db0f0-ff8f-4341-803e-30a79c164196` | https://www.notion.so/ef2db0f0ff8f4341803e30a79c164196 |

**Notion Integration:** You still need to share all 3 databases with your Notion integration.
Go to each database → ••• → Connections → Add your "The Prompt n8n" integration.

---

## Slack (YOU CREATE)

Create these two channels, then add your bot:

1. `#ai-scanner` — Daily digests, brief notifications, lead alerts
2. `#ops-alerts` — Error alerts, feed health warnings

---

## n8n Workflows (IMPORT THESE)

| File | Schedule | What It Does |
|------|----------|-------------|
| `01-ecosystem-scanner.json` | Daily 6 AM CT | 20 RSS feeds → Claude filter → Notion Research Inbox |
| `02-research-brief-generator.json` | Friday 8 AM CT | Notion inbox → Claude synthesis → Research Brief |
| `03-newsletter-draft-assembly.json` | Manual trigger | Research brief → 3 tier drafts in Notion |
| `04-feed-health-monitor.json` | Daily 7 AM CT | Tests all feeds, alerts on failures |

**Import order:** 04 → 01 → 02 → 03

**After import, configure in each workflow:**
1. Click each HTTP Request node that calls Anthropic → Authentication → Generic Header Auth → Select your Anthropic credential
2. Click each HTTP Request node that calls Notion → Authentication → Generic Header Auth → Select your Notion credential
3. Click each Slack node → Select your Slack credential, verify channel names

**Notion database IDs are already hardcoded. No find-and-replace needed.**

---

## Zapier Zaps (YOU BUILD)

### Zap 1: Social Cross-Post
- Trigger: RSS → New Item in Feed (your Substack RSS)
- Action 1: LinkedIn → Create Share
- Action 2: Twitter → Create Tweet
- Action 3: Notion → Update Newsletter Drafts status to "published"

### Zap 2: Lead Capture
- Trigger: Tally → New Submission
- Action 1: Notion → Create page in Lead Pipeline DB (`ef2db0f0ff8f4341803e30a79c164196`)
- Action 2: Gmail → Send auto-reply
- Action 3: Slack → Message to #ai-scanner

---

## Credentials Needed

| Service | Credential Type in n8n | Where to Get |
|---------|----------------------|-------------|
| Anthropic | Header Auth (`x-api-key`) | console.anthropic.com → API Keys |
| Notion | Header Auth (`Authorization: Bearer ...`) | notion.so/my-integrations |
| Slack | Slack API (built-in) | api.slack.com/apps |

---

## Deployment Checklist

- [x] Notion Operations Hub page created
- [x] Notion Research Inbox database created (with schema)
- [x] Notion Newsletter Drafts database created (with schema)
- [x] Notion Lead Pipeline database created (with schema)
- [x] n8n workflow files generated with real database IDs
- [ ] Notion integration created and shared with all 3 databases
- [ ] Slack channels created: #ai-scanner, #ops-alerts
- [ ] n8n: Import workflow 04, test, activate
- [ ] n8n: Import workflow 01, set credentials, test, activate
- [ ] n8n: Import workflow 02, set credentials, test, activate
- [ ] n8n: Import workflow 03, set credentials, test
- [ ] Substack account created
- [ ] WordPress contact form live (Tally embed)
- [ ] Zapier Zap 1: Social cross-post configured
- [ ] Zapier Zap 2: Lead capture configured
- [ ] Monday AM: Verify workflow 01 ran automatically at 6 AM
