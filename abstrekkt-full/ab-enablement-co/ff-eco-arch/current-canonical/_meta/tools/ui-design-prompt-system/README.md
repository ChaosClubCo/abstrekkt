# UI Design Prompt System (ZIP_SPEC)

> Reconstructed and consolidated from **two** source chats:
> 1. `Production-ready UI design prompts library` (uuid `d1a75939…`, batch-0001) —
>    10 UI prompts authored, then rewritten as max-depth "production UI specs" with
>    explicit IA, components, states, a11y, data, and export contracts.
> 2. `Production-grade UI prompt pack with design tokens` (uuid `98f8d2db…`, batch-0001) —
>    a 30-prompt Stitch-ready pack (original 10 + 10 upgraded + 10 new), two brand
>    headers (FlashFusion / INTINC) with real design tokens, a strict enforcement
>    block, and a security/a11y validation audit (8.5 → 9.2/10 after fixes).
>
> This package merges both: the deep per-screen specs from chat 1, the token system
> + governance + audit from chat 2, de-duplicated into one paste-ready prompt library
> plus machine-readable design tokens.

## 1. Executive Summary

A **paste-ready prompt system** that drives any AI UI generator (Stitch, Gemini,
Lovable, Figma-first tools) to produce a *cohesive, production-grade UI system* —
not disconnected mockups. It pairs **~30 screen prompts** (organized by component/
screen type) with a reusable **Brand Header → Enforcement Block → Prompt 0** stack
that locks one design system, one token palette, and full interaction-state coverage
across every screen. Design tokens are materialized in both **`tokens.json`** (W3C
design-tokens format) and **`tokens.css`** (drop-in custom properties) for two
themes — FlashFusion (neon-glass) and INTINC (enterprise-clean) — plus a Hybrid
alternating mode. The system ships with the source's own validation audit baked in:
hallucinated tool features were softened, missing permission gates added, WCAG
validation made explicit, and code-export claims reframed as design *mapping
references* rather than generated code.

## 2. Build

The system is assembled from three layers you paste in order:

1. **Brand Header** (one of A/B/C) — color tokens, gradients, shapes, typography,
   density. Source of truth mirrored in `tokens/`.
2. **Enforcement Block** — strict "do/don't" governance: one design system,
   token-locked colors, WCAG AA, state completeness, Figma export discipline,
   destructive-action confirms, motion governance, and an autofix + quality gate.
3. **Prompt 0** — global grid/typography/component/state contract.

Then paste one or more **screen prompts** from `prompts/10`–`prompts/50`. Each
screen prompt offers a COMPACT (paste-ready, for tools that truncate) form and,
where available, a MAX-DEPTH spec carried from chat 1. Full instructions:
`docs/USAGE.md`.

## 3. Output

When run correctly you get:
- A **cohesive UI system**: consistent shell, typography scale, components, tokens,
  and interaction patterns across all screens.
- **Desktop + mobile variants** where specified (1440 / 1024 / 390 contracts).
- **Full state coverage**: loading / empty / error / success / disabled /
  permission-gated (with documented exceptions for static/marketing screens).
- **Figma-ready structure**: `[App]/[Area]/[Screen]/[State]` frames, auto-layout,
  reused components.
- **Real design tokens** you can compile to CSS/iOS/Android via style-dictionary.

## 4. Architecture

```
   Brand Header (A/B/C)        Enforcement Block          Prompt 0
   ┌──────────────────┐        ┌────────────────┐        ┌──────────────┐
   │ tokens: color,   │        │ one system,    │        │ grid / type  │
   │ gradient, shape, │──────▶ │ token-lock,    │──────▶ │ components / │
   │ type, density    │        │ WCAG, states,  │        │ states /     │
   │  (FF / INT / Hy) │        │ export, confirm│        │ output       │
   └────────┬─────────┘        └───────┬────────┘        │ contract     │
            │                          │                 └──────┬───────┘
            │     mirrored as          │                        │
            ▼                          ▼                        ▼
   ┌──────────────────┐        ┌───────────────────────────────────────┐
   │ tokens/          │        │  Screen prompts (by type)             │
   │  tokens.json     │        │  10 settings/account/admin            │
   │  tokens.css      │        │  20 dashboards/data-ops               │
   └──────────────────┘        │  30 collaboration/productivity        │
                               │  40 marketing/content/commerce        │
   post-export validation ◀────│  50 readers/utilities/specialized     │
   (WCAG, naming, drift)       └───────────────────────────────────────┘
```

