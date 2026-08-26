import { useState } from 'react';
import { Copy, Check, FileText, Download, AlertTriangle, Circle, ChevronRight, ExternalLink } from 'lucide-react';

// ────────────────────────────────────────────────────────────────
// FlashFusion Design Tokens (inline CSS variables)
// ────────────────────────────────────────────────────────────────

const tokens = {
  surfaceBase: '#0F0618',
  surfaceRaised: '#1A0B2E',
  surfaceOverlay: '#251443',
  borderPrimary: 'rgba(168, 85, 247, 0.2)',
  borderActive: 'rgba(168, 85, 247, 0.4)',
  accentPrimary: '#A855F7',
  accentSecondary: '#F472B6',
  accentCyan: '#22D3EE',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  fontHeading: "'Poppins', 'Nunito', sans-serif",
  fontBody: "'Inter', 'DM Sans', system-ui, sans-serif",
  fontCode: "'JetBrains Mono', 'Fira Code', monospace",
  glassBg: 'rgba(15, 6, 24, 0.6)',
  gradientAccent: 'linear-gradient(90deg, #A855F7 0%, #F472B6 55%, #22D3EE 100%)',
};

// ────────────────────────────────────────────────────────────────
// Content blocks
// ────────────────────────────────────────────────────────────────

const personalOneLiner = `Self-taught builder running FlashFusion — AI enablement consultancy for small operators in Lake County, IL.`;

const publicBio = `Kyle Rosebrook is a self-taught builder based in Lake County, Illinois. He started in hospitality, moved through quality control, and taught himself to ship AI systems by deploying them — first for himself, then for clients. He runs FlashFusion, a B2B AI enablement consultancy he co-founded with technical lead [LAFU FULL NAME].

FlashFusion helps small-to-mid operators move from AI curiosity to working Claude deployments. Live work includes the AI Setup Audit Scorecard at audit.flashfusion.co and a 5-skill Claude Code enablement suite delivered for a paid client engagement. The team is two people. The architecture is Claude-native and MCP-native — not a multi-model shop, not a generalist agency.

Lake County is underserved compared to Chicago. Most local builders are not CS graduates — they're service techs, small-business operators, and first-generation professionals figuring out where AI fits in real workflows. Kyle's community focus is on that audience: the people the conferences in the Loop don't reach.`;

const githubReadme = `# Practical AI Operator Workshop

A 90-minute, hands-on workshop for non-CS builders learning to use Claude Code on
real workflows. Built for service techs, small-business operators, and first-gen
tech workers in Lake County, Illinois — but the materials work anywhere.

## Who this is for

People who:
- Have never opened a terminal, or open it nervously
- Have a specific workflow that bleeds them time every week
- Want to leave with a working file, not inspiration

Not for: developers looking for advanced Claude Code patterns, or AI researchers
comparing models.

## What's in this repo

- \`agenda.md\` — minute-by-minute facilitator script
- \`claude-md-template/\` — beginner-friendly CLAUDE.md template with comments
  explaining every section
- \`worksheet.md\` — participant take-home; captures their workflow + first commit
- \`responsible-use-checklist.md\` — 10-item plain-language checklist (data, secrets,
  accuracy, attribution)
- \`feedback-form.md\` — 5-question post-event form, designed to capture what
  Anthropic asks for in impact reports
- \`venue-outreach/\` — email templates for community institutions (libraries,
  community colleges, co-working spaces)
- \`promo/\` — Facebook, LinkedIn, and Instagram copy for event promotion

## How to run a workshop with this

1. Read \`agenda.md\` end-to-end first. Every minute is loaded — running over by ten
   means the take-home is rushed.
2. Test the \`CLAUDE.md\` template on your own machine before you run it with
   strangers.
3. Send the responsible-use checklist with the registration confirmation, not at
   the event itself.
4. Run feedback at minute 85, not at the door — people leave without filling it
   out otherwise.

## How to contribute

If you ran this and something broke, open an issue with: where in the agenda,
what tripped people up, what you ended up doing instead. Pull requests welcome
— keep additions to the same plain-language register.

## Origin

Built from FlashFusion's first-event materials for a Lake County, IL workshop
series. Maintained by Kyle Rosebrook (flashfusion.co).`;

const interviewPrep = `# Ambassador Interview — Prep Sheet

## What interviewers are checking for

1. Are you actually using Claude or just talking about it?
2. Do you have a specific audience in mind, or a general "everyone"?
3. Will you actually run the event, or is this aspirational?
4. Are you self-aware about what you don't know?

## Lead with (specific, not general)

- audit.flashfusion.co is live and Claude-powered. Pull it up if needed.
- 5-skill Claude Code suite delivered for a paid client. Real work.
- Lake County target audience: name three specific people you know who'd attend.
- Q3 2026 first event at CLC. Date is committed (or close to committed).

## Don't say

- "I'm passionate about AI." (Says nothing.)
- "Senior developer" or any inflated title. ("Self-taught builder" is the differentiator.)
- "I built 240+ tools." (Real number is ~30 hands-on tools, ~47 Base44 apps.)
- The name of your day-job employer. Not relevant. Not theirs to know.

## Closing the interview

Ask for: (a) decision timeline, (b) what would tip the decision either way, (c) whether they want event materials in advance.

Offer: a draft agenda + CLAUDE.md template within 5 business days, regardless of decision.

## Two awkward questions you should rehearse

Q: "Have you organized community events before?"
A: "Not formal AI community events. I've run smaller things — internal training sessions, peer learning groups. The honest answer is I'm new to formal community organizing, and the audience I want to reach is exactly who I was eighteen months ago. That's the angle, not pretending to be a veteran."

Q: "Why not just attend Chicago events?"
A: "Most of the people I want to reach won't drive an hour after work to a Tuesday meetup. Lake County underservice isn't a marketing line — it's a logistics fact. I live there, the audience is there, the events should be there."`;

