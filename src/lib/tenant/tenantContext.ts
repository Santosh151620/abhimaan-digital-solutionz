export interface TenantContext {
  organizationId: string;
  userId?: string;
  userEmail?: string;
  role?: string;
}

/**
 * TenantContextManager
 *
 * Central tenant context used by repositories and services.
 *
 * Current:
 * - Manual injection
 *
 * Future:
 * - Supabase Auth
 * - NextAuth
 * - Middleware
 * - JWT Claims
 *
 * The public API intentionally remains stable so the rest of
 * the CRM never needs to change.
 */

const DEFAULT_TENANT: TenantContext = {
  organizationId: "demo-org",
};

let currentTenant: TenantContext | null = null;

export const TenantContextManager = {
  /**
   * Set current tenant context.
   */
  set(context: TenantContext): void {
    currentTenant = {
      ...DEFAULT_TENANT,
      ...context,
    };
  },

  /**
   * Returns current tenant.
   *
   * During development, automatically falls back to
   * the demo tenant instead of crashing the application.
   *
   * In production this can later be replaced with
   * authentication-based resolution.
   */
  get(): TenantContext {
    return currentTenant ?? DEFAULT_TENANT;
  },

  /**
   * Clears the current request context.
   */
  clear(): void {
    currentTenant = null;
  },

  /**
   * Indicates whether a tenant has been explicitly set.
   */
  hasTenant(): boolean {
    return currentTenant !== null;
  },
};