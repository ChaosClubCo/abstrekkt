# Portfolio Command Center - Complete Setup Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PORTFOLIO COMMAND CENTER v3                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐            │
│  │   TRIGGERS     │    │   PIPELINE     │    │   ENRICHMENT   │            │
│  ├────────────────┤    ├────────────────┤    ├────────────────┤            │
│  │ • n8n Schedule │───▶│ • GitHub API   │───▶│ • Audit Scan   │            │
│  │ • GH Actions   │    │ • Vercel API   │    │ • Cost Calc    │            │
│  │ • Manual UI    │    │ • Netlify API  │    │ • Dependencies │            │
│  │ • Webhook      │    │ • GCP Billing  │    │ • Health Score │            │
│  └────────────────┘    └────────────────┘    └────────────────┘            │
│                                                   │                         │
│                                                   ▼                         │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐            │
│  │   OUTPUTS      │◀───│   STORAGE      │◀───│   AI TRIAGE    │            │
│  ├────────────────┤    ├────────────────┤    ├────────────────┤            │
│  │ • React UI     │    │ • Notion DB    │    │ • Claude API   │            │
│  │ • CSV Export   │    │ • localStorage │    │ • Prioritize   │            │
│  │ • JSON Export  │    │ • Snapshots    │    │ • Consolidate  │            │
│  │ • Slack Alerts │    │ • History      │    │ • Risk Alerts  │            │
│  └────────────────┘    └────────────────┘    └────────────────┘            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │                    TEAM MANAGEMENT                          │            │
│  ├────────────────────────────────────────────────────────────┤            │
│  │ • Member profiles  • Project assignments  • Workload view  │            │
│  │ • Team structure   • Capacity planning    • Health by team │            │
│  └────────────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Features Summary

| Feature | Description | Tab |
|---------|-------------|-----|
| **Dashboard** | Overview stats, health distribution, platform breakdown | Dashboard |
| **Project List** | Full project table with filtering and sorting | Projects |
| **Migration Tracker** | Base44/Bolt sunset tracking, target assignment | Migration |
| **Cost Analysis** | Monthly/annual costs, savings target progress | Costs |
| **Dependencies** | Internal project links, orphan detection | Dependencies |
| **Audit Compliance** | README, tests, CI, security checks | Audit |
| **AI Triage** | Claude-powered recommendations | 🤖 AI Triage |
| **Team Management** | Assignments, workload, capacity | Team |
| **Pipeline Control** | n8n webhook, sync history, health trends | Pipeline |

---

## 1. Prerequisites

### Required Accounts & Tokens

