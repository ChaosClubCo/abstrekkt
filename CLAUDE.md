# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This repository is no longer governed as a standalone Claude Design handoff bundle.

Claude Code must use the repository-wide authority model before reading legacy project-specific guidance:

1. Read [`AGENTS.md`](AGENTS.md).
2. Read [`REPOSITORY.md`](REPOSITORY.md).
3. Resolve the requested path/domain through [`repository-registry.yaml`](repository-registry.yaml).
4. If and only if the work belongs to the legacy `project/` content/design corpus, then read [`project/CANON.md`](project/CANON.md) and the nearest project-scoped guidance.

## Critical boundary

- **Do not implement or evolve Loxihart runtime/product code in this repository.** `Krosebrook/Loxihart` is the operating/product owner.
- Existing `loxihart/` paths here are frozen historical/reference material pending verified migration and later archival cleanup.
- INT/Intinc is a separate operating lane and is not authorized by repository residence.
- Private memoir, clinical, family, or other sensitive source material does not become publishable because it exists in the tree.
- Generated, archived, vendored, and historical paths must retain their provenance and lifecycle status.

Legacy design-system and artifact-canonicality rules remain valid **inside their registered `project/` lanes**. They do not override repository-level ownership.

## Commands

Run from the repository root. These mirror the CI workflows in `.github/workflows/`.

| Check | Command |
|---|---|
| Repository authority invariants | `python scripts/repo_integrity.py --base <base-sha>` (CI uses the PR base SHA) |
| MCP config validity | `python -m json.tool .github/mcp.json` and `python -m json.tool tooling/mcp-clients/copilot/repository-mcp.json` |
| Production-trust conformance suite | `node --test governance/trust/tests/*.test.mjs` |
| One trust test | `node --test governance/trust/tests/<name>.test.mjs` |
| GitBook docs drift | `node scripts/verify-gitbook-docs.mjs` (without `GITBOOK_TOKEN`, the live GitBook comparison is skipped) |
| Launch-control status conformance | `node ops/launch-control/tests/status-conformance.mjs` (overwrites the committed CI evidence file `ops/launch-control/tests/conformance-report.json`; restore it with `git checkout` unless you mean to replace that evidence) |
| Webhook receiver tests | `cd tooling/webhook-receiver && npm test` |

Base44 dev app: `Unicorn-maybe/flashfusion-web/` (Next.js 16, React 19, frontend only) runs through `docker-compose.base44.yml` on port 3000. Verify with `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` (expect `200`). See the Base44 section of `AGENTS.md`.

`loxihart/pilot-console` has its own CI, but it is in the frozen Loxihart lane. Do not change it here.

## Architecture

- **Domains are routed, not inferred from paths.** `repository-registry.yaml` maps each path to a domain and status. `scripts/repo_integrity.py` enforces those invariants on every PR.
- **Release lane.** The public site deploys to Cloudflare Pages from an exact source SHA (`.github/workflows/abstrekkt-cloudflare-pages.yml`, helpers in `scripts/release/`). Do not replace it with a deploy from the latest `main`. `project/deploy/abstrekkt-com` is the release package, not the editing source. `project/deploy/README.md` lists the 4 studio canonical pages that it is generated from. `scripts/repo_integrity.py` fails any PR that changes a file under the package.
- **Production trust.** `governance/trust/` holds the receipt contracts, the conformance code, its tests, and the distribution-receipt emitter. `docs/PRODUCTION_TRUST_ARCHITECTURE.md` defines the maturity states. IMPLEMENTED, VERIFIED, DEPLOYED and CERTIFIED are separate states. Do not claim one from another.
- **Integration surfaces.** MCP client configs live in `.github/mcp.json` and `tooling/mcp-clients/`. Keep each client's own schema. Do not force one config format across Claude Code, Codex, Cursor and Copilot. Prefer read-only MCP tools, and add a write-capable tool only for a concrete workflow with a documented permission boundary. Outbound webhooks are HMAC-SHA256 signed (`.github/workflows/repository-webhooks.yml`, receiver in `tooling/webhook-receiver/`). Send only the minimum event metadata, not the full GitHub event payload. The receiver must verify the signature over the raw request body before it parses the payload.
- **Code limit.** Keep each code file under 400 lines (see `AGENTS.md`).
