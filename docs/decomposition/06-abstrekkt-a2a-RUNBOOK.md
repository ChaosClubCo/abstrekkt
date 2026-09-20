# Runbook — `abstrekkt-a2a`

Authority domain: `abstrekkt_publication`. Source revision: `45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3`.
Extracts: `a2alayer/a2a-layer/` (A2A gateway, Express + TS, 40 agent cards, lockfile present, lane guard for INTINC/PERSONAL/FREELANCE).
Follow `03-EXTRACTION-RUNBOOK.md` for the generic procedure. This is the second live app, gated behind Phase 0 (secret rotation) and Phase 2 (site extraction proving the pattern).

## What's missing before this can deploy

The source has `start: tsx src/index.ts`, `test`, `typecheck`, `generate:cards` — **no `build` script**. It currently only runs via `tsx` (a dev-time TS runner), which is fine for local use but not for a container image.

1. Add a real `build` step (`tsc` to `dist/`, or keep `tsx`/`node --experimental-strip-types` in production if that's an accepted tradeoff — decide and document the choice in the new repo's README).
2. Add a `Dockerfile`: multi-stage, `npm ci --omit=dev` in the final stage, non-root user, `EXPOSE` the configured `PORT`.
3. Add a `/health` endpoint if one doesn't already exist — required for Fly/Railway health checks.

## Environment (zod-validated in source — names only, per §5 hard rule: server-side only, never in client bundles)

`A2A_PUBLIC_BASE_URL`, `PORT`, `A2A_GATEWAY_TOKEN`, `A2A_BACKEND`, `A2A_MODEL_OVERRIDE`, `A2A_MAX_OUTPUT_TOKENS`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` (+ `_BASE_URL`/`_MODEL{,_FAST,_BALANCED,_DEEP}`), `GOOGLE_API_KEY`, `GOOGLE_GENAI_USE_VERTEXAI`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_MODEL{,_FAST,_BALANCED}`.

All of these overlap in name with rotated entries from `02-SECRET-ROTATION-RUNBOOK.md`. Issue fresh, scoped credentials for this service specifically — do not reuse the same live key across `abstrekkt-edge` and `abstrekkt-a2a`; a compromise of one container shouldn't compromise the other.

## Host: Fly.io or Railway (decision: container, per Kyle's answer)

- `A2A_GATEWAY_TOKEN` is mandatory and checked on every route — this service is **not public-unauthenticated**. Confirm no route bypasses the check before first deploy.
- Set secrets via the platform's own secret manager (`fly secrets set` / Railway environment variables), never in the repo.

## Lane guard — verify before first deploy, not after

The source includes an INTINC/PERSONAL/FREELANCE lane-isolation guard and 40 agent cards. Before this repo is deployed anywhere:

1. Run the existing test suite (`npm test`, `npm run typecheck`).
2. Add (if not present) a specific test asserting that no INTINC-tagged agent card is reachable from a deployment configured as the Abstrekkt/personal lane — this is the one property that, if it silently regresses, would leak employer-context material into a personal-lane deployment.
3. Confirm none of the 40 agent cards reference INT/Intinc material by re-running the same `intinc` grep pattern the lane-classification audit used, scoped to `a2alayer/a2a-layer/` only, and manually reviewing any hit before shipping.

## Read-back verification

- `/health` returns 200 pre-and-post deploy.
- A request with a valid `A2A_GATEWAY_TOKEN` succeeds; without one, returns 401.
- Lane-guard test (above) passes in CI, blocking merge if it fails.

## Done means

- Container builds and runs `npm run build && npm test` green in CI.
- Deployed on Fly.io or Railway with `/health` verified.
- `docs/migrations/abstrekkt-a2a/receipt.md` filed in this repo.
