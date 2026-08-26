# FlashFusion Delivery Kit

Outcome-based AI enablement service — complete operating system for acquiring, delivering, and handing off client engagements.

## How to use this kit

Every client engagement runs through three phases. Use the files in order.

```
01-walkup/          Before the engagement starts
02-during/          During the build and delivery
03-maintenance/     After handoff — what they run, what you support
```

Find-replace `{{VARIABLE}}` placeholders before sending any document to a client.

---

## File index

### Phase 1 — Walk-up
| File | Purpose | When |
|------|---------|------|
| `discovery-call-script.md` | 5-question framework for the first call | Before any proposal |
| `proposal-template.md` | Parameterized one-pager for any client | After discovery call |
| `intake-questionnaire.md` | Pre-work sent before project kickoff | After proposal accepted |
| `pricing-calculator.md` | How to price any engagement | During proposal prep |

### Phase 2 — During
| File | Purpose | When |
|------|---------|------|
| `project-kickoff.md` | Kickoff agenda, benchmark agreement, roles | Day 1 |
| `facebook-campaign-setup.md` | Step-by-step campaign build checklist | Week 1–2 |
| `crm-pipeline-setup.md` | Lead capture form + CRM pipeline build | Week 1–2 |
| `ad-copy-prompt-library.md` | AI prompt templates for ad copy generation | Week 1 |
| `training-curriculum.md` | 4-session Own Your AI training outline | Weeks 2–6 |

### Phase 3 — Maintenance
| File | Purpose | Who uses it |
|------|---------|-------------|
| `client-handoff-doc.md` | Campaign keys, settings, credentials | Client + Kyle |
| `operations-manual.md` | Monthly tasks — what to check and when | Client team |
| `monthly-report-template.md` | Fill-in-the-blank performance report | Client team |
| `troubleshooting-guide.md` | Common issues + fixes for non-technical users | Client team |
| `90-day-support-log.md` | Running log for the 90-day included support period | Kyle |

---

## Scalability rules

1. **Never hardcode client details in templates.** Use `{{VARIABLE}}` placeholders.
2. **After each engagement, update the playbook.** If something took longer or broke, note it in the relevant file.
3. **Version client deliverables.** Save as `[client]-handoff-v1.md`, never overwrite.
4. **Case study trigger.** At day 60, open the benchmark log. If results are good, capture a case study immediately.

---

## Variable reference

| Variable | Description | Example |
|---------|-------------|---------|
| `{{CLIENT_NAME}}` | Business name | Third Coast Guitar Service |
| `{{CLIENT_CONTACT}}` | Primary contact name | Chris |
| `{{CLIENT_LOCATIONS}}` | Number of locations | 3 |
| `{{CLIENT_CITY}}` | Primary city | Chicago |
| `{{SERVICE_TYPE}}` | What you're automating | Facebook ads + lead capture |
| `{{BENCHMARK_METRIC}}` | The 60-day measurement | 20+ qualified leads/month |
| `{{SETUP_PRICE}}` | One-time setup fee | $4,500 |
| `{{RETAINER_PRICE}}` | Monthly retainer (if applicable) | $650/mo |
| `{{KICKOFF_DATE}}` | Project start date | June 1, 2026 |
| `{{HANDOFF_DATE}}` | Projected handoff date | July 15, 2026 |
| `{{SUPPORT_END_DATE}}` | 90-day support end date | October 15, 2026 |
