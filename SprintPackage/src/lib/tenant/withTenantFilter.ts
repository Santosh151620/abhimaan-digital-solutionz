import { TenantContextManager } from "./tenantContext";

export function withTenantFilter(): { organizationId: string } {
  const tenant = TenantContextManager.require();

  return {
    organizationId: tenant.organizationId,
  };
}

export function requireTenantFilter(): { organizationId: string } {
  const tenant = TenantContextManager.get();

  if (!tenant?.organizationId) {
    throw new Error("Tenant context missing: organizationId required");
  }

  return {
    organizationId: tenant.organizationId,
  };
}

export function applyTenantFilter<T extends Record<string, unknown>>(
  query: T
): T & { organizationId: string } {
  return {
    ...query,
    ...withTenantFilter(),
  };
}
