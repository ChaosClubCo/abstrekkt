# Load-Bearing — Design Contract

> **What this is:** the single source of truth for the Load-Bearing newsletter
> surface. You paste *from* this into Stitch (visual exploration), then hand the
> whole file + `abstrekkt-tokens.css` + your chosen Stitch markup to Antigravity
> for the real build. Stitch does **not** ingest this file — there is no upload
> path. This is your contract, not a tool input.
>
> **Brand:** Abstrekkt (parent) → Load-Bearing (content/media sub-brand).
> **Tagline:** *AI tools, tested under load.* No hype. No sales pitch. Just what holds.
> **Aesthetic:** Reading Room at Midnight. Dark-first. Structural, not decorative.

---

## 0. Pipeline (how this file moves)

```
design.md + abstrekkt-tokens.css  ← source of truth (this repo)
        │
        ▼
   STITCH  ──── visual exploration only. One screen per prompt.
        │       Export winning direction → Figma / copy markup.
        │       (See stitch-prompts.md)
        ▼
   AI STUDIO ── OPTIONAL. Use ONLY as a Gemini API sandbox IF a live AI
        │       feature is added (e.g. "ask the archive" search). Do NOT
        │       run its UI generator — it will regenerate and drift from
        │       Stitch. A newsletter does not need it for v1.
        ▼
   ANTIGRAVITY ─ real build. Agent reads THIS file as the contract,
                 tokens.css as the system, Stitch markup as visual reference.
                 Recommended target: Astro (see §9).
```

---

## 1. Authority hierarchy (conflicts resolve upward)

```
1. RUNTIME CODE COMPATIBILITY   ← absolute
2. DESIGN TOKEN CONSISTENCY     ← single source of truth (tokens.css)
3. UI STATE MACHINE CORRECTNESS ← every interactive element fully specified
4. UX PATTERN CONSISTENCY       ← shared components behave identically everywhere
5. BRAND VOICE CONSISTENCY      ← §7
6. VISUAL AESTHETICS            ← derived, non-authoritative
```

A pretty screen that hardcodes a hex or skips a focus state is **rejected**.

---

## 2. Brand foundation

| Dimension | Value |
|---|---|
| Parent | Abstrekkt |
| Sub-brand | Load-Bearing |
| Promise | AI tools, tested under load — reported, not marketed |
| Voice register | Reading Room: operational thinking-in-public. Sharper, faster than memoir. **Never** memoir register. |
| Accent | Ember `#cf5a32` (`--accent`). Text-accent `#de7449` (`--accent-text`). |
| Ink | Midnight `#101216` (`--bg-base`) — cool undertone, distinct from FlashFusion brown-black |
| Reading ink | Warm paper `#f2efe7` (`--text-primary`) |
| Display | Fraunces |
| Body | Crimson Pro (18px base) |
| Code / tool names | JetBrains Mono |
| Radius | 4px default (structural/beam — tighter than house 6px) |
| Measure | 65ch max prose |

**Lane-bleed guard:** if a line could appear in the memoir, it does not belong
on Load-Bearing. Reading Room is tactical and present-tense; memoir is literary
excavation. Same fonts, different voice.

**Anonymity:** day-job ceiling is "a managed IT firm" — never named. No
credential claims (CCA-F not passed until Jul 20 2026). Tool count: ~30 hands-on,
never "240+".

---

## 3. Tokens

All values live in `abstrekkt-tokens.css`. **Bind to semantic tokens**, never
primitives or raw values. Key bindings:

- Backgrounds: `--bg-base` / `--bg-raised` / `--bg-sunken`
- Text: `--text-primary` / `--text-secondary` / `--text-muted`
- Accent: `--accent` (fills/borders/large text) · `--accent-text` (readable text)
- Lines: `--border` / `--border-strong` · focus: `--focus-ring`
- Type scale: `--text-xs … --text-5xl` · prose leading `--leading-prose` (1.7)
- Space: 4px base (`--space-1 … --space-32`)
- Motion: `--duration-base` (200ms), `--easing-standard`, no bounce

**Contrast rule that matters:** `--accent` (`#cf5a32`) is ~4.46:1 on midnight —
*below* AA for body text. Use `--accent-text` (`#de7449`, ~5.7:1) for any accent
text. Reserve `--accent` for fills, borders, and large display only.

---

## 4. Screen map (5 screens + 1 optional)

| # | Screen | Route | Owns |
|---|---|---|---|
| 1 | Masthead (Home) | `/` | thesis, latest essay, series strip, subscribe bar |
| 2 | Reading View (Essay) | `/essays/[slug]` | THE core reading experience |
| 3 | Index (Archive) | `/archive` | all essays as a typographic ledger |
| 4 | Subscribe | `/subscribe` | conversion, the promise, email capture |
| 5 | The Bench (About) | `/about` | who/why, the diagnostic thesis |
| 6 | Series landing *(optional)* | `/series/foundation` | Foundation Series as a set |

