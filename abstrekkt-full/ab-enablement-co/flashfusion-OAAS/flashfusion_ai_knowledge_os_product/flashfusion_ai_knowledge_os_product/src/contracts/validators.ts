import type { CanonicalEntity, Relationship, PromptRecord } from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEntity(entity: CanonicalEntity): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!entity.id) errors.push("Entity id is required.");
  if (!entity.tenant_id) errors.push("tenant_id is required.");
  if (!entity.entity_type) errors.push("entity_type is required.");
  if (!entity.name) errors.push("name is required.");

  if (entity.confidence_score < 0 || entity.confidence_score > 1) {
    errors.push("confidence_score must be between 0 and 1.");
  }

  if (!entity.provenance_id) {
    warnings.push("Entity has no provenance_id.");
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function validateRelationship(
  relationship: Relationship,
  entityIds: Set<string>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!entityIds.has(relationship.source_entity_id)) {
    errors.push("source_entity_id does not resolve.");
  }

  if (!entityIds.has(relationship.target_entity_id)) {
    errors.push("target_entity_id does not resolve.");
  }

  if (!relationship.provenance_id) {
    warnings.push("Relationship has no provenance_id.");
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function validatePrompt(prompt: PromptRecord): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!prompt.name) errors.push("Prompt name is required.");
  if (!prompt.version) errors.push("Prompt version is required.");
  if (!prompt.body) errors.push("Prompt body is required.");
  if (!prompt.checksum) errors.push("Prompt checksum is required.");
  if (prompt.evaluation_status === "untested") {
    warnings.push("Prompt is untested.");
  }

  return { ok: errors.length === 0, errors, warnings };
}
