# Verification Checklist

## Governance

- [ ] Constitution reviewed
- [ ] Invariants approved
- [ ] PromptOps lifecycle approved
- [ ] Security policy approved
- [ ] Schema evolution policy approved

## Ontology

- [ ] Entity taxonomy covers all known assets
- [ ] Relationship types are sufficient
- [ ] Temporal semantics defined
- [ ] Lifecycle states defined

## Migration

- [ ] Base44 lowercase `id` rule enforced
- [ ] Source IDs preserved
- [ ] associated_* arrays validated
- [ ] reverse lookups supported
- [ ] raw IDs hidden from UI

## Memory

- [ ] Raw memory ingestion defined
- [ ] classification rules defined
- [ ] provenance required
- [ ] aging rules defined
- [ ] dedup rules defined

## Agents

- [ ] role cards defined
- [ ] permission levels assigned
- [ ] mutation gates defined
- [ ] approval rules defined

## UX

- [ ] provenance inspector designed
- [ ] uncertainty UI designed
- [ ] degraded states covered
- [ ] cognitive compression brief designed

## Observability

- [ ] telemetry events defined
- [ ] drift types defined
- [ ] quality scorecard defined
- [ ] unresolved references measurable

## Security

- [ ] tenant_id required
- [ ] RLS starter written
- [ ] audit log append-only
- [ ] destructive actions logged
