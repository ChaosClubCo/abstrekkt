/**
 * @module schemas
 * @description Zod validation schemas with security constraints
 * @security Implements input validation per OWASP guidelines
 */

import { z } from 'zod';

// ============================================================================
// Constants
// ============================================================================

/** Maximum allowed string length for most text fields */
const MAX_STRING_LENGTH = 10000;

/** Minimum contribution description length */
const MIN_CONTRIBUTION_LENGTH = 10;

/** Maximum contributions per role */
const MAX_CONTRIBUTIONS = 20;

// ============================================================================
// Primitive Schemas
// ============================================================================

/**
 * Safe string schema that prevents excessively long inputs.
 * @security Prevents DoS via oversized inputs
 */
export const SafeStringSchema = z.string()
  .min(1, 'String cannot be empty')
  .max(MAX_STRING_LENGTH, `String cannot exceed ${MAX_STRING_LENGTH} characters`);

/**
 * Non-empty trimmed string.
 */
export const NonEmptyStringSchema = z.string()
  .min(1, 'String cannot be empty')
  .max(MAX_STRING_LENGTH)
  .transform(s => s.trim())
  .refine(s => s.length > 0, 'String cannot be only whitespace');

/**
 * Positive integer schema.
 */
export const PositiveIntSchema = z.number()
  .int('Must be an integer')
  .positive('Must be positive');

// ============================================================================
// Organizational Layer Schema
// ============================================================================

export const OrganizationalLayerSchema = z.enum([
  'Strategy',
  'Design',
  'Engineering',
  'Quality',
  'Growth',
]);

export type OrganizationalLayerType = z.infer<typeof OrganizationalLayerSchema>;

// ============================================================================
// Role Schemas
// ============================================================================

export const RoleNameSchema = z.enum([
  'Visionary',
  'Product Manager',
  'Technical Architect',
  'UX Designer',
  'Security Analyst',
  'Frontend Developer',
  'Backend Developer',
  'QA Engineer',
  'DevOps Engineer',
  'Data Analyst',
  'Growth Strategist',
]);

export type RoleNameType = z.infer<typeof RoleNameSchema>;

export const RoleSchema = z.object({
  id: z.number().int().min(1).max(11),
  name: RoleNameSchema,
  layer: OrganizationalLayerSchema,
  focus: z.array(NonEmptyStringSchema).min(1).max(10),
  contributions: z.array(
    z.string()
      .min(MIN_CONTRIBUTION_LENGTH, `Contribution must be at least ${MIN_CONTRIBUTION_LENGTH} characters`)
      .max(500)
  ).min(1).max(MAX_CONTRIBUTIONS),
  description: z.string().min(50).max(2000),
  collaborationPatterns: z.array(NonEmptyStringSchema).min(1).max(10),
}).strict();

export type RoleType = z.infer<typeof RoleSchema>;

// ============================================================================
// RACI Schemas
// ============================================================================

export const RACIAssignmentSchema = z.enum(['R', 'A', 'C', 'I', '-']);

export type RACIAssignmentType = z.infer<typeof RACIAssignmentSchema>;

export const LifecyclePhaseSchema = z.enum([
  'Discovery',
  'Design',
  'Build',
  'Release',
  'Growth',
  'Maintenance',
]);

export type LifecyclePhaseType = z.infer<typeof LifecyclePhaseSchema>;

export const RACIRoleAssignmentSchema = z.object({
  role: RoleNameSchema,
  assignment: RACIAssignmentSchema,
  responsibilities: z.array(NonEmptyStringSchema).min(1).max(10),
}).strict();

export type RACIRoleAssignmentType = z.infer<typeof RACIRoleAssignmentSchema>;

export const PhaseRACISchema = z.object({
  phase: LifecyclePhaseSchema,
  description: z.string().min(20).max(1000),
  deliverables: z.array(NonEmptyStringSchema).min(1).max(20),
  assignments: z.array(RACIRoleAssignmentSchema).min(1).max(11),
  estimatedDuration: z.object({
    min: PositiveIntSchema,
    max: PositiveIntSchema,
  }).refine(d => d.min <= d.max, 'min must be <= max'),
}).strict();

export type PhaseRACIType = z.infer<typeof PhaseRACISchema>;

export const RACIChartSchema = z.object({
  phases: z.array(PhaseRACISchema).length(6),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver format'),
  lastUpdated: z.string().datetime(),
}).strict();

export type RACIChartType = z.infer<typeof RACIChartSchema>;

// ============================================================================
// Prompt Template Schemas
// ============================================================================

export const PromptVariableSchema = z.object({
  name: z.string().min(1).max(50).regex(/^[a-z_][a-z0-9_]*$/i, 'Variable name must be alphanumeric with underscores'),
  description: z.string().min(5).max(200),
  required: z.boolean(),
  defaultValue: z.string().max(1000).optional(),
  example: z.string().max(500).optional(),
}).strict();

