# 00 — Global Style Header, Brand Headers & Enforcement Block

> Paste order for any AI UI generator (Stitch / Gemini / Lovable / Figma-first):
> **Brand Header (A, B, or C) → Enforcement Block → Prompt 0 → screen prompts.**
> Pick ONE brand header per run. Mixing multiple headers in one run confuses generators.

These are the "glue" that makes the screen prompts produce a consistent *system*
instead of a pile of unrelated mockups. Token values are the single source of
truth — they are mirrored machine-readably in `../tokens/tokens.json` and
`../tokens/tokens.css`.

---

## BRAND HEADER A — FLASHFUSION THEME

```
BRAND HEADER — FLASHFUSION THEME (APPLY CONSISTENTLY ACROSS ALL SCREENS)

Brand vibe: neon-glass, cosmic circuitry, premium creator-tech. Dense but elegant. Dark-mode-only.

COLOR TOKENS
- bg0 (app background): #0F0618
- bg1 (panel): #140A22
- surface (card glass): rgba(255,255,255,0.06)
- surfaceBorder: rgba(255,255,255,0.10)
- textPrimary: #F6F0FF
- textSecondary: rgba(246,240,255,0.72)
- muted: rgba(246,240,255,0.45)

ACCENTS
- primaryGlow: #A855F7
- secondaryGlow: #F472B6
- cyanAccent: #22D3EE
- success: #34D399
- warning: #FBBF24
- danger: #FB7185
- info: #60A5FA

GRADIENTS
- heroGradient: radial-gradient(1200px circle at 20% 10%, rgba(168,85,247,0.40), transparent 55%),
                radial-gradient(900px circle at 80% 30%, rgba(244,114,182,0.28), transparent 60%),
                radial-gradient(700px circle at 60% 80%, rgba(34,211,238,0.18), transparent 55%)
- accentGradient: linear-gradient(90deg, #A855F7 0%, #F472B6 55%, #22D3EE 100%)

SHAPES + DEPTH
- radius: 16px cards, 12px inputs, 999px pills
- shadowSoft: 0 8px 30px rgba(0,0,0,0.35)
- glow: 0 0 0 1px rgba(168,85,247,0.25), 0 0 24px rgba(168,85,247,0.18)

CONTRAST NOTE: If glass surfaces + glow reduce text readability below WCAG AA,
substitute surface with solid bg1 (#140A22) and keep borders + glows. Test contrast post-export.

TYPOGRAPHY
- Headings: Poppins (or nearest modern geometric)
- Body/UI: Inter (or nearest clean sans)
- Numbers: tabular figures for dashboards

COMPONENT STYLE RULES
- Cards are glassmorphic: blurred feel (subtle), thin borders, soft glows on hover/focus.
- Buttons: primary uses accentGradient; secondary is glass with border; danger uses #FB7185.
- Inputs: dark glass with clear focus ring (primaryGlow) + helper text under.
- Charts: dark background with bright lines; do not use busy gridlines.
- Icons: thin-line (Lucide-like), consistent stroke.

MOTION
- Fast, minimal: 120-180ms for hover/focus; 220-300ms for modal transitions.
- Respect prefers-reduced-motion: provide static fallback.

DENSITY
- "Creator" density: compact, elegant; avoid oversized paddings; keep legible.
- DENSITY SCOPE: applies to data/admin screens. Marketing/hero sections may use larger whitespace.
```

---

## BRAND HEADER B — INTINC THEME

