# FlashFusion — Gemini Imagen 3 Prompts v2.0
# Updated: 2026-06-11
# Grounded in 4 reference images now in scope:
#   Img1: Brand style guide (energy palette, Orbitron, FF mark)
#   Img2: Enterprise landing page (dark sci-fi, FF orb, circuit nodes)
#   Img3: Beta Tester Army landing page (teal/purple, SaaS dashboard)
#   Img4: Abstract purple/blue fluid waves + blueprint overlay
#
# Prompt formula: [Intent phrase] + [Subject] + [Environment] + [Color spec] + [Style] + [Format]
# Reference: https://blog.google/products-and-platforms/products/gemini/image-generation-prompting-tips/

---

## PROMPT 01 — Fluid Wave Hero Background (Image 4 exact style)
**Asset:** flashfusion.co hero section full-bleed background

```
Generate an image of abstract fluid energy streams flowing diagonally across
a deep dark background. The waves should be smooth and silk-like with sharp
light reflections along their crests, rendered in deep indigo (#5B3DFF) and
vivid violet (#A144FF), with a bright specular highlight running down the
center of each wave in near-white. On the right side, where the waves converge,
overlay a faint technical blueprint — small squares, connection nodes, and
labeled service names like "DATA PIPELINE" and "AUTH SERVICE" in extremely
fine text, barely visible at 10% opacity. The left half should be almost pure
black to create text contrast space. Wide 16:9 cinematic format, photorealistic
render quality, no people, no logos.
```

---

## PROMPT 02 — FF Orb Hero Illustration (Image 2 central element)
**Asset:** Hero section right-column illustration, marketing

```
Generate an image of a glowing energy orb centered in a dark void, containing
the letters "FF" in bold geometric style that radiates light outward. The orb
has two concentric rings orbiting it at different speeds — one in electric cyan
(#00E5FF), one in deep violet (#5B3DFF). Circuit-like data streams extend from
the orb as thin glowing lines toward the edges of the frame, each terminating
in a small node point. The color palette is: deep indigo core, violet mid-ring,
electric cyan outer streaks. Background is pure black with a subtle radial purple
gradient glow behind the orb. Cinematic, photorealistic, sci-fi enterprise
aesthetic. Square format 1:1, no text in the scene.
```

---

## PROMPT 03 — Energy Brand Gradient Splash (Image 1 primary gradient)
**Asset:** Social media backgrounds, email headers, OG cards

```
Generate an image of an abstract energy explosion rendered as a smooth
horizontal gradient sweep. From left to right: deep orange (#FF6A00) igniting
into hot red (#FF2D55), dissolving into vivid purple (#A144FF), then cooling
into electric cyan (#00E5FF) on the right edge. The gradient should feel
like a plasma discharge — not a flat color ramp but a textured, luminous
energy field with subtle particle debris and light wisps. Pure black background
(#000000). Wide 16:9 format, no objects, no text, photo-quality render.
```

---

## PROMPT 04 — FF Lightning Bolt Logo Mark
**Asset:** Favicon reference, icon concepts, social profile avatar

```
Generate an image of a stylized "FF" letterform logo mark on a deep dark navy
square background. The two F letters should be geometric, bold, and slightly
overlapping — rendered with a gradient fill that starts orange-red at the top
left and transitions to electric cyan at the bottom right, passing through
vivid violet in the middle. Add a faint outer glow in violet around the entire
mark. The overall aesthetic is futuristic tech company logo — clean edges,
high contrast, suitable for use as an app icon. 1:1 square, logo-quality
render, no surrounding text.
```

---

## PROMPT 05 — AI Control Room (Image 2 atmosphere)
**Asset:** About page hero, LinkedIn banner, deck backgrounds

```
Generate an image of a futuristic AI operations center viewed from a wide
establishing shot at eye level. The room has no people — only arrays of
holographic displays showing neural network diagrams, workflow pipelines,
and data graphs rendered in violet, orange, and electric cyan. The walls
have circuit-trace patterns etched in faint blue light. The ambient lighting
is cool indigo with warm orange accent glow from specific displays. The
mood should feel like: serious technical infrastructure, not sci-fi fantasy.
Ultra-wide 21:9 panoramic crop, photorealistic, deep atmospheric haze.
```

