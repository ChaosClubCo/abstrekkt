# Runbook — `abstrekkt-site`

Authority domain: `abstrekkt_publication`. Source revision: `45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3`.
Extracts: `project/deploy/abstrekkt-com/` (as `/`), `loadbearingsite/` (as `/load-bearing/`), `rendered/` (as `/tools/renderer/`).
Follow `03-EXTRACTION-RUNBOOK.md` for the generic procedure; this file covers what's specific to this surface.

## Why first

`abstrekkt.com` is already CERTIFIED-deployed (see `00-AUDIT-FINDINGS.md` §1). This extraction moves the *source of truth* for an already-working deploy into its own repo — lowest risk in the plan, and it establishes the pattern the other extractions reuse.

## Cloudflare Pages setup

- Project name: reuse the existing Pages project `abstrekkt` (confirm in the Cloudflare dashboard before creating a second one — `docs/cloudflare/CloudflareResourceSourceManifest.v1.json:8` notes a second, unrelated `abstrekkt` Worker with routes on `*.loxihart.com`/`*.flashfusion.co`/`*.abstrekkt.com` — do not confuse the two).
- Build: none (static HTML). Publish directory: repo root, or `/site` if the renderer output needs a separate build step first.
- `_headers` file: port verbatim from `.github/workflows/abstrekkt-cloudflare-pages.yml:181-200` in this repo.
- Sitemap/robots generation: port the logic added in commit `d85d3579` (this repo) and documented in `90900ac1` — these are the two commits ahead of the currently-live SHA that never got deployed; carrying them forward here is how the new repo starts *current*, not stale.

## CI

One workflow, `deploy.yml`, on push to `main`:

1. Generate `sitemap.xml` / `robots.txt` against `https://abstrekkt.com`.
2. `wrangler pages deploy . --project-name=abstrekkt --branch=main --commit-hash=<sha>`.
3. Read-back check: curl `/`, `/founder/`, `/pillars/`, `/contact/`, `/load-bearing/` — all must return 200; check the `<title>` matches the expected value.
4. On success, write a receipt JSON matching the shape of `evidence/releases/abstrekkt/2026-08-26-e1d3355-release-receipt.json` (this repo) and commit it to the new repo under `evidence/releases/`.

Secrets needed in the new repo: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (rotated values only — see `02-SECRET-ROTATION-RUNBOOK.md`; these two are not in `Infinite-heroes-env.txt` but should be freshly issued scoped tokens for the new repo regardless, not reused from any other project's token).

## DNS

Apex `abstrekkt.com` should already CNAME to `abstrekkt.pages.dev` per the existing receipt (L80-87 of the certified receipt in this repo). No DNS change is needed unless the Pages project is recreated rather than reused.

## Read-back verification (same bar as the existing CERTIFIED receipt)

- All five routes above return 200.
- Page `<title>` matches expected value per route.
- `deployedSha` in the new receipt equals the commit that triggered the deploy.
- `overallStatus: CERTIFIED` only after read-back passes; anything else stays `PENDING` or `FAILED`.

## Rollback

`wrangler pages deployment list --project-name=abstrekkt` → `wrangler pages deployment rollback <deployment-id>`. Cloudflare Pages keeps prior deployments; no rebuild required to roll back.

## Done means

- New repo pushed, CI green, deploy receipt committed there.
- `abstrekkt.com` serves the new repo's content (verify via a build-stamp comment or meta tag unique to the new deploy).
- `docs/migrations/abstrekkt-site/receipt.md` filed in **this** repo per `EXTRACTION_RECEIPT_TEMPLATE.md`.
- This repo's `project/deploy/abstrekkt-com/`, `loadbearingsite/`, `rendered/` are untouched (no deletion until a later, separate, gated change).
