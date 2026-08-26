import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// FLASHFUSION LOCKED TOKENS
// ═══════════════════════════════════════════════════════════
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
  `0 0 ${s}px ${col}50, 0 0 ${s * 2}px ${col}20, 0 4px 24px rgba(0,0,0,0.5)`;

const card = {
  background: FF.glassCard,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${FF.border0}`,
  borderRadius: "16px",
};

// ═══════════════════════════════════════════════════════════
// DECISION TREE QUESTIONS
// ═══════════════════════════════════════════════════════════
const TREE = {
  q1: {
    q: "Is the answer time-sensitive — could it change today?",
    hint: "Inventory counts, invoice status, credit limits, PO states, open balances — anything that changes intraday",
    yes: "q_write",
    no: "q2",
    yL: "Yes — could change intraday",
    nL: "No — stable knowledge or policy",
  },
  q_write: {
    q: "Does this request involve creating, updating, or approving a record?",
    hint: "Create PO, approve invoice, move inventory, close work order, post GL entry",
    yes: "verdict_action",
    no: "verdict_livedata",
    yL: "Yes — write or approve operation",
    nL: "No — read-only lookup",
  },
  q2: {
    q: "Does the answer live in a document, policy, SOP, or training manual?",
    hint: "Approval rules, process guides, field definitions, compliance policies, onboarding content",
    yes: "q3",
    no: "verdict_livedata",
    yL: "Yes — it's in the documentation",
    nL: "No — structured entity lookup",
  },
  q3: {
    q: "Does a complete answer also require live ERP data?",
    hint: '"Why was this PO rejected?" needs the policy (doc) + the actual PO record (live ERP)',
    yes: "verdict_mixed",
    no: "q4",
    yL: "Yes — needs both doc and live data",
    nL: "No — documents are sufficient",
  },
  q4: {
    q: "Must this answer cite a source document for audit or compliance review?",
    hint: "Regulatory review, GL coding defensibility, approval documentation, audit trails",
    yes: "verdict_compliance",
    no: "verdict_knowledge",
    yL: "Yes — citation trail required",
    nL: "No — general guidance is fine",
  },
};

// ═══════════════════════════════════════════════════════════
// BRANCHES / VERDICTS
// ═══════════════════════════════════════════════════════════
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
    why: "The answer lives in docs, manuals, policy files, training material, or internal knowledge bases. Classic RAG territory — this is where retrieval earns its place.",
    examples: [
      "What is our approval policy for POs over $5,000?",
      "How do I process a vendor return?",
      "What does the receiving SOP say about damaged goods?",
    ],
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
    why: "RAG is stale by design. For inventory counts, overdue invoices, credit limits, and PO status — query the source of record directly with strict RBAC enforcement.",
    examples: [
      "What is current inventory for SKU-1042?",
      "What invoices are overdue today?",
      "What is ACME's credit limit?",
    ],
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
    why: "Never use RAG to execute transactions. Every write operation needs deterministic tools with schema validation, auth checks, confirmation gates, and rollback capability.",
    examples: [
      "Create a PO for vendor X.",
      "Approve this invoice.",
      "Move 40 units to warehouse B.",
    ],
    stack: ["Typed tool call schema", "RBAC authorization check", "User confirmation gate", "Audit log writer + rollback"],
  },
  {
    id: "mixed",
    emoji: "🔀",
    label: "Record + Context (Mixed)",
    sub: "Live data with surrounding policy context",
    color: FF.pink,
    bg: "rgba(244, 114, 182, 0.08)",
    border: "rgba(244, 114, 182, 0.3)",
    verdict: "HYBRID",
    verdictSub: "API/SQL first → RAG second for explanation",
    why: "Pull live ERP data first for factual accuracy. Then use RAG to explain the policies, approval rules, or vendor history surrounding that data. Never reverse this order.",
    examples: [
      "Why was this PO rejected?",
      "Which customers are affected by this supplier delay?",
      "What products are blocked by the quality hold?",
    ],
    stack: ["ERP API → live truth", "RAG → policy/context layer", "Synthesis prompt", "Source citations + record links"],
  },
  {
    id: "compliance",
    emoji: "🛡️",
    label: "Compliance / Audit",
    sub: "Traceable, citeable, defensible answers",
    color: FF.purple,
    bg: "rgba(168, 85, 247, 0.08)",
    border: FF.border1,
    verdict: "RAG + CITATIONS",
    verdictSub: "Audit Query → RAG + Evidence + Record Trail",
    why: "RAG with citation mode. Every answer needs a traceable source document or record. Combine retrieved policy docs with ERP record evidence for defensible, auditable responses.",
    examples: [
      "Show the policy that explains this approval.",
      "Find the GL coding rule documentation.",
      "Summarize evidence for this vendor compliance issue.",
    ],
    stack: ["RAG with citation mode on", "Record evidence retrieval", "Audit trail linkage", "Source-stamped answer"],
  },
];

// ═══════════════════════════════════════════════════════════
// USE CASES
// ═══════════════════════════════════════════════════════════
const USE_CASES = [
  {
    emoji: "📜",
    title: "Policy, SOP & Process Questions",
    tags: ["policy", "sop", "process", "workflow", "approval"],
    desc: "Approval policies, process workflows, operational procedures. Answers live in documents — this is RAG's home territory in ERP.",
    qs: ["What is our approval policy for purchases over $5K?", "How do I process a vendor return?", "What's the month-end accounting closeout checklist?"],
  },
  {
    emoji: "🔍",
    title: "ERP Records + Supporting Context",
    tags: ["records", "context", "hybrid", "vendor", "PO"],
    desc: "Structured records paired with surrounding context — approval rules, vendor notes, procurement policy, email history, audit trail. RAG pulls the context while APIs pull the live data.",
    qs: ["Why was this purchase order rejected?", "What's the vendor compliance history behind this invoice?"],
  },
  {
    emoji: "🎓",
    title: "Onboarding & Help Assistant",
    tags: ["onboarding", "help", "training", "navigation", "fields"],
    desc: "Highest-value ERP RAG use case. Answers field definitions, workflow questions, navigation help, and module-by-module process guidance for every user tier.",
    qs: ["How do I create a sales order?", "What does this field mean?", "What's the difference between committed and available inventory?"],
  },
  {
    emoji: "⚖️",
    title: "Audit & Compliance Support",
    tags: ["audit", "compliance", "citation", "GL", "regulatory"],
    desc: "Every answer backed by a source document. Traceable, citeable, defensible. RAG with citation mode is purpose-built for this — it can point to the exact policy line.",
    qs: ["Show me the policy behind this approval.", "Find documentation for this GL coding rule.", "Summarize evidence for this vendor compliance issue."],
  },
  {
    emoji: "🌐",
    title: "Cross-Module Knowledge",
    tags: ["cross-module", "integration", "supplier", "customer", "contract"],
    desc: "ERP systems are fragmented across modules. RAG bridges the knowledge gap — but always combine with API lookups for live operational state. Never RAG alone for cross-module truth.",
    qs: ["Which customers are affected by the supplier delay?", "What does the contract say about late delivery penalties?"],
  },
];

// ═══════════════════════════════════════════════════════════
// ANTI-PATTERNS
// ═══════════════════════════════════════════════════════════
const ANTI_PATTERNS = [
  {
    emoji: "📊",
    title: "Live ERP Data Queries",
    tags: ["inventory", "invoice", "live", "realtime", "status"],
    desc: "RAG is stale by design. Inventory counts, overdue invoices, credit limits, PO status — these demand direct queries against the source of record.",
    alt: "ERP API / SQL",
    altColor: FF.cyan,
    wrong: ["What is current inventory for SKU-1042?", "What invoices are overdue today?", "What is ACME's credit limit?"],
    why: "Vector similarity search returns approximate semantic matches from an index snapshot. Live operational data requires exact, current values from the ERP source of record.",
  },
  {
    emoji: "⚙️",
    title: "Transaction Execution",
    tags: ["create", "approve", "write", "action", "post"],
    desc: "RAG must never execute write operations. Every action needs deterministic tools, auth checks, confirmation gates, audit logs, and rollback capability.",
    alt: "Tool Call + Validation",
    altColor: FF.amber,
    wrong: ["Create a PO.", "Approve this invoice.", "Move 40 units to warehouse B."],
    why: "RAG generates text, not validated reversible actions. Write operations require typed schemas, RBAC enforcement, confirmation UX, and audit trail — none of which retrieval provides.",
  },
  {
    emoji: "🧮",
    title: "Calculations & Financial Truth",
    tags: ["calculate", "math", "financial", "reconcile", "tax", "margin"],
    desc: "RAG can explain the rule. It must never be the source of numerical truth. Margin, tax, forecasting, reconciliation — use rules engines, SQL, or ERP APIs.",
    alt: "Rules Engine / SQL",
    altColor: FF.cyan,
    wrong: ["Calculate margin on this order.", "Reconcile this invoice.", "Compute tax for this transaction."],
    why: "Retrieval augmentation does not perform arithmetic. Hallucinated calculations in financial contexts are a compliance and trust liability. Route to deterministic computation.",
  },
  {
    emoji: "🔒",
    title: "Permission-Sensitive Data",
    tags: ["permissions", "security", "PII", "RBAC", "tenant", "payroll"],
    desc: "Generic vector search over ERP data is dangerous. Payroll, financials, HR records, vendor contracts, and pricing need tenant-scoped, role-filtered retrieval — or nothing.",
    alt: "Permission-Aware Retrieval",
    altColor: FF.purple,
    wrong: ["Unscoped vector similarity search", "Cross-tenant document retrieval", "Shared embedding index without metadata filters"],
    why: "ERP vector indices without tenant_id and role metadata filters will surface documents the user has no clearance for. This is a data breach vector, not a retrieval edge case.",
  },
  {
    emoji: "🗃️",
    title: "Structured Entity Lookups",
    tags: ["customer", "vendor", "entity", "lookup", "GL", "work order"],
    desc: "Customers, vendors, items, orders, invoices — these are structured entities. Retrieval from documents is the wrong primitive. Query the source of record.",
    alt: "Query Source of Record",
    altColor: FF.cyan,
    wrong: ["List all open work orders.", "Get vendor payment terms.", "Pull all active GL accounts."],
    why: "Structured entities live in ERP tables with defined schemas, not in unstructured document chunks. Semantic search over entities introduces imprecision where exact lookups are required.",
  },
];

// ═══════════════════════════════════════════════════════════
// ARCH NODE DETAILS
// ═══════════════════════════════════════════════════════════
const ARCH_DETAILS = {
  user: {
    title: "User Input Layer",
    color: FF.textSec,
    desc: "Every query arrives with implicit context — active ERP screen, module, user role, company, location, and the record currently in view. This context is injected into every routing and retrieval call automatically.",
    config: `{\n  "screen": "invoice_list",\n  "module": "AP",\n  "record_id": "INV-4421",\n  "user_role": "AP_MANAGER",\n  "tenant_id": "acme-corp",\n  "location_id": "CHI-01"\n}`,
    stack: ["Context injection", "Session-scoped metadata", "Role resolution", "Module detection"],
  },
  router: {
    title: "Intent Router",
    color: FF.purple,
    desc: "Lightweight LLM classifier (not RAG) that reads query + user context and outputs a lane decision in <200ms. Not the place for heavy reasoning — classify and route only. Confidence below threshold falls back to knowledge lane.",
    config: `Classify this ERP query into one of:\nknowledge | livedata | action | mixed | compliance\n\nContext: {context}\nQuery: "{query}"\n\nRespond only with:\n{ "lane": "string", "confidence": 0.0-1.0 }`,
    stack: ["Claude / GPT-4o-mini classifier", "Confidence threshold gate (≥0.75)", "Fallback: knowledge lane", "Cache by intent fingerprint"],
  },
  rag: {
    title: "RAG Pipeline — Knowledge Lane",
    color: FF.green,
    desc: "Tenant-scoped semantic retrieval over policy docs, SOPs, training materials, and manuals. Metadata-filtered at retrieval time. Never mix operational ERP data into the same index as policy docs — separate by document_type.",
    config: `model: text-embedding-3-small\nchunk_size: 512 tokens\noverlap: 64 tokens\ntop_k: 5 (reranked)\nfilters:\n  tenant_id: required\n  role: required\n  module: optional\n  doc_type: optional\ncitation_mode: always_on`,
    stack: ["pgvector / Pinecone / Weaviate", "Role-scoped index partitions", "Reranker (Cohere Rerank)", "Citation extraction layer"],
  },
  api: {
    title: "ERP API / SQL — Live Data Lane",
    color: FF.cyan,
    desc: "Read-only ERP REST/GraphQL endpoints or materialized SQL views. RBAC-enforced at the query layer. Returns structured JSON — no LLM reformatting of numbers, totals, or counts. Ever. The LLM explains; the API supplies the truth.",
    config: `auth: RBAC → allowed_tables[role]\npattern: read-only materialized views\nformat: structured JSON\nno_llm_reformat: true\nlatency_sla: <500ms\ncache_ttl: 30s (non-critical reads)`,
    stack: ["ERP REST API / GraphQL", "Read-only SQL views", "RBAC row-level enforcement", "Structured pass-through response"],
  },
  tool: {
    title: "Tool Call — Action Lane",
    color: FF.amber,
    desc: "Every write operation runs through a typed tool schema with RBAC auth, a user confirmation gate, and an immutable audit log entry. Rollback token issued on every action. No silent writes.",
    config: `flow:\n  1. Schema validation (Zod/Pydantic)\n  2. RBAC auth → allowed_actions[role]\n  3. Show confirmation UI to user\n  4. Execute ERP write API\n  5. Write immutable audit entry\n  6. Return result + rollback_token`,
    stack: ["Typed tool schema (Zod)", "RBAC auth gate", "Confirmation UI step", "ERP write API", "Rollback capability", "Immutable audit entry"],
  },
  hybrid: {
    title: "Hybrid — API first → RAG explain",
    color: FF.pink,
    desc: "Pull live ERP data first for factual accuracy. Then use RAG to supply the policy context or rules that explain it. Never reverse this order — RAG context cannot override live data truth.",
    config: `sequence:\n  1. ERP API → fetch record truth\n  2. RAG → retrieve policy context\n  3. Synthesis prompt:\n     "Given live record {record}\n      and policy context {policy},\n      explain: {query}"\n  4. Citations: record link + doc ref\n\nrule: API truth always wins`,
    stack: ["ERP API → truth layer", "RAG → context layer", "Synthesis prompt", "Dual-source citations"],
  },
  compliance: {
    title: "RAG + Citations — Compliance Lane",
    color: FF.purple,
    desc: "RAG with citation mode mandatory. Every answer must trace to a source document or ERP record. Built for audit review, regulatory defensibility, and GL coding documentation.",
    config: `rag_config:\n  citation_mode: required\n  source_stamp: doc_id + chunk_id\n  record_evidence: ERP record link\n\nanswer_format:\n  answer_text: string\n  citations: [{doc_id, chunk, text}]\n  record_links: [string]\n  confidence_score: float`,
    stack: ["RAG with mandatory citations", "Record evidence retrieval", "Audit trail linkage", "Source-stamped answer format"],
  },
  audit: {
    title: "Audit Logger — All Lanes",
    color: FF.amber,
    desc: "Every query, routing decision, retrieved source, and tool call is logged regardless of lane. Non-negotiable for ERP AI. Audit, compliance, and RBAC review all depend on this layer being complete and immutable.",
    config: `{\n  "user_id": "string",\n  "tenant_id": "string",\n  "role": "string",\n  "lane": "knowledge|livedata|action|mixed|compliance",\n  "query": "string",\n  "sources_retrieved": [],\n  "tool_calls": [],\n  "answer_hash": "sha256",\n  "latency_ms": 0,\n  "timestamp": "ISO8601"\n}`,
    stack: ["Append-only write", "Immutable record store", "RBAC audit feed", "Retention policy enforcement"],
  },
};

// ═══════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
      }}
      style={{
        background: "transparent",
        border: `1px solid ${FF.border0}`,
        borderRadius: "6px",
        padding: "4px 10px",
        cursor: "pointer",
        color: copied ? FF.green : FF.textTer,
        fontSize: "10px",
        fontFamily: "'JetBrains Mono', monospace",
        transition: "color 0.15s",
        display: "flex", alignItems: "center", gap: "4px",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: FF.textTer, fontSize: "13px", pointerEvents: "none" }}>
        🔍
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 36px 9px 34px",
          background: "rgba(26,11,46,0.6)",
          border: `1px solid ${value ? FF.border1 : FF.border0}`,
          borderRadius: "10px",
          color: FF.text, fontSize: "12px",
          fontFamily: "'Poppins', sans-serif",
          outline: "none",
          transition: "border-color 0.15s",
        }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: FF.textTer, fontSize: "13px", padding: "2px" }}>
          ✕
        </button>
      )}
    </div>
  );
}

function ConfigBlock({ text, color }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "8px", right: "8px" }}>
        <CopyBtn text={text} />
      </div>
      <pre style={{
        fontSize: "11px",
        fontFamily: "'JetBrains Mono', monospace",
        color: FF.textSec,
        background: "rgba(0,0,0,0.35)",
        padding: "14px 14px 14px 14px",
        paddingTop: "36px",
        borderRadius: "10px",
        border: `1px solid ${color}20`,
        overflowX: "auto",
        lineHeight: "1.7",
        whiteSpace: "pre-wrap",
        margin: 0,
      }}>{text}</pre>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("tree");

  const TABS = [
    { id: "tree", label: "Decision Tree" },
    { id: "use", label: "When to Use" },
    { id: "avoid", label: "When to Avoid" },
    { id: "arch", label: "Architecture" },
    { id: "ref", label: "Quick Ref" },
  ];

  return (
    <div style={{
      fontFamily: "'Poppins', 'Inter', system-ui, sans-serif",
      background: FF.bg0,
      minHeight: "100vh",
      color: FF.text,
      padding: "24px 20px 60px",
      maxWidth: "820px",
      margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(168,85,247,0.3); }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.4); border-radius: 2px; }
        .ff-btn { transition: all 0.18s ease; cursor: pointer; border: none; outline: none; }
        .ff-lift:hover { transform: translateY(-2px); }
        .ff-card { transition: all 0.18s ease; cursor: pointer; }
        .ff-card:hover { transform: translateY(-2px); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.22s ease forwards; }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(168,85,247,0.3); }
          50% { box-shadow: 0 0 35px rgba(168,85,247,0.55), 0 0 70px rgba(168,85,247,0.18); }
        }
        .pulse { animation: pulse 3s ease-in-out infinite; }
      `}</style>

      {/* HEADER */}
      <header style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
          <div style={{
            width: "46px", height: "46px",
            background: "linear-gradient(135deg, #A855F7, #7C3AED)",
            borderRadius: "13px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px",
            boxShadow: glow(FF.purple, 15),
            flexShrink: 0,
          }}>⚡</div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.4px", background: FF.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              RAG Decision Intelligence
            </div>
            <div style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.2px", marginTop: "2px" }}>
              ERP ASSISTANT · HYBRID ARCHITECTURE GUIDE · v2
            </div>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: FF.textSec, lineHeight: "1.65", maxWidth: "560px" }}>
          RAG for knowledge. APIs for truth. Tools for action. Route every ERP assistant query to the right primitive — stale retrieval in the wrong lane breaks production systems.
        </p>
      </header>

      {/* TABS */}
      <nav style={{ display: "flex", gap: "4px", background: "rgba(26, 11, 46, 0.8)", border: `1px solid ${FF.border0}`, borderRadius: "14px", padding: "4px", marginBottom: "26px", backdropFilter: "blur(12px)", flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} className="ff-btn" onClick={() => setTab(t.id)}
            style={{
              flex: "1", minWidth: "80px", padding: "9px 8px",
              borderRadius: "10px",
              fontSize: "12px", fontWeight: tab === t.id ? "600" : "400",
              color: tab === t.id ? FF.text : FF.textTer,
              background: tab === t.id ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.2))" : "transparent",
              boxShadow: tab === t.id ? `0 0 16px rgba(168,85,247,0.25)` : "none",
              border: tab === t.id ? `1px solid ${FF.border1}` : "1px solid transparent",
              fontFamily: "'Poppins', sans-serif",
            }}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main key={tab} className="fade-up">
        {tab === "tree" && <DecisionTree />}
        {tab === "use" && <UseCaseMatrix />}
        {tab === "avoid" && <AntiPatternGrid />}
        {tab === "arch" && <ArchView />}
        {tab === "ref" && <QuickRef />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DECISION TREE — MULTI-QUESTION BRANCHING
// ═══════════════════════════════════════════════════════════
function DecisionTree() {
  const [qHistory, setQHistory] = useState(["q1"]);
  const [answers, setAnswers] = useState([]);
  const [verdict, setVerdict] = useState(null);

  const currentQ = verdict ? null : qHistory[qHistory.length - 1];
  const branch = verdict ? BRANCHES.find(b => b.id === verdict) : null;
  const progress = verdict ? 1 : answers.length / 4;

  const handleAnswer = useCallback((answer) => {
    const q = TREE[currentQ];
    const next = answer === "yes" ? q.yes : q.no;
    const label = answer === "yes" ? q.yL : q.nL;
    setAnswers(prev => [...prev, { q: q.q, label, answer }]);
    if (next.startsWith("verdict_")) {
      setVerdict(next.replace("verdict_", ""));
    } else {
      setQHistory(prev => [...prev, next]);
    }
  }, [currentQ]);

  const stepBack = useCallback(() => {
    if (verdict) {
      setVerdict(null);
      setAnswers(prev => prev.slice(0, -1));
    } else if (qHistory.length > 1) {
      setQHistory(prev => prev.slice(0, -1));
      setAnswers(prev => prev.slice(0, -1));
    }
  }, [verdict, qHistory]);

  const reset = useCallback(() => {
    setQHistory(["q1"]);
    setAnswers([]);
    setVerdict(null);
  }, []);

  return (
    <div>
      {/* Root node */}
      <div className={answers.length === 0 && !verdict ? "pulse" : ""} style={{
        ...card,
        padding: "18px 22px",
        marginBottom: "16px",
        background: "rgba(37, 20, 67, 0.75)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%", background: FF.border0 }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: FF.gradient, transition: "width 0.4s ease", borderRadius: "1px" }} />
        </div>
        <div style={{ fontSize: "10px", color: FF.purple, fontFamily: "'JetBrains Mono', monospace", marginBottom: "5px", letterSpacing: "1.5px" }}>
          {verdict ? "VERDICT REACHED" : `START HERE · QUESTION ${answers.length + 1}`}
        </div>
        <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "3px" }}>
          What type of ERP request is this?
        </div>
        <div style={{ fontSize: "12px", color: FF.textSec }}>
          Answer each question to route to the correct execution primitive
        </div>
      </div>

      {/* Breadcrumb */}
      {answers.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          {answers.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              padding: "8px 14px", marginBottom: "4px",
              background: "rgba(26,11,46,0.45)",
              borderRadius: "10px", border: `1px solid ${FF.border0}`,
              opacity: 0.75,
            }}>
              <span style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", minWidth: "20px", marginTop: "2px" }}>{i + 1}.</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: FF.textTer, marginBottom: "2px" }}>{a.q}</div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: a.answer === "yes" ? FF.green : FF.cyan }}>
                  → {a.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active question */}
      {currentQ && (
        <div key={currentQ} className="fade-up" style={{
          ...card,
          padding: "24px",
          marginBottom: "14px",
          background: "rgba(37, 20, 67, 0.85)",
          border: `1px solid ${FF.border1}`,
          boxShadow: glow(FF.purple, 10),
        }}>
          <div style={{ fontSize: "10px", color: FF.purple, fontFamily: "'JetBrains Mono', monospace", marginBottom: "10px", letterSpacing: "1px" }}>
            QUESTION {answers.length + 1}
          </div>
          <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "10px", lineHeight: "1.5" }}>
            {TREE[currentQ].q}
          </div>
          <div style={{
            fontSize: "11px", color: FF.textTer,
            padding: "8px 12px", background: "rgba(255,255,255,0.03)",
            borderRadius: "8px", marginBottom: "20px",
            borderLeft: `2px solid ${FF.border1}`, lineHeight: "1.55", fontStyle: "italic",
          }}>
            {TREE[currentQ].hint}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { answer: "yes", label: TREE[currentQ].yL, icon: "✓", color: FF.green, bg: FF.greenBg, border: FF.greenBorder },
              { answer: "no", label: TREE[currentQ].nL, icon: "✗", color: FF.cyan, bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.3)" },
            ].map(opt => (
              <button key={opt.answer} className="ff-btn ff-lift" onClick={() => handleAnswer(opt.answer)}
                style={{
                  padding: "14px 16px",
                  background: opt.bg, border: `1px solid ${opt.border}`,
                  borderRadius: "12px", color: opt.color,
                  fontSize: "12px", fontWeight: "600", cursor: "pointer",
                  textAlign: "center", fontFamily: "'Poppins', sans-serif", lineHeight: "1.5",
                }}>
                <div style={{ fontSize: "18px", marginBottom: "5px" }}>{opt.icon}</div>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      {verdict && branch && (
        <div key={verdict} className="fade-up" style={{
          background: branch.bg, border: `1px solid ${branch.border}`,
          borderRadius: "16px", padding: "24px", marginBottom: "14px",
          boxShadow: glow(branch.color, 20), backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
            <div style={{ fontSize: "40px", lineHeight: 1 }}>{branch.emoji}</div>
            <div>
              <div style={{ fontSize: "10px", color: branch.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px", letterSpacing: "1px" }}>VERDICT</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: branch.color, textShadow: `0 0 24px ${branch.color}60`, lineHeight: 1 }}>
                {branch.verdict}
              </div>
              <div style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>{branch.verdictSub}</div>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: FF.textSec, lineHeight: "1.7", marginBottom: "18px", borderLeft: `2px solid ${branch.border}`, paddingLeft: "12px" }}>
            {branch.why}
          </p>
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>EXAMPLE QUERIES</div>
            {branch.examples.map((ex, i) => (
              <div key={i} style={{ fontSize: "12px", color: FF.textSec, padding: "7px 11px", background: "rgba(255,255,255,0.03)", borderRadius: "7px", marginBottom: "5px", borderLeft: `2px solid ${branch.color}50`, fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>
                "{ex}"
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>RECOMMENDED STACK</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {branch.stack.map((s, i) => (
                <span key={i} style={{ fontSize: "11px", padding: "4px 12px", background: `${branch.color}12`, border: `1px solid ${branch.color}30`, borderRadius: "20px", color: branch.color, fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      {(answers.length > 0 || verdict) && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="ff-btn" onClick={stepBack}
            style={{ background: "transparent", border: `1px solid ${FF.border0}`, borderRadius: "8px", padding: "8px 16px", color: FF.textTer, fontSize: "11px", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
            ← Back
          </button>
          <button className="ff-btn" onClick={reset}
            style={{ background: "transparent", border: `1px solid ${FF.border0}`, borderRadius: "8px", padding: "8px 16px", color: FF.textTer, fontSize: "11px", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
            ↩ Start over
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// USE CASE MATRIX — SEARCHABLE
// ═══════════════════════════════════════════════════════════
function UseCaseMatrix() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);

  const filtered = USE_CASES.filter(uc =>
    !search ||
    uc.title.toLowerCase().includes(search.toLowerCase()) ||
    uc.desc.toLowerCase().includes(search.toLowerCase()) ||
    uc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>When to use RAG in an ERP assistant</div>
        <div style={{ fontSize: "12px", color: FF.textSec, marginBottom: "14px" }}>5 high-value use cases — click a card to expand examples</div>
        <SearchInput value={search} onChange={v => { setSearch(v); setActive(null); }} placeholder="Search by topic, tag, or keyword..." />
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: FF.textTer, fontSize: "13px" }}>No results for "{search}"</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {filtered.map((uc, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="ff-card" onClick={() => setActive(isActive ? null : i)}
              style={{
                ...card,
                padding: "17px",
                background: isActive ? "rgba(52, 211, 153, 0.07)" : FF.glassCard,
                border: `1px solid ${isActive ? FF.greenBorder : FF.border0}`,
                boxShadow: isActive ? `0 0 24px rgba(52,211,153,0.18)` : "none",
                gridColumn: filtered.length === 1 ? "1 / -1" : "auto",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
                <span style={{ fontSize: "20px" }}>{uc.emoji}</span>
                <div style={{ fontSize: "13px", fontWeight: "600", color: isActive ? FF.green : FF.text, flex: 1 }}>{uc.title}</div>
                <span style={{ fontSize: "10px", padding: "2px 9px", background: FF.greenBg, color: FF.green, border: `1px solid ${FF.greenBorder}`, borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", flexShrink: 0 }}>RAG ✓</span>
              </div>
              <div style={{ fontSize: "12px", color: FF.textSec, lineHeight: "1.65" }}>{uc.desc}</div>
              {isActive && (
                <div className="fade-up" style={{ marginTop: "14px" }}>
                  <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>EXAMPLE QUERIES</div>
                  {uc.qs.map((q, qi) => (
                    <div key={qi} style={{ fontSize: "11px", color: FF.textSec, padding: "6px 10px", background: "rgba(52,211,153,0.04)", borderRadius: "6px", marginBottom: "5px", borderLeft: `2px solid ${FF.greenBorder}`, fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>"{q}"</div>
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

// ═══════════════════════════════════════════════════════════
// ANTI-PATTERN GRID — SEARCHABLE + WHY PANEL
// ═══════════════════════════════════════════════════════════
function AntiPatternGrid() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);

  const filtered = ANTI_PATTERNS.filter(ap =>
    !search ||
    ap.title.toLowerCase().includes(search.toLowerCase()) ||
    ap.desc.toLowerCase().includes(search.toLowerCase()) ||
    ap.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>When NOT to use RAG in an ERP assistant</div>
        <div style={{ fontSize: "12px", color: FF.textSec, marginBottom: "14px" }}>5 anti-patterns that break in production — and what to use instead</div>
        <SearchInput value={search} onChange={v => { setSearch(v); setActive(null); }} placeholder="Search by topic, tag, or keyword..." />
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: FF.textTer, fontSize: "13px" }}>No results for "{search}"</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {filtered.map((ap, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="ff-card" onClick={() => setActive(isActive ? null : i)}
              style={{
                ...card,
                padding: "17px",
                background: isActive ? FF.redBg : FF.glassCard,
                border: `1px solid ${isActive ? FF.redBorder : FF.border0}`,
                boxShadow: isActive ? `0 0 24px rgba(248,113,113,0.15)` : "none",
                gridColumn: filtered.length === 1 ? "1 / -1" : "auto",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
                <span style={{ fontSize: "20px" }}>{ap.emoji}</span>
                <div style={{ fontSize: "13px", fontWeight: "600", color: isActive ? FF.red : FF.text, flex: 1 }}>{ap.title}</div>
                <span style={{ fontSize: "10px", padding: "2px 9px", background: FF.redBg, color: FF.red, border: `1px solid ${FF.redBorder}`, borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", flexShrink: 0 }}>RAG ✗</span>
              </div>
              <div style={{ fontSize: "12px", color: FF.textSec, lineHeight: "1.65", marginBottom: "10px" }}>{ap.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace" }}>Use instead:</span>
                <span style={{ fontSize: "10px", padding: "2px 9px", background: `${ap.altColor}12`, color: ap.altColor, border: `1px solid ${ap.altColor}35`, borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace" }}>{ap.alt}</span>
              </div>
              {isActive && (
                <div className="fade-up" style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "12px", color: FF.textSec, lineHeight: "1.65", padding: "10px 12px", background: "rgba(248,113,113,0.06)", borderRadius: "8px", borderLeft: `2px solid ${FF.redBorder}`, marginBottom: "12px" }}>
                    <span style={{ color: FF.red, fontWeight: "600" }}>Why this fails: </span>{ap.why}
                  </div>
                  <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>WRONG PATTERN — DON'T DO THIS</div>
                  {ap.wrong.map((q, qi) => (
                    <div key={qi} style={{ fontSize: "11px", color: `${FF.red}aa`, padding: "6px 10px", background: "rgba(248,113,113,0.05)", borderRadius: "6px", marginBottom: "5px", borderLeft: `2px solid ${FF.redBorder}`, fontStyle: "italic", textDecoration: "line-through", textDecorationColor: `${FF.red}60`, fontFamily: "'Inter', sans-serif" }}>"{q}"</div>
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

// ═══════════════════════════════════════════════════════════
// ARCHITECTURE VIEW
// ═══════════════════════════════════════════════════════════
function ArchView() {
  const [activeView, setActiveView] = useState("diagram");
  const [diagramNode, setDiagramNode] = useState(null);
  const [activeLane, setActiveLane] = useState(null);

  const SUB_TABS = [
    { id: "diagram", label: "📊 Flow Diagram" },
    { id: "builder", label: "⚙️ System Builder" },
    { id: "lanes", label: "🔀 Lane Details" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Hybrid ERP Assistant Architecture</div>
        <div style={{ fontSize: "12px", color: FF.textSec }}>Intent router → 5 execution lanes — permission-scoped by tenant, role, module, and record type</div>
      </div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "18px" }}>
        {SUB_TABS.map(v => (
          <button key={v.id} className="ff-btn" onClick={() => setActiveView(v.id)}
            style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: activeView === v.id ? "600" : "400", color: activeView === v.id ? FF.text : FF.textTer, background: activeView === v.id ? "rgba(168,85,247,0.2)" : "transparent", border: `1px solid ${activeView === v.id ? FF.border1 : FF.border0}`, fontFamily: "'Poppins', sans-serif", cursor: "pointer" }}>
            {v.label}
          </button>
        ))}
      </div>

      {activeView === "diagram" && (
        <div className="fade-up">
          <ArchDiagram selected={diagramNode} onSelect={setDiagramNode} />
          {diagramNode && ARCH_DETAILS[diagramNode] ? (
            <NodeDetail key={diagramNode} detail={ARCH_DETAILS[diagramNode]} note="Click another node to switch · Click same node to close" />
          ) : (
            <div style={{ textAlign: "center", padding: "14px", fontSize: "11px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace" }}>
              click any node to inspect configuration
            </div>
          )}
        </div>
      )}

      {activeView === "builder" && (
        <div className="fade-up">
          <SystemBuilder />
        </div>
      )}

      {activeView === "lanes" && (
        <div className="fade-up">
          <LaneDetails activeLane={activeLane} setActiveLane={setActiveLane} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ARCH DIAGRAM — SVG FLOW
// ═══════════════════════════════════════════════════════════
function ArchDiagram({ selected, onSelect }) {
  // Node centers at viewBox 700 x 390
  // Execution nodes: 5 × 110px + 4 × 12px gap = 598px, margin = 51px
  // Centers: 51+55=106, 106+122=228, 228+122=350, 350+122=472, 472+122=594
  const execCenters = [106, 228, 350, 472, 594];
  const execColors = [FF.green, FF.cyan, FF.amber, FF.pink, FF.purple];
  const execBorders = [FF.greenBorder, "rgba(34,211,238,0.4)", FF.amberBorder, "rgba(244,114,182,0.4)", FF.border1];
  const execIds = ["rag", "api", "tool", "hybrid", "compliance"];
  const execLabels = ["RAG Pipeline", "ERP API/SQL", "Tool Call", "Hybrid", "Audit+Cite"];
  const arrowIds = ["arrow-green", "arrow-cyan", "arrow-amber", "arrow-pink", "arrow-purple"];

  return (
    <div style={{ ...card, padding: "16px 12px 10px", overflow: "hidden" }}>
      <svg viewBox="0 0 700 390" style={{ width: "100%", display: "block" }}>
        <defs>
          {[
            { id: "arrow-purple", col: "rgba(168,85,247,0.8)" },
            { id: "arrow-green", col: "rgba(52,211,153,0.8)" },
            { id: "arrow-cyan", col: "rgba(34,211,238,0.8)" },
            { id: "arrow-amber", col: "rgba(252,211,77,0.8)" },
            { id: "arrow-pink", col: "rgba(244,114,182,0.8)" },
          ].map(({ id, col }) => (
            <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill={col} />
            </marker>
          ))}
          <filter id="glow-sel" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* User → Router */}
        <line x1="350" y1="50" x2="350" y2="100" stroke="rgba(168,85,247,0.55)" strokeWidth="1.5" markerEnd="url(#arrow-purple)" />

        {/* Router → exec nodes */}
        {execCenters.map((cx, i) => (
          <path key={cx}
            d={cx === 350
              ? `M 350 140 L 350 210`
              : `M 350 140 C 350 178 ${cx} 178 ${cx} 210`}
            stroke={`${execColors[i]}80`} strokeWidth="1.5" fill="none"
            markerEnd={`url(#${arrowIds[i]})`}
          />
        ))}

        {/* Exec → Audit (dashed) */}
        {execCenters.map((cx) => (
          <line key={`a-${cx}`}
            x1={cx} y1="256"
            x2={cx < 350 ? 205 : cx > 350 ? 495 : 350} y2="318"
            stroke="rgba(252,211,77,0.18)" strokeWidth="1" strokeDasharray="4,4"
          />
        ))}
        <line x1="205" y1="318" x2="350" y2="318" stroke="rgba(252,211,77,0.18)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="495" y1="318" x2="350" y2="318" stroke="rgba(252,211,77,0.18)" strokeWidth="1" strokeDasharray="4,4" />

        {/* USER NODE */}
        <g onClick={() => onSelect(selected === "user" ? null : "user")} style={{ cursor: "pointer" }}>
          {selected === "user" && <rect x="256" y="14" width="188" height="36" rx="12" fill="transparent" stroke={FF.textSec} strokeWidth="1.5" opacity="0.5" filter="url(#glow-sel)" />}
          <rect x="260" y="18" width="180" height="32" rx="10" fill={selected === "user" ? "rgba(203,213,225,0.12)" : "rgba(26,11,46,0.9)"} stroke={selected === "user" ? "rgba(203,213,225,0.7)" : "rgba(203,213,225,0.25)"} strokeWidth="1" />
          <text x="350" y="38" textAnchor="middle" dominantBaseline="middle" fill={selected === "user" ? "#F8FAFC" : "#CBD5E1"} fontSize="12" fontFamily="system-ui,sans-serif" fontWeight={selected === "user" ? "600" : "400"}>
            User Question
          </text>
        </g>

        {/* ROUTER NODE */}
        <g onClick={() => onSelect(selected === "router" ? null : "router")} style={{ cursor: "pointer" }}>
          {selected === "router" && <rect x="236" y="102" width="228" height="36" rx="12" fill="transparent" stroke={FF.purple} strokeWidth="1.5" opacity="0.6" filter="url(#glow-sel)" />}
          <rect x="240" y="106" width="220" height="32" rx="10"
            fill={selected === "router" ? "rgba(168,85,247,0.22)" : "rgba(26,11,46,0.9)"}
            stroke={selected === "router" ? FF.purple : FF.border1} strokeWidth={selected === "router" ? "1.5" : "1"}
          />
          <text x="350" y="126" textAnchor="middle" dominantBaseline="middle" fill={selected === "router" ? FF.purple : "#CBD5E1"} fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">
            ⚡ Intent Router
          </text>
        </g>

        {/* EXECUTION NODES */}
        {execCenters.map((cx, i) => {
          const id = execIds[i];
          const isSel = selected === id;
          return (
            <g key={id} onClick={() => onSelect(isSel ? null : id)} style={{ cursor: "pointer" }}>
              {isSel && <rect x={cx - 59} y="208" width="118" height="46" rx="12" fill="transparent" stroke={execColors[i]} strokeWidth="1.5" opacity="0.5" filter="url(#glow-sel)" />}
              <rect x={cx - 55} y="212" width="110" height="38" rx="9"
                fill={isSel ? `${execColors[i]}18` : "rgba(26,11,46,0.9)"}
                stroke={isSel ? execColors[i] : execBorders[i]} strokeWidth={isSel ? "1.5" : "1"}
              />
              <text x={cx} y="232" textAnchor="middle" dominantBaseline="middle" fill={isSel ? execColors[i] : "#94A3B8"} fontSize="10.5" fontFamily="system-ui,sans-serif" fontWeight={isSel ? "600" : "400"}>
                {execLabels[i]}
              </text>
            </g>
          );
        })}

        {/* AUDIT NODE */}
        <g onClick={() => onSelect(selected === "audit" ? null : "audit")} style={{ cursor: "pointer" }}>
          {selected === "audit" && <rect x="198" y="320" width="304" height="36" rx="12" fill="transparent" stroke={FF.amber} strokeWidth="1.5" opacity="0.5" filter="url(#glow-sel)" />}
          <rect x="202" y="324" width="296" height="32" rx="10"
            fill={selected === "audit" ? FF.amberBg : "rgba(26,11,46,0.9)"}
            stroke={selected === "audit" ? FF.amber : FF.amberBorder} strokeWidth={selected === "audit" ? "1.5" : "1"}
          />
          <text x="350" y="344" textAnchor="middle" dominantBaseline="middle" fill={selected === "audit" ? FF.amber : "#94A3B8"} fontSize="11" fontFamily="system-ui,sans-serif" fontWeight={selected === "audit" ? "600" : "400"}>
            Audit Logger · All Lanes
          </text>
        </g>
      </svg>
      <div style={{ textAlign: "center", fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
        click any node to inspect · dashed lines = audit coverage on all lanes
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NODE DETAIL PANEL
// ═══════════════════════════════════════════════════════════
function NodeDetail({ detail, note }) {
  return (
    <div className="fade-up" style={{ ...card, padding: "20px", marginTop: "14px", border: `1px solid ${detail.color}35`, boxShadow: `0 0 20px ${detail.color}15` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: detail.color }}>{detail.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {note && <span style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace" }}>{note}</span>}
        </div>
      </div>
      <p style={{ fontSize: "12px", color: FF.textSec, lineHeight: "1.7", marginBottom: "14px" }}>{detail.desc}</p>
      <ConfigBlock text={detail.config} color={detail.color} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
        {detail.stack.map((s, i) => (
          <span key={i} style={{ fontSize: "10px", padding: "3px 10px", background: `${detail.color}12`, border: `1px solid ${detail.color}30`, borderRadius: "20px", color: detail.color, fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SYSTEM BUILDER
// ═══════════════════════════════════════════════════════════
function SystemBuilder() {
  const [selected, setSelected] = useState("router");

  const COMPONENTS = [
    { id: "user", label: "Input Layer", emoji: "👤", color: FF.textSec },
    { id: "router", label: "Intent Router", emoji: "⚡", color: FF.purple },
    { id: "rag", label: "RAG Pipeline", emoji: "📋", color: FF.green },
    { id: "api", label: "ERP API/SQL", emoji: "🗄️", color: FF.cyan },
    { id: "tool", label: "Tool Call", emoji: "🔧", color: FF.amber },
    { id: "hybrid", label: "Hybrid", emoji: "🔀", color: FF.pink },
    { id: "compliance", label: "Audit+Cite", emoji: "🛡️", color: FF.purple },
    { id: "audit", label: "Audit Logger", emoji: "📋", color: FF.amber },
  ];

  const detail = selected ? ARCH_DETAILS[selected] : null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "18px" }}>
        {COMPONENTS.map(c => (
          <button key={c.id} className="ff-btn ff-lift" onClick={() => setSelected(c.id)}
            style={{
              padding: "12px 6px", borderRadius: "10px",
              background: selected === c.id ? `${c.color}15` : "rgba(26,11,46,0.6)",
              border: `1px solid ${selected === c.id ? c.color + "55" : FF.border0}`,
              color: selected === c.id ? c.color : FF.textSec,
              fontSize: "10px", textAlign: "center", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", fontWeight: selected === c.id ? "600" : "400",
              boxShadow: selected === c.id ? `0 0 12px ${c.color}20` : "none",
            }}>
            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{c.emoji}</div>
            <div style={{ lineHeight: "1.3" }}>{c.label}</div>
          </button>
        ))}
      </div>
      {detail && <NodeDetail key={selected} detail={detail} note={null} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LANE DETAILS — EXPANDABLE
// ═══════════════════════════════════════════════════════════
function LaneDetails({ activeLane, setActiveLane }) {
  const LANES = [
    { id: "knowledge", emoji: "📋", label: "Knowledge Question", dest: "RAG Pipeline", destColor: FF.green, detailKey: "rag" },
    { id: "livedata", emoji: "⚡", label: "Live Data Question", dest: "ERP API / SQL", destColor: FF.cyan, detailKey: "api" },
    { id: "action", emoji: "🔧", label: "Action Request", dest: "Tool Call + Validation", destColor: FF.amber, detailKey: "tool" },
    { id: "mixed", emoji: "🔀", label: "Mixed Request", dest: "API/SQL → RAG explain", destColor: FF.pink, detailKey: "hybrid" },
    { id: "compliance", emoji: "🛡️", label: "Compliance / Audit", dest: "RAG + Evidence + Citations", destColor: FF.purple, detailKey: "compliance" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {LANES.map((lane, idx) => {
        const isActive = activeLane === lane.id;
        const detail = ARCH_DETAILS[lane.detailKey];
        const branch = BRANCHES.find(b => b.id === lane.id);
        return (
          <div key={lane.id}>
            <div className="ff-card" onClick={() => setActiveLane(isActive ? null : lane.id)}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 16px", background: isActive ? `${lane.destColor}0e` : "rgba(26,11,46,0.5)", border: `1px solid ${isActive ? lane.destColor + "40" : FF.border0}`, borderRadius: "12px", cursor: "pointer" }}>
              <span style={{ fontSize: "10px", color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", minWidth: "16px" }}>{idx + 1}.</span>
              <span style={{ fontSize: "18px" }}>{lane.emoji}</span>
              <span style={{ fontSize: "12px", color: FF.textSec, flex: 1 }}>{lane.label}</span>
              <span style={{ fontSize: "12px", color: FF.textTer }}>→</span>
              <span style={{ fontSize: "10px", padding: "3px 10px", background: `${lane.destColor}12`, color: lane.destColor, border: `1px solid ${lane.destColor}30`, borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{lane.dest}</span>
              <span style={{ fontSize: "10px", color: FF.textTer }}>{isActive ? "▲" : "▼"}</span>
            </div>
            {isActive && detail && (
              <div key={lane.id + "-exp"} className="fade-up" style={{ ...card, padding: "18px", marginTop: "6px", border: `1px solid ${lane.destColor}30`, borderRadius: "12px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: lane.destColor, marginBottom: "8px" }}>{detail.title}</div>
                <p style={{ fontSize: "12px", color: FF.textSec, lineHeight: "1.7", marginBottom: "14px" }}>{detail.desc}</p>
                <ConfigBlock text={detail.config} color={lane.destColor} />
                {branch && (
                  <div style={{ marginTop: "14px" }}>
                    <div style={{ fontSize: "10px", color: FF.textTer, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontFamily: "'JetBrains Mono', monospace" }}>EXAMPLE QUERIES</div>
                    {branch.examples.map((ex, i) => (
                      <div key={i} style={{ fontSize: "11px", color: FF.textSec, padding: "6px 10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", marginBottom: "5px", borderLeft: `2px solid ${lane.destColor}50`, fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>"{ex}"</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ background: FF.amberBg, border: `1px solid ${FF.amberBorder}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
        <span style={{ fontSize: "18px" }}>📋</span>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: FF.amber }}>Audit Logger — All Lanes</div>
          <div style={{ fontSize: "11px", color: FF.textSec, marginTop: "2px" }}>Every answer and action logged with source, user, timestamp, accessed records, and tool call trace</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// QUICK REF — SCANNABLE CHEAT SHEET
// ═══════════════════════════════════════════════════════════
function QuickRef() {
  const DECISION_ROWS = [
    { q: "Could it change today?", yes: "ERP API / SQL", no: "→ Q2" },
    { q: "Is it a write/approve operation?", yes: "Tool Call", no: "ERP API / SQL" },
    { q: "Does it live in a doc/SOP?", yes: "→ Q4", no: "ERP API / SQL" },
    { q: "Also needs live ERP data?", yes: "Hybrid (API → RAG)", no: "→ Q5" },
    { q: "Needs a citation trail?", yes: "RAG + Citations", no: "RAG Pipeline" },
  ];

  const PRINCIPLES = [
    { icon: "✅", label: "RAG for knowledge", desc: "Policy docs, SOPs, training material, field definitions, process guides" },
    { icon: "⚡", label: "API/SQL for live data", desc: "Inventory, invoice status, credit limits — anything that changes intraday" },
    { icon: "🔧", label: "Tool Call for actions", desc: "All write operations: create, approve, move, close — never via RAG" },
    { icon: "🔀", label: "Hybrid: API first, RAG second", desc: "Pull live truth first, explain with policy context second. Never reverse." },
    { icon: "🛡️", label: "Citations for compliance", desc: "Audit queries need traceable source stamps. RAG in citation mode is built for this." },
    { icon: "🔒", label: "Scope all retrieval", desc: "tenant_id + role required on every vector search. No shared unscoped indices." },
    { icon: "🧮", label: "Never RAG for math", desc: "Calculations, reconciliation, tax, margin → rules engine or SQL" },
    { icon: "🗃️", label: "Entities ≠ documents", desc: "Customers, vendors, items → query the source of record, not a vector index" },
  ];

  return (
    <div>
      {/* 5-question routing tree */}
      <div style={{ ...card, padding: "18px 20px", marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: FF.purple, marginBottom: "14px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.8px" }}>
          THE 5-QUESTION ROUTING TREE
        </div>
        {DECISION_ROWS.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "8px", alignItems: "center", padding: "9px 0", borderBottom: i < DECISION_ROWS.length - 1 ? `1px solid ${FF.border0}` : "none" }}>
            <div style={{ fontSize: "12px", color: FF.textSec }}>
              <span style={{ color: FF.textTer, fontFamily: "'JetBrains Mono', monospace", marginRight: "8px", fontSize: "10px" }}>Q{i + 1}.</span>
              {row.q}
            </div>
            <span style={{ fontSize: "10px", padding: "3px 9px", background: FF.greenBg, color: FF.green, border: `1px solid ${FF.greenBorder}`, borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
              YES → {row.yes}
            </span>
            <span style={{ fontSize: "10px", padding: "3px 9px", background: "rgba(34,211,238,0.08)", color: FF.cyan, border: "1px solid rgba(34,211,238,0.3)", borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
              NO → {row.no}
            </span>
          </div>
        ))}
      </div>

      {/* Core principles */}
      <div style={{ ...card, padding: "18px 20px", marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: FF.purple, marginBottom: "14px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.8px" }}>
          CORE PRINCIPLES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {PRINCIPLES.map((p, i) => (
            <div key={i} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: `1px solid ${FF.border0}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
                <span style={{ fontSize: "14px" }}>{p.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: FF.text }}>{p.label}</span>
              </div>
              <div style={{ fontSize: "10.5px", color: FF.textTer, lineHeight: "1.5" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict summary */}
      <div style={{ ...card, padding: "18px 20px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: FF.purple, marginBottom: "14px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.8px" }}>
          VERDICT SUMMARY
        </div>
        {BRANCHES.map((b, i) => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 0", borderBottom: i < BRANCHES.length - 1 ? `1px solid ${FF.border0}` : "none" }}>
            <span style={{ fontSize: "18px", width: "24px", textAlign: "center", flexShrink: 0 }}>{b.emoji}</span>
            <span style={{ fontSize: "11px", color: FF.textSec, flex: 1 }}>{b.label}</span>
            <span style={{ fontSize: "10px", padding: "2px 10px", background: `${b.color}12`, color: b.color, border: `1px solid ${b.color}35`, borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
              {b.verdict}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
