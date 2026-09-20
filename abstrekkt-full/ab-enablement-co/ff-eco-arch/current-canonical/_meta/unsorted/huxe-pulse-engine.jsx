import { useState, useEffect, useCallback } from "react";

// ── Brief Definitions ──────────────────────────────────────────────
const BRIEFS = [
  { id: 1,  name: "AI Breakthrough",        cluster: "execution", icon: "⚡", prompt: "Identify 1 real AI advancement from the last 72 hours that directly impacts MSP operations, developer tooling, or AI-assisted automation. Evaluate: is this signal or noise? If signal, give one concrete test Kyle can run today. If noise, explain why and what to watch instead." },
  { id: 2,  name: "MSP + AI Efficiency",     cluster: "execution", icon: "🔧", prompt: "Identify 1 specific MSP workflow (ticketing, onboarding, patching, monitoring, documentation) where AI can save measurable time this week. Provide: the current friction point, the AI-assisted alternative, estimated time savings, and implementation steps Kyle can execute today as an L1 tech." },
  { id: 3,  name: "Tool Kill / Keep",        cluster: "systems",   icon: "🗑️", prompt: "Evaluate Kyle's active tool stack. Identify 1 tool to remove (with migration path) and 1 tool to double down on (with specific underused feature). Decision criteria: overlap, cost, maintenance burden, integration quality. Be specific — name the tools." },
  { id: 4,  name: "Memory Augmentation",     cluster: "risk",      icon: "🧠", prompt: "Identify 1 knowledge retrieval or context persistence gap in Kyle's current system (Notion + Google Drive + Claude memory + Supabase). Propose a concrete fix: a new template, a tagging convention, a search pattern, or an automation that reduces 'I know I wrote this somewhere' moments." },
  { id: 5,  name: "Workflow Optimization",   cluster: "execution", icon: "⚙️", prompt: "Pick 1 workflow Kyle runs regularly (could be dev, MSP, content, or ops). Map the current state (steps, tools, friction). Redesign it to remove 1-2 steps or reduce context switches. Provide the specific implementation change, not abstract advice." },
  { id: 6,  name: "Real Use Case",           cluster: "execution", icon: "📋", prompt: "Find 1 concrete example of someone (company, indie dev, MSP) using AI effectively in a way Kyle hasn't tried yet. Source it. Break down: what they did, what stack they used, what result they got, and how Kyle could adapt it to his context (MSP + builder + FlashFusion)." },
  { id: 7,  name: "Builder Insight",         cluster: "builder",   icon: "🏗️", prompt: "Based on Kyle's recent building activity (Orchestrator, n8n workflows, WordPress a11y, Base44 apps), identify 1 pattern or lesson from yesterday's work that should be captured as a reusable principle. Frame it as: what happened, what it taught, and where to apply it next." },
  { id: 8,  name: "Trend Signal",            cluster: "content",   icon: "📡", prompt: "Identify 1 emerging trend in AI/dev tooling/MSP that is real (not hype). Criteria: has working implementations, growing adoption curve, relevant to Kyle's stack. Verdict: act now, watch closely, or ignore. If act now, provide the first concrete step." },
  { id: 9,  name: "Prompt Engineering",      cluster: "content",   icon: "✏️", prompt: "Create 1 production-ready prompt template Kyle can use today. Target: a recurring task in his MSP, dev, or content work. Format: ROLE / CONTEXT / TASK / CONSTRAINTS / OUTPUT. Include a test case showing expected input→output. Make it copy-paste ready." },
  { id: 10, name: "Automation Opportunity",  cluster: "execution", icon: "🤖", prompt: "Identify 1 manual process Kyle still does that could be automated with his current stack (n8n, Zapier, Make, Claude API, Supabase, GitHub Actions). Scope it: trigger, logic, output, estimated build time. If it's under 2 hours to build, provide the implementation spec." },
  { id: 11, name: "Failure Analysis",        cluster: "risk",      icon: "🔴", prompt: "Identify 1 thing that broke, stalled, or underperformed recently in Kyle's systems or workflows. Perform root cause analysis: what failed, why, what was the actual root cause (not the symptom), and what systemic fix prevents the entire class of failure — not just this instance." },
  { id: 12, name: "Stack Optimization",      cluster: "systems",   icon: "📦", prompt: "Evaluate 1 layer of Kyle's tech stack (frontend, backend, automation, monitoring, or AI). Is the current tool the right one? Is it configured optimally? Identify 1 specific config change, upgrade, or replacement that improves reliability, speed, or cost." },
  { id: 13, name: "AI vs Human Boundary",    cluster: "risk",      icon: "🧭", prompt: "Identify 1 task Kyle currently delegates to AI that might benefit from human judgment, OR 1 task he does manually that AI handles better now. Provide the specific boundary recommendation and why. No philosophy — just the practical call." },
  { id: 14, name: "Opportunity Signal",      cluster: "builder",   icon: "💡", prompt: "Identify 1 specific market gap, underserved niche, or unmet need in the MSP/AI/dev-tools space that Kyle could address with his current skills and stack. Validate: who would pay, how much, what's the minimum viable version, and what's the realistic timeline." },
  { id: 15, name: "System Thinking",         cluster: "systems",   icon: "🔄", prompt: "Identify 1 mental model or framework Kyle is using that might be outdated, incomplete, or causing blind spots. Propose the upgrade: what to replace it with, why the new model is better, and how to test the new model against real decisions this week." },
  { id: 16, name: "FlashFusion Feature",     cluster: "builder",   icon: "🚀", prompt: "Define 1 specific feature for the FlashFusion ecosystem (workshop platform, toolkit, or content layer). Provide: user story, acceptance criteria, technical scope (small/medium/large), and the first implementation step. Keep it tied to the current FlashFusion blueprint pillars." },
  { id: 17, name: "Content Engine",          cluster: "content",   icon: "📝", prompt: "Generate content assets Kyle can publish today: 3 hooks (attention-grabbing openers for LinkedIn/X), 1 short post (150-200 words, ready to publish), and 1 thread outline (5-7 tweet structure). Topic should align with Kyle's current work and builder brand." },
  { id: 18, name: "Market Positioning",      cluster: "risk",      icon: "🎯", prompt: "Assess Kyle's current positioning in 1 specific market (MSP AI consulting, AI builder community, FlashFusion platform). Where does he stand vs alternatives? What's the clearest differentiation? What's the 1 positioning move that would create the most separation this week?" },
  { id: 19, name: "Execution Focus",         cluster: "execution", icon: "🎯", prompt: "Cut through everything. What are the 3 highest-leverage tasks Kyle should complete today? For each: what it is, why it matters more than alternatives, and what 'done' looks like. Then identify the top 3 things to explicitly NOT do today (attractive distractions)." },
  { id: 20, name: "Dev Workflow",            cluster: "content",   icon: "💻", prompt: "Identify 1 improvement to Kyle's development workflow (IDE config, Git patterns, testing approach, deployment pipeline, code review process). Provide: the current friction, the fix, and implementation steps. Prioritize changes that save time every day, not one-off optimizations." },
  { id: 21, name: "AI Agent Design",         cluster: "builder",   icon: "🤖", prompt: "Design 1 AI agent that would solve a real problem in Kyle's MSP work, builder workflow, or FlashFusion ecosystem. Define: agent role, inputs, outputs, tools it needs, guard rails, and the simplest viable implementation using Kyle's current stack (Claude API + n8n + Supabase)." },
  { id: 22, name: "Data + Memory",           cluster: "systems",   icon: "💾", prompt: "Evaluate 1 aspect of Kyle's data architecture (Supabase schemas, Notion databases, Google Drive structure, or Claude memory). Is data accessible when needed? Is there redundancy or drift? Propose 1 schema change, migration, or cleanup that improves retrieval quality." },
  { id: 23, name: "Debugging Insight",       cluster: "systems",   icon: "🐛", prompt: "Identify 1 recurring bug pattern, error class, or debugging bottleneck in Kyle's recent work. Don't just fix the instance — solve the pattern. Propose: a linter rule, a test, a type guard, an architectural change, or a monitoring hook that catches the entire class." },
  { id: 24, name: "Monetization",            cluster: "builder",   icon: "💰", prompt: "Take 1 thing Kyle has already built (skill, workflow, template, tool, knowledge) and define a monetization path. Be specific: what's the product, who pays, what price, what channel, and what's the minimum viable version he could ship this week." },
  { id: 25, name: "Reset / Restart",         cluster: "risk",      icon: "♻️", prompt: "If Kyle had to rebuild his entire system from zero today with everything he knows now, what would he keep, what would he cut, and what would he do differently? Focus on 1 specific domain (stack, workflows, projects, or tools). The goal is simplification, not hypothetical — identify 1 real cut to make today." },
];

