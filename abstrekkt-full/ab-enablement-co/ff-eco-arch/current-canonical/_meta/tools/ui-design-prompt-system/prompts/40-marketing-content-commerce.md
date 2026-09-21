# Marketing, Content & Commerce Surfaces

Conversion- and content-oriented screens. Marketing pages are documented exceptions
to the full state-completeness rule (they're largely static).

> Assumes Brand Header + Enforcement Block + Prompt 0 pasted above.
> DENSITY NOTE: hero/marketing sections MAY use larger whitespace than the
> "Creator"/"Ops" data densities defined in the Brand Headers.

---

## P04 — AI Product Landing Page (conversion + trust)
*Audit: MARKETING exception — full interactive states not required.*

**COMPACT:**
```
Design a modern marketing landing page for a new AI product. Sections: hero
(headline/subhead/primary CTA), social-proof logos, 3 feature blocks, short demo
strip, pricing (3 tiers), FAQ, footer.
Requirements:
- One primary CTA repeated max 3 times; secondary CTA: watch demo.
- Announcement pill.
- Responsive: desktop 1440 + mobile 390.
Output: Figma-ready structure (frame names, auto-layout hints, component grouping).
```

**MAX-DEPTH SYSTEM ROLE:** Conversion-focused product designer (Stripe-grade) with
strong UX-writing instincts. **Sections:** hero (crisp value prop + primary + secondary
CTA); social proof (logos + quantified outcomes); problem→solution narrative (3-step);
product tour (interactive tabs, not static); role-based use cases; security & compliance
block (SOC2/ISO-style language); pricing preview + plan comparator; FAQ accordion; footer
(legal, docs, status, contact). **Interaction:** sticky CTA on scroll (desktop), on-page
demo modal, form validation + spam-protection copy. **Output:** section-by-section IA,
component list, copy-intent notes; state designs for loading + form errors; Figma frame
breakdown + tokens.

---

## P05 — Social Feed — 5 Variations with A/B hooks
*Audit [FIX-4.1]: name each variant frame for Figma. Rapid-iteration mode (Gemini-Flash-style) works well here.*

**COMPACT:**
```
Generate five distinct variations of a social media feed UI (same content model,
different presentation). Feed items: avatar, name, timestamp, text, media
(image/video), actions, comment preview.
Each variation must differ in: card shape, spacing density, typography scale,
media treatment, action layout.
Include: loading skeleton, empty state, pull-to-refresh, error retry.
Output: label variants A-E with a brief design rationale and a Figma frame name
per variant: Feed/Variant-[A..E]/[State].
```

**VARIANTS (required):** A) Dense "Reader" feed · B) Media-first feed · C) Conversation-first
(threads) · D) Creator-first (profile + series) · E) Algorithmic "For You" with topic chips.
For each: layout spec + component list, key interactions, A/B metrics hypothesis
(CTR, dwell time, shares), mock data schema. Suitable for rapid A/B testing.

---

## P14 — E-Commerce Product Builder
*Audit [FIX-5.1][FIX-3.3]: added payment/checkout error state + confirm patterns.*

```
Design a product customization UI for an e-commerce app. Features: live product
preview, option selectors (size, color, add-ons), price breakdown, inventory indicator.
Requirements:
- Disabled states for unavailable options; sticky summary panel; mobile bottom CTA.
- Payment/checkout error state with recovery.
- Confirmation for high-value actions (apply discount, place order).
Output: conversion-focused UX notes; mobile-first layout.
```

---

## P28 — Creator Studio (assets + publishing)
*Audit: full state coverage ✓.*

```
Design a creator studio UI. Modules: asset library, editor, templates, scheduled
posts, analytics, brand kit.
Include: asset tagging, bulk export, publish checklist, "draft vs published" states.
States: loading, empty, error, success, disabled, permission-gated.
Output: desktop-first; marketing/preview areas may use larger whitespace.
```

---

## P17 — Learning Dashboard / Course Player
*Audit [FIX-3.4]: added "lesson not available" (geofencing/entitlement) state.*

```
Design a learning platform dashboard + lesson player. Modules: course list with
progress, lesson player (video/text), notes + bookmarks.
Requirements:
- Resume where left off; offline indicator; subtle completion celebration.
- "Lesson not available" state (entitlement / region lock).
Output: desktop + tablet focus.
```

---

## P29 — Form Builder (logic + preview)
*Audit: full state coverage ✓.*

```
Design a form builder UI. Features: drag-drop fields, conditional logic, live
preview, theming, embed code.
States: validation errors, publish/rollback, version history, loading, empty.
Output: split builder/preview layout; auto-layout for field rows.
```

---

## P30 — Search + Discovery Hub (faceted)
*Audit: full state coverage ✓.*

```
Design a faceted search/discovery UI for a large catalog. Modules: query bar,
filters (facets), results grid/list, compare tray, saved searches.
Requirements:
- Fast scanning; empty-results suggestions; filter chips; sort options.
- Virtualized results list for large catalogs.
Output: desktop + responsive; sticky filter rail collapses at 1024.
```
