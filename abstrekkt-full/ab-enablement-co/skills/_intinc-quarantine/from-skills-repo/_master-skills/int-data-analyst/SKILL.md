---
name: int-data-analyst
description: Analyze Intinc operational data — PostHog product analytics, Supabase SQL, n8n workflow logs, and Stripe revenue — to build domain-unlock dashboards, AI activity reports, funnel/retention analyses, and data-backed leadership briefings. Use when measuring AI adoption, token consumption, workflow performance, or who is using which tools. Triggers on: PostHog, Supabase, HogQL, adoption metrics, cohort analysis, funnel, retention, unlock tracking, show me the numbers, AI activity, monthly report.
---

# INT Data Analyst Skill

## Essential Principles

1. **State the question before the query.** Define which metric answers the business question before writing any SQL, HogQL, or API call. A query without a hypothesis produces noise.

2. **Annotate every output.** Every table and chart requires: data source, date range, and methodology. Leadership cannot act on numbers they can't trace.

3. **Flag data quality explicitly.** If n < 30, if data is self-reported, if the tracking wasn't instrumented until recently — say so. Low-fidelity data honestly labeled is better than precise-looking data with hidden limitations.

4. **Security first.** Never output `service_role` keys. Use anon key + RLS for all Supabase queries in client context. Server-side queries with service_role stay server-side.

5. **Domain unlock tracking is the primary Intinc metric.** The goal of INT's AI program is domains unlocked per person, not levels or scores. All reports anchor to this framing.

## Intake

Determine report type before pulling any data:

| Request | Report Type | Workflow |
|---|---|---|
| How many people are using AI? | Domain Unlock Dashboard | `workflows/unlock-dashboard.md` |
| Who's using which tools? | AI Activity Report | `workflows/activity-report.md` |
| PostHog funnel / retention / events | PostHog Analysis | `workflows/posthog-analysis.md` |
| Supabase table query | DB Query | `workflows/db-query.md` |
| n8n workflow performance | Workflow Analysis | `workflows/db-query.md` |
| Monthly report for leadership | Combined Report | Run unlock-dashboard + activity-report, then intinc-doc-generator |

**If request is ambiguous:** ask "Are you looking for the domain unlock status, tool usage activity, or a specific data query?"

## Core Workflow

1. **Pin the question.** Restate the business question in one sentence; pick the metric that answers it.
2. **Pick the workflow** from the Intake table.
3. **Load `references/queries.md` first** — it contains pre-built HogQL, Supabase RLS-safe patterns, and n8n API calls. Reuse > rewrite.
4. **Run the query** with the smallest permission scope that works (anon + RLS in client contexts; `service_role` only server-side).
5. **Annotate the output** — source, date range, methodology, sample size, known limitations.
6. **For monthly leadership reports**: run `unlock-dashboard.md` + `activity-report.md`, then chain to `intinc-doc-generator` for .docx formatting.

```sql
-- Example: domain unlock count per user (RLS-safe, anon key OK)
SELECT user_id, COUNT(DISTINCT domain) AS domains_unlocked
FROM ai_activity
WHERE occurred_at >= NOW() - INTERVAL '30 days'
GROUP BY user_id
ORDER BY domains_unlocked DESC;
```

## Reference Index

| Reference | Purpose |
|-----------|---------|
| `references/queries.md` | Pre-built PostHog HogQL, Supabase RLS-safe patterns, n8n API calls, PostHog instrumentation snippet, troubleshooting |

## Workflows Index

| Workflow | Purpose |
|----------|---------|
| `workflows/unlock-dashboard.md` | Domain unlock status report — primary Intinc AI metric |
| `workflows/activity-report.md` | AI tool usage activity — who's using what, trending |
| `workflows/posthog-analysis.md` | PostHog funnel, retention, and custom event analysis |
| `workflows/db-query.md` | Supabase table queries and n8n execution analysis |
