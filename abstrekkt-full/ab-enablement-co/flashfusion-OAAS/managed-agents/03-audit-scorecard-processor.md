# Agent: Audit Scorecard Processor

## Purpose
When a prospect submits the AI Setup Audit Scorecard at audit.flashfusion.co, automatically analyze it and generate an audit report draft.

## Trigger
Form submission from AI Setup Audit Scorecard (Base44 webhook or Airtable trigger)

## Inputs
- All scorecard responses (8 dimensions, gap checkboxes)
- Company and contact info

## Steps
1. Receive scorecard submission via webhook
2. Claude: Analyze responses using `02-ai-setup-audit-analyzer` prompt
3. Claude: Generate gap analysis with severity ratings
4. Claude: Build priority matrix
5. Claude: Draft audit report
6. Create Notion page: full audit report
7. Create Google Drive doc: formatted report (ready to send)
8. Notify Kyle via Slack: "New audit submission: [Company] — Score: [X]/80"
9. Log in Airtable: company, score, submission date, report link

## Output
- Notion page with full audit analysis
- Google Drive doc ready for delivery
- Slack notification with summary
- Airtable row updated

## Human Gate
Kyle reviews and edits before sending to prospect. Agent generates draft — not final deliverable.

## Platform
n8n + Claude API + Notion MCP + Google Drive MCP + Slack MCP
