---
description: Engineering and architecture standards — apply across all projects
---

# Engineering standards

## Core rules
- IMPORTANT: Prefer existing patterns in the codebase before introducing new ones.
- YOU MUST handle errors on every external call (n8n webhooks, Supabase queries, B44 API, Anthropic API).
- Never introduce a new dependency without acknowledging the maintenance cost.
- Idempotency on all data writes — always assume operations may be retried.
- Secrets never in code or committed files. All env-specific values in .env.

## Architecture defaults
- Edge over server for light compute: Cloudflare Workers > Vercel Functions for simple routing.
- Supabase RLS policies required on every table with user-facing data — never disable.
- n8n handles orchestration only. Business logic lives in the application layer, not workflows.
- Anthropic API calls: always set max_tokens, always handle rate limits, always log token spend.

## Code quality
- Readability over cleverness. Future Kyle should understand this in 6 months without context.
- Comments explain WHY, not WHAT.
- Smallest change that fixes the problem first. Clean up in a second pass.
- No placeholder content or TODO-left-in-prod. If it's not implemented, say so.
