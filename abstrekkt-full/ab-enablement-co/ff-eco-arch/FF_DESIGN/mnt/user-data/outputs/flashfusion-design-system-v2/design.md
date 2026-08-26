# FlashFusion Design System
**Version:** 3.2.0  
**Updated:** 2026-06-11  
**Changes from v3.1:** Added 3 brand colors, 2 gradients, Orbitron as display-alt, fluid wave bg, FF monogram update  
**Image references:** Brand style guide (Img1), Enterprise landing (Img2), Beta Tester Army (Img3), Fluid waves bg (Img4)

---

## 1. Brand Identity

### Positioning
FlashFusion closes the gap between AI curiosity and deployed capability.  
**Signal:** precision infrastructure + kinetic energy. Dark technical surfaces with a full-spectrum gradient that makes it clear something real is happening inside.

### Two Brand Modes (confirmed by images)

| Mode | Context | Gradient | Typography | Example |
|---|---|---|---|---|
| **Enterprise** | Consulting, enterprise sales, LinkedIn | violet→magenta→cyan | Orbitron + Geist | Image 2 homepage |
| **Energy** | Marketing, social, events, product launches | orange→red→purple→cyan | Orbitron Bold + Geist | Image 1 style guide |

Both modes share the same surface/background system. The gradient switches; the void stays.

---

## 2. Color Tokens (v3.2 — Full 6-Stop Palette)

```css
/* ── CORE BRAND (unchanged from v3.1) ─── */
--ff-violet:      #8B5CF6;   /* Borders, accents */
--ff-violet-hi:   #A855F7;   /* Gradient anchor, interactive states */
--ff-purple:      #A144FF;   /* Creativity, premium features — Image 1 */
--ff-magenta:     #EC4899;   /* CTAs, brand highlight */
--ff-cyan:        #06B6D4;   /* Data, live indicators */
--ff-cyan-hi:     #22D3EE;   /* Gradient terminus */
--ff-cyan-brand:  #00E5FF;   /* Image 1 "clarity/focus" — brightest cyan */

/* ── ENERGY PALETTE (new in v3.2) ─────── */
--ff-orange:      #FF6A00;   /* CTAs, energy, sparks — Image 1 "Energy/Action" */
--ff-red:         #FF2D55;   /* Secondary CTAs, heat — Image 1 "Passion/Ignite" */

/* ── ENTERPRISE/TRUST (new in v3.2) ─── */
--ff-indigo:      #5B3DFF;   /* Tech elements, UI — Image 1 "Tech/Future" */
--ff-blue:        #0077FF;   /* Trust, stability, enterprise — Image 1 "Trust/Stability" */
```

### Color Semantics (Image 1 reference)

| Color | Token | Role |
|---|---|---|
| `#FF6A00` | `--ff-orange` | Energy / Action — CTAs, highlights, important actions, sparks |
| `#FF2D55` | `--ff-red` | Passion / Ignite — Secondary CTAs, alerts, emphasis, heat |
| `#A144FF` | `--ff-purple` | Creativity / Magic — Premium features, imagination, innovation |
| `#5B3DFF` | `--ff-indigo` | Tech / Future — Technical elements, futuristic UI components |
| `#00E5FF` | `--ff-cyan-brand` | Clarity / Focus — Links, info, data, focus states, clean accents |
| `#0077FF` | `--ff-blue` | Trust / Stability — Backgrounds, foundation, enterprise feel |

---

## 3. Gradients

```css
/* Core brand — enterprise mode (primary) */
--grad-brand:      linear-gradient(135deg, #A855F7 0%, #EC4899 55%, #22D3EE 100%);

/* Full spectrum — energy mode (marketing/social) */
--grad-energy:     linear-gradient(90deg, #FF6A00 0%, #FF2D55 30%, #A144FF 65%, #00E5FF 100%);

/* Enterprise cool — tech/trust contexts */
--grad-enterprise: linear-gradient(135deg, #5B3DFF 0%, #A144FF 55%, #00E5FF 100%);

/* Fluid wave background — Image 4 style */
--grad-wave-bg:    radial-gradient(ellipse at 70% 50%, rgba(91,61,255,0.4) 0%,
                     rgba(161,68,255,0.2) 30%, rgba(0,0,0,0) 70%),
                   radial-gradient(ellipse at 30% 80%, rgba(0,119,255,0.15) 0%, transparent 60%);

/* Card background */
--grad-card:       linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.04));
```

---

## 4. Typography (v3.2 update)

### Font Stack

| Role | Font | Fallback | Usage |
|---|---|---|---|
| **Kinetic display** | Orbitron 700/900 | sans-serif | Hero headings, section titles, data labels, ALL CAPS — *added v3.2* |
| **UI / body** | Geist 300–700 | Inter, system-ui | All body text, UI chrome, nav, buttons, metadata |
| **Mono / code** | Geist Mono 400/500 | SFMono-Regular, Menlo | Code, API keys, terminal, data values |
| **Editorial serif** | Instrument Serif 400 | Times New Roman | Pull quotes, memoir content ONLY — not UI, not headings |
| **Logo wordmark** | Poppins 700 | — | Logo text only — never elsewhere |

