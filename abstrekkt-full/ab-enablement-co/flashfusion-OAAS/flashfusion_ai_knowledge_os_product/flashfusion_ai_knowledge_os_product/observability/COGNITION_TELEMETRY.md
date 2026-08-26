# Cognition Telemetry

## Purpose

Cognition telemetry measures the health of the AI-native knowledge system.

## Metrics

### Memory Metrics

- total assets
- classified assets
- linked assets
- stale memory count
- duplicate candidates
- quarantined memory
- average confidence

### Relationship Metrics

- unresolved relationships
- orphaned relationships
- cross-tenant violation attempts
- reverse lookup coverage
- relationship confidence average

### Agent Metrics

- agent runs
- failed runs
- mutation proposals
- approved mutations
- rejected mutations
- hallucination flags
- confidence distribution

### PromptOps Metrics

- active prompts
- deprecated prompts
- untested prompts
- prompt drift events
- failed prompt evaluations

### UX Metrics

- decision queue size
- user review latency
- unresolved conflict count
- cognitive compression usage

## Telemetry Events

- asset.ingested
- asset.classified
- relationship.created
- relationship.unresolved
- agent.run.started
- agent.run.completed
- agent.mutation.proposed
- prompt.version.updated
- memory.marked.stale
- drift.detected
