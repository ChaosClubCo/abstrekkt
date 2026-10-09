# Production release readiness report — abstrekkt.com

Authority domain: `abstrekkt_publication`. Base: `main` @ `d981a1d9c882640b60cb64003def0b14f897328f`. Assessed 2026-10-09 (UTC).
Canonical checklist: `docs/release/RELEASE_CHECKLIST.md`. Evidence: `docs/release/evidence/`.

## Executive Summary

The system is not safe to release. Two CRITICAL conditions are open. First, 108 credential names that were once committed have no recorded rotation. Second, the kr-mentor-proxy source could forward its injected upstream tokens to any host a caller chose; that is fixed in source here, but whether it is deployed is unknown. Eight HIGH conditions are also open, among them a red mandatory CI gate on `main` and a production deployment that bypassed the governed release pipeline and lost two security headers. This PR fixes the repository-side defects that could be fixed safely, with tests.

## Release Verdict

**NO-GO.** Under the severity policy, any open CRITICAL condition forces NO-GO.

## Release Score

**38%.** Each domain has a weight; points are awarded only for evidence-backed PASS.

| Domain | Weight | Points | Basis |
| --- | --- | --- | --- |
| Code/build | 10 | 8 | Package gate PASS; generated-package edits on `main` violate its own rule |
| Tests | 10 | 7 | 28 unit tests pass; no E2E/smoke on a schedule |
| Security | 20 | 4 | 2 CRITICAL open; 3 fixes landed |
| Data safety/privacy | 5 | 4 | Static site, no PII collected |
| Infrastructure/deployment | 15 | 3 | Ungoverned production deploy, no receipt |
| CI/branch protection | 10 | 2 | Integrity red; protection unreadable |
| Observability | 10 | 1 | No alerting found |
| Rollback | 10 | 3 | Documented, never exercised |
| Backup/recovery | 5 | 3 | Site reproducible from git; D1 unverified |
| Operations/docs | 5 | 3 | Runbook exists; no escalation path |

## Blockers Closed (with evidence)

1. **Release workflow overwrote committed `_headers`.** The homepage `Link` header would have been dropped on every governed deploy. Fixed by `scripts/release/compose_headers.py`, which also fails closed on any conflict with a managed header. Evidence: 4 new tests, 14/14 passing, and a simulated run on the real package followed by a `verify_static_package` PASS (`validation-run.txt`).
2. **kr-mentor-proxy credential redirection.** Source fix in `project/proxy-deploy/src/index.js`. Reproduced before the fix: host `evil.example` received `Bearer <NOTION_TOKEN>`. After the fix: 400 and no fetch (`live-observations-2026-10-09.md` O4). 4/4 tests now run in Abstrekkt CI. The deployed instance is still open (R-SEC-02).
3. **Webhook receiver threw on signed non-object JSON.** It now returns 400. The test failed before the fix (9/10) and passes after (10/10).

## Open Blockers (with severity)

| ID | Severity | Blocker |
| --- | --- | --- |
| R-SEC-01 | CRITICAL | 108/108 credential ledger rows unrotated (`02-SECRET-ROTATION-RUNBOOK.md`) |
| R-SEC-02 | CRITICAL | Deployed kr-mentor-proxy state unknown; if it is live from pinned `093ee155`, it has the redirection flaw |
| R-CI-01 | HIGH | `Repository integrity` red on `main` (156 tracked `.next/dev` files). It also blocks the deploy workflow, which reruns the check on the candidate |
| R-DEP-01 | HIGH | Production deployed outside the governed workflow; no receipt or provenance header |
| R-DEP-02 | HIGH | Production lacks `X-Frame-Options: DENY` and `Permissions-Policy` that the certified release had |
| R-JRN-01 | HIGH | Contact form and newsletter discard what users submit (`preventDefault`, no endpoint) while promising "Read personally by Kyle" |
| R-SEC-03 | HIGH | Unreviewed zone-injected `/.webmcp/bridge.js` runs on every apex page |
| R-CI-02 | HIGH | Branch protection unverified; direct pushes to `main` appear possible [INFERRED] |
| R-OBS-01 | HIGH | No uptime/alerting with tested delivery |
| R-ROLL-01 | HIGH | Rollback never exercised |
| R-JRN-02 | MEDIUM | Nav link to `Tax the Damage.html` returns 404 in production |
| R-SEC-05 | MEDIUM | Proxy: CORS `*`, non-constant-time token compare, open `url` passthrough |

