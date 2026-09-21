/**
 * @module mcp/observability
 * @description Metrics collection, health checks, and observability for MCP server
 * @compliance SOC2 CC7.2.1 - System Monitoring
 */

import type { HealthCheckResponse, MetricsResponse } from '../types/index.js';
import { ROLE_MATRIX, validateRoleMatrix } from '../data/roles.js';
import { RACI_CHART, validateRACIChart } from '../data/raci.js';
import { logger } from '../utils/logger.js';

/**
 * Metrics storage for tool invocations.
 */
interface MetricsStore {
  toolCalls: Map<string, number>;
  toolLatency: Map<string, number[]>;
  errors: Map<string, number>;
  startTime: number;
}

/**
 * Global metrics store.
 */
const metrics: MetricsStore = {
  toolCalls: new Map(),
  toolLatency: new Map(),
  errors: new Map(),
  startTime: Date.now(),
};

/**
 * Maximum latency samples to keep per tool (prevent memory leak).
 */
const MAX_LATENCY_SAMPLES = 1000;

/**
 * Records a successful tool invocation with latency.
 */
export function recordToolCall(toolName: string, latencyMs: number): void {
  // Increment call counter
  const currentCount = metrics.toolCalls.get(toolName) ?? 0;
  metrics.toolCalls.set(toolName, currentCount + 1);
  
  // Record latency (with bounded buffer)
  const latencies = metrics.toolLatency.get(toolName) ?? [];
  latencies.push(latencyMs);
  
  // Prevent unbounded growth
  if (latencies.length > MAX_LATENCY_SAMPLES) {
    latencies.shift();
  }
  
  metrics.toolLatency.set(toolName, latencies);
  
  logger.debug('Tool call recorded', { toolName, latencyMs });
}

/**
 * Records a tool error.
 */
export function recordToolError(toolName: string, error: Error): void {
  const currentCount = metrics.errors.get(toolName) ?? 0;
  metrics.errors.set(toolName, currentCount + 1);
  
  logger.error('Tool error recorded', { toolName }, error);
}

/**
 * Calculates percentile from sorted array.
 */
function percentile(sortedArr: readonly number[], p: number): number {
  if (sortedArr.length === 0) return 0;
  
  const index = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, Math.min(index, sortedArr.length - 1))] ?? 0;
}

/**
 * Gets current metrics snapshot.
 */
export function getMetrics(): MetricsResponse {
  const latencyStats: Record<string, { p50: number; p95: number; p99: number }> = {};
  
  for (const [tool, latencies] of metrics.toolLatency.entries()) {
    const sorted = [...latencies].sort((a, b) => a - b);
    latencyStats[tool] = {
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
    };
  }
  
  return {
    uptime: Date.now() - metrics.startTime,
    toolCalls: Object.fromEntries(metrics.toolCalls),
    toolLatency: latencyStats,
    errors: Object.fromEntries(metrics.errors),
  };
}

/**
 * Resets all metrics (useful for testing).
 */
export function resetMetrics(): void {
  metrics.toolCalls.clear();
  metrics.toolLatency.clear();
  metrics.errors.clear();
  metrics.startTime = Date.now();
}

/**
 * Memory usage thresholds (in bytes).
 */
const MEMORY_WARN_THRESHOLD = 256 * 1024 * 1024; // 256 MB
const MEMORY_FAIL_THRESHOLD = 512 * 1024 * 1024; // 512 MB

/**
 * Validates data integrity of core data structures.
 */
function checkDataIntegrity(): boolean {
  try {
    // Validate ROLE_MATRIX
    const roleValidation = validateRoleMatrix();
    if (!roleValidation.valid) {
      logger.error('Role matrix validation failed', { errors: roleValidation.errors });
      return false;
    }
    
    // Validate RACI_CHART
    const raciValidation = validateRACIChart();
    if (!raciValidation.valid) {
      logger.error('RACI chart validation failed', { errors: raciValidation.errors });
      return false;
    }
    
    // Verify data is frozen
    if (!Object.isFrozen(ROLE_MATRIX)) {
      logger.error('ROLE_MATRIX is not frozen');
      return false;
    }
    
    if (!Object.isFrozen(RACI_CHART)) {
      logger.error('RACI_CHART is not frozen');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Data integrity check failed', {}, error as Error);
    return false;
  }
}

/**
 * Checks memory usage status.
 */
function checkMemory(): 'pass' | 'warn' | 'fail' {
  const memoryUsage = process.memoryUsage();
  const heapUsed = memoryUsage.heapUsed;
  
  if (heapUsed > MEMORY_FAIL_THRESHOLD) {
    return 'fail';
  }
  
  if (heapUsed > MEMORY_WARN_THRESHOLD) {
    return 'warn';
  }
  
  return 'pass';
}

/**
 * Performs a comprehensive health check.
 */
export function performHealthCheck(): HealthCheckResponse {
  const memoryUsage = process.memoryUsage();
  const memoryCheck = checkMemory();
  const dataIntegrityCheck = checkDataIntegrity();
  
  const checks = {
    server: 'pass' as const,
    dataIntegrity: dataIntegrityCheck ? 'pass' as const : 'fail' as const,
    memory: memoryCheck,
  };
  
  // Determine overall status
  const hasFail = Object.values(checks).includes('fail');
  const hasWarn = Object.values(checks).includes('warn');
  
  const status = hasFail ? 'unhealthy' : hasWarn ? 'degraded' : 'healthy';
  
  const response: HealthCheckResponse = {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
    details: {
      memoryUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      memoryTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      roleCount: ROLE_MATRIX.length,
      phaseCount: RACI_CHART.phases.length,
      nodeVersion: process.version,
    },
  };
  
  logger.info('Health check completed', { status, checks });
  
  return response;
}

/**
 * Wraps a tool handler with metrics collection.
 */
export function withMetrics<T extends (...args: unknown[]) => Promise<unknown>>(
  toolName: string,
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    const start = performance.now();
    
    try {
      const result = await handler(...args);
      const latency = performance.now() - start;
      recordToolCall(toolName, latency);
      return result;
    } catch (error) {
      recordToolError(toolName, error as Error);
      throw error;
    }
  }) as T;
}
