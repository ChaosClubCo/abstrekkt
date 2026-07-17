# Audit Logging Module

Comprehensive activity trail for compliance, security monitoring, and debugging.

## Features

- **Activity Tracking**: Log all user and system actions
- **Search & Filter**: Powerful query interface for audit logs
- **Export**: Export logs for compliance reporting (CSV, JSON)
- **Retention Policies**: Configurable log retention periods
- **Real-time Stream**: WebSocket-based live log viewing

## Usage

```tsx
import {
  AuditLogProvider,
  useAuditLog,
  AuditLogViewer,
  logActivity
} from '@projectx/audit_logging';

// Wrap your app to enable automatic tracking
function App() {
  return (
    <AuditLogProvider>
      <YourApp />
    </AuditLogProvider>
  );
}

// Manually log an activity
await logActivity({
  action: 'user.updated',
  resource: 'users',
  resourceId: userId,
  metadata: { changedFields: ['name', 'email'] }
});

// View audit logs
function AuditPage() {
  return (
    <AuditLogViewer
      filters={{ userId, dateRange }}
      onExport={handleExport}
    />
  );
}
```

## API

### Functions

| Function | Description |
|----------|-------------|
| `logActivity(entry)` | Log a new audit entry |
| `searchAuditLogs(filters)` | Search logs with filters |
| `exportAuditLogs(filters, format)` | Export logs to CSV/JSON |

### Hooks

| Hook | Description |
|------|-------------|
| `useAuditLog()` | Access audit logging context |
| `useAuditLogs(filters)` | Fetch and filter audit logs |
| `useAuditStream()` | Subscribe to real-time log updates |

### Components

| Component | Description |
|-----------|-------------|
| `AuditLogProvider` | Context provider for audit logging |
| `AuditLogViewer` | Full-featured log viewer component |
| `AuditLogTable` | Table display of audit entries |
| `AuditLogFilters` | Filter controls for logs |
| `AuditLogExport` | Export button with format options |

## Action Types

Standard action types tracked by the system:

### User Actions
- `user.login` - User logged in
- `user.logout` - User logged out
- `user.created` - New user registered
- `user.updated` - User profile updated
- `user.deleted` - User account deleted

### Resource Actions
- `resource.created` - Resource created
- `resource.read` - Resource viewed
- `resource.updated` - Resource modified
- `resource.deleted` - Resource deleted

### Admin Actions
- `admin.settings_changed` - System settings modified
- `admin.role_assigned` - Role assigned to user
- `admin.permission_granted` - Permission granted
- `admin.export_requested` - Data export requested

### Security Events
- `security.mfa_enabled` - MFA enabled
- `security.password_changed` - Password changed
- `security.api_key_created` - API key generated
- `security.suspicious_activity` - Suspicious activity detected

## Database Schema

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);

-- Partitioning for large-scale deployments
CREATE TABLE audit_logs_partitioned (
  LIKE audit_logs INCLUDING ALL
) PARTITION BY RANGE (timestamp);
```

## Configuration

```typescript
// config/audit.ts
export const auditConfig = {
  // Retention period in days
  retentionDays: 90,

  // Actions to track automatically
  autoTrack: [
    'user.login',
    'user.logout',
    'resource.created',
    'resource.updated',
    'resource.deleted',
  ],

  // Actions to exclude
  exclude: ['resource.read'],

  // Include request body in metadata (be careful with PII)
  includeRequestBody: false,

  // Mask sensitive fields
  sensitiveFields: ['password', 'token', 'apiKey', 'secret'],
};
```

## Compliance

This module helps with compliance for:

- **GDPR** - Article 30 (Records of processing activities)
- **SOC 2** - CC6.1, CC7.2 (Logging and monitoring)
- **HIPAA** - §164.312(b) (Audit controls)
- **PCI-DSS** - Requirement 10 (Track access to resources)
