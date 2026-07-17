# Context files v2 — setup guide

## What changed from v1
Files are leaner. Anthropic's test: "Would removing this line cause Claude to make mistakes?"
Anything that didn't pass got cut. @imports added to project CLAUDE.md files.

---

## The hierarchy (load order)

```
~/.claude/CLAUDE.md              ← 1. ALWAYS, every session, every project
~/.claude/rules/engineering.md   ← 2. ALWAYS (user-level rules — verify your CC version*)
~/.claude/rules/comms.md         ← 2. ALWAYS
./CLAUDE.md                      ← 3. ALWAYS, this project only
.claude/rules/stack.md           ← 4. ALWAYS, this project only
AGENTS.md                        ← 5. Cross-tool agents (Cursor, Codex, etc.)
@CONTEXT.md                      ← 6. Loaded via @import in CLAUDE.md — session state
@MEMORY.md                       ← 7. Loaded via @import in CLAUDE.md — persistent decisions
CLAUDE.local.md                  ← 8. Your personal overrides, gitignored
```

*If user-level rules aren't supported in your CC version, paste engineering.md and comms.md
content directly into ~/.claude/CLAUDE.md instead.

---

## Installation

### Step 1 — Global (one time)
```bash
mkdir -p ~/.claude/rules
cp 1-global/CLAUDE.md ~/.claude/CLAUDE.md
cp 2-global-rules/engineering.md ~/.claude/rules/engineering.md
cp 2-global-rules/comms.md ~/.claude/rules/comms.md
```

### Step 2 — FlashFusion repo root
```bash
cp 3-flashfusion-project/CLAUDE.md ./CLAUDE.md
cp 3-flashfusion-project/AGENTS.md ./AGENTS.md
cp 3-flashfusion-project/CONTEXT.md ./CONTEXT.md
cp 3-flashfusion-project/CLAUDE.local.md ./CLAUDE.local.md

mkdir -p .claude/rules
cp 3-flashfusion-project/.claude/rules/stack.md .claude/rules/stack.md

# MEMORY.md: place in repo root so @MEMORY.md resolves correctly
cp 5-shared/MEMORY.md ./MEMORY.md

echo "CLAUDE.local.md" >> .gitignore
```

### Step 3 — Intinc working directory
```bash
cp 4-intinc-project/CLAUDE.md ./CLAUDE.md
cp 4-intinc-project/CONTEXT.md ./CONTEXT.md
cp 5-shared/MEMORY.md ./MEMORY.md
```

---

## The three habits that matter more than the files

### 1. Use `#` during sessions (most important)
When Claude does something wrong or forgets a rule, press `#` before correcting in chat.
Describe the rule. Claude writes it into the relevant CLAUDE.md automatically.
This is how the files get good over time — not by writing them once.

### 2. Run `/init` on new projects
Before manually writing a CLAUDE.md for a new repo, run `/init`.
Claude reads the codebase and generates a starter file. Then you trim it.
Building from what's real beats building from memory.

### 3. Rewrite CONTEXT.md every session
CONTEXT.md is your session standup — replace it, don't append.
Stale context is worse than no context. This file should take 2 minutes to update.

---

## Maintenance rules

**CLAUDE.md files** — prune regularly, edit rarely.
Test: for each line, ask "would removing this cause Claude to make a mistake?"
If no → cut it. If it grows past ~40 lines → move content to `.claude/rules/` files.

**@imports** — CLAUDE.md files import CONTEXT.md and MEMORY.md via `@file.md`.
These load at session start. If MEMORY.md gets large (>100 lines), summarize old entries.

**CONTEXT.md** — rewrite at session start. Don't append. Replace.

**MEMORY.md** — append only. Never delete entries. Date each new entry.
When it exceeds ~100 lines, move resolved items to an archive section at the bottom.

**CLAUDE.local.md** — edit freely. Yours, gitignored, no one else sees it.

---

## Quick reference: what goes where

| Content | File |
|---|---|
| Who you are, philosophy, lane structure | `~/.claude/CLAUDE.md` |
| Non-obvious engineering rules | `~/.claude/rules/engineering.md` |
| Response style preferences | `~/.claude/rules/comms.md` |
| Project stack, active blockers, hard rules | `./CLAUDE.md` |
| Stack-specific gotchas | `.claude/rules/stack.md` |
| What you're working on today | `CONTEXT.md` — rewrite each session |
| Decisions already made | `MEMORY.md` — append only |
| Machine-specific notes | `CLAUDE.local.md` — gitignored |
| Cross-tool (Cursor, Codex) | `AGENTS.md` |
