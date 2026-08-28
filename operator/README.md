# Abstrekkt Operator

This directory owns the repository-side contracts and execution boundaries for the Pathors-based Abstrekkt Operator bootstrap.

## Frozen contracts

- `contracts/TaskEnvelope.v1.schema.json`
- `contracts/ActionProposal.v1.schema.json`
- `contracts/ArtifactManifest.v1.schema.json`
- `contracts/ExecutionReceipt.v1.schema.json`

The schemas are versioned and closed with `additionalProperties: false`. Breaking changes require a new schema version rather than silently changing `/v1` semantics.

## Authority model

`read -> prepare -> approve -> execute -> verify`

Approval and execution are distinct states. A changed proposal invalidates prior approval. No completion claim is valid without execution evidence represented by `ExecutionReceipt/v1`.

## ActionExecutor

`src/action-executor.ts` defines the provider-independent execution boundary. Gabriel may implement that interface later, but it is not a dependency of the contract itself. The current `DisabledActionExecutor` fails closed.

## Pathors bootstrap

Pathors project: `Abstrekkt Operator`

Bootstrap properties:

- no phone number binding;
- no live post-session webhook;
- no configured secret handles;
- mocked Todoist read adapter;
- mocked Todoist write-proposal adapter;
- write operations cannot execute;
- explicit approval node is separated from proposal creation;
- simulation suite: `Bootstrap Safety v1`.

Do not replace the mocked write-proposal tool with a live mutation tool until the entire safety suite passes and the live adapter supports idempotency, exact-payload approval binding, and execution receipts.

## Todoist live-read status

A harmless live read has been executed through the connected Todoist surface and preserved under `evidence/`. This proves Todoist read connectivity in the current ChatGPT environment. It does **not** prove Pathors-to-Todoist live connectivity; Pathors remains mocked until a supported authenticated connector or MCP binding is available.

## Codex design/supervision setup

`setup/codex-bootstrap.ps1` contains the fail-fast bootstrap for Open Design and Chronos.

Open Design currently documents Codex MCP installation as:

```powershell
od mcp install codex
```

Chronos documents either the OpenAI Plugins Directory or the Git marketplace fallback. The script uses the Git fallback and explicitly avoids installing both identities:

```powershell
codex.cmd plugin marketplace add FaxanFM/chronos
codex.cmd plugin add chronos@chronos
```

After either install or upgrade, fully restart Codex and verify from a fresh task. Installation is not considered verified merely because repository setup files exist.

## Design contract

Repository root `DESIGN.md` is the default design authority. Existing product-specific contracts, including `project/design.md`, remain specialized contracts and inherit the repository-wide accessibility/runtime/token rules unless they explicitly strengthen them.

## Release gate

The operator remains `BOOTSTRAP / NOT LIVE-MUTATING` until all of the following are true:

1. Pathors ten-case suite passes against the active agent version.
2. A supported authenticated live Todoist read binding exists inside Pathors.
3. Any write adapter implements proposal hash binding and idempotency.
4. One harmless mutation is simulated and explicitly approved.
5. Execution produces a valid `ExecutionReceipt/v1`.
6. The receipt is reconciled against the actual downstream state.
7. Chronos runtime installation and Governor/Heartbeat coverage are verified on the target Codex host.
8. Open Design MCP registration is verified on the same target Codex host.
9. Gabriel remains disabled until the target runtime/platform is supported and independently validated.
