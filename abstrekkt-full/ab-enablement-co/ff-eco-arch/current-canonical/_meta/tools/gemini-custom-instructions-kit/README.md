# Gemini Custom Instructions Kit (ZIP_SPEC)

> Reconstructed and consolidated from THREE source chats (all batch-0001):
> - `Optimizing-Gemini-custom-instructions-for-Google-ecosystem` (uuid `0204f841…`) — the canonical/final consolidation: tier pricing, the "natural language, first-person" correction, the base instruction set, and 15 Super Gems.
> - `Gemini-custom-instruction-strategies` (uuid `8c3a240f…`) — the largest source: `@Gmail`/`@Drive`/`@Calendar` Workspace tagging, Saved info + Gemini Apps Activity mechanics, retention/ZDR specifics, multimodal/1M-token context notes.
> - `Crafting-effective-Gemini-instructions` (uuid `dc8bfe99…`) — the "Something went wrong (3)" save-error debugging thread and the Four-Part Framework (Persona/Task/Context/Format) translation from Claude-style prompts.
>
> **Target platform: Google Gemini** (Gemini Apps personalization / "Saved info" / Gems), **not Claude.** The instruction text in this kit is written to paste into Gemini.

This kit converts a heavy, Claude-style system prompt (security-first Staff Engineer persona) into Gemini-native custom instructions that actually save without tripping safety filters, fit Gemini's character constraints, and exploit the Google ecosystem (Workspace, Drive, Gmail, NotebookLM, AI Studio, Deep Research).

## 1. Executive Summary

The three source chats are one continuous effort: Kyle (a security-first Staff/AppSec Engineer) tried to port his ~8,000-word Claude system prompt into Gemini and hit two walls — (1) a generic **"Something went wrong (3)"** error when saving, and (2) Gemini's preference for short, conversational, first-person personalization rather than long XML/Markdown templates.

The resolution, distilled here:

