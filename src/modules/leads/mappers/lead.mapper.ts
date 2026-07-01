import {
  LeadEntity,
  LEAD_ENTITY_TYPE,
} from '../types/lead.entity';

export interface LeadDTO {
  entityType: string;
  entityId: string;

  title: string;
  email?: string;
  phone?: string;

  status: string;
  source?: string;
  score?: number;

  createdAt: string;
  updatedAt: string;
}

export function toLeadEntity(dto: LeadDTO): LeadEntity {
  return {
    entityType: LEAD_ENTITY_TYPE,,
    entityId: dto.entityId,
    title: dto.title,
    email: dto.email,
    phone: dto.phone,
    status: dto.status as LeadEntity['status'],
    source: dto.source,
    score: dto.score,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function toLeadDTO(entity: LeadEntity): LeadDTO {
  return {
    entityType: entity.entityType,
    entityId: entity.entityId,
    title: entity.title,
    email: entity.email,
    phone: entity.phone,
    status: entity.status,
    source: entity.source,
    score: entity.score,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}