const capabilityReviewPrep = `# Capability Review — Prep Sheet

Anthropic's partner team conducts a capability review during the 60-day onboarding
period. It's a 30–45 minute conversation, typically with a Partner Success Manager.

## What they're checking

1. Real Claude work, not slideware.
2. Realistic understanding of your delivery capacity.
3. Honest about what you don't know yet.
4. Clear specialization angle (not "we do everything with AI").

## Likely questions and tight answers

**Q: Walk us through your most complex Claude deployment.**
A: The 5-skill Claude Code suite for [client industry]. Five skills covering [SUITE COMPONENT 1–5]. Architecture: [brief technical sketch]. Outcome: [time saved or specific metric]. Lessons: [one specific thing that broke and how we fixed it].

**Q: What's your team's technical depth?**
A: Two-person founding team. I lead strategy, scoping, and client work. [LAFU FULL NAME], my technical co-founder, leads architecture, RAG, and back-end integration. He came up through SWE coursework and built his own ERP system. We're scaling contractor capacity for delivery surge as we grow.

**Q: What's your annual revenue?**
A: We're early-stage. Year one revenue target is in the low six figures, ramping with each closed engagement. Public framing: "small consultancy with deliberate specialization." We're not pretending to be Accenture.

**Q: How many active clients do you have right now?**
A: [Honest number. If 1–3, say so. "Three active engagements: one in delivery, one in audit, one in scoping." Don't inflate.]

**Q: Why Claude specifically? Why not multi-model?**
A: Architectural conviction. We've found that the operator audience we serve is better served by deep specialization than model-shopping. Claude's MCP architecture, Skills system, and Code product give us a coherent toolchain. We can move faster on Claude deployments because we're not rewriting prompts for three different APIs.

**Q: What's your biggest gap as a partner today?**
A: Sales pipeline depth. We're delivery-strong, but our pipeline is currently relationship-driven. Partner Network admission would meaningfully change our distribution.

**Q: What would you NOT take on?**
A: Multi-tenant SaaS builds, custom ML training, anything outside the Claude ecosystem. We say no to "make us an AI strategy" engagements when there's no specific operational pain to solve. We're a sprint-and-deploy shop, not a slide-deck shop.

## Don't volunteer

- Day job employer name.
- Specific client names without permission.
- Revenue numbers more precise than ranges.
- Promises about future deployments not yet scoped.`;

const deploymentOnePager = `# FlashFusion — Live Deployments

## audit.flashfusion.co — AI Setup Audit Scorecard

**Problem:** Operators considering AI implementation have no honest framework for
assessing readiness. Vendor pitches conflate hype with capability. Most "AI audits"
are sales calls in disguise.

**Claude components:** Claude API for scoring logic, MCP-connected to internal
scoring data, Base44 frontend for the public-facing intake.

**Outcome:** Public-facing scoring engine, live and operating. Used in every
prospective client engagement as the diagnostic entry point. Output is a scored
readiness assessment plus a prioritized 90-day roadmap.

---

## 5-skill Claude Code Enablement Suite

**Problem:** A professional services client had repetitive operator workflows
costing significant manual time per week. Generic AI tools couldn't be trusted
with the data; off-the-shelf automation was too rigid.

**Claude components:** Claude Code with 5 custom skills covering [SUITE COMPONENT 1],
[SUITE COMPONENT 2], [SUITE COMPONENT 3], [SUITE COMPONENT 4], and
[SUITE COMPONENT 5]. Skills are MCP-aware and integrate with the client's
existing tooling.

**Outcome:** Suite delivered Q1 2026, in active use by the client team. Time
savings measured. Suite is documented for the client's internal team to extend.

---

## Microsoft Teams Migration Agent

**Problem:** Microsoft Teams tenant migrations are high-touch, error-prone, and
typically require manual checklist work across hundreds of users and channels.
Existing migration tools handle the bulk move but not the long tail of
configuration, permission, and integration mapping.

**Claude components:** Claude-driven decision logic, MCP-connected to source and
target Microsoft tenants. Production-grade implementation with monitored use,
rollback capability, and audit logging.

**Outcome:** Production pilot, Q2 2026. Live data, monitored use, scoping for
full rollout. Pilot phase reflects deployment scope (single tenant pair), not
code maturity.`;

