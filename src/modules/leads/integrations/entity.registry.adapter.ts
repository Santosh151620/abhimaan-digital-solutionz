import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from '../types/lead.entity';

/**
 * Adapter for global entity registry system
 * Keeps Leads compliant with entityType + entityId contract
 */

export function getLeadEntityKey(entityId: string): string {
  return `${LEAD_ENTITY_TYPE}:${entityId}`;
}

export function mapLeadToRegistry(lead: LeadEntity) {
  return {
    key: getLeadEntityKey(lead.entityId),
    entityType: lead.entityType,
    entityId: lead.entityId,
    payload: lead,
  };
}

export function mapRegistryToLead(registryItem: any): LeadEntity {
  return registryItem.payload as LeadEntity;
}