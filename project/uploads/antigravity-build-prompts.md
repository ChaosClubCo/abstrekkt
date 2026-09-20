# Load-Bearing — Antigravity Build Prompts

> **Paste these in order into Antigravity (or any agentic IDE — Cursor, Windsurf).**
> They are natural-language *agent tasks*, not code. Let each prompt finish and
> **validate in the browser before pasting the next** — agentic IDEs will happily
> build on a broken foundation if you let them.
>
> **Inputs the agent needs in the repo first:** `design.md` and
> `abstrekkt-tokens.css` (committed at repo root or `/src/styles/`), plus your
> Stitch exports in `/stitch-export/` as **visual reference only**.
>
> **Target:** Astro + vanilla CSS (the tokens are plain custom properties) +
> minimal client JS only where required (subscribe submit, reading progress).
> This ships near-zero JS for a reading site. If you picked Ghost/Beehiiv instead,
> stop — these prompts don't apply; `design.md` becomes a theme spec.

---

## SECURITY HARD RULE (applies to every prompt)
- **No secrets in client code.** Email-provider keys, DB strings, service keys —
  server-side only, via environment variables. The subscribe form posts to a
  server endpoint; the endpoint holds the key. If any prompt would put a key in
  a `.astro` client island or shipped JS, the agent must refuse and flag it.
- Validate and sanitize all input server-side (email format + length cap).
- Rate-limit the subscribe endpoint.

---

## PROMPT A0 — Scaffold + token wiring

```
Initialize an Astro project for a content/newsletter site called "Load-Bearing."
Goals: content-first, near-zero client JS, excellent Lighthouse.

Read `design.md` as the design contract and `abstrekkt-tokens.css` as the token
system — these are authoritative. Read `/stitch-export/` as visual reference for
layout and rhythm only; do NOT copy its hardcoded hex/px values.

Tasks:
1. Scaffold Astro (latest stable), TypeScript strict mode on (tsconfig "strict": true).
2. Set up an Astro Content Collection named `essays` with a typed schema:
   title (string), deck (string), slug (string), date (date), readTime (number,
   minutes), series (enum: "foundation" | "none"), draft (boolean, default false).
   Add 2 placeholder essay entries clearly marked as PLACEHOLDER content (I will
   replace with the 8 Foundation essays) — but do NOT leave TODO stubs in code.
3. Import `abstrekkt-tokens.css` once in a base layout so the tokens and the
   Google Fonts link (Fraunces, Crimson Pro, JetBrains Mono) load on every page.
   Use the exact <link> from the header comment in abstrekkt-tokens.css.
4. Create a base `Layout.astro` that sets <html lang>, semantic <head> (charset,
   viewport, title/description slots), and renders `--bg-base` body chrome.
5. Confirm the dev server runs and a blank page shows midnight background with
   warm-paper text at 18px Crimson Pro.

Acceptance: dev server runs; fonts load (verify in network tab); body uses
semantic tokens (zero hardcoded values); TypeScript strict passes. Validate in
the browser, then stop and report.
```

---

## PROMPT A1 — Shared components (state machines first)

```
Build the 4 shared components from `design.md` §5. Build these BEFORE any page.
Every interactive element gets a full state machine: default → hover → active →
focus → disabled (plus loading/error where noted). Bind all styles to semantic
tokens from abstrekkt-tokens.css — zero hardcoded values. Focus rings: 2px
--focus-ring, offset 2px, visible on every background.

1. Nav.astro — sticky. Two visual states: `top` (transparent over hero) and
   `scrolled` (solid --bg-base, hairline --border bottom). Wordmark left
   (Fraunces 500), links right (Essays/Archive/About) + ember-outline Subscribe
   button. Mobile: collapse to a menu button opening a full-height sheet on
   --bg-base. The scroll state may use a tiny IntersectionObserver script — keep
   it under a few lines, no framework.

2. SubscribeBar.astro — one email input + one button, NO name field. States:
   idle → submitting (button spinner, input disabled) → success (input row
   replaced by an --accent-text confirmation line) → error (--color-error-500
   helper text below; input keeps its value). HTML5 email + non-empty validation.
   The input has a real <label> (visually-hidden is fine). This is a small client
   island; it POSTs to the endpoint built in A8 — for now stub the fetch URL as
   a constant `SUBSCRIBE_ENDPOINT = "/api/subscribe"` (the endpoint is real in
   A8; do not embed any key here). Copy comes from design.md §7 exactly.

3. EssayMeta.astro — byline · date · read-time in JetBrains Mono --text-xs
   --text-muted; the series tag is an ember-outline pill (mono, --tracking-kicker)
   linking to the series.

4. Footer.astro — three columns (identity line, nav repeat, SubscribeBar repeat),
   bottom rule "Abstrekkt · Load-Bearing · {current year}" plus one "what holds"
   line.

Acceptance: each component renders in isolation; every state is reachable and
visually correct; focus rings visible; no hardcoded values; reduced-motion
honored. Validate, then stop and report.
```

