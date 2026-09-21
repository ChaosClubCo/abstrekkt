import os
D = '/home/claude/builds/docs'
os.makedirs(D, exist_ok=True)

docs = {}

# ─── 01 PRICING AND PACKAGING SHEET ─────────────────────────────────────────
docs['01-pricing-packaging'] = """# FlashFusion — Pricing & Packaging

**Version:** May 2026 | **Contact:** kyle@flashfusion.co | **Audit:** audit.flashfusion.co

---

## Services

### AI Setup Audit — $4,500 (blended)
**Timeline:** 1 week  
**What you get:**
- Pre-call discovery session (60 min)
- Audit scorecard analysis across 8 dimensions
- Gap analysis with severity ratings (High / Medium / Low)
- Priority matrix (Impact vs. Effort)
- Written audit report with specific recommendations
- 30-min debrief call

**Right for:** Teams that have deployed AI tools but aren't sure what's working, what's missing, or what to do next. Also right as the entry point before a Sprint.

---

### Enablement Sprint — $5,000 fixed
**Timeline:** 4–5 weeks  
**What you get:**
- Everything in the AI Setup Audit
- Skill pack selection and configuration (up to 5 packs)
- Deployment to your Claude environment
- Team training session (90 min)
- Skills user guide
- Sprint Summary Report with ROI baseline

**Right for:** Teams ready to deploy AI workflows in production with governance and measurable outcomes.

---

### Managed Retainer — $2,000/month
**Timeline:** Ongoing (3-month minimum)  
**What you get:**
- Monthly vCAIO advisory memo
- 2 async strategy reviews per month
- Ongoing skill pack maintenance and updates
- Priority response (24hr SLAs)
- Quarterly business review

**Right for:** Teams that want ongoing AI governance, monthly signal digests, and a strategic partner — not a one-time project.

---

### Skills Library — $1,500 one-time
**What you get:**
- Access to all 25 FlashFusion skill packs
- Configuration guide
- Trigger phrase documentation
- 60-min setup call

**Right for:** Technical teams that can self-configure and just need the skill packs.

---

## Notes
- All prices in USD
- Audits count toward Sprint cost if booked within 60 days
- Custom skill development available: quoted per engagement
- Governing law: Illinois

---

*Updated May 2026. Subject to change. Quotes valid 30 days from issue.*
"""

# ─── 02 SOW TEMPLATE ─────────────────────────────────────────────────────────
docs['02-sow-template'] = """# FlashFusion — Statement of Work

**Date:** [DATE]  
**Client:** [CLIENT COMPANY]  
**Client Contact:** [NAME], [TITLE]  
**FlashFusion Contact:** Kyle Rosebrook — kyle@flashfusion.co  

---

## 1. Scope of Work

FlashFusion will deliver the following:

**Service:** [AI Setup Audit / Enablement Sprint / Managed Retainer]  
**Start Date:** [DATE]  
**Duration:** [DURATION]  
**Investment:** $[AMOUNT]

**Deliverables:**
- [DELIVERABLE 1]
- [DELIVERABLE 2]
- [DELIVERABLE 3]

---

## 2. Out of Scope

The following are explicitly excluded unless added via Change Order:
- Software development or custom application builds
- Ongoing model hosting or infrastructure management
- Legal or compliance advice
- Work outside the agreed deliverable list above

---

## 3. Milestones

| Milestone | Deliverable | Target Date |
|---|---|---|
| Kickoff | Discovery session complete | Week 1 |
| Mid-point | Audit report / Skill deployment | Week 2-3 |
| Completion | Final report + training | Week 4-5 |

---

## 4. Client Responsibilities

Client agrees to:
- Provide admin access to Claude environment within 5 business days of kickoff
- Complete intake form within 3 business days of kickoff
- Designate an internal champion for the engagement
- Make a designated contact available for weekly check-ins

---

## 5. Payment Terms

**Structure:** [Milestone / Net-30 / Upfront]  
**Invoice 1:** $[AMOUNT] — due [DATE / on kickoff]  
**Invoice 2:** $[AMOUNT] — due [DATE / on completion]  

Invoices are due within 30 days of receipt. Late payments accrue 1.5% monthly interest.

---

## 6. Change Orders

Any scope changes require a written Change Order, agreed to by both parties before additional work begins. Change Orders are billed at $250/hour unless a fixed price is negotiated.

---

## 7. Intellectual Property

Work product created under this SOW is owned by Client upon receipt of full payment. FlashFusion retains the right to describe the engagement type and outcomes in anonymized case studies unless Client requests otherwise in writing.

---

## 8. Governing Law

This agreement is governed by the laws of the State of Illinois.

---

**Accepted:**

Client: _________________________ Date: _________

FlashFusion: Kyle Rosebrook Date: _________
"""

