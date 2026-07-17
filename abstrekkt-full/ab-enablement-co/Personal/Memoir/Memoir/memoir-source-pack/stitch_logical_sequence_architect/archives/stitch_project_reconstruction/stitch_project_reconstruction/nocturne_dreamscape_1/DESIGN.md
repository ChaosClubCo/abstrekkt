---
name: Nocturne Dreamscape
colors:
  surface: '#11131c'
  surface-dim: '#11131c'
  surface-bright: '#373943'
  surface-container-lowest: '#0c0e17'
  surface-container-low: '#191b24'
  surface-container: '#1d1f29'
  surface-container-high: '#282933'
  surface-container-highest: '#32343e'
  on-surface: '#e1e1ef'
  on-surface-variant: '#cdc2d7'
  inverse-surface: '#e1e1ef'
  inverse-on-surface: '#2e303a'
  outline: '#968da0'
  outline-variant: '#4b4454'
  surface-tint: '#d6baff'
  primary: '#d6baff'
  on-primary: '#420089'
  primary-container: '#aa73ff'
  on-primary-container: '#3a0079'
  inverse-primary: '#7832d9'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#ffb1c0'
  on-tertiary: '#660029'
  tertiary-container: '#ff4c83'
  on-tertiary-container: '#5a0023'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ecdcff'
  primary-fixed-dim: '#d6baff'
  on-primary-fixed: '#280057'
  on-primary-fixed-variant: '#5f00c0'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffd9df'
  tertiary-fixed-dim: '#ffb1c0'
  on-tertiary-fixed: '#3f0017'
  on-tertiary-fixed-variant: '#90003d'
  background: '#11131c'
  on-background: '#e1e1ef'
  surface-variant: '#32343e'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  glass-padding: 1.5rem
---

## Brand & Style
The design system embodies a cinematic, ethereal atmosphere tailored for high-end creative tools, immersive entertainment, or futuristic social platforms. The brand personality is enigmatic yet sophisticated, drawing inspiration from deep space and celestial phenomena.

The visual style is a specialized evolution of **Glassmorphism**, specifically optimized to interact with a dynamic "Nebula Starlight" background. UI elements are treated as "optical lenses"—highly translucent layers that refract and diffuse the underlying cosmic energy. High-precision borders and vibrant accent glows provide the necessary structural definition against the fluid background.

## Colors
The palette is centered on deep obsidian tones to provide a canvas for the "Nebula" shader. 

- **Primary (Astral Violet):** Used for primary actions and focused states, representing the core energy of the nebula.
- **Secondary (Cygnus Cyan):** Used for data visualization, success states, and secondary highlights.
- **Tertiary (Nova Pink):** A high-energy accent for notifications or critical interactive elements.
- **Surface Strategy:** Backgrounds are never fully opaque. Neutral tones are used primarily as semi-transparent tints to provide legibility while maintaining the depth of the starlight shader.

## Typography
The typographic hierarchy balances futuristic geometry with technical precision. 

**Sora** provides a bold, wide-stanced presence for headlines, echoing the vastness of the theme. **Hanken Grotesk** maintains high legibility for body text against complex background gradients. **JetBrains Mono** is utilized for labels and metadata to reinforce the "procedural" and technical nature of the starlight shader environment. 

All typography should utilize a subtle `text-shadow` or `0.5px` stroke when placed directly over high-contrast nebula clusters to ensure AA accessibility.

## Layout & Spacing
The layout system follows a **Fluid Grid** model to allow the background shader to feel expansive. 

- **Breathing Room:** Wide margins (32px+) are preferred to prevent UI clutter and allow the "Nebula" animation to become a structural element of the composition.
- **Glass Padding:** Elements utilizing translucency require generous internal padding (at least 1.5rem) to allow the background refraction to be visible without obscuring content.
- **Desktop:** 12-column grid with 24px gutters.
- **Mobile:** 4-column grid with 16px gutters; translucency is reduced by 10% to preserve legibility on smaller backlit screens.

## Elevation & Depth
Depth is created through **Glassmorphism** and luminosity rather than traditional shadows.

- **The Shader Layer (Z-0):** The base layer is the animated Nebula Starlight shader.
- **The Lens Layer (Z-10):** Standard containers use a `backdrop-filter: blur(12px)` and a `20%` white tint.
- **The Floating Layer (Z-20):** Active modals or popovers use a `backdrop-filter: blur(24px)` with a primary-tinted border (`15%` opacity) to create a sense of glowing suspension.
- **Borders:** All translucent elements must have a `1px` solid border at `10-15%` white opacity to define the edge of the "glass" against the moving background.

## Shapes
This design system utilizes **Rounded** (0.5rem base) geometry. This choice softens the technical feel of the typography, making the interface feel more like an organic HUD (Heads-Up Display). 

Large containers and cards should scale up to `rounded-xl` (1.5rem) to mimic the look of premium optical lenses. Interactive components like buttons should maintain the standard `rounded-lg` (1rem) for a tactile, approachable feel.

## Components
Consistent styling across components is achieved through "Luminous Translucency."

- **Buttons:** 
  - *Primary:* Solid Primary color with a subtle inner glow. 
  - *Secondary:* Glass background with a `1px` primary border and `blur(8px)`.
- **Cards:** Must use `backdrop-filter`. No solid backgrounds are permitted. The top-left corner should feature a subtle linear gradient highlight (`white` at `10%` to `transparent`).
- **Inputs:** Darker, semi-opaque backgrounds (`50%` neutral) to ensure text entry is clear. Focus states trigger a "bloom" effect using a soft outer glow in the Primary color.
- **Chips/Badges:** Use JetBrains Mono in all-caps. Backgrounds should be highly vibrant but low opacity (`20%`) to look like glowing HUD elements.
- **Lists:** Separated by low-opacity (`5%` white) horizontal rules. Hover states should trigger a subtle increase in background luminosity rather than a color change.