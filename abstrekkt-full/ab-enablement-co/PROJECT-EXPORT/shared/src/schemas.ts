import { z } from 'zod';

export const ConfidenceTagSchema = z.enum(['VERIFIED','INFERRED','ASSUMED']);
export type ConfidenceTag = z.infer<typeof ConfidenceTagSchema>;

export const SourceKindSchema = z.enum(['conversation','upload','repository','document','prompt','report','planning_artifact','design_asset']);
export type SourceKind = z.infer<typeof SourceKindSchema>;

export const CreateProjectRequestSchema = z.object({ name: z.string().min(1).max(120) });
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;

export const CreateSourceRequestSchema = z.object({ kind: SourceKindSchema, title: z.string().min(1).max(240), content: z.string().min(1) });
export type CreateSourceRequest = z.infer<typeof CreateSourceRequestSchema>;

export const GraphNodeSchema = z.object({ id: z.string(), type: z.string().min(1), label: z.string().min(1), confidence: ConfidenceTagSchema, sourceIds: z.array(z.string()).default([]) });
export const GraphEdgeSchema = z.object({ from: z.string(), to: z.string(), relationship: z.string().min(1), confidence: ConfidenceTagSchema, sourceIds: z.array(z.string()).default([]) });
export const KnowledgeGraphSchema = z.object({ nodes: z.array(GraphNodeSchema), edges: z.array(GraphEdgeSchema) });
export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;
