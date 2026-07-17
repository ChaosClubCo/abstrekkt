import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeatureFlagContext } from '../components/FeatureFlagProvider';
import * as api from '../api';
import type { UpdateFlagInput } from '../types';

export function useFeatureFlagContext() {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlagContext must be used within a FeatureFlagProvider');
  }
  return context;
}

export function useFeatureFlag(key: string) {
  const { evaluate, isLoading } = useFeatureFlagContext();
  const evaluation = evaluate(key);

  return {
    enabled: evaluation.enabled,
    variant: evaluation.variant,
    reason: evaluation.reason,
    isLoading,
  };
}

export function useFeatureFlags() {
  const queryClient = useQueryClient();

  const { data: flags = [], isLoading } = useQuery({
    queryKey: ['featureFlags'],
    queryFn: api.getFlags,
  });

  const createMutation = useMutation({
    mutationFn: api.createFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, input }: { key: string; input: UpdateFlagInput }) =>
      api.updateFlag(key, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      api.toggleFlag(key, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    },
  });

  return {
    flags,
    isLoading,
    createFlag: createMutation.mutateAsync,
    updateFlag: updateMutation.mutateAsync,
    deleteFlag: deleteMutation.mutateAsync,
    toggleFlag: toggleMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

export function useFeatureFlagVariant(key: string) {
  const { evaluate, isLoading } = useFeatureFlagContext();
  const evaluation = evaluate(key);

  return {
    variant: evaluation.variant ?? 'control',
    isLoading,
  };
}
