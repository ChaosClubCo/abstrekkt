// arc-export.js — shared "produce a deliverable" helpers for the Arc suite.
// Two non-mutating exits: a file you download (CSV) and a page you print/save-as-PDF
// (styled HTML in a new tab). Both operate on data the caller already computed —
// no fetching, no overlay writes. A third helper forwards a finished deliverable
// through arc-actions.js's existing dispatch/n8n pipeline, same event contract.

export function downloadCSV(rows, filename) {
  if (!rows || !rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [cols.join(',')].concat(rows.map(r => cols.map(c => esc(r[c])).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename || 'export.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function escHtml(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// Opens a standalone, print-ready document in a new tab. `bodyHtml` is trusted content
// the caller assembled (small inline-styled fragments) — wrapped in a shared paper shell.
// Printers want white paper + black ink, not void/violet, so this intentionally does not
// reuse the dark instrument-panel palette — it's the one surface meant to leave the screen.
export function openPrintable({ title, kicker, meta, bodyHtml }) {
  const win = window.open('', '_blank');
  if (!win) { alert('Pop-up blocked — allow pop-ups to export this document.'); return null; }
  const metaRows = (meta || []).map(m => `<div>${escHtml(m.k)} <strong>${escHtml(m.v)}</strong></div>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escHtml(title || 'Arc deliverable')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing:border-box; }
  body { margin:0; background:#e9e4d6; color:#1a1714; font-family:'JetBrains Mono',ui-monospace,monospace; font-size:13px; line-height:1.7; }
  .sheet { max-width:800px; margin:0 auto; padding:56px 60px 80px; background:#f5f1e8; min-height:100vh; }
  .head { display:grid; grid-template-columns:1fr auto; gap:20px; align-items:end; padding-bottom:22px; border-bottom:1.5px solid #1a1714; margin-bottom:26px; }
  .kicker { font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:#8a847a; margin-bottom:10px; }
  h1 { font-family:'Instrument Serif',serif; font-style:italic; font-weight:400; font-size:34px; margin:0; line-height:1.05; }
  .meta { text-align:right; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#57514a; line-height:1.8; white-space:nowrap; }
  .meta strong { color:#1a1714; }
  .toolbar { position:fixed; top:16px; right:16px; z-index:10; }
  .toolbar button { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase; padding:9px 16px; background:#1a1714; color:#f5f1e8; border:none; cursor:pointer; }
  .toolbar button:hover { background:#332c22; }
  @media print { .toolbar { display:none; } body { background:#fff; } .sheet { background:#fff; } }
</style></head><body>
<div class="toolbar"><button onclick="window.print()">Save as PDF</button></div>
<div class="sheet">
  <div class="head"><div><div class="kicker">${escHtml(kicker || 'Learning Ops')}</div><h1>${escHtml(title || '')}</h1></div><div class="meta">${metaRows}</div></div>
  ${bodyHtml || ''}
</div>
</body></html>`;
  win.document.open(); win.document.write(html); win.document.close();
  return win;
}

// Forwards a finished deliverable through the existing outbound pipeline (arc-actions.js),
// so "export" can optionally become "send" without a second transport to build.
export async function sendDeliverable(eventType, data, meta) {
  const actions = await import('./arc-actions.js');
  return actions.dispatch(eventType, data, meta);
}
