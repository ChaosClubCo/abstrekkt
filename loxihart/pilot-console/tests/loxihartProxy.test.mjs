import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONSOLE_UNAUTHORIZED_BODY, CONSOLE_UNCONFIGURED_BODY } from '../src/server/consoleAuth.mjs';
import { handleLoxihartProxy } from '../src/server/loxihartProxy.mjs';

const LEAKED_DEMO_TOKEN = 'lakeview-public-demo-v1';
const CONSOLE_TOKEN = 'operator-console-secret';
const DEMO_TOKEN = 'rotated-demo-secret';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function envWith(secrets) {
  return {
    get(name) {
      return secrets[name];
    },
  };
}

function authorizedRequest(url = 'https://console.example/api/loxihart?operation=health') {
  return new Request(url, {
    headers: { Authorization: `Bearer ${CONSOLE_TOKEN}`, Accept: 'application/json' },
  });
}

function configuredEnv() {
  return envWith({
    LOXIHART_CONSOLE_TOKEN: CONSOLE_TOKEN,
    LOXIHART_DEMO_TOKEN: DEMO_TOKEN,
  });
}

test('unauthenticated health does not call upstream', async () => {
  let calls = 0;
  const response = await handleLoxihartProxy(
    new Request('https://console.example/api/loxihart?operation=health'),
    configuredEnv(),
    { fetchImpl: async () => { calls += 1; return new Response('{}'); } },
  );
  assert.equal(response.status, 401);
  assert.deepEqual(JSON.parse(await response.text()), CONSOLE_UNAUTHORIZED_BODY);
  assert.equal(calls, 0);
});

test('unauthenticated mutation does not call upstream', async () => {
  let calls = 0;
  const response = await handleLoxihartProxy(
    new Request('https://console.example/api/loxihart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'workflow.approve',
        expectedVersion: 0,
        mutationId: 'attacker',
      }),
    }),
    configuredEnv(),
    { fetchImpl: async () => { calls += 1; return new Response('{}'); } },
  );
  assert.equal(response.status, 401);
  assert.deepEqual(JSON.parse(await response.text()), CONSOLE_UNAUTHORIZED_BODY);
  assert.equal(calls, 0);
});

test('revoked demo env secret does not call upstream even with a valid console token', async () => {
  let calls = 0;
  const response = await handleLoxihartProxy(
    authorizedRequest(),
    envWith({
      LOXIHART_CONSOLE_TOKEN: CONSOLE_TOKEN,
      LOXIHART_DEMO_TOKEN: LEAKED_DEMO_TOKEN,
    }),
    { fetchImpl: async () => { calls += 1; return new Response('{}'); } },
  );
  assert.equal(response.status, 503);
  assert.deepEqual(JSON.parse(await response.text()), CONSOLE_UNCONFIGURED_BODY);
  assert.equal(calls, 0);
});

test('missing secrets fail closed before parse or forward', async () => {
  let calls = 0;
  const response = await handleLoxihartProxy(
    authorizedRequest(),
    envWith({ LOXIHART_CONSOLE_TOKEN: CONSOLE_TOKEN }),
    { fetchImpl: async () => { calls += 1; return new Response('{}'); } },
  );
  assert.equal(response.status, 503);
  assert.equal(calls, 0);
});

test('authorized health forwards the rotated demo token and not the leaked token', async () => {
  let captured;
  const upstream = JSON.stringify({ ok: true });
  const response = await handleLoxihartProxy(
    authorizedRequest(),
    configuredEnv(),
    {
      controlApiBase: 'https://control.example',
      fetchImpl: async (url, init) => {
        captured = { url, token: init.headers.get('X-Loxihart-Demo-Token') };
        return new Response(upstream, { status: 200, headers: { 'Content-Type': 'application/json' } });
      },
    },
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), upstream);
  assert.equal(captured.url, 'https://control.example/health');
  assert.equal(captured.token, DEMO_TOKEN);
  assert.notEqual(captured.token, LEAKED_DEMO_TOKEN);
});

test('authorized mutation still allowlists operations after auth', async () => {
  const response = await handleLoxihartProxy(
    new Request('https://console.example/api/loxihart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONSOLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'arbitrary.path' }),
    }),
    configuredEnv(),
    { fetchImpl: async () => new Response('should-not-run') },
  );
  assert.equal(response.status, 422);
  const body = JSON.parse(await response.text());
  assert.equal(body.error.code, 'PROXY_VALIDATION_ERROR');
});

test('function and SPA sources do not hardcode the leaked demo token', () => {
  const files = [
    'netlify/functions/loxihart.mts',
    'src/server/loxihartProxy.mjs',
    'src/server/consoleAuth.mjs',
    'src/api.ts',
    'src/App.tsx',
    'src/AccessGate.tsx',
    'src/consoleToken.ts',
  ];
  for (const relative of files) {
    const source = readFileSync(join(ROOT, relative), 'utf8');
    assert.equal(source.includes(LEAKED_DEMO_TOKEN), false, `${relative} must not contain the leaked token`);
    assert.equal(source.includes('STAGING_DEMO_TOKEN'), false, `${relative} must not contain STAGING_DEMO_TOKEN`);
  }
});
