# Sample AI Workflow Readiness Assessment Report

Client: Northpoint Heating & Cooling  
Industry: Home services / HVAC  
Status: Fictional sample for sales demonstration  
Prepared by: FlashFusion

## Executive summary

Northpoint Heating & Cooling is a strong candidate for a focused AI Productivity Sprint after one documentation cleanup pass. The highest-value workflow is inbound lead intake and follow-up. The business receives leads from phone calls, website forms, Facebook messages, referrals, and email, but qualification notes are inconsistent and follow-up depends on manual reminders.

Recommended first implementation: Lead intake → qualification summary → CRM update → human-approved follow-up message.

Estimated impact: reduce missed follow-ups, shorten first-response time, and give the owner better visibility into lead quality.

## Readiness score

Overall readiness: 34 / 50

| Category | Score | Notes |
|---|---:|---|
| Workflow clarity | 3 | Basic process is understood but not formally documented. |
| Ownership | 4 | Office manager owns scheduling; technicians supply job notes. |
| Documentation quality | 2 | Scripts and intake criteria are inconsistent. |
| Data quality | 3 | CRM contains usable records but inconsistent notes. |
| Tool maturity | 4 | CRM, email, and forms are used regularly. |
| AI usage maturity | 2 | Owner uses ChatGPT casually; no team workflow. |
| Risk level | 4 | Low risk if follow-up messages remain human-approved. |
| Integration feasibility | 4 | Existing form and CRM can support automation. |
| Measurement readiness | 4 | Response time and booked estimates can be measured. |
| Change readiness | 4 | Team pain is high and workflow is narrow. |

## Current-state workflow

1. Lead enters through phone, website form, Facebook, referral, or email.
2. Office manager manually reviews details.
3. Lead is entered into CRM if time allows.
4. Appointment is scheduled or follow-up is deferred.
5. Follow-up depends on manual memory, sticky notes, or inbox flags.
6. Owner has limited visibility into missed opportunities.

## Bottlenecks

1. Lead information arrives in too many places.
2. Qualification criteria are not standardized.
3. CRM records are inconsistent.
4. Follow-up messages are manually written from scratch.
5. No simple weekly report shows lead volume, source, and status.

## Recommended first sprint

Build a human-approved lead intake workflow:

1. Collect new lead details from form/email export.
2. Generate a structured qualification summary.
3. Draft a customer follow-up message.
4. Prepare CRM-ready fields.
5. Route high-priority leads to the office manager.
6. Produce a weekly owner summary.

## Human approval checkpoints

AI may draft messages and summarize leads. AI may not send customer messages, quote pricing, approve discounts, cancel appointments, or update final job status without human approval.

## 30-day roadmap

Week 1: Finalize intake fields, lead scoring rules, and message templates.

Week 2: Build the demo automation with sample data and office-manager review.

Week 3: Pilot on real leads with human approval.

Week 4: Review metrics, adjust prompts/templates, and decide whether to expand.

## Follow-on recommendation

Book an AI Productivity Sprint to implement the lead intake workflow. Use the assessment fee as a partial credit if approved within 14 days.
