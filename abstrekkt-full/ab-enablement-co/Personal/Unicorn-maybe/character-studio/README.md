# character-studio

**Pixar/Disney-style 3D cartoon character generation for the Customization Service project lane.**

Generate single characters, batch renders, brand character sets, and dry-run prompt previews — all via OpenAI image generation through Zapier, with strict Style Lock enforcement.

---

## What This Plugin Does

Character-studio turns plain-English character briefs into production-ready Pixar/Disney-style 3D cartoon renders. It enforces a consistent visual language (the Style Lock) so every image you generate looks like it belongs in the same world: white background, soft studio lighting, full body visible, Pixar/Disney 3D render style.

---

## Commands

| Command | Description | When to use |
|---------|-------------|-------------|
| `/generate` | Single character render | One character, immediate output |
| `/generate-batch` | Multiple character renders | 2–10 characters, same or different styles |
| `/generate-set` | Cohesive brand character set | Characters that must feel visually unified |
| `/edit` | Modify an existing render | Change outfit, expression, or accessories |
| `/preview-prompt` | Dry-run prompt builder | See and score a prompt without generating an image |

---

## Skills

| Skill | Role |
|-------|------|
| `generating-3d-characters` | Core render engine: CHARACTER_DESCRIPTION → Style Lock → Zapier OpenAI → validated output |
| `building-character-prompts` | Prompt quality gate: builds, scores, and delivers CHARACTER_DESCRIPTIONs without generating images |
| `managing-character-sets` | Ensemble manager: design tokens, role differentiation, cross-character consistency |

---

## The CHARACTER_DESCRIPTION Format

Every render starts with a 5-field brief:

```
WHO:        [species] [age bracket] [archetype]
TRAITS:     [physical features] + [personality visual signals]
OUTFIT:     [genre] [garment] [max 2 accessories]
EXPRESSION: [face phrase] + [body posture phrase]
PROPS:      [max 2 role-appropriate props — optional]
```

---

## The Style Lock

All renders enforce these 6 constraints — they cannot be overridden:

1. **White background** — no gradients, no scenes
2. **Soft studio lighting** — no dramatic shadows
3. **Full body visible** — no bust crops or portrait framing
4. **Character centered** — no extreme off-center compositions
5. **Slight 3/4 angle** — no full profile or full frontal
6. **Pixar/Disney 3D render style** — no anime, pixel art, watercolor, or photorealism

---

## Required Connectors

This plugin uses Zapier to call OpenAI image generation. Two Zapier tools are required:

| Tool | Purpose | DALL-E model |
|------|---------|--------------|
| `chatgpt_openai_generate_an_image` | New character renders | DALL-E 3 |
| `chatgpt_openai_create_image_edit` | Editing existing renders | DALL-E 2 |

**Setup:** Connect your Zapier account in Cowork settings. No additional configuration required — the plugin calls these tools directly.

---

## Output Files

All outputs are saved to your workspace folder with this naming convention:

| Type | Filename pattern |
|------|-----------------|
| Single render | `character-[name]-[YYYYMMDD]-v[N].png` |
| Batch render | `batch-[name]-[YYYYMMDD]-[N].png` |
| Character set image | `[brand]-[role]-[YYYYMMDD]-v[N].png` |
| Character set package | `[brand]-character-set-[YYYYMMDD].md` |
| Prompt preview | `prompt-[character-name]-[YYYYMMDD].md` |

---

## Reference Files

| File | Purpose |
|------|---------|
| `references/anti-patterns.md` | Cross-skill failure patterns and fixes |
| `skills/generating-3d-characters/references/style-lock-spec.md` | All 6 Style Lock constraints with edge cases |
| `skills/generating-3d-characters/references/prompt-templates.md` | Fully worked example prompts |
| `skills/generating-3d-characters/references/model-selection.md` | DALL-E 3 vs DALL-E 2 decision guide |
| `skills/generating-3d-characters/references/consistency-rules.md` | Anti-pattern checklist and batch rules |
| `skills/building-character-prompts/references/field-construction-guide.md` | Per-field visual translation rules |
| `skills/building-character-prompts/references/scoring-rubric.md` | 8-dimension, 100-point prompt scoring rubric |
| `skills/managing-character-sets/references/design-token-system.md` | The 5 Design Tokens and combination rules |
| `skills/managing-character-sets/references/role-differentiation-guide.md` | Differentiation axes and ensemble configurations |

---

## Extending a Character Set

To add a new character to an existing set:
1. Run `/preview-prompt` and include the existing set's Design Token values
2. Confirm the new character's role and differentiation axes against the existing roster
3. Score the prompt (≥70 required)
4. Run `/generate` to produce the render

---

## Project Lane

**Customization Service** — Multi-tenant SaaS, $300K–$500K Y1 target.

Stack: Vercel, Supabase, Stripe, Cloudflare, Redis.
Security: Multi-tenant RLS, PCI-DSS-aware.

---

## Author

Kyle Rosebrook — kyle-os / Customization Service lane

