import { useState } from "react";

// ─── TOKENS (Abstrekkt "Reading Room at Midnight") ───────────────────────────
const T = {
  bg:         "#101216",
  surface:    "#181b20",
  sunken:     "#0a0b0d",
  border:     "#22262d",
  borderHi:   "#2f343c",
  text:       "#f2efe7",
  textSec:    "#939aa4",
  textMuted:  "#6b727d",
  accent:     "#cf5a32",
  accentText: "#de7449",
  error:      "#c8504a",
  success:    "#5a9e6f",
  warning:    "#c98a2e",
  info:       "#5a86b8",
};

const FONTS = {
  display: "'Fraunces', Georgia, serif",
  body:    "'Crimson Pro', Georgia, serif",
  mono:    "'JetBrains Mono', ui-monospace, monospace",
};

const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :focus-visible { outline: 2px solid ${T.accentText}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

// ─── DATA: MEMOIR (sourced from memoir-command-center.jsx) ───────────────────
const CHAPTERS = [
  { part:"PROLOGUE", ch:"Prologue",  title:"The Wrong Beginning",                    status:"seed"        },
  { part:"I",        ch:"Ch 1",      title:"Reading the Room",                       status:"excavated"   },
  { part:"I",        ch:"Ch 2",      title:"The Permission",                         status:"seed"        },
  { part:"I",        ch:"Ch 3",      title:"Counting Streetlights",                  status:"unverified"  },
  { part:"II",       ch:"Ch 4",      title:"Hardware Failure",                       status:"protected"   },
  { part:"II",       ch:"Ch 5",      title:"The Noise That Stopped",                 status:"protected"   },
  { part:"III",      ch:"Ch 6",      title:"First Tools",                            status:"not-started" },
  { part:"III",      ch:"Ch 7",      title:"Learning to Think in a New Architecture",status:"not-started" },
  { part:"III",      ch:"Ch 8",      title:"The Arsenal",                            status:"not-started" },
  { part:"IV",       ch:"Ch 9",      title:"The Monitor Reflection",                 status:"seed"        },
  { part:"IV",       ch:"Ch 10",     title:"The Wrong Book, The Right Failure",      status:"seed"        },
  { part:"V",        ch:"Ch 11",     title:"Shoes On, Kiddo",                        status:"locked"      },
  { part:"V",        ch:"Ch 12",     title:"Welcome to the Chaos Club",              status:"not-started" },
  { part:"EPILOGUE", ch:"Epilogue",  title:"The Distinction",                        status:"not-started" },
];

const STATUS_META = {
  locked:      { label:"LOCKED",      color: T.success  },
  excavated:   { label:"EXCAVATED",   color: T.accentText},
  seed:        { label:"SEED",        color: T.warning  },
  unverified:  { label:"UNVERIFIED",  color: T.info     },
  protected:   { label:"PROTECTED",   color: T.error    },
  "not-started":{ label:"NOT STARTED",color: T.textMuted},
};

const EXCAVATION = [
  { id:"t1",  title:"Tom Ropel",              priority:"high",   note:"Best friend growing up. 'An entire chapter by itself.' NOT excavated." },
  { id:"t2",  title:"Dave Datt's Funeral",    priority:"high",   note:"Brain aneurysm. Parallel failure arc. Funeral not excavated." },
  { id:"t3",  title:"NIU Expulsion 2016",     priority:"high",   note:"Kicked out. The spiral needs fuller excavation." },
  { id:"t4",  title:"Session 3: Tool Archaeology", priority:"high", note:"Chronological tool mapping — earliest cognitive scaffolding. NOT done." },
  { id:"t5",  title:"15 Open Clarifiers (Apr 16)", priority:"high", note:"Amen eval date conflict, summer 2020 OD context." },
  { id:"t6",  title:"The Car Hit (2014/15)",  priority:"medium", note:"Walking to a girl's house on Xanax. Broke wrist." },
  { id:"t7",  title:"$50K Spending Spree",   priority:"medium", note:"Settlement money. Spent in 3–4 months. What was the car?" },
  { id:"t8",  title:"Ryan at CLC",           priority:"medium", note:"One of The Five is a counselor at Kyle's target partner org." },
];

// ─── DATA: PITCHES (sourced from pitch_console.html) ─────────────────────────
const PITCHES = [
  { num:"01", pub:"Sifted",                  brand:"FlashFusion",     status:"ready", subject:"Founder story — B2B AI consultancy built from an IT support day-job" },
  { num:"02", pub:"ADDitude Magazine",        brand:"Memoir / Personal",status:"ready", subject:"ADHD founder essay — what changes when you stop fighting the wiring" },
  { num:"03", pub:"Business Insider SG",     brand:"FlashFusion",     status:"draft", subject:"The Moltbook failure mode" },
  { num:"04", pub:"Narratively",             brand:"Personal",        status:"draft", subject:"The Personals: The Nod" },
  { num:"05", pub:"Fast Company",            brand:"FlashFusion",     status:"draft", subject:"Counter-data to AI rebellion narrative" },
  { num:"06", pub:"Fortune",                 brand:"FlashFusion",     status:"draft", subject:"Source tip — counter-narrative to AI rebellion piece" },
  { num:"07", pub:"Inc Magazine",            brand:"Memoir / Personal",status:"draft", subject:"ADHD founders — the constraint angle" },
  { num:"08", pub:"Arc Talent Blog",         brand:"Memoir / Personal",status:"draft", subject:"Self-taught dev coverage — IT support to working AI builds" },
  { num:"09", pub:"Lexington Herald-Leader", brand:"Memoir",          status:"draft", subject:"Peer-built support platform — JRN coverage angle" },
  { num:"10", pub:"DIY Genius",             brand:"Memoir / Personal",status:"draft", subject:"ADHD entrepreneurship — constraint angle" },
  { num:"11", pub:"Globe and Mail",          brand:"FlashFusion",     status:"draft", subject:"Bartender-to-AI-consultant — the vector nobody covers" },
];

const PITCH_STATUS = {
  ready: { label:"READY", color: T.success  },
  draft: { label:"DRAFT",  color: T.warning  },
  sent:  { label:"SENT",   color: T.info     },
  dead:  { label:"DEAD",   color: T.textMuted},
};

// ─── DATA: CONTENT ROUTING ────────────────────────────────────────────────────
const CONTENT_TYPES = [
  { type:"LinkedIn Hot Take",    badge:"HOT TAKE",     tool:"dispatch.jsx",                      when:"Built something and have a 1-line insight. Under 200 words." },
  { type:"X Thread",             badge:"THREAD",       tool:"dispatch.jsx",                      when:"Have 4–6 connected observations. Thread = argument, not list." },
  { type:"Essay Brief",          badge:"BRIEF",        tool:"content-engine.jsx",                when:"Want to write a Load-Bearing or FlashFusion essay. Start with the brief." },
  { type:"Newsletter Section",   badge:"SECTION",      tool:"content-engine.jsx",                when:"Writing a Load-Bearing edition. Hook + observation + tool test." },
  { type:"Reading Room",         badge:"READING ROOM", tool:"editorial-framework.html",          when:"A piece that sits in the Abstrekkt aesthetic — slower, literary." },
  { type:"Pitch Letter",         badge:"PITCH",        tool:"pitch_generator.html",              when:"Drafting a new journalist pitch. Use pitch_console.html as the target database." },
  { type:"Video Script",         badge:"VIDEO",        tool:"kyle-origin-video-scripts.md",      when:"Recording origin story or explainer video content." },
  { type:"Voice Audit",          badge:"AUDIT",        tool:"voice-audit.jsx",                   when:"Finished a draft. Run before publishing." },
];

// ─── DATA: CANON REGISTRY (verbatim from CANON.md) ────────────────────────────
// To sync: copy CANON.md's "## 1. Canonical table" section — from that heading
// through the "---" divider immediately before "## 2. Naming convention", not a
// fixed line range, since CANON.md's length changes — into CANON_SOURCE below,
// verbatim, INCLUDING this file's own dated notes if CANON.md mentions them (do
// this edit to CANON.md first, then paste, so CANON_SOURCE reflects itself).
// Escape every literal backtick as \` and every literal ${ as \${ — a template
// literal fails silently and totally otherwise. Nothing else needs to change.
const CANON_SOURCE = `
## 1. Canonical table

### Lane: Memoir

| Canonical file | Purpose | When to use |
|---|---|---|
| \`memoir-explorer.jsx\` | Visual/thematic scene explorer, multi-theme (Carbon Noir/Blueprint/Midnight Stack) | Browsing scenes, exploring the emotional architecture, arc navigation |
| \`book_command_center.html\` | Story overview + letters + AI excavation (HTML surface) | Quick story-state reference, letters-to-send view |
| \`chapter-reader/Abstrekkt Chapter Reader.html\` | Multi-state chapter reader (8 visual treatments: chronology/sensory/construction/HUD/schematic/collage/forensic/blueprint) | Reading a single chapter draft in different visual registers |
| \`Corridor Archive Manifest.html\` + \`corridor/manifest.json\` | Full scene-archive browser — 111 records across corridor/memoir/construction/rupture/studio/writing/product/meta lanes, filterable by lane/perspective/variant/protected | Browsing every Stitch exploration (villains/virtues corridor states, chapter openings, excavation reports, visual-system studies) in one place |

**Jul 9, 2026 sync:** imported the full remaining set of \`stitch_memory_corridor_studio/\` scene folders from the working-files upload (55 folders previously missing — corridor motion/pulse variants, hardware audits, manifesto variants, moment-studio sub-screens, ~20 pure visual-system studies) and registered them all in \`corridor/manifest.json\` (66 → 111 records). Added a \`meta\` lane for book-craft/visual-system tools that aren't narrative scenes. Four folders (\`the_brutalist_archive\`, \`obsidian_embers\`, \`structural_narrative\`, \`reading_room_at_midnight\`) are DESIGN.md-only alternate palette notes, not renderable scenes — copied for reference but intentionally left out of the gallery.

**Jul 13, 2026 — \`book_command_center.html\` visual-system flag closed:** this file runs its own neon palette (orange/cyan/purple, Bebas Neue/DM Sans) — not Brutalist Archive, not Reading Room. Ruling: **internal operator tools are exempt from the brand-facing token binding.** The hybrid policy under *Lane: Abstrekkt Studio Marketing* governs reader/public-facing surfaces; ops consoles (this file, FlashFusion Console, Operator Console, Audit pages) have always carried their own purpose-built palettes and that's fine — they're workbenches, not brand surfaces. No restyle needed; leaving as designed.

**STALE — retired Jul 2026:**
- \`memoir-project-hub.jsx\` — removed from project
- \`memoir-command-center.jsx\` · \`memoir-hub-v3.jsx\` — functions absorbed by \`abstrekkt-author-hub.jsx\`; source recoverable from knowledge index if needed

**Aug 11, 2026 — \`memoir_engine.html\` REVIEW resolved (archive branch):** carried a "REVIEW — absorb into author hub or archive" flag with no ground-truth check behind it. Sitewide grep for inbound links (\`.html\`/\`.jsx\`/\`.md\`) turned up zero references anywhere in the live project — same orphaned status as \`memoir-command-center.jsx\`/\`memoir-hub-v3.jsx\` above, which already went the archive route. Renamed to \`memoir_engine_archive_2026-07.html\` per §2; no content changes, no feature-parity diff against \`abstrekkt-author-hub.jsx\` performed — if it turns out the hub is missing something this surface had, recover from this archive copy or the knowledge index.

---

### Lane: Abstrekkt Studio Marketing

| Canonical file | Purpose | When to use |
|---|---|---|
| \`Abstrekkt Home.html\` | Studio marketing home | Primary landing page |
| \`Abstrekkt Founder.html\` / \`Abstrekkt Founder v2.html\` | Founder story page — v2 adds Spine/Career-Arc/Memoir sections | v2 is the fuller version; v1 kept live pending a decision to retire it — REVIEW |
| \`Abstrekkt Pillars.html\` | The Construction Manifesto (8 tenets) | Manifesto reference, linked from nav everywhere |
| \`Abstrekkt Contact.html\` | Contact / intake form | "Start where you are" destination |
| \`Abstrekkt Splash.html\` | Cinematic video/audio splash gate | Pre-Home entry screen |
| \`Abstrekkt Voice.html\` | Voice source-of-truth + generation system prompt | Drafting any Abstrekkt-voice copy |
| \`Abstrekkt Search.html\` + \`abstrekkt/search-app.jsx\` | Archive search (React) | Searching the personal archive corpus |
| \`Abstrekkt Design.html\` | Separate "AI Assessment" design-system demo (React, \`screens/*.jsx\`) | Unclear relationship to the studio site — REVIEW |
| \`Abstrekkt Brand System.html\` | Brutalist Archive brand specimen page | Token/component reference for this lane |
| \`abstrekkt/nav-toggle.js\` | Shared mobile-nav disclosure behavior (hamburger open/close) | Loaded by every page with a \`header.nav\` + \`.nav-links\` |
| \`Abstrekkt Studio Landing.html\` | Consulting-studio marketing landing ("Clarity isn't simple. It's constructed." — Strategy/Communication/Systems, Book Advisory/Start a Brief) built against the bound \`_ds/\` Reading Room at Midnight bundle per Kyle's directly-edited reference mock (\`uploads/clarity-its-simple-constructed.png\`) | Studio/consulting positioning — **not** a replacement for \`Abstrekkt Home.html\`, which stays live with its own "Construction, not recovery" peer-support positioning and Brutalist Archive tokens |

**Aug 11, 2026 — ground-truth check on two open REVIEW flags in this lane (no disposition changed, findings only):**
- \`Abstrekkt Founder.html\` (v1) is **not** a stale orphan — verified via \`href=\` grep (not just filename mentions) it's genuinely hyperlinked from \`Abstrekkt Home.html\`, \`Abstrekkt Pillars.html\`, \`Abstrekkt Contact.html\`, \`Tax the Damage.html\`, \`Index.html\`, and \`Abstrekkt Founder v2.html\` itself. \`Abstrekkt Founder v2.html\` has exactly one genuine inbound \`<a href>\`, from \`Index.html\` — the two \`Audit -\` pages only *mention* its filename as plain text inside chip/item markup, not as a link (\`Audit - Ecosystem, Jul 8.html\` says outright that v2 is "reachable only through the Index"). Retiring v1 in favor of v2 means repointing five live nav links — an active editorial/content decision, not bookkeeping. Leaving REVIEW as-is for Kyle rather than resolving unilaterally.
- \`Abstrekkt Design.html\` has exactly one inbound link sitewide, from \`Index.html\` (a sitemap/index page — weak evidence of active use, not proof of orphan status either). Relationship to the studio site remains genuinely unclear; REVIEW left open.

**Jul 11, 2026 — first Reading Room at Midnight build in this lane:** built from Kyle's edited reference image, using the real \`_ds/\` component bundle (Button/Card) rather than recreating look-alike markup. Deliberately net-new, not a restyle of \`Abstrekkt Home.html\` — that file's copy is a different product narrative (peer support / no-baseline-required) and wasn't touched. This makes the design-system conflict flagged below concrete rather than hypothetical: this lane now has one live page in each system. Still not resolved — see the flag.

**Jul 10, 2026 — responsive + accessibility pass (pilot lane):** added a working mobile nav
(hamburger disclosure, was \`display:none\` with no alternative below 720px) to all
\`header.nav\` pages; skip-links; visible focus rings on inputs/buttons that previously
suppressed \`:focus\`; 44px touch targets on mobile; \`prefers-reduced-motion\` safety net
everywhere (Splash's autoplay video/audio now freezes on a still frame instead of looping);
raised \`--t4\`/\`--t5\` token values so small mono text and "ghost" headline text clear WCAG AA
(were 3.46:1 / 1.63:1 on the dark bg, now 5.6:1 / 3.4:1); fixed a dead \`<button>\` CTA and a
self-referential \`href="#"\` link on Pillars; added \`aria-current\`/icon-button labels/live
region on Search. Did **not** touch \`abstrekkt-tokens.css\` (a separate, unused Load-Bearing
token set) or the \`_ds/abstrekkt-design-system-*\` ink-and-brass bundle — neither is loaded by
any page in this lane; the lane's actual, working visual system is the inline Brutalist
Archive tokens per \`CLAUDE.md\`. Remaining lanes (FlashFusion, Load-Bearing, Midnight Academy,
Kyle Rosebrook personal, Memoir/Corridor incl. the stitch scene archive) are queued next.

---

### Lane: Kyle Rosebrook Personal

| Canonical file | Purpose | When to use |
|---|---|---|
| \`Kyle Rosebrook Home.html\` | Personal site home (\`kr/kr.css\` system) | Primary entry point — linked from dozens of essay navs/colophons and from \`Abstrekkt Home.html\` ("Journal") |
| \`Kyle Rosebrook About.html\` / \`Essays.html\` / \`Tools.html\` / \`Case Files.html\` / \`Contact.html\` / \`Now.html\` / \`Notes.html\` / \`Principles.html\` / \`Reading List.html\` / \`Research Threads.html\` / \`Active Drafts.html\` / \`Decision Matrix.html\` | Full site sections | All share \`kr/kr.css\`; do not fork a new homepage or nav system |
| \`Sedona - The Meditation Pivot.html\` | Photo essay, real Sedona photography | Linked from the shared \`ks-nav\` essay template as "Sedona" |
| \`LLC Formation Kit.html\` | FlashFusion-only formation toolkit (Chaos Club Co. lane removed) | Linked from the shared \`ks-nav\` essay template as "Toolkit" |

**Jul 11, 2026 — domain + duplicate resolution:** \`kylerosebrook.com\` is confirmed dead; identity is \`abstrekkt.com\` (per \`Abstrekkt Voice.html\`) everywhere live. Swept the one remaining live reference (\`corridor/manifest.json\` writing-lane blurb). Resolved \`Audit - Ecosystem, Jul 8.html\` E-04 ("two homepages"): \`Kyle Rosebrook Home.html\` is canonical; \`Kyle Rosebrook Homepage.html\` (zero inbound links, stale Chaos Club Co. claim) archived to \`Kyle Rosebrook Homepage_archive_2026-07.html\`. Re-uploaded drafts this session (\`kylerosebrook-v4\`, \`about-page\`, \`moving-in-silence-was-phase-one\`, \`llc-formation-kit\`) are superseded duplicates of already-canonical, already-fixed pages in this lane — not rebuilt.

**STALE:**
- \`Kyle Rosebrook Homepage_archive_2026-07.html\` — superseded by \`Kyle Rosebrook Home.html\`; kept for reference only, not linked

**✓ RESOLVED — Jul 13, 2026, hybrid policy (interim, until Kyle rules definitively):** two systems exist — CLAUDE.md's **Brutalist Archive** (carbon \`#131315\`/\`#0A0A0C\`, amber \`#ffbf00\`/\`#ffe2ab\`, EB Garamond/Literata/JetBrains Mono) and the bound \`_ds/abstrekkt-design-system-00b28ec4-...\` **Reading Room at Midnight** (ink \`#0d0c0a\`, brass \`#C8A86A\`, Fraunces/Crimson Pro/JetBrains Mono). Rather than pick a winner or mass-restyle, the two are kept as **separate, non-mixing registers**:
- **Existing corpus (all ~182 pre-Jul-13 files) stays on Brutalist Archive.** No silent restyle. This is the identity readers/journalists/pitches already saw.
- **\`_ds/\` Reading Room bundle is reserved for net-new Studio-lane builds** that explicitly load the bundle — treat it as this lane's "quiet variant," not a replacement. As of Aug 11, 2026, three files genuinely load it via \`<link>\`/\`<script>\` tags: \`Abstrekkt Studio Landing.html\` (the original), \`Abstrekkt Operator Console.html\`, and \`Repository Operations Hub.html\` (registered Aug 11, 2026 — see Operations & Handoff lane). A fourth file, \`Audit - Full Corpus, Jul 13.html\`, only *mentions* \`_ds/\` in prose describing this policy — it does not load the bundle. Sitewide grep for the \`_ds/\` substring in \`.html\` files confirms no others beyond these four occurrences.
- **Never mix token sets in one file.** A page either loads \`_ds/\` and uses its components, or defines Brutalist Archive tokens inline — not both.
- Both share the same structural DNA (dark ink base, single warm accent, serif display + mono meta) so cross-lane visits don't feel like different brands, just different rooms of the same studio.
- This is the working default for this audit pass. Still flagged for a real founder ruling — revisit if Kyle wants one system going forward.

---

### Lane: FlashFusion Business & Product

| Canonical file | Purpose | When to use |
|---|---|---|
| \`FlashFusion Business Plan.html\` | Internal business plan (Chicago consulting practice: 3 pricing pillars, Diagnostic Spine framework, ops cadence) | Planning reference — not for external distribution |
| \`FlashFusion PRD - Strategic Expansion Engine.html\` | PRD for the internal Strategic Expansion & Triage Hub (F1–F4 + non-functional/security reqs), each feature with an explicit "Data needed to go live" block | Scoping the real build; each F# maps 1:1 to a Console tab |
| \`FlashFusion Strategic Expansion Console.html\` | Working prototype of the Hub — 4 tabs (Intelligence Feed / Validation Matrix / Growth OS radial dashboard / Compliance Workbench), explicit sample-data badge, matching "Data needed to go live" callout per tab | Reviewing the shape of the internal tool before real data sources are wired |
| \`FlashFusion Services.html\` | Public services & pricing page (same 3 tiers, Diagnostic Spine, hours) | Linked from \`FlashFusion Blog.html\` masthead nav — the site's actual Services destination |

All four use \`colors_and_type.css\` (the versioned, self-hosted-font FlashFusion token system) or its exact hex/font values inline for print — not the one-off inline token sets several older \`FlashFusion - *.html\` essays carry (Poppins-based, slightly different violet/cyan values). Treat \`colors_and_type.css\` as canonical for any new FlashFusion artifact; the essay-level drift is a pre-existing condition, not something this pass fixed.

**Jul 11, 2026 — registered + cross-linked (previously unregistered):** all four files already existed, fully built, correctly brand-corrected (Abstrekkt→FlashFusion) — not rebuilt. Added the missing cross-links: \`Services\` into \`FlashFusion Blog.html\`'s masthead nav and footer (it was an orphan page, unreachable from the site); Business Plan ↔ PRD ↔ Console footer/header links (the three internal docs referenced each other only by name, not by hyperlink).

**✓ RESOLVED — Jul 13, 2026, founder decision:** FlashFusion is a **consulting practice** — Kyle teaches how to build software, with "disposable software" (his coined term, gaining traction) as the flagship teaching concept. The Business Plan/PRD/Console/Services quartet is canonical. \`FlashFusion - Anthropic Partner Narrative.html\` (the Claude-native SaaS product company narrative — "Compliance Copilot," \`.ai\` domain) does not reflect the current model — archived per CANON §2 naming convention.

**⚠ EXTERNAL SOURCE, corrected Jul 13, 2026 — \`ChaosClubCo/Invelo-v1.5\` (GitHub):** a real, fully-built React/Vite/Tailwind site for **Intinc**, showcasing its **Invelo** service line (Catalyst Builds like SOC 2 Sprint / Onboarding Accelerator, case-study carousel, named testimonials, 20-year heritage framing). Own brand: Navy \`#0A192F\` / Gold \`#C5A059\` / Teal \`#2D5A5A\` / Cream \`#F9F8F4\` — distinct from both Abstrekkt and this project's FlashFusion (void/purple/pink/cyan). The repo happens to also self-describe as "FlashFusion, an AI services company" — coincidental name collision with this project's FlashFusion, not the same entity.
**Authorship vs. business facts — the actual distinction:** Kyle built this — the branding, the positioning, the why/how — as Intinc's employee. That authorship is legitimately his to credit (portfolio/resume-style, in the Kyle Rosebrook Personal lane) — e.g. "designed & built brand + site for Invelo while at Intinc." What is **not** his to carry over: the underlying business facts (20-year heritage, client testimonials, case-study metrics, revenue) belong to Intinc as a company, not to Kyle's own FlashFusion consulting practice. Those facts stay Intinc's, even though Kyle did the work. See \`Invelo Options.html\`, updated accordingly.

---

### Lane: Press & Pitch

| Canonical file | Purpose | When to use |
|---|---|---|
| \`pitch_console.html\` | Pitch database: static journalist entries, targets, status | Reviewing all pitches, picking a target, updating status |
| \`pitch_generator.html\` | Claude API pitch generator (uses PITCHES from console as context) | Generating/drafting a pitch to a new target |
| \`dispatch.jsx\` | Quick-post dispatcher — Drive search, self-healing API (3-retry + mock fallback), client mode, tone control | Drafting short FlashFusion/AI-tooling posts from build notes |
| \`playbook.html\` | Public vibe-coding playbook page (kyle.abstrekkt.com/playbook) — Gate 2 for all press sends | Deploy target; source of truth is \`vibe-coding-playbook-web.md\` — patch both together |
| \`kyle-abstrekkt-index.html\` | kyle.abstrekkt.com root — one-screen identity card (+ Tweaks: hero voice ×3 / depth / ember) | Deploys as \`/index.html\`; extends only when a linked thing is live (no promises) |
| \`press-kit.html\` | kyle.abstrekkt.com/press — press kit: what-to-call-him, 2 bios, three walled story lanes (A operator / B construction / C lived experience) with in/out-of-scope rules, sourced fact sheet, arc timeline, headshot slot, contact ground rules | The corroboration target for memoir/recovery pitches; clinical claims sourced to \`the-evidence-board.md\` + \`assets/clinical-source/\` only |
| \`domain-map.html\` | INTERNAL — abstrekkt.com property architecture: subdomain → in-project files → launch gate, press routing table, launch order | Planning which property ships next; answers "what deploys where" |
| \`deploy/kyle-abstrekkt-com/\` + \`deploy/README.md\` | Production deploy package for kyle.abstrekkt.com — generated copies of the three canonicals as \`index.html\` / \`playbook/\` / \`press/\` + \`404.html\`, with in-project design tooling stripped (Tweaks/React/Babel, image-slot → static frame) | Uploading the press landing. GENERATED — never edit the copies; edit the root canonicals and regenerate. README carries Kyle's upload/DNS/mailbox steps |

**Jul 12, 2026 (pm) — deploy package:** generated \`deploy/kyle-abstrekkt-com/\` from the three press-landing canonicals. Deliberate deltas from source: index drops the Tweaks panel + React/Babel CDN scripts (chosen tweak values were already the static defaults); press swaps the \`<image-slot>\` headshot for a static "PHOTO — ON REQUEST" frame (no drag-drop UI in production; regenerate when Kyle drops the real photo); playbook masthead/footer links made root-relative so staging previews work. Root canonicals remain the only editable source of truth.

**Jul 12, 2026 — domain architecture + press kit (post-interview):** Kyle's property plan captured in \`domain-map.html\`: root = studio, kyle. = press landing, blog. = existing Kyle Rosebrook site, memoir./music./hovav. = walled lanes, flashfusion.co separate. All 39 pitch signatures standardized \`abstrekkt.com\` → \`kyle.abstrekkt.com\` (colophon, lock-warning, and sourced-facts Site: line included; \`kyle@abstrekkt.com\` addresses untouched). Index card gained the \`/press\` link + a Tweaks panel. New press-facing pages use the lane's existing ink/ember tokens (Fraunces/Crimson Pro/JetBrains Mono per \`kyle-abstrekkt-index.html\`) — NOT a ruling on the Brutalist-Archive-vs-Reading-Room conflict flagged above, which stays open. Press kit deliberately omits: "homeless" (evidence board says living with parents — discrepancy flagged to Kyle), "11 attempts at associates" (no evidence-board entry yet), and Chaos Club Co. (retired Jul 2026 per evidence board, which contradicts the still-open Taylor Six pitch — flagged, not resolved).

**STALE — do not use:**
- \`dispatch_archive_2026-07.jsx\` — was v2 (WCAG pass); superseded by \`dispatch.jsx\` (was v6)
- \`pitch_console_bak.html\` deleted ✓ · \`dispatch-v3.jsx\` removed from project ✓ Jul 2026

---

### Lane: Content & Publishing

| Canonical file | Purpose | When to use |
|---|---|---|
| \`content-engine.jsx\` | Voice foundation + Claude API content generator | Drafting FlashFusion essays/posts from scratch with voice enforcement |
| \`editorial-framework.html\` | Editorial framework: content types, format rules, publishing criteria | Planning content, checking what's in-scope vs out-of-scope |
| \`publishing_command_center.html\` | 5 publishing paths + 4 reader personas + pitch/letters | Path decisions, persona targeting — carries v2 content |
| \`voice-audit.jsx\` | Voice audit tool: paste text, get voice-alignment score + notes | Checking a draft before publishing |

**STALE:**
- \`publishing_command_center_archive_2026-07.html\` — was the \`_v2\` canonical; content promoted to the suffix-free name above

---

### Lane: Load-Bearing

| Canonical file | Purpose | When to use |
|---|---|---|
| \`Load-Bearing Home.html\` | Sub-brand essay index ("AI Tools, Tested Under Load") | Landing page for the Load-Bearing editorial line |
| \`Load-Bearing Archive.html\` / \`Load-Bearing Bench.html\` / \`Load-Bearing Subscribe.html\` | Archive listing / about ("Bench") / subscribe | Full site sections, share \`loadbearing/site.css\` |
| \`Load-Bearing - Claude Code at Ninety Days.html\` / \`- Make vs n8n.html\` / \`- The MCPs That Earned Their Keep.html\` / \`- When the Stack Falls Over.html\` | The four published essays in the "Tested Under Load" series | Essay content |
| \`Load-Bearing Catalog.html\` | Stitch-style 83-screen design catalog (\`<title>Load-Bearing Catalog, 83 Screens</title>\`) — a visual-system reference, not editorial content. Hyperlinked from \`Load-Bearing Archive.html\`, \`Load-Bearing Bench.html\`, and \`Index.html\` | Browsing screen variants; distinct purpose from the essay series, not a duplicate |
| \`Load-Bearing Article.html\` | A fifth essay ("The brittle nature of local-first LLMs, Load-Bearing") not currently listed among the four "Tested Under Load" essays above. Hyperlinked only from \`Index.html\` — not from \`Archive.html\`/\`Bench.html\`, which link \`Catalog.html\` instead | REVIEW — whether this is a 5th published essay pending addition to the series list, or held back deliberately, is a publishing-status call; overlaps with the open D10 decision (see \`canon-sync-ops.md\`) — not resolved here |

**Jul 13, 2026 — registered (previously unregistered), first-pass audit:** existed fully built, not previously in this table. \`Load-Bearing Home.html\` footer carries two \`href="#"\` placeholders (Privacy/Terms) — acceptable as not-yet-written policy pages, not treated as a bug.

---

### Lane: Midnight Academy

| Canonical file | Purpose | When to use |
|---|---|---|
| \`Midnight Academy Suite Hub.html\` | Command-center dashboard — metrics + action items + module grid | Entry point, links to all 7 other tools |
| \`Midnight Academy Enablement Flow.html\` / \`Intake Form.html\` / \`Prompt Builder.html\` / \`Service Guide.html\` / \`Outcome Tracker.html\` / \`Accountability.html\` / \`Objection Handler.html\` | The 7 module tools linked from the Suite Hub | Each maps to one sidebar/module-grid entry |

**Jul 13, 2026 — registered (previously unregistered) + one fix:** Suite Hub's metrics badge read "Live Data" over static mock numbers (142 onboarded, $1.2M ROI recovered) — same misleading-sample-data pattern already flagged and corrected in the FlashFusion Console (which uses an explicit sample-data badge). Changed to "Sample Data" for consistency. Sidebar Settings/Support links and three Action-Required rows still use \`href="#"\` — this hub has no backing data source yet, so those are legitimately unbuilt, not broken.

---

### Lane: FlashFusion Delivery (relocated Jul 2026)

The Claude Enablement Suite (\`00-suite-hub.jsx\` through \`06-objection-handler.jsx\`)
no longer lives in this project. ASSUMED relocated to the FlashFusion delivery
context during the Jul 7 lane reorganization — not deleted. If that assumption
is wrong, restore from knowledge index. Known open defect carried with it:
\`00-suite-hub.jsx\` has a React hook violation; fix before production deploy.

---

### Cross-lane reference

| Canonical file | Purpose | When to use |
|---|---|---|
| \`abstrekkt-tokens.css\` | Abstrekkt design tokens (midnight ink/ember) | Drop-in base for any new artifact. Never infer tokens. |
| \`design.md\` | Load-Bearing design contract (5-screen newsletter) | Load-Bearing build reference |
| \`project-focus-evolution.html\` | Career/project evolution timeline | Narrative reference for pitches and About copy |
| \`char-diagnostic-instinct.md\` | The diagnostic instinct character profile | Voice/origin reference for scripts and pitches |
| \`kyle-origin-video-scripts.md\` | Origin story scripts (YouTube / LinkedIn / TikTok) | Video recording reference, updated with piano/pattern beat. \`uploads/kyle-origin-video-scripts-v4.md\` is a leftover source-dump copy under the same v4 name, not a live duplicate — same treatment as the other \`uploads/\`-only source originals in this table |
| \`abstrekkt-author-hub.jsx\` | Author command center — memoir/pitch/content/canon, one surface | Session entry point for author-lane work |
| \`antigravity-build-prompts.md\` | Antigravity build-prompt reference | Drafting build prompts for new artifacts; also present verbatim in \`uploads/\` as the sourced original — root copy is the live/editable one |
| \`stitch-prompts.md\` | Stitch export-prompt reference | Drafting Stitch scene-export prompts; also present verbatim in \`uploads/\` as the sourced original — root copy is the live/editable one |
| \`uploads/writing-fixer.jsx\` | Writing-fixer utility, source-package-only | Reference only — lives solely in \`uploads/\` (the flat Jul 11 portable-package dump), not deployed as a standalone root artifact. Registering here rather than leaving it as a false "live but unregistered" claim |
| \`voice_map.jsx\` | Voice analysis across lanes (essay/lyrics), self-healing API | Mapping voice signatures across writing lanes |
| \`the-evidence-board.md\` | Evidence board — memoir source ledger | Cross-checking memoir claims against primary sources |
| \`assets/clinical-source/\` | Primary clinical documents (SPECT scan renders ×4, Amen Clinics eval, TBR cognitive assessment, CPT3, sleep scale, brain-system handout) | Grounding evidence-board claims in the actual source docs; financial/insurance paperwork from the same upload was deliberately excluded |
| \`kyle_docs_readable.txt\` | Historical compilation (Apr 2026) | Reference only — claims inside are dated; never treat as current state (Butler rule) |

**STALE:**
- \`project-focus-evolution_archive_2026-07.html\` — was the \`_v2\` canonical; content promoted to the suffix-free name above

**REVIEW list resolved Aug 11, 2026 (ground-truth check against disk):** of the 6 files previously listed here, \`voice-generator.html\`, \`kyle_brilliant_moments.html\`, and \`matt-wolfe-tldr.html\` no longer exist anywhere in the project tree — sitewide \`find\` turned up nothing; dropped from this list rather than left as a stale claim. \`writing-fixer.jsx\`, \`antigravity-build-prompts.md\`, and \`stitch-prompts.md\` do exist and are now registered above (Cross-lane reference table).

**Aug 11, 2026 — \`abstrekkt-author-hub.jsx\` CANON-drift mechanism closed:** the hub's \`CanonTab()\`
previously hardcoded a parallel copy of this table (\`CANON_TABLE\`/\`STALE\` arrays) — third drift
incident per \`canon-sync-ops.md\`. Replaced with a single pasted \`CANON_SOURCE\` block (verbatim
copy of §1, from this heading through the divider before §2) parsed client-side by
\`parseCanonSource()\`. Future syncs: finish editing §1 first, then paste it into \`CANON_SOURCE\` —
in that order, so the pasted copy includes its own sync notes instead of omitting itself. See
\`canon-sync-ops.md\` for the parser spec.

---

### Lane: Abstrekkt Operations & Handoff Package

| Canonical file | Purpose | When to use |
|---|---|---|
| \`Abstrekkt Operator Console.html\` + \`operator-console/*\` | Interactive console rendering the Jul 11, 2026 portable project package (\`uploads/README.md\` + 30 registers/briefs — executive summary, Milestone-0 tracker, roadmap, business/product requirements, system architecture, 9 decision/risk registers, handoff docs) | Tracking the pre-revenue gate (B-1..B-5), checking Milestone 0/1/2 acceptance criteria off, browsing the risk/decision/contradiction registers, resuming work in a fresh AI session |
| \`Repository Operations Hub.html\` | Single-file React field-notes reference for repository lifecycle operations — creation, upgrade/maintenance, observability, agents, MCP servers, webhooks, mapping/architecture, org. Built on the \`_ds/\` Reading Room bundle's components. The design open at handoff export; the root \`README.md\` handoff note names it as the primary design | Orienting a coding agent entering via the handoff note; referencing repo-ops patterns (lifecycle, observability, agent/MCP/webhook wiring) before implementing them for real |

**Jul 11, 2026 — built from the portable package, incorporating Kyle's direct edits to the source \`.md\` files.** The uploads package (generated by Claude Cowork from the 225-doc KB) existed only as flat markdown in \`uploads/\`, no live counterpart in this project. Built as one interactive console rather than a flat document render so the Milestone-0 checklist and the 9 registers (decisions, contradictions, risks, gaps, bottlenecks, blindspots, failure modes, unknown-unknowns, open loops) are actually usable, not just read — checklist state persists per-browser via localStorage. Did not alter any existing FlashFusion/LLC-kit canonical file. Where the package's own Contradiction Log flags something the live project already resolved — C-2, the obsolete "Chaos Club Co. LLC" two-entity plan — that's already fixed in \`LLC Formation Kit.html\` per the Jul 8 audit fix log; the console reports the package's finding as-is (this registry entry is the cross-reference, the package source wasn't edited). This lane is Kyle-owned business/legal fact, not design content — do not "resolve" a flagged contradiction (Ryan $ amount, chaosclub.co naming, cert name) on Kyle's behalf; those stay open pending Kyle.

**Aug 11, 2026 — registered \`Repository Operations Hub.html\` (previously live but unregistered).** The root handoff \`README.md\` names this file as the design open at export — the primary design of the handoff — yet it had no registry entry, violating §4 ("any artifact not in this table doesn't exist officially"). Registered as-is; no content edits. It loads the \`_ds/\` Reading Room bundle (tokens + \`_ds_bundle.js\` components), which is worth knowing before assuming the Studio-lane \`_ds/\` usage notes elsewhere in this file are exhaustive.

**STALE:** none.

---
`;

// Parses CANON_SOURCE into { laneOrder, rows, stale } for CanonTab(). Only
// understands the two shapes that tab renders — lane-header + table-row, and
// **STALE...** + bullet — everything else (dated notes, dividers, REVIEW prose)
// is intentionally skipped, not a parsing gap.
function parseCanonSource(src) {
  const lines = src.split("\n");
  const laneOrder = [];       // every lane header, in document order, even zero-row lanes
  const rows = [];            // { lane, file, what, use }
  const stale = [];           // { file, why } or { raw } (fallback for irregular bullets)
  let currentLane = null;
  let inStale = false;

  for (const raw of lines) {
    const line = raw.trim();

    const laneMatch = line.match(/^###\s+(?:Lane:\s*)?(.+)$/);
    if (laneMatch) {
      currentLane = laneMatch[1].trim();
      laneOrder.push(currentLane);
      inStale = false;
      continue;
    }

    const staleHeader = line.match(/^\*\*STALE\b[^*]*\*\*\s*(.*)$/i);
    if (staleHeader) {
      inStale = staleHeader[1].trim() === "";  // self-closing lines (e.g. "none.") stop here
      continue;
    }

    if (inStale) {
      const bulletMatch = line.match(/^-\s+(.*)$/);
      if (bulletMatch) {
        const clean = bulletMatch[1].replace(/`/g, "");
        const m = clean.match(/^(.+?)\s+—\s+(.+)$/);  // split on em-dash only — filenames use plain hyphens
        if (m && !clean.includes("·")) {
          stale.push({ file: m[1].trim(), why: m[2].trim() });
        } else {
          stale.push({ raw: clean });
        }
        continue;
      }
      if (line === "" || line.startsWith("#") || line.startsWith("---") || line.startsWith("**")) {
        inStale = false;
      }
    }

    if (currentLane && /^\|.*\|$/.test(line) && !/^\|[\s\-:|]+\|$/.test(line)) {
      const cells = line.slice(1, -1).split("|").map(c => c.trim().replace(/`/g, ""));
      if (cells.length === 3 && cells[0] !== "Canonical file") {
        rows.push({ lane: currentLane, file: cells[0], what: cells[1], use: cells[2] });
      }
    }
  }

  return { laneOrder, rows, stale };
}

const { laneOrder: CANON_LANES, rows: CANON_ROWS, stale: CANON_STALE } = parseCanonSource(CANON_SOURCE);

// ─── DATA: ARTICLES ───────────────────────────────────────────────────────────
// Foundation Series — sourced from voice-generator.html / content-engine.jsx
// STATE.md Jul 7 2026: posts 01–04 complete/published; 05 gated (tool-retirements list)
const FOUNDATION = [
  { num:"01", title:"The agent doesn't know your files are a mess", angle:"System hygiene before agents. What your setup needs to look like before you hand it to one.", status:"published" },
  { num:"02", title:"Fifty skills, what held",                       angle:"Skills-library lessons at scale. Which patterns survived, which collapsed, the fix-before-expand rule.", status:"published" },
  { num:"03", title:"Skills as the human layer",                     angle:"What skills actually encode — the judgment a model doesn't have. From your own library, not theory.", status:"published" },
  { num:"04", title:"Negative vs positive skill instructions",       angle:"What works when you tell a model what NOT to do vs what to do. Tested, not assumed.", status:"published" },
  { num:"05", title:"The adoption math",                             angle:"Why AI adoption stalls where it does. The real numbers from getting people to actually use the tools.", status:"gated", gate:"Needs tool-retirements list first" },
  { num:"06", title:"The one-API-call backend",                      angle:"How far one model call gets you before you need real infrastructure. The honest ceiling.", status:"produced" },
  { num:"07", title:"The assembly problem",                          angle:"Why stitching AI tools together is the hard part nobody scopes. What breaks at the seams.", status:"produced" },
  { num:"08", title:"The closer — what the series was really about", angle:"The throughline across all eight. The thesis the individual essays were circling.", status:"produced" },
];

const ESSAY_STATUS = {
  published: { label:"PUBLISHED", color: T.success   },
  produced:  { label:"PRODUCED",  color: T.accentText },
  gated:     { label:"GATED",     color: T.warning    },
  draft:     { label:"DRAFT",     color: T.info       },
  "not-started": { label:"NOT STARTED", color: T.textMuted },
};

// Memoir Arc — 12-essay series (sourced from kyle_docs / voice-generator)
// Runs parallel to memoir chapters — essays as flesh-pass, chapters as polish-pass expansion
const MEMOIR_ARC = [
  { num:"01", title:"The last shift",                          mode:"scene-led",       status:"not-started", act:"I" },
  { num:"02", title:"Service was not a lesser art",            mode:"reflective",      status:"not-started", act:"I" },
  { num:"03", title:"The quality of things",                   mode:"scene+reflection",status:"not-started", act:"I" },
  { num:"04", title:"Ceilings you don't see until you hit them",mode:"quiet/structural",status:"not-started", act:"I" },
  { num:"05", title:"The first useful sentence",               mode:"scene-led",       status:"not-started", act:"II" },
  { num:"06", title:"Apprentice years, compressed",            mode:"process/montage", status:"not-started", act:"II" },
  { num:"07", title:"Hired into a room you have no credentials for", mode:"scene+dialogue", status:"not-started", act:"II" },
  { num:"08", title:"The hands you build with",                mode:"essay/material",  status:"not-started", act:"II" },
  { num:"09", title:"What bartending taught me about software", mode:"essay/comparative",status:"not-started", act:"III" },
  { num:"10", title:"The lane without a lane",                 mode:"manifesto-adjacent",status:"not-started", act:"III" },
  { num:"11", title:"Tax the damage",                         mode:"essay/reckoning", status:"not-started", act:"III" },
  { num:"12", title:"Construction, not recovery",             mode:"closing manifesto",status:"not-started", act:"III" },
];

// Reading Room — personal long-form pieces (sourced from voice-generator.html)
const READING_ROOM_PIECES = [
  { title:"Why recovery is the wrong word",                      angle:"The distinction the whole thesis rides on. Recovery assumes something to return to. There wasn't." },
  { title:"The diagnostic instinct, across four jobs",           angle:"Bar → QC → engineering → reconstruction. Same skill, different substrate." },
  { title:"Building external memory for a brain that won't hold",angle:"99th-percentile processing, 12th-percentile recall. Tools as prosthetic cognition." },
  { title:"What the record costs, still",                        angle:"The ongoing tax — jobs, housing, custody. The real ledger." },
  { title:"Getting clean isn't the story people want",           angle:"The unglamorous mechanical reality. Not the before/after — the during." },
  { title:"The day someone gave a fuck",                         angle:"One specific person who didn't write you off. What they did. What it cost them." },
  { title:"Construction over recovery, from the bottom up",      angle:"The thesis where it was forged." },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const dot = (color) => ({
  display:"inline-block", width:7, height:7, borderRadius:"50%",
  background:color, flexShrink:0,
});

const mono = (extra={}) => ({
  fontFamily: FONTS.mono,
  fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase",
  ...extra,
});

const hairline = { borderBottom:`1px solid ${T.border}` };

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Kicker({ children, color }) {
  return (
    <span style={{ ...mono(), color: color || T.accentText }}>
      {children}
    </span>
  );
}

function Row({ children, hover=true, style={} }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0",
        ...hairline, cursor: hover ? "default" : undefined,
        background: h ? T.surface : "transparent",
        transition:"background 120ms",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{
      fontFamily:FONTS.display, fontSize:13, color:T.textMuted,
      letterSpacing:"0.04em", padding:"20px 0 8px",
      borderBottom:`1px solid ${T.borderHi}`, marginBottom:4,
      textTransform:"uppercase",
    }}>{children}</div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ["MEMOIR","PITCH & PRESS","CONTENT","ARTICLES","CANON"];

function TabBar({ active, onChange }) {
  return (
    <div style={{
      display:"flex", borderBottom:`1px solid ${T.border}`,
      background:T.sunken, padding:"0 24px", gap:0, overflowX:"auto",
    }}>
      {TABS.map(t => {
        const isActive = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            style={{
              ...mono({ fontSize:11, letterSpacing:"0.12em" }),
              background:"none", border:"none", cursor:"pointer",
              padding:"12px 16px",
              color: isActive ? T.text : T.textMuted,
              borderBottom: isActive ? `2px solid ${T.accentText}` : "2px solid transparent",
              marginBottom:"-1px", whiteSpace:"nowrap",
              transition:"color 120ms",
            }}
          >{t}</button>
        );
      })}
    </div>
  );
}

// ─── MEMOIR TAB ───────────────────────────────────────────────────────────────
function MemoirTab() {
  const locked    = CHAPTERS.filter(c => c.status === "locked").length;
  const excavated = CHAPTERS.filter(c => c.status === "excavated").length;
  const open      = CHAPTERS.filter(c => c.status === "not-started").length;
  const highPri   = EXCAVATION.filter(e => e.priority === "high").length;

  return (
    <div>
      {/* Stats strip */}
      <div style={{
        display:"flex", gap:24, padding:"16px 0 20px",
        borderBottom:`1px solid ${T.border}`,
      }}>
        {[
          { n: locked,    l:"Locked",      c: T.success   },
          { n: excavated, l:"Excavated",   c: T.accentText},
          { n: open,      l:"Not started", c: T.textMuted  },
          { n: highPri,   l:"High-pri queue", c: T.error   },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontFamily:FONTS.display, fontSize:28, color:c, lineHeight:1 }}>{n}</span>
            <Kicker color={T.textMuted}>{l}</Kicker>
          </div>
        ))}
      </div>

      {/* Chapter ledger */}
      <SectionHead>Chapter Status · {CHAPTERS.length} pieces</SectionHead>
      {CHAPTERS.map((ch, i) => {
        const s = STATUS_META[ch.status] || STATUS_META["not-started"];
        return (
          <Row key={i}>
            <span style={{ ...mono({ fontSize:10 }), color:T.textMuted, width:28, flexShrink:0, paddingTop:2 }}>{String(i).padStart(2,"0")}</span>
            <span style={{ ...mono({ fontSize:10, textTransform:"none", letterSpacing:0 }), color:T.textMuted, width:60, flexShrink:0, paddingTop:2 }}>{ch.part} · {ch.ch}</span>
            <span style={{ fontFamily:FONTS.body, fontSize:15, color:T.text, flex:1 }}>{ch.title}</span>
            <span style={{ ...mono({ fontSize:9 }), color:s.color, flexShrink:0, paddingTop:3 }}>{s.label}</span>
          </Row>
        );
      })}

      {/* Excavation queue */}
      <SectionHead>Excavation Queue — {EXCAVATION.filter(e=>e.priority==="high").length} high priority open</SectionHead>
      {EXCAVATION.map((e, i) => (
        <Row key={e.id}>
          <span style={{ ...mono({ fontSize:10 }), color:T.textMuted, width:24, flexShrink:0, paddingTop:2 }}>{i+1}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONTS.body, fontSize:15, color:e.priority==="high" ? T.text : T.textSec }}>{e.title}</div>
            <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:2 }}>{e.note}</div>
          </div>
          <Kicker color={e.priority==="high" ? T.error : T.warning}>{e.priority}</Kicker>
        </Row>
      ))}

      {/* Tool routing */}
      <SectionHead>Memoir Tools</SectionHead>
      {[
        { file:"memoir-explorer.jsx",          when:"Visual arc nav, scene browsing" },
        { file:"book_command_center.html",     when:"Quick story-state, letters-to-send" },
      ].map(({ file, when }) => (
        <Row key={file}>
          <span style={{ fontFamily:FONTS.mono, fontSize:12, color:T.accentText, flex:"0 0 260px" }}>{file}</span>
          <span style={{ fontFamily:FONTS.body, fontSize:14, color:T.textSec }}>{when}</span>
        </Row>
      ))}
    </div>
  );
}

