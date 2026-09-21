# Troubleshooting — "Something went wrong (3)" & Safety Filters

When you try to **save** custom instructions to Gemini Saved info and get a generic
**"Something went wrong (3)"** with no specific reason, it is almost always a **safety/policy filter** or a **character-limit** trip — not a network error. Saved-info (persistent memory) filters are stricter than live chat.

## Remediation order (try top to bottom)

| # | Trigger | Symptom | Fix |
|---|---|---|---|
| 1 | **Minors' / family PII** (a child's name) | Save blocked | Replace with generic phrasing: "a parent who builds educational apps on Fridays." |
| 2 | **Google internal tool names** — `Antigravity`, `Opal`, `Search Labs`, `Stax` | Save blocked | Drop them or say "Google's AI tools" / "Google Labs tools." |
| 3 | **Compliance liability keywords** — `HIPAA`, `PCI-DSS`, `SOC2` | Disclaimer/liability filter | Soften to "standard industry, healthcare, and payment-card frameworks." Don't claim certification. |
| 4 | **Adversarial phrasing** — "work around Gemini limitations" / "bypass" | Reads as guardrail-bypass | Reframe as "optimize queries" / "Gemini-specific workarounds." |
| 5 | **XML / pseudo-system tags** — `<role>`, `<context>`, `<constraints>` | Reads as prompt injection | Remove tags; use plain Markdown headers or prose. The field is already the system context. |
| 6 | **Length** — over ~1,500 chars | Generic error, no "too long" warning | Trim the Examples or Background section. Test with biographical paragraphs only. |

## Minimal-bisect procedure

If it still fails after sanitizing:
1. Save **only the first paragraph** (name/role/stack bio). Confirm it saves.
2. Add one paragraph at a time, saving after each, until it fails — the last addition is the culprit.
3. Sanitize or shorten that block.

## Sanitization checklist (untrusted-input hygiene)

Before pasting **any** instruction text into Gemini:
- [ ] No real secrets/API keys/tokens — only `.env.example` placeholders.
- [ ] No names of minors or other people's PII.
- [ ] No verbatim private Workspace content (summarize instead).
- [ ] No internal/confidential tool or project codenames.
- [ ] No "bypass/jailbreak/ignore your rules" phrasing.

> The pre-built `instructions/01-personal-context-SAFE.md` already passes all six checks.

Source: consolidated from chat `dc8bfe99` (the full save-error debugging thread) and `0204f841` (sanitized base instructions). Specific keyword triggers are the source's diagnosis, a strong heuristic, not a published Google rule.
