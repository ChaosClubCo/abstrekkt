import { useState, useCallback, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PH = { IDLE: 0, CTX: 1, SUG: 2, SRCH: 3, GEN: 4, AUD: 5, ITER: 6, FIX: 7, FIXALL: 8, PREVIEW: 9 };

const SLOP_FONTS = ["Inter", "Roboto", "Poppins", "Open Sans", "system-ui", "Arial", "Helvetica"];
const SLOP_ICONS = ["Heroicons", "heroicons", "lucide-react", "Lucide"];

const PIPES = {
  generate: [
    { key: "ctx",  label: "Analyzing brief",     icon: "◎" },
    { key: "gen",  label: "Generating component", icon: "⚡" },
  ],
  suggest:  [{ key: "sug",   label: "Generating ideas",    icon: "✦" }],
  search:   [{ key: "srch",  label: "Searching references", icon: "◉" }],
  audit:    [{ key: "aud",   label: "Running audit",        icon: "△" }],
  iterate:  [{ key: "iter",  label: "Refining component",   icon: "↻" }],
  ctx:      [{ key: "ctx",   label: "Analyzing brief",      icon: "◎" }],
  fix:      [{ key: "fix",   label: "Applying fix",         icon: "⚡" }],
  fixall:   [
    { key: "batch", label: "Batching fixes",      icon: "◎" },
    { key: "apply", label: "Rewriting component", icon: "⚡" },
  ],
  preview:  [{ key: "html",  label: "Converting to HTML",   icon: "◈" }],
};

const TEMPLATES = [
  { id: "hero-dark",     name: "Dark hero + gradient mesh",    cat: "Landing",      brief: "Full-viewport dark hero with animated gradient mesh via CSS conic-gradient layers. 72px Bricolage Grotesque heading, tight tracking. Fraunces italic subheading. Two CTAs: primary solid with hover scale, ghost with border animation. Floating pulse badge. Nav: logo left, 4 links center, CTA right." },
  { id: "pricing",       name: "Editorial pricing table",      cat: "SaaS",         brief: "Three-tier pricing with editorial aesthetic. Playfair Display headings, Lora body. Middle card overlaps, 20% taller. Monthly/annual toggle with animated pill. Each card: tier name, animated price counter, 6 features with custom checkmark SVGs, CTA. Paper texture background. Recommended badge on middle." },
  { id: "dashboard",     name: "Analytics dashboard",          cat: "Dashboard",    brief: "Dense analytics panel, Space Grotesk type. Top row: 4 metric cards with sparkline SVGs and percentage badges (green up, red down). Main: large area chart with gradient fill. Right sidebar: ranked list of top 5 with horizontal bar indicators. Dark sidebar nav with active glow. All hover states designed." },
  { id: "auth",          name: "Split-screen auth",            cat: "Auth",         brief: "Split login page. Left: abstract geometric art via CSS shapes — overlapping circles/rectangles in terracotta, sand, moss. Right: centered form with Geist type. Floating label inputs that animate on focus. Gradient-shift sign-in button. Social login row with custom SVGs. Error shake animation." },
  { id: "bento",         name: "Bento feature grid",           cat: "Marketing",    brief: "Asymmetrical bento grid — 6 cards in varying sizes (2 large, 2 medium, 2 small). Each card has unique background (gradient, pattern, solid, overlay, purposeful glass, texture). Cal Sans headings. Phosphor duotone icons. Hover lift with shadow depth. Intentional gaps: some 4px, some 12px for rhythm." },
  { id: "testimonials",  name: "Testimonial wall",             cat: "Social proof", brief: "Masonry testimonial wall. Vollkorn quotes, Merriweather attribution. Variable-height cards. Left border accent per card from warm palette. Initial avatars. Custom SVG star ratings. Light warm gray background with dot grid pattern. One featured quote spans 2 columns, larger text." },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API LAYER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function callClaude(apiKey, system, prompt, maxTokens = 1024, tools = null) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  };
  if (tools) body.tools = tools;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error?.message || `API error ${r.status}`);
  return (await r.json()).content.find((b) => b.type === "text")?.text?.trim() || "";
}

function safeParseJSON(raw) {
  if (!raw) return null;
  const s = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  // 1. Direct parse
  try { return JSON.parse(s); } catch {}
  // 2. Extract first {...} or [...] block
  const block = (s.match(/\{[\s\S]*\}/) || s.match(/\[[\s\S]*\]/))?.[0];
  if (!block) return null;
  try { return JSON.parse(block); } catch {}
  // 3. Repair truncated JSON — strip incomplete trailing entries then balance brackets
  let fixed = block
    .replace(/,?\s*"[^"]*"\s*:\s*"[^"]*$/, "")   // trailing open string value
    .replace(/,?\s*"[^"]*"\s*:\s*[^,}\]"]*$/, "") // trailing unquoted value
    .replace(/,?\s*\{[^}]*$/, "");                // trailing unclosed object
  const addClose = "]".repeat(Math.max(0, (fixed.match(/\[/g)||[]).length - (fixed.match(/\]/g)||[]).length))
                 + "}".repeat(Math.max(0, (fixed.match(/\{/g)||[]).length - (fixed.match(/\}/g)||[]).length));
  try { return JSON.parse(fixed + addClose); } catch {}
  return null;
}

