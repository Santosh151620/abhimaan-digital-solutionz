export const LEAD_ENTITY_TYPE = 'lead' as const;

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'lost'
  | 'converted';

export interface LeadEntity {
  entityType: typeof LEAD_ENTITY_TYPE;
  entityId: string;

  title: string;
  email?: string;
  phone?: string;

  status: LeadStatus;

  source?: string;
  score?: number;

  createdAt: string;
  updatedAt: string;
}





