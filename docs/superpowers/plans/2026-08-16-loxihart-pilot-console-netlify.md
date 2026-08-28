# Loxihart Pilot Console on Netlify Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub-owned React Pilot Console under `loxihart/pilot-console`, route all canonical operations through one Netlify Function proxy to the existing Loxihart Control API, verify the existing preservation suite before expanding the UI, and deploy the resulting app to the connected Netlify Free account.

**Architecture:** `loxihart/pilot-console` is a Vite + React + TypeScript frontend. A single Netlify Function at `/api/loxihart` accepts only an allowlisted operation name, injects server-owned Loxihart demo identity headers, forwards one upstream request without retries, and preserves upstream status/body exactly. The browser owns only view state; canonical progress, verdicts, hashes, receipts, signatures, and history remain in the existing Control API/Supabase authority.

**Tech Stack:** React 19, TypeScript, Vite, Netlify Functions, Node test runner for transport preservation, existing Supabase Edge Control API.

## Global Constraints

- Do not move verdict logic, authoritative hashes, receipt signing, or canonical progress into the frontend or Netlify Function.
- Run the existing 13-case preservation suite before expanding the UI.
- Upstream 403, 404, 409, 422, and 500 status/body must be preserved exactly.
- Generate 502 only when no upstream HTTP response is obtained because of network failure.
- Generate 504 only when the proxy timeout aborts before an upstream HTTP response is obtained.
- Never automatically retry canonical mutations.
- Browser-supplied Loxihart authority headers must never override server-owned identity.
- Keep Netlify on the connected Free account.
- Keep all source under GitHub in `Krosebrook/abstrekkt`.

---

### Task 1: Freeze the transport baseline

**Files:**
- Reuse: `loxihart/floot-proxy-reference/LoxihartUpstream.mjs`
- Reuse: `loxihart/floot-proxy-reference/LoxihartUpstream.test.mjs`

- [ ] Run `node --test LoxihartUpstream.test.mjs` before UI code exists.
- [ ] Require 13 passing tests and zero failures.

### Task 2: Add the Netlify proxy contract

**Files:**
- Create: `loxihart/pilot-console/src/server/loxihartTransport.ts`
- Create: `loxihart/pilot-console/netlify/functions/loxihart.mts`
- Create: `loxihart/pilot-console/tests/loxihartTransport.test.mjs`

**Interfaces:**
- `forwardLoxihart({ url, method, body, browserHeaders, identity, fetchImpl, timeoutMs }) -> Promise<Response>`
- Netlify Function `POST /api/loxihart` body: `{ operation, ...payload }`
- Netlify Function `GET /api/loxihart?operation=health|pilot.read|stream.head|stream.read`

Allowlisted operation mapping:
- `health` -> `GET /health`
- `pilot.read` -> `GET /v1/pilots/pilot-lakeview-001`
- `workflow.approve` -> `POST /v1/pilots/pilot-lakeview-001/workflow/approve`
- `sop.approve` -> `POST /v1/pilots/pilot-lakeview-001/sop/approve`
- `baseline.lock` -> `POST /v1/pilots/pilot-lakeview-001/baseline/lock`
- `change.approve` -> `POST /v1/pilots/pilot-lakeview-001/change/approve`
- `evidence.append` -> `POST /v1/pilots/pilot-lakeview-001/evidence`
- `verification.commit` -> `POST /v1/pilots/pilot-lakeview-001/verification/commit`
- `stream.head` -> `GET /v1/pilots/pilot-lakeview-001/stream/head`
- `stream.read` -> `GET /v1/pilots/pilot-lakeview-001/stream`
- `receipt.read` -> `GET /v1/pilots/pilot-lakeview-001/receipts/{receiptId}`
- `receipt.verify` -> `POST /v1/pilots/pilot-lakeview-001/receipts/{receiptId}/verify`

- [ ] Write failing Netlify transport tests first.
- [ ] Verify they fail because the transport/function does not yet exist.
- [ ] Implement the smallest allowlisted proxy.
- [ ] Run transport tests and the original 13-case preservation suite.

### Task 3: Create the minimal React shell

**Files:**
- Create: `loxihart/pilot-console/package.json`
- Create: `loxihart/pilot-console/index.html`
- Create: `loxihart/pilot-console/vite.config.ts`
- Create: `loxihart/pilot-console/tsconfig.json`
- Create: `loxihart/pilot-console/netlify.toml`
- Create: `loxihart/pilot-console/src/main.tsx`
- Create: `loxihart/pilot-console/src/App.tsx`
- Create: `loxihart/pilot-console/src/api.ts`
- Create: `loxihart/pilot-console/src/styles.css`

- [ ] Build only a status shell that loads `health`, `pilot.read`, and `stream.head` through `/api/loxihart`.
- [ ] Show canonical service unavailable on proxy/API failure; never fall back to local canonical state.
- [ ] Run typecheck/build.

### Task 4: Expand the Pilot Console only after transport remains green

**Files:**
- Modify: `loxihart/pilot-console/src/App.tsx`
- Modify: `loxihart/pilot-console/src/api.ts`
- Modify: `loxihart/pilot-console/src/styles.css`

- [ ] Implement lifecycle progress from `pilot.stage`.
- [ ] Wire workflow approval, SOP approval, baseline lock, change approval, sequential evidence append, verification commit, receipt read/verify, history, and Reset View.
- [ ] On `409 STALE_VERSION`, refresh `pilot.read` and require deliberate retry.
- [ ] On `409 DUPLICATE_MUTATION`, refresh pilot/head and do not issue a replacement mutation automatically.
- [ ] Render server-returned verdicts/hashes/signatures only.
- [ ] Run build and preservation tests again.

### Task 5: Netlify deployment

**Files:**
- Use: `loxihart/pilot-console/netlify.toml`

- [ ] Create a new Netlify project under team `krosebrook` on the Free plan.
- [ ] Configure base directory `loxihart/pilot-console`.
- [ ] Configure build command `npm run build` and publish directory `dist`.
- [ ] Configure `LOXIHART_DEMO_TOKEN` as a secret runtime environment variable.
- [ ] Deploy the site.
- [ ] Verify `/api/loxihart?operation=health` and the published frontend.
- [ ] Re-run the preservation suite against the final source and report any connector/deploy limitation without pretending success.
