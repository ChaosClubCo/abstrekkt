# Drift Detection

## Drift Types

### Schema Drift

Entity fields change without governance.

### Prompt Drift

Prompt instructions diverge from constitution.

### Memory Drift

Stored memory becomes stale, contradictory, or duplicated.

### Relationship Drift

Relationships become unresolved, invalid, or outdated.

### Agent Drift

Agent behavior deviates from role card or permission scope.

### UX Drift

Interfaces stop rendering trust, provenance, or degraded states correctly.

## Detection Methods

- schema checksum comparison
- prompt checksum comparison
- orphan relationship scans
- source freshness scans
- duplicate semantic similarity checks
- agent run policy audits
- UI state coverage tests

## Drift Response

1. Detect
2. Classify severity
3. Create audit event
4. Notify responsible agent/human
5. Quarantine unsafe objects
6. Generate repair recommendation
7. Verify after repair
