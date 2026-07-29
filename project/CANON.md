# Abstrekkt — Canonical Artifact Registry
> **This file is the source of truth for all Claude artifacts in this project.**
> Before creating any new artifact: check here. If a tool for that job already
> exists, patch the canonical — do not create a sibling. If you must version,
> follow §2 and update this table.

---

## 1. Canonical table

### Lane: Memoir

| Canonical file | Purpose | When to use |
|---|---|---|
| `memoir-explorer.jsx` | Visual/thematic scene explorer, multi-theme (Carbon Noir/Blueprint/Midnight Stack) | Browsing scenes, exploring the emotional architecture, arc navigation |
| `memoir_engine.html` | Story builder UI (legacy HTML surface) | REVIEW — absorb into author hub or archive |
| `book_command_center.html` | Story overview + letters + AI excavation (HTML surface) | Quick story-state reference, letters-to-send view |
| `chapter-reader/Abstrekkt Chapter Reader.html` | Multi-state chapter reader (8 visual treatments: chronology/sensory/construction/HUD/schematic/collage/forensic/blueprint) | Reading a single chapter draft in different visual registers |
| `Corridor Archive Manifest.html` + `corridor/manifest.json` | Full scene-archive browser — 111 records across corridor/memoir/construction/rupture/studio/writing/product/meta lanes, filterable by lane/perspective/variant/protected | Browsing every Stitch exploration (villains/virtues corridor states, chapter openings, excavation reports, visual-system studies) in one place |

**Jul 9, 2026 sync:** imported the full remaining set of `stitch_memory_corridor_studio/` scene folders from the working-files upload (55 folders previously missing — corridor motion/pulse variants, hardware audits, manifesto variants, moment-studio sub-screens, ~20 pure visual-system studies) and registered them all in `corridor/manifest.json` (66 → 111 records). Added a `meta` lane for book-craft/visual-system tools that aren't narrative scenes. Four folders (`the_brutalist_archive`, `obsidian_embers`, `structural_narrative`, `reading_room_at_midnight`) are DESIGN.md-only alternate palette notes, not renderable scenes — copied for reference but intentionally left out of the gallery.

**Jul 13, 2026 — `book_command_center.html` visual-system flag closed:** this file runs its own neon palette (orange/cyan/purple, Bebas Neue/DM Sans) — not Brutalist Archive, not Reading Room. Ruling: **internal operator tools are exempt from the brand-facing token binding.** The hybrid policy under *Lane: Abstrekkt Studio Marketing* governs reader/public-facing surfaces; ops consoles (this file, FlashFusion Console, Operator Console, Audit pages) have always carried their own purpose-built palettes and that's fine — they're workbenches, not brand surfaces. No restyle needed; leaving as designed.

**STALE — retired Jul 2026:**
- `memoir-project-hub.jsx` — removed from project
- `memoir-command-center.jsx` · `memoir-hub-v3.jsx` — functions absorbed by `abstrekkt-author-hub.jsx`; source recoverable from knowledge index if needed

---

### Lane: Abstrekkt Studio Marketing

| Canonical file | Purpose | When to use |
|---|---|---|
| `Abstrekkt Home.html` | Studio marketing home | Primary landing page |
| `Abstrekkt Founder.html` / `Abstrekkt Founder v2.html` | Founder story page — v2 adds Spine/Career-Arc/Memoir sections | v2 is the fuller version; v1 kept live pending a decision to retire it — REVIEW |
| `Abstrekkt Pillars.html` | The Construction Manifesto (8 tenets) | Manifesto reference, linked from nav everywhere |
| `Abstrekkt Contact.html` | Contact / intake form | "Start where you are" destination |
| `Abstrekkt Splash.html` | Cinematic video/audio splash gate | Pre-Home entry screen |
| `Abstrekkt Voice.html` | Voice source-of-truth + generation system prompt | Drafting any Abstrekkt-voice copy |
| `Abstrekkt Search.html` + `abstrekkt/search-app.jsx` | Archive search (React) | Searching the personal archive corpus |
| `Abstrekkt Design.html` | Separate "AI Assessment" design-system demo (React, `screens/*.jsx`) | Unclear relationship to the studio site — REVIEW |
| `Abstrekkt Brand System.html` | Brutalist Archive brand specimen page | Token/component reference for this lane |
| `abstrekkt/nav-toggle.js` | Shared mobile-nav disclosure behavior (hamburger open/close) | Loaded by every page with a `header.nav` + `.nav-links` |
| `Abstrekkt Studio Landing.html` | Consulting-studio marketing landing ("Clarity isn't simple. It's constructed." — Strategy/Communication/Systems, Book Advisory/Start a Brief) built against the bound `_ds/` Reading Room at Midnight bundle per Kyle's directly-edited reference mock (`uploads/clarity-its-simple-constructed.png`) | Studio/consulting positioning — **not** a replacement for `Abstrekkt Home.html`, which stays live with its own "Construction, not recovery" peer-support positioning and Brutalist Archive tokens |

