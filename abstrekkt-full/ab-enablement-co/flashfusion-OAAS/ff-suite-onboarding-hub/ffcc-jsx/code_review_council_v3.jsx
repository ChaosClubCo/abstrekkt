import { useState, useCallback, useRef } from "react";

// ── Severity calibration injected into every prompt ───────────────────────────
const SEV_DEFS = `Severity calibration — apply these definitions exactly, no inflation:
- critical: immediate production blocker — exploitable vulnerability, data corruption, crash on any normal input, or hardcoded secret
- high: incorrect behavior or significant risk under common real-world conditions
- medium: incorrect behavior under uncommon but reachable conditions, or meaningfully degrades maintainability
- low: minor suggestion with no functional, security, or operational impact`;

// ── System prompts — each reviewer owns only their domain ─────────────────────
const SYS = {
  noa: `You are a security engineer and DevSecOps specialist. Review code ONLY for security vulnerabilities and CI/CD gaps: OWASP categories, secrets, injection, auth bypass, deployment hardening. Do not comment on style, bugs, or general code quality.`,
  marcus: `You are a QA engineer specializing in correctness. Find ONLY bugs, logical errors, and edge cases: null dereferences, off-by-one errors, race conditions, unhandled rejections, type coercion, missing validation. Do not comment on security or architecture.`,
  priya: `You are a principal engineer specializing in structure. Review ONLY refactoring opportunities and modularity: DRY violations, naming, separation of concerns, cohesion, maintainability. Do not comment on security or CI/CD.`,
  jordan: `You are a staff engineer producing a final production readiness verdict after three domain specialists reviewed the code. Assess code quality, error handling, observability, and production shipability. Synthesize an overall verdict and scores.`,
};

// ── Config ────────────────────────────────────────────────────────────────────
const COUNCIL = [
  { id: "noa",    label: "Noa",    sub: "Security & CI/CD",         icon: "ti-shield-lock", sections: ["security", "cicd"] },
  { id: "marcus", label: "Marcus", sub: "Bugs & Edge Cases",         icon: "ti-bug",         sections: ["bugs", "edge_cases"] },
  { id: "priya",  label: "Priya",  sub: "Refactoring & Modularity",  icon: "ti-refresh",     sections: ["refactoring", "modularity"] },
  { id: "jordan", label: "Jordan", sub: "Code Quality & Production", icon: "ti-checklist",   sections: ["code_quality", "production_readiness"] },
];

const SEVS = {
  critical: { label: "Critical", bg: "var(--color-background-danger)",   color: "var(--color-text-danger)" },
  high:     { label: "High",     bg: "var(--color-background-warning)",  color: "var(--color-text-warning)" },
  medium:   { label: "Medium",   bg: "var(--color-background-info)",     color: "var(--color-text-info)" },
  low:      { label: "Low",      bg: "var(--color-background-secondary)", color: "var(--color-text-secondary)" },
};

const SLABELS = {
  security: "Security", cicd: "CI/CD", bugs: "Bugs", edge_cases: "Edge Cases",
  refactoring: "Refactoring", modularity: "Modularity",
  code_quality: "Code Quality", production_readiness: "Production Readiness",
};

// ── Prompts ───────────────────────────────────────────────────────────────────
const PRE_SYS = "You are a code structure analyzer. Return only valid JSON, no markdown fences, no prose.";

const buildPrePass = (code) =>
  `Analyze this code. Return ONLY this JSON:\n{"language":"detected language","summary":"2-3 sentence technical description","chunks":[{"name":"section name","start":1,"end":120}]}\n\nChunk rules: 100-300 lines each, max 350 lines. Split at logical boundaries (function/class/module). Maximum 3 chunks. Under 400 lines: 1 chunk covering the full file.\n\n<code>\n${code}\n</code>`;

