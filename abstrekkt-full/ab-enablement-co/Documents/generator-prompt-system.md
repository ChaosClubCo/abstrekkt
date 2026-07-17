# Generator Prompt System
## FlashFusion + INT · Stitch / B44 / AI Studio / Claude

> **How to use:** Paste the BRAND BLOCK for your profile into the target platform first.
> Then paste the PLATFORM SECTION that matches your tool.
> Never paste both profiles into the same session.

---

## STRUCTURE

```
BRAND BLOCK     ← portable token payload (paste anywhere)
  └─ [FLASHFUSION]
  └─ [INT]

PLATFORM SECTIONS
  └─ [STITCH]     ← aesthetic + layout + component language
  └─ [BASE44]     ← Tailwind class translation + component props
  └─ [AI STUDIO]  ← code spec + Stitch handoff context
  └─ [CLAUDE]     ← full-spec directive

ANTI-DRIFT RULES  ← what to add when output starts slipping
```

---

---

# BRAND BLOCK — FLASHFUSION

> Paste this block verbatim as the first message / system context in any generator session.

```
BRAND PROFILE: FlashFusion — locked, do not deviate.

SURFACES
  Page base:      #0F0618
  Alternate sec:  #1A0B2E
  Cards:          #000000  ← flat black, NOT glassmorphic
  Metric cards:   rgba(255,255,255,0.02)

BORDERS
  Cards:          rgba(255,255,255,0.10)
  Nav pill:       rgba(168,85,247,0.20)
  Nav hover:      rgba(168,85,247,0.40)
  CTA box:        rgba(255,255,255,0.87)  ← white, NOT purple
  Step inactive:  rgba(255,255,255,0.25)
  Step active:    rgba(255,255,255,0.60)

ACCENT
  Primary:        #A855F7
  Secondary:      #F472B6
  Cyan:           #22D3EE
  Gradient:       linear-gradient(90deg, #A855F7 0%, #F472B6 60%, #22D3EE 100%)
  Glow:           0 0 20px rgba(168,85,247,0.40)

TEXT
  Primary:        #F8FAFC
  Muted 60%:      rgba(255,255,255,0.60)
  Dim 40%:        rgba(255,255,255,0.40)
  Ghost 20%:      rgba(255,255,255,0.20)

TYPOGRAPHY
  Display/headings:  Instrument Serif 400  ← NOT Poppins, NOT Space Grotesk
  Body/UI/labels:    Instrument Sans 400/500/600  ← NOT Inter
  Code/eyebrow:      JetBrains Mono 400/500
  Logo wordmark:     Poppins (inline override ONLY — not a system font)

TYPE SCALE
  Hero:           clamp(2rem, 6vw, 7rem)
  Section head:   clamp(3.5rem, 9vw, 8.75rem)  ← up to 128px
  CTA display:    clamp(2.5rem, 5vw, 4.5rem)
  Base:           16px / Large: 20px

LAYOUT
  Max width:      1400px
  Padding:        24px (mobile) / 48px (desktop)
  Hero alignment: LEFT  ← never centered
  Hero width:     lg:max-w-[55%]
  Section padding: clamp(96px, 8vw, 128px) vertical

COMPONENTS
  Nav:            Transparent at top → glass pill on scroll
                  Scrolled state: bg #1A0B2E/80, backdrop-blur-xl,
                  border rgba(168,85,247,0.20), rounded-2xl
  Buttons (large): rounded-full, h-14 px-8
  Buttons (nav):  rounded-full, h-10 px-6
  Cards:          bg-black, border rgba(255,255,255,0.10) — flat, no blur
  Eyebrow label:  font-mono text-sm white/40, preceded by 8px purple line
  CTA box:        white border + mouse radial spotlight + corner insets
  Outline text:   -webkit-text-stroke: 1.5px; fill: transparent

MOTION
  Scroll reveal:  opacity 0→1, translateY 8→0, duration 700ms
  Stagger:        via transitionDelay, 100ms increments

FORBIDDEN PATTERNS
  ✗ Poppins as heading font (logo only)
  ✗ Inter as body font (Instrument Sans)
  ✗ Glassmorphism on content cards (nav scroll state only)
  ✗ rounded-md buttons (rounded-full)
  ✗ Purple border on CTA box (white border)
  ✗ Centered hero layout
  ✗ Sidebar navigation
  ✗ Symmetrical equal-column card grids
  ✗ Generic blue primary button
  ✗ "Clean and modern" aesthetic direction
```

---

---

# BRAND BLOCK — INT

> Paste this block verbatim as the first message / system context in any generator session.

