# Agent Cognition Routing

## Purpose

Cognitive routing decides which agent thinks about what, when, with which memory, under which constraints.

## Routing Dimensions

- task type
- risk level
- required knowledge domain
- required tools
- tenant scope
- confidence requirement
- mutation risk
- time sensitivity
- human review requirement

## Agent Classes

### Architect Agent

Designs system structure, doctrine, architecture, and contracts.

### Migration Agent

Handles entity mapping, Base44 rules, source ID preservation, relationship rewrite validation.

### PromptOps Agent

Manages prompt registry, versions, evaluations, and drift.

### Memory Curator Agent

Classifies, deduplicates, links, and ages memory.

### Provenance Agent

Tracks source lineage, ownership, audit records, and confidence.

### UX Systems Agent

Designs AI-native UX, trust UI, uncertainty UI, accessibility, and navigation.

### Security Agent

Enforces tenant isolation, RLS, permissions, and mutation safety.

### Observability Agent

Tracks telemetry, drift, unresolved relationships, conflicts, and quality metrics.

### Executive Compression Agent

Turns system complexity into decisions, priorities, and next actions.

## Routing Rule

If task risk is high and mutation impact is external, route through Security Agent and require human approval.
