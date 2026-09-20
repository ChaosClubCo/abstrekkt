# Prompt Engineering Canonical Library v2.0
## Quick Reference — 23 Evidence-Based Techniques

> **Canonical source:** prompt-engineering-23-core-techniques.md (v2.0, 2025-10-26)
> **Supersedes:** prompt-engineering-techniques-corrected.md (v1.0)
> **Review triggers:** GPT-5 GA, Claude 5 major release, Gemini 2.0 GA

---

## The 23 Techniques at a Glance

| # | Technique | Category | Token Cost | ROI |
|---|---|---|---|---|
| 1 | Persona Prompting | Foundation | 1.2x | ⭐⭐⭐ |
| 2 | RTF (Role+Task+Format) | Foundation | 1.1x | ⭐⭐⭐ |
| 3 | First Principles | Foundation | 1.5x | ⭐⭐ |
| 4 | Chain of Thought | Reasoning | 2-3x | ⭐⭐⭐ |
| 5 | Tree of Thought | Reasoning | 3-5x | ⭐⭐ |
| 6 | Self-Evaluation + Rubric | Reasoning | 2x | ⭐⭐ |
| 7 | Few-Shot Learning | Input Control | 1.5-2x | ⭐⭐⭐ |
| 8 | Zero-Shot Prompting | Input Control | 1x | ⭐⭐⭐ |
| 9 | Modular Prompting | Input Control | Nx | ⭐⭐ |
| 10 | Schema Prompting | Output Shaping | 1.1x | ⭐⭐⭐ |
| 11 | Length & Complexity Control | Output Shaping | 1x | ⭐⭐⭐ |
| 12 | Tone & Voice Control | Output Shaping | 1x | ⭐⭐⭐ |
| 13 | Format Transformation | Output Shaping | 1x | ⭐⭐⭐ |
| 14 | Grounding (RAG) | Verification | 1.5x | ⭐⭐⭐ |
| 15 | Boundary Setting | Verification | 1.1x | ⭐⭐⭐ |
| 16 | Citation & Source Verification | Verification | 1.2x | ⭐⭐ |
| 17 | Comparative Analysis | Analysis | 2x | ⭐⭐ |
| 18 | Prioritization | Analysis | 1.5x | ⭐⭐⭐ |
| 19 | Risk Mapping & Pre-Mortem | Analysis | 2x | ⭐⭐ |
| 20 | Code Utilities | Specialized | 2x | ⭐⭐⭐ |
| 21 | Content Transformation | Specialized | 1.5x | ⭐⭐ |
| 22 | Meta-Prompting | Specialized | 1.5x | ⭐ |
| 23 | Kickoff & Requirements Gathering | Specialized | 1.2x | ⭐⭐⭐ |

---

## Optimal Stacks (Pre-Built)

### Software Development (Kyle's primary use case)
```
Persona (Staff Engineer + AppSec)
+ Schema (JSON/TypeScript output)
+ CoT (architecture decisions)
+ Self-Eval (code quality gate)
+ Code Utilities (test generation)
```

### Automation (n8n / Make.com / Claude Code)
```
Persona (Staff Engineer + AppSec)
+ Schema (JSON for workflow output)
+ Modular Prompting (stage-by-stage)
+ Grounding (cite official docs)
+ Self-Eval (security + UX gates)
```

### Research & Analysis
```
Grounding (sources only)
+ Citation Verification
+ Comparative Analysis (SWOT)
+ Risk Mapping
+ Boundary Setting (uncertainty markers)
```

### Decision Support
```
Tree of Thought (explore options)
+ Comparative Analysis
+ Prioritization (effort/impact)
+ Risk Mapping (pre-mortem)
+ Self-Eval (check reasoning)
```

---

## Anti-Patterns (Avoid)

1. **Over-constraint paralysis** — too many contradictory rules; pick 1–2 primary constraints
2. **Vague quality gates** — "make it better" without a rubric does nothing
3. **Example bias** — few-shot examples reinforce wrong patterns; audit diversity
4. **Template ossification** — GPT-3.5-era prompts are suboptimal on GPT-4/Claude 4
5. **Ignoring model strengths** — better model + basic prompt beats weaker model + perfect prompt
6. **Citation trust** — always verify independently; ChatGPT fabricates citations
7. **Prompt injection** — isolate user content from system instructions; validate outputs

---

## Evidence Summary

| Technique | Evidence | Citation |
|---|---|---|
| Chain of Thought | 10-30% accuracy gain on reasoning | Wei et al. (2022) |
| Few-Shot Learning | Consistent style transfer | Brown et al. (2020) |
| Tree of Thought | Improved planning tasks | Yao et al. (2023) |
| Grounding (RAG) | 40-60% hallucination reduction | Lewis et al. (2020) |
| Self-Evaluation | Reduces harmful outputs | Bai et al. (2022) |
| Meta-Prompting | LLMs can improve own prompts | Zhou et al. (2023) |

---

## Stacking Rule

> 3 techniques = sweet spot. Diminishing returns after 5.  
> 3 stacked techniques: ~2-3x token cost, ~60-80% quality gain — positive ROI for important tasks.

---

## Version + Review

| Property | Value |
|---|---|
| Version | 2.0 |
| Date | 2025-10-26 |
| Review trigger | Model major release (GPT-5, Claude 5, Gemini 2.0) |
| Storage | Git repo — version prompts like code |
