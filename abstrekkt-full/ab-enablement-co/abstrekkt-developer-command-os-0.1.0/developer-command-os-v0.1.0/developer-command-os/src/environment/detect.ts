import { access, readFile, readdir, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { CommandScripts, EnvironmentManifest, GitManifest } from './types.js';
const execFileAsync = promisify(execFile);

async function exists(path: string): Promise<boolean> { try { await access(path); return true; } catch { return false; } }
async function canWrite(path: string): Promise<boolean> { try { await access(path, constants.W_OK); return true; } catch { return false; } }
async function findRoot(start: string): Promise<string> {
  let cursor = resolve(start);
  if (!(await stat(cursor)).isDirectory()) cursor = dirname(cursor);
  while (true) {
    const markers = ['.git','package.json','pyproject.toml','go.mod','Cargo.toml','pnpm-workspace.yaml'];
    if ((await Promise.all(markers.map((m) => exists(join(cursor,m))))).some(Boolean)) return cursor;
    const parent = dirname(cursor); if (parent === cursor) return resolve(start); cursor = parent;
  }
}
async function git(root: string): Promise<GitManifest> {
  try {
    const [top, branch, commit, status] = await Promise.all([
      execFileAsync('git',['rev-parse','--show-toplevel'],{cwd:root}), execFileAsync('git',['branch','--show-current'],{cwd:root}),
      execFileAsync('git',['rev-parse','HEAD'],{cwd:root}), execFileAsync('git',['status','--porcelain'],{cwd:root})
    ]);
    const changedFiles = status.stdout.split('\n').filter(Boolean).map((line) => line.slice(3).trim());
    return { available:true, root:top.stdout.trim(), branch:branch.stdout.trim() || 'DETACHED', commit:commit.stdout.trim(), dirty:changedFiles.length>0, changedFiles };
  } catch { return { available:false }; }
}
function addScript(target: CommandScripts, key: keyof CommandScripts, command: string | undefined) { if (command) target[key].push(command); }
async function parseEnvNames(root: string): Promise<string[]> {
  const names = new Set<string>();
  for (const file of ['.env.example','.env.sample','.env.template']) {
    const path=join(root,file); if (!(await exists(path))) continue;
    const content=await readFile(path,'utf8');
    for (const line of content.split(/\r?\n/)) { const match=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=/); if (match?.[1]) names.add(match[1]); }
  }
  return [...names].sort();
}
export async function detectEnvironment(requestedRoot = process.cwd()): Promise<EnvironmentManifest> {
  const root=await findRoot(requestedRoot); const warnings:string[]=[]; const manifests:string[]=[]; const packageManagers:string[]=[];
  const languages=new Set<string>(); const frameworks=new Set<string>(); const runtimeHints:Record<string,string>={};
  const scripts:CommandScripts={build:[],test:[],lint:[],typecheck:[],format:[],deploy:[]};
  const ciProviders:string[]=[]; const infrastructure:string[]=[]; const deploymentTargets:string[]=[]; const databases=new Set<string>();
  const names=await readdir(root).catch(()=>[]);
  for (const marker of ['package.json','pnpm-lock.yaml','yarn.lock','package-lock.json','bun.lockb','pyproject.toml','requirements.txt','go.mod','Cargo.toml','Dockerfile','docker-compose.yml','docker-compose.yaml','vercel.json','netlify.toml','fly.toml','supabase','firebase.json','pnpm-workspace.yaml']) if (await exists(join(root,marker))) manifests.push(marker);
  if (manifests.includes('pnpm-lock.yaml')) packageManagers.push('pnpm'); if (manifests.includes('yarn.lock')) packageManagers.push('yarn'); if (manifests.includes('package-lock.json')) packageManagers.push('npm'); if (manifests.includes('bun.lockb')) packageManagers.push('bun');
  if (manifests.includes('package.json')) {
    languages.add('TypeScript/JavaScript');
    const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8')) as { packageManager?:string; engines?:Record<string,string>; scripts?:Record<string,string>; dependencies?:Record<string,string>; devDependencies?:Record<string,string> };
    if (pkg.packageManager) packageManagers.push(pkg.packageManager.split('@')[0] ?? pkg.packageManager); if (pkg.engines?.node) runtimeHints.node=pkg.engines.node;
    const deps={...(pkg.dependencies??{}),...(pkg.devDependencies??{})};
    for (const [dep,fw] of [['next','Next.js'],['react','React'],['vue','Vue'],['@angular/core','Angular'],['svelte','Svelte'],['express','Express'],['fastify','Fastify'],['nestjs','NestJS'],['vitest','Vitest'],['jest','Jest'],['@playwright/test','Playwright'],['cypress','Cypress'],['prisma','Prisma'],['@supabase/supabase-js','Supabase'],['firebase','Firebase']] as const) if (deps[dep]) frameworks.add(fw);
    if (deps['@supabase/supabase-js']) databases.add('Supabase/Postgres'); if (deps.firebase) databases.add('Firebase'); if (deps.prisma) databases.add('Prisma-managed database');
    const pm=packageManagers[0] ?? 'npm'; for (const key of Object.keys(pkg.scripts??{})) {
      const cmd=`${pm} run ${key}`; if (/build/.test(key)) addScript(scripts,'build',cmd); if (/test/.test(key)) addScript(scripts,'test',cmd); if (/lint/.test(key)) addScript(scripts,'lint',cmd);
      if (/typecheck|type-check|check:types/.test(key)) addScript(scripts,'typecheck',cmd); if (/format/.test(key)) addScript(scripts,'format',cmd); if (/deploy|release/.test(key)) addScript(scripts,'deploy',cmd);
    }
  }
  if (manifests.includes('pyproject.toml') || manifests.includes('requirements.txt')) { languages.add('Python'); runtimeHints.python='project-defined'; addScript(scripts,'test','pytest'); }
  if (manifests.includes('go.mod')) languages.add('Go'); if (manifests.includes('Cargo.toml')) languages.add('Rust');
  if (await exists(join(root,'.github/workflows'))) ciProviders.push('GitHub Actions'); if (await exists(join(root,'.gitlab-ci.yml'))) ciProviders.push('GitLab CI');
  if (manifests.includes('Dockerfile') || manifests.some((x)=>x.startsWith('docker-compose'))) infrastructure.push('Docker'); if (names.some((x)=>x.endsWith('.tf')) || await exists(join(root,'terraform'))) infrastructure.push('Terraform'); if (await exists(join(root,'k8s')) || await exists(join(root,'kubernetes'))) infrastructure.push('Kubernetes');
  if (manifests.includes('vercel.json') || frameworks.has('Next.js')) deploymentTargets.push('Vercel-compatible'); if (manifests.includes('netlify.toml')) deploymentTargets.push('Netlify'); if (manifests.includes('fly.toml')) deploymentTargets.push('Fly.io');
  if (manifests.includes('supabase')) databases.add('Supabase/Postgres'); if (manifests.includes('firebase.json')) databases.add('Firebase');
  if (packageManagers.length===0 && languages.has('TypeScript/JavaScript')) warnings.push('No lockfile detected; dependency resolution may not be reproducible.');
  const gitManifest=await git(root);
  return { schemaVersion:'1.0.0', detectedAt:new Date().toISOString(), requestedRoot:resolve(requestedRoot), repositoryRoot:gitManifest.root??root, git:gitManifest,
    packageManagers:[...new Set(packageManagers)], languages:[...languages], frameworks:[...frameworks], manifests, runtimeHints, scripts, ciProviders, infrastructure, deploymentTargets,
    databases:[...databases], environmentVariableNames:await parseEnvNames(root), capabilities:{canReadFiles:true,canWriteFiles:await canWrite(root),canRunCommands:true,canUseGit:gitManifest.available,networkAccess:'unknown'}, warnings };
}
