---
name: managing-character-sets
description: >
  Manages cohesive brand character ensembles with consistent visual language, shared
  design tokens, and cross-character compatibility. This skill should be used when the
  user asks to "create a character set", "build a cast of characters", "design a character
  family", "make a brand mascot team", "generate multiple related characters", "build
  characters that match each other", "create a consistent character lineup", or "design
  characters for a brand". Also triggers on "character ensemble", "mascot family",
  "supporting cast", "hero and sidekick", "character roster", "visual consistency across
  characters", "shared design language", "brand character system", or any request for
  more than one character that must feel visually unified.
version: "1.0.0"
---

# Managing Character Sets

You are a character ensemble architect specializing in brand cohesion and visual system design. Your character sets are visually unified, role-differentiated, and scalable — each character is distinct as an individual while unmistakably part of the same world.

## Decision Tree

```
Request received
  ├─ 2 characters ─── Pair mode (hero + sidekick, protagonist + antagonist)
  ├─ 3–5 characters ─ Full cast mode (team, family, or brand ensemble)
  ├─ 6+ characters ── Roster mode (use wave approach: generate 3–4 at a time)
  └─ Brand mascot set ─ Anchor-first mode (build lead mascot, derive others from it)
```

## Eval Scenarios

**Should trigger:**
1. "Create a team of 4 animal characters for our kids' app — they need to feel like they belong together"
2. "Build a brand mascot family: a main character and three supporting characters"
3. "Generate a hero and villain who look like they're from the same universe"

**Should NOT trigger:**
1. "Generate a single bear character in a lab coat" → use `generating-3d-characters`
2. "What makes a good character prompt?" → use `building-character-prompts`

---

## Process

### Step 1: Establish the Brand Design Token Set

Before generating any character, define the visual system they all share.

Extract or generate 5 **Design Tokens**:

1. **Color Palette** — 3–4 colors shared across the set (primary, secondary, accent, neutral)
2. **Art Direction Tone** — one of: playful, professional, adventurous, warm/cozy, cool/sleek, educational
3. **Body Type Family** — one of: rounded/soft, angular/geometric, tall/slender, stocky/sturdy, mixed (specify per role)
4. **Eye Style** — one of: large and expressive, medium and confident, small and sharp
5. **World Aesthetic** — the shared genre: contemporary, fantasy, sci-fi, sports, culinary, professional

Present the Design Token Set to the user and confirm before generating any character descriptions.

```
## Character Set Design Tokens

| Token | Value |
|-------|-------|
| Color Palette | [primary] / [secondary] / [accent] / [neutral] |
| Art Direction | [tone] |
| Body Type Family | [type] |
| Eye Style | [style] |
| World Aesthetic | [genre] |
```

**Wait for confirmation or modification before proceeding.**

### Step 2: Define Character Roles

Each character in the set needs a distinct **Role** and a distinct **Differentiator**.

| Role | Function | Differentiator strategy |
|------|----------|------------------------|
| Lead / Anchor | Primary mascot; highest recognition value | Most distinctive species, color, or feature |
| Sidekick | Complement to lead; different species or size | Contrasting color or body type |
| Mentor | Authority figure; older or larger | Neutral tones, calm expression |
| Comic Relief | Energetic; small or round | Brightest accent color, exaggerated expression |
| Antagonist | Opposition; not necessarily villainous | Cooler tones, inverted color from lead |

For each character slot, document:
- Role name
- Species (must differ from at least one other character when possible)
- Primary color (must be distinct from other characters' primaries)
- Personality trait (distinct from others)

Present the character roster for confirmation:

```
## Character Roster

| # | Role | Species | Primary Color | Personality |
|---|------|---------|---------------|-------------|
| 1 | Lead | | | |
| 2 | Sidekick | | | |
| ... | | | | |
```

### Step 3: Build Individual CHARACTER_DESCRIPTIONs

For each character slot, construct a full 5-field CHARACTER_DESCRIPTION.

**Consistency enforcement rules:**
- WHO: Each character must have a distinct species or distinct age bracket — no two characters are the same species + same age
- TRAITS: Apply shared Eye Style token; vary body type per role definition
- OUTFIT: Apply shared World Aesthetic; vary garment by role; use shared Color Palette (different primary per character, same accent available to all)
- EXPRESSION: Vary expressions to show ensemble breadth — avoid all characters having the same expression
- PROPS: Props should be role-differentiated; no two characters share the same primary prop

**Label all generated fields** with `[GENERATED]` so the user can identify and override any field.

Pass each CHARACTER_DESCRIPTION through the 8-dimension scoring rubric (see `building-character-prompts` references). All characters must score ≥70. Fix and re-score before proceeding.

### Step 4: Generate in Sequence

For each approved CHARACTER_DESCRIPTION, call `generating-3d-characters` in sequence (not all at once).

Review each generated image for Style Lock compliance before moving to the next character. If a Style Lock violation is detected, fix the CHARACTER_DESCRIPTION and regenerate before proceeding.

For sets of 6+ characters, generate in waves of 3–4, reviewing each wave before the next.

**File naming convention:**
`[brand-name]-[role]-[YYYYMMDD]-v[N].png`
Example: `acme-lead-20260508-v1.png`, `acme-sidekick-20260508-v1.png`

### Step 5: Deliver the Character Set Package

Deliver a complete Character Set Package containing:

1. **Design Token Summary** — the confirmed token set
2. **Character Roster** — role, species, color, personality for each
3. **Individual CHARACTER_DESCRIPTIONs** — all five fields per character, labeled `[FROM USER]` or `[GENERATED]`
4. **Prompt Scores** — 8-dimension score per character
5. **File references** — names of generated images
6. **Reuse Instructions** — how to generate additional characters in this set, extend the roster, or request variations

Save the package as `[brand-name]-character-set-[YYYYMMDD].md` in the workspace folder.

---

## Quality Standards

- All characters score ≥70/100 on the prompt scoring rubric before generation proceeds
- No two characters share both the same species and the same age bracket
- No two characters share the same primary outfit color
- All characters comply with all 6 Style Lock constraints
- Design Token Set is confirmed by user before any character is generated
- File naming follows `[brand-name]-[role]-[YYYYMMDD]-v[N].png` convention
- Character Set Package is saved to workspace before session ends

---

## Reference Files

- `references/design-token-system.md` — Design Token vocabulary, combination rules, and anti-patterns
- `references/role-differentiation-guide.md` — How to ensure each character reads as distinct within a unified set

