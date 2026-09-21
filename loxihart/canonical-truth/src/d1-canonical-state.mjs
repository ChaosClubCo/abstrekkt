import {
  CanonicalMutationDenied,
  REQUIRED_ASSERTIONS,
  canonicalJson,
  sha256,
} from "./conformance-verifier.mjs";

export const D1_CANONICAL_STATE_ID = "primary";
export const D1_CANONICAL_ADAPTER_VERSION = "d1-canonical-state.v1";

export function createD1CanonicalStateAdapter({ database, transition }) {
  requireMethod(database, "prepare", "database");
  requireMethod(database, "batch", "database");
  if (typeof transition !== "function") deny("ADAPTER_NOT_CONFIGURED", "A deterministic canonical-state transition function is required");

  return Object.freeze({
    async readHead() { return (await readState(database)).canonical_head; },
    async readRuntimeStatus(now = new Date()) { return readRuntimeStatus(database, now); },
    async appendDenial(receipt) { return appendDenial(database, receipt); },
    async findCommittedOutcome(command) { return findCommittedOutcome(database, command); },
    async commitVerifiedMutation(input) { return commitVerifiedMutation(database, transition, input); },
  });
}

async function findCommittedOutcome(database, command) {
  const row = await first(database, `SELECT operation_id, result_id, actor_id, mutation_hash,
    after_head, after_version, status FROM canonical_mutation_operations
    WHERE operation_id = ? LIMIT 1`, command.operationId);
  if (!row) return null;
  const result = await first(database, "SELECT signature FROM canonical_conformance_results WHERE result_id = ? LIMIT 1", row.result_id);
  const mutationHash = sha256(strictCanonicalJson(command.mutation));
  if (row.status !== "COMMITTED" || row.result_id !== command.conformance?.payload?.resultId || row.actor_id !== command.actorId || row.mutation_hash !== mutationHash || result?.signature !== command.conformance?.signature) {
    deny("OPERATION_CONFLICT", "The operation ID is already bound to a different canonical mutation");
  }
  return Object.freeze({ canonicalHead: row.after_head, canonicalVersion: row.after_version, operationId: row.operation_id, receiptId: allowedReceiptId(row.operation_id), idempotent: true });
}

