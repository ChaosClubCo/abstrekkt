# Agent: Client Onboarding Agent

## Purpose
Automate the post-SOW onboarding sequence — intake form, kickoff prep, access verification.

## Trigger
SOW marked "signed" in Notion pipeline

## Steps
1. Create client record in Notion (company, contact, service, start date)
2. Draft and send (via Kyle approval): welcome email with intake form link
3. Create Google Drive folder: [ClientName] x FlashFusion
4. Create Notion sprint tracker for the engagement
5. Add kickoff call to Google Calendar (draft — Kyle confirms time)
6. Slack notification: "Onboarding started for [Company] — intake form sent"
7. 3-day reminder: if intake form not submitted, send Slack alert to Kyle

## Output
- Client Notion record
- Google Drive folder created
- Sprint tracker initialized
- Welcome email drafted (pending Kyle approval)
- Calendar event drafted

## Human Gate
Welcome email requires Kyle approval. Calendar invite requires Kyle to confirm timing.

## Platform
n8n + Google Drive MCP + Google Calendar MCP + Notion MCP + Gmail MCP
