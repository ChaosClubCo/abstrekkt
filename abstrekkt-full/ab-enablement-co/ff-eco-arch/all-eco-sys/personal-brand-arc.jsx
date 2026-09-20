import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Radio } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Personal Brand Arc
// Kyle-specific: practitioner-first. Content flows from builds, not from the
// desire for followers. Channels: LinkedIn, The Prompt, CLC, Ambassador, Speaking.
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'ARCHITECTURE',
    subtitle: 'Design the system before publishing anything. LinkedIn cadence live. The Prompt scaled.',
    months: [
      {
        n: 1,
        title: 'Brand architecture — design before publishing',
        why: 'You have three active presence threads right now: Intinc employee, FlashFusion consultant, Community Ambassador applicant. Without a deliberate architecture, you publish whichever project is loudest that week. A stranger reading your last 20 posts should be able to answer: what does he do, who does he help, and why should I listen to him? Right now, that answer is probably unclear.',
        weeks: [
          'Read your last 20 LinkedIn posts as a stranger. Write down: what does this person do? Who do they help? What is their single clearest claim? If the answers are vague or inconsistent, that is the work.',
          'Positioning statement v1: "Kyle Rosebrook is [specific role] who helps [specific audience] do [specific outcome] using [specific approach and differentiator]." One sentence. No buzzwords. No "passionate about AI." Test it against three people who know your work — do they recognize themselves in the audience?',
          'Three content pillars from your playbook — Security-first Claude deployments, Claude in real production stacks, Teaching Claude to technical teams — mapped to your last 12 builds. Which pillar has the most evidence? Which has the least? The answer determines which one needs more published proof before it can carry weight.',
          'Channel map with one purpose per channel: LinkedIn (public thought leadership and proof), The Prompt (internal Intinc, segmented depth), Community events (live, local, relationship-building). One job per channel. No content that belongs in two places without a reason.',
        ],
        gate: 'A one-page personal brand document: positioning statement, three content pillars with mapped evidence, channel map. Read it before publishing anything for the next 11 months.',
      },
      {
        n: 2,
        title: 'LinkedIn — consistent cadence over volume',
        why: 'Burst publishing — nothing for three weeks, then four posts in two days — signals an audience that you cannot be counted on. Consistency compounds. A stranger landing on your profile in month 11 should see a coherent practitioner who publishes regularly, not someone who posts when inspired.',
        weeks: [
          'Content audit: of your last 20 posts, which 3 got the most meaningful response (DMs, saves, reposts, or comments that led somewhere)? Write down what those three had in common. That is your starting format, not the format you think should work.',
          'Eight-week content calendar: one post per week minimum, each mapped to a content pillar. Variety across formats: a "here is what I built" story, a technical insight from a real project, a counterintuitive observation, a teach-something post. No "here are 5 AI tools you should use" content — that belongs to a different practitioner.',
          'First four posts published on schedule. Not drafts — live. Track reach, comments, and saves at 48 hours. Which format performed above your average? That is the one to repeat before experimenting with others.',
          'Engagement protocol: identify 25 practitioners and security-AI voices worth being in genuine conversation with. Read their posts. When you have something real to add — a specific disagreement, a complementary example, a question that opens the thread — comment. Three per day, substantive. Follower trajectory tracked weekly.',
        ],
        gate: 'Eight posts published over eight weeks without a gap. A documented format that outperforms your average reach. Weekly follower trajectory tracked.',
      },
      {
        n: 3,
        title: 'The Prompt — from internal newsletter to compounding asset',
        why: 'The Prompt is your most direct audience — people who opted in to receive your thinking on a schedule. Most newsletters stay small because they never have a growth mechanism and never raise their quality bar explicitly. This month does both.',
        weeks: [
          'Newsletter analytics audit: current subscriber count, open rate, click rate, which editions got replies or were forwarded. The data tells you what people actually read, not what you think they should read. Write down the three most surprising findings.',
          'Content quality bar: write the rubric for a 9/10 edition vs. a 7/10. Specific criteria — not "better writing" but "at least one finding from my own builds," "one claim I can back with a number," "one thing the reader cannot get from a general AI newsletter." Apply it before sending the next three editions.',
          'Growth mechanism: one specific path to grow the list from current subscribers to 200+ active readers. A LinkedIn post that links to a standout edition, a workshop sign-up that auto-subscribes, an internal Intinc all-hands mention. One mechanism, consistently executed for 90 days.',
          'Tier rationalization: The Prompt has three audience tiers. Which tier gets the most engagement? Which generates the most replies? If one tier is consistently underperforming, cut it or merge it — a three-tier newsletter you actually ship beats a one-tier newsletter you procrastinate on.',
        ],
        gate: 'The Prompt at 200+ active subscribers or a documented, executing growth path toward it. Open rate above 40%. At least one edition cited or forwarded by someone outside Intinc.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'ACTIVATE',
    subtitle: 'CLC formalized. Ambassador application submitted and activated. Cross-channel content system live.',
    months: [
      {
        n: 4,
        title: 'CLC relationship formalization',
        why: 'You have genuine institutional goodwill at CLC — two counselors and the math professor who was central to completing your degree. Most people leave that kind of relationship as "someone I know." You are building a Community Ambassador anchor event and CLC is the natural venue. That requires a formal conversation, not an assumption.',
        weeks: [
          'Warm outreach to the math professor — a real conversation, not a cold email. Context: you are applying to the Community Ambassador program, you want CLC to be the anchor venue for Lake County, and you are asking for their support as an institutional co-sign. What is in it for CLC students and faculty?',
          'Institutional path: who at CLC approves external speakers and community events? The professor is the champion, but someone else is the decision-maker. Map the approval path before you need it urgently.',
          'Event concept brief for CLC: one page. Audience (students and staff), format (90-minute lunch and learn or 3-hour workshop), topic (Claude fluency or security-first AI), what CLC receives (free AI literacy education, faculty upskilling, student career value), what you receive (venue, co-branded event, Ambassador proof point).',
          'Get a confirmed date or a clear next step with a named contact. "We think this is a great idea, let\'s plan something for Q3" with a specific person\'s name is a gate-worthy outcome. Silence is not.',
        ],
        gate: 'A confirmed CLC event date or a written next step with a named contact and a timeline. The event is on a calendar, even if it is four months away.',
      },
      {
        n: 5,
        title: 'Community Ambassador — apply with evidence, not intention',
        why: 'The application is open. Applying without a specific event concept and a documented track record is weaker than applying with both. You have the event concept from M4. You have The Prompt, your builds, and the positioning statement from M1. This month you put it together and submit.',
        weeks: [
          'Write the application. Specific city (Lake County / Zion, IL — distinct from Chicago meetup saturation). Specific event concept (the CLC workshop from M4 with a named venue contact). Specific track record (The Prompt at current subscriber count, workshop delivery history, production Claude builds). No generic AI enthusiasm. The framework from your playbook applies here.',
          'Submit. Document the submission date, the confirmation email, and the expected response timeline. Set a calendar reminder for follow-up.',
          'Build the Ambassador infrastructure regardless of outcome: event checklist, participant workbook template, demo script for the CLC workshop, post-event impact report template. The application decision should not gate any of this work — it is useful whether or not you get the program.',
          'If rejected: identify the specific gap in the feedback (or in the self-assessment if there is no feedback) and address it directly. If accepted: activate all available mechanisms — event sponsorship request, API credits application, Slack community introduction. Neither outcome leaves you passive.',
        ],
        gate: 'Application submitted with a specific event concept and documented track record. Ambassador infrastructure built. A clear response plan for acceptance and for rejection.',
      },
      {
        n: 6,
        title: 'Cross-channel content system',
        why: 'You are publishing in at least four channels. Without a system, you recreate content for each from scratch and burn time doing it. With one, a single workshop becomes a LinkedIn post, a Prompt edition, a speaker abstract, and an Ambassador impact report. The goal is one creation, multiple publications.',
        weeks: [
          'Content multiplication map: take your last three pieces of content and trace what they could have become in each channel. Workshop → LinkedIn story post → Prompt section → short clip (if applicable) → talk abstract. Most content can be extended this way with 20 minutes of work, not 2 hours.',
          'Repurposing workflow with Claude: a system prompt that takes a LinkedIn post draft and generates a Prompt section, a talk abstract, and a tweet-thread outline. Test it on five real posts. Adjust the prompt until the outputs need only light editing.',
          'Unified content calendar: one view that shows all active channels and every planned publication. The goal is immediate visibility of any gap longer than two weeks where you are silent everywhere simultaneously.',
          'Content batching cadence: one 90-minute content session per week where you produce the majority of that week\'s content before Monday. Track output per session for four consecutive weeks. The batch that consistently underproduces is the one to investigate.',
        ],
        gate: 'A cross-channel content system with a documented repurposing workflow. Three pieces of content that have successfully been multiplied across at least two channels without starting from scratch.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'MOMENTUM',
    subtitle: 'Flagship long-form published. Speaking pipeline built. Nine-month data review drives Q4 adjustments.',
    months: [
      {
        n: 7,
        title: 'Publish one definitive long-form piece',
        why: 'A consistent posting cadence builds familiarity. A definitive long-form piece builds authority. They are different things. The content that gets saved, cited, and referenced months later is almost always specific, opinionated, and based on something only you could have written. This month you write and publish it.',
        weeks: [
          'Choose the flagship topic from your three content pillars: which one do you have the most specific, hard-earned, and genuinely rare knowledge about? The criterion is: could someone else have written this without your specific build history? If yes, it is not the right topic.',
          'Draft: minimum 1,200 words. LinkedIn long-form article or a Substack post with a LinkedIn cross-post. Structure: a specific claim → evidence from your own builds with real numbers → the counterargument you actually believe → the practical takeaway a technical reader can act on by Friday.',
          'Edit to a brutal standard: delete every sentence that could have been written by anyone. Delete every sentence that summarizes something the reader could find on Google. What remains is the piece. If less than 800 words remain, the topic was not specific enough.',
          'Publish, distribute, and measure: LinkedIn article + Prompt edition + Ambassador share if the program is active. Track saves (a save is worth ten likes), inbound DMs, and whether it appears in any searches or external links within 30 days.',
        ],
        gate: 'One definitive long-form piece published. At least 3 inbound messages from people you did not already know who discovered it through search or sharing rather than your direct network.',
      },
      {
        n: 8,
        title: 'Speaking and workshop pipeline',
        why: 'Written content scales. Live events build trust at a qualitatively different level. The CLC event confirmed in M4 is one slot. A pipeline means having 3–5 events on a rolling 6-month calendar so you are never starting from zero. You already have the workshop material — the gap is the pipeline infrastructure.',
        weeks: [
          'Event inventory: what is realistic in the next 6 months? CLC confirmed, one Intinc internal session, one Chicago-area security or AI meetup (search for active groups — there are several, none are saturating the Claude community space), one conference CFP that closes before Q4.',
          'Abstract library: three talk abstracts ready to submit anywhere at any time. One per content pillar. Each: target audience, stated single outcome the attendee will leave with, and the one thing that makes this talk different from a generic AI talk.',
          'Submit two external CFPs or formally propose two external events. Internal only is a ceiling — getting on a stage outside your immediate network is where the brand compounds.',
          'First event delivered — CLC, Intinc, or external. Post-event survey with three specific questions: what will you do differently as a result of this session? What was most useful? Would you recommend this session to a colleague? Collect three specific outcome statements you can use in future event proposals.',
        ],
        gate: 'Three events confirmed or formally submitted (not just planned) on a rolling 6-month calendar. First external or CLC event delivered with documented participant outcomes.',
      },
      {
        n: 9,
        title: 'Nine-month data review and Q4 adjustment',
        why: 'Most people who build a personal brand never look at the data. They post what feels right and wonder why it is not compounding. Nine months in, you have enough data to make real decisions — which format gets reach, which pillar generates inbound, which newsletter tier people actually read.',
        weeks: [
          'LinkedIn analytics review: reach, engagement rate, follower growth by month, top-performing posts by pillar and format. Is one pillar consistently outperforming the others on both reach and inbound? Is one format consistently underperforming? Write the findings before drawing conclusions.',
          'Newsletter analytics: open rate, click rate, reply rate, unsubscribe triggers by edition type. Is one tier of The Prompt significantly outperforming? If tier 2 (technical) has 2× the open rate of tier 1 (non-technical), that is a content direction signal.',
          'Event analytics: attendance vs. capacity across all events delivered, post-event survey scores, how many attendees took a specific next step (subscribed to The Prompt, sent a DM, scheduled a call)?',
          'Q4 adjustment plan: based on nine months of actual data — not intuition — what changes? Which format gets more budget? Which channel gets less? Which content pillar gets the flagship treatment in Q4? Document the decisions and the data behind each one.',
        ],
        gate: 'A nine-month analytics review document with at least three specific Q4 changes and the data behind each decision. No adjustments made on instinct alone.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'COMPOUND',
    subtitle: 'Co-marketing partnerships activated. Brand connected to pipeline. Year 2 strategy written.',
    months: [
      {
        n: 10,
        title: 'Partnership and co-marketing',
        why: 'Solo brand building has a ceiling. Every piece of content you publish reaches the same audience. Co-marketing — with Anthropic through the Ambassador program, with CLC institutionally, with adjacent practitioners — multiplies reach without proportionally multiplying effort. This month you activate every available co-marketing path.',
        weeks: [
          'Anthropic Ambassador co-marketing: what does the program actually provide? Event co-promotion, social shares from official channels, directory listing, access to Builders Council. Activate every mechanism you have not already used. If the application is still pending, follow up with a specific ask.',
          'CLC institutional co-marketing: a post-event recap published on CLC\'s channels or newsletter, a student or faculty testimonial, a quote from the math professor about the program. Ask for each explicitly — institutions will provide assets when asked and rarely volunteer them.',
          'Peer practitioner co-marketing: identify three practitioners in adjacent lanes (AI governance, enterprise ML operations, cloud security) who serve the same enterprise buyer without competing directly. Propose one of: a guest edition of The Prompt, a co-authored LinkedIn post on a shared topic, a joint event.',
          'Inbound source tracking: for every meaningful new connection this month, record how they found you. LinkedIn post? A specific edition of The Prompt? Event attendance? Referral from a previous attendee? The source data tells you which channel has the highest-quality conversion, not just the highest volume.',
        ],
        gate: 'At least one active co-marketing relationship beyond Intinc and CLC. Ambassador co-marketing activated at every available lever. Inbound source tracking live for at least 30 days.',
      },
      {
        n: 11,
        title: 'Brand as business asset — connect the dots',
        why: 'A personal brand that does not connect to revenue, opportunity, or influence is a hobby. This month you explicitly map what the brand work has produced for the AIaaS pipeline — which posts generated leads, which events produced proposal conversations, which newsletter subscribers became clients or referrers.',
        weeks: [
          'Revenue attribution attempt: map every meaningful business conversation in the last 11 months to its originating brand touchpoint. Even rough attribution — "I think they found me through the OWASP post" — is more useful than no attribution. The goal is a hypothesis you can test, not a precise number.',
          'Brand-to-pipeline conversion rates: what is the rough conversion from LinkedIn follower to discovery call? Event attendee to follow-up? Newsletter subscriber to referral or direct inquiry? Calculate these even if the sample is small. A 2% conversion on 500 followers is 10 conversations — that is a real number to defend.',
          'CTA audit: every active channel should end every piece of content with one specific next step for the audience. LinkedIn post → subscribe to The Prompt. The Prompt → book a discovery call or attend the next event. Event → subscribe and connect. Audit for clarity and consistency. Vague CTAs produce nothing.',
          'Brand investment document for Daniel: one page that shows what the personal brand work produced in 11 months. Not follower counts — conversations started, proposals touched, internal visibility gained, Partner Network leads driven. The document that turns a personal project into a justified business activity.',
        ],
        gate: 'A documented brand-to-pipeline map. At least one traceable connection between brand activity and a business outcome — a conversation, a proposal, or a client. The one-page document for Daniel.',
      },
      {
        n: 12,
        title: 'Year 1 retrospective and Year 2 strategy',
        why: 'A brand that does not evolve calcifies. Year 1 was about establishing consistent presence and claiming the "security-first Claude practitioner in Lake County" positioning. Year 2 is about compounding that presence, deepening the authority, and deliberately expanding into whatever the data and the market are pointing toward.',
        weeks: [
          'Year 1 retrospective: follower growth, newsletter subscriber growth, events delivered, inbound generated, partnerships formed, deals touched. One honest number per channel. Where did you exceed your own expectations? Where did you fall short of the M1 positioning document?',
          'Positioning review: does "security-first Claude practitioner" still fit? Has the market recognized it? Have unexpected opportunities arrived from a different angle — more from the teaching work, more from the Ambassador program, more from the MCP builder work? The data should inform the Year 2 positioning adjustment if one is needed.',
          'Year 2 strategy: one page. Follower target, newsletter target, events planned, one new channel or format to test (video, podcast guest, conference keynote), and one positioning refinement based on what Year 1 actually rewarded. Specific and time-bounded.',
          'Publish the Year 1 retrospective: a LinkedIn post or dedicated Prompt edition that shares what you built, what you learned, and where you are going. Public accountability compounds — the audience you have built should know what you are doing next, and they should be the first to hear it.',
        ],
        gate: 'A published Year 1 retrospective. A written Year 2 brand strategy document. The audience knows what you are building next before you announce it anywhere else.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// CHANNEL STRIP — five brand channels with type-based visual distinction
// ---------------------------------------------------------------------------
const CHANNELS = [
  { type: 'primary',  label: 'Channel 1', name: 'LinkedIn',    sub: 'Q1 onward · weekly',   fill: 100 },
  { type: 'channel',  label: 'Channel 2', name: 'The Prompt',  sub: 'Q1 focus · monthly',   fill: 80  },
  { type: 'live',     label: 'Channel 3', name: 'CLC + Events', sub: 'Q2 activation',        fill: 55  },
  { type: 'program',  label: 'Program',   name: 'Ambassador',  sub: 'Q2 application · M5',  fill: 35  },
  { type: 'channel',  label: 'Channel 4', name: 'Speaking',    sub: 'Q3 pipeline · M8',     fill: 15  },
];

// ---------------------------------------------------------------------------
// STYLES — Personal Brand Arc / sky blue on deep blue-black
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #050b10;
  --bg-2:         #0a1520;
  --fg:           #e0f0fc;
  --fg-dim:       #6a9ab8;
  --accent:       #38bdf8;
  --accent-2:     #7dd3fc;
  --gate:         #fb7185;
  --live:         #fb923c;
  --prog:         #a78bfa;
  --muted:        #2a5068;
  --card:         #0c1a28;
  --border:       #152536;
  --border-bright:#1e3650;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56,189,248,0.09), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(251,113,133,0.05), transparent 65%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

/* HEADER */
.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 48px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(42px, 6vw, 76px);
  line-height: 0.95; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 54ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--accent); font-weight: 500; }

/* CHANNEL STRIP */
.channel-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.ch-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.ch-item:last-child { border-right: none; }
.ch-item.is-live    { background: rgba(251,146,60,0.04); }
.ch-item.is-program { background: rgba(167,139,250,0.05); border-left: 1px solid rgba(167,139,250,0.25); }
.ch-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.ch-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 19px; line-height: 1.2; font-weight: 400; margin-bottom: 3px;
}
.is-primary .ch-name  { color: var(--accent); }
.is-channel .ch-name  { color: var(--accent-2); }
.is-live    .ch-name  { color: var(--live); }
.is-program .ch-name  { color: var(--prog); }
.ch-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-primary .ch-sub  { color: rgba(56,189,248,0.65); }
.is-channel .ch-sub  { color: rgba(125,211,252,0.55); }
.is-live    .ch-sub  { color: rgba(251,146,60,0.65); }
.is-program .ch-sub  { color: rgba(167,139,250,0.65); }
.ch-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-primary .ch-bar-fill { background: var(--accent);  height: 100%; opacity: 0.85; }
.is-channel .ch-bar-fill { background: var(--accent-2);height: 100%; opacity: 0.65; }
.is-live    .ch-bar-fill { background: var(--live);    height: 100%; opacity: 0.75; }
.is-program .ch-bar-fill { background: var(--prog);    height: 100%; opacity: 0.80; }

/* TRADEOFF */
.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(56,189,248,0.07), rgba(56,189,248,0.01));
  padding: 20px 24px; margin-bottom: 56px;
  display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start;
}
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400;
}
.tradeoff-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px;
}
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.authentic-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(56,189,248,0.03);
  font-size: 12.5px; color: var(--fg);
}
.authentic-note strong { color: var(--accent); }