function reviewerPrompt(id, chunkCode, ctx) {
  const preamble = ctx ? `${ctx}\n\n` : "";
  const suf = `\n\n${SEV_DEFS}\n\nReturn ONLY the XML below, no preamble:\n\n`;
  switch (id) {
    case "noa":
      return `${preamble}Review for security and CI/CD only.\n\n<code>\n${chunkCode}\n</code>${suf}<noa>\n<security>\n<item severity="critical|high|medium|low"><title/><cve_type/><description>cite specific code</description><remediation><![CDATA[fix with code example]]></remediation></item>\n</security>\n<cicd>\n<item severity="high|medium|low"><title/><description>specific gap</description></item>\n</cicd>\n</noa>`;
    case "marcus":
      return `${preamble}Review for bugs and edge cases only.\n\n<code>\n${chunkCode}\n</code>${suf}<marcus>\n<bugs>\n<item severity="critical|high|medium|low"><title/><location/><description>cite code</description><fix><![CDATA[corrected code]]></fix></item>\n</bugs>\n<edge_cases>\n<item severity="high|medium|low"><title/><scenario>exact trigger</scenario><fix><![CDATA[handler code]]></fix></item>\n</edge_cases>\n</marcus>`;
    case "priya":
      return `${preamble}Review for refactoring and modularity only.\n\n<code>\n${chunkCode}\n</code>${suf}<priya>\n<refactoring>\n<item severity="high|medium|low"><title/><description>cite code</description><fix><![CDATA[improved pattern]]></fix></item>\n</refactoring>\n<modularity>\n<item severity="high|medium|low"><title/><description>specific issue</description></item>\n</modularity>\n</priya>`;
    default: return "";
  }
}

function jordanPrompt(snippet, summary, language, nc, mc, pc, crit) {
  return `Synthesize production readiness verdict.\n${summary ? `File summary: ${summary}\n\n` : ""}<code>\n${snippet}\n</code>\n\nOther reviewers found: ${nc} security/CI findings, ${mc} bug findings, ${pc} structure findings (${crit} total critical).\n\n${SEV_DEFS}\n\nReturn ONLY this XML:\n\n<jordan>\n<summary>\n<language>${language || "Unknown"}</language>\n<overall_score>0-100</overall_score>\n<blocking_issues>blockers or the word none</blocking_issues>\n<verdict>2-3 sentences on this specific code</verdict>\n</summary>\n<code_quality>\n<score>0-100</score>\n<item severity="high|medium|low"><title/><description>cite code</description></item>\n</code_quality>\n<production_readiness>\n<score>0-100</score>\n<item severity="critical|high|medium|low"><title/><description>specific concern</description></item>\n</production_readiness>\n</jordan>`;
}

// ── Regex parser — CDATA-safe, survives unescaped < > & in code blocks ─────────
function getTag(str, tag) {
  const m = str.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function getItems(str, sec) {
  const s = getTag(str, sec);
  if (!s) return [];
  const items = [];
  const re = /<item(?:\s+severity="([^"]*)")?>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(s)) !== null) {
    const sev = (m[1] || "low").toLowerCase();
    const c = m[2];
    const item = { severity: ["critical", "high", "medium", "low"].includes(sev) ? sev : "low" };
    ["title", "description", "fix", "remediation", "location", "cve_type", "scenario"].forEach((f) => {
      const v = getTag(c, f);
      if (v) item[f] = v;
    });
    items.push(item);
  }
  return items;
}

const PARSE = {
  noa: (x) => ({ security: getItems(x, "security"), cicd: getItems(x, "cicd") }),
  marcus: (x) => ({ bugs: getItems(x, "bugs"), edge_cases: getItems(x, "edge_cases") }),
  priya: (x) => ({ refactoring: getItems(x, "refactoring"), modularity: getItems(x, "modularity") }),
  jordan: (x) => {
    const s = getTag(x, "summary"), cq = getTag(x, "code_quality"), pr = getTag(x, "production_readiness");
    return {
      summary: { language: getTag(s, "language") || "Unknown", overall_score: parseInt(getTag(s, "overall_score")) || 0, blocking: getTag(s, "blocking_issues"), verdict: getTag(s, "verdict") },
      code_quality: { score: parseInt(getTag(cq, "score")) || 0, items: getItems(x, "code_quality") },
      production_readiness: { score: parseInt(getTag(pr, "score")) || 0, items: getItems(x, "production_readiness") },
    };
  },
};

