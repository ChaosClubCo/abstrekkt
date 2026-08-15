import assert from "node:assert/strict";
import { createHash, verify as verifySignature } from "node:crypto";

export const REQUIRED_SUITE_ID = "canonical-truth.acceptance.v1";
export const REQUIRED_ASSERTIONS = Object.freeze([
  "CT-001-CONTRADICTION-DETECTED",
  "CT-002-PROMOTION-FAILS-CLOSED",
  "CT-003-AUTHORITY-IS-PREDICATE-SCOPED",
  "CT-004-CANONICAL-DECISION-RECEIPTED",
  "CT-005-MEMORY-PROJECTS-CANONICAL-ONLY",
  "CT-006-OLD-CLAIM-BECOMES-STALE",
  "CT-007-PROJECTION-IS-INVALIDATED",
  "CT-008-HISTORY-IS-PRESERVED",
  "CT-009-NEW-REVISION-REQUIRES-VERIFICATION",
  "CT-010-MUTATIONS-HAVE-IMMUTABLE-RECEIPTS",
]);

export class CanonicalMutationDenied extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CanonicalMutationDenied";
    this.code = code;
  }
}

export function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
}

export function sha256(value) {
  return createHash("sha256").update(typeof value === "string" ? value : canonicalJson(value)).digest("hex");
}

function deny(code, message) {
  throw new CanonicalMutationDenied(code, message);
}

export function verifySignedConformanceResult(envelope, context, config) {
  try {
    assert(envelope && typeof envelope === "object");
    assert.equal(envelope.alg, "Ed25519");
    assert.equal(typeof envelope.kid, "string");
    assert.equal(typeof envelope.signature, "string");
    assert(envelope.payload && typeof envelope.payload === "object");
  } catch {
    deny("MALFORMED_ENVELOPE", "Signed conformance envelope is malformed");
  }

  const publicKey = config.trustedPublicKeys?.[envelope.kid];
  if (!publicKey) deny("UNTRUSTED_SIGNER", "Conformance signer is not trusted");

  const payloadBytes = Buffer.from(canonicalJson(envelope.payload));
  let signature;
  try {
    signature = Buffer.from(envelope.signature, "base64url");
  } catch {
    deny("INVALID_SIGNATURE_ENCODING", "Signature is not valid base64url");
  }
  if (!verifySignature(null, payloadBytes, publicKey, signature)) {
    deny("INVALID_SIGNATURE", "Conformance signature verification failed");
  }

  const result = envelope.payload;
  const nowMs = context.now.getTime();
  const issuedMs = Date.parse(result.issuedAt);
  const expiresMs = Date.parse(result.expiresAt);
  if (!Number.isFinite(issuedMs) || !Number.isFinite(expiresMs)) deny("INVALID_TIME", "Conformance timestamps are invalid");
  if (issuedMs > nowMs + config.clockSkewMs) deny("NOT_YET_VALID", "Conformance result was issued in the future");
  if (nowMs - issuedMs > config.maxAgeMs) deny("STALE_RESULT", "Conformance result is stale");
  if (expiresMs <= nowMs || expiresMs <= issuedMs) deny("EXPIRED_RESULT", "Conformance result has expired");

  const exact = [
    [result.suiteId, config.suiteId, "SUITE_MISMATCH"],
    [result.policyVersion, context.policyVersion, "POLICY_MISMATCH"],
    [result.releaseLineage, context.releaseLineage, "LINEAGE_MISMATCH"],
    [result.environment, context.environment, "ENVIRONMENT_MISMATCH"],
    [result.canonicalHead, context.canonicalHead, "HEAD_MISMATCH"],
  ];
  for (const [actual, expected, code] of exact) if (actual !== expected) deny(code, `${code}: expected ${expected}`);
  if (result.status !== "PASS") deny("SUITE_FAILED", "Conformance suite did not pass");
  if (!/^[a-f0-9]{64}$/.test(result.evidenceManifestHash ?? "")) deny("INVALID_EVIDENCE_HASH", "Evidence manifest hash is invalid");
  if (!/^[A-Za-z0-9._:-]{16,128}$/.test(result.resultId ?? "")) deny("INVALID_RESULT_ID", "Result ID is invalid");

  const assertionMap = new Map((result.assertions ?? []).map((item) => [item.id, item.status]));
  if (assertionMap.size !== REQUIRED_ASSERTIONS.length) deny("ASSERTION_SET_MISMATCH", "Conformance assertion set is incomplete or contains duplicates");
  for (const id of REQUIRED_ASSERTIONS) if (assertionMap.get(id) !== "PASS") deny("ASSERTION_FAILED", `Required assertion did not pass: ${id}`);

  return Object.freeze({
    resultId: result.resultId,
    signerKeyId: envelope.kid,
    evidenceManifestHash: result.evidenceManifestHash,
    issuedAt: result.issuedAt,
    expiresAt: result.expiresAt,
    payloadHash: sha256(result),
  });
}

export function defaultVerificationConfig(overrides = {}) {
  return Object.freeze({
    suiteId: REQUIRED_SUITE_ID,
    maxAgeMs: 15 * 60 * 1000,
    clockSkewMs: 30 * 1000,
    trustedPublicKeys: {},
    ...overrides,
  });
}
