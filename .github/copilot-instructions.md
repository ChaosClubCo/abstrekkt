# Abstrekkt Copilot repository instructions

## Repository authority

This repository is the canonical home for Abstrekkt publishing/public-site source, approved editorial artifacts, portfolio/press evidence, repository governance, and historical provenance. Repository residence does not make an artifact current, public, production-ready, or owned by Abstrekkt.

Before making changes:

1. Read `AGENTS.md`, `REPOSITORY.md`, and `repository-registry.yaml`.
2. Bind the task to the exact current branch and commit SHA.
3. Resolve the requested path to its authority domain before editing.
4. If work is under `project/`, read `project/CANON.md` and the nearest scoped guidance.
5. Preserve contradictions instead of silently choosing whichever file looks newest or most polished.

## Hard boundaries

- Do not add, edit, or delete runtime/product files under `loxihart/`. Canonical Loxihart product/runtime ownership is `Krosebrook/Loxihart`.
- INT/Intinc material is excluded from Abstrekkt authority.
- Private memoir, clinical, family, custody, or similar restricted source is not public by default.
- Vendored/imported code is noncanonical unless an explicit authority decision promotes it.
- Never commit credentials, bearer tokens, API keys, private keys, service-account material, OAuth tokens, signed secret URLs, or webhook secrets.

## Engineering rules

- Keep every code file below 400 LOC. Refactor before crossing the limit without dropping behavior.
- Prefer small, authority-scoped changes and dedicated branches/PRs for non-trivial work.
- Treat generated deployment packages as outputs. Resolve and edit the canonical source unless a documented regeneration step owns the output.
- Prefer deterministic, machine-readable verification over prose-only completion claims.
- Preserve source revision/hash metadata for migrations, deployment receipts, and provenance-sensitive changes.

## CI/CD and Cloudflare

- Repository integrity is enforced by `.github/workflows/repo-integrity.yml` and `scripts/repo_integrity.py`.
- Abstrekkt public-site deployment is an exact-SHA Cloudflare Pages release lane. Do not replace exact-SHA deployment with an implicit deploy-from-latest-main shortcut.
- The current deployment package is `project/deploy/abstrekkt-com`; do not assume that package is the canonical editing source.
- A production claim requires an exact-SHA deployment receipt and read-back evidence as defined in `REPOSITORY.md`.
- Keep deployment credentials in GitHub secrets or provider-managed secret stores. Never echo secret values into logs or summaries.

## MCP and agent safety

- `.github/mcp.json` is the trusted-checkout Copilot CLI/workspace MCP surface.
- `tooling/mcp-clients/copilot/repository-mcp.json` is the canonical JSON payload for GitHub.com repository MCP settings used by Copilot cloud agent and code review.
- Prefer read-only MCP capabilities for autonomous review and planning. Add write-capable external tools only when a concrete workflow requires them and the permission boundary is documented.
- Existing local-client MCP bundles live under `tooling/mcp-clients/`; preserve client-specific schemas rather than forcing one config format across Claude Code, Codex, Cursor, and Copilot.
- Do not duplicate GitHub's built-in read-only repository MCP server without a specific cross-repository requirement.

## Webhooks

- Outbound repository automation uses `.github/workflows/repository-webhooks.yml`.
- Send only the minimum event metadata needed downstream. Do not forward the full GitHub event payload by default.
- Sign outbound payloads with HMAC-SHA256 and require the receiver to verify the raw request body before parsing.
- Treat webhook URLs and signing secrets as credentials.

## Verification before completion

For any meaningful change:

1. Inspect the final diff for authority-boundary violations.
2. Run repository integrity checks.
3. Validate changed JSON/config files and relevant static-release files.
4. Confirm no secret material was introduced.
5. Read back changed remote files after mutation.
6. Report exact commit SHA and unresolved blockers. Never claim deployment, security, publication, or production state without evidence specific to that claim.
