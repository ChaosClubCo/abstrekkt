---
name: Midnight Academy
colors:
  surface: '#131312'
  surface-dim: '#131312'
  surface-bright: '#3a3938'
  surface-container-lowest: '#0e0e0d'
  surface-container-low: '#1c1c1a'
  surface-container: '#20201e'
  surface-container-high: '#2a2a29'
  surface-container-highest: '#353533'
  on-surface: '#e5e2e0'
  on-surface-variant: '#d8c3b2'
  inverse-surface: '#e5e2e0'
  inverse-on-surface: '#31302f'
  outline: '#a08d7e'
  outline-variant: '#534438'
  surface-tint: '#ffb873'
  primary: '#ffb873'
  on-primary: '#4b2800'
  primary-container: '#d4893a'
  on-primary-container: '#4d2900'
  inverse-primary: '#8c5000'
  secondary: '#ffb86c'
  on-secondary: '#492900'
  secondary-container: '#895100'
  on-secondary-container: '#ffd0a2'
  tertiary: '#67d5f0'
  on-tertiary: '#003640'
  tertiary-container: '#2ca7c1'
  on-tertiary-container: '#003742'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbf'
  primary-fixed-dim: '#ffb873'
  on-primary-fixed: '#2d1600'
  on-primary-fixed-variant: '#6a3b00'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#ffb86c'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#683c00'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#67d5f0'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#131312'
  on-background: '#e5e2e0'
  surface-variant: '#353533'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
---

## Brand & Style
The design system is built upon the "Reading Room at Midnight" narrative. It evokes the atmosphere of a private, high-tier library—quiet, focused, and intellectually rigorous. The target audience includes scholars, developers, and lifelong learners who require a distraction-free environment for deep work.

The visual style is **Corporate Modern with a Minimalist/Editorial edge**. It prioritizes extreme legibility and structural discipline. Every element is designed to feel intentional and permanent. The aesthetic avoids the softness of consumer apps in favor of a sharp, high-contrast, and authoritative interface that treats information with the reverence of a rare manuscript.

## Colors
The palette is rooted in a nocturnal spectrum. Backgrounds utilize a hierarchy of deep navy-charcoal blacks to define spatial depth without relying on shadows.

- **Primary & Secondary:** Warm ochre and amber tones act as the "lamplight" within the dark room. They are used sparingly for calls to action, active states, and critical highlights.
- **Neutrals:** A range of low-saturation charcols provide structural definition.
- **Typography:** Muted ivory is used for primary reading text to reduce eye strain compared to pure white, maintaining a parchment-on-obsidian contrast.
- **Accents:** High-contrast glyphs and status indicators should use the primary amber or specialized semantic colors (subdued greens/reds) that match the desaturated tone of the system.

## Typography
The typographic system is a dialogue between tradition and utility. 

- **Playfair Display** handles all editorial and display moments, bringing a scholarly, serif elegance to the interface. It should be used for page titles and section headings.
- **IBM Plex Sans** is the workhorse for all body content, offering exceptional clarity in dark mode environments.
- **IBM Plex Mono** is reserved for metadata, technical labels, and UI instrumentation (like page numbers or timestamps), reinforcing the feeling of a precise, indexed archive.

Maintain generous line heights for body text to ensure a comfortable reading experience during long sessions.

## Layout & Spacing
This design system utilizes a **Fixed Grid** philosophy for desktop to evoke the structured layout of a printed book, while transitioning to a **Fluid Grid** for mobile devices.

- **Desktop:** 12-column grid with a max-width of 1280px. Gutters are kept at 24px to provide clear separation between information blocks.
- **Rhythm:** All spacing must be multiples of 4px. Use `xl` (40px) or `xxl` (64px) for vertical section breathing room to maintain the "Midnight" sense of space and focus.
- **Alignment:** Content should be primarily left-aligned to mirror the Western reading pattern of academic papers.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. 

- **Level 0 (Background):** Used for the main canvas (#0c0c0b).
- **Level 1 (Surface):** Used for cards and navigation bars (#111110).
- **Level 2 (Overlay):** Used for modals or menus (#181815).

Each level is separated by a 1px solid border (#232320). When an element is raised (e.g., on hover), do not use a shadow; instead, slightly brighten the border or change the background tone. This maintains the "flat parchment" aesthetic while providing necessary affordance.

## Shapes
The shape language is disciplined and sharp. Following the `Soft` setting with a low radius (2-3px) ensures that elements feel precise and architectural. 

Avoid circles unless used for profile avatars. Rectangular containers should dominate the layout. The primary goal is to simulate the edges of books, index cards, and framed certificates.

## Components
- **Buttons:** Use sharp corners with a 1px border. Primary buttons use the Amber (#d4893a) background with dark text. Secondary buttons are transparent with an Ivory border. Hover states should involve a subtle fill shift or a 100% opacity border transition.
- **Input Fields:** Styled as "Underlined" or "Thin Boxed." Background should be slightly darker than the surface it sits on. Use IBM Plex Mono for placeholder text.
- **Cards:** No shadows. Defined by 1px borders (#232320). Headlines inside cards must use Playfair Display.
- **Chips/Tags:** Monospaced text (IBM Plex Mono) inside a rectangular box. These should look like library catalog labels.
- **Lists:** Use ivory dividers with 0.1 opacity. Leading elements should be high-contrast glyphs or monospaced numerals.
- **Scrollbars:** Custom-styled to be thin, muted charcoal tracks with amber thumbs that appear only on interaction.