---

## PROMPT 06 — Brand Color Palette Documentation Visual
**Asset:** design.md header, Figma cover, documentation

```
Generate an image of six distinct glowing color swatches arranged in a
horizontal row against a near-black surface (#0B0B14). From left to right
the colors are: vibrant orange (#FF6A00), hot red (#FF2D55), vivid purple
(#A144FF), deep indigo (#5B3DFF), electric cyan (#00E5FF), and bright blue
(#0077FF). Each swatch is a rounded rectangle with a soft glow bleeding
onto the dark background beneath it. The swatches have a slight 3D depth
as if they are light sources themselves. Clean product photography style,
minimal, technical. Wide 3:1 panoramic format.
```

---

## PROMPT 07 — Glassmorphic Dashboard Card Component
**Asset:** Marketing screenshots, feature section illustrations

```
Generate an image of a floating UI card component seen from a 3/4 perspective
angle. The card has a semi-transparent dark glass surface with blurred content
visible through it, a thin violet glowing border, and inner light reflections
in the top-left corner. Inside the card, show abstract data visualization
elements: a small radial progress chart in electric cyan at 78%, a few metric
numbers in white, and colored status tags in orange and purple. The card
floats above a dark surface that shows its violet glow reflection below.
High-end enterprise SaaS product photography, dramatic depth of field,
dark background, 4:3 format.
```

---

## PROMPT 08 — Neural Network in Fire and Ice
**Asset:** Blog post heroes, newsletter headers, social share images

```
Generate an image of a large-scale neural network graph where the nodes and
connections show visible thermal energy — the "hot" input nodes in the
upper left glow in orange-red, the middle processing layer pulses in
vivid purple, and the output nodes in the lower right emit cool electric
cyan light. The connections between nodes are thin fiber-optic-like lines
that carry visible light pulses. The background is pure void. The graph
extends beyond the frame suggesting massive scale. Cinematic 16:9, dramatic
depth of field, photorealistic render, no text labels.
```

---

## PROMPT 09 — Orbitron Typography Hero (Image 1 wordmark treatment)
**Asset:** Slide deck title slide, event banners, LinkedIn cover

```
Generate an image of the text "FLASHFUSION" in an ultra-bold, geometric
all-caps typeface with letterforms similar to Orbitron or Eurostile, set in
a wide single line. The letters should have a gradient fill transitioning
from orange (#FF6A00) at the F to electric cyan (#00E5FF) at the N, passing
through vivid purple in the middle. The text appears to hover above a pure
black surface, casting a faint gradient glow reflection downward. Add
extremely subtle particle sparks around the letters — tiny bright points,
as if the text is charged with electricity. Wide 16:9 format, typographic
art direction quality, high contrast.
```

---

## PROMPT 10 — Fluid Data Pipeline Isometric
**Asset:** Platform page, technical explainer, product section

```
Generate an isometric illustration of a multi-stage data processing pipeline
viewed from a 45-degree aerial angle. The pipeline has five distinct floating
platform stages connected by glowing fiber conduits that pulse with data.
Stage 1 in orange (#FF6A00), Stage 2 in red (#FF2D55), Stage 3 in purple
(#A144FF), Stage 4 in indigo (#5B3DFF), Stage 5 in cyan (#00E5FF). Each
stage platform is dark with the accent color as its border glow. Particle
streams of corresponding color flow between stages. The background is deep
dark navy with a subtle grid. Editorial illustration quality, 16:9 format.
```

---

## PROMPT 11 — Solo AI Operator at Workstation
**Asset:** About/founder page, consulting landing page

```
Generate a moody documentary-style photograph of a lone technical operator
at a minimal dark desk setup with dual monitors, lit almost entirely by
cool violet and cyan screen glow. The desk is clean — no clutter. One
monitor shows what appears to be an AI agent dashboard with colored nodes.
The room behind is dark, slightly out of focus, with faint LED ambient
light. The figure is seen from behind or from the side — silhouette and
intent, not face. The mood: focused, autonomous, technically elite.
16:9 landscape, photographic grain, cinematic shallow depth of field.
```

