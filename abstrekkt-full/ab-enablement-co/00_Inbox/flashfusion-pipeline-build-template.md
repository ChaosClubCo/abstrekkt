# FlashFusion Pipeline Build Template

**Template version:** 1.0
**Companion to:** `flashfusion-pipeline-spec-template.md` v1.0
**Format:** Outcome-Aware AI Systems — Build Variant
**Filename pattern when filled in:** `ff-build-{{ CLIENT_SLUG }}-{{ USE_CASE_SLUG }}-v{{ VERSION }}.md`

This is the *how* doc. The Spec template is the *what* and *why*. The Run doc is the *how to operate*. Use them together.

---

## How to fill this in

1. The Spec template must be filled in *first*. This Build doc inherits every placeholder from the Spec — same names, same values.
2. Replace every `{{ PLACEHOLDER }}` in this document with the values from the matching Spec.
3. The code stubs below are *reference implementations*. They run as written after placeholders are filled in. Do not ship pseudocode — if a section can't be implemented as written, fix the implementation, not the template.
4. Italic `*(note: ...)*` blocks are inline implementation notes. Keep them in the final doc — engineers reading the build months later will need the context.
5. Run the Acceptance Checklist at the bottom. The build is "done" only when every line passes.

## Reference stack (assumed by default)

| Layer | Reference choice | Where to swap |
|---|---|---|
| Orchestration | n8n self-hosted | Section 2–4, 6 |
| Ingress compute | Cloudflare Worker | Section 2, 5 |
| Data store | Supabase (Postgres + RLS) | Section 2–5 |
| AI provider | Claude API | Section 3, 7 |
| Secrets | Cloudflare environment variables | Section 5 |
| CI/CD | GitHub Actions | Section 8 |
| Observability | PostHog + Supabase log table | Section 8 |

Variant notes for Make, Zapier, Temporal, and custom Node orchestration are in Appendix D.

## Repo structure

```
ff-pipeline-{{ CLIENT_SLUG }}/
├── worker/                    # Cloudflare Worker: ingress + HMAC + GIGO
│   ├── src/
│   │   ├── index.ts           # entry point
│   │   ├── hmac.ts            # signature verification
│   │   ├── validate.ts        # schema + conformity + liveness
│   │   └── reject.ts          # log-only rejection path
│   ├── wrangler.toml
│   └── package.json
├── n8n/                       # n8n workflow exports
│   ├── 01-ingress-handoff.json
│   ├── 02-enrichment.json
│   ├── 03-transform.json
│   ├── 04-routing.json
│   └── 06-resilience-shared.json
├── db/                        # Supabase schema + RLS + seed
│   ├── migrations/
│   ├── policies/
│   └── seed/
│       └── golden-set.jsonl
├── eval/                      # Section 7 evaluation suite
│   ├── deterministic.test.ts
│   ├── model-judge.ts
│   └── fixtures/
├── .github/workflows/
│   ├── deploy-worker.yml
│   ├── golden-set-replay.yml
│   └── smoke-test.yml
├── scripts/
│   ├── smoke-test.sh
│   └── rotate-token.ts
└── README.md
```

---

# Section 1 — Implementation Architecture

Map the Spec's logical stages to concrete components. Every Spec stage has exactly one owner component.

## 1.1 Component map

| Spec stage | Component | Repo path | Runtime |
|---|---|---|---|
| 1. Source / Ingestion | Cloudflare Worker | `worker/src/index.ts` | Edge |
| 2. GIGO Validation | Cloudflare Worker | `worker/src/validate.ts` | Edge |
| 3. Enrichment | n8n workflow | `n8n/02-enrichment.json` | Self-hosted |
| 3. Linguistic Transform | n8n + Claude call | `n8n/03-transform.json` | Self-hosted |
| 4. Routing Matrix | n8n workflow | `n8n/04-routing.json` | Self-hosted |
| 5. Security | Cloudflare env + Supabase RLS | `worker/`, `db/policies/` | Edge + DB |
| 6. Resilience | Shared n8n sub-workflow | `n8n/06-resilience-shared.json` | Self-hosted |
| 7. Evaluation | Test suite + CI | `eval/`, GitHub Actions | CI |
| 8. Deployment | GitHub Actions | `.github/workflows/` | CI |

## 1.2 Critical path

The build order matters. Sections 5 (secrets) and 2 (ingress) block everything downstream. Build in this order:

1. Section 5.1 (secrets management) — every other section needs env vars.
2. Section 5.2 (Supabase schema + RLS) — every other section reads or writes to it.
3. Section 2 (ingress + GIGO) — nothing fires without this.
4. Section 3 (enrichment) — pipeline starts being useful here.
5. Section 4 (routing) — pipeline becomes complete.
6. Section 6 (resilience) — harden what works.
7. Section 7 (evaluation) — measure what hardened.
8. Section 8 (deployment) — ship it.

