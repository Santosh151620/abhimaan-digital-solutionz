import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { LeadsRepository } from "../repositories/LeadsRepository";
import { LeadEntity } from "../types/lead.entity";

export class LeadsService {
  /**
   * Repository factory.
   *
   * One Supabase client per request.
   * Reused across all repository operations.
   */
  private async repository(): Promise<LeadsRepository> {
    const supabase = await createSupabaseServerClient();

    return new LeadsRepository(supabase);
  }

  async getLead(
    id: string,
  ): Promise<LeadEntity | null> {
    const repo = await this.repository();

    return repo.getLead(id);
  }

  async listLeads(): Promise<LeadEntity[]> {
    const repo = await this.repository();

    return repo.listLeads();
  }

  async upsertLead(input: {
    entityId: string;
    title: string;
    email?: string;
    phone?: string;
    status?: LeadEntity["status"];
    source?: string;
    score?: number;
  }): Promise<LeadEntity> {
    const repo = await this.repository();

    return repo.createLead({
      id: input.entityId,
      title: input.title,
      email: input.email,
      phone: input.phone,
      status: input.status,
      source: input.source,
      score: input.score,
    });
  }

  async updateLead(input: {
    entityId: string;
    title?: string;
    email?: string;
    phone?: string;
    status?: LeadEntity["status"];
    source?: string;
    score?: number;
  }): Promise<LeadEntity> {
    const repo = await this.repository();

    return repo.updateLead({
      id: input.entityId,
      title: input.title,
      email: input.email,
      phone: input.phone,
      status: input.status,
      source: input.source,
      score: input.score,
    });
  }

  /**
   * Centralized status update.
   *
   * Every status change in the CRM should eventually
   * route through this method.
   *
   * Future additions (without changing callers):
   * - Timeline
   * - Activity Log
   * - Workflow Engine
   * - Notifications
   * - Automations
   * - Webhooks
   * - Analytics
   */
  async updateStatus(
    leadId: string,
    status: LeadEntity["status"],
  ): Promise<LeadEntity> {
    const repo = await this.repository();

    return repo.updateStatus(
      leadId,
      status,
    );
  }
}