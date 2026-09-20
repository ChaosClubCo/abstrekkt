/**
 * @module tests/property/invariants.test
 * @description Property-based tests for system invariants
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import {
  ROLE_MATRIX,
  getRoleByName,
  getRoleById,
  getAllRoleNames,
} from '../../src/data/roles.js';
import {
  RACI_CHART,
  getRACIForPhase,
  getAccountableForPhase,
  getResponsibleForPhase,
} from '../../src/data/raci.js';
import { generatePrompt, PROMPT_TEMPLATES } from '../../src/data/prompts.js';
import { escape, EscapeContext, validateInput } from '../../src/utils/sanitization.js';
import { deepFreeze, isDeepFrozen } from '../../src/utils/security.js';
import { SafeStringSchema, PositiveIntSchema } from '../../src/schemas.js';

describe('Role System Invariants', () => {
  const roleNames = getAllRoleNames();
  const roleNameArb = fc.constantFrom(...roleNames);

  it('getRoleByName should return role with matching name', () => {
    fc.assert(
      fc.property(roleNameArb, (name) => {
        const role = getRoleByName(name);
        return role.name === name;
      })
    );
  });

  it('all roles should have unique IDs', () => {
    const ids = ROLE_MATRIX.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('getRoleById should be inverse of getRoleByName for ID', () => {
    fc.assert(
      fc.property(roleNameArb, (name) => {
        const role = getRoleByName(name);
        const roleById = getRoleById(role.id);
        return roleById.name === name;
      })
    );
  });

  it('role IDs should be consecutive from 1 to 11', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 11 }), (id) => {
        const role = getRoleById(id);
        return role.id === id;
      })
    );
  });
});

describe('RACI System Invariants', () => {
  const phases = ['Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'] as const;
  const phaseArb = fc.constantFrom(...phases);

  it('every phase should have exactly one Accountable role', () => {
    fc.assert(
      fc.property(phaseArb, (phase) => {
        const accountable = getAccountableForPhase(phase);
        return typeof accountable === 'string' && accountable.length > 0;
      })
    );
  });

  it('every phase should have at least one Responsible role', () => {
    fc.assert(
      fc.property(phaseArb, (phase) => {
        const responsible = getResponsibleForPhase(phase);
        return responsible.length >= 1;
      })
    );
  });

  it('RACI assignments should be valid values', () => {
    const validAssignments = ['R', 'A', 'C', 'I', '-'];

    for (const phase of RACI_CHART.phases) {
      for (const assignment of phase.assignments) {
        expect(validAssignments).toContain(assignment.assignment);
      }
    }
  });

  it('each phase should have assignments for all 11 roles', () => {
    fc.assert(
      fc.property(phaseArb, (phase) => {
        const phaseRaci = getRACIForPhase(phase);
        return phaseRaci.assignments.length === 11;
      })
    );
  });
});

describe('Prompt Generation Invariants', () => {
  const roleNames = getAllRoleNames();
  const roleNameArb = fc.constantFrom(...roleNames);

  it('generatePrompt should return a valid result structure with empty variables', () => {
    fc.assert(
      fc.property(roleNameArb, (role) => {
        const result = generatePrompt(role, {});
        // May succeed or fail depending on required variables
        // But should always have metadata with role
        return result.metadata?.role === role;
      })
    );
  });

  it('generated prompt metadata should include role', () => {
    fc.assert(
      fc.property(roleNameArb, (role) => {
        const result = generatePrompt(role, {});
        return result.metadata?.role === role;
      })
    );
  });

  it('prompt templates should exist for all roles', () => {
    fc.assert(
      fc.property(roleNameArb, (role) => {
        const template = PROMPT_TEMPLATES.find((t) => t.role === role);
        return template !== undefined;
      })
    );
  });
});

describe('Sanitization Invariants', () => {
  it('escaped HTML should never contain raw script tags', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const escaped = escape(input, EscapeContext.HTML);
        return !escaped.includes('<script') && !escaped.includes('</script>');
      })
    );
  });

  it('escaped HTML should be idempotent on safe strings', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.char().filter((c) => !'<>&"\'/`='.includes(c))),
        (safeInput) => {
          const escaped = escape(safeInput, EscapeContext.HTML);
          return escaped === safeInput;
        }
      )
    );
  });

  it('escaped template should not contain mustache syntax', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const escaped = escape(input, EscapeContext.TEMPLATE);
        return !escaped.includes('{{') && !escaped.includes('}}');
      })
    );
  });

  it('input validation should be consistent', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = validateInput(input, EscapeContext.HTML);
        // Result should have valid and threats properties
        return (
          typeof result.valid === 'boolean' &&
          Array.isArray(result.threats)
        );
      })
    );
  });
});

describe('Deep Freeze Invariants', () => {
  it('deepFreeze should make objects immutable', () => {
    fc.assert(
      fc.property(
        fc.object({ maxDepth: 3 }),
        (obj) => {
          const frozen = deepFreeze(obj);
          return Object.isFrozen(frozen);
        }
      )
    );
  });

  it('isDeepFrozen should return true for frozen objects', () => {
    fc.assert(
      fc.property(
        fc.object({ maxDepth: 2, maxKeys: 5 }),
        (obj) => {
          const frozen = deepFreeze(obj);
          return isDeepFrozen(frozen);
        }
      )
    );
  });

  it('primitives should be considered frozen', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null)),
        (primitive) => {
          return isDeepFrozen(primitive);
        }
      )
    );
  });
});

describe('Schema Validation Invariants', () => {
  it('SafeStringSchema should reject empty strings', () => {
    const result = SafeStringSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('SafeStringSchema should accept non-empty strings up to max length', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 10000 }),
        (str) => {
          const result = SafeStringSchema.safeParse(str);
          return result.success === true;
        }
      )
    );
  });

  it('SafeStringSchema should reject strings exceeding max length', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10001, maxLength: 15000 }),
        (str) => {
          const result = SafeStringSchema.safeParse(str);
          return result.success === false;
        }
      )
    );
  });

  it('PositiveIntSchema should accept positive integers', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000000 }), (n) => {
        const result = PositiveIntSchema.safeParse(n);
        return result.success === true;
      })
    );
  });

  it('PositiveIntSchema should reject non-positive integers', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1000000, max: 0 }), (n) => {
        const result = PositiveIntSchema.safeParse(n);
        return result.success === false;
      })
    );
  });
});

describe('Data Consistency Invariants', () => {
  it('all template roles should be valid role names', () => {
    const validRoleNames = new Set(getAllRoleNames());

    for (const template of PROMPT_TEMPLATES) {
      expect(validRoleNames.has(template.role)).toBe(true);
    }
  });

  it('RACI roles should match ROLE_MATRIX roles', () => {
    const roleNames = new Set(getAllRoleNames());

    for (const phase of RACI_CHART.phases) {
      for (const assignment of phase.assignments) {
        expect(roleNames.has(assignment.role)).toBe(true);
      }
    }
  });

  it('phase count should be exactly 6', () => {
    expect(RACI_CHART.phases.length).toBe(6);
  });

  it('role count should be exactly 11', () => {
    expect(ROLE_MATRIX.length).toBe(11);
  });

  it('template count should be exactly 11', () => {
    expect(PROMPT_TEMPLATES.length).toBe(11);
  });
});
