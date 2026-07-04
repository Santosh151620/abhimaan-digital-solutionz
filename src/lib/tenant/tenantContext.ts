import { AsyncLocalStorage } from "node:async_hooks";

export interface TenantContext {
  /**
   * Primary tenant / organization identifier.* This is the only tenant identifier repositories should use.   */
  organizationId: string;
  userId?: string;
  userEmail?: string;
  role?: string;
  permissions?: readonly string[];
  locale?: string;
  timezone?: string;
}

const storage = new AsyncLocalStorage<TenantContext>();

const isProduction = process.env.NODE_ENV === "production";

/**
 * Central request-scoped tenant manager.
 *
 * Public API is intentionally stable.
 *
 * Future authentication providers can populate the context without
 * requiring repository/service changes.
 *
 * Supported future providers:
 * - Supabase Auth
 * - JWT
 * - Clerk
 * - NextAuth
 * - Organization Switching
 * - Background Workers
 */
export const TenantContextManager = {
  /**
   * Starts a new request scope.
   *
   * Must be called once per request by the API guard.
   */
  run<T>(context: TenantContext, callback: () => T): T {
    if (!context.organizationId?.trim()) {
      throw new Error("Tenant organizationId is required.");
    }

    const frozenContext = Object.freeze({
      ...context,
    });

    return storage.run(frozenContext, callback);
  },

  /**
   * Backward compatibility.
   *
   * Existing code using set() will continue to compile,
   * but production code should use run().
   */
  set(): never {
    throw new Error(
      "TenantContextManager.set() is no longer supported. Use TenantContextManager.run() from the API guard."
    );
  },

  /**
   * Returns current request tenant.
   */
  get(): Readonly<TenantContext> {
    const context = storage.getStore();

    if (context) {
      return context;
    }

    if (!isProduction) {
      return Object.freeze({
        organizationId: "development",
      });
    }

    throw new Error(
      "Tenant context unavailable. Ensure API Guard initializes TenantContextManager.run()."
    );
  },

  /**
   * Repository-safe accessor.
   *
   * Alias kept for readability.
   */
  require(): Readonly<TenantContext> {
    return this.get();
  },

  /**
   * Indicates whether current request has tenant context.
   */
  hasTenant(): boolean {
    return storage.getStore() !== undefined;
  },

  /**
   * AsyncLocalStorage automatically cleans itself after request completion.
   *
   * Retained only for backward compatibility.
   */
  clear(): void {
    // Intentionally empty.
  },
};

export type ReadonlyTenantContext = Readonly<TenantContext>;