# ─── 03 SKILLS LIBRARY CATALOG ───────────────────────────────────────────────
docs['03-skills-library-catalog'] = """# FlashFusion Skills Library — Full Catalog

**Version:** May 2026 | 25 production-ready Claude skill packs

---

## Included Skills (20)

| # | Skill ID | Category | What It Does |
|---|---|---|---|
| 1 | generating-social-posts | Content | LinkedIn/X/Threads/Blog/Audio posts in Kyle's voice. Hook A/B/C variants. |
| 2 | drafting-multi-format-content | Content | 48 templates: video scripts, threads, carousels, customer lifecycle emails. |
| 3 | producing-ai-newsletter | Content | Multi-config newsletter: research, draft, edit, format, deliver. |
| 4 | workflow-automation | Automation | n8n, Zapier, Make. Multi-step SaaS workflow automation. |
| 5 | orchestrating-ai-agents | Automation | MCP, LangChain, CrewAI. Multi-agent system design and deployment. |
| 6 | task-decomposition | Automation | Complex requests into parallel workstreams with dependency tracking. |
| 7 | roi-calculator-building | Sales | B2B ROI models. Payback period, net value, executive narrative. |
| 8 | ai-solution-architecture | Sales | Pre-sales technical architectures. Integration mapping, risk flags. |
| 9 | generating-kb-articles | Documentation | .docx KB articles, SOPs, runbooks, onboarding guides. |
| 10 | applying-adversarial-review | Analysis | Claims labeled sourced/generated. Agreement streak detection. |
| 11 | code-auditor | Engineering | Architecture, security, performance, tech debt analysis. |
| 12 | frontend-design | Engineering | Production-grade frontend with design brief gate. |
| 13 | applying-sparc-methodology | Engineering | Spec → Pseudocode → Architecture → Refinement → Completion. |
| 14 | engineering-staff-workflows | Engineering | Security-first staff engineer workflow. WSJF, threat modeling. |
| 15 | debug-like-expert | Engineering | Systematic root cause analysis with hypothesis testing. |
| 16 | writing-shell-scripts | Engineering | MSP-grade Bash/PS1 with adversarial audit gate. |
| 17 | managing-design-briefs | Design | Anti-slop gates, locked tokens. FF and INT brand profiles. |
| 18 | elite-ui-design | Design | Full product design: experience thesis to component architecture. |
| 19 | developing-skills | Platform | Creating/managing Claude skills. March 2026 spec compliance. |
| 20 | packaging-skills | Platform | Production zip files for distribution. |

---

## Add-On Skills (5)

| # | Skill ID | Category | What It Does |
|---|---|---|---|
| 21 | ai-audit-delivery | Delivery | FF AI Setup Audits end-to-end. Gap analysis, priority matrix, report. |
| 22 | enablement-sprint-planning | Delivery | 5-week sprint structure, milestone definition, delivery checklist. |
| 23 | client-communication | Delivery | Full lifecycle comms: intake, weekly update, milestone, QBR. |
| 24 | competitive-intelligence | Sales | Battle card maintenance, competitor monitoring, objection prep. |
| 25 | retainer-management | Delivery | Monthly retainer ops: reporting, scope management, renewal triggers. |

---

## Deployment Notes

**Requirements:** Claude.ai Pro, Team, or Enterprise plan. Admin access to configure skill packs.

**Configuration time per skill:** 15–30 minutes (selection, trigger phrase review, allowed-tools verification)

**Full deployment (25 skills):** 4–6 hours including testing

**Compliance checklist before deploy:**
- [ ] "Use when..." triggers defined
- [ ] Version nested under metadata
- [ ] Hooks not enabled on claude.ai skills (not supported)
- [ ] Allowed-tools set to least-privilege

---

*Skills are maintained and updated by FlashFusion. Contact kyle@flashfusion.co for custom skill development.*
"""

# ─── 04 CLIENT ONBOARDING CHECKLIST ──────────────────────────────────────────
docs['04-client-onboarding-checklist'] = """# FlashFusion — Client Onboarding Checklist

**Engagement:** [SERVICE TYPE]  
**Client:** [COMPANY]  
**Start Date:** [DATE]  

---

## FlashFusion (Pre-Kickoff)

- [ ] SOW signed and countersigned
- [ ] Invoice 1 sent
- [ ] Kickoff calendar invite sent (with agenda attached)
- [ ] Intake form link sent
- [ ] Client added to project tracker
- [ ] Onboarding Hub URL sent to client
- [ ] Internal champion identified and confirmed

---

## Client (Before Kickoff Call)

- [ ] SOW signed and returned
- [ ] Intake form completed
- [ ] Kickoff call confirmed
- [ ] Claude environment admin access provisioned
- [ ] Internal champion introduced via email

---

## Kickoff Call Agenda (60 min)

1. **Introductions and context** (10 min) — Who's in the room, what each person owns
2. **Audit review / Discovery** (20 min) — What the audit found, what we're solving
3. **Scope walkthrough** (15 min) — Deliverables, timeline, milestones, what we need from them
4. **Access and logistics** (10 min) — Environment access, communication channels, check-in cadence
5. **Q&A and next steps** (5 min) — One owner, one action from each side before next week

---

## Week 1 Must-Haves

**From FlashFusion:**
- [ ] Kickoff notes sent within 24 hours
- [ ] First deliverable started
- [ ] Week 2 check-in scheduled

**From Client:**
- [ ] Claude environment access confirmed working
- [ ] Any blockers surfaced (don't wait for the check-in)

---

## Communication Protocol

**Primary channel:** Email  
**Response SLA:** 24 hours (business days)  
**Weekly check-in:** [DAY/TIME]  
**Emergency contact:** kyle@flashfusion.co  

---

*This checklist is the source of truth for engagement launch. If any item is incomplete at kickoff, surface it immediately — not at week 2.*
"""

