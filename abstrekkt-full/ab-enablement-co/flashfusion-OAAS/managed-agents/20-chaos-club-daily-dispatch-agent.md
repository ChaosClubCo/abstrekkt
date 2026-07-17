# Agent: Chaos Club Daily Dispatch Agent

## Purpose
Generate and stage the daily peer support dispatch for Chaos Club Co.

## Trigger
Scheduled: 7am CT daily

## Inputs
- Day of week
- Theme rotation (7 themes, cycling weekly)
- Any community signals from Chaos Club platform (if available)

## Steps
1. Determine today's theme from rotation
2. Community signal check (optional — pull recent posts if API available)
3. Claude: Generate dispatch using Chaos Club voice prompt (no recovery language, no toxic positivity)
4. Stage in Chaos Club CMS / Notion for review
5. Slack: "Chaos Club dispatch ready for [DATE] — Theme: [THEME]"

## Output
- Dispatch draft in Notion/CMS
- Slack notification

## Human Gate
Kyle or Chaos Club admin reviews before publishing. Agent drafts — does not publish.

## Guardrails
- No recovery language, no "you've got this" clichés
- No clinical advice or crisis intervention framing
- Lane separation: Chaos Club content never bleeds into FlashFusion or kylerosebrook.com

## Platform
n8n + Claude API + Notion MCP + Slack MCP