---

# Section 2 — Ingress & GIGO Implementation

The ingress sits at the edge to fail fast and cheaply on bad input.

## 2.1 Trigger endpoint (Cloudflare Worker)

**`worker/src/index.ts`:**

```ts
import { verifyHmac } from './hmac';
import { validatePayload } from './validate';
import { logRejection } from './reject';

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const rawBody = await req.text();
    const signature = req.headers.get('X-Signature') ?? '';

    // 1. HMAC verification
    if (!verifyHmac(rawBody, signature, env.WEBHOOK_SECRET)) {
      return new Response('Invalid signature', { status: 401 });
    }

    // 2. Schema + conformity + liveness
    const result = await validatePayload(rawBody, env);
    if (!result.valid) {
      await logRejection(env, result.reason, rawBody);
      return new Response(JSON.stringify({ status: 'rejected', reason: result.reason }), {
        status: 200, // log-only: do NOT 4xx, the caller is authenticated
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Hand off to orchestration
    const handoff = await fetch(env.N8N_INGRESS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Token': env.N8N_INTERNAL_TOKEN },
      body: JSON.stringify(result.payload),
    });

    return new Response(JSON.stringify({ status: 'accepted', id: result.payload.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
```

## 2.2 HMAC verification

**`worker/src/hmac.ts`:**

```ts
export async function verifyHmac(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const sigBuf = hexToBuffer(signature);
  if (!sigBuf) return false;
  return crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(rawBody));
}

function hexToBuffer(hex: string): ArrayBuffer | null {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const buf = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) buf[i / 2] = parseInt(hex.substr(i, 2), 16);
  return buf.buffer;
}
```

*(note: never compare HMACs with `===` — that's timing-attack vulnerable. `crypto.subtle.verify` is constant-time.)*

## 2.3 Schema + conformity + liveness validation

**`worker/src/validate.ts`:**

```ts
import { z } from 'zod';

const PayloadSchema = z.object({
  id: z.string().uuid(),
  {{ FIELD_1_NAME }}: z.string().min(1),
  {{ FIELD_2_NAME }}: z.string().min(1),
  source: z.enum([{{ SOURCE_ENUM_VALUES }}]),
  // ...add per-field rules from Spec Section 2.1
});

export type Payload = z.infer<typeof PayloadSchema>;

export type ValidationResult =
  | { valid: true; payload: Payload }
  | { valid: false; reason: 'schema' | 'conformity' | 'liveness'; detail: string };

export async function validatePayload(rawBody: string, env: Env): Promise<ValidationResult> {
  // Schema
  let parsed: unknown;
  try { parsed = JSON.parse(rawBody); }
  catch (e) { return { valid: false, reason: 'schema', detail: 'invalid JSON' }; }

  const schemaCheck = PayloadSchema.safeParse(parsed);
  if (!schemaCheck.success) {
    return { valid: false, reason: 'schema', detail: schemaCheck.error.message };
  }
  const payload = schemaCheck.data;

  // Conformity (regex/format checks)
  // *(adapt per Spec Section 2.2 — email, phone, domain, etc.)*
  // if (!isValidEmail(payload.{{ EMAIL_FIELD }})) return { valid: false, reason: 'conformity', detail: 'bad email' };

  // Liveness (external lookup)
  // *(e.g., MX record check for email domain, HEAD request for URL)*
  // const live = await checkLiveness(payload, env);
  // if (!live) return { valid: false, reason: 'liveness', detail: 'unreachable entity' };

  return { valid: true, payload };
}
```

## 2.4 Rejection logging (Supabase)

**`worker/src/reject.ts`:**

```ts
export async function logRejection(env: Env, reason: string, rawBody: string) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/pipeline_rejections`, {
    method: 'POST',
    headers: {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      reason,
      raw_body_hash: await sha256Hex(rawBody),  // never store raw body; hash it
      received_at: new Date().toISOString(),
    }),
  });
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
```

## 2.5 Build steps

1. `cd worker && npm install`
2. Set env vars locally via `wrangler secret put WEBHOOK_SECRET` etc.
3. `npm run deploy` to push to Cloudflare.
4. Test endpoint with the verification curl in Section 8.3.

## 2.6 Verification

```bash
# Send a request with a valid HMAC — expect 200 with status accepted
PAYLOAD='{"id":"550e8400-e29b-41d4-a716-446655440000","{{ FIELD_1_NAME }}":"test","source":"manual"}'
SIG=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -hex | awk '{print $2}')
curl -X POST {{ TRIGGER_ENDPOINT_URL }} \
  -H "Content-Type: application/json" \
  -H "X-Signature: $SIG" \
  -d "$PAYLOAD"

