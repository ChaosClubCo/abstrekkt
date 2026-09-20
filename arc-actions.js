// arc-actions.js — outbound automation dispatcher for the Arc suite.
//
// Fires events from UI interactions (checklist clicks, toggles, position moves)
// to user-configured endpoints. Two transports:
//   - webhook : plain JSON POST (n8n / Zapier / Make / Supabase edge fn / custom)
//   - mcp     : MCP server over Streamable HTTP — JSON-RPC 2.0 tools/call,
//               lazy initialize handshake, Mcp-Session-Id support, SSE-or-JSON replies.
//
// Reliability design (per current webhook/MCP best practice):
//   - Every event carries a stable unique id (idempotency key). Retries reuse it,
//     so at-least-once delivery can be deduped receiver-side.
//   - Delivery: up to 3 attempts, exponential backoff + full jitter, 12s timeout.
//     4xx (except 408/429) is never retried. Exhausted events stay in the log as
//     'fail' (dead-letter) with manual retry.
//   - Dry-run by default: until the user flips Live, payloads are built + logged
//     but nothing leaves the browser.
//
// Storage:
//   arc-actions-config-v1 — { live, endpoints:[{id,name,type,url,token,tool}], routes:{event:epId|'default'|'off'} }
//   arc-actions-log-v1    — capped delivery log (doubles as the dead-letter queue)

const CONFIG_KEY = 'arc-actions-config-v1';
const LOG_KEY = 'arc-actions-log-v1';
const LOG_CAP = 40;
const TIMEOUT_MS = 12000;
const BACKOFF = [0, 1800, 6000]; // ms before attempt N (plus jitter)

export const EVENT_TYPES = [
  { type: 'arc.week.checked',      label: 'Week sprint checked' },
  { type: 'arc.week.unchecked',    label: 'Week sprint unchecked' },
  { type: 'arc.gate.completed',    label: 'Gate 100% — all 4 weeks' },
  { type: 'arc.toggled',           label: 'Arc toggled on / off' },
  { type: 'arc.position.changed',  label: 'Month / week position moved' },
  { type: 'arc.standup.generated', label: 'Weekly standup sent (Momentum)' },
];

// ---------------- config ----------------
// Pre-provisioned default: the published n8n "Arc Execution — Event Router v2" workflow
// (https://krosebrook.app.n8n.cloud/workflow/IQwuNcYUCglWfzFd — CORS open, responds 200 immediately,
// routes by event type into data-table records + Notion/Slack/Gmail/Linear actions).
// Seeded once when no endpoints exist; deleting it afterwards sticks (seeded flag).
const SEED_ENDPOINTS = [{
  id: 'ep_n8n_arc_router',
  name: 'n8n — Arc Event Router',
  type: 'webhook',
  url: 'https://krosebrook.app.n8n.cloud/webhook/arc-events',
  token: '',
  tool: 'arc_event',
}];

export function loadConfig() {
  let c = null;
  try { const raw = localStorage.getItem(CONFIG_KEY); if (raw) c = JSON.parse(raw); } catch (e) {}
  const fresh = !c;
  if (!c) c = {};
  const out = {
    live: fresh ? true : !!c.live, // fresh installs go live against the seeded router
    endpoints: Array.isArray(c.endpoints) ? c.endpoints : [],
    routes: (c.routes && typeof c.routes === 'object') ? c.routes : {},
    seeded: !!c.seeded,
  };
  if (!out.seeded && out.endpoints.length === 0) {
    out.endpoints = SEED_ENDPOINTS.map(e => ({ ...e }));
    out.seeded = true;
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(out)); } catch (e) {}
  }
  return out;
}

export function saveConfig(cfg) {
  try { localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg)); } catch (e) {}
  emit();
}

// ---------------- log (also the dead-letter queue) ----------------
let log = [];
try { const raw = localStorage.getItem(LOG_KEY); if (raw) log = JSON.parse(raw) || []; } catch (e) {}
// anything still 'pending' from a previous session died with the page
log.forEach(e => { if (e.status === 'pending') { e.status = 'fail'; e.response = 'Interrupted — page closed mid-delivery.'; } });

function persistLog() {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, LOG_CAP))); } catch (e) {}
}
export function getLog() { return log; }

// ---------------- pub/sub ----------------
const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }

