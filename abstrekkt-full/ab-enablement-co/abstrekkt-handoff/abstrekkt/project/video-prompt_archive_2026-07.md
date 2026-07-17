# Abstrekkt — Video Generation Prompt & Embed Spec

Use this to generate (Sora / Veo / Runway / Pika) or shoot footage that matches the
Abstrekkt "Brutalist Archive" aesthetic. Generate the clip, then upload it here and tell
me where to embed it — the specs at the bottom keep it drop-in ready.

---

## MASTER STYLE PROMPT (paste this, then append one SCENE below)

> Cinematic dark-editorial footage in a "brutalist archive / surveillance bunker"
> aesthetic. Deep carbon-black background (#0A0A0C), expansive negative space, weathered
> steel and concrete textures, faint microfilm grain over everything. Lighting is low-key
> and motivated — a single warm amber source (golden-hour #ffbf00) raking across the
> frame, everything else falling into shadow. Muted, desaturated, warm-graded color with
> high contrast and crushed blacks; feels recovered from an old archive, not freshly
> shot. Slow, deliberate camera — a quiet dolly or near-static lock-off, no fast moves,
> no whip pans. Contemplative, forensic, restrained. Anamorphic 2.39 feel, subtle film
> halation on highlights only. No text, no logos, no people's faces in focus, no vibrant
> colors outside amber and the dark neutral ladder. 24fps, shallow depth of field.

### SCENE — swap the last line for the clip you want
- **Hero / ambient loop:** "…slow push across a wall of redacted documents and index
  cards pinned to dark steel, dust motes drifting through the amber light."
- **AI / machine layer:** "…macro of a CRT-style data readout, faint blueprint-blue
  (#a9c7ff) telemetry glow, scan-lines, numbers ticking slowly in the dark."
- **Texture / transition:** "…extreme close-up of microfilm spooling past a reader lamp,
  amber backlight, grain and scratches, abstract and slow."
- **Workspace:** "…overhead of a dim desk — paper, a brass lamp, a steel drawer half
  open — warm pool of light, the rest of the room in near-black."

---

## What to avoid (or I'll have to regrade it)
- No bright/saturated color, neon, or rainbow gradients (that's FlashFusion, not this).
- No on-screen text, captions, watermarks, or UI.
- No fast cuts, bounce, zoom punches, or lens flares sweeping the frame.
- No pure-white blowouts — keep highlights warm and contained.

---

## Technical specs (so it embeds cleanly)

| Spec | Value |
|---|---|
| Container | `.mp4` (H.264) **and/or** `.webm` (VP9) |
| Resolution | 1920×1080 (hero) · 1080×1080 if square module |
| Aspect | 16:9 default; tell me if a section needs 1:1 or 21:9 |
| Length | 6–12s for ambient loops; ≤30s for narrative |
| Loop | Make first & last frame match for seamless background loops |
| Audio | None needed — backgrounds autoplay **muted**; keep audio only for narrative clips |
| Bitrate | ~8–12 Mbps 1080p is plenty; keep files < ~15 MB so pages stay fast |
| Frame rate | 24fps |

## Upload & embed handoff
1. Generate the clip, then upload it (drag it into the chat).
2. Name it for where it goes, e.g. `hero-loop.mp4`, `machine-layer.webm`,
   `about-texture.mp4`.
3. Tell me the page + spot ("background of the Home hero", "beside the AI section on
   Abstrekkt Design").

I'll embed as a muted, looping, `playsinline` background (with a poster frame and a
`prefers-reduced-motion` fallback to a still), or as an inline figure with the archival
tonal grade — whichever fits the section. If you upload a poster image too, I'll use it;
otherwise I'll grab a frame.
