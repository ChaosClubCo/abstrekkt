# The Skeptic Layer
## A Framework for Building AI Systems That Challenge Their Own Output

**Kyle Rosebrook — kylerosebrook.com**
*Version 1.0 — April 2026*

---

## The Problem This Solves

Most AI deployments have a single failure mode they never test for: what happens when the model is confidently wrong?

Not hallucination — that's well-documented and widely mitigated. The failure mode I'm describing is **sycophancy at the system level**: an AI that produces outputs aligned with the user's apparent preferences rather than with reality.

In a single-agent system, there's no structural check on this. The model generates, the user receives. If the output is plausible and agreeable, it moves forward.

The Skeptic Layer inserts a structural challenger into this pipeline. It doesn't check facts (that's a different problem). It challenges reasoning — identifies unfounded assumptions, missing risks, and outputs that would be the same regardless of the actual input.

---

## Architecture Overview

```
INPUT
  │
  ▼
┌─────────────────────────────────────┐
│           GENERATOR                 │
│  System prompt: quality + coherence │
│  Goal: best possible answer         │
└─────────────────────────────────────┘
  │
  │ generator_output
  ▼
┌─────────────────────────────────────┐
│           SKEPTIC                   │
│  System prompt: adversarial         │
│  Goal: find what's wrong            │
│  Input: original question +         │
│         generator output            │
└─────────────────────────────────────┘
  │
  │ skeptic_output
  ▼
┌─────────────────────────────────────┐
│           SYNTHESIZER               │
│  System prompt: resolution          │
│  Goal: integrate both, flag tension │
│  Input: question + generator +      │
│         skeptic                     │
└─────────────────────────────────────┘
  │
  ▼
OUTPUT (with confidence score + tension flags)
```

---

## Role Definitions

### Generator
**Purpose:** Produce the best possible initial response to the user's query.

**System prompt approach:**
```
You are [role]. Answer the user's question with maximum quality and specificity.
Be complete, accurate, and actionable. Do not hedge unnecessarily.
```

**What it does NOT do:** Challenge its own output. That's the Skeptic's job. The Generator should be unrestrained — a constrained Generator produces mediocre Skeptic inputs.

---

### Skeptic
**Purpose:** Identify flaws, gaps, and sycophancy in the Generator's output.

**System prompt approach:**
```
You are an adversarial reviewer. Your job is to find what's wrong with the following AI-generated response.

For every response you review:
1. Identify the most dangerous unfounded assumption.
2. Name what's missing — what risks, counterarguments, or context is absent.
3. Flag any statement where the AI appeared to align with the user's apparent preference rather than with accuracy.
4. Score the response: CLEAN (no issues) / MILD (minor gaps) / MODERATE (notable gaps) / HIGH (significant problems) / SEVERE (do not use).

Be direct. Your job is not to improve the response — it's to identify its failure modes.

User question: {question}
Generator response: {generator_output}
```

**Critical design constraint:** The Skeptic must receive the original question AND the Generator's output. It cannot evaluate the output without knowing what the output was supposed to accomplish.

**What it does NOT do:** Produce a final answer. It is a diagnostic, not a replacement.

---

### Synthesizer
**Purpose:** Integrate the Generator and Skeptic outputs into a final response that accounts for the challenge.

**System prompt approach:**
```
You are a synthesis agent. You have been given:
1. A user question
2. An initial AI response (Generator)
3. An adversarial review of that response (Skeptic)

Your job:
- If the Skeptic found no significant issues: deliver the Generator's response with a clean confidence flag.
- If the Skeptic found moderate issues: deliver a revised response that addresses the identified gaps. Mark which parts were revised.
- If the Skeptic found severe issues: surface the Skeptic's concerns explicitly before providing any answer. Ask the user for clarification if needed.

Do not hide the tension. If the Generator and Skeptic disagree, say so.

Format:
[CONFIDENCE: HIGH/MEDIUM/LOW]
[SKEPTIC FLAGS: <count> issues identified | CLEAN]

[Response]

[If issues found: WHAT WAS REVISED: ...]
```

---

## Implementation Patterns

### Pattern A: Sequential (Simple)
Three API calls in sequence. Highest quality, highest latency.

```python
# Pseudocode
generator_output = call_llm(
    system=GENERATOR_PROMPT,
    user=user_question
)

skeptic_output = call_llm(
    system=SKEPTIC_PROMPT.format(
        question=user_question,
        generator_output=generator_output
    ),
    user="Review the above response."
)

final_output = call_llm(
    system=SYNTHESIZER_PROMPT,
    user=f"Question: {user_question}\nGenerator: {generator_output}\nSkeptic: {skeptic_output}"
)
```

**Latency impact:** 3x base latency. Acceptable for decision-grade outputs; too slow for conversational use.

---

