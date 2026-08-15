import { CanonicalMutationDenied, sha256, verifySignedConformanceResult } from "./conformance-verifier.mjs";

export async function executeCanonicalMutation(command, dependencies) {
  const attemptedAt = dependencies.clock.now();
  const context = {
    now: attemptedAt,
    policyVersion: dependencies.policyVersion,
    releaseLineage: dependencies.releaseLineage,
    environment: dependencies.environment,
    canonicalHead: await dependencies.canonicalStore.readHead(),
  };

  let verification;
  try {
    verification = verifySignedConformanceResult(command.conformance, context, dependencies.verificationConfig);
  } catch (error) {
    await dependencies.receiptSink.append(denialReceipt(command, context, error, attemptedAt));
    throw error;
  }

  return dependencies.transaction.run(async (tx) => {
    const lockedHead = await dependencies.canonicalStore.readHeadForUpdate(tx);
    if (lockedHead !== context.canonicalHead) {
      const error = new CanonicalMutationDenied("HEAD_CHANGED", "Canonical head changed after conformance verification");
      await dependencies.receiptSink.append(denialReceipt(command, { ...context, canonicalHead: lockedHead }, error, attemptedAt), tx);
      throw error;
    }

    const consumed = await dependencies.replayStore.consumeOnce(verification.resultId, verification.expiresAt, tx);
    if (!consumed) {
      const error = new CanonicalMutationDenied("RESULT_REPLAYED", "Conformance result has already authorized a mutation");
      await dependencies.receiptSink.append(denialReceipt(command, context, error, attemptedAt), tx);
      throw error;
    }

    const outcome = await dependencies.canonicalStore.applyMutation(command.mutation, tx);
    await dependencies.receiptSink.append({
      type: "CANONICAL_MUTATION_ALLOWED",
      occurredAt: attemptedAt.toISOString(),
      actorId: command.actorId,
      operationId: command.operationId,
      mutationHash: sha256(command.mutation),
      beforeHead: context.canonicalHead,
      afterHead: outcome.canonicalHead,
      conformance: verification,
      policyVersion: context.policyVersion,
      releaseLineage: context.releaseLineage,
      environment: context.environment,
    }, tx);
    return outcome;
  });
}

function denialReceipt(command, context, error, occurredAt) {
  return {
    type: "CANONICAL_MUTATION_DENIED",
    occurredAt: occurredAt.toISOString(),
    actorId: command.actorId,
    operationId: command.operationId,
    mutationHash: sha256(command.mutation),
    canonicalHead: context.canonicalHead,
    policyVersion: context.policyVersion,
    releaseLineage: context.releaseLineage,
    environment: context.environment,
    denialCode: error instanceof CanonicalMutationDenied ? error.code : "VERIFICATION_ERROR",
  };
}
