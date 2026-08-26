/**
 * @module types
 * @description TypeScript type definitions for FlashFusion Orchestration
 */

// ============================================================================
// Core Role Types
// ============================================================================

/**
 * Organizational layer hierarchy.
 * Defines the strategic position of each role in the organization.
 */
export type OrganizationalLayer = 
  | 'Strategy'
  | 'Design'
  | 'Engineering'
  | 'Quality'
  | 'Growth';

/**
 * Role definition representing an AI persona in the Symphony of Roles.
 */
export interface Role {
  /** Unique identifier (1-11) */
  readonly id: number;
  /** Role name (e.g., "Visionary", "Product Manager") */
  readonly name: string;
  /** Organizational layer */
  readonly layer: OrganizationalLayer;
  /** Core capabilities and focus areas */
  readonly focus: readonly string[];
  /** Key contributions to the product lifecycle */
  readonly contributions: readonly string[];
  /** Detailed persona description */
  readonly description: string;
  /** Interaction patterns with other roles */
  readonly collaborationPatterns: readonly string[];
}

/**
 * Role names as a union type for type safety.
 */
export type RoleName =
  | 'Visionary'
  | 'Product Manager'
  | 'Technical Architect'
  | 'UX Designer'
  | 'Security Analyst'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'QA Engineer'
  | 'DevOps Engineer'
  | 'Data Analyst'
  | 'Growth Strategist';

// ============================================================================
// RACI Types
// ============================================================================

/**
 * RACI responsibility assignment values.
 */
export type RACIAssignment = 'R' | 'A' | 'C' | 'I' | '-';

/**
 * Product lifecycle phase names.
 */
export type LifecyclePhase =
  | 'Discovery'
  | 'Design'
  | 'Build'
  | 'Release'
  | 'Growth'
  | 'Maintenance';

/**
 * RACI assignment for a specific role in a phase.
 */
export interface RACIRoleAssignment {
  /** Role name */
  readonly role: RoleName;
  /** RACI assignment value */
  readonly assignment: RACIAssignment;
  /** Specific responsibilities in this phase */
  readonly responsibilities: readonly string[];
}

/**
 * Complete RACI definition for a lifecycle phase.
 */
export interface PhaseRACI {
  /** Phase name */
  readonly phase: LifecyclePhase;
  /** Phase description */
  readonly description: string;
  /** Key deliverables for this phase */
  readonly deliverables: readonly string[];
  /** Role assignments for this phase */
  readonly assignments: readonly RACIRoleAssignment[];
  /** Phase duration estimate (in weeks) */
  readonly estimatedDuration: {
    readonly min: number;
    readonly max: number;
  };
}

/**
 * Complete RACI chart structure.
 */
export interface RACIChart {
  /** All lifecycle phases with RACI assignments */
  readonly phases: readonly PhaseRACI[];
  /** Version of the RACI chart */
  readonly version: string;
  /** Last update timestamp */
  readonly lastUpdated: string;
}

// ============================================================================
// Prompt Template Types
// ============================================================================

/**
 * Variable definitions for prompt templates.
 */
export interface PromptVariable {
  /** Variable name (without {{ }}) */
  readonly name: string;
  /** Human-readable description */
  readonly description: string;
  /** Whether the variable is required */
  readonly required: boolean;
  /** Default value if not provided */
  readonly defaultValue?: string;
  /** Example value for documentation */
  readonly example?: string;
}

/**
 * Prompt template definition.
 */
export interface PromptTemplate {
  /** Role this template is for */
  readonly role: RoleName;
  /** Template content with {{ variable }} placeholders */
  readonly template: string;
  /** Variables used in this template */
  readonly variables: readonly PromptVariable[];
  /** Template category (analysis, generation, review, etc.) */
  readonly category: string;
  /** Brief description of template purpose */
  readonly description: string;
}

/**
 * Variables provided for prompt interpolation.
 */
export type PromptVariables = Record<string, string>;

/**
 * Result of prompt generation.
 */
export interface PromptResult {
  /** Whether generation succeeded */
  readonly success: boolean;
  /** Generated prompt (if successful) */
  readonly prompt?: string;
  /** Error message (if failed) */
  readonly error?: string;
  /** Warnings about the generation */
  readonly warnings?: readonly string[];
  /** Metadata about the generation */
  readonly metadata: {
    readonly role: RoleName;
    readonly variablesUsed: readonly string[];
    readonly variablesMissing: readonly string[];
    readonly generatedAt: string;
  };
}

// ============================================================================
// Roadmap Types
// ============================================================================

/**
 * Milestone status values.
 */
export type MilestoneStatus = 'planned' | 'in-progress' | 'completed' | 'blocked';

/**
 * Roadmap milestone definition.
 */