---

## 5. Shared components (state machines required)

These appear across screens and must behave identically. Antigravity builds each
once. Every interactive component declares: **default → hover → active → focus →
disabled** (+ **loading** / **error** where noted).

### Nav (sticky, transparent → solid on scroll)
- States: `top` (transparent over hero) → `scrolled` (solid `--bg-base`, hairline `--border` bottom).
- Left: `Load-Bearing` wordmark, Fraunces 500. Right: `Essays` · `Archive` · `About` · Subscribe (ember outline button).
- Mobile: collapses to a single menu button; full-height sheet, `--bg-base`.
- Focus rings visible on all links (2px `--focus-ring`).

### SubscribeBar (inline capture, used on 1 & 2 & 3)
- One email input + one button. No name field (friction).
- States: `idle` → `submitting` (button shows spinner, input disabled) → `success` (input row replaced by confirmation line, `--accent-text`) → `error` (red `--color-error-500` helper text below, input keeps value).
- Validation: HTML5 email + non-empty. Error copy per §7.
- Never use `<form>` semantics that full-page-reload in the artifact prototype; wire real submit in Antigravity.

### EssayMeta (byline / date / read-time / series tag)
- Mono `--text-xs`, `--text-muted`, `--tracking-kicker` on the series tag.
- Series tag is an ember-outline pill linking to the series.

### Footer
- Three columns: identity line, nav repeat, subscribe repeat.
- Bottom rule: `Abstrekkt · Load-Bearing · {year}` + a single "what holds" line.

---

## 6. Screen specifications

### Screen 1 — Masthead (Home) `/`
**Purpose:** state the thesis, surface the newest essay, prove there's a body of work, capture the email.
**Layout (top → bottom):**
1. Nav (transparent).
2. **Hero.** Full-width, `--bg-base`, generous top space (`--space-24`). Mono kicker `AI TOOLS, TESTED UNDER LOAD` (`--accent-text`, `--tracking-kicker`). Fraunces `--text-5xl` headline, `--tracking-tight`, max ~14 words. One Crimson Pro `--text-lg` line of subhead (`--text-secondary`). Inline SubscribeBar below.
3. **Latest essay feature.** A single wide block (not a card grid): series tag, Fraunces `--text-3xl` title (links to Reading View), 2-line `--text-secondary` excerpt, EssayMeta. Hairline `--border` top + bottom — reads like a beam.
4. **Foundation Series strip.** Section head `Foundation Series · 8 pieces` (Fraunces `--text-2xl`). A vertical typographic list of the 8 essays (number, title, read-time) — NOT cards. Hover: title shifts to `--accent-text`.
5. Footer.
**States:** nav scroll transition; SubscribeBar full machine; list-item hover.
**No:** carousels, hero image stock photography, "Welcome to" copy.

### Screen 2 — Reading View (Essay) `/essays/[slug]`  ← THE SOUL
**Purpose:** the best long-form reading experience you can build. Everything serves the prose.
**Layout:**
1. Nav (solid immediately — no hero here).
2. **Essay header.** Centered to `--measure`. Series tag, Fraunces `--text-4xl` title, `--text-lg` deck (`--text-secondary`), EssayMeta. Hairline rule below.
3. **Body.** Single column, `--measure` (65ch), Crimson Pro `--text-base`, `--leading-prose`. Paragraph spacing `--space-6`. Subheads Fraunces `--text-2xl` with `--space-12` top. **Tool names and code in JetBrains Mono** — inline tool mentions get a subtle `--bg-raised` chip; code blocks get a full `--bg-sunken` block with mono, no neon syntax theme (muted, paper-on-sunken).
4. **Pull treatment.** Block quotes: left border 2px `--accent`, italic Crimson Pro, `--text-secondary`, indented inside measure.
5. **Reading progress.** Thin top bar (2px) fills `--accent` with scroll. `--duration-fast`. Respects reduced-motion.
6. **End block.** Hairline rule, then a compact SubscribeBar with one tactical line ("New tests land weekly. No hype.").
7. Footer.
**States:** progress bar; mono chip hover (none — static); SubscribeBar machine; link focus.
**Accessibility:** body text ≥18px, contrast paper-on-midnight clears AA comfortably; never set body text in `--accent`.
**No:** sidebars competing with prose, autoplaying anything, social-share clutter (one quiet share affordance max, optional).

