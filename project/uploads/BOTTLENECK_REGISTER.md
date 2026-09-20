# Bottleneck Register

Constraints that slow or prevent progress. Focus on what's actually on the critical path.

## BN-1 · Kyle is the single point of production — CRITICAL (structural)
- **Trigger:** every consulting engagement consumes Kyle's hours directly (audit, deliver, document).
- **Symptoms:** throughput caps at ~2–3 concurrent; delivery collides with the day job and exam week.
- **Root cause:** solo model by design; no contractors engaged yet.
- **Current workaround:** concurrent cap (recommend 3); no client delivery in exam week.
- **Long-term fix:** productize (3-tier curriculum SKUs, plugins), then bring contractors for delivery once cash exists. [SOURCED — teaching-curriculum-arc.jsx, instructions]
- **Critical-path impact:** caps revenue velocity in Phases 1–2.

## BN-2 · Interactive, human-only legal steps — HIGH
- **Trigger:** IL SOS search, filing, EIN, bank, attorney review all require Kyle in person / interactively; cannot be automated or delegated to an agent.
- **Symptoms:** blocker chain stalls if Kyle doesn't act; this package cannot close them.
- **Root cause:** government + KYC + legal processes.
- **Workaround:** none — sequence them early and in parallel where possible.
- **Fix:** batch them in Phase 0 around the exam.
- **Critical-path impact:** directly gates first revenue.

## BN-3 · Overdue Union VP outreach — HIGH (decaying opportunity)
- **Trigger:** message overdue since Jun 2026; board cycle is 30–90 days once started.
- **Symptoms:** the largest single contract slips a full quarter for every month of delay.
- **Root cause:** outreach not sent.
- **Workaround:** send now; outreach is not legally gated (delivery is).
- **Fix:** send this week; the board clock only starts after contact.

## BN-4 · Certification week owns July — MEDIUM
- **Trigger:** 2026-07-20 exam; no client delivery scheduled that week.
- **Symptoms:** ~1 week of delivery capacity removed from July.
- **Workaround:** front-load legal/outreach (non-delivery) work into that window.
- **Fix:** time-boxed; resolves 2026-07-20.

## BN-5 · Blocked n8n workflows (11) — MEDIUM (internal only)
- **Trigger:** Base44 Bearer creds missing; SCH-02 lane field absent; 4 orphan WIR-01 dupes.
- **Symptoms:** Fusion AI automation not fully live.
- **Root cause:** credential + schema config gaps.
- **Workaround:** manual processes hold.
- **Fix:** resolve creds, add lane field, remove dupes. Non-critical-path (internal tooling). [SOURCED — WorkstreamMapper.jsx]

## BN-6 · Undecided platform/distribution choices — MEDIUM
- Load-Bearing platform and plugins distribution are both undecided; each blocks its own downstream (press; monetization). Neither blocks consulting revenue. Decide when Phase 0–1 clears.
