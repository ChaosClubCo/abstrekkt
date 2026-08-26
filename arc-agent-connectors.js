// arc-agent-connectors.js — connector registry + real dispatch for Arc Agents.
//
// A "connector" is a configured way to reach an external system. Six kinds:
//   webhook  — plain JSON POST (n8n / Zapier / Make / custom)
//   mcp      — MCP server, Streamable HTTP, JSON-RPC 2.0 (list + call tools)
//   slack    — Slack Web API, chat.postMessage (bot token)
//   notion   — Notion API, create a page under a parent page/database
//   linear   — Linear GraphQL API, create an issue
//   gmail    — Gmail API, send a message (pasted OAuth access token)
//
// Every call is a REAL fetch from the browser to the service's official endpoint,
// using whatever URL/token the user pastes into the connector editor. There is no
// hidden backend here — if a service blocks browser CORS, the call fails visibly
// and that failure is logged, not silently swallowed.
//
// Storage:
//   arc-agents-connectors-v1 — [{id,name,kind,config:{...}}]
//   arc-agents-log-v1        — capped activity log (agent runs, skill calls, connector sends)

const CONN_KEY = 'arc-agents-connectors-v1';
const LOG_KEY = 'arc-agents-log-v1';
const LOG_CAP = 60;
const TIMEOUT_MS = 12000;

export const KINDS = [
  { id: 'webhook', label: 'Webhook / n8n', fields: [
      { k: 'url', label: 'URL', ph: 'https://your-n8n.app.n8n.cloud/webhook/…' },
      { k: 'token', label: 'Bearer token (optional)', ph: '' },
  ]},
  { id: 'mcp', label: 'MCP server', fields: [
      { k: 'url', label: 'Server URL', ph: 'https://…/mcp' },
      { k: 'token', label: 'Bearer token (optional)', ph: '' },
      { k: 'tool', label: 'Default tool name', ph: 'arc_event' },
  ]},
  { id: 'slack', label: 'Slack', fields: [
      { k: 'token', label: 'Bot token', ph: 'xoxb-…' },
      { k: 'channel', label: 'Default channel', ph: '#general or C0123…' },
  ]},
  { id: 'notion', label: 'Notion', fields: [
      { k: 'token', label: 'Integration token', ph: 'secret_… / ntn_…' },
      { k: 'parentId', label: 'Parent page or database ID', ph: '32-char id' },
      { k: 'parentType', label: 'Parent type: page | database', ph: 'page' },
  ]},
  { id: 'linear', label: 'Linear', fields: [
      { k: 'token', label: 'API key', ph: 'lin_api_…' },
      { k: 'teamId', label: 'Team ID', ph: '' },
  ]},
  { id: 'gmail', label: 'Gmail', fields: [
      { k: 'token', label: 'OAuth access token', ph: 'ya29…' },
      { k: 'to', label: 'Default recipient', ph: 'you@example.com' },
  ]},
];

export function kindMeta(id) { return KINDS.find(k => k.id === id) || KINDS[0]; }

// ---------------- connector storage ----------------
export function loadConnectors() {
  try { const raw = localStorage.getItem(CONN_KEY); const v = raw ? JSON.parse(raw) : []; return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}
export function saveConnectors(list) { try { localStorage.setItem(CONN_KEY, JSON.stringify(list)); } catch (e) {} }
function uid(p) { return p + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7); }
export function newConnector(kind) { return { id: uid('conn'), name: kindMeta(kind).label, kind, config: {} }; }

// ---------------- activity log ----------------
let log = [];
try { const raw = localStorage.getItem(LOG_KEY); if (raw) log = JSON.parse(raw) || []; } catch (e) {}
const listeners = new Set();
export function subscribeLog(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }
function persist() { try { localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, LOG_CAP))); } catch (e) {} }
export function getLog() { return log; }
export function pushLog(entry) {
  const e = { id: uid('log'), ts: Date.now(), ...entry };
  log.unshift(e); if (log.length > LOG_CAP) log.length = LOG_CAP;
  persist(); emit();
  return e;
}
export function updateLog(id, patch) {
  const e = log.find(l => l.id === id); if (!e) return;
  Object.assign(e, patch); persist(); emit();
}

// ---------------- fetch helper ----------------
async function timedFetch(url, opts) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    const text = await res.text().catch(() => '');
    let json = null; try { json = text ? JSON.parse(text) : null; } catch (e) {}
    return { ok: res.ok, status: res.status, text, json };
  } catch (err) {
    if (err && err.name === 'AbortError') throw new Error('Timeout after ' + (TIMEOUT_MS / 1000) + 's');
    throw err;
  } finally { clearTimeout(to); }
}

