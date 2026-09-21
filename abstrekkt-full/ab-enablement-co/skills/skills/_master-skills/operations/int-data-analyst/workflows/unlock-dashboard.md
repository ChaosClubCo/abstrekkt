<required_reading>
Load `references/queries.md` before writing any queries.
Domain unlock tracking is the PRIMARY Intinc AI metric — anchor all reports here.
</required_reading>

<process>

## Domain Unlock Dashboard

**Purpose:** Track which AI-assisted domains are unlocked across the Intinc team. No levels, no hierarchy — just capabilities unlocked with evidence.

---

## Step 1 · Collect Evidence

Pull from three sources:
1. **#ai-wins Teams posts** — count per person, note which skill/domain
2. **Notion manual log** — if maintained: skill name, outcome, time saved
3. **Direct observation** — Kyle's knowledge of who's using what

Do not guess. If evidence is absent for a domain, mark it unlocked: 0.

---

## Step 2 · Produce the Dashboard Table

```markdown
## Intinc AI Domain Unlock Report — [Month Year]
Sources: #ai-wins Teams + Notion log + observation | Range: [date range]

| Domain | Skill | # People Unlocked | Evidence Type | Last Updated |
|---|---|---|---|---|
| KB Article Creation | kb-article-generator | [N] | #ai-wins posts | [date] |
| Ticket Triage (AI) | service-desk-unified | [N] | Self-report (Daniel's team) | [date] |
| Document Generation | intinc-doc-gen | [N] | Notion log | [date] |
| Workflow Automation | workflow-automation | [N] | n8n execution count | [date] |
| Agentic Code Review | staff-engineer-v4 | [N] | PR comments or session log | [date] |
| Vibe Coding / Prototyping | kyle-vibe-coding | [N] | Vercel deploy URL or demo | [date] |
| Data Analysis | int-data-analyst | [N] | Report produced | [date] |
| AI Enablement Proposals | int-ai-enablement-pm | [N] | PRD or 1-pager created | [date] |

**Summary:**
- Domains with ≥1 person unlocked: X of 8
- People with ≥1 domain unlocked: X of [org size]
- New unlocks this month: X
- Highest-unlock domain: [domain name] ([N] people)
- Zero-unlock domains: [list] → candidates for next office hours focus
```

---

## Step 3 · Data Quality Statement

Always append:

```
Data quality note: Domain unlock tracking is based on [self-reported / observed / instrumented] signals.
#ai-wins posts capture enthusiastic users — quiet usage is likely undercounted.
Treat these numbers as a floor, not a ceiling.
```

---

## Step 4 · Chain Output

If this is for a monthly leadership report: pass the completed table to `intinc-doc-generator` with:
- Document type: Reference Guide
- Audience: Dave Linderman / Jackie Miles / Daniel Bell (select appropriate)
- Tone: concise, data-first

</process>
