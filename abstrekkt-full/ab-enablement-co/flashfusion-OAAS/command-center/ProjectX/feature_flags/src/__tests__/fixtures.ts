import type {
  FeatureFlag,
  TargetingRule,
  FlagVariant,
  CreateFlagInput,
  UpdateFlagInput,
  EvaluationContext,
  FlagEvaluation,
} from '../types';

// Mock Feature Flags
export const mockFeatureFlag: FeatureFlag = {
  id: 'ff_123',
  key: 'new_dashboard',
  name: 'New Dashboard',
  description: 'Enable the new dashboard experience',
  enabled: true,
  rolloutPercentage: 100,
  rules: [],
  variants: [],
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-15T00:00:00Z'),
};

export const mockDisabledFlag: FeatureFlag = {
  ...mockFeatureFlag,
  id: 'ff_disabled',
  key: 'disabled_feature',
  name: 'Disabled Feature',
  enabled: false,
};

export const mockPartialRolloutFlag: FeatureFlag = {
  ...mockFeatureFlag,
  id: 'ff_partial',
  key: 'partial_rollout',
  name: 'Partial Rollout Feature',
  rolloutPercentage: 50,
};

export const mockRuleBasedFlag: FeatureFlag = {
  ...mockFeatureFlag,
  id: 'ff_rules',
  key: 'rule_based',
  name: 'Rule Based Feature',
  rules: [
    { id: 'rule_1', attribute: 'plan', operator: 'eq', value: 'enterprise' },
    { id: 'rule_2', attribute: 'email', operator: 'contains', value: '@company.com' },
  ],
};

export const mockVariantFlag: FeatureFlag = {
  ...mockFeatureFlag,
  id: 'ff_variants',
  key: 'ab_test',
  name: 'A/B Test Feature',
  variants: [
    { key: 'control', name: 'Control Group', weight: 50 },
    { key: 'variant_a', name: 'Variant A', weight: 30 },
    { key: 'variant_b', name: 'Variant B', weight: 20 },
  ],
};

export const mockFeatureFlags: FeatureFlag[] = [
  mockFeatureFlag,
  mockDisabledFlag,
  mockPartialRolloutFlag,
  mockRuleBasedFlag,
  mockVariantFlag,
];

// Mock Rules
export const mockTargetingRules: TargetingRule[] = [
  { id: 'rule_1', attribute: 'plan', operator: 'eq', value: 'enterprise' },
  { id: 'rule_2', attribute: 'email', operator: 'contains', value: '@vip.com' },
  { id: 'rule_3', attribute: 'age', operator: 'gte', value: 18 },
  { id: 'rule_4', attribute: 'country', operator: 'in', value: ['US', 'CA', 'UK'] },
  { id: 'rule_5', attribute: 'beta', operator: 'eq', value: true },
];

// Mock Variants
export const mockVariants: FlagVariant[] = [
  { key: 'control', name: 'Control', weight: 50 },
  { key: 'treatment', name: 'Treatment', weight: 50 },
];

// Mock Inputs
export const mockCreateFlagInput: CreateFlagInput = {
  key: 'new_feature',
  name: 'New Feature',
  description: 'A brand new feature',
  enabled: true,
  rolloutPercentage: 100,
};

export const mockUpdateFlagInput: UpdateFlagInput = {
  name: 'Updated Feature Name',
  enabled: false,
};

// Mock Evaluation Contexts
export const mockBasicContext: EvaluationContext = {
  userId: 'user_123',
  email: 'user@example.com',
};

export const mockEnterpriseContext: EvaluationContext = {
  userId: 'user_enterprise',
  email: 'admin@company.com',
  plan: 'enterprise',
  tenantId: 'tenant_456',
};

export const mockBetaUserContext: EvaluationContext = {
  userId: 'user_beta',
  email: 'beta@test.com',
  beta: true,
};

// Mock Evaluations
export const mockEnabledEvaluation: FlagEvaluation = {
  enabled: true,
  reason: 'default_enabled',
};

export const mockDisabledEvaluation: FlagEvaluation = {
  enabled: false,
  reason: 'flag_disabled',
};

export const mockRuleMatchedEvaluation: FlagEvaluation = {
  enabled: true,
  variant: 'treatment',
  reason: 'rule_matched',
};

export const mockRolloutExcludedEvaluation: FlagEvaluation = {
  enabled: false,
  reason: 'rollout_excluded',
};

// Mock API Errors
export const mockApiError = {
  response: {
    status: 400,
    data: { message: 'Invalid flag key' },
  },
};

export const mockNotFoundError = {
  response: {
    status: 404,
    data: { message: 'Feature flag not found' },
  },
};

export const mockConflictError = {
  response: {
    status: 409,
    data: { message: 'Flag key already exists' },
  },
};

export const mockNetworkError = new Error('Network Error');

// Helper functions
export function createMockFlag(overrides: Partial<FeatureFlag> = {}): FeatureFlag {
  return {
    ...mockFeatureFlag,
    id: `ff_${Date.now()}`,
    key: `flag_${Date.now()}`,
    ...overrides,
  };
}

export function createMockEvaluation(overrides: Partial<FlagEvaluation> = {}): FlagEvaluation {
  return {
    ...mockEnabledEvaluation,
    ...overrides,
  };
}

export function createMockContext(overrides: Partial<EvaluationContext> = {}): EvaluationContext {
  return {
    ...mockBasicContext,
    ...overrides,
  };
}
