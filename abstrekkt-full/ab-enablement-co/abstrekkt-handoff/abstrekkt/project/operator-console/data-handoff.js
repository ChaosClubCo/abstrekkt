/* Abstrekkt Operator Console — source-of-truth, inventory, superseded material, handoff data. */
window.ConsoleData = window.ConsoleData || {};

window.ConsoleData.handoff = {
  sourceOfTruth: {
    governing: "\u201CAbstrekkt \u2014 Project Instructions\u201D (updated 2026-07-07) is the top authority for org structure, brand, founder facts, pricing rules, pipeline state, and the retirement of ChaosClub* names. Where any artifact conflicts with it, the instructions win \u2014 except where an artifact contains a specific operational detail the instructions omit (e.g. the employment-IP review in the LLC kit), in which case the artifact supplements rather than contradicts.",
    table: [
      { topic: "Org structure, brand, founder rules", authoritative: "Project instructions (2026-07-07)", superseded: "Any doc naming ChaosClubCo/Chaos Collective as live" },
      { topic: "Pricing floor + ladder + $222K target", authoritative: "the-flashfusion-arc.jsx (consistent w/ instructions)", superseded: "\u2014" },
      { topic: "Ryan engagement terms", authoritative: "RYAN_IRONHORSE_PROJECT_KNOWLEDGE.md + instructions (free trade)", superseded: "! the-flashfusion-arc.jsx (\u201C$3,000\u201D)" },
      { topic: "LLC filing procedure", authoritative: "llc-formation-kit-v2.html", superseded: "\u2014" },
      { topic: "LLC filing status", authoritative: "Project instructions (\u201Cprepared, not filed\u201D)", superseded: "! llc kit implies readiness to file two entities" },
      { topic: "Two-entity structure", authoritative: "Instructions \u2014 single Abstrekkt parent; ChaosClub retired", superseded: "! llc kit's \u201Ctwo LLCs: FlashFusion + Chaos Club Co.\u201D" },
      { topic: "Employment-IP review requirement", authoritative: "llc-formation-kit-v2.html (only place it appears)", superseded: "Instructions (omits it) \u2014 supplement, not conflict" },
      { topic: "E&O requirement + providers", authoritative: "Project instructions + UNION_VP doc", superseded: "\u2014" },
      { topic: "Union VP engagement", authoritative: "UNION_VP_PROJECT_INSTRUCTIONS_AND_KNOWLEDGE.md", superseded: "\u2014" },
      { topic: "Software stack", authoritative: "AGENTS.md + WorkstreamMapper.jsx", superseded: "\u2014" },
      { topic: "Fusion AI entity/workflow state", authoritative: "WorkstreamMapper.jsx", superseded: "\u2014" },
      { topic: "Certification status/name", authoritative: "Project instructions (\u201CClaude Certified Architect,\u201D Jul 20)", superseded: "\u201CCCA-F\u201D / \u201CAnthropic Academy cert\u201D naming in other docs \u2014 reconcile the name" },
    ],
    reconciliation: [
      "Certification is called \u201CClaude Certified Architect (CCA)\u201D in the instructions and \u201CCCA-F\u201D / \u201CAnthropic Academy certification\u201D in the Union and LLC docs. Treat as the same credential; confirm the exact public name before claiming it post-pass.",
      "chaosclub.co (active peer-support app in the stack) vs the retired ChaosClubCo brand: these appear to be different things sharing a stem. Confirm whether the live domain must be renamed/retired externally.",
    ],
  },

  inventory: {
    lead: "Sampled inventory of the highest-authority docs in the 225-doc KB, plus the categories present. Sampled, not exhaustive.",
    groups: [
      { group: "Governance / instructions", rows: [
        { id: "G1", doc: "Abstrekkt \u2014 Project Instructions (2026-07-07)", status: "CONFIRMED_CURRENT", authority: "GOVERNING", disposition: "Keep as top authority" },
        { id: "G2", doc: "AGENTS.md / CLAUDE.md / CONTEXT.md / MEMORY.md", status: "PARTIALLY_COMPLETE", authority: "HIGH", disposition: "Keep; stack + working rules" },
      ]},
      { group: "Business / consulting (FlashFusion)", rows: [
        { id: "B1", doc: "the-flashfusion-arc.jsx", status: "CONFIRMED_CURRENT", authority: "HIGH", disposition: "Keep; pricing + roadmap source. Resolve Ryan $ conflict." },
        { id: "B2", doc: "RYAN_IRONHORSE_PROJECT_KNOWLEDGE.md", status: "CONFIRMED_CURRENT", authority: "HIGH", disposition: "Keep; active engagement" },
        { id: "B3", doc: "UNION_VP_PROJECT_INSTRUCTIONS_AND_KNOWLEDGE.md", status: "CONFIRMED_CURRENT", authority: "HIGH", disposition: "Keep; act on overdue outreach" },
        { id: "B4", doc: "CLC_PROJECT_INSTRUCTIONS.md", status: "DRAFT (setup only)", authority: "MEDIUM", disposition: "Keep; nothing sent yet" },
        { id: "B5", doc: "WorkstreamMapper.jsx", status: "PARTIALLY_COMPLETE", authority: "MEDIUM", disposition: "Keep; workstream + blocker map" },
        { id: "B6", doc: "teaching-curriculum-arc.jsx", status: "DRAFT", authority: "MEDIUM", disposition: "Keep; 3-tier training product design" },
        { id: "B7", doc: "blog-posts-agentic-ai.md / ff-agentic-os-article.html", status: "DRAFT", authority: "LOW", disposition: "Keep; positioning content" },
      ]},
      { group: "Legal / entity / risk", rows: [
        { id: "L1", doc: "llc-formation-kit-v2.html", status: "SUPERSEDED (partial)", authority: "MEDIUM", disposition: "Keep procedure; retire two-entity/Chaos-Club framing" },
        { id: "L2", doc: "Illinois LLC Pre-Filled Forms Portfolio", status: "REQUIRES_VALIDATION", authority: "MEDIUM", disposition: "Forms only; blank signature block" },
        { id: "L3", doc: "E&O / insurance docs", status: "MISSING", authority: "\u2014", disposition: "Does not exist; must be created" },
      ]},
      { group: "Software / product", rows: [
        { id: "S1", doc: "AGENTS.md (stack + hard rules)", status: "CONFIRMED_CURRENT", authority: "HIGH", disposition: "Keep" },
        { id: "S2", doc: "Fusion AI (Base44 app, ~101 entities)", status: "PARTIALLY_COMPLETE", authority: "MEDIUM", disposition: "11 n8n workflows blocked" },
        { id: "S3", doc: "claude-code-plugins-plus (244 plugins)", status: "BUILT / DRAFT dist", authority: "MEDIUM", disposition: "Distribution undecided" },
        { id: "S4", doc: "chaosclub.co peer-support app", status: "PARTIALLY_COMPLETE", authority: "LOW", disposition: "Firebase; migration is design-spike only" },
        { id: "S5", doc: "Ample, FissionPrompt", status: "UNKNOWN", authority: "LOW", disposition: "Named only; little detail sampled" },
      ]},
      { group: "Content / media / memoir", rows: [
        { id: "C1", doc: "Load-Bearing newsletter (lb-essay-*.html)", status: "DRAFT", authority: "MEDIUM", disposition: "No public URL; platform undecided" },
        { id: "C2", doc: "Tax the Damage memoir (sudowrite_*, memoir-*.docx, *.txt arcs)", status: "ACTIVE DRAFT", authority: "HIGH (own register)", disposition: "Out of scope here by design" },
        { id: "C3", doc: "Grant/partner apps (01/02/03-*.md)", status: "DRAFT", authority: "LOW", disposition: "Anthropic Partner Network gated on LLC+cert" },
      ]},
    ],
    categoriesPresent: "Instructions \u2713 \u00B7 Business reqs \u2713 \u00B7 Technical reqs \u2713 (AGENTS.md) \u00B7 Architecture \u2713 \u00B7 Data models \u2713 (Base44 entities) \u00B7 APIs/integrations \u2713 \u00B7 Source code \u2713 (.jsx artifacts) \u00B7 Config \u2713 \u00B7 Security controls ~partial \u00B7 Deployment ~partial \u00B7 Testing/QA \u2717 (little evidence) \u00B7 Designs/visual \u2713 (tokens) \u00B7 Prompts/AI workflows \u2713 \u00B7 Research \u2713 \u00B7 Decisions \u2713 (MEMORY.md) \u00B7 Risks ~partial \u00B7 Open questions \u2713 \u00B7 Deprecated material \u2713 (ChaosClub, llc kit)",
    missingArtifacts: "E&O policy, signed MSA, filed Articles, test suite, threat model, Load-Bearing live URL.",
  },

  superseded: [
    { title: "ChaosClubCo / Chaos Collective branding", scope: "SUPERSEDED (whole)", supersededBy: "Abstrekkt (project instructions, 2026-07-07).", why: "Abstrekkt fully absorbs and retires these names; they \u201Cmust never appear in new external copy or be re-brainstormed.\u201D", residue: "The rose accent #e11d48 (ChaosClubCo's) is permanently retired and does not carry forward. Any artifact using it is stale.", action: "Treat any doc presenting ChaosClub* as a live brand as historical." },
    { title: "llc-formation-kit-v2.html", scope: "SUPERSEDED (partial)", stillValid: "The procedure \u2014 IL Articles of Organization at ilsos.gov ($150), EIN at irs.gov (free), dedicated bank account, operating agreement, IP assignment agreement, and the employment-IP attorney review (the most valuable thing in it, elevated in this package).", superseded: "The two-entity structure (\u201CFlashFusion LLC\u201D + \u201CChaos Club Co. LLC\u201D). ChaosClub is retired; there is no second education entity by that name in the current org.", action: "Use the kit's checklists and templates; ignore its Chaos-Club entity plan." },
    { title: "\u201CTwo-LLC\u201D liability framing", scope: "SUPERSEDED", why: "The kit's argument for isolating a CLC/education entity from FlashFusion still has logical merit (isolate education/partnership liability from client-contract liability) but no longer maps to a real second entity. If CLC becomes a formal partnership, revisit the principle with a current entity name." },
    { title: "Stale certification naming", scope: "REQUIRES_VALIDATION", why: "Multiple names in flight (\u201CClaude Certified Architect / CCA\u201D, \u201CCCA-F\u201D, \u201CAnthropic Academy certification\u201D). Not superseded, but unreconciled. Confirm the exact public credential name at pass (2026-07-20) before using any of them externally." },
  ],
  supersededNote: "Not superseded (common misread): chaosclub.co the live peer-support app is not the same as the retired ChaosClubCo brand and is not automatically retired by the branding decision. Its external naming is an open question, not a settled retirement.",

  validation: {
    verdict: "Package is complete and internally validated at the Complete tier. Safe to hand to Kyle or another model. It does not \u2014 and cannot \u2014 close the external legal/insurance blockers; those are correctly represented as open and owned by Kyle.",
    audits: [
      { area: "Coverage", result: "PASS with caveat", note: "Governing instructions + 6 highest-authority docs read and cited; 225-doc KB was a targeted sample, not exhaustive. Confidence the revenue-critical picture is complete: High. Confidence nothing material hides in the unsampled 200: Medium." },
      { area: "Accuracy", result: "PASS", note: "Every factual claim carries [SOURCED]/[GENERATED]; facts vs recommendations separated; 4 contradictions logged with classification + resolution; unsupported assumptions flagged." },
      { area: "Completeness", result: "PASS", note: "Every file substantive, no placeholders (LLC-kit template fields are quoted source, not package output); internal cross-references resolve; continuation-ready." },
      { area: "Technical", result: "PASS with noted gaps", note: "Architecture/implementation internally consistent; environment/deployment/security flagged where unverified (RLS enforcement, HITL, test suite); acceptance criteria binary and checkable." },
      { area: "Handoff", result: "PASS", note: "New operator can understand it (Next Operator Brief); new model can continue it (Continuation Prompt); next action unambiguous; external Kyle-only dependencies clearly separated." },
      { area: "Artifact", result: "PASS", note: "File names/paths valid; no secrets/keys/tokens in package-authored files; no client-identifying info beyond consented Ryan/Iron Horse; no empty/duplicated files." },
    ],
    confidence: [
      { area: "Revenue-critical picture (offer, pricing, pipeline, blockers)", level: "High" },
      { area: "Software line detail", level: "Medium" },
      { area: "Content/memoir/products detail", level: "Low\u2013Medium" },
    ],
    limitations: [
      "Sampled KB read \u2014 a full 225-doc pass could surface additional detail, especially in the software and content lines.",
      "Live external status (LLC filing, E&O, IP review, certification) is reported as the KB states it \u2014 unconfirmed. No live Drive/SOS/IRS/broker access was used.",
      "Software readiness is assessed from documents, not by executing any repo.",
    ],
  },

  nextOperatorBrief: {
    forWhom: "For a human (Kyle, or a delegate/contractor) picking this up cold.",
    whatThisIs: "A one-person AI-enablement consultancy (FlashFusion, under the Abstrekkt parent). It teaches domain experts to run AI in their own field, then hands off. It has an offer, a brand, a tech stack, and warm prospects \u2014 and has not yet earned money.",
    theOneThing: "Close the gate to earning safely. Nothing else moves the needle until this is done: (1) Get a lawyer to confirm your day-job contract doesn't own your FlashFusion work. (2) Confirm/file the LLC (run the Illinois SOS search yourself), then EIN, then a business bank account. (3) Get E&O insurance with an AI rider (standard policies now exclude AI). Quote Munich Re aiSure, Armilla, Mayflower, Embroker \u2014 budget $2\u20133.5K/yr. (4) Have a reviewed MSA ready before anyone signs. Until those are done, do not sign a paying client. The two free engagements (Art, Ryan) can continue, but understand they carry liability that insurance would otherwise cover.",
    timeSensitive: [
      "Send the Union VP outreach \u2014 it's overdue and it's the biggest potential contract. The board clock (30\u201390 days) only starts once contact is made.",
      "July 20 certification exam \u2014 sit it; don't schedule client work that week; don't claim the credential until passed.",
    ],
    doNot: [
      "Don't chase product distribution (the 244 plugins) or launch the newsletter yet \u2014 they don't produce revenue and they'll eat the time needed for the gate.",
      "Don't discount the first audit. $4,500 is the floor. Use the Ryan/Iron Horse case study as proof.",
      "Don't let the \u201CRyan is free vs Ryan is $3,000\u201D ambiguity linger \u2014 pin it down in the boundary doc already owed.",
      "Don't name your employer anywhere. Don't reuse the ChaosClub names.",
    ],
    whereEverythingIs: "This package. Start with RECOMMENDED_PATH.md and PRE_REVENUE_BLOCKERS.md. The living knowledge base is the Claude project (225 docs).",
    doneWithPhase0: "Every box in the Milestone 0 tracker (this console) is checked with evidence. Then sell the first audit.",
  },

  continuation: {
    rules: [
      "Preserve existing decisions unless you have new evidence that warrants change; if you change one, log it in the decision log with rationale.",
      "Do not reopen resolved questions (see Decision Log and Open-Loop Register \u201Cresolutions closed\u201D).",
      "Continue from the documented current state and the \u201Cremaining work\u201D list \u2014 do not re-run discovery.",
      "Validate before modifying anything; confirm a fact against a named source before asserting it.",
      "Produce complete outputs, never placeholders or TODO stubs. If data is missing, surface the gap explicitly.",
      "Tag every factual claim [SOURCED] or [GENERATED]; prefix contradictions with !. Maintain the CLAIMS/GAPS footers Kyle expects on substantive deliverables.",
      "Record any new decisions and assumptions; update the open-loop and risk registers when state changes.",
      "Maintain compatibility across Claude / ChatGPT / Gemini (no platform-specific assumptions).",
    ],
    prohibited: [
      "Do NOT assume the LLC is filed, E&O is bound, the employment-IP review is done, or the certification is passed \u2014 all are open as of 2026-07-11.",
      "Do NOT invent clients, revenue, dates, approvals, or metrics.",
      "Do NOT resurface ChaosClubCo / Chaos Collective names.",
      "Do NOT name the day-job employer.",
      "Do NOT present \u201C240+\u201D tools as mastered (~30 hands-on is the real number).",
    ],
    standingContradictions: "Ryan exception free-vs-$3,000 (treat as free pending the boundary doc); \u201CChaos Club Co. LLC\u201D in the LLC kit is obsolete; chaosclub.co naming vs the retired brand is an open question; certification name drift.",
    firstAction: "Confirm the current state of the pre-revenue blockers with Kyle (has the IL SOS search been run? is the attorney engaged? are E&O quotes in?), then help with whichever \u201Cremaining work\u201D item is next. Do not schedule client delivery in the week of 2026-07-20 (certification exam).",
    workingStyle: "TL;DR first, direct, no filler, pushback expected. Architecture before features. Production-ready output only. Patch/extend existing artifacts; don't rebuild from scratch.",
  },

  modelContextCompact: "As of 2026-07-11. Booked revenue: $0.\n\nOrg: Abstrekkt = solo-founder (Kyle Rosebrook, Grayslake IL) parent org; retires ChaosClubCo/Chaos Collective (never reuse). FlashFusion (flashfusion.co) = revenue engine: B2B AI enablement, champion model (train one domain expert per vertical, document, exit). Ladder: audit $4,500 floor \u2192 sprint \u2192 retainer \u2192 vCAIO; training per-cohort/seat.\n\nState: Brand locked, offer defined, stack built, pipeline live \u2014 but cannot earn yet. Blocked by: (1) LLC filing unconfirmed, (2) E&O w/ affirmative-AI rider not started, (3) employment-IP attorney review not done. Active free engagements: Art (anon), Ryan/Iron Horse (case-study trade). Union VP outreach overdue (largest contract). Cert exam 2026-07-20 \u2014 don't claim before pass.\n\nStack: TS/React19/Vite \u00B7 Supabase(RLS) \u00B7 Cloudflare \u00B7 n8n \u00B7 Base44 \u00B7 Stripe \u00B7 Anthropic API (sonnet-4-6 default). chaosclub.co on Firebase (outlier). Fusion AI ~101 entities, 11 n8n workflows blocked.\n\nHard rules: No paid contract before Milestone 0 (LLC+EIN+bank+IP+E&O+MSA). $4,500 floor structural; one exception max (Ryan) w/o boundary doc. Solo. Absolute day-job lane separation. No degree/cert overclaim. Secrets server-side only; never disable RLS; migrations immutable. ~30 tools hands-on (\u201C240+\u201D=catalogued, not mastered).\n\nContradictions (keep open): ! Ryan free (instructions) vs $3,000 (arc) \u2192 treat free pending boundary doc. ! \u201CChaos Club Co. LLC\u201D in LLC kit = obsolete. ! chaosclub.co domain vs retired brand = open. Cert name drift (CCA/CCA-F).\n\nNext 7 (priority): 1) engage attorney for employment-IP review; 2) run IL SOS search / file LLC \u2192 EIN \u2192 bank; 3) get E&O quotes (Munich Re aiSure/Armilla/Mayflower/Embroker, $2\u20133.5K/yr) \u2192 bind; 4) send Union VP outreach; 5) write Ryan boundary doc (+resolve $); 6) exam 07-20; 7) first paid audit at $4,500 no exception. Then: set concurrent cap=3, contact CLC; product/content tracks trail revenue.\n\nSource of truth: \u201CAbstrekkt \u2014 Project Instructions\u201D (2026-07-07) governs; outranks older artifacts. Do not assume LLC/E&O/IP/cert are done. Don't invent clients/revenue/dates.",
};
