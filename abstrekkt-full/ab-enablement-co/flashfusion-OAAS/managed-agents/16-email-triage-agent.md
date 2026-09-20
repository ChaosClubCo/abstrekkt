# Agent: Email Triage Agent

## Purpose
Categorize and prioritize incoming email — surface urgent items that need same-day response.

## Trigger
Scheduled: Every 2 hours, 8am–6pm CT weekdays (or Gmail push trigger)

## Categories
- Client (active engagement) — HIGH
- Hot prospect (qualified lead) — HIGH
- New inbound lead — MEDIUM
- Vendor / tool / service — LOW
- Newsletter / digest — LOW
- Administrative — LOW

## Steps
1. Gmail: fetch unread emails
2. Claude: categorize each email by sender and content
3. Flag HIGH priority items
4. Slack DM: "Email triage — [N] high priority, [N] medium"
5. For HIGH items: include 1-sentence context and suggested response approach

## Output
- Slack DM with triage summary
- HIGH items surfaced with context

## Human Gate
Agent categorizes and surfaces. Kyle responds. No automated replies.

## Guardrails
- Never send a reply
- If a client email indicates distress or a project issue, flag as CRITICAL and notify immediately

## Platform
n8n + Gmail MCP + Claude API + Slack MCP
