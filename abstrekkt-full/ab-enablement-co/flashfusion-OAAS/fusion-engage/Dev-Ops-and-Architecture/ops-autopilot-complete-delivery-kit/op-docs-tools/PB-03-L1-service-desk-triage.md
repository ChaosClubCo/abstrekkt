# PB-03 · L1 Service Desk Triage Playbook

> **Status:** Active
> **Owner:** Service Desk Manager
> **Scope:** All inbound tickets, all clients, business hours (Mon–Fri 7am–7pm CT)
> **Out-of-hours:** See PB-04 (After-Hours On-Call)
> **Last reviewed:** 2026-04-15

---

## SCENARIOS COVERED

This playbook applies to every ticket entering the queue. It is the **first decision** an L1 makes after picking up a ticket — before any technical work begins.

It does **not** cover:
- After-hours pages (PB-04)
- Confirmed security incidents (IR-PLAN, immediately)
- New-hire onboarding (IG-002 per client)
- Vendor-initiated maintenance windows (RB-021)

If the ticket fits one of those, route to the named doc and exit this playbook.

---

## SEVERITY DEFINITIONS

Severity is set by the L1 at triage and is **revisable** as more information emerges. Always err one severity higher when uncertain.

| Sev | Definition | First-response SLA | Engagement |
|---|---|---|---|
| **P1** | Production down for ≥1 user with no workaround OR data integrity at risk OR potential security incident | **5 min** | L2 + on-call manager |
| **P2** | Single user fully blocked, no workaround | **30 min** | L2 |
| **P3** | Single user, workaround exists | **4 hr** | L1 |
| **P4** | Request, no current impact | **1 business day** | L1 |

**Concrete examples** (not exhaustive):
- "Client's mail server stopped relaying" → P1
- "I can't open Outlook but webmail works" → P3 (workaround exists)
- "Need a new mailbox provisioned for a hire" → P4
- "Got a phishing email and clicked the link" → P1 (potential security incident)

---

## DECISION TREE

```
Ticket arrives
   │
   ▼
Is anything actually broken right now? ──No──→ ▶ PLAY 4: Request Intake
   │
  Yes
   │
   ▼
Could this be a security event?
(unauthorized access, data exposure,
 phishing, ransomware indicators) ─────Yes──→ ▶ PLAY 5: Suspected Security
   │
   No
   │
   ▼
More than one user affected? ────────────Yes──→ ▶ PLAY 1: Mass Impact
   │
   No
   │
   ▼
Does a workaround exist? ────────────────Yes──→ ▶ PLAY 3: Defer + Workaround
   │
   No
   │
   ▼
                                              ▶ PLAY 2: Block + Escalate
```

---

## PLAY 1 — MASS IMPACT

**Trigger conditions** (all must be true):
- ≥2 users reporting same symptom
- Same client
- Within a 30-minute window

**Initial severity:** P1

**Role:** L1 → L2 within **10 minutes**

**Action:**
1. Acknowledge in client portal (template MI-01) within 5 min
2. Open status incident in client portal (template MI-02)
3. Page L2 via Slack `#desk-l2` with `@here` and the ticket link
4. While L2 spins up: gather affected user count, error messages, timing
5. Stay on the ticket as Scribe — do not pick up other tickets until L2 takes IC

**Exit criteria:**
- L2 has named themselves IC in the ticket OR
- 15 minutes have passed without L2 ack — escalate to manager via phone

**Common pitfall:** L1 starts troubleshooting solo because "it's probably just X." Don't. Mass impact means decisions get made by someone with the authority to make them.

---

## PLAY 2 — BLOCK + ESCALATE

**Trigger conditions:**
- Single user, fully blocked, no workaround identified in first 10 min of investigation

**Initial severity:** P2

**Role:** L1 owns the ticket; engages L2 if not resolved within 30 min

**Action:**
1. Acknowledge ticket within 30 min (template B-01)
2. Run L1 triage checklist: identity verified, symptom reproduced (where possible), recent changes captured
3. Attempt L1-scope fixes (≤30 min):
   - Browser cache, profile reset, password rotation, license check, group membership
4. If unresolved at 30 min: hand to L2 with full notes (template B-02)
5. Stay attached as the user-facing comms owner until resolution

**Exit criteria:**
- Fix verified by user OR
- Handoff to L2 acknowledged in ticket

**Common pitfall:** L1 keeps trying past the 30-min budget. L2 prefers you escalate at 30 min with clean notes than at 90 min with a tangled trail.