/* QUARTER TABS */
.quarter-rail {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.qtab {
  padding: 20px 18px; cursor: pointer; background: transparent; border: none;
  border-right: 1px solid var(--border); text-align: left; color: var(--fg-dim);
  transition: background 0.2s, color 0.2s; font-family: 'JetBrains Mono', monospace; position: relative;
}
.qtab:last-child { border-right: none; }
.qtab:hover  { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before {
  content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px; background: var(--accent);
}
.qtab-num   { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; line-height: 1.1; margin: 6px 0 4px; color: inherit; font-weight: 400;
}
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }

/* MONTHS */
.months { display: grid; gap: 16px; }
.month { border: 1px solid var(--border); background: var(--card); transition: border-color 0.2s; }
.month:hover { border-color: var(--border-bright); }
.month.open  { border-color: var(--accent); }

.month-head {
  padding: 20px 24px; cursor: pointer;
  display: grid; grid-template-columns: 80px 1fr auto; gap: 24px; align-items: center; user-select: none;
}
.month-num {
  font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1;
  color: var(--accent); font-style: italic; font-weight: 400;
}
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why   { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev  { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }

.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner { padding: 4px 24px 24px; border-top: 1px dashed var(--border); margin-top: 4px; }

/* WEEKS */
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start;
  padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright);
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--accent); }
.week.done  { border-left-color: var(--accent); background: rgba(56,189,248,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(56,189,248,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

/* GATE — rose = content published, audience reached */
.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(251,113,133,0.3); background: rgba(251,113,133,0.04); align-items: start;
}
.gate-icon  { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text {
  font-size: 13px; color: var(--fg);
  font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.45;
}

/* PROGRESS */
.progress-wrap {
  position: sticky; top: 0; background: var(--bg);
  padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border);
}
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val   { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill  { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

/* CLAIMS */
.claims {
  margin-top: 72px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims code { color: var(--accent-2); background: rgba(56,189,248,0.1); padding: 1px 6px; font-size: 11px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.55s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
.stagger > *:nth-child(3) { animation-delay: 0.16s; }
.stagger > *:nth-child(4) { animation-delay: 0.22s; }
.stagger > *:nth-child(5) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .channel-strip { grid-template-columns: 1fr 1fr; }
  .ch-item:nth-child(2) { border-right: none; }
  .ch-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
  .tradeoff-grid { grid-template-columns: 1fr; }
  .quarter-rail { grid-template-columns: 1fr 1fr; }
  .qtab:nth-child(2) { border-right: none; }
  .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; }
  .month-num { font-size: 36px; }
  .month-body-inner { padding: 4px 16px 20px; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function PersonalBrandArc() {
  const [activeQ,   setActiveQ]   = useState(0);
  const [openMonth, setOpenMonth] = useState(1);
  const [done,      setDone]      = useState(new Set());

  const totalWeeks = 48;
  const pct = Math.round((done.size / totalWeeks) * 100);

  const toggleWeek = (key) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const quarter = ARC[activeQ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">

          {/* HEADER */}
          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Radio size={12} /> Learning Ops // Personal Brand Lane</p>
              <h1 className="title-serif">The <em>Brand</em> Arc.</h1>
              <p className="title-sub">
                12 months. Content that flows from real builds, not from the desire for followers.
                LinkedIn cadence, The Prompt at scale, CLC formalized, Ambassador activated,
                a speaking pipeline, and a published Year 1 retrospective that tells the market
                what you built — and what you are building next.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>LI target: <strong>1,000 followers</strong></div>
              <div style={{ marginTop: 4 }}>Prompt target: <strong>200+ active subscribers</strong></div>
            </div>
          </div>

          {/* CHANNEL STRIP */}
          <div className="channel-strip stagger">
            {CHANNELS.map((c) => (
              <div key={c.name} className={`ch-item is-${c.type}`}>
                <div className="ch-label">{c.label}</div>
                <div className="ch-name">{c.name}</div>
                <div className="ch-sub">{c.sub}</div>
                <div className="ch-bar">
                  <div className="ch-bar-fill" style={{ width: `${c.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* TRADEOFF */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — and one risk the other arcs do not carry.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                The technical arcs trade time for depth. This arc trades time for visibility.
                The visibility payoff is real — but it carries a risk the other arcs do not:
                optimizing for followers instead of publishing from genuine expertise.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>The Partner Network Services Directory requires visibility — a thin profile converts badly</li>
                    <li>The Ambassador program compounds: each event generates content, each content piece recruits attendees</li>
                    <li>1,000 targeted LinkedIn followers in a niche outperforms 10,000 in a broad one — you are in a niche</li>
                    <li>The Prompt at 200+ subscribers is a direct sales channel to the most qualified audience you have</li>
                    <li>A published content calendar forces you to ship learning from your technical arcs instead of hoarding it</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>3–4 hrs/week across content creation, engagement, and event logistics</li>
                    <li>Audience-chasing content — posting what performs instead of what you actually know — dilutes the brand faster than silence would</li>
                    <li>Event logistics are underestimated: a CLC workshop is 2 hours live and 10 hours of prep, materials, and follow-up</li>
                    <li>The Ambassador application may not be accepted on first submission — plan for a second attempt with more evidence</li>
                  </ul>
                </div>
              </div>
              <div className="authentic-note">
                <strong>The one rule that overrides everything else in this arc:</strong> content
                must flow from builds first. The practitioner who posts "here is what I learned
                debugging a multi-tenant RLS failure" has a brand that compounds. The one who
                posts "here are 7 AI tools for engineers" has an audience that unsubscribes. Every
                piece of content in this arc should be traceable to something you actually shipped.
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
              <span className="progress-val">{done.size} / {totalWeeks} · {pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* QUARTER TABS */}
          <div className="quarter-rail">
            {ARC.map((q, i) => (
              <button
                key={q.quarter}
                className={`qtab ${i === activeQ ? 'active' : ''}`}
                onClick={() => setActiveQ(i)}
              >
                <div className="qtab-num">{q.quarter} · Months {q.months[0].n}–{q.months[q.months.length - 1].n}</div>
                <div className="qtab-phase">{q.phase}</div>
                <div className="qtab-sub">{q.subtitle}</div>
              </button>
            ))}
          </div>

          {/* MONTHS */}
          <div className="months">
            {quarter.months.map((m) => {
              const isOpen = openMonth === m.n;
              return (
                <div key={m.n} className={`month ${isOpen ? 'open' : ''}`}>
                  <div className="month-head" onClick={() => setOpenMonth(isOpen ? null : m.n)}>
                    <div className="month-num">M{String(m.n).padStart(2, '0')}</div>
                    <div>
                      <h3 className="month-title">{m.title}</h3>
                      <p className="month-why">{m.why}</p>
                    </div>
                    <ChevronRight className="month-chev" size={20} />
                  </div>
                  <div className="month-body">
                    <div className="month-body-inner">
                      <div className="weeks">
                        {m.weeks.map((w, wi) => {
                          const key    = `${m.n}-${wi}`;
                          const isDone = done.has(key);
                          return (
                            <div
                              key={key}
                              className={`week ${isDone ? 'done' : ''}`}
                              onClick={() => toggleWeek(key)}
                            >
                              <span className="week-label">W{wi + 1}</span>
                              <span className="week-text">{w}</span>
                              {isDone
                                ? <CheckCircle2 size={16} className="week-check" />
                                : <Circle       size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Reach gate · M{m.n}</div>
                          <div className="gate-text">{m.gate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CLAIMS */}
          <div className="claims">
            <h4>
              <Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              CLAIMS &amp; ASSUMPTIONS
            </h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The 1,000 LinkedIn follower target is reachable but not guaranteed by consistent posting alone.</strong>
                It requires genuine engagement (the M2 engagement protocol), at least one piece of
                high-reach content (the M7 definitive piece), and a real reason for practitioners in
                the security-AI space to follow you specifically. Adjust the target upward or downward
                after the M9 data review — it is a planning number, not a commitment.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The Ambassador application has no guaranteed outcome.</strong> The
                application framework is strong. The Lake County / CLC positioning differentiates from
                Chicago city applications. But Anthropic's acceptance criteria are not fully public. Plan
                for a second application with more evidence if the first does not succeed. Do not let
                the outcome gate the CLC event work — that work is valuable regardless.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The Prompt 200+ subscriber target assumes a growth mechanism is built and executed.</strong>
                Organic growth from consistent publishing alone is slow. The M3 growth mechanism —
                LinkedIn → Prompt link, workshop sign-up auto-subscribe, or an Intinc all-hands mention
                — is the difference between 200 subscribers in 12 months and 200 subscribers in 36 months.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Chicago-area AI community note:</strong> there are
                active Claude and AI practitioner communities in Chicago. The Lake County positioning is
                geographic differentiation, not an absence-of-competition claim. Frame it as "underserved
                suburban market with institutional CLC anchor" — not as a market with no existing community.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Content that performs well is not always content worth repeating.</strong>
                The M9 data review tells you what reaches people. It does not tell you what builds
                authority over time. A post about "5 AI tools" may outperform a post about RLS
                failure modes on engagement metrics. The second one builds the brand you want. Do
                not let short-term metrics override the M1 positioning architecture.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This arc runs at LOW load (3–4 hrs/week)</strong> and pairs
                naturally with any technical arc. The M6 cross-channel system uses Claude to multiply
                content — meaning the technical arc work directly generates brand content with marginal
                additional effort. The arcs are designed to feed each other, not compete.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