async function commitVerifiedMutation(database, transition, { command, verification, context, attemptedAt }) {
  const occurredAt = validDate(attemptedAt, "attemptedAt").toISOString();
  const mutationJson = strictCanonicalJson(command.mutation);
  const mutationHash = sha256(mutationJson);
  const envelope = command.conformance;
  const payload = envelope.payload;
  const [configuration, state, existingOperation, existingReplay, existingResult] = await Promise.all([
    readConfiguration(database),
    readState(database),
    first(database, "SELECT operation_id, result_id, mutation_hash, after_head, after_version, status FROM canonical_mutation_operations WHERE operation_id = ? LIMIT 1", command.operationId),
    first(database, "SELECT result_id, operation_id FROM canonical_conformance_replay WHERE result_id = ? LIMIT 1", verification.resultId),
    first(database, "SELECT result_id, signer_key_id, signature, payload_hash, consumed_at FROM canonical_conformance_results WHERE result_id = ? LIMIT 1", verification.resultId),
  ]);

  if (existingOperation) {
    if (existingOperation.status === "COMMITTED" && existingOperation.result_id === verification.resultId && existingOperation.mutation_hash === mutationHash) {
      return Object.freeze({ canonicalHead: existingOperation.after_head, canonicalVersion: existingOperation.after_version, operationId: existingOperation.operation_id, receiptId: allowedReceiptId(command.operationId), idempotent: true });
    }
    deny("OPERATION_CONFLICT", "The operation ID is already bound to a different canonical mutation");
  }
  if (existingReplay || existingResult?.consumed_at) deny("RESULT_REPLAYED", "The signed conformance result has already been consumed");
  if (existingResult && (existingResult.payload_hash !== verification.payloadHash || existingResult.signer_key_id !== verification.signerKeyId || existingResult.signature !== envelope.signature)) deny("CONFORMANCE_RESULT_CONFLICT", "The result ID is already bound to different signed conformance evidence");
  if (state.canonical_head !== context.canonicalHead) deny("HEAD_CHANGED", "Canonical head changed before the mutation could commit");

  validateConformance({ command, verification, context, configuration, state, attemptedAt });
  await requireActiveSigner(database, envelope.kid, occurredAt);
  const currentState = parseState(state.state_json);
  const nextState = transition(currentState, command.mutation);
  if (nextState && typeof nextState.then === "function") deny("INVALID_STATE", "Canonical transitions must be synchronous and free of external side effects");
  const nextStateJson = strictCanonicalJson(nextState);
  if (nextStateJson === state.state_json) deny("INVALID_STATE", "Canonical transitions must change canonical state");
  const nextVersion = state.version + 1;
  const afterHead = sha256({ mutationHash, previousHead: state.canonical_head, state: nextState, version: nextVersion });
  const receiptId = allowedReceiptId(command.operationId);
  const receiptJson = canonicalJson({ actorId: command.actorId, afterHead, beforeHead: state.canonical_head, decision: "ALLOWED", environment: context.environment, mutationHash, occurredAt, operationId: command.operationId, policyVersion: context.policyVersion, releaseLineage: context.releaseLineage, resultId: verification.resultId, type: "CANONICAL_MUTATION_ALLOWED" });

  const statements = [
    database.prepare(`INSERT OR IGNORE INTO canonical_conformance_results (
      result_id, suite_id, policy_version, release_lineage, environment,
      canonical_head, status, assertion_count, signature_algorithm,
      signer_key_id, signature, signature_verified, issued_at, expires_at,
      payload_hash, evidence_manifest_hash, envelope_json, received_at, consumed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, NULL)`).bind(
      payload.resultId, payload.suiteId, payload.policyVersion, payload.releaseLineage,
      payload.environment, payload.canonicalHead, payload.status, payload.assertions.length,
      envelope.alg, envelope.kid, envelope.signature, payload.issuedAt, payload.expiresAt,
      verification.payloadHash, payload.evidenceManifestHash, canonicalJson(envelope), occurredAt,
    ),
    database.prepare(`INSERT INTO canonical_mutation_operations (
      operation_id, result_id, actor_id, mutation_hash, mutation_json,
      before_head, after_head, before_version, after_version,
      policy_version, release_lineage, status, created_at, committed_at
    )
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, NULL
    FROM canonical_state AS state
    WHERE state.id = ? AND state.canonical_head = ?
      AND state.policy_version = ? AND state.release_lineage = ? AND state.environment = ?
      AND EXISTS (
        SELECT 1 FROM canonical_conformance_results AS result
        WHERE result.result_id = ? AND result.payload_hash = ?
          AND result.signer_key_id = ? AND result.signature_verified = 1
          AND result.consumed_at IS NULL
      )
      AND NOT EXISTS (
        SELECT 1 FROM canonical_conformance_replay WHERE result_id = ?
      )`).bind(
      command.operationId, verification.resultId, command.actorId, mutationHash, mutationJson,
      state.canonical_head, afterHead, state.version, nextVersion, context.policyVersion,
      context.releaseLineage, occurredAt, D1_CANONICAL_STATE_ID, context.canonicalHead,
      context.policyVersion, context.releaseLineage, context.environment,
      verification.resultId, verification.payloadHash, verification.signerKeyId, verification.resultId,
    ),
    database.prepare(`INSERT INTO canonical_conformance_replay (result_id, operation_id, claimed_at, expires_at)
      SELECT ?, ?, ?, ? FROM canonical_mutation_operations
      WHERE operation_id = ? AND status = 'PENDING'`).bind(
      verification.resultId, command.operationId, occurredAt, verification.expiresAt, command.operationId,
    ),
    database.prepare(`UPDATE canonical_state
      SET canonical_head = ?, version = ?, state_json = ?, updated_at = ?
      WHERE id = ? AND canonical_head = ?
        AND EXISTS (SELECT 1 FROM canonical_conformance_replay WHERE result_id = ? AND operation_id = ?)
        AND EXISTS (SELECT 1 FROM canonical_mutation_operations WHERE operation_id = ? AND status = 'PENDING')`).bind(
      afterHead, nextVersion, nextStateJson, occurredAt, D1_CANONICAL_STATE_ID,
      state.canonical_head, verification.resultId, command.operationId, command.operationId,
    ),
    database.prepare(`UPDATE canonical_mutation_operations SET status = 'COMMITTED', committed_at = ?
      WHERE operation_id = ? AND status = 'PENDING'
        AND EXISTS (SELECT 1 FROM canonical_state WHERE id = ? AND canonical_head = ? AND version = ?)`).bind(
      occurredAt, command.operationId, D1_CANONICAL_STATE_ID, afterHead, nextVersion,
    ),
    database.prepare(`UPDATE canonical_conformance_results SET consumed_at = ?
      WHERE result_id = ? AND consumed_at IS NULL
        AND EXISTS (SELECT 1 FROM canonical_mutation_operations WHERE operation_id = ? AND status = 'COMMITTED')`).bind(
      occurredAt, verification.resultId, command.operationId,
    ),
    database.prepare(`INSERT INTO canonical_mutation_receipts (
      receipt_id, operation_id, result_id, receipt_type, decision, actor_id,
      mutation_hash, before_head, after_head, reason_codes_json, receipt_json, created_at
    )
    SELECT ?, operation_id, result_id, 'CANONICAL_MUTATION_ALLOWED', 'ALLOWED', actor_id,
      mutation_hash, before_head, after_head, '[]', ?, ?
    FROM canonical_mutation_operations WHERE operation_id = ? AND status = 'COMMITTED'`).bind(
      receiptId, receiptJson, occurredAt, command.operationId,
    ),
    database.prepare(`INSERT INTO canonical_commit_guards (operation_id, committed, created_at)
      VALUES (?, CASE WHEN
        EXISTS (SELECT 1 FROM canonical_mutation_operations WHERE operation_id = ? AND status = 'COMMITTED')
        AND EXISTS (SELECT 1 FROM canonical_mutation_receipts WHERE receipt_id = ? AND decision = 'ALLOWED')
      THEN 1 ELSE 0 END, ?)`).bind(command.operationId, command.operationId, receiptId, occurredAt),
  ];

  try {
    await database.batch(statements);
  } catch (error) {
    const replay = await first(database, "SELECT operation_id FROM canonical_conformance_replay WHERE result_id = ? LIMIT 1", verification.resultId);
    if (replay && replay.operation_id !== command.operationId) deny("RESULT_REPLAYED", "The signed conformance result has already been claimed");
    const current = await readState(database);
    if (current.canonical_head !== context.canonicalHead) deny("HEAD_CHANGED", "Canonical head changed before the mutation could commit");
    throw new CanonicalMutationDenied("ATOMIC_COMMIT_FAILED", `The D1 canonical transaction did not commit atomically${error instanceof Error ? `: ${error.message}` : ""}`);
  }

  const committed = await first(database, "SELECT operation_id, result_id, mutation_hash, after_head, after_version, status FROM canonical_mutation_operations WHERE operation_id = ? LIMIT 1", command.operationId);
  if (!committed || committed.status !== "COMMITTED" || committed.result_id !== verification.resultId || committed.mutation_hash !== mutationHash || committed.after_head !== afterHead) deny("ATOMIC_COMMIT_FAILED", "The transaction completed without a matching committed operation");
  return Object.freeze({ canonicalHead: committed.after_head, canonicalVersion: committed.after_version, operationId: committed.operation_id, receiptId, idempotent: false });
}

