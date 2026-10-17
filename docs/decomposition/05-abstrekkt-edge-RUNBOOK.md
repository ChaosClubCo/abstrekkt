# Runbook — `abstrekkt-edge`

Authority domain: `abstrekkt_publication`. Source revision: `45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3`.
Extracts: `project/proxy-deploy/` (Worker `kr-mentor-proxy`), `tooling/webhook-receiver/` (Worker `abstrekkt-webhook-receiver` + D1 `abstrekkt-webhook-replay`).
Follow `03-EXTRACTION-RUNBOOK.md` for the generic procedure.

## Layout

```
abstrekkt-edge/
  workers/kr-mentor-proxy/       # from project/proxy-deploy/
  workers/webhook-receiver/      # from tooling/webhook-receiver/
```

Each Worker keeps its own `wrangler.toml` and deploys independently; a shared repo is for operational convenience only, not a shared deploy unit.

## `kr-mentor-proxy`

- Config already exists in-tree at `project/proxy-deploy/wrangler.toml` — copy verbatim (Worker name `kr-mentor-proxy`, entry `src/index.js`, compat date `2024-11-01`, secrets explicitly not stored in the file).
- Secrets (set via `wrangler secret put`, never committed): `PROXY_TOKEN`, `NOTION_TOKEN`, `GITHUB_TOKEN`, `GOOGLE_TOKEN`, `MS_TOKEN`, `OPENAI_API_KEY`, `MCP_TOKEN`, `MCP_URL`. These overlap in *name* with entries in `Infinite-heroes-env.txt` — issue fresh, narrowly-scoped tokens for this Worker specifically; do not reuse any value from that file even after rotation.
- CI: port `.github/workflows/kr-mentor-proxy-deploy.yml` from this repo, trigger on push to the new repo's `main` instead of a `deploy/*` branch (that branch-push pattern was a workaround for this repo's monorepo structure and isn't needed once this Worker has its own repo).

## `webhook-receiver`

- **This Worker currently has no in-dir `wrangler.toml`** — its deploy config lives entirely in `.github/workflows/abstrekkt-webhook-receiver-provision.yml` in this repo. Extract that config into a proper `wrangler.toml` in the new repo (Worker name `abstrekkt-webhook-receiver`, D1 binding to `abstrekkt-webhook-replay`, apply `schema.sql` on first deploy).
- Secret: `WEBHOOK_SECRET` (referenced as `ABSTREKKT_WEBHOOK_SECRET` in this repo's CI) — issue a fresh value; update the sending side (`repository-webhooks.yml` in `ChaosClubCo/abstrekkt`, or its successor) to match.
- Tests: `node --test worker.test.mjs` already exists and is self-contained — carry it over unchanged, run it in CI before every deploy.

## Read-back verification

- `kr-mentor-proxy`: `wrangler dev --dry-run` succeeds in CI; a live smoke test posts a request with a valid `PROXY_TOKEN` and expects a non-5xx response (do not assert on downstream provider content).
- `webhook-receiver`: replay one real GitHub webhook payload (a PR or issue comment event) through the deployed endpoint and confirm it lands in D1 with correct HMAC verification; confirm a bad-signature request is rejected.

## Done means

- Both Workers deploy independently from the new repo's CI.
- `docs/migrations/abstrekkt-edge/receipt.md` filed in this repo.
- `ChaosClubCo/abstrekkt`'s webhook-sending workflow (`repository-webhooks.yml`) is repointed to the new endpoint only after the new one is verified live — do not cut over blind.