// ---------------- per-kind actions ----------------
// Each returns { ok, summary, raw }. Throws on hard failure (network/timeout).

async function actWebhook(conn, args) {
  const cfg = conn.config || {};
  if (!cfg.url) throw new Error('No URL configured.');
  const headers = { 'Content-Type': 'application/json' };
  if (cfg.token) headers['Authorization'] = 'Bearer ' + cfg.token;
  const r = await timedFetch(cfg.url, { method: 'POST', headers, body: JSON.stringify(args || {}) });
  if (!r.ok) throw new Error('HTTP ' + r.status + (r.text ? ' — ' + r.text.slice(0, 180) : ''));
  return { ok: true, summary: 'HTTP ' + r.status, raw: r.json || r.text };
}

function parseSse(text) {
  const out = [];
  text.split(/\r?\n\r?\n/).forEach(block => {
    const data = block.split(/\r?\n/).filter(l => l.indexOf('data:') === 0).map(l => l.slice(5).trim()).join('');
    if (data) { try { out.push(JSON.parse(data)); } catch (e) {} }
  });
  return out;
}
const mcpSessions = {};
async function mcpPost(cfg, msg, sid) {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' };
  if (cfg.token) headers['Authorization'] = 'Bearer ' + cfg.token;
  if (sid) headers['Mcp-Session-Id'] = sid;
  const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(cfg.url, { method: 'POST', headers, body: JSON.stringify(msg), signal: ctrl.signal });
    if (res.status === 202) return { res, reply: null };
    const text = await res.text().catch(() => '');
    if (!res.ok) throw new Error('HTTP ' + res.status + (text ? ' — ' + text.slice(0, 180) : ''));
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    let reply = null;
    if (ct.indexOf('text/event-stream') >= 0) {
      const msgs = parseSse(text).filter(m => m && ('result' in m || 'error' in m));
      reply = msgs.find(m => m.id === msg.id) || msgs[0] || null;
    } else if (text) { try { let j = JSON.parse(text); if (Array.isArray(j)) j = j.find(m => m.id === msg.id) || j[0]; reply = j; } catch (e) {} }
    return { res, reply };
  } finally { clearTimeout(to); }
}
async function ensureMcpSession(conn) {
  const cfg = conn.config || {};
  if (mcpSessions[conn.id] !== undefined) return mcpSessions[conn.id];
  const init = { jsonrpc: '2.0', id: uid('rpc'), method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'arc-agents', version: '1.0' } } };
  const { res, reply } = await mcpPost(cfg, init, null);
  if (reply && reply.error) throw new Error('MCP initialize failed: ' + (reply.error.message || reply.error.code));
  const sid = res.headers.get('mcp-session-id') || '';
  mcpSessions[conn.id] = sid;
  try { await mcpPost(cfg, { jsonrpc: '2.0', method: 'notifications/initialized' }, sid || null); } catch (e) {}
  return sid;
}
export async function mcpListTools(conn) {
  const sid = await ensureMcpSession(conn);
  const { reply } = await mcpPost(conn.config || {}, { jsonrpc: '2.0', id: uid('rpc'), method: 'tools/list', params: {} }, sid || null);
  if (!reply) throw new Error('No JSON-RPC reply.');
  if (reply.error) throw new Error(reply.error.message || 'tools/list error');
  return (reply.result && reply.result.tools) || [];
}
async function actMcp(conn, args) {
  const cfg = conn.config || {};
  if (!cfg.url) throw new Error('No server URL configured.');
  const sid = await ensureMcpSession(conn);
  const toolName = (args && args.__tool) || cfg.tool || 'arc_event';
  const toolArgs = (args && args.__tool) ? { ...args, __tool: undefined } : args;
  const { reply } = await mcpPost(cfg, { jsonrpc: '2.0', id: uid('rpc'), method: 'tools/call', params: { name: toolName, arguments: toolArgs || {} } }, sid || null);
  if (!reply) throw new Error('MCP: no JSON-RPC reply.');
  if (reply.error) throw new Error('MCP error: ' + (reply.error.message || reply.error.code));
  const content = reply.result && reply.result.content;
  const text = Array.isArray(content) ? content.map(c => (c && c.text) ? c.text : '').join(' ').trim() : '';
  if (reply.result && reply.result.isError) throw new Error('Tool error: ' + (text || 'unknown').slice(0, 200));
  return { ok: true, summary: (text || 'tools/call ok').slice(0, 240), raw: reply.result };
}

