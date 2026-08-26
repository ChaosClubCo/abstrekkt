# FlashFusion Brand Guide

**Brand:** FlashFusion
**Version:** 1.0
**Last updated:** April 2026
**Purpose:** Source-of-truth brand guide for Claude Design system extraction.

---

## 1. Brand personality

FlashFusion is an AI-powered development platform. The brand voice is:

- **Technical but human** — precise, direct, no fluff
- **Electric and kinetic** — energy, momentum, transformation
- **Premium dark-mode native** — designed for developers who work at night
- **Confident, not loud** — assertive typography, restrained motion
- **Anti-slop** — rejects generic purple gradients, rejects stock AI aesthetics

**Tagline candidates:** "Transform Your Vision Into Reality" — "Where ideas become production-ready products"

---

## 2. Typography system

**Primary display:** Poppins
**Primary body:** Inter
**Monospace (code):** JetBrains Mono
**All served via Google Fonts CDN.**

### Display / Headlines — Poppins
- **Weights in use:** 600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black)
- **Roles:** Hero headlines, H1, H2, H3, brand marks, CTA labels
- **Letter-spacing:** -0.035em on 800+; -0.02em on 600-700
- **Line-height:** 0.95 on hero; 1.0 on H1; 1.1 on H2; 1.2 on H3
- **Google Fonts URL param:** `Poppins:wght@600;700;800;900`

### Body / Long-form — Inter
- **Weights in use:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Roles:** Body text, paragraphs, UI labels, form inputs, captions, navigation, table data
- **Letter-spacing:** 0 on body; 0.02em on all-caps labels
- **Line-height:** 1.5 on body; 1.4 on UI; 1.3 on tight labels
- **Google Fonts URL param:** `Inter:wght@400;500;600;700`

### Monospace — JetBrains Mono
- **Weights in use:** 400 (Regular), 600 (SemiBold)
- **Roles:** Code blocks, token values, API snippets, technical specifications
- **Line-height:** 1.6
- **Google Fonts URL param:** `JetBrains+Mono:wght@400;600`

### Combined Google Fonts import
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

### Fallback stack
- **Sans fallback:** `system-ui, -apple-system, "Segoe UI", sans-serif`
- **Mono fallback:** `ui-monospace, "SF Mono", Menlo, monospace`

### Type scale (desktop baseline)

| Token | Font | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `display-hero` | Poppins | 900 | clamp(2.5rem, 6vw, 4.5rem) | 0.95 | -0.035em |
| `display-xl` | Poppins | 800 | 3.5rem | 1.0 | -0.03em |
| `h1` | Poppins | 800 | 3rem | 1.05 | -0.03em |
| `h2` | Poppins | 700 | 2.25rem | 1.1 | -0.025em |
| `h3` | Poppins | 700 | 1.5rem | 1.2 | -0.02em |
| `h4` | Poppins | 600 | 1.25rem | 1.3 | -0.015em |
| `body-lg` | Inter | 400 | 1.125rem | 1.5 | 0 |
| `body` | Inter | 400 | 1rem | 1.5 | 0 |
| `body-sm` | Inter | 400 | 0.875rem | 1.4 | 0 |
| `ui` | Inter | 500 | 0.875rem | 1.3 | 0 |
| `caption` | Inter | 400 | 0.75rem | 1.4 | 0.02em |
| `button` | Poppins | 600 | 0.9375rem | 1.0 | 0.01em |
| `code` | JetBrains Mono | 400 | 0.875rem | 1.6 | 0 |

---

## 3. Color system

### Core tokens (dark-mode native)

| Token | Hex | Contrast on `#0A0A0F` | Role |
|---|---|---|---|
| `--ff-void` | `#0A0A0F` | — | Primary background |
| `--ff-deep` | `#141328` | — | Elevated surface |
| `--ff-indigo` | `#322B75` | 3.1:1 | Surface / borders / dividers |
| `--ff-primary` | `#8B5CF6` | 4.2:1 | Brand fill (large UI only — buttons, badges) |
| `--ff-primary-light` | `#C4B5FD` | 10.3:1 AAA | Violet text / links |
| `--ff-glow` | `#A855F7` | 5.2:1 AA | Glow highlights, accents |
| `--ff-electric` | `#06B6D4` | 6.1:1 AA | Accent color / secondary brand |
| `--ff-electric-light` | `#67E8F9` | 11.2:1 AAA | Electric text / focus rings |
| `--ff-bright` | `#E0E7FF` | 16.8:1 AAA | Text on colored surfaces |
| `--ff-text` | `#F8FAFC` | 19:1 AAA | Primary body text |
| `--ff-text-muted` | `#94A3B8` | 7.8:1 AAA | Secondary text |