const linkedinPosts = [
  {
    title: "Post 1 — Why I'm applying to be a Claude Ambassador",
    note: "Reframed from 'rejected' framing — this is your first application. Publish on submission day or shortly after.",
    body: `Submitted my application to be a Claude Community Ambassador for Lake County, Illinois.

Here's what I learned drafting it:

The application asks for community track record. I don't have one. I've never organized a tech meetup. I've never run a workshop. I've never managed a Slack community.

What I do have: a clear picture of who needs this and isn't getting it.

Lake County sits an hour north of Chicago. The Loop's AI events are real and useful — and almost none of the people I want to reach actually attend them. Service techs, small-business operators, first-gen tech workers, healthcare admins. They have specific workflows bleeding them an hour a day. They're not driving downtown for a Tuesday night meetup.

I was that audience eighteen months ago.

So I wrote the application around that — geographic underservice, audience specificity, and the only thing I can credibly bring: I'm exactly who I want to reach, two years on.

Whether or not Anthropic accepts, I'm running the workshop. Q3 2026, College of Lake County, Claude Code for Practical Builders.

If you're in Lake County or know someone who is — DM me.`
  },
  {
    title: "Post 2 — What CLAUDE.md taught me about teaching beginners",
    note: "Technical, concrete, no rejection narrative. Publish 1–2 weeks after Post 1.",
    body: `CLAUDE.md is the single best teaching tool I've found for getting non-developers productive on Claude Code in under an hour.

Here's why:

It forces the user to articulate three things before writing any code:
1. What this project actually is
2. What conventions matter
3. What context Claude needs every time

Most beginners can't write code. All beginners can describe what they want. CLAUDE.md is the bridge.

When I run workshop sessions, I don't start with "let's write a function." I start with "open a blank CLAUDE.md and tell Claude what this project is for, in your own words."

The first ten minutes are typing in plain English. The next forty are watching Claude generate working code from that description. The participant didn't have to know syntax. They had to know what they wanted.

The teaching insight isn't really about Claude. It's about the fact that the bottleneck for non-developers was never the code. It was the translation from intent to syntax.

CLAUDE.md is the translator.`
  },
  {
    title: "Post 3 — Same problem, two tools: Claude Code vs Base44 for operators",
    note: "Builder judgment, not product fandom. Publish 1–2 weeks after Post 2.",
    body: `An operator at one of my clients last week: "I want to automate this approval flow. What should I use?"

I gave them the answer I give everyone: it depends on the second build, not the first.

Base44 is faster for the first build. You describe the app in natural language, you get a working tool in an hour, you ship it to one user, you see if it sticks. Sketch-to-deployed is brutally fast.

Claude Code is faster for the second build. When the first version works and the operator wants to extend it — add a new state, change the permission model, integrate a third system — Claude Code is built for that. Base44 hits a wall when the natural-language abstraction can't express what you need.

So my heuristic for operators:

- One workflow, simple, ship today → Base44.
- Workflow that will grow, integrate, or get extended → Claude Code from the start.
- Don't know yet → Base44 first, migrate later if it gets traction.

The mistake I made early on: defaulting to Claude Code because it felt more "real." Then watching operators bounce off the terminal and never come back.

The right tool is the one the operator will actually use after I leave the room.`
  },
  {
    title: "Post 4 — What actually breaks when nontraditional builders try AI",
    note: "Audience-specific, draws target community. Publish 1–2 weeks after Post 3.",
    body: `Patterns I've seen from a year of working with non-CS builders trying to use AI tools:

1. They don't know what to ask for.

Not because they're not smart. Because the AI tool prompts them with "What would you like to build?" — which is the worst possible opening. Operators don't think in apps. They think in problems. The interface should ask "What's bleeding you time?"

2. They give up at the first error.

Developers expect errors. Non-developers interpret an error as "this doesn't work." Three errors in a row and they close the laptop and never come back. The first hour with a new tool has to be error-light, even if that means oversimplifying.

3. They don't have a vocabulary for what they don't understand.

A developer says "I don't get how this MCP server is connecting." A non-developer says "I don't know what's wrong" and stops. The diagnostic instinct doesn't transfer because the vocabulary doesn't exist yet.

4. They overestimate AI's reliability and underestimate their own contribution.

When the AI gets it right, they think the AI is magic. When the AI gets it wrong, they think they did something wrong. Neither is true. The realistic frame — "AI is a fast collaborator that needs your judgment" — takes time to internalize.

5. They want a working file at the end.

Not a tutorial completion certificate. Not a course. A file. On their machine. That solves their problem.

If you're building AI tools for operators: optimize for take-home artifacts. Everything else is secondary.`
  },
  {
    title: "Post 5 — I ran my first workshop [DRAFT — publish AFTER event]",
    note: "Template only. Fill in the friction point and outcome after Q3 2026 event runs.",
    body: `Ran my first Claude Code workshop yesterday in Lake County, IL.

[X] people showed up. [X] of them left with a working Claude Code project on their machine. [X] of them came in having never opened a terminal before.

One specific friction point I didn't predict:

[FRICTION POINT — fill in after event. Example structure: "About forty minutes in, [X] participants got stuck on [specific issue]. The workshop materials assumed [assumption that turned out to be wrong]. We adjusted by [what you did]. Lesson: [what you'd change]."]

One specific outcome that surprised me:

[OUTCOME — fill in after event. Example structure: "[Participant name or role] came in to automate [their specific workflow]. By the end, they had [specific working thing]. They sent me a screenshot the next morning showing [extended use]. The bar was clearing one workflow in 90 minutes — they cleared three in their first day after."]

Next workshop: [DATE]. Same format, same audience.

If you run AI workshops for operators: the take-home file matters more than the live demo. Aim for at least one working artifact per attendee. Anything less is a talk, not a workshop.`
  }
];

const ambassadorEmail = {
  subjects: [
    "Lake County, IL ambassador application — first event in planning",
    "Ambassador application from a self-taught builder in Lake County",
    "Building Claude community where Chicago doesn't reach"
  ],
  body: `I'm a self-taught builder based in Lake County, IL. I run FlashFusion, a B2B AI enablement consultancy. The Setup Audit Scorecard at audit.flashfusion.co is live, and I've delivered a 5-skill Claude Code enablement suite for a paid client engagement.

Applying to the Ambassador program because Lake County's AI community is thin compared to Chicago, and the people who'd benefit most — service techs, small-business operators, first-generation tech workers — don't make the trip downtown. They have real workflow problems and no one's running practical sessions in their range.

First event planned: Claude Code for Practical Builders. Ninety minutes, hands-on, take-home CLAUDE.md template and a working repo. Target venue: College of Lake County. Target date: Q3 2026. Capacity 15–25. Built for people who haven't opened a terminal but know exactly which workflow is bleeding them an hour a day.

Happy to share agenda, worksheet, responsible-use checklist, and feedback form in advance. If a call is the better next step, send a window.

— Kyle Rosebrook
flashfusion.co · audit.flashfusion.co`
};

const base44Email = {
  subjects: [
    "47 Base44 apps deep — operator's field report",
    "Base44 from the consultancy side — what's working, what gets hard",
    "Built across 47 Base44 apps — sharing what I've learned"
  ],
  body: `I'm a self-taught builder running FlashFusion, a B2B AI enablement consultancy. Built and tested across ~47 Base44 apps over the past year — most are sketches; the AI Setup Audit Scorecard at audit.flashfusion.co is the one in production.

Two patterns I've seen with operator-audience users: Base44 hits the "I have an idea, can it be tested in a day" use case better than anything else I've tried. Where it gets harder is the second build — when the same person tries to extend the first app and runs into the limits of what natural-language config can express.

I'm running practical builder workshops in Lake County, IL, and Base44 keeps coming up as the "first app" tool. Worth comparing publicly with Claude Code as the "second app" tool, depending on the operator's trajectory.

Happy to share demos or a rundown of what's worked. No ask — just sending the field report.

— Kyle Rosebrook
flashfusion.co`
};

