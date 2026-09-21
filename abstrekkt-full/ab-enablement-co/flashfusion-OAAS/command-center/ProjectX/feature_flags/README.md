# Feature Flags Module

Gradual feature rollout and A/B testing with targeting rules.

## Features

- **Boolean Flags**: Simple on/off feature toggles
- **Percentage Rollout**: Gradual rollout to X% of users
- **Targeting Rules**: Enable for specific users, plans, or segments
- **A/B Testing**: Variant testing with analytics
- **Real-time Updates**: No deployment needed to toggle features

## Usage

```tsx
import {
  FeatureFlagProvider,
  useFeatureFlag,
  useFeatureFlags,
  FeatureFlagPanel
} from '@projectx/feature_flags';

// Wrap your app
function App() {
  return (
    <FeatureFlagProvider>
      <YourApp />
    </FeatureFlagProvider>
  );
}

// Check a flag in components
function NewFeature() {
  const { enabled, loading } = useFeatureFlag('new-dashboard');

  if (loading) return <Spinner />;
  if (!enabled) return null;

  return <NewDashboard />;
}

// Admin panel for managing flags
function AdminPanel() {
  return <FeatureFlagPanel />;
}
```

## Targeting Rules

```typescript
const flag = {
  key: 'premium-features',
  enabled: true,
  rolloutPercentage: 100,
  rules: [
    {
      attribute: 'plan',
      operator: 'in',
      value: ['pro', 'enterprise']
    },
    {
      attribute: 'email',
      operator: 'contains',
      value: '@company.com'
    }
  ]
};
```

## API

### Hooks

| Hook | Description |
|------|-------------|
| `useFeatureFlag(key)` | Check if a flag is enabled |
| `useFeatureFlags()` | Get all flags |
| `useFeatureFlagVariant(key)` | Get variant for A/B tests |
