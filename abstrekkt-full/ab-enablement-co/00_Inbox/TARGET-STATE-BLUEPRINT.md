# TARGET STATE BLUEPRINT

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Executive Target State

FlashFusion is a revenue-first AI enablement operating system: a consulting practice, a reusable delivery engine, and a future SaaS/studio platform. The immediate focus is paid audits, workshops, readiness dashboards, and workflow automation packages for SMBs, operations leaders, teams, and domain-specific champions. The long-term platform converts repeated consulting patterns into reusable modules, agent definitions, prompt packs, dashboards, and commerce/studio workflows.

## Single Recommended Architecture

The canonical build is a TypeScript-first platform with Next.js for dashboards and client portals, Supabase for Postgres/RLS/pgvector/storage metadata, Vercel for deployment, GitHub Actions for CI, Sentry/PostHog/Langfuse/OneUptime for observability, and provider-agnostic AI routing for Claude/Gemini/OpenRouter-compatible models. Raw files remain in Google Drive, OneDrive, GitHub, and local backups; the intelligence layer stores provenance, summaries, embeddings, relationships, approvals, and generated artifacts.

## Deprecated / Archived Approaches

Angular commerce SaaS is preserved as a lineage decision and may be revived for commerce-specific modules after revenue workflows stabilize. Notion is removed from canonical architecture. Base44 remains a generator/prototyping tool and cannot be treated as the production source of truth unless its repository binding is explicitly stable.

## North-Star User Journeys

1. Lead enters through readiness/audit intake.
2. FlashFusion qualifies the lead using pricing floor, use-case fit, and urgency.
3. Audit workspace is created with organization, stakeholders, systems, workflows, risks, and automation candidates.
4. Agent-assisted analysis produces a findings dashboard, opportunity map, and implementation plan.
5. Human review approves claims, risks, and recommendations.
6. Client receives a scoped paid audit, workshop, or implementation package.
7. Reusable patterns become prompt templates, agent skills, code modules, and playbook updates.

## Release Gates

- No unauthenticated high-impact endpoints.
- All user data tables have RLS.
- Prompt outputs that affect clients pass claims review.
- Every new agent has policy, telemetry, fallback, budget, and eval definitions.
- Every recurring automation has action-yield measurement.
