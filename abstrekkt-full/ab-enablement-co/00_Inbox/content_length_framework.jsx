import { useState } from "react";

const AUDIENCES = [
  {
    id: "enduser",
    label: "Non-Tech End User",
    icon: "👤",
    color: "#3b82f6",
    tagline: "They want to finish a task, not understand a system",
    specs: [
      { label: "Word count", value: "150 – 400 words" },
      { label: "Reading level", value: "Grade 6–8 (plain English)" },
      { label: "Max steps per guide", value: "7 steps max" },
      { label: "Actions per step", value: "1 action only" },
      { label: "Max document length", value: "1 page / scroll" },
      { label: "Prior context", value: "Always include the WHY first" },
      { label: "Terminology", value: "Define every term, no exceptions" },
      { label: "Analogies", value: "Required — lead with one before any instruction" },
      { label: "Visuals", value: "Screenshot or diagram per major step" },
      { label: "Tone", value: "Warm, direct, zero jargon" },
    ],
    structure: [
      "What this helps you do (1 sentence)",
      "Before you start (prerequisites)",
      "Steps (numbered, 1 action each)",
      "What success looks like",
      "If something goes wrong (2–3 common issues)",
    ],
    antipatterns: [
      "Nesting steps inside steps",
      "Using terms like 'navigate to' without explaining where",
      "Explaining how the system works instead of what to do",
      "More than 2 screenshots per step",
      "Walls of text between steps",
    ],
    promptTemplate: `You are writing a step-by-step guide for a NON-TECHNICAL END USER.

AUDIENCE RULES:
- Grade 6–8 reading level. Plain English only.
- Maximum 400 words total.
- Maximum 7 numbered steps. One action per step only.
- Start with a one-sentence "What this helps you do" statement.
- Include a brief analogy or real-world comparison before the steps.
- Every technical term gets a plain-language definition in parentheses.
- End with: "You're done when you see [specific success indicator]."
- Add 2–3 "If this happens..." troubleshooting lines at the end.
- No nested steps. No sub-bullets. No jargon.

TOPIC: {{TOPIC}}

FORMAT:
**What this helps you do**
[1 sentence]

**Before you start**
[1–2 prerequisites]

**Steps**
1.
2.
...

**You're done when:**
[specific success state]

**If something goes wrong:**
- If you see [X], try [Y].
- If [A] happens, [B].`
  },
  {
    id: "techuser",
    label: "Technical User",
    icon: "⚙️",
    color: "#8b5cf6",
    tagline: "They want the what and how — context is on demand",
    specs: [
      { label: "Word count", value: "400 – 1,200 words" },
      { label: "Reading level", value: "Grade 11–13 (professional/technical)" },
      { label: "Max steps per guide", value: "Unlimited — group into phases" },
      { label: "Actions per step", value: "2–4 related actions OK" },
      { label: "Max document length", value: "3–5 pages" },
      { label: "Prior context", value: "TL;DR at top, full context at bottom" },
      { label: "Terminology", value: "Use freely — define only non-standard terms" },
      { label: "Analogies", value: "Optional — skip if concept is familiar" },
      { label: "Visuals", value: "Code blocks, diagrams, tables preferred over screenshots" },
      { label: "Tone", value: "Peer-to-peer, dense, efficient" },
    ],
    structure: [
      "TL;DR (1–2 sentences max)",
      "Prerequisites (tool versions, permissions, env)",
      "Phases or sections (grouped steps)",
      "Code/command examples inline",
      "Edge cases and gotchas",
      "Further reading (optional)",
    ],
    antipatterns: [
      "Over-explaining basics (treat them as known)",
      "Missing environment/version context",
      "No code examples for technical tasks",
      "Burying the TL;DR or skipping it",
      "Padding with motivational context",
    ],
    promptTemplate: `You are writing a technical reference guide for an EXPERIENCED TECHNICAL USER (developer, engineer, or power user).

AUDIENCE RULES:
- Professional/technical reading level. Dense is fine.
- 400–1,200 words. Go longer only if complexity requires it.
- Open with a TL;DR (1–2 sentences: what this does and the key command or concept).
- List prerequisites clearly: tools, versions, permissions, environment.
- Group steps into logical phases (Setup, Configure, Deploy, Verify).
- Include real code blocks, CLI commands, or config snippets wherever applicable.
- Use tables for comparisons, options, or flag references.
- Include a "Gotchas / Edge Cases" section — this is where tech users get value.
- Skip basic explanations unless the concept is non-standard or counterintuitive.
- No analogies unless the concept is genuinely novel.

TOPIC: {{TOPIC}}

FORMAT:
**TL;DR**
[1–2 sentences]

**Prerequisites**
- Tool/version
- Permission
- Environment var

**[Phase 1: Name]**
Steps with code blocks inline

**[Phase 2: Name]**
...

**Gotchas & Edge Cases**
- [edge case] → [what to do]

**Verification**
[how to confirm it worked]`
  },
  {
    id: "support",
    label: "Support Team (All Levels)",
    icon: "🎧",
    color: "#10b981",
    tagline: "They need speed, decision clarity, and consistent note format",
    specs: [
      { label: "Word count", value: "Quick ref: 100–300w · Full SOP: 600–1,200w" },
      { label: "Reading level", value: "Grade 9–11 (clear, professional)" },
      { label: "Max steps per guide", value: "Unlimited — use decision trees not lists" },
      { label: "Actions per step", value: "1–3 actions + decision point" },
      { label: "Max document length", value: "Quick ref: 1 page · SOP: up to 5 pages" },
      { label: "Prior context", value: "Symptom first — always. Context after." },
      { label: "Terminology", value: "Define non-standard. Tool names as-is." },
      { label: "Analogies", value: "Helpful for training, skip in live-incident refs" },
      { label: "Visuals", value: "Decision trees, escalation tables, ticket note templates" },
      { label: "Tone", value: "Precise, scannable, no ambiguity" },
    ],
    structure: [
      "Symptom / trigger condition (how they landed here)",
      "Quick triage (yes/no: can I fix this?)",
      "Resolution steps with decision branches",
      "Escalation triggers (exact conditions)",
      "Ticket note template (copy-paste)",
      "Resolution verification",
    ],
    antipatterns: [
      "Prose paragraphs (use tables and bullets)",
      "Missing escalation conditions",
      "Vague steps like 'check the settings'",
      "No ticket note template",
      "Combining multiple issue types in one doc",
    ],
    promptTemplate: `You are writing a support reference document for a SUPPORT TEAM MEMBER (any level — L1 through senior).

AUDIENCE RULES:
- They are in a live interaction or incident. Speed and clarity matter above all.
- Open with the SYMPTOM or trigger condition — what brought them to this doc.
- Include a quick yes/no triage gate: can this be resolved here, or does it need escalation?
- Use decision branches (If A → do X. If B → do Y.) not flat numbered lists.
- Every ambiguous step must have an "If this doesn't work, try:" fallback.
- Include EXACT escalation triggers — not vague ("if it's complex") but specific ("if the user has been locked out for >24 hours and password reset hasn't worked").
- End every doc with a copy-paste TICKET NOTE TEMPLATE they fill in.
- Include a 1-sentence resolution verification (how they confirm the issue is resolved).
- No padding. No motivational context. No analogies in live-incident docs.
- For training docs (not incident refs): add a "Why this happens" section at the end.

TOPIC: {{TOPIC}}
DOC TYPE: {{QUICK_REF or FULL_SOP or TRAINING}}

FORMAT:
**Symptom / When to use this doc**
[1–2 sentences]

**Triage Gate**
Can you resolve this? YES if: [condition]. NO if: [condition] → escalate to [who].

**Resolution Steps**
1. [Step] → If [result], continue. If [other result], go to step X.
2. ...

**Escalation Triggers**
- If [exact condition] → [who, how, what to say]

**Ticket Note Template**
\`\`\`
Issue: 
Steps taken: 
Result: 
Resolution: 
Escalated to (if applicable): 
\`\`\`

**Verified resolved when:**
[specific state]`
  },
];

