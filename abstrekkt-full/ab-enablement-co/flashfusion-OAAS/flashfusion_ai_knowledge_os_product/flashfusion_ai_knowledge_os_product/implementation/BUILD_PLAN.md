# Build Plan

## Build

### Step 1 — Create Repository

Suggested structure:

```txt
flashfusion-knowledge-os/
  docs/
  doctrine/
  ontology/
  governance/
  memory/
  agents/
  ux/
  observability/
  prompts/
  schemas/
  src/
  tests/
```

### Step 2 — Initialize Stack

Use:

- TypeScript
- Supabase
- pgvector
- Next.js or Base44 frontend equivalent
- PostHog
- Sentry
- GitHub Actions

### Step 3 — Apply Database Schema

Run:

```bash
psql "$DATABASE_URL" -f schemas/database.sql
psql "$DATABASE_URL" -f schemas/rls.sql
```

### Step 4 — Seed Examples

Load:

```bash
node scripts/seed-examples.js
```

### Step 5 — Register Prompts

Add prompts into PromptOps registry table.

### Step 6 — Configure Agents

Load `agents/agent-registry.json`.

### Step 7 — Validate

Run validation against:

- entity fields
- relationships
- prompt metadata
- provenance coverage
- tenant isolation

## Output

Expected running system includes:

- entity registry
- relationship registry
- prompt registry
- agent registry
- provenance graph
- audit events
- memory records
- telemetry events

## Smoke Checks

- create tenant
- create asset
- create entity
- attach provenance
- create relationship
- run agent proposal
- log mutation event
- detect stale memory
- validate no cross-tenant traversal
