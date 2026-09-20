# Design Brief Template
**For use before any v0 / AI Studio / Claude UI generation**
*Fill this out in ~10 minutes. Paste it as your first prompt. Do not skip sections.*

---

## 1. What Is This

```
Product type:     [ app / tool / dashboard / game / landing page / component ]
Primary user:     [ one sentence: who they are + what they care about ]
Primary job:      [ the one thing they do here most ]
Platform:         [ web / mobile / desktop / responsive ]
Dark mode:        [ yes / no / system ]
AI content:       [ does this show AI-generated content or agent state? yes / no ]
```

**Example — good:**
> Product type: tool | Primary user: Staff engineer reviewing security incidents who needs to triage fast | Primary job: classify and assign alerts | Platform: web | Dark mode: yes | AI content: yes

**Example — bad:**
> "A dashboard for my app users"

---

## 2. Experience Thesis

Answer each in 1–2 concrete sentences. "Clean and modern" is not an answer.

**First 5 seconds:**
> What does the user see? What single emotion does it create?

```
[ your answer ]
```

**Brand in 3 words:**
```
[ word 1 ] / [ word 2 ] / [ word 3 ]
```
*These constrain every color, weight, and spacing decision downstream.*

**What this is NOT:**
```
[ Describe the most common, generic version of this product category ]
[ e.g. "NOT a left sidebar with a card grid and an Inter font dashboard" ]
```

**The one design decision that separates this from that:**
```
[ Be specific. Not "unique layout" — name the actual decision ]
[ e.g. "Command-palette-first navigation instead of persistent sidebar" ]
[ e.g. "Data rendered as a timeline, not a table" ]
[ e.g. "Monochrome with one high-signal accent color only" ]
```

---

## 3. Visual Direction

These 4 pillars constrain every visual token. Pick one per row.

```
Lighting:     [ top-left / top-right / flat / backlit / unlit ]
Temperature:  [ warm / cool / neutral / split warm-cool ]
Density:      [ sparse / balanced / dense / adaptive ]
Material:     [ paper / glass / metal / fabric / void / concrete ]
```

**How to pick:**
- Security / ops tools → cool, flat or unlit, dense, metal or void
- Educational / kids → warm, top-left, balanced, paper or fabric  
- Creative / portfolio → split, backlit, sparse, glass or void
- B2B SaaS / enterprise → neutral, flat, balanced, metal or paper
- Consumer / delight → warm, top-left, sparse, paper or fabric

**Your combination in a sentence:**
```
[ e.g. "Cool, flat light, dense, metal — feels like a Bloomberg terminal with
  better typography. Clinical precision, not friendly warmth." ]
```

---

## 4. Color Signal

Do not pick a color name. Pick a *role* and a *reason*.

```
Primary surface:    [ light / dark / deep dark / off-white / warm gray / cool gray ]
Accent color:       [ hue name + why it fits the brand words from section 2 ]
Accent usage rule:  [ 10% max visible surface — where specifically? ]
Text hierarchy:     [ 3 levels: primary / secondary / tertiary ]
Feedback colors:    [ success / warning / error — standard or custom? ]
```

**Example:**
```
Primary surface:    deep dark (#0f1117 equivalent — not pure black)
Accent color:       electric indigo — precision + intelligence, not aggressive
Accent usage rule:  active states, primary CTA, and one structural line only
Text hierarchy:     #f0f0f0 / #a0a0a8 / #606068
Feedback colors:    standard (green/amber/red) — no reason to differentiate
```

---

## 5. Typography Signal

Two decisions only. Do not pick defaults.

```
Heading font:  [ font name — and why it fits the brand words ]
Body font:     [ font name — usually different from heading ]
Scale:         [ tight / normal / generous ]
Weight range:  [ which weights you'll actually use — max 3 ]
```

**Quick reference — font pairings by mood:**

| Mood | Heading | Body |
|------|---------|------|
| Precise / technical | Inter, DM Sans, IBM Plex Sans | Same or IBM Plex Mono |
| Authoritative / editorial | Fraunces, Playfair Display | Inter, Source Serif |
| Warm / human | Plus Jakarta Sans, Nunito | Inter, DM Sans |
| Brutal / high-impact | Space Grotesk, Syne | Inter |
| Educational / friendly | Nunito, Quicksand | Inter, Open Sans |

*Load max 2 font families. Load only the weights you defined above.*

---

## 6. Layout Signal

```
Navigation model:  [ hub-and-spoke / linear / flat / hierarchical / spatial/canvas ]
Primary layout:    [ full-bleed / centered max-width / split-pane / canvas ]
Max content width: [ 1200px default — change if reason exists ]
Sidebar:           [ none / left / right — default is NONE unless justified ]
```

