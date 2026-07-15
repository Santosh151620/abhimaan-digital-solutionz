import { LeadEntity } from '../types/lead.entity';

/**
 * Sync adapter for external systems (future CRM integrations)
 */

export interface LeadSyncPayload {
  entityType: 'lead';
  entityId: string;
  payload: LeadEntity;
}

export function toSyncPayload(lead: LeadEntity): LeadSyncPayload {
  return {
    entityType: 'lead',
    entityId: lead.entityId,
    payload: lead,
  };
}

export function fromSyncPayload(payload: LeadSyncPayload): LeadEntity {
  return payload.payload;
}





