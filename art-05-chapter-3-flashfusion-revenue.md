# Chapter 3 — FlashFusion Revenue Surface

> **Reframe note:** Original Chapter 3 ("FlashFusion MVP") was written January 2026 and assumed the build was the constraint. By May 2026, the build is largely operational. The constraint is now revenue. This chapter replaces the original with a focus on the IC model and first paying client. May 2026.

**Phase:** 3 (Weeks 5-10, possibly faster if Phase 2 shipped clean)
**Prerequisites:** Phase 2 complete — positioning live, external proof artifact published, stakeholder map in motion
**Outcome target:** First paid engagement closed and delivered. Repeatable delivery process documented from the inside.

---

## Reality check (May 2026)

Before this chapter starts, ground-truth what's actually live:

**Operational right now:**
- AI Setup Audit Scorecard at audit.flashfusion.co (Base44 id: `69c440b10249984f1114bc4b`)
- Fusion AI app at flashfusion.co (Base44 id: `68dd8e79ca073475565c8e16`) — closed beta posture
- Skills Library: 50 skills built, Phase 1+2 complete
- Chris Butler 5-skill suite delivered
- Customization Service active

**Not yet operational:**
- First paid AI Setup Audit (Ryan Anderskow is the prospect, outreach pending)
- Public case study on the live site (Chris Butler suite is the candidate)
- Recurring retainer revenue ($2K/mo Managed)
- vCAIO advisory positioning (premature until Audit + Sprint customers exist)

**Pricing seeded but untested in market:**
- $0 free scorecard (lead magnet)
- $1,500 Skills Library (entry bundle)
- $4,500 Enablement Sprint (working tier)
- $5,000 fixed Sprint upgrade (Chris Butler tier)
- $2,000/mo Managed Retainer (recurring tier)

The pricing only becomes real after a paying customer says yes. Until then, it's hypothesis, not data.

---

## The four projects in this phase

### Project 3A — First Paid Audit (Weeks 5-6)

**The problem:** Pricing seeded in Base44 doesn't equal pricing tested in market. Until one customer pays the audit fee, the rest of the revenue ladder is unvalidated.

**The deliverable:** One closed AI Setup Audit at the seeded price ($4,500 blended), delivered, with a written readout the customer can share internally.