// ─── PITCH & PRESS TAB ────────────────────────────────────────────────────────
function PitchTab() {
  const ready = PITCHES.filter(p => p.status === "ready").length;
  const total = PITCHES.length;

  return (
    <div>
      <div style={{ display:"flex", gap:24, padding:"16px 0 20px", borderBottom:`1px solid ${T.border}` }}>
        {[
          { n: ready, l:"Ready to send", c: T.success  },
          { n: total - ready, l:"In draft", c: T.warning },
          { n: total, l:"Total targets", c: T.accentText },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontFamily:FONTS.display, fontSize:28, color:c, lineHeight:1 }}>{n}</span>
            <Kicker color={T.textMuted}>{l}</Kicker>
          </div>
        ))}
      </div>

      {/* Gate reminder */}
      <div style={{
        background: T.surface,
        border:`1px solid ${T.warning}`,
        borderRadius:4, padding:"10px 14px",
        margin:"16px 0",
        fontFamily:FONTS.body, fontSize:14, color:T.warning,
      }}>
        ⚠ Press send gate: Load-Bearing needs a live URL before any pitch sends. kyle@abstrekkt.com DNS must be verified (MX/SPF/DKIM/DMARC). Revenue-beat journalists (Breen, Sherry) hold until August.
      </div>

      <SectionHead>Pitch Ledger</SectionHead>
      <div style={{ ...mono({ fontSize:10, color:T.textMuted }), display:"grid", gridTemplateColumns:"32px 32px 1fr 120px 70px", gap:"0 12px", padding:"6px 0 6px", borderBottom:`1px solid ${T.borderHi}` }}>
        <span>#</span><span>NUM</span><span>PUBLICATION</span><span>BRAND</span><span>STATUS</span>
      </div>
      {PITCHES.map((p, i) => {
        const s = PITCH_STATUS[p.status];
        return (
          <div key={p.num} style={{
            display:"grid", gridTemplateColumns:"32px 32px 1fr 120px 70px",
            gap:"0 12px", padding:"9px 0", borderBottom:`1px solid ${T.border}`,
            alignItems:"start",
          }}>
            <span style={{ ...mono({ fontSize:10 }), color:T.textMuted }}>{String(i+1).padStart(2,"0")}</span>
            <span style={{ ...mono({ fontSize:10 }), color:T.textMuted }}>{p.num}</span>
            <div>
              <div style={{ fontFamily:FONTS.body, fontSize:15, color:T.text }}>{p.pub}</div>
              <div style={{ fontFamily:FONTS.body, fontSize:12, color:T.textMuted, marginTop:1 }}>{p.subject}</div>
            </div>
            <span style={{ ...mono({ fontSize:9 }), color:T.textMuted, paddingTop:3 }}>{p.brand}</span>
            <span style={{ ...mono({ fontSize:9 }), color:s.color, paddingTop:3 }}>{s.label}</span>
          </div>
        );
      })}

      <SectionHead>Pitch & Press Tools</SectionHead>
      {[
        { file:"pitch_console.html",        when:"Target review, status updates, Jared/journalist database" },
        { file:"pitch_generator.html",      when:"Drafting a pitch from scratch to a new target" },
        { file:"dispatch.jsx",              when:"Quick FlashFusion/AI posts from build notes" },
        { file:"kyle-origin-video-scripts.md", when:"Video recording reference (includes piano/pattern beat)" },
      ].map(({ file, when }) => (
        <Row key={file}>
          <span style={{ fontFamily:FONTS.mono, fontSize:12, color:T.accentText, flex:"0 0 280px" }}>{file}</span>
          <span style={{ fontFamily:FONTS.body, fontSize:14, color:T.textSec }}>{when}</span>
        </Row>
      ))}
    </div>
  );
}