# ─── 05 CASE STUDY TEMPLATE ──────────────────────────────────────────────────
docs['05-case-study-template-butler'] = """# Case Study: AI Skills Deployment
## Client: [ANONYMIZED — Technology Services Firm]

**Engagement Type:** Skills Library — Custom 5-Skill Suite  
**Timeline:** March–April 2026  
**Company Size:** [SMB]  
**Industry:** Technology Services  

---

## The Situation

The client was using Claude for ad-hoc tasks across their team, but usage was inconsistent and outputs varied widely depending on who was prompting. There were no shared skill packs, no consistent prompt structures, and no way to ensure the team was getting reliable, production-quality outputs.

---

## What We Built

FlashFusion conducted a skills needs assessment and configured a custom 5-skill suite tailored to the client's workflows. The suite was deployed to their Claude environment with:

- Trigger phrase documentation for each skill
- Allowed-tools configuration following least-privilege principles
- A team onboarding guide covering when and how to use each skill
- A 60-minute training session with the core team

A Teams migration agent is currently in progress to extend the deployment into their Microsoft Teams environment.

---

## The Result

- 5 custom skill packs deployed and in active use
- Team onboarded and trained in under 4 weeks from kickoff
- Consistent, production-quality outputs replacing ad-hoc prompting
- Migration agent in progress for deeper workflow integration

---

## Engagement Health

**Status:** Complete (core engagement) / In progress (Teams agent)  
**Health Score:** 100%  
**Client Satisfaction:** [Collect quote]  

---

## Quote

*[Pending — collect from client after Teams migration agent is delivered]*

---

*Case study pending final client approval for external publication. Anonymized version ready for use in sales materials.*
"""

# ─── 06 COMPETITOR BATTLE CARD ───────────────────────────────────────────────
docs['06-competitor-battle-cards'] = """# FlashFusion — Competitor Battle Cards

**Updated:** May 2026

---

## Microsoft Copilot

**Their pitch:** AI integrated with M365. Your team already uses Teams and Outlook.

**Their positioning:** Productivity-first, locked to Microsoft stack.

**Our counter:** Copilot doesn't have a Trust layer. No audit trail. No auto-generated compliance artifacts. When your auditor asks what your AI agents did last quarter, Copilot has no answer.

**We win when:**
- Compliance requirement exists (SOC 2, HIPAA) — we generate audit artifacts automatically
- Stack is not 100% Microsoft — we're platform-agnostic
- They need an audit trail — we log every agent action

**We lose when:**
- 100% Microsoft shop with no compliance obligations
- Copilot is bundled and appears "free"

**Common objection:** "We already have Copilot."  
**Response:** Copilot is a productivity tool. FlashFusion is a governance and enablement layer. Ask your auditor how they'd document your Copilot agent actions.

---

## LangChain / DIY Build

**Their pitch:** Open source, infinitely customizable.

**Our counter:** LangChain gives you the engine. You have to build the compliance infrastructure yourself — and maintain it. That's an ongoing engineering cost most teams underestimate by 3–5x.

**We win when:**
- Time to value matters (4–5 weeks vs. 3–6 months)
- They don't want to maintain a platform
- Compliance layer is required

**We lose when:**
- They need truly custom agent logic our builder doesn't cover
- Engineering team has strong OSS bias with no technical champion for us

**Common objection:** "We can build this ourselves."  
**Response:** You can. Most teams that try spend 3–6 months getting to parity, then 20% of an engineer's ongoing time maintaining it. What's the opportunity cost?

---

## Doing Nothing

**Their pitch:** We're not ready. We'll evaluate AI later.

**Our counter:** Every month of delay is a month of compounding competitive disadvantage.

**We win when:**
- Regulatory risk is real and imminent
- Competitor pressure is explicit
- Low entry cost matters ($4,500 audit vs. ongoing manual documentation)

**We lose when:**
- Genuine budget freeze until next FY
- No leadership buy-in — single champion can't move it

**Common objection:** "We're not ready for AI yet."  
**Response:** What would ready look like? An AI Setup Audit is designed for that exact moment — it tells you exactly where you are and what to do first.

---

## ChatGPT Enterprise

**Their pitch:** GPT-4o is the best model. Enterprise tier has SSO and data privacy.

**Our counter:** ChatGPT Enterprise solves data privacy. It doesn't solve workflow integration, skill deployment, or compliance artifact generation. It's a chat interface with guardrails — not an enablement platform.

**We win when:**
- They need skill deployment across a team (not individual custom instructions)
- They need workflow integration (we connect to their stack)
- They need an audit trail

**We lose when:**
- Raw generation quality is the primary use case
- Non-technical buyer with strong OpenAI brand preference

**Common objection:** "We use ChatGPT Enterprise already."  
**Response:** FlashFusion isn't a replacement — it's a deployment and governance layer on top. You keep your models. We add the infrastructure ChatGPT doesn't have.

---

*Battle cards reviewed monthly. Update immediately after any competitor pricing or feature announcement.*
"""

