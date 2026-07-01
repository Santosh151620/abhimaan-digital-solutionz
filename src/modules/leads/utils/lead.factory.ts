import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from '../types/lead.entity';

export function createEmptyLead(entityId: string): LeadEntity {
  return {
    entityType: LEAD_ENTITY_TYPE,
    entityId,
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

export function createLeadFromPartial(
  partial: Partial<LeadEntity> & { entityId: string }
): LeadEntity {
  return {
    entityType: 'lead',
    entityId: partial.entityId,
    title: partial.title ?? '',
    email: partial.email,
    phone: partial.phone,
    status: partial.status ?? 'new',
    source: partial.source,
    score: partial.score ?? 0,
    createdAt: partial.createdAt ?? new Date().toISOString(),
    updatedAt: partial.updatedAt ?? new Date().toISOString(),
  };
}