# Agent: Sprint Status Agent

## Purpose
Automatically generate weekly sprint status updates for active client engagements.

## Trigger
Scheduled: Thursday 3pm CT (for Friday delivery)

## Steps
1. Notion: pull active sprint tracker for each client
2. Identify completed tasks, in-progress, blocked
3. Claude: Draft weekly status update using `19-stakeholder-update` prompt
4. Save draft to Notion (client folder)
5. Slack notification: "Status update drafts ready — [N] clients"

## Output
- Status update drafts in Notion
- Slack notification for Kyle to review and send

## Human Gate
Kyle reviews and sends. Agent drafts only.

## Platform
n8n + Notion MCP + Claude API + Slack MCP