```
BRAND PROFILE: INT (Intinc Internal) — locked, do not deviate.

SURFACES
  Base:           #0a0a0f
  Raised:         #111118
  Overlay:        #18181f

BORDERS
  Primary:        #2a2a38
  Secondary:      #1e1e28

ACCENT  ← signal only, max 10% visible surface area
  Primary:        hsl(262, 83%, 68%)  ← electric violet
  Dim:            hsl(262, 60%, 45%)
  Glow:           rgba(139,92,246,0.15)
  Use: active states, badges, focus rings, key metrics only. Never decorative.

TEXT
  Primary:        #f0f0f5
  Secondary:      #9898a8
  Tertiary:       #52525e

SEMANTIC COLORS
  Success:        #22c55e / bg rgba(34,197,94,0.1)
  Warning:        #f59e0b / bg rgba(245,158,11,0.1)
  Error:          #ef4444 / bg rgba(239,68,68,0.1)
  Info:           #38bdf8 / bg rgba(56,189,248,0.1)

TYPOGRAPHY
  Headings:       Space Grotesk 700  ← NOT Instrument Serif
  Body:           Inter 400/500      ← NOT Instrument Sans
  Code/mono:      IBM Plex Mono 400

TYPE SCALE (dense)
  xs: 11px / sm: 13px / base: 14px / md: 16px / lg: 20px / xl: 24px / 2xl: 32px

LAYOUT
  Density:        Dense — information-forward, not spacious
  Padding:        12px/16px internal card padding (not 24px+)

COMPONENTS
  Cards:          background #111118, border 1px solid #2a2a38, no glass, no shadow
  Buttons:        border-radius 4px  ← NOT rounded-full, NOT pill
  Nav:            Flat, command palette as primary action, max 4 icon tabs
  Sidebar:        Require written justification before including
  Tables:         bg #111118, row hover #18181f, border #2a2a38

FORBIDDEN PATTERNS
  ✗ Glass or backdrop-blur anywhere
  ✗ Gradient backgrounds
  ✗ Pill/rounded-full buttons
  ✗ Accent used decoratively (backgrounds, gradients, section fills)
  ✗ Accent exceeding 10% of visible surface
  ✗ Space Grotesk in non-heading roles
  ✗ Instrument Serif or Instrument Sans (FlashFusion fonts)
  ✗ Sidebar without written one-sentence justification
  ✗ Centered hero layouts
  ✗ Light or neutral backgrounds (this is a dark-mode system)
```

---

---

# PLATFORM: STITCH

> Use after pasting the BRAND BLOCK. One screen at a time. Never combine layout + theme + content in the same prompt.

## Anchor Prompt (first prompt — establishes the session)

**FlashFusion:**
```
Dark editorial product interface. Left-aligned hero layout, never centered.
Page background #0F0618. Black cards (bg #000000) with rgba(255,255,255,0.10) borders — flat, not glassmorphic.
Primary accent #A855F7, secondary #F472B6, cyan #22D3EE.
Typography: Instrument Serif (headings), Instrument Sans (body and UI), JetBrains Mono (eyebrow labels and code).
All CTA buttons: fully rounded (rounded-full), large variant h-14. No rounded-md.
Navigation: transparent floating pill at top; becomes glass pill with #1A0B2E/80 background and blur on scroll.
Aesthetic direction: bespoke editorial dark product — think museum-curatorial meets developer tool. Not "sleek SaaS."
Max width 1400px. Left-aligned hero, max 55% width on large screens.
```

**INT:**
```
Enterprise-dense dark tool interface. Information-forward, not spacious.
Page background #0a0a0f. Cards: #111118 with 1px solid #2a2a38 border — completely flat, no glass, no gradient.
Accent: hsl(262,83%,68%) electric violet — used only for active states, badges, focus rings, key metrics. Never as background fill.
Typography: Space Grotesk 700 (headings), Inter 400/500 (body), IBM Plex Mono (code).
All buttons: border-radius 4px — not pill, not rounded-full.
Navigation: flat horizontal bar, max 4 icon tabs, command palette as primary action.
Aesthetic direction: void surface, signal-only accent, enterprise-grade density. Not "modern dashboard."
Dense type scale: base 14px, sm 13px, xs 11px.
```

---

## Screen Prompts (iterate one per message)

**Structure — one prompt per screen, one change per follow-up:**

```
Prompt 1: Establish screen type + primary content structure
Prompt 2: Add navigation model
Prompt 3: Apply color tokens + typography
Prompt 4: Add secondary states (loading, empty, error)
Prompt 5: Add specific component (modal, drawer, toast) if needed
```

**FlashFusion screen examples:**

