# FlashFusion — Design System

> Brand system, tokens, and UI kits for **FlashFusion** — a cinematic AI platform for building, orchestrating, and deploying autonomous agents.

**Brand thesis (one line):** FlashFusion is **neon-glass** — violet electricity arcing across a deep indigo void. Dark-mode first, high-contrast, slightly dangerous. Think Minimax + ElevenLabs + liquid-metal motion design. *Not* clean SaaS. *Not* editorial. *Not* vaporwave. *Not* generic AI.

---

## Product context

FlashFusion isn't a single app — it's a platform that spans multiple surfaces, each on its own production stack.

| Surface | Stack | Status |
|---|---|---|
| Agent platform (Fusion AI) | Base44 (`68dd8e79ca073475565c8e16`) | Live, ~101 entities |
| Workflow engine | n8n (`krosebrook.app.n8n.cloud`) | Live |
| Storefront / marketing | Wix | Live — 20 products, persona coupons |
| Payments | Stripe | Configured |
| Storage | Cloudflare R2 | Configured |
| Analytics | PostHog | Configured |
| Auth / DB | Supabase | Configured |
| LLM routing | Claude + Gemini + ChatGPT | Multi-provider |
| Landing hero | WebGL2 shader (`assets/hero-standalone.html`) | Production-grade |

**Do NOT merge** with sibling brands: `chaosclub.co` (dark editorial) and `kylerosebrook.com` (mono portfolio). Each has its own tokens and must not share design decisions.

---

## Sources this system was built from

All supplied uploads live in `uploads/` (originals preserved). Processed assets live in `assets/`.

| File | Role |
|---|---|
| `uploads/README.md` | FlashFusion status doc — stack reality + "what not to recommend" |
| `uploads/DESIGN.md` *(inline in brief)* | Primary brand system spec — tokens, type, components, rules |
| `uploads/standalone.html` | Production WebGL2 hero shader (React / WordPress / Wix Velo drop-in) |
| `uploads/FlashFusionHero.jsx` | React version of the hero |
| `uploads/flashfusion-landing.html`, `-v2.html` | Reference landing mocks |
| `uploads/agentic-hero.mp4` | Motion reference |
| `uploads/liquid-metal-video_yX6NvjdW.mp4` | Liquid-metal motif video |
| `uploads/Futuristic_AI_Agent_System_Visualization.mp4` | Agent-system motion ref |
| `uploads/Video_Generation_From_Robot_Images.mp4` | Robot motion ref |
| `uploads/ff-fluid-background.png` | Liquid-metal hero asset |
| `uploads/ff-worlds-collide.png` | "Ideation → transformation → execution" visual metaphor |

---

## CONTENT FUNDAMENTALS

**Voice:** technical, confident, short sentences. Active verbs in headlines. No fluff, no hype.

**Casing:** Sentence case for headlines and body. UPPERCASE only for captions / eyebrows / meta labels (`TRACKED LIVE`, `AUTONOMOUS`, `ALL SYSTEMS OPERATIONAL`). Button labels sentence case.

**Pronouns:** second person ("you") in landing / product copy, imperative ("Ship faster", "Deploy agent") in CTAs. First-person plural ("we") is rare and reserved for policy/status copy.

**Numbers & tech specs:** leaned-into. Specific, scannable numbers beat adjectives. `3,500+ autonomous agents`, `99.9% distributed uptime`, `<50ms execution latency`, `29 regions`. Always tabular-nums for alignment.

**Emoji:** never in product UI. Acceptable in marketing body copy at most, and even then rare.

**Do write:**
- "Transform your vision into reality."
- "Deploy autonomous agents that analyze, decide, and execute."
- "Ship faster."
- "Build in the open."

**Don't write:**
- "Unleash next-generation AI-powered solutions."
- "Empower your team to…"
- "Revolutionary platform for…"
- Anything that could show up in a generic SaaS pitch deck.

**Eyebrow labels** are a signature pattern — short UPPERCASE category tags (`CAPABILITIES`, `PROCESS`, `INFRASTRUCTURE`) preceded by a short violet-to-transparent hairline. They sit above every section H2.

---

## VISUAL FOUNDATIONS

### Color
Palette is **scarce and earned.** Background is always `--ff-void` (`#0A0A0F`) — never pure `#000000`. Primary brand fill is violet `#8B5CF6`; electric cyan `#06B6D4` is a single-accent-per-screen privilege. All body text in `--ff-text` (`#F8FAFC`) or `--ff-text-muted` (`#94A3B8`). Never use primary or electric on text below 18px. Semantic state colors (canonical): `--ff-success` `#10B981`, `--ff-warning` `#F59E0B`, `--ff-danger` `#EF4444`, `--ff-info` `#06B6D4` (aliases `--ff-electric`).

