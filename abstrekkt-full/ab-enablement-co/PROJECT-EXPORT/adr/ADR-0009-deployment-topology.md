# ADR-0009: Deployment Topology

Status: Accepted  
Date: 2026-06-22  
Confidence Score: 0.7

## Old Direction
No deployment target specified.

## New Direction
Use container-first topology with local Compose and production orchestration.

## Alternatives Considered
1. Keep old direction.
2. Use a minimal prototype-only approach.
3. Adopt the recommended direction with migration guidance.

## Tradeoffs
Portable and long-job friendly.

## Risk Analysis
The primary risk is overconfidence where accessible source material is thin. Mitigation is explicit confidence tagging, archived old directions, validation gates, and future ADR replacement when stronger source evidence appears.

## Migration Impact
Superseded directions are preserved under `archive/decisions/`; package names, docs, templates, and environment prefixes can be updated through migration scripts if needed.

## Recommended Direction
Proceed with the new direction and keep the old direction archived.

## Confidence Score
0.7
