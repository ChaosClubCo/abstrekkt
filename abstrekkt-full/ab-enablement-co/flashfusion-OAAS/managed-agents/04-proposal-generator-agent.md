# Agent: Proposal Generator Agent

## Purpose
Generate a formatted proposal draft after a discovery call is marked complete.

## Trigger
Discovery call status updated to "complete" in pipeline (Notion/Airtable)

## Inputs
- Discovery call notes (from Notion)
- Prospect record (company, contact, ICP score)
- Recommended service (from scorecard or manual selection)

## Steps
1. Trigger fires when discovery call status = "complete"
2. Pull discovery notes and prospect data from Notion
3. Claude: Draft proposal using `03-proposal-drafter` prompt
4. Create Google Drive doc: formatted proposal with FF branding
5. Create Notion page: proposal draft with edit notes
6. Slack notification: "Proposal ready for [Company] — review before sending"
7. Update pipeline stage: "Proposal in review"

## Output
- Google Drive proposal doc
- Notion draft with edit notes
- Pipeline stage updated
- Slack notification

## Human Gate
Kyle reviews and approves before proposal is sent. Agent drafts — not delivers.

## Guardrails
- Never send proposal directly to prospect
- Flag if discovery notes are insufficient for a complete proposal

## Platform
n8n + Claude API + Notion MCP + Google Drive MCP + Slack MCP
