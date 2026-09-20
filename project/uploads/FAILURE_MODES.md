# Failure Modes

Per major subsystem/workflow: failure mode → cause → impact → detection → recovery → prevention → residual risk.

## Business / legal

| Failure mode | Cause | User/biz impact | Detection | Recovery | Prevention | Residual |
|---|---|---|---|---|---|---|
| Client signed while uninsured | E&O not bound | Personal liability on a claim | Contract date vs binder date | Bind before delivery; pause work | Milestone-0 gate | LOW if gate held |
| Employer claims client IP | Broad employment IP clause | Lane breach, legal exposure | Attorney review flags it | Renegotiate/carve-out; restructure | B-4 before contracts | MED until cleared |
| Pricing floor collapses | First-client discount | Whole pricing model erodes | Signed audit < $4,500 | Document as isolated exception immediately | Scripted floor-hold + proof | MED |
| Exception list grows | Second undocumented exception | Precedent set | >1 exception without boundary doc | Write boundary doc; freeze list | One-exception rule | LOW |

## Software / agent delivery

| Failure mode | Cause | Impact | Detection | Recovery | Prevention | Residual |
|---|---|---|---|---|---|---|
| Secret leaked to client bundle | Secret in frontend | Credential compromise | Code review / secret scan | Rotate immediately; purge | Server-side-only rule; scanning | LOW if enforced |
| RLS disabled/misconfigured | Bad migration | Cross-tenant data exposure | Supabase advisors / audit | Re-enable; audit access | Never-disable rule; review | MED (enforcement unverified) |
| Delivered agent takes harmful action | No HITL on consequential step | Client harm, liability | Client report (no telemetry) | Kill switch (doesn't exist yet) | HITL checkpoints; approval queue | HIGH until built |
| Prompt injection exfiltration | Unvalidated input | Data leak | Logging (partial) | Incident response (none formal) | Input validation; threat model | HIGH until built |
| n8n workflow silent failure | Blocked creds / bad idempotency | Stale/duplicate data | n8n run history; weekly check | Re-run idempotent job | Idempotency rule; Friday check | MED |
| Base44/n8n platform outage | Vendor downtime | Automation + app down | Vendor status page | Manual fallback | Export schemas/workflows to VC | MED |

## Content / continuity

| Failure mode | Cause | Impact | Detection | Recovery | Prevention | Residual |
|---|---|---|---|---|---|---|
| ChaosClub name appears externally | Stale asset / chaosclub.co copy | Brand-rule violation | External copy review | Scrub asset | Retire-name rule; C-3 resolution | LOW-MED |
| Register cross-pollination (memoir↔Load-Bearing) | Voice bleed | Both registers weakened | Editorial review | Rewrite | Hard separation rule | LOW |
| Solo continuity break | Kyle unavailable mid-engagement | Client stranded | Missed delivery | Ad-hoc (none documented) | Keep project current; contractor bench | MED |
