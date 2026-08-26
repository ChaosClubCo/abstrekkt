/**
 * @module tests/unit/errors.test
 * @description Unit tests for error handling utilities
 */

import { describe, it, expect } from 'vitest';

import {
  ErrorCode,
  OrchestrationError,
  ValidationError,
  NotFoundError,
  SecurityError,
  ConfigurationError,
  DataIntegrityError,
  isOrchestrationError,
  wrapError,
  formatErrorForLog,
} from '../../src/utils/errors.js';

describe('OrchestrationError', () => {
  describe('Construction', () => {
    it('should create error with message', () => {
      const error = new OrchestrationError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('OrchestrationError');
    });

    it('should create error with full metadata', () => {
      const error = new OrchestrationError('Test error', {
        code: ErrorCode.VALIDATION_ERROR,
        fix: 'Try again with valid input',
        retryable: true,
        context: { field: 'email' },
        statusCode: 400,
      });

      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.fix).toBe('Try again with valid input');
      expect(error.retryable).toBe(true);
      expect(error.context).toEqual({ field: 'email' });
      expect(error.statusCode).toBe(400);
    });

    it('should apply default values', () => {
      const error = new OrchestrationError('Test error');

      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(error.retryable).toBe(false);
      expect(error.statusCode).toBe(500);
    });

    it('should preserve error cause', () => {
      const cause = new Error('Original error');
      const error = new OrchestrationError('Wrapped error', {
        code: ErrorCode.INTERNAL_ERROR,
        fix: 'Check logs',
        retryable: false,
      }, cause);

      expect(error.cause).toBe(cause);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON correctly', () => {
      const error = new OrchestrationError('Test error', {
        code: ErrorCode.VALIDATION_ERROR,
        fix: 'Fix it',
        retryable: true,
        statusCode: 400,
      });

      const json = error.toJSON();

      expect(json.name).toBe('OrchestrationError');
      expect(json.message).toBe('Test error');
      expect(json.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(json.fix).toBe('Fix it');
      expect(json.retryable).toBe(true);
      expect(json.statusCode).toBe(400);
    });

    it('should include stack trace', () => {
      const error = new OrchestrationError('Test error');
      const json = error.toJSON();

      expect(json.stack).toBeDefined();
    });

    it('should include cause if present', () => {
      const cause = new Error('Root cause');
      const error = new OrchestrationError('Test error', {
        code: ErrorCode.INTERNAL_ERROR,
        fix: 'Check cause',
        retryable: false,
      }, cause);

      const json = error.toJSON();

      expect(json.cause).toBeDefined();
      expect((json.cause as { message: string }).message).toBe('Root cause');
    });
  });

  describe('toUserMessage', () => {
    it('should format user-friendly message with fix', () => {
      const error = new OrchestrationError('Invalid email format', {
        code: ErrorCode.VALIDATION_ERROR,
        fix: 'Please provide a valid email address',
        retryable: false,
        statusCode: 400,
      });

      const message = error.toUserMessage();

      expect(message).toContain('Invalid email format');
      expect(message).toContain('Please provide a valid email address');
    });

    it('should indicate retryable errors', () => {
      const error = new OrchestrationError('Service temporarily unavailable', {
        code: ErrorCode.INTERNAL_ERROR,
        fix: 'Please wait and try again',
        retryable: true,
        statusCode: 503,
      });

      const message = error.toUserMessage();

      expect(message).toContain('retried');
    });
  });
});

describe('Specialized Error Classes', () => {
  describe('ValidationError', () => {
    it('should create with correct code', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.retryable).toBe(false);
    });

    it('should accept custom fix message', () => {
      const error = new ValidationError('Invalid input', 'Provide valid data');
      
      expect(error.fix).toBe('Provide valid data');
    });

    it('should accept context', () => {
      const error = new ValidationError('Invalid input', 'Fix it', { field: 'name' });
      
      expect(error.context).toEqual({ field: 'name' });
    });
  });

  describe('NotFoundError', () => {
    it('should create with resource details', () => {
      const error = new NotFoundError('User', '123');
      
      expect(error.message).toContain('User');
      expect(error.message).toContain('123');
      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.statusCode).toBe(404);
    });

    it('should format resource name in message', () => {
      const error = new NotFoundError('Role', 'Visionary');
      
      expect(error.message).toBe('Role not found: Visionary');
    });
  });

  describe('SecurityError', () => {
    it('should create with correct code', () => {
      const error = new SecurityError('Injection detected');
      
      expect(error.code).toBe(ErrorCode.SECURITY_ERROR);
      expect(error.statusCode).toBe(403);
      expect(error.retryable).toBe(false);
    });

    it('should handle injection detection', () => {
      const error = new SecurityError(
        'Potential injection attack detected',
        'Sanitize your input and try again',
        { pattern: 'script injection' }
      );
      
      expect(error.message).toContain('injection');
      expect(error.context).toEqual({ pattern: 'script injection' });
    });
  });

  describe('ConfigurationError', () => {
    it('should create with correct code', () => {
      const error = new ConfigurationError('Missing API key');
      
      expect(error.code).toBe(ErrorCode.CONFIGURATION_ERROR);
      expect(error.statusCode).toBe(500);
    });

    it('should provide configuration fix guidance', () => {
      const error = new ConfigurationError(
        'Database URL not configured',
        'Set DATABASE_URL environment variable'
      );
      
      expect(error.fix).toBe('Set DATABASE_URL environment variable');
    });
  });

  describe('DataIntegrityError', () => {
    it('should create with correct code', () => {
      const error = new DataIntegrityError('Data validation failed');
      
      expect(error.code).toBe(ErrorCode.DATA_INTEGRITY_ERROR);
      expect(error.statusCode).toBe(500);
    });

    it('should indicate potential data corruption', () => {
      const error = new DataIntegrityError(
        'Hash mismatch detected',
        'Reload data from source'
      );
      
      expect(error.message).toContain('mismatch');
    });
  });
});

