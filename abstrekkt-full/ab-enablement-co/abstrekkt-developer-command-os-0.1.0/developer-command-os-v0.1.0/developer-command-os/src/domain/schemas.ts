import { z } from 'zod';

export const RiskLevelSchema = z.enum(['read_only','low','medium','high','critical']);
export const CommandStatusSchema = z.enum(['experimental','beta','production','deprecated']);
export const ScopeKindSchema = z.enum(['repository','workspace','package','directory','file','diff','service']);
export const CapabilitySchema = z.enum(['read_files','write_files','write_docs','run_safe_commands','use_git','network_optional','browser_optional','inspect_logs','inspect_metrics','inspect_database_schema','analyze_graphs','redact_secrets','checkpoint','rollback']);

export const CapabilityPrimitiveSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), version: z.string(), title: z.string().min(3), description: z.string().min(10),
  defaultRiskLevel: RiskLevelSchema, modelProfile: z.string().min(3), requiredCapabilities: z.array(CapabilitySchema).min(1),
  allowedScopes: z.array(ScopeKindSchema).min(1), procedure: z.array(z.string()).min(3), verification: z.array(z.string()).min(2), recovery: z.array(z.string()).min(2)
});

export const CommandDefinitionSchema = z.object({
  index: z.number().int().positive().optional(), id: z.string().regex(/^[a-z0-9-]+$/), version: z.string(), slash: z.string().regex(/^\/[a-z0-9-]+$/),
  title: z.string().min(3), category: z.string().min(2), aliases: z.array(z.string().regex(/^[a-z0-9-]+$/)), arguments: z.array(z.string().regex(/^--[a-z0-9-]+$/)),
  primitiveId: z.string().regex(/^[a-z0-9-]+$/).optional(), kind: z.enum(['alias','pipeline']), riskLevel: RiskLevelSchema, status: CommandStatusSchema,
  what: z.string().min(5), where: z.string().min(2), how: z.string().min(5), why: z.string().min(5), router: z.string().min(3), hiddenConnection: z.string().min(3),
  proMove: z.string().min(3), unknownUnknown: z.string().min(3), source: z.object({ document: z.string(), section: z.string() }).optional()
});
