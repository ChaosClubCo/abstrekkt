# FlashFusion Design Tokens — v3 (May 2026)

Void-dark, layered depth with semi-transparent blur cards, editorial display type.
SOT: `flashfusion-landing-v3.html` + `managing-design-briefs` v4.0.0.

**Do not use v2 tokens.** See Deprecated Watchlist at bottom.

---

## CSS Variables — Full Token Set

```css
:root {
  /* === SURFACES === */
  --ff-void:         #000000;   /* body — true void */
  --ff-void-2:       #05050A;   /* near-void */
  --ff-surface-1:    #0B0B14;   /* primary surface — cards, main bg */
  --ff-surface-2:    #13131F;   /* raised surface — panels, inputs */

  /* === BORDERS === */
  --ff-border:        rgba(139, 92, 246, 0.12);  /* default card/panel borders */
  --ff-border-strong: rgba(139, 92, 246, 0.35);  /* focused, hovered, selected */
  --ff-border-glow:   rgba(168, 85, 247, 0.6);   /* active, emphasized */

  /* === ACCENT — GLOW TRIAD === */
  --ff-violet:      #8B5CF6;  /* violet base */
  --ff-violet-hi:   #A855F7;  /* violet highlight — primary actions */
  --ff-magenta:     #EC4899;  /* magenta — secondary, decorative */
  --ff-cyan:        #06B6D4;  /* cyan base */
  --ff-cyan-hi:     #22D3EE;  /* cyan highlight — data, confirmation */

  /* Gradient — hero text, key CTAs, progress fills */
  --ff-gradient: linear-gradient(135deg, var(--ff-violet-hi) 0%, var(--ff-magenta) 55%, var(--ff-cyan-hi) 100%);

  /* Glow effects — use sparingly, max 1-2 elements per screen */
  --ff-glow-primary:   0 0 20px rgba(168, 85, 247, 0.4);
  --ff-glow-secondary: 0 0 20px rgba(236, 72, 153, 0.3);
  --ff-glow-subtle:    0 0 12px rgba(168, 85, 247, 0.2);

  /* === TEXT === */
  --ff-text-1: #FFFFFF;   /* headings, primary content */
  --ff-text-2: #C7C7D1;  /* body, secondary content */
  --ff-text-3: #8A8A96;  /* tertiary labels, metadata */
  --ff-text-4: #5A5A64;  /* disabled, placeholder, footers */

  /* === TYPOGRAPHY === */
  --ff-font-display: 'Instrument Serif', 'Times New Roman', serif;
  --ff-font-body:    'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
  --ff-font-mono:    'Geist Mono', 'SFMono-Regular', Menlo, monospace;
  /* Poppins is LOGO ONLY — never use as heading or body font */

  /* === TYPE SCALE (1.25 Major Third ratio) === */
  --ff-text-xs:   0.64rem;   /* 10.24px */
  --ff-text-sm:   0.8rem;    /* 12.8px */
  --ff-text-base: 1rem;      /* 16px */
  --ff-text-md:   1.25rem;   /* 20px */
  --ff-text-lg:   1.563rem;  /* 25px */
  --ff-text-xl:   1.953rem;  /* 31.25px */
  --ff-text-2xl:  2.441rem;  /* 39px */
  --ff-text-3xl:  3.052rem;  /* 48.8px */

  /* === FONT WEIGHTS === */
  --ff-weight-regular:  400;
  --ff-weight-medium:   500;
  --ff-weight-semibold: 600;
  --ff-weight-bold:     700;

  /* === LINE HEIGHT === */
  --ff-leading-tight:  1.2;   /* headings */
  --ff-leading-snug:   1.35;  /* subheadings */
  --ff-leading-normal: 1.5;   /* body */
  --ff-leading-loose:  1.7;   /* long-form prose */

  /* === SPACING (8pt grid) === */
  --ff-space-1:  4px;
  --ff-space-2:  8px;
  --ff-space-3:  12px;
  --ff-space-4:  16px;
  --ff-space-5:  20px;
  --ff-space-6:  24px;
  --ff-space-8:  32px;
  --ff-space-10: 40px;
  --ff-space-12: 48px;
  --ff-space-16: 64px;

  /* === BORDER RADIUS === */
  --ff-radius-sm:   8px;    /* inputs, small elements */
  --ff-radius-md:   12px;   /* cards, panels */
  --ff-radius-lg:   16px;   /* glassmorphic cards */
  --ff-radius-xl:   24px;   /* hero sections */
  --ff-radius-full: 999px;  /* pills, avatars, buttons */

  /* === GLASS EFFECT (signature) === */
  /* Usage: background: var(--ff-glass-bg); backdrop-filter: blur(12px);
     -webkit-backdrop-filter: blur(12px); border: 1px solid var(--ff-border);
     border-radius: var(--ff-radius-lg); */
  --ff-glass-bg: rgba(11, 11, 20, 0.8);

  /* === SEMANTIC COLORS === */
  --ff-success:    #4ade80;
  --ff-warning:    #fbbf24;
  --ff-error:      #f87171;
  --ff-info:       #22D3EE;  /* same as cyan-hi — intentional */

  --ff-success-bg: rgba(74, 222, 128, 0.1);
  --ff-warning-bg: rgba(251, 191, 36, 0.1);
  --ff-error-bg:   rgba(248, 113, 113, 0.1);
  --ff-info-bg:    rgba(34, 211, 238, 0.1);

  /* === SHADOWS === */
  --ff-shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.5);
  --ff-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.6);
  --ff-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.7);
  --ff-shadow-glow: var(--ff-glow-primary);

  /* === EASING === */
  --ff-ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ff-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* === Z-INDEX === */
  --ff-z-base:     1;
  --ff-z-raised:   10;
  --ff-z-dropdown: 100;
  --ff-z-modal:    200;
  --ff-z-toast:    300;
}
```