### Type
Four families. **Poppins 600–900** for display (hero/H1/H2/H3/H4/H5 + button labels). **Inter 300–700** for body, UI, nav, captions. **Instrument Serif 400 reg/italic** for editorial moments — pull-quotes, section pivots, the one-word hero ("*worlds collide.*"). **JetBrains Mono 400/500/600** for code, API paths, token values, eyebrows. Display letter-spacing is negative (`-0.035em` at 900, stepping up to `-0.015em` at 600) with tight line-heights (0.95 hero → 1.30 H4). Body letter-spacing `0`, line-height `1.5`. Numerics use `font-variant-numeric: tabular-nums`. Button label: Poppins 600 · 15px · `0.01em`.

### Spacing & layout
8px base grid; only the defined tokens exist (`--sp-1` → `--sp-24`). Max content width 1440px. Hero card max 640px. Text blocks capped at 65ch. Mobile-first breakpoints: 768 / 1024 / 1440.

### Backgrounds (ranked)
1. **Static mesh gradient** — default surface. Two radial gradients (violet top-left, cyan bottom-right) over a void-to-deep vertical.
2. **Glass card over mesh** — content surfaces. The signature FF container.
3. **WebGL electric shader** — hero only, one per page. See `assets/hero-standalone.html`.

Never more than one shader/animated background per screen. Full-bleed is default for hero and section dividers.

### Cards (the glass card)
Rounded to `18px` (`--r-lg`). Border is 1px at `rgba(196,181,253,.12)` (violet @ 12% alpha) — **never** a solid line. Fill is a 135° linear gradient from `rgba(10,10,15,.55)` to `rgba(20,19,40,.35)`. Backdrop filter `blur(14px) saturate(140%)`. Dual shadow: a `0 0 0 1px rgba(10,10,15,.4) inset` hairline and a `0 24px 60px -20px rgba(0,0,0,.6)` bloom below. Internal padding: `2.5rem 2rem` mobile, `3rem` desktop.

### Buttons
Only two levels: primary (violet gradient pill, `border-radius: 9999px`) and ghost (transparent fill, 1px violet border at 24% alpha). No tertiary button — use a text link with underline-on-hover instead.

### Hover / press states
- **CTAs:** 1px Y-lift + shadow bloom. Never scale. Transition 150ms.
- **Text links:** color shift to `--ff-primary-light`, never underline by default (underline on hover is acceptable).
- **Secondary / icon buttons:** background shifts to `rgba(196,181,253,.06)`; text shifts from muted to bright.
- **Press:** no shrink transform. Opacity dip or background deepen only.

### Focus
All interactive elements use the `--ff-electric-light` (`#67E8F9`) ring: `outline: 2px solid #67E8F9; outline-offset: 2px;` OR a 3px box-shadow halo at `rgba(103,232,249,.2)`. This is the *one* consistent accent across every surface.

### Borders & dividers
Always low-alpha violet — `rgba(196,181,253,.12)` default, `.24` for emphasis. Never hex-solid lines. Never more than 1px.

### Shadows (outer / inner)
Outer: tall, soft, far-offset (`0 24px 60px -20px rgba(0,0,0,.6)`) — cards float on the void. Inner: `0 0 0 1px rgba(10,10,15,.4) inset` — subtle crystal edge. CTA hover bloom: `0 10px 30px -10px rgba(139,92,246,.6)` — violet shadow beneath the button. **Never** use text-shadow for "depth" on solid surfaces (reads as bevel). Text glow is ONLY for headlines over shader/gradient backgrounds: `0 0 40px rgba(139,92,246,.25), 0 0 80px rgba(6,182,212,.15)`.

### Transparency & blur
Glass cards use `backdrop-filter: blur(14px) saturate(140%)`. Nav uses heavier `blur(20px)`. Blur is a *pattern*, not wallpaper — don't apply it to every surface.

### Corner radii
`8px` small UI / chips, `12px` inputs, `18px` cards / modals, `24px` hero surfaces, `9999px` pills / CTAs / avatars. No other values.

### Imagery & color vibe
No photography. No illustrations of people or isometric stuff. All brand imagery is abstract: liquid metal waves, plasma flow, electric arcs, mesh gradients. Color vibe is **cool** — deep indigo and cyan dominate; violet is the only warmth, and even it's cool-leaning. Assets are high-contrast, dark, slightly cinematic.

