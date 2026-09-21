# Unit Economics — Ops Autopilot

> **Audience:** EXEC, INV | **Phase:** ALL

---

## Per-Tier Breakdown

### Starter ($49/mo)
| Line Item | Cost |
|-----------|------|
| n8n hosting (customer-paid) | $0 (customer) |
| Control plane allocation | $5 |
| Redis (256MB) | $5 |
| Monitoring allocation | $2 |
| Support allocation (0.5 hrs/mo) | $22 |
| **Total COGS** | **$34** |
| **Gross Margin** | **$15 (30%)** |

### Growth ($149/mo)
| Line Item | Cost |
|-----------|------|
| Control plane allocation | $10 |
| Redis (1GB) | $10 |
| Monitoring allocation | $5 |
| Support allocation (1 hr/mo) | $45 |
| Success manager allocation | $5 |
| **Total COGS** | **$75** |
| **Gross Margin** | **$74 (50%)** |

### Enterprise ($500/mo)
| Line Item | Cost |
|-----------|------|
| Control plane allocation | $20 |
| Redis cluster (4GB) | $30 |
| Monitoring allocation | $10 |
| Support allocation (2 hrs/mo) | $90 |
| Success manager allocation | $20 |
| n8n cluster support | $30 |
| Professional services allocation | $30 |
| **Total COGS** | **$230** |
| **Gross Margin** | **$270 (54%)** |

---

## Customer Acquisition

| Metric | Value | Assumption |
|--------|-------|------------|
| CAC (Customer Acquisition Cost) | $200 | $5K marketing/mo ÷ 25 new customers |
| Sales cycle | 2–4 weeks | Self-service Starter, sales-assisted Growth/Enterprise |
| Payback period | 4.8 months | $200 CAC ÷ $42 avg monthly gross margin |
| LTV (Lifetime Value) | $10,000 | 24-month avg lifetime × $149 avg revenue × 50% margin × 2.8 tier mix |
| LTV:CAC ratio | 50:1 | Target: >3:1 is healthy |

---

## Blended Model (Beta Cohort — Week 16)

| Tier | Customers | Revenue | COGS | Gross Profit |
|------|-----------|---------|------|-------------|
| Starter | 60 | $2,940 | $2,040 | $900 |
| Growth | 25 | $3,725 | $1,875 | $1,850 |
| Enterprise | 3 | $1,500 | $690 | $810 |
| **Total** | **88** | **$8,165** | **$4,605** | **$3,560** |
| **Blended margin** | | | | **43.6%** |

---

## Path to Profitability

| Milestone | Revenue | COGS | OpEx | Net | When |
|-----------|---------|------|------|-----|------|
| Break-even (infra) | $600/mo | $600 | — | $0 | Week 8 |
| Break-even (full) | $20K/mo | $8K | $12K | $0 | Month 6 |
| $100K MRR | $100K | $40K | $40K | $20K | Month 12 |
| $200K MRR | $200K | $80K | $60K | $60K | Month 18 |

**OpEx includes:** 3 engineers ($15K/mo), 2 support ($8K/mo), 1 success ($5K/mo), 1 sales ($5K/mo), marketing ($5K/mo), overhead ($2K/mo) = ~$40K/mo at GA scale.
