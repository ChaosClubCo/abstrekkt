# FlashFusion Brand Kit (v1.0)

Last updated: 2026-02-06

This kit is the single source of truth for FlashFusion visual identity: colors, gradients, typography, UI tokens, and the “Powered by FlashFusion” co-brand lockup for embeds/partners.

## 1) Brand essence
FlashFusion should feel like ideas snapping into existence: studio-grade creativity with systems-level power.

**Attributes**
- Electric, but not childish
- Creative-first, not corporate
- Powerful without intimidation
- Fast, visual, kinetic

**Voice**
Short, confident, action-oriented.
Examples:
- “Fuse ideas.”
- “Remix output.”
- “Your idea just fused.”

## 2) Core colors (non-negotiable)
| Token | Hex | Use |
|---|---|---|
| Flash Purple | #A855F7 | Primary brand, CTAs, highlights |
| Fusion Pink | #F472B6 | Accent, gradients, emotional lift |
| Void Black | #0F0618 | App background, hero sections |
| Carbon Night | #120A1F | Secondary surfaces |
| Signal White | #F8F7FF | Primary text on dark |

## 3) Gradients (signature look)
**Hero Gradient**
- CSS: `linear-gradient(135deg, #A855F7 0%, #F472B6 50%, #7C3AED 100%)`

**Ambient Glow**
- CSS: `radial-gradient(circle at 30% 20%, rgba(168,85,247,0.35), transparent 60%)`

**Dark Fusion Surface**
- CSS: `linear-gradient(180deg, #0F0618 0%, #120A1F 100%)`

## 4) Extended accents (system-safe)
Use sparingly to support states/features.

| Purpose | Hex |
|---|---|
| Electric Blue | #38BDF8 |
| Neon Mint | #2DD4BF |
| Solar Amber | #FBBF24 |
| Ember Red | #FB7185 |

## 5) Typography
Primary: **Inter** (UI-first, highly readable)
- 800/700: headlines
- 600/500: buttons/nav
- 400: body

Optional display: **Space Grotesk** (landing heroes, section headers)

## 6) Logo usage
Assets live in `assets/`.

Rules:
- Prefer gradient logo on dark backgrounds.
- White logo is the fallback on complex imagery or when gradient clashes.
- Do not skew, distort, add heavy drop shadows, or place on noisy backgrounds without a dark overlay.
- Maintain clear space: at least the height of the “F” around the mark.

## 7) “Powered by FlashFusion” lockup
Used for embeds, integrations, and partner pages.

### Type lockup
Partner logo above, then:

- “powered by” in neutral gray `#9CA3AF` (Inter 400)
- “FlashFusion” in gradient or `#A855F7` (Inter 600)

Recommended background (dark mode badge):
- Background: `#0F0618`
- Border: `rgba(168,85,247,0.4)`
- Soft glow via layered gradients (avoid expensive SVG filters).

Components:
- React component: `components/PoweredByFlashFusion.tsx`
- CSS variables: `tokens/css-vars.css`

## 8) Accessibility
- Text on dark surfaces should meet WCAG AA contrast.
- Avoid placing body text directly on high-saturation gradients.
- Provide reduced-motion variants for animated glows.

## 9) Versioning
This kit is versioned. If you change core colors or gradients, bump the version and update the date above.

## 10) Quick start
- Web (Tailwind): import `tokens/tailwind.flashfusion.ts` and merge into your Tailwind config.
- CSS vars: include `tokens/css-vars.css` at app root.
- Badge: use `components/PoweredByFlashFusion.tsx`.

