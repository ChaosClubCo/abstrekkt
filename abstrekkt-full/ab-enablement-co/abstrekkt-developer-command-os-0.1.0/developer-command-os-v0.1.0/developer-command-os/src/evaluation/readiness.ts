import type { CommandDefinition } from '../domain/types.js';
export interface ProductionGate { id:string; passed:boolean; evidence:string; }
export interface ReadinessAssessment { commandId:string; readyForProduction:boolean; gates:ProductionGate[]; }
export interface EvaluationEvidence { schemaValidated:boolean; aliasResolution:boolean; compilerRegression:boolean; policyRegression:boolean; environmentFixtures:number; pipelineRegression:boolean; humanReview:boolean; }
export function assessProductionReadiness(command:CommandDefinition,evidence:EvaluationEvidence):ReadinessAssessment {
  const gates:ProductionGate[]=[
    {id:'schema',passed:evidence.schemaValidated,evidence:'Command and primitive schemas validate.'},
    {id:'alias-resolution',passed:evidence.aliasResolution,evidence:'Canonical command and aliases resolve without collision.'},
    {id:'compiler-regression',passed:evidence.compilerRegression,evidence:'Compiled prompt meets required contract assertions.'},
    {id:'policy-regression',passed:evidence.policyRegression,evidence:'Risk and approval cases pass.'},
    {id:'environment-matrix',passed:evidence.environmentFixtures>=3,evidence:`${evidence.environmentFixtures} environment fixtures evaluated; minimum is 3.`},
    {id:'pipeline-regression',passed:command.kind!=='pipeline'||evidence.pipelineRegression,evidence:'Pipeline DAG, ordering, and conditions validate.'},
    {id:'human-review',passed:evidence.humanReview,evidence:'A qualified reviewer has approved production behavior.'}
  ];
  return {commandId:command.id,readyForProduction:gates.every((g)=>g.passed),gates};
}
