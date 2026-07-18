import { useState, useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   FORGE — Task-detecting AI asset generator
   Paste a need → detect asset type + target platform → generate a
   context-engineered, platform-scoped artifact (prompt / assistant /
   system prompt / workflow / other).
   Runs detection + generation through the in-artifact Anthropic API.
   No API keys in client code (auth handled by the artifact environment).
──────────────────────────────────────────────────────────────────────────── */

const MODEL = "claude-sonnet-4-6";
const STORE_KEY = "forge-assets-v1";

/* ── Theme (Abstrekkt: dark ink + brass) ─────────────────────────────────── */
const T = {
  bg: "#1c1917", bg2: "#23201d", bg3: "#2b2723",
  border: "#3a352f", borderHi: "#4a443c",
  brass: "#c8a86a", brassDim: "#8a7448",
  text: "#ece7df", text2: "#b8b0a4", text3: "#7d766b",
  ok: "#7ab87a", warn: "#d4893a", err: "#c86a6a", info: "#7aa6c8",
};
const FONT_SERIF = "'Fraunces','Playfair Display',Georgia,serif";
const FONT_SANS = "'Crimson Pro','IBM Plex Sans',system-ui,sans-serif";
const FONT_MONO = "'JetBrains Mono','IBM Plex Mono',monospace";

/* ── Platform knowledge base — the non-generic core ──────────────────────────
   Mechanism-level (stable) rather than version-pinned numbers (which drift).
   Editable in-tool is a v2; for now this is the injected scope source.       */
const PLATFORMS = {
  claude: {
    label: "Anthropic Claude", family: "LLM",
    system: "Top-level `system` parameter (string or content blocks) — NOT a message role.",
    tools: "`tools` array with JSON-Schema input_schema; model emits tool_use blocks; you return tool_result.",
    structured: "No native JSON-schema mode — enforce via prompt + assistant prefill, or via tool_use.",
    formatting: "Responds best to XML-tag structuring (<task>,<context>,<output_format>). Prefill the assistant turn to force format. Multishot examples raise reliability.",
    constraints: ["No system role in messages — use top-level system", "Prefer XML over markdown for structured instructions", "Be explicit about refusal/escalation"],
    scopes: ["text", "vision", "tool-use", "long-context", "agentic-loops"],
    modelHint: "claude-opus-4-6 (max) / claude-sonnet-4-6 (default) / claude-haiku-4-5 (volume)",
  },
  gpt: {
    label: "OpenAI GPT", family: "LLM",
    system: "`system` or `developer` role message at the top of the messages array (developer-role for app instructions).",
    tools: "`tools` (function calling) with JSON Schema; model returns tool_calls.",
    structured: "Native Structured Outputs (response_format json_schema) — strong schema adherence.",
    formatting: "Markdown + numbered steps work well. Use the system/developer split for instruction hierarchy.",
    constraints: ["Use Structured Outputs for guaranteed JSON", "Prefer developer-role over user-role for app rules"],
    scopes: ["text", "vision", "tool-use", "structured-outputs", "embeddings"],
    modelHint: "platform-appropriate current GPT model",
  },
  gemini: {
    label: "Google Gemini", family: "LLM",
    system: "`system_instruction` field, separate from `contents`.",
    tools: "Function declarations; SDKs support automatic function calling.",
    structured: "Set responseMimeType=application/json + responseSchema for structured output.",
    formatting: "Very long context — exploit it for multi-document tasks. Explicit headings help. Safety settings are configurable.",
    constraints: ["Set responseMimeType + responseSchema for JSON", "Lean on long context instead of chunking when possible"],
    scopes: ["text", "vision", "audio", "long-context", "tool-use", "structured-outputs"],
    modelHint: "platform-appropriate current Gemini model",
  },
  midjourney: {
    label: "Midjourney", family: "Image",
    system: "No system prompt — a single prompt string plus trailing parameters.",
    tools: "n/a",
    structured: "n/a",
    formatting: "Order: subject → medium → style → lighting → composition, then params at the very end.",
    params: "--ar (aspect), --v (version), --style, --stylize/--s, --chaos, --no (negative), --sref (style ref), --cref (char ref).",
    constraints: ["Never negate in prose — use --no", "Front-load the subject", "Parameters go last"],
    scopes: ["image-generation", "style-reference", "character-reference"],
    modelHint: "n/a",
  },
  v0: {
    label: "Vercel v0", family: "Code / UI",
    system: "Conversational. Describe the UI/component; output is React + Tailwind + shadcn.",
    tools: "n/a",
    structured: "n/a",
    formatting: "Name framework (Next.js/React), styling (Tailwind/shadcn), exact behavior, and every state (empty/loading/error/success).",
    constraints: ["Be explicit about responsive + all states", "Name the design system", "Iterate in follow-ups, not one mega-prompt"],
    scopes: ["react", "tailwind", "shadcn", "nextjs", "ui-generation"],
    modelHint: "n/a",
  },
  cursor: {
    label: "Cursor", family: "Code IDE",
    system: "Rules files (.cursor/rules) + inline chat; codebase-aware.",
    tools: "Reads the workspace; can do multi-file edits.",
    structured: "n/a",
    formatting: "Pin context with @file/@symbol references, give acceptance criteria, constrain scope, include a verify step.",
    constraints: ["@-reference exact files", "State what NOT to touch", "Always include a test/verify step"],
    scopes: ["codegen", "refactor", "codebase-context", "multi-file-edits"],
    modelHint: "n/a",
  },
  lovable: {
    label: "Lovable", family: "Code / Full app",
    system: "Conversational full-app builder; React + Supabase common.",
    tools: "n/a",
    structured: "n/a",
    formatting: "Define pages, data model, auth, and integrations up front; then iterate incrementally.",
    constraints: ["Define data model + auth early", "Small iterative requests beat one mega-prompt"],
    scopes: ["react", "supabase", "full-app", "auth"],
    modelHint: "n/a",
  },
  base44: {
    label: "Base44", family: "App platform",
    system: "Entity-driven app builder + backend functions + AI agents (base44 SDK).",
    tools: "Backend functions + scoped agent tools.",
    structured: "Entity schemas define data shape.",
    formatting: "Model entities/schema first, then functions/agents; reference entity names exactly.",
    constraints: ["Model entities first", "Use the SDK for backend functions", "Scope agent tools explicitly"],
    scopes: ["entities", "backend-functions", "ai-agents", "crud"],
    modelHint: "n/a",
  },
  n8n: {
    label: "n8n", family: "Automation",
    system: "Node graph: trigger → nodes. AI Agent node + tool nodes.",
    tools: "HTTP, app nodes, AI Agent node with attached tools.",
    structured: "n/a",
    formatting: "Define trigger, each node's action, credential per node, and explicit error/branch handling.",
    constraints: ["Name credentials per node", "Add an error branch + retry", "Idempotency on any write"],
    scopes: ["workflow", "webhooks", "http", "ai-agent-node", "scheduling"],
    modelHint: "n/a",
  },
  make: {
    label: "Make (Integromat)", family: "Automation",
    system: "Scenario: connected modules with mappers + filters.",
    tools: "App modules + HTTP + tools modules.",
    structured: "n/a",
    formatting: "Define trigger module, field mappers, filters, and error handlers.",
    constraints: ["Map fields explicitly", "Add error handlers / rollback", "Mind operations cost"],
    scopes: ["scenarios", "modules", "mappers", "filters"],
    modelHint: "n/a",
  },
  generic: {
    label: "Generic / Portable", family: "Any",
    system: "Platform-agnostic; portable across providers (model-agnostic by design).",
    tools: "Describe abstractly; no provider-specific syntax.",
    structured: "State the output format explicitly in prose.",
    formatting: "Role → context → task → constraints → output spec. Avoid platform-specific syntax.",
    constraints: ["Keep model-agnostic", "State output format explicitly", "No vendor lock-in syntax"],
    scopes: ["portable"],
    modelHint: "any",
  },
};
const PLATFORM_KEYS = Object.keys(PLATFORMS);

const ASSET_TYPES = {
  prompt: { label: "Context-engineered prompt", glyph: "◆" },
  assistant: { label: "AI assistant config", glyph: "◈" },
  system_prompt: { label: "System prompt", glyph: "▣" },
  workflow: { label: "Automation workflow", glyph: "⟳" },
  other: { label: "Best-fit artifact", glyph: "◎" },
};
const ASSET_KEYS = Object.keys(ASSET_TYPES);

/* ── Prompt builders ─────────────────────────────────────────────────────── */
function platformBlock(key) {
  const p = PLATFORMS[key] || PLATFORMS.generic;
  const lines = [
    `PLATFORM: ${p.label} (${p.family})`,
    `System mechanism: ${p.system}`,
    p.tools && p.tools !== "n/a" ? `Tools: ${p.tools}` : null,
    p.structured && p.structured !== "n/a" ? `Structured output: ${p.structured}` : null,
    p.params ? `Params: ${p.params}` : null,
    `Formatting: ${p.formatting}`,
    `Hard constraints: ${(p.constraints || []).join("; ")}`,
    `Scopes: ${(p.scopes || []).join(", ")}`,
    p.modelHint && p.modelHint !== "n/a" ? `Model hint: ${p.modelHint}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

const DETECT_SYS = (task) => `You are a task classifier for an AI asset generator. Decide which artifact best completes the task, and the target platform.

TASK:
${task}

Asset types:
- prompt: a single context-engineered prompt for a one-shot or repeated request
- assistant: a reusable AI assistant/agent (persona + system prompt + tools + scopes + guardrails)
- system_prompt: a system/developer prompt defining an app or product's AI behavior
- workflow: an automation/agent pipeline (n8n, Make, multi-step)
- other: anything else — pick the best-fit artifact and name it

Target platforms: ${PLATFORM_KEYS.join(", ")}.
If the task names or implies a platform, set it; otherwise "generic".

Respond ONLY with valid JSON, no markdown fences:
{"assetType":"one of the asset types","targetPlatform":"one of the platforms","confidence":0.0,"summary":"one line of what they want","reasoning":"1-2 sentences","missingInfo":["clarifiers if any, else empty array"]}`;

const GEN = {
  prompt: (task, key) => `You are a senior prompt engineer. Produce ONE production-ready, context-engineered prompt that completes the task, TARGETED to the platform and honoring its scopes and syntax conventions exactly.

${platformBlock(key)}

TASK:
${task}

Respond ONLY with valid JSON, no fences:
{"title":"","platform":"${key}","prompt":"the full prompt text using this platform's conventions","appliedConventions":["which platform conventions you used"],"scopesRespected":["which platform scopes/constraints you honored"],"tips":["1-3 usage tips"],"budgetNote":"brief note on length vs platform context"}`,

  assistant: (task, key) => `You are an expert at designing deployable AI assistants. Produce a complete assistant configuration that fulfills the need, targeted to the platform and its scopes.

${platformBlock(key)}

NEED:
${task}

Respond ONLY with valid JSON, no fences:
{"name":"","oneLiner":"","recommendedModel":"platform-appropriate model","systemPrompt":"the full system/instructions text using this platform's mechanism","tools":[{"name":"","why":""}],"scopes":["capabilities granted"],"guardrails":["explicit limits / what it must refuse or escalate"],"outputFormat":"how it should respond","deployNotes":"how to deploy on this platform"}`,

  system_prompt: (task, key) => `You are an expert at writing production system prompts. Produce a system/developer prompt that defines the AI behavior, targeted to the platform's mechanism.

${platformBlock(key)}

NEED:
${task}

Respond ONLY with valid JSON, no fences:
{"title":"","platform":"${key}","systemPrompt":"the full system prompt text using this platform's mechanism","appliedConventions":["platform conventions used"],"guardrails":["explicit limits"],"notes":["deploy/usage notes"]}`,

  workflow: (task, key) => `You are an automation architect. Design a workflow/pipeline that completes the task on the platform.

${platformBlock(key)}

TASK:
${task}

Respond ONLY with valid JSON, no fences:
{"name":"","platform":"${key}","trigger":"","steps":[{"node":"","action":"","notes":""}],"credentials":["creds/scopes needed"],"failureHandling":["error/retry/idempotency notes"],"tips":["1-3 tips"]}`,

  other: (task, key) => `You are a versatile AI asset generator. The task doesn't fit a standard type — produce the best-fit artifact to complete it, targeted to the platform.

${platformBlock(key)}

TASK:
${task}

Respond ONLY with valid JSON, no fences:
{"title":"","artifactType":"what you decided to produce","platform":"${key}","content":"the full artifact","notes":["usage notes"]}`,
};

/* ── API helpers ─────────────────────────────────────────────────────────── */
async function callClaude(content, maxTokens, signal) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages: [{ role: "user", content }] }),
  });
  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { const e = await resp.json(); msg = e?.error?.message || msg; } catch (e) { /* keep status msg */ }
    throw new Error(msg);
  }
  const data = await resp.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  if (!text) throw new Error("Empty response from model");
  return text;
}
function parseJSON(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(cleaned); }
  catch (e) {
    const a = cleaned.indexOf("{"), b = cleaned.lastIndexOf("}");
    if (a !== -1 && b !== -1 && b > a) return JSON.parse(cleaned.slice(a, b + 1));
    throw new Error("Model did not return valid JSON");
  }
}

/* ── Storage (optional; in-memory fallback) ──────────────────────────────── */
async function loadAssets() {
  try {
    if (typeof window === "undefined" || !window.storage) return [];
    const r = await window.storage.get(STORE_KEY);
    return r && r.value ? JSON.parse(r.value) : [];
  } catch (e) { return []; }
}
async function saveAssets(list) {
  try {
    if (typeof window === "undefined" || !window.storage) return false;
    await window.storage.set(STORE_KEY, JSON.stringify(list));
    return true;
  } catch (e) { return false; }
}

/* ── UI primitives ───────────────────────────────────────────────────────── */
const Btn = ({ children, onClick, disabled, accent, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: "transparent", borderRadius: 3, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: FONT_MONO, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "7px 15px", transition: "border-color .15s,color .15s",
    border: `1px solid ${accent && !disabled ? T.brass : T.borderHi}`,
    color: disabled ? T.text3 : accent ? T.brass : T.text2, ...style,
  }}>{children}</button>
);
const Card = ({ children, style }) => (
  <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 4, padding: 14, ...style }}>{children}</div>
);
const Label = ({ children }) => (
  <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: T.text3, marginBottom: 5 }}>{children}</div>
);
const Mono = ({ children, color, size }) => (
  <span style={{ fontFamily: FONT_MONO, fontSize: size || 10, color: color || T.text2 }}>{children}</span>
);
function CopyBtn({ text, label }) {
  const [done, setDone] = useState(false);
  return (
    <Btn onClick={() => { try { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); } catch (e) { /* clipboard blocked */ } }}
      style={{ padding: "4px 10px", fontSize: 9.5 }}>{done ? "✓ Copied" : (label || "Copy")}</Btn>
  );
}
function Section({ title, body, copy }) {
  if (body == null || body === "") return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <Label>{title}</Label>{copy != null && <CopyBtn text={copy} />}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.text, whiteSpace: "pre-wrap", lineHeight: 1.55, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 3, padding: "10px 12px" }}>{body}</div>
    </div>
  );
}
const Chips = ({ items, color }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
    {(items || []).map((x, i) => (
      <span key={i} style={{ fontFamily: FONT_MONO, fontSize: 10, color: color || T.text2, border: `1px solid ${T.border}`, borderRadius: 3, padding: "3px 8px", background: T.bg }}>{x}</span>
    ))}
  </div>
);

/* ── Result renderer ─────────────────────────────────────────────────────── */
function Result({ type, data }) {
  const raw = JSON.stringify(data, null, 2);
  const list = (arr) => (arr || []).map((x) => `• ${typeof x === "string" ? x : JSON.stringify(x)}`).join("\n");

  if (type === "prompt") return (
    <div>
      <Section title={`Prompt — ${data.title || "untitled"}`} body={data.prompt} copy={data.prompt} />
      {data.appliedConventions?.length > 0 && <div style={{ marginBottom: 10 }}><Label>Platform conventions applied</Label><Chips items={data.appliedConventions} color={T.brass} /></div>}
      {data.scopesRespected?.length > 0 && <div style={{ marginBottom: 10 }}><Label>Scopes honored</Label><Chips items={data.scopesRespected} color={T.info} /></div>}
      <Section title="Tips" body={list(data.tips)} />
      {data.budgetNote && <Section title="Token / length note" body={data.budgetNote} />}
    </div>
  );
  if (type === "assistant") return (
    <div>
      <Section title="Name" body={data.name} />
      <Section title="One-liner" body={data.oneLiner} />
      <Section title="Recommended model" body={data.recommendedModel} />
      <Section title="System prompt" body={data.systemPrompt} copy={data.systemPrompt} />
      {data.tools?.length > 0 && <Section title="Tools" body={(data.tools || []).map((t) => `• ${t.name} — ${t.why}`).join("\n")} />}
      {data.scopes?.length > 0 && <div style={{ marginBottom: 10 }}><Label>Scopes granted</Label><Chips items={data.scopes} color={T.info} /></div>}
      {data.guardrails?.length > 0 && <Section title="Guardrails" body={list(data.guardrails)} />}
      <Section title="Output format" body={data.outputFormat} />
      <Section title="Deploy notes" body={data.deployNotes} />
    </div>
  );
  if (type === "system_prompt") return (
    <div>
      <Section title={`System prompt — ${data.title || "untitled"}`} body={data.systemPrompt} copy={data.systemPrompt} />
      {data.appliedConventions?.length > 0 && <div style={{ marginBottom: 10 }}><Label>Conventions applied</Label><Chips items={data.appliedConventions} color={T.brass} /></div>}
      {data.guardrails?.length > 0 && <Section title="Guardrails" body={list(data.guardrails)} />}
      <Section title="Notes" body={list(data.notes)} />
    </div>
  );
  if (type === "workflow") return (
    <div>
      <Section title="Name" body={data.name} />
      <Section title="Trigger" body={data.trigger} />
      {data.steps?.length > 0 && <Section title="Steps" body={(data.steps || []).map((s, i) => `${i + 1}. [${s.node}] ${s.action}${s.notes ? `\n   ↳ ${s.notes}` : ""}`).join("\n")} copy={(data.steps || []).map((s, i) => `${i + 1}. [${s.node}] ${s.action} — ${s.notes || ""}`).join("\n")} />}
      {data.credentials?.length > 0 && <Section title="Credentials / scopes" body={list(data.credentials)} />}
      {data.failureHandling?.length > 0 && <Section title="Failure handling" body={list(data.failureHandling)} />}
      <Section title="Tips" body={list(data.tips)} />
    </div>
  );
  // other
  return (
    <div>
      <Section title={`${data.artifactType || "Artifact"} — ${data.title || "untitled"}`} body={data.content} copy={data.content} />
      <Section title="Notes" body={list(data.notes)} />
      {!data.content && <Section title="Raw" body={raw} copy={raw} />}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export default function Forge() {
  const [view, setView] = useState("input"); // input | review | result
  const [task, setTask] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [detection, setDetection] = useState(null);
  const [assetType, setAssetType] = useState("prompt");
  const [platform, setPlatform] = useState("generic");
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const abortRef = useRef(null);

  useEffect(() => { loadAssets().then(setSaved); return () => { if (abortRef.current) abortRef.current.abort(); }; }, []);

  async function detect() {
    if (!task.trim()) return;
    setBusy(true); setError(null); setResult(null);
    abortRef.current = new AbortController();
    try {
      const text = await callClaude(DETECT_SYS(task.trim()), 1024, abortRef.current.signal);
      const d = parseJSON(text);
      const at = ASSET_KEYS.includes(d.assetType) ? d.assetType : "prompt";
      const pf = PLATFORM_KEYS.includes(d.targetPlatform) ? d.targetPlatform : "generic";
      setDetection({ ...d, assetType: at, targetPlatform: pf });
      setAssetType(at); setPlatform(pf); setView("review");
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Detection failed");
    } finally { setBusy(false); }
  }

  async function generate() {
    setBusy(true); setError(null);
    abortRef.current = new AbortController();
    try {
      const builder = GEN[assetType] || GEN.other;
      const text = await callClaude(builder(task.trim(), platform), 4096, abortRef.current.signal);
      const data = parseJSON(text);
      setResult({ type: assetType, platform, data });
      setView("result");
      const entry = { id: `f${Date.now()}`, type: assetType, platform, title: data.title || data.name || detection?.summary || "asset", createdAt: new Date().toISOString(), data };
      const next = [entry, ...saved].slice(0, 50);
      setSaved(next); saveAssets(next);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Generation failed");
    } finally { setBusy(false); }
  }

  function cancel() { if (abortRef.current) abortRef.current.abort(); setBusy(false); }
  function reset() { setView("input"); setDetection(null); setResult(null); setError(null); }
  function loadSaved(entry) { setAssetType(entry.type); setPlatform(entry.platform); setResult({ type: entry.type, platform: entry.platform, data: entry.data }); setView("result"); }

  const p = PLATFORMS[platform] || PLATFORMS.generic;

  return (
    <div style={{ fontFamily: FONT_SANS, background: T.bg, color: T.text, minHeight: "100vh", fontSize: 14 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box} textarea,select{outline:none} ::placeholder{color:${T.text3}}`}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "14px 18px", display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 600, color: T.text }}>Forge</span>
        <Mono color={T.text3}>task-detecting asset generator · {MODEL}</Mono>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {view !== "input" && <Btn onClick={reset}>New</Btn>}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: 18 }}>
        {error && (
          <Card style={{ borderColor: "rgba(200,106,106,.45)", marginBottom: 14 }}>
            <Mono color={T.err}>✗ {error}</Mono>
          </Card>
        )}

        {/* INPUT */}
        {view === "input" && (
          <>
            <Card style={{ marginBottom: 14 }}>
              <Label>Describe the task or need</Label>
              <textarea value={task} onChange={(e) => setTask(e.target.value)} rows={6}
                placeholder="e.g. 'A prompt to turn messy meeting notes into a structured action list, for GPT' — or — 'An assistant that triages inbound IT tickets and drafts replies' — or — 'an n8n workflow that posts new Stripe charges to Slack'"
                style={{ width: "100%", background: T.bg, color: T.text, border: `1px solid ${T.borderHi}`, borderRadius: 3, padding: "10px 12px", fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.55, resize: "vertical" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Mono color={T.text3}>Detection picks the asset type + platform — you confirm before generating.</Mono>
                {busy ? <Btn onClick={cancel}>◌ Cancel</Btn> : <Btn onClick={detect} accent disabled={!task.trim()}>Detect →</Btn>}
              </div>
            </Card>

            {saved.length > 0 && (
              <Card>
                <Label>Saved assets ({saved.length})</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {saved.slice(0, 8).map((s) => (
                    <div key={s.id} onClick={() => loadSaved(s)} style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", padding: "6px 8px", border: `1px solid ${T.border}`, borderRadius: 3, background: T.bg }}>
                      <Mono color={T.brass}>{ASSET_TYPES[s.type]?.glyph || "◎"}</Mono>
                      <span style={{ fontSize: 13, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
                      <Mono color={T.text3}>{s.platform}</Mono>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* REVIEW */}
        {view === "review" && detection && (
          <>
            <Card style={{ marginBottom: 14 }}>
              <Label>Detected</Label>
              <div style={{ fontSize: 15, color: T.text, marginBottom: 6 }}>{detection.summary}</div>
              <Mono color={T.text2}>{detection.reasoning}</Mono>
              <div style={{ marginTop: 8 }}><Mono color={T.text3}>confidence </Mono><Mono color={detection.confidence >= 0.66 ? T.ok : detection.confidence >= 0.4 ? T.warn : T.err}>{Math.round((detection.confidence || 0) * 100)}%</Mono></div>
              {detection.missingInfo?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <Label>Could sharpen with</Label><Chips items={detection.missingInfo} color={T.warn} />
                </div>
              )}
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <Label>Asset type {detection.assetType !== assetType && "(overridden)"}</Label>
                  <select value={assetType} onChange={(e) => setAssetType(e.target.value)} style={{ width: "100%", background: T.bg, color: T.text, border: `1px solid ${T.borderHi}`, borderRadius: 3, padding: "8px 10px", fontFamily: FONT_MONO, fontSize: 12, cursor: "pointer" }}>
                    {ASSET_KEYS.map((k) => <option key={k} value={k}>{ASSET_TYPES[k].glyph} {ASSET_TYPES[k].label}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Target platform {detection.targetPlatform !== platform && "(overridden)"}</Label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ width: "100%", background: T.bg, color: T.text, border: `1px solid ${T.borderHi}`, borderRadius: 3, padding: "8px 10px", fontFamily: FONT_MONO, fontSize: 12, cursor: "pointer" }}>
                    {PLATFORM_KEYS.map((k) => <option key={k} value={k}>{PLATFORMS[k].label}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* Platform scope card — shows exactly what will be injected */}
            <Card style={{ marginBottom: 14, borderColor: T.brassDim }}>
              <Label>Platform scopes injected — {p.label}</Label>
              <Section title="System mechanism" body={p.system} />
              {p.tools && p.tools !== "n/a" && <Section title="Tools" body={p.tools} />}
              {p.structured && p.structured !== "n/a" && <Section title="Structured output" body={p.structured} />}
              {p.params && <Section title="Params" body={p.params} />}
              <Section title="Formatting" body={p.formatting} />
              <div style={{ marginBottom: 6 }}><Label>Hard constraints</Label><Chips items={p.constraints} color={T.warn} /></div>
              <div><Label>Scopes</Label><Chips items={p.scopes} color={T.info} /></div>
            </Card>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Btn onClick={reset}>← Back</Btn>
              {busy ? <Btn onClick={cancel}>◌ Cancel</Btn> : <Btn onClick={generate} accent>Generate {ASSET_TYPES[assetType].label} →</Btn>}
            </div>
          </>
        )}

        {/* RESULT */}
        {view === "result" && result && (
          <>
            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div><Mono color={T.brass}>{ASSET_TYPES[result.type]?.glyph} {ASSET_TYPES[result.type]?.label}</Mono> <Mono color={T.text3}>· {PLATFORMS[result.platform]?.label}</Mono></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <CopyBtn text={JSON.stringify(result.data, null, 2)} label="Copy JSON" />
                  <Btn onClick={() => setView("review")}>Regenerate</Btn>
                </div>
              </div>
            </Card>
            <Card><Result type={result.type} data={result.data} /></Card>
          </>
        )}
      </div>
    </div>
  );
}
