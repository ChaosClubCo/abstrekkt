# FlashFusion — App Documentation
*Data-model section auto-generated from live Base44 schema, June 13 2026. App ID `6a02ac1bad2b4e37732ef382`.*

## 1. Identity

| | |
|---|---|
| **App** | FlashFusion |
| **Base44 ID** | `6a02ac1bad2b4e37732ef382` |
| **Lane** | FlashFusion (revenue engine) |
| **Role** | Client-delivery + agent-orchestration platform |
| **Entities** | 19 |
| **Status** | Active *(verify live URL — see §7)* |

## 2. Purpose *(human — fill/confirm)*

FlashFusion is the delivery backbone for the consultancy: it runs the full engagement lifecycle from lead capture through audit, project delivery, training, and outcome measurement — with an agent layer that proposes actions and a human-in-the-loop approval gate before anything consequential executes. It is multi-tenant: admins and team members operate across clients; client-portal users see only their own records.

> Confirm this matches intent; the schema below is fact, this paragraph is interpretation.

## 3. Data model *(machine-generated — 19 entities)*

Grouped by function. Every entity carries role-based RLS; the pattern is admin/user full access, client read-scoped to their own `client_id`.

### CRM / top-of-funnel
- **Lead** — name, email, company, role, industry, `source` (website / scorecard / referral / partner / outbound / other), pain_summary, desired_outcome, `status` (new → scorecard_completed → audit_requested → audit_scheduled → qualified → converted / disqualified), recommended_offer. *Required: name, email.*
- **Scorecard** — the Involuer intake scoring. business_name, industry, team_size, budget_comfort, timeline, plus dimension scores: data_readiness_score (0–20), repetition_score (0–20), workflow_clarity_score (0–20), tool_maturity_score (0–15), team_adoption_score (0–15), risk_governance_score (0–10), total_readiness_score (0–100), top_opportunities[], recommended_offer, next_step. *Required: business_name, lead_id.*
- **Client** — company_name, contact_email, industry, primary_contact, owner, `engagement_type` (ai_readiness_audit / workflow_automation / full_enablement / training_only / strategic_advisory / ongoing_retainer), success_benchmark, benchmark_date, `status` (onboarding → active → paused → completed / churned). *Required: company_name, contact_email.*

### Engagement lifecycle
- **ClientOnboarding** — current_step (0–4), business_goals, success_metrics, team_members[], required_assets[] (with upload tracking), kickoff_ready. *Required: client_id.*
- **KickoffMeeting** — scheduled_date, duration, meeting_link, organizer/contact emails, agenda_items[] (defaulted), `status` (scheduled → confirmed → completed / cancelled). *Required: client_id, scheduled_date.*
- **Project** — project_name, engagement_type, `phase` (discovery → diagnosis → design → build → test → deploy → optimize → complete), `status` (active / paused / blocked / completed / cancelled), scope_summary, success_benchmark, target_outcomes, current_blockers, risks, next_actions, start/end dates, client_updates[] (with client_visible flag), assigned_team[], phase_lead. *Required: client_id, project_name.*
- **ProjectTemplate** — reusable engagement scaffolds: milestones[], workflows[], training_modules[] keyed to engagement_type, is_active, times_used. *Required: name. Admin-create only.*

### Delivery
- **Workflow** — workflow_name, department, current_process, manual_steps, pain_points, `automation_candidate`, estimated_hours_saved, estimated_revenue_impact, recommendation, `risk_level` (low/med/high), `status` (identified → analyzed → recommended → approved → in_progress → automated → verified), tools_used. *Required: client_id, workflow_name.*
- **WorkflowTemplate** — versioned step definitions (steps as JSON string), `status` (draft / ready / active / archived). *Required: name, client_id.*
- **AutomationOpportunity** — WSJF-scored backlog: business_value, time_criticality, risk_reduction, job_size (all 1–10), `wsjf_score` (calculated), implementation_complexity, recommended_tool, integration_needed, expected_outcome, `status` (identified → scored → approved → in_progress → implemented → verified / rejected). *Required: client_id, opportunity_name.*
- **TrainingPlan** — audience, `skill_level` (beginner/intermediate/advanced), modules, training_date, `completion_status`, confidence_score (0–100), follow_up_required. *Required: client_id, audience.*
- **OutcomeMetric** — metric_name, baseline_value, current_value, target_value, unit, measurement_method, `reporting_period` (weekly/biweekly/monthly/quarterly), `confidence_level`. *Required: client_id, metric_name.*

