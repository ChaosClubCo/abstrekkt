# Claude Project Instructions — cstmprnt / Lafu Engagement

## Context
cstmprnt is a custom print shop based in Waukegan, IL. Lafu is the primary contact — prior working relationship with the FlashFusion founder. **Joe is the decision maker.** This is a future paid prospect at the $4,500 floor — not a trade engagement, not an exception candidate.

The ERP interest is the anchor: cstmprnt wants to understand how AI can work with or around their order management and production workflow systems. This is different from a standard SMB marketing audit — the core use case is operational and process-oriented.

**Relationship entry:** Pre-existing working relationship with Lafu. Warm, but not a friendship — professional respect. Any outreach routes through Lafu, closes with Joe's approval.

**Communication style:**
- Operations language: order flow, production queue, turnaround, job tickets, proofing, artwork specs, print runs, bindery
- Direct and specific — both Lafu and Joe will want to know what it does and what it costs, not the theory
- Don't over-explain AI. They've seen enough demos. What they want to know is: will this actually work in our shop?

---

## Primary use cases for this project

### Pre-engagement (current state)
- Draft outreach to Lafu that opens the conversation toward a formal audit
- Build a discovery question set for the first conversation
- Prepare the "here's what we'd look at" brief for Joe's decision

### Audit scope development (when engagement opens)
- Identify AI opportunities across the cstmprnt workflow: order intake, proofing, customer comms, production scheduling, shipping notifications
- Map where ERP touches AI and where they stay separate
- Produce a written assessment with 3 prioritized recommendations

### Client delivery (if paid engagement proceeds)
- Customer-facing templates: order confirmations, proof approval requests, revision cycles, production updates, shipping notifications
- Internal documentation: job ticket language, production notes, QC checkpoints
- ERP-adjacent workflows: where AI drafts, routes, or summarizes information that currently requires manual handling

---

## Hard rules
- Floor is $4,500 for any paid engagement. This is not an exception candidate.
- Lafu is a client/contact — not a co-founder, not a partner, not a collaborator on Abstrekkt or FlashFusion. Never frame him that way.
- Joe makes the decision. Proposals and formal scope must be written for Joe to read, not just Lafu.
- No engagement work until entity (LLC) formed and E&O insurance bound.
- No ERP integration promises — AI works alongside ERP systems, not inside them. Scope to what's achievable without API access to proprietary systems.

---

# Project Knowledge — cstmprnt Context

## Business profile
- **Company:** cstmprnt (custom print shop)
- **Location:** Waukegan, IL
- **Contact:** Lafu (prior working relationship) — operational/technical contact
- **Decision maker:** Joe
- **Core business:** Custom printing — likely commercial/promo, possibly branded merchandise, print production
- **Signal:** ERP interest — they have or are evaluating an ERP system and want to understand where AI fits

## What "ERP interest" means in a print shop context
ERP in a print shop manages: order entry, job tracking, materials inventory, production scheduling, shipping, invoicing. The AI-relevant surface is the communication and documentation layer that wraps the ERP:

- **Order intake:** Translating a customer brief into a job ticket (currently manual, error-prone)
- **Proof approval cycles:** Back-and-forth with customers on artwork, revisions, approvals (high volume, repetitive)
- **Production status comms:** Notifying customers where their job is without manual touchpoints
- **Shipping and fulfillment:** Automated delivery notifications, exception handling
- **Quoting:** Translating specs into a quote email that sounds professional and covers the right details

AI doesn't replace the ERP — it handles the language layer around it.

## Likely audit scope
**Phase 1 focus (2 weeks, $4,500):**
1. Customer communication volume audit — how many emails/calls per week are order status, proof approval, or delivery related?
2. Job ticket accuracy — how often does an order enter production with incomplete or ambiguous specs?
3. Proof cycle length — average rounds, reasons for revision
4. Biggest time drain for the most experienced person in the shop

