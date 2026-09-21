# Abstrekkt — Image & Video Generation Prompts
### "Reading Room at Midnight" — for every `<image-slot>` placeholder in the app

Superseded version archived as `video-prompt_archive_2026-07.md` — that one was written
against an older amber/blueprint-blue "Brutalist Archive" palette. **This version matches
the currently bound Abstrekkt Design System**: warm ink + brass, Fraunces/Crimson Pro,
paper-grain — no blue, no neon.

Paste the MASTER PROMPT into Sora / Veo / Runway / Pika (video) or Midjourney / your
stills tool of choice, then append **one SCENE line** from the inventory below. Generate,
upload the file here, and tell me which slot it's for — I'll drop it in.

---

## MASTER STYLE PROMPT (paste first, every time)

> Warm, low-key editorial [photography / cinematic footage] for a private library read
> after hours. Backgrounds are a warm near-black ink — brown-black, never blue-black.
> Surfaces are dark wood, worn leather, stacked books, index cards, paper. The only
> accent color anywhere in frame is a warm brass gold: lamp bodies, hardware, gilt
> lettering, or a single raking shaft of light — never neon, never any other saturated
> color. Everything else reads warm bone-paper white and dark charcoal, dimming into
> soft shadow at the frame edges. Light is single-source and motivated — a brass desk
> lamp or low window light — never bright, even, or clinical. Fine, even film-grain over
> the whole image, like paper tooth, not digital noise. [VIDEO ONLY: camera is locked-off
> or creeps at an almost imperceptible pace — no handheld shake, no whip pans, no snap
> zooms; this is a settling-in, not a spring, 24fps.] No faces in focus, no on-screen
> text, no logos, no UI or screens, no cool or blue light, no bright product-shot
> lighting, no lens flare.

**What to avoid (or it'll need regrading):** bright/saturated color, neon, blue or cool
light of any kind, gradients, on-screen text/watermarks, fast cuts or zoom punches,
pure-white blowouts, stock-photo gloss.

---

## PLACEMENT INVENTORY — every slot in the app, grouped by scene

### Group A — Studio Landing hero + capability tiles
`Abstrekkt Studio Landing.html` — only appear when the page's **Graphics** tweak is set
to *Photo/Video*.
- **Slot `hero-art-media`** — near-square, ~1:1.05, `fit: cover`. Video welcome here.
  Scene: *"…slow push across a brass desk lamp lighting a stack of paper and an open
  notebook, everything else falling into warm dark shadow, motes of dust drifting
  through the beam."*
- **Slots `capability-strategy` / `capability-communication` / `capability-systems`** —
  three 120×120 square icon tiles. Stills, not video (too small to read motion).
  Scene: *"…extreme macro, brass hardware catching a single warm light against dark
  wood grain, shallow focus."* Generate three variants (different macro subject: a
  compass/hinge, a stitched book spine, a brass drawer pull) so the three tiles don't
  look identical.

### Group B — Kyle Rosebrook personal site (desk / lamp / library environment)
No faces — safe to generate.
- **Slot `kr-hero-desk`** (`Kyle Rosebrook Home.html`) — wide hero background, full-bleed,
  `fit: cover`, min-height ~560–880px. Video loop welcome.
  Scene: *"…wide static shot, overhead-ish angle on a dim desk — papers, a brass lamp,
  a half-open steel drawer — warm pool of light, the rest of the room in near-black."*
- **Slots `kr-rail-research` / `kr-rail-drafts` / `kr-rail-tools` / `kr-rail-now` /
  `kr-rail-princ`** (nav-rail thumbnail, repeated on 5 pages) — 4:3, small. One still,
  reused everywhere. Scene: *"…tight shot of a brass desk lamp switched on, warm glow,
  soft-focus books behind it."*
- **Slot `kr-notes-photo`** (`Kyle Rosebrook Notes.html`) — Scene: *"…close-up of an open
  notebook and pen under lamp light, handwriting soft-focus and illegible, brass lamp
  base in frame."*
- **Slots `kr-essay-writing` / `kr-essay-mm` / `kr-essay-ioed` / `kr-essay-bfa`** (4 essay
  pages) — **tall vertical** sticky column (~300–340px wide × full viewport height, min
  520px — shoot/generate portrait-orientation, taller than 3:4). Video loop welcome.
  Scene: *"…slow vertical composition, a library ladder or tall bookshelf in raking lamp
  light, foreground soft, receding into shadow."* Vary the specific subject (shelf,
  window seat, stacked books on a desk) across the 4 so they don't repeat.

### Group C — Optional/atmospheric (no face required)
- **Slot `circle-1`** (`Abstrekkt Home.html`) — 4:3 desktop / 16:9 mobile. Context: a
  "Forming · Online-first" cohort card. Scene: *"…a small group's hands and notebooks
  around a lamp-lit table, faces out of frame or in soft shadow, warm and quiet."*
- **Slot `contact-visual`** (`Abstrekkt Contact.html`) — 1:1 square, optional. Scene:
  *"…a brass-lit reading corner, empty chair, warm and inviting, no people."*

### Portraits — shoot for real, do not generate
These slots read as *this specific person* (Kyle Rosebrook) — an AI face would be
inconsistent from page to page and undercuts the "kept, not manufactured" voice. Book a
real photo instead; art-direct it to match the system: warm brass key light (a desk lamp
or low window), dark wardrobe, near-black backdrop, genuine film grain added in post, no
bright fill light, 4:5 crop, contemplative/still expression, not a smiling headshot.
- `founder-portrait` — `Abstrekkt Founder.html` + `Abstrekkt Founder v2.html` (4:5)
- `home-portrait` — `Abstrekkt Home.html` (4:5 vertical)

---

## Technical specs

| Spec | Value |
|---|---|
| Container | `.mp4` (H.264) and/or `.webm` (VP9) for video; `.jpg`/`.png` for stills |
| Length | 6–12s for ambient loops; make first/last frame match for seamless loop |
| Audio | None — backgrounds autoplay muted |
| Frame rate | 24fps |
| Bitrate | ~8–12 Mbps @1080p; keep files small so pages stay fast |
| Resolution | Match the slot's aspect above; oversize slightly and let `fit:cover` crop |

## Upload & embed handoff
1. Generate, then upload the file here (drag into chat).
2. Name it for its slot (e.g. `kr-hero-desk.mp4`, `capability-strategy.jpg`).
3. Tell me the slot id or page — I'll wire it into the `<image-slot>` (or as a muted
   looping `playsinline` background with a poster frame + reduced-motion fallback, for
   video).
