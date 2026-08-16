import { CanonicalMutationDenied, sha256, verifySignedConformanceResult } from "./conformance-verifier.mjs";

export function assertAutonomousCanonicalMutationAllowed(command, context, verificationConfig) {
  if (command?.executionMode !== "AUTONOMOUS") throw new CanonicalMutationDenied("EXECUTION_MODE_REQUIRED", "Canonical mutation command must explicitly declare AUTONOMOUS execution");
  if (typeof command.actorId !== "string" || !command.actorId.startsWith("agent:")) throw new CanonicalMutationDenied("AUTONOMOUS_ACTOR_REQUIRED", "Autonomous canonical mutation requires an agent actor");
  if (typeof command.operationId !== "string" || command.operationId.length < 8) throw new CanonicalMutationDenied("INVALID_OPERATION_ID", "A stable operation ID is required");
  if (!command.mutation || typeof command.mutation !== "object" || Array.isArray(command.mutation)) throw new CanonicalMutationDenied("INVALID_MUTATION", "Mutation payload must be an object");
  return verifySignedConformanceResult(command.conformance, context, verificationConfig);
}

export async function executeCanonicalMutation(command, dependencies) {
  const attemptedAt = dependencies.clock.now();
  const context = { now: attemptedAt, policyVersion: dependencies.policyVersion, releaseLineage: dependencies.releaseLineage, environment: dependencies.environment, canonicalHead: await dependencies.canonicalStore.readHead() };
  let verification;
  try { verification = assertAutonomousCanonicalMutationAllowed(command, context, dependencies.verificationConfig); }
  catch (error) { await dependencies.receiptSink.append(denialReceipt(command, context, error, attemptedAt)); throw error; }
  return dependencies.transaction.run(async (tx) => {
    const lockedHead = await dependencies.canonicalStore.readHeadForUpdate(tx);
    if (lockedHead !== context.canonicalHead) {
      const error = new CanonicalMutationDenied("HEAD_CHANGED", "Canonical head changed after conformance verification");
      await dependencies.receiptSink.append(denialReceipt(command, { ...context, canonicalHead: lockedHead }, error, attemptedAt), tx); throw error;
    }
    const consumed = await dependencies.replayStore.consumeOnce(verification.resultId, verification.expiresAt, tx);
    if (!consumed) {
      const error = new CanonicalMutationDenied("RESULT_REPLAYED", "Conformance result has already authorized a mutation");
      await dependencies.receiptSink.append(denialReceipt(command, context, error, attemptedAt), tx); throw error;
    }
    const outcome = await dependencies.canonicalStore.applyMutation(command.mutation, tx);
    await dependencies.receiptSink.append({ type: "CANONICAL_MUTATION_ALLOWED", occurredAt: attemptedAt.toISOString(), actorId: command.actorId, operationId: command.operationId, mutationHash: sha256(command.mutation), beforeHead: context.canonicalHead, afterHead: outcome.canonicalHead, conformance: verification, policyVersion: context.policyVersion, releaseLineage: context.releaseLineage, environment: context.environment }, tx);
    return outcome;
  });
}
function denialReceipt(command = {}, context, error, occurredAt) { return { type: "CANONICAL_MUTATION_DENIED", occurredAt: occurredAt.toISOString(), actorId: command.actorId ?? null, operationId: command.operationId ?? null, mutationHash: command.mutation ? sha256(command.mutation) : null, canonicalHead: context.canonicalHead, policyVersion: context.policyVersion, releaseLineage: context.releaseLineage, environment: context.environment, denialCode: error instanceof CanonicalMutationDenied ? error.code : "VERIFICATION_ERROR" }; }
