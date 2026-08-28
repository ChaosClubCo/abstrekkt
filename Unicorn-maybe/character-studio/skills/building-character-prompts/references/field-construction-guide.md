# Field Construction Guide — building-character-prompts

Visual-translation rules for each of the five CHARACTER_DESCRIPTION fields.
Turning user intent into prompt-ready language that the Style Lock and DALL-E 3 can act on.

---

## Field 1: WHO

**Purpose:** Establishes species, age bracket, and archetype in one sentence.

### Accepted Species
- Human (default)
- Anthropomorphic animal (must specify species: fox, dog, bear, rabbit, cat, bird, etc.)
- Fantasy humanoid (elf, dwarf, goblin, dragon-kin)
- Robot/mech (must specify material: metal, plastic, soft-vinyl)
- Hybrid (specify dominant form first: "fox-human hybrid, mostly fox")

### Age Bracket Language
Use these exact phrases — DALL-E 3 responds predictably to these:
| User says | Use in prompt |
|-----------|---------------|
| baby / infant | "toddler-aged" |
| kid / child | "young child, approximately 5–8 years old" |
| tween | "preteen, approximately 10–12 years old" |
| teen | "teenage, approximately 14–17 years old" |
| young adult | "young adult in their mid-twenties" |
| adult (default) | "adult" |
| middle-aged | "middle-aged adult" |
| elderly / old | "elderly, approximately 70+ years old" |

### Archetype Phrase Examples
- "cheerful hero"
- "wise mentor"
- "mischievous sidekick"
- "determined athlete"
- "gentle giant"
- "curious inventor"
- "playful villain"
- "stoic guardian"

**Construction rule:** `[age bracket] [species] [archetype]`
**Example:** "Young child anthropomorphic golden retriever, cheerful hero"

### WHO Anti-Patterns
- ❌ "a guy" → too vague; ask for archetype
- ❌ "realistic human" → conflicts with Style Lock; remove "realistic"
- ❌ Age numbers without bracket mapping → "a 9 year old" → map to "young child, approximately 8–10 years old"

---

## Field 2: TRAITS

**Purpose:** Physical distinguishing features and personality visual signals.

### Physical Trait Categories
Build in this order: (1) body type, (2) primary color or fur/skin tone, (3) eyes, (4) distinguishing mark

**Body type vocabulary:**
- small and round, stocky and muscular, slender, petite, broad-shouldered, lanky

**Eye vocabulary (DALL-E 3 responsive):**
- large expressive eyes, sparkly eyes, narrowed determined eyes, wide curious eyes, sleepy half-lidded eyes

**Distinguishing marks (use sparingly — max 1):**
- freckles, birthmark, scar (describe shape/location), glasses, eyepatch, mechanical eye

### Personality Visual Signals
These translate personality into visible cues:
| Personality | Visual signal |
|-------------|---------------|
| Cheerful | warm skin/fur tones, wide smile, rosy cheeks |
| Mysterious | cooler tones, shadowed brow, asymmetric detail |
| Energetic | bright saturated colors, dynamic posture hint |
| Wise | silver hair accent, calm expression, deep-set eyes |
| Mischievous | slightly raised eyebrow, smirk, bright eyes |
| Determined | set jaw, focused gaze, strong posture |

### TRAITS Anti-Patterns
- ❌ "beautiful" → too abstract; translate to specific features
- ❌ "scary" → add visual specifics: sharp teeth, pale fur, glowing eyes
- ❌ More than 4 physical descriptors → cognitive overload for the model; prioritize

---

## Field 3: OUTFIT

**Purpose:** Clothing that communicates role, world, and tone.

### Outfit Construction Formula
`[genre/world] [role-signal garment] [1–2 accessories]`

**Genre vocabulary:**
- contemporary casual, contemporary professional, fantasy medieval, sci-fi futuristic, historical period, athletic/sportswear, formal/gala

**Role-signal garment examples:**
- Hero: tunic with belt, cape, armor breastplate
- Professional: blazer, lab coat, chef's apron, tool vest
- Athletic: jersey, tracksuit, sports kit
- Mentor: robes, cardigan, travel coat
- Villain: asymmetric jacket, dark longcoat