async function appendDenial(database, receipt) {
  const occurredAt = validDate(new Date(receipt.occurredAt), "receipt.occurredAt").toISOString();
  if (!/^[A-Z][A-Z0-9_]{2,80}$/.test(receipt.denialCode ?? "")) deny("INVALID_RECEIPT", "A stable denial code is required");
  const receiptJson = strictCanonicalJson({ ...receipt, occurredAt });
  const receiptId = `cmd_${sha256(receiptJson).slice(0, 40)}`;
  await database.prepare(`INSERT OR IGNORE INTO canonical_mutation_receipts (
    receipt_id, operation_id, result_id, receipt_type, decision, actor_id,
    mutation_hash, before_head, after_head, reason_codes_json, receipt_json, created_at
  ) VALUES (?, ?, ?, 'CANONICAL_MUTATION_DENIED', 'DENIED', ?, ?, ?, NULL, ?, ?, ?)`).bind(
    receiptId, receipt.operationId ?? null, receipt.resultId ?? null, receipt.actorId ?? null,
    receipt.mutationHash ?? null, receipt.canonicalHead ?? null,
    canonicalJson([receipt.denialCode]), receiptJson, occurredAt,
  ).run();
  return Object.freeze({ receiptId });
}

async function readRuntimeStatus(database, now) {
  const observedAt = validDate(now, "now").toISOString();
  const [configuration, state, result, receipt, signerCount] = await Promise.all([
    readConfiguration(database), readState(database),
    first(database, `SELECT result_id, suite_id, policy_version, release_lineage, environment,
      canonical_head, status, assertion_count, signature_algorithm, signer_key_id, signature,
      signature_verified, issued_at, expires_at, payload_hash, evidence_manifest_hash, consumed_at,
      CASE WHEN EXISTS (
        SELECT 1 FROM canonical_trusted_signers AS signer
        WHERE signer.key_id = canonical_conformance_results.signer_key_id
          AND signer.algorithm = 'Ed25519' AND signer.revoked_at IS NULL
          AND signer.active_from <= ? AND (signer.active_until IS NULL OR signer.active_until > ?)
      ) THEN 1 ELSE 0 END AS signer_active
      FROM canonical_conformance_results ORDER BY received_at DESC, result_id DESC LIMIT 1`, observedAt, observedAt),
    first(database, "SELECT receipt_id, decision, before_head, after_head, created_at FROM canonical_mutation_receipts ORDER BY created_at DESC, receipt_id DESC LIMIT 1"),
    first(database, `SELECT COUNT(*) AS count FROM canonical_trusted_signers
      WHERE algorithm = 'Ed25519' AND revoked_at IS NULL AND active_from <= ?
        AND (active_until IS NULL OR active_until > ?)`, observedAt, observedAt),
  ]);
  const trustedSignerKeyCount = Number(signerCount?.count ?? 0);
  const conformance = conformanceStatus(result, configuration, state, trustedSignerKeyCount, new Date(observedAt));
  const reasonCodes = [];
  if (trustedSignerKeyCount === 0) reasonCodes.push("TRUSTED_SIGNER_KEYS_NOT_CONFIGURED");
  const freshnessReasons = { CONSUMED: "CONFORMANCE_RESULT_ALREADY_CONSUMED", EXPIRED: "SIGNED_CONFORMANCE_EXPIRED", FRESH: null, INVALID: "SIGNED_CONFORMANCE_INVALID", MISMATCH: "SIGNED_CONFORMANCE_CONTEXT_MISMATCH", MISSING: "FRESH_SIGNED_CONFORMANCE_MISSING", NOT_YET_VALID: "SIGNED_CONFORMANCE_NOT_YET_VALID", STALE: "SIGNED_CONFORMANCE_STALE", UNTRUSTED: "SIGNED_CONFORMANCE_SIGNER_UNTRUSTED" };
  if (freshnessReasons[conformance.freshness]) reasonCodes.push(freshnessReasons[conformance.freshness]);
  const ready = reasonCodes.length === 0;
  return Object.freeze({
    schemaVersion: 2,
    status: ready ? "READY" : trustedSignerKeyCount === 0 ? "NOT_CONFIGURED" : "DENIED",
    mutationDecision: ready ? "ALLOWED" : "DENIED",
    observedAt,
    canonicalHead: state.canonical_head,
    canonicalVersion: state.version,
    conformance,
    runtime: Object.freeze({ state: "CONNECTED", adapterVersion: configuration.adapter_version, canonicalStore: true, transactionCoordinator: true, replayStore: true, immutableReceiptSink: true, trustedSignerKeys: trustedSignerKeyCount > 0, trustedSignerKeyCount, statusFeed: "AUTHENTICATED_READ_ONLY" }),
    latestMutationReceipt: receipt ? Object.freeze({ receiptId: receipt.receipt_id, decision: receipt.decision, occurredAt: receipt.created_at, beforeHead: receipt.before_head, afterHead: receipt.after_head }) : null,
    reasonCodes: Object.freeze(reasonCodes),
  });
}