---

## PROMPT A2 — Reading View (priority screen)

```
Build the essay reading page at `/essays/[slug]` per `design.md` §6.2. This is
the priority screen — everything serves the prose. Render from the `essays`
content collection.

Layout top to bottom:
1. A 2px reading-progress bar pinned top, fills --accent on scroll, --duration-fast,
   reduced-motion-safe. Minimal client script.
2. Nav (solid immediately).
3. Article header centered to --measure (65ch): series tag, Fraunces --text-4xl
   title, --text-lg --text-secondary deck, EssayMeta; hairline rule under.
4. Body: single column --measure, Crimson Pro --text-base, --leading-prose,
   paragraph spacing --space-6. Subheads Fraunces --text-2xl, --space-12 top.
   Render markdown so: inline tool names → mono chip on --bg-raised; code blocks
   → --bg-sunken, JetBrains Mono, MUTED (paper on sunken, NO neon syntax theme);
   block quotes → 2px --accent left border, italic Crimson Pro --text-secondary.
5. End block: hairline, then compact SubscribeBar with the design.md §7 line.
6. Footer.

Rules: body text NEVER in --accent (fails AA — use --text-primary). One <h1>
(the title). Semantic heading order for subheads.

Acceptance: a placeholder essay renders beautifully; progress bar works and
respects reduced-motion; measure holds at 65ch; code/tool styling correct;
contrast verified. Validate, then stop and report.
```

---

## PROMPT A3 — Masthead (Home `/`)

```
Build the homepage at `/` per `design.md` §6.1, reusing Nav/SubscribeBar/EssayMeta/
Footer from A1.

Top to bottom:
1. Nav (transparent over hero).
2. Hero: mono kicker "AI TOOLS, TESTED UNDER LOAD" (--accent-text, --tracking-kicker);
   Fraunces --text-5xl headline (--tracking-tight, ≤14 words); one Crimson Pro
   --text-lg --text-secondary subhead (design.md §7 hero line); inline SubscribeBar.
3. Latest essay feature: a single wide block (NOT a card grid), hairline --border
   top+bottom (beam), series tag, Fraunces --text-3xl title linking to the essay,
   2-line --text-secondary excerpt, EssayMeta. Pull the most recent non-draft
   essay from the collection.
4. Foundation Series strip: "Foundation Series · 8 pieces" (Fraunces --text-2xl),
   then a vertical typographic list (number, title, read-time) — NOT cards. Hover:
   title → --accent-text. Pull essays where series = "foundation".
5. Footer.

Acceptance: pulls real collection data (no hardcoded essay list); nav scroll
transition works; list hover correct; zero hardcoded tokens; responsive (nav
collapses). Validate, then stop and report.
```

---

## PROMPT A4 — Index (Archive `/archive`)

```
Build `/archive` per `design.md` §6.3 as a typographic ledger, NOT a card grid.

1. Nav (solid).
2. Header: Fraunces --text-3xl "The Archive" + one --text-secondary line. Filter
   row: mono --text-xs toggle chips "All" / "Foundation Series" (ember-outline
   when active). Filtering can be done at build time with multiple views OR a
   tiny client script toggling visibility — prefer no-JS if simple.
3. Ledger: rows separated by --border hairlines. Each row: mono index number
   (--text-muted) · Fraunces --text-xl title (links) · ember mono series tag ·
   right-aligned mono date · read-time. Hover: row bg → --bg-raised, title →
   --accent-text. Render all non-draft essays from the collection.
4. Grouping: when filter = Foundation, group those rows under a sub-head;
   otherwise flat reverse-chronological.
5. Compact SubscribeBar + Footer.

Include the empty-filter state with design.md §7 copy ("No tests under this
filter yet.").

Acceptance: renders real collection; filter works; row hover correct; meta
stacks under title on mobile; zero hardcoded tokens. Validate, then stop.
```

---

## PROMPT A5 — Subscribe (`/subscribe`)

