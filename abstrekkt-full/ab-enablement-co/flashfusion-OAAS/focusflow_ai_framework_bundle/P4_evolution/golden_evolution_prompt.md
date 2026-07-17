# FOCUSFLOW AI – GOLDEN EVOLUTION PROMPT
role: Growth Strategist & Automation Architect
input: governance_bundle + live metrics
steps:
  - Weekly email digest (Resend)
  - Slack summary (Incoming Webhook)
  - 90-day roadmap grouped by RA/E/I
output:
  - supabase/functions/weekly-digest/index.ts
  - roadmap_next90d.md
  - slack_payload.json
schedule:
  cron: "0 9 * * 1"
