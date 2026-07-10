import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from "../types/lead.entity";

/**
 * Lead Entity Adapter
 *
 * Canonical adapter between raw database objects and
 * LeadEntity domain objects.
 */

export function isLeadEntity(value: unknown): value is LeadEntity {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entity = value as Partial<LeadEntity>;

  return (
    entity.entityType === LEAD_ENTITY_TYPE &&
    typeof entity.entityId === "string" &&
    entity.entityId.length > 0 &&
    typeof entity.title === "string" &&
    typeof entity.createdAt === "string" &&
    typeof entity.updatedAt === "string"
  );
}

export function assertLeadEntity(
  value: unknown
): asserts value is LeadEntity {
  if (!isLeadEntity(value)) {
    throw new Error("Invalid LeadEntity");
  }
}

export function normalizeLeadEntity(
  value: unknown
): LeadEntity {
  assertLeadEntity(value);

  return {
    entityType: LEAD_ENTITY_TYPE,
    entityId: value.entityId,
    title: value.title.trim(),

    email: value.email ?? undefined,
    phone: value.phone ?? undefined,

    status: value.status ?? "new",

    source: value.source ?? undefined,
    score: value.score ?? 0,

    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}
