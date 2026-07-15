import { LeadEntity } from '../types/lead.entity';

/**
 * Bridges Leads â†’ Unified Activity System
 * (Entity-driven timeline integration)
 */

export function mapLeadToActivity(lead: LeadEntity) {
  return {
    entityType: 'lead',
    entityId: lead.entityId,

    title: `Lead Updated: ${lead.title}`,
    description: `Status: ${lead.status}`,
    metadata: {
      email: lead.email,
      phone: lead.phone,
      score: lead.score,
      source: lead.source,
    },

    createdAt: lead.updatedAt,
  };
}





