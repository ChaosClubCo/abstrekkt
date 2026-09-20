---
description: FlashFusion stack-specific rules and patterns
---

# FlashFusion stack rules

## Base44
- App IDs are permanent references — never guess or infer them. Check CLAUDE.md.
- B44 GitHub integration: broken after org migration. Fix = OAuth disconnect/reconnect at account level.
- Bearer credentials for n8n must be set manually — they are not auto-provisioned.
- SCH-02 lane field is required for workflow routing — missing it silently breaks workflows.

## n8n
- Workflows live at krosebrook.app.n8n.cloud — this is the cloud instance, not self-hosted.
- Error handling node required on every workflow that touches external APIs.
- If a workflow is blocked, check credentials first — most failures are auth, not logic.
- IMPORTANT: Do not deploy workflow changes during active agent sessions.

## Supabase (flashnframe-app)
- Project ID: etctmappdhpjuwptdbeb
- Public schema is empty — migrations have not run. Check before assuming tables exist.
- RLS must be enabled on every table — never use service key in client-side code.
- Use `supabase gen types typescript` after any schema change.

## Anthropic API
- Model default: claude-sonnet-4-6 for most tasks, claude-haiku-4-5 for high-volume/low-stakes.
- Always set max_tokens. Always log prompt tokens and completion tokens per call.
- Prompt caching where eligible — check if the system prompt is stable enough to cache.

## Cloudflare
- Account ID: 6625be44cf920108567ca9923c536b12
- Workers for edge routing and lightweight compute.
- Pages for static/SSR deployments. Use Preview environments before pushing to production.
