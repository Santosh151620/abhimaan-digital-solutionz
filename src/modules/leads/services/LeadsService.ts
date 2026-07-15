import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Lead,
  LeadStatus,
  LeadTimeline,
} from "../types/lead";

import {
  CreateLeadInput,
  UpdateLeadInput,
} from "../repositories/LeadsRepository";

import { LeadsRepository } from "../repositories/LeadsRepository";

export class LeadsService {
  private readonly repo: LeadsRepository;

  constructor(supabase: SupabaseClient) {
    this.repo = new LeadsRepository(supabase);
  }

  async listLeads(): Promise<Lead[]> {
    return this.repo.listLeads();
  }
async createLead(input: CreateLeadInput) {
  return this.repo.createLead(input);
}
  async getLead(id: string): Promise<Lead | null> {
    return this.repo.getLead(id);
  }

  async upsertLead(input: CreateLeadInput & { id?: string }): Promise<Lead> {
    if (input.id) {
      return this.repo.updateLead(input.id, input as UpdateLeadInput);
    }

    return this.repo.createLead(input);
  }

  async updateLead(id: string, input: UpdateLeadInput): Promise<Lead> {
    return this.repo.updateLead(id, input);
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    return this.repo.updateStatus(id, status);
  }

  async deleteLead(id: string): Promise<void> {
    return this.repo.deleteLead(id);
  }

  async listTimeline(leadId: string): Promise<LeadTimeline[]> {
    return this.repo.listTimeline(leadId);
  }

  async addTimelineEntry(
    leadId: string,
    message: string,
    eventType: LeadTimeline["event_type"]
  ): Promise<void> {
    return this.repo.addTimelineEntry(leadId, message, eventType);
  }
}





