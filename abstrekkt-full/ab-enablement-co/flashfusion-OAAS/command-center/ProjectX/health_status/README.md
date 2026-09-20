# Health Status Module

Public status page and health monitoring system for SaaS applications.

## Features

- **Public Status Page**: Brandable status page for customers
- **Service Health**: Real-time health checks for all services
- **Incident Management**: Create, update, and resolve incidents
- **Scheduled Maintenance**: Plan and announce maintenance windows
- **Uptime Metrics**: Historical uptime tracking and SLA monitoring
- **Subscriber Notifications**: Email/SMS alerts for status changes
- **Component Status**: Individual service component health
- **API Status**: Health check endpoints for external monitoring

## Installation

```bash
npm install @projectx/health-status
```

## Usage

```typescript
import {
  HealthStatusProvider,
  StatusPage,
  useServices,
  useIncidents
} from '@projectx/health-status';

// Public status page
function PublicStatusPage() {
  return (
    <HealthStatusProvider config={{ orgSlug: 'your-company' }}>
      <StatusPage />
    </HealthStatusProvider>
  );
}

// Admin dashboard
function AdminDashboard() {
  const { services, updateServiceStatus } = useServices();
  const { incidents, createIncident, resolveIncident } = useIncidents();

  return (
    <div>
      {services.map(service => (
        <ServiceCard
          key={service.id}
          service={service}
          onStatusChange={(status) => updateServiceStatus(service.id, status)}
        />
      ))}
    </div>
  );
}
```

## Status Types

| Status | Description | Color |
|--------|-------------|-------|
| `operational` | All systems functioning normally | Green |
| `degraded` | Partial system degradation | Yellow |
| `partial_outage` | Some features unavailable | Orange |
| `major_outage` | Significant service disruption | Red |
| `maintenance` | Scheduled maintenance | Blue |

## API Endpoints

```typescript
// Health check endpoint
GET /api/health
// Response: { status: 'healthy', timestamp: '...' }

// Public status
GET /api/status
// Response: { overall: 'operational', services: [...] }

// Service status
GET /api/status/services/:id
// Response: { id, name, status, uptime, lastCheck }

// Incidents
GET /api/status/incidents
POST /api/status/incidents
PATCH /api/status/incidents/:id
```

## Configuration

```typescript
const config: HealthStatusConfig = {
  orgSlug: 'your-company',
  orgName: 'Your Company',
  logo: '/logo.png',
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
  },
  services: [
    { id: 'api', name: 'API', group: 'Core' },
    { id: 'web', name: 'Web Application', group: 'Core' },
    { id: 'db', name: 'Database', group: 'Infrastructure' },
  ],
  healthChecks: {
    interval: 60000, // 1 minute
    timeout: 5000,
    endpoints: [
      { service: 'api', url: 'https://api.example.com/health' },
      { service: 'web', url: 'https://app.example.com/health' },
    ],
  },
  notifications: {
    email: { enabled: true },
    sms: { enabled: false },
    webhook: { url: 'https://hooks.example.com/status' },
  },
};
```

## Components

### StatusPage
Full-featured public status page component.

### StatusBadge
Inline status indicator for embedding.

### IncidentTimeline
Timeline view of incidents and updates.

### UptimeGraph
Historical uptime visualization.

### SubscribeForm
Email subscription for status updates.
