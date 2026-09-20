#!/usr/bin/env node
import { detectEnvironment } from './environment/detect.js';
import { compilePrompt } from './compiler/promptCompiler.js';
import { allCommands, pipelineDefinitions, resolveCommand, validateRegistry } from './registry/index.js';
import { topologicalPlan } from './execution/pipelineEngine.js';
const [action,...args]=process.argv.slice(2); const rootFlag=args.indexOf('--root'); const root=rootFlag>=0?args[rootFlag+1]:process.cwd();
const platform={platformId:'local-cli',readFiles:true,writeFiles:true,runCommands:true,useGit:true,browseWeb:false,createPullRequest:false,persistentMemory:false,structuredOutput:true};
try {
  if (action==='list') console.log(allCommands.map((c)=>`${c.slash}\t${c.title}\t${c.status}`).join('\n'));
  else if (action==='validate') console.log(JSON.stringify(validateRegistry(),null,2));
  else if (action==='env') console.log(JSON.stringify(await detectEnvironment(root),null,2));
  else if (action==='compile') { const command=args[0]; if (!command) throw new Error('Usage: compile <command> [--root path]'); const env=await detectEnvironment(root); console.log(compilePrompt({command},env,platform).prompt); }
  else if (action==='plan') { const command=resolveCommand(args[0]??''); if (command.kind!=='pipeline' || !('stages' in command)) throw new Error('plan requires a pipeline command'); console.log(JSON.stringify(topologicalPlan(command),null,2)); }
  else console.log('Usage: dev-command-os <list|validate|env|compile|plan>');
} catch (error) { console.error(error instanceof Error?error.message:String(error)); process.exitCode=1; }
