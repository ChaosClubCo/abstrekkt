# Agent: Competitive Intel Monitor Agent

## Purpose
Weekly monitoring of competitor activity — flag updates that require battle card changes.

## Trigger
Scheduled: Monday 7am CT

## Searches
- "Microsoft Copilot" + "new feature" OR "pricing" — last 7 days
- "ChatGPT Enterprise" + "announcement" — last 7 days
- "LangChain" + "release" OR "update" — last 7 days
- "AI governance" + "regulation" OR "compliance" — last 7 days

## Steps
1. Run all 4 searches
2. Claude: Assess each result — does this change how we position?
3. If yes: flag with reason, affected competitor, suggested battle card update
4. Slack notification: "Competitive intel — [N] items flagged"
5. Notion log entry

## Output
- Slack notification with flagged items
- Notion intelligence log

## Human Gate
Kyle decides whether to update battle cards. Agent flags — does not update.

## Platform
n8n + web search + Claude API + Slack MCP + Notion MCP