**Path:**
1. Confirm Ryan Anderskow is the right first prospect (warm contact, identified in memory)
2. Send outreach using the template from artifact #9
3. Hold the discovery call. Use the 5-question diagnostic (also in #9).
4. Send the proposal — fixed scope, fixed fee, fixed timeline (90 min audit + 7 days to written readout)
5. On signed agreement: collect deposit, schedule the audit, deliver the readout

**Quality bar for the readout:**
- 8-12 pages, scannable in 15 minutes
- Specific findings, not generic advice
- At least one finding the customer didn't already know
- Clear recommendation: do nothing / do a Sprint / do a Retainer / do something else
- A page they could hand to their CFO without translation

**Failure modes to watch:**
- Customer signs but ghosts on scheduling: the proposal didn't earn enough trust. Fix the proposal, not the customer.
- Audit delivered but no follow-on: that's fine for the first one. The audit standalone is the product. Sprint upsell is bonus, not requirement.
- Customer pushes back on price: hold the price. The first paying customer sets the floor. Discounting here breaks every later conversation.

---

### Project 3B — Repeatable Delivery Process (Weeks 6-8)

**The problem:** First delivery is always semi-custom. Second delivery rebuilds the wheel. Process documentation prevents the rebuild — and is the prerequisite for handing off any delivery work to a co-founder or contractor.

**The deliverable:** A documented end-to-end delivery process, version 1, covering everything from first inbound message to closed engagement to handoff to retainer.

**Sections to write:**

1. **Inbound triage** — what counts as a real lead, what doesn't, what the response time targets are
2. **Discovery call structure** — 5-question diagnostic, time box, what to listen for, what disqualifies
3. **Proposal pattern** — the 1-page format, fixed-fee structure, payment terms, what to say if pushed
4. **Audit delivery** — 90-minute live session script, data collection list, takeaways structure
5. **Readout production** — template, time budget (4-6 hours per readout), quality gates
6. **Handoff to next stage** — how Sprint or Retainer gets pitched at the readout, what proposals look like
7. **What to log** — every customer artifact stored, every commitment tracked, every metric captured

**Reading-level test:** A peer with similar context could read this and run an audit themselves with no further training. If they couldn't, the process isn't documented well enough.

**Time budget:** 8-12 hours over 2-3 weeks. Doesn't have to be done before the first audit ships — but should be *captured* during the first audit and cleaned up after.

---

### Project 3C — Lafu Onboarding Plan (Weeks 7-9)

**The problem:** Lafu is named as technical co-founder. The relationship exists from cstmprnt. Until there's an actual division of work, "co-founder" is aspirational.

**The deliverable:** A written agreement on roles and equity, plus a 30-day plan for what Lafu actually delivers in the first month.

**Topics that need explicit decision:**
- Equity split (or vesting schedule, or deferred until revenue threshold)
- IP assignment (especially relative to prior work at cstmprnt)
- Decision rights (who has final call on technical architecture vs. revenue model)
- Time commitment expectations (full-time, part-time, "as available")
- Exit conditions (what happens if it doesn't work out — both sides protected)

**First 30 days of work, in order of leverage:**
1. Audit the Continuum stack (currently blocked on Supabase bill — Lafu may have ideas on alternatives)
2. Take ownership of the Skills Library compliance work (artifact #12)
3. Pick up one specific delivery component from the audit pipeline so the first audit doesn't have a single point of failure

**Anti-pattern to avoid:** Don't start equity discussions before role discussions. The role determines the equity, not the other way around.

**Note on Kelan:** Kelan is a candidate for sales/ops co-founder — different role, different conversation, different timing. Don't conflate the two conversations. Run them in sequence, Lafu first.

---

### Project 3D — Skills Library Compliance Resolution (Weeks 5-7, parallel)

**The problem:** 50 skills built, 4 compliance gaps gating Intinc deploy. Until those gaps close, the deploy doesn't happen. Until the deploy happens, no internal usage data exists. Until that data exists, the Customization Service positioning is theoretical.

**The deliverable:** All 4 gaps resolved, all 50 skills validated against current Anthropic spec, deployment readiness checklist completed.

**The 4 known gaps:**
1. Missing "Use when..." triggers in skill descriptions
2. Version not nested under metadata
3. Hooks present on claude.ai skills (should be code-only)
4. allowed-tools not least-privilege

This work is mostly mechanical and is the obvious first task to hand to Lafu (Project 3C). Detailed runbook is in artifact #12.

**Time budget:** 6-10 hours total if done in batch. Don't try to fix all 50 skills one at a time — write a transformer, run it, validate.

---

## Pricing discipline (read this twice)

The pricing ladder works only if the floor holds. The floor is $4,500 for the audit. Everything else builds up from there.

**Things that break the floor:**
- "Friend pricing" (it's never just one friend)
- Free audits offered to "build the portfolio" (the case study is the portfolio; the audit is the product)
- Discounts during discovery calls (signals desperation)
- Hourly billing for engagements that should be fixed-fee (loses the customer's trust in the scope)

**Things that *don't* break the floor:**
- Free 30-minute discovery call before the proposal (this is sales, not delivery)
- Refunds if the audit doesn't deliver findings the customer values (this is a quality guarantee, not a price drop)
- Bundled pricing for multi-engagement commitments (clear price math, just packaged)

**The hardest call:** The first prospect who pushes back on the $4,500 price. The pull to discount is enormous. Don't. Refer them to the free scorecard if they're not ready, and hold the price for the next prospect.

---

## Daily / weekly cadence (Phase 3)

**Monday (60 min):**
- Audit pipeline review: who's been contacted, who's responded, what's next
- Update Notion CRM (or wherever you're tracking) with current state
- Set the week's revenue-facing target (one of: send N proposals / hold N discovery calls / deliver one readout)

**Tuesday-Thursday (deep work blocks):**
- One-third of time on outbound/inbound (sales)
- One-third of time on delivery (active customer work)
- One-third of time on process / Lafu handoff / compliance work

**Friday (Kinsley protected, no work):**
- Same as before. Don't touch.

**Saturday morning (60 min, optional):**
- Pricing review: any prospect pushed back? Any audit took longer than expected? Adjust the model.

---

## Gates (do not advance without these)

By end of Week 10:

- [ ] **One paid audit closed at $4,500** (or a documented price that was held against pushback). Not "almost closed." Closed.
- [ ] **Audit delivered with written readout.** Customer has the deliverable. They've read it.
- [ ] **Delivery process v1 written down.** Anyone could follow it. (Most important: future you, when you've forgotten the details.)
- [ ] **Lafu's role and equity decided** (whatever direction — the gate is decision, not preference). If the answer is "Lafu isn't joining," that's also a passing gate.
- [ ] **Skills Library compliance resolved.** Deployment-ready, 4 gaps closed.

If 4 of 5 gates pass, advance to Phase 4 (Content & Marketing). If 3 or fewer, do not advance — root cause first.

---

## What this phase is *not* trying to do

**Not trying to land an enterprise customer.** Mark Hope is a future conversation, not a Phase 3 conversation. Enterprise sales requires a delivery track record. Phase 3 *builds* the track record.

**Not trying to scale to multiple audits per week.** One paid audit, fully delivered, is the gate. Pipeline of two more is fine. Cadence comes in Phase 4 or 5.

**Not trying to launch a vCAIO advisory.** That's Month 12+. Premature framing now.

**Not trying to launch a public newsletter.** That's Phase 4. Don't pre-launch.

---

## Risk patterns to watch for

**Risk: First audit becomes a moving target.** Symptom: scope creeps from "90-min audit + 8-page readout" to "let me also build you a thing while we're at it." Mitigation: written scope in the proposal, deliverable hand-off as the closeout, anything beyond is a new engagement.

**Risk: Lafu conversation gets emotional before it gets structural.** Symptom: equity numbers discussed before role boundaries. Mitigation: write the role first, equity second, in that order, in writing.

**Risk: Pricing discount on the first sale.** Already covered above. The discipline matters.

**Risk: The audit becomes a freebie disguised as a pilot.** Symptom: prospect says "let's do it but I'll pay if I'm happy." Mitigation: that's not an audit, that's a free trial. Decline politely.

**Risk: Delivery quality drops because volume increases.** Symptom: second audit takes 14 hours instead of 6. Mitigation: that's why the process documentation exists. Use it. Update it.

---

## Hand-off to Phase 4

The end-state of Phase 3 is: revenue is real (not theoretical), one customer has paid the floor price and accepted delivery, the process is documented, and the team structure (Lafu, possibly Kelan) is in motion.

Phase 4 (Content & Marketing) becomes possible because there's now a customer story to tell. Without Phase 3 closing, Phase 4 collapses into self-promotion. With it, Phase 4 is amplification of real outcomes.

If Phase 3 closes a customer in 4-5 weeks instead of 6, advance early. The phases are gates, not calendars.

---

**CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS**
- [SOURCED] Pricing tiers ($4,500 / $5,000 / $2,000mo) come from project memory.
- [SOURCED] Lafu identified as technical co-founder candidate per memory.
- [SOURCED] Skills Library compliance gaps documented in project knowledge.
- [GENERATED] All Phase 3 timing estimates are reasoned, not measured.
- ! [SOURCED] Original Chapter 3 framed FlashFusion as MVP build problem; current state has it as revenue problem instead.

**GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS**
- Doesn't address scenarios where Lafu declines or delays the partnership decision past Week 9.
- Skills Library compliance might surface additional gaps beyond the known 4 once mechanical fix runs.
- Doesn't yet address tax/LLC structure for first revenue (a Phase 3.5 concern, possibly).
- Customer fulfillment SLA not yet defined — what happens if delivery slips past 7 days?
