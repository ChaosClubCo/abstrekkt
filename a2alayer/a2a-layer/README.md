# A2A Layer — Agent2Agent interoperability for Kyle's 40 managed agents

Wraps each of the 40 `managed-agents-2026-04-01` agents in a spec-compliant
**Agent2Agent (A2A)** server so they are discoverable, callable over a standard
wire protocol, and able to delegate sub-tasks to one another — under a guard that
enforces `INTINC` / `PERSONAL` / `FREELANCE` lane isolation.

Built on the official `@a2a-js/sdk` (v0.3.x). Cards advertise protocol
`0.3.0`, discoverable at `/.well-known/agent-card.json`, transported over
JSON-RPC 2.0. Verified against the installed SDK — not against documentation.

---

## What this is (and isn't)

- **Is:** a transport + orchestration layer. It turns 40 isolated agents into a
  discoverable mesh with a directory, per-agent A2A endpoints, a delegation
  router, bearer auth, and a lane-isolation guard.
- **Isn't:** a replacement for the agents' reasoning. The actual "thinking" is
  delegated to a pluggable **backend** (`mock` / `claude` / `managed`). Swapping
  backends never changes the wire protocol.

---

## File tree

```
a2a-layer/
├── data/kyle-40-agents.md          # source of truth (parsed into Agent Cards)
├── cards/                          # generated: 40 Agent Cards + _directory.json
├── src/
│   ├── config.ts                   # env-only config, fail-fast validation
│   ├── types.ts                    # AgentDef, Lane, DelegationChain
│   ├── registry/
│   │   ├── parseAgents.ts          # markdown/YAML -> AgentDef[] (+ lane derivation)
│   │   ├── buildAgentCard.ts       # AgentDef -> A2A AgentCard (pure)
│   │   └── registry.ts             # index + skill search + agent directory
│   ├── backends/
│   │   ├── AgentBackend.ts         # backend seam (interface)
│   │   ├── modelTiers.ts           # cross-provider tier routing (haiku/sonnet/opus)
│   │   ├── MockBackend.ts          # deterministic, no network (tests/dev)
│   │   ├── ClaudeMessagesBackend.ts# Anthropic Messages API (model-only)
│   │   ├── OpenAIResponsesBackend.ts  # OpenAI Responses API (developers.openai.com)
│   │   ├── GoogleGeminiBackend.ts  # Gemini API / Vertex AI (console.google.com)
│   │   ├── HttpManagedAgentBackend.ts # -> platform managed-agents run endpoint
│   │   └── factory.ts              # backend selection from config
│   ├── server/
│   │   ├── ManagedAgentExecutor.ts # backend -> A2A task lifecycle events
│   │   ├── auth.ts                 # constant-time bearer middleware
│   │   ├── delegationGuard.ts      # depth / cycle / lane rules
│   │   └── server.ts               # Express app: 40 agents + directory + admin
│   ├── client/
│   │   └── A2ARouter.ts            # in-process + remote agent-to-agent calls
│   └── index.ts                    # entrypoint
├── scripts/generate-cards.ts       # writes ./cards
└── test/smoke.test.ts              # 14 checks incl. live HTTP round-trip
```

## BUILD

```bash
npm install
cp .env.example .env            # set A2A_BACKEND, tokens as needed
npm run generate:cards          # regenerate ./cards from data/kyle-40-agents.md
npm run typecheck               # tsc --noEmit (clean)
npm test                        # 14 smoke checks
npm start                       # boot the gateway
```

Requires Node >= 20.

## OUTPUT — endpoints

Per agent `{slug}`:

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/agents/{slug}/.well-known/agent-card.json` | public | A2A card discovery |
| POST | `/agents/{slug}` | bearer | JSON-RPC 2.0 (`message/send`, `message/stream`, `tasks/get`, `tasks/cancel`, `tasks/resubscribe`) |

Global:

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/healthz` | public | liveness + agent count |
| GET | `/.well-known/agents.json` | public | agent directory (name, slug, lane, cardUrl, skill tags) |
| POST | `/admin/delegate` | bearer | agent-to-agent delegation `{ from, to, text }` |

### Verification / acceptance criteria

- `npm run typecheck` exits 0.
- `npm test` prints `18 checks passed.` — includes a real SDK-client round trip
  (card discovery → `message/send` → `completed` Task with artifact), a guarded
  in-process delegation, cross-provider tier routing, and fail-fast config checks
  for the OpenAI/Google backends.
- `npm run generate:cards` writes 40 cards (`PERSONAL=33, INTINC=7`) + directory.
- Protected mode: JSON-RPC without a valid `Authorization: Bearer` → HTTP 401;
  card discovery stays public.

## Backends

