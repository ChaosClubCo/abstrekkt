/**
 * @module data/prompts
 * @description AI prompt templates with secure variable interpolation
 * @security XSS and prompt injection prevention via multi-layer escaping
 */

import type { 
  PromptTemplate, 
  PromptVariables, 
  PromptResult,
  RoleName,
} from '../types/index.js';
import { deepFreeze } from '../utils/security.js';
import { escapeMultiple, EscapeContext, validateInput as validateSecurity } from '../utils/sanitization.js';
import { NotFoundError, ErrorCode } from '../utils/errors.js';

/**
 * Prompt templates for all 11 AI personas.
 * @security Immutable - modifications throw in strict mode
 */
export const PROMPT_TEMPLATES: readonly PromptTemplate[] = deepFreeze([
  {
    role: 'Visionary',
    category: 'strategic-analysis',
    description: 'Strategic market opportunity analysis and vision synthesis',
    template: `As a Strategic Visionary, analyze the following market context and synthesize a compelling product vision.

## Market Context
{{market_data}}

## User Insights
{{user_insights}}

## Strategic Objectives
{{objectives}}

Provide your analysis covering:
1. Market opportunity assessment
2. Competitive positioning strategy
3. Long-term vision (3-5 year horizon)
4. Key success factors and risks
5. Recommended strategic priorities`,
    variables: [
      { name: 'market_data', description: 'Current market trends and data', required: true, example: 'AI market growing 40% YoY, enterprise adoption accelerating' },
      { name: 'user_insights', description: 'Key user research findings', required: true, example: 'Users need faster workflow automation' },
      { name: 'objectives', description: 'Business objectives to achieve', required: false, defaultValue: 'Growth and market leadership', example: 'Achieve 50% market share in 2 years' },
    ],
  },
  {
    role: 'Product Manager',
    category: 'requirements',
    description: 'Product requirements and specification development',
    template: `As a Product Manager, develop comprehensive requirements for the following feature.

## Feature Request
{{feature_request}}

## User Stories
{{user_stories}}

## Technical Constraints
{{constraints}}

Provide detailed requirements including:
1. User acceptance criteria
2. Functional requirements
3. Non-functional requirements (performance, security, accessibility)
4. Dependencies and integrations
5. Priority and timeline recommendations`,
    variables: [
      { name: 'feature_request', description: 'Description of the requested feature', required: true, example: 'Add AI-powered document summarization' },
      { name: 'user_stories', description: 'User stories for the feature', required: true, example: 'As a user, I want to summarize long documents quickly' },
      { name: 'constraints', description: 'Known technical constraints', required: false, defaultValue: 'Standard web application constraints', example: 'Must support offline mode' },
    ],
  },
  {
    role: 'Technical Architect',
    category: 'architecture',
    description: 'System architecture design and technical planning',
    template: `As a Technical Architect, design a system architecture for the following requirements.

## Requirements
{{requirements}}

## Current System
{{current_system}}

## Scalability Needs
{{scalability}}

Provide an architecture proposal covering:
1. High-level system design
2. Component breakdown and responsibilities
3. Data flow and integration patterns
4. Technology stack recommendations with justification
5. Scalability and performance considerations
6. Security architecture and threat mitigations`,
    variables: [
      { name: 'requirements', description: 'System requirements to address', required: true, example: 'Real-time collaboration with 1000+ concurrent users' },
      { name: 'current_system', description: 'Description of existing system', required: false, defaultValue: 'Greenfield project', example: 'Monolithic Node.js application with PostgreSQL' },
      { name: 'scalability', description: 'Scalability requirements', required: false, defaultValue: 'Support 10x current load', example: 'Handle 1M requests per day' },
    ],
  },
  {
    role: 'UX Designer',
    category: 'design',
    description: 'User experience design and usability analysis',
    template: `As a UX Designer, create a user experience design for the following feature.

## Feature Description
{{feature}}

## Target Users
{{users}}

## Design Constraints
{{constraints}}

Provide a comprehensive UX design including:
1. User journey mapping
2. Information architecture
3. Interaction design patterns
4. Accessibility considerations (WCAG 2.1 AA)
5. Design system integration
6. Usability testing recommendations`,
    variables: [
      { name: 'feature', description: 'Feature to design', required: true, example: 'Dashboard for project analytics' },
      { name: 'users', description: 'Target user personas', required: true, example: 'Project managers, team leads, executives' },
      { name: 'constraints', description: 'Design constraints', required: false, defaultValue: 'Follow existing design system', example: 'Must work on mobile devices' },
    ],
  },
  {
    role: 'Security Analyst',
    category: 'security',
    description: 'Security analysis and threat modeling',
    template: `As a Security Analyst, conduct a security assessment for the following system.

## System Description
{{system}}

## Data Classification
{{data_classification}}

## Compliance Requirements
{{compliance}}

Provide a security assessment covering:
1. Threat model (STRIDE analysis)
2. Attack surface identification
3. Vulnerability assessment
4. Security control recommendations
5. Compliance gap analysis
6. Incident response considerations`,
    variables: [
      { name: 'system', description: 'System to analyze', required: true, example: 'User authentication and authorization service' },
      { name: 'data_classification', description: 'Types of data handled', required: true, example: 'PII, financial data, health records' },
      { name: 'compliance', description: 'Compliance frameworks', required: false, defaultValue: 'SOC2, GDPR', example: 'HIPAA, PCI-DSS, SOC2' },
    ],
  },
  {
    role: 'Frontend Developer',
    category: 'implementation',
    description: 'Frontend implementation planning and code review',
    template: `As a Frontend Developer, plan the implementation for the following UI component.

## Component Requirements
{{requirements}}

## Design Specs
{{design}}

## Integration Points
{{integrations}}

Provide an implementation plan covering:
1. Component architecture and file structure
2. State management approach
3. API integration patterns
4. Performance optimization strategies
5. Accessibility implementation (ARIA)
6. Testing strategy (unit, integration, e2e)`,
    variables: [
      { name: 'requirements', description: 'Component requirements', required: true, example: 'Data table with sorting, filtering, pagination' },
      { name: 'design', description: 'Design specifications', required: true, example: 'Figma link or design description' },
      { name: 'integrations', description: 'Backend APIs to integrate', required: false, defaultValue: 'RESTful API', example: 'GraphQL API with real-time subscriptions' },
    ],
  },
  {
    role: 'Backend Developer',
    category: 'implementation',
    description: 'Backend implementation planning and API design',
    template: `As a Backend Developer, plan the implementation for the following service.

## Service Requirements
{{requirements}}

## Data Model
{{data_model}}

## Performance Targets
{{performance}}

Provide an implementation plan covering:
1. API design (endpoints, methods, payloads)
2. Data model and database schema
3. Business logic architecture
4. Error handling strategy
5. Caching and performance optimization
6. Security implementation (auth, validation, rate limiting)`,
    variables: [
      { name: 'requirements', description: 'Service requirements', required: true, example: 'User management API with RBAC' },
      { name: 'data_model', description: 'Data entities and relationships', required: true, example: 'Users, Roles, Permissions, Teams' },
      { name: 'performance', description: 'Performance targets', required: false, defaultValue: '<200ms p95 latency', example: '<100ms p95, 1000 RPS' },
    ],
  },
  {
    role: 'QA Engineer',
    category: 'testing',
    description: 'Test strategy and quality assurance planning',
    template: `As a QA Engineer, develop a test strategy for the following feature.

## Feature Description
{{feature}}

## Acceptance Criteria
{{acceptance_criteria}}

## Risk Areas
{{risks}}

Provide a comprehensive test strategy covering:
1. Test scope and objectives
2. Test types (unit, integration, e2e, performance, security)
3. Test case design (positive, negative, edge cases)
4. Test data requirements
5. Automation approach
6. Quality gates and release criteria`,
    variables: [
      { name: 'feature', description: 'Feature to test', required: true, example: 'Multi-factor authentication flow' },
      { name: 'acceptance_criteria', description: 'Feature acceptance criteria', required: true, example: 'Users can enable/disable MFA, supports TOTP and SMS' },
      { name: 'risks', description: 'Known risk areas', required: false, defaultValue: 'Standard web application risks', example: 'Token expiration edge cases, SMS delivery reliability' },
    ],
  },
  {
    role: 'DevOps Engineer',
    category: 'infrastructure',
    description: 'Infrastructure and deployment planning',
    template: `As a DevOps Engineer, plan the infrastructure for the following deployment.

## Application Description
{{application}}

## Traffic Estimates
{{traffic}}

## Availability Requirements
{{availability}}

Provide an infrastructure plan covering:
1. Infrastructure architecture (compute, storage, networking)
2. Container orchestration and scaling strategy
3. CI/CD pipeline design
4. Monitoring and alerting setup
5. Backup and disaster recovery
6. Cost optimization recommendations`,
    variables: [
      { name: 'application', description: 'Application to deploy', required: true, example: 'Node.js API with PostgreSQL' },
      { name: 'traffic', description: 'Expected traffic patterns', required: true, example: '100k DAU, peak 10x average' },
      { name: 'availability', description: 'Availability SLA target', required: false, defaultValue: '99.9% uptime', example: '99.99% uptime, <1s failover' },
    ],
  },
  {
    role: 'Data Analyst',
    category: 'analytics',
    description: 'Data analysis and metrics definition',
    template: `As a Data Analyst, define analytics requirements for the following feature.

## Feature Description
{{feature}}

## Business Questions
{{questions}}

## Available Data
{{data_sources}}

Provide an analytics plan covering:
1. Key metrics and KPIs
2. Data collection requirements (events, properties)
3. Dashboard and reporting design
4. A/B testing framework
5. Data quality validation
6. Privacy and compliance considerations`,
    variables: [
      { name: 'feature', description: 'Feature to analyze', required: true, example: 'User onboarding flow' },
      { name: 'questions', description: 'Business questions to answer', required: true, example: 'Where do users drop off? What drives activation?' },
      { name: 'data_sources', description: 'Available data sources', required: false, defaultValue: 'Application event logs', example: 'Mixpanel, PostgreSQL, Google Analytics' },
    ],
  },
  {
    role: 'Growth Strategist',
    category: 'growth',
    description: 'Growth strategy and experiment design',
    template: `As a Growth Strategist, develop a growth plan for the following product.

## Product Description
{{product}}

## Current Metrics
{{metrics}}

## Growth Targets
{{targets}}

Provide a growth strategy covering:
1. Acquisition channel strategy
2. Activation optimization tactics
3. Retention and engagement programs
4. Referral and viral loop design
5. Experiment roadmap
6. Resource allocation recommendations`,
    variables: [
      { name: 'product', description: 'Product to grow', required: true, example: 'B2B SaaS project management tool' },
      { name: 'metrics', description: 'Current growth metrics', required: true, example: '10k MAU, 5% MoM growth, 40% retention' },
      { name: 'targets', description: 'Growth targets', required: false, defaultValue: '2x growth in 12 months', example: '100k MAU, 60% retention by Q4' },
    ],
  },
]) as readonly PromptTemplate[];

