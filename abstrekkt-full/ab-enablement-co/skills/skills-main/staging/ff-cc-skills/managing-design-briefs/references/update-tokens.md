# Update Locked Tokens

## When This Runs

User wants to change a locked design token (surface, accent, text, typography,
scale, or nav model) across the system. This is a controlled change — tokens are
locked for a reason and changes propagate to all briefs and generator prompts.

## Why This Is Gated

Locked tokens exist in 3 places that must stay in sync:
1. `SKILL.md` — the source of truth in the Locked Design Tokens block
2. Every brief in `Briefs/` that references these tokens
3. Every generator prompt extracted from those briefs

Changing one without the others creates drift. This procedure prevents that.

## Procedure

### 1. Identify the Change

Ask:
- Which token? (surface, border, accent, text, heading font, body font, code font, scale, nav)
- What's the new value? (require specific HSL/hex/font name — not color names)
- Why? (one sentence justification — this gets recorded)

### 2. Scope the Impact

Determine which lanes are affected:
- **All non-Kinsley** — if changing a core token (surface, accent, text, typography)
- **Kinsley only** — if changing Kinsley-specific tokens
- **Single project** — if this is a project-specific override, not a system change

If single project: this is NOT a token update — it's a brief deviation. Redirect
to the check-brief.md reference guide and note the deviation there instead.

### 3. Update SKILL.md

Edit the Locked Design Tokens block in SKILL.md with the new value.
Add a comment noting the change date and reason:

```
Accent:    hsl(265 80% 65%) — electric violet (updated 2026-03-17: warmer shift
           for better contrast on overlay surfaces)
```

### 4. Update Affected Briefs

List all briefs in `Briefs/` that reference the old token value.
For each:
- Create a new version: `[project]-brief-v[N+1].md`
- Update the token value
- Move the old version to `Archive/`
- Note in the new version: "Token updated: [which token] from [old] to [new]"

### 5. Flag Generator Prompts

Any previously extracted generator prompts are now stale. Note this to the user:
"Generator prompts extracted before this change need to be re-extracted.
Run the generator-prompt.md reference guide on each updated brief."

### 6. Cross-Lane Bleed Check

After the update, verify:
- Kinsley tokens are unchanged (unless this was a Kinsley-specific update)
- INT/Product tokens are unchanged (unless this was an INT/Product update)
- No accidental bleed between lanes

## Token Change Log

Maintain at the bottom of SKILL.md or as a separate the token-changelog.md reference guide:

```
| Date | Token | Old Value | New Value | Reason | Affected Briefs |
|------|-------|-----------|-----------|--------|-----------------|
| ... | ... | ... | ... | ... | ... |
```

## Output

Confirm:
1. SKILL.md updated
2. N briefs versioned and updated
3. Old versions archived
4. Generator prompt re-extraction flagged
5. Cross-lane bleed check passed