---

## Google Fonts Load

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

---

## FlashFusion v3 Aesthetic Rules

**Glass is the signature.** Cards use `backdrop-filter: blur(12px)` + semi-transparent
background (`--ff-glass-bg`). Every card has a subtle violet border — not solid, rgba only.
Cards are NEVER flat black.

**Glow is earned.** Apply `--ff-glow-primary` on active states and hero elements only.
Max 1–2 glowing elements per screen. Overuse kills the effect.

**Gradient accent = hero moments.** Use `--ff-gradient` on:
- Hero text / display headlines (with Instrument Serif)
- Primary CTA buttons
- Progress bars / completion indicators
Never on body text, secondary labels, or background fills.

**Navigation:** Floating pill with blur, always visible. NOT scroll-triggered.
Bottom nav for mobile. Top nav for desktop. Never a sidebar.

**Buttons:** Pill shape (`border-radius: var(--ff-radius-full)`), Geist Mono, uppercase.

**Container:** 1280px max-width, left-aligned hero.

---

## Base Component Styles

### Glass Card
```css
.ff-glass-card {
  background: var(--ff-glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--ff-border);
  border-radius: var(--ff-radius-lg);
  padding: var(--ff-space-6);
  transition: border-color 200ms var(--ff-ease-out),
              box-shadow 200ms var(--ff-ease-out);
}
.ff-glass-card:hover {
  border-color: var(--ff-border-strong);
  box-shadow: var(--ff-glow-subtle);
}
.ff-glass-card:focus-visible {
  outline: 2px solid var(--ff-violet-hi);
  outline-offset: 2px;
}
```