# ─── 07 vCAIO SERVICE DESCRIPTION ────────────────────────────────────────────
docs['07-vcaio-service-description'] = """# FlashFusion vCAIO — Virtual Chief AI Officer

**Available:** Month 12+ of engagement (via Managed Retainer)

---

## What It Is

The vCAIO tier is FlashFusion's senior advisory layer for clients who have deployed AI workflows and need ongoing strategic guidance — not just maintenance.

A virtual Chief AI Officer reads the landscape, connects external signals to your specific environment, and tells you what to do next before the question is even on your radar.

---

## What You Get (Monthly)

**vCAIO Advisory Memo**
- Executive summary: 3 bullets on what matters this month
- Signal digest: 2–3 external AI developments with specific implications for your business
- Environment observations: what we see in your usage data and team behavior
- Recommended actions: 3 priorities, ranked, specific, owned
- Watch list: 1 risk or uncertainty to track next month

**2 Async Strategy Reviews**
- Submit a strategic question, decision, or proposal
- Receive a structured written analysis within 48 hours
- Covers architecture, build-vs-buy, vendor evaluation, team structure

**Ongoing Skill Pack Maintenance**
- Monitor for new skill capabilities and update configurations
- Respond to Claude model updates that affect skill behavior
- Add new skills as your use cases expand

**Priority Response**
- 24-hour SLA on all communications
- Direct access — not a ticketing queue

**Quarterly Business Review**
- Full quarter summary: delivered, outcomes, misses
- Q+1 recommendation with rationale

---

## What It Costs

**$2,000/month** (minimum 3-month commitment, then month-to-month)

Included in: Managed Retainer tier. Not available as standalone until 12 months of engagement history exists.

---

## Who It's For

Teams that:
- Have deployed AI workflows in production
- Need someone to tell them what the AI landscape means for their business — not just report on it
- Want a strategic partner who knows their environment, not a consultant who has to re-learn it every call

---

*Available to qualifying Managed Retainer clients. Ask Kyle for qualification criteria.*
"""

# ─── 08 MANAGED RETAINER AGREEMENT ──────────────────────────────────────────
docs['08-managed-retainer-agreement'] = """# FlashFusion — Managed Retainer Agreement

**Date:** [DATE]  
**Client:** [COMPANY]  
**Contact:** [NAME], [TITLE]  
**FlashFusion:** Kyle Rosebrook — kyle@flashfusion.co  

---

## 1. Services

FlashFusion will provide the following on an ongoing monthly basis:

- Monthly vCAIO Advisory Memo
- 2 async strategy reviews per month (48hr turnaround)
- Ongoing skill pack maintenance and configuration updates
- Priority response (24hr SLA on all communications)
- Quarterly Business Reviews (every 3 months)

Additional services (training sessions, custom skill development, sprint work) are scoped and billed separately.

---

## 2. Term

**Start Date:** [DATE]  
**Minimum Term:** 3 months  
**Renewal:** Month-to-month after minimum term  
**Cancellation:** 30 days written notice after minimum term  

---

## 3. Monthly Investment

**$2,000 per month**

Invoiced on the [1st / 15th] of each month. Due within 30 days. Late payments accrue 1.5% monthly interest.

---

## 4. Scope Boundaries

This retainer covers strategic advisory and skill maintenance within the agreed scope. It does not include:
- Software development or application builds
- Unlimited async reviews beyond 2 per month
- Work that would constitute legal, financial, or compliance advice
- Travel

---

## 5. Confidentiality

Both parties agree to keep engagement specifics, client data, and strategic discussions confidential. FlashFusion may reference the engagement type in anonymized case studies unless Client requests otherwise in writing.

---

## 6. Governing Law

State of Illinois.

---

**Accepted:**

Client: _________________________ Date: _________

FlashFusion: Kyle Rosebrook Date: _________
"""

