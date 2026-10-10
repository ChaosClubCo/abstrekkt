# Secret rotation runbook — Infinite-heroes-env.txt

Authority domain: `abstrekkt_publication`. Source revision: `45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3`.
Blocking gate: no extraction in `03-EXTRACTION-RUNBOOK.md` and later proceeds to a real deploy until every row below is complete. This runbook contains **key names only** — never values. It was generated without reading, printing, or exfiltrating any credential value.

## Why this exists

`Infinite-heroes-env.txt` is tracked in git (commit `b7468661`), 134 lines, 108 unique `KEY=value` credential names. The `.gitignore` rule `*-env.txt` is inert for this specific file because it was committed before the rule existed. As of this audit, rotation status is **unconfirmed — treat every key below as live until this ledger says otherwise.**

**Status update, 2026-09-23 (refresh in place, per `docs/DOCUMENTATION_STANDARDS.md`):**

- `Infinite-heroes-env.txt` and `project/uploads/Backup-codes-krosebrook86.txt` (account backup codes, restored to `main` by `77c0a1d2`) were removed from the tip of branch `claude/charming-darwin-39g5to` on explicit instruction from the repository owner (see Post-rotation below). **Both remain readable in git history.** Removal from HEAD is not remediation.
- Root cause of the earlier re-entry: `.gitignore` carried `*.env` and `*-env.txt` with trailing inline `# …` comments, which git treats as part of the pattern, so both rules never matched anything. Fixed in the same change. `scripts/repo_integrity.py` now fails CI if any tracked file matches `.gitignore`, apart from a reviewed three-file allowlist.
- A masked pattern triage (values never printed) found no other real-shaped credentials in HEAD. The four other files listed in `never-extract.denylist` under "Live/possible credentials", plus ten further pattern-matched files (vendored templates, test fixtures, four copies of one skill doc), contain placeholders or test fixtures only.
- Rotation status is **unchanged: unconfirmed.** Every ledger row below is still treated as live. Add one row for the backup codes: regenerate them at the account provider, which invalidates the old set.

## Procedure per key

1. Open the provider's console (column below).
2. Issue a new credential.
3. Update wherever the old one is actually used (a separate, non-repo secret store — never re-commit it).
4. Revoke the old credential at the provider.
5. Verify the new credential works and the old one is rejected.
6. Fill in all four date/name columns below. Leave no row blank once rotation starts.

## Ledger

### AI / LLM providers

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | | | | | |
| `OPENAI_API_KEY` | | | | | |
| `GOOGLE_AI_API_KEY` | | | | | |
| `GOOGLE_JULES_API` | | | | | |
| `GROK_API_KEY` | | | | | |
| `OPENROUTER_API_KEY` | | | | | |
| `PERPLEXITY_API_KEY` | | | | | |
| `REPLICATE_API_KEY` | | | | | |
| `STABLE_API_KEY` | | | | | |
| `STAINLESS_API_KEY` | | | | | |
| `MYSTRAL_LOCAL_KEY` | | | | | |
| `VERTEX_API_TOKEN` | | | | | |
| `BLACKBOX_API_KEY` | | | | | |
| `V0_API_KEY` | | | | | |
| `OLLAMA_SSH` | | | | | |
| `LANGCHAIN_API_KEY` | | | | | |
| `LANGFUSE_API_KEY` | | | | | |
| `LANGGRAPH_API_KEY` | | | | | |
| `LANGSMITH_PAT` | | | | | |
| `LANGSMITH_SERVICE_API` | | | | | |
| `CREWAI_API_KEY` | | | | | |
| `CREWAI_ENTERPRISE_API_KEY` | | | | | |
| `E2B_API_KEY` | | | | | |
| `FIRECRAWL_API_KEY` | | | | | |
| `ATLAZ_NOMADIC_API_KEY` | | | | | |
| `ELEVEN_LABS_API_KEY` | | | | | |

### Source control / CI

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `GITHUB_API_TOKEN` | | | | | |
| `GITHUB_MCP_PAT` | | | | | |
| `GITHUB_PAT` | | | | | |
| `NPM_ACCESS_TOKEN` | | | | | |
| `NPM_RESET_KEY` | | | | | |
| `DOCKER_CLI_KEY` | | | | | |
| `DOCKER_HUB_PAT` | | | | | |
| `SNYK_API_KEY` | | | | | |
| `SENTRY_AUTH_TOKEN` | | | | | |

### Hosting / infra

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `VERCEL_API_TOKEN` | | | | | |
| `RAILWAY_API_KEY` | | | | | |
| `RAILWAY_API_TOKEN` | | | | | |
| `RENDER_API_KEY` | | | | | |
| `NEONDB_API_KEY` | | | | | |
| `EONDB_API_KEY` | | | | | |
| `UPSTASH_READ_ONLY_TOKEN` | | | | | |
| `UPSTASH_REDIS_KV_URL` | | | | | |
| `UPSTASH_REDIS_URL` | | | | | |
| `UPSTASH_REST_API` | | | | | |
| `UPSTASH_REST_API_TOKEN` | | | | | |
| `UPSTASH_REST_API_URL` | | | | | |
| `UPSTASH_WRITE_KEY` | | | | | |
| `DATABASE_URL` | | | | | |
| `DIRECT_URL` | | | | | |
| `POSTGRES_CONNECTION_STRING` | | | | | |
| `LOGTAIL_TOKEN` | | | | | |
| `DATADOG_API_KEY` | | | | | |
| `POSTHOG_API_KEY` | | | | | |
| `WAKATIME_API_KEY` | | | | | |

