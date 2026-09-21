# Load-Bearing — Stitch Generation Prompts

> **Paste one prompt per screen into stitch.withgoogle.com.** Each is
> self-contained because Stitch has **no memory between prompts** — the visual
> system (hexes, fonts, mood) is restated every time on purpose. Do not merge
> prompts. Do not paste `design.md` (Stitch can't ingest files).

## How Stitch behaves (so you don't fight it)
- **One screen at a time.** It generates a single screen's UI, top-to-bottom.
- **It cannot do** routing, real data, auth, JS logic, or multi-page state. Don't ask. Describe the *visual* of each state instead (e.g. "show the success state").
- **It honors** color hexes, font names, layout order, and mood described in plain language.
- **Output** is HTML/CSS. **Export** to Figma (paste) or copy the code.
- **Refine** a screen with short follow-up prompts (pattern at the bottom). Vision mode: paste a reference image to nudge layout.
- **Replace its values later.** Stitch output hardcodes hexes; in Antigravity, swap them for tokens from `abstrekkt-tokens.css`. Stitch is for *look*, not final code.

---

## SHARED STYLE PREAMBLE
*(Stitch restates this inside every prompt below — included here for reference.)*

> Dark mode only. Background midnight `#101216`, raised surfaces `#181b20`,
> deepest `#0a0b0d`. Primary text warm off-white `#f2efe7`. Secondary text
> `#939aa4`, muted `#6b727d`. Accent ember `#cf5a32` for fills/borders/large
> display; lighter ember `#de7449` for any accent-colored text. Hairline borders
> `#22262d`. Display font **Fraunces** (serif, headings), body font **Crimson Pro**
> (serif, 18px prose, line-height 1.7), code/labels in **JetBrains Mono**.
> Corners tight (4px radius). Generous whitespace. Structural and editorial —
> like a literary newspaper read at midnight. No stock photos, no gradients, no
> drop-shadow cards, no emoji. Prose max width ~65 characters.

---

## PROMPT 1 — Masthead (Home)

```
Design a dark-mode homepage for a newsletter called "Load-Bearing." Tagline:
"AI tools, tested under load."

STYLE: Dark only. Background midnight #101216, raised #181b20. Primary text warm
off-white #f2efe7, secondary #939aa4. Accent ember #cf5a32 (fills/borders),
lighter ember #de7449 (accent text). Hairlines #22262d. Headings in Fraunces
(serif), body in Crimson Pro (serif, 18px, line-height 1.7), labels/meta in
JetBrains Mono. 4px corners. Lots of whitespace. Editorial, structural, like a
literary newspaper at midnight. No stock photos, no gradients, no shadow cards,
no emoji.

LAYOUT, top to bottom:
1. Sticky nav, transparent over the hero. Left: "Load-Bearing" wordmark in
   Fraunces. Right: text links "Essays", "Archive", "About", then a "Subscribe"
   button with an ember outline.
2. Hero: small uppercase mono kicker in ember "AI TOOLS, TESTED UNDER LOAD".
   Below it a large Fraunces headline, about 12 words, tight letter-spacing.
   One line of Crimson Pro subhead in secondary grey: "What holds when the
   demo's over and the work starts." Below that, an inline email field with an
   ember "Subscribe" button.
3. Latest essay block: full-width, hairline rule top and bottom (like a beam).
   A small ember mono series tag, a Fraunces title (~28px), a 2-line grey
   excerpt, and a mono meta line "byline · date · 7 min".
4. "Foundation Series · 8 pieces" section heading in Fraunces. Below it a
   vertical numbered list of 8 essay rows — each row: mono number, Fraunces
   title, mono read-time on the right, separated by hairlines. NOT cards.
5. Footer: three columns (identity line, nav links, email field), then a bottom
   rule reading "Abstrekkt · Load-Bearing · 2026".

Desktop web, responsive to mobile (nav collapses to a menu button).
```

---

## PROMPT 2 — Reading View (Essay)  ← the priority screen

```
Design a dark-mode long-form article reading page for "Load-Bearing." This is
the core reading experience — everything serves the prose.

STYLE: Dark only. Background midnight #101216, code blocks on #0a0b0d, inline
code chips on #181b20. Primary text warm off-white #f2efe7, secondary #939aa4.
Accent ember #cf5a32 (borders), lighter ember #de7449 (accent text). Hairlines
#22262d. Title and headings in Fraunces (serif), body in Crimson Pro (serif,
18px, line-height 1.7), all code and tool names in JetBrains Mono. 4px corners.

LAYOUT, top to bottom:
1. A thin 2px reading-progress bar pinned to the very top, filled ember,
   partially across (show it mid-scroll).
2. Solid nav bar (not transparent): "Load-Bearing" wordmark left; "Essays",
   "Archive", "About", ember-outline "Subscribe" right.
3. Article header, centered to a ~65-character measure: small ember mono series
   tag, a large Fraunces title (~48px), a Crimson Pro deck line in secondary
   grey, a mono meta line "byline · date · 9 min". Hairline rule under it.
4. Article body, single centered column ~65 characters wide: Crimson Pro 18px
   paragraphs with comfortable spacing. Include one Fraunces subheading. Show an
   inline tool name as a subtle mono chip on #181b20 (e.g. "n8n"). Include one
   block quote with a 2px ember left border, italic. Include one full-width code
   block on #0a0b0d in muted JetBrains Mono (paper text, NO bright/neon syntax
   colors).
5. End block: hairline rule, then a small email field + ember "Subscribe" button
   with one mono line "New tests land weekly. No hype."
6. Footer like the homepage.

Desktop web, responsive. Keep the column narrow and the reading calm.
```

---

## PROMPT 3 — Index (Archive)

```
Design a dark-mode archive page for the "Load-Bearing" newsletter — the full
body of work as a structural typographic ledger, NOT a card grid.

STYLE: Dark only. Background midnight #101216, row hover #181b20. Primary text
#f2efe7, secondary #939aa4, muted #6b727d. Accent ember #cf5a32, accent text
#de7449. Hairlines #22262d. Headings Fraunces (serif), titles Fraunces, meta and
labels JetBrains Mono, any body in Crimson Pro. 4px corners.

LAYOUT, top to bottom:
1. Solid nav (wordmark left; Essays/Archive/About/Subscribe right).
2. Header: Fraunces heading "The Archive", one grey Crimson Pro line under it.
   A filter row of small mono uppercase toggle chips: "All", "Foundation Series"
   — the active one has an ember outline.
3. The ledger: a list of article rows separated by hairlines. Each row, left to
   right: a mono index number in muted grey, a Fraunces title (~20px), a small
   ember mono series tag, and on the far right a mono "date · read-time". On
   hover the whole row background goes to #181b20 and the title turns ember
   #de7449. Show ~8 rows.
4. A compact email field + ember Subscribe button.
5. Footer like the homepage.

Desktop web, responsive (on mobile the right-aligned meta stacks under the title).
```

---

## PROMPT 4 — Subscribe

```
Design a dark-mode subscribe page for the "Load-Bearing" newsletter. Goal:
convert without selling. No hype, no fake urgency.

STYLE: Dark only. Background midnight #101216, raised #181b20. Text #f2efe7,
secondary #939aa4, muted #6b727d. Accent ember #cf5a32, accent text #de7449.
Hairlines #22262d. Headline in Fraunces (serif), body in Crimson Pro (serif,
18px), fine print in JetBrains Mono. 4px corners. Centered, narrow (~50 characters
wide).

LAYOUT, top to bottom:
1. Solid nav (wordmark left; Essays/Archive/About/Subscribe right).
2. A centered promise block: a large Fraunces headline stating the offer plainly.
   A Crimson Pro paragraph in secondary grey describing what you get and the
   cadence (weekly). Then three short plain text proof points in a simple list
   (no icons, no cards): "What a test includes", "What gets cut", "Why it's free".
3. A large email field with an ember "Subscribe" button, centered. Directly
   below in muted mono: "No spam. One email per test. Unsubscribe in one click."
4. Also show, smaller and to the side, the success state version of the field:
   the input replaced by an ember-text line "You're on the list. First test
   lands soon."
5. Footer like the homepage.

Desktop web, responsive. Calm and confident, not salesy.
```

---

## PROMPT 5 — The Bench (About)

```
Design a dark-mode about page titled "The Bench" for the "Load-Bearing"
newsletter — credibility without hype or inflated claims.

STYLE: Dark only. Background midnight #101216, raised #181b20. Text #f2efe7,
secondary #939aa4. Accent ember #cf5a32, accent text #de7449. Hairlines #22262d.
Headings Fraunces (serif), body Crimson Pro (serif, 18px, line-height 1.7), any
tool/stack names in JetBrains Mono. 4px corners. Prose ~65 characters wide.

LAYOUT, top to bottom:
1. Solid nav (wordmark left; Essays/Archive/About/Subscribe right).
2. Header: Fraunces heading "The Bench", and a one-sentence Crimson Pro deck in
   secondary grey stating the thesis: reading rooms, reading processes, reading
   systems — the same diagnostic instinct.
3. Body: a centered ~65-character column of Crimson Pro prose, a couple of
   Fraunces subheadings, with any tool names shown as subtle mono chips on
   #181b20.
4. A "Standards" block: a short declarative list — every claim sourced or
   labeled, the pricing/affiliate stance, what "holds" means here.
5. A compact email field + ember Subscribe button.
6. Footer like the homepage.

Desktop web, responsive. Plainspoken and structural.
```

---

## REFINEMENT PATTERN (follow-up prompts on a generated screen)
Keep each tweak short and single-purpose. Examples:
- `Tighten the hero — reduce the headline to 9 words and add more space above it.`
- `Make the essay rows feel more like a ledger: thinner hairlines, more space, smaller mono numbers.`
- `The accent is too loud — use ember only on the kicker, the Subscribe button, and hover. Everything else stays grey/paper.`
- `Increase the reading column line-height and narrow it slightly.`
- `Show the error state of the subscribe field: red helper text below, input keeps its value.`

## EXPORT
1. When a screen looks right, **export to Figma** (paste) or **copy the code**.
2. Save each screen's markup into your repo as visual reference (e.g. `/stitch-export/01-masthead.html`).
3. Hand the export + `design.md` + `abstrekkt-tokens.css` to Antigravity. Tell it: the Stitch markup is **layout reference only** — rebuild with semantic tokens, full state machines, and the anti-slop gate (design.md §10).

---

## CLAIMS / GAPS
**CLAIMS**
- [SOURCED] Stitch generates one screen per prompt from natural language, honors stated colors/fonts, has no cross-prompt memory, and exports to Figma/code; vision mode accepts a reference image. (Google Labs Stitch, per Jan 2026 knowledge)
- [GENERATED] Restating the full style block in every prompt materially improves consistency across separately-generated screens — reasoned from the no-memory constraint, not measured.

**GAPS**
- Stitch's current monthly generation caps / Standard-vs-Experimental mode limits change frequently — check the app before a long session. I can search if you want current numbers.
- Stitch may approximate Fraunces/Crimson Pro with substitutes in its preview; the exact fonts are guaranteed only once Antigravity loads them via the Google Fonts link in `abstrekkt-tokens.css`.
