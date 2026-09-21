---
name: model-selection-frameworks
description: Framework for selecting AI models (GPT-4, Claude, Llama) based on cost, performance, and capabilities. Use when evaluating model options, comparing LLM providers, or deciding build vs buy. Triggers on: which model to use, gpt vs claude, model comparison, llm selection, model evaluation.
version: 1.0.0
allowed-tools: Read, Write, Bash
license: MIT
---

# Model Selection Frameworks

## Purpose
Provide structured decision framework for AI model selection across vendors and use cases.

## When to Use
Customer asks 'which model should we use?', evaluating OpenAI vs Anthropic vs open source, cost vs quality tradeoff decisions.

## Core Workflow

1. Define Requirements (cost ceiling, latency SLA, accuracy threshold, context window needs)
2. Score Models (create comparison matrix: Claude Opus/Sonnet/Haiku, GPT-4/3.5, Llama 3)
3. Cost Analysis (tokens/request * price/1K tokens * volume/month)
4. Performance Testing (run benchmark with sample prompts, measure latency/accuracy)
5. Recommendation (primary + fallback model with justification)

## Output Format
- Architecture diagrams (Mermaid)
- Implementation guides (Markdown)
- Code examples (Python/TypeScript)
- Cost estimates (CSV/Excel)

## Dependencies
- Foundational skill (no IntInc skill dependencies)

## License
MIT License - See LICENSE.txt
