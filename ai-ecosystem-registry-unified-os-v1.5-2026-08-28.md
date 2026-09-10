# Unified AI Ecosystem OS v1.5

Canonical successor artifact to `ai-ecosystem-registry-reconciled-2026-07-16.html`.

## Artifact

- File: `ai-ecosystem-registry-unified-os-v1.5-2026-08-28.html`
- Snapshot lineage: OpenAI + Google + Anthropic + Microsoft + Open Standards + Specialist Tools
- Uncompressed artifact size: 1,283,689 bytes
- Original uncompressed SHA-256: `18c65428cbfb3ef71762414f051190e790c4553fc8102b6a7cba3bde3e20173e`
- Repository bootstrap SHA-256: `18e34f95304fa684e111ef1cd962ae649697f3948594569ee7af3187aa7afde0`
- Repository representation: self-contained gzip bootstrap using browser-native `DecompressionStream`

The repository HTML reconstructs the exact original v1.5 HTML client-side. Compression was used to keep the generated repository artifact reviewable instead of committing the 1.3 MB source verbatim.

## v1.5 specialist integration tranche

| Tool | State | Evidence |
| --- | --- | --- |
| UX Pilot | `BLOCKED` | Advertised `generate-design` and `flow-generation` actions both returned MCP `-32602` tool-not-found during conformance attempts. |
| Unity Essentials | `SKILL_ONLY` | Plugin-associated skill surface is present, but no direct callable action namespace was exposed in this conversation. |
| 01 Superdesign | `SKILL_ONLY` | Plugin-associated skill surface is present, but no direct callable action namespace was exposed in this conversation. |
| Ace Knowledge Graph | `VERIFIED` | A focused 12-node / 15-edge knowledge graph was successfully generated and saved privately. |
| Dependency Upgrade Plan | `PARTIAL` | Release extraction was callable, but the invocation correctly reported missing current version, target version, and breaking-change evidence. |

## Capability planes added

- Design Plane
- Interactive Runtime Plane
- Knowledge Plane
- Dependency Governance Plane

## Core operating rule

Tool presence, discovered schema, installed skill, successful execution, and verified downstream output are distinct states. The atlas records those states separately instead of treating "installed" as proof that a capability actually works.

## Prior v1.4 foundations retained

- 548-node cross-provider ecosystem graph before specialist additions
- Equivalence depth classifications
- Canonical trust chain
- Hard route constraints for preview/risk/governance/evidence/provider switches
- Evidence-aware route interpretation

v1.5 extends that graph with the specialist-tool provider and explicit `VERIFIED`, `PARTIAL`, `BLOCKED`, and `SKILL_ONLY` integration states.
