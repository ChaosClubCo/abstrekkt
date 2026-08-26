# Credential Rotation Checklist — flashfusion-production.env
**Generated:** 2026-07-10 · 266 keys enumerated by name only (no values were read into chat or cloud)
**Status of original file:** `murmwarevidencearchive20260708\protected\flashfusion-production.env` — treat every value in it as **compromised at rest** (plaintext, on disk, inside a folder that gets shared/staged into AI sessions, including this one).

## Sequencing rule (from credential-lifecycle procedure)
Stage the NEW key alongside the old → cut over every consumer → verify one authenticated call per consumer → THEN revoke the old. Revoke-first **only** if you confirm active exfiltration. Do **not** scrub the plaintext values from disk until each service is rotated — the old value is your last login proof for services you've lost track of.

---

## TIER 0 — Do these first (vault + blast-radius anchors)

- [ ] **BITWARDEN_RECOVERY_CODE / BITWARDEN_CLIENT_SECRET / BITWARDEN_OAUTH_CLIENT_ID** — your secret manager's own recovery code is in plaintext. Regenerate the recovery code in Bitwarden (Settings → Security), rotate the client secret. Everything below should be re-stored *into* Bitwarden as you rotate it.
- [ ] **AWS_SECRET_ACCESS_KEY + AWS_ACCESS_KEY_ID_DDB / _STS** — IAM → deactivate → create new access keys. Check CloudTrail for the exposure window.
- [ ] **STRIPE_SECRET_KEY / STRIPE_SIGNING_SECRET / STRIPE_RESTRICTED_KEY** — money-moving. Stripe Dashboard → Developers → API keys → roll. Update webhook signing secret in every consumer (n8n, Vercel).
- [ ] **SUPABASE service_role keys (×4: SUPABASE_SERVICE_ROLE_KEY, _FLASHNFRAME_, _SECONDARY_, N8NINTSUPABASE_KEY) + SUPABASE_DB_PASSWORD + SUPABASE_JWT_SECRET + SUPABASE_PAT** — ⚠ regenerating service_role invalidates all JWTs signed with it; do off-peak, update Vercel + n8n + Edge Functions *simultaneously* (per rotation procedure). service_role is server-only — anon/publishable keys are fine client-side and low priority.
- [ ] **GitHub PATs (×6: GITHUB_TOKEN, _PAT_NEW, _PAT_ALT, _PAT_API_CC, _PERSONAL_ACCESS_TOKEN, _CI_SECRET) + OAuth client secrets** — github.com → Settings → Developer settings → revoke all, mint one per consumer with date-stamped names.
- [ ] **App-signing secrets: JWT_SECRET, JWT_REFRESH_SECRET, SESSION_SECRET, ENCRYPTION_KEY** — rotating logs out all sessions; anything encrypted with ENCRYPTION_KEY must be re-encrypted or the old key archived offline first. **Do not lose the old ENCRYPTION_KEY until you've verified nothing on disk still needs it.**
- [ ] **DB conn string with embedded user:pass** found in 3 docs (same doc, triplicated): `murmwarevidencearchive...\archive\ai-envisionment-vibe-engineering.md`, `flashfusion_export\...\01-autonoma-...-source.md`, `...sales_enablement_kit\00_sources\Autonoma AI Platform.txt` + **MONGODB_CONNECTION_STRING / POSTGRES_URL / REDIS_URL / UPSTASH_REDIS_URL** in the env. Rotate the DB passwords, then scrub the string from those 3 docs (I can do the scrub on request — after rotation).

## TIER 1 — High privilege / high spend (this week)

