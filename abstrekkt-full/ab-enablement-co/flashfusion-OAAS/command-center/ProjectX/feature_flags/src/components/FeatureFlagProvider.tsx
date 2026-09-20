import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  FeatureFlag,
  EvaluationContext,
  FlagEvaluation,
  FeatureFlagContextValue,
} from '../types';
import { getFlags } from '../api';

export const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  context?: EvaluationContext;
  refreshInterval?: number;
}

export function FeatureFlagProvider({
  children,
  context = {},
  refreshInterval = 60000, // 1 minute
}: FeatureFlagProviderProps) {
  const [flags, setFlags] = useState<Map<string, FeatureFlag>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const loadFlags = useCallback(async () => {
    try {
      const fetchedFlags = await getFlags();
      const flagMap = new Map(fetchedFlags.map((f) => [f.key, f]));
      setFlags(flagMap);
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFlags();

    if (refreshInterval > 0) {
      const interval = setInterval(loadFlags, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadFlags, refreshInterval]);

  const evaluate = useCallback(
    (key: string): FlagEvaluation => {
      const flag = flags.get(key);

      if (!flag || !flag.enabled) {
        return { enabled: false, reason: 'flag_disabled' };
      }

      // Check targeting rules
      for (const rule of flag.rules) {
        const attributeValue = context[rule.attribute];
        if (attributeValue === undefined) continue;

        const matches = evaluateRule(attributeValue, rule.operator, rule.value);
        if (matches) {
          const variant = selectVariant(flag, context.userId);
          return { enabled: true, variant, reason: 'rule_matched' };
        }
      }

      // Check percentage rollout
      if (flag.rolloutPercentage < 100 && context.userId) {
        const hash = simpleHash(flag.key + context.userId);
        const percentage = hash % 100;

        if (percentage >= flag.rolloutPercentage) {
          return { enabled: false, reason: 'rollout_excluded' };
        }
      }

      const variant = selectVariant(flag, context.userId);
      return { enabled: true, variant, reason: 'default_enabled' };
    },
    [flags, context]
  );

  const value = useMemo<FeatureFlagContextValue>(
    () => ({
      flags,
      isLoading,
      evaluate,
      refresh: loadFlags,
    }),
    [flags, isLoading, evaluate, loadFlags]
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

function evaluateRule(
  attributeValue: unknown,
  operator: string,
  ruleValue: unknown
): boolean {
  switch (operator) {
    case 'eq':
      return attributeValue === ruleValue;
    case 'neq':
      return attributeValue !== ruleValue;
    case 'contains':
      return String(attributeValue).includes(String(ruleValue));
    case 'in':
      return Array.isArray(ruleValue) && ruleValue.includes(attributeValue);
    case 'nin':
      return Array.isArray(ruleValue) && !ruleValue.includes(attributeValue);
    case 'gt':
      return Number(attributeValue) > Number(ruleValue);
    case 'lt':
      return Number(attributeValue) < Number(ruleValue);
    case 'gte':
      return Number(attributeValue) >= Number(ruleValue);
    case 'lte':
      return Number(attributeValue) <= Number(ruleValue);
    default:
      return false;
  }
}

function selectVariant(flag: FeatureFlag, userId?: string): string | undefined {
  if (!flag.variants || flag.variants.length === 0) {
    return undefined;
  }

  if (!userId) {
    return flag.variants[0].key;
  }

  const hash = simpleHash(flag.key + userId);
  let cumulative = 0;

  for (const variant of flag.variants) {
    cumulative += variant.weight;
    if (hash % 100 < cumulative) {
      return variant.key;
    }
  }

  return flag.variants[flag.variants.length - 1].key;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
