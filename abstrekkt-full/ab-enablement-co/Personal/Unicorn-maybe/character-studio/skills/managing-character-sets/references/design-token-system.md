# Design Token System — managing-character-sets

The five Design Tokens that bind a character set into a unified visual language.
Defining them before generating any character prevents costly inconsistency.

---

## Token 1: Color Palette

### Structure
Every character set gets exactly 4 colors:
- **Primary** — the dominant brand color (appears on 1–2 characters' primary outfit elements)
- **Secondary** — a complementary color (appears on 1–2 characters)
- **Accent** — shared highlight color used on accessories across all characters
- **Neutral** — white, cream, grey, or beige — used in all outfits as balance

### Palette Combination Rules
- Primary and secondary must not be adjacent on the color wheel (avoid muddy combinations)
- Accent should be the most saturated of the four
- Neutral must not be pure white — it will disappear against the white background

### Recommended Starting Palettes

| Tone | Primary | Secondary | Accent | Neutral |
|------|---------|-----------|--------|---------|
| Playful / Kids | Coral red | Sky blue | Sunflower yellow | Cream |
| Professional | Navy blue | Forest green | Gold | Light grey |
| Adventurous | Deep purple | Burnt orange | Electric teal | Warm beige |
| Warm / Cozy | Terracotta | Sage green | Dusty rose | Oatmeal |
| Cool / Sleek | Slate blue | Charcoal | Cyan | Off-white |
| Educational | Royal blue | Soft green | Amber | Light lavender |

### Color Anti-Patterns
- ❌ Pure white in palette — invisible against background
- ❌ Pure black — too harsh for Pixar/Disney style; use charcoal or deep navy
- ❌ All warm tones — too little contrast between characters; include at least one cool tone
- ❌ More than 4 colors in the token set — visual coherence breaks down

---

## Token 2: Art Direction Tone

### Tone Definitions

| Tone | Visual signature | Best for |
|------|-----------------|----------|
| **Playful** | Rounded shapes, warm saturated colors, exaggerated expressions, lots of smile | Kids' apps, casual brands, friendly mascots |
| **Professional** | Cleaner lines, muted palette, calm expressions, structured outfits | B2B, healthcare, finance mascots |
| **Adventurous** | Dynamic color contrast, bold accessories, action-ready posture | Sports, gaming, outdoor brands |
| **Warm/Cozy** | Earth tones, soft body proportions, gentle expressions | Food, lifestyle, hospitality |
| **Cool/Sleek** | Cooler palette, sharp accessories, confident posture | Tech, fashion, premium brands |
| **Educational** | Bright but not neon, curious expressions, props related to learning | EdTech, schools, tutoring services |

### Applying Tone Consistently
Every character's EXPRESSION and PROPS should reinforce the tone:
- Playful → exaggerated smiles, fun props (balloons, oversized tools)
- Professional → calm smiles or neutral expression, formal accessories
- Adventurous → determined or excited expression, gear props
- Educational → curious expression, book/tool props

---

## Token 3: Body Type Family

### Body Type Options

| Family | Description | Best character count | Notes |
|--------|-------------|---------------------|-------|
| **Rounded/Soft** | Round head, soft curves, stocky limbs | Up to 6 | Most accessible; reads friendly universally |
| **Angular/Geometric** | Square jaw, sharp edges, defined shapes | Up to 4 | Stronger for professional/sleek tones |
| **Tall/Slender** | Long limbs, narrow torso | Up to 4 | Good for athletic or mentor archetypes |
| **Stocky/Sturdy** | Wide stance, compact body | Up to 6 | Strong for guardian/hero archetypes |
| **Mixed** | Each character gets a role-matched body type | Any count | Requires explicit assignment per character |

### Mixed Mode Assignment Guide
| Role | Recommended body type |
|------|-----------------------|
| Lead | Balanced — not extreme in any direction |
| Sidekick | Smaller or rounder than lead |
| Mentor | Taller or broader than lead |
| Comic Relief | Most rounded or smallest |
| Antagonist | Angular or tallest |

---

## Token 4: Eye Style

### Eye Style Options

| Style | Description | Tone match |
|-------|-------------|------------|
| **Large and expressive** | Takes up significant face proportion; very Disney-esque | Playful, warm, educational |
| **Medium and confident** | Balanced proportion; versatile | Professional, adventurous |
| **Small and sharp** | Narrower; more intense | Cool/sleek, some antagonist characters |

### Eye Style Consistency Rule
All characters in a set must use the same base eye style. Individual variation is allowed only in the emotional state (sparkly vs. focused vs. sleepy) — not the size category.

---

## Token 5: World Aesthetic

### Aesthetic Options and Outfit Implications

| Aesthetic | Genre | Outfit vocabulary |
|-----------|-------|------------------|
| **Contemporary** | Modern real-world | Casual wear, streetwear, professional attire |
| **Fantasy medieval** | Swords and sorcery | Tunics, robes, armor, cloaks |
| **Sci-fi futuristic** | Space age | Jumpsuits, tech-wear, holographic accessories |
| **Sports/Athletic** | Competitive sports | Jerseys, tracksuits, sport-specific gear |
| **Culinary** | Food and hospitality | Aprons, chef hats, kitchen gear |
| **Professional niche** | Specific industry | Industry uniform + accessories (e.g., lab coat + goggles) |

### Cross-Character Consistency
All characters must share the same World Aesthetic. A set with one character in fantasy robes and another in a business suit is incoherent — this is a hard rule.

---

## Token Conflict Detection

Before locking the token set, check for conflicts:

| Conflict | Problem | Fix |
|----------|---------|-----|
| Playful tone + Angular body type | Mismatch — angular shapes read as tense | Switch to Rounded/Soft |
| Professional tone + Large expressive eyes | Minor mismatch — reads young/cute | Switch to Medium and confident |
| Warm/Cozy tone + Cool/Sleek palette | Tonal conflict | Choose one or the other |
| Sports aesthetic + Formal outfit vocabulary | Incoherent world | Align vocabulary to aesthetic |

