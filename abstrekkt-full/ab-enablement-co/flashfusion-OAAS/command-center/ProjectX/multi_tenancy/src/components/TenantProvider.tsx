import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Tenant, TenantContextValue } from '../types';
import { getTenant, getMyTenants } from '../api';

export const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: React.ReactNode;
  defaultTenantId?: string;
}

export function TenantProvider({ children, defaultTenantId }: TenantProviderProps) {
  const [tenant, setTenantState] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load tenant on mount
  useEffect(() => {
    async function loadTenant() {
      try {
        setIsLoading(true);
        setError(null);

        // Check for stored tenant ID
        const storedTenantId =
          defaultTenantId || localStorage.getItem('currentTenantId');

        if (storedTenantId) {
          const loadedTenant = await getTenant(storedTenantId);
          setTenantState(loadedTenant);
        } else {
          // Load first available tenant
          const tenants = await getMyTenants();
          if (tenants.length > 0) {
            setTenantState(tenants[0]);
            localStorage.setItem('currentTenantId', tenants[0].id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load tenant'));
      } finally {
        setIsLoading(false);
      }
    }

    loadTenant();
  }, [defaultTenantId]);

  const setTenant = useCallback((newTenant: Tenant) => {
    setTenantState(newTenant);
    localStorage.setItem('currentTenantId', newTenant.id);
  }, []);

  const clearTenant = useCallback(() => {
    setTenantState(null);
    localStorage.removeItem('currentTenantId');
  }, []);

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant,
      isLoading,
      error,
      setTenant,
      clearTenant,
    }),
    [tenant, isLoading, error, setTenant, clearTenant]
  );

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}