describe('isOrchestrationError', () => {
  it('should return true for OrchestrationError', () => {
    const error = new OrchestrationError('Test');
    expect(isOrchestrationError(error)).toBe(true);
  });

  it('should return true for specialized errors', () => {
    expect(isOrchestrationError(new ValidationError('Test'))).toBe(true);
    expect(isOrchestrationError(new NotFoundError('User', '1'))).toBe(true);
    expect(isOrchestrationError(new SecurityError('Test'))).toBe(true);
    expect(isOrchestrationError(new ConfigurationError('Test'))).toBe(true);
    expect(isOrchestrationError(new DataIntegrityError('Test'))).toBe(true);
  });

  it('should return false for regular Error', () => {
    const error = new Error('Test');
    expect(isOrchestrationError(error)).toBe(false);
  });

  it('should return false for non-errors', () => {
    expect(isOrchestrationError(null)).toBe(false);
    expect(isOrchestrationError(undefined)).toBe(false);
    expect(isOrchestrationError('error string')).toBe(false);
    expect(isOrchestrationError({ message: 'fake error' })).toBe(false);
  });
});

describe('wrapError', () => {
  it('should return OrchestrationError as-is', () => {
    const original = new ValidationError('Original');
    const wrapped = wrapError(original);
    
    expect(wrapped).toBe(original);
  });

  it('should wrap regular Error', () => {
    const original = new Error('Regular error');
    const wrapped = wrapError(original);
    
    expect(isOrchestrationError(wrapped)).toBe(true);
    expect(wrapped.cause).toBe(original);
    expect(wrapped.message).toContain('Regular error');
  });

  it('should wrap string error', () => {
    const wrapped = wrapError('String error');
    
    expect(isOrchestrationError(wrapped)).toBe(true);
    expect(wrapped.message).toContain('String error');
  });

  it('should handle null/undefined', () => {
    const wrappedNull = wrapError(null);
    const wrappedUndefined = wrapError(undefined);
    
    expect(isOrchestrationError(wrappedNull)).toBe(true);
    expect(isOrchestrationError(wrappedUndefined)).toBe(true);
  });

  it('should use custom message if provided', () => {
    const original = new Error('Original');
    const wrapped = wrapError(original, 'Custom message');
    
    expect(wrapped.message).toBe('Custom message');
  });
});

describe('formatErrorForLog', () => {
  it('should format OrchestrationError for logging', () => {
    const error = new ValidationError('Invalid input', 'Fix it', { field: 'email' });
    const formatted = formatErrorForLog(error);
    
    expect(formatted.name).toBe('ValidationError');
    expect(formatted.message).toBe('Invalid input');
    expect(formatted.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(formatted.context).toEqual({ field: 'email' });
  });

  it('should format regular Error for logging', () => {
    const error = new Error('Regular error');
    const formatted = formatErrorForLog(error);
    
    expect(formatted.name).toBe('Error');
    expect(formatted.message).toBe('Regular error');
    expect(formatted.stack).toBeDefined();
  });

  it('should include stack trace', () => {
    const error = new Error('Test');
    const formatted = formatErrorForLog(error);
    
    expect(typeof formatted.stack).toBe('string');
    expect(formatted.stack).toContain('Test');
  });
});

describe('ErrorCode enum', () => {
  it('should have all expected error codes', () => {
    expect(ErrorCode.VALIDATION_ERROR).toBeDefined();
    expect(ErrorCode.INVALID_INPUT).toBeDefined();
    expect(ErrorCode.MISSING_REQUIRED).toBeDefined();
    expect(ErrorCode.OUT_OF_RANGE).toBeDefined();
    expect(ErrorCode.NOT_FOUND).toBeDefined();
    expect(ErrorCode.ROLE_NOT_FOUND).toBeDefined();
    expect(ErrorCode.PHASE_NOT_FOUND).toBeDefined();
    expect(ErrorCode.TEMPLATE_NOT_FOUND).toBeDefined();
    expect(ErrorCode.SECURITY_ERROR).toBeDefined();
    expect(ErrorCode.INJECTION_DETECTED).toBeDefined();
    expect(ErrorCode.UNAUTHORIZED).toBeDefined();
    expect(ErrorCode.FORBIDDEN).toBeDefined();
    expect(ErrorCode.INTERNAL_ERROR).toBeDefined();
    expect(ErrorCode.CONFIGURATION_ERROR).toBeDefined();
    expect(ErrorCode.DATA_INTEGRITY_ERROR).toBeDefined();
  });
});

describe('Error Chain Handling', () => {
  it('should preserve error chain through multiple wraps', () => {
    const root = new Error('Root cause');
    const middle = new OrchestrationError('Middle layer', {
      code: ErrorCode.INTERNAL_ERROR,
      fix: 'Check root cause',
      retryable: false,
    }, root);
    
    expect(middle.cause).toBe(root);
  });

  it('should serialize error chain to JSON', () => {
    const root = new Error('Root');
    const wrapped = new ValidationError('Wrapped');
    (wrapped as any).cause = root;
    
    const json = wrapped.toJSON();
    
    expect(json.cause).toBeDefined();
  });
});
