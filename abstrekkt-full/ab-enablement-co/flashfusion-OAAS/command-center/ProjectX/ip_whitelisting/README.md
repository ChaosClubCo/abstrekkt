# IP Whitelisting Module

Enterprise IP-based access control for securing SaaS applications.

## Features

- **IP Allowlists**: Restrict access to specific IP addresses/ranges
- **CIDR Support**: IPv4 and IPv6 CIDR notation
- **Geo Blocking**: Country-based access restrictions
- **VPN Detection**: Block known VPN/proxy IPs
- **Session Binding**: Bind sessions to originating IP
- **Audit Trail**: Log all access attempts
- **Grace Periods**: Temporary access for new IPs
- **Admin Bypass**: Emergency access for admins
- **API Restrictions**: Separate rules for API access

## Installation

```bash
npm install @projectx/ip-whitelisting
```

## Usage

```typescript
import {
  IPWhitelistProvider,
  useIPRules,
  useAccessAttempts,
  IPRulesPanel,
} from '@projectx/ip-whitelisting';

// Check IP access
function ProtectedRoute({ children }) {
  const { isAllowed, isLoading, reason } = useIPAccess();

  if (isLoading) return <Loading />;

  if (!isAllowed) {
    return <AccessDenied reason={reason} />;
  }

  return children;
}

// Admin configuration
function SecuritySettings() {
  const { rules, createRule, deleteRule } = useIPRules();

  return (
    <IPRulesPanel
      rules={rules}
      onAdd={createRule}
      onRemove={deleteRule}
    />
  );
}
```

## Configuration

```typescript
const config: IPWhitelistConfig = {
  enabled: true,
  mode: 'allowlist', // 'allowlist' | 'blocklist'
  defaultAction: 'deny',
  rules: [
    {
      type: 'ip',
      value: '192.168.1.0/24',
      action: 'allow',
      label: 'Office Network',
    },
    {
      type: 'ip',
      value: '10.0.0.0/8',
      action: 'allow',
      label: 'VPN Range',
    },
    {
      type: 'country',
      value: 'US',
      action: 'allow',
      label: 'United States',
    },
    {
      type: 'country',
      value: 'CN',
      action: 'deny',
      label: 'China',
    },
  ],
  apiRules: {
    enabled: true,
    separateRules: true,
  },
  sessionBinding: {
    enabled: true,
    allowedChanges: 1,
    windowMinutes: 60,
  },
  vpnBlocking: {
    enabled: true,
    blockDataCenters: true,
  },
  gracePeriod: {
    enabled: true,
    minutes: 30,
    requireApproval: true,
  },
};
```

## Rule Types

### IP/CIDR Rules
```typescript
// Single IP
{ type: 'ip', value: '203.0.113.50', action: 'allow' }

// CIDR range
{ type: 'ip', value: '192.168.1.0/24', action: 'allow' }

// IPv6
{ type: 'ip', value: '2001:db8::/32', action: 'allow' }
```

### Country Rules
```typescript
// Allow specific country
{ type: 'country', value: 'US', action: 'allow' }

// Block countries
{ type: 'country', value: 'RU', action: 'deny' }
```

### ASN Rules
```typescript
// Block specific ASN (useful for VPN providers)
{ type: 'asn', value: 'AS12345', action: 'deny' }
```

## API Reference

### Hooks
| Hook | Description |
|------|-------------|
| `useIPAccess()` | Check current session IP access |
| `useIPRules()` | Manage IP rules |
| `useAccessAttempts()` | View access attempt logs |
| `useGeoLocation()` | Get current IP geolocation |
| `useSessionBinding()` | Manage session IP binding |

### Components
| Component | Description |
|-----------|-------------|
| `IPRulesPanel` | Admin rules management UI |
| `AccessDenied` | Access denied message |
| `AccessLog` | Access attempts log viewer |
| `GracePeriodRequest` | Request temporary access |

## Security Best Practices

1. Always use HTTPS to prevent IP spoofing
2. Consider X-Forwarded-For for proxied setups
3. Implement rate limiting alongside IP rules
4. Regularly audit access logs
5. Use grace periods for traveling employees
6. Have admin bypass procedures documented
