# Brief to Code via Stitch

## When This Runs

User wants to take a completed design brief and turn it into a live artifact
using Google Stitch (or an equivalent code-generation pipeline). This bridges
the gap between "brief is done" and "code exists."

## Pre-Flight

1. **Brief must be audit-clean.** Run the check-brief.md reference guide if not already done.
   All anti-slop gates must pass. Do not send a brief with failures to Stitch.

2. **Generator prompt must be extracted.** Run the generator-prompt.md reference guide
   if not already done.

3. **Identify the target:**
   - Stitch (Google) → full page / multi-component output
   - v0 (Vercel) → single component or page
   - Claude Artifacts → single-file React/HTML

4. **Confirm lane tokens are loaded.** The generator prompt should already
   contain the correct tokens, but double-check against SKILL.md before handoff.

## Stitch-Specific Pipeline

### Step 1 — DESIGN.md Preparation

If using the `design-md` skill to feed Stitch, ensure the DESIGN.md contains:

```
# [Project Name] Design System

## Surface Tokens
(from brief §4 — exact hex values)

## Accent System
(HSL value, usage rule, dim/glow variants)

## Typography
(font families, weights, scale — from brief §5)

## Layout
(nav model, content width, sidebar decision — from brief §6)

## Component Patterns
(from brief §8 if present — states, density, interaction model)

## Anti-Slop Constraints
(converted to Stitch-friendly "DO NOT" list)
```

### Step 2 — Stitch Prompt Assembly

Combine the generator prompt (from the generator-prompt.md reference guide) with
Stitch-specific instructions:

```
[Generator prompt from brief]

STITCH-SPECIFIC:
- Output as a single HTML file with inline CSS and JS
- Use CSS custom properties for all design tokens
- Include dark mode only (no light mode toggle)
- Font loading: use Google Fonts links for [heading font] and [body font]
- Responsive: panel width constraints [from brief §6]
- No external dependencies unless specified
```

### Step 3 — Generation

Paste into Stitch. Generate.

### Step 4 — Output Audit

Immediately run the audit-output.md reference guide on the generated output.
Do not ship without an audit pass.

### Step 5 — Save Artifacts

- Save the generated code to `Generated/[project]-stitch-v[N].html`
- Save the audit results alongside: `Generated/[project]-stitch-v[N]-audit.md`
- Never overwrite — always version.

## Iteration Loop

If the audit finds issues:

1. Classify fixes as **token fix** (wrong color/font) vs. **structural fix**
   (wrong layout/nav/component).
2. Token fixes → edit the generated code directly, re-audit.
3. Structural fixes → update the generator prompt with more specific constraints,
   regenerate, re-audit.
4. Max 3 regeneration cycles. If still failing after 3 → the brief needs
   revision, not the prompt. Go back to the check-brief.md reference guide.

## Integration with stitch-loop Skill

If the `stitch-loop` skill is active, this reference file provides the design
constraints that feed into each loop iteration. The stitch-loop skill handles
the autonomous build cycle; this file ensures each iteration stays on-brand.

Handoff to stitch-loop:
1. Provide DESIGN.md (from Step 1 above)
2. Provide SITE.md (page structure, content, navigation)
3. stitch-loop handles iteration; this skill handles token enforcement