# Send a request with a bad HMAC — expect 401
curl -X POST {{ TRIGGER_ENDPOINT_URL }} \
  -H "X-Signature: invalid" -d "$PAYLOAD"

# Send a request with bad schema — expect 200 with status rejected
curl -X POST {{ TRIGGER_ENDPOINT_URL }} \
  -H "X-Signature: $(echo -n '{}' | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -hex | awk '{print $2}')" \
  -d '{}'
```

---

# Section 3 — Enrichment Implementation

n8n owns the enrichment workflow. The Worker hands off and forgets.

## 3.1 n8n workflow — enrichment

**`n8n/02-enrichment.json`** (abbreviated structure):

```json
{
  "name": "{{ CLIENT_SLUG }} - Enrichment",
  "nodes": [
    {
      "name": "Webhook - Ingress Handoff",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "{{ N8N_INGRESS_PATH }}",
        "options": { "authentication": "headerAuth" },
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Validate Internal Token",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            { "value1": "={{ $json.headers['x-internal-token'] }}",
              "operation": "equal",
              "value2": "={{ $env.N8N_INTERNAL_TOKEN }}" }
          ]
        }
      }
    },
    {
      "name": "Call {{ ENRICHMENT_PROVIDER }}",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{ ENRICHMENT_BASE_URL }}/v1/enrich",
        "method": "POST",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth",
        "options": {
          "timeout": 10000,
          "retry": { "maxRetries": 3, "retryDelay": 2000 }
        },
        "bodyParametersJson": "={ \"{{ PROVIDER_FIELD_1 }}\": $json.{{ INTERNAL_VAR_1 }} }"
      },
      "credentials": { "httpHeaderAuth": { "id": "enrichment-api-key" } }
    },
    {
      "name": "Persist Enriched Record",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "create",
        "tableId": "pipeline_records",
        "fieldsUi": {
          "fieldValues": [
            { "fieldId": "id", "fieldValue": "={{ $json.id }}" },
            { "fieldId": "enriched_data", "fieldValue": "={{ JSON.stringify($json) }}" },
            { "fieldId": "status", "fieldValue": "enriched" }
          ]
        }
      }
    }
  ]
}
```

*(note: store full workflow exports in the repo. They are versionable, diffable, and reviewable.)*

## 3.2 JSON contracts

**Ingress → Enrichment workflow input:**

```json
{
  "id": "uuid",
  "{{ FIELD_1_NAME }}": "string",
  "{{ FIELD_2_NAME }}": "string",
  "source": "{{ SOURCE_ENUM_VALUES }}",
  "received_at": "ISO-8601"
}
```

**Enrichment workflow output (to Transform):**

```json
{
  "id": "uuid",
  "raw": { "...": "from ingress" },
  "enriched": {
    "{{ INTERNAL_VAR_1 }}": "value",
    "{{ INTERNAL_VAR_2 }}": "value",
    "{{ INTERNAL_VAR_3 }}": "value"
  },
  "enrichment_completeness": 0.0,
  "enriched_at": "ISO-8601"
}
```

## 3.3 Linguistic transformation (Claude call)

**`n8n/03-transform.json`** — Claude call node:

```json
{
  "name": "Linguistic Transform via Claude",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://api.anthropic.com/v1/messages",
    "method": "POST",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "bodyParametersJson": "={ \"model\": \"claude-opus-4-7\", \"max_tokens\": 256, \"messages\": [{ \"role\": \"user\", \"content\": \"Normalize the following value into a single integer. Respond with ONLY a JSON object: {\\\"value\\\": <int>, \\\"confidence\\\": <0..1>}. Input: \" + $json.enriched.{{ LINGUISTIC_FIELD }} }] }",
    "options": { "timeout": 15000 }
  }
}
```

*(note: every Claude call carries a `confidence` score in the response contract. Downstream scoring can de-weight low-confidence transforms instead of treating them as ground truth.)*

## 3.4 Edge-case handling

The Spec's edge-case table (Section 3.3) becomes branching nodes:

```json
{
  "name": "Route by enrichment status",
  "type": "n8n-nodes-base.switch",
  "parameters": {
    "rules": {
      "rules": [
        { "value1": "={{ $json.statusCode }}", "operation": "equal", "value2": "404", "outputKey": "to_manual_queue" },
        { "value1": "={{ $json.statusCode }}", "operation": "equal", "value2": "429", "outputKey": "retry_with_backoff" },
        { "value1": "={{ $json.enrichment_completeness }}", "operation": "smaller", "value2": "1.0", "outputKey": "partial_continue" }
      ]
    }
  }
}
```

## 3.5 Build steps

1. Import `n8n/02-enrichment.json` and `n8n/03-transform.json` into n8n.
2. Configure credentials for `{{ ENRICHMENT_PROVIDER }}`, Supabase, and Claude.
3. Activate workflows.
4. Send a known-good test payload through the ingress and watch the n8n executions log.

## 3.6 Verification

```bash
# Trigger end-to-end via ingress
./scripts/smoke-test.sh enrichment