// ---------------- helpers ----------------
function uid(p) { return p + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

export function buildEnvelope(type, data) {
  return {
    id: uid('evt'),                    // idempotency key — stable across retries
    event: type,
    occurredAt: new Date().toISOString(),
    source: 'arc-execution',
    data: data || {},
  };
}

function resolveEndpoint(cfg, type) {
  const route = cfg.routes[type];
  if (route === 'off') return { off: true };
  if (route && route !== 'default') {
    const ep = cfg.endpoints.find(e => e.id === route);
    if (ep) return { ep };
  }
  return { ep: cfg.endpoints[0] || null }; // first endpoint is the default target
}

function pushEntry(entry) { log.unshift(entry); if (log.length > LOG_CAP) log.length = LOG_CAP; persistLog(); emit(); }
function updateEntry(entry, patch) { Object.assign(entry, patch); persistLog(); emit(); }

// ---------------- dispatch ----------------
export function dispatch(type, data, meta) {
  meta = meta || {};
  const cfg = loadConfig();
  const env = buildEnvelope(type, data);
  const r = resolveEndpoint(cfg, type);
  const ep = r.ep;
  const entry = {
    id: env.id, event: type,
    summary: meta.summary || type,
    cellKey: meta.cellKey || null,
    endpoint: ep ? (ep.name || ep.url) : null,
    endpointId: ep ? ep.id : null,
    status: 'pending', attempts: 0, ms: 0, ts: Date.now(),
    payload: env, response: null,
  };
  if (r.off)      { entry.status = 'off'; entry.response = 'Routing for this event is set to Off.'; pushEntry(entry); return entry; }
  if (!ep)        { entry.status = 'dry'; entry.response = 'No endpoint configured — payload logged only.'; pushEntry(entry); return entry; }
  if (!cfg.live)  { entry.status = 'dry'; entry.response = 'Dry-run mode — payload logged, nothing sent.'; pushEntry(entry); return entry; }
  pushEntry(entry);
  deliver(entry, ep, BACKOFF.length);
  return entry;
}

export function retry(entryId) {
  const entry = log.find(e => e.id === entryId);
  if (!entry || entry.status === 'pending') return;
  const cfg = loadConfig();
  const ep = (entry.endpointId && cfg.endpoints.find(e => e.id === entry.endpointId))
    || resolveEndpoint(cfg, entry.event).ep;
  if (!ep) { updateEntry(entry, { status: 'fail', response: 'Endpoint no longer configured.' }); return; }
  updateEntry(entry, { status: 'pending', response: null, endpoint: ep.name || ep.url, endpointId: ep.id });
  deliver(entry, ep, BACKOFF.length); // same payload → same idempotency key
}

export function testFire(epId) {
  const cfg = loadConfig();
  const ep = cfg.endpoints.find(e => e.id === epId);
  if (!ep) return null;
  const env = buildEnvelope('arc.ping', { note: 'Test fire from Arc Execution settings', mode: 'test' });
  const entry = {
    id: env.id, event: 'arc.ping', summary: 'Test fire → ' + (ep.name || ep.url),
    test: true, cellKey: null, endpoint: ep.name || ep.url, endpointId: ep.id,
    status: 'pending', attempts: 0, ms: 0, ts: Date.now(), payload: env, response: null,
  };
  pushEntry(entry);
  deliver(entry, ep, 2); // tests bypass dry-run; 2 attempts for fast feedback
  return entry;
}

async function deliver(entry, ep, maxAttempts) {
  for (let i = 0; i < maxAttempts; i++) {
    if (BACKOFF[i]) await sleep(BACKOFF[i] + Math.round(Math.random() * BACKOFF[i] * 0.5)); // jitter
    updateEntry(entry, { status: 'pending', attempts: entry.attempts + 1 });
    const t0 = Date.now();
    try {
      const summary = ep.type === 'mcp' ? await sendMcp(ep, entry.payload) : await sendWebhook(ep, entry.payload);
      updateEntry(entry, { status: 'ok', ms: Date.now() - t0, response: summary });
      return;
    } catch (err) {
      updateEntry(entry, { ms: Date.now() - t0, response: String((err && err.message) || err) });
      const st = err && err.status;
      if (st && st >= 400 && st < 500 && st !== 408 && st !== 429) break; // non-retriable
    }
  }
  updateEntry(entry, { status: 'fail' }); // dead-letter — manual retry from the log
}

// ---------------- webhook transport ----------------
async function sendWebhook(ep, env) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const headers = { 'Content-Type': 'application/json', 'X-Event-Id': env.id, 'X-Event-Type': env.event };
    if (ep.token) headers['Authorization'] = 'Bearer ' + ep.token;
    const res = await fetch(ep.url, { method: 'POST', headers, body: JSON.stringify(env), signal: ctrl.signal });
    const text = await res.text().catch(() => '');
    if (!res.ok) { const e = new Error('HTTP ' + res.status + (text ? ' — ' + text.slice(0, 180) : '')); e.status = res.status; throw e; }
    return 'HTTP ' + res.status + (text ? ' — ' + text.slice(0, 240) : '');
  } catch (err) {
    if (err && err.name === 'AbortError') throw new Error('Timeout after ' + (TIMEOUT_MS / 1000) + 's');
    throw err;
  } finally { clearTimeout(to); }
}

