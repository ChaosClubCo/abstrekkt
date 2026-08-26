<required_reading>
Load `references/queries.md` for all pre-built HogQL, Supabase, and n8n query patterns.
State the question before writing any query.
</required_reading>

<process>

## PostHog Analysis

**Before any HogQL query, state:**
- What business question does this metric answer?
- What date range makes sense for this question?
- What would a surprising result look like, and what would it mean?

**Steps:**
1. Write the HogQL query (see `references/queries.md` for templates)
2. Run it
3. Annotate the output: column definitions, date range, sample size
4. If n < 30: flag explicitly before drawing conclusions
5. Interpret findings in plain language for the intended audience

**Common analyses:** weekly active AI users, top skills by invocation, domain unlock funnel, user retention on AI tool usage

---

## Supabase DB Query

**Safety rules:**
- Use anon key + RLS in client context — never service_role
- `SELECT` with `LIMIT` on unknown tables
- Never `DROP`, `DELETE`, or `UPDATE` without explicit user confirmation
- If `data.length === 0` with no error: RLS policy is likely blocking — test separately

**Steps:**
1. State the question
2. Write the query (see `references/queries.md` for RLS-safe pattern)
3. Verify RLS isn't silently blocking (empty result ≠ no data)
4. Annotate output: table name, date range, filter criteria

---

## n8n Workflow Analysis

**Steps:**
1. Pull execution logs via `/api/v1/executions?limit=100` (see `references/queries.md`)
2. Compute: average duration per workflow, error rate per workflow
3. Flag outliers: executions > 2x average duration
4. Trace outliers to specific AI nodes — large prompts and slow models are the usual cause

</process>
