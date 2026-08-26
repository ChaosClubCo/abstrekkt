# Context-Engineer Prompt Library (ZIP_SPEC)

> Reconstructed from source chat
> `Comprehensive-prompt-library-for-15-year-context-engineer` (uuid `89b8f85c…`,
> batch-0001). The source asked for a role-grouped, "context-engineered" prompt
> library (delivered as a "Lyra-Style" library, targeting "72 prompts") for an
> app builder, with six signature thematic differentiators. This package
> reconstructs the **structure and intent** faithfully (see CLAIMS CHECK on the
> exact prompt wordings).

## 1. Executive Summary

A reusable prompt library for someone building an app with AI assistants
(Gemini, GPT, Replit, Expo, Firebase Studio), organized so prompts are easy to
find and adapt. It has three axes:

1. **By role** — Operators, Managers, Owners, Admins.
2. **By lifecycle stage** — Market Research, Privacy/Security/Compliance,
   Accessibility, DevOps/CI-CD, Onboarding, Testing, Crash Reports, Post-Launch
   Monitoring.
3. **By signature theme** — six differentiators that make this more than a prompt
   dump: Emotional Layer, Behavior Analytics vs Usage Metrics, AI as a Mentor
   (not a Mirror), Unexpected Ecosystem Friction, Power of Network Effects, and
   Digital Ethics & Invisible Load.

Each Phase-1 entry is a directive-style prompt + a justification; Phase 2 wires
them into multi-step **prompt chains** per role.

## 2. Structure

```
context-engineer-prompt-library/
├── README.md                  (this file)
├── prompts/
│   ├── by-role.md             Operators · Managers · Owners · Admins (directive prompts)
│   ├── lifecycle.md           8 lifecycle stages, prompts + justifications
│   └── themes.md              6 signature differentiator prompts (the "why", not just "what")
└── chains/
    └── prompt-chains.md       Phase-2 multi-step chains per role
```

## 3. The six signature themes (the differentiators)

These are what the source cared about most — they encode *why* users behave, not
just *what* they do:

| Theme | Core question it makes the AI answer |
|-------|--------------------------------------|
| **Emotional Layer** | Where do *I* (builder) and the *user* hit trust/motivation/burnout — and what celebratory popups, progress trackers, nudges help? |
| **Behavior Analytics vs Usage Metrics** | Not what users did — *why* they hesitated, backed out, slowed, or abandoned. Build a behavioral friction map; auto-offer help after a delay. |
| **AI as a Mentor, Not a Mirror** | Make the AI a companion that teaches, encourages, evolves with the user — suggests shortcuts, explains errors, even "throws shade" when apt. |
| **Unexpected Ecosystem Friction** | Ecosystems fight back: OS updates, scanner compatibility, offline tokens, battery, hardware quirks → generate fallback flows + workarounds. |
| **Power of Network Effects** | Turn an individual tool into a network: collaboration incentives (badges, unlocks, rewards, reduced throttling) for invites + group tasks. |
| **Digital Ethics & Invisible Load** | "I'm responsible for what the app enables." Give operators override of AI decisions; address cognitive load; build a quiet/focus mode. |

## 4. Implementation Considerations

- **Prompts are templates, not scripts** — every entry has `{{variables}}` to
  adapt to your app, audience, and platform.
- **Use the justification** — each prompt explains *why it's built that way* so
  you can modify it without breaking its intent.
- **Chains > single prompts** for multi-step work — see `chains/prompt-chains.md`.

## 5. Performance / Quality Notes

- **Ground outputs** — prompts instruct the model to cite assumptions and flag
  what it cannot verify (no confident fabrication).
- **Bias toward viability** — the "AI as Mentor" theme explicitly favors
  workable shortcuts over theoretical perfection.
- **Accessibility is a first-class stage**, not an afterthought (its own
  lifecycle section).

## 6. Validation Checklist

- [ ] All 4 roles have directive prompts + justifications
- [ ] All 8 lifecycle stages covered
- [ ] All 6 signature themes present with their "why"
- [ ] Phase-2 chains exist per role
- [ ] Prompts use adaptable `{{variables}}`, not hard-coded specifics
- [ ] Claims check completed (below)

## 7. Recommended Next Steps

1. Fill the `{{variables}}` for your specific app and re-test each prompt.
2. Run the behavioral-friction-map prompt against real funnel data.
3. Wire the "AI as Mentor" prompt into your in-app assistant's system prompt.
4. Expand any stage from representative prompts to the full set as you use them.

## 8. Provenance note

The source delivered the prompts as a "Lyra-Style Prompt Library" and worked
toward "72 prompts." The detailed thematic briefs in §3 are **verbatim
requirements** from the source; the prompt *wordings* here are this kit's
faithful reconstruction (see CLAIMS CHECK).

## 9. CLAIMS CHECK

- **Verified (in source):** the three organizing axes (4 roles; 8 lifecycle
  stages; 6 signature themes), the detailed intent of each theme (quoted from the
  user's own brief), the "directive prompt + justification" format, the Phase-1 /
  Phase-2 (chains) split, and the "Lyra-Style" / ~72-prompt target.
- **Inferred (this kit):** the exact prompt text and chain steps are
  reconstructed from the requirements. They are faithful to intent but are not
  guaranteed to be the source's literal wording.
- **Unresolved:** the source's *delivered* prompt bodies lived largely inside
  generated/fenced blocks that were stripped during condensation, so a
  byte-faithful copy of all 72 is a follow-up pass against the raw chat.
- **Contradictions:** none detected.