function stripCode(raw) {
  return raw.replace(/^```(?:jsx|tsx|js|javascript|typescript|html)?\s*/m, "").replace(/\n?```\s*$/m, "").trim();
}

const TOP5_SYSTEM = `React + Tailwind component generator.
QUALITY: TOP 5%. Awwwards-tier. Bold, distinctive, ambitious.
TYPOGRAPHY: Cal Sans, Bricolage Grotesque, Playfair Display, Space Grotesk, Geist, Vollkorn, Fraunces, Lora. NEVER Inter/Roboto/Poppins/Arial/system-ui.
ICONS: Phosphor, Hugeicons, Font Awesome. NEVER Heroicons/lucide-react.
LAYOUT: Asymmetrical, strategic whitespace, hierarchy via type+space+color.
COLOR: Intentional palette, explicit hex, WCAG AAA. Never purple-to-blue gradient.
MOTION: 250-400ms ease-out, purposeful only. Staggered reveals on load.
DEPTH: Layered backgrounds, subtle grain or texture. Never flat solid.
STATES: hover, focus, active, loading, error, empty, disabled — all designed.
FORBIDDEN: Inter, Roboto, Poppins, Arial. Purple-blue gradients. Heroicons/Lucide. Glassmorphism as decoration. Cards nested 3+. Vague headlines. Buzzwords. TODOs. Comments. Markdown fences.
Return ONLY the component code.`;

const PRO_SYSTEM = `React + Tailwind component generator.
QUALITY: Professional. Clean, solid, production-ready, accessible.
FORBIDDEN: TODOs. Markdown fences. Comments.
Return ONLY the component code.`;

const AUDIT_SYSTEM = `Design auditor. Return ONLY minified JSON. No prose, no fences, no newlines inside string values, no code snippets in detail fields.
Schema: {"score":0-100,"grade":"A+|A|B|C|D|F","findings":[{"rule":"string","status":"pass|fail|warn","detail":"max 80 chars, plain English only"}],"tokens":{"fonts":["name"],"colors":["#hex"],"icons":"library or none"},"suggestions":["max 60 chars each"]}
Always output exactly 10 findings for these rules:
1 Typography: no Inter/Roboto/Poppins/Arial/system-ui
2 Icons: no Heroicons/lucide-react
3 Color: no purple-to-blue gradient, uses explicit hex
4 Layout: not centered-everything, uses whitespace intentionally
5 Hover/focus states: designed, not default
6 Headlines: specific benefit-driven copy, no buzzwords
7 Accessibility: semantic HTML, ARIA labels where needed
8 Motion: 250-400ms ease-out, purposeful only
9 Background: layered depth not flat solid
10 Code quality: no TODO or placeholder comments`;