The wire protocol is identical for every backend — only the "brain" changes,
selected by `A2A_BACKEND`.

| `A2A_BACKEND` | Executes with | SDK | Runs MCP tools? | Use |
|---|---|---|---|---|
| `mock` | deterministic echo | — | no | tests, local smoke — no credentials |
| `claude` | Anthropic Messages API | `@anthropic-ai/sdk` | no (model-only) | reasoning without live tools |
| `openai` | OpenAI Responses API (developers.openai.com) | `openai` | no (model-only) | run agents on GPT-5-class models |
| `google` | Gemini API / Vertex AI (console.google.com) | `@google/genai` | no (model-only) | run agents on Gemini models |
| `managed` | HTTP POST to `${MANAGED_AGENTS_BASE_URL}/{slug}/runs` | — | yes (in the managed runtime) | production tool-backed execution |

The `managed` backend is the integration seam to `platform.claude.com`. It makes
a real bearer-authenticated call and defensively parses common response shapes
(`output_text` / `text` / `content[].text` / `message.content[].text`). Confirm
the exact run contract for your workspace and adjust the request body /
`extractText` if it differs.

### Cross-provider model routing

Each agent declares a Claude model implying a capability tier. When run on
another provider, the tier is preserved rather than flattened:

| Agent's Claude model | Tier | OpenAI default | Gemini default |
|---|---|---|---|
| `*haiku*` | fast | `gpt-5-mini` | `gemini-2.5-flash` |
| `*sonnet*` / default | balanced | `gpt-5` | `gemini-2.5-pro` |
| `*opus*` | deep | `gpt-5` | `gemini-2.5-pro` |

Override any tier via `OPENAI_MODEL_FAST|BALANCED|DEEP` /
`GOOGLE_MODEL_FAST|BALANCED|DEEP`, or pin one model for all agents via
`OPENAI_MODEL` / `GOOGLE_MODEL`. **Verify the model ids against your accounts** —
defaults are best-effort and change frequently.

Google supports two auth modes: **Gemini API** (`GOOGLE_API_KEY`) or **Vertex AI**
(`GOOGLE_GENAI_USE_VERTEXAI=true` + `GOOGLE_CLOUD_PROJECT` + `GOOGLE_CLOUD_LOCATION`,
using Application Default Credentials). OpenAI supports any OpenAI-compatible
endpoint via `OPENAI_BASE_URL` (e.g. Azure OpenAI).

## Lane isolation (the security control)

Every agent is tagged `INTINC` (MSP Service Desk group) or `PERSONAL` (all other
groups). `FREELANCE` is reserved for per-client isolation. The delegation guard
rejects, before any call is made:

1. **Depth** — chains longer than `A2A_MAX_DELEGATION_DEPTH` (default 3).
2. **Cycles** — re-entering an agent already in the chain.
3. **Cross-lane** — `INTINC ⇄ PERSONAL` calls, unless explicitly allowlisted via
   `A2A_CROSS_LANE_ALLOWLIST` (e.g. `PERSONAL>FREELANCE`).

This mirrors the standing "never bleed context across lanes" rule: an INTINC
service-desk agent cannot silently pull PERSONAL/FlashFusion context.

## Security notes

- Secrets are read from env only — never hardcoded, never written to cards or
  logs. Boot fails fast if a selected backend's secret is missing.
- Gateway bearer token is compared in constant time.
- If `A2A_GATEWAY_TOKEN` is unset the gateway runs in OPEN mode and logs a loud
  warning — acceptable for localhost, never for exposed deployments.
- Agent Cards advertise each agent's declared MCP write posture via skill tags;
  they do **not** embed any credentials.

## Known gaps / next steps

- Tasks use the SDK `InMemoryTaskStore` — durable across process restarts requires
  implementing `TaskStore` against Supabase (small `save`/`load` surface).
- Push notifications (webhooks) are declared unsupported (`capabilities.pushNotifications=false`);
  wire `DefaultPushNotificationSender` if async callbacks are needed.
- `protocolVersion` is pinned to `0.3.0` to match the installed SDK's wire
  format; bump with the SDK when a 1.0.0 wire implementation ships.
- The `managed` backend's request/response mapping is a documented seam, not a
  verified contract — confirm against your platform workspace before production.
- The `openai` and `google` backends are type-verified against their installed
  SDKs and unit-tested for construction/routing, but were **not** executed
  against live APIs here (no keys). Default model ids are best-effort — verify
  against developers.openai.com and console.google.com before production.
- Provider backends are model-only: they run each agent's system prompt but do
  not execute its MCP tools. Tool-backed cross-provider execution would need each
  provider's own tool/function-calling wiring or the `managed` runtime.
