# Audit Existing Brief

## When This Runs

User has a completed brief and wants to verify it's ready for generator handoff.

## Procedure

### 1. Load the Brief

Read the specified file from `Briefs/`. If no file specified, list available
briefs and ask which one.

### 2. Completeness Check

Verify every section is filled. Flag any blank or placeholder answers:

| Section | Required Fields |
|---------|----------------|
| 1. What Is This | product type, primary user, primary job, platform, dark mode, AI content |
| 2. Experience Thesis | first 5 seconds, brand words (3), what this is NOT, one specific decision |
| 3. Visual Direction | lighting, temperature, density, material, combination sentence |
| 4. Color Signal | primary surface, accent (HSL), accent usage rule, text hierarchy (3 levels) |
| 5. Typography | heading font + reason, body font, scale, weight range (max 3) |
| 6. Layout | navigation model, primary layout, max content width, sidebar decision |
| 7. Anti-Slop Gates | all 8 checked |

### 3. Anti-Slop Gate Re-Run

Run all 7 gates from SKILL.md against the brief content:

```
[ ] No "clean and modern" language anywhere in the brief
[ ] Accent defined as HSL value — not a color name like "blue" or "violet"
[ ] One named decision separating this from the category default
[ ] Navigation model chosen and justified
[ ] No sidebar without a written one-sentence justification
[ ] Every state defined — nothing blank, nothing waiting
[ ] Generator prompt would not pass "build me a dashboard" test
```

If any gate fails: report which gate, quote the offending text, suggest a fix.

### 4. Token Consistency Check

- If non-Kinsley: verify tokens match locked values in SKILL.md.
  Flag any deviation. Deviation is allowed but must have a written justification.
- If Kinsley: verify no violet bleed, no void surface, no Space Grotesk.
- Cross-lane bleed check: does the brief accidentally mix Kinsley warmth with
  INT/Product void? Flag if so.

### 5. Brand Word Constraint Test

For each of the 3 brand words, identify at least one downstream decision it
constrains. If a word doesn't constrain anything, flag it as decorative.

Example:
- "Augmenter" → constrains: adaptive density, tool speaks first (not empty state)
- "Fast" → too vague. What does "fast" eliminate? Nothing. Flag it.

### 6. Generator Prompt Readiness

Check if Section 8 (generator prompt) is assembled. If not, offer to build it
via the generator-prompt.md reference guide.

If assembled, verify:
- HARD RULES block present
- "ONE THING" line present
- AI content states included (if AI content = yes in Section 1)
- No vague instructions ("make it look good", "modern design")

## Output

Report as a checklist:
- Completeness: PASS / FAIL (list missing fields)
- Anti-Slop Gates: PASS / FAIL (list failing gates)
- Token Consistency: PASS / DEVIATED (list deviations + justifications)
- Brand Constraint: PASS / WEAK (list decorative words)
- Generator Ready: YES / NO (list blockers)

If all pass → "Brief is ready for generator handoff."
If any fail → list fixes needed, offer to walk through them.
