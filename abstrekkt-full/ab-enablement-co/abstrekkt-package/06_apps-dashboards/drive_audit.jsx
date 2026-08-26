import { useState } from "react";

const FOUND = [
  { label: "AI/tech articles (publish-ready)", count: 30, note: "Blog & newsletter content — not instructional" },
  { label: "Opportunity packages (Upwork, 1871, P33, NSF)", count: 4, note: "Pitch docs — not instructional" },
  { label: "Brand/design reference files", count: 3, note: "Abstrekkt brand config, design md — static refs" },
  { label: "Technical snippets (react19, pipeline templates)", count: 2, note: "Raw dev notes, no structure" },
  { label: "Construction over Recovery (memoir)", count: 1, note: "Personal writing project" },
  { label: "Spreadsheets (time entries, pain points)", count: 2, note: "Data files, not guides" },
  { label: "Briefings & audits (Future Watch, Skills Audit)", count: 2, note: "Point-in-time snapshots" },
  { label: "launch_checklist.md", count: 1, note: "Single checklist, no context doc" },
];

const GAPS = [
  {
    id: 1,
    title: "INT L1 Service Desk Triage Runbook",
    urgency: "HIGH",
    domain: "Intinc",
    why: "You have L1 skills in Claude but zero portable SOP. No shareable triage guide, escalation routing doc, or resolution template exists in Drive.",
    color: "#ef4444",
    prompt: `You are writing a professional L1 Service Desk Triage Runbook for Intinc, a Lincolnshire IL MSP (51-200 employees). The audience is an L1 Service Desk Technician. Stack: Windows endpoints, FreshService ticketing, Kaseya VSA, Bitdefender GravityZone, Cisco AnyConnect, Duo Mobile, Bitwarden, Kixie softphone.

Write a complete, production-ready runbook with these sections:
1. **Triage Flowchart** (text-based decision tree: Is it a P1/outage? → escalate. Single user? → troubleshoot. Hardware or software? → route)
2. **Escalation Routing Table** (L1 handles, L1→L2 criteria, L2→L3 criteria, with examples)
3. **Top 10 Issue Resolution Templates** (VPN, password reset, MFA, printer, email, BitLocker, slow PC, new user setup, software install, network connectivity — each with: symptoms / steps / FreshService note format)
4. **FreshService Ticket Note Format** (how to write internal notes and resolution summaries)
5. **Quick Reference Card** (one-liner for each escalation trigger)

Write in a direct, professional tone. Use headers, numbered steps, and tables where appropriate. Be specific to the Intinc MSP stack.`
  },
  {
    id: 2,
    title: "FlashFusion Client Onboarding Pack",
    urgency: "HIGH",
    domain: "FlashFusion",
    why: "Meridian Ops is your first real client. Nothing explains what happens after a client says yes — no intake, no expectations doc, no process map.",
    color: "#ef4444",
    prompt: `You are writing a professional Client Onboarding Pack for FlashFusion, an AI enablement consulting brand under Abstrekkt (sole proprietor, Kyle Rosebrook). First client: Meridian Operations.

Write a complete client-facing onboarding document with these sections:
1. **Welcome & What to Expect** (brief brand voice intro — confident, earned authority, no hype)
2. **Engagement Overview** (what FlashFusion delivers: AI strategy, workflow automation, enablement sessions, implementation support)
3. **The FlashFusion Process** (4-phase: Discovery → Strategy → Build → Enable — with what happens in each phase and client responsibilities)
4. **Milestone Map** (timeline with checkpoints: kickoff, discovery call, strategy doc delivery, first workflow build, enablement session, retrospective)
5. **What You Provide vs What We Deliver** (two-column table: client inputs vs FlashFusion outputs)
6. **Communication Cadence** (async-first, weekly check-in, Slack/email norms, response time expectations)
7. **How to Get the Most From This Engagement** (3-5 practical tips)
8. **First 48 Hours Checklist** (what the client should do immediately after signing)

Tone: Professional, direct, warm. No jargon. Write as Kyle Rosebrook speaking to a client exec.`
  },
  {
    id: 3,
    title: "AI Enablement Quick-Start Guide (INT Colleagues)",
    urgency: "MED",
    domain: "Intinc",
    why: "Your AI adoption work at INT is fully in your head and in Claude sessions. No persistent doc exists that a colleague could pick up and follow independently.",
    color: "#f59e0b",
    prompt: `You are writing an AI Enablement Quick-Start Guide for non-technical Intinc employees (MSP staff: account managers, coordinators, L1 techs). This is an internal guide, not a pitch deck. Audience: people who have heard about AI but haven't used it at work yet.

Write a practical, friendly guide with these sections:
1. **What AI Can Actually Do For You at Intinc** (5 concrete use cases: draft client emails, summarize tickets, write KB articles, troubleshoot research, summarize long threads)
2. **Your First 5 Tasks to Try With Claude** (step-by-step, copy-paste ready, specific to MSP work — e.g., "Paste this ticket note and ask Claude to write a resolution summary")
3. **Prompt Templates for Common L1 Tasks** (6 ready-to-use templates with blanks to fill in — ticket notes, client comms, escalation summaries, KB drafts)
4. **What AI Can't Do (Don't Trust It For This)** (credentials, live system status, customer billing data, anything requiring real-time info)
5. **Safety Rules at Intinc** (don't paste client PII, don't share credentials, don't use AI output without reviewing it)
6. **Where to Get Help** (who to ask — written as if Kyle is the internal contact)

Tone: Friendly, direct, zero condescension. Written for someone who has used Google but not AI tools.`
  },
  {
    id: 4,
    title: "n8n + Base44 Operational Reference",
    urgency: "HIGH",
    domain: "FlashFusion",
    why: "Recurring P1 blocker: 11 workflows blocked on Base44 Bearer creds + SCH-02 lane field. No runbook means every incident is a re-investigation from scratch.",
    color: "#ef4444",
    prompt: `You are writing an operational reference guide for the FlashFusion n8n + Base44 automation stack. Author: Kyle Rosebrook (solo operator). Stack: n8n Cloud (krosebrook.app.n8n.cloud), Base44 apps (consulting ops ID 6a02ac1bad2b4e37732ef382, Fusion AI ID 68dd8e79ca073475565c8e16), Supabase (flashnframe-app: etctmappdhpjuwptdbeb).

Write a complete operational reference with these sections:
1. **Workflow Inventory Table** (11 workflows across: morning briefing, CRM, review, focus systems — table with: name / trigger / what it does / dependencies / last known status)
2. **Known P1 Blocker: Base44 Bearer Credentials** (what the error looks like, root cause, exact fix steps, how to verify it's resolved)
3. **Known P1 Blocker: SCH-02 Lane Field** (what it is, why it breaks, fix procedure, prevention)
4. **Credential Rotation Procedure** (step-by-step: where credentials live in n8n, how to update Base44 Bearer token, how to test after rotation)
5. **Common Failure Modes & Fixes** (table: symptom / likely cause / fix / escalation if not resolved)
6. **Silent Failure Detection** (how to tell if a workflow stopped running without an error — n8n execution log check, Supabase audit trail check)
7. **Weekly Health Check Checklist** (5-minute routine to catch issues before they become P1s)

Be specific, operational, no fluff. Written as a reference doc you return to during incidents.`
  },
  {
    id: 5,
    title: "DigitalME Workspace Runbook",
    urgency: "MED",
    domain: "Personal Ops",
    why: "'DigitalME runbook in progress' has been in memory for weeks — not in Drive. Home directory initialized as global Git repo is unresolved structural debt.",
    color: "#f59e0b",
    prompt: `You are writing the DigitalME Workspace Runbook for Kyle Rosebrook — a personal operational reference for managing his development environment and digital workspace. OS: Windows (primary work laptop at Intinc) + any personal machine. Stack: Claude Desktop + MCP extensions, GitHub (username: Krosebrook), Supabase, Vercel, Cloudflare, n8n, Base44, Notion, Google Drive.

Write a complete personal workspace runbook with these sections:
1. **Known Structural Issue: Global Git Repo in Home Directory** (what happened, why it's a problem, exact steps to safely uninitialize it without losing work, verification steps)
2. **Canonical Directory Map** (recommended folder structure for home directory: where projects live, where temp work goes, where configs live)
3. **Tool Registry** (table: tool / what it's used for / where config lives / where credentials are / auth method)
4. **MCP Extension Health Checklist** (Snyk: use snyk auth not plaintext token; Windows-MCP: full desktop control — audit before use; ToolUniverse; cold uv cache fix via uv sync pre-warm + Task Scheduler)
5. **Google Drive Folder Taxonomy** (recommended folder structure based on current content: FlashFusion / Intinc / Personal / Archive)
6. **Weekly Maintenance Checklist** (10-minute Friday routine: check n8n, rotate if needed, Drive cleanup, Git status, MCP health)
7. **Emergency Recovery Procedures** (laptop dies, credential lost, Drive gone — what to do first)

Write as a personal ops doc — direct, practical, first-person friendly. This is a doc Kyle reads alone.`
  },
  {
    id: 6,
    title: "MCP Routing Architecture Reference",
    urgency: "MED",
    domain: "FlashFusion",
    why: "mcp.flashfusion.co is a 50-MCP routing platform. No reference doc exists for the 6-domain architecture, routing logic, or which MCP lives where.",
    color: "#f59e0b",
    prompt: `You are writing the MCP Routing Architecture Reference for mcp.flashfusion.co — a universal MCP routing platform built on Base44 + Manufact Cloud infrastructure, targeting a 50-MCP architecture organized across 6 domains. Author: Kyle Rosebrook (FlashFusion / Abstrekkt).

Write a complete architecture reference with these sections:
1. **Platform Overview** (what mcp.flashfusion.co is, what problem it solves, how Base44 + Manufact Cloud fit together)
2. **The 6-Domain Architecture** (design a logical 6-domain breakdown for a 50-MCP universal routing platform — suggested domains: Productivity, Dev/Engineering, Content/Creative, Data/Analytics, Business Ops, AI/Agent Infrastructure — with 8-10 MCPs per domain drawn from the actual connected MCP list)
3. **Routing Decision Logic** (how a request gets routed to the right domain and MCP — decision tree format)
4. **MCP Catalog by Domain** (table: domain / MCP name / URL / primary use case / auth method / status)
5. **Base44 + Manufact Cloud Infrastructure Notes** (how Base44 hosts the routing layer, how Manufact Cloud handles deployment, observability touchpoints)
6. **Extension Health & Known Issues** (.mcpb bundle issues: Snyk plaintext token risk, Windows-MCP unaudited tool list, ToolUniverse; cold uv cache spawn timeout fix; Task Scheduler pre-warm)
7. **Adding a New MCP** (step-by-step: evaluate → domain assignment → register in Base44 → deploy via Manufact → health check)

Write as a technical architecture doc. Use tables, domain headers, and clear routing logic. This is the canonical reference.`
  },
];

