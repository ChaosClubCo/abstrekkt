# Integration Standard

Every integration must define ownership before transport.

## Required contract

An integration should document:

- source system and destination system;
- canonical owner for every mutable field it transports;
- read, write, or command direction;
- authentication boundary;
- idempotency behavior;
- retry and replay behavior;
- provenance fields;
- conflict behavior;
- failure visibility;
- rollback or repair path.

## Default synchronization stance

Prefer **one-way projection** from the canonical owner. Use bidirectional synchronization only when both directions have explicit field ownership and deterministic conflict resolution.

## Event handling

Where webhooks are used, consumers should verify authenticity, persist a receipt or idempotency key, and make replay safe before acknowledging irreversible downstream work.
