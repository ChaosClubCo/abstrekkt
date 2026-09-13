# Source of Truth Matrix

| Information | Canonical owner | Projection targets |
| --- | --- | --- |
| Source code, configuration, versioned artifacts | GitHub | GitBook, Base44 |
| SOPs, playbooks, architecture guidance | GitBook | Base44, Orbismo references |
| Structured ecosystem canon | Worldkeep | Base44, Orbismo references |
| Operational entities, dependencies, lifecycle metadata | Orbismo | Base44 |
| Unified controls and operator views | Base44 Hub | None by default; it projects upstream state |

## Ownership rule

A canonical owner is the system allowed to author the primary value. Other systems should reference or derive it.

## Conflict rule

When sources disagree:

1. identify the canonical owner for the disputed field;
2. preserve provenance for the competing observation;
3. do not resolve conflict by last-write-wins unless that policy is explicitly defined;
4. surface unresolved contradictions to the operator.
