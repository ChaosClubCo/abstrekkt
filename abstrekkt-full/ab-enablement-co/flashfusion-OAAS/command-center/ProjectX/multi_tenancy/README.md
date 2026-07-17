# Multi-Tenancy Module

Workspace isolation and tenant data separation for enterprise SaaS applications.

## Features

- **Tenant Management**: Create, update, and delete tenants/workspaces
- **Data Isolation**: Row-level security and tenant-scoped queries
- **Workspace Switching**: Seamless context switching between workspaces
- **Tenant Settings**: Per-tenant configuration and customization
- **Invitation System**: Invite users to join workspaces

## Usage

```tsx
import {
  TenantProvider,
  useTenant,
  useWorkspaces,
  WorkspaceSwitcher
} from '@projectx/multi_tenancy';

// Wrap your app with TenantProvider
function App() {
  return (
    <TenantProvider>
      <YourApp />
    </TenantProvider>
  );
}

// Access tenant context in components
function Dashboard() {
  const { tenant, isLoading } = useTenant();
  const { workspaces, switchWorkspace } = useWorkspaces();

  if (isLoading) return <Loading />;

  return (
    <div>
      <WorkspaceSwitcher />
      <h1>Welcome to {tenant.name}</h1>
    </div>
  );
}
```

## API

### Hooks

| Hook | Description |
|------|-------------|
| `useTenant()` | Access current tenant context |
| `useWorkspaces()` | List and switch between workspaces |
| `useTenantSettings()` | Manage tenant settings |
| `useInvitations()` | Manage workspace invitations |

### Components

| Component | Description |
|-----------|-------------|
| `TenantProvider` | Context provider for tenant state |
| `WorkspaceSwitcher` | Dropdown to switch workspaces |
| `CreateWorkspaceModal` | Modal for creating new workspaces |
| `TenantSettings` | Tenant configuration panel |
| `InviteMemberForm` | Form to invite users |

## Database Schema

```sql
-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant memberships
CREATE TABLE tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Row-level security policies
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON your_table
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

## Configuration

```typescript
// config/tenancy.ts
export const tenancyConfig = {
  // Default plan for new tenants
  defaultPlan: 'free',

  // Plan limits
  planLimits: {
    free: { maxMembers: 5, maxProjects: 3 },
    pro: { maxMembers: 25, maxProjects: 50 },
    enterprise: { maxMembers: -1, maxProjects: -1 }, // unlimited
  },

  // Slug validation
  reservedSlugs: ['admin', 'api', 'www', 'app'],
};
```