### Supabase / auth

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `SUPABASE_JWKS_URL` | | | | | |
| `SUPABASE_URL` | | | | | |
| `VITE_SUPABASE_ANON_PUBLIC_KEY` | | | | | |
| `VITE_SUPABASE_JWT_SECRET` | | | | | |
| `VITE_SUPABASE_PUSHABLE_KEY` | | | | | |
| `VITE_SUPABASE_SECRET_KEY` | | | | | |
| `VITE_SUPABASE_SERVICE_ROLE_SECRET` | | | | | |
| `CLERK_PUBLIC_KEY` | | | | | |
| `CLERK_SECRET_KEY` | | | | | |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | | | | | |
| `HCAPTCHA_SECRET_KEY` | | | | | |
| `HCAPTCHA_SITE_KEY` | | | | | |
| `RECAPTCHA_SECRET_KEY` | | | | | |

### Productivity / SaaS

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `NOTION_API_KEY` | | | | | |
| `NOTION_API_KEI_CLAUDE` | | | | | |
| `NOTION_OAUTH_CLIENT_ID` | | | | | |
| `NOTION_OAUTH_CLIENT_SECRET` | | | | | |
| `LINEAR_GITLAB_CLIENT_ID` | | | | | |
| `LINEAR_GITLAB_CLIENT_SECRET` | | | | | |
| `HUBSPOT_DEV_KEY` | | | | | |
| `HUBSPOT_PAT` | | | | | |
| `BASE44_API_KEY` | | | | | |
| `BITWARDEN_CLIENT_SECRET` | | | | | |
| `BITWARDEN_OAUTH_CLIENT` | | | | | |
| `AZURE_APPLICATION_ID` | | | | | |
| `AZURE_CLIENT_SECRET` | | | | | |
| `AZURE_TENANT_ID` | | | | | |
| `GOOGLE_OAUTH_CLIENT_ID` | | | | | |
| `GOOGLE_OAUTH_CLIENT_SECRET` | | | | | |
| `PIPEDREAM_FLOW_ID` | | | | | |
| `ZAPIER_HOOK` | | | | | |

### Domains / commerce

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `GODADDY_API_KEY` | | | | | |
| `GODADDY_PRODUCTION_KEY` | | | | | |
| `GODADDY_PRODUCTION_SECRET` | | | | | |
| `GODADDY_SECRET_KEY` | | | | | |
| `GODADDY_TEST_KEY` | | | | | |
| `WIX_API_KEY` | | | | | |
| `WORDPRESS_PASSWORD` | | | | | |
| `WORDPRESS_PORT` | | | | | |
| `WORDPRESS_URL` | | | | | |
| `WOOCOMMERCE_API_KEY` | | | | | |
| `GUMROAD_API_TOKEN` | | | | | |
| `PRINTIFY_API_TOEKN` | | | | | |
| `FIGMA_SECRET_KEY` | | | | | |

### Comms

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `TWILIO_ACCOUNT_SID` | | | | | |
| `TWILIO_AUTH_TOKEN` | | | | | |
| `TWILIO_PHONE_NUMBER` | | | | | |
| `TELEGRAM_KYROBOT_API` | | | | | |
| `RESEND_API_KEY` | | | | | |
| `HUNTERIO_API_KEY` | | | | | |
| `REDDIT_API_KEY` | | | | | |

### Uncategorized / verify manually

| Key name | Provider console | Rotated at | Old revoked at | Verified at | Verified by |
| --- | --- | --- | --- | --- | --- |
| `R` | | | | | |
| `FALAI_API_KEY` | | | | | |
## Notes on specific rows

- `R` — key name is a single letter in the source file; likely a truncated/malformed line. Verify manually against the original file before treating it as a real credential.
- `PRINTIFY_API_TOEKN`, `NOTION_API_KEI_CLAUDE` — misspelled in source; rotate under the correct provider regardless of the typo.
- `SUPABASE_JWKS_URL`, `VITE_SUPABASE_*` — several variants exist (anon/public/service-role/JWT secret). Rotate the service-role and JWT-secret variants first; they carry the most privilege.
- `AZURE_*`, `GOOGLE_OAUTH_*` — these are OAuth app credentials, not simple API keys. Rotating means regenerating the client secret in the app registration, not just an API token.

## Post-rotation

- Store real values only in each target repo's own secret manager (GitHub Actions secrets, Wrangler secrets, Fly/Railway secrets) — never in a repo file, `.env.example` excluded (name-only templates remain fine).
- Once every row above shows `verified_at`, update `01-DECOMPOSITION_PLAN.md`'s Phase 0 status and this file's blocking-gate note.
- `Infinite-heroes-env.txt` itself stays in this repo's history (569 MB `.git`, no history rewrite planned — see `01-DECOMPOSITION_PLAN.md` architecture choice C). Rotation neutralizes the leak; it does not remove the tracked file. Do not delete the file without a separate, explicit decision — deleting from the working tree does not remove it from history and could create a false sense of resolution. **Decision recorded 2026-09-23:** the repository owner explicitly instructed deletion ("Delete the credentials first"). The file was removed from HEAD in the change that added this note. History is untouched: no rewrite, consistent with choice C. This decision does not close this runbook's gate; only completed rotation does.
