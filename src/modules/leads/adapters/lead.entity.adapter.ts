import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from '../types/lead.entity';

/**
 * Entity adapter ensures strict entity-first compliance
 * for future migration into unified CRM entity registry
 */

export function assertLeadEntity(entity: unknown): asserts entity is LeadEntity {
  if (!entity || typeof entity !== 'object') {
    throw new Error('Invalid LeadEntity');
  }

  const e = entity as Partial<LeadEntity>;

  if (e.entityType !== LEAD_ENTITY_TYPE) {
    throw new Error('Invalid entityType for LeadEntity');
  }

  if (!e.entityId) {
    throw new Error('Missing entityId');
  }
}

export function normalizeLeadEntity(entity: any): LeadEntity {
  assertLeadEntity(entity);

  return {
    entityType: LEAD_ENTITY_TYPE,
    entityId: entity.entityId,
    title: entity.title ?? '',
    email: entity.email,
    phone: entity.phone,
    status: entity.status ?? 'new',
    source: entity.source,
    score: entity.score,
    createdAt: entity.createdAt ?? new Date().toISOString(),
    updatedAt: entity.updatedAt ?? new Date().toISOString(),
  };
}