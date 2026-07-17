/* Abstrekkt Operator Console — roadmap + recommended-path data. */
window.ConsoleData = window.ConsoleData || {};

window.ConsoleData.roadmap = {
  tldr: "Two-week critical path to \u201Csafe to earn,\u201D sequenced around the July 20 certification exam, then convert the overdue Union VP contact and hold the floor on the first paid audit. Everything else waits.",

  principle: "Per Kyle's decision defaults (Maintainability > Correctness > Security > \u2026) applied to a business rather than code, the ordering principle here is liability-first, then revenue, then product/content. You do not sign clients into personal-liability exposure to move faster.",

  recommendedPath: [
    { window: "Now \u2192 2026-07-19 (pre-exam)", n: 1, text: "Start the employment-IP review. Email an IL business attorney (goodcounsel / Airdo Werwas) to review the day-job employment agreement's IP-assignment clause \u2014 longest-lead, highest-consequence item.", flag: "BLOCKER \u2014 Security/legal" },
    { window: "Now \u2192 2026-07-19 (pre-exam)", n: 2, text: "Run the Illinois SOS entity search yourself (apps.ilsos.gov/businessentitysearch, search \u201CAbstrekkt\u201D and \u201CFlashFusion\u201D) and either confirm existing filing or file Articles of Organization ($150). Close the \u201Cforms-prepared vs filed\u201D ambiguity permanently." },
    { window: "Now \u2192 2026-07-19 (pre-exam)", n: 3, text: "Request E&O quotes from the four named providers (Munich Re aiSure, Armilla, Mayflower Specialty, Embroker). Binding can follow; getting quotes in flight now is the unblock." },
    { window: "2026-07-20 (exam) \u2192 07-26", n: 4, text: "Sit the CCA / CCA-F exam (Jul 20). No client delivery scheduled this week." },
    { window: "2026-07-20 (exam) \u2192 07-26", n: 5, text: "On pass: update credential status everywhere it is currently hedged (\u201Cpreparing for Anthropic certification\u201D \u2192 the confirmed claim). Not before." },
    { window: "Immediately, in parallel", n: 6, text: "Send the overdue Union VP outreach. Overdue since June 2026 and the largest single potential contract. The message can go now; delivery is not promised until board approval, so no legal gate blocks the outreach.", flag: "BOTTLENECK \u2014 single-person, decaying opportunity" },
    { window: "Immediately, in parallel", n: 7, text: "Write the Ryan boundary doc. Still owed per the instructions; the only thing that formally isolates Ryan as an exception rather than a precedent. Resolve the $3,000-vs-free contradiction while writing it." },
    { window: "After Milestone 0 closes", n: 8, text: "First paid audit at $4,500, no exception. Use the Ryan/Iron Horse case study as proof." },
    { window: "After Milestone 0 closes", n: 9, text: "Decide the concurrent-engagement cap (recommend 3) before CLC and Union both convert." },
  ],

  deferred: [
    "claude-code-plugins-plus distribution path.",
    "Load-Bearing platform selection + launch (note: this gates press outreach, not revenue).",
    "Fusion AI n8n unblock + entity audit (internal tooling, not client-facing revenue).",
    "chaosclub.co Firebase\u2192Supabase migration (design spike only; do not migrate).",
  ],

  abc: [
    { key: "A", label: "Consulting-first", recommended: true, body: "Close the gate, sell audits, fund everything else from services. Lowest capital risk, fastest cash, matches the KB's own roadmap.", tradeoff: "Kyle's time is the bottleneck; caps at ~3 concurrent." },
    { key: "B", label: "Product-first", recommended: false, body: "Push claude-code-plugins-plus / Fusion AI to market for scalable revenue. Higher margin ceiling (60\u201375% software margins cited) but distribution is unsolved and there is no evidence of paying product users.", tradeoff: "Longer to first dollar, more unsolved unknowns." },
    { key: "C", label: "Content-first", recommended: false, body: "Launch Load-Bearing, build audience, convert inbound.", tradeoff: "Slowest to revenue; platform undecided; audience-to-client conversion unproven." },
  ],
  abcVerdict: "Pick A. Justification: it is the only lane with live prospects, a priced offer, and a validated brand; B and C both have an unsolved go-to-market and no evidence of demand yet. A funds B and C without external capital.",

  phases: [
    {
      id: "Phase 0", name: "Unblock", window: "now \u2192 ~2026-07-31",
      goal: "Close Milestone 0 (safe to earn) and clear the pipeline's overdue items. Runs around the July 20 exam.",
      tasks: [
        "Start employment-IP attorney review (B-4).",
        "Request E&O quotes from all four providers (B-5).",
        "Run IL SOS search; file/confirm LLC (B-1) \u2192 EIN (B-2) \u2192 bank (B-3).",
        "Send overdue Union VP outreach.",
        "Write Ryan boundary doc; resolve free-vs-$3,000.",
        "Sit certification exam (2026-07-20); update credential status only on pass.",
      ],
      gate: "Milestone 0 checklist fully green; Union outreach sent; Ryan boundary filed.",
    },
    {
      id: "Phase 1", name: "First revenue", window: "Aug 2026",
      goal: "Maps to flashfusion-arc Q1 M1\u2013M2.",
      tasks: [
        "Confirm FreeAssessment flow end-to-end at audit.flashfusion.co.",
        "Deliver Ryan audit; capture artifacts; publish case study #1.",
        "Outreach to warm prospects with the Ryan case study attached (5 warm contacts).",
        "First discovery call \u2192 hold $4,500 floor without hedging \u2192 sign \u2192 deliver.",
      ],
      gate: "First paid audit at $4,500, no exception; case study #2 captured.",
    },
    {
      id: "Phase 2", name: "Motion proven", window: "Sep\u2013Oct 2026",
      goal: "Maps to flashfusion-arc Q1 M3.",
      tasks: [
        "Three audits delivered; three case studies banked; referral motion warm.",
        "Decide concurrent-engagement cap (recommend 3) before CLC + Union convert.",
        "CLC first contact + (if warm) first delivery \u2192 produces per-cohort pricing actuals for Union.",
      ],
      gate: "Audit\u2192sprint conversion observed on at least one client.",
    },
    {
      id: "Phase 3", name: "Scale the ladder", window: "Q4 2026",
      goal: "",
      tasks: [
        "Convert an audit to a sprint; a sprint toward a retainer.",
        "Union VP board proposal (post-actuals, post-credential).",
        "Formalize the 3-tier training curriculum as a priced SKU line.",
      ],
      gate: "First sprint or retainer signed.",
    },
  ],

  parallelTracks: [
    "Products: pick claude-code-plugins-plus distribution path; run Fusion AI dead-entity audit + unblock 11 n8n workflows.",
    "Content: write Load-Bearing platform criteria \u2192 choose \u2192 first public essay (gates press).",
    "Ops/workspace: resolve the global-git-repo home-directory issue; write the DigitalME workspace runbook.",
  ],
};