function conformanceStatus(result, configuration, state, signerCount, now) {
  const base = { suiteId: configuration.suite_id, requiredAssertions: configuration.required_assertions };
  if (!result) return Object.freeze({ ...base, resultId: null, signed: false, signatureVerified: false, signerKeyId: null, issuedAt: null, expiresAt: null, freshness: "MISSING", evidenceManifestHash: null });
  const issuedAt = new Date(result.issued_at); const expiresAt = new Date(result.expires_at);
  let freshness = "FRESH";
  if (result.signature_algorithm !== "Ed25519" || result.signature_verified !== 1 || !result.signature || !/^[a-f0-9]{64}$/.test(result.payload_hash) || !/^[a-f0-9]{64}$/.test(result.evidence_manifest_hash) || !Number.isFinite(issuedAt.getTime()) || !Number.isFinite(expiresAt.getTime())) freshness = "INVALID";
  else if (signerCount === 0 || result.signer_active !== 1) freshness = "UNTRUSTED";
  else if (result.consumed_at) freshness = "CONSUMED";
  else if (result.suite_id !== configuration.suite_id || result.assertion_count !== configuration.required_assertions || result.policy_version !== configuration.policy_version || result.release_lineage !== configuration.release_lineage || result.environment !== configuration.environment || result.canonical_head !== state.canonical_head || result.status !== "PASS") freshness = "MISMATCH";
  else if (issuedAt.getTime() > now.getTime() + 30_000) freshness = "NOT_YET_VALID";
  else if (expiresAt.getTime() <= now.getTime()) freshness = "EXPIRED";
  else if (now.getTime() - issuedAt.getTime() > configuration.max_result_age_seconds * 1_000) freshness = "STALE";
  return Object.freeze({ ...base, resultId: result.result_id, signed: Boolean(result.signature), signatureVerified: result.signature_verified === 1, signerKeyId: result.signer_key_id, issuedAt: result.issued_at, expiresAt: result.expires_at, freshness, evidenceManifestHash: result.evidence_manifest_hash });
}