# Expected: row in pipeline_records with status='enriched' and enriched_data populated within 10s
```

---

# Section 4 — Routing Implementation

Routing is a scoring function plus n8n branching plus per-destination handlers.

## 4.1 Scoring function

**`n8n/04-routing.json`** — code node:

```ts
// n8n Code node — TypeScript
type Tier = '{{ TIER_1_NAME }}' | '{{ TIER_2_NAME }}' | '{{ TIER_3_NAME }}';

function score(record: any): Tier {
  // {{ TIER_1_RULE }}
  if (record.enriched.{{ INTERNAL_VAR_1 }} >= {{ TIER_1_THRESHOLD }}) return '{{ TIER_1_NAME }}';
  // {{ TIER_2_RULE }}
  if (record.enriched.{{ INTERNAL_VAR_2 }} === '{{ TIER_2_MATCH }}') return '{{ TIER_2_NAME }}';
  // {{ TIER_3_RULE }} — default
  return '{{ TIER_3_NAME }}';
}

return [{ json: { ...$input.first().json, tier: score($input.first().json) } }];
```

*(note: keep the scoring function pure. No side effects, no I/O. That way it's testable in isolation as part of the Section 7 deterministic grader.)*

## 4.2 Multi-destination dispatch

**Switch node + per-tier subflows:**

```json
{
  "name": "Switch by Tier",
  "type": "n8n-nodes-base.switch",
  "parameters": {
    "rules": { "rules": [
      { "value1": "={{ $json.tier }}", "operation": "equal", "value2": "{{ TIER_1_NAME }}", "outputKey": "tier1" },
      { "value1": "={{ $json.tier }}", "operation": "equal", "value2": "{{ TIER_2_NAME }}", "outputKey": "tier2" },
      { "value1": "={{ $json.tier }}", "operation": "equal", "value2": "{{ TIER_3_NAME }}", "outputKey": "tier3" }
    ]}
  }
}
```

**Tier 1 → CRM (HubSpot reference):**

```json
{
  "name": "Create in {{ CRM_SYSTEM }}",
  "type": "n8n-nodes-base.hubspot",
  "parameters": {
    "resource": "contact",
    "operation": "upsert",
    "email": "={{ $json.enriched.email }}",
    "additionalFields": {
      "lifecyclestage": "{{ TIER_1_LIFECYCLE_STAGE }}",
      "ff_pipeline_id": "={{ $json.id }}"
    }
  }
}
```

**Tier 1 → Notification (no-PII format from Spec Section 4.3):**

```ts
// Code node before Slack send
const id = $json.id;
const hashFull = require('crypto').createHash('sha256').update($json.enriched.{{ PII_FIELD }}).digest('hex').slice(0, 8);
const summary = `${$json.enriched.{{ NON_PII_FIELD }}}`;
return [{ json: { message: `🔥 {{ TIER_1_NAME }}: ${id} — ${summary} (hash: ${hashFull})` } }];
```

## 4.3 Persisting the routing decision

```json
{
  "name": "Mark Routed",
  "type": "n8n-nodes-base.supabase",
  "parameters": {
    "operation": "update",
    "tableId": "pipeline_records",
    "filterType": "string",
    "filterString": "id=eq.{{ $json.id }}",
    "fieldsUi": { "fieldValues": [
      { "fieldId": "tier", "fieldValue": "={{ $json.tier }}" },
      { "fieldId": "status", "fieldValue": "routed" },
      { "fieldId": "routed_at", "fieldValue": "={{ new Date().toISOString() }}" }
    ]}
  }
}
```

## 4.4 Build steps

1. Import `n8n/04-routing.json`.
2. Configure CRM credentials for `{{ CRM_SYSTEM }}`.
3. Configure notification webhook for `{{ NOTIFICATION_CHANNEL }}`.
4. Activate.

## 4.5 Verification

Send three test records hitting each tier rule. Confirm:
- Each lands in the right destination (CRM / queue / archive).
- Tier 1 notifications contain hashes, not raw PII.
- `pipeline_records.tier` column is populated per record.

---

# Section 5 — Security Implementation

Security is foundational. Build this *before* anything else that needs secrets — which is everything.

## 5.1 Secrets pattern

**Never** put secrets in source. Loading pattern:

```ts
// worker/src/env.d.ts
export interface Env {
  WEBHOOK_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;     // server-side only — never to client
  N8N_INGRESS_WEBHOOK_URL: string;
  N8N_INTERNAL_TOKEN: string;
  AI_PROVIDER_API_KEY: string;
}
```

**Provisioning via Wrangler:**

```bash
wrangler secret put WEBHOOK_SECRET
wrangler secret put SUPABASE_SERVICE_KEY
wrangler secret put N8N_INTERNAL_TOKEN
wrangler secret put AI_PROVIDER_API_KEY
```

*(note: Cloudflare secrets are write-only post-set. To rotate, push a new value. Old value is destroyed immediately.)*

## 5.2 Supabase schema + RLS

**`db/migrations/001_initial_schema.sql`:**

```sql
create table public.pipeline_records (
  id uuid primary key,
  tenant_id uuid not null,
  raw_payload jsonb not null,
  enriched_data jsonb,
  tier text,
  status text not null default 'received',
  enrichment_completeness numeric(3,2),
  received_at timestamptz not null default now(),
  enriched_at timestamptz,
  routed_at timestamptz
);

