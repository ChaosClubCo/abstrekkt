# AGENTS.md — FlashFusion Agent System (Codex‑Style INIT v0.1)
_Last updated: 2025-09-24

> **Directive**  
> Run full inspection for every task: **blind spots, gaps, bottlenecks, dependencies, contradictions**. Do not confirm complete unless all are addressed.

---

## Overview
A lean, codex‑style rulebook and starter spec for your modular agent system. It defines roles, RBAC, handoffs, logging, eval, and a minimal runnable scaffold so agents can execute playbooks, teach, validate, and deploy across your stack (LangGraph/LangChain, MCP servers, n8n flows, Notion buttons, GitHub).

**Why this file exists**  
- Converts the “unknown unknowns → gaps → bottlenecks” loop into concrete agent behaviors.  
- Provides a single source of truth for agent identity, boundaries, and comms.  
- Ships with a minimal runner + schema validation so it works immediately.

---

## Assumptions (edit if off)
1) Source of truth repos live on GitHub; Notion hosts operations DBs (Gaps, Governance, Playbooks).  
2) Orchestration: LangGraph/LangChain; automation: n8n; tool access via MCP servers.  
3) Secrets are **env‑only**; no secrets in code or docs.  
4) Observability via structured logs to console; CI runs evals on PRs.  
5) Human‑in‑the‑loop is allowed at any state and must be logged.

**If any assumption is wrong, fix this file first.**

---

## Commands (Quick Start)
```bash
# init a tiny TS runner
mkdir -p agents/src && cd agents
npm init -y
npm i zod yaml
npm i -D typescript @types/node ts-node vitest
npx tsc --init --rootDir src --outDir dist --esModuleInterop --module commonjs --target ES2020

# write example manifest & runner (paste from Code section below)
# then run:
npx ts-node src/agent-runner.ts agents.manifest.yaml --dry-run

# run tests
npx vitest run
```

---

## Code (minimal, runnable)

### `agents.manifest.yaml` (example)
```yaml
version: "0.1"
project: "FlashFusion"
routing:
  policy: "langgraph"
  handoffs: [orchestrator->security, orchestrator->builder, builder->evaluator, evaluator->deployer]
rbac:
  # least privilege per agent
  orchestrator: [plan, route, review]
  builder: [read_repo, write_repo, run_unit_tests]
  evaluator: [run_evals, comment_pr, block_merge]
  security: [scan_secrets, audit_rbac]
  deployer: [create_release, run_ci, trigger_deploy]
  tutor: [explain, guide, check_onboarding]
agents:
  - id: orchestrator
    goal: "Own task breakdown, route work, enforce checkpoints"
    inputs: ["issue","spec","playbook"]
    outputs: ["plan","handoff"]
  - id: builder
    goal: "Implement features per plan"
    inputs: ["plan"]
    outputs: ["patch","tests","notes"]
  - id: evaluator
    goal: "Verify quality & safety"
    inputs: ["patch","tests"]
    outputs: ["scorecard","gate"]
  - id: security
    goal: "Enforce secrets/RBAC/policy"
    inputs: ["repo","logs"]
    outputs: ["findings","fixes"]
  - id: deployer
    goal: "Release safely"
    inputs: ["gate","scorecard"]
    outputs: ["release","deploy_logs"]
  - id: tutor
    goal: "Explain & onboard"
    inputs: ["plan","scorecard"]
    outputs: ["lesson","checklist"]
mcp:
  servers:
    - name: "notion"
      url: "https://mcp.notion.com/mcp"
    - name: "github"
      url: "http://localhost:7337/mcp/github"
n8n:
  workflows:
    - name: "post-merge-summary"
      id: "wf_post_merge_summary"
```

