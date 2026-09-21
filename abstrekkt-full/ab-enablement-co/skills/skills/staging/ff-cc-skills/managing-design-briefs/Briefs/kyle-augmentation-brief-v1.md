# Design Brief — Personal Augmentation Layer
**Version**: 1.0 | **Owner**: Kyle | **Date**: 2026-03-15
**Target generators**: v0, AI Studio Build, Claude Artifacts

---

## 1. What Is This

```
Product type:     Chrome extension / Claude skill / panel — augmentation layer
Primary user:     Kyle — Staff Platform/AppSec Engineer operating across 3 project
                  lanes (INT, Product, Sales) with 240+ tools and deliberate gaps
                  in UI/UX design, visual vocabulary, and staying current passively
Primary job:      Surface the right decision, pattern, or fix at the right moment
                  without adding workflow overhead
Platform:         All — web panel, Chrome extension, Claude sidebar
Dark mode:        Yes — default and only mode
AI content:       Yes — AI-generated suggestions, analysis, status, confidence signals
```

---

## 2. Experience Thesis

**First 5 seconds:**
> The user sees a dark panel that feels like it was already running before they
> opened it. The emotion is recognition — not "a new tool opened" but "my context
> is already understood." Competence that doesn't announce itself.

**Brand in 3 words:**
```
Augmenter / Auto-healing / Top-1%
```

**What this is NOT:**
> Not another sidebar with a nav tree, card grid, and a "Get Started" banner.
> Not a tool that needs configuration before it helps.
> Not something that asks what you want to do.

**The one design decision that separates this from generic:**
> **The tool speaks first.** Instead of an empty prompt box waiting for input,
> the first visible state is always a contextual observation or ready action —
> "Here's what I see. Here's what's relevant." The UI leads with intelligence,
> not with chrome.

---

## 3. Visual Direction

```
Lighting:     Backlit — light emanates from active elements and data, not from
              a conceptual light source above. Information glows; structure doesn't.
Temperature:  Split warm-cool — cool void surfaces, warm violet accent.
              The background recedes (cool), the signal advances (warm-violet).
Density:      Adaptive — collapsed when idle (minimal footprint), dense when
              active (full context surfaced). Never static.
Material:     Void — not glass (too decorative), not metal (too rigid).
              Void = depth without texture. The tool exists inside the browser,
              not on top of it.
```

**Visual direction in one sentence:**
> "Backlit void, split warm-cool — a cockpit instrument panel where light
> comes from the data itself. Feels like augmented perception: the environment
> gained intelligence, not a window appeared in it."

---

## 4. Color System

### Surface Tokens
```
--surface-base:       #0a0a0f   /* near-black, blue-shifted — not pure black */
--surface-raised:     #111118   /* cards, panels — 1 level up */
--surface-overlay:    #18181f   /* modals, popovers — 2 levels up */
--surface-border:     #2a2a38   /* structural dividers — subtle, not heavy */
--surface-border-dim: #1e1e28   /* secondary borders, section rules */
```

### Accent — Electric Violet
```
--accent:             hsl(262 83% 68%)   /* ≈ #9d6aff */
--accent-dim:         hsl(262 83% 68% / 0.15)  /* glow backgrounds, hover */
--accent-text:        hsl(262 83% 78%)   /* accent text on dark — lighter for contrast */
```

