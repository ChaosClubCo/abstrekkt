
import { useState } from "react";

const TABS = [
  { id: "basics", label: "NetSuite Basics" },
  { id: "claude", label: "Claude + NetSuite" },
  { id: "mcp", label: "MCP Ecosystem" },
  { id: "safety", label: "Safety & Governance" },
];

const MCP_LIST = [
  {
    id: "ns-native",
    name: "NetSuite AI Connector",
    vendor: "Oracle (Official)",
    category: "ERP Native",
    categoryColor: "#0EA5E9",
    complexity: "Medium",
    access: "Read + Write",
    badge: "Foundation",
    description: "Oracle's official MCP SuiteApp. Connects Claude directly to NetSuite via OAuth 2.0. The right starting point.",
    useCase: "Ask Claude: 'Which customers have DSO over 60 days?' without ever writing SuiteQL. Or: 'Summarize open POs for vendor Acme Corp.'",
    workflow: "Claude → NetSuite AI Connector SuiteApp → Role-scoped OAuth → NetSuite Records",
    safetyNote: "Administrator role is blocked by design. Set up a dedicated MCP role with minimum necessary permissions.",
    requires: "Claude Pro/Max/Team + NetSuite SuiteApp Marketplace install",
    connections: ["CData Connect AI", "Composio"],
  },
  {
    id: "cdata",
    name: "CData Connect AI",
    vendor: "CData",
    category: "Managed Bridge",
    categoryColor: "#8B5CF6",
    complexity: "Low",
    access: "Read",
    badge: "Enterprise",
    description: "Managed cloud MCP bridge. No SuiteApp install. Full audit logging. Best for orgs that want zero NetSuite config changes.",
    useCase: "Finance team queries Claude about NetSuite data without IT touching NetSuite config. Claude answers questions across finance, ops, and sales simultaneously.",
    workflow: "Claude → CData MCP Server → NetSuite REST/SOAP APIs → Structured data → Claude reasoning",
    safetyNote: "Encryption in transit. Audit logs native. CData and Anthropic both commit to no training data use.",
    requires: "CData Connect AI subscription (already in your MCP list)",
    connections: ["NetSuite AI Connector", "Supabase"],
  },
  {
    id: "composio",
    name: "Composio",
    vendor: "Composio",
    category: "Full CRUD",
    categoryColor: "#F59E0B",
    complexity: "Low",
    access: "Read + Write + Delete",
    badge: "Power User",
    description: "The missing piece: full Create/Read/Update/Delete on NetSuite records via MCP. Create invoices, update customers, delete draft POs — all from Claude.",
    useCase: "Paste a vendor bill email into Claude → Composio creates a Bill record in NetSuite with correct line items → Claude confirms internal ID.",
    workflow: "Claude instruction → Composio MCP auth → NetSuite record mutation → Audit confirmation returned",
    safetyNote: "⚠ Write access. Always test in Sandbox first. Never assign Admin role. Require human-in-loop for financial records.",
    requires: "Composio (already in your list) + OAuth connection to NetSuite",
    connections: ["n8n", "Zapier"],
  },
  {
    id: "zapier",
    name: "Zapier",
    vendor: "Zapier",
    category: "Automation",
    categoryColor: "#F97316",
    complexity: "Low",
    access: "Action-scoped",
    badge: "Broad Reach",
    description: "8,000+ app bridge. MCP server at mcp.zapier.com. Claude usage on Zapier grew 10x YoY. Pre-built NetSuite triggers and actions. Best for connecting long-tail SaaS apps to NetSuite.",
    useCase: "HubSpot deal closes → Claude (via Zapier MCP) creates Invoice in NetSuite → Posts confirmation to Slack → Updates HubSpot with NetSuite internal ID.",
    workflow: "Claude → Zapier MCP toolbox (mcp.zapier.com) → Zapier Action → NetSuite / HubSpot / Slack",
    safetyNote: "Each tool explicitly added to toolbox. No surprise permissions. Review active Zap list quarterly.",
    requires: "Zapier account (already in your MCP list)",
    connections: ["HubSpot", "Slack", "Gmail"],
  },
  {
    id: "n8n",
    name: "n8n",
    vendor: "n8n",
    category: "Automation",
    categoryColor: "#EF4444",
    complexity: "High",
    access: "Full",
    badge: "Data Residency",
    description: "Self-hosted automation. Your data never leaves your infrastructure. Built-in Anthropic AI Agent node + NetSuite node. Best for compliance-sensitive orgs.",
    useCase: "NetSuite inventory dips below reorder point → n8n Claude agent analyzes historical velocity → Drafts PO → Routes for human approval → Creates approved PO in NetSuite.",
    workflow: "NetSuite Node (trigger) → Claude AI Agent Node → Conditional branches → Human approval webhook → NetSuite write-back",
    safetyNote: "Best choice for orgs with data residency requirements. All processing stays in your environment.",
    requires: "n8n cloud or self-hosted + Anthropic API key (already in your MCP list)",
    connections: ["Supabase", "Slack", "Composio"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    vendor: "HubSpot",
    category: "CRM Bridge",
    categoryColor: "#FF7A59",
    complexity: "Low",
    access: "Bi-directional",
    badge: "Most Common",
    description: "The most common mid-market pairing with NetSuite. Native connector. Bi-directional CRM ↔ ERP sync. Close-won deals auto-flow into NetSuite.",
    useCase: "Deal closes in HubSpot → Claude creates Customer + Sales Order in NetSuite → Updates HubSpot record with NetSuite internal ID → Finance is notified without a single manual handoff.",
    workflow: "HubSpot closed-won trigger → Claude (both MCPs active) → NetSuite Customer + SO created → HubSpot record updated",
    safetyNote: "De-dupe logic is critical. Always match on email or company name to avoid duplicate customers in NetSuite.",
    requires: "HubSpot MCP (already in your list) + NetSuite MCP active",
    connections: ["Zapier", "Slack"],
  },
  {
    id: "slack",
    name: "Slack",
    vendor: "Salesforce",
    category: "Notifications",
    categoryColor: "#4F46E5",
    complexity: "Low",
    access: "Send + Read",
    badge: "Alert Surface",
    description: "Surface NetSuite intelligence where your team works. Approval requests, AR exception flags, period-close reminders, anomaly alerts — all delivered by Claude in Slack.",
    useCase: "Claude runs weekly AR aging query → Surfaces overdue accounts over $5K in #finance-alerts channel → Tags account owner → Suggests follow-up message draft.",
    workflow: "NetSuite data query (scheduled) → Claude formats and prioritizes → Slack MCP → Channel or DM delivery",
    safetyNote: "Read + send only in Slack. No Slack → NetSuite write path by default. Don't send full financial records to Slack channels.",
    requires: "Slack MCP (already in your list)",
    connections: ["n8n", "Zapier", "Gmail"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    vendor: "Google",
    category: "Document Layer",
    categoryColor: "#10B981",
    complexity: "Low",
    access: "Read + Write",
    badge: "Export Bridge",
    description: "The export/import bridge for NetSuite's CSV workflows. Store aging reports, audit archives, training docs. Share NetSuite insights with stakeholders who don't have licenses.",
    useCase: "Claude exports NetSuite aging report → Saves to restricted Drive folder → Generates plain-English summary → Shares link in Slack to finance team.",
    workflow: "NetSuite Export (via MCP) → Google Drive (via MCP) → Claude reads and summarizes → Delivery to non-licensed stakeholders",
    safetyNote: "Never set financial exports to 'anyone with link.' Use restricted Drive folders with explicit access lists.",
    requires: "Google Drive MCP (already in your list)",
    connections: ["Slack", "Gmail", "Notion"],
  },
  {
    id: "notion",
    name: "Notion",
    vendor: "Notion",
    category: "Knowledge Base",
    categoryColor: "#9CA3AF",
    complexity: "Low",
    access: "Read + Write",
    badge: "Living Docs",
    description: "The SOP and training doc layer alongside NetSuite. Claude keeps docs current as NetSuite processes change. New hire training without manual doc updates.",
    useCase: "NetSuite workflow changes after an update → Claude detects change → Rewrites affected SOP in Notion → Notifies team lead → All without a manual documentation sprint.",
    workflow: "Process change detected → Claude drafts updated SOP → Notion MCP writes to page → Version history preserved → Team notified",
    safetyNote: "Content only. No Notion → NetSuite write path. Review Claude-generated SOPs before publishing.",
    requires: "Notion MCP (already in your list)",
    connections: ["Google Drive", "Slack"],
  },
  {
    id: "make",
    name: "Make (Integromat)",
    vendor: "Make",
    category: "Automation",
    categoryColor: "#A855F7",
    complexity: "Medium",
    access: "Full",
    badge: "Complex Flows",
    description: "Visual automation with Claude AI module. Better than Zapier for multi-conditional branching and data transformation. Native NetSuite node.",
    useCase: "NetSuite Sales Order created → Make routes by product category (chairs vs accessories vs parts) → Different fulfillment workflows per branch → Claude generates pick ticket summaries per warehouse.",
    workflow: "NetSuite SO trigger → Make scenario (multi-branch) → Claude AI module per branch → Downstream warehouse + inventory actions",
    safetyNote: "Test scenarios in Draft mode before activation. Document each active scenario with owner name and creation date.",
    requires: "Make MCP (already in your list)",
    connections: ["n8n", "Zapier"],
  },
  {
    id: "supabase",
    name: "Supabase",
    vendor: "Supabase",
    category: "Analytics Layer",
    categoryColor: "#3ECF8E",
    complexity: "High",
    access: "Read + Write",
    badge: "Custom Analytics",
    description: "Mirror NetSuite data for custom dashboards and cross-entity analytics beyond what native NetSuite reporting can do. Claude queries the mirror, not production.",
    useCase: "Nightly export of NetSuite financials into Supabase → Claude runs complex multi-entity analytics queries → Custom P&L view that combines manufacturing costs + sales margin that NetSuite reports can't produce natively.",
    workflow: "NetSuite scheduled export → Supabase (via n8n) → Supabase MCP → Claude queries → Dashboard or report delivery",
    safetyNote: "Apply RLS policies. Encrypt PII columns. Don't expose raw NetSuite financials without access control. Separate tables by data sensitivity.",
    requires: "Supabase MCP (already in your list) + export pipeline",
    connections: ["n8n", "CData Connect AI"],
  },
  {
    id: "sentry",
    name: "Sentry",
    vendor: "Sentry",
    category: "Error Monitoring",
    categoryColor: "#FB7185",
    complexity: "Medium",
    access: "Read + Create",
    badge: "Silent Failure Catcher",
    description: "The most underused layer. NetSuite integrations fail silently all the time. Sentry catches them. Claude diagnoses them. The 2am sync failure you find out about at 9am goes away.",
    useCase: "n8n → NetSuite sync fails at 2am → Sentry captures error with context → Claude reads error + payload → Generates triage summary with likely cause → Slack alert with resolution suggestion before business hours.",
    workflow: "Integration error → Sentry event (via MCP) → Claude reads error context → Triage summary generated → Slack alert with fix suggestion",
    safetyNote: "Never log full API payloads in Sentry events. Sanitize financial record data. Log event type, error code, and user role only.",
    requires: "Sentry MCP (already in your list) + instrumented integration endpoints",
    connections: ["n8n", "Slack"],
  },
  {
    id: "gmail",
    name: "Gmail",
    vendor: "Google",
    category: "Email Bridge",
    categoryColor: "#EA4335",
    complexity: "Low",
    access: "Read + Send",
    badge: "AP Entry Point",
    description: "The highest-frequency entry point for AP data. Vendor invoices arrive via email — Claude extracts line items and creates Bill records in NetSuite without manual data entry. Also handles AR follow-ups and deal confirmations.",
    useCase: "Vendor sends PDF invoice via email → Claude extracts vendor name, invoice number, line items, amounts, due date → Composio creates Bill in NetSuite with correct GL coding → Gmail sends vendor acknowledgment automatically.",
    workflow: "Gmail MCP (read) → Claude extracts invoice data → Composio MCP → NetSuite Bill created → Gmail MCP (send) → vendor acknowledgment",
    safetyNote: "Read + send only from Claude. Pair with Composio for the NetSuite write path. Sanitize vendor PII before logging. Never forward full invoice content to Slack channels.",
    requires: "Gmail MCP (already in your list) + Composio for NetSuite write-back",
    connections: ["Composio", "Slack", "Google Drive"],
  },
  {
    id: "docusign",
    name: "DocuSign",
    vendor: "DocuSign",
    category: "CRM Bridge",
    categoryColor: "#FFCC00",
    complexity: "Low",
    access: "Read + Trigger",
    badge: "Deal-to-Cash",
    description: "Closes the contract-to-customer gap. Signed contract in DocuSign → Claude extracts customer details, contract value, and payment terms → NetSuite Customer record + Sales Order created automatically. Zero manual handoff between legal and finance.",
    useCase: "MSA signed in DocuSign → Claude extracts: legal entity name, billing address, contract value, payment terms, start date → Composio creates NetSuite Customer + SO → HubSpot updated with NetSuite internal ID.",
    workflow: "DocuSign signed event (via MCP) → Claude extracts contract fields → Composio → NetSuite Customer + SO creation → HubSpot CRM updated with NS internal ID",
    safetyNote: "Create NetSuite customer in Prospect status first — require human review before activating. Contract data is regulated. Never log contract values or terms to Slack channels.",
    requires: "Docusign MCP (already in your list) + Composio for NetSuite write",
    connections: ["Composio", "HubSpot", "Slack"],
  },
  {
    id: "shopify",
    name: "Shopify",
    vendor: "Shopify",
    category: "D2C Bridge",
    categoryColor: "#96BF48",
    complexity: "Medium",
    access: "Read + Write",
    badge: "D2C Revenue",
    description: "Closes the D2C order gap. NetSuite's native connector has no cross-system awareness — it can't reconcile Shopify orders without additional integration. This MCP fills that gap: D2C orders become NetSuite Sales Orders with inventory deduction and revenue recognition.",
    useCase: "Shopify order placed → Claude maps product SKUs to NetSuite item IDs → Composio creates SO + fulfillment record → inventory decremented → revenue recognized in correct GL period.",
    workflow: "Shopify order event (via MCP) → Claude maps SKU → NetSuite item ID → Composio creates SO + fulfillment → Inventory updated → GL revenue posting",
    safetyNote: "⚠ SKU mapping is the critical failure point. Maintain a SKU→NetSuite item ID map in Supabase. Test in Sandbox with test orders before enabling Production. Mismatch = phantom inventory.",
    requires: "Shopify MCP (already in your list) + Composio + SKU mapping table",
    connections: ["Composio", "n8n", "Supabase"],
  },
  {
    id: "stripe",
    name: "Stripe",
    vendor: "Stripe",
    category: "Payments Bridge",
    categoryColor: "#6772E5",
    complexity: "Medium",
    access: "Read",
    badge: "AR Closure",
    description: "Closes the AR loop automatically. Payment received in Stripe → Claude matches to open NetSuite invoice → marks paid → posts to GL. Eliminates daily manual payment application for finance teams who currently do this by hand.",
    useCase: "Stripe payment webhook → Claude matches payment to open NetSuite invoice by amount + customer name + date window → Composio marks invoice Paid → AR aging updates → Slack alert to AR team.",
    workflow: "Stripe payment event (via MCP) → Claude fuzzy-matches to open NS invoice → Composio marks paid + posts → GL updated → AR aging refreshed → Slack confirmation",
    safetyNote: "Always match on amount + customer + approximate date — never amount alone. Partial payments require manual review. Never auto-write off a variance without human approval.",
    requires: "Stripe MCP (already in your list) + Composio for NetSuite payment application",
    connections: ["Composio", "Slack", "Supabase"],
  },
  {
    id: "ms365",
    name: "Microsoft 365",
    vendor: "Microsoft",
    category: "Notifications",
    categoryColor: "#0078D4",
    complexity: "Low",
    access: "Read + Send",
    badge: "Teams Surface",
    description: "The Teams alternative to Slack for NetSuite alerts. Many mid-market companies run Teams, not Slack. Surface AR exception flags, period-close reminders, approval requests, and anomaly alerts where your finance team actually works.",
    useCase: "Claude runs weekly AR aging query → Flags overdue accounts over $5K in Teams Finance channel → Tags account owner → Suggests follow-up message draft. Identical workflow to Slack, different surface.",
    workflow: "NetSuite query (scheduled via n8n) → Claude formats and prioritizes alerts → ms365 MCP → Teams channel or DM delivery",
    safetyNote: "Send-only path from Claude. No Teams → NetSuite write path. Post summaries and action items only — not raw financial records, customer PII, or invoice details.",
    requires: "ms365 MCP (already in your list)",
    connections: ["n8n", "Zapier", "Gmail"],
  },
  {
    id: "airtable",
    name: "Airtable",
    vendor: "Airtable",
    category: "Stakeholder Layer",
    categoryColor: "#FCB400",
    complexity: "Low",
    access: "Read + Write",
    badge: "License-Free Views",
    description: "Lightweight NetSuite data views for stakeholders without NetSuite seats. Common at manufacturing companies where warehouse staff need inventory visibility without full ERP access. Claude keeps Airtable synced from NetSuite exports.",
    useCase: "Nightly NetSuite inventory export → Claude transforms and maps to Airtable base → Warehouse staff see current inventory levels, reorder alerts, and pick status without a NetSuite license.",
    workflow: "NetSuite scheduled export → Claude transforms data structure → Airtable MCP writes to base → Stakeholder views auto-update → Threshold alerts triggered on reorder breach",
    safetyNote: "Operations data only in Airtable — never sync AR aging, P&L, payment terms, or customer financials. Apply Airtable base permissions explicitly. Not all Airtable bases are equally sensitive.",
    requires: "Airtable MCP (already in your list) + scheduled NetSuite export pipeline",
    connections: ["n8n", "Zapier", "Supabase"],
  },
  {
    id: "plaid",
    name: "Plaid",
    vendor: "Plaid",
    category: "Banking Bridge",
    categoryColor: "#00B4D8",
    complexity: "High",
    access: "Read",
    badge: "Bank Recon",
    description: "Connects live bank transaction feeds to NetSuite bank reconciliation. Claude matches bank transactions to NetSuite GL entries, flags unmatched items, and accelerates month-end bank recon — a process that typically takes controllers hours.",
    useCase: "Plaid pulls last 7 days of bank transactions → Claude matches each to open NetSuite GL entries by amount + date + memo → Unmatched items flagged for controller review → Reconciliation summary delivered with match rate.",
    workflow: "Plaid transaction feed (via MCP) → Claude matches to NetSuite GL entries → Matched items confirmed → Unmatched items queued for review → Supabase audit trail + Slack summary",
    safetyNote: "⚠ Bank data is highest sensitivity. Read-only from Plaid — no write path. Never log raw bank transactions to Slack or Notion. Store Plaid credentials in a vault. Limit access to Controller/CFO role only.",
    requires: "Plaid Developer Tools MCP (already in your list) + NetSuite MCP for GL access",
    connections: ["Supabase", "n8n", "Slack"],
  },
];

const PROMPT_TEMPLATES = [
  {
    category: "Data Queries",
    emoji: "📊",
    label: "AR Aging Summary",
    prompt: `You have access to NetSuite via MCP. Pull the accounts receivable aging report for all active customers. Group by: Current, 1-30 days, 31-60 days, 61-90 days, 90+ days. Flag any account over $10,000 in the 90+ bucket. Format as a table, then write a 3-sentence executive summary with the biggest risk flag.`,
  },
  {
    category: "Data Queries",
    emoji: "📦",
    label: "Inventory Below Reorder",
    prompt: `Query NetSuite for all inventory items where quantity on hand is below the reorder point. List: item name, SKU, current QoH, reorder point, preferred vendor, and estimated lead time. Sort by urgency (days until stockout based on QoH vs reorder point gap). Flag any item with zero stock.`,
  },
  {
    category: "Record Operations",
    emoji: "➕",
    label: "New Customer from Email",
    prompt: `I'm pasting an email from a prospective customer below. Extract: company name, contact name, email address, phone number, billing address, and shipping address if different from billing. Then create a new Customer record in NetSuite with these details. Set status to Prospect. Confirm the NetSuite internal ID when done.\n\n[PASTE EMAIL THREAD HERE]`,
  },
  {
    category: "Period Close",
    emoji: "🗓",
    label: "Month-End Close Readiness",
    prompt: `We are approaching month-end close. Query NetSuite and produce a close readiness checklist showing: (1) unposted transactions by type, (2) bank accounts pending reconciliation, (3) open POs past their expected receipt date, (4) unapproved vendor bills, (5) any journal entries in Draft status. Flag anything that blocks a clean close and estimate effort to resolve each.`,
  },
  {
    category: "Support",
    emoji: "🔧",
    label: "Explain a NetSuite Error",
    prompt: `A user is receiving this error in NetSuite:\n\n[PASTE FULL ERROR MESSAGE]\n\nThe user's role is [ROLE NAME]. They were trying to [DESCRIBE THE ACTION].\n\nExplain what this error means in plain English. List the 3 most likely causes in order of probability. Provide step-by-step first-response actions. State clearly when this should be escalated past L1.`,
  },
  {
    category: "Compliance",
    emoji: "🔍",
    label: "User Access Audit",
    prompt: `Pull a list of all active users in NetSuite. For each user show: name, email, assigned roles, and last login date. Identify: (1) users inactive for 90+ days, (2) users with more than 3 roles assigned, (3) any non-admin users assigned roles that include Setup or Administer permissions. Format as a table and summarize the risk findings.`,
  },
];

const CONNECTIONS = [
  {
    icon: "code",
    title: "Claude can write SuiteQL — you don't need to learn it",
    detail: "SuiteQL (NetSuite's SQL dialect) takes months to learn. Claude can write complex queries from plain English immediately. 'Show me all sales orders created this month with margin below 15%' becomes valid SuiteQL in seconds. This unlocks saved searches and reports that would otherwise require a developer.",
  },
  {
    icon: "docdown",
    title: "PDF-first workflow requires zero MCP setup",
    detail: "NetSuite generates PDFs constantly — invoices, POs, picking tickets, SOPs. Drag any NetSuite-generated PDF into Claude and ask questions about it. No MCP connection required. This works today. Extract line items from a vendor invoice, compare a PO to a bill, review a statement of account — all zero configuration.",
  },
  {
    icon: "cog",
    title: "Manufacturing angle: BOM + Work Order analysis",
    detail: "For a company like Iron Horse Chairs, NetSuite's manufacturing modules (Work Orders, BOM, routing) are where the real operational data lives. Claude can analyze BOMs for costing errors, surface work orders behind schedule, and identify materials bottlenecks — questions the standard NetSuite reports make surprisingly hard to answer quickly.",
  },
  {
    icon: "arrowpath",
    title: "Ask Oracle (native) vs Claude (via MCP) are different tools",
    detail: "NetSuite's built-in 'Ask Oracle' AI is for business users asking simple data questions within the UI. Claude via MCP is for power users, automation, and multi-step reasoning across systems. Use Ask Oracle for quick in-session queries. Use Claude + MCP for anything cross-system, scheduled, or requiring judgment and formatting.",
  },
  {
    icon: "terminal",
    title: "SuiteScript debugging works without any connection",
    detail: "When a SuiteScript error fires, paste the stack trace into Claude. Claude can explain the error, identify the line causing it, suggest the fix, and explain why the original logic failed. No MCP needed. This alone saves hours of back-and-forth with NetSuite consultants for L1/L2 support.",
  },
  {
    icon: "photo",
    title: "Screenshot → SOP in minutes",
    detail: "Take screenshots of any NetSuite workflow — entering a bill, creating a customer, running a report. Paste them into Claude with 'write a step-by-step SOP for this process.' You get a complete, formatted procedure document without a documentation sprint. Combine with the Notion MCP to store it automatically.",
  },
];

const SAFETY_RULES = [
  {
    rule: "Sandbox before Production. Always.",
    detail: "Every Claude + NetSuite integration — MCP setup, new workflow, new automation — must be tested in Sandbox before touching Production. Oracle's status page confirms Sandbox exists for exactly this reason. A bad Claude-triggered action in Production on financial records can require a full accounting correction.",
    severity: "hard",
  },
  {
    rule: "Never use Administrator role for MCP.",
    detail: "Oracle explicitly blocks the Administrator role from MCP access by design. If you're setting up a custom MCP role, grant minimum required permissions only. Start with read-only. Add write permissions only for the specific record types the use case requires.",
    severity: "hard",
  },
  {
    rule: "Verify AI data before any financial decision.",
    detail: "Claude can hallucinate numbers, misread aggregations, or return slightly stale data. Never present a Claude-generated financial figure to leadership without verifying it in NetSuite directly. Claude is the analyst, not the source of truth. The source of truth is always NetSuite.",
    severity: "hard",
  },
  {
    rule: "Create dedicated MCP user accounts, not personal ones.",
    detail: "When configuring the NetSuite AI Connector, create a dedicated service user (e.g., 'claude-mcp-readonly@company.com') separate from personal logins. This isolates the audit trail, makes deprovisioning clean, and avoids tying AI access to any individual's employment status.",
    severity: "recommended",
  },
  {
    rule: "Review AI query logs quarterly.",
    detail: "Every Claude query via MCP is an API call with an audit trail in NetSuite. Schedule a quarterly review of what's been queried, by which role, and whether the access scope still matches the use case. Access creep in AI connectors is a real governance risk.",
    severity: "recommended",
  },
];

const CATEGORIES = ["All", "ERP Native", "Managed Bridge", "Full CRUD", "Automation", "CRM Bridge", "Notifications", "Document Layer", "Knowledge Base", "Analytics Layer", "Error Monitoring", "Email Bridge", "D2C Bridge", "Payments Bridge", "Stakeholder Layer", "Banking Bridge"];

// ─── Component ────────────────────────────────────────────────────
export default function NetSuiteTrainer() {
  const [activeTab, setActiveTab] = useState("basics");
  const [enabledMCPs, setEnabledMCPs] = useState({});
  const [expandedMCP, setExpandedMCP] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [mcpCategory, setMCPCategory] = useState("All");
  const [checkedSafety, setCheckedSafety] = useState({});
  const [expandedConnection, setExpandedConnection] = useState(null);

  const enabledCount = Object.values(enabledMCPs).filter(Boolean).length;

  const toggleMCP = (id) => {
    setEnabledMCPs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPrompt = (prompt, index) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(index);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const filteredMCPs = mcpCategory === "All"
    ? MCP_LIST
    : MCP_LIST.filter((m) => m.category === mcpCategory);

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: "#0C0C0C",
      minHeight: "100vh",
      color: "#E2E8F0",
    }}>
      {/* Header */}
      <div style={{
        background: "#0C0C0C",
        borderBottom: "2px solid #CC1122",
        padding: "20px 32px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
          {/* IRON HORSE logo — actual site asset, inverted for dark bg */}
          <img
            src="https://www.ironhorseseating.com/sca-dev-2020-1//home-page/ironhorse_logo_bw.jpg"
            alt="IRON HORSE Seating"
            style={{ height: 44, width: "auto", filter: "invert(1)", flexShrink: 0, display: "block" }}
          />
          <div style={{ width: 1, height: 36, background: "#CC1122", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#AAAAAA", letterSpacing: 2, textTransform: "uppercase" }}>
              NetSuite AI Training
            </div>
            <div style={{ fontSize: 10, color: "#444444", letterSpacing: 1.2, textTransform: "uppercase", marginTop: 2 }}>
              United Group, Inc · Internal Reference
            </div>
          </div>
          {enabledCount > 0 && (
            <div style={{
              marginLeft: "auto",
              background: "rgba(204,17,34,0.15)",
              border: "1px solid rgba(204,17,34,0.4)",
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 12,
              color: "#E83535",
              fontWeight: 700,
            }}>
              {enabledCount} MCP{enabledCount !== 1 ? "s" : ""} active
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginTop: 16 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #CC1122" : "2px solid transparent",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? "#E83535" : "#555555",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                letterSpacing: activeTab === tab.id ? 0.2 : 0,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px", maxWidth: 960, margin: "0 auto" }}>

        {/* ── Tab 1: Basics ── */}
        {activeTab === "basics" && (
          <div>
            <SectionHeader
              title="What is NetSuite?"
              sub="Cloud ERP (Oracle). Runs entirely in-browser. No client to install. It is a company's financial, operations, and customer data backbone."
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
              {[
                { icon: "building",  label: "Account ID",           desc: "Unique per company. Required for login. Format: https://<AccountID>.app.netsuite.com" },
                { icon: "beaker",    label: "Sandbox vs Production", desc: "Sandbox = test environment. Same URL with 'sandbox' prefix. Users mix these up — always check." },
                { icon: "shield",    label: "Roles",                 desc: "Control what a user sees and can do. Wrong role = missing menus. Check the Role Switcher (top-left) first." },
                { icon: "document",  label: "Records",               desc: "Base data objects: Customer, Vendor, Employee, Item, Contact. The nouns of NetSuite." },
                { icon: "arrows",    label: "Transactions",          desc: "Records that move money or inventory: Invoice, Bill, Sales Order, Purchase Order, Journal Entry." },
                { icon: "calendar",  label: "Accounting Periods",    desc: "Time segments. Closed periods lock transactions. 'This transaction is in a closed period' = L2 escalation." },
              ].map((c) => (
                <div key={c.label} style={cardStyle}>
                  <div style={{ marginBottom: 10 }}><IHIcon name={c.icon} size={22} color="#CC1122" /></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <SectionHeader title="Navigation Map" sub="Every menu is role-filtered. Two users on different roles see a different top nav. This is the most common source of 'I can't find it.'" />
            <div style={{ ...cardStyle, marginBottom: 28, fontFamily: "monospace" }}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>NETSUITE TOP NAVIGATION (role-dependent)</div>
              {[
                ["Transactions", "Sales Orders · Invoices · Bills · POs · Journal Entries · Payments"],
                ["Lists", "Customers · Vendors · Employees · Items · Contacts"],
                ["Reports", "Financial statements · Built-in reports · Saved searches"],
                ["Activities", "Events · Tasks · Phone Calls · Cases"],
                ["Setup", "Admin area — Users · Roles · Accounting · Integrations"],
                ["Customization", "Forms · Fields · Scripts · Workflows — L2/L3 territory"],
              ].map(([menu, items]) => (
                <div key={menu} style={{ display: "flex", gap: 16, padding: "6px 0", borderBottom: "1px solid #1E293B", alignItems: "flex-start" }}>
                  <div style={{ width: 120, fontSize: 12, fontWeight: 700, color: "#E83535", flexShrink: 0 }}>{menu}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{items}</div>
                </div>
              ))}
            </div>

            <SectionHeader title="Iron Horse — Issue Triage" sub="Common NetSuite issues across manufacturing, receiving, fulfillment, and AP. Run in this order before escalating." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                {
                  trigger: "Work Order won't complete",
                  role: "Manufacturing Floor",
                  steps: [
                    "1. Check all component quantities are fully issued — open Component Issues block completion",
                    "2. Verify all routing Operations are marked Complete (if routing is enabled)",
                    "3. Check for negative inventory on any component — zero or negative blocks the close",
                    "4. Quantity completed ≠ planned quantity →",
                  ],
                  escalate: true,
                },
                {
                  trigger: "Item receipt won't match the PO",
                  role: "Receiving Dock",
                  steps: [
                    "1. Confirm PO status is Pending Receipt — Closed or Fully Billed POs reject new receipts",
                    "2. Check received qty vs PO qty — partial receipts are normal, not an error",
                    "3. Verify item is on a PO line — receiving unlisted items requires a separate receipt",
                    "4. Unit cost variance >10% from PO price →",
                  ],
                  escalate: true,
                },
                {
                  trigger: "Pick task missing from fulfillment queue",
                  role: "Warehouse / Fulfillment",
                  steps: [
                    "1. Check SO status — must be Pending Fulfillment to generate a pick task",
                    "2. Verify Item Fulfillment record exists and is not stuck in Pending Approval",
                    "3. Check bin/location assignment — item may be allocated to a different warehouse location",
                    "4. Item shows zero available despite physical stock present →",
                  ],
                  escalate: true,
                },
                {
                  trigger: "Vendor bill won't post or is stuck",
                  role: "AP / Procurement",
                  steps: [
                    "1. Check transaction date — a closed accounting period blocks posting entirely",
                    "2. Verify a matching item receipt exists — 3-way match requires PO + receipt + bill",
                    "3. Check approval routing — bill may be queued behind a specific approver",
                    "4. Bill amount vs PO amount variance outside tolerance →",
                  ],
                  escalate: true,
                },
              ].map((item) => (
                <div key={item.trigger} style={{ ...cardStyle, borderLeft: `3px solid ${item.escalate ? "#EF4444" : "#10B981"}` }}>
                  <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>{item.role}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>"{item.trigger}"</div>
                  {item.steps.map((s, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>{s}</div>
                  ))}
                  {item.escalate && (
                    <div style={{ marginTop: 8, fontSize: 10, color: "#EF4444", fontWeight: 600 }}>→ ESCALATE L2</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 2: Claude + NetSuite ── */}
        {activeTab === "claude" && (
          <div>
            <SectionHeader
              title="How to Connect Claude to NetSuite"
              sub="Four paths, different tradeoffs. Start with the simplest one that meets your security requirements."
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
              {[
                { method: "NetSuite AI Connector (Native)", complexity: "Medium", setup: "Install SuiteApp → Create MCP role → OAuth in Claude", best: "Organizations who want Oracle's official channel", pro: "No third-party middleman. Oracle-supported.", con: "Requires NetSuite admin to install SuiteApp.", color: "#0EA5E9" },
                { method: "CData Connect AI", complexity: "Low", setup: "Connect CData MCP in Claude → Authenticate to NetSuite", best: "Enterprise teams, compliance-heavy orgs", pro: "No NetSuite config changes. Full audit trail.", con: "Third-party subscription cost.", color: "#8B5CF6" },
                { method: "Composio", complexity: "Low", setup: "Composio account → OAuth NetSuite connection", best: "Teams that need write access (create/update records)", pro: "Full CRUD. Works today. No install.", con: "⚠ Write access — requires governance controls.", color: "#F59E0B" },
                { method: "No MCP (PDF / paste)", complexity: "Zero", setup: "Drag NetSuite PDF or paste exported CSV into Claude", best: "One-off analysis, no IT involvement needed", pro: "Zero setup. Works right now.", con: "Manual export step. No live data.", color: "#10B981" },
              ].map((m) => (
                <div key={m.method} style={{ ...cardStyle, borderTop: `3px solid ${m.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{m.method}</div>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "rgba(100,116,139,0.2)", color: "#94A3B8" }}>
                      Setup: {m.complexity}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>Best for: {m.best}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>⚙ {m.setup}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: "#4ADE80" }}>✓ {m.pro}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#F87171", marginTop: 4 }}>✗ {m.con}</div>
                </div>
              ))}
            </div>

            {/* Connections You Haven't Made */}
            <SectionHeader
              title="Connections You Haven't Made Yet"
              sub="These aren't in any NetSuite manual. They're what you unlock when Claude is in the stack."
            />
            <div style={{ marginBottom: 32 }}>
              {CONNECTIONS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    ...cardStyle,
                    marginBottom: 8,
                    cursor: "pointer",
                    border: expandedConnection === i ? "1px solid rgba(204,17,34,0.5)" : "1px solid #1E293B",
                  }}
                  onClick={() => setExpandedConnection(expandedConnection === i ? null : i)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <IHIcon name={c.icon} size={20} color="#E83535" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", flex: 1 }}>{c.title}</span>
                    <span style={{ fontSize: 14, color: "#475569", transform: expandedConnection === i ? "rotate(90deg)" : "none", transition: "0.15s" }}>▶</span>
                  </div>
                  {expandedConnection === i && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1E293B", fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
                      {c.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Prompt Templates */}
            <SectionHeader
              title="Prompt Templates — Copy and Use Now"
              sub="Paste these into Claude with an active NetSuite MCP connection. Modify bracketed placeholders."
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {PROMPT_TEMPLATES.map((p, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8 }}>{p.category}</span>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", marginTop: 2 }}>{p.label}</div>
                    </div>
                    <button
                      onClick={() => copyPrompt(p.prompt, i)}
                      style={{
                        background: copiedPrompt === i ? "rgba(16,185,129,0.2)" : "rgba(204,17,34,0.15)",
                        border: `1px solid ${copiedPrompt === i ? "rgba(16,185,129,0.4)" : "rgba(204,17,34,0.35)"}`,
                        borderRadius: 6,
                        padding: "5px 12px",
                        fontSize: 11,
                        color: copiedPrompt === i ? "#4ADE80" : "#E83535",
                        cursor: "pointer",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {copiedPrompt === i ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div style={{
                    background: "#0B1120",
                    borderRadius: 6,
                    padding: 10,
                    fontSize: 11,
                    color: "#64748B",
                    lineHeight: 1.6,
                    maxHeight: 80,
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    {p.prompt.slice(0, 140)}…
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 3: MCP Ecosystem ── */}
        {activeTab === "mcp" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>MCP Ecosystem</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                  Toggle integrations to see what they unlock alongside Claude + NetSuite.
                  {enabledCount > 0 && <span style={{ color: "#E83535", fontWeight: 600 }}> {enabledCount} active.</span>}
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMCPCategory(cat)}
                    style={{
                      background: mcpCategory === cat ? "rgba(204,17,34,0.2)" : "rgba(30,41,59,0.6)",
                      border: `1px solid ${mcpCategory === cat ? "rgba(204,17,34,0.5)" : "#1E293B"}`,
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 11,
                      color: mcpCategory === cat ? "#E83535" : "#64748B",
                      cursor: "pointer",
                      fontWeight: mcpCategory === cat ? 600 : 400,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {filteredMCPs.map((mcp) => {
                const enabled = enabledMCPs[mcp.id];
                const expanded = expandedMCP === mcp.id;
                return (
                  <div
                    key={mcp.id}
                    style={{
                      ...cardStyle,
                      border: enabled
                        ? "1px solid rgba(204,17,34,0.45)"
                        : "1px solid #252525",
                      boxShadow: enabled ? "0 0 18px rgba(204,17,34,0.12)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: mcp.categoryColor,
                        marginTop: 5,
                        flexShrink: 0,
                        boxShadow: enabled ? `0 0 8px ${mcp.categoryColor}` : "none",
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{mcp.name}</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{
                              fontSize: 9,
                              padding: "2px 7px",
                              borderRadius: 10,
                              background: `${mcp.categoryColor}22`,
                              color: mcp.categoryColor,
                              fontWeight: 600,
                            }}>{mcp.badge}</span>
                            {/* Toggle */}
                            <div
                              onClick={() => toggleMCP(mcp.id)}
                              style={{
                                width: 36,
                                height: 20,
                                borderRadius: 10,
                                background: enabled ? "#CC1122" : "#1E293B",
                                border: `1px solid ${enabled ? "#CC1122" : "#334155"}`,
                                cursor: "pointer",
                                position: "relative",
                                transition: "all 0.2s",
                                flexShrink: 0,
                              }}
                            >
                              <div style={{
                                position: "absolute",
                                top: 2,
                                left: enabled ? 18 : 2,
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                background: "#fff",
                                transition: "left 0.2s",
                              }} />
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
                          {mcp.vendor} · {mcp.category} · {mcp.access}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, marginBottom: 10 }}>
                      {mcp.description}
                    </div>

                    {/* Expand button */}
                    <button
                      onClick={() => setExpandedMCP(expanded ? null : mcp.id)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: 11,
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "0.15s", display: "inline-block" }}>▶</span>
                      {expanded ? "Hide detail" : "See workflow + safety"}
                    </button>

                    {expanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1E293B" }}>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#E83535", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Use Case</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.6 }}>{mcp.useCase}</div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#8899AA", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Workflow</div>
                          <div style={{
                            fontFamily: "monospace",
                            fontSize: 10,
                            color: "#64748B",
                            background: "#0A0A0A",
                            borderRadius: 6,
                            padding: "8px 10px",
                            lineHeight: 1.6,
                          }}>{mcp.workflow}</div>
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: mcp.safetyNote.includes("⚠") ? "#FBBF24" : "#6EE7B7",
                          background: mcp.safetyNote.includes("⚠") ? "rgba(251,191,36,0.08)" : "rgba(110,231,183,0.06)",
                          border: `1px solid ${mcp.safetyNote.includes("⚠") ? "rgba(251,191,36,0.2)" : "rgba(110,231,183,0.15)"}`,
                          borderRadius: 6,
                          padding: "7px 10px",
                          lineHeight: 1.5,
                        }}>
                          {mcp.safetyNote.includes("⚠") ? "⚠ " : "✓ "}{mcp.safetyNote}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 10, color: "#475569" }}>
                          Requires: {mcp.requires}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab 4: Safety & Governance ── */}
        {activeTab === "safety" && (
          <div>
            <SectionHeader
              title="Safety & Governance"
              sub="Claude + NetSuite is powerful. These rules keep financial data protected and auditable."
            />

            <div style={{ marginBottom: 32 }}>
              {SAFETY_RULES.map((rule, i) => (
                <div
                  key={i}
                  style={{
                    ...cardStyle,
                    marginBottom: 10,
                    borderLeft: `3px solid ${rule.severity === "hard" ? "#EF4444" : "#F59E0B"}`,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: checkedSafety[i] ? "#CC1122" : "rgba(30,41,59,0.8)",
                      border: `1px solid ${checkedSafety[i] ? "#CC1122" : "#334155"}`,
                      cursor: "pointer",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                      fontSize: 12,
                      color: "#fff",
                    }}
                    onClick={() => setCheckedSafety((p) => ({ ...p, [i]: !p[i] }))}
                    >
                      {checkedSafety[i] ? "✓" : ""}
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{rule.rule}</div>
                        <span style={{
                          fontSize: 9,
                          padding: "2px 7px",
                          borderRadius: 10,
                          background: rule.severity === "hard" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                          color: rule.severity === "hard" ? "#FCA5A5" : "#FCD34D",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}>
                          {rule.severity === "hard" ? "Required" : "Best Practice"}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{rule.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SectionHeader title="What Claude Can and Cannot Do with NetSuite" sub="" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
              <div style={{ ...cardStyle, borderTop: "3px solid #10B981" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80", marginBottom: 12 }}>✓ Claude CAN</div>
                {[
                  "Query live NetSuite data in natural language",
                  "Write SuiteQL queries from plain English descriptions",
                  "Create/update/delete records (with write-access MCP + governance)",
                  "Analyze exported reports and flag anomalies",
                  "Explain any error message or SuiteScript stack trace",
                  "Generate SOPs from NetSuite workflow screenshots",
                  "Draft financial summaries from AR/AP/inventory data",
                  "Automate multi-step workflows across NetSuite + other tools",
                  "Audit user access and permission configurations",
                ].map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#94A3B8", padding: "4px 0", borderBottom: "1px solid #1E293B" }}>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ ...cardStyle, borderTop: "3px solid #EF4444" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F87171", marginBottom: 12 }}>✗ Claude CANNOT / SHOULD NOT</div>
                {[
                  "Be the source of truth for financial decisions — verify in NetSuite",
                  "Access NetSuite without an active MCP connection or export",
                  "Override accounting period locks (that's admin/accountant territory)",
                  "Guarantee aggregated numbers without verification",
                  "Make irreversible financial record changes without human approval",
                  "Access records outside the permissions of the connected role",
                  "Replace a NetSuite-certified admin for config changes",
                  "Guarantee real-time data — there may be sync lag depending on connector",
                ].map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#94A3B8", padding: "4px 0", borderBottom: "1px solid #1E293B" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <SectionHeader title="Red Flags — Escalate Immediately" sub="These patterns signal something outside Claude or L1 scope." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { flag: "Numeric error code in parentheses", action: "Screenshot + L2" },
                { flag: "'Closed period' on a transaction", action: "L2 / Accounting admin" },
                { flag: "User sees data they shouldn't", action: "L2 — over-permission audit" },
                { flag: "Record locked / active edit lock", action: "L2 — may need admin to clear" },
                { flag: "Integration not syncing for 24+ hrs", action: "L2 + Sentry audit" },
                { flag: "Claude returns different data than NetSuite UI", action: "Verify in NS directly; don't use AI figure" },
              ].map((r) => (
                <div key={r.flag} style={{ ...cardStyle, borderLeft: "3px solid #EF4444" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#FCA5A5", marginBottom: 4 }}>{r.flag}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>→ {r.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{title}</h2>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>{sub}</p>}
    </div>
  );
}

const cardStyle = {
  background: "#141414",
  border: "1px solid #252525",
  borderRadius: 10,
  padding: 16,
};

// ─── Heroicons v2 outline paths ───────────────────────────────────────────────
const IH_ICON_PATHS = {
  building:  "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z",
  beaker:    "M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
  shield:    "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  document:  "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  arrows:    "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  calendar:  "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
  code:      "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  docdown:   "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  cog:       "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  arrowpath: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99",
  terminal:  "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z",
  photo:     "M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z",
};

function IHIcon({ name, size = 20, color = "#E83535" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d={IH_ICON_PATHS[name] || ""} />
    </svg>
  );
}