// ─── CONTENT TAB ─────────────────────────────────────────────────────────────
function ContentTab() {
  return (
    <div>
      <SectionHead>Content Routing — What to use when</SectionHead>
      {CONTENT_TYPES.map(({ type, badge, tool, when }) => (
        <Row key={type}>
          <span style={{
            ...mono({ fontSize:9 }), color:T.sunken,
            background:T.accentText, borderRadius:2, padding:"2px 5px",
            flexShrink:0, marginTop:2,
          }}>{badge}</span>
          <div style={{ flex:1 }}>
            <span style={{ fontFamily:FONTS.body, fontSize:15, color:T.text }}>{type}</span>
            <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:1 }}>{when}</div>
          </div>
          <span style={{ fontFamily:FONTS.mono, fontSize:11, color:T.accentText, textAlign:"right", flexShrink:0 }}>{tool}</span>
        </Row>
      ))}

      <SectionHead>Voice Rules (non-negotiable)</SectionHead>
      {[
        "No credential claims before CCA-F passes July 20 2026.",
        "Tool count: ~30 hands-on. '240+' = catalogued MCP configs. Never conflate.",
        "Day job ceiling: 'a managed IT firm.' Never name employer, colleagues, internal systems.",
        "No memoir-register lane-bleed in Reading Room / Load-Bearing content.",
        "No revenue claims before first paid audit closes (August target).",
        "Kinsley: never in any lane, plan, or deliverable.",
        "Art: never named externally. 'Real estate champion' only.",
        "ChaosClubCo / Chaos Collective: retired. Never in new external copy.",
      ].map((r, i) => (
        <div key={i} style={{
          display:"flex", gap:10, padding:"8px 0",
          borderBottom:`1px solid ${T.border}`,
          fontFamily:FONTS.body, fontSize:14, color:T.textSec,
        }}>
          <span style={{ ...mono({ fontSize:9 }), color:T.error, flexShrink:0, paddingTop:3 }}>HARD</span>
          <span>{r}</span>
        </div>
      ))}
    </div>
  );
}

