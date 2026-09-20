import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type { UpdateRateLimitInput, PlanRateLimits } from '../types';

export function useRateLimits() {
  const queryClient = useQueryClient();

  const { data: limits = [], isLoading } = useQuery({
    queryKey: ['rateLimits'],
    queryFn: api.getRateLimits,
  });

  const createMutation = useMutation({
    mutationFn: api.createRateLimit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateLimits'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRateLimitInput }) =>
      api.updateRateLimit(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateLimits'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteRateLimit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateLimits'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      api.toggleRateLimit(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateLimits'] });
    },
  });

  return {
    limits,
    isLoading,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    toggle: toggleMutation.mutateAsync,
  };
}

export function useRateLimitUsage() {
  const { data: usage = [], isLoading } = useQuery({
    queryKey: ['rateLimitUsage'],
    queryFn: api.getCurrentUsage,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Aggregate usage across all limits
  const totalUsed = usage.reduce((sum, u) => sum + u.used, 0);
  const totalLimit = usage.reduce((sum, u) => sum + u.limit, 0);
  const remaining = totalLimit - totalUsed;
  const nearestReset = usage.length > 0
    ? new Date(Math.min(...usage.map((u) => new Date(u.resetAt).getTime())))
    : null;

  return {
    usage,
    totalUsed,
    totalLimit,
    remaining,
    resetAt: nearestReset,
    isLoading,
    percentUsed: totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0,
  };
}

export function usePlanLimits() {
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['planLimits'],
    queryFn: api.getPlanLimits,
  });

  const updateMutation = useMutation({
    mutationFn: ({ plan, limits }: { plan: string; limits: PlanRateLimits['limits'] }) =>
      api.updatePlanLimits(plan, limits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planLimits'] });
    },
  });

  return {
    plans,
    isLoading,
    updatePlan: updateMutation.mutateAsync,
  };
}

export function useRateLimitStats(timeRange = '24h') {
  return useQuery({
    queryKey: ['rateLimitStats', timeRange],
    queryFn: () => api.getRateLimitStats(timeRange),
    refetchInterval: 60000, // Poll every minute
  });
}
