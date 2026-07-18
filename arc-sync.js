// arc-sync.js — optional durable-store bridge (Supabase) for the Arc suite.
// PERSISTENCE_PLAN.md phase 1: closes "localStorage is the only copy" — not
// "only one tab sees an edit" (that's still eventual, on next poll). Every
// export here no-ops safely until a project URL + anon key are saved via
// Finish the Sync - Claude Handoff.dc.html. Plain fetch against PostgREST
// (Supabase's REST layer) — no SDK, matching the rest of the suite.
//
// Write path: arc-ai.js's applyOp fire-and-forget pushes every op's resulting
// snapshot to overlay_log. Read path: pullOverlay() folds the remote log into
// the same {edits,created,deleted} shape arc-ai.js's mergeOverlay expects —
// callers merge it on top of already-loaded state; this never touches the
// local overlay in localStorage. Last-write-wins, no CRDT — see
// PERSISTENCE_PLAN.md's Status section for that tradeoff spelled out.
//
// Storage: arc-sync-config-v1 — { enabled, url, anonKey, pollMs }

const CFG_KEY = 'arc-sync-config-v1';
const DEFAULT_CFG = { enabled: false, url: '', anonKey: '', pollMs: 20000 };

export function loadSyncConfig() {
  try { const raw = localStorage.getItem(CFG_KEY); return raw ? Object.assign({}, DEFAULT_CFG, JSON.parse(raw)) : Object.assign({}, DEFAULT_CFG); }
  catch (e) { return Object.assign({}, DEFAULT_CFG); }
}
export function saveSyncConfig(cfg) {
  try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  emit();
}
export function isConfigured(cfg) { cfg = cfg || loadSyncConfig(); return !!(cfg.enabled && cfg.url && cfg.anonKey); }

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => { try { fn(); } catch (e) {} }); }

function authHeaders(cfg) { return { 'Content-Type': 'application/json', 'apikey': cfg.anonKey, 'Authorization': 'Bearer ' + cfg.anonKey }; }
function base(cfg) { return (cfg.url || '').replace(/\/$/, ''); }
function uid() { return 'row_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8); }

export let lastStatus = null;

async function pushOpAsync(rec, source) {
  const cfg = loadSyncConfig();
  if (!isConfigured(cfg)) throw new Error('Sync not configured.');
  const row = { id: uid(), arc_id: rec.id, kind: rec.kind, snapshot: rec.snapshot != null ? rec.snapshot : null, source: source || 'human', occurred_at: new Date().toISOString() };
  const res = await fetch(base(cfg) + '/rest/v1/overlay_log', { method: 'POST', headers: Object.assign({ Prefer: 'return=minimal' }, authHeaders(cfg)), body: JSON.stringify(row) });
  if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error('HTTP ' + res.status + (t ? ' — ' + t.slice(0, 180) : '')); }
}

// Fire-and-forget — never throws into the caller, never blocks a UI action.
export function pushOp(rec, source) {
  const cfg = loadSyncConfig();
  if (!isConfigured(cfg)) return;
  pushOpAsync(rec, source)
    .then(() => { lastStatus = 'ok'; emit(); })
    .catch(e => { lastStatus = 'error: ' + (e && e.message || e); emit(); });
}

// Read path — folds the remote log into arc-ai.js's overlay shape.
export async function pullOverlay() {
  const cfg = loadSyncConfig();
  if (!isConfigured(cfg)) return null;
  const url = base(cfg) + '/rest/v1/overlay_log?select=*&order=occurred_at.asc';
  const res = await fetch(url, { headers: authHeaders(cfg) });
  if (!res.ok) throw new Error('Supabase pull failed: HTTP ' + res.status);
  const rows = await res.json();
  const overlay = { edits: {}, created: {}, deleted: [] };
  rows.forEach(r => {
    if (r.kind === 'delete') {
      if (overlay.deleted.indexOf(r.arc_id) < 0) overlay.deleted.push(r.arc_id);
      delete overlay.created[r.arc_id]; delete overlay.edits[r.arc_id];
    } else if (r.kind === 'prose') {
      overlay.edits['prose:' + r.arc_id] = r.snapshot;
    } else if (r.kind === 'arc') {
      overlay.created[r.arc_id] = r.snapshot;
      overlay.deleted = overlay.deleted.filter(id => id !== r.arc_id);
    }
  });
  return overlay;
}

let pollTimer = null, lastHash = '';
export function startPolling(onChange, ms) {
  stopPolling();
  const cfg = loadSyncConfig();
  if (!isConfigured(cfg)) return;
  const tick = async () => {
    try {
      const overlay = await pullOverlay();
      if (!overlay) return;
      const hash = JSON.stringify(overlay);
      if (hash !== lastHash) { lastHash = hash; onChange(overlay); }
      lastStatus = 'ok'; emit();
    } catch (e) { lastStatus = 'pull error: ' + (e && e.message || e); emit(); }
  };
  tick();
  pollTimer = setInterval(tick, ms || cfg.pollMs || 20000);
}
export function stopPolling() { if (pollTimer) clearInterval(pollTimer); pollTimer = null; }

export async function testConnection(cfg) {
  const c = Object.assign({}, loadSyncConfig(), cfg || {});
  if (!c.url || !c.anonKey) throw new Error('URL and anon key are both required.');
  const res = await fetch(base(c) + '/rest/v1/overlay_log?select=id&limit=1', { headers: authHeaders(c) });
  if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error('HTTP ' + res.status + (t ? ' — ' + t.slice(0, 180) : '')); }
  return 'Connected — overlay_log is reachable.';
}

// One-time bootstrap: push everything already in the local overlay so turning
// sync on doesn't start from zero. Awaited (unlike pushOp) so the caller can
// show a real count/result.
export async function pushLocalOverlayNow(overlay) {
  const cfg = loadSyncConfig();
  if (!isConfigured(cfg)) throw new Error('Configure and save the URL + key first.');
  const jobs = [];
  Object.entries(overlay.created || {}).forEach(([id, snap]) => jobs.push(pushOpAsync({ id, kind: 'arc', snapshot: snap }, 'bootstrap')));
  Object.entries(overlay.edits || {}).forEach(([k, v]) => {
    if (k.indexOf('prose:') === 0) jobs.push(pushOpAsync({ id: k.slice(6), kind: 'prose', snapshot: v }, 'bootstrap'));
    else jobs.push(pushOpAsync({ id: k, kind: 'arc', snapshot: v }, 'bootstrap'));
  });
  (overlay.deleted || []).forEach(id => jobs.push(pushOpAsync({ id, kind: 'delete' }, 'bootstrap')));
  await Promise.all(jobs);
  return jobs.length;
}
