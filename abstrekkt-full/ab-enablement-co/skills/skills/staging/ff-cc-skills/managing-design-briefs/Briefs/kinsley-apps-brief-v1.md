# Design Brief — Kinsley Apps
**Version**: 1.0 | **Owner**: Kyle | **Date**: 2026-03-17
**Target generators**: v0, AI Studio Build, Claude Artifacts

---

## 1. What Is This

```
Product type:     Mobile-first web app — educational storytelling platform
Primary user:     Parents and young children (ages 3–8) creating together;
                  secondary user: solo child exploring with voice
Primary job:      Turn a child's spoken words into an illustrated storybook
                  they can keep, share, and revisit — making creation feel
                  like magic, not like using software
Platform:         Mobile web (iOS Safari / Android Chrome primary),
                  responsive desktop secondary
Dark mode:        No — light/warm only. Children's apps in dark mode
                  read as "not for me."
AI content:       Yes — AI-generated illustrations, text refinement,
                  voice-to-text transcription, story suggestions
```

---

## 2. Experience Thesis

**First 5 seconds:**
> The child sees a warm, inviting space that feels like opening a favorite
> picture book. The emotion is wonder — not "an app loaded" but "a story is
> about to happen." No sign-up wall, no tutorial. A big friendly prompt
> says "Tell me a story" with a glowing microphone button.

**Brand in 3 words:**
```
Magical / Gentle / Yours
```

**What this is NOT:**
> Not an edtech dashboard with progress bars, learning metrics, and
> gamification badges. Not a drawing app with tool palettes and layer panels.
> Not a social platform with feeds, likes, and sharing pressure.
> Not software that talks down to children or over-explains to parents.

**The one design decision that separates this from generic:**
> **The interface disappears during creation.** When a child is speaking their
> story, the UI fades to just the microphone pulse and a soft background color.
> No buttons, no navigation, no distractions. The technology becomes invisible
> so the child's imagination fills the space. Controls return gently when the
> child pauses.

---

## 3. Visual Direction

```
Lighting:     Ambient warmth — light comes from everywhere gently, like a
              well-lit reading nook. No harsh directional light, no shadows
              that create depth anxiety. Everything feels softly illuminated.
Temperature:  Warm throughout — cream, soft gold, gentle peach. Cool tones
              only as subtle accents in illustrations, never in the UI chrome.
Density:      Sparse — maximum breathing room. One action per screen.
              Children need space to focus. Parents need clarity at a glance.
Material:     Paper — not literal skeuomorphic paper texture, but the warmth
              and familiarity of a physical book. Rounded corners, soft edges,
              tactile feeling. The app feels like something you could hold.
```

**Visual direction in one sentence:**
> "Ambient warm paper — a reading nook where light comes from everywhere
> gently and the interface feels like opening a favorite picture book.
> Technology is invisible; imagination fills the space."

---

## 4. Color System

### Surface Tokens
```
--surface-base:       #faf7f2   /* warm cream — not white, not yellow */
--surface-raised:     #ffffff   /* cards, story pages — clean white for contrast */
--surface-overlay:    #f5f0e8   /* modals, bottom sheets — slightly warmer */
--surface-border:     #e8e0d4   /* structural dividers — warm, barely there */
--surface-border-dim: #f0ebe3   /* secondary borders — almost invisible */
```

### Accent — Soft Coral
```
--accent:             hsl(12 76% 62%)    /* ≈ #e07050 — warm coral */
--accent-dim:         hsl(12 76% 62% / 0.12)  /* hover backgrounds, glow */
--accent-text:        hsl(12 76% 48%)    /* accent text on light — darker for contrast */
--accent-secondary:   hsl(42 78% 60%)    /* ≈ #dba940 — golden amber for secondary CTAs */
```

**Why this coral specifically:**
> Standard red/orange reads as "error" or "alert" to adults. This coral
> (12° hue) is warm enough to feel inviting and playful without triggering
> alarm associations. On cream surfaces it glows with life. The golden amber
> secondary provides warmth without competing — used for stars, achievements,
> and secondary actions.

**Accent usage rule:**
> Primary CTA (microphone button, "Create" actions), active states,
> illustration frame highlights. Max 15% of visible surface — more generous
> than the INT/Product 10% rule because warmth and color are part of the
> experience thesis. Never used for errors — errors use a muted rose instead.