const academyTier1 = `Hey [name] — quick favor that's actually a giveaway. FlashFusion is applying to the Anthropic Partner Network, which means I can hand out 10 free seats in Anthropic's certification academy — 4 modules, official certs you can put on LinkedIn, real Claude training. The catch: you'd need a @flashfusion.co email (I'll set it up, 5 min) and you'd need to finish the modules within ~60 days. Want a seat?`;

const academyTier2 = `Hey [name] — long time. Working on something AI-related and have 10 free Anthropic certifications to give out through a partner program. Includes a @flashfusion.co email and 4 official cert modules you can post to LinkedIn. Modules are ~2–4 hours each, self-paced. I'd help you set up. Interested?`;

const academyTier3 = `Subject: Free Anthropic AI certifications — 10 seats available

Hi [name],

I'm running an AI consultancy called FlashFusion and have access to give 10 free seats in Anthropic's official certification academy. It covers Claude API basics, Agent Skills, MCP, and Claude Code in Action — four modules, official certs you can put on LinkedIn or a resume.

The reason I'm reaching out: you mentioned [specific AI-curiosity moment — e.g. "asking about ChatGPT for your business" / "the side project you've been thinking about"]. This is the version of "getting started with AI" that comes with credentials, not just YouTube videos.

Requirements: (1) you'd use a @flashfusion.co email I set up for you (5 minutes, free for you), (2) you'd finish all four modules within ~60 days. Modules are 2–4 hours each, self-paced. I'd help you start.

No obligation, no follow-on commitment. Finish, you walk away with four certs. Don't finish, no harm done.

Want a seat?

— Kyle`;

// ────────────────────────────────────────────────────────────────
// Section configuration
// ────────────────────────────────────────────────────────────────

const sections = [
  { id: 'overview', label: 'Overview', icon: 'circle' },
  { id: 'foundation', label: 'Foundation', icon: 'circle' },
  { id: 'ambassador', label: 'Ambassador', icon: 'file' },
  { id: 'partner', label: 'Partner Network', icon: 'file' },
  { id: 'reference', label: 'Lafu Reference', icon: 'file' },
  { id: 'linkedin', label: 'LinkedIn Posts', icon: 'circle' },
  { id: 'outreach', label: 'Outreach Emails', icon: 'circle' },
  { id: 'academy', label: 'Academy Recruitment', icon: 'circle' },
  { id: 'execution', label: 'Execution Plan', icon: 'circle' }
];

const downloadables = [
  { name: 'Ambassador-Application.docx', description: 'Anthropic Community Ambassador application — full written responses', section: 'ambassador' },
  { name: 'Partner-Network-Application.docx', description: 'Claude Partner Network application (Services Partner track)', section: 'partner' },
  { name: 'Lafu-Reference-Brief.docx', description: 'Hand to Lafu before submitting Partner Network app', section: 'reference' }
];

// ────────────────────────────────────────────────────────────────
// Reusable subcomponents
// ────────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // graceful failure
    }
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '6px',
        background: copied ? 'rgba(74, 222, 128, 0.15)' : 'rgba(168, 85, 247, 0.12)',
        border: `1px solid ${copied ? 'rgba(74, 222, 128, 0.4)' : tokens.borderPrimary}`,
        color: copied ? '#4ade80' : tokens.accentPrimary,
        fontFamily: tokens.fontBody,
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 150ms ease'
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function ContentCard({ title, children, status, copyText }) {
  return (
    <div style={{
      background: tokens.glassBg,
      backdropFilter: 'blur(12px)',
      border: `1px solid ${tokens.borderPrimary}`,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: tokens.fontHeading,
            fontSize: '18px',
            fontWeight: 600,
            color: tokens.textPrimary,
            margin: 0,
            marginBottom: status ? '6px' : 0
          }}>
            {title}
          </h3>
          {status && <StatusBadge status={status} />}
        </div>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const colorMap = {
    'ready': { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: 'rgba(74, 222, 128, 0.4)' },
    'needs-input': { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.4)' },
    'after-event': { bg: 'rgba(34, 211, 238, 0.15)', color: '#22D3EE', border: 'rgba(34, 211, 238, 0.4)' },
    'placeholder': { bg: 'rgba(244, 114, 182, 0.15)', color: '#F472B6', border: 'rgba(244, 114, 182, 0.4)' }
  };
  const labels = {
    'ready': 'Ready to ship',
    'needs-input': 'Needs Kyle input',
    'after-event': 'Publish after event',
    'placeholder': 'Has placeholders'
  };
  const c = colorMap[status] || colorMap.ready;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '999px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      fontFamily: tokens.fontBody,
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }}>
      {labels[status]}
    </span>
  );
}

function CodeBlock({ children }) {
  return (
    <pre style={{
      background: 'rgba(15, 6, 24, 0.8)',
      border: `1px solid ${tokens.borderPrimary}`,
      borderRadius: '8px',
      padding: '16px',
      fontFamily: tokens.fontCode,
      fontSize: '13px',
      lineHeight: 1.6,
      color: tokens.textSecondary,
      overflowX: 'auto',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      margin: 0
    }}>
      {children}
    </pre>
  );
}

function ProseBlock({ children }) {
  return (
    <div style={{
      fontFamily: tokens.fontBody,
      fontSize: '14px',
      lineHeight: 1.65,
      color: tokens.textSecondary,
      whiteSpace: 'pre-wrap'
    }}>
      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: tokens.fontHeading,
      fontSize: '28px',
      fontWeight: 700,
      color: tokens.textPrimary,
      margin: 0,
      marginBottom: '8px',
      background: tokens.gradientAccent,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'inline-block'
    }}>
      {children}
    </h2>
  );
}

function SectionSubtitle({ children }) {
  return (
    <p style={{
      fontFamily: tokens.fontBody,
      fontSize: '14px',
      color: tokens.textTertiary,
      margin: 0,
      marginBottom: '32px',
      lineHeight: 1.6
    }}>
      {children}
    </p>
  );
}

