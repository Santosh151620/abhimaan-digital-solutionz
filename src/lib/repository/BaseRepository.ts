import { assertTenant } from "@/lib/tenant/assertTenant";

/**
 * ------------------------------------------------------------------
 * BaseRepository
 * ------------------------------------------------------------------
 *
 * Every CRM repository should inherit from this class.
 *
 * Responsibilities:
 *
 * ✓ Multi-tenant enforcement
 * ✓ Shared CRUD helpers
 * ✓ Future RBAC integration
 * ✓ Future Audit logging
 * ✓ Future Soft Delete
 * ✓ Future Event publishing
 *
 * Business repositories should NEVER access tenant context directly.
 * They should always extend BaseRepository.
 */

export abstract class BaseRepository {
  /**
   * Current organization.
   */
  protected get organizationId(): string {
    return assertTenant();
  }

  /**
   * Inject tenant into any query object.
   */
  protected withTenant<T extends Record<string, unknown>>(query?: T) {
    return {
      ...(query ?? {}),
      organizationId: this.organizationId,
    };
  }

  /**
   * Inject tenant into entity before insert.
   */
  protected withCreateTenant<T extends Record<string, unknown>>(entity: T) {
    return {
      ...entity,
      organizationId: this.organizationId,
    };
  }

  /**
   * Repository-safe ownership validation.
   *
   * Can later validate ownership,
   * permissions,
   * organization switching etc.
   */
  protected validateOwnership(
    organizationId: string
  ): void {
    if (organizationId !== this.organizationId) {
      throw new Error(
        "Cross-tenant access denied."
      );
    }
  }
}