### Text Hierarchy
```
--text-primary:   #2d2a26   /* warm near-black — not harsh #000000 */
--text-secondary: #6b6560   /* supporting labels, descriptions */
--text-tertiary:  #a39e97   /* metadata, timestamps, parent-facing info */
--text-accent:    hsl(12 76% 48%)  /* accent-colored text — links, highlights */
```

### Feedback Colors (warm-shifted for paper palette)
```
--feedback-success:  #5cb85c   /* green — slightly muted, friendly */
--feedback-warning:  #e8a838   /* warm amber — matches accent-secondary */
--feedback-error:    #c97070   /* muted rose — not alarming red */
--feedback-info:     #6ba3c7   /* soft blue — only cool tone in the palette */
```
> Feedback colors are muted and warm-shifted. No neon, no high-saturation
> alerts. A child seeing an error should feel "oops, let's try again"
> not "something broke."

---

## 5. Typography

```
Heading font:   Nunito — rounded, friendly, high readability for both
                children and parents. The rounded terminals feel warm
                and approachable without being childish or condescending.

Body font:      Nunito — same family for cohesion. The roundness that
                makes headings friendly also makes body text comfortable
                at reading sizes. Simpler system = fewer loading issues.
                Open Sans as fallback only.

Scale:          Generous — children need larger text, parents need comfort.
                xs: 14px / sm: 16px / base: 18px / md: 22px / lg: 28px / xl: 36px
                (Note: base is 18px, not 14px. Readability > density.)

Weights:        400 (body), 600 (emphasis/labels), 700 (headings + CTAs).
Line height:    1.5 for UI labels, 1.8 for story text (generous for reading).
```

**Why Nunito:**
> Nunito's rounded geometry reads as "friendly and trustworthy" to both
> children and adults. It avoids the trap of "kiddie fonts" (Comic Sans,
> Bubblegum) that make parents feel patronized while maintaining warmth
> that pure geometric fonts (Inter, SF Pro) lack. A single font family
> also means faster loading on mobile — critical for the target audience.

---

## 6. Layout

```
Navigation model:   Linear flow — story creation is a journey, not a hub.
                    Home → Create (voice → text → illustrate → review) → Library.
                    Back button always visible. No dead ends.
                    Bottom tab bar for top-level nav (3 tabs max).

Primary layout:     Single-column, centered content.
                    One primary action per screen. No split panes.
                    Story pages display as a vertical scroll of illustrated pages.

Max content width:  480px (mobile) / 640px (tablet/desktop — centered in viewport)
Sidebar:            NONE — children don't use sidebars. Everything is
                    full-screen, sequential, one-thing-at-a-time.

Navigation pattern: Bottom tab bar (3 tabs: Create / Library / Settings).
                    Large touch targets — minimum 64px for primary actions,
                    48px for secondary. Microphone button: 80px minimum.
                    Parent-facing settings behind a subtle gear icon —
                    not in the child's primary flow.
```

---

## 7. Anti-Slop Gates — All Clear

```
[X] No left sidebar — single-column linear flow for children
[X] No card grid — story library uses a vertical book-spine list, not cards
[X] No "clean and modern" — brief uses specific visual language throughout
[X] No Inter + gray — Nunito throughout + warm cream/coral palette defined
[X] Accent color defined with specific HSL value and usage rule
[X] What this is NOT is explicitly stated in section 2
[X] One specific design decision named: interface disappears during creation
[X] Brand words constrain: "Magical" → interface disappears, creation feels
                            effortless; "Gentle" → muted feedback, warm colors,
                            no harsh alerts; "Yours" → stories are the child's,
                            not the app's — no watermarks, no platform branding
                            on story pages
```

---

## 8. Component Notes

### The "Creation Is Sacred" Rule
> When a child is actively creating (speaking, reviewing illustrations),
> the UI minimizes to essential controls only. Navigation, settings, and
> secondary actions hide. The child's content is the entire screen.
> Controls return with a gentle fade when the child pauses or taps.

