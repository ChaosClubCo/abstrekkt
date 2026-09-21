import type { CanonicalEntity, Relationship, UUID } from "./types";

export interface RuntimeContext {
  tenant_id: UUID;
  actor_id: UUID;
  actor_type: "human" | "agent" | "system";
  permission_level: number;
  request_id: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function assertTenantScope(ctx: RuntimeContext, entity: { tenant_id: UUID }): ValidationResult {
  if (ctx.tenant_id !== entity.tenant_id) {
    return {
      ok: false,
      errors: ["Tenant scope violation"],
      warnings: [],
    };
  }

  return { ok: true, errors: [], warnings: [] };
}

export function canMutate(ctx: RuntimeContext, requiredLevel = 5): boolean {
  return ctx.permission_level >= requiredLevel;
}

export function requireConfidence(score: number, minimum = 0.7): ValidationResult {
  if (score < minimum) {
    return {
      ok: false,
      errors: [`Confidence ${score} below required minimum ${minimum}`],
      warnings: ["Review required before action"],
    };
  }

  return { ok: true, errors: [], warnings: [] };
}

export function validateRelationshipTenant(
  relationship: Relationship,
  source: CanonicalEntity,
  target: CanonicalEntity
): ValidationResult {
  const errors: string[] = [];

  if (relationship.tenant_id !== source.tenant_id) {
    errors.push("Relationship tenant does not match source entity tenant.");
  }

  if (relationship.tenant_id !== target.tenant_id) {
    errors.push("Relationship tenant does not match target entity tenant.");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings: [],
  };
}
