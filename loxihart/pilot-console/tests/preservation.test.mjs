import test from "node:test";
import assert from "node:assert/strict";
import {
  CONTROL_API_TIMEOUT_BODY,
  CONTROL_API_UNREACHABLE_BODY,
  buildUpstreamHeaders,
  forwardLoxihart,
} from "../src/server/loxihartTransport.mjs";

const identity = {
  demoToken: "server-token",
  organizationId: "org-lakeview-hvac",
  actorId: "operator:kyle-demo",
};

const cases = [
  [403, { error: { code: "UNAUTHORIZED", message: "Invalid demo identity." } }],
  [404, { error: { code: "NOT_FOUND", message: "Pilot not found." } }],
  [409, { error: { code: "STALE_VERSION", message: "expectedVersion 3 does not match current version 4.", currentVersion: 4 } }],
  [422, { error: { code: "INVALID_TRANSITION", message: "sop.approve requires CURRENT_WORKFLOW_APPROVED; current stage is DISCOVERY_ACTIVE." } }],
  [500, { error: { code: "PERSISTENCE_INTEGRITY", message: "Canonical chain is invalid." } }],
];

for (const [status, body] of cases) {
  test(`preserves upstream ${status} status and JSON body exactly`, async () => {
    let calls = 0;
    const raw = JSON.stringify(body);
    const response = await forwardLoxihart({
      url: "https://control.example/test",
      identity,
      fetchImpl: async () => {
        calls += 1;
        return new Response(raw, { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
      },
    });
    assert.equal(response.status, status);
    assert.equal(await response.text(), raw);
    assert.equal(calls, 1);
  });
}

test("preserves receipt-specific 404 body", async () => {
  const body = { error: { code: "RECEIPT_NOT_FOUND", message: "Receipt not found." } };
  const raw = JSON.stringify(body);
  const response = await forwardLoxihart({
    url: "https://control.example/receipt",
    identity,
    fetchImpl: async () => new Response(raw, { status: 404 }),
  });
  assert.equal(response.status, 404);
  assert.deepEqual(JSON.parse(await response.text()), body);
});

test("preserves duplicate mutation 409 body", async () => {
  const body = { error: { code: "DUPLICATE_MUTATION", message: "Mutation already exists." } };
  const raw = JSON.stringify(body);
  const response = await forwardLoxihart({
    url: "https://control.example/mutate",
    method: "POST",
    body: { expectedVersion: 3, mutationId: "dup" },
    identity,
    fetchImpl: async () => new Response(raw, { status: 409 }),
  });
  assert.equal(response.status, 409);
  assert.deepEqual(JSON.parse(await response.text()), body);
});

test("preserves validation 422 body", async () => {
  const body = { error: { code: "VALIDATION_ERROR", message: "expectedVersion must be a non-negative integer." } };
  const raw = JSON.stringify(body);
  const response = await forwardLoxihart({
    url: "https://control.example/mutate",
    identity,
    fetchImpl: async () => new Response(raw, { status: 422 }),
  });
  assert.equal(response.status, 422);
  assert.deepEqual(JSON.parse(await response.text()), body);
});

test("preserves integrity 500 body", async () => {
  const body = { error: { code: "INTEGRITY_ERROR", message: "New receipt failed verification: signature_invalid" } };
  const raw = JSON.stringify(body);
  const response = await forwardLoxihart({
    url: "https://control.example/verify",
    identity,
    fetchImpl: async () => new Response(raw, { status: 500 }),
  });
  assert.equal(response.status, 500);
  assert.deepEqual(JSON.parse(await response.text()), body);
});

test("generates 502 only when fetch fails before an HTTP response", async () => {
  let calls = 0;
  const response = await forwardLoxihart({
    url: "https://control.example/test",
    identity,
    fetchImpl: async () => {
      calls += 1;
      throw new TypeError("fetch failed");
    },
  });
  assert.equal(response.status, 502);
  assert.deepEqual(JSON.parse(await response.text()), CONTROL_API_UNREACHABLE_BODY);
  assert.equal(calls, 1);
});

test("generates 504 only when timeout aborts before an HTTP response", async () => {
  let calls = 0;
  const response = await forwardLoxihart({
    url: "https://control.example/test",
    identity,
    timeoutMs: 5,
    fetchImpl: async (_url, init) => {
      calls += 1;
      await new Promise((resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })), { once: true });
      });
    },
  });
  assert.equal(response.status, 504);
  assert.deepEqual(JSON.parse(await response.text()), CONTROL_API_TIMEOUT_BODY);
  assert.equal(calls, 1);
});

test("real 500 received before timeout remains 500, never 504", async () => {
  const raw = JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "upstream" } });
  const response = await forwardLoxihart({
    url: "https://control.example/test",
    identity,
    timeoutMs: 100,
    fetchImpl: async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return new Response(raw, { status: 500 });
    },
  });
  assert.equal(response.status, 500);
  assert.equal(await response.text(), raw);
});

test("browser authority headers cannot override server identity", () => {
  const headers = buildUpstreamHeaders({
    browserHeaders: {
      "X-Loxihart-Demo-Token": "attacker",
      "X-Loxihart-Organization": "evil-org",
      "X-Loxihart-Actor": "attacker",
      "X-Request-ID": "safe-client-header",
    },
    identity,
  });
  assert.equal(headers.get("X-Loxihart-Demo-Token"), "server-token");
  assert.equal(headers.get("X-Loxihart-Organization"), "org-lakeview-hvac");
  assert.equal(headers.get("X-Loxihart-Actor"), "operator:kyle-demo");
  assert.equal(headers.get("X-Request-ID"), "safe-client-header");
});
