# FlashFusion Pipeline Specification Template

**Template version:** 1.0
**Format:** Outcome-Aware AI Systems — Pipeline Variant
**Use this for:** any client-facing AI/automation pipeline (lead enrichment, service desk routing, ticket triage, content ops, support automation, document classification, etc.)
**Filename pattern when filled in:** `ff-spec-{{ CLIENT_SLUG }}-{{ USE_CASE_SLUG }}-v{{ VERSION }}.md`

---

## How to fill this in

1. Read the **Placeholder Dictionary** below. Decide each value before you start writing.
2. Replace every `{{ PLACEHOLDER }}` in this document. Do not ship a spec with any `{{ }}` markers remaining.
3. Italic gray notes (` *(guidance: ...)* `) are instructions to you, the consultant. Delete them before sending to the client.
4. Run the **Acceptance Checklist** at the bottom before delivery. A spec is "done" only when every line passes.
5. Pair this spec with a Build doc and a Run doc. This template is the *what* and *why*; those are the *how* and *how-to-operate*.

---

## Placeholder Dictionary

Fill these in once, then do a find-and-replace across the whole doc.

| Placeholder | Meaning | Example |
|---|---|---|
| `{{ CLIENT_NAME }}` | Full legal or display name of the client | Acme Corp |
| `{{ CLIENT_SLUG }}` | Short kebab-case slug for filenames | acme-corp |
| `{{ USE_CASE }}` | One-sentence statement of what the pipeline does | "automated qualification of inbound demo requests" |
| `{{ USE_CASE_SLUG }}` | Short kebab-case slug | lead-enrichment |
| `{{ TRIGGER_SOURCE }}` | Where raw signals originate | website form, ticket inbox, queue topic |
| `{{ INPUT_SCHEMA }}` | JSON schema for the trigger payload | (defined inline in Section 2) |
| `{{ ORCHESTRATION_PLATFORM }}` | Workflow runner | n8n, Make, Zapier, Temporal, custom |
| `{{ ENRICHMENT_PROVIDER }}` | Third-party data API | Apollo.io, Clearbit, ZoomInfo, internal directory |
| `{{ ENRICHMENT_API_LIMIT }}` | Provider's published rate limit | 200 req/min |
| `{{ ENRICHMENT_BUDGET }}` | Monthly credit/call cap from contract | 10,000 credits/month |
| `{{ CRM_SYSTEM }}` | System of record for the output entity | HubSpot, Salesforce, FreshService, Linear |
| `{{ CRM_RATE_LIMIT }}` | CRM-side rate limit | 100 calls / 10s |
| `{{ DATA_STORE }}` | Durable persistence layer | Supabase, Postgres, BigQuery, Airtable |
| `{{ NOTIFICATION_CHANNEL }}` | Where alerts surface | Slack #channel, Teams channel, PagerDuty service |
| `{{ MANUAL_QUEUE }}` | Where edge cases land for human review | Airtable view, Notion DB, FreshService queue |
| `{{ AI_PROVIDER }}` | LLM provider for the inference step(s) | Claude, GPT-4, Gemini, local |
| `{{ TOKEN_ROTATION_INTERVAL }}` | How often OAuth tokens are rotated | 180 days |
| `{{ TIER_NAMES }}` | The categories your output sorts into | Hot / Warm / Cold; P0 / P1 / P2; L1 / L2 / L3 |
| `{{ TIER_DEFINITIONS }}` | The rules that assign tier | see Section 4 table |
| `{{ MATURITY_TIER }}` | Which AI Control Plane tier this build targets | Mini, Mid, or Enterprise |
| `{{ GOLDEN_SET_SIZE }}` | Number of historical records used as regression fixtures | 30 |
| `{{ ERROR_RATE_THRESHOLD }}` | Alert threshold for system error rate | 5% |
| `{{ QUOTA_ALERT_THRESHOLD }}` | Alert threshold for orchestration platform task usage | 80% |

---

# Section 1 — Executive Pipeline Overview

