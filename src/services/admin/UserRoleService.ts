/**
 * ============================================================================
 * ADS ADMIN USER ROLE SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for user/role assignments.
 *
 * Responsibilities:
 *
 * - Validate user and role identifiers.
 * - Normalize role assignment input.
 * - Prevent duplicate active assignments.
 * - Ensure primary roles are assigned before promotion.
 * - Delegate persistence to IUserRoleRepository.
 *
 * IMPORTANT:
 *
 * Role persistence remains inside the repository layer.
 * This service does not access Supabase directly and does not bypass
 * authorization or RLS.
 * ============================================================================
 */

import type {
    UserRole,
} from "@/types/admin/UserRole";


import type {
    IUserRoleRepository,
} from "@/repositories/admin/UserRoleRepository";



/**
 * Canonical user-role business service.
 */
export class UserRoleService {


    constructor(
        private readonly repository:
            IUserRoleRepository,
    ) {}



    /**
     * Return all role assignments for a user.
     */
    async rolesForUser(
        userId: string,
    ):
        Promise<UserRole[]> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        return this.repository.rolesForUser(
            normalizedUserId,
        );

    }



    /**
     * Assign a role to a user.
     *
     * Repeated assignment of an already-active role is intentionally
     * idempotent.
     */
    async assignRole(
        userId: string,
        roleId: string,
    ):
        Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        const existing =
            await this.repository.rolesForUser(
                normalizedUserId,
            );


        const alreadyAssigned =
            existing.some(
                assignment =>
                    assignment.roleId ===
                        normalizedRoleId &&
                    assignment.isActive,
            );


        if (
            alreadyAssigned
        ) {

            return;

        }


        await this.repository.assignRole(
            normalizedUserId,
            normalizedRoleId,
        );

    }



    /**
     * Remove a role assignment from a user.
     */
    async removeRole(
        userId: string,
        roleId: string,
    ):
        Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        await this.repository.removeRole(
            normalizedUserId,
            normalizedRoleId,
        );

    }



    /**
     * Replace the complete role assignment set for a user.
     *
     * Role identifiers are trimmed, invalid non-string values are discarded,
     * and duplicate identifiers are removed before reaching persistence.
     */
    async replaceRoles(
        userId: string,
        roleIds: string[],
    ):
        Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        if (
            !Array.isArray(
                roleIds,
            )
        ) {

            throw new Error(
                "Role ids are required.",
            );

        }


        const normalizedRoleIds =
            roleIds
                .filter(
                    (
                        roleId,
                    ): roleId is string =>
                        typeof roleId ===
                        "string",
                )
                .map(
                    roleId =>
                        roleId.trim(),
                )
                .filter(
                    roleId =>
                        roleId.length > 0,
                );


        const uniqueRoleIds =
            Array.from(
                new Set(
                    normalizedRoleIds,
                ),
            );


        await this.repository.replaceRoles(
            normalizedUserId,
            uniqueRoleIds,
        );

    }



    /**
     * Set the user's primary role.
     *
     * A role must already be actively assigned before it can become primary.
     */
    async setPrimaryRole(
        userId: string,
        roleId: string,
    ):
        Promise<void> {

        const normalizedUserId =
            this.validateId(
                userId,
                "User",
            );


        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        const roles =
            await this.repository.rolesForUser(
                normalizedUserId,
            );


        const assigned =
            roles.some(
                role =>
                    role.roleId ===
                        normalizedRoleId &&
                    role.isActive,
            );


        if (
            !assigned
        ) {

            throw new Error(
                "Cannot set primary role before assignment.",
            );

        }


        await this.repository.setPrimaryRole(
            normalizedUserId,
            normalizedRoleId,
        );

    }



    /**
     * Validate and normalize an entity identifier.
     */
    private validateId(
        id: string,
        entity: string,
    ): string {

        const normalizedId =
            typeof id === "string"
                ? id.trim()
                : "";


        if (
            !normalizedId
        ) {

            throw new Error(
                `${entity} id is required.`,
            );

        }


        return normalizedId;

    }

}