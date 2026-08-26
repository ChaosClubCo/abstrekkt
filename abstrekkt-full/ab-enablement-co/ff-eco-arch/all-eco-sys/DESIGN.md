# Design System Inspired by FlashFusion

## 1. Visual Theme & Atmosphere

FlashFusion embodies a **dark, tech-forward aesthetic** that emphasizes velocity, innovation, and cutting-edge AI capability. The design system leverages deep, near-black backgrounds paired with vibrant violet accents to create visual energy and urgency. This high-contrast approach ensures accessibility while maintaining a premium, sophisticated appearance. The system prioritizes clarity and directness—every element serves a functional purpose. Rounded corners and generous spacing create breathing room within a dense information environment, while the violet-to-purple gradient spectrum communicates technological sophistication and forward momentum. The overall atmosphere is both professional and energetic, designed to inspire confidence in AI-driven automation.

**Key Characteristics**
- High-contrast dark theme with minimal neutral palette
- Violet and purple as primary brand accent colors
- Bold, modern typography with deliberate hierarchy
- Minimal borders and maximalist use of color psychology
- Generous spacing creating visual breathing room
- Glow effects and subtle elevation for depth
- Focus on performance and speed as visual metaphors

## 2. Color Palette & Roles

### Primary
- **Deep Navy** (`#1E1E2E`): Primary background, dominant neutral surface (most frequent usage)
- **Violet Accent** (`#8B5CF6`): Primary call-to-action, hero elements, key interactive states
- **Purple Gradient** (`#7C3AED`): Elevated primary actions, emphasis elements

### Accent Colors
- **Light Violet** (`#A78BFA`): Secondary accent, hover states on primary elements
- **Lightest Violet** (`#C4B5FD`): Tertiary accent, disabled states, background tints
- **Mid-Tone Gray** (`#606070`): Secondary emphasis, supporting text accents

### Interactive
- **Violet Glow** (`#8B5CF6`): Primary buttons, interactive focus states
- **Purple Deep** (`#7C3AED`): Button press/active states

### Neutral Scale
- **Near Black** (`#0A0A0A`): Darkest backgrounds, high contrast text base
- **Off Black** (`#141414`): Panel backgrounds, subtle contrast
- **Dark Charcoal** (`#0F0F0F`): Deep shadows, lowest contrast overlays
- **Gray Tone** (`#808090`): Subtle dividers, ghost text
- **Light Gray** (`#B0B0C0`): Disabled states, muted labels
- **Very Light Gray** (`#CCCCCC`): Minimal use, extreme contrast helpers

### Surface & Borders
- **Pure White** (`#FFFFFF`): Primary text, high emphasis content
- **Off White** (`#F8F0FF`): Light backgrounds, subtle surfaces, ghost buttons

### Semantic / Status
- **Error Red** (`#DC2626`): Error states, destructive actions
- **Success Green** (`#22C55E`): Confirmation, positive outcomes
- **Success Dark Green** (`#16A34A`): Success confirmation emphasis
- **Warning Yellow** (`#EAB308`): Caution, informational alerts

## 3. Typography Rules

### Font Family
**Primary:** Space Grotesk (`https://fonts.googleapis.com/`) — Sans-serif, geometric, modern. Fallback: `system-ui, -apple-system, sans-serif`

**Secondary:** Inter (`https://fonts.googleapis.com/`) — Clean, neutral sans-serif for body and UI text. Fallback: `system-ui, -apple-system, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / Hero | Space Grotesk | 68px | 700 | 70.72px | -0.02em | Brand impact, homepage hero |
| Heading 1 | Space Grotesk | 48px | 700 | 60px | -0.01em | Section titles, major sections |
| Heading 2 | Space Grotesk | 24px | 700 | 30px | 0px | Subsection titles, card headers |
| Heading 3 | Space Grotesk | 18px | 700 | 28px | 0px | Feature names, emphasis text |
| Body / Large | Inter | 20px | 600 | 27.5px | 0px | Primary body copy, descriptions |
| Body / Regular | Inter | 16px | 400 | 24px | 0px | General content, links, nav |
| Button / Label | Inter | 14px | 700 | 20px | 0px | Button text, small emphasis |
| Caption / Small | Inter | 14px | 400 | 20px | 0px | Secondary labels, metadata |

### Principles
- **Visual Hierarchy through Scale:** Display sizes anchor attention; moderate step progression prevents cognitive overload
- **Weight Variation:** Bold weights (600, 700) reserve for actionable and heading elements; 400 for readable body text
- **Line Height Generosity:** Increased line height on display text (1.04x–1.37x ratio) improves readability of short, impactful statements
- **Font Pairing:** Geometric Space Grotesk conveys innovation; neutral Inter ensures accessibility at smaller sizes
- **Letter Spacing Restraint:** Minimal adjustment on smaller text; slight negative spacing on display improves visual tightness

## 4. Component Stylings

### Buttons

**Primary Button (CTA)**
- Background: `#8B5CF6`
- Text Color: `#FFFFFF`
- Padding: `12px 24px`
- Border Radius: `12px`
- Border: `none`
- Font: Inter, 14px, 700
- Line Height: `20px`
- Height: `44px`
- Box Shadow: `rgba(124, 58, 237, 0.4) 0px 10px 15px -3px, rgba(124, 58, 237, 0.4) 0px 4px 6px -4px`
- Hover State: Background `#A78BFA`, shadow intensifies to `rgba(124, 58, 237, 0.5) 0px 10px 15px -3px, rgba(124, 58, 237, 0.5) 0px 4px 6px -4px`
- Active State: Background `#7C3AED`