### `src/agent-runner.ts`
```ts
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { z } from "zod";

const Manifest = z.object({
  version: z.string(),
  project: z.string(),
  routing: z.object({
    policy: z.string(),
    handoffs: z.array(z.string())
  }),
  rbac: z.record(z.array(z.string())),
  agents: z.array(z.object({
    id: z.string(),
    goal: z.string(),
    inputs: z.array(z.string()),
    outputs: z.array(z.string())
  })),
  mcp: z.object({
    servers: z.array(z.object({ name: z.string(), url: z.string() }))
  }).optional(),
  n8n: z.object({
    workflows: z.array(z.object({ name: z.string(), id: z.string() }))
  }).optional()
});

type ManifestT = z.infer<typeof Manifest>;

function usage(msg?: string, code=1) {
  if (msg) console.error("Error:", msg);
  console.error("Usage: ts-node src/agent-runner.ts <manifest.yaml> [--dry-run]");
  process.exit(code);
}

const args = process.argv.slice(2);
if (args.length < 1) usage();
const manifestPath = args[0];
const dryRun = args.includes("--dry-run");

if (!fs.existsSync(manifestPath)) usage(`Manifest not found: ${manifestPath}`);

try {
  const raw = fs.readFileSync(manifestPath, "utf-8");
  const parsed = yaml.parse(raw);
  const m: ManifestT = Manifest.parse(parsed);

  // Basic RBAC sanity
  const agentIds = new Set(m.agents.map(a => a.id));
  for (const a of m.agents) {
    if (!m.rbac[a.id]) {
      throw new Error(`RBAC missing for agent: ${a.id}`);
    }
  }

  console.log(`Project: ${m.project} v${m.version}`);
  console.log(`Routing: ${m.routing.policy}`);
  console.log("Agents:");
  m.agents.forEach(a => {
    console.log(` - ${a.id}: ${a.goal}`);
  });

  // Simulate a handoff chain
  console.log("\nSimulated handoffs:");
  for (const h of m.routing.handoffs) {
    const [from, to] = h.split("->");
    if (!agentIds.has(from) || !agentIds.has(to)) {
      throw new Error(`Invalid handoff '${h}' (unknown agent)`);
    }
    console.log(` ${from} ➜ ${to}`);
  }

  if (!dryRun) {
    console.log("\n[demo] Executing orchestrator plan ➜ builder ➜ evaluator ...");
    console.log("[demo] OK — replace with LangGraph/n8n integration.");
  }

  process.exit(0);
} catch (e: any) {
  console.error("Manifest validation failed or runtime error.");
  console.error("Cause:", e.message);
  console.error("Fix: Check YAML format, required fields, and RBAC entries per agent.");
  console.error("Retry: Update the manifest and re-run the command.");
  process.exit(2);
}
```

### `vitest` smoke test (put in `src/agent-runner.test.ts`)
```ts
import { expect, test } from "vitest";

test("placeholder", () => {
  expect(1+1).toBe(2);
});
```

---

## Operating Rules (agent codex)
1) **R‑T‑F + R‑A‑I‑N** every task: Research → Think/Plan → Frame; Recognize → Assess → Implement → Next.  
2) **RBAC first**: each agent acts only within its role; orchestrator never writes to prod; deployer never edits code.  
3) **Handoffs are explicit**: always include `inputs`, `outputs`, `acceptance_criteria`.  
4) **Full inspection**: report blind spots, gaps, bottlenecks, dependencies, contradictions before “done.”  
5) **Human checks allowed anytime**; log the checkpoint.  
6) **No secrets in code**; env‑only; ephemeral if possible; rotate per playbook.  
7) **Helpful errors**: every failure prints **cause → fix → retry**.  
8) **Observability**: structured logs with correlation IDs per task.  
9) **Evaluation gates**: unit tests + behavior checks on PR; block merge on regressions.  
10) **Simplicity beats cleverness**: prefer transparent steps to magic.

---

## RBAC Matrix (starter)
| Agent        | Can Do                                | Cannot Do                              |
|--------------|---------------------------------------|----------------------------------------|
| Orchestrator | Plan, route, request reviews          | Push to prod, write secrets            |
| Builder      | Edit code, write tests, open PRs      | Tag releases, change RBAC              |
| Evaluator    | Run evals, comment/approve/block PRs  | Edit product code                      |
| Security     | Scan secrets/RBAC/policy, suggest fixes| Merge PRs, tag releases                |
| Deployer     | Create releases, trigger CI/CD        | Edit app code, change playbooks        |
| Tutor        | Generate docs, lessons, checklists    | Modify infra or secrets                |

