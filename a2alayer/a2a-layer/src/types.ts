/**
 * Shared domain types for the A2A layer.
 *
 * An `AgentDef` is the normalized, transport-agnostic description of one of
 * Kyle's managed agents, parsed from the `managed-agents-2026-04-01` YAML
 * blocks. Everything downstream (Agent Card generation, execution, routing)
 * consumes `AgentDef` rather than the raw YAML.
 */

/**
 * Work-lane label. Enforced at the delegation boundary so an INTINC agent
 * cannot silently pull PERSONAL context (or vice versa). FREELANCE is reserved
 * for per-client isolation; no FREELANCE agents exist in the current source.
 */
export type Lane = "INTINC" | "PERSONAL" | "FREELANCE";

/** An MCP server binding declared by a managed agent. */
export interface McpBinding {
  name: string;
  type: string;
  url: string;
  /** always_allow | always_ask | never — mirrors the managed-agent policy. */
  permission: "always_allow" | "always_ask" | "never" | "unknown";
}

/** Normalized managed-agent definition. */
export interface AgentDef {
  /** Stable URL-safe identifier, e.g. "n8n-credential-unlocker". */
  slug: string;
  /** Two-digit source ordinal ("01".."40"), preserved for traceability. */
  ordinal: string;
  /** Group heading the agent was defined under in the source doc. */
  group: string;
  /** Human-readable agent name. */
  name: string;
  /** One-line description from the YAML `description` field. */
  description: string;
  /** Model id, e.g. "claude-sonnet-4-6". */
  model: string;
  /** Full system prompt. */
  system: string;
  /** MCP servers this agent is wired to. */
  mcp: McpBinding[];
  /** Skill ids referenced by the agent (usually empty in the source). */
  skills: string[];
  /** Derived work-lane. */
  lane: Lane;
}

/** Provenance for a single delegation hop, threaded through call metadata. */
export interface DelegationHop {
  from: string;
  to: string;
  at: string;
}

/** Delegation chain carried in A2A message metadata under `a2a_delegation`. */
export interface DelegationChain {
  rootContextId: string;
  hops: DelegationHop[];
}
