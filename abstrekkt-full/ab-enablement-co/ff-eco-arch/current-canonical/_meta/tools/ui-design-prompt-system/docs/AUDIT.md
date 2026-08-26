# Validation Audit — UI Prompt System

Reconstructed from the audit performed in source chat `98f8d2db`. The system was
scored **8.5/10 before fixes, 9.2/10 after**. All 10 issues below are corrected in
the shipped prompts (look for `[FIX-*]` tags in `prompts/`).

> Auditor framing (from source): Staff AppSec + Platform Engineer, security-first.
> Result: strong system, ~10 fixable issues, mostly minor.

## What was working
- Consistent component library enforced across all prompts.
- State completeness (loading/empty/error/success/permission) ~90% coverage.
- Figma export discipline mostly present (naming + auto-layout hints).
- Security + A11y checkpoints built into admin/billing/flags/security prompts.
- Both brand headers (FlashFusion / INTINC) well-tokenized.

## Findings & fixes

| # | Category | Issue | Severity | Fix applied |
|---|---|---|---|---|
| 1.1 | Hallucination | Stitch "Pro mode" / "advanced reasoning" unverified | Medium | [FIX-1.1] Replaced with tool-agnostic "if your generator supports multi-step reasoning, use it; else standard mode". |
| 1.2 | Hallucination | "Export tokens to CSS/JSON" presented as automatic | Medium | [FIX-1.2] Clarified: export Figma → extract via Figma Tokens plugin / style-dictionary. Canonical tokens shipped in `tokens/`. |
| 1.3 | Hallucination | "Material 3 → XML/Kotlin" implies generated code | Medium | [FIX-1.3] Reframed Figma output as a *mapping reference*, not final Android code. |
| 1.4 | Stale | "Gemini 3 Flash" reference | Low | [FIX-1.4] Softened to "fast iteration mode (e.g. Gemini Flash / latest available)". |
| 2.1 | Contradiction | FlashFusion glass + glow vs. WCAG AA contrast | Low | [FIX-2.1] Added contrast fallback note (swap surface → solid bg1); enforced in tokens.css comment. |
| 2.2 | Contradiction | Density rules ("Pro"/"Ops") vs. marketing hero whitespace | Very Low | [FIX-2.2] Documented density scope: data screens only; marketing may use larger whitespace. |
| 3.x | Gap | 6 prompts missing context-specific states | Low | [FIX-3.1..3.6] Added: doc-viewer no-results, comic end-of-book, e-commerce payment error, learning lesson-unavailable, email offline/sync-error, inventory scan-error. |
| 4.x | Gap | ~50% of prompts lacked explicit Figma frame naming | Low | [FIX-4.1/4.2] Standardized `[App]/[Area]/[Screen]/[State]` + `[Type]/[Variant]` in Enforcement Block + per-prompt. |
| 5.1 | Security | Missing permission/confirm gates in P14, P18, P23 | **Medium** | [FIX-5.1] Added typed-confirmation / re-auth for delete/refund/inventory-discard. |
| 5.2 | Accessibility | WCAG validation not tooled | **Medium** | [FIX-5.2] Added post-export contrast-check step (Figma Contrast / WebAIM). |
| 5.3 | Gap | No light-mode fallback | Very Low | [FIX-5.3] Documented as intentional (dark-first); light tokens deferred to v2.0. |
| 6.1 | Responsive | <390px (legacy phones) untested | Very Low | [FIX-6.1] Added mobile edge-case guidance (stack columns, hide non-critical UI). |
| 7.1 | i18n | No RTL/CJK support | Very Low | [FIX-7.1] Flagged out-of-scope for v1.0; v2.0 plan noted. |
| 8.1 | Stale | "Regenerate every 5 screens" treated as hard rule | Low | [FIX-8.1] Softened to adaptive drift-check (>10% deviation → regenerate). |
| 9.1 | Ops | No design-system version control mentioned | Very Low | [FIX-9.1] Added Git tagging / token-versioning guidance to USAGE. |

## State-completeness matrix (spot-check summary)

90% of 30 prompts had full state coverage. Documented exceptions: P04 & P16
(marketing/static), P07 (context-switching), P09 (e-ink/end-of-book). All other
gaps were closed by [FIX-3.x].

## Final scores (post-fix)

| Dimension | Before | After |
|---|---|---|
| Completeness | 9/10 | 9.5/10 |
| Consistency | 8/10 | 9/10 |
| Security | 8/10 | 9/10 |
| Accessibility | 7/10 | 9/10 |
| Realism | 8.5/10 | 9.5/10 |
| Documentation | 8/10 | 9/10 |
| **Overall** | **8.5/10** | **9.2/10** |

**Go / No-Go:** GO — bundle validated, fixes applied.