**Secondary Button (Border)**
- Background: transparent
- Text Color: `#FFFFFF`
- Padding: `12px 24px`
- Border Radius: `12px`
- Border: `1px solid #2E2E4E`
- Font: Inter, 14px, 700
- Line Height: `20px`
- Height: `46px`
- Box Shadow: `none`
- Hover State: Border color `#606070`, background `rgba(139, 92, 246, 0.1)`
- Active State: Border color `#8B5CF6`

**Ghost Button (Tertiary)**
- Background: transparent
- Text Color: `#FFFFFF`
- Padding: `12px 16px`
- Border Radius: `12px`
- Border: `1px solid #2E2E4E`
- Font: Inter, 14px, 400
- Line Height: `20px`
- Height: `auto`
- Box Shadow: `none`
- Hover State: Text color `#A78BFA`, border `#606070`

**Text Button (Link Style)**
- Background: transparent
- Text Color: `#F8F0FF`
- Padding: `0px`
- Border Radius: `0px`
- Border: `none`
- Font: Inter, 16px, 400
- Line Height: `24px`
- Height: `auto`
- Box Shadow: `none`
- Hover State: Text color `#A78BFA`, text-decoration: underline

### Cards & Containers

**Card (Premium)**
- Background: `#0A0A0A`
- Border Radius: `12px`
- Border: `1px solid #2E2E4E`
- Padding: `24px`
- Box Shadow: `none`
- Hover State: Border `#606070`, background subtle shift to `#0F0F0F`

**Card (Highlighted/Popular)**
- Background: `#1E1E2E` with gradient overlay `linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)`
- Border Radius: `12px`
- Border: `1px solid #606070`
- Padding: `24px`
- Box Shadow: `rgba(124, 58, 237, 0.2) 0px 8px 24px`

**Surface Container**
- Background: `#1E1E2E`
- Border Radius: `12px`
- Padding: `32px`
- Border: `none`
- Box Shadow: `none`

### Inputs & Forms

**Text Input (Default)**
- Background: `#0A0A0A`
- Text Color: `#FFFFFF`
- Border: `1px solid #2E2E4E`
- Border Radius: `8px`
- Padding: `12px 16px`
- Font: Inter, 14px, 400
- Placeholder Color: `#808090`
- Height: `40px`
- Focus State: Border `#8B5CF6`, box-shadow `0px 0px 0px 3px rgba(139, 92, 246, 0.1)`

**Text Input (Error)**
- Border: `1px solid #DC2626`
- Background: `rgba(220, 38, 38, 0.05)`

**Text Input (Success)**
- Border: `1px solid #22C55E`

**Label**
- Font: Inter, 14px, 600
- Color: `#FFFFFF`
- Margin Bottom: `8px`

### Navigation

**Header Navigation**
- Background: `rgba(10, 10, 10, 0.95)` (semi-transparent with backdrop blur assumed)
- Height: `65px`
- Padding: `16px 40px`
- Border Bottom: `1px solid rgba(96, 96, 112, 0.2)`

**Navigation Link (Default)**
- Text Color: `#F8F0FF`
- Font: Inter, 16px, 400
- Line Height: `24px`
- Padding: `8px 16px`
- Border Radius: `6px`
- Background: transparent
- Hover State: Background `rgba(139, 92, 246, 0.1)`, text color `#A78BFA`
- Active State: Background `rgba(139, 92, 246, 0.2)`, text color `#8B5CF6`, border-bottom `2px solid #8B5CF6`

**Navigation Link (Small)**
- Text Color: `#808090`
- Font: Inter, 14px, 400
- Line Height: `20px`
- Hover State: Text color `#B0B0C0`

### Badges & Labels

