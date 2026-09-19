import { createPublicKey } from "node:crypto";
import { executeCanonicalMutation } from "./canonical-mutation-command.mjs";
import { defaultVerificationConfig } from "./conformance-verifier.mjs";

export class CanonicalMutationRuntimeConfigurationError extends Error {
  constructor(message) { super(message); this.name = "CanonicalMutationRuntimeConfigurationError"; }
}
function requireText(value, name) { if (typeof value !== "string" || value.trim() === "") throw new CanonicalMutationRuntimeConfigurationError(`${name} is required`); return value; }
function requireMethod(target, method, name) { if (typeof target?.[method] !== "function") throw new CanonicalMutationRuntimeConfigurationError(`${name}.${method} is required`); }

export function parseTrustedPublicKeys(json) {
  let input;
  try { input = JSON.parse(requireText(json, "LOXIHART_CONFORMANCE_PUBLIC_KEYS_JSON")); }
  catch (error) { if (error instanceof CanonicalMutationRuntimeConfigurationError) throw error; throw new CanonicalMutationRuntimeConfigurationError("Trusted public keys must be valid JSON"); }
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length === 0) throw new CanonicalMutationRuntimeConfigurationError("At least one trusted conformance public key is required");
  return Object.fromEntries(Object.entries(input).map(([kid, pem]) => {
    requireText(kid, "signer key ID"); requireText(pem, `public key ${kid}`);
    let key; try { key = createPublicKey(pem); } catch { throw new CanonicalMutationRuntimeConfigurationError(`Public key ${kid} is invalid`); }
    if (key.type !== "public" || key.asymmetricKeyType !== "ed25519") throw new CanonicalMutationRuntimeConfigurationError(`Public key ${kid} must be Ed25519`);
    return [kid, key];
  }));
}

export function createCanonicalMutationCommandHandler(options) {
  const policyVersion = requireText(options?.policyVersion, "policyVersion");
  const releaseLineage = requireText(options?.releaseLineage, "releaseLineage");
  const environment = requireText(options?.environment, "environment");
  requireMethod(options?.clock, "now", "clock");

  const atomicMutationStore = options?.atomicMutationStore;
  if (atomicMutationStore) {
    for (const method of ["readHead", "findCommittedOutcome", "commitVerifiedMutation", "appendDenial"]) requireMethod(atomicMutationStore, method, "atomicMutationStore");
  } else {
    for (const [target, methods, name] of [[options?.canonicalStore, ["readHead", "readHeadForUpdate", "applyMutation"], "canonicalStore"], [options?.replayStore, ["consumeOnce"], "replayStore"], [options?.receiptSink, ["append"], "receiptSink"], [options?.transaction, ["run"], "transaction"]]) for (const method of methods) requireMethod(target, method, name);
  }

  const keys = options?.trustedPublicKeys;
  if (!keys || Object.keys(keys).length === 0) throw new CanonicalMutationRuntimeConfigurationError("At least one trusted conformance public key is required");
  const dependencies = Object.freeze({
    atomicMutationStore,
    canonicalStore: options?.canonicalStore,
    replayStore: options?.replayStore,
    receiptSink: options?.receiptSink,
    transaction: options?.transaction,
    clock: options.clock,
    policyVersion,
    releaseLineage,
    environment,
    verificationConfig: defaultVerificationConfig({ trustedPublicKeys: keys, maxAgeMs: options.maxAgeMs, clockSkewMs: options.clockSkewMs }),
  });
  return Object.freeze({ execute(command) { return executeCanonicalMutation(command, dependencies); } });
}
