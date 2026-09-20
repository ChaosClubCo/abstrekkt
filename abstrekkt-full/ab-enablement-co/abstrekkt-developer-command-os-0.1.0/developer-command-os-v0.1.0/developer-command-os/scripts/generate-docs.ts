import { mkdir, writeFile } from 'node:fs/promises';
import { allCommands, capabilityPrimitives, validateRegistry } from '../src/registry/index.js';
await mkdir('docs/generated',{recursive:true}); validateRegistry();
const lines=['# Generated Command Registry','','> Generated from the authoritative TypeScript registry. Do not edit manually.','',`Commands: ${allCommands.length}  `,`Capability primitives: ${capabilityPrimitives.length}`,''];
for (const category of [...new Set(allCommands.map((c)=>c.category))]) { lines.push(`## ${category}`,''); for (const c of allCommands.filter((x)=>x.category===category)) lines.push(`### ${c.slash} — ${c.title}`,'',`- Version: ${c.version}`,`- Kind: ${c.kind}`,`- Risk: ${c.riskLevel}`,`- Status: ${c.status}`,`- Primitive: ${c.primitiveId??'pipeline'}`,`- Aliases: ${c.aliases.map((a)=>`/${a}`).join(', ')||'none'}`,'',c.what,''); }
await writeFile('docs/generated/COMMANDS.md',lines.join('\n')); await writeFile('docs/generated/registry-summary.json',JSON.stringify({generatedAt:new Date().toISOString(),commands:allCommands.length,primitives:capabilityPrimitives.length},null,2));
console.log('Generated docs/generated/COMMANDS.md');
