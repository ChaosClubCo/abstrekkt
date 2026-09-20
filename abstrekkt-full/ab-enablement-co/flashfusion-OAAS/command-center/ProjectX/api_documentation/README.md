# API Documentation Module

Auto-generated OpenAPI/Swagger documentation for your APIs.

## Features

- **OpenAPI 3.0**: Full OpenAPI specification support
- **Interactive UI**: Swagger UI and Redoc support
- **Try It Out**: Test endpoints directly from docs
- **Code Examples**: Auto-generated SDK examples
- **Versioning**: Support for multiple API versions

## Usage

```tsx
import {
  ApiDocsViewer,
  useApiSpec
} from '@projectx/api_documentation';

// Display API docs
function ApiDocsPage() {
  return (
    <ApiDocsViewer
      specUrl="/api/openapi.json"
      theme="dark"
    />
  );
}

// Use spec programmatically
function ApiReference() {
  const { spec, endpoints, isLoading } = useApiSpec();

  return (
    <div>
      {endpoints.map(endpoint => (
        <EndpointCard key={endpoint.path} endpoint={endpoint} />
      ))}
    </div>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `ApiDocsViewer` | Full Swagger UI viewer |
| `EndpointList` | List of API endpoints |
| `EndpointDetail` | Single endpoint documentation |
| `SchemaViewer` | Display JSON schemas |
| `CodeExample` | Code snippets in multiple languages |

## Configuration

```typescript
// api-docs.config.ts
export const apiDocsConfig = {
  title: 'ProjectX API',
  version: '1.0.0',
  description: 'API documentation for ProjectX',
  servers: [
    { url: 'https://api.projectx.com', description: 'Production' },
    { url: 'https://staging-api.projectx.com', description: 'Staging' },
  ],
  tags: [
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Teams', description: 'Team management endpoints' },
    { name: 'Billing', description: 'Subscription and billing' },
  ],
};
```
