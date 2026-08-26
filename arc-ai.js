// arc-ai.js — multi-provider AI architecture for the Arc system.
// Three adapters behind one interface: Anthropic (built-in window.claude.complete,
// no key), OpenAI and Gemini (user-supplied key, direct browser fetch).
// The model is steered to return a strict JSON envelope: { reply, operations[] }.
// Operations mutate the arc store (create / edit / delete / generate).

export const PROVIDERS = {
  anthropic: {
    id: 'anthropic', label: 'Anthropic', model: 'claude-haiku-4-5',
    needsKey: false, accent: '#e07856',
    note: 'Built in — no key needed. Runs on the viewer’s quota, 1024-token replies.',
  },
  openai: {
    id: 'openai', label: 'OpenAI', model: 'gpt-4o-mini',
    needsKey: true, accent: '#10a37f', keyHint: 'sk-…',
    note: 'Paste an OpenAI API key. Calls api.openai.com directly from your browser.',
  },
  gemini: {
    id: 'gemini', label: 'Gemini', model: 'gemini-2.0-flash',
    needsKey: true, accent: '#4285f4', keyHint: 'AIza…',
    note: 'Paste a Google AI Studio key. Calls generativelanguage.googleapis.com directly.',
  },
};

const KEY_LS = 'arc-ai-keys-v1';
export function loadKeys() { try { return JSON.parse(localStorage.getItem(KEY_LS)) || {}; } catch (e) { return {}; } }
export function saveKey(provider, key) {
  const k = loadKeys(); if (key) k[provider] = key; else delete k[provider];
  try { localStorage.setItem(KEY_LS, JSON.stringify(k)); } catch (e) {}
}

// ---- The operations contract the model must follow ----
export const OPS_DOC = `
You edit a library of "learning arcs". Each arc has:
  id (slug), em (short display name), accent (hex color), kicker, sub (one-line desc),
  series (1|2|3), lane ("A"|"B"|null),
  meta: [{label, value}] (max 4),
  quarters: [ { q:"Q1", phase, subtitle, months:[ { n:1-12, title, why, weeks:[4 strings], gate } ] } ],
  prose: { headline, intro, gain:[strings], giveUp:[strings], giveLabel, note, claims:[{lead, body}] }

Return STRICT JSON ONLY, no markdown fences, shape:
{ "reply": "one or two sentences to the user", "operations": [ ...ops ] }

Each op is one of:
  { "op":"edit_meta", "id":"<arc>", "fields":{ "em"?, "sub"?, "accent"?(hex), "kicker"? } }
  { "op":"edit_gate", "id":"<arc>", "month":1-12, "gate":"<text>" }
  { "op":"edit_week", "id":"<arc>", "month":1-12, "week":1-4, "text":"<text>" }
  { "op":"edit_quarter", "id":"<arc>", "quarter":1-4, "fields":{ "phase"?, "subtitle"? } }
  { "op":"edit_prose", "id":"<arc>", "fields":{ "headline"?, "intro"?, "gain"?:[..], "giveUp"?:[..], "giveLabel"?, "note"?, "claims"?:[{lead,body}] } }
  { "op":"create_arc", "id":"<new-slug>", "em":"<name>", "accent":"<hex>", "series":1, "lane":null, "kicker":"<text>", "sub":"<text>",
      "meta":[{label,value}], "quarters":[ up to 4, each with phase/subtitle and months ], "prose":{...} }
  { "op":"delete_arc", "id":"<arc>" }
  { "op":"rename_arc", "id":"<arc>", "em":"<new name>" }

Rules:
- Only emit operations the user actually asked for. If they only ask a question, return operations: [].
- Prefer the smallest set of ops. Editing one gate is one edit_gate, not a whole create_arc.
- For create_arc you may provide fewer than 12 months; missing months are auto-filled as placeholders.
- accent must be a hex like "#8b5cf6". Keep em short (1-2 words).
- Never invent ids for edits — use ids from the provided arc list. For create_arc, make a new kebab-case id.
`;

function buildSystem(contextSummary) {
  return `You are the Arc Assistant, an editor for a personal learning-arc planning system.
${OPS_DOC}

Current arc library (id — name — series):
${contextSummary}

When the user references an arc by name, map it to its id. Be decisive and concise.`;
}

function extractJSON(text) {
  if (!text) return null;
  let t = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  // find first { … last }
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch (e) { return { reply: text.slice(0, 400), operations: [] }; }
}

// ---- Adapters ----
async function callAnthropic(system, userMsg) {
  if (!window.claude || !window.claude.complete) throw new Error('Anthropic helper unavailable in this context.');
  const prompt = `${system}\n\n----\nUser request: ${userMsg}\n\nReturn the JSON envelope now.`;
  const text = await window.claude.complete({ messages: [{ role: 'user', content: prompt }] });
  return text;
}

