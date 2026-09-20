# Kyle Rosebrook — "Reading Room at Midnight" Design System Prompt

Use this prompt when generating any HTML artifact, page, or component for kylerosebrook.com, memoir work, or personal brand content.

---

## The Aesthetic

**Name:** Reading Room at Midnight **Mood:** Dark editorial. A brass desk lamp in a room full of books at 1:30am. Warm without being cozy. Serious without being sterile. The visual equivalent of whiskey neat on a walnut surface.

**What it is NOT:** SaaS dashboard. Neon tech startup. Glassmorphism. Gradient soup. Anything that could ship as a Stripe template unchanged. Anything "clean and modern" in the generic sense.

---

## Two Variants (Same DNA)

### Variant A — Editorial / Prose Pages

Use for: essays, manifesto, about page, memoir content, blog posts, landing pages, long-form reading experiences.

**Fonts:**

Fraunces (variable, opsz 9-144, wght 300-900, SOFT 0-100, WONK 0-1) — headings, display

Crimson Pro (300-600, italic) — body text, prose

JetBrains Mono (300, 400) — metadata, labels, code, eyebrows

```css
:root {
  --ink: #0a0907;
  --ink-deep: #050403;
  --paper: #f2efe9;
  --paper-dim: #a09888;
  --paper-faint: #6b6557;
  --brass: #c4935a;
  --brass-deep: #7a5a35;
  --brass-faint: rgba(196, 147, 90, 0.2);
  --oxblood: #7a3838;           /* optional accent for warnings, tension */
  --rule: rgba(255, 255, 255, 0.06);
  --rule-bright: rgba(196, 147, 90, 0.25);
  --measure: 38rem;             /* max prose width */
}
```

**Body:** `font-family: 'Crimson Pro', Georgia, serif; font-weight: 380; font-size: 18-19px; line-height: 1.65-1.75;`

**Background treatment:** Dark ink background with fixed pseudo-element overlays:

- `body::before` — subtle brass-tinted radial gradients (opacity 0.03-0.05) for atmospheric warmth  
- `body::after` — fractal noise SVG texture at 30-35% opacity for paper grain

**Headings:** Fraunces, variable optical size. Section titles 26-32px, weight 700. Chapter numbers or eyebrows in JetBrains Mono, 10px, letter-spacing 0.15-0.18em, uppercase, brass color.

**Horizontal rules:** 1px solid var(--rule) or var(--rule-bright) for emphasis. Generous vertical spacing (60-80px between major sections).

**Links/accents:** Brass with underline-offset. No bright blues. Hover → brass-deep or brass-faint background.

**Pull quotes / epigraphs:** Fraunces italic, larger size (22-26px), brass-tinted left border or brass em-dash prefix. Generous margin.

**Google Fonts import:**

<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Crimson+Pro:ital,wght@0,300..600;1,300..600&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />

---

### Variant B — Dashboard / Tool Pages

Use for: command centers, kanban boards, evidence boards, audit tools, data-heavy interfaces, interactive reference pages.

**Fonts:**

Playfair Display (600, 700) — headings, panel titles

IBM Plex Sans (300, 400, 500, 600) — body, UI labels, descriptions

IBM Plex Mono (400, 500) — metadata, tags, code, eyebrows, data values

```css
:root {
  --bg: #0c0c0b;
  --surface: #111110;
  --card: #181815;
  --border: #232320;
  --border-hi: #303030;
  --accent: #d4893a;
  --accent-hi: #e8a050;
  --text: #ddd8ce;
  --text-2: #807c74;
  --text-3: #3a3835;
  --mono: #7ab878;            /* green for positive / code */
  --mono-2: #78afc8;          /* blue for info / links */
  --red: #c05050;             /* negative / bad examples */
  --green: #5a9c5a;           /* positive / good examples */
  --tag: #1e1e1a;             /* tag/chip background */
}
```

**Body:** `font-family: 'IBM Plex Sans', sans-serif; font-size: 13.5px; line-height: 1.65;`

**Cards:** `background: var(--card); border: 1px solid var(--border); border-radius: 3px; padding: 18px 22px;` — tight radius, no rounded-2xl softness.

**Eyebrow labels:** `font-family: 'IBM Plex Mono'; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent);`

**Tabs:** Bottom-border active indicator in accent-hi. No pill tabs. No background fills. Text-2 inactive → accent-hi active.

**Tags/chips:** `background: var(--tag); border: 1px solid var(--border-hi); border-radius: 2px; font-family: 'IBM Plex Mono'; font-size: 9.5px; color: var(--text-2);`

**Tables:** Collapse borders. Left-aligned. Mono headers at 9.5px uppercase. Thin bottom borders only (var(--border)).

**Scrollbars:** `width: 5px; thumb: var(--border-hi); track: var(--bg);`

**Google Fonts import:**

<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />

---

## Shared Principles (Both Variants)

### Layout

- Dark background, always. No light mode.  
- Max prose width capped (36-38rem for editorial, 960px for dashboards).  
- Generous whitespace. Let things breathe. Padding 30-40px on main containers.  
- No hero images, no gradients-as-decoration, no floating shapes.

### Typography Hierarchy

1. **Eyebrow** — Mono, 10px, uppercase, brass, letter-spaced (0.15-0.18em)  
2. **Title** — Serif (Fraunces or Playfair), 22-32px, weight 600-700  
3. **Subtitle/desc** — Body font, dimmed color (paper-dim or text-2), 12.5-14px  
4. **Body** — Primary serif or sans, standard weight  
5. **Metadata** — Mono, 10-11px, dimmed

