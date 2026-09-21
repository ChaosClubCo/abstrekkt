import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type { CreateRuleInput, UpdateRuleInput, AccessAttemptQuery } from '../types';

// Query keys
const KEYS = {
  access: ['ip-whitelist', 'access'] as const,
  config: ['ip-whitelist', 'config'] as const,
  rules: ['ip-whitelist', 'rules'] as const,
  attempts: (query?: AccessAttemptQuery) => ['ip-whitelist', 'attempts', query] as const,
  geo: (ip?: string) => ['ip-whitelist', 'geo', ip] as const,
  graceRequests: (status?: string) => ['ip-whitelist', 'grace', status] as const,
  sessionIP: ['ip-whitelist', 'session-ip'] as const,
  myIP: ['ip-whitelist', 'my-ip'] as const,
};

// Check current IP access
export function useIPAccess() {
  const query = useQuery({
    queryKey: KEYS.access,
    queryFn: api.checkIPAccess,
    staleTime: 60000, // Check every minute
    refetchInterval: 60000,
  });

  return {
    isAllowed: query.data?.allowed ?? true,
    reason: query.data?.reason ?? '',
    matchedRule: query.data?.matchedRule,
    ipAddress: query.data?.ipAddress,
    geoLocation: query.data?.geoLocation,
    requiresApproval: query.data?.requiresApproval ?? false,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

// Manage IP rules
export function useIPRules() {
  const queryClient = useQueryClient();

  const rulesQuery = useQuery({
    queryKey: KEYS.rules,
    queryFn: api.getRules,
  });

  const create = useMutation({
    mutationFn: (input: CreateRuleInput) => api.createRule(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.rules });
      queryClient.invalidateQueries({ queryKey: KEYS.access });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRuleInput }) =>
      api.updateRule(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.rules });
      queryClient.invalidateQueries({ queryKey: KEYS.access });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.rules });
      queryClient.invalidateQueries({ queryKey: KEYS.access });
    },
  });

  const toggle = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      api.toggleRule(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.rules });
      queryClient.invalidateQueries({ queryKey: KEYS.access });
    },
  });

  return {
    rules: rulesQuery.data ?? [],
    isLoading: rulesQuery.isLoading,
    createRule: create.mutateAsync,
    updateRule: (id: string, input: UpdateRuleInput) => update.mutateAsync({ id, input }),
    deleteRule: remove.mutateAsync,
    toggleRule: (id: string, enabled: boolean) => toggle.mutateAsync({ id, enabled }),
    isCreating: create.isPending,
    isUpdating: update.isPending,
    refetch: rulesQuery.refetch,
  };
}

// Get config
export function useIPWhitelistConfig() {
  const queryClient = useQueryClient();

  const configQuery = useQuery({
    queryKey: KEYS.config,
    queryFn: api.getConfig,
  });

  const update = useMutation({
    mutationFn: (config: Parameters<typeof api.updateConfig>[0]) => api.updateConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.config });
      queryClient.invalidateQueries({ queryKey: KEYS.access });
    },
  });

  return {
    config: configQuery.data,
    isLoading: configQuery.isLoading,
    updateConfig: update.mutateAsync,
    isUpdating: update.isPending,
  };
}

// Access attempts log
export function useAccessAttempts(query?: AccessAttemptQuery) {
  return useQuery({
    queryKey: KEYS.attempts(query),
    queryFn: () => api.getAccessAttempts(query),
  });
}

// Geolocation
export function useGeoLocation(ipAddress?: string) {
  return useQuery({
    queryKey: KEYS.geo(ipAddress),
    queryFn: () => api.getGeoLocation(ipAddress),
  });
}

// Current IP
export function useMyIP() {
  return useQuery({
    queryKey: KEYS.myIP,
    queryFn: api.getMyIP,
  });
}

// Grace period requests
export function useGracePeriod() {
  const queryClient = useQueryClient();

  const pendingQuery = useQuery({
    queryKey: KEYS.graceRequests('pending'),
    queryFn: () => api.getGracePeriodRequests('pending'),
  });

  const create = useMutation({
    mutationFn: (reason: string) => api.createGracePeriodRequest(reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.graceRequests() });
    },
  });

  const review = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'deny' }) =>
      api.reviewGracePeriodRequest(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.graceRequests() });
      queryClient.invalidateQueries({ queryKey: KEYS.access });
    },
  });

  return {
    pendingRequests: pendingQuery.data ?? [],
    isLoading: pendingQuery.isLoading,
    requestAccess: create.mutateAsync,
    reviewRequest: (id: string, action: 'approve' | 'deny') => review.mutateAsync({ id, action }),
    isRequesting: create.isPending,
    isReviewing: review.isPending,
  };
}

// Session IP binding
export function useSessionBinding() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: KEYS.sessionIP,
    queryFn: api.getSessionIPInfo,
  });

  const bind = useMutation({
    mutationFn: api.bindSessionToIP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.sessionIP });
    },
  });

  return {
    sessionInfo: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    bindToIP: bind.mutateAsync,
    isBinding: bind.isPending,
  };
}

// Validate CIDR
export function useCIDRValidation() {
  const validate = useMutation({
    mutationFn: (cidr: string) => api.validateCIDR(cidr),
  });

  return {
    validate: validate.mutateAsync,
    isValidating: validate.isPending,
    result: validate.data,
  };
}
