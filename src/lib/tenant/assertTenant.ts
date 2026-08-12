import { TenantContextManager } from "./tenantContext";

/**
 * Throws if organization context is unavailable.
 *
 * Intended for:
 * - Services
 * - Repositories
 * - API handlers
 * - Background jobs
 */
function assertOrganization(): string {
  const tenant = TenantContextManager.require();

  if (!tenant.organizationId?.trim()) {
    throw new Error("Organization context is missing.");
  }

  return tenant.organizationId;
}

/**
 * Preferred accessor.
 */
export function getOrganizationId(): string {
  return assertOrganization();
}

/**
 * Backward compatibility.
 * Remove after all callers migrate.
 */
const assertTenant = assertOrganization;

/**
 * @deprecated Use getOrganizationId()
 */
const getTenantId = getOrganizationId;

/**
 * Returns the full immutable organization context.
 */
function getTenant() {
  return TenantContextManager.require();
}






