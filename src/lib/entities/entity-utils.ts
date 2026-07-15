import type { EntityReference } from "@/types/base";

export function createEntityReference(
  entityType: string,
  entityId: string,
): EntityReference {
  return {
    entityType,
    entityId,
  };
}

export function getEntityKey(
  reference: EntityReference,
): string {
  return `${reference.entityType}:${reference.entityId}`;
}

export function isEntityReference(
  value: unknown,
): value is EntityReference {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.entityType === "string" &&
    typeof candidate.entityId === "string"
  );
}





