import { useState, useCallback, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PH = { IDLE: 0, CTX: 1, SUG: 2, SRCH: 3, GEN: 4, AUD: 5, ITER: 6 };
const PH_MSG = {
  [PH.IDLE]: "Generate",
  [PH.CTX]: "Analyzing brief...",
  [PH.SUG]: "Generating ideas...",
  [PH.SRCH]: "Searching...",
  [PH.GEN]: "Generating component...",
  [PH.AUD]: "Running audit...",
  [PH.ITER]: "Refining...",
};

const SLOP = {
  fonts: ["Inter", "Roboto", "Poppins", "Open Sans", "system-ui", "Arial", "Helvetica"],
  icons: ["Heroicons", "heroicons", "lucide-react", "Lucide"],
};

// Pipeline step configs per operation
const PIPES = {
  generate: [
    { key: "ctx", label: "Analyzing brief", icon: "◎" },
    { key: "gen", label: "Generating component", icon: "⚡" },
  ],
  suggest: [{ key: "sug", label: "Generating ideas", icon: "✦" }],
  search: [{ key: "srch", label: "Searching references", icon: "◉" }],
  audit: [{ key: "aud", label: "Running quality audit", icon: "△" }],
  iterate: [{ key: "iter", label: "Refining component", icon: "↻" }],
  ctx: [{ key: "ctx", label: "Analyzing brief", icon: "◎" }],
};

const TEMPLATES = [
  {
    id: "hero-dark",
    name: "Dark hero + gradient mesh",
    cat: "Landing",
    brief:
      "Full-viewport dark hero with animated gradient mesh via CSS conic-gradient layers. 72px Bricolage Grotesque heading, tight tracking. Fraunces italic subheading. Two CTAs: primary solid with hover scale, ghost with border animation. Floating pulse badge. Nav: logo left, 4 links center, CTA right.",
  },
  {
    id: "pricing",
    name: "Editorial pricing table",
    cat: "SaaS",
    brief:
      "Three-tier pricing with editorial aesthetic. Playfair Display headings, Lora body. Middle card overlaps, 20% taller. Monthly/annual toggle with animated pill. Each card: tier name, animated price counter, 6 features with custom checkmark SVGs, CTA. Paper texture background. Recommended badge on middle.",
  },
  {
    id: "dashboard",
    name: "Analytics dashboard",
    cat: "Dashboard",
    brief:
      "Dense analytics panel, Space Grotesk type. Top row: 4 metric cards with sparkline SVGs and percentage badges (green up, red down). Main: large area chart with gradient fill. Right sidebar: ranked list of top 5 with horizontal bar indicators. Dark sidebar nav with active glow. All hover states designed.",
  },
  {
    id: "auth",
    name: "Split-screen auth",
    cat: "Auth",
    brief:
      "Split login page. Left: abstract geometric art via CSS shapes — overlapping circles/rectangles in terracotta, sand, moss. Right: centered form with Geist type. Floating label inputs that animate on focus. Gradient-shift sign-in button. Social login row with custom SVGs. Error shake animation.",
  },
  {
    id: "bento",
    name: "Bento feature grid",
    cat: "Marketing",
    brief:
      "Asymmetrical bento grid — 6 cards in varying sizes (2 large, 2 medium, 2 small). Each card has unique background (gradient, pattern, solid, overlay, purposeful glass, texture). Cal Sans headings. Phosphor duotone icons. Hover lift with shadow depth. Intentional gaps: some 4px, some 12px for rhythm.",
  },
  {
    id: "testimonials",
    name: "Testimonial wall",
    cat: "Social proof",
    brief:
      "Masonry testimonial wall. Vollkorn quotes, Merriweather attribution. Variable-height cards. Left border accent per card from warm palette. Initial avatars. Custom SVG star ratings. Light warm gray background with dot grid pattern. One featured quote spans 2 columns, larger text.",
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function call(apiKey, system, prompt, maxTokens = 1024, tools = null) {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages: [{ role: "user", content: prompt }] };
  if (tools) body.tools = tools;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error?.message || `API ${r.status}`);
  return (await r.json()).content.find((b) => b.type === "text")?.text?.trim() || "";
}

function parseJSON(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/[\[{][\s\S]*[\]}]/);
  return match ? JSON.parse(match[0]) : null;
}