**3 prioritized recommendations format:**
- Quick win (can implement in a week, no systems changes): likely customer communication templates
- Medium lift (2-4 weeks): proof approval workflow with automated follow-up
- Strategic (90 days+): job ticket intake form that reduces spec ambiguity before production starts

## Customer communication templates (starting library)

### Order confirmation
```
Subject: [COMPANY NAME] — Order #[JOB NUMBER] confirmed

Hi [NAME],

Your order is confirmed. Here's the summary:

- Item: [PRODUCT]
- Quantity: [QTY]
- Specifications: [SIZE / MATERIAL / FINISH]
- Artwork status: [RECEIVED / PENDING — see below]
- Target ship date: [DATE]

[IF ARTWORK RECEIVED:] We'll send you a proof within [TIMEFRAME] for your review and approval before we go to press.

[IF ARTWORK PENDING:] We're waiting on your artwork files. Please send to [EMAIL] by [DATE] to hold your ship date. Files needed: [SPEC LIST].

Questions? Reply to this email or call [PHONE].

[SIGNATURE]
```

### Proof approval request
```
Subject: Proof ready for your review — Order #[JOB NUMBER]

Hi [NAME],

Your proof is attached. Please review it carefully before approving:

✓ Text is correct and complete
✓ Logo/images look correct
✓ Colors match your expectations
✓ Bleed and safe zone look right

**To approve:** Reply "Approved" and we'll move to production.
**To request changes:** Reply with your revisions and we'll send a revised proof within [TIMEFRAME].

**Production cannot begin until approval is received.** Approvals received by [DATE] will ship by [DATE].

[SIGNATURE]
```

### Production update
```
Subject: Order #[JOB NUMBER] — Production update

Hi [NAME],

Quick update on your order:

Status: [IN PRODUCTION / QUALITY REVIEW / BINDING/FINISHING / READY TO SHIP]
Expected ship date: [DATE] (no change / updated from [ORIGINAL DATE])

[IF DELAY:] [BRIEF EXPLANATION — one sentence]. We've updated your estimated delivery to [NEW DATE].

You'll get a shipping confirmation with tracking once your order ships.

[SIGNATURE]
```

### Shipping confirmation
```
Subject: Order #[JOB NUMBER] shipped — tracking inside

Hi [NAME],

Your order is on its way.

Carrier: [CARRIER]
Tracking: [TRACKING NUMBER / LINK]
Estimated delivery: [DATE]

[IF SPLIT SHIPMENT:] Note: Your order ships in [N] packages. All tracking numbers are listed above.

Thank you for your business. If anything looks wrong when your order arrives, contact us within [TIMEFRAME] and we'll make it right.

[SIGNATURE]
```

## Discovery questions for the first conversation (Lafu)
- "Walk me through what happens from the moment an order comes in to when it's in production — what touches human hands at each step?"
- "Where do jobs most often go wrong — is it spec issues, artwork, approvals, or something else?"
- "How many customer emails or calls does your team handle per day that are just status checks?"
- "Is there a person in the shop whose time is most eaten by administrative or communication work? What do they actually spend their day on?"
- "What's your current system for proof approvals — email threads? A portal? Phone calls?"

## Questions for Joe (decision conversation)
- "What's the biggest operational bottleneck that costs you real money right now?"
- "If a tool saved [X] hours per week on [SPECIFIC TASK], would that change how you staff the shop?"
- "What would you need to see in 60 days to consider this a success?"

## Outreach to Lafu (draft)
```
Subject: Thinking about cstmprnt — quick question

Hey [LAFU],

Hope you're good. I've been doing AI consulting work for the past year — mostly helping SMBs figure out where AI actually saves time in their operations vs. where it doesn't.

I keep thinking about print shops. High customer communication volume, proof cycles, job ticket accuracy, ERP workflows — there's usually a real lever in there somewhere.

Would it be worth a 30-minute conversation to walk through what you've got? I'd tell you honestly what's worth doing and what isn't. If there's something there, I'd put together a proposal for Joe. If not, you've got a second set of eyes for free.

Let me know.
[NAME]
```
