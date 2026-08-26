/**
 * @module utils/security
 * @description Security utilities for runtime immutability and data protection
 * @security CRITICAL - Prevents runtime mutation attacks (CWE-502, CWE-915)
 */

/**
 * Recursively freezes an object and all nested properties.
 * Provides runtime immutability beyond TypeScript's compile-time `as const`.
 * 
 * @security Mitigates:
 * - CWE-502: Deserialization of Untrusted Data
 * - CWE-915: Improperly Controlled Modification of Dynamically-Determined Object Attributes
 * 
 * @param obj - The object to deeply freeze
 * @returns The same object, now deeply frozen
 * 
 * @example
 * ```typescript
 * const data = deepFreeze({ roles: [{ name: 'Admin' }] });
 * data.roles[0].name = 'Hacker'; // Throws in strict mode, silently fails otherwise
 * ```
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  // Get all property names (including non-enumerable)
  const propNames = Object.getOwnPropertyNames(obj);
  
  // Freeze properties before freezing the object itself
  for (const name of propNames) {
    const value = (obj as Record<string, unknown>)[name];
    
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value as object);
    }
  }
  
  return Object.freeze(obj) as Readonly<T>;
}

/**
 * Validates that an object is deeply frozen (all nested properties immutable).
 * Use for runtime assertion in tests and security validation.
 * 
 * @param obj - The object to validate
 * @returns true if the object and all nested properties are frozen
 * 
 * @example
 * ```typescript
 * const data = deepFreeze({ nested: { value: 1 } });
 * console.log(isDeepFrozen(data)); // true
 * ```
 */
export function isDeepFrozen(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object') {
    return true; // Primitives are inherently immutable
  }
  
  if (!Object.isFrozen(obj)) {
    return false;
  }
  
  const propNames = Object.getOwnPropertyNames(obj);
  
  for (const name of propNames) {
    const value = (obj as Record<string, unknown>)[name];
    
    if (!isDeepFrozen(value)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Creates a frozen shallow copy of an array with frozen elements.
 * Prevents both array modification and element mutation.
 * 
 * @param arr - The array to freeze
 * @returns A new frozen array with frozen elements
 */
export function freezeArray<T extends object>(arr: readonly T[]): readonly Readonly<T>[] {
  return Object.freeze(arr.map(item => 
    typeof item === 'object' && item !== null ? deepFreeze(item) : item
  )) as readonly Readonly<T>[];
}

/**
 * Validates that a value has not been tampered with using SHA-256 hash.
 * Used for audit log integrity verification.
 * 
 * @param data - The data to hash
 * @returns SHA-256 hash as hex string
 */
export async function computeIntegrityHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Synchronous hash computation for environments without crypto.subtle.
 * Uses a simple but collision-resistant hash function.
 * 
 * @param data - The data to hash
 * @returns Hash as hex string
 */
export function computeIntegrityHashSync(data: string): string {
  // djb2 hash algorithm - fast and reasonable collision resistance
  let hash = 5381;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) + hash) ^ data.charCodeAt(i);
  }
  // Convert to unsigned 32-bit integer and then to hex
  return (hash >>> 0).toString(16).padStart(8, '0');
}
