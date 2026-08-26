# Consistency Rules and Anti-Pattern Checklist

## Pre-Submit Anti-Pattern Check

Run this checklist against the assembled prompt before calling the image generator.
Any FAIL blocks submission — fix the prompt first.

| # | Check | Pass | Fail |
|---|---|---|---|
| 1 | Prompt contains "white background" | ✓ | Add Style Lock suffix |
| 2 | Prompt contains "full body" | ✓ | Add "full body, feet visible" |
| 3 | Prompt contains "slight 3/4 angle" | ✓ | Add angle constraint |
| 4 | Prompt contains "no text" | ✓ | Add "no text, no labels" |
| 5 | No background scene described | ✓ | Remove scene elements |
| 6 | No "multiple characters" language | ✓ | Split into separate calls |
| 7 | Trait descriptors are visual, not abstract | ✓ | Replace with visible behavior |
| 8 | Outfit description has at least one color | ✓ | Specify garment colors |
| 9 | Props are held by character, not placed behind | ✓ | Rephrase as "holding X" |
| 10 | Prompt word count is 80–200 | ✓ | Expand or trim |

## Common Failures and Fixes

### Anti-Pattern: Background Content
**Bad:** "…standing in a kitchen with appliances behind her…"
**Fix:** "…wearing an apron, holding a spatula, white background…"
The rule: describe what the character is wearing and holding, not where they are.

### Anti-Pattern: Multiple Characters in One Prompt
**Bad:** "…Maya and her robot companion Bolt, side by side…"
**Fix:** Generate Maya and Bolt in separate calls. Use managing-character-sets for shared
visual rules.

### Anti-Pattern: Vague Emotion
**Bad:** "…with a happy expression…"
**Fix:** "…wide grin showing teeth, eyebrows raised, arms open in a welcoming gesture…"
Emotion descriptors must translate to specific muscle movements.

### Anti-Pattern: Abstract Personality Traits
**Bad:** "…a strategic, results-oriented executive…"
**Fix:** "…confident, composed, decisive, wearing a charcoal suit with a bold lapel pin…"
DALL-E renders visible attributes, not personality frameworks.

### Anti-Pattern: Outfit Vagueness
**Bad:** "…wearing casual clothes…"
**Fix:** "…wearing a faded denim jacket over a yellow striped t-shirt, khaki joggers,
white canvas sneakers…"

### Anti-Pattern: Text Request
**Bad:** "…with the name 'MAYA' written on her badge…"
**Fix:** Remove text from prompt entirely. Report character name as metadata, not in image.

## Cross-Call Consistency (Batch Runs)

When generating multiple characters in one session:

1. **Lock the style suffix** — use identical Style Lock language across all calls
2. **Match abstraction level** — if Character 1's outfit has 4 descriptors, Character 2 should too
3. **Avoid trait overlap** — if Character 1 is "curious and energetic", Character 2 should
   have distinct traits to maintain visual differentiation
4. **Anchor shared palette** — if the set has a brand color (e.g. "primary accent: coral"),
   include it consistently in each character's outfit description

See `managing-character-sets` skill for full brand consistency workflow.
