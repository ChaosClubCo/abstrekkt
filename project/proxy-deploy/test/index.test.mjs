import assert from 'node:assert/strict';
import test from 'node:test';
import { handle, upstreamUrl } from '../src/index.js';

const ENV = { PROXY_TOKEN: 'proxy-token-for-tests', NOTION_TOKEN: 'notion-secret-for-tests' };

function call(body) {
  return new Request('https://proxy.example.test/call', {
    method: 'POST',
    headers: { authorization: `Bearer ${ENV.PROXY_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function withFetchSpy(fn) {
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    return { response: await fn(), calls };
  } finally {
    globalThis.fetch = original;
  }
}

test('upstreamUrl keeps requests on the base origin', () => {
  assert.equal(upstreamUrl('https://api.notion.com', '/v1/pages'), 'https://api.notion.com/v1/pages');
  assert.equal(upstreamUrl('https://mcp.example.test/base/', '/tools'), 'https://mcp.example.test/base/tools');
  assert.equal(upstreamUrl('https://api.notion.com', '@evil.example/x'), null);
  assert.equal(upstreamUrl('https://api.notion.com', '.evil.example/x'), null);
  assert.equal(upstreamUrl('https://api.notion.com', ':8443/x'), null);
  assert.equal(upstreamUrl('not a url', '/x'), null);
});

test('omitted, null, or empty path is the documented root-path exception', () => {
  assert.equal(upstreamUrl('https://api.notion.com', ''), 'https://api.notion.com/');
  assert.equal(upstreamUrl('https://api.notion.com', null), 'https://api.notion.com/');
  assert.equal(upstreamUrl('https://api.notion.com', undefined), 'https://api.notion.com/');
});

test('rejection message states the root-path exception', async () => {
  const { response } = await withFetchSpy(() =>
    handle(call({ target: 'notion', method: 'GET', path: 'v1/pages' }), ENV));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /omitted \(upstream root\) or start with \//);
});

test('origin-escaping path is rejected before any upstream fetch', async () => {
  const { response, calls } = await withFetchSpy(() =>
    handle(call({ target: 'notion', method: 'GET', path: '@evil.example/collect' }), ENV));
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test('valid path forwards to the target origin with the injected secret', async () => {
  const { response, calls } = await withFetchSpy(() =>
    handle(call({ target: 'notion', method: 'GET', path: '/v1/users/me' }), ENV));
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(new URL(calls[0].url).origin, 'https://api.notion.com');
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${ENV.NOTION_TOKEN}`);
});

test('missing or wrong proxy token is rejected', async () => {
  const request = new Request('https://proxy.example.test/call', { method: 'POST', body: '{}' });
  assert.equal((await handle(request, ENV)).status, 401);
});
