# Canonical MCP Client Configurations v2

Schema-reviewed replacement bundle for Claude Code, Codex, and Cursor.

## Environment

```bash
export COMPOSIO_API_KEY='...'
export ZAPIER_MCP_URL='https://...'
```

## Claude Code

Copy `claude/.mcp.json` to your repository root as `.mcp.json`.
Install Impeccable with `./claude/install-impeccable.sh`.

## Codex

Codex does not currently document environment interpolation in an MCP `url`. Render the native project config with `cd codex && python3 render-config.py`. This writes `.codex/config.toml` for use in a trusted project.

Install Impeccable with `./codex/install-impeccable.sh`.

## Cursor

Copy `cursor/.cursor/mcp.json` to `.cursor/mcp.json` and run `./cursor/install-impeccable.sh`.

## Smoke checks

```bash
claude mcp list
codex mcp list
```

For Cursor, open Customize → MCP or Output → MCP Logs.

Verify Impeccable after installation:
- Claude Code: `.claude/skills/impeccable/`
- Codex: `.agents/skills/impeccable/`
- Cursor: `.cursor/skills/impeccable/`
