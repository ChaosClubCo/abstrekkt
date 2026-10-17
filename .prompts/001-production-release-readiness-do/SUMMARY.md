# Production Release Readiness — SUMMARY

**NO-GO at 38%: two CRITICAL conditions (unrotated committed credentials; kr-mentor-proxy credential redirection, now fixed in source but deployment unknown) and eight HIGH conditions are open, including a red integrity gate on `main` and an ungoverned production deploy that dropped two security headers.**

## Key Findings

- CRITICAL: 108/108 credential ledger rows have no recorded rotation.
- CRITICAL: before this PR, kr-mentor-proxy sent injected upstream tokens to a host chosen by the caller (path `@host/…`). Reproduced, then fixed and tested in source.
- HIGH: `Repository integrity` is red on `main` because of 156 tracked `.next/dev` cache files. The same failure also blocks the governed deploy workflow.
- HIGH: `abstrekkt.pages.dev` serves HEAD with no receipt and no `X-Frame-Options` or `Permissions-Policy`.
- HIGH: the contact and newsletter forms silently discard what users submit.
- HIGH: an unreviewed `/.webmcp/bridge.js` is injected into every apex page.
- Fixed with tests: the release workflow no longer overwrites committed `_headers`; the webhook receiver handles non-object JSON.

## Files Created

- `docs/release/RELEASE_CHECKLIST.md`: canonical checklist with 25 requirement rows
- `docs/release/evidence/README.md`: evidence index
- `docs/release/evidence/validation-run.txt`: all local check commands and results
- `docs/release/evidence/live-observations-2026-10-09.md`: read-only production and CI observations
- `docs/release/evidence/live-headers-pages-dev-2026-10-09.txt`, `readback-abstrekkt-pages-dev-2026-10-09.json`, `apex-preflight-2026-10-09.json`: raw probe output
- `scripts/release/compose_headers.py`: `_headers` composition for the release workflow
- `project/proxy-deploy/test/index.test.mjs`: proxy routing and security tests
- `.prompts/001-production-release-readiness-do/production-release-readiness-report.md`: final report

## Decisions Needed

- Approve `git rm -r --cached Unicorn-maybe/flashfusion-web/.next/dev`, which affects the FlashFusion/Base44 lane.
- Choose a behavior for the contact and newsletter forms: wire a backend, use `mailto:`, or show "coming soon".
- Decide whether kr-mentor-proxy should exist in production at all. If it should, approve bumping the manifest `source_sha` pin to a SHA that contains the fix.
- Decide whether to keep or remove the zone-injected WebMCP bridge.

## Blockers

- Cloudflare account state (Pages deploy source, Workers, Snippets, D1) cannot be read in this session.
- GitHub branch protection cannot be read in this session.
- The permission classifier blocked untracking the `.next/dev` files.

## Next Step

Rotate the 108 credentials in `docs/decomposition/02-SECRET-ROTATION-RUNBOOK.md`, then confirm whether `kr-mentor-proxy` is deployed.

## Confidence

High for the repository and live-header findings, which were reproduced with commands. Medium for how production was deployed, which is inferred. Low for Cloudflare and GitHub admin state, which was unread.

## Iterations

1
