import { LeadsRepository } from '../repositories/LeadsRepository';
import { LeadEntity } from '../types/lead.entity';

export class LeadsService {
  private repo: LeadsRepository;

  constructor() {
  this.repo = new LeadsRepository();
}

  async getLead(id: string) {
    return this.repo.findById(id);
  }

  async listLeads() {
    return [] as LeadEntity[]; // temporary until BaseRepository list added
  }

  async upsertLead(input: any) {
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

  async updateLead(input: any) {
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