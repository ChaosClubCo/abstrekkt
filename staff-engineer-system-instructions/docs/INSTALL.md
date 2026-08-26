# Install & Use

The persona ships as plain Markdown, so it installs anywhere Claude accepts
free-text instructions. Pick the surface that matches how you work.

## Option A — Claude.ai custom instructions (web/desktop)
1. Open <https://claude.ai>.
2. Settings (gear, top-right) → **Profile** → scroll to **System Preferences /
   Custom Instructions**.
3. Select all existing text and delete it (back it up first if you want to roll
   back — see Rollback).
4. Paste the entire contents of `../system-prompt/staff-engineer-v4.1.md`.
5. **Save Changes**, then refresh (F5).
6. Run the two checks in `../tests/persona-tests.md` to confirm it's live.

## Option B — Claude Project system prompt
Create/open a Project → **Set custom instructions** → paste
`staff-engineer-v4.1.md`. Scopes the persona to that Project only (recommended if
you want different behavior per context — which is itself a v4.1 principle).

## Option C — Claude Code (CLI) `CLAUDE.md`
Paste the prompt body into a `CLAUDE.md` at the repo root (or `~/.claude/CLAUDE.md`
for global). The Tier-0 rule "default to the Claude Code CLI" is designed for this
surface.

## Option D — API system prompt
Send `staff-engineer-v4.1.md` as the `system` parameter. Combine with prompt
caching for cost efficiency if you reuse it across requests.

## Memory edits (companion, optional but recommended)
Apply the 7 behavioral edits in `../memory/behavioral-memory-edits.md` via
`memory_user_edits` (add one per edit), and remove the stale factual edits listed
there. This is what prevents cross-project context bleed.

## Safety notes
- The prompt contains **no secrets** — only placeholders and env-var references.
  Keep it that way; never paste real keys into instructions.
- The prompt instructs Claude to **never auto-execute** untrusted code and to
  flag, not echo, secrets. Don't weaken those lines.

## Rollback
Before step 3 (Option A), copy your current custom-instructions text into a local
file (e.g. `my-previous-instructions.bak.md`). To revert: delete the v4.1 text,
paste the backup, Save, refresh. For Projects/API, just restore the prior string.