# ─── 09 PARTNERSHIP PITCH (ANTHROPIC) ────────────────────────────────────────
docs['09-partnership-pitch-anthropic'] = """# FlashFusion — Anthropic Partnership Pitch

**Prepared by:** Kyle Rosebrook, FlashFusion  
**Version:** May 2026 | **DRAFT — not sent**

---

## Who We Are

FlashFusion is a B2B AI enablement consultancy that helps 200–2,000-person companies deploy Claude in production — with governance, skill packs, and measurable ROI.

We are not a reseller. We are the deployment and enablement layer that turns Claude licenses into business outcomes.

---

## What We've Built on Claude

- 25 production-ready Claude skill packs covering content, automation, engineering, sales, and delivery
- An AI Setup Audit methodology that diagnoses AI readiness across 8 dimensions
- A client delivery system built on Claude's API, Claude.ai, and Claude Code
- Active client deployments (Chris Butler engagement complete; pipeline building)

---

## Why This Matters for Anthropic

**The Problem:** Many companies have Claude licenses but don't know how to deploy them effectively. They churn. They blame the model. The actual problem is governance, skill deployment, and workflow integration — not the model.

**FlashFusion solves the activation gap.** We take companies from "we have Claude" to "Claude is generating measurable ROI in our workflows."

---

## What We're Asking For

1. **Referral arrangement:** Anthropic enterprise reps refer clients who need enablement help (not just licenses)
2. **Co-marketing:** Joint case study or co-authored content on AI governance and skill deployment
3. **Early access:** Access to Claude model updates and API features before public release for testing and skill pack updates

---

## What We Offer in Return

- A proven deployment methodology Anthropic can point to
- Case studies demonstrating Claude ROI in SMB/mid-market
- Honest feedback from the field on what's blocking adoption

---

## Contact

Kyle Rosebrook — kyle@flashfusion.co  
FlashFusion.co | audit.flashfusion.co

*This pitch is not finalized. Do not send until kylerosebrook.com is live and at least 2 public case studies exist.*
"""

# ─── 10 SERVICE DELIVERY PLAYBOOK ────────────────────────────────────────────
docs['10-service-delivery-playbook'] = """# FlashFusion — Service Delivery Playbook

**Version:** May 2026 | Internal reference only

---

## The Four Phases of Every Engagement

### Phase 1: Diagnosis (Week 1)
**Goal:** Understand exactly what's broken and what's possible.

Deliverables:
- Intake form completed
- Kickoff call done
- Audit scorecard analyzed
- Gap analysis written
- Client debrief call

Key failure mode: Rushing past diagnosis to deploy. Every sprint that fails traces back to a bad diagnosis.

---

### Phase 2: Configuration (Week 2)
**Goal:** Build what they need, not what we assumed they needed.

Deliverables:
- Skill pack selection (trace each to an audit gap)
- Configuration for their environment
- Trigger phrases documented
- Allowed-tools set to least-privilege

Key failure mode: Deploying generic skill packs that aren't configured for their workflows.

---

### Phase 3: Deployment and Training (Weeks 3–4)
**Goal:** Get the team using it, not just installed it.

Deliverables:
- Pilot group deployed (3–5 people, Week 3)
- Feedback collected and friction addressed
- Full team deployed (Week 4)
- Training session delivered (90 min)
- Skills user guide handed off

Key failure mode: Skipping the pilot and going straight to full rollout. Friction that surfaces in a pilot is manageable. Friction that surfaces in full rollout damages trust.

---

### Phase 4: Measurement and Handoff (Week 5)
**Goal:** Prove the ROI. Leave them able to operate without us.

Deliverables:
- Usage data collected
- ROI summary built (actuals vs. projections)
- Sprint Summary Report delivered
- Admin access confirmed for client
- Next steps presented (retainer, follow-on sprint, or standalone)

Key failure mode: Leaving without a measurement baseline. "AI is helpful" is not a result.

---

## Communication Standards

- Every call has an agenda sent 24 hours before
- Every call has notes sent within 24 hours after
- Every week has a written status update (see Stakeholder Update prompt)
- No surprises — surface blockers before the check-in, not during

---

## What Makes Engagements Succeed

1. A champion on the client side who has authority and cares
2. Admin access to their Claude environment within Week 1
3. Honest audit — no gap gets softened because it's uncomfortable
4. Pilot before full rollout, always

---

## What Makes Engagements Fail

1. Vague scope with no explicit out-of-scope list
2. No internal champion (buy-in lives and dies with one person)
3. Deploying before diagnosis is complete
4. Not collecting ROI data — makes renewal conversations impossible
"""

# ─── 11 NDA TEMPLATE ─────────────────────────────────────────────────────────
docs['11-nda-template'] = """# Non-Disclosure Agreement

**Date:** [DATE]  
**Disclosing Party:** [COMPANY NAME], ("Company")  
**Receiving Party:** Kyle Rosebrook, FlashFusion ("FlashFusion")  

---

## 1. Purpose

The parties wish to explore a potential business engagement. In connection with that engagement, each party may disclose confidential information to the other.

---

## 2. Definition of Confidential Information

"Confidential Information" means any non-public information disclosed by one party to the other, whether orally, in writing, or by inspection, including but not limited to: business plans, client lists, financial information, technical specifications, proprietary processes, and AI workflow configurations.

Confidential Information does not include information that: (a) is or becomes publicly available through no breach of this Agreement; (b) was known by the receiving party before disclosure; (c) is received from a third party without restriction.

---

## 3. Obligations

Each party agrees to:
- Hold all Confidential Information in strict confidence
- Use Confidential Information solely for the purpose of evaluating or conducting the potential engagement
- Not disclose Confidential Information to any third party without prior written consent
- Use at least the same degree of care used to protect its own confidential information (no less than reasonable care)

---

## 4. Term

This Agreement remains in effect for 2 years from the date of execution.

---

## 5. No License

Nothing in this Agreement grants either party any rights in or to the other party's Confidential Information except as expressly set forth herein.

---

## 6. Governing Law

State of Illinois.

---

**Signed:**

Company: _________________________ Date: _________

FlashFusion (Kyle Rosebrook): _________________________ Date: _________
"""

