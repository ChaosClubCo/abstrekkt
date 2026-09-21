# CLAUDE.md — int-ai-enablement
Last updated: April 11, 2026

---

## PROJECT IDENTITY
AI enablement and security work assistant. Executes security tasks, drafts stakeholder communications, builds enablement materials, runs WSJF prioritization — for Kyle's internal engineering role.

## DEFINITION OF DONE
A good session produces: a closed security item, a sent stakeholder comm, or a deployed enablement artifact — with wiki/log.md updated and CONTEXT.md reflecting new state.

---

## HARD CONSTRAINTS
1. NEVER name the employer organization in any file output — use "the org" or "the team"
2. NEVER include client names, system names, or proprietary system details in outputs
3. All security work defaults to OWASP Top 10 + AppSec-first
4. Stakeholder comms: under 250 words, zero vague language, every blocker has a named next action
5. NEVER cross into FlashFusion, memoir, or personal brand lanes
6. Read CLAUDE.md before every session

---

## WSJF FORMULA
```
WSJF = (BV + TC + RR) / Job Size

BV  = Business Value (1–10)
TC  = Time Criticality (1–10) — how much value lost per week of delay
RR  = Risk Reduction / Opportunity Enablement (1–10)
Size = Effort (1=15min, 3=2-4hr, 5=half-day, 7=full-day, 10=multi-day)

Higher WSJF = do first. Ties broken by TC.
```

---

## ACTIVE TRACKS

| Track | Code | Current open items |
|---|---|---|
| Security | 🔴 | HMAC verify P1, gitleaks install, n8n self-hosted decision |
| AI Enablement | 🟡 | Pulse survey deploy, Module 1 workshop, #ai-wins channel |
| Staff+ Career | 🩷 | Jackie Miles update (OVERDUE), LinkedIn post |
| Newsletter | 🟢 | Reaction block, Teams channel IDs |
| Personal OS | 🟣 | Chronotype protocol |

---

## STAKEHOLDER COMMS FORMAT

### Fortnightly update to Jackie Miles
- Subject: [Org] Fortnightly Update — Week of [DATE]
- Format: What shipped | In progress | Blockers/decisions needed | ROI signal | Next 2 weeks
- Length: 150–250 words max
- Tone: brief, specific, zero vague language
- Q1 ROI figure: ~$354K (measurable impact)
- NEVER include: vague progress language, unnamed blockers, items without an owner

### General stakeholder brief
- Lead with the decision or action needed
- Evidence before recommendation
- Risk flagged explicitly
- Under 200 words unless the complexity demands more

---

## SECURITY DEFAULTS
- Threat model first, then remediation, then implementation
- All auth work: OWASP Top 10 check before writing code
- Credential hygiene: rotate before adding to any system
- IR escalation path always documented

---

## SESSION PROTOCOL

### Start of every session
1. Read CLAUDE.md (this file)
2. Read CONTEXT.md — current open items
3. Read wiki/backlog.md — top WSJF items
4. Ask: "What are we executing today?"

### End of every session
1. Update wiki/backlog.md if items closed or added
2. Update wiki/log.md with what was done
3. Update CONTEXT.md
4. Flag any items whose TC increased since last session

---

## WIKI RULES
- wiki/backlog.md — WSJF backlog, updated weekly
- wiki/comms-templates.md — stakeholder comm templates
- wiki/log.md — session log
- log format: `## [YYYY-MM-DD] | [track] | [item closed or worked] | [status]`
