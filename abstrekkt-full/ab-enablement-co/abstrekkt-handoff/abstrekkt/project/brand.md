# Abstrekkt — Brand & Design System

A dark-editorial / **"Brutalist Archive"** aesthetic. Abstrekkt is a standalone brand
(distinct from FlashFusion's neon-glass look — do not mix them).

---

## North star
Cinematic dark-editorial meets a surveillance-bunker "Brutalist Archive." Deep tonal
density, expansive negative space, intentional friction. The interface recedes so the
narrative content leads. It should feel **inherited, not manufactured** — weathered
steel, microfilm grain, redacted-document typography. Archival, forensic, contemplative.

---

## Colors (canonical)

### Surfaces — the dark neutral ladder
| Token | Hex | Use |
|---|---|---|
| `background` / surface | `#131315` | App body |
| deep-carbon body variant | `#0A0A0C` | Editorial / hero bodies |
| `surface-container-lowest` | `#0e0e10` | Recessed wells |
| `surface-container-low` | `#1c1b1d` | Cards, inputs |
| `surface-container` | `#201f21` | Default raised panel |
| `surface-container-high` | `#2a2a2c` | Hover / elevated |
| `surface-container-highest` | `#353437` | Window bezel |
| `surface-bright` | `#39393b` | Top of the stack |

### Text & lines
| Token | Hex | Use |
|---|---|---|
| `on-surface` (ivory) | `#e5e1e4` | Primary text |
| `on-surface-variant` | `#d4c5ab` | Secondary / warm body |
| `outline` | `#9c8f78` | Visible borders (rare) |
| `outline-variant` | `#504532` | Ghost border — use at **~15%** opacity |

### Accents
| Token | Hex | Meaning |
|---|---|---|
| `primary` (light amber) | `#ffe2ab` | Emotional significance, CTAs |
| `on-primary` | `#402d00` | Text on amber |
| `primary-container` | `#ffbf00` | "Golden Hour" amber — highlights, active states |
| `surface-tint` / fixed-dim | `#fbbc00` | Tint accents |
| `secondary` (blueprint blue) | `#a9c7ff` | The "machine layer": AI, technical, data |
| `secondary-container` | `#026bd2` | Blue fills |
| `cyan-accent` | `#00f0ff` | Technical accent, **sparingly** |
| `error` | `#ffb4ab` | Errors |
| `error-container` | `#93000a` | Error fills |

**Rule:** Amber = emotional significance & CTAs. Blue/cyan = the machine layer (AI,
metadata, diagnostics). Everything else stays in the dark neutral ladder. **No vibrant
colors outside this palette.**

---

## Typography
- **EB Garamond** — display, headlines, titles, all-caps labels (the editorial/memoir
  voice). *Italic* for "handwritten memoir" labels.
- **Literata** — long-form narrative body (`body-md` 16px, `body-lg` 18px, line-height 1.6).
- **JetBrains Mono** — `technical-sm` (12px): timestamps, IDs, metadata, AI output.
- **Space Grotesk** — optional brutalist/telemetry headers (`.brutalist-font`).

**Scale:** `display-lg` 48px (-0.02em, 1.1) → mobile 32px · `headline-md` 24px ·
`label-caps` 12px / 0.1em / 600 / uppercase.

---

## Surfaces, depth, shape
- Depth via **tonal layering** (stack surface-container tiers), **not drop shadows**.
- **No 1px solid section borders** — define boundaries by background color shift. If a
  border is truly needed: ghost border = `outline-variant` @ ~15%.
- Global low-opacity **microfilm grain** overlay (SVG fractalNoise, ~0.04 opacity).
- **Window frame** wrapper: 12px bezel in `surface-container-highest` with
  `inset 0 0 0 1px rgba(255,255,255,.1)`.
- Glassmorphism for floating panels: `surface-container` @ ~40–60% +
  `backdrop-filter: blur(12–20px)`, 0.5px ivory inner border @ 10%.
- **Radius:** brutalist screens `0px` · editorial UI `8px` · technical/Moment-Studio
  cards `4px` · pills/chips `9999px`.
- Shadows rare; when used: 40–60px blur @ ~8%, tinted cool-grey (never pure black).

---

## Layout & voice
- 12-col grid, 40px desktop margins (20px mobile), 8px base unit, 4px half-units for
  dense dot-timelines.
- Strong **left-aligned** grids with **right-aligned telemetry/metadata**. Avoid
  centered layouts.
- Surveillance metadata (timestamp / ID in `label-caps` or mono) in card corners.
- **Voice:** archival, forensic, contemplative. Hard edges, high contrast, asymmetry.

---

## Imagery & motion
- Photography: desaturated, warm-graded, high-contrast — feels recovered from an
  archive. Apply a tonal grade (grayscale ~0.3 + sepia ~0.3 + slight contrast) with a
  dark carbon vignette so images sit in the palette.
- Placeholders: subtly-striped dark SVG with a monospace caption of what belongs there.
- Motion is restrained: slow fades, no bounce, no infinite decorative loops. Respect
  `prefers-reduced-motion`.

---

## Anti-patterns (do not)
- Don't use FlashFusion's violet/cyan neon-glass tokens here.
- No vibrant colors outside the palette; no rainbow gradients.
- No drop-shadow-driven depth; no rounded-corner + left-accent-border "info card" cliché.
- No emoji as UI; no centered hero layouts; no Inter/Roboto/Arial for display.
