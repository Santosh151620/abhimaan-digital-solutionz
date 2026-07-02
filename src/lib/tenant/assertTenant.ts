import { TenantContextManager } from "./tenantContext";

/**
 * Throws if tenant context is unavailable.
 *
 * Intended for:
 * - Services
 * - Repositories
 * - API handlers
 * - Background jobs
 */
export function assertTenant(): string {
  const tenant = TenantContextManager.require();

  if (!tenant.organizationId?.trim()) {
    throw new Error("Tenant context is missing.");
  }

  return tenant.organizationId;
}

/**
 * Returns the current tenant id.
 *
 * Alias kept for readability in repositories.
 */
export function getTenantId(): string {
  return assertTenant();
}

/**
 * Convenience helper when code needs the full immutable context.
 */
export function getTenant() {
  return TenantContextManager.require();
}