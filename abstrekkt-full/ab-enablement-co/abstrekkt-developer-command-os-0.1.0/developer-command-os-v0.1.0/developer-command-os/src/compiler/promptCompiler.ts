import type { CommandDefinition, CommandInvocation, PlatformCapabilities } from '../domain/types.js';
import type { EnvironmentManifest } from '../environment/types.js';
import { resolveCommand, getPrimitive } from '../registry/index.js';
import { routeCommand } from '../routing/router.js';
import { fragmentVersions, globalContract, recoveryContract, verificationContract, resultContract } from './fragments.js';
export interface CompiledPrompt { command:CommandDefinition; prompt:string; fragments:string[]; route:ReturnType<typeof routeCommand>; }
function envSummary(env:EnvironmentManifest):string { return JSON.stringify({repositoryRoot:env.repositoryRoot,git:env.git,languages:env.languages,frameworks:env.frameworks,packageManagers:env.packageManagers,scripts:env.scripts,ciProviders:env.ciProviders,infrastructure:env.infrastructure,deploymentTargets:env.deploymentTargets,databases:env.databases,environmentVariableNames:env.environmentVariableNames,capabilities:env.capabilities,warnings:env.warnings},null,2); }
export function compilePrompt(invocation:CommandInvocation, environment:EnvironmentManifest, platform:PlatformCapabilities):CompiledPrompt {
  const command=resolveCommand(invocation.command); const route=routeCommand(command,platform); const primitive=getPrimitive(command);
  const fragments=[...Object.values(fragmentVersions),primitive?`primitive:${primitive.id}@${primitive.version}`:`pipeline:${command.id}@${command.version}`,`command:${command.id}@${command.version}`];
  const prompt=[
    `You are executing ${command.slash} — ${command.title}.`,
    `\nGLOBAL OPERATING CONTRACT\n${globalContract}`,
    `\nUSER INTENT\nGoal: ${invocation.goal??command.what}\nScope: ${invocation.scope??'detected repository scope'}\nConstraints: ${(invocation.constraints??[]).join('; ')||'Preserve behavior and unrelated work.'}\nApproval mode: ${invocation.approvalMode??'ask_before_write'}\nArguments: ${JSON.stringify(invocation.arguments??{})}`,
    `\nDETECTED ENVIRONMENT\n${envSummary(environment)}`,
    `\nROUTING\nModel profile: ${route.modelProfile}\nPrimitive: ${primitive?.title??'Pipeline orchestration'}\nEligibility: ${route.eligible}\nMissing capabilities: ${route.missingCapabilities.join(', ')||'none'}`,
    `\nCOMMAND CONTRACT\nWhat: ${command.what}\nWhere: ${command.where}\nHow: ${command.how}\nWhy: ${command.why}\nHidden connection: ${command.hiddenConnection}\nPro move: ${command.proMove}\nUnknown unknowns to investigate: ${command.unknownUnknown}`,
    primitive?`\nEXECUTION PROCEDURE\n${primitive.procedure.map((x,i)=>`${i+1}. ${x}`).join('\n')}`:`\nEXECUTION PROCEDURE\nPlan the pipeline as a dependency graph. Do not execute stages whose conditions or policy gates are unsatisfied.`,
    `\nSAFETY\nRisk level: ${command.riskLevel}. Apply the external risk policy. Read-only commands may not write. Consequential, destructive, production, permission, billing, push, PR, merge, deploy, or external communication actions require explicit approval.`,
    `\nBOUNDED RECOVERY\n${recoveryContract}`,
    `\nVERIFICATION\n${primitive?.verification.map((x)=>`- ${x}`).join('\n')??verificationContract}\n${verificationContract}`,
    `\nOUTPUT\n${resultContract}\nPrompt provenance: ${fragments.join(', ')}`
  ].join('\n');
  return {command,prompt,fragments,route};
}
