import type { UserSession } from "./rbac";

/**
 * Ensures data isolation per tenant (SaaS core rule)
 */
export function assertTenantAccess(
  user: UserSession,
  tenantId: string
) {
  if (user.role === "SUPER_ADMIN") return true;

  if (user.tenantId !== tenantId) {
    throw new Error("TENANT_ACCESS_DENIED");
  }

  return true;
}
