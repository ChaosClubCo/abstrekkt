---
name: int-data-analyst
description: Helps automate and manage int data analyst processes. <essential_principles>. Use when managing, optimizing, or automating operational workflows.
---

# INT Data Analyst Skill

## Core Workflow


<essential_principles>

1. **State the question before the query.** Define which metric answers the business question before writing any SQL, HogQL, or API call. A query without a hypothesis produces noise.

2. **Annotate every output.** Every table and chart requires: data source, date range, and methodology. Leadership cannot act on numbers they can't trace.

3. **Flag data quality explicitly.** If n < 30, if data is self-reported, if the tracking wasn't instrumented until recently — say so. Low-fidelity data honestly labeled is better than precise-looking data with hidden limitations.

4. **Security first.** Never output `service_role` keys. Use anon key + RLS for all Supabase queries in client context. Server-side queries with service_role stay server-side.

5. **Domain unlock tracking is the primary Intinc metric.** The goal of INT's AI program is domains unlocked per person, not levels or scores. All reports anchor to this framing.

</essential_principles>

<intake>

**Determine report type before pulling any data:**

| Request | Report Type | Workflow |
|---|---|---|
| How many people are using AI? | Domain Unlock Dashboard | `workflows/unlock-dashboard.md` |
| Who's using which tools? | AI Activity Report | `workflows/activity-report.md` |
| PostHog funnel / retention / events | PostHog Analysis | `workflows/posthog-analysis.md` |
| Supabase table query | DB Query | `workflows/db-query.md` |
| n8n workflow performance | Workflow Analysis | `workflows/db-query.md` |
| Monthly report for leadership | Combined Report | Run unlock-dashboard + activity-report, then intinc-doc-generator |

**If request is ambiguous:** ask "Are you looking for the domain unlock status, tool usage activity, or a specific data query?"

</intake>

<routing>

Route to the appropriate workflow based on report type identified at intake.

**For monthly leadership reports:** run `workflows/unlock-dashboard.md` + `workflows/activity-report.md`, then chain to `intinc-doc-generator` for .docx formatting.

**For raw data exploration:** load `references/queries.md` first — it contains all pre-built HogQL, Supabase, and n8n query patterns.

</routing>

<reference_index>

| Reference | Purpose |
|-----------|---------|
| `references/queries.md` | Pre-built PostHog HogQL, Supabase RLS-safe patterns, n8n API calls, PostHog instrumentation snippet, troubleshooting |

</reference_index>

<workflows_index>

| Workflow | Purpose |
|----------|---------|
| `workflows/unlock-dashboard.md` | Domain unlock status report — primary Intinc AI metric |
| `workflows/activity-report.md` | AI tool usage activity — who's using what, trending |
| `workflows/posthog-analysis.md` | PostHog funnel, retention, and custom event analysis |
| `workflows/db-query.md` | Supabase table queries and n8n execution analysis |

</workflows_index>