function parsePrePass(text) {
  const clean = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, "$1").trim();
  const m = clean.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const assembleCode = (files) => {
  const v = files.filter((f) => f.code.trim());
  if (v.length === 1) return v[0].code;
  return v.map((f) => `=== FILE: ${f.name || "untitled"} ===\n${f.code}`).join("\n\n");
};
const totalLines = (files) => files.reduce((a, f) => a + (f.code ? f.code.split("\n").length : 0), 0);
const extractLines = (code, start, end) => {
  const ls = code.split("\n");
  return ls.slice(Math.max(0, (start || 1) - 1), Math.min(ls.length, end || ls.length)).join("\n");
};
const scoreColor = (s) => s >= 80 ? "var(--color-text-success)" : s >= 60 ? "var(--color-text-warning)" : "var(--color-text-danger)";
const flatItems = (r, id) => {
  if (!r) return [];
  switch (id) {
    case "noa":    return [...(r.security || []), ...(r.cicd || [])];
    case "marcus": return [...(r.bugs || []), ...(r.edge_cases || [])];
    case "priya":  return [...(r.refactoring || []), ...(r.modularity || [])];
    case "jordan": return [...(r.code_quality?.items || []), ...(r.production_readiness?.items || [])];
    default: return [];
  }
};

async function api(system, content, maxTokens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages: [{ role: "user", content }] }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message || "API error");
  return (d.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SevBadge({ sev }) {
  const s = SEVS[sev] || SEVS.low;
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--border-radius-md)", background: s.bg, color: s.color, textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function FindingCard({ item, showChunk }) {
  const [open, setOpen] = useState(false);
  const hasBody = item.description || item.fix || item.remediation || item.scenario || item.location || item.cve_type;
  return (
    <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", marginBottom: 8, overflow: "hidden" }}>
      <div onClick={() => hasBody && setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", cursor: hasBody ? "pointer" : "default", flexWrap: "wrap" }}>
        <SevBadge sev={item.severity} />
        {showChunk && item.chunk && (
          <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)", whiteSpace: "nowrap" }}>
            {item.chunk}
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 500, flex: 1, lineHeight: 1.4, minWidth: 120 }}>{item.title || "(untitled)"}</span>
        {hasBody && <i className={`ti ti-chevron-${open ? "up" : "down"}`} aria-hidden="true" style={{ fontSize: 14, color: "var(--color-text-secondary)" }} />}
      </div>
      {open && (
        <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", padding: "12px 14px", fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
          {item.location && <div style={{ marginBottom: 8 }}><span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>Location: </span><code style={{ fontSize: 12, background: "var(--color-background-secondary)", padding: "1px 6px", borderRadius: 4 }}>{item.location}</code></div>}
          {item.cve_type && <div style={{ marginBottom: 8 }}><span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>OWASP: </span>{item.cve_type}</div>}
          {item.description && <p style={{ margin: "0 0 8px" }}>{item.description}</p>}
          {item.scenario && <p style={{ margin: "0 0 8px" }}><span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>Scenario: </span>{item.scenario}</p>}
          {(item.fix || item.remediation) && (
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 500, color: "var(--color-text-primary)" }}>Fix:</p>
              <pre style={{ margin: 0, padding: "8px 10px", background: "var(--color-background-tertiary)", borderRadius: "var(--border-radius-md)", fontSize: 12, fontFamily: "var(--font-mono)", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {item.fix || item.remediation}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SecBlock({ sectionId, items, score, showChunk }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <h3 style={{ fontSize: 12, fontWeight: 500, margin: 0, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--color-text-secondary)" }}>{SLABELS[sectionId] || sectionId}</h3>
        {score != null && <span style={{ fontSize: 13, fontWeight: 500, color: scoreColor(score) }}>{score}/100</span>}
      </div>
      {items.length === 0
        ? <div style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "8px 0" }}><i className="ti ti-circle-check" aria-hidden="true" style={{ marginRight: 6, color: "var(--color-text-success)" }} /> No issues found</div>
        : items.map((item, i) => <FindingCard key={i} item={item} showChunk={showChunk} />)
      }
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CodeReviewCouncil() {
  const [files, setFiles] = useState([{ name: "", code: "" }]);
  const [activeFile, setActiveFile] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | prepass | reviewing | synthesizing | done
  const [chunkInfo, setChunkInfo] = useState(null);
  const [progress, setProgress] = useState({ noa: 0, marcus: 0, priya: 0 });
  const [results, setResults] = useState({ noa: null, marcus: null, priya: null, jordan: null });
  const [errors, setErrors] = useState({ noa: null, marcus: null, priya: null, jordan: null });
  const [activeTab, setActiveTab] = useState("overview");

  // Accumulator ref — avoids stale closures when parallel tasks write to Jordan's input
  const acc = useRef({ noa: { security: [], cicd: [] }, marcus: { bugs: [], edge_cases: [] }, priya: { refactoring: [], modularity: [] } });

  const lines = totalLines(files);
  const hasCode = files.some((f) => f.code.trim());
  const isRunning = phase !== "idle" && phase !== "done";
  const jordan = results.jordan;
  const totalChunks = chunkInfo?.chunks?.length || 1;
  const showChunk = totalChunks > 1;
  const critCount = COUNCIL.reduce((a, m) => a + flatItems(results[m.id], m.id).filter((i) => i.severity === "critical").length, 0);
  const jobsDone = Object.values(progress).reduce((a, b) => a + b, 0);

  const addFile = () => { setFiles((p) => [...p, { name: "", code: "" }]); setActiveFile(files.length); };
  const removeFile = (idx) => { if (files.length === 1) return; setFiles((p) => p.filter((_, i) => i !== idx)); setActiveFile((p) => Math.min(p, files.length - 2)); };
  const updFile = (idx, f, v) => setFiles((p) => p.map((x, i) => i === idx ? { ...x, [f]: v } : x));

  const runReview = useCallback(async () => {
    if (!hasCode || isRunning) return;

    setPhase("prepass");
    setChunkInfo(null);
    setProgress({ noa: 0, marcus: 0, priya: 0 });
    setResults({ noa: null, marcus: null, priya: null, jordan: null });
    setErrors({ noa: null, marcus: null, priya: null, jordan: null });
    setActiveTab("overview");
    acc.current = { noa: { security: [], cicd: [] }, marcus: { bugs: [], edge_cases: [] }, priya: { refactoring: [], modularity: [] } };

    const code = assembleCode(files);
    const codeLineCount = code.split("\n").length;
    let chunks, fileSummary = "", language = "";

    // Pre-pass: chunk large files
    if (codeLineCount > 400) {
      try {
        const ppText = await api(PRE_SYS, buildPrePass(code), 600);
        const pp = parsePrePass(ppText);
        if (pp?.chunks?.length > 0) {
          language = pp.language || "";
          fileSummary = pp.summary || "";
          chunks = pp.chunks.slice(0, 3).map((c) => ({
            name: c.name || "Code section",
            start: Math.max(1, c.start || 1),
            end: Math.min(codeLineCount, c.end || codeLineCount),
            code: extractLines(code, c.start, c.end),
          }));
        } else {
          chunks = [{ name: "Full file", start: 1, end: codeLineCount, code }];
        }
      } catch (e) {
        chunks = [{ name: "Full file", start: 1, end: codeLineCount, code }];
        setErrors((p) => ({ ...p, prepass: e.message }));
      }
      setChunkInfo({ language, summary: fileSummary, chunks });
    } else {
      chunks = [{ name: "Full file", start: 1, end: codeLineCount, code }];
    }

    setPhase("reviewing");

    // Noa, Marcus, Priya: all chunks × all reviewers in parallel
    const tasks = [];
    for (const [ci, chunk] of chunks.entries()) {
      const ctx = chunks.length > 1
        ? `File context: ${fileSummary}\n\nYou are reviewing section ${ci + 1}/${chunks.length}: "${chunk.name}" (lines ${chunk.start}–${chunk.end}). Focus only on this section.`
        : "";
      for (const id of ["noa", "marcus", "priya"]) {
        tasks.push({ id, chunkName: chunk.name, prompt: reviewerPrompt(id, chunk.code, ctx) });
      }
    }

    await Promise.all(
      tasks.map(async ({ id, chunkName, prompt }) => {
        try {
          const text = await api(SYS[id], prompt, 2000);
          const parsed = PARSE[id](text);
          Object.keys(parsed).forEach((key) => {
            if (Array.isArray(parsed[key])) {
              parsed[key].forEach((item) => { item.chunk = chunkName; });
              acc.current[id][key].push(...parsed[key]);
            }
          });
          setResults((p) => ({ ...p, [id]: { ...acc.current[id] } }));
          setProgress((p) => ({ ...p, [id]: p[id] + 1 }));
        } catch (e) {
          setErrors((p) => ({ ...p, [id]: e.message }));
          setProgress((p) => ({ ...p, [id]: p[id] + 1 }));
        }
      })
    );

    // Jordan synthesis — runs after all chunk reviews complete, reads from acc.current
    setPhase("synthesizing");
    try {
      const noaItems = flatItems(acc.current.noa, "noa");
      const marcusItems = flatItems(acc.current.marcus, "marcus");
      const priyaItems = flatItems(acc.current.priya, "priya");
      const crit = [...noaItems, ...marcusItems, ...priyaItems].filter((i) => i.severity === "critical").length;
      const snippet = code.length <= 8000 ? code : code.slice(0, 4000) + "\n\n// ... [truncated] ...\n\n" + code.slice(-2000);
      const text = await api(SYS.jordan, jordanPrompt(snippet, fileSummary, language, noaItems.length, marcusItems.length, priyaItems.length, crit), 2000);
      setResults((p) => ({ ...p, jordan: PARSE.jordan(text) }));
    } catch (e) {
      setErrors((p) => ({ ...p, jordan: e.message }));
    }

    setPhase("done");
  }, [files, hasCode, isRunning]);

  const runLabel = () => {
    if (phase === "prepass") return <><i className="ti ti-loader-2" aria-hidden="true" style={{ fontSize: 16, verticalAlign: "-2px", marginRight: 6 }} />Analyzing structure...</>;
    if (phase === "reviewing") return <><i className="ti ti-loader-2" aria-hidden="true" style={{ fontSize: 16, verticalAlign: "-2px", marginRight: 6 }} />Reviewing ({jobsDone}/{totalChunks * 3} jobs)...</>;
    if (phase === "synthesizing") return <><i className="ti ti-loader-2" aria-hidden="true" style={{ fontSize: 16, verticalAlign: "-2px", marginRight: 6 }} />Jordan synthesizing...</>;
    return <><i className="ti ti-users" aria-hidden="true" style={{ fontSize: 16, verticalAlign: "-2px", marginRight: 6 }} />Run Council Review ↗</>;
  };

  return (
    <div style={{ padding: "1rem 0", fontFamily: "var(--font-sans)" }}>
      <h2 className="sr-only">Code Review Council v3 — pre-pass chunking, four parallel agents</h2>

      {/* File tabs */}
      {files.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
          {files.map((f, i) => (
            <button key={i} onClick={() => setActiveFile(i)} style={{ padding: "5px 10px", fontSize: 12, background: activeFile === i ? "var(--color-background-primary)" : "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-text-primary)" }}>
              <i className="ti ti-file" aria-hidden="true" style={{ fontSize: 12 }} />
              {f.name || `file ${i + 1}`}
              <span onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ marginLeft: 2, color: "var(--color-text-secondary)", cursor: "pointer" }}>×</span>
            </button>
          ))}
          <button onClick={addFile} style={{ padding: "5px 10px", fontSize: 12, background: "transparent", border: "0.5px dashed var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", color: "var(--color-text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 12 }} /> file
          </button>
        </div>
      )}
      {files.length > 1 && (
        <input value={files[activeFile].name} onChange={(e) => updFile(activeFile, "name", e.target.value)} placeholder="filename.js" disabled={isRunning} style={{ width: "100%", boxSizing: "border-box", fontSize: 12, marginBottom: 6, padding: "6px 10px", fontFamily: "var(--font-mono)", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", color: "var(--color-text-primary)" }} />
      )}

      {/* Code input */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ti ti-code" aria-hidden="true" style={{ fontSize: 14 }} />
          {files.length === 1 ? "Paste code to review" : `File ${activeFile + 1} of ${files.length}`}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {lines > 0 && (
            <span style={{ fontSize: 12, color: lines > 400 ? "var(--color-text-warning)" : "var(--color-text-secondary)" }}>
              {lines > 400 ? `${lines} lines — chunking enabled` : `${lines} lines`}
            </span>
          )}
          {files.length === 1 && (
            <button onClick={addFile} style={{ fontSize: 12, padding: "3px 8px", background: "transparent", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
              <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 11 }} /> file
            </button>
          )}
        </div>
      </div>
      <textarea
        value={files[activeFile].code}
        onChange={(e) => updFile(activeFile, "code", e.target.value)}
        placeholder="// Paste your code here..."
        rows={12}
        disabled={isRunning}
        style={{ width: "100%", boxSizing: "border-box", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.6, resize: "vertical", padding: "12px 14px", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", color: "var(--color-text-primary)", marginBottom: 10 }}
      />

      {/* Run button */}
      <button onClick={runReview} disabled={isRunning || !hasCode} style={{ width: "100%", padding: "10px", fontSize: 14, fontWeight: 500, marginBottom: 20, cursor: isRunning || !hasCode ? "not-allowed" : "pointer", opacity: !hasCode ? 0.5 : 1 }}>
        {runLabel()}
      </button>

      {/* Chunk info banner */}
      {chunkInfo && (
        <div style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontWeight: 500 }}>
            <i className="ti ti-layers-intersect" aria-hidden="true" style={{ fontSize: 14, color: "var(--color-text-secondary)" }} />
            {`${chunkInfo.language || "Code"} · split into ${chunkInfo.chunks.length} chunk${chunkInfo.chunks.length > 1 ? "s" : ""}`}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {chunkInfo.chunks.map((c, i) => (
              <span key={i} style={{ fontSize: 11, padding: "2px 8px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", color: "var(--color-text-secondary)" }}>
                {c.name} · L{c.start}–{c.end}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {phase !== "idle" && (
        <div>
          {/* Score header */}
          {jordan && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{(jordan.summary.language || chunkInfo?.language || "").trim() || "Code"}</span>
                {critCount > 0 && <span style={{ fontSize: 12, background: "var(--color-background-danger)", color: "var(--color-text-danger)", padding: "2px 10px", borderRadius: "var(--border-radius-md)", fontWeight: 500 }}>{critCount} critical</span>}
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {[{ s: jordan.summary.overall_score, l: "Overall" }, { s: jordan.code_quality.score, l: "Quality" }, { s: jordan.production_readiness.score, l: "Prod-ready" }].map(({ s, l }) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 500, color: scoreColor(s) }}>{s}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: 16, flexWrap: "wrap" }}>
            {[{ id: "overview", label: "Overview", icon: "ti-layout-dashboard" }, ...COUNCIL].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 14px", fontSize: 13, background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === t.id ? "var(--color-text-primary)" : "transparent"}`, borderRadius: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: activeTab === t.id ? 500 : 400, color: activeTab === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", whiteSpace: "nowrap", marginBottom: -1 }}>
                <i className={`ti ${t.icon}`} aria-hidden="true" style={{ fontSize: 14 }} />{t.label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 16 }}>
                {COUNCIL.map((m) => {
                  const isPre = phase === "prepass" && m.id !== "jordan";
                  const isRev = phase === "reviewing" && m.id !== "jordan" && progress[m.id] < totalChunks;
                  const isSynth = phase === "synthesizing" && m.id === "jordan";
                  const isQueued = phase === "reviewing" && m.id === "jordan";
                  const isDone = results[m.id] !== null;
                  const items = flatItems(results[m.id], m.id);
                  const hc = items.filter((i) => i.severity === "critical" || i.severity === "high").length;
                  const loading = isPre || isRev || isSynth;
                  return (
                    <div key={m.id} onClick={() => isDone && setActiveTab(m.id)} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "14px", cursor: isDone ? "pointer" : "default", textAlign: "center", opacity: loading ? 0.65 : 1 }}>
                      <i className={`ti ${m.icon}`} aria-hidden="true" style={{ fontSize: 22, color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }} />
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8 }}>{m.sub}</div>
                      {isPre && <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}><i className="ti ti-clock" aria-hidden="true" style={{ marginRight: 4 }} />waiting...</div>}
                      {isRev && <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}><i className="ti ti-loader-2" aria-hidden="true" style={{ marginRight: 4 }} />{totalChunks > 1 ? `${progress[m.id]}/${totalChunks} chunks` : "reviewing..."}</div>}
                      {isSynth && <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}><i className="ti ti-loader-2" aria-hidden="true" style={{ marginRight: 4 }} />synthesizing...</div>}
                      {isQueued && <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}><i className="ti ti-clock" aria-hidden="true" style={{ marginRight: 4 }} />queued...</div>}
                      {isDone && (
                        <div style={{ fontSize: 12, background: hc > 0 ? "var(--color-background-warning)" : "var(--color-background-secondary)", color: hc > 0 ? "var(--color-text-warning)" : "var(--color-text-secondary)", padding: "2px 8px", borderRadius: "var(--border-radius-md)", display: "inline-block" }}>
                          {items.length} findings
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {jordan && (
                <div>
                  <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px", marginBottom: 12, fontSize: 14, lineHeight: 1.6 }}>{jordan.summary.verdict}</div>
                  {jordan.summary.blocking && jordan.summary.blocking.toLowerCase() !== "none" && jordan.summary.blocking.trim() !== "" && (
                    <div style={{ background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "12px 16px", marginBottom: 12, fontSize: 13 }}>
                      <div style={{ fontWeight: 500, color: "var(--color-text-danger)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 16 }} />Blocking issues</div>
                      <div style={{ color: "var(--color-text-danger)" }}>{jordan.summary.blocking}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Member tabs */}
          {COUNCIL.map((m) => activeTab === m.id && (
            <div key={m.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                <i className={`ti ${m.icon}`} aria-hidden="true" style={{ fontSize: 20, color: "var(--color-text-secondary)" }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{m.sub}</div>
                </div>
                {showChunk && m.id !== "jordan" && progress[m.id] < totalChunks && (
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--color-text-secondary)" }}>{progress[m.id]}/{totalChunks} chunks done</span>
                )}
              </div>
              {(m.id !== "jordan" ? (progress[m.id] < totalChunks && isRunning) : phase === "synthesizing") && (
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "24px 0", textAlign: "center" }}>
                  <i className="ti ti-loader-2" aria-hidden="true" style={{ marginRight: 8 }} />
                  {m.id === "jordan" ? "Synthesizing..." : totalChunks > 1 ? `${progress[m.id]}/${totalChunks} chunks...` : "Reviewing..."}
                </div>
              )}
              {errors[m.id] && <div style={{ fontSize: 13, color: "var(--color-text-danger)", padding: "10px 0" }}><i className="ti ti-alert-circle" aria-hidden="true" style={{ marginRight: 6 }} />{errors[m.id]}</div>}
              {results[m.id] && m.sections.map((sid) => {
                const r = results[m.id];
                let items, score = null;
                if (sid === "code_quality") { items = r.code_quality?.items || []; score = r.code_quality?.score ?? null; }
                else if (sid === "production_readiness") { items = r.production_readiness?.items || []; score = r.production_readiness?.score ?? null; }
                else { items = r[sid] || []; }
                return <SecBlock key={sid} sectionId={sid} items={items} score={score} showChunk={showChunk} />;
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