## 1.1 Business problem

*(guidance: state the operational pain in one paragraph. What is being done manually today? What does it cost in time, money, or missed revenue?)*

For {{ CLIENT_NAME }}, the cost of manually handling `{{ USE_CASE }}` is measured in both overhead and opportunity loss. This pipeline is architected to eliminate manual intervention by transforming raw inbound signals into high-fidelity, actionable data, so that human resources are allocated strictly to high-value cases.

## 1.2 Architectural posture: Uncertainty Architecture

This system is built on an **Uncertainty Architecture** posture. The orchestration logic is deterministic — webhooks, validators, routing rules. The external API responses and LLM inference steps are probabilistic ("linguistic logic"). To maintain system integrity, we treat the probabilistic layer as a first-class architectural citizen, governed by structured versioning, rigorous validation, and explicit evaluation (see Section 7).

## 1.3 High-level conceptual map

The lifecycle of a single record flows through these stages:

1. **Ingress** — reception of raw signals at the trigger endpoint.
2. **GIGO Validation** — pre-processing checks before any billable work runs.
3. **Enrichment** — execution of `{{ ENRICHMENT_PROVIDER }}` to fetch additional attributes.
4. **Linguistic Transformation** — LLM-driven normalization of unstructured strings.
5. **Scoring & Routing Matrix** — categorization and parallel delivery to `{{ CRM_SYSTEM }}`, `{{ DATA_STORE }}`, and `{{ NOTIFICATION_CHANNEL }}`.

## 1.4 Out of scope

*(guidance: explicitly list what this pipeline does NOT do. This is the single most common source of scope creep on these engagements. Be specific.)*

- *(example)* Outbound sequencing or follow-up cadence
- *(example)* Multi-touch attribution reporting
- *(example)* Data warehousing beyond the operational `{{ DATA_STORE }}` window

---

# Section 2 — Data Ingress & GIGO Validation

The ingress layer is the system's "Garbage In, Garbage Out" shield. Before any billable API credits are consumed, the pipeline must verify that incoming data represents a viable record.

## 2.1 Trigger contract

The endpoint expects a `POST` request at `{{ TRIGGER_ENDPOINT_PATH }}` with the following JSON schema:

```json
{
  "{{ FIELD_1_NAME }}": "string",
  "{{ FIELD_2_NAME }}": "string",
  "source": "{{ SOURCE_ENUM_VALUES }}"
}
```

*(guidance: enumerate every field. For each, document type, required-vs-optional, and validation regex. If the client controls the trigger source, get the spec from them in writing.)*

## 2.2 Validation protocol

Before initiating downstream execution, the ingress layer performs the following ordered checks:

1. **Signature verification** — HMAC SHA256 against the raw request body (see Section 5).
2. **Schema validation** — type and presence checks against the trigger contract.
3. **Conformity validation** — regex checks for format-bound fields (email, phone, domain, URL, etc.).
4. **Liveness checks** — *(guidance: e.g., MX record lookup for email domains, HEAD request for URLs, directory lookup for internal user IDs)*. These verify the field references a real, currently-reachable entity.

## 2.3 Failure handling

Failure at any validation step triggers an immediate **Log-Only state**:

- The record is written to `{{ DATA_STORE }}` with `status = "rejected"` and a structured reason code.
- No downstream API calls fire. No `{{ ENRICHMENT_PROVIDER }}` credits, no `{{ ORCHESTRATION_PLATFORM }}` tasks, no `{{ NOTIFICATION_CHANNEL }}` traffic.
- A daily digest of rejections is delivered to the operations channel for pattern review.

This is non-negotiable. The GIGO shield is what makes the pipeline economically viable.

---

# Section 3 — Enrichment & Data Transformation

The Intelligence Layer uses `{{ ENRICHMENT_PROVIDER }}` to augment raw input with the context required for high-precision routing.

## 3.1 Attribute mapping