### AI Content States (required — app uses AI for illustration + transcription)
```
Idle:       "Tell me a story" prompt with glowing mic button — inviting, not empty
Processing: Illustration generating — animated sparkle effect on the page area,
            NOT a progress bar. "Drawing your story..." in friendly text.
Streaming:  Text appears word-by-word as transcription happens — feels magical.
            Illustration appears section-by-section, not all at once.
Complete:   Story page fully rendered — illustration + text. "Wow!" micro-animation.
            Gentle prompt to continue or finish.
Failed:     "Hmm, let's try that again!" — friendly face illustration.
            Single retry button. No error codes, no technical language.
```

### Touch Target Standards
```
Primary CTA (mic button):    80px minimum — thumb-friendly for small hands
Secondary actions:            64px minimum
Tertiary / parent-facing:    48px minimum
Spacing between targets:     16px minimum — prevent mis-taps
```

---

## 9. Generator Prompt — Paste This Into v0 or AI Studio

```
Build a mobile-first web app for children ages 3–8 and their parents.
The app turns a child's spoken story into an illustrated storybook.

EXPERIENCE THESIS:
The app feels like opening a favorite picture book. First emotion: wonder,
not onboarding. The interface disappears during creation — when a child
speaks, the UI fades to just the microphone pulse and a soft background.
Technology is invisible; imagination fills the space.

VISUAL DIRECTION:
- Mood: Ambient warm paper — a reading nook where light comes from
  everywhere gently. Feels like something you could hold.
- Surface: #faf7f2 cream base, #ffffff story pages, #f5f0e8 overlays
- Accent: hsl(12 76% 62%) — soft coral. Primary CTA, active states,
  story highlights. Max 15% visible surface.
- Secondary accent: hsl(42 78% 60%) — golden amber for stars, achievements.
- Text: #2d2a26 primary / #6b6560 secondary / #a39e97 tertiary
- Type: Nunito throughout — 400 body, 600 emphasis, 700 headings.
  Generous scale: 14/16/18/22/28/36px. Base is 18px.
- Layout: Single-column centered, 480px mobile / 640px desktop.
  Bottom tab bar (3 tabs: Create / Library / Settings).
  Linear flow: Home → Create → Library. No split panes.

HARD RULES — do not break:
- No left sidebar
- No card grid — story library is a vertical book-spine list
- No dark mode — warm cream only
- No gamification badges or progress bars
- No "kiddie" aesthetic (no Comic Sans, no rainbow gradients)
- No empty states — every screen has warmth and invitation
- Touch targets: 80px primary / 64px secondary / 48px tertiary
- Nunito only — no system fonts, no Inter
- Errors say "Let's try again!" not technical messages

THE ONE THING THAT MAKES THIS NOT GENERIC:
The interface disappears during creation. When the child speaks, only the
microphone pulse and soft background remain. No buttons, no nav, no chrome.
The technology becomes invisible.

AI CONTENT STATES — required on every screen that shows AI output:
idle ("Tell me a story" + glowing mic) → processing (sparkle animation +
"Drawing your story...") → streaming (words appear one by one, illustration
builds section by section) → complete (page rendered + "Wow!" micro-animation)
→ failed ("Hmm, let's try that again!" + friendly face + retry button)

BUILD — First screen:
The home / creation start screen. Show:
- Warm cream background (#faf7f2), centered layout
- Large "Tell me a story" heading (Nunito 700, 28px, #2d2a26)
- Glowing microphone button (80px, coral accent, subtle pulse animation)
- Below: 2 recent stories as book-spine previews (illustration thumbnail +
  title, vertical stack, not a grid)
- Bottom tab bar: Create (active, coral underline) / Library / Settings
  Icons only, 64px touch targets, warm gray inactive.
- No onboarding. No sign-up. No tutorial. Warmth first.
```

---

## 10. Cross-Lane Isolation Check

```
[X] No electric violet (hsl 262) anywhere — that's INT/Product
[X] No void surface (#0a0a0f) — that's INT/Product
[X] No Space Grotesk — that's INT/Product
[X] No IBM Plex Mono — not needed, no code display
[X] No "dense" density — Kinsley is deliberately sparse
[X] No command palette — children don't use ⌘K
[X] Nunito does not appear in any INT/Product brief
[X] Coral accent does not appear in any INT/Product brief
```

---

*Brief v1.0 — locked. Kinsley lane tokens are completely separate from
INT/Product. Never bleed warm cream into void. Never bleed violet into coral.
If both lanes are active in the same session, confirm lane before every output.*