```
// Hero screen
Design a hero section for a creator tools platform. Left-aligned text block,
max 55% width. Large Instrument Serif heading with gradient accent text on key word.
Sub-headline in Instrument Sans white/60. Two buttons: primary rounded-full h-14
gradient bg, secondary rounded-full h-14 transparent with white/10 border.
Background #0F0618 with subtle purple grid pattern rgba(168,85,247,0.15).

// Feature card grid
Design a features section with 3-column card grid. Cards: bg-black,
border rgba(255,255,255,0.10). Each card: eyebrow label in JetBrains Mono white/40
with 8px #A855F7/50 line before text, Instrument Serif heading, Instrument Sans body.
Accent icon in #A855F7. Section background alternates to #1A0B2E.

// Pricing section
Design a 3-tier pricing section. Card borders: rgba(168,85,247,0.20).
Featured tier: border rgba(168,85,247,0.60) with glow 0 0 20px rgba(168,85,247,0.40).
CTA box at bottom: white border rgba(255,255,255,0.87), NOT purple.
All buttons rounded-full. Instrument Serif for price numerals.
```

**INT screen examples:**

```
// Dashboard screen
Design an ops dashboard. Surface #0a0a0f. Flat stat cards: bg #111118,
border 1px solid #2a2a38. Key metric accent: hsl(262,83%,68%) for the number only.
Status badges: success #22c55e/bg rgba(34,197,94,0.1), error #ef4444/bg rgba(239,68,68,0.1).
Space Grotesk 700 headings, Inter 400 body. Dense type: base 14px, labels 13px.
Top nav: flat, bg #0a0a0f, border-bottom #2a2a38, max 4 icon tabs + command bar.

// Table view
Design a data table. Rows: bg #111118, hover #18181f.
Column headers: Inter 500 13px #9898a8. Values: Inter 400 14px #f0f0f5.
Row actions: opacity 0 → 1 on hover, text #9898a8.
Status column: badge pattern with semantic colors (success/warning/error/info).
Pagination controls: bottom-right, Inter 13px, accent border on active page.
```

---

## Anti-Drift Prompts (use when Stitch drifts from tokens)

```
// Font drift
Headings must use Instrument Serif (not Poppins, not any sans-serif).
Body must use Instrument Sans (not Inter, not system-ui).

// Card drift (glassmorphism appearing)
Content cards must be flat: bg-black, border rgba(255,255,255,0.10). No blur, no backdrop-filter.
Glass effect applies to the navigation scroll state only.

// Button drift
All CTA buttons must use rounded-full — not rounded-md, not rounded-lg.

// Hero alignment drift
Hero text block must be left-aligned (items-start), max-width 55% on desktop. Not centered.

// Color drift
Primary background: #0F0618 (not #000000, not #0a0a0f).
Cards: #000000 (not #0F0618, not dark gray).
Accent: #A855F7 (not generic purple, not blue-purple).

// INT accent overuse
The accent color hsl(262,83%,68%) should appear on: active state indicators, badge text, key metric numbers, focus rings. It should NOT appear as card backgrounds, section fills, or decorative elements.
```

---

## Stitch Export → AI Studio Handoff

After generating screens in Stitch, click **"Build in AI Studio"** then prepend this to the AI Studio prompt:

```
Use the attached Stitch design as visual reference only.
Output clean [React + Tailwind / HTML + CSS — pick one] code.
Apply these overrides to the Stitch design tokens exactly:

[PASTE BRAND BLOCK HERE]

Additional requirements:
- CSS custom properties for all tokens (--surface-base, --accent-primary, etc.)
- No hardcoded hex in component styles — vars only
- All states present: loading (skeleton shimmer), empty (with action), error (with recovery), success
- prefers-reduced-motion block present
- No TODOs, no placeholder handlers
```

---

---

# PLATFORM: BASE44

> Base44 uses React + Tailwind. Paste BRAND BLOCK first, then this adapter.

