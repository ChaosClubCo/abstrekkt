# Example: Routing Card Output

This is what you'll see when the SuperGem Prompt Router selects a configuration.

---

## ROUTING CARD

**Selected Configuration:**

- **ReasoningEngine**: TreeOfThoughts
- **Framework**: RISEN
- **OutputFormat**: Markdown

**Rationale:**

1. **TreeOfThoughts** chosen because the production readiness audit requires exploring multiple optimization paths (security-first vs. speed-first vs. cost-optimization). This engine will generate 3 candidate audit strategies, evaluate them against the stated constraints (no breaking changes, secure-by-default), and select the most balanced approach.

2. **RISEN** framework provides structured decomposition needed for audit tasks: Role (Senior Platform Engineer), Instructions (audit criteria), Steps (systematic review process), End Goal (prioritized roadmap + PR plan), and Narrowing (WSJF prioritization for roadmap items).

3. **Markdown** output format supports the required sections (Executive summary, Risks, Gaps, Roadmap, PR plan) with proper heading hierarchy, code blocks for configuration examples, and tables for WSJF scoring.

4. This combination ensures the downstream executor agent receives clear role context, systematic audit instructions, and structured output requirements without ambiguity.

---

**Next Step**: Copy the FINAL PROMPT block below and paste into your executor agent (Gemini/Claude/ChatGPT).