```
Build `/subscribe` per `design.md` §6.4. Convert without selling.

1. Nav (solid).
2. Promise block, centered, narrow (~50ch): Fraunces --text-4xl headline (offer,
   plainly); Crimson Pro --text-lg --text-secondary body (what you get + weekly
   cadence + the no-hype/no-affiliate rule); three plain-text proof points as a
   simple list (NO icons, NO cards): "What a test includes" / "What gets cut" /
   "Why it's free".
3. Large SubscribeBar (full state machine — this is the centerpiece, get
   submitting/success/error visibly right). Below it, --text-muted --text-sm:
   "No spam. One email per test. Unsubscribe in one click."
4. Footer.

Do NOT add fake urgency or a "Join N,000+" count (content-integrity rule — only
show a real verified number, otherwise omit).

Acceptance: SubscribeBar all states reachable and correct; copy matches §7;
narrow measure holds; zero hardcoded tokens. Validate, then stop.
```

---

## PROMPT A6 — The Bench (About `/about`)

```
Build `/about` titled "The Bench" per `design.md` §6.5. Credibility without
inflation.

1. Nav (solid).
2. Header: Fraunces --text-3xl "The Bench"; --text-secondary deck = the
   diagnostic-instinct thesis (reading rooms, processes, systems).
3. Body (--measure, 65ch): Crimson Pro prose, a couple Fraunces subheads, tool/
   stack names as mono chips on --bg-raised. HARD CONTENT RULES: no firm name
   (ceiling is "a managed IT firm"); no credential claim; no "Staff Engineer";
   tool count ~30 hands-on, never "240+". Use the placeholder body I provide or
   leave the prose blocks with clearly-labeled PLACEHOLDER copy I will replace —
   but no code-level TODO stubs.
4. Standards block: short declarative list — every claim sourced/labeled,
   pricing/affiliate stance, what "holds" means.
5. Compact SubscribeBar + Footer.

Acceptance: layout + voice correct; content rules respected; zero hardcoded
tokens. Validate, then stop.
```

---

## PROMPT A7 — Foundation Series (optional `/series/foundation`)

```
Only if a shareable series URL is wanted. Build `/series/foundation` reusing the
Archive ledger pattern (A4), scoped to essays where series = "foundation", with a
series intro block on top (Fraunces --text-3xl + --text-secondary deck). Same
hover, hairline, and token rules. Validate, then stop.
```

---

## PROMPT A8 — Subscribe backend (server-side, no client secrets)

```
Build the subscribe endpoint that SubscribeBar (A1) posts to. SECURITY: the
email-provider/API key lives ONLY on the server via an environment variable.
Nothing secret ships to the client. If any step would leak a key into client
JS, refuse and flag it.

Tasks:
1. Create a server endpoint at `/api/subscribe` (Astro endpoint or server action;
   ensure it runs server-side, not prerendered).
2. Accept POST JSON { email }. Validate: required, RFC-valid email, length ≤ 254.
   On invalid → 400 with a JSON error the SubscribeBar maps to its error state.
3. Read the provider key from `import.meta.env` / process env (e.g.
   SUBSCRIBE_API_KEY, SUBSCRIBE_LIST_ID). Add a `.env.example` documenting the
   vars — never a real key. Provider stays abstract behind one async function
   `addSubscriber(email)` so the platform (own backend vs ESP API) can be swapped.
4. Implement basic rate limiting (per-IP, in-memory or KV) and a generic success
   response that doesn't leak whether the address already existed.
5. Recommend double opt-in (send confirmation email) — implement the hook/branch
   for it even if the confirmation template is provider-side.
6. Every catch block handles the error (log server-side, return safe JSON);
   no empty catches, no swallowed errors.

Acceptance: valid email → 200 + SubscribeBar success state; invalid → 400 +
error state; no key in any client bundle (grep the build output for the env var
name — must be absent); rate limit works. Validate end-to-end, then stop.
```

---

## PROMPT A9 — Pre-ship gate

