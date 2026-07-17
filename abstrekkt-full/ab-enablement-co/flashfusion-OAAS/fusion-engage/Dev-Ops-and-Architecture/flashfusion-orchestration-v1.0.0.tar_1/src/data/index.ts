/**
 * @module data
 * @description Data module exports
 */

export * from './roles.js';
export * from './raci.js';
export * from './prompts.js';
export { 
  ROADMAP,
  getMilestonesByPhase,
  getMilestonesByStatus,
  getMilestonesByOwner,
  getMilestoneById,
  getDependentMilestones,
  getCriticalPath,
  getTotalDuration as getRoadmapTotalDuration,
} from './roadmap.js';
export * from './board.js';
export * from './jobs.js';
export * from './presentations.js';
