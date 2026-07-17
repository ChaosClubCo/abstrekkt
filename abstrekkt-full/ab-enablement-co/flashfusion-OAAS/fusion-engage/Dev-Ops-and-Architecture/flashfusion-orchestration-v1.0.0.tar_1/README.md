# @flashfusion/orchestration

Production-grade AI orchestration library implementing the **Symphony of Roles** framework with 11 specialized AI personas, RACI accountability matrices, and secure prompt generation.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [MCP Server](#mcp-server)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

- **11 AI Personas**: Specialized roles across Strategy, Design, Engineering, Quality, and Growth layers
- **RACI Accountability**: Complete accountability matrix for 6 lifecycle phases
- **Secure Prompt Generation**: Multi-layer XSS and injection prevention
- **MCP Server**: Model Context Protocol integration with 11 tools
- **Production Security**: Deep freeze immutability, input validation, audit logging
- **TypeScript First**: Full type safety with Zod runtime validation
- **SOC2/HIPAA Compliant**: Structured logging with PII redaction

## Installation

```bash
npm install @flashfusion/orchestration
```

### Requirements

- Node.js 20+
- TypeScript 5.6+ (for development)

## Quick Start

### Using the Library

```typescript
import {
  ROLE_MATRIX,
  getRoleByName,
  getRACIForPhase,
  generatePrompt,
} from '@flashfusion/orchestration';

// Get all roles
console.log(`Total roles: ${ROLE_MATRIX.length}`);

// Get a specific role
const architect = getRoleByName('Technical Architect');
console.log(`Role: ${architect.name}`);
console.log(`Focus: ${architect.focus.join(', ')}`);

// Get RACI for a phase
const buildPhase = getRACIForPhase('Build');
console.log(`Accountable: ${buildPhase.assignments.find(a => a.assignment === 'A')?.role}`);

// Generate a prompt
const result = generatePrompt('Security Analyst', {
  system: 'E-commerce platform',
  data_classification: 'PII, payment data',
  compliance: 'PCI-DSS, GDPR',
});

if (result.success) {
  console.log(result.prompt);
}
```

### Running the MCP Server

```bash
# Start the MCP server
npx @flashfusion/orchestration

# Or with npm scripts
npm run mcp:start
```

## Architecture

### Symphony of Roles Framework

The library implements 11 specialized AI personas organized by organizational layer:

| Layer | Roles |
|-------|-------|
| **Strategy** | Visionary, Product Manager, Data Analyst |
| **Design** | UX Designer |
| **Engineering** | Technical Architect, Frontend Developer, Backend Developer, DevOps Engineer |
| **Quality** | Security Analyst, QA Engineer |
| **Growth** | Growth Strategist |

### Lifecycle Phases

6 product development phases with RACI accountability:

1. **Discovery** (2-4 weeks) - Research and validation
2. **Design** (3-6 weeks) - Architecture and UX design
3. **Build** (6-12 weeks) - Implementation
4. **Release** (1-2 weeks) - Deployment and launch
5. **Growth** (8-24 weeks) - User acquisition and optimization
6. **Maintenance** (4-52 weeks) - Ongoing support

### Module Structure

```
src/
├── data/           # Core data (roles, RACI, prompts, etc.)
├── mcp/            # MCP server implementation
├── types/          # TypeScript type definitions
├── utils/          # Utilities (security, logging, errors)
├── schemas.ts      # Zod validation schemas
└── index.ts        # Main exports
```

## API Reference

### Roles

```typescript
// Get all roles
ROLE_MATRIX: readonly Role[]

// Get role by name
getRoleByName(name: RoleName): Role

// Get role by ID (1-11)
getRoleById(id: number): Role

// Get roles by organizational layer
getRolesByLayer(layer: OrganizationalLayer): readonly Role[]

// Get all role names
getAllRoleNames(): readonly RoleName[]
```

### RACI

```typescript
// Get full RACI chart
RACI_CHART: RACIChart

// Get RACI for specific phase
getRACIForPhase(phase: LifecyclePhase): PhaseRACI

// Get accountable role for phase
getAccountableForPhase(phase: LifecyclePhase): RoleName

// Get responsible roles for phase
getResponsibleForPhase(phase: LifecyclePhase): readonly RoleName[]

// Get specific role assignment
getRoleAssignment(role: RoleName, phase: LifecyclePhase): RACIAssignment
```

### Prompts

```typescript
// Get all templates
PROMPT_TEMPLATES: readonly PromptTemplate[]

// Get template for role
getTemplateForRole(role: RoleName): PromptTemplate

// Generate prompt with variables
generatePrompt(role: RoleName, variables: PromptVariables): PromptResult

// Validate variables before generation
validateVariables(role: RoleName, variables: PromptVariables): ValidationResult
```

### Validation

```typescript
import { validateInput, parseInput, RoleNameSchema } from '@flashfusion/orchestration';

// Safe validation (returns result object)
const result = validateInput(RoleNameSchema, userInput);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Parse with exception on failure
try {
  const roleName = parseInput(RoleNameSchema, userInput);
} catch (error) {
  console.error('Invalid input');
}
```

## MCP Server

The library includes a Model Context Protocol server with 11 tools:

| Tool | Description |
|------|-------------|
| `list_roles` | List all roles, optionally filtered by layer |
| `get_role` | Get detailed information about a role |
| `get_raci` | Get RACI assignments for a phase |
| `generate_prompt` | Generate AI prompt for a role |
| `get_template` | Get raw prompt template |
| `get_milestones` | Get roadmap milestones |
| `get_critical_path` | Get critical path of milestones |
| `get_board` | Get Kanban board configuration |
| `get_job_description` | Get job description for a role |
| `get_presentation` | Get presentation template |
| `health_check` | Check server health |

### MCP Configuration

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "flashfusion-orchestration": {
      "command": "npx",
      "args": ["@flashfusion/orchestration"]
    }
  }
}
```

## Security

### Security Features

- **Deep Freeze Immutability**: All data structures are recursively frozen to prevent mutation
- **XSS Prevention**: Multi-layer HTML entity encoding
- **Template Injection Prevention**: Variable escaping for `{{ }}` and `${ }` patterns
- **Prompt Injection Detection**: 13 patterns for detecting injection attacks
- **Input Validation**: Zod schemas with length limits and format validation
- **Structured Logging**: JSON logs with automatic PII redaction
- **Audit Trail**: SHA-256 integrity hashes for audit logs

### Security Best Practices

```typescript
import { escape, EscapeContext, validateInput } from '@flashfusion/orchestration';

// Always escape user input before use
const safeInput = escape(userInput, EscapeContext.HTML);

// Validate input before processing
const validation = validateInput(schema, userInput);
if (!validation.success) {
  throw new ValidationError(validation.error);
}
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run security tests only
npm test -- tests/security/

# Run specific test file
npm test -- tests/unit/roles.test.ts
```

### Coverage Requirements

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Deployment

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
USER node
CMD ["node", "dist/mcp/server.js"]
```

### Environment Variables

See [`.env.example`](.env.example) for all configuration options.

Key variables:
- `LOG_LEVEL`: Logging verbosity (debug/info/warn/error)
- `SECURITY_STRICT_MODE`: Enable strict security checks
- `ENABLE_METRICS`: Enable metrics collection

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Submit a pull request

### Code Standards

- TypeScript strict mode
- ESLint with security plugin
- Prettier formatting
- 80% minimum test coverage
- JSDoc comments for public APIs

## License

MIT

## Support

- Documentation: [docs/](docs/)
- Issues: GitHub Issues
- Security: See [SECURITY.md](SECURITY.md)
