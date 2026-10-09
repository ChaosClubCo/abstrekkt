import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  CONSOLE_UNAUTHORIZED_BODY,
  CONSOLE_UNCONFIGURED_BODY,
  REVOKED_CONSOLE_TOKEN_DIGESTS,
  authorizeConsoleAccess,
  isRevokedConsoleToken,
  readPresentedConsoleToken,
  resolveRequiredSecret,
  tokensMatch,
} from '../src/server/consoleAuth.mjs';

const LEAKED_DEMO_TOKEN = 'lakeview-public-demo-v1';
const VALID_CONSOLE_TOKEN = 'operator-console-secret';

function envWith(secrets) {
  return {
    get(name) {
      return secrets[name];
    },
  };
}

function requestWith({ authorization, consoleHeader } = {}) {
  const headers = new Headers();
  if (authorization) headers.set('Authorization', authorization);
  if (consoleHeader) headers.set('X-Loxihart-Console-Token', consoleHeader);
  return new Request('https://console.example/api/loxihart?operation=health', { headers });
}

test('revoked digest matches the leaked public demo token and no plaintext copy is stored', () => {
  const digest = createHash('sha256').update(LEAKED_DEMO_TOKEN, 'utf8').digest('hex');
  assert.equal(REVOKED_CONSOLE_TOKEN_DIGESTS.includes(digest), true);
  assert.equal(isRevokedConsoleToken(LEAKED_DEMO_TOKEN), true);
  assert.equal(isRevokedConsoleToken(` ${LEAKED_DEMO_TOKEN} `), true);
  assert.equal(isRevokedConsoleToken(VALID_CONSOLE_TOKEN), false);
});

test('tokensMatch is true only for equal non-empty secrets', () => {
  assert.equal(tokensMatch('abc', 'abc'), true);
  assert.equal(tokensMatch('abc', 'abd'), false);
  assert.equal(tokensMatch('', ''), false);
  assert.equal(tokensMatch('abc', ''), false);
});

test('missing or revoked env secrets fail closed with 503', async () => {
  const missing = resolveRequiredSecret(envWith({}), 'LOXIHART_CONSOLE_TOKEN');
  assert.equal(missing.ok, false);
  assert.equal(missing.response.status, 503);
  assert.deepEqual(JSON.parse(await missing.response.text()), CONSOLE_UNCONFIGURED_BODY);

  const revoked = resolveRequiredSecret(envWith({ LOXIHART_DEMO_TOKEN: LEAKED_DEMO_TOKEN }), 'LOXIHART_DEMO_TOKEN');
  assert.equal(revoked.ok, false);
  assert.equal(revoked.response.status, 503);
});

test('authorizeConsoleAccess requires Bearer or header token matching the env secret', async () => {
  const env = envWith({ LOXIHART_CONSOLE_TOKEN: VALID_CONSOLE_TOKEN });

  const missing = authorizeConsoleAccess(requestWith({}), env);
  assert.equal(missing.ok, false);
  assert.equal(missing.response.status, 401);
  assert.deepEqual(JSON.parse(await missing.response.text()), CONSOLE_UNAUTHORIZED_BODY);

  const wrong = authorizeConsoleAccess(requestWith({ authorization: 'Bearer other' }), env);
  assert.equal(wrong.ok, false);
  assert.equal(wrong.response.status, 401);

  const leaked = authorizeConsoleAccess(requestWith({ authorization: `Bearer ${LEAKED_DEMO_TOKEN}` }), env);
  assert.equal(leaked.ok, false);
  assert.equal(leaked.response.status, 401);

  const bearer = authorizeConsoleAccess(requestWith({ authorization: `Bearer ${VALID_CONSOLE_TOKEN}` }), env);
  assert.equal(bearer.ok, true);

  const header = authorizeConsoleAccess(requestWith({ consoleHeader: VALID_CONSOLE_TOKEN }), env);
  assert.equal(header.ok, true);
});

test('revoked console env secret fails closed even if the caller presents it', async () => {
  const env = envWith({ LOXIHART_CONSOLE_TOKEN: LEAKED_DEMO_TOKEN });
  const result = authorizeConsoleAccess(
    requestWith({ authorization: `Bearer ${LEAKED_DEMO_TOKEN}` }),
    env,
  );
  assert.equal(result.ok, false);
  assert.equal(result.response.status, 503);
});

test('readPresentedConsoleToken prefers Authorization Bearer over the console header', () => {
  const req = requestWith({
    authorization: 'Bearer from-auth',
    consoleHeader: 'from-header',
  });
  assert.equal(readPresentedConsoleToken(req), 'from-auth');
});
