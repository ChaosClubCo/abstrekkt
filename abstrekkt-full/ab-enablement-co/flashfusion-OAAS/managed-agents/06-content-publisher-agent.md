# Agent: Content Publisher Agent

## Purpose
Draft, format, and stage content for publishing to LinkedIn, kylerosebrook.com, and FlashFusion newsletter.

## Trigger
Manual trigger: Kyle provides a topic or insight

## Inputs
- Topic or insight (raw)
- Target platform (LinkedIn / Blog / Newsletter)
- Angle preference (optional)

## Steps
1. Claude: Generate content using `generating-social-posts` or `14-linkedin-content-generator` prompt
2. Produce 3 hook variants
3. Format for platform (LinkedIn: plain text; Blog: markdown; Newsletter: HTML-ready)
4. Save to Notion draft queue with platform tag
5. Slack notification: "Content draft ready — [Platform]: [Hook preview]"

## Output
- 3 formatted content variants in Notion
- Tagged by platform and status (Draft / Ready / Published)
- Slack notification

## Human Gate
All content requires Kyle review before publishing. Agent drafts — does not publish.

## Guardrails
- Never publish directly — draft only
- Content integrity rule: never claim anything Kyle doesn't actually do today
- Lane separation: never conflate FlashFusion, kylerosebrook.com, ChaosClub content

## Platform
n8n + Claude API + Notion MCP
