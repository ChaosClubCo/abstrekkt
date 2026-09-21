# Agent: Social Monitoring Agent

## Purpose
Monitor for mentions of FlashFusion, kylerosebrook, or relevant AI topics on LinkedIn and X.

## Trigger
Scheduled: Daily, 8am CT

## Searches
- "FlashFusion" on LinkedIn and X
- "Kyle Rosebrook" mentions
- "AI setup audit" mentions
- "Claude AI enablement" — relevant conversations to engage

## Steps
1. Web search each query
2. Claude: Assess relevance and sentiment
3. Flag items that warrant a response or engagement
4. Slack: "Social monitoring — [N] items flagged"
5. Log in Notion

## Output
- Slack notification with flagged items
- Notion log

## Human Gate
Kyle decides whether and how to engage. Agent flags only.

## Platform
n8n + web search + Claude API + Slack MCP + Notion MCP