create table public.pipeline_rejections (
  id bigserial primary key,
  reason text not null,
  raw_body_hash text not null,
  received_at timestamptz not null default now()
);

create table public.pipeline_audit (
  id bigserial primary key,
  record_id uuid not null,
  event text not null,
  detail jsonb,
  occurred_at timestamptz not null default now()
);

create index on public.pipeline_records (tenant_id, status);
create index on public.pipeline_records (received_at desc);
```

**`db/policies/rls.sql`:**

```sql
alter table public.pipeline_records enable row level security;
alter table public.pipeline_rejections enable row level security;
alter table public.pipeline_audit enable row level security;

-- Default: deny all. Then grant explicitly.
create policy "tenant_isolation_records"
  on public.pipeline_records for all
  using (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

create policy "service_role_full_access"
  on public.pipeline_records for all
  to service_role
  using (true) with check (true);

-- Repeat for pipeline_rejections, pipeline_audit
```

## 5.3 OAuth token refresh (Cron-driven Worker)

**`scripts/rotate-token.ts`:**

```ts
// Run as a Cloudflare Cron Worker every {{ TOKEN_ROTATION_INTERVAL }}.
// Falls back to alerting ops if rotation fails.
import type { Env } from '../worker/src/env';

export async function rotateCrmToken(env: Env): Promise<void> {
  const res = await fetch('{{ CRM_OAUTH_REFRESH_URL }}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: env.CRM_REFRESH_TOKEN,
      client_id: env.CRM_CLIENT_ID,
      client_secret: env.CRM_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    await alertOps(env, `CRM token refresh failed: ${res.status}`);
    throw new Error(`Refresh failed: ${res.status}`);
  }

  const { access_token, refresh_token } = await res.json() as { access_token: string; refresh_token: string };
  // Store new tokens via Cloudflare API (KV or secrets binding update)
  await updateSecrets(env, { CRM_ACCESS_TOKEN: access_token, CRM_REFRESH_TOKEN: refresh_token });
}
```

*(note: do NOT defer rotation to the integration platform default. Defaults vary across vendors and silently expire. Own it in code.)*

## 5.4 PII hashing helper

```ts
export async function pii_sha256_8(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf)).slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join('');
}
```

## 5.5 Build steps

1. Apply `db/migrations/001_initial_schema.sql` to Supabase.
2. Apply `db/policies/rls.sql`.
3. Set all Cloudflare secrets via Wrangler.
4. Schedule the token rotation Cron Worker.

## 5.6 Verification

```bash
# RLS check — service role can read everything
curl "$SUPABASE_URL/rest/v1/pipeline_records" -H "apikey: $SUPABASE_SERVICE_KEY"

