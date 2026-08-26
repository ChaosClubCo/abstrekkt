# Agent: Calendar Intelligence Agent

## Purpose
Prepare a daily brief of what's on the calendar and what prep is needed.

## Trigger
Scheduled: 7am CT weekdays

## Steps
1. Google Calendar: fetch today's events
2. For each event with an external contact: pull Notion context (prospect/client record)
3. Claude: Generate a 1-sentence prep note for each meeting
4. If discovery call detected: trigger Discovery Call Brief Agent
5. Slack DM to Kyle: daily brief with meetings + prep notes

## Output
- Slack DM: today's schedule with context notes
- Auto-trigger of discovery brief agent if applicable

## Human Gate
Fully automated. No human approval needed for prep brief.

## Platform
n8n + Google Calendar MCP + Notion MCP + Claude API + Slack MCP
