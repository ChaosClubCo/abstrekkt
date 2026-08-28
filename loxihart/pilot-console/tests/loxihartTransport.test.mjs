import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveOperation,
  forwardLoxihart,
  CONTROL_API_TIMEOUT_BODY,
  CONTROL_API_UNREACHABLE_BODY,
} from '../src/server/loxihartTransport.mjs';

const identity = {
  demoToken: 'server-token',
  organizationId: 'org-lakeview-hvac',
  actorId: 'operator:kyle-demo',
};

test('resolveOperation allowlists pilot.read', () => {
  assert.deepEqual(resolveOperation('pilot.read', {}), {
    method: 'GET',
    path: '/v1/pilots/pilot-lakeview-001',
    body: undefined,
  });
});

test('resolveOperation encodes receipt IDs and uses POST for verify', () => {
  assert.deepEqual(resolveOperation('receipt.verify', { receiptId: 'cr_a/b' }), {
    method: 'POST',
    path: '/v1/pilots/pilot-lakeview-001/receipts/cr_a%2Fb/verify',
    body: undefined,
  });
});

test('resolveOperation rejects unknown operations', () => {
  assert.throws(() => resolveOperation('arbitrary.path', {}), /Unsupported proxy operation/);
});

test('verification strips operation but preserves observation body', () => {
  const payload = { expectedVersion: 3, mutationId: 'm1', postChange: { value: 0.95 }, guardrails: [] };
  const resolved = resolveOperation('verification.commit', payload);
  assert.equal(resolved.method, 'POST');
  assert.equal(resolved.path, '/v1/pilots/pilot-lakeview-001/verification/commit');
  assert.deepEqual(resolved.body, payload);
});

test('verification rejects client authoritative fields', () => {
  assert.throws(
    () => resolveOperation('verification.commit', { expectedVersion: 1, mutationId: 'm1', verdict: 'PASS' }),
    /Authoritative verification fields cannot be supplied by the client/,
  );
});

for (const status of [403, 404, 409, 422, 500]) {
  test(`Netlify transport preserves ${status} and raw JSON body`, async () => {
    const raw = JSON.stringify({ error: { code: `E${status}`, message: `status-${status}` } });
    let calls = 0;
    const response = await forwardLoxihart({
      url: 'https://control.example/test',
      method: 'POST',
      body: { x: 1 },
      identity,
      fetchImpl: async (_url, init) => {
        calls += 1;
        assert.equal(init.headers.get('X-Loxihart-Demo-Token'), 'server-token');
        assert.equal(init.headers.get('X-Loxihart-Organization'), 'org-lakeview-hvac');
        assert.equal(init.headers.get('X-Loxihart-Actor'), 'operator:kyle-demo');
        return new Response(raw, { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      },
    });
    assert.equal(calls, 1);
    assert.equal(response.status, status);
    assert.equal(await response.text(), raw);
  });
}

test('network failure generates 502 only', async () => {
  const response = await forwardLoxihart({
    url: 'https://control.example/test',
    identity,
    fetchImpl: async () => { throw new TypeError('fetch failed'); },
  });
  assert.equal(response.status, 502);
  assert.deepEqual(JSON.parse(await response.text()), CONTROL_API_UNREACHABLE_BODY);
});

test('timeout generates 504 only', async () => {
  const response = await forwardLoxihart({
    url: 'https://control.example/test',
    identity,
    timeoutMs: 5,
    fetchImpl: async (_url, init) => {
      await new Promise((resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })), { once: true });
      });
    },
  });
  assert.equal(response.status, 504);
  assert.deepEqual(JSON.parse(await response.text()), CONTROL_API_TIMEOUT_BODY);
});

test('real 500 before timeout remains 500', async () => {
  const raw = JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'upstream' } });
  const response = await forwardLoxihart({
    url: 'https://control.example/test',
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
