import type { PipelineDefinition, PipelineStage } from '../domain/types.js';
import { resolveCommand } from '../registry/index.js';
export interface PlannedStage extends PipelineStage { order:number; commandTitle:string; riskLevel:string; }
export function validatePipeline(pipeline:PipelineDefinition):void {
  const ids=new Set(pipeline.stages.map((s)=>s.id)); if (ids.size!==pipeline.stages.length) throw new Error(`Duplicate stage id in ${pipeline.id}`);
  for (const stage of pipeline.stages) { resolveCommand(stage.commandId); for (const dep of stage.dependsOn) if (!ids.has(dep)) throw new Error(`Unknown dependency ${dep} in ${pipeline.id}`); }
  topologicalPlan(pipeline);
}
export function topologicalPlan(pipeline:PipelineDefinition):PlannedStage[] {
  const pending=new Map(pipeline.stages.map((s)=>[s.id,s])); const completed=new Set<string>(); const result:PlannedStage[]=[];
  while (pending.size) {
    const ready=[...pending.values()].filter((s)=>s.dependsOn.every((d)=>completed.has(d)));
    if (!ready.length) throw new Error(`Pipeline ${pipeline.id} contains a cycle.`);
    for (const stage of ready) { const command=resolveCommand(stage.commandId); result.push({...stage,order:result.length+1,commandTitle:command.title,riskLevel:command.riskLevel}); pending.delete(stage.id); completed.add(stage.id); }
  }
  return result;
}
