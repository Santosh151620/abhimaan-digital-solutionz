export interface TenantContext {
  organizationId: string;
}

/**
 * TenantContext
 *
 * This will later be derived from:
 * - Supabase Auth session OR
 * - NextAuth session OR
 * - Middleware headers
 *
 * For now, it is injected manually.
 */

let currentTenant: TenantContext | null = null;

export const TenantContextManager = {
  set(context: TenantContext) {
    currentTenant = context;
  },

  get(): TenantContext {
    if (!currentTenant) {
      throw new Error(
        "[TenantContext] No tenant context set. Cannot proceed without organization scope."
      );
    }
    return currentTenant;
  },

  clear() {
    currentTenant = null;
  },
};