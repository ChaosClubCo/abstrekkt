/**
 * Claude Enablement Suite — 6/7: Objection Handler
 *
 * Searchable pre-loaded Q&A covering real-world objections, pushback,
 * and concern categories the facilitator encounters during enablement.
 * Claude API handles questions not covered by the pre-loaded library.
 * No storage needed — stateless reference tool.
 */

import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#156082", accent: "#E97132", done: "#15803d",
  navy: "#0E2841", muted: "#64748b", border: "#e2e8f0", bg: "#f8fafc",
  blocked: "#dc2626", active: "#7c3aed",
};

const QA_LIBRARY = [
  // SECURITY & DATA
  {
    id: "s1", category: "Security & Data",
    q: "Does Anthropic train on our company data?",
    a: "No. On Pro, Team, and Enterprise plans, and via the API, Anthropic does not use your conversations to train models. Free plan users may have their data used for training by default — another reason to upgrade to Pro for work use. You can verify this at anthropic.com/legal/privacy.",
    tags: ["privacy", "training", "data"],
  },
  {
    id: "s2", category: "Security & Data",
    q: "What happens if I paste confidential data into Claude?",
    a: "On Pro+ and API, your conversations are not used for training and are stored per Anthropic's retention policy (configurable on Enterprise). That said, treat Claude the same way you'd treat any cloud service — don't paste credential strings, unmasked PII sets, or regulated data unless your org has reviewed and approved it. Use the Enterprise plan for SOC 2 Type II compliance and configurable data retention.",
    tags: ["confidential", "security", "compliance"],
  },
  {
    id: "s3", category: "Security & Data",
    q: "Is Claude SOC 2 compliant?",
    a: "Yes — Anthropic holds SOC 2 Type II certification. This applies to the Enterprise plan which includes audit controls, data retention configuration, and SSO/SAML. Verify current status at trust.anthropic.com or contact sales for compliance documentation.",
    tags: ["SOC2", "compliance", "enterprise", "audit"],
  },
  {
    id: "s4", category: "Security & Data",
    q: "Can Claude leak data from one employee's session to another?",
    a: "No. Sessions are isolated. Claude has no persistent access to other users' conversations. Projects and memory are per-account. On Enterprise, admin controls further segment access by group.",
    tags: ["isolation", "sessions", "data leakage"],
  },
  {
    id: "s5", category: "Security & Data",
    q: "Can INT see my conversations with Claude?",
    a: "No. Claude accounts are individual — each employee authenticates directly with Anthropic. INT does not have visibility into your conversations, prompts, or outputs. INT sets up the program and trains you, but the tool itself is a direct relationship between you and Anthropic. On Enterprise plans, org admins can see usage metadata (seat activity, message volume) but not conversation content. If you are on a Team or Enterprise account provisioned by your org, your IT admin may have access to admin-level usage analytics — but not the content of what you and Claude discuss.",
    tags: ["INT", "visibility", "privacy", "MSP", "admin access"],
  },
  // RELIABILITY
  {
    id: "r1", category: "Reliability",
    q: "What if Claude makes something up? I can't use it for accuracy-critical work.",
    a: "Claude does hallucinate — less so than earlier models, but it still happens. The right mental model: Claude is a fast first draft, not a source of truth. Always verify claims in primary sources for high-stakes content. For accuracy-critical tasks, use Claude with web search enabled (it cites real-time sources) or use it for tasks where the output is inherently verifiable (code, structure, format) rather than factual claims.",
    tags: ["hallucination", "accuracy", "reliability", "trust"],
  },
  {
    id: "r2", category: "Reliability",
    q: "The results aren't very good. The output isn't useful.",
    a: "Usually a prompting issue, not a Claude limitation. Most weak outputs come from (1) vague instructions — Claude needs context and specificity, (2) no examples of what 'good' looks like, (3) no system instructions via Projects. Start with: add role context, explain the format you want, give an example. That alone improves output dramatically. The prompt package we build for you will have pre-tuned prompts for your specific use cases.",
    tags: ["quality", "prompting", "output", "not useful"],
  },
  {
    id: "r3", category: "Reliability",
    q: "Claude keeps refusing things that seem totally fine.",
    a: "Refusals are calibrated at the model level and have gotten significantly more precise in recent versions. If Claude refuses something legitimate, try rephrasing with more context about your professional role and purpose — 'As a security researcher at [org], I need to understand...' is treated differently than a bare request. Claude is also honest about uncertainty and will say 'I don't know' rather than confabulate, which can read as a refusal but is actually a feature.",
    tags: ["refusals", "safety", "restrictions"],
  },
  // JOB & IDENTITY
  {
    id: "j1", category: "Job Concerns",
    q: "Is this going to replace my job?",
    a: "This is a legitimate concern and deserves a real answer, not a dismissal. The honest position: Claude replaces specific tasks within jobs, not jobs themselves — at least on the current trajectory. The employees who have the most to gain are those who use Claude to do more, faster, not those who compete with it. The employees most at risk from AI are the ones who don't develop skills with it. The goal of this program is to put you in the first group.",
    tags: ["job displacement", "replacement", "future of work"],
  },
  {
    id: "j2", category: "Job Concerns",
    q: "My manager will think I'm not doing my own work.",
    a: "This is a cultural question that varies by org. The short answer: AI-assisted work is still your work — you're responsible for quality, direction, and judgment. A lawyer who uses Westlaw to research faster is still a lawyer. Frame it as a productivity multiplier, not a shortcut. If your org hasn't established AI use norms yet, this is worth raising with your manager proactively — clarity helps everyone.",
    tags: ["attribution", "integrity", "culture", "manager"],
  },
  {
    id: "j3", category: "Job Concerns",
    q: "I don't want to become dependent on AI.",
    a: "Healthy concern. The goal isn't dependency — it's augmentation. Claude should handle the mechanical parts of cognitive work (drafting, formatting, searching, structuring) so your capacity goes toward judgment, relationships, strategy, and creative work that actually requires you. If you're using Claude as a crutch for things you should know, that's worth self-monitoring. If you're using it to produce work that wasn't feasible before, that's the goal.",
    tags: ["dependency", "skills", "augmentation"],
  },
  // COMPETITOR COMPARISON
  {
    id: "c1", category: "vs. ChatGPT",
    q: "I already use ChatGPT. Why would I switch?",
    a: "You don't necessarily have to fully switch — the tools have different strengths. Claude's advantages for professional use: (1) longer context window (200K tokens standard vs. 128K), so it can handle large documents without losing track, (2) Projects + persistent instructions — you set up your role context once, (3) MCP connectors — Claude reads your actual Google Drive, Notion, and Slack data, (4) Claude Code for technical users — terminal-native coding agent, (5) consistently higher scores for instruction-following and less 'AI-sounding' writing. Try Claude on tasks where ChatGPT's output has felt generic.",
    tags: ["ChatGPT", "GPT-4", "comparison", "switch"],
  },
  {
    id: "c2", category: "vs. ChatGPT",
    q: "Our company is already paying for Microsoft Copilot. Why Claude?",
    a: "Copilot is tightly integrated into the Microsoft 365 surface — great for in-Word, in-Excel, in-Outlook use cases. Claude is a better choice when you need: (1) standalone complex reasoning tasks, (2) large document or codebase analysis outside of Office, (3) custom integrations beyond the M365 ecosystem via MCP, (4) a tool that works well across platforms (not just Microsoft tools), (5) Claude Code for technical staff. Many orgs run both — Copilot for in-Office actions, Claude for research, synthesis, and technical work.",
    tags: ["Copilot", "Microsoft", "M365", "comparison"],
  },
  {
    id: "c3", category: "vs. ChatGPT",
    q: "What about Google Gemini?",
    a: "Gemini integrates well into Google Workspace (Docs, Sheets, Drive) and has strong multimodal capability. Claude's differentiators: (1) stronger instruction-following and less 'AI writing' feel, (2) Claude Code — no equivalent in the Gemini ecosystem, (3) more mature MCP connector ecosystem, (4) better long-context retrieval on complex documents. If your team lives entirely in Google Workspace, Gemini's native integration has a usability advantage. Hybrid use is common.",
    tags: ["Gemini", "Google", "comparison"],
  },
  // COST & ROI
  {
    id: "m1", category: "Cost & ROI",
    q: "Is $20/month worth it?",
    a: "$20/month is $240/year. If Claude saves 30 minutes per week of knowledge work, that's 26 hours/year. At a loaded cost of even $30/hour, the break-even is under 8 hours of saved time per year — about 15 minutes per week. For most knowledge workers doing any volume of writing, research, or document work, the ROI case is straightforward. The harder question is whether the person will actually use it consistently enough to realize that value — which is exactly why we're running this program.",
    tags: ["cost", "ROI", "value", "price"],
  },
  {
    id: "m2", category: "Cost & ROI",
    q: "I tried it once and it wasn't impressive.",
    a: "Out-of-the-box Claude is decent. Properly configured Claude — with Projects, custom instructions, memory edits, and prompt packages tuned for your role — is a different tool. Almost everyone who tries Claude without setup, with a generic prompt, gets generic output. The setup we're doing today is specifically to close that gap. Come back to this objection in 2 weeks after using configured Claude on real work and let's compare.",
    tags: ["first impression", "setup", "onboarding"],
  },
  // TECHNICAL
  {
    id: "t1", category: "Technical",
    q: "How do I know what Claude knows vs. what it's making up?",
    a: "Claude will generally flag uncertainty when it recognizes it — phrases like 'I'm not certain' or 'you may want to verify this.' For factual questions where accuracy matters, enable web search (Claude cites real-time sources) or provide the source document directly (Claude quotes from it rather than from training). Claude also refuses to speculate about things it can't verify, which sometimes feels like a limitation but is actually the behavior you want for accuracy-critical work.",
    tags: ["hallucination", "uncertainty", "accuracy", "knowledge"],
  },
  {
    id: "t2", category: "Technical",
    q: "Can Claude see my files and emails automatically?",
    a: "Only if you explicitly connect them via Settings → Connectors. Claude has no passive access to your data. You control what's connected, and each connector requires your OAuth authentication. When you do connect tools, Claude can read and search them in conversation — but it doesn't proactively monitor them. Think of it as giving Claude permission to look something up when you ask, not continuous access.",
    tags: ["connectors", "files", "email", "access", "permissions"],
  },
  {
    id: "t3", category: "Technical",
    q: "What's the difference between Claude.ai and the Claude API?",
    a: "Claude.ai is the consumer/team interface — the chat interface, Projects, Memory, Connectors, all the UI features. It's what employees use day-to-day. The API is for developers building applications that use Claude programmatically — custom integrations, automations, embedded AI features. Most employees in this program will only need Claude.ai. Technical staff (engineers, IT) may find value in both: claude.ai for their own work, and the API for building internal tools.",
    tags: ["API", "interface", "developers", "technical"],
  },
];

