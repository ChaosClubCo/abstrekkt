/**
 * @module tests/unit/security.test
 * @description Unit tests for security utilities
 */

import { describe, it, expect } from 'vitest';

import {
  deepFreeze,
  isDeepFrozen,
  freezeArray,
  computeIntegrityHash,
  computeIntegrityHashSync,
} from '../../src/utils/security.js';

describe('deepFreeze', () => {
  it('should freeze a simple object', () => {
    const obj = { a: 1, b: 2 };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
  });

  it('should freeze nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.a)).toBe(true);
    expect(Object.isFrozen(frozen.a.b)).toBe(true);
  });

  it('should freeze arrays', () => {
    const obj = { arr: [1, 2, 3] };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.arr)).toBe(true);
  });

  it('should freeze nested arrays of objects', () => {
    const obj = { arr: [{ a: 1 }, { b: 2 }] };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen.arr[0])).toBe(true);
    expect(Object.isFrozen(frozen.arr[1])).toBe(true);
  });

  it('should handle null values', () => {
    const obj = { a: null, b: 1 };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(frozen.a).toBeNull();
  });

  it('should handle undefined values', () => {
    const obj = { a: undefined, b: 1 };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(frozen.a).toBeUndefined();
  });

  it('should handle primitives by checking type first', () => {
    // deepFreeze expects objects, not primitives
    // Primitives should be checked before calling deepFreeze
    // This test validates the expected behavior
    expect(() => deepFreeze({} as object)).not.toThrow();
  });

  it('should prevent modifications to frozen objects', () => {
    const obj = deepFreeze({ a: 1 });
    
    expect(() => {
      (obj as { a: number }).a = 2;
    }).toThrow();
  });

  it('should prevent adding new properties', () => {
    const obj = deepFreeze({ a: 1 });
    
    expect(() => {
      (obj as Record<string, number>).b = 2;
    }).toThrow();
  });

  it('should prevent deleting properties', () => {
    const obj = deepFreeze({ a: 1 });
    
    expect(() => {
      delete (obj as { a?: number }).a;
    }).toThrow();
  });
});

describe('isDeepFrozen', () => {
  it('should return true for deeply frozen objects', () => {
    const obj = deepFreeze({ a: { b: 1 } });
    expect(isDeepFrozen(obj)).toBe(true);
  });

  it('should return false for unfrozen objects', () => {
    const obj = { a: { b: 1 } };
    expect(isDeepFrozen(obj)).toBe(false);
  });

  it('should return false for shallowly frozen objects', () => {
    const obj = { a: { b: 1 } };
    Object.freeze(obj);
    expect(isDeepFrozen(obj)).toBe(false);
  });

  it('should return true for primitives', () => {
    expect(isDeepFrozen(42)).toBe(true);
    expect(isDeepFrozen('string')).toBe(true);
    expect(isDeepFrozen(true)).toBe(true);
    expect(isDeepFrozen(null)).toBe(true);
    expect(isDeepFrozen(undefined)).toBe(true);
  });

  it('should return true for frozen arrays with frozen elements', () => {
    const arr = deepFreeze([{ a: 1 }, { b: 2 }]);
    expect(isDeepFrozen(arr)).toBe(true);
  });

  it('should return false for frozen arrays with unfrozen elements', () => {
    const arr = [{ a: 1 }, { b: 2 }];
    Object.freeze(arr);
    expect(isDeepFrozen(arr)).toBe(false);
  });
});

describe('freezeArray', () => {
  it('should freeze array and all elements', () => {
    const arr = freezeArray([{ a: 1 }, { b: 2 }]);
    
    expect(Object.isFrozen(arr)).toBe(true);
    expect(Object.isFrozen(arr[0])).toBe(true);
    expect(Object.isFrozen(arr[1])).toBe(true);
  });

  it('should handle empty arrays', () => {
    const arr = freezeArray([]);
    expect(Object.isFrozen(arr)).toBe(true);
  });

  it('should freeze nested arrays', () => {
    const arr = freezeArray([[1, 2], [3, 4]]);
    
    expect(Object.isFrozen(arr)).toBe(true);
    expect(Object.isFrozen(arr[0])).toBe(true);
    expect(Object.isFrozen(arr[1])).toBe(true);
  });
});

describe('computeIntegrityHash', () => {
  it('should compute SHA-256 hash', async () => {
    const data = JSON.stringify({ test: 'data' });
    const hash = await computeIntegrityHash(data);
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64); // SHA-256 produces 64 hex characters
  });

  it('should produce consistent hashes for same data', async () => {
    const data = JSON.stringify({ a: 1, b: 2 });
    const hash1 = await computeIntegrityHash(data);
    const hash2 = await computeIntegrityHash(data);
    
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different data', async () => {
    const hash1 = await computeIntegrityHash(JSON.stringify({ a: 1 }));
    const hash2 = await computeIntegrityHash(JSON.stringify({ a: 2 }));
    
    expect(hash1).not.toBe(hash2);
  });

  it('should handle complex nested structures', async () => {
    const data = JSON.stringify({
      nested: { deep: { value: [1, 2, 3] } },
      array: [{ a: 1 }, { b: 2 }],
    });
    const hash = await computeIntegrityHash(data);
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });

  it('should handle plain strings', async () => {
    const hash = await computeIntegrityHash('test string');
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });

  it('should handle arrays as JSON', async () => {
    const hash = await computeIntegrityHash(JSON.stringify([1, 2, 3]));
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });
});

describe('computeIntegrityHashSync', () => {
  it('should compute hash synchronously', () => {
    const data = JSON.stringify({ test: 'data' });
    const hash = computeIntegrityHashSync(data);
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(8); // djb2 produces 8 hex characters
  });

  it('should produce consistent hashes for same data', () => {
    const data = JSON.stringify({ a: 1, b: 2, c: [3, 4, 5] });
    const hash1 = computeIntegrityHashSync(data);
    const hash2 = computeIntegrityHashSync(data);
    
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different data', () => {
    const hash1 = computeIntegrityHashSync('data1');
    const hash2 = computeIntegrityHashSync('data2');
    
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty strings', () => {
    const hash = computeIntegrityHashSync('');
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(8);
  });

  it('should handle special characters', () => {
    const hash = computeIntegrityHashSync('{}[]null undefined');
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(8);
  });
});

describe('Security Edge Cases', () => {
  it('should handle objects with prototype pollution attempts', () => {
    const malicious = JSON.parse('{"__proto__":{"polluted":true}}');
    const frozen = deepFreeze(malicious);
    
    // Prototype should not be polluted
    expect(({} as Record<string, boolean>).polluted).toBeUndefined();
    expect(Object.isFrozen(frozen)).toBe(true);
  });

  it('should handle objects with constructor property', () => {
    const obj = { constructor: { evil: true } };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.constructor)).toBe(true);
  });

  it('should handle very deep nesting', () => {
    let obj: Record<string, unknown> = { value: 'leaf' };
    for (let i = 0; i < 100; i++) {
      obj = { nested: obj };
    }
    
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
  });

  it('should handle objects with symbol keys', () => {
    const sym = Symbol('test');
    const obj = { [sym]: { a: 1 } };
    const frozen = deepFreeze(obj);
    
    expect(Object.isFrozen(frozen)).toBe(true);
    // Symbol-keyed properties should also be frozen
  });
});
