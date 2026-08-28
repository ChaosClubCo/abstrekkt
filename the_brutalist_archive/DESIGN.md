---
name: The Brutalist Archive
colors:
  surface: '#121416'
  surface-dim: '#121416'
  surface-bright: '#38393c'
  surface-container-lowest: '#0c0e10'
  surface-container-low: '#1a1c1e'
  surface-container: '#1e2022'
  surface-container-high: '#282a2c'
  surface-container-highest: '#333537'
  on-surface: '#e2e2e5'
  on-surface-variant: '#d7c2c0'
  inverse-surface: '#e2e2e5'
  inverse-on-surface: '#2f3133'
  outline: '#9f8c8b'
  outline-variant: '#524343'
  surface-tint: '#ffb3b1'
  primary: '#ffdad8'
  on-primary: '#512122'
  primary-container: '#ffb3b1'
  on-primary-container: '#7b4242'
  inverse-primary: '#894e4d'
  secondary: '#c0c7d2'
  on-secondary: '#2a313a'
  secondary-container: '#434a53'
  on-secondary-container: '#b2b9c4'
  tertiary: '#e1e2e8'
  on-tertiary: '#2e3135'
  tertiary-container: '#c4c6cc'
  on-tertiary-container: '#505257'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#370d0e'
  on-primary-fixed-variant: '#6d3737'
  secondary-fixed: '#dce3ee'
  secondary-fixed-dim: '#c0c7d2'
  on-secondary-fixed: '#151c24'
  on-secondary-fixed-variant: '#404750'
  tertiary-fixed: '#e1e2e8'
  tertiary-fixed-dim: '#c5c6cc'
  on-tertiary-fixed: '#191c20'
  on-tertiary-fixed-variant: '#44474b'
  background: '#121416'
  on-background: '#e2e2e5'
  surface-variant: '#333537'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  telemetry-label:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  telemetry-value:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
  caption:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  sidebar-width: 320px
---

## Brand & Style

This design system is built on the concept of "The Brutalist Archive"—a high-fidelity, technical interface that feels like a redacted document or a deep-intelligence telemetry terminal. The aesthetic is raw, functional, and authoritative, evoking the cold precision of classified technical manuals and mid-century archival technology.

The design system prioritizes high-density information display over decorative flourish. It uses a mix of **Brutalism** and **Technical Modernism** to create a UI that feels "earned" by the user. The visual language is defined by sharp edges, monochromatic depth, and a complete absence of organic softening. The emotional response is one of serious inquiry, analytical focus, and industrial reliability.

## Colors

The palette is anchored in **Obsidian (#0c0e10)**, providing a void-like backdrop that minimizes eye strain during long-form data analysis. Hierarchy is established through subtle tonal shifts rather than high-contrast borders.

- **Primary (Hazard Red):** A desaturated, tactical red used exclusively for alerts, critical telemetry, and active states. It should be used sparingly to maintain its impact.
- **Surface Layers:** Two levels of grey-blues (#1a1d21 and #3d444d) provide structural depth.
- **Accents:** Secondary data points use a dim cyan or muted amber to mimic historical CRT phosphor displays.
- **Overlays:** A grain texture overlay (0.05 opacity) and subtle scanline patterns are applied to the top-most layer to provide a physical "microfilm" quality.

## Typography

This design system utilizes a dual-typeface strategy to distinguish between content and interface.

- **Space Grotesk** is the "Interface" font. It is used for all telemetry, labels, headings, and navigational elements. Its geometric, slightly technical character reinforces the archival machine aesthetic.
- **Work Sans** is the "Content" font. It handles all long-form reading and body text. Its neutral, highly legible grotesque structure ensures archival documents are readable without fatigue.

**Key Rules:**
- All labels must be uppercase with increased letter spacing.
- Telemetry values should be bold to stand out from their labels.
- Headlines are never centered; they are always left-aligned or anchored to grid lines.

## Layout & Spacing

The layout philosophy is a **Rigid Asymmetrical Grid**. It rejects the traditional centered "safe" containers in favor of a full-bleed, technical manual layout.

- **The 4px Baseline:** All spacing is derived from a 4px module.
- **Asymmetry:** Primary content should occupy roughly 65-70% of the horizontal space, with high-density sidebar telemetry occupying the remaining area.
- **Dividers:** Use 1px solid lines in #3d444d sparingly. Architecture is primarily built through alternating background fills of #1a1d21 and #0c0e10.
- **Density:** High density is preferred. Elements should be packed tightly to reflect the "classified document" aesthetic, using padding only to maintain legibility.

## Elevation & Depth

This design system rejects shadows and blurs entirely. Depth is achieved through **Tonal Stacking**:

1.  **Level 0 (Base):** #0c0e10 (Deep Obsidian). The infinite background.
2.  **Level 1 (Panels):** #1a1d21. Used for primary content areas and sidebars.
3.  **Level 2 (Interactive):** #3d444d. Used for button backgrounds or hovered list items.
4.  **Level 3 (Alert):** #ffb3b1. Used only for active warnings or high-priority markers.

To simulate physical archival layers, use 1px "ghost borders" in a slightly lighter shade than the surface they sit on. CRT scanline overlays should be persistent on the highest z-index layer at very low opacity to tie the surfaces together.

## Shapes

The shape language is strictly **Rectilinear**.

- **Radius:** All components have a 0px border-radius. There are no exceptions.
- **Icons:** Use sharp-angled, stroke-based iconography. Avoid filled icons unless they are used for status indicators.
- **Clipping:** Images and data visualizations should be hard-clipped to their containers, creating a "windowed" effect into the data.

## Components

### Buttons
Primary buttons are solid #ffb3b1 with #0c0e10 text. Secondary buttons are 1px borders with no fill. All buttons use Space Grotesk Bold Uppercase. Interaction is indicated by a complete color inversion rather than a shadow.

### Input Fields
Fields are represented as simple horizontal lines or low-contrast boxes (#1a1d21). The active state is indicated by a #ffb3b1 underline. Labels always sit above the field in `telemetry-label` style.

### Cards & Containers
Containers do not use shadows. They are distinguished solely by their background color (#1a1d21) and sharp 1px borders. Use "corner brackets" (L-shaped ornaments) on high-priority data containers to simulate a viewfinder.

### Telemetry Strips
Horizontal or vertical bars containing a label and a value. These are used in high-density areas to report status (e.g., "ACQUISITION DATE : 7/11/2022").

### Data Grids
Tables should have no vertical lines, only horizontal dividers. The header row should be #3d444d with white text to anchor the data.