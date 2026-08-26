import { useState, useMemo } from "react";

// === FLASHFUSION LOCKED TOKENS ===
const FF = {
  bg0: "#0F0618",
  bg1: "#1A0B2E",
  bg2: "#251443",
  border0: "rgba(168, 85, 247, 0.2)",
  border1: "rgba(168, 85, 247, 0.4)",
  purple: "#A855F7",
  pink: "#F472B6",
  cyan: "#22D3EE",
  gradient: "linear-gradient(90deg, #A855F7 0%, #F472B6 55%, #22D3EE 100%)",
  text: "#F8FAFC",
  textSec: "#CBD5E1",
  textTer: "#64748B",
  glass: "rgba(15, 6, 24, 0.6)",
  glassCard: "rgba(26, 11, 46, 0.7)",
  green: "#34D399",
  greenBg: "rgba(52, 211, 153, 0.08)",
  greenBorder: "rgba(52, 211, 153, 0.3)",
  red: "#F87171",
  redBg: "rgba(248, 113, 113, 0.08)",
  redBorder: "rgba(248, 113, 113, 0.3)",
  amber: "#FCD34D",
  amberBg: "rgba(252, 211, 77, 0.08)",
  amberBorder: "rgba(252, 211, 77, 0.25)",
};

const glow = (col, s = 20) =>
  `0 0 ${s}px ${col}50, 0 0 ${s * 2}px ${col}25, 0 4px 24px rgba(0,0,0,0.5)`;

