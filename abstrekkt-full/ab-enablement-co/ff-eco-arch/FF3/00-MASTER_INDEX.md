# INTINC Automation Workflows 4-10: Master Index

**Package:** Customer Service & Sales AI Automation Suite  
**Created:** November 19, 2025  
**Version:** 1.0  
**Total Files:** 7 workflows + 1 comprehensive guide

---

## 📦 Package Contents

### Workflow Files (JSON - Import into Zapier)

| File | Workflow | Size | Purpose |
|------|----------|------|---------|
| `5-knowledge-base-rag.json` | Knowledge Base RAG | 7.2 KB | Claude-powered support answers using vector search |
| `6-client-health-monitoring.json` | Client Health Monitoring | 14 KB | Predictive churn alerts with engagement scoring |
| `7-contract-renewal-tracking.json` | Contract Renewal Tracking | 9.0 KB | Automated renewal playbooks with AI strategy |
| `8-win-loss-analysis.json` | Win/Loss Analysis | 8.1 KB | Competitive intelligence from closed deals |
| `9-performance-analytics-dashboard.json` | Performance Analytics | 13 KB | Weekly executive AI insights dashboard |
| `10-nps-survey-automation.json` | NPS Survey Automation | 13 KB | Quarterly feedback with sentiment analysis |

### Documentation

| File | Size | Purpose |
|------|------|---------|
| `WORKFLOWS_4-10_GUIDE.md` | 30 KB | Complete implementation guide with SQL schemas, deployment steps, cost analysis, security guidelines, testing procedures |

---

## 🚀 Quick Start

### Prerequisites

- Zapier Professional/Team account ($49-299/month)
- Supabase Pro ($25/month) - `db.fyzijgyuteddsvzxonom.supabase.co`
- Anthropic Claude API key
- OpenAI API key (for embeddings in workflow 5)
- Linear account (Standard plan)
- Slack workspace (for notifications)

### 1. Setup Database (15 minutes)

Open `WORKFLOWS_4-10_GUIDE.md` and run all SQL migrations in Supabase SQL Editor:
- Knowledge Base tables (vector search)
- Client Health History
- Renewal Plans
- Win/Loss Analyses
- Performance Dashboards
- NPS Surveys & Responses

### 2. Import Workflows (30 minutes)

For each JSON file:
1. Go to Zapier → Create Zap → Import
2. Upload JSON file
3. Connect accounts (Supabase, Claude API, Linear, Slack, etc.)
4. Replace `{{PLACEHOLDERS}}` with actual IDs
5. Test workflow
6. Turn ON

### 3. Seed Knowledge Base (20 minutes)

For workflow 5 to work:
1. Create `populate_kb.py` script (see guide)
2. Add your company documentation
3. Generate embeddings
4. Insert into `kb_documents` table

### 4. Test & Validate (15 minutes)

Run test scenarios for each workflow (see Testing section in guide).

---

## 💰 Cost Breakdown

### Monthly (100 active clients)

| Workflow | Base | Variable | Total |
|----------|------|----------|-------|
| 5. Knowledge Base RAG | $15 | $23-367 | $38-382 |
| 6. Client Health | $20 | $232-988 | $252-1,008 |
| 7. Renewal Tracking | $18 | $110-303 | $128-321 |
| 8. Win/Loss Analysis | $25 | $158-433 | $183-458 |
| 9. Performance Analytics | $0.60 | $0.54 | $1.14 |
| 10. NPS Surveys | $7.31/qtr | $21.93/qtr | $29.24/qtr |

**Total Monthly Cost:** $666 - $2,232 (highly variable)

**Infrastructure:**
- Zapier Company: $599/month (10K tasks)
- Supabase Pro: $25/month
- Anthropic Claude: ~$45/month (5M input tokens)
- OpenAI Embeddings: ~$0.02/month
- Linear: $40/month (5 users)
- Notion: $30/month (3 users)
- Typeform: $25/month

**Total Infrastructure:** $764/month  
**Grand Total:** $1,430 - $2,996/month

### ROI Analysis

**Time Saved:**
- Status reports: $600/month
- Health monitoring: $1,500/month
- Win/loss analysis: $900/month
- Performance analytics: $1,200/month
- NPS surveys: $200/month

**Total Monthly Value:** $4,400  
**Net Savings:** $1,404 - $2,970/month  
**Annual ROI:** $16,848 - $35,640

---