// ─── CANON TAB ────────────────────────────────────────────────────────────────
function CanonTab() {
  return (
    <div>
      <div style={{
        fontFamily:FONTS.body, fontSize:14, color:T.textSec,
        padding:"14px 0 16px", borderBottom:`1px solid ${T.border}`,
        lineHeight:1.6,
      }}>
        <strong style={{ color:T.accentText }}>Convention:</strong> canonical file has NO version suffix. When replacing: rename old to <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>[name]_archive_YYYY-MM.ext</span>, build new as <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>[name].ext</span>, update this table. Never <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>_bak</span>, never <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>_v2</span> on the canonical.
      </div>

      {CANON_LANES.map(lane => {
        const laneRows = CANON_ROWS.filter(r => r.lane === lane);
        return (
          <div key={lane}>
            <SectionHead>Lane: {lane}</SectionHead>
            {laneRows.length === 0 ? (
              <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, fontStyle:"italic", padding:"6px 0" }}>
                No canonical table for this lane — see CANON.md prose.
              </div>
            ) : laneRows.map(({ file, what, use }) => (
              <Row key={file}>
                <span style={{ fontFamily:FONTS.mono, fontSize:11, color:T.accentText, flex:"0 0 280px", wordBreak:"break-all" }}>{file}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FONTS.body, fontSize:14, color:T.text }}>{what}</div>
                  <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:1 }}>{use}</div>
                </div>
              </Row>
            ))}
          </div>
        );
      })}

      <SectionHead>Stale — archive or delete</SectionHead>
      {CANON_STALE.map((entry, i) => (
        <Row key={`stale-${i}`} hover={false}>
          {entry.file ? (
            <>
              <span style={{ fontFamily:FONTS.mono, fontSize:11, color:T.textMuted, flex:"0 0 280px", textDecoration:"line-through", wordBreak:"break-all" }}>{entry.file}</span>
              <span style={{ fontFamily:FONTS.body, fontSize:14, color:T.textMuted }}>{entry.why}</span>
            </>
          ) : (
            <span style={{ fontFamily:FONTS.body, fontSize:14, color:T.textMuted }}>{entry.raw}</span>
          )}
        </Row>
      ))}
    </div>
  );
}

