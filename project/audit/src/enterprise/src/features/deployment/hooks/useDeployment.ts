import { useState, useMemo } from 'react';
import { allDeploymentPhases } from '../../../data/deployment-phases';
import { DeploymentPhase, DeploymentTask } from '../../../types';

export type FilterType = 'all' | 'critical' | 'pending' | 'completed';

export function useDeployment() {
  const [activePhase, setActivePhase] = useState<string | null>('phase-0');
  const [filter, setFilter] = useState<FilterType>('all');

  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let criticalTasks = 0;
    let criticalCompleted = 0;

    allDeploymentPhases.forEach(phase => {
      phase.subPhases.forEach(sub => {
        sub.tasks.forEach(task => {
          totalTasks++;
          if (task.status === 'completed') completedTasks++;
          if (task.priority === 'critical') {
            criticalTasks++;
            if (task.status === 'completed') criticalCompleted++;
          }
        });
      });
    });

    return {
      totalTasks,
      completedTasks,
      progress: Math.round((completedTasks / totalTasks) * 100) || 0,
      criticalProgress: Math.round((criticalCompleted / criticalTasks) * 100) || 0,
      velocity: 4.2 // Mock velocity
    };
  }, []);

  const filteredPhases = useMemo(() => {
    if (filter === 'all') return allDeploymentPhases;

    return allDeploymentPhases.map(phase => {
      const filteredSubPhases = phase.subPhases.map(sub => {
        const filteredTasks = sub.tasks.filter(task => {
          if (filter === 'critical') return task.priority === 'critical';
          if (filter === 'pending') return task.status !== 'completed';
          if (filter === 'completed') return task.status === 'completed';
          return true;
        });
        return { ...sub, tasks: filteredTasks };
      }).filter(sub => sub.tasks.length > 0);

      return { ...phase, subPhases: filteredSubPhases };
    }).filter(phase => phase.subPhases.length > 0);
  }, [filter]);

  const togglePhase = (phaseId: string) => {
    setActivePhase(current => current === phaseId ? null : phaseId);
  };

  return {
    phases: filteredPhases,
    activePhase,
    togglePhase,
    filter,
    setFilter,
    stats
  };
}
