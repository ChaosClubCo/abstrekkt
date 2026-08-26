/**
 * @module data/roles
 * @description 11-Persona Symphony of Roles - AI orchestration personas
 * @security All data structures are deeply frozen to prevent runtime mutation
 */

import type { Role, RoleName, OrganizationalLayer } from '../types/index.js';
import { deepFreeze } from '../utils/security.js';
import { NotFoundError, ErrorCode } from '../utils/errors.js';

/**
 * Complete role matrix defining all 11 AI personas.
 * @security Immutable - modifications throw in strict mode
 */
export const ROLE_MATRIX: readonly Role[] = deepFreeze([
  {
    id: 1,
    name: 'Visionary',
    layer: 'Strategy',
    focus: [
      'Strategic direction',
      'Market positioning',
      'Long-term planning',
      'Stakeholder alignment',
      'Innovation leadership',
    ],
    contributions: [
      'Defines product vision and strategic direction for the organization',
      'Identifies market opportunities and competitive positioning strategies',
      'Sets long-term goals aligned with business objectives and growth targets',
      'Communicates vision to stakeholders and ensures alignment across teams',
      'Evaluates emerging trends and technologies for strategic advantage',
    ],
    description: 'The Visionary serves as the strategic compass for product development, setting the long-term direction and ensuring all efforts align with organizational goals. This role bridges business strategy with product execution, translating market opportunities into actionable product roadmaps.',
    collaborationPatterns: [
      'Partners with Product Manager to translate vision into actionable plans',
      'Advises Technical Architect on technology choices supporting strategy',
      'Guides Growth Strategist on market positioning and expansion priorities',
    ],
  },
  {
    id: 2,
    name: 'Product Manager',
    layer: 'Strategy',
    focus: [
      'Feature prioritization',
      'Requirements definition',
      'Stakeholder management',
      'Roadmap planning',
      'User advocacy',
    ],
    contributions: [
      'Translates business requirements into detailed product specifications',
      'Prioritizes features based on user value and business impact metrics',
      'Manages product roadmap and communicates timelines to all stakeholders',
      'Serves as the voice of the customer throughout the development process',
      'Balances technical constraints with business needs for optimal outcomes',
    ],
    description: 'The Product Manager acts as the central hub for product decisions, balancing user needs, business requirements, and technical feasibility. This role owns the product roadmap and ensures clear communication between all stakeholders while maintaining focus on delivering user value.',
    collaborationPatterns: [
      'Works with Visionary to align feature priorities with strategic goals',
      'Collaborates with UX Designer to validate user experience decisions',
      'Coordinates with Engineering roles to assess technical feasibility',
      'Partners with Data Analyst to inform decisions with user metrics',
    ],
  },
  {
    id: 3,
    name: 'Technical Architect',
    layer: 'Engineering',
    focus: [
      'System design',
      'Technology selection',
      'Architecture patterns',
      'Technical debt management',
      'Scalability planning',
    ],
    contributions: [
      'Designs scalable and maintainable system architecture solutions',
      'Evaluates and selects appropriate technologies for project requirements',
      'Establishes architectural patterns and coding standards for the team',
      'Manages technical debt and plans refactoring initiatives strategically',
      'Ensures system design supports security, performance, and scalability',
    ],
    description: 'The Technical Architect provides the technical foundation for product development, designing systems that are scalable, secure, and maintainable. This role makes critical technology decisions and establishes the architectural patterns that guide the development team.',
    collaborationPatterns: [
      'Advises Product Manager on technical feasibility of requirements',
      'Guides Frontend and Backend Developers on implementation patterns',
      'Works with Security Analyst to ensure secure architecture design',
      'Coordinates with DevOps Engineer on infrastructure requirements',
    ],
  },
  {
    id: 4,
    name: 'UX Designer',
    layer: 'Design',
    focus: [
      'User research',
      'Interface design',
      'Usability testing',
      'Design systems',
      'Accessibility',
    ],
    contributions: [
      'Conducts user research to understand needs, behaviors, and pain points',
      'Creates intuitive interface designs that align with user mental models',
      'Develops and maintains design systems for consistent user experience',
      'Ensures accessibility compliance (WCAG) across all product interfaces',
      'Validates designs through usability testing and iterative refinement',
    ],
    description: 'The UX Designer champions the user throughout the product development process, creating intuitive and accessible interfaces that delight users. This role bridges user needs with technical implementation, ensuring the product is both usable and desirable.',
    collaborationPatterns: [
      'Partners with Product Manager to validate user requirements',
      'Works with Frontend Developer to ensure design implementation fidelity',
      'Collaborates with Data Analyst to understand user behavior patterns',
      'Coordinates with QA Engineer to verify accessibility compliance',
    ],
  },
  {
    id: 5,
    name: 'Security Analyst',
    layer: 'Quality',
    focus: [
      'Threat modeling',
      'Security auditing',
      'Compliance verification',
      'Vulnerability assessment',
      'Security architecture',
    ],
    contributions: [
      'Performs threat modeling to identify and mitigate security risks early',
      'Conducts security audits and penetration testing of system components',
      'Ensures compliance with security standards (SOC2, HIPAA, GDPR, etc.)',
      'Reviews code and architecture for security vulnerabilities and flaws',
      'Establishes security policies and best practices for development teams',
    ],
    description: 'The Security Analyst protects the product and its users by identifying and mitigating security risks throughout the development lifecycle. This role ensures compliance with security standards and embeds security thinking into the development culture.',
    collaborationPatterns: [
      'Advises Technical Architect on secure architecture patterns',
      'Reviews Backend Developer code for security vulnerabilities',
      'Works with DevOps Engineer to secure deployment pipelines',
      'Coordinates with QA Engineer on security testing procedures',
    ],
  },
  {
    id: 6,
    name: 'Frontend Developer',
    layer: 'Engineering',
    focus: [
      'UI implementation',
      'Client-side performance',
      'Component architecture',
      'State management',
      'Cross-browser compatibility',
    ],
    contributions: [
      'Implements responsive and performant user interfaces from designs',
      'Builds reusable component libraries for consistent UI development',
      'Optimizes client-side performance for fast load times and interactions',
      'Ensures cross-browser and cross-device compatibility of interfaces',
      'Integrates frontend with backend APIs for seamless data flow',
    ],
    description: 'The Frontend Developer brings designs to life, creating performant and accessible user interfaces that work across devices and browsers. This role bridges design and backend systems, ensuring a seamless user experience.',
    collaborationPatterns: [
      'Works with UX Designer to implement designs with high fidelity',
      'Coordinates with Backend Developer on API contracts and integration',
      'Partners with QA Engineer to resolve frontend-specific issues',
      'Collaborates with Technical Architect on frontend architecture',
    ],
  },
  {
    id: 7,
    name: 'Backend Developer',
    layer: 'Engineering',
    focus: [
      'API development',
      'Database design',
      'Business logic',
      'Performance optimization',
      'Integration patterns',
    ],
    contributions: [
      'Designs and implements robust APIs for frontend and external consumers',
      'Develops efficient database schemas and optimizes query performance',
      'Implements core business logic with proper validation and error handling',
      'Ensures backend scalability and reliability under various load conditions',
      'Integrates with third-party services and manages external dependencies',
    ],
    description: 'The Backend Developer builds the server-side foundation of the product, creating APIs, managing data, and implementing business logic. This role ensures the system is reliable, performant, and secure.',
    collaborationPatterns: [
      'Works with Frontend Developer on API design and data contracts',
      'Coordinates with Technical Architect on system design decisions',
      'Partners with Security Analyst to implement secure coding practices',
      'Collaborates with DevOps Engineer on deployment and monitoring',
    ],
  },
  {
    id: 8,
    name: 'QA Engineer',
    layer: 'Quality',
    focus: [
      'Test strategy',
      'Automated testing',
      'Quality metrics',
      'Regression testing',
      'Bug tracking',
    ],
    contributions: [
      'Develops comprehensive test strategies covering all quality aspects',
      'Creates and maintains automated test suites for continuous validation',
      'Tracks and reports quality metrics to drive improvement initiatives',
      'Performs thorough regression testing before releases to prevent regressions',
      'Collaborates with developers to identify and resolve defects efficiently',
    ],
    description: 'The QA Engineer ensures product quality through systematic testing and validation. This role establishes quality standards, automates testing processes, and provides feedback that improves the overall development process.',
    collaborationPatterns: [
      'Works with Product Manager to define acceptance criteria',
      'Partners with Frontend and Backend Developers on test coverage',
      'Coordinates with DevOps Engineer on CI/CD test integration',
      'Collaborates with Security Analyst on security testing procedures',
    ],
  },
  {
    id: 9,
    name: 'DevOps Engineer',
    layer: 'Engineering',
    focus: [
      'CI/CD pipelines',
      'Infrastructure automation',
      'Monitoring and alerting',
      'Deployment strategies',
      'Incident response',
    ],
    contributions: [
      'Builds and maintains CI/CD pipelines for automated deployments',
      'Implements infrastructure as code for reproducible environments',
      'Sets up monitoring and alerting for proactive issue detection',
      'Designs deployment strategies minimizing downtime and risk',
      'Responds to and resolves production incidents with documented procedures',
    ],
    description: 'The DevOps Engineer bridges development and operations, ensuring smooth deployments and reliable infrastructure. This role automates processes, monitors system health, and maintains the production environment.',
    collaborationPatterns: [
      'Works with Technical Architect on infrastructure design',
      'Partners with Backend Developer on deployment requirements',
      'Coordinates with Security Analyst on infrastructure security',
      'Collaborates with QA Engineer on test environment management',
    ],
  },
  {
    id: 10,
    name: 'Data Analyst',
    layer: 'Strategy',
    focus: [
      'Data analysis',
      'Metrics tracking',
      'User behavior insights',
      'A/B testing',
      'Reporting dashboards',
    ],
    contributions: [
      'Analyzes user behavior data to inform product decisions',
      'Designs and tracks key performance metrics for business objectives',
      'Conducts A/B tests to validate feature hypotheses with data',
      'Creates dashboards and reports for stakeholder visibility',
      'Identifies trends and opportunities through data exploration',
    ],
    description: 'The Data Analyst transforms data into actionable insights that guide product decisions. This role establishes metrics, analyzes user behavior, and provides evidence-based recommendations to stakeholders.',
    collaborationPatterns: [
      'Partners with Product Manager on feature impact analysis',
      'Works with UX Designer to understand user behavior patterns',
      'Coordinates with Growth Strategist on growth metrics',
      'Collaborates with Backend Developer on data instrumentation',
    ],
  },
  {
    id: 11,
    name: 'Growth Strategist',
    layer: 'Growth',
    focus: [
      'User acquisition',
      'Retention strategies',
      'Funnel optimization',
      'Market expansion',
      'Partnership development',
    ],
    contributions: [
      'Develops strategies for sustainable user acquisition and growth',
      'Designs retention programs to reduce churn and increase lifetime value',
      'Optimizes conversion funnels to improve key business metrics',
      'Identifies market expansion opportunities and partnership potential',
      'Experiments with growth tactics and measures their effectiveness',
    ],
    description: 'The Growth Strategist drives sustainable business growth through user acquisition, retention, and market expansion. This role combines data-driven experimentation with strategic thinking to scale the product.',
    collaborationPatterns: [
      'Works with Visionary on market expansion strategies',
      'Partners with Data Analyst on growth metrics and experiments',
      'Coordinates with Product Manager on growth-focused features',
      'Collaborates with UX Designer on onboarding optimization',
    ],
  },
]) as readonly Role[];

