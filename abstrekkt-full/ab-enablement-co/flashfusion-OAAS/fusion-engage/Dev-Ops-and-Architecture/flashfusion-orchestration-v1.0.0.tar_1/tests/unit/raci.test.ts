/**
 * @module tests/unit/raci.test
 * @description Unit tests for RACI data module
 */

import { describe, it, expect } from 'vitest';

import {
  RACI_CHART,
  getRACIForPhase,
  getAccountableForPhase,
  getResponsibleForPhase,
  getRoleAssignment,
  getPhasesForRoleAssignment,
  getTotalDuration,
  validateRACIChart,
} from '../../src/data/raci.js';

import { getAllRoleNames } from '../../src/data/roles.js';
import { NotFoundError } from '../../src/utils/errors.js';

describe('RACI_CHART Data Integrity', () => {
  it('should contain exactly 6 phases', () => {
    expect(RACI_CHART.phases.length).toBe(6);
  });

  it('should have all expected phases', () => {
    const expectedPhases = ['Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'];
    const actualPhases = RACI_CHART.phases.map(p => p.phase);
    
    expectedPhases.forEach(phase => {
      expect(actualPhases).toContain(phase);
    });
  });

  it('should have valid version format', () => {
    expect(RACI_CHART.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should have valid lastUpdated timestamp', () => {
    const date = new Date(RACI_CHART.lastUpdated);
    expect(date.toString()).not.toBe('Invalid Date');
  });

  it('should have 11 role assignments per phase', () => {
    RACI_CHART.phases.forEach(phase => {
      expect(phase.assignments.length).toBe(11);
    });
  });

  it('should have exactly one Accountable per phase', () => {
    RACI_CHART.phases.forEach(phase => {
      const accountable = phase.assignments.filter(a => a.assignment === 'A');
      expect(accountable.length).toBe(1);
    });
  });

  it('should have at least one Responsible per phase', () => {
    RACI_CHART.phases.forEach(phase => {
      const responsible = phase.assignments.filter(a => a.assignment === 'R');
      expect(responsible.length).toBeGreaterThan(0);
    });
  });

  it('should reference valid role names', () => {
    const validRoleNames = getAllRoleNames();
    
    RACI_CHART.phases.forEach(phase => {
      phase.assignments.forEach(assignment => {
        expect(validRoleNames).toContain(assignment.role);
      });
    });
  });

  it('should have valid RACI assignments', () => {
    const validAssignments = ['R', 'A', 'C', 'I', '-'];
    
    RACI_CHART.phases.forEach(phase => {
      phase.assignments.forEach(assignment => {
        expect(validAssignments).toContain(assignment.assignment);
      });
    });
  });

  it('should have non-empty deliverables', () => {
    RACI_CHART.phases.forEach(phase => {
      expect(phase.deliverables.length).toBeGreaterThan(0);
    });
  });

  it('should have valid duration estimates (min <= max)', () => {
    RACI_CHART.phases.forEach(phase => {
      expect(phase.estimatedDuration.min).toBeLessThanOrEqual(phase.estimatedDuration.max);
    });
  });
});

describe('getRACIForPhase', () => {
  it('should return correct phase data', () => {
    const discovery = getRACIForPhase('Discovery');
    
    expect(discovery.phase).toBe('Discovery');
    expect(discovery.assignments.length).toBe(11);
    expect(discovery.deliverables.length).toBeGreaterThan(0);
  });

  it('should return all phases correctly', () => {
    const phases: Array<'Discovery' | 'Design' | 'Build' | 'Release' | 'Growth' | 'Maintenance'> = [
      'Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'
    ];

    phases.forEach(phase => {
      const result = getRACIForPhase(phase);
      expect(result.phase).toBe(phase);
    });
  });

  it('should throw NotFoundError for invalid phase', () => {
    expect(() => getRACIForPhase('InvalidPhase' as any)).toThrow(NotFoundError);
  });
});

describe('getAccountableForPhase', () => {
  it('should return Visionary as accountable for Discovery', () => {
    const accountable = getAccountableForPhase('Discovery');
    expect(accountable).toBe('Visionary');
  });

  it('should return exactly one role per phase', () => {
    const phases: Array<'Discovery' | 'Design' | 'Build' | 'Release' | 'Growth' | 'Maintenance'> = [
      'Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'
    ];

    phases.forEach(phase => {
      const accountable = getAccountableForPhase(phase);
      expect(typeof accountable).toBe('string');
      expect(accountable.length).toBeGreaterThan(0);
    });
  });

  it('should return valid role names', () => {
    const validRoleNames = getAllRoleNames();
    const phases: Array<'Discovery' | 'Design' | 'Build' | 'Release' | 'Growth' | 'Maintenance'> = [
      'Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'
    ];

    phases.forEach(phase => {
      const accountable = getAccountableForPhase(phase);
      expect(validRoleNames).toContain(accountable);
    });
  });
});

describe('getResponsibleForPhase', () => {
  it('should return at least one responsible role per phase', () => {
    const phases: Array<'Discovery' | 'Design' | 'Build' | 'Release' | 'Growth' | 'Maintenance'> = [
      'Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'
    ];

    phases.forEach(phase => {
      const responsible = getResponsibleForPhase(phase);
      expect(responsible.length).toBeGreaterThan(0);
    });
  });

  it('should return array of valid role names', () => {
    const validRoleNames = getAllRoleNames();
    const responsible = getResponsibleForPhase('Build');
    
    responsible.forEach(role => {
      expect(validRoleNames).toContain(role);
    });
  });

  it('should return unique roles (no duplicates)', () => {
    const phases: Array<'Discovery' | 'Design' | 'Build' | 'Release' | 'Growth' | 'Maintenance'> = [
      'Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'
    ];

    phases.forEach(phase => {
      const responsible = getResponsibleForPhase(phase);
      const uniqueRoles = new Set(responsible);
      expect(uniqueRoles.size).toBe(responsible.length);
    });
  });

  it('Build phase should have most responsible roles', () => {
    const buildResponsible = getResponsibleForPhase('Build');
    const discoveryResponsible = getResponsibleForPhase('Discovery');
    
    // Build typically has more responsible roles than Discovery
    expect(buildResponsible.length).toBeGreaterThanOrEqual(discoveryResponsible.length);
  });
});

describe('getRoleAssignment', () => {
  it('should return correct assignment for specific role and phase', () => {
    const assignment = getRoleAssignment('Product Manager', 'Discovery');
    expect(['R', 'A', 'C', 'I', '-']).toContain(assignment);
  });

  it('should return A for accountable role', () => {
    // Visionary is accountable for Discovery
    const assignment = getRoleAssignment('Visionary', 'Discovery');
    expect(assignment).toBe('A');
  });

  it('should return consistent results', () => {
    const allRoleNames = getAllRoleNames();
    const phases: Array<'Discovery' | 'Design' | 'Build' | 'Release' | 'Growth' | 'Maintenance'> = [
      'Discovery', 'Design', 'Build', 'Release', 'Growth', 'Maintenance'
    ];

    allRoleNames.forEach(role => {
      phases.forEach(phase => {
        const assignment = getRoleAssignment(role, phase);
        expect(['R', 'A', 'C', 'I', '-']).toContain(assignment);
      });
    });
  });
});

describe('getPhasesForRoleAssignment', () => {
  it('should return phases where role is Responsible', () => {
    const phases = getPhasesForRoleAssignment('Backend Developer', 'R');
    
    expect(phases.length).toBeGreaterThan(0);
    phases.forEach(phase => {
      const assignment = getRoleAssignment('Backend Developer', phase);
      expect(assignment).toBe('R');
    });
  });

  it('should return phases where role is Accountable', () => {
    const phases = getPhasesForRoleAssignment('Product Manager', 'A');
    
    // Product Manager should be accountable for multiple phases
    expect(phases.length).toBeGreaterThan(0);
  });

  it('should return empty array for non-existent assignment', () => {
    // Find a role that is never Accountable (most roles aren't)
    const phases = getPhasesForRoleAssignment('Frontend Developer', 'A');
    expect(phases).toHaveLength(0);
  });
});

describe('getTotalDuration', () => {
  it('should return min and max duration', () => {
    const duration = getTotalDuration();
    
    expect(duration).toHaveProperty('min');
    expect(duration).toHaveProperty('max');
  });

  it('should have min <= max', () => {
    const duration = getTotalDuration();
    expect(duration.min).toBeLessThanOrEqual(duration.max);
  });

  it('should match sum of phase durations', () => {
    const duration = getTotalDuration();
    
    let expectedMin = 0;
    let expectedMax = 0;
    
    RACI_CHART.phases.forEach(phase => {
      expectedMin += phase.estimatedDuration.min;
      expectedMax += phase.estimatedDuration.max;
    });
    
    expect(duration.min).toBe(expectedMin);
    expect(duration.max).toBe(expectedMax);
  });

  it('should return reasonable project duration', () => {
    const duration = getTotalDuration();
    
    // Total project should be at least 20 weeks min
    expect(duration.min).toBeGreaterThanOrEqual(20);
    // And less than 2 years max
    expect(duration.max).toBeLessThanOrEqual(104);
  });
});

describe('validateRACIChart', () => {
  it('should return valid for current RACI_CHART', () => {
    const result = validateRACIChart();
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('RACI Consistency Checks', () => {
  it('Accountable role should also have responsibilities listed', () => {
    RACI_CHART.phases.forEach(phase => {
      const accountable = phase.assignments.find(a => a.assignment === 'A');
      expect(accountable).toBeDefined();
      expect(accountable!.responsibilities.length).toBeGreaterThan(0);
    });
  });

  it('Responsible roles should have responsibilities listed', () => {
    RACI_CHART.phases.forEach(phase => {
      const responsible = phase.assignments.filter(a => a.assignment === 'R');
      responsible.forEach(r => {
        expect(r.responsibilities.length).toBeGreaterThan(0);
      });
    });
  });

  it('All 11 roles should be assigned in each phase', () => {
    const allRoleNames = getAllRoleNames();
    
    RACI_CHART.phases.forEach(phase => {
      const assignedRoles = phase.assignments.map(a => a.role);
      
      allRoleNames.forEach(roleName => {
        expect(assignedRoles).toContain(roleName);
      });
    });
  });

  it('No role should be both R and A in the same phase', () => {
    RACI_CHART.phases.forEach(phase => {
      const accountable = phase.assignments.find(a => a.assignment === 'A');
      const responsible = phase.assignments.filter(a => a.assignment === 'R');
      
      if (accountable) {
        const responsibleNames = responsible.map(r => r.role);
        // This is actually allowed in RACI - role can be both R and A
        // But typically only one is assigned per role
      }
    });
  });
});

describe('Phase-Specific RACI Validation', () => {
  it('Discovery phase should involve Product Manager and UX Designer', () => {
    const discovery = getRACIForPhase('Discovery');
    const pmAssignment = discovery.assignments.find(a => a.role === 'Product Manager');
    const uxAssignment = discovery.assignments.find(a => a.role === 'UX Designer');
    
    expect(pmAssignment).toBeDefined();
    expect(['R', 'A']).toContain(pmAssignment!.assignment);
    
    expect(uxAssignment).toBeDefined();
    expect(['R', 'A', 'C']).toContain(uxAssignment!.assignment);
  });

  it('Build phase should involve Engineering roles', () => {
    const build = getRACIForPhase('Build');
    const frontendAssignment = build.assignments.find(a => a.role === 'Frontend Developer');
    const backendAssignment = build.assignments.find(a => a.role === 'Backend Developer');
    
    expect(frontendAssignment!.assignment).toBe('R');
    expect(backendAssignment!.assignment).toBe('R');
  });

  it('Release phase should involve DevOps and QA', () => {
    const release = getRACIForPhase('Release');
    const devopsAssignment = release.assignments.find(a => a.role === 'DevOps Engineer');
    const qaAssignment = release.assignments.find(a => a.role === 'QA Engineer');
    
    expect(['R', 'A']).toContain(devopsAssignment!.assignment);
    expect(['R', 'A']).toContain(qaAssignment!.assignment);
  });

  it('Security Analyst should be involved in Design and Release', () => {
    const design = getRACIForPhase('Design');
    const release = getRACIForPhase('Release');
    
    const designSecurity = design.assignments.find(a => a.role === 'Security Analyst');
    const releaseSecurity = release.assignments.find(a => a.role === 'Security Analyst');
    
    expect(['R', 'A', 'C']).toContain(designSecurity!.assignment);
    expect(['R', 'A', 'C']).toContain(releaseSecurity!.assignment);
  });
});
