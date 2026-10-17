import assert from 'node:assert/strict';
import test from 'node:test';
import { handleWebhook } from './worker.mjs';

const SECRET = 'test-secret-only';

class MemoryD1 {
  constructor() {
    this.deliveries = new Set();
  }

  prepare() {
    return {
      bind: (deliveryId) => ({
        run: async () => {
          if (this.deliveries.has(deliveryId)) {
            return { meta: { changes: 0 } };
          }
          this.deliveries.add(deliveryId);
          return { meta: { changes: 1 } };
        },
      }),
    };
  }
}

async function signatureFor(raw) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, raw);
  return Array.from(new Uint8Array(sig), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

async function signedRequest(body, deliveryId = '123', eventName = 'push') {
  const raw = new TextEncoder().encode(body);
  const sig = await signatureFor(raw);
  return new Request('https://example.test/github', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Abstrekkt-Delivery': deliveryId,
      'X-Abstrekkt-Event': eventName,
      'X-Abstrekkt-Signature-256': `sha256=${sig}`,
    },
    body: raw,
  });
}

function env() {
  return { WEBHOOK_SECRET: SECRET, DB: new MemoryD1() };
}

test('rejects non-POST methods', async () => {
  const response = await handleWebhook(new Request('https://example.test'), env());
  assert.equal(response.status, 405);
});

test('fails closed when runtime bindings are missing', async () => {
  const request = new Request('https://example.test', { method: 'POST' });
  const response = await handleWebhook(request, {});
  assert.equal(response.status, 503);
});

test('requires signature and delivery headers', async () => {
  const request = new Request('https://example.test', {
    method: 'POST',
    body: '{}',
  });
  const response = await handleWebhook(request, env());
  assert.equal(response.status, 400);
});

test('verifies signature before attempting JSON parse', async () => {
  const request = new Request('https://example.test', {
    method: 'POST',
    headers: {
      'X-Abstrekkt-Delivery': '123',
      'X-Abstrekkt-Signature-256': `sha256=${'0'.repeat(64)}`,
    },
    body: '{not-json',
  });
  const response = await handleWebhook(request, env());
  assert.equal(response.status, 401);
});

test('rejects invalid JSON only after valid signature', async () => {
  const request = await signedRequest('{not-json');
  const response = await handleWebhook(request, env());
  assert.equal(response.status, 400);
  assert.equal(await response.text(), 'Invalid JSON');
});

test('rejects delivery ID mismatch', async () => {
  const request = await signedRequest(
    JSON.stringify({ delivery_id: 'different', event_name: 'push' }),
  );
  const response = await handleWebhook(request, env());
  assert.equal(response.status, 400);
});

test('rejects event name mismatch', async () => {
  const request = await signedRequest(
    JSON.stringify({ delivery_id: '123', event_name: 'issues' }),
  );
  const response = await handleWebhook(request, env());
  assert.equal(response.status, 400);
});

test('accepts a valid delivery then rejects its replay', async () => {
  const runtime = env();
  const body = JSON.stringify({ delivery_id: '123', event_name: 'push' });

  const first = await handleWebhook(await signedRequest(body), runtime);
  assert.equal(first.status, 200);
  const firstBody = await first.json();
  assert.equal(firstBody.signature_verified, true);
  assert.equal(firstBody.parsed_after_verification, true);

  const replay = await handleWebhook(await signedRequest(body), runtime);
  assert.equal(replay.status, 409);
});

test('rejects oversized bodies', async () => {
  const body = 'a'.repeat(64 * 1024 + 1);
  const request = await signedRequest(body);
  const response = await handleWebhook(request, env());
  assert.equal(response.status, 413);
});

test('rejects signed non-object JSON instead of throwing', async () => {
  for (const body of ['null', '[]', '"text"', '42']) {
    const response = await handleWebhook(await signedRequest(body), env());
    assert.equal(response.status, 400, body);
  }
});