> **v3.2 addition:** Orbitron is now the primary display font for all FlashFusion marketing surfaces. Image 1 and Image 2 both confirm this direction. Instrument Serif is demoted to editorial-only.  
> **Still deprecated:** Instrument Sans, JetBrains Mono.

### Google Fonts load block

```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Poppins:wght@700&display=swap" rel="stylesheet">
```

---

## 5. Logo System (v3.2 rebuild)

### Marks

| Mark | File | Usage |
|---|---|---|
| **FF double-chevron monogram** | `ff-monogram.svg` | Primary — enterprise contexts, nav bar, favicon, app icon |
| **FF lockup horizontal** | `ff-lockup-horizontal.svg` | Nav bar — mark + "FLASHFUSION" + sub-label |
| **Energized FF with glow** | *(generate via Gemini Prompt 04)* | Marketing, social, events, conference — Image 1 style |
| **Script wordmark** | *(generate via Gemini Prompt 09)* | Display/hero only — never UI chrome |

### Logo Color Usage

- **Enterprise contexts:** `--grad-brand` (violet→magenta→cyan)
- **Energy/marketing:** `--grad-energy` (orange→red→purple→cyan)
- **Monochrome on dark:** `--text-1` (#FFFFFF)
- **Never:** light backgrounds without dark backdrop, rotation, drop shadows, recolor to flat

### Minimum sizes

| Context | Min width |
|---|---|
| Favicon | 16px |
| App icon | 40px |
| Nav bar mark | 32px |
| Full lockup | 160px |

---

## 6. Surface & Background System

```css
/* ── SURFACES ─────────────────────────────── */
--void:      #000000;   /* True black — hero, full-bleed */
--void-2:    #05050A;   /* Near-black — page body */
--surface-1: #0B0B14;   /* Base cards, panels */
--surface-2: #13131F;   /* Raised — modals, drawers */
--surface-3: #1A1A2E;   /* High — dropdowns, tooltips */
--surface-4: #0D1128;   /* Deep navy — enterprise/trust sections */
```

### Background Patterns

**Void grid** (subtle, Image 2 page texture):
```css
background-image:
  linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
background-size: 80px 80px;
```

**Fluid wave** (Image 4 hero treatment):
```css
background: var(--grad-wave-bg), var(--void-2);
/* + SVG wave paths at 15% opacity as overlay */
```

---

## 7. Component Patterns

### Buttons (Image 1 usage examples confirmed)

```css
/* Primary — energy gradient (Image 1 "GET STARTED" CTA) */
.btn-primary {
  background: var(--grad-brand);   /* or --grad-energy for energy mode */
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 0 20px rgba(168,85,247,0.3);
}

/* Ghost — bordered (Image 1 secondary CTAs) */
.btn-ghost {
  border: 1px solid rgba(168,85,247,0.35);
  padding: 13px 27px;
  border-radius: 8px;
  background: transparent;
  color: var(--text-2);
}
```

### Progress Bar (Image 1 pattern)

```css
.progress-bar { height: 6px; border-radius: 999px; background: var(--surface-3); }
.progress-fill { background: var(--grad-energy); border-radius: 999px; height: 100%; }
```

### Edge Glow Card (Images 2 + 3 pattern)

```css
.card-edge-glow {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(168,85,247,0.08),
              inset 0 1px 0 rgba(255,255,255,0.05);
  transition: border-color 200ms, box-shadow 200ms;
}
.card-edge-glow:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-glow);
}
```

### Badge / Tag (Image 1 color-coded pattern)

```css
.badge-orange  { color: var(--ff-orange);  border-color: rgba(255,106,0,0.3);  background: rgba(255,106,0,0.08); }
.badge-red     { color: var(--ff-red);     border-color: rgba(255,45,85,0.3);  background: rgba(255,45,85,0.08); }
.badge-purple  { color: var(--ff-purple);  border-color: rgba(161,68,255,0.3); background: rgba(161,68,255,0.08); }
.badge-indigo  { color: var(--ff-indigo);  border-color: rgba(91,61,255,0.3);  background: rgba(91,61,255,0.08); }
.badge-cyan    { color: var(--ff-cyan-brand); border-color: rgba(0,229,255,0.3); background: rgba(0,229,255,0.08); }
.badge-blue    { color: var(--ff-blue);    border-color: rgba(0,119,255,0.3);  background: rgba(0,119,255,0.08); }
```

---

## 8. Beta Tester Army (Separate Brand — Image 3)

Beta Tester Army is a **ChaosClubCo product, not a FlashFusion brand asset**. Do not merge tokens.

| Element | BTA value | Notes |
|---|---|---|
| Primary CTA | `#00E5FF` (teal) | Different from FF primary |
| Background | Deep navy + purple waves | Shares wave motif with Img4 |
| Body font | Inter (appears) | Different from FF Geist |
| Dashboard accent | `#7C3AED` approx | Closer to violet |

---

## 9. Spacing, Motion, Z-index

Unchanged from v3.1 — see `tokens-v3.2.css` for full reference.

---

*End of design.md v3.2 — single source of truth. Update on every token change.*
