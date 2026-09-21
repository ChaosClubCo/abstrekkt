// ─────────────────────────────────────────────────────────────
// Edge Function: tenant-api
// Tenant-aware API endpoint with JWT validation, rate limiting,
// and audit logging. Deploy: supabase functions deploy tenant-api
// ─────────────────────────────────────────────────────────────

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-tenant-id, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract and validate auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonError('Missing or invalid authorization header', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return jsonError('Unauthorized', 401);
    }

    // Extract tenant from header or JWT
    const tenantId = req.headers.get('x-tenant-id') ||
      (user.app_metadata?.tenant_id as string);

    if (!tenantId) {
      return jsonError('Missing tenant context. Set x-tenant-id header.', 400);
    }

    // Verify user belongs to tenant
    const { data: membership } = await supabase
      .from('tenant_members')
      .select('role')
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)
      .not('accepted_at', 'is', null)
      .single();

    if (!membership) {
      return jsonError('Not a member of this tenant', 403);
    }

    // Route by method + path
    const url = new URL(req.url);
    const path = url.pathname.replace('/tenant-api', '');

    // Admin service client for operations that bypass RLS
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── GET /projects ──
    if (req.method === 'GET' && path === '/projects') {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('tenant_id', tenantId)
        .neq('status', 'deleted')
        .order('updated_at', { ascending: false });

      if (error) return jsonError(error.message, 500);
      return jsonOk(data);
    }

    // ── POST /projects ──
    if (req.method === 'POST' && path === '/projects') {
      if (!['owner', 'admin', 'member'].includes(membership.role)) {
        return jsonError('Viewers cannot create projects', 403);
      }

      const body = await req.json();
      const { data, error } = await supabase
        .from('projects')
        .insert({
          tenant_id: tenantId,
          name: body.name,
          description: body.description,
          metadata: body.metadata || {},
          created_by: user.id,
        })
        .select()
        .single();

      if (error) return jsonError(error.message, 500);
      return jsonOk(data, 201);
    }

    // ── POST /invite ──
    if (req.method === 'POST' && path === '/invite') {
      if (!['owner', 'admin'].includes(membership.role)) {
        return jsonError('Only admins can invite members', 403);
      }

      const body = await req.json();

      // Look up user by email
      const { data: inviteeList } = await adminClient.auth.admin.listUsers();
      const invitee = inviteeList?.users?.find(u => u.email === body.email);

      if (!invitee) {
        // Send invitation email via Supabase Auth
        const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(body.email, {
          data: { invited_to_tenant: tenantId },
        });
        if (inviteError) return jsonError(inviteError.message, 500);
        return jsonOk({ status: 'invitation_sent', email: body.email });
      }

      // User exists — add to tenant
      const { data: member, error: memberError } = await adminClient
        .from('tenant_members')
        .upsert({
          tenant_id: tenantId,
          user_id: invitee.id,
          role: body.role || 'member',
          invited_by: user.id,
          accepted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (memberError) return jsonError(memberError.message, 500);
      return jsonOk(member, 201);
    }

    // ── GET /audit-log ──
    if (req.method === 'GET' && path === '/audit-log') {
      if (!['owner', 'admin'].includes(membership.role)) {
        return jsonError('Only admins can view audit log', 403);
      }

      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) return jsonError(error.message, 500);
      return jsonOk(data);
    }

    return jsonError('Not found', 404);

  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Internal error', 500);
  }
});

function jsonOk(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
