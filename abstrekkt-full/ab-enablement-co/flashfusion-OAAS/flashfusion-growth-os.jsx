import { useState, useRef, useEffect } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
const CX = 270, CY = 270;

const STATUS = {
  good:     { fill: "#0d2918", badge: "#22c55e", dot: "#22c55e", text: "#bbf7d0" },
  moderate: { fill: "#291d06", badge: "#f59e0b", dot: "#f59e0b", text: "#fde68a" },
  poor:     { fill: "#2a0d0d", badge: "#ef4444", dot: "#ef4444", text: "#fecaca" },
  critical: { fill: "#2a0511", badge: "#e11d48", dot: "#e11d48", text: "#fda4af" },
};

// ─── Strategy data — Kyle Rosebrook / FlashFusion, May 2026 ─────────────────
const RINGS = [
  {
    id: "target", innerR: 65, outerR: 102,
    segments: [
      { label: "Solo Operators + AI-Native Builders", status: "good", start: 2, end: 358,
        detail: "Primary market: self-taught builders, indie devs, solopreneurs who use AI to punch above their weight class." }
    ]
  },
  {
    id: "personas", innerR: 105, outerR: 142,
    segments: [
      { label: "Flash — Indie Dev", status: "good", start: 2, end: 120,
        detail: "Self-taught builder. Ships fast, price-sensitive. Converts on demo + social proof. Best-served persona right now." },
      { label: "Fusion — Agency Lead", status: "moderate", start: 123, end: 241,
        detail: "Small agency needing white-label AI + ROI proof. Undertouched — no dedicated touchpoints or conversion path built yet." },
      { label: "INT — MSP Client", status: "poor", start: 244, end: 358,
        detail: "Enterprise MSP buyer (Intinc-adjacent). SPIKE POC mapped: 45 products, $300–500K Y1, 50–80% margins. Nothing shipped to market yet." }
    ]
  },
  {
    id: "insights", innerR: 145, outerR: 182,
    segments: [
      { label: "Market Signals", status: "poor", start: 2, end: 119,
        detail: "No structured competitive or trend monitoring. n8n WF-05 Morning Briefing (Priority 1) still unbuilt — this is the gap." },
      { label: "Funnel Data", status: "poor", start: 122, end: 239,
        detail: "PostHog connected to chaosclub.co but no live event data. Wix has zero click tracking — API endpoint doesn't exist. Blind spots compound." },
      { label: "Delivery Signals", status: "moderate", start: 242, end: 358,
        detail: "n8n WF-01–04 active and producing operational data. Automation loop functional. WF-05–09 gap breaks the full closed loop." }
    ]
  },
  {
    id: "impact", innerR: 185, outerR: 222,
    segments: [
      { label: "Revenue", status: "moderate", start: 2, end: 90,
        detail: "Wix store live (20 products). Shipping blocked by API bug. No paid acquisition running. Revenue is opportunity-blocked, not effort-blocked." },
      { label: "Automation ROI", status: "good", start: 93, end: 181,
        detail: "n8n + Claude API meaningfully compressing solo-operator overhead. 4 active workflows. 5 more in queue once MCP OAuth blocker is resolved." },
      { label: "Creative Output", status: "good", start: 184, end: 271,
        detail: "Memoir active. chaosclub.co vault: 100+ original lyrics. kylerosebrook.com live with 8-section redesign. Consistent creative throughput." },
      { label: "Audience", status: "critical", start: 274, end: 358,
        detail: "No structured audience-building across any channel. Zero paid ads. Zero referral program. Zero partnership pipeline. This is the single biggest drag on growth velocity." }
    ]
  },
  {
    id: "initiatives", innerR: 225, outerR: 268,
    segments: [
      { label: "Wix Store", status: "moderate", start: 2, end: 46,
        detail: "20 products, 10 collections, persona coupons live. 3 manual steps hard-blocked: (1) Dev Mode/Velo → 500 error; (2) Basic Shipping → updateDeliveryCarrier API bug; (3) Click tracking → no REST endpoint exists." },
      { label: "Fusion AI", status: "good", start: 49, end: 93,
        detail: "Canonical agent platform on Base44 (ID: 68dd8e79ca073475565c8e16, ~101 entities). Stable. Prior Orchestrator AI 694c75 is stale — ignore it." },
      { label: "chaosclub.co", status: "moderate", start: 96, end: 140,
        detail: "Lyric/audio platform. Stack: React 19 + Vite + Firebase + Cloudflare R2 + Gemini (Lyria 3 Pro, Imagen 4, Flash mood tagging) + Stripe ($4.99/mo) + PostHog. 100+ lyrics in vault. Full arch spec done. In active build — not yet live." },
      { label: "n8n Automation", status: "moderate", start: 143, end: 187,
        detail: "4/9 workflows active. WF-05 Morning Briefing is Priority 1. WF-06–09 blocked: multi-OAuth MCP limitation. 11 inactive workflows blocked pending Base44 Bearer creds + SCH-02 lane field. 4 orphan WIR-01 dupes exist." },
      { label: "INT SPIKE POC", status: "poor", start: 190, end: 234,
        detail: "45 products mapped. HYBRID booth+fulfillment model. $300–500K Y1 target, 50–80% margins. Fully mapped — not shipped. No client-facing delivery layer exists yet." },
      { label: "KyleRosebrook.com", status: "moderate", start: 237, end: 278,
        detail: "WordPress.com (Blog ID 253504189, Assembler theme). Homepage redesigned (8 sections, real bio copy). A11y audit complete (6 fixes). No content calendar, no SEO strategy." },
      { label: "Nexus Agents", status: "poor", start: 281, end: 318,
        detail: "15 agent configs via Anthropic Managed Agents API (anthropic-beta: managed-agents-2026-04-01). GitHub: Krosebrook/Nexus-aii. Exploratory — no production use case defined. API key was rotated after a leak during setup." },
      { label: "Content / Social", status: "moderate", start: 321, end: 358,
        detail: "Active output (social post skill built, generating-social-posts skill live) but no publishing cadence. No paid distribution. Newsletter skill built but no active edition running." }
    ]
  }
];

