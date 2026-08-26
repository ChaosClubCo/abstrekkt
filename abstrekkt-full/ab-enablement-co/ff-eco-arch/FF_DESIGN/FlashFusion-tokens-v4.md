# FlashFusion Design Tokens — v4 (Jun 2026)

**Ratified profile.** Replaces v3 (void-dark glass / violet-magenta-cyan / Instrument Serif).
Warm-spectrum, **solid surfaces, no glass**, Orbitron display. Source of truth for
`managing-design-briefs` FlashFusion profile.

> **v3 → v4 change reason (logged):** The v3 glass/violet system was reconciled against the
> real brand assets (the split-hemisphere "fusion" brain + enterprise dashboard renders) and
> ratified by Kyle on 2026-06-16 (decision "B"). The orange-forward spectrum is the brand's
> actual identity palette; glass and Instrument Serif are retired for FlashFusion.

---

## CSS Variables — Full Token Set

```css
:root {
  /* === BRAND SPECTRUM (identity palette) === */
  --ff-orange:  #FF6A00;   /* energy / action — PRIMARY */
  --ff-red:     #FF2D55;   /* passion / ignite */
  --ff-purple:  #A144FF;   /* creativity */
  --ff-indigo:  #5B3DFF;   /* tech / future (logo) */
  --ff-cyan:    #00E5FF;   /* clarity / focus — secondary anchor */
  --ff-blue:    #0077FF;   /* trust / stability */

  /* === SURFACES (solid only — NEVER glass) === */
  --ff-base:    #05060d;   /* page background */
  --ff-nav:     #080910;   /* fixed nav */
  --ff-raised:  #0a0b16;   /* metrics / section bands */
  --ff-card:    #0b0c18;   /* cards */
  --ff-card-hi: #10111f;   /* card hover */

  /* === BORDERS (hairline, opaque) === */
  --ff-border:    #16182a;
  --ff-border-hi: #2e2654;   /* hover / focus-within */

  /* === TEXT RAMP === */
  --ff-text-1: #ffffff;
  --ff-text-2: #9a9db4;
  --ff-text-3: #7a7d94;
  --ff-text-4: #54576e;

  /* === GRADIENTS === */
  --ff-grad-ui:       linear-gradient(135deg,#FF6A00,#FF2D55 55%,#A144FF);          /* primary CTA */
  --ff-grad-spectrum: linear-gradient(90deg,#FF6A00 0%,#FF2D55 28%,#A144FF 62%,#00E5FF 100%); /* hero text + fusion seam (90deg intentional: horizontal L→R fusion) */
  --ff-grad-logo:     linear-gradient(135deg,#5B3DFF,#A144FF,#00E5FF);              /* logo mark */

  /* === GLOW (selective — logo + live dots + hero art ONLY; max 1–2/screen) === */
  --ff-glow-cyan: 0 0 8px #00E5FF;

  /* === TYPE === */
  --ff-font-display: 'Orbitron', sans-serif;          /* headings / display / metrics / logo */
  --ff-font-body:    'Inter', -apple-system, sans-serif;
  /* No mono in v4. Labels/eyebrows use Inter 600 uppercase or Orbitron. */

  /* === RADIUS (squared, not pill) === */
  --ff-r-sm: 5px;  --ff-r-md: 6px;  --ff-r-lg: 8px;
}
```

## Font Load

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## Layout Rules

- Container: full-bleed sections, internal pad `clamp(24px,4vw,60px)`. Hero is a 2-col split (left copy / right art).
- Buttons: squared `--ff-r-md` (6px). **Not pill.** Primary = `--ff-grad-ui`; secondary = solid `--ff-card` + hairline border.
- Nav: **fixed solid bar** with a gradient "fusion seam" bottom border. Not floating pill, not glass.
- Cards: **solid** `--ff-card`, 1px `--ff-border`, `--ff-r-lg`. Never rgba+blur.
- Gradient: `135deg` for UI accents; `90deg` spectrum reserved for hero headline + the fusion seam.
- Glow: earned. Logo, live dots, hero art only.

## Signature Differentiator — The Fusion Seam

A 1px gradient meridian (`--ff-grad-spectrum`, warm→cool) runs under the nav and divides every
major section. It echoes the two-hemisphere fusion brain. Section eyebrows sit flush-left to the
seam — content is read as "two halves joined," never centered-symmetric. This is the one motif a
generic dark-SaaS generator would not produce.

## Cross-Profile Isolation

**NEVER in FlashFusion v4 outputs:**
- `backdrop-filter: blur()` / glass cards (this is the v3 reversal — glass is retired for FF)
- `Instrument Serif`, `Geist`, `Geist Mono` (v3 fonts — retired for FF)
- violet `#8B5CF6` / `#A855F7` as **primary** accent (orange `#FF6A00` is primary; cool tones are secondary only)
- pill buttons (`border-radius:100px`)
- INT tokens: `#0a0a0f`, Space Grotesk, IBM Plex Mono, sidebar nav

**Retired from v3 (do not reintroduce for FF):** void `#000000` glass system, `135deg` violet→magenta→cyan as the identity gradient, Instrument Serif headings, floating-pill nav.