Three honesty constraints carried from the sources:
1. **Generators emit design, not code** — "Android XML/Kotlin" / "CSS-JSON export"
   outputs are *mapping references*; a developer implements from them.
2. **Tool-mode claims are conditional** — "Pro mode / advanced reasoning" may not
   exist; quality comes from prompt structure, not a special mode.
3. **Glass can fail WCAG** — FlashFusion glass surfaces need a solid-surface fallback
   and a real post-export contrast check.

## 5. Production Deliverables (file tree)

```
ui-design-prompt-system/
├── README.md                              (this file)
├── prompts/
│   ├── 00-style-header-and-governance.md  Brand Headers A/B/C + Enforcement Block + Prompt 0
│   ├── 10-settings-account-admin.md       P01 Settings, P03 Android, P11 Admin, P20 Flags, P26 Security
│   ├── 20-dashboards-data-ops.md          P06 Analytics, P12 Pipeline, P16 Status, P19 Health, P23 Inventory, P27 NOC
│   ├── 30-collaboration-productivity.md   P02 Collab, P10 Onboarding, P13 AI Chat, P21 Email, P22 Tickets, P24 Calendar
│   ├── 40-marketing-content-commerce.md   P04 Landing, P05 Feed, P14 Commerce, P17 Learning, P28 Creator, P29 Forms, P30 Search
│   └── 50-readers-utilities-specialized.md P07 Desktop, P08 Doc Viewer, P09 Comic, P15 Tokens Viewer, P18 Storage, P25 Billing
├── tokens/
│   ├── tokens.json                        W3C design-tokens: FlashFusion + INTINC + shared primitives
│   └── tokens.css                         drop-in CSS custom properties, [data-theme] switchable
└── docs/
    ├── USAGE.md                           paste order, batches, token integration, validation, troubleshooting
    ├── AUDIT.md                           the 10-issue validation audit (8.5 -> 9.2/10) with fixes
    └── prompt-lint-checklist.md           gate for authoring/editing prompts
```

The signature artifact is `prompts/00-style-header-and-governance.md` — paste it
first; the per-type screen prompts inherit its system.

## 6. Implementation Considerations

- **Generate the baseline first** — Prompt 0 + P01 Settings + P02 Collab App + P06
  Analytics establish the component library; the rest inherit it (see batches in USAGE).
- **One brand header per run** — mixing FlashFusion + INTINC in a single run confuses
  generators. Use Hybrid (C) for explicit per-screen alternation.
- **Tokens are the integration point** — compile `tokens.json` with style-dictionary
  for real platform output; the generator only produces design files.
- **Tier by speed** — FAST (layout) / PRO (+ states + data) / FINAL (+ schemas +
  events) lets you trade fidelity for iteration speed.

## 7. Performance / Security Notes

- **No secrets in the package** — prompts describe UIs; they contain no credentials,
  keys, or tokens. (Both sources were scanned; no secrets were present to strip.)
- **Untrusted-input safety** — these prompts generate *design specs*. Never wire a
  generator's output to auto-execute code; treat any emitted code as untrusted and review it.
- **Performance discipline is encoded** — dashboards/log-tails/large tables require
  virtualization + skeleton loaders (P06, P08, P23, P27, P30) to avoid UI lockups.
- **Security gates are encoded** — admin/billing/flags/security/storage prompts
  (P11, P14, P18, P20, P23, P25, P26) require permission-gating, destructive confirms,
  and re-auth for sensitive changes ([FIX-5.1]).
- **A11y is verify-don't-trust** — WCAG AA is prompted, but contrast must be checked
  post-export with real tooling ([FIX-5.2]); FlashFusion glass is the top failure risk.

## 8. Risk Checklist

| Risk | Status in this package |
|---|---|
| Observability | N/A for prompts; USAGE recommends Git-tagging each generation for traceability ([FIX-9.1]). |
| Dependency drift | Token compile depends on style-dictionary / Figma Tokens plugin (external). Model/tool versions kept generic ([FIX-1.4]). |
| Missing tests | No automated tests possible for prompts; substituted by `prompt-lint-checklist.md` + post-export validation + AUDIT. |
| Unclear ownership | FlashFusion/INTINC are Kyle's brand themes (per source). Confirm before external reuse. |
| Contradictions | Two sources disagree on prompt count (10 vs 30) and a glass-vs-contrast tension — reconciled below in CLAIMS CHECK. |
| Tenant isolation / auth | Encoded as prompt requirements (permission-gating, re-auth) but not enforced — they are design instructions, not runtime controls. |

