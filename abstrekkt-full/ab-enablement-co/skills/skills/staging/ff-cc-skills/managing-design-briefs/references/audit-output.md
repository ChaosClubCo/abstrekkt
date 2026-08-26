# Audit Generated Output

## When This Runs

User has generated UI output from v0, AI Studio Build, Claude Artifacts, or
Stitch and wants to check it against the design brief before shipping.

## Pre-Flight

1. Identify the source brief. Ask: "Which brief does this output belong to?"
   Load from `Briefs/`.
2. Identify the output. User provides a screenshot, URL, or code file.
   If code, save to `Generated/` for record.

## Audit Checklist

Run every check. Score as PASS / WARN / FAIL.

### Token Compliance

| Token | Brief Value | Output Match? |
|-------|-------------|---------------|
| Surface base | (from brief §4) | |
| Surface raised | | |
| Accent color (HSL) | | |
| Accent usage ≤ 10% | | |
| Text primary | | |
| Text secondary | | |
| Text tertiary | | |
| Heading font | | |
| Body font | | |
| Code font | | |
| Type scale | | |

**How to check accent ≤ 10%:**
Visually estimate or, if code is available, grep for the accent color and count
elements using it vs. total visible elements. More than ~5 accent-colored
elements on a single screen = likely over 10%.

### Anti-Slop Visual Check

```
[ ] No left sidebar that wasn't in the brief
[ ] No card grid that wasn't in the brief
[ ] No glassmorphism / decorative gradients
[ ] No generic spinner (should be skeleton loader with meaningful shape)
[ ] No empty states — every visible state has content
[ ] No "Get Started" / "Welcome" / onboarding hero that wasn't specified
[ ] No Inter headings if brief specified a different heading font
[ ] No default Tailwind violet if brief specified custom accent
```

### State Coverage (if AI content = yes)

Verify all 5 AI content states are implemented:
```
[ ] Idle — contextual content visible, not an empty prompt box
[ ] Processing — inline indicator, not a generic spinner
[ ] Streaming — cursor visible, partial output readable
[ ] Complete — result + confidence signal + action affordances
[ ] Failed — specific error message + recovery CTA
```

### Layout Compliance

```
[ ] Navigation model matches brief (flat / hub-spoke / linear / etc.)
[ ] Content width within brief spec
[ ] Touch targets ≥ 44px (≥ 64px for Kinsley)
[ ] Density matches brief (sparse / balanced / dense / adaptive)
```

### Generator Hallucination Check

Look for elements the generator added that weren't in the brief:
- Extra navigation items
- Decorative illustrations
- Marketing copy
- Feature sections not requested
- Color usage outside the defined palette

List each hallucination. Classify as:
- **Remove** — contradicts the brief
- **Keep if justified** — reasonable addition, but needs brief update
- **Neutral** — doesn't contradict, doesn't add value

## Output

Summary format:

```
## Output Audit — [project name]

Token Compliance:    X/11 PASS
Anti-Slop:           X/8 PASS
State Coverage:      X/5 PASS (or N/A if no AI content)
Layout:              X/4 PASS
Hallucinations:      X found (Y remove, Z keep-if-justified)

Overall:  SHIP / FIX FIRST / REGENERATE

Fixes needed:
1. [specific fix + which token/gate it addresses]
2. ...
```

If REGENERATE: the output is too far from the brief. Suggest re-running the
generator prompt with specific additions to prevent the same drift.