function PromptGenerator({ audience }) {
  const [topic, setTopic] = useState("");
  const [docType, setDocType] = useState("FULL_SOP");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const buildPrompt = () => {
    let p = audience.promptTemplate.replace("{{TOPIC}}", topic || "[your topic here]");
    if (audience.id === "support") p = p.replace("{{QUICK_REF or FULL_SOP or TRAINING}}", docType);
    return p;
  };

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGenerated("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "Error.";
      setGenerated(text);
    } catch (err) {
      setGenerated("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 border-t border-zinc-800 pt-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Live Generator</h3>
      <div className="flex gap-2 mb-3">
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g. 'password reset', 'deploy to Vercel', 'submit a support ticket')"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
        />
        {audience.id === "support" && (
          <select
            value={docType}
            onChange={e => setDocType(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
          >
            <option value="QUICK_REF">Quick Ref</option>
            <option value="FULL_SOP">Full SOP</option>
            <option value="TRAINING">Training</option>
          </select>
        )}
        <button
          onClick={generate}
          disabled={!topic.trim() || loading}
          style={{ background: audience.color }}
          className="px-4 py-2 rounded-lg text-white text-sm font-bold disabled:opacity-40 transition-opacity"
        >
          {loading ? "⟳ Generating…" : "Generate"}
        </button>
      </div>

      <button
        onClick={() => setShowPrompt(!showPrompt)}
        className="text-xs text-zinc-500 hover:text-zinc-300 mb-3 flex items-center gap-1"
      >
        {showPrompt ? "▼ Hide prompt" : "▶ Show prompt template"}
      </button>

      {showPrompt && (
        <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400 whitespace-pre-wrap mb-3 overflow-auto max-h-48">
          {buildPrompt()}
        </pre>
      )}

      {generated && (
        <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto">
          {generated}
        </div>
      )}
    </div>
  );
}

export default function ContentLengthFramework() {
  const [activeTab, setActiveTab] = useState("enduser");
  const audience = AUDIENCES.find(a => a.id === activeTab);

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Instructional Content — Length & Format Framework</h1>
        <p className="text-zinc-400 text-sm">Best practices by audience type · with live prompt generator</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {AUDIENCES.map(a => (
          <button
            key={a.id}
            onClick={() => setActiveTab(a.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              activeTab === a.id
                ? "text-white border-transparent"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
            style={activeTab === a.id ? { background: a.color + "33", borderColor: a.color + "66", color: a.color } : {}}
          >
            {a.icon} {a.label}
          </button>
        ))}
      </div>

      {/* Active audience panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{audience.icon}</span>
            <h2 className="text-xl font-bold" style={{ color: audience.color }}>{audience.label}</h2>
          </div>
          <p className="text-zinc-400 text-sm italic">{audience.tagline}</p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {audience.specs.map((s, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-0.5">{s.label}</div>
              <div className="text-sm font-medium text-zinc-200">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Structure + Anti-patterns */}
        <div className="grid grid-cols-2 gap-4 mb-0">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Document structure</h3>
            <ol className="space-y-1">
              {audience.structure.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300">
                  <span style={{ color: audience.color }} className="font-bold shrink-0">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Anti-patterns to avoid</h3>
            <ul className="space-y-1">
              {audience.antipatterns.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-400">
                  <span className="text-red-500 shrink-0">✕</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PromptGenerator audience={audience} />
      </div>

      {/* Quick comparison bar */}
      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">At a glance — length comparison</h3>
        <div className="grid grid-cols-3 gap-3">
          {AUDIENCES.map(a => (
            <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
              <div className="text-lg mb-1">{a.icon}</div>
              <div className="text-xs font-bold text-zinc-400 mb-2">{a.label}</div>
              <div className="text-sm font-bold" style={{ color: a.color }}>
                {a.id === "enduser" ? "150–400 words" : a.id === "techuser" ? "400–1,200 words" : "100–1,200 words"}
              </div>
              <div className="text-xs text-zinc-600 mt-1">
                {a.id === "enduser" ? "1 page max" : a.id === "techuser" ? "3–5 pages" : "1 page (ref) · 5 pages (SOP)"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