async function callOpenAI(system, userMsg, key, model, opts) {
  opts = opts || {};
  const body = {
    model: model || 'gpt-4o-mini', temperature: 0.4,
    messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }],
  };
  if (opts.json !== false) body.response_format = { type: 'json_object' };
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const e = await res.text(); throw new Error('OpenAI ' + res.status + ': ' + e.slice(0, 200)); }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini(system, userMsg, key, model, opts) {
  opts = opts || {};
  const m = model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`;
  const generationConfig = { temperature: 0.4 };
  if (opts.json !== false) generationConfig.responseMimeType = 'application/json';
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: userMsg }] }],
      generationConfig,
    }),
  });
  if (!res.ok) { const e = await res.text(); throw new Error('Gemini ' + res.status + ': ' + e.slice(0, 200)); }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
}

// ---- Public entry ----
export async function runAssistant({ provider, userMsg, contextSummary }) {
  const sys = buildSystem(contextSummary);
  const keys = loadKeys();
  let raw;
  if (provider === 'anthropic') raw = await callAnthropic(sys, userMsg);
  else if (provider === 'openai') {
    if (!keys.openai) throw new Error('Add an OpenAI API key first.');
    raw = await callOpenAI(sys, userMsg, keys.openai, PROVIDERS.openai.model);
  } else if (provider === 'gemini') {
    if (!keys.gemini) throw new Error('Add a Gemini API key first.');
    raw = await callGemini(sys, userMsg, keys.gemini, PROVIDERS.gemini.model);
  } else throw new Error('Unknown provider: ' + provider);

  const parsed = extractJSON(raw);
  return {
    reply: parsed.reply || '(no reply)',
    operations: Array.isArray(parsed.operations) ? parsed.operations : [],
  };
}

// ---- Plain-text generation: same three adapters, free text back, never touches
// the arc store. For on-demand deliverables (briefings, reports, ad-hoc docs) that
// shouldn't be parsed as ops JSON. ----
export async function completeText({ provider, system, userMsg }) {
  const keys = loadKeys();
  if (provider === 'openai') {
    if (!keys.openai) throw new Error('Add an OpenAI API key first.');
    const text = await callOpenAI(system || '', userMsg, keys.openai, PROVIDERS.openai.model, { json: false });
    return (text || '').trim();
  }
  if (provider === 'gemini') {
    if (!keys.gemini) throw new Error('Add a Gemini API key first.');
    const text = await callGemini(system || '', userMsg, keys.gemini, PROVIDERS.gemini.model, { json: false });
    return (text || '').trim();
  }
  if (!window.claude || !window.claude.complete) throw new Error('Anthropic helper unavailable in this context.');
  const prompt = system ? `${system}\n\n----\n${userMsg}` : userMsg;
  const text = await window.claude.complete({ messages: [{ role: 'user', content: prompt }] });
  return (text || '').trim();
}

// ---- Store: merge base data + localStorage overlay; apply ops ----
const OVERLAY_LS = 'arc-store-overlay-v1';
export function loadOverlay() { try { return JSON.parse(localStorage.getItem(OVERLAY_LS)) || { edits: {}, created: {}, deleted: [] }; } catch (e) { return { edits: {}, created: {}, deleted: [] }; } }
export function saveOverlay(o) { try { localStorage.setItem(OVERLAY_LS, JSON.stringify(o)); } catch (e) {} }
export function resetOverlay() { try { localStorage.removeItem(OVERLAY_LS); } catch (e) {} }

function blankMonths() {
  const out = [];
  for (let n = 1; n <= 12; n++) out.push({ n, title: '—', why: '', weeks: ['—', '—', '—', '—'], gate: '—' });
  return out;
}
// Normalize a created arc's quarters into the reader's shape, filling gaps.
function normalizeCreated(arc) {
  const months = blankMonths();
  (arc.quarters || []).forEach((q, qi) => {
    (q.months || []).forEach((m) => {
      const n = m.n || 0; if (n >= 1 && n <= 12) {
        months[n - 1] = {
          n, title: m.title || '—', why: m.why || '',
          weeks: (m.weeks && m.weeks.length ? m.weeks : ['—', '—', '—', '—']).slice(0, 4),
          gate: m.gate || '—',
        };
      }
    });
  });
  const phases = (arc.quarters || []).map((q, i) => ({ phase: q.phase || ('Quarter ' + (i + 1)), subtitle: q.subtitle || '' }));
  while (phases.length < 4) phases.push({ phase: 'Quarter ' + (phases.length + 1), subtitle: '' });
  const quarters = [0, 1, 2, 3].map((qi) => ({
    q: 'Q' + (qi + 1), phase: phases[qi].phase, subtitle: phases[qi].subtitle,
    months: months.slice(qi * 3, qi * 3 + 3),
  }));
  return {
    id: arc.id, em: arc.em || arc.id, accent: arc.accent || '#8b5cf6',
    kicker: arc.kicker || 'Learning Ops', sub: arc.sub || '',
    meta: (arc.meta || []).slice(0, 4), quarters,
    series: arc.series || 1, lane: arc.lane || null,
    prose: arc.prose || null, _created: true,
  };
}

// Apply a single op to mutable {data, prose, names, overlay}. Returns a short label.
// meta.source (default 'human') tags the fire-and-forget push to arc-sync.js.
export function applyOp(op, store, meta) {
  const label = applyOpCore(op, store);
  try { pushSync(op, store, meta); } catch (e) {}
  return label;
}

function pushSync(op, store, meta) {
  import('./arc-sync.js').then(function (sync) {
    const source = (meta && meta.source) || 'human';
    if (op.op === 'delete_arc') { sync.pushOp({ id: op.id, kind: 'delete' }, source); return; }
    if (op.op === 'edit_prose') { sync.pushOp({ id: op.id, kind: 'prose', snapshot: store.prose[op.id] }, source); return; }
    if (store.data[op.id]) sync.pushOp({ id: op.id, kind: 'arc', snapshot: store.data[op.id] }, source);
  }).catch(function () {});
  import('./arc-github.js').then(function (gh) { gh.pushOp(op, { data: store.data, prose: store.prose }, meta); }).catch(function () {});
  import('./arc-obsidian.js').then(function (ob) { ob.pushOp(op, store, meta); }).catch(function () {});
}

function applyOpCore(op, store) {
  const { data, prose, overlay } = store;
  const id = op.id;
  switch (op.op) {
    case 'edit_meta': {
      const a = data[id]; if (!a) return `skip: no arc ${id}`;
      const f = op.fields || {};
      if (f.em != null) a.em = f.em;
      if (f.sub != null) a.sub = f.sub;
      if (f.accent != null) a.accent = f.accent;
      if (f.kicker != null) a.kicker = f.kicker;
      if (store.names[id]) store.names[id][0] = a.em;
      overlay.edits[id] = data[id];
      return `meta → ${id}`;
    }
    case 'rename_arc': {
      const a = data[id]; if (!a) return `skip: no arc ${id}`;
      a.em = op.em || a.em; if (store.names[id]) store.names[id][0] = a.em; overlay.edits[id] = a; return `renamed ${id} → ${a.em}`;
    }
    case 'edit_gate': {
      const a = data[id]; if (!a) return `skip: no arc ${id}`;
      for (const q of a.quarters) for (const m of q.months) if (m.n === op.month) { m.gate = op.gate; }
      overlay.edits[id] = a; return `gate M${op.month} → ${id}`;
    }
    case 'edit_week': {
      const a = data[id]; if (!a) return `skip: no arc ${id}`;
      for (const q of a.quarters) for (const m of q.months) if (m.n === op.month) {
        while (m.weeks.length < op.week) m.weeks.push('—');
        m.weeks[op.week - 1] = op.text;
      }
      overlay.edits[id] = a; return `week M${op.month}·W${op.week} → ${id}`;
    }
    case 'edit_quarter': {
      const a = data[id]; if (!a) return `skip: no arc ${id}`;
      const q = a.quarters[(op.quarter || 1) - 1]; if (q) { const f = op.fields || {}; if (f.phase != null) q.phase = f.phase; if (f.subtitle != null) q.subtitle = f.subtitle; }
      overlay.edits[id] = a; return `quarter Q${op.quarter} → ${id}`;
    }
    case 'edit_prose': {
      const f = op.fields || {};
      const cur = (prose[id] && JSON.parse(JSON.stringify(prose[id]))) || { headline: '', intro: '', gain: [], giveUp: [], giveLabel: 'What you give up', note: '', claims: [] };
      ['headline', 'intro', 'gain', 'giveUp', 'giveLabel', 'note', 'claims'].forEach(k => { if (f[k] != null) cur[k] = f[k]; });
      prose[id] = cur; overlay.edits['prose:' + id] = cur;
      return `prose → ${id}`;
    }
    case 'create_arc': {
      const norm = normalizeCreated(op);
      data[id] = norm;
      if (norm.prose) prose[id] = norm.prose;
      overlay.created[id] = norm;
      store.names[id] = [norm.em, norm.series, norm.lane];
      return `created ${id}`;
    }
    case 'delete_arc': {
      delete data[id]; delete prose[id]; delete store.names[id];
      delete overlay.edits[id]; delete overlay.created[id];
      if (!overlay.deleted.includes(id)) overlay.deleted.push(id);
      return `deleted ${id}`;
    }
    default: return `unknown op ${op.op}`;
  }
}

// Rehydrate base data with a saved overlay (called on load).
export function mergeOverlay(data, prose, names, overlay) {
  (overlay.deleted || []).forEach(id => { delete data[id]; delete prose[id]; delete names[id]; });
  Object.entries(overlay.created || {}).forEach(([id, arc]) => { data[id] = arc; if (arc.prose) prose[id] = arc.prose; names[id] = [arc.em, arc.series, arc.lane]; });
  Object.entries(overlay.edits || {}).forEach(([k, v]) => {
    if (k.indexOf('prose:') === 0) prose[k.slice(6)] = v;
    else if (data[k]) { data[k] = v; names[k] = [v.em, v.series || (names[k] && names[k][1]) || 1, v.lane || (names[k] && names[k][2]) || null]; }
  });
}
