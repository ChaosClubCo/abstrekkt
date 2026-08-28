# Claude Code CLI Task Prompt (Copy/Paste)

You are operating inside my local repository via Claude Code CLI.

Hard rules:
- Only modify files under the current working directory.
- Do not delete files or run destructive commands (rm -rf, format disks, reset hard, etc.).
- Prefer minimal diffs; keep existing architecture unless it is broken.
- Always show a plan and a file list first.
- After applying changes, run the project's existing tests (or a safe smoke check if none exist).

Task:
1) Audit the repo for production readiness (security, perf, observability, tests, DX).
2) Generate missing docs (SECURITY.md, ARCHITECTURE.md, RUNBOOK.md) if absent.
3) Produce a prioritized WSJF backlog table and save it to `docs/WSJF_BACKLOG.md`.
4) Implement the top 1–2 quick wins (low risk, high value) with tests.

Output:
- Summarize findings
- Provide diffs / changed files list
- Show test command output
