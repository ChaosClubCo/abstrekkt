/**
 * Agent-to-agent router. This is the primitive that turns 40 isolated agents
 * into a mesh: one agent can delegate a sub-task to another, guarded by the
 * delegation policy (depth, cycles, lane isolation).
 *
 * Same-gateway targets are invoked IN-PROCESS via their A2ARequestHandler (no
 * auth loopback, no extra network hop). Genuinely remote A2A agents are reached
 * over the wire with the SDK client (see `callRemoteAgent`).
 */
import { randomUUID } from "node:crypto";
import { ClientFactory } from "@a2a-js/sdk/client";
import type { A2ARequestHandler } from "@a2a-js/sdk/server";
import type { Message, MessageSendParams, Part, Task } from "@a2a-js/sdk";
import type { DelegationChain } from "../types.js";
import type { AgentRegistry } from "../registry/registry.js";
import { appendHop, evaluateDelegation } from "../server/delegationGuard.js";

export class DelegationDeniedError extends Error {
  constructor(
    message: string,
    readonly from: string,
    readonly to: string,
  ) {
    super(message);
    this.name = "DelegationDeniedError";
  }
}

export interface DelegationResult {
  text: string;
  taskId?: string;
  taskState?: Task["status"]["state"];
  chain: DelegationChain;
}

export interface RouterOptions {
  maxDepth: number;
  crossLaneAllowlist: Set<string>;
  timeoutMs: number;
}

/** Resolve a local (same-gateway) request handler for a slug. */
export type LocalHandlerResolver = (slug: string) => A2ARequestHandler | undefined;

function textFromParts(parts: Part[]): string {
  return parts
    .filter((p): p is Extract<Part, { kind: "text" }> => p.kind === "text")
    .map((p) => p.text)
    .join("\n")
    .trim();
}

/** Pull the best available text out of a Message or Task result. */
export function extractResultText(result: Message | Task): {
  text: string;
  taskId?: string;
  taskState?: Task["status"]["state"];
} {
  if (result.kind === "message") {
    return { text: textFromParts(result.parts) };
  }
  const task = result;
  const artifactText = (task.artifacts ?? [])
    .map((a) => textFromParts(a.parts))
    .filter(Boolean)
    .join("\n")
    .trim();
  const statusText = task.status.message
    ? textFromParts(task.status.message.parts)
    : "";
  return {
    text: artifactText || statusText,
    taskId: task.id,
    taskState: task.status.state,
  };
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export class A2ARouter {
  constructor(
    private readonly registry: AgentRegistry,
    private readonly resolveLocal: LocalHandlerResolver,
    private readonly opts: RouterOptions,
  ) {}

  /**
   * Delegate a text task from one registered agent to another.
   * @throws DelegationDeniedError when the guard rejects the call.
   * @throws Error when either slug is unknown or the target isn't local.
   */
  async delegate(
    fromSlug: string,
    toSlug: string,
    text: string,
    opts: { chain?: DelegationChain } = {},
  ): Promise<DelegationResult> {
    const from = this.registry.get(fromSlug);
    const to = this.registry.get(toSlug);
    if (!from) throw new Error(`Unknown source agent: ${fromSlug}`);
    if (!to) throw new Error(`Unknown target agent: ${toSlug}`);

    const chain: DelegationChain =
      opts.chain ?? { rootContextId: randomUUID(), hops: [] };

    const decision = evaluateDelegation({
      from: from.def,
      to: to.def,
      chain,
      maxDepth: this.opts.maxDepth,
      crossLaneAllowlist: this.opts.crossLaneAllowlist,
    });
    if (!decision.allowed) {
      throw new DelegationDeniedError(decision.reason ?? "denied", fromSlug, toSlug);
    }

    const nextChain = appendHop(chain, fromSlug, toSlug, new Date().toISOString());

    const handler = this.resolveLocal(toSlug);
    if (!handler) {
      throw new Error(
        `Target agent ${toSlug} has no local handler; use callRemoteAgent for remote A2A servers.`,
      );
    }

    const params: MessageSendParams = {
      message: {
        kind: "message",
        role: "user",
        messageId: randomUUID(),
        parts: [{ kind: "text", text }],
        contextId: chain.rootContextId,
      },
      metadata: { a2a_delegation: nextChain },
    };

    const result = await withTimeout(
      handler.sendMessage(params),
      this.opts.timeoutMs,
      `delegation ${fromSlug} -> ${toSlug}`,
    );

    return { ...extractResultText(result), chain: nextChain };
  }
}

/**
 * Call a genuinely remote A2A agent over the wire using the SDK client.
 * `cardBaseUrl` is the agent's base URL (the SDK appends
 * /.well-known/agent-card.json by default).
 */
export async function callRemoteAgent(
  cardBaseUrl: string,
  text: string,
): Promise<{ text: string; taskId?: string; taskState?: Task["status"]["state"] }> {
  const factory = new ClientFactory();
  // Pass the fully-qualified card URL with an empty path so the resolver does
  // not strip the /agents/{slug} segment via relative-URL resolution.
  const cardUrl = `${cardBaseUrl.replace(/\/+$/, "")}/.well-known/agent-card.json`;
  const client = await factory.createFromUrl(cardUrl, "");
  const result = await client.sendMessage({
    message: {
      kind: "message",
      role: "user",
      messageId: randomUUID(),
      parts: [{ kind: "text", text }],
    },
  });
  return extractResultText(result);
}
