import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import test from "node:test";

import { createD1CanonicalStateAdapter } from "../src/d1-canonical-state.mjs";
import { REQUIRED_ASSERTIONS, canonicalJson } from "../src/conformance-verifier.mjs";
import { createCanonicalMutationCommandHandler } from "../src/runtime.mjs";
import { createMigratedD1Database } from "./sqlite-d1.mjs";

const GENESIS_HEAD = "38aed4593d3dcd1b5f31eabf874831dea010ac605212abcbf83162c35fb4cde4";
const NOW = new Date("2026-08-16T00:10:00.000Z");
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

function signed(resultId = "ctr_20260816T000500Z_0001") {
  const payload = {
    resultId,
    suiteId: "canonical-truth.acceptance.v1",
    policyVersion: "canonical-policy.v1",
    releaseLineage: "loxihart/main@667542d3909996699ea2b23e3e12b4f37ba5f0fa",
    environment: "production",
    canonicalHead: GENESIS_HEAD,
    status: "PASS",
    issuedAt: "2026-08-16T00:05:00.000Z",
    expiresAt: "2026-08-16T00:15:00.000Z",
    evidenceManifestHash: "a".repeat(64),
    assertions: REQUIRED_ASSERTIONS.map((id) => ({ id, status: "PASS" })),
  };
  return {
    alg: "Ed25519",
    kid: "prod-1",
    payload,
    signature: sign(null, Buffer.from(canonicalJson(payload)), privateKey).toString("base64url"),
  };
}

async function fixture() {
  const database = createMigratedD1Database();
  await database.prepare(`INSERT INTO canonical_trusted_signers (
    key_id, algorithm, public_key_spki_base64, active_from, active_until,
    revoked_at, created_at
  ) VALUES (?, 'Ed25519', ?, ?, NULL, NULL, ?)`).bind(
    "prod-1",
    publicKey.export({ type: "spki", format: "der" }).toString("base64"),
    "2026-08-15T00:00:00.000Z",
    "2026-08-15T00:00:00.000Z",
  ).run();
  const adapter = createD1CanonicalStateAdapter({
    database,
    transition(state, mutation) {
      return { ...state, claims: { ...state.claims, [mutation.claimId]: mutation.value } };
    },
  });
  const handler = createCanonicalMutationCommandHandler({
    atomicMutationStore: adapter,
    policyVersion: "canonical-policy.v1",
    releaseLineage: "loxihart/main@667542d3909996699ea2b23e3e12b4f37ba5f0fa",
    environment: "production",
    trustedPublicKeys: { "prod-1": publicKey },
    clock: { now: () => NOW },
  });
  return { adapter, database, handler };
}

function command(overrides = {}) {
  return {
    executionMode: "AUTONOMOUS",
    actorId: "agent:release",
    operationId: overrides.operationId ?? "op-00000001",
    mutation: overrides.mutation ?? { action: "PROMOTE", claimId: "claim-1", value: "supported" },
    conformance: overrides.conformance ?? signed(),
  };
}

test("actual command handler commits the verified mutation through one atomic D1 batch", async () => {
  const { adapter, database, handler } = await fixture();
  const input = command();
  const outcome = await handler.execute(input);
  assert.equal(outcome.canonicalVersion, 1);
  assert.match(outcome.canonicalHead, /^[a-f0-9]{64}$/);
  assert.notEqual(outcome.canonicalHead, GENESIS_HEAD);

  const state = await database.prepare("SELECT version, state_json FROM canonical_state WHERE id = 'primary'").first();
  assert.equal(state.version, 1);
  assert.deepEqual(JSON.parse(state.state_json), { claims: { "claim-1": "supported" }, schemaVersion: 1 });
  assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM canonical_conformance_replay").first()).count, 1);
  assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM canonical_mutation_receipts WHERE decision = 'ALLOWED'").first()).count, 1);

  const retry = await handler.execute(input);
  assert.equal(retry.idempotent, true);
  assert.equal(retry.canonicalHead, outcome.canonicalHead);
  assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM canonical_mutation_receipts WHERE decision = 'ALLOWED'").first()).count, 1);

  const status = await adapter.readRuntimeStatus(NOW);
  assert.equal(status.runtime.transactionCoordinator, true);
  assert.equal(status.conformance.freshness, "CONSUMED");
  assert.equal(status.mutationDecision, "DENIED");
});

test("same signed result cannot authorize a second operation and denial is receipted", async () => {
  const { database, handler } = await fixture();
  const envelope = signed();
  await handler.execute(command({ conformance: envelope }));
  await assert.rejects(
    handler.execute(command({ operationId: "op-00000002", conformance: envelope })),
    (error) => error.code === "HEAD_MISMATCH",
  );
  const denials = await database.prepare("SELECT denial.receipt_json FROM canonical_mutation_receipts AS denial WHERE decision = 'DENIED'").all();
  assert.equal(denials.results.length, 1);
  assert.match(denials.results[0].receipt_json, /HEAD_MISMATCH/);
});

test("database triggers prevent receipt or replay tampering", async () => {
  const { database, handler } = await fixture();
  await handler.execute(command());
  await assert.rejects(database.prepare("UPDATE canonical_mutation_receipts SET decision = 'DENIED' WHERE decision = 'ALLOWED'").run(), /append-only/);
  await assert.rejects(database.prepare("DELETE FROM canonical_conformance_replay").run(), /immutable/);
});

test("startup accepts the atomic adapter without legacy split adapters", async () => {
  const { handler } = await fixture();
  assert.equal(typeof handler.execute, "function");
});
