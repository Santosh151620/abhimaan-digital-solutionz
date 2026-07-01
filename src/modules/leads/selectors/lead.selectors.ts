import { LeadEntity } from '../types/lead.entity';

export function selectLeadById(
  leads: LeadEntity[],
  entityId: string
): LeadEntity | undefined {
  return leads.find((l) => l.entityId === entityId);
}

export function selectLeadsByStatus(
  leads: LeadEntity[],
  status: LeadEntity['status']
): LeadEntity[] {
  return leads.filter((l) => l.status === status);
}

export function selectLeadCountByStatus(
  leads: LeadEntity[],
  status: LeadEntity['status']
): number {
  return leads.filter((l) => l.status === status).length;
}

export function selectLeadScoreAverage(leads: LeadEntity[]): number {
  if (!leads.length) return 0;

  const sum = leads.reduce((acc, l) => acc + (l.score ?? 0), 0);
  return sum / leads.length;
}