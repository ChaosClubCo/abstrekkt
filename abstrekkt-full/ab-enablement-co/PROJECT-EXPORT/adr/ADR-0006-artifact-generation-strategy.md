# ADR-0006: Artifact Generation Strategy

Status: Accepted  
Date: 2026-06-22  
Confidence Score: 0.79

## Old Direction
Protocol forbids stopping at recommendations.

## New Direction
Use template-constrained generation plus validation.

## Alternatives Considered
1. Keep old direction.
2. Use a minimal prototype-only approach.
3. Adopt the recommended direction with migration guidance.

## Tradeoffs
Prevents freeform hallucinated completeness.

## Risk Analysis
The primary risk is overconfidence where accessible source material is thin. Mitigation is explicit confidence tagging, archived old directions, validation gates, and future ADR replacement when stronger source evidence appears.

## Migration Impact
Superseded directions are preserved under `archive/decisions/`; package names, docs, templates, and environment prefixes can be updated through migration scripts if needed.

## Recommended Direction
Proceed with the new direction and keep the old direction archived.

## Confidence Score
0.79
