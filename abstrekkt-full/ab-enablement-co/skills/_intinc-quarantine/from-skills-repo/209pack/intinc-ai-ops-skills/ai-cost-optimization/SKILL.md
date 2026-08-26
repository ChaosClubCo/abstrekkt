---
name: ai-cost-optimization
description: Optimize AI infrastructure costs through caching, batching, model tiering, and prompt compression. Use when reducing LLM spending, optimizing token usage, or improving cost efficiency. Triggers on: reduce AI costs, optimize spending, token optimization, cost per request, llm budget.
version: 1.0.0
allowed-tools: Read, Write, Bash
license: MIT
---

# Ai Cost Optimization

## Purpose
Reduce AI operational costs by 30-70% without sacrificing quality.

## When to Use
Monthly AI bill exceeds budget, cost per request too high, need to scale without proportional cost increase.

## Core Workflow

1. Cost Audit (break down spend: model calls, embeddings, vector DB, infrastructure)
2. Quick Wins (implement semantic caching 30-50% savings, prompt compression 25% savings)
3. Model Tiering (route simple queries to Haiku, complex to Sonnet - 10x cost difference)
4. Batching (combine requests where latency allows - reduce API overhead)
5. Monitoring (set up cost alerts, track cost-per-request trends)

## Output Format
- Architecture diagrams (Mermaid)
- Implementation guides (Markdown)
- Code examples (Python/TypeScript)
- Cost estimates (CSV/Excel)

## Dependencies
- Foundational skill (no IntInc skill dependencies)

## License
MIT License - See LICENSE.txt