const CLUSTERS = {
  execution: { name: "Execution", color: "#22d3ee", weight: "High when blockers exist" },
  systems:   { name: "Systems",   color: "#a78bfa", weight: "High when drift detected" },
  builder:   { name: "Builder",   color: "#34d399", weight: "High when momentum exists" },
  risk:      { name: "Risk",      color: "#fb923c", weight: "High when overloaded" },
  content:   { name: "Content",   color: "#f472b6", weight: "Steady cadence" },
};

const WEEKDAY_BIAS = {
  0: "risk",      // Sunday — reset
  1: "execution", // Monday
  2: "builder",   // Tuesday
  3: "systems",   // Wednesday
  4: "content",   // Thursday
  5: "risk",      // Friday — review
  6: "builder",   // Saturday — build
};

// ── Scoring Engine ─────────────────────────────────────────────────
function scoreBriefs(briefs, state, history) {
  const today = new Date().getDay();
  const biasCluster = WEEKDAY_BIAS[today];
  const recentIds = (history || []).slice(0, 3).map(h => h.primaryId);
  const recentClusters = (history || []).slice(0, 3).flatMap(h => [
    briefs.find(b => b.id === h.primaryId)?.cluster,
    briefs.find(b => b.id === h.secondaryId)?.cluster,
  ].filter(Boolean));

  return briefs.map(b => {
    let score = 0;

    // Relevance: bias toward today's cluster
    const clusterMatch = b.cluster === biasCluster ? 8 : 5;
    score += clusterMatch * 3;

    // Urgency: execution briefs score higher when execution debt is high
    if (b.cluster === "execution" && state.executionDebt > 6) score += 9 * 3;
    else if (b.cluster === "risk" && state.overload > 7) score += 9 * 3;
    else if (b.cluster === "builder" && state.momentum > 6) score += 8 * 3;
    else score += 5 * 3;

    // Leverage: builder/monetization briefs when signal strength is high
    if (["builder"].includes(b.cluster) && state.signalStrength > 6) score += 8 * 2;
    else score += 5 * 2;

    // Cognitive fit
    if (state.overload > 7 && b.cluster === "execution") score += 8 * 2;
    else if (state.overload < 4 && b.cluster === "builder") score += 8 * 2;
    else score += 5 * 2;

    // Novelty: penalize recent briefs heavily
    if (recentIds.includes(b.id)) score -= 40;

    // Anti-cluster-saturation: penalize if cluster appeared 2+ times in last 3
    const clusterCount = recentClusters.filter(c => c === b.cluster).length;
    if (clusterCount >= 2) score -= 25;

    return { ...b, score };
  }).sort((a, b) => b.score - a.score);
}

