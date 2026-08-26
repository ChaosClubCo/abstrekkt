/**
 * @module data/roadmap
 * @description Product roadmap with milestones across lifecycle phases
 * @security All data structures are deeply frozen to prevent runtime mutation
 */

import type { Roadmap, Milestone, LifecyclePhase, MilestoneStatus, RoleName } from '../types/index.js';
import { deepFreeze } from '../utils/security.js';

/**
 * Sample product roadmap demonstrating the milestone structure.
 * @security Immutable - modifications throw in strict mode
 */
export const ROADMAP: Roadmap = deepFreeze({
  version: '1.0.0',
  lastUpdated: '2025-01-01T00:00:00Z',
  milestones: [
    // Discovery Phase
    {
      id: 'ms-001',
      title: 'User Research Complete',
      description: 'Complete initial user research including interviews, surveys, and competitive analysis',
      targetDate: '2025-02-15',
      status: 'completed',
      phase: 'Discovery',
      owners: ['Product Manager', 'UX Designer'],
      dependencies: [],
    },
    {
      id: 'ms-002',
      title: 'Problem Definition',
      description: 'Define and validate the core problem statement with stakeholders',
      targetDate: '2025-02-28',
      status: 'completed',
      phase: 'Discovery',
      owners: ['Product Manager', 'Visionary'],
      dependencies: ['ms-001'],
    },
    // Design Phase
    {
      id: 'ms-003',
      title: 'Architecture Design',
      description: 'Complete system architecture design and technical specification',
      targetDate: '2025-03-30',
      status: 'in-progress',
      phase: 'Design',
      owners: ['Technical Architect', 'Security Analyst'],
      dependencies: ['ms-002'],
    },
    {
      id: 'ms-004',
      title: 'UX Design Complete',
      description: 'Complete all user interface designs and design system components',
      targetDate: '2025-04-15',
      status: 'in-progress',
      phase: 'Design',
      owners: ['UX Designer'],
      dependencies: ['ms-002'],
    },
    // Build Phase
    {
      id: 'ms-005',
      title: 'Core API Development',
      description: 'Implement core backend APIs and database schema',
      targetDate: '2025-06-01',
      status: 'planned',
      phase: 'Build',
      owners: ['Backend Developer', 'Technical Architect'],
      dependencies: ['ms-003'],
    },
    {
      id: 'ms-006',
      title: 'Frontend Implementation',
      description: 'Implement all frontend components and integrate with APIs',
      targetDate: '2025-07-15',
      status: 'planned',
      phase: 'Build',
      owners: ['Frontend Developer'],
      dependencies: ['ms-004', 'ms-005'],
    },
    {
      id: 'ms-007',
      title: 'Integration Testing',
      description: 'Complete integration testing across all system components',
      targetDate: '2025-08-01',
      status: 'planned',
      phase: 'Build',
      owners: ['QA Engineer'],
      dependencies: ['ms-006'],
    },
    // Release Phase
    {
      id: 'ms-008',
      title: 'Beta Release',
      description: 'Release beta version to limited user group for feedback',
      targetDate: '2025-09-01',
      status: 'planned',
      phase: 'Release',
      owners: ['DevOps Engineer', 'Product Manager'],
      dependencies: ['ms-007'],
    },
    {
      id: 'ms-009',
      title: 'Production Launch',
      description: 'Full production release to all users',
      targetDate: '2025-10-01',
      status: 'planned',
      phase: 'Release',
      owners: ['DevOps Engineer', 'Product Manager'],
      dependencies: ['ms-008'],
    },
    // Growth Phase
    {
      id: 'ms-010',
      title: 'Growth Campaign Launch',
      description: 'Launch initial user acquisition and growth campaigns',
      targetDate: '2025-11-01',
      status: 'planned',
      phase: 'Growth',
      owners: ['Growth Strategist', 'Data Analyst'],
      dependencies: ['ms-009'],
    },
  ],
}) as Roadmap;

/**
 * Gets all milestones for a specific phase.
 */
export function getMilestonesByPhase(phase: LifecyclePhase): readonly Milestone[] {
  return ROADMAP.milestones.filter(m => m.phase === phase);
}

/**
 * Gets all milestones with a specific status.
 */
export function getMilestonesByStatus(status: MilestoneStatus): readonly Milestone[] {
  return ROADMAP.milestones.filter(m => m.status === status);
}

/**
 * Gets all milestones owned by a specific role.
 */
export function getMilestonesByOwner(role: RoleName): readonly Milestone[] {
  return ROADMAP.milestones.filter(m => m.owners.includes(role));
}

/**
 * Gets a milestone by ID.
 */
export function getMilestoneById(id: string): Milestone | undefined {
  return ROADMAP.milestones.find(m => m.id === id);
}

/**
 * Gets milestones that depend on a specific milestone.
 */
export function getDependentMilestones(milestoneId: string): readonly Milestone[] {
  return ROADMAP.milestones.filter(m => m.dependencies.includes(milestoneId));
}

/**
 * Gets the critical path (longest chain of dependencies).
 */
export function getCriticalPath(): readonly Milestone[] {
  // Build dependency graph
  const milestoneMap = new Map(ROADMAP.milestones.map(m => [m.id, m]));
  
  // Find milestones with no dependents (end nodes)
  const endNodes = ROADMAP.milestones.filter(m => 
    !ROADMAP.milestones.some(other => other.dependencies.includes(m.id))
  );
  
  // Find longest path from any start node to any end node
  function getLongestPath(milestone: Milestone): Milestone[] {
    if (milestone.dependencies.length === 0) {
      return [milestone];
    }
    
    let longestPredecessor: Milestone[] = [];
    for (const depId of milestone.dependencies) {
      const dep = milestoneMap.get(depId);
      if (dep) {
        const path = getLongestPath(dep);
        if (path.length > longestPredecessor.length) {
          longestPredecessor = path;
        }
      }
    }
    
    return [...longestPredecessor, milestone];
  }
  
  let criticalPath: Milestone[] = [];
  for (const endNode of endNodes) {
    const path = getLongestPath(endNode);
    if (path.length > criticalPath.length) {
      criticalPath = path;
    }
  }
  
  return criticalPath;
}

/**
 * Gets total duration estimate for the roadmap.
 */
export function getTotalDuration(): { min: number; max: number } {
  // Import from RACI for consistency
  const PHASE_DURATIONS: Record<LifecyclePhase, { min: number; max: number }> = {
    Discovery: { min: 2, max: 4 },
    Design: { min: 3, max: 6 },
    Build: { min: 6, max: 12 },
    Release: { min: 1, max: 2 },
    Growth: { min: 8, max: 24 },
    Maintenance: { min: 4, max: 52 },
  };
  
  const phases = new Set(ROADMAP.milestones.map(m => m.phase));
  
  return Array.from(phases).reduce(
    (acc, phase) => ({
      min: acc.min + PHASE_DURATIONS[phase].min,
      max: acc.max + PHASE_DURATIONS[phase].max,
    }),
    { min: 0, max: 0 }
  );
}
