# Agent: Invoice Generator Agent

## Purpose
Generate invoice drafts when milestones are reached.

## Trigger
Sprint milestone marked "complete" in Notion

## Steps
1. Pull client record (company, contact, SOW, invoice schedule)
2. Identify which milestone triggered the invoice
3. Claude: Generate formatted invoice from `12-invoice-template`
4. Create Google Drive doc: invoice
5. Slack notification: "Invoice ready for [Company] — Milestone: [Name]"
6. Add to Revenue Tracker

## Output
- Google Drive invoice doc
- Revenue Tracker entry (status: draft)
- Slack notification

## Human Gate
Kyle reviews and sends invoice. Agent does not send directly.

## Platform
n8n + Notion MCP + Google Drive MCP + Slack MCP + Claude API