## Code Readiness

Static package gate PASS: 9 files, no disallowed types, no secret-shaped content. There are 3 documented sibling-property 404 warnings. Commits `cf9e6707`, `bf41b2c7` and `03d455b4` edited the GENERATED package directly, which contradicts `project/CANON.md` and `repo_integrity.check_frozen_paths`. ! That contradiction is preserved here, not resolved.

## Security Readiness

Fixed: the proxy origin escape and the webhook crash. Open: credential rotation (CRITICAL), proxy deployment state (CRITICAL), regressed production headers, the unreviewed injected script, and proxy hardening. The webhook receiver's HMAC handling was reviewed: it verifies before parsing, uses `crypto.subtle.verify` (constant-time), D1 `INSERT OR IGNORE` handles replay, and it fails closed with 503 when bindings are missing. No dependency scan applies: the site has no deps and the Workers have no runtime deps. That is not a full security audit.

## Infrastructure Readiness

Live read-only checks show `abstrekkt.pages.dev` serving the HEAD package bytes with a header set the governed workflow cannot produce. The apex is reachable with the verifier User-Agent but returns a challenge to `curl` from a datacenter IP. The apex adds zone-level `X-Frame-Options: SAMEORIGIN` and `Referrer-Policy: same-origin`, and injects two scripts. Cloudflare account configuration (Pages Git integration, Workers routes, Snippets) was not readable in this session.

## Operational Readiness

The release and rollback runbook exists (`docs/runbooks/abstrekkt-com-cloudflare-release.md`). There is no incident-response or escalation document. No owner other than the repo owner is identified.

## Database Readiness

N/A for the site. The webhook receiver uses one D1 table (`schema.sql`); the live schema is unverified. No migrations are pending in the repo.

## Test Evidence

| Layer | Command | Total | Pass | Fail | Skip |
| --- | --- | --- | --- | --- | --- |
| Release tooling unit | `python3 scripts/release/test_release_scripts.py` | 14 | 14 | 0 | 0 |
| Package gate | `python3 scripts/release/verify_static_package.py project/deploy/abstrekkt-com` | 1 | PASS | 0 | — |
| Webhook unit/security | `cd tooling/webhook-receiver && npm test` | 10 | 10 | 0 | 0 |
| Proxy unit/security | `cd project/proxy-deploy && node --test test/index.test.mjs` | 4 | 4 | 0 | 0 |
| Proxy build | `npx wrangler@4.126.0 deploy --dry-run` | 1 | exit 0 | — | — |
| Repo integrity | `python3 scripts/repo_integrity.py --base HEAD` | 1 | — | FAIL (156, pre-existing) | — |
| Production smoke | `pages_probe.py readback` on `abstrekkt.pages.dev` | 1 | — | FAIL (2 header checks) | — |
| E2E / browser | none exists | — | — | — | — |

Coverage was not measured; no coverage tooling exists. Durations were sub-second for the unit suites.

## Deployment Evidence

The last CERTIFIED receipt is for `e1d3355f` (2026-08-27). The current production deployment has no receipt and serves HEAD `d981a1d9` package bytes (O1). The governed workflow is `workflow_dispatch`-only and cannot currently pass, because its repo-integrity step fails (R-CI-01).

## Rollback Readiness

Rollback is documented as a Pages dashboard rollback to `ee78ba2a-7f8f-49c4-9dbd-fddc20ca57a8`. It has not been exercised. Per the runbook, re-running the workflow on an older SHA is not a rollback path.

## Backup / Recovery Readiness

The site is reproducible from git. D1 holds only replay IDs. PROPOSED targets: RPO 24h and RTO 4h via D1 Time Travel. Retention is unverified.

## Observability Readiness

| Alert | Trigger | Destination | Synthetic Test | Delivery Verified | Status |
| --- | --- | --- | --- | --- | --- |
| Site uptime / header regression | none configured in repo | — | — | — | NEV / missing |
| Receiver signature/replay rejections | `console.warn` structured logs | Workers logs only | unit tests | no | NEV |
| kr-mentor-proxy traces | `[observability.traces]` | Workers observability | — | BLOCKED (frozen evidence) | FAIL |

## External Verification Required

