# FlashFusion Design System
**Version:** 3.1.0  
**Last updated:** 2026-06-11  
**Source of truth for all FlashFusion surfaces — web, product, marketing, agent UIs**

---

## 1. Brand Identity

### Positioning
FlashFusion closes the gap between AI curiosity and deployed capability. The brand signal: *precision infrastructure, not hype*. Dark, dense, technical — but with a luminous gradient that says something real is happening inside.

### Brand Voice in Design
- Void-dark backgrounds — create cognitive contrast, reduce distraction
- Magenta/violet gradient — kinetic energy, forward motion
- Glassmorphic panels — depth without heaviness
- Geist typography — neutral infrastructure, engineered legibility

---

## 2. Color Tokens

```css
/* ── BRAND COLORS ─────────────────────────── */
--ff-violet:      #8B5CF6;   /* Primary violet — borders, accents */
--ff-violet-hi:   #A855F7;   /* Elevated violet — gradient start */
--ff-magenta:     #EC4899;   /* Brand magenta — CTAs, highlights */
--ff-cyan:        #06B6D4;   /* Teal — data, live indicators */
--ff-cyan-hi:     #22D3EE;   /* Bright teal — gradient terminus */

/* ── SURFACE SCALE ────────────────────────── */
--void:           #000000;   /* True black — hero backgrounds */
--void-2:         #05050A;   /* Near-black — body background */
--surface-1:      #0B0B14;   /* Base surface — cards, panels */
--surface-2:      #13131F;   /* Raised surface — modals, drawers */
--surface-3:      #1A1A2E;   /* High — dropdowns, tooltips */

/* ── BORDERS ──────────────────────────────── */
--border:         rgba(139, 92, 246, 0.12);   /* Default */
--border-strong:  rgba(139, 92, 246, 0.35);   /* Hover / focus */
--border-glow:    rgba(168, 85, 247, 0.60);   /* Active / selected */

/* ── TEXT SCALE ───────────────────────────── */
--text-1:         #FFFFFF;   /* Headings, primary labels */
--text-2:         #C7C7D1;   /* Body text */
--text-3:         #8A8A96;   /* Metadata, secondary */
--text-4:         #5A5A64;   /* Disabled, placeholder */

/* ── SEMANTIC ─────────────────────────────── */
--success:        #10B981;   /* Emerald */
--warning:        #F59E0B;   /* Amber */
--error:          #EF4444;   /* Red */
--info:           #3B82F6;   /* Blue */

/* ── GRADIENT ─────────────────────────────── */
--grad-brand:     linear-gradient(135deg, #A855F7 0%, #EC4899 55%, #22D3EE 100%);
--grad-glow:      radial-gradient(ellipse at top, rgba(168,85,247,0.15) 0%, transparent 70%);
--grad-card:      linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.04));
```

---

## 3. Typography

### Font Stack

| Role | Font | Fallback | Notes |
|---|---|---|---|
| **Body / UI** | Geist | `-apple-system, BlinkMacSystemFont, sans-serif` | Primary UI font — all weights |
| **Mono / Code** | Geist Mono | `SFMono-Regular, Menlo, monospace` | Code, data, terminal |
| **Display / Serif** | Instrument Serif | `Times New Roman, serif` | Hero text, editorial pull quotes |
| **Logo only** | Poppins Bold | — | Logo wordmark — do not use elsewhere |

> **Deprecated:** Instrument Sans, JetBrains Mono — do not introduce into new surfaces.

### Type Scale

```css
/* ── DISPLAY ──────── */
--text-6xl:  clamp(3rem,   6vw, 5rem);      /* 48–80px — hero headline */
--text-5xl:  clamp(2.5rem, 5vw, 4rem);      /* 40–64px */
--text-4xl:  clamp(2rem,   4vw, 3rem);      /* 32–48px — section headline */
--text-3xl:  clamp(1.75rem, 3vw, 2.25rem);  /* 28–36px */
--text-2xl:  clamp(1.5rem,  2.5vw, 1.875rem);/* 24–30px */
--text-xl:   1.25rem;                        /* 20px — subheading */
--text-lg:   1.125rem;                       /* 18px — large body */
--text-base: 1rem;                           /* 16px — body */
--text-sm:   0.875rem;                       /* 14px — meta */
--text-xs:   0.75rem;                        /* 12px — label */
--text-2xs:  0.625rem;                       /* 10px — badge */

/* ── WEIGHTS ─────── */
--weight-light:   300;
--weight-regular: 400;
--weight-medium:  500;
--weight-semibold:600;
--weight-bold:    700;

/* ── LINE HEIGHTS ─── */
--leading-tight:  1.2;
--leading-snug:   1.35;
--leading-normal: 1.5;
--leading-relaxed:1.65;

/* ── LETTER SPACING ─ */
--tracking-tight:  -0.02em;
--tracking-normal:  0;
--tracking-wide:    0.05em;
--tracking-wider:   0.1em;
--tracking-widest:  0.15em;   /* ALL CAPS labels */
```

---

