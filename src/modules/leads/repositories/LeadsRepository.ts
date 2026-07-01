import { LeadEntity, LEAD_ENTITY_TYPE } from '../types/lead.entity';
import { BaseRepository } from '@/repositories/base.repository';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface CreateLeadInput {
  id: string;
  title: string;
  email?: string;
  phone?: string;
  status?: LeadEntity['status'];
  source?: string;
  score?: number;
}

export interface UpdateLeadInput {
  id: string;
  title?: string;
  email?: string;
  phone?: string;
  status?: LeadEntity['status'];
  source?: string;
  score?: number;
}

export class LeadsRepository extends BaseRepository<LeadEntity> {
  constructor() {
  super(supabaseAdmin, 'leads');
}

  async createLead(input: CreateLeadInput): Promise<LeadEntity> {
    const now = new Date().toISOString();

    return this.create({
      id: input.id,
      entityType: LEAD_ENTITY_TYPE,
      entityId: input.id,
      title: input.title,
      email: input.email ?? null,
      phone: input.phone ?? null,
      status: input.status ?? 'new',
      source: input.source ?? null,
      score: input.score ?? 0,
      createdAt: now,
      updatedAt: now,
    } as any);
  }

  async updateLead(input: UpdateLeadInput): Promise<LeadEntity> {
    return this.update(input.id, {
      title: input.title,
      email: input.email ?? null,
      phone: input.phone ?? null,
      status: input.status,
      source: input.source ?? null,
      score: input.score,
      updatedAt: new Date().toISOString(),
    } as any);
  }
}