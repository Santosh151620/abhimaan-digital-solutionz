import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from "../types/lead.entity";

export interface RegistryLeadItem {
  key: string;
  entityType: typeof LEAD_ENTITY_TYPE;
  entityId: string;
  payload: LeadEntity;
}

/**
 * Lead â†” Entity Registry Adapter
 *
 * Canonical mapping between the Leads module and the
 * global Entity Registry.
 */

export function getLeadEntityKey(
  entityId: string
): string {
  return `${LEAD_ENTITY_TYPE}:${entityId}`;
}

export function mapLeadToRegistry(
  lead: LeadEntity
): RegistryLeadItem {
  return {
    key: getLeadEntityKey(lead.entityId),
    entityType: LEAD_ENTITY_TYPE,
    entityId: lead.entityId,
    payload: lead,
  };
}

export function mapRegistryToLead(
  item: RegistryLeadItem
): LeadEntity {
  if (item.entityType !== LEAD_ENTITY_TYPE) {
    throw new Error(
      `Expected entity type "${LEAD_ENTITY_TYPE}" but received "${item.entityType}".`
    );
  }

  return item.payload;
}

export function isRegistryLeadItem(
  value: unknown
): value is RegistryLeadItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<RegistryLeadItem>;

  return (
    item.entityType === LEAD_ENTITY_TYPE &&
    typeof item.entityId === "string" &&
    typeof item.key === "string" &&
    !!item.payload
  );
}
