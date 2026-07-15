import { LeadEntity } from '../types/lead.entity';

/**
 * CONTRACT LAYER
 * Ensures strict compatibility with BaseRepository + Entity Engine
 */

export interface LeadRepositoryContract {
  create(input: LeadEntity): Promise<LeadEntity>;
  update(input: LeadEntity): Promise<LeadEntity>;
  findByEntity(entityId: string): Promise<LeadEntity | null>;
  findAll(): Promise<LeadEntity[]>;
}

export interface LeadServiceContract {
  createLead(input: Omit<LeadEntity, 'createdAt' | 'updatedAt'>): Promise<LeadEntity>;
  updateLead(input: Partial<LeadEntity> & { entityId: string }): Promise<LeadEntity>;
  getLead(entityId: string): Promise<LeadEntity | null>;
  listLeads(): Promise<LeadEntity[]>;
}





