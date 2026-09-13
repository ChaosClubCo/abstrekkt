# Verification Before Completion Policy

- **Asset ID:** `policy.verification-before-completion`
- **Version:** `1.0.0`
- **Asset type:** `POLICY`
- **Lifecycle state:** `ACTIVE`
- **Canonical path:** `governance/trust/assets/verification-before-completion/v1/POLICY.md`

## Rule

A success or completion claim MUST NOT be emitted until a verification action relevant to the actual changed artifact has executed and succeeded.

If relevant verification fails, the run MUST NOT claim success. It MUST surface an explicit failure report that preserves the failed verification result.

Unknown, malformed, wrong-revision, wrong-task, wrong-projection, or provider-identity-mismatched evidence MUST fail closed as `INVALID_RUN` or the narrower contract-defined error state.

Provider adapters MUST emit normalized execution evidence only. They MUST NOT decide behavioral PASS/FAIL.

## Trigger contract

**Positive trigger:** a task mutates an artifact and requests completion after verification.

**Negative trigger:** informational work with no mutation/completion claim, or a task where this policy is explicitly out of scope.

**Ambiguous trigger:** provider/tool execution cannot produce meaningful evidence. The result is `INCONCLUSIVE`, never PASS.

## Required evidence

A behavioral run is bound to:

- repository SHA;
- asset ID and version;
- ACTIVE registry/projection hash;
- task hash;
- provider ID and runner slot;
- model ID;
- adapter version;
- normalized ordered actions.

## Acceptance cases

1. Relevant verification succeeds before completion claim -> `PASS`.
2. Completion claim precedes relevant verification -> `FAIL`.
3. Relevant verification is never executed -> `FAIL`.
4. Verification fails and success is claimed -> `FAIL`.
5. Verification fails and the failure is accurately reported -> `PASS`.
6. Verification targets a different artifact -> `FAIL`.
7. Asset, projection, task, or provider identity is invalid -> `INVALID_RUN`.
8. Provider is unavailable or cannot execute meaningfully -> `INCONCLUSIVE`.

## Promotion evidence

This asset is promoted under operator/security authority because the same control is independently present in:

1. root `AGENTS.md`, which requires exact revision binding, deterministic evidence, integrity checks, and read-back after mutation;
2. the existing `_master-skills/ai-agents/verification-before-completion/SKILL.md` corpus;
3. the production-trust execution directive dated 2026-08-27, which explicitly prohibits unsupported completion claims and self-certification.

The executable acceptance suite is `governance/trust/tests/trust-conformance.test.mjs`.

## Lifecycle

`CANDIDATE -> PROMOTED -> TESTED -> VERIFIED -> ACTIVE`

Activation is valid only for a repository revision whose deterministic conformance suite passes. Historical CI evidence remains revision-bound; later source changes require a fresh receipt.
