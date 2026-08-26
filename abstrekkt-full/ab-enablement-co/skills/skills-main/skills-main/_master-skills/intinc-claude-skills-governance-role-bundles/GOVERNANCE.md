# INTINC Claude Skills Governance Pack (v0.1.0)
Generated: 2026-02-08

This pack refactors the style library into **Skills** intended for **non-technical users**.
A “Skill” is a **bounded job** with:
- a clear purpose
- required inputs
- a strict output format
- safety rules (what to never do)
- escalation triggers (when a human must take over)

---

## 1) Skill Risk Tiers (permission model)

| Tier | Meaning | Typical users | Examples |
|---|---|---|---|
| Tier 0 | Public / low risk | Anyone | marketing drafts, generic summaries |
| Tier 1 | Internal operations | L1 support, dispatch | ticket intake, scheduling |
| Tier 2 | Client-impacting operations | Tier 2, AM/CS | client briefs, health checks |
| Tier 3 | Financial / HR / contractual | Finance, HR, Legal ops | payroll exceptions, contract screening |
| Tier 4 | Security / compliance / exec | SOC, Compliance, Exec | alerts, audit responses, board briefs |

**Rule:** A user may only run Skills at or below their allowed tier.

---

## 2) Data Sensitivity Levels

- Public
- Internal
- Client Confidential
- Employee Confidential
- Security/Regulated

**Rule:** A Skill declares which data sensitivity it accepts. If the user tries to include higher-sensitivity data, stop and escalate.

---

## 3) Escalation Owners

Every Skill must name a human “owner” who can approve edge cases:
- Support Manager
- SOC Lead
- Finance Director
- HR Lead
- Compliance Officer
- Exec Sponsor

---

## 4) Mandatory “Do Not” Rules (apply to every Skill)

1. Do not request, store, or repeat secrets/passwords/2FA codes.
2. Do not approve payments, refunds, pricing exceptions, or legal positions.
3. Do not promise SLAs, timelines, or outcomes without confirmation.
4. Do not provide instructions that bypass identity verification.
5. If uncertain: label Unknowns + route to the escalation owner.

---

## 5) How to use this pack

This ZIP is designed for **drag-and-drop** workflows:
- If your Claude environment (or internal tool) supports importing “skills zips”, import this ZIP.
- Otherwise: unzip locally and copy the relevant Skill markdown into your department’s Claude Project / internal KB.

You’ll find:
- `skills/` → individual Skill cards (MD)
- `role-bundles/` → “who gets which skills”
- `INDEX.md` → full catalog
