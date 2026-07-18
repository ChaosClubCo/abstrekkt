# Abstrekkt — Canonical Artifact Registry
> **This file is the source of truth for all Claude artifacts in this project.**
> Before creating any new artifact: check here. If a tool for that job already
> exists, patch the canonical — do not create a sibling. If you must version,
> follow §2 and update this table.

---

## 1. Canonical table

### Lane: Memoir

| Canonical file | Purpose | When to use |
|---|---|---|
| `memoir-explorer.jsx` | Visual/thematic scene explorer, multi-theme (Carbon Noir/Blueprint/Midnight Stack) | Browsing scenes, exploring the emotional architecture, arc navigation |
| `memoir-command-center.jsx` | Chapter tracker with real chapter data, storage-backed, status management | Tracking chapter completion, session handoffs, status review |
| `memoir-hub-v3.jsx` | Writing collaborator, self-healing Claude API, excavation/drafting | Active writing sessions, excavation prompts, drafting beats |
| `book_command_center.html` | Story overview + letters + AI excavation (HTML surface) | Quick story-state reference, letters-to-send view |

**STALE — do not use:**
- `memoir-project-hub.jsx` — superseded by `memoir-command-center.jsx`

---

### Lane: Press & Pitch

| Canonical file | Purpose | When to use |
|---|---|---|
| `pitch_console.html` | Pitch database: static journalist entries, targets, status | Reviewing all pitches, picking a target, updating status |
| `pitch_generator.html` | Claude API pitch generator (uses PITCHES from console as context) | Generating/drafting a pitch to a new target |
| `dispatch-v3.jsx` | Quick-post content dispatcher, Drive MCP, tone control | Drafting short FlashFusion/AI-tooling posts from build notes |

**STALE — do not use:**
- `pitch_console_bak.html` — pre-Jared backup. Archive/delete.
- `dispatch-v2.jsx` — superseded by v3 (Drive integration, toasts, tighter scope)

---

### Lane: Content & Publishing

| Canonical file | Purpose | When to use |
|---|---|---|
| `content-engine.jsx` | Voice foundation + Claude API content generator | Drafting FlashFusion essays/posts from scratch with voice enforcement |
| `editorial-framework.html` | Editorial framework: content types, format rules, publishing criteria | Planning content, checking what's in-scope vs out-of-scope |
| `publishing_command_center_v2.html` | 5 publishing paths + 4 reader personas + pitch/letters | Deciding which path for a piece, persona targeting |
| `voice-audit.jsx` | Voice audit tool: paste text, get voice-alignment score + notes | Checking a draft before publishing |

**STALE — do not use:**
- `publishing_command_center.html` — superseded by v2 (fewer tabs, less content)

---

### Lane: FlashFusion Delivery (separate — not author lane)

| Canonical file | Purpose | Notes |
|---|---|---|
| `00-suite-hub.jsx` | Claude Enablement Suite hub for client delivery | Has React hook violation; fix before production deploy |
| `01-intake-form.jsx` | Pre-session intake | — |
| `02-prompt-package-builder.jsx` | Prompt package builder | — |
| `03-self-service-guide.jsx` | Employee self-service | — |
| `04-outcome-tracker.jsx` | Session outcome tracker | — |
| `05-accountability-tracker.jsx` | Weekly check-ins | — |
| `06-objection-handler.jsx` | Live objection handler | — |

---

### Cross-lane reference

| Canonical file | Purpose | When to use |
|---|---|---|
| `abstrekkt-tokens.css` | Abstrekkt design tokens (midnight ink/ember) | Drop-in base for any new artifact. Never infer tokens. |
| `design.md` | Load-Bearing design contract (5-screen newsletter) | Load-Bearing build reference |
| `project-focus-evolution-v2.html` | Career/project evolution timeline | Narrative reference for pitches and About copy |
| `char-diagnostic-instinct.md` | The diagnostic instinct character profile | Voice/origin reference for scripts and pitches |
| `kyle-origin-video-scripts-v4.md` | Origin story scripts (YouTube / LinkedIn / TikTok) | Video recording reference, updated with piano/pattern beat |

**STALE:**
- `project-focus-evolution.html` — superseded by v2

---

## 2. Naming convention (enforced from this file forward)

**Rule:** the canonical artifact has NO version suffix. Only archived non-canonical files carry a suffix.

```
CANONICAL:   pitch_console.html
ARCHIVE:     pitch_console_archive_2025-06.html   ← rename before replacing
NEVER:       pitch_console_bak.html               ← _bak is ambiguous; use _archive_YYYY-MM
NEVER:       pitch_console_v2.html                ← v2 implies v1 is still alive
```

**When you want to create a new version:**
1. Rename the current canonical to `[name]_archive_[YYYY-MM].[ext]`
2. Update this table: mark old as ARCHIVE, add new canonical
3. Build the new version as `[name].[ext]` (no suffix)
4. Commit one PR / one session: rename + new build + CANON.md update are atomic

**File naming for net-new tools:**
- Use kebab-case: `author-hub.jsx` not `AuthorHub.jsx`
- Prefix with lane slug if lane-specific: `memoir-command-center.jsx`, not `commandCenter.jsx`
- Cross-lane tools: no prefix

---

## 3. Stale file disposal (do these once, then keep CANON.md current)

Files to archive/delete from the project:

| File | Action | Reason |
|---|---|---|
| `memoir-project-hub.jsx` | Archive | Superseded by `memoir-command-center.jsx` |
| `publishing_command_center.html` | Archive | Superseded by `_v2` |
| `project-focus-evolution.html` | Archive | Superseded by `_v2` |
| `pitch_console_bak.html` | Delete | Pre-Jared backup; `pitch_console.html` is current |
| `dispatch-v2.jsx` | Archive | Superseded by `dispatch-v3.jsx` |

These are read-only project files — flag to remove in the next project sync/cleanup pass.

---

## 4. Anti-drift rules (enforce in every session)

- **Check CANON.md before creating any new artifact.** If it already has a canonical file for the job, patch it — do not create a sibling.
- **Never create `_v2`, `_bak`, `_new`, `_final`, `_FINAL2`.** The convention is §2.
- **Any artifact not in this table doesn't exist officially.** If you build something new, add it here before the session ends.
- **Version pairs with the same job = one of them is stale.** Decide canonical, archive the other, update this table. Do not leave both alive.
- **Butler rule:** repeated references across files are not confirmation. Check ground truth, not sibling artifact consistency.
