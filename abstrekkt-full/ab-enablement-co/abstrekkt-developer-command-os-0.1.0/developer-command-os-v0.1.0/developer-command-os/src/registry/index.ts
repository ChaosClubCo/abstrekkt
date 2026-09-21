import { CommandDefinitionSchema, CapabilityPrimitiveSchema } from '../domain/schemas.js';
import type { CommandDefinition, PipelineDefinition } from '../domain/types.js';
import { commandDefinitions } from './commands.generated.js';
import { capabilityPrimitives, primitiveById } from './primitives.js';
import { pipelineDefinitions } from './pipelines.js';

export const allCommands: readonly (CommandDefinition | PipelineDefinition)[] = [...commandDefinitions, ...pipelineDefinitions];
const commandMap = new Map<string, CommandDefinition | PipelineDefinition>();
for (const command of allCommands) {
  for (const key of [command.id, command.slash, ...command.aliases, ...command.aliases.map((alias) => `/${alias}`)]) {
    if (commandMap.has(key)) throw new Error(`Duplicate command or alias: ${key}`);
    commandMap.set(key, command);
  }
}

export function resolveCommand(input: string): CommandDefinition | PipelineDefinition {
  const normalized = input.trim();
  const direct = commandMap.get(normalized) ?? commandMap.get(normalized.replace(/^\//, ''));
  if (!direct) throw new Error(`Unknown command: ${input}`);
  return direct;
}

export function getPrimitive(command: CommandDefinition) {
  if (!command.primitiveId) return undefined;
  return primitiveById.get(command.primitiveId);
}

export function validateRegistry(): { commands: number; pipelines: number; primitives: number } {
  capabilityPrimitives.forEach((primitive) => CapabilityPrimitiveSchema.parse(primitive));
  allCommands.forEach((command) => CommandDefinitionSchema.parse(command));
  for (const command of commandDefinitions) {
    if (!primitiveById.has(command.primitiveId)) throw new Error(`Missing primitive ${command.primitiveId} for ${command.id}`);
  }
  return { commands: commandDefinitions.length, pipelines: pipelineDefinitions.length, primitives: capabilityPrimitives.length };
}

export { commandDefinitions, capabilityPrimitives, pipelineDefinitions };