```
BRAND HEADER — INTINC THEME (APPLY CONSISTENTLY ACROSS ALL SCREENS)

Brand vibe: enterprise clean, trustworthy, clarity-first, accessibility-forward. Dense, data-friendly.

COLOR TOKENS
- bg0: #0B1020
- bg1: #0F172A
- surface: #111C33
- surfaceBorder: rgba(255,255,255,0.10)
- textPrimary: #E8EEF9
- textSecondary: rgba(232,238,249,0.72)
- muted: rgba(232,238,249,0.50)

ACCENTS
- primary: #3B82F6
- secondary: #22C55E
- highlight: #06B6D4
- warning: #F59E0B
- danger: #EF4444
- neutral: #94A3B8

GRADIENTS (SUBTLE)
- headerWash: linear-gradient(180deg, rgba(59,130,246,0.18) 0%, transparent 60%)
- accentGradient: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)

SHAPES + DEPTH
- radius: 12px cards, 10px inputs, 999px pills
- shadow: 0 10px 30px rgba(0,0,0,0.35)
- borders: crisp, consistent, 1px; less glow, more clarity

TYPOGRAPHY
- Headings: Inter (or SF-like)
- Body/UI: Inter
- Emphasis: semibold labels; use clear microcopy

COMPONENT STYLE RULES
- Cards: solid surfaces, clear separators, strong information hierarchy.
- Buttons: primary solid #3B82F6; secondary outline; destructive #EF4444.
- Tables: dense, zebra subtle, sticky headers, clear sorting states.
- Charts: simple, readable, high contrast; include legends and tooltips.
- Icons: clean, consistent stroke, enterprise-friendly.

MOTION
- Subtle: 120-180ms interactions, minimal parallax.
- Provide reduced motion fallback.

DENSITY
- "Ops" density: information-dense but scannable; avoid giant hero blocks.
- DENSITY SCOPE: applies to data/admin screens. Marketing/hero may use larger whitespace.
```

---

## BRAND HEADER C — HYBRID ALTERNATING

```
BRAND HEADER — HYBRID ALTERNATING MODE

Apply BOTH themes but alternate per screen in numeric order:
- Odd-numbered screens (01, 03, 05, ...) use FLASHFUSION THEME (Brand Header A).
- Even-numbered screens (02, 04, 06, ...) use INTINC THEME (Brand Header B).

Hard rule: layout + components remain the SAME system; only colors, gradients,
and surface styling change.

Typography consistency: Headings Poppins, Body Inter (or closest equivalents)
for BOTH — never swap fonts between screens. This prevents jarring transitions.

DENSITY NOTE: "Creator" (FlashFusion) and "Ops" (INTINC) densities can coexist
if a consistent breakpoint/spacing scale is applied. Enforce via Prompt 0.
```

---

## ENFORCEMENT BLOCK — STRICT UI GOVERNANCE

> Paste this AFTER the chosen Brand Header and BEFORE Prompt 0. Re-paste every
> 5-10 generations if the tool starts drifting. All [FIX-*] tags are corrections
> applied during the validation audit (see `../docs/AUDIT.md`).

