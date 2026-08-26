# Risk Register (consolidated)

Top risks across legal, product, security, operations. Rated by severity (impact × likelihood). This rolls up the gap/bottleneck/blindspot/failure registers into a single prioritized view.

| ID | Risk | Category | Likelihood | Impact | Severity | Mitigation | Status |
|---|---|---|---|---|---|---|---|
| R-1 | Signing a client before entity/E&O/IP clear | Legal | Medium | Severe (personal liability) | **CRITICAL** | Milestone-0 gate; no paid contract until B-1..B-5 close | Open |
| R-2 | Employer IP claim on FlashFusion work | Legal | Low–Med | Severe | **CRITICAL** | B-4 attorney review + IP assignment to LLC | Open |
| R-3 | Pricing floor collapses on first client | Business | Medium | High | HIGH | Scripted floor-hold; Ryan case study; document any exception | Open |
| R-4 | Union VP opportunity lost to delay | Business | Med–High | High (largest contract) | HIGH | Send overdue outreach this week | Open |
| R-5 | Client-facing agent causes harm (no HITL/telemetry) | Security | Med (once agents ship) | High | HIGH | HITL checkpoints; threat model; kill switch before shipping | Open (pre-ship) |
| R-6 | Secret leak / RLS misconfig | Security | Low–Med | High | HIGH | Server-side-only secrets; never-disable-RLS; scanning; advisors | Controlled by rule; enforcement unverified |
| R-7 | Anthropic concentration (provider+cert+partner) | Strategic | Low | High | MEDIUM | Keep offer provider-agnostic; abstraction layer before product scale | Open |
| R-8 | Solo bus-factor / continuity break | Operational | Low | High | MEDIUM | Keep project current; contractor bench; documented handoffs | Open |
| R-9 | Uninsured free-engagement liability (Art/Ryan) | Legal | Low | Med–High | MEDIUM | Confirm with attorney whether E&O should gate free work too | Open |
| R-10 | Brand-rule breach (ChaosClub name surfaces) | Brand | Low | Medium | MEDIUM | Resolve chaosclub.co scope; scrub stale assets | Open |
| R-11 | Register cross-pollination (memoir↔newsletter) | Content | Low | Medium | LOW | Hard separation rule | Controlled |
| R-12 | Cost creep (API + hosted platforms, no cost view) | Financial | Medium | Medium | MEDIUM | Inward ROI model; usage caps | Open |
| R-13 | Internal tooling stalls (11 n8n workflows) | Operational | High | Low–Med | LOW | Resolve creds/schema; non-critical-path | Open |

## Prioritization basis

CRITICAL = severe impact AND currently unmitigated AND on the revenue critical path (R-1, R-2). HIGH = high impact with an available mitigation not yet executed (R-3..R-6). MEDIUM/LOW = real but either lower impact, lower likelihood, or already controlled by a standing rule. Severity is not inflated: R-13 is High-likelihood but Low-impact (internal only), so it sits at the bottom.

## The two that must not slip

**R-1 and R-2.** Both are one-time, Kyle-only actions with severe downside and cheap mitigation (a gate and an attorney letter). They are the highest expected-value work in the entire org.
