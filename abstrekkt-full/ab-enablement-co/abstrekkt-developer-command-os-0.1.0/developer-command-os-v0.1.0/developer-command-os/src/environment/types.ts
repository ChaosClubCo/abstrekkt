export interface GitManifest { available: boolean; root?: string; branch?: string; commit?: string; dirty?: boolean; changedFiles?: string[]; }
export interface CommandScripts { build: string[]; test: string[]; lint: string[]; typecheck: string[]; format: string[]; deploy: string[]; }
export interface EnvironmentManifest {
  schemaVersion: '1.0.0'; detectedAt: string; requestedRoot: string; repositoryRoot: string;
  git: GitManifest; packageManagers: string[]; languages: string[]; frameworks: string[]; manifests: string[];
  runtimeHints: Record<string,string>; scripts: CommandScripts; ciProviders: string[]; infrastructure: string[];
  deploymentTargets: string[]; databases: string[]; environmentVariableNames: string[];
  capabilities: { canReadFiles: boolean; canWriteFiles: boolean; canRunCommands: boolean; canUseGit: boolean; networkAccess: 'unknown' | 'available' | 'unavailable'; };
  warnings: string[];
}
