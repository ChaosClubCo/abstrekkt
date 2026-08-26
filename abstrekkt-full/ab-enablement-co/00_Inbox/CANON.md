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
| `memoir_engine.html` | Story builder UI (legacy HTML surface) | REVIEW — absorb into author hub or archive |
| `book_command_center.html` | Story overview + letters + AI excavation (HTML surface) | Quick story-state reference, letters-to-send view |

**STALE — retired Jul 2026:**
- `memoir-project-hub.jsx` — removed from project
- `memoir-command-center.jsx` · `memoir-hub-v3.jsx` — functions absorbed by `abstrekkt-author-hub.jsx`; source recoverable from knowledge index if needed

---

### Lane: Press & Pitch

| Canonical file | Purpose | When to use |
|---|---|---|
| `pitch_console.html` | Pitch database: static journalist entries, targets, status | Reviewing all pitches, picking a target, updating status |
| `pitch_generator.html` | Claude API pitch generator (uses PITCHES from console as context) | Generating/drafting a pitch to a new target |
| `dispatch.jsx` | Quick-post dispatcher — Drive search, self-healing API (3-retry + mock fallback), client mode, tone control | Drafting short FlashFusion/AI-tooling posts from build notes |
| `playbook.html` | Public vibe-coding playbook page (kyle.abstrekkt.com/playbook) — Gate 2 for all press sends | Deploy target; source of truth is `vibe-coding-playbook-web.md` — patch both together |
| `kyle-abstrekkt-index.html` | kyle.abstrekkt.com root — one-screen identity card | Deploys as `/index.html`; extends only when a linked thing is live (no promises) |

**STALE — do not use:**
- `dispatch_archive_2026-07.jsx` — was v2 (WCAG pass); superseded by `dispatch.jsx` (was v6)
- `pitch_console_bak.html` deleted ✓ · `dispatch-v3.jsx` removed from project ✓ Jul 2026

---

### Lane: Content & Publishing

| Canonical file | Purpose | When to use |
|---|---|---|
| `content-engine.jsx` | Voice foundation + Claude API content generator | Drafting FlashFusion essays/posts from scratch with voice enforcement |
| `editorial-framework.html` | Editorial framework: content types, format rules, publishing criteria | Planning content, checking what's in-scope vs out-of-scope |
| `publishing_command_center.html` | 5 publishing paths + 4 reader personas + pitch/letters | Path decisions, persona targeting — VERIFY carries v2 content (v2 recoverable from index) |
| `voice-audit.jsx` | Voice audit tool: paste text, get voice-alignment score + notes | Checking a draft before publishing |

**STALE:** v1 removed from project Jul 2026 — the suffix-free name now carries the canonical.

---

### Lane: FlashFusion Delivery (relocated Jul 2026)

The Claude Enablement Suite (`00-suite-hub.jsx` through `06-objection-handler.jsx`)
no longer lives in this project. ASSUMED relocated to the FlashFusion delivery
context during the Jul 7 lane reorganization — not deleted. If that assumption
is wrong, restore from knowledge index. Known open defect carried with it:
`00-suite-hub.jsx` has a React hook violation; fix before production deploy.

---

### Cross-lane reference

| Canonical file | Purpose | When to use |
|---|---|---|
| `abstrekkt-tokens.css` | Abstrekkt design tokens (midnight ink/ember) | Drop-in base for any new artifact. Never infer tokens. |
| `design.md` | Load-Bearing design contract (5-screen newsletter) | Load-Bearing build reference |
| `project-focus-evolution.html` | Career/project evolution timeline | Narrative reference for pitches and About copy |
| `char-diagnostic-instinct.md` | The diagnostic instinct character profile | Voice/origin reference for scripts and pitches |
| `kyle-origin-video-scripts.md` | Origin story scripts (YouTube / LinkedIn / TikTok) | Video recording reference, updated with piano/pattern beat |
| `abstrekkt-author-hub.jsx` | Author command center — memoir/pitch/content/canon, one surface | Session entry point for author-lane work |
| `voice_map.jsx` | Voice analysis across lanes (essay/lyrics), self-healing API | Mapping voice signatures across writing lanes |
| `the-evidence-board.md` | Evidence board — memoir source ledger | Cross-checking memoir claims against primary sources |
| `kyle_docs_readable.txt` | Historical compilation (Apr 2026) | Reference only — claims inside are dated; never treat as current state (Butler rule) |

**STALE:** v1 + underscore sibling of `project-focus-evolution` removed from project Jul 2026 (differed materially, 28KB vs 47KB — retained in history, not restored).

**REVIEW — live but unregistered (purpose unverified; register or archive, don't leave):**
`writing-fixer.jsx` · `voice-generator.html` · `antigravity-build-prompts.md` · `stitch-prompts.md` · `kyle_brilliant_moments.html` · `matt-wolfe-tldr.html`

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

## 3. Stale file disposal

| File | Action | Reason |
|---|---|---|
| All five original entries | Done ✓ Jul 7, 2026 | Disposed or absorbed — see lane STALE lists. `PROJECT_STATE.md` (deprecated relic) also removed. |

---

## 4. Anti-drift rules (enforce in every session)

- **Check CANON.md before creating any new artifact.** If it already has a canonical file for the job, patch it — do not create a sibling.
- **Never create `_v2`, `_bak`, `_new`, `_final`, `_FINAL2`.** The convention is §2.
- **Lint: no canonical entry in §1 may contain a version token.** If one appears, the registry itself drifted — fix before any other work.
- **Any artifact not in this table doesn't exist officially.** If you build something new, add it here before the session ends.
- **Version pairs with the same job = one of them is stale.** Decide canonical, archive the other, update this table. Do not leave both alive.
- **Butler rule:** repeated references across files are not confirmation. Check ground truth, not sibling artifact consistency.

---

*Reconciled Jul 7, 2026 — three-inventory audit (live list / mount / registry). Ops + author-hub hunks: `canon-sync-ops.md`.*
