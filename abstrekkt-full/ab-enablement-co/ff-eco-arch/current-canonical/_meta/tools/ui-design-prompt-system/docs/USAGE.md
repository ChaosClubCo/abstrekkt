# Usage Guide

How to run this prompt system against an AI UI generator (Stitch, Gemini, Lovable,
or any Figma-first tool) and get a consistent, production-grade UI *system* rather
than a pile of disconnected mockups.

## 1. Paste order (always)

```
1. ONE Brand Header        (prompts/00 — choose A FlashFusion, B INTINC, or C Hybrid)
2. Enforcement Block       (prompts/00 — strict governance)
3. Prompt 0                (prompts/00 — global style/system design)
4. Screen prompt(s)        (prompts/10–50 — pick what you need)
```

Pick exactly ONE brand header per run. Mixing headers in a single run confuses
generators. For Hybrid (C), tell the tool: "Alternate theme per screen in numeric
order — odd = FlashFusion, even = INTINC."

## 2. Recommended generation order (prevents visual drift)

The first screens establish the shared component library; everything else inherits it.

```
BATCH 1 (system baseline): Prompt 0, P01 Settings, P02 Collab App, P06 Analytics
BATCH 2 (admin/data):      P11 Admin, P12 Pipeline, P20 Flags, P26 Security, P27 NOC
BATCH 3 (commerce/creator): P14 Product Builder, P25 Billing, P28 Creator Studio
BATCH 4 (remaining):       P03–P05, P07–P10, P13, P15–P19, P21–P24, P29–P30
```

If your tool limits output length, generate in batches of 5-10 prompts but keep
the Brand Header + Enforcement Block + Prompt 0 unchanged at the top of each batch.

## 3. Token integration (design -> code)

UI generators export design files, not code. To turn the design tokens into real
CSS/JSON:

- `tokens/tokens.css` — drop-in CSS custom properties. Set `data-theme="flashfusion"`
  or `data-theme="intinc"` on `<html>`. Hybrid: toggle per route.
- `tokens/tokens.json` — W3C-style design-tokens format. Feed to
  [style-dictionary](https://amzn.github.io/style-dictionary/) or the Figma Tokens
  plugin to generate platform outputs (iOS, Android, CSS, Tailwind).

```bash
# Example: generate platform tokens with style-dictionary (illustrative)
npx style-dictionary build --config sd.config.json
```

## 4. Post-export validation (do this every run)

1. **WCAG AA contrast** — run the Figma Contrast plugin or WebAIM. Body text must
   be >= 4.5:1, large text >= 3:1, focus states >= 3:1. FlashFusion glass surfaces
   are the most likely to fail — if they do, swap `--surface` to `--bg1` (keep
   borders + glow).
2. **Frame naming** — confirm `[App]/[Area]/[Screen]/[State]` and component
   `[Type]/[Variant]` naming.
3. **State coverage** — use `prompts/00` Enforcement Block QUALITY GATE checklist.
4. **Drift check** — compare new screens to P02 (app shell). If rounded corners,
   spacing, or colors differ by more than ~10%, re-run Prompt 0 + the drifted batch.
5. **Commit** — tag the generation in Git (e.g., `v1.0-flashfusion-2026-01-25`).

## 5. Tiering (optional speed control)

You can wrap any prompt in three quality tiers:
- **FAST** — layout + components only (rapid exploration, Gemini-Flash-style).
- **PRO** — adds states + realistic mock data.
- **FINAL** — adds schemas + event-tracking plan + test cases.

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Screens drift in style after ~5 outputs | Generator context decay | Re-paste Brand Header + Prompt 0; tell it "reuse the components/tokens already established". |
| Text hard to read on FlashFusion | Glass + glow tanks contrast | Set `--surface: var(--bg1)`; keep borders + gradients; re-run contrast check. |
| Figma layers are a junk drawer | Tool ignored export rules | Re-emphasize Enforcement Block Rule 9 (frame/component naming, auto-layout). |
| Tool truncates the long prompt | Input length limit | Use the COMPACT variant of each prompt; generate in smaller batches. |
| "Pro mode" / "advanced reasoning" not found | Tool lacks that mode | Ignore it — use standard mode; output quality comes from the prompt structure, not a special mode. |
| Android output isn't real Kotlin | Generators emit design, not code | Expected. The Figma file is a *mapping reference*; a developer implements XML/Kotlin from it. |
| Layout breaks below 390px | Legacy phones (320-375px) untested | Stack all columns, hide non-critical UI (right inspector, filter rail). |
| RTL/CJK layout looks wrong | i18n out of scope in v1.0 | Mirror layout for RTL; widen spacing/typography for CJK. Planned for v2.0. |

## 7. Acceptance criteria

A run is "done" when:
- [ ] All requested screens generated under ONE brand header.
- [ ] Every non-marketing screen has loading/empty/error/success/disabled/permission states.
- [ ] WCAG AA contrast verified post-export (tooling, not eyeballing).
- [ ] Frames + components follow the naming convention; auto-layout used.
- [ ] Tokens match `tokens/tokens.json` (no off-palette colors).
- [ ] Generation tagged/committed for reproducibility.