# ─── 12 INVOICE TEMPLATE ─────────────────────────────────────────────────────
docs['12-invoice-template'] = """# INVOICE

---

**FlashFusion**  
Kyle Rosebrook  
kyle@flashfusion.co  
flashfusion.co  

---

**Invoice #:** FF-[YEAR]-[NUMBER]  
**Date:** [DATE]  
**Due Date:** [DATE + 30 DAYS]  

---

**Bill To:**  
[CLIENT COMPANY]  
[CONTACT NAME]  
[EMAIL]  

---

## Services

| Description | Amount |
|---|---|
| [SERVICE TYPE — e.g. AI Setup Audit] | $[AMOUNT] |
| [MILESTONE — e.g. Kickoff + Discovery] | included |
| [MILESTONE — e.g. Audit Report + Debrief] | included |

**Subtotal:** $[AMOUNT]  
**Tax:** $0 (professional services)  
**Total Due:** $[AMOUNT]  

---

## Payment

**Bank Transfer (preferred):**  
[BANK DETAILS — add once account established]

**Other methods:** Contact kyle@flashfusion.co

---

**Terms:** Net 30. Late payments accrue 1.5% monthly interest.  
**Questions:** kyle@flashfusion.co  

---

*Thank you for your business.*
"""

# ─── 13 CLIENT INTAKE FORM ───────────────────────────────────────────────────
docs['13-client-intake-form'] = """# FlashFusion — Client Intake Form

**Instructions:** Complete before kickoff call. Takes approximately 10 minutes. Send completed form to kyle@flashfusion.co.

---

## Company and Team

1. Company name:
2. Industry and primary business:
3. Company size (total employees):
4. Team size that will use AI tools:
5. Your role and title:
6. Internal champion for this engagement (name, role):

---

## Current AI Environment

7. What AI tools are currently deployed or in use? (List all — including unofficial use like personal ChatGPT accounts)
8. What are team members primarily using AI for today?
9. Who manages your Claude or AI tool administration?
10. Do you have an existing AI usage policy? (Yes / No / In progress)

---

## The Problem We're Solving

11. What specific problem or gap prompted you to engage FlashFusion?
12. What does success look like at the end of this engagement? (Be specific — "team is using Claude for X workflow and saving Y hours per week")
13. What has already been tried that didn't work?

---

## Access and Logistics

14. What access will FlashFusion need to your Claude environment? (Admin / Limited / TBD)
15. Any systems or integrations we should know about? (Notion, HubSpot, Drive, n8n, etc.)
16. Any compliance or data handling constraints we need to work within?

---

## Communication

17. Preferred communication channel (Email / Slack / Teams):
18. Best time for weekly check-in call:
19. Anything else we should know before the kickoff call?

---

*Send to: kyle@flashfusion.co | Questions: same address*
"""

# ─── 14 QBR REPORT TEMPLATE ──────────────────────────────────────────────────
docs['14-qbr-template'] = """# FlashFusion — Quarterly Business Review

**Client:** [COMPANY]  
**Quarter:** Q[N] [YEAR]  
**Prepared by:** Kyle Rosebrook — FlashFusion  
**Date:** [DATE]  

---

## Quarter Summary

[3 sentences: what we set out to do, what we delivered, headline outcome]

---

## What We Delivered

- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]
- [Skill packs deployed: list]

---

## Outcomes

| Metric | Baseline | Current | Change |
|---|---|---|---|
| Hours saved/week | [N] | [N] | [+/-N] |
| Skill packs active | 0 | [N] | +[N] |
| Team adoption | 0% | [N]% | +[N]% |
| ROI (projected) | — | [N]% | — |

[Narrative: 2–3 sentences on what these numbers mean]

---

## What Didn't Go as Planned

[Honest account. If something was late, incomplete, or missed — say so. Include root cause and what changed.]

---

## Q[N+1] Recommendations

1. [Priority 1 — with rationale]
2. [Priority 2 — with rationale]
3. [Priority 3 — with rationale]

**Recommended service for next quarter:** [Sprint / Retainer continuation / Custom / None]

---

## Questions for This Meeting

1. [Discussion question 1]
2. [Discussion question 2]
3. [Renewal / next steps]

---

*QBR delivered via email and reviewed in a 60-minute call. Questions: kyle@flashfusion.co*
"""

