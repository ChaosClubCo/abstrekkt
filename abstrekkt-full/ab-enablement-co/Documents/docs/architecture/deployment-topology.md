# Deployment Topology

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Topology

- Public site and client portal: Vercel project `flashfusion-core`.
- Agent API: Supabase Edge Functions or Node service behind authenticated API.
- Database: Supabase project with migrations controlled by GitHub Actions.
- Observability: Sentry/PostHog/Langfuse event streams.
- Raw source stores: Google Drive, OneDrive, GitHub, local archival exports.

## Promotion Flow

Feature branch → PR checks → preview deploy → staging migration → staging smoke → production migration → production smoke → release note.
