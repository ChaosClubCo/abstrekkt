/**
 * @module utils/errors
 * @description Structured error classes with cause → fix → retry pattern
 * @compliance Actionable error messages per security best practices
 */

/**
 * Error codes for categorization and automated handling.
 */
export enum ErrorCode {
  // Validation errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED = 'MISSING_REQUIRED',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  
  // Not found errors (4xx)
  NOT_FOUND = 'NOT_FOUND',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  PHASE_NOT_FOUND = 'PHASE_NOT_FOUND',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  
  // Security errors (4xx)
  SECURITY_ERROR = 'SECURITY_ERROR',
  INJECTION_DETECTED = 'INJECTION_DETECTED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Internal errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  DATA_INTEGRITY_ERROR = 'DATA_INTEGRITY_ERROR',
}

/**
 * Error metadata for structured error handling.
 */
export interface ErrorMetadata {
  /** Error classification code */
  code: ErrorCode;
  /** Suggested fix action */
  fix?: string;
  /** Whether the operation is retryable */
  retryable: boolean;
  /** Additional context data */
  context?: Record<string, unknown>;
  /** HTTP status code if applicable */
  statusCode?: number;
}

/**
 * Base error class with structured metadata.
 * All application errors should extend this class.
 */
export class OrchestrationError extends Error {
  /** Error classification code */
  public readonly code: ErrorCode;
  /** Suggested fix action */
  public readonly fix: string | undefined;
  /** Whether the operation is retryable */
  public readonly retryable: boolean;
  /** Additional context data */
  public readonly context: Record<string, unknown> | undefined;
  /** HTTP status code if applicable */
  public readonly statusCode: number;
  /** Original cause error */
  public override readonly cause: Error | undefined;

  constructor(
    message: string,
    metadata?: Partial<ErrorMetadata>,
    cause?: Error
  ) {
    super(message);
    this.name = 'OrchestrationError';
    this.code = metadata?.code ?? ErrorCode.INTERNAL_ERROR;
    this.fix = metadata?.fix;
    this.retryable = metadata?.retryable ?? false;
    this.context = metadata?.context;
    this.statusCode = metadata?.statusCode ?? 500;
    this.cause = cause;

    // Maintains proper stack trace for V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts error to JSON-serializable format.
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      fix: this.fix,
      retryable: this.retryable,
      context: this.context,
      statusCode: this.statusCode,
      stack: this.stack,
      cause: this.cause ? { message: this.cause.message, name: this.cause.name } : undefined,
    };
  }

  /**
   * Creates a user-friendly error message with fix suggestion.
   */
  toUserMessage(): string {
    const parts = [this.message];
    if (this.fix) {
      parts.push(`Fix: ${this.fix}`);
    }
    if (this.retryable) {
      parts.push('This operation can be retried.');
    }
    return parts.join(' ');
  }
}

/**
 * Validation error for invalid input data.
 */
export class ValidationError extends OrchestrationError {
  constructor(
    message: string,
    fix?: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    const metadata: Partial<ErrorMetadata> = {
      code: ErrorCode.VALIDATION_ERROR,
      fix: fix ?? 'Check the input data format and constraints.',
      retryable: false,
      statusCode: 400,
    };
    if (context !== undefined) {
      metadata.context = context;
    }
    super(message, metadata, cause);
    this.name = 'ValidationError';
  }
}

/**
 * Not found error for missing resources.
 */
export class NotFoundError extends OrchestrationError {
  constructor(
    resource: string,
    identifier: string,
    code: ErrorCode = ErrorCode.NOT_FOUND
  ) {
    super(`${resource} not found: ${identifier}`, {
      code,
      fix: `Verify the ${resource.toLowerCase()} identifier is correct.`,
      retryable: false,
      context: { resource, identifier },
      statusCode: 404,
    });
    this.name = 'NotFoundError';
  }
}

/**
 * Security error for detected security violations.
 */
export class SecurityError extends OrchestrationError {
  constructor(
    message: string,
    fix?: string,
    context?: Record<string, unknown>
  ) {
    const metadata: Partial<ErrorMetadata> = {
      code: ErrorCode.SECURITY_ERROR,
      fix: fix ?? 'Remove or escape potentially dangerous content.',
      retryable: false,
      statusCode: 403,
    };
    if (context !== undefined) {
      metadata.context = context;
    }
    super(message, metadata);
    this.name = 'SecurityError';
  }
}

/**
 * Configuration error for invalid service configuration.
 */
export class ConfigurationError extends OrchestrationError {
  constructor(
    message: string,
    fix?: string,
    cause?: Error
  ) {
    super(message, {
      code: ErrorCode.CONFIGURATION_ERROR,
      fix: fix ?? 'Check the configuration settings and environment variables.',
      retryable: false,
      statusCode: 500,
    }, cause);
    this.name = 'ConfigurationError';
  }
}

/**
 * Data integrity error for corrupted or inconsistent data.
 */
export class DataIntegrityError extends OrchestrationError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    const metadata: Partial<ErrorMetadata> = {
      code: ErrorCode.DATA_INTEGRITY_ERROR,
      fix: 'Contact support if this error persists.',
      retryable: false,
      statusCode: 500,
    };
    if (context !== undefined) {
      metadata.context = context;
    }
    super(message, metadata, cause);
    this.name = 'DataIntegrityError';
  }
}

/**
 * Type guard to check if an error is an OrchestrationError.
 */
export function isOrchestrationError(error: unknown): error is OrchestrationError {
  return error instanceof OrchestrationError;
}

/**
 * Wraps an unknown error in an OrchestrationError.
 * Preserves the original error as cause.
 */
export function wrapError(error: unknown, message?: string): OrchestrationError {
  if (isOrchestrationError(error)) {
    return error;
  }

  const cause = error instanceof Error ? error : new Error(String(error));
  
  return new OrchestrationError(
    message ?? cause.message,
    {
      code: ErrorCode.INTERNAL_ERROR,
      fix: 'An unexpected error occurred. Please try again.',
      retryable: true,
      statusCode: 500,
    },
    cause
  );
}

/**
 * Formats an error for logging with full context.
 */
export function formatErrorForLog(error: Error): Record<string, unknown> {
  if (isOrchestrationError(error)) {
    return error.toJSON();
  }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause instanceof Error ? error.cause.message : undefined,
  };
}