### Screen 3 — Index (Archive) `/archive`
**Purpose:** the whole body of work as a scannable structural ledger.
**Layout:**
1. Nav (solid).
2. **Header.** Fraunces `--text-3xl` `The Archive`. One `--text-secondary` line. Filter row: `All` · `Foundation Series` · (future tags) as mono `--text-xs` toggle chips (ember-outline when active).
3. **Ledger.** A typographic table/list, NOT cards. Each row: index number (mono, `--text-muted`) · title (Fraunces `--text-xl`, links) · series tag · date + read-time (mono, right-aligned). Rows separated by `--border` hairlines. Hover: row bg → `--bg-raised`, title → `--accent-text`.
4. **Grouping:** Foundation Series rows grouped under a sub-head when filter = series; flat chronological otherwise.
5. SubscribeBar (compact) + Footer.
**States:** filter active/inactive; row hover; (future) empty-state for a filter with no results — copy per §7.

### Screen 4 — Subscribe `/subscribe`
**Purpose:** convert without selling. The promise + cadence + capture.
**Layout:**
1. Nav (solid).
2. **Promise block.** Centered to a narrow measure (~50ch). Fraunces `--text-4xl` headline (the offer, plainly). Crimson Pro `--text-lg` body: what you get, the cadence (weekly), the rule (tested under load, no hype, no affiliate noise). 3 short proof points as a clean list (not icons-and-cards): what a test includes, what gets cut, why it's free.
3. **Capture.** Large SubscribeBar (full machine). Below it, one `--text-muted` `--text-sm` line: "No spam. One email per test. Unsubscribe in one click."
4. Footer.
**States:** SubscribeBar full machine is the centerpiece — get `submitting`/`success`/`error` visibly right.
**No:** fake urgency, "Join 10,000+" if untrue (verify before claiming any count — content-integrity rule), tiered pricing theater.

### Screen 5 — The Bench (About) `/about`
**Purpose:** who's behind it and why it's credible — without inflation.
**Layout:**
1. Nav (solid).
2. **Header.** Fraunces `--text-3xl` `The Bench`. Deck: the one-sentence thesis (the diagnostic instinct — reading rooms, processes, systems).
3. **Body** (`--measure`): the honest version — operator path, why "tested under load" is the standard, what Load-Bearing refuses to do. JetBrains Mono for any tool/stack mention. **No** "Staff Engineer", **no** unearned credential, **no** firm name beyond "a managed IT firm".
4. **Standards block.** A short declarative list: every claim sourced or tagged; pricing/affiliate stance; what "holds" means here.
5. SubscribeBar + Footer.

### Screen 6 (optional) — Foundation Series `/series/foundation`
Same ledger pattern as Archive, scoped to the 8 Foundation essays, with a series intro block on top (Fraunces `--text-3xl` + deck). Build only if you want a shareable series URL.

---

## 7. Brand voice & microcopy

**Pattern:** declarative, present-tense, tactical. No hedging, no "Oops!", no exclamation theater. Specific over warm.

| Context | Use | Never |
|---|---|---|
| Subscribe button idle | `Subscribe` | `Join the journey!` |
| Subscribe submitting | `Subscribing…` | `Hang tight!` |
| Subscribe success | `You're on the list. First test lands soon.` | `Woohoo! Welcome aboard 🎉` |
| Subscribe error | `Subscription failed. Check the address and retry.` | `Oops! Something went wrong.` |
| Empty filter | `No tests under this filter yet.` | `Nothing here :(` |
| Hero subhead | `What holds when the demo's over and the work starts.` | `Discover the power of AI!` |
| End-of-essay CTA | `New tests land weekly. No hype.` | `Don't miss out — subscribe now!` |

---

## 8. Accessibility floor (WCAG 2.1 AA)

- Contrast ≥ 4.5:1 normal text, 3:1 large. **Body text never in `--accent`** (use `--accent-text` or `--text-primary`).
- Focus rings: 2px `--focus-ring`, offset 2px, visible on every interactive element on every background.
- Hit targets ≥ 44×44px on touch.
- Reduced-motion: progress bar + transitions collapse to near-zero (already in tokens.css).
- Headings semantic and ordered (one `<h1>` per screen).
- SubscribeBar input has a real `<label>` (visually-hidden allowed).

---

## 9. Antigravity build instructions

**Recommended target: Astro.** A newsletter/reading site is content-first and
should ship near-zero JS — Astro beats your default React/Vite stack here on
Lighthouse and reading performance. Tradeoff: if Load-Bearing later needs heavy
interactivity (live AI search, dashboards), an island or a React route is added
then, not now.

> If you instead pick **Ghost / Beehiiv** for the platform (WSJF blocker still
> open), this file becomes a **theme spec**: tokens map to the platform's theme
> variables, screens 1/2/3 map to home/post/archive templates, and Subscribe/About
> are platform-native. Same contract, different binding layer.