**Badge (Default)**
- Background: `rgba(139, 92, 246, 0.15)`
- Text Color: `#A78BFA`
- Font: Inter, 12px, 600
- Padding: `4px 8px`
- Border Radius: `6px`
- Border: `1px solid rgba(139, 92, 246, 0.3)`

**Badge (Success)**
- Background: `rgba(34, 197, 94, 0.15)`
- Text Color: `#22C55E`
- Border: `1px solid rgba(34, 197, 94, 0.3)`

**Badge (Error)**
- Background: `rgba(220, 38, 38, 0.15)`
- Text Color: `#DC2626`
- Border: `1px solid rgba(220, 38, 38, 0.3)`

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Scale & Usage:**
- `4px`: Minimal internal padding, tight component spacing
- `8px`: Button/input padding, small gaps
- `12px`: Gap between small elements, form spacing
- `16px`: Standard padding, navigation margins
- `24px`: Card padding, section spacing
- `28px`: Medium section margins
- `32px`: Container padding, larger gaps
- `40px`: Horizontal page padding
- `48px`: Section margins, breathing room
- `56px`: Large container padding
- `64px`: Major section gaps, hero spacing
- `80px`: Page-level margins, vertical rhythm

**Principles:**
- Use multiples of `8px` for macroscopic spacing (sections, containers)
- Use `4px` increments for microscopic spacing (component internals)
- Respect visual weight: more whitespace around prominent content

### Grid & Container

**Max Width:** `1440px` (desktop full-bleed navigation observed)

**Column Strategy:** 12-column grid assumed for responsive layouts. Primary content area defaults to 10 columns with gutter of `32px`.

**Section Patterns:**
- Hero Section: Full-width background, centered content max-width `1200px`, padding `80px 40px`
- Feature Cards: 3-column grid on desktop, gap `32px`, card width responsive
- Navigation Bar: Full-width `1440px`, padding `16px 40px`
- Main Content: Max-width `1200px`, centered, padding `40px 80px`

### Whitespace Philosophy

FlashFusion employs **generous whitespace** to combat information density. Large margins and padding reduce cognitive load and emphasize key messaging. Vertical rhythm follows a baseline grid: major sections separated by `64px–80px`, subsections by `48px`, component groups by `32px`. This creates visual REST between content blocks, reinforcing the message of operational efficiency and speed.

### Border Radius Scale

- `0px`: Navigation bar, full-width containers
- `6px`: Small UI elements (labels, small buttons)
- `8px`: Form inputs, secondary containers
- `12px`: Primary buttons, cards, major containers
- `16px`: Large modal/overlay corners (inferred for consistency)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (L0) | No shadow, transparent background | Ghost buttons, disabled states, text overlays |
| Raised (L1) | `rgba(124, 58, 237, 0.4) 0px 10px 15px -3px, rgba(124, 58, 237, 0.4) 0px 4px 6px -4px` | Primary CTA buttons, interactive focus states |
| Elevated (L2) | `rgba(124, 58, 237, 0.5) 0px 10px 15px -3px, rgba(124, 58, 237, 0.5) 0px 4px 6px -4px` | Hover state on prominent buttons, modals |
| Floating (L3) | `rgba(124, 58, 237, 0.2) 0px 8px 24px` | Highlighted cards, featured sections, overlays |

**Shadow Philosophy:**

FlashFusion shadows are **chromatic and purposeful**—they leverage violet/purple hues rather than achromatic black, reinforcing the brand's technological identity. Shadows are always tied to interactive states, never static decoration. The shadow palette creates a sense of "floating" elevation while maintaining visual cohesion. Stacked shadow layers (combining `0px 10px 15px` and `0px 4px 6px` offsets) create dimensional depth without harshness. Opacity variance (0.4 to 0.5) provides subtle glow effects that guide user attention.

## 7. Do's and Don'ts

### Do
- **Use the violet accent (`#8B5CF6`) sparingly for CTAs** to maintain visual hierarchy and prevent alert fatigue
- **Pair dark backgrounds (`#1E1E2E`, `#0A0A0A`) with high-contrast text** (`#FFFFFF`, `#F8F0FF`) for accessibility
- **Apply chromatic shadows to interactive elements** to reinforce interactivity and depth
- **Maintain consistent `12px` border radius** on all buttons and cards for brand cohesion
- **Leverage generous spacing (`32px–48px`)** between sections to prevent visual clutter
- **Use Status colors (`#22C55E`, `#DC2626`, `#EAB308`)** exclusively for semantic feedback (success, error, warning)
- **Apply Inter font at sizes ≤16px** for body text to ensure readability; use Space Grotesk only for headings
- **Create focus states with `3px` violet glows** on all interactive elements for keyboard navigation
- **Respect the `8px` baseline grid** for all spacing decisions

