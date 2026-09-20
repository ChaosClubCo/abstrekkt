/**
 * @module utils/logger
 * @description Structured JSON logging for operational observability and compliance
 * @compliance SOC2 CC7.2.1, HIPAA §164.312(b) - Audit Controls
 */

/**
 * Log severity levels following RFC 5424 (Syslog).
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Numeric severity for log level comparison.
 */
const LOG_LEVEL_SEVERITY: Readonly<Record<LogLevel, number>> = Object.freeze({
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
});

/**
 * Structured log entry format for machine parsing.
 * All entries are JSON-serializable for SIEM ingestion.
 */
export interface LogEntry {
  /** ISO 8601 timestamp with timezone */
  timestamp: string;
  /** Log severity level */
  level: LogLevel;
  /** Human-readable message */
  message: string;
  /** Additional structured context */
  context?: Record<string, unknown>;
  /** Error details if applicable */
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  /** Service/module identifier */
  service: string;
  /** Request/correlation ID for distributed tracing */
  requestId?: string;
}

/**
 * Logger configuration options.
 */
export interface LoggerConfig {
  /** Minimum log level to output */
  minLevel: LogLevel;
  /** Service name for log entries */
  service: string;
  /** Whether to include stack traces in error logs */
  includeStacks: boolean;
  /** Custom output function (defaults to console.log) */
  output?: (entry: string) => void;
}

/**
 * Default logger configuration.
 */
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: 'info',
  service: 'flashfusion-orchestration',
  includeStacks: true,
};

/**
 * Current logger configuration.
 */
let currentConfig: LoggerConfig = { ...DEFAULT_CONFIG };

/**
 * Configures the logger with custom settings.
 * 
 * @param config - Partial configuration to merge with defaults
 * 
 * @example
 * ```typescript
 * configureLogger({
 *   minLevel: 'debug',
 *   service: 'mcp-server',
 * });
 * ```
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Resets logger configuration to defaults.
 */
export function resetLoggerConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

/**
 * Gets the current logger configuration.
 */
export function getLoggerConfig(): Readonly<LoggerConfig> {
  return { ...currentConfig };
}

/**
 * Creates a structured log entry.
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: currentConfig.service,
  };

  if (context && Object.keys(context).length > 0) {
    // Redact sensitive fields
    entry.context = redactSensitive(context);
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      ...(currentConfig.includeStacks && error.stack ? { stack: error.stack } : {}),
      ...('code' in error ? { code: String((error as NodeJS.ErrnoException).code) } : {}),
    };
  }

  return entry;
}

/**
 * Redacts sensitive fields from log context.
 * Prevents PII/secrets from appearing in logs.
 */
function redactSensitive(context: Record<string, unknown>): Record<string, unknown> {
  const SENSITIVE_KEYS = new Set([
    'password',
    'secret',
    'token',
    'apiKey',
    'api_key',
    'authorization',
    'auth',
    'credential',
    'ssn',
    'creditCard',
    'credit_card',
  ]);

  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    
    if (SENSITIVE_KEYS.has(lowerKey) || 
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('token')) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      redacted[key] = redactSensitive(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

/**
 * Outputs a log entry if it meets the minimum severity level.
 */
function outputLog(entry: LogEntry): void {
  const entrySeverity = LOG_LEVEL_SEVERITY[entry.level];
  const minSeverity = LOG_LEVEL_SEVERITY[currentConfig.minLevel];

  if (entrySeverity < minSeverity) {
    return;
  }

  const output = currentConfig.output ?? console.log;
  output(JSON.stringify(entry));
}

/**
 * Logs a debug message.
 * Use for detailed diagnostic information during development.
 */
export function debug(
  message: string,
  context?: Record<string, unknown>
): void {
  outputLog(createLogEntry('debug', message, context));
}

/**
 * Logs an informational message.
 * Use for normal operational events.
 */
export function info(
  message: string,
  context?: Record<string, unknown>
): void {
  outputLog(createLogEntry('info', message, context));
}

/**
 * Logs a warning message.
 * Use for unexpected but recoverable situations.
 */
export function warn(
  message: string,
  context?: Record<string, unknown>
): void {
  outputLog(createLogEntry('warn', message, context));
}

/**
 * Logs an error message.
 * Use for errors that require attention.
 */
export function error(
  message: string,
  context?: Record<string, unknown>,
  err?: Error
): void {
  outputLog(createLogEntry('error', message, context, err));
}

/**
 * Creates a child logger with additional context.
 * Useful for request-scoped logging.
 * 
 * @param additionalContext - Context to include in all log entries
 * @returns Logger functions with bound context
 * 
 * @example
 * ```typescript
 * const reqLogger = createChildLogger({ requestId: 'abc123', userId: 'user1' });
 * reqLogger.info('Processing request'); // Includes requestId and userId
 * ```
 */
export function createChildLogger(
  additionalContext: Record<string, unknown>
): {
  debug: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>, err?: Error) => void;
} {
  const mergeContext = (context?: Record<string, unknown>) => ({
    ...additionalContext,
    ...context,
  });

  return {
    debug: (message, context) => debug(message, mergeContext(context)),
    info: (message, context) => info(message, mergeContext(context)),
    warn: (message, context) => warn(message, mergeContext(context)),
    error: (message, context, err) => error(message, mergeContext(context), err),
  };
}

/**
 * Namespace export for convenient access.
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  configure: configureLogger,
  reset: resetLoggerConfig,
  getConfig: getLoggerConfig,
  createChild: createChildLogger,
};
