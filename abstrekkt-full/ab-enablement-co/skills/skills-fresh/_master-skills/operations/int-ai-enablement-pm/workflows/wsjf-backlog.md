<process>

## WSJF Backlog

**Formula:** WSJF = (Business Value + Time Criticality + Risk Reduction) ÷ Job Size

**Scoring guide:**
- Business Value: Direct revenue / cost / risk impact for Intinc (1–10)
- Time Criticality: How much worse does delay make this? (1–10)
- Risk Reduction: Does this prevent a class of problems or unblock work? (1–10)
- Job Size: 1=hours, 2=day, 3=week, 5=2wks, 8=month, 13=quarter

**Rules:**
- Archive anything scoring < 2.0
- Implement highest WSJF first
- Re-score the entire table when context changes (new information, new priority, scope change)
- Political viability doesn't inflate scores — it gets named explicitly in a notes column

**Output format:**
```markdown
## Intinc AI Enablement Backlog — [Date]

| Initiative | BV | TC | RR | Size | WSJF | Notes | Status |
|---|---|---|---|---|---|---|---|
| #ai-wins Teams channel | 8 | 9 | 7 | 1 | 24.0 | Zero-build, high visibility | Launch this week |
| int-ai-enablement-pm skill | 9 | 7 | 6 | 2 | 11.0 | Phase 0 gate | This week |
| AI Office Hours program | 9 | 7 | 8 | 3 | 8.0 | Requires Kyle's time | Week 2+ |
| Token tracking (instrumented) | 7 | 6 | 8 | 5 | 4.2 | Needs PostHog instrumentation first | Phase 4 |

Archive (WSJF < 2.0):
- [initiative]: [reason score is low]
```

</process>