**Why this violet specifically:**
> Standard Tailwind violet (#8b5cf6) is overused — it reads as "Notion, Linear,
> generic SaaS." This hue (262°) is slightly warmer and more saturated, reading
> as transmission and intelligence rather than brand compliance. On #0a0a0f it
> glows instead of sitting flat.

**Accent usage rule:**
> Active states, primary CTA, confidence indicators, one structural accent line
> per section. Max 10% of visible surface. Never decorative — only signal.

### Text Hierarchy
```
--text-primary:   #f0f0f5   /* warm-shifted near-white — not harsh #ffffff */
--text-secondary: #9898a8   /* supporting labels, descriptions */
--text-tertiary:  #52525e   /* metadata, timestamps, disabled */
--text-accent:    hsl(262 83% 78%)  /* accent-colored text — links, highlights */
```

### Feedback Colors (desaturated for void palette)
```
--feedback-success:  #4ade80   /* green at 80% opacity on dark surfaces */
--feedback-warning:  #fbbf24   /* amber — reduced saturation */
--feedback-error:    #f87171   /* red — muted, not alarming */
--feedback-info:     #60a5fa   /* blue — neutral information */
```
> Standard semantic colors but desaturated. Neon green on void = noise.
> These should feel like instrument readings, not traffic lights.

---

## 5. Typography

```
Heading font:   Space Grotesk — geometric, engineered, high-impact without
                being loud. Reads as "built with precision" not "brand agency."
                Separates from the Inter monoculture without going brutalist.

Body font:      Inter — maximum legibility at small sizes, zero friction.
                IBM Plex Mono for any code, terminal output, or data strings.

Scale:          Tight — this lives in a panel, not a viewport.
                xs: 11px / sm: 13px / base: 14px / md: 16px / lg: 20px / xl: 24px

Weights:        400 (body), 500 (emphasis), 700 (headings + CTAs) — nothing else.
Line height:    1.4 for UI labels, 1.6 for readable body copy.
```

**Why Space Grotesk + Inter:**
> Space Grotesk headings signal "engineered by someone with taste."
> Inter body ensures zero cognitive load on dense information.
> Together they cover "in the top 1%" without demanding attention.

---

## 6. Layout

```
Navigation model:   Flat — everything one level deep.
                    No drilling, no back buttons, no hierarchy to navigate.
                    Command palette (⌘K) as primary navigation mechanism.

Primary layout:     Split-pane adaptive.
                    Idle state: narrow panel (~320px), context header + signal list.
                    Active state: expanded pane (~480px), full context + actions.

Max content width:  480px active / 320px idle (panel context)
Sidebar:            NONE — this IS the sidebar. No sidebar within a sidebar.

Navigation pattern: Top micro-nav (3–4 icon tabs max) + command palette.
                    No text nav labels at top level — icons + tooltips only.
                    Active section = accent underline on icon, not filled badge.
```

---

## 7. Anti-Slop Gates — All Clear

```
[X] No left sidebar — this is a panel; sidebar within panel = absurd
[X] No card grid — information list with adaptive density, not cards
[X] No "clean and modern" — brief uses specific visual language throughout
[X] No Inter + gray — Space Grotesk heading + custom violet accent defined
[X] Accent color defined with specific HSL value and usage rule
[X] What this is NOT is explicitly stated in section 2
[X] One specific design decision named: tool speaks first, not empty prompt box
[X] Brand words constrain: "Augmenter" → adaptive density + speaks first
                            "Auto-healing" → always has a state, never blank
                            "Top 1%" → Space Grotesk + void + precise color system
```

---

## 8. Component Notes

### The "Always Has A State" Rule
> "Auto-healing" as a brand word means nothing is ever blank or waiting.
> Every panel state must have content:
> - Idle: last relevant observation or ready action
> - Loading: skeleton with meaningful shape (not generic spinner)
> - Error: specific message + specific recovery action
> - Empty: never "No data" — always "Here's what would appear here and why"

### AI Content States (required — tool surfaces AI output)
```
Idle:       Contextual observation visible — no prompt box leading
Processing: Inline progress indicator, estimated time if > 3s
Streaming:  Text streams in — cursor visible, partial output readable
Complete:   Result + confidence signal + action affordances
Failed:     Specific failure reason + retry or alternative path
```

### Confidence Indicator Pattern
> Single horizontal bar or dot cluster — not percentage numbers.
> High confidence = accent violet at full opacity.
> Low confidence = accent violet at 30% + secondary text label.
> Unknown = tertiary text only, no bar.

---

## 9. Generator Prompt — Paste This Into v0 or AI Studio

```
Build a Chrome extension side panel / Claude skill UI for a Staff Platform
Engineer whose primary job is: surface the right decision, pattern, or fix at
the right moment without adding workflow overhead.

EXPERIENCE THESIS:
The panel feels like it was already running before it opened. First emotion:
recognition, not onboarding. The tool speaks first — the first visible state
is always a contextual observation or ready action, never an empty prompt box.

VISUAL DIRECTION:
- Mood: Backlit void, split warm-cool. Light comes from the data, not the chrome.
  Feels like augmented perception — the environment gained intelligence.
- Surface: #0a0a0f base, #111118 raised panels, #18181f overlays
- Accent: hsl(262 83% 68%) — electric violet. Active states, primary CTA,
  confidence signals only. Max 10% visible surface.
- Text: #f0f0f5 primary / #9898a8 secondary / #52525e tertiary
- Type: Space Grotesk headings (700), Inter body (400/500),
  IBM Plex Mono for code/data. Tight scale — 11/13/14/16/20px.
- Layout: Flat navigation, split-pane adaptive (320px idle / 480px active),
  command palette (⌘K) as primary nav, 3–4 icon tabs max at top.

HARD RULES — do not break:
- No left sidebar inside the panel
- No card grid layout
- No glassmorphism or decorative gradients
- No empty states — every state has content
- No generic spinner — skeleton loaders with meaningful shapes
- Accent on max 10% of visible surface
- Space Grotesk + Inter only — no system fonts, no fallback to Inter for headings
- Touch targets minimum 44px even in dense layout

THE ONE THING THAT MAKES THIS NOT GENERIC:
The panel leads with intelligence. The default view is a contextual observation
already populated — not a "What would you like to do?" prompt. The UI behaves
like it has been paying attention.

AI CONTENT STATES — required on every screen that shows AI output:
idle → processing (inline indicator) → streaming (cursor + partial text)
→ complete (result + confidence bar) → failed (specific error + recovery CTA)

BUILD — First screen:
The idle/ready state of the panel. Show:
- Top micro-nav: 4 icon tabs (Context / Actions / History / Settings)
  Active tab = accent violet underline. No filled backgrounds.
- Primary content area: 2–3 contextual observations in an information list.
  Each item: signal icon (accent violet) + one-line observation +
  secondary metadata (source, time) + single action affordance on hover.
- Bottom persistent bar: command palette trigger (⌘K) + current context label
  (e.g., "claude.ai · Project: INT") + connection status dot.
- Panel width: 320px. Background: #0a0a0f.
- No onboarding copy. No "Get started." No hero. Data first.
```

---

## 10. Variant Briefs

### Kinsley Apps — Pre-filled
*(See original template Section 9 — unchanged)*

### INT Internal Tool — Pre-filled
*(See original template Section 10 — unchanged)*

### Product Forge UI (FlashFusion / new ventures)
```
Brand words:      Ambitious / Systematic / Builder
Surface:          Deep dark (#0f1117)
Accent:           Electric violet (same as augmentation layer — brand continuity)
Material:         Void with warm edge — slightly warmer than pure ops tool
Typography:       Space Grotesk headings / Inter body (same system)
Navigation:       Hub-and-spoke (central dashboard, drill to features)
Density:          Balanced — not as dense as ops, not as sparse as Kinsley
Anti-slop note:   FlashFusion is a builder tool. Make it feel like a workshop,
                  not a SaaS marketing site. Data and actions are the UI.
```

---

*Brief v1.0 — locked. Do not modify accent or typography without updating all
three variant briefs for consistency. Space Grotesk + electric violet is the
cross-lane design thread.*
