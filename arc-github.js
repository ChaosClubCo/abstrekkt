// arc-github.js — optional GitHub bridge (PERSISTENCE_PLAN.md §1): every arc
// mutation becomes a real commit instead of only an in-place JSON overwrite.
// Off by default; everything no-ops until owner/repo/token are saved via
// Finish the Sync - Claude Handoff.dc.html (step 05). Plain fetch against
// api.github.com — no SDK, matching arc-sync.js's zero-dependency style.
//
// Risk split, per AGENTIC_ACCESS_PLAN.md §5: low-risk ops (edit_meta/edit_gate/
// edit_week/edit_prose/rename_arc) commit straight to the configured branch.
// High-risk ops (create_arc/delete_arc) commit to a fresh branch and open a PR —
// the diff view IS the approval gate, no separate approval UI needed.
//
// Single-repo default: both arcs-data.json and arcs-prose.json commit to the
// same owner/repo/branch (the "one repo or split?" open decision in
// PERSISTENCE_PLAN.md resolves itself either way — it's just config here).
//
// Storage: arc-github-config-v1 — { enabled, owner, repo, branch, token, dataPath, prosePath }

const CFG_KEY = 'arc-github-config-v1';
const DEFAULT_CFG = { enabled: false, owner: '', repo: '', branch: 'main', token: '', dataPath: 'arcs-data.json', prosePath: 'arcs-prose.json' };

export function loadConfig() {
  try { const raw = localStorage.getItem(CFG_KEY); return raw ? Object.assign({}, DEFAULT_CFG, JSON.parse(raw)) : Object.assign({}, DEFAULT_CFG); }
  catch (e) { return Object.assign({}, DEFAULT_CFG); }
}
export function saveConfig(cfg) {
  try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  emit();
}
export function isConfigured(cfg) { cfg = cfg || loadConfig(); return !!(cfg.enabled && cfg.owner && cfg.repo && cfg.token); }

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }

export let lastStatus = null;

function apiBase(cfg) { return 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo; }
function ghHeaders(cfg) { return { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + cfg.token, 'Content-Type': 'application/json' }; }
function b64encode(str) { return btoa(unescape(encodeURIComponent(str))); }
function b64decode(str) { return decodeURIComponent(escape(atob(String(str || '').replace(/\n/g, '')))); }

async function getFile(cfg, path, ref) {
  const res = await fetch(apiBase(cfg) + '/contents/' + path + '?ref=' + encodeURIComponent(ref || cfg.branch), { headers: ghHeaders(cfg) });
  if (res.status === 404) return { json: null, sha: null };
  if (!res.ok) throw new Error('GitHub GET ' + path + ' failed: HTTP ' + res.status);
  const body = await res.json();
  return { json: JSON.parse(b64decode(body.content)), sha: body.sha };
}

async function putFile(cfg, path, jsonObj, message, sha, branch) {
  const payload = { message, content: b64encode(JSON.stringify(jsonObj, null, 2)), branch: branch || cfg.branch };
  if (sha) payload.sha = sha;
  const res = await fetch(apiBase(cfg) + '/contents/' + path, { method: 'PUT', headers: ghHeaders(cfg), body: JSON.stringify(payload) });
  if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error('GitHub PUT ' + path + ' failed: HTTP ' + res.status + (t ? ' — ' + t.slice(0, 180) : '')); }
  return res.json();
}

async function getBranchSha(cfg, branch) {
  const res = await fetch(apiBase(cfg) + '/git/ref/heads/' + branch, { headers: ghHeaders(cfg) });
  if (!res.ok) throw new Error('GitHub branch lookup (' + branch + ') failed: HTTP ' + res.status);
  const body = await res.json();
  return body.object.sha;
}
async function createBranch(cfg, newBranch, fromSha) {
  const res = await fetch(apiBase(cfg) + '/git/refs', { method: 'POST', headers: ghHeaders(cfg), body: JSON.stringify({ ref: 'refs/heads/' + newBranch, sha: fromSha }) });
  if (!res.ok && res.status !== 422) throw new Error('GitHub branch create failed: HTTP ' + res.status); // 422 = ref exists already, fine
}
async function openPR(cfg, title, body, head, base) {
  const res = await fetch(apiBase(cfg) + '/pulls', { method: 'POST', headers: ghHeaders(cfg), body: JSON.stringify({ title, body, head, base: base || cfg.branch }) });
  if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error('GitHub PR failed: HTTP ' + res.status + (t ? ' — ' + t.slice(0, 180) : '')); }
  return res.json();
}

const HIGH_RISK = { create_arc: 1, delete_arc: 1 };

// Fire-and-forget, called from arc-ai.js's pushSync alongside the Supabase push.
// snapshot = { data, prose } — the caller's own already-mutated in-memory state,
// committed as-is. This never re-derives anything, only records what happened.
export function pushOp(op, snapshot, meta) {
  const cfg = loadConfig();
  if (!isConfigured(cfg)) return;
  pushOpAsync(op, snapshot, meta, cfg).then(() => { lastStatus = 'ok'; emit(); }).catch(e => { lastStatus = 'error: ' + (e && e.message || e); emit(); });
}

async function pushOpAsync(op, snapshot, meta, cfg) {
  const source = (meta && meta.source) || 'human';
  const label = op.op + (op.id ? (' ' + op.id) : '');
  if (HIGH_RISK[op.op]) {
    const branch = 'arc-op-' + op.op + '-' + (op.id || 'x') + '-' + Date.now().toString(36);
    const baseSha = await getBranchSha(cfg, cfg.branch);
    await createBranch(cfg, branch, baseSha);
    const { sha } = await getFile(cfg, cfg.dataPath, branch);
    await putFile(cfg, cfg.dataPath, snapshot.data, '[' + source + '] ' + label, sha, branch);
    await openPR(cfg, '[' + op.op + '] ' + (op.id || ''), 'Agent-originated op via arc-ai.js.\n\nSource: `' + source + '`\nOp: `' + JSON.stringify(op) + '`\n\nApprove by merging; reject by closing the PR.', branch, cfg.branch);
    return;
  }
  const { sha } = await getFile(cfg, cfg.dataPath, cfg.branch);
  await putFile(cfg, cfg.dataPath, snapshot.data, '[' + source + '] ' + label, sha, cfg.branch);
  if (op.op === 'edit_prose' && snapshot.prose) {
    const { sha: psha } = await getFile(cfg, cfg.prosePath, cfg.branch);
    await putFile(cfg, cfg.prosePath, snapshot.prose, '[' + source + '] ' + label + ' (prose)', psha, cfg.branch);
  }
}

export async function testConnection(cfg) {
  const c = Object.assign({}, loadConfig(), cfg || {});
  if (!c.owner || !c.repo || !c.token) throw new Error('Owner, repo, and token are all required.');
  const res = await fetch(apiBase(c), { headers: ghHeaders(c) });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' — check owner/repo/token and that the token has repo access.');
  const body = await res.json();
  return 'Connected — ' + body.full_name + ' (' + (body.private ? 'private' : 'public') + ', default branch ' + body.default_branch + ').';
}
