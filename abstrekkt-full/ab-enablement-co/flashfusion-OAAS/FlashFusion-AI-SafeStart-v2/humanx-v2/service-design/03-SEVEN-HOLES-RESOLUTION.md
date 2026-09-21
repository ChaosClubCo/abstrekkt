# Seven Holes — Resolution Matrix

Each hole identified in the adversarial review, its specific resolution, and where in the package it's documented.

---

## Hole 1: Unclear Deliverables
**Problem:** "Custom AI profiles" is too vague to justify $15-25K. A CFO writing a check needs a line-item manifest.
**Resolution:** 12+ named deliverables across 4 weeks, each with format and description. See `01-SERVICE-OFFERING.md` → "What Gets Delivered" section.
**Validation:** Can the client's procurement team map every line item to a budget category? If yes, this hole is closed.

---

## Hole 2: DIY Objection
**Problem:** Microsoft ships Copilot Studio. Google has Agent Designer. Why pay someone?
**Resolution:** The differentiator is cross-platform governance. No vendor governs the ecosystem — Microsoft configures Copilot but won't audit Claude usage, Cursor instances, or personal ChatGPT accounts. We govern across all of them.

**Specific talking point:** "You're going to get pitched by 20 vendors. Each will help configure their tool. None will audit the other 5 tools your employees are using. We're the governance layer across all of them — and that's a consulting skill no platform ships."

**Depth check:** This only holds if we actually deliver multi-platform. If we can only configure Claude and hand-wave at Copilot, we're a one-platform service pretending to be ecosystem-agnostic. The delivery methodology (see `02-DELIVERY-METHODOLOGY.md`) addresses this with a general contractor model — we bring platform specialists for each environment.

---

## Hole 3: No Proof
**Problem:** Zero case studies for this specific service. Market data shows the problem exists, but nothing proves FlashFusion/INT can deliver.
**Resolution:** Case Study Zero — FlashFusion/INT's own internal deployment. 72 personas mapped, EPB built, governance operational. See `deliverables/CASE-STUDY.md`.

**Critical action:** Fill in every [VERIFY] field with real data before printing. The case study is only useful if the numbers are real. Estimates and approximations are fine for internal metrics — but they must be honest, not inflated.

**What's still missing:** A second, external case study. First paying client becomes Case Study #2. Offer a 20% discount in exchange for a publishable reference — the second case study is worth more than the margin.

---

## Hole 4: Retire Model Contradiction
**Problem:** InVelo = "Build it. Use it. Retire it." AI governance doesn't retire — tools change monthly, employees join, models update.
**Resolution:** Clean separation:
- **InVelo** delivers the 4-week build. Clear exit: audit done, profiles deployed, training delivered, playbook handed off. InVelo mission: **retired**.
- **INT Managed Services** handles ongoing governance. Different engagement, different pricing, optional. Client chooses.

**How to say it:** "The build has a clear exit — 4 weeks, you own everything. If you want ongoing monitoring and profile updates as tools evolve, that's a separate managed services relationship. But you're never locked in. The InVelo mission retires when the build is done."

**Remaining tension:** If every InVelo client needs managed services to sustain value, "retire" is technically accurate but emotionally misleading. Monitor: what percentage of build clients also buy managed services? If it's over 70%, the retire framing needs revisiting.

---

## Hole 5: Delivery Team Undefined
**Problem:** This requires Claude expertise + M365 expertise + Google expertise + training facilitation + audit methodology. Kyle can't be all of those.
**Resolution:** General contractor model. Kyle leads architecture and Claude configurations. INT's existing platform engineers handle Copilot/M365. Partners handle Google/Salesforce when needed.

**Staffing matrix by platform:**
| Client's Stack | Kyle's Role | Support Needed |
|----------------|------------|----------------|
| Claude + M365 | Lead + Claude config | INT M365 engineer for Copilot |
| Claude only | Lead + all config | None |
| M365 + Google | Lead + governance framework | INT M365 + Google partner |
| Full stack (3+ platforms) | Lead + Claude + governance | Platform specialists per stack |

**Year 1 constraint:** Kyle at 40% capacity = 2-3 concurrent engagements max (staggered). That's $30-75K quarterly revenue from this service line alone. Enough to validate before hiring.

**What we don't say:** "We're experts in every platform." What we do say: "We orchestrate the whole project. We bring platform specialists for each environment and deliver a unified governance framework."

---

## Hole 6: Pricing Doesn't Hold
**Problem:** $25K / 160 hours = $156/hour. That's mid-tier consulting, not "20× cheaper than Big 4."
**Resolution:** Stop framing as hours. Frame as value:

**Breach prevention anchor:** "$650K average shadow AI breach cost. $25K engagement. One prevented breach = 26× ROI."

**Productivity anchor:** "23% productivity gain for AI-enabled employees. 200 employees × $80K average = $3.68M recovered productivity. $25K = 0.7% of that value."

**Speed anchor:** "Big 4 delivers a strategy deck in 3-6 months for $50-150K. We deploy live configurations in 4 weeks for $15-50K."

**The rule:** Never discuss hourly rates. Never show a time × rate calculation. Always anchor to value created or risk avoided.

---

## Hole 7: Fear-Based Selling
**Problem:** The pitch is 80% shadow AI risk data, 20% value. Fear selling has a short shelf life.
**Resolution:** Rebalance to 50/50.

**Risk narrative (50%):**
- 38% sharing sensitive data without permission
- $650K per breach
- 1 in 5 companies already breached
- 1,550+ GenAI apps — you can't block them all

**Value narrative (50%):**
- 23% less time on unproductive tasks
- Every role gets a co-pilot fitted to their actual job
- Structured adoption accelerates value — instead of random ChatGPT usage, employees get configured tools that match their workflows
- IKEA trained 40,000 employees — the companies doing this are pulling ahead, not just staying safe
- Competitive advantage: your employees are augmented, competitors' are still on personal ChatGPT

**Track-specific at HumanX:**
- Governance buyers → lead with risk, close with value
- Operations buyers → lead with value, close with risk
- Technical buyers → lead with architecture, close with proof

---

## Resolution Status

| Hole | Status | Confidence |
|------|--------|------------|
| 1. Unclear Deliverables | ✅ Resolved | High — 12+ named deliverables |
| 2. DIY Objection | ✅ Resolved | Medium — holds only if multi-platform delivery is real |
| 3. No Proof | ⚠️ Partially resolved | Case Study Zero exists but needs real data filled in |
| 4. Retire Contradiction | ✅ Resolved | High — clean InVelo/managed services separation |
| 5. Delivery Team | ✅ Resolved | Medium — general contractor model works, but untested at scale |
| 6. Pricing | ✅ Resolved | High — value-based anchoring is strong |
| 7. Fear Selling | ✅ Resolved | High — 50/50 balance with track-specific variants |