function BuildButton({ gap }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [content, setContent] = useState("");

  const build = async (e) => {
    e.stopPropagation();
    setState("loading");
    setContent("");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: gap.prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "No content returned.";
      setContent(text);
      setState("done");
    } catch (err) {
      setContent("Error generating content: " + err.message);
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <button
        onClick={build}
        className="mt-3 text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
      >
        Build this →
      </button>
    );
  }

  if (state === "loading") {
    return (
      <div className="mt-3 flex items-center gap-2 text-violet-400 text-xs">
        <span className="animate-spin">⟳</span> Generating {gap.title}…
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          ✓ Generated
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setState("idle"); setContent(""); }}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          Reset
        </button>
      </div>
      <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto font-mono text-xs">
        {content}
      </div>
    </div>
  );
}

const urgencyBadge = (u) => {
  const s = u === "HIGH"
    ? "bg-red-500/20 text-red-300 border border-red-500/40"
    : "bg-amber-500/20 text-amber-300 border border-amber-500/40";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded ${s}`}>{u}</span>;
};

const domainColor = {
  "Intinc": "text-blue-400",
  "FlashFusion": "text-violet-400",
  "Personal Ops": "text-emerald-400",
};

export default function DriveAudit() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🗂️</span>
          <h1 className="text-2xl font-bold tracking-tight">Google Drive — Instructional Content Audit</h1>
        </div>
        <p className="text-zinc-400 text-sm ml-10">50 files scanned · June 13, 2026 · kylerosebrook@gmail.com</p>
      </div>

      <div className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">What's in Drive now</h2>
        <div className="grid grid-cols-2 gap-2">
          {FOUND.map((f, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex gap-3 items-start">
              <div className="bg-zinc-800 text-zinc-300 text-xs font-bold rounded px-2 py-1 shrink-0 min-w-[28px] text-center">{f.count}</div>
              <div>
                <div className="text-sm font-medium text-zinc-200">{f.label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{f.note}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-amber-950/40 border border-amber-700/40 rounded-lg p-3 text-sm text-amber-200">
          <strong>⚡ Diagnosis:</strong> Drive is a content archive, not an instructional library.
          <strong> Zero SOPs, onboarding packs, or operational runbooks exist.</strong>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">6 Pieces to Plug the Holes — Click to expand, then Build inline</h2>
        <div className="space-y-3">
          {GAPS.map((g) => (
            <div
              key={g.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 transition-all"
            >
              <div
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => setSelected(selected === g.id ? null : g.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                    style={{ background: g.color + "22", color: g.color, border: `1px solid ${g.color}44` }}
                  >
                    {g.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-white">{g.title}</span>
                      {urgencyBadge(g.urgency)}
                      <span className={`text-xs font-medium ${domainColor[g.domain] || "text-zinc-400"}`}>{g.domain}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{g.why}</p>
                  </div>
                </div>
                <span className="text-zinc-600 text-lg shrink-0 mt-1">{selected === g.id ? "▲" : "▼"}</span>
              </div>

              {selected === g.id && (
                <div className="mt-4 ml-11 border-t border-zinc-800 pt-4">
                  <BuildButton gap={g} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-xs text-zinc-600 border-t border-zinc-800 pt-4">
        [SOURCED] File list pulled live from Drive via Google Drive MCP · [GENERATED] Gap analysis + content via Claude Sonnet 4.6
      </div>
    </div>
  );
}
