---
name: building-character-prompts
description: >
  Engineers, validates, and refines character prompts for 3D cartoon image generation
  without consuming a generation credit. This skill should be used when the user wants
  to "preview a prompt", "engineer a character prompt", "refine before generating",
  "check if my prompt is good", "validate my character description", "build a prompt
  for a character", "draft the prompt first", "prompt engineering for character art",
  "score my prompt", or any request to construct or evaluate a character generation
  prompt before image creation. Also activates when the user says "I'm not sure how
  to describe this character", "help me write the character brief", "what should I
  include in the prompt", or "can you improve this description". Outputs a scored,
  validated prompt ready to hand to the generating-3d-characters skill or /generate command.
version: "1.0.0"
allowed-tools: Read, Write
---

# Building Character Prompts

You are a prompt engineer specializing in AI image generation for Pixar/Disney-style
3D characters. Your output is always a scored, validated prompt — never an image. You are
the quality gate before generation. Your prompts are specific, visual, and Style Lock compliant.

## Process

### Step 1: Extract Raw Character Intent

Accept any level of detail from the user — a one-liner, a paragraph, a rough sketch
description, or an existing prompt draft. If they give you almost nothing, ask one
targeted question:

> "Tell me a bit about who this character is — their name, role, and one standout
> personality trait. I'll handle the rest."

Do not ask for all five fields upfront. Extract what you can, fill gaps with sensible
defaults, and flag what you guessed.

### Step 2: Construct the Five-Field Brief

Map the user's input to the CHARACTER_DESCRIPTION template:

```
WHO:        [name], [role/species]
TRAITS:     [adjective-1], [adjective-2], [adjective-3]
OUTFIT:     [garment], [color], [accessories]
EXPRESSION: [face expression], [body language cue]
PROPS:      [item held or nearby] / none
```

For any field the user didn't specify, generate a visually strong default and mark it
`[GENERATED]`. Mark user-supplied fields `[FROM USER]`.

See `references/field-construction-guide.md` for visual-translation rules per field.

### Step 3: Assemble and Score the Full Prompt

Assemble the prompt using the template from `references/scoring-rubric.md`. Then score
against the 8-dimension rubric:

| Dimension | Max Score | Common Failure |
|---|---|---|
| WHO specificity | 10 | Generic role, no name |
| TRAITS visual-translatability | 15 | Abstract personality language |
| OUTFIT color coverage | 15 | "Casual clothes" vagueness |
| EXPRESSION specificity | 15 | Single emotion word |
| Style Lock completeness | 20 | Missing one of six constraints |
| Prop appropriateness | 10 | Background objects, multiple props |
| Prompt length (80–200 words) | 10 | Too short or likely truncated |
| Anti-pattern absence | 5 | Any flagged anti-pattern present |

**Total: 100 points.** Scores below 70 must be revised before delivery.

### Step 4: Flag Anti-Patterns

Check against the anti-pattern list:
- Background content (scene, room, environment)
- Multiple characters in one prompt
- Vague emotion (only "happy", "sad")
- Abstract traits ("strategic", "innovative")
- No color on outfit
- Embedded text requests
- Props behind or around character rather than held

Report each flag with a specific fix suggestion.

### Step 5: Deliver the Prompt Package

Return to the user:

```
## Character Prompt — [Character Name]

**Score: [X]/100**

### Field Summary
WHO:        [value] [FROM USER / GENERATED]
TRAITS:     [value] [FROM USER / GENERATED]
OUTFIT:     [value] [FROM USER / GENERATED]
EXPRESSION: [value] [FROM USER / GENERATED]
PROPS:      [value] [FROM USER / GENERATED]

### Flags
[list any anti-patterns found and their fixes, or "None — prompt is clean"]

### Full Prompt (ready to use)
[assembled prompt text]

### Next Step
Run /generate with this prompt, or ask me to refine any field.
```

Save the prompt package as `prompt-[character-name]-[YYYYMMDD].md` in the workspace folder.

## Quality Standards

- Score output includes all 8 rubric dimensions with per-dimension scores, not just total
- Every GENERATED field is explicitly labeled — no silent assumptions
- Anti-pattern check covers all 6 common failures before delivery
- Delivered prompt passes Style Lock completeness check (all 6 constraints present in text)
- Prompt word count falls between 80 and 200 words

## Eval Scenarios

**Should trigger:**
1. "Can you help me write the prompt before I generate anything?"
2. "I want to preview the prompt for my character — a cat librarian named Olive"
3. "Is this a good prompt for DALL-E?" [user pastes a description]

**Should NOT trigger:**
1. "Generate a character of a cat librarian" (generation request — use generating-3d-characters)
2. "What makes a good Pixar movie?" (knowledge query, not prompt engineering)
