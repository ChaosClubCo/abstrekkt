import { useState, useCallback, useMemo, useEffect } from "react";

const S = {
  base:"#0a0a0f",raised:"#111118",
  border:"#2a2a38",borderSub:"#1e1e28",
  accent:"hsl(262,83%,68%)",accentDim:"hsl(262,60%,45%)",
  text:"#f0f0f5",textSec:"#9898a8",textTer:"#52525e",
  success:"#22c55e",successBg:"rgba(34,197,94,0.12)",
  fontHead:"'Space Grotesk','DM Sans',sans-serif",
  fontBody:"'Inter','DM Sans',system-ui,sans-serif",
  fontMono:"'IBM Plex Mono','Fira Code',monospace",
};
const CDN = "https://cdn.jsdelivr.net/gh/Krosebrook/awesome-design-md@main/design-md";

// ─── LOCAL DESIGN.MD FILES ────────────────────────────────────────────────────

const LOCAL = {

"flashfusion": `---
version: alpha
name: FlashFusion
description: Cinematic AI agent orchestration platform. Deep purple void surface, electric violet-pink-cyan neon triad, glassmorphic card layer, Poppins display at weight 700-800, JetBrains Mono for data and code. Every surface either emits or absorbs light. Pure white (#FFFFFF) excluded from palette — minimum luminance surfaces only.

colors:
  surface-base:    "#0F0618"
  surface-raised:  "#1A0B2E"
  surface-overlay: "#251443"
  border-primary:  "rgba(168,85,247,0.2)"
  border-active:   "rgba(168,85,247,0.4)"
  accent-primary:  "#A855F7"
  accent-secondary:"#F472B6"
  accent-cyan:     "#22D3EE"
  gradient-accent: "linear-gradient(90deg,#A855F7 0%,#F472B6 55%,#22D3EE 100%)"
  glow-primary:    "0 0 20px rgba(168,85,247,0.4)"
  glow-secondary:  "0 0 20px rgba(244,114,182,0.3)"
  glow-subtle:     "0 0 12px rgba(168,85,247,0.2)"
  text-primary:    "#F8FAFC"
  text-secondary:  "#CBD5E1"
  text-tertiary:   "#64748B"

typography:
  display-3xl:
    fontFamily: "Poppins, Nunito, sans-serif"
    fontSize: 64px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -1.5px
  display-2xl:
    fontFamily: "Poppins, Nunito, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -1.0px
  display-xl:
    fontFamily: "Poppins, Nunito, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.5px
  heading-lg:
    fontFamily: "Poppins, Nunito, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.3px
  heading-md:
    fontFamily: "Inter, DM Sans, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.2px
  body-lg:
    fontFamily: "Inter, DM Sans, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, DM Sans, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  code:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  label:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.04em

rounded:
  sm:   8px
  md:   12px
  lg:   16px
  xl:   24px
  pill: 999px

spacing:
  xs:  4px
  sm:  8px
  md:  16px
  lg:  24px
  xl:  40px
  xxl: 64px
---

## Overview

FlashFusion is a cinematic AI agent orchestration platform. The design language is built on a single axiom: every surface either emits or absorbs light. There is no neutral. The deep void surface (\`#0F0618\`) is not a background — it is the absence of light, against which the electric violet-pink-cyan gradient triad reads as luminance, not color.

The neon-glass aesthetic is not decorative glassmorphism. Cards use \`backdrop-filter: blur(20px)\` on surfaces that have actual depth behind them — light from glowing orb decorations diffusing through frosted panels. This is structural, not cosmetic.

Poppins at weight 700–800 is the display typeface. It is not used for body copy. JetBrains Mono handles all data, code, metrics, and labels — the platform's relationship to technical precision is encoded typographically.

**Key characteristics:**
- Void black (\`#0F0618\`) base — not dark, absent. The gradient triad reads as emission against it.
- Three-color neon triad: violet \`#A855F7\`, pink \`#F472B6\`, cyan \`#22D3EE\`. The gradient runs left-to-right across these three stops.
- Glassmorphic cards: \`background: rgba(26,11,46,0.6); backdrop-filter: blur(20px)\` on raised surfaces with a violet border.
- Glow system: box-shadow glows at 20px spread for primary elements, 12px for subtle. Never pure white glow.
- JetBrains Mono for all metrics, timestamps, IDs, and code — the platform's technical voice.
- Pure white (\`#FFFFFF\`) is excluded from the palette. Off-white \`#F8FAFC\` is the maximum text luminance.
- No decorative rounded corners below 8px. All interactive elements use 8–16px radius.

## Colors

### Accent Triad
- **Violet** (\`{colors.accent-primary}\` — \`#A855F7\`): Primary CTA, active states, focus rings, brand signal.
- **Pink** (\`{colors.accent-secondary}\` — \`#F472B6\`): Hover states, secondary accents, gradient mid-stop.
- **Cyan** (\`{colors.accent-cyan}\` — \`#22D3EE\`): Gradient end-stop, data highlights, chart accents.
- **Gradient** (\`{colors.gradient-accent}\`): \`linear-gradient(90deg, #A855F7 0%, #F472B6 55%, #22D3EE 100%)\` — used on primary CTAs, heading underlines, progress bars.

### Surface Stack
- **Base** (\`{colors.surface-base}\` — \`#0F0618\`): Page background. The void.
- **Raised** (\`{colors.surface-raised}\` — \`#1A0B2E\`): Card fill base before glass overlay.
- **Overlay** (\`{colors.surface-overlay}\` — \`#251443\`): Modal, dropdown, tooltip surfaces.

### Borders
- **Primary** (\`{colors.border-primary}\` — \`rgba(168,85,247,0.2)\`): Default card and component border.
- **Active** (\`{colors.border-active}\` — \`rgba(168,85,247,0.4)\`): Hovered or focused component border.

### Text
- **Primary** (\`{colors.text-primary}\` — \`#F8FAFC\`): Maximum luminance text. Headings and key values.
- **Secondary** (\`{colors.text-secondary}\` — \`#CBD5E1\`): Body copy, descriptions.
- **Tertiary** (\`{colors.text-tertiary}\` — \`#64748B\`): Placeholder, disabled, metadata.

## Typography

### Principles
- **Poppins carries all display.** Weight 700–800 only. Never use Poppins at body size.
- **Inter carries all prose.** Weight 400–500 for all reading copy.
- **JetBrains Mono carries all data.** Every metric, timestamp, version string, and code snippet uses the mono voice.
- Negative tracking on display tiers: -1.5px at 64px, scaling to -0.3px at 24px. Headings compress toward the brand's technical density.
- No underlines on display headings unless using the gradient-accent underline as a design element.

### Scale

| Token | Size | Weight | Family | Use |
|---|---|---|---|---|
| display-3xl | 64px | 800 | Poppins | Hero/landing headline |
| display-2xl | 48px | 700 | Poppins | Section opener |
| display-xl | 32px | 700 | Poppins | Card featured title |
| heading-lg | 24px | 600 | Poppins | Section heading |
| heading-md | 20px | 500 | Inter | Subsection |
| body-lg | 16px | 400 | Inter | Feature description |
| body-md | 14px | 400 | Inter | Default UI body |
| code | 13px | 400 | JetBrains Mono | Code blocks, snippets |
| label | 11px | 400 | JetBrains Mono | Metrics, IDs, timestamps |

## Components

### Glassmorphic Card
- Background: \`rgba(26,11,46,0.6)\`
- Backdrop filter: \`blur(20px)\`
- Border: \`1px solid rgba(168,85,247,0.2)\`
- Border radius: \`{rounded.lg}\` 16px
- Padding: \`{spacing.lg}\` 24px
- On hover: border shifts to \`{colors.border-active}\`, subtle glow appears.

### Primary CTA Button
- Background: gradient-accent left-to-right.
- Text: \`{colors.text-primary}\`, \`{typography.body-lg}\`, weight 600.
- Padding: 12px 28px, rounded \`{rounded.md}\` 12px.
- Hover: \`filter: brightness(1.1)\`, \`box-shadow: {colors.glow-primary}\`.
- Active: scale(0.98).

### Ghost Button
- Background: transparent, border \`{colors.border-primary}\`.
- Text: \`{colors.accent-primary}\`.
- Hover: border shifts to \`{colors.border-active}\`, background \`rgba(168,85,247,0.1)\`.

### Metric Card
- Background: glassmorphic card pattern.
- Label: JetBrains Mono 11px, uppercase, \`{colors.text-tertiary}\`.
- Value: Poppins 32px weight 700, gradient-accent text (use background-clip: text).
- Delta: 12px Inter, green or red semantic with matching glow.

### Gradient Text
- \`background: {colors.gradient-accent}; -webkit-background-clip: text; -webkit-text-fill-color: transparent\`.
- Used on the main brand wordmark and key hero metrics.

## Glow System

| Level | CSS | Use |
|---|---|---|
| Primary | \`box-shadow: 0 0 20px rgba(168,85,247,0.4)\` | CTA buttons, active cards |
| Secondary | \`box-shadow: 0 0 20px rgba(244,114,182,0.3)\` | Secondary accents |
| Subtle | \`box-shadow: 0 0 12px rgba(168,85,247,0.2)\` | Default card glow |
| None | — | Body text, disabled elements |

Glows use box-shadow only — no filter: drop-shadow on inline elements (performance). Glow on text is via text-shadow at 8px spread max, violet only.

## Do's and Don'ts

### Do
- Use the gradient on exactly one primary CTA per screen. Dilution kills the signal.
- Apply JetBrains Mono to all numeric data. Numbers in Inter look casual in this system.
- Keep the void surface uncrowded. The dark background is doing work — don't cover it.
- Use glassmorphism only where there is actual depth behind the card (a glow orb, a gradient band). Fake glass on flat surfaces breaks the illusion.

### Don't
- Don't use pure white (\`#FFFFFF\`) anywhere in the UI — it blows out the void aesthetic.
- Don't use Inter or Roboto as display type. Poppins is non-negotiable at hero size.
- Don't add glow to body text. Glow is for interactive and structural elements only.
- Don't use the pink or cyan accents as standalone CTAs — they only appear in the gradient. Violet is the solo accent.
- Don't use more than three glassmorphic layers in a single viewport — stacked blur costs render performance.

## Responsive Behavior

| Breakpoint | Width | Key Changes |
|---|---|---|
| Wide | >= 1440px | Full orb decorations; 64px display type |
| Desktop | 1024-1440px | Default; 48px display |
| Tablet | 768-1023px | Reduced glow radius; 36px display |
| Mobile | < 768px | Single column; 28px display; blur reduced to blur(10px) |

Glassmorphic blur is reduced to \`blur(10px)\` on mobile for GPU performance. Glow spreads drop 50% at mobile breakpoint.
`,

// ─────────────────────────────────────────────────────────────────────────────

"int-inc": `---
version: alpha
name: INT (Intinc)
description: Enterprise-clean IT MSP platform. Void surface #0a0a0f, electric violet accent at hsl(262,83%,68%), flat cards with 1px hairline borders (no glassmorphism), Space Grotesk headings, Inter body. Accent is a signal — it appears on active states, badges, focus rings, and key metrics only. Dense but breathable on an 8pt grid. Navigation is command-palette-first.

colors:
  surface-base:    "#0a0a0f"
  surface-raised:  "#111118"
  surface-overlay: "#18181f"
  border-primary:  "#2a2a38"
  border-secondary:"#1e1e28"
  accent:          "hsl(262,83%,68%)"
  accent-dim:      "hsl(262,60%,45%)"
  accent-glow:     "hsla(262,83%,68%,0.15)"
  text-primary:    "#f0f0f5"
  text-secondary:  "#9898a8"
  text-tertiary:   "#52525e"
  success:         "#22c55e"
  warning:         "#f59e0b"
  error:           "#ef4444"
  info:            "#38bdf8"

typography:
  heading-xl:
    fontFamily: "Space Grotesk, DM Sans, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.5px
  heading-lg:
    fontFamily: "Space Grotesk, DM Sans, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.3px
  heading-md:
    fontFamily: "Space Grotesk, DM Sans, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.2px
  body-md:
    fontFamily: "Inter, DM Sans, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, DM Sans, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  code:
    fontFamily: "IBM Plex Mono, Fira Code, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  badge:
    fontFamily: "Inter, DM Sans, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.04em

rounded:
  sm: 4px
  md: 6px
  lg: 8px
  full: 999px

spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  6: 24px
  8: 32px
  10: 40px
  16: 64px
---

## Overview

INT is the internal and client-facing tooling platform for Intinc, an MSP. The design language is enterprise-clean: dense, accessible, and built to be trusted rather than admired. No glassmorphism, no glow, no decorative gradients. Cards are flat panels with 1px solid borders — every element earns its presence through function.

The void surface (\`{colors.surface-base}\` — \`#0a0a0f\`) is the consistent baseline. Raised panels (\`{colors.surface-raised}\`) sit one level above it with no visual tricks — just a slightly lighter dark with a hairline border. The system's entire chromatic budget is the single electric violet accent (\`{colors.accent}\`) — it signals action, status, and focus, appearing exactly where needed and nowhere else.

Space Grotesk handles all headings. Its geometric, slightly condensed structure reads as authoritative without being aggressive. Inter handles all body and label text. IBM Plex Mono handles code, log output, and any technical string. These three fonts and their weight constraints are the typographic system in full.

**Key characteristics:**
- Flat, not glossy. No backdrop-filter, no frosted glass, no depth effects.
- Accent is a signal. Violet \`hsl(262,83%,68%)\` appears on: active nav item, focus ring, badge, primary button, key metric value. Never decoratively.
- Dense but breathable: 8pt grid, 14px base body, tight line-heights. Information density is a feature, not a bug.
- Command palette is the primary navigation pattern. Sidebar max 4 icon tabs.
- Semantic colors are muted fills for backgrounds, bright for foreground text only.
- IBM Plex Mono for any technical output — logs, IDs, config values, code.

## Colors

### Surfaces
- **Base** (\`#0a0a0f\`): Page background. True void — no warmth, no cool cast.
- **Raised** (\`#111118\`): Cards, panels, table rows on hover.
- **Overlay** (\`#18181f\`): Modals, dropdowns, tooltips.

### Borders
- **Primary** (\`#2a2a38\`): Card borders, table dividers, structural separators.
- **Secondary** (\`#1e1e28\`): Subtle separators within panels.

### Accent (Violet)
- **Accent** (\`hsl(262,83%,68%)\`): Active state, primary button, focus ring, key metric, badge fill.
- **Accent Dim** (\`hsl(262,60%,45%)\`): Badge background fill, tinted surface behind accent text.
- **Accent Glow** (\`hsla(262,83%,68%,0.15)\`): Focus ring shadow only — \`box-shadow: 0 0 0 3px {colors.accent-glow}\`.

### Text
- **Primary** (\`#f0f0f5\`): Headings, key values, active labels.
- **Secondary** (\`#9898a8\`): Body copy, secondary labels.
- **Tertiary** (\`#52525e\`): Placeholder, disabled — large text only (11px+).

### Semantic
All semantic colors appear in two forms: bright foreground and muted background fill (\`rgba(color, 0.1)\`).
- Success: \`#22c55e\` / \`rgba(34,197,94,0.1)\`
- Warning: \`#f59e0b\` / \`rgba(245,158,11,0.1)\`
- Error: \`#ef4444\` / \`rgba(239,68,68,0.1)\`
- Info: \`#38bdf8\` / \`rgba(56,189,248,0.1)\`

## Components

### Card (Flat)
- Background: \`{colors.surface-raised}\`
- Border: \`1px solid {colors.border-primary}\`
- Border radius: \`{rounded.md}\` 6px
- Padding: \`{spacing.4}\` 16px
- No shadow, no glow, no blur.

### Primary Button
- Background: \`{colors.accent}\`, text white, border transparent.
- Padding: 8px 16px, radius \`{rounded.sm}\` 4px.
- Hover: \`opacity: 0.9\`.
- Focus: \`box-shadow: 0 0 0 3px {colors.accent-glow}\`.

### Badge
- Accent variant: background \`{colors.accent-dim}\`, text \`{colors.accent}\`.
- Semantic variants: muted fill + matching foreground.
- Type: 11px Inter, weight 500, 0.04em letter-spacing, uppercase.
- Padding: 4px 8px, radius \`{rounded.full}\`.

### Input
- Background: \`{colors.surface-base}\`, border \`{colors.border-primary}\`.
- Focus: border shifts to \`{colors.accent}\`, glow \`{colors.accent-glow}\`.
- Placeholder: \`{colors.text-tertiary}\`.
- 36px height, 6px radius, 13px Inter.

## Do's and Don'ts

### Do
- Keep accent usage sparse. If everything is violet, nothing is violet.
- Use IBM Plex Mono for any technical string — IDs, version numbers, config keys, log output.
- Maintain 8pt grid discipline. No 5px or 7px gaps.
- Use muted semantic fills for status backgrounds — bright color at full saturation reads as alert, not status.

### Don't
- No glassmorphism. INT tools are not for show.
- No gradient backgrounds — accent gradient is FlashFusion territory, not INT.
- Don't use Space Grotesk at body size — it's a heading font. Inter handles body.
- Don't use tertiary text on any background where it doesn't meet 3:1 contrast — tertiary is for large-text only.
`,

// ─────────────────────────────────────────────────────────────────────────────

"reading-room": `---
version: alpha
name: Reading Room at Midnight
description: Editorial dark system for the Claude Enablement Suite and personal-brand tools. Warm near-black canvas #0c0c0b, amber signal #d4893a, Playfair Display for display, IBM Plex Sans for UI, IBM Plex Mono for data. Reads like a well-worn hardcover opened under a single lamp at midnight — warm, intentional, unhurried.

colors:
  bg:        "#0c0c0b"
  surface:   "#111110"
  card:      "#181815"
  border:    "#232320"
  border-hi: "#303030"
  accent:    "#d4893a"
  accent-hi: "#e8a050"
  text:      "#ddd8ce"
  text-2:    "#807c74"
  text-3:    "#3a3835"
  mono:      "#7ab878"
  mono-2:    "#78afc8"
  red:       "#c05050"
  green:     "#5a9c5a"
  tag:       "#1e1e1a"

typography:
  display-lg:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.3px
  display-md:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.2px
  heading-lg:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.1px
  heading-md:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  mono-body:
    fontFamily: "IBM Plex Mono, Fira Code, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  mono-sm:
    fontFamily: "IBM Plex Mono, Fira Code, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.02em
  label:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.06em

rounded:
  xs: 3px
  sm: 4px
  md: 6px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
---

## Overview

Reading Room at Midnight is the personal-brand and internal-tools design system used across the Claude Enablement Suite hub and all non-FlashFusion, non-INT tooling. The aesthetic is direct: a well-worn hardcover opened under a single desk lamp at midnight. Warm without being cozy. Focused without being clinical.

The near-black canvas (\`{colors.bg}\` — \`#0c0c0b\`) carries a faint yellow undertone — not cool-gray dark. Every surface builds incrementally warmer: \`surface\` → \`card\` → \`border-hi\`. The amber accent (\`{colors.accent}\` — \`#d4893a\`) is the lamp. It illuminates exactly what needs illuminating and nothing else.

Playfair Display handles display-tier headings — the literary register. IBM Plex Sans handles all UI copy. IBM Plex Mono handles data outputs, status values, and code. Two monochrome accent colors complete the technical palette: mono-green (\`{colors.mono}\`) for positive states and data labels, mono-blue (\`{colors.mono-2}\`) for informational links and secondary data.

**Key characteristics:**
- Warm near-black (\`#0c0c0b\`) with subtle yellow undertone — not gray, not charcoal.
- Amber accent (\`#d4893a\`) used sparingly: active state, primary action, highlight metric.
- Playfair Display at heading level only. IBM Plex Sans for all UI copy.
- IBM Plex Mono for all technical output — status values, counts, IDs, timestamps.
- Borders are always warm (\`#232320\` base, \`#303030\` hover) — never cool gray.
- Compact density: 12px default spacing unit, not 16px.
- Tag fills at \`{colors.tag}\` (\`#1e1e1a\`) — warm near-black, not accent-tinted.
- No glassmorphism, no glow. Light is metaphorical (the amber accent), not literal (CSS box-shadow glow).

## Colors

### Canvas Stack (warmest to brightest)
- **Background** (\`#0c0c0b\`): Page canvas. Warm near-black — the midnight room.
- **Surface** (\`#111110\`): Panels, toolbars, nav.
- **Card** (\`#181815\`): Raised card surfaces.
- **Border** (\`#232320\`): Default hairline border.
- **Border Highlight** (\`#303030\`): Hovered border, active card outline.

### Accent
- **Amber** (\`#d4893a\`): The only warm color in the palette. CTA, active state, metric highlight. Used sparsely — one per screen.
- **Amber High** (\`#e8a050\`): Hover state for amber elements.

### Text
- **Primary** (\`#ddd8ce\`): Warm near-white. Not pure white — the paper color.
- **Secondary** (\`#807c74\`): Muted body and label text.
- **Tertiary** (\`#3a3835\`): Placeholder, disabled — large text only.

### Technical Accents
- **Mono Green** (\`#7ab878\`): Positive states, passing metrics, success indicators.
- **Mono Blue** (\`#78afc8\`): Informational links, secondary data labels.
- **Red** (\`#c05050\`): Error and destructive states.
- **Green** (\`#5a9c5a\`): Success confirmations.

## Typography

### Principles
- Playfair Display belongs to the brand's reflective register — document headers, section openers, titles. Never at body size.
- IBM Plex Sans is the workhorse — readable, warm, professional. All UI body and label text.
- IBM Plex Mono carries technical precision — every numeric status, every ID, every code output. Mono green and mono blue apply to technical data in context.
- Labels are always uppercase with 0.06em tracking. No lowercase labels.

## Components

### Card
- Background: \`{colors.card}\`
- Border: \`1px solid {colors.border}\`
- Radius: \`{rounded.md}\` 6px
- Padding: \`{spacing.lg}\` 16px
- Hover: border shifts to \`{colors.border-hi}\`

### Tag / Chip
- Background: \`{colors.tag}\`
- Border: \`1px solid {colors.border}\`
- Text: 11px IBM Plex Sans weight 500, \`{colors.text-2}\`
- Radius: \`{rounded.xs}\` 3px
- Padding: 3px 7px

### Primary Action
- Background transparent, border \`rgba(212,137,58,0.4)\`
- Color: \`{colors.accent}\`
- Hover: border \`rgba(212,137,58,0.7)\`, background \`rgba(212,137,58,0.08)\`
- Radius: \`{rounded.sm}\` 4px, padding 8px 14px
- Type: 12px IBM Plex Mono, 0.5px letter-spacing

### Metric / Status Value
- Font: IBM Plex Mono 13px
- Color: context-dependent: amber for primary KPI, mono-green for positive, mono-blue for informational, red for error
- Label above: 11px IBM Plex Sans uppercase, \`{colors.text-2}\`, 0.06em tracking

## Do's and Don'ts

### Do
- Use Playfair Display for document-level titles and section openers. It establishes the register.
- Keep amber usage sparse — it is the lamp, not the room. One primary action per panel.
- IBM Plex Mono for every technical string without exception.
- Use warm borders (\`#232320\` / \`#303030\`) — cool gray borders break the warmth.

### Don't
- Don't use pure white (\`#FFFFFF\`) — the text-primary ceiling is \`#ddd8ce\` for a reason.
- Don't use accent-tinted card backgrounds — all cards are warm-dark, not violet or amber-tinted.
- Don't use Inter or system-ui — IBM Plex Sans is the body font. The warm character of Plex is structural.
- Don't add glow or glassmorphism — light in this system is amber and metaphorical, not CSS.
`,

// ─────────────────────────────────────────────────────────────────────────────

"app-registry": `---
version: alpha
name: FlashFusion App Registry
description: Terminal-aesthetic project tracker for the FlashFusion/INT/Personal app portfolio. Pure black #000, warm text #e8e0d4, Anton display at 40px, Instrument Mono for all UI copy and data. Scan-line body overlay. Three lane colors: FF orange #d4652a, INT teal #10a37f, Personal violet #7c6af7. Monospace-everything, zero decoration, maximum data density.

colors:
  bg:        "#000000"
  surface:   "#0c0c0c"
  border:    "#1e1e1e"
  dim2:      "#111111"
  text:      "#e8e0d4"
  muted:     "#444444"
  ff-orange: "#d4652a"
  int-teal:  "#10a37f"
  per-violet:"#7c6af7"
  s-live:    "#10a37f"
  s-beta:    "#4a9eff"
  s-dev:     "#d4652a"
  s-review:  "#ffb800"
  s-concept: "#7c6af7"
  s-archived:"#555555"

typography:
  wordmark:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: 1px
  ui:
    fontFamily: "Instrument Mono, IBM Plex Mono, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  ui-sm:
    fontFamily: "Instrument Mono, IBM Plex Mono, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  ui-xs:
    fontFamily: "Instrument Mono, IBM Plex Mono, monospace"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.3px
  label:
    fontFamily: "Instrument Mono, IBM Plex Mono, monospace"
    fontSize: 9px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 1.2px
  stat-number:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0

rounded:
  default: 3px
  sm:      2px
  none:    0

spacing:
  xs: 3px
  sm: 6px
  md: 10px
  lg: 16px
  xl: 20px
---

## Overview

The FlashFusion App Registry is a data-dense terminal tracker for the full app portfolio across FlashFusion, INT, and Personal lanes. The design aesthetic is pure terminal: every element is monospace, every surface is near-black, every color is functional lane or status information rather than branding decoration.

The wordmark uses **Anton** at 40px — a bold condensed display typeface that reads like a stencil label or an industrial nameplate. It is the only non-monospace element on the page. Everything else — labels, table data, search inputs, stat numbers, navigation chips, status pills — runs on **Instrument Mono**. This creates a flat, technical reading experience where color carries all the meaning.

The scan-line overlay is structural: \`body::after\` uses \`repeating-linear-gradient\` at 4px intervals with 4% opacity. It gives the black surface texture without adding visual complexity.

Three lane colors function as categorical identifiers throughout: FF orange (\`#d4652a\`) for FlashFusion projects, INT teal (\`#10a37f\`) for Intinc work, Personal violet (\`#7c6af7\`) for personal-lane builds. Status has its own six-color set that never bleeds into lane colors.

**Key characteristics:**
- Pure black (\`#000000\`) canvas with scan-line texture overlay at 4% opacity.
- Anton (condensed display) for wordmark only. Every other element is Instrument Mono.
- Three lane colors used as categorical badges — FF orange, INT teal, Personal violet.
- Six status states with distinct pill styles — live, beta, dev, review, concept, archived.
- No rounded corners above 4px. All radius values are \`3px\` default.
- Stat numbers use Anton at 18px for visual hierarchy without disrupting the monospace texture.
- Table headers are uppercase 9px Instrument Mono with 1.2px letter-spacing.
- No shadows, no glow, no blur. Flat monochrome with color-as-data.

## Colors

### Lane Colors (categorical only — appear in badges and table rows)
- **FF Orange** (\`#d4652a\`): FlashFusion lane. The brand's signal in registry context.
- **INT Teal** (\`#10a37f\`): INT/Intinc lane. Enterprise-green, distinct from FF.
- **Personal Violet** (\`#7c6af7\`): Personal lane. Soft violet, not the INT electric violet.

### Status Colors (pills only — never decorative)
- **Live** (\`#10a37f\`): Deployed and active — matches INT teal intentionally.
- **Beta** (\`#4a9eff\`): Live but limited access.
- **Dev** (\`#d4652a\`): In development — matches FF orange.
- **Review** (\`#ffb800\`): Awaiting review, amber.
- **Concept** (\`#7c6af7\`): Concept/idea phase.
- **Archived** (\`#555555\`): Decommissioned.

### Surface
- **BG** (\`#000000\`): True black. With scan-line overlay.
- **Surface** (\`#0c0c0c\`): Slightly raised — expanded row, hover state.
- **Dim2** (\`#111111\`): Table header fill.
- **Border** (\`#1e1e1e\`): All hairline borders.
- **Text** (\`#e8e0d4\`): Main text — warm off-white. Not pure white.
- **Muted** (\`#444444\`): Placeholder, disabled, secondary labels.

## Typography

### Principles
- Anton for the wordmark only. Its visual weight anchors the header without competing with data.
- Instrument Mono for all UI text. The monospace grid gives the registry its terminal character.
- Table column headers: 9px, letter-spacing 1.2px, uppercase, color \`{colors.muted}\`.
- All data cells: 11px Instrument Mono, color \`{colors.text}\`.
- Stat block values: Anton 18px (breaks the monospace rhythm intentionally to create hierarchy).
- Lane/status labels: 9px Instrument Mono, letter-spacing 0.5px, matching lane or status color.

## Components

### Lane Badge
- Padding: 2px 7px, radius 2px, border 1px at 30% opacity of lane color.
- Background: lane color at 10% opacity.
- Text: lane color at full opacity, 9px Instrument Mono, 0.5px letter-spacing.

### Status Pill
- Same geometry as lane badge.
- Text: status color. Background: status color at 10% opacity. Border: status color at 30% opacity.
- Clickable — triggers status cycle. Hover: \`filter: brightness(1.3)\`.

### Table Row
- Default: no background.
- Hover: background \`{colors.surface}\`, transition 100ms.
- Expanded: background \`{colors.surface}\`, border-bottom none (row bleeds into detail panel).

### Stat Block
- Label: 9px Instrument Mono, letter-spacing 1.5px, uppercase, \`{colors.muted}\`.
- Number: Anton 18px, lane-appropriate color.
- Container: \`{colors.surface}\` background, \`{colors.border}\` border, 4px radius, 6px 12px padding.

### Filter Chip
- Inactive: background transparent, border \`{colors.border}\`, text \`{colors.muted}\`.
- Active: border and text shift to lane or category color. Background: color at 8% opacity.
- 9px Instrument Mono, 0.6px letter-spacing, 5px 10px padding, 3px radius.

## Scan-Line Overlay

\`\`\`css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    transparent, transparent 3px,
    rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px
  );
  pointer-events: none;
  z-index: 0;
}
\`\`\`

This is non-negotiable. Without the scan-line the black surface reads as a flat void without texture.

## Do's and Don'ts

### Do
- Use Anton only on the wordmark and stat numbers. Everywhere else is monospace.
- Keep the scan-line overlay — it gives the black canvas texture.
- Use lane and status colors only for their categorical function. Never as generic accents.
- Warm off-white (\`#e8e0d4\`) for text — not pure white.

### Don't
- Don't round corners above 4px. The terminal aesthetic requires sharp geometry.
- Don't use gradients, shadows, or blur anywhere in the registry UI.
- Don't use Inter, Roboto, or any proportional font at UI size — Instrument Mono only.
- Don't mix lane and status colors in the same badge — they are distinct semantic layers.
`,

// ─────────────────────────────────────────────────────────────────────────────

"chaosclub": `---
version: alpha
name: Chaos Club Co.
description: Peer-support mental health platform. Earth-dark canvas, burnt orange signal, Playfair Display literary voice, IBM Plex Sans utility body. Anti-wellness. No gradients masquerading as hope. No masks required.

colors:
  primary:      "#d4651c"
  primary-deep: "#b5531a"
  canvas:       "#faf7f4"
  canvas-warm:  "#f5f3f0"
  canvas-dark:  "#3d2f27"
  teal:         "#2d5a5a"
  ink:          "#1a1a1a"
  ink-mute:     "#888888"
  on-primary:   "#ffffff"
  border:       "#e0dcd6"

typography:
  display-xl:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.8px
  display-lg:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.5px
  body-lg:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  pillar:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0

rounded:
  md: 8px
  pill: 9999px
---

## Overview

Chaos Club Co. is not a wellness brand. Earth-dark canvas, burnt orange signal, Playfair Display literary headlines, IBM Plex Sans body. Anti-toxic-positivity. No rounded pill buttons — the brand does not perform softness.

**Tagline:** "Breathe Through the Bullsh*t™ — Because 'just breathe' doesn't f*cking cut it."

## The 15 Pillars

1. No masks required. No perfection expected.
2. Normal is a moving target.
3. Growth is uncomfortable. You in?
4. Chaos is normal. Pretending isn't.
5. Be human. The rest is optional.
6. Shout it. Whisper it. Feel it. (Repeat.)
7. Some cycles are meant to be broken.
8. Embrace the mess. Make room for the good shit.
9. Chaos organized. Life upgraded.
10. Perfect is for robots.
11. Uncomfortable? Good. That's growth.
12. Progress. Not pretending.
13. Mental health is human health.
14. No shame in the chaos. No shame in the climb.
15. You belong here. Even if you don't think you do.

## Colors

- **Burnt Orange** \`#d4651c\` — signal CTA, one per band. Never decorative.
- **Canvas Dark** \`#3d2f27\` — hero and closing CTA gradient start.
- **Teal** \`#2d5a5a\` — hero gradient end-stop only.
- **Canvas** \`#faf7f4\` — warm off-white, not clinical white.

## Typography

Playfair Display 700 for all display tiers. IBM Plex Sans 400 for body. 1.75 line-height throughout — the platform serves people in distress. They need air.

## Do's and Don'ts

Do: Use burnt orange for exactly one CTA per band. Apply earth-dark/teal gradient on every hero.
Don't: Pill buttons. Teal color scheme (wellness territory). "Be your best self." Progress gradients. Grade people.
`
};