### Color Rules

- **Brass is the only accent.** It's not orange, not gold, not amber. It's brass — warm, metallic, earned. `#c4935a` is the canonical value.  
- **Text is warm off-white**, never pure white. `#f2efe9` (editorial) or `#ddd8ce` (dashboard).  
- **Dimmed text** steps through warm grays: paper-dim → paper-faint → text-3.  
- **Green and blue** (mono, mono-2) are reserved for code highlights and status indicators in dashboards only.  
- **Red** is reserved for errors, bad examples, or tension markers. Never decorative.

### Texture & Atmosphere

- Subtle fractal noise overlay (SVG filter, 30-35% opacity) gives paper grain — editorial variant only.  
- Soft brass-tinted radial gradients as fixed background — never moving, never bright. Atmosphere, not decoration.  
- No box shadows. Border-based depth only (1px solid var(--border) → var(--border-hi) on hover/focus).  
- No blur/frosted glass. No backdrop-filter.

### Interactions

- Transitions: 0.15s on color, border-color, opacity. Nothing longer. No spring/bounce.  
- Hover states: subtle color shifts (text-2 → text, border → border-hi, brass → accent-hi). Never transform: scale.  
- Active states: brass underline or brass border-bottom for tabs/nav. No background fills.  
- Focus: brass outline or border. Accessible but on-brand.

### Anti-Patterns (Never Do These)

- Rounded corners larger than 4px  
- Gradient backgrounds or gradient text  
- Drop shadows or box-shadow elevation  
- Pure white (#fff) or pure black (#000) anywhere  
- Sans-serif body text in editorial pages  
- Serif body text in dashboard pages  
- Bright saturated colors (electric blue, hot pink, lime green)  
- Card hover animations that lift/scale  
- Decorative icons or illustrations  
- Stock photography  
- Loading spinners (use skeleton states if needed)  
- Toast notifications (use inline status)

---

## Quick-Start Template (Editorial)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>[PAGE TITLE] — Kyle Rosebrook</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Crimson+Pro:ital,wght@0,300..600;1,300..600&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />
<style>
  :root {
    --ink: #0a0907;
    --ink-deep: #050403;
    --paper: #f2efe9;
    --paper-dim: #a09888;
    --paper-faint: #6b6557;
    --brass: #c4935a;
    --brass-deep: #7a5a35;
    --brass-faint: rgba(196, 147, 90, 0.2);
    --rule: rgba(255, 255, 255, 0.06);
    --rule-bright: rgba(196, 147, 90, 0.25);
    --measure: 38rem;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--ink);
    color: var(--paper);
    font-family: 'Crimson Pro', Georgia, serif;
    font-weight: 380;
    font-size: 19px;
    line-height: 1.7;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  /* Atmosphere */
  body::before {
    content: '';
    position: fixed; inset: 0;
    pointer-events: none; z-index: 1;
    background:
      radial-gradient(ellipse at 15% 10%, rgba(196,147,90,0.05) 0%, transparent 45%),
      radial-gradient(ellipse at 85% 90%, rgba(196,147,90,0.03) 0%, transparent 50%);
  }
  .container { max-width: var(--measure); margin: 0 auto; padding: 80px 24px; position: relative; z-index: 3; }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--brass);
    margin-bottom: 12px;
  }
  h1 {
    font-family: 'Fraunces', serif;
    font-size: 32px; font-weight: 700;
    line-height: 1.2; margin-bottom: 16px;
  }
  .subtitle {
    color: var(--paper-dim);
    font-size: 16px; font-style: italic;
    margin-bottom: 48px;
  }
  p { margin-bottom: 1.4em; }
  hr {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 48px 0;
  }
</style>
</head>
<body>
  <div class="container">
    <p class="eyebrow">SECTION LABEL</p>
    <h1>Page Title</h1>
    <p class="subtitle">A subtitle or one-line description.</p>
    <p>Body text goes here.</p>
  </div>
</body>
</html>
```

---

## Quick-Start Template (Dashboard)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>[TOOL NAME] — Kyle Rosebrook</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --bg: #0c0c0b; --surface: #111110; --card: #181815;
    --border: #232320; --border-hi: #303030;
    --accent: #d4893a; --accent-hi: #e8a050;
    --text: #ddd8ce; --text-2: #807c74; --text-3: #3a3835;
    --mono: #7ab878; --mono-2: #78afc8;
    --red: #c05050; --green: #5a9c5a;
    --tag: #1e1e1a;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg); color: var(--text);
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13.5px; line-height: 1.65;
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 3px; }
  header {
    padding: 28px 40px 22px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start;
    justify-content: space-between;
  }
  .eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; color: var(--accent);
    letter-spacing: 0.18em; text-transform: uppercase;
    margin-bottom: 6px;
  }
  header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700;
  }
  main { padding: 30px 40px; max-width: 960px; }
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 18px 22px;
    margin-bottom: 12px;
  }
  .tag {
    background: var(--tag);
    border: 1px solid var(--border-hi);
    border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9.5px; color: var(--text-2);
    padding: 2px 7px; letter-spacing: 0.04em;
    display: inline-block;
  }
</style>
</head>
<body>
  <header>
    <div>
      <span class="eyebrow">TOOL NAME</span>
      <h1>Dashboard Title</h1>
    </div>
  </header>
  <main>
    <div class="card">
      <p>Content here.</p>
    </div>
  </main>
</body>
</html>
```

---

*This prompt is the source of truth for Kyle Rosebrook's visual identity across all generated HTML/CSS artifacts. When in doubt: darker, warmer, tighter, quieter.*
