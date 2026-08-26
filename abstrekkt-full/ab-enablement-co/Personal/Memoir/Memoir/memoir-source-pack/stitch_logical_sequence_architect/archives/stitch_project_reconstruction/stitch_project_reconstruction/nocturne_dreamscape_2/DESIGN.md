---
name: Celestial Chronicles
colors:
  surface: '#08122d'
  surface-dim: '#08122d'
  surface-bright: '#2f3855'
  surface-container-lowest: '#030c27'
  surface-container-low: '#111a35'
  surface-container: '#151e3a'
  surface-container-high: '#202945'
  surface-container-highest: '#2b3450'
  on-surface: '#dbe1ff'
  on-surface-variant: '#c6c6ce'
  inverse-surface: '#dbe1ff'
  inverse-on-surface: '#262f4c'
  outline: '#909098'
  outline-variant: '#45464d'
  surface-tint: '#bec5e5'
  primary: '#dbe1ff'
  on-primary: '#282f49'
  primary-container: '#bec5e5'
  on-primary-container: '#4a516c'
  inverse-primary: '#565d79'
  secondary: '#e1c554'
  on-secondary: '#3a3000'
  secondary-container: '#a88f22'
  on-secondary-container: '#332900'
  tertiary: '#f6dafa'
  on-tertiary: '#3c2a42'
  tertiary-container: '#d9bedd'
  on-tertiary-container: '#604b65'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#bec5e5'
  on-primary-fixed: '#131a32'
  on-primary-fixed-variant: '#3e4660'
  secondary-fixed: '#ffe16e'
  secondary-fixed-dim: '#e1c554'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#f6daf9'
  tertiary-fixed-dim: '#d9bedd'
  on-tertiary-fixed: '#26152c'
  on-tertiary-fixed-variant: '#544059'
  background: '#08122d'
  on-background: '#dbe1ff'
  surface-variant: '#2b3450'
  nebula-purple: '#9d5cff'
  surface-glass: rgba(21, 30, 58, 0.6)
  scroll-gradient-start: rgba(21, 30, 58, 0.8)
  scroll-gradient-end: rgba(11, 19, 43, 0.9)
  star-yellow: '#ffe16d'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  story-body:
    fontFamily: Literata
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  ui-main:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
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
  unit: 8px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  gutter: 16px
  container-margin: 24px
  story-padding: 40px
---

## Brand & Style
The brand personality is ethereal, whimsical, and tranquil, designed to evoke a sense of nighttime wonder and storytelling magic. The target audience includes dreamers, parents, and creative writers seeking a meditative digital experience. 

The design style is **Glassmorphism mixed with organic Celestial textures**. It utilizes deep space-inspired gradients, translucent surfaces with soft backdrop blurs, and glowing interactive elements that mimic starlight. The interface feels weightless and immersive, prioritizing a "focus mode" for creative flow while maintaining a premium, literary aesthetic.

## Colors
The palette is rooted in a deep "Midnight Navy" (`#08122d`) base, providing a high-contrast canvas for the celestial accent colors. 

- **Primary (Cool Silver):** Used for main UI headers and structural elements to provide clarity without harshness.
- **Secondary (Star Gold):** Reserved for primary actions, highlights, and interactive "magical" moments like inputs and play buttons.
- **Tertiary (Dusty Lavender):** Used for decorative accents, subheaders, and secondary icons to soften the interface.
- **Gradients & Effects:** Backgrounds should utilize radial "organic clouds" in Primary and Nebula Purple with high blur (80px+) to create depth.

## Typography
The system uses a tri-font strategy to balance elegance with readability:
- **Playfair Display** provides a sophisticated, editorial feel for large titles and branding.
- **Literata** is the workhorse for the storytelling experience, chosen for its "bookish" comfort during long-form reading.
- **Plus Jakarta Sans** handles all functional UI tasks (menus, settings, labels), providing a modern, clean contrast to the serif fonts.

Mobile adjustments: Headlines should scale down approximately 20% to maintain readability without overwhelming the viewport.

## Layout & Spacing
The layout follows a **Fixed Center-Column Grid** for the main content to ensure a focused reading experience, while secondary settings are relegated to a sidebar or glass cards.

- **Desktop:** 12-column grid. Main content typically spans 8 columns, with a 4-column sidebar.
- **Rhythm:** An 8px base unit drives all spacing. Stacked elements use 16px (md) for related items and 32px (lg) for distinct sections.
- **Padding:** High internal padding (40px) within the "Celestial Scroll" main container creates an airy, premium feel.

## Elevation & Depth
Depth is created through **Layered Translucency** rather than traditional shadows:
1.  **Background Layer:** Fixed star-field with twinkling animations and soft radial nebula gradients.
2.  **Glass Surfaces:** Sidebars and cards use `rgba(21, 30, 58, 0.6)` with a 12px backdrop blur and a subtle 1px border.
3.  **The "Celestial Scroll":** The primary content area uses a deeper gradient (`0.8` to `0.9` opacity) with a heavier 20px blur and a 40px soft outer shadow (`rgba(0,0,0,0.5)`) to make it feel like the center of the universe.
4.  **Interactive Glows:** Buttons and active inputs use outer glows (`box-shadow`) in the Secondary color instead of standard elevation to simulate light emission.

## Shapes
The shape language is organic and soft. Large containers (like the main scroll) use ultra-rounded corners (32px/2rem) to mimic parchment or celestial bodies. Smaller components like buttons and inputs follow a pill-shaped or soft-rounded (8px/0.5rem) convention.

Inputs are specifically kept at a lower roundedness (4px) to maintain a "fill-in-the-blank" worksheet aesthetic within the more organic layout.

## Components
- **Madlib Inputs:** Inline text fields with no background but a 1px border in Star Gold. On focus, they transition to a light Gold tint with a soft outer glow. Font style is italic Literata.
- **Primary Buttons:** Pill-shaped with a vibrant Star Gold gradient. They must include an "outer glow" effect and scale slightly (1.05x) on hover to feel reactive.
- **Ghost Buttons:** 1px border in Star Gold or Primary Silver. No fill unless hovered (10% opacity fill).
- **Selection Controls:** Radio buttons use the Secondary color for the "checked" state with a high-contrast background to ensure visibility against the dark surfaces.
- **Glass Cards:** Used for sidebar settings. Must include a top border highlight (10% white) to catch the "light" from the starfield.
- **Progress/Duration Indicators:** Use the Tertiary Lavender for inactive states and Secondary Gold for active/filled states.