# RLS check — anon role gets nothing
curl "$SUPABASE_URL/rest/v1/pipeline_records" -H "apikey: $SUPABASE_ANON_KEY"
# Expect: empty array []
```

---

# Section 6 — Resilience Implementation

Shared utilities for retry, throttle, and DLQ. Every workflow calls these.

## 6.1 Exponential backoff utility

```ts
// worker/src/backoff.ts
export async function withBackoff<T>(
  fn: () => Promise<T>,
  opts: { maxRetries?: number; baseMs?: number } = {},
): Promise<T> {
  const { maxRetries = 3, baseMs = 2000 } = opts;
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      const delay = baseMs * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
```

## 6.2 Dead-letter queue pattern

```sql
-- db/migrations/002_dlq.sql
create table public.pipeline_dlq (
  id bigserial primary key,
  record_id uuid,
  failed_stage text not null,        -- 'enrichment' | 'transform' | 'routing'
  error_class text not null,         -- '5xx' | 'auth' | 'schema_drift' | 'other'
  error_detail text,
  payload jsonb not null,
  attempts int not null default 0,
  next_retry_at timestamptz,
  resolved_at timestamptz,
  occurred_at timestamptz not null default now()
);

create index on public.pipeline_dlq (next_retry_at) where resolved_at is null;
```

**DLQ enqueue node (after exhausted retries):**

```json
{
  "name": "Send to DLQ",
  "type": "n8n-nodes-base.supabase",
  "parameters": {
    "operation": "create",
    "tableId": "pipeline_dlq",
    "fieldsUi": { "fieldValues": [
      { "fieldId": "record_id", "fieldValue": "={{ $json.id }}" },
      { "fieldId": "failed_stage", "fieldValue": "enrichment" },
      { "fieldId": "error_class", "fieldValue": "={{ $json.errorClass }}" },
      { "fieldId": "error_detail", "fieldValue": "={{ $json.errorDetail }}" },
      { "fieldId": "payload", "fieldValue": "={{ JSON.stringify($json) }}" },
      { "fieldId": "next_retry_at", "fieldValue": "={{ new Date(Date.now() + 1000 * 60 * 60).toISOString() }}" }
    ]}
  }
}
```

## 6.3 Throttling (token bucket per workflow run)

```ts
// Use n8n's built-in execution-level concurrency limit.
// In n8n settings: N8N_EXECUTIONS_PROCESS=main, N8N_WORKER_CONCURRENCY={{ MAX_CONCURRENT_RUNS }}
// Per-workflow throttle via the "Wait" node in front of provider calls:
```

```json
{
  "name": "Throttle for {{ ENRICHMENT_PROVIDER }}",
  "type": "n8n-nodes-base.wait",
  "parameters": { "amount": "={{ Math.ceil(60 / {{ ENRICHMENT_RPS_LIMIT }}) }}", "unit": "seconds" }
}
```

## 6.4 Error classes & alerting

```ts
// worker/src/errors.ts
export type ErrorClass = 'transient_429' | 'persistent_5xx' | 'auth' | 'schema_drift' | 'other';

export async function alertOps(env: Env, message: string, level: 'warn' | 'critical' = 'warn') {
  await fetch(env.NOTIFICATION_OPS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: `[${level.toUpperCase()}] ${message}` }),
  });
}
```

## 6.5 Build steps

1. Apply `db/migrations/002_dlq.sql`.
2. Import `n8n/06-resilience-shared.json` as a sub-workflow.
3. Wire the throttle and DLQ nodes into Sections 3–4.
4. Schedule a DLQ-retry workflow (every 15 min, processes records with `next_retry_at < now()`).

## 6.6 Verification

```bash
# Force a 5xx and check DLQ enqueue
curl -X POST {{ TRIGGER_ENDPOINT_URL }} -H "X-Signature: ..." -d '{"force_error": "5xx"}'
psql $DB_URL -c "select count(*) from pipeline_dlq where resolved_at is null;"
# Expect: >= 1
```

---

# Section 7 — Evaluation Implementation

This section is the difference between a vibe-coded pipeline and a production one.

## 7.1 Golden Set fixture format

**`eval/fixtures/golden-set.jsonl`** (`{{ GOLDEN_SET_SIZE }}` lines):

```json
{"id":"gs-001","input":{"{{ FIELD_1_NAME }}":"...","source":"..."},"expected":{"tier":"{{ TIER_1_NAME }}","enrichment_completeness_min":0.8}}
{"id":"gs-002","input":{"{{ FIELD_1_NAME }}":"...","source":"..."},"expected":{"tier":"{{ TIER_2_NAME }}","enrichment_completeness_min":0.6}}
{"id":"gs-003","input":{"{{ FIELD_1_NAME }}":"...","source":"..."},"expected":{"tier":"{{ TIER_3_NAME }}","enrichment_completeness_min":0.4}}
```

*(note: one fixture per tier minimum, plus one fixture per edge case from Spec 3.3. The set grows over time; never shrinks.)*

## 7.2 Deterministic grader

**`eval/deterministic.test.ts`:**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { score } from '../n8n/scoring-extracted';   // extracted from n8n code node for testability

const fixtures = readFileSync('./eval/fixtures/golden-set.jsonl', 'utf-8')
  .split('\n').filter(Boolean).map(line => JSON.parse(line));

describe('Routing — pass@1', () => {
  let passed = 0;
  fixtures.forEach(f => {
    it(`${f.id} routes to ${f.expected.tier}`, () => {
      const result = score(f.input);
      const correct = result === f.expected.tier;
      if (correct) passed++;
      expect(result).toBe(f.expected.tier);
    });
  });

  it(`pass@1 >= {{ PASS_AT_1_TARGET }}`, () => {
    const passRate = passed / fixtures.length;
    expect(passRate).toBeGreaterThanOrEqual({{ PASS_AT_1_TARGET_DECIMAL }});
  });
});
```

