# Agent instructions — FlashFusion

## Project overview
FlashFusion AI platform and consulting ops. Owner: Kyle Rosebrook.
See CLAUDE.md for full context. This file is for cross-tool compatibility (Cursor, Codex, etc.).

## Tech stack
TypeScript / React · Supabase (Postgres + Auth + RLS) · Cloudflare Workers/Pages · n8n (automation) · Base44 (platform apps) · Anthropic API (claude-sonnet-4-6 default)

## Key commands
```bash
npm run dev          # local dev server
npm run build        # production build
npm test             # test suite
pnpm supabase gen types typescript  # regenerate DB types after schema changes
```

## Hard rules
- Never commit secrets, API keys, or .env values.
- Never disable Supabase RLS — raise an error if asked to.
- Never modify applied Supabase migrations without explicit instruction.
- Never use placeholder content — if data is missing, surface the gap.
- Idempotent writes only — all data operations must be safe to retry.

## When in doubt
Check MEMORY.md for past decisions before proposing new approaches.
Check CONTEXT.md for current sprint focus before doing work not on the active list.
