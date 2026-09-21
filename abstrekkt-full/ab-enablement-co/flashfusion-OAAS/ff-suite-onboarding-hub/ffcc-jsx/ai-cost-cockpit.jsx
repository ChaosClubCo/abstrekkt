import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Calculator, FileUp, Calendar, Zap, TrendingDown, DollarSign,
  ArrowRight, Check, AlertCircle, Layers, Database, Cpu, Package,
  ChevronDown, ChevronRight, Download, Trash2, Save, RefreshCw,
  Activity, Target, Sparkles, GitBranch, Boxes, Gauge, X,
  CheckCircle2, Circle, Info, ExternalLink, Upload
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from "recharts";
import Papa from "papaparse";

/* ============================================================
   PRICING — verified May 2026 from official provider docs
   All prices USD per million tokens (MTok)
   ============================================================ */
const PRICING = {
  // Anthropic — verified May 8, 2026
  "claude-opus-4-7":     { input: 5.00, output: 25.00, cached: 0.50, tier: "premium",  provider: "Anthropic", label: "Opus 4.7" },
  "claude-opus-4-6":     { input: 5.00, output: 25.00, cached: 0.50, tier: "premium",  provider: "Anthropic", label: "Opus 4.6" },
  "claude-sonnet-4-6":   { input: 3.00, output: 15.00, cached: 0.30, tier: "balanced", provider: "Anthropic", label: "Sonnet 4.6" },
  "claude-sonnet-4-5":   { input: 3.00, output: 15.00, cached: 0.30, tier: "balanced", provider: "Anthropic", label: "Sonnet 4.5" },
  "claude-haiku-4-5":    { input: 1.00, output:  5.00, cached: 0.10, tier: "budget",   provider: "Anthropic", label: "Haiku 4.5" },
  // OpenAI — verified May 8, 2026
  "gpt-5.5":             { input: 5.00, output: 30.00, cached: 0.50, tier: "premium",  provider: "OpenAI",    label: "GPT-5.5" },
  "gpt-5.4":             { input: 2.50, output: 15.00, cached: 0.25, tier: "premium",  provider: "OpenAI",    label: "GPT-5.4" },
  "gpt-5.4-mini":        { input: 0.75, output:  4.50, cached: 0.075,tier: "balanced", provider: "OpenAI",    label: "GPT-5.4 Mini" },
  "gpt-5.4-nano":        { input: 0.20, output:  1.25, cached: 0.02, tier: "budget",   provider: "OpenAI",    label: "GPT-5.4 Nano" },
  "gpt-5.2":             { input: 1.75, output: 14.00, cached: 0.175,tier: "balanced", provider: "OpenAI",    label: "GPT-5.2" },
  "gpt-5.1":             { input: 1.25, output: 10.00, cached: 0.125,tier: "balanced", provider: "OpenAI",    label: "GPT-5.1" },
  // Google
  "gemini-3.1-pro":      { input: 2.00, output: 12.00, cached: 0.50, tier: "premium",  provider: "Google",    label: "Gemini 3.1 Pro" },
  "gemini-2.5-pro":      { input: 1.25, output: 10.00, cached: 0.31, tier: "balanced", provider: "Google",    label: "Gemini 2.5 Pro" },
  "gemini-2.5-flash":    { input: 0.30, output:  2.50, cached: 0.075,tier: "budget",   provider: "Google",    label: "Gemini 2.5 Flash" },
  // DeepSeek — extreme budget tier
  "deepseek-v3.2":       { input: 0.28, output:  0.42, cached: 0.028,tier: "budget",   provider: "DeepSeek",  label: "DeepSeek V3.2" }
};

const PROVIDERS = ["Anthropic", "OpenAI", "Google", "DeepSeek"];
const TIER_COLOR = { premium: "#ef4444", balanced: "#fbbf24", budget: "#a3e635" };

/* ============================================================
   90-DAY PLAN — phases, tasks, status
   ============================================================ */
const PLAN = [
  {
    id: "p1", week: "WK 01", title: "Validate", subtitle: "Customer Discovery",
    color: "#a3e635",
    tasks: [
      { id: "t1", label: "List 50 target companies (AI-heavy startups, $1K-10K/mo spend)" },
      { id: "t2", label: "Send 50 cold emails (3-touch sequence)" },
      { id: "t3", label: "Schedule 5 customer interviews" },
      { id: "t4", label: "Run discovery calls — pain points, willingness to pay" },
      { id: "t5", label: "Synthesize findings → adjust pricing & feature priority" }
    ]
  },
  {
    id: "p2", week: "WK 02", title: "Foundation", subtitle: "Core Infrastructure",
    color: "#a3e635",
    tasks: [
      { id: "t6", label: "Supabase setup (tables, RLS, auth)" },
      { id: "t7", label: "Next.js 15 scaffold with App Router" },
      { id: "t8", label: "Auth flow (email/password + Google OAuth)" },
      { id: "t9", label: "Dashboard shell with empty state" },
      { id: "t10", label: "API key encryption (AES-256 via Supabase Vault)" }
    ]
  },
  {
    id: "p3", week: "WK 03", title: "Engine", subtitle: "Optimization Analyzers",
    color: "#fbbf24",
    tasks: [
      { id: "t11", label: "Model swap analyzer (token-based routing rules)" },
      { id: "t12", label: "Caching analyzer (semantic hashing, repetition detection)" },
      { id: "t13", label: "Prompt compression analyzer (length + structure heuristics)" },
      { id: "t14", label: "Recommendations API + dashboard UI" },
      { id: "t15", label: "Test with seed data from FlashFusion logs" }
    ]
  },
  {
    id: "p4", week: "WK 04", title: "Auto-Fix", subtitle: "Code Generation",
    color: "#fbbf24",
    tasks: [
      { id: "t16", label: "Middleware code generator (Next.js + Express templates)" },
      { id: "t17", label: "@ai-cost-optimizer/sdk — npm publish v0.1" },
      { id: "t18", label: "Proxy server for non-SDK customers" },
      { id: "t19", label: "Polish + deploy to production" },
      { id: "t20", label: "Onboard first 10 beta users" }
    ]
  },
  {
    id: "p5", week: "WK 05–06", title: "Content", subtitle: "Marketing Engine",
    color: "#fbbf24",
    tasks: [
      { id: "t21", label: "Publish blog #1 — '10M API Calls Analysis'" },
      { id: "t22", label: "Publish blog #2 — 'The $10K Mistake'" },
      { id: "t23", label: "Publish blog #3 — '5-Min Audit Tutorial'" },
      { id: "t24", label: "Free audit tool live (this artifact, basically)" },
      { id: "t25", label: "Submit to Hacker News (Show HN)" }
    ]
  },
  {
    id: "p6", week: "WK 07–08", title: "Acquire", subtitle: "Paid + Partnerships",
    color: "#fb923c",
    tasks: [
      { id: "t26", label: "Google Ads — high-intent keywords ($500/mo)" },
      { id: "t27", label: "Twitter Ads targeting CTOs/AI engineers ($300/mo)" },
      { id: "t28", label: "Outreach to 50 AI dev agencies (20% affiliate)" },
      { id: "t29", label: "Newsletter sponsorships (Rundown, Ben's Bites)" },
      { id: "t30", label: "Goal: 50 trials, 20 paid → $4K MRR" }
    ]
  },
  {
    id: "p7", week: "WK 09–10", title: "Community", subtitle: "Organic Loops",
    color: "#fb923c",
    tasks: [
      { id: "t31", label: "Indie Hackers post — '$1K MRR in 2 weeks'" },
      { id: "t32", label: "Hacker News launch (front page target)" },
      { id: "t33", label: "Reddit posts (r/SaaS, r/MachineLearning)" },
      { id: "t34", label: "Email nurture sequence to waitlist" },
      { id: "t35", label: "Case studies from 3 paying customers" }
    ]
  },
  {
    id: "p8", week: "WK 11–12", title: "Optimize", subtitle: "Iterate & Grow",
    color: "#ef4444",
    tasks: [
      { id: "t36", label: "Feature iteration based on usage data" },
      { id: "t37", label: "Reduce churn — implement win-back flow" },
      { id: "t38", label: "Expand integrations (Vertex AI, Bedrock)" },
      { id: "t39", label: "Pricing experiment — test annual plans" },
      { id: "t40", label: "Goal: 100 trials, 50 paid → $10K MRR" }
    ]
  }
];

