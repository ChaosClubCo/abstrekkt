/**
 * @module @flashfusion/orchestration
 * @description Production-grade AI orchestration library with 11-persona Symphony of Roles
 * @version 1.0.0
 * @license MIT
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Role types
  Role,
  RoleName,
  OrganizationalLayer,
  
  // RACI types
  RACIChart,
  PhaseRACI,
  RACIRoleAssignment,
  RACIAssignment,
  LifecyclePhase,
  
  // Prompt types
  PromptTemplate,
  PromptVariable,
  PromptVariables,
  PromptResult,
  
  // Roadmap types
  Roadmap,
  Milestone,
  MilestoneStatus,
  
  // Board types
  BoardSetup,
  BoardColumn,
  
  // Job types
  JobDescription,
  
  // Presentation types
  PresentationTemplate,
  PresentationSlide,
  
  // Audit types
  AuditLogEntry,
  
  // MCP types
  MCPToolResult,
  HealthCheckResponse,
  MetricsResponse,
} from './types/index.js';

// ============================================================================
// Data Exports
// ============================================================================

// Role data and functions
export {
  ROLE_MATRIX,
  getRoleByName,
  getRoleById,
  getRolesByLayer,
  getAllRoleNames,
  getRolesByAllLayers,
  validateRoleMatrix,
} from './data/roles.js';

// RACI data and functions
export {
  RACI_CHART,
  getRACIForPhase,
  getAccountableForPhase,
  getResponsibleForPhase,
  getRoleAssignment,
  getPhasesForRoleAssignment,
  getTotalDuration,
  validateRACIChart,
} from './data/raci.js';

// Prompt data and functions
export {
  PROMPT_TEMPLATES,
  getTemplateForRole,
  generatePrompt,
  interpolate,
  getTemplateCategories,
  getTemplatesByCategory,
  validateVariables,
} from './data/prompts.js';

// Roadmap data and functions
export {
  ROADMAP,
  getMilestonesByPhase,
  getMilestonesByStatus,
  getMilestonesByOwner,
  getMilestoneById,
  getDependentMilestones,
  getCriticalPath,
  getTotalDuration as getRoadmapDuration,
} from './data/roadmap.js';

// Board data and functions
export {
  BOARD_SETUP,
  getColumnsForPhase,
  getColumnById,
  getTotalWIPLimit,
  getColumnsWithWIPLimits,
  validateBoardSetup,
} from './data/board.js';

// Job description data and functions
export {
  JOB_DESCRIPTIONS,
  getJobDescriptionForRole,
  getAllJobDescriptions,
} from './data/jobs.js';

// Presentation data and functions
export {
  PRESENTATION_TEMPLATES,
  getPresentationById,
  getAllPresentations,
  getPresentationsByAudience,
  getSlide,
} from './data/presentations.js';

// ============================================================================
// Schema Exports
// ============================================================================

export {
  // Primitive schemas
  SafeStringSchema,
  NonEmptyStringSchema,
  PositiveIntSchema,
  
  // Core schemas
  OrganizationalLayerSchema,
  RoleNameSchema,
  RoleSchema,
  RACIAssignmentSchema,
  LifecyclePhaseSchema,
  RACIRoleAssignmentSchema,
  PhaseRACISchema,
  RACIChartSchema,
  
  // Prompt schemas
  PromptVariableSchema,
  PromptTemplateSchema,
  PromptVariablesInputSchema,
  
  // Roadmap schemas
  MilestoneStatusSchema,
  MilestoneSchema,
  RoadmapSchema,
  
  // Board schemas
  HexColorSchema,
  BoardColumnSchema,
  BoardSetupSchema,
  
  // Job schemas
  JobDescriptionSchema,
  
  // Presentation schemas
  SlideTypeSchema,
  PresentationSlideSchema,
  PresentationTemplateSchema,
  
  // MCP input schemas
  MCPListRolesInputSchema,
  MCPGetRoleInputSchema,
  MCPGetRACIInputSchema,
  MCPGeneratePromptInputSchema,
  MCPGetMilestoneInputSchema,
  
  // Validation utilities
  validateInput,
  parseInput,
  
  // Schema types
  type OrganizationalLayerType,
  type RoleNameType,
  type RoleType,
  type RACIAssignmentType,
  type LifecyclePhaseType,
  type RACIRoleAssignmentType,
  type PhaseRACIType,
  type RACIChartType,
  type PromptVariableType,
  type PromptTemplateType,
  type PromptVariablesInputType,
  type MilestoneStatusType,
  type MilestoneType,
  type RoadmapType,
  type BoardColumnType,
  type BoardSetupType,
  type JobDescriptionType,
  type PresentationSlideType,
  type PresentationTemplateType,
} from './schemas.js';

// ============================================================================
// Utility Exports
// ============================================================================

// Security utilities
export {
  deepFreeze,
  isDeepFrozen,
  freezeArray,
  computeIntegrityHash,
  computeIntegrityHashSync,
} from './utils/security.js';

// Sanitization utilities
export {
  EscapeContext,
  escape,
  escapeMultiple,
  validateInput as validateSecurityInput,
  stripHTML,
  truncate,
} from './utils/sanitization.js';

// Logger utilities
export {
  logger,
  configureLogger,
  resetLoggerConfig,
  getLoggerConfig,
  createChildLogger,
  type LogLevel,
  type LogEntry,
  type LoggerConfig,
} from './utils/logger.js';

// Error utilities
export {
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
  type ErrorMetadata,
} from './utils/errors.js';

// ============================================================================
// Version Information
// ============================================================================

/**
 * Library version string.
 */
export const VERSION = '1.0.0';

/**
 * Library metadata.
 */
export const LIBRARY_INFO = {
  name: '@flashfusion/orchestration',
  version: VERSION,
  description: 'Production-grade AI orchestration library',
  roleCount: 11,
  phaseCount: 6,
  templateCount: 11,
} as const;