// ─── ARTICLES TAB ─────────────────────────────────────────────────────────────
function ArticlesTab() {
  const [section, setSection] = useState("foundation");

  const published = FOUNDATION.filter(e => e.status === "published").length;
  const total     = FOUNDATION.length;
  const arcDone   = MEMOIR_ARC.filter(e => e.status !== "not-started").length;

  const sectionBtn = (id, label) => (
    <button
      key={id}
      onClick={() => setSection(id)}
      style={{
        ...mono({ fontSize:10 }),
        background: "none", border: "none", cursor: "pointer",
        padding: "6px 12px",
        color: section === id ? T.text : T.textMuted,
        borderBottom: section === id ? `2px solid ${T.accentText}` : "2px solid transparent",
        transition: "color 120ms",
      }}
    >{label}</button>
  );

  return (
    <div>
      {/* Stats strip */}
      <div style={{ display:"flex", gap:24, padding:"16px 0 20px", borderBottom:`1px solid ${T.border}` }}>
        {[
          { n:`${published}/${total}`, l:"Foundation published", c: T.success  },
          { n:`${total - published}`,  l:"Foundation remaining",  c: T.warning  },
          { n:`${arcDone}/12`,         l:"Memoir Arc drafted",    c: T.accentText},
          { n:READING_ROOM_PIECES.length, l:"Reading Room queued", c: T.info   },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontFamily:FONTS.display, fontSize:26, color:c, lineHeight:1 }}>{n}</span>
            <Kicker color={T.textMuted}>{l}</Kicker>
          </div>
        ))}
      </div>

      {/* Section switcher */}
      <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, margin:"8px 0 4px" }}>
        {sectionBtn("foundation", "Foundation Series (8)")}
        {sectionBtn("arc",        "Memoir Arc (12)")}
        {sectionBtn("reading",    "Reading Room")}
      </div>

      {/* Foundation Series */}
      {section === "foundation" && (
        <div>
          <div style={{
            fontFamily:FONTS.body, fontSize:14, color:T.textSec,
            padding:"10px 0 14px", borderBottom:`1px solid ${T.border}`,
            lineHeight:1.6,
          }}>
            Gate: 8/8 required before Load-Bearing launch. STATE.md (Jul 7 2026): posts 01–04 complete, 05 gated on tool-retirements list, 06–08 produced. Platform still undecided (Beehiiv/Ghost/custom Astro).
          </div>
          {FOUNDATION.map((e) => {
            const s = ESSAY_STATUS[e.status];
            return (
              <Row key={e.num}>
                <span style={{ ...mono({ fontSize:10 }), color:T.textMuted, width:28, flexShrink:0, paddingTop:3 }}>{e.num}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FONTS.body, fontSize:15, color:T.text }}>{e.title}</div>
                  <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:2 }}>{e.angle}</div>
                  {e.gate && (
                    <div style={{ ...mono({ fontSize:9 }), color:T.warning, marginTop:4 }}>⚠ {e.gate}</div>
                  )}
                </div>
                <span style={{ ...mono({ fontSize:9 }), color:s.color, flexShrink:0, paddingTop:3 }}>{s.label}</span>
              </Row>
            );
          })}
        </div>
      )}

      {/* Memoir Arc */}
      {section === "arc" && (
        <div>
          <div style={{
            fontFamily:FONTS.body, fontSize:14, color:T.textSec,
            padding:"10px 0 14px", borderBottom:`1px solid ${T.border}`,
            lineHeight:1.6,
          }}>
            12-essay arc running parallel to memoir chapters. Essays = flesh-pass; chapters = polish-pass expansion. Open structural decision (GFA-D1): confirm if these are the same text before drafting begins.
          </div>
          {["I","II","III"].map(act => (
            <div key={act}>
              <SectionHead>Act {act}</SectionHead>
              {MEMOIR_ARC.filter(e => e.act === act).map(e => {
                const s = ESSAY_STATUS[e.status];
                return (
                  <Row key={e.num}>
                    <span style={{ ...mono({ fontSize:10 }), color:T.textMuted, width:28, flexShrink:0, paddingTop:3 }}>{e.num}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:FONTS.body, fontSize:15, color:T.text }}>{e.title}</div>
                      <div style={{ ...mono({ fontSize:9 }), color:T.textMuted, marginTop:2 }}>{e.mode}</div>
                    </div>
                    <span style={{ ...mono({ fontSize:9 }), color:s.color, flexShrink:0, paddingTop:3 }}>{s.label}</span>
                  </Row>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Reading Room */}
      {section === "reading" && (
        <div>
          <div style={{
            fontFamily:FONTS.body, fontSize:14, color:T.textSec,
            padding:"10px 0 14px", borderBottom:`1px solid ${T.border}`,
            lineHeight:1.6,
          }}>
            Personal long-form. Construction lens. No clean arcs, no epiphanies. Byline: flashfusion.co. Register: Solomon, Maté, Cahalan — specificity without self-pity. Use <span style={{ fontFamily:FONTS.mono, fontSize:12 }}>content-engine.jsx</span> reading_room mode to draft.
          </div>
          {READING_ROOM_PIECES.map((p, i) => (
            <Row key={i}>
              <span style={{ ...mono({ fontSize:10 }), color:T.textMuted, width:28, flexShrink:0, paddingTop:3 }}>{String(i+1).padStart(2,"0")}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONTS.body, fontSize:15, color:T.text }}>{p.title}</div>
                <div style={{ fontFamily:FONTS.body, fontSize:13, color:T.textMuted, marginTop:2 }}>{p.angle}</div>
              </div>
              <span style={{ ...mono({ fontSize:9 }), color:T.textMuted, flexShrink:0, paddingTop:3 }}>QUEUED</span>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AuthorHub() {
  const [tab, setTab] = useState("MEMOIR");

  return (
    <>
      <style>{GLOBAL}</style>
      <div style={{ background:T.bg, minHeight:"100vh", fontFamily:FONTS.body, color:T.text }}>

        {/* Header */}
        <div style={{ background:T.sunken, borderBottom:`1px solid ${T.border}`, padding:"20px 24px 16px" }}>
          <div style={{ ...mono({ fontSize:10, color:T.accentText }), marginBottom:6 }}>
            ABSTREKKT · AUTHOR COMMAND CENTER
          </div>
          <h1 style={{
            fontFamily:FONTS.display, fontSize:28, fontWeight:500,
            letterSpacing:"-0.02em", color:T.text, margin:0, lineHeight:1.1,
          }}>
            The Reading Room
          </h1>
          <div style={{ fontFamily:FONTS.body, fontSize:15, color:T.textSec, marginTop:6 }}>
            Memoir · Pitch & Press · Content — one surface, canonical tools only.
          </div>
        </div>

        <TabBar active={tab} onChange={setTab} />

        {/* Content */}
        <div style={{ maxWidth:860, margin:"0 auto", padding:"8px 24px 64px" }}>
          {tab === "MEMOIR"        && <MemoirTab />}
          {tab === "PITCH & PRESS" && <PitchTab />}
          {tab === "CONTENT"       && <ContentTab />}
          {tab === "ARTICLES"      && <ArticlesTab />}
          {tab === "CANON"         && <CanonTab />}
        </div>
      </div>
    </>
  );
}
