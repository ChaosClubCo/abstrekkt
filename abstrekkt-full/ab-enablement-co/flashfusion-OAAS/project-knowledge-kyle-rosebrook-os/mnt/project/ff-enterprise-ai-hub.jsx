import { useState } from "react";

const ACCENT = "#C9A84C";
const BG = "#0E0E0E";
const SURFACE = "#161616";
const BORDER = "#2A2A2A";
const TEXT = "#E8E0D0";
const MUTED = "#7A7060";

const styles = {
  root: {
    fontFamily: "'Playfair Display', Georgia, serif",
    background: BG,
    color: TEXT,
    minHeight: "100vh",
    maxWidth: 780,
    margin: "0 auto",
    padding: "48px 24px 96px",
  },
  label: {
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: ACCENT,
    marginBottom: 8,
  },
  sectionDivider: {
    borderTop: `1px solid ${BORDER}`,
    margin: "48px 0",
  },
  popoutBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: SURFACE,
    border: `1px solid ${BORDER}`,
    borderLeft: `3px solid ${ACCENT}`,
    padding: "14px 20px",
    cursor: "pointer",
    marginBottom: 2,
    transition: "border-color 0.15s",
  },
  popoutTitle: {
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: TEXT,
  },
  popoutChevron: {
    fontFamily: "monospace",
    color: ACCENT,
    fontSize: 14,
    transition: "transform 0.2s",
  },
  popoutBody: {
    background: "#121212",
    border: `1px solid ${BORDER}`,
    borderTop: "none",
    padding: "28px 24px",
    marginBottom: 16,
  },
  h2: {
    fontSize: 26,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 12,
    color: TEXT,
  },
  h3: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 10,
    marginTop: 28,
    color: TEXT,
  },
  p: {
    fontSize: 15,
    lineHeight: 1.75,
    color: "#C8BFA8",
    marginBottom: 16,
  },
  mono: {
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 11,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
    fontSize: 13,
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: `1px solid ${BORDER}`,
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: ACCENT,
  },
  td: {
    padding: "10px 12px",
    borderBottom: `1px solid ${BORDER}`,
    color: "#C8BFA8",
    lineHeight: 1.5,
    verticalAlign: "top",
  },
  callout: {
    background: SURFACE,
    border: `1px solid ${BORDER}`,
    borderLeft: `3px solid ${ACCENT}`,
    padding: "16px 20px",
    marginBottom: 20,
    fontSize: 14,
    color: "#C8BFA8",
    lineHeight: 1.65,
  },
  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    padding: "10px 14px",
    background: SURFACE,
    border: `1px solid ${BORDER}`,
  },
  scoreLabel: {
    flex: 1,
    fontSize: 13,
    color: TEXT,
  },
  scorePips: {
    display: "flex",
    gap: 4,
  },
  pill: {
    display: "inline-block",
    padding: "3px 10px",
    border: `1px solid ${ACCENT}`,
    color: ACCENT,
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 11,
    marginRight: 6,
    marginBottom: 6,
    letterSpacing: "0.08em",
  },
  pillFill: {
    display: "inline-block",
    padding: "3px 10px",
    background: ACCENT,
    color: "#0E0E0E",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 11,
    marginRight: 6,
    marginBottom: 6,
    fontWeight: 700,
    letterSpacing: "0.08em",
  },
  cta: {
    display: "block",
    padding: "14px 24px",
    background: ACCENT,
    color: "#0E0E0E",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    textDecoration: "none",
    fontWeight: 700,
    marginTop: 20,
    textAlign: "center",
    cursor: "pointer",
    border: "none",
    width: "100%",
  },
};