function validateConformance({ command, verification, context, configuration, state, attemptedAt }) {
  const envelope = command.conformance; const payload = envelope.payload;
  const assertionMap = new Map(payload.assertions?.map((item) => [item.id, item.status]));
  const issuedAt = Date.parse(payload.issuedAt); const expiresAt = Date.parse(payload.expiresAt); const now = attemptedAt.getTime();
  const matches = envelope.alg === "Ed25519" && envelope.kid === verification.signerKeyId && payload.resultId === verification.resultId && payload.evidenceManifestHash === verification.evidenceManifestHash && payload.issuedAt === verification.issuedAt && payload.expiresAt === verification.expiresAt && /^[a-f0-9]{64}$/.test(verification.payloadHash) && payload.suiteId === configuration.suite_id && payload.policyVersion === configuration.policy_version && payload.policyVersion === context.policyVersion && payload.releaseLineage === configuration.release_lineage && payload.releaseLineage === context.releaseLineage && payload.environment === configuration.environment && payload.environment === context.environment && payload.canonicalHead === state.canonical_head && payload.canonicalHead === context.canonicalHead && payload.status === "PASS" && assertionMap.size === configuration.required_assertions && REQUIRED_ASSERTIONS.every((id) => assertionMap.get(id) === "PASS") && Number.isFinite(issuedAt) && Number.isFinite(expiresAt) && issuedAt <= now + 30_000 && now - issuedAt <= configuration.max_result_age_seconds * 1_000 && expiresAt > now && expiresAt > issuedAt;
  if (!matches) deny("INVALID_CONFORMANCE", "Only a fresh, verified conformance result matching the current runtime context can commit");
}

