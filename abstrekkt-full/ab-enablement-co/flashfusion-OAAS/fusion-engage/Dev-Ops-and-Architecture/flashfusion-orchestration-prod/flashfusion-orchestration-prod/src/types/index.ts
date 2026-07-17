/**
 * Core types for orchestration library with Zod validation
 */
import { z } from 'zod';

/**
 * Role types in the orchestration system
 */
export enum RoleType {
  COORDINATOR = 'COORDINATOR',
  EXECUTOR = 'EXECUTOR',
  VALIDATOR = 'VALIDATOR',
  OBSERVER = 'OBSERVER',
}

/**
 * RACI responsibility types
 */
export enum RACIType {
  RESPONSIBLE = 'RESPONSIBLE', // Does the work
  ACCOUNTABLE = 'ACCOUNTABLE', // Ultimate authority
  CONSULTED = 'CONSULTED', // Provides input
  INFORMED = 'INFORMED', // Kept updated
}

/**
 * Zod schemas for runtime validation
 */
export const RoleSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(RoleType),
  description: z.string().min(1).max(500),
  capabilities: z.array(z.string()).min(1),
  constraints: z.array(z.string()).optional().default([]),
});

export const RACIEntrySchema = z.object({
  role: z.string().min(1).max(100),
  responsibility: z.nativeEnum(RACIType),
  tasks: z.array(z.string()).min(1),
});

export const PromptTemplateSchema = z.object({
  id: z.string().min(1).max(100),
  template: z.string().min(1).max(10000),
  variables: z.array(z.string()),
  description: z.string().optional(),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type Role = z.infer<typeof RoleSchema>;
export type RACIEntry = z.infer<typeof RACIEntrySchema>;
export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;

/**
 * Orchestration context for operations
 */
export interface OrchestrationContext {
  operation: string;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Metrics data structure
 */
export interface Metrics {
  uptime: number;
  toolCalls: Record<string, number>;
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  errors: {
    validation: number;
    system: number;
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    utilization: number;
  };
}

/**
 * Health check result
 */
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: {
    memory: boolean;
    circuitBreaker: boolean;
    rateLimit: boolean;
  };
  uptime: number;
  timestamp: number;
}
