# Agent: Skill Pack Installer Agent

## Purpose
Guide a client through skill pack installation with validation and error handling.

## Trigger
Client onboarding agent completes (or manual trigger for existing clients)

## Steps
1. Pull selected skill packs for this client from Notion
2. Generate installation guide: step-by-step for each skill pack
3. Validate each skill pack against compliance checklist:
   - "Use when..." triggers defined
   - Version nested under metadata
   - Hooks not on claude.ai skills
   - Allowed-tools set to least-privilege
4. Flag any compliance gaps before installation begins
5. Create Google Drive doc: installation guide with checklist
6. Slack: "Skill pack installation guide ready for [Company]"

## Output
- Installation guide (Google Drive)
- Compliance checklist with any gaps flagged
- Slack notification

## Human Gate
Kyle reviews installation guide before sending to client. Client runs installation with guide.

## Guardrails
- Never deploy to a client environment without Kyle's authorization
- Flag ALL compliance gaps — do not omit for convenience

## Platform
n8n + Claude API + Google Drive MCP + Notion MCP + Slack MCP
