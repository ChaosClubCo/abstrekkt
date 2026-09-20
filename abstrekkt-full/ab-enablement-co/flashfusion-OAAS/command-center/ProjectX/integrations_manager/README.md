# Integrations Manager Module

This module provides a skeleton for managing third‑party integrations
within a React/TypeScript application. It enables users to connect to
providers like GitHub, Slack, Notion, Jira and Linear via API tokens,
disconnect or remove them, and view a log of actions.

## Features

- Connect to a provider by entering an API token (stored in memory for the
  demo).
- Disconnect from an existing integration without losing the stored
  configuration.
- Remove an integration entirely.
- Display current status (connected/disconnected) for each provider.
- Maintain a log of events (connect, disconnect, remove) for debugging
  and demonstration purposes.
- Custom hook and demo component for easy integration.

## Structure

```
integrations_manager/
│  ├─ useIntegrationsManager.ts  # Hook managing integrations and logs
│  ├─ IntegrationsManager.tsx    # Demo component with UI controls
│  ├─ README.md                  # This file
│  └─ PRODUCTION_PLAN.md         # Roadmap for production readiness
```

## Usage

Import and use the hook inside your own components to manage integrations:

```tsx
import { useIntegrationsManager } from './useIntegrationsManager';

const MyComponent: React.FC = () => {
  const { integrations, connectIntegration } = useIntegrationsManager();

  // connectIntegration('GitHub', 'your-token') to add a connection
  return <></>;
};
```

Or embed the provided demo component:

```tsx
import { IntegrationsManager } from './IntegrationsManager';

<IntegrationsManager />
```

## Security Considerations

- **Never** commit real API tokens or secrets to your source code. Use
  environment variables, secure vaults or platform secrets management
  solutions to store sensitive information.
- Validate user‑provided tokens and handle any provider API errors
  gracefully (e.g. invalid token, insufficient scope).
- Limit scopes for OAuth tokens to the minimum required to perform the
  necessary actions.

## Next Steps

Refer to `PRODUCTION_PLAN.md` for guidance on integrating real providers,
securely storing credentials, supporting multiple accounts per provider
and building a marketplace for additional integrations.