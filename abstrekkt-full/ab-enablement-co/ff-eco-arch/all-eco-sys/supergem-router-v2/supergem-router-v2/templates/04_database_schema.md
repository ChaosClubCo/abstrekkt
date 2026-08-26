# Template 4: Design a Database Schema + RLS Policy Plan (Supabase/Postgres)

## COPY/PASTE INPUT BLOCK

```
GOAL:
Design tables, indexes, constraints, and row-level security (RLS) policies for the described feature.

CONTEXT:
- Multi-tenant by default; users only access their own data unless role-granted
- Data must support auditability

CONSTRAINTS:
- Avoid over-normalization; optimize for correctness + queries
- Include migration plan and seed data examples
- Never store secrets; store references only

INPUTS:
[Paste: entities, relationships, access rules, and expected query patterns]

OUTPUT NEEDS:
- Markdown
- Include: ERD description; tables; indexes; RLS rules; example queries; migration checklist; acceptance criteria; CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=FirstPrinciples
- Framework=RACE
- OutputFormat=Markdown
```

## USAGE NOTES

- Describe your data entities, relationships, and who can access what
- FirstPrinciples ensures schema is built from fundamental data requirements
- RACE (Role, Action, Context, Expectation) structures the database design task
- Output includes complete migration SQL and RLS policies
