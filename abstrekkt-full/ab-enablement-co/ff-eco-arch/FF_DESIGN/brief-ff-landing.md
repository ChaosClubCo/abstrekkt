# FlashFusion Landing Page — Design Brief
**Version:** 1.0
**Profile:** FlashFusion (v4 — ratified profile B)
**Date:** 2026-06-16
**Scope:** FULL (token-system change + full page)

---

## Component Identity

**What this is (exact):** The public marketing landing page for FlashFusion at flashfusion.co — a
single-page B2B site selling the champion model (train one internal person to own AI, then exit),
with a pricing ladder, the five champion-model arguments, an operator-origin section, and a single
conversion path to the free audit at `audit.flashfusion.co`.

**Where it lives:** Full page (`index.html`), self-contained, dark theme.

**Primary user action:** Start the free AI readiness audit (CTA → `audit.flashfusion.co`). Everything
else (reading arguments, pricing, origin) supports this one action.

---

## Visual Direction

**Accent:** `#FF6A00` orange (primary) / `#FF2D55` red / `#A144FF` purple / `#00E5FF` cyan (secondary anchor).

**Typography:**
- Heading: Orbitron 700 (display), uppercase
- Body: Inter 400/500
- Mono: none (eyebrows = Inter 600 uppercase; card indices = Orbitron 700)
- Font load: `Orbitron:wght@600;700;900 & Inter:wght@300;400;500;600;700`

**Surface:** `#05060d` page / `#080910` nav / `#0a0b16` bands / `#0b0c18` cards — solid.

**Cards:** Solid `#0b0c18`, 1px border `#16182a`, radius 8px, hover → `#10111f` + warm border. **No blur, no glass** (v4 rule).

---

## Differentiator

The **fusion seam**: a 1px gradient meridian (`90deg #FF6A00→#FF2D55→#A144FF→#00E5FF`) runs under the
fixed nav and divides every major section, echoing the two-hemisphere fusion brain. Implemented as a
gradient `border-image` on the nav and `<hr class="seam">` between sections. Section eyebrows sit
flush-left to the seam, never centered — the page reads as "two halves joined." A generic dark-SaaS
generator produces centered sections with plain `#1a1a1a` dividers; this does not.

---

## Navigation Model

**Pattern:** Fixed solid top bar with a gradient fusion-seam bottom border.
**Justification:** Single-page site with 3 anchor targets + 1 external CTA — a persistent solid bar
gives constant access to the audit CTA without the viewport cost of a sidebar; glass/floating-pill is
retired under v4, so the seam border (not blur) signals the brand. No sidebar (3 links don't earn one).

---

## Layout

**Container:** Full-bleed sections, internal padding `clamp(24px,4vw,60px)`.
**Grid:** Hero = 2-col split (1.05fr copy / 1fr art). Pricing = 4-col band. Arguments = auto-fit `minmax(260px,1fr)`. Platform/About = 2-col splits.
**Breakpoints:** ≤900px hero + splits collapse to 1-col; ≤700px pricing → 2-col; ≤640px arguments → 2-col.
**Intentional asymmetry:** Hero left column is wider (1.05:1) and the fusion seam bisects each section flush-left — deliberate break from centered-symmetric SaaS layouts.

---

## State Inventory

Static marketing page — no data fetch, so data-driven states (empty/loading/error/success) are **N/A by design** (documented, not deferred). Interactive states:

| State | Description | Visual treatment |
|---|---|---|
| Empty | N/A — no data regions on the page | — (reason: static content) |
| Loading | N/A — no async fetch | — (reason: static content) |
| Error | N/A — no async fetch; CTA hands off to external app | — |
| Success | N/A — conversion happens on `audit.flashfusion.co` | — |
| Hover | nav links, both CTAs, pricing cells, argument cards | color lift / border warm / translateY(-2/-3px) |
| Focus | every link + button | `:focus-visible` → 2px `#22D3EE` ring, offset 3px |
| Disabled | N/A — no conditional-action controls | — |

---

## Anti-Patterns Banned for This Build

1. No fabricated metrics, client logos, or "Enterprise Trusted" trust signals — pre-case-study, claims must be true (content-integrity hard rule).
2. No glass / `backdrop-filter: blur()` — retired for FlashFusion v4.
3. No emoji as iconography — use Orbitron index numbers.
4. No centered-symmetric section layout — flush-left to the fusion seam.
5. No pill buttons — squared 6px.
6. No Instrument Serif / Geist (v3 fonts).

---

## Generator Prompt

> Build a single-page dark B2B landing page for "FlashFusion," an AI-enablement consultancy.
> Surface `#05060d`; cards solid `#0b0c18` with 1px `#16182a` border, radius 8px, **no blur/glass**.
> Primary accent orange `#FF6A00`; CTA gradient `135deg #FF6A00→#FF2D55→#A144FF`; hero headline uses
> `90deg #FF6A00→#FF2D55→#A144FF→#00E5FF` clipped text. Headings Orbitron 700 uppercase; body Inter.
> Fixed solid top nav with a 1px gradient bottom border (the "fusion seam"); same gradient as a 1px
> `<hr>` divider between every section; section eyebrows flush-left, never centered. Hero = 2-col split
> (wider left copy / right product art). Headline: "We don't install AI. We install an AI expert in
> your team." Sections: pricing ladder band (Free / $4,500 / $5,000 / $2K-mo), five numbered argument
> cards (Orbitron index, no emoji), operator-origin about block. Single CTA throughout → the free audit.
> `:focus-visible` cyan `#22D3EE` ring on all interactive elements. No sidebar, no pill buttons, no
> glass, no fabricated metrics or partner logos.

---

## Known Risks

- **MEDIUM (Check 5):** Hero art is an AI-generated illustration; on its own it's category-generic. Mitigated by the fusion-seam motif carrying the differentiation, not the image. Documented; revisit when a real product screenshot or commissioned mark exists.
- **MEDIUM (token):** The `90deg` spectrum gradient matches a v3-deprecated value. Intentionally re-authorized in v4 for the horizontal fusion sweep; flagged so it isn't mistaken for v2/v3 contamination.

---

## Future Scope

- Wire `index.html` to `tokens.css` variables (currently hardcoded hex that happens to match v4).
- Replace AI-gen hero art with a real audit-output screenshot or commissioned fusion mark.
- Outline the Orbitron wordmark to vector for distribution (cairosvg lacks Orbitron).
- `:focus-visible` audit once interactive forms are added (none on this static page).
