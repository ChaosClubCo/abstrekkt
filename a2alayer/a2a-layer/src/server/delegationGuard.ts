/**
 * Delegation guard for agent-to-agent calls. Enforces three invariants before
 * one agent is allowed to invoke another:
 *
 *   1. Depth    — a chain may not exceed maxDepth hops (runaway fan-out).
 *   2. Acyclic  — an agent already present in the chain cannot be re-entered.
 *   3. Lane     — cross-lane calls are denied unless explicitly allowlisted,
 *                 preserving INTINC / PERSONAL / FREELANCE isolation.
 */
import type { AgentDef, DelegationChain, DelegationHop } from "../types.js";

export interface GuardInput {
  from: AgentDef;
  to: AgentDef;
  chain: DelegationChain;
  maxDepth: number;
  /** Set of "FROMLANE>TOLANE" pairs permitted to cross. */
  crossLaneAllowlist: Set<string>;
}

export interface GuardDecision {
  allowed: boolean;
  reason?: string;
}

export function evaluateDelegation(input: GuardInput): GuardDecision {
  const { from, to, chain, maxDepth, crossLaneAllowlist } = input;

  if (from.slug === to.slug) {
    return { allowed: false, reason: "self-delegation is not permitted" };
  }

  if (chain.hops.length >= maxDepth) {
    return {
      allowed: false,
      reason: `max delegation depth (${maxDepth}) reached`,
    };
  }

  const visited = new Set<string>();
  for (const hop of chain.hops) {
    visited.add(hop.from);
    visited.add(hop.to);
  }
  if (visited.has(to.slug)) {
    return {
      allowed: false,
      reason: `cycle detected: ${to.slug} is already in the delegation chain`,
    };
  }

  if (from.lane !== to.lane) {
    const pair = `${from.lane}>${to.lane}`;
    if (!crossLaneAllowlist.has(pair)) {
      return {
        allowed: false,
        reason: `cross-lane delegation ${pair} is not allowlisted (lane isolation)`,
      };
    }
  }

  return { allowed: true };
}

/** Return a new chain with the hop appended (pure). */
export function appendHop(
  chain: DelegationChain,
  from: string,
  to: string,
  at: string,
): DelegationChain {
  const hop: DelegationHop = { from, to, at };
  return { rootContextId: chain.rootContextId, hops: [...chain.hops, hop] };
}
