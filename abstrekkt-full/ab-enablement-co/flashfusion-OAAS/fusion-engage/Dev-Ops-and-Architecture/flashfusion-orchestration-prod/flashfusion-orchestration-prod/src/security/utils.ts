/**
 * Security utilities for runtime immutability enforcement and XSS prevention
 * Fixes: 5 immutability test failures + 2 XSS test failures
 */

/**
 * Deep freezes an object and all nested objects to prevent mutation
 * Runtime enforcement for ROLE_MATRIX, RACI_CHART, PROMPT_TEMPLATES
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  // Freeze the object itself
  Object.freeze(obj);

  // Recursively freeze all properties
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}

/**
 * Multi-layer XSS escaping for AI-generated content
 * Layer 1: HTML entities
 * Layer 2: Template syntax
 * Layer 3: AI prompt patterns
 */
export function escapeXSS(input: string): string {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  // Layer 1: HTML entities
  let escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Layer 2: Template syntax (prevent {{}} and ${} injection)
  escaped = escaped
    .replace(/\{\{/g, '&#123;&#123;')
    .replace(/\}\}/g, '&#125;&#125;')
    .replace(/\$\{/g, '&#36;&#123;');

  // Layer 3: AI prompt patterns (prevent prompt injection)
  escaped = escaped
    .replace(/\\n\\n/g, ' ')
    .replace(/```/g, '&#96;&#96;&#96;')
    .replace(/ignore previous instructions/gi, '[REDACTED]')
    .replace(/system:/gi, '[REDACTED]')
    .replace(/assistant:/gi, '[REDACTED]');

  return escaped;
}

/**
 * Validates that an object is deeply frozen
 * Used in tests to verify immutability enforcement
 */
export function isDeeplyFrozen(obj: any): boolean {
  if (!Object.isFrozen(obj)) {
    return false;
  }

  for (const prop of Object.getOwnPropertyNames(obj)) {
    const value = obj[prop];
    if (
      value !== null &&
      typeof value === 'object' &&
      !isDeeplyFrozen(value)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Validates input length to prevent DoS attacks
 */
export function validateInputLength(
  input: string,
  maxLength: number = 10000
): void {
  if (input.length > maxLength) {
    throw new Error(
      `Input exceeds maximum length of ${maxLength} characters`
    );
  }
}

/**
 * Sanitizes object keys to prevent prototype pollution
 */
export function sanitizeObjectKeys(obj: Record<string, any>): Record<string, any> {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  const sanitized: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    if (!dangerousKeys.includes(key)) {
      sanitized[key] = obj[key];
    }
  }

  return sanitized;
}
