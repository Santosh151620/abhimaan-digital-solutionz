import { LeadEntity } from '../types/lead.entity';

/**
 * PERMISSION ADAPTER (entity-level security layer)
 */

export type LeadPermission = 'read' | 'write' | 'delete';

export function getLeadPermissions(_lead: LeadEntity, role: string): LeadPermission[] {
  if (role === 'admin') return ['read', 'write', 'delete'];
  if (role === 'manager') return ['read', 'write'];
  return ['read'];
}

export function canEditLead(_lead: LeadEntity, role: string): boolean {
  return role === 'admin' || role === 'manager';
}