# ─── 15 SKILLS LIBRARY USER GUIDE ────────────────────────────────────────────
docs['15-skills-library-user-guide'] = """# FlashFusion Skills Library — User Guide

**Version:** May 2026

---

## What Skills Are

Claude skills (also called skill packs) are pre-configured instruction sets that tell Claude how to behave for a specific task. Instead of writing a custom prompt every time, skills let you trigger expert-level behavior with a short phrase.

Example: Type "generating-social-posts" and Claude knows to produce LinkedIn/X/Threads content in the right voice, with hook variants, without any additional instructions.

---

## How to Activate a Skill

**In Claude.ai:**
1. Start a new conversation
2. Type the skill's trigger phrase (e.g., "generating-social-posts")
3. Add your task context

The skill activates automatically when it detects its trigger phrases in the conversation.

**Trigger phrase examples:**
- "generating-social-posts: write a LinkedIn post about AI governance"
- "workflow-automation: help me automate my CRM to Notion sync"
- "applying-adversarial-review: pressure-test this proposal"

---

## The 25 Skills

### Content (3 skills)
- **generating-social-posts** — LinkedIn/X/Threads/Blog/Audio posts with hook A/B/C variants
- **drafting-multi-format-content** — 48 templates: scripts, threads, carousels, lifecycle emails
- **producing-ai-newsletter** — Full newsletter production: research to delivery

### Automation (3 skills)
- **workflow-automation** — n8n, Zapier, Make workflows
- **orchestrating-ai-agents** — Multi-agent systems with MCP, LangChain, CrewAI
- **task-decomposition** — Complex requests into parallel workstreams

### Engineering (6 skills)
- **code-auditor** — Architecture, security, performance analysis
- **frontend-design** — Production UI with design brief gate
- **applying-sparc-methodology** — Structured development methodology
- **engineering-staff-workflows** — Security-first staff engineer workflow
- **debug-like-expert** — Systematic root cause analysis
- **writing-shell-scripts** — MSP-grade Bash/PS1 with audit gate

### Sales (2 skills)
- **roi-calculator-building** — B2B ROI models with payback period and executive narrative
- **ai-solution-architecture** — Pre-sales technical architectures

### Documentation (1 skill)
- **generating-kb-articles** — .docx KB articles, SOPs, runbooks

### Analysis (1 skill)
- **applying-adversarial-review** — Claims sourced/generated, agreement streak detection

### Design (2 skills)
- **managing-design-briefs** — Anti-slop gates, locked design tokens
- **elite-ui-design** — Full product design orchestration

### Platform (2 skills)
- **developing-skills** — Creating Claude skills per March 2026 spec
- **packaging-skills** — Production zip files for distribution

---

## Tips for Best Results

1. **Be specific in your task context.** Skills set the behavior; you still need to provide the task.
2. **Use the skill name as a prefix.** "workflow-automation: [task]" is clearer than hoping the skill activates from context.
3. **Check the SKILL.md for each skill's "Use when..." trigger.** Skills activate on specific phrases — if one isn't firing, check the trigger documentation.
4. **Don't stack multiple skills in one prompt.** Use one skill per task for cleanest results.

---

*Questions or issues: kyle@flashfusion.co*
"""

# ─── 16 FLASHFUSION BRAND GUIDE ──────────────────────────────────────────────
docs['16-flashfusion-brand-guide'] = """# FlashFusion — Brand Guide

**Version:** May 2026 | Internal reference

---

## Brand Positioning

**One-line:** B2B AI enablement for companies that are deploying Claude and need governance, skill deployment, and measurable ROI.

**Not:** A software product. A staffing agency. An AI agency that does everything. A managed IT firm.

**Voice:** Practitioner talking to practitioner. Direct. No buzzwords. Says what it means. Engineering metaphors are literal.

---

## Visual Identity

### Colors
| Name | Hex | Use |
|---|---|---|
| Background | #09090f | Primary background |
| Card | #12121e | Surface / card background |
| Purple (primary) | #7c3aed | CTAs, accents, highlights |
| Light purple | #a78bfa | Data values, secondary accent |
| Cyan | #06b6d4 | Gradient partner to purple |
| Text primary | #f1f5f9 | Body text |
| Text muted | #94a3b8 | Secondary text |
| Text subtle | #64748b | Labels, metadata |

### Typography
- **Headings:** Poppins (weight: 500, 600)
- **Body:** Inter or system-ui (weight: 400, 500)
- **Code:** Monospace (system)

### Design Aesthetic
Dark neon-glass. High contrast. Purple glow. Clean grids. No gradients except purple → cyan on key metrics.

Anti-slop gates:
- No generic hero stock photography
- No "AI brain" imagery
- No gradient buttons that look like every other SaaS
- No Comic Sans anywhere near this brand ever

---

## Voice Rules

**Do:**
- State what happens, not what we hope for
- Use numbers when you have them
- Name the specific problem before proposing a solution
- Say "we" sparingly — "FlashFusion" is more precise

**Don't:**
- "We're excited to..."
- "Leveraging AI to transform..."
- "Holistic approach"
- "Best-in-class"
- "Robust" (ever)
- Weasel words: "up to," "as much as," "potentially"

---

## Lane Separation (Critical)

FlashFusion (this brand) is completely separate from:
- **kylerosebrook.com** — personal brand and memoir distribution hub
- **ChaosClubCo** — mental health peer support platform (red brand, #e11d48)

Never conflate these three brands in any output. A FlashFusion client should not encounter ChaosClub content and vice versa.

---

## External Description of Day Job

The correct public description is: "a managed IT firm." No MSP, no managed services, no company name, no role + hire year combination.

---

*Brand guide maintained by Kyle Rosebrook. Questions: kyle@flashfusion.co*
"""