async function actSlack(conn, args) {
  const cfg = conn.config || {};
  if (!cfg.token) throw new Error('No Slack bot token configured.');
  const channel = (args && args.channel) || cfg.channel;
  if (!channel) throw new Error('No Slack channel configured.');
  const r = await timedFetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': 'Bearer ' + cfg.token },
    body: JSON.stringify({ channel, text: (args && args.text) || '' }),
  });
  if (!r.json || !r.json.ok) throw new Error('Slack: ' + (r.json ? r.json.error : ('HTTP ' + r.status)));
  return { ok: true, summary: 'Posted to ' + channel, raw: r.json };
}

async function actNotion(conn, args) {
  const cfg = conn.config || {};
  if (!cfg.token) throw new Error('No Notion token configured.');
  if (!cfg.parentId) throw new Error('No parent page/database ID configured.');
  const isDb = (cfg.parentType || 'page').toLowerCase() === 'database';
  const title = (args && args.title) || 'Untitled';
  const body = (args && args.body) || '';
  const parent = isDb ? { database_id: cfg.parentId } : { page_id: cfg.parentId };
  const properties = isDb
    ? { [cfg.titleProp || 'Name']: { title: [{ text: { content: title } }] } }
    : { title: { title: [{ text: { content: title } }] } };
  const children = body ? [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: body.slice(0, 1900) } }] } }] : [];
  const r = await timedFetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.token, 'Notion-Version': '2022-06-28' },
    body: JSON.stringify({ parent, properties, children }),
  });
  if (!r.ok) throw new Error('Notion: ' + (r.json && r.json.message ? r.json.message : ('HTTP ' + r.status)));
  return { ok: true, summary: 'Page created: ' + title, raw: r.json };
}

async function actLinear(conn, args) {
  const cfg = conn.config || {};
  if (!cfg.token) throw new Error('No Linear API key configured.');
  const teamId = (args && args.teamId) || cfg.teamId;
  if (!teamId) throw new Error('No Linear team ID configured.');
  const title = (args && args.title) || 'Untitled issue';
  const description = (args && args.description) || '';
  const query = `mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier title url } } }`;
  const r = await timedFetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': cfg.token },
    body: JSON.stringify({ query, variables: { input: { teamId, title, description } } }),
  });
  const data = r.json && r.json.data && r.json.data.issueCreate;
  if (!data || !data.success) throw new Error('Linear: ' + (r.json && r.json.errors ? r.json.errors[0].message : ('HTTP ' + r.status)));
  return { ok: true, summary: 'Issue ' + data.issue.identifier + ' created', raw: data.issue };
}

function b64urlEncode(str) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function actGmail(conn, args) {
  const cfg = conn.config || {};
  if (!cfg.token) throw new Error('No Gmail OAuth access token configured.');
  const to = (args && args.to) || cfg.to;
  if (!to) throw new Error('No recipient configured.');
  const subject = (args && args.subject) || '(no subject)';
  const body = (args && args.body) || '';
  const raw = b64urlEncode(`To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${body}`);
  const r = await timedFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.token },
    body: JSON.stringify({ raw }),
  });
  if (!r.ok) throw new Error('Gmail: ' + (r.json && r.json.error ? r.json.error.message : ('HTTP ' + r.status)));
  return { ok: true, summary: 'Email sent to ' + to, raw: r.json };
}

const ACTORS = { webhook: actWebhook, mcp: actMcp, slack: actSlack, notion: actNotion, linear: actLinear, gmail: actGmail };

// ---------------- public entry ----------------
// live=false => dry-run: builds the call, logs it, sends nothing.
export async function callConnector(conn, args, opts) {
  opts = opts || {};
  const entry = pushLog({ kind: 'connector', connector: conn.name, connectorKind: conn.kind, args, status: 'pending' });
  if (opts.live === false) {
    updateLog(entry.id, { status: 'dry', response: 'Dry-run — not sent.' });
    return { ok: true, dry: true, summary: 'Dry-run — payload logged, nothing sent.' };
  }
  try {
    const fn = ACTORS[conn.kind];
    if (!fn) throw new Error('Unknown connector kind: ' + conn.kind);
    const result = await fn(conn, args);
    updateLog(entry.id, { status: 'ok', response: result.summary });
    return result;
  } catch (err) {
    const msg = String((err && err.message) || err);
    updateLog(entry.id, { status: 'fail', response: msg });
    throw err;
  }
}
