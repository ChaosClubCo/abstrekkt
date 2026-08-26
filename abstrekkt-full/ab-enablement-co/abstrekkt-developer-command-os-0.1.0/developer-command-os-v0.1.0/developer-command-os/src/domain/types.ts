export type RiskLevel = 'read_only' | 'low' | 'medium' | 'high' | 'critical';
export type CommandStatus = 'experimental' | 'beta' | 'production' | 'deprecated';
export type CommandKind = 'alias' | 'pipeline';
export type ScopeKind = 'repository' | 'workspace' | 'package' | 'directory' | 'file' | 'diff' | 'service';
export type Capability =
  | 'read_files' | 'write_files' | 'write_docs' | 'run_safe_commands' | 'use_git'
  | 'network_optional' | 'browser_optional' | 'inspect_logs' | 'inspect_metrics'
  | 'inspect_database_schema' | 'analyze_graphs' | 'redact_secrets' | 'checkpoint' | 'rollback';

export interface CapabilityPrimitive {
  id: string;
  version: string;
  title: string;
  description: string;
  defaultRiskLevel: RiskLevel;
  modelProfile: string;
  requiredCapabilities: Capability[];
  allowedScopes: ScopeKind[];
  procedure: string[];
  verification: string[];
  recovery: string[];
}

export interface CommandDefinition {
  index?: number;
  id: string;
  version: string;
  slash: `/${string}`;
  title: string;
  category: string;
  aliases: string[];
  arguments: string[];
  primitiveId?: string;
  kind: CommandKind;
  riskLevel: RiskLevel;
  status: CommandStatus;
  what: string;
  where: string;
  how: string;
  why: string;
  router: string;
  hiddenConnection: string;
  proMove: string;
  unknownUnknown: string;
  source?: { document: string; section: string };
}

export interface PipelineStage {
  id: string;
  commandId: string;
  dependsOn: string[];
  condition?: 'always' | 'findings_present' | 'changes_present' | 'approval_granted' | 'verification_passed';
  optional?: boolean;
}

export interface PipelineDefinition extends CommandDefinition {
  kind: 'pipeline';
  stages: PipelineStage[];
}

export interface PlatformCapabilities {
  platformId: string;
  readFiles: boolean;
  writeFiles: boolean;
  runCommands: boolean;
  useGit: boolean;
  browseWeb: boolean;
  createPullRequest: boolean;
  persistentMemory: boolean;
  structuredOutput: boolean;
}

export interface CommandInvocation {
  command: string;
  goal?: string;
  scope?: string;
  constraints?: string[];
  arguments?: Record<string, string | number | boolean | string[]>;
  approvalMode?: 'read_only' | 'ask_before_write' | 'preapproved_within_policy';
  outputFormat?: 'markdown' | 'json' | 'both';
}
