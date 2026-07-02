import { TenantContextManager } from "./tenantContext";

/**
 * Generic tenant filter builder for repository/query layer.
 *
 * Goal:
 * - Enforce organization-level isolation (multi-tenant safety)
 * - Keep DB-layer integration agnostic (Prisma / Supabase / SQL / ORM)
 *
 * Usage examples:
 *
 * const filter = withTenantFilter();
 * db.project.findMany({ where: { ...filter, status: "active" } });
 *
 * OR:
 * const where = { ...withTenantFilter(), status: "active" };
 */
export function withTenantFilter() {
  const tenant = TenantContextManager.require();

  return {
    organizationId: tenant.organizationId,
  };
}

/**
 * Strict variant for repositories that require explicit safety check.
 * Throws early if tenant context is missing.
 */
export function requireTenantFilter() {
  const tenant = TenantContextManager.get();

  if (!tenant?.organizationId) {
    throw new Error("Tenant context missing: organizationId required");
  }

  return {
    organizationId: tenant.organizationId,
  };
}

/**
 * Utility to merge tenant filter into an existing query object.
 *
 * Keeps query composition clean and explicit.
 */
export function applyTenantFilter<T extends Record<string, any>>(query: T): T {
  return {
    ...query,
    ...withTenantFilter(),
  };
}