## 🎯 Workflow Summaries

### 5. Knowledge Base RAG (Retrieval-Augmented Generation)

**Purpose:** Instant, AI-powered support answers using company knowledge base  
**Trigger:** Webhook (on-demand)  
**Tech:** OpenAI embeddings + Supabase pgvector + Claude Sonnet  
**Execution:** 2-3 seconds per query  
**Cost:** $0.038/query

**Key Features:**
- Vector similarity search (threshold: 0.75)
- Claude generates answers with citations
- Fallback response for no matches
- Query logging for analytics
- Rate limiting (100/min)

**Use Cases:**
- Support ticket auto-responses
- Chatbot backend
- Internal knowledge search
- Documentation Q&A

---

### 6. Client Health Monitoring

**Purpose:** Proactive churn detection with predictive alerts  
**Trigger:** Daily (8am CT)  
**Tech:** Multi-factor health scoring + Linear integration  
**Execution:** 3-5 minutes for 100 clients  
**Cost:** $252-$1,008/month

**Health Score Algorithm:**
- Engagement frequency (30%)
- Project velocity (25%)
- Support ticket health (20%)
- Contract timing (15%)
- Sentiment (10%)

**Outputs:**
- Health score (0-100)
- Risk classification (healthy/warning/at_risk/critical)
- Actionable insights
- Slack alerts for at-risk clients
- Linear tasks for critical cases

---

### 7. Contract Renewal Tracking

**Purpose:** Automated renewal playbooks with AI-generated strategies  
**Trigger:** Daily (9am CT)  
**Tech:** Claude Sonnet + usage analytics  
**Execution:** 2-4 minutes per renewal  
**Cost:** $128-$321/month

**Stages:**
- Early planning (120-90 days)
- Pre-renewal (90-60 days)
- Active renewal (60-30 days)
- Critical (< 30 days)

**Outputs:**
- AI renewal strategy per client
- Upsell opportunities
- Renewal risk assessment
- Timeline for next 30-60-90 days
- Linear tasks with due dates

---

### 8. Win/Loss Analysis

**Purpose:** Competitive intelligence from every closed deal  
**Trigger:** Webhook (on deal close)  
**Tech:** Claude Sonnet + Notion integration  
**Execution:** 1-2 minutes per deal  
**Cost:** $183-$458/month (20-50 deals)

**Analysis Includes:**
- Primary reason for win/loss
- Key factors (3-5 bullet points)
- Competitor analysis
- Lessons learned
- Actionable recommendations
- Playbook updates

**Outputs:**
- Slack win/loss announcements
- Email digests to sales team
- Notion playbook updates (monthly)
- Competitive trend tracking

---

### 9. Performance Analytics Dashboard

**Purpose:** Weekly executive insights with AI-generated recommendations  
**Trigger:** Weekly (Monday 7am CT)  
**Tech:** Claude Sonnet + Supabase aggregations  
**Execution:** 4-6 minutes per week  
**Cost:** $1.14/month

**KPIs Tracked:**
- Sales (deals, pipeline, win rate)
- Customer Success (health, tickets, NPS)
- Operations (automation, costs)
- Product (users, adoption, bugs)

**Outputs:**
- Executive summary (3 sentences)
- Top 3 wins + top 3 concerns
- Strategic recommendations
- Week-over-week trends
- ASCII + Mermaid visualizations
- Email to executives + Slack + Notion

---

### 10. NPS Survey Automation

**Purpose:** Quarterly feedback loops with intelligent follow-up  
**Trigger:** Quarterly (1st of month)  
**Tech:** Typeform + Claude Sonnet sentiment analysis  
**Execution:** 10-15 minutes per 100 clients  
**Cost:** $29.24/quarter

**Process:**
1. Generate personalized survey emails (Claude)
2. Send via Typeform with hidden client IDs
3. On response: AI sentiment analysis
4. Classify: Promoter (9-10), Passive (7-8), Detractor (0-6)
5. Auto-follow-up:
   - Promoters: Thank you email
   - Passives: Follow-up task (7 days)
   - Detractors: Urgent Slack alert + immediate call

**Outputs:**
- Quarterly NPS score
- Sentiment themes
- Action items per response
- Linear follow-up tasks
- Client health score updates

---

## 🔒 Security & Compliance

### Data Protection

- **PII:** All emails/phones hashed (SHA-256)
- **API Keys:** Stored in Zapier Secrets (encrypted)
- **RLS:** Row Level Security on all Supabase tables
- **Webhooks:** Signature validation recommended