const A = {
  ctx: (k, brief) =>
    callClaude(k,
      `Extract design context from a build brief. Return ONLY JSON — no fences, no prose. Schema: {"audience":"string","vibe":"3-5 adjectives","industry":"string","references":"2-3 real sites or products","format":"react|html|svg|md","aesthetic":"brutalist|editorial|minimal|maximalist|luxury|playful|industrial|organic|geometric|retro"}`,
      `Brief: "${brief}"`, 300
    ).then(safeParseJSON),

  suggest: (k, seed) =>
    callClaude(k,
      `Generate 5 ambitious, specific React component briefs. Each must include: exact layout structure, specific font choices from (Cal Sans/Bricolage Grotesque/Playfair Display/Space Grotesk/Geist/Vollkorn/Fraunces/Lora/Merriweather), interaction details, one distinctive visual hook. Numbered list 1-5, 2-3 sentences each. No vague descriptions.`,
      `Context: ${seed}. Generate 5 distinct briefs.`
    ).then(r => r.split("\n").filter(l => /^\d+\./.test(l)).map(l => l.replace(/^\d+\.\s*/, "").trim())),

  search: (k, q) =>
    callClaude(k,
      `Design researcher. Return ONLY JSON array — no fences: [{"title":"string","url":"string","insight":"one sentence on what makes it distinctive"}]. Max 5 results.`,
      `Find distinctive design references for: "${q}"`,
      800, [{ type: "web_search_20250305", name: "web_search" }]
    ).then(r => { try { return safeParseJSON(r) || []; } catch { return []; } }),

  gen: (k, brief, ctx, tier) =>
    callClaude(k,
      tier === "top5" ? TOP5_SYSTEM : PRO_SYSTEM,
      `Build: ${brief}\nAudience: ${ctx?.audience || ""} | Vibe: ${ctx?.vibe || ""} | Industry: ${ctx?.industry || ""} | Refs: ${ctx?.references || ""} | Aesthetic: ${ctx?.aesthetic || "editorial"}`,
      4096
    ).then(r => {
      const c = stripCode(r);
      return c.includes("export") ? c : `export default function Component() {\n  return (\n${c}\n  );\n}`;
    }),

  audit: async (k, code) => {
    const raw = await callClaude(k, AUDIT_SYSTEM,
      `Audit this component (first 2000 chars only):\n${code.substring(0, 2000)}`,
      2048
    );
    const result = safeParseJSON(raw);
    if (!result) throw new Error("Audit response was unparseable — try again");
    return result;
  },

  iter: (k, code, instr, ctx) =>
    callClaude(k,
      `Refine React+Tailwind components. Apply the requested change. Return ONLY the complete updated component. No fences, no explanations.`,
      `Component:\n${code.substring(0, 3500)}\n\nChange: ${instr}\nContext: ${JSON.stringify(ctx || {})}`,
      4096
    ).then(stripCode),

  fixOne: (k, code, finding) =>
    callClaude(k,
      `Fix exactly one design issue in a React+Tailwind component. Apply the fix. Preserve everything else. Return ONLY the complete updated component. No fences, no explanations.`,
      `Component:\n${code.substring(0, 3500)}\n\nFix this issue:\nRule: ${finding.rule}\nProblem: ${finding.detail}`,
      4096
    ).then(stripCode),

  fixAll: (k, code, failures) =>
    callClaude(k,
      `Fix all listed issues in a React+Tailwind component in one pass. Fix every issue listed. Preserve everything else. Return ONLY the complete updated component. No fences, no explanations.`,
      `Component:\n${code.substring(0, 3000)}\n\nFix ALL of these:\n${failures.map((f, i) => `${i + 1}. [${f.rule}] ${f.detail}`).join("\n")}`,
      4096
    ).then(stripCode),

  toHTML: (k, code) =>
    callClaude(k,
      `Convert a React+Tailwind JSX component into a SINGLE self-contained HTML file. Rules:
- Expand all Tailwind classes to equivalent inline CSS or a <style> block
- Convert JSX to plain HTML structure  
- Replace useState/hooks with vanilla JS (event listeners, variables)
- Load custom fonts via Google Fonts <link> in <head>
- Preserve all visual design: colors, fonts, spacing, layout, animations
- Include all interactivity as vanilla JS
- Return ONLY the complete HTML starting with <!DOCTYPE html>. No fences, no explanation.`,
      `Convert to standalone HTML:\n\n${code.substring(0, 3500)}`,
      4096
    ).then(r => {
      const clean = stripCode(r);
      return clean.startsWith("<!DOCTYPE") || clean.startsWith("<html") ? clean
        : `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${clean}</body></html>`;
    }),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PIPELINE PROGRESS BAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Pipeline({ steps, activeIdx, elapsed, error, done }) {
  if (!steps?.length) return null;
  const perStep = 100 / steps.length;
  const completed = Math.min(activeIdx, steps.length) * perStep;
  const creep = activeIdx < steps.length && !error && !done
    ? perStep * 0.9 * (1 - Math.exp(-elapsed / 12)) : 0;
  const pct = Math.min(100, completed + creep);
  const barColor = error ? "#ef4444" : done ? "#22c55e" : "linear-gradient(90deg,#3b82f6,#6366f1)";

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
      {/* Bar */}
      <div className="relative h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: barColor }} />
        {!error && !done && activeIdx < steps.length && (
          <div className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)", backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite" }} />
        )}
      </div>
      {/* Steps */}
      <div className="flex items-center">
        {steps.map((step, i) => {
          const isDone    = i < activeIdx || done;
          const isActive  = i === activeIdx && !error && !done;
          const isFailed  = i === activeIdx && !!error;
          const isPending = i > activeIdx && !done;
          return (
            <div key={step.key} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-400 ${
                  isDone   ? "bg-emerald-500 text-white" :
                  isFailed ? "bg-red-500 text-white" :
                  isActive ? "bg-blue-500 text-white ring-2 ring-blue-200 dark:ring-blue-800 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900" :
                             "bg-neutral-200 dark:bg-neutral-700 text-neutral-400"
                }`}>
                  {isDone ? "✓" : isFailed ? "✗" : isActive ? <span className="animate-spin inline-block text-[10px]">◌</span> : step.icon}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate transition-colors ${
                    isDone ? "text-emerald-600 dark:text-emerald-400" :
                    isActive ? "text-blue-600 dark:text-blue-400" :
                    isFailed ? "text-red-500" : "text-neutral-400"
                  }`}>{step.label}</p>
                  {isActive && <p className="text-[10px] text-blue-400 tabular-nums">{elapsed}s</p>}
                  {isDone && <p className="text-[10px] text-emerald-500">done</p>}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 transition-colors duration-500 ${isDone ? "bg-emerald-300 dark:bg-emerald-700" : "bg-neutral-200 dark:bg-neutral-700"}`} />
              )}
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="flex justify-between mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <p className="text-[10px] text-neutral-400">
          {done ? <span className="text-emerald-500 font-medium">Complete in {elapsed}s</span>
            : error ? <span className="text-red-500 font-medium">Failed</span>
            : `Step ${Math.min(activeIdx + 1, steps.length)} of ${steps.length}`}
        </p>
        <p className="text-[10px] text-neutral-400 tabular-nums">{Math.round(pct)}%</p>
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function lineDiff(prev, next) {
  if (!prev) return (next || "").split("\n").map(l => ({ type: "same", line: l }));
  const a = prev.split("\n"), b = next.split("\n");
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i >= a.length)      out.push({ type: "add",    line: b[i] });
    else if (i >= b.length) out.push({ type: "remove", line: a[i] });
    else if (a[i] === b[i]) out.push({ type: "same",   line: a[i] });
    else { out.push({ type: "remove", line: a[i] }); out.push({ type: "add", line: b[i] }); }
  }
  return out;
}

function downloadFile(content, filename, mime = "text/plain") {
  try {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    const a = Object.assign(document.createElement("a"), {
      href: "data:text/plain;charset=utf-8," + encodeURIComponent(content),
      download: filename,
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
}

function exportTokensCSS(tokens) {
  const lines = [":root {"];
  tokens?.fonts?.forEach((f, i) => lines.push(`  --font-${i + 1}: '${f}';`));
  tokens?.colors?.forEach((c, i) => lines.push(`  --color-${i + 1}: ${c};`));
  lines.push("}");
  downloadFile(lines.join("\n"), "tokens.css", "text/css");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRIMITIVES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 ${className}`}>{children}</div>
);

const Lab = ({ children, sub }) => (
  <p className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
    {children}{sub && <span className="font-normal text-neutral-400 ml-1">{sub}</span>}
  </p>
);

const Btn = ({ onClick, children, sm, primary, danger, disabled, className = "" }) => (
  <button onClick={onClick} disabled={disabled}
    className={`font-medium border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default active:scale-[0.98] ${
      sm ? "px-3 py-1.5 text-xs rounded-md" : "px-4 py-2.5 text-sm rounded-lg"
    } ${
      primary ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 hover:opacity-90" :
      danger  ? "bg-red-600 text-white border-red-600 hover:bg-red-700" :
                "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
    } ${className}`}>
    {children}
  </button>
);

const NavTab = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer border ${
    active ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
           : "bg-neutral-50 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100"
  }`}>{children}</button>
);

const ViewTab = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
    active ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
           : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
  }`}>{children}</button>
);

