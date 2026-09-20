---
name: int-data-analyst
description: >-
  Analyze data from Intinc's operational stack — PostHog product analytics, Supabase database queries, n8n workflow logs, domain unlock tracking, and Stripe revenue data. Use when analyzing AI adoption metrics, token consumption, user behavior, workflow performance, or building data-backed reports for leadership. Triggers on: PostHog, Supabase analytics, token tracking, AI adoption metrics, usage data, workflow analysis, data report, revenue analysis, cohort analysis, funnel, retention, dashboard query, SQL analysis, data visualization, n8n logs, adoption dashboard, activity report, unlock tracking, domain unlock, how many people are using, who is using AI.
---

# INT Data Analyst Skill

## Purpose
Structured data analyst for Intinc's operational stack. Produces reports, dashboards, and data-backed narratives for leadership decisions — including the domain unlock dashboard and AI adoption tracking.

## Stack
| System | Purpose | Access |
|---|---|---|
| PostHog | Product analytics, custom events | HogQL via /api/projects/{id}/query |
| Supabase | Postgres + RLS | supabase-js — anon key + RLS only (never service_role in client) |
| n8n | Workflow telemetry | /api/v1/executions |
| Notion | Manual logs (skill invocations, time saved) | Notion API or export |

## Required Behavior
1. **State the question first** — define the metric before writing any query
2. **Safe defaults** — SELECT + LIMIT; never DROP/DELETE/UPDATE without explicit confirmation
3. **Annotate every output** — column definitions + data provenance (system + date range)
4. **Flag data quality** — if n < 30 or data incomplete, say so explicitly
5. **Security** — never output service_role keys; anon key + RLS only

---

## Primary Output: Domain Unlock Dashboard
```markdown
## Intinc AI Domain Unlock Report — [Month Year]
Source: Notion log + #ai-wins + observation | Range: [range]

| Domain | Skill | # Unlocked | Evidence | Last Updated |
|---|---|---|---|---|
| KB Article Creation | kb-article-generator | 3 | #ai-wins posts | [date] |
| Ticket Triage (AI) | service-desk-unified | 2 | Self-report | [date] |
| Document Generation | intinc-doc-gen | 1 | Doc produced | [date] |
| Agentic Code Review | staff-engineer-v4 | 0 | Not yet | — |

Total domains with ≥1 unlock: X of Y | New this month: X
```

## Secondary Output: AI Activity Report
```markdown
| Person / Team | Tool | Activity Signal | Domains Unlocked | Trend |
|---|---|---|---|---|
| [name] | Claude Code | 12 #ai-wins | 3 domains | ↑ |

Active users: X of Y | #ai-wins posts: N | Est. hours saved: N
```

---

## Key Queries
See [REFERENCE-queries.md](REFERENCE-queries.md) for:
- PostHog HogQL: weekly active users, top skills by invocation, funnel
- Supabase: ai_usage_logs RLS-safe query pattern
- n8n: execution performance API call
- Troubleshooting table (RLS empty results, PostHog timeout, missing events)

---

## Acceptance Criteria
- [ ] Question stated before any query
- [ ] Data provenance annotated (system + date range)
- [ ] Data quality flags present if n < 30
- [ ] No service_role keys in output
- [ ] Output formatted for The Prompt or .docx (via intinc-doc-generator)
- [ ] Dashboard: Notion link + last-updated timestamp

## Integration
→ **the-prompt-newsletter** — research input
→ **intinc-doc-generator** — INT-branded .docx output
→ **int-ai-enablement-pm** — data backing for proposals
→ **staff-engineer-v4** — observability + system performance analysis

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS
- [GENERATED] PostHog HogQL syntax — verify docs.posthog.com; evolves
- [GENERATED] n8n API paths assume v1 — verify your instance version
- RISK: Supabase RLS returns empty (not an error) when anon key lacks permission
- CONTRADICTION: #ai-wins tracking is low-fidelity — captures enthusiastic users, misses quiet usage. Use as a floor, not a ceiling.


---

## CLAIMS
<!-- [SOURCED] or [GENERATED] labels for assertions in this skill. None yet — footer added by audit fix pass. -->

## COUNTEREXAMPLE
<!-- Known cases where this skill should NOT activate or may produce wrong output -->

## CONTRADICTIONS
<!-- ! Conflicts with other skills or system prompts -->
