# Anti-Slop Design System Prompt v2.0
## Quick Reference

> **Source:** anti_slop_prompt.md (v2.0, 20 audit findings resolved)
> **Modes:** SPEC MODE (default) | BUILD MODE

---

## Phase Sequence & Gates

| Phase | Name | Gate |
|---|---|---|
| 0 | Context Capture | ⛔ Gate 1 — Output unanswered Qs only. Wait. |
| 1 | Experience Thesis | ⛔ Gate 2 — Output thesis summary. Wait for approval. |
| 2 | Visual Design System | ⛔ Gate 3 — Run anti-slop pass on tokens before components. |
| 3 | Motion System | — |
| 4 | Interaction Model | — |
| 5 | Anti-Pattern Enforcement | ⛔ Gate 5 — Violations resolved + craft signals confirmed. |
| 6 | Component Architecture | — |
| 7 | Screen Layouts | — |
| 8 | Signature Differentiators | — |
| 9 | Accessibility Safeguards | ⛔ Gate 6 — All a11y verified before handoff. |
| 10 | Developer Handoff | — |
| 11 | Anti-Slop Audit | ⛔ Gate 4 — 4 tests pass before delivery. |

---

## Hard-Reject Anti-Patterns

### Structural (5.1)
✗ Default left sidebar + main content (without justification)  
✗ Card grid as layout default  
✗ Hero → features → CTA marketing clone  
✗ Shallow glassmorphism as defining aesthetic  
✗ Random gradients with no systemic purpose  
✗ Generic KPI blocks above dashboard  
✗ Plain Tailwind gray palette unmodified  
✗ Default shadcn/MUI with no restyling  

### Visual (5.2)
✗ Pure black (#000000) backgrounds  
✗ Pure white (#FFFFFF) text on black  
✗ rgba(0,0,0,X) shadows on colored surfaces  
✗ More than 3 distinct font sizes per screen  
✗ Borders as primary separation mechanism (use space)  

### Interaction (5.3)
✗ Tooltip as only way to understand a UI element  
✗ No visual feedback on button click  
✗ Focus rings hidden or removed  
✗ Forms without inline validation  
✗ Dialogs not closeable with Escape  
✗ Motion that exists only to look impressive  

---

## Component State Completeness (9 States Required)

- [ ] Default
- [ ] Hover (≤80ms feedback)
- [ ] Focus (keyboard visible, never hidden)
- [ ] Active/Pressed
- [ ] Loading (skeleton for content, spinner for action)
- [ ] Disabled (40% opacity, cursor: not-allowed)
- [ ] Error (with recovery action)
- [ ] Empty (3 types: never had / cleared / search empty)
- [ ] Success (confirm → fade to default)

---

## Token System Checklist (Phase 2)

- [ ] Color: HSL semantic palette (brand, surface, text, border, feedback)
- [ ] Dark mode: hue-matched darks, NOT inverted values
- [ ] Contrast: body 4.5:1 min, UI 3:1 min — every pairing audited
- [ ] Typography: typeface + type scale + weight map + optical adjustments
- [ ] Spacing: 4pt grid, named tokens --space-1 through --space-24
- [ ] Elevation: 5 levels (shadow + surface lightness shift)
- [ ] Shape: radius tokens --radius-sm through --radius-full
- [ ] Icons: SVG, currentColor, 16/20/24/32px only, consistent stroke
- [ ] Motion: easing library + duration scale + spring presets
- [ ] i18n: expansion headroom, RTL rules, CJK font stack, Intl formatting

---

## Anti-Slop Audit (4 Tests — Gate 4)

### Template Test
> "Could this exact design have been produced by any AI tool using default settings?"  
If YES → identify the specific element and redesign it.

### Differentiation Test
> "Would a staff designer at Linear, Vercel, or Arc Browser consider this competitive?"  
If NO → identify the weakest element and elevate it.

### Completeness Test
- All 9 states per interactive component?
- Every screen has an empty state?
- Every error has a recovery action?
- Every animation has a purpose + reduced-motion fallback?
- All color pairings contrast-checked and passed?
- All form fields have validation?
- Dark mode tokens defined?
- Touch targets ≥44px on mobile?
- Focus rings visible and styled?

### Craft Test
- Negative space is purposeful?
- Typography max 2 weights per component?
- Motion timing matches emotional tone?
- Micro-copy sounds like a person?
- No screen exists only because templates include it?

---

## Scope Tiers

| Tier | Estimate | Includes |
|---|---|---|
| TIER 1 — Foundation | 2–4h | Design system + core components + 2 screens |
| TIER 2 — Complete | 8–16h | Full system + library + all primary screens + motion + a11y |
| TIER 3 — Production | 24+h | TIER 2 + handoff tokens + impl guide + audit + perf annotations |

---

## Accessibility Gate (Gate 6 — Non-Negotiable)

- Body text contrast: ≥4.5:1 (WCAG AA)
- Large text / UI elements: ≥3:1
- Focus rings: visible, styled, never hidden
- Touch targets: ≥44px × 44px (Apple HIG)
- Reduced motion: every animation has a named fallback
- Form fields: associated labels (not placeholder-only)
- ARIA: roles defined, icon buttons labeled, live regions for dynamic content