export interface Milestone {
  /** Milestone identifier */
  readonly id: string;
  /** Milestone title */
  readonly title: string;
  /** Detailed description */
  readonly description: string;
  /** Target completion date */
  readonly targetDate: string;
  /** Current status */
  readonly status: MilestoneStatus;
  /** Associated lifecycle phase */
  readonly phase: LifecyclePhase;
  /** Responsible roles */
  readonly owners: readonly RoleName[];
  /** Dependencies on other milestones */
  readonly dependencies: readonly string[];
}

/**
 * Product roadmap structure.
 */
export interface Roadmap {
  /** All milestones */
  readonly milestones: readonly Milestone[];
  /** Roadmap version */
  readonly version: string;
  /** Last update timestamp */
  readonly lastUpdated: string;
}

// ============================================================================
// Board Types (Kanban)
// ============================================================================

/**
 * Board column configuration.
 */
export interface BoardColumn {
  /** Column identifier */
  readonly id: string;
  /** Display name */
  readonly name: string;
  /** Column color (hex) */
  readonly color: string;
  /** WIP limit (null = unlimited) */
  readonly wipLimit: number | null;
  /** Associated lifecycle phase */
  readonly phase?: LifecyclePhase;
}

/**
 * Board configuration.
 */
export interface BoardSetup {
  /** Board columns */
  readonly columns: readonly BoardColumn[];
  /** Default board view */
  readonly defaultView: 'kanban' | 'list' | 'calendar';
  /** Board metadata */
  readonly metadata: {
    readonly name: string;
    readonly description: string;
    readonly version: string;
  };
}

// ============================================================================
// Job Description Types
// ============================================================================

/**
 * Job description for a role.
 */
export interface JobDescription {
  /** Role this job description is for */
  readonly role: RoleName;
  /** Job title */
  readonly title: string;
  /** Full job description */
  readonly description: string;
  /** Required qualifications */
  readonly qualifications: readonly string[];
  /** Preferred qualifications */
  readonly preferredQualifications: readonly string[];
  /** Key responsibilities */
  readonly responsibilities: readonly string[];
  /** Success metrics */
  readonly successMetrics: readonly string[];
}

// ============================================================================
// Presentation Types
// ============================================================================

/**
 * Presentation slide content.
 */
export interface PresentationSlide {
  /** Slide identifier */
  readonly id: string;
  /** Slide title */
  readonly title: string;
  /** Slide content (markdown) */
  readonly content: string;
  /** Speaker notes */
  readonly notes?: string;
  /** Slide type */
  readonly type: 'title' | 'content' | 'section' | 'summary';
}

/**
 * Presentation template.
 */
export interface PresentationTemplate {
  /** Template identifier */
  readonly id: string;
  /** Presentation name */
  readonly name: string;
  /** Target audience */
  readonly audience: string;
  /** Purpose description */
  readonly purpose: string;
  /** Slides in order */
  readonly slides: readonly PresentationSlide[];
}

// ============================================================================
// Audit Types
// ============================================================================

/**
 * Audit log entry for compliance tracking.
 * @compliance SOC2 CC7.2, HIPAA §164.312(b)
 */
export interface AuditLogEntry {
  /** ISO 8601 timestamp */
  readonly timestamp: string;
  /** Actor identifier (user/service) */
  readonly actor: string;
  /** Action performed */
  readonly action: string;
  /** Resource affected */
  readonly resource: string;
  /** Action result */
  readonly result: 'success' | 'failure' | 'partial';
  /** Additional details */
  readonly details?: Record<string, unknown>;
  /** Tamper-proof hash of the entry */
  readonly hash: string;
}

// ============================================================================
// MCP Types
// ============================================================================

/**
 * MCP tool invocation result.
 */
export interface MCPToolResult<T = unknown> {
  /** Whether the invocation succeeded */
  readonly success: boolean;
  /** Result data */
  readonly data?: T;
  /** Error information */
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
}

/**
 * MCP server health check response.
 */
export interface HealthCheckResponse {
  /** Overall health status */
  readonly status: 'healthy' | 'degraded' | 'unhealthy';
  /** Check timestamp */
  readonly timestamp: string;
  /** Server uptime in seconds */
  readonly uptime: number;
  /** Individual health checks */
  readonly checks: {
    readonly server: 'pass' | 'fail';
    readonly dataIntegrity: 'pass' | 'fail';
    readonly memory: 'pass' | 'warn' | 'fail';
  };
  /** Additional details */
  readonly details?: Record<string, unknown>;
}

/**
 * Metrics response structure.
 */
export interface MetricsResponse {
  /** Server uptime in milliseconds */
  readonly uptime: number;
  /** Tool call counts */
  readonly toolCalls: Record<string, number>;
  /** Tool latency percentiles */
  readonly toolLatency: Record<string, {
    readonly p50: number;
    readonly p95: number;
    readonly p99: number;
  }>;
  /** Error counts by tool */
  readonly errors: Record<string, number>;
}
