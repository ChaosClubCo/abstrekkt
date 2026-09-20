# System Architecture

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Context

FlashFusion is composed of revenue-facing client workflows, internal delivery operations, AI orchestration, knowledge/memory infrastructure, and future product modules.

## Logical Components

- Web portals: public marketing site, intake/audit app, client dashboard, internal ops dashboard.
- API layer: typed service endpoints for organizations, leads, audits, artifacts, agents, prompts, and analytics.
- Data layer: Supabase Postgres with RLS, pgvector embeddings, provenance records, audit logs, and generated artifact lineage.
- Agent layer: router, specialist agents, prompt templates, tool policies, evaluation harness, budget controls, and human review queue.
- Storage layer: raw files stay in Google Drive, OneDrive, GitHub, or approved storage; metadata and relationships are stored in Postgres.
- Observability layer: app errors, product analytics, AI traces, uptime alerts, and audit events.

## Trust Boundaries

Public users can submit leads and proof-of-value forms. Authenticated owners can view their organization workspaces. Internal operators can run audits and approve artifacts. Agents can only access approved context scopes and must log actions.