```
Run the full pre-ship gate before declaring the site done. Fix everything you
find; report a checklist with pass/fail per item.

1. Anti-slop gate — run all 14 checks in `design.md` §10 against every screen.
2. Accessibility: keyboard-only pass (every interactive element reachable, focus
   visible); one <h1> per page; heading order; SubscribeBar label present;
   contrast ≥4.5:1 normal / 3:1 large at render size; confirm body text is never
   in --accent.
3. Reduced-motion: with prefers-reduced-motion, progress bar and transitions
   collapse to near-zero.
4. Responsive: 360px, 768px, 1280px — nav collapses, archive meta stacks, prose
   measure holds, no horizontal scroll.
5. Performance: build and run Lighthouse; target 95+ Performance and 100
   Accessibility on the homepage and a reading page; report actual scores. Flag
   any render-blocking or font-loading issues.
6. Security: grep the production build for env var names (SUBSCRIBE_*) — must be
   absent from client output. Confirm the subscribe endpoint is server-side.
7. Content integrity: no firm name, no credential claim, no "240+", no
   unverified subscriber count, no placeholder copy left in shipped pages.

Output a single pass/fail table. Do not mark the build complete until every item
passes or is explicitly waived by me.
```

---

## RISKS (production-facing)

| Risk | Vector | Mitigation in prompts |
|---|---|---|
| Secret leak | provider key in client island | A8 server-only + grep-the-build check in A9 |
| Subscribe abuse | bot floods endpoint | A8 rate limit + length cap |
| Email enumeration | response reveals existing address | A8 generic success response |
| Agent drift from Stitch | copies hardcoded hexes | A0/A1 "reference only, re-tokenize" |
| Runaway agent | builds on broken base | "validate then stop" after every prompt |
| Token violation creep | hardcoded values slip in | A9 §10 gate greps for raw hex/px |
| Lane-bleed / inflation | memoir voice, "240+", firm name | A6 content rules + A9 integrity check |
| Perf regression | shipped JS balloons | Astro target + A9 Lighthouse gate |

## VERIFICATION / ACCEPTANCE (whole build)
- Every screen in `design.md` §6 renders from real collection data, not hardcoded lists.
- All 4 shared components have complete, reachable state machines.
- Zero hardcoded design values (A9 §10 gate confirms).
- Subscribe works end-to-end with the key server-side only (A8 + A9 grep).
- Lighthouse: 95+ Perf / 100 A11y on home + a reading page (actual numbers reported).
- Content-integrity rules hold on About and Subscribe.

## SELF-REVIEW
- Checked against anti-patterns: no generic scaffolding (every prompt cites a specific design.md section + the collection schema); no TODO stubs (placeholders are content-level and explicitly labeled, never code stubs); every catch handled (A8 step 6); verification step present (each prompt ends with "validate then stop", whole build gated by A9).
- Security: A8 forbids client-side keys and A9 greps the build to prove it.
- File-ops: this is a net-new deliverable (create), not an edit to an existing repo file.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS
**CLAIMS**
- [SOURCED] Astro Content Collections support typed schemas (Zod) and build-time rendering with near-zero client JS. (Astro docs, stable feature as of Jan 2026)
- [GENERATED] 95+ Performance / 100 Accessibility is achievable for this static reading site — a reasoned target from the architecture (static-first, minimal JS, system tokens), not a measured result of your build. Report actuals.
- [GENERATED] These prompts transfer to Cursor/Windsurf — reasoned because they're natural-language agent tasks, not Antigravity-specific commands.

**COUNTEREXAMPLES**
- A build can pass the §10 gate and still feel wrong if essay markdown rendering (mono chips, muted code, block quotes) isn't wired — A2 makes that explicit because it's the most likely thing to get skipped.

**! CONTRADICTIONS**
- ! Framework assumes custom/Astro. If the platform decision (WSJF blocker 10) lands on Ghost/Beehiiv, these prompts are void — `design.md` becomes a theme spec and the build path is entirely different. Resolve platform before running A0.
- ! Subscribe provider is left abstract behind `addSubscriber()`. That's deliberate (platform undecided) but means A8 is not fully runnable until you name the provider and set env vars.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS
- **Antigravity exact UX** (how you feed multi-file context, its planning/checkpoint model, current preview limits) is at my Jan-2026 knowledge edge — these prompts are written to survive that uncertainty, but verify the ingestion flow in the app. I can search current Antigravity docs if you want.
- **Real essay content** (8 Foundation titles/bodies/slugs/dates) still isn't supplied — A0 uses labeled placeholders; the site is not launch-ready until you load the collection.
- **Subscribe provider + double opt-in template** unspecified — A8 hooks for it but you must choose (own Supabase + confirmation flow, or ESP API).
- **Domain/deploy target** (Cloudflare Pages, Vercel, Netlify) and analytics (PostHog) not covered here — needed before launch, not for the build.
- **SEO/OG-images/RSS** — a newsletter especially wants RSS; not in these prompts. Flag if you want an A10 for RSS + sitemap + OG.
