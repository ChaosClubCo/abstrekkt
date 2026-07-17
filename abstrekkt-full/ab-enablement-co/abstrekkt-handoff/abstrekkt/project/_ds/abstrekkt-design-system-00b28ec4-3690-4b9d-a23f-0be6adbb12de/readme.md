# Abstrekkt Design System — "Reading Room at Midnight"

A dark, literary, editorial design system for **Abstrekkt**, a parent studio for AI
enablement work and the software products it produces. The system should feel like a
private library after hours — warm ink backgrounds, brass accents, serif display type.
Restrained and typographic. **Not** a SaaS dashboard: zero neon, zero gradient-tech energy.

## Sources
This system was authored from a **written brand specification only** — no codebase, Figma
file, or prior screens were provided. All tokens below are locked values transcribed from
that spec; they were not reinterpreted. If a codebase or Figma exists, attach it and this
readme should be updated to link it.

## The studio & its lanes
- **Abstrekkt (parent studio)** — the ink-and-brass identity documented here. This is the default surface for all shared work.
- **Load-Bearing** — a sub-brand. Secondary accent is **forest `#1B2B1A`**. Structural AI for systems that must hold.
- **Abstrekkt Products** — the software lane. Interim accent only: **emerald `#34d399`** (do not use emerald anywhere else).
- **FlashFusion** — a **separate system** (`#0B0B14` void / `#A855F7` / `#EC4899` / `#22D3EE`). Never mix its palette into Abstrekkt surfaces.

---

## CONTENT FUNDAMENTALS — how Abstrekkt writes

**Voice.** Quiet, literary, first-person-plural ("we build", "we read everything ourselves").
The studio addresses the reader as a peer, not a lead to convert. Confident understatement
over hype. The governing metaphor is a **library / reading room**: work is "kept," projects
are "chapters," the index is a shelf.

**Tone & register.** Warm, unhurried, considered. Sentences are complete and can be long;
copy is made for long-form attention, not skimming. No exclamation marks, no growth-hacky
imperatives.

**Casing.**
- Display & body: **sentence case** ("A studio for work that bears weight.").
- Meta / kickers / labels / buttons: **UPPERCASE** JetBrains Mono with wide tracking ("FIELD NOTES — 03").
- Never Title Case headlines.

**Emphasis.** A single house device: the emphasized phrase is set in **brass italic** inside
an otherwise plain Fraunces line ("work that *bears weight*"). Never bold, never underline,
never color-fill a whole heading.

**Person.** "We" (the studio) and "you" (the reader/client). Avoid "I".

**Emoji.** None. Not part of the brand.

**Numbers & meta.** Section indices as zero-padded mono ("01", "03"). Dates and versions in
mono. Numbers are used sparingly and only when they carry meaning — no stat-slop, no vanity metrics.

**Specimen copy.** "A studio for work that *bears weight*." · "Things we *kept*." ·
"Tell us what needs to *hold*." · "Reading Room at Midnight." · "Field Notes — 03".

---

## VISUAL FOUNDATIONS

**Overall vibe.** A private library at midnight. Everything is dark-first — there is **no
light-mode default**. Warmth comes from the ink (brown-black, not blue-black) and the single
brass accent. The page should feel printed and lamp-lit, never backlit-screen.

**Color.**
- Base ink is warm near-black: `#0d0c0a` (page), `#080705` (deepest / footer / vignette).
- Surfaces step up in three warm greys: `#1a1a1d` → `#232328` → `#2c2c33`.
- Foreground is **warm bone** `#e8e0cc`, dimming to `#94907e` and `#5e5b50`.
- **Brass** `#C8A86A` is the *only* accent — soft `#d9bd87` (hover/highlight), deep `#8B7548`
  (pressed/low-emphasis), and a 7%-opacity wash `rgba(200,168,106,0.07)` for tints. Use brass
  sparingly; it is punctuation, not fill.
- Borders: `#2e2e35` (hairline), `#3d3d44` (strong); editorial rule `#252520` (warm).

**Type.**
- **Fraunces** (display) at optical size **144**, weights 400–600, with italics. Tight leading
  (~0.96–1.05), letter-spacing **-0.02em**. This is the house voice.
- **Crimson Pro** (body), 400/500, at ~**15px / 1.65** — the reading size.
- **JetBrains Mono** (labels/meta/kickers), **9–10px**, uppercase, letter-spacing **0.22–0.24em**, brass.
- **Inter** is a *system fallback only* — never used for display. *(No Inter font file is bundled;
  its fallback stack renders until one is uploaded — see Caveats.)*

**Spacing & layout.** 4px base scale (4/8/12/16/24/32/48/64/96/128). Generous, editorial
breathing room. Ideal reading measure ~66ch; content container 1200px, narrow column 720px.

**Corner radii.** Small and sharp — this is print, not app-chrome: 2px (sm), 4px (md), 6px (lg).
Pills reserved for rare chip cases. Nothing is heavily rounded.

**Cards.** A raised surface (`#1a1a1d`) with a **1px hairline border** (`#2e2e35`), 6px radius,
and a soft shadow-1. Optional **brass left rail** (2px) for accented cards. On hover (opt-in):
border brightens to `#3d3d44` and the card lifts 2px. No colored glows.

