---
description: Edit or generate a variation of an existing character
argument-hint: [image path or character name + change description]
allowed-tools: Read, Write, Bash(zapier:*)
disable-model-invocation: false
---

Gather before editing:

1. **Source image** — file path or URL of the existing character render
2. **What to change** — be specific: outfit color, expression, added prop, background treatment (still Style Lock — no layout changes)
3. **What must NOT change** — list any locked features (face shape, hair, color palette)
4. **Number of variations to generate** (default: 1; max: 4 per call)

Confirm the edit brief. If the user is vague about what to change, ask one follow-up question before proceeding.

Hand off to the **generating-3d-characters** skill with `mode: edit`. The skill will call `Zapier:chatgpt_openai_create_image_edit` with the source image and the delta description. Style Lock constraints still apply — do not override the white background or lighting spec.