function Pill({ children, variant = 'default' }) {
  const colors = {
    default: { bg: 'rgba(168, 85, 247, 0.12)', color: tokens.accentPrimary, border: tokens.borderPrimary },
    cyan: { bg: 'rgba(34, 211, 238, 0.12)', color: tokens.accentCyan, border: 'rgba(34, 211, 238, 0.3)' },
    pink: { bg: 'rgba(244, 114, 182, 0.12)', color: tokens.accentSecondary, border: 'rgba(244, 114, 182, 0.3)' }
  };
  const c = colors[variant] || colors.default;
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '999px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      fontFamily: tokens.fontBody,
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      marginRight: '6px',
      marginBottom: '4px'
    }}>
      {children}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────
// Section content renderers
// ────────────────────────────────────────────────────────────────

function OverviewSection() {
  const checklist = [
    { item: 'Personal one-liner', status: 'ready' },
    { item: 'Public bio (3 paragraphs, with Lafu)', status: 'placeholder' },
    { item: 'GitHub README — practical-ai-operator-workshop', status: 'ready' },
    { item: 'Ambassador application (.docx)', status: 'placeholder' },
    { item: 'Ambassador interview prep one-pager', status: 'ready' },
    { item: 'Partner Network application (.docx)', status: 'placeholder' },
    { item: 'Lafu reference brief (.docx)', status: 'placeholder' },
    { item: 'Capability review prep', status: 'placeholder' },
    { item: 'Deployment one-pager', status: 'placeholder' },
    { item: 'LinkedIn posts 1–4', status: 'ready' },
    { item: 'LinkedIn post 5 (template)', status: 'after-event' },
    { item: 'Anthropic Ambassador outreach email', status: 'ready' },
    { item: 'Maor Shlomo / Base44 outreach email', status: 'ready' },
    { item: 'Academy recruitment templates (Tier 1/2/3)', status: 'ready' },
  ];

  return (
    <div>
      <SectionHeading>Package overview</SectionHeading>
      <SectionSubtitle>
        Everything in this hub. Status reflects whether Kyle needs to fill a placeholder
        before submission. Three .docx files attached separately for actual submission.
      </SectionSubtitle>

      <ContentCard title="Submission-blocking placeholders to resolve">
        <ProseBlock>
{`Before submitting either application, replace these placeholders:

• [LAFU FULL NAME] — used in Ambassador app, Partner Network app, Lafu reference brief, public bio
• [LAFU EMAIL] — used in Partner Network app references section, Lafu reference brief
• [SUITE COMPONENT 1–5] — the five specific skill names from the delivered Claude Code suite, used in Partner Network app and capability review prep

Plus the binary confirmation: have you had the explicit "I'm naming you co-founder externally" conversation with Lafu? If not, have it before submitting.`}
        </ProseBlock>
      </ContentCard>

      <ContentCard title="Deliverable status">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {checklist.map((c) => (
            <div key={c.item} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: 'rgba(15, 6, 24, 0.5)',
              border: `1px solid ${tokens.borderPrimary}`,
              borderRadius: '6px',
              gap: '12px'
            }}>
              <span style={{
                fontFamily: tokens.fontBody,
                fontSize: '13px',
                color: tokens.textSecondary
              }}>{c.item}</span>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </ContentCard>

      <ContentCard title="Downloadable .docx files">
        <ProseBlock>
{`Three .docx files are attached to this conversation, ready to download and edit:

1. Ambassador-Application.docx
2. Partner-Network-Application.docx
3. Lafu-Reference-Brief.docx

Edit them in Word or Google Docs. The applications go to Anthropic. The reference brief goes to Lafu — give it to him before you submit the Partner Network application so he knows what's coming.`}
        </ProseBlock>
      </ContentCard>
    </div>
  );
}

function FoundationSection() {
  return (
    <div>
      <SectionHeading>Foundation pieces</SectionHeading>
      <SectionSubtitle>
        Reusable building blocks. Used across applications, LinkedIn posts, and outreach emails.
      </SectionSubtitle>

      <ContentCard title="Personal one-liner" status="ready" copyText={personalOneLiner}>
        <ProseBlock>{personalOneLiner}</ProseBlock>
        <div style={{ marginTop: '12px' }}>
          <Pill>12 words</Pill>
          <Pill variant="cyan">No title inflation</Pill>
        </div>
      </ContentCard>

      <ContentCard title="Public bio (3 paragraphs)" status="placeholder" copyText={publicBio}>
        <ProseBlock>{publicBio}</ProseBlock>
        <div style={{ marginTop: '12px' }}>
          <Pill variant="pink">Replace [LAFU FULL NAME]</Pill>
          <Pill variant="cyan">Self-taught framing</Pill>
        </div>
      </ContentCard>

      <ContentCard title="GitHub README — practical-ai-operator-workshop" status="ready" copyText={githubReadme}>
        <CodeBlock>{githubReadme}</CodeBlock>
      </ContentCard>
    </div>
  );
}

function AmbassadorSection() {
  return (
    <div>
      <SectionHeading>Ambassador track</SectionHeading>
      <SectionSubtitle>
        Anthropic Community Ambassador application materials. The full application is in the
        attached .docx file. Interview prep below.
      </SectionSubtitle>

      <ContentCard title="Ambassador-Application.docx" status="placeholder">
        <ProseBlock>
{`Full written responses for every section of the application:

• Personal background and Claude experience
• Community involvement and why ambassador
• Vision for local Claude community
• First event — Claude Code for Practical Builders
• Why Lake County
• What participants leave with
• Commitment and logistics

Replace [LAFU FULL NAME] before submitting. Verify CLC venue commitment is at least informally lined up — application is honest about "outreach in progress" but you should have a conversation started.`}
        </ProseBlock>
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: tokens.accentCyan, fontSize: '13px', fontFamily: tokens.fontBody }}>
          <Download size={14} />
          Download Ambassador-Application.docx from the chat attachments
        </div>
      </ContentCard>

      <ContentCard title="Interview prep one-pager" status="ready" copyText={interviewPrep}>
        <CodeBlock>{interviewPrep}</CodeBlock>
      </ContentCard>

      <ContentCard title="First event — quick reference">
        <ProseBlock>
{`Title: Claude Code for Practical Builders
Format: 90-minute hands-on workshop
Capacity: 15–25
Venue target: College of Lake County
Date target: Q3 2026

Full event materials (90-minute agenda, worksheet, CLAUDE.md template, responsible-use checklist, feedback form, venue outreach email, promo copy for FB/LinkedIn/IG) are a focused next-session deliverable. They are referenced in the Ambassador application as "available in advance on request" — Anthropic doesn't typically request them upfront, but you should have them drafted within 5 business days of submission.`}
        </ProseBlock>
        <div style={{ marginTop: '12px' }}>
          <Pill variant="cyan">Next session deliverable</Pill>
        </div>
      </ContentCard>
    </div>
  );
}

