// ─────────────────────────────────────────────────────────────
// Supabase Client — Multi-tenant typed client with auth helpers
// ─────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// ── Typed Client ─────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type TypedSupabaseClient = typeof supabase;

// ── Tenant-Scoped Client ─────────────────────────────────
// Wraps supabase client to inject x-tenant-id header on all requests
// Use this for all data operations within a tenant context

export function createTenantClient(tenantId: string): TypedSupabaseClient {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-tenant-id': tenantId,
      },
    },
  });
}

// ── Auth Helpers ─────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, metadata?: Record<string, string>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data;
}

export async function signInWithOAuth(provider: 'google' | 'github' | 'azure') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  });
  if (error) throw error;
}

// ── Tenant Data Operations ───────────────────────────────

export async function getUserTenants(userId: string) {
  const { data, error } = await supabase
    .from('tenant_members')
    .select(`
      role,
      accepted_at,
      tenant:tenants (
        id,
        name,
        slug,
        domain,
        plan,
        settings
      )
    `)
    .eq('user_id', userId)
    .not('accepted_at', 'is', null);

  if (error) throw error;
  return data;
}

export async function createTenant(name: string, slug: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Create tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({ name, slug })
    .select()
    .single();

  if (tenantError) throw tenantError;

  // Add creator as owner
  const { error: memberError } = await supabase
    .from('tenant_members')
    .insert({
      tenant_id: tenant.id,
      user_id: user.id,
      role: 'owner',
      accepted_at: new Date().toISOString(),
    });

  if (memberError) throw memberError;

  return tenant;
}

// ── Type-Safe Query Builders ─────────────────────────────

export function tenantQuery<T extends keyof Database['public']['Tables']>(
  client: TypedSupabaseClient,
  table: T,
  tenantId: string,
) {
  return {
    list: (opts?: { limit?: number; offset?: number; orderBy?: string; ascending?: boolean }) => {
      let query = client.from(table).select('*').eq('tenant_id' as string, tenantId);
      if (opts?.orderBy) query = query.order(opts.orderBy, { ascending: opts.ascending ?? false });
      if (opts?.limit) query = query.limit(opts.limit);
      if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts.limit || 20) - 1);
      return query;
    },
    getById: (id: string) =>
      client.from(table).select('*').eq('id' as string, id).eq('tenant_id' as string, tenantId).single(),
    create: (data: Partial<Database['public']['Tables'][T]['Insert']>) =>
      client.from(table).insert({ ...data, tenant_id: tenantId } as never).select().single(),
    update: (id: string, data: Partial<Database['public']['Tables'][T]['Update']>) =>
      client.from(table).update(data as never).eq('id' as string, id).eq('tenant_id' as string, tenantId).select().single(),
    remove: (id: string) =>
      client.from(table).delete().eq('id' as string, id).eq('tenant_id' as string, tenantId),
  };
}
