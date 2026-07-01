import { LeadStatus } from '../types/lead.entity';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  lost: 'Lost',
  converted: 'Converted',
};

export function getLeadStatusLabel(status: LeadStatus): string {
  return LEAD_STATUS_LABELS[status];
}

export function isLeadActive(status: LeadStatus): boolean {
  return status === 'new' || status === 'contacted' || status === 'qualified';
}

export function isLeadClosed(status: LeadStatus): boolean {
  return status === 'lost' || status === 'converted';
}