/**
 * Gets a role by name.
 * 
 * @param name - The role name to look up
 * @returns The role definition
 * @throws NotFoundError if role doesn't exist
 */
export function getRoleByName(name: RoleName): Role {
  const role = ROLE_MATRIX.find(r => r.name === name);
  
  if (!role) {
    throw new NotFoundError('Role', name, ErrorCode.ROLE_NOT_FOUND);
  }
  
  return role;
}

/**
 * Gets a role by ID.
 * 
 * @param id - The role ID (1-11)
 * @returns The role definition
 * @throws NotFoundError if role doesn't exist
 */
export function getRoleById(id: number): Role {
  const role = ROLE_MATRIX.find(r => r.id === id);
  
  if (!role) {
    throw new NotFoundError('Role', String(id), ErrorCode.ROLE_NOT_FOUND);
  }
  
  return role;
}

/**
 * Gets all roles in a specific organizational layer.
 * 
 * @param layer - The organizational layer to filter by
 * @returns Array of roles in that layer
 */
export function getRolesByLayer(layer: OrganizationalLayer): readonly Role[] {
  return ROLE_MATRIX.filter(r => r.layer === layer);
}

/**
 * Gets all available role names.
 * 
 * @returns Array of all role names
 */
export function getAllRoleNames(): readonly RoleName[] {
  return ROLE_MATRIX.map(r => r.name as RoleName);
}

