/**
 * @module data/raci
 * @description RACI accountability matrix for the 6-phase product lifecycle
 * @security All data structures are deeply frozen to prevent runtime mutation
 */

import type { 
  RACIChart, 
  PhaseRACI, 
  LifecyclePhase, 
  RoleName,
  RACIAssignment,
} from '../types/index.js';
import { deepFreeze } from '../utils/security.js';
import { NotFoundError, ErrorCode } from '../utils/errors.js';

/**
 * Complete RACI chart defining accountability across all lifecycle phases.
 * @security Immutable - modifications throw in strict mode
 */
export const RACI_CHART: RACIChart = deepFreeze({
  version: '1.0.0',
  lastUpdated: '2025-01-01T00:00:00Z',
  phases: [
    {
      phase: 'Discovery',
      description: 'Research and validate product opportunities through user research, market analysis, and stakeholder alignment.',
      deliverables: [
        'User research findings',
        'Market analysis report',
        'Problem statement definition',
        'Initial hypothesis documentation',
        'Stakeholder requirements',
      ],
      estimatedDuration: { min: 2, max: 4 },
      assignments: [
        { role: 'Visionary', assignment: 'A', responsibilities: ['Approve strategic direction', 'Validate market opportunity', 'Align stakeholder expectations'] },
        { role: 'Product Manager', assignment: 'R', responsibilities: ['Lead discovery process', 'Synthesize research findings', 'Define problem statements'] },
        { role: 'Technical Architect', assignment: 'C', responsibilities: ['Assess technical feasibility', 'Identify technical constraints'] },
        { role: 'UX Designer', assignment: 'R', responsibilities: ['Conduct user research', 'Create user personas', 'Map user journeys'] },
        { role: 'Security Analyst', assignment: 'C', responsibilities: ['Identify security requirements', 'Review compliance needs'] },
        { role: 'Frontend Developer', assignment: 'I', responsibilities: ['Stay informed on requirements', 'Provide implementation input'] },
        { role: 'Backend Developer', assignment: 'I', responsibilities: ['Stay informed on requirements', 'Assess data requirements'] },
        { role: 'QA Engineer', assignment: 'I', responsibilities: ['Understand quality requirements', 'Prepare testing approach'] },
        { role: 'DevOps Engineer', assignment: 'I', responsibilities: ['Assess infrastructure needs', 'Plan environment requirements'] },
        { role: 'Data Analyst', assignment: 'R', responsibilities: ['Analyze existing data', 'Define success metrics', 'Establish baselines'] },
        { role: 'Growth Strategist', assignment: 'C', responsibilities: ['Provide market insights', 'Identify growth opportunities'] },
      ],
    },
    {
      phase: 'Design',
      description: 'Create detailed designs, architecture plans, and specifications based on discovery findings.',
      deliverables: [
        'Product specifications',
        'UX/UI designs',
        'Technical architecture document',
        'API specifications',
        'Security design review',
      ],
      estimatedDuration: { min: 3, max: 6 },
      assignments: [
        { role: 'Visionary', assignment: 'I', responsibilities: ['Review design alignment with vision', 'Approve major design decisions'] },
        { role: 'Product Manager', assignment: 'A', responsibilities: ['Approve product specifications', 'Ensure design meets requirements', 'Manage scope decisions'] },
        { role: 'Technical Architect', assignment: 'R', responsibilities: ['Design system architecture', 'Define technical specifications', 'Review integration patterns'] },
        { role: 'UX Designer', assignment: 'R', responsibilities: ['Create detailed UI designs', 'Define interaction patterns', 'Build design system components'] },
        { role: 'Security Analyst', assignment: 'R', responsibilities: ['Conduct threat modeling', 'Review architecture security', 'Define security requirements'] },
        { role: 'Frontend Developer', assignment: 'C', responsibilities: ['Review frontend feasibility', 'Provide component estimates', 'Validate design patterns'] },
        { role: 'Backend Developer', assignment: 'C', responsibilities: ['Review API design', 'Assess database schema', 'Validate integration approach'] },
        { role: 'QA Engineer', assignment: 'C', responsibilities: ['Define test strategy', 'Review testability of designs', 'Identify quality risks'] },
        { role: 'DevOps Engineer', assignment: 'C', responsibilities: ['Review infrastructure requirements', 'Plan deployment architecture', 'Define monitoring strategy'] },
        { role: 'Data Analyst', assignment: 'C', responsibilities: ['Define analytics requirements', 'Plan data instrumentation', 'Design experiment framework'] },
        { role: 'Growth Strategist', assignment: 'I', responsibilities: ['Review growth considerations', 'Provide market feedback on designs'] },
      ],
    },
    {
      phase: 'Build',
      description: 'Implement the designed solution through iterative development, testing, and integration.',
      deliverables: [
        'Working software increments',
        'Unit and integration tests',
        'API implementations',
        'Documentation',
        'Performance benchmarks',
      ],
      estimatedDuration: { min: 6, max: 12 },
      assignments: [
        { role: 'Visionary', assignment: 'I', responsibilities: ['Monitor progress alignment with vision', 'Address strategic blockers'] },
        { role: 'Product Manager', assignment: 'A', responsibilities: ['Approve feature implementations', 'Manage scope and priorities', 'Accept deliverables'] },
        { role: 'Technical Architect', assignment: 'R', responsibilities: ['Guide technical implementation', 'Review code architecture', 'Resolve technical blockers'] },
        { role: 'UX Designer', assignment: 'C', responsibilities: ['Support implementation questions', 'Validate design implementation', 'Refine designs as needed'] },
        { role: 'Security Analyst', assignment: 'R', responsibilities: ['Review code for vulnerabilities', 'Validate security controls', 'Conduct security testing'] },
        { role: 'Frontend Developer', assignment: 'R', responsibilities: ['Implement frontend components', 'Write frontend tests', 'Optimize performance'] },
        { role: 'Backend Developer', assignment: 'R', responsibilities: ['Implement backend services', 'Write backend tests', 'Optimize database queries'] },
        { role: 'QA Engineer', assignment: 'R', responsibilities: ['Execute test plans', 'Report and track defects', 'Validate quality standards'] },
        { role: 'DevOps Engineer', assignment: 'R', responsibilities: ['Maintain CI/CD pipelines', 'Manage development environments', 'Support deployment needs'] },
        { role: 'Data Analyst', assignment: 'C', responsibilities: ['Validate analytics implementation', 'Review data collection', 'Test metrics accuracy'] },
        { role: 'Growth Strategist', assignment: 'I', responsibilities: ['Monitor build progress', 'Prepare growth experiments'] },
      ],
    },
    {
      phase: 'Release',
      description: 'Prepare and execute product release with proper testing, documentation, and deployment.',
      deliverables: [
        'Release candidate',
        'Release notes',
        'Deployment runbook',
        'User documentation',
        'Monitoring dashboards',
      ],
      estimatedDuration: { min: 1, max: 2 },
      assignments: [
        { role: 'Visionary', assignment: 'I', responsibilities: ['Approve release readiness', 'Support launch communications'] },
        { role: 'Product Manager', assignment: 'A', responsibilities: ['Approve release go/no-go', 'Coordinate release communications', 'Manage stakeholder expectations'] },
        { role: 'Technical Architect', assignment: 'C', responsibilities: ['Validate architecture compliance', 'Support release decisions', 'Review deployment plans'] },
        { role: 'UX Designer', assignment: 'C', responsibilities: ['Validate final user experience', 'Support user documentation', 'Review release materials'] },
        { role: 'Security Analyst', assignment: 'R', responsibilities: ['Conduct final security review', 'Validate compliance requirements', 'Approve security sign-off'] },
        { role: 'Frontend Developer', assignment: 'C', responsibilities: ['Support release preparation', 'Address last-minute issues', 'Validate frontend functionality'] },
        { role: 'Backend Developer', assignment: 'C', responsibilities: ['Support release preparation', 'Address last-minute issues', 'Validate backend functionality'] },
        { role: 'QA Engineer', assignment: 'R', responsibilities: ['Execute release testing', 'Validate acceptance criteria', 'Provide quality sign-off'] },
        { role: 'DevOps Engineer', assignment: 'R', responsibilities: ['Execute deployment', 'Monitor release health', 'Manage rollback if needed'] },
        { role: 'Data Analyst', assignment: 'C', responsibilities: ['Validate analytics tracking', 'Prepare monitoring dashboards', 'Define success criteria'] },
        { role: 'Growth Strategist', assignment: 'C', responsibilities: ['Prepare growth campaigns', 'Coordinate launch activities', 'Set growth targets'] },
      ],
    },
    {
      phase: 'Growth',
      description: 'Optimize and scale the product through user acquisition, retention, and feature iteration.',
      deliverables: [
        'Growth experiments',
        'Feature iterations',
        'User acquisition campaigns',
        'Retention programs',
        'Performance optimizations',
      ],
      estimatedDuration: { min: 8, max: 24 },
      assignments: [
        { role: 'Visionary', assignment: 'C', responsibilities: ['Guide strategic growth direction', 'Approve expansion initiatives'] },
        { role: 'Product Manager', assignment: 'R', responsibilities: ['Prioritize growth features', 'Analyze user feedback', 'Define iteration roadmap'] },
        { role: 'Technical Architect', assignment: 'C', responsibilities: ['Support scalability planning', 'Guide performance optimization'] },
        { role: 'UX Designer', assignment: 'R', responsibilities: ['Optimize user experience', 'Design growth experiments', 'Improve conversion flows'] },
        { role: 'Security Analyst', assignment: 'C', responsibilities: ['Monitor security posture', 'Review growth feature security'] },
        { role: 'Frontend Developer', assignment: 'R', responsibilities: ['Implement growth features', 'Optimize frontend performance', 'Support A/B testing'] },
        { role: 'Backend Developer', assignment: 'R', responsibilities: ['Implement growth features', 'Scale backend systems', 'Optimize data processing'] },
        { role: 'QA Engineer', assignment: 'R', responsibilities: ['Test growth features', 'Validate experiment integrity', 'Monitor quality metrics'] },
        { role: 'DevOps Engineer', assignment: 'R', responsibilities: ['Scale infrastructure', 'Optimize deployment frequency', 'Monitor system performance'] },
        { role: 'Data Analyst', assignment: 'R', responsibilities: ['Analyze growth metrics', 'Design experiments', 'Report on user behavior'] },
        { role: 'Growth Strategist', assignment: 'A', responsibilities: ['Own growth strategy', 'Lead acquisition initiatives', 'Drive retention programs'] },
      ],
    },
    {
      phase: 'Maintenance',
      description: 'Sustain product health through bug fixes, security updates, and operational excellence.',
      deliverables: [
        'Bug fixes',
        'Security patches',
        'Performance improvements',
        'Technical debt reduction',
        'Operational documentation',
      ],
      estimatedDuration: { min: 4, max: 52 },
      assignments: [
        { role: 'Visionary', assignment: 'I', responsibilities: ['Monitor product health', 'Guide sunset decisions'] },
        { role: 'Product Manager', assignment: 'A', responsibilities: ['Prioritize maintenance work', 'Balance maintenance vs features', 'Manage user expectations'] },
        { role: 'Technical Architect', assignment: 'R', responsibilities: ['Guide technical debt reduction', 'Plan architecture evolution', 'Review major changes'] },
        { role: 'UX Designer', assignment: 'I', responsibilities: ['Support usability improvements', 'Review UX bug fixes'] },
        { role: 'Security Analyst', assignment: 'R', responsibilities: ['Monitor security alerts', 'Apply security patches', 'Conduct periodic audits'] },
        { role: 'Frontend Developer', assignment: 'R', responsibilities: ['Fix frontend bugs', 'Update dependencies', 'Improve performance'] },
        { role: 'Backend Developer', assignment: 'R', responsibilities: ['Fix backend bugs', 'Update dependencies', 'Optimize database'] },
        { role: 'QA Engineer', assignment: 'R', responsibilities: ['Validate bug fixes', 'Maintain test suites', 'Monitor quality trends'] },
        { role: 'DevOps Engineer', assignment: 'R', responsibilities: ['Maintain infrastructure', 'Update systems', 'Optimize operations'] },
        { role: 'Data Analyst', assignment: 'C', responsibilities: ['Monitor product metrics', 'Identify degradation trends'] },
        { role: 'Growth Strategist', assignment: 'I', responsibilities: ['Monitor growth health', 'Identify revitalization opportunities'] },
      ],
    },
  ],
}) as RACIChart;