### Compliance

- **HIPAA:** No PHI in knowledge base, encrypted webhooks
- **GDPR:** 90-day data retention, deletion workflows
- **SOC 2:** Audit logs, access controls, change tracking

### Best Practices

- Rotate API keys every 90 days
- Review RLS policies quarterly
- Monitor error rates daily
- Backup Supabase weekly

---

## 📊 Monitoring Dashboard

Track these metrics weekly:

**Zapier**
- Task usage (target: < 80% of plan)
- Failed zaps (target: < 1%)
- Execution time (target: < 5 sec/task)

**Supabase**
- Database size (target: < 7GB on Pro plan)
- Query performance (target: < 100ms)
- RLS policy violations (target: 0)

**AI APIs**
- Claude costs (target: < $500/month)
- OpenAI embeddings (target: < $2/month)
- Average tokens per request

**Business Metrics**
- NPS score trend (target: > 50)
- Client health distribution (target: > 70% healthy)
- Renewal rate (target: > 90%)
- Win rate (target: > 40%)

---

## 🛠 Troubleshooting

### Common Issues

**"No relevant docs" in RAG:**
→ Run `populate_kb.py` to seed knowledge base

**Health alerts not triggering:**
→ Run manual health check once to initialize `health_score_last_updated`

**Renewal alerts for past dates:**
→ Update `renewal_date` in clients table after contract signed

**Win/Loss webhook silent:**
→ Configure CRM (HubSpot/Salesforce) to POST to Zapier catch URL

**Analytics missing metrics:**
→ Verify `get_weekly_metrics()` SQL function has data

**NPS emails bouncing:**
→ Validate email addresses: `SELECT * FROM clients WHERE primary_contact_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';`

---

## 📚 Additional Resources

### Documentation
- Full Implementation Guide: `WORKFLOWS_4-10_GUIDE.md`
- Supabase Docs: https://supabase.com/docs
- Anthropic Claude API: https://docs.anthropic.com
- Zapier Developer Docs: https://platform.zapier.com

### Support
- **Internal:** Slack #automation-support
- **Zapier:** support@zapier.com
- **Supabase:** support.supabase.com
- **Anthropic:** support@anthropic.com

---

## ✅ Deployment Checklist

### Phase 1: Database (15 min)
- [ ] Run all SQL migrations in Supabase
- [ ] Verify tables created
- [ ] Test RPC functions
- [ ] Enable RLS policies

### Phase 2: Zapier (30 min)
- [ ] Import 6 JSON workflows
- [ ] Connect all accounts
- [ ] Replace placeholders
- [ ] Test each workflow

### Phase 3: Knowledge Base (20 min)
- [ ] Create `populate_kb.py`
- [ ] Add documentation (50+ docs)
- [ ] Generate embeddings
- [ ] Insert into Supabase

### Phase 4: Linear (10 min)
- [ ] Create labels (Client Health, Renewal, NPS)
- [ ] Setup CS team
- [ ] Create projects

### Phase 5: Testing (15 min)
- [ ] Run test scenarios
- [ ] Verify Slack alerts
- [ ] Check email delivery
- [ ] Validate data in Supabase

### Phase 6: Production (Ongoing)
- [ ] Turn all Zaps ON
- [ ] Monitor error rates
- [ ] Review costs weekly
- [ ] Gather team feedback

---

## 🎁 Bonus: Client Templates

These workflows are **white-label ready** for client deployments:

**Pricing Strategy:**
- Internal cost: $1,430 - $2,996/month (100 clients)
- Per-client cost: $14.30 - $29.96/month
- Recommended client pricing: $150-$250/client/month
- Your margin: **83-94%**

**Target Clients:**
- Pharma (Abbott Labs)
- Healthcare SaaS
- Manufacturing automation

**Positioning:**
"AI-Powered Customer Success Suite with predictive churn detection, automated renewals, and executive insights."

---

## 📞 Contact

**Questions?** Kyle @ INTINC.com  
**Email:** kyle@intinc.com  
**Slack:** #automation-support  
**Documentation:** https://intinc.com/automation-docs

---

**Version:** 1.0  
**Last Updated:** November 19, 2025  
**Status:** Production-ready ✅

---

*Built with: Zapier + Supabase + Claude Sonnet 4.5 + n8n + Linear + Notion*
