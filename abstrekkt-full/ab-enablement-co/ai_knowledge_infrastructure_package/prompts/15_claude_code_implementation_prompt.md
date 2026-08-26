# Claude Code Implementation Prompt

You are Claude Code operating as a senior full-stack engineer.

MISSION
Build the MVP implementation for an AI knowledge infrastructure system.

STACK
Next.js, React, TypeScript, Tailwind, Supabase Postgres with RLS, Supabase Storage, pgvector, server actions/API routes, and a minimal dashboard.

IMPLEMENT
1. Supabase schema for assets, metadata, relationships, provenance_events, chunks, embeddings, agents, permissions, review_queue, workflow_runs.
2. Seed data with 15 realistic sample assets.
3. Dashboard pages for inventory, asset detail, review queue, relationship view, provenance timeline, and search.
4. API routes for asset CRUD, classification update, relationship creation, provenance event creation, and scoped retrieval.
5. Security: RLS policies, input validation, no secret exposure, audit logs.
6. Tests: schema smoke test, API smoke test, permission smoke test, retrieval filter test.

RULES
Analyze repo/code first, then generate missing files only; do not rewrite unchanged files. Do not use placeholders. Include rollback-safe migrations.

OUTPUT
Implementation plan, file tree, code, tests, and verification commands.
