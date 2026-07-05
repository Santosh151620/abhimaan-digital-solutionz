import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from '../types/lead.entity';

/**
 * Bridges Leads â†’ Unified Notes System
 */

export function mapLeadToNotesContext(lead: LeadEntity) {
  return {
    entityType: LEAD_ENTITY_TYPE,
    entityId: lead.entityId,
    contextTitle: `Lead: ${lead.title}`,
  };
}
