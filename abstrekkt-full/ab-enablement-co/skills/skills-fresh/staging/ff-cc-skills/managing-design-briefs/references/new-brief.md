# New Brief Procedure

## When This Runs

User wants to create a design brief for a new project, component, panel, tool,
or extension. This file is the step-by-step procedure. The actual template lives
at `Briefs/design-brief-template.md`.

## Pre-Flight

1. **Confirm project lane.** Ask: "Which lane — INT, Product, or Sales/SPIKE?"
   - INT → ops/security defaults (dark, dense, void/metal, flat nav)
   - Product → check if Kinsley (warm, paper, Nunito) or FlashFusion (void, violet)
   - Sales/SPIKE → this is proposal work, not UI. Redirect to proposal-studio or
     intinc-doc-generator. Do not generate a design brief.

2. **Scope gate.**
   - Panel / tool / component / extension → proceed with this file directly.
   - Full app / new product / Kinsley app → run `elite-ui-design` skill Phase 0–2
     first (experience thesis + design system), then return here for the brief.

3. **Check for existing brief.** Search `Briefs/` for `[project]-brief-*.md`.
   If one exists, ask: "A brief already exists (v[N]). Create a new version or
   edit the existing one?"

## Procedure

Walk the user through each section of `Briefs/design-brief-template.md`:

### Section 1 — What Is This
- Require: product type, primary user (one sentence), primary job, platform,
  dark mode, AI content flag.
- Reject vague answers. "A dashboard for users" → push back, ask for specifics.

### Section 2 — Experience Thesis
- Require all 4 sub-answers: first 5 seconds, brand in 3 words, what this is NOT,
  one specific design decision.
- If user says "clean and modern" → stop. Explain why that's a non-answer and
  ask them to describe the specific emotion or mechanic instead.
- The 3 brand words must constrain downstream decisions. Test: "Would this word
  eliminate at least one color, font, or layout choice?" If no, it's too vague.

### Section 3 — Visual Direction
- Require: lighting, temperature, density, material.
- Offer the quick-reference mood map from the template if user is stuck.
- Require the "combination in a sentence" — this becomes the generator prompt's
  mood line.

### Section 4 — Color Signal
- Non-Kinsley projects: default to locked tokens (see SKILL.md Locked Design Tokens).
  Ask if they want to deviate — if yes, require HSL values and a written reason.
- Kinsley: warm cream surface, soft coral or golden amber accent.
- Accent usage rule is mandatory. "Where specifically?" must be answered.

### Section 5 — Typography
- Non-Kinsley: default to Space Grotesk headings + Inter body.
  Deviation requires written reason.
- Kinsley: Nunito headings + Nunito or Open Sans body.
- Max 3 weights. No system fonts.

### Section 6 — Layout
- Require navigation model choice with justification.
- If user writes "left sidebar" → require one-sentence justification or remove it.
- Default: no sidebar. Command palette as primary nav for panels/tools.

### Section 7 — Anti-Slop Gates
- Run all 8 checks from the template against the completed sections.
- If any gate fails → stop, point to the specific section that needs fixing.
- Do not proceed to generator prompt assembly until all 8 pass.

### Section 8 — Generator Prompt
- Assemble from sections 1–7 using the template format in Section 8.
- Include the HARD RULES block.
- Include the "ONE THING THAT MAKES THIS NOT GENERIC" line.
- If AI content = yes, include the AI content states block.

## Output

Save the completed brief as `Briefs/[project]-brief-v1.md`.
Never overwrite — always increment version number.
Offer to extract the generator prompt separately via the generator-prompt.md reference guide.
