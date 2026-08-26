import { useState, useRef, useEffect, useCallback } from "react";

// ── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  navy: "#0E2841", navyLight: "#152f4a", blue: "#156082", blueMid: "#1a75a0",
  orange: "#E97132", orangeLight: "#f08347", light: "#E8E8E8", lightMid: "#f4f4f4",
  white: "#FFFFFF", text: "#1a2332", textMuted: "#6b7a8d", border: "#dde3ea",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; }
    h1,h2,h3,h4,h5 { font-family: 'Barlow Condensed', sans-serif; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fade-up { animation: fadeUp 0.35s ease forwards; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #c0cdd8; border-radius: 2px; }
    textarea:focus, input:focus { outline: none; }
    button { cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }
    @media (max-width: 640px) { .hide-mobile { display: none !important; } }
  `}</style>
);

// ── Storage helpers ───────────────────────────────────────────────────────────
const storage = {
  async get(key) {
    try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(key, value) {
    try { await window.storage.set(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  async list(prefix) {
    try { const r = await window.storage.list(prefix); return r?.keys ?? []; }
    catch { return []; }
  },
  async del(key) {
    try { await window.storage.delete(key); return true; }
    catch { return false; }
  },
};

// ── Markdown renderer ─────────────────────────────────────────────────────────
function renderMd(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, `<code style="background:#f0f4f8;padding:2px 6px;border-radius:4px;font-size:0.88em;font-family:monospace">$1</code>`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" style="color:${C.blue};text-decoration:underline">$1</a>`)
    .replace(/^### (.+)$/gm, `<h4 style="font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:700;color:${C.navy};margin:14px 0 4px">$1</h4>`)
    .replace(/^## (.+)$/gm, `<h3 style="font-family:'Barlow Condensed',sans-serif;font-size:1.25rem;font-weight:700;color:${C.navy};margin:16px 0 6px">$1</h3>`)
    .replace(/^- (.+)$/gm, `<li style="margin:3px 0 3px 18px;line-height:1.6">$1</li>`)
    .replace(/\n\n/g, "</p><p style='margin:8px 0'>")
    .replace(/\n/g, "<br/>");
}

// ── Mini components ───────────────────────────────────────────────────────────
function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.blue,
          animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
    </div>
  );
}

const TIER_COLORS = {
  "non-technical": { bg:"#f0f4f8", text:"#4a6080", label:"Non-Technical" },
  "power-user":    { bg:"#e8f4ff", text:C.blue,    label:"Power User"    },
  developer:       { bg:"#e8f8f0", text:"#2d7a50",  label:"Developer"     },
  enterprise:      { bg:"#e8eaf8", text:"#3d4faa",  label:"Enterprise"    },
  unknown:         { bg:C.light,   text:C.textMuted, label:"Detecting…"   },
};