```
ENFORCEMENT BLOCK — STRICT UI GOVERNANCE (APPLY TO ALL SCREENS)

HARD "DO" RULES (NON-NEGOTIABLE)

1) ONE DESIGN SYSTEM
   Reuse the same base components across every screen: buttons, inputs, cards,
   tables, tabs, modals, drawers, toasts, tooltips, breadcrumbs.
   Do NOT invent new component styles per screen. Variation is allowed only in
   content/layout, not component DNA.

2) TOKEN-LOCKED COLORS ONLY
   Only use colors defined in the chosen Brand Header tokens.
   No random accent colors, no extra neon hues, no off-palette gradients.
   If you need a new shade, derive it ONLY by adjusting opacity of an existing
   token (same hue family).

3) ACCESSIBILITY (WCAG AA MINIMUM)
   Maintain readable contrast for text, icons, and interactive elements.
   All interactive controls must have visible focus rings and proper labels.
   Error states must include plain-language instructions to fix the problem.
   [FIX-5.2] Post-export validation: verify with Figma Contrast plugin or WebAIM.

4) RESPONSIVE CONTRACT
   Desktop 1440 baseline, with explicit behavior for 1024 and 390.
   - At 1024: collapse right-side panels into a drawer or tabs.
   - At 390: prioritize one primary column, sticky bottom CTA when relevant.
   [FIX-6.1] Mobile edge cases (320-375px): stack all columns, hide non-critical UI.

5) STATE COMPLETENESS EVERYWHERE
   Every screen MUST include (where applicable):
   - Default
   - Loading (skeleton)
   - Empty
   - Error (with retry or recovery path)
   - Success (toast/snackbar or completion state)
   - Disabled
   - Permission-gated (hide/disable + explanation)
   Marketing/static screens (landing pages, status pages) are documented exceptions.

6) TABLE + DASHBOARD STANDARDS
   Sticky table header on scroll. Clear sorting indicators.
   Pagination or infinite scroll WITH virtualization notes.
   Filter chips + reset-filters control.

7) FORM STANDARDS
   Inline validation with helper text (below fields).
   Save/Discard pattern for unsaved changes (sticky bar).
   [FIX-5.1] Destructive actions must require a confirm step. For high-risk
   (delete, refund, inventory discard): require typed confirmation or re-auth.

8) ICONOGRAPHY + TYPE CONSISTENCY
   Single icon style (thin-line, consistent stroke).
   Typography must not change between screens (same heading/body scale).

9) LAYERING / EXPORT (FIGMA-READY) — [FIX-4.2] STANDARDIZED FOR ALL SCREENS
   - Frame naming: [App]/[Area]/[Screen]/[State]
   - Component naming: [Type]/[Variant] (e.g., Button/Primary, Input/Text, Modal/Confirm)
   - Use Auto-Layout for: cards, lists, tables, toolbars, forms.
   - Reuse components rather than duplicating.
   NOTE: Most generators export design files, not raw CSS/JSON. To extract tokens
   to code, use the Figma Tokens plugin or style-dictionary CLI (see ../tokens/).

10) MOTION GOVERNANCE
   Motion is subtle and purposeful only.
   Respect prefers-reduced-motion: provide static fallback states.

HARD "DON'T" RULES (FORBIDDEN)

A) Do NOT use: neon rainbow palettes outside token set; excessive glow that
   reduces legibility; random font swaps or mixed serif/sans; ultra-rounded
   "bubble UI"; gigantic hero sections inside dashboards/admin tools;
   low-contrast placeholder text as primary labels; text embedded in images;
   decorative backgrounds behind tables/forms (keep data surfaces clean).
B) Do NOT ship "happy-path-only" screens. If a screen lacks
   loading/empty/error/success/permission states, regenerate it.
C) Do NOT create inconsistent spacing. Use one spacing scale across all screens.
D) Do NOT change typography scale or component size per screen without explicit
   reasoning (don't enlarge a button on one screen only).

AUTOFIX INSTRUCTIONS (IF YOU VIOLATE ANY RULE)
- Regenerate the affected screen(s) using the same Prompt 0 + Brand Header.
- Reduce effects first (glow/shadow), then restore contrast, then normalize spacing.
- Re-check the states list and component reuse before final output.

QUALITY GATE (FINAL CHECKLIST)
[ ] All screens share the same shell + component library
[ ] All colors come from tokens only
[ ] WCAG AA contrast maintained for text + controls (tested post-export)
[ ] All required states exist
[ ] Responsive behavior described for 1440/1024/390
[ ] Figma structure uses clear naming + Auto-Layout
[ ] Destructive actions have confirmation UI
[ ] Permission-gated areas are explicitly labeled
```

---

## PROMPT 0 — GLOBAL STYLE / SYSTEM DESIGN

```
PROMPT 0 — GLOBAL STYLE HEADER (APPLY TO ALL SCREENS)

You are designing a studio-grade, production-ready UI system (not a generic
admin template). Use one consistent design system across all screens:

LAYOUT
- Desktop: 12-column grid (1440px), consistent 16px/24px spacing scale.
- Tablet: 8-column grid (1024px), same spacing scale, collapse right panels to drawers.
- Mobile: 4-column grid (390px), stack columns, sticky bottom CTAs.

TYPOGRAPHY
- Clear hierarchy: H1/H2/H3/body/caption. Readable dense layouts; no whitespace-heavy
  marketing UI on data screens.

COMPONENTS (the shared library every screen reuses)
- buttons, inputs, toggles, tabs, chips, tables, cards, modals, drawers, toasts,
  tooltips, breadcrumbs, pagination.

STATES REQUIRED EVERYWHERE
- default, loading (skeleton), empty, error, success, disabled, permission-gated.

ACCESSIBILITY
- WCAG AA contrast, visible focus rings, keyboard nav, labeled controls, error
  messages that explain how to fix.

EXPORT RULES
- Name frames clearly. Group components logically. Provide auto-layout hints.
  Reuse components when repeating patterns.

OUTPUT CONTRACT for each screen prompt:
1) Screen(s) list
2) Layout notes + responsive behavior (1440/1024/390)
3) Component inventory
4) State inventory
5) Interaction notes (2-4 key flows)
```
