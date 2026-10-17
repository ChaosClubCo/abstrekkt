# ADR 0001: abstrekkt.com edge and release governance

- Status: Proposed
- Date: 2026-10-09
- Owner: @Krosebrook
- Supersedes: none

## Context

abstrekkt.com is served by the Cloudflare Pages project `abstrekkt`. The release path already exists as a manual workflow (`abstrekkt-cloudflare-pages.yml`): an exact commit SHA that is an ancestor of `main`, the `production` environment, a pinned wrangler version, an apex probe, and a signed receipt. A rollback procedure is documented in `docs/runbooks/abstrekkt-com-cloudflare-release.md`.

Three gaps remain between that control plane and the intended edge state:

1. `www.abstrekkt.com` is not a Pages custom domain. It points at a legacy Pages project.
2. Pages preview deployments (`*.abstrekkt.pages.dev`) are not known to sit behind an access control.
3. `main` is protected by repository ruleset 24652346 (no deletion, no non-fast-forward, Copilot code review), but the ruleset has no pull request rule and no required status checks. A direct commit to `main` is therefore allowed.

## Decision

1. The apex `abstrekkt.com` is the canonical hostname and is served by the `abstrekkt` Pages project.
2. `www.abstrekkt.com` returns a 301 redirect to the apex, implemented as a Cloudflare Redirect Rule. The redirect preserves path and query string.
3. Preview deployments are placed behind Cloudflare Access with an allow-list limited to the project owner. The allow-list entry lives in Cloudflare Access, not in this repository.
4. `main` requires a pull request before merge. Required approvals start at 0 because the repository has a single collaborator who cannot approve their own pull request. Required status checks are taken from the check names that real pull requests report (for example the CI and Repository Integrity workflows) and are added once those names are confirmed.
5. Rollback is performed in the Cloudflare dashboard (Workers & Pages, abstrekkt, Deployments) by promoting a previously certified deployment. Re-running the release workflow for an older SHA is not a rollback path.
6. Changes to workflows, the deploy directory, runbooks, governance records and release scripts are owned through `.github/CODEOWNERS`.

## Constraints

- Existing DNS records are not modified or removed: loxihart records, MX, SPF, DKIM, DMARC, and `_acme-challenge` records stay as they are.
- Edge changes to `www` and to the `kyle` subdomain are made only after their current content has been read and the owner has approved the specific change.

## Consequences

- Visitors see one canonical hostname, which removes duplicate-content ambiguity between `www` and the apex.
- Previews stop being publicly reachable.
- Every change to `main` leaves a pull request record.
- With 0 required approvals, the pull request rule gives traceability and a CI gate, not independent review. This is accepted until a second collaborator exists.

## Open items

- Confirm whether the Pages project is Direct Upload or Git-connected, since that decides whether Pages reports a status check on pull requests.
- Confirm ruleset enforcement mode and bypass actors for ruleset 24652346.
- Choose an uptime monitoring and alerting channel.
- Replace the apex BLOCKED status in the release runbook once the live state has been read.
