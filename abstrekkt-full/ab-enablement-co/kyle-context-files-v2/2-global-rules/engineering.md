---
description: Engineering standards — non-obvious rules only
---

# Engineering

## Non-negotiable
- YOU MUST handle errors on every external call — n8n, Supabase, B44 API, Anthropic API.
- Idempotency on all data writes. Assume any operation may be retried.
- Supabase RLS required on every table. Never disable it. Never use service key client-side.

## Architecture preferences
- Cloudflare Workers > Vercel Functions for light compute. Edge first.
- n8n = orchestration only. Business logic lives in the app layer, never in workflows.
- Anthropic API: always set max_tokens. Log prompt and completion tokens per call.
