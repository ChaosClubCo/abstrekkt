---
name: Structural Narrative
colors:
  surface: '#171309'
  surface-dim: '#171309'
  surface-bright: '#3e392d'
  surface-container-lowest: '#110e05'
  surface-container-low: '#1f1b11'
  surface-container: '#231f14'
  surface-container-high: '#2e2a1e'
  surface-container-highest: '#393428'
  on-surface: '#ebe2d0'
  on-surface-variant: '#ccc6bd'
  inverse-surface: '#ebe2d0'
  inverse-on-surface: '#353024'
  outline: '#959088'
  outline-variant: '#4a463f'
  surface-tint: '#cac6c1'
  primary: '#cac6c1'
  on-primary: '#32302d'
  primary-container: '#0a0907'
  on-primary-container: '#7c7875'
  inverse-primary: '#615e5a'
  secondary: '#c9c6c1'
  on-secondary: '#31312d'
  secondary-container: '#474743'
  on-secondary-container: '#b7b5af'
  tertiary: '#f2bd80'
  on-tertiary: '#472a00'
  tertiary-container: '#120700'
  on-tertiary-container: '#9d703b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e7e2dd'
  primary-fixed-dim: '#cac6c1'
  on-primary-fixed: '#1d1b19'
  on-primary-fixed-variant: '#494643'
  secondary-fixed: '#e5e2dc'
  secondary-fixed-dim: '#c9c6c1'
  on-secondary-fixed: '#1c1c18'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#f2bd80'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#633f0d'
  background: '#171309'
  on-background: '#ebe2d0'
  surface-variant: '#393428'
  ink: '#0a0907'
  paper: '#f2efe9'
  paper-dim: '#a09888'
  brass: '#c4935a'
  brass-deep: '#7a5a35'
  technical-blue: '#5b8fb9'
  technical-green: '#5a9a6b'
  rule-white: rgba(255, 255, 255, 0.06)
typography:
  display-title:
    fontFamily: Fraunces
    fontSize: 3.6rem
    fontWeight: '320'
    lineHeight: '1.06'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Fraunces
    fontSize: 2.2rem
    fontWeight: '380'
    lineHeight: '1.2'
  body-prose:
    fontFamily: Crimson Pro
    fontSize: 19px
    fontWeight: '380'
    lineHeight: '1.8'
  kicker-label:
    fontFamily: JetBrains Mono
    fontSize: 0.6rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.4em
  technical-note:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: '1.5'
  drop-cap:
    fontFamily: Fraunces
    fontSize: 4.4rem
    fontWeight: '380'
    lineHeight: '0.82'
spacing:
  measure: 38rem
  stage-padding-y: clamp(4rem, 10vw, 7rem)
  stage-padding-x: clamp(1.25rem, 4vw, 2rem)
  gutter-technical: 1.5rem
  scene-gap: clamp(4rem, 8vw, 6rem)
---

## Brand & Style

This design system embodies the intersection of raw human experience and the rigid discipline of engineering. It treats a memoir not just as a story, but as a site of active reconstruction—moving from the wreckage of the past to the deliberate "construction" of a future.

The aesthetic is **Clinical Noir**. It blends the high-contrast, atmospheric qualities of a dark-mode literary journal with the systematic precision of a technical blueprint. The emotional response is one of "studied vulnerability": serious, archival, and intellectually honest.

**Design Style: Brutalist Minimalism with Textured Layering**
- **Structural Integrity:** Heavy reliance on 1px rules, grids, and monospaced "metadata" to frame organic prose.
- **Archival Texture:** Subtle film grain and SVG noise overlays suggest the physical reality of paper and ink within a digital terminal.
- **High-Contrast Hierarchy:** Stark transitions between deep blacks and warm creams, accented by metallic brass to denote importance and "excavated" findings.

## Colors

The palette is rooted in the "Ink and Paper" metaphor but inverted for a sophisticated dark-mode experience.

