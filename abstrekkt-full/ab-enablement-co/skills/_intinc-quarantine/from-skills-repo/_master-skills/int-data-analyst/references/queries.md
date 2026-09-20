# Queries Reference — INT Data Analyst

## PostHog HogQL: Weekly Active AI Users
```sql
SELECT
  toStartOfWeek(timestamp) AS week,
  countDistinct(distinct_id) AS active_users
FROM events
WHERE event = 'skill_invoked'
  AND timestamp >= now() - interval 12 week
GROUP BY week ORDER BY week DESC
```

## PostHog HogQL: Top Skills by Invocation (Last 30 Days)
```sql
SELECT
  properties.skill_name AS skill,
  count() AS invocations,
  countDistinct(distinct_id) AS unique_users
FROM events
WHERE event = 'skill_invoked'
  AND timestamp >= now() - interval 30 day
GROUP BY skill
ORDER BY invocations DESC LIMIT 20
```

## PostHog HogQL: Domain Unlock Funnel
```sql
SELECT
  distinct_id,
  groupUniqArray(properties.skill_name) AS skills_used,
  count() AS total_invocations
FROM events
WHERE event = 'skill_invoked'
  AND timestamp >= now() - interval 30 day
GROUP BY distinct_id
ORDER BY total_invocations DESC
```

---

## Supabase: AI Usage Log Query (RLS-Safe, Client Context)
```typescript
const { data, error } = await supabase
  .from('ai_usage_logs')
  .select('user_id, tool, tokens_used, skill_name, created_at')
  .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
  .order('created_at', { ascending: false })
  .limit(1000);

// data.length === 0 with no error = RLS blocking, not empty table
// Distinguish: re-run with service_role in server context to confirm
```

---

## PostHog Instrumentation (Add to Skill Trigger Points)
```typescript
import { posthog } from './lib/posthog';

// Fire this whenever a skill is invoked
posthog.capture('skill_invoked', {
  skill_name: 'kb-article-generator',   // exact skill name
  outcome: 'success',                    // success | partial | abandoned
  tokens_estimate: 1200,                 // rough token estimate
  time_saved_minutes: 35,               // self-reported or estimated
});
```

---

## n8n: Execution Performance
```bash
# Recent successful executions
GET /api/v1/executions?limit=100&status=success

# Recent failed executions
GET /api/v1/executions?limit=100&status=error

# Key fields to extract:
# workflowId, startedAt, stoppedAt, status
# Duration = stoppedAt - startedAt (ms)
# Outlier threshold = executions > 2x average duration
```

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Supabase returns empty, no error | RLS blocking anon key | Re-run with service_role server-side to confirm data exists |
| PostHog query times out | Date range too wide | Start with 7-day window, expand |
| n8n API returns 401 | API key missing | Add n8n API key to env vars |
| No `skill_invoked` events in PostHog | Not instrumented yet | Add posthog.capture() snippet above to skill activation points |
| Domain unlock counts seem low | Self-report bias | #ai-wins only captures enthusiastic users — treat as floor |