const glassStyle = {
  background: FF.glassCard,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${FF.border0}`,
  borderRadius: "16px",
};

// === RISK CONFIG ===
const RISK = {
  LOW:      { label: "LOW RISK",      color: FF.green,  bg: FF.greenBg,  border: FF.greenBorder },
  MEDIUM:   { label: "MEDIUM RISK",   color: FF.amber,  bg: FF.amberBg,  border: FF.amberBorder },
  CRITICAL: { label: "CRITICAL RISK", color: FF.red,    bg: FF.redBg,    border: FF.redBorder },
};

// === AUGMENTED DATA ===
const BRANCHES = [
  {
    id: "knowledge",
    emoji: "📋",
    label: "Policy / SOP / Knowledge",
    sub: "Answer lives in documents or manuals",
    color: FF.green,
    bg: FF.greenBg,
    border: FF.greenBorder,
    verdict: "USE RAG",
    verdictSub: "Knowledge Question → RAG Pipeline",
    risk: "LOW",
    riskNote: "Documents are naturally stale-safe — policy doesn't change by the minute.",
    notConfuseWith: "RAG is for what the policy SAYS, not what the system currently SHOWS. 'What is our PO policy?' → RAG. 'What is the current PO status?' → API.",
    why: "The answer lives in docs, manuals, policy files, training material, or internal knowledge bases. Classic RAG territory — this is where retrieval earns its place.",
    examples: ["What is our approval policy for POs over $5,000?", "How do I process a vendor return?", "What does the receiving SOP say about damaged goods?"],
    stack: ["pgvector / Pinecone / Weaviate", "Role-scoped document index", "Semantic chunk retrieval", "Source citation layer"],
  },
  {
    id: "livedata",
    emoji: "⚡",
    label: "Live ERP Data Query",
    sub: "Operational state, counts, status",
    color: FF.cyan,
    bg: "rgba(34, 211, 238, 0.08)",
    border: "rgba(34, 211, 238, 0.3)",
    verdict: "USE ERP API / SQL",
    verdictSub: "Live Data → Direct Query (Never RAG)",
    risk: "CRITICAL",
    riskNote: "RAG here is an outage waiting to happen. Stale inventory counts cause mis-shipments. Stale credit limits cause bad-debt exposure.",
    notConfuseWith: "Even if a document mentions a number (e.g., 'minimum stock is 100'), never trust that as current truth. The document is policy; the API is reality.",
    why: "RAG is stale by design. For inventory counts, overdue invoices, credit limits, and PO status — query the source of record directly with strict RBAC enforcement.",
    examples: ["What is current inventory for SKU-1042?", "What invoices are overdue today?", "What is ACME's credit limit?"],
    stack: ["ERP REST API or GraphQL", "Read-only SQL views", "RBAC-enforced query layer", "Deterministic response"],
  },
  {
    id: "action",
    emoji: "🔧",
    label: "Action / Transaction",
    sub: "Create, approve, move, close",
    color: FF.amber,
    bg: FF.amberBg,
    border: FF.amberBorder,
    verdict: "USE TOOL CALL",
    verdictSub: "Action Request → Backend Tool + Validation",
    risk: "CRITICAL",
    riskNote: "RAG generating write operations = audit failure and unrecoverable state corruption. There is no exception to this rule.",
    notConfuseWith: "'How do I create a PO?' is knowledge → RAG. 'Create a PO for vendor X' is an action → tool call. The verb intent is the signal.",
    why: "Never use RAG to execute transactions. Every write operation needs deterministic tools with schema validation, auth checks, confirmation gates, and rollback capability.",
    examples: ["Create a PO for vendor X.", "Approve this invoice.", "Move 40 units to warehouse B."],
    stack: ["Typed tool call schema", "RBAC authorization check", "User confirmation gate", "Audit log writer + rollback"],
  },
  {
    id: "mixed",
    emoji: "🔀",
    label: "Record + Context (Mixed)",
    sub: "Live data with surrounding policy context",
    color: FF.purple,
    bg: "rgba(168, 85, 247, 0.08)",
    border: FF.border1,
    verdict: "HYBRID",
    verdictSub: "API/SQL first → RAG second for explanation",
    risk: "MEDIUM",
    riskNote: "Order is load-bearing. API first anchors truth. RAG second adds context. Reversing this produces hallucinated context grafted onto stale data.",
    notConfuseWith: "Don't let the LLM decide which to call first — the orchestrator must enforce the sequence. 'Why was this PO rejected?' needs the rejection record BEFORE the policy.",
    why: "Pull live ERP data first for factual accuracy. Then use RAG to explain the policies, approval rules, or vendor history surrounding that data. Never reverse this order.",
    examples: ["Why was this PO rejected?", "Which customers are affected by this supplier delay?", "What products are blocked by the quality hold?"],
    stack: ["ERP API → live truth", "RAG → policy/context layer", "Synthesis prompt", "Source citations + record links"],
  },
  {
    id: "compliance",
    emoji: "🛡️",
    label: "Compliance / Audit",
    sub: "Traceable, citeable, defensible answers",
    color: FF.pink,
    bg: "rgba(244, 114, 182, 0.08)",
    border: "rgba(244, 114, 182, 0.3)",
    verdict: "RAG + CITATIONS",
    verdictSub: "Audit Query → RAG + Evidence + Record Trail",
    risk: "LOW",
    riskNote: "RAG with citation mode is purpose-built for this. Risk is low IF you enforce citation mode — uncited compliance answers are as dangerous as wrong ones.",
    notConfuseWith: "Citation mode proves the policy claim but not the record claim. Combine with ERP record retrieval for a fully defensible response.",
    why: "RAG with citation mode. Every answer needs a traceable source document or record. Combine retrieved policy docs with ERP record evidence for defensible, auditable responses.",
    examples: ["Show the policy that explains this approval.", "Find the GL coding rule documentation.", "Summarize evidence for this vendor compliance issue."],
    stack: ["RAG with citation mode on", "Record evidence retrieval", "Audit trail linkage", "Source-stamped answer"],
  },
];

const USE_CASES = [
  {
    emoji: "📜",
    title: "Policy, SOP & Process Questions",
    desc: "Approval policies, process workflows, operational procedures. Answers live in documents — this is RAG's home territory in ERP.",
    confidence: 95,
    qs: ["What is our approval policy for purchases over $5K?", "How do I process a vendor return?", "What's the month-end accounting closeout checklist?"],
  },
  {
    emoji: "🔍",
    title: "ERP Records + Supporting Context",
    desc: "Structured records paired with surrounding context — approval rules, vendor notes, procurement policy, email history, audit trail. RAG pulls context while APIs pull live data.",
    confidence: 72,
    qs: ["Why was this purchase order rejected?", "What's the vendor compliance history behind this invoice?"],
  },
  {
    emoji: "🎓",
    title: "Onboarding & Help Assistant",
    desc: "Highest-value ERP RAG use case. Answers field definitions, workflow questions, navigation help, and module-by-module process guidance for every user tier.",
    confidence: 98,
    qs: ["How do I create a sales order?", "What does this field mean?", "What's the difference between committed and available inventory?"],
  },
  {
    emoji: "⚖️",
    title: "Audit & Compliance Support",
    desc: "Every answer backed by a source document. Traceable, citeable, defensible. RAG with citation mode is purpose-built for this — it can point to the exact policy line.",
    confidence: 90,
    qs: ["Show me the policy behind this approval.", "Find documentation for this GL coding rule.", "Summarize evidence for this vendor compliance issue."],
  },
  {
    emoji: "🌐",
    title: "Cross-Module Knowledge",
    desc: "ERP systems are fragmented across modules. RAG bridges the knowledge gap — but always combine with API lookups for live state. Never RAG alone for cross-module truth.",
    confidence: 68,
    qs: ["Which customers are affected by the supplier delay?", "What does the contract say about late delivery penalties?"],
  },
];

const ANTI_PATTERNS = [
  {
    emoji: "📊",
    title: "Live ERP Data Queries",
    desc: "RAG is stale by design. Inventory counts, overdue invoices, credit limits, PO status — these demand direct queries against the source of record.",
    alt: "ERP API / SQL",
    altColor: FF.cyan,
    danger: 95,
    wrong: ["What is current inventory for SKU-1042?", "What invoices are overdue today?", "What is ACME's credit limit?"],
  },
  {
    emoji: "⚙️",
    title: "Transaction Execution",
    desc: "RAG must never execute write operations. Every action needs deterministic tools, auth checks, confirmation gates, audit logs, and rollback capability.",
    alt: "Tool Call + Validation",
    altColor: FF.amber,
    danger: 100,
    wrong: ["Create a PO.", "Approve this invoice.", "Move 40 units to warehouse B."],
  },
  {
    emoji: "🧮",
    title: "Calculations & Financial Truth",
    desc: "RAG can explain the rule. It must never be the source of numerical truth. Margin, tax, forecasting, reconciliation — use rules engines, SQL, or ERP APIs.",
    alt: "Rules Engine / SQL",
    altColor: FF.cyan,
    danger: 90,
    wrong: ["Calculate margin on this order.", "Reconcile this invoice.", "Compute tax for this transaction."],
  },
  {
    emoji: "🔒",
    title: "Permission-Sensitive Data",
    desc: "Generic vector search over ERP data is dangerous. Payroll, financials, HR records, vendor contracts, PII — need tenant-scoped, role-filtered retrieval or nothing.",
    alt: "Permission-Aware Retrieval",
    altColor: FF.purple,
    danger: 85,
    wrong: ["Unscoped vector similarity search", "Cross-tenant document retrieval", "Shared embedding index without metadata filters"],
  },
  {
    emoji: "🗃️",
    title: "Structured Entity Lookups",
    desc: "Customers, vendors, items, orders, invoices, work orders, GL accounts — structured entities. Retrieval from documents is the wrong primitive.",
    alt: "Query Source of Record",
    altColor: FF.cyan,
    danger: 80,
    wrong: ["List all open work orders.", "Get vendor payment terms.", "Pull all active GL accounts."],
  },
];

const META_TAGS = [
  { label: "tenant_id", color: FF.purple, desc: "Isolates retrieval to a single company/org. Cross-tenant access is a critical data leak vector. This filter is non-negotiable — skip it and you have a compliance breach by design." },
  { label: "user_id", color: FF.purple, desc: "Ties retrieval to a specific user identity for per-user document access control and a complete audit trail. Required for any user-level permissioning." },
  { label: "role", color: FF.cyan, desc: "Limits retrieval to documents the user's role is authorized to see. Finance docs must not surface to warehouse staff. RBAC at the retrieval layer, not just the API gateway." },
  { label: "module", color: FF.cyan, desc: "Scopes retrieval to a specific ERP module (AP, AR, Inventory, GL, Procurement, etc.) to eliminate cross-module noise and reduce irrelevant chunk scoring." },
  { label: "location_id", color: FF.amber, desc: "For multi-site organizations, ensures retrieval is relevant to the user's physical or operational location. Critical for site-specific SOPs and policies." },
  { label: "department_id", color: FF.amber, desc: "Departmental scoping prevents cross-department policy bleed — HR policies must not surface in an AP context and vice versa." },
  { label: "document_type", color: FF.green, desc: "Filter by SOP, policy, procedure, training, vendor contract, etc. Prevents mixing document intent — an SOP answer should not source from a marketing doc." },
  { label: "record_type", color: FF.green, desc: "For hybrid retrieval: scopes to invoice, PO, work order, sales order, etc. Keeps the retrieval context semantically tight." },
  { label: "sensitivity_level", color: FF.red, desc: "CRITICAL. Payroll, financial, legal, and PII documents must be gated by sensitivity level. This is the highest-risk misconfiguration in an ERP RAG system — one wrong filter and sensitive data surfaces to unauthorized users." },
  { label: "effective_date", color: FF.textSec, desc: "Prevents stale policy retrieval. A policy superseded in 2024 must not answer a question governed by 2024 rules. Date-bounding is essential for compliance use cases." },
  { label: "source_system", color: FF.textSec, desc: "Distinguishes the origin: ERP, CRM, HR system, email archive, etc. Prevents cross-system contamination where CRM notes bleed into financial policy answers." },
];

const LANES = [
  {
    id: 1, emoji: "📋", label: "Knowledge question", dest: "RAG Pipeline", destColor: FF.green,
    detail: "Semantic search over a permission-scoped vector index. Must include source citations and confidence scores. Answer questions about policy, SOP, procedure, and training material only — never operational state.",
    security: "metadata filter: tenant_id + role + module + sensitivity_level",
  },
  {
    id: 2, emoji: "⚡", label: "Live data question", dest: "ERP API / SQL", destColor: FF.cyan,
    detail: "Direct, deterministic query against the ERP source of record. Read-only. RBAC enforced at the query layer, not just the API gateway. No LLM interpolation of query results — return structured data and format it server-side.",
    security: "RBAC at query layer · read-only views · no LLM interpolation",
  },
  {
    id: 3, emoji: "🔧", label: "Action request", dest: "Tool Call + Validation", destColor: FF.amber,
    detail: "Typed tool call schema with input validation. Mandatory sequence: auth check → schema validation → user confirmation gate → execution → audit log write → rollback handler. No write operation skips any of these steps.",
    security: "auth check → schema validation → confirmation gate → audit log → rollback",
  },
  {
    id: 4, emoji: "🔀", label: "Mixed request", dest: "API/SQL → RAG explain", destColor: FF.purple,
    detail: "Orchestrator-enforced sequence — the LLM does not decide the order. ERP API runs first to anchor factual truth. RAG layer runs second to explain surrounding policy/context. LLM synthesizes. Source citations required on both legs.",
    security: "sequence enforced by orchestrator · both legs cited · no LLM routing",
  },
  {
    id: 5, emoji: "🛡️", label: "Compliance / audit", dest: "RAG + Evidence + Citations", destColor: FF.pink,
    detail: "Citation mode required — every claim must link to a source document chunk and its version/date. Combine with ERP record evidence for fully defensible output. Every retrieval must be logged with user, timestamp, and accessed chunk IDs.",
    security: "every claim cited · chunk version logged · retrieval audit trail · record evidence attached",
  },
];

const QUICK_REF = [
  {
    primitive: "RAG Pipeline", emoji: "📋", color: FF.green,
    freshness: "Stale", freshnessOk: false,
    writes: "Never", writesOk: false,
    cites: "Required", citesOk: true,
    risk: "LOW",
    useFor: "Policy, SOP, onboarding, training, compliance docs",
    when: "Answer is in a document",
  },
  {
    primitive: "ERP API / SQL", emoji: "⚡", color: FF.cyan,
    freshness: "Live", freshnessOk: true,
    writes: "Read-only", writesOk: false,
    cites: "N/A", citesOk: null,
    risk: "N/A",
    useFor: "Inventory, invoices, credit, PO status, entity lookups",
    when: "Need current operational state",
  },
  {
    primitive: "Tool Call + Validation", emoji: "🔧", color: FF.amber,
    freshness: "Instant", freshnessOk: true,
    writes: "Yes (validated)", writesOk: true,
    cites: "N/A", citesOk: null,
    risk: "HIGH ⚠",
    useFor: "Create, approve, move, close — any write operation",
    when: "User requests an action",
  },
  {
    primitive: "Hybrid (API → RAG)", emoji: "🔀", color: FF.purple,
    freshness: "API-anchored", freshnessOk: true,
    writes: "Never", writesOk: false,
    cites: "Required", citesOk: true,
    risk: "MEDIUM",
    useFor: "Questions mixing live operational state + policy context",
    when: "Needs facts AND explanation",
  },
  {
    primitive: "RAG + Citations", emoji: "🛡️", color: FF.pink,
    freshness: "Doc-bound", freshnessOk: false,
    writes: "Never", writesOk: false,
    cites: "Mandatory", citesOk: true,
    risk: "LOW",
    useFor: "Compliance, audit, defensible policy answers",
    when: "Answer must be fully traceable",
  },
];

// === SEARCH INDEX ===
function buildSearchIndex() {
  const idx = [];
  BRANCHES.forEach(b => {
    b.examples.forEach(ex =>
      idx.push({ text: ex, tab: "tree", label: b.label, verdict: b.verdict, color: b.color, emoji: b.emoji, branchId: b.id })
    );
  });
  USE_CASES.forEach(uc => {
    uc.qs.forEach(q =>
      idx.push({ text: q, tab: "use", label: uc.title, verdict: "RAG ✓", color: FF.green, emoji: uc.emoji })
    );
  });
  ANTI_PATTERNS.forEach(ap => {
    ap.wrong.forEach(q =>
      idx.push({ text: q, tab: "avoid", label: ap.title, verdict: `Use ${ap.alt}`, color: ap.altColor, emoji: ap.emoji })
    );
  });
  return idx;
}
const SEARCH_INDEX = buildSearchIndex();

// === HELPERS ===
function RiskBadge({ level }) {
  if (!level || !RISK[level]) return null;
  const r = RISK[level];
  return (
    <span style={{
      fontSize: "9px", padding: "2px 8px",
      background: r.bg, color: r.color, border: `1px solid ${r.border}`,
      borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace",
      fontWeight: "600", letterSpacing: "0.5px", whiteSpace: "nowrap",
    }}>
      {r.label}
    </span>
  );
}

function ConfidenceBar({ value, color, label }) {
  const barColor = value >= 85 ? FF.green : value >= 65 ? FF.amber : FF.red;
  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "9px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.8px" }}>
          {label || "ROUTING CONFIDENCE"}
        </span>
        <span style={{ fontSize: "9px", color: barColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: "600" }}>
          {value}%
        </span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`, background: barColor,
          borderRadius: "2px", boxShadow: `0 0 6px ${barColor}80`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

function DangerMeter({ value }) {
  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "9px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.8px" }}>
          FAILURE SEVERITY
        </span>
        <span style={{ fontSize: "9px", color: FF.red, fontFamily: "'JetBrains Mono', monospace", fontWeight: "600" }}>
          {value}/100
        </span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`,
          background: value === 100 ? FF.red : `linear-gradient(90deg, ${FF.amber}, ${FF.red})`,
          borderRadius: "2px", boxShadow: `0 0 6px ${FF.red}80`,
        }} />
      </div>
    </div>
  );
}

// === QUERY ROUTER ===
function QueryRouter({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 3) return [];
    return SEARCH_INDEX.filter(r => r.text.toLowerCase().includes(q)).slice(0, 3);
  }, [query]);

  const hasResults = results.length > 0;

  return (
    <div style={{ marginBottom: "20px", position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: focused ? "rgba(37,20,67,0.9)" : "rgba(26,11,46,0.7)",
        border: `1px solid ${focused ? FF.border1 : FF.border0}`,
        borderRadius: "12px", padding: "10px 14px",
        transition: "all 0.2s ease",
        boxShadow: focused ? glow(FF.purple, 10) : "none",
      }}>
        <span style={{ fontSize: "14px", opacity: 0.6 }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Type any ERP question to route it to the right primitive..."
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: FF.text, fontSize: "12px", fontFamily: "'Inter', sans-serif",
          }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: FF.textTer, fontSize: "14px", padding: 0, lineHeight: 1,
          }}>✕</button>
        )}
        <span style={{
          fontSize: "9px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace",
          padding: "2px 8px", border: `1px solid ${FF.border0}`, borderRadius: "6px",
          whiteSpace: "nowrap",
        }}>
          QUERY ROUTER
        </span>
      </div>

      {focused && hasResults && (
        <div className="fade-in" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#1A0B2E", border: `1px solid ${FF.border1}`,
          borderRadius: "12px", overflow: "hidden", zIndex: 100,
          boxShadow: glow(FF.purple, 12),
        }}>
          {results.map((r, i) => (
            <div key={i}
              onClick={() => { onNavigate(r.tab); setQuery(""); }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px",
                borderBottom: i < results.length - 1 ? `1px solid ${FF.border0}` : "none",
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(168,85,247,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: "16px" }}>{r.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", color: FF.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  "{r.text}"
                </div>
                <div style={{ fontSize: "10px", color: FF.textTer, marginTop: "2px" }}>{r.label}</div>
              </div>
              <span style={{
                fontSize: "10px", padding: "2px 9px",
                background: `${r.color}14`, color: r.color, border: `1px solid ${r.color}35`,
                borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
              }}>
                {r.verdict}
              </span>
            </div>
          ))}
          <div style={{ padding: "7px 14px", fontSize: "9px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace" }}>
            click to navigate · {SEARCH_INDEX.length} indexed examples
          </div>
        </div>
      )}

      {focused && !hasResults && query.length >= 3 && (
        <div className="fade-in" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#1A0B2E", border: `1px solid ${FF.border0}`,
          borderRadius: "12px", padding: "12px 14px", zIndex: 100,
          fontSize: "11px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace",
        }}>
          No indexed match — use the Decision Tree to route manually
        </div>
      )}
    </div>
  );
}

// === DECISION TREE ===
function DecisionTree({ selected, setSelected }) {
  const branch = selected ? BRANCHES.find(b => b.id === selected) : null;

  return (
    <div>
      <div style={{ ...glassStyle, padding: "18px 22px", marginBottom: "18px", textAlign: "center",
        background: "rgba(37, 20, 67, 0.7)", position: "relative", overflow: "hidden" }}
        className={!branch ? "glow-pulse" : ""}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(168,85,247,0.05), rgba(244,114,182,0.03))", pointerEvents: "none" }} />
        <div style={{ fontSize: "10px", color: FF.purple, fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          START HERE
        </div>
        <div style={{ fontSize: "17px", fontWeight: "700", marginBottom: "4px" }}>What type of ERP request is this?</div>
        <div style={{ fontSize: "12px", color: FF.textSec }}>Select a category to route to the right execution primitive</div>
      </div>

      {!branch ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "8px" }}>
          {BRANCHES.map((b, i) => (
            <button key={b.id} className="ff-branch" onClick={() => setSelected(b.id)}
              style={{
                ...glassStyle, padding: "16px", textAlign: "left", color: FF.text,
                gridColumn: i === 4 ? "1 / -1" : "auto",
                display: i === 4 ? "flex" : "block",
                alignItems: i === 4 ? "center" : undefined,
                gap: i === 4 ? "16px" : undefined,
              }}>
              <div style={{ fontSize: i === 4 ? "28px" : "24px", marginBottom: i === 4 ? 0 : "10px" }}>{b.emoji}</div>
              <div style={{ flex: i === 4 ? 1 : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: b.color }}>{b.label}</span>
                  <RiskBadge level={b.risk} />
                </div>
                <div style={{ fontSize: "11px", color: FF.textTer }}>{b.sub}</div>
                <div style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", marginTop: "6px" }}>click to route →</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="fade-in">
          <div style={{
            background: branch.bg, border: `1px solid ${branch.border}`,
            borderRadius: "16px", padding: "24px", marginBottom: "14px",
            boxShadow: glow(branch.color, 18), backdropFilter: "blur(12px)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
              <div style={{ fontSize: "36px", lineHeight: 1 }}>{branch.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: branch.color, lineHeight: 1, textShadow: `0 0 20px ${branch.color}60` }}>
                    {branch.verdict}
                  </div>
                  <RiskBadge level={branch.risk} />
                </div>
                <div style={{ fontSize: "11px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace" }}>
                  {branch.verdictSub}
                </div>
              </div>
            </div>

            {/* Risk note */}
            <div style={{
              background: `${RISK[branch.risk]?.color}10`, border: `1px solid ${RISK[branch.risk]?.border}`,
              borderRadius: "8px", padding: "10px 12px", marginBottom: "14px",
              display: "flex", gap: "8px", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "12px", flexShrink: 0 }}>⚠</span>
              <div style={{ fontSize: "11px", color: RISK[branch.risk]?.color, lineHeight: "1.6", fontFamily: "'Inter', sans-serif" }}>
                {branch.riskNote}
              </div>
            </div>

            {/* Why */}
            <p style={{ fontSize: "13px", color: FF.textSec, lineHeight: "1.7", marginBottom: "16px",
              borderLeft: `2px solid ${branch.border}`, paddingLeft: "12px" }}>
              {branch.why}
            </p>

            {/* Don't confuse with */}
            <div style={{
              background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.2)",
              borderRadius: "8px", padding: "10px 12px", marginBottom: "16px",
            }}>
              <div style={{ fontSize: "9px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1px",
                fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>
                ⚡ DON'T CONFUSE WITH
              </div>
              <div style={{ fontSize: "11px", color: FF.textSec, lineHeight: "1.6", fontFamily: "'Inter', sans-serif" }}>
                {branch.notConfuseWith}
              </div>
            </div>

            {/* Examples */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1.2px",
                marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
                EXAMPLE QUERIES
              </div>
              {branch.examples.map((ex, i) => (
                <div key={i} style={{
                  fontSize: "12px", color: FF.textSec, padding: "7px 11px",
                  background: "rgba(255,255,255,0.03)", borderRadius: "7px", marginBottom: "5px",
                  borderLeft: `2px solid ${branch.color}50`, fontStyle: "italic", fontFamily: "'Inter', sans-serif",
                }}>
                  "{ex}"
                </div>
              ))}
            </div>

            {/* Stack */}
            <div>
              <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1.2px",
                marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
                RECOMMENDED STACK
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {branch.stack.map((s, i) => (
                  <span key={i} style={{
                    fontSize: "11px", padding: "4px 12px",
                    background: `${branch.color}12`, border: `1px solid ${branch.color}30`,
                    borderRadius: "20px", color: branch.color, fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mini switcher */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "14px" }}>
            {BRANCHES.map(b => (
              <button key={b.id} className="ff-mini" onClick={() => setSelected(b.id)}
                style={{
                  padding: "9px 6px", borderRadius: "10px",
                  background: b.id === selected ? `${b.color}14` : "rgba(26,11,46,0.6)",
                  border: `1px solid ${b.id === selected ? b.color + "55" : FF.border0}`,
                  color: b.id === selected ? b.color : FF.textTer,
                  fontSize: "10px", textAlign: "center", fontFamily: "'Poppins', sans-serif",
                  fontWeight: b.id === selected ? "600" : "400",
                }}>
                <div style={{ fontSize: "16px", marginBottom: "3px" }}>{b.emoji}</div>
                <div style={{ fontSize: "9px", lineHeight: "1.3" }}>{b.label.split("/")[0].split("(")[0].trim()}</div>
              </button>
            ))}
          </div>

          <button onClick={() => setSelected(null)} style={{
            background: "transparent", border: `1px solid ${FF.border0}`,
            borderRadius: "8px", padding: "8px 16px", color: FF.textTer,
            fontSize: "11px", cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all 0.15s ease",
          }}
            onMouseEnter={e => e.target.style.color = FF.text}
            onMouseLeave={e => e.target.style.color = FF.textTer}
          >
            ↩ Start over
          </button>
        </div>
      )}
    </div>
  );
}

// === USE CASE MATRIX ===
function UseCaseMatrix() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>When to use RAG in an ERP assistant</div>
        <div style={{ fontSize: "12px", color: FF.textSec }}>5 high-value use cases where retrieval earns its place — confidence score shows how clear-cut the routing decision is</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {USE_CASES.map((uc, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="ff-card" onClick={() => setActive(isActive ? null : i)}
              style={{
                ...glassStyle, padding: "17px",
                background: isActive ? "rgba(52, 211, 153, 0.07)" : FF.glassCard,
                border: `1px solid ${isActive ? FF.greenBorder : FF.border0}`,
                boxShadow: isActive ? `0 0 20px rgba(52,211,153,0.18)` : "none",
                gridColumn: i === 4 ? "1 / -1" : "auto",
                animationDelay: `${i * 60}ms`,
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
                <span style={{ fontSize: "20px" }}>{uc.emoji}</span>
                <div style={{ fontSize: "13px", fontWeight: "600", color: isActive ? FF.green : FF.text, flex: 1 }}>
                  {uc.title}
                </div>
                <span style={{
                  fontSize: "10px", padding: "2px 9px",
                  background: FF.greenBg, color: FF.green, border: `1px solid ${FF.greenBorder}`,
                  borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", flexShrink: 0,
                }}>RAG ✓</span>
              </div>
              <div style={{ fontSize: "12px", color: FF.textSec, lineHeight: "1.65" }}>{uc.desc}</div>
              <ConfidenceBar value={uc.confidence} />
              {isActive && (
                <div className="fade-in" style={{ marginTop: "14px" }}>
                  <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>
                    EXAMPLE QUERIES
                  </div>
                  {uc.qs.map((q, qi) => (
                    <div key={qi} style={{
                      fontSize: "11px", color: FF.textSec, padding: "6px 10px",
                      background: "rgba(52,211,153,0.04)", borderRadius: "6px", marginBottom: "5px",
                      borderLeft: `2px solid ${FF.greenBorder}`, fontStyle: "italic", fontFamily: "'Inter', sans-serif",
                    }}>
                      "{q}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === ANTI PATTERN GRID ===
function AntiPatternGrid() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>When NOT to use RAG in an ERP assistant</div>
        <div style={{ fontSize: "12px", color: FF.textSec }}>5 anti-patterns that break in production — failure severity shows the consequence of getting it wrong</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {ANTI_PATTERNS.map((ap, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="ff-card" onClick={() => setActive(isActive ? null : i)}
              style={{
                ...glassStyle, padding: "17px",
                background: isActive ? FF.redBg : FF.glassCard,
                border: `1px solid ${isActive ? FF.redBorder : FF.border0}`,
                boxShadow: isActive ? `0 0 20px rgba(248,113,113,0.15)` : "none",
                gridColumn: i === 4 ? "1 / -1" : "auto",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
                <span style={{ fontSize: "20px" }}>{ap.emoji}</span>
                <div style={{ fontSize: "13px", fontWeight: "600", color: isActive ? FF.red : FF.text, flex: 1 }}>
                  {ap.title}
                </div>
                <span style={{
                  fontSize: "10px", padding: "2px 9px",
                  background: FF.redBg, color: FF.red, border: `1px solid ${FF.redBorder}`,
                  borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", flexShrink: 0,
                }}>RAG ✗</span>
              </div>
              <div style={{ fontSize: "12px", color: FF.textSec, lineHeight: "1.65", marginBottom: "10px" }}>{ap.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace" }}>Use instead:</span>
                <span style={{
                  fontSize: "10px", padding: "2px 9px",
                  background: `${ap.altColor}12`, color: ap.altColor, border: `1px solid ${ap.altColor}35`,
                  borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {ap.alt}
                </span>
              </div>
              <DangerMeter value={ap.danger} />
              {isActive && (
                <div className="fade-in" style={{ marginTop: "14px" }}>
                  <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>
                    WRONG PATTERN — DON'T DO THIS
                  </div>
                  {ap.wrong.map((q, qi) => (
                    <div key={qi} style={{
                      fontSize: "11px", color: `${FF.red}aa`, padding: "6px 10px",
                      background: "rgba(248,113,113,0.06)", borderRadius: "6px", marginBottom: "5px",
                      borderLeft: `2px solid ${FF.redBorder}`, fontStyle: "italic",
                      textDecoration: "line-through", textDecorationColor: `${FF.red}60`,
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      "{q}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === ARCHITECTURE VIEW ===
function ArchView() {
  const [activeTag, setActiveTag] = useState(null);
  const [activeLane, setActiveLane] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Hybrid ERP Assistant Architecture</div>
        <div style={{ fontSize: "12px", color: FF.textSec }}>
          Intent router → 5 execution lanes — permission-scoped by tenant, role, module, and record type
        </div>
      </div>

      {/* Flow */}
      <div style={{ marginBottom: "20px" }}>
        {/* User input */}
        <div style={{ ...glassStyle, padding: "13px 18px", textAlign: "center", marginBottom: "8px" }}>
          <div style={{ fontSize: "12px", fontWeight: "600" }}>👤 User Question</div>
          <div style={{ fontSize: "11px", color: FF.textSec, marginTop: "3px", fontFamily: "'JetBrains Mono', monospace" }}>
            context: screen · module · record · role · company · location
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{ width: "2px", height: "20px", background: `linear-gradient(to bottom, ${FF.border0}, ${FF.purple})`, margin: "0 auto", borderRadius: "1px" }} />
        </div>

        {/* Intent router */}
        <div style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.12))",
          border: `1px solid ${FF.border1}`, borderRadius: "14px", padding: "14px 18px",
          textAlign: "center", marginBottom: "8px", boxShadow: glow(FF.purple, 16),
        }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: FF.purple }}>⚡ Intent Router</div>
          <div style={{ fontSize: "11px", color: FF.textSec, marginTop: "3px" }}>
            Classifies query type and selects execution path
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{ width: "2px", height: "20px", background: `linear-gradient(to bottom, ${FF.purple}, ${FF.border0})`, margin: "0 auto", borderRadius: "1px" }} />
        </div>

        {/* Lanes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
          {LANES.map((lane) => {
            const isActive = activeLane === lane.id;
            return (
              <div key={lane.id}>
                <div className="ff-lane" onClick={() => setActiveLane(isActive ? null : lane.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: isActive ? `${lane.destColor}0e` : "rgba(26,11,46,0.5)",
                    border: `1px solid ${isActive ? lane.destColor + "40" : FF.border0}`,
                    borderRadius: isActive ? "10px 10px 0 0" : "10px",
                    padding: "10px 14px", cursor: "pointer",
                  }}>
                  <span style={{ fontSize: "11px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", minWidth: "16px" }}>
                    {lane.id}.
                  </span>
                  <span style={{ fontSize: "15px" }}>{lane.emoji}</span>
                  <span style={{ fontSize: "12px", color: FF.textSec, flex: 1 }}>{lane.label}</span>
                  <span style={{ fontSize: "12px", color: FF.textTer }}>→</span>
                  <span style={{
                    fontSize: "10px", padding: "3px 10px",
                    background: `${lane.destColor}12`, color: lane.destColor,
                    border: `1px solid ${lane.destColor}30`, borderRadius: "20px",
                    fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
                  }}>
                    {lane.dest}
                  </span>
                  <span style={{ fontSize: "10px", color: isActive ? lane.destColor : FF.textTer, transition: "all 0.15s" }}>
                    {isActive ? "▲" : "▼"}
                  </span>
                </div>
                {isActive && (
                  <div className="fade-in" style={{
                    background: `${lane.destColor}06`,
                    border: `1px solid ${lane.destColor}30`,
                    borderTop: "none", borderRadius: "0 0 10px 10px",
                    padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: "11px", color: FF.textSec, lineHeight: "1.65", marginBottom: "10px" }}>
                      {lane.detail}
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                      <span style={{ fontSize: "10px", color: lane.destColor, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "1px" }}>
                        🔒
                      </span>
                      <div style={{
                        fontSize: "10px", color: lane.destColor,
                        fontFamily: "'JetBrains Mono', monospace", lineHeight: "1.6",
                        background: `${lane.destColor}08`, padding: "5px 9px",
                        borderRadius: "6px", border: `1px solid ${lane.destColor}25`, flex: 1,
                      }}>
                        {lane.security}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Audit layer */}
        <div style={{
          background: FF.amberBg, border: `1px solid ${FF.amberBorder}`,
          borderRadius: "10px", padding: "10px 14px",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <span style={{ fontSize: "15px" }}>📋</span>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: FF.amber }}>Audit Layer (all lanes)</div>
            <div style={{ fontSize: "11px", color: FF.textSec, marginTop: "1px" }}>
              Every answer and action logged with source, user, timestamp, accessed records, and tool call trace
            </div>
          </div>
        </div>
      </div>

      {/* Metadata filters */}
      <div style={{ ...glassStyle, padding: "18px 20px" }}>
        <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "3px" }}>Permission-Aware Retrieval Metadata</div>
        <div style={{ fontSize: "11px", color: FF.textSec, marginBottom: "14px", lineHeight: "1.55" }}>
          Never index ERP data into one shared vector space. Every retrieval must be scoped by these metadata filters — or access is denied. Click any tag to see why it matters.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "10px" }}>
          {META_TAGS.map((tag, i) => (
            <span key={i} className="ff-tag" onClick={() => setActiveTag(activeTag === i ? null : i)}
              style={{
                fontSize: "11px", padding: "4px 12px",
                background: activeTag === i ? `${tag.color}18` : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeTag === i ? tag.color + "60" : FF.border0}`,
                borderRadius: "20px", color: activeTag === i ? tag.color : FF.textTer,
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: activeTag === i ? `0 0 10px ${tag.color}30` : "none",
              }}>
              {tag.label}
            </span>
          ))}
        </div>

        {activeTag !== null && (
          <div className="fade-in" style={{
            background: `${META_TAGS[activeTag].color}08`,
            border: `1px solid ${META_TAGS[activeTag].color}35`,
            borderRadius: "8px", padding: "10px 12px", marginBottom: "8px",
          }}>
            <div style={{ fontSize: "10px", color: META_TAGS[activeTag].color, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.8px", marginBottom: "5px", fontWeight: "600" }}>
              {META_TAGS[activeTag].label}
            </div>
            <div style={{ fontSize: "11px", color: FF.textSec, lineHeight: "1.65" }}>
              {META_TAGS[activeTag].desc}
            </div>
          </div>
        )}

        <div style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace" }}>
          {activeTag === null ? "click tags to expand description" : "click again to dismiss · for financial/inventory: require deterministic validation before any answer becomes an action"}
        </div>
      </div>
    </div>
  );
}