/**
 * Gets a prompt template for a specific role.
 * 
 * @param role - The role to get the template for
 * @returns The prompt template
 * @throws NotFoundError if template doesn't exist
 */
export function getTemplateForRole(role: RoleName): PromptTemplate {
  const template = PROMPT_TEMPLATES.find(t => t.role === role);
  
  if (!template) {
    throw new NotFoundError('Prompt Template', role, ErrorCode.TEMPLATE_NOT_FOUND);
  }
  
  return template;
}

/**
 * Securely interpolates variables into a template.
 * Applies multi-layer escaping to prevent XSS and prompt injection.
 * 
 * @security Mitigates XSS (CWE-79) and prompt injection attacks
 * 
 * @param template - The template string with {{variable}} placeholders
 * @param variables - The variables to interpolate
 * @returns Interpolated string with escaped variables
 */
export function interpolate(template: string, variables: PromptVariables): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    // Multi-layer escaping: AI prompt injection → Template injection → HTML
    const escaped = escapeMultiple(value, [
      EscapeContext.AI_PROMPT,
      EscapeContext.TEMPLATE,
      EscapeContext.HTML,
    ]);
    
    // Replace all occurrences of the variable
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(pattern, escaped);
  }
  
  return result;
}

/**
 * Generates a prompt for a specific role with provided variables.
 * 
 * @param role - The role to generate a prompt for
 * @param variables - Variables to interpolate into the template
 * @returns The prompt generation result
 */