// ---------------- MCP transport (Streamable HTTP, JSON-RPC 2.0) ----------------
const sessions = {}; // endpointId -> Mcp-Session-Id ('' for stateless servers)

function parseSse(text) {
  const out = [];
  text.split(/\r?\n\r?\n/).forEach(block => {
    const data = block.split(/\r?\n/).filter(l => l.indexOf('data:') === 0).map(l => l.slice(5).trim()).join('');
    if (data) { try { out.push(JSON.parse(data)); } catch (e) {} }
  });
  return out;
}

async function mcpPost(ep, msg, sid) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' };
    if (ep.token) headers['Authorization'] = 'Bearer ' + ep.token;
    if (sid) headers['Mcp-Session-Id'] = sid;
    const res = await fetch(ep.url, { method: 'POST', headers, body: JSON.stringify(msg), signal: ctrl.signal });
    if (res.status === 404 && sid) {
      delete sessions[ep.id];
      const e = new Error('MCP session expired — will re-initialize'); e.status = 503; throw e; // retriable
    }
    if (res.status === 202) return { res, reply: null }; // accepted notification
    const text = await res.text().catch(() => '');
    if (!res.ok) { const e = new Error('HTTP ' + res.status + (text ? ' — ' + text.slice(0, 180) : '')); e.status = res.status; throw e; }
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    let reply = null;
    if (ct.indexOf('text/event-stream') >= 0) {
      const msgs = parseSse(text).filter(m => m && ('result' in m || 'error' in m));
      reply = msgs.find(m => m.id === msg.id) || msgs[0] || null;
    } else if (text) {
      try { let j = JSON.parse(text); if (Array.isArray(j)) j = j.find(m => m.id === msg.id) || j[0]; reply = j; } catch (e) {}
    }
    return { res, reply };
  } catch (err) {
    if (err && err.name === 'AbortError') throw new Error('Timeout after ' + (TIMEOUT_MS / 1000) + 's');
    throw err;
  } finally { clearTimeout(to); }
}

async function ensureSession(ep) {
  if (sessions[ep.id] !== undefined) return sessions[ep.id];
  const init = {
    jsonrpc: '2.0', id: uid('rpc'), method: 'initialize',
    params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'arc-execution', version: '1.0' } },
  };
  const { res, reply } = await mcpPost(ep, init, null);
  if (reply && reply.error) throw new Error('MCP initialize failed: ' + (reply.error.message || reply.error.code));
  const sid = res.headers.get('mcp-session-id') || '';
  sessions[ep.id] = sid;
  try { await mcpPost(ep, { jsonrpc: '2.0', method: 'notifications/initialized' }, sid || null); } catch (e) {}
  return sid;
}

async function sendMcp(ep, env) {
  const sid = await ensureSession(ep);
  const call = { jsonrpc: '2.0', id: uid('rpc'), method: 'tools/call', params: { name: ep.tool || 'arc_event', arguments: env } };
  const { reply } = await mcpPost(ep, call, sid || null);
  if (!reply) throw new Error('MCP: no JSON-RPC reply in response');
  if (reply.error) throw new Error('MCP error ' + (reply.error.code !== undefined ? reply.error.code : '') + ': ' + (reply.error.message || ''));
  const content = reply.result && reply.result.content;
  const text = Array.isArray(content) ? content.map(c => (c && c.text) ? c.text : '').join(' ').trim() : '';
  if (reply.result && reply.result.isError) throw new Error('MCP tool error: ' + (text || 'unknown').slice(0, 200));
  return (text || 'tools/call ok').slice(0, 240);
}
