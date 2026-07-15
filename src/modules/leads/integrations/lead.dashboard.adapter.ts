import { LeadEntity } from '../types/lead.entity';

/**
 * Converts Leads â†’ Dashboard Aggregation Layer
 */

export function mapLeadToDashboardItem(lead: LeadEntity) {
  return {
    entityType: 'lead',
    entityId: lead.entityId,
    title: lead.title,
    status: lead.status,
    score: lead.score ?? 0,
    updatedAt: lead.updatedAt,
  };
}

export function aggregateLeadMetrics(leads: LeadEntity[]) {
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    lost: leads.filter((l) => l.status === 'lost').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  };
}





