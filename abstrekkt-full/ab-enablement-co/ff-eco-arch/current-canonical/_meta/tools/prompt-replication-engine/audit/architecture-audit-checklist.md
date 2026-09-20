# Architecture Audit Checklist

The audit pass requested in the source (ask #1): review/critique, flag and correct
inconsistencies, stress-test gap coverage. Run against any extracted architecture.

## Correctness & consistency
- [ ] Inconsistencies between stated requirements flagged and reconciled
- [ ] Each component has a clear single responsibility
- [ ] Data flow has no orphaned producers/consumers

## Resilience (the source's explicit list)
- [ ] **Edge cases** enumerated for each component
- [ ] **Rollback options** defined for every state-changing operation
- [ ] **Retries** with backoff on all remote/fallible calls
- [ ] **Rate limiting** on inbound and outbound boundaries
- [ ] **Error logging** centralized; no silently swallowed errors
- [ ] **Documentation** present for each module + its boundaries

## Security
- [ ] All external/conversation input treated as untrusted
- [ ] Secrets brokered, never inline; scanned before any write
- [ ] Least-privilege on data access (RLS / scoped tokens)

## Scale
- [ ] Bottlenecks identified (context limits, concurrency ceilings)
- [ ] Eventual-consistency risks named where multiple stores are used

## Output
For each ❌, produce: the gap, the corrected design, and a verification step.
End with a CLAIMS CHECK (verified / inferred / unresolved / contradictions).
