# Agent: Outreach Sequencer

## Purpose
Run a structured outreach sequence for qualified prospects who haven't responded.

## Trigger
Manual trigger: Kyle selects "Start sequence" on a prospect record

**Prerequisite:** kylerosebrook.com must be live + FreeAssessment flow confirmed functional before any outreach sends

## Inputs
- Prospect name, company, email, role
- Recommended outreach angle (from lead enrichment)
- Sequence template to use

## Steps
1. Day 0: Draft email 1 (intro + audit CTA) — send to Kyle for approval before sending
2. If no reply in 5 days: Draft email 2 (follow-up, different angle)
3. If no reply in 5 more days: Draft LinkedIn connection request message
4. If no reply after LinkedIn: Log "cadence complete" — do not continue
5. Log all activity in Notion (sent date, response, outcome)

## Output
- Email drafts for Kyle approval at each step
- Activity log in Notion
- Stage updates in pipeline

## Human Gate
Every email requires Kyle approval before send. This agent drafts — does not send autonomously.

## Guardrails
- Maximum 3 touches per prospect
- Never send to prospects marked "disqualified"
- Always wait for human approval on emails

## Platform
n8n + Claude API + Gmail MCP + Notion MCP
