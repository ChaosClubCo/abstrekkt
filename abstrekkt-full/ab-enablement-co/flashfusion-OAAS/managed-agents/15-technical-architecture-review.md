# Prompt: Technical Architecture Review
**Use:** During pre-sales or sprint discovery. Input: client's current AI tool stack.

---

Review this client's AI technical architecture.

**Company:** {company}
**Current AI tools:** {tools}
**Primary use case:** {use_case}
**Team technical level:** {tech_level}
**Compliance requirements:** {compliance}

Produce:
1. Stack Assessment (what's working, what's missing, what's redundant — 1–2 sentences each)
2. Integration Map (what connects to what, what doesn't but should)
3. Critical Gaps (top 3 — ranked by impact on their stated use case)
4. Risk Flags (data handling, auth, latency, vendor lock-in — only flag real ones)
5. FlashFusion Fit (what skill packs or workflows directly address the identified gaps)

No generic advice. Every observation must trace to their specific stack. If you don't have enough information to assess something, say so explicitly instead of guessing.
