# AI Runtime Governance Kernel

## Purpose

The AI Runtime Governance Kernel defines how agents may think, retrieve, transform, propose, and mutate knowledge.

## Agent Action Classes

### Read

Agent reads memory or entity context.

### Reason

Agent synthesizes context and proposes interpretation.

### Propose

Agent suggests a change, action, or decision.

### Mutate

Agent changes a record, relationship, prompt, workflow, or system state.

### Execute

Agent triggers an external action.

## Permission Requirements

| Action | Requires Provenance | Requires Confidence | Requires Approval | Requires Audit |
|---|---:|---:|---:|---:|
| Read | Yes | No | No | Optional |
| Reason | Yes | Yes | No | Yes |
| Propose | Yes | Yes | No | Yes |
| Mutate | Yes | Yes | Yes for high-risk | Yes |
| Execute | Yes | Yes | Yes for external impact | Yes |

## Agent Rules

- Agents must declare operating scope.
- Agents must cite source memory where available.
- Agents must not invent relationships.
- Agents must quarantine uncertain mappings.
- Agents must never bypass tenant boundaries.
- Agents must log mutations.
- Agents must require approval for destructive operations.
- Agents must use confidence levels.
- Agents must surface contradictions.

## Confidence Bands

- 0.90–1.00: High confidence
- 0.70–0.89: Operational confidence
- 0.50–0.69: Review required
- 0.30–0.49: Low confidence
- 0.00–0.29: Quarantine / do not act

## Mutation Policy

Mutations must include:

- actor_id
- actor_type
- target_entity_id
- mutation_type
- before_state
- after_state
- reason
- source_refs
- confidence_score
- approval_id when required