function PartnerSection() {
  return (
    <div>
      <SectionHeading>Partner Network track</SectionHeading>
      <SectionSubtitle>
        Claude Partner Network — Services Partner track application materials. The full application
        is in the attached .docx file. Capability review prep and deployment one-pager below.
      </SectionSubtitle>

      <ContentCard title="Partner-Network-Application.docx" status="placeholder">
        <ProseBlock>
{`Full written responses for the Services Partner track application:

• Company description
• Team (Kyle + Lafu as named technical co-founder)
• Services
• Live deployments (3: audit.flashfusion.co, 5-skill suite, Teams agent)
• What you're asking from Anthropic
• References (Lafu)
• Commitment

Replace [LAFU FULL NAME], [LAFU EMAIL], and [SUITE COMPONENT 1–5] before submitting. Submit the reference brief to Lafu BEFORE submitting this application.`}
        </ProseBlock>
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: tokens.accentCyan, fontSize: '13px', fontFamily: tokens.fontBody }}>
          <Download size={14} />
          Download Partner-Network-Application.docx from the chat attachments
        </div>
      </ContentCard>

      <ContentCard title="Capability review prep" status="placeholder" copyText={capabilityReviewPrep}>
        <CodeBlock>{capabilityReviewPrep}</CodeBlock>
      </ContentCard>

      <ContentCard title="Deployment one-pager" status="placeholder" copyText={deploymentOnePager}>
        <CodeBlock>{deploymentOnePager}</CodeBlock>
      </ContentCard>
    </div>
  );
}

function ReferenceSection() {
  return (
    <div>
      <SectionHeading>Lafu reference brief</SectionHeading>
      <SectionSubtitle>
        Document to hand Lafu before you submit the Partner Network application. Tells him what
        Anthropic will likely ask, what he can speak to, and what he doesn't need to claim.
      </SectionSubtitle>

      <ContentCard title="Lafu-Reference-Brief.docx" status="placeholder">
        <ProseBlock>
{`Hand this to Lafu the same week you submit the Partner Network application. Sections:

• Why he's reading this
• What's likely to happen (email or 15–20 min call from Anthropic's partner team)
• What they'll likely ask (5 typical questions)
• What he can speak to (factual list, no embellishment needed)
• What he doesn't need to say (revenue, contracts, etc.)
• The framing of FlashFusion (so you're aligned externally)
• Logistics (timing, format)

The doc explicitly invites Lafu to push back on framing before submission. Once submitted, public framing is locked.`}
        </ProseBlock>
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: tokens.accentCyan, fontSize: '13px', fontFamily: tokens.fontBody }}>
          <Download size={14} />
          Download Lafu-Reference-Brief.docx from the chat attachments
        </div>
      </ContentCard>

      <ContentCard title="Sequence — when to send what">
        <ProseBlock>
{`Day 0 (today or this week):
• Send Lafu the reference brief
• Have the explicit "I'm naming you co-founder externally" conversation
• Get his sign-off on the framing
• Get his name spelling and preferred email

Day 1–2:
• Update the Partner Network application with confirmed Lafu details
• Update the bio with confirmed name
• Update the Ambassador application with confirmed name

Day 3–7:
• Submit Ambassador application (no dependency on reference)
• Submit Partner Network application

Day 30–60:
• Anthropic partner team contacts Lafu for reference check
• Capability review scheduled`}
        </ProseBlock>
      </ContentCard>
    </div>
  );
}

function LinkedInSection() {
  return (
    <div>
      <SectionHeading>LinkedIn posts</SectionHeading>
      <SectionSubtitle>
        Five posts. Publish in order. One every 1–2 weeks. Post 1 reframed from rejection narrative
        — first application framing only.
      </SectionSubtitle>

      {linkedinPosts.map((post, i) => (
        <ContentCard
          key={i}
          title={post.title}
          status={i === 4 ? 'after-event' : 'ready'}
          copyText={post.body}
        >
          <p style={{
            fontFamily: tokens.fontBody,
            fontSize: '12px',
            color: tokens.accentSecondary,
            margin: 0,
            marginBottom: '14px',
            fontStyle: 'italic'
          }}>
            {post.note}
          </p>
          <div style={{
            background: 'rgba(15, 6, 24, 0.5)',
            border: `1px solid ${tokens.borderPrimary}`,
            borderRadius: '8px',
            padding: '16px',
            fontFamily: tokens.fontBody,
            fontSize: '13px',
            lineHeight: 1.65,
            color: tokens.textSecondary,
            whiteSpace: 'pre-wrap'
          }}>
            {post.body}
          </div>
        </ContentCard>
      ))}
    </div>
  );
}

