import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
  Lead,
  LeadStatus,
  LeadTimeline,
} from "../types/lead";

export interface CreateLeadInput {
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service_interest?: string | null;
  message?: string | null;
  source?: string | null;
  status?: LeadStatus;
  client_id?: string | null;
}

export interface UpdateLeadInput {
  full_name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  service_interest?: string | null;
  message?: string | null;
  source?: string | null;
  status?: LeadStatus;
  client_id?: string | null;
}

export class LeadsRepository extends BaseRepository<Lead> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "leads");
  }

  async getLead(id: string): Promise<Lead | null> {
    return this.findById(id);
  }

  async listLeads(): Promise<Lead[]> {
    const { data, error } = await this.tableRef()
      .select("*")
      .eq("organization_id", this.organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []) as Lead[];
  }

  async createLead(input: CreateLeadInput): Promise<Lead> {
    return this.create({
      ...input,
      full_name: input.full_name.trim(),
      status: input.status ?? "new",
      phone: input.phone ?? null,
      company: input.company ?? null,
      service_interest: input.service_interest ?? null,
      message: input.message ?? null,
      source: input.source ?? null,
      client_id: input.client_id ?? null,
    });
  }

  async updateLead(
    id: string,
    input: UpdateLeadInput
  ): Promise<Lead> {
    return this.update(id, input);
  }

  async updateStatus(
    id: string,
    status: LeadStatus
  ): Promise<Lead> {
    return this.update(id, { status });
  }

  async listTimeline(
    leadId: string
  ): Promise<LeadTimeline[]> {
    const { data, error } = await this.supabase
      .from("lead_activity_timeline")
      .select("*")
      .eq("organization_id", this.organizationId)
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []) as LeadTimeline[];
  }

  async addTimelineEntry(
    leadId: string,
    message: string,
    eventType: LeadTimeline["event_type"]
  ): Promise<void> {
    const { error } = await this.supabase
      .from("lead_activity_timeline")
      .insert({
        organization_id: this.organizationId,
        lead_id: leadId,
        message,
        event_type: eventType,
      });

    if (error) throw error;
  }

  async deleteLead(id: string): Promise<void> {
    await this.delete(id);
  }
}




