import React, { createContext, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AuditContext, CreateAuditLogInput } from '../types';
import { createAuditLog } from '../api';
import { maskSensitiveData, defaultAuditConfig } from '../utils';

export const AuditLogContext = createContext<AuditContext | null>(null);

interface AuditLogProviderProps {
  children: React.ReactNode;
  maskSensitive?: boolean;
  sensitiveFields?: string[];
}

export function AuditLogProvider({
  children,
  maskSensitive = true,
  sensitiveFields = defaultAuditConfig.sensitiveFields,
}: AuditLogProviderProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAuditLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    },
  });

  const log = useCallback(
    async (entry: CreateAuditLogInput) => {
      const sanitizedEntry = {
        ...entry,
        metadata: maskSensitive && entry.metadata
          ? maskSensitiveData(entry.metadata, sensitiveFields)
          : entry.metadata,
      };

      await mutation.mutateAsync(sanitizedEntry);
    },
    [mutation, maskSensitive, sensitiveFields]
  );

  const value = useMemo<AuditContext>(
    () => ({
      log,
      isLogging: mutation.isPending,
    }),
    [log, mutation.isPending]
  );

  return (
    <AuditLogContext.Provider value={value}>
      {children}
    </AuditLogContext.Provider>
  );
}
