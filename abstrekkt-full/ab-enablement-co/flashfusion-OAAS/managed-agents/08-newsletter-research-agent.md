# Agent: Newsletter Research Agent

## Purpose
Weekly research run for The Prompt newsletter — surface relevant AI signals for Kyle's review.

## Trigger
Scheduled: Monday 8am CT

## Steps
1. Web search: "AI governance news this week"
2. Web search: "Claude Anthropic announcement this week"
3. Web search: "enterprise AI deployment news this week"
4. Web search: "AI compliance regulation update"
5. Claude: Synthesize top 5 signals with 1-sentence implications each
6. Write to Notion: "The Prompt — Week of [DATE] — Research"
7. Slack notification: "Newsletter research ready — [N] signals found"

## Output
- Notion research brief
- 5 curated signals with implications
- Slack notification

## Human Gate
Kyle selects which signals to use. Agent researches — does not write the newsletter.

## Platform
n8n + web search + Claude API + Notion MCP + Slack MCP
