import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import test from "node:test";

import { executeCanonicalMutation } from "../src/canonical-mutation-command.mjs";
import { REQUIRED_ASSERTIONS, canonicalJson, defaultVerificationConfig } from "../src/conformance-verifier.mjs";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const NOW = new Date("2026-08-15T20:00:00.000Z");

function envelope(overrides = {}) {
  const payload = {
    resultId: "ctr_20260815T200000Z_0001",
    suiteId: "canonical-truth.acceptance.v1",
    policyVersion: "canonical-policy.v1",
    releaseLineage: "loxihart/main@abc123",
    environment: "production",
    canonicalHead: "head-41",
    status: "PASS",
    issuedAt: "2026-08-15T19:55:00.000Z",
    expiresAt: "2026-08-15T20:10:00.000Z",
    evidenceManifestHash: "a".repeat(64),
    assertions: REQUIRED_ASSERTIONS.map((id) => ({ id, status: "PASS" })),
    ...overrides,
  };
  return { alg: "Ed25519", kid: "conformance-prod-2026-01", payload, signature: sign(null, Buffer.from(canonicalJson(payload)), privateKey).toString("base64url") };
}

function harness() {
  const receipts = [];
  const used = new Set();
  let head = "head-41";
  let applications = 0;
  return {
    receipts,
    applications: () => applications,
    dependencies: {
      clock: { now: () => NOW },
      policyVersion: "canonical-policy.v1",
      releaseLineage: "loxihart/main@abc123",
      environment: "production",
      verificationConfig: defaultVerificationConfig({ trustedPublicKeys: { "conformance-prod-2026-01": publicKey } }),
      transaction: { run: async (fn) => fn({}) },
      replayStore: { consumeOnce: async (id) => used.has(id) ? false : (used.add(id), true) },
      receiptSink: { append: async (receipt) => receipts.push(receipt) },
      canonicalStore: {
        readHead: async () => head,
        readHeadForUpdate: async () => head,
        applyMutation: async () => { applications += 1; head = "head-42"; return { canonicalHead: head }; },
      },
    },
  };
}

const command = (conformance) => ({ actorId: "agent:release", operationId: "op-001", mutation: { claimId: "claim-1", action: "PROMOTE" }, conformance });

test("valid fresh signed result authorizes exactly one transactional mutation", async () => {
  const h = harness();
  const result = await executeCanonicalMutation(command(envelope()), h.dependencies);
  assert.equal(result.canonicalHead, "head-42");
  assert.equal(h.applications(), 1);
  assert.equal(h.receipts.at(-1).type, "CANONICAL_MUTATION_ALLOWED");
});

test("tampered, stale, wrong-lineage, partial, and replayed results fail closed", async (t) => {
  const cases = [
    ["tampered", () => { const value = envelope(); value.payload.status = "FAIL"; return value; }, "INVALID_SIGNATURE"],
    ["stale", () => envelope({ issuedAt: "2026-08-15T19:00:00.000Z" }), "STALE_RESULT"],
    ["wrong lineage", () => envelope({ releaseLineage: "loxihart/other@deadbeef" }), "LINEAGE_MISMATCH"],
    ["partial", () => envelope({ assertions: REQUIRED_ASSERTIONS.slice(1).map((id) => ({ id, status: "PASS" })) }), "ASSERTION_SET_MISMATCH"],
  ];
  for (const [name, make, code] of cases) await t.test(name, async () => {
    const h = harness();
    await assert.rejects(() => executeCanonicalMutation(command(make()), h.dependencies), (error) => error.code === code);
    assert.equal(h.applications(), 0);
    assert.equal(h.receipts.at(-1).type, "CANONICAL_MUTATION_DENIED");
  });

  const h = harness();
  await executeCanonicalMutation(command(envelope()), h.dependencies);
  await assert.rejects(() => executeCanonicalMutation(command(envelope({ canonicalHead: "head-42" })), h.dependencies), (error) => error.code === "RESULT_REPLAYED");
  assert.equal(h.applications(), 1);
});
