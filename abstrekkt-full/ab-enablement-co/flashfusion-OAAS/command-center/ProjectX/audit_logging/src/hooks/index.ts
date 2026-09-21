import { useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuditLogContext } from '../components/AuditLogProvider';
import * as api from '../api';
import type {
  AuditLogSearchParams,
  ExportFormat,
} from '../types';

/**
 * Access the audit logging context
 */
export function useAuditLog() {
  const context = useContext(AuditLogContext);
  if (!context) {
    throw new Error('useAuditLog must be used within an AuditLogProvider');
  }
  return context;
}

/**
 * Search and paginate audit logs
 */
export function useAuditLogs(params: AuditLogSearchParams) {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: () => api.searchAuditLogs(params),
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Get audit log statistics
 */
export function useAuditStats(tenantId: string, startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['auditStats', tenantId, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => api.getAuditStats(tenantId, startDate, endDate),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get unique actions for filter dropdown
 */
export function useUniqueActions(tenantId: string) {
  return useQuery({
    queryKey: ['auditActions', tenantId],
    queryFn: () => api.getUniqueActions(tenantId),
    staleTime: 300_000, // 5 minutes
  });
}

/**
 * Get unique resources for filter dropdown
 */
export function useUniqueResources(tenantId: string) {
  return useQuery({
    queryKey: ['auditResources', tenantId],
    queryFn: () => api.getUniqueResources(tenantId),
    staleTime: 300_000, // 5 minutes
  });
}

/**
 * Export audit logs
 */
export function useExportAuditLogs() {
  const mutation = useMutation({
    mutationFn: ({ params, format }: { params: AuditLogSearchParams; format: ExportFormat }) =>
      api.exportAuditLogs(params, format),
  });

  const exportLogs = useCallback(
    async (params: AuditLogSearchParams, format: ExportFormat, filename?: string) => {
      const blob = await mutation.mutateAsync({ params, format });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `audit-logs-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [mutation]
  );

  return {
    exportLogs,
    isExporting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Manually log an activity
 */
export function useLogActivity() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.createAuditLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    },
  });

  return {
    log: mutation.mutateAsync,
    isLogging: mutation.isPending,
  };
}