const A = {
  ctx: (k, brief) =>
    call(
      k,
      `Extract design context. Return ONLY JSON: {"audience":"str","vibe":"3-5 adjectives","industry":"str","references":"2-3 real sites","format":"react|html|svg|md","aesthetic":"brutalist|editorial|minimal|maximalist|luxury|playful|industrial|organic|geometric|retro"}`,
      `Brief: "${brief}"`,
      300
    ).then(parseJSON),

  suggest: (k, seed) =>
    call(
      k,
      `Generate 5 ambitious component briefs. Each: exact layout, typography (Cal Sans/Bricolage Grotesque/Playfair/Space Grotesk/Geist/Vollkorn/Fraunces/Lora/Merriweather), interactions, one visual hook. Numbered list, 2-3 sentences each.`,
      `Context: ${seed}. Generate 5 briefs.`
    ).then((r) =>
      r
        .split("\n")
        .filter((l) => l.match(/^\d+\./))
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    ),

  search: (k, q) =>
    call(
      k,
      `Design researcher. Return ONLY JSON array: [{"title":"str","url":"str","insight":"1 sentence"}]. Max 5.`,
      `Find design references for: "${q}"`,
      800,
      [{ type: "web_search_20250305", name: "web_search" }]
    ).then((r) => {
      try { return parseJSON(r) || []; } catch { return []; }
    }),

  gen: (k, brief, ctx, tier) => {
    const q =
      tier === "top5"
        ? `TOP 5%. Awwwards-tier. Typography: Cal Sans, Bricolage Grotesque, Playfair, Space Grotesk, Geist, Vollkorn, Fraunces. NEVER Inter/Roboto/Poppins/system-ui. Icons: Phosphor/Hugeicons/FA. NEVER Heroicons/Lucide. Asymmetrical layout, strategic whitespace. Intentional color palette, explicit hex, WCAG AAA. No purple-blue gradients. 250-400ms ease-out motion. Layered backgrounds. Every state designed (hover, focus, active, loading, error, empty, disabled). Aesthetic: ${ctx.aesthetic || "editorial"}. Commit fully.`
        : `Professional. Clean, solid, accessible. Good typography, hierarchy.`;
    return call(
      k,
      `React + Tailwind component generator. ${q}\nFORBIDDEN: Inter, Roboto, Poppins, Arial, system-ui. Purple-blue gradients. Heroicons/Lucide. Glassmorphism as decoration. Nested cards 3+. Vague headlines. Buzzwords. TODOs. Comments. Markdown fences.\nReturn ONLY component code.`,
      `Build: ${brief}\nAudience=${ctx.audience}, Vibe=${ctx.vibe}, Industry=${ctx.industry}, Refs=${ctx.references}`,
      4096
    ).then((c) => {
      c = c.replace(/^```(?:jsx|tsx|javascript|typescript)?\n?/m, "").replace(/\n?```$/m, "");
      return c.includes("export") ? c : `export default function Component() {\n  return (\n${c}\n  );\n}`;
    });
  },

  audit: (k, code) =>
    call(
      k,
      `Design auditor. Return ONLY JSON: {"score":0-100,"grade":"A+|A|B|C|D|F","findings":[{"rule":"str","status":"pass|fail|warn","detail":"str"}],"tokens":{"fonts":[],"colors":[],"icons":"str"},"suggestions":["str"]}
Rules: 1.No Inter/Roboto/Poppins 2.No Heroicons/Lucide 3.No purple-blue gradients 4.Not centered-everything 5.Has hover/focus 6.No vague headlines 7.Has ARIA/semantic HTML 8.Purposeful animation 9.Background atmosphere 10.No TODOs`,
      `Audit:\n${code.substring(0, 3500)}`,
      1024
    ).then(parseJSON),

  iter: (k, code, instr, ctx) =>
    call(
      k,
      `Refine React+Tailwind components. Return ONLY complete updated code. No explanations, no fences.`,
      `Current:\n${code.substring(0, 3500)}\n\nChange: ${instr}\nCtx: ${JSON.stringify(ctx)}`,
      4096
    ).then((c) => c.replace(/^```(?:jsx|tsx|javascript|typescript)?\n?/m, "").replace(/\n?```$/m, "")),
};

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
const Btn = ({ onClick, children, sm, primary, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`font-medium rounded-lg border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-default active:scale-[0.98] ${
      sm ? "px-3 py-1.5 text-xs rounded-md" : "px-4 py-2.5 text-sm"
    } ${
      primary
        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 hover:opacity-90"
        : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
    } ${className}`}
  >
    {children}
  </button>
);
const Tab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
      active
        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border border-neutral-900 dark:border-neutral-100"
        : "bg-neutral-50 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100"
    }`}
  >
    {children}
  </button>
);
const Tag = ({ color = "neutral", children }) => {
  const c = {
    green: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    red: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    amber: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    neutral: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
  };
  return <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded border ${c[color]}`}>{children}</span>;
};
const Spin = () => <span className="inline-block w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mr-1.5 align-middle" />;
const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 ${props.className || ""}`}
  />
);

// Pipeline progress bar — shows multi-step operations with real-time feedback
const Pipeline = ({ steps, activeIdx, elapsed, error, done: allDone }) => {
  if (!steps || steps.length === 0) return null;

  // Smooth fill: base % from completed steps + simulated creep within active step
  const basePerStep = 100 / steps.length;
  const completedPct = Math.min(activeIdx, steps.length) * basePerStep;
  // Within the active step, creep from 0→90% of that segment over ~30s (asymptotic)
  const creep = activeIdx < steps.length && !error && !allDone
    ? basePerStep * 0.9 * (1 - Math.exp(-elapsed / 12))
    : 0;
  const pct = Math.min(100, completedPct + creep);

  const barBg = error
    ? "rgb(239 68 68)"
    : allDone
    ? "rgb(34 197 94)"
    : "linear-gradient(90deg, rgb(59 130 246) 0%, rgb(99 102 241) 100%)";

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 overflow-hidden">
      {/* Bar */}
      <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: barBg,
            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Shimmer on active bar */}
        {!error && !allDone && activeIdx < steps.length && (
          <div
            className="absolute inset-y-0 left-0 rounded-full opacity-40"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Steps row */}
      <div className="flex items-stretch gap-0">
        {steps.map((step, i) => {
          const isDone = i < activeIdx || allDone;
          const isActive = i === activeIdx && !error && !allDone;
          const isFailed = i === activeIdx && error;
          const isPending = i > activeIdx && !allDone;

          return (
            <div key={step.key} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-all duration-500 ${
                    isDone
                      ? "bg-emerald-500 text-white shadow-sm"
                      : isActive
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/25 ring-[3px] ring-blue-100 dark:ring-blue-900/50"
                      : isFailed
                      ? "bg-red-500 text-white"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400"
                  }`}
                >
                  {isDone ? "✓" : isFailed ? "✗" : isActive ? (
                    <span className="animate-spin text-[10px]">◌</span>
                  ) : (
                    <span className="text-[10px]">{step.icon}</span>
                  )}
                </div>

                {/* Label + meta */}
                <div className="min-w-0">
                  <p
                    className={`text-xs font-medium truncate transition-colors duration-300 ${
                      isDone ? "text-emerald-600 dark:text-emerald-400"
                        : isActive ? "text-blue-600 dark:text-blue-400"
                        : isFailed ? "text-red-600 dark:text-red-400"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-[10px] text-blue-400 tabular-nums">
                      {elapsed}s
                    </p>
                  )}
                  {isDone && step.elapsed != null && (
                    <p className="text-[10px] text-emerald-500">{step.elapsed}s</p>
                  )}
                  {isDone && step.elapsed == null && (
                    <p className="text-[10px] text-emerald-500">done</p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 mx-3 flex items-center">
                  <div
                    className={`w-full h-px transition-all duration-500 ${
                      isDone ? "bg-emerald-400 dark:bg-emerald-600" : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary line */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <p className="text-[10px] text-neutral-400">
          {allDone ? (
            <span className="text-emerald-500 font-medium">Complete in {elapsed}s</span>
          ) : error ? (
            <span className="text-red-500 font-medium">Failed at step {activeIdx + 1}</span>
          ) : (
            <>Step {Math.min(activeIdx + 1, steps.length)} of {steps.length}</>
          )}
        </p>
        <p className="text-[10px] text-neutral-400 tabular-nums">
          {Math.round(pct)}%
        </p>
      </div>

      {/* Shimmer keyframe (injected once) */}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ArtifactGenerator() {
  const [key, setKey] = useState("");
  const [tab, setTab] = useState("gen");
  const [brief, setBrief] = useState("");
  const [tier, setTier] = useState("top5");
  const [ph, setPh] = useState(PH.IDLE);
  const [err, setErr] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [sugs, setSugs] = useState([]);
  const [srch, setSrch] = useState([]);
  const [sq, setSq] = useState("");
  const [code, setCode] = useState("");
  const [aud, setAud] = useState(null);
  const [iter, setIter] = useState("");
  const [hist, setHist] = useState([]);
  const [cp, setCp] = useState(false);

  // Pipeline tracking
  const [pipe, setPipe] = useState(null);     // { steps: [], activeIdx: number }
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Start/stop elapsed timer when pipeline is active
  useEffect(() => {
    if (pipe && pipe.activeIdx >= 0) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [pipe?.activeIdx, pipe?.steps]);

  // Clear pipeline when idle
  const closePipe = () => { setPipe(null); setElapsed(0); clearInterval(timerRef.current); };

  const busy = ph !== PH.IDLE;
  const ok = () => { if (!key) { setErr("Add API key"); return false; } setErr(null); return true; };
  const push = (c, b) => setHist((h) => [{ code: c, brief: b, ts: Date.now() }, ...h].slice(0, 10));

  // ── Generate pipeline ─────────────────────────────────
  const generate = useCallback(async () => {
    if (!ok() || !brief.trim()) return setErr("Describe what to build");
    setCode(""); setAud(null);
    const steps = PIPES.generate;
    setPipe({ steps, activeIdx: 0, done: false });
    try {
      setPh(PH.CTX);
      const c = await A.ctx(key, brief);
      setCtx(c);
      setPipe({ steps, activeIdx: 1, done: false });
      setPh(PH.GEN);
      const r = await A.gen(key, brief, c, tier);
      setCode(r);
      push(r, brief);
      setPipe({ steps, activeIdx: steps.length, done: true });
      setTimeout(closePipe, 3000);
    } catch (e) { setErr(e.message); setPipe((p) => p ? { ...p, error: true } : null); setTimeout(closePipe, 4000); }
    finally { setPh(PH.IDLE); }
  }, [key, brief, tier]);

  // ── Suggest ───────────────────────────────────────────
  const suggest = useCallback(async () => {
    if (!ok()) return;
    const steps = PIPES.suggest;
    setPipe({ steps, activeIdx: 0, done: false });
    setPh(PH.SUG);
    try {
      const seed = ctx ? `${ctx.audience}, ${ctx.vibe}, ${ctx.industry}` : brief || "modern SaaS";
      setSugs(await A.suggest(key, seed));
      setPipe({ steps, activeIdx: steps.length, done: true });
      setTimeout(closePipe, 2000);
    } catch (e) { setErr(e.message); setPipe((p) => p ? { ...p, error: true } : null); setTimeout(closePipe, 4000); }
    finally { setPh(PH.IDLE); }
  }, [key, ctx, brief]);

  // ── Search ────────────────────────────────────────────
  const search = useCallback(async () => {
    if (!ok() || !sq.trim()) return setErr("Enter search query");
    const steps = PIPES.search;
    setPipe({ steps, activeIdx: 0, done: false });
    setPh(PH.SRCH);
    try { setSrch(await A.search(key, sq)); setPipe({ steps, activeIdx: steps.length, done: true }); setTimeout(closePipe, 2000); }
    catch (e) { setErr(e.message); setPipe((p) => p ? { ...p, error: true } : null); setTimeout(closePipe, 4000); }
    finally { setPh(PH.IDLE); }
  }, [key, sq]);

  // ── Audit ─────────────────────────────────────────────
  const audit = useCallback(async () => {
    if (!ok() || !code) return;
    const steps = PIPES.audit;
    setPipe({ steps, activeIdx: 0, done: false });
    setPh(PH.AUD);
    try { setAud(await A.audit(key, code)); setPipe({ steps, activeIdx: steps.length, done: true }); setTimeout(closePipe, 2000); }
    catch (e) { setErr(e.message); setPipe((p) => p ? { ...p, error: true } : null); setTimeout(closePipe, 4000); }
    finally { setPh(PH.IDLE); }
  }, [key, code]);

  // ── Iterate ───────────────────────────────────────────
  const refine = useCallback(async () => {
    if (!ok() || !code || !iter.trim()) return;
    const steps = PIPES.iterate;
    setPipe({ steps, activeIdx: 0, done: false });
    setPh(PH.ITER);
    try {
      const r = await A.iter(key, code, iter, ctx || {});
      setCode(r); setAud(null); setIter("");
      push(r, `Iteration: ${iter}`);
      setPipe({ steps, activeIdx: steps.length, done: true });
      setTimeout(closePipe, 2000);
    } catch (e) { setErr(e.message); setPipe((p) => p ? { ...p, error: true } : null); setTimeout(closePipe, 4000); }
    finally { setPh(PH.IDLE); }
  }, [key, code, iter, ctx]);

  // ── Refresh context ───────────────────────────────────
  const reCtx = async () => {
    if (!ok() || !brief.trim()) return;
    const steps = PIPES.ctx;
    setPipe({ steps, activeIdx: 0, done: false });
    setPh(PH.CTX);
    try { setCtx(await A.ctx(key, brief)); setPipe({ steps, activeIdx: steps.length, done: true }); setTimeout(closePipe, 2000); }
    catch (e) { setErr(e.message); setPipe((p) => p ? { ...p, error: true } : null); setTimeout(closePipe, 4000); }
    finally { setPh(PH.IDLE); }
  };

  const copy = () => { navigator.clipboard.writeText(code); setCp(true); setTimeout(() => setCp(false), 1500); };
  const dl = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([code], { type: "text/javascript" })); a.download = "component.jsx"; a.click(); URL.revokeObjectURL(a.href); };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-3">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Artifact Generator</h1>
          <p className="text-[11px] text-neutral-500 mt-1">AI suggestions · Auto-context · Quality audits · Web search · Templates · Iteration · Version history</p>
        </div>

        {/* API Key */}
        <Card>
          <Lab>API key</Lab>
          <Input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-..." className="font-mono" />
        </Card>

        {/* Tabs */}
        <div className="flex gap-1.5">
          <Tab active={tab === "gen"} onClick={() => setTab("gen")}>Generate</Tab>
          <Tab active={tab === "tpl"} onClick={() => setTab("tpl")}>Templates</Tab>
          <Tab active={tab === "srch"} onClick={() => setTab("srch")}>Search</Tab>
        </div>

        {/* ═══ GENERATE ═══ */}
        {tab === "gen" && (
          <>
            <Card>
              <Lab sub="— context fields auto-populate from this">What do you want to build?</Lab>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Hero section with oversized Bricolage Grotesque heading, gradient mesh background, floating nav, 3-column bento feature grid..."
                rows={4}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 min-h-[90px] resize-y"
              />
              <div className="mt-2">
                <Btn sm onClick={suggest} disabled={busy}>
                  {ph === PH.SUG ? <><Spin />Suggesting...</> : "✦ Suggest 5 ideas"}
                </Btn>
              </div>
              {sugs.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {sugs.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setBrief(s); setSugs([]); }}
                      className="w-full text-left px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer leading-relaxed transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Context */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <Lab sub="— auto-generated">Design context</Lab>
                {ctx && <button onClick={reCtx} disabled={busy} className="text-[11px] text-neutral-400 hover:text-neutral-600 disabled:opacity-40 cursor-pointer">↻ Regenerate</button>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["audience", "vibe", "industry", "references", "format", "aesthetic"].map((f) => (
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
                  <button
                    key={v}
                    onClick={() => setTier(v)}
                    className={`py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                      tier === v
                        ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                        : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5">
                {tier === "top5" ? "Bold colors, distinctive typography, premium interactions, showcase quality" : "Clean, production-ready, solid design fundamentals"}
              </p>
            </Card>

            {/* Generate */}
            <Btn onClick={generate} disabled={busy} className="w-full py-3">
              {busy && ph <= PH.GEN ? <><Spin />{PH_MSG[ph]}</> : "Generate component"}
            </Btn>

            {/* Pipeline progress */}
            {pipe && <Pipeline steps={pipe.steps} activeIdx={pipe.activeIdx} elapsed={elapsed} error={pipe.error} done={pipe.done} />}
          </>
        )}

        {/* ═══ TEMPLATES ═══ */}
        {tab === "tpl" && (
          <Card>
            <Lab>High-fidelity templates</Lab>
            <p className="text-[11px] text-neutral-400 mb-3">Click to load → generates with full anti-slop constraints</p>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setBrief(t.brief); setTab("gen"); }}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{t.name}</span>
                    <Tag>{t.cat}</Tag>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{t.brief.substring(0, 120)}...</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* ═══ SEARCH ═══ */}
        {tab === "srch" && (
          <Card>
            <Lab sub="— web search for real design references">Design reference search</Lab>
            <div className="flex gap-2 mb-3">
              <Input value={sq} onChange={(e) => setSq(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="best SaaS hero sections 2026, brutalist design examples..." className="flex-1" />
              <Btn sm primary onClick={search} disabled={busy}>{ph === PH.SRCH ? <Spin /> : "Search"}</Btn>
            </div>
            {srch.length > 0 && (
              <div className="space-y-2">
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

        {/* ═══ Pipeline (global — shows for any operation) ═══ */}
        {pipe && tab !== "gen" && <Pipeline steps={pipe.steps} activeIdx={pipe.activeIdx} elapsed={elapsed} error={pipe.error} done={pipe.done} />}

        {/* ═══ ERROR ═══ */}
        {err && (
          <div className="px-3 py-2.5 text-sm rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">{err}</div>
        )}

        {/* ═══ OUTPUT ═══ */}
        {code && (
          <>
            {/* Code */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <Lab>Generated component</Lab>
                <div className="flex gap-1.5">
                  <Btn sm onClick={copy}>{cp ? "Copied!" : "Copy"}</Btn>
                  <Btn sm onClick={dl}>Download</Btn>
                  <Btn sm primary onClick={audit} disabled={busy}>{ph === PH.AUD ? <><Spin />Auditing...</> : "Run audit"}</Btn>
                </div>
              </div>
              <pre className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 overflow-auto max-h-[400px] text-[11px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-mono whitespace-pre-wrap break-words">
                {code}
              </pre>
              <p className="text-[11px] text-neutral-400 mt-2">
                {tier === "top5" ? "🏆 Top 5%" : "Pro"} · {code.length} chars · {new Date().toLocaleTimeString()}
              </p>
            </Card>

            {/* Iterate */}
            <Card>
              <Lab>Iterate</Lab>
              <div className="flex gap-2">
                <Input value={iter} onChange={(e) => setIter(e.target.value)} onKeyDown={(e) => e.key === "Enter" && refine()} placeholder="Make heading larger, add hover glow, change to warm palette..." className="flex-1" />
                <Btn sm primary onClick={refine} disabled={busy}>{ph === PH.ITER ? <Spin /> : "Refine"}</Btn>
              </div>
            </Card>

            {/* Audit */}
            {aud && (
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <Lab>Quality audit</Lab>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{aud.score}</span>
                    <Tag color={aud.score >= 80 ? "green" : aud.score >= 60 ? "amber" : "red"}>{aud.grade}</Tag>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {aud.findings?.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs py-0.5">
                      <span className={`mt-0.5 shrink-0 ${f.status === "pass" ? "text-emerald-500" : f.status === "fail" ? "text-red-500" : "text-amber-500"}`}>
                        {f.status === "pass" ? "✓" : f.status === "fail" ? "✗" : "⚠"}
                      </span>
                      <div>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{f.rule}</span>
                        <span className="text-neutral-500 ml-1.5">{f.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tokens */}
                {aud.tokens && (
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                    <p className="text-[10px] font-medium text-neutral-500 mb-2">Extracted design tokens</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[10px] text-neutral-400 mb-1">Fonts</p>
                        <div className="flex flex-wrap gap-1">
                          {aud.tokens.fonts?.map((f, i) => (
                            <Tag key={i} color={SLOP.fonts.some((s) => f.includes(s)) ? "red" : "green"}>{f}</Tag>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 mb-1">Colors</p>
                        <div className="flex flex-wrap gap-1">
                          {aud.tokens.colors?.slice(0, 6).map((c, i) => (
                            <span key={i} className="inline-block w-5 h-5 rounded border border-neutral-200 dark:border-neutral-700" style={{ backgroundColor: c }} title={c} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 mb-1">Icons</p>
                        <Tag color={SLOP.icons.some((s) => aud.tokens.icons?.includes(s)) ? "red" : "green"}>
                          {aud.tokens.icons || "none"}
                        </Tag>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions → iterate */}
                {aud.suggestions?.length > 0 && (
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                    <p className="text-[10px] font-medium text-neutral-500 mb-1.5">Click to apply improvement</p>
                    {aud.suggestions.map((s, i) => (
                      <button key={i} onClick={() => setIter(s)} className="block w-full text-left text-xs text-neutral-600 dark:text-neutral-400 py-1 hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer">
                        → {s}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* History */}
            {hist.length > 1 && (
              <Card>
                <Lab>Version history</Lab>
                <div className="space-y-1">
                  {hist.map((h, i) => (
                    <button
                      key={h.ts}
                      onClick={() => { setCode(h.code); setAud(null); }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                        code === h.code
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span className="font-medium">v{hist.length - i}</span>
                      <span className="ml-2">{h.brief.substring(0, 50)}</span>
                      <span className="ml-2 text-neutral-400">{new Date(h.ts).toLocaleTimeString()}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}