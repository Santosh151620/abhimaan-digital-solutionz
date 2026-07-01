import { LeadEntity } from '../types/lead.entity';

/**
 * DOMAIN VALIDATION ADAPTER
 */

export function validateLeadEntity(entity: LeadEntity): string[] {
  const errors: string[] = [];

  if (!entity.entityId) errors.push('entityId is required');
  if (!entity.title) errors.push('title is required');
  if (!entity.entityType) errors.push('entityType is required');

  if (entity.score !== undefined && entity.score < 0) {
    errors.push('score cannot be negative');
  }

  return errors;
}