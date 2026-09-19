# Configuration Schema Review — 2026-08-20

## Result

Claude Code and Cursor MCP files were structurally compatible with their current documented schemas. The material defect was Codex: `${ZAPIER_MCP_URL}` was placed directly in `mcp_servers.zapier.url`, but the current Codex docs only document environment-backed bearer tokens and HTTP headers, not URL interpolation.

The old `agent-skills.json` and `agent-skills.toml` files were informational sidecars, not native skill registration. They are replaced by deterministic provider-specific Impeccable install scripts and `integration-metadata.json`.

## Corrections

### Claude Code
- Keeps project `.mcp.json`.
- Keeps explicit `"type": "http"` for every remote server.
- Keeps `${ZAPIER_MCP_URL}` and `${COMPOSIO_API_KEY}` interpolation.
- Uses `npx impeccable install --providers=claude --scope=project`.

### Codex
- Uses `config.toml.template` + `render-config.py` so Zapier's secret URL is materialized from `ZAPIER_MCP_URL` before Codex reads the config.
- Uses native `env_http_headers` for `COMPOSIO_API_KEY`.
- Explicitly declares `auth = "oauth"` for Make and Manufact.
- Uses `npx impeccable install --providers=codex --scope=project`.
- Project-scoped `.codex/config.toml` requires a trusted project.

### Cursor
- Keeps `.cursor/mcp.json`.
- Keeps `${env:ZAPIER_MCP_URL}` and `${env:COMPOSIO_API_KEY}` interpolation.
- Uses `npx impeccable install --providers=cursor --scope=project`.

## Version-specific notes
- Current Claude Code requires `type` on URL-based remote entries.
- Cursor now natively discovers Agent Skills from `.cursor/skills/` and `.agents/skills/`.
- Codex supports project `.codex/config.toml` only for trusted projects.
- Impeccable's current installer supports deterministic `--providers` and `--scope` flags.

## Security
- `ZAPIER_MCP_URL` is secret material.
- `COMPOSIO_API_KEY` is never embedded.
- Make and Manufact OAuth credentials remain client-managed.
- The Codex renderer enforces HTTPS, validates the URL, escapes TOML, syntax checks the result, and writes atomically.