const Tag = ({ color = "neutral", children }) => {
  const styles = {
    green:   "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    red:     "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    amber:   "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    blue:    "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    neutral: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
  };
  return <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded border ${styles[color]}`}>{children}</span>;
};

const Spin = ({ size = 14 }) => (
  <span className="inline-block border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mr-1.5 align-middle"
    style={{ width: size, height: size }} />
);

const TextInput = (props) => (
  <input {...props} className={`w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 ${props.className || ""}`} />
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ArtifactGenerator() {
  // ── Core state ──────────────────────────────────────
  const [key,    setKey]    = useState("");
  const [tab,    setTab]    = useState("gen"); // gen | tpl | srch
  const [brief,  setBrief]  = useState("");
  const [tier,   setTier]   = useState("top5");
  const [ph,     setPh]     = useState(PH.IDLE);
  const [err,    setErr]    = useState(null);

  // ── Derived data ────────────────────────────────────
  const [ctx,    setCtx]    = useState(null);
  const [sugs,   setSugs]   = useState([]);
  const [srch,   setSrch]   = useState([]);
  const [sq,     setSq]     = useState("");
  const [code,   setCode]   = useState("");
  const [aud,    setAud]    = useState(null);
  const [iterTxt, setIterTxt] = useState("");
  const [hist,   setHist]   = useState([]);

  // ── UI state ────────────────────────────────────────
  const [view,       setView]       = useState("code"); // code | preview | diff
  const [cp,         setCp]         = useState(false);
  const [fixingIdx,  setFixingIdx]  = useState(null);
  const [auditPass,  setAuditPass]  = useState(0);
  const [previewHTML, setPreviewHTML] = useState(null);

  // ── Pipeline state ──────────────────────────────────
  const [pipe,    setPipe]    = useState(null); // { steps, activeIdx, done, error }
  const [elapsed, setElapsed] = useState(0);
  const timerRef  = useRef(null);
  const startRef  = useRef(null);

  const busy = ph !== PH.IDLE;
  const guard = () => { if (!key.trim()) { setErr("Add your Anthropic API key"); return false; } setErr(null); return true; };
  const addToHist = (c, b) => setHist(h => [{ code: c, brief: b, ts: Date.now() }, ...h].slice(0, 10));

  // Reset preview cache whenever code changes
  useEffect(() => { setPreviewHTML(null); }, [code]);

  // Elapsed timer
  const startTimer = () => {
    setElapsed(0);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 500);
  };
  const stopTimer = () => { clearInterval(timerRef.current); };

  const openPipe  = (steps) => { setPipe({ steps, activeIdx: 0, done: false, error: false }); startTimer(); };
  const stepPipe  = (i)     => setPipe(p => p ? { ...p, activeIdx: i } : null);
  const donePipe  = ()      => { setPipe(p => p ? { ...p, done: true } : null); stopTimer(); setTimeout(() => setPipe(null), 2500); };
  const failPipe  = ()      => { setPipe(p => p ? { ...p, error: true } : null); stopTimer(); setTimeout(() => setPipe(null), 4000); };

  // ── Generate ─────────────────────────────────────────
  const generate = useCallback(async () => {
    if (!guard() || !brief.trim()) return setErr("Describe what you want to build");
    setCode(""); setAud(null); setAuditPass(0);
    openPipe(PIPES.generate);
    try {
      setPh(PH.CTX);
      const c = await A.ctx(key, brief);
      setCtx(c);
      stepPipe(1);
      setPh(PH.GEN);
      const r = await A.gen(key, brief, c, tier);
      setCode(r); addToHist(r, brief);
      donePipe();
    } catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, brief, tier]);

  // ── Suggest ──────────────────────────────────────────
  const suggest = useCallback(async () => {
    if (!guard()) return;
    openPipe(PIPES.suggest); setPh(PH.SUG);
    try {
      const seed = ctx ? `${ctx.audience}, ${ctx.vibe}, ${ctx.industry}` : brief || "modern SaaS";
      setSugs(await A.suggest(key, seed));
      donePipe();
    } catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, ctx, brief]);

  // ── Search ───────────────────────────────────────────
  const search = useCallback(async () => {
    if (!guard() || !sq.trim()) return setErr("Enter a search query");
    openPipe(PIPES.search); setPh(PH.SRCH);
    try { setSrch(await A.search(key, sq)); donePipe(); }
    catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, sq]);

  // ── Audit ────────────────────────────────────────────
  const runAudit = useCallback(async () => {
    if (!guard() || !code || auditPass >= 2) return;
    openPipe(PIPES.audit); setPh(PH.AUD);
    try {
      const result = await A.audit(key, code);
      setAud(result); setAuditPass(p => p + 1);
      donePipe();
    } catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, code, auditPass]);

  // ── Iterate ──────────────────────────────────────────
  const refine = useCallback(async () => {
    if (!guard() || !code || !iterTxt.trim()) return;
    openPipe(PIPES.iterate); setPh(PH.ITER);
    try {
      const r = await A.iter(key, code, iterTxt, ctx || {});
      setCode(r); setAud(null); setAuditPass(0); setIterTxt(""); addToHist(r, `Iteration: ${iterTxt}`);
      donePipe();
    } catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, code, iterTxt, ctx]);

  // ── Fix one ──────────────────────────────────────────
  const fixOne = useCallback(async (finding, idx) => {
    if (!guard() || !code) return;
    setFixingIdx(idx); openPipe(PIPES.fix); setPh(PH.FIX);
    try {
      const r = await A.fixOne(key, code, finding);
      setCode(r); setAuditPass(0);
      setAud(a => a ? { ...a, findings: a.findings.map((f, i) => i === idx ? { ...f, status: "pass", detail: "Fixed" } : f) } : null);
      addToHist(r, `Fix: ${finding.rule}`);
      donePipe();
    } catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); setFixingIdx(null); }
  }, [key, code]);

  // ── Fix all ──────────────────────────────────────────
  const fixAll = useCallback(async () => {
    if (!guard() || !code || !aud) return;
    const failures = aud.findings?.filter(f => f.status === "fail") || [];
    if (!failures.length) return;
    openPipe(PIPES.fixall); setPh(PH.FIXALL);
    try {
      stepPipe(1);
      const r = await A.fixAll(key, code, failures);
      setCode(r); setAud(null); setAuditPass(0); addToHist(r, `Fix all (${failures.length} issues)`);
      donePipe();
    } catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, code, aud]);

  // ── Refresh context ──────────────────────────────────
  const refreshCtx = useCallback(async () => {
    if (!guard() || !brief.trim()) return;
    openPipe(PIPES.ctx); setPh(PH.CTX);
    try { setCtx(await A.ctx(key, brief)); donePipe(); }
    catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, brief]);

  // ── Preview ──────────────────────────────────────────
  const buildPreview = useCallback(async () => {
    if (!guard() || !code) return;
    openPipe(PIPES.preview); setPh(PH.PREVIEW);
    try { setPreviewHTML(await A.toHTML(key, code)); donePipe(); }
    catch (e) { setErr(e.message); failPipe(); }
    finally { setPh(PH.IDLE); }
  }, [key, code]);

  // ── Misc ─────────────────────────────────────────────
  const copy = () => { navigator.clipboard.writeText(code); setCp(true); setTimeout(() => setCp(false), 1500); };
  const dl   = () => downloadFile(code, "component.jsx");

  const failureCount = aud?.findings?.filter(f => f.status === "fail").length || 0;
  const warnCount    = aud?.findings?.filter(f => f.status === "warn").length || 0;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-3">

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Artifact Generator</h1>
          <p className="text-[11px] text-neutral-500 mt-1">AI suggestions · Auto context · Audit + fix · Web search · Templates · Preview · Version history</p>
        </div>

        {/* API Key */}
        <Card>
          <Lab>Anthropic API key</Lab>
          <TextInput type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="sk-ant-..." className="font-mono" />
        </Card>

        {/* Nav tabs */}
        <div className="flex gap-1.5">
          <NavTab active={tab === "gen"}  onClick={() => setTab("gen")}>Generate</NavTab>
          <NavTab active={tab === "tpl"}  onClick={() => setTab("tpl")}>Templates</NavTab>
          <NavTab active={tab === "srch"} onClick={() => setTab("srch")}>Search</NavTab>
        </div>

        {/* ═══ GENERATE TAB ═══ */}
        {tab === "gen" && (<>
          {/* Brief */}
          <Card>
            <Lab sub="— context auto-populates from this">What do you want to build?</Lab>
            <textarea value={brief} onChange={e => setBrief(e.target.value)}
              placeholder="Hero section with oversized Bricolage Grotesque heading, gradient mesh background, floating nav, 3-column bento feature grid..."
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 min-h-[90px] resize-y" />
            <div className="mt-2">
              <Btn sm onClick={suggest} disabled={busy}>
                {ph === PH.SUG ? <><Spin />Suggesting...</> : "✦ Suggest 5 ideas"}
              </Btn>
            </div>
            {sugs.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {sugs.map((s, i) => (
                  <button key={i} onClick={() => { setBrief(s); setSugs([]); }}
                    className="w-full text-left px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer leading-relaxed transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Auto context */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <Lab sub="— auto-generated">Design context</Lab>
              {ctx && <button onClick={refreshCtx} disabled={busy} className="text-[11px] text-neutral-400 hover:text-neutral-600 disabled:opacity-40 cursor-pointer">↻ Regenerate</button>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["audience", "vibe", "industry", "references", "format", "aesthetic"].map(f => (
                <div key={f}>
                  <p className="text-[10px] text-neutral-400 mb-1 capitalize">{f}</p>
                  <div className="text-xs px-2.5 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800 min-h-[28px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {ph === PH.CTX
                      ? <span className="text-neutral-400 animate-pulse">analyzing...</span>
                      : ctx?.[f] || <span className="text-neutral-400 italic">auto-fills on generate</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tier */}
          <Card>
            <Lab>Quality tier</Lab>
            <div className="grid grid-cols-2 gap-2">
              {[["top5", "🏆 Top 5%"], ["pro", "Professional"]].map(([v, l]) => (
                <button key={v} onClick={() => setTier(v)}
                  className={`py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                    tier === v
                      ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                      : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-100"
                  }`}>{l}</button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5">
              {tier === "top5" ? "Bold colors, distinctive typography, premium interactions, showcase quality" : "Clean, production-ready, solid design fundamentals"}
            </p>
          </Card>

          {/* Generate */}
          <Btn onClick={generate} disabled={busy} className="w-full py-3">
            {busy && ph <= PH.GEN ? <><Spin />{ph === PH.CTX ? "Analyzing brief..." : "Generating component..."}</> : "Generate component"}
          </Btn>

          {/* Pipeline */}
          {pipe && <Pipeline steps={pipe.steps} activeIdx={pipe.activeIdx} elapsed={elapsed} error={pipe.error} done={pipe.done} />}
        </>)}

        {/* ═══ TEMPLATES TAB ═══ */}
        {tab === "tpl" && (
          <Card>
            <Lab>High-fidelity templates</Lab>
            <p className="text-[11px] text-neutral-400 mb-3">Click to load brief → switch to Generate → full anti-slop constraints applied</p>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { setBrief(t.brief); setTab("gen"); }}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{t.name}</span>
                    <Tag>{t.cat}</Tag>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{t.brief.substring(0, 120)}…</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* ═══ SEARCH TAB ═══ */}
        {tab === "srch" && (
          <Card>
            <Lab sub="— web search for real design references">Design reference search</Lab>
            <div className="flex gap-2 mb-3">
              <TextInput value={sq} onChange={e => setSq(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
                placeholder="best SaaS hero sections 2026, brutalist design examples..." className="flex-1" />
              <Btn sm primary onClick={search} disabled={busy}>{ph === PH.SRCH ? <Spin /> : "Search"}</Btn>
            </div>
            {pipe && tab === "srch" && <Pipeline steps={pipe.steps} activeIdx={pipe.activeIdx} elapsed={elapsed} error={pipe.error} done={pipe.done} />}
            {srch.length > 0 && (
              <div className="space-y-2 mt-3">
                {srch.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">{r.title} ↗</a>
                    <p className="text-[11px] text-neutral-500 mt-1">{r.insight}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Error */}
        {err && (
          <div className="px-3 py-2.5 text-sm rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">✗</span>
            <span>{err}</span>
            <button onClick={() => setErr(null)} className="ml-auto shrink-0 text-red-400 hover:text-red-600 cursor-pointer">×</button>
          </div>
        )}

        {/* ═══ OUTPUT ═══ */}
        {code && (<>

          {/* ── Audit panel (first — no scrolling needed) ── */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lab>Quality audit</Lab>
                {aud && failureCount > 0 && <Tag color="red">{failureCount} failing</Tag>}
                {aud && warnCount > 0 && <Tag color="amber">{warnCount} warnings</Tag>}
                {aud && failureCount === 0 && warnCount === 0 && <Tag color="green">All passing</Tag>}
              </div>
              <div className="flex items-center gap-2">
                {aud && (
                  <>
                    <span className="text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{aud.score}</span>
                    <Tag color={aud.score >= 80 ? "green" : aud.score >= 60 ? "amber" : "red"}>{aud.grade}</Tag>
                    {failureCount > 0 && (
                      <Btn sm primary onClick={fixAll} disabled={busy}>
                        {ph === PH.FIXALL ? <><Spin />Fixing...</> : `⚡ Fix all ${failureCount}`}
                      </Btn>
                    )}
                  </>
                )}
                {auditPass < 2
                  ? <Btn sm primary={!aud} onClick={runAudit} disabled={busy}>{ph === PH.AUD ? <><Spin />Auditing...</> : aud ? "Re-audit" : "Run audit"}</Btn>
                  : <span className="text-[11px] text-neutral-400 italic">Limit reached — iterate to reset</span>
                }
              </div>
            </div>

            {aud ? (<>
              {/* Score bar */}
              <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${aud.score}%`,
                  background: aud.score >= 80 ? "#22c55e" : aud.score >= 60 ? "#f59e0b" : "#ef4444"
                }} />
              </div>

              {/* Findings with per-row Fix buttons */}
              <div className="space-y-1.5 mb-3">
                {aud.findings?.map((f, i) => (
                  <div key={i} className={`flex items-start justify-between gap-3 px-2.5 py-2 rounded-lg border ${
                    f.status === "fail" ? "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/40" :
                    f.status === "warn" ? "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40" :
                    "bg-neutral-50 dark:bg-neutral-800/50 border-transparent"
                  }`}>
                    <div className="flex items-start gap-2 min-w-0">
                      <span className={`mt-0.5 shrink-0 font-bold ${f.status === "pass" ? "text-emerald-500" : f.status === "fail" ? "text-red-500" : "text-amber-500"}`}>
                        {f.status === "pass" ? "✓" : f.status === "fail" ? "✗" : "⚠"}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{f.rule}</span>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{f.detail}</p>
                      </div>
                    </div>
                    {(f.status === "fail" || f.status === "warn") && (
                      <button onClick={() => fixOne(f, i)} disabled={busy}
                        className={`shrink-0 px-2.5 py-1 text-[11px] font-medium rounded-md border cursor-pointer disabled:opacity-40 transition-all ${
                          fixingIdx === i ? "bg-blue-50 dark:bg-blue-950 text-blue-600 border-blue-200 dark:border-blue-800" :
                          f.status === "fail" ? "bg-white dark:bg-neutral-800 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50" :
                          "bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50"
                        }`}>
                        {fixingIdx === i ? <Spin size={12} /> : "Fix"}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Suggestions as clickable chips */}
              {aud.suggestions?.length > 0 && (
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2.5 mb-3">
                  <p className="text-[10px] font-medium text-neutral-400 mb-1.5">Enhancements — click to apply</p>
                  <div className="flex flex-wrap gap-1.5">
                    {aud.suggestions.map((s, i) => (
                      <button key={i} onClick={() => setIterTxt(s)}
                        className="px-2.5 py-1 text-[11px] text-neutral-600 dark:text-neutral-400 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors">
                        {s.length > 50 ? s.substring(0, 50) + "…" : s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Design tokens */}
              {aud.tokens && (
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-medium text-neutral-400">Design tokens</p>
                    <button onClick={() => exportTokensCSS(aud.tokens)} className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer">Export CSS ↓</button>
                  </div>
                  <div className="flex items-center flex-wrap gap-3">
                    <div className="flex flex-wrap gap-1">
                      {aud.tokens.fonts?.map((f, i) => <Tag key={i} color={SLOP_FONTS.some(s => f.includes(s)) ? "red" : "green"}>{f}</Tag>)}
                    </div>
                    <div className="flex gap-1.5">
                      {aud.tokens.colors?.slice(0, 8).map((c, i) => (
                        <span key={i} onClick={() => navigator.clipboard.writeText(c)} title={c}
                          className="w-5 h-5 rounded border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <Tag color={SLOP_ICONS.some(s => aud.tokens.icons?.includes(s)) ? "red" : "green"}>
                      {aud.tokens.icons || "no icons"}
                    </Tag>
                  </div>
                </div>
              )}

              {/* Audit-level pipeline */}
              {pipe && ph === PH.AUD && <div className="mt-3"><Pipeline steps={pipe.steps} activeIdx={pipe.activeIdx} elapsed={elapsed} error={pipe.error} done={pipe.done} /></div>}
            </>) : (
              <p className="text-[11px] text-neutral-400">Run audit to check typography, icons, color, layout, accessibility, motion, and code quality against anti-slop rules.</p>
            )}
          </Card>

          {/* ── Code / Preview / Diff ── */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-0.5">
                <ViewTab active={view === "code"}    onClick={() => setView("code")}>Code</ViewTab>
                <ViewTab active={view === "preview"} onClick={() => setView("preview")}>Preview</ViewTab>
                {hist.length > 1 && <ViewTab active={view === "diff"} onClick={() => setView("diff")}>Diff</ViewTab>}
              </div>
              <div className="flex gap-1.5">
                <Btn sm onClick={copy}>{cp ? "Copied!" : "Copy"}</Btn>
                <Btn sm onClick={dl}>Download</Btn>
              </div>
            </div>

            {view === "code" && (
              <pre className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 overflow-auto max-h-[420px] text-[11px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-mono whitespace-pre-wrap break-words">{code}</pre>
            )}

            {view === "preview" && (
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden" style={{ minHeight: 220 }}>
                {!previewHTML && ph !== PH.PREVIEW && (
                  <div className="h-52 flex flex-col items-center justify-center gap-3">
                    <p className="text-sm text-neutral-400">Converts your JSX component to standalone HTML for preview</p>
                    <Btn sm primary onClick={buildPreview} disabled={busy}>Generate preview</Btn>
                  </div>
                )}
                {ph === PH.PREVIEW && (
                  <div className="h-52 flex items-center justify-center">
                    <span className="text-sm text-neutral-400 animate-pulse"><Spin />Converting to HTML…</span>
                  </div>
                )}
                {previewHTML && ph !== PH.PREVIEW && (
                  <>
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                      <span className="text-[10px] text-neutral-400">Converted HTML preview</span>
                      <button onClick={buildPreview} disabled={busy} className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer disabled:opacity-40">↻ Regenerate</button>
                    </div>
                    <iframe key={previewHTML.length} title="component-preview" srcDoc={previewHTML}
                      className="w-full border-0" style={{ height: 480 }} sandbox="allow-scripts" />
                  </>
                )}
              </div>
            )}

            {view === "diff" && hist.length > 1 && (() => {
              const diff = lineDiff(hist[1]?.code || "", code);
              return (
                <div>
                  <p className="text-[11px] text-neutral-400 mb-2">
                    vs v{hist.length - 1} — <span className="text-emerald-500">+{diff.filter(l => l.type === "add").length}</span> / <span className="text-red-500">-{diff.filter(l => l.type === "remove").length}</span>
                  </p>
                  <pre className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 overflow-auto max-h-[420px] text-[11px] leading-relaxed font-mono">
                    {diff.map((l, i) => (
                      <div key={i} className={
                        l.type === "add"    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" :
                        l.type === "remove" ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 line-through opacity-50" :
                        "text-neutral-500"
                      }>{l.type === "add" ? "+ " : l.type === "remove" ? "- " : "  "}{l.line}</div>
                    ))}
                  </pre>
                </div>
              );
            })()}

            <p className="text-[11px] text-neutral-400 mt-2">
              {tier === "top5" ? "🏆 Top 5%" : "Pro"} · {code.length.toLocaleString()} chars · {new Date().toLocaleTimeString()}
            </p>
          </Card>

          {/* ── Iterate ── */}
          <Card>
            <Lab>Iterate</Lab>
            <div className="flex gap-2">
              <TextInput value={iterTxt} onChange={e => setIterTxt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && refine()}
                placeholder="Make heading larger, add hover glow, change to warm earth palette…" className="flex-1" />
              <Btn sm primary onClick={refine} disabled={busy}>{ph === PH.ITER ? <Spin /> : "Refine"}</Btn>
            </div>
            {pipe && (ph === PH.ITER || ph === PH.FIX || ph === PH.FIXALL) && (
              <div className="mt-3"><Pipeline steps={pipe.steps} activeIdx={pipe.activeIdx} elapsed={elapsed} error={pipe.error} done={pipe.done} /></div>
            )}
          </Card>

          {/* ── Version history ── */}
          {hist.length > 1 && (
            <Card>
              <Lab>Version history</Lab>
              <div className="space-y-1">
                {hist.map((h, i) => (
                  <button key={h.ts}
                    onClick={() => { setCode(h.code); setAud(null); setAuditPass(0); setView("code"); }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                      code === h.code
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}>
                    <span className="font-medium">v{hist.length - i}</span>
                    <span className="ml-2 text-neutral-600 dark:text-neutral-400">{h.brief.substring(0, 55)}</span>
                    <span className="ml-2 text-neutral-400">{new Date(h.ts).toLocaleTimeString()}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </>)}

      </div>
    </div>
  );
}