// ─── BRAND DATA ───────────────────────────────────────────────────────────────

const BRANDS = [
  {id:"airbnb",      name:"Airbnb",                cat:"E-Commerce",   desc:"Warm coral accent, photography-driven, rounded UI",                       bg:"#FFFFFF",accent:"#FF5A5F"},
  {id:"airtable",    name:"Airtable",              cat:"Design",       desc:"Colorful, friendly, structured data aesthetic",                            bg:"#F7F7F7",accent:"#FFB200"},
  {id:"apple",       name:"Apple",                 cat:"Media",        desc:"Premium white space, SF Pro, cinematic full-bleed imagery",                bg:"#FFFFFF",accent:"#0071E3"},
  {id:"binance",     name:"Binance",               cat:"Fintech",      desc:"Bold yellow on monochrome, trading-floor urgency",                         bg:"#0B0E11",accent:"#F3BA2F"},
  {id:"bmw",         name:"BMW",                   cat:"Automotive",   desc:"Dark premium surfaces, precise German engineering",                         bg:"#1A1A1A",accent:"#0066CC"},
  {id:"bmw-m",       name:"BMW M",                 cat:"Automotive",   desc:"Motorsport contrast, M tri-color accents, precision layout",               bg:"#0A0A0A",accent:"#C0392B"},
  {id:"bugatti",     name:"Bugatti",               cat:"Automotive",   desc:"Cinema-black canvas, monochrome austerity, monumental display type",       bg:"#000000",accent:"#C9A84C"},
  {id:"cal",         name:"Cal.com",               cat:"Productivity", desc:"Open-source scheduling, neutral UI, developer-oriented simplicity",        bg:"#FFFFFF",accent:"#292929"},
  {id:"claude",      name:"Claude",                cat:"AI & LLM",     desc:"Warm terracotta accent on cream, clean editorial layout",                  bg:"#FAF0EB",accent:"#D97949"},
  {id:"clay",        name:"Clay",                  cat:"Design",       desc:"Organic shapes, soft gradients, art-directed layout",                      bg:"#F9F5FF",accent:"#C084FC"},
  {id:"clickhouse",  name:"ClickHouse",            cat:"Backend",      desc:"Fast analytics DB, yellow-accented technical documentation style",         bg:"#1A1A1A",accent:"#FAFF69"},
  {id:"cohere",      name:"Cohere",                cat:"AI & LLM",     desc:"Vibrant gradients, data-rich enterprise dashboard aesthetic",              bg:"#0A0B0D",accent:"#39B5FF"},
  {id:"coinbase",    name:"Coinbase",              cat:"Fintech",      desc:"Clean blue identity, trust-focused, institutional feel",                   bg:"#FFFFFF",accent:"#0052FF"},
  {id:"composio",    name:"Composio",              cat:"Backend",      desc:"Tool integration platform, modern dark with colorful icons",               bg:"#0D0D0D",accent:"#FF6B35"},
  {id:"cursor",      name:"Cursor",                cat:"Dev Tools",    desc:"AI-first code editor, sleek dark interface, gradient accents",             bg:"#0A0A0F",accent:"#5B5BFF"},
  {id:"elevenlabs",  name:"ElevenLabs",            cat:"AI & LLM",     desc:"Dark cinematic UI, audio-waveform aesthetics, stark contrast",            bg:"#0D0D0D",accent:"#F5F5F5"},
  {id:"expo",        name:"Expo",                  cat:"Dev Tools",    desc:"React Native platform, dark theme, tight tracking, code-centric",          bg:"#111111",accent:"#FFFFFF"},
  {id:"ferrari",     name:"Ferrari",               cat:"Automotive",   desc:"Chiaroscuro editorial, Ferrari Red with extreme sparseness",               bg:"#0A0A0A",accent:"#D40000"},
  {id:"figma",       name:"Figma",                 cat:"Design",       desc:"Vibrant multi-color system, playful yet professional",                     bg:"#0A0A0A",accent:"#A259FF"},
  {id:"framer",      name:"Framer",                cat:"Design",       desc:"Bold black and blue, motion-first, design-forward",                       bg:"#0A0A0A",accent:"#0099FF"},
  {id:"hashicorp",   name:"HashiCorp",             cat:"Backend",      desc:"Infrastructure automation, enterprise-clean black and white",              bg:"#FFFFFF",accent:"#000000"},
  {id:"ibm",         name:"IBM",                   cat:"Media",        desc:"Carbon design system, structured blue palette, dense documentation",       bg:"#161616",accent:"#0F62FE"},
  {id:"intercom",    name:"Intercom",              cat:"Productivity", desc:"Friendly blue palette, conversational UI patterns",                       bg:"#FFFFFF",accent:"#1F8DED"},
  {id:"kraken",      name:"Kraken",                cat:"Fintech",      desc:"Purple-accented dark UI, data-dense trading dashboards",                  bg:"#121218",accent:"#5741D9"},
  {id:"lamborghini", name:"Lamborghini",           cat:"Automotive",   desc:"True black cathedral, gold accent, custom Neo-Grotesk LamboType",         bg:"#000000",accent:"#C9A84C"},
  {id:"linear.app",  name:"Linear",                cat:"Productivity", desc:"Ultra-minimal, software-craft dense, lavender-blue signature accent",      bg:"#010102",accent:"#5E6AD2"},
  {id:"lovable",     name:"Lovable",               cat:"Dev Tools",    desc:"AI full-stack builder, playful gradients, friendly dev aesthetic",         bg:"#0F0F1A",accent:"#FF6B9D"},
  {id:"mastercard",  name:"Mastercard",            cat:"Fintech",      desc:"Warm cream canvas, orbital pill shapes, editorial warmth",                 bg:"#F7F2EB",accent:"#EB001B"},
  {id:"meta",        name:"Meta",                  cat:"E-Commerce",   desc:"Photography-first, binary light/dark surfaces, Meta Blue CTAs",           bg:"#FFFFFF",accent:"#0866FF"},
  {id:"minimax",     name:"Minimax",               cat:"AI & LLM",     desc:"Bold dark interface with neon accents and model-provider energy",          bg:"#0A0A0A",accent:"#00FF9D"},
  {id:"mintlify",    name:"Mintlify",              cat:"Productivity", desc:"Documentation platform, green-accented, reading-optimized",               bg:"#FFFFFF",accent:"#16A34A"},
  {id:"miro",        name:"Miro",                  cat:"Design",       desc:"Bright yellow accent, infinite-canvas collaboration aesthetic",            bg:"#FFFFFF",accent:"#FFD02F"},
  {id:"mistral.ai",  name:"Mistral AI",            cat:"AI & LLM",     desc:"French-engineered minimalism, purple-toned, open-weight LLM energy",      bg:"#1A1A2E",accent:"#7B5EA7"},
  {id:"mongodb",     name:"MongoDB",               cat:"Backend",      desc:"Green leaf branding, developer documentation focus, document-first",       bg:"#001E2B",accent:"#00ED64"},
  {id:"nike",        name:"Nike",                  cat:"E-Commerce",   desc:"Monochrome UI, massive uppercase Futura, full-bleed photography",          bg:"#FFFFFF",accent:"#111111"},
  {id:"notion",      name:"Notion",                cat:"Productivity", desc:"Warm minimalism, serif headings, soft neutral surfaces",                   bg:"#FFFFFF",accent:"#000000"},
  {id:"nvidia",      name:"NVIDIA",                cat:"Media",        desc:"Green-black energy, technical power aesthetic, GPU computing brand",       bg:"#0A0A0A",accent:"#76B900"},
  {id:"ollama",      name:"Ollama",                cat:"AI & LLM",     desc:"Run LLMs locally, terminal-first, monochrome simplicity",                 bg:"#111111",accent:"#F0F0F0"},
  {id:"opencode.ai", name:"OpenCode AI",           cat:"AI & LLM",     desc:"AI coding platform, developer-centric dark theme",                        bg:"#0F0F0F",accent:"#61DAFB"},
  {id:"pinterest",   name:"Pinterest",             cat:"Media",        desc:"Red accent, masonry grid, visual discovery image-first",                   bg:"#FFFFFF",accent:"#E60023"},
  {id:"playstation", name:"PlayStation",           cat:"Media",        desc:"Three-surface channel layout, cyan hover-scale interaction",               bg:"#0A0A0A",accent:"#00439C"},
  {id:"posthog",     name:"PostHog",               cat:"Backend",      desc:"Playful hedgehog branding, developer-friendly dark UI, analytics",         bg:"#1D1E21",accent:"#FF5E24"},
  {id:"raycast",     name:"Raycast",               cat:"Dev Tools",    desc:"Productivity launcher, sleek dark chrome, vibrant gradient accents",       bg:"#1A1A2E",accent:"#FF6363"},
  {id:"renault",     name:"Renault",               cat:"Automotive",   desc:"Vivid aurora gradients, NouvelR typeface, zero-radius buttons",            bg:"#1A1A1A",accent:"#EFDF00"},
  {id:"replicate",   name:"Replicate",             cat:"AI & LLM",     desc:"Run ML models via API, clean white canvas, code-forward",                 bg:"#FFFFFF",accent:"#000000"},
  {id:"resend",      name:"Resend",                cat:"Productivity", desc:"Email API for developers, minimal dark theme, monospace accents",          bg:"#000000",accent:"#FFFFFF"},
  {id:"revolut",     name:"Revolut",               cat:"Fintech",      desc:"Sleek dark interface, gradient cards, fintech precision",                  bg:"#0A0A14",accent:"#7654FF"},
  {id:"runwayml",    name:"Runway",                cat:"AI & LLM",     desc:"Cinematic dark heroes, paper-white reading bands, film-festival feel",     bg:"#0A0A0A",accent:"#FFFFFF"},
  {id:"sanity",      name:"Sanity",                cat:"Backend",      desc:"Dark editorial, IBM Plex Mono eyebrows, coral-red CTA",                    bg:"#101010",accent:"#F03E2F"},
  {id:"sentry",      name:"Sentry",                cat:"Backend",      desc:"Error monitoring, dark data-dense dashboard, pink-purple accent",          bg:"#1A1A2E",accent:"#8B44FF"},
  {id:"shopify",     name:"Shopify",               cat:"E-Commerce",   desc:"Dark-first cinematic, neon green accent, ultra-light display type",        bg:"#0A0A0A",accent:"#95BF47"},
  {id:"slack",       name:"Slack",                 cat:"Productivity", desc:"Deep aubergine primary, cream-lavender hero gradients, pill CTAs",         bg:"#4A154B",accent:"#ECB22E"},
  {id:"spacex",      name:"SpaceX",                cat:"Media",        desc:"Stark black and white, full-bleed imagery, futuristic minimalism",         bg:"#000000",accent:"#FFFFFF"},
  {id:"spotify",     name:"Spotify",               cat:"Media",        desc:"Vibrant green on dark, bold type, album-art-driven layouts",               bg:"#000000",accent:"#1DB954"},
  {id:"starbucks",   name:"Starbucks",             cat:"E-Commerce",   desc:"Four-tier earth-green system, warm cream canvas, proprietary SoDoSans",    bg:"#FAF3E0",accent:"#00704A"},
  {id:"stripe",      name:"Stripe",                cat:"Fintech",      desc:"Signature indigo gradients, weight-300 elegance, tabular money type",      bg:"#FFFFFF",accent:"#533AFD"},
  {id:"supabase",    name:"Supabase",              cat:"Backend",      desc:"Firebase alternative, dark emerald theme, code-first, open-source",        bg:"#1C1C1C",accent:"#3ECF8E"},
  {id:"superhuman",  name:"Superhuman",            cat:"Dev Tools",    desc:"Premium dark UI, keyboard-first, purple glow, email perfection",           bg:"#0A0A14",accent:"#7B55FF"},
  {id:"tesla",       name:"Tesla",                 cat:"Automotive",   desc:"Radical subtraction, cinematic full-viewport photography, Universal Sans", bg:"#000000",accent:"#E82127"},
  {id:"theverge",    name:"The Verge",             cat:"Media",        desc:"Acid-mint and ultraviolet accents, Manuka display type, tech editorial",   bg:"#1B002A",accent:"#00E7FF"},
  {id:"together.ai", name:"Together AI",           cat:"AI & LLM",     desc:"Open-source AI infrastructure, technical blueprint-style design",          bg:"#0C1225",accent:"#5B8CFF"},
  {id:"uber",        name:"Uber",                  cat:"Media",        desc:"Bold black and white, tight type, urban energy, mobility precision",       bg:"#FFFFFF",accent:"#000000"},
  {id:"vercel",      name:"Vercel",                cat:"Dev Tools",    desc:"Black and white precision, Geist font, shadow-as-border technique",        bg:"#000000",accent:"#FFFFFF"},
  {id:"vodafone",    name:"Vodafone",              cat:"Media",        desc:"Monumental uppercase display, Vodafone Red chapter bands",                 bg:"#FFFFFF",accent:"#E60000"},
  {id:"voltagent",   name:"VoltAgent",             cat:"AI & LLM",     desc:"Void-black canvas, emerald accent, terminal-native agent framework",       bg:"#000000",accent:"#10B981"},
  {id:"warp",        name:"Warp",                  cat:"Dev Tools",    desc:"Modern terminal, dark IDE-like interface, block-based command UI",          bg:"#0E1117",accent:"#01A9FF"},
  {id:"webflow",     name:"Webflow",               cat:"Design",       desc:"Blue-accented, polished marketing site aesthetic, visual web builder",      bg:"#020917",accent:"#146EF5"},
  {id:"wired",       name:"WIRED",                 cat:"Media",        desc:"Paper-white broadsheet density, custom serif, ink-blue links",              bg:"#FFFFFF",accent:"#0C2340"},
  {id:"wise",        name:"Wise",                  cat:"Fintech",      desc:"International transfers, bright teal-green accent, friendly and clear",     bg:"#FFFFFF",accent:"#00B9A5"},
  {id:"x.ai",        name:"xAI",                   cat:"AI & LLM",     desc:"Elon Musk's AI lab, stark monochrome, futuristic minimalism",              bg:"#000000",accent:"#FFFFFF"},
  {id:"zapier",      name:"Zapier",                cat:"Productivity", desc:"Automation platform, warm orange, friendly illustration-driven",            bg:"#FFFFFF",accent:"#FF4A00"},
  // ─── ORIGINALS ───
  {id:"flashfusion",  name:"FlashFusion",          cat:"Original",     desc:"Cinematic AI platform. Void purple #0F0618, neon violet/pink/cyan triad, glassmorphic cards, Poppins 800 display, JetBrains Mono data.",     bg:"#0F0618",accent:"#A855F7",local:true},
  {id:"int-inc",      name:"INT (Intinc)",          cat:"Original",     desc:"Enterprise MSP tooling. Void black, electric violet hsl(262,83%,68%), flat hairline-border cards, Space Grotesk + Inter.",                 bg:"#0a0a0f",accent:"hsl(262,83%,68%)",local:true},
  {id:"reading-room", name:"Reading Room at Midnight",cat:"Original",  desc:"Editorial dark personal-brand suite. Warm #0c0c0b canvas, amber #d4893a signal, Playfair Display + IBM Plex Sans.",                         bg:"#0c0c0b",accent:"#d4893a",local:true},
  {id:"app-registry", name:"App Registry",          cat:"Original",     desc:"Terminal-monospace portfolio tracker. Pure black, scan-line overlay, Anton wordmark, Instrument Mono UI, FF/INT/Personal lane colors.",    bg:"#000000",accent:"#d4652a",local:true},
  {id:"chaosclub",    name:"Chaos Club Co.",        cat:"Original",     desc:"Peer support platform. Earth-dark + burnt orange. Anti-wellness. No masks required.",                                                       bg:"#3d2f27",accent:"#d4651c",local:true},
];