const RING_LABELS = [
  { r: 83,  label: "Target" },
  { r: 123, label: "Personas" },
  { r: 163, label: "Insights" },
  { r: 203, label: "Impact" },
  { r: 246, label: "Initiatives" }
];

// ─── SVG helpers ────────────────────────────────────────────────────────────
function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(r1, r2, startDeg, endDeg) {
  const GAP = 1.8;
  const s = startDeg + GAP, e = endDeg - GAP;
  if (e - s < 2) return "";
  const f = (n) => n.toFixed(2);
  const p1 = polar(CX, CY, r2, s), p2 = polar(CX, CY, r2, e);
  const p3 = polar(CX, CY, r1, e), p4 = polar(CX, CY, r1, s);
  const large = e - s > 180 ? 1 : 0;
  return `M${f(p1.x)} ${f(p1.y)} A${r2} ${r2} 0 ${large} 1 ${f(p2.x)} ${f(p2.y)} L${f(p3.x)} ${f(p3.y)} A${r1} ${r1} 0 ${large} 0 ${f(p4.x)} ${f(p4.y)}Z`;
}

// ─── AI system context ───────────────────────────────────────────────────────
const FF_SYSTEM = `You are the FlashFusion Growth Strategy AI — embedded in Kyle Rosebrook's personal operating system. You have full context on every active project, blocker, and decision in play as of May 2026.

═══ WHO YOU'RE TALKING TO ═══
Kyle Rosebrook — L1 Service Desk Technician at Intinc (MSP, Lincolnshire IL, ~51–200 employees). All AI, automation, and product work is entirely self-initiated on top of his day job — not org-directed. Self-taught across ~30 tools. Based in Mundelein, IL. Decision priority: Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness. Core constraint: solo operator — everything must be automatable to scale.

═══ ACTIVE PROJECTS ═══

FLASHFUSION (Wix store + AI dev platform)
- Wix store: 20 products, 10 collections, persona coupons live. Site ID: 4cad8458-937c-4a7a-8936-2a670f2883fd
- 3 manual steps HARD-BLOCKED by API limitations (require manual Wix Dashboard entry):
  (1) Velo/Dev Mode provisioning → 500 error
  (2) Basic Shipping flat rates → updateDeliveryCarrier API bug rejects appId
  (3) Click tracking → no REST endpoint exists

FUSION AI (agent platform, Base44)
- Canonical agent platform. App ID: 68dd8e79ca073475565c8e16. ~101 entities. Active and stable.
- Prior Orchestrator AI (694c75) is stale — Fusion AI supersedes it.

CHAOSCLUB.CO (lyric/audio platform)
- Stack: React 19 + Vite + Firebase + Cloudflare R2 + Gemini API (Lyria 3 Pro/Clip, Imagen 4, Flash mood tagging) + Stripe ($4.99/mo premium) + PostHog
- 100+ original lyrics in vault. Full architecture spec complete. In active build phase. Not yet live.
- Design: "Reading Room at Midnight" dark editorial aesthetic.

N8N AUTOMATION FOUNDATION BLUEPRINT
- Active workflows: WF-01, WF-02, WF-03, WF-04
- WF-05 Morning Briefing: Priority 1 — unbuilt
- WF-06 Lead Capture CRM, WF-07 Weekly Review, WF-08 End-of-Day Shutdown, WF-09 Focus Mode Poller: unbuilt
- MCP blockers: config param in node() doesn't apply actual node params; multi-OAuth credential workflows fail via MCP
- Workaround: install non-OAuth nodes via MCP, add remaining nodes manually in n8n UI
- 11 inactive workflows blocked: 4 WIR (IDs: rCVu2glYrnROgipT, xHJO7htByEd07ZGp, vTzMuNpichJO871n, QPf2SqTRVEOKyeQV) + 7 OAI (TTL Purge, Token Reset, Queue Expiry, Health Snap, Job Executor, Webhook Pinger, Retention Purge) — all pending Base44 Bearer creds + SCH-02 lane field. 4 orphan WIR-01 dupes exist.

INT CUSTOMIZATION SERVICE SPIKE POC
- 45 products mapped. HYBRID booth+fulfillment model. Revenue target: $300–500K Y1, 50–80% margins.
- Status: Mapped — not shipped. No client-facing delivery layer exists.

KYLEROSEBROOK.COM
- WordPress.com, Blog ID 253504189, Assembler theme.
- Homepage redesigned: 8 sections with real biographical copy. A11y audit done (6 fixes, kr-accessibility.php plugin).
- No content calendar or SEO strategy.

NEXUS / ANTHROPIC MANAGED AGENTS
- 15 agent configs generated via POST /v1/beta/sessions (anthropic-beta: managed-agents-2026-04-01)
- GitHub: Krosebrook/Nexus-aii. Exploratory — no production use case defined. API key rotated after a leak during setup.

SKILLS LIBRARY / COWORK
- 33+ skills audited and rebuilt to spec compliance. GitHub: Krosebrook/skills.
- Cowork storage issue: base image consumes ~8.2 GB of 10 GB quota before any user activity.

SUBSCRIPTION RISK (April 2026 audit)
- 5 vendors in urgent payment-failure status: Supabase, Notion, Zapier, Slack, Cloudflare
- Several services self-canceled via payment failure. Lovable flagged as potential chargeback situation.

CREATIVE TRACKS
- Memoir: active writing track (primary creative output)
- chaosclub.co: 100+ original lyrics, platform being built around them
- Past music/ghost-writing: not ongoing

═══ BUYER PERSONAS ═══
- Flash (Indie Dev / Solo Builder): Self-taught, ships fast, price-sensitive. Converts on demos + social proof. GOOD — best-served right now.
- Fusion (Agency Lead): Small agency, needs white-label AI + reliability + ROI proof. MODERATE — undertouched, no dedicated conversion path.
- INT Client (Enterprise MSP): Intinc-adjacent enterprise buyer for Customization Service. POOR — SPIKE POC mapped but nothing shipped to market.

═══ CURRENT BLOCKER SUMMARY ═══
1. Wix shipping / Dev Mode / click tracking → manual Wix Dashboard only (API gap, not fixable via code)
2. n8n WF-05–09 → multi-OAuth MCP limitation; manual n8n UI required for OAuth-dependent nodes
3. chaosclub.co → in build, not yet live
4. INT SPIKE → no client-facing delivery layer
5. Nexus agents → no defined production use case
6. Audience → zero paid distribution, no referral program, no partnership pipeline (Critical on the wheel)
7. Subscription risks: 5 vendors at payment-failure risk

═══ HOW YOU ANSWER ═══
- Reference specific project names, IDs, and blockers when relevant
- Don't invent precision — say so when data is missing
- Prioritize by WSJF logic: (urgency × impact) ÷ effort
- Flag drift before it compounds
- Propose the single next executable action, not a framework
- Direct: 3–6 sentences unless Kyle asks for depth
- Never generic. Never motivational filler.`;

