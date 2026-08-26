# RBAC Matrix

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


| Role | lead:read | lead:write | audit:read | audit:write | artifact:approve | agent:run | settings:manage |
|---|---:|---:|---:|---:|---:|---:|---:|
| owner | yes | yes | yes | yes | yes | yes | yes |
| admin | yes | yes | yes | yes | yes | yes | no |
| operator | yes | yes | yes | yes | no | yes | no |
| analyst | yes | no | yes | yes | no | no | no |
| client_viewer | no | no | yes | no | no | no | no |
| agent_runtime | no | no | yes | no | no | yes | no |
| auditor | yes | no | yes | no | yes | no | no |
