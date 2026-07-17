# Agent: Discovery Call Brief Agent

## Purpose
Automatically generate a pre-call research brief for every new prospect before a discovery call.

## Trigger
New prospect added to pipeline (Airtable/Notion row created, or manual trigger)

## Inputs
- Company name
- Contact name and title
- Known context (source, any prior conversation)
- LinkedIn URL (optional)

## Steps
1. Receive prospect data from Notion/Airtable
2. Web search: company name + "AI" or "automation" + last 6 months
3. Web search: contact name + company
4. Claude: Analyze search results, score ICP fit, identify 5 discovery questions
5. Claude: Draft discovery call brief using `01-discovery-call-prep` prompt
6. Write brief to Notion (attach to prospect record)
7. Send Slack notification: "Brief ready for [Name] at [Company]"

## Output
- Formatted discovery brief in Notion
- Slack notification with brief link
- ICP score (1–10) logged in pipeline

## Human Gate
None — brief is advisory. Call prep is up to Kyle.

## Guardrails
- Never send the brief externally (internal only)
- If web search returns no results, flag and note "insufficient data" rather than fabricating

## Failure Mode
Web search fails → log "search unavailable," generate brief from available intake data only

## Platform
n8n + Claude API + Notion MCP + web search tool
