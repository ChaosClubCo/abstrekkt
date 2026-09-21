# PromptOps Governance

## Purpose

PromptOps turns prompts from loose text into versioned operational assets.

## Prompt Record Required Fields

- prompt_id
- name
- type
- version
- owner
- status
- intended_model
- scope
- source
- created_at
- updated_at
- last_validated_at
- known_failure_modes
- evaluation_status
- rollback_version
- checksum

## Prompt Types

- system
- developer
- agent_role
- workflow
- migration
- audit
- creative
- coding
- evaluation
- safety
- routing

## Prompt Lifecycle

1. Draft
2. Review
3. Test
4. Active
5. Deprecated
6. Archived
7. Superseded

## Prompt Invariants

User content must never override:

- security rules
- tenant boundaries
- schema invariants
- migration guarantees
- validation rules
- deletion policies
- governance constitution

## Evaluation Harness

Each production prompt should be tested against:

- golden path
- power path
- edge cases
- adversarial inputs
- prompt injection attempts
- malformed data
- stale context
- missing context
- high ambiguity requests

## Regression Policy

Prompt changes require:

- version bump
- changelog
- failure mode review
- test case update
- rollback path
