import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from "../types/lead.entity";

interface ApiLead {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  status: LeadEntity["status"];
  source?: string | null;
  created_at?: string;
}

function mapLead(input: ApiLead): LeadEntity {
  return {
    entityType: LEAD_ENTITY_TYPE,
    entityId: input.id,
    title: input.full_name,
    email: input.email,
    phone: input.phone ?? undefined,
    status: input.status,
    source: input.source ?? undefined,
    createdAt: input.created_at ?? new Date().toISOString(),
    updatedAt: input.created_at ?? new Date().toISOString(),
  };
}

export interface CreateLeadRequest {
  entityId: string;
  title: string;
  email?: string;
  phone?: string;
  status?: LeadEntity["status"];
  source?: string;
  score?: number;
}

export interface UpdateLeadRequest {
  entityId: string;
  title?: string;
  email?: string;
  phone?: string;
  status?: LeadEntity["status"];
  source?: string;
  score?: number;
}

export async function fetchLeads(): Promise<LeadEntity[]> {
  const res = await fetch("/api/leads");

  if (!res.ok) {
    throw new Error("Failed to fetch leads");
  }

  const data = await res.json();

  return Array.isArray(data)
    ? data.map(mapLead)
    : [];
}

export async function fetchLead(entityId: string): Promise<LeadEntity> {
  const res = await fetch(`/api/leads/${entityId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch lead");
  }

  return mapLead(await res.json());
}

export async function createLead(
  payload: CreateLeadRequest
): Promise<LeadEntity> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: payload.title,
      email: payload.email ?? "",
      phone: payload.phone,
      status: payload.status,
      source: payload.source,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create lead");
  }

  return mapLead(await res.json());
}

export async function updateLead(
  entityId: string,
  payload: UpdateLeadRequest
): Promise<LeadEntity> {
  const res = await fetch(`/api/leads/${entityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: payload.title,
      email: payload.email,
      phone: payload.phone,
      status: payload.status,
      source: payload.source,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update lead");
  }

  return mapLead(await res.json());
}