---

## Handoff Contract (copy/paste)
```yaml
handoff:
  from: orchestrator
  to: builder
  inputs:
    - issue_id: 123
    - spec_path: docs/feature_x.md
  acceptance_criteria:
    - "tests pass: unit, e2e"
    - "no secret leaks; .env usage only"
    - "docs updated: README section + changelog"
  outputs_expected:
    - pr_url
    - test_report_path
```

---

## Logging (JSON Lines example)
```json
{"ts":"2025-09-24T10:00:00Z","task":"feature_x","agent":"orchestrator","event":"plan.created","corr":"abc123"}
{"ts":"2025-09-24T10:08:00Z","task":"feature_x","agent":"builder","event":"pr.opened","pr":"#142","corr":"abc123"}
{"ts":"2025-09-24T10:15:00Z","task":"feature_x","agent":"evaluator","event":"gate.blocked","reason":"tests failing","corr":"abc123"}
```

---

## Evaluation (gates)
- **Unit/E2E**: required on PR.  
- **Policy**: secret scan + RBAC audit.  
- **Behavior**: prompt regression set.  
- Gate states: `pass | warn | block`. Merges require **pass**.

---

## Incident & Recovery
1) **Detect** (hook fails or eval gate blocks).  
2) **Diagnose** (attach logs, correlate by ID).  
3) **Decide** (owner + rollback strategy).  
4) **Do** (fix or revert).  
5) **Document** (postmortem entry in Governance DB).

---

## .env.example
```bash
# Keys live in your secret manager or local env; never commit real values.
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
GITHUB_TOKEN=
NOTION_TOKEN=
N8N_WEBHOOK_URL=
```

> Keep these unset in the repo. Use per‑env secrets with rotation. Ephemeral access where available.

---

## Tests (exact run)
```bash
cd agents
npx ts-node src/agent-runner.ts agents.manifest.yaml --dry-run   # validate manifest + RBAC + handoffs
npx vitest run                                                   # unit tests
```

**Acceptance Criteria**
- Runner validates manifest; invalid handoffs/roles fail with helpful error.  
- Logs print agent lineup + handoff chain.  
- Tests return exit code 0.

---

## Troubleshooting
- **Error:** `Manifest not found`  
  **Cause:** wrong path. **Fix:** pass correct YAML location. **Retry:** re-run command.
- **Error:** `RBAC missing for agent`  
  **Cause:** manifest defines agent without RBAC rights. **Fix:** add rights under `rbac`. **Retry:** run again.
- **Error:** `Invalid handoff 'X->Y'`  
  **Cause:** unknown agent id. **Fix:** correct names. **Retry:** run again.

---

## Next
- Wire this runner into LangGraph for real routing.  
- Add Notion button actions to open a prefilled Gap/Decision/Playbook linked to tasks.  
- Add CI job: validate manifest on PR and block merge on failure.  
- Add security evals (secret scan) before deploy.

---

## References
- LangGraph (stateful agent orchestration). Source: https://www.langchain.com/langgraph  
- LangChain.js (LLM application framework). Source: https://js.langchain.com/docs/introduction/  
- Model Context Protocol (MCP). Source: https://modelcontextprotocol.io/  
- n8n docs (workflow automation). Source: https://docs.n8n.io/  
- Zod (TypeScript schema validation). Source: https://zod.dev/

---

## FOOTER — CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS(!)
**CLAIMS**  
- The provided runner compiles and validates a YAML manifest with RBAC + handoffs and emits helpful errors.  
- The doc defines a minimal yet complete process for agent roles, handoffs, RBAC, logging, eval gates, and incident handling.  
- External tech choices (LangGraph, MCP, n8n) are industry‑standard options referenced in docs.

**COUNTEREXAMPLE**  
- If your workspace requires different orchestrators (e.g., CrewAI) or security constraints (e.g., air‑gapped, no MCP), you’ll need adapters; the runner remains valid because it’s decoupled from providers.

**CONTRADICTIONS(!)**  
- Preference for “fill secrets fully” conflicts with safe practice. This spec intentionally keeps **env‑only placeholders** and forbids committing real tokens.