// ── Storage Keys ───────────────────────────────────────────────────
const KEYS = {
  history: "huxe-pulse-history",
  state: "huxe-pulse-state",
};

const DEFAULT_STATE = {
  overload: 5,
  executionDebt: 5,
  momentum: 5,
  signalStrength: 5,
};

// ── Main App ───────────────────────────────────────────────────────
export default function HuxePulseEngine() {
  const [view, setView] = useState("dashboard"); // dashboard | generate | history | settings
  const [state, setState] = useState(DEFAULT_STATE);
  const [history, setHistory] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);
  const [scored, setScored] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          window.storage.get(KEYS.history).catch(() => null),
          window.storage.get(KEYS.state).catch(() => null),
        ]);
        if (hRes?.value) setHistory(JSON.parse(hRes.value));
        if (sRes?.value) setState(JSON.parse(sRes.value));
      } catch (e) { console.error("Storage load error:", e); }
      setLoaded(true);
    })();
  }, []);

  // Recalculate scores when state or history changes
  useEffect(() => {
    if (loaded) setScored(scoreBriefs(BRIEFS, state, history));
  }, [state, history, loaded]);

  // Save state
  const saveState = useCallback(async (newState) => {
    setState(newState);
    try { await window.storage.set(KEYS.state, JSON.stringify(newState)); }
    catch (e) { console.error("State save error:", e); }
  }, []);

  // Generate brief
  const generate = useCallback(async (primaryOverride, secondaryOverride) => {
    setGenerating(true);
    setError(null);
    setBrief(null);

    const primary = primaryOverride || scored[0];
    // Pick secondary from different cluster
    const secondary = secondaryOverride || scored.find(b => b.cluster !== primary.cluster && b.id !== primary.id);
    // Micro: lightweight, different cluster from both
    const micro = scored.find(b =>
      b.id !== primary.id && b.id !== secondary?.id &&
      b.cluster !== primary.cluster && b.cluster !== secondary?.cluster
    );

    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const systemPrompt = `You are HUXE Pulse — Kyle's daily intelligence engine. You produce tight, actionable daily briefs for an L1 MSP Service Desk Tech who is also an advanced AI builder.

RULES:
- No hype, no filler, no motivational fluff
- Every finding must be specific and actionable within 24 hours
- "What NOT to do" is as important as "what to do"
- If you can't verify a claim, say so explicitly
- Prefer execution over novelty when in doubt
- Keep each section to 2-4 sentences max
- Format output as clean markdown

Kyle's context: L1 Service Desk Tech at Intinc (MSP, Lincolnshire IL). Building FlashFusion (workshop/toolkit platform), Orchestrator (Base44 AgentOps), n8n workflows, WordPress accessibility work. Stack: Claude + GitHub + Vercel + Supabase + n8n + Make + Zapier + Notion. ~500 GitHub repos.

Current state signals:
- Overload level: ${state.overload}/10
- Execution debt: ${state.executionDebt}/10
- Momentum: ${state.momentum}/10
- Market signal strength: ${state.signalStrength}/10`;

    const userPrompt = `Generate today's HUXE Pulse brief for ${today}.

## PRIMARY BRIEF: ${primary.name} (${CLUSTERS[primary.cluster].name})
${primary.prompt}

## SECONDARY BRIEF: ${secondary?.name || "None"} (${secondary ? CLUSTERS[secondary.cluster].name : "N/A"})
${secondary?.prompt || "Skip secondary."}

${micro ? `## MICRO-BRIEF: ${micro.name} (${CLUSTERS[micro.cluster].name})
Provide 1 sentence insight + 1 action. That's it.
${micro.prompt}` : ""}

## OUTPUT FORMAT (follow exactly):

# HUXE PULSE — ${today}

## Selection Rationale
Why these briefs were chosen today (2 sentences max).

## ${primary.name}
**Summary:** (2-3 sentences)
**Findings:**
1. (specific, sourced if possible)
2.
3.
**Decisions:**
1.
2.
3.
**Do NOT:** (1-2 things to explicitly avoid today)
**FlashFusion/HUXE tie-in:** (1 sentence)

## ${secondary?.name || "Secondary"}
**Summary:** (2-3 sentences)
**Findings:**
1.
2.
3.
**Decisions:**
1.
2.
3.
**Do NOT:** (1-2 things to explicitly avoid)

${micro ? `## Micro: ${micro.name}\n**Insight:**\n**Action:**` : ""}

## Today's Execution Stack
1. #1 priority (what + why + what done looks like)
2. #2 priority
3. #3 priority

## System Recommendation
What to change/add/remove/simplify today and why. (2 sentences)

## Prompt of the Day
One copy-paste-ready prompt for today's most important task.
\`\`\`
ROLE:
CONTEXT:
TASK:
CONSTRAINTS:
OUTPUT:
\`\`\`

## Reality Check
- **Time trap:** What will waste time today?
- **Leverage point:** What creates the most leverage?
- **Defer:** What should wait?`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "API error");

      const text = (data.content || [])
        .filter(c => c.type === "text")
        .map(c => c.text)
        .join("\n");

      const newBrief = {
        date: new Date().toISOString(),
        primaryId: primary.id,
        primaryName: primary.name,
        secondaryId: secondary?.id,
        secondaryName: secondary?.name,
        microId: micro?.id,
        microName: micro?.name,
        content: text,
        state: { ...state },
      };

      setBrief(newBrief);

      // Save to history
      const newHistory = [newBrief, ...history].slice(0, 30);
      setHistory(newHistory);
      try { await window.storage.set(KEYS.history, JSON.stringify(newHistory)); }
      catch (e) { console.error("History save error:", e); }

      setView("generate");
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }, [scored, state, history]);

  if (!loaded) return (
    <div style={styles.loadingWrap}>
      <div style={styles.loadingPulse}>HUXE PULSE</div>
    </div>
  );

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>HUXE<span style={styles.logoAccent}>PULSE</span></div>
          <div style={styles.subtitle}>Daily Intelligence Engine</div>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </div>

      {/* Nav */}
      <div style={styles.nav}>
        {[
          { key: "dashboard", label: "Command" },
          { key: "generate", label: "Brief" },
          { key: "history", label: "Log" },
          { key: "settings", label: "State" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            style={{
              ...styles.navBtn,
              ...(view === tab.key ? styles.navBtnActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBar}>
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} style={styles.errorClose}>✕</button>
        </div>
      )}

      {/* Views */}
      <div style={styles.content}>
        {view === "dashboard" && (
          <DashboardView
            scored={scored}
            state={state}
            history={history}
            generating={generating}
            onGenerate={generate}
          />
        )}
        {view === "generate" && (
          <BriefView brief={brief} generating={generating} onGenerate={generate} scored={scored} />
        )}
        {view === "history" && <HistoryView history={history} onSelect={(b) => { setBrief(b); setView("generate"); }} />}
        {view === "settings" && <StateView state={state} onSave={saveState} />}
      </div>
    </div>
  );
}

