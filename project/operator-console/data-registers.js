/* Abstrekkt Operator Console — decisions & risk registers (07-decisions-and-risks).
   Nine registers, normalized where useful for the filterable browser. */
window.ConsoleData = window.ConsoleData || {};

window.ConsoleData.registers = {

  decisionsLocked: [
    { id: "D-L1", decision: "Abstrekkt is the parent brand; ChaosClub* retired permanently", source: "instructions", confidence: "High" },
    { id: "D-L2", decision: "Brand: \u201CReading Room at Midnight\u201D \u2014 ink #1C1917, brass #C8A86A, Fraunces/Crimson Pro/JetBrains Mono", source: "instructions", confidence: "High" },
    { id: "D-L3", decision: "FlashFusion runs a separate void-dark brand system (#0B0B14 / #A855F7 / #EC4899 / #22D3EE)", source: "instructions", confidence: "High" },
    { id: "D-L4", decision: "$4,500 audit floor; one documented exception max (Ryan)", source: "instructions, flashfusion-arc", confidence: "High" },
    { id: "D-L5", decision: "Solo founder; no partners unless offer heavily in Kyle's favor", source: "instructions", confidence: "High" },
    { id: "D-L6", decision: "Absolute lane separation from the day-job firm", source: "instructions", confidence: "High" },
    { id: "D-L7", decision: "No credential claims before 2026-07-20 pass", source: "instructions", confidence: "High" },
    { id: "D-L8", decision: "E&O with affirmative-AI rider required before first paid contract", source: "instructions", confidence: "High" },
    { id: "D-L9", decision: "Anthropic API default provider (sonnet-4-6; opus for max tier)", source: "WorkstreamMapper", confidence: "Medium" },
    { id: "D-L10", decision: "RLS never disabled; migrations immutable; no secrets in client", source: "AGENTS.md", confidence: "High" },
  ],

  decisionsPackage: [
    { id: "D-P1", title: "Employment-IP review is a first-class pre-revenue blocker", context: "Buried in the LLC kit; absent from the instructions' gate list.", decision: "Elevate to B-4 with CRITICAL severity.", rationale: "Highest-consequence, longest-lead item; directly protects lane separation.", reversal: "Trivial \u2014 demote if attorney says the employment agreement is clean." },
    { id: "D-P2", title: "Consulting-first sequencing (Path A)", context: "Three viable go-to-market lanes (consulting / product / content).", decision: "Consulting-first; product + content trail first revenue.", rationale: "Only lane with live priced demand; funds the others without capital.", reversal: "Low \u2014 a product or content breakout can re-sequence at any quarter retro." },
    { id: "D-P3", title: "Treat Ryan as free pending reconciliation", context: "C-1 contradiction (free vs $3,000).", decision: "Follow the governing instructions (free) until the boundary doc reconciles it.", rationale: "Governing doc outranks the arc doc; avoids inventing a $3,000 precedent.", reversal: "Low \u2014 flip if the boundary doc confirms $3,000." },
    { id: "D-P4", title: "Memoir excluded from this package", context: "Tax the Damage is a separate voice register; instructions forbid cross-pollination with business content.", decision: "Log status only; do not reconstruct.", rationale: "Including it would violate the register-separation rule and add no operational value.", reversal: "None \u2014 it can be packaged separately on request." },
    { id: "D-P5", title: "Package tier = Complete, not exhaustive-for-its-own-sake", context: "Default was EXHAUSTIVE; org spans 5 workstreams.", decision: "Deep on FlashFusion + blockers; thin on the rest; no padded files.", rationale: "Matches Kyle's anti-padding preference; concentrates effort where revenue/risk is.", reversal: "Low \u2014 any thin section can be deepened on request." },
  ],

  contradictions: [
    { id: "C-1", title: "Ryan exception amount: free vs $3,000", status: "UNRESOLVED CONFLICT", sourceA: "Project instructions \u2014 Ryan is a \u201CFree case-study trade.\u201D", sourceB: "the-flashfusion-arc.jsx \u2014 \u201CRyan Anderskow's $3,000 case-study trade\u2026 a one-time exception.\u201D", why: "Determines whether the single documented pricing exception is $0 or $3,000 \u2014 i.e. whether a dollar precedent exists that a future prospect could point to.", resolution: "Instructions win \u2192 treat as free for now, but reconcile in the owed Ryan boundary doc. Do not leave two live numbers.", owner: "Kyle" },
    { id: "C-2", title: "\u201CChaos Club Co. LLC\u201D as a second entity to form", status: "OBSOLETE", sourceA: "Instructions \u2014 ChaosClubCo / Chaos Collective retired; must never appear.", sourceB: "llc-formation-kit-v2.html \u2014 prescribes filing \u201CChaos Club Co. LLC\u201D as the second of two entities.", why: "Superseded decision (rebrand).", resolution: "Ignore the two-entity/Chaos-Club plan; keep only the FlashFusion/Abstrekkt filing procedure.", owner: "Resolved in this package" },
    { id: "C-3", title: "chaosclub.co live domain vs retired ChaosClub* brand", status: "INSUFFICIENT EVIDENCE", sourceA: "Instructions \u2014 ChaosClub* names retired externally.", sourceB: "WorkstreamMapper.jsx \u2014 an active chaosclub.co peer-support app in the current stack.", why: "Unclear if the live domain is in-scope for the retirement.", resolution: "Flag as open question. Confirm whether chaosclub.co must be renamed/retired or is a separate permitted product. Do not assume either way.", owner: "Kyle" },
    { id: "C-4", title: "Certification name: CCA vs CCA-F vs \u201CAnthropic Academy cert\u201D", status: "NAMING DRIFT", sourceA: "Multiple names across instructions / Union / LLC docs", sourceB: "for what appears to be one credential (exam 2026-07-20).", why: "Parallel/naming drift, not a substantive conflict.", resolution: "Confirm exact public name at pass; use one name everywhere afterward. Never claim before pass.", owner: "Kyle" },
    { id: "C-5", title: "Blocker list completeness \u2014 instructions omit the employment-IP review", status: "SUPPLEMENT, NOT CONFLICT", sourceA: "Instructions list LLC + E&O as the two pre-revenue gates", sourceB: "the LLC kit adds a third (employment-IP attorney review) that the instructions omit.", why: "Omission, not contradiction.", resolution: "Treat employment-IP review as a third pre-revenue blocker (B-4). Recommend adding it to the instructions' insurance & risk gate.", owner: "Kyle" },
  ],

  risks: [
    { id: "R-1", risk: "Signing a client before entity/E&O/IP clear", category: "Legal", likelihood: "Medium", impact: "Severe (personal liability)", severity: "CRITICAL", mitigation: "Milestone-0 gate; no paid contract until B-1..B-5 close", status: "Open" },
    { id: "R-2", risk: "Employer IP claim on FlashFusion work", category: "Legal", likelihood: "Low\u2013Med", impact: "Severe", severity: "CRITICAL", mitigation: "B-4 attorney review + IP assignment to LLC", status: "Open" },
    { id: "R-3", risk: "Pricing floor collapses on first client", category: "Business", likelihood: "Medium", impact: "High", severity: "HIGH", mitigation: "Scripted floor-hold; Ryan case study; document any exception", status: "Open" },
    { id: "R-4", risk: "Union VP opportunity lost to delay", category: "Business", likelihood: "Med\u2013High", impact: "High (largest contract)", severity: "HIGH", mitigation: "Send overdue outreach this week", status: "Open" },
    { id: "R-5", risk: "Client-facing agent causes harm (no HITL/telemetry)", category: "Security", likelihood: "Med (once agents ship)", impact: "High", severity: "HIGH", mitigation: "HITL checkpoints; threat model; kill switch before shipping", status: "Open (pre-ship)" },
    { id: "R-6", risk: "Secret leak / RLS misconfig", category: "Security", likelihood: "Low\u2013Med", impact: "High", severity: "HIGH", mitigation: "Server-side-only secrets; never-disable-RLS; scanning; advisors", status: "Controlled by rule; enforcement unverified" },
    { id: "R-7", risk: "Anthropic concentration (provider+cert+partner)", category: "Strategic", likelihood: "Low", impact: "High", severity: "MEDIUM", mitigation: "Keep offer provider-agnostic; abstraction layer before product scale", status: "Open" },
    { id: "R-8", risk: "Solo bus-factor / continuity break", category: "Operational", likelihood: "Low", impact: "High", severity: "MEDIUM", mitigation: "Keep project current; contractor bench; documented handoffs", status: "Open" },
    { id: "R-9", risk: "Uninsured free-engagement liability (Art/Ryan)", category: "Legal", likelihood: "Low", impact: "Med\u2013High", severity: "MEDIUM", mitigation: "Confirm with attorney whether E&O should gate free work too", status: "Open" },
    { id: "R-10", risk: "Brand-rule breach (ChaosClub name surfaces)", category: "Brand", likelihood: "Low", impact: "Medium", severity: "MEDIUM", mitigation: "Resolve chaosclub.co scope; scrub stale assets", status: "Open" },
    { id: "R-11", risk: "Register cross-pollination (memoir\u2194newsletter)", category: "Content", likelihood: "Low", impact: "Medium", severity: "LOW", mitigation: "Hard separation rule", status: "Controlled" },
    { id: "R-12", risk: "Cost creep (API + hosted platforms, no cost view)", category: "Financial", likelihood: "Medium", impact: "Medium", severity: "MEDIUM", mitigation: "Inward ROI model; usage caps", status: "Open" },
    { id: "R-13", risk: "Internal tooling stalls (11 n8n workflows)", category: "Operational", likelihood: "High", impact: "Low\u2013Med", severity: "LOW", mitigation: "Resolve creds/schema; non-critical-path", status: "Open" },
  ],
  risksNote: "CRITICAL = severe impact AND currently unmitigated AND on the revenue critical path (R-1, R-2). HIGH = high impact with an available mitigation not yet executed (R-3..R-6). MEDIUM/LOW = real but lower impact, lower likelihood, or already controlled. R-1 and R-2 must not slip \u2014 both are one-time, Kyle-only actions with severe downside and cheap mitigation.",

  gaps: [
    { id: "GAP-1", gap: "LLC filing not confirmed", why: "Gates EIN, bank, contracts, Partner Network", severity: "CRITICAL", blocking: true, resolution: "Kyle runs IL SOS search / files", owner: "Kyle" },
    { id: "GAP-2", gap: "E&O not started", why: "Standard policies exclude AI; uninsured delivery = personal exposure", severity: "CRITICAL", blocking: true, resolution: "Quote 4 providers; bind", owner: "Kyle" },
    { id: "GAP-3", gap: "Employment-IP review not done", why: "Employer could claim FlashFusion IP", severity: "CRITICAL", blocking: true, resolution: "Attorney written opinion", owner: "Kyle+atty" },
    { id: "GAP-4", gap: "MSA / operating / IP-assignment not reviewed", why: "LLC \u201Cowns nothing\u201D without IP assignment; no client contract ready", severity: "HIGH", blocking: true, resolution: "Attorney bundle review", owner: "Kyle+atty" },
    { id: "GAP-5", gap: "Ryan boundary doc missing", why: "Only thing isolating the exception from precedent", severity: "HIGH", blocking: false, resolution: "Write it; resolve $ conflict", owner: "Kyle" },
    { id: "GAP-6", gap: "Union VP outreach not sent (overdue)", why: "Largest potential contract decaying", severity: "HIGH", blocking: false, resolution: "Send message now", owner: "Kyle" },
    { id: "GAP-7", gap: "No test suite / QA evidence", why: "Client-delivered software unverified", severity: "HIGH", blocking: false, resolution: "Add smoke tests before client agents", owner: "Kyle" },
    { id: "GAP-8", gap: "No threat model / HITL enforcement proof", why: "Autonomous client agents need oversight + abuse review", severity: "HIGH", blocking: false, resolution: "Threat model + HITL checkpoints", owner: "Kyle" },
    { id: "GAP-9", gap: "Load-Bearing has no public URL", why: "Gates all press outreach", severity: "MEDIUM", blocking: false, resolution: "Platform criteria \u2192 choose \u2192 publish", owner: "Kyle" },
    { id: "GAP-10", gap: "plugins-plus distribution undecided", why: "244 built plugins unmonetized", severity: "MEDIUM", blocking: false, resolution: "Pick one path", owner: "Kyle" },
    { id: "GAP-11", gap: "Concurrent-engagement cap undecided", why: "Triage will set it if strategy doesn't", severity: "MEDIUM", blocking: false, resolution: "Decide (rec 3) before CLC+Union convert", owner: "Kyle" },
    { id: "GAP-12", gap: "Ample / FissionPrompt undocumented", why: "Named products with no scope/status", severity: "LOW", blocking: false, resolution: "Document or drop", owner: "Kyle" },
    { id: "GAP-13", gap: "chaosclub.co naming vs retired brand", why: "Possible external-copy rule violation", severity: "MEDIUM", blocking: false, resolution: "Confirm scope", owner: "Kyle" },
    { id: "GAP-14", gap: "Certification name unreconciled", why: "Risk of inconsistent public claim", severity: "LOW", blocking: false, resolution: "Fix name at pass", owner: "Kyle" },
    { id: "GAP-15", gap: "Fusion AI dead-entity count unknown", why: "Schema bloat, slow agent context", severity: "LOW", blocking: false, resolution: "Run entity audit", owner: "Kyle" },
    { id: "GAP-16", gap: "Home dir is a global git repo", why: "Structural workspace debt / accidental commits", severity: "LOW", blocking: false, resolution: "Safe un-init per runbook", owner: "Kyle" },
  ],

  bottlenecks: [
    { id: "BN-1", title: "Kyle is the single point of production", severity: "CRITICAL (structural)", trigger: "Every consulting engagement consumes Kyle's hours directly (audit, deliver, document).", symptoms: "Throughput caps at ~2\u20133 concurrent; delivery collides with the day job and exam week.", rootCause: "Solo model by design; no contractors engaged yet.", workaround: "Concurrent cap (recommend 3); no client delivery in exam week.", fix: "Productize (3-tier curriculum SKUs, plugins), then bring contractors for delivery once cash exists.", impact: "Caps revenue velocity in Phases 1\u20132." },
    { id: "BN-2", title: "Interactive, human-only legal steps", severity: "HIGH", trigger: "IL SOS search, filing, EIN, bank, attorney review all require Kyle in person / interactively.", symptoms: "Blocker chain stalls if Kyle doesn't act; this package cannot close them.", rootCause: "Government + KYC + legal processes.", workaround: "None \u2014 sequence them early and in parallel where possible.", fix: "Batch them in Phase 0 around the exam.", impact: "Directly gates first revenue." },
    { id: "BN-3", title: "Overdue Union VP outreach", severity: "HIGH (decaying opportunity)", trigger: "Message overdue since Jun 2026; board cycle is 30\u201390 days once started.", symptoms: "The largest single contract slips a full quarter for every month of delay.", rootCause: "Outreach not sent.", workaround: "Send now; outreach is not legally gated (delivery is).", fix: "Send this week; the board clock only starts after contact." },
    { id: "BN-4", title: "Certification week owns July", severity: "MEDIUM", trigger: "2026-07-20 exam; no client delivery scheduled that week.", symptoms: "~1 week of delivery capacity removed from July.", workaround: "Front-load legal/outreach (non-delivery) work into that window.", fix: "Time-boxed; resolves 2026-07-20." },
    { id: "BN-5", title: "Blocked n8n workflows (11)", severity: "MEDIUM (internal only)", trigger: "Base44 Bearer creds missing; SCH-02 lane field absent; 4 orphan WIR-01 dupes.", symptoms: "Fusion AI automation not fully live.", rootCause: "Credential + schema config gaps.", workaround: "Manual processes hold.", fix: "Resolve creds, add lane field, remove dupes. Non-critical-path (internal tooling)." },
    { id: "BN-6", title: "Undecided platform/distribution choices", severity: "MEDIUM", trigger: "Load-Bearing platform and plugins distribution are both undecided.", symptoms: "Each blocks its own downstream (press; monetization). Neither blocks consulting revenue.", fix: "Decide when Phase 0\u20131 clears." },
  ],

  blindspots: [
    { id: "BS-1", title: "Uninsured free engagements carry the same liability as paid ones", severity: "HIGH", body: "Art and Ryan are free, but \u201Cfree\u201D does not remove professional-liability or IP exposure. An AI recommendation that harms a client's business is a claim risk whether or not money changed hands. The E&O gate is being treated as a paid-contract gate; it arguably should gate any delivery." },
    { id: "BS-2", title: "Employer IP claim is the real lane-separation threat", severity: "HIGH", body: "Lane separation is framed culturally (don't name the firm, don't touch its clients), but the binding threat is legal: a broad IP-assignment clause in the employment agreement. This is the one place the day-job can reach into Abstrekkt. B-4 addresses it; until cleared, it's an unpriced risk." },
    { id: "BS-3", title: "Client-delivered AI agents = new duty of care", severity: "HIGH", body: "The moment a client depends on an autonomous agent (HITL, approval queues, always-on), the org inherits monitoring, prompt-injection, model-fallback, and abuse-vector obligations it has no ops muscle for yet (no on-call, no alerting). The champion model's \u201Cexit the dependency\u201D partly mitigates this \u2014 but only if the workflows are truly handed off, not hosted by Kyle." },
    { id: "BS-4", title: "Case-study anonymity vs proof tension", severity: "MEDIUM", body: "Art must stay anonymous; Ryan is the only named case study. A pipeline that needs \u201C3 case studies to warm referrals\u201D while most clients require anonymity may starve the proof engine. Plan for anonymized-but-specific case studies, or secure naming consent up front." },
    { id: "BS-5", title: "Pricing floor vs first-client psychology", severity: "MEDIUM", body: "Holding $4,500 \u201Cwithout flinching\u201D on the first ever paid audit, with only one case study, is behaviorally hard. The risk is a quiet exception that breaks the model. Mitigation: the Ryan case study as proof + a scripted floor-hold, both of which exist." },
    { id: "BS-6", title: "Concentration risk on one provider", severity: "MEDIUM", body: "Anthropic is default provider, target Partner Network member, and the certification issuer. Heavy strategic concentration on one vendor. A pricing/policy/model change ripples across product, positioning, and credential simultaneously. No provider-abstraction layer exists." },
    { id: "BS-7", title: "chaosclub.co brand-rule exposure", severity: "MEDIUM", body: "A live public domain sharing a stem with a \u201Cmust never appear\u201D retired brand is a copy/brand-rule exposure if any external surface still says ChaosClub." },
    { id: "BS-8", title: "Solo continuity / bus factor", severity: "MEDIUM", body: "All operational knowledge, credentials, and client relationships sit with one person. The Claude project is the only continuity artifact. If Kyle is unavailable mid-engagement, there is no documented handoff for a live client." },
  ],

  failureModes: [
    {
      group: "Business / legal",
      rows: [
        { mode: "Client signed while uninsured", cause: "E&O not bound", impact: "Personal liability on a claim", detection: "Contract date vs binder date", recovery: "Bind before delivery; pause work", prevention: "Milestone-0 gate", residual: "LOW if gate held" },
        { mode: "Employer claims client IP", cause: "Broad employment IP clause", impact: "Lane breach, legal exposure", detection: "Attorney review flags it", recovery: "Renegotiate/carve-out; restructure", prevention: "B-4 before contracts", residual: "MED until cleared" },
        { mode: "Pricing floor collapses", cause: "First-client discount", impact: "Whole pricing model erodes", detection: "Signed audit < $4,500", recovery: "Document as isolated exception immediately", prevention: "Scripted floor-hold + proof", residual: "MED" },
        { mode: "Exception list grows", cause: "Second undocumented exception", impact: "Precedent set", detection: ">1 exception without boundary doc", recovery: "Write boundary doc; freeze list", prevention: "One-exception rule", residual: "LOW" },
      ],
    },
    {
      group: "Software / agent delivery",
      rows: [
        { mode: "Secret leaked to client bundle", cause: "Secret in frontend", impact: "Credential compromise", detection: "Code review / secret scan", recovery: "Rotate immediately; purge", prevention: "Server-side-only rule; scanning", residual: "LOW if enforced" },
        { mode: "RLS disabled/misconfigured", cause: "Bad migration", impact: "Cross-tenant data exposure", detection: "Supabase advisors / audit", recovery: "Re-enable; audit access", prevention: "Never-disable rule; review", residual: "MED (enforcement unverified)" },
        { mode: "Delivered agent takes harmful action", cause: "No HITL on consequential step", impact: "Client harm, liability", detection: "Client report (no telemetry)", recovery: "Kill switch (doesn't exist yet)", prevention: "HITL checkpoints; approval queue", residual: "HIGH until built" },
        { mode: "Prompt injection exfiltration", cause: "Unvalidated input", impact: "Data leak", detection: "Logging (partial)", recovery: "Incident response (none formal)", prevention: "Input validation; threat model", residual: "HIGH until built" },
        { mode: "n8n workflow silent failure", cause: "Blocked creds / bad idempotency", impact: "Stale/duplicate data", detection: "n8n run history; weekly check", recovery: "Re-run idempotent job", prevention: "Idempotency rule; Friday check", residual: "MED" },
        { mode: "Base44/n8n platform outage", cause: "Vendor downtime", impact: "Automation + app down", detection: "Vendor status page", recovery: "Manual fallback", prevention: "Export schemas/workflows to VC", residual: "MED" },
      ],
    },
    {
      group: "Content / continuity",
      rows: [
        { mode: "ChaosClub name appears externally", cause: "Stale asset / chaosclub.co copy", impact: "Brand-rule violation", detection: "External copy review", recovery: "Scrub asset", prevention: "Retire-name rule; C-3 resolution", residual: "LOW-MED" },
        { mode: "Register cross-pollination (memoir\u2194Load-Bearing)", cause: "Voice bleed", impact: "Both registers weakened", detection: "Editorial review", recovery: "Rewrite", prevention: "Hard separation rule", residual: "LOW" },
        { mode: "Solo continuity break", cause: "Kyle unavailable mid-engagement", impact: "Client stranded", detection: "Missed delivery", recovery: "Ad-hoc (none documented)", prevention: "Keep project current; contractor bench", residual: "MED" },
      ],
    },
  ],

  unknownUnknowns: [
    { id: "UU-1", technique: "Pre-mortem", title: "The legal gate never closed", body: "Kyle kept doing free work (Art, Ryan) because it felt productive, and the LLC/E&O/IP items stayed \u201Calmost done\u201D for six months. Warning: free engagements accumulate while B-1..B-5 stay open. Prevention: time-box Phase 0 to July; no new free engagement until gate closes. Contingency: hard-stop rule \u2014 one free engagement max until entity exists." },
    { id: "UU-2", technique: "Pre-mortem", title: "First floor-hold failed and cascaded", body: "The first paid prospect pushed, Kyle discounted, and every subsequent prospect referenced it. Warning: a discovery call where the floor gets hedged. Prevention: scripted floor-hold + Ryan case study as proof. Contingency: document any exception as isolated, in writing, same day." },
    { id: "UU-3", technique: "Dependency inversion", title: "Anthropic changes terms/pricing/Partner Network criteria", body: "Provider + credential + partner concentration means one change hits three things. Prevention: keep the champion-model IP provider-agnostic; design a provider-abstraction layer before scaling product. Contingency: the consulting offer survives a provider swap; the product line is more exposed." },
    { id: "UU-4", technique: "Dependency inversion", title: "Base44 or n8n cloud outage/discontinuation", body: "Fusion AI + automation both sit on hosted no-code platforms. Prevention: export entity schemas + workflow definitions to version control. Contingency: consulting continues; internal tooling degrades to manual." },
    { id: "UU-5", technique: "Scale test", title: "10x clients but still one deliverer", body: "The champion model is designed to exit dependency, but if handoffs are incomplete, Kyle becomes on-call for every past client. Prevention: enforce documented-workflow handoff as an acceptance criterion. Contingency: contractor bench." },
    { id: "UU-6", technique: "Hostile-user test", title: "Prompt injection / data exfiltration through a client-facing agent", body: "A malicious input causes a delivered agent to leak data or take a harmful action. Prevention: HITL on consequential actions; input validation; threat model before any client agent ships. Contingency: kill switch + incident comms plan (neither exists yet)." },
    { id: "UU-7", technique: "Operator test", title: "The ~101-entity Base44 schema with unknown dead entities", body: "A future operator (or Kyle in 6 months) can't tell which entities are live. Prevention: entity audit + dependency map now, while context exists." },
    { id: "UU-8", technique: "Handoff test", title: "Client relationships, pricing rationale, the day-job clearance terms", body: "These live only in Kyle's head. Prevention: the written clearance exists; ensure pricing rationale + client context are in the project, not memory." },
    { id: "UU-9", technique: "Cost test", title: "Model/API + hosted-platform costs scale silently with usage", body: "No unified cost view exists. Warning: monthly Anthropic/Supabase/Base44 bills. Prevention: the CFO ROI model being built for clients should also be pointed inward. Contingency: usage caps." },
    { id: "UU-10", technique: "Reality test", title: "The 30% ladder conversion is assumed, never observed", body: "Zero paid clients means zero conversion data. Prevention: treat the ladder as a hypothesis; instrument the first three audits. Contingency: renegotiate the gate sequence (not the floor) if conversion underperforms. [flashfusion-arc explicitly frames this as an assumption]" },
  ],

  openLoops: [
    { id: "OL-1", loop: "LLC filing confirmation", category: "Legal", whyOpen: "Requires IL SOS interactive search", canCloseNow: false, resolution: "Kyle runs search / files", owner: "Kyle" },
    { id: "OL-2", loop: "EIN", category: "Legal", whyOpen: "Depends on OL-1", canCloseNow: false, resolution: "irs.gov after filing", owner: "Kyle" },
    { id: "OL-3", loop: "Business bank account", category: "Legal", whyOpen: "Depends on OL-2", canCloseNow: false, resolution: "Open after EIN", owner: "Kyle" },
    { id: "OL-4", loop: "Employment-IP attorney review", category: "Legal", whyOpen: "Not engaged", canCloseNow: false, resolution: "Engage attorney; written opinion", owner: "Kyle" },
    { id: "OL-5", loop: "E&O binding", category: "Insurance", whyOpen: "Not started", canCloseNow: false, resolution: "Quote 4 providers; bind", owner: "Kyle" },
    { id: "OL-6", loop: "MSA/operating/IP-assignment review", category: "Legal", whyOpen: "Templates unreviewed", canCloseNow: false, resolution: "Attorney bundle", owner: "Kyle" },
    { id: "OL-7", loop: "Ryan boundary doc + $ reconciliation", category: "Business", whyOpen: "Not written; C-1 conflict", canCloseNow: "partial", resolution: "Write doc; pick free vs $3,000", owner: "Kyle" },
    { id: "OL-8", loop: "Union VP outreach", category: "Pipeline", whyOpen: "Not sent (overdue)", canCloseNow: false, resolution: "Send message now", owner: "Kyle" },
    { id: "OL-9", loop: "CLC first contact", category: "Pipeline", whyOpen: "Setup only, nothing sent", canCloseNow: false, resolution: "Send outreach", owner: "Kyle" },
    { id: "OL-10", loop: "Concurrent-engagement cap", category: "Strategy", whyOpen: "Undecided", canCloseNow: true, resolution: "Package recommends 3 \u2014 adopt cap=3", owner: "Kyle to ratify" },
    { id: "OL-11", loop: "Load-Bearing platform", category: "Content", whyOpen: "Criteria unwritten", canCloseNow: "partial", resolution: "Write criteria \u2192 choose", owner: "Kyle" },
    { id: "OL-12", loop: "plugins-plus distribution", category: "Product", whyOpen: "Undecided", canCloseNow: "partial", resolution: "Choose one path", owner: "Kyle" },
    { id: "OL-13", loop: "chaosclub.co naming vs retired brand", category: "Brand", whyOpen: "Ambiguous scope (C-3)", canCloseNow: false, resolution: "Confirm scope", owner: "Kyle" },
    { id: "OL-14", loop: "Certification public name", category: "Brand", whyOpen: "Naming drift (C-4)", canCloseNow: false, resolution: "Fix at 2026-07-20", owner: "Kyle" },
    { id: "OL-15", loop: "Fusion AI 11 n8n workflows", category: "Software", whyOpen: "Creds/schema gaps", canCloseNow: "partial", resolution: "Resolve creds; add SCH-02 lane; drop WIR dupes", owner: "Kyle" },
    { id: "OL-16", loop: "Dead-entity audit (~101)", category: "Software", whyOpen: "Not run", canCloseNow: true, resolution: "Cross-ref entities vs n8n/API; archive after confirm", owner: "Kyle" },
    { id: "OL-17", loop: "chaosclub.co Firebase\u2192Supabase", category: "Software", whyOpen: "Not costed", canCloseNow: true, resolution: "Go/no-go doc; don't migrate yet", owner: "Kyle" },
    { id: "OL-18", loop: "Ample / FissionPrompt scope", category: "Product", whyOpen: "Undocumented", canCloseNow: true, resolution: "Write one-pager or drop", owner: "Kyle" },
    { id: "OL-19", loop: "Home-dir global git repo", category: "Ops", whyOpen: "Structural debt", canCloseNow: true, resolution: "Safe un-init per runbook", owner: "Kyle" },
    { id: "OL-20", loop: "CFO/ROI cost model", category: "Product", whyOpen: "Requirement open", canCloseNow: true, resolution: "Build React artifact at client.flashfusion.co/roi", owner: "Kyle" },
    { id: "OL-21", loop: "Test suite + threat model + HITL enforcement", category: "Quality/Sec", whyOpen: "Absent", canCloseNow: true, resolution: "Add smoke tests, threat model, HITL checkpoints before client agents", owner: "Kyle" },
  ],
  openLoopsResolved: [
    "ChaosClub two-entity LLC plan \u2192 retired (C-2).",
    "Package scope/tier/audience \u2192 decided (D-P2, D-P5).",
    "Employment-IP review status \u2192 elevated to named blocker (D-P1).",
    "Ryan interim treatment \u2192 free pending reconciliation (D-P3).",
  ],
};
