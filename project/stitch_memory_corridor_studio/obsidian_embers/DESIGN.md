---
name: Obsidian & Embers
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d5c4ab'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9e8f78'
  outline-variant: '#514532'
  surface-tint: '#ffba20'
  primary: '#ffdca1'
  on-primary: '#412d00'
  primary-container: '#ffb800'
  on-primary-container: '#6b4c00'
  inverse-primary: '#7c5800'
  secondary: '#b5cad3'
  on-secondary: '#20333b'
  secondary-container: '#364a52'
  on-secondary-container: '#a4b8c2'
  tertiary: '#d5e1f8'
  on-tertiary: '#253142'
  tertiary-container: '#b9c5db'
  on-tertiary-container: '#465264'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea8'
  primary-fixed-dim: '#ffba20'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5e4200'
  secondary-fixed: '#d1e6f0'
  secondary-fixed-dim: '#b5cad3'
  on-secondary-fixed: '#0a1e25'
  on-secondary-fixed-variant: '#364a52'
  tertiary-fixed: '#d7e3fa'
  tertiary-fixed-dim: '#bbc7dd'
  on-tertiary-fixed: '#101c2c'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  emotional-label:
    fontFamily: Bodoni Moda
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  caption-tech:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style
The design system is built upon a **Dark Editorial** aesthetic, designed to evoke a sense of weight, intimacy, and narrative gravity. It serves a dualistic theme of "Villains and Virtues," where the UI acts as a silent, atmospheric observer—a "bespoke memory apparatus" rather than a utility tool.

The visual style prioritizes **cinematic depth** over flat surfaces. It utilizes high-fidelity textures, atmospheric bloom, and a sophisticated play of light and shadow. The emotional response should be one of quiet intensity, mirroring the tension between moral extremes. Every interaction must feel intentional, heavy, and physically grounded in a space composed of cold glass, worn wood, and fleeting light.

## Colors
The palette is rooted in the "Void"—a foundation of deep blacks (`#0A0A0A`) and midnight navies (`#001219`) that provide spatial depth. 

- **Virtue Accents:** Golden amber (`#FFB800`) and warm sodium vapor tones represent moments of clarity, hope, or historical weight. Use these for primary actions and highlights of significance.
- **Villain Accents:** Desaturated greys and "cold dashboard" blues (`#8E9AAF`) evoke unease and technical detachment. These are used for secondary information or areas of moral ambiguity.
- **Atmospheric Light:** Instead of solid fills, use gradients that mimic light spills, flickering fluorescents, and soft bloom to define edges and surfaces.

## Typography
The typography system relies on a sharp contrast between literary elegance and technical precision.

1.  **Bodoni Moda (Serif):** Used for titles, narrative headers, and "emotional labels." Its high-contrast strokes evoke the feel of a premium editorial or a classic novel. It should be used sparingly to maintain its impact.
2.  **Hanken Grotesk (Sans-Serif):** The primary workhorse for body copy and descriptions. It is clean, modern, and legible, providing a neutral ground for the more expressive serif.
3.  **JetBrains Mono (Monospace):** Used for UI controls, metadata, and technical captions. This adds a "bespoke apparatus" feel, suggesting the interface is a piece of calibrated equipment.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy to maintain editorial control over whitespace. Content is centered within a 1440px container on desktop to create a focused, cinematic viewing experience.

- **Negative Space:** Use generous margins and wide gutters to allow the atmospheric background textures and light spills to breathe.
- **Rhythm:** Spacing follows a 4px base unit, but significant sections should be separated by large, deliberate gaps (e.g., 80px or 120px) to signify a change in narrative beat.
- **Mobile Reflow:** On mobile, margins shrink to 20px, and the layout stacks vertically. Large display type should scale down significantly to prevent awkward line breaks while maintaining its high-contrast character.

## Elevation & Depth
Depth is created through **Atmospheric Layering** rather than traditional drop shadows.

- **Translucent Glass:** Surfaces use heavy backdrop blurs (20px+) and low-opacity fills (10-15%) to feel like cold glass panes suspended in a dark room.
- **Inner Glows:** Instead of outer shadows, use subtle inner borders (0.5px) with a "light spill" effect on the top edge to simulate overhead lighting.
- **Grain & Bloom:** Apply a subtle film grain overlay across the entire UI. Active elements should exhibit a soft "bloom" or outer glow that feels like a light source rather than a shadow.
- **Tonal Tiers:** Navigation is "closest" to the user with the highest transparency, while content resides on "deeper" matte surfaces of charcoal and navy.

## Shapes
The shape language is **Sharp (0px)**. 

To maintain the serious, architectural, and "technical apparatus" feel, rounded corners are avoided. Everything is built on precise, 90-degree angles. This severity reinforces the "Dark Editorial" aesthetic and contrasts beautifully with the soft, organic light blooms and textures used in the background. If a container requires a boundary, use a hair-line border (0.5pt to 1pt) rather than a filled shape.

## Components
Components should feel like parts of a high-end physical device or a curated exhibit.

- **Buttons:** Ghost-style buttons with sharp corners and hair-line borders. The hover state should involve a soft amber bloom (`Virtue`) or a cold flicker (`Villain`) rather than a color fill.
- **Input Fields:** Minimalist underlines or thin-bordered boxes. Labels use `JetBrains Mono` in all-caps, positioned above the field with wide letter-spacing.
- **Cards:** Avoid the "box-in-a-box" look. Use full-width dividers or varying background textures (e.g., a brushed metal section vs. a dark glass section) to separate content.
- **Micro-interactions:** Transitions should be slow and "weighted." Use ease-in-out timing that mimics the movement of heavy physical objects or the fading of light.
- **Status Indicators:** Use "flickering" light effects for active states. A "Virtue" status might glow steadily like an ember, while a "Villain" status might pulse with an uneasy, cold blue frequency.
- **Progress Bars:** Thin, single-pixel lines that fill with a subtle gradient bloom, avoiding any chunky or "bubbly" appearances.