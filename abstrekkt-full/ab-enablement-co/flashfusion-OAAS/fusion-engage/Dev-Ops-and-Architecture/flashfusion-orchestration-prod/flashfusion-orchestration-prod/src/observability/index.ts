/**
 * Observability: Metrics, logging, health checks, graceful shutdown
 */
import pino from 'pino';
import { Metrics, HealthCheck } from '../types/index.js';
import { globalCircuitBreaker, CircuitState } from '../security/circuit-breaker.js';
import { globalRateLimiter } from '../security/rate-limiter.js';

/**
 * Structured logger with correlation IDs
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
});

/**
 * Metrics collector
 */
class MetricsCollector {
  private startTime = Date.now();
  private toolCalls: Map<string, number> = new Map();
  private latencies: number[] = [];
  private validationErrors = 0;
  private systemErrors = 0;

  recordToolCall(toolName: string): void {
    const count = this.toolCalls.get(toolName) || 0;
    this.toolCalls.set(toolName, count + 1);
  }

  recordLatency(ms: number): void {
    this.latencies.push(ms);
    // Keep only last 1000 samples
    if (this.latencies.length > 1000) {
      this.latencies.shift();
    }
  }

  recordValidationError(): void {
    this.validationErrors++;
  }

  recordSystemError(): void {
    this.systemErrors++;
  }

  getMetrics(): Metrics {
    const sortedLatencies = [...this.latencies].sort((a, b) => a - b);
    const p50 = this.percentile(sortedLatencies, 50);
    const p95 = this.percentile(sortedLatencies, 95);
    const p99 = this.percentile(sortedLatencies, 99);

    const memUsage = process.memoryUsage();

    return {
      uptime: Date.now() - this.startTime,
      toolCalls: Object.fromEntries(this.toolCalls),
      latency: { p50, p95, p99 },
      errors: {
        validation: this.validationErrors,
        system: this.systemErrors,
      },
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        utilization: memUsage.heapUsed / memUsage.heapTotal,
      },
    };
  }

  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((sorted.length * p) / 100) - 1;
    return sorted[Math.max(0, index)] || 0;
  }

  reset(): void {
    this.toolCalls.clear();
    this.latencies = [];
    this.validationErrors = 0;
    this.systemErrors = 0;
  }
}

export const metrics = new MetricsCollector();

/**
 * Health check endpoint
 */
export function getHealthCheck(): HealthCheck {
  const memoryCheck = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal < 0.9;
  const circuitBreakerCheck = globalCircuitBreaker.getState() !== CircuitState.OPEN;
  const rateLimitCheck = globalRateLimiter.getCount() < 90; // 90% of limit

  const allHealthy = memoryCheck && circuitBreakerCheck && rateLimitCheck;

  return {
    status: allHealthy ? 'healthy' : circuitBreakerCheck ? 'degraded' : 'unhealthy',
    checks: {
      memory: memoryCheck,
      circuitBreaker: circuitBreakerCheck,
      rateLimit: rateLimitCheck,
    },
    uptime: metrics.getMetrics().uptime,
    timestamp: Date.now(),
  };
}

/**
 * Graceful shutdown handler
 */
export class ShutdownManager {
  private shutdownHandlers: Array<() => Promise<void>> = [];
  private isShuttingDown = false;

  register(handler: () => Promise<void>): void {
    this.shutdownHandlers.push(handler);
  }

  async shutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    logger.info({ signal }, 'Starting graceful shutdown');

    // Run all shutdown handlers with 10s timeout
    const timeout = setTimeout(() => {
      logger.error('Shutdown timeout exceeded, forcing exit');
      process.exit(1);
    }, 10000);

    try {
      await Promise.all(
        this.shutdownHandlers.map((handler) =>
          handler().catch((err) => logger.error({ err }, 'Shutdown handler failed'))
        )
      );
      clearTimeout(timeout);
      logger.info('Graceful shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Shutdown failed');
      process.exit(1);
    }
  }
}

export const shutdownManager = new ShutdownManager();

// Register signal handlers
if (process.env.NODE_ENV !== 'test') {
  process.on('SIGTERM', () => shutdownManager.shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdownManager.shutdown('SIGINT'));
}

/**
 * Request timing middleware
 */
export function withTiming<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  return fn().finally(() => {
    metrics.recordLatency(Date.now() - start);
  });
}
