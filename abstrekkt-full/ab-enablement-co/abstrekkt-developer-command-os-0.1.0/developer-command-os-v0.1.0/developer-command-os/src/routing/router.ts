import type { CommandDefinition, PlatformCapabilities } from '../domain/types.js';
import { getPrimitive } from '../registry/index.js';
export interface RouteDecision { commandId:string; primitiveId?:string; modelProfile:string; eligible:boolean; missingCapabilities:string[]; rationale:string[]; }
const capabilityMap: Record<string,keyof PlatformCapabilities|undefined>={read_files:'readFiles',write_files:'writeFiles',write_docs:'writeFiles',run_safe_commands:'runCommands',use_git:'useGit',browser_optional:'browseWeb'};
export function routeCommand(command: CommandDefinition, platform: PlatformCapabilities): RouteDecision {
  const primitive=getPrimitive(command); if (!primitive) return {commandId:command.id,modelProfile:'pipeline-orchestrator',eligible:true,missingCapabilities:[],rationale:['Pipeline commands are planned by the pipeline engine.']};
  const missing=primitive.requiredCapabilities.flatMap((cap)=>{ const key=capabilityMap[cap]; return key && !platform[key] ? [cap] : []; });
  return {commandId:command.id,primitiveId:primitive.id,modelProfile:primitive.modelProfile,eligible:missing.length===0,missingCapabilities:missing,rationale:[`Mapped to ${primitive.title}.`,missing.length?`Missing required capabilities: ${missing.join(', ')}.`:'All required platform capabilities are available.']};
}
