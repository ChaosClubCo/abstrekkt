/**
 * Assembles the A2A gateway: one A2A server per managed agent, all mounted on a
 * single Express app, plus the agent directory and an admin delegation route.
 *
 * Routes per agent {slug}:
 *   GET  /agents/{slug}/.well-known/agent-card.json   (public discovery)
 *   POST /agents/{slug}                               (JSON-RPC, bearer-guarded)
 * Global:
 *   GET  /healthz
 *   GET  /.well-known/agents.json                     (agent directory)
 *   POST /admin/delegate                              (agent-to-agent, guarded)
 */
import express, { type Express } from "express";
import {
  DefaultRequestHandler,
  InMemoryTaskStore,
  type A2ARequestHandler,
} from "@a2a-js/sdk/server";
import {
  UserBuilder,
  agentCardHandler,
  jsonRpcHandler,
} from "@a2a-js/sdk/server/express";
import type { Config } from "../config.js";
import { AgentRegistry } from "../registry/registry.js";
import { PROTOCOL_VERSION } from "../registry/buildAgentCard.js";
import { buildBackend } from "../backends/factory.js";
import { ManagedAgentExecutor } from "./ManagedAgentExecutor.js";
import { bearerAuth } from "./auth.js";
import { A2ARouter, DelegationDeniedError } from "../client/A2ARouter.js";

export interface Gateway {
  app: Express;
  registry: AgentRegistry;
  router: A2ARouter;
  handlers: Map<string, A2ARequestHandler>;
}

export async function buildGateway(cfg: Config): Promise<Gateway> {
  const registry = await AgentRegistry.fromSource(
    cfg.agentsSource,
    cfg.publicBaseUrl,
    PROTOCOL_VERSION,
  );
  const backend = buildBackend(cfg);
  const handlers = new Map<string, A2ARequestHandler>();

  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/healthz", (_req, res) => {
    res.json({
      status: "ok",
      agents: registry.size(),
      backend: cfg.backend,
      protocolVersion: PROTOCOL_VERSION,
    });
  });

  app.get("/.well-known/agents.json", (_req, res) => {
    res.json(registry.directory());
  });

  const auth = bearerAuth(cfg.gatewayToken);

  for (const { def, card } of registry.all()) {
    const executor = new ManagedAgentExecutor(def, backend);
    const handler = new DefaultRequestHandler(card, new InMemoryTaskStore(), executor);
    handlers.set(def.slug, handler);

    // Card discovery (public) must be registered before the JSON-RPC mount so
    // the more specific well-known path wins over the /agents/{slug} prefix.
    app.use(
      `/agents/${def.slug}/.well-known/agent-card.json`,
      agentCardHandler({ agentCardProvider: async () => card }),
    );
    app.use(
      `/agents/${def.slug}`,
      auth,
      jsonRpcHandler({
        requestHandler: handler,
        userBuilder: UserBuilder.noAuthentication,
      }),
    );
  }

  const router = new A2ARouter(registry, (slug) => handlers.get(slug), {
    maxDepth: cfg.maxDelegationDepth,
    crossLaneAllowlist: cfg.crossLaneAllowlist,
    timeoutMs: cfg.delegationTimeoutMs,
  });

  app.post("/admin/delegate", auth, async (req, res) => {
    const { from, to, text } = req.body ?? {};
    if (typeof from !== "string" || typeof to !== "string" || typeof text !== "string") {
      res.status(400).json({ error: "Body must be { from, to, text } as strings." });
      return;
    }
    try {
      const result = await router.delegate(from, to, text);
      res.json(result);
    } catch (err) {
      const status = err instanceof DelegationDeniedError ? 403 : 400;
      res.status(status).json({ error: (err as Error).message });
    }
  });

  return { app, registry, router, handlers };
}
