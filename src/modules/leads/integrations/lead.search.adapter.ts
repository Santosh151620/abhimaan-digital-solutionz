import { LeadEntity } from '../types/lead.entity';

/**
 * SEARCH INDEX ADAPTER
 * Prepares Leads for global entity search engine
 */

export function mapLeadToSearchDocument(lead: LeadEntity) {
  return {
    entityType: 'lead',
    entityId: lead.entityId,

    title: lead.title,
    description: `${lead.email ?? ''} ${lead.phone ?? ''} ${lead.source ?? ''}`,

    metadata: {
      status: lead.status,
      score: lead.score,
    },

    updatedAt: lead.updatedAt,
  };
}
