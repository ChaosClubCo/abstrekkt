---
name: reporting-financials
description: >-
  Generates financial reports including P&L statements, cash flow
  analysis, balance sheet reviews, and KPI dashboards. Activates when
  creating financial reports, analyzing profitability, reviewing cash
  flow, preparing board materials, or building financial dashboards.
  Also triggers on: P&L, profit and loss, cash flow, balance sheet,
  financial statement, financial report, revenue report, margin
  analysis, board deck financials, or monthly close. Even if someone
  says 'how are we doing financially' or 'what are this month's numbers'
  — use this skill.
version: "1.0.0"
---

# Reporting Financials

Produces clear, accurate financial reporting for Intinc stakeholders — from monthly management reports to board-level financial summaries. Translates raw accounting data into actionable insights that drive business decisions.

## Quick-Start Decision Tree

```
Request arrives
  ├─ Standard report? ────── Monthly/Quarterly package
  ├─ P&L analysis? ─────── Profitability Deep Dive
  ├─ Cash flow? ──────────── Cash Flow Statement
  ├─ Board materials? ────── Board Financial Summary
  └─ Custom analysis? ────── Ad-hoc Financial Analysis
```

## Usage Examples

**Example 1 — Generate the March monthly financial package**
→ Close AR/AP for the period → run P&L (actual vs budget vs prior year) → generate balance sheet → prepare cash flow statement → calculate key metrics (gross margin, EBITDA, MRR, burn rate) → add commentary on material variances → format for distribution.

**Example 2 — What's our gross margin trend over the last 6 months?**
→ Pull revenue and COGS by month for last 6 periods → calculate gross margin % each month → identify trend (improving, stable, declining) → break down by service line (MSP, project, consulting) → flag any service lines below 40% target → recommend actions.

**Example 3 — Prepare the financial slides for next week's board meeting**
→ Pull quarterly financials → create executive summary (revenue, EBITDA, cash position) → compare against plan and prior year → highlight top 3 wins and top 3 risks → include MRR/ARR waterfall chart → add forward-looking guidance with assumptions → format in board template.

## Golden Path Workflow

1. Confirm reporting period and audience
2. Pull data from accounting system (GL, subledgers)
3. Validate data completeness (all entries posted, period closed)
4. Generate required statements (P&L, balance sheet, cash flow)
5. Calculate key metrics and KPIs
6. Compare against budget, forecast, and prior periods
7. Add variance commentary for material items (>5%)
8. Format for audience (management detail vs board summary)
9. Distribute and archive

## Edge Cases & Anti-Patterns

- **Period not yet closed** — Clearly label as 'preliminary' with estimated accruals. Never present draft numbers as final.
- **One-time items** — Separate from recurring operations; show both GAAP and adjusted figures.
- **Intercompany transactions** — Eliminate in consolidated reports; show in entity-level reports.
- **Currency translation** — Use period-end rate for balance sheet, average rate for P&L.

## Cross-Skill References

Works with: `budgeting-workflows`, `tracking-expenses`, `forecasting-revenue`, `tracking-gross-margins`

## Compliance & Security

GAAP/IFRS (financial statement standards), SOX (reporting controls), SOC2 (data integrity).

## Self-Verification Checklist

- [ ] Correct workflow selected for request type
- [ ] All financial calculations verified
- [ ] Approval thresholds respected
- [ ] Audit trail maintained for all changes
- [ ] Compliance requirements addressed
- [ ] Cross-skill handoffs identified
- [ ] Output format matches audience expectations

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- This skill covers the complete reporting financials workflow at Intinc
- Compliance requirements are mapped to relevant frameworks
- Edge cases reflect real operational scenarios in managed services

**COUNTEREXAMPLE:**
- Very small engagements may not need the full workflow — use judgment on which steps to skip
- Industry-specific regulations may add requirements not covered here

**CONTRADICTIONS:**
- Speed of execution sometimes conflicts with thoroughness of compliance checks — prioritize based on risk level