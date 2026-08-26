# Agent: Lead Enrichment Agent

## Purpose
Automatically enrich new leads with company data, ICP scoring, and recommended outreach angle.

## Trigger
New row in Airtable/Notion leads table (via form, LinkedIn import, or manual add)

## Inputs
- Company name
- Contact name
- Source

## Steps
1. Web search: company name + size indicators ("employees," "team," "founded")
2. Web search: company name + AI tools OR compliance terms
3. Apollo.io query: company firmographic data (employees, industry, revenue if available)
4. Claude: Score ICP fit across 4 dimensions (size, compliance, AI stage, authority)
5. Claude: Generate recommended outreach angle (1 sentence from their world, not ours)
6. Update Notion/Airtable record with enrichment data
7. Slack notification if ICP score ≥ 15/20

## Output
- Enriched lead record (size, industry, ICP score, outreach angle)
- High-score leads flagged in Slack

## Human Gate
High-score leads (≥15/20) flagged for human review before outreach sent

## Guardrails
- Do not send any outreach — enrichment only
- Log data confidence level: High (confirmed) / Medium (inferred) / Low (estimated)

## Platform
n8n + Claude API + Apollo.io MCP + Notion MCP