### Motion
Default easing `cubic-bezier(0.4, 0, 0.2, 1)`. Durations: 150ms micro, 300ms transitions, 600ms entrances. Entrance is fade + 8px Y-translate, 50ms stagger for lists. **`prefers-reduced-motion: reduce` is a hard requirement** — all shader and entrance animation must disable under it.

### Layout rules
Floating pill nav (fixed, top-centered, inset from edges, backdrop-blurred). Full-bleed hero. Three-column feature grids are the default content pattern. Footer is 5-column (brand + 4 link columns) with a status dot in the bottom bar. Stacking order: **void → mesh gradient → glass card → content**.

---

## ICONOGRAPHY

**System:** **Lucide** icons. Stroke-width `1.5`, default size `20px`, `stroke-linecap="round"`, `stroke-linejoin="round"`. No fills (except `IconPlay`, which is a filled triangle).

**Source:** loaded from `https://unpkg.com/lucide-static@latest` when needed, or hand-authored in `ui_kits/landing/components.jsx` matching Lucide's geometry exactly. The project standardizes on Lucide; never mix with Heroicons, Feather, or any other set.

**No emoji in product UI.** Marketing copy may use them very sparingly. Unicode chars aren't used as icons (e.g. no `→` in place of an `ArrowRight` SVG — use the SVG).

**No PNG icons.** Everything is a 24×24 SVG path drawn at `stroke-width: 1.5` for visual consistency with Lucide.

**Custom marks:**
- **Brand glyph:** a single violet dot (`#A855F7`) with a glow halo, paired with `FLASHFUSION` in Inter 500. See `preview/brand-logo.html` for the lockup.
- **Status dots:** 7px solid circles with a matching-color box-shadow halo, pulsing at 2s.

Color rules for icons:
- Default: `currentColor`, inheriting the parent text color.
- Feature-card icons: `--ff-primary-light` (`#C4B5FD`) by default; `--ff-electric-light` (`#67E8F9`) for the one "accent moment" per screen.
- Never tint icons with `--ff-primary` or `--ff-electric` directly (both fail AA at small sizes).

---

## INDEX

Root files:
- `README.md` — this file
- `SKILL.md` — Agent Skill wrapper (makes this portable to Claude Code)
- `colors_and_type.css` — complete token layer (primitives + semantic + utility classes)

Folders:
- `assets/` — fonts, videos, images, production hero shader, source React component
- `preview/` — small specimen cards rendered in the Design System tab (colors / type / spacing / components / brand)
- `ui_kits/landing/` — click-through landing prototype (Nav, Hero, FeatureGrid, Process, Footer, DeployModal)
- `uploads/` — original inputs, preserved

Preview cards are grouped in the Design System tab as:
- **Colors** — surfaces, brand accents, magenta seam, text ladder, surface ladder, semantic, gradients
- **Type** — display, body, scale, mono, editorial (Instrument Serif), headline glow
- **Spacing** — 8px scale, radii, elevation ladder (e-1 → e-5), glows, motion tokens
- **Components** — buttons, inputs, glass card, badges, alerts, tags + kbd + progress + avatar
- **Brand** — fluid background, worlds collide, logo, logomarks + wordmarks + favicon, iconography (50 icons)

---

## FONTS

The canonical brand system is **Poppins + Inter + Instrument Serif + JetBrains Mono**.

- `colors_and_type.css` currently `@import`s them from Google Fonts (CDN) so the system renders cleanly in sandboxes.
- `fonts-selfhosted.css` is a ready-to-use `@font-face` block pointing at `./assets/fonts/*.woff2`. To activate self-hosted, drop the 13 `.woff2` files listed in `assets/fonts/README.md` into that folder, then swap the `@import` at the top of `colors_and_type.css` to `@import url('./fonts-selfhosted.css')`.
- Production must self-host under strict CSP — see `uploads/README.md`.

## CAVEATS & SUBSTITUTIONS

- **Icons:** The landing UI kit hand-authors Lucide-compatible SVGs (stroke 1.5, 24×24 viewBox) inside `components.jsx`. For full-set access swap in `lucide-static` via CDN or install the real package.
- **Error / warning palette:** canonical brand-guide semantic tokens — `--ff-success` `#10B981`, `--ff-warning` `#F59E0B`, `--ff-danger` `#EF4444`, `--ff-info` `#06B6D4`.
- **Hero shader:** `assets/hero-standalone.html` is the real WebGL2 shader. The landing UI kit uses `liquid-metal.mp4` as a lighter-weight backdrop — swap to the shader for production deploys.