1. **Repo owner, at each provider console:** rotate the 108 credentials and fill the ledger with names and timestamps only.
2. **Cloudflare admin:** run `wrangler deployments list --name kr-mentor-proxy` or check the dashboard. If the Worker exists, rotate `PROXY_TOKEN` and the upstream tokens, then redeploy from a reviewed SHA that contains this fix.
3. **Cloudflare admin:** in Pages → `abstrekkt` → Settings → Builds, check whether Git integration or auto-deploy is enabled. List deployments with `wrangler pages deployment list --project-name=abstrekkt` and identify how the newest one was created.
4. **Cloudflare admin:** in the zone `abstrekkt.com`, check Snippets, Workers routes and Rules for the `/.webmcp/bridge.js` injection.
5. **GitHub admin:** read `main` branch protection and the `production` environment rules, and compare them with the check names in R-CI-02.
6. **Repo owner:** approve untracking `Unicorn-maybe/flashfusion-web/.next/dev`.

## Files Changed

- `.github/workflows/abstrekkt-cloudflare-pages.yml`: `_headers` composition via a script
- `.github/workflows/abstrekkt-ci.yml`: runs the proxy unit tests
- `scripts/release/compose_headers.py` (new) and `scripts/release/test_release_scripts.py` (+4 tests)
- `project/proxy-deploy/src/index.js`, `package.json`, `test/index.test.mjs` (new)
- `tooling/webhook-receiver/worker.mjs`, `worker.test.mjs`
- `docs/release/RELEASE_CHECKLIST.md`, `docs/release/evidence/*` (new)
- `.prompts/001-production-release-readiness-do/*` (this report, SUMMARY)

## Branch

`claude/confident-sagan-5vzoe1`. The prompt asked for `chore/production-release-readiness`, but this session is bound to the designated branch, so I used that.

## Final Commit SHA

The fixes and evidence are in `70c38c23`. This report and SUMMARY are in the next commit on the same branch; the PR head shows the final SHA.

## Pull Request number and URL

[ChaosClubCo/abstrekkt#133](https://github.com/ChaosClubCo/abstrekkt/pull/133), a draft that has not been merged.

## Recommended Next Actions

1. Rotate the credentials (R-SEC-01).
2. Resolve whether kr-mentor-proxy is deployed, and rotate and redeploy it if so (R-SEC-02).
3. Untrack `.next/dev` (R-CI-01), then merge #133.
4. Find and disable the ungoverned Pages deploy path (R-DEP-01).
5. Dispatch the governed release on an exact `main` SHA and commit the CERTIFIED receipt (R-DEP-01/02).
6. Decide what the contact and newsletter forms should do (R-JRN-01).
7. Identify who owns `bridge.js` (R-SEC-03).
8. Verify branch protection (R-CI-02).
9. Add uptime alerting with a tested notification (R-OBS-01).
10. Rehearse a rollback (R-ROLL-01).

## CLAIMS CHECK

| Claim | Status |
| --- | --- |
| `main` integrity gate fails only due to `.next/dev` tracked files | VERIFIED (CI API + local run) |
| Production Pages alias lacks XFO/Permissions-Policy/release header | VERIFIED (live headers + repo probe) |
| That deployment did not come from the governed workflow | INFERRED (header set and robots bytes the workflow cannot emit) |
| Apex serves the same deployment | SUPPORTED (`Link` header and identical non-HTML bytes; HTML differs only by zone injection) |
| Proxy redirected injected token to arbitrary host before the fix | VERIFIED (local reproduction against `main` source) |
| Proxy is deployed in production | UNVERIFIED |
| Credentials remain unrotated | SUPPORTED (ledger empty; actual provider state UNVERIFIED) |
| Contact/newsletter forms discard what users submit | VERIFIED (source); not exercised in a browser |
| Branch protection permits direct pushes | INFERRED |
| `bridge.js` origin | UNVERIFIED |

## GAPS

- No Cloudflare API access, so Pages, Workers, Snippets, D1 and DNS configuration are unread.
- Branch protection settings are unread.
- No browser or E2E run, so client-side runtime errors and accessibility are unmeasured.
- Live checks came from one datacenter IP; apex challenge behavior for real users is unknown.
- Whether the `webhook-receiver` Worker is deployed is unknown.
- `Krosebrook/Loxihart` and the FlashFusion lane were not assessed (out of scope by governance).
