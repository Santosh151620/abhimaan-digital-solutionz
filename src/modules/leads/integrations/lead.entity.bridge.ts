import { LeadEntity } from '../types/lead.entity';

/**
 * ENTITY BRIDGE LAYER
 * Ensures Leads module conforms to global entity-driven CRM system
 */

export type LeadEntityRef = {
  entityType: 'lead';
  entityId: string;
};

export function toEntityRef(lead: LeadEntity): LeadEntityRef {
  return {
    entityType: 'lead',
    entityId: lead.entityId,
  };
}

export function fromEntityRef(ref: LeadEntityRef): LeadEntity {
  return {
    entityType: 'lead',
    entityId: ref.entityId,
    title: '',
    email: '',
    phone: '',
    status: 'new',
    source: '',
    score: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}