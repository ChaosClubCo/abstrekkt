---
name: Villain & Virtue Editorial
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#d4c5ab'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#9c8f78'
  outline-variant: '#504532'
  surface-tint: '#fbbc00'
  primary: '#ffe2ab'
  on-primary: '#402d00'
  primary-container: '#ffbf00'
  on-primary-container: '#6d5000'
  inverse-primary: '#795900'
  secondary: '#a9c7ff'
  on-secondary: '#003064'
  secondary-container: '#026bd2'
  on-secondary-container: '#ebf0ff'
  tertiary: '#e6e6e1'
  on-tertiary: '#2f312e'
  tertiary-container: '#c9cac5'
  on-tertiary-container: '#535551'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdfa0'
  primary-fixed-dim: '#fbbc00'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#a9c7ff'
  on-secondary-fixed: '#001b3e'
  on-secondary-fixed-variant: '#00468c'
  tertiary-fixed: '#e3e3de'
  tertiary-fixed-dim: '#c6c7c2'
  on-tertiary-fixed: '#1a1c19'
  on-tertiary-fixed-variant: '#454744'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: ebGaramond
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: literata
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: ebGaramond
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  technical-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 40px
  gutter: 24px
  window-frame-thickness: 12px
---

## Brand & Style

The design system is a cinematic, dark-editorial interface designed for deep narrative immersion and high-fidelity storytelling. It bridges the gap between a classic first-person memoir and a high-end creative studio. The aesthetic is "Dark Editorial," characterized by deep tonal density, expansive negative space, and a "quiet design" philosophy where the interface recedes to let the narrative content lead.

The emotional response should be one of contemplative weight—sophisticated, slightly mysterious, and profoundly premium. We employ a mix of **Glassmorphism** and **Tactile/Skeuomorphic** elements to create a sense of physical history and technical precision. The UI feels like a high-end physical object—a heavy, textured frame housing cutting-edge digital glass.

## Colors

The palette is rooted in the "Midnight Tier," utilizing deep obsidian and charcoal to establish depth without losing detail. 

- **Primary (Golden Hour):** A warm, nostalgic amber (#FFBF00) used sparingly for active states, highlights, and moments of emotional significance.
- **Secondary (Blueprint):** A clinical, technical blue (#4D96FF) reserved for AI-generated data, technical metadata, and Moment Studio diagnostics.
- **Neutral/Text:** Ivory (#F5F5F0) provides a soft, paper-like contrast against the dark backgrounds, reducing eye strain while maintaining a literary feel.
- **Surface:** The background uses a specific "Deep Carbon" (#0A0A0C) to ensure pure black levels on OLED displays while allowing for subtle texture overlays.

## Typography

This design system utilizes a high-contrast typographic pairing to distinguish between narrative and data.

- **The Memoir Serif (EB Garamond / Literata):** Used for all storytelling elements, titles, and captions. EB Garamond (Italic) provides the "handwritten memoir" feel for labels, while Literata ensures maximum readability for long-form narrative body text.
- **The Technical Mono (JetBrains Mono):** Used exclusively within the Moment Studio. It represents the "machine layer"—AI outputs, timestamps, and technical metadata.
- **Scale:** Large display titles should use tight tracking and serif italics to evoke editorial elegance.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy within a persistent, dimensional window frame. The frame acts as a physical boundary (simulating worn wood or brushed metal), creating a "portal" effect.

- **The Frame:** A 12px outer bezel with internal 1px silver highlights. 
- **The Grid:** A 12-column layout for desktop with generous 40px margins to ensure the "editorial" feel of a book page. 
- **Reflow:** On mobile, margins reduce to 20px, and the window frame thins to 4px to maximize screen real estate while maintaining the "contained" aesthetic.
- **Clustered Timelines:** Vertical or horizontal dot indicators should be spaced using half-units (4px) to create dense, information-rich clusters.

## Elevation & Depth

Hierarchy is established through **Materiality and Atmospheric Depth** rather than traditional drop shadows.

- **Base Layer:** The "Deep Carbon" textured background.
- **Surface Layer:** Glassmorphic containers with 12px backdrop-blur and a subtle "smudge" grain overlay. These containers should have a 0.5px inner border in ivory at 10% opacity.
- **Dimensional Frame:** Use a multi-layered inner shadow (inset) on the main window frame to create the "worn wood" bevel.
- **Transitions:** Perspective flips (rotateY) should be used when switching between "Narrative View" and "Moment Studio," treating the UI as a physical card that can be flipped over.

## Shapes

The shape language is a contrast of soft organic curves and precise technical sharpness.

- **Pill Shapes:** Used for all interactive selectors, toggles, and chips. This provides a "soft-touch" feel to the controls.
- **Hard Edges:** Used for the primary window frame and main content cards to maintain a structured, editorial appearance.
- **Radius:** Standard UI elements use an 8px (0.5rem) radius, while the "Moment Studio" technical cards use a tighter 4px radius to feel more precise and clinical.

## Components

- **The Window Frame:** A persistent outer container with a subtle wood/metal grain texture and beveled edges. It serves as the master wrapper for the entire application.
- **Pill Selectors:** Low-contrast until hovered. Upon interaction, they glow softly with a Golden Hour (Amber) inner light.
- **Technical Cards:** Designed for the Moment Studio, these use JetBrains Mono for all text, Blueprint (Blue) for data accents, and a "smudged glass" background.
- **Clustered Dot Timeline:** Small 4px circles. Active states pulse with a soft Amber glow; technical milestones use the Blueprint blue.
- **Ghost Inputs:** Text input fields have no visible border until focused. Upon focus, a 1px ivory underline fades in.
- **Interactive Perspectives:** Elements utilizing the `rotateY` transition should have a high CSS perspective (1000px) to ensure the physical "flip" feels cinematic and deep.