---

## PLAY 3 — DEFER + WORKAROUND

**Trigger conditions:**
- Single user, workaround exists and is acceptable to user

**Initial severity:** P3

**Role:** L1 owns end-to-end

**Action:**
1. Acknowledge with workaround within 4 hr (template W-01)
2. Confirm with user that workaround is acceptable; capture confirmation
3. Schedule full fix during user's next available window (NOT immediately if business-hours pressure)
4. Document workaround clearly in ticket — future agents must be able to find it
5. Set ticket reminder for 5 business days; if workaround still in place, escalate to L2 for permanent fix

**Exit criteria:**
- Permanent fix applied AND user confirms OR
- Ticket transferred to L2 after 5 business days of workaround

**Common pitfall:** Treating workaround as resolution. It is not. The ticket stays open until the underlying issue is fixed or formally accepted as won't-fix.

---

## PLAY 4 — REQUEST INTAKE

**Trigger conditions:**
- No current impact; user is requesting something (access, hardware, software, info)

**Initial severity:** P4

**Role:** L1 owns or routes per request type

**Action:**
1. Acknowledge within 1 business day (template R-01)
2. Confirm requestor authority (manager approval for cross-team requests)
3. Route by request type:
   - **Access requests** → identity workflow IG-IAM-01
   - **Hardware** → procurement queue
   - **Software** → license check, then procurement if needed
   - **Information** → answer or route to KB
4. Set realistic expectation in ticket reply (don't promise same-day for things that require approval chains)

**Exit criteria:**
- Request fulfilled and confirmed by requestor
- OR request denied with documented rationale

**Common pitfall:** Treating all requests as urgent because the user said "ASAP." Severity is set by impact, not by tone.

---

## PLAY 5 — SUSPECTED SECURITY

**Trigger conditions** (any one):
- User reports phishing, suspicious email, suspicious login
- Unexpected MFA prompts
- Unauthorized data access
- Ransomware indicators (file extensions changed, ransom notes)
- User's account behaving oddly (unexpected sent emails, password changes user didn't make)

**Initial severity:** P1 — even if you're not sure

**Role:** L1 → IC named within **5 minutes** per IR-PLAN

**Action:**
1. **Do not** start remediation. Do not delete the email, do not change the password, do not log the user out yet.
2. Open IR-PLAN in parallel tab, follow Detect → Triage steps
3. Page security on-call via Slack `#sec-incidents` with `@here`
4. Capture evidence before doing anything: screenshots, headers, logs
5. Continue per IR-PLAN once IC takes the ticket

**Exit criteria:**
- IC named, IR-PLAN engaged, this playbook is no longer the active doc

**Common pitfall:** "It's probably nothing" → confirmed breach, evidence destroyed. Always escalate. The cost of a false alarm is 15 minutes; the cost of a missed real one is much higher.

---

## COMMUNICATION TEMPLATES

Stored in the ticketing system as canned responses. **Always personalize** beyond the template — the template is the floor, not the ceiling.

| Template ID | Use | Channel |
|---|---|---|
| MI-01 | Mass impact acknowledgment | Client portal |
| MI-02 | Mass impact status update | Client portal |
| B-01 | Block acknowledgment | Email reply |
| B-02 | L2 handoff note | Internal ticket |
| W-01 | Workaround offer | Email reply |
| R-01 | Request received | Email reply |
| SEC-01 | Security event acknowledgment (vague — does not confirm anything) | Email reply |

Templates are reviewed quarterly. Suggest edits via ticket to Service Desk Manager.

---

## POST-PLAY REVIEW

For every ticket that runs PLAY 1, PLAY 2, or PLAY 5: capture in the post-shift handoff:

- Ticket ID
- Play used
- Time-to-acknowledge
- Time-to-resolve
- Whether the playbook covered the scenario well
- Any template that needed substantial rewriting

These feed the monthly playbook review. If a scenario keeps falling between plays, that's the signal to add a new play.

---

## REVISION HISTORY

| Date | Version | Change | Author |
|---|---|---|---|
| 2025-09-12 | 1.0 | Initial playbook | Service Desk Mgr |
| 2026-01-08 | 1.1 | Added PLAY 5 (Suspected Security) after Q4 incident | Service Desk Mgr |
| 2026-04-15 | 1.2 | Tightened decision tree, added measurable templates | Service Desk Mgr |
