# Deliverables Pack — Voice Chat + Claude Code CLI (Generated 2026-02-04)

This ZIP contains production-ready, copy/pasteable deliverables based on the conversation in this chat:
1) A **universal audit prompt** you can use in lovable.dev / app.base44 / replit / bolt / blink, etc.
2) A **Claude Code CLI computer/file ops playbook**: how to reliably get file/folder manipulation working (permissions + correct invocation patterns).
3) A **voice-chat diagnosis**: why live voice modes feel bad and what to do about it (latency, turn-taking, truncation, safety/tool-mode mismatches).
4) A **minimal "doctor" script** you can run locally to sanity-check permissions + shell environment (non-destructive).

## Quick start

- Read: `docs/CLAUDE_CODE_CLI_PLAYBOOK.md`
- Copy prompt: `prompts/UNIVERSAL_PROD_AUDIT_PROMPT.md`
- Run non-destructive checks:
  - macOS/Linux: `bash scripts/doctor.sh`
  - Windows (PowerShell): `powershell -ExecutionPolicy Bypass -File scripts/doctor.ps1`

## Safety
All scripts are **read-only / non-destructive**. They only print diagnostics and create a temporary folder under `./.tmp/` inside the current working directory.
