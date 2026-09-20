/**
 * @module tests/unit/roles.test
 * @description Unit tests for roles data module
 */

import { describe, it, expect } from 'vitest';

import {
  ROLE_MATRIX,
  getRoleByName,
  getRoleById,
  getRolesByLayer,
  getAllRoleNames,
  getRolesByAllLayers,
  validateRoleMatrix,
} from '../../src/data/roles.js';

import { RoleSchema } from '../../src/schemas.js';
import { NotFoundError } from '../../src/utils/errors.js';

describe('ROLE_MATRIX Data Integrity', () => {
  it('should contain exactly 11 roles', () => {
    expect(ROLE_MATRIX.length).toBe(11);
  });

  it('should have unique IDs from 1 to 11', () => {
    const ids = ROLE_MATRIX.map(r => r.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(11);
    
    for (let i = 1; i <= 11; i++) {
      expect(ids).toContain(i);
    }
  });

  it('should have unique names', () => {
    const names = ROLE_MATRIX.map(r => r.name);
    const uniqueNames = new Set(names);
    
    expect(uniqueNames.size).toBe(11);
  });

  it('should have all expected role names', () => {
    const expectedNames = [
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

    const actualNames = ROLE_MATRIX.map(r => r.name);
    
    expectedNames.forEach(name => {
      expect(actualNames).toContain(name);
    });
  });

  it('should have valid organizational layers', () => {
    const validLayers = ['Strategy', 'Design', 'Engineering', 'Quality', 'Growth'];
    
    ROLE_MATRIX.forEach(role => {
      expect(validLayers).toContain(role.layer);
    });
  });

  it('should have all roles pass schema validation', () => {
    ROLE_MATRIX.forEach(role => {
      expect(() => RoleSchema.parse(role)).not.toThrow();
    });
  });

  it('should have non-empty focus arrays', () => {
    ROLE_MATRIX.forEach(role => {
      expect(role.focus.length).toBeGreaterThan(0);
    });
  });

  it('should have contributions meeting minimum length', () => {
    ROLE_MATRIX.forEach(role => {
      role.contributions.forEach(contribution => {
        expect(contribution.length).toBeGreaterThanOrEqual(10);
      });
    });
  });

  it('should have non-empty collaboration patterns', () => {
    ROLE_MATRIX.forEach(role => {
      expect(role.collaborationPatterns.length).toBeGreaterThan(0);
    });
  });

  it('should have descriptions of adequate length', () => {
    ROLE_MATRIX.forEach(role => {
      expect(role.description.length).toBeGreaterThanOrEqual(50);
    });
  });
});

describe('getRoleByName', () => {
  it('should return correct role for valid name', () => {
    const visionary = getRoleByName('Visionary');
    
    expect(visionary.id).toBe(1);
    expect(visionary.name).toBe('Visionary');
    expect(visionary.layer).toBe('Strategy');
  });

  it('should return all roles correctly', () => {
    const allNames = getAllRoleNames();
    
    allNames.forEach(name => {
      const role = getRoleByName(name);
      expect(role.name).toBe(name);
    });
  });

  it('should throw NotFoundError for invalid name', () => {
    expect(() => getRoleByName('InvalidRole' as any)).toThrow(NotFoundError);
  });
});

describe('getRoleById', () => {
  it('should return correct role for valid ID', () => {
    const role = getRoleById(1);
    
    expect(role.id).toBe(1);
    expect(role.name).toBe('Visionary');
  });

  it('should return all roles correctly by ID', () => {
    for (let i = 1; i <= 11; i++) {
      const role = getRoleById(i);
      expect(role.id).toBe(i);
    }
  });

  it('should throw NotFoundError for invalid ID', () => {
    expect(() => getRoleById(0)).toThrow(NotFoundError);
    expect(() => getRoleById(12)).toThrow(NotFoundError);
    expect(() => getRoleById(-1)).toThrow(NotFoundError);
  });
});

describe('getRolesByLayer', () => {
  it('should return roles for Strategy layer', () => {
    const strategyRoles = getRolesByLayer('Strategy');
    
    expect(strategyRoles.length).toBeGreaterThan(0);
    strategyRoles.forEach(role => {
      expect(role.layer).toBe('Strategy');
    });
  });

  it('should return roles for Engineering layer', () => {
    const engineeringRoles = getRolesByLayer('Engineering');
    
    expect(engineeringRoles.length).toBeGreaterThan(0);
    engineeringRoles.forEach(role => {
      expect(role.layer).toBe('Engineering');
    });
  });

  it('should return roles for all layers', () => {
    const layers: Array<'Strategy' | 'Design' | 'Engineering' | 'Quality' | 'Growth'> = [
      'Strategy',
      'Design',
      'Engineering',
      'Quality',
      'Growth',
    ];

    layers.forEach(layer => {
      const roles = getRolesByLayer(layer);
      expect(roles.length).toBeGreaterThan(0);
    });
  });

  it('should return correct count for each layer', () => {
    const layerCounts: Record<string, number> = {};
    
    ROLE_MATRIX.forEach(role => {
      layerCounts[role.layer] = (layerCounts[role.layer] ?? 0) + 1;
    });

    Object.entries(layerCounts).forEach(([layer, expectedCount]) => {
      const roles = getRolesByLayer(layer as any);
      expect(roles.length).toBe(expectedCount);
    });
  });
});

describe('getAllRoleNames', () => {
  it('should return array of 11 role names', () => {
    const names = getAllRoleNames();
    
    expect(names.length).toBe(11);
  });

  it('should return unique names', () => {
    const names = getAllRoleNames();
    const uniqueNames = new Set(names);
    
    expect(uniqueNames.size).toBe(11);
  });

  it('should return names that match ROLE_MATRIX', () => {
    const names = getAllRoleNames();
    const matrixNames = ROLE_MATRIX.map(r => r.name);
    
    expect(names).toEqual(matrixNames);
  });
});

describe('getRolesByAllLayers', () => {
  it('should return a Map with all layers', () => {
    const layerMap = getRolesByAllLayers();
    
    expect(layerMap.size).toBe(5);
    expect(layerMap.has('Strategy')).toBe(true);
    expect(layerMap.has('Design')).toBe(true);
    expect(layerMap.has('Engineering')).toBe(true);
    expect(layerMap.has('Quality')).toBe(true);
    expect(layerMap.has('Growth')).toBe(true);
  });

  it('should contain all roles across all layers', () => {
    const layerMap = getRolesByAllLayers();
    
    let totalRoles = 0;
    layerMap.forEach(roles => {
      totalRoles += roles.length;
    });
    
    expect(totalRoles).toBe(11);
  });
});

describe('validateRoleMatrix', () => {
  it('should return valid for current ROLE_MATRIX', () => {
    const result = validateRoleMatrix();
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('Role Layer Distribution', () => {
  it('Strategy layer should have Visionary, Product Manager, Data Analyst', () => {
    const strategyRoles = getRolesByLayer('Strategy');
    const names = strategyRoles.map(r => r.name);
    
    expect(names).toContain('Visionary');
    expect(names).toContain('Product Manager');
    expect(names).toContain('Data Analyst');
  });

  it('Design layer should have UX Designer', () => {
    const designRoles = getRolesByLayer('Design');
    const names = designRoles.map(r => r.name);
    
    expect(names).toContain('UX Designer');
  });

  it('Engineering layer should have developers and architects', () => {
    const engineeringRoles = getRolesByLayer('Engineering');
    const names = engineeringRoles.map(r => r.name);
    
    expect(names).toContain('Technical Architect');
    expect(names).toContain('Frontend Developer');
    expect(names).toContain('Backend Developer');
    expect(names).toContain('DevOps Engineer');
  });

  it('Quality layer should have QA and Security', () => {
    const qualityRoles = getRolesByLayer('Quality');
    const names = qualityRoles.map(r => r.name);
    
    expect(names).toContain('QA Engineer');
    expect(names).toContain('Security Analyst');
  });

  it('Growth layer should have Growth Strategist', () => {
    const growthRoles = getRolesByLayer('Growth');
    const names = growthRoles.map(r => r.name);
    
    expect(names).toContain('Growth Strategist');
  });
});
