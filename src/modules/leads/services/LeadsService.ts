import { LeadsRepository } from "../repositories/LeadsRepository";
import { LeadEntity } from "../types/lead.entity";

export class LeadsService {
  private repo: LeadsRepository;

  constructor() {
    this.repo = new LeadsRepository();
  }

  async getLead(id: string): Promise<LeadEntity | null> {
    return this.repo.getLead(id);
  }

  async listLeads(): Promise<LeadEntity[]> {
    return this.repo.listLeads();
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
    return this.repo.createLead({
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
    return this.repo.updateLead({
      id: input.entityId,
      title: input.title,
      email: input.email,
      phone: input.phone,
      status: input.status,
      source: input.source,
      score: input.score,
    });
  }
}