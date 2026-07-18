/**
 * Deterministically project an AgentDef into a spec-compliant A2A AgentCard.
 *
 * One managed agent -> one Agent Card served at
 *   {publicBaseUrl}/agents/{slug}/.well-known/agent-card.json
 * with its JSON-RPC endpoint at {publicBaseUrl}/agents/{slug}.
 */
import type { AgentCard, AgentSkill } from "@a2a-js/sdk";
import type { AgentDef } from "../types.js";

/**
 * A2A protocol version advertised by generated cards. Tracks the wire format
 * implemented by the installed @a2a-js/sdk (0.3.x line). Override via opts if
 * you upgrade the SDK to a 1.0.0 wire implementation.
 */
export const PROTOCOL_VERSION = "0.3.0";

export interface BuildCardOptions {
  publicBaseUrl: string;
  protocolVersion?: string;
}

/** First sentence of the system prompt, used as a usage hint. */
function firstSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const dot = cleaned.indexOf(". ");
  const slice = dot > 0 ? cleaned.slice(0, dot + 1) : cleaned;
  return slice.length > 180 ? `${slice.slice(0, 177)}...` : slice;
}

/** Short tag derived from the source group heading, e.g. "GROUP 2 — ..." -> "group-2". */
function groupTag(group: string): string {
  const m = /GROUP\s+(\d+)/i.exec(group);
  return m ? `group-${m[1]}` : "ungrouped";
}

/**
 * Build the primary skill for the agent. We model each managed agent as
 * exposing a single coarse skill (its whole job); tags carry the routing
 * signal (lane, group, and the external services it can reach).
 */
function buildPrimarySkill(def: AgentDef): AgentSkill {
  const serviceTags = def.mcp.map((m) => m.name.toLowerCase());
  const tags = Array.from(
    new Set([
      def.lane.toLowerCase(),
      groupTag(def.group),
      ...serviceTags,
      ...def.skills.map((s) => s.toLowerCase()),
    ]),
  );
  return {
    id: `${def.slug}.primary`,
    name: def.name,
    description: def.description,
    tags,
    examples: [firstSentence(def.system)],
  };
}

/**
 * Produce the AgentCard. Pure function of the AgentDef + options, so the
 * generator output is stable and diffable in version control.
 */
export function buildAgentCard(def: AgentDef, opts: BuildCardOptions): AgentCard {
  const base = opts.publicBaseUrl.replace(/\/+$/, "");
  const endpoint = `${base}/agents/${def.slug}`;

  const card: AgentCard = {
    protocolVersion: opts.protocolVersion ?? PROTOCOL_VERSION,
    name: def.name,
    description: def.description,
    url: endpoint,
    preferredTransport: "JSONRPC",
    additionalInterfaces: [{ url: endpoint, transport: "JSONRPC" }],
    version: `2026.04.01-${def.ordinal}`,
    provider: {
      organization: "Kyle Rosebrook",
      url: base,
    },
    capabilities: {
      streaming: true,
      pushNotifications: false,
      stateTransitionHistory: true,
    },
    defaultInputModes: ["text/plain", "application/json"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: [buildPrimarySkill(def)],
    securitySchemes: {
      gatewayBearer: {
        type: "http",
        scheme: "bearer",
        description:
          "Static bearer token issued for the A2A gateway. Send as Authorization: Bearer <token>.",
      },
    },
    security: [{ gatewayBearer: [] }],
    supportsAuthenticatedExtendedCard: false,
  };
  return card;
}
