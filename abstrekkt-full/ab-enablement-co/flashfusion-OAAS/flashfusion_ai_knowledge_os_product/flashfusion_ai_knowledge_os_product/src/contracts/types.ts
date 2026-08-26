export type UUID = string;

export type EntityStatus =
  | "proposed"
  | "active"
  | "validated"
  | "stale"
  | "deprecated"
  | "archived"
  | "deleted"
  | "quarantined"
  | "unresolved";

export type VisibilityScope = "private" | "team" | "organization" | "tenant" | "public";

export interface CanonicalEntity {
  id: UUID;
  tenant_id: UUID;
  entity_type: string;
  name: string;
  description?: string | null;
  owner_id?: UUID | null;
  status: EntityStatus;
  source_system?: string | null;
  source_record_id?: string | null;
  provenance_id?: UUID | null;
  confidence_score: number;
  visibility_scope: VisibilityScope;
  lifecycle_state: EntityStatus;
  attributes: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Relationship {
  id: UUID;
  tenant_id: UUID;
  source_entity_id: UUID;
  target_entity_id: UUID;
  relationship_type: string;
  directionality: "directed" | "bidirectional";
  confidence_score: number;
  provenance_id?: UUID | null;
  valid_from?: string | null;
  valid_to?: string | null;
  status: EntityStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProvenanceRecord {
  id: UUID;
  tenant_id: UUID;
  source_system?: string | null;
  source_uri?: string | null;
  source_record_id?: string | null;
  source_title?: string | null;
  ingested_at: string;
  transformed_by?: UUID | null;
  confidence_score?: number | null;
  metadata: Record<string, unknown>;
}

export interface PromptRecord {
  id: UUID;
  tenant_id: UUID;
  name: string;
  prompt_type: string;
  version: string;
  owner_id?: UUID | null;
  status: "draft" | "review" | "test" | "active" | "deprecated" | "archived" | "superseded";
  intended_model?: string | null;
  scope?: string | null;
  body: string;
  checksum: string;
  known_failure_modes?: string[];
  evaluation_status: "untested" | "passed" | "failed" | "needs_review";
  rollback_prompt_id?: UUID | null;
}

export interface AgentRun {
  id: UUID;
  tenant_id: UUID;
  agent_id?: UUID | null;
  actor_id?: UUID | null;
  task_type: string;
  input_summary?: string | null;
  output_summary?: string | null;
  confidence_score?: number | null;
  status: "started" | "completed" | "failed" | "quarantined";
  started_at: string;
  completed_at?: string | null;
  metadata: Record<string, unknown>;
}
