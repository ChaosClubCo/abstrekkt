# Trust and Uncertainty UI

## Purpose

Trust UI helps users understand why the system believes something, where it came from, and how reliable it is.

## Required Trust Indicators

- confidence score
- provenance source
- freshness state
- contradiction state
- review status
- agent attribution
- last validated date
- source count
- mutation history

## Confidence Display

### High Confidence

Use when strongly supported by current, trusted sources.

### Operational Confidence

Safe to use for normal work, but still cite provenance.

### Review Required

Useful but not safe for autonomous action.

### Low Confidence

Visible but restricted.

### Quarantine

Not actionable.

## Uncertainty Rules

- Never hide uncertainty.
- Never promote low-confidence memory into canonical truth.
- Never mutate production state based on low confidence.
- Always surface conflicts.
