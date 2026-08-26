# Agent: QBR Report Generator Agent

## Purpose
Automatically compile and draft the Quarterly Business Review at the end of each quarter.

## Trigger
Manual trigger: end of quarter (or scheduled quarterly)

## Inputs
- Client name
- Quarter
- Sprint tracker data from Notion

## Steps
1. Notion: pull all deliverables marked complete for this client this quarter
2. Notion: pull outcome data (hours saved, skill packs deployed, team adoption)
3. Notion: pull any issues logged and their resolutions
4. Claude: Draft QBR using `20-qbr-summary-generator` prompt
5. Google Drive: create formatted QBR document
6. Notion: save draft with edit flags
7. Slack: "Q[N] QBR draft ready for [Company]"

## Output
- QBR Google Drive doc
- Notion draft
- Slack notification

## Human Gate
Kyle reviews, edits, and presents. Agent drafts — does not deliver.

## Platform
n8n + Notion MCP + Google Drive MCP + Claude API + Slack MCP