| Provider field | Internal variable | Description | Required for routing? |
|---|---|---|---|
| `{{ PROVIDER_FIELD_1 }}` | `{{ INTERNAL_VAR_1 }}` | *(guidance: what the field means in business terms)* | Y / N |
| `{{ PROVIDER_FIELD_2 }}` | `{{ INTERNAL_VAR_2 }}` | | Y / N |
| `{{ PROVIDER_FIELD_3 }}` | `{{ INTERNAL_VAR_3 }}` | | Y / N |

*(guidance: add a row for every field consumed downstream. Document the provider's field name AND your internal variable, so an engineer mid-incident does not have to guess.)*

## 3.2 Linguistic transformation

A subset of provider fields arrive with linguistic variability (e.g., a numeric field returned as `"1k"`, `"500-1000"`, or `"approx 1,000"`). The pipeline uses `{{ AI_PROVIDER }}` to resolve these into standardized values for downstream mathematical scoring. This prevents the rigid string-match failures that plague hand-rolled rule engines.

**Fields requiring linguistic transformation:** `{{ LINGUISTIC_FIELDS_LIST }}`

**Acceptance:** the transformed output is numeric (or canonical-categorical), and a `confidence_score` is attached to every record passing through this step.

## 3.3 Edge cases

| Provider response | Pipeline behavior | Rationale |
|---|---|---|
| `404 Not Found` | Route to `{{ MANUAL_QUEUE }}` | Preserves value for unmapped records without polluting `{{ CRM_SYSTEM }}` |
| `429 Rate Limited` | Retry with backoff (see Section 6) | Transient — should self-heal |
| `5xx Server Error` | Retry with backoff, escalate after N retries (see Section 6) | Provider-side problem; alert ops |
| Partial response (some fields missing) | Continue pipeline with `enrichment_completeness < 1.0` flag | Downstream scoring can degrade gracefully |

---

# Section 4 — Routing Matrix & Scoring

Tiered routing ensures the highest-value records receive immediate attention while lower-value records flow to automated paths.

## 4.1 Scoring tiers

| Tier | Definition | Priority | Destination |
|---|---|---|---|
| `{{ TIER_1_NAME }}` | `{{ TIER_1_RULE }}` | Immediate | `{{ TIER_1_DESTINATION }}` |
| `{{ TIER_2_NAME }}` | `{{ TIER_2_RULE }}` | Queue | `{{ TIER_2_DESTINATION }}` |
| `{{ TIER_3_NAME }}` | `{{ TIER_3_RULE }}` | Automated | `{{ TIER_3_DESTINATION }}` |

*(guidance: keep tier definitions to three unless the client has a documented reason for more. Four-tier matrices break under operational load.)*

## 4.2 Routing rules

1. **`{{ TIER_1_NAME }}`** records → injected directly into `{{ TIER_1_DESTINATION }}`.
2. **`{{ TIER_2_NAME }}`** records → enqueued in `{{ TIER_2_DESTINATION }}`.
3. **`{{ TIER_3_NAME }}`** records → archived in `{{ TIER_3_DESTINATION }}`.

## 4.3 Alert template

For tier-1 records, an alert dispatches to `{{ NOTIFICATION_CHANNEL }}`. To comply with the PII protocol (Section 5), the message follows this template:

```
{{ ALERT_ICON }} {{ TIER_1_NAME }}: {record_id} — {non_pii_summary} (hash: {sha256_8})
```

The alert must contain **no raw PII**. Operators retrieve full record context via the hash by looking up the record in `{{ CRM_SYSTEM }}` or `{{ DATA_STORE }}`.

---

# Section 5 — Security Hardening & PII Governance

This pipeline operates under a Security-First mandate. PII protection and trigger authenticity are non-negotiable.

## 5.1 Signature & ingress validation

To prevent unauthorized triggers, the system enforces **HMAC SHA256** validation on the ingress endpoint:

- Verify the `X-Signature` header.
- Use `WEBHOOK_SECRET` as the key.
- Use the **raw request body** as the message (not the parsed JSON — body bytes).
- Reject any request failing verification before any other processing occurs.

## 5.2 PII protection protocol

A zero-PII policy is enforced for `{{ NOTIFICATION_CHANNEL }}` and any other shared surface where the audience is broader than the data controllers.

- **Identification.** No raw emails, phone numbers, full names, or document IDs appear in shared channels.
- **Hashing.** Generate a `sha256_8` (first 8 hex characters of the SHA256 hash of the canonical identifier) to allow internal cross-reference without exposure.
- **Retrieval.** Operators look up the full record via the hash in `{{ CRM_SYSTEM }}` or `{{ DATA_STORE }}`, which sit behind authentication.

## 5.3 Authentication & data isolation

- **`{{ CRM_SYSTEM }}` auth.** OAuth, with token refresh rotating every `{{ TOKEN_ROTATION_INTERVAL }}`. Rotation logic must be implemented in the pipeline, not deferred to the integration platform's default behavior (defaults are inconsistent across vendors).
- **`{{ DATA_STORE }}` isolation.** Row-level security enforced at the database layer. Default policy: `records.tenant_id = auth.tenant_id()`. Multi-tenant builds must verify isolation in the test suite (see Section 7), not just in policy.
- **Secrets.** Every credential lives in environment variables. None appear in client-side code, in source control, or in pipeline UI artifacts. Violation of this rule blocks deployment.

## 5.4 Data residency & retention

*(guidance: this section is mandatory if the client operates under GDPR, HIPAA, CCPA, SOC 2, or comparable regimes. Skip only if explicitly out of scope.)*

- **Residency:** `{{ DATA_RESIDENCY_REGION }}`.
- **Retention:** `{{ RETENTION_WINDOW }}` for operational records; `{{ AUDIT_RETENTION_WINDOW }}` for audit logs.
- **Right-to-delete workflow:** `{{ DELETION_PROCEDURE }}`.

---

# Section 6 — Resilience, Rate Limits, and Error Recovery

Operational stability is maintained through aggressive error handling and budgetary throttling across all provider endpoints.

## 6.1 Provider rate limits

| Provider | Published limit | Pipeline strategy |
|---|---|---|
| `{{ ENRICHMENT_PROVIDER }}` | `{{ ENRICHMENT_API_LIMIT }}` | 3x retry with exponential backoff (2s, 4s, 8s) |
| `{{ CRM_SYSTEM }}` | `{{ CRM_RATE_LIMIT }}` | Respect documented limit; queue overflow in `{{ DATA_STORE }}` |
| `{{ AI_PROVIDER }}` | `{{ AI_RATE_LIMIT }}` | Token-bucket throttling per workflow run |

## 6.2 Error classes & responses

| Error class | Pipeline response | Operator notification |
|---|---|---|
| Transient 429 | Backoff + retry, max 3 attempts | None unless retries exhausted |
| Persistent 5xx | Retry with backoff, escalate after 3 failures | Alert `{{ NOTIFICATION_CHANNEL_OPS }}` with full failure context |
| Authentication failure | Halt pipeline, rotate token, retry | Immediate page on the operator on-call |
| Schema violation from provider | Log + route to `{{ MANUAL_QUEUE }}` | Daily digest of schema drift |

## 6.3 Budgetary throttling

To stay inside monthly credit and task quotas:

- **`{{ ENRICHMENT_PROVIDER }}` throttle:** `{{ ENRICHMENT_THROTTLE_RATE }}` (aligned with `{{ ENRICHMENT_BUDGET }}` monthly cap).
- **`{{ ORCHESTRATION_PLATFORM }}` task budget:** alert when usage crosses `{{ QUOTA_ALERT_THRESHOLD }}` of the monthly cap.
- **`{{ AI_PROVIDER }}` token budget:** alert when daily spend exceeds `{{ AI_DAILY_BUDGET }}`.

---

# Section 7 — AI Control Plane & Evaluation Framework

The pipeline transitions from "vibe coding" to a specs-driven deployment model through a rigorous evaluation suite covering enrichment, transformation, and scoring logic.

## 7.1 Maturity tier

This build targets the **`{{ MATURITY_TIER }}`** tier of the AI Control Plane:

- **Mini.** Single workflow, single LLM call, no eval suite beyond smoke tests. Acceptable for prototypes and proof-of-concepts.
- **Mid.** Golden Set in place, deterministic + model-based graders running on every change, shadow deployment for non-trivial logic shifts.
- **Enterprise.** Full Mid coverage plus continuous evaluation in production, drift detection on enrichment outputs, formal release rituals, signed deployment manifests.

*(guidance: most client engagements should target Mid. Mini is a discovery-phase artifact, not a production system. Enterprise requires dedicated platform investment — quote separately.)*

## 7.2 Golden Set

A fixed regression set of `{{ GOLDEN_SET_SIZE }}` historical records validates every change to enrichment, transformation, or scoring logic.

- **Source:** records sampled from `{{ GOLDEN_SET_SOURCE }}`, manually labeled by `{{ GOLDEN_SET_LABELER }}`.
- **Coverage:** every tier represented, plus every edge case from Section 3.3.
- **Refresh cadence:** quarterly, with prior versions archived for back-comparison.
- **Location:** `{{ GOLDEN_SET_LOCATION }}`.

## 7.3 Graders

| Grader type | Validates | Implementation |
|---|---|---|
| Deterministic | Routing accuracy (e.g., a tier-1 record correctly reached `{{ TIER_1_DESTINATION }}`) | Code-based assertions over Golden Set fixtures |
| Model-based | Transformation accuracy (e.g., correct linguistic normalization) | LLM judge with rubric, scored against human labels |
| Drift detector | Production-time anomalies in enrichment output distributions | Statistical monitor over rolling window |

## 7.4 Metrics

- **`pass@1`** — probability of correct routing on first attempt. Target: `{{ PASS_AT_1_TARGET }}`.
- **`pass^k`** — consistency of scoring across `k` repeated trials with the same input. Target: `{{ PASS_K_TARGET }}` at `k = {{ K_VALUE }}`.
- **Enrichment completeness** — proportion of records with all required fields populated. Target: `{{ ENRICHMENT_COMPLETENESS_TARGET }}`.

## 7.5 Release rituals

Before activating any change to the AI Control Plane:

1. **Golden Set replay.** Re-run the full Golden Set against the new logic. Block deployment on any regression.
2. **Shadow deployment.** Run the new logic in parallel with the old for `{{ SHADOW_DURATION }}`. Compare outputs.
3. **Transcript monitoring.** Manual review of `{{ TRANSCRIPT_REVIEW_SAMPLE_SIZE }}` records to confirm no hallucinated logic crept in between agent steps.
4. **Downstream context handoff.** Updated patterns, interfaces, and assumptions published to the project's Decision Log before cutover.

---

# Section 8 — Deployment & Monitoring Manifest

The system is considered Done only when all environment variables are secured, all monitoring thresholds are active, and the final test command passes.

## 8.1 Environment configuration

Required environment variables (all stored in `{{ SECRETS_MANAGER }}`, never in source):

```bash
# Trigger ingress
WEBHOOK_SECRET=

# Enrichment provider
ENRICHMENT_API_KEY=
ENRICHMENT_BASE_URL=

# Data store
DATA_STORE_URL=
DATA_STORE_KEY=

# CRM
CRM_ACCESS_TOKEN=
CRM_REFRESH_TOKEN=
CRM_CLIENT_ID=
CRM_CLIENT_SECRET=

# Notification
NOTIFICATION_WEBHOOK_URL=
NOTIFICATION_OPS_WEBHOOK_URL=

# AI provider
AI_PROVIDER_API_KEY=
```

## 8.2 Monitoring thresholds

| Signal | Threshold | Destination |
|---|---|---|
| System error rate | `> {{ ERROR_RATE_THRESHOLD }}` | `{{ NOTIFICATION_CHANNEL_OPS }}` |
| `{{ ORCHESTRATION_PLATFORM }}` task usage | `> {{ QUOTA_ALERT_THRESHOLD }}` of monthly cap | `{{ NOTIFICATION_CHANNEL_OPS }}` |
| Enrichment completeness | `< {{ ENRICHMENT_COMPLETENESS_TARGET }}` over rolling 24h | `{{ NOTIFICATION_CHANNEL_OPS }}` |
| Golden Set regression in CI | Any single grader regression | Block deployment |
| Token rotation due | `> {{ TOKEN_ROTATION_INTERVAL }} - 14 days` | `{{ NOTIFICATION_CHANNEL_OPS }}` |

## 8.3 Final verification

Execute the following to verify the deployment path. The `X-Signature` must be a valid HMAC SHA256 of the request body generated using `WEBHOOK_SECRET`.

```bash
curl -X POST {{ TRIGGER_ENDPOINT_URL }} \
  -H "Content-Type: application/json" \
  -H "X-Signature: {{ valid_hmac_sha256_signature }}" \
  -d '{{ EXAMPLE_PAYLOAD_JSON }}'
```

**Expected result:** `200 OK` from ingress, a new row in `{{ DATA_STORE }}` with `status = "processed"`, and a routed entity in `{{ CRM_SYSTEM }}` (or `{{ MANUAL_QUEUE }}` for edge-case fixtures) within `{{ EXPECTED_LATENCY }}`.

---

# Appendix A — Acceptance Checklist

A spec is "done" only when every line below passes. Walk this checklist with the client engineering lead before sign-off.

- [ ] No `{{ }}` placeholders remain anywhere in the document.
- [ ] Every italic guidance note has been deleted.
- [ ] Section 1.4 (Out of scope) lists at least three specific exclusions.
- [ ] Section 2.1 trigger schema has been confirmed in writing with the team that controls the trigger source.
- [ ] Section 2.3 GIGO failure-mode handling has been demonstrated with a deliberate bad-payload test.
- [ ] Section 3.1 attribute mapping has a row for every field consumed downstream.
- [ ] Section 4.1 tier table has at most three tiers, with rules expressed as concrete boolean conditions (not adjectives).
- [ ] Section 5.1 HMAC verification uses raw body bytes, not parsed JSON.
- [ ] Section 5.2 PII protocol has been verified by a search of `{{ NOTIFICATION_CHANNEL }}` history for the past 30 days — no raw PII present.
- [ ] Section 5.3 token rotation logic is implemented in pipeline code, not deferred to the orchestration platform default.
- [ ] Section 5.4 residency, retention, and right-to-delete are filled in or explicitly marked "not applicable" with the client's compliance officer's name on the line.
- [ ] Section 6.1 rate limits match the provider's currently-published documentation (date-stamped within the last 30 days).
- [ ] Section 7.1 maturity tier has been agreed with the client in writing, with pricing aligned.
- [ ] Section 7.2 Golden Set exists, contains at least `{{ GOLDEN_SET_SIZE }}` labeled records, and is stored in `{{ GOLDEN_SET_LOCATION }}`.
- [ ] Section 7.4 metric targets are realistic (i.e., the current system passes them) or are explicitly marked as stretch goals.
- [ ] Section 8.1 every environment variable has an owner and a rotation date.
- [ ] Section 8.3 final verification command has been executed end-to-end against a staging environment.
- [ ] CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS footer present on the cover page or in the Decision Log.

---

# Appendix B — What This Template Is Not

To prevent scope drift, this template is **not**:

- A build doc. It describes *what* the pipeline does and *why*, not *how* to implement it. The Build doc lives separately.
- A runbook. Operational procedures live in the Run doc.
- A contract. Commercial terms, SLAs, and indemnities live in the engagement letter.
- An architecture decision record. ADRs live in the Decision Log; this spec references them but does not duplicate them.

---

*FlashFusion Pipeline Specification Template v1.0 — built on the Outcome-Aware AI Systems framework.*
