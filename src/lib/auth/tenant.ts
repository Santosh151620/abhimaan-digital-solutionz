import type { UserSession } from "./rbac";


/**
 * Ensures data isolation per tenant (SaaS core rule)
 */
export function assertTenantAccess(
    user: UserSession,
    tenantId: string,
) {

    /**
     * Platform administrators
     * can cross tenant boundaries
     */
    if (
        user.role === "SUPER_ADMIN"
    ) {

        return true;

    }


    /**
     * Normal users must stay
     * inside their tenant
     */
    if (
        user.tenantId !== tenantId
    ) {

        throw new Error(
            "Tenant access denied",
        );

    }


    return true;

}