# flashfusion-web

FlashFusion marketing site — Next.js 15 + Tailwind scaffold.
Migrated from `flashfusion-v2.html` in the parent repository.

## What's in here

```
flashfusion-web/
├── app/
│   ├── layout.tsx      # Root layout + Google Fonts (Syncopate, Space Mono, Syne)
│   ├── page.tsx        # Home page (Scene + Hero + Stats)
│   └── globals.css     # Tailwind + brand utilities (btn-clipped, scanline, vignette, text-fusion)
├── components/
│   ├── Scene.tsx       # Fixed parallax background (grid, orbs, scanlines, vignette)
│   ├── Hero.tsx        # FLASH / FUSION headline + CTA
│   ├── Stats.tsx       # Four-metric grid
│   └── Button.tsx      # Clipped-corner CTA button (primary + ghost)
├── lib/
│   └── tokens.ts       # Design tokens: colors, glows, fonts, gradients
├── tailwind.config.ts  # Tailwind config that imports tokens.ts
└── package.json
```

## Design Tokens (from flashfusion-v2.html)

| Token | Value | Use |
|-------|-------|-----|
| `void` | `#03000a` | Primary background |
| `neon` | `#bf00ff` | Primary accent, glows |
| `flash` | `#e040fb` | Hover/active accent |
| `purple-600` | `#7b00ff` | Gradient deep stop |
| `white` | `#f8f0ff` | Primary text (soft) |
| `ice` | `#e8d5ff` | Secondary text |

Three glow shadows (`shadow-glow-sm` / `-md` / `-lg`) and the FUSION gradient are available in Tailwind.

## Fonts

- `font-display` — Syncopate (headings, UPPERCASE)
- `font-mono` — Space Mono (labels, eyebrows, stats)
- `font-body` — Syne (body text)

## Getting Started

```bash
cd flashfusion-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's NOT in here (yet)

This scaffold captures the **static brand identity** from `flashfusion-v2.html`. The following features from the original HTML are intentionally NOT yet ported:

- Boot sequence (`FLASHFUSION_OS v2.0.0` terminal loader)
- GSAP char-by-char hero entrance + text scramble
- Custom cursor (dot + ring with spring physics)
- HTML5 canvas signal trace + sonar ping on click
- HUD overlay with live-updating telemetry
- Scroll-triggered cinematics (pin hero, spread FLASH, scale FUSION)
- Mobile gyroscope parallax (from `flashfusion-parallax.html`)

These are interaction/motion enhancements. Add them after the core product site is deployed. Use Framer Motion or GSAP (installed separately) per component.

## Roadmap

- [ ] Replace homepage Hero with boot-sequence entrance (GSAP or Framer Motion)
- [ ] Port Features section (two-column layout with code snippet panel) from HTML
- [ ] Add `/docs` shell for MCP / API documentation
- [ ] Wire `Get Early Access` button to email capture (Resend or ConvertKit)
- [ ] Add `/partners` page for Anthropic listing copy

## Migration Notes

The original HTML used CSS custom properties on `:root`. These are now in `lib/tokens.ts` as a typed TS object and consumed by `tailwind.config.ts`, giving us:

1. **Type-safe tokens** — import from `lib/tokens` anywhere for inline styles
2. **Tailwind classes** — `bg-neon`, `text-fusion`, `shadow-glow-md`, etc.
3. **Single source of truth** — change a color in `tokens.ts`, it updates Tailwind + TS

No pixel-perfect migration was done. The goal is brand continuity, not a 1:1 port.
