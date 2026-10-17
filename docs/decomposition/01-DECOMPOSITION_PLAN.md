# Decomposition plan — Abstrekkt live-app surfaces

Authority domain: `abstrekkt_publication`. Source revision: `45b2bb07e45b43fbaca6bcaaa3fed0456556e5d3`.
Governed by `repository-registry.yaml` (authority domains) and the migration contract at lines 66-77 of that file.
See `00-AUDIT-FINDINGS.md` for the full audit this plan is built on.

## Decisions on record (Kyle, 2026-09-18)

1. The first live app is `abstrekkt.com` (already deployed); the second is the A2A agent gateway.
2. FlashFusion/Next+Supabase product surfaces are Loxihart-lane and ship from `Krosebrook/Loxihart`, not from here.
3. Credentials in `Infinite-heroes-env.txt` are **not yet rotated** — no extraction work proceeds to a real deploy until `02-SECRET-ROTATION-RUNBOOK.md`'s ledger is complete.
4. Strategy is fresh repos per deploy surface (not a monorepo, not a history rewrite of this repo). This repo remains the private archive of record.
5. A2A gateway runs as a container on Fly.io or Railway (Express doesn't run on Cloudflare Workers as-is).

Open, defaults applied and labeled below: license choice for public repos; whether `.cursor/environment.json` or the registry is authoritative on `flashfusion-web`.

## Disposition table

Legend: **LIVE-NOW** deployable today · **EXTRACT** new repo, fresh history · **LOXIHART** belongs to `Krosebrook/Loxihart` · **ARCHIVE** stays here, private, frozen · **DENYLIST** never extracted under any circumstance

| Path | What | Disposition | Target repo |
| --- | --- | --- | --- |
| `project/deploy/abstrekkt-com/` | abstrekkt.com, 6 static files | **LIVE-NOW → EXTRACT** (first) | `abstrekkt-site` |
| `loadbearingsite/` | Load-Bearing essay site, 15 static files | EXTRACT | `abstrekkt-site` (as `/load-bearing/`) |
| `rendered/` | md→HTML package renderer, has lockfile | EXTRACT | `abstrekkt-site` (as `/tools/renderer`) |
| `project/proxy-deploy/` | `kr-mentor-proxy` Worker, already CI-deploy-wired | EXTRACT | `abstrekkt-edge` |
| `tooling/webhook-receiver/` | GitHub webhook Worker + D1, CI-wired, missing in-dir `wrangler.toml` | EXTRACT | `abstrekkt-edge` |
| `a2alayer/a2a-layer/` | A2A gateway, 40 agent cards, Express+TS, lockfile, lane guard | EXTRACT (second live app) | `abstrekkt-a2a` |
| `portfolio/…/kyle-portfolio/` | kylerosebrook.com portfolio, Next 14, no lockfile | EXTRACT (lower priority) | `kylerosebrook-site` |
| `site/` | Design drop; 1581-LOC HTML file (4x over the 400-LOC rule); hardcoded n8n webhook URL | Salvage into `kylerosebrook-site`, then DROP | — |
| `abstrekkt-full/model-audit-console/model-audit-console/` | Multi-model audit CLI, TS, lockfile, clean | EXTRACT (lower priority) | `abstrekkt-tools` |
| `abstrekkt-full/ab-enablement-co/kyle-mcp-v1.1.0/` | MCP server on Vercel functions, lockfile | EXTRACT (lower priority) | `abstrekkt-tools` |
| `abs-newsletter-automation/` | 5 n8n workflow JSONs | EXTRACT as config-only repo | `abstrekkt-automation` |
| `Unicorn-maybe/flashfusion-web/` | Next + three.js marketing site, lockfile | **LOXIHART** | `Krosebrook/Loxihart` (handoff) |
| `project/audit/src/website/` + `project/remediation/clean/website/` | Identical Turborepo/Next 14/Supabase site (keep `clean/` copy only), no pnpm lockfile | **LOXIHART** | `Krosebrook/Loxihart` (handoff) |
| `project/remediation/clean/dashboard/` | Vite kanban dashboard, no lockfile | **LOXIHART** | `Krosebrook/Loxihart` (handoff) |
| `loxihart/pilot-console/` + siblings | Frozen, most CI-wired app in the repo (6 workflows) | **ARCHIVE** here (frozen); migration blocked on `docs/export/MIGRATION_CONTRADICTIONS.md` C-0014 | `Krosebrook/Loxihart` (future, gated) |
| `governance/trust/`, `ops/launch-control/`, `scripts/` | Conformance suites for this repo | STAY | this repo |
| `abstrekkt-control-center/`, `daily-command-center/`, `ff-workstream-mapper/` | Single-file HTML artifacts, byte-identical copies exist elsewhere | ARCHIVE | this repo |
| `abstrekkt-full/ab-enablement-co/flashfusion-OAAS/` | 6,346 files, vendored third-party repos + boilerplate | ARCHIVE, never extract | this repo |
| `abstrekkt-full/ab-enablement-co/abstrekkt-handoff/abstrekkt/` | Nested self-copy of this repo | ARCHIVE, drop candidate later | this repo |
| ~93 memoir/clinical/family directories, `clinical-source/`, root clinical PDFs/docx | Restricted lane | **DENYLIST** | this repo, private, forever |
| `memoir_letter_to_kinsley/`, `parallel_constructions_kinsley/` | Exceeds `protections.js` "absent" seal for Kinsley | **DENYLIST** | this repo, private, forever |
| `Infinite-heroes-env.txt`, 4 flagged token-pattern files | Live/possible credentials | **DENYLIST** | this repo, rotate then archive |
| `4-intinc-project/` + all INT/Intinc-tagged material (2,849 file hits, 88% under `abstrekkt-full/`) | Excluded lane | **DENYLIST** | this repo |

## Target repos, hosts, owners

| Repo | Host | Contains | Owner |
| --- | --- | --- | --- |
| `abstrekkt-site` | Cloudflare Pages (existing project `abstrekkt`, existing DNS) | Public static site + essays + renderer tooling | Kyle |
| `abstrekkt-edge` | Cloudflare Workers | `kr-mentor-proxy`, `webhook-receiver` | Kyle |
| `abstrekkt-a2a` | Fly.io or Railway (container) | A2A gateway, 40 agent cards | Kyle |
| `kylerosebrook-site` | TBD (Vercel/Cloudflare Pages) | Personal portfolio | Kyle |
| `abstrekkt-tools` | n/a (CLI/library) or Vercel functions | Model-audit CLI, MCP server | Kyle |
| `abstrekkt-automation` | n8n (self-hosted, credentials live in n8n only) | Newsletter automation workflows | Kyle |

## Phase order

0. **Secret rotation** — `02-SECRET-ROTATION-RUNBOOK.md`. Blocking for everything downstream that touches a live deploy.
1. **Boundary docs** — this file + denylist + receipt template (this change).
2. **`abstrekkt-site` extraction** — `04-abstrekkt-site-RUNBOOK.md`. First, because it's already live; lowest risk, highest payoff.
3. **`abstrekkt-edge` extraction** — `05-abstrekkt-edge-RUNBOOK.md`.
4. **`abstrekkt-a2a` extraction** — `06-abstrekkt-a2a-RUNBOOK.md`.
5. **Loxihart handoff** — `07-LOXIHART-HANDOFF.md`, paperwork only; no code moves until that repo's owner accepts.
6. **Portfolio + tools + automation** — lowest priority, same `03-EXTRACTION-RUNBOOK.md` procedure applied to each.
7. **This repo's future** — after every Phase 2-6 target has a hash-verified receipt: resolve `Memoir`/`memoir` collision, consider archiving the nested self-copy, revisit media size. Each step gated on a receipt, per `REPOSITORY.md`'s migration invariant. Not scheduled here.

## Architecture choice: A / B / C

**A. One monorepo** (`abstrekkt-platform` with `apps/`, `workers/`, `packages/`). Simpler CI, but mixes the public static site with a token-bearing agent gateway in one blast radius and one dependency graph.

**B. Per-surface repos** (chosen). Each surface gets one owner, one deploy target, one secret scope. Public repos can actually be public without dragging private-lane material along. Costs: more repos to keep green, some duplicated CI boilerplate — acceptable for an operator managing this as a side project, since it keeps maintainability and security ahead of convenience per the stated priority order.

**C. Rewrite this repo's history and make it public.** Rejected. The repo's own `.gitignore` header forbids this outright; the `.git` directory is 579 MB; secrets exist in tracked history; the `Memoir`/`memoir` case collision would have to be resolved inside history; every existing SHA-bound receipt would become invalid.

## License

No `LICENSE` file exists anywhere at this repo's root. **Assuming**, absent a stated preference: all-rights-reserved with an explicit content notice for `abstrekkt-site` and `kylerosebrook-site` (personal/brand content); MIT for `abstrekkt-tools` (utility code with no sensitive content). Confirm before the first public push.

## Unresolved tension (not adjudicated here)

`.cursor/environment.json` treats `Unicorn-maybe/flashfusion-web` as the one real app in this repo's Cloud Agent dev environment (`.cursor/install.sh:4-12`). `repository-registry.yaml` routes current FlashFusion product surfaces to `Krosebrook/Loxihart`. This plan follows the registry (higher-precedence per `REPOSITORY.md:9-19`) and treats `flashfusion-web` as a Loxihart handoff, not an Abstrekkt extraction target. If that's wrong, say so before Phase 5.