## 4. Spacing System (8pt grid)

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
--space-32:  128px;
--space-40:  160px;

/* Layout */
--container:      1280px;
--container-sm:   768px;
--container-lg:   1024px;
--nav-height:     72px;
--section-gap:    clamp(64px, 10vw, 120px);
```

---

## 5. Border Radius

```css
--radius-xs:  4px;
--radius-sm:  6px;
--radius-md:  8px;
--radius-lg:  12px;
--radius-xl:  16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## 6. Elevation & Glass

### Glassmorphism Pattern

```css
/* Standard card */
.glass-card {
  background: rgba(11, 11, 20, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* Elevated modal */
.glass-modal {
  background: rgba(19, 19, 31, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-2xl);
}

/* Subtle HUD */
.glass-hud {
  background: rgba(5, 5, 10, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
}
```

### Box Shadows

```css
--shadow-sm:    0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.24);
--shadow-md:    0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
--shadow-lg:    0 8px 32px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3);
--shadow-glow:  0 0 24px rgba(168,85,247,0.25), 0 0 48px rgba(168,85,247,0.1);
--shadow-glow-magenta: 0 0 24px rgba(236,72,153,0.3);
--shadow-glow-cyan:    0 0 24px rgba(34,211,238,0.2);
```

---

## 7. Motion & Easing

```css
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);     /* Default — snappy settle */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);    /* Transitions */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* Micro-interactions */

/* Durations */
--duration-fast:   120ms;
--duration-normal: 200ms;
--duration-slow:   350ms;
--duration-enter:  400ms;
```

### Motion Principles
1. Nothing moves without reason — animation = information
2. Prefer translate/opacity — never animate layout properties
3. All animations respect `prefers-reduced-motion`
4. Entry animations: fade-up (y: 20px → 0, opacity: 0 → 1)
5. Hover: 150ms ease-out scale(1.02) max

---

## 8. Iconography

- **Library:** Lucide (MIT) — consistent stroke-width 1.5px
- **Size scale:** 12, 14, 16, 18, 20, 24px
- **Color:** inherit from text context, or explicit token
- **Never:** filled icons in UI chrome; only in empty states / illustrations
- **Logo mark:** SVG-only, never rasterized below 40px

---

## 9. Component Patterns

### Button System

```css
/* Primary — gradient fill */
.btn-primary {
  background: var(--grad-brand);
  color: #fff;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  letter-spacing: 0.01em;
  box-shadow: var(--shadow-glow);
  transition: opacity 150ms var(--ease-out),
              transform 150ms var(--ease-out),
              box-shadow 150ms var(--ease-out);
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow), var(--shadow-md);
}

/* Ghost — bordered */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--text-1);
  padding: 11px 23px;  /* -1px for border */
}
.btn-ghost:hover {
  border-color: var(--border-glow);
  background: rgba(139,92,246,0.08);
}

/* Sizes */
.btn-sm  { padding: 8px 16px;  font-size: 0.8125rem; }
.btn-md  { padding: 12px 24px; font-size: 0.9375rem; }
.btn-lg  { padding: 16px 32px; font-size: 1.0625rem; }
```

### Input System

```css
.input {
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-1);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  transition: border-color 150ms var(--ease-out);
}
.input:focus {
  outline: none;
  border-color: var(--border-strong);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
}
.input::placeholder { color: var(--text-4); }
```

### Badge / Tag

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  border: 1px solid;
}
.badge-violet { color: var(--ff-violet-hi); border-color: rgba(168,85,247,0.3); background: rgba(168,85,247,0.08); }
.badge-magenta { color: var(--ff-magenta); border-color: rgba(236,72,153,0.3); background: rgba(236,72,153,0.08); }
.badge-cyan { color: var(--ff-cyan-hi); border-color: rgba(34,211,238,0.3); background: rgba(34,211,238,0.08); }
```

---

## 10. Grid & Layout

```css
/* Page grid */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

/* Standard content widths */
.w-prose   { max-width: 720px; }
.w-content { max-width: 960px; }
.w-wide    { max-width: 1280px; }
.w-full    { max-width: 100%; }
```

---

## 11. Dark Mode Only

FlashFusion is a dark-mode-only system. There is no light theme. All surfaces are on the void scale. If a platform forces light mode, use `color-scheme: dark` and override.

---

## 12. Logo Usage

- **Wordmark:** "FLASHFUSION" — Poppins 700 — all caps
- **Gradient treatment:** `--grad-brand` applied as `background-clip: text`
- **Minimum size:** 120px wide
- **Clear space:** equal to cap-height on all sides
- **Do not:** rotate, recolor to flat, add drop shadows, apply on light backgrounds without explicit dark backdrop

---

## 13. Audit Funnel Brand Expression

`audit.flashfusion.co` (Invoke) follows all tokens above plus:
- Hero label: "AI READINESS" in `--ff-magenta` uppercase badge
- CTA primary: "Get Your Free Scorecard" — gradient button
- Funnel steps use numbered prefix in `--ff-violet-hi`

---

*End of design.md — update on any token change. Do not fork this file.*
