---
name: Midnight Garden Expansion
colors:
  surface: '#081425'
  surface-dim: '#081425'
  surface-bright: '#2f3a4c'
  surface-container-lowest: '#040e1f'
  surface-container-low: '#111c2d'
  surface-container: '#152031'
  surface-container-high: '#1f2a3c'
  surface-container-highest: '#2a3548'
  on-surface: '#d8e3fb'
  on-surface-variant: '#bacac5'
  inverse-surface: '#d8e3fb'
  inverse-on-surface: '#263143'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#c1c7cf'
  on-secondary: '#2b3137'
  secondary-container: '#41474e'
  on-secondary-container: '#afb6bd'
  tertiary: '#d1d9f3'
  on-tertiary: '#283044'
  tertiary-container: '#b6bdd7'
  on-tertiary-container: '#444c62'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#dde3eb'
  secondary-fixed-dim: '#c1c7cf'
  on-secondary-fixed: '#161c22'
  on-secondary-fixed-variant: '#41474e'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#081425'
  on-background: '#d8e3fb'
  surface-variant: '#2a3548'
typography:
  lunar-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  lunar-display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  star-heading-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  star-heading-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  botanical-body:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  ink-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  specimen-gap: 1.5rem
  journal-margin: 2rem
  ink-padding: 0.5rem
  container-inset: 1rem
---

## Brand & Style
The design system adopts a **Tactile / Skeuomorphic** aesthetic infused with **Glassmorphism**. It is a nocturnal evolution of the "Studio Edition" aesthetic, moving away from daylight workrooms into a mystical, moonlit conservatory. The UI should feel like physical objects placed on a dark, textured workbench: heavy glass vessels, ink-pressed botanical cards, and glowing reagents.

The emotional response is one of calm discovery and focused "craft." Every interaction should feel deliberate, as if the user is physically handling high-quality materials. The palette is intentionally dim to reduce eye strain, punctuated by vibrant, glowing accents that represent "mana" or active states.

## Colors
The palette is centered on deep nocturnal layers.
- **Primary (Bioluminescent Teal):** Used for interactive elements, "mana" indicators, and active states. It should appear to glow against the dark backgrounds.
- **Secondary (Lunar Silver):** Used for typography and iconography that requires high legibility. It mimics the sheen of moonlight on metallic or glass surfaces.
- **Tertiary (Midnight Indigo):** The primary surface color. It provides a deep, cool base that recedes into the background.
- **Neutral (Obsidian):** Used for shadows, deep wells, and high-contrast borders.

The "Parchment" texture should be tinted with a 5% Indigo overlay to maintain the nocturnal atmosphere while preserving the tactile stationery feel.

## Typography
Typography in this design system emphasizes clarity and hierarchy through "Lunar" and "Star" themed roles. 
- **Lunar Display:** Reserved for page titles and major section headers; should feel weighty and authoritative.
- **Star Headings:** Used for card titles and subsection labeling.
- **Ink Labels:** These mimic physical stamps used on specimen jars. They should always be uppercase with generous letter spacing to ensure legibility against dark textures.
- **Botanical Body:** Optimized for long-form reading, maintaining high contrast with the Lunar Silver color on Midnight Indigo backgrounds.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy, resembling a leather-bound journal or a specimen tray. 
- **Desktop:** A 12-column grid with 24px gutters. Content is centered in a maximum 1280px container.
- **Tablet:** 8-column grid with 16px gutters and 32px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Spacing is generous to allow the "glass" containers and "parchment" cards to breathe. Elements are grouped into "Specimen Sets" using consistent 24px (1.5rem) gaps to maintain the diegetic feel of objects organized on a desk.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Ambient Shadows**.
- **Level 1 (The Workbench):** The deepest background layer, a dark Midnight Indigo with a subtle paper-grain texture.
- **Level 2 (Parchment Cards):** Slightly elevated with a 4px blur shadow. These use a very dark, semi-opaque indigo fill with a 1px inner stroke of Lunar Silver (10% opacity) to define the edge.
- **Level 3 (Glass Containers):** Elements like modals or floating menus. These use a heavy backdrop blur (20px+) and a translucent Lunar Silver border.
- **Mana Glow:** Active or hovered interactive elements emit a soft, diffused outer glow using the Primary Teal color (`box-shadow: 0 0 15px rgba(45, 212, 191, 0.4)`).

## Shapes
This design system uses **Soft** geometry to mimic hand-cut paper and laboratory glassware. 
- Base components (buttons, inputs) use a 0.25rem radius.
- Larger containers (cards, trays) use a 0.5rem radius.
- Glass vials or circular buttons use a full pill-shape (999px) to contrast against the rectangular "stationery" elements.

## Components
- **Buttons:** Primary buttons are "Ink-Stamped"—solid Lunar Silver background with Midnight Indigo text. Secondary buttons are "Glass-Etched"—transparent with a 1px Lunar Silver border.
- **Cards:** Defined as "Specimen Trays." They feature a 1px border that is slightly brighter at the top (simulating overhead moonlight) and a subtle grain texture.
- **Input Fields:** "Ink Wells"—recessed fields with a darker-than-background fill and a 1px bottom border that glows Bioluminescent Teal when focused.
- **Chips/Labels:** "Botanical Tags"—small, rectangular elements with sharp corners and a subtle "punched hole" icon on the left to reinforce the stationery theme.
- **Lists:** Separated by thin, 1px horizontal rules in Lunar Silver at 5% opacity, resembling the faint lines of a ledger.
- **Progress Bars:** "Mana Vials"—horizontal bars filled with a Bioluminescent Teal gradient that has a "liquid" shimmer effect.