function Popout({ label, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        style={{ ...styles.popoutBar, borderLeftColor: open ? ACCENT : "#3A3A3A" }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div>
          <div style={{ ...styles.label, marginBottom: 2 }}>{label}</div>
          <div style={styles.popoutTitle}>{title}</div>
        </div>
        <div style={{ ...styles.popoutChevron, transform: open ? "rotate(90deg)" : "none" }}>▶</div>
      </div>
      {open && (
        <div style={styles.popoutBody}>
          {children}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score, max = 2 }) {
  return (
    <div style={styles.scoreRow}>
      <div style={styles.scoreLabel}>{label}</div>
      <div style={styles.scorePips}>
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              background: i < score ? ACCENT : "#2A2A2A",
              border: `1px solid ${i < score ? ACCENT : "#3A3A3A"}`,
            }}
          />
        ))}
      </div>
      <div style={{ ...styles.mono, color: MUTED, width: 36, textAlign: "right" }}>
        {score}/{max}
      </div>
    </div>
  );
}

// ─── SUB-PAGE COMPONENTS ─────────────────────────────────────────────────────

function WhereMoneyWontGo() {
  return (
    <>
      <div style={styles.h2}>Where the Money Won't Go</div>
      <div style={styles.p}>
        Anthropic's new services firm is valued at $1.5B and backed by Blackstone, Goldman Sachs, and Hellman &amp; Friedman. OpenAI countered with DeployCo at $10B. Both are positioning as forward-deployed engineers for enterprise.
      </div>
      <div style={styles.p}>
        Neither of them is coming for your client.
      </div>
      <div style={styles.callout}>
        The "mid-market" these firms are targeting means healthcare systems, regional banks, mid-sized manufacturers — companies with $100M–$500M+ in revenue, existing IT infrastructure, and a CISO who signs off on software procurement. A regional health system with 800 employees qualifies. A 25-person professional services firm does not.
      </div>
      <div style={styles.h3}>The Actual Gap</div>
      <div style={styles.p}>
        The segment between "approved ChatGPT Enterprise and called it a strategy" and "has dedicated AI engineering capacity" spans roughly 95% of American businesses by count and maybe 40% by revenue. Anthropic's venture isn't staffed to touch it. Accenture and Deloitte are structurally incapable of being price-competitive in it.
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Segment</th>
            <th style={styles.th}>Who Serves Them</th>
            <th style={styles.th}>Gap</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Fortune 500 / Global 2000", "Accenture, Deloitte, PWC, IBM", "Fully served. Expensive."],
            ["$100M–$500M mid-market", "Anthropic JV, OpenAI DeployCo (new)", "Being targeted now"],
            ["$5M–$100M SMB / mid-market", "No one at scale", "← This is the gap"],
            ["Sub-$5M / solo / startup", "DIY, Fiverr, ChatGPT", "Wrong direction entirely"],
          ].map(([seg, who, gap], i) => (
            <tr key={i}>
              <td style={styles.td}>{seg}</td>
              <td style={styles.td}>{who}</td>
              <td style={{ ...styles.td, color: i === 2 ? ACCENT : "#C8BFA8" }}>{gap}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.p}>
        The companies in that gap have enough operating complexity to benefit from production AI. They have workflows worth automating — support queues, invoice processing, onboarding flows, compliance checklists. They don't have an AI team. They don't have a $150K consulting budget. And every week the companies above them in the table pull further ahead.
      </div>
      <div style={styles.p}>
        That's the market. Not because Anthropic is ignoring it — because their delivery model structurally can't reach it. A venture with forward-deployed engineers needs six-figure engagement minimums to justify the cost structure. The $20M manufacturing firm can't afford that and doesn't need 80% of it anyway.
      </div>
      <div style={styles.callout}>
        What they need is a fixed-scope, fast-delivery engagement that produces one working workflow with a measurable outcome. That's a different product than what either JV is selling.
      </div>
    </>
  );
}