### Pattern B: Parallel Generator + Skeptic (Optimized)
Run Generator and Skeptic in parallel using independent context windows. Reduces latency to ~1.5x base.

```python
import asyncio

async def run_parallel(user_question):
    generator_task = asyncio.create_task(
        async_call_llm(GENERATOR_PROMPT, user_question)
    )
    
    # Skeptic can run concurrently on a "blind" review pass
    # (reviews the question itself for sycophancy traps)
    pre_skeptic_task = asyncio.create_task(
        async_call_llm(PRE_SKEPTIC_PROMPT, user_question)
    )
    
    generator_output, pre_skeptic_notes = await asyncio.gather(
        generator_task, pre_skeptic_task
    )
    
    # Full skeptic pass uses both
    skeptic_output = await async_call_llm(
        SKEPTIC_PROMPT,
        f"Question: {user_question}\nGenerator: {generator_output}\nPre-analysis: {pre_skeptic_notes}"
    )
    
    return await async_call_llm(
        SYNTHESIZER_PROMPT,
        f"Question: {user_question}\nGenerator: {generator_output}\nSkeptic: {skeptic_output}"
    )
```

---

### Pattern C: Single-Model, Dual-Pass (Budget)
For cost-constrained environments. One model, two calls. Loses some adversarial independence but still meaningfully better than a single pass.

```
PASS 1 — Generator:
[Standard generation prompt]

PASS 2 — Skeptic + Synthesizer combined:
"Here is a question and an AI-generated response. Find the top 2 issues with the response, then deliver an improved version that addresses them. If there are no issues, confirm the response is sound and deliver it unchanged."
```

**Tradeoff:** The model reviewing its own output has a bias toward defending it. This is partially mitigated by the explicit instruction to find issues before improving. Results are 60-70% as effective as true structural separation, at 40% of the cost.

---

## When to Use the Skeptic Layer

**Use it for:**
- Business decisions with financial stakes
- Technical architecture decisions
- Any output that will be acted on without further human review
- Outputs where false confidence is more dangerous than no answer
- Agent systems making multi-step decisions

**Skip it for:**
- Conversational use (latency makes it unusable)
- Creative tasks where "correct" is subjective
- Simple factual lookups (use search grounding instead)
- Real-time applications where 3x latency is unacceptable

---

## Confidence Scoring Schema

Every output from a Skeptic Layer pipeline should carry a machine-readable confidence signal.

```json
{
  "confidence": "HIGH | MEDIUM | LOW | UNCERTAIN",
  "skeptic_flags": 0,
  "issues_found": [],
  "revised": false,
  "revision_summary": null
}
```

Surface this in your UI. Don't bury it. Users make better decisions when they can see the system's self-assessment.

---

## Anti-Patterns to Avoid

**Anti-pattern 1: Using the same model context for Generator and Skeptic.**
The model will defend its own output. Use separate API calls, separate context windows, or at minimum a complete context reset between passes.

**Anti-pattern 2: A Skeptic with a positive default.**
If the Skeptic's base state is "looks good" rather than "find the problem," it will find the problem only when it's obvious. Prompt it toward adversarialism explicitly.

**Anti-pattern 3: Hiding the Skeptic's output from the user.**
The Skeptic's findings are the most valuable part of this system. Surface them. Users who see "SKEPTIC FLAGS: 2 issues found" make better decisions than users who receive only the synthesized output.

**Anti-pattern 4: Running the Skeptic Layer on low-stakes outputs.**
This adds cost and latency. Be intentional about which outputs warrant the investment.

---

## Operational Costs

Rough estimates for a GPT-4-class model at current pricing (April 2026):

| Pattern | Latency Multiplier | Token Cost Multiplier |
|---|---|---|
| Sequential (A) | ~3x | ~3x |
| Parallel (B) | ~1.5x | ~2.5x |
| Dual-Pass (C) | ~2x | ~1.8x |

For decision-grade outputs where a wrong answer costs more than the token overhead, Pattern A or B is justified. For routine use, Pattern C or no Skeptic Layer at all.

---

## Connection to Sycophancy

The Skeptic Layer doesn't just improve output quality. It specifically targets the sycophancy failure mode:

The Generator, trained for engagement, will produce outputs the user finds agreeable. The Skeptic's mandate — find what's wrong — structurally counteracts this. Even if both are the same underlying model, the adversarial framing changes the output distribution.

This is not a perfect fix. A sufficiently strong sycophancy pressure (highly deferential system prompt, highly agreeable user context) will degrade even a well-designed Skeptic. But it moves the default.

---

## Further Reading

- Anti-Sycophancy Prompt Pack: [kylerosebrook.com](#)
- AI Setup Score (free diagnostic): [kylerosebrook.com](#)
- McGill OSS, "A Journey into AI Psychosis" (April 2026)

---

*This framework is in active use across FlashFusion deployments.*
*Feedback and contributions welcome: kylerosebrook@gmail.com*