**Borders & rules.** Everything is separated by warm hairlines, not fills. The editorial `Rule`
divider can carry a centered brass mono label like a chapter break.

**Shadows / elevation.** Deep and colorless (black at low alpha), never tinted: shadow-1
`0 1px 2px`, shadow-2 `0 4px 16px`, shadow-3 `0 16px 48px`. Inputs/wells use an *inset* shadow
so they read as pressed into the page.

**Backgrounds & texture.** Two layers, always subtle:
1. A single **brass radial ambient** anchored at the top of the page (~10% peak opacity, fading out by 60%). Exactly one, never repeated.
2. A **paper-grain noise overlay** at ~**35% opacity**, `mix-blend-mode: overlay`, fixed over the page.
Never visible patterns, never full gradients elsewhere, never gradient-tech backgrounds.

**Transparency & blur.** Used only for the sticky header (translucent ink + `blur(12px)`) so
content slides warmly underneath. Not used decoratively.

**Animation.** Slow and considered — **fades and eases over bounces**. Standard ease
`cubic-bezier(0.2,0,0.2,1)`, expressive out `cubic-bezier(0.16,1,0.3,1)`; durations 140/260/420ms.
Motion is a settling-in, not a spring.

**Hover states.** Text/links → shift to brass (or brass-soft). Buttons → primary lightens to
brass-soft; secondary border goes brass; ghost picks up brass-wash. IconButtons fill with
brass-wash. Cards lift + brighten border.

**Press states.** Buttons translate down 1px (a physical press). No scale-shrink, no color flash.

**Imagery.** When photography is used it should read **warm, low-key, grainy** — lamp-lit
interiors, paper, brass, wood. No cool/blue imagery, no bright product shots. (No stock imagery
ships with this system yet.)

---

## ICONOGRAPHY

- **No brand icon set or icon font was supplied.** For UI glyphs, the system uses **inline
  stroke SVGs at ~1.5px stroke weight** in the current text color — thin, quiet, editorial. See
  the `IconButton` card for examples (menu / close drawn inline).
- **Recommended substitute for a fuller set:** [Lucide](https://lucide.dev) (1.5–2px stroke,
  outline style) matches the thin editorial feel. Link from CDN when a broader glyph range is
  needed. *This is a substitution — flag it and replace with a first-party set if one exists.*
- **No emoji.** Not part of the brand.
- **Unicode** is used only for typographic marks (—, ·, ×, ’, &), never as UI icons.
- Icons are always monochrome (foreground or brass); never multicolor, never filled-and-outlined mixed.

---

## LOGO / WORDMARK

**No logo file was supplied.** Per house rule, no mark was invented. The brand name is set as a
**Fraunces wordmark** (`Abstrekkt` + a brass period) wherever a mark would appear — see the
`Brand → Wordmark` card. If a real logo exists, drop it into `assets/` and update this section.

---

## INDEX / MANIFEST

Root:
- `styles.css` — global entry point (consumers link this one file). `@import` lines only.
- `readme.md` — this file.
- `SKILL.md` — Agent-Skills-compatible entry for use in Claude Code.

`tokens/` — CSS custom properties, `@import`ed by `styles.css`:
- `fonts.css` — Google Fonts `@import` for Fraunces / Crimson Pro / JetBrains Mono.
- `colors.css` — ink, surfaces, foreground, brass, borders, sub-brands + semantic aliases.
- `typography.css` — families, display/body/mono scales, roles.
- `spacing.css` — spacing scale, radii, layout widths.
- `effects.css` — shadows, brass ambient, paper-grain (`.abs-grain`), motion easings/durations.

`components/` — reusable React primitives (namespace `AbstrekktDesignSystem_00b28e`):
- `actions/` — **Button**, **IconButton**
- `typography/` — **Display**, **Kicker**
- `surfaces/` — **Card**, **Rule**
- `data-display/` — **Badge**
- `forms/` — **Input**
- `feedback/` — **Callout**

`ui_kits/`:
- `studio/` — the Abstrekkt marketing site (Home / Work / Enquire), interactive. Composes the
  primitives above. `index.html` is the entry + a Starting Point.

`guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.

### Intentional additions
Because no source defined a component inventory, a standard editorial set was authored:
**Button, IconButton, Display, Kicker, Card, Rule, Badge, Input, Callout** — sized to a
literary/marketing surface rather than a dense app. `Display` and `Kicker` are brand-specific
(the Fraunces headline + mono eyebrow) rather than generic primitives.

---

## CAVEATS
- **Inter has no bundled font file** — it's referenced only as the system fallback. Its fallback
  stack renders until a file is uploaded (the sidebar may prompt for this). The three real brand
  fonts load from Google Fonts.
- **No logo, no icon set, no imagery** were supplied — see the Logo and Iconography sections for
  how each absence is handled. Provide real assets to replace the wordmark / Lucide substitution.
- The UI kit content is **plausible sample copy**, not real Abstrekkt work — it demonstrates the
  system, it is not a source recreation.