/**
 * Gets the RACI assignments for a specific lifecycle phase.
 * 
 * @param phase - The lifecycle phase to look up
 * @returns The phase RACI definition
 * @throws NotFoundError if phase doesn't exist
 */
export function getRACIForPhase(phase: LifecyclePhase): PhaseRACI {
  const phaseData = RACI_CHART.phases.find(p => p.phase === phase);
  
  if (!phaseData) {
    throw new NotFoundError('Phase', phase, ErrorCode.PHASE_NOT_FOUND);
  }
  
  return phaseData;
}

/**
 * Gets the accountable role for a specific phase.
 * 
 * @param phase - The lifecycle phase
 * @returns The role that is accountable (A) for the phase
 */
export function getAccountableForPhase(phase: LifecyclePhase): RoleName {
  const phaseData = getRACIForPhase(phase);
  const accountable = phaseData.assignments.find(a => a.assignment === 'A');
  
  if (!accountable) {
    throw new Error(`No accountable role found for phase ${phase}`);
  }
  
  return accountable.role;
}

/**
 * Gets all roles responsible (R) for a specific phase.
 * 
 * @param phase - The lifecycle phase
 * @returns Array of roles with Responsible assignment
 */
export function getResponsibleForPhase(phase: LifecyclePhase): readonly RoleName[] {
  const phaseData = getRACIForPhase(phase);
  return phaseData.assignments
    .filter(a => a.assignment === 'R')
    .map(a => a.role);
}

