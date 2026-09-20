# Abstrekkt Landing — Design Brief & Gate Record

Parent-brand landing for `abstrekkt.com`. Built on the `designing-abstrekkt-systems` design system. Deliberately distinct from the FlashFusion landing.

## Assumptions (resolved without blocking)
- **"Abstrekkt version" = parent-company landing**, not a re-skin of the FF audit funnel. Abstrekkt is a holding identity, not a product; the page presents the three arms and routes engagement to FlashFusion.
- **Brand identity v1 = the `designing-abstrekkt-systems` system** (brass `#c8a86a` / ink `#1c1917` / Fraunces + Crimson Pro + JetBrains Mono). Project instructions list Abstrekkt brand as an "open decision" with interim emerald; the design skill supersedes that as the authoritative v1. This is the lever to change if you want a different identity.
- **Rendered warm-dark** ("Reading Room at Midnight") — token values are light-surface by default; I used the neutral ink ramp as ground + brass as the single accent. Matches your documented aesthetic and maximizes separation from FF.

## Brand mapping
| Element | Value | Token |
|---|---|---|
| Ground | `#1c1917` ink | neutral-900 |
| Elevated/border | `#292524` / `#44403c` | neutral-800 / 700 |
| Text | `#fafaf9` / `#d6d3d1` | neutral-50 / 300 |
| Labels (muted) | `#a8a29d` | neutral-400 |
| Accent | `#c8a86a` brass | primary-400 |
| Display | Fraunces | — |
| Body | Crimson Pro | — |
| Labels/indices | JetBrains Mono | — |

## Differentiation from FlashFusion (intentional)
| | FlashFusion | Abstrekkt |
|---|---|---|
| Ground | cool void `#05060d` | warm ink `#1c1917` |
| Accent | neon orange/magenta/cyan | single brass |
| Type | Orbitron + Inter (sans) | Fraunces + Crimson Pro (serif) |
| Motion | animated canvas, glow, fusion seam | matte, still, hairline rules, no glow |
| Register | energetic, product | quiet, editorial, holding-co |

## Copy provenance (all grounded — zero fabrication)
- Arm one-liners are **verbatim sanctioned strings** from `references/04-brand-voice.md` (FlashFusion / Load-Bearing). Abstrekkt definition: "Holding company for FlashFusion and adjacent products."
- Audit → Training → Exit: sanctioned engagement steps from the same file.
- Product status (244 plugins built/distribution-pending; Ample + FissionPrompt in definition; no flagship) from `the-abstrekkt-products-arc.jsx` / project knowledge.
- Operator facts (solo, Grayslake IL, hospitality→QC→self-taught AI, no co-founders/outside money, diagnostic through-line) from project founder facts.
- **No metrics. No Anthropic-cert claim (gated to July 20). No retired names (ChaosClubCo/Chaos). No fabricated URLs** — only `flashfusion.co` (real). `hello@flashfusion.co` deliberately NOT used (bouncing per ops notes); engagement routes to the FF site.

## Anti-slop gate (14-point, adapted for a static landing)
| # | Gate | Result |
|---|---|---|
| 1 | No hardcoded color | ⚠️ WARN — single-file landing inlines hex **sourced from tokens**; `tokens.css` shipped as reference (same portability pattern as the FF deliverable) |
| 2 | No hardcoded spacing | PASS — rem on token scale + clamp() |
| 3 | ARIA on interactive | PASS — nav `aria-label`, skip link, decorative diamond `aria-hidden` |
| 4 | Focus ring visible | PASS — 2px brass, offset-2, `:focus-visible` |
| 5 | Motion ≤ 500ms | PASS — reveal 500ms, transitions 150ms |
| 6 | State definitions | PASS — hover/focus on all interactive |
| 7 | Prop interfaces | N/A — static HTML, no TS components |
| 8 | No placeholder content | PASS |
| 9 | Contrast ≥ 4.5:1 | PASS — measured, lowest 6.93:1 |
| 10 | No `outline:none` w/o replacement | PASS — focus-visible outline present |
| 11 | No spring/bounce easing | PASS — cubic-bezier out/in-out only |
| 12 | Disabled disables | N/A — no disabled controls |
| 13 | Modal focus trap | N/A — no modal |
| 14 | No hardcoded error strings | N/A — no forms |

**Score: 0 FAIL, 1 WARN (documented).** Ship.

## Verification performed
- WCAG contrast computed for all 6 pairings (Python, sRGB) — all ≥ 6.93:1.
- Rendered desktop / full (scroll-through) / mobile / reduced-motion in Chromium — **0 page errors**.
- Reveal failsafe: content reveals on scroll via IntersectionObserver, force-revealed 2.5s after load, and shown immediately under reduced-motion or no-JS (`html.js` gate). Core content can never stay hidden.

## Risks / open items
- **Brand identity** was an open project decision; this applies the skill as v1. If you want a different Abstrekkt look, that's the change point.
- **No live URLs** for Software/Load-Bearing (distribution + platform undecided) — shown as honest status labels, not links.
- **Contact**: no verified Abstrekkt inbox; page routes engagement to `flashfusion.co`. Add a real address when one exists.
- `backdrop-filter` on the sticky header is cosmetic; degrades gracefully where unsupported.

## Files
- `index.html` — the landing (self-contained, fonts via Google Fonts CDN)
- `tokens.css` — Abstrekkt token reference (from the design system)
- renders: `abstrekkt-desktop.png`, `abstrekkt-full.png`, `abstrekkt-mobile.png`, `abstrekkt-reduced.png`