---

## PROMPT 12 — Abstract Void Grid with Glow Horizon
**Asset:** Section divider, background texture layer, slide deck base

```
Generate an image of an infinite-perspective grid receding to a vanishing
point at the center-bottom of the frame. The grid lines are extremely fine,
rendered in deep violet at 15% opacity against a pure black background.
At the vanishing point, there is a radial glow that fades from bright
electric cyan (#00E5FF) at the center to deep indigo (#5B3DFF) to total
black at the edges. The grid curves slightly as if it is the floor of a
vast dark space. No objects. No people. Pure spatial atmosphere. Wide
cinematic 16:9, subtle, suitable as a background layer behind text.
```

---

## PROMPT 13 — Capability Icons Illustrated Set
**Asset:** Services section card icons, feature list

```
Generate an image showing six distinct icon illustrations arranged in a 3x2
grid on a very dark background (#0B0B14). Each icon uses a two-color
gradient treatment: Icon 1: target crosshair (orange→red) for Strategy.
Icon 2: shield with circuit trace (purple) for Governance.
Icon 3: connected brain node (violet→cyan) for Knowledge Systems.
Icon 4: lightning bolt through gears (orange) for Automation.
Icon 5: group of people silhouettes with wifi signal (cyan) for Enablement.
Icon 6: robot face outline (indigo→cyan) for Agentic Operations.
All icons in the same line-weight geometric style, glow treatment,
dark rounded-rectangle background. Documentation-quality flat render,
consistent visual language across all six. 3:2 format.
```

---

## PROMPT 14 — Purple Silk Waves Minimal (Image 4 variant — cleaner)
**Asset:** Email marketing header, presentation background

```
Generate an image of two smooth ribbon-like waves flowing from the right
side of the frame diagonally toward the center-left, on a pure deep navy
background (#0D1128). The waves should be rendered in saturated violet
(#A144FF) with bright specular highlights suggesting a metallic sheen.
The waves are completely smooth — no debris, no texture — just pure
clean silk-like fluid forms. The left half of the image is empty dark
space for text overlay. Minimal, elegant, luxury-tech aesthetic. Wide
16:9 format, studio render quality, extremely clean.
```

---

## PROMPT 15 — Enterprise Outcomes Data Card
**Asset:** Social proof section, case study header, results page

```
Generate an image of a dark-mode data card rendered in clean flat UI style
against a void background. The card shows four large metric numbers in
bright white with their labels in light gray: "$128M+" (Cost Savings),
"3.6x" (Productivity), "48%" (Faster Time to Value), "92%" (Retention).
Each number has its first character subtly rendered in the brand gradient.
The card has a thin violet border glow, rounded corners, and a very subtle
inner light at the top edge. The overall feeling is: boardroom-ready data
presentation, dark enterprise dashboard aesthetic. 4:3 format, UI render
quality, no background texture.
```

---

## Prompt Engineering Notes (Image-grounded, June 2026)

### What these 4 images confirm about FlashFusion's visual language:
1. **Color range is wider than core tokens** — orange→red→purple→cyan is the full energy arc
2. **Orbitron/geometric sans is the kinetic headline choice**, not serif
3. **Fluid wave + blueprint overlay** (Image 4) is the highest-fidelity background reference
4. **Circuit node layout** (Image 2 right column) is the characteristic spatial pattern
5. **Glassmorphic dark cards with edge glow** are the primary UI component motif (Images 2 + 3)
6. **Beta Tester Army (Image 3) is a separate brand** — teal/cyan dominant, different type

### Gemini Imagen 3 best practices applied:
- Every prompt leads with "Generate an image of..." (required trigger phrase per Google docs)
- Format specification at end of every prompt
- Natural sentence flow, not keyword lists
- Dark background specified explicitly (model defaults to lighter backgrounds)
- Hex colors included for exact brand color adherence
- Hands/faces avoided or obscured (Image 3 best practice — Imagen 3 still struggles here)
