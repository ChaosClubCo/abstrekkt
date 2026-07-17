// ─────────────────────────────────────────────────────────────
// Multi-tenant React Hooks
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useContext, createContext, type ReactNode } from 'react';
import {
  supabase, createTenantClient, getUserTenants,
  signInWithEmail, signUpWithEmail, signOut,
  tenantQuery, type TypedSupabaseClient,
} from '../lib/supabase-client';
import type { User, Session } from '@supabase/supabase-js';

// ── Auth Hook ────────────────────────────────────────────

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      return await signInWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      return await signUpWithEmail(email, password, name ? { full_name: name } : undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setSession(null);
  }, []);

  return { user, session, loading, login, register, logout, isAuthenticated: !!user };
}

// ── Tenant Context ───────────────────────────────────────

interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  plan: string;
  role: string;
  settings: Record<string, unknown>;
}

interface TenantContextValue {
  currentTenant: TenantInfo | null;
  tenants: TenantInfo[];
  loading: boolean;
  switchTenant: (tenantId: string) => void;
  client: TypedSupabaseClient;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user's tenants on auth
  useEffect(() => {
    if (!user) {
      setTenants([]);
      setCurrentTenantId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserTenants(user.id)
      .then((data) => {
        const mapped: TenantInfo[] = (data || []).map((d: any) => ({
          id: d.tenant.id,
          name: d.tenant.name,
          slug: d.tenant.slug,
          domain: d.tenant.domain,
          plan: d.tenant.plan,
          role: d.role,
          settings: d.tenant.settings || {},
        }));
        setTenants(mapped);

        // Restore last tenant or pick first
        const stored = localStorage.getItem('intinc:current_tenant');
        const restored = mapped.find(t => t.id === stored);
        setCurrentTenantId(restored?.id || mapped[0]?.id || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const currentTenant = tenants.find(t => t.id === currentTenantId) || null;

  const switchTenant = useCallback((tenantId: string) => {
    setCurrentTenantId(tenantId);
    localStorage.setItem('intinc:current_tenant', tenantId);
  }, []);

  // Tenant-scoped Supabase client
  const client = currentTenantId ? createTenantClient(currentTenantId) : supabase;

  return (
    <TenantContext.Provider value={{ currentTenant, tenants, loading, switchTenant, client }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}

// ── Tenant-Scoped Data Hook ──────────────────────────────

interface UseTenantQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
  enabled?: boolean;
}

export function useTenantQuery<T = unknown>(
  table: string,
  options: UseTenantQueryOptions = {},
) {
  const { client, currentTenant } = useTenant();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { enabled = true, ...queryOpts } = options;

  const fetch = useCallback(async () => {
    if (!currentTenant || !enabled) return;
    setLoading(true);
    setError(null);

    try {
      const q = tenantQuery(client, table as any, currentTenant.id);
      const { data: rows, error: queryError } = await q.list(queryOpts);
      if (queryError) throw queryError;
      setData((rows || []) as T[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [client, currentTenant?.id, table, enabled, queryOpts.limit, queryOpts.offset, queryOpts.orderBy]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (record: Partial<T>) => {
    if (!currentTenant) throw new Error('No tenant selected');
    const q = tenantQuery(client, table as any, currentTenant.id);
    const { data: created, error } = await q.create(record as any);
    if (error) throw error;
    await fetch(); // refresh list
    return created;
  }, [client, currentTenant?.id, table, fetch]);

  const update = useCallback(async (id: string, record: Partial<T>) => {
    if (!currentTenant) throw new Error('No tenant selected');
    const q = tenantQuery(client, table as any, currentTenant.id);
    const { data: updated, error } = await q.update(id, record as any);
    if (error) throw error;
    await fetch();
    return updated;
  }, [client, currentTenant?.id, table, fetch]);

  const remove = useCallback(async (id: string) => {
    if (!currentTenant) throw new Error('No tenant selected');
    const q = tenantQuery(client, table as any, currentTenant.id);
    const { error } = await q.remove(id);
    if (error) throw error;
    await fetch();
  }, [client, currentTenant?.id, table, fetch]);

  return { data, loading, error, refetch: fetch, create, update, remove };
}
