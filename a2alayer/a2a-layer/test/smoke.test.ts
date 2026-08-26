/**
 * Smoke tests — zero-framework, node:assert. Exercises the real pipeline:
 * parse -> card -> registry -> guard -> live HTTP A2A round-trip -> delegation.
 * Run: `npm test`. Exits non-zero on first failure.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { Server } from "node:http";
import { parseAgents } from "../src/registry/parseAgents.js";
import { buildAgentCard } from "../src/registry/buildAgentCard.js";
import { AgentRegistry } from "../src/registry/registry.js";
import { evaluateDelegation, appendHop } from "../src/server/delegationGuard.js";
import { buildGateway } from "../src/server/server.js";
import { loadConfig } from "../src/config.js";
import { buildBackend } from "../src/backends/factory.js";
import {
  modelTier,
  resolveModel,
  OPENAI_TIER_DEFAULTS,
} from "../src/backends/modelTiers.js";
import { callRemoteAgent, DelegationDeniedError } from "../src/client/A2ARouter.js";
import type { DelegationChain } from "../src/types.js";

const SOURCE = "./data/kyle-40-agents.md";
const PORT = 8791;
const BASE = `http://127.0.0.1:${PORT}`;

let passed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`FAIL  ${name}\n      ${(err as Error).message}`);
    process.exitCode = 1;
    throw err;
  }
}

async function main(): Promise<void> {
  const md = await readFile(SOURCE, "utf8");

  // 1. Parsing
  const defs = parseAgents(md);
  await test("parses all 40 agents", () => {
    assert.equal(defs.length, 40, `expected 40, got ${defs.length}`);
  });
  await test("assigns lanes (INTINC service desk + PERSONAL)", () => {
    const lanes = new Set(defs.map((d) => d.lane));
    assert.ok(lanes.has("INTINC"), "no INTINC agents found");
    assert.ok(lanes.has("PERSONAL"), "no PERSONAL agents found");
    const triage = defs.find((d) => d.slug === "ticket-triage-agent");
    assert.equal(triage?.lane, "INTINC");
  });

  // 2. Card generation
  await test("builds a spec-compliant Agent Card", () => {
    const card = buildAgentCard(defs[0]!, { publicBaseUrl: BASE });
    assert.equal(typeof card.protocolVersion, "string");
    assert.ok(card.url.startsWith(`${BASE}/agents/`));
    assert.equal(card.skills.length, 1);
    assert.ok(card.skills[0]!.tags.includes(defs[0]!.lane.toLowerCase()));
    assert.ok(card.capabilities.streaming);
    assert.ok(card.securitySchemes?.gatewayBearer);
  });

  // 3. Registry
  const registry = await AgentRegistry.fromSource(SOURCE, BASE);
  await test("registry indexes and skill-searches", () => {
    assert.equal(registry.size(), 40);
    const hits = registry.searchSkills("n8n credential unlock");
    assert.ok(hits.length > 0);
    assert.ok(hits.some((h) => h.def.slug === "n8n-credential-unlocker"));
    assert.ok(registry.byLane("INTINC").length > 0);
    assert.equal(registry.directory().count, 40);
  });

  // 4. Delegation guard
  const personalA = registry.byLane("PERSONAL")[0]!.def;
  const personalB = registry.byLane("PERSONAL")[1]!.def;
  const intAgent = registry.byLane("INTINC")[0]!.def;
  const emptyChain: DelegationChain = { rootContextId: "ctx", hops: [] };
  await test("guard allows same-lane delegation", () => {
    const d = evaluateDelegation({
      from: personalA,
      to: personalB,
      chain: emptyChain,
      maxDepth: 3,
      crossLaneAllowlist: new Set(),
    });
    assert.ok(d.allowed, d.reason);
  });
  await test("guard blocks cross-lane delegation", () => {
    const d = evaluateDelegation({
      from: personalA,
      to: intAgent,
      chain: emptyChain,
      maxDepth: 3,
      crossLaneAllowlist: new Set(),
    });
    assert.equal(d.allowed, false);
    assert.match(d.reason ?? "", /lane/);
  });
  await test("guard honors cross-lane allowlist", () => {
    const d = evaluateDelegation({
      from: personalA,
      to: intAgent,
      chain: emptyChain,
      maxDepth: 3,
      crossLaneAllowlist: new Set([`${personalA.lane}>${intAgent.lane}`]),
    });
    assert.ok(d.allowed, d.reason);
  });
  await test("guard blocks cycles", () => {
    const chain = appendHop(emptyChain, personalB.slug, personalA.slug, "t");
    const d = evaluateDelegation({
      from: personalA,
      to: personalB,
      chain,
      maxDepth: 5,
      crossLaneAllowlist: new Set(),
    });
    assert.equal(d.allowed, false);
    assert.match(d.reason ?? "", /cycle/);
  });
  await test("guard blocks depth overflow", () => {
    const chain: DelegationChain = {
      rootContextId: "c",
      hops: [
        { from: "a", to: "b", at: "t" },
        { from: "b", to: "c", at: "t" },
        { from: "c", to: "d", at: "t" },
      ],
    };
    const d = evaluateDelegation({
      from: personalA,
      to: personalB,
      chain,
      maxDepth: 3,
      crossLaneAllowlist: new Set(),
    });
    assert.equal(d.allowed, false);
    assert.match(d.reason ?? "", /depth/);
  });

  // 4b. Cross-provider routing + backend selection (offline)
  await test("model tier mapping (haiku/sonnet/opus)", () => {
    assert.equal(modelTier("claude-haiku-4-5"), "fast");
    assert.equal(modelTier("claude-sonnet-4-6"), "balanced");
    assert.equal(modelTier("claude-opus-4-7"), "deep");
  });
  await test("resolveModel honors explicit override + tier default", () => {
    assert.equal(
      resolveModel("claude-opus-4-7", { tierMap: OPENAI_TIER_DEFAULTS }),
      OPENAI_TIER_DEFAULTS.deep,
    );
    assert.equal(
      resolveModel("claude-haiku-4-5", {
        explicitModel: "gpt-x",
        tierMap: OPENAI_TIER_DEFAULTS,
      }),
      "gpt-x",
    );
  });
  await test("config fails fast without provider creds", () => {
    assert.throws(() =>
      loadConfig({ A2A_BACKEND: "openai", A2A_AGENTS_SOURCE: SOURCE } as NodeJS.ProcessEnv),
    );
    assert.throws(() =>
      loadConfig({ A2A_BACKEND: "google", A2A_AGENTS_SOURCE: SOURCE } as NodeJS.ProcessEnv),
    );
    assert.throws(() =>
      loadConfig({
        A2A_BACKEND: "google",
        GOOGLE_GENAI_USE_VERTEXAI: "true",
        A2A_AGENTS_SOURCE: SOURCE,
      } as NodeJS.ProcessEnv),
    );
  });
  await test("factory builds openai + google backends (no network)", () => {
    const openaiCfg = loadConfig({
      A2A_BACKEND: "openai",
      OPENAI_API_KEY: "sk-test",
      A2A_AGENTS_SOURCE: SOURCE,
    } as NodeJS.ProcessEnv);
    assert.equal(buildBackend(openaiCfg).kind, "openai");

    const googleCfg = loadConfig({
      A2A_BACKEND: "google",
      GOOGLE_API_KEY: "g-test",
      A2A_AGENTS_SOURCE: SOURCE,
    } as NodeJS.ProcessEnv);
    assert.equal(buildBackend(googleCfg).kind, "google");
  });

  // 5. Live A2A round-trip over HTTP (mock backend)
  const cfg = loadConfig({
    A2A_BACKEND: "mock",
    A2A_PUBLIC_BASE_URL: BASE,
    PORT: String(PORT),
    A2A_AGENTS_SOURCE: SOURCE,
    A2A_GATEWAY_TOKEN: "",
  } as NodeJS.ProcessEnv);
  const { app, router } = await buildGateway(cfg);
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(PORT, () => resolve(s));
  });

  try {
    await test("GET /healthz reports 40 agents", async () => {
      const res = await fetch(`${BASE}/healthz`);
      const body = (await res.json()) as { agents: number; status: string };
      assert.equal(body.status, "ok");
      assert.equal(body.agents, 40);
    });

    await test("GET /.well-known/agents.json lists the directory", async () => {
      const res = await fetch(`${BASE}/.well-known/agents.json`);
      const body = (await res.json()) as { count: number };
      assert.equal(body.count, 40);
    });

    await test("A2A client fetches card + message/send returns completed task", async () => {
      const slug = personalA.slug;
      const out = await callRemoteAgent(`${BASE}/agents/${slug}`, "smoke test input");
      assert.equal(out.taskState, "completed", `state=${out.taskState}`);
      assert.ok(out.text.includes(personalA.name), "artifact missing agent name");
    });

    await test("in-process router delegates same-lane", async () => {
      const r = await router.delegate(personalA.slug, personalB.slug, "delegate this");
      assert.equal(r.taskState, "completed");
      assert.equal(r.chain.hops.length, 1);
      assert.ok(r.text.includes(personalB.name));
    });

    await test("router rejects cross-lane delegation", async () => {
      await assert.rejects(
        () => router.delegate(personalA.slug, intAgent.slug, "nope"),
        (err: unknown) => err instanceof DelegationDeniedError,
      );
    });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  console.log(`\n${passed} checks passed.`);
}

main().catch(() => {
  process.exitCode = 1;
});
