export interface AgentPolicyInput {
  estimatedCostUsd: number;
  requiresExternalAction: boolean;
  sensitivity: 'public' | 'internal' | 'client_confidential' | 'restricted';
  confidence: number;
}

export function requiresHumanApproval(input: AgentPolicyInput): boolean {
  if (input.requiresExternalAction) return true;
  if (input.sensitivity === 'restricted') return true;
  if (input.estimatedCostUsd > 5) return true;
  if (input.confidence < 0.75) return true;
  return false;
}
