# Architecture Principles

## Evidence before claims

Implementation, verification, deployment, and certification are different states. Public claims reflect the strongest state actually proven for the referenced revision.

## Explicit authority

Systems, repositories, agents, and integrations have defined scopes. Tool availability does not create implicit permission.

## Durable contracts

Important interfaces and architecture decisions are versioned and preserved so changes can be traced and reviewed.

## Separation of concerns

Source code, runtime telemetry, secrets, release evidence, and human documentation live in systems appropriate to their trust and lifecycle requirements.

## AI trust boundary

AI-generated output is treated as untrusted input until validated. Prompts and skills guide behavior but do not replace authentication, authorization, schema validation, policy enforcement, or release controls.
