/* Abstrekkt Operator Console — Milestone 0 tracker data.
   Checkbox state is interactive + persisted to localStorage by the screen component. */
window.ConsoleData = window.ConsoleData || {};

window.ConsoleData.tracker = {
  milestone0: {
    title: "Milestone 0 \u2014 \u201CSafe to earn\u201D",
    lead: "Because Abstrekkt is a multi-workstream org, \u201Cdone\u201D is defined per workstream and per near-term milestone, not globally. The binding near-term definition of done is first revenue, safely earned. Only after every item below is true and evidenced may a paid contract be signed.",
    items: [
      { id: "m0-1", text: "LLC filed \u2014 IL SOS entity search (apps.ilsos.gov/businessentitysearch) returns the entity as active, OR a filing confirmation email exists. Forms-prepared \u2260 done.", source: "instructions" },
      { id: "m0-2", text: "EIN issued \u2014 obtained from irs.gov after filing confirms.", source: "llc kit" },
      { id: "m0-3", text: "Business bank account open \u2014 dedicated, no commingling.", source: "llc kit" },
      { id: "m0-4", text: "Employment-IP cleared \u2014 attorney has confirmed the day-job employment agreement does not assign Abstrekkt/FlashFusion work to the employer; written opinion on file.", source: "llc kit" },
      { id: "m0-5", text: "E&O bound \u2014 Tech E&O with an affirmative-AI rider is bound (not quoted), from a provider that does not carry the industry-standard AI exclusion. Budget $2,000\u2013$3,500/yr.", source: "instructions" },
      { id: "m0-6", text: "MSA ready \u2014 a reviewed master services agreement template exists for client signature.", source: "llc kit" },
    ],
    note: "Free/case-study engagements (Art, Ryan) may proceed before this closes, but carry the un-mitigated IP and liability exposure noted in the risk register.",
  },

  blockers: [
    {
      id: "B-1", title: "LLC filing", state: "REQUIRES_VALIDATION",
      body: "Illinois LLC forms prepared (pre-filled portfolio with blank signature block, no SOS file number). No filing confirmation exists anywhere in the KB.",
      closeAction: "Kyle runs apps.ilsos.gov/businessentitysearch (search \u201CAbstrekkt\u201D and \u201CFlashFusion\u201D). If not present, file Articles of Organization ($150; +$100 for 24hr expedite).",
      owner: "Kyle (cannot be automated \u2014 interactive SOS form)", by: "2026-07-18",
      blocks: "EIN, bank, Partner Network, every paid contract.",
    },
    {
      id: "B-2", title: "EIN", state: "MISSING",
      body: "Fast once B-1 is done.",
      closeAction: "irs.gov, ~10 min, free, same day as filing confirmation.",
      owner: "Kyle", by: "After B-1",
      blocks: "Business bank account.",
    },
    {
      id: "B-3", title: "Business bank account", state: "MISSING",
      body: "No commingling of personal/business funds.",
      closeAction: "Open immediately after EIN.",
      owner: "Kyle", by: "After B-2",
      blocks: "Clean accounting; a precondition ops expects before signing.",
    },
    {
      id: "B-4", title: "Employment-IP review", state: "REQUIRES_VALIDATION", highlight: true,
      body: "The LLC kit explicitly says \u201CDo not sign client contracts before the employment IP review is complete\u201D and \u201CAttorney reviews employment agreement \u2014 IP assignment language confirmed.\u201D If the day-job agreement assigns inventions/IP broadly, work done for FlashFusion clients could be claimed by the employer \u2014 a direct hit to lane separation and a personal-liability event.",
      closeAction: "Engage an IL business attorney (kit names goodcounsel / Airdo Werwas) to review the employment agreement's IP-assignment clause; get a written opinion. Bundle with operating agreement + IP assignment + MSA review (cheaper than piecemeal).",
      owner: "Kyle + attorney", by: "Start immediately \u2014 longest lead time",
      blocks: "All client contracts \u2014 paid and arguably the free ones too.",
    },
    {
      id: "B-5", title: "E&O insurance w/ affirmative-AI rider", state: "MISSING",
      body: "Standard Tech E&O carries absolute AI exclusions industry-wide since 2026-01-01 (ISO forms CG 40 47/48). A standard policy does not cover this business.",
      closeAction: "Request quotes from Munich Re aiSure, Armilla, Mayflower Specialty, Embroker; bind before first paid contract. Budget $2,000\u2013$3,500/yr.",
      owner: "Kyle", by: "Quotes in flight this week; bound before signing anyone",
      blocks: "Every paid (and arguably free) delivery.",
    },
  ],

  supportingArtifacts: [
    "Reviewed MSA template for client signature.",
    "Signed Operating Agreement + IP Assignment Agreement (assigns pre-formation work to the LLC \u2014 \u201Cwithout this, the LLC owns nothing\u201D).",
  ],

  sequencing: "Today:         start B-4 (attorney) + B-5 (E&O quotes)  \u2014 parallel, longest leads\nBy 2026-07-18: B-1 (file/confirm LLC)\nSame day:      B-2 (EIN)\nThen:          B-3 (bank)\nBefore signing anyone: B-4 clear + B-5 bound + MSA ready",

  milestone1: {
    title: "Milestone 1 \u2014 \u201CRevenue validated\u201D",
    lead: "Done when: first paid audit signed and delivered at the $4,500 floor with no exception, and case study captured.",
    items: [
      { id: "m1-1", text: "Signed audit engagement at exactly $4,500 \u2014 no discount, no exception." },
      { id: "m1-2", text: "Audit delivered; deliverable artifacts captured." },
      { id: "m1-3", text: "Case study #1 drafted + permission secured + published (audit.flashfusion.co)." },
    ],
  },

  milestone2: {
    title: "Milestone 2 \u2014 \u201CMotion proven\u201D",
    lead: "Done when: three audits delivered, three case studies banked, referral motion warm; audit\u2192sprint conversion observed.",
  },

  ryan: {
    title: "Ryan / Iron Horse (active)",
    items: [
      { id: "ryan-1", text: "Boundary doc written that (a) isolates Ryan as exception, not precedent, and (b) resolves the free-vs-$3,000 amount." },
      { id: "ryan-2", text: "Named case study + testimonial delivered; conversion-to-paid gate defined." },
      { id: "ryan-3", text: "No mention of the consulting relationship in any Iron Horse client-facing copy." },
    ],
  },

  union: {
    title: "Union VP (pre-outreach)",
    items: [
      { id: "union-1", text: "Initial outreach message sent (overdue)." },
      { id: "union-2", text: "If board presentation requested pre-2026-07-20: scoped to honestly-statable claims only; credential hedged as \u201Cpreparing for.\u201D" },
      { id: "union-3", text: "Board proposal carries exactly one ask with a date." },
    ],
  },

  nonGoals: [
    "Co-founders or partners (solo by rule; partner only on an offer heavily in Kyle's favor).",
    "Naming the day-job employer anywhere external.",
    "Claiming the Anthropic certification before the 2026-07-20 pass.",
    "Growing the pricing-floor exception list beyond its single documented exception without a written boundary doc.",
  ],
};
