/**
 * Core functionality test suite
 */
import { describe, it, expect } from 'vitest';
import {
  ROLE_MATRIX,
  RACI_CHART,
  PROMPT_TEMPLATES,
  getRoleByName,
  getRolesByType,
  getRACIByRole,
  getPromptTemplate,
  validateRACIChart,
} from '../../src/core/data.js';
import {
  generatePrompt,
  batchGeneratePrompts,
  validatePromptTemplate,
} from '../../src/core/prompt.js';
import { RoleType } from '../../src/types/index.js';
import { isDeeplyFrozen } from '../../src/security/utils.js';

describe('Core Data', () => {
  describe('Immutability', () => {
    it('ROLE_MATRIX should be deeply frozen', () => {
      expect(isDeeplyFrozen(ROLE_MATRIX)).toBe(true);
    });

    it('RACI_CHART should be deeply frozen', () => {
      expect(isDeeplyFrozen(RACI_CHART)).toBe(true);
    });

    it('PROMPT_TEMPLATES should be deeply frozen', () => {
      expect(isDeeplyFrozen(PROMPT_TEMPLATES)).toBe(true);
    });

    it('should prevent modification of ROLE_MATRIX', () => {
      expect(() => {
        (ROLE_MATRIX as any).push({ name: 'New Role' });
      }).toThrow();
    });

    it('should prevent modification of nested role properties', () => {
      expect(() => {
        (ROLE_MATRIX[0] as any).name = 'Modified';
      }).toThrow();
    });
  });

  describe('getRoleByName', () => {
    it('should find existing role', () => {
      const role = getRoleByName('System Coordinator');
      expect(role).toBeDefined();
      expect(role?.name).toBe('System Coordinator');
    });

    it('should return undefined for non-existent role', () => {
      const role = getRoleByName('NonExistent');
      expect(role).toBeUndefined();
    });
  });

  describe('getRolesByType', () => {
    it('should return roles of specified type', () => {
      const coordinators = getRolesByType(RoleType.COORDINATOR);
      expect(coordinators.length).toBeGreaterThan(0);
      expect(coordinators.every((r) => r.type === RoleType.COORDINATOR)).toBe(true);
    });

    it('should return empty array for type with no roles', () => {
      // All types should have at least one role in our test data
      const observers = getRolesByType(RoleType.OBSERVER);
      expect(Array.isArray(observers)).toBe(true);
    });
  });

  describe('getRACIByRole', () => {
    it('should find RACI entry for role', () => {
      const entry = getRACIByRole('System Coordinator');
      expect(entry).toBeDefined();
      expect(entry?.role).toBe('System Coordinator');
    });

    it('should return undefined for non-existent role', () => {
      const entry = getRACIByRole('NonExistent');
      expect(entry).toBeUndefined();
    });
  });

  describe('validateRACIChart', () => {
    it('should validate correct RACI chart', () => {
      const result = validateRACIChart();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe('Prompt Generation', () => {
  describe('generatePrompt', () => {
    it('should generate prompt from template', () => {
      const result = generatePrompt({
        templateId: 'task_assignment',
        variables: {
          role: 'Coordinator',
          task: 'Review code',
          context: 'PR #123',
          constraints: 'Must complete today',
        },
      });

      expect(result).toContain('Coordinator');
      expect(result).toContain('Review code');
      expect(result).toContain('PR #123');
      expect(result).toContain('Must complete today');
    });

    it('should escape XSS by default', () => {
      const result = generatePrompt({
        templateId: 'task_assignment',
        variables: {
          role: '<script>alert("xss")</script>',
          task: 'Normal task',
          context: 'Normal context',
          constraints: 'Normal constraints',
        },
      });

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should allow disabling XSS escaping', () => {
      const result = generatePrompt({
        templateId: 'task_assignment',
        variables: {
          role: '<b>Bold</b>',
          task: 'Task',
          context: 'Context',
          constraints: 'Constraints',
        },
        escapeXSS: false,
      });

      expect(result).toContain('<b>Bold</b>');
    });

    it('should throw on missing template', () => {
      expect(() =>
        generatePrompt({
          templateId: 'nonexistent',
          variables: {},
        })
      ).toThrow('Template not found');
    });

    it('should throw on missing variables', () => {
      expect(() =>
        generatePrompt({
          templateId: 'task_assignment',
          variables: { role: 'Test' }, // Missing other required vars
        })
      ).toThrow('Missing variables');
    });

    it('should enforce max length', () => {
      const longString = 'a'.repeat(20000);
      expect(() =>
        generatePrompt({
          templateId: 'task_assignment',
          variables: {
            role: longString,
            task: 'task',
            context: 'context',
            constraints: 'constraints',
          },
        })
      ).toThrow('exceeds maximum length');
    });
  });

  describe('batchGeneratePrompts', () => {
    it('should generate multiple prompts', () => {
      const results = batchGeneratePrompts([
        {
          templateId: 'task_assignment',
          variables: {
            role: 'Role1',
            task: 'Task1',
            context: 'Context1',
            constraints: 'Constraints1',
          },
        },
        {
          templateId: 'quality_validation',
          variables: {
            output: 'Output1',
            criteria: 'Criteria1',
          },
        },
      ]);

      expect(results).toHaveLength(2);
      expect(results[0]).toContain('Role1');
      expect(results[1]).toContain('Output1');
    });
  });

  describe('validatePromptTemplate', () => {
    it('should validate correct template', () => {
      const result = validatePromptTemplate({
        id: 'test',
        template: 'Test {var}',
        variables: ['var'],
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid template', () => {
      const result = validatePromptTemplate({
        id: '', // Empty ID
        template: 'Test',
        variables: [],
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