### Semantic colors

| Token | Hex | Role |
|---|---|---|
| `--ff-success` | `#10B981` | Success states |
| `--ff-warning` | `#F59E0B` | Warning states |
| `--ff-danger` | `#EF4444` | Error / destructive |
| `--ff-info` | `#06B6D4` | Info (= electric) |

### Color usage rules

- **Backgrounds:** always `--ff-void` or `--ff-deep`. No light-mode variants in scope.
- **Primary brand fill:** `--ff-primary` only for interactive surfaces ≥ 40px. Never use as body text on `--ff-void` (fails AA).
- **Text hierarchy:** `--ff-text` > `--ff-text-muted` > `--ff-primary-light`
- **Accents:** electric/cyan is the secondary accent; never use it as primary fill
- **Gradients:** allowed only in hero treatments and decorative backgrounds. Never on buttons or cards.

---

## 4. Visual aesthetic

- **Dark-mode native** — void background, layered with subtle violet/electric luminance
- **Glassmorphism surfaces** — `backdrop-filter: blur(14px) saturate(140%)` on content cards
- **Electric motion** — WebGL shader hero with lightning, flow fields, plasma tracing, sparks
- **Glow shadows** — text and UI use purple/cyan glow shadows for depth
- **Restrained animation** — respects `prefers-reduced-motion`, animations scoped to hero sections

### Key shadow tokens
```css
--ff-glow-purple: 0 0 40px rgba(139, 92, 246, 0.25);
--ff-glow-cyan: 0 0 80px rgba(6, 182, 212, 0.15);
--ff-shadow-card: 0 0 0 1px rgba(10, 10, 15, 0.4) inset, 0 24px 60px -20px rgba(0, 0, 0, 0.6);
--ff-border-subtle: 1px solid rgba(196, 181, 253, 0.12);
```

---

## 5. Layout & spacing

- **Max content width:** 1440px
- **Section padding (mobile):** 24px horizontal, 64px vertical
- **Section padding (desktop):** 48px horizontal, 80px vertical
- **Border-radius scale:** 8px (small UI), 12px (inputs), 18px (cards), 24px (hero surfaces)
- **Grid:** 12-column with 24px gutter on desktop; single-column stack on mobile

---

## 6. Component priors

- **Buttons:** rounded-full or 12px radius, Poppins 600 label, `--ff-primary` fill, hover → `--ff-glow`
- **Cards:** glassmorphism surface, subtle violet border, heavy shadow
- **Inputs:** dark surface, `--ff-indigo` border, `--ff-electric-light` focus ring
- **Nav:** dark void background, Inter 500 labels, brand mark in Poppins 800

---

## 7. What to avoid (anti-patterns)

- Light-mode variants — out of scope for FlashFusion
- Generic system fonts (Arial, Helvetica, default sans) — always specify Poppins/Inter
- Flat purple gradients without depth — always layer with electric accent or indigo
- Stock AI aesthetics: centered gradient orbs, generic glass cards, default lucide icons without style
- Heavy animations on body content — motion is reserved for hero sections
- Light-weight display type (Poppins 300-400) — display always 600+

---

## 8. Sample compositions

### Hero
- Background: WebGL shader (electricity treatment) or `--ff-glow-purple` radial gradient
- Headline: Poppins 800/900, `--ff-text`, text-shadow with purple + cyan glow
- Supporting text: Inter 400, `--ff-text-muted`
- CTA: Poppins 600, `--ff-primary` fill, rounded-full

### Feature card
- Surface: `--ff-deep` with `--ff-border-subtle`, 18px radius
- Title: Poppins 700, `--ff-text`
- Body: Inter 400, `--ff-text-muted`
- Icon: `--ff-electric-light` stroke

---

*This guide is the source of truth for Claude Design extraction. Colors, typography, and component priors above are the locked FlashFusion design tokens.*