# ─── 17 PRESS KIT AND BIO ────────────────────────────────────────────────────
docs['17-press-kit-bio'] = """# FlashFusion — Press Kit and Bio

**Version:** May 2026 | DRAFT — not public until kylerosebrook.com is live

---

## Kyle Rosebrook — Bio (Long)

Kyle Rosebrook is the founder of FlashFusion, a B2B AI enablement consultancy that helps mid-market companies deploy Claude in production — with governance, skill packs, and measurable ROI.

Before FlashFusion, Kyle spent years developing an instinct he didn't have a name for: diagnosing. He learned it behind the bar at O'Toole's, reading what people needed before they asked. He applied it on the production floor, reading where a process was about to fail. He carried it into technology, reading where systems and teams were breaking down in ways they hadn't articulated yet.

That diagnostic instinct — the ability to read rooms, processes, and systems — survived a significant health disruption that rewired how he works. He came back not to where he was before, but to something built from scratch on the other side. FlashFusion is part of what got built.

He is also writing *Construction, Not Recovery*, a literary memoir addressed to his daughter. The book is about building a self rather than recovering one — because there is no prior state to return to.

Kyle is based in the Chicago suburbs.

---

## Kyle Rosebrook — Bio (Short, 75 words)

Kyle Rosebrook is the founder of FlashFusion, a B2B AI enablement consultancy. He helps mid-market companies deploy Claude in production with governance, skill deployment, and measurable ROI. Before FlashFusion, he spent years diagnosing — in a bar, on a production floor, and in technology — before building a practice around what that instinct reveals about AI adoption gaps. He is also writing *Construction, Not Recovery*, a memoir addressed to his daughter.

---

## FlashFusion — Company Description

**One sentence:** FlashFusion is a B2B AI enablement consultancy that helps 200–2,000-person companies deploy Claude with governance, skill packs, and measurable ROI.

**Short paragraph:** FlashFusion works with mid-market companies that have deployed AI tools but lack the governance, workflow integration, and institutional knowledge to get consistent, measurable results. Services range from a one-week AI Setup Audit ($4,500) to Managed Retainer engagements with ongoing vCAIO advisory. FlashFusion is built on Claude and Anthropic's ecosystem.

---

## Contact

Kyle Rosebrook  
kyle@flashfusion.co  
flashfusion.co  
audit.flashfusion.co  

*Press kit not final. Do not distribute until kylerosebrook.com is live and at least 2 case studies exist.*
"""

# ─── 18 PARTNERSHIP PITCH (KELAN) ────────────────────────────────────────────
docs['18-co-founder-pitch-kelan'] = """# FlashFusion — Co-Founder Conversation: Kelan

**Purpose:** Internal brief for the co-founder conversation with Kelan  
**Status:** DRAFT — conversation pending, do not share  
**Date:** May 2026

---

## What Kelan Knows

Kelan was a former colleague. Ran solo ops for Sole Revival. Knows something is brewing at FlashFusion — hasn't seen the full scope.

---

## What to Show Him

Before the co-founder conversation, show Kelan:
1. The live AI Setup Audit Scorecard at audit.flashfusion.co
2. The full skills library (25 packs)
3. The revenue model and $222K Y1 target
4. The pipeline (Ryan Anderskow, Mark Hope)
5. This document: the full FF inventory

The goal is not to pitch him. It's to let him see the scope and assess whether his skills and interest are additive.

---

## Kelan's Potential Role

**Sales and Ops** — if the fit is there.

What that means:
- Owns outbound pipeline development
- Manages client relationships post-close
- Builds and runs the operational infrastructure (CRM, project tracking, billing)
- Eventually: team management if we scale past solo delivery

---

## What the Co-Founder Conversation Is Not

- A negotiation (not there yet)
- A commitment (initial conversation only)
- An employment offer

---

## Questions to Answer in the Conversation

1. Does Kelan want to build this or just participate in it?
2. Does he see the market opportunity clearly?
3. What does he bring that fills a real gap?
4. Are there any conflicts of interest from current work?

---

## What Lafu's Role Changes

Lafu is already onboard as technical co-founder. Background: prior working relationship at cstmprnt in Waukegan. Kelan, if brought in, would be the third leg: sales/ops, not technical.

---

## Timing

Do not have this conversation until:
- [ ] kylerosebrook.com is live
- [ ] flashfusion.co is live and indexed
- [ ] At least one paying client beyond Chris Butler
- [ ] The full inventory (this document) is complete

*This document is internal only. Never shared with Kelan before the conversation is ready.*
"""

# Write all docs
for slug, content in docs.items():
    path = f'{D}/{slug}.md'
    with open(path, 'w') as f:
        f.write(content)
    print(f"  {slug}.md ({len(content):,} chars)")

print(f"\nAll {len(docs)} documents written to {D}")