**Tell the Antigravity agent, verbatim-ish:**
1. Read `design.md` as the contract and `abstrekkt-tokens.css` as the token system. Bind all styles to semantic tokens; zero hardcoded values.
2. Build the 5 shared components in §5 first, with full state machines, before composing screens.
3. Compose screens §6 in order: Reading View (§6.2) is the priority — perfect it first.
4. Use the exported Stitch markup ONLY as visual reference for layout/rhythm, not as final code — it will contain hardcoded values that must be replaced with tokens.
5. Run the anti-slop gate (§10) before declaring any screen done.
6. No secrets in client code. Email capture posts to a server endpoint / platform API via env var, never an inline key.

---

## 10. Anti-slop gate (run before shipping any screen)

- [ ] Zero hardcoded color/spacing/radius/duration — all tokens
- [ ] Every interactive element: full state machine (default→hover→active→focus→disabled, +loading/error where relevant)
- [ ] Body text never set in `--accent` (`#cf5a32` fails AA)
- [ ] Focus rings visible on all backgrounds
- [ ] Contrast ≥ 4.5:1 normal / 3:1 large, verified at render size
- [ ] Motion ≤ 500ms, easing only, no bounce; reduced-motion honored
- [ ] Prose constrained to `--measure` (65ch); body ≥18px
- [ ] Tool names / code in JetBrains Mono, muted (no neon syntax theme)
- [ ] Voice matches §7 (declarative, no "Oops!", no exclamation theater)
- [ ] No memoir-register lane-bleed
- [ ] No firm name, no credential claim, no inflated tool count, no unverified subscriber count
- [ ] One `<h1>` per screen; semantic heading order
- [ ] SubscribeBar input has a real label
- [ ] No TODO/placeholder content in the delivered screen

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS**
- [SOURCED] WCAG 2.1 AA: 4.5:1 normal text, 3:1 large (≥18pt regular / ≥14pt bold). (W3C WCAG 2.1)
- [SOURCED] Stitch is prompt-in / UI-out with image (vision) input and Figma/code export; no spec-file upload path. (Google Labs Stitch, as of my Jan 2026 knowledge)
- [SOURCED] Brass `#c8a86a` is FlashFusion's color; Abstrekkt had only interim emerald `#34d399` and no locked identity — these Abstrekkt tokens are net-new per your "define fresh" choice. (project state + this session)
- [GENERATED] Ember `#de7449` on `#101216` ≈ 5.7:1, and base `#cf5a32` ≈ 4.46:1 — hand-estimated relative-luminance; **verify in a contrast checker before ship** (this is why body-accent text is forbidden).
- [GENERATED] Astro outperforms React/Vite for a content/reading site on shipped-JS and Lighthouse — reasoned from architecture (static-first, partial hydration), not a benchmarked measurement of *your* build.

**COUNTEREXAMPLES**
- A screen can pass every anti-slop check and still feel generic if the *type rhythm* is wrong — the 65ch measure + 1.7 leading + Fraunces/Crimson pairing is what makes it Reading Room, not the tokens alone.
- Dark-first is an identity choice, not an accessibility default — some readers need light. The token swap point is documented; not shipping light in v1 is deliberate, not an oversight.

**! CONTRADICTIONS**
- ! The `designing-abstrekkt-systems` skill asserts brass `#c8a86a` is Abstrekkt's primary. This file **overrides** that per ground truth (brass = FlashFusion). If you later canonize brass for Abstrekkt too, this whole palette is wrong — decide the parent-brand color *before* Antigravity builds, or you rebuild.
- ! Your stated pipeline put AI Studio between Stitch and Antigravity. Both generate UI; chaining them causes drift. This contract routes AI Studio to an optional sandbox role only. If you want it generating, that's a different (worse) plan — say so.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS
- **Antigravity specifics** (agent commands, exact framework support, current preview limits) are at the edge of my Jan-2026 knowledge — verify against current docs before relying on §9 step-by-step. I can search if you want it current.
- **Platform decision is still open** (WSJF blocker ID 10: Beehiiv/Substack/Ghost/custom). This contract assumes custom (Astro). Ghost/Beehiiv changes §9 materially.
- **Real content not wired:** the 8 Foundation essay titles/slugs/excerpts aren't in this file — Antigravity needs the actual essay data or a content collection schema.
- **No subscriber backend chosen** — capture endpoint (platform API vs your own Supabase + double-opt-in) is unspecified; affects SubscribeBar's real submit.
- **Share / SEO / OG-image** treatment unspecified — fine for v1 surface, needed before launch.
- **Light mode + alternate teal accent** are documented swap points, not built; if either is wanted for launch, scope it now.
