# AI Architecture

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Agent Runtime

The AI runtime routes tasks to specialized agents: strategist, architect, product, security, research, prompt, revenue, and delivery agents. The router applies task classification, tenant scope, model policy, budget, retry strategy, and safety gates.

## Evaluation

Every agent has expected input schema, output schema, quality rubric, refusal/guardrail behavior, and regression fixtures. High-impact outputs enter human review before client delivery.