const CATS = ["All","Original",...Array.from(new Set(BRANDS.filter(b=>!b.local).map(b=>b.cat))).sort()];

function luma(hex){
  const h=hex.replace("#","");
  if(h.startsWith("hsl")||h.length<6)return 0;
  return 0.299*parseInt(h.slice(0,2),16)/255+0.587*parseInt(h.slice(2,4),16)/255+0.114*parseInt(h.slice(4,6),16)/255;
}

function BrandCard({brand,selected,onClick}){
  const [hov,setHov]=useState(false);
  const isHsl=brand.bg.startsWith("hsl");
  const dark=isHsl?true:luma(brand.bg)<0.45;
  const tc=dark?"rgba(255,255,255,0.9)":"rgba(0,0,0,0.85)";
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      borderRadius:8,overflow:"hidden",cursor:"pointer",
      border:selected?`1px solid ${S.accent}`:`1px solid ${hov?"#3a3a50":S.border}`,
      background:selected?"#16162a":hov?"#13131e":S.raised,
      transition:"border-color 120ms,background 120ms,transform 120ms",
      transform:hov&&!selected?"translateY(-1px)":"none",
      boxShadow:selected?`0 0 0 1px ${S.accent},0 4px 20px hsla(262,83%,68%,0.12)`:"none",
    }}>
      <div style={{height:52,background:brand.bg,display:"flex",alignItems:"center",padding:"0 11px",gap:8,borderBottom:`1px solid ${S.borderSub}`}}>
        <span style={{width:11,height:11,borderRadius:"50%",background:brand.accent,flexShrink:0,boxShadow:dark?`0 0 7px ${brand.accent}77`:"none"}}/>
        <span style={{fontSize:12,fontWeight:600,color:tc,fontFamily:S.fontHead,letterSpacing:"-0.2px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",flex:1}}>{brand.name}</span>
        {brand.local&&<span style={{fontSize:8,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",background:"rgba(168,85,247,0.25)",color:"hsl(262,83%,75%)",padding:"2px 5px",borderRadius:99,flexShrink:0}}>orig</span>}
      </div>
      <div style={{padding:"9px 11px"}}>
        <span style={{display:"inline-block",fontSize:10,fontWeight:500,color:brand.local?"hsl(262,83%,68%)":S.accentDim,background:brand.local?"hsla(262,83%,68%,0.12)":"hsla(262,60%,45%,0.15)",padding:"2px 7px",borderRadius:99,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:5}}>{brand.cat}</span>
        <p style={{margin:0,fontSize:11,color:S.textSec,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",fontFamily:S.fontBody}}>{brand.desc}</p>
      </div>
    </div>
  );
}

function Viewer({brand,onClose}){
  const [md,setMd]=useState("");
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState(null);
  const [copied,setCopied]=useState(false);
  const [view,setView]=useState("raw");

  useEffect(()=>{
    setLoading(true);setErr(null);setMd("");setView("raw");
    if(brand.local){setMd(LOCAL[brand.id]||"# No content found");setLoading(false);return;}
    fetch(`${CDN}/${brand.id}/DESIGN.md`)
      .then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();})
      .then(t=>{setMd(t);setLoading(false);})
      .catch(e=>{setErr(e.message);setLoading(false);});
  },[brand.id,brand.local]);

  const handleCopy=useCallback(async()=>{
    if(!md)return;
    try{await navigator.clipboard.writeText(md);setCopied(true);setTimeout(()=>setCopied(false),2000);}catch{}
  },[md]);

  const rendered=useMemo(()=>{
    if(!md)return "";
    return md
      .replace(/^---[\s\S]*?---\n?/,"")
      .replace(/^#### (.+)$/gm,'<h4 style="margin:14px 0 5px;font-size:13px;font-weight:600;color:#f0f0f5">$1</h4>')
      .replace(/^### (.+)$/gm,'<h3 style="margin:18px 0 7px;font-size:14px;font-weight:600;color:#f0f0f5;border-bottom:1px solid #1e1e28;padding-bottom:5px">$1</h3>')
      .replace(/^## (.+)$/gm,'<h2 style="margin:26px 0 9px;font-size:16px;font-weight:700;color:#f0f0f5;letter-spacing:-0.3px">$1</h2>')
      .replace(/^# (.+)$/gm,'<h1 style="margin:0 0 14px;font-size:20px;font-weight:700;color:#f0f0f5">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#d0d0e0;font-weight:600">$1</strong>')
      .replace(/`([^`\n]+)`/g,'<code style="font-family:IBM Plex Mono,monospace;font-size:11px;background:#1e1e2e;color:#a9b1d6;padding:1px 5px;border-radius:4px">$1</code>')
      .replace(/^\| (.+) \|$/gm,row=>`<tr>${row.slice(2,-2).split(" | ").map(c=>`<td style="padding:5px 10px;border-bottom:1px solid #1e1e28;font-size:12px;color:#9898a8;vertical-align:top">${c.trim()}</td>`).join("")}</tr>`)
      .replace(/^[-*] (.+)$/gm,'<li style="margin:3px 0;font-size:13px;color:#9898a8;line-height:1.55">$1</li>')
      .replace(/(<li[^>]*>.*<\/li>\n?)+/g,'<ul style="margin:8px 0;padding-left:20px">$&</ul>')
      .replace(/<\/li>\n<li/g,'</li><li')
      .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g,'<table style="width:100%;border-collapse:collapse;margin:12px 0">$&</table>')
      .replace(/^(?!<)((?!\n).+)$/gm,'<p style="margin:4px 0;font-size:13px;color:#9898a8;line-height:1.6">$1</p>')
      .replace(/\n{2,}/g,"\n");
  },[md]);

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:S.base}}>
      <div style={{padding:"11px 16px",borderBottom:`1px solid ${S.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{width:38,height:38,borderRadius:7,background:brand.bg,border:`1px solid ${S.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{width:13,height:13,borderRadius:"50%",background:brand.accent}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:S.fontHead,fontWeight:700,fontSize:14,color:S.text,letterSpacing:"-0.3px",display:"flex",alignItems:"center",gap:8}}>
            {brand.name}
            {brand.local&&<span style={{fontSize:8,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",background:"hsla(262,83%,68%,0.2)",color:"hsl(262,83%,72%)",padding:"2px 6px",borderRadius:99}}>original</span>}
          </div>
          <div style={{fontSize:10,color:S.textTer,marginTop:1}}>{brand.cat}</div>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <button onClick={()=>setView(v=>v==="raw"?"rendered":"raw")} style={{padding:"4px 9px",borderRadius:5,fontSize:11,cursor:"pointer",background:"transparent",border:`1px solid ${S.border}`,color:S.textSec,fontFamily:S.fontBody,fontWeight:500}}>{view==="raw"?"Preview":"Raw"}</button>
          <button onClick={handleCopy} disabled={loading||!!err} style={{padding:"4px 9px",borderRadius:5,fontSize:11,cursor:loading||err?"not-allowed":"pointer",background:copied?S.successBg:"transparent",border:`1px solid ${copied?S.success:S.border}`,color:copied?S.success:S.textSec,fontFamily:S.fontBody,fontWeight:500,transition:"all 150ms"}}>{copied?"✓ Copied!":"Copy"}</button>
          <button onClick={onClose} style={{width:26,height:26,borderRadius:5,cursor:"pointer",background:"transparent",border:`1px solid ${S.border}`,color:S.textTer,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:18}}>
        {loading&&<div style={{display:"flex",gap:8,alignItems:"center",padding:"20px 0",color:S.textTer,fontSize:12,fontFamily:S.fontBody}}><span style={{display:"inline-block",width:13,height:13,border:`2px solid ${S.border}`,borderTopColor:S.accent,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Loading DESIGN.md…</div>}
        {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:7,padding:14,fontSize:12,color:"#ef4444",fontFamily:S.fontBody}}><strong>Fetch error:</strong> {err}<br/><span style={{color:S.textSec,fontSize:10}}>Expected: {CDN}/{brand.id}/DESIGN.md</span></div>}
        {!loading&&!err&&md&&view==="raw"&&<pre style={{margin:0,fontSize:11,lineHeight:1.65,color:"#c9d1d9",fontFamily:S.fontMono,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{md}</pre>}
        {!loading&&!err&&md&&view==="rendered"&&<div style={{fontSize:13,lineHeight:1.6,color:S.textSec,fontFamily:S.fontBody}} dangerouslySetInnerHTML={{__html:rendered}}/>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function DesignMDBrowser(){
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("All");
  const [selected,setSelected]=useState(null);
  const origCount=BRANDS.filter(b=>b.local).length;

  const filtered=useMemo(()=>BRANDS.filter(b=>{
    const matchCat=cat==="All"||b.cat===cat;
    const q=search.toLowerCase();
    return matchCat&&(!q||b.name.toLowerCase().includes(q)||b.cat.toLowerCase().includes(q)||b.desc.toLowerCase().includes(q));
  }),[search,cat]);

  const handleSelect=useCallback((b)=>setSelected(s=>s?.id===b.id?null:b),[]);

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:S.base,color:S.text,fontFamily:S.fontBody,overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#2a2a38;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#3a3a50}input::placeholder{color:#52525e}input:focus{outline:none;border-color:hsl(262,83%,68%)!important;box-shadow:0 0 0 2px hsla(262,83%,68%,0.15)}`}</style>
      <header style={{padding:"12px 18px",borderBottom:`1px solid ${S.border}`,display:"flex",alignItems:"center",gap:14,flexShrink:0,background:S.raised}}>
        <div>
          <div style={{fontFamily:S.fontHead,fontWeight:700,fontSize:15,color:S.text,letterSpacing:"-0.4px"}}>awesome-design-md</div>
          <div style={{fontSize:10,color:S.textTer,marginTop:1}}>{BRANDS.length} systems · {origCount} originals</div>
        </div>
        <div style={{flex:1,maxWidth:320}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search brands, categories, aesthetics…" style={{width:"100%",padding:"6px 11px",background:S.base,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,fontSize:12,transition:"border-color 150ms,box-shadow 150ms"}}/>
        </div>
        <span style={{fontSize:10,color:S.textTer,marginLeft:"auto",fontFamily:S.fontMono}}>{filtered.length}/{BRANDS.length}</span>
      </header>
      <div style={{display:"flex",gap:5,padding:"8px 18px",borderBottom:`1px solid ${S.border}`,flexWrap:"wrap",flexShrink:0}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{
            padding:"2px 10px",borderRadius:99,fontSize:10,cursor:"pointer",
            border:`1px solid ${cat===c?(c==="Original"?"hsl(262,83%,68%)":S.accent):S.border}`,
            background:cat===c?(c==="Original"?"hsla(262,83%,68%,0.18)":"hsla(262,60%,45%,0.2)"):"transparent",
            color:cat===c?(c==="Original"?"hsl(262,83%,72%)":S.accent):S.textSec,
            fontFamily:S.fontBody,fontWeight:500,letterSpacing:"0.02em",transition:"all 120ms",
          }}>{c}</button>
        ))}
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <div style={{flex:selected?"0 0 370px":"1",overflowY:"auto",padding:14,borderRight:selected?`1px solid ${S.border}`:"none",transition:"flex 200ms ease"}}>
          {filtered.length===0
            ?<div style={{padding:"36px 0",textAlign:"center",color:S.textTer,fontSize:12}}>No matches for "{search}"</div>
            :<div style={{display:"grid",gridTemplateColumns:selected?"repeat(auto-fill,minmax(160px,1fr))":"repeat(auto-fill,minmax(190px,1fr))",gap:9}}>
              {filtered.map(b=><BrandCard key={b.id} brand={b} selected={selected?.id===b.id} onClick={()=>handleSelect(b)}/>)}
            </div>
          }
        </div>
        {selected&&<div style={{flex:1,overflow:"hidden"}}><Viewer brand={selected} onClose={()=>setSelected(null)}/></div>}
      </div>
    </div>
  );
}