### Agent layer (HITL)
- **AgentTask** — agent_name, `task_type` (intake / diagnosis / mapping / architecture / prompt_design / training / roi_analysis / success_review / documentation / qa_verification), input/output summaries, `approval_required` (default false), approved_by, `status` (pending → in_progress → completed / failed / needs_approval → approved / rejected), error_state. *Required: agent_name, task_type.*
- **WorkflowTrigger** — the action gate: `workflow_type` (send_slack_update / update_project_phase / send_email_summary / create_follow_up_task / mark_opportunity_approved / generate_report), payload (JSON), requested_by, `status` (**pending_approval** → approved / rejected → executing → completed / failed), approved_by, approved_at, execution_log. *Required: workflow_type, requested_by.*

> The agent layer is structurally HITL: agents create `AgentTask`s and request `WorkflowTrigger`s that **default to pending_approval** and require a human to approve before execution. This matches the `designing-hitl-workflows` pattern — consequential actions pause for sign-off.

### Artifacts
- **Document** — title, `document_type` (proposal / roadmap / sow / report / training_material / playbook / case_study / audit_report / other), file_url, summary, `status` (draft → review → approved → published), `client_visible`. *Required: title, document_type.*
- **CaseStudy** — problem, solution, measurable_outcome, `approval_status`, `quote_status` (not_requested → requested → received / declined), `publish_status` (draft → ready → published). *Required: problem, solution.*

### System
- **AuditLog** — actor_type (user/agent/system), action, entity_type, before/after summaries, `risk_level` (low → critical). Admin-read only. *Required: actor_type, action, entity_type.*
- **Comment** — threaded on phase/deliverable/blocker/general; author role + `visibility` (all / team_only); clients can comment but only see `all`-visibility on their own client_id. *Required: project_id, content.*
- **User** — built-in; `role` (admin / user / client), client_id link for portal users. *Required: role.*

## 4. Multi-tenancy & access *(machine-extracted)*

- **Tenant key:** `client_id` on nearly every entity; client-portal `User`s carry a `client_id` and RLS scopes their reads to it.
- **Three roles:** `admin` (full + delete + AuditLog read), `user` (FlashFusion team — full CRUD, no delete on most), `client` (read-only, own records, only published/client-visible content).
- **Client-visibility gating:** Document (`client_visible`), Project.client_updates (`client_visible` per update), Comment (`visibility`), CaseStudy (published-only) all have explicit client-facing flags — the portal is built to show clients a curated subset, not the raw record.
- **Audit trail:** AuditLog captures actor/action/risk across the app, admin-read only.

## 5. Integrations *(human — fill/confirm)*
- n8n: WorkflowTrigger types map to n8n executions — confirm wiring (and the WIR-02/04 subdomain fix that points at this app).
- PostHog: event capture wired to this app.
- Supabase: underlying store.
- Domain: {{confirm public URL}}.

## 6. Known issues / blockers *(human — fill/confirm)*
- Confirm whether WorkflowTrigger → n8n is live or stubbed.
- Confirm the live URL and deployment state (§7).

## 7. Currency footer
- **Data model:** auto-generated from live `list_entity_schemas`, June 13 2026 — [SOURCED, live].
- **Purpose / integrations / issues:** [GENERATED] from schema inference + project memory — **require human confirmation.**
- **Verification needed:** live-URL smoke test (does the app load and authenticate?) before this doc is treated as describing a working system rather than a schema.

---

**CLAIMS / GAPS**

- [SOURCED — live] All 19 entities, fields, enums, required flags, and RLS policies are from the live Base44 schema read, not memory.
- [GENERATED] §2 purpose, §4 prose summary, and the HITL interpretation are reasoned from the schema; the schema is fact, the narrative is inference.
- ! Entity schemas existing does not prove the app is deployed and working. §7 smoke test is required before this is a "system doc" vs a "schema doc."
- GAP: relationships are inferred from `*_id` field names, not from enforced foreign keys (Base44 entities store IDs as strings, not DB-level FKs) — the data model is relational by convention, not by constraint. Integrity depends on app logic, which this doc doesn't audit.
- GAP: no record counts pulled — this documents the *shape*, not the *contents*. If you want "how many real clients/projects exist," that's a `query_entities` pass, separate from this.
