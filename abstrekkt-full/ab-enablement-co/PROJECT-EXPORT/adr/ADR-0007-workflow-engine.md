# ADR-0007: Workflow Execution Model

Status: Accepted  
Date: 2026-06-22  
Confidence Score: 0.72

## Old Direction
No workflow engine specified.

## New Direction
Use queue-backed durable jobs initially.

## Alternatives Considered
1. Keep old direction.
2. Use a minimal prototype-only approach.
3. Adopt the recommended direction with migration guidance.

## Tradeoffs
Simpler than Temporal; migration path preserved.

## Risk Analysis
The primary risk is overconfidence where accessible source material is thin. Mitigation is explicit confidence tagging, archived old directions, validation gates, and future ADR replacement when stronger source evidence appears.

## Migration Impact
Superseded directions are preserved under `archive/decisions/`; package names, docs, templates, and environment prefixes can be updated through migration scripts if needed.

## Recommended Direction
Proceed with the new direction and keep the old direction archived.

## Confidence Score
0.72