### Don't
- **Avoid mixing violet with other accent colors** — stick to the primary palette
- **Don't apply shadows to non-interactive elements** — shadows signal interactivity
- **Avoid text smaller than 14px** without explicit justified rationale
- **Don't use pure black (`#000000`)** — use `#0A0A0A` or `#1E1E2E` instead
- **Avoid more than two levels of heading hierarchy** in a single page section
- **Don't apply rounded corners >12px** to primary UI elements (creates inconsistency)
- **Avoid using status colors (`#DC2626`, `#22C55E`) for general UI elements** — reserve exclusively for semantic states
- **Don't exceed `16px` line height on body text** (overcomes optimal readability threshold)
- **Avoid opacity-based overlays on dark backgrounds** without sufficient contrast verification
- **Don't apply box-shadows to disabled/inactive states** — reserve shadows for actionable elements only

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
|-----------------|-------|-------------|
| Mobile | 320px–479px | Single-column layout, full-width buttons, padding reduced to `16px`, font sizes reduce 10–15%, hero text size 36px |
| Tablet | 480px–1023px | 2-column grid for cards, padding `24px`, hero text size 48px, nav collapses to hamburger |
| Desktop | 1024px–1439px | 3-column card grids, standard padding `40px`, full navigation visible, max-width `1200px` |
| Large Desktop | 1440px+ | Full-width container `1440px`, 4-column grids possible, padding `80px` |

### Touch Targets

- **Minimum Interactive Height:** `44px` (buttons, inputs, links)
- **Minimum Interactive Width:** `44px` (icon buttons, toggle switches)
- **Padding Around Touch Targets:** `12px` minimum to prevent accidental activation
- **Spacing Between Buttons:** `16px` minimum on mobile, `24px` on desktop

### Collapsing Strategy

- **Hero Sections:** Full-height on desktop; reduce to `60vh` on tablet, `auto` on mobile
- **Card Grids:** 3-column desktop → 2-column tablet → 1-column mobile
- **Navigation:** Horizontal desktop bar → collapsible hamburger menu on tablet and below
- **Typography Scaling:** Apply `clamp()` function for fluid scaling: `h1: clamp(32px, 8vw, 68px)`, `h2: clamp(24px, 5vw, 48px)`, `body: clamp(14px, 2.5vw, 20px)`
- **Padding Reduction:** Desktop `40px` → Tablet `24px` → Mobile `16px`
- **Feature Lists:** Vertical stack on mobile, multi-column on desktop
- **Modals & Overlays:** Full-screen on mobile (<= 767px), centered max-width `90%` on tablet/desktop

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Violet (`#8B5CF6`) with shadow `rgba(124, 58, 237, 0.4) 0px 10px 15px -3px, rgba(124, 58, 237, 0.4) 0px 4px 6px -4px`
- **Background (Primary):** Deep Navy (`#1E1E2E`)
- **Background (Dark):** Near Black (`#0A0A0A`)
- **Heading Text:** Pure White (`#FFFFFF`)
- **Body Text:** Off White / Light Lavender (`#F8F0FF`)
- **Secondary Text:** Light Gray (`#B0B0C0`)
- **Borders / Dividers:** Mid Gray (`#606070`) or `#2E2E4E`
- **Error State:** Red (`#DC2626`)
- **Success State:** Green (`#22C55E`)
- **Warning State:** Yellow (`#EAB308`)
- **Disabled / Ghost:** Semi-transparent or `#808090`

### Iteration Guide

1. **All backgrounds must use dark neutrals from the palette** — never introduce new dark colors outside `#1E1E2E`, `#0A0A0A`, `#141414`, `#0F0F0F`
2. **Violet (`#8B5CF6`) is the exclusive CTA color** — all primary buttons use this with attached chromatic shadow
3. **Typography hierarchy is strictly: Space Grotesk for headers (24px–68px), Inter for body (14px–20px)** — no exceptions
4. **Border radius is uniform at `12px` for buttons/cards/containers** — smaller elements (inputs, badges) use `6px–8px`
5. **Spacing always follows the `8px` grid system** — use `4px` only for micro-adjustments within components
6. **Shadows are chromatic violet-based only** — no grayscale shadows; shadows attach only to interactive/elevated elements
7. **All interactive elements must have a focus state with `3px` violet glow** at `rgba(139, 92, 246, 0.2–0.3)` opacity
8. **Status colors (`#DC2626`, `#22C55E`, `#EAB308`) are reserved exclusively for semantic feedback** — never use for general UI tinting
9. **Contrast ratios must meet WCAG AA minimum (4.5:1 for text)** — verify text color against background before rendering
10. **Responsive breakpoints: apply mobile-first approach starting at 320px**, with progressive enhancement for tablet (480px) and desktop (1024px+)