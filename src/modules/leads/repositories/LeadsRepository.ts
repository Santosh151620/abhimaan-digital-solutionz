import { BaseRepository } from "@/repositories/base.repository";
import { supabaseAdmin } from "@/lib/supabase/admin";

import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from "../types/lead.entity";

export interface CreateLeadInput {
  id: string;
  title: string;
  email?: string;
  phone?: string;
  status?: LeadEntity["status"];
  source?: string;
  score?: number;
}

export interface UpdateLeadInput {
  id: string;
  title?: string;
  email?: string;
  phone?: string;
  status?: LeadEntity["status"];
  source?: string;
  score?: number;
}

export class LeadsRepository extends BaseRepository<LeadEntity> {
  constructor() {
    super(supabaseAdmin, "leads");
  }

  async getLead(id: string): Promise<LeadEntity | null> {
    return this.findById(id);
  }

 async listLeads(): Promise<LeadEntity[]> {
  const { data, error } = await this.supabase
    .from(this.table)
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as LeadEntity[];
}

  async createLead(
    input: CreateLeadInput
  ): Promise<LeadEntity> {
    const now = new Date().toISOString();

    const lead: LeadEntity = {
      entityType: LEAD_ENTITY_TYPE,
      entityId: input.id,

      title: input.title.trim(),

      email: input.email,
      phone: input.phone,

      status: input.status ?? "new",

      source: input.source,
      score: input.score ?? 0,

      createdAt: now,
      updatedAt: now,
    };

    return this.create(lead);
  }

  async updateLead(
    input: UpdateLeadInput
  ): Promise<LeadEntity> {
    const updates: Partial<LeadEntity> = {
      title: input.title?.trim(),
      email: input.email,
      phone: input.phone,
      status: input.status,
      source: input.source,
      score: input.score,
      updatedAt: new Date().toISOString(),
    };

    return this.update(input.id, updates);
  }

  async deleteLead(id: string): Promise<void> {
    await this.delete(id);
  }
}