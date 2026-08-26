# Agent: CRM Hygiene Agent

## Purpose
Keep the Notion pipeline clean — flag stale leads, missing data, and inactive stages.

## Trigger
Scheduled: Sunday 9pm CT

## Checks
1. Prospects in "Qualified" with no activity in 14 days → flag as stale
2. Prospects missing ICP score → flag for enrichment
3. Proposals sent >30 days ago with no response → flag for follow-up or disqualify
4. Closed deals missing case study start date → create reminder

## Steps
1. Notion: query pipeline for each condition above
2. Claude: Summarize findings
3. Slack notification: "Pipeline hygiene — [N] items need attention"
4. Optional: create Notion tasks for each flagged item

## Output
- Slack summary
- Notion tasks created for action items

## Platform
n8n + Notion MCP + Claude API + Slack MCP