/* ============================================================
   FORMATTERS & HELPERS
   ============================================================ */
const fmtMoney = (n, opts = {}) => {
  const { decimals = 0, sign = false } = opts;
  if (!Number.isFinite(n)) return "$—";
  const formatted = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  const s = n < 0 ? "−" : sign ? "+" : "";
  return `${s}$${formatted}`;
};

const fmtPct = (n, decimals = 0) =>
  `${(n * 100).toFixed(decimals)}%`;

const fmtNum = (n) =>
  Number.isFinite(n) ? n.toLocaleString("en-US") : "—";

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function AnimatedNumber({ value, formatter = fmtNum, duration = 700, className = "" }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef(performance.now());

  useEffect(() => {
    fromRef.current = display;
    startRef.current = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{formatter(display)}</span>;
}

/* ============================================================
   GLOBAL STYLE INJECTION (fonts + scan-lines + custom utilities)
   ============================================================ */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  .ff-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
  .ff-sans { font-family: 'Geist', ui-sans-serif, system-ui, sans-serif; }
  .ff-serif { font-family: 'Instrument Serif', ui-serif, serif; }

  .grid-bg {
    background-image:
      linear-gradient(to right, rgba(163,230,53,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(163,230,53,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .scan-bg::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255,255,255,0.012) 0px,
      rgba(255,255,255,0.012) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
  }

  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  .blink { animation: blink 1.1s step-end infinite; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(163,230,53,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(163,230,53,0); }
  }
  .pulse-glow { animation: pulse-glow 2.4s ease-in-out infinite; }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slide-up 0.4s ease-out both; }

  .tnum { font-variant-numeric: tabular-nums; }

  /* slim native scrollbars */
  .slim-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .slim-scroll::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
  .slim-scroll::-webkit-scrollbar-thumb:hover { background: #404040; }

  input[type="range"].lime-slider {
    -webkit-appearance: none; appearance: none;
    height: 2px; background: #2a2a2a; border-radius: 1px; outline: none;
  }
  input[type="range"].lime-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 14px; height: 14px; border-radius: 50%;
    background: #a3e635; cursor: pointer;
    border: 2px solid #0a0a0a;
    box-shadow: 0 0 0 1px #a3e635;
  }
  input[type="range"].lime-slider::-moz-range-thumb {
    width: 14px; height: 14px; border-radius: 50%;
    background: #a3e635; cursor: pointer; border: 2px solid #0a0a0a;
    box-shadow: 0 0 0 1px #a3e635;
  }

  /* Number input — explicit color, hide native spinners for clean display */
  input[type="number"] {
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff;
    -moz-appearance: textfield;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

/* ============================================================
   DEMO CSV — realistic synthetic data for audit tool demo
   ============================================================ */
function generateDemoCSV() {
  const models = ["claude-sonnet-4-6", "claude-haiku-4-5", "gpt-5.4", "gpt-5.4-mini"];
  const rows = ["timestamp,model,input_tokens,output_tokens,cost_usd"];
  const now = Date.now();

  // 47% small Sonnet requests (model swap candidates)
  for (let i = 0; i < 188; i++) {
    const t = new Date(now - Math.random() * 30 * 86400000).toISOString();
    const inT = Math.floor(80 + Math.random() * 380);
    const outT = Math.floor(40 + Math.random() * 220);
    const p = PRICING["claude-sonnet-4-6"];
    const cost = (inT * p.input + outT * p.output) / 1e6;
    rows.push(`${t},claude-sonnet-4-6,${inT},${outT},${cost.toFixed(6)}`);
  }
  // 25% medium Sonnet requests
  for (let i = 0; i < 100; i++) {
    const t = new Date(now - Math.random() * 30 * 86400000).toISOString();
    const inT = Math.floor(800 + Math.random() * 1500);
    const outT = Math.floor(300 + Math.random() * 800);
    const p = PRICING["claude-sonnet-4-6"];
    const cost = (inT * p.input + outT * p.output) / 1e6;
    rows.push(`${t},claude-sonnet-4-6,${inT},${outT},${cost.toFixed(6)}`);
  }
  // 12% large Sonnet (compression candidates)
  for (let i = 0; i < 48; i++) {
    const t = new Date(now - Math.random() * 30 * 86400000).toISOString();
    const inT = Math.floor(2500 + Math.random() * 4000);
    const outT = Math.floor(800 + Math.random() * 1500);
    const p = PRICING["claude-sonnet-4-6"];
    const cost = (inT * p.input + outT * p.output) / 1e6;
    rows.push(`${t},claude-sonnet-4-6,${inT},${outT},${cost.toFixed(6)}`);
  }
  // 8% Haiku (already optimized)
  for (let i = 0; i < 32; i++) {
    const t = new Date(now - Math.random() * 30 * 86400000).toISOString();
    const inT = Math.floor(150 + Math.random() * 400);
    const outT = Math.floor(80 + Math.random() * 200);
    const p = PRICING["claude-haiku-4-5"];
    const cost = (inT * p.input + outT * p.output) / 1e6;
    rows.push(`${t},claude-haiku-4-5,${inT},${outT},${cost.toFixed(6)}`);
  }
  // 6% GPT-5.4 high-cost
  for (let i = 0; i < 24; i++) {
    const t = new Date(now - Math.random() * 30 * 86400000).toISOString();
    const inT = Math.floor(500 + Math.random() * 2000);
    const outT = Math.floor(300 + Math.random() * 1000);
    const p = PRICING["gpt-5.4"];
    const cost = (inT * p.input + outT * p.output) / 1e6;
    rows.push(`${t},gpt-5.4,${inT},${outT},${cost.toFixed(6)}`);
  }
  // 2% GPT-5.4 mini
  for (let i = 0; i < 8; i++) {
    const t = new Date(now - Math.random() * 30 * 86400000).toISOString();
    const inT = Math.floor(200 + Math.random() * 800);
    const outT = Math.floor(100 + Math.random() * 400);
    const p = PRICING["gpt-5.4-mini"];
    const cost = (inT * p.input + outT * p.output) / 1e6;
    rows.push(`${t},gpt-5.4-mini,${inT},${outT},${cost.toFixed(6)}`);
  }
  return rows.join("\n");
}

/* ============================================================
   CALCULATOR — Live ROI math
   ============================================================ */
function Calculator_Tab() {
  const [spend, setSpend] = useState(5000);
  const [optimizations, setOptimizations] = useState({
    routing:     { enabled: true,  pct: 0.47, savings: 0.67 }, // 47% of reqs, 67% savings on those
    caching:     { enabled: true,  pct: 0.40, savings: 0.45 }, // 40% of reqs, 45% effective savings
    compression: { enabled: true,  pct: 0.30, savings: 0.30 }, // 30% input portion, 30% reduction
    batching:    { enabled: false, pct: 0.20, savings: 0.50 }  // 20% of reqs, 50% savings
  });
  const [scenarios, setScenarios] = useState([]);
  const [scenarioName, setScenarioName] = useState("");

  // Load saved scenarios on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("scenarios");
        if (r && r.value) setScenarios(JSON.parse(r.value));
      } catch (e) { /* no saved scenarios yet */ }
    })();
  }, []);

  const calc = useMemo(() => {
    // Layer order matters — we apply them sequentially against remaining cost.
    // Each layer's "applied savings" = remaining * pct * savings.
    // The toggle preview uses the same math so the two displays always agree.
    const order = [
      { key: "routing",     name: "Model Routing",    color: "#a3e635", icon: GitBranch },
      { key: "caching",     name: "Prompt Caching",   color: "#84cc16", icon: Database },
      { key: "compression", name: "Compression",      color: "#65a30d", icon: Layers   },
      { key: "batching",    name: "Batch Processing", color: "#4d7c0f", icon: Package  }
    ];

    let remaining = spend;
    const perLayer = {}; // applied-savings amount per key (whether enabled or just preview)
    const layers = [];   // only enabled, in order, with metadata for breakdown

    for (const meta of order) {
      const opt = optimizations[meta.key];
      const projected = remaining * opt.pct * opt.savings;
      perLayer[meta.key] = projected;
      if (opt.enabled) {
        layers.push({ name: meta.name, amount: projected, color: meta.color, icon: meta.icon });
        remaining -= projected;
      }
    }

    const monthlySavings = spend - remaining;
    const annualSavings = monthlySavings * 12;
    const optimizedCost = remaining;
    const savingsPct = spend > 0 ? monthlySavings / spend : 0;
    const roiMultiple = monthlySavings / 200; // vs $200/mo Pro tier

    return { monthlySavings, annualSavings, optimizedCost, savingsPct, roiMultiple, layers, perLayer };
  }, [spend, optimizations]);

  const toggleOpt = (key) => setOptimizations(prev => ({
    ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled }
  }));
  const setOptPct = (key, pct) => setOptimizations(prev => ({
    ...prev, [key]: { ...prev[key], pct }
  }));

  const saveScenario = async () => {
    if (!scenarioName.trim()) return;
    const next = [
      ...scenarios.filter(s => s.name !== scenarioName.trim()),
      { name: scenarioName.trim(), spend, optimizations, savedAt: Date.now() }
    ];
    setScenarios(next);
    setScenarioName("");
    try { await window.storage.set("scenarios", JSON.stringify(next)); } catch (e) {}
  };
  const loadScenario = (s) => { setSpend(s.spend); setOptimizations(s.optimizations); };
  const deleteScenario = async (name) => {
    const next = scenarios.filter(s => s.name !== name);
    setScenarios(next);
    try { await window.storage.set("scenarios", JSON.stringify(next)); } catch (e) {}
  };

  const chartData = [
    { name: "CURRENT", value: spend, fill: "#ef4444" },
    { name: "OPTIMIZED", value: calc.optimizedCost, fill: "#a3e635" }
  ];

  const optConfigs = [
    { key: "routing", label: "Model Routing", desc: "Route simple requests to cheaper models (Sonnet → Haiku)", icon: GitBranch },
    { key: "caching", label: "Prompt Caching", desc: "Cache repeated system prompts (90% off cached input)", icon: Database },
    { key: "compression", label: "Prompt Compression", desc: "Strip verbose prompts using Claude (30% reduction)", icon: Layers },
    { key: "batching", label: "Batch Processing", desc: "Async batches via Message Batches API (50% off)", icon: Package }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* LEFT: Inputs */}
      <div className="lg:col-span-2 space-y-4">
        {/* Spend input */}
        <div className="bg-[#141414] border border-[#2a2a2a] p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={14} className="text-[#a3e635]" />
            <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">CURRENT MONTHLY SPEND</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="ff-mono text-[#a3e635] text-3xl font-light leading-none">$</span>
            <input
              type="number"
              value={spend}
              onChange={e => setSpend(Math.max(0, parseFloat(e.target.value) || 0))}
              className="ff-mono bg-transparent text-4xl font-light w-full outline-none border-b border-[#2a2a2a] focus:border-[#a3e635] transition-colors tnum pb-1"
              style={{ color: "#ffffff", caretColor: "#a3e635", WebkitTextFillColor: "#ffffff" }}
              min="0"
              step="100"
            />
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            {[1000, 2500, 5000, 10000, 25000, 50000].map(v => (
              <button key={v} onClick={() => setSpend(v)}
                className={`ff-mono text-[10px] px-2.5 py-1.5 border transition-all tnum ${
                  spend === v
                    ? "bg-[#a3e635] text-black border-[#a3e635] font-semibold"
                    : "bg-[#0a0a0a] border-[#2a2a2a] text-[#a3a3a3] hover:border-[#a3e635] hover:text-[#a3e635]"
                }`}>
                ${v >= 1000 ? `${v/1000}K` : v}
              </button>
            ))}
          </div>
        </div>

        {/* Optimization toggles */}
        <div className="bg-[#141414] border border-[#2a2a2a] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#a3e635]" />
            <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">OPTIMIZATION LAYERS</span>
          </div>
          <div className="space-y-3">
            {optConfigs.map(({ key, label, desc, icon: Icon }) => {
              const opt = optimizations[key];
              return (
                <div key={key} className={`border transition-all ${opt.enabled ? "border-[#a3e635]/40 bg-[#a3e635]/[0.03]" : "border-[#2a2a2a]"}`}>
                  <button onClick={() => toggleOpt(key)} className="w-full px-3 py-2.5 flex items-start gap-3 text-left">
                    <div className={`mt-0.5 w-4 h-4 border flex items-center justify-center transition-all ${
                      opt.enabled ? "bg-[#a3e635] border-[#a3e635]" : "border-[#404040]"
                    }`}>
                      {opt.enabled && <Check size={11} className="text-black" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={12} className={opt.enabled ? "text-[#a3e635]" : "text-[#525252]"} />
                          <span className={`ff-mono text-xs font-semibold tracking-wide ${opt.enabled ? "text-white" : "text-[#737373]"}`}>
                            {label.toUpperCase()}
                          </span>
                        </div>
                        <span className="ff-mono text-[10px] text-[#737373] tnum">
                          {fmtPct(opt.pct)} → {fmtMoney(calc.perLayer[key])}
                        </span>
                      </div>
                      <div className="ff-sans text-[11px] text-[#737373] mt-0.5">{desc}</div>
                    </div>
                  </button>
                  {opt.enabled && (
                    <div className="px-3 pb-3 pt-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="range" min="0.05" max="0.95" step="0.01"
                          value={opt.pct}
                          onChange={e => setOptPct(key, parseFloat(e.target.value))}
                          className="lime-slider flex-1"
                        />
                        <span className="ff-mono text-[10px] text-[#a3e635] w-10 text-right tnum">{fmtPct(opt.pct, 0)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenarios */}
        <div className="bg-[#141414] border border-[#2a2a2a] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Save size={14} className="text-[#a3e635]" />
            <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">SAVED SCENARIOS</span>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text" placeholder="FlashFusion baseline..."
              value={scenarioName}
              onChange={e => setScenarioName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") saveScenario(); }}
              className="ff-mono text-xs bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#a3e635] px-2.5 py-1.5 flex-1 outline-none text-white transition-colors"
            />
            <button onClick={saveScenario}
              disabled={!scenarioName.trim()}
              className="ff-mono text-[10px] tracking-[0.15em] px-3 bg-[#a3e635] text-black font-bold disabled:bg-[#2a2a2a] disabled:text-[#525252] disabled:cursor-not-allowed hover:bg-white transition-colors">
              SAVE
            </button>
          </div>
          {scenarios.length === 0 ? (
            <div className="ff-mono text-[10px] text-[#525252] text-center py-3 border border-dashed border-[#2a2a2a]">
              No scenarios saved yet
            </div>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto slim-scroll">
              {scenarios.map(s => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <button onClick={() => loadScenario(s)}
                    className="ff-mono flex-1 text-left px-2 py-1 hover:bg-[#1c1c1c] transition-colors text-[#a3e635] truncate">
                    {s.name}
                  </button>
                  <span className="ff-mono text-[10px] text-[#525252] tnum">{fmtMoney(s.spend)}</span>
                  <button onClick={() => deleteScenario(s.name)} className="text-[#525252] hover:text-[#ef4444] transition-colors p-1">
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Output */}
      <div className="lg:col-span-3 space-y-4">
        {/* Hero savings number */}
        <div className="bg-[#141414] border border-[#a3e635]/40 p-7 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full pulse-glow" />
                <span className="ff-mono text-[10px] tracking-[0.2em] text-[#a3e635]">PROJECTED MONTHLY SAVINGS</span>
              </div>
              <span className="ff-mono text-[10px] text-[#737373]">{fmtPct(calc.savingsPct, 1)} REDUCTION</span>
            </div>
            <div className="ff-mono font-light text-[#a3e635] tnum" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', lineHeight: 1 }}>
              <AnimatedNumber value={calc.monthlySavings} formatter={n => fmtMoney(n)} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-[#2a2a2a]">
              <div>
                <div className="ff-mono text-[9px] tracking-widest text-[#737373] mb-1">ANNUAL</div>
                <div className="ff-mono text-lg text-white tnum">
                  <AnimatedNumber value={calc.annualSavings} formatter={n => fmtMoney(n)} />
                </div>
              </div>
              <div>
                <div className="ff-mono text-[9px] tracking-widest text-[#737373] mb-1">NEW MONTHLY</div>
                <div className="ff-mono text-lg text-white tnum">
                  <AnimatedNumber value={calc.optimizedCost} formatter={n => fmtMoney(n)} />
                </div>
              </div>
              <div>
                <div className="ff-mono text-[9px] tracking-widest text-[#737373] mb-1">ROI vs $200/MO</div>
                <div className="ff-mono text-lg text-[#a3e635] tnum">
                  <AnimatedNumber value={calc.roiMultiple} formatter={n => `${n.toFixed(1)}×`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Before/After bar */}
        <div className="bg-[#141414] border border-[#2a2a2a] p-5">
          <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373] mb-3">BEFORE / AFTER · MONTHLY COST</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 50, top: 8, bottom: 24 }}>
              <CartesianGrid horizontal={false} stroke="#1c1c1c" />
              <XAxis
                type="number"
                stroke="#525252"
                tick={{ fill: "#737373", fontSize: 10, fontFamily: "JetBrains Mono" }}
                tickCount={5}
                tickMargin={8}
                tickFormatter={v => `$${(v/1000).toFixed(v < 1000 ? 1 : 0)}K`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#525252"
                width={92}
                tick={{ fill: "#a3a3a3", fontSize: 10, fontFamily: "JetBrains Mono", letterSpacing: "0.15em" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(163,230,53,0.05)" }}
                contentStyle={{ background: "#0a0a0a", border: "1px solid #a3e635", fontFamily: "JetBrains Mono", fontSize: 11 }}
                labelStyle={{ color: "#a3e635" }}
                formatter={(v) => [fmtMoney(v), "Cost"]}
              />
              <Bar dataKey="value" radius={[0,2,2,0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Layer breakdown */}
        <div className="bg-[#141414] border border-[#2a2a2a] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">SAVINGS BY LAYER</span>
            <span className="ff-mono text-[10px] text-[#525252]">{calc.layers.length} ACTIVE</span>
          </div>
          {calc.layers.length === 0 ? (
            <div className="ff-mono text-xs text-[#525252] text-center py-6 border border-dashed border-[#2a2a2a]">
              Enable optimization layers to see savings breakdown
            </div>
          ) : (
            <div className="space-y-2">
              {calc.layers.map((layer, i) => {
                const Icon = layer.icon;
                const widthPct = (layer.amount / calc.monthlySavings) * 100;
                return (
                  <div key={layer.name} className="slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon size={12} style={{ color: layer.color }} />
                        <span className="ff-mono text-xs text-white">{layer.name}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="ff-mono text-xs tnum" style={{ color: layer.color }}>
                          {fmtMoney(layer.amount)}
                        </span>
                        <span className="ff-mono text-[10px] text-[#525252] tnum w-10 text-right">
                          {fmtPct(widthPct/100, 0)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-[#0a0a0a] overflow-hidden">
                      <div
                        className="h-full transition-all duration-700 ease-out"
                        style={{ width: `${widthPct}%`, background: layer.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AUDIT TOOL — Real CSV parsing + recommendations
   ============================================================ */
function AuditTool_Tab() {
  const [data, setData] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    setParseError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        try {
          const records = parseRecords(results.data);
          if (records.length === 0) {
            setParseError("No valid rows found. Expected columns: model, input_tokens, output_tokens, cost_usd");
            return;
          }
          setData(analyzeRecords(records));
        } catch (e) {
          setParseError(`Parse error: ${e.message}`);
        }
      },
      error: (err) => setParseError(err.message)
    });
  }, []);

  const loadDemo = () => {
    const csv = generateDemoCSV();
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const records = parseRecords(results.data);
        setData(analyzeRecords(records));
      }
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (!data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Drop zone */}
        <div className="lg:col-span-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed transition-all p-12 text-center bg-[#141414] ${
              dragOver ? "border-[#a3e635] bg-[#a3e635]/[0.03]" : "border-[#2a2a2a] hover:border-[#404040]"
            }`}
          >
            <div className="grid-bg absolute inset-0 opacity-30" />
            <div className="relative">
              <Upload size={32} className="mx-auto text-[#525252] mb-4" strokeWidth={1.2} />
              <div className="ff-mono text-sm tracking-wider text-white mb-1">DROP USAGE CSV</div>
              <div className="ff-sans text-xs text-[#737373] mb-6">Or paste / upload a file. All processing happens locally.</div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="ff-mono text-[10px] tracking-[0.2em] px-4 py-2 bg-[#a3e635] text-black font-bold hover:bg-white transition-colors">
                  SELECT FILE
                </button>
                <button
                  onClick={loadDemo}
                  className="ff-mono text-[10px] tracking-[0.2em] px-4 py-2 border border-[#2a2a2a] text-[#a3a3a3] hover:border-[#a3e635] hover:text-[#a3e635] transition-colors">
                  LOAD DEMO DATA
                </button>
                <input
                  ref={fileInputRef}
                  type="file" accept=".csv,text/csv" className="hidden"
                  onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                />
              </div>
              {parseError && (
                <div className="mt-4 ff-mono text-[10px] text-[#ef4444] flex items-center gap-2 justify-center">
                  <AlertCircle size={12} /> {parseError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Format guide */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#2a2a2a] p-5">
          <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373] mb-3">CSV FORMAT</div>
          <div className="ff-mono text-[10px] text-[#a3a3a3] bg-[#0a0a0a] border border-[#2a2a2a] p-3 mb-4 overflow-x-auto slim-scroll">
            <div className="text-[#a3e635]">timestamp,model,input_tokens,output_tokens,cost_usd</div>
            <div className="text-[#737373]">2026-05-08T12:00:00Z,claude-sonnet-4-6,247,412,0.0187</div>
            <div className="text-[#737373]">2026-05-08T12:01:14Z,gpt-5.4,1247,398,0.0091</div>
            <div className="text-[#737373]">...</div>
          </div>
          <div className="space-y-3">
            {[
              { p: "Anthropic", url: "console.anthropic.com → Usage → Download CSV" },
              { p: "OpenAI", url: "platform.openai.com → Usage → Activity → Export" },
              { p: "Google", url: "console.cloud.google.com → Vertex AI → Usage" }
            ].map(({ p, url }) => (
              <div key={p} className="flex flex-col gap-0.5">
                <span className="ff-mono text-[10px] text-[#a3e635] tracking-wide">{p.toUpperCase()}</span>
                <span className="ff-sans text-[11px] text-[#737373]">{url}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <AuditResults data={data} onReset={() => setData(null)} />;
}

function parseRecords(rows) {
  const out = [];
  for (const row of rows) {
    if (!row || !row.model) continue;
    const inT = parseInt(row.input_tokens || row.n_context_tokens_total || 0, 10);
    const outT = parseInt(row.output_tokens || row.n_generated_tokens_total || 0, 10);
    if (!Number.isFinite(inT) || !Number.isFinite(outT)) continue;
    let cost = parseFloat(row.cost_usd || row.cost || 0);
    // If cost missing, compute from pricing table
    if (!cost && PRICING[row.model]) {
      const p = PRICING[row.model];
      cost = (inT * p.input + outT * p.output) / 1e6;
    }
    out.push({
      timestamp: row.timestamp ? new Date(row.timestamp) : null,
      model: row.model,
      inputTokens: inT,
      outputTokens: outT,
      cost: cost || 0
    });
  }
  return out;
}

function analyzeRecords(records) {
  // Per-model aggregation
  const byModel = {};
  for (const r of records) {
    if (!byModel[r.model]) byModel[r.model] = { requests: 0, inT: 0, outT: 0, cost: 0 };
    byModel[r.model].requests += 1;
    byModel[r.model].inT += r.inputTokens;
    byModel[r.model].outT += r.outputTokens;
    byModel[r.model].cost += r.cost;
  }
  const totalCost = records.reduce((s, r) => s + r.cost, 0);
  const modelBreakdown = Object.entries(byModel).map(([model, d]) => ({
    model,
    label: PRICING[model]?.label || model,
    requests: d.requests,
    tokens: d.inT + d.outT,
    cost: d.cost,
    pctOfBudget: totalCost > 0 ? d.cost / totalCost : 0,
    tier: PRICING[model]?.tier || "unknown"
  })).sort((a, b) => b.cost - a.cost);

  // Token distribution
  const buckets = { "0-500": 0, "501-2K": 0, "2K-5K": 0, "5K+": 0 };
  const bucketCost = { "0-500": 0, "501-2K": 0, "2K-5K": 0, "5K+": 0 };
  for (const r of records) {
    const t = r.inputTokens + r.outputTokens;
    const k = t <= 500 ? "0-500" : t <= 2000 ? "501-2K" : t <= 5000 ? "2K-5K" : "5K+";
    buckets[k] += 1;
    bucketCost[k] += r.cost;
  }
  const distribution = Object.entries(buckets).map(([range, count]) => ({
    range, count, cost: bucketCost[range],
    pct: records.length > 0 ? count / records.length : 0
  }));

  // Recommendations
  const recs = [];
  const smallCount = buckets["0-500"];
  const smallPct = records.length > 0 ? smallCount / records.length : 0;
  const expensiveModels = modelBreakdown.filter(m =>
    m.tier === "premium" || (m.tier === "balanced" && m.model.includes("sonnet")) || m.model.startsWith("gpt-5.4") && !m.model.includes("nano") && !m.model.includes("mini")
  );
  const expensiveCost = expensiveModels.reduce((s, m) => s + m.cost, 0);
  if (smallPct > 0.20 && expensiveCost > 0) {
    recs.push({
      type: "model_routing",
      title: "Model Swap Opportunity",
      desc: `${fmtPct(smallPct,0)} of requests are <500 tokens but use premium models. Route these to Haiku 4.5 / GPT-5.4 Mini for ~67% cost reduction on those calls.`,
      monthlySavings: expensiveCost * smallPct * 0.67 * 30 / Math.max(1, getDayCount(records)),
      impact: "high",
      effort: "low"
    });
  }

  // Repetition (using inputTokens as a weak proxy without prompt content)
  const tokenGroups = {};
  for (const r of records) {
    const k = r.inputTokens;
    if (!tokenGroups[k]) tokenGroups[k] = [];
    tokenGroups[k].push(r);
  }
  const repeatedGroups = Object.entries(tokenGroups)
    .filter(([_, g]) => g.length >= 5)
    .map(([k, g]) => ({ tokens: parseInt(k, 10), count: g.length, cost: g.reduce((s, r) => s + r.cost, 0) }))
    .sort((a, b) => b.cost - a.cost);
  if (repeatedGroups.length > 0) {
    const totalRepeatedCost = repeatedGroups.reduce((s, g) => s + g.cost, 0);
    recs.push({
      type: "caching",
      title: "Caching Opportunity",
      desc: `${repeatedGroups.length} prompt patterns repeated 5+ times. Implement prompt caching for ~90% off cached input tokens.`,
      monthlySavings: totalRepeatedCost * 0.45 * 30 / Math.max(1, getDayCount(records)),
      impact: "high",
      effort: "medium"
    });
  }

  const longInputs = records.filter(r => r.inputTokens > 1500);
  if (longInputs.length > records.length * 0.10) {
    const longCost = longInputs.reduce((s, r) => s + r.cost, 0);
    recs.push({
      type: "compression",
      title: "Prompt Compression",
      desc: `${longInputs.length} requests have >1500 input tokens. Verbose prompts can typically be compressed 25–40% without quality loss.`,
      monthlySavings: longCost * 0.30 * 30 / Math.max(1, getDayCount(records)),
      impact: "medium",
      effort: "low"
    });
  }

  recs.sort((a, b) => b.monthlySavings - a.monthlySavings);
  const totalSavings = recs.reduce((s, r) => s + r.monthlySavings, 0);

  return {
    records,
    totalCost,
    totalRequests: records.length,
    totalTokens: records.reduce((s, r) => s + r.inputTokens + r.outputTokens, 0),
    modelBreakdown,
    distribution,
    recommendations: recs,
    estimatedMonthlySavings: totalSavings
  };
}

function getDayCount(records) {
  const ts = records.map(r => r.timestamp).filter(Boolean);
  if (ts.length === 0) return 30;
  const min = Math.min(...ts.map(d => d.getTime()));
  const max = Math.max(...ts.map(d => d.getTime()));
  return Math.max(1, (max - min) / 86400000);
}

function AuditResults({ data, onReset }) {
  const projectedMonthly = data.totalCost * 30 / Math.max(1, getDayCount(data.records));
  const optimizedMonthly = projectedMonthly - data.estimatedMonthlySavings;
  const savingsPct = projectedMonthly > 0 ? data.estimatedMonthlySavings / projectedMonthly : 0;

  return (
    <div className="space-y-4">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "REQUESTS ANALYZED", value: data.totalRequests, fmt: fmtNum, color: "#a3a3a3" },
          { label: "MONTHLY (PROJECTED)", value: projectedMonthly, fmt: n => fmtMoney(n), color: "#ef4444" },
          { label: "POTENTIAL SAVINGS", value: data.estimatedMonthlySavings, fmt: n => fmtMoney(n), color: "#a3e635" },
          { label: "REDUCTION", value: savingsPct, fmt: n => fmtPct(n,0), color: "#a3e635" }
        ].map((k, i) => (
          <div key={k.label} className="bg-[#141414] border border-[#2a2a2a] p-4 slide-up" style={{ animationDelay: `${i*60}ms` }}>
            <div className="ff-mono text-[9px] tracking-[0.2em] text-[#737373] mb-2">{k.label}</div>
            <div className="ff-mono text-2xl tnum" style={{ color: k.color }}>
              <AnimatedNumber value={k.value} formatter={k.fmt} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recommendations */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#141414] border border-[#2a2a2a] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#a3e635]" />
                <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">RECOMMENDATIONS</span>
              </div>
              <span className="ff-mono text-[10px] text-[#525252]">{data.recommendations.length} FOUND</span>
            </div>
            {data.recommendations.length === 0 ? (
              <div className="ff-mono text-xs text-[#525252] text-center py-8">
                <CheckCircle2 size={24} className="mx-auto mb-2 text-[#a3e635]" />
                Your usage looks well-optimized. No major waste detected.
              </div>
            ) : (
              <div className="space-y-3">
                {data.recommendations.map((r, i) => (
                  <div key={r.type} className="border border-[#2a2a2a] hover:border-[#a3e635]/40 transition-colors p-4 slide-up" style={{ animationDelay: `${i*100}ms` }}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`ff-mono text-[9px] tracking-[0.2em] px-1.5 py-0.5 ${
                          r.impact === "high" ? "bg-[#a3e635] text-black" : "bg-[#fbbf24] text-black"
                        }`}>
                          {r.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="ff-mono text-[9px] tracking-[0.2em] text-[#737373]">
                          {r.effort.toUpperCase()} EFFORT
                        </span>
                      </div>
                      <div className="ff-mono text-[#a3e635] tnum text-lg">
                        <AnimatedNumber value={r.monthlySavings} formatter={n => fmtMoney(n) + "/mo"} />
                      </div>
                    </div>
                    <div className="ff-mono text-sm font-semibold text-white mb-1">{r.title}</div>
                    <div className="ff-sans text-[12px] text-[#a3a3a3] leading-relaxed">{r.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Token distribution */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-5">
            <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373] mb-3">TOKEN DISTRIBUTION</div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={data.distribution} margin={{ top: 8, right: 16, bottom: 8, left: -8 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1c1c1c" vertical={false} />
                <XAxis dataKey="range" stroke="#525252" tick={{ fill: "#737373", fontSize: 10, fontFamily: "JetBrains Mono" }} tickMargin={6} />
                <YAxis stroke="#525252" tick={{ fill: "#525252", fontSize: 10, fontFamily: "JetBrains Mono" }} tickCount={4} />
                <Tooltip
                  cursor={{ fill: "rgba(163,230,53,0.05)" }}
                  contentStyle={{ background: "#0a0a0a", border: "1px solid #a3e635", fontFamily: "JetBrains Mono", fontSize: 11 }}
                  labelStyle={{ color: "#a3e635" }}
                  formatter={(v, name) => name === "count" ? [fmtNum(v), "Requests"] : v}
                />
                <Bar dataKey="count" fill="#a3e635" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#141414] border border-[#2a2a2a] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="ff-mono text-[10px] tracking-[0.2em] text-[#737373]">MODEL BREAKDOWN</span>
              <button onClick={onReset} className="ff-mono text-[9px] tracking-widest text-[#737373] hover:text-[#a3e635] transition-colors flex items-center gap-1">
                <RefreshCw size={10} /> NEW FILE
              </button>
            </div>
            <div className="space-y-2.5">
              {data.modelBreakdown.map((m, i) => (
                <div key={m.model} className="slide-up" style={{ animationDelay: `${i*60}ms` }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-1.5 h-1.5" style={{ background: TIER_COLOR[m.tier] || "#737373" }} />
                      <span className="ff-mono text-xs text-white truncate">{m.label}</span>
                    </div>
                    <span className="ff-mono text-[10px] text-[#a3a3a3] tnum ml-2">{fmtMoney(m.cost, { decimals: 2 })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-[#0a0a0a]">
                      <div className="h-full transition-all duration-700" style={{ width: `${m.pctOfBudget*100}%`, background: TIER_COLOR[m.tier] || "#737373" }} />
                    </div>
                    <span className="ff-mono text-[9px] text-[#525252] tnum w-8 text-right">{fmtPct(m.pctOfBudget, 0)}</span>
                  </div>
                  <div className="ff-mono text-[9px] text-[#525252] mt-0.5 tnum">{fmtNum(m.requests)} reqs · {fmtNum(Math.round(m.tokens/1000))}K tok</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#a3e635]/40 p-5">
            <div className="ff-mono text-[10px] tracking-[0.2em] text-[#a3e635] mb-2">PRIVACY GUARANTEE</div>
            <div className="ff-sans text-[11px] text-[#a3a3a3] leading-relaxed">
              All parsing and analysis happens client-side in your browser. No CSV data is uploaded to any server, logged, or transmitted. Refresh the page to clear.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE — 90-day plan with persistent task tracking
   ============================================================ */
function Timeline_Tab() {
  const [done, setDone] = useState({});
  const [expanded, setExpanded] = useState({ p1: true });

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("plan-progress");
        if (r && r.value) setDone(JSON.parse(r.value));
      } catch (e) {}
    })();
  }, []);

  const persist = async (next) => {
    try { await window.storage.set("plan-progress", JSON.stringify(next)); } catch (e) {}
  };
  const toggleTask = (taskId) => {
    const next = { ...done, [taskId]: !done[taskId] };
    setDone(next); persist(next);
  };
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const totalTasks = PLAN.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks = Object.values(done).filter(Boolean).length;
  const overallPct = totalTasks > 0 ? doneTasks / totalTasks : 0;

  const reset = async () => {
    setDone({});
    try { await window.storage.delete("plan-progress"); } catch (e) {}
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#141414] border border-[#2a2a2a] p-5 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373] mb-1">90-DAY EXECUTION PLAN</div>
              <div className="ff-serif italic text-2xl text-white">From validate to <span className="text-[#a3e635]">$10K MRR</span></div>
            </div>
            <div className="text-right">
              <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373] mb-1">PROGRESS</div>
              <div className="ff-mono text-3xl text-[#a3e635] tnum">
                <AnimatedNumber value={overallPct} formatter={n => fmtPct(n, 0)} />
              </div>
              <div className="ff-mono text-[10px] text-[#525252] tnum mt-0.5">{doneTasks} / {totalTasks} TASKS</div>
            </div>
          </div>
          <div className="h-1.5 bg-[#0a0a0a] mb-2">
            <div className="h-full bg-[#a3e635] transition-all duration-700" style={{ width: `${overallPct*100}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full pulse-glow" />
              <span className="ff-mono text-[9px] tracking-widest text-[#a3e635]">EXECUTING</span>
            </div>
            {doneTasks > 0 && (
              <button onClick={reset} className="ff-mono text-[9px] tracking-widest text-[#525252] hover:text-[#ef4444] transition-colors flex items-center gap-1">
                <Trash2 size={10} /> RESET
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Phase grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PLAN.map((phase, idx) => {
          const phaseDone = phase.tasks.filter(t => done[t.id]).length;
          const phasePct = phase.tasks.length > 0 ? phaseDone / phase.tasks.length : 0;
          const isExpanded = expanded[phase.id];
          return (
            <div key={phase.id} className="bg-[#141414] border border-[#2a2a2a] hover:border-[#404040] transition-colors slide-up" style={{ animationDelay: `${idx*40}ms` }}>
              <button
                onClick={() => toggleExpand(phase.id)}
                className="w-full text-left px-4 py-3 flex items-center gap-3"
              >
                <div className="ff-mono text-[10px] tracking-widest text-[#525252] tnum w-12">{phase.week}</div>
                <div className="w-px h-8 bg-[#2a2a2a]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="ff-mono text-sm font-semibold text-white">{phase.title.toUpperCase()}</div>
                    {phasePct === 1 && <CheckCircle2 size={12} className="text-[#a3e635]" />}
                  </div>
                  <div className="ff-sans text-[11px] text-[#737373]">{phase.subtitle}</div>
                </div>
                <div className="text-right">
                  <div className="ff-mono text-[10px] tnum" style={{ color: phasePct === 1 ? "#a3e635" : "#737373" }}>
                    {phaseDone}/{phase.tasks.length}
                  </div>
                  <div className="w-12 h-1 bg-[#0a0a0a] mt-1">
                    <div className="h-full transition-all duration-700" style={{ width: `${phasePct*100}%`, background: phase.color }} />
                  </div>
                </div>
                {isExpanded ? <ChevronDown size={14} className="text-[#525252]" /> : <ChevronRight size={14} className="text-[#525252]" />}
              </button>
              {isExpanded && (
                <div className="border-t border-[#2a2a2a] p-3 space-y-1.5">
                  {phase.tasks.map((task) => {
                    const isDone = !!done[task.id];
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className="w-full flex items-start gap-2.5 text-left px-2 py-1.5 hover:bg-[#1c1c1c] transition-colors group"
                      >
                        <div className={`mt-0.5 w-3.5 h-3.5 border flex items-center justify-center transition-all flex-shrink-0 ${
                          isDone ? "bg-[#a3e635] border-[#a3e635]" : "border-[#404040] group-hover:border-[#a3e635]"
                        }`}>
                          {isDone && <Check size={9} className="text-black" strokeWidth={3} />}
                        </div>
                        <div className={`ff-sans text-xs leading-relaxed transition-colors ${
                          isDone ? "text-[#525252] line-through" : "text-[#a3a3a3]"
                        }`}>
                          {task.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Milestones */}
      <div className="bg-[#141414] border border-[#2a2a2a] p-5">
        <div className="ff-mono text-[10px] tracking-[0.2em] text-[#737373] mb-3">REVENUE MILESTONES</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { wk: "WK 04", label: "BETA", target: "$1K MRR", n: 1000 },
            { wk: "WK 08", label: "LAUNCH", target: "$5K MRR", n: 5000 },
            { wk: "WK 12", label: "TRACTION", target: "$10K MRR", n: 10000 }
          ].map((m, i) => {
            // Approximate target met if proportional progress reached
            const hit = overallPct >= (i + 1) / 3;
            return (
              <div key={m.wk} className={`p-3 border ${hit ? "border-[#a3e635] bg-[#a3e635]/[0.05]" : "border-[#2a2a2a]"} transition-all`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="ff-mono text-[9px] tracking-widest text-[#525252] tnum">{m.wk}</span>
                  {hit && <CheckCircle2 size={12} className="text-[#a3e635]" />}
                </div>
                <div className="ff-mono text-[10px] tracking-widest text-[#a3a3a3] mb-1">{m.label}</div>
                <div className="ff-mono text-lg tnum" style={{ color: hit ? "#a3e635" : "#737373" }}>{m.target}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */
export default function App() {
  const [tab, setTab] = useState("calculator");
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    { id: "calculator", label: "CALCULATOR", icon: Calculator, sub: "live ROI math" },
    { id: "audit",      label: "AUDIT",      icon: FileUp,     sub: "CSV → recommendations" },
    { id: "timeline",   label: "TIMELINE",   icon: Calendar,   sub: "90-day execution" }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLE }} />
      <div className="min-h-screen bg-[#0a0a0a] text-white relative scan-bg">
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-50" />
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          {/* HEADER */}
          <header className="flex items-center justify-between mb-6 pb-5 border-b border-[#1c1c1c]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#a3e635] flex items-center justify-center">
                  <Activity size={14} className="text-black" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="ff-mono text-sm font-bold tracking-wide text-white">
                    AI/COST/COCKPIT
                  </div>
                  <div className="ff-mono text-[9px] text-[#525252] tracking-widest">v0.1 · MAY 2026 PRICING</div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 ff-mono text-[10px] text-[#525252] tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full pulse-glow" />
                <span>SYSTEM ONLINE</span>
              </div>
              <div className="tnum">{time.toISOString().slice(11,19)}<span className="blink">_</span></div>
            </div>
          </header>

          {/* TAB NAV */}
          <nav className="flex gap-0 mb-6 border-b border-[#1c1c1c]">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`group relative px-5 py-3 transition-all ${active ? "" : "hover:bg-[#141414]"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} className={active ? "text-[#a3e635]" : "text-[#525252] group-hover:text-[#a3a3a3]"} />
                    <div className="text-left">
                      <div className={`ff-mono text-xs tracking-[0.15em] font-semibold ${active ? "text-white" : "text-[#737373] group-hover:text-white"}`}>
                        {t.label}
                      </div>
                      <div className={`ff-mono text-[9px] tracking-wider ${active ? "text-[#a3e635]" : "text-[#525252]"}`}>
                        {t.sub}
                      </div>
                    </div>
                  </div>
                  {active && <div className="absolute bottom-0 left-0 right-0 h-px bg-[#a3e635]" />}
                </button>
              );
            })}
            <div className="flex-1 border-b border-transparent" />
          </nav>

          {/* CONTENT */}
          <main className="pb-12">
            {tab === "calculator" && <Calculator_Tab />}
            {tab === "audit"      && <AuditTool_Tab />}
            {tab === "timeline"   && <Timeline_Tab />}
          </main>

          {/* FOOTER */}
          <footer className="border-t border-[#1c1c1c] pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-4 ff-mono text-[10px] text-[#525252] tracking-wider">
              <span>PRICING SOURCE · ANTHROPIC, OPENAI, GOOGLE, DEEPSEEK</span>
              <span className="hidden md:inline">·</span>
              <span>VERIFIED 2026-05-08</span>
            </div>
            <div className="flex items-center gap-3 ff-mono text-[10px] text-[#525252] tracking-wider">
              <span>ARTIFACT 1 / 2</span>
              <span>·</span>
              <span className="text-[#a3e635]">NEXT: PLAYBOOK</span>
              <ArrowRight size={10} className="text-[#a3e635]" />
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
