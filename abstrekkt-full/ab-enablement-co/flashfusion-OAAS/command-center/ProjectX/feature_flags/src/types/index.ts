export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  rolloutPercentage: number;
  rules: TargetingRule[];
  variants?: FlagVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TargetingRule {
  id: string;
  attribute: string;
  operator: RuleOperator;
  value: string | string[] | number | boolean;
}

export type RuleOperator = 'eq' | 'neq' | 'contains' | 'in' | 'nin' | 'gt' | 'lt' | 'gte' | 'lte';

export interface FlagVariant {
  key: string;
  name: string;
  weight: number; // Percentage (all variants should sum to 100)
}

export interface CreateFlagInput {
  key: string;
  name: string;
  description?: string;
  enabled?: boolean;
  rolloutPercentage?: number;
  rules?: Omit<TargetingRule, 'id'>[];
  variants?: FlagVariant[];
}

export interface UpdateFlagInput {
  name?: string;
  description?: string;
  enabled?: boolean;
  rolloutPercentage?: number;
  rules?: Omit<TargetingRule, 'id'>[];
  variants?: FlagVariant[];
}

export interface EvaluationContext {
  userId?: string;
  email?: string;
  plan?: string;
  tenantId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface FlagEvaluation {
  enabled: boolean;
  variant?: string;
  reason: EvaluationReason;
}

export type EvaluationReason =
  | 'flag_disabled'
  | 'rule_matched'
  | 'rollout_excluded'
  | 'default_enabled';

export interface FeatureFlagContextValue {
  flags: Map<string, FeatureFlag>;
  isLoading: boolean;
  evaluate: (key: string) => FlagEvaluation;
  refresh: () => Promise<void>;
}
