# Canonical MCP Client Configurations v2

Schema-reviewed replacement bundle for Claude Code, Codex, Cursor, and GitHub Copilot.

## Environment

```bash
export COMPOSIO_API_KEY='...'
export ZAPIER_MCP_URL='https://...'
```

## GitHub Copilot

Two GitHub Copilot MCP surfaces are intentionally kept distinct:

- `.github/mcp.json` is the repository/workspace MCP file used by Copilot CLI in a trusted checkout.
- `tooling/mcp-clients/copilot/repository-mcp.json` is the canonical JSON payload for GitHub.com repository settings under **Settings → Copilot → MCP servers**, which is shared by Copilot cloud agent and Copilot code review.

GitHub already provides a built-in read-only GitHub MCP server scoped to the current repository, so neither config duplicates it. The explicit repository MCP addition is the public Cloudflare documentation MCP endpoint used for Cloudflare Pages/platform guidance.

Do not add write-capable external MCP tools to the shared GitHub.com repository configuration without a documented need, explicit permission boundary, and security review. Copilot Agents secrets/variables referenced by repository MCP configuration must use the `COPILOT_MCP_` prefix; never commit their values.

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
python -m json.tool .github/mcp.json >/dev/null
python -m json.tool tooling/mcp-clients/copilot/repository-mcp.json >/dev/null
```

For Cursor, open Customize → MCP or Output → MCP Logs.

For GitHub.com Copilot cloud agent/code review, save `tooling/mcp-clients/copilot/repository-mcp.json` in repository MCP settings, then inspect an agent/review session's **Start MCP Servers** logs and confirm only the intended tools are available.

Verify Impeccable after installation:
- Claude Code: `.claude/skills/impeccable/`
- Codex: `.agents/skills/impeccable/`
- Cursor: `.cursor/skills/impeccable/`
