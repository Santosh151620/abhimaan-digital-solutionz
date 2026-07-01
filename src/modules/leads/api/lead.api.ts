import { LeadEntity, LEAD_ENTITY_TYPE } from '../types/lead.entity';

export interface CreateLeadRequest {
  entityId: string;
  title: string;
  email?: string;
  phone?: string;
  status?: LeadEntity['status'];
  source?: string;
  score?: number;
}

export interface UpdateLeadRequest {
  entityId: string;
  title?: string;
  email?: string;
  phone?: string;
  status?: LeadEntity['status'];
  source?: string;
  score?: number;
}

export async function fetchLeads(): Promise<LeadEntity[]> {
  const res = await fetch('/api/leads');

  if (!res.ok) {
    throw new Error('Failed to fetch leads');
  }

  return res.json();
}

export async function fetchLead(entityId: string): Promise<LeadEntity> {
  const res = await fetch(`/api/leads/${entityId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch lead');
  }

  return res.json();
}

export async function createLead(
  payload: CreateLeadRequest
): Promise<LeadEntity> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entityType: LEAD_ENTITY_TYPE,
      ...payload,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to create lead');
  }

  return res.json();
}

export async function updateLead(
  entityId: string,
  payload: UpdateLeadRequest
): Promise<LeadEntity> {
  const res = await fetch(`/api/leads/${entityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to update lead');
  }

  return res.json();
}