export function generatePrompt(
  role: RoleName,
  variables: PromptVariables = {}
): PromptResult {
  const template = PROMPT_TEMPLATES.find(t => t.role === role);
  
  if (!template) {
    return {
      success: false,
      error: `No template found for role: ${role}`,
      metadata: {
        role,
        variablesUsed: [],
        variablesMissing: [],
        generatedAt: new Date().toISOString(),
      },
    };
  }
  
  // Validate security of input variables
  const warnings: string[] = [];
  for (const [key, value] of Object.entries(variables)) {
    const validation = validateSecurity(value, EscapeContext.AI_PROMPT);
    if (!validation.valid) {
      warnings.push(`Variable '${key}' contained potentially dangerous content that was sanitized`);
    }
  }
  
  // Build variables with defaults
  const finalVariables: PromptVariables = {};
  const variablesUsed: string[] = [];
  const variablesMissing: string[] = [];
  
  for (const varDef of template.variables) {
    const providedValue = variables[varDef.name];
    if (providedValue !== undefined) {
      finalVariables[varDef.name] = providedValue;
      variablesUsed.push(varDef.name);
    } else if (varDef.defaultValue !== undefined) {
      finalVariables[varDef.name] = varDef.defaultValue;
      variablesUsed.push(varDef.name);
    } else if (varDef.required) {
      variablesMissing.push(varDef.name);
    }
  }
  
  // Check for missing required variables
  if (variablesMissing.length > 0) {
    return {
      success: false,
      error: `Missing required variables: ${variablesMissing.join(', ')}`,
      metadata: {
        role,
        variablesUsed,
        variablesMissing,
        generatedAt: new Date().toISOString(),
      },
    };
  }
  
  // Interpolate the template
  const prompt = interpolate(template.template, finalVariables);
  
  // Build result - construct with all properties at once
  return {
    success: true,
    prompt,
    ...(warnings.length > 0 ? { warnings } : {}),
    metadata: {
      role,
      variablesUsed,
      variablesMissing,
      generatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Gets all available template categories.
 * 
 * @returns Array of unique categories
 */
export function getTemplateCategories(): readonly string[] {
  const categories = new Set(PROMPT_TEMPLATES.map(t => t.category));
  return Array.from(categories).sort();
}

/**
 * Gets templates by category.
 * 
 * @param category - The category to filter by
 * @returns Templates in that category
 */
export function getTemplatesByCategory(category: string): readonly PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(t => t.category === category);
}

/**
 * Validates that a set of variables is complete for a role's template.
 * 
 * @param role - The role to validate against
 * @param variables - The variables to validate
 * @returns Validation result
 */
export function validateVariables(
  role: RoleName,
  variables: PromptVariables
): { valid: boolean; missing: string[]; extra: string[] } {
  const template = getTemplateForRole(role);
  const requiredVars = template.variables.filter(v => v.required && !v.defaultValue);
  const allVars = template.variables.map(v => v.name);
  
  const missing = requiredVars
    .filter(v => variables[v.name] === undefined)
    .map(v => v.name);
  
  const extra = Object.keys(variables)
    .filter(k => !allVars.includes(k));
  
  return {
    valid: missing.length === 0,
    missing,
    extra,
  };
}