## 9. Validation Checklist

- [ ] Brand Header + Enforcement Block + Prompt 0 paste cleanly above screen prompts.
- [ ] `tokens.json` is valid JSON and `tokens.css` switches via `data-theme`.
- [ ] Selecting a screen prompt yields full state coverage (or a documented exception).
- [ ] Figma export uses `[App]/[Area]/[Screen]/[State]` naming.
- [ ] WCAG AA contrast verified post-export (tooling, not eyeballing).
- [ ] Destructive/sensitive screens require confirm + permission gates.
- [ ] No off-palette colors; all colors trace to tokens.
- [ ] CLAIMS CHECK reviewed (below).

## 10. Recommended Next Steps

1. Compile `tokens.json` into a real component library (style-dictionary → CSS/Tailwind/iOS/Android).
2. Add a **light-mode token set** (deferred to v2.0 in the audit; FlashFusion is dark-only).
3. Add **RTL / CJK** internationalization variants (out of scope in v1.0).
4. Convert prompts to a parameterized format (YAML/TOML) with variables
   (`brandTokens`, `density`, `platform`, `exportTarget`) and auto-emit FAST/PRO/FINAL tiers.
5. Validate prompt→output quality against a real generator and capture screenshots
   as a drift baseline.

## 11. CLAIMS CHECK

**Verified (present in one or both sources):**
- The 10 base UI prompts and their max-depth rewrites (chat 1); the 30-prompt pack =
  10 original + 10 upgraded + 10 new (chat 2).
- Two fully-tokenized brand headers — FlashFusion (`#0F0618`/`#A855F7`/glass) and
  INTINC (`#0B1020`/`#3B82F6`/solid) — plus a Hybrid alternating mode (chat 2).
- The strict Enforcement Block (one design system, token-lock, WCAG AA, state
  completeness, Figma export rules, destructive confirms, motion governance) and
  Prompt 0 global style header (chat 2).
- The validation audit: 10 issues, severity-rated, all fixed; score 8.5 → 9.2/10 (chat 2).
- Tooling targets: Stitch, Gemini Pro/Flash, Claude Projects, Lovable, Figma-first (both chats).

**Inferred (this kit's reconstruction):**
- The by-type folder layout (settings/dashboards/collaboration/marketing/readers) and
  the merge of chat-1 max-depth specs with chat-2 compact + governance forms.
- `tokens.json` / `tokens.css` as concrete files (the sources stated tokens inline as
  prose; this kit materializes them in W3C + CSS formats).
- The `prompt-lint-checklist.md` and the consolidated USAGE/AUDIT docs.

**Unresolved / caveats (flagged by the sources themselves):**
- "Stitch Pro mode / advanced reasoning" is **unverified** — softened to tool-agnostic phrasing.
- Token/CSS/JSON and Android XML/Kotlin "export" are **aspirational**: generators emit
  design files, not code; treated as mapping references.
- WCAG AA is **prompted, not guaranteed** — requires post-export contrast tooling.
- "Regenerate every 5 screens" is a **context-decay assumption**, true for some tools only.
- Light mode, RTL/CJK i18n, and <390px legacy phones are **out of scope for v1.0**.
- The model/tool version landscape (e.g., "Gemini 3 Flash") may be **stale**.

**Contradictions (where the two sources disagree, and how this kit reconciles them):**
- **Prompt count: 10 vs 30.** Chat 1 delivers 10 deeply-specified prompts; chat 2
  expands to 30. → Reconciled by keeping all 30 screens, using chat-1's max-depth specs
  for the overlapping 10 and chat-2's compact form + the extra 20.
- **Detail philosophy.** Both chats raise "more detail always helps" then refute it:
  chat 1 warns long prompts get truncated; chat 2 warns over-constraining every pixel
  kills layout quality. → Reconciled by shipping COMPACT + MAX-DEPTH variants so the
  user picks based on their tool's input limits.
- **Glass vs. contrast (internal tension in chat 2's own audit).** FlashFusion's
  glassmorphic surfaces + glow can fail WCAG AA, contradicting the Enforcement Block's
  contrast rule. → Reconciled with an explicit solid-surface fallback in `tokens.css`
  and a mandatory post-export contrast check.
- **Density vs. marketing whitespace.** "Pro"/"Ops" density rules conflict with
  hero/marketing sections. → Reconciled by scoping density to data/admin screens; marketing
  screens (P04, P16, P17, P28) may use larger whitespace.
- Note: the web "best practices" the sources alluded to were **not re-fetched** during
  reconstruction.
