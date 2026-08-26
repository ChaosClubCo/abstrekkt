---
description: Generate multiple character renders in one run
argument-hint: [character descriptions or count]
allowed-tools: Read, Write, Bash(zapier:*)
disable-model-invocation: false
---

Before starting a batch run, collect:

1. **How many characters?** (max 10 per batch; confirm if user asks for more)
2. **Character briefs** — for each character: name/role, traits, outfit, expression (use a numbered list or accept a CSV)
3. **Shared context?** — are these characters from the same universe or brand? (affects consistency rules the skill will apply)
4. **Output naming convention** (default: `character-01.png`, `character-02.png` …)

Confirm the full list with the user before proceeding.

Hand off to the **generating-3d-characters** skill with the full batch manifest. The skill will iterate through each character, apply the Style Lock on every call, and save each render with the agreed naming convention.