**If you wrote "left sidebar" above — justify it in one sentence or remove it.**

```
Sidebar justification: [ or DELETE THIS LINE ]
```

---

## 7. Anti-Slop Gates

Check each. If any box is unchecked, fix the decision above before generating.

```
[ ] I have NOT defaulted to a left sidebar without justification
[ ] I have NOT said "card grid" as my primary layout pattern
[ ] I have NOT said "clean and modern" anywhere in this brief
[ ] I have NOT picked Inter + gray palette as my only visual decision
[ ] I have NOT left the accent color undefined or as "blue"
[ ] I have defined what this product is NOT visually
[ ] I have named one specific design decision that separates this from generic
[ ] My 3 brand words actually constrain a downstream decision
```

*If you can't check all 8 — your brief is too vague. The generator will default.*

---

## 8. Generator Prompt Format

Once sections 1–7 are complete, assemble the v0 / AI Studio prompt like this:

```
Build a [product type] for [primary user] whose primary job is [primary job].

VISUAL DIRECTION:
- Mood: [your sentence from section 3]
- Color: [surface] background, [accent] accent used only on [usage rule]
- Type: [heading font] headings, [body font] body, [weight range] weights only
- Layout: [navigation model], [primary layout], no sidebar

HARD RULES (do not break these):
- No left sidebar
- No card grid as primary layout
- No glassmorphism
- No random gradients
- Accent color on max 10% of visible surface

THE ONE THING THAT MAKES THIS NOT GENERIC:
[your answer from section 2 — the specific design decision]

BUILD:
[describe the first screen / component you want generated]
```

---

## 9. Quick Brief — Kinsley Apps Variant

*Pre-filled for Friday educational app work. Adjust per project.*

```
Product type:     educational tool / game
Primary user:     child age 4–8 with adult nearby — wants delight + completion
Primary job:      [ fill per app ]
Platform:         mobile-first responsive web
Dark mode:        no
AI content:       yes — voice, illustrations, generated story content

Experience thesis: Feels like opening a storybook, not launching an app.
                   First emotion: wonder, not utility.

Brand words:      warm / magical / safe

Visual direction:
  Lighting:     top-left (storybook warmth)
  Temperature:  warm
  Density:      sparse (never overwhelming a child)
  Material:     paper (tactile, not glassy)

Color:
  Surface:      warm cream (#fdf8f0 equivalent)
  Accent:       soft coral or golden amber — joyful, not clinical
  Usage:        primary actions and illustrated highlights only

Type:
  Heading:      Nunito (rounded, friendly, legible for young readers)
  Body:         Nunito or Open Sans
  Scale:        generous (larger than adult apps)
  Weights:      400, 600, 800 only

Layout:
  Navigation:   linear (step-by-step, wizard-like for stories)
  No sidebar — ever
  Large touch targets (64px minimum — small hands)

Anti-slop for kids:
  [ ] No adult dashboard patterns leaked in
  [ ] No text-heavy screens
  [ ] Every screen has an illustration or character anchor
  [ ] Completion moments have a delight animation
  [ ] Empty states are never blank — always a character prompt
```

---

## 10. Quick Brief — INT Internal Tool Variant

*Pre-filled for Intinc AppSec / platform tooling. Adjust per project.*

```
Product type:     internal ops / security tool
Primary user:     staff engineer or security analyst — wants fast, zero noise
Primary job:      [ fill per tool ]
Platform:         web desktop-first
Dark mode:        yes (default for security/ops contexts)
AI content:       yes if showing AI analysis results

Experience thesis: Feels like a well-tuned terminal, not a BI dashboard.
                   First emotion: trust and speed, not friendliness.

Brand words:      precise / efficient / authoritative

Visual direction:
  Lighting:     flat / unlit
  Temperature:  cool
  Density:      dense (information-first)
  Material:     metal or void

Color:
  Surface:      #0f1117 (near-black, not pure black)
  Accent:       electric indigo or cyan — intelligence signal, not aggression
  Usage:        active states, primary action, one structural divider only

Type:
  Heading:      Inter or DM Sans
  Body:         Inter or IBM Plex Mono for data/code
  Scale:        tight
  Weights:      400, 500, 600 only

Layout:
  Navigation:   flat (everything one level deep — fast access)
  No decorative sidebar — command palette or top nav only
  Content max-width: 1400px (dense data needs width)

Anti-slop for ops tools:
  [ ] No hero section
  [ ] No marketing card grid
  [ ] No illustration in primary workflow (decoration in onboarding only)
  [ ] Data is the UI — not chrome around data
  [ ] Every error state has a specific recovery action
  [ ] Latency states are designed (skeleton, progress, streaming)
```

---

*Template v1.0 — use before every generator handoff. 10 minutes here saves 45 minutes of prompt iteration.*
