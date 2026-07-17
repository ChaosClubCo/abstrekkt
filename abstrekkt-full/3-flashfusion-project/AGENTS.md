# Agent instructions — FlashFusion

## Stack
TypeScript / React · Supabase (Postgres + Auth + RLS) · Cloudflare Workers/Pages
n8n (orchestration) · Base44 (platform apps) · Anthropic API (claude-sonnet-4-6 default)

## Key commands
```bash
npm run dev && npm run build && npm test
pnpm supabase gen types typescript  # after schema changes
```

## Hard rules
- Never commit secrets or .env values.
- Never disable Supabase RLS.
- Never modify applied Supabase migrations without explicit instruction.
- All data writes must be idempotent.
- No placeholder content — surface the gap if data is missing.

## Before starting work
Check @CONTEXT.md for current sprint focus.
Check @MEMORY.md for past decisions before proposing new approaches.