/**
 * Gets all organizational layers with their roles.
 * 
 * @returns Map of layer to roles
 */
export function getRolesByAllLayers(): ReadonlyMap<OrganizationalLayer, readonly Role[]> {
  const layers: OrganizationalLayer[] = ['Strategy', 'Design', 'Engineering', 'Quality', 'Growth'];
  const map = new Map<OrganizationalLayer, readonly Role[]>();
  
  for (const layer of layers) {
    map.set(layer, getRolesByLayer(layer));
  }
  
  return map;
}

/**
 * Validates that the ROLE_MATRIX is properly configured.
 * Use for runtime integrity checks.
 * 
 * @returns Validation result
 */
export function validateRoleMatrix(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check count
  if (ROLE_MATRIX.length !== 11) {
    errors.push(`Expected 11 roles, found ${ROLE_MATRIX.length}`);
  }
  
  // Check IDs are unique and sequential
  const ids = new Set(ROLE_MATRIX.map(r => r.id));
  if (ids.size !== ROLE_MATRIX.length) {
    errors.push('Role IDs are not unique');
  }
  
  for (let i = 1; i <= 11; i++) {
    if (!ids.has(i)) {
      errors.push(`Missing role with ID ${i}`);
    }
  }
  
  // Check names are unique
  const names = new Set(ROLE_MATRIX.map(r => r.name));
  if (names.size !== ROLE_MATRIX.length) {
    errors.push('Role names are not unique');
  }
  
  // Check each role has required fields
  for (const role of ROLE_MATRIX) {
    if (role.contributions.length === 0) {
      errors.push(`Role ${role.name} has no contributions`);
    }
    if (role.focus.length === 0) {
      errors.push(`Role ${role.name} has no focus areas`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