// === QUICK REF ===
function QuickRef() {
  const cols = [
    { key: "freshness", label: "Data Freshness" },
    { key: "writes", label: "Write Ops" },
    { key: "cites", label: "Source Citations" },
    { key: "risk", label: "Failure Risk" },
    { key: "when", label: "Route When" },
    { key: "useFor", label: "Use For" },
  ];

  const riskColor = (r) => {
    if (r === "LOW") return FF.green;
    if (r === "MEDIUM") return FF.amber;
    if (r === "HIGH ⚠" || r === "CRITICAL") return FF.red;
    return FF.textTer;
  };

  const boolColor = (ok) => {
    if (ok === true) return FF.green;
    if (ok === false) return FF.red;
    return FF.textTer;
  };

  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Quick Reference Matrix</div>
        <div style={{ fontSize: "12px", color: FF.textSec }}>
          5 execution primitives — side-by-side comparison for fast routing decisions
        </div>
      </div>

      {/* Primitive cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {QUICK_REF.map((row, i) => (
          <div key={i} style={{
            ...glassStyle, padding: "16px 18px",
            borderLeft: `3px solid ${row.color}`,
            background: `rgba(26,11,46,0.7)`,
          }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "18px" }}>{row.emoji}</span>
              <div style={{ fontSize: "13px", fontWeight: "700", color: row.color, flex: 1 }}>
                {row.primitive}
              </div>
              <span style={{
                fontSize: "10px", padding: "3px 10px",
                background: `${riskColor(row.risk)}12`, color: riskColor(row.risk),
                border: `1px solid ${riskColor(row.risk)}30`,
                borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: "nowrap",
              }}>
                {row.risk} RISK
              </span>
            </div>

            {/* Stat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "10px" }}>
              {[
                { label: "Data Freshness", value: row.freshness, ok: row.freshnessOk },
                { label: "Write Ops", value: row.writes, ok: row.writesOk },
                { label: "Citations", value: row.cites, ok: row.citesOk },
              ].map((stat, si) => (
                <div key={si} style={{
                  background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "8px 10px",
                  border: `1px solid ${FF.border0}`,
                }}>
                  <div style={{ fontSize: "9px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.5px", marginBottom: "4px" }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: "11px", fontWeight: "600",
                    color: stat.ok === null ? FF.textTer : stat.ok ? FF.green : FF.red,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* When + Use for */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div style={{ background: `${row.color}08`, border: `1px solid ${row.color}20`, borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "9px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.5px", marginBottom: "4px" }}>
                  ROUTE WHEN
                </div>
                <div style={{ fontSize: "11px", color: row.color, lineHeight: "1.5" }}>{row.when}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${FF.border0}`, borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "9px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.5px", marginBottom: "4px" }}>
                  USE FOR
                </div>
                <div style={{ fontSize: "11px", color: FF.textSec, lineHeight: "1.5" }}>{row.useFor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Golden rules */}
      <div style={{ ...glassStyle, padding: "18px 20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "12px", color: FF.purple }}>
          ⚡ Golden Rules
        </div>
        {[
          { rule: "RAG for documents. APIs for truth. Tools for action.", color: FF.green },
          { rule: "Stale retrieval in the wrong lane breaks production.", color: FF.red },
          { rule: "Hybrid queries: always API first, RAG second. Never let the LLM choose the order.", color: FF.amber },
          { rule: "No write operation without: auth check → confirmation gate → audit log → rollback.", color: FF.amber },
          { rule: "No retrieval without: tenant_id + role + sensitivity_level metadata filters.", color: FF.purple },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: "10px", alignItems: "flex-start",
            marginBottom: i < 4 ? "8px" : 0,
          }}>
            <span style={{
              fontSize: "9px", color: item.color, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: "700", marginTop: "2px", flexShrink: 0,
            }}>
              {i + 1}.
            </span>
            <div style={{ fontSize: "11px", color: FF.textSec, lineHeight: "1.6", borderLeft: `2px solid ${item.color}40`, paddingLeft: "10px" }}>
              {item.rule}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === MAIN APP ===
export default function App() {
  const [tab, setTab] = useState("tree");
  const [treeSelected, setTreeSelected] = useState(null);

  const TABS = [
    { id: "tree", label: "Decision Tree" },
    { id: "use", label: "When to Use" },
    { id: "avoid", label: "When to Avoid" },
    { id: "arch", label: "Architecture" },
    { id: "ref", label: "Quick Ref" },
  ];

  const STATS = [
    { label: "primitives", value: 5, color: FF.purple },
    { label: "use cases", value: 5, color: FF.green },
    { label: "anti-patterns", value: 5, color: FF.red },
    { label: "indexed examples", value: SEARCH_INDEX.length, color: FF.cyan },
  ];

  return (
    <div style={{
      fontFamily: "'Poppins', 'Inter', system-ui, sans-serif",
      background: FF.bg0,
      minHeight: "100vh",
      color: FF.text,
      padding: "24px 20px 40px",
      maxWidth: "860px",
      margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(168,85,247,0.3); }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.4); border-radius: 2px; }

        .ff-tab { transition: all 0.2s ease; cursor: pointer; border: none; outline: none; }
        .ff-tab:hover { color: #F8FAFC !important; }

        .ff-branch { transition: all 0.18s ease; cursor: pointer; border: none; outline: none; }
        .ff-branch:hover { transform: translateY(-2px); border-color: rgba(168,85,247,0.5) !important; box-shadow: 0 0 20px rgba(168,85,247,0.2); }

        .ff-card { transition: all 0.18s ease; cursor: pointer; }
        .ff-card:hover { transform: translateY(-2px); }

        .ff-lane { transition: background 0.15s ease; cursor: pointer; }
        .ff-lane:hover { background: rgba(168,85,247,0.08) !important; }

        .ff-tag { transition: all 0.15s ease; cursor: pointer; user-select: none; }
        .ff-tag:hover { transform: scale(1.06); }

        .ff-mini { transition: all 0.15s ease; cursor: pointer; border: none; outline: none; }
        .ff-mini:hover { transform: translateY(-1px); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.22s ease forwards; }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(168,85,247,0.3); }
          50% { box-shadow: 0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(168,85,247,0.2); }
        }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
          <div style={{
            width: "44px", height: "44px",
            background: "linear-gradient(135deg, #A855F7, #7C3AED)",
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", boxShadow: glow(FF.purple, 15), flexShrink: 0,
          }}>⚡</div>
          <div>
            <div style={{
              fontSize: "22px", fontWeight: "700", letterSpacing: "-0.4px",
              background: FF.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              RAG Decision Intelligence
            </div>
            <div style={{ fontSize: "11px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.2px", marginTop: "2px" }}>
              ERP ASSISTANT · HYBRID ARCHITECTURE GUIDE · v2
            </div>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: FF.textSec, lineHeight: "1.65", maxWidth: "580px", marginBottom: "12px" }}>
          RAG for knowledge. APIs for truth. Tools for action. Route every ERP assistant query to the right primitive — stale retrieval in the wrong place breaks production systems.
        </p>

        {/* Stats pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {STATS.map((s, i) => (
            <span key={i} style={{
              fontSize: "10px", padding: "3px 10px",
              background: `${s.color}10`, color: s.color, border: `1px solid ${s.color}25`,
              borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace",
            }}>
              {s.value} {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* QUERY ROUTER */}
      <QueryRouter onNavigate={(t) => { setTab(t); setTreeSelected(null); }} />

      {/* TABS */}
      <div style={{
        display: "flex", gap: "4px",
        background: "rgba(26, 11, 46, 0.8)", border: `1px solid ${FF.border0}`,
        borderRadius: "14px", padding: "4px", marginBottom: "26px",
        backdropFilter: "blur(12px)", flexWrap: "wrap",
      }}>
        {TABS.map(t => (
          <button key={t.id} className="ff-tab" onClick={() => { setTab(t.id); setTreeSelected(null); }}
            style={{
              flex: "1", minWidth: "80px", padding: "9px 8px",
              borderRadius: "10px", fontSize: "12px",
              fontWeight: tab === t.id ? "600" : "400",
              color: tab === t.id ? FF.text : FF.textTer,
              background: tab === t.id
                ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.2))"
                : "transparent",
              boxShadow: tab === t.id ? `0 0 16px rgba(168,85,247,0.25)` : "none",
              border: tab === t.id ? `1px solid ${FF.border1}` : "1px solid transparent",
              fontFamily: "'Poppins', sans-serif", letterSpacing: "0.1px",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div key={tab} className="fade-in">
        {tab === "tree" && <DecisionTree selected={treeSelected} setSelected={setTreeSelected} />}
        {tab === "use" && <UseCaseMatrix />}
        {tab === "avoid" && <AntiPatternGrid />}
        {tab === "arch" && <ArchView />}
        {tab === "ref" && <QuickRef />}
      </div>
    </div>
  );
}