- **Gemini "Saved info" / "Your instructions for Gemini" wants natural-language, first-person bio + preferences**, roughly **under ~1,500 characters**, and **rejects** content with: minors' PII (a child's name), Google internal tool names (`Antigravity`, `Opal`), compliance liability keywords (`HIPAA`, `PCI-DSS`), adversarial phrasing (`work around Gemini limitations`), and `<xml>` prompt-injection-looking tags.
- **Heavy, structured, role-specific instructions belong in Gems** (Gemini's saved assistants), which tolerate longer, more structured instructions following Google's **Persona / Task / Context / Format** four-part framework.
- The **Google ecosystem** is the differentiator: instruct Gemini to use `@Gmail`, `@Drive`, `@Calendar` tagging, NotebookLM for synthesis, Deep Research for analysis, AI Studio for prototyping.

This package materializes: **3 ready-to-paste personal-context instruction sets** (safe/condensed/comprehensive), **15+ Super Gems**, an **install guide** (where to paste, character limits, tier differences), a **safety-filter remediation guide**, and a **validation test set**.

## 2. Build (what is in this package)

Real, paste-ready artifacts — no placeholders. Instruction bodies are working text taken from the best version across the three chats, de-duplicated and sanitized.

- `instructions/01-personal-context-SAFE.md` — the recommended default. ~1,450 chars, first-person, **safety-filter compliant** (PII/internal-tools/compliance keywords removed). Paste into Gemini → Saved info.
- `instructions/02-personal-context-COMPREHENSIVE.md` — fuller security/OWASP/observability baseline for users who want maximum depth and accept it may need trimming or a Gem instead of Saved info.
- `instructions/03-four-part-framework-GEM.md` — the Persona/Task/Context/Format structured template (for a custom Gem, not Saved info).
- `gems/super-gems.md` — 15 copy-paste Gem definitions (PRD, KB, SOP, Persona, Architecture, Codebase Scaffolder, Automation Creator, API Integration, Security Auditor, Performance Engineer, Incident Response, Doc Refactor, Code Review, Data Migration, Onboarding).
- `docs/INSTALL.md` — where each field lives in Gemini, character limits, Pro vs Ultra tier, install + organize checklist.
- `docs/SAFETY-FILTER-FIXES.md` — the "Something went wrong (3)" remediation table and a sanitization checklist (untrusted-input handling).
- `docs/VALIDATION.md` — acceptance criteria + a test prompt set to confirm the instructions took effect.

## 3. Output (file tree)

```
gemini-custom-instructions-kit/
├── README.md                               (this file)
├── instructions/
│   ├── 01-personal-context-SAFE.md         recommended; ~1,450 chars, filter-safe, paste into Saved info
│   ├── 02-personal-context-COMPREHENSIVE.md fuller baseline; OWASP/observability depth
│   └── 03-four-part-framework-GEM.md        Persona/Task/Context/Format template for a custom Gem
├── gems/
│   └── super-gems.md                       15 ready-to-paste Gem definitions
└── docs/
    ├── INSTALL.md                          where to paste, char limits, Pro vs Ultra, checklist
    ├── SAFETY-FILTER-FIXES.md              "Something went wrong (3)" remediation + sanitization
    └── VALIDATION.md                       acceptance criteria + test prompts
```

## 4. Implementation Considerations

- **Two surfaces, two formats.** Don't paste a Gem-sized instruction into Saved info — it will either truncate or throw the save error. Saved info = short bio; Gems = structured depth.
- **Character budget is real but undocumented.** Sources observed a practical cap around **~1,500 characters** for the Saved info field on the Pro tier. Treat 1,500 as a ceiling, not a target. If a save fails and content is clean, trim first.
- **Tier matters for capability, not for the instructions themselves.** Pro ($19.99/mo, ~1,500 prompts/day, 5 Deep Research/mo, 128k context) vs Ultra ($29.99/mo, unlimited, 1M-token context, early model access). See `docs/INSTALL.md`. *(Pricing/limits are source-reported snapshots — verify before relying on them.)*
- **Saved info ≠ bigger context window.** Personalization and chat history personalize responses; they do **not** expand the 1M-token input cap. Long tasks still need chunking.
- **Ecosystem tagging is opt-in per prompt.** `@Gmail`/`@Drive`/`@Calendar` are invoked in the chat prompt; the instructions tell Gemini to *prefer* them, but the user still tags at use time.

## 5. Performance / Security Notes

- **No secrets in any artifact.** All credentials are `.env.example`-style placeholders. The instructions explicitly tell Gemini never to echo secrets.
- **PII was stripped during reconstruction.** A child's first name present in the source instructions was replaced with generic phrasing ("a parent who builds educational apps on Fridays"). This was both a privacy fix and the documented cause of the save error.
- **Privacy/retention reality (source-reported):** Gemini Apps activity is retained **18 months by default**, adjustable to **3 or 36 months** or off; even when off, Google may retain conversations **up to 72 hours** for service continuity, and human annotators may review activity. **Vertex AI** offers zero-data-retention configs for enterprise. Do not paste private Workspace content into Saved info — summarize instead.
- **Untrusted input handling:** chat content is treated as untrusted. The kit flags/sanitizes secrets and PII and never auto-executes any extracted code. The Super Gems generate code; that output must be reviewed before running.
- **Over-fitting risk:** the personas are tuned to one user's exact stack (Next.js 15 / Supabase / Vercel / n8n). Edit `instructions/` to your own stack before adopting, or Gemini will default to choices you don't use.

## 6. Recommended Next Steps

1. Paste `instructions/01-personal-context-SAFE.md` into Gemini → Settings → Saved info, then run the two prompts in `docs/VALIDATION.md`.
2. Create the Gems you actually use first (Codebase Scaffolder, Automation Creator, Security Auditor); skip the rest until needed.
3. Replace stack/role/company specifics with your own before rollout (de-risk over-fitting).
4. If saving fails, work through `docs/SAFETY-FILTER-FIXES.md` top-to-bottom (PII → internal tool names → compliance keywords → XML tags → length).
5. Re-verify the Pro/Ultra pricing and character limit against Google's current docs — these drift.

## 7. CLAIMS CHECK

**Verified (present in the source chats):**
- The "Something went wrong (3)" save error and its diagnosed causes: minors' PII, Google internal tool names (`Antigravity`, `Opal`), compliance keywords (`HIPAA`, `PCI-DSS`), adversarial phrasing, and `<xml>` tags.
- Gemini Saved info expects natural-language, first-person context; XML/heavy templates are discouraged; ~1,500-char practical limit observed.
- The Four-Part Framework (Persona/Task/Context/Format) and "omit fluff / terminate on completion" guidance (from Google's own examples quoted in chat).
- The base personal-context instruction set (~1,450 chars) and the 15 Super Gems (verbatim consolidation from uuid `0204f841`).
- `@Gmail`/`@Drive`/`@Calendar` Workspace tagging; NotebookLM/Deep Research/AI Studio roles (uuid `8c3a240f`).
- Retention windows (18mo default, 3/36mo, off; 72h continuity; human review; Vertex ZDR) and 1M-token context cap (uuid `8c3a240f`).
- Pro $19.99 / Ultra $29.99 tier framing (uuid `0204f841`).

**Inferred (this kit's build, not verbatim in source):**
- The split into SAFE vs COMPREHENSIVE vs GEM files, the file tree, the install/validation/troubleshooting docs, and the acceptance criteria.
- Labeling SAFE as the recommended default.

**Unresolved / caveats:**
- Exact character limit is **not officially documented**; ~1,500 is an observed value that varies by tier/region. Treat as approximate.
- Pricing and per-tier quotas are point-in-time snapshots from the chat (Gemini 2.5/3 era) and will change — flagged, not relied upon.
- Whether each specific keyword (`Opal`, `HIPAA`, etc.) *always* triggers the filter is the source's diagnosis, not a published Google rule; it is a strong heuristic.

**Contradictions (where the three sources disagree):**
- **Format philosophy:** the third chat (`dc8bfe99`) leans into a heavy **Markdown PERSONA/TASK/CONTEXT/FORMAT template** (4,847-char "comprehensive" version) as the answer; the first chat (`0204f841`) later **reverses** this, concluding Gemini wants short conversational first-person text and that the heavy template belongs in a Gem, not Saved info. This kit follows the first chat's later conclusion (SAFE default) but preserves the template as `03-four-part-framework-GEM.md`.
- **Verbosity:** the user's own inputs contradict each other ("be concise, no fluff" vs "never abbreviate, always verbose"). The chats resolved this to **"comprehensive, never fluff"** (always cover security/observability; drop conversational padding). That resolution is what the instructions encode.
- **Compliance keywords:** `dc8bfe99` keeps `SOC2/HIPAA/PCI-DSS` in a "comprehensive" version while simultaneously documenting that those keywords trigger the save filter — an internal tension. This kit resolves it by softening to "standard industry / healthcare / payment-card frameworks" in pasteable text.

## Risk Checklist

- [x] **Secrets/PII in instructions** — child's name removed; all secrets are placeholders.
- [x] **Over-fitting** — flagged; instructions are one user's stack, edit before reuse.
- [x] **Contradictions between versions** — documented above; SAFE default chosen, template preserved.
- [x] **Unclear ownership** — instructions are user-scoped personalization; Gems are per-account. No shared-ownership ambiguity, but note Saved info is per-Google-account.
- [x] **Missing validation** — `docs/VALIDATION.md` supplies acceptance tests.
- [x] **Untrusted input** — source treated as untrusted; no auto-execution of generated code.
