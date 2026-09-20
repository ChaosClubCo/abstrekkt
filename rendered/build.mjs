// Renders every ../*.md package file into a styled, print-ready, self-contained HTML file.
// Usage: npm install && node build.mjs
import { marked } from 'marked';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..');

marked.setOptions({ gfm: true, breaks: false });

const css = `
:root { --ink:#1a1a1a; --muted:#5b5b5b; --rule:#e2e2e2; --accent:#1f5fbf; --code-bg:#f5f6f8; }
* { box-sizing: border-box; }
body { font: 16px/1.6 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--ink); max-width: 820px; margin: 40px auto; padding: 0 24px; }
h1 { font-size: 1.9rem; line-height:1.2; border-bottom: 3px solid var(--accent); padding-bottom:.3em; margin-top:0; }
h2 { font-size: 1.35rem; margin-top: 2em; border-bottom: 1px solid var(--rule); padding-bottom:.25em; }
h3 { font-size: 1.1rem; margin-top: 1.6em; }
blockquote { color: var(--muted); border-left: 3px solid var(--rule); margin: 1em 0; padding: .2em 1em; }
table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: .92rem; }
th, td { border: 1px solid var(--rule); padding: 7px 10px; text-align: left; vertical-align: top; }
th { background: #f0f3f8; }
code { background: var(--code-bg); padding: .12em .35em; border-radius: 3px; font-size: .9em;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; }
pre { background: var(--code-bg); border: 1px solid var(--rule); border-radius: 6px;
  padding: 14px 16px; overflow-x: auto; }
pre code { background: none; padding: 0; }
a { color: var(--accent); }
hr { border: none; border-top: 1px solid var(--rule); margin: 2em 0; }
ul, ol { padding-left: 1.4em; }
.footer { margin-top: 3em; padding-top: 1em; border-top: 1px solid var(--rule);
  color: var(--muted); font-size: .82rem; }
@media print {
  body { margin: 0; max-width: none; font-size: 11.5pt; }
  h1, h2, h3 { page-break-after: avoid; }
  pre, table, blockquote { page-break-inside: avoid; }
  a { color: var(--ink); text-decoration: none; }
  th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

function page(title, bodyHtml) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><style>${css}</style></head>
<body>${bodyHtml}
<div class="footer">Rendered from ${title}.md &middot; Abstrekkt opportunity packages &middot; print this page to export PDF</div>
</body></html>`;
}

const mdFiles = readdirSync(src).filter(f => f.endsWith('.md')).sort();
const built = [];
for (const f of mdFiles) {
  const name = basename(f, '.md');
  const html = page(name, marked.parse(readFileSync(join(src, f), 'utf8')));
  writeFileSync(join(here, name + '.html'), html);
  built.push(name);
  console.log('rendered', name + '.html');
}

// index
const links = built.map(n => `<li><a href="${n}.html">${n}</a></li>`).join('\n');
const indexBody = `<h1>Abstrekkt Opportunity Packages — Rendered</h1>
<blockquote>Print-ready HTML. Open any file and use your browser's Print &rarr; Save as PDF.</blockquote>
<h2>Files</h2><ul>${links}</ul>`;
writeFileSync(join(here, 'index.html'), page('index', indexBody));
console.log('rendered index.html (' + built.length + ' files)');