function OutreachSection() {
  return (
    <div>
      <SectionHeading>Outreach emails</SectionHeading>
      <SectionSubtitle>
        Two cold outreach emails. First-application framing for Anthropic Ambassador.
        Field-report framing for Maor Shlomo / Base44.
      </SectionSubtitle>

      <ContentCard title="Anthropic Ambassador — outreach email" status="ready" copyText={ambassadorEmail.body}>
        <p style={{
          fontFamily: tokens.fontBody,
          fontSize: '12px',
          color: tokens.accentSecondary,
          margin: 0,
          marginBottom: '12px',
          fontWeight: 500
        }}>
          Subject line options (A is most specific, C is most distinctive):
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px', marginBottom: '16px' }}>
          {ambassadorEmail.subjects.map((s, i) => (
            <li key={i} style={{
              fontFamily: tokens.fontBody,
              fontSize: '13px',
              color: tokens.textSecondary,
              marginBottom: '6px',
              lineHeight: 1.5
            }}>
              <strong style={{ color: tokens.accentPrimary }}>{String.fromCharCode(65 + i)}:</strong> {s}
            </li>
          ))}
        </ul>
        <div style={{
          background: 'rgba(15, 6, 24, 0.5)',
          border: `1px solid ${tokens.borderPrimary}`,
          borderRadius: '8px',
          padding: '16px',
          fontFamily: tokens.fontBody,
          fontSize: '13px',
          lineHeight: 1.65,
          color: tokens.textSecondary,
          whiteSpace: 'pre-wrap'
        }}>
          {ambassadorEmail.body}
        </div>
      </ContentCard>

      <ContentCard title="Maor Shlomo / Base44 — outreach email" status="ready" copyText={base44Email.body}>
        <p style={{
          fontFamily: tokens.fontBody,
          fontSize: '12px',
          color: tokens.accentSecondary,
          margin: 0,
          marginBottom: '12px',
          fontWeight: 500
        }}>
          Subject line options:
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px', marginBottom: '16px' }}>
          {base44Email.subjects.map((s, i) => (
            <li key={i} style={{
              fontFamily: tokens.fontBody,
              fontSize: '13px',
              color: tokens.textSecondary,
              marginBottom: '6px',
              lineHeight: 1.5
            }}>
              <strong style={{ color: tokens.accentPrimary }}>{String.fromCharCode(65 + i)}:</strong> {s}
            </li>
          ))}
        </ul>
        <div style={{
          background: 'rgba(15, 6, 24, 0.5)',
          border: `1px solid ${tokens.borderPrimary}`,
          borderRadius: '8px',
          padding: '16px',
          fontFamily: tokens.fontBody,
          fontSize: '13px',
          lineHeight: 1.65,
          color: tokens.textSecondary,
          whiteSpace: 'pre-wrap'
        }}>
          {base44Email.body}
        </div>
      </ContentCard>
    </div>
  );
}