## 7.3 Model-based grader (Claude as judge)

**`eval/model-judge.ts`:**

```ts
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

const RUBRIC = `
Score the linguistic transformation on these axes (1-5):
1. Numerical accuracy — did the transformer return the correct standardized value?
2. Confidence calibration — was the confidence score appropriate for ambiguity?
3. Edge handling — did edge inputs return reasonable defaults or null?

Return JSON: { "numerical": int, "calibration": int, "edge": int, "notes": "..." }
`;

export async function judge(input: string, output: any, expected: any): Promise<any> {
  const res = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `${RUBRIC}\n\nInput: ${input}\nTransformer output: ${JSON.stringify(output)}\nExpected: ${JSON.stringify(expected)}`,
    }],
  });
  const text = res.content[0].type === 'text' ? res.content[0].text : '';
  return JSON.parse(text);
}
```

## 7.4 CI integration

**`.github/workflows/golden-set-replay.yml`:**

```yaml
name: Golden Set Replay
on:
  pull_request:
    paths:
      - 'worker/src/**'
      - 'n8n/**'
      - 'eval/**'

jobs:
  replay:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - name: Run deterministic graders
        run: npm run test:eval
      - name: Run model-based grader (sampled)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run test:judge -- --sample 5
```

## 7.5 Shadow deployment

For non-trivial changes to scoring, route both old and new logic for the agreed `{{ SHADOW_DURATION }}`:

```ts
// In the n8n routing workflow, after scoring:
const oldTier = legacyScore(record);
const newTier = score(record);
if (oldTier !== newTier) {
  await logShadowDivergence({ id: record.id, oldTier, newTier });
}
// Continue using oldTier for actual routing during shadow
return oldTier;
```

## 7.6 Build steps

1. Create `eval/fixtures/golden-set.jsonl` with at least `{{ GOLDEN_SET_SIZE }}` labeled records.
2. Extract scoring logic from the n8n code node into `n8n/scoring-extracted.ts` for unit testing.
3. Install Vitest + the Anthropic SDK in the repo.
4. Wire the CI workflow into branch protection on `main`.

## 7.7 Verification

```bash
npm run test:eval                 # deterministic graders
npm run test:judge -- --sample 5  # model-based grader
# Both must pass before any deploy.
```

---

# Section 8 — Deployment Implementation

## 8.1 CI/CD pipeline

**`.github/workflows/deploy-worker.yml`:**

```yaml
name: Deploy Worker
on:
  push:
    branches: [main]
    paths: ['worker/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd worker && npm ci
      - name: Run Golden Set replay first
        run: npm run test:eval
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: 'worker'
      - name: Smoke test
        env:
          WEBHOOK_SECRET: ${{ secrets.WEBHOOK_SECRET }}
        run: ./scripts/smoke-test.sh full
```

## 8.2 Environment inventory

| Variable | Owner | Rotation due | Notes |
|---|---|---|---|
| `WEBHOOK_SECRET` | {{ OWNER_1 }} | {{ ROTATION_DATE_1 }} | HMAC ingress |
| `ENRICHMENT_API_KEY` | {{ OWNER_2 }} | {{ ROTATION_DATE_2 }} | {{ ENRICHMENT_PROVIDER }} |
| `SUPABASE_SERVICE_KEY` | {{ OWNER_3 }} | {{ ROTATION_DATE_3 }} | DB writes |
| `CRM_ACCESS_TOKEN` | {{ OWNER_4 }} | {{ TOKEN_ROTATION_INTERVAL }} | rotated automatically |
| `AI_PROVIDER_API_KEY` | {{ OWNER_5 }} | {{ ROTATION_DATE_5 }} | Claude |
| `N8N_INTERNAL_TOKEN` | {{ OWNER_6 }} | {{ ROTATION_DATE_6 }} | Worker → n8n auth |
| `NOTIFICATION_WEBHOOK_URL` | {{ OWNER_7 }} | n/a | Slack/Teams |

## 8.3 Smoke test script

**`scripts/smoke-test.sh`:**

```bash
#!/usr/bin/env bash
set -euo pipefail

MODE=${1:-quick}
ENDPOINT="${TRIGGER_ENDPOINT_URL:?TRIGGER_ENDPOINT_URL must be set}"
SECRET="${WEBHOOK_SECRET:?WEBHOOK_SECRET must be set}"

run_test() {
  local name="$1" payload="$2" expect_status="$3"
  local sig
  sig=$(printf '%s' "$payload" | openssl dgst -sha256 -hmac "$SECRET" -hex | awk '{print $2}')
  local code
  code=$(curl -s -o /tmp/smoke-resp -w '%{http_code}' -X POST "$ENDPOINT" \
    -H 'Content-Type: application/json' -H "X-Signature: $sig" -d "$payload")
  if [[ "$code" != "$expect_status" ]]; then
    echo "FAIL [$name] expected $expect_status got $code"; cat /tmp/smoke-resp; exit 1
  fi
  echo "PASS [$name]"
}

run_test "good-payload" '{"id":"550e8400-e29b-41d4-a716-446655440000","{{ FIELD_1_NAME }}":"smoke","source":"manual"}' 200
run_test "bad-schema" '{}' 200   # rejected but 200 (log-only)

if [[ "$MODE" == "full" ]]; then
  run_test "bad-hmac" '{"id":"x"}' 401
fi

echo "All smoke tests passed."
```

