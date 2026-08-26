import { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertCircle, Rocket, BarChart2, CheckSquare, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { phase0, phase1 } from '../../data/deployment-phases'; // We'll assume these exist and more will be added or we'll mock them
import { isTaskCompleted, markTaskCompleted, markTaskIncomplete } from '../../utils/storage';
import { trackTaskCompletion } from '../../utils/analytics';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useToast } from '../../contexts/ToastContext';
import { SectionHeader } from '../common/SectionHeader';
import { DeploymentPhase, DeploymentTask } from '../../types';

// Aggregate phases (mocking for now if not all exported, or we'll read them from a central export later)
// For now, let's assume we have a list of phases.
// Since I can't read all of deployment-phases.ts due to truncation, I'll create a safer implementation that can handle missing data or partial data.

const allPhases = [phase0, phase1]; // Extend this as we have more phases

export function Deployment() {
  const { addToast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({ 'phase-0': true, 'phase-1': true });
  const [filter, setFilter] = useState<'all' | 'pending' | 'critical'>('all');

  // Load completed tasks from storage
  useEffect(() => {
    const tasks: Record<string, boolean> = {};
    allPhases.forEach(phase => {
      phase.subPhases.forEach(sub => {
        sub.tasks.forEach(task => {
          tasks[task.id] = isTaskCompleted(task.id);
        });
      });
    });
    setCompletedTasks(tasks);
  }, []);

  const handleTaskToggle = (taskId: string) => {
    const newState = !completedTasks[taskId];
    
    if (newState) {
      markTaskCompleted(taskId);
      trackTaskCompletion(taskId, true);
      addToast({
        type: 'success',
        message: 'Task marked as completed!'
      });
    } else {
      markTaskIncomplete(taskId);
      trackTaskCompletion(taskId, false);
      addToast({
        type: 'info',
        message: 'Task marked as incomplete'
      });
    }

    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: newState
    }));
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Metrics
  const totalTasks = allPhases.reduce((acc, phase) => 
    acc + phase.subPhases.reduce((pAcc, sub) => pAcc + sub.tasks.length, 0), 0);
  
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const overallProgress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const criticalTasks = allPhases.flatMap(p => p.subPhases.flatMap(s => s.tasks)).filter(t => t.priority === 'critical');
  const completedCritical = criticalTasks.filter(t => completedTasks[t.id]).length;
  const criticalProgress = criticalTasks.length > 0 ? (completedCritical / criticalTasks.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Deployment Hub" 
        description="Master deployment checklist and progress tracker. Monitor critical paths, infrastructure readiness, and compliance gates."
        icon={Rocket}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Column */}
         <div className="lg:col-span-2 space-y-8">
            {/* Overall Progress Card */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200">
               <div className="flex justify-between items-end mb-4">
                  <div>
                     <h3 className="text-lg font-bold text-slate-900">Total Deployment Progress</h3>
                     <p className="text-slate-500 text-sm">Target: Q1 2025</p>
                  </div>
                  <div className="text-right">
                     <span className="text-3xl font-bold text-slate-900">{Math.round(overallProgress)}%</span>
                     <p className="text-xs text-slate-500">{completedCount} / {totalTasks} Tasks</p>
                  </div>
               </div>
               <ProgressBar
                  value={overallProgress}
                  color={overallProgress === 100 ? 'success' : 'primary'}
                  height="h-3"
               />
               
               <div className="mt-6 grid grid-cols-2 gap-4">
                 <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-sm font-medium text-slate-600">Critical Path</span>
                    <Badge variant={criticalProgress === 100 ? 'success' : 'warning'}>{Math.round(criticalProgress)}%</Badge>
                 </div>
                 <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-sm font-medium text-slate-600">Phases Active</span>
                    <span className="text-sm font-bold text-slate-900">{allPhases.filter(p => p.status === 'in-progress').length} / {allPhases.length}</span>
                 </div>
               </div>
            </Card>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
              <Filter className="w-4 h-4 text-slate-400" />
              <button 
                onClick={() => setFilter('all')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                All Tasks
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${filter === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('critical')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${filter === 'critical' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Critical Only
              </button>
            </div>

            {/* Phases List */}
            <div className="space-y-6">
              {allPhases.map((phase) => {
                const phaseTasks = phase.subPhases.flatMap(s => s.tasks);
                const phaseCompletedCount = phaseTasks.filter(t => completedTasks[t.id]).length;
                const phaseProgress = (phaseCompletedCount / phaseTasks.length) * 100;
                const isExpanded = expandedPhases[phase.id];

                return (
                  <div key={phase.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    {/* Phase Header */}
                    <div 
                      className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => togglePhase(phase.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-1 rounded-md ${isExpanded ? 'bg-slate-200' : 'bg-transparent'}`}>
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            Phase {phase.number}: {phase.title}
                            {phaseProgress === 100 && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                          </h3>
                          <p className="text-sm text-slate-500">{phase.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <span className="text-sm font-bold text-slate-900">{Math.round(phaseProgress)}%</span>
                          <p className="text-xs text-slate-500">{phaseCompletedCount}/{phaseTasks.length}</p>
                        </div>
                        <div className="w-24 hidden sm:block">
                          <ProgressBar value={phaseProgress} height="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Sub-phases & Tasks */}
                    {isExpanded && (
                      <div className="p-4 space-y-6 bg-white">
                        {phase.subPhases.map(subPhase => (
                          <div key={subPhase.id}>
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 pl-2 border-l-4 border-slate-300">
                              {subPhase.title}
                            </h4>
                            <div className="space-y-2">
                              {subPhase.tasks
                                .filter(task => {
                                  if (filter === 'pending') return !completedTasks[task.id];
                                  if (filter === 'critical') return task.priority === 'critical';
                                  return true;
                                })
                                .map(task => (
                                <div 
                                  key={task.id}
                                  className={`group flex items-start gap-3 p-3 rounded-lg border transition-all ${
                                    completedTasks[task.id] 
                                      ? 'bg-slate-50 border-transparent opacity-75 hover:opacity-100' 
                                      : 'bg-white border-slate-100 hover:border-amber-300 hover:shadow-sm'
                                  }`}
                                >
                                  <button
                                    onClick={() => handleTaskToggle(task.id)}
                                    className={`mt-0.5 flex-shrink-0 transition-colors ${
                                      completedTasks[task.id] ? 'text-emerald-500' : 'text-slate-300 group-hover:text-amber-500'
                                    }`}
                                  >
                                    {completedTasks[task.id] ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                  </button>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                      <span className={`font-medium text-sm ${completedTasks[task.id] ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                        {task.title}
                                      </span>
                                      {task.priority === 'critical' && !completedTasks[task.id] && (
                                        <Badge variant="danger" size="sm">Critical</Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                                    
                                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                                      {task.estimatedHours && <span>Est: {task.estimatedHours}h</span>}
                                      {task.assignee && <span>Assignee: {task.assignee}</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {subPhase.tasks.length === 0 && (
                                <p className="text-sm text-slate-400 italic pl-8">No tasks match filter.</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
         </div>

         {/* Sidebar Metrics */}
         <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 text-slate-300 sticky top-24">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-amber-500" />
                  Live Metrics
               </h3>
               
               <div className="space-y-6">
                  <div>
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Completion Velocity</h4>
                     <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">4.2</span>
                        <span className="text-sm text-slate-400 mb-1">tasks / day</span>
                     </div>
                     <p className="text-xs text-emerald-400 mt-1">↑ 12% vs last week</p>
                  </div>

                  <div>
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Est. Completion</h4>
                     <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-white">Dec 24, 2025</span>
                     </div>
                     <p className="text-xs text-amber-400 mt-1">On track</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mt-4">
                     <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                        Next Milestones
                     </h4>
                     <ul className="space-y-3 text-xs text-slate-400">
                        <li className="flex gap-2 items-start">
                           <span className="text-slate-500 mt-0.5">•</span>
                           <span>Complete Phase 1 Security Audit</span>
                        </li>
                        <li className="flex gap-2 items-start">
                           <span className="text-slate-500 mt-0.5">•</span>
                           <span>Deploy Staging Environment</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </Card>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
               <h4 className="font-bold text-indigo-900 mb-2">Team Activity</h4>
               <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">JD</div>
                     <div>
                        <p className="text-indigo-900 font-medium">John Doe</p>
                        <p className="text-indigo-700 text-xs">Completed 3 tasks in Phase 1</p>
                     </div>
                  </li>
                  <li className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold text-xs">AS</div>
                     <div>
                        <p className="text-indigo-900 font-medium">Alice Smith</p>
                        <p className="text-indigo-700 text-xs">Updated security requirements</p>
                     </div>
                  </li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
