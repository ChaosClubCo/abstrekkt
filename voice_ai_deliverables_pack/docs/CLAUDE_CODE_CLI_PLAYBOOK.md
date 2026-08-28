# Claude Code CLI — File/Folder Manipulation Playbook (Generated 2026-02-04)

This is the **"why did it say it can't touch my computer"** fix, without magical thinking.

The core reality:
- **Claude the chat app** may not have OS/tool access.
- **Claude Code CLI** can, because *you* run it locally and it executes commands in your shell.
- Confusion happens when you're in the wrong surface (voice chat / chat UI) versus the CLI, or when the CLI is missing permissions/working directory context.

## A) Correct mental model (so the universe stops gaslighting you)

Claude Code CLI is basically:
1) you provide instructions,
2) it proposes shell commands + file edits,
3) you approve (or it runs under configured permissions),
4) those commands run *on your machine*.

If you're talking to "Claude" in a voice interface that isn't connected to the CLI session, it will truthfully say it can't access your computer.

## B) Make file ops reliable

### 1) Always start in the project root
Open a terminal **in the folder you want modified**.

Then run your Claude Code command from there. (Exact command varies by install, but the rule is invariant: *cwd matters*.)

### 2) Confirm the CLI is actually installed and on PATH
Run:
- `claude --version`  (or whatever your installed binary is)
If that fails, your shell isn't seeing it. Fix PATH or reinstall.

### 3) Use explicit constraints in your instruction
Claude works better when you say:
- "Operate only inside this directory"
- "Do not delete anything"
- "Use git-safe edits (no force resets)"
- "Show a plan, then apply"
- "Print diffs"

Example instruction:
- "Audit this repo, propose changes as a diff, then apply the diff. Do not delete files. Only add/modify. Keep changes minimal."

### 4) Permissions: OS-level blockers that look like "Claude can't do it"
Depending on OS, you might be blocked by:
- read-only directories
- corporate endpoint protection
- macOS privacy controls (Files & Folders access for the terminal)
- Windows Controlled Folder Access

You don't "flip a Claude setting" — you grant the terminal/app permissions.

#### macOS
- System Settings → Privacy & Security → **Files and Folders**
  - Ensure your Terminal app (Terminal/iTerm/VSCode/Antigravity) has access to the folders you’re touching.
- Also check: Privacy & Security → **Full Disk Access** (if your org allows it)
  - Add your terminal/editor host if needed.

#### Windows 11
- Windows Security → Virus & threat protection → Ransomware protection → **Controlled folder access**
  - Either disable (not recommended) or **Allow an app** (your terminal/editor).

#### Linux
- Usually filesystem permissions (`chmod`, `chown`) or sandboxing (Flatpak/Snap).
  - If using Flatpak terminal/editor, grant host filesystem access.

### 5) Tool-mode mismatch: "voice mode" vs "CLI mode"
If you're using voice chat in Claude/Gemini/Copilot, you're not in the CLI session. 
Fix: run the CLI from terminal and keep it as the "execution surface". Use voice only for ideation.

## C) Canonical workflows (pick one)

### Workflow 1 — "Plan then apply" (recommended)
1) Ask for a plan + file list + diffs
2) Approve
3) Run tests

### Workflow 2 — "Tight loop" (fast)
1) one small change at a time
2) run lint/tests between steps

### Workflow 3 — "Guardrailed big refactor"
1) create branch
2) ask for incremental PR-sized commits
3) each commit green tests

## D) Non-destructive smoke checks
Run the doctor scripts in `scripts/` to confirm:
- you can create a folder in repo
- you can write/read a file
- your shell has correct cwd
- git is present
- basic env info

## E) Troubleshooting (Cause → Fix → Retry)
- CLI says "can't access computer":
  - Cause: you're in chat UI, not CLI, OR you didn't launch from correct directory.
  - Fix: run from terminal in project root.
  - Retry: re-run with explicit instructions + constraints.

- CLI can run commands but can't write files:
  - Cause: permissions, controlled folder access, or read-only filesystem.
  - Fix: grant terminal access (macOS/Windows), or adjust folder permissions.
  - Retry: doctor script then rerun.

- It edits the wrong place:
  - Cause: wrong working directory.
  - Fix: `pwd` / `cd` to repo root.
  - Retry: run again and mention absolute path in instructions.

## F) Copy/paste prompt to use inside Claude Code CLI
See `prompts/CLAUDE_CODE_CLI_TASK_PROMPT.md`.