## 8.4 Observability — PostHog events

```ts
// worker/src/posthog.ts
export async function track(env: Env, event: string, properties: Record<string, unknown>) {
  await fetch(`${env.POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: env.POSTHOG_API_KEY,
      event,
      properties: { ...properties, $insert_id: crypto.randomUUID() },
      timestamp: new Date().toISOString(),
    }),
  });
}

// Usage:
// await track(env, 'pipeline_record_accepted', { id, source });
// await track(env, 'pipeline_record_rejected', { reason });
```

**Standard events to emit:**

- `pipeline_record_received`
- `pipeline_record_rejected` (with `reason`)
- `pipeline_record_enriched` (with `enrichment_completeness`)
- `pipeline_record_routed` (with `tier`)
- `pipeline_dlq_enqueued` (with `failed_stage`, `error_class`)
- `pipeline_golden_set_regression` (CI-emitted)

## 8.5 Build steps

1. Configure CI secrets in GitHub (Cloudflare token, Anthropic key, Supabase keys).
2. Push to main — deploy workflow runs.
3. Verify smoke tests pass in the CI log.
4. Run `./scripts/smoke-test.sh full` locally against production.

## 8.6 Verification

```bash
# Full end-to-end after deploy
./scripts/smoke-test.sh full

# Check PostHog for pipeline_record_received event within 60s
# Check Supabase pipeline_records for the test record
psql $DB_URL -c "select id, status, tier from pipeline_records order by received_at desc limit 5;"
```

---

# Appendix A — Reference repo structure (full)

See top of doc. Repeated here for the engineer reading mid-incident:

```
ff-pipeline-{{ CLIENT_SLUG }}/
├── worker/
├── n8n/
├── db/
├── eval/
├── .github/workflows/
├── scripts/
└── README.md
```

# Appendix B — Variant platform notes

## If using Make instead of n8n

- Scenarios replace workflows. Each n8n workflow JSON corresponds to a Make scenario blueprint.
- Make's HTTP module is the equivalent of n8n's `httpRequest`. Authentication is configured per-module.
- Make does not have an inline TypeScript code node. Use a Custom Function or move scoring logic into a Cloudflare Worker called from Make.
- Throttling: use Make's built-in scenario scheduling rather than the wait node.

## If using Temporal instead of n8n

- Each n8n workflow becomes a Temporal Workflow function in TypeScript.
- Each external call becomes an Activity with built-in retry policy.
- DLQ pattern is replaced by Temporal's native retry + dead-letter handling.
- Throttling moves to Activity-level concurrency limits.

## If using custom Node orchestration

- Use BullMQ or similar for queue-backed workflow execution.
- Implement retry, DLQ, and throttle utilities from this template.
- Lose visual debugging — gain full type safety. Trade-off is project-specific.

# Appendix C — Acceptance Checklist

- [ ] All `{{ }}` placeholders replaced.
- [ ] No secrets in source. Verified via `git secrets --scan` or equivalent.
- [ ] Section 5.2 RLS policies enabled on every Supabase table.
- [ ] Section 5.3 token rotation cron is scheduled and tested.
- [ ] Section 2.6 verification curls all pass against production.
- [ ] Section 6 DLQ is wired into Sections 3–4 and the retry workflow is active.
- [ ] Section 7.1 Golden Set has at least `{{ GOLDEN_SET_SIZE }}` labeled fixtures.
- [ ] Section 7.4 CI is wired into branch protection on `main`.
- [ ] Section 8.1 deploy workflow has run successfully at least once.
- [ ] Section 8.3 smoke test passes in `full` mode against production.
- [ ] Section 8.4 PostHog events visible in dashboard within 60s of a real request.
- [ ] README in repo root names the on-call owner and links to Spec + Run docs.

---

*FlashFusion Pipeline Build Template v1.0 — built on the Outcome-Aware AI Systems framework. Uses canonical vocabulary from the Cross-Lane Glossary: Architecture Before Generation, GIGO Validation, Golden Set, Tier Matrix, Scope Gate, Shadow Deployment, Specs-Driven Loop, Uncertainty Architecture.*