/**
 * Gets the assignment for a specific role in a specific phase.
 * 
 * @param role - The role name
 * @param phase - The lifecycle phase
 * @returns The RACI assignment
 */
export function getRoleAssignment(role: RoleName, phase: LifecyclePhase): RACIAssignment {
  const phaseData = getRACIForPhase(phase);
  const assignment = phaseData.assignments.find(a => a.role === role);
  
  return assignment?.assignment ?? '-';
}

/**
 * Gets all phases where a role has a specific assignment.
 * 
 * @param role - The role name
 * @param assignment - The RACI assignment to filter by
 * @returns Array of lifecycle phases
 */
export function getPhasesForRoleAssignment(
  role: RoleName, 
  assignment: RACIAssignment
): readonly LifecyclePhase[] {
  return RACI_CHART.phases
    .filter(p => p.assignments.some(a => a.role === role && a.assignment === assignment))
    .map(p => p.phase);
}

/**
 * Gets the total estimated duration for all phases.
 * 
 * @returns Duration range in weeks
 */
export function getTotalDuration(): { min: number; max: number } {
  return RACI_CHART.phases.reduce(
    (acc, phase) => ({
      min: acc.min + phase.estimatedDuration.min,
      max: acc.max + phase.estimatedDuration.max,
    }),
    { min: 0, max: 0 }
  );
}

/**
 * Validates the RACI chart for completeness and consistency.
 * 
 * @returns Validation result
 */
export function validateRACIChart(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check phase count
  if (RACI_CHART.phases.length !== 6) {
    errors.push(`Expected 6 phases, found ${RACI_CHART.phases.length}`);
  }
  
  // Check each phase
  for (const phase of RACI_CHART.phases) {
    // Must have exactly one Accountable
    const accountableCount = phase.assignments.filter(a => a.assignment === 'A').length;
    if (accountableCount !== 1) {
      errors.push(`Phase ${phase.phase} has ${accountableCount} accountable roles (expected 1)`);
    }
    
    // Must have at least one Responsible
    const responsibleCount = phase.assignments.filter(a => a.assignment === 'R').length;
    if (responsibleCount === 0) {
      errors.push(`Phase ${phase.phase} has no responsible roles`);
    }
    
    // Must have 11 role assignments
    if (phase.assignments.length !== 11) {
      errors.push(`Phase ${phase.phase} has ${phase.assignments.length} assignments (expected 11)`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
