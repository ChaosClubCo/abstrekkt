# Financial Model — Ops Autopilot

> **Audience:** INV | **Phase:** ALL

---

## Revenue Projections

### Year 1 (Monthly)

| Month | Starter | Growth | Enterprise | Total Cust | MRR | ARR Run Rate |
|-------|---------|--------|------------|------------|-----|-------------|
| M1 (MVP) | 2 | 0 | 0 | 2 | $98 | $1.2K |
| M2 | 10 | 3 | 0 | 13 | $937 | $11.2K |
| M3 | 30 | 12 | 1 | 43 | $3,778 | $45.3K |
| M4 (GA) | 60 | 25 | 3 | 88 | $8,165 | $98K |
| M6 | 150 | 60 | 8 | 218 | $20,350 | $244K |
| M9 | 300 | 120 | 15 | 435 | $40,350 | $484K |
| M12 | 500 | 200 | 25 | 725 | $67,050 | $805K |

### Year 2–3

| Year | Customers | MRR | ARR | Gross Margin |
|------|-----------|-----|-----|-------------|
| Y1 end | 725 | $67K | $805K | 43% |
| Y2 end | 1,800 | $220K | $2.6M | 50% |
| Y3 end | 3,500 | $500K | $6.0M | 55% |

## Cost Structure

### Fixed Costs (Monthly at GA)

| Category | Cost |
|----------|------|
| Engineering (3) | $15,000 |
| Support (2) | $8,000 |
| Customer Success (1) | $5,000 |
| Sales (1) | $5,000 |
| Marketing | $5,000 |
| Infrastructure (control plane) | $1,500 |
| Tools (Sentry, PostHog, PagerDuty) | $500 |
| Overhead (legal, accounting, misc) | $2,000 |
| **Total Fixed** | **$42,000** |

### Variable Costs (Per Customer/Month)

| Tier | COGS/Customer |
|------|--------------|
| Starter | $34 |
| Growth | $75 |
| Enterprise | $230 |

## Break-Even Analysis

**Infrastructure break-even:** 13 customers (~$600 MRR) — Week 8
**Full break-even (incl. team):** ~300 customers (~$42K MRR) — Month 8–10
**Cash flow positive:** Month 10–12 (depending on hiring timeline)

## Sensitivity Analysis

| Scenario | Assumption Change | Impact on Y1 ARR |
|----------|-------------------|-------------------|
| Slower growth (20% MoM vs 30%) | Growth rate -33% | $480K (-40%) |
| Higher churn (5% vs 3%) | Churn +67% | $640K (-20%) |
| Faster Enterprise adoption | 2× Enterprise customers | $960K (+19%) |
| Price increase (+20%) | All tiers +20% | $966K (+20%) |
| Delayed GA (Week 20 vs 17) | 3-week delay | $720K (-11%) |