- **Primary (Ink):** The foundation. A deep, near-black charcoal that provides an infinite well for the narrative.
- **Secondary (Paper):** The light. A warm, aged cream used for primary legibility to prevent the harshness of pure white.
- **Tertiary (Brass):** The tool. A muted metallic gold used for "CTAs" (Call to Action) and marking significant "structural" elements or scene breaks.
- **Technical Accents:** Low-saturation Blue and Green are reserved for diagnostic metadata, status indicators (e.g., "MAPPED", "EXCAVATED"), and UI-inspired side-notes.

## Typography

Typography is the primary voice of this system, alternating between the "Human" (Serif) and the "System" (Monospace).

- **The Literary Voice:** Use **Fraunces** for expressive headlines. Lean into its variable axes (Softness and Wonkiness) to create a sense of organic, slightly "off" beauty. **Crimson Pro** handles the heavy lifting of the narrative with a wide line-height to ensure a comfortable, scholarly reading pace.
- **The Engineering Voice:** Use **JetBrains Mono** for all metadata, labels, and technical asides. It should feel like a punch-card or a terminal printout—rigid, spaced out, and objective.
- **Hierarchy:** Use aggressive tracking (letter-spacing) on monospaced elements to distinguish them from the tight, editorial spacing of the serifs.

## Layout & Spacing

The layout philosophy centers on **"The Stage"**—a fixed-width, highly focused column of content that mimics the physical width of a manuscript page.

- **The Measure:** Content is constrained to a maximum width of `38rem` to maintain an ideal line length for long-form reading.
- **Vertical Rhythm:** Generous whitespace is used to separate "Scenes." This isn't just aesthetic; it provides the reader with cognitive breathing room between intense narrative segments.
- **The Vertical Rule:** A signature 1px vertical line should run through the left margin (on desktop), acting as a "plumb line" or a spine for the construction, anchoring the centered text to a structural axis.
- **Technical Side-Notes:** Labels and technical annotations should "hang" in the margins or be tucked into cards that break the primary vertical flow.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Textural Contrast** rather than physical shadows.

- **Flat Depth:** Use a background color staircase. The page background is `--ink` (#0a0907). Surface elements like cards or sidebars use a slightly lighter `--surface` (#1a1510) to appear "lifted."
- **Materiality:** Apply a subtle noise filter (SVG grain) over the entire UI to simulate film or paper texture. This breaks the "digital perfection" and aligns with the memoir's theme of raw reconstruction.
- **Vignetting:** Use very low-opacity radial gradients in the corners (using the Brass or Ink colors) to draw the eye toward the center of "The Stage."
- **Glassmorphism:** For overlays or navigation menus, use a high backdrop-blur (12px-14px) with a semi-transparent `--ink` background to maintain context while creating a temporary focus state.

## Shapes

The shape language is strictly **Sharp (0)**.

In an engineering-inspired system titled "Construction," corners should remain crisp and intentional. Use rectangles and straight lines to reinforce the feeling of a blueprint or a framed structure. 

- **Exceptions:** Use circular shapes exclusively for status indicators (e.g., a "Live" system dot) or very small icons to differentiate "functional" UI from "structural" content.
- **Borders:** Use 1px rules for most containers. For "Wall Notes" or important callouts, use a 2px-3px solid left-hand border in `--brass` to simulate a physical tab or the edge of a folder.

## Components

- **Buttons:** Rectangular, no radius. Primary buttons use a `--brass` background with `--ink` text. Secondary buttons use a 1px border of `--brass-faint` and monospaced text.
- **Cards (The "Thread" Card):** A subtle background of `--surface` with a 1px `--rule-white` border. Use a 2px top rule in `--brass` to denote a "Primary Construction" card.
- **Badges/Chips:** Small, monospaced text blocks with a low-opacity background of technical blue or green. Borders should be 1px and sharp.
- **Input Fields:** Bottom-border only (1px `--paper-dim`), mimicking a ledger line. The focus state should transition the border to `--brass`.
- **Scene Breaks:** A centered `***` mark using **JetBrains Mono** or a horizontal rule that fades out toward the edges, creating a "shimmer" effect.
- **Wall Notes:** Styled as editorial asides, often placed with a slight horizontal offset, featuring a different serif weight or a subtle tint to distinguish "Inner Dialogue" from "Core Narrative."