function TheAudit() {
  const [scores, setScores] = useState({
    data: 0, role: 0, review: 0, metric: 0, feedback: 0, change: 0,
  });
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const dims = [
    { key: "data", label: "Data access & permissions" },
    { key: "role", label: "Role & process definition" },
    { key: "review", label: "Review & override architecture" },
    { key: "metric", label: "Success metric with baseline" },
    { key: "feedback", label: "Feedback loop & eval harness" },
    { key: "change", label: "Change management & adoption" },
  ];

  const band = total >= 10 ? { label: "PRODUCTION-READY", color: ACCENT }
    : total >= 7 ? { label: "CLOSE — TWO FIXES", color: "#8BB87A" }
    : total >= 4 ? { label: "PILOT PURGATORY", color: "#D4A96A" }
    : { label: "DEMO, NOT DEPLOYMENT", color: "#C96A6A" };

  return (
    <>
      <div style={styles.h2}>The Implementation Architecture Audit</div>
      <div style={styles.p}>
        Six components separate a production AI workflow from a demo. Score each 0–2. Anything below 8 means you're pitching experiments, not systems.
      </div>
      <div style={styles.p}>
        This is the interactive version of the audit table from the main article. Use it in a discovery call or as a self-assessment before an engagement.
      </div>

      {dims.map(({ key, label }) => (
        <div key={key} style={{ marginBottom: 6 }}>
          <div style={{ ...styles.mono, color: MUTED, marginBottom: 4, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2].map((val) => (
              <button
                key={val}
                onClick={() => setScores((s) => ({ ...s, [key]: val }))}
                style={{
                  width: 44,
                  height: 36,
                  background: scores[key] === val ? ACCENT : SURFACE,
                  color: scores[key] === val ? "#0E0E0E" : MUTED,
                  border: `1px solid ${scores[key] === val ? ACCENT : BORDER}`,
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  fontWeight: scores[key] === val ? 700 : 400,
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ ...styles.callout, marginTop: 24, borderLeftColor: band.color }}>
        <div style={{ ...styles.mono, color: band.color, fontSize: 12, marginBottom: 6 }}>SCORE: {total} / 12 — {band.label}</div>
        <div style={{ fontSize: 13, color: "#C8BFA8" }}>
          {total >= 10 && "You've built a system, not a demo. Document the metrics and build the case study."}
          {total >= 7 && total < 10 && "Two or three components are weak. Fix the lowest scores before scaling the engagement."}
          {total >= 4 && total < 7 && "Real deployment risk. The model may work in demos and fail in production. Pause before expanding."}
          {total < 4 && "This isn't ready for production. No amount of prompt tuning fixes missing architecture."}
        </div>
      </div>

      <div style={{ ...styles.h3, marginTop: 32 }}>The Two Questions That End Deals</div>
      <div style={styles.callout}>
        1. <em>What specific workflow does this replace or accelerate, and how do you measure whether it worked?</em>
      </div>
      <div style={styles.callout}>
        2. <em>When the model makes a mistake in this workflow, what happens, and who owns it?</em>
      </div>
      <div style={styles.p}>
        If either answer is "we'd need to figure that out together," the conversation has identified the engagement — not rejected it. That's what an AI Setup Audit is for.
      </div>
    </>
  );
}

function SprintExplained() {
  const phases = [
    {
      num: "01", title: "Audit", duration: "Day 1–2", price: "$4,500",
      what: "Score the current setup across five dimensions. Identify the one workflow with the highest ROI-to-effort ratio. Define the success metric and the baseline.",
      output: "Written audit report + one prioritized workflow recommendation.",
    },
    {
      num: "02", title: "Sprint", duration: "Days 3–7", price: "$5,000 fixed",
      what: "Build the workflow. Wire the data access. Define the role. Install the review path. Validate against the metric. Deliver a working system, not a demo.",
      output: "Deployed workflow in client environment + documentation + 30-day check-in scheduled.",
    },
    {
      num: "03", title: "Retainer", duration: "Month 2+", price: "$2,000/mo",
      what: "Maintain, evolve, and expand. The model improves monthly — the workflow has to keep pace. Add new agents, monitor performance, run quarterly audits.",
      output: "Continuous improvement log + quarterly review + ROI documentation.",
    },
  ];

  return (
    <>
      <div style={styles.h2}>The Enablement Sprint</div>
      <div style={styles.p}>
        The article describes what implementation architecture requires. This is what it looks like when you productize that work into a repeatable engagement model.
      </div>
      <div style={styles.p}>
        The Enablement Sprint isn't consulting. It's a fixed-scope, fixed-price delivery with a defined output and a measurable success criterion. You know what you're buying before you buy it.
      </div>

      {phases.map((p) => (
        <div key={p.num} style={{ background: SURFACE, border: `1px solid ${BORDER}`, marginBottom: 12, padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ ...styles.label, marginBottom: 4 }}>Phase {p.num} — {p.duration}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>{p.title}</div>
            </div>
            <div style={{ ...styles.mono, color: ACCENT, fontSize: 14, fontWeight: 700 }}>{p.price}</div>
          </div>
          <div style={{ fontSize: 14, color: "#C8BFA8", lineHeight: 1.65, marginBottom: 10 }}>{p.what}</div>
          <div style={{ ...styles.mono, fontSize: 11, color: MUTED }}>OUTPUT: {p.output}</div>
        </div>
      ))}

      <div style={styles.callout}>
        Year 1 model: 4–6 Audits ($4,500 blended) → 8–10 Sprints ($5,000 each) → 4–6 Retainers ($2,000/mo) → $222K target. The audit is the diagnostic. The sprint is the install. The retainer is how you stay relevant as the model improves.
      </div>

      <div style={{ ...styles.h3 }}>Why Fixed Price</div>
      <div style={styles.p}>
        Time-and-materials AI consulting has a structural problem: the client doesn't know what "done" looks like, and neither do you until you're in it. That ambiguity is how scopes expand, timelines slip, and the client ends up feeling like they bought a service that never finished.
      </div>
      <div style={styles.p}>
        Fixed scope + fixed price forces both sides to agree on what success looks like before work starts. It's not constraint — it's the contract that makes the outcome defensible.
      </div>
    </>
  );
}

function ProductizedVsBespoke() {
  return (
    <>
      <div style={styles.h2}>The Productized vs. Bespoke Question</div>
      <div style={styles.p}>
        The main article flags the central long-term risk for any AI services firm: does field work compound into reusable assets, or does every client stay a custom build?
      </div>
      <div style={styles.p}>
        That's not a rhetorical question. It has a structural answer.
      </div>

      <div style={styles.h3}>How Bespoke Traps Work</div>
      <div style={styles.p}>
        You build something great for Client A. Client B has a similar problem but different systems, different data, different review requirements. You start mostly from scratch. Client C has yet another variation. After 10 clients you have 10 slightly different things and no reusable layer. You've built a services business with consultant margins, not a platform business with product margins.
      </div>
      <div style={styles.callout}>
        SaaS shelfware rates run 53–93% depending on which dataset you believe. The same failure mode hits productized services: clients buy the engagement, don't fully deploy what was built, blame flat metrics on the operator. If your delivery doesn't include a named implementation owner and a defined adoption path, you're building toward that dispute.
      </div>

      <div style={styles.h3}>The Compounding Path</div>
      <div style={styles.p}>
        The compounding version looks different from the inside. Every engagement produces: a reusable prompt package for that workflow category, an integration blueprint for that system combination, an eval harness that can be repointed at the next client's data. The tenth client in a category takes 40% of the time the first one did. Margins go up. Delivery time goes down.
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Dimension</th>
            <th style={styles.th}>Bespoke Path</th>
            <th style={styles.th}>Compounding Path</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Prompt architecture", "Rebuilt per client", "Versioned library by workflow type"],
            ["Integration work", "Start from scratch", "Reusable connectors per system"],
            ["Evaluation", "Manual review", "Shared eval harness, client-specific data"],
            ["Onboarding", "Unstructured", "Playbook by industry vertical"],
            ["Margin over time", "Flat or compresses", "Improves with each repetition"],
            ["Competitive moat", "Reputation only", "Proprietary patterns + documented outcomes"],
          ].map(([dim, bespoke, compound], i) => (
            <tr key={i}>
              <td style={styles.td}>{dim}</td>
              <td style={{ ...styles.td, color: "#C96A6A" }}>{bespoke}</td>
              <td style={{ ...styles.td, color: "#8BB87A" }}>{compound}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.h3}>The Forcing Function</div>
      <div style={styles.p}>
        The discipline that separates the two paths is this: treat every engagement as if you're going to do it 20 more times. Document what you built as if you're handing it to someone else. Write the integration blueprint before you write the code. Name the prompt package. Version it.
      </div>
      <div style={styles.p}>
        That's not overhead — that's the asset layer. The Anthropic JV has $1.5B to build theirs. The indie version of this business builds it one engagement at a time, starting with the first one.
      </div>
    </>
  );
}

// ─── MAIN HUB ────────────────────────────────────────────────────────────────

const POPOUTS = [
  {
    label: "Market Context",
    title: "Where the Money Won't Go — The Gap Below Mid-Market",
    Component: WhereMoneyWontGo,
  },
  {
    label: "Interactive Tool",
    title: "The Implementation Architecture Audit — Score Your Stack",
    Component: TheAudit,
  },
  {
    label: "The Model",
    title: "The Enablement Sprint — What the Work Actually Looks Like",
    Component: SprintExplained,
  },
  {
    label: "Strategic Risk",
    title: "Productized vs. Bespoke — The Question Every Services Firm Has to Answer",
    Component: ProductizedVsBespoke,
  },
];

export default function FFEnterpriseAIHub() {
  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={styles.label}>FlashFusion — Enterprise AI Context Series</div>
        <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: TEXT }}>
          The Implementation Layer Is Now the Strategic Layer
        </div>
        <div style={{ fontSize: 14, color: MUTED, fontFamily: "'DM Mono', monospace", marginBottom: 24 }}>
          Published May 2026 · 12 min read
        </div>
        <div style={styles.p}>
          Anthropic, OpenAI, Blackstone, Hellman &amp; Friedman, and Goldman Sachs are all making moves right now. The implementation layer has become the strategic layer in enterprise AI. There are trillions of dollars in workflow value waiting on whoever figures this out first — and the companies that already understand this are about to pull further ahead.
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16, marginTop: 8 }}>
          <div style={{ ...styles.label, marginBottom: 12 }}>What's inside the main article</div>
          {[
            "What's actually new about the Anthropic deployment company",
            "Why the mid-market target and PE backing signal a shift from model sales to deployment capacity",
            "What \u201Cimplementation architecture\u201D actually means in practice",
            "The risk: services that don't turn into product",
            "What this means for startups, buyers, and builders",
            "The implementation architecture audit — score your stack",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "#C8BFA8" }}>
              <span style={{ color: ACCENT, fontFamily: "monospace" }}>→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.sectionDivider} />

      {/* Sub-pages section */}
      <div style={{ marginBottom: 24 }}>
        <div style={styles.label}>Extended Reading</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: TEXT }}>Four Follow-On Pieces</div>
        <div style={{ fontSize: 14, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>
          Each expands one thread from the main article into something usable. Click any to open.
        </div>
      </div>

      {POPOUTS.map(({ label, title, Component }) => (
        <Popout key={title} label={label} title={title}>
          <Component />
        </Popout>
      ))}

      <div style={styles.sectionDivider} />

      {/* Closing CTA */}
      <div>
        <div style={styles.label}>Next Step</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: TEXT }}>
          Know where your stack actually stands.
        </div>
        <div style={styles.p}>
          The AI Setup Assessment takes 15 minutes. It tells you what's working, what's exposed, and what to fix before you spend another quarter on pilots that won't scale.
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href="https://audit.flashfusion.co"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.cta, flex: 1, display: "block", textDecoration: "none" }}
          >
            Take the Free Assessment →
          </a>
        </div>
        <div style={{ ...styles.mono, fontSize: 10, color: MUTED, marginTop: 12, textAlign: "center" }}>
          audit.flashfusion.co · Scored in real time · No sales call required
        </div>
      </div>
    </div>
  );
}
