import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type {
  Service,
  Incident,
  MaintenanceWindow,
  CreateIncidentInput,
  UpdateIncidentInput,
  CreateMaintenanceInput,
} from '../types';

// Query keys
const KEYS = {
  status: ['status'] as const,
  services: ['services'] as const,
  service: (id: string) => ['services', id] as const,
  incidents: (status?: string) => ['incidents', status] as const,
  incident: (id: string) => ['incidents', id] as const,
  maintenance: (status?: string) => ['maintenance', status] as const,
  uptime: (serviceId?: string, days?: number) => ['uptime', serviceId, days] as const,
  subscribers: ['subscribers'] as const,
};

// Public hooks
export function useOverallStatus() {
  return useQuery({
    queryKey: KEYS.status,
    queryFn: api.getOverallStatus,
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useServices() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEYS.services,
    queryFn: api.getServices,
    refetchInterval: 60000,
  });

  const updateStatus = useMutation({
    mutationFn: ({ serviceId, status }: { serviceId: string; status: Service['status'] }) =>
      api.updateServiceStatus(serviceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.services });
      queryClient.invalidateQueries({ queryKey: KEYS.status });
    },
  });

  return {
    services: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateServiceStatus: (serviceId: string, status: Service['status']) =>
      updateStatus.mutateAsync({ serviceId, status }),
    isUpdating: updateStatus.isPending,
  };
}

export function useService(serviceId: string) {
  return useQuery({
    queryKey: KEYS.service(serviceId),
    queryFn: () => api.getService(serviceId),
    enabled: !!serviceId,
  });
}

export function useIncidents(status?: 'active' | 'resolved') {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEYS.incidents(status),
    queryFn: () => api.getIncidents({ status }),
    refetchInterval: 30000,
  });

  const create = useMutation({
    mutationFn: (input: CreateIncidentInput) => api.createIncident(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.incidents() });
      queryClient.invalidateQueries({ queryKey: KEYS.status });
    },
  });

  const update = useMutation({
    mutationFn: ({ incidentId, input }: { incidentId: string; input: UpdateIncidentInput }) =>
      api.updateIncident(incidentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.incidents() });
      queryClient.invalidateQueries({ queryKey: KEYS.status });
    },
  });

  const resolve = useMutation({
    mutationFn: ({ incidentId, message }: { incidentId: string; message: string }) =>
      api.resolveIncident(incidentId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.incidents() });
      queryClient.invalidateQueries({ queryKey: KEYS.status });
    },
  });

  return {
    incidents: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createIncident: create.mutateAsync,
    updateIncident: (incidentId: string, input: UpdateIncidentInput) =>
      update.mutateAsync({ incidentId, input }),
    resolveIncident: (incidentId: string, message: string) =>
      resolve.mutateAsync({ incidentId, message }),
    isCreating: create.isPending,
    isUpdating: update.isPending,
  };
}

export function useIncident(incidentId: string) {
  return useQuery({
    queryKey: KEYS.incident(incidentId),
    queryFn: () => api.getIncident(incidentId),
    enabled: !!incidentId,
    refetchInterval: 30000,
  });
}

export function useMaintenance(status?: 'scheduled' | 'in_progress' | 'completed') {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEYS.maintenance(status),
    queryFn: () => api.getMaintenanceWindows({ status }),
  });

  const create = useMutation({
    mutationFn: (input: CreateMaintenanceInput) => api.createMaintenance(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.maintenance() });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateMaintenanceInput> }) =>
      api.updateMaintenance(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.maintenance() });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteMaintenance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.maintenance() });
    },
  });

  return {
    windows: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createMaintenance: create.mutateAsync,
    updateMaintenance: (id: string, input: Partial<CreateMaintenanceInput>) =>
      update.mutateAsync({ id, input }),
    deleteMaintenance: remove.mutateAsync,
  };
}

export function useUptimeHistory(serviceId?: string, days: number = 90) {
  return useQuery({
    queryKey: KEYS.uptime(serviceId, days),
    queryFn: () => api.getUptimeHistory({ serviceId, days }),
  });
}

export function useSubscribe() {
  const subscribe = useMutation({
    mutationFn: ({ email, services }: { email: string; services?: string[] }) =>
      api.subscribe(email, services),
  });

  return {
    subscribe: (email: string, services?: string[]) =>
      subscribe.mutateAsync({ email, services }),
    isSubscribing: subscribe.isPending,
    error: subscribe.error,
    isSuccess: subscribe.isSuccess,
  };
}

export function useHealthCheck() {
  const queryClient = useQueryClient();

  const runCheck = useMutation({
    mutationFn: (serviceId?: string) => api.runHealthCheck(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.services });
      queryClient.invalidateQueries({ queryKey: KEYS.status });
    },
  });

  return {
    runHealthCheck: runCheck.mutateAsync,
    isRunning: runCheck.isPending,
    results: runCheck.data,
    error: runCheck.error,
  };
}

export function useSubscribers() {
  return useQuery({
    queryKey: KEYS.subscribers,
    queryFn: api.getSubscribers,
  });
}
