import type { AuditConfig } from '../types';

/**
 * Default audit configuration
 */
export const defaultAuditConfig: AuditConfig = {
  retentionDays: 90,
  autoTrack: [
    'user.login',
    'user.logout',
    'user.created',
    'user.updated',
    'user.deleted',
    'resource.created',
    'resource.updated',
    'resource.deleted',
    'security.mfa_enabled',
    'security.password_changed',
    'billing.subscription_created',
    'billing.subscription_cancelled',
  ],
  exclude: ['resource.read'],
  includeRequestBody: false,
  sensitiveFields: [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'creditCard',
    'ssn',
    'socialSecurity',
  ],
};

/**
 * Mask sensitive fields in metadata
 */
export function maskSensitiveData(
  data: Record<string, unknown>,
  sensitiveFields: string[] = defaultAuditConfig.sensitiveFields
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    // Check if this field should be masked
    const isSensitive = sensitiveFields.some(
      (field) => lowerKey.includes(field.toLowerCase())
    );

    if (isSensitive && typeof value === 'string') {
      result[key] = maskValue(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = maskSensitiveData(value as Record<string, unknown>, sensitiveFields);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Mask a sensitive value
 */
function maskValue(value: string): string {
  if (value.length <= 8) {
    return '********';
  }
  return value.slice(0, 4) + '****' + value.slice(-4);
}

/**
 * Format an action for display
 */
export function formatAction(action: string): string {
  return action
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' → ');
}

/**
 * Get action color for UI display
 */
export function getActionColor(action: string): string {
  if (action.startsWith('user.login') || action.startsWith('user.created')) {
    return 'green';
  }
  if (action.startsWith('user.logout')) {
    return 'gray';
  }
  if (action.includes('deleted') || action.includes('revoked')) {
    return 'red';
  }
  if (action.startsWith('security.')) {
    return 'yellow';
  }
  if (action.startsWith('billing.')) {
    return 'blue';
  }
  return 'gray';
}

/**
 * Get action icon for UI display
 */
export function getActionIcon(action: string): string {
  if (action.startsWith('user.login')) return '🔐';
  if (action.startsWith('user.logout')) return '🚪';
  if (action.includes('created')) return '➕';
  if (action.includes('updated')) return '✏️';
  if (action.includes('deleted')) return '🗑️';
  if (action.startsWith('security.')) return '🛡️';
  if (action.startsWith('billing.')) return '💳';
  if (action.includes('exported')) return '📤';
  if (action.includes('imported')) return '📥';
  return '📝';
}

/**
 * Format relative time for audit logs
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString();
}
