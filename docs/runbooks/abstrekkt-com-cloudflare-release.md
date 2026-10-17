# Runbook: abstrekkt.com release to Cloudflare Pages

Authority domain: `abstrekkt_publication` (`repository-registry.yaml`). Source revision: written against `ChaosClubCo/abstrekkt @ 7eaf8378` (branch `claude/charming-darwin-39g5to`), 2026-09-23.
Claim states follow `docs/DOCUMENTATION_STANDARDS.md`.

## Status: deploy-ready pipeline, production apex BLOCKED

The release pipeline is ready. **Production is not**: as of 2026-09-23 22:30Z, `abstrekkt.com` does not serve the Pages project, so a Pages deploy alone cannot change what the domain shows. The release workflow's pre-flight stops for exactly this reason.

| Evidence (observed 2026-09-23, read-only) | Result |
| --- | --- |
| `abstrekkt.pages.dev`, all package files, byte-compared | PASS, identical to `project/deploy/abstrekkt-com` at HEAD, and to the certified 2026-08-26 receipt's blobs |
| `abstrekkt.com` via curl, from a datacenter IP and from Cloudflare Browser Rendering | `403`, `cf-mitigated: challenge` (managed challenge, zone `abstrekkt.com`) |
| `abstrekkt.com` via Python `urllib` (not challenged) | `404` Cloudflare-branded "Not Found" for `/`, `/founder/`, `/abstrekkt/nav-toggle.js`; only `/.webmcp/bridge.js` returns `200` |
| `/.webmcp/bridge.js` script tag | Injected into every apex HTML response, including the challenge page, so it comes from a zone-level layer, not the Pages origin |
| `kyle.abstrekkt.com` | Same challenge; `404` with an empty body when not challenged |

What is claiming the apex is **UNKNOWN**. Candidates, in order of likelihood:
1. A Workers Custom Domain or zone route bound to `abstrekkt.com`. The `abstrekkt` Worker's code endpoint returns no script body, which is consistent with an assets-only Worker, but its bindings could not be read with the available connector.
2. A zone feature or Snippet that rewrites responses.
3. A deactivated Pages custom domain.

`*.abstrekkt.com/*` (the `abstrekkt` Worker's recorded route) does **not** match the apex. The Worker's 2026-08-27 19:29Z modification corresponds to the certified receipt's own "Disconnect Git" action, not to a route change.

**To resolve:** add the read-only `CLOUDFLARE_ZONE_READ_TOKEN` secret (scopes are listed in `.github/workflows/abstrekkt-zone-diagnose.yml`) and run **Abstrekkt Zone Diagnose (read-only)** from `main`. Its `apexClaims` and `challengeSources` name the owning resource and the challenge source. Any zone change it points to (a custom domain, route, WAF rule or Bot Fight Mode setting) is a separate, explicitly approved production change with before/after capture.

## Prerequisites

- A GitHub environment `production` that allows deployments from `main` only, holding `CLOUDFLARE_API_TOKEN` (Pages edit, this account only) and `CLOUDFLARE_ACCOUNT_ID`. Until the secrets are moved there, the workflow still reads the repo-level secrets, and the protection exists only as the `if: github.ref == 'refs/heads/main'` guard.
- Credential rotation per `docs/decomposition/02-SECRET-ROTATION-RUNBOOK.md`. It is not a technical prerequisite for this workflow, but it remains the gate for any extraction deploy.

## Release procedure

1. Merge the change to `main`. The candidate must be an ancestor of `origin/main` and a lowercase 40-character SHA.
2. Actions → **Abstrekkt Cloudflare Pages Release** → run from `main` with `candidate_sha=<main commit>`. Leave `accept_challenged_apex` off unless you accept an uncertified release.
3. The workflow then:
   - re-runs the repository authority checks on the candidate using trusted tooling;
   - generates `sitemap.xml`, `robots.txt` and `_headers` (including `X-Abstrekkt-Release: <sha>`) in the workspace only;
   - gates the exact upload directory;
   - runs the pre-flight apex probe;
   - deploys with Wrangler 4.137.0;
   - byte-compares the immutable deployment URL;
   - verifies the apex by release header plus non-HTML bytes;
   - writes the receipt.
4. Download the `abstrekkt-release-<sha>` artifact. Commit the receipt under `evidence/releases/abstrekkt/` and update `repository-registry.yaml` `deployment.abstrekkt_com.receipt` / `live_sha` in a PR. Keep the literal `status: UNKNOWN` line, which `scripts/repo_integrity.py` requires.

The workflow fails unless the receipt derives `CERTIFIED`. `DEPLOYED_UNVERIFIED` means the Pages deployment exists but the apex did not prove it is serving it.

## Rollback

Cloudflare dashboard → Workers & Pages → `abstrekkt` → Deployments → roll back to the previous production deployment (the certified one is `ee78ba2a-7f8f-49c4-9dbd-fddc20ca57a8`). You can also run `wrangler pages deployment list --project-name=abstrekkt`, then roll back from the dashboard.

Re-running the workflow on an older SHA is **not** a rollback path: commits from before `7eaf8378` (including `c93aa703`) still track `project/uploads/Backup-codes-*` and so fail the tracked-credential guard in the authority check. A Pages rollback only affects the apex once the apex actually routes to Pages (see Status).

## CLAIMS / GAPS

- [OBSERVED] All probe results above were taken from one container IP and Cloudflare Browser Rendering on 2026-09-23. A human browser that passes the managed challenge was not tested; it may see something different.
- [INFERRED] The zone-level layer and candidate list above. The diagnose workflow is the verification step.
- ! `repository-registry.yaml` records `evidence_status: DEPLOYED` for `abstrekkt_com`. That was true at the 2026-08-27 read-back but is not consistent with the 2026-09-23 apex observation. It is left unchanged here and escalated for correction after the diagnosis.
