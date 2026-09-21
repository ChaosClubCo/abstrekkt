# Agent: GitHub Repo Audit Agent

## Purpose
Weekly audit of key GitHub repos — check for stale branches, open PRs, failed CI.

## Trigger
Scheduled: Friday 4pm CT

## Repos to Audit
- Krosebrook/Continuum (paused — Supabase hold)
- ChaosClubCo repos
- FlashFusionv1

## Steps
1. GitHub API: list open PRs older than 7 days
2. GitHub API: list stale branches (no commits in 14 days)
3. GitHub API: check last deployment status for active projects
4. Claude: Summarize findings, flag anything needing attention
5. Slack notification: "Weekly repo audit — [N] items need attention"

## Output
- Slack summary with actionable items
- Notion log entry

## Human Gate
Audit is informational. No automated changes to repos.

## Platform
n8n + GitHub API + Claude API + Slack MCP
