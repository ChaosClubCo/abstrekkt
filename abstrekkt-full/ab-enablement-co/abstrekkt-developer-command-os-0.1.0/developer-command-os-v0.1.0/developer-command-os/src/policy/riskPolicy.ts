import type { CommandDefinition, RiskLevel } from '../domain/types.js';
export type ActionType = 'read_file'|'write_file'|'delete_file'|'run_command'|'network_access'|'git_commit'|'git_push'|'open_pr'|'merge_pr'|'deploy'|'modify_production_data'|'change_permissions'|'rotate_secret'|'external_message'|'billing';
export type PolicyOutcome = 'allow'|'approval_required'|'blocked';
export interface ActionRequest { command: CommandDefinition; action: ActionType; filesAffected?: number; linesAffected?: number; protectedBranch?: boolean; production?: boolean; explicitApproval?: boolean; }
export interface PolicyDecision { outcome: PolicyOutcome; reasons: string[]; requiredApproval: boolean; }
const destructive = new Set<ActionType>(['delete_file','merge_pr','deploy','modify_production_data','change_permissions','rotate_secret','external_message','billing']);
const external = new Set<ActionType>(['git_push','open_pr','merge_pr','deploy','external_message','billing','network_access']);
const rank: Record<RiskLevel,number>={read_only:0,low:1,medium:2,high:3,critical:4};
export function evaluateAction(request: ActionRequest): PolicyDecision {
  const reasons:string[]=[]; const { command, action }=request;
  if (command.riskLevel==='read_only' && !['read_file','run_command'].includes(action)) return {outcome:'blocked',requiredApproval:true,reasons:['Read-only commands cannot create side effects.']};
  if (action==='git_push' && request.protectedBranch) return {outcome:'blocked',requiredApproval:true,reasons:['Direct pushes to protected branches are blocked.']};
  if (request.production && destructive.has(action) && !request.explicitApproval) return {outcome:'blocked',requiredApproval:true,reasons:['Production destructive operations require explicit per-action approval.']};
  if ((request.filesAffected??0)>25 || (request.linesAffected??0)>1500) reasons.push('Blast radius exceeds the default automatic limit.');
  if (destructive.has(action)) reasons.push('The action is destructive or externally consequential.');
  if (external.has(action)) reasons.push('The action creates an external side effect.');
  if (rank[command.riskLevel]>=3) reasons.push(`Command risk level is ${command.riskLevel}.`);
  if (reasons.length>0 && !request.explicitApproval) return {outcome:'approval_required',requiredApproval:true,reasons};
  return {outcome:'allow',requiredApproval:false,reasons:reasons.length?['Explicit approval satisfies the applicable policy gates.']:['Action is within the default policy boundary.']};
}
