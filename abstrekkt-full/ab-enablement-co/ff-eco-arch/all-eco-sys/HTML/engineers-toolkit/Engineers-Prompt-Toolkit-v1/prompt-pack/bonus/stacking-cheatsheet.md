# BONUS: Prompt Stacking Cheat Sheet + FAQ

## The Stacking System

These 7 prompts aren't meant to be used in isolation. The real power is
**stacking** — chaining 2-3 prompts in sequence for compound results.

### High-Value Stacks

**The Decision Stack** (10-15 min, replaces hours of deliberation)
1. Prompt 05 (Tiered Options) — Generate A/B/C approaches
2. Prompt 04 (Adversarial Filter) — Stress-test your chosen option
3. Prompt 02 (Self-Healing) — Verify claims in the final plan

**The Learning Stack** (5-10 min, actually retain new concepts)
1. Prompt 06 (Explanation Ladder) — Understand the concept progressively
2. Prompt 07 (Perspective Mirror) — See it from multiple expert angles
3. Prompt 02 (Self-Healing) — Identify what's still uncertain

**The Build Stack** (20-30 min, prevents rework)
1. Prompt 01 (Socratic Clarifier) — Align on requirements
2. Prompt 03 (Architecture-First) — Design before coding
3. Prompt 04 (Adversarial Filter) — Find the holes
4. Then implement with architecture spec as context

**The Strategy Stack** (15-20 min, for big decisions)
1. Prompt 01 (Socratic Clarifier) — Surface hidden constraints
2. Prompt 07 (Perspective Mirror) — Explore the decision space
3. Prompt 05 (Tiered Options) — Map concrete paths forward
4. Prompt 04 (Adversarial Filter) — Attack the chosen path

---

## FAQ

**Q: Do these work with ChatGPT / Gemini / other models?**
A: Yes. These are model-agnostic prompt patterns. They work with any
instruction-following LLM. They're designed on Claude because Claude
follows structured instructions especially well, but the patterns
transfer to GPT-4, Gemini Pro, and others.

**Q: Can I modify these prompts?**
A: Absolutely. These are frameworks, not scripts. Swap the domain-specific
examples, adjust the number of options, change the expert roles. The
structure is what matters — the specific words are yours to customize.

**Q: Why only 7 prompts?**
A: Because 7 covers the full decision cycle: clarify → design → evaluate
→ decide → verify → learn → stress-test. More prompts = more noise.
These 7 compose into dozens of stacks for different situations.

**Q: I got a weak response. What do I do?**
A: Three fixes, in order:
1. Add more context. "I'm building a B2B SaaS for 50-200 users" beats
   "I'm building an app."
2. Push back explicitly. "Your counterexamples were too generic. Give me
   specific failure scenarios with concrete numbers."
3. Re-run with a different framing. Sometimes rephrasing the same
   request gets a significantly better response.

**Q: How is this different from free prompt libraries online?**
A: Most free prompts are one-shot ("write a blog post about X"). These
are thinking frameworks that change HOW the model approaches your problem.
The Socratic Clarifier alone prevents the #1 source of bad AI output:
wrong assumptions. That's not a template — it's a workflow.

**Q: Can I use these at work?**
A: Yes. These are general-purpose engineering thinking patterns. There's
nothing proprietary here — use them in your team, share the stacking
patterns, build on top of them.

---

## Quick Reference Card

| # | Prompt | Use When | Time Saved |
|---|--------|----------|------------|
| 01 | Socratic Clarifier | Starting any complex task | 30-60 min of rework |
| 02 | Self-Healing Output | Need verifiable accuracy | Manual fact-checking |
| 03 | Architecture-First | Before building systems | Days of wrong direction |
| 04 | Adversarial Filter | After any recommendation | Post-launch surprises |
| 05 | Tiered Options | Decisions with tradeoffs | Decision paralysis |
| 06 | Explanation Ladder | Learning new concepts | Re-reading docs 5x |
| 07 | Perspective Mirror | Stuck in one viewpoint | Tunnel vision |

---

## One More Thing

If you found this useful, the single highest-leverage thing you can do
is pick ONE prompt and use it for every task this week. Not all seven.
Just one. Build the muscle memory for that pattern, then add the next.

The engineers who get the most from AI aren't the ones with the most
prompts — they're the ones who use 3-4 patterns consistently until
they become automatic.

Start with Prompt 01. It changes everything downstream.
