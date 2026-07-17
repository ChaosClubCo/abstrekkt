---
name: Studio Edition
colors:
  surface: '#fff9eb'
  surface-dim: '#e0dac7'
  surface-bright: '#fff9eb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e0'
  surface-container: '#f4eedb'
  surface-container-high: '#efe8d5'
  surface-container-highest: '#e9e2d0'
  on-surface: '#1e1c10'
  on-surface-variant: '#4f4446'
  inverse-surface: '#333024'
  inverse-on-surface: '#f7f0de'
  outline: '#817476'
  outline-variant: '#d3c3c5'
  surface-tint: '#78555e'
  primary: '#78555e'
  on-primary: '#ffffff'
  primary-container: '#ffd1dc'
  on-primary-container: '#7a5761'
  inverse-primary: '#e7bbc6'
  secondary: '#3a675a'
  on-secondary: '#ffffff'
  secondary-container: '#bceddc'
  on-secondary-container: '#406d60'
  tertiary: '#5c5d6e'
  on-tertiary: '#ffffff'
  tertiary-container: '#dbdbef'
  on-tertiary-container: '#5e6070'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e2'
  primary-fixed-dim: '#e7bbc6'
  on-primary-fixed: '#2d141c'
  on-primary-fixed-variant: '#5e3e47'
  secondary-fixed: '#bceddc'
  secondary-fixed-dim: '#a1d0c1'
  on-secondary-fixed: '#002019'
  on-secondary-fixed-variant: '#214e43'
  tertiary-fixed: '#e1e1f5'
  tertiary-fixed-dim: '#c5c5d8'
  on-tertiary-fixed: '#191b29'
  on-tertiary-fixed-variant: '#444655'
  background: '#fff9eb'
  on-background: '#1e1c10'
  surface-variant: '#e9e2d0'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-md:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  label-caps:
    fontFamily: Bricolage Grotesque
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  journal-text:
    fontFamily: Literata
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 32px
  margin-desktop: 64px
  sticker-overlap: -12px
---

## Brand & Style
The brand personality is nostalgic, cozy, and highly tactile. It transitions the playful energy of the mobile experience into a more sophisticated, "curated" desktop workspace. The target audience includes creative hobbyists, journalers, and fans of the "cozy gaming" aesthetic who appreciate a digital space that feels like a physical desk.

The design style is **Tactile / Skeuomorphic** mixed with **Scrapbook Minimalism**. It utilizes 2.5D hand-drawn illustrations that appear to sit "on top" of the screen. Surfaces should mimic physical materials like heavy cardstock, vellum, and matte sticker paper. The emotional response is one of calm, organized creativity—evoking the feeling of opening a fresh planner or a new pack of stickers.

## Colors
The palette is rooted in soft, warm pastels that prevent eye strain during long desktop sessions. 

- **Warm Cream (#FDF6E3):** The primary background color, mimicking the tone of aged paper or a clean desktop surface.
- **Pastel Pink (#FFD1DC):** Used for primary actions and "soft" highlights.
- **Mint Green (#B2E2D2):** Reserved for success states and creative tools.
- **Soft Lavender (#E6E6FA):** Used for secondary UI elements and organizational categories.
- **Accent Brown (#8B5E3C):** Utilized for "ink" effects, outlines, and text to maintain a softer look than pure black.

## Typography
The typography uses a tri-font system to balance legibility with a "hand-crafted" feel. 

- **UI Headings:** Plus Jakarta Sans provides a clean, modern, and friendly structure.
- **Body Content:** Quicksand offers a high degree of readability with its rounded terminals, maintaining the "soft" aesthetic.
- **Labels & Interface Notes:** Bricolage Grotesque adds a quirky, "stamped" character to small UI elements.
- **Journaling Elements:** Literata is used for long-form notes and descriptions, providing a literary, "written-in" feel that differentiates content from the UI shell.

## Layout & Spacing
The layout follows a **Fixed Grid** model centered on the screen, mimicking a physical 1200px-wide "workspace" or desk mat. 

- **Desktop:** A 12-column grid with generous 32px gutters. Content is organized in "zones" (e.g., a central canvas with floating toolbars).
- **Tactile Spacing:** Elements should not always be perfectly aligned to the pixel. A "human error" offset of 1-2 degrees of rotation or a -12px overlap (using `sticker-overlap`) creates the scrapbook feel.
- **Margins:** Large 64px margins frame the workspace, allowing for "decorative clutter" (illustrations of pens, clips, or loose stickers) to sit in the periphery.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Physical Shadows**. Unlike digital-first systems, shadows here are directional and "soft-cast," suggesting a light source from the top-left.

- **Base Layer:** The Warm Cream desk surface.
- **Level 1 (Paper):** Subtle 2px drop shadows with 10% opacity Brown (#8B5E3C). Used for washi tape and flat stickers.
- **Level 2 (Cardstock):** 8px blur shadows with 15% opacity brown. Used for main content cards and polaroid frames.
- **Level 3 (Floating Tools):** 16px soft, diffused shadows. Used for floating sticker sheets and active modals.
- **Texture:** All elevated surfaces should have a subtle "noise" or grain overlay to mimic paper fiber.

## Shapes
The shape language is organic and soft. While the base roundedness is 0.5rem (8px), specific components break this rule for character:
- **Buttons:** Use higher roundedness (up to 1.5rem) to appear "squishy" and pressable.
- **Polaroids:** Maintain a classic 4px (Soft) radius for a more rigid cardstock feel.
- **Washi Tape:** Features jagged, "torn" edges on the left and right sides instead of standard radii.

## Components
- **Sticker Sheets:** Floating panels with a white border and a 1px inner stroke. Stickers within these sheets use a "die-cut" white outline (3px).
- **Polaroid Frames:** Containers for images with a thick bottom margin for "handwritten" captions in the Journal font.
- **Washi Tape Dividers:** Horizontal rules that look like semi-transparent patterned tape. Use `multiply` blend mode to show the background texture through the tape.
- **Paper-Textured Buttons:** Primary buttons use a subtle "press" animation where the shadow Y-offset decreases on click, mimicking physical displacement.
- **Input Fields:** Styled to look like blank notebook lines or indented paper wells, with the cursor appearing as a pencil tip or fountain pen nib.
- **Tooltips:** Styled as small "sticky notes" with one corner slightly curled.