const CATEGORIES = [...new Set(QA_LIBRARY.map(q => q.category))];

const AI_SYSTEM = `You are an expert Claude enablement trainer and objection handler. 
Answer questions about Claude (the AI), the claude.ai platform, and helping employees adopt AI tools.

Your audience: someone who is skeptical, cautious, or has legitimate concerns about using Claude at work.
Tone: Direct, honest, no hype. Acknowledge valid concerns. Don't over-promise.
Format: 2-4 concise sentences. Lead with the direct answer, then the nuance.
Length: Short. The person asking is mid-session and needs a quick, usable response.

You know the Anthropic product ecosystem well: claude.ai, Claude Code, Projects, Memory, Connectors, 
Artifacts, MCP, the API, model capabilities, plan tiers (Free/Pro/Max/Team/Enterprise).
Pricing: Pro $20/mo or $17/mo annual. Max $100-200/mo. Team and Enterprise: contact sales.
Data: No training on Pro/API/Enterprise data. SOC 2 Type II. Trust page: trust.anthropic.com.
When uncertain about current product details, say so and direct to support.claude.com.`;

export default function ObjectionHandler() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState({});
  const [aiInput,  setAiInput]  = useState("");
  const [aiMsgs,   setAiMsgs]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [tab,      setTab]      = useState("library");   // library | ai
  const abortRef  = useRef(null);
  const aiMsgRef  = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    if (aiMsgRef.current) aiMsgRef.current.scrollTop = aiMsgRef.current.scrollHeight;
  }, [aiMsgs]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const results = QA_LIBRARY.filter(item => {
    const matchCat = category === "all" || item.category === category;
    if (!query.trim()) return matchCat;
    const q = query.toLowerCase();
    return matchCat && (item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q)));
  });

  async function askAI() {
    const text = aiInput.trim();
    if (!text || loading) return;
    setAiInput("");
    setLoading(true);

    const userMsg = { role: "user", content: text };
    historyRef.current = [...historyRef.current, userMsg];
    setAiMsgs(prev => [...prev, userMsg]);

    abortRef.current = new AbortController();
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 600,
          system: AI_SYSTEM,
          messages: historyRef.current.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      if (!resp.ok) {
        const e = await resp.json().catch(() => ({}));
        throw new Error(e.error?.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const reply = data.content?.[0]?.text || "No response received.";
      const assistantMsg = { role: "assistant", content: reply };
      historyRef.current = [...historyRef.current, assistantMsg];
      setAiMsgs(prev => [...prev, assistantMsg]);
    } catch (err) {
      if (err.name === "AbortError") return;
      historyRef.current = historyRef.current.slice(0, -1);
      setAiMsgs(prev => [...prev, { role: "assistant", content: `Error: ${err.message}`, error: true }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui" }}>
      <div style={{ background: C.navy, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: "#60a5fa" }}>💬 Objection Handler</span>
        <div style={{ flex: 1 }}/>
        <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", border: "1px solid #2a4a6a" }}>
          {["library","ai"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "4px 12px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "system-ui", background: tab === t ? C.primary : "transparent", color: tab === t ? "#fff" : "#94a3b8" }}>
              {t === "library" ? "📚 Library" : "🤖 Ask AI"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 18px" }}>

        {tab === "library" && (
          <>
            {/* Search + filter */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search objections, keywords, concerns…"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "system-ui", outline: "none" }}/>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {["all", ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${category === cat ? C.primary : C.border}`, background: category === cat ? C.primary + "11" : "#fff", color: category === cat ? C.primary : "#475569", fontSize: 11, cursor: "pointer", fontFamily: "system-ui", fontWeight: category === cat ? 700 : 400 }}>
                  {cat === "all" ? `All (${QA_LIBRARY.length})` : `${cat} (${QA_LIBRARY.filter(q => q.category === cat).length})`}
                </button>
              ))}
            </div>

            {/* Results */}
            {!results.length
              ? (
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 30, textAlign: "center" }}>
                  <div style={{ color: C.muted, marginBottom: 10 }}>No matches in library.</div>
                  <button onClick={() => { setAiInput(query); setTab("ai"); }}
                    style={{ padding: "6px 14px", borderRadius: 4, border: "none", background: C.primary, color: "#fff", cursor: "pointer", fontFamily: "system-ui", fontSize: 12, fontWeight: 600 }}>
                    Ask AI instead →
                  </button>
                </div>
              )
              : results.map(item => {
                const isOpen = expanded[item.id];
                return (
                  <div key={item.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 8, overflow: "hidden" }}>
                    <div onClick={() => setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: C.primary + "11", color: C.primary, flexShrink: 0, marginTop: 2 }}>{item.category}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", lineHeight: 1.4 }}>{item.q}</div>
                        {!isOpen && <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{item.a.substring(0, 80)}…</div>}
                      </div>
                      <span style={{ color: C.muted, fontSize: 12, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, marginTop: 10, marginBottom: 10 }}>{item.a}</div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {item.tags.map(t => (
                            <button key={t} onClick={() => { setQuery(t); setExpanded({}); }}
                              style={{ fontSize: 10, padding: "1px 7px", background: C.bg, color: C.muted, borderRadius: 3, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "system-ui" }}>
                              #{t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            }
          </>
        )}

        {tab === "ai" && (
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Ask the AI Assistant</div>
              <div style={{ fontSize: 11, color: C.muted }}>For questions not covered by the library, or for custom context.</div>
            </div>

            <div ref={aiMsgRef} style={{ height: 340, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {!aiMsgs.length && (
                <div style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 20 }}>
                  Ask any question about Claude, objections you're facing, or how to respond to specific concerns.
                </div>
              )}
              {aiMsgs.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                  <div style={{ padding: "8px 10px", borderRadius: 6, fontSize: 12, lineHeight: 1.5,
                    background: m.role === "user" ? "#eff6ff" : "#f8fafc",
                    border: m.role === "user" ? "1px solid #bfdbfe" : m.error ? "1px solid #fca5a5" : `1px solid ${C.border}`,
                    color: m.error ? C.blocked : "inherit" }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", padding: "8px 10px", borderRadius: 6, fontSize: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.muted }}>
                  Thinking…
                </div>
              )}
            </div>

            <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") askAI(); }}
                placeholder="Ask about any Claude-related objection or concern… (Enter)"
                style={{ flex: 1, padding: "7px 10px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: "system-ui", outline: "none" }}/>
              <button onClick={askAI} disabled={!aiInput.trim() || loading}
                style={{ padding: "7px 14px", borderRadius: 4, border: "none", cursor: aiInput.trim() && !loading ? "pointer" : "not-allowed", background: aiInput.trim() && !loading ? C.primary : "#e2e8f0", color: aiInput.trim() && !loading ? "#fff" : C.muted, fontFamily: "system-ui", fontWeight: 600, fontSize: 12 }}>
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
