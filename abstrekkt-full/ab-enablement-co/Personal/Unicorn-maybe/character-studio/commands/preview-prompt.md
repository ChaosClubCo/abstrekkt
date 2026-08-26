---
description: Preview and refine the generation prompt before rendering
argument-hint: [character concept or existing prompt]
allowed-tools: Read, Write
disable-model-invocation: false
---

Use this command to engineer and validate a prompt before spending a generation credit. Gather:

1. **Character concept** — any level of detail is fine; the skill will fill gaps and flag ambiguities
2. **Target use case** — what is this character for? (influences expression, props, and pose specificity)
3. **Any constraints** — features to avoid, style notes that differ from defaults

Hand off to the **building-character-prompts** skill. It will:
- Construct a full CHARACTER_DESCRIPTION using the WHO/TRAITS/OUTFIT/EXPRESSION/PROPS template
- Score the prompt against the Style Lock spec
- Flag any anti-patterns (e.g. text in frame, background content, vague trait descriptors)
- Return the final prompt for user review

The user can then run `/generate` with the validated prompt or ask for refinements. No image is generated during this command — this is a dry-run/preview step only.
