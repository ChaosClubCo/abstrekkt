/**
 * @flashfusion/orchestration
 * Production-grade orchestration library for AI agent coordination
 * 
 * @packageDocumentation
 */

// Core data and types
export {
  ROLE_MATRIX,
  RACI_CHART,
  PROMPT_TEMPLATES,
  getRoleByName,
  getRolesByType,
  getRACIByRole,
  getPromptTemplate,
  validateRACIChart,
} from './core/data.js';

export {
  generatePrompt,
  batchGeneratePrompts,
  validatePromptTemplate,
  type PromptGenerationOptions,
} from './core/prompt.js';

// Types
export {
  RoleType,
  RACIType,
  type Role,
  type RACIEntry,
  type PromptTemplate,
  type OrchestrationContext,
  type Metrics,
  type HealthCheck,
  RoleSchema,
  RACIEntrySchema,
  PromptTemplateSchema,
} from './types/index.js';

// Security
export {
  deepFreeze,
  escapeXSS,
  isDeeplyFrozen,
  validateInputLength,
  sanitizeObjectKeys,
} from './security/utils.js';

export {
  RateLimiter,
  RateLimitError,
  globalRateLimiter,
  expensiveOpRateLimiter,
  type RateLimiterConfig,
} from './security/rate-limiter.js';

export {
  CircuitBreaker,
  CircuitState,
  globalCircuitBreaker,
  type CircuitBreakerConfig,
} from './security/circuit-breaker.js';

// Observability
export {
  logger,
  metrics,
  getHealthCheck,
  shutdownManager,
  withTiming,
  ShutdownManager,
} from './observability/index.js';
