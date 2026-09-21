# Agent: Document Archive Agent

## Purpose
Automatically organize and archive completed engagement documents to the correct Google Drive folders.

## Trigger
Sprint or engagement marked "complete" in Notion

## Steps
1. Identify all documents associated with the engagement
2. Google Drive: move to archived engagement folder ([Year] > [Client] > [Engagement Type])
3. Notion: update engagement record with "archived" status and Drive folder link
4. Slack: "Engagement archived — [Company]. Drive folder: [link]"

## Output
- Documents in correct archive folder
- Notion record updated
- Slack confirmation

## Human Gate
Agent archives. Kyle can restore or reclassify if needed.

## Platform
n8n + Google Drive MCP + Notion MCP + Slack MCP
