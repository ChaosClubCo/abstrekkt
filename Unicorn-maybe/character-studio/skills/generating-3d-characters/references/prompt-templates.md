# Prompt Templates and Worked Examples

## The CHARACTER_DESCRIPTION Template

```
[Name], [role/species], [trait-1], [trait-2], [trait-3], wearing [outfit with color details],
[expression] expression, [body language], [prop or "no props"], full body, white background,
soft studio lighting, slight 3/4 angle, Pixar/Disney 3D animation style, high detail,
clean render, no text, 1024x1024
```

## Field Construction Rules

**WHO**: Always lead with a proper name if one exists. Include role or species.
- Good: "Maya, a young astronaut" / "Rex, a golden retriever puppy chef"
- Bad: "a character who is an astronaut" (vague, no anchor)

**TRAITS**: Use personality adjectives that translate to visual expression, not abstract values.
- Good: "curious, determined, warm" → translates to raised eyebrow, forward lean, soft smile
- Bad: "strategic, synergistic" → DALL-E cannot render abstract business concepts

**OUTFIT**: Be specific about color, material, and key details. Avoid "casual" or "professional."
- Good: "orange jumpsuit with yellow racing stripes, white sneakers, small pilot wings badge"
- Bad: "work clothes" / "something professional"

**EXPRESSION**: Pair a face expression with a body language cue.
- Good: "wide grin, arms slightly raised in excitement"
- Bad: "happy" (underspecified — any expression reads as happy)

**PROPS**: Optional but adds memorability. Keep to 1–2 items maximum.
- Good: "holding a steaming coffee mug in both hands"
- Bad: "surrounded by lots of coffee equipment" (background content, Style Lock violation)

## 6 Worked Examples

### 1. Child Hero (App Mascot)
```
Milo, a curious 8-year-old inventor, bright-eyed, energetic, optimistic, wearing a
navy blue lab coat with too-long sleeves, orange safety goggles pushed up on forehead,
red high-tops, wide excited grin leaning slightly forward, holding a small glowing
gadget in one hand, full body, white background, soft studio lighting, slight 3/4 angle,
Pixar/Disney 3D animation style, high detail, clean render, no text, 1024x1024
```

### 2. Animal Professional (Mascot)
```
Biscuit, a golden retriever chef, warm, enthusiastic, reliable, wearing a white chef's
toque and matching apron with a small paw-print embroidery, rolling pin tucked under
one arm, confident smile with tongue slightly out, tail raised, full body, white
background, soft studio lighting, slight 3/4 angle, Pixar/Disney 3D animation style,
high detail, clean render, no text, 1024x1024
```

### 3. Elderly Mentor Character
```
Professor Ada, a wise elderly woman scientist, thoughtful, kind, sharp, silver braided
hair pinned up, wire-rimmed round glasses, lilac cardigan over white blouse, one hand
raised with index finger pointing up mid-explanation, warm knowing smile, holding a
small notebook in other hand, full body, white background, soft studio lighting,
slight 3/4 angle, Pixar/Disney 3D animation style, high detail, clean render, no text, 1024x1024
```

### 4. Villain/Antagonist (Playful)
```
Baron Fizz, a dramatic fizzy soda can villain, theatrical, boastful, mischievous, silver
cylindrical body with expressive cartoon face, tiny monocle, long dramatic cape in deep
red with gold trim, one hand extended dramatically, eyebrow raised in a smirk,
full body, white background, soft studio lighting, slight 3/4 angle, Pixar/Disney 3D
animation style, high detail, clean render, no text, 1024x1024
```

### 5. Teen Athlete
```
Jordan, a teenage basketball player, confident, focused, playful, wearing purple and gold
jersey number 23, matching shorts, high-top white sneakers, one hand spinning a
basketball on finger, grinning sideways at viewer, weight shifted to one hip,
full body, white background, soft studio lighting, slight 3/4 angle, Pixar/Disney 3D
animation style, high detail, clean render, no text, 1024x1024
```

### 6. Fantastical Creature
```
Ember, a small fire elemental, fierce, loyal, curious, glowing orange-red body with
ember-spark freckles, tiny flame crown on head, large luminous amber eyes, arms
crossed with a determined pout softened by a slight grin, tail curled upward, full body,
white background, soft studio lighting, slight 3/4 angle, Pixar/Disney 3D animation
style, high detail, clean render, no text, 1024x1024
```

## Prompt Length Target

- Minimum: 80 words (enough to anchor all five fields)
- Maximum: 200 words (DALL-E truncates beyond ~250 tokens)
- Sweet spot: 120–160 words
