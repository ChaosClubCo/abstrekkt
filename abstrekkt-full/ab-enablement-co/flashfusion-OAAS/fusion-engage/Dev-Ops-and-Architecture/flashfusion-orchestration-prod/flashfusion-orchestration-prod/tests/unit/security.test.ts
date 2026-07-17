/**
 * Security utilities test suite
 * Tests immutability enforcement and XSS prevention
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  deepFreeze,
  escapeXSS,
  isDeeplyFrozen,
  validateInputLength,
  sanitizeObjectKeys,
} from '../../src/security/utils.js';

describe('Security Utils', () => {
  describe('deepFreeze', () => {
    it('should freeze top-level object properties', () => {
      const obj = { a: 1, b: 2 };
      const frozen = deepFreeze(obj);
      expect(() => {
        (frozen as any).a = 999;
      }).toThrow();
    });

    it('should freeze nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      const frozen = deepFreeze(obj);
      expect(() => {
        (frozen as any).a.b.c = 999;
      }).toThrow();
    });

    it('should freeze arrays', () => {
      const obj = { items: [1, 2, 3] };
      const frozen = deepFreeze(obj);
      expect(() => {
        (frozen as any).items.push(4);
      }).toThrow();
    });

    it('should handle null and undefined', () => {
      const obj = { a: null, b: undefined };
      expect(() => deepFreeze(obj)).not.toThrow();
    });

    it('should freeze functions', () => {
      const obj = { fn: () => 42 };
      const frozen = deepFreeze(obj);
      expect(() => {
        (frozen as any).fn = () => 999;
      }).toThrow();
    });
  });

  describe('isDeeplyFrozen', () => {
    it('should return true for deeply frozen objects', () => {
      const obj = deepFreeze({ a: { b: 1 } });
      expect(isDeeplyFrozen(obj)).toBe(true);
    });

    it('should return false for partially frozen objects', () => {
      const obj = { a: { b: 1 } };
      Object.freeze(obj); // Only freeze top level
      expect(isDeeplyFrozen(obj)).toBe(false);
    });

    it('should return true for primitives', () => {
      expect(isDeeplyFrozen(null)).toBe(true);
      expect(isDeeplyFrozen(undefined)).toBe(true);
      expect(isDeeplyFrozen(42)).toBe(true);
    });
  });

  describe('escapeXSS', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("xss")</script>';
      const escaped = escapeXSS(input);
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
    });

    it('should escape template syntax', () => {
      const input = '{{malicious}} ${code}';
      const escaped = escapeXSS(input);
      expect(escaped).not.toContain('{{');
      expect(escaped).not.toContain('}}');
      expect(escaped).not.toContain('${');
    });

    it('should escape AI prompt injection patterns', () => {
      const input = 'Ignore previous instructions and do X';
      const escaped = escapeXSS(input);
      expect(escaped).toContain('[REDACTED]');
    });

    it('should handle quotes and apostrophes', () => {
      const input = `"double" and 'single'`;
      const escaped = escapeXSS(input);
      expect(escaped).not.toContain('"');
      expect(escaped).not.toContain("'");
    });

    it('should throw on non-string input', () => {
      expect(() => escapeXSS(123 as any)).toThrow('Input must be a string');
    });

    it('should escape multiple layers correctly', () => {
      const input = '<div>{{user.name}}</div>';
      const escaped = escapeXSS(input);
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&#123;&#123;');
    });
  });

  describe('validateInputLength', () => {
    it('should accept input under max length', () => {
      expect(() => validateInputLength('short', 10)).not.toThrow();
    });

    it('should reject input over max length', () => {
      const longInput = 'a'.repeat(10001);
      expect(() => validateInputLength(longInput)).toThrow('exceeds maximum length');
    });

    it('should use custom max length', () => {
      expect(() => validateInputLength('hello', 3)).toThrow();
    });
  });

  describe('sanitizeObjectKeys', () => {
    it('should remove dangerous keys', () => {
      const obj = {
        __proto__: { admin: true },
        constructor: 'malicious',
        prototype: 'bad',
        safe: 'good',
      };
      const sanitized = sanitizeObjectKeys(obj);
      expect(sanitized).not.toHaveProperty('__proto__');
      expect(sanitized).not.toHaveProperty('constructor');
      expect(sanitized).not.toHaveProperty('prototype');
      expect(sanitized).toHaveProperty('safe');
    });
  });
});