### Gradient Text
```css
.ff-gradient-text {
  background: var(--ff-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Primary Button
```css
.ff-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--ff-space-2);
  padding: var(--ff-space-3) var(--ff-space-6);
  border-radius: var(--ff-radius-full);
  background: var(--ff-gradient);
  color: #fff;
  font-family: var(--ff-font-mono);
  font-size: var(--ff-text-sm);
  font-weight: var(--ff-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  transition: opacity 150ms ease, box-shadow 200ms ease;
}
.ff-btn-primary:hover {
  opacity: 0.92;
  box-shadow: var(--ff-glow-primary);
}
.ff-btn-primary:focus-visible {
  outline: 2px solid var(--ff-violet-hi);
  outline-offset: 2px;
}
.ff-btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}
```

### Secondary Button (Glass)
```css
.ff-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--ff-space-2);
  padding: var(--ff-space-3) var(--ff-space-6);
  border-radius: var(--ff-radius-full);
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid var(--ff-border-strong);
  color: var(--ff-text-1);
  font-family: var(--ff-font-mono);
  font-size: var(--ff-text-sm);
  font-weight: var(--ff-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
}
.ff-btn-secondary:hover {
  background: rgba(168, 85, 247, 0.15);
  border-color: var(--ff-border-glow);
}
.ff-btn-secondary:focus-visible {
  outline: 2px solid var(--ff-violet-hi);
  outline-offset: 2px;
}
```

### Badge
```css
.ff-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--ff-space-1) var(--ff-space-3);
  border-radius: var(--ff-radius-full);
  font-family: var(--ff-font-mono);
  font-size: var(--ff-text-xs);
  font-weight: var(--ff-weight-medium);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.ff-badge--violet  { background: rgba(168, 85, 247, 0.15); color: var(--ff-violet-hi); border: 1px solid rgba(168, 85, 247, 0.3); }
.ff-badge--magenta { background: rgba(236, 72, 153, 0.15); color: var(--ff-magenta); border: 1px solid rgba(236, 72, 153, 0.3); }
.ff-badge--cyan    { background: rgba(34, 211, 238, 0.15); color: var(--ff-cyan-hi); border: 1px solid rgba(34, 211, 238, 0.3); }
.ff-badge--success { background: var(--ff-success-bg); color: var(--ff-success); }
.ff-badge--error   { background: var(--ff-error-bg);   color: var(--ff-error); }
```

### Input
```css
.ff-input {
  width: 100%;
  background: var(--ff-surface-2);
  border: 1px solid var(--ff-border);
  border-radius: var(--ff-radius-sm);
  padding: var(--ff-space-3) var(--ff-space-4);
  font-family: var(--ff-font-body);
  font-size: var(--ff-text-base);
  color: var(--ff-text-1);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.ff-input::placeholder { color: var(--ff-text-4); }
.ff-input:focus {
  outline: none;
  border-color: var(--ff-violet-hi);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
}
```

---

## Cross-Profile Isolation

**Never use in FlashFusion v3 outputs:**
- INT void surface: `#0a0a0f`
- Space Grotesk font
- Flat card style (no blur, no gradient border)
- Solid-fill accent usage above 10% of surface
- INT's `hsl(262, 83%, 68%)` variant — FlashFusion uses `#A855F7`

---

## Deprecated v2 Token Watchlist

Any output containing these is using stale v2 tokens — **flag immediately and replace:**

| Deprecated (v2) | Replacement (v3) |
|-----------------|-----------------|
| `#0F0618` surface | `#0B0B14` |
| `#1A0B2E` raised | `#13131F` |
| `#251443` overlay | `#13131F` (no separate overlay in v3) |
| `Poppins` as heading | `Instrument Serif` (display) or `Geist` (heading) |
| `Inter` as body | `Geist` |
| `JetBrains Mono` as code | `Geist Mono` |
| `Instrument Sans` | REMOVED — never existed in v3 |
| `#F472B6` pink | `#EC4899` magenta |
| `90deg` gradient | `135deg` |
| `rgba(15, 6, 24, 0.6)` glass bg | `rgba(11, 11, 20, 0.8)` |
| `bg-black` flat cards | Semi-transparent + blur(12px) |
| Scroll-triggered nav glass | Always-floating pill nav |

---

## CLAIMS
- v3 token values source-verified from flashfusion-landing-v3.html [SOURCED]
- v3 font stack confirmed: Instrument Serif / Geist / Geist Mono [SOURCED]
- Deprecated watchlist confirmed from managing-design-briefs v4.0.0 line 111 [SOURCED]
- Type scale ratio (1.25 Major Third) [GENERATED — chosen for this update]

## GAPS / BLINDSPOTS
- FlashFusion mobile component patterns underspecified
- v3 canvas animation performance on low-end devices unmeasured
- Instrument Serif italic variant availability on all platforms unverified
