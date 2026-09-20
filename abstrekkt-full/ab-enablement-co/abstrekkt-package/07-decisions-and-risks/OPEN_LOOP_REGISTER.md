# Open-Loop Register

Every unresolved decision, TODO, missing dependency, and deferred task. Resolution status uses the mega-prompt's order: (1) resolved from evidence, (2) from interview, (3) from project decision, (4) best-practice default, (5) recommended decision, (6) genuinely external.

| ID | Open loop | Category | Why open | Can close now? | Resolution | Owner |
|---|---|---|---|---|---|---|
| OL-1 | LLC filing confirmation | Legal | Requires IL SOS interactive search | No (external) | Kyle runs search / files | Kyle |
| OL-2 | EIN | Legal | Depends on OL-1 | No (external) | irs.gov after filing | Kyle |
| OL-3 | Business bank account | Legal | Depends on OL-2 | No (external) | Open after EIN | Kyle |
| OL-4 | Employment-IP attorney review | Legal | Not engaged | No (external) | Engage attorney; written opinion | Kyle |
| OL-5 | E&O binding | Insurance | Not started | No (external) | Quote 4 providers; bind | Kyle |
| OL-6 | MSA/operating/IP-assignment review | Legal | Templates unreviewed | No (external) | Attorney bundle | Kyle |
| OL-7 | Ryan boundary doc + $ reconciliation | Business | Not written; C-1 conflict | Partially (draft can be prepared) | Write doc; pick free vs $3,000 | Kyle |
| OL-8 | Union VP outreach | Pipeline | Not sent (overdue) | No (Kyle must send) | Send message now | Kyle |
| OL-9 | CLC first contact | Pipeline | Setup only, nothing sent | No | Send outreach | Kyle |
| OL-10 | Concurrent-engagement cap | Strategy | Undecided | **Yes — package recommends 3** | Adopt cap=3 | Kyle to ratify |
| OL-11 | Load-Bearing platform | Content | Criteria unwritten | Partially | Write criteria → choose | Kyle |
| OL-12 | plugins-plus distribution | Product | Undecided | Partially | Choose one path | Kyle |
| OL-13 | chaosclub.co naming vs retired brand | Brand | Ambiguous scope (C-3) | No | Confirm scope | Kyle |
| OL-14 | Certification public name | Brand | Naming drift (C-4) | No (until pass) | Fix at 2026-07-20 | Kyle |
| OL-15 | Fusion AI 11 n8n workflows | Software | Creds/schema gaps | Partially | Resolve creds; add SCH-02 lane; drop WIR dupes | Kyle |
| OL-16 | Dead-entity audit (~101) | Software | Not run | Yes (analysis) | Cross-ref entities vs n8n/API; archive after confirm | Kyle |
| OL-17 | chaosclub.co Firebase→Supabase | Software | Not costed | Yes (design spike) | Go/no-go doc; don't migrate yet | Kyle |
| OL-18 | Ample / FissionPrompt scope | Product | Undocumented | Yes (document) | Write one-pager or drop | Kyle |
| OL-19 | Home-dir global git repo | Ops | Structural debt | Yes | Safe un-init per runbook | Kyle |
| OL-20 | CFO/ROI cost model | Product | Requirement open | Yes (build) | React artifact at client.flashfusion.co/roi | Kyle |
| OL-21 | Test suite + threat model + HITL enforcement | Quality/Sec | Absent | Yes (build) before client agents | Add smoke tests, threat model, HITL checkpoints | Kyle |

## Resolutions this package closed (no further action)

- ChaosClub two-entity LLC plan → retired (C-2).
- Package scope/tier/audience → decided (D-P2, D-P5).
- Employment-IP review status → elevated to named blocker (D-P1).
- Ryan interim treatment → free pending reconciliation (D-P3).