**Jul 11, 2026 — first Reading Room at Midnight build in this lane:** built from Kyle's edited reference image, using the real `_ds/` component bundle (Button/Card) rather than recreating look-alike markup. Deliberately net-new, not a restyle of `Abstrekkt Home.html` — that file's copy is a different product narrative (peer support / no-baseline-required) and wasn't touched. This makes the design-system conflict flagged below concrete rather than hypothetical: this lane now has one live page in each system. Still not resolved — see the flag.

**Jul 10, 2026 — responsive + accessibility pass (pilot lane):** added a working mobile nav
(hamburger disclosure, was `display:none` with no alternative below 720px) to all
`header.nav` pages; skip-links; visible focus rings on inputs/buttons that previously
suppressed `:focus`; 44px touch targets on mobile; `prefers-reduced-motion` safety net
everywhere (Splash's autoplay video/audio now freezes on a still frame instead of looping);
raised `--t4`/`--t5` token values so small mono text and "ghost" headline text clear WCAG AA
(were 3.46:1 / 1.63:1 on the dark bg, now 5.6:1 / 3.4:1); fixed a dead `<button>` CTA and a
self-referential `href="#"` link on Pillars; added `aria-current`/icon-button labels/live
region on Search. Did **not** touch `abstrekkt-tokens.css` (a separate, unused Load-Bearing
token set) or the `_ds/abstrekkt-design-system-*` ink-and-brass bundle — neither is loaded by
any page in this lane; the lane's actual, working visual system is the inline Brutalist
Archive tokens per `CLAUDE.md`. Remaining lanes (FlashFusion, Load-Bearing, Midnight Academy,
Kyle Rosebrook personal, Memoir/Corridor incl. the stitch scene archive) are queued next.

---

### Lane: Kyle Rosebrook Personal

| Canonical file | Purpose | When to use |
|---|---|---|
| `Kyle Rosebrook Home.html` | Personal site home (`kr/kr.css` system) | Primary entry point — linked from dozens of essay navs/colophons and from `Abstrekkt Home.html` ("Journal") |
| `Kyle Rosebrook About.html` / `Essays.html` / `Tools.html` / `Case Files.html` / `Contact.html` / `Now.html` / `Notes.html` / `Principles.html` / `Reading List.html` / `Research Threads.html` / `Active Drafts.html` / `Decision Matrix.html` | Full site sections | All share `kr/kr.css`; do not fork a new homepage or nav system |
| `Sedona - The Meditation Pivot.html` | Photo essay, real Sedona photography | Linked from the shared `ks-nav` essay template as "Sedona" |
| `LLC Formation Kit.html` | FlashFusion-only formation toolkit (Chaos Club Co. lane removed) | Linked from the shared `ks-nav` essay template as "Toolkit" |

**Jul 11, 2026 — domain + duplicate resolution:** `kylerosebrook.com` is confirmed dead; identity is `abstrekkt.com` (per `Abstrekkt Voice.html`) everywhere live. Swept the one remaining live reference (`corridor/manifest.json` writing-lane blurb). Resolved `Audit - Ecosystem, Jul 8.html` E-04 ("two homepages"): `Kyle Rosebrook Home.html` is canonical; `Kyle Rosebrook Homepage.html` (zero inbound links, stale Chaos Club Co. claim) archived to `Kyle Rosebrook Homepage_archive_2026-07.html`. Re-uploaded drafts this session (`kylerosebrook-v4`, `about-page`, `moving-in-silence-was-phase-one`, `llc-formation-kit`) are superseded duplicates of already-canonical, already-fixed pages in this lane — not rebuilt.

**STALE:**
- `Kyle Rosebrook Homepage_archive_2026-07.html` — superseded by `Kyle Rosebrook Home.html`; kept for reference only, not linked

**✓ RESOLVED — Jul 13, 2026, hybrid policy (interim, until Kyle rules definitively):** two systems exist — CLAUDE.md's **Brutalist Archive** (carbon `#131315`/`#0A0A0C`, amber `#ffbf00`/`#ffe2ab`, EB Garamond/Literata/JetBrains Mono) and the bound `_ds/abstrekkt-design-system-00b28ec4-...` **Reading Room at Midnight** (ink `#0d0c0a`, brass `#C8A86A`, Fraunces/Crimson Pro/JetBrains Mono). Rather than pick a winner or mass-restyle, the two are kept as **separate, non-mixing registers**:
- **Existing corpus (all ~182 pre-Jul-13 files) stays on Brutalist Archive.** No silent restyle. This is the identity readers/journalists/pitches already saw.
- **`_ds/` Reading Room bundle is reserved for net-new Studio-lane builds** that explicitly load the bundle (`Abstrekkt Studio Landing.html` today) — treat it as this lane's "quiet variant," not a replacement.
- **Never mix token sets in one file.** A page either loads `_ds/` and uses its components, or defines Brutalist Archive tokens inline — not both.
- Both share the same structural DNA (dark ink base, single warm accent, serif display + mono meta) so cross-lane visits don't feel like different brands, just different rooms of the same studio.
- This is the working default for this audit pass. Still flagged for a real founder ruling — revisit if Kyle wants one system going forward.

---

### Lane: FlashFusion Business & Product

| Canonical file | Purpose | When to use |
|---|---|---|
| `FlashFusion Business Plan.html` | Internal business plan (Chicago consulting practice: 3 pricing pillars, Diagnostic Spine framework, ops cadence) | Planning reference — not for external distribution |
| `FlashFusion PRD - Strategic Expansion Engine.html` | PRD for the internal Strategic Expansion & Triage Hub (F1–F4 + non-functional/security reqs), each feature with an explicit "Data needed to go live" block | Scoping the real build; each F# maps 1:1 to a Console tab |
| `FlashFusion Strategic Expansion Console.html` | Working prototype of the Hub — 4 tabs (Intelligence Feed / Validation Matrix / Growth OS radial dashboard / Compliance Workbench), explicit sample-data badge, matching "Data needed to go live" callout per tab | Reviewing the shape of the internal tool before real data sources are wired |
| `FlashFusion Services.html` | Public services & pricing page (same 3 tiers, Diagnostic Spine, hours) | Linked from `FlashFusion Blog.html` masthead nav — the site's actual Services destination |

All four use `colors_and_type.css` (the versioned, self-hosted-font FlashFusion token system) or its exact hex/font values inline for print — not the one-off inline token sets several older `FlashFusion - *.html` essays carry (Poppins-based, slightly different violet/cyan values). Treat `colors_and_type.css` as canonical for any new FlashFusion artifact; the essay-level drift is a pre-existing condition, not something this pass fixed.

**Jul 11, 2026 — registered + cross-linked (previously unregistered):** all four files already existed, fully built, correctly brand-corrected (Abstrekkt→FlashFusion) — not rebuilt. Added the missing cross-links: `Services` into `FlashFusion Blog.html`'s masthead nav and footer (it was an orphan page, unreachable from the site); Business Plan ↔ PRD ↔ Console footer/header links (the three internal docs referenced each other only by name, not by hyperlink).

**✓ RESOLVED — Jul 13, 2026, founder decision:** FlashFusion is a **consulting practice** — Kyle teaches how to build software, with "disposable software" (his coined term, gaining traction) as the flagship teaching concept. The Business Plan/PRD/Console/Services quartet is canonical. `FlashFusion - Anthropic Partner Narrative.html` (the Claude-native SaaS product company narrative — "Compliance Copilot," `.ai` domain) does not reflect the current model — archived per CANON §2 naming convention.

**⚠ EXTERNAL SOURCE, corrected Jul 13, 2026 — `ChaosClubCo/Invelo-v1.5` (GitHub):** a real, fully-built React/Vite/Tailwind site for **Intinc**, showcasing its **Invelo** service line (Catalyst Builds like SOC 2 Sprint / Onboarding Accelerator, case-study carousel, named testimonials, 20-year heritage framing). Own brand: Navy `#0A192F` / Gold `#C5A059` / Teal `#2D5A5A` / Cream `#F9F8F4` — distinct from both Abstrekkt and this project's FlashFusion (void/purple/pink/cyan). The repo happens to also self-describe as "FlashFusion, an AI services company" — coincidental name collision with this project's FlashFusion, not the same entity.
**Authorship vs. business facts — the actual distinction:** Kyle built this — the branding, the positioning, the why/how — as Intinc's employee. That authorship is legitimately his to credit (portfolio/resume-style, in the Kyle Rosebrook Personal lane) — e.g. "designed & built brand + site for Invelo while at Intinc." What is **not** his to carry over: the underlying business facts (20-year heritage, client testimonials, case-study metrics, revenue) belong to Intinc as a company, not to Kyle's own FlashFusion consulting practice. Those facts stay Intinc's, even though Kyle did the work. See `Invelo Options.html`, updated accordingly.

---

### Lane: Press & Pitch

| Canonical file | Purpose | When to use |
|---|---|---|
| `pitch_console.html` | Pitch database: static journalist entries, targets, status | Reviewing all pitches, picking a target, updating status |
| `pitch_generator.html` | Claude API pitch generator (uses PITCHES from console as context) | Generating/drafting a pitch to a new target |
| `dispatch.jsx` | Quick-post dispatcher — Drive search, self-healing API (3-retry + mock fallback), client mode, tone control | Drafting short FlashFusion/AI-tooling posts from build notes |
| `playbook.html` | Public vibe-coding playbook page (kyle.abstrekkt.com/playbook) — Gate 2 for all press sends | Deploy target; source of truth is `vibe-coding-playbook-web.md` — patch both together |
| `kyle-abstrekkt-index.html` | kyle.abstrekkt.com root — one-screen identity card (+ Tweaks: hero voice ×3 / depth / ember) | Deploys as `/index.html`; extends only when a linked thing is live (no promises) |
| `press-kit.html` | kyle.abstrekkt.com/press — press kit: what-to-call-him, 2 bios, three walled story lanes (A operator / B construction / C lived experience) with in/out-of-scope rules, sourced fact sheet, arc timeline, headshot slot, contact ground rules | The corroboration target for memoir/recovery pitches; clinical claims sourced to `the-evidence-board.md` + `assets/clinical-source/` only |
| `domain-map.html` | INTERNAL — abstrekkt.com property architecture: subdomain → in-project files → launch gate, press routing table, launch order | Planning which property ships next; answers "what deploys where" |
| `deploy/kyle-abstrekkt-com/` + `deploy/README.md` | Production deploy package for kyle.abstrekkt.com — generated copies of the three canonicals as `index.html` / `playbook/` / `press/` + `404.html`, with in-project design tooling stripped (Tweaks/React/Babel, image-slot → static frame) | Uploading the press landing. GENERATED — never edit the copies; edit the root canonicals and regenerate. README carries Kyle's upload/DNS/mailbox steps |

**Jul 12, 2026 (pm) — deploy package:** generated `deploy/kyle-abstrekkt-com/` from the three press-landing canonicals. Deliberate deltas from source: index drops the Tweaks panel + React/Babel CDN scripts (chosen tweak values were already the static defaults); press swaps the `<image-slot>` headshot for a static "PHOTO — ON REQUEST" frame (no drag-drop UI in production; regenerate when Kyle drops the real photo); playbook masthead/footer links made root-relative so staging previews work. Root canonicals remain the only editable source of truth.

**Jul 12, 2026 — domain architecture + press kit (post-interview):** Kyle's property plan captured in `domain-map.html`: root = studio, kyle. = press landing, blog. = existing Kyle Rosebrook site, memoir./music./hovav. = walled lanes, flashfusion.co separate. All 39 pitch signatures standardized `abstrekkt.com` → `kyle.abstrekkt.com` (colophon, lock-warning, and sourced-facts Site: line included; `kyle@abstrekkt.com` addresses untouched). Index card gained the `/press` link + a Tweaks panel. New press-facing pages use the lane's existing ink/ember tokens (Fraunces/Crimson Pro/JetBrains Mono per `kyle-abstrekkt-index.html`) — NOT a ruling on the Brutalist-Archive-vs-Reading-Room conflict flagged above, which stays open. Press kit deliberately omits: "homeless" (evidence board says living with parents — discrepancy flagged to Kyle), "11 attempts at associates" (no evidence-board entry yet), and Chaos Club Co. (retired Jul 2026 per evidence board, which contradicts the still-open Taylor Six pitch — flagged, not resolved).

**STALE — do not use:**
- `dispatch_archive_2026-07.jsx` — was v2 (WCAG pass); superseded by `dispatch.jsx` (was v6)
- `pitch_console_bak.html` deleted ✓ · `dispatch-v3.jsx` removed from project ✓ Jul 2026

---

### Lane: Content & Publishing

| Canonical file | Purpose | When to use |
|---|---|---|
| `content-engine.jsx` | Voice foundation + Claude API content generator | Drafting FlashFusion essays/posts from scratch with voice enforcement |
| `editorial-framework.html` | Editorial framework: content types, format rules, publishing criteria | Planning content, checking what's in-scope vs out-of-scope |
| `publishing_command_center.html` | 5 publishing paths + 4 reader personas + pitch/letters | Path decisions, persona targeting — carries v2 content |
| `voice-audit.jsx` | Voice audit tool: paste text, get voice-alignment score + notes | Checking a draft before publishing |

**STALE:**
- `publishing_command_center_archive_2026-07.html` — was the `_v2` canonical; content promoted to the suffix-free name above

---

### Lane: Load-Bearing

| Canonical file | Purpose | When to use |
|---|---|---|
| `Load-Bearing Home.html` | Sub-brand essay index ("AI Tools, Tested Under Load") | Landing page for the Load-Bearing editorial line |
| `Load-Bearing Archive.html` / `Load-Bearing Bench.html` / `Load-Bearing Subscribe.html` | Archive listing / about ("Bench") / subscribe | Full site sections, share `loadbearing/site.css` |
| `Load-Bearing - Claude Code at Ninety Days.html` / `- Make vs n8n.html` / `- The MCPs That Earned Their Keep.html` / `- When the Stack Falls Over.html` | The four published essays in the "Tested Under Load" series | Essay content |
| `Load-Bearing Catalog.html` / `Load-Bearing Article.html` | Additional catalog/article templates | REVIEW — relationship to the 4-essay series above unverified |

**Jul 13, 2026 — registered (previously unregistered), first-pass audit:** existed fully built, not previously in this table. `Load-Bearing Home.html` footer carries two `href="#"` placeholders (Privacy/Terms) — acceptable as not-yet-written policy pages, not treated as a bug.

---

### Lane: Midnight Academy

| Canonical file | Purpose | When to use |
|---|---|---|
| `Midnight Academy Suite Hub.html` | Command-center dashboard — metrics + action items + module grid | Entry point, links to all 7 other tools |
| `Midnight Academy Enablement Flow.html` / `Intake Form.html` / `Prompt Builder.html` / `Service Guide.html` / `Outcome Tracker.html` / `Accountability.html` / `Objection Handler.html` | The 7 module tools linked from the Suite Hub | Each maps to one sidebar/module-grid entry |

**Jul 13, 2026 — registered (previously unregistered) + one fix:** Suite Hub's metrics badge read "Live Data" over static mock numbers (142 onboarded, $1.2M ROI recovered) — same misleading-sample-data pattern already flagged and corrected in the FlashFusion Console (which uses an explicit sample-data badge). Changed to "Sample Data" for consistency. Sidebar Settings/Support links and three Action-Required rows still use `href="#"` — this hub has no backing data source yet, so those are legitimately unbuilt, not broken.

---

### Lane: FlashFusion Delivery (relocated Jul 2026)

The Claude Enablement Suite (`00-suite-hub.jsx` through `06-objection-handler.jsx`)
no longer lives in this project. ASSUMED relocated to the FlashFusion delivery
context during the Jul 7 lane reorganization — not deleted. If that assumption
is wrong, restore from knowledge index. Known open defect carried with it:
`00-suite-hub.jsx` has a React hook violation; fix before production deploy.

---

### Cross-lane reference

| Canonical file | Purpose | When to use |
|---|---|---|
| `abstrekkt-tokens.css` | Abstrekkt design tokens (midnight ink/ember) | Drop-in base for any new artifact. Never infer tokens. |
| `design.md` | Load-Bearing design contract (5-screen newsletter) | Load-Bearing build reference |
| `project-focus-evolution.html` | Career/project evolution timeline | Narrative reference for pitches and About copy |
| `char-diagnostic-instinct.md` | The diagnostic instinct character profile | Voice/origin reference for scripts and pitches |
| `kyle-origin-video-scripts-v4.md` | Origin story scripts (YouTube / LinkedIn / TikTok) | Video recording reference, updated with piano/pattern beat |
| `abstrekkt-author-hub.jsx` | Author command center — memoir/pitch/content/canon, one surface | Session entry point for author-lane work |
| `voice_map.jsx` | Voice analysis across lanes (essay/lyrics), self-healing API | Mapping voice signatures across writing lanes |
| `the-evidence-board.md` | Evidence board — memoir source ledger | Cross-checking memoir claims against primary sources |
| `assets/clinical-source/` | Primary clinical documents (SPECT scan renders ×4, Amen Clinics eval, TBR cognitive assessment, CPT3, sleep scale, brain-system handout) | Grounding evidence-board claims in the actual source docs; financial/insurance paperwork from the same upload was deliberately excluded |
| `kyle_docs_readable.txt` | Historical compilation (Apr 2026) | Reference only — claims inside are dated; never treat as current state (Butler rule) |

**STALE:**
- `project-focus-evolution_archive_2026-07.html` — was the `_v2` canonical; content promoted to the suffix-free name above

**REVIEW — live but unregistered (purpose unverified; register or archive, don't leave):**
`writing-fixer.jsx` · `voice-generator.html` · `antigravity-build-prompts.md` · `stitch-prompts.md` · `kyle_brilliant_moments.html` · `matt-wolfe-tldr.html`

---

### Lane: Abstrekkt Operations & Handoff Package

| Canonical file | Purpose | When to use |
|---|---|---|
| `Abstrekkt Operator Console.html` + `operator-console/*` | Interactive console rendering the Jul 11, 2026 portable project package (`uploads/README.md` + 30 registers/briefs — executive summary, Milestone-0 tracker, roadmap, business/product requirements, system architecture, 9 decision/risk registers, handoff docs) | Tracking the pre-revenue gate (B-1..B-5), checking Milestone 0/1/2 acceptance criteria off, browsing the risk/decision/contradiction registers, resuming work in a fresh AI session |
| `Repository Operations Hub.html` | Single-file React field-notes reference for repository lifecycle operations — creation, upgrade/maintenance, observability, agents, MCP servers, webhooks, mapping/architecture, org. Built on the `_ds/` Reading Room bundle's components. The design open at handoff export; the root `README.md` handoff note names it as the primary design | Orienting a coding agent entering via the handoff note; referencing repo-ops patterns (lifecycle, observability, agent/MCP/webhook wiring) before implementing them for real |

**Jul 11, 2026 — built from the portable package, incorporating Kyle's direct edits to the source `.md` files.** The uploads package (generated by Claude Cowork from the 225-doc KB) existed only as flat markdown in `uploads/`, no live counterpart in this project. Built as one interactive console rather than a flat document render so the Milestone-0 checklist and the 9 registers (decisions, contradictions, risks, gaps, bottlenecks, blindspots, failure modes, unknown-unknowns, open loops) are actually usable, not just read — checklist state persists per-browser via localStorage. Did not alter any existing FlashFusion/LLC-kit canonical file. Where the package's own Contradiction Log flags something the live project already resolved — C-2, the obsolete "Chaos Club Co. LLC" two-entity plan — that's already fixed in `LLC Formation Kit.html` per the Jul 8 audit fix log; the console reports the package's finding as-is (this registry entry is the cross-reference, the package source wasn't edited). This lane is Kyle-owned business/legal fact, not design content — do not "resolve" a flagged contradiction (Ryan $ amount, chaosclub.co naming, cert name) on Kyle's behalf; those stay open pending Kyle.

**Jul 29, 2026 — registered `Repository Operations Hub.html` (previously live but unregistered).** The root handoff `README.md` names this file as the design open at export — the primary design of the handoff — yet it had no registry entry, violating §4 ("any artifact not in this table doesn't exist officially"). Registered as-is; no content edits. It loads the `_ds/` Reading Room bundle (tokens + `_ds_bundle.js` components), which is worth knowing before assuming the Studio-lane `_ds/` usage notes elsewhere in this file are exhaustive.

**STALE:** none.

---

## 2. Naming convention (enforced from this file forward)

**Rule:** the canonical artifact has NO version suffix. Only archived non-canonical files carry a suffix.

```
CANONICAL:   pitch_console.html
ARCHIVE:     pitch_console_archive_2025-06.html   ← rename before replacing
NEVER:       pitch_console_bak.html               ← _bak is ambiguous; use _archive_YYYY-MM
NEVER:       pitch_console_v2.html                ← v2 implies v1 is still alive
```

**When you want to create a new version:**
1. Rename the current canonical to `[name]_archive_[YYYY-MM].[ext]`
2. Update this table: mark old as ARCHIVE, add new canonical
3. Build the new version as `[name].[ext]` (no suffix)
4. Commit one PR / one session: rename + new build + CANON.md update are atomic

**File naming for net-new tools:**
- Use kebab-case: `author-hub.jsx` not `AuthorHub.jsx`
- Prefix with lane slug if lane-specific: `memoir-command-center.jsx`, not `commandCenter.jsx`
- Cross-lane tools: no prefix

---

## 3. Stale file disposal

| File | Action | Reason |
|---|---|---|
| `project-focus-evolution-v2.html` | Renamed → `project-focus-evolution_archive_2026-07.html` | Content promoted to suffix-free canonical this sync |
| `publishing_command_center_v2.html` | Renamed → `publishing_command_center_archive_2026-07.html` | Content promoted to suffix-free canonical this sync |
| All other prior entries | Done ✓ Jul 7, 2026 | Disposed or absorbed — see lane STALE lists. `PROJECT_STATE.md` (deprecated relic) also removed. |

---

## 4. Anti-drift rules (enforce in every session)

- **Check CANON.md before creating any new artifact.** If it already has a canonical file for the job, patch it — do not create a sibling.
- **Never create `_v2`, `_bak`, `_new`, `_final`, `_FINAL2`.** The convention is §2.
- **Lint: no canonical entry in §1 may contain a version token.** If one appears, the registry itself drifted — fix before any other work.
- **Any artifact not in this table doesn't exist officially.** If you build something new, add it here before the session ends.
- **Version pairs with the same job = one of them is stale.** Decide canonical, archive the other, update this table. Do not leave both alive.
- **Butler rule:** repeated references across files are not confirmation. Check ground truth, not sibling artifact consistency.

---

*Reconciled Jul 9, 2026 — synced canonical set to 9 directly-edited/added artifacts (book_command_center, editorial-framework, pitch_console, pitch_generator, memoir_engine, kyle-abstrekkt-index, playbook, project-focus-evolution, publishing_command_center).*
