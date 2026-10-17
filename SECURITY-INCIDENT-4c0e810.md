# Security note: credentials leaked in commit 4c0e810

Commit `4c0e8103` (2026-07-18) added `flashnframe_secrets.env` and `Infinite-heroes-env.txt`,
which contained ~110 live-format credentials (LLM providers, GitHub/npm/Docker PATs, Neon,
Supabase DB URLs/service-role keys, HubSpot, Twilio, Clerk, Azure, GoDaddy, etc.).

- The files are no longer in `main`'s tree (removed in c3b427b6 / 7eaf8378), but they
  **remain in git history** and `Infinite-heroes-env.txt` is still present on 15 other branches.
- `.gitignore` blocks `*.env`, `*-env.txt` and both filenames explicitly.
- **Treat every value in those files as compromised and rotate it.** Removing files does not
  un-leak secrets. A history rewrite (git filter-repo + force-push + GitHub support cache
  purge) is a separate, owner-approved decision.
- Never commit real env files; use `.env.example` with placeholders and a secret manager
  (Vercel/Cloudflare/GitHub Actions secrets).
