/**
 * @module tests/unit/schemas.test
 * @description Unit tests for Zod validation schemas
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import {
  SafeStringSchema,
  NonEmptyStringSchema,
  PositiveIntSchema,
  OrganizationalLayerSchema,
  RoleNameSchema,
  RoleSchema,
  RACIAssignmentSchema,
  LifecyclePhaseSchema,
  RACIRoleAssignmentSchema,
  PhaseRACISchema,
  PromptVariableSchema,
  PromptTemplateSchema,
  MilestoneStatusSchema,
  MilestoneSchema,
  HexColorSchema,
  BoardColumnSchema,
  JobDescriptionSchema,
  PresentationSlideSchema,
  validateInput,
  parseInput,
} from '../../src/schemas.js';

describe('Primitive Schemas', () => {
  describe('SafeStringSchema', () => {
    it('should accept valid strings', () => {
      expect(SafeStringSchema.parse('Hello')).toBe('Hello');
      expect(SafeStringSchema.parse('a')).toBe('a');
    });

    it('should reject empty strings', () => {
      expect(() => SafeStringSchema.parse('')).toThrow();
    });

    it('should reject strings exceeding max length', () => {
      const longString = 'a'.repeat(10001);
      expect(() => SafeStringSchema.parse(longString)).toThrow();
    });

    it('should accept strings at max length', () => {
      const maxString = 'a'.repeat(10000);
      expect(SafeStringSchema.parse(maxString)).toBe(maxString);
    });
  });

  describe('NonEmptyStringSchema', () => {
    it('should trim whitespace', () => {
      expect(NonEmptyStringSchema.parse('  hello  ')).toBe('hello');
    });

    it('should reject whitespace-only strings', () => {
      expect(() => NonEmptyStringSchema.parse('   ')).toThrow();
    });
  });

  describe('PositiveIntSchema', () => {
    it('should accept positive integers', () => {
      expect(PositiveIntSchema.parse(1)).toBe(1);
      expect(PositiveIntSchema.parse(100)).toBe(100);
    });

    it('should reject zero', () => {
      expect(() => PositiveIntSchema.parse(0)).toThrow();
    });

    it('should reject negative numbers', () => {
      expect(() => PositiveIntSchema.parse(-1)).toThrow();
    });

    it('should reject floats', () => {
      expect(() => PositiveIntSchema.parse(1.5)).toThrow();
    });
  });
});

describe('Enum Schemas', () => {
  describe('OrganizationalLayerSchema', () => {
    const validLayers = ['Strategy', 'Design', 'Engineering', 'Quality', 'Growth'];

    validLayers.forEach((layer) => {
      it(`should accept valid layer: ${layer}`, () => {
        expect(OrganizationalLayerSchema.parse(layer)).toBe(layer);
      });
    });

    it('should reject invalid layers', () => {
      expect(() => OrganizationalLayerSchema.parse('Invalid')).toThrow();
      expect(() => OrganizationalLayerSchema.parse('strategy')).toThrow(); // case sensitive
    });
  });

  describe('RoleNameSchema', () => {
    const validRoles = [
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
    ];

    validRoles.forEach((role) => {
      it(`should accept valid role: ${role}`, () => {
        expect(RoleNameSchema.parse(role)).toBe(role);
      });
    });

    it('should reject invalid roles', () => {
      expect(() => RoleNameSchema.parse('Hacker')).toThrow();
    });
  });

  describe('LifecyclePhaseSchema', () => {
    const validPhases = ['Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'];

    validPhases.forEach((phase) => {
      it(`should accept valid phase: ${phase}`, () => {
        expect(LifecyclePhaseSchema.parse(phase)).toBe(phase);
      });
    });

    it('should reject invalid phases', () => {
      expect(() => LifecyclePhaseSchema.parse('Planning')).toThrow();
    });
  });

  describe('RACIAssignmentSchema', () => {
    const validAssignments = ['R', 'A', 'C', 'I', '-'];

    validAssignments.forEach((assignment) => {
      it(`should accept valid assignment: ${assignment}`, () => {
        expect(RACIAssignmentSchema.parse(assignment)).toBe(assignment);
      });
    });

    it('should reject invalid assignments', () => {
      expect(() => RACIAssignmentSchema.parse('X')).toThrow();
      expect(() => RACIAssignmentSchema.parse('r')).toThrow(); // case sensitive
    });
  });

  describe('MilestoneStatusSchema', () => {
    const validStatuses = ['planned', 'in-progress', 'completed', 'blocked'];

    validStatuses.forEach((status) => {
      it(`should accept valid status: ${status}`, () => {
        expect(MilestoneStatusSchema.parse(status)).toBe(status);
      });
    });
  });
});

describe('Complex Schemas', () => {
  describe('RoleSchema', () => {
    const validRole = {
      id: 1,
      name: 'Visionary',
      layer: 'Strategy',
      focus: ['Strategic direction', 'Market positioning'],
      contributions: [
        'Defines product vision and strategic direction for the organization',
        'Identifies market opportunities and competitive positioning strategies',
      ],
      description: 'The Visionary serves as the strategic compass for product development, setting the long-term direction.',
      collaborationPatterns: ['Partners with Product Manager'],
    };

    it('should accept valid role', () => {
      expect(() => RoleSchema.parse(validRole)).not.toThrow();
    });

    it('should reject role with invalid id', () => {
      expect(() => RoleSchema.parse({ ...validRole, id: 0 })).toThrow();
      expect(() => RoleSchema.parse({ ...validRole, id: 12 })).toThrow();
    });

    it('should reject role with empty focus', () => {
      expect(() => RoleSchema.parse({ ...validRole, focus: [] })).toThrow();
    });

    it('should reject contributions below minimum length', () => {
      expect(() => RoleSchema.parse({
        ...validRole,
        contributions: ['Short'],
      })).toThrow();
    });

    it('should reject extra properties (strict mode)', () => {
      expect(() => RoleSchema.parse({
        ...validRole,
        extraField: 'not allowed',
      })).toThrow();
    });
  });

  describe('PromptVariableSchema', () => {
    it('should accept valid variable definition', () => {
      const variable = {
        name: 'market_data',
        description: 'Current market trends',
        required: true,
        defaultValue: 'N/A',
        example: 'AI market growing 40% YoY',
      };

      expect(() => PromptVariableSchema.parse(variable)).not.toThrow();
    });

    it('should reject invalid variable names', () => {
      expect(() => PromptVariableSchema.parse({
        name: '123invalid',
        description: 'Invalid name',
        required: true,
      })).toThrow();

      expect(() => PromptVariableSchema.parse({
        name: 'has-dash',
        description: 'Invalid name',
        required: true,
      })).toThrow();
    });

    it('should accept valid variable names', () => {
      const validNames = ['market_data', 'user123', '_private', 'camelCase'];

      validNames.forEach((name) => {
        expect(() => PromptVariableSchema.parse({
          name,
          description: 'Valid variable',
          required: true,
        })).not.toThrow();
      });
    });
  });

  describe('HexColorSchema', () => {
    it('should accept valid hex colors', () => {
      expect(HexColorSchema.parse('#FF0000')).toBe('#FF0000');
      expect(HexColorSchema.parse('#ffffff')).toBe('#ffffff');
      expect(HexColorSchema.parse('#123ABC')).toBe('#123ABC');
    });

    it('should reject invalid hex colors', () => {
      expect(() => HexColorSchema.parse('FF0000')).toThrow(); // missing #
      expect(() => HexColorSchema.parse('#FFF')).toThrow(); // too short
      expect(() => HexColorSchema.parse('#GGGGGG')).toThrow(); // invalid chars
    });
  });

  describe('MilestoneSchema', () => {
    const validMilestone = {
      id: 'ms-001',
      title: 'User Research Complete',
      description: 'Complete initial user research including interviews',
      targetDate: '2025-02-15',
      status: 'completed',
      phase: 'Discovery',
      owners: ['Product Manager', 'UX Designer'],
      dependencies: [],
    };

    it('should accept valid milestone', () => {
      expect(() => MilestoneSchema.parse(validMilestone)).not.toThrow();
    });

    it('should reject invalid date format', () => {
      expect(() => MilestoneSchema.parse({
        ...validMilestone,
        targetDate: '02/15/2025',
      })).toThrow();
    });

    it('should require at least one owner', () => {
      expect(() => MilestoneSchema.parse({
        ...validMilestone,
        owners: [],
      })).toThrow();
    });
  });

  describe('PhaseRACISchema', () => {
    const validPhaseRACI = {
      phase: 'Discovery',
      description: 'Research and validate product opportunities',
      deliverables: ['User research findings', 'Market analysis report'],
      estimatedDuration: { min: 2, max: 4 },
      assignments: [
        {
          role: 'Product Manager',
          assignment: 'R',
          responsibilities: ['Lead discovery process'],
        },
      ],
    };

    it('should accept valid phase RACI', () => {
      expect(() => PhaseRACISchema.parse(validPhaseRACI)).not.toThrow();
    });

    it('should reject invalid duration (min > max)', () => {
      expect(() => PhaseRACISchema.parse({
        ...validPhaseRACI,
        estimatedDuration: { min: 5, max: 2 },
      })).toThrow();
    });
  });
});

describe('Validation Utilities', () => {
  describe('validateInput', () => {
    it('should return success for valid input', () => {
      const result = validateInput(RoleNameSchema, 'Visionary');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Visionary');
      }
    });

    it('should return error for invalid input', () => {
      const result = validateInput(RoleNameSchema, 'InvalidRole');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.details).toBeDefined();
        expect(result.details.length).toBeGreaterThan(0);
      }
    });
  });

  describe('parseInput', () => {
    it('should return parsed data for valid input', () => {
      const result = parseInput(PositiveIntSchema, 42);
      expect(result).toBe(42);
    });

    it('should throw for invalid input', () => {
      expect(() => parseInput(PositiveIntSchema, -1)).toThrow();
    });
  });
});

describe('Edge Cases', () => {
  describe('Boundary values', () => {
    it('should handle minimum contribution length', () => {
      const minLengthContribution = 'a'.repeat(10);
      const role = {
        id: 1,
        name: 'Visionary',
        layer: 'Strategy',
        focus: ['Focus area'],
        contributions: [minLengthContribution],
        description: 'A'.repeat(50),
        collaborationPatterns: ['Pattern'],
      };

      expect(() => RoleSchema.parse(role)).not.toThrow();
    });

    it('should reject contribution just below minimum', () => {
      const shortContribution = 'a'.repeat(9);
      const role = {
        id: 1,
        name: 'Visionary',
        layer: 'Strategy',
        focus: ['Focus area'],
        contributions: [shortContribution],
        description: 'A'.repeat(50),
        collaborationPatterns: ['Pattern'],
      };

      expect(() => RoleSchema.parse(role)).toThrow();
    });
  });

  describe('Null and undefined handling', () => {
    it('should handle optional fields correctly', () => {
      const variable = {
        name: 'test_var',
        description: 'Test variable',
        required: false,
        // defaultValue and example are optional
      };

      expect(() => PromptVariableSchema.parse(variable)).not.toThrow();
    });
  });
});
