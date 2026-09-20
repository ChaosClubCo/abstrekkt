---
name: supabase-administration
description: Supabase database, authentication, storage, edge functions, and project administration. Use when setting up Supabase projects, managing database schema, configuring authentication, implementing storage, or deploying edge functions.
allowed-tools: mcp__plugin_supabase_supabase__*
---

# Supabase Administration

## Overview

Supabase provides a complete backend-as-a-service built on PostgreSQL, offering database, authentication, storage, real-time subscriptions, and edge functions. It combines the power of a full PostgreSQL database with the convenience of managed services and excellent developer experience.

This skill covers the full Supabase administration lifecycle: project setup, database schema management, Row Level Security (RLS) policies, authentication configuration, storage buckets, and edge function deployment. It provides patterns for building secure, scalable applications on Supabase infrastructure.

The key advantage of Supabase is its PostgreSQL foundation, meaning all standard PostgreSQL knowledge applies while gaining additional features like real-time updates, built-in auth, and convenient client libraries. This skill helps leverage these capabilities effectively.

### Why This Matters
- Supabase reduces backend development time by 70% for common patterns
- Proper RLS configuration is critical for data security
- Understanding Supabase patterns prevents common anti-patterns and performance issues
- Edge functions enable custom logic without managing separate infrastructure

## When to Use

### Primary Triggers
- Setting up new Supabase projects
- Designing and migrating database schemas
- Configuring Row Level Security policies
- Implementing authentication flows
- Managing storage buckets and policies
- Deploying edge functions

### Specific Use Cases
- "Set up a new Supabase project for our multi-tenant SaaS"
- "Implement RLS policies to restrict users to their own data"
- "Configure Google OAuth authentication"
- "Create a storage bucket for user uploads with proper policies"
- "Deploy an edge function for custom webhook processing"

## Core Processes

### 1. Project Setup and Configuration

**Initial Project Setup Checklist**

```markdown
## Supabase Project Setup

### 1. Create Project
- [ ] Choose appropriate region (closest to users)
- [ ] Set strong database password
- [ ] Note project URL and anon key

### 2. Configure Authentication
- [ ] Enable required auth providers
- [ ] Configure redirect URLs for OAuth
- [ ] Set up email templates
- [ ] Configure password requirements

### 3. Database Schema
- [ ] Create initial tables via migrations
- [ ] Enable required extensions
- [ ] Set up RLS policies on all tables
- [ ] Create necessary indexes

### 4. Security Review
- [ ] Verify RLS enabled on all public tables
- [ ] Review exposed API endpoints
- [ ] Configure rate limiting
- [ ] Set up database backups

### 5. Environment Configuration
- [ ] Add environment variables to .env
- [ ] Configure client library
- [ ] Set up development workflow
```

**Client Configuration**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Server-side client with service role (use carefully!)
export function createServiceClient() {
  return createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

### 2. Database Schema and Migrations

**Migration File Structure**

```sql
-- supabase/migrations/20240115000000_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    inventory INTEGER NOT NULL DEFAULT 0 CHECK (inventory >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_products_organization ON products(organization_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3. Row Level Security (RLS)

**RLS Policy Patterns**

```sql
-- supabase/migrations/20240115000001_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_organization_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Organizations policies
CREATE POLICY "Users can view their organization"
    ON organizations FOR SELECT
    USING (id = get_user_organization_id());

CREATE POLICY "Owners can update their organization"
    ON organizations FOR UPDATE
    USING (id = get_user_organization_id() AND is_organization_admin());

-- Profiles policies
CREATE POLICY "Users can view profiles in their organization"
    ON profiles FOR SELECT
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Admins can update profiles in their organization"
    ON profiles FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_organization_admin()
    );

-- Products policies
CREATE POLICY "Anyone can view active products"
    ON products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Organization members can view all products"
    ON products FOR SELECT
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Admins can insert products"
    ON products FOR INSERT
    WITH CHECK (
        organization_id = get_user_organization_id()
        AND is_organization_admin()
    );