// ── Dashboard View ─────────────────────────────────────────────────
function DashboardView({ scored, state, history, generating, onGenerate }) {
  const top3 = scored.slice(0, 3);
  const todayBrief = history.find(h => {
    const d = new Date(h.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <div>
      {/* State Indicators */}
      <div style={styles.stateRow}>
        {[
          { label: "Overload", val: state.overload, color: state.overload > 7 ? "#ef4444" : state.overload > 4 ? "#f59e0b" : "#22c55e" },
          { label: "Exec Debt", val: state.executionDebt, color: state.executionDebt > 7 ? "#ef4444" : state.executionDebt > 4 ? "#f59e0b" : "#22c55e" },
          { label: "Momentum", val: state.momentum, color: state.momentum > 6 ? "#22c55e" : state.momentum > 3 ? "#f59e0b" : "#ef4444" },
          { label: "Signal", val: state.signalStrength, color: state.signalStrength > 6 ? "#22c55e" : "#64748b" },
        ].map(s => (
          <div key={s.label} style={styles.stateCard}>
            <div style={{ ...styles.stateVal, color: s.color }}>{s.val}</div>
            <div style={styles.stateLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Status */}
      {todayBrief ? (
        <div style={styles.todayBanner}>
          <div style={styles.todayCheck}>✓ Brief generated today</div>
          <div style={styles.todayMeta}>{todayBrief.primaryName} + {todayBrief.secondaryName}</div>
        </div>
      ) : (
        <button
          onClick={() => onGenerate()}
          disabled={generating}
          style={{ ...styles.generateBtn, opacity: generating ? 0.6 : 1 }}
        >
          {generating ? "Generating..." : "⚡ Generate Today's Brief"}
        </button>
      )}

      {/* Top Scored Briefs */}
      <div style={styles.sectionTitle}>Top Scored Briefs</div>
      {top3.map((b, i) => (
        <div key={b.id} style={styles.scoredCard}>
          <div style={styles.scoredRank}>#{i + 1}</div>
          <div style={styles.scoredInfo}>
            <div style={styles.scoredName}>{b.icon} {b.name}</div>
            <div style={{ ...styles.clusterBadge, backgroundColor: CLUSTERS[b.cluster].color + "22", color: CLUSTERS[b.cluster].color }}>
              {CLUSTERS[b.cluster].name}
            </div>
          </div>
          <div style={styles.scoredScore}>{b.score}</div>
        </div>
      ))}

      {/* All Briefs by Cluster */}
      <div style={styles.sectionTitle}>All Briefs by Cluster</div>
      {Object.entries(CLUSTERS).map(([key, cluster]) => (
        <div key={key} style={styles.clusterGroup}>
          <div style={{ ...styles.clusterHeader, borderLeftColor: cluster.color }}>
            {cluster.name}
          </div>
          {scored.filter(b => b.cluster === key).map(b => {
            const wasRecent = (history.slice(0, 3) || []).some(h => h.primaryId === b.id || h.secondaryId === b.id);
            return (
              <button
                key={b.id}
                onClick={() => onGenerate(b)}
                disabled={generating}
                style={{ ...styles.briefBtn, opacity: wasRecent ? 0.4 : 1 }}
              >
                <span>{b.icon} {b.name}</span>
                <span style={styles.briefScore}>{b.score}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Brief View ─────────────────────────────────────────────────────
function BriefView({ brief, generating, onGenerate, scored }) {
  if (generating) {
    return (
      <div style={styles.genWrap}>
        <div style={styles.genSpinner} />
        <div style={styles.genText}>Generating brief with web search...</div>
        <div style={styles.genSub}>This takes 15-30 seconds</div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div style={styles.emptyWrap}>
        <div style={styles.emptyIcon}>📋</div>
        <div style={styles.emptyText}>No brief generated yet</div>
        <button onClick={() => onGenerate()} style={styles.generateBtnSmall}>
          Generate Now
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.briefMeta}>
        <span style={styles.briefDate}>{new Date(brief.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
        <div style={styles.briefTags}>
          <span style={styles.briefTag}>{brief.primaryName}</span>
          {brief.secondaryName && <span style={styles.briefTagSec}>{brief.secondaryName}</span>}
          {brief.microName && <span style={styles.briefTagMicro}>{brief.microName}</span>}
        </div>
      </div>
      <div style={styles.briefContent}>
        <MarkdownRenderer text={brief.content} />
      </div>
    </div>
  );
}

// ── Simple Markdown Renderer ───────────────────────────────────────
function MarkdownRenderer({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];

  let inCode = false;
  let codeLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(<pre key={`code-${i}`} style={styles.codeBlock}>{codeLines.join("\n")}</pre>);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} style={styles.mdH1}>{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={styles.mdH2}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={styles.mdH3}>{line.slice(4)}</h3>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<div key={i} style={styles.mdBold}>{line.replace(/\*\*/g, "")}</div>);
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(<div key={i} style={styles.mdListItem}>{line}</div>);
    } else if (line.startsWith("- **")) {
      const [label, ...rest] = line.slice(2).split(":**");
      elements.push(
        <div key={i} style={styles.mdKV}>
          <span style={styles.mdKVKey}>{label.replace(/\*\*/g, "")}:</span>
          <span>{rest.join(":**")}</span>
        </div>
      );
    } else if (line.startsWith("- ")) {
      elements.push(<div key={i} style={styles.mdListItem}>• {line.slice(2)}</div>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);
    } else {
      // Handle inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={i} style={styles.mdP}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    }
  }

  return <div>{elements}</div>;
}

// ── History View ───────────────────────────────────────────────────
function HistoryView({ history, onSelect }) {
  if (!history.length) {
    return (
      <div style={styles.emptyWrap}>
        <div style={styles.emptyIcon}>📚</div>
        <div style={styles.emptyText}>No brief history yet</div>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.sectionTitle}>Brief History ({history.length})</div>
      {history.map((h, i) => (
        <button key={i} onClick={() => onSelect(h)} style={styles.historyCard}>
          <div style={styles.historyDate}>
            {new Date(h.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
          <div style={styles.historyBriefs}>
            {h.primaryName} + {h.secondaryName || "—"}
          </div>
          <div style={styles.historyArrow}>→</div>
        </button>
      ))}
    </div>
  );
}

// ── State/Settings View ────────────────────────────────────────────
function StateView({ state, onSave }) {
  const [local, setLocal] = useState({ ...state });

  const sliders = [
    { key: "overload", label: "Overload Level", desc: "How stretched are you? High = favor execution + risk briefs" },
    { key: "executionDebt", label: "Execution Debt", desc: "How much unfinished work? High = favor concrete action briefs" },
    { key: "momentum", label: "Momentum", desc: "How productive is the current sprint? High = favor builder briefs" },
    { key: "signalStrength", label: "Market Signal", desc: "How strong are external opportunities? High = favor opportunity briefs" },
  ];

  return (
    <div>
      <div style={styles.sectionTitle}>State Signals</div>
      <div style={styles.stateDesc}>These drive brief selection. Adjust before generating.</div>

      {sliders.map(s => (
        <div key={s.key} style={styles.sliderGroup}>
          <div style={styles.sliderHeader}>
            <span style={styles.sliderLabel}>{s.label}</span>
            <span style={styles.sliderVal}>{local[s.key]}/10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={local[s.key]}
            onChange={e => setLocal({ ...local, [s.key]: parseInt(e.target.value) })}
            style={styles.slider}
          />
          <div style={styles.sliderDesc}>{s.desc}</div>
        </div>
      ))}

      <button
        onClick={() => onSave(local)}
        style={styles.saveBtn}
      >
        Save State
      </button>

      {/* Reset */}
      <button
        onClick={async () => {
          if (confirm("Clear all history and reset state?")) {
            setLocal(DEFAULT_STATE);
            onSave(DEFAULT_STATE);
            try {
              await window.storage.delete(KEYS.history);
              await window.storage.delete(KEYS.state);
            } catch (e) { console.error(e); }
            window.location.reload();
          }
        }}
        style={styles.resetBtn}
      >
        Reset Everything
      </button>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = {
  root: {
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    backgroundColor: "#0a0a0f",
    color: "#e2e8f0",
    minHeight: "100vh",
    maxWidth: 640,
    margin: "0 auto",
    padding: "0 16px 80px",
  },
  loadingWrap: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#0a0a0f" },
  loadingPulse: { fontFamily: "'JetBrains Mono', monospace", color: "#22d3ee", fontSize: 24, fontWeight: 700, animation: "pulse 2s infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 12px", borderBottom: "1px solid #1e293b" },
  headerLeft: {},
  logo: { fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: "0.05em" },
  logoAccent: { color: "#22d3ee", marginLeft: 4 },
  subtitle: { fontSize: 11, color: "#64748b", marginTop: 2, letterSpacing: "0.08em", textTransform: "uppercase" },
  dateBadge: { fontSize: 12, color: "#94a3b8", backgroundColor: "#1e293b", padding: "4px 10px", borderRadius: 6 },
  nav: { display: "flex", gap: 4, padding: "12px 0", borderBottom: "1px solid #1e293b" },
  navBtn: { flex: 1, padding: "8px 0", fontSize: 12, fontWeight: 600, color: "#64748b", backgroundColor: "transparent", border: "1px solid #1e293b", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  navBtnActive: { color: "#22d3ee", borderColor: "#22d3ee", backgroundColor: "#22d3ee11" },
  errorBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", margin: "12px 0", backgroundColor: "#7f1d1d33", border: "1px solid #991b1b", borderRadius: 8, fontSize: 13, color: "#fca5a5" },
  errorClose: { background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 16 },
  content: { paddingTop: 16 },

  // State indicators
  stateRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 },
  stateCard: { textAlign: "center", padding: "12px 8px", backgroundColor: "#111118", borderRadius: 8, border: "1px solid #1e293b" },
  stateVal: { fontSize: 22, fontWeight: 800 },
  stateLabel: { fontSize: 10, color: "#64748b", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" },

  // Generate button
  generateBtn: { width: "100%", padding: "16px", fontSize: 15, fontWeight: 700, color: "#0a0a0f", backgroundColor: "#22d3ee", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", marginBottom: 20, letterSpacing: "0.02em" },
  generateBtnSmall: { padding: "10px 24px", fontSize: 13, fontWeight: 600, color: "#0a0a0f", backgroundColor: "#22d3ee", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", marginTop: 12 },

  // Today banner
  todayBanner: { padding: "14px 16px", backgroundColor: "#22d3ee11", border: "1px solid #22d3ee33", borderRadius: 10, marginBottom: 20 },
  todayCheck: { fontSize: 14, fontWeight: 600, color: "#22d3ee" },
  todayMeta: { fontSize: 12, color: "#64748b", marginTop: 4 },

  // Scored cards
  sectionTitle: { fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, marginTop: 20 },
  scoredCard: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", backgroundColor: "#111118", borderRadius: 8, border: "1px solid #1e293b", marginBottom: 6 },
  scoredRank: { fontSize: 14, fontWeight: 800, color: "#22d3ee", minWidth: 28 },
  scoredInfo: { flex: 1 },
  scoredName: { fontSize: 13, fontWeight: 600 },
  clusterBadge: { display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, marginTop: 4 },
  scoredScore: { fontSize: 16, fontWeight: 800, color: "#475569" },

  // Cluster groups
  clusterGroup: { marginBottom: 16 },
  clusterHeader: { fontSize: 12, fontWeight: 700, color: "#94a3b8", borderLeft: "3px solid", paddingLeft: 10, marginBottom: 6 },
  briefBtn: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 14px", backgroundColor: "#0f0f17", border: "1px solid #1e293b", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: "#cbd5e1", marginBottom: 4, transition: "border-color 0.15s" },
  briefScore: { fontSize: 11, color: "#475569", fontWeight: 700 },

  // Brief view
  briefMeta: { marginBottom: 16 },
  briefDate: { fontSize: 13, color: "#64748b" },
  briefTags: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" },
  briefTag: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, backgroundColor: "#22d3ee22", color: "#22d3ee" },
  briefTagSec: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, backgroundColor: "#a78bfa22", color: "#a78bfa" },
  briefTagMicro: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, backgroundColor: "#64748b22", color: "#94a3b8" },
  briefContent: { lineHeight: 1.65 },

  // Markdown
  mdH1: { fontSize: 18, fontWeight: 800, color: "#22d3ee", margin: "20px 0 12px", paddingBottom: 8, borderBottom: "1px solid #1e293b" },
  mdH2: { fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "18px 0 8px" },
  mdH3: { fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: "14px 0 6px" },
  mdP: { fontSize: 13, color: "#cbd5e1", margin: "4px 0", lineHeight: 1.7 },
  mdBold: { fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "4px 0" },
  mdListItem: { fontSize: 13, color: "#cbd5e1", paddingLeft: 12, margin: "3px 0", lineHeight: 1.6 },
  mdKV: { fontSize: 13, margin: "3px 0", paddingLeft: 12 },
  mdKVKey: { fontWeight: 700, color: "#94a3b8", marginRight: 6 },
  codeBlock: { fontSize: 12, color: "#22d3ee", backgroundColor: "#111118", border: "1px solid #1e293b", borderRadius: 8, padding: "14px 16px", margin: "10px 0", overflow: "auto", whiteSpace: "pre-wrap", lineHeight: 1.5 },

  // Empty states
  emptyWrap: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: "#64748b" },

  // Generating
  genWrap: { textAlign: "center", padding: "80px 20px" },
  genSpinner: { width: 32, height: 32, border: "3px solid #1e293b", borderTopColor: "#22d3ee", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" },
  genText: { fontSize: 14, color: "#e2e8f0", fontWeight: 600 },
  genSub: { fontSize: 12, color: "#64748b", marginTop: 6 },

  // History
  historyCard: { display: "flex", alignItems: "center", width: "100%", padding: "12px 14px", backgroundColor: "#111118", border: "1px solid #1e293b", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", color: "#e2e8f0", marginBottom: 6 },
  historyDate: { fontSize: 12, color: "#64748b", minWidth: 80 },
  historyBriefs: { flex: 1, fontSize: 12, fontWeight: 600 },
  historyArrow: { color: "#475569", fontSize: 14 },

  // Settings
  stateDesc: { fontSize: 12, color: "#64748b", marginBottom: 20 },
  sliderGroup: { marginBottom: 24 },
  sliderHeader: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  sliderLabel: { fontSize: 13, fontWeight: 600, color: "#e2e8f0" },
  sliderVal: { fontSize: 13, fontWeight: 700, color: "#22d3ee" },
  slider: { width: "100%", accentColor: "#22d3ee", cursor: "pointer" },
  sliderDesc: { fontSize: 11, color: "#475569", marginTop: 4 },
  saveBtn: { width: "100%", padding: "14px", fontSize: 14, fontWeight: 700, color: "#0a0a0f", backgroundColor: "#22d3ee", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", marginTop: 12 },
  resetBtn: { width: "100%", padding: "12px", fontSize: 13, fontWeight: 600, color: "#ef4444", backgroundColor: "transparent", border: "1px solid #7f1d1d", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", marginTop: 12 },
};
