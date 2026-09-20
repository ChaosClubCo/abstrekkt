# Abstrekkt — Brand & Design System

This project's brand is **Abstrekkt**, a dark-editorial / "Brutalist Archive" aesthetic.
It is a SEPARATE brand from FlashFusion — do NOT use FlashFusion's violet/cyan neon-glass
tokens here. The canonical tokens below are extracted from the uploaded
`stitch_memory_corridor_studio/` working files (see `villain_virtue_editorial/DESIGN.md`,
`design.md`, and the `product_chaos_club_*` / `welcome_to_the_chaos_club_*` screens).

## North star
Cinematic dark-editorial meets a surveillance-bunker "Brutalist Archive." Deep tonal
density, expansive negative space, intentional friction. The interface recedes so the
narrative content leads. Feels inherited, not manufactured — weathered steel, microfilm
grain, redacted-document typography.

## Colors (canonical)
```
background / surface       #131315   (deep-carbon body variant: #0A0A0C)
surface-container-lowest   #0e0e10
surface-container-low      #1c1b1d
surface-container          #201f21
surface-container-high     #2a2a2c
surface-container-highest  #353437
surface-bright             #39393b

on-surface (ivory text)    #e5e1e4
on-surface-variant         #d4c5ab
outline                    #9c8f78
outline-variant            #504532   (use at ~15% as a "ghost border")

primary (light amber)      #ffe2ab
on-primary                 #402d00
primary-container          #ffbf00   ("Golden Hour" amber — highlights, active states)
surface-tint / fixed-dim   #fbbc00

secondary (blueprint blue) #a9c7ff   (AI / technical / Moment Studio data)
secondary-container        #026bd2
cyan-accent                #00f0ff   (sparingly, technical accent)

error                      #ffb4ab
error-container            #93000a
```
Amber = emotional significance & CTAs. Blue/cyan = the "machine layer" (AI, metadata,
diagnostics). Everything else stays in the dark neutral ladder. No vibrant colors outside
this palette.

## Typography
- **EB Garamond** — display, headlines, titles, all-caps labels (the editorial/memoir voice). Italic for "handwritten memoir" labels.
- **Literata** — long-form narrative body text (`body-md` 16px, `body-lg` 18px, line-height 1.6).
- **JetBrains Mono** — `technical-sm` (12px): timestamps, IDs, metadata, AI output.
- **Space Grotesk** — optional brutalist/telemetry headers (`.brutalist-font`).
Scale: `display-lg` 48px (-0.02em, 1.1) → mobile 32px; `headline-md` 24px; `label-caps`
12px / 0.1em / 600 uppercase.

## Surfaces, depth, shape
- Depth via **tonal layering** (stack surface-container tiers), not drop shadows.
- **No 1px solid section borders** — define boundaries by background color shift. If a border is needed, ghost border = `outline-variant` @ ~15%.
- Global low-opacity **microfilm grain** overlay (SVG fractalNoise, ~0.04 opacity).
- **Window frame** wrapper: 12px bezel in `surface-container-highest` with `inset 0 0 0 1px rgba(255,255,255,.1)`.
- Glassmorphism for floating panels: `surface-container` @ ~40-60% + `backdrop-filter: blur(12-20px)`, 0.5px ivory inner border @ 10%.
- Radius: brutalist screens use **0px**; editorial UI uses 8px (0.5rem); technical/Moment-Studio cards 4px; pills/chips 9999px.
- Shadows rare; when used, 40-60px blur @ ~8%, tinted cool-grey not pure black.

## Layout & voice
- 12-col grid, 40px desktop margins (20px mobile), 8px base unit, 4px half-units for dense dot timelines.
- Strong left-aligned grids with right-aligned telemetry/metadata. Avoid centered layouts.
- Surveillance metadata (timestamp / ID in `label-caps` or mono) in card corners.
- Voice: archival, forensic, contemplative. Hard edges, high contrast, asymmetry.