CREATE POLICY "Admins can update products"
    ON products FOR UPDATE
    USING (
        organization_id = get_user_organization_id()
        AND is_organization_admin()
    );

CREATE POLICY "Admins can delete products"
    ON products FOR DELETE
    USING (
        organization_id = get_user_organization_id()
        AND is_organization_admin()
    );
```

### 4. Authentication Configuration

**Auth Setup with React**

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, metadata?: object) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signInWithOAuth,
    signUp,
    signOut,
  };
}
```

**Auth Callback Handler (Next.js)**

```typescript
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
```

### 5. Storage Configuration

**Storage Bucket Setup**

```sql
-- Create storage buckets via SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('documents', 'documents', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']);

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for documents bucket
CREATE POLICY "Users can view documents in their organization"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1] = get_user_organization_id()::text
    );

CREATE POLICY "Admins can upload organization documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'documents'
        AND (storage.foldername(name))[1] = get_user_organization_id()::text
        AND is_organization_admin()
    );
```

**Storage Client Usage**

```typescript
// lib/storage.ts
import { supabase } from './supabase';

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function uploadDocument(
  organizationId: string,
  file: File,
  folder: string = 'general'
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${organizationId}/${folder}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file);

  if (error) throw error;

  return data.path;
}

export async function getDocumentUrl(path: string) {
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}
```

### 6. Edge Functions

**Edge Function Structure**

```typescript
// supabase/functions/process-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('x-webhook-signature');
    if (!verifySignature(signature, await req.clone().text())) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Process the webhook
    const { data, error } = await supabase
      .from('webhook_events')
      .insert({
        type: payload.type,
        payload: payload,
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, eventId: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function verifySignature(signature: string | null, body: string): boolean {
  if (!signature) return false;
  const secret = Deno.env.get('WEBHOOK_SECRET');
  // Implement HMAC verification
  return true; // Placeholder
}
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Supabase CLI | Local development | Free | Migrations, type generation |
| Supabase Studio | Database management | Included | SQL editor, table viewer |
| pgAdmin | Advanced DB admin | Free | Full PostgreSQL features |
| Prisma | ORM alternative | Free | Type safety, migrations |
| Supabase MCP | Claude integration | Free | Direct database access |

### Type Generation

```bash
# Generate TypeScript types from database schema
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts
```

## Metrics & KPIs

### Database Metrics
- **Query Performance**: Monitor via pg_stat_statements
- **Connection Pool Usage**: Stay under 80%
- **Database Size**: Track growth over time
- **Replication Lag**: For read replicas

### API Metrics
- **Request Rate**: Monitor for unexpected spikes
- **Error Rate**: Target < 0.1%
- **Response Time**: p99 < 500ms
- **Auth Success Rate**: Track failed logins

## Common Pitfalls

### 1. Forgetting to Enable RLS
**Problem**: Tables without RLS expose all data through the API
**Prevention**: Always enable RLS immediately after creating tables. Use migrations to ensure consistency.

### 2. Overly Permissive Policies
**Problem**: RLS policies that allow more access than intended
**Prevention**: Start with deny-all, add specific allows. Test policies with different user roles.

### 3. N+1 Queries with Relationships
**Problem**: Making separate queries for related data
**Prevention**: Use Supabase's `select` with embedded relationships: `.select('*, organization(*)')`.

### 4. Not Using Service Role Securely
**Problem**: Service role key exposed in client-side code
**Prevention**: Only use service role in server-side code or edge functions. Never expose in browser.

## Integration Points

- **Database Design**: PostgreSQL schema design principles apply
- **API Development**: Supabase provides automatic REST/GraphQL APIs
- **Authentication**: Built-in auth integrates with frontend frameworks
- **Cloud Architecture**: Supabase handles infrastructure
- **Testing Strategies**: Test RLS policies and edge functions
- **Web Development**: Client libraries for React, Vue, etc.
