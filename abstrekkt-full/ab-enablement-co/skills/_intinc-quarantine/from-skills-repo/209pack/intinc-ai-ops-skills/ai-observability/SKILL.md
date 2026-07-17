---
name: ai-observability
description: Implement tracing, logging, and monitoring for AI systems using Langfuse, Datadog, and OpenTelemetry. Use when debugging AI failures, tracking costs, or measuring performance. Triggers on: llm monitoring, ai observability, trace debugging, langfuse, model performance tracking.
version: 1.0.0
allowed-tools: Read, Write, Bash
license: MIT
---

# Ai Observability

## Purpose
Achieve full visibility into AI system behavior for debugging and optimization.

## When to Use
Production AI failures need root cause analysis, cost attribution per customer, latency spike investigation, model quality degradation.

## Core Workflow

1. Instrumentation (add Langfuse traces, Datadog metrics, OTel spans)
2. Key Metrics (latency p50/p95/p99, cost per request, error rate, cache hit rate)
3. Dashboards (Grafana for infra, Langfuse for LLM calls, custom for business metrics)
4. Alerting (PagerDuty for p99 latency >2s, cost spike >20%, error rate >5%)
5. Debug Workflow (trace ID → full call graph → identify bottleneck)

## Output Format
- Architecture diagrams (Mermaid)
- Implementation guides (Markdown)
- Code examples (Python/TypeScript)
- Cost estimates (CSV/Excel)

## Dependencies
- Foundational skill (no IntInc skill dependencies)

## License
MIT License - See LICENSE.txt
