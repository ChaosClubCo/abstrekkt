# Prompt-Lint Checklist

Run this before adding or editing any screen prompt in this system. Derived from
both source chats' "prompt-lint" recommendation. A prompt that passes all checks
reliably forces a generator to emit shippable screens instead of "UI vibes".

## Structure (the four things weak prompts omit)
- [ ] **Role anchor** — a specific senior persona ("principal dashboard designer", etc.).
- [ ] **Single clear objective** — one screen/system, not a grab-bag.
- [ ] **Constraints** — grid, breakpoints, component library, density.
- [ ] **Output contract** — explicit list the model MUST return.

## Required output-contract items
- [ ] Screen(s) list / page map.
- [ ] Layout notes + responsive behavior (1440 / 1024 / 390).
- [ ] Component inventory (reusing the shared library).
- [ ] **State inventory** — default, loading, empty, error, success, disabled,
      permission-gated (mark documented exceptions for marketing/static screens).
- [ ] Realistic mock data (counts specified, not "lorem ipsum").
- [ ] Interaction notes (2-4 key flows).
- [ ] Figma export hints (frame naming, auto-layout, component grouping).

## Safety / governance
- [ ] Destructive actions require a confirm step (typed confirm / re-auth for high-risk).
- [ ] Sensitive screens (admin, billing, flags, security, storage) specify
      permission-gated visibility.
- [ ] A11Y called out explicitly (WCAG AA, focus order, error messaging).
- [ ] Colors reference tokens only — no off-palette hues.

## Honesty / realism
- [ ] No tool-feature assumptions stated as fact ("Pro mode", "auto CSS export").
      Frame tool-specific capabilities as conditional.
- [ ] Code-export claims framed as "design/mapping reference", not generated code.
- [ ] Model/version references kept generic or current.

## Anti-patterns to reject
- [ ] Over-constraining every pixel (kills layout quality) — constrain *structure
      and states*, not every dimension.
- [ ] Happy-path-only screens (no error/empty states).
- [ ] Inconsistent spacing / per-screen component reinvention.
- [ ] Hero/marketing blocks dropped into dense data/admin tools.
