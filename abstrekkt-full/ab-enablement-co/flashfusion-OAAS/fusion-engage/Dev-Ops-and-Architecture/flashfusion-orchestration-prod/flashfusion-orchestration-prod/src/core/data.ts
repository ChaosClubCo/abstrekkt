/**
 * Core data structures with runtime immutability enforcement
 * Fixes: 5 immutability test failures
 */
import { deepFreeze } from '../security/utils.js';
import { Role, RoleType, RACIEntry, RACIType, PromptTemplate } from '../types/index.js';

/**
 * Role matrix defining all available roles
 * Runtime immutable via deepFreeze
 */
const ROLE_MATRIX_MUTABLE: Role[] = [
  {
    name: 'System Coordinator',
    type: RoleType.COORDINATOR,
    description: 'Orchestrates overall system workflow and agent coordination',
    capabilities: ['task_delegation', 'workflow_management', 'conflict_resolution'],
    constraints: ['cannot_execute_tasks', 'requires_consensus_for_major_decisions'],
  },
  {
    name: 'Task Executor',
    type: RoleType.EXECUTOR,
    description: 'Executes assigned tasks and reports results',
    capabilities: ['task_execution', 'result_reporting', 'error_handling'],
    constraints: ['cannot_delegate', 'must_follow_instructions'],
  },
  {
    name: 'Quality Validator',
    type: RoleType.VALIDATOR,
    description: 'Validates outputs against quality criteria',
    capabilities: ['quality_assessment', 'compliance_checking', 'approval_authority'],
    constraints: ['cannot_modify_outputs', 'must_document_rejections'],
  },
  {
    name: 'System Observer',
    type: RoleType.OBSERVER,
    description: 'Monitors system state and provides insights',
    capabilities: ['monitoring', 'metric_collection', 'anomaly_detection'],
    constraints: ['read_only', 'cannot_interfere'],
  },
];

/**
 * RACI chart defining responsibilities
 * Runtime immutable via deepFreeze
 */
const RACI_CHART_MUTABLE: RACIEntry[] = [
  {
    role: 'System Coordinator',
    responsibility: RACIType.ACCOUNTABLE,
    tasks: ['workflow_design', 'agent_assignment', 'conflict_resolution'],
  },
  {
    role: 'Task Executor',
    responsibility: RACIType.RESPONSIBLE,
    tasks: ['task_implementation', 'result_delivery', 'status_reporting'],
  },
  {
    role: 'Quality Validator',
    responsibility: RACIType.CONSULTED,
    tasks: ['quality_review', 'compliance_verification', 'approval_decision'],
  },
  {
    role: 'System Observer',
    responsibility: RACIType.INFORMED,
    tasks: ['metric_monitoring', 'alert_generation', 'report_creation'],
  },
];

/**
 * Prompt templates for different operations
 * Runtime immutable via deepFreeze
 */
const PROMPT_TEMPLATES_MUTABLE: PromptTemplate[] = [
  {
    id: 'task_assignment',
    template:
      'You are a {role}. Your task is to {task}. Context: {context}. Constraints: {constraints}',
    variables: ['role', 'task', 'context', 'constraints'],
    description: 'Template for assigning tasks to agents',
  },
  {
    id: 'quality_validation',
    template:
      'Validate the following output: {output}. Quality criteria: {criteria}. Provide pass/fail and reasoning.',
    variables: ['output', 'criteria'],
    description: 'Template for quality validation',
  },
  {
    id: 'coordination',
    template:
      'Coordinate between agents: {agents}. Goal: {goal}. Current state: {state}. Next steps?',
    variables: ['agents', 'goal', 'state'],
    description: 'Template for agent coordination',
  },
];

/**
 * Export deeply frozen versions (immutable at runtime)
 * These cannot be modified after initialization
 */
export const ROLE_MATRIX = deepFreeze(ROLE_MATRIX_MUTABLE);
export const RACI_CHART = deepFreeze(RACI_CHART_MUTABLE);
export const PROMPT_TEMPLATES = deepFreeze(PROMPT_TEMPLATES_MUTABLE);

/**
 * Helper functions for accessing immutable data
 */
export function getRoleByName(name: string): Role | undefined {
  return ROLE_MATRIX.find((role) => role.name === name);
}

export function getRolesByType(type: RoleType): Role[] {
  return ROLE_MATRIX.filter((role) => role.type === type);
}

export function getRACIByRole(roleName: string): RACIEntry | undefined {
  return RACI_CHART.find((entry) => entry.role === roleName);
}

export function getPromptTemplate(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((template) => template.id === id);
}

/**
 * Validates RACI chart structure
 */
export function validateRACIChart(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check that each role has at least one responsibility
  const roleNames = new Set(ROLE_MATRIX.map((r) => r.name));
  const raciRoles = new Set(RACI_CHART.map((e) => e.role));

  for (const roleName of roleNames) {
    if (!raciRoles.has(roleName)) {
      errors.push(`Role ${roleName} has no RACI assignment`);
    }
  }

  // Check for duplicate role assignments
  const seen = new Set<string>();
  for (const entry of RACI_CHART) {
    const key = `${entry.role}-${entry.responsibility}`;
    if (seen.has(key)) {
      errors.push(`Duplicate RACI assignment: ${key}`);
    }
    seen.add(key);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