**Accessories (max 2):**
Backpack, satchel, hat (specify type), goggles, scarf, gloves, badge/emblem, staff/wand, weapon (holstered only — never drawn)

### Color Coordination Rules
- Outfit colors should complement, not clash with, TRAITS fur/skin tones
- Max 3 colors in outfit palette
- One accent color is enough; use it on accessories
- Avoid pure white outfits — blends with white background; use off-white or ivory

### OUTFIT Anti-Patterns
- ❌ "cool clothes" → non-actionable; ask or generate specific garment
- ❌ Pure white outfit → substitute off-white, cream, or ivory
- ❌ More than 3 accessories → visual noise; cut to 2
- ❌ Weapons drawn/visible → describe as holstered or sheathed

---

## Field 4: EXPRESSION

**Purpose:** Locking the emotional read of the face and body.

### Expression Vocabulary (DALL-E 3 reliable)

**Face:**
| Emotion | Prompt phrase |
|---------|---------------|
| Happy | "wide warm smile, cheeks slightly raised" |
| Determined | "set jaw, focused forward gaze" |
| Curious | "one eyebrow raised, head tilted slightly" |
| Surprised | "wide eyes, mouth slightly open" |
| Calm | "gentle closed-mouth smile, relaxed brow" |
| Playful | "one eye squinted in a wink, grin" |
| Confident | "slight smirk, chin up" |
| Sad | "downturned mouth, soft eyes" |

**Body:**
- "standing upright, confident posture"
- "weight on one hip, relaxed"
- "arms at sides, open stance"
- "one hand on hip"
- "arms slightly raised, ready"

### EXPRESSION Construction Rule
Face phrase + body phrase. Do not add gestures that hide the face (e.g., hand over mouth).

### EXPRESSION Anti-Patterns
- ❌ "looking cool" → translate: "slight smirk, chin up, arms crossed loosely"
- ❌ Covering face with hands → blocks read; use only face-open gestures
- ❌ Running or jumping pose → conflicts with Style Lock full-body centered; use static poses

---

## Field 5: PROPS

**Purpose:** Optional objects that tell a story about the character's role or world.

### Prop Rules
- Max 2 props per render
- Props should be clearly visible but not blocking the character's face or torso
- Props should be held or nearby — not floating or stacked
- Size: prop should be recognizable at 1024×1024; avoid micro-detail props

### Prop Vocabulary by Archetype
| Archetype | Suggested props |
|-----------|-----------------|
| Hero | glowing sword (sheathed), magical orb, shield on back |
| Inventor | gear/wrench, blueprint scroll, small robot companion |
| Athlete | ball (sport-specific), water bottle, trophy |
| Mentor | open book, staff, magnifying glass |
| Chef | ladle, ingredient basket, small pot |
| Villain | sealed vial, chess piece, folded map |
| Musician | instrument (guitar, violin, drums), music sheet |
| Doctor | stethoscope, clipboard, small bag |

### PROPS Anti-Patterns
- ❌ More than 2 props → visual clutter
- ❌ Prop identical in color to background (white) → give props a distinct color
- ❌ Small text on props (signs, labels) → DALL-E 3 text rendering is unreliable; omit text props
- ❌ Props that obscure the full-body view → position them at sides or in hands at hip level

---

## Field Assembly Order

When assembling the full prompt, use this order:

1. WHO sentence
2. TRAITS sentence(s)
3. OUTFIT sentence(s)
4. EXPRESSION sentence
5. PROPS sentence (if present)
6. Style Lock block (appended automatically by `generating-3d-characters`)

**Example assembly:**
```
Young child anthropomorphic golden retriever, cheerful hero archetype.
Round body, warm golden fur, large sparkly brown eyes, small freckles across the nose.
Wearing a contemporary casual red hoodie with a yellow star emblem, blue shorts, and small backpack.
Wide warm smile, cheeks slightly raised, standing upright with confident open posture.
Holding a glowing lantern in one hand.
```

