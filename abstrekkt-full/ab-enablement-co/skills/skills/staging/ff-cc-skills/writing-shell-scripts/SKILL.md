---
name: writing-shell-scripts
metadata:
  version: "1.0.0"
  author: Kyle Rosebrook / Intinc
description: >
  Writes production-ready shell and automation scripts (Bash .sh and PowerShell .ps1)
  with a mandatory adversarial audit gate, MSP-grade error handling, input validation,
  idempotency, structured logging, and a paired README.md. Use this skill whenever
  the user asks to write, create, generate, build, or fix a shell script, automation
  script, deployment script, .sh file, .ps1 file, PowerShell script, Bash script,
  or endpoint script. Also triggers on: write me a script, automate this with a script,
  make a script that, PS1 for, bash to, script to deploy, Intinc script, MSP script,
  client deployment script, idempotent script, script with error handling, script with
  logging, production shell script, or any task that should be automated via the command
  line. Do NOT skip this skill for simple requests — even short scripts must pass the
  audit gate before output.
---

# Writing Shell Scripts

Produces Bash (.sh) and PowerShell (.ps1) scripts for Intinc MSP client deployments
and dev automation. Every script ships with a paired README.md. No exceptions.

---

## Decision Tree

```
What platform?
  ├─ User says bash / linux / mac / .sh ──────── Bash
  ├─ User says PowerShell / PS1 / Windows ───── PowerShell
  ├─ Intinc MSP context, no OS specified ──────── PowerShell (default — Windows endpoints)
  └─ Cross-platform needed ────────────────────── Write both; note differences in README
```

---

## Examples

**Example 1 — Basic PowerShell deployment**
User: "Write a PS1 to install the RMM agent silently on Windows endpoints"
→ Route: PowerShell. Idempotency: check if agent service exists before installing. Admin check: yes. Log to `C:\ProgramData\Intinc\Logs\`. Paired README with rollback instructions.

**Example 2 — Bash maintenance script**
User: "Create a bash script that rotates logs older than 30 days"
→ Route: Bash. `set -euo pipefail`. Cleanup trap. Log to `/var/log/intinc/`. Idempotency: find-and-delete is inherently safe. README with cron usage example.

**Example 3 — Cross-platform**
User: "Write a script to create a local admin account if it doesn't exist"
→ Route: Both. Bash version with `id` check; PS1 version with `Get-LocalUser`. Same README covers both, with OS-specific usage sections.

---

## Golden Path

### 1. Capture Requirements

Before writing, extract:
- What does the script do? (one sentence)
- What environment? (endpoint, server, CI, cron, n8n)
- Who runs it? (admin, service account, end user, automated)
- Inputs? (flags, env vars, files)
- Idempotent? (default: **YES** for all MSP scripts)
- Rollback needed?

If missing and it affects correctness or security → ask. Otherwise use labeled defaults.

### 2. Write the Script

Read `references/full-scripts-rule.md` before writing. The rule is: every script
must be complete and executable as delivered. No TODOs, no placeholders, no truncation.

Start from the appropriate skeleton in `references/skeletons.md`. Fill in the SCRIPT BODY section. Do not remove the skeleton's error handling, logging, or preflight blocks.

### 3. Run the Audit Gate (MANDATORY — NO EXCEPTIONS)

Before any output, run every item below internally. Fix failures before outputting. Do not output a script with a known failing item — a script that fails the gate is a liability, not a deliverable.

**Security**
- [ ] No secrets, passwords, API keys hardcoded — env vars or `[SecureString]` only
- [ ] No `curl | bash` — download then verify separately
- [ ] External URLs are HTTPS only
- [ ] File paths validated before use; no path traversal possible
- [ ] PS: no `Invoke-Expression` on dynamic/untrusted input
- [ ] Bash: all user inputs quoted; no `eval` on untrusted data

**Error Handling**
- [ ] Bash: `set -euo pipefail` present
- [ ] PS: `$ErrorActionPreference = "Stop"` set
- [ ] Every external command has a meaningful failure path
- [ ] Exit codes explicit (0 = success, non-zero = failure)
- [ ] Temp files / locks cleaned up on exit (`trap` or `try/finally`)

**Input Validation**
- [ ] All parameters validated before use
- [ ] Flags parsed explicitly — no positional blind spots
- [ ] Usage/help exists

**Idempotency**
- [ ] Safe to run twice on the same machine
- [ ] Checks existing state before making changes
- [ ] File writes use atomic or temp-and-move patterns where applicable

**Logging**
- [ ] Log path defined and directory created if missing
- [ ] Start and completion timestamped
- [ ] Errors logged with context before exit
- [ ] No sensitive values written to log

**Portability**
- [ ] Bash: shebang is `#!/usr/bin/env bash`
- [ ] PS: `#Requires -Version` set
- [ ] Dependencies checked at startup

### 4. Write the README.md

See `references/readme-template.md` for the full template. Required sections:

- Overview, Requirements, Usage, Parameters, Environment Variables
- Behavior (plain English walkthrough)
- Error codes, Log path, Idempotency, Rollback
- Best Practices Applied, Known Limitations, Changelog

### 5. Output

Deliver two files minimum:
- `<descriptive-name>.sh` or `<descriptive-name>.ps1`
- `README.md`

Name files descriptively: `deploy-rmm-agent.ps1`, not `script.ps1`.
Cross-platform: deliver `.sh`, `.ps1`, and one `README.md` covering both.

---

## MSP Defaults (Intinc)

Applied automatically unless overridden:

| Setting | Value |
|---|---|
| Log dir (Windows) | `C:\ProgramData\Intinc\Logs\` |
| Log dir (Linux) | `/var/log/intinc/` |
| Idempotency | Always ON |
| Admin check | Included unless explicitly not needed |
| Exit codes | Strict 0/1 |
| Secrets | Env vars or SecureString only |
| Rollback section | Always in README |

---

## Self-Verification

Before delivering:
- [ ] Audit gate passed — all items checked and fixed
- [ ] Two files delivered: script + README
- [ ] No placeholder TODOs left in output
- [ ] Secrets rule clean
- [ ] Script named descriptively

---

## CLAIMS
- The audit gate is the primary mechanism preventing multi-LLM cross-checking — it must run on every script, no exceptions
- MSP defaults (idempotency, admin check, Intinc log paths) apply unless the user explicitly overrides them
- Skeletons in references/skeletons.md represent the minimum viable starting point; removing their error handling blocks is a gate failure

## COUNTEREXAMPLE
- A script interfacing with an RMM tool's dynamic output may require controlled use of `Invoke-Expression` — document the exception explicitly and scope it tightly
- Idempotency-always-on conflicts with intentionally destructive scripts (e.g., wipe-and-reinstall) — override explicitly and note in README

## CONTRADICTIONS
- "Fix all gate failures before output" vs. "user asks for a rough draft" — resolved by treating rough drafts as gate failures; no known-broken scripts are delivered
