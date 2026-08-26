# Token Drift Check

## When This Runs

Periodic check or on-demand audit to verify that generated outputs, live
artifacts, and briefs haven't drifted from the locked design tokens in SKILL.md.
Run this when something "looks off" or as a scheduled hygiene pass.

## What Is Token Drift

Token drift happens when:
- A generator substitutes a close-but-wrong value (e.g., Tailwind violet-500
  instead of the locked hsl(262 83% 68%))
- A manual code edit changes a token without updating the brief
- A brief uses old token values from before a token update
- Kinsley warmth bleeds into INT/Product artifacts (or vice versa)
- A font fallback kicks in because the custom font wasn't loaded

## Procedure

### 1. Establish Source of Truth

Load the Locked Design Tokens block from SKILL.md. This is the canonical
reference. Everything else is checked against it.

```
Surface:   #0a0a0f / #111118 / #18181f
Border:    #2a2a38 / #1e1e28
Accent:    hsl(262 83% 68%)
Text:      #f0f0f5 / #9898a8 / #52525e
Heading:   Space Grotesk 700
Body:      Inter 400/500
Code:      IBM Plex Mono
Scale:     11 / 13 / 14 / 16 / 20px
```

### 2. Check Briefs

For each brief in `Briefs/`:

```
[ ] Surface values match locked tokens (or deviation is documented)
[ ] Accent HSL matches locked value (or deviation is documented)
[ ] Text hierarchy matches locked values
[ ] Heading font = Space Grotesk (non-Kinsley) or Nunito (Kinsley)
[ ] Body font = Inter (non-Kinsley) or Nunito/Open Sans (Kinsley)
[ ] No cross-lane bleed (Kinsley warmth in INT, or INT void in Kinsley)
```

### 3. Check Generated Outputs

For each file in `Generated/`:

**If HTML/CSS — grep for drift:**
```
Common drift patterns to search for:
- #8b5cf6 or #7c3aed → Tailwind violet (should be hsl(262 83% 68%))
- #6366f1 → Tailwind indigo (wrong hue)
- font-family: system-ui → font fallback (should be explicit font)
- font-family: sans-serif → generic fallback
- bg-gray-900 → Tailwind gray (should be #0a0a0f)
- bg-slate-900 → Tailwind slate (should be #0a0a0f)
- text-white → pure white (should be #f0f0f5)
- text-gray-400 → Tailwind gray (should be #9898a8)
```

**If React/JSX — also check:**
```
- Inline styles with hardcoded colors instead of CSS custom properties
- Tailwind classes that approximate but don't match locked tokens
- Missing font imports (Google Fonts link or @font-face)
```

### 4. Classify Drift

For each drift instance found:

| Severity | Definition | Action |
|----------|-----------|--------|
| **Critical** | Wrong accent hue (different color entirely) | Fix immediately |
| **High** | Wrong surface value (too light/dark) | Fix before shipping |
| **Medium** | Close-but-wrong (Tailwind approx instead of exact) | Fix in next pass |
| **Low** | Font weight off by one step (400 vs. 500) | Note, fix if convenient |
| **Cross-lane** | Kinsley tokens in INT or vice versa | Fix immediately |

### 5. Fix Drift

- **In generated code:** Edit directly. Update the audit record in `Generated/`.
- **In briefs:** Create a new version with corrected tokens. Archive the old one.
- **In SKILL.md:** Only if the drift reveals the locked tokens themselves need
  updating. In that case, use the update-tokens.md reference guide for the full
  change procedure.

## Quick Drift Scan Command

If code files are available locally, run this scan:

```bash
# Surface drift
grep -rn '#1a1a2e\|#0d1117\|#161b22\|bg-gray-900\|bg-slate-900' Generated/

# Accent drift
grep -rn '#8b5cf6\|#7c3aed\|#6366f1\|violet-500\|violet-600\|indigo-500' Generated/

# Font drift
grep -rn 'system-ui\|sans-serif\|Arial\|Helvetica' Generated/

# Pure white/black drift
grep -rn '#ffffff\|#000000\|text-white\|bg-black' Generated/
```

## Output

```
## Token Drift Report — [date]

Briefs checked:     N
Outputs checked:    N
Drift instances:    N (X critical, Y high, Z medium, W low)
Cross-lane bleed:   YES / NO

Fixes applied:      N
Fixes remaining:    N

Details:
1. [file] — [token] — [expected] → [found] — [severity] — [status]
2. ...
```

## Scheduling

Recommended cadence:
- After every generator output (immediate)
- Weekly if actively building UI (Friday hygiene pass)
- After any token update (mandatory — run on all briefs + outputs)
