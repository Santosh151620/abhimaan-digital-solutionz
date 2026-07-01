import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from '../types/lead.entity';

/**
 * Bridge layer for future unified entity hooks system
 * (preparing migration to entity-wide hooks engine)
 */

export function useLeadEntitySnapshot(lead: LeadEntity) {
  return {
    entityType: lead.entityType,
    entityId: lead.entityId,
    snapshot: {
      title: lead.title,
      status: lead.status,
      score: lead.score,
      updatedAt: lead.updatedAt,
    },
  };
}

export function useLeadEntityIdentity(entityId: string) {
  return {
    entityType: LEAD_ENTITY_TYPE,
    entityId,
    key: `lead:${entityId}`,
  };
}