function AcademySection() {
  return (
    <div>
      <SectionHeading>Academy recruitment</SectionHeading>
      <SectionSubtitle>
        Templates and process for filling 10 Anthropic Academy seats. Pre-step infrastructure check first.
      </SectionSubtitle>

      <ContentCard title="Pre-step — infrastructure check">
        <ProseBlock>
{`Before any outreach goes out, confirm:

1. @flashfusion.co email accounts can be created (not just the domain — actual user accounts). You confirmed kyle@flashfusion.co and fusion@flashfusion.co exist. The 10 academy seats need 10 more accounts — confirm Google Workspace or equivalent supports this and budget is approved (~$60/mo or ~$720/yr for Google Workspace seats).

2. Skilljar onboarding flow — verify the actual 4 modules and order Anthropic requires. Don't ship recruitment messages until you've confirmed the path.`}
        </ProseBlock>
      </ContentCard>

      <ContentCard title="Tier 1 — warm contacts (FlashFusion-adjacent)">
        <p style={{ fontFamily: tokens.fontBody, fontSize: '13px', color: tokens.textSecondary, marginBottom: '12px' }}>
          Suggested list: Lafu, Kelan, Chris Butler (judgment call), Ryan Anderskow.
          Don't ask anyone at your day-job employer.
        </p>
        <ContentCard title="Tier 1 message (text or DM)" copyText={academyTier1}>
          <CodeBlock>{academyTier1}</CodeBlock>
        </ContentCard>
      </ContentCard>

      <ContentCard title="Tier 2 — old colleagues / collaborators">
        <p style={{ fontFamily: tokens.fontBody, fontSize: '13px', color: tokens.textSecondary, marginBottom: '12px' }}>
          Suggested list: cstmprnt / Waukegan circle (via Lafu's network), O'Toole's-era contacts who pivoted to ops/tech, CLC instructors / advisors in tech-adjacent programs.
        </p>
        <ContentCard title="Tier 2 message (text or short email)" copyText={academyTier2}>
          <CodeBlock>{academyTier2}</CodeBlock>
        </ContentCard>
      </ContentCard>

      <ContentCard title="Tier 3 — community / AI-curious in your orbit">
        <p style={{ fontFamily: tokens.fontBody, fontSize: '13px', color: tokens.textSecondary, marginBottom: '12px' }}>
          Suggested list: family in non-tech jobs who are AI-curious, friends-of-friends who've expressed AI interest, anyone you've helped informally with tech and stayed in touch with.
        </p>
        <ContentCard title="Tier 3 message (longer cold-ish email)" copyText={academyTier3}>
          <CodeBlock>{academyTier3}</CodeBlock>
        </ContentCard>
      </ContentCard>

      <ContentCard title="Tracking sheet structure">
        <ProseBlock>
{`Copy this into Notion or a Google Sheet:

| Name | Tier | Date asked | Response | @flashfusion.co email | M1 | M2 | M3 | M4 | Completion date | Notes |
|---|---|---|---|---|---|---|---|---|---|---|

Aim for 15–20 outreach attempts to convert 10 yeses. Don't try to fill from cold — start with Tier 1, work down.`}
        </ProseBlock>
      </ContentCard>
    </div>
  );
}

function ExecutionSection() {
  return (
    <div>
      <SectionHeading>Execution sequence</SectionHeading>
      <SectionSubtitle>
        What to do in what order. Estimated active work, not calendar time.
      </SectionSubtitle>

      <ContentCard title="Day 0 — pre-submission resolutions">
        <ProseBlock>
{`Time: ~1 hour active work.

1. Confirm Lafu's full name, email, and the "named co-founder externally" conversation has happened.
2. Identify the 5 specific skill names for the delivered Claude Code suite.
3. Replace placeholders in the three .docx files.
4. Hand Lafu the reference brief (.docx) and walk him through it (10-min call).
5. Confirm CLC outreach status — at minimum, know who you're going to email about venue.`}
        </ProseBlock>
      </ContentCard>

      <ContentCard title="Day 1 — submit Ambassador">
        <ProseBlock>
{`Time: ~30 min.

1. Submit Ambassador application via the Anthropic submission form.
2. Send the Ambassador outreach email (subject line A recommended).
3. Publish LinkedIn Post 1 the same day.

Ambassador submission has no reference dependency — it can move first.`}
        </ProseBlock>
      </ContentCard>

      <ContentCard title="Day 2–3 — submit Partner Network">
        <ProseBlock>
{`Time: ~1 hour.

1. Confirm Lafu has read the reference brief and is comfortable with the framing.
2. Submit Partner Network application via claude.com/partners.
3. Send Lafu a one-line confirmation: "Partner Network app went in today. Watch your email for Anthropic in the next 30–60 days."
4. Begin Tier 1 academy outreach (Lafu, Kelan, Ryan Anderskow).`}
        </ProseBlock>
      </ContentCard>

      <ContentCard title="Day 4–14 — content cadence">
        <ProseBlock>
{`Time: ~30 min per post, spaced.

• Day 7: LinkedIn Post 2
• Day 14: LinkedIn Post 3
• Send Maor Shlomo / Base44 outreach email any time after Day 4

If Ambassador interview gets scheduled in this window, prep one-pager is ready in this hub.`}
        </ProseBlock>
      </ContentCard>

      <ContentCard title="Day 15–60 — onboarding window">
        <ProseBlock>
{`• Day 21: LinkedIn Post 4
• Day 28: Tier 2 academy outreach starts
• Day 30–60: Anthropic Partner team contacts Lafu for reference check
• Day 30–60: Capability review scheduled — prep is in this hub
• Day 45: Tier 3 academy outreach if Tier 1+2 didn't fill 10

Goal by Day 60: 10 academy seats committed, capability review completed, partner directory listing live.`}
        </ProseBlock>
      </ContentCard>

      <ContentCard title="After event (Q3 2026) — post-event content">
        <ProseBlock>
{`• Same week: LinkedIn Post 5 (template in this hub, fill in friction point + outcome)
• Within 7 days: Post-event impact report submitted to Anthropic (template is a focused next-session deliverable)
• Within 14 days: Repo of workshop materials published to GitHub (practical-ai-operator-workshop)`}
        </ProseBlock>
      </ContentCard>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────

export default function FlashFusionPackageHub() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'foundation': return <FoundationSection />;
      case 'ambassador': return <AmbassadorSection />;
      case 'partner': return <PartnerSection />;
      case 'reference': return <ReferenceSection />;
      case 'linkedin': return <LinkedInSection />;
      case 'outreach': return <OutreachSection />;
      case 'academy': return <AcademySection />;
      case 'execution': return <ExecutionSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: tokens.surfaceBase,
      color: tokens.textPrimary,
      fontFamily: tokens.fontBody,
      padding: '24px',
      backgroundImage: `radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(34, 211, 238, 0.05) 0%, transparent 50%)`
    }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: `1px solid ${tokens.borderPrimary}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: tokens.accentPrimary,
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)'
            }} />
            <span style={{
              fontFamily: tokens.fontBody,
              fontSize: '11px',
              color: tokens.accentPrimary,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>
              FlashFusion · Anthropic Submission Package
            </span>
          </div>
          <h1 style={{
            fontFamily: tokens.fontHeading,
            fontSize: '40px',
            fontWeight: 700,
            margin: 0,
            marginBottom: '8px',
            background: tokens.gradientAccent,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Ambassador + Partner Network
          </h1>
          <p style={{
            fontFamily: tokens.fontBody,
            fontSize: '14px',
            color: tokens.textSecondary,
            margin: 0,
            lineHeight: 1.6
          }}>
            Complete submission package — applications, reference brief, LinkedIn posts, outreach emails, academy recruitment, capability review prep, and execution sequence.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 240px) 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>

          {/* Sidebar nav */}
          <nav style={{
            position: 'sticky',
            top: '24px',
            background: tokens.glassBg,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${tokens.borderPrimary}`,
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                    border: isActive ? `1px solid ${tokens.borderActive}` : '1px solid transparent',
                    color: isActive ? tokens.textPrimary : tokens.textSecondary,
                    fontFamily: tokens.fontBody,
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(168, 85, 247, 0.06)';
                      e.currentTarget.style.color = tokens.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = tokens.textSecondary;
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {s.icon === 'file'
                      ? <FileText size={14} style={{ color: isActive ? tokens.accentPrimary : tokens.textTertiary }} />
                      : <Circle size={6} fill={isActive ? tokens.accentPrimary : tokens.textTertiary} stroke="none" />
                    }
                    {s.label}
                  </span>
                  {isActive && <ChevronRight size={14} />}
                </button>
              );
            })}

            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: `1px solid ${tokens.borderPrimary}`
            }}>
              <p style={{
                fontFamily: tokens.fontBody,
                fontSize: '10px',
                color: tokens.textTertiary,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: 0,
                marginBottom: '8px',
                padding: '0 10px'
              }}>
                Attached files
              </p>
              {downloadables.map((d) => (
                <div key={d.name} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '8px 10px',
                  fontSize: '11px',
                  color: tokens.textSecondary,
                  fontFamily: tokens.fontBody,
                  lineHeight: 1.4
                }}>
                  <Download size={12} style={{ color: tokens.accentCyan, flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ wordBreak: 'break-word' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </nav>

          {/* Main content */}
          <main style={{ minWidth: 0 }}>
            {renderSection()}
          </main>
        </div>

      </div>
    </div>
  );
}
