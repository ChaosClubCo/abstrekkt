import { describe, expect, it } from 'vitest';
import { requiresHumanApproval } from './agent-policy';

describe('agent policy', () => {
  it('requires approval for restricted context', () => {
    expect(requiresHumanApproval({ estimatedCostUsd: 0.2, requiresExternalAction: false, sensitivity: 'restricted', confidence: 0.99 })).toBe(true);
  });

  it('allows low-risk high-confidence internal draft', () => {
    expect(requiresHumanApproval({ estimatedCostUsd: 0.2, requiresExternalAction: false, sensitivity: 'internal', confidence: 0.9 })).toBe(false);
  });
});
