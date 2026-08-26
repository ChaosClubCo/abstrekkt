import { z } from 'zod';
export const ResultStatusSchema=z.enum(['completed','completed_with_warnings','blocked','failed','rolled_back']);
export const CommandResultSchema=z.object({
  schemaVersion:z.literal('1.0.0'), runId:z.string().min(1), command:z.string().min(1), commandVersion:z.string().min(1), status:ResultStatusSchema, summary:z.string(),
  environment:z.object({repository:z.string(),branch:z.string().optional(),commit:z.string().optional(),scope:z.array(z.string())}),
  changes:z.array(z.object({path:z.string(),action:z.enum(['created','modified','deleted']),reason:z.string()})),
  verification:z.array(z.object({name:z.string(),status:z.enum(['passed','failed','skipped']),evidence:z.string().optional()})),
  findings:z.array(z.object({id:z.string(),severity:z.enum(['info','low','medium','high','critical']),confidence:z.number().min(0).max(1),kind:z.enum(['fact','inference','recommendation','unknown']),summary:z.string(),evidence:z.array(z.string())})),
  unresolvedRisks:z.array(z.string()), approvalsRequired:z.array(z.string()), recommendedNextCommands:z.array(z.string()),
  metrics:z.object({durationMs:z.number().nonnegative(),inputTokens:z.number().nonnegative().optional(),outputTokens:z.number().nonnegative().optional(),estimatedCostUsd:z.number().nonnegative().optional(),repairAttempts:z.number().int().nonnegative()}),
  provenance:z.object({primitiveVersion:z.string().optional(),promptFragments:z.array(z.string()),modelProfile:z.string(),platformId:z.string()})
});
export type CommandResult=z.infer<typeof CommandResultSchema>;
export function createEmptyResult(input: Pick<CommandResult,'runId'|'command'|'commandVersion'|'environment'|'provenance'>): CommandResult {
  return {...input,schemaVersion:'1.0.0',status:'completed',summary:'',changes:[],verification:[],findings:[],unresolvedRisks:[],approvalsRequired:[],recommendedNextCommands:[],metrics:{durationMs:0,repairAttempts:0}};
}