const SUGGESTED = [
  "What's leaking the most revenue right now and what's the fix?",
  "Which blocked initiative costs me the most if I ignore it another 30 days?",
  "Given I'm a solo operator, what's the right order to attack WF-05 through WF-09?",
  "Audience is Critical — what's the single highest-leverage move to fix it?",
];

const THINK_STEPS = [
  "Reading Brand DNA",
  "Scanning Active Projects",
  "Reviewing Personas + Blockers",
  "Analyzing Initiative Health",
];

const ALL_CTX = ["FlashFusion", "n8n", "chaosclub", "Nexus", "INT SPIKE", "Personas"];

// ─── Component ───────────────────────────────────────────────────────────────
export default function FlashFusionGrowthOS() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkSteps, setThinkSteps] = useState([]);
  const [activeCtx, setActiveCtx] = useState(["FlashFusion", "n8n", "chaosclub"]);
  const [tooltip, setTooltip] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinkSteps]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    const next = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);
    setThinkSteps([]);

    for (let i = 0; i < THINK_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 520));
      setThinkSteps((p) => [...p, THINK_STEPS[i]]);
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: FF_SYSTEM,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find((b) => b.type === "text")?.text ?? "No response.";
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Strategy layer unreachable." }]);
    }

    setThinkSteps([]);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 2px; }

        .ff-root { display: flex; flex-direction: column; height: 100vh; width: 100%; background: #0F0618; color: #F8FAFC; font-family: 'Inter', sans-serif; overflow: hidden; }

        .ff-topbar { display: flex; align-items: center; gap: 12px; height: 46px; padding: 0 20px; background: rgba(26,11,46,0.92); border-bottom: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(16px); flex-shrink: 0; z-index: 20; }
        .ff-logo { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 15px; background: linear-gradient(90deg, #A855F7 0%, #F472B6 55%, #22D3EE 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.3px; }
        .ff-sep { width: 1px; height: 18px; background: rgba(255,255,255,0.08); }
        .ff-badge { font-size: 11px; font-family: 'JetBrains Mono', monospace; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.25); border-radius: 5px; padding: 2px 8px; color: #c084fc; }
        .ff-tag { font-size: 11px; color: #64748B; }
        .ff-spacer { flex: 1; }
        .ff-status-row { display: flex; gap: 10px; }
        .ff-status-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #64748B; }
        .ff-dot { width: 6px; height: 6px; border-radius: 50%; }

        .ff-main { display: flex; flex: 1; overflow: hidden; }

        .ff-chart-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; min-width: 0; }
        .ff-chart-wrap { position: relative; filter: drop-shadow(0 0 48px rgba(168,85,247,0.18)); }
        .ff-legend { display: flex; gap: 14px; justify-content: center; margin-top: 14px; }
        .ff-leg { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #64748B; }
        .ff-leg-dot { width: 7px; height: 7px; border-radius: 50%; }

        .ff-tooltip { position: fixed; z-index: 200; pointer-events: none; background: rgba(26,11,46,0.97); backdrop-filter: blur(14px); border: 1px solid rgba(168,85,247,0.3); border-radius: 10px; padding: 11px 14px; max-width: 290px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .ff-tooltip-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 12px; color: #F8FAFC; margin-bottom: 3px; }
        .ff-tooltip-ring { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748B; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .ff-tooltip-detail { font-size: 11px; color: #94a3b8; line-height: 1.55; }
        .ff-tooltip-status { display: inline-block; font-size: 10px; font-family: 'JetBrains Mono', monospace; padding: 1px 6px; border-radius: 4px; margin-top: 7px; text-transform: capitalize; }

        .ff-chat-panel { flex-shrink: 0; display: flex; flex-direction: column; background: rgba(26,11,46,0.5); border-left: 1px solid rgba(168,85,247,0.15); backdrop-filter: blur(8px); transition: width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease; overflow: hidden; }
        .ff-chat-panel.open  { width: 400px; opacity: 1; pointer-events: all; }
        .ff-chat-panel.closed { width: 0px; opacity: 0; pointer-events: none; border-left: none; }

        .ff-collapse-btn { flex-shrink: 0; width: 30px; height: 30px; margin-top: 2px; background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.22); border-radius: 7px; cursor: pointer; color: #A855F7; font-size: 17px; display: flex; align-items: center; justify-content: center; transition: background 0.14s, border-color 0.14s; line-height: 1; }
        .ff-collapse-btn:hover { background: rgba(168,85,247,0.2); border-color: rgba(168,85,247,0.45); }

        .ff-reopen-btn { position: fixed; bottom: 24px; right: 20px; z-index: 50; display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: rgba(26,11,46,0.96); border: 1px solid rgba(168,85,247,0.4); border-radius: 24px; cursor: pointer; color: #c084fc; font-size: 12px; font-family: 'JetBrains Mono', monospace; backdrop-filter: blur(16px); box-shadow: 0 4px 24px rgba(168,85,247,0.25); transition: border-color 0.15s, box-shadow 0.15s; }
        .ff-reopen-btn:hover { border-color: rgba(168,85,247,0.7); box-shadow: 0 4px 32px rgba(168,85,247,0.4); }
        .ff-chat-header { padding: 18px 20px 0; }
        .ff-chat-spark { font-size: 20px; margin-bottom: 8px; background: linear-gradient(90deg, #A855F7, #22D3EE); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .ff-chat-title { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 20px; line-height: 1.2; margin-bottom: 4px; color: #F8FAFC; }
        .ff-chat-sub { font-size: 10px; color: #64748B; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; }

        .ff-suggested { display: flex; flex-direction: column; gap: 5px; padding: 0 20px; margin-bottom: 6px; }
        .ff-suggestion { background: rgba(37,20,67,0.7); border: 1px solid rgba(168,85,247,0.2); border-radius: 7px; padding: 7px 12px; font-size: 12px; color: #CBD5E1; cursor: pointer; transition: all 0.14s; text-align: left; line-height: 1.4; }
        .ff-suggestion:hover { border-color: rgba(168,85,247,0.45); background: rgba(37,20,67,0.95); color: #F8FAFC; }

        .ff-messages { flex: 1; overflow-y: auto; padding: 8px 20px; display: flex; flex-direction: column; gap: 10px; }
        .ff-msg-user { align-self: flex-end; max-width: 88%; background: rgba(168,85,247,0.18); border: 1px solid rgba(168,85,247,0.35); border-radius: 12px 12px 3px 12px; padding: 10px 14px; font-size: 13px; line-height: 1.55; color: #F8FAFC; }
        .ff-msg-ai { align-self: flex-start; max-width: 97%; font-size: 13px; line-height: 1.65; color: #CBD5E1; }

        .ff-thinking { background: rgba(15,6,24,0.85); border: 1px solid rgba(51,65,85,0.5); border-radius: 8px; padding: 10px 14px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; }
        .ff-think-step { display: flex; align-items: center; gap: 8px; padding: 2px 0; }
        .ff-think-step.done { color: #334155; }
        .ff-think-step.active { color: #7c879e; }
        .ff-spinner { width: 9px; height: 9px; flex-shrink: 0; border: 1.5px solid rgba(168,85,247,0.25); border-top-color: #A855F7; border-radius: 50%; animation: spin 0.65s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ff-chk { font-size: 9px; color: #334155; width: 9px; text-align: center; flex-shrink: 0; }
        .ff-think-tail { margin-top: 6px; color: #334155; font-size: 10px; }

        .ff-input-area { padding: 10px 16px 14px; border-top: 1px solid rgba(255,255,255,0.05); }
        .ff-ctx-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
        .ff-ctx-tag { display: flex; align-items: center; gap: 4px; background: rgba(37,20,67,0.8); border: 1px solid rgba(99,102,241,0.28); border-radius: 5px; padding: 2px 7px; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #818cf8; cursor: pointer; transition: all 0.12s; user-select: none; }
        .ff-ctx-tag:hover { border-color: rgba(99,102,241,0.55); }
        .ff-ctx-add { opacity: 0.4; border-style: dashed; }
        .ff-ctx-add:hover { opacity: 0.7; }

        .ff-input-box { display: flex; align-items: flex-end; gap: 8px; background: rgba(15,6,24,0.9); border: 1px solid rgba(168,85,247,0.22); border-radius: 10px; padding: 10px 12px; transition: border-color 0.18s, box-shadow 0.18s; }
        .ff-input-box:focus-within { border-color: rgba(168,85,247,0.5); box-shadow: 0 0 0 3px rgba(168,85,247,0.07); }
        .ff-ta { flex: 1; background: transparent; border: none; outline: none; color: #F8FAFC; font-family: 'Inter', sans-serif; font-size: 13px; resize: none; line-height: 1.5; min-height: 20px; max-height: 96px; overflow-y: auto; }
        .ff-ta::placeholder { color: #475569; }
        .ff-send { width: 32px; height: 32px; flex-shrink: 0; background: linear-gradient(135deg, #A855F7, #7c3aed); border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; font-size: 15px; transition: opacity 0.15s, transform 0.1s; }
        .ff-send:hover:not(:disabled) { opacity: 0.88; transform: scale(1.04); }
        .ff-send:disabled { opacity: 0.35; cursor: not-allowed; }
        .ff-model-tag { text-align: right; font-size: 10px; color: #334155; font-family: 'JetBrains Mono', monospace; margin-top: 7px; }
      `}</style>

      <div className="ff-root">
        <div className="ff-topbar">
          <div className="ff-logo">⚡ FlashFusion</div>
          <div className="ff-sep" />
          <div className="ff-badge">Growth OS — Kyle Rosebrook</div>
          <div className="ff-sep" />
          <span className="ff-tag">Solo Operator · May 2026</span>
          <div className="ff-spacer" />
          <div className="ff-status-row">
            {[{ label: "Good", color: "#22c55e" }, { label: "Moderate", color: "#f59e0b" }, { label: "Poor", color: "#ef4444" }, { label: "Critical", color: "#e11d48" }].map((s) => (
              <div key={s.label} className="ff-status-item">
                <div className="ff-dot" style={{ background: s.color }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <div className="ff-main">
          <div className="ff-chart-panel">
            {tooltip && (
              <div className="ff-tooltip" style={{ top: tooltip.y + 16, left: Math.min(tooltip.x + 16, window.innerWidth - 320) }}>
                <div className="ff-tooltip-title">{tooltip.label}</div>
                <div className="ff-tooltip-ring">{tooltip.ring}</div>
                {tooltip.detail && <div className="ff-tooltip-detail">{tooltip.detail}</div>}
                <div className="ff-tooltip-status" style={{ background: STATUS[tooltip.status].fill, color: STATUS[tooltip.status].badge, border: `1px solid ${STATUS[tooltip.status].badge}44` }}>
                  {tooltip.status}
                </div>
              </div>
            )}

            <div className="ff-chart-wrap">
              <svg viewBox="0 0 540 540" width="540" height="540">
                <defs>
                  <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.12" />
                    <stop offset="70%" stopColor="#0F0618" stopOpacity="0" />
                  </radialGradient>
                  <filter id="sg">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <circle cx={CX} cy={CY} r={280} fill="url(#cg)" />

                {RINGS.map((ring) =>
                  ring.segments.map((seg, i) => {
                    const key = `${ring.id}-${i}`;
                    const c = STATUS[seg.status];
                    const mid = (seg.start + seg.end) / 2;
                    const midR = (ring.innerR + ring.outerR) / 2;
                    const mp = polar(CX, CY, midR, mid);
                    const span = seg.end - seg.start;
                    const isHov = hoveredKey === key;
                    const path = arcPath(ring.innerR, ring.outerR, seg.start, seg.end);
                    if (!path) return null;
                    return (
                      <g key={key} style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => { setHoveredKey(key); setTooltip({ x: e.clientX, y: e.clientY, label: seg.label, ring: ring.id, status: seg.status, detail: seg.detail }); }}
                        onMouseMove={(e) => setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                        onMouseLeave={() => { setHoveredKey(null); setTooltip(null); }}
                      >
                        <path d={path} fill={c.fill} stroke={isHov ? c.badge : "rgba(168,85,247,0.1)"} strokeWidth={isHov ? 1.5 : 0.5} opacity={isHov ? 1 : 0.9} style={{ transition: "all 0.17s" }} filter={isHov ? "url(#sg)" : undefined} />
                        <circle cx={mp.x} cy={mp.y - 10} r={3.5} fill={c.dot} opacity={isHov ? 1 : 0.85} />
                        {span > 26 && (
                          <text x={mp.x} y={mp.y + 3} textAnchor="middle" fill={c.text} fontSize={ring.id === "initiatives" ? 8 : 7.5} fontFamily="'Inter', sans-serif" fontWeight="500" style={{ pointerEvents: "none" }}>
                            {seg.label.length > 13 ? seg.label.slice(0, 12) + "…" : seg.label}
                          </text>
                        )}
                      </g>
                    );
                  })
                )}

                {RING_LABELS.map((rl) => (
                  <text key={rl.label} x={CX} y={CY - rl.r + 6} textAnchor="middle" fill="rgba(100,116,139,0.3)" fontSize={7} fontFamily="'JetBrains Mono', monospace" style={{ pointerEvents: "none" }}>
                    {rl.label}
                  </text>
                ))}

                <circle cx={CX} cy={CY} r={60} fill="rgba(168,85,247,0.07)" stroke="rgba(168,85,247,0.22)" strokeWidth={1} />
                <circle cx={CX} cy={CY} r={52} fill="rgba(168,85,247,0.04)" stroke="rgba(168,85,247,0.1)" strokeWidth={0.5} />
                <text x={CX} y={CY - 10} textAnchor="middle" fill="#c084fc" fontSize={11} fontFamily="'Poppins', sans-serif" fontWeight="700">FLASH</text>
                <text x={CX} y={CY + 5}  textAnchor="middle" fill="#A855F7" fontSize={11} fontFamily="'Poppins', sans-serif" fontWeight="700">FUSION</text>
                <text x={CX} y={CY + 19} textAnchor="middle" fill="#475569" fontSize={8}  fontFamily="'JetBrains Mono', monospace">Growth OS</text>
              </svg>

              <div className="ff-legend">
                {[{ label: "Good", color: "#22c55e" }, { label: "Moderate", color: "#f59e0b" }, { label: "Poor", color: "#ef4444" }, { label: "Critical", color: "#e11d48" }].map((l) => (
                  <div key={l.label} className="ff-leg"><div className="ff-leg-dot" style={{ background: l.color }} />{l.label}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating reopen button — visible only when panel is closed */}
          {!chatOpen && (
            <button className="ff-reopen-btn" onClick={() => setChatOpen(true)}>
              <span style={{ fontSize: 14 }}>✦</span>
              <span>AI Strategy</span>
            </button>
          )}

          <div className={`ff-chat-panel ${chatOpen ? "open" : "closed"}`}>
            <div className="ff-chat-header">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div className="ff-chat-spark">✦</div>
                  <div className="ff-chat-title">Let's ship your<br />growth strategy.</div>
                  <div className="ff-chat-sub">All projects loaded · Claude Sonnet 4 · May 2026</div>
                </div>
                <button className="ff-collapse-btn" onClick={() => setChatOpen(false)} title="Collapse panel">
                  ›
                </button>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="ff-suggested">
                {SUGGESTED.map((q) => (
                  <button key={q} className="ff-suggestion" onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}

            <div className="ff-messages">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "ff-msg-user" : "ff-msg-ai"}>{m.content}</div>
              ))}

              {loading && thinkSteps.length > 0 && (
                <div className="ff-thinking">
                  {thinkSteps.map((step, i) => (
                    <div key={i} className={`ff-think-step ${i === thinkSteps.length - 1 ? "active" : "done"}`}>
                      {i === thinkSteps.length - 1 ? <div className="ff-spinner" /> : <span className="ff-chk">✓</span>}
                      {step}
                    </div>
                  ))}
                  <div className="ff-think-tail">Think hard…</div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="ff-input-area">
              <div className="ff-ctx-tags">
                {activeCtx.map((ctx) => (
                  <div key={ctx} className="ff-ctx-tag" onClick={() => setActiveCtx((p) => p.filter((c) => c !== ctx))}>@{ctx} ×</div>
                ))}
                {ALL_CTX.filter((c) => !activeCtx.includes(c)).map((ctx) => (
                  <div key={ctx} className="ff-ctx-tag ff-ctx-add" onClick={() => setActiveCtx((p) => [...p, ctx])}>+{ctx}</div>
                ))}
              </div>

              <div className="ff-input-box">
                <textarea ref={taRef} className="ff-ta" rows={2} placeholder="Type something..." value={input}
                  onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px"; }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                />
                <button className="ff-send" onClick={() => send()} disabled={loading || !input.trim()}>↑</button>
              </div>
              <div className="ff-model-tag">Claude Sonnet 4 · Full stack context active</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
