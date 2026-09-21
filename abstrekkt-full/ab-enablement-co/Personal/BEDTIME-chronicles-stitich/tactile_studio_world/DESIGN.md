---
name: Tactile Studio World
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d8d2'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2eb'
  surface-container: '#f5ece5'
  surface-container-high: '#f0e7df'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#4a463f'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe8'
  outline: '#7b776e'
  outline-variant: '#ccc6bc'
  surface-tint: '#625e56'
  primary: '#625e56'
  on-primary: '#ffffff'
  primary-container: '#f4ede2'
  on-primary-container: '#6f6b62'
  inverse-primary: '#ccc6bb'
  secondary: '#466369'
  on-secondary: '#ffffff'
  secondary-container: '#c8e8ef'
  on-secondary-container: '#4b696f'
  tertiary: '#7d562d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffead9'
  on-tertiary-container: '#8c6338'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e8e2d7'
  primary-fixed-dim: '#ccc6bb'
  on-primary-fixed: '#1e1b15'
  on-primary-fixed-variant: '#4a463f'
  secondary-fixed: '#c8e8ef'
  secondary-fixed-dim: '#adccd3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#2e4b51'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f0bd8b'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#623f18'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  display-isometric:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-md:
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
  stamp-text:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '800'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 16px
  margin-mobile: 24px
  margin-desktop: 48px
  isometric-step: 32px
---

## Brand & Style
The design system for this product is rooted in the "Tactile Stationery" aesthetic, evoking the warmth and physical presence of a high-end sticker studio. The brand personality is cozy, creative, and whimsical, aimed at hobbyists and creators who find joy in analog crafts.

The UI utilizes a **Tactile / Skeuomorphic** style with a 2.5D isometric perspective. Elements are treated as physical objects: thick paper stock, embossed edges, and layered textures. The emotional response is one of safety and tactile satisfaction, similar to organizing a real-world scrapbooking desk. The visual language balances modern digital clarity with the charming imperfections of ink, wood, and paper.

## Colors
The core palette is anchored in creamy parchment neutrals and soft pastels to maintain a "cozy" foundation. 

1.  **Industrial Inkworks:** Features ink-stained parchment backgrounds with deep indigo shadows. Copper metallic accents are used for cogs and pipes.
2.  **Whiskers Wharf:** Utilizes sea-foam greens and weathered wood browns. Accents take the form of hemp-rope yellows and nautical stamp reds.
3.  **Neon Nightmarket:** Switches to a dark mulberry paper base. Vibrant violet and teal glow effects represent bioluminescent lanterns against the dark texture.

The "Midnight Garden" expansion extends the palette with deep forest greens and lunar silvers, maintaining the tactile paper texture while shifting the luminosity for night-time play.

## Typography
Plus Jakarta Sans provides a contemporary, clean contrast to the textured, organic backgrounds. It ensures legibility remains high despite the complex 2.5D environment. 

Headlines use heavy weights to mimic thick ink stamps. Labels and small descriptors use increased letter-spacing to simulate the look of printed stationery tags. For "Stamp Text" (used on UI ribbons or wooden crates), use the uppercase bold variant to create an embossed or stamped effect. All type should have a subtle 1px "ink-bleed" blur or a very slight offset shadow to ground it into the paper surface.

## Layout & Spacing
The layout follows a **Fluid Grid** but is heavily influenced by 2.5D isometric alignment. The base rhythm is built on an 8px module. 

Spacing between "sticker" UI elements should be generous to allow for decorative "washi tape" or "paperclip" adornments that bridge different containers. In the world map view, the layout uses an isometric grid where vertical offsets are half the width of horizontal offsets to maintain the 2.5D perspective. Elements reflow from a sprawling landscape on desktop to a vertically stacked "scrapbook" page on mobile.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Ambient Shadows** that simulate physical height. 

1.  **Level 0 (Tabletop):** The base map texture (parchment, wood, or dark paper).
2.  **Level 1 (Stickers/Elements):** Low-offset, crisp shadows (2px blur, 15% opacity) to suggest a thin sticker or paper cutout.
3.  **Level 2 (Pop-ups/Cards):** Higher elevation with diffused shadows (12px blur, 20% opacity) and a 1px white "paper edge" highlight on the top-left to suggest thickness.
4.  **Level 3 (Modals):** Maximum depth with a background blur that simulates looking through frosted vellum paper. 

Include "2.5D extrusion" for active buttons, giving them a physical 4px side-profile that compresses when clicked.

## Shapes
The shape language is defined by the "Round Eight" (8px) standard. This specific radius creates a soft, friendly aesthetic that avoids being too "bubbly" while ensuring nothing feels sharp or dangerous.

Containers should occasionally feature "torn paper" edges or "die-cut" scalloped borders to reinforce the studio theme. Washi tape accents are rectangular with jagged "torn" ends. Map nodes are always circular with a thick 2pt stroke to resemble collectible enamel pins or postage stamps.

## Components
-   **Buttons:** Designed as "squishy" physical pads or die-cut stickers. Primary buttons have a 2.5D bottom edge in a darker shade of the button color.
-   **Chips/Tags:** Styled as small pieces of washi tape with a slight transparency (85%) and a subtle paper grain texture.
-   **Lists:** Items are separated by faint pencil-line dividers or dotted "perforation" lines.
-   **Input Fields:** Styled as recessed "embossed" areas in the paper surface with a slight inner shadow.
-   **Cards:** Thick paper stock with a 1px stroke that is slightly darker than the surface color. Cards in the Neon Nightmarket theme feature a faint outer glow.
-   **Checkboxes:** Styled as small hand-drawn "X" marks or ink stamps when selected.
-   **Specialty Component (District Toggle):** A brass-weighted dial for Industrial Inkworks, a wooden buoy for Whiskers Wharf, and a glowing lantern for Neon Nightmarket.