| Service | Token Type | Scopes Required | Get Token |
|---------|-----------|-----------------|-----------|
| GitHub | PAT (classic) | `repo`, `read:org`, `read:user` | [Settings → Developer settings → PAT](https://github.com/settings/tokens) |
| Notion | Integration | Full DB access | [My Integrations](https://www.notion.so/my-integrations) |
| Slack | Bot Token | `chat:write`, `channels:read` | [Slack Apps](https://api.slack.com/apps) |
| Vercel | Token | Read access | [Account Settings → Tokens](https://vercel.com/account/tokens) |
| Netlify | PAT | Read access | [User Settings → Applications](https://app.netlify.com/user/applications) |

---

## 2. Notion Database Setup

### Create Database with These Properties

```
Name                 | Type          | Notes
---------------------|---------------|----------------------------------
Name                 | Title         | Project name
GitHub ID            | Text          | Unique identifier (gh-XXXXX)
Platform             | Select        | GitHub, Vercel, Netlify, etc.
Status               | Select        | Active, Paused, Blocked, etc.
Category             | Select        | Internal Tool, Automation, etc.
Health               | Number        | 0-100 score
Priority             | Number        | 1-5 scale
Monthly Cost         | Number        | USD per month
Last Activity        | Date          | Last commit/update
Owner                | Text          | GitHub username/org
Repo URL             | URL           | Full GitHub URL
Tech Debt            | Number        | 1-5 scale
Business Value       | Number        | 1-5 scale
Needs Migration      | Checkbox      | Base44/Bolt sunset flag
Stars                | Number        | GitHub stars
Open Issues          | Number        | Open issue count
Has README           | Checkbox      | Audit check
Has Tests            | Checkbox      | Audit check
Has CI               | Checkbox      | Audit check
Migration Target     | Select        | Vercel, GCP, etc.
Migration Status     | Select        | Not Started, In Progress, etc.
Notes                | Text          | Description
Last Synced          | Date          | Pipeline run date
```

### Database Views to Create

1. **All Projects** - Default table view
2. **Needs Attention** - Filter: Health < 40
3. **Migration Tracker** - Filter: Needs Migration = true
4. **By Platform** - Group by: Platform
5. **Cost Overview** - Show: Name, Platform, Monthly Cost (sorted desc)
6. **Audit Dashboard** - Show audit checkboxes, grouped by compliance %

### Share Database with Integration

1. Open Notion database
2. Click "..." → "Add connections"
3. Select your integration
4. Copy Database ID from URL: `notion.so/WORKSPACE/DATABASE_ID?v=...`

---

## 3. n8n Workflow Setup

### Import Workflow

1. Open n8n
2. Go to Workflows → Import from File
3. Paste the JSON from `n8n-portfolio-pipeline` artifact
4. Save workflow

### Configure Credentials

Create these credentials in n8n:

**GitHub API**
```
Type: GitHub API
Token: ghp_xxxxxxxxxxxx
```

**Notion API**
```
Type: Notion API
API Key: secret_xxxxxxxxxxxx
```

**Slack API**
```
Type: Slack API
Bot Token: xoxb-xxxxxxxxxxxx
```

### Set Environment Variables

In n8n Settings → Variables:

```env
GITHUB_ORGS=intinc,other-org
NOTION_PORTFOLIO_DB=your-database-id
SLACK_ALERTS_CHANNEL=#portfolio-alerts
```

### Test the Workflow

1. Click "Execute Workflow" (manual trigger)
2. Watch execution progress
3. Check:
   - GitHub repos fetched
   - Projects transformed
   - Notion pages created/updated
   - Slack message sent

---

## 4. Alert Configuration

### Slack Alert Conditions

| Condition | Alert Type | Threshold |
|-----------|-----------|-----------|
| Critical health + high priority | 🔴 Critical | Health < 30 AND Priority ≥ 4 |
| Needs migration target | 🟡 Migration | Platform = Base44/Bolt AND no target |
| Audit incomplete | 🟡 Compliance | Audit score < 50% |
| Stale project | 🟠 Warning | No activity > 180 days |
| Cost spike | 🟠 Warning | Cost increased > 20% |

### Custom Alert Rules (add to Generate Summary node)

```javascript
// Add to alerts array
if (p.auditChecks && Object.values(p.auditChecks).filter(Boolean).length < 3) {
  summary.alerts.push({
    type: 'compliance',
    project: p.name,
    message: `Low audit compliance (${Object.values(p.auditChecks).filter(Boolean).length}/11 checks)`
  });
}

if (p.githubData?.openIssues > 50) {
  summary.alerts.push({
    type: 'maintenance',
    project: p.name,
    message: `High issue count: ${p.githubData.openIssues} open issues`
  });
}
```

---

## 5. Webhook Integration

### Trigger Pipeline via HTTP

```bash
# Trigger sync
curl -X POST https://your-n8n.cloud/webhook/portfolio-sync

# Trigger with options
curl -X POST https://your-n8n.cloud/webhook/portfolio-sync \
  -H "Content-Type: application/json" \
  -d '{"include_archived": true, "dry_run": false}'
```

### Response Format

```json
{
  "success": true,
  "summary": {
    "total": 385,
    "avgHealth": 67,
    "totalMonthlyCost": 2450,
    "needsMigration": 12,
    "unhealthy": 23,
    "alerts": [...]
  },
  "notionSync": {
    "created": 5,
    "updated": 380
  }
}
```

---

## 6. Snapshot & History

### File Storage Structure

```
/data/portfolio_snapshots/
├── portfolio_2026-03-09-060000.json
├── portfolio_2026-03-02-060000.json
├── portfolio_2026-02-24-060000.json
└── ...
```

### Historical Comparison Query

```javascript
// In n8n Code node - compare weeks
const fs = require('fs');
const current = JSON.parse(fs.readFileSync('/data/portfolio_snapshots/latest.json'));
const lastWeek = JSON.parse(fs.readFileSync('/data/portfolio_snapshots/previous.json'));

const changes = {
  newProjects: current.projects.filter(p => 
    !lastWeek.projects.find(lp => lp.id === p.id)
  ),
  healthDeclined: current.projects.filter(p => {
    const prev = lastWeek.projects.find(lp => lp.id === p.id);
    return prev && p.health < prev.health - 10;
  }),
  costIncreased: current.summary.totalMonthlyCost - lastWeek.summary.totalMonthlyCost
};
```

---

## 7. Maintenance

### Weekly Tasks (Automated)
- ✅ Sync GitHub repos
- ✅ Update Notion database
- ✅ Send Slack summary
- ✅ Save snapshot

### Monthly Tasks (Manual)
- [ ] Review migration progress
- [ ] Update cost data from billing
- [ ] Audit high-priority projects
- [ ] Archive sunset projects

### Quarterly Tasks
- [ ] Review platform distribution
- [ ] Update SLOs/budgets
- [ ] Clean up orphaned projects
- [ ] Compliance audit review

---

## 8. Troubleshooting

### Common Issues

**GitHub API Rate Limit**
```
Error: API rate limit exceeded
Fix: Add delays between requests, use pagination properly
```

**Notion Sync Timeout**
```
Error: Execution timeout
Fix: Reduce batch size, add more delays between Notion calls
```

**Missing Credentials**
```
Error: Credentials not found
Fix: Ensure all credentials are created and named correctly
```

### Debug Mode

Add to Set Configuration node:
```javascript
debug: true,
logLevel: 'verbose'
```

---

## 9. Quick Reference

### Environment Variables

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_ORGS=intinc,personal-org
NOTION_PORTFOLIO_DB=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SLACK_ALERTS_CHANNEL=#portfolio-alerts
VERCEL_TOKEN=xxxxxxxx
NETLIFY_TOKEN=xxxxxxxx
```

### Key URLs

| Resource | URL |
|----------|-----|
| n8n Workflow | `https://your-n8n.cloud/workflow/XXX` |
| Webhook Trigger | `https://your-n8n.cloud/webhook/portfolio-sync` |
| Notion Database | `https://notion.so/WORKSPACE/DATABASE_ID` |
| Slack Channel | `https://app.slack.com/client/TEAM/CHANNEL` |

### Health Score Formula

```
Health = 100
  - staleness_penalty (10-40 based on days since activity)
  - tech_debt_penalty ((techDebt - 1) * 8)
  - status_penalty (20 if blocked, 30 if archived/sunset)
  + business_value_bonus ((businessValue - 3) * 5)
  + audit_bonus (passed_checks * 2)
```

---

## 10. Next Steps

1. [ ] Import n8n workflow
2. [ ] Create Notion database with schema
3. [ ] Configure credentials
4. [ ] Set environment variables
5. [ ] Run manual test
6. [ ] Enable weekly schedule
7. [ ] Configure Slack alerts
8. [ ] Set up snapshot storage

---

## 11. GitHub Actions Integration

### Setup Repository Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret | Description |
|--------|-------------|
| `N8N_PORTFOLIO_WEBHOOK_URL` | Your n8n webhook URL |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook (optional) |

### Install Workflow

1. Copy `.github/workflows/portfolio-sync.yml` to your infra repo
2. Commit and push to main branch
3. Verify workflow appears in Actions tab

### Trigger Events

| Event | Behavior |
|-------|----------|
| PR Merged | Triggers sync with PR details |
| Release Published | Triggers sync with release tag |
| Push to main | Triggers sync for package.json, supabase, workflows changes |
| Weekly Schedule | Monday 7am UTC backup sync |
| Manual | workflow_dispatch with options |

### PR Impact Comments

The `portfolio-pr-check.yml` workflow automatically comments on PRs that affect:
- `package.json` (dependencies)
- `supabase/` (database)
- `.github/workflows/` (CI/CD)
- `Dockerfile` (containers)
- `.env.example` (config)

---

## 12. AI Triage Configuration

### How It Works

The AI Triage feature uses the Anthropic API (built into Claude artifacts) to analyze your portfolio and provide recommendations.

### Triage Categories

| Category | What It Identifies |
|----------|-------------------|
| **Archive Candidates** | Dead projects, no activity, low value |
| **Migration Priority** | Sunset platforms, urgency ranking |
| **Investment Targets** | High-value projects worth improving |
| **Risk Alerts** | Critical health + high priority conflicts |
| **Quick Wins** | Low-effort, high-impact actions |
| **Consolidation** | Duplicate or mergeable projects |
| **Weekly Focus** | Top 3 actions for immediate attention |

### Running AI Triage

1. Navigate to **🤖 AI Triage** tab
2. Click **Run AI Triage**
3. Wait 10-30 seconds for analysis
4. Review recommendations
5. Results are saved locally for reference

### Prompt Customization

The AI prompt can be customized by modifying the `runAiTriage` function in the React component. Key data sent to Claude:
- Health scores and status distribution
- Platform breakdown
- Unhealthy project details
- Stale project list
- Cost summary

---

## 13. Team Management

### Adding Team Members

1. Navigate to **Team** tab
2. Click **+ Add Team Member**
3. Fill in name, role, and team
4. Team member appears in assignment dropdown

### Default Teams (Intinc Structure)

- Platform
- AppSec
- Infrastructure
- Automation
- Client Services

### Assigning Projects

**From Team Tab:**
- Use dropdown in Project Assignments table

**From Project Edit Modal:**
- Select "Assigned To" dropdown
- Team auto-populates based on member

### Workload Metrics

Each team member card shows:
- Total assigned projects
- Average health of assigned projects
- Total cost of assigned projects

### Workload Chart

Bar chart comparing:
- Total projects per team member
- Unhealthy projects (health < 40) per member

---

## 14. CSV Export

### Export Contents

| Column | Description |
|--------|-------------|
| Name | Project name |
| Platform | GitHub, Vercel, etc. |
| Status | Active, Paused, etc. |
| Category | Internal Tool, Automation, etc. |
| Health | 0-100 score |
| Priority | 1-5 scale |
| Business Value | 1-5 scale |
| Tech Debt | 1-5 scale |
| Monthly Cost | USD |
| Owner | GitHub owner |
| Assigned To | Team member |
| Team | Team name |
| Last Activity | Date |
| Repo URL | GitHub URL |
| Needs Migration | Yes/No |
| Migration Target | Target platform |
| README | Yes/No |
| Tests | Yes/No |
| CI | Yes/No |
| Notes | Description |

### Export Usage

1. Click **CSV** button in header
2. File downloads as `portfolio_export_YYYY-MM-DD.csv`
3. Open in Excel, Google Sheets, or any spreadsheet app

### Spreadsheet Analysis Ideas

- Pivot table by platform and status
- Cost breakdown by team
- Health trend charts (compare exports over time)
- Filter to unhealthy + high priority for focus list

---

## 15. Quick Reference Card

### Keyboard Shortcuts

| Action | Method |
|--------|--------|
| Search projects | Type in search box |
| Quick filter | Click status/platform selects |
| Edit project | Click row in table |
| Run AI Triage | Click 🤖 button in AI Triage tab |
| Export CSV | Click CSV button in header |
| Trigger pipeline | Click 🔄 Pipeline button |

### Health Score Formula

```
Health = 100
  - staleness_penalty     (10-40 pts based on days since activity)
  - tech_debt_penalty     ((techDebt - 1) × 8 pts)
  - status_penalty        (20 if blocked, 30 if archived/sunset)
  + business_value_bonus  ((businessValue - 3) × 5 pts)
  + audit_bonus           (passed_checks × 2 pts)
```

### Cost Savings Calculation

```
Savings Target: $51,300/year
Sunset Platform Cost: sum(monthlyCost) where platform in (Base44, Bolt)
Progress: (sunsetCost × 12) / savingsTarget × 100%
```

### URLs to Bookmark

| Resource | Purpose |
|----------|---------|
| Command Center | Main UI (this artifact) |
| n8n Workflow | Pipeline management |
| Notion Database | Persistent storage |
| GitHub Actions | CI/CD integration |
| Slack Channel | Alerts and summaries |