export type PromptVariableType = z.infer<typeof PromptVariableSchema>;

export const PromptTemplateSchema = z.object({
  role: RoleNameSchema,
  template: z.string().min(50).max(10000),
  variables: z.array(PromptVariableSchema).min(0).max(20),
  category: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
}).strict();

export type PromptTemplateType = z.infer<typeof PromptTemplateSchema>;

export const PromptVariablesInputSchema = z.record(
  z.string().min(1).max(50),
  z.string().max(MAX_STRING_LENGTH)
);

export type PromptVariablesInputType = z.infer<typeof PromptVariablesInputSchema>;

// ============================================================================
// Roadmap Schemas
// ============================================================================

export const MilestoneStatusSchema = z.enum([
  'planned',
  'in-progress',
  'completed',
  'blocked',
]);

export type MilestoneStatusType = z.infer<typeof MilestoneStatusSchema>;

export const MilestoneSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  status: MilestoneStatusSchema,
  phase: LifecyclePhaseSchema,
  owners: z.array(RoleNameSchema).min(1).max(5),
  dependencies: z.array(z.string().min(1).max(50)).max(10),
}).strict();

export type MilestoneType = z.infer<typeof MilestoneSchema>;

export const RoadmapSchema = z.object({
  milestones: z.array(MilestoneSchema).min(1).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  lastUpdated: z.string().datetime(),
}).strict();

export type RoadmapType = z.infer<typeof RoadmapSchema>;

// ============================================================================
// Board Schemas
// ============================================================================

export const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color');

export const BoardColumnSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  color: HexColorSchema,
  wipLimit: z.number().int().min(1).nullable(),
  phase: LifecyclePhaseSchema.optional(),
}).strict();

export type BoardColumnType = z.infer<typeof BoardColumnSchema>;

export const BoardSetupSchema = z.object({
  columns: z.array(BoardColumnSchema).min(2).max(10),
  defaultView: z.enum(['kanban', 'list', 'calendar']),
  metadata: z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(10).max(500),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
  }).strict(),
}).strict();

export type BoardSetupType = z.infer<typeof BoardSetupSchema>;

// ============================================================================
// Job Description Schemas
// ============================================================================

export const JobDescriptionSchema = z.object({
  role: RoleNameSchema,
  title: z.string().min(5).max(200),
  description: z.string().min(100).max(5000),
  qualifications: z.array(NonEmptyStringSchema).min(3).max(15),
  preferredQualifications: z.array(NonEmptyStringSchema).min(0).max(10),
  responsibilities: z.array(NonEmptyStringSchema).min(3).max(15),
  successMetrics: z.array(NonEmptyStringSchema).min(2).max(10),
}).strict();

export type JobDescriptionType = z.infer<typeof JobDescriptionSchema>;

// ============================================================================
// Presentation Schemas
// ============================================================================

export const SlideTypeSchema = z.enum(['title', 'content', 'section', 'summary']);

export const PresentationSlideSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  notes: z.string().max(2000).optional(),
  type: SlideTypeSchema,
}).strict();

export type PresentationSlideType = z.infer<typeof PresentationSlideSchema>;

export const PresentationTemplateSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(3).max(200),
  audience: z.string().min(3).max(200),
  purpose: z.string().min(10).max(500),
  slides: z.array(PresentationSlideSchema).min(1).max(50),
}).strict();

export type PresentationTemplateType = z.infer<typeof PresentationTemplateSchema>;

// ============================================================================
// MCP Input Schemas
// ============================================================================

export const MCPListRolesInputSchema = z.object({
  layer: OrganizationalLayerSchema.optional(),
}).strict().optional();

export const MCPGetRoleInputSchema = z.object({
  name: RoleNameSchema,
}).strict();

export const MCPGetRACIInputSchema = z.object({
  phase: LifecyclePhaseSchema,
}).strict();

export const MCPGeneratePromptInputSchema = z.object({
  role: RoleNameSchema,
  variables: PromptVariablesInputSchema.optional(),
}).strict();

export const MCPGetMilestoneInputSchema = z.object({
  phase: LifecyclePhaseSchema.optional(),
  status: MilestoneStatusSchema.optional(),
}).strict().optional();

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validates input against a schema and returns typed result.
 * 
 * @param schema - Zod schema to validate against
 * @param input - Input data to validate
 * @returns Validation result with typed data or error details
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string; details: z.ZodIssue[] } {
  const result = schema.safeParse(input);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    error: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '),
    details: result.error.issues,
  };
}

/**
 * Validates and throws on error (for use in trusted contexts).
 */
export function parseInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  return schema.parse(input);
}
