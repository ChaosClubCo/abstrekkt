<required_reading>
Load `references/queries.md` for RLS-safe Supabase patterns and n8n API calls.
</required_reading>

<process>

## DB Query Workflow

**State the question before writing any query.**

**Safety rules:**
- anon key + RLS in client context only — never service_role
- SELECT with LIMIT on any unfamiliar table
- Never DROP, DELETE, or UPDATE without explicit user confirmation
- Empty result with no error = RLS policy blocking (not empty table)

**Steps:**
1. Identify the table and the question
2. Write the query using the RLS-safe pattern from `references/queries.md`
3. Run it
4. If empty and no error: verify RLS policy allows anon access, or use service_role server-side
5. Annotate output: table, filters applied, date range, row count

</process>
