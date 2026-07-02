/**
 * v5 MULTI-TENANT CORE LAYER
 */

export interface TenantContext {
  tenantId: string;
}

export function applyTenantFilter<T extends { tenant_id?: string }>(
  items: T[],
  tenantId: string
): T[] {
  return items.filter((item) => item.tenant_id === tenantId);
}