async function requireActiveSigner(database, keyId, now) {
  const signer = await first(database, `SELECT key_id FROM canonical_trusted_signers
    WHERE key_id = ? AND algorithm = 'Ed25519' AND revoked_at IS NULL
      AND active_from <= ? AND (active_until IS NULL OR active_until > ?) LIMIT 1`, keyId, now, now);
  if (!signer) deny("UNTRUSTED_SIGNER", "The verified conformance signer is not active in the canonical database");
}

async function readConfiguration(database) {
  const row = await first(database, `SELECT suite_id, required_assertions, policy_version,
    release_lineage, environment, adapter_version, max_result_age_seconds
    FROM canonical_runtime_config WHERE id = ? LIMIT 1`, D1_CANONICAL_STATE_ID);
  if (!row) deny("ADAPTER_NOT_CONFIGURED", "The canonical runtime configuration row is missing");
  return row;
}
async function readState(database) {
  const row = await first(database, `SELECT canonical_head, version, state_json, policy_version,
    release_lineage, environment FROM canonical_state WHERE id = ? LIMIT 1`, D1_CANONICAL_STATE_ID);
  if (!row || !/^[a-f0-9]{64}$/.test(row.canonical_head) || !Number.isSafeInteger(row.version)) deny("INVALID_STATE", "The primary canonical state row is missing or invalid");
  parseState(row.state_json); return row;
}
async function first(database, sql, ...bindings) { return database.prepare(sql).bind(...bindings).first(); }
function requireMethod(target, method, name) { if (typeof target?.[method] !== "function") deny("ADAPTER_NOT_CONFIGURED", `${name}.${method} is required`); }
function allowedReceiptId(operationId) { return `cma_${operationId}`; }
function validDate(value, name) { if (!(value instanceof Date) || !Number.isFinite(value.getTime())) deny("INVALID_TIME", `${name} must be a valid Date`); return value; }
function parseState(value) { try { const parsed = JSON.parse(value); strictCanonicalJson(parsed); return parsed; } catch (error) { if (error instanceof CanonicalMutationDenied) throw error; deny("INVALID_STATE", "Canonical state is not valid JSON"); } }
function strictCanonicalJson(value) { validateJson(value, "$", new Set()); return canonicalJson(value); }
function validateJson(value, path, ancestors) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") { if (!Number.isFinite(value)) deny("INVALID_STATE", `Invalid canonical JSON at ${path}`); return; }
  if (!value || typeof value !== "object") deny("INVALID_STATE", `Invalid canonical JSON at ${path}`);
  if (ancestors.has(value)) deny("INVALID_STATE", `Cyclic canonical JSON at ${path}`);
  ancestors.add(value);
  try {
    if (Array.isArray(value)) value.forEach((item, index) => validateJson(item, `${path}[${index}]`, ancestors));
    else {
      const prototype = Object.getPrototypeOf(value);
      if (prototype !== Object.prototype && prototype !== null) deny("INVALID_STATE", `Non-JSON object at ${path}`);
      for (const key of Object.keys(value)) validateJson(value[key], `${path}.${key}`, ancestors);
    }
  } finally { ancestors.delete(value); }
}
function deny(code, message) { throw new CanonicalMutationDenied(code, message); }
