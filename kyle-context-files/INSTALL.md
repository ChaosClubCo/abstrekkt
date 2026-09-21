# Context files — setup guide

## Overview
12 files across 5 layers. Read this before touching anything.
The system works because each layer handles a different scope. Don't collapse them.

---

## The hierarchy (load order in Claude Code / Cowork)

```
~/.claude/CLAUDE.md              ← 1. ALWAYS, every session, every project
~/.claude/rules/engineering.md   ← 2. ALWAYS (if user-level rules supported*)
~/.claude/rules/comms.md         ← 2. ALWAYS (if user-level rules supported*)
./CLAUDE.md                      ← 3. ALWAYS, this project only
.claude/rules/stack.md           ← 4. ALWAYS, this project only
AGENTS.md                        ← 5. Project start (cross-tool tools)
MEMORY.md                        ← 6. Reference — load manually or @import
CONTEXT.md                       ← 7. Session start — you rewrite this each session
CLAUDE.local.md                  ← 8. Your personal overrides (gitignored)
```

*User-level rules (`~/.claude/rules/`) — Claude Code v2.x behavior, verify your version supports it.
If unsure, copy the content from global-rules/*.md into your `~/.claude/CLAUDE.md` instead.

---

## Installation steps

### Step 1 — Global files (one time, all projects)
```bash
# Create the global directory if it doesn't exist
mkdir -p ~/.claude/rules

# Copy global CLAUDE.md
cp 1-global/CLAUDE.md ~/.claude/CLAUDE.md

# Copy global rules (check your version supports this first)
cp 2-global-rules/engineering.md ~/.claude/rules/engineering.md
cp 2-global-rules/comms.md ~/.claude/rules/comms.md
```

### Step 2 — FlashFusion project (do once in your FF repo root)
```bash
# From your FlashFusion repo root:
cp [path-to-this-folder]/3-flashfusion-project/CLAUDE.md ./CLAUDE.md
cp [path-to-this-folder]/3-flashfusion-project/AGENTS.md ./AGENTS.md
cp [path-to-this-folder]/3-flashfusion-project/CONTEXT.md ./CONTEXT.md
cp [path-to-this-folder]/3-flashfusion-project/CLAUDE.local.md ./CLAUDE.local.md

mkdir -p .claude/rules
cp [path-to-this-folder]/3-flashfusion-project/.claude/rules/stack.md .claude/rules/stack.md

# Add CLAUDE.local.md to .gitignore
echo "CLAUDE.local.md" >> .gitignore
```

### Step 3 — Intinc working directory (do once)
```bash
# In whatever folder you use for Intinc AI work:
cp [path-to-this-folder]/4-intinc-project/CLAUDE.md ./CLAUDE.md
cp [path-to-this-folder]/4-intinc-project/CONTEXT.md ./CONTEXT.md
```

### Step 4 — MEMORY.md (decide where this lives)
Option A — one shared file, referenced from both projects:
  Keep it in a central location and @import it in each CLAUDE.md:
  Add this line to each project CLAUDE.md: `@memory /path/to/MEMORY.md`

Option B — copy to each project root:
  cp 5-shared/MEMORY.md [ff-repo]/MEMORY.md
  cp 5-shared/MEMORY.md [intinc-dir]/MEMORY.md

Option B is simpler. Option A means you only update it in one place. Your call.

---

## Maintenance rules

**CLAUDE.md files** — edit rarely. Only when something fundamental changes.
Keep each one under 100 lines. If it grows, move content to `.claude/rules/` files.

**CONTEXT.md** — rewrite at the start of every session. Don't append, replace.
This is your session standup. Stale context is worse than no context.

**MEMORY.md** — append only. Never delete or rewrite entries.
Add a date to each new entry. This is your permanent record.

**CLAUDE.local.md** — update freely. It's yours, it's gitignored, no one else sees it.

**.claude/rules/*.md** — edit when a topic area needs more detail.
Each file should cover one topic. Under 30 lines each.

---

## What to put where (quick reference)

| Content | File |
|---|---|
| Who you are, your philosophy | `~/.claude/CLAUDE.md` |
| Cross-project engineering rules | `~/.claude/rules/engineering.md` |
| How you want responses formatted | `~/.claude/rules/comms.md` |
| This project's stack and current state | `./CLAUDE.md` |
| Stack-specific rules for this project | `.claude/rules/stack.md` |
| What you're working on today | `CONTEXT.md` (rewrite each session) |
| Decisions that have already been made | `MEMORY.md` (append only) |
| Machine-specific config, personal notes | `CLAUDE.local.md` (gitignored) |
| Cross-tool (Cursor, Codex, etc.) | `AGENTS.md` |
