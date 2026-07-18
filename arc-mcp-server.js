// arc-mcp-server.js — Arc MCP server (Supabase Edge Function, reference source).
// Not auto-deployed: `supabase functions deploy arc-mcp` ships this. Built with
// mcp-lite (per PERSISTENCE_PLAN.md §2 / AGENTIC_ACCESS_PLAN.md block 1) — the
// same small framework runs unchanged on Cloudflare Workers if you'd rather
// host it there. API shown matches mcp-lite's documented shape as of this
// writing; check the package's own README at deploy time if it has since moved.
//
// Tools mirror arc-ai.js's ops contract 1:1 — no schema invented here that
// doesn't already exist client-side. The one behavior difference from the
// browser assistant: apply_arc_op refuses create_arc/delete_arc unless the
// caller passes approved:true, mirroring Arc Agents' own pending-approval
// queue — this is the server-side half of AGENTIC_ACCESS_PLAN.md guardrail §5.
//
// Env (set via `supabase secrets set`): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Uses the service role key (server-side only, never shipped to a browser) so
// RLS is bypassed here deliberately — this function IS the trust boundary.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { createMcpServer } from 'npm:mcp-lite';

const sb = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

const server = createMcpServer({ name: 'arc-mcp', version: '1.0.0' });

server.tool('list_arcs', {
  description: 'List every arc id, display name, series, and lane.',
  inputSchema: { type: 'object', properties: {} },
  handler: async () => {
    const { data, error } = await sb.from('arcs').select('id, em, series, lane, sub');
    if (error) throw new Error(error.message);
    return { content: [{ type: 'text', text: JSON.stringify(data) }] };
  },
});

server.tool('get_arc', {
  description: 'Get one arc\u2019s full record (quarters/months/weeks) plus its prose if any.',
  inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
  handler: async ({ id }) => {
    const [{ data: arc, error: e1 }, { data: prose }] = await Promise.all([
      sb.from('arcs').select('*').eq('id', id).maybeSingle(),
      sb.from('prose').select('*').eq('id', id).maybeSingle(),
    ]);
    if (e1) throw new Error(e1.message);
    if (!arc) return { content: [{ type: 'text', text: 'No arc: ' + id }], isError: true };
    return { content: [{ type: 'text', text: JSON.stringify({ ...arc, prose: prose || null }) }] };
  },
});

// Same op shapes as arc-ai.js's OPS_DOC (edit_meta/edit_gate/edit_week/edit_quarter/
// edit_prose/rename_arc/create_arc/delete_arc). create_arc/delete_arc need approved:true.
server.tool('apply_arc_op', {
  description: 'Apply one arc-ai.js-shaped op. create_arc and delete_arc require approved:true or they return needs_approval instead of applying.',
  inputSchema: { type: 'object', properties: { op: { type: 'object' }, approved: { type: 'boolean' }, source: { type: 'string' } }, required: ['op'] },
  handler: async ({ op, approved, source }) => {
    if ((op.op === 'create_arc' || op.op === 'delete_arc') && !approved) {
      return { content: [{ type: 'text', text: JSON.stringify({ status: 'needs_approval', op }) }] };
    }
    const row = { id: 'row_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8), arc_id: op.id, source: 'agent:mcp' + (source ? ':' + source : ''), occurred_at: new Date().toISOString() };
    if (op.op === 'delete_arc') {
      await sb.from('overlay_log').insert({ ...row, kind: 'delete', snapshot: null });
      await sb.from('arcs').delete().eq('id', op.id);
      return { content: [{ type: 'text', text: 'deleted ' + op.id }] };
    }
    if (op.op === 'edit_prose') {
      const { data: cur } = await sb.from('prose').select('*').eq('id', op.id).maybeSingle();
      const next = { ...(cur || { id: op.id }), ...(op.fields || {}) };
      await sb.from('prose').upsert(next);
      await sb.from('overlay_log').insert({ ...row, kind: 'prose', snapshot: next });
      return { content: [{ type: 'text', text: 'prose \u2192 ' + op.id }] };
    }
    // edit_meta/edit_gate/edit_week/edit_quarter/rename_arc/create_arc all resolve
    // to "the arc's new full row" — read-modify-write against the arcs table.
    const { data: cur } = await sb.from('arcs').select('*').eq('id', op.id).maybeSingle();
    if (!cur && op.op !== 'create_arc') return { content: [{ type: 'text', text: 'skip: no arc ' + op.id }], isError: true };
    const next = applyToRow(cur, op);
    await sb.from('arcs').upsert(next);
    await sb.from('overlay_log').insert({ ...row, kind: 'arc', snapshot: next });
    return { content: [{ type: 'text', text: op.op + ' \u2192 ' + op.id }] };
  },
});

server.tool('get_momentum', {
  description: 'Rough momentum rollup: arc count and which arcs currently have zero recorded quarters/months set.',
  inputSchema: { type: 'object', properties: {} },
  handler: async () => {
    const { data, error } = await sb.from('arcs').select('id, em, quarters');
    if (error) throw new Error(error.message);
    const stalled = (data || []).filter(a => !a.quarters || !a.quarters.length).map(a => a.em);
    return { content: [{ type: 'text', text: JSON.stringify({ total: (data || []).length, stalled }) }] };
  },
});

server.tool('generate_deliverable', {
  description: 'Non-mutating: returns the data a caller needs to render a deliverable (brief/standup/csv/summary) — this function does not call a model itself, callers bring their own.',
  inputSchema: { type: 'object', properties: { kind: { type: 'string' }, arcIds: { type: 'array', items: { type: 'string' } } }, required: ['kind'] },
  handler: async ({ kind, arcIds }) => {
    let q = sb.from('arcs').select('id, em, series, quarters');
    if (arcIds && arcIds.length) q = q.in('id', arcIds);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return { content: [{ type: 'text', text: JSON.stringify({ kind, arcs: data }) }] };
  },
});

function applyToRow(row, op) {
  const base = row ? { ...row } : { id: op.id, em: op.em || op.id, series: op.series || 1, lane: op.lane || null, meta: [], quarters: [] };
  if (op.op === 'edit_meta') Object.assign(base, op.fields || {});
  if (op.op === 'rename_arc') base.em = op.em || base.em;
  if (op.op === 'edit_gate' || op.op === 'edit_week' || op.op === 'edit_quarter') {
    base.quarters = (base.quarters || []).map(q => ({ ...q, months: (q.months || []).map(m => {
      if (m.n !== op.month && !(op.op === 'edit_quarter')) return m;
      if (op.op === 'edit_gate' && m.n === op.month) return { ...m, gate: op.gate };
      if (op.op === 'edit_week' && m.n === op.month) { const weeks = [...(m.weeks || ['—','—','—','—'])]; weeks[op.week - 1] = op.text; return { ...m, weeks }; }
      return m;
    }) }));
    if (op.op === 'edit_quarter') { const idx = (op.quarter || 1) - 1; if (base.quarters[idx]) Object.assign(base.quarters[idx], op.fields || {}); }
  }
  if (op.op === 'create_arc') Object.assign(base, { em: op.em, accent: op.accent, series: op.series, lane: op.lane, kicker: op.kicker, sub: op.sub, meta: op.meta, quarters: op.quarters });
  return base;
}

Deno.serve((req) => server.fetch(req));
