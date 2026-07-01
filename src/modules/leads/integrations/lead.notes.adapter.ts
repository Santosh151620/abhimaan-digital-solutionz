import { LeadEntity } from '../types/lead.entity';

/**
 * Bridges Leads → Unified Notes System
 */

export function mapLeadToNotesContext(lead: LeadEntity) {
  return {
    entityType: 'lead',
    entityId: lead.entityId,
    contextTitle: `Lead: ${lead.title}`,
  };
}