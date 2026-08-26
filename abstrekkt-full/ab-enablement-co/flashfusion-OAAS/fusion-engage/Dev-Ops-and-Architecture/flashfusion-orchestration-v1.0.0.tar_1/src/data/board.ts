/**
 * @module data/board
 * @description Kanban board configuration with lifecycle-aligned columns
 * @security All data structures are deeply frozen to prevent runtime mutation
 */

import type { BoardSetup, BoardColumn, LifecyclePhase } from '../types/index.js';
import { deepFreeze } from '../utils/security.js';

/**
 * Default board configuration aligned with product lifecycle.
 * @security Immutable - modifications throw in strict mode
 */
export const BOARD_SETUP: BoardSetup = deepFreeze({
  defaultView: 'kanban',
  metadata: {
    name: 'Product Development Board',
    description: 'Kanban board for tracking work across the product development lifecycle',
    version: '1.0.0',
  },
  columns: [
    {
      id: 'backlog',
      name: 'Backlog',
      color: '#6B7280',
      wipLimit: null,
      phase: undefined,
    },
    {
      id: 'discovery',
      name: 'Discovery',
      color: '#8B5CF6',
      wipLimit: 3,
      phase: 'Discovery',
    },
    {
      id: 'design',
      name: 'Design',
      color: '#EC4899',
      wipLimit: 3,
      phase: 'Design',
    },
    {
      id: 'development',
      name: 'Development',
      color: '#3B82F6',
      wipLimit: 5,
      phase: 'Build',
    },
    {
      id: 'review',
      name: 'Review',
      color: '#F59E0B',
      wipLimit: 3,
      phase: 'Build',
    },
    {
      id: 'testing',
      name: 'Testing',
      color: '#10B981',
      wipLimit: 5,
      phase: 'Release',
    },
    {
      id: 'done',
      name: 'Done',
      color: '#059669',
      wipLimit: null,
      phase: undefined,
    },
  ],
}) as BoardSetup;

/**
 * Gets columns for a specific lifecycle phase.
 */
export function getColumnsForPhase(phase: LifecyclePhase): readonly BoardColumn[] {
  return BOARD_SETUP.columns.filter(c => c.phase === phase);
}

/**
 * Gets a column by ID.
 */
export function getColumnById(id: string): BoardColumn | undefined {
  return BOARD_SETUP.columns.find(c => c.id === id);
}

/**
 * Gets total WIP limit across all columns with limits.
 */
export function getTotalWIPLimit(): number {
  return BOARD_SETUP.columns
    .filter(c => c.wipLimit !== null)
    .reduce((sum, c) => sum + (c.wipLimit ?? 0), 0);
}

/**
 * Gets columns that have WIP limits.
 */
export function getColumnsWithWIPLimits(): readonly BoardColumn[] {
  return BOARD_SETUP.columns.filter(c => c.wipLimit !== null);
}

/**
 * Validates board configuration.
 */
export function validateBoardSetup(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check minimum columns
  if (BOARD_SETUP.columns.length < 2) {
    errors.push('Board must have at least 2 columns');
  }
  
  // Check for unique IDs
  const ids = new Set(BOARD_SETUP.columns.map(c => c.id));
  if (ids.size !== BOARD_SETUP.columns.length) {
    errors.push('Column IDs must be unique');
  }
  
  // Check for valid colors
  const colorPattern = /^#[0-9A-Fa-f]{6}$/;
  for (const col of BOARD_SETUP.columns) {
    if (!colorPattern.test(col.color)) {
      errors.push(`Invalid color for column ${col.id}: ${col.color}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