- [ ] **Anthropic (×3: ANTHROPIC_API_KEY, _ALT, _FLASHFUSION_KEY + ANTHROPIC_ADMIN_API + CLAUDE_CODE_CLI_KEY/_SECRET, CLAUDE_DEFAULT_API_KEY)** — Admin API key especially: it can mint other keys. platform.anthropic.com → roll, name `anthropic-prod-2026-07`.
- [ ] **OpenAI (×7 variants)**, **Google AI / Vertex / Jules / Agent Studio (×6)**, **Grok/xAI (×5 incl. 2 unlabeled)**, **DeepSeek, Cohere, Mystral, OpenRouter, Perplexity** — roll all LLM keys; consolidate: one key per consumer, kill the ALT/unlabeled ones at the provider.
- [ ] **Deploy/infra tokens: VERCEL_TOKEN + _CI_TOKEN + AIGATEWAY, NETLIFY_ACCESS_TOKEN, RAILWAY (×2), RENDER (×2), TERRAFORM_API_TOKEN, DOCKER (×3), NPM (×2), GITLAB_PAT** — each can ship code to prod.
- [ ] **Auth/identity: CLERK_SECRET_KEY, AZURE_CLIENT_SECRET (+tenant), OAuth client secrets (Google ×4 sets, Notion, Linear/GitLab, WordPress, Shopify, Gumroad)**.
- [ ] **Comms: TWILIO_AUTH_TOKEN, SLACK_BOT/APP_TOKEN, DISCORD_BOT_TOKEN, TELEGRAM_KYROBOT_API** — bot tokens = impersonation.
- [ ] **WORDPRESS_PASSWORD** — literal password; change it and enable 2FA.

## TIER 2 — Standard SaaS keys (this month, 90-day schedule going forward)

HubSpot (×2), Datadog, Sentry (key + auth token; DSNs are low-risk), PostHog (×3), Snyk, Firecrawl (×3), Figma (×2), GoDaddy (prod + test), Shopify, Printify, WooCommerce, Wix, Gumroad, Base44, Bubble, Databutton, HeyGen, Suno, Speechify, VoiceClone, YouTube, Memories.ai, LangChain/LangSmith/LangGraph (×5), CrewAI (×2), Upstash/KV (×6), NeonDB, Cypress, Playwright, Blackbox, V0 (×3), Loveable, plus the misc/unknown ones (TAMI, TESSA, NEO, STABLE, IDEA_BROWSER ×2, WINDOWSIO_MCP, BOLT_AI_INT_TRIAGE, APP_WRITER, UMPG_PROMPT_GEN, GITKRAKEN license).

## TIER 3 — Webhook URLs (rotate = regenerate URL at source)

Zapier hooks (×11), Discord webhooks (×2), Slack webhook, PIPELINE_WEBHOOK_SECRET. Webhook URLs are capability URLs — anyone holding them can inject events.

## Not secrets — no action
Config flags (ENABLE_*, MAX_TOKENS, TEMPERATURE, TOP_P, CACHE_TTL, CORS_*, rate limits, model names, TWILIO_PHONE_NUMBER, VERCEL_PROJECT_ID, WORDPRESS_URL/PORT, AWS_S3_BUCKET/ACCOUNT_ID, SENTRY_DSNs, NEXT_PUBLIC_* and Supabase anon/publishable keys).

---

## After rotation
1. Refill values into **Bitwarden** (or Doppler), one collection per lane (FlashFusion / INT / personal — this env currently mixes all three).
2. Replace the original `.env` with the generated **`flashfusion-production.env.template`** (sits beside it in `protected\`). Destroying the original is your call — I don't delete.
3. Tell me to scrub the conn string from the 3 Autonoma docs.
4. Adopt naming `{service}-{env}-{YYYY-MM}` and put the quarterly credential review on the calendar.

## Inventory table (start filling as you rotate)
| Service | Key(s) | Consumers | Schedule | Last rotated |
|---|---|---|---|---|
| Anthropic | 5 | Vercel, n8n, Claude Code | 90d | — |
| Supabase | 15 | Vercel, n8n, Edge Fns | 180d | — |
| Stripe | 6 | n8n, Zapier hooks | 90d | — |
| AWS | 8 | S3, DDB, CloudFront | 90d | — |
| GitHub | 8 | CI, OAuth apps | 90d | — |
| … | | | | |