function AudienceBadge({ tier = "unknown" }) {
  const t = TIER_COLORS[tier] ?? TIER_COLORS.unknown;
  return (
    <span style={{ background:t.bg, color:t.text, padding:"2px 10px", borderRadius:20,
      fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase" }}>
      {t.label}
    </span>
  );
}

const TENANT_META = {
  personal:  { label:"Personal",   color:"#7c3aed" },
  humanx:    { label:"HumanX 2026", color:"#b91c1c" },
  prospect:  { label:"Prospect",   color:"#0e7490" },
};

function TenantBadge({ tenant }) {
  const t = TENANT_META[tenant] ?? TENANT_META.client;
  return (
    <span style={{ background:t.color+"22", color:t.color, padding:"2px 10px", borderRadius:20,
      fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase",
      border:`1px solid ${t.color}44` }}>
      {t.label}
    </span>
  );
}

// ── Per-tenant configuration ──────────────────────────────────────────────────
const TENANT_CONFIG = {
  personal: {
    sidebarLabel: "Command Center",
    sidebarSub:   "Kyle Rosebrook · AI SME",
    accentBg:     `linear-gradient(135deg,#7c3aed,#a855f7)`,
    welcomeTitle: "What are we building or deciding today?",
    welcomeSub:   "Your strategic advisor and project inventory. Cuts through the noise, surfaces what moves the needle financially.",
    footerNote:   "Personal Command Center · Private",
    chips: [
      "What should I ship next?",
      "Prioritize my active projects",
      "Fastest path to $10K/mo",
      "Review my Customization Service strategy",
      "Revive an archived project",
      "Build my AI SME portfolio",
    ],
    systemPrompt: `You are a strategic advisor and project command center for Kyle Rosebrook — a Staff Engineer and independent AI consultant building personal income streams outside of his corporate role.

YOUR JOB: Help Kyle make high-leverage decisions about his time, projects, and money. Not explain Claude. Not teach. Challenge, prioritize, and build.

KYLE'S SITUATION:
- Skills: Staff-level engineering, Claude/AI ecosystem expert, MSP industry knowledge, prompt systems, agent architecture, automation (n8n, Zapier), full-stack (Next.js, Supabase, Vercel)
- Financial goal: Build short, medium, and long-term income independent of a single employer
- Time constraint: Finite hours outside a demanding corporate role

INCOME HORIZONS:
- Short-term (0–6 mo): Customization Service — B2B AI consulting and configuration for businesses. Direct client revenue. High margin. Already has the playbook.
- Medium-term (6–18 mo): Productized assets — Notion Marketplace (Recurring Work OS first), Co-Work automation catalog (100 automations across 10 categories), CEG as a sellable embedded tool, 15-framework prompting system as a product
- Long-term (18+ mo): Corporate AI SME portfolio (land a senior AI role at a well-resourced company), podcast or content that builds inbound, CEG/Customization Service as a scalable B2B platform

ACTIVE PROJECTS (ranked by proximity to revenue):
1. Customization Service — B2B AI setup and configuration. Core offering. Needs: client pipeline, landing page, pricing page, case studies
2. HumanX Assess — Conference assessment tool (hard April deadline). QR code demo for MSP audience at Moscone. Near-complete.
3. Claude Ecosystem Guide (CEG) — This tool. Positions Kyle as the expert. Doubles as a sellable embedded product for clients.
4. Notion Marketplace — Recurring Work OS ships first. Then SOP Factory, Client Delivery Hub, Meetings→Actions, Content Ops Engine
5. Co-Work automation catalog — 100 automations across 10 categories. Batch build sessions. Priority: doc templates, sprint reporting, incident response, client services
6. 15-Framework Prompting System — 75 prompts, compliance overlays (HIPAA/PCI/SOC 2), markdown + Word outputs. Productizable.

ARCHIVING (deprioritized, not deleted):
- All INT-specific initiatives (internal tools, Copilot Studio agent, employee prompt packages)
- INT Platform Explorer Phase 3
- Microsoft 365 internal tooling

REVIVING (personal projects previously paused):
- Kinsley Apps — Voice-to-illustrated books, educational apps. Personal project. Long-term.
- Any other projects Kyle surfaces — treat them as candidates to evaluate for income fit

PORTFOLIO TARGETS (for corporate AI SME positioning):
- Demonstrated: Production AI applications shipped (HumanX Assess, CEG)
- Demonstrated: Agent architecture, MCP, multi-model orchestration
- Demonstrated: Enterprise AI adoption strategy and enablement
- Needs: Case studies, public artifacts, written POV content, speaking/conference presence

HOW YOU OPERATE:
- Lead with prioritization. When Kyle describes a project or idea, immediately score it against his income horizons and current bandwidth.
- Challenge over-planning. If Kyle is designing when he should be shipping, say it.
- Apply WSJF instinctively: What is shortest job, highest value, lowest risk? That ships first.
- When Kyle asks "what should I do," give him ONE clear recommendation with a 3-step next action.
- When he brings a new idea: "Does this accelerate an existing income stream or start a new one? How long to first dollar?"
- Know when to say "archive it." Not every idea deserves time.
- Be direct. Kyle appreciates pushback. Don't cushion hard truths.
- For technical questions: go deep. Kyle is a Staff Engineer. No hand-holding.
- For strategy questions: be opinionated. He has enough frameworks already — he needs decisions.

NEVER:
- Recommend starting something new when existing projects are unshipped
- Give generic advice that ignores his specific stack or situation
- Pad responses with motivational filler`,
  },

  humanx: {
    sidebarLabel: "HumanX 2026",
    sidebarSub:   "AI Ecosystem · Moscone",
    accentBg:     `linear-gradient(135deg,#b91c1c,#dc2626)`,
    welcomeTitle: "What would you like to know about Claude?",
    welcomeSub:   "Expert reference for every Claude feature, API pattern, and workflow — from first use to production deployment.",
    footerNote:   "HumanX 2026 · Powered by Anthropic Claude",
    chips: [
      "What is Claude?",
      "Claude vs ChatGPT for my business",
      "How do MCP connectors work?",
      "What's extended thinking?",
      "Claude Code for my dev team",
      "How does pricing compare?",
    ],
    systemPrompt: `You are a Claude ecosystem expert at HumanX 2026, helping MSP owners, IT leaders, vendors, and enterprise buyers understand what Claude can do for their business.

WHO YOU'RE TALKING TO: Conference attendees — mostly MSP professionals, technology decision-makers, and vendors. They are evaluating Claude vs. alternatives, figuring out where AI fits in their service delivery, and looking for concrete ROI.

YOUR JOB: Give them the clearest, most accurate picture of Claude's capabilities so they can make good decisions. Not to sell them on anything — to inform them well.

WHAT THEY TYPICALLY WANT TO KNOW:
- How Claude compares to ChatGPT and Gemini for real business use
- What Claude can actually automate vs. what's still manual
- How MCP connectors work and what they can integrate
- Whether Claude Code is relevant for their dev team
- What plan/price makes sense for their team size
- How to get started without a big technical lift

HOW YOU OPERATE:
- Lead with the concrete answer, not the preamble
- Use business-outcome framing — connect features to time saved, quality improved, cost reduced
- Be fair about limitations — Claude doesn't do image generation, has token limits, costs money at scale
- When they ask about competitors: factual, even-handed, no bashing
- When they're ready to go deeper on a technical topic, go there
- Keep it tight — conference context, attention is limited

Teaching progression:
1. TL;DR — one clear sentence
2. Concrete example — from their industry if possible
3. Technical depth — only if they ask

Official docs: docs.claude.com | claude.ai/pricing | modelcontextprotocol.io`,
  },

  prospect: {
    sidebarLabel: "Customization Service",
    sidebarSub:   "Powered by Kyle Rosebrook",
    accentBg:     `linear-gradient(135deg,#0e7490,#0891b2)`,
    welcomeTitle: "Let's figure out what AI can actually do for your business",
    welcomeSub:   "No jargon. No hype. Just a clear picture of what's possible, what it costs, and how to get there.",
    footerNote:   "AI Customization Service · kyleai.com",
    chips: [
      "What can AI do for my business?",
      "How is this different from ChatGPT?",
      "What would setup actually look like?",
      "How long until my team sees value?",
      "What does it cost?",
      "Can you connect to our existing tools?",
    ],
    systemPrompt: `You are an AI strategy and customization advisor representing Kyle Rosebrook's independent Customization Service — a B2B service that helps businesses adopt Claude and build AI workflows tailored to their operations.

WHO YOU'RE TALKING TO: Business owners, team leads, and executives who are evaluating whether AI is worth it for their company. They may have tried ChatGPT. They're skeptical of hype. They want ROI, not demos.

YOUR JOB: Help them understand clearly what AI can do for their specific situation, build trust, and surface whether Kyle's Customization Service is a fit.

WHAT THE CUSTOMIZATION SERVICE ACTUALLY DELIVERS:
- Custom Claude setup: system prompts, Projects, Memory, and MCP connector configuration tailored to their workflows
- Team onboarding: training staff at every level so it actually gets used
- Automation builds: connecting Claude to their existing tools (CRM, project management, email, docs) via n8n or Zapier
- Prompt systems: repeatable prompt libraries for their most common use cases
- Ongoing optimization: refining what's working, expanding what's not

WHAT MAKES THIS DIFFERENT FROM JUST SIGNING UP FOR CLAUDE:
- Generic Claude is powerful but unconfigured — it doesn't know your business, your tone, your workflows
- Kyle configures it to act like a specialist who already knows your company
- Most businesses see value within the first week of setup

HOW YOU OPERATE:
- Ask about their business before recommending anything. What do they do? What takes the most time? Where do mistakes happen?
- Translate every Claude feature into their business context — no jargon
- Be honest about what AI can and can't do. Don't oversell.
- When they're a fit for the Customization Service, say so clearly and describe what engagement looks like
- When they're not a fit, tell them what to do on their own
- Keep it conversational. This is a discovery call, not a product demo.

PRICING CONTEXT (approximate, Kyle sets final):
- Starter setup: one-time configuration for a small team
- Full implementation: custom automation builds + team training
- Retainer: ongoing optimization and expansion

If they want to move forward: suggest they book a call or reach out directly.`,
  },
};

TENANT_CONFIG.default = TENANT_CONFIG.personal;

// ── Audience tier detection ───────────────────────────────────────────────────
function detectTier(text) {
  const t = text.toLowerCase();
  if (["api","sdk","token","endpoint","typescript","claude code","mcp server","tool use","streaming","batch","prompt caching","function calling","bedrock","vertex"].some(s=>t.includes(s))) return "developer";
  if (["sso","saml","scim","soc 2","compliance","enterprise","procurement","audit","hipaa"].some(s=>t.includes(s))) return "enterprise";
  if (["workflow","project","memory","connector","artifact","automation","notion","zapier","integration","shortcut"].some(s=>t.includes(s))) return "power-user";
  return "unknown";
}

// ── Chat message ──────────────────────────────────────────────────────────────
function ChatMessage({ message, isNew }) {
  const isUser = message.role === "user";
  return (
    <div className={isNew ? "fade-up" : ""} style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start", marginBottom:16, padding:"0 4px" }}>
      {!isUser && (
        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.navy})`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:10, marginTop:2,
          fontSize:"0.75rem", fontWeight:800, color:C.white, fontFamily:"'Barlow Condensed',sans-serif" }}>CG</div>
      )}
      <div style={{ maxWidth:"76%",
        background: isUser ? `linear-gradient(135deg,${C.navy},${C.navyLight})` : C.white,
        color: isUser ? C.white : C.text,
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding:"12px 16px", fontSize:"0.9rem", lineHeight:1.6,
        boxShadow: isUser ? `0 2px 12px ${C.navy}40` : "0 1px 8px rgba(0,0,0,0.08)",
        border: isUser ? "none" : `1px solid ${C.border}` }}>
        {isUser
          ? <span>{message.content}</span>
          : <div dangerouslySetInnerHTML={{ __html:`<p style="margin:0">${renderMd(message.content)}</p>` }} />
        }
      </div>
    </div>
  );
}

// ── Suggestion chips ──────────────────────────────────────────────────────────
function Chips({ onSelect, suggestions }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginTop:20 }}>
      {suggestions.map(s => (
        <button key={s} onClick={() => onSelect(s)} style={{ background:C.white, border:`1.5px solid ${C.border}`,
          borderRadius:24, padding:"8px 16px", fontSize:"0.82rem", color:C.text, fontWeight:500,
          transition:"all 0.15s", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}
          onMouseEnter={e => { e.target.style.borderColor=C.orange; e.target.style.color=C.orange; e.target.style.transform="translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.borderColor=C.border; e.target.style.color=C.text; e.target.style.transform="translateY(0)"; }}
        >{s}</button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ChatPage({ tenant, onNavigate }) {
  const tc = TENANT_CONFIG[tenant] ?? TENANT_CONFIG.personal;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [tier, setTier] = useState("unknown");
  const [convId, setConvId] = useState(null); // storage key for this convo
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [convList, setConvList] = useState([]); // [{ id, title, date }]
  const [storageReady, setStorageReady] = useState(false);
  const bottomRef = useRef(null);
  const textRef = useRef(null);

  // Load conversation list from storage
  useEffect(() => {
    (async () => {
      const stored = await storage.get("ceg:convos");
      if (stored) setConvList(stored);
      setStorageReady(true);
    })();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  // Persist conversation list whenever it changes
  useEffect(() => {
    if (storageReady) storage.set("ceg:convos", convList);
  }, [convList, storageReady]);

  // Track session in analytics
  useEffect(() => {
    (async () => {
      const analytics = (await storage.get("ceg:analytics")) ?? { sessions:0, messages:0, tiers:{}, tenants:{}, lastSeen:null };
      analytics.sessions++;
      analytics.tenants[tenant] = (analytics.tenants[tenant] ?? 0) + 1;
      analytics.lastSeen = new Date().toISOString();
      await storage.set("ceg:analytics", analytics);
    })();
  }, []); // eslint-disable-line

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || streaming) return;
    const userMsg = { id: Date.now(), role:"user", content };
    const asstMsg = { id: Date.now()+1, role:"assistant", content:"" };
    const newMsgs = [...messages, userMsg];

    setMessages([...newMsgs, asstMsg]);
    setInput("");
    setStreaming(true);
    if (textRef.current) textRef.current.style.height = "auto";

    // Detect tier
    const detected = detectTier(content);
    if (detected !== "unknown") setTier(detected);

    // Create conversation entry on first message
    let currentConvId = convId;
    if (messages.length === 0) {
      const newId = `ceg:conv:${Date.now()}`;
      currentConvId = newId;
      setConvId(newId);
      const entry = { id: newId, title: content.slice(0,50)+(content.length>50?"…":""), date: new Date().toISOString(), tenant };
      setConvList(prev => [entry, ...prev.slice(0,49)]); // keep last 50
    }

    // Stream from Claude
    let fullText = "";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1500, system:tc.systemPrompt, stream:true,
          messages: newMsgs.map(m => ({ role:m.role, content:m.content })),
        }),
      });

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream:true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const d = line.slice(6).trim();
          if (d === "[DONE]") continue;
          try {
            const p = JSON.parse(d);
            if (p.type === "content_block_delta" && p.delta?.type === "text_delta") {
              fullText += p.delta.text;
              setMessages(prev => { const u=[...prev]; u[u.length-1]={...u[u.length-1],content:fullText}; return u; });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => { const u=[...prev]; u[u.length-1]={...u[u.length-1],content:"Connection error. Please try again."}; return u; });
    } finally {
      setStreaming(false);
    }

    // Persist messages to storage
    if (currentConvId) {
      const finalMsgs = [...newMsgs, { id: Date.now()+1, role:"assistant", content:fullText }];
      await storage.set(currentConvId, finalMsgs);
    }

    // Update analytics
    const analytics = (await storage.get("ceg:analytics")) ?? { sessions:0, messages:0, tiers:{}, tenants:{} };
    analytics.messages = (analytics.messages ?? 0) + 1;
    if (detected !== "unknown") analytics.tiers[detected] = (analytics.tiers[detected] ?? 0) + 1;
    await storage.set("ceg:analytics", analytics);
  }, [messages, streaming, convId, tenant]);

  const loadConversation = useCallback(async (id) => {
    const msgs = await storage.get(id);
    if (msgs) { setMessages(msgs); setConvId(id); setTier("unknown"); }
  }, []);

  const newConversation = () => { setMessages([]); setTier("unknown"); setInput(""); setConvId(null); };

  const deleteConversation = async (id, e) => {
    e.stopPropagation();
    await storage.del(id);
    setConvList(prev => prev.filter(c => c.id !== id));
    if (convId === id) newConversation();
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans',sans-serif", background:C.lightMid }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{ width:260, background:C.navy, display:"flex", flexDirection:"column", flexShrink:0, borderRight:`1px solid ${C.navyLight}` }}>
          <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:tc.accentBg,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.85rem", fontWeight:800, color:C.white, fontFamily:"'Barlow Condensed',sans-serif" }}>CG</div>
              <div>
                <div style={{ color:C.white, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.95rem", lineHeight:1 }}>{tc.sidebarLabel}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase" }}>{tc.sidebarSub}</div>
              </div>
            </div>
            <button onClick={newConversation} style={{ width:"100%", background:C.orange, color:C.white,
              borderRadius:8, padding:"8px 14px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.8rem",
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.orangeLight}
              onMouseLeave={e=>e.currentTarget.style.background=C.orange}>
              <span style={{ fontSize:"1rem" }}>+</span> New Conversation
            </button>
          </div>

          {/* Conversation history */}
          <div style={{ flex:1, overflow:"auto", padding:"10px 6px" }}>
            {convList.length > 0 && (
              <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.3)", padding:"0 8px 6px", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600 }}>Recent</div>
            )}
            {convList.map(c => (
              <div key={c.id} onClick={() => loadConversation(c.id)} style={{ display:"flex", alignItems:"center",
                padding:"7px 10px", borderRadius:6, cursor:"pointer",
                background: convId===c.id ? "rgba(255,255,255,0.1)" : "transparent",
                transition:"background 0.15s", marginBottom:1, gap:6 }}
                onMouseEnter={e => { if (convId!==c.id) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (convId!==c.id) e.currentTarget.style.background="transparent"; }}>
                <span style={{ fontSize:"0.75rem" }}>💬</span>
                <span style={{ flex:1, fontSize:"0.78rem", color:"rgba(255,255,255,0.65)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {c.title}
                </span>
                <button onClick={(e) => deleteConversation(c.id, e)}
                  style={{ color:"rgba(255,255,255,0.2)", fontSize:"0.75rem", padding:"0 2px", lineHeight:1 }}
                  onMouseEnter={e=>e.target.style.color="rgba(255,100,100,0.7)"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}>✕</button>
              </div>
            ))}
            {convList.length === 0 && storageReady && (
              <div style={{ padding:"20px 12px", fontSize:"0.75rem", color:"rgba(255,255,255,0.25)", textAlign:"center", lineHeight:1.6 }}>
                Your conversations<br/>will appear here
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ marginBottom:6 }}><TenantBadge tenant={tenant} /></div>
            <div style={{ marginBottom:10 }}><AudienceBadge tier={tier} /></div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => onNavigate("assess")} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.55)",
                borderRadius:6, padding:"5px", fontSize:"0.68rem", cursor:"pointer" }}>📊 Assessment</button>
              <button onClick={() => onNavigate("admin")} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.55)",
                borderRadius:6, padding:"5px", fontSize:"0.68rem", cursor:"pointer" }}>📈 Admin</button>
              <button onClick={() => onNavigate("landing")} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.55)",
                borderRadius:6, padding:"5px", fontSize:"0.68rem", cursor:"pointer" }}>🏠</button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Header */}
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"11px 18px",
          display:"flex", alignItems:"center", gap:10, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
          <button onClick={() => setSidebarOpen(o=>!o)} style={{ width:30, height:30, borderRadius:6,
            display:"flex", alignItems:"center", justifyContent:"center", background:C.lightMid, color:C.textMuted }}>☰</button>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.navy, fontSize:"1rem", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {messages.length === 0 ? "Claude Ecosystem Guide" : (messages[0]?.content?.slice(0,55) ?? "") + "…"}
          </div>
          <span className="hide-mobile" style={{ fontSize:"0.72rem", color:C.textMuted }}>⌘↵ to send</span>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflow:"auto", padding:"20px 16px" }}>
          {messages.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", textAlign:"center", padding:"0 16px" }}>
              <div style={{ width:60, height:60, borderRadius:14, background:`linear-gradient(135deg,${C.blue},${C.navy})`,
                display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18,
                boxShadow:`0 8px 24px ${C.blue}40`, fontSize:"1.5rem" }}>✦</div>
              <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(1.4rem,4vw,1.9rem)", fontWeight:800, color:C.navy, marginBottom:8 }}>
                {tc.welcomeTitle}
              </h2>
              <p style={{ color:C.textMuted, fontSize:"0.88rem", maxWidth:400, lineHeight:1.6 }}>
                {tc.welcomeSub}
              </p>
              <Chips onSelect={sendMessage} suggestions={tc.chips} />
            </div>
          ) : (
            <div style={{ maxWidth:760, margin:"0 auto" }}>
              {messages.map((m,i) => (
                <ChatMessage key={m.id} message={m} isNew={i>=messages.length-2} />
              ))}
              {streaming && messages[messages.length-1]?.content==="" && <Dots />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ background:C.white, borderTop:`1px solid ${C.border}`, padding:"14px 16px", boxShadow:"0 -2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"flex", gap:8, alignItems:"flex-end", background:C.lightMid,
              borderRadius:12, padding:"7px 7px 7px 14px", border:`1.5px solid ${C.border}` }}>
              <textarea ref={textRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if ((e.metaKey||e.ctrlKey)&&e.key==="Enter") { e.preventDefault(); sendMessage(input); } }}
                onInput={e => { e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,144)+"px"; }}
                placeholder="Ask anything about Claude…" rows={1}
                style={{ flex:1, resize:"none", border:"none", background:"transparent", fontFamily:"'DM Sans',sans-serif",
                  fontSize:"0.9rem", color:C.text, lineHeight:1.5, maxHeight:144, overflow:"auto", padding:"3px 0" }}
              />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()||streaming} style={{ width:34, height:34, borderRadius:8,
                background: input.trim()&&!streaming ? C.orange : C.border,
                color: input.trim()&&!streaming ? C.white : C.textMuted,
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.15s", fontSize:"0.95rem", flexShrink:0 }}>➤</button>
            </div>
            <div style={{ textAlign:"center", marginTop:5, fontSize:"0.68rem", color:C.textMuted }}>
              {tc.footerNote}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const QUESTIONS = [
  { id:"strategy",    title:"Strategy & Vision",    q:"Does your organization have a formal AI strategy?",
    opts:["Not started","We're discussing it","Strategy drafted","Strategy approved","Actively executing"] },
  { id:"data",        title:"Data & Infrastructure", q:"How would you describe your organization's data readiness for AI?",
    opts:["Siloed and manual","Some structure","Centralized but messy","Clean and accessible","Governed and queryable"] },
  { id:"talent",      title:"Talent & Culture",      q:"What's your team's current AI literacy level?",
    opts:["Skeptical / resistant","Curious but untrained","A few champions","Broad awareness","AI-native culture"] },
  { id:"governance",  title:"Governance & Security", q:"Do you have AI usage policies and security controls in place?",
    opts:["None","Informal discussions","Policies drafted","Policies enforced","Mature AI governance"] },
  { id:"execution",   title:"Use Case Execution",    q:"Where are you in executing AI use cases?",
    opts:["No use cases","1–2 experiments","A few pilots running","Several in production","AI in core workflows"] },
];

const TIERS = {
  exploring: { label:"EXPLORING", color:"#c47a2a", bg:"#fff8e8" },
  adopting:  { label:"ADOPTING",  color:"#2a7a6a", bg:"#e8f8f4" },
  scaling:   { label:"SCALING",   color:C.blue,    bg:"#e8f4ff" },
  leading:   { label:"LEADING",   color:"#5a2a8a", bg:"#f4e8ff" },
};

function AssessPage({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = Object.values(answers).reduce((s,v)=>s+v,0);
  const tier = total<=10?"exploring":total<=15?"adopting":total<=20?"scaling":"leading";
  const q = QUESTIONS[step-1];

  const score = async () => {
    setLoading(true); setStep(6);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:900,
          messages:[{ role:"user", content:`AI maturity assessor. Organization scores (1-5):
Strategy: ${answers.strategy}/5, Data: ${answers.data}/5, Talent: ${answers.talent}/5, Governance: ${answers.governance}/5, Execution: ${answers.execution}/5
Total: ${total}/25, Tier: ${tier.toUpperCase()}

Respond ONLY with JSON (no markdown):
{"summary":"2-3 sentence assessment","strengths":["top strength"],"recommendations":["3 specific next steps"]}` }]
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text ?? "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      const r = { ...parsed, scores:answers, total, tier };
      setResult(r);

      // Persist to storage
      const existing = (await storage.get("ceg:assessments")) ?? [];
      await storage.set("ceg:assessments", [{ ...r, date:new Date().toISOString() }, ...existing.slice(0,9)]);
    } catch {
      setResult({ summary:"Assessment complete.", strengths:[], recommendations:["Reach out for a free consult to discuss your results."], scores:answers, total, tier });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.navy} 0%,#1a3a5c 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      {step===0 && (
        <div className="fade-up" style={{ background:C.white, borderRadius:20, padding:"44px 36px", maxWidth:480, width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
          <div style={{ width:68, height:68, borderRadius:16, background:`linear-gradient(135deg,${C.orange},${C.orangeLight})`,
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:"1.7rem", boxShadow:`0 8px 24px ${C.orange}50` }}>📊</div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"2rem", fontWeight:800, color:C.navy, marginBottom:10 }}>AI Architecture Assessment</h1>
          <p style={{ color:C.textMuted, lineHeight:1.7, marginBottom:6 }}>Understand your organization's AI maturity and what to do next.</p>
          <p style={{ color:C.textMuted, fontSize:"0.82rem", marginBottom:28 }}>5 questions · 3 minutes · Instant results</p>
          <button onClick={() => setStep(1)} style={{ width:"100%", background:C.orange, color:C.white, border:"none", borderRadius:12,
            padding:"15px", fontSize:"0.95rem", fontWeight:700, cursor:"pointer",
            fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.04em",
            boxShadow:`0 4px 16px ${C.orange}60`, transition:"all 0.2s" }}
            onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.target.style.transform="translateY(0)";}}>
            START ASSESSMENT →
          </button>
          <div style={{ marginTop:16, fontSize:"0.72rem", color:C.textMuted }}>HumanX 2026 · Powered by Claude</div>
        </div>
      )}

      {step>=1&&step<=5 && (
        <div className="fade-up" style={{ background:C.white, borderRadius:20, padding:"36px", maxWidth:540, width:"100%", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <div style={{ flex:1, height:4, background:C.light, borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(step/5)*100}%`, background:C.orange, borderRadius:2, transition:"width 0.4s ease" }} />
            </div>
            <span style={{ fontSize:"0.75rem", color:C.textMuted, fontWeight:600, flexShrink:0 }}>{step}/5</span>
          </div>
          <div style={{ fontSize:"0.68rem", fontWeight:700, color:C.orange, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>{q.title}</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.5rem", fontWeight:700, color:C.navy, marginBottom:24, lineHeight:1.2 }}>{q.q}</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {q.opts.map((opt,i) => {
              const val=i+1, sel=answers[q.id]===val;
              return (
                <button key={i} onClick={() => setAnswers(p=>({...p,[q.id]:val}))} style={{ padding:"12px 18px", borderRadius:10, textAlign:"left",
                  border:`2px solid ${sel?C.orange:C.border}`, background:sel?`${C.orange}10`:C.white,
                  color:sel?C.orange:C.text, fontWeight:sel?600:400, fontSize:"0.86rem", cursor:"pointer",
                  transition:"all 0.15s", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:10 }}
                  onMouseEnter={e=>{if(!sel)e.currentTarget.style.borderColor=C.orange+"60";}}
                  onMouseLeave={e=>{if(!sel)e.currentTarget.style.borderColor=C.border;}}>
                  <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                    border:`2px solid ${sel?C.orange:C.border}`, background:sel?C.orange:"transparent",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {sel && <div style={{ width:7, height:7, borderRadius:"50%", background:C.white }} />}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:24 }}>
            {step>1 && <button onClick={() => setStep(s=>s-1)} style={{ padding:"11px 22px", borderRadius:10,
              border:`2px solid ${C.border}`, background:"transparent", color:C.textMuted, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>← Back</button>}
            <button onClick={() => answers[q.id]&&(step<5?setStep(s=>s+1):score())} disabled={!answers[q.id]} style={{ flex:1, padding:"11px 22px", borderRadius:10, border:"none",
              background:answers[q.id]?C.navy:C.border, color:answers[q.id]?C.white:C.textMuted,
              cursor:answers[q.id]?"pointer":"default", fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:700, fontSize:"0.95rem", letterSpacing:"0.04em", transition:"background 0.15s" }}>
              {step<5?"NEXT →":"GET RESULTS →"}
            </button>
          </div>
        </div>
      )}

      {step===6 && (
        loading ? (
          <div style={{ textAlign:"center", color:C.white }}>
            <div style={{ fontSize:"3rem", marginBottom:18, animation:"spin 1.5s linear infinite", display:"inline-block" }}>⟳</div>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.8rem", fontWeight:700 }}>Analyzing your responses…</h2>
            <p style={{ opacity:0.55, marginTop:8 }}>Claude is generating your personalized assessment</p>
          </div>
        ) : result && (
          <div className="fade-up" style={{ background:C.white, borderRadius:20, padding:"36px", maxWidth:580, width:"100%", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
            {(() => { const t=TIERS[result.tier]; return (
              <div style={{ background:t.bg, border:`2px solid ${t.color}30`, borderRadius:14, padding:"18px 22px", marginBottom:20, textAlign:"center" }}>
                <div style={{ fontSize:"0.68rem", fontWeight:700, color:t.color, letterSpacing:"0.1em", marginBottom:4 }}>AI MATURITY TIER</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"2.6rem", fontWeight:800, color:t.color, lineHeight:1 }}>{t.label}</div>
                <div style={{ fontSize:"1.3rem", fontWeight:700, color:t.color, opacity:0.7, marginTop:3 }}>{result.total}/25</div>
              </div>
            );})()}
            <p style={{ color:C.textMuted, lineHeight:1.7, marginBottom:20, fontSize:"0.88rem" }}>{result.summary}</p>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.navy, marginBottom:10 }}>DIMENSION SCORES</div>
              {QUESTIONS.map(dq => (
                <div key={dq.id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.78rem", marginBottom:3 }}>
                    <span style={{ color:C.text, fontWeight:500 }}>{dq.title}</span>
                    <span style={{ color:C.textMuted }}>{result.scores[dq.id]}/5</span>
                  </div>
                  <div style={{ height:6, background:C.light, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(result.scores[dq.id]/5)*100}%`, background:`linear-gradient(90deg,${C.blue},${C.orange})`, borderRadius:3, transition:"width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
            {result.recommendations?.length>0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.navy, marginBottom:10 }}>TOP RECOMMENDATIONS</div>
                {result.recommendations.map((r,i) => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start",
                    background:C.lightMid, borderRadius:10, padding:"10px 12px", marginBottom:7, border:`1px solid ${C.border}` }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:C.orange, color:C.white,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, flexShrink:0 }}>{i+1}</div>
                    <p style={{ fontSize:"0.83rem", color:C.text, lineHeight:1.5 }}>{r}</p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => onNavigate("chat")} style={{ flex:1, background:C.navy, color:C.white, border:"none",
                borderRadius:12, padding:"13px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.95rem", cursor:"pointer", letterSpacing:"0.04em" }}>
                TALK TO THE GUIDE →
              </button>
              <button onClick={() => { setStep(0); setAnswers({}); setResult(null); }} style={{ padding:"13px 16px", background:"transparent",
                border:`2px solid ${C.border}`, borderRadius:12, color:C.textMuted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                Retake
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PAGE — Real data from window.storage
// ═══════════════════════════════════════════════════════════════════════════════
function AdminPage({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, asmt, c] = await Promise.all([
        storage.get("ceg:analytics"),
        storage.get("ceg:assessments"),
        storage.get("ceg:convos"),
      ]);
      setAnalytics(a ?? { sessions:0, messages:0, tiers:{}, tenants:{} });
      setAssessments(asmt ?? []);
      setConvos(c ?? []);
      setLoading(false);
    })();
  }, []);

  const clearAll = async () => {
    if (!confirm("Clear all stored analytics and conversation history?")) return;
    const keys = await storage.list("ceg:");
    for (const k of keys) await storage.del(k.key ?? k);
    setAnalytics({ sessions:0, messages:0, tiers:{}, tenants:{} });
    setAssessments([]);
    setConvos([]);
  };

  const totalTierMessages = analytics ? Object.values(analytics.tiers).reduce((s,v)=>s+v,0) : 0;

  const tierData = [
    { id:"developer",       label:"Developer",       color:"#2d7a50" },
    { id:"enterprise",      label:"Enterprise",      color:"#3d4faa" },
    { id:"power-user",      label:"Power User",      color:C.blue    },
    { id:"non-technical",   label:"Non-Technical",   color:"#4a6080" },
  ];

  const assessTierCounts = assessments.reduce((acc,a) => { acc[a.tier]=(acc[a.tier]??0)+1; return acc; },{});

  return (
    <div style={{ minHeight:"100vh", background:C.lightMid, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:C.navy, padding:"16px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:C.orange, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:"0.85rem", fontWeight:800, color:C.white, fontFamily:"'Barlow Condensed',sans-serif" }}>CG</div>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.white, fontSize:"1.1rem" }}>Admin Dashboard</div>
            <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.35)", letterSpacing:"0.06em", textTransform:"uppercase" }}>Real data · Stored locally</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={clearAll} style={{ color:"rgba(255,100,100,0.6)", fontSize:"0.78rem", cursor:"pointer", background:"none", border:"none", fontFamily:"'DM Sans',sans-serif" }}>Clear data</button>
          <button onClick={() => onNavigate("landing")} style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.82rem", cursor:"pointer", background:"none", border:"none", fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"28px 20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:C.textMuted }}>Loading stored data…</div>
        ) : (
          <>
            {/* KPI row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:24 }}>
              {[
                { label:"Total Sessions", value:analytics.sessions, color:C.blue, sub:"Unique opens" },
                { label:"Messages Sent", value:analytics.messages, color:C.orange, sub:"All conversations" },
                { label:"Conversations Saved", value:convos.length, color:"#2d7a50", sub:"In storage" },
                { label:"Assessments Run", value:assessments.length, color:"#5a2a8a", sub:"Last 10 stored" },
              ].map(s => (
                <div key={s.label} style={{ background:C.white, borderRadius:12, padding:"18px 20px",
                  border:`1.5px solid ${C.border}`, borderLeft:`4px solid ${s.color}` }}>
                  <div style={{ fontSize:"0.66rem", color:C.textMuted, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:5 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"2rem", fontWeight:800, color:C.navy }}>{s.value}</div>
                  <div style={{ fontSize:"0.72rem", color:s.color, fontWeight:500, marginTop:2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
              {/* Audience tier breakdown */}
              <div style={{ background:C.white, borderRadius:12, padding:"22px", border:`1.5px solid ${C.border}` }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.navy, marginBottom:18, letterSpacing:"0.04em" }}>AUDIENCE TIER BREAKDOWN</div>
                {tierData.map(t => {
                  const count = analytics.tiers[t.id] ?? 0;
                  const pct = totalTierMessages > 0 ? Math.round((count/totalTierMessages)*100) : 0;
                  return (
                    <div key={t.id} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.78rem", marginBottom:4 }}>
                        <span style={{ color:C.text, fontWeight:500 }}>{t.label}</span>
                        <span style={{ color:C.textMuted }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height:6, background:C.light, borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:t.color, borderRadius:3, transition:"width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
                {totalTierMessages === 0 && <p style={{ fontSize:"0.8rem", color:C.textMuted }}>No audience signals detected yet.</p>}
              </div>

              {/* Tenant breakdown */}
              <div style={{ background:C.white, borderRadius:12, padding:"22px", border:`1.5px solid ${C.border}` }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.navy, marginBottom:18, letterSpacing:"0.04em" }}>TENANT / ACCESS MODE</div>
                {["internal","humanx","client"].map(tenant => {
                  const count = analytics.tenants?.[tenant] ?? 0;
                  const total = Object.values(analytics.tenants ?? {}).reduce((s,v)=>s+v,0);
                  const pct = total > 0 ? Math.round((count/total)*100) : 0;
                  const t = TENANT_META[tenant];
                  return (
                    <div key={tenant} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                        <TenantBadge tenant={tenant} />
                        <span style={{ fontSize:"0.78rem", color:C.textMuted }}>{count} sessions</span>
                      </div>
                      <div style={{ height:6, background:C.light, borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:t.color, borderRadius:3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assessment results */}
            {assessments.length > 0 && (
              <div style={{ background:C.white, borderRadius:12, border:`1.5px solid ${C.border}`, overflow:"hidden", marginBottom:18 }}>
                <div style={{ padding:"14px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.navy, letterSpacing:"0.04em" }}>RECENT ASSESSMENTS</span>
                  <div style={{ display:"flex", gap:6 }}>
                    {Object.entries(TIERS).map(([k,v]) => (
                      assessTierCounts[k] ? (
                        <span key={k} style={{ background:v.bg, color:v.color, padding:"2px 10px", borderRadius:12, fontSize:"0.68rem", fontWeight:700 }}>
                          {v.label}: {assessTierCounts[k]}
                        </span>
                      ) : null
                    ))}
                  </div>
                </div>
                <div style={{ overflow:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.82rem" }}>
                    <thead>
                      <tr style={{ background:C.lightMid }}>
                        {["Tier","Score","Strategy","Data","Talent","Gov","Execution","Date"].map(h => (
                          <th key={h} style={{ padding:"8px 14px", textAlign:"left", fontSize:"0.65rem", fontWeight:700, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((a,i) => {
                        const t = TIERS[a.tier];
                        return (
                          <tr key={i} style={{ borderTop:`1px solid ${C.border}` }}>
                            <td style={{ padding:"10px 14px" }}>
                              <span style={{ background:t.bg, color:t.color, padding:"2px 8px", borderRadius:10, fontSize:"0.68rem", fontWeight:700 }}>{t.label}</span>
                            </td>
                            <td style={{ padding:"10px 14px", fontWeight:600, color:C.text }}>{a.total}/25</td>
                            {["strategy","data","talent","governance","execution"].map(k => (
                              <td key={k} style={{ padding:"10px 14px", color:C.textMuted }}>{a.scores?.[k]??"-"}/5</td>
                            ))}
                            <td style={{ padding:"10px 14px", color:C.textMuted, fontSize:"0.75rem" }}>
                              {a.date ? new Date(a.date).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent conversations */}
            {convos.length > 0 && (
              <div style={{ background:C.white, borderRadius:12, border:`1.5px solid ${C.border}`, overflow:"hidden" }}>
                <div style={{ padding:"14px 22px", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:C.navy, letterSpacing:"0.04em" }}>CONVERSATION HISTORY</span>
                </div>
                <div style={{ padding:"8px 0" }}>
                  {convos.slice(0,15).map((c,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", padding:"9px 22px", gap:12,
                      borderBottom: i < Math.min(convos.length,15)-1 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize:"0.9rem" }}>💬</span>
                      <span style={{ flex:1, fontSize:"0.82rem", color:C.text }}>{c.title}</span>
                      <TenantBadge tenant={c.tenant} />
                      <span style={{ fontSize:"0.72rem", color:C.textMuted }}>
                        {c.date ? new Date(c.date).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analytics.sessions === 0 && (
              <div style={{ textAlign:"center", padding:"40px", color:C.textMuted, background:C.white, borderRadius:12, border:`1.5px solid ${C.border}` }}>
                <div style={{ fontSize:"2rem", marginBottom:12 }}>📊</div>
                <p style={{ fontSize:"0.88rem" }}>No usage data yet. Start chatting or run an assessment to see analytics here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LandingPage({ onNavigate }) {
  const cards = [
    { icon:"⚡", title:"Personal",          sub:"Strategy + project inventory", desc:"Prioritize projects, surface income opportunities, decide what ships next. Your strategic advisor that knows your full situation.",        tenant:"personal",  badge:"Private",       badgeColor:"#7c3aed", dest:"chat"   },
    { icon:"📊", title:"AI Assessment",     sub:"5-question diagnostic",        desc:"Understand your AI maturity in 3 minutes. No account needed. Instant scored results.",                                                       tenant:"humanx",    badge:"3 min",         badgeColor:"#b91c1c", dest:"assess" },
    { icon:"🎯", title:"Customization Svc", sub:"For prospective clients",      desc:"Discover what AI can actually do for your business — no jargon, no hype. Find out if a custom AI setup is right for your team.",           tenant:"prospect",  badge:"Free Consult",  badgeColor:"#0e7490", dest:"chat"   },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.lightMid, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:`linear-gradient(160deg,#1a0533 0%,#2d1060 55%,#1c0e4a 100%)`, padding:"72px 24px 64px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(#a855f720 1px,transparent 1px)`, backgroundSize:"32px 32px", opacity:0.5 }} />
        <div className="fade-up" style={{ position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:24, padding:"5px 16px", marginBottom:20 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#a855f7" }} />
            <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.06em" }}>HUMANX 2026 · AI ECOSYSTEM</span>
          </div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(2.6rem,6vw,4.2rem)", fontWeight:800, color:C.white, lineHeight:1, marginBottom:18 }}>
            Claude Ecosystem Guide
          </h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"1.05rem", maxWidth:500, margin:"0 auto 36px", lineHeight:1.7 }}>
            Expert reference, strategic advisor, and client discovery tool — built for the HumanX ecosystem.
          </p>
          <button onClick={() => onNavigate("chat", "humanx")} style={{ background:"#b91c1c", color:C.white, border:"none", borderRadius:12,
            padding:"15px 34px", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"1.05rem",
            cursor:"pointer", letterSpacing:"0.04em", boxShadow:`0 8px 24px #b91c1c50`, transition:"all 0.2s" }}
            onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.target.style.transform="translateY(0)";}}>
            EXPLORE CLAUDE →
          </button>
        </div>
      </div>

      <div style={{ maxWidth:920, margin:"0 auto", padding:"52px 20px" }}>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.3rem", fontWeight:700, color:C.navy, textAlign:"center", marginBottom:28, letterSpacing:"0.04em" }}>
          CHOOSE YOUR MODE
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:18 }}>
          {cards.map(card => (
            <div key={card.tenant} className="fade-up" onClick={() => onNavigate(card.dest, card.tenant)} style={{ background:C.white, borderRadius:16, padding:"26px 22px",
              border:`1.5px solid ${C.border}`, cursor:"pointer", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor=card.badgeColor+"80";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor=C.border;}}>
              <div style={{ fontSize:"1.8rem", marginBottom:12 }}>{card.icon}</div>
              <div style={{ display:"inline-block", background:card.badgeColor+"18", color:card.badgeColor, padding:"2px 10px", borderRadius:20, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:9 }}>{card.badge}</div>
              <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.3rem", fontWeight:800, color:C.navy, marginBottom:3 }}>{card.title}</h3>
              <div style={{ fontSize:"0.74rem", color:C.textMuted, marginBottom:9 }}>{card.sub}</div>
              <p style={{ fontSize:"0.83rem", color:C.text, lineHeight:1.6 }}>{card.desc}</p>
              <div style={{ marginTop:18, color:card.badgeColor, fontWeight:700, fontSize:"0.82rem", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.04em" }}>OPEN →</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop:`1px solid ${C.border}`, padding:"20px", textAlign:"center", fontSize:"0.76rem", color:C.textMuted }}>
        Claude Ecosystem Guide · HumanX 2026 · Powered by Anthropic Claude
        <button onClick={() => onNavigate("admin")} style={{ marginLeft:14, color:C.textMuted, textDecoration:"underline", background:"none", border:"none", fontSize:"0.76rem", cursor:"pointer" }}>Admin</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [tenant, setTenant] = useState("personal");

  const navigate = (dest, t) => {
    if (t) setTenant(t);
    setPage(dest);
  };

  return (
    <>
      <GlobalStyles />
      {page === "landing" && <LandingPage onNavigate={navigate} />}
      {page === "chat"    && <ChatPage tenant={tenant} onNavigate={navigate} />}
      {page === "assess"  && <AssessPage onNavigate={navigate} />}
      {page === "admin"   && <AdminPage onNavigate={navigate} />}
    </>
  );
}