```
You are building a React component using Tailwind CSS utility classes.
Apply the following brand token mappings exactly.

[PASTE BRAND BLOCK HERE]

TOKEN → TAILWIND MAPPING
FlashFusion:
  bg-[#0F0618]              surface base
  bg-black                  card background (NOT bg-[#0F0618])
  bg-[#1A0B2E]/80           nav scrolled / alternate section
  border-white/10           default card border
  border-[#A855F7]/20       nav pill border
  text-[#F8FAFC]            primary text
  text-white/60             muted text
  text-white/40             dim text / eyebrow labels
  rounded-full              all CTA buttons
  backdrop-blur-xl          nav scrolled only, nowhere else
  font-['Instrument_Serif'] display headings
  font-['Instrument_Sans']  body and UI
  font-['JetBrains_Mono']   code, eyebrow labels

INT:
  bg-[#0a0a0f]              base surface
  bg-[#111118]              card, raised surface
  bg-[#18181f]              overlay / row hover
  border-[#2a2a38]          primary card border
  text-[#f0f0f5]            primary text
  text-[#9898a8]            secondary text
  text-[hsl(262,83%,68%)]   accent (metric values, badges, active states)
  rounded                   buttons (4px radius) — NOT rounded-full
  font-['Space_Grotesk']    headings
  font-['Inter']            body

Google Fonts import to include in HTML head or global CSS:

FlashFusion:
  https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif&family=JetBrains+Mono:wght@400;500&display=swap

INT:
  https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap

Code requirements:
- All tokens as CSS vars in :root (never inline hex in component JSX)
- TypeScript props interface for every component
- All states: loading (skeleton), empty (action present), error (recovery action), success, hover, focus-visible, disabled
- prefers-reduced-motion guard on all transitions
- No TODOs
```

---

---

# PLATFORM: AI STUDIO (Standalone — no Stitch)

> When using AI Studio directly without Stitch input.

```
You are generating production-quality UI code.

[PASTE BRAND BLOCK HERE]

Target output: [React / HTML+CSS — specify]
Framework: [React 18 + Tailwind / vanilla HTML+CSS — specify]

Screen to build:
[DESCRIBE SCREEN HERE — be specific: layout type, primary action, data displayed, navigation model]

Requirements:
1. Apply brand tokens as CSS custom properties in :root
2. Font stack loaded via Google Fonts (use URL from BRAND BLOCK above)
3. Responsive: mobile-first, stack vertically < 768px
4. All component states implemented: loading skeleton, empty with CTA, error with recovery, success confirmation, hover, focus-visible, disabled
5. No hardcoded hex in component code — CSS vars only
6. prefers-reduced-motion block at top of animation styles
7. Zero placeholders — all handlers wired even if stubbed with console.log

Anti-patterns to avoid for this profile:
[PASTE FORBIDDEN PATTERNS section from BRAND BLOCK]
```

---

---

# PLATFORM: CLAUDE (Direct)

> Use when prompting Claude directly (chat, API, or Claude Code).

```
You are building a [component / screen / page] using the following locked brand profile.
Do not deviate from these tokens. If a pattern you would normally choose conflicts with
these constraints, the constraint wins.

[PASTE FULL BRAND BLOCK HERE]

Task: [describe exactly what to build]

Gate checks before generating — answer each:
1. Which profile is active? [FlashFusion / INT]
2. What is the one named differentiator for this component vs category default?
3. What states are required? [list: empty, loading, error, success + any others]
4. What is the navigation model?
5. What format: HTML artifact / React / file?

Delivery requirements:
- BUILD section: file tree (if multi-file) + full code
- OUTPUT section: verification steps + acceptance criteria
- Delivery checklist at end confirming all states, tokens, anti-slop gates
```

---

---

# ANTI-DRIFT REFERENCE

> When any generator starts producing off-brand output, use these targeted injections.

| Drift Type | Injection |
|---|---|
| Wrong heading font | `Headings: Instrument Serif (FlashFusion) or Space Grotesk 700 (INT). Not Poppins, not system-ui.` |
| Wrong body font | `Body: Instrument Sans (FlashFusion) or Inter (INT). Not Poppins, not Roboto.` |
| Glass on cards | `Content cards are flat: bg-black with border rgba(255,255,255,0.10). No backdrop-blur, no blur filter.` |
| Pill buttons in INT | `INT buttons: border-radius 4px (Tailwind: 'rounded'). Not rounded-full.` |
| Rounded-md buttons in FF | `FlashFusion buttons: rounded-full. Not rounded-md, not rounded-lg.` |
| Centered hero (FF) | `Hero layout is left-aligned (items-start). Max width lg:max-w-[55%]. Not centered.` |
| Purple everywhere (INT) | `INT accent applies to: active states, badge text, key metric numerals, focus rings. Not backgrounds, not fills.` |
| White background appearing | `Both profiles are dark-mode. Base surface FlashFusion: #0F0618. INT: #0a0a0f. No light surfaces.` |
| Generic blue CTA | `Primary button color: #A855F7 gradient (FF) or accent hsl(262,83%,68%) (INT). No generic blue.` |
| Token bleed between profiles | `Confirm active profile. Do not mix INT tokens into FlashFusion or vice versa.` |

---

## Version

```
generator-prompt-system v1.0.0
Profiles: FlashFusion (source-verified May 2026) · INT (designed tokens)
Platforms: Stitch · Base44 · AI Studio · Claude
```
