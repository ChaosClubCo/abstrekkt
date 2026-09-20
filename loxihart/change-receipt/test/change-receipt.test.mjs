import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ChangeReceiptValidationError, validateChangeReceipt } from "../src/validate-change-receipt.mjs";

const load = async (name) => JSON.parse(await readFile(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));
const clone = (value) => structuredClone(value);

test("frozen schema identifies v1 and rejects unbounded properties", async () => {
  const schemaBytes = await readFile(new URL("../schema/change-receipt.v1.schema.json", import.meta.url));
  const schema = JSON.parse(schemaBytes.toString("utf8"));
  const freeze = JSON.parse(await readFile(new URL("../FROZEN.json", import.meta.url), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, "https://abstrekkt.com/schemas/loxihart/change-receipt.v1.schema.json");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema_version.const, "loxihart.change-receipt.v1");
  assert.equal(schema.properties.signer.$ref, "#/$defs/signer");
  assert.equal(createHash("sha256").update(schemaBytes).digest("hex"), freeze.schema_sha256);
});

test("VERIFIED and UNVERIFIED fixtures satisfy the contract", async () => {
  assert.equal(validateChangeReceipt(await load("verified.valid.json")).verdict, "VERIFIED");
  assert.equal(validateChangeReceipt(await load("unverified.valid.json")).verdict, "UNVERIFIED");
});

test("VERIFIED fails closed without successful tests and provider read-back", async (t) => {
  const valid = await load("verified.valid.json");
  const cases = [
    ["failed test", (value) => { value.verification.tests[0].exit_code = 1; }],
    ["mismatched read-back", (value) => { value.verification.read_back.status = "MISMATCH"; }],
    ["different observed commit", (value) => { value.verification.read_back.observed_commit = "f".repeat(40); }],
    ["missing result commit", (value) => { value.change.result_commit = null; }],
    ["failed check", (value) => { value.verification.checks[0].status = "FAIL"; }],
  ];
  for (const [name, mutate] of cases) await t.test(name, () => {
    const value = clone(valid);
    mutate(value);
    assert.throws(() => validateChangeReceipt(value), ChangeReceiptValidationError);
  });
});

test("scope, extension, and verdict boundaries fail closed", async (t) => {
  const valid = await load("verified.valid.json");
  const cases = [
    ["unknown root field", (value) => { value.secret = "must-not-pass"; }],
    ["parent traversal", (value) => { value.authority.allowed_paths = ["../outside/**"]; }],
    ["expired authority", (value) => { value.authority.expires_at = "2026-08-16T04:00:00.000Z"; }],
    ["non-agent actor", (value) => { value.actor.type = "human"; }],
    ["verified with failure reason", (value) => { value.failure_reasons = ["TEST_FAILED"]; }],
  ];
  for (const [name, mutate] of cases) await t.test(name, () => {
    const value = clone(valid);
    mutate(value);
    assert.throws(() => validateChangeReceipt(value), ChangeReceiptValidationError);
  });
});

test("a non-VERIFIED receipt must carry a machine-readable reason", async () => {
  const value = await load("unverified.valid.json");
  value.failure_reasons = [];
  assert.throws(() => validateChangeReceipt(value), /at least one failure reason/);
});
